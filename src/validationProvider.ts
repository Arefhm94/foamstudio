import * as vscode from 'vscode';

export class OpenFOAMValidationProvider implements vscode.Disposable {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('openfoam');
    }

    validateDocument(document: vscode.TextDocument) {
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const lines = text.split('\n');
        
        let braceStack: number[] = [];
        let inComment = false;

        lines.forEach((line, lineIndex) => {
            const trimmed = line.trim();
            
            // Skip empty lines
            if (!trimmed) return;

            // Handle multi-line comments
            if (trimmed.includes('/*')) {
                inComment = true;
            }
            if (trimmed.includes('*/')) {
                inComment = false;
                return;
            }
            if (inComment || trimmed.startsWith('//')) {
                return;
            }

            // Check brace matching
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '{') {
                    braceStack.push(lineIndex);
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

            // Check for missing semicolons in key-value pairs
            if (trimmed.match(/^\w+\s+\w+/) && !trimmed.endsWith(';') && !trimmed.endsWith('{')) {
                const lastCharIndex = line.lastIndexOf(trimmed[trimmed.length - 1]);
                diagnostics.push(new vscode.Diagnostic(
                    new vscode.Range(lineIndex, lastCharIndex + 1, lineIndex, lastCharIndex + 1),
                    'Missing semicolon',
                    vscode.DiagnosticSeverity.Warning
                ));
            }
        });

        // Check for unmatched opening braces
        braceStack.forEach(lineIndex => {
            diagnostics.push(new vscode.Diagnostic(
                new vscode.Range(lineIndex, 0, lineIndex, lines[lineIndex].length),
                'Unmatched opening brace',
                vscode.DiagnosticSeverity.Error
            ));
        });

        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    dispose() {
        this.diagnosticCollection.dispose();
    }
}