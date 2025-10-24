# AI Avatar Integration for Educational Videos

**Date:** 2025-10-24
**Feature:** Lip-sync avatar for narration
**Integration:** Educational content system

---

## Overview

Add AI-powered talking head avatars that lip-sync to the narration in educational videos, creating a more engaging learning experience.

---

## Service Comparison

### D-ID API (Recommended)
**Pros:**
- Cost-effective: $18/month for 16 minutes (~8-16 videos)
- Well-documented API
- Good lip-sync quality
- Quick generation (2-3 minutes per video)
- No per-video fees on paid plans

**Cons:**
- Minutes don't roll over
- Quality slightly lower than HeyGen

**Pricing:**
```
Trial:     Free (limited testing)
Build:     $18/month  - 16 minutes regular video
Pro:       $50/month  - 15 minutes + premium features
Advanced:  $300/month - 65 minutes + advanced features
```

**Cost per video (Build plan):**
- 1-minute video: $1.13
- 2-minute video: $2.25

### HeyGen API
**Pros:**
- Superior lip-sync quality
- More natural movements
- 40+ languages

**Cons:**
- More expensive: $99/month for 100 credits
- Credit system more complex

**Pricing:**
```
Free:  10 credits/month  (50 minutes streaming)
Pro:   $99/month  (100 credits = $0.99 per credit)
Scale: $330/month (660 credits = $0.50 per credit)
```

### Alternative: A2E.ai
**Pros:**
- 90% cheaper than HeyGen
- Same quality lip-sync
- No contract lock-in

**Cons:**
- Less established
- API documentation unclear

---

## Recommended Solution: D-ID API

**Why:**
1. **Cost-effective** for our 1-2 minute educational videos
2. **Simple API** - Image + Audio → Lip-synced video
3. **Good enough quality** for educational content
4. **Scalable** - Can upgrade as volume increases

---

## Architecture

```
Current Pipeline:
┌─────────────┐    ┌──────────┐    ┌─────────┐    ┌────────────┐
│ Thumbnail   │───▶│  Manim   │───▶│  Audio  │───▶│ FFmpeg     │
│ (Gemini)    │    │Animation │    │ElevenLabs    │ Combine    │
└─────────────┘    └──────────┘    └─────────┘    └────────────┘
                                                          │
                                                          ▼
                                                    Final Video


With Avatar:
┌─────────────┐    ┌──────────┐    ┌─────────┐    ┌────────────┐
│ Thumbnail   │───▶│  Manim   │───▶│  Audio  │───▶│   D-ID     │
│ (Gemini)    │    │Animation │    │ElevenLabs    │  Avatar    │
└─────────────┘    └──────────┘    └─────────┘    └────────────┘
                                          │               │
                                          │               ▼
                                          │         Lip-synced
                                          │          Avatar
                                          │               │
                                          └───────────────┴───▶ FFmpeg
                                                                Composite
                                                                   │
                                                                   ▼
                                                              Final Video
                                                              with Avatar
```

---

## Video Layout Options

### Option 1: Picture-in-Picture (Top Right)
```
┌─────────────────────────────────────┐
│                                     │
│  ┌────────────┐                    │
│  │   Avatar   │                    │
│  │  (Talking) │                    │
│  └────────────┘                    │
│                                     │
│          Manim Content              │
│     (Equations, Diagrams, etc)      │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Option 2: Split Screen
```
┌─────────────────────────────────────┐
│                                     │
│   ┌─────────┐    ┌─────────────┐  │
│   │         │    │             │  │
│   │ Avatar  │    │   Manim     │  │
│   │(Talking)│    │  Content    │  │
│   │         │    │             │  │
│   └─────────┘    └─────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Option 3: Bottom Banner
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│          Manim Content              │
│     (Equations, Diagrams, etc)      │
│                                     │
├─────────────────────────────────────┤
│  ┌────┐                             │
│  │Avtr│  Narrator: "Today we'll..." │
│  └────┘                             │
└─────────────────────────────────────┘
```

**Recommended:** Option 1 (Picture-in-Picture Top Right)
- Doesn't obscure content
- Professional look
- Easy to implement with FFmpeg
- Common in YouTube tutorials

---

## Implementation Plan

### Phase 1: D-ID Service Integration

**File:** `src/services/did-avatar.ts`

```typescript
interface AvatarConfig {
  sourceImage: string;      // Path to avatar image
  audioFile: string;        // Path to narration audio
  expression?: string;       // 'neutral', 'happy', 'serious'
  position?: 'top-right' | 'top-left' | 'bottom' | 'split';
}

interface AvatarResult {
  videoPath: string;
  duration: number;
  cost: number;
}

class DIDavatarService {
  private apiKey: string;
  private apiUrl = 'https://api.d-id.com/talks';

  async generateAvatar(config: AvatarConfig): Promise<AvatarResult> {
    // 1. Upload image to D-ID
    // 2. Upload audio to D-ID
    // 3. Create talking head video
    // 4. Poll for completion
    // 5. Download result
    // 6. Return video path
  }
}
```

### Phase 2: Video Compositing

**File:** `src/services/avatar-compositor.ts`

```typescript
interface CompositeConfig {
  mainVideo: string;        // Manim animation
  avatarVideo: string;      // D-ID lip-synced avatar
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  scale: number;            // 0.2 = 20% of main video size
}

class AvatarCompositor {
  async composite(config: CompositeConfig): Promise<string> {
    // Use FFmpeg to overlay avatar on main video
    // Example command:
    // ffmpeg -i main.mp4 -i avatar.mp4
    //   -filter_complex "[1:v]scale=iw*0.2:ih*0.2[avatar];
    //                    [0:v][avatar]overlay=W-w-10:10"
    //   -c:a copy output.mp4
  }
}
```

### Phase 3: Educational Video Generator Update

**File:** `src/agents/education/video-generator.ts`

Add avatar option to video generation:

```typescript
interface VideoGenerationConfig {
  // ... existing config ...
  avatar?: {
    enabled: boolean;
    image: string;           // Path to avatar image
    position: 'top-right' | 'top-left' | 'bottom' | 'split';
    scale: number;           // 0.15 - 0.3 (15% - 30% of screen)
  };
}

async generateModuleVideo(config: VideoGenerationConfig) {
  // ... existing code ...

  if (config.avatar?.enabled) {
    // Generate avatar video with D-ID
    const avatarVideo = await didService.generateAvatar({
      sourceImage: config.avatar.image,
      audioFile: audioPath,
      expression: 'neutral'
    });

    // Composite avatar onto main video
    finalVideo = await avatarCompositor.composite({
      mainVideo: manimVideo,
      avatarVideo: avatarVideo.videoPath,
      position: config.avatar.position,
      scale: config.avatar.scale
    });
  }
}
```

---

## Avatar Image Selection

### Option 1: Pre-made Avatar Library
Store avatar images in `assets/avatars/`:
- `professor-male.png` - Professional male teacher
- `professor-female.png` - Professional female teacher
- `student-friendly.png` - Younger, approachable look
- `expert-male.png` - Subject matter expert
- `expert-female.png` - Subject matter expert

### Option 2: AI-Generated Avatars
Use Stable Diffusion or DALL-E to generate custom avatars:
- "Professional teacher headshot, neutral expression, studio lighting"
- Generate once, reuse for all videos

### Option 3: Real Photos
- Use actual photo of instructor
- More personal connection
- Requires permission/rights

**Recommended:** Option 1 (Pre-made library) + Option 2 (AI-generated)
- Create 3-5 professional avatar images
- Generate with Gemini or DALL-E
- Store in assets folder
- Reuse across all videos

---

## API Integration Details

### D-ID API Workflow

**1. Create Talk (Generate Avatar)**
```bash
POST https://api.d-id.com/talks
Headers:
  Authorization: Basic {api_key}
  Content-Type: application/json

Body:
{
  "source_url": "https://your-server.com/avatar.jpg",
  "script": {
    "type": "audio",
    "audio_url": "https://your-server.com/narration.mp3"
  },
  "config": {
    "fluent": false,
    "pad_audio": 0,
    "stitch": true
  }
}

Response:
{
  "id": "tlk_abc123",
  "created_at": "2025-10-24T...",
  "status": "created"
}
```

**2. Check Status**
```bash
GET https://api.d-id.com/talks/{id}

Response:
{
  "id": "tlk_abc123",
  "status": "done",
  "result_url": "https://d-id-talks.s3.amazonaws.com/..."
}
```

**3. Download Result**
```bash
GET {result_url}
# Download MP4 video
```

### Cost Tracking

**Per video:**
- 1-minute video = 1 minute from quota
- 2-minute video = 2 minutes from quota

**Build plan ($18/month):**
- 16 minutes total
- ~8-16 educational videos per month
- $1.13 - $2.25 per video

---

## FFmpeg Compositing Commands

### Picture-in-Picture (Top Right)
```bash
ffmpeg -i main_video.mp4 -i avatar.mp4 \
  -filter_complex "\
    [1:v]scale=iw*0.2:ih*0.2[avatar];\
    [0:v][avatar]overlay=W-w-10:10" \
  -c:a copy -c:v libx264 -preset fast \
  output.mp4
```

### Picture-in-Picture (Top Left)
```bash
ffmpeg -i main_video.mp4 -i avatar.mp4 \
  -filter_complex "\
    [1:v]scale=iw*0.2:ih*0.2[avatar];\
    [0:v][avatar]overlay=10:10" \
  -c:a copy -c:v libx264 -preset fast \
  output.mp4
```

### Picture-in-Picture (Bottom Right with Border)
```bash
ffmpeg -i main_video.mp4 -i avatar.mp4 \
  -filter_complex "\
    [1:v]scale=iw*0.25:ih*0.25,\
    pad=iw+10:ih+10:5:5:white[avatar];\
    [0:v][avatar]overlay=W-w-10:H-h-10" \
  -c:a copy -c:v libx264 -preset fast \
  output.mp4
```

---

## Environment Variables

Add to `.env`:
```bash
# D-ID API Configuration
DID_API_KEY=your_api_key_here
DID_API_URL=https://api.d-id.com

# Avatar Configuration
AVATAR_ENABLED=true
AVATAR_DEFAULT_IMAGE=assets/avatars/professor-male.png
AVATAR_POSITION=top-right
AVATAR_SCALE=0.2
```

---

## Example API Usage

### Generate Educational Video with Avatar

```bash
POST /api/education/circle-theorem-demo-complete

Body:
{
  "avatar": {
    "enabled": true,
    "image": "professor-male",
    "position": "top-right",
    "scale": 0.2
  }
}

Response:
{
  "success": true,
  "video": {
    "path": "output/education/videos/circle_theorem_with_avatar.mp4",
    "duration": 67,
    "scenes": 3,
    "hasAvatar": true,
    "avatarCost": 1.13
  },
  "cost": {
    "thumbnail": 0.039,
    "audio": 0.20,
    "avatar": 1.13,
    "total": 1.37
  }
}
```

---

## Benefits

### For Students
- **More engaging** - Human presence increases attention
- **Personal connection** - Avatar makes content feel less robotic
- **Visual anchor** - Helps maintain focus on narration
- **Professional** - Looks like real instructor explaining

### For Content Creators
- **No camera needed** - Generate from any image
- **Consistent quality** - Same avatar every time
- **Fast production** - 2-3 minutes per video
- **Cost-effective** - $1-2 per video vs hiring actors

### For Platform
- **Differentiation** - Stand out from text-only or animation-only content
- **Scalability** - Generate hundreds of videos with same avatar
- **Flexibility** - Different avatars for different subjects/audiences
- **Professional image** - Looks like produced educational content

---

## Implementation Timeline

### Day 1: Setup (2-3 hours)
- [ ] Sign up for D-ID API
- [ ] Create avatar images (3-5 options)
- [ ] Implement `did-avatar.ts` service
- [ ] Test avatar generation with sample audio

### Day 2: Integration (3-4 hours)
- [ ] Implement `avatar-compositor.ts`
- [ ] Update `video-generator.ts` with avatar support
- [ ] Add avatar config to API endpoints
- [ ] Test end-to-end pipeline

### Day 3: Polish (2-3 hours)
- [ ] Add positioning options
- [ ] Optimize FFmpeg commands
- [ ] Add cost tracking
- [ ] Create documentation

### Day 4: Testing (2-3 hours)
- [ ] Generate test videos with different avatars
- [ ] Test different positions and scales
- [ ] Verify lip-sync quality
- [ ] Optimize performance

**Total:** 9-13 hours over 4 days

---

## Cost Analysis

### Per Video Cost Comparison

**Without Avatar:**
- Thumbnail: $0.039
- Audio: $0.20
- Total: $0.24

**With Avatar:**
- Thumbnail: $0.039
- Audio: $0.20
- Avatar (1 min): $1.13
- Total: $1.37

**Increase:** $1.13 per video (5.7x more expensive)

### Monthly Cost (Based on Volume)

**10 videos/month:**
- Without avatar: $2.40
- With avatar: $13.70
- Difference: $11.30

**50 videos/month:**
- Without avatar: $12
- With avatar: $68.50
- Difference: $56.50

**100 videos/month:**
- Without avatar: $24
- With avatar: $137
- Would need Advanced plan ($300/month) = $324/month total

---

## Alternative: Open Source Solutions

### Option: Wav2Lip (Free, Self-hosted)
**Pros:**
- Free and open source
- Good lip-sync quality
- Full control

**Cons:**
- Requires GPU for reasonable speed
- More technical setup
- Quality not as good as D-ID

**Use case:** If volume is very high (100+ videos/month)

### Option: SadTalker (Free, Self-hosted)
**Pros:**
- Better quality than Wav2Lip
- Free and open source
- More natural expressions

**Cons:**
- Requires powerful GPU
- Slower generation
- Complex setup

---

## Recommendation

**Start with D-ID API:**
1. **Build plan ($18/month)** for first month
2. Generate 8-16 test videos
3. Get user feedback on value
4. If successful, scale up to Pro plan
5. If volume >50 videos/month, consider self-hosted

**Avatar Strategy:**
- Create 3 AI-generated avatar images
- Use "professor-male" as default
- Let users choose avatar in future
- Track which avatars perform best

**Implementation Priority:**
- **High:** Picture-in-picture top-right
- **Medium:** Other position options
- **Low:** Split screen layout

---

## Next Steps

1. **Decision:** Approve D-ID API integration?
2. **Budget:** Confirm $18/month for Build plan
3. **Avatar Images:** Generate or source 3-5 avatar images
4. **Timeline:** When to start implementation?

**Ready to implement when approved!**
