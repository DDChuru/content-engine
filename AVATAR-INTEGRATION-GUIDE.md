# Avatar Integration Guide

**Purpose:** Add AI-powered lip-sync avatars to ANY video pipeline
**Status:** ✅ Production Ready
**Date:** 2025-10-24

---

## Overview

The avatar feature is a **modular, reusable utility** that can be added to any video generation pipeline in your system. It's designed as an **optional, opt-in feature** that doesn't break existing workflows.

---

## Quick Start

### 1. Basic Integration (Any Pipeline)

```typescript
import { addAvatarToVideo } from '../utils/avatar-helper.js';

// Generate your video (any method)
const videoPath = await generateYourVideo();

// Optionally add avatar
const result = await addAvatarToVideo(videoPath, {
  enabled: true,                           // Enable avatar
  avatarImage: '/path/to/avatar.png',     // Avatar image
  audioFile: '/path/to/narration.mp3',    // Audio to lip-sync
  position: 'top-right',                   // Position on screen
  scale: 0.2                               // 20% of screen size
});

console.log('Final video:', result.finalVideoPath);
console.log('Avatar cost:', result.avatarCost);
```

### 2. With Request Body Parsing

```typescript
import { parseAvatarOptions, addAvatarToVideo } from '../utils/avatar-helper.js';

router.post('/generate-video', async (req, res) => {
  // Parse avatar options from request
  const avatarOptions = parseAvatarOptions(req.body, false); // false = disabled by default

  // Generate video
  const videoPath = await yourVideoGenerator.generate();

  // Add avatar if enabled
  const result = await addAvatarToVideo(videoPath, avatarOptions);

  res.json({
    success: true,
    videoPath: result.finalVideoPath,
    hasAvatar: result.hasAvatar,
    cost: {
      video: videoGenerationCost,
      avatar: result.avatarCost,
      total: videoGenerationCost + result.avatarCost
    }
  });
});
```

### 3. With File Upload

```typescript
import { createAvatarOptionsFromUpload, addAvatarToVideo } from '../utils/avatar-helper.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate-video', upload.single('avatarImage'), async (req, res) => {
  // Generate video and audio
  const videoPath = await yourVideoGenerator.generate();
  const audioPath = '/path/to/generated/audio.mp3';

  // Create avatar options from uploaded file
  const avatarOptions = await createAvatarOptionsFromUpload(
    req.file,
    audioPath,
    {
      position: req.body.position || 'top-right',
      scale: parseFloat(req.body.scale) || 0.2
    }
  );

  // Add avatar if file was uploaded
  const result = avatarOptions
    ? await addAvatarToVideo(videoPath, avatarOptions)
    : { hasAvatar: false, finalVideoPath: videoPath, avatarCost: 0 };

  res.json({
    success: true,
    videoPath: result.finalVideoPath,
    hasAvatar: result.hasAvatar
  });
});
```

---

## Integration Examples

### Educational Videos (Manim + Gemini)

```typescript
// In your educational video generator
import { addAvatarToVideo } from '../utils/avatar-helper.js';

async function generateEducationalVideo(module: Module, options: {
  voiceId: string;
  avatar?: AvatarOptions;
}) {
  // Generate scenes (existing code)
  const scenes = await generateScenes(module, options.voiceId);

  // Combine scenes (existing code)
  const mainVideo = await combineScenes(scenes);

  // Optionally add avatar
  const result = await addAvatarToVideo(mainVideo, {
    enabled: options.avatar?.enabled || false,
    avatarImage: options.avatar?.avatarImage,
    audioFile: scenes[0].audio,  // Use first scene audio
    position: options.avatar?.position || 'top-right',
    scale: options.avatar?.scale || 0.2
  });

  return {
    videoPath: result.finalVideoPath,
    hasAvatar: result.hasAvatar,
    cost: calculateCost(scenes) + result.avatarCost
  };
}
```

### Video Director (Conversational AI)

```typescript
// In your video director agent
import { addAvatarToVideo, isAvatarAvailable } from '../utils/avatar-helper.js';

async function generateConversationalVideo(
  transcript: string,
  options: { avatar?: AvatarOptions }
) {
  // Generate speech from transcript (existing code)
  const audioPath = await textToSpeech(transcript);

  // Generate visuals (existing code)
  const videoPath = await generateVisuals();

  // Optionally add avatar
  if (options.avatar?.enabled && isAvatarAvailable()) {
    const result = await addAvatarToVideo(videoPath, {
      ...options.avatar,
      audioFile: audioPath
    });

    return {
      videoPath: result.finalVideoPath,
      hasAvatar: result.hasAvatar,
      avatarCost: result.avatarCost
    };
  }

  return {
    videoPath,
    hasAvatar: false,
    avatarCost: 0
  };
}
```

### Strategy Consultant (PowerPoint + Narration)

```typescript
// In your strategy consultant agent
import { addAvatarToVideo } from '../utils/avatar-helper.js';

async function generateStrategyPresentation(
  data: StrategyData,
  options: { avatar?: AvatarOptions }
) {
  // Generate PowerPoint (existing code)
  const slidesVideo = await generatePowerPointVideo(data);

  // Generate narration (existing code)
  const audioPath = await generateNarration(data);

  // Optionally add avatar
  const result = await addAvatarToVideo(slidesVideo, {
    enabled: options.avatar?.enabled || false,
    avatarImage: options.avatar?.avatarImage || 'assets/avatars/consultant.png',
    audioFile: audioPath,
    position: 'bottom-right',  // Different position for presentations
    scale: 0.15                 // Smaller for presentations
  });

  return {
    videoPath: result.finalVideoPath,
    hasAvatar: result.hasAvatar,
    cost: calculatePresentationCost() + result.avatarCost
  };
}
```

### Generic Video Pipeline

```typescript
// For ANY video pipeline
import { addAvatarToVideo } from '../utils/avatar-helper.js';

async function generateAnyVideo(config: VideoConfig) {
  // Your video generation logic
  const videoPath = await yourCustomPipeline(config);
  const audioPath = await yourAudioGeneration(config);

  // Add avatar if requested
  const result = await addAvatarToVideo(videoPath, {
    enabled: config.useAvatar || false,
    avatarImage: config.avatarImage,
    audioFile: audioPath,
    position: config.avatarPosition || 'top-right',
    scale: config.avatarScale || 0.2
  });

  return result.finalVideoPath;
}
```

---

## Configuration Options

### Request Body Format

**Option 1: Nested object (recommended)**
```json
{
  "avatar": {
    "enabled": true,
    "image": "/path/to/avatar.png",
    "audio": "/path/to/audio.mp3",
    "provider": "a2e",
    "quality": "high",
    "fps": 30,
    "position": "top-right",
    "scale": 0.2,
    "addBorder": true,
    "borderColor": "white"
  }
}
```

**Option 2: Flat format (also supported)**
```json
{
  "avatarEnabled": true,
  "avatarImage": "/path/to/avatar.png",
  "audioFile": "/path/to/audio.mp3",
  "avatarProvider": "a2e",
  "avatarPosition": "top-right",
  "avatarScale": 0.2
}
```

**Option 3: Disabled (default)**
```json
{
  "avatar": {
    "enabled": false
  }
}
```

### Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable/disable avatar feature |
| `avatarImage` | string | - | Path or URL to avatar image (required if enabled) |
| `audioFile` | string | - | Path to audio for lip-sync (required if enabled) |
| `provider` | string | `'a2e'` | Provider: `'a2e'`, `'heygen'`, `'infinity'` |
| `quality` | string | `'standard'` | Quality: `'standard'`, `'high'`, `'ultra'` |
| `fps` | number | `30` | Frames per second: 24, 30, or 60 |
| `position` | string | `'top-right'` | Position: `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'` |
| `scale` | number | `0.2` | Scale factor: 0.1 (10%) to 0.5 (50%) |
| `addBorder` | boolean | `true` | Add white border around avatar |
| `borderColor` | string | `'white'` | Border color (if `addBorder` is true) |

---

## Helper Functions

### `addAvatarToVideo(videoPath, options)`
Main function to add avatar to any video. Returns original video if avatar fails or is disabled.

### `parseAvatarOptions(body, defaultEnabled)`
Parse avatar options from request body. Supports both nested and flat formats.

### `createAvatarOptionsFromUpload(file, audioPath, options)`
Create avatar options from uploaded file (multer). Returns `null` if no file uploaded.

### `isAvatarAvailable(provider)`
Check if avatar feature is configured and available for given provider.

### `estimateAvatarCost(durationSeconds, provider)`
Estimate cost before generation.

### `getAvatarProviderInfo(provider)`
Get provider configuration info.

### `cleanupAvatarTemp(imagePath)`
Clean up temporary avatar files (e.g., uploaded images).

---

## Error Handling

The avatar helper is **fail-safe**. If avatar generation fails for any reason, it returns the original video without avatar:

```typescript
const result = await addAvatarToVideo(videoPath, avatarOptions);

// result.hasAvatar will be false if:
// - Avatar is disabled
// - No avatar image provided
// - API key not configured
// - Avatar generation failed
// - Compositing failed

// result.finalVideoPath will ALWAYS be a valid video path
```

---

## Cost Tracking

Every avatar operation returns cost information:

```typescript
const result = await addAvatarToVideo(videoPath, options);

console.log('Avatar cost:', result.avatarCost);
console.log('Avatar duration:', result.avatarDuration);
console.log('Has avatar:', result.hasAvatar);
```

**Example cost calculation:**
```typescript
const totalCost = {
  videoGeneration: 0.24,  // Your pipeline cost
  avatar: result.avatarCost,  // Avatar cost (if enabled)
  total: 0.24 + result.avatarCost
};
```

---

## Environment Variables

### Required (at least one)

```bash
# A2E.ai (Recommended - $9.90/month, unlimited avatars)
A2E_API_KEY=your_a2e_api_key_here

# HeyGen (Premium - $99/month, 500+ avatars)
HEYGEN_API_KEY=your_heygen_api_key_here

# Infinity AI (Free - if/when API available)
INFINITY_API_KEY=your_infinity_api_key_here
```

### Check Configuration

```typescript
import { isAvatarAvailable } from '../utils/avatar-helper.js';

if (isAvatarAvailable('a2e')) {
  console.log('A2E.ai avatar feature is available');
} else {
  console.log('A2E.ai not configured - set A2E_API_KEY in .env');
}
```

---

## Best Practices

### 1. Make it Optional

Always default to `enabled: false`:

```typescript
const avatarOptions = parseAvatarOptions(req.body, false);  // false = disabled by default
```

### 2. Fail Gracefully

Don't fail the entire request if avatar fails:

```typescript
const result = await addAvatarToVideo(videoPath, avatarOptions);
// result.finalVideoPath is ALWAYS valid, even if avatar failed
```

### 3. Check Availability

Check if feature is configured before offering it to users:

```typescript
if (isAvatarAvailable()) {
  // Show avatar option in UI
}
```

### 4. Track Costs

Always include avatar cost in response:

```typescript
res.json({
  success: true,
  cost: {
    video: videoCost,
    avatar: result.avatarCost,
    total: videoCost + result.avatarCost
  }
});
```

### 5. Clean Up

Clean up temporary files after use:

```typescript
const avatarOptions = await createAvatarOptionsFromUpload(req.file, audioPath);
const result = await addAvatarToVideo(videoPath, avatarOptions);

// Clean up temp file
await cleanupAvatarTemp(avatarOptions?.avatarImage);
```

---

## Example: Complete Integration

```typescript
import express from 'express';
import multer from 'multer';
import {
  parseAvatarOptions,
  createAvatarOptionsFromUpload,
  addAvatarToVideo,
  isAvatarAvailable,
  cleanupAvatarTemp
} from '../utils/avatar-helper.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/my-agent/generate
 * Generate video with optional avatar
 */
router.post('/generate', upload.single('avatarImage'), async (req, res) => {
  try {
    // 1. Parse request
    const { title, content } = req.body;

    // 2. Generate your video (your existing code)
    const videoPath = await myVideoGenerator.generate({ title, content });
    const audioPath = await myAudioGenerator.generate(content);

    // 3. Parse avatar options
    let avatarOptions;
    if (req.file) {
      // From uploaded file
      avatarOptions = await createAvatarOptionsFromUpload(req.file, audioPath);
    } else {
      // From request body
      avatarOptions = parseAvatarOptions(req.body, false);
    }

    // 4. Add avatar if enabled and available
    const result = await addAvatarToVideo(videoPath, {
      enabled: avatarOptions?.enabled && isAvatarAvailable(),
      ...avatarOptions
    });

    // 5. Clean up
    await cleanupAvatarTemp(avatarOptions?.avatarImage);

    // 6. Return result
    res.json({
      success: true,
      video: {
        path: result.finalVideoPath,
        hasAvatar: result.hasAvatar
      },
      cost: {
        generation: 0.50,
        avatar: result.avatarCost,
        total: 0.50 + result.avatarCost
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
```

---

## Testing

### Test Avatar Feature

```bash
# With avatar (upload file)
curl -X POST http://localhost:3001/api/my-agent/generate \
  -F "title=Test Video" \
  -F "content=Test content" \
  -F "avatarImage=@/path/to/avatar.png"

# With avatar (provide path)
curl -X POST http://localhost:3001/api/my-agent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Video",
    "content": "Test content",
    "avatar": {
      "enabled": true,
      "image": "/path/to/avatar.png",
      "position": "top-right",
      "scale": 0.2
    }
  }'

# Without avatar (disabled)
curl -X POST http://localhost:3001/api/my-agent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Video",
    "content": "Test content",
    "avatar": {
      "enabled": false
    }
  }'
```

---

## Migration Guide

### From Old Implementation

If you were using the direct avatar services:

**Before:**
```typescript
import AvatarService from '../services/avatar-service.js';
import AvatarCompositor from '../services/avatar-compositor.js';

const avatarService = new AvatarService('a2e');
const avatarResult = await avatarService.generateAvatar({...});
const compositor = new AvatarCompositor();
const final = await compositor.createPictureInPicture(...);
```

**After:**
```typescript
import { addAvatarToVideo } from '../utils/avatar-helper.js';

const result = await addAvatarToVideo(videoPath, {
  enabled: true,
  avatarImage: '/path/to/avatar.png',
  audioFile: '/path/to/audio.mp3'
});
// result.finalVideoPath has composited video
```

---

## Summary

The avatar feature is:
- ✅ **Optional** - Disabled by default, opt-in per request
- ✅ **Modular** - Works with any video pipeline
- ✅ **Fail-safe** - Returns original video if fails
- ✅ **Configurable** - Position, scale, quality, provider
- ✅ **Cost-tracked** - Returns cost for every operation
- ✅ **Multi-provider** - A2E.ai, HeyGen, Infinity AI support

**One import, one function call, done!**
