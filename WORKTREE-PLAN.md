# Git Worktree Development Plan

Strategy for parallel development on multiple features.

---

## 🌲 Proposed Worktree Structure

```
content-engine/                    (master - main development)
├── ../content-engine-elevenlabs/  (feature/elevenlabs-integration)
├── ../content-engine-translation/ (feature/translation-pipeline)
├── ../content-engine-tiktok/      (feature/tiktok-shorts)
└── ../content-engine-multilingual/(feature/multilingual-video)
```

---

## 📋 Feature Branches & Scope

### 1. `feature/elevenlabs-integration`
**Goal:** Voice cloning with ElevenLabs

**Tasks:**
- [ ] Install ElevenLabs SDK
- [ ] Create voice cloning endpoint
- [ ] Store cloned voice IDs
- [ ] Replace OpenAI TTS with ElevenLabs in video pipeline
- [ ] Test multilingual voice generation
- [ ] Update video-director to use ElevenLabs

**Files to modify:**
- `packages/backend/package.json`
- `packages/backend/src/services/elevenlabs.ts` (new)
- `packages/backend/src/routes/video-director.ts`
- `packages/backend/.env.example`

**Estimated time:** 2-3 hours

---

### 2. `feature/translation-pipeline`
**Goal:** Professional translation with Google Cloud

**Tasks:**
- [ ] Install Google Cloud Translation SDK
- [ ] Create translation service
- [ ] Build translation API endpoint
- [ ] Support batch translation
- [ ] Add language detection
- [ ] Create translation quality checks
- [ ] Build DeepL fallback for European languages

**Files to create/modify:**
- `packages/backend/src/services/translation.ts` (new)
- `packages/backend/src/routes/translation.ts` (new)
- `packages/backend/package.json`
- `packages/backend/.env.example`

**Estimated time:** 2-3 hours

---

### 3. `feature/tiktok-shorts`
**Goal:** Generate vertical short-form videos

**Tasks:**
- [ ] Create TikTok video analyzer (find best moments)
- [ ] Build vertical format renderer (9:16)
- [ ] Add captions/subtitles generator
- [ ] Create hook generator for first 3 seconds
- [ ] Add CTA overlay ("Full video on YouTube")
- [ ] Build batch extractor (1 video → 10 shorts)
- [ ] Create TikTok-optimized compositions in Remotion

**Files to create/modify:**
- `packages/backend/src/services/tiktok-generator.ts` (new)
- `packages/backend/src/routes/tiktok.ts` (new)
- `packages/backend/src/remotion/TikTokComposition.tsx` (new)
- `packages/backend/src/remotion/components/CaptionOverlay.tsx` (new)

**Estimated time:** 4-5 hours

---

### 4. `feature/multilingual-video`
**Goal:** Complete multilingual video pipeline

**Tasks:**
- [ ] Integrate all services (ElevenLabs + Translation + Remotion)
- [ ] Create multilingual video endpoint
- [ ] Build subtitle generator for each language
- [ ] Create language-specific video metadata
- [ ] Add batch rendering (1 script → N languages)
- [ ] Build YouTube upload automation (optional)
- [ ] Create content multiplier (1 video → 40 clips)

**Dependencies:**
- Requires `feature/elevenlabs-integration`
- Requires `feature/translation-pipeline`
- Requires `feature/tiktok-shorts`

**Files to create/modify:**
- `packages/backend/src/services/multilingual-video.ts` (new)
- `packages/backend/src/routes/multilingual.ts` (new)
- Integration with existing video-director

**Estimated time:** 3-4 hours

---

## 🚀 Setup Commands

### Create All Worktrees
```bash
# From main repo
cd /home/dachu/Documents/projects/content-engine

# Create feature branches
git branch feature/elevenlabs-integration
git branch feature/translation-pipeline
git branch feature/tiktok-shorts
git branch feature/multilingual-video

# Create worktrees (separate directories)
git worktree add ../content-engine-elevenlabs feature/elevenlabs-integration
git worktree add ../content-engine-translation feature/translation-pipeline
git worktree add ../content-engine-tiktok feature/tiktok-shorts
git worktree add ../content-engine-multilingual feature/multilingual-video
```

### Work in Parallel
```bash
# Terminal 1: ElevenLabs work
cd ../content-engine-elevenlabs
code .

# Terminal 2: Translation work
cd ../content-engine-translation
code .

# Terminal 3: TikTok work
cd ../content-engine-tiktok
code .
```

---

## 🎯 Development Priority

### Phase 1: Foundation (Week 1)
1. **ElevenLabs Integration** (High Priority)
   - Voice cloning is critical for brand consistency
   - Unlocks multilingual with same voice

2. **Translation Pipeline** (High Priority)
   - Needed for multilingual content
   - Relatively independent task

### Phase 2: Content Generation (Week 2)
3. **TikTok Shorts** (Medium Priority)
   - Drives traffic to YouTube
   - Can work with existing English content first

### Phase 3: Integration (Week 3)
4. **Multilingual Video** (Combines all features)
   - Merge all three previous features
   - Build automation layer
   - Test end-to-end pipeline

---

## 📦 Dependencies to Install

### ElevenLabs
```bash
npm install elevenlabs
```

### Google Cloud Translation
```bash
npm install @google-cloud/translate
```

### DeepL (optional)
```bash
npm install deepl-node
```

### Additional (for TikTok generation)
```bash
npm install subtitle  # For SRT generation
npm install @ffmpeg-installer/ffmpeg  # Ensure FFmpeg available
```

---

## 🔑 API Keys Needed

Add to `.env`:
```bash
# Voice
ELEVENLABS_API_KEY=your_key_here

# Translation
GOOGLE_CLOUD_API_KEY=your_key_here
GOOGLE_CLOUD_PROJECT_ID=your_project_id
DEEPL_API_KEY=your_key_here  # Optional

# Existing
ANTHROPIC_API_KEY=existing
OPENAI_API_KEY=existing
```

---

## 📊 Success Metrics

### ElevenLabs Integration
- ✅ Voice cloned and stored
- ✅ Can generate audio in 5+ languages with same voice
- ✅ Replaces OpenAI TTS in video pipeline

### Translation Pipeline
- ✅ Translates English → Shona with 95%+ accuracy
- ✅ Supports batch translation (100+ texts)
- ✅ Handles edge cases (formatting, special chars)

### TikTok Shorts
- ✅ Extracts 10 clips from 1 long video
- ✅ All clips are 9:16 vertical format
- ✅ Captions auto-generated and burned in
- ✅ CTA overlay on each clip

### Multilingual Video
- ✅ 1 English script → 4 languages automated
- ✅ 1 YouTube video → 40 TikTok clips (4 languages × 10 clips)
- ✅ End-to-end automation (< 15 min per language)

---

## 🔄 Merge Strategy

### Keep Master Clean
- Only merge when feature is complete and tested
- All features work independently in worktrees
- Main repo stays stable

### Merge Order
1. Merge `feature/elevenlabs-integration` first (others depend on it)
2. Merge `feature/translation-pipeline` second
3. Merge `feature/tiktok-shorts` third
4. Merge `feature/multilingual-video` last (integrates all)

### Merge Commands
```bash
# From main repo
git checkout master
git merge feature/elevenlabs-integration
git push origin master

# Delete worktree after merge
git worktree remove ../content-engine-elevenlabs
git branch -d feature/elevenlabs-integration
```

---

## 🎬 End Goal: Content Multiplier

**Input:** 1 English YouTube video (10 minutes)

**Output:**
- 1 English YouTube video (10 min)
- 3 Translated YouTube videos (Shona, Spanish, Portuguese - 10 min each)
- 40 TikTok shorts (4 languages × 10 clips × 60 sec)

**Total:** 44 pieces of content from 1 video!

**Cost:** ~$50 total ($1.14 per video)

**Time:** ~2 hours automated processing

---

## 📝 Next Immediate Steps

1. Run setup commands to create worktrees
2. Start with `feature/elevenlabs-integration` (highest priority)
3. Clone your voice (record 1-2 min of speech)
4. Test voice generation in multiple languages
5. Move to translation pipeline

---

**Ready to start? Which feature should we tackle first?**
