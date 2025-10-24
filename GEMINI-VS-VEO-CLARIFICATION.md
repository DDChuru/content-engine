# Gemini vs Veo - Clarification

**Important:** Understanding what we use and why

---

## 🤔 The Confusion

You might see references to different Google AI services. Here's what's what:

---

## What We USE in Educational Content

### 1. **Manim** (PRIMARY - Animations)
- **Type:** LOCAL Python library
- **Purpose:** Mathematical animations (circle theorems, graphs, etc.)
- **Output:** MP4 video files
- **Cost:** **FREE** ✅
- **Quality:** 3Blue1Brown level
- **Control:** 100% precise

**Examples:**
- Circle theorem proofs with animated angles
- Differentiation graphs with tangent lines
- Geometric constructions step-by-step

### 2. **Gemini 2.0 Flash** (SECONDARY - Static Images)
- **Type:** Google AI text-to-image
- **Purpose:** Background/context images ONLY
- **Output:** PNG/JPG static images
- **Cost:** ~$0.01 per image
- **Model:** `gemini-2.0-flash-exp`
- **API Key:** `GEMINI_API_KEY`

**Examples:**
- Introduction slide backgrounds
- Real-world photo contexts
- Non-mathematical illustrations

### 3. **ElevenLabs** (PRIMARY - Voice)
- **Type:** Voice cloning & TTS
- **Purpose:** YOUR voice narration
- **Output:** MP3 audio files
- **Cost:** Free tier: 10,000 chars/month
- **API Key:** `ELEVENLABS_API_KEY`

---

## What We DON'T USE

### ❌ **Veo 3.1** (Google's AI Video Generation)
- **Type:** Text-to-video AI
- **Purpose:** Generate full videos from text prompts
- **Output:** MP4 video
- **Cost:** Expensive (~$0.50+ per video)
- **API:** Same Google AI API, different model

**Why we DON'T use it:**
1. **Manim is better** for math content
2. **Manim is FREE** vs Veo is expensive
3. **Manim is precise** vs Veo is unpredictable
4. **We control Manim** vs Veo is a black box

### ❌ **Imagen 3** (Google's Advanced Image Model)
- **Type:** Text-to-image AI
- **Purpose:** High-quality image generation
- **Why not:** Gemini 2.0 Flash is good enough and cheaper

### ❌ **OpenAI TTS** (Generic Voice)
- **Type:** Text-to-speech
- **Why not:** Using ElevenLabs for YOUR voice instead

---

## Architecture Breakdown

### Educational Video Pipeline:

```
┌─────────────────────────────────────────────────┐
│ Scene Decision:                                 │
│ "Is this mathematical/animated?"                │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    YES │                 │ NO
        ↓                 ↓
  ┌──────────┐      ┌──────────┐
  │  MANIM   │      │  GEMINI  │
  │  (FREE)  │      │  ($0.01) │
  └────┬─────┘      └────┬─────┘
       │                 │
       ↓                 ↓
   MP4 Animation    PNG Image
       │                 │
       └────────┬────────┘
                ↓
        ┌────────────────┐
        │  ELEVENLABS    │
        │  (Your Voice)  │
        └────────┬───────┘
                 ↓
            MP3 Narration
                 ↓
        ┌────────────────┐
        │    REMOTION    │
        │  (Composition) │
        └────────┬───────┘
                 ↓
          Final MP4 Video
```

---

## Cost Comparison

### Our Approach (Manim + Gemini + ElevenLabs):

| Component | Count | Cost Each | Total |
|-----------|-------|-----------|-------|
| Manim animations | 6 scenes | FREE | $0.00 |
| Gemini images | 4 scenes | $0.01 | $0.04 |
| ElevenLabs voice | ~300 chars × 10 | $0.30/1K | $0.90 |
| **TOTAL per module** | | | **$0.94** |

### If We Used Veo Instead:

| Component | Count | Cost Each | Total |
|-----------|-------|-----------|-------|
| Veo AI videos | 10 scenes | $0.50+ | $5.00+ |
| ElevenLabs voice | ~300 chars × 10 | $0.30/1K | $0.90 |
| **TOTAL per module** | | | **$5.90+** |

**Savings:** $5.90 - $0.94 = **$4.96 per module** (84% cheaper!)

**For 10 modules:** Save $49.60!

---

## API Keys Summary

### ✅ What You Need:

```bash
# For static background images
GEMINI_API_KEY=AIza_your_key_here

# For voice cloning & narration
ELEVENLABS_API_KEY=sk_your_key_here

# Optional: For lesson structure generation
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

### ❌ What You DON'T Need:

```bash
# NOT NEEDED - We use Manim instead
VEO_API_KEY=not_needed

# NOT NEEDED - We use Gemini 2.0 Flash
IMAGEN_API_KEY=not_needed

# NOT NEEDED - We use ElevenLabs
OPENAI_API_KEY=not_needed
```

---

## In Code

### What We Call (Gemini):

```typescript
// In video-generator.ts
const model = this.gemini.getGenerativeModel({
  model: 'gemini-2.0-flash-exp'  // ← For IMAGES, not video!
});

const result = await model.generateContent(prompt);
// Returns: Static PNG image
```

### What We DON'T Call (Veo):

```typescript
// ❌ NOT IN OUR CODE - We don't use this
const veoModel = this.gemini.getGenerativeModel({
  model: 'veo-3.1'  // ← Would generate video (expensive!)
});
```

### What We Call (Manim):

```typescript
// In manim-renderer.ts
const command = `/home/dachu/miniconda3/envs/aitools/bin/manim render ${script} -ql`;
// Returns: MP4 animation (FREE!)
```

---

## When Would You Use Veo?

**Veo would be useful for:**
- ❌ Non-mathematical content (but we have Gemini images)
- ❌ General educational videos (but we have Manim)
- ❌ Realistic scenes (but not needed for math)

**For math education, Manim is superior:**
- ✅ Mathematical precision
- ✅ Programmatic control
- ✅ Step-by-step construction
- ✅ FREE unlimited rendering
- ✅ Professional quality (3Blue1Brown uses it!)

---

## Other Worktrees

You might see a `veo-video-ai` worktree in your projects. That's a **different project** for:
- General video generation
- Marketing videos
- Product demos
- NOT for mathematical education

**Each worktree has different needs!**

---

## Summary Table

| Service | Type | We Use? | For What? | Cost |
|---------|------|---------|-----------|------|
| **Manim** | Local Python | ✅ YES | Math animations | FREE |
| **Gemini 2.0 Flash** | Google AI | ✅ YES | Static images | $0.01/image |
| **ElevenLabs** | Voice AI | ✅ YES | Your voice | Free tier |
| **Veo 3.1** | Google AI | ❌ NO | - | - |
| **Imagen** | Google AI | ❌ NO | - | - |
| **OpenAI TTS** | Voice | ❌ NO | - | - |

---

## Key Takeaway

**For Educational Math Content:**

```
Manim (FREE animations)
  +
Gemini (cheap images)
  +
ElevenLabs (your voice)
  =
Professional content for ~$0.94/module
```

**We DON'T need Veo because Manim does it better and FREE!**

---

## Environment Variables - Correct Naming

```bash
# CORRECT - What we use
GEMINI_API_KEY=AIza_xxx          # For static images only
ELEVENLABS_API_KEY=sk_xxx        # For voice
ANTHROPIC_API_KEY=sk-ant-xxx     # For lesson generation

# NO CONFUSION - We don't use these
# VEO_API_KEY=not_needed
# IMAGEN_API_KEY=not_needed
```

**One key (`GEMINI_API_KEY`) is fine because:**
1. We're only using it for static images
2. We're NOT calling Veo endpoints
3. If we ever needed Veo, we'd just call a different model with the same key

---

**Bottom Line:** You only need `GEMINI_API_KEY` for static images. Manim handles all the animations (FREE). No Veo needed! 🎯
