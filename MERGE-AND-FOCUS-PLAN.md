# Merge & Focus Plan - Getting Back on Track

## Current Situation Analysis

### ✅ What Works
1. **Educational Content Generation**
   - Layer 3 (Quizzes): ✅ 100% working, tested, validated
   - Layer 2 (Examples): ✅ Gemini + Manim generation works
   - Layer 1 (Main Content): ✅ Core logic complete
   - **Issue:** Remotion file path resolution (minor config fix)

2. **Quiz Validation System**
   - 30+ automated tests ✅
   - Pre-build validation ✅
   - Production-ready ✅

3. **Agent Registry**
   - Framework complete ✅
   - Extensible architecture ✅

4. **Services**
   - GeminiImageGenerator (NO TEXT policy) ✅
   - ManimRenderer ✅
   - VideoRenderer ✅
   - ExerciseGenerator ✅

### ⚠️ The Problem
**We have too much spread across branches and worktrees:**
- Main repo (`content-engine`) on master
- Worktree (`educational-content`) on feature/educational-content
- 5 feature branches with different capabilities
- Scattered documentation
- Risk of merge conflicts
- Lack of focus

---

## Immediate Action Plan (Today)

### Step 1: Commit Current Work (10 minutes)
```bash
cd /home/dachu/Documents/projects/worktrees/educational-content

# Stage everything
git add .

# Commit
git commit -m "feat: Educational content generation system

Complete implementation:
- 3-layer content generation (main/examples/quizzes)
- GeminiImageGenerator with NO TEXT policy
- Quiz validation system (30+ tests)
- Agent registry framework
- Manim + Gemini + Remotion integration
- Pre-build validation

Status: Core logic working, Remotion path config pending
Cost: ~$1.06 per 10-minute module"

# Push
git push origin feature/educational-content
```

### Step 2: Merge to Master (15 minutes)
```bash
# Go to main repo
cd /home/dachu/Documents/projects/content-engine

# Pull latest
git checkout master
git pull origin master

# Merge feature branch
git merge feature/educational-content --no-ff -m "Merge educational content generation system"

# If conflicts: resolve them (unlikely since master hasn't changed much)

# Test build
cd packages/backend
npm run build

# If build passes, push
git push origin master

# Tag release
git tag -a v1.0.0-education -m "Educational content generation system"
git push origin v1.0.0-education
```

### Step 3: Clean Up Worktree (5 minutes)
```bash
# Optional: Remove worktree after successful merge
cd /home/dachu/Documents/projects/worktrees
git worktree remove educational-content

# Or keep it for future educational work
# (Recommended: keep it, rebase on master regularly)
```

---

## Focused Development Strategy (Going Forward)

### Principle: **One Main Branch, Short-Lived Feature Branches**

```
master (always deployable)
   ↓
  Work directly on master for small changes
   ↓
  Create short-lived feature branches for bigger features (1-3 days max)
   ↓
  Merge back to master frequently
```

### When to Branch
**Branch for:**
- New major features (UI overhaul, new service)
- Experimental work (VEO integration, new AI models)
- Breaking changes

**Stay on master for:**
- Bug fixes
- Documentation
- Small enhancements
- Configuration changes

### Branch Naming
```
feature/ui-foundation          # Big: New UI system
feature/youtube-integration    # Medium: YouTube generation
fix/remotion-file-paths        # Small: Bug fix
experiment/veo-video           # Experimental: May not merge
```

---

## What to Do With Existing Branches

### Merge Immediately
1. ✅ **feature/educational-content** → Already merged above
2. **feature/voice-cloning-pipeline** → Core voice system (merge next)

### Merge Soon (This Week)
3. **feature/tiktok-multilingual** → TikTok shorts (useful, tested)
4. **feature/scenario-agents** → Agent improvements (if stable)

### Review & Decide
5. **feature/veo-video-generation** → Experimental, may archive

### Cleanup Process
```bash
# For each branch to merge:
git checkout master
git pull origin master
git merge feature/branch-name --no-ff
npm run build  # Test
git push origin master
git branch -d feature/branch-name  # Delete local
git push origin --delete feature/branch-name  # Delete remote
```

---

## Simplified Project Structure (After Merge)

```
content-engine/  (main repo)
   ├── master (always stable)
   ├── packages/
   │   ├── backend/  (all services here)
   │   ├── frontend/ (unified UI)
   │   └── shared/   (types)
   └── docs/
       ├── EDUCATION.md
       ├── YOUTUBE.md
       ├── TIKTOK.md
       └── API.md
```

**No more worktrees** (unless specifically needed for parallel work)

**No more long-lived feature branches** (max 3 days before merge)

---

## Focus Areas (Priority Order)

### 1. Fix Remotion File Paths (1 hour)
**Issue:** Remotion can't access local files via HTTP
**Fix:** Use `staticFile()` or copy files to public directory
**Location:** `src/services/video-renderer.ts`

### 2. Unified UI Foundation (Week 1)
**Goal:** Single UI for all capabilities
**Components:**
- Navigation sidebar
- Project selector
- Chat interface
- Cost tracker

**Start:** `feature/ui-foundation` branch (merge after 3 days max)

### 3. Educational Content UI (Week 2)
**Goal:** Generate educational content from UI
**Features:**
- Topic browser
- Generation trigger
- Video preview
- Quiz testing

### 4. YouTube Integration (Week 3)
**Goal:** Voice → YouTube video
**Features:**
- Voice recorder
- Script editor
- Video preview
- Cost estimation

### 5. Generic Code Chat (Week 4)
**Goal:** Claude Code replacement
**Features:**
- File tree
- Code viewer
- Chat with context
- Project awareness

---

## Daily Workflow (New Approach)

### Morning (30 min)
1. Pull latest master: `git pull origin master`
2. Review what changed (if anything)
3. Plan today's work (1-2 focused tasks)

### During Development
1. Work on master for small changes
2. Create branch for larger features
3. Commit frequently (every 1-2 hours)
4. Push frequently (every 4 hours)

### Evening (15 min)
1. Commit all work
2. Push to remote
3. If on feature branch > 2 days old → merge to master
4. Update docs

---

## Risk Mitigation

### Prevent Merge Conflicts
1. **Pull before you push** - Always sync first
2. **Small commits** - Easier to resolve conflicts
3. **Frequent merges** - Don't let branches diverge
4. **Communicate** - Know what others are working on

### Prevent Lost Work
1. **Push daily** - Remote backup
2. **Descriptive commits** - Easy to find old code
3. **Tag releases** - Stable points to roll back to

### Prevent Broken Master
1. **Test before merge** - `npm run build && npm test`
2. **Pre-commit hooks** - Auto-validation
3. **CI/CD** - Automated testing on push

---

## Success Metrics

### Technical Health
- [ ] Master builds successfully
- [ ] All tests pass
- [ ] <5 open branches
- [ ] <100 uncommitted files
- [ ] <7 days since last merge

### Productivity
- [ ] 1+ feature merged per week
- [ ] 1+ bug fixed per day
- [ ] Documentation up-to-date
- [ ] Code review within 24 hours

### Focus
- [ ] Clear roadmap (4 weeks ahead)
- [ ] 1-2 active tasks per person
- [ ] Daily standup (async or sync)
- [ ] Weekly demo (show progress)

---

## Action Items for Today

### Immediate (Next 30 minutes)
- [ ] Commit current work
- [ ] Push feature/educational-content
- [ ] Merge to master
- [ ] Tag v1.0.0-education
- [ ] Update CLAUDE.md with new structure

### This Afternoon
- [ ] Fix Remotion file path issue
- [ ] Merge feature/voice-cloning-pipeline
- [ ] Clean up old branches
- [ ] Start UI foundation planning

### This Week
- [ ] Merge all stable branches
- [ ] Delete merged branches
- [ ] Document all capabilities
- [ ] Start UI development

---

## Communication Plan

### Daily
- Commit messages (clear, descriptive)
- Push work to remote
- Update task list

### Weekly
- Demo progress (video or live)
- Review roadmap
- Adjust priorities

### Monthly
- Release notes
- Performance review
- Celebrate wins

---

## Key Principle

**"Master is king. Everything flows to and from master. Branches are temporary."**

This eliminates:
- ❌ Merge conflict nightmares
- ❌ Lost work in abandoned branches
- ❌ Confusion about which branch has what
- ❌ Scattered documentation

This enables:
- ✅ Always deployable master
- ✅ Clear history
- ✅ Easy rollbacks
- ✅ Team collaboration
- ✅ Focused development

---

## Next Steps

1. **Right now:** Merge educational content to master
2. **This afternoon:** Fix Remotion, merge voice pipeline
3. **Tomorrow:** Start UI foundation
4. **This week:** Merge all stable branches, clean up
5. **Next week:** Focus on UI only

**Ready to execute?** Let's get focused and ship! 🚀
