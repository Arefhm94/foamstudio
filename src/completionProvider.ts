// completionProvider.ts
import * as vscode from 'vscode';

export class OpenFOAMCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const completions: vscode.CompletionItem[] = [];

        // Basic OpenFOAM keywords
        const keywords = [
            'application', 'startFrom', 'startTime', 'endTime', 'deltaT',
            'writeControl', 'writeInterval', 'writeFormat', 'writePrecision',
            'ddtSchemes', 'gradSchemes', 'divSchemes', 'laplacianSchemes',
            'interpolationSchemes', 'snGradSchemes', 'solvers', 'PISO', 'SIMPLE',
            'PIMPLE', 'nOuterCorrectors', 'nCorrectors', 'nNonOrthogonalCorrectors'
        ];

        keywords.forEach(keyword => {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
            item.detail = `OpenFOAM keyword: ${keyword}`;
            completions.push(item);
        });

        return completions;
    }
}