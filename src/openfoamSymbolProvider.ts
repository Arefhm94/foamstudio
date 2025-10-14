import * as vscode from 'vscode';
import { parseOpenFOAMFile, OpenFOAMNode } from './openfoamParser';

export class OpenFOAMSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        const nodes = parseOpenFOAMFile(document);
        return this.convertToSymbols(nodes);
    }

    private convertToSymbols(nodes: OpenFOAMNode[]): vscode.DocumentSymbol[] {
        return nodes
            .filter(node => node.label.toLowerCase() !== 'foamfile') // Filter out FoamFile sections
            .map(node => {
                const symbolKind = this.getSymbolKind(node.label, node.nodeType, node.value);
                const symbol = new vscode.DocumentSymbol(
                    node.label,
                    node.value || '',
                    symbolKind,
                    new vscode.Range(new vscode.Position(node.line, 0), new vscode.Position(node.line, node.label.length)),
                    new vscode.Range(new vscode.Position(node.line, 0), new vscode.Position(node.line, node.label.length))
                );

                // Add tags for better visual distinction
                symbol.tags = this.getSymbolTags(node.label, node.nodeType);

                if (node.children) {
                    symbol.children = this.convertToSymbols(node.children);
                }

                return symbol;
            });
    }

    private getSymbolKind(label: string, nodeType?: 'block' | 'key' | 'value' | 'keyValue' | 'comment' | 'header', value?: string): vscode.SymbolKind {
        // Use nodeType first if available
        if (nodeType) {
            switch (nodeType) {
                case 'block':
                    return this.getBlockSymbolKind(label);
                case 'keyValue':
                    return this.getKeyValueSymbolKind(label, value);
                case 'key':
                    return vscode.SymbolKind.Key;
                case 'value':
                    return vscode.SymbolKind.String;
                case 'comment':
                    return vscode.SymbolKind.Null;
                case 'header':
                    return vscode.SymbolKind.Package;
            }
        }
        
        // Fallback to label-based detection
        if (label.toLowerCase() === 'foamfile') {
            return vscode.SymbolKind.Package;
        }
        
        return vscode.SymbolKind.Property;
    }

    private getBlockSymbolKind(label: string): vscode.SymbolKind {
        const lower = label.toLowerCase();
        
        // Time control blocks
        if (['controldict', 'startfrom', 'stopat'].some(k => lower.includes(k))) {
            return vscode.SymbolKind.Event;
        }
        
        // Scheme blocks - use different colors
        if (lower.includes('schemes')) {
            if (lower.includes('ddt')) {
                return vscode.SymbolKind.TypeParameter;
            }
            if (lower.includes('grad')) {
                return vscode.SymbolKind.Interface;
            }
            if (lower.includes('div')) {
                return vscode.SymbolKind.Enum;
            }
            if (lower.includes('laplacian')) {
                return vscode.SymbolKind.Struct;
            }
            if (lower.includes('interpolation')) {
                return vscode.SymbolKind.EnumMember;
            }
            if (lower.includes('sngrad')) {
                return vscode.SymbolKind.Operator;
            }
            return vscode.SymbolKind.Class;
        }
        
        // Solver configurations
        if (lower === 'solvers' || lower.match(/^[puk]$|^alpha|^epsilon|^omega|^nut/)) {
            return vscode.SymbolKind.Method;
        }
        
        // Algorithm blocks (SIMPLE, PIMPLE, PISO)
        if (['simple', 'pimple', 'piso', 'pimpleloop'].includes(lower)) {
            return vscode.SymbolKind.Constructor;
        }
        
        // Relaxation factors
        if (lower.includes('relaxation')) {
            return vscode.SymbolKind.Module;
        }
        
        // Fields
        if (['fields', 'equations', 'internalfield', 'boundaryfield'].some(k => lower.includes(k))) {
            return vscode.SymbolKind.Field;
        }
        
        // Function objects
        if (lower.includes('function') || ['probes', 'forces', 'forcecoeffs'].includes(lower)) {
            return vscode.SymbolKind.Function;
        }
        
        // Boundary conditions
        if (['inlet', 'outlet', 'wall', 'patch', 'symmetry'].some(k => lower.includes(k))) {
            return vscode.SymbolKind.Constant;
        }
        
        // Default namespace for unknown blocks
        return vscode.SymbolKind.Namespace;
    }

    private getKeyValueSymbolKind(label: string, value?: string): vscode.SymbolKind {
        const lower = label.toLowerCase();
        
        // Application/solver name
        if (lower === 'application') {
            return vscode.SymbolKind.Class;
        }
        
        // Time-related properties
        if (['starttime', 'endtime', 'deltat', 'writeinterval'].includes(lower)) {
            return vscode.SymbolKind.Number;
        }
        
        // Control keywords
        if (['writecontrol', 'writeformat', 'timeformat'].some(k => lower.includes(k))) {
            return vscode.SymbolKind.EnumMember;
        }
        
        // Solver properties
        if (['solver', 'preconditioner', 'smoother'].includes(lower)) {
            return vscode.SymbolKind.TypeParameter;
        }
        
        // Tolerance/numerical values
        if (['tolerance', 'reltol', 'mincorrectors', 'maxcorrectors'].some(k => lower.includes(k))) {
            return vscode.SymbolKind.Number;
        }
        
        // Boolean-like properties
        if (value && ['true', 'false', 'yes', 'no', 'on', 'off'].includes(value.toLowerCase())) {
            return vscode.SymbolKind.Boolean;
        }
        
        // Numeric values
        if (value && !isNaN(parseFloat(value))) {
            return vscode.SymbolKind.Number;
        }
        
        // String values
        if (value && (value.startsWith('"') || value.startsWith("'"))) {
            return vscode.SymbolKind.String;
        }
        
        // Arrays/lists
        if (value && (value.startsWith('(') || value.startsWith('['))) {
            return vscode.SymbolKind.Array;
        }
        
        // Default property
        return vscode.SymbolKind.Property;
    }

    private getSymbolTags(label: string, nodeType?: string): vscode.SymbolTag[] | undefined {
        const lower = label.toLowerCase();
        
        // Mark deprecated features
        if (['deprecated', 'obsolete'].some(k => lower.includes(k))) {
            return [vscode.SymbolTag.Deprecated];
        }
        
        return undefined;
    }
}
