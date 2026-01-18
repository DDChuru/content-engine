# Complete Video Production Pipeline
## Remotion + OBS + AI Video + Editing

This guide shows you how to create professional training videos using ALL available tools.

---

## 🎬 The Complete Stack

### Tools You'll Use:

1. **Remotion** - Programmatic intro/outro/graphics
2. **OBS Studio** - Live recording with annotations
3. **AI Services** (Optional) - Synthesia, ElevenLabs TTS, etc.
4. **FFmpeg** - Video editing, cutting, joining
5. **Your Backend** - AI content generation

---

## 📽️ Real-World Example: "Temperature Monitoring Training"

Let's build a 10-minute training video using everything:

### **Video Structure:**

```
00:00 - 00:03  │ Remotion Intro (branded)
00:03 - 00:10  │ AI Avatar Introduction (Synthesia)
00:10 - 02:00  │ OBS: You presenting overview slides
02:00 - 03:00  │ Remotion: Animated process diagram
03:00 - 06:00  │ OBS: Live demonstration with annotations
06:00 - 07:00  │ Screen recording: Software walkthrough
07:00 - 08:30  │ OBS: Q&A / Common mistakes
08:30 - 09:00  │ Remotion: Summary animation
09:00 - 09:30  │ AI Avatar: Closing remarks
09:30 - 10:00  │ Remotion Outro (CTA)
```

---

## 🛠️ Step-by-Step Production

### **PHASE 1: Generate Content (AI Backend)**

```bash
# Generate all content structure with Claude
curl -X POST http://localhost:3001/api/generate/training-package \
  -d '{
    "topic": "Temperature Monitoring",
    "duration": 10,
    "includeDemo": true
  }'

# Response:
{
  "slides": [...],           # Presentation slides
  "script": "...",           # Full voiceover script
  "diagram": {...},          # Process diagram data
  "demoSteps": [...],        # Step-by-step demo
  "summary": [...]           # Key points
}
```

---

### **PHASE 2: Create Individual Segments**

#### **Segment 1: Branded Intro (Remotion)**

```bash
cd remotion-branding

# Render custom intro
remotion render src/index.ts Intro out/01-intro.mp4 \
  --props='{
    "title": "Temperature Monitoring",
    "subtitle": "Food Safety Training Module",
    "brandColor": "#0ea5e9"
  }'
```

**Output:** `01-intro.mp4` (3 seconds)

---

#### **Segment 2: AI Avatar Welcome (Optional)**

**Option A: Use Synthesia**

```bash
# API call to Synthesia
curl -X POST https://api.synthesia.io/v2/videos \
  -H "Authorization: Bearer $SYNTHESIA_KEY" \
  -d '{
    "input": [{
      "avatarSettings": {
        "voice": "professional-female"
      },
      "scriptText": "Welcome to this training on temperature monitoring..."
    }]
  }'

# Download result
# Output: 02-ai-intro.mp4
```

**Option B: Skip this, use OBS instead**

---

#### **Segment 3: Main Presentation (OBS)**

```bash
# 1. Open generated slides in browser
xdg-open presentation.html

# 2. Start OBS
# 3. Window Capture: Browser
# 4. Record yourself presenting (1-2 minutes)
# 5. Stop recording

# Output: 03-presentation.mp4
```

---

#### **Segment 4: Animated Diagram (Remotion)**

Create a custom Remotion component for complex animations:

```typescript
// src/ProcessDiagram.tsx
export const ProcessDiagram = ({ steps }) => {
  // Animated flowchart showing temperature monitoring process
  return (
    <AbsoluteFill>
      {/* Step 1: Calibrate - animate in */}
      <Sequence from={0} durationInFrames={60}>
        <Step icon="🌡️" text="Calibrate Thermometer" />
      </Sequence>

      {/* Arrow connecting steps */}
      <Sequence from={30} durationInFrames={30}>
        <Arrow from="step1" to="step2" />
      </Sequence>

      {/* Step 2: Measure */}
      <Sequence from={60} durationInFrames={60}>
        <Step icon="📊" text="Take Reading" />
      </Sequence>

      {/* Continue for all steps... */}
    </AbsoluteFill>
  );
};
```

```bash
# Render diagram
remotion render src/index.ts ProcessDiagram out/04-diagram.mp4
```

**Output:** `04-diagram.mp4` (1 minute)

---

#### **Segment 5: Live Demo (OBS + Screen Recording)**

```bash
# 1. Open software/app
# 2. OBS: Screen Capture mode
# 3. Record demonstration with your voice
# 4. Draw annotations in real-time
# 5. Stop recording

# Output: 05-demo.mp4 (3 minutes)
```

---

#### **Segment 6: Screen Recording (No voice - add later)**

```bash
# Record screen without talking
# OBS or use:
ffmpeg -f x11grab -s 1920x1080 -i :0.0 out/06-screen-recording.mp4
```

**Output:** `06-screen-recording.mp4`

---

#### **Segment 7: Q&A Section (OBS)**

```bash
# Record yourself addressing common questions
# Output: 07-qa.mp4
```

---

#### **Segment 8: Summary Animation (Remotion)**

```bash
# Render summary with key points
remotion render src/index.ts Summary out/08-summary.mp4 \
  --props='{
    "keyPoints": [
      "Calibrate daily",
      "Record all readings",
      "Report deviations immediately"
    ]
  }'
```

**Output:** `08-summary.mp4`

---

#### **Segment 9: AI Avatar Closing (Optional)**

```bash
# Generate closing with Synthesia or skip
```

---

#### **Segment 10: Outro (Remotion)**

```bash
remotion render src/index.ts Outro out/10-outro.mp4 \
  --props='{
    "title": "Great Job!",
    "callToAction": "Complete the quiz to finish",
    "contactInfo": "Questions? training@company.com"
  }'
```

**Output:** `10-outro.mp4` (5 seconds)

---

### **PHASE 3: Edit & Combine**

#### **Step 1: Review All Segments**

```bash
# List all segments
ls -lh out/
# 01-intro.mp4
# 02-ai-intro.mp4 (optional)
# 03-presentation.mp4
# 04-diagram.mp4
# 05-demo.mp4
# 06-screen-recording.mp4
# 07-qa.mp4
# 08-summary.mp4
# 09-ai-closing.mp4 (optional)
# 10-outro.mp4
```

#### **Step 2: Cut/Trim Individual Segments**

```bash
# Trim silent parts from OBS recordings
ffmpeg -i out/03-presentation.mp4 -ss 00:00:05 -to 00:01:50 \
  out/03-presentation-trimmed.mp4

# Cut mistakes from demo
ffmpeg -i out/05-demo.mp4 -ss 00:00:10 -to 00:02:45 \
  out/05-demo-trimmed.mp4

# Remove long pauses
ffmpeg -i out/07-qa.mp4 -ss 00:00:03 -to 00:01:25 \
  out/07-qa-trimmed.mp4
```

#### **Step 3: Create Transitions (Optional)**

```bash
# Add fade transitions between segments
# Using FFmpeg xfade filter

ffmpeg -i out/01-intro.mp4 -i out/03-presentation-trimmed.mp4 \
  -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=2.5[v]" \
  -map "[v]" out/intro-to-presentation.mp4
```

#### **Step 4: Combine All Segments**

**Create file list:**

```bash
# Create segments.txt
cat > segments.txt << EOF
file 'out/01-intro.mp4'
file 'out/03-presentation-trimmed.mp4'
file 'out/04-diagram.mp4'
file 'out/05-demo-trimmed.mp4'
file 'out/06-screen-recording.mp4'
file 'out/07-qa-trimmed.mp4'
file 'out/08-summary.mp4'
file 'out/10-outro.mp4'
EOF
```

**Concatenate:**

```bash
# Simple concat (fast, no re-encoding)
ffmpeg -f concat -safe 0 -i segments.txt -c copy out/final-raw.mp4

# OR with re-encoding (slower, better quality)
ffmpeg -f concat -safe 0 -i segments.txt \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  out/final-reencoded.mp4
```

---

### **PHASE 4: Post-Production Polish**

#### **Add Background Music**

```bash
# Add subtle background music to entire video
ffmpeg -i out/final-raw.mp4 -i background-music.mp3 \
  -filter_complex "[1:a]volume=0.1[music];[0:a][music]amix=inputs=2[a]" \
  -map 0:v -map "[a]" \
  out/final-with-music.mp4
```

#### **Add Subtitles/Captions (Accessibility)**

```bash
# Generate subtitles from audio
# Use Whisper AI or similar

# Apply subtitles
ffmpeg -i out/final-with-music.mp4 -vf subtitles=captions.srt \
  out/final-with-captions.mp4
```

#### **Color Correction**

```bash
# Adjust brightness/contrast/saturation
ffmpeg -i out/final-with-captions.mp4 \
  -vf "eq=brightness=0.05:contrast=1.1:saturation=1.2" \
  out/final-color-corrected.mp4
```

#### **Normalize Audio Levels**

```bash
# Ensure consistent volume throughout
ffmpeg -i out/final-color-corrected.mp4 \
  -af "loudnorm=I=-16:LRA=11:TP=-1.5" \
  out/final-audio-normalized.mp4
```

#### **Add Watermark (Optional)**

```bash
# Add logo watermark in corner
ffmpeg -i out/final-audio-normalized.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:10" \
  out/final-watermarked.mp4
```

---

### **PHASE 5: Export for Different Platforms**

#### **YouTube (High Quality)**

```bash
ffmpeg -i out/final-watermarked.mp4 \
  -c:v libx264 -preset slow -crf 18 \
  -c:a aac -b:a 192k \
  -pix_fmt yuv420p \
  out/FINAL-YOUTUBE.mp4
```

#### **Social Media (Compressed)**

```bash
# Instagram/Twitter - smaller file
ffmpeg -i out/final-watermarked.mp4 \
  -c:v libx264 -preset fast -crf 28 \
  -vf "scale=1280:720" \
  -c:a aac -b:a 128k \
  out/FINAL-SOCIAL.mp4
```

#### **Internal Training Platform (Balanced)**

```bash
ffmpeg -i out/final-watermarked.mp4 \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 160k \
  out/FINAL-INTERNAL.mp4
```

---

## 🤖 Fully Automated Pipeline

### **Option 1: Semi-Automated**

```bash
#!/bin/bash
# automated-video-pipeline.sh

TOPIC="Temperature Monitoring"

# 1. Generate content with AI
echo "Generating content..."
CONTENT=$(curl -s -X POST http://localhost:3001/api/generate/training \
  -d "{\"topic\": \"$TOPIC\"}")

# 2. Render Remotion intro
echo "Rendering intro..."
cd remotion-branding
remotion render src/index.ts Intro ../out/01-intro.mp4 \
  --props="{\"title\": \"$TOPIC\"}"

# 3. YOU RECORD: Main content with OBS
echo "⏸️  PAUSE: Record main content with OBS"
echo "Save as: out/03-main.mp4"
read -p "Press Enter when recording is complete..."

# 4. Render Remotion outro
echo "Rendering outro..."
remotion render src/index.ts Outro ../out/10-outro.mp4

# 5. Combine
echo "Combining videos..."
cd ..
ffmpeg -f concat -safe 0 -i <(
  echo "file 'out/01-intro.mp4'"
  echo "file 'out/03-main.mp4'"
  echo "file 'out/10-outro.mp4'"
) -c copy out/FINAL.mp4

echo "✅ Video complete: out/FINAL.mp4"
```

### **Option 2: Fully Automated (No OBS)**

```bash
#!/bin/bash
# fully-automated-pipeline.sh

# 1. Generate everything with AI
CONTENT=$(curl -s -X POST http://localhost:3001/api/generate/complete-video \
  -d '{"topic": "Temperature Monitoring"}')

# 2. Render intro
remotion render src/index.ts Intro out/01-intro.mp4 \
  --props="$(echo $CONTENT | jq .introProps)"

# 3. Render main content (all Remotion)
remotion render src/index.ts MainContent out/02-main.mp4 \
  --props="$(echo $CONTENT | jq .mainProps)"

# 4. Generate voiceover with TTS
curl -X POST https://api.elevenlabs.io/v1/text-to-speech \
  -d "{\"text\": \"$(echo $CONTENT | jq .script)\"}" \
  -o voiceover.mp3

# 5. Add voiceover to video
ffmpeg -i out/02-main.mp4 -i voiceover.mp3 \
  -c:v copy -c:a aac out/02-main-with-voice.mp4

# 6. Render outro
remotion render src/index.ts Outro out/03-outro.mp4

# 7. Combine
ffmpeg -f concat -safe 0 -i segments.txt -c copy out/FINAL.mp4

echo "✅ Fully automated video complete!"
```

---

## 🎯 Recommended Workflow for You

Based on your Content Engine setup:

### **Hybrid Approach (Best of Both Worlds)**

```
┌────────────────────────────────────────┐
│ 1. AI Backend generates:               │
│    - Slide content                     │
│    - Script                            │
│    - Diagrams                          │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│ 2. Remotion renders:                   │
│    - Intro (branded)                   │
│    - Complex diagrams                  │
│    - Outro (branded)                   │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│ 3. YOU record with OBS:                │
│    - Main teaching                     │
│    - Your expertise                    │
│    - Annotations                       │
│    - Your voice                        │
└────────────┬───────────────────────────┘
             ↓
┌────────────────────────────────────────┐
│ 4. FFmpeg combines:                    │
│    - All segments                      │
│    - Transitions                       │
│    - Audio mixing                      │
└────────────┬───────────────────────────┘
             ↓
         FINAL VIDEO
```

**Why this works:**
- ✅ Scalable (AI generates base)
- ✅ Professional (Remotion polish)
- ✅ Authentic (Your voice/expertise)
- ✅ Flexible (Edit as needed)

---

## 📊 Complexity vs Quality

| Approach | Time | Quality | Scalability | Personal Touch |
|----------|------|---------|-------------|----------------|
| **Pure OBS** | 1h | Good | Low | High |
| **Pure Remotion** | 4h | Excellent | High | Low |
| **Hybrid** | 2h | Excellent | Medium | High |
| **Fully Automated** | 30min | Good | Very High | None |

---

## 🚀 Start Simple, Scale Up

### Week 1-2: Learn the Basics
- Use OBS only
- Add Remotion intro/outro

### Week 3-4: Add Polish
- Learn FFmpeg basics
- Trim and cut videos
- Add transitions

### Month 2: Optimize Workflow
- Create Remotion templates
- Automate rendering
- Batch processing

### Month 3+: Full Automation
- AI generates everything
- Remotion renders all
- You just review and publish

---

## 🎬 Complete Example Script

See `examples/complete-production-example.sh` for a full working script that:
1. Generates content with AI
2. Renders Remotion segments
3. Records OBS (with pause)
4. Combines everything
5. Exports for YouTube

---

## 💡 Pro Tips

1. **Keep segments separate** - Easier to re-edit later
2. **Name files systematically** - 01-intro, 02-main, etc.
3. **Record in highest quality** - Can always compress later
4. **Save project files** - Keep all sources
5. **Test workflow with short video first** - Don't start with 1-hour content

---

Ready to build your first complete video with the full pipeline?
