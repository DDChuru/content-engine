# Complete Worktree Development Plan

Strategic parallel development for Content Engine 2.0

---

## 🎯 Vision: AI Consulting Studio

**Core Concept:**
An AI system that acts as a senior consultant:
1. Conducts interviews (voice conversation)
2. Performs research (desktop + competitive analysis)
3. Analyzes data and identifies patterns
4. Generates deliverables (videos, reports, tools)
5. Leaves interactive artifacts (calculators, dashboards)

**Inspired by:** Senior consultant workflows at strategy firms

---

## 🌲 Worktree Structure

```
content-engine/                           (master - stable)
├── ../worktrees/
│   ├── voice-cloning/                    (feature/voice-cloning-pipeline)
│   ├── scenario-agents/                  (feature/scenario-agents)
│   ├── educational-content/              (feature/educational-content)
│   ├── veo-video-ai/                     (feature/veo-video-generation)
│   └── tiktok-multilingual/              (feature/tiktok-multilingual)
```

---

## 📋 Feature Branch 1: Voice Cloning Pipeline

### Branch: `feature/voice-cloning-pipeline`
### Worktree: `../worktrees/voice-cloning/`

**Goal:** Capture user's voice during conversation, clone it, use it in final output

**The Wow Factor:**
```
User: "I want to create a client pitch video..."
Agent: "Tell me about your business" [RECORDING VOICE]
User: [Talks for 2-3 minutes about business]
Agent: "Perfect! I've captured your voice. Generating video..."
[5 minutes later]
Output: Professional video narrated in USER'S VOICE
User: 🤯 "That's MY voice!"
```

### Tasks:
- [ ] Record user audio during conversation (chunks)
- [ ] Send audio chunks to ElevenLabs voice cloning API
- [ ] Create voice profile (needs ~1-2 min of speech)
- [ ] Store voice ID per session
- [ ] Replace TTS with cloned voice in video generation
- [ ] Add voice preview ("Here's how your voice will sound")
- [ ] Handle edge cases (poor audio quality, accent support)

### Technical Approach:

**Voice Capture:**
```typescript
// During interview, accumulate audio
const voiceSamples: Buffer[] = [];

router.post('/api/video-director/interview', async (req, res) => {
  const { audio, sessionId } = req.body;

  // Accumulate voice samples
  voiceSamples.push(audio);

  // After 90-120 seconds of speech, clone voice
  if (getTotalDuration(voiceSamples) >= 90) {
    const voiceId = await cloneVoice(voiceSamples, sessionId);
    sessions[sessionId].voiceId = voiceId;
  }
});
```

**Voice Cloning:**
```typescript
import { ElevenLabsClient } from "elevenlabs";

async function cloneVoice(audioSamples: Buffer[], sessionId: string) {
  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
  });

  // Combine samples
  const combinedAudio = combineAudioBuffers(audioSamples);

  // Clone voice
  const voice = await elevenlabs.voices.add({
    name: `user_${sessionId}`,
    files: [combinedAudio],
    description: "User cloned voice"
  });

  return voice.voice_id;
}
```

**Use in Video:**
```typescript
// Generate narration with user's voice
const audio = await elevenlabs.generate({
  voice: sessions[sessionId].voiceId,
  text: scene.narration,
  model_id: "eleven_multilingual_v2"
});
```

### Files to Create/Modify:
- `packages/backend/src/services/voice-cloning.ts` (new)
- `packages/backend/src/routes/video-director.ts` (modify)
- `packages/backend/src/utils/audio-utils.ts` (new)
- `packages/frontend/app/video-director/page.tsx` (add voice preview)

**Estimated time:** 4-5 hours

---

## 📋 Feature Branch 2: Scenario-Based Multi-Agent System

### Branch: `feature/scenario-agents`
### Worktree: `../worktrees/scenario-agents/`

**Goal:** Detect scenario from conversation, route to specialized agent

**Scenarios Supported:**

1. **Marketing Video Agent**
   - Detects: product launch, brand awareness, campaign
   - Output: Marketing video + landing page mockup
   - Artifact: Campaign calculator

2. **Strategy Consulting Agent**
   - Detects: market entry, competitive analysis, growth strategy
   - Output: Strategy presentation + analysis report
   - Artifact: Strategy canvas tool

3. **Workshop Facilitator Agent**
   - Detects: "strategy workshop", "team planning"
   - Output: Workshop slides + exercises
   - Artifact: Interactive workshop board

4. **Training Content Agent**
   - Detects: "training", "onboarding", "tutorial"
   - Output: Training video series
   - Artifact: Quiz/assessment tool

5. **Sales Pitch Agent**
   - Detects: "client pitch", "proposal", "demo"
   - Output: Client pitch video + proposal deck
   - Artifact: ROI calculator

6. **Financial Planning Agent**
   - Detects: "budget", "forecast", "financial"
   - Output: Financial report + projections
   - Artifact: Budget planner tool

### Architecture:

```typescript
// Scenario detection
interface ScenarioContext {
  type: 'marketing' | 'strategy' | 'workshop' | 'training' | 'sales' | 'financial';
  subType?: string;
  keyTopics: string[];
  targetAudience: string;
  deliverables: string[];
}

class ScenarioDetector {
  async detectScenario(conversation: Message[]): Promise<ScenarioContext> {
    // Use Claude to analyze conversation and detect scenario
    const analysis = await anthropic.messages.create({
      model: 'claude-sonnet-4',
      messages: conversation,
      system: `Analyze this conversation and determine:
        1. Primary scenario type (marketing/strategy/workshop/training/sales/financial)
        2. Sub-type if applicable
        3. Key topics discussed
        4. Target audience
        5. Expected deliverables

        Return as JSON.`
    });

    return JSON.parse(analysis.content);
  }
}

// Agent router
class AgentRouter {
  agents = {
    marketing: new MarketingAgent(),
    strategy: new StrategyAgent(),
    workshop: new WorkshopAgent(),
    training: new TrainingAgent(),
    sales: new SalesAgent(),
    financial: new FinancialAgent()
  };

  async route(scenario: ScenarioContext, sessionId: string) {
    const agent = this.agents[scenario.type];
    return await agent.execute(scenario, sessionId);
  }
}
```

### Agent Interface:

```typescript
interface ConsultantAgent {
  // Conduct research (desktop research, competitive analysis)
  research(context: ScenarioContext): Promise<ResearchReport>;

  // Analyze data
  analyze(research: ResearchReport): Promise<Analysis>;

  // Generate deliverables (video, report, etc.)
  generateDeliverables(analysis: Analysis): Promise<Deliverables>;

  // Create interactive artifact/tool
  generateArtifact(analysis: Analysis): Promise<Artifact>;
}

// Example: Strategy Agent
class StrategyAgent implements ConsultantAgent {
  async research(context: ScenarioContext) {
    // Desktop research
    const marketData = await this.searchMarketData(context.keyTopics);
    const competitors = await this.analyzeCompetitors(context);
    const trends = await this.identifyTrends(context);

    return { marketData, competitors, trends };
  }

  async analyze(research: ResearchReport) {
    // Strategic analysis
    const swot = await this.generateSWOT(research);
    const opportunities = await this.identifyOpportunities(research);
    const recommendations = await this.generateRecommendations(research);

    return { swot, opportunities, recommendations };
  }

  async generateDeliverables(analysis: Analysis) {
    // Create video + presentation
    const storyboard = await this.createStrategyStoryboard(analysis);
    const video = await this.renderVideo(storyboard);
    const slides = await this.createSlides(analysis);

    return { video, slides };
  }

  async generateArtifact(analysis: Analysis) {
    // Interactive strategy canvas
    return await this.createStrategyCanvas(analysis);
  }
}
```

### Artifact Generation:

**Strategy Canvas (HTML + JS):**
```typescript
async function createStrategyCanvas(analysis: Analysis): Promise<string> {
  // Generate interactive HTML tool
  return `<!DOCTYPE html>
<html>
<head>
  <title>Strategy Canvas - Interactive</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div id="canvas">
    <!-- SWOT Matrix -->
    <div class="swot-matrix">
      ${generateSWOTGrid(analysis.swot)}
    </div>

    <!-- Opportunity Scorer -->
    <div class="opportunity-tool">
      ${generateOpportunityScorer(analysis.opportunities)}
    </div>

    <!-- Strategy Roadmap -->
    <div class="roadmap">
      ${generateRoadmap(analysis.recommendations)}
    </div>
  </div>

  <script>
    // Interactive features
    // User can modify, score opportunities, adjust roadmap
  </script>
</body>
</html>`;
}
```

### Files to Create:
- `packages/backend/src/agents/scenario-detector.ts`
- `packages/backend/src/agents/router.ts`
- `packages/backend/src/agents/marketing-agent.ts`
- `packages/backend/src/agents/strategy-agent.ts`
- `packages/backend/src/agents/workshop-agent.ts`
- `packages/backend/src/agents/training-agent.ts`
- `packages/backend/src/agents/sales-agent.ts`
- `packages/backend/src/agents/financial-agent.ts`
- `packages/backend/src/agents/base-consultant-agent.ts` (abstract class)
- `packages/backend/src/services/artifact-generator.ts`
- `packages/backend/src/routes/consultant.ts`

**Estimated time:** 8-10 hours

---

## 📋 Feature Branch 3: Educational Content Pipeline

### Branch: `feature/educational-content`
### Worktree: `../worktrees/educational-content/`

**Goal:** Generate comprehensive educational materials (manuals, courses, tutorials)

**Content Types:**

1. **User Manuals** (existing, enhance)
   - From GitHub repositories
   - From documentation
   - From product demos

2. **Training Courses**
   - Multi-module structure
   - Quizzes and assessments
   - Progress tracking
   - Certificates

3. **Video Tutorials**
   - Step-by-step guides
   - Screen recordings (automated)
   - Voiceover narration
   - Interactive chapters

4. **Interactive Lessons**
   - Embedded exercises
   - Code playgrounds
   - Real-time feedback
   - Gamification

### Architecture:

```typescript
interface EducationalContent {
  type: 'manual' | 'course' | 'tutorial' | 'lesson';
  modules: Module[];
  assessments: Assessment[];
  resources: Resource[];
}

class EducationalContentAgent {
  async generateManual(source: 'github' | 'docs' | 'demo', input: string) {
    // Analyze source
    const structure = await this.analyzeStructure(input);

    // Generate content
    const manual = await this.createManual(structure);

    // Add interactive elements
    const interactive = await this.addInteractivity(manual);

    return interactive;
  }

  async generateCourse(topic: string, targetAudience: string) {
    // Generate curriculum
    const curriculum = await this.createCurriculum(topic, targetAudience);

    // Generate modules
    const modules = await Promise.all(
      curriculum.modules.map(m => this.createModule(m))
    );

    // Create assessments
    const assessments = await this.createAssessments(modules);

    return { modules, assessments, curriculum };
  }
}
```

### Features:
- [ ] GitHub repository → comprehensive manual
- [ ] Topic → full course with modules
- [ ] Automated quiz generation
- [ ] Progress tracking system
- [ ] Certificate generation
- [ ] SCORM export (for LMS integration)
- [ ] Interactive code examples
- [ ] Video chapter generation

**Estimated time:** 6-7 hours

---

## 📋 Feature Branch 4: Google Veo 3.1 Video Generation

### Branch: `feature/veo-video-generation`
### Worktree: `../worktrees/veo-video-ai/`

**Goal:** Use Google Veo 3.1 to generate AI videos (solving 3-second → 30-minute challenge)

### The Challenge:

**Veo 3.1 Limitation:**
- Generates 3-8 seconds of video per prompt
- High quality, realistic
- But short duration

**Goal:**
- Generate 30-minute videos
- Maintain consistency across clips
- Smooth transitions

### Solution Strategy:

#### Approach 1: Shot-by-Shot Generation + Stitching

```typescript
interface VideoScene {
  duration: number; // seconds
  prompt: string;
  style: string;
  continuityContext?: string; // From previous scene
}

class VeoVideoGenerator {
  async generateLongVideo(storyboard: Storyboard): Promise<string> {
    const clips: string[] = [];
    let continuityContext = null;

    for (const scene of storyboard.scenes) {
      // Break scene into 3-second shots
      const shots = this.breakIntoShots(scene, maxDuration: 3);

      for (const shot of shots) {
        // Generate with Veo
        const clip = await this.generateVeoClip({
          prompt: shot.prompt,
          duration: 3,
          style: shot.style,
          continuityContext // Maintain visual consistency
        });

        clips.push(clip);

        // Extract last frame for next shot's context
        continuityContext = await this.extractLastFrame(clip);
      }
    }

    // Stitch all clips with transitions
    const final = await this.stitchClips(clips, {
      transitions: 'crossfade',
      duration: 0.5 // 0.5s transition
    });

    return final;
  }

  async generateVeoClip(config: VeoConfig): Promise<string> {
    // Google Veo 3.1 API call
    const response = await fetch('https://veo.googleapis.com/v1/videos:generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_VEO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: config.prompt,
        duration: config.duration,
        resolution: '1080p',
        fps: 30,
        style: config.style,
        reference_image: config.continuityContext // For consistency
      })
    });

    return response.videoUrl;
  }

  breakIntoShots(scene: VideoScene, maxDuration: number): Shot[] {
    // Intelligent shot breakdown
    // Example: 30-second scene → 10 × 3-second shots

    const shots = [];
    const shotCount = Math.ceil(scene.duration / maxDuration);

    for (let i = 0; i < shotCount; i++) {
      shots.push({
        prompt: this.generateShotPrompt(scene, i, shotCount),
        duration: maxDuration,
        style: scene.style
      });
    }

    return shots;
  }

  generateShotPrompt(scene: VideoScene, shotIndex: number, totalShots: number): string {
    // Use Claude to break scene into coherent shots
    // Shot 1: Wide establishing shot
    // Shot 2: Medium shot, main action
    // Shot 3: Close-up, detail
    // etc.

    return `${scene.prompt}, shot ${shotIndex + 1} of ${totalShots},
            cinematography: ${this.getCinematography(shotIndex, totalShots)}`;
  }

  getCinematography(shotIndex: number, totalShots: number): string {
    // Vary shots for visual interest
    const patterns = [
      'wide establishing shot',
      'medium shot',
      'close-up',
      'over-the-shoulder',
      'detail shot'
    ];

    return patterns[shotIndex % patterns.length];
  }
}
```

#### Approach 2: Key Frame Generation + Interpolation

```typescript
class VeoInterpolationGenerator {
  async generateWithInterpolation(storyboard: Storyboard): Promise<string> {
    // Generate key moments with Veo
    const keyFrames = [];

    for (const scene of storyboard.scenes) {
      // Generate just the key moment (3 seconds)
      const keyMoment = await this.generateVeoClip({
        prompt: scene.keyMomentPrompt,
        duration: 3
      });

      keyFrames.push(keyMoment);
    }

    // Use Veo's interpolation feature to extend
    const extended = [];
    for (let i = 0; i < keyFrames.length - 1; i++) {
      const interpolated = await this.interpolateBetweenClips(
        keyFrames[i],
        keyFrames[i + 1],
        duration: 10 // Extend to 10 seconds
      );
      extended.push(interpolated);
    }

    return this.stitchClips(extended);
  }

  async interpolateBetweenClips(clipA: string, clipB: string, duration: number) {
    // Use Veo's interpolation API
    // Smoothly transition from clipA to clipB over duration
    return await veo.interpolate({
      startClip: clipA,
      endClip: clipB,
      duration,
      motion: 'smooth'
    });
  }
}
```

#### Approach 3: Hybrid (Veo + Traditional + Remotion)

```typescript
class HybridVideoGenerator {
  async generateHybrid(storyboard: Storyboard): Promise<string> {
    const segments = [];

    for (const scene of storyboard.scenes) {
      if (scene.type === 'ai-generated') {
        // Use Veo for realistic footage
        const veoClip = await this.generateVeoSequence(scene);
        segments.push(veoClip);

      } else if (scene.type === 'motion-graphics') {
        // Use Remotion for graphics/text
        const remotionClip = await this.renderRemotionScene(scene);
        segments.push(remotionClip);

      } else if (scene.type === 'static-image') {
        // Use image + Ken Burns effect
        const imageClip = await this.createImageClip(scene);
        segments.push(imageClip);
      }
    }

    // Combine all
    return this.assembleVideo(segments);
  }
}
```

### Recommended Approach:

**Use Approach 3 (Hybrid):**

```
30-minute video structure:
├── 00:00-00:03  Remotion intro (branded)
├── 00:03-01:00  Veo AI scene 1 (10 × 3-sec clips stitched)
├── 01:00-02:00  Remotion graphics (data visualization)
├── 02:00-04:00  Veo AI scene 2 (20 × 3-sec clips)
├── 04:00-05:00  Static images with Ken Burns
├── 05:00-08:00  Veo AI scene 3 (40 × 3-sec clips)
└── ...continue pattern...
└── 29:30-30:00  Remotion outro
```

**Benefits:**
- Veo for realistic scenes (product demos, people, environments)
- Remotion for motion graphics, text, data viz
- Static images for lower-priority sections
- Cost-effective (Veo is expensive, use strategically)

### Cost Analysis:

**Google Veo 3.1 Pricing (estimated):**
- ~$1-2 per 3-second clip
- 30-minute video = 600 seconds
- If 50% Veo (300 seconds) = 100 clips
- Cost: $100-200 per video

**Optimization:**
- Use Veo for hero moments (20% of video)
- Remotion for 50%
- Static images for 30%
- Reduced cost: ~$40-80 per video

### Files to Create:
- `packages/backend/src/services/veo-generator.ts`
- `packages/backend/src/services/video-stitcher.ts`
- `packages/backend/src/routes/veo-video.ts`
- `packages/backend/src/utils/shot-breakdown.ts`

**Estimated time:** 6-8 hours

---

## 📋 Feature Branch 5: TikTok Multilingual Pipeline

### Branch: `feature/tiktok-multilingual`
### Worktree: `../worktrees/tiktok-multilingual/`

**Goal:** YouTube video → 40 TikTok shorts (4 languages × 10 clips)

**From previous discussion:**
- Google Cloud Translation
- ElevenLabs (user's cloned voice)
- Vertical format (9:16)
- Auto-captions
- CTA overlay

**Tasks:**
- [ ] Analyze long video, find viral moments
- [ ] Extract 10 best clips
- [ ] Translate to 4 languages
- [ ] Generate voiceover in user's voice (all languages)
- [ ] Add captions
- [ ] Convert to vertical format
- [ ] Add CTA ("Full video on YouTube")
- [ ] Batch render 40 videos

**Estimated time:** 4-5 hours

---

## 🎯 Development Priority & Timeline

### Week 1: Foundation
**Priority 1:** Voice Cloning Pipeline
- Most impactful feature
- Enables all other features
- Quick win

**Priority 2:** Scenario Agents (start architecture)
- Begin with 2 agents (Strategy + Marketing)
- Build framework for others

### Week 2: Expansion
**Priority 3:** Veo Video Generation
- Experimental, high-value
- Solves novel problem

**Priority 4:** Educational Content
- Parallel development
- Can work independently

### Week 3: Integration
**Priority 5:** TikTok Multilingual
- Combines voice cloning + translation
- Final piece of content multiplier

---

## 📊 Success Metrics

### Voice Cloning:
- ✅ Capture voice during 2-min conversation
- ✅ Clone voice with 95%+ similarity
- ✅ Generate 10-min narration in user's voice
- ✅ User reaction: "Wow, that's MY voice!"

### Scenario Agents:
- ✅ Correctly identify scenario 90%+ of the time
- ✅ Route to appropriate agent
- ✅ Deliver scenario-specific artifacts
- ✅ Generate usable interactive tools

### Veo Video:
- ✅ Generate 30-min video from storyboard
- ✅ Maintain visual consistency across clips
- ✅ Smooth transitions between Veo clips
- ✅ Cost < $100 per 30-min video

### Educational Content:
- ✅ GitHub repo → comprehensive manual
- ✅ Topic → full course (5+ modules)
- ✅ Auto-generate assessments
- ✅ Export to SCORM

### TikTok Multilingual:
- ✅ 1 video → 40 shorts
- ✅ All 4 languages with user's voice
- ✅ Auto-captions, perfect sync
- ✅ Cost < $20 per batch

---

## 🔑 API Keys Needed

Add to `.env`:
```bash
# Voice
ELEVENLABS_API_KEY=your_key_here

# Translation
GOOGLE_CLOUD_API_KEY=your_key_here
GOOGLE_CLOUD_PROJECT_ID=your_project_id

# Video AI
GOOGLE_VEO_API_KEY=your_key_here  # Veo 3.1

# Existing
ANTHROPIC_API_KEY=existing
OPENAI_API_KEY=existing
GEMINI_API_KEY=existing
```

---

## 🚀 Setup Commands

```bash
# Create worktree directories
mkdir -p ../worktrees

# Create all branches
git branch feature/voice-cloning-pipeline
git branch feature/scenario-agents
git branch feature/educational-content
git branch feature/veo-video-generation
git branch feature/tiktok-multilingual

# Create worktrees
git worktree add ../worktrees/voice-cloning feature/voice-cloning-pipeline
git worktree add ../worktrees/scenario-agents feature/scenario-agents
git worktree add ../worktrees/educational-content feature/educational-content
git worktree add ../worktrees/veo-video-ai feature/veo-video-generation
git worktree add ../worktrees/tiktok-multilingual feature/tiktok-multilingual

# Verify
git worktree list
```

---

## 🎬 The Ultimate Vision

**User Experience:**

```
User: "I need help with our market entry strategy"

System: [Detects scenario: Strategy consulting]
        "Great! Let's have a conversation about your business.
         I'll use your voice for the final deliverables."

        [Records user voice while interviewing]

User: [Talks for 5 minutes about business, market, goals]

System: "Perfect! I've captured your voice. Let me:
         1. Research your market
         2. Analyze competitors
         3. Generate strategy recommendations
         4. Create your deliverables

         This will take about 10 minutes..."

[10 minutes later]

System: "Here are your deliverables:

         1. 📹 Strategy video (15 min, narrated in YOUR voice)
         2. 📊 Strategy presentation (25 slides)
         3. 📄 Market analysis report (PDF)
         4. 🛠️ Interactive strategy canvas (HTML tool)
         5. 📱 10 TikTok shorts for social media

         Plus: All content in 4 languages (English, Shona, Spanish, Portuguese)

         Total: 60 assets ready to use!"

User: 🤯
```

**From 5-minute conversation → 60 professional assets**

That's the vision!

---

**Ready to start building? Which worktree should we tackle first?**

1. Voice cloning (biggest wow factor)
2. Scenario agents (most complex)
3. Veo video (most novel)
4. Educational content (most practical)
5. All at once (I'll set up the worktrees!)
