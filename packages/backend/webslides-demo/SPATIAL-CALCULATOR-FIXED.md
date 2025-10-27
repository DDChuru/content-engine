# Spatial Calculator - Complete Mathematical Model

## Problem Statement

Given:
- Set A with `n_a` elements
- Set B with `n_b` elements
- Intersection with `n_i` elements
- Canvas size (fixed)

Calculate:
- Circle radius `r`
- Font size `f`
- Padding `p`
- Region radii for A-only, intersection, B-only

Such that:
- **NO overlaps**
- **Readable text**
- **Optimal space usage**

---

## Key Formulas

### 1. Element Physical Size

```python
# Convert font size to Manim units
# Empirical: font_size=38 ≈ 0.4 Manim units width/height
element_size = font_size / 95.0  # Conversion factor

# Element bounding box (square)
element_area = element_size ** 2

# With padding
element_footprint = (element_size + padding) ** 2
```

### 2. Circle Packing Capacity

```python
# Theoretical max elements in a circle
circle_area = π * region_radius²

# Packing efficiency (hexagonal packing ≈ 0.9069, use 0.75 for safety)
packing_efficiency = 0.75

# Maximum elements that can fit
max_elements = (circle_area * packing_efficiency) / element_footprint
```

### 3. Required Region Radius

```python
# Given number of elements, calculate minimum radius
required_radius = sqrt(
    (element_count * element_footprint) / (π * packing_efficiency)
)
```

### 4. Circle Overlap Geometry

```python
# For two circles of radius r, separated by distance d
# Intersection area (lens shape):
intersection_area = 2 * r² * arccos(d/(2r)) - (d/2) * sqrt(4*r² - d²)

# For Venn diagrams, we want:
# - Circle centers at distance d = 1.6r (moderate overlap)
# - Intersection region gets the lens-shaped area
```

---

## Complete Algorithm

### Step 1: Count Elements per Region

```python
a_only = set_a - set_b
b_only = set_b - set_a
intersection = set_a & set_b

n_a_only = len(a_only)
n_b_only = len(b_only)
n_intersection = len(intersection)
union_size = n_a_only + n_b_only + n_intersection
```

### Step 2: Determine Tier and Base Parameters

```python
if union_size <= 15:
    base_circle_radius = 2.2
    base_font_size = 38
    base_padding = 0.35
elif union_size <= 25:
    base_circle_radius = 2.0
    base_font_size = 32
    base_padding = 0.28
elif union_size <= 40:
    base_circle_radius = 1.8
    base_font_size = 28
    base_padding = 0.22
elif union_size <= 60:
    base_circle_radius = 1.5
    base_font_size = 24
    base_padding = 0.18
else:
    base_circle_radius = 1.2
    base_font_size = 20
    base_padding = 0.15
```

### Step 3: Calculate Element Footprint

```python
element_size = base_font_size / 95.0  # Manim units
element_footprint = (element_size + base_padding) ** 2
packing_efficiency = 0.75
```

### Step 4: Calculate Required Region Radii

```python
def calculate_region_radius(n_elements, element_footprint, packing_eff):
    if n_elements == 0:
        return 0

    required_area = (n_elements * element_footprint) / packing_eff
    return math.sqrt(required_area / math.pi)

# A-only region (left side of circle A)
r_a_only = calculate_region_radius(n_a_only, element_footprint, packing_efficiency)

# B-only region (right side of circle B)
r_b_only = calculate_region_radius(n_b_only, element_footprint, packing_efficiency)

# Intersection region (center overlap)
r_intersection = calculate_region_radius(n_intersection, element_footprint, packing_efficiency)
```

### Step 5: Validate Against Circle Size

```python
# Ensure regions fit within base circle radius
max_region_radius = base_circle_radius * 0.8  # Safety margin

if r_a_only > max_region_radius:
    # Reduce font size and recalculate
    scale_factor = max_region_radius / r_a_only
    base_font_size = int(base_font_size * scale_factor * 0.9)
    # Recalculate from Step 3

# Same for r_b_only and r_intersection
```

### Step 6: Calculate Optimal Layout Positions

```python
# Circle separation (distance between centers)
circle_separation = base_circle_radius * 1.6

circle_a_center = LEFT * (circle_separation / 2)
circle_b_center = RIGHT * (circle_separation / 2)

# Region centers
a_only_center = circle_a_center + LEFT * (base_circle_radius * 0.35)
b_only_center = circle_b_center + RIGHT * (base_circle_radius * 0.35)
intersection_center = (circle_a_center + circle_b_center) / 2
```

### Step 7: Hexagonal Packing Layout

```python
def hexagonal_pack(elements, center, max_radius, element_size, padding):
    """
    Pack elements in hexagonal grid pattern

    Hexagonal packing is OPTIMAL for circles/squares
    Achieves ~90% packing efficiency
    """
    positions = {}

    # Calculate hex grid spacing
    spacing = element_size + padding

    # Hexagonal offsets
    row = 0
    col = 0
    elem_idx = 0

    while elem_idx < len(elements):
        # Hexagonal grid coordinates
        x = col * spacing
        y = row * spacing * 0.866  # sqrt(3)/2 for hexagonal

        # Offset every other row (hex packing)
        if row % 2 == 1:
            x += spacing / 2

        # Center the pattern
        pos = center + np.array([x, y, 0])

        # Check if within max_radius
        if np.linalg.norm(pos - center) <= max_radius:
            positions[elements[elem_idx]] = pos
            elem_idx += 1

        # Move to next grid cell
        col += 1
        if col * spacing > max_radius * 2:
            col = 0
            row += 1

        # Safety: prevent infinite loop
        if row > 20:
            break

    return positions
```

---

## Example Calculation

**Given:**
- Set A = {1..20} → 20 elements
- Set B = {15..34} → 20 elements
- Intersection = {15..20} → 6 elements
- A-only = 14 elements
- B-only = 14 elements
- **Union = 34 elements**

**Step 1: Tier Selection**
- Union = 34 → **TIGHT tier**
- base_circle_radius = 1.8
- base_font_size = 28
- base_padding = 0.22

**Step 2: Element Footprint**
```
element_size = 28 / 95 = 0.295 units
element_footprint = (0.295 + 0.22)² = 0.265 units²
```

**Step 3: Region Radii**
```
A-only (14 elements):
r_a_only = sqrt((14 × 0.265) / (π × 0.75))
         = sqrt(3.71 / 2.356)
         = sqrt(1.575)
         = 1.25 units ✓

Intersection (6 elements):
r_intersection = sqrt((6 × 0.265) / (π × 0.75))
               = sqrt(1.59 / 2.356)
               = sqrt(0.675)
               = 0.82 units ✓

B-only (14 elements):
r_b_only = 1.25 units ✓
```

**Step 4: Validation**
```
Max allowed = 1.8 × 0.8 = 1.44 units
r_a_only = 1.25 < 1.44 ✓ PASS
r_b_only = 1.25 < 1.44 ✓ PASS
r_intersection = 0.82 < 1.44 ✓ PASS
```

**Result:** All elements will fit comfortably with NO overlaps!

---

## Implementation Checklist

- [ ] Calculate element_footprint from font_size
- [ ] Calculate region_radii using area formula
- [ ] Validate radii against circle size
- [ ] Use hexagonal packing (not circular rings!)
- [ ] Apply actual font_size to Text mobjects
- [ ] Add safety margin (10-20%)
- [ ] Test with 15, 34, 50, 100 elements
- [ ] Verify NO overlaps in all cases

---

## Why Previous Version Failed

❌ **Used circular ring layout** → uneven density
❌ **Hardcoded region radii** → `0.5 * radius` didn't scale
❌ **No capacity check** → didn't verify elements would fit
❌ **Font size not properly scaled** → elements too big
❌ **No packing efficiency** → wasted space

✅ **Fixed Version Uses:**
- Area-based capacity calculations
- Hexagonal packing (optimal)
- Dynamic region sizing
- Proper font scaling
- Mathematical validation

---

**Status:** Ready to implement! 🚀
