import * as vscode from 'vscode';

export class OpenFOAMInlayHintsProvider implements vscode.InlayHintsProvider {
    onDidChangeInlayHints?: vscode.Event<void>;

    provideInlayHints(
        document: vscode.TextDocument,
        range: vscode.Range,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.InlayHint[]> {
        const hints: vscode.InlayHint[] = [];

        for (let i = range.start.line; i <= range.end.line; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            // Hint for numerical values (show units)
            this.addNumericalHints(text, line, hints);

            // Hint for scheme types
            this.addSchemeHints(text, line, hints);

            // Hint for solver configurations
            this.addSolverHints(text, line, hints);

            // Hint for vector/tensor dimensions
            this.addDimensionHints(text, line, hints);
        }

        return hints;
    }

    private addNumericalHints(text: string, line: vscode.TextLine, hints: vscode.InlayHint[]): void {
        // Add unit hints for common parameters
        const patterns = [
            { regex: /deltaT\s+(\d+\.?\d*);/i, unit: 's', description: 'seconds' },
            { regex: /tolerance\s+(\d+\.?\d*e?-?\d*);/i, unit: '', description: 'convergence threshold' },
            { regex: /relTol\s+(\d+\.?\d*);/i, unit: '', description: 'relative tolerance' },
            { regex: /viscosity\s+(\d+\.?\d*e?-?\d*);/i, unit: 'm²/s', description: 'kinematic viscosity' },
            { regex: /density\s+(\d+\.?\d*);/i, unit: 'kg/m³', description: 'density' },
            { regex: /Cp\s+(\d+\.?\d*);/i, unit: 'J/kg·K', description: 'specific heat' },
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern.regex);
            if (match) {
                const valueMatch = match[1];
                const startPos = text.indexOf(valueMatch);
                if (startPos !== -1) {
                    const position = new vscode.Position(line.lineNumber, startPos + valueMatch.length);
                    const hint = new vscode.InlayHint(
                        position,
                        pattern.unit ? ` ${pattern.unit}` : ` /* ${pattern.description} */`,
                        vscode.InlayHintKind.Type
                    );
                    hint.tooltip = pattern.description;
                    hint.paddingLeft = true;
                    hints.push(hint);
                }
            }
        }
    }

    private addSchemeHints(text: string, line: vscode.TextLine, hints: vscode.InlayHint[]): void {
        // Detect scheme types and add order hints
        const schemePatterns = [
            { regex: /Gauss\s+linear(?!\w)/i, hint: '2nd order', tooltip: 'Second-order accurate scheme' },
            { regex: /Gauss\s+upwind(?!\w)/i, hint: '1st order', tooltip: 'First-order accurate scheme' },
            { regex: /Gauss\s+linearUpwind/i, hint: '2nd order', tooltip: 'Second-order upwind scheme' },
            { regex: /Gauss\s+QUICK/i, hint: '3rd order', tooltip: 'Third-order accurate scheme' },
            { regex: /Euler/i, hint: '1st order', tooltip: 'First-order time scheme' },
            { regex: /backward/i, hint: '2nd order', tooltip: 'Second-order time scheme' },
            { regex: /CrankNicolson/i, hint: '2nd order', tooltip: 'Second-order implicit time scheme' },
        ];

        for (const pattern of schemePatterns) {
            const match = text.match(pattern.regex);
            if (match && match.index !== undefined) {
                const position = new vscode.Position(line.lineNumber, match.index + match[0].length);
                const hint = new vscode.InlayHint(
                    position,
                    ` /* ${pattern.hint} */`,
                    vscode.InlayHintKind.Type
                );
                hint.tooltip = pattern.tooltip;
                hint.paddingLeft = true;
                hints.push(hint);
            }
        }
    }

    private addSolverHints(text: string, line: vscode.TextLine, hints: vscode.InlayHint[]): void {
        // Detect solver types and add hints about matrix type
        const solverPatterns = [
            { regex: /solver\s+PCG;/i, hint: 'symmetric', tooltip: 'For symmetric matrices (e.g., pressure)' },
            { regex: /solver\s+PBiCGStab;/i, hint: 'asymmetric', tooltip: 'For asymmetric matrices (e.g., velocity, turbulence)' },
            { regex: /solver\s+GAMG;/i, hint: 'multigrid', tooltip: 'Geometric-Algebraic Multi-Grid solver' },
            { regex: /solver\s+smoothSolver;/i, hint: 'iterative', tooltip: 'Iterative solver with smoother' },
        ];

        for (const pattern of solverPatterns) {
            const match = text.match(pattern.regex);
            if (match && match.index !== undefined) {
                const position = new vscode.Position(line.lineNumber, match.index + match[0].length);
                const hint = new vscode.InlayHint(
                    position,
                    ` /* ${pattern.hint} */`,
                    vscode.InlayHintKind.Type
                );
                hint.tooltip = pattern.tooltip;
                hint.paddingLeft = true;
                hints.push(hint);
            }
        }
    }

    private addDimensionHints(text: string, line: vscode.TextLine, hints: vscode.InlayHint[]): void {
        // Detect dimension sets and add physical meaning
        const dimensionPatterns: { [key: string]: { hint: string; tooltip: string } } = {
            '[0 0 0 0 0 0 0]': { hint: 'dimensionless', tooltip: 'No physical dimensions' },
            '[0 1 -1 0 0 0 0]': { hint: 'velocity [m/s]', tooltip: 'Dimensions of velocity' },
            '[0 2 -2 0 0 0 0]': { hint: 'pressure [m²/s²]', tooltip: 'Kinematic pressure dimensions' },
            '[1 -1 -2 0 0 0 0]': { hint: 'pressure [Pa]', tooltip: 'Static pressure dimensions' },
            '[0 2 -1 0 0 0 0]': { hint: 'kinematic viscosity [m²/s]', tooltip: 'Dimensions of kinematic viscosity' },
            '[0 2 -3 0 0 0 0]': { hint: 'turbulent dissipation [m²/s³]', tooltip: 'Dimensions of epsilon' },
            '[0 0 -1 0 0 0 0]': { hint: 'frequency [1/s]', tooltip: 'Dimensions of omega' },
        };

        for (const [dimension, info] of Object.entries(dimensionPatterns)) {
            const escapedDimension = dimension.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
            const regex = new RegExp(escapedDimension);
            const match = text.match(regex);
            
            if (match && match.index !== undefined) {
                const position = new vscode.Position(line.lineNumber, match.index + match[0].length);
                const hint = new vscode.InlayHint(
                    position,
                    ` /* ${info.hint} */`,
                    vscode.InlayHintKind.Type
                );
                hint.tooltip = info.tooltip;
                hint.paddingLeft = true;
                hints.push(hint);
            }
        }
    }
}
