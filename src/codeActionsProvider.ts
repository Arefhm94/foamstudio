import * as vscode from 'vscode';

export class OpenFOAMCodeActionsProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix,
        vscode.CodeActionKind.Refactor,
        vscode.CodeActionKind.RefactorRewrite
    ];

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        const actions: vscode.CodeAction[] = [];
        const line = document.lineAt(range.start.line);
        const lineText = line.text.trim();

        // Quick fix: Add missing semicolon
        if (!lineText.endsWith(';') && !lineText.endsWith('{') && !lineText.endsWith('}') && lineText.length > 0) {
            if (lineText.match(/^\w+\s+[\w\.]+$/)) {
                actions.push(this.createAddSemicolonAction(document, line));
            }
        }

        // Quick fix: Convert to bounded scheme
        if (lineText.match(/\bdiv\(.*\)\s+Gauss\s+(upwind|linearUpwind)/)) {
            actions.push(this.createAddBoundedAction(document, line));
        }

        // Quick fix: Add tolerance parameters
        if (lineText.match(/solver\s+(PCG|PBiCGStab|smoothSolver|GAMG);/)) {
            actions.push(this.createAddToleranceAction(document, range));
        }

        // Refactor: Extract to relaxationFactors
        if (lineText.match(/relax\w*\s+\d+\.?\d*/i)) {
            actions.push(this.createExtractRelaxationAction(document, line));
        }

        // Quick fix: Add FoamFile header
        if (range.start.line === 0 && !document.getText().includes('FoamFile')) {
            actions.push(this.createAddFoamFileHeaderAction(document));
        }

        // Quick fix: Format scheme with proper spacing
        if (lineText.match(/Gauss\w+/)) {
            actions.push(this.createFormatSchemeAction(document, line));
        }

        // Add common completions as code actions
        if (lineText.match(/^\s*\w+Schemes\s*$/)) {
            actions.push(this.createAddDefaultSchemeAction(document, line, lineText));
        }

        // Suggest corrected scheme
        if (lineText.match(/Gaus\s|Gaus$/i)) {
            actions.push(this.createFixTypoAction(document, line, 'Gaus', 'Gauss'));
        }

        // Add common solver templates
        if (lineText.match(/^\s*solvers\s*$/)) {
            actions.push(this.createAddSolverTemplateAction(document, line));
        }

        return actions;
    }

    private createAddSemicolonAction(document: vscode.TextDocument, line: vscode.TextLine): vscode.CodeAction {
        const action = new vscode.CodeAction('Add semicolon', vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        action.edit.insert(document.uri, line.range.end, ';');
        action.isPreferred = true;
        return action;
    }

    private createAddBoundedAction(document: vscode.TextDocument, line: vscode.TextLine): vscode.CodeAction {
        const action = new vscode.CodeAction('Make scheme bounded', vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        const newText = line.text.replace(/\bGauss\s+/, 'bounded Gauss ');
        action.edit.replace(document.uri, line.range, newText);
        action.diagnostics = [];
        return action;
    }

    private createAddToleranceAction(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction {
        const action = new vscode.CodeAction('Add tolerance settings', vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        
        const line = document.lineAt(range.start.line);
        const indent = line.text.match(/^\s*/)?.[0] || '';
        const insertion = `\n${indent}    tolerance       1e-06;\n${indent}    relTol          0.1;`;
        
        action.edit.insert(document.uri, line.range.end, insertion);
        return action;
    }

    private createExtractRelaxationAction(document: vscode.TextDocument, line: vscode.TextLine): vscode.CodeAction {
        const action = new vscode.CodeAction('Extract to relaxationFactors block', vscode.CodeActionKind.RefactorRewrite);
        // This would need more complex logic to implement properly
        action.disabled = { reason: 'Not yet implemented - complex refactoring' };
        return action;
    }

    private createAddFoamFileHeaderAction(document: vscode.TextDocument): vscode.CodeAction {
        const action = new vscode.CodeAction('Add FoamFile header', vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        
        const fileName = document.fileName.split('/').pop() || 'dictionary';
        const header = `FoamFile
{
    version     2.0;
    format      ascii;
    class       dictionary;
    object      ${fileName};
}

`;
        
        action.edit.insert(document.uri, new vscode.Position(0, 0), header);
        return action;
    }

    private createFormatSchemeAction(document: vscode.TextDocument, line: vscode.TextLine): vscode.CodeAction {
        const action = new vscode.CodeAction('Format scheme with spaces', vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        
        const newText = line.text.replace(/Gauss(\w+)/, 'Gauss $1');
        if (newText !== line.text) {
            action.edit.replace(document.uri, line.range, newText);
        }
        
        return action;
    }

    private createAddDefaultSchemeAction(document: vscode.TextDocument, line: vscode.TextLine, lineText: string): vscode.CodeAction {
        const schemeName = lineText.trim();
        const action = new vscode.CodeAction(`Add default ${schemeName} block`, vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        
        const templates: { [key: string]: string } = {
            'ddtSchemes': '\n{\n    default         Euler;\n}',
            'gradSchemes': '\n{\n    default         Gauss linear;\n    grad(p)         Gauss linear;\n    grad(U)         cellLimited Gauss linear 1;\n}',
            'divSchemes': '\n{\n    default         none;\n    div(phi,U)      bounded Gauss linearUpwindV grad(U);\n    div(phi,k)      bounded Gauss upwind;\n    div(phi,epsilon) bounded Gauss upwind;\n}',
            'laplacianSchemes': '\n{\n    default         Gauss linear corrected;\n}',
            'interpolationSchemes': '\n{\n    default         linear;\n}',
            'snGradSchemes': '\n{\n    default         corrected;\n}'
        };
        
        const template = templates[schemeName] || '\n{\n    default         none;\n}';
        action.edit.insert(document.uri, line.range.end, template);
        
        return action;
    }

    private createFixTypoAction(document: vscode.TextDocument, line: vscode.TextLine, wrong: string, correct: string): vscode.CodeAction {
        const action = new vscode.CodeAction(`Fix typo: ${wrong} → ${correct}`, vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        
        const newText = line.text.replace(new RegExp(wrong, 'gi'), correct);
        action.edit.replace(document.uri, line.range, newText);
        action.isPreferred = true;
        
        return action;
    }

    private createAddSolverTemplateAction(document: vscode.TextDocument, line: vscode.TextLine): vscode.CodeAction {
        const action = new vscode.CodeAction('Add pressure solver template', vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        
        const template = `
{
    p
    {
        solver          PCG;
        preconditioner  DIC;
        tolerance       1e-06;
        relTol          0.05;
    }

    U
    {
        solver          PBiCGStab;
        preconditioner  DILU;
        tolerance       1e-06;
        relTol          0.1;
    }
}`;
        
        action.edit.insert(document.uri, line.range.end, template);
        
        return action;
    }
}
