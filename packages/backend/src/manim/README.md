# Sets Lesson - Manim Implementation

Professional mathematics education video using Manim (3Blue1Brown style animations).

## 🎯 What This Is

A complete Cambridge IGCSE Mathematics lesson on **Introduction to Sets** with:
- ✅ 17 animated scenes
- ✅ Smart collision avoidance for element positioning
- ✅ Reusable Venn Diagram components
- ✅ Professional 3Blue1Brown-quality animations
- ✅ Integration with studio workflow
- ✅ Scene-by-scene rendering for iteration

## 📦 Files

- `sets_lesson.py` - Core scenes (intro, definitions, Venn diagrams, universal sets, summary)
- `sets_lesson_part2.py` - Practice questions, challenges, true/false
- `render_sets_lesson.py` - Render script and preview generator
- `README.md` - This file

## 🚀 Quick Start

### Prerequisites

```bash
# Activate conda environment
conda activate aitools

# Verify Manim is installed
manim --version  # Should be v0.19.0
```

### Render All Scenes

```bash
cd packages/backend/src/manim

# Medium quality (faster, good for preview)
python render_sets_lesson.py all medium_quality

# High quality (slower, better output)
python render_sets_lesson.py all high_quality

# Production quality (slowest, best quality)
python render_sets_lesson.py all production_quality
```

**Output:** `output/manim/` directory with:
- Individual scene videos (`title.mp4`, `step1.mp4`, etc.)
- `lesson_metadata.json` - Scene information
- `preview.html` - Browser-based preview

### Render Single Scene (Fast Iteration)

```bash
# Render just one scene for testing
python render_sets_lesson.py single step5 medium_quality

# Available scene IDs:
# title, step1, step2, step3, step4, step5, step6, step7,
# step9, step10, step11, step12, step13, step13a, step14, step15, step8
```

### Preview in Browser

```bash
# Generate preview HTML (without re-rendering)
python render_sets_lesson.py preview

# Open in browser
open output/manim/preview.html  # macOS
xdg-open output/manim/preview.html  # Linux
```

## 🎨 Key Features

### Smart Collision Avoidance

The `SmartPositioner` class prevents elements from overlapping:

```python
positioner = SmartPositioner()

# Automatically finds free positions
position = positioner.find_free_position(center, radius=0.3)
```

### Reusable Venn Diagram Component

```python
venn = SmartVennDiagram(
    set_a_elements=[1, 2, 3],
    set_b_elements=[2, 3, 4],
    set_a_label="A",
    set_b_label="B",
    set_a_color=RED_C,
    set_b_color=GREEN_C
)

# Automatically calculates:
# - Intersection
# - A only
# - B only
# - Smart positioning for all elements
```

### Scene Structure

Each scene follows this pattern:

```python
class MyScene(Scene):
    def construct(self):
        # 1. Setup title
        title = Text("Scene Title", font_size=48)
        title.to_edge(UP)

        # 2. Create elements with collision avoidance
        elements = create_smart_layout()

        # 3. Animate with transitions
        self.play(Write(title))
        self.play(Create(elements))

        # 4. Hold for narration
        self.wait(2)
```

## 📊 Lesson Structure (17 Scenes)

| Scene | ID | Class | Duration | Description |
|-------|------|-------|----------|-------------|
| 1 | `title` | IntroTitle | 4s | Title slide |
| 2 | `step1` | WhatIsASet | 8s | Definition of a set |
| 3 | `step2` | SetNotation | 7s | Set notation examples |
| 4 | `step3` | VennIntro | 4s | Intro to Venn diagrams |
| 5 | `step4` | SetAVisualized | 6s | Visualizing Set A |
| 6 | `step5` | TwoSetsOverlap | 7s | Two sets with overlap |
| 7 | `step6` | IntersectionHighlight | 6s | Intersection concept |
| 8 | `step7` | UnionConcept | 6s | Union concept |
| 9 | `step9` | UniversalSetIntro | 8s | Universal set intro |
| 10 | `step10` | UniversalSetExample | 7s | Universal set with Venn |
| 11 | `step11` | PracticeQuestion1 | 8s | Find intersection |
| 12 | `step12` | PracticeQuestion2 | 8s | Find union |
| 13 | `step13` | SpotTheError | 8s | Error challenge |
| 14 | `step13a` | ErrorRevealed | 7s | Errors highlighted |
| 15 | `step14` | TrueFalse1 | 8s | Vowels intersection |
| 16 | `step15` | TrueFalse2 | 8s | Subset question |
| 17 | `step8` | SummaryScene | 10s | Summary |

**Total Duration:** ~2 minutes

## 🔧 Customization

### Change Colors

```python
# In sets_lesson.py or sets_lesson_part2.py
venn = SmartVennDiagram(
    set_a_elements=[1, 2, 3],
    set_b_elements=[2, 3, 4],
    set_a_color=BLUE_C,      # Change from RED_C
    set_b_color=ORANGE,      # Change from GREEN_C
)
```

### Adjust Animation Speed

```python
# Faster animations
self.play(Write(text), run_time=0.5)  # Default is 1

# Slower for emphasis
self.play(Create(circle), run_time=2)
```

### Change Resolution

```bash
# Low (480p) - fastest
python render_sets_lesson.py all low_quality

# Medium (720p) - balanced
python render_sets_lesson.py all medium_quality

# High (1080p) - slow
python render_sets_lesson.py all high_quality

# 4K - very slow
python render_sets_lesson.py all production_quality
```

## 🎬 Integration with Video Pipeline

### Option 1: Direct Manim → Remotion

```javascript
// In video-director.ts
const manimScenes = [
  { id: 'step1', video: 'output/manim/step1.mp4', duration: 8 },
  { id: 'step2', video: 'output/manim/step2.mp4', duration: 7 },
  // ...
];

// Compose in Remotion
<Video src={manimScenes[currentScene].video} />
```

### Option 2: Manim + Voice Narration

```bash
# 1. Render Manim scenes
python render_sets_lesson.py all high_quality

# 2. Generate voice narration (ElevenLabs)
node scripts/generate-narration.js

# 3. Compose with Remotion
npm run compose-lesson
```

## 📈 Cost Comparison

**Manim Approach:**
- Manim rendering: **$0.00** (local, FREE)
- ElevenLabs narration (~1.5K chars): **$0.45**
- Remotion composition: **$0.00** (local, FREE)
- **Total: ~$0.45 per module**

**vs. Gemini Image Approach:**
- Gemini images: ~$0.16
- ElevenLabs narration: ~$0.90
- **Total: ~$1.06 per module**

**Manim savings: 57% cheaper + better quality!**

## 🐛 Troubleshooting

### "manim: command not found"

```bash
# Activate conda environment first
conda activate aitools
manim --version
```

### "No module named 'manim'"

```bash
# Install/reinstall Manim
conda install -c conda-forge manim
```

### Scenes not rendering

```bash
# Check syntax errors
python -m py_compile sets_lesson.py

# Render with verbose output
manim -ql sets_lesson.py IntroTitle --verbose
```

### Video files not found

```bash
# Check output directory
ls -la output/manim/

# Manim might use different output structure
find output -name "*.mp4"
```

## 🎓 Learning Resources

- **Manim Community Docs:** https://docs.manim.community/
- **3Blue1Brown's Manim:** https://github.com/3b1b/manim
- **Manim Tutorial:** https://manim.community/tutorials/

## 🚀 Next Steps

1. **Preview the lesson:**
   ```bash
   python render_sets_lesson.py all medium_quality
   open output/manim/preview.html
   ```

2. **Iterate on a scene:**
   ```bash
   # Edit sets_lesson.py
   python render_sets_lesson.py single step5 medium_quality
   ```

3. **Add voice narration:**
   - Use ElevenLabs API with your voice clone
   - Sync with scene timestamps from `lesson_metadata.json`

4. **Integrate with Remotion:**
   - Import Manim videos as `<Video>` components
   - Add audio tracks
   - Export final lesson

5. **Package for SCORM:**
   - Use existing SCORM packager
   - Embed final video
   - Add quiz questions

## 📝 Notes

- **Rendering time:** ~30-60 seconds per scene (medium quality)
- **File sizes:** ~2-5 MB per scene (medium quality)
- **Total lesson size:** ~50-80 MB
- **Recommended workflow:** Edit → Render single scene → Preview → Render all

Enjoy creating beautiful math education content! 🎨📐
