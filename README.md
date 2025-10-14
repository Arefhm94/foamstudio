# FoamStudio

> **Advanced OpenFOAM Development Tools for Visual Studio Code**

FoamStudio provides comprehensive language support for OpenFOAM dictionary files with professional-grade IntelliSense, color-coded navigation, and productivity features that rival the best IDE extensions.

![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎨 Color-Coded Outline
Navigate your OpenFOAM files effortlessly with a color-coded outline view that uses distinct icons and colors for different element types:
- **Scheme blocks** - Each type (ddt, grad, div, laplacian) gets unique colors
- **Solver configurations** - Highlighted for easy identification
- **Algorithm blocks** - SIMPLE, PIMPLE, PISO stand out
- **Fields and values** - Different colors for numbers, booleans, strings, arrays

### 🎯 Smart IntelliSense
Context-aware auto-completion that understands what you're typing:
- **Field name suggestions** when working with schemes
- **20+ boundary condition types** with instant templates
- **Turbulence models** (RAS and LES)
- **Numerical schemes** with accuracy hints
- **Solver types** optimized for matrix characteristics

### 💡 Parameter Hints
Real-time guidance as you type:
- Shows all available scheme options
- Displays solver recommendations based on matrix type
- Guides vector/tensor syntax

### 🔧 Quick Fixes & Code Actions
Right-click or press `Ctrl+.` for instant fixes:
- Add missing semicolons
- Convert to bounded schemes
- Add tolerance parameters
- Fix common typos
- Insert complete templates

### 📝 Inline Hints
Helpful annotations directly in your code:
- **Unit labels** - See m/s, kg/m³, seconds, etc.
- **Scheme accuracy** - 1st order, 2nd order indicators
- **Solver types** - Symmetric vs asymmetric
- **Physical dimensions** - Understand dimension sets

### 🚀 Advanced Snippets
Productivity boosters - type and press Tab:
- `foamfile` - Complete FoamFile header
- `SIMPLE` - Full algorithm block with residualControl
- `PIMPLE` - PIMPLE configuration
- `solver-block` - Complete solver setup
- `divSchemes`, `gradSchemes`, etc. - Scheme templates
- `function-probes`, `function-forces` - Function objects

### 📚 Rich Hover Documentation
Hover over any keyword for:
- Detailed descriptions
- Valid values
- Usage examples
- Links to official documentation

### 🔍 Additional Features
- **Syntax highlighting** - Comprehensive token recognition
- **Document formatting** - Auto-indent and alignment (`Alt+Shift+F`)
- **Go to Definition** - Jump to field definitions
- **Find All References** - Track field usage
- **Real-time validation** - Catch syntax errors as you type
- **Tree view** - Hierarchical file structure visualization

## 📦 Installation

### From VS Code Marketplace
1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
3. Search for "FoamStudio"
4. Click Install

### From Source
```bash
git clone https://github.com/Arefhm94/foamstudio.git
cd foamstudio
npm install
npm run compile
```

Press `F5` to launch the Extension Development Host.

## 🚀 Quick Start

1. **Open an OpenFOAM file** - fvSchemes, fvSolution, controlDict, etc.
2. **Check the Outline** - View the color-coded structure
3. **Start typing** - Experience smart completions
4. **Use snippets** - Type `SIMPLE` and press Tab
5. **Hover for help** - Learn about any keyword

See [QUICKSTART_NEW_FEATURES.md](QUICKSTART_NEW_FEATURES.md) for a detailed walkthrough.

## 📖 Documentation

- [Quick Start Guide](QUICKSTART_NEW_FEATURES.md) - Get started in 5 minutes
- [Enhanced Features](ENHANCED_FEATURES.md) - Complete feature reference
- [Release Notes](RELEASE_NOTES_v0.2.md) - What's new in v0.2.0

## 🎬 Demo

**Color-Coded Outline:**
```
📦 FoamFile
├─ 📋 divSchemes (Blue Enum)
│   ├─ 🔑 default
│   ├─ 🔑 div(phi,U)
│   └─ 🔑 div(phi,k)
├─ ⚡ solvers (Yellow Method)
│   ├─ ⚡ p
│   │   ├─ 📐 solver
│   │   ├─ 🔢 tolerance
│   │   └─ 🔢 relTol
│   └─ ⚡ U
└─ 🏗️ SIMPLE (Pink Constructor)
    └─ 🔢 nNonOrthogonalCorrectors
```

**Smart Completions:**
```openfoam
divSchemes
{
    div(phi,|)  ← Type here for: U, p, k, epsilon...
}

solvers
{
    p
    {
        solver  |  ← PCG /* symmetric */
                   PBiCGStab /* asymmetric */
    }
}
```

## ⚙️ Configuration

Recommended settings for optimal experience:

```json
{
    "editor.inlayHints.enabled": "on",
    "editor.parameterHints.enabled": true,
    "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": true
    },
    "editor.suggestOnTriggerCharacters": true,
    "editor.tabCompletion": "on"
}
```

## 🎯 Supported Files

- `controlDict`
- `fvSchemes`
- `fvSolution`
- `caseSetupDict`
- `decomposeParDict`
- `fvOptions`
- `blockMeshDict`
- `snappyHexMeshDict`
- Any `.dict` file
- And more...

## 🛠️ Development

### Building
```bash
npm install
npm run compile
```

### Testing
```bash
npm run watch  # Compile in watch mode
# Press F5 to launch Extension Development Host
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- OpenFOAM Foundation for the amazing CFD toolkit
- VS Code team for the excellent extension API
- The CFD community for feedback and suggestions

## 📧 Contact

- **Author**: Aref Moalemi
- **GitHub**: [@Arefhm94](https://github.com/Arefhm94)
- **Repository**: [foamstudio](https://github.com/Arefhm94/foamstudio)

## 🌟 Star History

If you find FoamStudio useful, please consider giving it a star on GitHub!

---

**Happy CFD Coding!** 🌊💻
