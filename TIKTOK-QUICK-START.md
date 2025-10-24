# TikTok Multilingual Pipeline - Quick Start Guide

**5-Minute Setup & Testing**

## Prerequisites

```bash
# Required API Keys
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export GOOGLE_CLOUD_API_KEY="..."
export ELEVEN_LABS_API_KEY="..."
```

## Start Server

```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual
cd packages/backend
npm install
npm run dev
```

Server starts at: `http://localhost:3001`

## Quick Test

```bash
# 1. Check if API is running
curl http://localhost:3001/api/tiktok/languages | jq '.total'

# Expected: 18 (number of supported languages)
```

## Basic Workflow

### 1. Create Session (with Voice Cloning)

```bash
curl -X POST http://localhost:3001/api/tiktok/session \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "my_session",
    "voiceId": "your_elevenlabs_voice_id",
    "voiceName": "Your Name"
  }'
```

### 2. Analyze Video

```bash
curl -X POST http://localhost:3001/api/tiktok/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/your/video.mp4",
    "count": 5,
    "duration": 60
  }' | jq '.moments[] | {index, viralPotential, caption}'
```

### 3. Render Multilingual Videos

```bash
# Render moments 1, 2, 3 in English, Spanish, French
curl -X POST http://localhost:3001/api/tiktok/batch-render \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/your/video.mp4",
    "momentIndexes": [1, 2, 3],
    "languages": ["en", "es", "fr"],
    "sessionId": "my_session"
  }' | jq '{operationId, totalOperations, estimatedTime}'
```

**Save the `operationId` from response!**

### 4. Check Progress

```bash
# Replace OPERATION_ID with actual ID from step 3
curl http://localhost:3001/api/tiktok/status/OPERATION_ID | jq '{status, progress}'
```

Poll every 10 seconds until `status: "completed"`

### 5. Download Videos

```bash
# Download all videos
curl http://localhost:3001/api/tiktok/download/moment_1_en.mp4 -o moment_1_en.mp4
curl http://localhost:3001/api/tiktok/download/moment_1_es.mp4 -o moment_1_es.mp4
curl http://localhost:3001/api/tiktok/download/moment_1_fr.mp4 -o moment_1_fr.mp4
# ... and so on
```

### 6. Cleanup

```bash
curl -X DELETE http://localhost:3001/api/tiktok/cleanup/OPERATION_ID
```

## All Endpoints

```
GET    /api/tiktok/languages           - List supported languages
POST   /api/tiktok/session             - Create/update session
GET    /api/tiktok/session/:id         - Get session info
POST   /api/tiktok/analyze             - Analyze video
POST   /api/tiktok/batch-render        - Start rendering
GET    /api/tiktok/status/:id          - Check progress
GET    /api/tiktok/download/:file      - Download video
DELETE /api/tiktok/cleanup/:id         - Cleanup files
```

## Full Test Script

```bash
./test-tiktok-api.sh
```

## Supported Languages

English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Dutch, Polish, Turkish, Vietnamese, Thai, Indonesian

**Total: 18 languages**

## Cost Estimate

- **Per video:** ~$0.15-0.25
- **3 moments × 4 languages = 12 videos:** ~$1.80-3.00
- **Processing time:** ~30 seconds per video

## Common Issues

### "Voice not cloned" Error
**Solution:** Create session with valid `voiceId` first

### "Video file not found" Error
**Solution:** Use absolute path to video file

### FFmpeg Errors
**Solution:** Ensure FFmpeg is installed and in PATH

## Documentation

- **Full API Docs:** `TIKTOK-API-DOCUMENTATION.md`
- **Implementation Details:** `IMPLEMENTATION-SUMMARY.md`
- **Test Script:** `test-tiktok-api.sh`

## Support

Check logs in development mode:
```bash
NODE_ENV=development npm run dev
```

## Example Use Cases

1. **Podcast to TikTok:**
   - Analyze 60-minute podcast
   - Find 10 best moments
   - Render in 5 languages
   - = 50 TikTok videos ready to post

2. **YouTube to TikTok:**
   - Analyze 30-minute YouTube video
   - Find 5 viral moments
   - Render in 3 languages
   - = 15 TikTok videos

3. **Webinar to TikTok:**
   - Analyze 90-minute webinar
   - Find 15 key insights
   - Render in 4 languages
   - = 60 TikTok videos

## Quick Reference

| Task | Endpoint | Time |
|------|----------|------|
| Analyze 60min video | POST /analyze | ~2-3 min |
| Render 1 video | POST /batch-render | ~30 sec |
| Render 12 videos | POST /batch-render | ~6 min |
| Download video | GET /download/:file | <1 sec |

---

**Ready to go! 🚀**

Start with `./test-tiktok-api.sh` to verify everything works.
