// Test script to verify the OpenFOAM parser key-value separation
const { parseOpenFOAMFile } = require('./out/openfoamParser.js');

// Mock document object for testing
const mockDocument = {
    lineCount: 5,
    lineAt: (i) => {
        const lines = [
            { text: 'application     simpleFoam;', firstNonWhitespaceCharacterIndex: 0 },
            { text: 'startFrom       startTime;', firstNonWhitespaceCharacterIndex: 0 },
            { text: 'endTime         1000;', firstNonWhitespaceCharacterIndex: 0 },
            { text: 'geometry', firstNonWhitespaceCharacterIndex: 0 },
            { text: '{', firstNonWhitespaceCharacterIndex: 0 }
        ];
        return lines[i];
    }
};

try {
    const nodes = parseOpenFOAMFile(mockDocument);
    console.log('Parsed nodes:');
    nodes.forEach((node, index) => {
        console.log(`${index + 1}. ${node.label} (${node.nodeType})`);
        if (node.children) {
            node.children.forEach((child, childIndex) => {
                console.log(`   ${childIndex + 1}. ${child.label} (${child.nodeType})`);
            });
        }
    });
} catch (error) {
    console.error('Error parsing:', error);
}
