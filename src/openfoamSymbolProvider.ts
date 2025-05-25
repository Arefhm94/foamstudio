import * as vscode from 'vscode';
import { parseOpenFOAMFile, OpenFOAMNode } from './openfoamParser';

export class OpenFOAMSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        const nodes = parseOpenFOAMFile(document);
        return this.convertToSymbols(nodes);
    }

    private convertToSymbols(nodes: OpenFOAMNode[]): vscode.DocumentSymbol[] {
        return nodes
            .filter(node => node.label.toLowerCase() !== 'foamfile') // Filter out FoamFile sections
            .map(node => {
                const symbol = new vscode.DocumentSymbol(
                    node.label,
                    node.value || '',
                    this.getSymbolKind(node.label, node.nodeType),
                    new vscode.Range(new vscode.Position(node.line, 0), new vscode.Position(node.line, node.label.length)),
                    new vscode.Range(new vscode.Position(node.line, 0), new vscode.Position(node.line, node.label.length))
                );

                if (node.children) {
                    symbol.children = this.convertToSymbols(node.children);
                }

                return symbol;
            });
    }

    private getSymbolKind(label: string, nodeType?: 'block' | 'key' | 'value' | 'keyValue' | 'comment' | 'header'): vscode.SymbolKind {
        // Use nodeType first if available
        if (nodeType) {
            switch (nodeType) {
                case 'block':
                    return vscode.SymbolKind.Namespace;
                case 'keyValue':
                    return vscode.SymbolKind.Property;
                case 'key':
                    return vscode.SymbolKind.Key;
                case 'value':
                    return vscode.SymbolKind.String;
                case 'comment':
                    return vscode.SymbolKind.String;
                case 'header':
                    return vscode.SymbolKind.File;
            }
        }
        
        // Fallback to label-based detection
        if (label.toLowerCase() === 'foamfile') {
            return vscode.SymbolKind.File;
        }
        
        // Detect scheme sections
        if (label.toLowerCase().includes('schemes')) {
            return vscode.SymbolKind.Class;
        }
        
        // Detect variables/settings with assignment
        if (label.includes('=')) {
            return vscode.SymbolKind.Variable;
        }
        
        // Detect nested blocks/dictionaries
        if (label.endsWith('{') || label.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) {
            return vscode.SymbolKind.Object;
        }
        
        return vscode.SymbolKind.Property;
    }
}
