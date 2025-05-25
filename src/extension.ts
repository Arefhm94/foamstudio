// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { OpenFOAMSymbolProvider } from './openfoamSymbolProvider';
import { OpenFOAMTreeProvider } from './openfoamTreeProvider';
import { OpenFOAMCompletionProvider } from './completionProvider';
import { OpenFOAMHoverProvider } from './hoverProvider';
import { OpenFOAMValidationProvider } from './validationProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "foamstudio" is now active!');

    // Define OpenFOAM file selector
    const openfoamSelector: vscode.DocumentSelector = [
        { language: 'openfoam' },
        { pattern: '**/controlDict' },
        { pattern: '**/fvSchemes' },
        { pattern: '**/fvSolution' },
        { pattern: '**/caseSetupDict' },
        { pattern: '**/decomposeParDict' },
        { pattern: '**/fvOptions' },
        { pattern: '**/helyxHexMeshDict' },
        { pattern: '**/probesLocation' },
        { pattern: '**/surfaceFeatureExtractDict' },
        { pattern: '**/surfaceIntersectionDict' },
        { pattern: '**/topoSetDict' },
        { pattern: '**/*.dict' }
    ];

    // Register providers
    registerProviders(context, openfoamSelector);
    
    // Register commands
    registerCommands(context);
    
    // Register tree view
    registerTreeView(context);
    
    // Setup document listeners
    setupDocumentListeners(context);
}

function registerProviders(context: vscode.ExtensionContext, selector: vscode.DocumentSelector) {
    // Symbol provider for outline view
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(selector, new OpenFOAMSymbolProvider())
    );

    // Completion provider for IntelliSense
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            selector, 
            new OpenFOAMCompletionProvider(), 
            ' ', '.', '('
        )
    );

    // Hover provider for documentation
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(selector, new OpenFOAMHoverProvider())
    );

    // Validation provider for diagnostics
    const validationProvider = new OpenFOAMValidationProvider();
    context.subscriptions.push(validationProvider);
}

function registerCommands(context: vscode.ExtensionContext) {
    // Hello World command
    context.subscriptions.push(
        vscode.commands.registerCommand('foamstudio.helloWorld', () => {
            vscode.window.showInformationMessage('Hello World from FoamStudio!');
        })
    );

    // Reveal line command for tree view
    context.subscriptions.push(
        vscode.commands.registerCommand('foamstudio.revealLine', (line: number) => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const position = new vscode.Position(line, 0);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position));
            }
        })
    );

    // Format OpenFOAM document
    context.subscriptions.push(
        vscode.commands.registerCommand('foamstudio.formatDocument', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && isSupportedOpenFOAMFile(editor.document)) {
                formatOpenFOAMDocument(editor);
            }
        })
    );

    // Validate OpenFOAM syntax
    context.subscriptions.push(
        vscode.commands.registerCommand('foamstudio.validateSyntax', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && isSupportedOpenFOAMFile(editor.document)) {
                validateOpenFOAMSyntax(editor.document);
            }
        })
    );
}

function registerTreeView(context: vscode.ExtensionContext) {
    const treeProvider = new OpenFOAMTreeProvider(context);
    
    context.subscriptions.push(
        vscode.window.createTreeView('openfoamOutline', {
            treeDataProvider: treeProvider,
            showCollapseAll: true
        })
    );

    // Update tree when active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && isSupportedOpenFOAMFile(editor.document)) {
                treeProvider.updateTree(editor.document);
            }
        })
    );
}

function setupDocumentListeners(context: vscode.ExtensionContext) {
    const validationProvider = new OpenFOAMValidationProvider();
    
    // Listen for document changes to update validation
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (isSupportedOpenFOAMFile(event.document)) {
                // Debounce validation
                setTimeout(() => validationProvider.validateDocument(event.document), 500);
            }
        })
    );

    // Listen for document saves
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(document => {
            if (isSupportedOpenFOAMFile(document)) {
                validationProvider.validateDocument(document);
            }
        })
    );
}

function isSupportedOpenFOAMFile(document: vscode.TextDocument): boolean {
    const supportedExtensions = ['.dict', 'controlDict', 'fvSchemes', 'fvSolution', 'caseSetupDict', 'decomposeParDict', 'fvOptions', 'helyxHexMeshDict', 'probesLocation', 'surfaceFeatureExtractDict', 'surfaceIntersectionDict', 'topoSetDict'];
    const fileName = document.fileName.split('\\').pop() || document.fileName.split('/').pop() || '';
    
    return document.languageId === 'openfoam' || 
           supportedExtensions.some(ext => 
               fileName.endsWith(ext) || 
               fileName === ext ||
               (ext.startsWith('.') && fileName.endsWith(ext))
           );
}

function formatOpenFOAMDocument(editor: vscode.TextEditor) {
    const document = editor.document;
    const text = document.getText();
    const formatted = formatOpenFOAMText(text);
    
    if (formatted !== text) {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), formatted);
        vscode.workspace.applyEdit(edit);
    }
}

function formatOpenFOAMText(text: string): string {
    const lines = text.split('\n');
    const formatted: string[] = [];
    let indentLevel = 0;
    const indentSize = 4;

    for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed === '') {
            formatted.push('');
            continue;
        }

        if (trimmed === '}') {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        const indent = ' '.repeat(indentLevel * indentSize);
        formatted.push(indent + trimmed);

        if (trimmed.endsWith('{') || trimmed === '{') {
            indentLevel++;
        }
    }

    return formatted.join('\n');
}

function validateOpenFOAMSyntax(document: vscode.TextDocument) {
    // This function can call the validation provider if needed
    const validationProvider = new OpenFOAMValidationProvider();
    validationProvider.validateDocument(document);
}

// This method is called when your extension is deactivated
export function deactivate() {}
