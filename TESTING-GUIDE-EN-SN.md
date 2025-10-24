# TikTok Multilingual Video Generation - Testing Guide

**Languages:** English (en) + Shona (sn)
**Date:** 2025-10-24
**Pipeline Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Test Scenarios](#test-scenarios)
5. [Running Tests](#running-tests)
6. [Expected Results](#expected-results)
7. [Troubleshooting](#troubleshooting)
8. [Cost Analysis](#cost-analysis)

---

## Overview

This guide walks you through testing the complete TikTok multilingual video generation pipeline for **English** and **Shona** languages.

### What Gets Tested

✅ Translation service (Google Cloud Translate)
✅ Voice generation (ElevenLabs)
✅ Moment analysis (Anthropic Claude)
✅ Cost estimation
✅ End-to-end pipeline

### Pipeline Flow

```
┌─────────────────┐
│  Source Video   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Analyze Moments │  ← Anthropic Claude
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Translate (SN)  │  ← Google Cloud Translate
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate Voice  │  ← ElevenLabs TTS
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  TikTok Videos  │  EN + SN versions
└─────────────────┘
```

---

## Prerequisites

### 1. API Keys Required

You need the following API keys:

| Service | Key Name | Get It From |
|---------|----------|-------------|
| Google Cloud | `GOOGLE_CLOUD_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com/apis/credentials) |
| ElevenLabs | `ELEVENLABS_API_KEY` | [elevenlabs.io/app](https://elevenlabs.io/app) |
| Anthropic | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) |

### 2. ElevenLabs Voice ID

You need a **Voice ID** from ElevenLabs:

**Option A: Use Pre-made Voice**
1. Go to https://elevenlabs.io/voices
2. Browse the voice library
3. Copy the voice ID (looks like: `21m00Tcm4TlvDq8ikWAM`)

**Option B: Clone Your Own Voice**
1. Go to https://elevenlabs.io/voice-lab
2. Record 3-5 samples of your voice
3. Create a cloned voice
4. Copy the generated voice ID

### 3. Test Video File

Prepare a test video file:
- **Format:** MP4 (recommended)
- **Duration:** 5-30 minutes
- **Content:** Clear audio, engaging content
- **Language:** English (will be translated to Shona)

---

## Setup Instructions

### Step 1: Navigate to Backend Directory

```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual/packages/backend
```

### Step 2: Create `.env` File

```bash
# Copy the example file
cp .env.example .env

# Edit with your favorite editor
nano .env
```

### Step 3: Add Your API Keys

Edit the `.env` file:

```bash
# Google Cloud Translation API
GOOGLE_CLOUD_API_KEY=AIzaSy...your_key_here

# ElevenLabs API (for voice generation)
ELEVENLABS_API_KEY=sk_...your_key_here

# Anthropic API (for AI-powered features)
ANTHROPIC_API_KEY=sk-ant-...your_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Verify Setup

```bash
# Check that all keys are set
npx tsx src/services/tiktok/test-en-sn-generation.ts
```

---

## Test Scenarios

### Test 1: Basic Translation Test

**Purpose:** Verify translation service works for EN → SN

**Command:**
```bash
npx tsx src/services/tiktok/test-en-sn-generation.ts
```

**What It Tests:**
- API key configuration
- Language configuration (EN + SN)
- Translation service
- Cost estimation
- Output file generation

**Expected Output:**
```
═══════════════════════════════════════════════════════
🎬 TikTok Multilingual Video Generation Test
═══════════════════════════════════════════════════════
📍 Languages: English (en) + Shona (sn)
📝 Script: Amazing Facts About Zimbabwe
📦 Segments: 5

TEST 1: API Key Configuration
✓ GOOGLE_CLOUD_API_KEY: ✅ Configured
✓ ELEVENLABS_API_KEY: ✅ Configured

TEST 2: Language Configuration
English (en):
  Name: English
  Voice Locale: en-US
  Region: United States

Shona (sn):
  Name: Shona
  Voice Locale: en-US (multilingual model)
  Region: Zimbabwe

TEST 3: Translation Service (EN → SN)
Translating script segments...
  [20%] Translating to sn...
  [40%] Translating to sn...
  [60%] Translating to sn...
  [80%] Translating to sn...
  [100%] Translating to sn...

📋 Translation Results:

Segment 1:
  EN: Hey everyone! Welcome back to my channel!
  SN: Mhoro vanhu vese! Pindai zvakare kuchannel yangu!

✅ Translation test complete!

TEST 4: Cost Estimation
Translation Costs (Google Cloud):
  Characters: 183
  Estimated cost: $0.0000

Voice Generation Costs (ElevenLabs):
  Characters: 366
  Estimated cost: $0.0805

Total Estimated Cost:
  Per video (2 languages): $0.0805
  Per language: $0.0403
  Per 100 videos: $8.05

✅ Translations saved to: output/test-audio/translations-en-sn.json
```

---

### Test 2: Full Pipeline Test

**Purpose:** Test complete video generation workflow

**Command:**
```bash
npx tsx src/services/tiktok/test-full-pipeline.ts [VIDEO_PATH] [VOICE_ID]
```

**Example:**
```bash
npx tsx src/services/tiktok/test-full-pipeline.ts \
  /path/to/your/video.mp4 \
  21m00Tcm4TlvDq8ikWAM
```

**What It Tests:**
- Video analysis for viral moments
- Translation of captions
- Voice generation for both languages
- Audio file creation
- Complete workflow

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║   🎬 TikTok Multilingual Video Generation Pipeline           ║
╚════════════════════════════════════════════════════════════════╝

📋 Configuration:
   Video: /path/to/video.mp4
   Voice ID: 21m00Tcm4TlvDq8ikWAM
   Languages: en, sn
   Output: output/tiktok-test
   Moments: 3
   Duration: 60s

STEP 1: Analyze Video for Viral Moments
✓ Video file found: /path/to/video.mp4

🔍 Analyzing video (looking for 3 moments of 60s)...
✅ Found 3 viral moments!

Moment 1:
   Time: 2:15 - 3:15
   Hook: Surprising statistic that stops the scroll
   Message: How to grow your audience fast
   Viral Score: 8/10
   Caption: This one trick changed everything for me! 🔥 #Growth...

STEP 2: Translate Captions (EN → SN)
📝 Translating 3 captions to Shona...
✅ Translation complete!

STEP 3: Generate Voice Audio (ElevenLabs)
🎙️  Generating English audio...
   [1/3] "This one trick changed everything for me! 🔥..."
   [2/3] "You won't believe what happened next..."
   [3/3] "Don't forget to follow for more tips!..."

✅ English audio generated!

🎙️  Generating Shona audio...
   [1/3] "Iri bhunu rakachinja zvese kwandiri! 🔥..."
   [2/3] "Hauzozotenda zvakaitika pashure..."
   [3/3] "Usazokanganwa kutevera kuti uwane mamwe mazano!..."

✅ Shona audio generated!

╔════════════════════════════════════════════════════════════════╗
║              ✅ PIPELINE COMPLETED SUCCESSFULLY!              ║
╚════════════════════════════════════════════════════════════════╝

📊 Summary:
   Viral Moments Found: 3
   Languages: en, sn
   Audio Files Generated: 6
   Output Directory: output/tiktok-test

📁 Generated Files:
   English Audio:
      moment_1_en.mp3 (145.2 KB)
      moment_2_en.mp3 (132.8 KB)
      moment_3_en.mp3 (98.4 KB)

   Shona Audio:
      moment_1_sn.mp3 (142.1 KB)
      moment_2_sn.mp3 (128.5 KB)
      moment_3_sn.mp3 (95.2 KB)
```

---

### Test 3: API Endpoint Test

**Purpose:** Test the REST API endpoints

**Step 1: Start the server**
```bash
npm run dev
```

**Step 2: Test analyze endpoint**
```bash
curl -X POST http://localhost:3001/api/tiktok/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/video.mp4",
    "count": 3,
    "duration": 60
  }'
```

**Step 3: Create session with voice**
```bash
curl -X POST http://localhost:3001/api/tiktok/session \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_user_123",
    "voiceId": "21m00Tcm4TlvDq8ikWAM",
    "voiceName": "Test Voice"
  }'
```

**Step 4: Start batch render**
```bash
curl -X POST http://localhost:3001/api/tiktok/batch-render \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/video.mp4",
    "momentIndexes": [1, 2, 3],
    "languages": ["en", "sn"],
    "sessionId": "test_user_123"
  }'
```

---

## Expected Results

### Translation Quality

**English → Shona Examples:**

| English | Shona (Expected) |
|---------|------------------|
| Hello everyone! | Mhoro vanhu vese! |
| Welcome back | Pindai zvakare |
| Don't forget to follow | Usazokanganwa kutevera |
| This is amazing! | Izvi zvinoshamisa! |

### Audio Quality

- **Sample Rate:** 44.1 kHz or 48 kHz
- **Format:** MP3
- **Bitrate:** 128-192 kbps
- **Clarity:** High-quality voice synthesis
- **Emotion:** Natural intonation and pacing

### File Structure

```
output/
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

---

## Troubleshooting

### Issue: "API key is required"

**Solution:**
```bash
# Check if .env file exists
ls -la .env

# Verify keys are set
cat .env | grep API_KEY

# Make sure you're in the right directory
pwd
# Should be: /home/dachu/Documents/projects/worktrees/tiktok-multilingual/packages/backend
```

### Issue: "Translation failed"

**Possible Causes:**
1. Invalid Google Cloud API key
2. API quota exceeded
3. Network connectivity issues

**Solution:**
```bash
# Test Google Cloud API directly
curl "https://translation.googleapis.com/language/translate/v2?key=YOUR_KEY" \
  -d "q=Hello" \
  -d "target=sn"
```

### Issue: "Voice generation failed"

**Possible Causes:**
1. Invalid ElevenLabs API key
2. Invalid voice ID
3. API quota exceeded

**Solution:**
```bash
# List available voices
curl "https://api.elevenlabs.io/v1/voices" \
  -H "xi-api-key: YOUR_KEY"

# Test voice generation
curl "https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID" \
  -H "xi-api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test","model_id":"eleven_multilingual_v2"}' \
  --output test.mp3
```

### Issue: "Video file not found"

**Solution:**
```bash
# Use absolute path
npx tsx src/services/tiktok/test-full-pipeline.ts \
  /absolute/path/to/video.mp4 \
  YOUR_VOICE_ID

# Or use relative path from backend directory
npx tsx src/services/tiktok/test-full-pipeline.ts \
  ../../videos/sample.mp4 \
  YOUR_VOICE_ID
```

---

## Cost Analysis

### Per Video Cost Breakdown

Based on a 5-segment TikTok script:

| Service | Characters | Cost |
|---------|-----------|------|
| Google Translate (EN→SN) | ~250 chars | $0.000005 |
| ElevenLabs Voice (EN) | ~250 chars | $0.055 |
| ElevenLabs Voice (SN) | ~250 chars | $0.055 |
| **Total per video** | | **$0.11** |

### Scaling Costs

| Videos | Translation | Voice Gen | **Total** |
|--------|-------------|-----------|-----------|
| 1 | $0.000005 | $0.11 | **$0.11** |
| 10 | $0.00005 | $1.10 | **$1.10** |
| 100 | $0.0005 | $11.00 | **$11.00** |
| 1,000 | $0.005 | $110.00 | **$110.01** |

### Cost Optimization Tips

1. **Use caching** - Translations are cached automatically
2. **Batch processing** - Process multiple videos at once
3. **Voice reuse** - Clone one voice and use for all videos
4. **Selective translation** - Only translate high-performing content

---

## Next Steps

### 1. Review Test Results

```bash
# View translation output
cat output/test-audio/translations-en-sn.json

# Listen to generated audio
mpv output/tiktok-test/moment_1_en.mp3
mpv output/tiktok-test/moment_1_sn.mp3
```

### 2. Test with Real Content

```bash
# Use your own video
npx tsx src/services/tiktok/test-full-pipeline.ts \
  /path/to/my-video.mp4 \
  my_voice_id_here
```

### 3. Deploy to Production

See `TIKTOK-API-DOCUMENTATION.md` for API deployment guide.

### 4. Expand to More Languages

Add more languages in `types.ts`:
```typescript
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  // ... existing languages
  { code: 'zu', name: 'Zulu', voice: 'en-ZA', region: 'South Africa' },
  { code: 'sw', name: 'Swahili', voice: 'en-KE', region: 'East Africa' },
];
```

---

## Support

For issues or questions:
- **Documentation:** See `TIKTOK-API-DOCUMENTATION.md`
- **Code:** Check `packages/backend/src/services/tiktok/`
- **Logs:** Review console output for detailed error messages

---

**Last Updated:** 2025-10-24
**Version:** 1.0
**Maintainer:** TikTok Multilingual Pipeline Team
