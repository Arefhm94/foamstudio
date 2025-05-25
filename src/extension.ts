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

	vscode.commands.registerCommand('foamstudio.revealLine', (line: number) => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const position = new vscode.Position(line, 0);
			editor.revealRange(new vscode.Range(position, position));
			editor.selection = new vscode.Selection(position, position);
		}
	});

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

	if (vscode.window.activeTextEditor) {
		const document = vscode.window.activeTextEditor.document;
		if (isSupportedOpenFOAMFile(document)) {
			treeProvider.updateTree(document);
		}
	}

	function isSupportedOpenFOAMFile(document: vscode.TextDocument): boolean {
		const supportedExtensions = ['.dict', 'controlDict', 'fvSchemes', 'fvSolution'];
		return supportedExtensions.some(ext => document.fileName.endsWith(ext));
	}

	vscode.languages.registerDocumentSymbolProvider({ language: 'openfoam' }, new OpenFOAMSymbolProvider());
}

// This method is called when your extension is deactivated
export function deactivate() {}
