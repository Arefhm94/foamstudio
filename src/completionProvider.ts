// completionProvider.ts
import * as vscode from 'vscode';
import { OPENFOAM_KEYWORDS, findKeyword, getKeywordsByCategory, KeywordInfo } from './openfoamKeywords';

export class OpenFOAMCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const completions: vscode.CompletionItem[] = [];
        const line = document.lineAt(position.line);
        const lineText = line.text.substring(0, position.character);
        
        // Determine context
        const contextInfo = this.getContext(document, position);
        
        // Add context-aware completions
        if (contextInfo.inBlock) {
            this.addBlockSpecificCompletions(completions, contextInfo.blockName);
        }
        
        // Add snippets based on context
        this.addSnippets(completions, contextInfo);
        
        // Add general keywords
        this.addKeywordCompletions(completions);
        
        // Add scheme-specific completions
        if (contextInfo.isSchemeContext) {
            this.addSchemeCompletions(completions);
        }
        
        // Add solver-specific completions
        if (contextInfo.isSolverContext) {
            this.addSolverCompletions(completions);
        }

        // Add field name suggestions
        if (lineText.match(/div\s*\(\s*phi\s*,\s*$/i) || lineText.match(/grad\s*\(\s*$/i)) {
            this.addFieldNameCompletions(completions);
        }

        // Add boundary condition completions
        if (contextInfo.blockStack.some(b => b.toLowerCase().includes('boundary'))) {
            this.addBoundaryConditionCompletions(completions);
        }

        // Add turbulence model completions
        if (lineText.match(/simulationType|turbulence|RASModel|LESModel/i)) {
            this.addTurbulenceModelCompletions(completions);
        }

        // Sort by relevance and kind
        completions.sort((a, b) => {
            // Prioritize snippets and keywords
            if (a.kind === vscode.CompletionItemKind.Snippet && b.kind !== vscode.CompletionItemKind.Snippet) {
                return -1;
            }
            if (b.kind === vscode.CompletionItemKind.Snippet && a.kind !== vscode.CompletionItemKind.Snippet) {
                return 1;
            }
            return (a.label as string).localeCompare(b.label as string);
        });
        
        // Return as completion list with ability to filter incomplete results
        return new vscode.CompletionList(completions, false);
    }

    resolveCompletionItem(
        item: vscode.CompletionItem,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CompletionItem> {
        // Add additional details when item is selected
        if (item.kind === vscode.CompletionItemKind.Keyword) {
            const keyword = findKeyword(item.label as string);
            if (keyword && keyword.example) {
                const additionalInfo = new vscode.MarkdownString();
                additionalInfo.appendMarkdown(`\n\n**Example:**\n\n`);
                additionalInfo.appendCodeblock(keyword.example, 'openfoam');
                item.documentation = additionalInfo;
            }
        }
        return item;
    }
    
    private getContext(document: vscode.TextDocument, position: vscode.Position) {
        const text = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
        const lines = text.split('\n');
        
        let blockStack: string[] = [];
        let inBlock = false;
        let blockName = '';
        
        // Track blocks
        for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            
            // Skip comments
            if (line.startsWith('//') || line.startsWith('/*')) {
                continue;
            }
            
            // Check for block start
            const blockMatch = line.match(/^(\w+)\s*$/);
            if (blockMatch) {
                blockStack.push(blockMatch[1]);
            }
            
            // Check for opening brace
            if (line.includes('{')) {
                if (blockStack.length === 0 && line.match(/^(\w+)\s*\{/)) {
                    const match = line.match(/^(\w+)\s*\{/);
                    if (match) {
                        blockStack.push(match[1]);
                    }
                }
            }
            
            // Check for closing brace
            if (line.includes('}')) {
                blockStack.pop();
            }
        }
        
        if (blockStack.length > 0) {
            inBlock = true;
            blockName = blockStack[blockStack.length - 1];
        }
        
        return {
            inBlock,
            blockName,
            isSchemeContext: ['ddtSchemes', 'gradSchemes', 'divSchemes', 'laplacianSchemes', 'interpolationSchemes', 'snGradSchemes'].includes(blockName),
            isSolverContext: blockName === 'solvers' || blockStack.includes('solvers'),
            fileName: document.fileName,
            blockStack
        };
    }
    
    private addKeywordCompletions(completions: vscode.CompletionItem[]) {
        OPENFOAM_KEYWORDS.forEach(kwInfo => {
            const item = new vscode.CompletionItem(kwInfo.keyword, vscode.CompletionItemKind.Keyword);
            item.detail = kwInfo.category;
            
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**${kwInfo.keyword}**\n\n`);
            markdown.appendMarkdown(`${kwInfo.description}\n\n`);
            
            if (kwInfo.validValues) {
                markdown.appendMarkdown(`**Valid values:** ${kwInfo.validValues.join(', ')}\n\n`);
            }
            
            if (kwInfo.example) {
                markdown.appendCodeblock(kwInfo.example, 'openfoam');
            }
            
            if (kwInfo.documentation) {
                markdown.appendMarkdown(`\n${kwInfo.documentation}`);
            }
            
            item.documentation = markdown;
            completions.push(item);
        });
    }
    
    private addBlockSpecificCompletions(completions: vscode.CompletionItem[], blockName: string) {
        // Add completions based on current block
        const blockCompletions: { [key: string]: string[] } = {
            'ddtSchemes': ['default', 'Euler', 'backward', 'CrankNicolson', 'steadyState', 'localEuler'],
            'gradSchemes': ['default', 'Gauss linear', 'cellLimited Gauss linear', 'leastSquares'],
            'divSchemes': ['default', 'Gauss linear', 'Gauss upwind', 'bounded Gauss linearUpwind', 'bounded Gauss upwind'],
            'laplacianSchemes': ['default', 'Gauss linear corrected', 'Gauss linear limited', 'Gauss linear uncorrected'],
            'interpolationSchemes': ['default', 'linear', 'upwind', 'midPoint'],
            'snGradSchemes': ['default', 'corrected', 'uncorrected', 'limited', 'orthogonal'],
            'relaxationFactors': ['fields', 'equations'],
            'SIMPLE': ['nNonOrthogonalCorrectors', 'residualControl', 'pRefCell', 'pRefValue', 'consistent'],
            'PISO': ['nCorrectors', 'nNonOrthogonalCorrectors', 'pRefCell', 'pRefValue'],
            'PIMPLE': ['nOuterCorrectors', 'nCorrectors', 'nNonOrthogonalCorrectors', 'momentumPredictor', 'residualControl']
        };
        
        if (blockCompletions[blockName]) {
            blockCompletions[blockName].forEach(item => {
                const completion = new vscode.CompletionItem(item, vscode.CompletionItemKind.Property);
                completion.detail = `${blockName} option`;
                completions.push(completion);
            });
        }
    }
    
    private addSchemeCompletions(completions: vscode.CompletionItem[]) {
        const schemes = [
            { name: 'Gauss linear', detail: 'Linear interpolation scheme' },
            { name: 'Gauss upwind', detail: 'First-order upwind scheme' },
            { name: 'Gauss linearUpwind', detail: 'Linear upwind with gradient', needsGrad: true },
            { name: 'Gauss linearUpwindV', detail: 'Vector linear upwind', needsGrad: true },
            { name: 'bounded Gauss upwind', detail: 'Bounded upwind scheme' },
            { name: 'bounded Gauss linearUpwind', detail: 'Bounded linear upwind', needsGrad: true },
            { name: 'Gauss limitedLinear', detail: 'Limited linear scheme' },
            { name: 'Gauss vanLeer', detail: 'Van Leer TVD scheme' },
            { name: 'Gauss MUSCL', detail: 'MUSCL scheme' },
            { name: 'Gauss QUICK', detail: 'QUICK scheme' },
            { name: 'cellLimited Gauss linear', detail: 'Cell-limited linear gradient' },
            { name: 'faceLimited Gauss linear', detail: 'Face-limited linear gradient' },
            { name: 'corrected', detail: 'Corrected scheme with non-orthogonal correction' },
            { name: 'limited', detail: 'Limited scheme with coefficient' },
            { name: 'uncorrected', detail: 'No non-orthogonal correction' },
            { name: 'orthogonal', detail: 'For orthogonal meshes only' }
        ];
        
        schemes.forEach(scheme => {
            const item = new vscode.CompletionItem(scheme.name, vscode.CompletionItemKind.Value);
            item.detail = scheme.detail;
            if ((scheme as any).needsGrad) {
                item.insertText = new vscode.SnippetString(`${scheme.name} \${1:grad(U)}`);
            }
            completions.push(item);
        });
    }
    
    private addSolverCompletions(completions: vscode.CompletionItem[]) {
        const solvers = [
            { name: 'PCG', detail: 'Preconditioned Conjugate Gradient (symmetric)' },
            { name: 'PBiCGStab', detail: 'Stabilized Bi-Conjugate Gradient (asymmetric)' },
            { name: 'smoothSolver', detail: 'Iterative solver with smoother' },
            { name: 'GAMG', detail: 'Geometric-Algebraic Multi-Grid' },
            { name: 'diagonal', detail: 'Explicit diagonal solver' }
        ];
        
        const preconditioners = [
            { name: 'DIC', detail: 'Diagonal Incomplete Cholesky' },
            { name: 'FDIC', detail: 'Faster DIC' },
            { name: 'DILU', detail: 'Diagonal Incomplete LU' },
            { name: 'diagonal', detail: 'Diagonal preconditioner' },
            { name: 'none', detail: 'No preconditioning' }
        ];
        
        const smoothers = [
            { name: 'GaussSeidel', detail: 'Gauss-Seidel smoother' },
            { name: 'symGaussSeidel', detail: 'Symmetric Gauss-Seidel' },
            { name: 'DICGaussSeidel', detail: 'DIC preconditioned GS' },
            { name: 'ILU', detail: 'Incomplete LU' }
        ];
        
        [...solvers, ...preconditioners, ...smoothers].forEach(item => {
            const completion = new vscode.CompletionItem(item.name, vscode.CompletionItemKind.Class);
            completion.detail = item.detail;
            completions.push(completion);
        });
    }
    
    private addSnippets(completions: vscode.CompletionItem[], context: any) {
        const snippets: Array<{trigger: string, snippet: string, detail: string, description: string}> = [
            {
                trigger: 'foamfile',
                snippet: 'FoamFile\n{\n\tversion\t\t2.0;\n\tformat\t\t${1|ascii,binary|};\n\tclass\t\t${2:dictionary};\n\tobject\t\t${3:objectName};\n}',
                detail: 'FoamFile header',
                description: 'Creates a FoamFile header block'
            },
            {
                trigger: 'solver-block',
                snippet: '${1:fieldName}\n{\n\tsolver\t\t${2|PCG,PBiCGStab,smoothSolver,GAMG|};\n\tpreconditioner\t${3|DIC,DILU,diagonal|};\n\ttolerance\t${4:1e-06};\n\trelTol\t\t${5:0.1};\n}',
                detail: 'Solver configuration block',
                description: 'Creates a solver configuration for a field'
            },
            {
                trigger: 'SIMPLE',
                snippet: 'SIMPLE\n{\n\tnNonOrthogonalCorrectors\t${1:0};\n\tresidualControl\n\t{\n\t\tp\t\t${2:1e-04};\n\t\tU\t\t${3:1e-04};\n\t}\n}',
                detail: 'SIMPLE algorithm settings',
                description: 'Creates SIMPLE algorithm configuration'
            },
            {
                trigger: 'PIMPLE',
                snippet: 'PIMPLE\n{\n\tnOuterCorrectors\t\t${1:1};\n\tnCorrectors\t\t\t${2:2};\n\tnNonOrthogonalCorrectors\t${3:0};\n}',
                detail: 'PIMPLE algorithm settings',
                description: 'Creates PIMPLE algorithm configuration'
            },
            {
                trigger: 'relaxation',
                snippet: 'relaxationFactors\n{\n\tfields\n\t{\n\t\tp\t\t${1:0.3};\n\t}\n\tequations\n\t{\n\t\tU\t\t${2:0.7};\n\t\tk\t\t${3:0.7};\n\t\tepsilon\t\t${4:0.7};\n\t}\n}',
                detail: 'Relaxation factors',
                description: 'Creates relaxation factors block'
            },
            {
                trigger: 'ddtSchemes',
                snippet: 'ddtSchemes\n{\n\tdefault\t\t${1|Euler,backward,CrankNicolson,steadyState|};\n}',
                detail: 'Time derivative schemes',
                description: 'Creates ddtSchemes block'
            },
            {
                trigger: 'gradSchemes',
                snippet: 'gradSchemes\n{\n\tdefault\t\tGauss linear;\n\tgrad(p)\t\t${1:Gauss linear};\n\tgrad(U)\t\t${2:cellLimited Gauss linear 1};\n}',
                detail: 'Gradient schemes',
                description: 'Creates gradSchemes block'
            },
            {
                trigger: 'divSchemes',
                snippet: 'divSchemes\n{\n\tdefault\t\tnone;\n\tdiv(phi,U)\t${1:bounded Gauss linearUpwindV grad(U)};\n\tdiv(phi,k)\t${2:bounded Gauss upwind};\n\tdiv(phi,epsilon)\t${3:bounded Gauss upwind};\n}',
                detail: 'Divergence schemes',
                description: 'Creates divSchemes block'
            },
            {
                trigger: 'laplacianSchemes',
                snippet: 'laplacianSchemes\n{\n\tdefault\t\tGauss linear ${1|corrected,limited 0.5,uncorrected|};\n}',
                detail: 'Laplacian schemes',
                description: 'Creates laplacianSchemes block'
            },
            {
                trigger: 'function-probes',
                snippet: '${1:probesName}\n{\n\ttype\t\t\tprobes;\n\tlibs\t\t\t("libsampling.so");\n\tenabled\t\t\ttrue;\n\twriteControl\ttimeStep;\n\twriteInterval\t${2:1};\n\tfields\t\t\t(${3:U p});\n\tprobeLocations\n\t(\n\t\t(${4:0 0 0})\n\t);\n}',
                detail: 'Probes function object',
                description: 'Creates a probes function object'
            },
            {
                trigger: 'function-forces',
                snippet: '${1:forcesName}\n{\n\ttype\t\t\tforces;\n\tlibs\t\t\t("libforces.so");\n\twriteControl\ttimeStep;\n\twriteInterval\t${2:1};\n\tpatches\t\t\t(${3:wall});\n\tCofR\t\t\t(${4:0 0 0});\n}',
                detail: 'Forces function object',
                description: 'Creates a forces function object'
            }
        ];
        
        snippets.forEach(snip => {
            const item = new vscode.CompletionItem(snip.trigger, vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString(snip.snippet);
            item.detail = snip.detail;
            item.documentation = new vscode.MarkdownString(snip.description);
            completions.push(item);
        });
    }

    private addFieldNameCompletions(completions: vscode.CompletionItem[]): void {
        const fields = [
            { name: 'U', desc: 'Velocity field', icon: vscode.CompletionItemKind.Field },
            { name: 'p', desc: 'Pressure field', icon: vscode.CompletionItemKind.Field },
            { name: 'T', desc: 'Temperature field', icon: vscode.CompletionItemKind.Field },
            { name: 'k', desc: 'Turbulent kinetic energy', icon: vscode.CompletionItemKind.Field },
            { name: 'epsilon', desc: 'Turbulent dissipation rate', icon: vscode.CompletionItemKind.Field },
            { name: 'omega', desc: 'Specific dissipation rate', icon: vscode.CompletionItemKind.Field },
            { name: 'nut', desc: 'Turbulent viscosity', icon: vscode.CompletionItemKind.Field },
            { name: 'nuTilda', desc: 'Modified turbulent viscosity', icon: vscode.CompletionItemKind.Field },
            { name: 'alpha.water', desc: 'Water phase fraction', icon: vscode.CompletionItemKind.Field },
            { name: 'alpha.air', desc: 'Air phase fraction', icon: vscode.CompletionItemKind.Field },
        ];

        fields.forEach(field => {
            const item = new vscode.CompletionItem(field.name, field.icon);
            item.detail = field.desc;
            item.sortText = '0' + field.name; // Prioritize field names
            completions.push(item);
        });
    }

    private addBoundaryConditionCompletions(completions: vscode.CompletionItem[]): void {
        const boundaryTypes = [
            { name: 'fixedValue', desc: 'Fixed (Dirichlet) boundary condition', snippet: 'fixedValue;\n        value           uniform ${1:0};' },
            { name: 'zeroGradient', desc: 'Zero gradient (Neumann) boundary condition', snippet: 'zeroGradient;' },
            { name: 'fixedGradient', desc: 'Fixed gradient boundary condition', snippet: 'fixedGradient;\n        gradient        uniform ${1:0};' },
            { name: 'slip', desc: 'Slip boundary condition', snippet: 'slip;' },
            { name: 'noSlip', desc: 'No-slip wall condition (use fixedValue uniform (0 0 0))', snippet: 'fixedValue;\n        value           uniform (0 0 0);' },
            { name: 'symmetryPlane', desc: 'Symmetry plane boundary', snippet: 'symmetryPlane;' },
            { name: 'symmetry', desc: 'Symmetry boundary', snippet: 'symmetry;' },
            { name: 'empty', desc: 'Empty boundary for 2D cases', snippet: 'empty;' },
            { name: 'wedge', desc: 'Wedge boundary for axisymmetric cases', snippet: 'wedge;' },
            { name: 'cyclic', desc: 'Cyclic (periodic) boundary', snippet: 'cyclic;' },
            { name: 'inletOutlet', desc: 'Inlet-outlet boundary (switches based on flow)', snippet: 'inletOutlet;\n        inletValue      uniform ${1:0};\n        value           uniform ${2:0};' },
            { name: 'pressureInletOutletVelocity', desc: 'Velocity BC for pressure inlet/outlet', snippet: 'pressureInletOutletVelocity;\n        value           uniform (0 0 0);' },
            { name: 'totalPressure', desc: 'Total pressure boundary condition', snippet: 'totalPressure;\n        p0              uniform ${1:0};\n        value           uniform ${2:0};' },
            { name: 'freestream', desc: 'Freestream boundary condition', snippet: 'freestream;\n        freestreamValue uniform ${1:0};' },
            { name: 'turbulentIntensityKineticEnergyInlet', desc: 'Turbulent kinetic energy from intensity', snippet: 'turbulentIntensityKineticEnergyInlet;\n        intensity       ${1:0.05};\n        value           uniform ${2:0};' },
            { name: 'kqRWallFunction', desc: 'Wall function for k and q', snippet: 'kqRWallFunction;\n        value           uniform ${1:0};' },
            { name: 'epsilonWallFunction', desc: 'Wall function for epsilon', snippet: 'epsilonWallFunction;\n        value           uniform ${1:0};' },
            { name: 'omegaWallFunction', desc: 'Wall function for omega', snippet: 'omegaWallFunction;\n        value           uniform ${1:0};' },
            { name: 'nutkWallFunction', desc: 'Wall function for turbulent viscosity', snippet: 'nutkWallFunction;\n        value           uniform 0;' },
        ];

        boundaryTypes.forEach(bc => {
            const item = new vscode.CompletionItem(bc.name, vscode.CompletionItemKind.Class);
            item.detail = bc.desc;
            item.insertText = new vscode.SnippetString(bc.snippet);
            item.documentation = new vscode.MarkdownString(`**${bc.name}**\n\n${bc.desc}`);
            completions.push(item);
        });
    }

    private addTurbulenceModelCompletions(completions: vscode.CompletionItem[]): void {
        const rasModels = [
            { name: 'kEpsilon', desc: 'Standard k-epsilon model', category: 'RAS' },
            { name: 'kOmega', desc: 'Standard k-omega model', category: 'RAS' },
            { name: 'kOmegaSST', desc: 'k-omega SST model (recommended)', category: 'RAS' },
            { name: 'realizableKE', desc: 'Realizable k-epsilon', category: 'RAS' },
            { name: 'RNGkEpsilon', desc: 'RNG k-epsilon model', category: 'RAS' },
            { name: 'SpalartAllmaras', desc: 'Spalart-Allmaras one-equation model', category: 'RAS' },
            { name: 'v2f', desc: 'v2-f turbulence model', category: 'RAS' },
            { name: 'laminar', desc: 'Laminar (no turbulence model)', category: 'Base' },
        ];

        const lesModels = [
            { name: 'Smagorinsky', desc: 'Smagorinsky SGS model', category: 'LES' },
            { name: 'kEqn', desc: 'One equation eddy-viscosity LES', category: 'LES' },
            { name: 'dynamicKEqn', desc: 'Dynamic one-equation LES', category: 'LES' },
            { name: 'WALE', desc: 'Wall-Adapting Local Eddy-viscosity', category: 'LES' },
        ];

        const simulationTypes = [
            { name: 'laminar', desc: 'Laminar simulation' },
            { name: 'RAS', desc: 'Reynolds-Averaged Simulation (RANS)' },
            { name: 'LES', desc: 'Large Eddy Simulation' },
        ];

        [...rasModels, ...lesModels].forEach(model => {
            const item = new vscode.CompletionItem(model.name, vscode.CompletionItemKind.Class);
            item.detail = `${model.category}: ${model.desc}`;
            item.documentation = new vscode.MarkdownString(`**${model.name}**\n\n${model.desc}\n\n*Category: ${model.category}*`);
            completions.push(item);
        });

        simulationTypes.forEach(simType => {
            const item = new vscode.CompletionItem(simType.name, vscode.CompletionItemKind.Enum);
            item.detail = simType.desc;
            item.sortText = '0' + simType.name;
            completions.push(item);
        });
    }
}