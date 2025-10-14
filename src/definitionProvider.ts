import * as vscode from 'vscode';
import { parseOpenFOAMFile, OpenFOAMNode } from './openfoamParser';

export class OpenFOAMDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return undefined;
        }

        const word = document.getText(wordRange);
        
        // Parse the document to find definitions
        const nodes = parseOpenFOAMFile(document);
        const definition = this.findDefinition(nodes, word);
        
        if (definition) {
            return new vscode.Location(
                document.uri,
                new vscode.Position(definition.line, 0)
            );
        }
        
        return undefined;
    }
    
    private findDefinition(nodes: OpenFOAMNode[], searchTerm: string): OpenFOAMNode | undefined {
        for (const node of nodes) {
            if (node.label === searchTerm) {
                return node;
            }
            
            if (node.children) {
                const found = this.findDefinition(node.children, searchTerm);
                if (found) {
                    return found;
                }
            }
        }
        
        return undefined;
    }
}

export class OpenFOAMReferenceProvider implements vscode.ReferenceProvider {
    provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Location[]> {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return [];
        }

        const word = document.getText(wordRange);
        const references: vscode.Location[] = [];
        
        // Search in current document
        const text = document.getText();
        const lines = text.split('\n');
        
        lines.forEach((line, index) => {
            const regex = new RegExp(`\\b${word}\\b`, 'g');
            let match;
            
            while ((match = regex.exec(line)) !== null) {
                references.push(new vscode.Location(
                    document.uri,
                    new vscode.Range(
                        index, match.index,
                        index, match.index + word.length
                    )
                ));
            }
        });
        
        return references;
    }
}
