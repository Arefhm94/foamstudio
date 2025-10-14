# Change Log

All notable changes to the "foamstudio" extension will be documented in this file.

## [0.0.1] - 2025-05-25

### Added
# Changelog

All notable changes to the "FoamStudio" extension will be documented in this file.

## [0.2.0] - 2025-01-XX

### 🎉 Major Feature Release

#### Added
- **Color-Coded Outline**: 15+ distinct symbol types with unique colors
  - Scheme blocks (ddtSchemes, gradSchemes, divSchemes, etc.) each get unique colors
  - Solver configurations highlighted as methods
  - Algorithm blocks (SIMPLE, PIMPLE, PISO) shown as constructors
  - Fields, numbers, booleans, strings, arrays properly typed
  
- **Signature Help Provider**: Real-time parameter hints
  - Scheme signature hints with all available options
  - Solver recommendations based on matrix type
  - Vector/tensor parameter guidance
  
- **Code Actions Provider**: Quick fixes and refactorings
  - Add missing semicolons
  - Convert to bounded schemes
  - Add tolerance parameters to solver blocks
  - Fix common typos (e.g., Gaus → Gauss)
  - Add FoamFile header
  - Format schemes with proper spacing
  - Insert complete templates for schemes and solvers
  
- **Inlay Hints Provider**: Inline type information
  - Unit annotations (seconds, m/s, kg/m³, etc.)
  - Scheme accuracy hints (1st order, 2nd order, 3rd order)
  - Solver type hints (symmetric, asymmetric, multigrid)
  - Physical dimension explanations
  
- **Enhanced Completions**:
  - Field name suggestions (U, p, k, epsilon, omega, etc.)
  - 20+ boundary condition types with templates
  - Turbulence model completions (RAS and LES models)
  - Context-aware sorting and filtering
  - Completion item resolution for additional details

- **Advanced Snippets**:
  - `foamfile` - Complete FoamFile header
  - `solver-block` - Full solver configuration
  - `SIMPLE` - SIMPLE algorithm with residualControl
  - `PIMPLE` - PIMPLE configuration
  - `relaxation` - Relaxation factors block
  - `ddtSchemes`, `gradSchemes`, `divSchemes`, `laplacianSchemes` - Complete scheme blocks
  - `function-probes` - Probes function object
  - `function-forces` - Forces function object

#### Enhanced
- **Symbol Provider**: Now uses intelligent symbol kind detection
  - Different symbol types for blocks, fields, algorithms
  - Context-aware symbol categorization
  - Better visual hierarchy in outline
  
- **Completion Provider**: 
  - Smart context detection
  - Better description formatting
  - Prioritized suggestions based on context
  - More detailed documentation in completion items

#### Documentation
- Added `ENHANCED_FEATURES.md` - Complete feature reference (350+ lines)
- Added `QUICKSTART_NEW_FEATURES.md` - 5-minute getting started guide
- Added `ENHANCEMENT_SUMMARY.md` - Technical implementation details
- Added `RELEASE_NOTES_v0.2.md` - User-friendly release announcement
- Updated `README.md` - Comprehensive project overview

## [0.1.0] - 2025-01-XX

### Initial Release

#### Added
- Basic syntax highlighting for OpenFOAM dictionary files
- Document symbol provider for outline view
- Hover provider for keyword documentation
- Completion provider with OpenFOAM keywords
- Definition provider for go-to-definition
- Reference provider for find-all-references
- Document formatting (auto-indent)
- Range formatting
- Real-time validation with diagnostics
- Tree view provider for file structure
- Support for multiple OpenFOAM file types:
  - controlDict, fvSchemes, fvSolution
  - caseSetupDict, decomposeParDict, fvOptions
  - blockMeshDict, snappyHexMeshDict
  - And more...

#### Features
- Syntax highlighting for:
  - Keywords and identifiers
  - Comments (single and multi-line)
  - Numbers (including scientific notation)
  - Strings
  - Operators and delimiters
  - Special types (uniform, nonuniform)
  - Dimension sets

- IntelliSense support:
  - Basic keyword completions
  - Scheme completions
  - Solver completions
  - Context-aware suggestions

- Documentation:
  - Hover tooltips for keywords
  - Category information
  - Valid values
  - Examples

- Navigation:
  - Go to definition
  - Find all references
  - Outline view
  - Tree view

---

## Version Format

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for added functionality (backwards compatible)
- **PATCH** version for backwards compatible bug fixes

## Categories
- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Now removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

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