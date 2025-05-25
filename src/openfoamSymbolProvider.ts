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
        return nodes.map(node => {
            const symbol = new vscode.DocumentSymbol(
                node.label,
                '',
                this.getSymbolKind(node.label),
                new vscode.Range(new vscode.Position(node.line, 0), new vscode.Position(node.line, node.label.length)),
                new vscode.Range(new vscode.Position(node.line, 0), new vscode.Position(node.line, node.label.length))
            );

            if (node.children) {
                symbol.children = this.convertToSymbols(node.children);
            }

            return symbol;
        });
    }

    private getSymbolKind(label: string): vscode.SymbolKind {
        if (label.includes('=')) {
            return vscode.SymbolKind.Key; // Represent keys
        }
        return vscode.SymbolKind.String; // Represent values or other elements
    }
}
