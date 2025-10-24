# TikTok Multilingual Video Generation - Setup Complete ✅

**Date:** 2025-10-24
**Languages:** English (en) + Shona (sn)
**Status:** Ready for testing

---

## 📦 What's Been Created

### 1. Core Services

| File | Purpose | Lines |
|------|---------|-------|
| `packages/backend/src/services/tiktok/elevenlabs.ts` | ElevenLabs voice generation service | 342 |
| `packages/backend/src/services/tiktok/types.ts` | Updated type definitions (added ElevenLabs types) | 503 |

### 2. Test Scripts

| File | Purpose |
|------|---------|
| `packages/backend/src/services/tiktok/test-en-sn-generation.ts` | Basic translation & voice test |
| `packages/backend/src/services/tiktok/test-full-pipeline.ts` | Complete end-to-end pipeline test |

### 3. Documentation

| File | Purpose |
|------|---------|
| `TESTING-GUIDE-EN-SN.md` | Comprehensive testing guide |
| `QUICK-START-EN-SN.md` | 5-minute quick start guide |
| `README-SETUP.md` | This file |

---

## 🔑 What You Need to Do

### Step 1: Add Your API Keys

Navigate to the backend directory and create a `.env` file:

```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual/packages/backend
cp .env.example .env
nano .env  # or code .env, or vim .env
```

Add your actual API keys to the `.env` file:

```bash
GOOGLE_CLOUD_API_KEY=your_actual_google_key_here
ELEVENLABS_API_KEY=your_actual_elevenlabs_key_here
ANTHROPIC_API_KEY=your_actual_anthropic_key_here
```

**Get your keys from:**
- **Google Cloud:** https://console.cloud.google.com/apis/credentials
- **ElevenLabs:** https://elevenlabs.io/app (Settings → API Keys)
- **Anthropic:** https://console.anthropic.com/ (Account → API Keys)

### Step 2: Get an ElevenLabs Voice ID

You need a voice ID to generate audio. Two options:

**Option A - Pre-made Voice (Quick):**
1. Go to https://elevenlabs.io/voices
2. Browse and pick a voice
3. Copy the Voice ID (e.g., `21m00Tcm4TlvDq8ikWAM`)

**Option B - Clone Your Voice (Better Quality):**
1. Go to https://elevenlabs.io/voice-lab
2. Record 3-5 samples of your voice (clear audio, 30s each)
3. Create the cloned voice
4. Copy the generated Voice ID

### Step 3: Prepare a Test Video

You'll need a video file to test with:
- **Format:** MP4 (recommended)
- **Duration:** 5-30 minutes ideal
- **Content:** Clear English audio
- **Quality:** Good audio quality for transcription

Place it somewhere accessible, e.g.:
```bash
~/Videos/test-video.mp4
```

---

## 🧪 Quick Test Commands

### Test 1: Basic Translation Test (No video needed)

```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual/packages/backend
npx tsx src/services/tiktok/test-en-sn-generation.ts
```

**Expected result:**
- ✅ Verifies API keys
- ✅ Tests translation EN → SN
- ✅ Shows cost estimates
- 📁 Creates `output/test-audio/translations-en-sn.json`

**Duration:** ~30 seconds

---

### Test 2: Full Pipeline Test (Requires video + voice ID)

```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual/packages/backend

npx tsx src/services/tiktok/test-full-pipeline.ts \
  /path/to/your/video.mp4 \
  your_voice_id_here
```

**Real example:**
```bash
npx tsx src/services/tiktok/test-full-pipeline.ts \
  ~/Videos/podcast.mp4 \
  21m00Tcm4TlvDq8ikWAM
```

**Expected result:**
- 🔍 Analyzes video for 3 viral moments (~2 min)
- 🌍 Translates captions to Shona (~10 sec)
- 🎙️ Generates 6 audio files (3 EN + 3 SN) (~2 min)
- 📁 Saves everything to `output/tiktok-test/`

**Duration:** ~3-5 minutes

---

## 📁 File Locations

### Configuration Files
```
/home/dachu/Documents/projects/worktrees/tiktok-multilingual/
└── packages/backend/
    ├── .env              ← ADD YOUR KEYS HERE
    └── .env.example      ← Template (already exists)
```

### Test Scripts
```
/home/dachu/Documents/projects/worktrees/tiktok-multilingual/
└── packages/backend/src/services/tiktok/
    ├── test-en-sn-generation.ts     ← Basic test
    └── test-full-pipeline.ts         ← Full pipeline test
```

### Output Files (After running tests)
```
/home/dachu/Documents/projects/worktrees/tiktok-multilingual/
└── packages/backend/output/
    ├── test-audio/
    │   └── translations-en-sn.json
    └── tiktok-test/
        ├── moment_1_en.mp3
        ├── moment_1_sn.mp3
        ├── moment_2_en.mp3
        ├── moment_2_sn.mp3
        ├── moment_3_en.mp3
        ├── moment_3_sn.mp3
        └── pipeline-results.json
```

### Documentation
```
/home/dachu/Documents/projects/worktrees/tiktok-multilingual/
├── QUICK-START-EN-SN.md           ← Start here!
├── TESTING-GUIDE-EN-SN.md         ← Detailed guide
├── README-SETUP.md                 ← This file
└── TIKTOK-API-DOCUMENTATION.md    ← API reference
```

---

## 🎯 Recommended Testing Flow

### First Time Setup

1. ✅ **Add API keys** to `.env` file
2. ✅ **Get voice ID** from ElevenLabs
3. ✅ **Run Test 1** (basic translation test)
4. ✅ **Run Test 2** (full pipeline with video)
5. ✅ **Review output** files and audio quality

### After Initial Setup

1. 🚀 **Start server:** `npm run dev`
2. 🧪 **Test API endpoints** (see TIKTOK-API-DOCUMENTATION.md)
3. 🌍 **Add more languages** (edit types.ts)
4. 📹 **Generate production videos**

---

## 💰 Cost Estimate

### Per Video (3 moments, EN + SN)

| Service | Cost |
|---------|------|
| Translation (Google) | ~$0.00001 |
| Voice Gen (ElevenLabs) | ~$0.33 |
| **Total** | **~$0.33** |

### Scaling

| Videos | Total Cost |
|--------|-----------|
| 1 | $0.33 |
| 10 | $3.30 |
| 100 | $33.00 |
| 1,000 | $330.00 |

**Note:** Actual costs depend on:
- Number of moments per video
- Caption length
- ElevenLabs plan (Creator/Pro/Scale)

---

## 🔧 Common Issues & Solutions

### "API key is required"

**Problem:** `.env` file not found or keys not set

**Solution:**
```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual/packages/backend
ls -la .env  # Check if file exists
cat .env     # Verify keys are set
```

### "Video file not found"

**Problem:** Wrong path to video file

**Solution:** Use absolute path:
```bash
npx tsx src/services/tiktok/test-full-pipeline.ts \
  /absolute/path/to/video.mp4 \
  voice_id
```

### "Translation failed"

**Problem:** Invalid Google Cloud API key

**Solution:** Test key manually:
```bash
curl "https://translation.googleapis.com/language/translate/v2?key=YOUR_KEY" \
  -d "q=Hello" \
  -d "target=sn"
```

### "Voice generation failed"

**Problem:** Invalid ElevenLabs key or voice ID

**Solution:** Verify voice exists:
```bash
curl "https://api.elevenlabs.io/v1/voices" \
  -H "xi-api-key: YOUR_KEY"
```

---

## 🚀 Next Steps

### Immediate (Start Testing)

1. ✅ Add API keys to `.env`
2. ✅ Get ElevenLabs voice ID
3. ✅ Run basic test
4. ✅ Run full pipeline test

### Short Term (Expand)

1. 🌍 Add more languages (Zulu, Swahili, etc.)
2. 🎨 Customize voice settings
3. 📹 Test with different video types
4. 💾 Integrate with video rendering

### Long Term (Production)

1. 🚀 Deploy API to production
2. 📊 Add analytics and monitoring
3. 💰 Optimize costs with caching
4. 🔄 Automate video processing

---

## 📚 Documentation Reference

| Document | When to Use |
|----------|-------------|
| **QUICK-START-EN-SN.md** | Start here! 5-minute setup |
| **TESTING-GUIDE-EN-SN.md** | Detailed testing instructions |
| **TIKTOK-API-DOCUMENTATION.md** | API reference and deployment |
| **README-SETUP.md** | This file - setup overview |

---

## ✅ Checklist

Before you start testing:

- [ ] API keys added to `.env` file
  - [ ] GOOGLE_CLOUD_API_KEY
  - [ ] ELEVENLABS_API_KEY
  - [ ] ANTHROPIC_API_KEY
- [ ] ElevenLabs voice ID obtained
- [ ] Test video file prepared (MP4 format)
- [ ] Backend dependencies installed (`npm install`)
- [ ] In correct directory: `packages/backend`

Ready to test? Run:
```bash
npx tsx src/services/tiktok/test-en-sn-generation.ts
```

---

**Need help?**
- Check `TESTING-GUIDE-EN-SN.md` for detailed troubleshooting
- Review error messages in console output
- Verify all API keys are valid and active

**Good luck!** 🚀
