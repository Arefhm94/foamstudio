# FoamStudio Quick Start Guide

Welcome to **FoamStudio** - Your professional OpenFOAM development environment in VS Code!

## 🚀 Getting Started in 60 Seconds

### 1. Open an OpenFOAM File
Open any OpenFOAM dictionary file (e.g., `controlDict`, `fvSchemes`, `fvSolution`) in VS Code.

### 2. See It In Action
- **Syntax Highlighting**: Notice the colorful syntax highlighting automatically applied
- **Outline View**: Check the "OpenFOAM Outline" panel in the Explorer sidebar
- **IntelliSense**: Start typing "application" and watch the suggestions appear

### 3. Try These Features

#### 💡 IntelliSense Completions
1. Type `sol` and press `Ctrl+Space`
2. Select `solvers` from the list
3. Press `Enter` - it inserts the keyword with documentation!

#### 📖 Hover Documentation
1. Hover your mouse over any keyword like `deltaT`
2. See detailed explanation, valid values, and examples
3. Click documentation links for more info

#### ✏️ Code Snippets
1. Type `foamfile` and press `Tab`
2. Watch it expand into a complete FoamFile header
3. Use `Tab` to jump between fields

#### 🔍 Code Validation
1. Open a file and add a line: `slover PCG;` (note the typo)
2. See the squiggly underline suggesting "Did you mean 'solver'?"
3. Fix the typo and watch the error disappear

#### 🎨 Formatting
1. Right-click in your document
2. Select "Format Document"
3. Watch your code become beautifully indented!

---

## 📚 Essential Snippets

Type these and press `Tab`:

| Trigger | What It Creates |
|---------|----------------|
| `foamfile` | Complete FoamFile header |
| `solver-block` | Full solver configuration |
| `SIMPLE` | SIMPLE algorithm settings |
| `PIMPLE` | PIMPLE algorithm settings |
| `relaxation` | Relaxation factors |
| `ddtSchemes` | Time derivative schemes |
| `gradSchemes` | Gradient schemes |
| `divSchemes` | Divergence schemes |
| `function-probes` | Probes function object |
| `function-forces` | Forces function object |

---

## 🎯 Top 5 Productivity Tips

### 1. **Use IntelliSense Everywhere**
Press `Ctrl+Space` anywhere to see available completions. FoamStudio knows what's valid in your current context!

### 2. **Let Hover Teach You**
Don't remember what `nNonOrthogonalCorrectors` does? Just hover over it for a detailed explanation.

### 3. **Format Regularly**
Use `Shift+Alt+F` to format your entire document. Enable "Format on Save" for automatic formatting.

### 4. **Navigate with Outline**
Click any item in the "OpenFOAM Outline" view to jump straight to it in your file.

### 5. **Trust the Validation**
When you see a warning or error, read it! FoamStudio's validation is smart and helpful.

---

## ⚙️ Recommended Settings

Add these to your VS Code settings for the best experience:

```json
{
  "[openfoam]": {
    "editor.formatOnSave": true,
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "editor.quickSuggestions": {
      "other": true,
      "comments": false,
      "strings": false
    }
  }
}
```

**To access settings:**
1. Press `Ctrl+,` (Cmd+, on Mac)
2. Search for "settings.json"
3. Click "Edit in settings.json"
4. Add the above configuration

---

## 🎓 Learning Path

### Beginner
1. ✅ Use syntax highlighting to understand file structure
2. ✅ Hover over keywords to learn what they do
3. ✅ Use snippets to create new sections
4. ✅ Let validation catch your mistakes

### Intermediate
1. ✅ Master context-aware completions
2. ✅ Use the Outline view for navigation
3. ✅ Format your code professionally
4. ✅ Understand validation messages

### Advanced
1. ✅ Create custom snippets for your workflows
2. ✅ Use Go to Definition for navigation
3. ✅ Find All References to understand dependencies
4. ✅ Configure formatting preferences

---

## 🆘 Common Questions

### Q: Completions not appearing?
**A:** Press `Ctrl+Space` to manually trigger IntelliSense. Check that you're in an OpenFOAM file.

### Q: Validation showing false errors?
**A:** FoamStudio validates common patterns. If you're using advanced OpenFOAM features, you may see warnings. These are hints, not blockers.

### Q: Want to disable a feature?
**A:** Most features are part of the language support. You can disable specific providers through VS Code's language settings.

### Q: How to report a bug?
**A:** Visit the [GitHub Issues](https://github.com/Arefhm94/foamstudio/issues) page and create a detailed report.

---

## 🎨 Example Workflow

Here's a typical workflow for creating a new OpenFOAM case:

1. **Create `controlDict`**
   ```
   - Type: foamfile + Tab
   - Type: application + Space → Select from completions
   - Type: startTime + Space → Enter value
   ```

2. **Create `fvSchemes`**
   ```
   - Type: foamfile + Tab
   - Type: ddtSchemes + Tab
   - Type: gradSchemes + Tab
   - Let IntelliSense suggest schemes
   ```

3. **Create `fvSolution`**
   ```
   - Type: foamfile + Tab
   - Type: solver-block + Tab → Configure for field
   - Type: SIMPLE + Tab → Add algorithm settings
   ```

4. **Format Everything**
   ```
   - Open each file
   - Press: Shift+Alt+F
   - Save with: Ctrl+S
   ```

---

## 🔗 Resources

- **Full Documentation**: See `FEATURES.md` for complete feature list
- **Enhancement Details**: See `ENHANCEMENTS.md` for technical details
- **OpenFOAM Docs**: [OpenFOAM.com](https://www.openfoam.com/documentation/)
- **GitHub Repo**: [FoamStudio](https://github.com/Arefhm94/foamstudio)

---

## 💪 Next Steps

Now that you know the basics:

1. Open one of your OpenFOAM cases
2. Explore the features hands-on
3. Experiment with snippets and completions
4. Share feedback on GitHub

**Happy OpenFOAM coding! 🌊**

---

*Made with ❤️ for the OpenFOAM community by [Aref Moalemi](https://github.com/Arefhm94)*
