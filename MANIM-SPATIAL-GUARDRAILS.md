# Manim Spatial Guardrails System

**Status:** ✅ Complete (mirrors D3 system)
**Date:** 2025-10-25

---

## Overview

Comprehensive spatial planning and validation system for **Manim animations**. Ensures consistent, collision-free, edge-safe output with proper positioning.

**Mirrors the D3 spatial guardrails** but adapted for Manim's unique coordinate system.

---

## Key Differences: Manim vs D3

| Aspect | D3 (SVG/Web) | Manim (Python/Math) |
|--------|--------------|---------------------|
| **Coordinate System** | Pixel-based (0,0 = top-left) | Unit-based (0,0 = center) |
| **X-axis** | 0 to 1920px | -7.111 to 7.111 units |
| **Y-axis** | 0 to 1080px (down) | -4 to 4 units (up) |
| **Origin** | Top-left corner | Center of screen |
| **Positioning** | Absolute pixels | Relative units |
| **File Format** | JavaScript/TypeScript | Python |

---

## Architecture

### 1. Manim Coordinate System

**Critical understanding:**

```
Pixel coordinates (0,0 at top-left):
    (0,0) ──────────────────> X (1920)
      │
      │
      ↓ Y (1080)

Manim coordinates (0,0 at center):
         Y (4)
          ↑
          │
  -7 ←────┼────→ 7  (X)
          │
          ↓
         -4
```

**Conversion functions provided:**
```python
from manim_spatial_config import MANIM_COORDS

# Pixel to Manim
x_manim = MANIM_COORDS.pixel_to_manim_x(960)    # 0.0 (center)
y_manim = MANIM_COORDS.pixel_to_manim_y(540)    # 0.0 (center)

# Get safe bounds
bounds = MANIM_COORDS.get_safe_bounds()
# Returns: {'left': -6.5, 'right': 6.5, 'top': 3.5, 'bottom': -3.5}
```

### 2. Spatial Configuration (`manim-spatial-config.py`)

**Single source of truth** for Manim spatial constraints.

```python
from manim_spatial_config import *

class CANVAS:
    WIDTH = 1920
    HEIGHT = 1080

    class PADDING:
        OUTER = 50      # Prevents edge clipping
        INNER = 20      # Between elements
        GROUP = 40      # Between groups
        STEP = 15       # Between steps
```

**Safe positioning helper:**
```python
# Get position within safe zone
# x_percent: 0.0 (left) to 1.0 (right)
# y_percent: 0.0 (top) to 1.0 (bottom)

title_pos = get_safe_position(0.5, 0.1)     # Center top
left_pos = get_safe_position(0.2, 0.5)      # Left middle
right_pos = get_safe_position(0.8, 0.5)     # Right middle
```

### 3. Layout Zones

**Vertical division of screen:**

```python
class ZONES:
    TITLE:
        HEIGHT = 120px
        # Top zone for title text

    CONTENT:
        # Main animation zone
        # get_bounds() returns Manim coordinates

    FOOTER:
        HEIGHT = 60px
        # Bottom zone for branding/progress
```

**Usage:**
```python
from manim_spatial_config import ZONES

# Position title in title zone
title = Text("My Title", font_size=56)
title.move_to([0, ZONES.TITLE.get_y(), 0])

# Get content area for animations
content_bounds = ZONES.CONTENT.get_bounds()
# Returns: {'left': -6.5, 'right': 6.5, 'top': 1.5, 'bottom': -3.0, ...}
```

### 4. Fonts & Colors

**Matches D3 system:**

```python
from manim_spatial_config import FONTS, COLORS

# Fonts
title = Text("Title", font=FONTS.DISPLAY, font_size=FONTS.SIZES.MAIN_TITLE)
body = Text("Body", font=FONTS.PRIMARY, font_size=FONTS.SIZES.BODY)
code = Text("x = 10", font=FONTS.MONO, font_size=FONTS.SIZES.CODE)

# Colors (blackboard aesthetic)
background = COLORS.BACKGROUND        # #000000
primary = COLORS.CHALK.WHITE          # #ffffff
accent = COLORS.CHALK.BLUE            # #3b82f6
success = COLORS.CHALK.GREEN          # #10b981
highlight = COLORS.CHALK.YELLOW       # #fbbf24
```

### 5. Collision Detection

**Helper functions:**

```python
from manim_spatial_config import check_collision, arrange_without_collision

# Check if two objects collide
if check_collision(text1, text2, buffer=0.3):
    print("WARNING: Objects overlapping!")

# Auto-arrange without collisions
items = [Circle(), Square(), Triangle()]
group = arrange_without_collision(items, direction=RIGHT, buffer=0.5)
```

### 6. Auto-scaling & Bounds Enforcement

**Ensure mobjects fit in safe zone:**

```python
from manim_spatial_config import ensure_safe_bounds

# Create large object
diagram = VGroup(...)  # Complex diagram

# Auto-scale if too large, shift if outside bounds
ensure_safe_bounds(diagram)

# Now safe to add to scene
self.add(diagram)
```

---

## Prompt System (`manim-visualization-prompt.ts`)

### Purpose

Generate prompts for Claude that embed all Manim spatial constraints.

### buildManimVisualizationPrompt()

**Generates comprehensive prompt with:**

1. **Spatial Constraints Section**
   - Manim coordinate system explanation
   - Safe zone boundaries
   - Max elements on screen
   - Required imports (manim_spatial_config.py)
   - Positioning examples

2. **Animation Guidance Section**
   - Type-specific guidance (equation, geometry, graph, transformation, proof)
   - Timing guidelines (fast/normal/slow)
   - Visual hierarchy rules
   - Blackboard aesthetic enforcement

3. **Manim Best Practices Section**
   - Create vs Add patterns
   - Transform equations
   - Relative positioning
   - Grouping & arranging
   - Collision avoidance
   - Fade out patterns

4. **Python Code Guidelines Section**
   - Required imports
   - Class structure with time tracking
   - Common mistakes to avoid

5. **Validation Checklist Section**
   - Pre-flight checklist for Claude
   - Ensures all spatial rules followed

### Specialized Prompts

```typescript
// Equation derivation
buildEquationPrompt("x^2 + 3x + 2", 'full', ['Factor', 'Simplify']);

// Geometry theorem
buildGeometryPrompt("Pythagorean Theorem", 'full', true);

// Function graph
buildGraphPrompt("f(x) = x^2", 'full');
```

---

## Common Issues Fixed

### Issue 1: Hardcoded Positions

**❌ Before (breaks on different screen sizes):**
```python
title.move_to([3, 2, 0])  # Hardcoded - BAD!
```

**✅ After (responsive):**
```python
from manim_spatial_config import get_safe_position

title.move_to(get_safe_position(0.6, 0.3))  # Responsive - GOOD!
```

### Issue 2: Elements Outside Safe Zone

**❌ Before:**
```python
text = Text("Long text that goes off screen...")
text.to_edge(RIGHT)  # Might touch edge - BAD!
```

**✅ After:**
```python
from manim_spatial_config import ensure_safe_bounds

text = Text("Long text that goes off screen...")
text.to_edge(RIGHT)
ensure_safe_bounds(text)  # Auto-scales/shifts - GOOD!
```

### Issue 3: Overlapping Elements

**❌ Before:**
```python
title = Text("Title")
subtitle = Text("Subtitle")
subtitle.next_to(title, DOWN)  # Might overlap - BAD!
```

**✅ After:**
```python
from manim_spatial_config import ELEMENT_CONSTRAINTS

title = Text("Title")
subtitle = Text("Subtitle")
subtitle.next_to(title, DOWN, buff=ELEMENT_CONSTRAINTS.TEXT.LINE_SPACING)  # GOOD!
```

### Issue 4: No Time Tracking

**❌ Before:**
```python
class MyScene(Scene):
    def construct(self):
        self.play(Create(circle))
        self.wait()
        # No duration control - BAD!
```

**✅ After:**
```python
class MyScene(Scene):
    def construct(self):
        time_spent = 0
        target_duration = 10.0

        self.play(Create(circle), run_time=1.5)
        time_spent += 1.5

        self.wait(0.5)
        time_spent += 0.5

        # Pad to target duration
        remaining = max(0, target_duration - time_spent)
        if remaining > 0:
            self.wait(remaining)

        # GOOD - exact duration control!
```

---

## Integration with D3 System

### Split Mode (D3 left, Manim right)

**D3 takes left 50%, Manim takes right 50%:**

```python
from manim_spatial_config import LAYOUT_MODES

layout = LAYOUT_MODES.get_split()
# Returns: {
#   'width': 850px,
#   'height': 800px,
#   'max_elements': 6,
#   'bounds': {'left': 0, 'right': 6.5, ...}
# }

# Position content in right half only
content_bounds = layout['bounds']
# Manim animations stay in right half
```

### Unified Rendering

**Both systems use same:**
- 1920×1080 canvas
- 50px outer padding
- Same color palette (blackboard aesthetic)
- Same font families
- Same layout modes (full, split, stepByStep, grid)

---

## Validation System

### ManimValidator Class

**Purpose:** Validate scenes before rendering

```python
from manim_spatial_config import ManimValidator

class MyScene(Scene):
    def construct(self):
        # Build scene...
        title = Text("Title")
        self.add(title)

        # Validate before rendering
        validation = ManimValidator.validate_scene(self)

        if not validation['valid']:
            print(f"Errors: {validation['errors']}")

        if validation['warnings']:
            print(f"Warnings: {validation['warnings']}")
            # Example warning: "Mobject Text may be outside vertical safe zone"
```

**Checks performed:**
- ✓ Mobjects within safe bounds (horizontal & vertical)
- ✓ Mobjects not exceeding max width/height
- ✓ Proper spacing between elements

---

## Usage Example

**Complete Manim script with spatial guardrails:**

```python
from manim import *
from manim_spatial_config import (
    get_safe_position,
    ensure_safe_bounds,
    arrange_without_collision,
    check_collision,
    COLORS,
    FONTS,
    ELEMENT_CONSTRAINTS,
    ManimValidator
)

class Division14By3(Scene):
    def construct(self):
        # Time tracking
        time_spent = 0
        target_duration = 10.0

        # Title (safe position - center top)
        title = Text(
            "14 ÷ 3 = ?",
            font=FONTS.DISPLAY,
            font_size=FONTS.SIZES.MAIN_TITLE,
            color=COLORS.CHALK.WHITE
        )
        title.move_to(get_safe_position(0.5, 0.1))
        ensure_safe_bounds(title)

        self.play(Write(title), run_time=1.0)
        time_spent += 1.0
        self.wait(0.5)
        time_spent += 0.5

        # Create groups
        groups = []
        for i in range(4):
            group = VGroup(
                Circle(radius=0.3, color=COLORS.CHALK.BLUE),
                Circle(radius=0.3, color=COLORS.CHALK.BLUE),
                Circle(radius=0.3, color=COLORS.CHALK.BLUE)
            )
            group.arrange(RIGHT, buff=0.2)
            groups.append(group)

        # Arrange without collisions
        all_groups = arrange_without_collision(groups, direction=DOWN, buffer=0.5)
        all_groups.move_to(get_safe_position(0.5, 0.5))

        self.play(Create(all_groups), run_time=2.0)
        time_spent += 2.0
        self.wait(0.5)
        time_spent += 0.5

        # Answer
        answer = Text(
            "4 groups (2 left over)",
            font_size=FONTS.SIZES.SUBTITLE,
            color=COLORS.CHALK.GREEN
        )
        answer.move_to(get_safe_position(0.5, 0.85))

        self.play(FadeIn(answer), run_time=1.0)
        time_spent += 1.0
        self.wait(0.5)
        time_spent += 0.5

        # Validate
        validation = ManimValidator.validate_scene(self)
        if validation['warnings']:
            for w in validation['warnings']:
                print(f"WARNING: {w}")

        # Pad to target duration
        remaining = max(0, target_duration - time_spent)
        if remaining > 0:
            self.wait(remaining)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.5)
```

---

## File Reference

### Core Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/config/manim-spatial-config.py` | Spatial config for Manim (Python) | ~500 |
| `src/prompts/manim-visualization-prompt.ts` | Prompt builder for Claude | ~400 |

### Documentation

| File | Purpose |
|------|---------|
| `MANIM-SPATIAL-GUARDRAILS.md` | This file - implementation guide |

---

## Benefits

### 1. Consistency with D3

✅ **Same spatial rules** across D3 and Manim
✅ **Same coordinate mapping** for split/unified modes
✅ **Same color palette** (blackboard aesthetic)

### 2. Prevents Common Manim Issues

✅ **No more edge clipping** (50px padding enforced)
✅ **No more overlaps** (collision detection)
✅ **No more hardcoded positions** (responsive positioning)
✅ **Exact duration control** (time tracking)

### 3. Agent-Friendly

✅ **Prompts embed all rules** (Claude generates valid code)
✅ **Validation before render** (catch errors early)
✅ **Clear error messages** (easy debugging)

---

## Next Steps

1. ✅ **Manim config built** - `manim-spatial-config.py`
2. ✅ **Prompts built** - `manim-visualization-prompt.ts`
3. ⬜ **Test with existing Manim scripts** - Apply to generated scenes
4. ⬜ **Integrate into content generation pipeline**
5. ⬜ **Build agents that use Manim prompts**

---

## Conclusion

**Status:** ✅ Production Ready (pending testing)

The Manim spatial guardrails system is **complete and ready to use**. It mirrors the D3 system but adapted for Manim's coordinate system and Python syntax.

**Key difference from D3:** Manim uses center-based coordinates, so we provide conversion functions and safe positioning helpers.

**Next:** Test with existing Manim scripts and integrate into agents.

---

**Generated:** 2025-10-25
**System Status:** Production Ready
**Dependencies:** Manim Community v0.19.0
