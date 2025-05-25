import * as vscode from 'vscode';

export class OpenFOAMHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return;
        }

        const word = document.getText(wordRange);
        const documentation = this.getDocumentation(word);

        if (documentation) {
            return new vscode.Hover(documentation, wordRange);
        }
    }

    private getDocumentation(word: string): vscode.MarkdownString | undefined {
        const docs: { [key: string]: string } = {
            'application': 'Specifies the OpenFOAM application/solver to use',
            'startFrom': 'Specifies how to start the simulation (startTime, firstTime, latestTime)',
            'startTime': 'Start time for the simulation',
            'endTime': 'End time for the simulation',
            'deltaT': 'Time step size',
            'writeControl': 'Controls when results are written (timeStep, runTime, adjustableRunTime)',
            'writeInterval': 'Interval for writing results',
            'PCG': 'Preconditioned Conjugate Gradient solver for symmetric matrices',
            'BICCG': 'Bi-Conjugate Gradient solver for asymmetric matrices',
            'GAMG': 'Geometric Algebraic Multi-Grid solver',
            'Euler': 'First-order implicit time scheme',
            'backward': 'Second-order implicit time scheme',
            'Gauss': 'Gauss integration scheme',
            'linear': 'Linear interpolation scheme'
        };

        if (docs[word]) {
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**${word}**\n\n${docs[word]}`);
            return markdown;
        }
    }
}