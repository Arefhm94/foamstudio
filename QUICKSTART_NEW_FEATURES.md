# Quick Start Guide - New Features

## 🚀 Get Started in 5 Minutes

### 1. Reload Your Extension
- Press `F5` in VS Code to launch Extension Development Host
- OR Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac) → "Developer: Reload Window"

### 2. Open an OpenFOAM File
Try these example files:
- `example_foam/fvSchemes`
- `example_foam/fvSolution`
- `example_foam/controlDict`

### 3. Check the Color-Coded Outline
1. Open the Outline view: `View → Open View → Outline` (or Ctrl+Shift+O)
2. Notice the different icons for:
   - 📦 FoamFile (cyan/blue)
   - 🔧 Schemes (various colors)
   - ⚡ Solvers (yellow/orange)
   - 🏗️ Algorithms like SIMPLE/PIMPLE (pink)
3. Click any item to jump to it!

### 4. Try Smart Completions

#### Test 1: Field Names
```openfoam
divSchemes
{
    div(phi,|)  // <- Type here, you'll see: U, p, k, epsilon, etc.
}
```

#### Test 2: Boundary Conditions
```openfoam
boundaryField
{
    inlet
    {
        type    |  // <- Type here for: fixedValue, zeroGradient, etc.
    }
}
```

#### Test 3: Turbulence Models
```openfoam
simulationType  |  // <- Type here for: RAS, LES, laminar
RASModel        |  // <- Type here for: kOmegaSST, kEpsilon, etc.
```

### 5. Use Signature Help
Type these and watch for parameter hints:
```openfoam
div(phi,U)  Gauss |  // <- See all scheme options

solver  |  // <- See: PCG, PBiCGStab, smoothSolver, etc.
```

### 6. Try Quick Fixes
1. Type this line:
   ```openfoam
   div(phi,U)  Gauss upwind
   ```
2. Right-click or press `Ctrl+.` (Cmd+. on Mac)
3. See "Make scheme bounded" option
4. Apply it to get: `bounded Gauss upwind`

### 7. Use Snippets
Type these and press Tab:

**SIMPLE Algorithm:**
```openfoam
SIMPLE<Tab>
```
Expands to:
```openfoam
SIMPLE
{
    nNonOrthogonalCorrectors    0;
    residualControl
    {
        p        1e-04;
        U        1e-04;
    }
}
```

**Solver Block:**
```openfoam
solver-block<Tab>
```
Expands to complete solver configuration with placeholders.

**Complete Schemes:**
```openfoam
ddtSchemes<Tab>
gradSchemes<Tab>
divSchemes<Tab>
```

### 8. View Inlay Hints
Look for inline comments in your code:
```openfoam
deltaT          0.001;  /* seconds */
solver          PCG;    /* symmetric */
default         Euler;  /* 1st order */
```

These appear automatically! (Can be toggled in settings)

## 🎯 Most Useful Features

### For Beginners:
1. **Hover documentation** - Hover over any keyword to learn what it does
2. **Snippets** - Use templates instead of typing everything
3. **Inlay hints** - Learn what units and types mean

### For Intermediate Users:
1. **Smart completions** - Faster typing with context-aware suggestions
2. **Quick fixes** - Instantly fix common mistakes
3. **Color-coded outline** - Navigate large files easily

### For Advanced Users:
1. **Signature help** - Quick reference without leaving the editor
2. **Field suggestions** - Auto-complete field names in schemes
3. **Boundary condition templates** - Instant BC setup

## 🔧 Settings

### Enable All Features
Add to your `settings.json`:
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

### Disable Inlay Hints (if too busy)
```json
{
    "editor.inlayHints.enabled": "off"
}
```

## 💡 Pro Tips

1. **Press Ctrl+Space** anytime to trigger completions manually
2. **Press Ctrl+Shift+Space** to see signature help
3. **Press Ctrl+.** for quick fixes and code actions
4. **Type partial names** and let IntelliSense complete them
5. **Use Tab** to navigate through snippet placeholders
6. **Right-click in outline** for additional navigation options

## 🎨 Common Workflows

### Setting Up a New Solver Configuration
1. Type `solvers` and press Enter
2. Right-click → "Add solver template"
3. Get instant p/U solver setup
4. Modify values as needed

### Creating a Boundary Condition
1. In boundaryField block, type patch name
2. Type `type ` (with space)
3. See all BC options
4. Select one (like `fixedValue`)
5. Template expands with value field
6. Fill in your value

### Configuring Schemes
1. Type `divSchemes` and press Tab
2. Get complete block with common entries
3. Modify div(phi,U) line
4. Type `Gauss ` to see options
5. Select scheme with hints

### Finding Issues
1. Look at outline for structure overview
2. Hover over unknown keywords
3. Use quick fixes for syntax errors
4. Check inlay hints for correctness

## 📚 Learn More

- See `ENHANCED_FEATURES.md` for complete feature list
- Check `ENHANCEMENT_SUMMARY.md` for technical details
- OpenFOAM docs: https://www.openfoam.com/documentation/

## 🎉 Have Fun!

Explore the features and discover your favorites. The extension learns from your usage patterns and gets smarter over time!

Happy CFD coding! 🌊
