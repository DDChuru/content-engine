# Quick Start: English + Shona Video Generation

**Goal:** Generate TikTok videos in English and Shona in under 5 minutes.

---

## 🚀 5-Minute Setup

### 1. Navigate to Backend Directory
```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual/packages/backend
```

### 2. Create `.env` File
```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

### 3. Add Your API Keys

Paste your keys into the `.env` file:

```bash
GOOGLE_CLOUD_API_KEY=your_google_cloud_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

**Where to get keys:**
- Google Cloud: https://console.cloud.google.com/apis/credentials
- ElevenLabs: https://elevenlabs.io/app
- Anthropic: https://console.anthropic.com/

### 4. Get ElevenLabs Voice ID

**Option A - Use Pre-made Voice:**
1. Visit: https://elevenlabs.io/voices
2. Pick a voice you like
3. Copy the Voice ID

**Option B - Clone Your Voice:**
1. Visit: https://elevenlabs.io/voice-lab
2. Record 3 voice samples
3. Create voice and copy the ID

---

## 🧪 Quick Tests

### Test 1: Translation Only (No API calls)
```bash
npx tsx src/services/tiktok/test-en-sn-generation.ts
```

**What you'll see:**
- ✅ API key verification
- ✅ Language configuration
- ✅ Translation EN → SN
- ✅ Cost estimates
- 📁 Output: `output/test-audio/translations-en-sn.json`

**Time:** ~30 seconds

---

### Test 2: Full Pipeline (Requires video + voice ID)
```bash
npx tsx src/services/tiktok/test-full-pipeline.ts \
  /path/to/your/video.mp4 \
  your_voice_id_here
```

**Example:**
```bash
npx tsx src/services/tiktok/test-full-pipeline.ts \
  ~/Videos/podcast.mp4 \
  21m00Tcm4TlvDq8ikWAM
```

**What you'll see:**
- 🔍 Analyzes video for 3 viral moments
- 🌍 Translates captions to Shona
- 🎙️ Generates voice audio (EN + SN)
- 📁 Saves 6 audio files

**Time:** ~3-5 minutes (depends on video length)

**Output:**
```
output/tiktok-test/
├── moment_1_en.mp3
├── moment_1_sn.mp3
├── moment_2_en.mp3
├── moment_2_sn.mp3
├── moment_3_en.mp3
├── moment_3_sn.mp3
└── pipeline-results.json
```

---

## 🎯 What You'll Get

### Translation Examples

| English | Shona |
|---------|-------|
| Hey everyone! Welcome back! | Mhoro vanhu vese! Pindai zvakare! |
| Don't forget to follow | Usazokanganwa kutevera |
| This is amazing! | Izvi zvinoshamisa! |

### Audio Files

- **Format:** MP3
- **Quality:** 128-192 kbps
- **Languages:** English (en-US) + Shona (en-US multilingual)
- **Total Files:** 6 (3 moments × 2 languages)

---

## 💰 Costs

**Per 3-moment video:**
- Translation: ~$0.000015 (practically free)
- Voice generation: ~$0.33 (6 audio files)
- **Total: ~$0.33 per video**

**Scaling:**
- 10 videos: ~$3.30
- 100 videos: ~$33.00

---

## 🔧 Troubleshooting

### "API key is required"
```bash
# Check if .env exists
ls -la .env

# Verify you're in the right directory
pwd
# Should end with: /packages/backend
```

### "Video file not found"
```bash
# Use absolute path
npx tsx src/services/tiktok/test-full-pipeline.ts \
  /absolute/path/to/video.mp4 \
  voice_id
```

### "Translation failed"
```bash
# Test your Google Cloud API key
curl "https://translation.googleapis.com/language/translate/v2?key=YOUR_KEY" \
  -d "q=Hello" \
  -d "target=sn"
```

---

## 📚 Next Steps

1. ✅ Run Test 1 (translation)
2. ✅ Run Test 2 (full pipeline)
3. 📖 Read full guide: `TESTING-GUIDE-EN-SN.md`
4. 🚀 Deploy API: `TIKTOK-API-DOCUMENTATION.md`
5. 🌍 Add more languages: Edit `types.ts`

---

## 🎬 Using the API

Once tested, start the server:

```bash
npm run dev
```

Then use the REST API:

```bash
# 1. Analyze video
curl -X POST http://localhost:3001/api/tiktok/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoPath": "/path/to/video.mp4", "count": 3}'

# 2. Create session
curl -X POST http://localhost:3001/api/tiktok/session \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "user_1", "voiceId": "voice_id"}'

# 3. Batch render
curl -X POST http://localhost:3001/api/tiktok/batch-render \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/video.mp4",
    "momentIndexes": [1, 2, 3],
    "languages": ["en", "sn"],
    "sessionId": "user_1"
  }'
```

See `TIKTOK-API-DOCUMENTATION.md` for complete API reference.

---

**Questions?** Check `TESTING-GUIDE-EN-SN.md` for detailed troubleshooting.

**Ready to test!** 🚀
