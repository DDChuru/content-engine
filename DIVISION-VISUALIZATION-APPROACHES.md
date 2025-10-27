# Division Visualization Approaches

**Problem:** How to visually show "14 ÷ 3" in a way that's educational and clear?

---

## Current Issue

**Network graph approach (what we just tried):**
- 19 nodes total: 14 items + 4 groups + 1 remainder
- Spatial validator auto-reduced to 10 nodes (max for 'full' mode)
- Lost the actual visual representation of division

**Why it doesn't work:**
- Force-directed layout scatters nodes randomly
- Can't control positioning to show grouping visually
- Too many nodes for current constraints

---

## Better Approaches

### Approach 1: Grid Layout (Recommended for Division)

**Visualization type:** Custom grid (not network graph)

**Layout:**
```
14 ÷ 3 = ?

┌─────────────────────────────────────┐
│ Group 1:  ○ ○ ○                    │
│ Group 2:  ○ ○ ○                    │
│ Group 3:  ○ ○ ○                    │
│ Group 4:  ○ ○ ○                    │
│ Leftover: ○ ○                      │
└─────────────────────────────────────┘

Answer: 4 groups of 3 (with 2 left over)
```

**Advantages:**
- Clear visual grouping
- Shows division concept immediately
- Easy to count
- Fits spatial constraints (5 rows × 3-14 circles each)

**Implementation:**
- NOT a network graph
- Use SVG rectangles for group boxes
- Use SVG circles for items
- Controlled positioning (no force-directed)

---

### Approach 2: Step-by-Step Animation (Best for Learning)

**Three steps:**

**Step 1: Show the problem**
```
14 ÷ 3 = ?

○ ○ ○ ○ ○ ○ ○
○ ○ ○ ○ ○ ○ ○
```

**Step 2: Show the grouping**
```
Group them by 3:

┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ ○ ○ ○ │ │ ○ ○ ○ │ │ ○ ○ ○ │ │ ○ ○ ○ │
└───────┘ └───────┘ └───────┘ └───────┘

Leftover: ○ ○
```

**Step 3: Show the answer**
```
14 ÷ 3 = 4 R2

4 groups + 2 remaining = 14 ✓
```

**Advantages:**
- Tells a story (sequential learning)
- Uses stepByStep layout mode
- Each step fits in spatial constraints
- Students see the "why" behind division

**Implementation:**
- 3 separate visualizations (one per step)
- Render as video sequence
- Use Manim for animation between steps

---

### Approach 3: Hybrid D3 + Manim (Maximum Engagement)

**Combine both:**

**D3 part (left 50%):**
- Show static grid of 14 items
- Controlled positioning
- No force-directed layout

**Manim part (right 50%):**
- Animate the grouping process
- Draw boxes around groups
- Show calculation: 3 × 4 = 12, 14 - 12 = 2

**Advantages:**
- Best of both worlds
- D3 for static layout, Manim for math
- Engaging animation
- Clear educational flow

**Implementation:**
- Use 'split' layout mode
- D3 renders left side (static)
- Manim renders right side (animated)
- Unified rendering via our existing system

---

## Recommended Solution

**For "14 ÷ 3" specifically: Use Approach 2 (Step-by-Step)**

**Why:**
1. Educational - shows the process, not just the answer
2. Fits spatial constraints - each step is simple
3. Works with existing validator
4. Clear storytelling

**Implementation plan:**

```typescript
// Step 1 data (max 5 nodes)
const step1 = {
  type: 'network',
  nodes: [
    { id: 'title', label: '14 ÷ 3 = ?', size: 50 },
    { id: 'all14', label: '14 items', size: 40 },
    { id: 'divide', label: 'Divide by 3', size: 35 }
  ],
  links: [
    { source: 'title', target: 'all14' },
    { source: 'all14', target: 'divide' }
  ]
};

// Step 2 data (max 5 nodes)
const step2 = {
  type: 'network',
  nodes: [
    { id: 'group1', label: 'Group 1 (3)', size: 40 },
    { id: 'group2', label: 'Group 2 (3)', size: 40 },
    { id: 'group3', label: 'Group 3 (3)', size: 40 },
    { id: 'group4', label: 'Group 4 (3)', size: 40 },
    { id: 'leftover', label: 'Leftover: 2', size: 35 }
  ],
  links: []  // No links, just show groups
};

// Step 3 data (max 5 nodes)
const step3 = {
  type: 'network',
  nodes: [
    { id: 'answer', label: '14 ÷ 3 = 4 R2', size: 50 },
    { id: 'verify', label: '4×3 + 2 = 14 ✓', size: 40 }
  ],
  links: [
    { source: 'answer', target: 'verify' }
  ]
};

// Render each step separately
const video1 = await renderStep(step1, 'stepByStep');
const video2 = await renderStep(step2, 'stepByStep');
const video3 = await renderStep(step3, 'stepByStep');

// Concatenate videos
await concatVideos([video1, video2, video3], 'output/division-14-3-complete.mp4');
```

---

## What We Learned

**Key insight:** Not everything should be a network graph!

**When to use network graphs:**
- Showing relationships (A connects to B)
- Concept maps (AI → ML → DL)
- Hierarchies (parent-child)

**When NOT to use network graphs:**
- Division (need grid layout)
- Step-by-step processes (need controlled positioning)
- Comparisons (need side-by-side)

**Solution:**
- Build additional visualization types in D3VizEngine
- Grid layout for division/multiplication
- Timeline layout for sequential processes
- Bar chart layout for comparisons

---

## Next Steps

1. **Short term:** Use step-by-step approach (3 simple network graphs)
2. **Medium term:** Add grid layout to D3VizEngine for proper division viz
3. **Long term:** Build library of viz types (grid, timeline, bar, pie, etc.)

---

**Conclusion:** The spatial guardrails system WORKS (validator caught the issue, auto-fixed), but we need better visualization types for different educational concepts. Network graphs are great for relationships, but division needs grid layout.
