import * as vscode from 'vscode';

export class OpenFOAMCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];

        // Common OpenFOAM keywords
        const keywords = [
            'application', 'startFrom', 'startTime', 'stopAt', 'endTime',
            'deltaT', 'writeControl', 'writeInterval', 'purgeWrite',
            'writeFormat', 'writePrecision', 'writeCompression',
            'timeFormat', 'timePrecision', 'runTimeModifiable',
            'ddtSchemes', 'gradSchemes', 'divSchemes', 'laplacianSchemes',
            'interpolationSchemes', 'snGradSchemes', 'fluxRequired',
            'solvers', 'PISO', 'SIMPLE', 'PIMPLE', 'nOuterCorrectors',
            'nCorrectors', 'nNonOrthogonalCorrectors', 'residualControl'
        ];

        keywords.forEach(keyword => {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
            item.documentation = new vscode.MarkdownString(`OpenFOAM keyword: ${keyword}`);
            completions.push(item);
        });

        // Solvers
        const solvers = ['PCG', 'BICCG', 'smoothSolver', 'GAMG', 'diagonal'];
        solvers.forEach(solver => {
            const item = new vscode.CompletionItem(solver, vscode.CompletionItemKind.Class);
            item.documentation = new vscode.MarkdownString(`OpenFOAM solver: ${solver}`);
            completions.push(item);
        });

        // Schemes
        const schemes = ['Euler', 'backward', 'CrankNicolson', 'Gauss', 'linear', 'limitedLinear'];
        schemes.forEach(scheme => {
            const item = new vscode.CompletionItem(scheme, vscode.CompletionItemKind.Method);
            item.documentation = new vscode.MarkdownString(`OpenFOAM scheme: ${scheme}`);
            completions.push(item);
        });

        return completions;
    }
}