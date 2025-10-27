# Visual Verification Checklist

**Purpose:** Manual inspection checklist for spatial guardrails validation

**Test Video:** `output/d3-viz/division-14-3-with-guardrails.mp4`

---

## How to Verify

1. **Open the test video:**
   ```bash
   vlc output/d3-viz/division-14-3-with-guardrails.mp4
   # or
   mpv output/d3-viz/division-14-3-with-guardrails.mp4
   ```

2. **Check each item below:**

---

## Checklist

### 1. Padding (Edge Safety)

**What to check:**
- [ ] Content does NOT touch the top edge (50px margin visible)
- [ ] Content does NOT touch the bottom edge (50px margin visible)
- [ ] Content does NOT touch the left edge (50px margin visible)
- [ ] Content does NOT touch the right edge (50px margin visible)

**How to verify:**
- Pause the video at any frame
- Look at all four edges
- You should see black space around ALL content

**Expected:**
```
┌─────────────────────────────────┐
│ BLACK MARGIN (50px)             │
│  ┌─────────────────────────┐    │
│  │ CONTENT STARTS HERE     │    │
│  │                         │    │
│  │                         │    │
│  └─────────────────────────┘    │
│ BLACK MARGIN (50px)             │
└─────────────────────────────────┘
```

---

### 2. No Collisions (Readability)

**What to check:**
- [ ] No overlapping circles/nodes
- [ ] No overlapping text labels
- [ ] Labels don't overlap with nodes
- [ ] All elements have clear spacing

**How to verify:**
- Pause when all nodes are visible
- Check if you can clearly read every label
- Check if every node is distinct (not touching another)

**Expected:**
```
   ○ Node 1        ○ Node 2
   (Label)         (Label)
                              ← Clear gap between
   ○ Node 3        ○ Node 4
   (Label)         (Label)
```

---

### 3. Text Readability (Fonts & Sizes)

**What to check:**
- [ ] All text is readable (not too small)
- [ ] Font looks professional (not pixelated)
- [ ] No text cut off mid-character
- [ ] Text color has good contrast against black background

**How to verify:**
- Can you read every label without squinting?
- Does the font look smooth and anti-aliased?
- Are all characters fully visible?

**Expected:**
- Labels like "14 ÷ 3 = ?" should be crisp and clear
- White text on black background (high contrast)

---

### 4. Visual Style (Blackboard Aesthetic)

**What to check:**
- [ ] Background is pure black (#000000)
- [ ] Primary color is white (chalk-like)
- [ ] Hand-drawn style visible (circles look sketchy, not perfect)
- [ ] Lines have slight wobble/roughness

**How to verify:**
- Do circles look hand-drawn or computer-perfect?
- Do lines have natural imperfections (like chalk on blackboard)?

**Expected:**
```
Hand-drawn:        ╱˜˜˜╲      NOT perfect:    ╱────╲
                   ⌒   ⌒                      │    │
                   ╲___╱                      ╲────╱
```

---

### 5. Story Flow (Sequential Logic)

**What to check:**
- [ ] Problem appears first ("14 ÷ 3 = ?")
- [ ] Work shown in middle ("4 groups of 3", "3 × 4 = 12")
- [ ] Answer appears last ("Answer: 4 R2")
- [ ] Verification at end ("12 + 2 = 14 ✓")
- [ ] Flow is visually clear (top-to-bottom or left-to-right)

**How to verify:**
- Watch the animation from start to finish
- Does the story make sense?
- Can you follow the logic without narration?

**Expected sequence:**
1. Show problem
2. Show how to solve it
3. Show answer
4. Verify answer is correct

---

### 6. Animation Quality

**What to check:**
- [ ] Smooth animation (no jerky movements)
- [ ] 30 fps (looks fluid)
- [ ] No flickering
- [ ] Elements fade in/draw smoothly

**How to verify:**
- Does the animation look professional?
- Are there any stutters or jumps?

**Expected:**
- Buttery smooth draw-in effect
- Natural, engaging pace

---

## Results

### Pass/Fail Criteria

**PASS if:**
- All 6 sections have ALL items checked ✅
- No critical issues (edge clipping, collisions, unreadable text)

**FAIL if:**
- Any content touches edges (safety issue for mobile/TV)
- Any overlapping elements (readability issue)
- Any text too small or cut off

---

## Example Issues to Watch For

### ❌ BAD: Edge Clipping
```
┌─────────────────┐
│14 ÷ 3 = ?       │  ← Text touching edge (BAD!)
│                 │
│                 │
└─────────────────┘
```

### ✅ GOOD: Proper Padding
```
┌─────────────────┐
│                 │
│   14 ÷ 3 = ?    │  ← Text has margin (GOOD!)
│                 │
└─────────────────┘
```

### ❌ BAD: Overlapping Nodes
```
   ○○  ← Two circles overlapping (BAD!)
   Label
```

### ✅ GOOD: Clear Spacing
```
   ○      ○  ← Clear gap (GOOD!)
   Label  Label
```

---

## Next Steps After Verification

### If ALL checks pass ✅

1. Mark todo as complete: "Test with '14 ÷ 3' visualization example"
2. Move to next step: "Update D3VizEngine to use spatial guardrails"
3. Document any observations in this file
4. Use this video as reference example for future work

### If ANY checks fail ❌

1. Document which specific checks failed
2. Identify root cause:
   - Configuration issue? (check `spatial-config.ts`)
   - Validation issue? (check `d3-spatial-validator.ts`)
   - Rendering issue? (check `d3-viz-engine.ts`)
3. Fix the issue
4. Re-run test: `npx tsx src/tests/render-division-with-guardrails.ts`
5. Re-verify

---

## Verification Notes

**Date:** 2025-10-25
**Video:** `output/d3-viz/division-14-3-with-guardrails.mp4`
**Duration:** 6.0s
**Size:** 76KB
**Frames:** 180 (30 fps)

**Manual verification results:**
- [ ] Padding check: _____
- [ ] Collision check: _____
- [ ] Readability check: _____
- [ ] Style check: _____
- [ ] Flow check: _____
- [ ] Animation check: _____

**Overall:** ⬜ PASS / ⬜ FAIL

**Comments:**
_[Add any observations here]_

---

**Generated:** 2025-10-25
**Status:** Ready for manual verification
