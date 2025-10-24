# Caption Generator for TikTok Multilingual Pipeline

A comprehensive caption/subtitle generation system for burning captions into videos with TikTok-style formatting.

## Features

- ✅ **SRT Subtitle Generation** - Standard SubRip format
- ✅ **Caption Burning** - Embed captions directly into video using FFmpeg
- ✅ **Dynamic Word-by-Word** - TikTok-style animated captions
- ✅ **Multi-line Word Wrapping** - Automatic text wrapping
- ✅ **RTL Language Support** - Arabic, Hebrew, and other RTL scripts
- ✅ **Custom Styling** - Font, size, color, outline, position
- ✅ **Style Presets** - TikTok, YouTube, Instagram, and more
- ✅ **Special Characters** - Emojis, quotes, and symbols
- ✅ **Format Validation** - Built-in SRT format checker
- ✅ **Auto Cleanup** - Temporary file management

## Installation

```bash
# Ensure FFmpeg is installed
sudo apt-get install ffmpeg  # Ubuntu/Debian
# or
brew install ffmpeg  # macOS
```

## Quick Start

### Basic Usage

```typescript
import { createCaptionGenerator, TranscriptSegment } from './caption-generator';

const generator = await createCaptionGenerator();

const segments: TranscriptSegment[] = [
  { text: 'Welcome to TikTok!', start: 0, end: 2.5 },
  { text: 'Let\'s create viral content.', start: 2.5, end: 5 }
];

// Generate SRT
const srtPath = await generator.generateCaptions(segments, 'en');

// Burn captions into video
const outputPath = await generator.burnCaptions(
  'input.mp4',
  srtPath,
  undefined,  // Use default style
  'output.mp4'
);
```

### One-Step Helper

```typescript
import { addCaptionsToVideo, CAPTION_PRESETS } from './caption-generator';

const output = await addCaptionsToVideo('input.mp4', segments, {
  language: 'en',
  style: CAPTION_PRESETS.tiktok,
  outputPath: 'final.mp4',
  captionOptions: {
    maxLineWidth: 40,
    maxLines: 2,
    wordWrap: true
  }
});
```

## API Reference

### CaptionGenerator Class

#### Methods

##### `generateCaptions(segments, language, options)`
Generate SRT subtitle file from transcript segments.

**Parameters:**
- `segments: TranscriptSegment[]` - Array of timed text segments
- `language: string` - Language code (e.g., 'en', 'es', 'ar')
- `options: CaptionOptions` - Generation options

**Returns:** `Promise<string>` - Path to generated SRT file

**Example:**
```typescript
const srtPath = await generator.generateCaptions(segments, 'en', {
  maxLineWidth: 42,
  maxLines: 2,
  wordWrap: true
});
```

##### `burnCaptions(videoPath, srtPath, style, outputPath)`
Burn captions into video using FFmpeg.

**Parameters:**
- `videoPath: string` - Input video path
- `srtPath: string` - SRT subtitle file path
- `style: Partial<CaptionStyle>` - Caption styling
- `outputPath?: string` - Optional output path

**Returns:** `Promise<string>` - Path to output video

**Example:**
```typescript
const output = await generator.burnCaptions(
  'input.mp4',
  'captions.srt',
  { font: 'Impact', size: 40 },
  'output.mp4'
);
```

##### `generateDynamicCaptions(segments, wordTimings, style)`
Generate ASS format for word-by-word highlighting.

**Parameters:**
- `segments: TranscriptSegment[]` - Transcript segments
- `wordTimings?: WordTiming[][]` - Optional word-level timing
- `style: Partial<CaptionStyle>` - Caption styling

**Returns:** `Promise<string>` - Path to ASS file

**Example:**
```typescript
const assPath = await generator.generateDynamicCaptions(segments, undefined, {
  size: 36,
  color: '&H00FFFFFF'
});
```

##### `burnDynamicCaptions(videoPath, assPath, outputPath)`
Burn ASS captions with animations into video.

##### `formatTime(seconds)`
Convert seconds to SRT timestamp format (HH:MM:SS,mmm).

##### `getStyleString(style)`
Convert CaptionStyle object to FFmpeg force_style string.

##### `splitIntoSegments(transcript, timing, maxChars)`
Split long transcript into optimal caption segments.

##### `wrapText(text, maxWidth, maxLines)`
Wrap text to specified width and line count.

##### `sanitizeText(text)`
Escape special characters for subtitle formats.

##### `validateSRT(srtPath)`
Validate SRT file format.

**Returns:** `Promise<{ valid: boolean, errors: string[] }>`

##### `cleanup(filePath)` / `cleanupAll()`
Clean up temporary files.

## Interfaces

### TranscriptSegment
```typescript
interface TranscriptSegment {
  text: string;
  start: number;  // Start time in seconds
  end: number;    // End time in seconds
  speaker?: string;
}
```

### CaptionStyle
```typescript
interface CaptionStyle {
  font: string;           // Font family
  size: number;           // Font size in pixels
  color: string;          // ASS color format: '&H00FFFFFF'
  outline: string;        // Outline color: '&H00000000'
  outlineWidth?: number;  // Outline width (default: 2)
  bold: boolean;          // Bold text
  position: 'top' | 'middle' | 'bottom';
  alignment: number;      // 1-9 (numpad layout)
  backgroundColor?: string;
  backgroundOpacity?: number;
}
```

### CaptionOptions
```typescript
interface CaptionOptions {
  style?: Partial<CaptionStyle>;
  maxLineWidth?: number;      // Max characters per line
  maxLines?: number;          // Max lines per caption
  wordWrap?: boolean;         // Enable word wrapping
  rtl?: boolean;              // RTL language support
  preserveFormatting?: boolean;
}
```

## Style Presets

Pre-configured styles for common platforms:

```typescript
import { CAPTION_PRESETS } from './caption-generator';

// Available presets:
CAPTION_PRESETS.tiktok      // White bold Arial, bottom center
CAPTION_PRESETS.youtube     // White Roboto with background
CAPTION_PRESETS.instagram   // White bold Impact, center
CAPTION_PRESETS.minimal     // Small Helvetica, subtle
CAPTION_PRESETS.bold        // Large yellow Impact, top
```

### Custom Styles

```typescript
const customStyle: CaptionStyle = {
  font: 'Impact',
  size: 40,
  color: '&H0000FFFF',     // Yellow (AABBGGRR format)
  outline: '&H00000000',   // Black
  outlineWidth: 3,
  bold: true,
  position: 'top',
  alignment: 8             // Top center
};
```

## Color Format (ASS)

ASS format uses AABBGGRR hex format:
- `&H00FFFFFF` - White
- `&H00000000` - Black
- `&H000000FF` - Red
- `&H0000FF00` - Green
- `&H00FF0000` - Blue
- `&H0000FFFF` - Yellow
- `&H00FF00FF` - Magenta
- `&H00FFFF00` - Cyan

## Alignment Values (Numpad Layout)

```
7   8   9    (top-left, top-center, top-right)
4   5   6    (middle-left, middle-center, middle-right)
1   2   3    (bottom-left, bottom-center, bottom-right)
```

Most common:
- `2` - Bottom center (TikTok default)
- `5` - Middle center
- `8` - Top center

## SRT Format

Standard SubRip format:
```
1
00:00:00,000 --> 00:00:02,500
First caption line here

2
00:00:02,500 --> 00:00:05,000
Second caption line here

3
00:00:05,000 --> 00:00:07,500
Caption with emoji 👍
```

**Important:**
- Use commas (`,`) not periods (`.`) for milliseconds
- Timestamps: HH:MM:SS,mmm
- Blank line between entries
- Sequential numbering

## FFmpeg Examples

### Basic Caption Burning
```bash
ffmpeg -i input.mp4 -vf "subtitles='captions.srt'" output.mp4
```

### With Custom Style
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='captions.srt':force_style='FontName=Arial,FontSize=32,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Bold=1,Alignment=2'" \
  output.mp4
```

### Yellow Bold Top Position
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='captions.srt':force_style='FontName=Impact,FontSize=40,PrimaryColour=&H0000FFFF,OutlineColour=&H00000000,Outline=3,Bold=1,Alignment=8,MarginV=20'" \
  output.mp4
```

### Dynamic ASS Captions
```bash
ffmpeg -i input.mp4 -vf "ass='dynamic.ass'" output.mp4
```

## Quality Recommendations

### Font Size (1080x1920 vertical)
- ✅ **Optimal:** 32-40px
- ✅ **Minimum:** 28px (readability limit)
- ⚠️ **Maximum:** 48px (for emphasis only)
- ❌ **Avoid:** Below 24px (too small)

### Font Families
- ✅ **TikTok/Instagram:** Arial, Impact, Helvetica Bold
- ✅ **YouTube:** Roboto, Open Sans
- ✅ **Professional:** Helvetica, Proxima Nova
- ❌ **Avoid:** Serif fonts, script fonts (hard to read)

### Colors
- ✅ **Universal:** White with black outline
- ✅ **Attention:** Yellow with black outline
- ✅ **Accessibility:** High contrast combinations
- ❌ **Avoid:** Low contrast, no outline

### Outline Width
- ✅ **Minimum:** 2px (readability)
- ✅ **Optimal:** 2-3px (most content)
- ✅ **Maximum:** 4px (bold style)
- ❌ **Avoid:** No outline (text gets lost)

### Positioning
- ✅ **Bottom:** Most common, safe choice
- ✅ **Top:** For bottom-heavy content
- ✅ **Middle:** Dramatic effect only
- ❌ **Avoid:** Covering faces or key content

### Line Length
- ✅ **Optimal:** 35-42 characters per line
- ✅ **Max Lines:** 2-3 lines per caption
- ✅ **Duration:** 1-4 seconds per caption
- ❌ **Avoid:** More than 3 lines (clutter)

### Mobile Optimization
- ✅ Test on actual mobile device
- ✅ Ensure thumbnail readability
- ✅ Use safe zones (60px from edges)
- ✅ Bold text for visibility
- ✅ High contrast colors

## Advanced Features

### Right-to-Left Languages

```typescript
const arabicSegments = [
  { text: 'مرحبا بكم', start: 0, end: 2 }
];

const srtPath = await generator.generateCaptions(arabicSegments, 'ar', {
  rtl: true
});
```

RTL automatically detected for: Arabic (ar), Hebrew (he), Farsi (fa), Urdu (ur)

### Word Wrapping

```typescript
const options = {
  maxLineWidth: 35,
  maxLines: 2,
  wordWrap: true
};

const srtPath = await generator.generateCaptions(segments, 'en', options);
```

### Special Characters

```typescript
const segments = [
  { text: "Quotes 'work' \"fine\"", start: 0, end: 2 },
  { text: 'Emojis too! 😊 🎉 🚀', start: 2, end: 4 },
  { text: '@mentions #hashtags', start: 4, end: 6 }
];

// Automatically sanitized
const srtPath = await generator.generateCaptions(segments, 'en');
```

### Auto-Segmentation

```typescript
const longText = "Very long transcript that needs to be split into multiple caption segments for optimal readability.";

const segments = generator.splitIntoSegments(
  longText,
  { start: 0, end: 30 },
  42  // Max chars per segment
);
```

### Preview Generation

```typescript
const preview = await generator.generatePreview(segments, 3);
console.log(preview);
```

### Format Validation

```typescript
const validation = await generator.validateSRT('captions.srt');
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

## Usage in TikTok Pipeline

### Integration with Video Processor

```typescript
// video-processor.ts
import { addCaptionsToVideo, CAPTION_PRESETS } from './caption-generator';

export class VideoProcessor {
  async addCaptions(videoPath: string, transcript: any): Promise<string> {
    return await addCaptionsToVideo(videoPath, transcript.segments, {
      language: transcript.language,
      style: CAPTION_PRESETS.tiktok,
      captionOptions: {
        maxLineWidth: 40,
        maxLines: 2,
        wordWrap: true
      }
    });
  }
}
```

### Integration with Translation Service

```typescript
// After translation
const translatedSegments = await translator.translate(segments, targetLang);
const captionedVideo = await addCaptionsToVideo(videoPath, translatedSegments, {
  language: targetLang,
  style: CAPTION_PRESETS.tiktok
});
```

## Testing

Run the test suite:

```bash
# Compile TypeScript
npm run build

# Run tests
node test-caption-generator.js
```

Or test individual examples:

```typescript
import examples from './caption-examples';

// Run specific example
await examples.example1_BasicSRT();
await examples.example2_BurnCaptions();
// ... etc
```

## Troubleshooting

### FFmpeg Not Found
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Verify installation
ffmpeg -version
```

### Font Not Available
```bash
# List available fonts
fc-list

# Install common fonts (Ubuntu)
sudo apt-get install fonts-liberation fonts-dejavu

# Copy custom fonts
sudo cp MyFont.ttf /usr/share/fonts/truetype/
fc-cache -f -v
```

### SRT Validation Errors
- Check timestamp format (use commas, not periods)
- Ensure blank lines between entries
- Sequential numbering (1, 2, 3...)
- Valid UTF-8 encoding

### Caption Not Visible
- Increase outline width (2-3px minimum)
- Check color contrast (white/yellow on black outline)
- Verify font size (32px+ for mobile)
- Test positioning (avoid content overlap)

## Performance Considerations

- **Temp File Cleanup:** Always call `cleanup()` or `cleanupAll()`
- **Memory Usage:** Process large videos in batches
- **FFmpeg Efficiency:** Use hardware acceleration if available
- **Style Caching:** Reuse style strings when possible

## Best Practices

1. **Always validate** SRT format before burning
2. **Test on mobile** devices (target platform)
3. **Use presets** as starting points
4. **Bold text** for better visibility
5. **High contrast** colors (white/yellow + black)
6. **Keep it short** (2-3 lines maximum)
7. **Word wrap** long text automatically
8. **Clean up** temp files after use
9. **RTL support** for international content
10. **Preview first** before burning captions

## License

Part of the TikTok Multilingual Pipeline project.

## Support

For issues or questions, refer to the main project documentation.
