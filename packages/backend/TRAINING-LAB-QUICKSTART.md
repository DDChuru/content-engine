# 🚀 TRAINING LAB - QUICK START GUIDE

## ✅ CURRENT STATUS

**Frontend:** Running on http://localhost:3000
**Backend:** Running on http://localhost:3001
**Training Lab URL:** http://localhost:3000/training-lab

---

## 🎯 ACCESS THE TRAINING LAB

### Option 1: Direct URL
Open your browser and navigate to:
```
http://localhost:3000/training-lab
```

### Option 2: From Homepage
1. Go to `http://localhost:3000`
2. Click the purple **"Training Lab"** button (🧪 Flask icon) in the top-right header
3. You'll be redirected to the Training Lab page

---

## 🧪 TESTING THE TRAINING LAB

### Test 1: Initial Page Load
**Expected Result:**
- Page displays "🧪 AGENT TRAINING LAB" heading
- Left column shows:
  - Agent: Sets Tutor
  - LLM: ✓ Claude Sonnet 4.5
  - Tools Available (Manim, collision detection, text positioning)
  - Memory/Context section (should be empty or show error if backend not connected)
  - Reset Agent Memory button
  - Test Problem form (intersection, Set A, Set B)
  - Teaching Mode section
- Right column: Empty (no results yet)

### Test 2: Check Backend Connection
Open browser DevTools (F12) → Console tab

**What to look for:**
- API call to `http://localhost:3001/api/sets-agent/memory` on page load
- If successful: Memory data appears in right column
- If failed: Check console for CORS or connection errors

### Test 3: Generate Visualization
1. Leave default problem (Intersection, A={1,2,3,4,5}, B={4,5,6,7,8})
2. Click "🎨 Generate Visualization" button
3. Watch loading state
4. **Expected:** Validation results appear in right column

**Possible Outcomes:**
- ✅ Success: Green banner, clarity score, no collisions
- ❌ Failure: Red banner, collision count, issues list
- ⚠️ Error: Check console for API errors

### Test 4: Add Spatial Rule
1. Ensure "Spatial (positioning, layout)" is selected
2. Type in text area: `Never use arrows to intersection - causes collisions`
3. Click "➕ Add Rule to Memory"
4. **Expected:** Memory version increments, rule appears in memory JSON

### Test 5: Add Pedagogy Rule
1. Select "Pedagogy (explanation style)"
2. Type: `Explain elements one-by-one conversationally`
3. Click "➕ Add Rule to Memory"
4. **Expected:** Memory version increments again

### Test 6: Generate After Teaching
1. Click "🎨 Generate Visualization" again
2. **Expected:** Better results (higher clarity score, fewer/no collisions)
3. **Expected:** Memory version increments with successful pattern

### Test 7: Test New Problem
1. Change operation to "Union (∪)"
2. Change Set A to: `1, 2, 3`
3. Change Set B to: `3, 4, 5`
4. Click "🎨 Generate Visualization"
5. **Expected:** Agent applies learned rules to new problem

### Test 8: Reset Agent
1. Click "Reset Agent Memory"
2. **Expected:** Memory cleared, version resets to 1
3. All rules disappear from memory JSON

---

## 🐛 TROUBLESHOOTING

### Issue: "Memory not loading" or Empty State
**Check:**
```bash
# Verify backend is running
curl http://localhost:3001/api/sets-agent/memory
```

**Expected Response:**
```json
{
  "memory": {
    "version": 1,
    "spatialRules": [],
    "pedagogyRules": [],
    "successfulPatterns": 0,
    "failures": 0,
    "totalKnowledge": 0
  }
}
```

**If backend not running:**
```bash
cd packages/backend
npm run dev
```

### Issue: CORS Errors in Browser Console
**Symptom:** `Access-Control-Allow-Origin` error

**Fix:** Backend should allow `localhost:3000`. Check `packages/backend/src/index.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001']
}));
```

### Issue: "Generate" Button Does Nothing
**Check Browser Console for:**
- Network tab: Is the request going to `http://localhost:3001/api/sets-agent/generate`?
- Response: What status code? (200 OK, 500 error, 404 not found?)

**Common Causes:**
1. Backend not running → Start with `npm run dev` in packages/backend
2. API route not registered → Check `src/index.ts` has `app.use('/api/sets-agent', setsAgentRoutes)`
3. ClaudeService error → Check .env has valid `ANTHROPIC_API_KEY`

### Issue: Validation Always Fails
**This is EXPECTED for the first generation!**

The agent starts with NO spatial or pedagogy rules, so it will likely create collisions. This is the whole point of the demo:
1. First attempt: Fails (collisions)
2. Teach spatial rules
3. Teach pedagogy rules
4. Second attempt: Success!

### Issue: Frontend Won't Start
**Symptom:** `next: not found`

**Fix:** Install dependencies:
```bash
cd packages/frontend
npm install
npm run dev
```

---

## 📹 RECORDING WITH OBS

### Recommended OBS Settings

**Scene Setup:**
1. **Display Capture:** Capture browser window showing Training Lab
2. **Window Size:** Full screen browser at 1920x1080
3. **Zoom:** Set browser zoom to 100% or 110% for readability

**Recording Settings:**
- Output format: MP4
- Video bitrate: 8000 Kbps
- Resolution: 1920x1080
- Frame rate: 30 FPS
- Audio: Include microphone for narration

**Workflow:**
1. Reset agent memory
2. Start OBS recording
3. Follow Episode 1 scene sequence (see EPISODE-1-FULL-PRODUCTION-PLAN.md)
4. Narrate while clicking through UI
5. Stop recording
6. Import to Kdenlive for editing

---

## 🎬 RECORDING CHECKLIST

**Before You Start:**
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Navigate to `/training-lab` successfully
- [ ] Agent memory reset to empty state
- [ ] Close unnecessary browser tabs/windows
- [ ] Disable browser notifications
- [ ] Clear browser console
- [ ] Set browser window to 1920x1080 or full screen
- [ ] OBS configured and tested
- [ ] Microphone tested
- [ ] Have narration script ready (EPISODE-1-FULL-PRODUCTION-PLAN.md)

**During Recording:**
- [ ] Scene 3: Show agent setup (empty memory)
- [ ] Scene 4: Generate first attempt (collision failure)
- [ ] Scene 6: Add spatial rule, add pedagogy rule
- [ ] Scene 7: Generate second attempt (success!)
- [ ] Scene 8: Test new problem (union instead of intersection)

---

## 📊 API ENDPOINTS REFERENCE

All endpoints are prefixed with `http://localhost:3001/api/sets-agent/`

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/memory` | GET | None | Current memory state |
| `/reset` | POST | None | Empty memory (v1) |
| `/generate` | POST | `{operation, setA, setB, question}` | Validation result + video path |
| `/teach/spatial` | POST | `{rule: string}` | Updated memory |
| `/teach/pedagogy` | POST | `{rule: string}` | Updated memory |

**Example Generate Request:**
```bash
curl -X POST http://localhost:3001/api/sets-agent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "intersection",
    "setA": [1,2,3,4,5],
    "setB": [4,5,6,7,8],
    "question": "Find A ∩ B"
  }'
```

---

## 🎯 NEXT STEPS

After testing the Training Lab:

1. **Record Episode 1** following the production plan
2. **Create missing visual assets:**
   - AI Agent diagram (LLM + Tools + Memory)
   - Problem statement slide
   - LLM knowledge test graphic
   - Tool usage analysis graphic
   - Memory comparison graphic
3. **Edit in Kdenlive:**
   - Import OBS recordings
   - Add brain visualization videos
   - Add text overlays
   - Add transitions
   - Export final video

---

**Last Updated:** 2025-10-25 05:22 UTC
**Status:** ✅ Ready for testing and recording
**Next:** Open `http://localhost:3000/training-lab` in your browser!
