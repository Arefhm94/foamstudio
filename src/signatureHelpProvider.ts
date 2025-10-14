import * as vscode from 'vscode';

export class OpenFOAMSignatureHelpProvider implements vscode.SignatureHelpProvider {
    provideSignatureHelp(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.SignatureHelpContext
    ): vscode.ProviderResult<vscode.SignatureHelp> {
        const lineText = document.lineAt(position.line).text;
        const textBeforeCursor = lineText.substring(0, position.character);
        
        // Detect what we're typing
        const schemeMatch = textBeforeCursor.match(/(\w+)\s+(Gauss|bounded|cellLimited|faceLimited)\s+(\w*)\s*$/);
        const solverMatch = textBeforeCursor.match(/(solver|preconditioner|smoother)\s+(\w*)\s*$/i);
        const vectorMatch = textBeforeCursor.match(/uniform\s*\(/);
        
        if (schemeMatch) {
            return this.getSchemeSignatureHelp(schemeMatch);
        }
        
        if (solverMatch) {
            return this.getSolverSignatureHelp(solverMatch[1]);
        }
        
        if (vectorMatch) {
            return this.getVectorSignatureHelp();
        }
        
        return undefined;
    }

    private getSchemeSignatureHelp(match: RegExpMatchArray): vscode.SignatureHelp {
        const signatureHelp = new vscode.SignatureHelp();
        const schemes: { [key: string]: string[] } = {
            'Gauss': [
                'Gauss linear',
                'Gauss upwind',
                'Gauss linearUpwind grad(field)',
                'Gauss limitedLinear 1',
                'Gauss vanLeer',
                'Gauss QUICK',
                'Gauss MUSCL'
            ],
            'bounded': [
                'bounded Gauss upwind',
                'bounded Gauss linearUpwind grad(field)',
                'bounded Gauss limitedLinear 1'
            ],
            'cellLimited': [
                'cellLimited Gauss linear 1',
                'cellLimited leastSquares 1'
            ],
            'faceLimited': [
                'faceLimited Gauss linear 1'
            ]
        };

        const schemeType = match[2];
        const options = schemes[schemeType] || [];

        options.forEach((option, index) => {
            const signature = new vscode.SignatureInformation(
                option,
                new vscode.MarkdownString(`**Scheme ${index + 1}:** ${this.getSchemeDescription(option)}`)
            );
            signatureHelp.signatures.push(signature);
        });

        signatureHelp.activeSignature = 0;
        signatureHelp.activeParameter = 0;

        return signatureHelp;
    }

    private getSolverSignatureHelp(solverType: string): vscode.SignatureHelp {
        const signatureHelp = new vscode.SignatureHelp();
        
        const solvers: { [key: string]: Array<{ name: string; desc: string; params?: string[] }> } = {
            'solver': [
                { 
                    name: 'PCG', 
                    desc: 'Preconditioned Conjugate Gradient (for symmetric matrices)',
                    params: ['preconditioner', 'tolerance', 'relTol']
                },
                { 
                    name: 'PBiCGStab', 
                    desc: 'Preconditioned Stabilized Bi-Conjugate Gradient (for asymmetric matrices)',
                    params: ['preconditioner', 'tolerance', 'relTol']
                },
                { 
                    name: 'smoothSolver', 
                    desc: 'Iterative solver using a smoother',
                    params: ['smoother', 'tolerance', 'relTol', 'nSweeps']
                },
                { 
                    name: 'GAMG', 
                    desc: 'Geometric-Algebraic Multi-Grid solver',
                    params: ['smoother', 'tolerance', 'relTol', 'nPreSweeps', 'nPostSweeps']
                },
                { 
                    name: 'diagonal', 
                    desc: 'Diagonal solver (explicit)',
                    params: ['tolerance', 'relTol']
                }
            ],
            'preconditioner': [
                { name: 'DIC', desc: 'Diagonal Incomplete Cholesky (for symmetric)' },
                { name: 'FDIC', desc: 'Faster DIC' },
                { name: 'DILU', desc: 'Diagonal Incomplete LU (for asymmetric)' },
                { name: 'diagonal', desc: 'Simple diagonal preconditioner' },
                { name: 'none', desc: 'No preconditioning' }
            ],
            'smoother': [
                { name: 'GaussSeidel', desc: 'Gauss-Seidel smoother' },
                { name: 'symGaussSeidel', desc: 'Symmetric Gauss-Seidel' },
                { name: 'DICGaussSeidel', desc: 'DIC preconditioned Gauss-Seidel' },
                { name: 'nonBlockingGaussSeidel', desc: 'Non-blocking Gauss-Seidel' }
            ]
        };

        const options = solvers[solverType.toLowerCase()] || [];
        
        options.forEach((option) => {
            let label = option.name;
            if (option.params) {
                label += ` (requires: ${option.params.join(', ')})`;
            }
            
            const signature = new vscode.SignatureInformation(
                label,
                new vscode.MarkdownString(`**${option.name}**\n\n${option.desc}`)
            );
            
            if (option.params) {
                option.params.forEach(param => {
                    signature.parameters.push(
                        new vscode.ParameterInformation(param, `Parameter: ${param}`)
                    );
                });
            }
            
            signatureHelp.signatures.push(signature);
        });

        signatureHelp.activeSignature = 0;
        signatureHelp.activeParameter = 0;

        return signatureHelp;
    }

    private getVectorSignatureHelp(): vscode.SignatureHelp {
        const signatureHelp = new vscode.SignatureHelp();
        
        const signature = new vscode.SignatureInformation(
            'uniform (x y z)',
            new vscode.MarkdownString('**Vector Value**\n\nSpecify three components for a uniform vector field:\n- `x`: X component\n- `y`: Y component\n- `z`: Z component')
        );
        
        signature.parameters = [
            new vscode.ParameterInformation('x', 'X component'),
            new vscode.ParameterInformation('y', 'Y component'),
            new vscode.ParameterInformation('z', 'Z component')
        ];
        
        signatureHelp.signatures.push(signature);
        signatureHelp.activeSignature = 0;
        signatureHelp.activeParameter = 0;
        
        return signatureHelp;
    }

    private getSchemeDescription(scheme: string): string {
        const descriptions: { [key: string]: string } = {
            'Gauss linear': 'Second-order accurate central differencing',
            'Gauss upwind': 'First-order upwind, stable but diffusive',
            'Gauss linearUpwind': 'Second-order upwind using gradient',
            'Gauss limitedLinear': 'TVD scheme with limiter coefficient',
            'Gauss vanLeer': 'Van Leer TVD scheme',
            'Gauss QUICK': 'Quadratic Upstream Interpolation',
            'Gauss MUSCL': 'Monotonic Upstream-centered Scheme',
            'bounded Gauss upwind': 'Bounded first-order upwind',
            'bounded Gauss linearUpwind': 'Bounded second-order upwind',
            'cellLimited Gauss linear': 'Cell-limited gradient with coefficient',
            'faceLimited Gauss linear': 'Face-limited gradient with coefficient'
        };
        
        for (const [key, desc] of Object.entries(descriptions)) {
            if (scheme.startsWith(key)) {
                return desc;
            }
        }
        
        return 'Numerical scheme';
    }
}
