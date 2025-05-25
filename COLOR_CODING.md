# OpenFOAM Outline Color Coding

The FoamStudio extension uses a sophisticated color coding system in the outline tree view to help you quickly identify different types of OpenFOAM configuration elements.

## Color Legend

### 🔵 **Blue - Blocks/Sections** (`charts.blue`)
- **Icon**: 📁 (folder)
- **Examples**: `fvSchemes`, `gradSchemes`, `divSchemes`, `relaxationFactors`
- **Description**: Main configuration sections that contain nested elements

### 🟢 **Green - Key-Value Pairs** (`charts.green`)
- **Icon**: 🔧 (symbol-property)
- **Examples**: `application = simpleFoam`, `startTime = 0`
- **Description**: Direct assignments with equals sign

### 🟠 **Orange - Configuration Keys** (`charts.orange`)
- **Icon**: 🔑 (symbol-key)
- **Examples**: `default`, `grad(p)`, `div(phi,U)`
- **Description**: Configuration keys that define settings

### 🟣 **Purple - Numeric Values** (`charts.purple`)
- **Icon**: 🔢 (symbol-number)
- **Examples**: `1000`, `0.7`, `1.5e-5`
- **Description**: Numerical values (integers, floats, scientific notation)

### 🔴 **Red - Boolean Values** (`charts.red`)
- **Icon**: ✅ (symbol-boolean)
- **Examples**: `true`, `false`, `yes`, `no`, `on`, `off`
- **Description**: Boolean configuration values

### 🟡 **Yellow - String Values** (`charts.yellow`)
- **Icon**: 📝 (symbol-string)
- **Examples**: `"system"`, `"binary"`
- **Description**: Quoted string values

### 🟣 **Purple - Other Values** (`charts.purple`)
- **Icon**: 📊 (symbol-constant)
- **Examples**: `Euler`, `Gauss linear`, `bounded`
- **Description**: Other configuration values and constants

## Features

- **Tooltips**: Hover over any item to see detailed information about its type
- **Click Navigation**: Click any item to jump to that line in the editor
- **Refresh Button**: Manual refresh of the outline view
- **Collapse All**: Collapse all sections at once
- **Auto-Update**: Outline updates automatically when you edit the file

## Filtered Content

The outline automatically excludes:
- OpenFOAM file headers (ASCII art)
- `FoamFile` metadata blocks
- Comment lines
- Empty lines and braces

This ensures you see only the meaningful configuration content.
