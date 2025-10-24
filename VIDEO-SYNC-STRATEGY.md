# Video Sync Strategy - Audio/Visual Synchronization

**Created:** 2025-10-24
**Issue:** Videos were showing but not in sync with voice
**Solution:** Intelligent duration detection and sync

---

## The Problem

### Original Issue:
```
Expected duration:  25 seconds (specified in module)
Audio duration:     17-18 seconds (actual from ElevenLabs)
Manim video:        20 seconds (actual from rendering)
```

**Old strategy:**
- Used `-shortest` flag in FFmpeg
- Result: Video cut off at 18s (when audio ended)
- Lost last 2 seconds of animation
- **Not in sync!**

---

## The Solution

### Intelligent Sync Strategy:

**Step 1: Detect Actual Durations**
```typescript
const videoDuration = await getVideoDuration(videoPath);  // e.g., 20.27s
const audioDuration = await getAudioDuration(audioPath);  // e.g., 17.50s
```

**Step 2: Smart Sync Decision**

**Case 1: Video Longer than Audio** (most common for Manim)
```bash
Video: 20.27s
Audio: 17.50s

Action: Extend audio with silence
Command: ffmpeg -i video.mp4 -i audio.mp3 \
  -filter_complex "[1:a]apad=whole_dur=20.27[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac \
  -t 20.27 output.mp4
```

**Case 2: Audio Longer than Video**
```bash
Video: 15.00s
Audio: 18.00s

Action: Extend video by freezing last frame
Command: ffmpeg -i video.mp4 -i audio.mp3 \
  -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=3.0[v]" \
  -map "[v]" -map 1:a -c:a aac \
  -t 18.0 output.mp4
```

**Case 3: Durations Match**
```bash
Video: 20.00s
Audio: 20.00s

Action: Simple combine
Command: ffmpeg -i video.mp4 -i audio.mp3 \
  -c:v copy -c:a aac -shortest output.mp4
```

---

## Implementation

### Code Location:
`packages/backend/src/services/ffmpeg-video-combiner.ts`

### Key Functions:

```typescript
async getVideoDuration(videoPath: string): Promise<number> {
  // Uses ffprobe to get exact video duration
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration ...`
  );
  return parseFloat(stdout.trim());
}

async getAudioDuration(audioPath: string): Promise<number> {
  // Uses ffprobe to get exact audio duration
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration ...`
  );
  return parseFloat(stdout.trim());
}

async processScene(scene, index): Promise<string> {
  // 1. Detect durations
  const videoDuration = await this.getVideoDuration(visual);
  const audioDuration = await this.getAudioDuration(audio);

  // 2. Smart sync
  if (videoDuration < audioDuration) {
    // Extend video (freeze last frame)
  } else if (videoDuration > audioDuration) {
    // Extend audio (add silence)
  } else {
    // Perfect match - simple combine
  }
}
```

---

## Results

### Test Output (Scene 2):
```
Video duration: 20.266667s
Audio duration: 17.502s
Action: 🔇 Extending audio with silence to match video (20.266667s)
Result: ✅ Perfect sync - all animation visible
```

### Test Output (Scene 3):
```
Video duration: 20.266667s
Audio duration: 15.542813s
Action: 🔇 Extending audio with silence to match video (20.266667s)
Result: ✅ Perfect sync - all animation visible
```

---

## Why This Strategy Works

### ✅ Advantages:

1. **No Animation Loss**
   - All Manim frames are preserved
   - No cutting off at awkward moments

2. **Audio Clarity**
   - Voice narration plays completely
   - Natural silence at end (not jarring cuts)

3. **Flexible**
   - Handles any duration mismatch
   - Works for both video and image scenes

4. **Accurate**
   - Uses actual measured durations
   - Not relying on estimates

### ❌ Old Approach Problems:

1. **Used `-shortest` flag**
   - Cut to shortest input
   - Lost valuable content

2. **No duration detection**
   - Blindly combined files
   - Unpredictable results

3. **Awkward cuts**
   - Animation could stop mid-motion
   - Audio could cut mid-sentence

---

## Scene Types

### Manim Video Scenes:
```
Input:  Manim MP4 (no audio) + Voice MP3
Method: Use video duration as master
Output: MP4 with synced audio (silence padded if needed)
```

### Gemini Image Scenes:
```
Input:  Static PNG + Voice MP3
Method: Use audio duration as master
Output: MP4 showing image for exact audio duration
```

---

## Example Timeline

### Scene 1 (Image + Audio):
```
Image: intro.png
Audio: scene_1.mp3 (10.5s)
Output: 10.5s video (image showing while audio plays)
```

### Scene 2 (Manim + Audio):
```
Video: theorem.mp4 (20.27s)
Audio: scene_2.mp3 (17.50s)
Output: 20.27s video (audio plays, then 2.77s silence)
```

### Scene 3 (Manim + Audio):
```
Video: example.mp4 (20.27s)
Audio: scene_3.mp3 (15.54s)
Output: 20.27s video (audio plays, then 4.73s silence)
```

### Final Video:
```
Scene 1: 10.5s
Scene 2: 20.27s
Scene 3: 20.27s
Total: ~51s (perfectly synced!)
```

---

## Edge Cases Handled

### 1. Very Short Audio
```
Video: 25s
Audio: 5s

Action: Extend audio to 25s (20s silence)
Result: Shows full animation, brief narration, then silent
```

### 2. Very Long Audio
```
Video: 10s
Audio: 30s

Action: Extend video to 30s (freeze last frame for 20s)
Result: Animation plays, then freezes while audio continues
```

### 3. Identical Durations
```
Video: 20s
Audio: 20s

Action: Simple copy codec combine
Result: Fast, perfect sync
```

---

## FFmpeg Commands Used

### Extend Audio (most common):
```bash
ffmpeg -i video.mp4 -i audio.mp3 \
  -filter_complex "[1:a]apad=whole_dur=VIDEO_DURATION[a]" \
  -map 0:v -map "[a]" \
  -c:v copy -c:a aac \
  -t VIDEO_DURATION \
  output.mp4 -y
```

### Extend Video (less common):
```bash
ffmpeg -i video.mp4 -i audio.mp3 \
  -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=EXTRA_TIME[v]" \
  -map "[v]" -map 1:a \
  -c:a aac \
  -t AUDIO_DURATION \
  output.mp4 -y
```

### Image to Video (exact audio duration):
```bash
ffmpeg -loop 1 -i image.png -i audio.mp3 \
  -c:v libx264 -tune stillimage \
  -c:a aac \
  -t AUDIO_DURATION \
  -pix_fmt yuv420p \
  output.mp4 -y
```

---

## Future Improvements

### Potential Enhancements:

1. **Better Narration Timing**
   - Generate audio FIRST
   - Tell Manim exact duration needed
   - Manim renders to match audio

2. **Speed Adjustment**
   - Instead of silence, slow down/speed up slightly
   - `setpts` filter for video
   - `atempo` filter for audio

3. **Crossfade Transitions**
   - Smooth scene changes
   - Fade audio between scenes

4. **Background Music**
   - Add subtle music track
   - Duck volume during narration
   - Fill silent gaps

---

## Testing Checklist

To verify sync is working:

- [ ] Play final video and listen for audio
- [ ] Check if all Manim animations are visible
- [ ] Verify no jarring cuts in the middle of speech
- [ ] Confirm scene transitions are smooth
- [ ] Test with different duration scenarios

---

## Troubleshooting

### Issue: Audio cuts off early
**Cause:** Using `-shortest` flag without duration detection
**Fix:** Use smart sync strategy with `apad` filter

### Issue: Video stops but audio continues
**Cause:** Audio longer than video
**Fix:** Extend video with `tpad` filter (freeze last frame)

### Issue: Silence at end of scenes
**Cause:** Audio shorter than video (by design)
**Fix:** This is intentional to preserve full animation

### Issue: Video much longer than expected
**Cause:** Concatenation issue or wrong duration calculation
**Fix:** Check temp files and concat list for errors

---

## Summary

**The sync strategy ensures:**
✅ All visual content is preserved
✅ All audio narration is heard
✅ No awkward mid-speech cuts
✅ Professional, smooth playback
✅ Predictable, reliable results

**Master timeline:**
- Manim scenes: Use **video duration**
- Image scenes: Use **audio duration**
- Always detect actual durations (no estimates)
- Extend shorter input to match longer one
