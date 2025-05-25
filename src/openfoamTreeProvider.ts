import * as vscode from 'vscode';
import { OpenFOAMNode } from './openfoamParser';

export class OpenFOAMTreeProvider implements vscode.TreeDataProvider<OpenFOAMNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<OpenFOAMNode | undefined | void> = new vscode.EventEmitter<OpenFOAMNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<OpenFOAMNode | undefined | void> = this._onDidChangeTreeData.event;

    private nodes: OpenFOAMNode[] = [];

    constructor(private context: vscode.ExtensionContext) {}

    updateTree(document: vscode.TextDocument): void {
        const parseOpenFOAMFile = require('./openfoamParser').parseOpenFOAMFile;
        this.nodes = parseOpenFOAMFile(document);
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: OpenFOAMNode): vscode.TreeItem {
        const hasChildren = element.children && element.children.length > 0;
        
        const treeItem = new vscode.TreeItem(
            element.label,
            hasChildren ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None
        );

        // For key-value pairs, show value in description with green color
        if (element.nodeType === 'keyValue' && element.value) {
            // Key appears in the label (will be styled blue)
            treeItem.label = element.label;
            // Value appears in description (will be styled green)
            treeItem.description = this.formatValue(element.value);
            
            // Use resourceUri to apply custom CSS styling
            treeItem.resourceUri = vscode.Uri.parse(`openfoam-key:///${element.label}`);
            
            // Add tooltip with full information
            treeItem.tooltip = new vscode.MarkdownString(
                `**${element.label}**: \`${element.value}\`\n\n*Line ${element.line + 1}*`
            );
            
        } else if (element.nodeType === 'block') {
            treeItem.tooltip = new vscode.MarkdownString(
                `**Block**: ${element.label}\n\n*Line ${element.line + 1}*`
            );
            
        } else if (element.nodeType === 'header') {
            treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            treeItem.tooltip = new vscode.MarkdownString(
                `**Header**: ${element.label}\n\n*Line ${element.line + 1}*`
            );
        }

        // Add command to reveal line when clicked
        treeItem.command = {
            command: 'foamstudio.revealLine',
            title: 'Reveal Line',
            arguments: [element.line]
        };

        return treeItem;
    }

    private formatValue(value: string): string {
        // Truncate long values and add ellipsis
        const maxLength = 50;
        if (value.length > maxLength) {
            return value.substring(0, maxLength) + '...';
        }
        return value;
    }

    getChildren(element?: OpenFOAMNode): OpenFOAMNode[] {
        if (!element) {
            return this.nodes;
        }
        return element.children || [];
    }
}
