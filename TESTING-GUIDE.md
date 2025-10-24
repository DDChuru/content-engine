# TikTok Multilingual Pipeline - Testing Guide

## 🎯 Quick Start

This guide will help you test the TikTok multilingual pipeline before merging to master.

---

## 📋 Prerequisites

### 1. API Keys Required
You'll need API keys for:
- ✅ **OpenAI** (Whisper transcription) - https://platform.openai.com/api-keys
- ✅ **Google Cloud** (Translation API) - https://console.cloud.google.com/
- ✅ **ElevenLabs** (Voice cloning) - https://elevenlabs.io/api
- ✅ **Anthropic** (Claude for analysis) - https://console.anthropic.com/

### 2. System Requirements
- ✅ **Node.js** 18+ installed
- ✅ **FFmpeg** installed (for video processing)
- ✅ **Sample video file** (MP4, MOV, or AVI)

---

## 🚀 Setup Instructions

### Step 1: Navigate to TikTok Worktree
```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual
```

### Step 2: Set Up Environment Variables
```bash
# Copy the example file
cp packages/backend/.env.example packages/backend/.env

# Edit with your API keys
nano packages/backend/.env
```

**Add your API keys:**
```bash
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_API_KEY=AIza...
ELEVENLABS_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...
```

### Step 3: Verify Dependencies
```bash
cd packages/backend
npm install
```

---

## 🧪 Running Tests

### Test 1: Simple Component Test (5 minutes)
Tests individual services without full video generation.

```bash
# From tiktok-multilingual root directory
node test-tiktok-simple.js /path/to/your/video.mp4
```

**What it tests:**
- ✅ Environment variables
- ✅ FFmpeg installation
- ✅ Moment Analyzer (finds viral moments)
- ✅ Vertical Converter (9:16 format)
- ✅ Translation Service (multilingual)

**Expected output:**
```
🎬 TikTok Multilingual Pipeline - Simple Test

============================================================
Step 1: Environment Check
============================================================

✓ OPENAI_API_KEY is set
✓ GOOGLE_CLOUD_API_KEY is set
✓ ELEVENLABS_API_KEY is set
✓ ANTHROPIC_API_KEY is set

✓ All environment variables set!

...

Found 3 viral moments:

  Moment 1:
    Time: 45s - 105s
    Viral Score: 8/10
    Hook: Attention-grabbing opening...
    Caption: Check this out!
```

### Test 2: Full Pipeline Test (30 minutes)
Generates actual TikTok videos with multilingual support.

```bash
# Coming soon - full batch render test
node test-tiktok-batch.js /path/to/video.mp4
```

---

## 🎬 Sample Video Sources

If you don't have a video, you can:

1. **Use a YouTube video:**
   ```bash
   # Install yt-dlp
   pip install yt-dlp

   # Download a video
   yt-dlp -f "best[height<=1080]" "https://youtube.com/watch?v=VIDEO_ID" -o sample.mp4
   ```

2. **Record a quick test video:**
   - Use your phone camera
   - 1-2 minutes of content
   - Talk about any topic (product review, tutorial, etc.)

3. **Use a stock video:**
   - https://pexels.com/videos
   - Download a free video

---

## 📊 Understanding Test Results

### ✅ All Tests Pass
```
✓ Environment: OK
✓ FFmpeg: OK
✓ Video File: OK
✓ Moment Analyzer: OK
✓ Vertical Converter: OK
✓ Translation: OK
```

**Next step:** Ready to merge to master!

### ⚠️ Some Tests Fail
```
✓ Environment: OK
✓ FFmpeg: OK
✓ Video File: OK
⚠️  Moment Analyzer: FAILED
✓ Vertical Converter: OK
✓ Translation: OK
```

**Next step:** Check the error messages and fix issues.

---

## 🐛 Troubleshooting

### Issue: "OPENAI_API_KEY is MISSING"
**Solution:**
```bash
# Make sure .env file exists in packages/backend/
cd packages/backend
cat .env | grep OPENAI_API_KEY

# If empty, add your key
echo "OPENAI_API_KEY=sk-your-key-here" >> .env
```

### Issue: "FFmpeg not found"
**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Verify installation
ffmpeg -version
```

### Issue: "Video file not found"
**Solution:**
```bash
# Check if file exists
ls -lh /path/to/video.mp4

# Use absolute path
node test-tiktok-simple.js /home/dachu/Videos/sample.mp4
```

### Issue: "Error testing Moment Analyzer"
**Possible causes:**
1. **Invalid API key** - Check ANTHROPIC_API_KEY and OPENAI_API_KEY
2. **Video too long** - Try with a shorter video (< 10 minutes)
3. **Corrupted video** - Try with a different video file

**Debug:**
```bash
# Check API keys are valid
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Issue: "Error testing Translation Service"
**Possible causes:**
1. **Invalid Google Cloud API key**
2. **Translation API not enabled**

**Solution:**
1. Go to https://console.cloud.google.com/
2. Enable "Cloud Translation API"
3. Create/verify API key

---

## 💰 Cost Estimates for Testing

### Simple Test (test-tiktok-simple.js):
- Moment Analyzer: ~$0.50-1.00 (Whisper + Claude)
- Vertical Converter: $0 (local FFmpeg)
- Translation: ~$0.001 (very cheap)
- **Total: ~$0.50-1.00**

### Full Batch Test (3 moments × 4 languages = 12 videos):
- Analysis: ~$0.50
- Voice generation: ~$1.80 (12 × $0.15)
- Translation: ~$0.02
- Video processing: $0 (local)
- **Total: ~$2.32**

---

## 🎯 Success Criteria

Before merging to master, ensure:
- ✅ All environment variables configured
- ✅ FFmpeg installed and working
- ✅ Simple test passes without errors
- ✅ At least 1 moment detected from sample video
- ✅ Vertical conversion produces valid 9:16 video
- ✅ Translation works for at least 1 language

---

## 📝 What to Do After Testing

### If All Tests Pass:
1. Review generated outputs
2. Check video quality
3. Verify translations are accurate
4. Proceed with merge to master

### Merging to Master:
```bash
# Switch to master branch
cd /home/dachu/Documents/projects/content-engine
git checkout master

# Merge tiktok-multilingual branch
git merge feature/tiktok-multilingual

# Resolve any conflicts
# Install dependencies
cd packages/backend && npm install

# Test in master branch
npm run dev

# Commit and push
git push origin master
```

---

## 🆘 Need Help?

If you encounter issues:
1. Check the error messages carefully
2. Review the troubleshooting section above
3. Verify all API keys are correct
4. Try with a different/shorter video
5. Check that all dependencies are installed

---

## 📚 Additional Resources

- **Moment Analyzer Docs:** `/packages/backend/src/services/tiktok/MOMENT-ANALYZER.md`
- **API Documentation:** `/TIKTOK-API-DOCUMENTATION.md`
- **Implementation Summary:** `/IMPLEMENTATION-SUMMARY.md`

---

**Good luck with testing! 🚀**
