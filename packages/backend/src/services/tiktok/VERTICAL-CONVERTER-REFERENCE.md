# Vertical Converter - FFmpeg Commands Reference

## Quick Reference

### 1. Center Crop Style

**Command:**
```bash
ffmpeg -i input.mp4 \
  -vf "crop=ih*(9/16):ih,scale=1080:1920" \
  -c:a copy \
  -y output.mp4
```

**Explanation:**
- `crop=ih*(9/16):ih` - Crop width to maintain 9:16 ratio based on input height
- `scale=1080:1920` - Scale to exact TikTok dimensions
- `-c:a copy` - Copy audio without re-encoding (preserves quality)
- `-y` - Overwrite output file if exists

**Use Case:**
- Fast processing needed
- Content already centered
- Speed > visual perfection

**Performance:** ~1.0x realtime

---

### 2. Blur Background Style (RECOMMENDED)

**Command:**
```bash
ffmpeg -i input.mp4 \
  -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,boxblur=20:5[bg]; \
                   [0:v]scale=-1:1920[fg]; \
                   [bg][fg]overlay=(W-w)/2:(H-h)/2" \
  -c:a copy \
  -y output.mp4
```

**Explanation:**
- **Stage 1** - `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,boxblur=20:5[bg]`
  - Scale video to fill 1080x1920 frame
  - Apply box blur with radius 20 and power 5
  - Output to [bg] stream (background)

- **Stage 2** - `[0:v]scale=-1:1920[fg]`
  - Scale original video to fit height (1920px)
  - Maintain aspect ratio (-1 for width)
  - Output to [fg] stream (foreground)

- **Stage 3** - `[bg][fg]overlay=(W-w)/2:(H-h)/2`
  - Overlay foreground on background
  - Center horizontally: (W-w)/2
  - Center vertically: (H-h)/2

**Use Case:**
- Professional, polished look
- Preserves all visual content
- Most popular on TikTok/Instagram

**Performance:** ~0.5x realtime

**Customization:**
```bash
# Higher blur intensity (more dramatic)
boxblur=30:5

# Lower blur intensity (subtle)
boxblur=10:5

# Different blur quality (radius:power)
boxblur=20:10  # Higher quality, slower
boxblur=20:2   # Lower quality, faster
```

---

### 3. Smart Zoom Style

**Command:**
```bash
ffmpeg -i input.mp4 \
  -vf "scale=iw*1.5:ih*1.5,crop=1080:1920" \
  -c:a copy \
  -y output.mp4
```

**Explanation:**
- `scale=iw*1.5:ih*1.5` - Scale input by 1.5x (zoom in)
  - `iw` = input width
  - `ih` = input height
- `crop=1080:1920` - Crop zoomed video to exact dimensions from center

**Use Case:**
- Presentation videos
- Talking heads
- Centered subjects
- Emphasize main content

**Performance:** ~1.0x realtime

**Customization:**
```bash
# More aggressive zoom
scale=iw*2.0:ih*2.0,crop=1080:1920

# Subtle zoom
scale=iw*1.2:ih*1.2,crop=1080:1920

# Extreme zoom
scale=iw*2.5:ih*2.5,crop=1080:1920
```

---

## Advanced Usage

### Custom Resolution

For different platforms (not recommended for TikTok):

```bash
# Instagram Reels (same as TikTok)
scale=1080:1920

# YouTube Shorts (same as TikTok)
scale=1080:1920

# Custom resolution
scale=720:1280  # HD vertical
scale=540:960   # SD vertical
```

### Hardware Acceleration

#### NVIDIA GPU (CUDA)
```bash
ffmpeg -hwaccel cuda \
  -i input.mp4 \
  -vf "crop=ih*(9/16):ih,scale=1080:1920" \
  -c:v h264_nvenc \
  -c:a copy \
  output.mp4
```

#### Apple Silicon (VideoToolbox)
```bash
ffmpeg -hwaccel videotoolbox \
  -i input.mp4 \
  -vf "crop=ih*(9/16):ih,scale=1080:1920" \
  -c:v h264_videotoolbox \
  -c:a copy \
  output.mp4
```

#### Intel Quick Sync
```bash
ffmpeg -hwaccel qsv \
  -i input.mp4 \
  -vf "crop=ih*(9/16):ih,scale=1080:1920" \
  -c:v h264_qsv \
  -c:a copy \
  output.mp4
```

### Quality Control

#### High Quality (larger file)
```bash
ffmpeg -i input.mp4 \
  -vf "crop=ih*(9/16):ih,scale=1080:1920" \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -c:a copy \
  output.mp4
```

#### Balanced Quality (default)
```bash
ffmpeg -i input.mp4 \
  -vf "crop=ih*(9/16):ih,scale=1080:1920" \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -c:a copy \
  output.mp4
```

#### Fast Encoding (lower quality)
```bash
ffmpeg -i input.mp4 \
  -vf "crop=ih*(9/16):ih,scale=1080:1920" \
  -c:v libx264 \
  -preset fast \
  -crf 28 \
  -c:a copy \
  output.mp4
```

### Audio Handling

#### Copy Audio (default, recommended)
```bash
-c:a copy
```

#### Re-encode Audio (if needed)
```bash
-c:a aac -b:a 128k
```

#### Remove Audio
```bash
-an
```

#### Normalize Audio Levels
```bash
-af "loudnorm=I=-16:TP=-1.5:LRA=11"
```

---

## Video Analysis Commands

### Get Video Info
```bash
ffprobe -v quiet \
  -print_format json \
  -show_format \
  -show_streams \
  input.mp4
```

### Get Duration
```bash
ffprobe -v error \
  -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 \
  input.mp4
```

### Get Resolution
```bash
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=width,height \
  -of csv=s=x:p=0 \
  input.mp4
```

### Get Aspect Ratio
```bash
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=display_aspect_ratio \
  -of default=noprint_wrappers=1:nokey=1 \
  input.mp4
```

---

## Comparison: All Three Styles

### Test Commands

```bash
# 1. Crop
ffmpeg -i horizontal_16_9.mp4 \
  -vf "crop=ih*(9/16):ih,scale=1080:1920" \
  -c:a copy \
  output_crop.mp4

# 2. Blur Background
ffmpeg -i horizontal_16_9.mp4 \
  -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,boxblur=20:5[bg]; \
                   [0:v]scale=-1:1920[fg]; \
                   [bg][fg]overlay=(W-w)/2:(H-h)/2" \
  -c:a copy \
  output_blur.mp4

# 3. Zoom
ffmpeg -i horizontal_16_9.mp4 \
  -vf "scale=iw*1.5:ih*1.5,crop=1080:1920" \
  -c:a copy \
  output_zoom.mp4
```

### Visual Comparison

**Input:** 1920x1080 (16:9 landscape)
**Output:** 1080x1920 (9:16 portrait)

```
┌─────────────────────────┐
│                         │
│    16:9 Horizontal      │
│    1920x1080            │
│                         │
└─────────────────────────┘

         ↓ Convert ↓

Style 1: Crop          Style 2: Blur          Style 3: Zoom
┌───────┐              ┌───────────┐           ┌───────┐
│ crop  │              │░blur░│ori│░│           │zoomed │
│  to   │              │░blur░│gin│░│           │ crop  │
│ 9:16  │              │░blur░│ al │░│           │  to   │
│center │              │░blur░│vid│░│           │ 9:16  │
└───────┘              └───────────┘           └───────┘
Loses sides            Keeps all              Loses edges
```

---

## Performance Benchmarks

Based on 60-second 1080p video on modern CPU (i7/Ryzen 7):

| Style | Processing Time | Output Size | Quality |
|-------|----------------|-------------|---------|
| Crop | ~60 seconds (1.0x) | 45 MB | Good |
| Zoom | ~65 seconds (1.08x) | 47 MB | Good |
| Blur | ~120 seconds (2.0x) | 52 MB | Excellent |

*Hardware acceleration can improve these times by 2-5x*

---

## Troubleshooting

### Error: Unknown encoder 'libx264'
**Solution:** FFmpeg compiled without x264 support. Reinstall FFmpeg with x264.

### Error: Invalid video dimensions
**Solution:** Input video resolution too low. Minimum recommended: 720p

### Error: Out of memory
**Solution:** Processing 4K+ video. Reduce resolution or increase system RAM.

### Output is pixelated
**Solution:** Lower CRF value (e.g., -crf 18) or use higher quality preset.

### Processing too slow
**Solution:**
- Use crop or zoom style instead of blur
- Enable hardware acceleration
- Use faster preset (e.g., -preset fast)

### Audio out of sync
**Solution:**
- Use `-c:a copy` to avoid re-encoding
- If must re-encode, use `-async 1`

---

## Best Practices

1. **Always use `-c:a copy`** - Preserves audio quality and speeds up processing
2. **Test on a sample first** - Try all three styles on 5-second clip
3. **Use blur-background for final output** - Best quality for social media
4. **Monitor disk space** - Vertical conversion can create large temp files
5. **Validate input** - Check video exists and is valid before processing
6. **Clean up temp files** - Remove intermediate files after processing
7. **Use hardware acceleration** - If available, speeds up processing 2-5x
8. **Batch process overnight** - Large batches can take hours

---

## Integration Tips

### With TypeScript
```typescript
import { VerticalConverter } from './vertical-converter';

const converter = new VerticalConverter();
const output = await converter.convertToVertical(input, {
  style: 'blur-background',
  blurIntensity: 20
});
```

### With Express.js
```typescript
app.post('/convert', async (req, res) => {
  const output = await converter.convertToVertical(req.body.input);
  res.json({ output });
});
```

### With Queue (Bull/BullMQ)
```typescript
queue.process(async (job) => {
  const output = await converter.convertToVertical(job.data.input);
  return { output };
});
```

---

## Additional Resources

- FFmpeg Documentation: https://ffmpeg.org/documentation.html
- FFmpeg Filters: https://ffmpeg.org/ffmpeg-filters.html
- TikTok Video Specs: https://support.tiktok.com/en/using-tiktok/creating-videos/video-formats
- Instagram Reels Specs: Similar to TikTok (9:16, 1080x1920)
- YouTube Shorts Specs: Same as TikTok (9:16, max 60s)
