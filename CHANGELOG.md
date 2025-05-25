# Change Log

All notable changes to the "foamstudio" extension will be documented in this file.

## [0.0.1] - 2025-05-25

### Added
- Initial release of FoamStudio extension
- Syntax highlighting for OpenFOAM dictionary files
- Document outline tree view showing hierarchical structure
- Symbol provider for enhanced navigation
- Support for multiple OpenFOAM file types:
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

### Features
- Interactive tree view in Explorer panel
- Click-to-navigate functionality in outline
- Automatic file detection and parsing
- Enhanced syntax highlighting with proper OpenFOAM keywords
- Document symbols for breadcrumb navigation
- Real-time outline updates when file content changes

### Technical Implementation
- TypeScript-based extension architecture
- Recursive parser for nested dictionary structures
- VS Code TreeDataProvider implementation
- DocumentSymbolProvider for enhanced navigation
- TextMate grammar for syntax highlighting