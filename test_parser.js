// Test the OpenFOAM parser with a sample file
const vscode = require('vscode');
const { parseOpenFOAMFile } = require('./out/openfoamParser');

// Create a mock document for testing
const mockDocument = {
    lineCount: 15,
    lineAt: (line) => {
        const lines = [
            'FoamFile',
            '{',
            '    version     2.0;',
            '    format      ascii;',
            '    class       dictionary;',
            '}',
            '',
            'ddtSchemes',
            '{',
            '    default         Euler;',
            '}',
            '',
            'application     simpleFoam;',
            'startTime       0;',
            'endTime         1000;'
        ];
        return {
            text: lines[line] || '',
            firstNonWhitespaceCharacterIndex: lines[line] ? lines[line].length - lines[line].trimStart().length : 0
        };
    }
};

// Test the parser
const nodes = parseOpenFOAMFile(mockDocument);
console.log('Parsed OpenFOAM structure:');
console.log(JSON.stringify(nodes, null, 2));
