# Caption Generator - FFmpeg Quick Reference

## Installation

```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Verify
ffmpeg -version
```

## Basic Commands

### 1. Simple Caption Burning (Default Style)
```bash
ffmpeg -i input.mp4 -vf "subtitles='captions.srt'" output.mp4
```

### 2. TikTok Style (White Bold, Bottom Center)
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='captions.srt':force_style='FontName=Arial,FontSize=32,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Bold=1,Alignment=2'" \
  -c:a copy \
  output.mp4
```

### 3. Instagram Style (Bold Impact, Center)
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='captions.srt':force_style='FontName=Impact,FontSize=36,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=3,Bold=1,Alignment=5'" \
  -c:a copy \
  output.mp4
```

### 4. YouTube Style (With Background)
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='captions.srt':force_style='FontName=Roboto,FontSize=28,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=1,Alignment=2,BackColour=&H80000000'" \
  -c:a copy \
  output.mp4
```

### 5. Bold Yellow Style (Top Position, Attention-Grabbing)
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='captions.srt':force_style='FontName=Impact,FontSize=40,PrimaryColour=&H0000FFFF,OutlineColour=&H00000000,Outline=3,Bold=1,Alignment=8,MarginV=20'" \
  -c:a copy \
  output.mp4
```

### 6. Dynamic ASS Captions (Word Highlighting)
```bash
ffmpeg -i input.mp4 \
  -vf "ass='dynamic_captions.ass'" \
  -c:a copy \
  output.mp4
```

## Color Reference (ASS Format: &HAABBGGRR)

```bash
# Primary Colors
&H00FFFFFF  # White
&H00000000  # Black
&H000000FF  # Red
&H0000FF00  # Green
&H00FF0000  # Blue

# Accent Colors
&H0000FFFF  # Yellow
&H00FF00FF  # Magenta
&H00FFFF00  # Cyan

# Transparency (AA = Alpha)
&H00FFFFFF  # Opaque white
&H80FFFFFF  # 50% transparent white
&HFF000000  # Fully transparent black
```

## Position Reference (Alignment Values)

```
Numpad Layout:
7   8   9    (top-left, top-center, top-right)
4   5   6    (middle-left, middle-center, middle-right)
1   2   3    (bottom-left, bottom-center, bottom-right)

Common:
2 = Bottom center (TikTok default)
5 = Middle center
8 = Top center
```

## Style Parameters

```
FontName=Arial          # Font family
FontSize=32             # Font size in pixels
PrimaryColour=&H00FFFFFF  # Text color
OutlineColour=&H00000000  # Outline color
Outline=2               # Outline width
Bold=1                  # Bold (1) or normal (0)
Alignment=2             # Position (1-9)
MarginV=20              # Vertical margin
MarginL=10              # Left margin
MarginR=10              # Right margin
BackColour=&H80000000   # Background color
```

## Advanced Examples

### Multi-Language (Right-to-Left)
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='arabic_captions.srt':force_style='FontName=Arial,FontSize=32,PrimaryColour=&H00FFFFFF'" \
  -c:a copy \
  output_arabic.mp4
```

### High Quality Export
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='captions.srt':force_style='FontName=Arial,FontSize=32,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Bold=1,Alignment=2'" \
  -c:v libx264 -preset slow -crf 18 \
  -c:a copy \
  output_hq.mp4
```

### Fast Preview (Lower Quality)
```bash
ffmpeg -i input.mp4 \
  -vf "subtitles='captions.srt'" \
  -c:v libx264 -preset ultrafast -crf 28 \
  -c:a copy \
  preview.mp4
```

### Hardware Acceleration (NVIDIA)
```bash
ffmpeg -hwaccel cuda -i input.mp4 \
  -vf "subtitles='captions.srt':force_style='FontName=Arial,FontSize=32,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Bold=1,Alignment=2'" \
  -c:v h264_nvenc \
  -c:a copy \
  output.mp4
```

## Troubleshooting

### Font Not Found
```bash
# List available fonts
fc-list | grep -i arial

# Install common fonts (Ubuntu)
sudo apt-get install fonts-liberation fonts-dejavu

# Use absolute font path
force_style='FontName=/usr/share/fonts/truetype/arial.ttf,...'
```

### Path with Spaces
```bash
# Escape the path properly
ffmpeg -i input.mp4 -vf "subtitles='path with spaces/captions.srt'" output.mp4

# Or use double escaping
ffmpeg -i input.mp4 -vf "subtitles='path\\ with\\ spaces/captions.srt'" output.mp4
```

### Special Characters in SRT
```bash
# Ensure UTF-8 encoding
file -i captions.srt  # Check encoding

# Convert if needed
iconv -f ISO-8859-1 -t UTF-8 captions.srt > captions_utf8.srt
```

## Performance Tips

1. **Use `-c:a copy`** - Don't re-encode audio
2. **Hardware acceleration** - Use GPU if available
3. **Preset selection** - `ultrafast` for preview, `slow` for final
4. **CRF values** - 18-23 for high quality, 28-32 for preview
5. **Batch processing** - Process multiple videos in parallel

## Quality Recommendations

- **Font Size**: 32-40px for mobile (1080x1920)
- **Outline**: 2-3px minimum for readability
- **Colors**: High contrast (white + black outline)
- **Position**: Bottom center (Alignment=2)
- **Duration**: 1-4 seconds per caption
- **Line length**: 35-42 characters
