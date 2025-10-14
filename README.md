# FoamStudio - OpenFOAM VS Code Extension

FoamStudio is a Visual Studio Code extension that provides comprehensive support for OpenFOAM dictionary files and configuration files.

## Features

- **Syntax Highlighting**: Enhanced syntax highlighting for OpenFOAM files including:
  - Keywords (FoamFile, ddtSchemes, gradSchemes, divSchemes, etc.)
  - Numerical values
  - Boolean values (true/false, yes/no, on/off)
  - Comments (// and /* */)
  - Strings and dictionary structures

- **Document Outline**: Interactive tree view showing the hierarchical structure of OpenFOAM files
  - Navigate to specific sections by clicking on tree items
  - Automatically updates when file content changes
  - Shows nested dictionary structures

- **Symbol Provider**: Enhanced document symbols for better navigation
  - Go to symbol functionality (Ctrl+Shift+O)
  - Breadcrumb navigation
  - Proper symbol classification (File, Class, Object, Variable, Property)

## Supported File Types

The extension automatically activates for the following OpenFOAM files:
- `.dict` files
- `controlDict`
- `fvSchemes`
- `fvSolution`
- `caseSetupDict`
- `decomposeParDict`
- `fvOptions`
- `helyxHexMeshDict`
- `probesLocation`
- `surfaceFeatureExtractDict`
- `surfaceIntersectionDict`
- `topoSetDict`

## Usage

1. Open any supported OpenFOAM file
2. The extension will automatically:
   - Apply syntax highlighting
   - Show the "OpenFOAM Outline" tree view in the Explorer panel
   - Enable symbol navigation

3. Use the tree view to navigate through the file structure
4. Click on any item in the tree to jump to that line in the editor

## Commands

- `foamstudio.helloWorld`: Test command
- `foamstudio.revealLine`: Navigate to specific line (used internally by tree view)

## Development

To develop this extension:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Open in VS Code
4. Press F5 to launch a new Extension Development Host
5. Open OpenFOAM files to test the extension functionality

## Example Files

The `example_foam/` directory contains sample OpenFOAM files for testing the extension functionality.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
