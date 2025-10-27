# Visualization Standards for Cambridge IGCSE

**Maximizing Manim for Mathematical Content - A Standardized Approach**

---

## Core Principle: Manim-First for Math

**Rule:** If it's mathematical or animated, use **Manim**. If it's data-driven or requires interaction, use **D3**.

---

## 1. Sets Topic (C1.2) - The Standard

### **WRONG Approach (What We Built in Demo):**
❌ D3 for Venn diagrams (static SVG circles)
❌ D3 for element positioning (manual JavaScript)
❌ Buttons to toggle states

**Problems:**
- Not animated (instant state changes)
- Manual positioning of elements
- Looks "web-like" not "mathematical"
- Inconsistent with rest of math content

---

### **RIGHT Approach (Manim-First Standard):**

✅ **Manim draws and animates everything**
✅ **Numbers move into sets** (animated positioning)
✅ **Circles draw themselves** (hand-drawn aesthetic)
✅ **Professional 3Blue1Brown quality**
✅ **Consistent with other math topics**

---

## 2. Manim Sets Standard - Complete Specification

### **Scene 1: Introduction to Sets**

**Animation Sequence:**
```python
from manim import *

class SetsIntroduction(Scene):
    def construct(self):
        # 1. Title appears
        title = Text("Set Theory", font_size=60)
        self.play(Write(title))
        self.wait(0.5)
        self.play(title.animate.to_edge(UP))

        # 2. Universal set rectangle draws itself
        universal = Rectangle(width=12, height=6, color=GRAY)
        universal_label = MathTex(r"\xi", font_size=48).next_to(universal, UP+LEFT, buff=0.3)

        self.play(Create(universal), Write(universal_label))
        self.wait(0.5)

        # 3. Numbers appear scattered in universal set
        numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        number_mobs = VGroup(*[
            Text(str(n), font_size=36)
            for n in numbers
        ])

        # Position randomly in universal set
        for mob in number_mobs:
            mob.move_to(universal.get_center() +
                       np.array([
                           np.random.uniform(-5, 5),
                           np.random.uniform(-2.5, 2.5),
                           0
                       ]))

        self.play(LaggedStart(*[FadeIn(mob, scale=0.5) for mob in number_mobs], lag_ratio=0.1))
        self.wait(1)
```

---

### **Scene 2: Drawing Set A (Animated)**

**Animation Sequence:**
```python
class DrawSetA(Scene):
    def construct(self):
        # Universal set already visible (from Scene 1)
        universal = Rectangle(width=12, height=6, color=GRAY)
        numbers = [Text(str(n), font_size=36) for n in range(1, 11)]
        # ... (positioned as before)

        self.add(universal, *numbers)

        # 1. Set A definition appears
        set_a_def = MathTex(r"A = \{1, 2, 3, 4, 5\}", font_size=40, color=BLUE)
        set_a_def.to_edge(LEFT + UP)
        self.play(Write(set_a_def))
        self.wait(1)

        # 2. Circle for Set A draws itself (sketchy, hand-drawn)
        circle_a = Circle(radius=2, color=BLUE, stroke_width=3)
        circle_a.move_to(LEFT * 2)

        # Hand-drawn effect (multiple overlapping circles with slight offset)
        circles_a = VGroup(*[
            Circle(radius=2 + 0.02*i, color=BLUE, stroke_width=2)
            .move_to(LEFT * 2 + np.array([0.02*np.random.randn(), 0.02*np.random.randn(), 0]))
            for i in range(3)
        ])

        self.play(Create(circles_a), run_time=2)

        # 3. Label "A" appears
        label_a = MathTex("A", font_size=48, color=BLUE).next_to(circle_a, UP)
        self.play(Write(label_a))
        self.wait(0.5)

        # 4. Numbers 1, 2, 3, 4, 5 ANIMATE into Set A
        # This is the KEY part - numbers MOVE into the circle!

        set_a_numbers = [1, 2, 3, 4, 5]

        # Target positions inside circle A (arrange in a circle pattern)
        target_positions = []
        for i, n in enumerate(set_a_numbers):
            angle = i * TAU / len(set_a_numbers)
            pos = circle_a.get_center() + np.array([
                1.2 * np.cos(angle),
                1.2 * np.sin(angle),
                0
            ])
            target_positions.append(pos)

        # Animate numbers moving into Set A
        animations = []
        for i, n in enumerate(set_a_numbers):
            number_mob = numbers[n-1]  # Get the number mob
            animations.append(
                number_mob.animate.move_to(target_positions[i]).set_color(BLUE)
            )

        self.play(*animations, run_time=2)
        self.wait(1)

        # 5. Highlight: "These are elements of A"
        brace = Brace(circle_a, DOWN)
        brace_text = brace.get_text("Elements of A", font_size=32)
        self.play(GrowFromCenter(brace), Write(brace_text))
        self.wait(2)
```

---

### **Scene 3: Drawing Set B and Showing Intersection**

**Animation Sequence:**
```python
class SetIntersection(Scene):
    def construct(self):
        # ... (Set A already drawn, numbers 1-5 inside)

        # 1. Set B definition appears
        set_b_def = MathTex(r"B = \{4, 5, 6, 7, 8\}", font_size=40, color=GREEN)
        set_b_def.next_to(set_a_def, DOWN, aligned_edge=LEFT)
        self.play(Write(set_b_def))
        self.wait(1)

        # 2. Circle for Set B draws itself (overlapping with A)
        circles_b = VGroup(*[
            Circle(radius=2 + 0.02*i, color=GREEN, stroke_width=2)
            .move_to(RIGHT * 2 + np.array([0.02*np.random.randn(), 0.02*np.random.randn(), 0]))
            for i in range(3)
        ])

        self.play(Create(circles_b), run_time=2)

        # 3. Label "B"
        circle_b = Circle(radius=2).move_to(RIGHT * 2)  # Invisible reference
        label_b = MathTex("B", font_size=48, color=GREEN).next_to(circle_b, UP)
        self.play(Write(label_b))
        self.wait(0.5)

        # 4. Numbers 4, 5 are ALREADY in A, so they're in the intersection!
        # Highlight them first
        numbers_4_5 = VGroup(numbers[3], numbers[4])  # Assuming numbers list
        self.play(
            numbers_4_5.animate.set_color(YELLOW).scale(1.3),
            Flash(numbers[3], color=YELLOW),
            Flash(numbers[4], color=YELLOW)
        )
        self.wait(1)

        # 5. Numbers 6, 7, 8 MOVE into Set B (but not in A)
        set_b_only = [6, 7, 8]
        target_positions_b = []
        for i, n in enumerate(set_b_only):
            angle = (i + 2) * TAU / 5  # Offset to avoid overlap
            pos = circle_b.get_center() + np.array([
                1.2 * np.cos(angle),
                1.2 * np.sin(angle),
                0
            ])
            target_positions_b.append(pos)

        animations = []
        for i, n in enumerate(set_b_only):
            animations.append(
                numbers[n-1].animate.move_to(target_positions_b[i]).set_color(GREEN)
            )

        self.play(*animations, run_time=2)
        self.wait(1)

        # 6. Intersection region highlights (yellow glow)
        intersection_label = MathTex(r"A \cap B = \{4, 5\}", font_size=40, color=YELLOW)
        intersection_label.to_edge(DOWN)
        self.play(Write(intersection_label))

        # Draw subtle yellow glow around intersection region
        intersection_glow = Intersection(
            Circle(radius=2).move_to(LEFT * 2),
            Circle(radius=2).move_to(RIGHT * 2),
            color=YELLOW,
            fill_opacity=0.3
        )
        self.play(FadeIn(intersection_glow))
        self.wait(2)
```

---

### **Scene 4: Union Animation**

**Animation Sequence:**
```python
class SetUnion(Scene):
    def construct(self):
        # ... (Both sets A and B visible, numbers positioned)

        # 1. Union definition appears
        union_def = MathTex(r"A \cup B = \{1, 2, 3, 4, 5, 6, 7, 8\}",
                            font_size=40, color=ORANGE)
        union_def.to_edge(DOWN)
        self.play(Write(union_def))
        self.wait(1)

        # 2. Both circles glow orange
        self.play(
            circles_a.animate.set_color(ORANGE),
            circles_b.animate.set_color(ORANGE),
            *[n.animate.set_color(ORANGE) for n in numbers[:8]]  # 1-8
        )
        self.wait(1)

        # 3. Draw boundary around BOTH sets (union shape)
        # This is tricky - use SVG path or approximate
        union_boundary = Union(
            Circle(radius=2.2).move_to(LEFT * 2),
            Circle(radius=2.2).move_to(RIGHT * 2),
            color=ORANGE,
            stroke_width=4
        )
        self.play(Create(union_boundary), run_time=2)
        self.wait(2)
```

---

## 3. Visualization Decision Tree

### **When to Use MANIM:**

✅ **Mathematical animations**
- Equations appearing/transforming
- Geometric constructions
- Number line operations
- Set operations (Venn diagrams)
- Algebraic manipulations
- Proofs and derivations

✅ **Step-by-step reveals**
- Draw circles, lines, shapes
- Numbers moving into position
- Highlighting specific elements
- Morphing between states

✅ **LaTeX-heavy content**
- Fractions, surds, notation
- Equations with multiple steps
- Mathematical symbols

✅ **3D visualizations**
- Geometric solids
- Rotations, transformations
- Surface area, volume

**Examples:**
- ✅ Sets (Venn diagrams with animated numbers)
- ✅ Algebra (expand/factorize with steps)
- ✅ Geometry (angle proofs, constructions)
- ✅ Number theory (prime factorization trees)

---

### **When to Use D3:**

✅ **Data-driven visualizations**
- Bar charts, line graphs
- Scatter plots, histograms
- Time series data

✅ **Interactive exploration** (if needed in WebSlides)
- Click to toggle options
- Hover for details
- User-controlled parameters

✅ **Non-mathematical diagrams**
- Concept maps (generic topics)
- Comparison tables
- Process flowcharts (business logic)

❌ **NOT for mathematical content**
- Don't use D3 for Venn diagrams
- Don't use D3 for equation layouts
- Don't use D3 for geometric proofs

**Examples:**
- ✅ Statistics (data charts)
- ✅ Topic overview (concept network)
- ❌ Sets (use Manim instead!)
- ❌ Algebra (use Manim instead!)

---

## 4. Standard Manim Patterns for Cambridge IGCSE

### **Pattern 1: Venn Diagrams (Sets C1.2)**

```python
# Always use this pattern for sets:
1. Draw universal set (rectangle)
2. Show all elements scattered
3. Draw Set A circle (hand-drawn style)
4. Animate numbers MOVING into Set A
5. Draw Set B circle (overlapping)
6. Animate numbers MOVING into Set B
7. Highlight intersection (yellow glow)
8. Show union (orange boundary)
```

### **Pattern 2: Number Classification Trees (C1.1)**

```python
# Pattern for number hierarchy:
1. Start with "Real Numbers" at top
2. Branch down to "Rational" and "Irrational"
3. Continue branching (Integers → Natural → Prime)
4. Animate numbers flowing down correct path
5. Highlight examples at each level
```

### **Pattern 3: Algebraic Expansion (C2.1)**

```python
# Pattern for (x+3)(x-2):
1. Show initial expression
2. Draw grid/area model
3. Animate multiplication (FOIL)
4. Collect like terms (move and combine)
5. Final simplified form
```

### **Pattern 4: Geometric Proofs**

```python
# Pattern for angle proofs:
1. Draw shape (triangle, circle, etc.)
2. Label angles/sides sequentially
3. Animate givens (highlight known info)
4. Show reasoning steps (arrows, equations)
5. Conclude with QED
```

---

## 5. Standardized Manim Styles

### **Colors (Consistent Across All Topics):**

```python
# Standard color palette
UNIVERSAL_SET = GRAY
SET_A = BLUE
SET_B = GREEN
INTERSECTION = YELLOW
UNION = ORANGE
COMPLEMENT = RED
HIGHLIGHT = "#ffeb3b"  # Bright yellow
BACKGROUND = BLACK
TEXT = WHITE
```

### **Typography:**

```python
# Standard font sizes
TITLE_SIZE = 60
HEADING_SIZE = 48
BODY_SIZE = 36
MATH_SIZE = 40
LABEL_SIZE = 32
```

### **Animation Speeds:**

```python
# Standard durations
FAST = 0.5  # Quick transitions
NORMAL = 1.0  # Standard speed
SLOW = 2.0  # For complex animations
PAUSE = 1.0  # Wait between steps
```

### **Hand-Drawn Aesthetic:**

```python
# Always use sketchy/hand-drawn style for shapes
def sketchy_circle(radius, center, color):
    """Create hand-drawn circle (3 overlapping with slight offset)"""
    return VGroup(*[
        Circle(
            radius=radius + 0.02*i,
            color=color,
            stroke_width=2
        ).move_to(center + np.array([
            0.02*np.random.randn(),
            0.02*np.random.randn(),
            0
        ]))
        for i in range(3)
    ])
```

---

## 6. Complete Sets Example (Production Quality)

### **File: `manim-sets-complete.py`**

```python
from manim import *
import numpy as np

class SetsComplete(Scene):
    """
    Complete Cambridge IGCSE Sets lesson
    C1.2 - Set Theory with Venn Diagrams

    Demonstrates:
    - Universal set
    - Sets A and B
    - Intersection (A ∩ B)
    - Union (A ∪ B)
    - Element counting n(A), n(B)
    """

    def construct(self):
        # Constants
        UNIVERSAL_COLOR = GRAY
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW
        UNION_COLOR = ORANGE

        # Title
        title = Text("Set Theory - Venn Diagrams", font_size=60, color=WHITE)
        self.play(Write(title))
        self.wait(0.5)
        self.play(title.animate.scale(0.6).to_edge(UP))

        # Universal set
        universal = Rectangle(width=12, height=6, color=UNIVERSAL_COLOR, stroke_width=2)
        universal_label = MathTex(r"\xi \text{ (Universal Set)}",
                                   font_size=32, color=UNIVERSAL_COLOR)
        universal_label.next_to(universal, UP+LEFT, buff=0.2)

        self.play(Create(universal), Write(universal_label))
        self.wait(0.5)

        # All numbers 1-10 scattered
        numbers = list(range(1, 11))
        number_mobs = VGroup(*[
            Text(str(n), font_size=32, color=WHITE)
            for n in numbers
        ])

        # Random positions in universal set
        np.random.seed(42)  # Reproducible
        for mob in number_mobs:
            mob.move_to(
                universal.get_center() +
                np.array([
                    np.random.uniform(-5, 5),
                    np.random.uniform(-2.5, 2.5),
                    0
                ])
            )

        self.play(
            LaggedStart(*[FadeIn(mob, scale=0.5) for mob in number_mobs],
                       lag_ratio=0.1)
        )
        self.wait(1)

        # Set A definition
        set_a_def = MathTex(r"A = \{1, 2, 3, 4, 5\}",
                            font_size=36, color=SET_A_COLOR)
        set_a_def.to_corner(UL, buff=0.5).shift(DOWN*0.8)
        self.play(Write(set_a_def))
        self.wait(0.5)

        # Draw Set A circle (hand-drawn)
        circle_a_center = LEFT * 2
        circles_a = self.create_sketchy_circle(2, circle_a_center, SET_A_COLOR)
        label_a = MathTex("A", font_size=48, color=SET_A_COLOR)
        label_a.next_to(circle_a_center + UP*2, UP, buff=0.2)

        self.play(Create(circles_a), Write(label_a), run_time=2)
        self.wait(0.5)

        # Animate numbers 1-5 into Set A
        set_a_indices = [0, 1, 2, 3, 4]  # Indices for 1, 2, 3, 4, 5
        a_positions = self.circle_positions(circle_a_center, 1.2, len(set_a_indices))

        animations = []
        for i, idx in enumerate(set_a_indices):
            animations.append(
                number_mobs[idx].animate
                .move_to(a_positions[i])
                .set_color(SET_A_COLOR)
            )

        self.play(*animations, run_time=2)
        self.wait(1)

        # Set B definition
        set_b_def = MathTex(r"B = \{4, 5, 6, 7, 8\}",
                            font_size=36, color=SET_B_COLOR)
        set_b_def.next_to(set_a_def, DOWN, aligned_edge=LEFT)
        self.play(Write(set_b_def))
        self.wait(0.5)

        # Draw Set B circle (overlapping with A)
        circle_b_center = RIGHT * 2
        circles_b = self.create_sketchy_circle(2, circle_b_center, SET_B_COLOR)
        label_b = MathTex("B", font_size=48, color=SET_B_COLOR)
        label_b.next_to(circle_b_center + UP*2, UP, buff=0.2)

        self.play(Create(circles_b), Write(label_b), run_time=2)
        self.wait(0.5)

        # Numbers 4, 5 are in both A and B (intersection)
        # Flash them to highlight
        self.play(
            Flash(number_mobs[3], color=INTERSECTION_COLOR, flash_radius=0.5),
            Flash(number_mobs[4], color=INTERSECTION_COLOR, flash_radius=0.5)
        )
        self.wait(0.5)

        # Move to intersection position (between circles)
        intersection_center = (circle_a_center + circle_b_center) / 2
        intersection_positions = [
            intersection_center + UP*0.5,
            intersection_center + DOWN*0.5
        ]

        self.play(
            number_mobs[3].animate.move_to(intersection_positions[0])
            .set_color(INTERSECTION_COLOR),
            number_mobs[4].animate.move_to(intersection_positions[1])
            .set_color(INTERSECTION_COLOR)
        )
        self.wait(1)

        # Numbers 6, 7, 8 into Set B (not in A)
        set_b_only_indices = [5, 6, 7]  # 6, 7, 8
        b_positions = self.circle_positions(circle_b_center + RIGHT*1, 1.0,
                                            len(set_b_only_indices))

        animations = []
        for i, idx in enumerate(set_b_only_indices):
            animations.append(
                number_mobs[idx].animate
                .move_to(b_positions[i])
                .set_color(SET_B_COLOR)
            )

        self.play(*animations, run_time=2)
        self.wait(1)

        # Show intersection
        intersection_label = MathTex(
            r"A \cap B = \{4, 5\}",
            font_size=36,
            color=INTERSECTION_COLOR
        )
        intersection_label.to_edge(DOWN, buff=1)
        self.play(Write(intersection_label))
        self.wait(2)

        self.play(FadeOut(intersection_label))

        # Show union
        union_label = MathTex(
            r"A \cup B = \{1, 2, 3, 4, 5, 6, 7, 8\}",
            font_size=36,
            color=UNION_COLOR
        )
        union_label.to_edge(DOWN, buff=1)

        # Highlight all numbers in A or B
        in_union = [0, 1, 2, 3, 4, 5, 6, 7]  # 1-8
        self.play(
            Write(union_label),
            *[number_mobs[i].animate.set_color(UNION_COLOR) for i in in_union]
        )
        self.wait(2)

        # Element counts
        self.play(FadeOut(union_label))

        counts = VGroup(
            MathTex(r"n(A) = 5", font_size=32, color=SET_A_COLOR),
            MathTex(r"n(B) = 5", font_size=32, color=SET_B_COLOR),
            MathTex(r"n(A \cap B) = 2", font_size=32, color=INTERSECTION_COLOR),
            MathTex(r"n(A \cup B) = 8", font_size=32, color=UNION_COLOR)
        )
        counts.arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        counts.to_corner(DR, buff=0.5)

        self.play(LaggedStart(*[Write(c) for c in counts], lag_ratio=0.3))
        self.wait(3)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects])

    def create_sketchy_circle(self, radius, center, color):
        """Create hand-drawn circle effect"""
        return VGroup(*[
            Circle(
                radius=radius + 0.03*i,
                color=color,
                stroke_width=2
            ).move_to(center + 0.03*np.random.randn(3))
            for i in range(3)
        ])

    def circle_positions(self, center, radius, count):
        """Calculate positions arranged in circle"""
        positions = []
        for i in range(count):
            angle = i * TAU / count
            pos = center + np.array([
                radius * np.cos(angle),
                radius * np.sin(angle),
                0
            ])
            positions.append(pos)
        return positions
```

---

## 7. Rendering & Integration

### **Render Manim:**

```bash
# Low quality (quick preview)
manim -ql manim-sets-complete.py SetsComplete

# Medium quality (720p)
manim -qm manim-sets-complete.py SetsComplete

# High quality (1080p production)
manim -qh manim-sets-complete.py SetsComplete
```

### **Embed in WebSlides:**

```html
<!-- Slide 3: Venn Diagram (Manim, NOT D3!) -->
<section class="bg-black aligncenter">
  <h2>Venn Diagrams - Animated</h2>

  <video width="1280" height="720" controls autoplay>
    <source src="videos/sets-complete.mp4" type="video/mp4">
  </video>

  <p style="margin-top: 20px;">
    Watch numbers move into their sets!
  </p>
</section>
```

---

## 8. Summary: Manim-First Standard

### **For Sets Topic:**
✅ Manim draws circles (hand-drawn style)
✅ Manim animates numbers moving into sets
✅ Manim highlights intersection/union
✅ Manim shows all operations sequentially

❌ No D3 for Venn diagrams
❌ No manual button clicking
❌ No static SVG circles

### **Result:**
- Professional, consistent quality
- Animated, not static
- Mathematical, not "web-like"
- Matches 3Blue1Brown standard

---

## Next Steps

Want me to:
1. **Render the complete Manim Sets animation** (production quality)?
2. **Replace the D3 Venn diagram** in WebSlides demo with Manim video?
3. **Create more Manim standards** for other topics (Algebra, Number Theory)?
4. **Build a Manim template library** for Cambridge IGCSE?

Let me know and I'll make it happen! 🎬
