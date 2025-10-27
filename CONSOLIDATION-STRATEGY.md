# Content Engine Consolidation & Forward Strategy

## Current State Analysis

### Repository Structure
- **Main Repo:** `/home/dachu/Documents/projects/content-engine` (on `master`)
- **Worktree:** `/home/dachu/Documents/projects/worktrees/educational-content` (on `feature/educational-content`)

### Active Branches
1. `master` - Main production branch
2. `feature/educational-content` - Educational content generation (current worktree)
3. `feature/scenario-agents` - Agent system architecture
4. `feature/tiktok-multilingual` - TikTok content generation
5. `feature/veo-video-generation` - VEO video capabilities
6. `feature/voice-cloning-pipeline` - Voice cloning + ElevenLabs

---

## What We've Built (feature/educational-content)

### ✅ Complete Systems

#### 1. **Educational Content Generation (3-Layer)**
- **Layer 1:** Main content videos (Manim + Gemini + Remotion)
- **Layer 2:** Worked examples with step-by-step solutions
- **Layer 3:** Interactive quizzes with automated validation
- **Cost:** ~$1.06 per 10-minute module
- **Status:** Ready to test

**Files:**
- `src/services/topic-content-generator.ts`
- `src/services/examples-generator.ts`
- `src/services/exercise-generator.ts`
- `src/services/gemini-image-generator.ts` (NEW - NO TEXT policy)
- `src/services/video-renderer.ts`
- `src/services/manim-renderer.ts`
- `src/routes/education.ts`

#### 2. **Quiz Validation System**
- Smart answer normalization (handles format variations)
- 30+ automated unit tests
- Integration tests
- Pre-build validation
- **Status:** Production-ready

**Files:**
- `src/tests/quiz-validation.test.ts`
- `src/tests/exercise-generator.test.ts`
- `src/scripts/validate-quiz-generation.ts`
- `QUIZ-VALIDATION-GUIDE.md`

#### 3. **Agent Registry System**
- Domain-specific agents (Sets, Geometry, etc.)
- Confidence-based routing
- Extensible architecture
- **Status:** Framework complete, needs more agents

**Files:**
- `src/agents/registry.ts`
- `src/agents/base-agent.ts`
- `src/agents/sets-agent.ts`
- `src/routes/agent-registry-routes.ts`

#### 4. **WebSlides-Remotion Video System**
- Professional video composition
- Multiple themes (education-dark, marketing, etc.)
- Scene transitions
- Audio sync
- **Status:** Working

**Files:**
- `src/remotion/compositions/EducationalLesson.tsx`
- `src/remotion/components/webslides/`
- `WEBSLIDES-REMOTION-GUIDE.md`

#### 5. **Firebase Education Schema**
- Syllabus import (Cambridge IGCSE)
- Topic/concept/exercise structure
- Progress tracking ready
- **Status:** Schema designed, import scripts ready

**Files:**
- `src/scripts/import-cambridge-igcse.ts`
- `src/scripts/test-import-validation.ts`
- `EDUCATION-FIREBASE-SCHEMA.md`

---

## What Needs to Happen Now

### Phase 1: Consolidation (Week 1)

#### Step 1.1: Commit Current Work ✅
```bash
cd /home/dachu/Documents/projects/worktrees/educational-content

# Stage all new files
git add .

# Commit with detailed message
git commit -m "feat: Complete educational content generation system

- Add 3-layer content generation (main/examples/quizzes)
- Add GeminiImageGenerator with NO TEXT policy
- Add quiz validation system with 30+ tests
- Add agent registry framework
- Add WebSlides-Remotion video rendering
- Add Firebase education schema
- Fix visual asset generation (Manim + Gemini)
- Add pre-build validation

Cost: ~$1.06 per 10-minute educational module
Status: Ready for testing"

# Push to remote
git push origin feature/educational-content
```

#### Step 1.2: Test Before Merge
```bash
# Run all validation
npm run validate-quiz
npm run test

# Test educational content generation (if Firebase configured)
# curl -X POST http://localhost:3001/api/education/generate-topic ...
```

#### Step 1.3: Merge to Master
```bash
# Switch to main repo
cd /home/dachu/Documents/projects/content-engine

# Pull latest
git checkout master
git pull origin master

# Merge feature branch
git merge feature/educational-content

# Resolve any conflicts (unlikely if master hasn't changed much)
# Test again
cd packages/backend
npm run build
npm test

# Push to master
git push origin master
```

---

### Phase 2: UI Architecture (Week 1-2)

We need a **unified UI** that handles all our capabilities:

#### UI Requirements

1. **Content Generation Hub**
   - Educational content (Cambridge IGCSE, etc.)
   - YouTube videos (long-form)
   - TikTok shorts (multilingual)
   - User manuals (codebase analysis)
   - SOPs (HACCP/iClean)

2. **Agent Workspace** (Claude Code replacement)
   - Chat interface with code context
   - Project selector (all Firebase projects)
   - Task tracking & status
   - Cost monitoring
   - File tree + code viewer

3. **Voice-to-Agent Pipeline**
   - Record voice → ElevenLabs clone
   - Generate presentations
   - Generate educational content
   - Generate YouTube videos

4. **Training Lab** (existing but needs integration)
   - Agent training interface
   - Demo episodes
   - Spatial guardrails testing

#### Proposed UI Architecture

```
packages/frontend/
  app/
    (root)/                    # Landing page + project selector
    chat/                      # Generic chat with code context
    education/                 # Educational content generation
      topics/                  # Browse/generate topics
      quiz/                    # Quiz generation/testing
      preview/                 # Video preview
    youtube/                   # YouTube content generation
    tiktok/                    # TikTok shorts generation
    voice-agent/               # Voice → Presentation
    training-lab/              # Agent training (existing)
    user-journey/              # User manual generation (existing)
  components/
    ui/                        # Shadcn components (existing)
    agent-chat/                # Reusable chat interface
    project-selector/          # Firebase project picker
    cost-tracker/              # Real-time cost display
    video-player/              # Preview generated videos
    file-tree/                 # Code explorer
    code-viewer/               # Syntax highlighted viewer
```

#### Key UI Features

1. **Unified Navigation**
   - Sidebar with all capabilities
   - Project context at top
   - Cost tracker always visible

2. **Shared Components**
   - `<AgentChat />` - Used across education, YouTube, generic chat
   - `<ProjectSelector />` - Switch Firebase projects
   - `<CostTracker />` - Track API usage ($)
   - `<StatusMonitor />` - Show generation progress

3. **State Management**
   - Use Zustand or Redux for global state
   - Project context
   - User preferences
   - Generation history

---

### Phase 3: Parallel Development Strategy (Week 2+)

Once merged to master, create focused feature branches:

#### Branch Strategy

```
master (stable)
  ├── feature/ui-foundation           # New unified UI
  ├── feature/youtube-integration     # YouTube content system
  ├── feature/tiktok-integration      # TikTok shorts system
  ├── feature/agent-workspace         # Claude Code replacement
  └── feature/education-testing       # Test educational pipeline
```

#### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout master
   git pull origin master
   git checkout -b feature/ui-foundation
   ```

2. **Work in Isolation**
   - Each developer/feature in own branch
   - Regular commits
   - Push to remote frequently

3. **Regular Rebasing**
   ```bash
   # Pull latest master changes
   git fetch origin master
   git rebase origin/master

   # Resolve conflicts if any
   # Continue development
   ```

4. **Merge When Complete**
   - Create PR
   - Review
   - Merge to master
   - Delete feature branch

---

## Capability Mapping (What We Can Do Now)

### 1. Educational Content Generation
**Input:** Cambridge IGCSE syllabus (or custom)
**Output:** SCORM packages with videos + quizzes
**Cost:** ~$1.06 per 10-minute module
**Status:** ✅ Ready to test
**UI Needed:** Topic browser, generation trigger, preview

### 2. YouTube Content Generation
**Input:** Voice recording + topic
**Output:** Full YouTube video with animations
**Cost:** ~$0.94 per 10-minute video
**Status:** ⚠️ Needs integration (voice pipeline exists)
**UI Needed:** Voice recorder, script editor, preview

### 3. TikTok Shorts Generation
**Input:** Topic + target language
**Output:** 60-second multilingual video
**Cost:** ~$0.20 per short
**Status:** ⚠️ In separate branch (feature/tiktok-multilingual)
**UI Needed:** Template selector, language picker, preview

### 4. User Manual Generation
**Input:** GitHub repo URL
**Output:** HTML user manual with screenshots
**Cost:** ~$2-5 per manual
**Status:** ✅ Working (User Journey Agent)
**UI Needed:** Repo input, feature selector, preview

### 5. SOP/Work Instruction Generation
**Input:** PDF or description
**Output:** HACCP-compliant SOP
**Cost:** ~$0.50-1 per SOP
**Status:** ✅ Working (Document Extraction Service)
**UI Needed:** PDF upload, template selector, preview

### 6. Generic Code Chat
**Input:** Natural language + project context
**Output:** Code changes, explanations, analysis
**Cost:** ~$0.05-0.10 per message
**Status:** ✅ Backend ready, needs UI
**UI Needed:** Chat interface with file tree

### 7. Voice-to-Presentation
**Input:** Voice recording (60+ seconds)
**Output:** Cloned voice → Generated presentation video
**Cost:** Voice clone: $3 one-time, then $0.30/1K chars
**Status:** ✅ Working (ElevenLabs pipeline)
**UI Needed:** Voice recorder, topic input, preview

---

## Recommended Action Plan

### This Week

#### Monday-Tuesday: Consolidation
- [ ] Commit all educational content work
- [ ] Push feature/educational-content
- [ ] Test thoroughly
- [ ] Merge to master
- [ ] Tag release: `v1.0.0-education`

#### Wednesday-Thursday: UI Planning
- [ ] Design unified UI mockups (Figma or Excalidraw)
- [ ] Decide on state management (Zustand vs Redux)
- [ ] Create component library structure
- [ ] Set up routing architecture

#### Friday: UI Foundation
- [ ] Create `feature/ui-foundation` branch
- [ ] Set up unified navigation
- [ ] Create `<ProjectSelector />` component
- [ ] Create `<AgentChat />` component
- [ ] Basic routing structure

### Next Week

#### Week 2: Core UI Components
- [ ] Educational content UI
- [ ] YouTube generation UI
- [ ] Generic chat UI
- [ ] Voice-to-agent UI
- [ ] Cost tracker component

#### Week 3: Integration
- [ ] Connect UI to backend APIs
- [ ] Test all workflows end-to-end
- [ ] Polish UI/UX
- [ ] Add error handling

#### Week 4: Polish & Launch
- [ ] Documentation
- [ ] Deployment
- [ ] User testing
- [ ] Iterate

---

## Branch Cleanup Strategy

### After Merge to Master

```bash
# Delete merged feature branch locally
git branch -d feature/educational-content

# Delete merged feature branch remotely
git push origin --delete feature/educational-content

# Keep these branches for now (active work):
# - feature/tiktok-multilingual (merge next)
# - feature/scenario-agents (needs review)
# - feature/veo-video-generation (experimental)
# - feature/voice-cloning-pipeline (needs merge)
```

---

## Risk Mitigation

### Potential Issues

1. **Merge Conflicts**
   - **Solution:** Merge frequently, keep branches short-lived
   - **Prevention:** Use separate directories for new features

2. **Breaking Changes**
   - **Solution:** Comprehensive testing before merge
   - **Prevention:** Feature flags for experimental features

3. **Lost Work**
   - **Solution:** Push to remote frequently
   - **Prevention:** Use worktrees for parallel work

4. **Divergent Branches**
   - **Solution:** Regular rebasing on master
   - **Prevention:** Weekly sync meetings

---

## Success Metrics

### Technical
- [ ] All branches merged to master
- [ ] Zero compilation errors
- [ ] All tests passing (>95% coverage)
- [ ] Build time <2 minutes
- [ ] API response time <2 seconds

### User Experience
- [ ] Generate educational module in <5 minutes
- [ ] Generate YouTube video in <3 minutes
- [ ] Generate TikTok short in <1 minute
- [ ] Chat responds in <2 seconds
- [ ] Cost visible in real-time

### Business
- [ ] Educational content: <$2 per module
- [ ] YouTube content: <$1 per video
- [ ] TikTok shorts: <$0.25 per short
- [ ] User manuals: <$5 per manual
- [ ] SOPs: <$1 per document

---

## Next Steps (Immediate)

1. **Review this plan** - Does it align with your vision?
2. **Decide on UI framework** - Continue with Next.js + Shadcn?
3. **Choose state management** - Zustand (simple) or Redux (complex)?
4. **Set timeline** - 4 weeks realistic? Or faster?
5. **Assign priorities** - What UI first? (Educational? YouTube? Generic chat?)

Once we agree, I can:
- Create detailed UI mockups
- Build component library
- Set up routing
- Implement first UI (your choice)

**What would you like to tackle first?**
