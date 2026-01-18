# IGCSE Mathematics Lesson Generator

## Complete System for Cambridge IGCSE 0580 Content Generation

This platform generates comprehensive, visualization-first educational content for Cambridge IGCSE Mathematics (0580).

---

## Quick Start

```bash
# Generate single lesson
cd packages/backend
ANTHROPIC_API_KEY="your-key" npx tsx src/education/generate-lesson.ts C1.2

# Generate all lessons (dry run first)
ANTHROPIC_API_KEY="your-key" npx tsx src/education/batch-generate.ts --dry-run

# Generate all Core lessons
ANTHROPIC_API_KEY="your-key" npx tsx src/education/batch-generate.ts --core

# Resume interrupted batch
ANTHROPIC_API_KEY="your-key" npx tsx src/education/batch-generate.ts --resume
```

---

## What Gets Generated

Each lesson contains:

| Component | Description |
|-----------|-------------|
| **Opening** | Engaging hook + real-world connection |
| **Prior Knowledge** | Prerequisites with check questions |
| **Objectives** | Bloom's taxonomy with exam weights |
| **Theory Sections** | Visual content blocks (5+ sections) |
| **Misconceptions** | Common mistakes with corrections |
| **Worked Examples** | Step-by-step solutions (6 examples) |
| **Practice Questions** | Graduated difficulty (10 questions) |
| **Quiz** | SCORM-tracked assessment |

---

## Visual Content Types

| Type | Technology | Cost | Use Case |
|------|-----------|------|----------|
| `gemini-diagram` | Gemini 2.0 | $0.039/image | Infographics, real-world |
| `svg-animation` | CSS animations | FREE | Geometry proofs, Venn diagrams |
| `manim-animation` | Manim Python | FREE | Graphs, functions, 3D |
| `latex-formula` | MathJax/KaTeX | FREE | Mathematical notation |
| `interactive` | D3.js/React | FREE | Sliders, calculators |

---

## Visual Styles (from /styles-preview)

| Style | Best For | Auto-assigned To |
|-------|----------|-----------------|
| **Shape Morphing** | Transformations | Circle theorems, vectors |
| **Blueprint** | Technical proofs | Geometry, constructions |
| **Chalkboard** | Traditional ed | Statistics |
| **Neon Glow** | Teen engagement | Default for engagement |
| **Minimal Line Art** | Professional | Algebra, graphs |

---

## Syllabus Coverage

**Cambridge IGCSE Mathematics 0580 (2025-2027)**

- **Core:** 47 subtopics (C1-C9)
- **Extended:** 52 subtopics (E1-E9)
- **Total:** 99 complete lessons

---

## Cost Estimation

### Per Lesson (~65 minutes)
- Claude API: ~$0.15
- Gemini diagrams: ~$0.16 (4 images)
- ElevenLabs narration (optional): ~$0.90
- **Total without narration: ~$0.31**
- **Total with narration: ~$1.21**

### Complete Syllabus (99 topics)
- Text + Structure: ~$15
- + Gemini diagrams: ~$31
- + Voice narration: ~$120
- **Compare to traditional: $500,000+ (99%+ savings)**

---

## Sample Output

**Topic:** C1.2 Sets
**Duration:** 64 minutes
**File:** `output/lessons/igcse-0580-c1.2.json`

```json
{
  "id": "igcse-0580-c1.2",
  "title": "Sets",
  "opening": {
    "hook": "You've just joined Instagram and want to organize your followers...",
    "realWorldConnection": "Sets are fundamental to how Spotify creates Discover Weekly..."
  },
  "objectives": [
    {
      "verb": "apply",
      "description": "Use Venn diagrams to represent relationships between two sets",
      "examWeight": "High - 4-8 marks"
    }
  ],
  "theorySections": [
    {
      "title": "Introduction to Sets",
      "content": [
        {"type": "gemini-diagram", "geminiPrompt": "Create infographic..."},
        {"type": "svg-animation", "animationDescription": "Show overlapping circles..."},
        {"type": "latex-formula", "latex": "A ∪ B = \\{x | x ∈ A \\text{ or } x ∈ B\\}"}
      ]
    }
  ],
  "misconceptions": [
    {
      "wrongIdea": "Students think A ∩ B means 'A or B'",
      "correctUnderstanding": "A ∩ B contains elements in BOTH sets"
    }
  ],
  "workedExamples": [
    {
      "difficulty": "core",
      "question": "In a class of 30 students, 18 study French...",
      "steps": [...],
      "examTip": "Always check Venn diagram totals add up"
    }
  ]
}
```

---

## Commands Reference

```bash
# Single lesson generation
npx tsx src/education/generate-lesson.ts C1.2
npx tsx src/education/generate-lesson.ts E4.7 --style=blueprint
npx tsx src/education/generate-lesson.ts C1.1 --examples=8

# Batch generation
npx tsx src/education/batch-generate.ts --dry-run    # Preview
npx tsx src/education/batch-generate.ts --core       # Core only
npx tsx src/education/batch-generate.ts --extended   # Extended only
npx tsx src/education/batch-generate.ts --unit=C1    # Specific unit
npx tsx src/education/batch-generate.ts --resume     # Resume
```

---

## Files Created

```
packages/backend/src/education/
├── lesson-schema.ts      # TypeScript interfaces (25 types)
├── lesson-generator.ts   # Claude AI generation
├── visual-generator.ts   # Gemini/SVG generation
├── generate-lesson.ts    # Single lesson CLI
└── batch-generate.ts     # Batch generation CLI

packages/backend/output/lessons/
├── igcse-0580-c1.2.json       # Generated lesson
└── generation-status.json      # Batch progress tracking
```

---

## Next Steps

1. **Review sample lesson** - Check `output/lessons/igcse-0580-c1.2.json`
2. **Generate batch** - Run `--dry-run` first to see plan
3. **Create visuals** - Generate Gemini diagrams and SVG animations
4. **Add narration** - Clone voice with ElevenLabs
5. **Package SCORM** - Export for LMS deployment
