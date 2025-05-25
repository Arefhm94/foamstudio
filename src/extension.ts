// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { OpenFOAMTreeProvider } from './openfoamTreeProvider';
import { OpenFOAMSymbolProvider } from './openfoamSymbolProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "foamstudio" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('foamstudio.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from FoamStudio!');
	});

	context.subscriptions.push(disposable);

	const treeProvider = new OpenFOAMTreeProvider(context);
	vscode.window.registerTreeDataProvider('openfoamOutline', treeProvider);

	// Add CSS styling for the tree view
	const css = `
		.openfoamOutline .monaco-list-row .monaco-tl-contents .monaco-highlighted-label .label-name {
			color: var(--vscode-openfoamOutline-keyForeground) !important;
		}
		.openfoamOutline .monaco-list-row .monaco-tl-contents .monaco-highlighted-label .label-description {
			color: var(--vscode-openfoamOutline-valueForeground) !important;
		}
	`;

	// Create a style element and inject it
	const styleElement = vscode.workspace.createFileSystemWatcher('**/*.css');

	vscode.commands.registerCommand('foamstudio.revealLine', (line: number) => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const position = new vscode.Position(line, 0);
			editor.revealRange(new vscode.Range(position, position));
			editor.selection = new vscode.Selection(position, position);
		}
	});

	// Register refresh command
	vscode.commands.registerCommand('foamstudio.refreshOutline', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && isSupportedOpenFOAMFile(editor.document)) {
			treeProvider.updateTree(editor.document);
			vscode.window.showInformationMessage('OpenFOAM Outline refreshed!');
		}
	});

	// Register collapse all command
	vscode.commands.registerCommand('foamstudio.collapseAll', () => {
		vscode.commands.executeCommand('workbench.actions.treeView.openfoamOutline.collapseAll');
	});

	// Register test outline command
	vscode.commands.registerCommand('foamstudio.testOutline', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && isSupportedOpenFOAMFile(editor.document)) {
			treeProvider.updateTree(editor.document);
			vscode.window.showInformationMessage(`OpenFOAM Outline updated for: ${editor.document.fileName}`);
		} else {
			vscode.window.showWarningMessage('Please open a supported OpenFOAM file (controlDict, fvSchemes, etc.)');
		}
	});

	vscode.languages.registerDocumentSymbolProvider({ language: 'openfoam' }, new OpenFOAMSymbolProvider());

	vscode.window.registerTreeDataProvider('openfoamOutline', treeProvider);

	vscode.workspace.onDidOpenTextDocument((document) => {
	    if (isSupportedOpenFOAMFile(document)) {
	        treeProvider.updateTree(document);
	    }
	});

	vscode.workspace.onDidChangeTextDocument((event) => {
	    if (isSupportedOpenFOAMFile(event.document)) {
	        treeProvider.updateTree(event.document);
	    }
	});

	vscode.window.onDidChangeActiveTextEditor((editor) => {
	    if (editor && isSupportedOpenFOAMFile(editor.document)) {
	        treeProvider.updateTree(editor.document);
	    }
	});

	if (vscode.window.activeTextEditor) {
		const document = vscode.window.activeTextEditor.document;
		if (isSupportedOpenFOAMFile(document)) {
			treeProvider.updateTree(document);
		}
	}

	function isSupportedOpenFOAMFile(document: vscode.TextDocument): boolean {
		const supportedExtensions = ['.dict', 'controlDict', 'fvSchemes', 'fvSolution', 'caseSetupDict', 'decomposeParDict', 'fvOptions', 'helyxHexMeshDict', 'probesLocation', 'surfaceFeatureExtractDict', 'surfaceIntersectionDict', 'topoSetDict'];
		const fileName = document.fileName.split('\\').pop() || document.fileName.split('/').pop() || '';
		return supportedExtensions.some(ext => 
			fileName.endsWith(ext) || 
			fileName === ext ||
			(ext.startsWith('.') && fileName.endsWith(ext))
		);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
