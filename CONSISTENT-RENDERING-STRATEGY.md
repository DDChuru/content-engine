# Consistent Rendering Strategy

**Goal:** Make D3 visualizations and Manim animations look like they're from the same "hand" on the same blackboard.

---

## The Challenge

When students click through steps, they see:
1. D3 visualization (data-driven diagram)
2. Manim video (mathematical animation)

These MUST feel cohesive - like parts of the same lesson, not separate tools.

---

## Shared Visual Language

### 1. Color Palette (Blackboard Chalk)

**Strict color scheme across BOTH D3 and Manim:**

```typescript
const BLACKBOARD_COLORS = {
  background: '#000000',      // Black chalkboard
  primary: '#ffffff',         // White chalk (main content)
  secondary: '#1e88e5',       // Blue chalk (highlights)
  accent: '#4caf50',          // Green chalk (success/examples)
  warning: '#ffeb3b',         // Yellow chalk (important notes)
  danger: '#ff5722',          // Red/orange chalk (errors/attention)
  text: '#ffffff'             // White text
};
```

**D3 Configuration:**
```typescript
const d3Engine = new D3VizEngine({
  style: {
    backgroundColor: BLACKBOARD_COLORS.background,
    colors: {
      primary: BLACKBOARD_COLORS.primary,
      secondary: BLACKBOARD_COLORS.secondary,
      accent: BLACKBOARD_COLORS.accent,
      text: BLACKBOARD_COLORS.text,
      highlight: BLACKBOARD_COLORS.warning
    }
  }
});
```

**Manim Configuration:**
```python
class BlackboardScene(Scene):
    def construct(self):
        self.camera.background_color = "#000000"

        # Use same colors
        WHITE_CHALK = "#ffffff"
        BLUE_CHALK = "#1e88e5"
        GREEN_CHALK = "#4caf50"
        YELLOW_CHALK = "#ffeb3b"
```

---

### 2. Typography

**Fonts that work in BOTH:**

**D3 (SVG):**
```typescript
fonts: {
  primary: 'Arial, sans-serif',      // Clean, readable
  handwriting: 'Caveat, cursive',    // Hand-drawn feel
  mono: 'Courier New, monospace'     // Code/equations
}
```

**Manim (LaTeX + Text):**
```python
# LaTeX: Use default (Computer Modern) - universally recognizable
equation = MathTex(r"...")

# Text: Match D3
title = Text("...", font="Arial", font_size=36)
annotation = Text("...", font="Caveat", font_size=24)
```

---

### 3. Hand-Drawn Aesthetic

**Make Manim look hand-drawn like D3:**

**D3:** Already has sketchy circles, wobbly lines

**Manim:** Add roughness to match

```python
from manim import *

class HandDrawnCircle(VGroup):
    """Circle that looks hand-drawn (matches D3 style)"""
    def __init__(self, radius=1.0, color=WHITE, **kwargs):
        super().__init__(**kwargs)

        # Create circle with multiple overlapping strokes (sketchy effect)
        for _ in range(3):
            circle = Circle(radius=radius, color=color, stroke_width=2)
            # Add slight wobble
            circle.set_points_as_corners([
                circle.point_from_proportion(t) +
                np.array([
                    np.random.uniform(-0.02, 0.02),
                    np.random.uniform(-0.02, 0.02),
                    0
                ])
                for t in np.linspace(0, 1, 50)
            ])
            self.add(circle)

class HandDrawnLine(VGroup):
    """Line that looks hand-drawn (matches D3 style)"""
    def __init__(self, start, end, color=WHITE, **kwargs):
        super().__init__(**kwargs)

        # Wobbly path instead of straight line
        points = []
        num_segments = 20
        for i in range(num_segments + 1):
            t = i / num_segments
            point = start + t * (end - start)
            # Add random wobble
            wobble = np.array([
                np.random.uniform(-0.05, 0.05),
                np.random.uniform(-0.05, 0.05),
                0
            ])
            points.append(point + wobble)

        path = VMobject(color=color, stroke_width=2)
        path.set_points_as_corners(points)
        self.add(path)
```

**Usage:**
```python
# Instead of:
circle = Circle(radius=0.5, color=BLUE)

# Use:
circle = HandDrawnCircle(radius=0.5, color=BLUE)
```

---

### 4. Animation Timing

**Consistent pacing across D3 and Manim:**

**D3:**
```typescript
animation: {
  enabled: true,
  duration: 3,        // 3 seconds per viz
  fps: 30,
  effects: ['draw']   // Progressive reveal
}
```

**Manim:**
```python
# Match D3 timing
self.play(Create(object), run_time=2)   # Elements appear in ~2 seconds
self.wait(1)                             # Hold for 1 second
# Total: ~3 seconds (matches D3)
```

**Standard timing rules:**
- Simple elements: 1-2 seconds
- Complex diagrams: 2-4 seconds
- Equations: 2-3 seconds
- Transitions: 0.5-1 second

---

### 5. Stroke Width & Line Style

**Consistent line thickness:**

**D3:**
```typescript
strokeWidth: 3,      // Chalk-like thickness
roughness: 1.5       // Slight wobble
```

**Manim:**
```python
Circle(stroke_width=3)    # Match D3 stroke width
Line(stroke_width=3)
```

---

### 6. Layout & Spacing

**Grid system for both:**

```
┌─────────────────────────────────────┐
│ [Title Area - 10% height]           │
├─────────────────────────────────────┤
│                                     │
│   [Content Area - 80% height]       │
│                                     │
│   Left: Diagram/Network             │
│   Right: Equations/Formulas         │
│                                     │
├─────────────────────────────────────┤
│ [Footer - 10% height]               │
└─────────────────────────────────────┘
```

**D3:**
```typescript
const LAYOUT = {
  title: { x: 960, y: 100 },
  content: { x: 960, y: 540 },
  footer: { x: 960, y: 980 }
};
```

**Manim:**
```python
LAYOUT = {
    'title': UP * 3,
    'content': ORIGIN,
    'footer': DOWN * 3
}

title.move_to(LAYOUT['title'])
```

---

## Rendering Pipeline

### Step-by-Step Consistency

When a student clicks "Reveal Step 1":

**1. D3 Renders First (2-3 seconds)**
```typescript
// Show data visualization with hand-drawn style
const vizOutput = await d3Engine.visualize({
  type: 'network',
  nodes: [...],
  style: BLACKBOARD_COLORS
});
```

**2. Manim Renders Second (2-3 seconds)**
```python
# Show equation with matching style
equation = MathTex(r"...", color=WHITE_CHALK)
self.play(Write(equation), run_time=2)
```

**3. Both Display Together**
```tsx
<div className="step-content">
  <video src="/d3-viz.mp4" autoPlay />
  <video src="/manim-explanation.mp4" autoPlay />
</div>
```

---

## Implementation: Unified Style Service

Create a shared style configuration:

```typescript
// src/services/blackboard-style.ts

export const BLACKBOARD_STYLE = {
  colors: {
    background: '#000000',
    white: '#ffffff',
    blue: '#1e88e5',
    green: '#4caf50',
    yellow: '#ffeb3b',
    red: '#ff5722'
  },

  fonts: {
    primary: 'Arial, sans-serif',
    handwriting: 'Caveat, cursive',
    mono: 'Courier New, monospace'
  },

  strokes: {
    width: 3,
    roughness: 1.5
  },

  timing: {
    simple: 2,        // seconds
    complex: 3,
    transition: 1
  },

  // Export Manim config as Python string
  getManimConfig(): string {
    return `
BACKGROUND = "${this.colors.background}"
WHITE_CHALK = "${this.colors.white}"
BLUE_CHALK = "${this.colors.blue}"
GREEN_CHALK = "${this.colors.green}"
YELLOW_CHALK = "${this.colors.yellow}"
RED_CHALK = "${this.colors.red}"
STROKE_WIDTH = 3
`;
  }
};
```

**Usage in D3:**
```typescript
import { BLACKBOARD_STYLE } from './blackboard-style';

const engine = new D3VizEngine({
  style: {
    backgroundColor: BLACKBOARD_STYLE.colors.background,
    colors: {
      primary: BLACKBOARD_STYLE.colors.white,
      secondary: BLACKBOARD_STYLE.colors.blue,
      accent: BLACKBOARD_STYLE.colors.green
    },
    strokeWidth: BLACKBOARD_STYLE.strokes.width
  }
});
```

**Usage in Manim:**
```typescript
// Generate Manim script with style constants
const manimScript = `
from manim import *

# Import shared style
${BLACKBOARD_STYLE.getManimConfig()}

class ProblemStep(Scene):
    def construct(self):
        self.camera.background_color = BACKGROUND

        equation = MathTex(r"...", color=WHITE_CHALK)
        equation.set_stroke(width=STROKE_WIDTH)

        self.play(Write(equation), run_time=2)
`;
```

---

## Quality Checklist

Before releasing a topic module, verify:

✅ **Colors match** - Same palette in D3 and Manim
✅ **Stroke widths match** - Lines are same thickness
✅ **Fonts compatible** - Text looks similar
✅ **Timing consistent** - Animations same pace
✅ **Black background** - Both use #000000
✅ **Hand-drawn feel** - Both have slight roughness
✅ **Layout aligned** - Content positioned similarly

---

## Example: Derivatives Topic

**Concept Video (Manim + D3):**
- Background: Black
- Title: White chalk (#ffffff)
- Function graph: Blue chalk (#1e88e5)
- Derivative line: Green chalk (#4caf50)
- Annotations: Yellow chalk (#ffeb3b)

**Example Problem - Step 1:**
- D3 shows function graph (blue chalk, hand-drawn curve)
- Manim shows equation f(x) = x² (white chalk LaTeX)
- Both: Black background, same stroke width

**Example Problem - Step 2:**
- D3 shows derivative graph (green chalk, hand-drawn)
- Manim shows power rule (white chalk LaTeX)
- Both: Consistent timing (~3 seconds each)

---

## Next Steps

1. **Create BlackboardStyle service** - Centralized style config
2. **Update D3 engine** - Use shared colors/styles
3. **Create Manim templates** - Pre-configured scenes with blackboard style
4. **Build style preview** - Visual comparison tool (D3 vs Manim side-by-side)
5. **Document color usage** - When to use blue vs green vs yellow

---

## Result

Students see a **seamless educational experience**:
- Videos look professionally cohesive
- D3 and Manim feel like parts of the same lesson
- Consistent "hand-drawn on blackboard" aesthetic
- No jarring style shifts between steps

**It's not D3 OR Manim - it's a unified blackboard teaching system!** 🎓
