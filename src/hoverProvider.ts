import * as vscode from 'vscode';
import { findKeyword } from './openfoamKeywords';

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
        
        // Look up keyword in database
        const keywordInfo = findKeyword(word);
        if (keywordInfo) {
            const markdown = new vscode.MarkdownString();
            markdown.isTrusted = true;
            markdown.supportHtml = true;
            
            // Title
            markdown.appendMarkdown(`### ${keywordInfo.keyword}\n\n`);
            
            // Category badge
            markdown.appendMarkdown(`*Category: ${keywordInfo.category}*\n\n`);
            
            // Description
            markdown.appendMarkdown(`${keywordInfo.description}\n\n`);
            
            // Valid values
            if (keywordInfo.validValues && keywordInfo.validValues.length > 0) {
                markdown.appendMarkdown(`**Valid Values:**\n\n`);
                keywordInfo.validValues.forEach(value => {
                    markdown.appendMarkdown(`- \`${value}\`\n`);
                });
                markdown.appendMarkdown('\n');
            }
            
            // Documentation
            if (keywordInfo.documentation) {
                markdown.appendMarkdown(`**Details:**\n\n${keywordInfo.documentation}\n\n`);
            }
            
            // Example
            if (keywordInfo.example) {
                markdown.appendMarkdown(`**Example:**\n\n`);
                markdown.appendCodeblock(keywordInfo.example, 'openfoam');
            }
            
            // Link to documentation
            markdown.appendMarkdown(`\n\n---\n\n`);
            markdown.appendMarkdown(`[OpenFOAM Documentation](https://www.openfoam.com/documentation/)`);
            
            return new vscode.Hover(markdown, wordRange);
        }
        
        // Fallback to basic documentation
        const basicDocs = this.getBasicDocumentation(word);
        if (basicDocs) {
            return new vscode.Hover(basicDocs, wordRange);
        }
    }

    private getBasicDocumentation(word: string): vscode.MarkdownString | undefined {
        // Extended documentation for common OpenFOAM terms
        const docs: { [key: string]: { description: string; details?: string; example?: string } } = {
            // Additional solver types
            'icoFoam': {
                description: 'Transient solver for incompressible, laminar flow',
                details: 'Simple Navier-Stokes solver without turbulence modeling'
            },
            'simpleFoam': {
                description: 'Steady-state solver for incompressible, turbulent flow',
                details: 'Uses SIMPLE algorithm with turbulence modeling (RANS)'
            },
            'pimpleFoam': {
                description: 'Transient solver for incompressible, turbulent flow',
                details: 'Uses PIMPLE (merged PISO-SIMPLE) algorithm'
            },
            'pisoFoam': {
                description: 'Transient solver for incompressible, turbulent flow',
                details: 'Uses PISO algorithm for time-accurate simulations'
            },
            'rhoSimpleFoam': {
                description: 'Steady-state solver for compressible, turbulent flow',
                details: 'Density-based solver using SIMPLE algorithm'
            },
            'rhoPimpleFoam': {
                description: 'Transient solver for compressible, turbulent flow',
                details: 'Density-based solver using PIMPLE algorithm'
            },
            'interFoam': {
                description: 'Transient solver for two incompressible, isothermal immiscible fluids',
                details: 'Uses VOF (Volume of Fluid) method with PIMPLE algorithm'
            },
            'buoyantSimpleFoam': {
                description: 'Steady-state solver for buoyant, turbulent flow',
                details: 'Includes energy equation and buoyancy effects'
            },
            
            // Field types
            'U': {
                description: 'Velocity field',
                details: 'Vector field representing fluid velocity [m/s]'
            },
            'p': {
                description: 'Pressure field',
                details: 'Scalar field representing kinematic pressure [m²/s²] or static pressure [Pa]'
            },
            'T': {
                description: 'Temperature field',
                details: 'Scalar field representing temperature [K]'
            },
            'k': {
                description: 'Turbulent kinetic energy',
                details: 'Scalar field for turbulence modeling [m²/s²]'
            },
            'epsilon': {
                description: 'Turbulent dissipation rate',
                details: 'Scalar field for k-epsilon turbulence model [m²/s³]'
            },
            'omega': {
                description: 'Specific dissipation rate',
                details: 'Scalar field for k-omega turbulence model [1/s]'
            },
            'nut': {
                description: 'Turbulent kinematic viscosity',
                details: 'Scalar field representing eddy viscosity [m²/s]'
            },
            'alpha': {
                description: 'Phase fraction',
                details: 'Scalar field for multiphase flows (0-1)'
            },
            
            // Turbulence models
            'kEpsilon': {
                description: 'k-epsilon turbulence model',
                details: 'Two-equation RANS model, robust and widely used'
            },
            'kOmega': {
                description: 'k-omega turbulence model',
                details: 'Two-equation RANS model, better for near-wall regions'
            },
            'kOmegaSST': {
                description: 'k-omega SST turbulence model',
                details: 'Shear Stress Transport model, combines k-omega and k-epsilon'
            },
            'SpalartAllmaras': {
                description: 'Spalart-Allmaras turbulence model',
                details: 'One-equation RANS model, good for aerospace applications'
            },
            'LES': {
                description: 'Large Eddy Simulation',
                details: 'Resolves large turbulent eddies, models small scales'
            },
            
            // Units and dimensions
            'uniform': {
                description: 'Uniform field value',
                details: 'Specifies a constant value throughout the field',
                example: 'uniform (1 0 0);  // For vectors\nuniform 0;        // For scalars'
            },
            'nonuniform': {
                description: 'Non-uniform field value',
                details: 'Specifies a list of values, one per cell/face'
            },
            
            // Mesh quality
            'checkMesh': {
                description: 'Mesh quality checking utility',
                details: 'Validates mesh quality and identifies potential issues'
            },
            'blockMesh': {
                description: 'Structured mesh generation utility',
                details: 'Creates hexahedral meshes from blockMeshDict'
            },
            'snappyHexMesh': {
                description: 'Automatic mesh generation utility',
                details: 'Creates complex meshes from STL geometry with refinement'
            }
        };

        const docInfo = docs[word];
        if (docInfo) {
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**${word}**\n\n`);
            markdown.appendMarkdown(`${docInfo.description}\n\n`);
            
            if (docInfo.details) {
                markdown.appendMarkdown(`*${docInfo.details}*\n\n`);
            }
            
            if (docInfo.example) {
                markdown.appendCodeblock(docInfo.example, 'openfoam');
            }
            
            return markdown;
        }
        
        return undefined;
    }
}