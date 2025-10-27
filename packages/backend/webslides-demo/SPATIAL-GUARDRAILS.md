# Spatial Collision Avoidance Strategy

## The Problem

When animating mathematical visualizations (Manim or D3), we need to prevent:
- Numbers overlapping each other
- Labels colliding with shapes
- Text overlapping with circles/diagrams
- Elements moving through each other during animation

## Current Approaches (What We Use Now)

### 1. **Fixed Grid Positioning** (Manual Layout)

**Current implementation in `manim-sets-step-by-step.py`:**

```python
# Set A only: 1, 2, 3 (left side)
union_mobs[0].move_to(circle_a_left + LEFT*1.0 + UP*0.5)      # 1
union_mobs[1].move_to(circle_a_left + LEFT*1.0 + DOWN*0.5)    # 2
union_mobs[2].move_to(circle_a_left + LEFT*1.0)               # 3

# Intersection: 4, 5 (center)
union_mobs[3].move_to(ORIGIN + UP*0.4)                        # 4
union_mobs[4].move_to(ORIGIN + DOWN*0.4)                      # 5

# Set B only: 6, 7, 8 (right side)
union_mobs[5].move_to(circle_b_right + RIGHT*1.0 + UP*0.5)    # 6
union_mobs[6].move_to(circle_b_right + RIGHT*1.0 + DOWN*0.5)  # 7
union_mobs[7].move_to(circle_b_right + RIGHT*1.0)             # 8
```

**Pros:**
- ✅ Simple, predictable
- ✅ Works well for small, known sets

**Cons:**
- ❌ Requires manual positioning for each element
- ❌ Doesn't scale to larger sets (e.g., 20 numbers)
- ❌ Hard to adjust if set sizes change

---

### 2. **Circular Positioning** (Evenly Spaced on Circle)

**Current implementation:**

```python
def circle_positions(self, center, radius, count):
    """Calculate evenly spaced positions around a circle"""
    positions = []
    for i in range(count):
        angle = i * TAU / count - PI/2  # Start from top
        pos = center + np.array([
            radius * np.cos(angle),
            radius * np.sin(angle),
            0
        ])
        positions.append(pos)
    return positions
```

**Pros:**
- ✅ Automatically distributes elements evenly
- ✅ Scales to any number of elements
- ✅ No manual positioning needed

**Cons:**
- ❌ Only works for circular layouts
- ❌ Can still overlap if radius too small or elements too large

**Example usage:**
```python
positions_a = self.circle_positions(circle_a_center, 1.3, 5)
```

---

## Advanced Strategies We Can Implement

### 3. **Force-Directed Layout** (Physics Simulation)

**Concept:** Use physics simulation to push overlapping elements apart.

```python
def force_directed_layout(elements, bounds, iterations=100):
    """
    Use force-directed algorithm to position elements without overlap

    Args:
        elements: List of (mobject, desired_position) tuples
        bounds: Rectangle defining the layout area
        iterations: Number of simulation steps
    """
    positions = np.array([pos for _, pos in elements])

    for _ in range(iterations):
        # Repulsion force between overlapping elements
        for i in range(len(elements)):
            for j in range(i + 1, len(elements)):
                diff = positions[i] - positions[j]
                dist = np.linalg.norm(diff)

                # Get element sizes
                size_i = get_element_size(elements[i][0])
                size_j = get_element_size(elements[j][0])
                min_dist = (size_i + size_j) / 2 + 0.2  # Padding

                if dist < min_dist:
                    # Push apart
                    force = (min_dist - dist) / min_dist
                    direction = diff / (dist + 0.001)  # Avoid division by zero
                    positions[i] += direction * force * 0.1
                    positions[j] -= direction * force * 0.1

        # Attraction to desired position
        for i, (_, desired) in enumerate(elements):
            diff = desired - positions[i]
            positions[i] += diff * 0.1

        # Keep within bounds
        positions = np.clip(positions, bounds.min, bounds.max)

    return positions

def get_element_size(mobject):
    """Get the bounding box size of a mobject"""
    return max(mobject.width, mobject.height)
```

**Usage:**
```python
# Define desired positions (can overlap initially)
elements = [
    (num_1, LEFT*2 + UP*1),
    (num_2, LEFT*2 + UP*0.8),  # Too close to num_1!
    (num_3, LEFT*2),
]

# Get collision-free positions
final_positions = force_directed_layout(elements, universal_bounds)

# Animate to final positions
self.play(*[
    elem.animate.move_to(pos)
    for (elem, _), pos in zip(elements, final_positions)
])
```

**Pros:**
- ✅ Automatically prevents overlap
- ✅ Works for any layout
- ✅ Feels natural (physics-based)

**Cons:**
- ⚠️ Computationally expensive
- ⚠️ Can be unpredictable (elements may end up far from desired position)

---

### 4. **Grid Snapping** (D3-style)

**Concept:** Divide the space into a grid, assign elements to grid cells.

```python
def grid_layout(elements, bounds, grid_size=0.5):
    """
    Place elements on a grid to avoid overlap

    Args:
        elements: List of mobjects to position
        bounds: Rectangle defining the layout area
        grid_size: Size of grid cells
    """
    # Create grid
    width = bounds.width
    height = bounds.height
    cols = int(width / grid_size)
    rows = int(height / grid_size)

    # Occupied cells
    occupied = set()
    positions = []

    for elem in elements:
        # Try to place near desired position
        desired = elem.get_center()
        col = int((desired[0] - bounds.get_left()) / grid_size)
        row = int((desired[1] - bounds.get_bottom()) / grid_size)

        # Find nearest free cell
        for r in range(rows):
            for c in range(cols):
                check_row = (row + r) % rows
                check_col = (col + c) % cols

                if (check_row, check_col) not in occupied:
                    occupied.add((check_row, check_col))

                    # Calculate position
                    x = bounds.get_left() + check_col * grid_size + grid_size/2
                    y = bounds.get_bottom() + check_row * grid_size + grid_size/2
                    positions.append(np.array([x, y, 0]))
                    break
            else:
                continue
            break

    return positions
```

**Pros:**
- ✅ Guaranteed no overlap
- ✅ Predictable, fast
- ✅ Easy to implement

**Cons:**
- ❌ Looks "gridded" (not organic)
- ❌ Wastes space if grid too coarse

---

### 5. **Region-Based Layout** (Voronoi Partitioning)

**Concept:** Divide space into regions, place one element per region.

```python
def voronoi_layout(elements, bounds, regions):
    """
    Place elements in predefined regions

    Args:
        elements: List of mobjects
        bounds: Overall bounding area
        regions: List of region definitions
          e.g., ['left_only', 'intersection', 'right_only']
    """
    region_centers = {
        'left_only': bounds.get_center() + LEFT*2,
        'intersection': bounds.get_center(),
        'right_only': bounds.get_center() + RIGHT*2,
        'top': bounds.get_center() + UP*2,
        'bottom': bounds.get_center() + DOWN*2,
    }

    positions = []
    for elem, region in zip(elements, regions):
        center = region_centers[region]

        # Add some randomness to avoid perfect alignment
        jitter = np.random.uniform(-0.3, 0.3, 3)
        jitter[2] = 0  # Keep z=0

        positions.append(center + jitter)

    return positions
```

**Usage:**
```python
# Venn diagram with regions
elements_and_regions = [
    (num_1, 'left_only'),   # In A only
    (num_2, 'left_only'),
    (num_3, 'left_only'),
    (num_4, 'intersection'), # In A and B
    (num_5, 'intersection'),
    (num_6, 'right_only'),  # In B only
    (num_7, 'right_only'),
    (num_8, 'right_only'),
]

positions = voronoi_layout([e for e, _ in elements_and_regions],
                           universal,
                           [r for _, r in elements_and_regions])
```

**Pros:**
- ✅ Semantically meaningful (respects set membership)
- ✅ Clean separation
- ✅ Fast

**Cons:**
- ❌ Requires manual region definition
- ❌ Still can overlap within a region

---

### 6. **Bounding Box Collision Detection** (Simple Check)

**Concept:** Check if two elements' bounding boxes overlap before placing.

```python
def check_collision(mob1, mob2, padding=0.1):
    """
    Check if two mobjects' bounding boxes collide

    Args:
        mob1, mob2: Manim mobjects
        padding: Extra space around each element
    """
    # Get bounding boxes
    box1 = mob1.get_bounding_box()
    box2 = mob2.get_bounding_box()

    # Expand boxes by padding
    min1 = box1.min(axis=0) - padding
    max1 = box1.max(axis=0) + padding
    min2 = box2.min(axis=0) - padding
    max2 = box2.max(axis=0) + padding

    # Check for overlap
    return (min1[0] <= max2[0] and max1[0] >= min2[0] and
            min1[1] <= max2[1] and max1[1] >= min2[1])

def place_without_collision(new_elem, existing_elems,
                           desired_pos, search_radius=2.0):
    """
    Find a position for new_elem that doesn't collide with existing

    Args:
        new_elem: Mobject to place
        existing_elems: List of already-placed mobjects
        desired_pos: Preferred position
        search_radius: How far to search for free spot
    """
    # Try desired position first
    new_elem.move_to(desired_pos)

    if not any(check_collision(new_elem, e) for e in existing_elems):
        return desired_pos

    # Try positions in a spiral around desired position
    for r in np.linspace(0.3, search_radius, 20):
        for angle in np.linspace(0, TAU, 16):
            test_pos = desired_pos + np.array([
                r * np.cos(angle),
                r * np.sin(angle),
                0
            ])

            new_elem.move_to(test_pos)
            if not any(check_collision(new_elem, e) for e in existing_elems):
                return test_pos

    # If all else fails, return desired position (will overlap)
    return desired_pos
```

**Usage:**
```python
placed_elements = []

for num_mob, desired_pos in zip(number_mobs, desired_positions):
    # Find collision-free position
    final_pos = place_without_collision(
        num_mob,
        placed_elements,
        desired_pos
    )

    # Animate to position
    self.play(num_mob.animate.move_to(final_pos))
    placed_elements.append(num_mob)
```

**Pros:**
- ✅ Simple to implement
- ✅ Works well for small sets
- ✅ Respects desired position (finds nearest free spot)

**Cons:**
- ⚠️ Can be slow for large sets (O(n²))
- ⚠️ May fail if space is very crowded

---

## Recommended Strategy for Cambridge IGCSE

**Use a hybrid approach:**

### For Venn Diagrams (Sets):
1. **Region-based layout** (#5) for semantic correctness
2. **Bounding box collision detection** (#6) within each region
3. **Circular positioning** (#2) as fallback

```python
def smart_venn_layout(numbers, set_a, set_b, circle_a_center, circle_b_center):
    """
    Intelligent Venn diagram layout with collision avoidance
    """
    # Step 1: Assign regions
    regions = {
        'a_only': [],
        'intersection': [],
        'b_only': [],
        'neither': []
    }

    for num in numbers:
        if num in set_a and num in set_b:
            regions['intersection'].append(num)
        elif num in set_a:
            regions['a_only'].append(num)
        elif num in set_b:
            regions['b_only'].append(num)
        else:
            regions['neither'].append(num)

    # Step 2: Position within each region
    positions = {}

    # A only (left side of circle A)
    if regions['a_only']:
        positions.update(
            position_in_circle(
                regions['a_only'],
                circle_a_center + LEFT*0.8,
                radius=0.8
            )
        )

    # Intersection (center, between circles)
    if regions['intersection']:
        positions.update(
            position_in_circle(
                regions['intersection'],
                (circle_a_center + circle_b_center) / 2,
                radius=0.5
            )
        )

    # B only (right side of circle B)
    if regions['b_only']:
        positions.update(
            position_in_circle(
                regions['b_only'],
                circle_b_center + RIGHT*0.8,
                radius=0.8
            )
        )

    return positions

def position_in_circle(elements, center, radius):
    """Position elements in a circle with collision detection"""
    count = len(elements)
    positions = {}

    if count == 1:
        # Single element: place at center
        positions[elements[0]] = center
    elif count == 2:
        # Two elements: vertical stack
        positions[elements[0]] = center + UP*0.4
        positions[elements[1]] = center + DOWN*0.4
    else:
        # Multiple: circular layout
        for i, elem in enumerate(elements):
            angle = i * TAU / count - PI/2
            pos = center + np.array([
                radius * np.cos(angle),
                radius * np.sin(angle),
                0
            ])
            positions[elem] = pos

    return positions
```

---

## D3 Strategy (For Interactive Visualizations)

D3 has built-in force simulation:

```typescript
// d3-viz-engine.ts enhancement
import * as d3 from 'd3';

function createVennDiagramWithCollisionAvoidance(data) {
  const simulation = d3.forceSimulation(data.numbers)
    .force('collision', d3.forceCollide().radius(20))  // Prevent overlap
    .force('x', d3.forceX(d => getRegionX(d)))         // Attract to region
    .force('y', d3.forceY(d => getRegionY(d)))
    .stop();

  // Run simulation
  for (let i = 0; i < 300; i++) simulation.tick();

  // Use final positions
  svg.selectAll('text')
    .data(data.numbers)
    .attr('x', d => d.x)
    .attr('y', d => d.y);
}
```

---

## Implementation Priority

**Phase 1 (Now):**
- ✅ Manual positioning for small sets (< 10 elements)
- ✅ Circular layout helper function

**Phase 2 (Next):**
- 🔨 Region-based layout for Venn diagrams
- 🔨 Bounding box collision detection

**Phase 3 (Future):**
- 📋 Force-directed layout for complex diagrams
- 📋 Grid snapping for tables/matrices

---

## Testing Collision Avoidance

```python
# Test with crowded set
class TestCollisionAvoidance(Scene):
    def construct(self):
        # Try to place 20 numbers in a small circle
        numbers = list(range(1, 21))
        circle = Circle(radius=2, color=BLUE)

        # Without collision avoidance: OVERLAP!
        # With collision avoidance: CLEAN!

        positions = smart_layout(numbers, circle.get_center(), radius=1.5)

        number_mobs = VGroup(*[
            Text(str(n), font_size=32, color=WHITE)
            for n in numbers
        ])

        for mob, pos in zip(number_mobs, positions):
            mob.move_to(pos)

        self.play(Create(circle))
        self.play(LaggedStart(*[FadeIn(mob) for mob in number_mobs]))
        self.wait(2)
```

---

## Summary

**Current approach:** Manual + circular positioning (works for simple cases)

**Recommended upgrade:** Region-based + collision detection (scalable, semantic)

**Future:** Force-directed for complex diagrams (automatic, beautiful)

**Key principle:** Start simple, add complexity only when needed!
