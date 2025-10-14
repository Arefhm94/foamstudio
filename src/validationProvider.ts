import * as vscode from 'vscode';
import { findKeyword } from './openfoamKeywords';

export class OpenFOAMValidationProvider implements vscode.Disposable {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private documentChangeListener?: vscode.Disposable;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('openfoam');
        
        // Validate on document change
        this.documentChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
            if (this.isOpenFOAMFile(event.document)) {
                this.validateDocument(event.document);
            }
        });
        
        // Validate on document open
        vscode.workspace.onDidOpenTextDocument(document => {
            if (this.isOpenFOAMFile(document)) {
                this.validateDocument(document);
            }
        });
        
        // Validate all open documents
        vscode.workspace.textDocuments.forEach(document => {
            if (this.isOpenFOAMFile(document)) {
                this.validateDocument(document);
            }
        });
    }

    private isOpenFOAMFile(document: vscode.TextDocument): boolean {
        return document.languageId === 'openfoam' || 
               document.fileName.endsWith('.dict') ||
               ['controlDict', 'fvSchemes', 'fvSolution', 'decomposeParDict', 'fvOptions'].some(
                   name => document.fileName.endsWith(name)
               );
    }

    validateDocument(document: vscode.TextDocument) {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const lines = text.split('\n');
        
        let braceStack: Array<{line: number, char: number}> = [];
        let inBlockComment = false;
        let inFoamFileHeader = false;
        
        // Known valid solver names
        const validSolvers = ['PCG', 'PBiCG', 'PBiCGStab', 'smoothSolver', 'GAMG', 'diagonal', 'AMG'];
        const validPreconditioners = ['DIC', 'FDIC', 'DILU', 'diagonal', 'none'];
        const validSmoothers = ['GaussSeidel', 'symGaussSeidel', 'DICGaussSeidel', 'DILUGaussSeidel', 'ILU'];
        const validTimeSchemes = ['Euler', 'backward', 'CrankNicolson', 'steadyState', 'localEuler'];

        lines.forEach((line, lineIndex) => {
            const trimmed = line.trim();
            const originalLine = line;
            
            // Skip empty lines
            if (!trimmed) {
                return;
            }

            // Handle block comments
            if (trimmed.includes('/*')) {
                inBlockComment = true;
                // Check for FoamFile header
                if (trimmed.includes('C++')) {
                    inFoamFileHeader = true;
                }
            }
            if (trimmed.includes('*/')) {
                inBlockComment = false;
                if (inFoamFileHeader) {
                    inFoamFileHeader = false;
                }
                return;
            }
            if (inBlockComment || trimmed.startsWith('//')) {
                return;
            }

            // Check brace matching
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '{') {
                    braceStack.push({line: lineIndex, char: i});
                } else if (line[i] === '}') {
                    if (braceStack.length === 0) {
                        diagnostics.push(new vscode.Diagnostic(
                            new vscode.Range(lineIndex, i, lineIndex, i + 1),
                            'Unmatched closing brace',
                            vscode.DiagnosticSeverity.Error
                        ));
                    } else {
                        braceStack.pop();
                    }
                }
            }

            // Check for potential syntax issues
            // Note: In OpenFOAM, semicolons are optional in many contexts
            const hasValue = trimmed.match(/^\w+\s+.+/);
            const endsWithSemicolon = trimmed.endsWith(';');
            const endsWithBrace = trimmed.endsWith('{') || trimmed.endsWith('}');
            const isBlockStart = trimmed.match(/^\w+\s*$/);
            
            // Only warn about missing semicolons for simple key-value pairs
            if (hasValue && !endsWithSemicolon && !endsWithBrace && !isBlockStart && 
                !trimmed.startsWith('#') && !trimmed.includes('(')) {
                
                // Check if it looks like a key-value pair that should have a semicolon
                const kvPattern = /^\w+\s+[\w\-\.]+$/;
                if (kvPattern.test(trimmed)) {
                    const lastCharIndex = originalLine.lastIndexOf(trimmed[trimmed.length - 1]);
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(lineIndex, lastCharIndex + 1, lineIndex, lastCharIndex + 1),
                        'Consider adding a semicolon',
                        vscode.DiagnosticSeverity.Hint
                    ));
                }
            }

            // Validate solver specifications
            const solverMatch = trimmed.match(/^\s*solver\s+(\w+);?/);
            if (solverMatch) {
                const solverName = solverMatch[1];
                if (!validSolvers.includes(solverName)) {
                    const startPos = line.indexOf(solverName);
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(lineIndex, startPos, lineIndex, startPos + solverName.length),
                        `Unknown solver: ${solverName}. Valid options: ${validSolvers.join(', ')}`,
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }

            // Validate preconditioner specifications
            const precondMatch = trimmed.match(/^\s*preconditioner\s+(\w+);?/);
            if (precondMatch) {
                const precondName = precondMatch[1];
                if (!validPreconditioners.includes(precondName)) {
                    const startPos = line.indexOf(precondName);
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(lineIndex, startPos, lineIndex, startPos + precondName.length),
                        `Unknown preconditioner: ${precondName}. Valid options: ${validPreconditioners.join(', ')}`,
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }

            // Validate smoother specifications
            const smootherMatch = trimmed.match(/^\s*smoother\s+(\w+);?/);
            if (smootherMatch) {
                const smootherName = smootherMatch[1];
                if (!validSmoothers.includes(smootherName)) {
                    const startPos = line.indexOf(smootherName);
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(lineIndex, startPos, lineIndex, startPos + smootherName.length),
                        `Unknown smoother: ${smootherName}. Valid options: ${validSmoothers.join(', ')}`,
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }

            // Validate time scheme in ddtSchemes
            const ddtMatch = trimmed.match(/^\s*default\s+(\w+);?/);
            if (ddtMatch && this.isInBlock(document, lineIndex, 'ddtSchemes')) {
                const schemeName = ddtMatch[1];
                if (!validTimeSchemes.includes(schemeName)) {
                    const startPos = line.indexOf(schemeName);
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(lineIndex, startPos, lineIndex, startPos + schemeName.length),
                        `Unknown time scheme: ${schemeName}. Valid options: ${validTimeSchemes.join(', ')}`,
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }

            // Check for malformed vectors/lists
            const openParens = (line.match(/\(/g) || []).length;
            const closeParens = (line.match(/\)/g) || []).length;
            if (openParens !== closeParens) {
                diagnostics.push(new vscode.Diagnostic(
                    new vscode.Range(lineIndex, 0, lineIndex, line.length),
                    'Mismatched parentheses',
                    vscode.DiagnosticSeverity.Warning
                ));
            }

            // Check for common typos in keywords
            this.checkKeywordTypos(line, lineIndex, diagnostics);
        });

        // Check for unmatched opening braces
        braceStack.forEach(brace => {
            diagnostics.push(new vscode.Diagnostic(
                new vscode.Range(brace.line, brace.char, brace.line, brace.char + 1),
                'Unmatched opening brace',
                vscode.DiagnosticSeverity.Error
            ));
        });

        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    private isInBlock(document: vscode.TextDocument, currentLine: number, blockName: string): boolean {
        const text = document.getText(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(currentLine, 0)));
        const lines = text.split('\n');
        
        let inTargetBlock = false;
        let braceDepth = 0;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
                continue;
            }
            
            if (trimmed === blockName || trimmed === `${blockName}`) {
                inTargetBlock = true;
            }
            
            if (trimmed.includes('{')) {
                if (!inTargetBlock) {
                    braceDepth++;
                }
            }
            
            if (trimmed.includes('}')) {
                if (inTargetBlock && braceDepth === 0) {
                    inTargetBlock = false;
                } else {
                    braceDepth = Math.max(0, braceDepth - 1);
                }
            }
        }
        
        return inTargetBlock;
    }

    private checkKeywordTypos(line: string, lineIndex: number, diagnostics: vscode.Diagnostic[]) {
        // Common typos and their corrections
        const typoMap: { [key: string]: string } = {
            'aplication': 'application',
            'writeContol': 'writeControl',
            'writeInterwal': 'writeInterval',
            'deltat': 'deltaT',
            'startime': 'startTime',
            'endtime': 'endTime',
            'ddtshemes': 'ddtSchemes',
            'gradshemes': 'gradSchemes',
            'divshemes': 'divSchemes',
            'laplacianshemes': 'laplacianSchemes',
            'slover': 'solver',
            'tolerence': 'tolerance',
            'preconditionner': 'preconditioner',
            'smooter': 'smoother'
        };

        Object.entries(typoMap).forEach(([typo, correction]) => {
            const regex = new RegExp(`\\b${typo}\\b`, 'gi');
            let match;
            while ((match = regex.exec(line)) !== null) {
                diagnostics.push(new vscode.Diagnostic(
                    new vscode.Range(lineIndex, match.index, lineIndex, match.index + typo.length),
                    `Did you mean '${correction}'?`,
                    vscode.DiagnosticSeverity.Information
                ));
            }
        });
    }

    dispose() {
        this.diagnosticCollection.dispose();
        if (this.documentChangeListener) {
            this.documentChangeListener.dispose();
        }
    }
}