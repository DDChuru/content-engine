# 🎬 Pre-Recording Checklist - Episode 1

## ✅ Technical Setup (5 minutes)

### 1. Backend Running
```bash
cd /home/dachu/Documents/projects/worktrees/educational-content/packages/backend
npm run dev
```
- [ ] Server running on port 3001
- [ ] No errors in console
- [ ] Claude API key loaded

### 2. Initialize System
```bash
# Initialize default agents
curl -X POST http://localhost:3001/api/agents/initialize-defaults

# Reset Sets Agent
curl -X POST http://localhost:3001/api/sets-agent/reset

# Verify memory is empty
curl http://localhost:3001/api/sets-agent/memory
```
- [ ] 5 agents registered
- [ ] Sets agent memory empty (version: 1)
- [ ] All endpoints responding

### 3. Test Demo Script
```bash
# Do a dry run
./demo-episode-1.sh
```
- [ ] All curl commands work
- [ ] JSON responses valid
- [ ] No API errors

### 4. Screen Recording Setup
- [ ] OBS Studio open
- [ ] Recording at 1080p 60fps
- [ ] Audio input: Microphone selected
- [ ] Output folder: `~/Videos/agent-training-ep1/`

### 5. Terminal Setup
- [ ] Terminal maximized (full screen)
- [ ] Font size readable (18-20pt)
- [ ] Color scheme: Dark background
- [ ] `jq` installed for pretty JSON: `sudo apt install jq`

### 6. Browser Setup (for Memory Viewer)
```bash
# Open browser to localhost
firefox http://localhost:3001/api/sets-agent/memory &
```
- [ ] Browser window sized for split screen
- [ ] JSON viewer extension installed (optional)

## 📹 Recording Equipment

### Audio
- [ ] Microphone tested (record 10s, playback)
- [ ] No background noise
- [ ] Pop filter in place
- [ ] Levels: -12dB to -6dB

### Video
- [ ] Screen clean (close unnecessary apps)
- [ ] Notifications disabled
- [ ] Battery/power plugged in
- [ ] Do Not Disturb mode ON

## 🎨 Visual Assets Ready

### Generated Videos
```bash
ls -lh output/sets-demo/
```
- [ ] `sets-EDUCATIONAL-FINAL.mp4` (collision-free version)
- [ ] `sets-COLLISION-FIXED-FINAL.mp4` (backup)

### Screenshots Needed
Will capture during recording:
- [ ] Empty memory state
- [ ] Failed generation response
- [ ] Memory after teaching
- [ ] Perfect generation response
- [ ] Final memory state

## 📝 Script Ready

### Files to Have Open
1. `EPISODE-1-RECORDING-SCRIPT.md` - Full narration
2. `demo-episode-1.sh` - Commands to run
3. Terminal window - For execution
4. Browser - For memory visualization

### Narration Points Memorized
- [ ] Cold open hook (0:00-0:20)
- [ ] Key phrases:
  - "It immediately failed"
  - "The agent KNOWS it failed"
  - "I'm going to teach it"
  - "Nine out of ten!"
  - "The agent learned"
  - "Here's the crazy part"

## 🎯 Recording Flow

### Act 1: The Failure (0:30-1:30)
```bash
# Scene 1: Empty brain
curl -X POST http://localhost:3001/api/sets-agent/reset | jq '.'

# Scene 2: First attempt
curl -X POST http://localhost:3001/api/sets-agent/generate \
  -H "Content-Type: application/json" \
  -d '{"operation":"intersection","setA":[1,2,3,4,5],"setB":[4,5,6,7,8],"question":"Find A ∩ B"}' | jq '.result'
```

### Act 2: The Teaching (1:30-3:00)
```bash
# Teach spatial rules
curl -X POST http://localhost:3001/api/sets-agent/teach/spatial \
  -H "Content-Type: application/json" \
  -d '{"rule": "Never use arrows to intersection"}' | jq '.'

# Teach pedagogy rules
curl -X POST http://localhost:3001/api/sets-agent/teach/pedagogy \
  -H "Content-Type: application/json" \
  -d '{"rule": "Explain one-by-one conversationally"}' | jq '.'
```

### Act 3: The Breakthrough (3:00-4:00)
```bash
# Third attempt - perfect!
curl -X POST http://localhost:3001/api/sets-agent/generate \
  -H "Content-Type: application/json" \
  -d '{"operation":"intersection","setA":[1,2,3,4,5],"setB":[4,5,6,7,8],"question":"Find A ∩ B"}' | jq '.result'
```

### Act 4: The Test (4:00-4:45)
```bash
# New problem
curl -X POST http://localhost:3001/api/sets-agent/generate \
  -H "Content-Type: application/json" \
  -d '{"operation":"union","setA":[1,2,3],"setB":[3,4,5],"question":"Find A ∪ B"}' | jq '.result'
```

### Act 5: The Revelation (4:45-5:00)
```bash
# Memory usage
curl http://localhost:3001/api/agents/memory-usage | jq '.'
```

## ⚡ Quick Commands

### Emergency Reset
```bash
# If something goes wrong mid-recording
curl -X POST http://localhost:3001/api/sets-agent/reset
curl -X POST http://localhost:3001/api/agents/initialize-defaults
```

### Check Backend Status
```bash
curl http://localhost:3001/api/health
```

### View Agent Memory Anytime
```bash
curl http://localhost:3001/api/sets-agent/memory | jq '.'
```

## 🎬 Final Checks (Right Before Recording)

- [ ] Glass of water nearby
- [ ] Phone on silent
- [ ] Bathroom break taken
- [ ] Energy level HIGH
- [ ] Script reviewed once more
- [ ] Deep breath... LET'S GO!

## 🚀 Recording Commands

### Start Recording
1. Open OBS
2. Click "Start Recording"
3. Run: `./demo-episode-1.sh`
4. Follow script for narration
5. Pause script with ENTER between scenes

### Alternative: Manual Commands
If you want more control, run commands manually:
```bash
# Follow EPISODE-1-RECORDING-SCRIPT.md
# Copy-paste each curl command as you narrate
```

## 📊 Expected Timings

| Scene | Time | Duration |
|-------|------|----------|
| Cold Open | 0:00-0:20 | 20s |
| Act 1: Failure | 0:30-1:30 | 60s |
| Act 2: Teaching | 1:30-3:00 | 90s |
| Act 3: Breakthrough | 3:00-4:00 | 60s |
| Act 4: Test | 4:00-4:45 | 45s |
| Act 5: Revelation | 4:45-5:00 | 15s |
| **Total** | | **5:00** |

## 🎨 Post-Production Notes

### Footage to Capture
- [ ] Full screen recording (main take)
- [ ] Close-up of JSON responses (B-roll)
- [ ] Memory panel updates (B-roll)
- [ ] Terminal commands being typed (B-roll if needed)

### Visual Effects to Add
1. Memory panel overlay (top-right corner)
2. Success/failure counter (bottom-left)
3. Collision detection circles (red/green)
4. Cost comparison graphic (Act 5)

### Audio
- [ ] Remove long pauses
- [ ] Add background music (subtle, not distracting)
- [ ] Normalize audio levels
- [ ] Add sound effects (optional: success chimes, failure buzzer)

## 📤 After Recording

### Immediate
- [ ] Save OBS recording
- [ ] Backup to external drive
- [ ] Review footage for any issues

### Editing
- [ ] Import to DaVinci Resolve / Premiere
- [ ] Add visual effects
- [ ] Create thumbnail
- [ ] Export at 1080p 60fps

### YouTube Upload
- [ ] Title: "My AI Agent Failed at Sets... So I Taught It to Fix Itself"
- [ ] Description with timestamps
- [ ] Tags: AI, machine learning, educational AI
- [ ] Thumbnail uploaded
- [ ] End screen with Episode 2 link

---

## ✅ YOU'RE READY!

**Everything is set up. The system works. The demo is polished.**

**All that's left is to HIT RECORD and make YouTube history!** 🎬🚀

**Good luck! You've got this!** 💪
