# CTA Overlay - Quick Reference Card

## Import
```typescript
import { ctaOverlay } from './services/tiktok/cta-overlay';
```

## Quick Start (5 Lines)
```typescript
// Default CTA (easiest)
await ctaOverlay.addDefaultCTA('input.mp4');

// Default animated CTA
await ctaOverlay.addDefaultAnimatedCTA('input.mp4');

// Custom styled CTA
await ctaOverlay.addStyledCTA('input.mp4', 'Watch more! 👆', {
  animation: 'fade',
  fontColor: 'yellow',
});
```

## Common Use Cases

### 1. YouTube CTA (Top, Last 3 Seconds)
```typescript
await ctaOverlay.addCTA('video.mp4', {
  text: 'Full video on YouTube 👆',
  position: 'top',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
});
```

### 2. Link in Bio (Bottom, Fade In)
```typescript
await ctaOverlay.addAnimatedCTA('video.mp4', {
  text: 'Link in bio ☝️',
  position: 'bottom',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
  animation: 'fade',
});
```

### 3. Subscribe CTA (Bounce Effect)
```typescript
await ctaOverlay.addAnimatedCTA('video.mp4', {
  text: 'Subscribe now! 🔔',
  position: 'top',
  fontSize: 40,
  fontColor: 'yellow',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
  animation: 'bounce',
});
```

### 4. Premium CTA (Background Box)
```typescript
await ctaOverlay.addAnimatedCTA('video.mp4', {
  text: 'Limited offer! 🎁',
  position: 'top',
  fontSize: 45,
  fontColor: 'white',
  backgroundColor: 'red@0.8',
  borderColor: 'white',
  borderWidth: 2,
  duration: 4,
  animation: 'pulse',
});
```

### 5. Batch Processing
```typescript
const videos = ['v1.mp4', 'v2.mp4', 'v3.mp4'];
await ctaOverlay.addCTABatch(videos, {
  text: 'Full video on YouTube 👆',
  position: 'top',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
  animation: 'fade',
});
```

## Animations

| Animation | Effect | Best For |
|-----------|--------|----------|
| `fade` | Fade in | Professional, subtle |
| `slide` | Slide from edge | Dynamic, attention-grabbing |
| `bounce` | Bouncing | Playful, energetic |
| `pulse` | Pulsing size | Continuous attention |

## Positions

| Position | Y-Coordinate | Use Case |
|----------|--------------|----------|
| `top` | 100px | YouTube, tutorials |
| `bottom` | h-100px | Link in bio, Instagram |

## Colors

### Safe Combinations
```typescript
// White on black (most readable)
fontColor: 'white', borderColor: 'black'

// Yellow on black (high contrast)
fontColor: 'yellow', borderColor: 'black'

// White on red (urgent)
fontColor: 'white', borderColor: 'red'

// Black on white (inverted)
fontColor: 'black', borderColor: 'white'
```

### With Background
```typescript
backgroundColor: 'black@0.7'  // Semi-transparent black
backgroundColor: 'red@0.8'    // Semi-transparent red
backgroundColor: 'blue@0.6'   // Semi-transparent blue
```

## Emojis

**Arrows:** 👆 ⬆️ ☝️
**Actions:** 🔔 (subscribe) 🔗 (link) 🎁 (offer)
**Engagement:** ❤️ 👍 💬 📲

## Timing

```typescript
// Last 3 seconds (default)
duration: 3

// Custom timing
startTime: 10,  // Show at 10 seconds
duration: 5,    // Show for 5 seconds

// Auto-calculate (last N seconds)
duration: 4  // Show during last 4 seconds
```

## Font Sizes

| Size | Use Case |
|------|----------|
| 35 | Minimum readable |
| 40 | Default, most videos |
| 45 | Important CTAs |
| 50 | High impact |
| 55+ | Very short text only |

## Methods Cheatsheet

```typescript
// Simple methods
addDefaultCTA(videoPath)
addDefaultAnimatedCTA(videoPath)

// Custom methods
addCTA(videoPath, config)
addAnimatedCTA(videoPath, config)
addStyledCTA(videoPath, text, options)

// Batch
addCTABatch(videoPaths, config)

// Utilities
getVideoDuration(videoPath)
getAvailableFonts()
previewCTAFilter(config, duration)
```

## TypeScript Interfaces

```typescript
interface CTAConfig {
  text: string;
  position: 'top' | 'bottom';
  startTime?: number;
  duration?: number;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

interface AnimatedCTAConfig extends CTAConfig {
  animation: 'fade' | 'slide' | 'bounce' | 'pulse';
  arrow?: boolean;
  arrowAnimation?: boolean;
}
```

## Troubleshooting

### No fonts found
```bash
sudo apt-get install fonts-dejavu-core
```

### Emojis not showing
```typescript
// Use DejaVu fonts (best emoji support)
// Installed automatically by service
```

### CTA appears at wrong time
```typescript
// Get duration first
const duration = await ctaOverlay.getVideoDuration('video.mp4');

// Set explicit timing
config.startTime = duration - 3;
config.duration = 3;
```

### Poor quality
```typescript
// Modify FFmpeg command to use higher quality
// In cta-overlay.ts, change command to:
// ffmpeg -i "input.mp4" -vf "filter" -c:v libx264 -crf 18 -c:a copy "output.mp4"
```

## Files Location

```
packages/backend/src/services/tiktok/
├── cta-overlay.ts          # Core service
├── cta-examples.ts         # 12 examples
├── cta-test.ts             # Test script
└── CTA-OVERLAY-README.md   # Full documentation
```

## Testing

```bash
# Run test script
ts-node packages/backend/src/services/tiktok/cta-test.ts

# Run examples
ts-node packages/backend/src/services/tiktok/cta-examples.ts
```

## Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Simple CTA | 1-2s | Fast, minimal processing |
| Animated CTA | 2-3s | Complex filters |
| Batch (10 videos) | 20-30s | Sequential processing |
| Get duration | <0.1s | Very fast |

## Best Practices

✅ Always use border (borderWidth: 3)
✅ Font size 40-50 for readability
✅ Duration 3-5 seconds optimal
✅ Test on mobile device
✅ White text + black border = safe
✅ Top position for YouTube
✅ Bottom position for Instagram

❌ Don't use font size < 35
❌ Don't show CTA entire video
❌ Don't use low contrast colors
❌ Don't forget emojis in text
❌ Don't skip testing on mobile

---

**Quick Start:** `await ctaOverlay.addDefaultCTA('video.mp4')`

**Documentation:** See `CTA-OVERLAY-README.md`

**Examples:** See `cta-examples.ts`
