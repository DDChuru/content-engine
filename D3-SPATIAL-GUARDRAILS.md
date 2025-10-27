# D3 Spatial Guardrails: Screen Real Estate Planning

**Critical Issue:** D3 visualizations must intelligently use screen space to avoid collisions, ensure readability, and tell a clear visual story.

**Your Key Points:**
1. Screen size is relative (need % of available space)
2. Need X,Y coordinate system understanding
3. Collision avoidance is critical
4. D3 is about storytelling (e.g., "14 ÷ 3" in 2-3 visual steps)
5. If rendering 3 steps, how much space per step?
6. How much screen for D3 vs Manim?
7. Manim is the "wow factor" - what do we show there?

---

## The Screen Canvas

### **Standard Educational Video Format**

```
1920x1080 (16:9 aspect ratio)
├─ Safe zone: 1820x980 (50px margin all sides)
└─ Title zone: 1820x150 (top 150px)
```

**Why this matters:**
- YouTube crops on mobile
- TV overscan
- Text readability on small screens

### **Coordinate System**

```
(0, 0) ────────────────────────────────────> X (1920)
  │
  │    [50px margin]
  │    ┌──────────────────────────────────┐
  │    │ TITLE ZONE (150px height)        │
  │    │ • Lesson title                   │
  │    │ • Topic indicator                │
  │    ├──────────────────────────────────┤
  │    │                                  │
  │    │ CONTENT ZONE (830px height)      │
  │    │                                  │
  │    │ This is where D3/Manim lives     │
  │    │                                  │
  │    │ Subdivided based on layout:      │
  │    │ • Full width (story mode)        │
  │    │ • Split (D3 | Manim)            │
  │    │ • Steps (vertical/horizontal)    │
  │    │                                  │
  │    ├──────────────────────────────────┤
  │    │ FOOTER ZONE (50px height)        │
  │    │ • Progress indicator             │
  │    │ • Branding                       │
  │    └──────────────────────────────────┘
  │    [50px margin]
  ↓
  Y (1080)
```

---

## Layout Modes for D3

### **Mode 1: Full Canvas (Storytelling)**

**Use case:** Single concept that needs full attention

```
┌────────────────────────────────────────────┐
│ Title: "Understanding Division"            │
├────────────────────────────────────────────┤
│                                            │
│           [D3 Visualization]               │
│                                            │
│     Full 1820x830 available                │
│                                            │
│     Example: 14 ÷ 3 visual story           │
│                                            │
└────────────────────────────────────────────┘
```

**Spatial allocation:**
- Width: 1820px (100% of safe zone)
- Height: 830px (100% of content zone)
- Elements: Can be large, detailed

---

### **Mode 2: Side-by-Side (D3 + Manim)**

**Use case:** Data visualization + mathematical explanation

```
┌────────────────────────────────────────────┐
│ Title: "Linear Equations Explained"        │
├──────────────────────┬─────────────────────┤
│                      │                     │
│   D3 Visualization   │  Manim Animation    │
│                      │                     │
│   910x830 px         │  910x830 px         │
│                      │                     │
│   (50% width)        │  (50% width)        │
│                      │                     │
└──────────────────────┴─────────────────────┘
```

**Spatial allocation:**
- D3 width: 910px (50% of safe zone)
- D3 height: 830px (100% of content zone)
- Manim width: 910px (50% of safe zone)
- Manim height: 830px (100% of content zone)
- Gap between: 0px (flush split)

**D3 considerations:**
- Smaller canvas = simpler visualizations
- Max 3-4 nodes in network graphs
- Shorter labels
- Larger fonts to compensate

---

### **Mode 3: Step-by-Step (Vertical Stack)**

**Use case:** Showing progression (e.g., "14 ÷ 3" in steps)

```
┌────────────────────────────────────────────┐
│ Title: "Division Step by Step"             │
├────────────────────────────────────────────┤
│ Step 1: Set up the problem                 │
│ [D3 visualization: 14 objects]              │
│ Height: 276px (1/3 of content)              │
├────────────────────────────────────────────┤
│ Step 2: Group into 3s                       │
│ [D3 visualization: Objects grouped]         │
│ Height: 276px (1/3 of content)              │
├────────────────────────────────────────────┤
│ Step 3: Count the groups + remainder       │
│ [D3 visualization: 4 groups + 2 leftover]  │
│ Height: 276px (1/3 of content)              │
└────────────────────────────────────────────┘
```

**Spatial allocation (for N steps):**
- Width: 1820px (100% of safe zone)
- Height per step: 830px / N
- Gap between steps: 10px

**Example (3 steps):**
- Each step: 1820px × 270px (accounting for 2 × 10px gaps)
- Total: 3 × 270px + 2 × 10px = 830px ✓

---

### **Mode 4: Grid Layout (Comparison)**

**Use case:** Comparing multiple concepts

```
┌────────────────────────────────────────────┐
│ Title: "Fractions Comparison"              │
├─────────────────────┬──────────────────────┤
│                     │                      │
│  1/2                │  1/4                 │
│  [D3 viz]           │  [D3 viz]            │
│  910x405            │  910x405             │
├─────────────────────┼──────────────────────┤
│                     │                      │
│  1/3                │  1/6                 │
│  [D3 viz]           │  [D3 viz]            │
│  910x405            │  910x405             │
└─────────────────────┴──────────────────────┘
```

**Spatial allocation (2×2 grid):**
- Width per cell: 910px (50% of safe zone)
- Height per cell: 405px (50% of content zone - 10px gap)
- Gaps: 10px horizontal, 10px vertical

---

## Collision Avoidance Strategies

### **Problem: Elements Overlap**

**Scenario:**
```
Network graph with 5 nodes
- Node labels: "Context Window", "Tokens", "Words", "Memory", "Processing"
- If nodes too close → labels collide
- If labels too long → overflow beyond canvas
```

### **Solution 1: Force-Directed Layout with Constraints**

```typescript
// D3 force simulation with collision detection
const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-200))  // Repel nodes
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(d => d.size + 20))  // Prevent overlap
  .force('bounds', forceBounds(margin, width - margin, margin, height - margin));  // Keep in bounds

// Custom force to constrain within bounds
function forceBounds(x0, x1, y0, y1) {
  return function(alpha) {
    nodes.forEach(node => {
      node.x = Math.max(x0, Math.min(x1, node.x));
      node.y = Math.max(y0, Math.min(y1, node.y));
    });
  };
}
```

### **Solution 2: Smart Label Positioning**

```typescript
// Place labels intelligently to avoid overlap
function positionLabel(node, nodes) {
  const basePositions = [
    { x: 0, y: -node.size - 5 },    // Top
    { x: 0, y: node.size + 15 },    // Bottom
    { x: node.size + 5, y: 5 },     // Right
    { x: -node.size - 50, y: 5 }    // Left
  ];

  // Try each position, pick first without collision
  for (const pos of basePositions) {
    const labelBounds = {
      x: node.x + pos.x,
      y: node.y + pos.y,
      width: node.label.length * 8,  // Approximate
      height: 20
    };

    if (!collidesWithAny(labelBounds, nodes)) {
      return pos;
    }
  }

  // Fallback: top position
  return basePositions[0];
}

function collidesWithAny(rect, nodes) {
  return nodes.some(n => {
    return !(rect.x + rect.width < n.x - n.size ||
             rect.x > n.x + n.size ||
             rect.y + rect.height < n.y - n.size ||
             rect.y > n.y + n.size);
  });
}
```

### **Solution 3: Text Truncation with Ellipsis**

```typescript
// Limit label length to prevent overflow
function truncateLabel(label: string, maxWidth: number): string {
  const avgCharWidth = 8;  // Approximate for Arial
  const maxChars = Math.floor(maxWidth / avgCharWidth);

  if (label.length <= maxChars) {
    return label;
  }

  return label.substring(0, maxChars - 3) + '...';
}

// Usage
node.label = truncateLabel(node.label, 100);  // Max 100px width
```

---

## Spatial Planning for Storytelling

### **Example: "14 ÷ 3" Visual Story**

**Story breakdown:**
1. Show 14 objects (setup)
2. Group into sets of 3 (process)
3. Show result: 4 groups + 2 remainder (answer)

**Spatial plan (3 steps, vertical stack):**

```typescript
const CANVAS = {
  width: 1820,
  height: 830,
  margin: 50
};

const STEPS = 3;
const STEP_HEIGHT = (CANVAS.height - (STEPS - 1) * 10) / STEPS;  // 270px
const STEP_WIDTH = CANVAS.width;

// Step 1: 14 individual objects
const step1 = {
  x: CANVAS.margin,
  y: CANVAS.margin,
  width: STEP_WIDTH,
  height: STEP_HEIGHT,

  // Place 14 circles in 2 rows
  objects: arrangeInGrid(14, { rows: 2, cols: 7, spacing: 60 })
};

// Step 2: Same objects, now grouped
const step2 = {
  x: CANVAS.margin,
  y: CANVAS.margin + STEP_HEIGHT + 10,
  width: STEP_WIDTH,
  height: STEP_HEIGHT,

  // 3 groups of 3, spaced apart
  groups: [
    { objects: [0, 1, 2], x: 200, y: step2.y + STEP_HEIGHT / 2 },
    { objects: [3, 4, 5], x: 500, y: step2.y + STEP_HEIGHT / 2 },
    { objects: [6, 7, 8], x: 800, y: step2.y + STEP_HEIGHT / 2 },
    { objects: [9, 10, 11], x: 1100, y: step2.y + STEP_HEIGHT / 2 }
  ],
  remainder: [12, 13]  // 2 left over
};

// Step 3: Show answer
const step3 = {
  x: CANVAS.margin,
  y: CANVAS.margin + (STEP_HEIGHT + 10) * 2,
  width: STEP_WIDTH,
  height: STEP_HEIGHT,

  // Big text: "4 groups of 3, remainder 2"
  result: {
    text: "14 ÷ 3 = 4 remainder 2",
    fontSize: 48,
    position: { x: STEP_WIDTH / 2, y: STEP_HEIGHT / 2 }
  }
};

function arrangeInGrid(count, { rows, cols, spacing }) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    positions.push({
      x: col * spacing + 100,
      y: row * spacing + 50
    });
  }
  return positions;
}
```

**Result:**
- Each step has clear boundaries
- No overlapping elements
- Story flows top to bottom
- Consistent spacing

---

## Screen Allocation: D3 vs Manim

### **Decision Framework**

**Question:** How much screen for D3 vs Manim?

**Answer depends on content type:**

**1. Data-heavy concept:**
```
D3: 70% (1274px width)
Manim: 30% (546px width)

Example: Network graphs, comparisons
Reason: Data needs space, math is supplementary
```

**2. Math-heavy concept:**
```
D3: 30% (546px width)
Manim: 70% (1274px width)

Example: Equation derivations, calculus
Reason: Math is primary, data provides context
```

**3. Balanced:**
```
D3: 50% (910px width)
Manim: 50% (910px width)

Example: Linear equations with data
Reason: Both equally important
```

**4. Manim only (wow factor):**
```
D3: 0%
Manim: 100% (1820px width)

Example: 3D animations, complex transformations
Reason: Manim IS the story
```

### **Agent Prompt Strategy**

```typescript
// Agent receives layout constraints in prompt
const prompt = `Generate D3 visualization for: ${topic}

SPATIAL CONSTRAINTS:
- Available width: ${layoutMode === 'full' ? '1820px' : '910px'}
- Available height: 830px
- Maximum nodes: ${layoutMode === 'full' ? '8' : '4'}
- Label max length: ${layoutMode === 'full' ? '20 chars' : '15 chars'}
- Layout mode: ${layoutMode}

COLLISION AVOIDANCE:
- Use force-directed layout with collision detection
- Ensure minimum 20px spacing between nodes
- Truncate labels if they exceed max length
- Position labels to avoid overlap (try top/bottom/left/right)

STORYTELLING:
${storytellingInstructions}

Generate visualization data that fits within these constraints.`;
```

---

## D3 Guardrails (Comprehensive)

### **1. Canvas Boundaries**

```typescript
const CANVAS_GUARDRAILS = {
  // Absolute limits
  max: {
    width: 1820,
    height: 830
  },

  // Minimum safe zones
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },

  // Content area (after margins)
  content: {
    width: 1720,  // 1820 - 100
    height: 730   // 830 - 100
  }
};
```

### **2. Element Sizing**

```typescript
const ELEMENT_GUARDRAILS = {
  // Node sizes (circles, boxes)
  node: {
    min: 20,   // Minimum radius/size
    max: 60,   // Maximum radius/size
    default: 30
  },

  // Text sizes
  text: {
    title: 48,
    subtitle: 36,
    body: 32,
    label: 24,
    caption: 18
  },

  // Spacing
  spacing: {
    nodePadding: 20,      // Space around nodes
    labelPadding: 5,      // Space between node and label
    groupPadding: 50,     // Space between groups
    stepGap: 10          // Gap between steps (vertical stack)
  }
};
```

### **3. Collision Detection**

```typescript
function validateNoCollisions(elements: Element[]): ValidationResult {
  const collisions: string[] = [];

  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      if (elementsOverlap(elements[i], elements[j])) {
        collisions.push(`Element ${i} overlaps with element ${j}`);
      }
    }
  }

  return {
    valid: collisions.length === 0,
    errors: collisions
  };
}

function elementsOverlap(a: Element, b: Element): boolean {
  const aBounds = getElementBounds(a);
  const bBounds = getElementBounds(b);

  return !(aBounds.right < bBounds.left ||
           aBounds.left > bBounds.right ||
           aBounds.bottom < bBounds.top ||
           aBounds.top > bBounds.bottom);
}
```

### **4. Layout Constraints**

```typescript
const LAYOUT_CONSTRAINTS = {
  // Maximum elements per layout mode
  maxElements: {
    full: 10,        // Full canvas can handle more
    split: 5,        // Split canvas (D3 + Manim) = less space
    stepByStep: 3,   // Each step should be simple
    grid: 4          // 2×2 grid max
  },

  // Maximum text length
  maxLabelLength: {
    full: 25,
    split: 15,
    stepByStep: 20,
    grid: 12
  },

  // Minimum spacing between elements
  minSpacing: {
    nodes: 20,
    groups: 50,
    steps: 10
  }
};
```

---

## Agent Prompt Engineering for D3

### **Current Problem**

Agent generates D3 data without spatial awareness:
```typescript
// Agent might generate this:
{
  type: 'network',
  nodes: [
    { id: '1', label: 'This is a very long label that will overflow' },
    { id: '2', label: 'Another long label' },
    // ... 20 more nodes (too many!)
  ]
}
```

**Result:** Collisions, unreadable labels, messy visualization.

### **Improved Prompt Strategy**

```typescript
function generateD3Prompt(topic: string, layoutMode: LayoutMode): string {
  const constraints = LAYOUT_CONSTRAINTS;
  const maxElements = constraints.maxElements[layoutMode];
  const maxLabelLength = constraints.maxLabelLength[layoutMode];

  return `You are a D3 visualization expert. Generate a visualization for: "${topic}"

CRITICAL SPATIAL CONSTRAINTS (MUST FOLLOW):

1. CANVAS SIZE:
   - ${layoutMode === 'full' ? 'Full canvas: 1820×830px' : 'Split canvas: 910×830px'}
   - Safe margins: 50px on all sides
   - Usable area: ${layoutMode === 'full' ? '1720×730px' : '810×730px'}

2. ELEMENT LIMITS:
   - Maximum nodes/elements: ${maxElements}
   - Maximum label length: ${maxLabelLength} characters
   - If more concepts needed, group them hierarchically

3. SPACING REQUIREMENTS:
   - Minimum 20px between any two nodes
   - Minimum 5px between node and its label
   - Labels must not overlap with other nodes or labels

4. STORYTELLING:
   ${getStorytellingGuidance(topic)}

5. OUTPUT FORMAT:
   Return ONLY valid JSON matching this schema:
   {
     "type": "network" | "comparison" | "timeline",
     "nodes": [
       {
         "id": "unique-id",
         "label": "Short label (max ${maxLabelLength} chars)",
         "size": 20-60  // Relative importance
       }
     ],
     "links": [
       { "source": "node-id", "target": "node-id" }
     ]
   }

VALIDATION CHECKLIST:
- [ ] Node count ≤ ${maxElements}
- [ ] All labels ≤ ${maxLabelLength} chars
- [ ] No hardcoded positions (let force simulation handle it)
- [ ] Clear visual hierarchy (vary node sizes)

Generate the visualization data now.`;
}

function getStorytellingGuidance(topic: string): string {
  // Customize based on topic
  if (topic.includes('division') || topic.includes('÷')) {
    return `
- Show the problem setup first (all elements)
- Then show the grouping process
- Finally show the result
- Use 2-3 visual steps maximum`;
  }

  if (topic.includes('network') || topic.includes('relationship')) {
    return `
- Place most important concept at center
- Group related concepts near each other
- Use node size to indicate importance
- Keep hierarchy clear (parent → child)`;
  }

  return `
- Tell a clear visual story
- Use spatial positioning to show relationships
- Maintain visual balance
- Guide the viewer's eye flow`;
}
```

---

## Validation Before Render

```typescript
export class D3SpatialValidator {
  /**
   * Validate D3 data against spatial constraints
   */
  static validate(
    vizData: VizData,
    layoutMode: LayoutMode
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const constraints = LAYOUT_CONSTRAINTS;

    // 1. Check element count
    const nodeCount = vizData.nodes?.length || 0;
    const maxNodes = constraints.maxElements[layoutMode];

    if (nodeCount > maxNodes) {
      errors.push(
        `Too many nodes: ${nodeCount} (max for ${layoutMode}: ${maxNodes})`
      );
    }

    // 2. Check label lengths
    const maxLabelLen = constraints.maxLabelLength[layoutMode];

    vizData.nodes?.forEach((node, i) => {
      if (node.label && node.label.length > maxLabelLen) {
        warnings.push(
          `Node ${i} label too long: "${node.label}" (${node.label.length} chars, max ${maxLabelLen})`
        );
      }
    });

    // 3. Check node sizes
    vizData.nodes?.forEach((node, i) => {
      if (node.size && (node.size < 20 || node.size > 60)) {
        warnings.push(
          `Node ${i} size ${node.size} outside range (20-60)`
        );
      }
    });

    // 4. Simulate layout to check for collisions
    const simulatedPositions = simulateLayout(vizData, layoutMode);
    const collisionCheck = this.checkCollisions(simulatedPositions);

    if (!collisionCheck.valid) {
      warnings.push(...collisionCheck.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Simulate force-directed layout to predict collisions
   */
  private static checkCollisions(
    positions: SimulatedPosition[]
  ): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = Math.sqrt(
          Math.pow(positions[i].x - positions[j].x, 2) +
          Math.pow(positions[i].y - positions[j].y, 2)
        );

        const minDistance = positions[i].size + positions[j].size + 20;

        if (distance < minDistance) {
          warnings.push(
            `Predicted collision between node ${i} and ${j} (distance: ${distance.toFixed(0)}px, min: ${minDistance}px)`
          );
        }
      }
    }

    return {
      valid: warnings.length === 0,
      warnings
    };
  }

  /**
   * Auto-fix common spatial issues
   */
  static autoFix(
    vizData: VizData,
    layoutMode: LayoutMode
  ): VizData {
    const fixed = { ...vizData };
    const constraints = LAYOUT_CONSTRAINTS;

    // 1. Limit node count
    if (fixed.nodes && fixed.nodes.length > constraints.maxElements[layoutMode]) {
      console.warn(
        `Reducing nodes from ${fixed.nodes.length} to ${constraints.maxElements[layoutMode]}`
      );
      fixed.nodes = fixed.nodes.slice(0, constraints.maxElements[layoutMode]);
    }

    // 2. Truncate labels
    const maxLabelLen = constraints.maxLabelLength[layoutMode];
    if (fixed.nodes) {
      fixed.nodes = fixed.nodes.map(node => ({
        ...node,
        label: node.label?.substring(0, maxLabelLen)
      }));
    }

    // 3. Clamp node sizes
    if (fixed.nodes) {
      fixed.nodes = fixed.nodes.map(node => ({
        ...node,
        size: node.size ? Math.max(20, Math.min(60, node.size)) : 30
      }));
    }

    return fixed;
  }
}
```

---

## Summary: Complete Spatial System

```
┌─────────────────────────────────────────────────────┐
│ 1. AGENT PROMPT                                     │
│    • Spatial constraints in prompt                  │
│    • Layout mode specific                           │
│    • Storytelling guidance                          │
└─────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 2. AGENT GENERATES DATA                             │
│    • Claude creates D3 VizData                      │
│    • Constrained by prompt                          │
│    • JSON output                                    │
└─────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 3. SPATIAL VALIDATION                               │
│    • Check element count                            │
│    • Check label lengths                            │
│    • Simulate layout, predict collisions            │
│    • Errors → reject, Warnings → log                │
└─────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 4. AUTO-FIX                                         │
│    • Truncate labels                                │
│    • Remove excess nodes                            │
│    • Clamp sizes                                    │
└─────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│ 5. RENDER WITH GUARDRAILS                           │
│    • Force-directed layout with collision detection │
│    • Bounded by canvas margins                      │
│    • Smart label positioning                        │
└─────────────────────────────────────────────────────┘
                     ↓
              ✅ PERFECT OUTPUT
```

---

## Next Steps

1. **Build spatial validation system** (D3SpatialValidator)
2. **Update agent prompts** with spatial constraints
3. **Test with "14 ÷ 3" example** (3-step visualization)
4. **Measure collision rate** (should be 0%)
5. **Iterate on layout algorithms** based on real content

**Question:** Should we code the spatial validator now, or refine the strategy more?
