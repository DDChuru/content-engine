# Quick Start Guide
**After LaTeX Installation**

---

## 🚀 Install LaTeX (Do This First!)

```bash
cd packages/backend
./install-latex.sh
```

**Time:** 5-10 minutes
**Size:** ~500MB
**Required:** Yes (for MathTex support)

---

## ✅ Verify Installation

```bash
latex --version
```

Should output: `pdfTeX 3.141592653...`

---

## 🎬 Test Streamlined Lesson (With Thumbnail Transition!)

```bash
curl -X POST http://localhost:3001/api/education/streamlined-lesson \
  -H "Content-Type: application/json" -d '{}'
```

**What to Expect:**
- Scene 1: Thumbnail transition (1s full → animates to corner)
- Scene 2: Theory with MathTex (120° = 2 × 60°)
- Scene 3: Worked example with calculations
- Total: ~67 seconds
- Cost: ~$0.15

**Video Location:**
```
packages/backend/output/education/videos/streamlined_lesson_*.mp4
```

---

## 🎥 Test Basic System (Still Works!)

```bash
curl -X POST http://localhost:3001/api/education/circle-theorem-demo-complete \
  -H "Content-Type: application/json" -d '{}'
```

**What to Expect:**
- 3 scenes (thumbnail + 2 Manim)
- 57 seconds
- Cost: ~$0.27
- Perfect sync

---

## 📊 Compare Results

### Basic System
```
✓ Works now (no LaTeX needed)
✓ Simple Text labels
✗ No thumbnail transition
✗ No MathTex notation
```

### Streamlined System (After LaTeX)
```
✓ Thumbnail transition to corner
✓ MathTex: 120° = 2 × 60°
✓ Professional notation
✓ Exam context badges
✓ Step-by-step with ticks
```

---

## 📖 Documentation

- **CURRENT-STATUS.md** - Full status report
- **LATEX-SETUP.md** - LaTeX installation details
- **SCALABILITY-ANALYSIS.md** - Architecture analysis
- **THUMBNAIL-TRANSITION-PLAN.md** - Design details

---

## 🔧 If Something Goes Wrong

### LaTeX Issues
```bash
# Verify LaTeX
which latex

# Test LaTeX directly
echo '\documentclass{article}\begin{document}Test\end{document}' > test.tex
latex test.tex
```

### Server Issues
```bash
# Check server logs
cd packages/backend
npx tsx src/index.ts
```

### Video Issues
```bash
# Check Manim output
ls -lah media/videos/

# Check FFmpeg output
ls -lah output/education/videos/
```

---

## 🎯 What's Next

1. **Install LaTeX** → `./install-latex.sh`
2. **Test streamlined lesson** → See if thumbnail transition works
3. **Review video** → Check MathTex rendering
4. **Iterate** → Adjust timing/content as needed
5. **Scale** → Build generic templates for 100+ topics

---

**You're all set! Just run the LaTeX install script and you can test the thumbnail transition! 🚀**
