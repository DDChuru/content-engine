# Episode 1 Recording Script: "My AI Agent Failed at Sets... So I Taught It"

## 🎬 Pre-Recording Checklist

### Technical Setup
- [ ] Backend running: `npm run dev`
- [ ] Screen recorder ready (OBS)
- [ ] Terminal maximized, clean
- [ ] Browser ready for memory visualization
- [ ] Microphone tested
- [ ] Output directory created: `mkdir -p recording-output`

### Initialize System
```bash
# 1. Start backend
cd packages/backend
npm run dev

# 2. Initialize default agents
curl -X POST http://localhost:3001/api/agents/initialize-defaults

# 3. Reset Sets Agent to empty state
curl -X POST http://localhost:3001/api/sets-agent/reset
```

---

## 🎯 Recording Structure (5 minutes total)

### COLD OPEN (0:00 - 0:20)
**Visual:** Failed Venn diagram with collisions
**Narration:**

> "So I built an AI agent to teach set theory to 13-year-olds...
>
> [PAUSE - show collision video]
>
> And it immediately failed. Look at this mess - arrows colliding,
> text overlapping, totally unusable.
>
> But here's what happened when I taught it to fix itself..."

**Cut to intro graphic**

---

### INTRO (0:20 - 0:30)
**Visual:** Title card
**Text Overlay:**
```
Episode 1: My AI Agent Failed at Sets
So I Taught It to Fix Itself

[Agent Training Layer Series]
```

---

## ACT 1: THE FAILURE (0:30 - 1:30)

### Scene 1: Empty Brain (0:30 - 0:45)

**Visual:** Terminal + Memory panel side-by-side

**Terminal:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/reset
```

**Memory Panel Shows:**
```json
{
  "spatialRules": [],
  "pedagogyRules": [],
  "successfulPatterns": [],
  "version": 1
}
```

**Narration:**
> "First, let me show you what we're working with. This is the agent's memory -
> completely empty. No rules, no patterns, nothing.
>
> It's like a student who's never seen sets before. Let's see what happens..."

---

### Scene 2: First Attempt - FAILURE (0:45 - 1:30)

**Terminal:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "intersection",
    "setA": [1,2,3,4,5],
    "setB": [4,5,6,7,8],
    "question": "Find A ∩ B"
  }'
```

**Wait for response...**

**Response Shows:**
```json
{
  "success": false,
  "result": {
    "collisions": 1,
    "clarityScore": 5
  }
}
```

**Show the generated video - WITH COLLISION!**

**Narration:**
> "And... it failed. Look at this - the arrow pointing to 'intersection'
> is colliding with the numbers 4 and 5. The label is overlapping with
> the circles.
>
> This is unusable for a 13-year-old trying to learn sets.
>
> But here's the interesting part - the agent KNOWS it failed.
> Look at the memory..."

**Memory Panel Updates:**
```json
{
  "failures": [
    {
      "issue": "Spatial collision detected",
      "lesson": "Need to enforce stricter spatial constraints"
    }
  ]
}
```

**Narration:**
> "It recorded the failure. But it doesn't know HOW to fix it yet.
>
> That's where I come in. I'm going to teach it."

---

## ACT 2: THE TEACHING (1:30 - 3:00)

### Scene 3: First Lesson - Spatial Rules (1:30 - 2:00)

**Terminal:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/teach/spatial \
  -H "Content-Type: application/json" \
  -d '{"rule": "Never use arrows to intersection - causes collisions"}'
```

**Memory Panel Updates LIVE:**
```json
{
  "spatialRules": [
    "❌ Never use arrows to intersection"
  ],
  "version": 2  // ← Version incremented!
}
```

**Narration:**
> "I'm teaching it the first rule: Never use arrows to the intersection.
>
> Watch the memory update - it's learning in real-time.
>
> Now let's add one more spatial rule..."

**Terminal:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/teach/spatial \
  -H "Content-Type: application/json" \
  -d '{"rule": "Use absolute positioning for answer (y=-3.2)"}'
```

**Memory:**
```json
{
  "spatialRules": [
    "❌ Never use arrows to intersection",
    "✅ Position answer at y=-3.2"
  ],
  "version": 3
}
```

**Narration:**
> "Position the answer at a safe Y coordinate. This keeps it clear of
> the circles. Let's try generating again..."

---

### Scene 4: Second Attempt - BETTER! (2:00 - 2:30)

**Terminal:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "intersection",
    "setA": [1,2,3,4,5],
    "setB": [4,5,6,7,8],
    "question": "Find A ∩ B"
  }'
```

**Response:**
```json
{
  "success": true,
  "result": {
    "collisions": 0,  // ← FIXED!
    "clarityScore": 7
  }
}
```

**Show new video - NO COLLISION!**

**Narration:**
> "Look at that! No more collisions. The answer is positioned safely
> at the bottom. The circles are clear.
>
> But the clarity score is only 7 out of 10. It's technically correct,
> but not very engaging for a student.
>
> Let's teach it some pedagogy..."

---

### Scene 5: Second Lesson - Pedagogy (2:30 - 3:00)

**Terminal:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/teach/pedagogy \
  -H "Content-Type: application/json" \
  -d '{"rule": "Explain elements one-by-one conversationally"}'

curl -X POST http://localhost:3001/api/sets-agent/teach/pedagogy \
  -H "Content-Type: application/json" \
  -d '{"rule": "Use rubber-duck style: Let'\''s look at 1... is it in A?"}'
```

**Memory:**
```json
{
  "spatialRules": [
    "❌ Never use arrows to intersection",
    "✅ Position answer at y=-3.2"
  ],
  "pedagogyRules": [
    "✅ Explain elements one-by-one",
    "✅ Use rubber-duck style"
  ],
  "version": 5
}
```

**Narration:**
> "Now I'm teaching it how to explain things. Go through each number
> one by one. Use a conversational tone - like rubber ducking.
>
> Let's see if this makes a difference..."

---

## ACT 3: THE BREAKTHROUGH (3:00 - 4:00)

### Scene 6: Third Attempt - PERFECT! (3:00 - 3:30)

**Terminal:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "intersection",
    "setA": [1,2,3,4,5],
    "setB": [4,5,6,7,8],
    "question": "Find A ∩ B"
  }'
```

**Response:**
```json
{
  "success": true,
  "result": {
    "collisions": 0,
    "clarityScore": 9  // ← EXCELLENT!
  }
}
```

**Show final video - PERFECT!**

**Narration:**
> "Nine out of ten! Look at this - it's explaining each number
> conversationally. 'Let's look at 1... it's in A but not B.'
>
> The spatial layout is perfect. The pedagogy is engaging.
>
> This is actually usable for teaching 13-year-olds now.
>
> But here's where it gets really interesting..."

---

### Scene 7: The Memory (3:30 - 4:00)

**Terminal:**
```bash
curl http://localhost:3001/api/sets-agent/memory
```

**Full Memory Display:**
```json
{
  "version": 6,
  "spatialRules": [
    "❌ Never use arrows to intersection",
    "✅ Position answer at y=-3.2"
  ],
  "pedagogyRules": [
    "✅ Explain elements one-by-one",
    "✅ Use rubber-duck style"
  ],
  "successfulPatterns": [
    {
      "problem": "Find A ∩ B",
      "clarity": 9,
      "collisions": 0
    }
  ],
  "failures": [
    {
      "issue": "Spatial collision",
      "lesson": "Enforce spatial constraints"
    }
  ]
}
```

**Narration:**
> "The agent now has MEMORY. It remembers what works and what doesn't.
>
> Version 6. Two spatial rules. Two pedagogy rules. One successful pattern.
>
> Now watch what happens when I give it a NEW problem it's never seen..."

---

## ACT 4: THE TEST (4:00 - 4:45)

### Scene 8: New Problem - First Try Success! (4:00 - 4:30)

**Terminal:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "union",
    "setA": [1,2,3],
    "setB": [3,4,5],
    "question": "Find A ∪ B"
  }'
```

**Response:**
```json
{
  "success": true,
  "result": {
    "collisions": 0,
    "clarityScore": 9
  }
}
```

**Narration:**
> "PERFECT. On the FIRST try. It's never seen a union problem before,
> but it applied everything it learned.
>
> No collisions. Nine out of ten clarity. Conversational explanation.
>
> The agent learned."

---

### Scene 9: Memory Growth (4:30 - 4:45)

**Memory Panel:**
```json
{
  "version": 7,
  "successfulPatterns": [
    {"problem": "A ∩ B", "clarity": 9},
    {"problem": "A ∪ B", "clarity": 9}  // ← New!
  ]
}
```

**Narration:**
> "And it keeps learning. Every successful problem adds to its memory.
>
> Version 7 now. Two successful patterns.
>
> But here's the CRAZY part..."

---

## ACT 5: THE REVELATION (4:45 - 5:00)

### Scene 10: Memory Isolation (4:45 - 5:00)

**Terminal:**
```bash
curl http://localhost:3001/api/agents/memory-usage
```

**Response:**
```json
{
  "usage": {
    "totalAgents": 5,
    "loadedAgents": 1,
    "totalMemoryKB": 8,    // ← TINY!
    "contextSavings": "High"
  }
}
```

**Visual:** Show comparison graphic

**Left side:**
```
Traditional AI:
Context: 200KB
Cost: $2.40/session
❌ Forgets everything
```

**Right side:**
```
Our Agent:
Context: 8KB
Cost: $0.10/session
✅ Remembers & learns
```

**Narration:**
> "This agent uses only 8 kilobytes of memory. EIGHT.
>
> A traditional AI session? 200 kilobytes.
>
> That's a 96% reduction in context. Which means 96% cost savings.
>
> And it REMEMBERS. It LEARNS. It gets BETTER with each problem.
>
> This is how we solve the last mile problem in AI education.
>
> In the next episode, I'm going to show you what happens when you have
> FIVE of these specialist agents working together. And I'll blow your mind
> with the cost comparison.
>
> If you want to see that, drop a like and subscribe. I'm building this
> live and documenting everything.
>
> See you in Episode 2."

---

## OUTRO (5:00)

**Visual:** End card with:
- Subscribe button
- Episode 2 preview thumbnail
- GitHub repo link
- Discord community link

**Text Overlay:**
```
Next Episode:
"How Claude Taught Gemini to Do Quadratic Equations"

Code: github.com/your-repo
Discord: discord.gg/your-server
```

---

## 🎨 Visual Effects to Add in Post

### Throughout:
1. **Memory Panel** (top-right corner)
   - JSON tree view
   - Updates in real-time
   - Highlight changes in green

2. **Success/Failure Counter** (bottom-left)
   - ✅ Success: 2
   - ❌ Failures: 1

3. **Collision Detection Overlay**
   - Red circles around collisions
   - Green checkmarks when fixed

4. **Before/After Split Screen**
   - Show original failure vs. final success

### Specific Scenes:
- **0:00:** Glitch effect on failure video
- **1:30:** Smooth animation for memory updates
- **3:30:** Zoom into memory JSON
- **4:45:** Animated cost comparison chart

---

## 📊 B-Roll Footage Needed

1. ✅ Original collision video (already have)
2. ✅ Fixed video without collisions (already have)
3. ✅ Perfect video with pedagogy (already have)
4. ⬜ Screen recording of memory panel
5. ⬜ Terminal commands being typed
6. ⬜ Cost comparison animation

---

## 🎤 Tone & Pacing

### Voice:
- Conversational, excited
- Technical but accessible
- Genuine surprise at successes
- "Look at this!" moments

### Pacing:
- Fast cuts (Mr Beast style)
- No dead air
- Retention hooks every 30 seconds:
  - 0:30: "It failed"
  - 1:00: "But watch this"
  - 2:00: "It's learning"
  - 3:00: "Now the magic"
  - 4:00: "First try - perfect"
  - 4:30: "Here's the crazy part"

### Energy:
- High energy intro
- Build anticipation through teaching
- Peak at "perfect" moment
- Mind-blow at cost comparison

---

## ✅ Final Checklist Before Upload

### Technical:
- [ ] Video: 1080p 60fps
- [ ] Audio: Clear, no background noise
- [ ] Captions: Auto-generated + manual review
- [ ] Thumbnail: Eye-catching, text readable

### Content:
- [ ] Code works (test all commands)
- [ ] Memory panel shows correctly
- [ ] Costs are accurate
- [ ] GitHub repo is public
- [ ] Discord invite link works

### YouTube:
- [ ] Title: "My AI Agent Failed at Sets... So I Taught It to Fix Itself"
- [ ] Description: Full script + links + timestamps
- [ ] Tags: AI, machine learning, educational AI, agent training
- [ ] Playlist: "Agent Training Layer Series"
- [ ] End screen: Episode 2 preview

---

## 🎬 READY TO RECORD!

**Command to start:**
```bash
# Terminal 1: Backend
cd packages/backend
npm run dev

# Terminal 2: Demo commands
cd packages/backend
source EPISODE-1-RECORDING-SCRIPT.md
# Copy-paste commands during recording
```

**Let's make history!** 🚀
