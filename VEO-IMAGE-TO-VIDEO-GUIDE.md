# Veo 3.1 Image-to-Video Guide

Complete guide for generating AI videos from reference images using Google's Veo 3.1 model.

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Getting Started](#getting-started)
4. [Code Examples](#code-examples)
5. [API Usage](#api-usage)
6. [Image Requirements](#image-requirements)
7. [Prompt Engineering](#prompt-engineering)
8. [Use Cases](#use-cases)
9. [Cost & Limitations](#cost--limitations)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Veo 3.1 supports **Image-to-Video** generation, allowing you to:
- Animate static images with AI-generated motion
- Add camera movements to photographs
- Create cinematic effects from still frames
- Bring logos and graphics to life
- Generate product demonstrations from photos

### Key Benefits

✅ **Animate Existing Content**: Turn photos into dynamic videos
✅ **Control Starting Point**: Use specific images as first frames
✅ **Same Quality**: Same 1080p output as text-to-video
✅ **Same Duration**: Generate 1-8 seconds, extend up to 148 seconds
✅ **Same Cost**: ~$0.20/second, no extra charge for image input

---

## How It Works

### Process Flow

```
Reference Image → Upload to Google Files API → Veo 3.1 Generation → Animated Video
              ↘
                Text Prompt (describes desired motion/effects)
```

### Technical Steps

1. **Image Upload**: Your image is uploaded to Google's temporary storage
2. **File URI**: Upload returns a unique file identifier
3. **Generation Request**: Veo receives both image URI and text prompt
4. **Video Creation**: AI generates video starting from the image
5. **Download**: Final video is downloaded and saved locally

The image serves as a **reference** or **starting frame** for the video generation.

---

## Getting Started

### Prerequisites

- ✅ Veo 3.1 API access (see `GET-VEO-ACCESS.md`)
- ✅ Google Cloud API key configured
- ✅ Supported image formats: JPEG, PNG, GIF, WebP

### Quick Start

```typescript
import { VeoVideoGenerator } from './src/services/tiktok/veo-video-generator';

const veo = new VeoVideoGenerator(undefined, undefined, '3.1');

// Generate video from image
const result = await veo.generateVideo({
  imagePath: './my-image.jpg',
  prompt: 'Slowly zoom into the image with cinematic motion',
  duration: 8,
  aspectRatio: '9:16',
  modelVersion: '3.1',
});

console.log('Video generated:', result.videoUrl);
console.log('Used image:', result.metadata.usedReferenceImage); // true
```

---

## Code Examples

### Example 1: Local Image File

Generate video from an image on disk.

```typescript
import { VeoVideoGenerator } from './src/services/tiktok/veo-video-generator';
import { promises as fs } from 'fs';
import path from 'path';

async function animateLocalImage() {
  const veo = new VeoVideoGenerator(undefined, undefined, '3.1');

  const result = await veo.generateVideo({
    imagePath: './product-photo.jpg',
    prompt: 'Rotate the product 360 degrees showing all angles with studio lighting',
    duration: 8,
    aspectRatio: '1:1',  // Square for Instagram
    modelVersion: '3.1',
  });

  // Save video
  const outputPath = './output/product-360.mp4';
  await fs.writeFile(outputPath, result.videoBuffer!);

  console.log(`✅ Animated product video saved: ${outputPath}`);
  console.log(`💰 Cost: $${result.cost.toFixed(4)}`);
}
```

### Example 2: Image from URL

Generate video from a publicly accessible image URL.

```typescript
async function animateImageFromURL() {
  const veo = new VeoVideoGenerator(undefined, undefined, '3.1');

  const imageUrl = 'https://example.com/landscape.jpg';

  const result = await veo.generateVideo({
    imageUrl,
    prompt: 'Camera pans across the landscape from left to right, revealing mountains in the distance',
    duration: 8,
    aspectRatio: '16:9',  // Landscape
    modelVersion: '3.1',
  });

  console.log('Video URL:', result.videoUrl);
  console.log('Generation time:', (result.generationTime / 1000).toFixed(2), 'seconds');
}
```

### Example 3: Image Buffer

Generate video from an image loaded in memory.

```typescript
async function animateImageBuffer() {
  const veo = new VeoVideoGenerator(undefined, undefined, '3.1');

  // Load image from file or fetch from API
  const imageBuffer = await fs.readFile('./logo.png');

  const result = await veo.generateVideo({
    imageBuffer,
    prompt: 'Logo appears with subtle pulsing glow and particles floating around it',
    duration: 5,
    aspectRatio: '1:1',
    modelVersion: '3.1',
    negativePrompt: 'distorted, blurry, low quality',
  });

  await fs.writeFile('./output/logo-animation.mp4', result.videoBuffer!);
  console.log('✅ Logo animation created!');
}
```

### Example 4: Base64 Image (API Usage)

Send base64-encoded image via API.

```typescript
// Read image and convert to base64
const imageBuffer = await fs.readFile('./image.jpg');
const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

// Send to API
const response = await fetch('http://localhost:3001/api/tiktok/generate-video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Add dramatic zoom effect with motion blur',
    duration: 8,
    aspectRatio: '9:16',
    imageBase64,  // Image as base64 string
  }),
});

const result = await response.json();
console.log('Mode:', result.mode);  // 'image-to-video'
console.log('Video:', result.video.filename);
```

---

## API Usage

### POST `/api/tiktok/generate-video`

Generate video from image + text prompt.

#### Request Body

```json
{
  "prompt": "Camera slowly zooms into the subject with cinematic depth of field",
  "duration": 8,
  "aspectRatio": "9:16",
  "modelVersion": "3.1",
  "negativePrompt": "distorted, blurry",

  // IMAGE OPTIONS (choose one):
  "imagePath": "/path/to/image.jpg",     // Local file path
  "imageUrl": "https://example.com/img.jpg",  // Public URL
  "imageBase64": "data:image/jpeg;base64,..."  // Base64-encoded
}
```

#### Response

```json
{
  "success": true,
  "mode": "image-to-video",
  "video": {
    "url": "https://generativelanguage.googleapis.com/...",
    "filename": "veo-8s-1730000000.mp4",
    "path": "/path/to/output/generated/veo-8s-1730000000.mp4",
    "duration": 8,
    "resolution": "1080x1920",
    "aspectRatio": "9:16",
    "size": 3920000,
    "sizeMB": "3.74"
  },
  "metadata": {
    "prompt": "Camera slowly zooms into the subject...",
    "model": "veo-3.1-generate-preview",
    "generationTime": 145000,
    "generationTimeSeconds": "145.00",
    "cost": 1.6,
    "timestamp": "2025-10-24T12:34:56.789Z",
    "usedReferenceImage": true
  }
}
```

---

## Image Requirements

### Supported Formats

| Format | Extension | MIME Type | Notes |
|--------|-----------|-----------|-------|
| **JPEG** | .jpg, .jpeg | image/jpeg | Most common, good compression |
| **PNG** | .png | image/png | Supports transparency |
| **GIF** | .gif | image/gif | Static GIF only (first frame used) |
| **WebP** | .webp | image/webp | Modern format, good quality |

### Image Specifications

| Property | Recommendation | Limit |
|----------|---------------|-------|
| File Size | < 5MB | 10MB max |
| Resolution | 1080p+ recommended | Any size accepted |
| Aspect Ratio | Match target video | Will be cropped/scaled |
| Color Space | RGB | - |
| Compression | Moderate (80-90% quality) | - |

### Quality Tips

1. **Higher Resolution = Better Results**
   - Use at least 1080p images for best quality
   - Veo works better with clear, sharp images

2. **Match Aspect Ratios**
   ```
   Image: 1080×1920 (9:16) → Video: 9:16 ✅ Perfect
   Image: 1920×1080 (16:9) → Video: 9:16 ⚠️ Will crop
   ```

3. **Avoid Heavily Compressed Images**
   - JPEG quality: 80-90% recommended
   - Avoid images with compression artifacts

4. **Image Content Matters**
   - Clear subjects work best
   - Good lighting improves results
   - Complex scenes may need detailed prompts

---

## Prompt Engineering

### Effective Prompt Structure

```
[Camera Movement] + [Subject Motion] + [Effects] + [Style]
```

### Examples of Good Prompts

#### Camera Movements

```
"Slowly zoom into the subject with smooth cinematic motion"
"Camera pans from left to right revealing the full scene"
"Dramatic zoom out showing the wider context"
"Orbit around the subject showing all angles"
"Tilt up from ground to reveal the skyline"
```

#### Adding Motion

```
"Subject rotates 360 degrees with studio lighting"
"Gentle parallax effect creates depth between layers"
"Subtle breathing motion adds life to the portrait"
"Water ripples create dynamic reflections"
"Leaves rustle in a gentle breeze"
```

#### Effects & Style

```
"Add cinematic depth of field with bokeh background"
"Motion blur creates sense of speed and energy"
"Dramatic lighting changes from sunset to golden hour"
"Particles float around adding magical atmosphere"
"Rain drops fall creating atmospheric mood"
```

### Prompt Engineering Tips

✅ **DO:**
- Describe specific camera movements
- Mention the type of motion you want
- Specify effects and atmosphere
- Use cinematic terminology
- Reference the image content

❌ **DON'T:**
- Ask for drastic changes to the image
- Request content not in the original image
- Use vague terms like "make it cool"
- Contradict the image content

### Example Combinations

**Product Photography:**
```typescript
prompt: 'Smooth 360-degree rotation revealing all product angles with professional studio lighting and subtle background blur'
```

**Landscape:**
```typescript
prompt: 'Slow pan across the mountain range with clouds moving overhead and golden hour light changing gradually'
```

**Portrait:**
```typescript
prompt: 'Gentle zoom in on the subject with cinematic shallow depth of field, soft background bokeh, and natural breathing motion'
```

**Logo Animation:**
```typescript
prompt: 'Logo emerges with subtle pulsing glow, particles floating around it, and smooth rotation in 3D space'
```

---

## Use Cases

### 1. Product Marketing

**Scenario**: Animate product photos for social media ads

```typescript
const result = await veo.generateVideo({
  imagePath: './product-photos/shoe.jpg',
  prompt: 'Rotate the shoe 360 degrees showing all angles, with dramatic lighting highlighting the design details',
  duration: 8,
  aspectRatio: '1:1',  // Instagram/Facebook
});
```

**Benefits:**
- Turn static product shots into engaging videos
- Show products from multiple angles
- Add professional motion without reshoots

### 2. Historical Content

**Scenario**: Bring old photographs to life

```typescript
const result = await veo.generateVideo({
  imagePath: './historical-photos/1920s-street.jpg',
  prompt: 'Gentle pan across the vintage street scene with subtle film grain and period-appropriate motion',
  duration: 8,
  aspectRatio: '16:9',
});
```

**Benefits:**
- Animate historical archives
- Create documentaries from old photos
- Educational content with dynamic visuals

### 3. Real Estate

**Scenario**: Create property tours from still images

```typescript
const result = await veo.generateVideo({
  imagePath: './listings/living-room.jpg',
  prompt: 'Slow pan across the living room revealing the full space, with sunlight streaming through windows creating warm atmosphere',
  duration: 8,
  aspectRatio: '16:9',
});
```

**Benefits:**
- Turn photos into virtual tours
- Add cinematic feel to listings
- Generate engaging property previews

### 4. Social Media Content

**Scenario**: Create TikTok content from images

```typescript
const result = await veo.generateVideo({
  imageUrl: 'https://example.com/travel-photo.jpg',
  prompt: 'Dynamic zoom and pan showcasing the travel destination with epic cinematic movement',
  duration: 8,
  aspectRatio: '9:16',
});
```

**Benefits:**
- Repurpose photo content as video
- Higher engagement than static posts
- Easy content creation workflow

### 5. Logo & Branding

**Scenario**: Animate logos for video intros

```typescript
const result = await veo.generateVideo({
  imagePath: './brand/logo.png',
  prompt: 'Logo appears with elegant reveal animation, subtle glow effect, and professional shimmer',
  duration: 5,
  aspectRatio: '1:1',
});
```

**Benefits:**
- Professional logo animations
- Brand intro/outro videos
- Social media profile videos

---

## Cost & Limitations

### Pricing

Image-to-video costs **the same** as text-to-video:

| Duration | Cost (USD) |
|----------|-----------|
| 1 second | $0.20 |
| 3 seconds | $0.60 |
| 5 seconds | $1.00 |
| 8 seconds | $1.60 |

**Note**: No extra charge for using a reference image!

### Technical Limitations

| Aspect | Limit |
|--------|-------|
| Initial duration | 1-8 seconds |
| Maximum duration | ~148 seconds (with extensions) |
| Image file size | 10MB recommended |
| Image formats | JPEG, PNG, GIF, WebP |
| Generation time | ~2-3 minutes |

### Quality Considerations

1. **Image Quality Affects Output**
   - Low-quality images → lower-quality videos
   - Blurry images may produce blurry videos

2. **Motion is AI-Generated**
   - Results may vary from expectations
   - Complex motions may not be perfectly executed

3. **Style Consistency**
   - Veo tries to maintain image style
   - Some effects may alter the original look

4. **Content Limitations**
   - Can't add objects not in the image
   - Can't dramatically change scene composition
   - Best for adding motion/effects to existing content

---

## Troubleshooting

### Error: "Image upload failed"

**Cause**: Image file couldn't be uploaded to Google's API

**Solutions:**
1. Check image file size (keep under 10MB)
2. Verify image format (JPEG, PNG, GIF, WebP)
3. Ensure image file exists and is readable
4. Check network connection

### Error: "Failed to download image from URL"

**Cause**: Image URL is not accessible

**Solutions:**
1. Verify URL is publicly accessible
2. Check if URL requires authentication
3. Try downloading the URL in a browser first
4. Use `imagePath` or `imageBuffer` instead

### Poor Quality Output

**Cause**: Low-quality input image or vague prompt

**Solutions:**
1. Use higher-resolution images (1080p+)
2. Improve image quality before upload
3. Write more specific prompts
4. Avoid overly complex motion descriptions

### Image Not Reflected in Video

**Cause**: Veo didn't use the image properly

**Solutions:**
1. Check `metadata.usedReferenceImage` is `true`
2. Verify image uploaded successfully
3. Try simpler prompts focused on motion
4. Ensure Gemini API key is configured (required for image-to-video)

### Video Doesn't Match Prompt

**Cause**: AI interpretation differs from expectations

**Solutions:**
1. Be more specific in prompts
2. Use cinematic terminology
3. Reference the image content explicitly
4. Try multiple generations with varied prompts

---

## Best Practices

### Image Preparation

1. **Optimize Before Upload**
   ```bash
   # Resize to appropriate dimensions
   convert input.jpg -resize 1080x1920^ -gravity center -extent 1080x1920 output.jpg
   ```

2. **Check Aspect Ratio**
   ```typescript
   // Match image and video aspect ratios
   const image = await sharp('./image.jpg').metadata();
   const ratio = image.width / image.height;

   const aspectRatio = ratio > 1 ? '16:9' : '9:16';
   ```

3. **Compress Appropriately**
   - JPEG quality: 80-90%
   - PNG: Use lossy compression if needed
   - Keep file size reasonable

### Prompt Optimization

1. **Start Simple**
   ```typescript
   // Good starting point
   prompt: 'Slow zoom into the subject with smooth motion'
   ```

2. **Add Details Gradually**
   ```typescript
   // Enhanced version
   prompt: 'Slow cinematic zoom into the subject with smooth motion, dramatic lighting, and shallow depth of field'
   ```

3. **Test and Iterate**
   - Generate multiple versions
   - Compare results
   - Refine prompts based on output

### Workflow Tips

1. **Batch Processing**
   ```typescript
   const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

   for (const imagePath of images) {
     const result = await veo.generateVideo({
       imagePath,
       prompt: 'Add cinematic motion',
       duration: 8,
       aspectRatio: '9:16',
     });

     await saveVideo(result);
   }
   ```

2. **Cost Tracking**
   ```typescript
   let totalCost = 0;

   const result = await veo.generateVideo({...});
   totalCost += result.cost;

   console.log(`Total spent: $${totalCost.toFixed(2)}`);
   ```

3. **Error Handling**
   ```typescript
   try {
     const result = await veo.generateVideo({
       imagePath: './image.jpg',
       prompt: 'Add motion',
     });
   } catch (error) {
     console.error('Generation failed:', error.message);
     // Fall back to alternative or retry
   }
   ```

---

## Testing

### Test Script

Run the provided test script:

```bash
cd packages/backend
npx tsx test-veo-image-to-video.ts
```

### Test Checklist

- [ ] Local image file generation
- [ ] URL-based image generation
- [ ] Image buffer generation
- [ ] Base64 API generation
- [ ] Different aspect ratios
- [ ] Various prompt styles
- [ ] Error handling (invalid images)
- [ ] Cost tracking

---

## Additional Resources

- **Veo Overview**: `MULTILINGUAL-TIKTOK-SYSTEM.md`
- **Extension Guide**: `VEO-EXTENSION-GUIDE.md`
- **API Access**: `GET-VEO-ACCESS.md`
- **Quick Start**: `QUICK-START.md`

---

## Summary

✅ **Image-to-Video Capability**: Animate static images with AI-generated motion
✅ **Multiple Input Methods**: File path, URL, buffer, or base64
✅ **Same Cost**: $0.20/second, no extra charge for images
✅ **Same Quality**: 1080p output, 1-8 seconds (extendable to 148s)
✅ **API Ready**: Full REST API support for frontend integration
✅ **Test Scripts**: Comprehensive testing and examples provided

Transform your static images into dynamic videos with Veo 3.1 image-to-video generation!
