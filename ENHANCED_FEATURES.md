# FoamStudio - Enhanced Features Guide

## Overview
FoamStudio now includes advanced IntelliSense features and comprehensive syntax highlighting for OpenFOAM dictionary files, matching the capabilities of popular modern IDEs.

## 🎨 Color-Coded Outline

The outline view now uses distinct colors for different element types, making navigation much easier:

### Symbol Types & Colors
- **📦 Package** (Cyan): FoamFile headers
- **⏱️ Event** (Yellow): Time control blocks (controlDict, startFrom, stopAt)
- **🔧 Class** (Orange): General scheme blocks
- **📐 TypeParameter** (Purple): ddtSchemes
- **🔌 Interface** (Teal): gradSchemes
- **📋 Enum** (Blue): divSchemes
- **🏗️ Struct** (Green): laplacianSchemes
- **🔸 EnumMember** (Light Blue): interpolationSchemes
- **⚙️ Operator** (Magenta): snGradSchemes
- **⚡ Method** (Yellow-Orange): Solver configurations
- **🏗️ Constructor** (Pink): Algorithm blocks (SIMPLE, PIMPLE, PISO)
- **📦 Module** (Purple): Relaxation factors
- **🏷️ Field** (Light Green): Fields and equations
- **🔧 Function** (Blue): Function objects
- **📌 Constant** (Red): Boundary conditions
- **🔢 Number** (Green): Numerical values
- **✅ Boolean** (Blue): Boolean values
- **📝 String** (Orange): String values
- **📚 Array** (Purple): Lists and arrays
- **🔑 Property** (Default): Generic properties

### Example
```
📦 FoamFile
  ├─ 📋 divSchemes
  │   ├─ 🔑 default
  │   ├─ 🔑 div(phi,U)
  │   └─ 🔑 div(phi,k)
  ├─ ⚡ solvers
  │   ├─ ⚡ p
  │   │   ├─ 📐 solver (PCG)
  │   │   ├─ 🔢 tolerance
  │   │   └─ 🔢 relTol
  │   └─ ⚡ U
  └─ 🏗️ SIMPLE
      └─ 🔢 nNonOrthogonalCorrectors
```

## 🎯 Enhanced IntelliSense

### 1. Smart Context-Aware Completions

#### Field Name Suggestions
When typing `div(phi,` or `grad(`, you'll get:
- `U` - Velocity field
- `p` - Pressure field
- `T` - Temperature field
- `k` - Turbulent kinetic energy
- `epsilon` - Turbulent dissipation rate
- `omega` - Specific dissipation rate
- `nut` - Turbulent viscosity

#### Boundary Condition Completions
Inside boundary field blocks, get instant access to:
- `fixedValue` - Fixed (Dirichlet) BC with value template
- `zeroGradient` - Zero gradient (Neumann) BC
- `noSlip` - No-slip wall (auto-completes to fixedValue uniform (0 0 0))
- `inletOutlet` - Inlet-outlet with switching logic
- `totalPressure` - Total pressure BC
- `pressureInletOutletVelocity` - Velocity BC for pressure boundaries
- Wall functions: `kqRWallFunction`, `epsilonWallFunction`, `omegaWallFunction`, `nutkWallFunction`
- And 15+ more boundary types!

#### Turbulence Model Completions
When configuring turbulence, get:
- **RAS Models**: kEpsilon, kOmegaSST (recommended), realizableKE, SpalartAllmaras, v2f
- **LES Models**: Smagorinsky, kEqn, dynamicKEqn, WALE
- **Simulation Types**: laminar, RAS, LES

### 2. Signature Help (Parameter Hints)

Get real-time parameter hints as you type:

#### Scheme Signatures
```openfoam
divSchemes
{
    div(phi,U)  Gauss [linear|upwind|linearUpwind grad(field)|QUICK|MUSCL|vanLeer]
                      ↑ Shows all available options with descriptions
}
```

#### Solver Signatures
```openfoam
solvers
{
    p
    {
        solver  [PCG|PBiCGStab|smoothSolver|GAMG|diagonal]
                ↑ Shows which solver to use based on matrix type
                  PCG: symmetric matrices (pressure)
                  PBiCGStab: asymmetric matrices (velocity, turbulence)
    }
}
```

#### Vector Signatures
```openfoam
internalField   uniform (x y z);
                        ↑ Shows parameter names for each component
```

### 3. Code Actions (Quick Fixes & Refactorings)

Right-click or press `Ctrl+.` (Cmd+. on Mac) to access:

#### Quick Fixes
- **Add missing semicolon** - Automatically adds `;` to statements
- **Make scheme bounded** - Converts `Gauss upwind` → `bounded Gauss upwind`
- **Add tolerance settings** - Adds tolerance and relTol to solver blocks
- **Format scheme with spaces** - Fixes `GaussLinear` → `Gauss linear`
- **Fix typos** - Corrects `Gaus` → `Gauss`
- **Add FoamFile header** - Inserts proper FoamFile block at top

#### Smart Templates
- **Add default scheme block** - When you type `ddtSchemes` and press Enter, get:
  ```openfoam
  ddtSchemes
  {
      default         Euler;
  }
  ```
- **Add solver template** - Typing `solvers` gives you a complete p/U solver setup
- **Fill in boundary conditions** - Quick templates for common BC types

### 4. Inlay Hints (Inline Type Information)

See helpful annotations directly in your code:

#### Unit Hints
```openfoam
deltaT          0.001;  /* seconds */
tolerance       1e-06;  /* convergence threshold */
viscosity       1e-05;  /* m²/s */
density         1000;   /* kg/m³ */
```

#### Scheme Order Hints
```openfoam
ddtSchemes
{
    default     Euler;          /* 1st order */
    default     backward;       /* 2nd order */
    default     CrankNicolson;  /* 2nd order */
}

divSchemes
{
    div(phi,U)  Gauss linear;   /* 2nd order */
    div(phi,k)  Gauss upwind;   /* 1st order */
}
```

#### Solver Type Hints
```openfoam
solvers
{
    p
    {
        solver      PCG;        /* symmetric */
    }
    U
    {
        solver      PBiCGStab;  /* asymmetric */
    }
}
```

#### Dimension Hints
```openfoam
dimensions      [0 1 -1 0 0 0 0];  /* velocity [m/s] */
dimensions      [0 2 -2 0 0 0 0];  /* pressure [m²/s²] */
dimensions      [0 2 -1 0 0 0 0];  /* kinematic viscosity [m²/s] */
```

### 5. Enhanced Hover Documentation

Hover over any keyword to see:
- **Detailed description**
- **Category** (controlDict, fvSchemes, fvSolution, etc.)
- **Valid values** (if applicable)
- **Examples** with syntax highlighting
- **Additional documentation**
- **Links to OpenFOAM documentation**

Example hover for `kOmegaSST`:
```
### kOmegaSST

*Category: Turbulence Model*

k-omega SST turbulence model

**Details:**
Shear Stress Transport model, combines k-omega near walls
with k-epsilon in freestream. Recommended for most applications.

**Valid for:** Incompressible and compressible flows

[OpenFOAM Documentation](https://www.openfoam.com/documentation/)
```

### 6. Advanced Snippets

Type these triggers and press Tab:

- `foamfile` - Complete FoamFile header
- `solver-block` - Full solver configuration with presets
- `SIMPLE` - SIMPLE algorithm block with residualControl
- `PIMPLE` - PIMPLE algorithm configuration
- `relaxation` - Relaxation factors for fields and equations
- `ddtSchemes` - Time derivative schemes block
- `gradSchemes` - Gradient schemes with common options
- `divSchemes` - Divergence schemes with bounded options
- `laplacianSchemes` - Laplacian schemes with correction
- `function-probes` - Probes function object
- `function-forces` - Forces function object

Example - type `PIMPLE` and press Tab:
```openfoam
PIMPLE
{
    nOuterCorrectors        1;
    nCorrectors             2;
    nNonOrthogonalCorrectors    0;
}
```

## 🎨 Syntax Highlighting Improvements

Enhanced token recognition for:
- Function names and keywords
- Numerical values with scientific notation
- String literals
- Comments (single and multi-line)
- Operators and delimiters
- Special OpenFOAM types (uniform, nonuniform, etc.)
- Dimension sets `[0 1 -1 0 0 0 0]`
- File paths and references

## 🔍 Additional Features

### Go to Definition
- Jump to field definitions
- Navigate to included files
- Find block declarations

### Find All References
- See where fields are used
- Track scheme references
- Identify boundary patch usages

### Document Formatting
- Auto-indent based on block nesting
- Consistent spacing
- Alignment of values
- Keyboard shortcut: `Alt+Shift+F` (Windows/Linux) or `Option+Shift+F` (Mac)

### Real-time Validation
- Syntax error detection
- Missing bracket warnings
- Invalid keyword highlighting
- Mismatched parentheses alerts

### Tree View
- Hierarchical file structure
- Click to jump to definition
- Expand/collapse blocks
- Visual block nesting

## ⚙️ Configuration

Enable/disable inlay hints in VS Code settings:
```json
{
    "editor.inlayHints.enabled": "on",
    "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": true
    },
    "editor.parameterHints.enabled": true,
    "editor.suggestOnTriggerCharacters": true
}
```

## 🚀 Tips for Maximum Productivity

1. **Use Tab completion**: Don't type everything - let IntelliSense do the work
2. **Leverage snippets**: Type `SIMPLE`, `PIMPLE`, etc. for instant blocks
3. **Watch for inlay hints**: They provide valuable context about your settings
4. **Use Quick Fixes**: Press `Ctrl+.` to fix common issues instantly
5. **Navigate with outline**: Use the colored outline for quick file navigation
6. **Hover for help**: Unsure about a keyword? Hover for instant documentation
7. **Signature help**: Watch parameter hints as you type function arguments

## 📚 OpenFOAM Resources

The extension integrates with official OpenFOAM documentation:
- [OpenFOAM User Guide](https://www.openfoam.com/documentation/user-guide)
- [OpenFOAM C++ Documentation](https://www.openfoam.com/documentation/cpp-guide)
- [CFD Direct](https://cfd.direct/openfoam/user-guide/)

## 🐛 Troubleshooting

**Completions not showing?**
- Check that file is recognized as `openfoam` language (bottom-right status bar)
- Ensure trigger characters are enabled in settings
- Try typing a space after keywords

**Outline not color-coded?**
- Colors depend on VS Code theme
- Try different themes to see various color schemes
- Restart VS Code after installing the extension

**Inlay hints not appearing?**
- Enable in Settings: Search for "inlay hints"
- Check `editor.inlayHints.enabled` is set to `"on"`

## 🎉 What's Next?

Upcoming features:
- Semantic highlighting with custom token colors
- Code lens for mesh statistics
- Integration with OpenFOAM utilities (blockMesh, checkMesh, etc.)
- Live mesh quality feedback
- Snippet library expansion
- Multi-file workspace support
- Case structure validation

---

**Enjoy your enhanced OpenFOAM development experience!** 🚀
