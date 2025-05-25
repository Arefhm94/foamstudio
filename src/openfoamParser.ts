import * as vscode from 'vscode';

export interface OpenFOAMNode {
    label: string;
    line: number;
    children?: OpenFOAMNode[];
}

export function parseOpenFOAMFile(document: vscode.TextDocument): OpenFOAMNode[] {
    const nodes: OpenFOAMNode[] = [];
    const stack: { node: OpenFOAMNode; indent: number }[] = [];

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const trimmed = line.text.trim();

        if (trimmed === '' || trimmed.startsWith('//')) {
            continue; // Skip empty lines and comments
        }

        const indent = line.firstNonWhitespaceCharacterIndex;
        const node: OpenFOAMNode = { label: trimmed, line: i };

        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }

        if (stack.length === 0) {
            nodes.push(node);
        } else {
            const parent = stack[stack.length - 1].node;
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(node);
        }

        stack.push({ node, indent });
    }

    return nodes;
}
