# Veo 3.1 Video Extension Guide

Complete guide for generating and extending AI videos using Google's Veo 3.1 model.

## Table of Contents

1. [Overview](#overview)
2. [Video Generation](#video-generation)
3. [Video Extension](#video-extension)
4. [API Endpoints](#api-endpoints)
5. [Cost Breakdown](#cost-breakdown)
6. [Limitations](#limitations)
7. [Examples](#examples)

---

## Overview

Veo 3.1 is Google's latest AI video generation model available via the Gemini API. It offers:

- **Initial Generation**: Create 1-8 second videos from text prompts
- **Video Extension**: Extend videos by 7 seconds per iteration, up to 20 iterations
- **Maximum Duration**: ~148 seconds total (8 initial + 20 × 7 extension)
- **Aspect Ratios**: 9:16 (TikTok), 16:9 (landscape), 1:1 (square)
- **Cost**: ~$0.20 per second of video

### Workflow Options

**Option A: Generate Only** (8 seconds max)
```
Text Prompt → Veo 3.1 → 8-second video
```

**Option B: Generate + Extend** (up to 148 seconds)
```
Text Prompt → Veo 3.1 → 8-second video → Extend → 15-second video → Extend → 22-second video...
```

---

## Video Generation

### Basic Generation

Generate a video from a text prompt.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Text description of the video |
| `duration` | number | No | 8 | Video duration in seconds (1-8) |
| `aspectRatio` | string | No | '9:16' | Video aspect ratio: '9:16', '16:9', '1:1' |
| `modelVersion` | string | No | '3.1' | Model version: '3.0' or '3.1' |
| `negativePrompt` | string | No | - | What to avoid in the video |

#### Example: Generate 8-Second TikTok Video

```typescript
import { VeoVideoGenerator } from './src/services/tiktok/veo-video-generator';

const veo = new VeoVideoGenerator(
  process.env.GOOGLE_CLOUD_API_KEY,
  process.env.GOOGLE_CLOUD_PROJECT_ID,
  '3.1'
);

const result = await veo.generateVideo({
  prompt: 'Aerial view of Victoria Falls in Zimbabwe, with mist and rainbow',
  duration: 8,
  aspectRatio: '9:16',
  modelVersion: '3.1',
});

console.log('Video URL:', result.videoUrl);
console.log('Duration:', result.duration, 'seconds');
console.log('Cost:', `$${result.cost.toFixed(4)}`);
```

#### Response Structure

```typescript
{
  videoUrl: string;           // Google Cloud Storage URL
  videoBuffer?: Buffer;       // Downloaded video data
  prompt: string;             // Original prompt
  duration: number;           // Video duration in seconds
  resolution: string;         // Video resolution (e.g., '1080x1920')
  aspectRatio: string;        // Aspect ratio used
  cost: number;               // Estimated cost in USD
  generationTime: number;     // Time taken in milliseconds
  metadata: {
    model: string;            // 'veo-3.1-generate-preview'
    timestamp: string;        // ISO timestamp
  }
}
```

---

## Video Extension

### How Extension Works

1. **Upload Video**: Your current video is uploaded to Google's file API
2. **Extension Request**: Veo 3.1 generates 7 additional seconds based on your prompt
3. **Download**: Extended video is downloaded and saved
4. **Iteration**: Repeat steps 1-3 for multiple iterations (up to 20 times)

### Extension Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `videoPath` | string | Yes* | - | Path to video file |
| `videoBuffer` | Buffer | Yes* | - | Video buffer data |
| `videoUrl` | string | Yes* | - | URL to video |
| `prompt` | string | Yes | - | Extension description |
| `extensionDuration` | number | No | 7 | Seconds to add (fixed at 7) |
| `iterations` | number | No | 1 | Number of extensions (1-20) |

*One of `videoPath`, `videoBuffer`, or `videoUrl` must be provided.

### Example: Extend by 7 Seconds (1 Iteration)

```typescript
// Load existing video
const videoBuffer = await fs.readFile('./output/my-video.mp4');

// Extend by 7 seconds
const result = await veo.extendVideo({
  videoBuffer,
  prompt: 'Continue showing Victoria Falls with closer view of the waterfall',
  iterations: 1,  // Add 7 seconds
});

console.log('Original:', result.originalDuration, 'seconds');
console.log('Extended:', result.totalDuration, 'seconds');
console.log('Cost:', `$${result.cost.toFixed(4)}`);
```

### Example: Multiple Iterations (29 Seconds Total)

```typescript
// Extend by 21 seconds (3 iterations × 7 seconds)
const result = await veo.extendVideo({
  videoPath: './output/my-video.mp4',
  prompt: 'Show the surrounding landscape and wildlife near Victoria Falls',
  iterations: 3,  // Add 21 seconds total
});

console.log('Original: 8s → Extended: 29s');
console.log('Added:', result.extensionDuration, 'seconds');
console.log('Cost:', `$${result.cost.toFixed(4)}`);
```

### Extension Response Structure

```typescript
{
  videoUrl: string;           // Final video URL
  videoBuffer?: Buffer;       // Final video data
  originalDuration: number;   // Original video duration
  extensionDuration: number;  // Total seconds added
  totalDuration: number;      // Final video duration
  iterations: number;         // Number of extensions performed
  cost: number;               // Total cost in USD
  generationTime: number;     // Total time in milliseconds
}
```

---

## API Endpoints

### POST `/api/tiktok/generate-video`

Generate AI video from text prompt.

#### Request Body

```json
{
  "prompt": "Aerial view of Victoria Falls in Zimbabwe",
  "duration": 8,
  "aspectRatio": "9:16",
  "modelVersion": "3.1",
  "negativePrompt": "blurry, low quality"
}
```

#### Response

```json
{
  "success": true,
  "video": {
    "url": "https://generativelanguage.googleapis.com/...",
    "filename": "veo-8s-1234567890.mp4",
    "path": "/path/to/output/generated/veo-8s-1234567890.mp4",
    "duration": 8,
    "resolution": "1080x1920",
    "aspectRatio": "9:16",
    "size": 3920000,
    "sizeMB": "3.74"
  },
  "metadata": {
    "prompt": "Aerial view of Victoria Falls in Zimbabwe",
    "model": "veo-3.1-generate-preview",
    "generationTime": 145000,
    "generationTimeSeconds": "145.00",
    "cost": 1.6,
    "timestamp": "2025-10-24T12:34:56.789Z"
  }
}
```

#### Error Response

```json
{
  "error": "prompt is required and must be a non-empty string"
}
```

---

### POST `/api/tiktok/extend-video`

Extend an existing video.

#### Request Body

```json
{
  "videoFilename": "veo-8s-1234567890.mp4",
  "prompt": "Continue showing Victoria Falls with closer view",
  "iterations": 1
}
```

Or with full path:

```json
{
  "videoPath": "/path/to/video.mp4",
  "prompt": "Show the surrounding landscape and wildlife",
  "iterations": 3
}
```

#### Response

```json
{
  "success": true,
  "video": {
    "filename": "veo-extended-15s-1234567890.mp4",
    "path": "/path/to/output/extended/veo-extended-15s-1234567890.mp4",
    "originalDuration": 8,
    "extensionDuration": 7,
    "totalDuration": 15,
    "iterations": 1,
    "size": 6800000,
    "sizeMB": "6.48"
  },
  "metadata": {
    "prompt": "Continue showing Victoria Falls with closer view",
    "generationTime": 152000,
    "generationTimeSeconds": "152.00",
    "cost": 1.4,
    "costPerIteration": "1.4000"
  }
}
```

#### Error Responses

```json
{
  "error": "Either videoPath or videoFilename is required"
}
```

```json
{
  "error": "Video file not found",
  "path": "/path/to/video.mp4"
}
```

```json
{
  "error": "iterations must be between 1 and 20"
}
```

---

## Cost Breakdown

### Pricing Model

Veo charges approximately **$0.20 per second** of video generated.

### Generation Costs

| Duration | Cost (USD) |
|----------|-----------|
| 1 second | $0.20 |
| 3 seconds | $0.60 |
| 5 seconds | $1.00 |
| 8 seconds | $1.60 |

### Extension Costs

Each extension adds **7 seconds** at **$1.40** per iteration.

| Iterations | Seconds Added | Cost (USD) |
|-----------|---------------|-----------|
| 1 | 7s | $1.40 |
| 2 | 14s | $2.80 |
| 3 | 21s | $4.20 |
| 5 | 35s | $7.00 |
| 10 | 70s | $14.00 |
| 20 | 140s | $28.00 |

### Example: Full Workflow Cost

**Scenario**: Generate 30-second TikTok video

```
Step 1: Generate 8-second video
Cost: $1.60

Step 2: Extend by 7 seconds (iteration 1)
Cost: $1.40
Total: 15 seconds

Step 3: Extend by 7 seconds (iteration 2)
Cost: $1.40
Total: 22 seconds

Step 4: Extend by 7 seconds (iteration 3)
Cost: $1.40
Total: 29 seconds

Step 5: Extend by 1 second (use 3-second generation)
Cost: $0.20
Total: 30 seconds

TOTAL COST: $6.00
```

### Cost Optimization Tips

1. **Use Maximum Initial Duration**: Generate 8 seconds initially (not 5 or 3)
2. **Batch Extensions**: If you need multiple versions, consider generating separate videos instead of extending
3. **Plan Ahead**: Know your target duration before starting to avoid unnecessary extensions
4. **Test with Short Videos**: Use 3-5 second videos for testing prompts

---

## Limitations

### Technical Limits

| Limit | Value |
|-------|-------|
| Initial generation | 1-8 seconds |
| Extension per iteration | 7 seconds (fixed) |
| Max iterations | 20 |
| Max total duration | ~148 seconds (8 + 140) |
| Supported aspect ratios | 9:16, 16:9, 1:1 |
| Video format | MP4 (H.264) |
| Resolution | 1080p |

### API Limits

- **Rate Limits**: Subject to Google Cloud quotas
- **File Upload Size**: 2GB max for extension uploads
- **Generation Time**: ~2-3 minutes per video
- **Extension Time**: ~2-3 minutes per iteration

### Quality Considerations

1. **Consistency**: Extended videos may have slight quality variations between segments
2. **Prompt Clarity**: Be specific about what should continue in extension prompts
3. **Context**: Extension prompts should reference the original content
4. **Transitions**: Veo attempts smooth transitions but results may vary

### Known Issues

1. **Extension Limitations**: Cannot extend videos not generated by Veo
2. **Model Access**: Requires Veo preview access from Google
3. **Cost Tracking**: Costs are estimated, actual charges may vary slightly
4. **Storage**: Videos are temporarily stored on Google servers, then downloaded

---

## Examples

### Example 1: Tourism TikTok

Generate a 29-second tourism video for Victoria Falls.

```typescript
// Step 1: Generate initial video
const initial = await veo.generateVideo({
  prompt: 'Aerial drone view of Victoria Falls in Zimbabwe, morning light creating rainbow in mist',
  duration: 8,
  aspectRatio: '9:16',
});

// Step 2: Extend with multiple iterations
const extended = await veo.extendVideo({
  videoBuffer: initial.videoBuffer,
  prompt: 'Camera moves closer to show the massive waterfall cascading down, with lush green vegetation and wildlife visible in the surroundings',
  iterations: 3,  // Adds 21 seconds → Total: 29 seconds
});

console.log(`Created ${extended.totalDuration}s video for $${extended.cost + initial.cost}`);
// Output: Created 29s video for $6.00
```

### Example 2: Product Demo

Create a 15-second product demonstration.

```typescript
// Step 1: Generate product intro
const intro = await veo.generateVideo({
  prompt: 'Modern smartphone on white background, slowly rotating to show sleek design',
  duration: 8,
  aspectRatio: '1:1',  // Square for Instagram
});

// Step 2: Extend to show features
const demo = await veo.extendVideo({
  videoBuffer: intro.videoBuffer,
  prompt: 'Zoom into screen showing colorful app interface with smooth animations',
  iterations: 1,  // Adds 7 seconds → Total: 15 seconds
});
```

### Example 3: Educational Content

Generate 60-second educational video.

```typescript
// This would cost: $1.60 + (7 × $1.40) = $11.40

const educational = await veo.generateVideo({
  prompt: 'Animated solar system with Earth and moon orbiting the sun',
  duration: 8,
  aspectRatio: '16:9',
});

const extended = await veo.extendVideo({
  videoBuffer: educational.videoBuffer,
  prompt: 'Zoom into Earth showing rotation, continents and oceans visible, then zoom further to show cloud patterns and weather systems',
  iterations: 7,  // Adds 49 seconds → Total: 57 seconds
});

// Add final 3 seconds with another small generation if needed
```

### Example 4: Using API Endpoints

Generate and extend via API calls.

```bash
# Step 1: Generate initial video
curl -X POST http://localhost:3001/api/tiktok/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Beautiful sunset over ocean waves",
    "duration": 8,
    "aspectRatio": "9:16"
  }'

# Response:
# {
#   "success": true,
#   "video": {
#     "filename": "veo-8s-1730000000.mp4",
#     ...
#   }
# }

# Step 2: Extend the video
curl -X POST http://localhost:3001/api/tiktok/extend-video \
  -H "Content-Type: application/json" \
  -d '{
    "videoFilename": "veo-8s-1730000000.mp4",
    "prompt": "Waves continue rolling in as the sun descends below the horizon",
    "iterations": 2
  }'

# Response:
# {
#   "success": true,
#   "video": {
#     "totalDuration": 22,
#     "iterations": 2,
#     ...
#   }
# }
```

---

## Testing

### Test Script: Basic Generation

```bash
cd packages/backend
npx tsx test-veo-simple.ts
```

### Test Script: Custom Duration

```bash
npx tsx test-veo-custom.ts
# Edit the file to change duration (1-8 seconds)
```

### Test Script: Extension Workflow

```bash
npx tsx test-veo-extension.ts
```

This script demonstrates:
- Initial 8-second generation
- 1-iteration extension (15 seconds total)
- 3-iteration extension (29 seconds total)
- Cost breakdown for each step

---

## Troubleshooting

### Error: "Model not found"

**Cause**: Veo 3.1 access not granted

**Solution**: Follow instructions in `GET-VEO-ACCESS.md` to request access

### Error: "Video file not found"

**Cause**: Invalid path or filename

**Solution**: Verify the video exists in `output/generated/` or provide full path

### Error: "iterations must be between 1 and 20"

**Cause**: Invalid iteration count

**Solution**: Use 1-20 iterations only. For longer videos, generate multiple separate videos

### Error: "403 Permission Denied"

**Cause**: API key doesn't have Generative Language API enabled

**Solution**: Enable the API in Google Cloud Console for your project

### Slow Generation Times

**Expected**: 2-3 minutes per generation or extension

**Tips**:
- Generation time is normal for AI video models
- Use shorter durations for testing (3-5 seconds)
- Consider batch processing multiple videos

---

## Best Practices

### Prompt Engineering

1. **Be Specific**: "Aerial view of Victoria Falls at sunrise with rainbow" > "waterfall video"
2. **Include Style**: "Cinematic drone footage" or "Close-up handheld shot"
3. **Mention Key Elements**: "with mist, rainbow, lush vegetation"
4. **Extension Continuity**: Reference original content in extension prompts

### Quality Tips

1. **Start with Best Quality**: Use detailed prompts for initial generation
2. **Consistent Style**: Keep extension prompts stylistically similar
3. **Natural Transitions**: Describe smooth movements in extension prompts
4. **Avoid Jarring Changes**: Don't drastically change scene or style mid-video

### Cost Management

1. **Test First**: Use 3-second generations to test prompts ($0.60 each)
2. **Plan Duration**: Know target length before starting
3. **Batch Wisely**: Generate multiple short videos vs extending one long video
4. **Monitor Spending**: Track costs in generation logs

---

## Additional Resources

- **Veo Overview**: `MULTILINGUAL-TIKTOK-SYSTEM.md`
- **Version Comparison**: `VEO-VERSION-GUIDE.md`
- **API Access**: `GET-VEO-ACCESS.md`
- **Quick Start**: `QUICK-START.md`

---

## Summary

✅ **Generation**: 1-8 seconds from text prompts
✅ **Extension**: Add 7 seconds per iteration, up to 20 times
✅ **Maximum Duration**: ~148 seconds total
✅ **Cost**: ~$0.20/second
✅ **API Ready**: Full REST API for frontend integration
✅ **Test Scripts**: Multiple test scripts for different scenarios

Your video extension capability is now fully integrated and ready for production use!
