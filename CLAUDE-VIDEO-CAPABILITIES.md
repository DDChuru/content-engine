# Claude Code - Video Capabilities Reference

Quick reference for what Claude Code can do with videos.

---

## 🎬 Native Video Capabilities

### 1. Watch & Analyze Videos
- ✅ Analyze video content (I'm multimodal)
- ✅ Identify scenes and key moments
- ✅ Describe what's happening
- ✅ Extract timestamps for chapters
- ✅ Generate descriptions, titles, tags
- ✅ Identify quality issues
- ✅ Suggest improvements

### 2. Video Editing (FFmpeg)
- ✅ Trim/cut unwanted sections
- ✅ Merge multiple videos
- ✅ Extract audio tracks
- ✅ Add subtitles/captions
- ✅ Convert formats (MP4, WebM, MOV, etc.)
- ✅ Resize/crop (change resolution, aspect ratio)
- ✅ Speed up/slow down
- ✅ Add watermarks/logos
- ✅ Color correction (brightness, contrast, saturation)
- ✅ Audio mixing (background music, normalization)
- ✅ Create GIFs from video segments
- ✅ Extract specific frames

### 3. Video Scripts & Storyboards
- ✅ Write scene-by-scene breakdowns
- ✅ Create shot lists with camera angles
- ✅ Generate voiceover scripts with timing
- ✅ Suggest B-roll footage
- ✅ Plan music cues
- ✅ Design graphics/text overlay timing

### 4. Video Processing Automation
- ✅ Batch process multiple videos
- ✅ Normalize audio across videos
- ✅ Add intro/outro automatically
- ✅ Generate thumbnails
- ✅ Create upload scripts
- ✅ Build complete workflows

### 5. Frame Analysis
- ✅ Extract frames at intervals
- ✅ Analyze frames visually
- ✅ Identify best thumbnail candidates
- ✅ Detect scene changes
- ✅ Find specific moments

### 6. Image Sequences → Video
- ✅ Create slideshow videos
- ✅ Stop motion sequences
- ✅ Timelapse videos
- ✅ Animated presentations

### 7. Audio Enhancement
- ✅ Remove background noise
- ✅ Normalize audio levels
- ✅ Add background music
- ✅ Silence detection
- ✅ Audio ducking (lower music during speech)

### 8. Subtitles & Captions
- ✅ Create SRT/VTT files
- ✅ Burn subtitles into video
- ✅ Multi-language support
- ✅ Custom styling and positioning

---

## 🚫 What I Cannot Do (Without External Tools)

- ❌ Native video rendering from scratch (need Remotion/After Effects)
- ❌ 3D animation (need Blender/Cinema 4D)
- ❌ AI avatar generation (need Synthesia/D-ID)
- ❌ Advanced motion tracking (need specialized software)
- ❌ Real-time video recording (need OBS/screen capture)

---

## 🔧 Integration Capabilities

### Voice & Audio
- ✅ **ElevenLabs** - Voice cloning, multilingual TTS (29+ languages)
- ✅ **OpenAI Whisper** - Transcription
- ✅ **OpenAI TTS** - Text-to-speech
- ✅ **FFmpeg** - Audio processing

### Translation
- ✅ **Google Cloud Translation** - 130+ languages, best for African languages
- ✅ **DeepL** - Best quality for European languages (32 languages)
- ⚠️ **Native Claude** - Good for major languages, unreliable for low-resource languages

### Image & Visual
- ✅ **DALL-E 3** - Scene generation
- ✅ **Google Gemini** - Image generation
- ✅ **Excalidraw** - Diagrams
- ✅ **Mermaid** - Technical diagrams

### Video Rendering
- ✅ **Remotion** - Programmatic video creation (React-based)
- ✅ **FFmpeg** - Video processing and editing
- ✅ **Puppeteer** - Screenshot/diagram rendering

---

## 🎯 Common Use Cases

### 1. Clean Up Recordings
**Input:** Raw 45-min tutorial with mistakes
**Output:** Polished video with cuts, fixed audio, captions

### 2. Create TikTok Shorts from Long Video
**Input:** 1-hour YouTube video
**Output:** 10 vertical short clips (9:16) with captions

### 3. Batch Process Videos
**Input:** 50 raw videos
**Output:** Standardized videos with intro/outro, normalized audio, thumbnails

### 4. Fix Video Quality Issues
**Input:** Video with quiet audio, washed-out colors
**Output:** Fixed video with normalized audio, color correction

### 5. Multilingual Video Generation
**Input:** English script
**Output:** Same video in 4+ languages (translated, voiced, subtitled)

### 6. Extract Highlights
**Input:** Long webinar recording
**Output:** 5 highlight clips for social media

### 7. Add Professional Branding
**Input:** Simple screen recording
**Output:** Video with branded intro/outro, watermarks, captions

---

## 💰 Cost Estimates

### Per Video (Multilingual Production)

| Service | Cost |
|---------|------|
| Google Translate (10K chars) | $0.20 |
| ElevenLabs TTS (10K chars) | $3.00 |
| DALL-E 3 Images (15 scenes) | $0.60 |
| Remotion Rendering (local) | $0.00 |
| **Total** | **~$4** per language |

### Scaling Example
- 1 YouTube video → 10 TikToks → 4 languages
- = 40 pieces of content
- Cost: ~$16 total
- **$0.40 per video**

---

## 🚀 Recommended Tech Stack

### For Maximum Flexibility
```
Content Generation: Claude API
Translation: Google Cloud Translate
Voice: ElevenLabs (voice cloning)
Images: DALL-E 3 or Gemini
Video Rendering: Remotion
Video Editing: FFmpeg
Subtitles: Built-in (SRT generation)
```

### For Budget-Conscious
```
Content Generation: Claude API
Translation: Native Claude (major languages only)
Voice: OpenAI TTS
Images: Gemini (cheaper than DALL-E)
Video Rendering: Remotion
Video Editing: FFmpeg
```

---

## 📋 Quick Command Reference

### Extract Audio
```bash
ffmpeg -i video.mp4 -vn -acodec copy audio.aac
```

### Convert to Vertical (TikTok)
```bash
ffmpeg -i input.mp4 -vf "crop=ih*(9/16):ih,scale=1080:1920" vertical.mp4
```

### Add Subtitles
```bash
ffmpeg -i video.mp4 -vf subtitles=subs.srt output.mp4
```

### Normalize Audio
```bash
ffmpeg -i video.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11" normalized.mp4
```

### Create GIF
```bash
ffmpeg -i video.mp4 -vf "fps=10,scale=480:-1" -t 3 output.gif
```

### Merge Videos
```bash
# Create list.txt with: file 'video1.mp4' ...
ffmpeg -f concat -i list.txt -c copy merged.mp4
```

### Extract Frames
```bash
ffmpeg -i video.mp4 -vf fps=1 frame_%04d.png
```

---

## 🎬 Integration Patterns

### Pattern 1: YouTube → TikTok
```
1. Analyze YouTube video
2. Identify 10 best moments (timestamps)
3. Extract clips with FFmpeg
4. Convert to vertical format
5. Add captions
6. Export 10 TikTok videos
```

### Pattern 2: Multilingual Video
```
1. Generate English script
2. Translate to target languages (Google)
3. Generate voiceover (ElevenLabs with your voice)
4. Create subtitles for each language
5. Render videos (Remotion)
6. Export one video per language
```

### Pattern 3: AI Video from Scratch
```
1. Generate storyboard (Claude)
2. Generate scene images (DALL-E)
3. Generate narration (ElevenLabs)
4. Compose video (Remotion)
5. Add subtitles
6. Export final MP4
```

### Pattern 4: Batch Content Creation
```
1. Generate 30 scripts (Claude)
2. Translate each to 4 languages
3. Generate voiceovers (ElevenLabs)
4. Render 30 × 4 = 120 videos
5. Auto-upload to YouTube/TikTok
```

---

## 📞 API Keys Needed

### Required
- `ANTHROPIC_API_KEY` - Claude (content generation)

### Optional (Based on Features)
- `ELEVENLABS_API_KEY` - Voice cloning/TTS
- `OPENAI_API_KEY` - DALL-E, Whisper, TTS
- `GOOGLE_CLOUD_API_KEY` - Translation, Gemini
- `DEEPL_API_KEY` - Premium translation

---

## 🎯 Next Steps

1. Clone your voice with ElevenLabs
2. Set up Google Cloud Translation
3. Build multilingual video pipeline
4. Create TikTok → YouTube funnel
5. Automate content generation

---

**Last Updated:** 2025-10-24
