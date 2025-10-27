# 🎬 EPISODE 1: FULL PRODUCTION PLAN
## "My AI Agent Failed at Sets... So I Taught It to Fix Itself"

---

## 🎯 THE COMPELLING STORY (Revised for Maximum Impact)

### **The Hook:**
Show an AI agent that's smart enough to do PhD-level math but fails at making a simple visualization for a 13-year-old. Then we TEACH it to fix itself.

---

## 📋 SCENE-BY-SCENE BREAKDOWN

### **SCENE 1: What is an AI Agent? (0:00-0:30)**
**Visual Needed:** Animated explanation of AI agents
- **Recording Method:** OBS screen capture
- **What to create:**
  - Diagram showing: LLM + Tools + Memory = Agent
  - Visual: Brain icon + Toolbox icon + Filing cabinet icon
  - Text overlay: "An AI agent = LLM with specialized tools and memory"
- **Narration:** "So what's an AI agent? It's an LLM with specialized tools and its own memory..."
- **Status:** ⬜ **NEED TO CREATE**

---

### **SCENE 2: Share the Problem (0:30-1:00)**
**Visual Needed:** Show the challenge
- **Recording Method:** Screen capture of problem statement
- **What to show:**
  - Text: "Challenge: Create educational visualizations for 13-year-olds"
  - Example problem: "Find A ∩ B where A={1,2,3,4,5} and B={4,5,6,7,8}"
  - Show target audience: Middle school students learning set theory
- **Narration:** "I need to create visualizations to teach set theory to 13-year-olds. Simple, right?"
- **Status:** ⬜ **NEED TO CREATE**

---

### **SCENE 3: Show Our Agent Setup - BEFORE Training (1:00-1:45)**
**Visual Needed:** Training Lab UI showing agent configuration
- **Recording Method:** OBS capture of Training Lab UI
- **What to show in UI:**
  ```
  AGENT TRAINING LAB

  Agent: Sets Tutor
  LLM: Claude Sonnet 4.5 ✓
  Knowledge: Set theory (PhD level) ✓

  Tools Available:
  ✓ Manim (Python animation library)
  ✓ Collision detection
  ✓ Text positioning

  Memory/Context:
  ❌ No spatial rules yet
  ❌ No pedagogy rules yet
  ❌ No successful patterns yet

  Status: Ready for first attempt
  ```
- **Narration:** "Here's my Sets Agent. It has access to Claude - which KNOWS set theory at a PhD level. It has Manim for creating animations. But look at the memory - completely empty. No rules about HOW to use these tools..."
- **Status:** ⬜ **NEED TO BUILD Training Lab UI**

---

### **SCENE 4: First Attempt - The Failure (1:45-2:15)**
**Visual Needed:** UI showing generation + failed result
- **Recording Method:** OBS capture of Training Lab UI + result
- **What to show:**
  1. Click "Generate" button in UI
  2. Show loading spinner
  3. Show result: BEFORE-LEARNING-COLLISION.mp4 (our collision video)
  4. UI displays validation results:
     ```
     ❌ Validation Failed

     Issues Detected:
     • Collision: Arrow overlaps with numbers 4 and 5
     • Collision: Label "Intersection" overlaps with circles
     • Layout: Answer text too close to diagram

     Clarity Score: 4/10
     Usability for 13-year-olds: FAIL
     ```
- **Narration:** "Let's try... [pause for generation] ...and it failed. Look at this - the arrow crashes right through the numbers. The label overlaps everything. This is unusable for a student."
- **Status:** ⬜ **NEED TO BUILD** - Validation display in UI

---

### **SCENE 5: The Diagnosis - LLM is Smart, Context is Missing (2:15-2:45)**
**Visual Needed:** Split screen analysis
- **Recording Method:** Screen capture with graphics overlay
- **Left side:** Show LLM capability
  ```
  LLM Knowledge Test:

  Q: "What is A ∩ B?"
  A: "The intersection contains elements in BOTH sets..."

  Q: "Solve this set problem..."
  A: [PhD-level mathematical proof]

  ✓ Set Theory Knowledge: 100%
  ✓ Mathematical Reasoning: Expert level
  ```
- **Right side:** Show tool usage failure
  ```
  Tool Usage Analysis:

  Manim Knowledge: 40%
  ❌ No context on spatial constraints
  ❌ No context on collision avoidance
  ❌ No context on educational clarity

  Issues Identified:
  1. Arrow positioning → Collision detection
  2. Label placement → Use highlights instead
  3. Spacing → Absolute positioning needed
  ```
- **Narration:** "Here's the thing - the LLM KNOWS set theory perfectly. It could solve PhD-level problems. But it has ZERO context on how to use Manim for education. It's at 40% tool knowledge. Look at these issues..."
- **Status:** ⬜ **NEED TO CREATE** - Analysis graphics

---

### **SCENE 6: Teaching the Agent (2:45-3:30)**
**Visual Needed:** Training Lab UI - Adding rules
- **Recording Method:** OBS capture OR voice instruction demo
- **Option A - Manual UI (easier to show):**
  ```
  AGENT TRAINING LAB - Teaching Mode

  Add Rule Type: [Spatial ▼]

  Rule: "Never use arrows pointing to intersection - causes collisions"

  [Add Rule] button

  Memory Updated:
  Version: 1 → 2
  ✓ Spatial rule added

  ---

  Add Rule Type: [Pedagogy ▼]

  Rule: "Explain elements one-by-one conversationally"

  [Add Rule] button

  Memory Updated:
  Version: 2 → 3
  ✓ Pedagogy rule added

  Agent Context Loading... [progress bar showing JSON being loaded]
  ```

- **Option B - Voice instruction (more impressive):**
  - Show UI with microphone icon
  - Speak: "Don't use arrows to the intersection - they cause collisions"
  - UI shows: Converting speech → Extracting rule → Adding to memory
  - Show JSON context being loaded into agent

- **Narration:** "So I'm going to TEACH it. First rule: Don't use arrows to the intersection. Watch the memory update - version 2. Now add a pedagogy rule: Explain things one by one. Version 3. The agent is loading this context..."
- **Status:** ⬜ **NEED TO BUILD** - Training UI with rule addition

---

### **SCENE 7: Perfect Rendering (3:30-4:00)**
**Visual Needed:** Second generation attempt - SUCCESS
- **Recording Method:** OBS capture of UI + result
- **What to show:**
  1. Click "Generate" again
  2. Show loading with "Applying learned rules..."
  3. Show result: sets-EDUCATIONAL-FINAL.mp4 (our clean video)
  4. UI displays validation:
     ```
     ✅ Validation Passed

     Results:
     ✓ No collisions detected
     ✓ Clear spatial layout
     ✓ Conversational explanation
     ✓ Safe answer positioning

     Clarity Score: 9/10
     Usability for 13-year-olds: EXCELLENT

     Memory Updated:
     Version: 3 → 4
     ✓ Successful pattern recorded
     ```
- **Narration:** "Let's try again... [pause] ...PERFECT! Nine out of ten. No collisions. Clear layout. Conversational explanation. And look - the agent REMEMBERED this success. Version 4."
- **Status:** ⬜ **NEED TO BUILD** - Success validation display

---

### **SCENE 8: Testing with New Problem (4:00-4:30)**
**Visual Needed:** New problem, first-try success
- **Recording Method:** OBS capture of UI
- **What to show:**
  ```
  New Problem: "Find A ∪ B where A={1,2,3} and B={3,4,5}"

  [Generate] button

  Applying Memory:
  ✓ Loading spatial rules (2)
  ✓ Loading pedagogy rules (2)
  ✓ Loading successful patterns (1)

  Result: ✅ PERFECT (first try!)

  Clarity Score: 9/10
  No collisions

  Memory Updated:
  Version: 4 → 5
  ✓ Union pattern added to memory
  ```
- **Narration:** "Now the real test - a NEW problem it's never seen. Union instead of intersection... [pause] ...PERFECT on the first try! The agent LEARNED. It remembered the rules and applied them to a completely new problem."
- **Status:** ⬜ **NEED TO BUILD** - Multi-problem support in UI

---

### **SCENE 9: The Revelation - Memory Efficiency (4:30-5:00)**
**Visual Needed:** Memory comparison graphic
- **Recording Method:** Screen capture with animated comparison
- **What to show:**
  ```
  MEMORY COMPARISON

  Traditional Approach:
  ├─ Every request: Load ALL examples
  ├─ Context size: 200KB
  ├─ Cost per session: $2.40
  └─ Learning: ❌ Forgets everything

  Our Agent Approach:
  ├─ Load only: Learned rules
  ├─ Context size: 8KB
  ├─ Cost per session: $0.10
  └─ Learning: ✓ Remembers & improves

  SAVINGS: 96% reduction in cost
  BONUS: Gets BETTER over time
  ```
- **Narration:** "Here's the crazy part. Traditional AI? 200KB of context every time. My agent? 8KB. That's 96% less. And unlike traditional AI that forgets everything - my agent LEARNS and gets BETTER."
- **Status:** ⬜ **NEED TO CREATE** - Comparison graphic

---

## 🛠️ TECHNICAL REQUIREMENTS

### **1. Training Lab UI (Priority 1 - Build First)**
Location: `packages/frontend/src/components/training-lab.tsx`

**Features Needed:**
- [ ] Agent selection dropdown
- [ ] Problem input form
- [ ] Generate button with loading state
- [ ] Result display (video player + validation)
- [ ] Memory state visualization (JSON viewer)
- [ ] Rule addition interface
  - [ ] Rule type selector (Spatial/Pedagogy)
  - [ ] Text input for rule
  - [ ] Add button
  - [ ] Version increment display
- [ ] Multi-problem testing
- [ ] Voice input (optional - Phase 2)

**API Endpoints to Use:**
```typescript
// Already exist
POST /api/sets-agent/generate
POST /api/sets-agent/teach/spatial
POST /api/sets-agent/teach/pedagogy
GET  /api/sets-agent/memory
POST /api/sets-agent/reset

// May need to add
POST /api/sets-agent/validate  // Returns collision detection results
```

### **2. Visual Assets to Create**

**Scene 1:**
- [ ] AI Agent diagram (LLM + Tools + Memory)

**Scene 2:**
- [ ] Problem statement slide

**Scene 5:**
- [ ] LLM knowledge test graphic
- [ ] Tool usage analysis graphic

**Scene 9:**
- [ ] Memory comparison animated graphic

### **3. Existing Assets (Already Created)**
- ✅ brain-1-empty.mp4
- ✅ brain-2-spatial.mp4
- ✅ brain-3-pedagogy.mp4
- ✅ brain-4-success.mp4
- ✅ BEFORE-LEARNING-COLLISION.mp4
- ✅ sets-EDUCATIONAL-FINAL.mp4

---

## 📝 RECORDING CHECKLIST

### **Pre-Recording:**
- [ ] Build Training Lab UI
- [ ] Create visual assets (Scene 1, 2, 5, 9)
- [ ] Set up OBS with scenes
- [ ] Test backend API endpoints
- [ ] Rehearse narration

### **Recording Order:**
1. [ ] Scene 1: AI Agent explanation (create graphic first)
2. [ ] Scene 2: Problem statement (create slide first)
3. [ ] Scene 3: Training Lab - initial state (UI must be built)
4. [ ] Scene 4: First attempt failure (UI + collision video)
5. [ ] Scene 5: Diagnosis (create analysis graphics)
6. [ ] Scene 6: Teaching (UI with rule addition)
7. [ ] Scene 7: Success (UI + clean video)
8. [ ] Scene 8: New problem (UI multi-problem)
9. [ ] Scene 9: Memory comparison (create graphic)

### **Post-Recording:**
- [ ] Import all clips into Kdenlive
- [ ] Add transitions
- [ ] Add text overlays
- [ ] Color grade
- [ ] Add background music
- [ ] Export final video

---

## 🎯 NEXT STEPS (In Order)

### **IMMEDIATE:**
1. ✅ Save this document
2. ⬜ Build Training Lab UI frontend
   - Wire up to backend API
   - Add result validation display
   - Add memory visualization
   - Add rule teaching interface

### **THEN:**
3. ⬜ Create visual assets
   - AI Agent diagram
   - Problem slide
   - Analysis graphics
   - Comparison graphic

### **FINALLY:**
4. ⬜ Record and edit video

---

## 💡 WHY THIS VERSION IS MORE COMPELLING

**Old version:** "Agent failed, I taught it, it succeeded"
- Too simple
- Doesn't show WHY it failed
- Doesn't show the agent's actual intelligence

**New version:** "LLM is PhD-level smart but has 40% tool knowledge - so we TEACH it"
- Shows the nuance: Smart LLM + missing context
- Quantifies the problem (40% tool usage)
- Shows the specific issues (collisions, spacing)
- Demonstrates the LEARNING process visually
- Proves it works with a new problem
- Shows the business value (96% cost savings)

**This is a REAL story about AI agents, not just a demo.**

---

## 📊 ESTIMATED TIMELINE

- Training Lab UI: 2-4 hours
- Visual assets: 1-2 hours
- Recording: 1 hour
- Editing: 2-3 hours

**Total: ~8 hours for a professional YouTube video**

---

**SAVED: 2025-10-25**
**Ready to build Training Lab UI next!** 🚀
