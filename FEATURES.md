# FoamStudio - Professional OpenFOAM Extension for VS Code

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/Arefhm94/foamstudio)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)

**FoamStudio** is a comprehensive Visual Studio Code extension providing professional-grade support for OpenFOAM dictionary files, featuring advanced syntax highlighting, intelligent IntelliSense, semantic validation, and powerful code navigation.

## ✨ Features

### 🎨 Advanced Syntax Highlighting

Rich, context-aware syntax highlighting for all OpenFOAM file types:

- **FoamFile Headers**: Special highlighting for OpenFOAM file headers with proper C++ comment detection
- **Keywords**: Color-coded keywords for controlDict, fvSchemes, fvSolution, and more
- **Schemes**: Distinct highlighting for time schemes (Euler, backward, CrankNicolson)
- **Solvers**: Syntax highlighting for linear solvers (PCG, GAMG, PBiCGStab, smoothSolver)
- **Functions**: Special coloring for function objects (probes, forces, fieldAverage)
- **Boundary Conditions**: Highlighting for BC types (fixedValue, zeroGradient, inletOutlet)
- **Preprocessor Directives**: Support for #include, #ifdef, and macro definitions
- **Vectors & Tensors**: Proper highlighting for OpenFOAM data structures
- **Numbers**: Scientific notation, floats, and integers with proper recognition
- **Comments**: Line and block comments with proper nesting support

### 🚀 Intelligent IntelliSense

Context-aware autocompletion that understands your OpenFOAM files:

#### Smart Completions
- **Context Awareness**: Completions adapt based on the current block (ddtSchemes, solvers, etc.)
- **400+ Keywords**: Comprehensive database covering all major OpenFOAM dictionaries
- **Detailed Documentation**: Each completion includes description, valid values, and usage examples
- **Scheme Suggestions**: Intelligent suggestions for discretization schemes
- **Solver Configurations**: Pre-configured solver blocks with common settings

#### Code Snippets
Type these triggers for instant code blocks:

- `foamfile` - Complete FoamFile header
- `solver-block` - Solver configuration with all parameters
- `SIMPLE` - SIMPLE algorithm settings
- `PIMPLE` - PIMPLE algorithm configuration
- `relaxation` - Relaxation factors block
- `ddtSchemes` - Time derivative schemes block
- `gradSchemes` - Gradient schemes block
- `divSchemes` - Divergence schemes block
- `laplacianSchemes` - Laplacian schemes block
- `function-probes` - Probes function object
- `function-forces` - Forces function object

### 📖 Rich Hover Documentation

Hover over any keyword to see:
- **Comprehensive Description**: Detailed explanation of the keyword
- **Category**: Which dictionary/section it belongs to
- **Valid Values**: List of acceptable values with explanations
- **Usage Examples**: Code examples showing proper usage
- **Official Documentation Links**: Quick access to OpenFOAM documentation

Includes documentation for:
- 100+ OpenFOAM keywords with detailed explanations
- Solver applications (simpleFoam, pimpleFoam, interFoam, etc.)
- Field types (U, p, k, epsilon, omega, nut, alpha)
- Turbulence models (k-epsilon, k-omega-SST, Spalart-Allmaras)
- Utilities (blockMesh, snappyHexMesh, checkMesh)

### 🔍 Semantic Validation

Real-time error detection and validation:

#### Syntax Checking
- **Brace Matching**: Detects unmatched braces with precise error locations
- **Parentheses Validation**: Ensures proper vector/list syntax
- **Semicolon Hints**: Smart suggestions (understands when semicolons are optional)

#### Semantic Analysis
- **Solver Validation**: Verifies solver names against known types (PCG, GAMG, etc.)
- **Preconditioner Checking**: Validates preconditioner names
- **Smoother Verification**: Checks smoother types
- **Scheme Validation**: Ensures time schemes are valid
- **Typo Detection**: Catches common misspellings with suggestions

#### Smart Diagnostics
- **Error**: Critical syntax errors (unmatched braces)
- **Warning**: Potential issues (unknown solver names)
- **Information**: Typo suggestions
- **Hint**: Optional improvements (missing semicolons)

### 🗂️ OpenFOAM Outline View

Hierarchical tree view of your OpenFOAM file structure:
- Navigate complex dictionaries with ease
- Click any item to jump to its definition
- Collapsible blocks for better organization
- Shows FoamFile header and all major sections

### 🔗 Code Navigation

Professional navigation features:

#### Go to Definition
- Jump to where fields and variables are defined
- Navigate through complex dictionary hierarchies
- Quick access to subdictionary definitions

#### Find All References
- See all uses of a field or variable
- Understand dependencies across your configuration
- Refactor with confidence

### ✏️ Code Formatting

Automatic code formatting with customizable settings:

#### Document Formatting
- **Consistent Indentation**: Proper nesting of blocks
- **Brace Alignment**: Clean, readable bracket placement
- **Comment Preservation**: Maintains FoamFile headers and special comments
- **Configurable Spacing**: Tabs or spaces with custom size

#### Range Formatting
- Format selected text only
- Preserves surrounding code style
- Quick cleanup of pasted code

Use:
- Right-click → "Format Document" or "Format Selection"
- Keyboard: `Shift+Alt+F` (Format Document)
- Auto-format on save (enable in VS Code settings)

### 📋 Supported Files

FoamStudio automatically activates for:

**System Dictionaries:**
- `controlDict` - Simulation control parameters
- `fvSchemes` - Discretization schemes
- `fvSolution` - Linear solver settings
- `decomposeParDict` - Domain decomposition
- `fvOptions` - Source terms and constraints

**Mesh Dictionaries:**
- `blockMeshDict` - Structured mesh generation
- `snappyHexMeshDict` - Automatic mesh generation
- `surfaceFeatureExtractDict` - Feature extraction

**Custom Files:**
- `*.dict` - Any file with .dict extension
- `caseSetupDict` - Case setup configuration
- `helyxHexMeshDict` - HELYX mesh generation

## 📦 Installation

### From VS Code Marketplace (Coming Soon)
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "FoamStudio"
4. Click Install

### From Source
1. Clone the repository:
   ```bash
   git clone https://github.com/Arefhm94/foamstudio.git
   cd foamstudio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the extension:
   ```bash
   npm run compile
   ```

4. Press F5 to launch Extension Development Host

## 🎯 Usage

### Quick Start

1. **Open an OpenFOAM Case**: Open any OpenFOAM dictionary file in VS Code

2. **Start Typing**: IntelliSense will automatically suggest keywords and values

3. **Hover for Help**: Hover over any keyword to see documentation

4. **Use Snippets**: Type snippet triggers like `foamfile` or `solver-block` and press Tab

5. **Format Code**: Right-click and select "Format Document" for clean formatting

6. **Navigate**: Click on fields in the Outline view to jump to definitions

### Tips & Tricks

#### Enable Format on Save
```json
{
    "[openfoam]": {
        "editor.formatOnSave": true
    }
}
```

#### Customize Tab Size
```json
{
    "[openfoam]": {
        "editor.tabSize": 4,
        "editor.insertSpaces": true
    }
}
```

#### Use IntelliSense Effectively
- Press `Ctrl+Space` to manually trigger completions
- Start typing and arrow through suggestions
- Press `Tab` or `Enter` to accept a completion
- Press `Escape` to dismiss suggestions

## 🔧 Extension Settings

Currently, FoamStudio works out of the box with sensible defaults. Future versions will add customizable settings for:
- Color themes for different syntax elements
- Validation strictness levels
- Custom snippet definitions
- Format style preferences

## 🐛 Known Issues

- Validation of field references across multiple files is limited
- Some complex nested structures may have incomplete syntax highlighting
- Performance on very large dictionary files (>10,000 lines) may be slower

## 📝 Release Notes

### Version 0.1.0 (Current)

**Major Features:**
- ✅ Comprehensive syntax highlighting with 15+ token types
- ✅ Context-aware IntelliSense with 400+ keywords
- ✅ Rich hover documentation with examples
- ✅ Real-time semantic validation
- ✅ Code navigation (Go to Definition, Find References)
- ✅ Document formatting with range support
- ✅ 11 code snippets for common patterns
- ✅ OpenFOAM Outline tree view

**Improvements:**
- Enhanced TextMate grammar for better syntax recognition
- Comprehensive keyword database with detailed documentation
- Smart validation that understands OpenFOAM syntax nuances
- Professional formatting that preserves special comments

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue with detailed reproduction steps
2. **Suggest Features**: Propose new features via GitHub issues
3. **Submit PRs**: Fork, develop, and submit pull requests
4. **Improve Documentation**: Help improve this README or inline docs
5. **Add Keywords**: Expand the keyword database with more OpenFOAM terms

### Development Setup

```bash
# Clone the repo
git clone https://github.com/Arefhm94/foamstudio.git
cd foamstudio

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes (auto-recompile)
npm run watch

# Launch extension development host
# Press F5 in VS Code
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- OpenFOAM Foundation for the amazing CFD toolkit
- VS Code team for the excellent extension API
- The OpenFOAM community for documentation and examples

## 📬 Contact

- **Author**: Aref Moalemi
- **GitHub**: [@Arefhm94](https://github.com/Arefhm94)
- **Repository**: [foamstudio](https://github.com/Arefhm94/foamstudio)

## 🔗 Resources

- [OpenFOAM Official Website](https://www.openfoam.com/)
- [OpenFOAM Documentation](https://www.openfoam.com/documentation/)
- [VS Code Extension API](https://code.visualstudio.com/api)

---

**Made with ❤️ for the OpenFOAM community**
