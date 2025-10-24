# Testing the Educational Content Pipeline

**Status:** Ready to test!
**Date:** 2025-10-24

---

## Prerequisites

1. **Environment Variables** - Add to `.env` in project root:
```bash
# AI Services
ANTHROPIC_API_KEY=your_claude_key
GEMINI_API_KEY=your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Optional
GITHUB_TOKEN=your_github_token
FRONTEND_URL=http://localhost:3000
PORT=3001
```

2. **Backend Running:**
```bash
cd packages/backend
npm run dev
```

---

## Test 1: Manim Rendering (No Voice)

Test that Manim can generate circle theorem animations.

```bash
curl -X POST http://localhost:3001/api/education/test-manim \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Manim test successful",
  "videoPath": "media/videos/.../AngleatCentreTheorem.mp4"
}
```

**Check Output:**
```bash
# Video should be at the returned path
ls media/videos/*/480p15/*.mp4
```

---

## Test 2: Voice Cloning

Clone your voice from audio samples for use in lessons.

### Option A: Record Audio Samples

1. **Record yourself speaking** (total 60+ seconds):
   - Sample 1 (20s): "Welcome to this mathematics lesson on circle theorems..."
   - Sample 2 (20s): "Today we will explore the relationship between angles..."
   - Sample 3 (20s): "Let's work through some examples to deepen our understanding..."

2. **Save as MP3 files**: `sample1.mp3`, `sample2.mp3`, `sample3.mp3`

### Option B: Use Test Audio

For quick testing, you can use any MP3 audio of yourself speaking (minimum 60 seconds total).

### Clone Voice:

```bash
curl -X POST http://localhost:3001/api/education/clone-voice \
  -F "audio=@sample1.mp3" \
  -F "audio=@sample2.mp3" \
  -F "audio=@sample3.mp3" \
  -F "name=My Teaching Voice"
```

**Expected Response:**
```json
{
  "success": true,
  "voiceId": "abc123xyz...",
  "name": "My Teaching Voice",
  "message": "Voice cloned successfully"
}
```

**IMPORTANT:** Save the `voiceId` - you'll need it for the next steps!

---

## Test 3: List Available Voices

```bash
curl http://localhost:3001/api/education/voices
```

**Expected Response:**
```json
{
  "success": true,
  "voices": [
    {
      "voiceId": "abc123xyz...",
      "name": "My Teaching Voice",
      "category": "cloned"
    }
  ]
}
```

---

## Test 4: Test Your Cloned Voice

Replace `VOICE_ID` with your actual voice ID from Test 2:

```bash
curl -X POST http://localhost:3001/api/education/test-voice \
  -H "Content-Type: application/json" \
  -d '{"voiceId": "VOICE_ID"}' \
  --output test-voice.mp3
```

**Listen to the result:**
```bash
# On Linux
xdg-open test-voice.mp3

# On Mac
open test-voice.mp3

# Or just open the file in your audio player
```

**You should hear:** Your cloned voice saying a test message!

---

## Test 5: Generate Circle Theorem Demo (FULL PIPELINE!)

This tests the complete pipeline: Manim + Your Voice + Multiple Scenes

Replace `VOICE_ID` with your voice ID:

```bash
curl -X POST http://localhost:3001/api/education/circle-theorem-demo \
  -H "Content-Type: application/json" \
  -d '{"voiceId": "VOICE_ID"}'
```

**Expected Response:**
```json
{
  "success": true,
  "result": {
    "title": "Circle Theorem: Angle at Centre",
    "scenes": 3,
    "duration": 55,
    "cost": 0.15,
    "sceneDetails": [
      {
        "id": 1,
        "title": "Introduction",
        "type": "gemini",
        "visual": "output/education/images/Introduction_*.png",
        "audio": "output/education/audio/scene_1.mp3",
        "duration": 10
      },
      {
        "id": 2,
        "title": "Angle at Centre Theorem",
        "type": "manim",
        "visual": "media/videos/.../AngleatCentreTheorem.mp4",
        "audio": "output/education/audio/scene_2.mp3",
        "duration": 25
      },
      {
        "id": 3,
        "title": "Worked Example",
        "type": "manim",
        "visual": "media/videos/.../WorkedExample.mp4",
        "audio": "output/education/audio/scene_3.mp3",
        "duration": 20
      }
    ]
  },
  "message": "Circle theorem demo generated successfully!"
}
```

---

## Verify Generated Content

### Check Manim Animations:
```bash
# List all generated Manim videos
find media/videos -name "*.mp4" -mtime -1

# Play a video (Linux)
vlc media/videos/*/480p15/AngleatCentreTheorem.mp4
```

### Check Voice Narrations:
```bash
# List generated narrations
ls -lh output/education/audio/

# Play narration
vlc output/education/audio/scene_2.mp3
```

### Check Gemini Images:
```bash
# List generated images
ls -lh output/education/images/

# View image
eog output/education/images/Introduction_*.png
```

---

## Troubleshooting

### Error: "ElevenLabs API key is required"
**Solution:** Add `ELEVENLABS_API_KEY` to `.env` file

Get your key from: https://elevenlabs.io → Profile → API Keys

### Error: "Manim command not found"
**Solution:** Check conda environment is activated:
```bash
/home/dachu/miniconda3/envs/aitools/bin/manim --version
```

### Error: "Voice cloning validation failed: Audio too short"
**Solution:** Provide at least 60 seconds of total audio across all samples

### Error: "Gemini image generation failed"
**Solution:** Check `GEMINI_API_KEY` is valid and has credit

### Error: "Module not found: @elevenlabs/elevenlabs-js"
**Solution:** Install the package:
```bash
cd packages/backend
npm install @elevenlabs/elevenlabs-js
```

---

## Expected Costs

### Per Circle Theorem Module (3 scenes, ~55 seconds):

| Component | Cost |
|-----------|------|
| Manim animations (2 scenes) | FREE |
| Gemini image (1 scene) | $0.01 |
| ElevenLabs narration (~300 chars × 3) | $0.27 |
| **Total** | **~$0.28** |

### For Complete 10-Module Course:
- 10 modules × $0.28 = **~$2.80**
- Professional animations ✓
- YOUR voice throughout ✓
- Ready for LMS ✓

---

## Next Steps After Testing

Once all tests pass:

1. **Generate Full Module:**
   - Use POST `/api/education/generate-module`
   - Provide complete module structure
   - Include your voiceId

2. **Integrate with Remotion:**
   - Combine all scenes into final video
   - Add transitions and overlays
   - Render complete MP4

3. **Package for SCORM:**
   - Create SCORM manifest
   - Bundle videos + tracking
   - Export as .zip for LMS

4. **Deploy to LMS:**
   - Upload SCORM package
   - Test tracking
   - Assign to students

---

## Success Criteria

✅ Manim renders circle theorem animation
✅ Voice successfully cloned (60+ seconds)
✅ Cloned voice sounds natural
✅ Demo generates 3 scenes
✅ Manim videos are high quality
✅ Narrations sync with concepts
✅ Total cost under $0.30 per module

**If all tests pass: You have a working educational content pipeline! 🎉**

---

## Quick Test Script

Run all tests in sequence:

```bash
#!/bin/bash

echo "🧪 Testing Educational Content Pipeline"
echo ""

echo "Test 1: Manim rendering..."
curl -s -X POST http://localhost:3001/api/education/test-manim \
  -H "Content-Type: application/json" | jq '.success'

echo ""
echo "Test 2: List voices..."
curl -s http://localhost:3001/api/education/voices | jq '.voices'

echo ""
echo "⚠️  Manual step required:"
echo "    1. Clone your voice using Test 2"
echo "    2. Get voiceId from response"
echo "    3. Run Test 5 with your voiceId"
echo ""
echo "Example:"
echo "curl -X POST http://localhost:3001/api/education/circle-theorem-demo \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"voiceId\": \"YOUR_VOICE_ID\"}'"
```

Save as `test-pipeline.sh` and run:
```bash
chmod +x test-pipeline.sh
./test-pipeline.sh
```

---

**Ready to test? Start with Test 1! 🚀**
