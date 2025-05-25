import * as vscode from 'vscode';

export interface OpenFOAMNode {
    label: string;
    line: number;
    children?: OpenFOAMNode[];
    nodeType?: 'block' | 'key' | 'value' | 'keyValue' | 'comment' | 'header';
    value?: string;
    fullLine?: string;
    depth?: number;
}

export function parseOpenFOAMFile(document: vscode.TextDocument): OpenFOAMNode[] {
    const nodes: OpenFOAMNode[] = [];
    const lines = document.getText().split('\n');
    const stack: OpenFOAMNode[] = [];
    let currentDepth = 0;

    lines.forEach((line, index) => {
        const originalLine = line;
        const trimmed = line.trim();

        // Skip empty lines
        if (trimmed === '') {
            return;
        }

        // Handle comments
        if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
            return;
        }

        // Handle FoamFile header
        if (trimmed === 'FoamFile') {
            const headerNode: OpenFOAMNode = {
                label: 'FoamFile',
                line: index,
                nodeType: 'header',
                children: [],
                depth: currentDepth
            };
            nodes.push(headerNode);
            stack.push(headerNode);
            return;
        }

        // Handle closing braces
        if (trimmed === '}') {
            stack.pop();
            currentDepth = Math.max(0, currentDepth - 1);
            return;
        }

        // Handle opening braces on separate lines
        if (trimmed === '{') {
            currentDepth++;
            return;
        }

        // Improved key-value pair detection
        // Match patterns like: key value; or key value (without semicolon)
        const keyValueMatch = trimmed.match(/^(\w+)\s+(.+?)(?:;?\s*)$/);
        if (keyValueMatch && !trimmed.includes('{')) {
            const [_, key, value] = keyValueMatch;
            let cleanValue = value.replace(/;$/, '').trim();
            
            // Handle special cases for values in parentheses or quotes
            if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
                // Keep parentheses for vector/list values
            } else if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
                // Keep quotes for string values
            }
            
            const kvNode: OpenFOAMNode = {
                label: key,
                line: index,
                nodeType: 'keyValue',
                value: cleanValue,
                fullLine: originalLine,
                depth: currentDepth
            };

            if (stack.length > 0) {
                const parent = stack[stack.length - 1];
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(kvNode);
            } else {
                nodes.push(kvNode);
            }
            return;
        }

        // Handle blocks with or without opening brace
        const blockMatch = trimmed.match(/^(\w+)\s*(\{?)$/);
        if (blockMatch) {
            const [_, label, openBrace] = blockMatch;
            const blockNode: OpenFOAMNode = {
                label: label,
                line: index,
                nodeType: 'block',
                children: [],
                depth: currentDepth
            };

            if (stack.length > 0) {
                const parent = stack[stack.length - 1];
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(blockNode);
            } else {
                nodes.push(blockNode);
            }

            stack.push(blockNode);
            if (openBrace === '{') {
                currentDepth++;
            }
            return;
        }

        // Handle special OpenFOAM syntax like #include statements
        if (trimmed.startsWith('#')) {
            const includeNode: OpenFOAMNode = {
                label: trimmed,
                line: index,
                nodeType: 'keyValue',
                value: '',
                fullLine: originalLine,
                depth: currentDepth
            };

            if (stack.length > 0) {
                const parent = stack[stack.length - 1];
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(includeNode);
            } else {
                nodes.push(includeNode);
            }
            return;
        }
    });

    return nodes;
}
