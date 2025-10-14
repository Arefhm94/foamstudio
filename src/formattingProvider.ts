import * as vscode from 'vscode';

export class OpenFOAMFormattingProvider implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        const edits: vscode.TextEdit[] = [];
        const text = document.getText();
        const lines = text.split('\n');
        
        let indentLevel = 0;
        const indentChar = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
        const formattedLines: string[] = [];
        let inBlockComment = false;
        let inFoamFileHeader = false;
        
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            
            // Preserve empty lines
            if (trimmed === '') {
                formattedLines.push('');
                return;
            }
            
            // Handle block comments - preserve formatting
            if (trimmed.includes('/*')) {
                inBlockComment = true;
                if (trimmed.includes('C++')) {
                    inFoamFileHeader = true;
                }
                formattedLines.push(line);
                return;
            }
            
            if (trimmed.includes('*/')) {
                inBlockComment = false;
                formattedLines.push(line);
                if (inFoamFileHeader) {
                    inFoamFileHeader = false;
                }
                return;
            }
            
            if (inBlockComment || inFoamFileHeader) {
                formattedLines.push(line);
                return;
            }
            
            // Handle line comments
            if (trimmed.startsWith('//')) {
                // Preserve comment indentation relative to code
                formattedLines.push(indentChar.repeat(indentLevel) + trimmed);
                return;
            }
            
            // Handle preprocessor directives
            if (trimmed.startsWith('#')) {
                formattedLines.push(trimmed);
                return;
            }
            
            // Decrease indent for closing brace
            if (trimmed === '}' || trimmed === '};') {
                indentLevel = Math.max(0, indentLevel - 1);
                formattedLines.push(indentChar.repeat(indentLevel) + trimmed);
                return;
            }
            
            // Current line indentation
            let currentIndent = indentLevel;
            
            // Handle lines with opening brace at the end
            if (trimmed.endsWith('{')) {
                formattedLines.push(indentChar.repeat(currentIndent) + trimmed);
                indentLevel++;
                return;
            }
            
            // Handle standalone opening brace
            if (trimmed === '{') {
                formattedLines.push(indentChar.repeat(currentIndent) + trimmed);
                indentLevel++;
                return;
            }
            
            // Format key-value pairs with consistent spacing
            const kvMatch = trimmed.match(/^(\w+)\s+(.+?)(\s*;?\s*)$/);
            if (kvMatch) {
                const [, key, value, terminator] = kvMatch;
                // Align values with tabs/spaces
                const spacing = '\t\t';
                const cleanTerminator = terminator.trim() || ';';
                formattedLines.push(indentChar.repeat(currentIndent) + key + spacing + value + cleanTerminator);
                return;
            }
            
            // Default: apply current indentation
            formattedLines.push(indentChar.repeat(currentIndent) + trimmed);
        });
        
        // Create a single edit that replaces the entire document
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );
        
        edits.push(vscode.TextEdit.replace(fullRange, formattedLines.join('\n')));
        
        return edits;
    }
}

export class OpenFOAMRangeFormattingProvider implements vscode.DocumentRangeFormattingEditProvider {
    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        // For range formatting, we'll format the selected lines
        const edits: vscode.TextEdit[] = [];
        const indentChar = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
        
        // Get the initial indentation level from the first line
        const firstLine = document.lineAt(range.start.line);
        const initialIndent = this.getIndentLevel(firstLine.text, options);
        
        let indentLevel = initialIndent;
        const formattedLines: string[] = [];
        
        for (let i = range.start.line; i <= range.end.line; i++) {
            const line = document.lineAt(i);
            const trimmed = line.text.trim();
            
            if (trimmed === '') {
                formattedLines.push('');
                continue;
            }
            
            // Handle closing brace
            if (trimmed === '}' || trimmed === '};') {
                indentLevel = Math.max(initialIndent, indentLevel - 1);
                formattedLines.push(indentChar.repeat(indentLevel) + trimmed);
                continue;
            }
            
            // Apply current indentation
            formattedLines.push(indentChar.repeat(indentLevel) + trimmed);
            
            // Increase indent for lines ending with opening brace
            if (trimmed.endsWith('{')) {
                indentLevel++;
            }
        }
        
        const rangeToReplace = new vscode.Range(
            range.start.line, 0,
            range.end.line, document.lineAt(range.end.line).text.length
        );
        
        edits.push(vscode.TextEdit.replace(rangeToReplace, formattedLines.join('\n')));
        
        return edits;
    }
    
    private getIndentLevel(line: string, options: vscode.FormattingOptions): number {
        let count = 0;
        for (const char of line) {
            if (char === ' ') {
                count++;
            } else if (char === '\t') {
                count += options.tabSize;
            } else {
                break;
            }
        }
        return Math.floor(count / options.tabSize);
    }
}
