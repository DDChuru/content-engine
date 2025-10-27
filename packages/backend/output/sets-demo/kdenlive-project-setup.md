# 🎬 KDENLIVE PROJECT SETUP - EPISODE 1

## 📹 Your Video Assets

Located in: `/home/dachu/Documents/projects/worktrees/educational-content/packages/backend/output/sets-demo/`

### Import these files into Kdenlive:

1. **BEFORE-LEARNING-COLLISION.mp4** (165KB)
   - The FAILURE video
   - Shows arrow/label colliding with numbers
   - Use at: 0:30-1:30 (Act 1)

2. **sets-EDUCATIONAL-FINAL.mp4** (244KB)
   - The SUCCESS video  
   - Clean, perfect visualization
   - Use at: 3:00-4:00 (Act 3)

## 🎙️ Recording Your Narration

### Option 1: Record Voiceover in Kdenlive
1. File → Render → Voice Over Tool
2. Record directly while watching the videos
3. Perfect sync!

### Option 2: Record Audio Separately
Use Audacity or built-in recorder:
```bash
# Built-in GNOME recorder
gnome-sound-recorder &
```

## 🎬 Timeline Structure (5 minutes total)

```
TRACK 1 (Video):
├─ [0:00-0:20] Title card (create in Kdenlive)
├─ [0:20-0:30] BEFORE-LEARNING-COLLISION.mp4 (intro)
├─ [0:30-1:30] BEFORE-LEARNING-COLLISION.mp4 (full narration)
├─ [1:30-3:00] Screen capture: Terminal teaching commands
├─ [3:00-4:00] sets-EDUCATIONAL-FINAL.mp4 (success!)
├─ [4:00-4:45] Screen capture: Memory JSON
└─ [4:45-5:00] Memory usage stats + outro

TRACK 2 (Audio):
└─ Your narration (continuous)
```

## 📝 Quick Tutorial Commands to Screen Capture

For the "Teaching" section (Act 2), you'll screen-record these commands:

```bash
# Reset agent
curl -X POST http://localhost:3001/api/sets-agent/reset | jq '.'

# Teach spatial rule
curl -X POST http://localhost:3001/api/sets-agent/teach/spatial \
  -H "Content-Type: application/json" \
  -d '{"rule": "Never use arrows to intersection - causes collisions"}' | jq '.'

# Teach pedagogy rule
curl -X POST http://localhost:3001/api/sets-agent/teach/pedagogy \
  -H "Content-Type: application/json" \
  -d '{"rule": "Explain elements one-by-one conversationally"}' | jq '.'

# Show memory
curl http://localhost:3001/api/sets-agent/memory | jq '.'
```

## 🎨 Kdenlive Tips

### Add Title Card (0:00-0:20)
1. Project → Add Title Clip
2. Text: "Episode 1: My AI Agent Failed at Sets"
3. Subtitle: "So I Taught It to Fix Itself"

### Add Text Overlays
1. Effects → Text
2. Drag onto video clip
3. Add labels like "❌ COLLISION" or "✅ PERFECT"

### Transitions
1. Effects → Fade In/Out
2. Drag between clips for smooth transitions

## 🎬 Workflow Recommendation

### EASY WAY: Do everything in Kdenlive!

1. **Import both MP4 files** into Kdenlive project bin
2. **Drag to timeline** where needed
3. **Record voiceover** directly in Kdenlive while watching
4. **Add text overlays** for emphasis
5. **Export** final video

### Or if you prefer:

1. **Record voiceover separately** (Audacity)
2. **Import audio + videos** into Kdenlive
3. **Sync and edit**
4. **Export**

## 🚀 Quick Start

```bash
# Open Kdenlive
kdenlive &

# In Kdenlive:
# 1. File → New Project → "Episode-1-Sets-Agent"
# 2. Project Bin → Add Clip → Navigate to:
#    /home/dachu/Documents/projects/worktrees/educational-content/packages/backend/output/sets-demo/
# 3. Import BEFORE-LEARNING-COLLISION.mp4
# 4. Import sets-EDUCATIONAL-FINAL.mp4
# 5. Drag to timeline and start editing!
```

## 📊 Export Settings

**For YouTube:**
- Format: MP4
- Video codec: H.264
- Resolution: 1920x1080 (1080p)
- Frame rate: 30 fps
- Audio codec: AAC
- Bitrate: 8-12 Mbps

---

**You're ready to create! Kdenlive gives you full control over everything.** 🎬
