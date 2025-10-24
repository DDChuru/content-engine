# LaTeX Setup for Educational Content Generation
**Date:** 2025-10-24
**Status:** Ready to Install

---

## 🎯 Why We Need LaTeX

### The Problem
When generating the streamlined lesson with thumbnail transition, Manim failed with:
```
FileNotFoundError: [Errno 2] No such file or directory: 'latex'
```

### The Solution
Install LaTeX to enable **MathTex** - Manim's component for rendering mathematical notation.

### What MathTex Enables
```python
# Instead of plain text:
angle_label = Text("120°", font_size=36)

# We can use proper mathematical notation:
angle_label = MathTex(r"120^\circ", font_size=36)
angle_formula = MathTex(r"\angle AOB = 2 \times \angle ACB")
equation = MathTex(r"\frac{d}{dx}(x^2) = 2x")
```

**Benefits:**
- ✓ Proper mathematical symbols (∠, ×, ÷, √, ∫, Σ)
- ✓ Fractions, exponents, subscripts rendered beautifully
- ✓ Professional-quality typesetting
- ✓ Essential for GCSE/A-Level math content

---

## 📦 Installation

### Quick Install (Recommended)
```bash
cd packages/backend
./install-latex.sh
```

### Manual Install
```bash
sudo apt-get update
sudo apt-get install -y texlive texlive-latex-extra texlive-fonts-extra texlive-latex-recommended texlive-science texlive-fonts-recommended cm-super dvipng
```

### Verify Installation
```bash
latex --version
# Should output: pdfTeX 3.141592653... (TeX Live ...)
```

---

## 🎬 What This Unlocks

### Current Templates Using MathTex

#### 1. **Theory Scene** (`generateTheoryScene`)
```python
# Angle labels with degree symbols
angle_label_center = MathTex(f"{angle_deg}^\\circ", color=YELLOW)
angle_label_circum = MathTex(f"{circum_angle}^\\circ", color=GREEN)

# Mathematical relationship
relationship = VGroup(
    MathTex("120^\\circ"),
    MathTex("="),
    MathTex("2"),
    MathTex("\\times"),
    MathTex("60^\\circ")
)
```

#### 2. **Worked Example Scene** (`generateWorkedExample`)
```python
# Show the calculation
calculation = MathTex(
    "100^\\circ", "=", "2", "\\times", "\\angle ACB"
)

# Show the solution
solution = MathTex(
    "\\angle ACB", "=", "100^\\circ", "\\div", "2", "=", "50^\\circ"
)
```

#### 3. **Introduction with Thumbnail**
```python
# Exam-style badge with proper formatting
exam_badge = Text("Popular GCSE Higher Topic", font_size=28)
difficulty_text = Text("Difficulty: HIGHER", color=ORANGE)
```

---

## 🚀 Impact on Our System

### Before LaTeX (Limited)
```
✗ Can only use plain text for all math
✗ Awkward notation: "angle AOB = 2 x angle ACB"
✗ No proper fractions, exponents, or symbols
✗ Unprofessional for educational content
```

### After LaTeX (Professional)
```
✓ Proper mathematical notation: ∠AOB = 2 × ∠ACB
✓ Beautiful fractions: dy/dx, x²/2
✓ Professional symbols: √, ∫, Σ, ≈, ≠
✓ GCSE/A-Level quality content
```

---

## 📊 Disk Space

- **texlive-latex-extra:** ~400MB
- **texlive-fonts-extra:** ~100MB
- **Total:** ~500MB
- **Worth it:** Absolutely - this is essential for math content

---

## 🔧 How It Works

### Manim + LaTeX Pipeline
```
1. MathTex("x^2") → Generates LaTeX code
2. LaTeX compiler → Renders to SVG
3. Manim → Imports SVG as Mobject
4. Animation → Smooth math animations
```

### Example Workflow
```python
# This code:
formula = MathTex(r"\int_0^1 x^2 \, dx = \frac{1}{3}")

# Becomes:
LaTeX: \int_0^1 x^2 \, dx = \frac{1}{3}
   ↓
SVG render of integral symbol, limits, fraction
   ↓
Manim Mobject that can be animated
   ↓
Beautiful video with smooth writing animations
```

---

## 🎓 Educational Content Types We Can Now Create

### GCSE Topics
1. **Algebra**
   - Quadratic equations: `ax² + bx + c = 0`
   - Simultaneous equations: `2x + 3y = 7`
   - Factorization: `x² - 5x + 6 = (x-2)(x-3)`

2. **Geometry**
   - Circle theorems: `∠AOB = 2 × ∠ACB`
   - Pythagoras: `a² + b² = c²`
   - Trigonometry: `sin θ = opposite/hypotenuse`

3. **Calculus**
   - Differentiation: `d/dx(x^n) = nx^(n-1)`
   - Integration: `∫ x dx = x²/2 + C`
   - Gradients: `m = (y₂ - y₁)/(x₂ - x₁)`

### A-Level Topics
1. **Advanced Calculus**
   - Chain rule, product rule, quotient rule
   - Integration by parts
   - Differential equations

2. **Further Math**
   - Matrices, vectors
   - Complex numbers: `z = a + bi`
   - Series and sequences

---

## ✅ Next Steps After Installation

1. **Verify LaTeX Works**
   ```bash
   latex --version
   ```

2. **Test Streamlined Lesson Endpoint**
   ```bash
   curl -X POST http://localhost:3001/api/education/streamlined-lesson \
     -H "Content-Type: application/json" -d '{}'
   ```

3. **Expected Result**
   - ✓ Thumbnail generated (Gemini image)
   - ✓ Scene 1: Introduction with thumbnail transition (12s)
   - ✓ Scene 2: Theory proof with MathTex angles (30s)
   - ✓ Scene 3: Worked example with MathTex calculations (25s)
   - ✓ Final video: ~67 seconds, perfect sync

---

## 🎯 Long-Term Benefits

### Scalability
With LaTeX installed, we can:
- Generate ANY mathematical topic
- Support ALL GCSE and A-Level content
- Create professional exam-quality videos
- Scale to 100+ topics without code changes

### Quality
- Professional typesetting matches textbooks
- Students see familiar mathematical notation
- Clear, unambiguous mathematical expressions
- Exam board standards compliance

### Future Topics We Can Now Support
- Quadratics, surds, indices
- Trigonometric identities
- Logarithms and exponentials
- Coordinate geometry
- Calculus (differentiation, integration)
- Statistics (normal distribution, hypothesis testing)
- Mechanics (forces, vectors)
- And many more...

---

## 🐛 Troubleshooting

### If Installation Fails
```bash
# Check disk space
df -h

# Check for conflicting packages
dpkg -l | grep tex

# Clean and retry
sudo apt-get clean
sudo apt-get update
sudo apt-get install texlive
```

### If MathTex Still Doesn't Work
```bash
# Check LaTeX is in PATH
which latex

# Test LaTeX directly
echo '\documentclass{article}\begin{document}Hello\end{document}' > test.tex
latex test.tex
```

---

## 📝 Summary

**What We're Installing:** LaTeX (TeX Live distribution)
**Why:** Enable MathTex for professional mathematical notation
**Size:** ~500MB
**Time:** 5-10 minutes
**Benefit:** Unlock ALL mathematical educational content

**Run this to get started:**
```bash
cd packages/backend
./install-latex.sh
```

After installation, our streamlined lesson with thumbnail transition will work perfectly! 🚀
