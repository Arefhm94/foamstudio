import * as vscode from 'vscode';
import { OpenFOAMNode, parseOpenFOAMFile } from './openfoamParser';

export class OpenFOAMTreeProvider implements vscode.TreeDataProvider<OpenFOAMNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<OpenFOAMNode | undefined | void> = new vscode.EventEmitter<OpenFOAMNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<OpenFOAMNode | undefined | void> = this._onDidChangeTreeData.event;

    private nodes: OpenFOAMNode[] = [];

    constructor(private context: vscode.ExtensionContext) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: OpenFOAMNode): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.label, element.children ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        treeItem.command = {
            command: 'foamstudio.revealLine',
            title: 'Reveal Line',
            arguments: [element.line]
        };
        return treeItem;
    }

    getChildren(element?: OpenFOAMNode): Thenable<OpenFOAMNode[]> {
        if (element) {
            return Promise.resolve(element.children || []);
        } else {
            return Promise.resolve(this.nodes);
        }
    }

    updateTree(document: vscode.TextDocument): void {
        this.nodes = parseOpenFOAMFile(document);
        this.refresh();
    }
}
