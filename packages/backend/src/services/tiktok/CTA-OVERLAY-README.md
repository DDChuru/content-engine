# CTA Overlay Service

Add Call-to-Action overlays to TikTok videos with customizable animations and styling.

## Features

- ✅ Simple text overlays
- ✅ Animated CTA effects (fade, slide, bounce, pulse)
- ✅ Emoji support (👆 ⬆️ ☝️ 🔔 🎁)
- ✅ Custom positioning (top/bottom)
- ✅ Background boxes for contrast
- ✅ Batch processing support
- ✅ Cross-platform font detection
- ✅ Quality preservation

## Installation

```bash
# Install dependencies
npm install

# Ensure FFmpeg is installed
ffmpeg -version
```

## Quick Start

```typescript
import { ctaOverlay } from './services/tiktok/cta-overlay';

// Add default CTA (last 3 seconds)
const output = await ctaOverlay.addDefaultCTA('input.mp4');

// Add animated CTA
const output = await ctaOverlay.addAnimatedCTA('input.mp4', {
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

## API Reference

### CTAOverlay Class

#### Methods

##### `addCTA(videoPath, config, outputPath?)`
Add simple CTA overlay to video.

**Parameters:**
- `videoPath` (string): Path to input video
- `config` (CTAConfig): CTA configuration
- `outputPath` (string, optional): Output path

**Returns:** Promise<string> - Path to output video

**Example:**
```typescript
const output = await ctaOverlay.addCTA('input.mp4', {
  text: 'Watch full video 👆',
  position: 'top',
  fontSize: 45,
  fontColor: 'yellow',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
});
```

---

##### `addAnimatedCTA(videoPath, config, outputPath?)`
Add animated CTA overlay to video.

**Parameters:**
- `videoPath` (string): Path to input video
- `config` (AnimatedCTAConfig): Animated CTA configuration
- `outputPath` (string, optional): Output path

**Returns:** Promise<string> - Path to output video

**Example:**
```typescript
const output = await ctaOverlay.addAnimatedCTA('input.mp4', {
  text: 'Subscribe now! 🔔',
  position: 'bottom',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'red',
  borderWidth: 3,
  duration: 3,
  animation: 'bounce',
  arrow: true,
  arrowAnimation: true,
});
```

---

##### `addDefaultCTA(videoPath, outputPath?)`
Add default CTA overlay ("Full video on YouTube 👆").

**Parameters:**
- `videoPath` (string): Path to input video
- `outputPath` (string, optional): Output path

**Returns:** Promise<string> - Path to output video

---

##### `addDefaultAnimatedCTA(videoPath, outputPath?)`
Add default animated CTA with fade effect.

**Parameters:**
- `videoPath` (string): Path to input video
- `outputPath` (string, optional): Output path

**Returns:** Promise<string> - Path to output video

---

##### `addStyledCTA(videoPath, text, options?, outputPath?)`
Convenience method for styled CTA with common options.

**Parameters:**
- `videoPath` (string): Path to input video
- `text` (string): CTA text
- `options` (object, optional):
  - `position`: 'top' | 'bottom'
  - `animation`: 'fade' | 'slide' | 'bounce' | 'pulse'
  - `backgroundColor`: string
  - `fontColor`: string
  - `fontSize`: number
  - `showArrow`: boolean
  - `animateArrow`: boolean
- `outputPath` (string, optional): Output path

**Returns:** Promise<string> - Path to output video

**Example:**
```typescript
const output = await ctaOverlay.addStyledCTA(
  'input.mp4',
  'Watch more content! ⬆️',
  {
    position: 'top',
    animation: 'pulse',
    backgroundColor: 'black@0.7',
    fontColor: 'cyan',
    fontSize: 45,
    showArrow: true,
  }
);
```

---

##### `addCTABatch(videoPaths, config, outputDir?)`
Batch process multiple videos with same CTA.

**Parameters:**
- `videoPaths` (string[]): Array of input video paths
- `config` (CTAConfig | AnimatedCTAConfig): CTA configuration
- `outputDir` (string, optional): Output directory

**Returns:** Promise<string[]> - Array of output video paths

**Example:**
```typescript
const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4'];
const outputs = await ctaOverlay.addCTABatch(videos, {
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

---

##### `buildCTAFilter(config, videoDuration?)`
Build FFmpeg drawtext filter string.

**Parameters:**
- `config` (CTAConfig): CTA configuration
- `videoDuration` (number, optional): Video duration in seconds

**Returns:** Promise<string> - FFmpeg filter string

---

##### `buildAnimatedFilter(config, videoDuration?)`
Build FFmpeg filter string with animations.

**Parameters:**
- `config` (AnimatedCTAConfig): Animated CTA configuration
- `videoDuration` (number, optional): Video duration in seconds

**Returns:** Promise<string> - FFmpeg filter string

---

##### `getVideoDuration(videoPath)`
Get video duration in seconds.

**Parameters:**
- `videoPath` (string): Path to video

**Returns:** Promise<number> - Duration in seconds

---

##### `getAvailableFonts()`
Get list of available fonts on system.

**Returns:** Promise<string[]> - Array of font paths

---

### Configuration Interfaces

#### CTAConfig

```typescript
interface CTAConfig {
  text: string;                  // CTA text (e.g., "Full video on YouTube 👆")
  position: 'top' | 'bottom';   // Vertical position
  startTime?: number;            // When to show (default: auto-calculate)
  duration?: number;             // How long to show (default: 3 seconds)
  fontSize?: number;             // Font size (default: 40)
  fontColor?: string;            // Text color (default: 'white')
  backgroundColor?: string;      // Background color (optional)
  borderColor?: string;          // Border color (default: 'black')
  borderWidth?: number;          // Border width (default: 3)
}
```

#### AnimatedCTAConfig

```typescript
interface AnimatedCTAConfig extends CTAConfig {
  animation: 'fade' | 'slide' | 'bounce' | 'pulse';
  arrow?: boolean;               // Show arrow pointing up
  arrowAnimation?: boolean;      // Animate arrow (bounce)
}
```

## Animations

### Fade
Smooth fade-in effect over 1 second.

**Use Case:** Professional, subtle appearance
**FFmpeg Example:**
```
alpha='if(lt(t,57),0,if(lt(t,58),(t-57),1))'
```

### Slide
Slide in from top or bottom.

**Use Case:** Dynamic entrance, catches attention
**FFmpeg Example:**
```
y='if(lt(t,57),-text_h,if(lt(t,58),100*(t-57),100))'
```

### Bounce
Bouncing effect with elastic easing.

**Use Case:** Playful, energetic content
**FFmpeg Example:**
```
y='100-20*sin(2*PI*(t-57))*exp(-3*(t-57))'
```

### Pulse
Pulsing size effect.

**Use Case:** Draw continuous attention
**FFmpeg Example:**
```
fontsize='40+5*sin(2*PI*(t-57))'
```

## Examples

### Example 1: Simple CTA
```typescript
const output = await ctaOverlay.addCTA('input.mp4', {
  text: 'Full video on YouTube 👆',
  position: 'top',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
});
```

### Example 2: Fade-in CTA
```typescript
const output = await ctaOverlay.addAnimatedCTA('input.mp4', {
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

### Example 3: Styled CTA with Background
```typescript
const output = await ctaOverlay.addAnimatedCTA('input.mp4', {
  text: 'Watch the full tutorial ⬆️',
  position: 'top',
  fontSize: 45,
  fontColor: 'yellow',
  backgroundColor: 'black@0.7',
  borderColor: 'yellow',
  borderWidth: 2,
  duration: 4,
  animation: 'pulse',
});
```

### Example 4: CTA with Animated Arrow
```typescript
const output = await ctaOverlay.addAnimatedCTA('input.mp4', {
  text: 'Full video on YouTube',
  position: 'top',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
  animation: 'bounce',
  arrow: true,
  arrowAnimation: true,
});
```

### Example 5: Multi-language Support
```typescript
// English
await ctaOverlay.addCTA('video.mp4', {
  text: 'Full video on YouTube 👆',
  position: 'top',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
}, 'video-en.mp4');

// Spanish
await ctaOverlay.addCTA('video.mp4', {
  text: 'Vídeo completo en YouTube 👆',
  position: 'top',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
}, 'video-es.mp4');
```

## Font Considerations

### Default Font Paths
The service attempts to find fonts in this order:

1. **Linux:** `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`
2. **macOS:** `/System/Library/Fonts/Supplemental/Arial Bold.ttf`
3. **Windows:** `/Windows/Fonts/arialbd.ttf`

### Fallback Fonts
- DejaVuSans.ttf
- LiberationSans-Bold.ttf
- Helvetica.ttc
- arial.ttf

### Emoji Support
Supported emojis: 👆 ⬆️ ☝️ 🔔 🎁 🔗

**Note:** Font must support Unicode emoji characters. DejaVu fonts have good emoji support on Linux.

### Installing Fonts

**Ubuntu/Debian:**
```bash
sudo apt-get install fonts-dejavu-core
```

**macOS:**
Fonts are pre-installed.

**Windows:**
Fonts are pre-installed.

## Best Practices

### Readability
- **Font Size:** 40-50 for TikTok (1080x1920)
- **Border:** Always use borderWidth: 3 for contrast
- **Colors:** White text with black border works best
- **Background:** Add semi-transparent background for busy videos

### Positioning
- **Top:** 100px from top (leaves room for profile pic)
- **Bottom:** 100px from bottom (leaves room for captions)
- **Horizontal:** Always centered

### Timing
- **Default:** Last 3 seconds of video
- **Custom:** Use startTime and duration for specific timing
- **Duration:** 3-5 seconds is optimal

### Performance
- **Simple CTA:** ~1-2 seconds processing time
- **Animated CTA:** Slightly slower due to complex filters
- **Batch Processing:** Process in parallel for speed

### Quality
- Audio is always preserved (`-c:a copy`)
- Video re-encoding uses FFmpeg defaults
- For high quality, modify FFmpeg command:
  ```typescript
  // Add to command: -c:v libx264 -crf 18
  ```

## Platform Compatibility

| Platform | Resolution | Aspect Ratio | Position Notes |
|----------|-----------|--------------|----------------|
| TikTok | 1080x1920 | 9:16 | Top at 100px, Bottom at h-100px |
| Instagram Reels | 1080x1920 | 9:16 | Same as TikTok |
| YouTube Shorts | 1080x1920 | 9:16 | Same as TikTok |

## Troubleshooting

### No fonts found
```bash
# Install fonts on Linux
sudo apt-get install fonts-dejavu-core fonts-liberation

# Verify installation
fc-list | grep -i dejavu
```

### Emojis not rendering
- Ensure font supports Unicode emojis
- Try using emoji-specific fonts
- Test with simple emojis first (👆 ⬆️)

### Poor video quality
- Adjust FFmpeg encoding parameters
- Use `-crf 18` for high quality
- Use `-crf 23` for balanced quality/size

### CTA appears at wrong time
- Check video duration with `getVideoDuration()`
- Verify startTime calculation
- Use explicit startTime if needed

## Testing

Run the test script to see all examples:

```bash
# Run test script
ts-node src/services/tiktok/cta-test.ts

# Run examples
ts-node -e "import('./services/tiktok/cta-examples').then(m => m.runAllExamples('video.mp4'))"
```

## FFmpeg Filter Examples

### Simple CTA (Top)
```
drawtext=text='Full video on YouTube 👆':
fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:
fontsize=40:
fontcolor=white:
bordercolor=black:
borderw=3:
x=(w-text_w)/2:
y=100:
enable='gte(t,57)'
```

### Fade-in CTA
```
drawtext=text='Full video on YouTube 👆':
fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:
fontsize=40:
fontcolor=white:
bordercolor=black:
borderw=3:
x=(w-text_w)/2:
y=100:
alpha='if(lt(t,57),0,if(lt(t,58),(t-57),1))':
enable='gte(t,57)'
```

### Slide-in CTA
```
drawtext=text='Link in bio ☝️':
fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:
fontsize=40:
fontcolor=white:
bordercolor=black:
borderw=3:
x=(w-text_w)/2:
y='if(lt(t,57),h,if(lt(t,58),h-(h-1720)*(t-57),1720))':
enable='gte(t,57)'
```

### Bounce CTA
```
drawtext=text='Subscribe now! 🔔':
fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:
fontsize=40:
fontcolor=yellow:
bordercolor=black:
borderw=3:
x=(w-text_w)/2:
y='100-20*sin(2*PI*(t-57))*exp(-3*(t-57))':
enable='gte(t,57)'
```

## License

MIT

## Author

Content Engine - TikTok Multilingual Pipeline
