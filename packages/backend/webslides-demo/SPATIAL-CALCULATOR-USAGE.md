# Spatial Calculator Library - Usage Guide

## "Never commit to memory what you can always look up"

This library **encapsulates all the hard-won mathematical knowledge** about Venn diagram spatial layout so you NEVER have to re-derive it!

---

## Quick Start (5 minutes)

```python
from spatial_calculator import calculate_venn_layout, pack_venn_elements

# Your sets
set_a = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
set_b = {6, 7, 8, 9, 10, 11, 12, 13, 14, 15}

# Calculate layout (ONE LINE!)
layout = calculate_venn_layout(set_a, set_b, verbose=True)

# Pack elements (ONE LINE!)
positions = pack_venn_elements(
    sorted(set_a | set_b),
    set_a,
    set_b,
    layout
)

# Use the results
print(f"Circle separation: {layout.circle_separation}")
print(f"Lens area: {layout.lens_area}")
for elem, pos in positions.items():
    print(f"Element {elem} at position {pos}")
```

**That's it!** All the complexity is hidden in the library.

---

## What Problems Does This Solve?

### ❌ Before (Manual Calculation)

```python
# OH NO! You have to remember:
# - Lens area formula: A = 2R²·arccos(d/2R) - (d/2)·√(4R² - d²)
# - Bisection solver for circle separation
# - Hexagonal packing efficiency (0.75)
# - Font size conversion (font_size/95.0)
# - Independent region calculations
# - Safety margins
# - Tier thresholds
# ... and 50 other details!

# This takes 500+ lines of code and 2 hours of debugging!
```

### ✅ After (Library)

```python
# Just import and use!
from spatial_calculator import calculate_venn_layout

layout = calculate_venn_layout(set_a, set_b)
```

**2 hours → 2 minutes!**

---

## Complete Manim Example

```python
from manim import *
from spatial_calculator import VennSpatialCalculator

class VennDiagramWithLibrary(Scene):
    def construct(self):
        # Define sets
        set_a = set(range(1, 21))
        set_b = set(range(15, 35))

        # USE THE LIBRARY!
        calculator = VennSpatialCalculator(verbose=True)
        layout = calculator.calculate_layout(set_a, set_b)

        # Draw circles using calculated parameters
        circle_a = Circle(
            radius=layout.circle_radius,
            color=BLUE
        ).move_to(layout.circle_a_center)

        circle_b = Circle(
            radius=layout.circle_radius,
            color=GREEN
        ).move_to(layout.circle_b_center)

        self.play(Create(circle_a), Create(circle_b))

        # Create numbers with CORRECT font sizes per region
        intersection = set_a & set_b
        number_mobs = {}

        for n in sorted(set_a | set_b):
            if n in intersection:
                font_size = layout.lens_font_size
            else:
                font_size = layout.crescent_font_size

            number_mobs[n] = Text(str(n), font_size=font_size)

        # Pack elements using the library
        positions = calculator.pack_elements(
            sorted(set_a | set_b),
            set_a,
            set_b,
            layout
        )

        # Animate to positions
        for num, pos in positions.items():
            number_mobs[num].move_to(pos)

        self.play(*[FadeIn(mob) for mob in number_mobs.values()])
        self.wait(2)
```

**Look how simple it is!** No math, no bisection solvers, no debugging!

---

## API Reference

### Main Functions

#### `calculate_venn_layout(set_a, set_b, verbose=False)`

Calculate complete spatial layout for Venn diagram.

**Parameters:**
- `set_a` (Set): First set
- `set_b` (Set): Second set
- `verbose` (bool): Print debug output

**Returns:**
- `VennLayout` object with all spatial parameters

**Example:**
```python
layout = calculate_venn_layout({1, 2, 3}, {2, 3, 4}, verbose=True)
```

---

#### `pack_venn_elements(elements, set_a, set_b, layout)`

Pack elements into positions using pre-calculated layout.

**Parameters:**
- `elements` (List): All elements to position
- `set_a` (Set): First set
- `set_b` (Set): Second set
- `layout` (VennLayout): Pre-calculated layout

**Returns:**
- `Dict[element, np.ndarray]`: Element -> position mapping

**Example:**
```python
positions = pack_venn_elements(
    sorted({1, 2, 3, 4}),
    {1, 2, 3},
    {2, 3, 4},
    layout
)
```

---

### VennLayout Object

The `VennLayout` object contains **everything you need**:

```python
layout.union_size           # Total unique elements
layout.intersection_size    # Elements in both sets
layout.a_only_size          # Elements only in A
layout.b_only_size          # Elements only in B

layout.circle_radius        # Radius of circles
layout.circle_separation    # Distance between centers (SOLVED!)
layout.circle_a_center      # Position of circle A
layout.circle_b_center      # Position of circle B

layout.tier                 # 'comfortable', 'moderate', 'tight', etc.

# LENS parameters (intersection region)
layout.lens_font_size       # Font size for intersection
layout.lens_element_size    # Element size in Manim units
layout.lens_padding         # Padding between elements
layout.lens_area            # Actual lens area
layout.lens_width           # Lens width
layout.lens_height          # Lens height

# CRESCENT parameters (A-only, B-only regions)
layout.crescent_font_size   # Font size for crescents
layout.crescent_element_size # Element size in Manim units
layout.crescent_padding     # Padding between elements
layout.crescent_radii       # {'a_only': ..., 'b_only': ...}

layout.is_valid             # Validation result
layout.warnings             # List of warnings
```

---

## Advanced Usage

### Class-Based API

For more control, use the class directly:

```python
from spatial_calculator import VennSpatialCalculator

calculator = VennSpatialCalculator(verbose=True)

# Calculate layout
layout = calculator.calculate_layout(set_a, set_b)

# Pack elements
positions = calculator.pack_elements(elements, set_a, set_b, layout)

# Access internals if needed
lens_area = calculator._calculate_lens_area(radius, separation)
```

---

## What's Inside the Library?

The library encapsulates:

1. **Lens Geometry** - Intersection is a lens shape (vesica piscis), not a circle
2. **Bisection Solver** - Finds optimal circle separation for required lens area
3. **Independent Regions** - Lens and crescents calculated separately (no leaking!)
4. **Hexagonal Packing** - Optimal 90.69% space efficiency
5. **Tier Selection** - Automatic scaling based on element count
6. **Mathematical Validation** - Ensures everything fits properly

**500+ lines of complex mathematics → 2 lines of simple code!**

---

## Testing

Run the self-test:

```bash
conda run -n aitools python spatial_calculator.py
```

Expected output:
```
✓ Layout calculated successfully!
✓ 34 elements positioned
Circle separation: 2.324
Lens area: 2.437
✓ ALL TESTS PASSED - Library ready for production!
```

---

## Benefits

### ✅ Never Re-Derive Mathematics
All formulas are implemented once, tested, and reused forever.

### ✅ Consistent Results
Same inputs always produce same outputs (deterministic).

### ✅ Easy to Maintain
Fix bugs in ONE place, benefits ALL projects.

### ✅ Self-Documenting
Code is readable, parameters have clear names.

### ✅ Production-Ready
Includes validation, warnings, error handling.

---

## Migration from Manual Code

**Old way (500+ lines):**
```python
# Calculate element footprint
element_size = font_size / 95.0
element_footprint = (element_size + padding) ** 2

# Solve for separation (bisection solver)
d_min = 0
d_max = 2 * R
for i in range(100):
    d_mid = (d_min + d_max) / 2
    area_mid = calculate_lens_area(R, d_mid)
    # ... 50 more lines ...

# Calculate lens dimensions
# ... 30 more lines ...

# Hexagonal packing
# ... 80 more lines ...

# Validate everything
# ... 40 more lines ...
```

**New way (2 lines):**
```python
from spatial_calculator import calculate_venn_layout
layout = calculate_venn_layout(set_a, set_b)
```

---

## Future Extensions

The library is designed to be extended:

```python
# Add three-circle Venn diagrams
def calculate_three_venn_layout(set_a, set_b, set_c):
    # TODO: Extend to three sets
    pass

# Add custom packing strategies
def square_pack(elements, center, radius):
    # Alternative to hexagonal packing
    pass

# Add validation visualizations
def visualize_layout(layout):
    # Debug helper
    pass
```

---

## Summary

**"Never commit to memory what you can always look up"**

This library IS your lookup reference. It contains:
- ✅ All the hard-won mathematical knowledge
- ✅ Tested, production-ready code
- ✅ Clear, reusable API
- ✅ Complete documentation

**Stop re-deriving. Start reusing!**

---

## Files

- `spatial_calculator.py` - The library (import this!)
- `SPATIAL-CALCULATOR-USAGE.md` - This documentation
- `manim-lens-isolated.py` - Reference implementation
- `LENS-GEOMETRY-INSIGHT.md` - Mathematical deep-dive

---

**Version:** 1.0.0
**Status:** ✅ PRODUCTION-READY
**Author:** AI-Assisted Development (2025-10-26)
