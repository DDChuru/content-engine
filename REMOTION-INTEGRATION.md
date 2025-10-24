# Remotion Integration for Content Engine

## Overview

Instead of using OBS to record presentations, you could use **Remotion** to programmatically generate videos from your content.

---

## Current Workflow vs Remotion Workflow

### Current (Manual)
```
1. Backend generates HTML presentation
2. Open in browser
3. Manually navigate slides
4. Manually annotate with pen
5. Manually record with OBS
6. Output: MP4 video
```

**Pros:**
- ✅ Real-time annotations
- ✅ Voiceover capability
- ✅ Full manual control

**Cons:**
- ❌ Manual process (you have to present)
- ❌ Takes time to record
- ❌ Hard to batch process

### With Remotion (Automated)
```
1. Backend generates presentation data
2. Convert to Remotion React components
3. Run: remotion render
4. Output: MP4 video (automated!)
```

**Pros:**
- ✅ Fully automated
- ✅ Batch generate 100s of videos
- ✅ Programmatic animations
- ✅ Consistent quality

**Cons:**
- ❌ No voiceover (unless you add TTS)
- ❌ No manual annotations
- ❌ Less flexible than live presentation

---

## Use Cases

| Scenario | Best Tool |
|----------|-----------|
| Training videos with your voice | **OBS (current)** |
| Automated social media clips | **Remotion** |
| 100s of product demos | **Remotion** |
| Interactive presentations | **OBS (current)** |
| Marketing videos at scale | **Remotion** |
| Custom annotations/drawings | **OBS (current)** |

---

## Setting Up Remotion

### 1. Install Remotion

```bash
cd /home/dachu/Documents/projects/content-engine
npx create-video@latest remotion-videos
cd remotion-videos
npm install
```

### 2. Example: Generate SOP Video

```jsx
// src/Composition.jsx
import { useCurrentFrame, Sequence, AbsoluteFill } from 'remotion';

export const SOPVideo = ({ sopData }) => {
  const frame = useCurrentFrame();
  const fps = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      {/* Title Slide - 0-90 frames (3 seconds) */}
      <Sequence from={0} durationInFrames={90}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontSize: 60,
          fontWeight: 'bold'
        }}>
          {sopData.title}
        </div>
      </Sequence>

      {/* Step 1 - 90-180 frames (3 seconds) */}
      <Sequence from={90} durationInFrames={90}>
        <div style={{ padding: 40 }}>
          <h2>Step 1</h2>
          <p>{sopData.steps[0]}</p>
        </div>
      </Sequence>

      {/* Step 2 - 180-270 frames */}
      <Sequence from={180} durationInFrames={90}>
        <div style={{ padding: 40 }}>
          <h2>Step 2</h2>
          <p>{sopData.steps[1]}</p>
        </div>
      </Sequence>

      {/* Add more sequences for each slide */}
    </AbsoluteFill>
  );
};

export const sopConfig = {
  id: 'SOPVideo',
  component: SOPVideo,
  durationInFrames: 300, // 10 seconds at 30fps
  fps: 30,
  width: 1920,
  height: 1080,
};
```

### 3. Render Video

```bash
# Render to MP4
npm run build
remotion render src/index.ts SOPVideo out/sop-video.mp4

# With custom data
remotion render src/index.ts SOPVideo out/video.mp4 \
  --props='{"sopData": {"title": "Temperature Monitoring", "steps": [...]}}'
```

---

## Integration with Content Engine Backend

### Backend generates Remotion-compatible data:

```typescript
// packages/backend/src/services/content-generator.ts

async generateVideoData(request: GenerationRequest) {
  // Generate SOP content with Claude
  const sopContent = await this.claudeService.generateContent(...);

  // Instead of HTML, return Remotion data structure
  return {
    type: 'remotion',
    composition: 'SOPVideo',
    props: {
      title: sopContent.title,
      steps: sopContent.steps,
      duration: 10, // seconds
    },
    renderCommand: `remotion render src/index.ts SOPVideo out/${timestamp}.mp4`
  };
}
```

### Auto-render workflow:

```bash
# 1. Generate content
curl -X POST /api/generate/sop-video \
  -d '{"task": "Temperature Monitoring"}'

# Backend responds:
{
  "propsFile": "/tmp/sop-props-123.json",
  "renderCommand": "remotion render ... --props-file=/tmp/sop-props-123.json"
}

# 2. Render video (automated)
cd remotion-videos
remotion render src/index.ts SOPVideo out/sop-temp-monitoring.mp4 \
  --props-file=/tmp/sop-props-123.json

# 3. Upload to Firebase
# (Backend can do this automatically)
```

---

## Advanced: Animations with Remotion

### Spring Animations

```jsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const AnimatedTitle = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  return (
    <h1 style={{ transform: `scale(${scale})` }}>
      {title}
    </h1>
  );
};
```

### Interpolate Values

```jsx
import { interpolate } from 'remotion';

const opacity = interpolate(
  frame,
  [0, 30],      // From frame 0 to 30
  [0, 1],       // Opacity goes from 0 to 1
  { extrapolateRight: 'clamp' }
);
```

### Fade In/Out Transitions

```jsx
const fadeIn = interpolate(frame, [0, 30], [0, 1]);
const fadeOut = interpolate(frame, [60, 90], [1, 0]);
const opacity = Math.min(fadeIn, fadeOut);
```

---

## Hybrid Approach (Best of Both Worlds)

### Scenario 1: Automated Base Video + Manual Voiceover

```bash
# 1. Generate video with Remotion (no audio)
remotion render ... out/base-video.mp4

# 2. Open in OBS
# 3. Play the Remotion video
# 4. Record your voiceover on top
# 5. OBS outputs final video with your voice
```

### Scenario 2: Remotion for Intros/Outros, OBS for Main Content

```bash
# 1. Generate intro with Remotion
remotion render src/Intro.tsx out/intro.mp4

# 2. Record main content with OBS
# (your presentation with annotations)

# 3. Generate outro with Remotion
remotion render src/Outro.tsx out/outro.mp4

# 4. Concatenate videos
ffmpeg -i intro.mp4 -i main.mp4 -i outro.mp4 \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1[outv]" \
  -map "[outv]" final-video.mp4
```

---

## Text-to-Speech Integration

Add automated voiceovers:

```jsx
import { Audio } from 'remotion';

export const SOPWithVoiceover = ({ sopData, audioUrl }) => {
  return (
    <AbsoluteFill>
      {/* Visual content */}
      <div>
        <h1>{sopData.title}</h1>
        <p>{sopData.description}</p>
      </div>

      {/* Audio track */}
      <Audio src={audioUrl} />
    </AbsoluteFill>
  );
};
```

**Generate TTS audio with Google Cloud TTS or ElevenLabs:**

```bash
# Generate audio from text
curl -X POST https://texttospeech.googleapis.com/v1/text:synthesize \
  -d '{"input": {"text": "Step 1: Check temperature..."}}' \
  -o voiceover.mp3

# Use in Remotion
remotion render ... --props='{"audioUrl": "voiceover.mp3"}'
```

---

## Cost Comparison

### OBS (Current)
- **Cost:** Free
- **Time:** Manual (you present each video)
- **Scalability:** Low (1 video at a time)

### Remotion
- **Cost:** Free (open source)
- **Time:** Automated (batch render overnight)
- **Scalability:** High (render 100s of videos)

### Remotion Cloud (Paid Service)
- **Cost:** $0.05-0.20 per minute of video
- **Time:** Fully automated in cloud
- **Scalability:** Unlimited

---

## Example: Complete Integration

```javascript
// Backend: Generate video automatically
router.post('/generate/sop-video', async (req, res) => {
  // 1. Generate SOP content with Claude
  const sopContent = await contentGenerator.generate({
    type: 'sop',
    parameters: req.body
  });

  // 2. Generate voiceover with TTS
  const audioUrl = await generateVoiceover(sopContent.content);

  // 3. Trigger Remotion render
  const videoPath = await renderRemotion({
    composition: 'SOPVideo',
    props: {
      sopData: sopContent,
      audioUrl
    }
  });

  // 4. Upload to Firebase
  const videoUrl = await uploadToFirebaseStorage(videoPath);

  res.json({
    success: true,
    videoUrl,
    sopContent
  });
});
```

**Result:** Fully automated video generation pipeline!

---

## When to Use What

| Use Case | Tool | Why |
|----------|------|-----|
| Personal training videos with your voice | **OBS** | Manual control, real voiceover |
| 100 product demo videos | **Remotion** | Automation, consistency |
| Interactive live presentation | **OBS** | Real-time annotations |
| Social media clips (batch) | **Remotion** | Scale, automation |
| Custom drawn diagrams | **OBS** | Manual annotation tools |
| Data-driven videos (charts, graphs) | **Remotion** | Programmatic generation |

---

## Next Steps

1. **Try Remotion:** `npx create-video@latest`
2. **Build simple video:** Render your first composition
3. **Integrate with backend:** Pass Claude-generated data to Remotion
4. **Compare workflows:** OBS vs Remotion for your use case

**Want me to set up a basic Remotion integration for your Content Engine?**
