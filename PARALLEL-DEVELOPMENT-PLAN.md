# Parallel Development Plan - 5 Worktrees

**Strategy:** Deploy 5 subagents to work simultaneously on different features
**Integration:** Each worktree has clear merge strategy back to master
**Timeline:** All features can be built in parallel over 1-2 weeks

---

## 🎯 Overall Architecture

### Integration Points (Critical for Merge):

```
Master Branch
    ↓
    ├─── feature/voice-cloning-pipeline ✅ (COMPLETE - Ready to merge)
    │    └─> Integrates into: video-director.ts, video-renderer.ts
    │
    ├─── feature/scenario-agents 🔨 (Next - High Priority)
    │    └─> Integrates into: NEW routes, shares voice-cloning
    │
    ├─── feature/educational-content 🔨 (Parallel - Independent)
    │    └─> Integrates into: NEW routes, independent services
    │
    ├─── feature/veo-video-generation 🔨 (Parallel - Independent)
    │    └─> Integrates into: video-renderer.ts, NEW service
    │
    └─── feature/tiktok-multilingual 🔨 (Parallel - Depends on voice-cloning)
         └─> Integrates into: video-renderer.ts, uses voice-cloning
```

### Merge Order (To Avoid Conflicts):

1. **Merge First:** `voice-cloning` (already done, no conflicts)
2. **Merge Second:** `educational-content` (independent, no conflicts)
3. **Merge Third:** `veo-video-generation` (may conflict with video-renderer.ts)
4. **Merge Fourth:** `scenario-agents` (depends on voice-cloning being merged)
5. **Merge Fifth:** `tiktok-multilingual` (depends on voice-cloning)

### Shared Dependencies (Coordinate carefully):

- **voice-cloning service** - Used by: scenario-agents, tiktok-multilingual
- **video-renderer.ts** - Modified by: veo-video-generation, tiktok-multilingual
- **Claude/Anthropic service** - Used by: all worktrees
- **Remotion** - Used by: veo-video-generation, tiktok-multilingual

---

## 📋 WORKTREE 1: Voice Cloning Pipeline ✅

**Branch:** `feature/voice-cloning-pipeline`
**Status:** COMPLETE - Ready for integration testing
**Priority:** Highest (foundation for others)

### Objectives:
✅ ElevenLabs integration (DONE)
✅ Voice capture during conversation (DONE)
✅ Automatic voice cloning at 60s (DONE)
✅ TTS with cloned voice (DONE)

### Integration Plan:

**Files to Merge to Master:**
```
packages/backend/src/services/voice-cloning.ts (NEW)
packages/backend/src/utils/audio-utils.ts (NEW)
packages/backend/src/routes/video-director.ts (MODIFIED)
packages/backend/package.json (MODIFIED - added @elevenlabs/elevenlabs-js)
```

**Potential Conflicts:**
- `video-director.ts` may have been modified in master
- Resolution: Manual merge, keep voice-cloning enhancements

**Environment Variables to Add:**
```bash
ELEVENLABS_API_KEY=your_key_here
```

**Testing Before Merge:**
```bash
# 1. Test voice cloning service standalone
npm test -- voice-cloning.test.ts

# 2. Test video-director with voice cloning
curl -X POST http://localhost:3001/api/video-director/research

# 3. Test full pipeline
# - Start conversation
# - Talk for 60+ seconds
# - Verify voice cloned
# - Generate video
# - Confirm video uses cloned voice
```

**Merge Command:**
```bash
git checkout master
git merge feature/voice-cloning-pipeline
npm install  # Install new dependencies
git push origin master
```

**Post-Merge Tasks:**
- Update frontend to show voice cloning progress
- Add voice preview feature
- Update documentation

**Status:** ✅ Ready to merge after testing

---

## 📋 WORKTREE 2: Scenario-Based Agents 🔨

**Branch:** `feature/scenario-agents`
**Status:** Ready to build
**Priority:** High
**Dependencies:** Requires voice-cloning to be merged first

### Objectives:

1. Build scenario detection system (auto-detect user intent)
2. Implement 6 specialized consultant agents
3. Create artifact generator (interactive tools for clients)
4. Integrate with voice cloning for personalized deliverables

### Architecture:

```
src/agents/
├── base/
│   ├── consultant-agent.ts         (Abstract base class)
│   └── types.ts                     (Shared interfaces)
│
├── detector/
│   ├── scenario-detector.ts        (Claude-powered detection)
│   └── router.ts                    (Route to correct agent)
│
├── specialists/
│   ├── marketing-agent.ts          (Marketing campaigns)
│   ├── strategy-agent.ts           (Business strategy)
│   ├── workshop-agent.ts           (Strategy workshops)
│   ├── training-agent.ts           (Training content)
│   ├── sales-agent.ts              (Sales pitches)
│   └── financial-agent.ts          (Financial planning)
│
├── artifacts/
│   ├── artifact-generator.ts       (Interactive tool builder)
│   ├── templates/
│   │   ├── strategy-canvas.html
│   │   ├── roi-calculator.html
│   │   ├── swot-matrix.html
│   │   └── campaign-planner.html
│   └── index.ts
│
└── index.ts

src/routes/
└── consultant.ts                    (New API endpoints)

src/services/
└── research.ts                      (Web search, competitive analysis)
```

### Detailed Plan:

#### Phase 1: Foundation (Agent 1 - 4 hours)

**Files to Create:**

1. **`src/agents/base/types.ts`**
```typescript
export interface ScenarioContext {
  type: 'marketing' | 'strategy' | 'workshop' | 'training' | 'sales' | 'financial';
  subType?: string;
  keyTopics: string[];
  targetAudience: string;
  companyName: string;
  clientName?: string;
  objectives: string[];
  constraints?: string[];
}

export interface ResearchReport {
  marketData: any;
  competitors: any[];
  trends: string[];
  opportunities: string[];
  threats: string[];
}

export interface Analysis {
  swot: SWOT;
  recommendations: Recommendation[];
  metrics: Metric[];
  timeline: TimelineItem[];
}

export interface Deliverables {
  video?: {
    storyboard: any;
    narrationScript: string;
    voiceId?: string;
  };
  presentation?: {
    slides: Slide[];
    notes: string;
  };
  report?: {
    content: string;
    format: 'pdf' | 'html' | 'markdown';
  };
  artifact?: {
    name: string;
    html: string;
    interactive: boolean;
  };
}

export interface ConsultantAgent {
  name: string;
  description: string;

  // Consultant workflow
  research(context: ScenarioContext): Promise<ResearchReport>;
  analyze(research: ResearchReport, context: ScenarioContext): Promise<Analysis>;
  generateDeliverables(analysis: Analysis, context: ScenarioContext, voiceId?: string): Promise<Deliverables>;
  generateArtifact(analysis: Analysis, context: ScenarioContext): Promise<string>; // HTML
}
```

2. **`src/agents/base/consultant-agent.ts`**
```typescript
export abstract class BaseConsultantAgent implements ConsultantAgent {
  constructor(
    protected claudeService: ClaudeService,
    protected voiceCloning: VoiceCloningService
  ) {}

  // Shared utilities
  protected async webSearch(query: string): Promise<any> {
    // Use Brave Search API or similar
  }

  protected async generateStoryboard(analysis: Analysis, voiceId?: string): Promise<any> {
    // Create video storyboard from analysis
  }

  protected async renderHTMLArtifact(template: string, data: any): Promise<string> {
    // Render interactive HTML tool
  }

  // Abstract methods (each agent implements)
  abstract research(context: ScenarioContext): Promise<ResearchReport>;
  abstract analyze(research: ResearchReport, context: ScenarioContext): Promise<Analysis>;
  abstract generateDeliverables(analysis: Analysis, context: ScenarioContext, voiceId?: string): Promise<Deliverables>;
  abstract generateArtifact(analysis: Analysis, context: ScenarioContext): Promise<string>;
}
```

3. **`src/agents/detector/scenario-detector.ts`**
```typescript
export class ScenarioDetector {
  async detectScenario(conversation: Message[]): Promise<ScenarioContext> {
    // Use Claude to analyze conversation and detect scenario
    const prompt = `Analyze this conversation and determine:
    1. Primary scenario type (marketing/strategy/workshop/training/sales/financial)
    2. Key topics being discussed
    3. Target audience
    4. Business objectives

    Conversation:
    ${JSON.stringify(conversation)}

    Return as JSON matching ScenarioContext interface.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return JSON.parse(extractJSON(response.content[0].text));
  }

  async shouldSwitchAgent(
    currentScenario: ScenarioContext,
    newMessage: string
  ): Promise<{ switch: boolean; newScenario?: ScenarioContext }> {
    // Detect if user's intent has shifted
  }
}
```

4. **`src/agents/detector/router.ts`**
```typescript
export class AgentRouter {
  private agents: Map<string, ConsultantAgent>;

  constructor() {
    this.agents = new Map([
      ['marketing', new MarketingAgent(claude, voiceCloning)],
      ['strategy', new StrategyAgent(claude, voiceCloning)],
      ['workshop', new WorkshopAgent(claude, voiceCloning)],
      ['training', new TrainingAgent(claude, voiceCloning)],
      ['sales', new SalesAgent(claude, voiceCloning)],
      ['financial', new FinancialAgent(claude, voiceCloning)]
    ]);
  }

  async route(scenario: ScenarioContext): Promise<ConsultantAgent> {
    return this.agents.get(scenario.type)!;
  }
}
```

#### Phase 2: Implement First Agent - Strategy Agent (Agent 2 - 6 hours)

**File:** `src/agents/specialists/strategy-agent.ts`

**Full Implementation:**
```typescript
export class StrategyAgent extends BaseConsultantAgent {
  name = 'Strategy Consultant';
  description = 'Helps with business strategy, market analysis, competitive positioning';

  async research(context: ScenarioContext): Promise<ResearchReport> {
    // 1. Market research
    const marketData = await this.webSearch(`${context.companyName} industry market size trends`);

    // 2. Competitive analysis
    const competitors = await this.identifyCompetitors(context);
    const competitiveData = await Promise.all(
      competitors.map(c => this.analyzeCompetitor(c))
    );

    // 3. Trend analysis
    const trends = await this.identifyTrends(context);

    // 4. SWOT preparation
    return {
      marketData,
      competitors: competitiveData,
      trends,
      opportunities: await this.identifyOpportunities(marketData, trends),
      threats: await this.identifyThreats(competitiveData, trends)
    };
  }

  async analyze(research: ResearchReport, context: ScenarioContext): Promise<Analysis> {
    // Use Claude to perform strategic analysis
    const analysisPrompt = `You are a senior strategy consultant. Analyze this research:

Research Data:
${JSON.stringify(research, null, 2)}

Context:
${JSON.stringify(context, null, 2)}

Provide:
1. Complete SWOT analysis
2. Strategic recommendations (prioritized)
3. Key metrics to track
4. Implementation timeline (quarters)

Return as JSON matching Analysis interface.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: analysisPrompt }
    ]);

    return JSON.parse(extractJSON(response.content[0].text));
  }

  async generateDeliverables(
    analysis: Analysis,
    context: ScenarioContext,
    voiceId?: string
  ): Promise<Deliverables> {
    // Generate multiple deliverables
    const deliverables: Deliverables = {};

    // 1. Strategy presentation video
    const storyboard = await this.createStrategyStoryboard(analysis, context);
    deliverables.video = {
      storyboard,
      narrationScript: storyboard.scenes.map(s => s.narration).join('\n\n'),
      voiceId
    };

    // 2. Strategy presentation slides
    deliverables.presentation = await this.createPresentation(analysis);

    // 3. Strategy report
    deliverables.report = {
      content: await this.generateReport(analysis, context),
      format: 'html'
    };

    // 4. Interactive strategy canvas
    deliverables.artifact = {
      name: 'Strategy Canvas',
      html: await this.generateArtifact(analysis, context),
      interactive: true
    };

    return deliverables;
  }

  async generateArtifact(analysis: Analysis, context: ScenarioContext): Promise<string> {
    // Generate interactive strategy canvas
    return this.renderHTMLArtifact('strategy-canvas', {
      companyName: context.companyName,
      swot: analysis.swot,
      recommendations: analysis.recommendations,
      metrics: analysis.metrics,
      timeline: analysis.timeline
    });
  }

  // Helper methods
  private async identifyCompetitors(context: ScenarioContext): Promise<string[]> {
    // Use Claude + web search
  }

  private async analyzeCompetitor(competitor: string): Promise<any> {
    // Competitive intelligence
  }

  private async identifyTrends(context: ScenarioContext): Promise<string[]> {
    // Market trends analysis
  }

  private async createStrategyStoryboard(analysis: Analysis, context: ScenarioContext): Promise<any> {
    // 15-scene storyboard for strategy video
  }
}
```

#### Phase 3: Implement Remaining Agents (Agents 3-7 - 2 hours each = 10 hours)

Each agent follows same pattern:
- Marketing Agent: Campaign planning, brand positioning
- Workshop Agent: Facilitated strategy workshops
- Training Agent: Training program development
- Sales Agent: Sales pitch creation
- Financial Agent: Financial planning and forecasting

#### Phase 4: Artifact Generator (Agent 8 - 4 hours)

**File:** `src/agents/artifacts/artifact-generator.ts`

```typescript
export class ArtifactGenerator {
  private templates: Map<string, string>;

  async generate(type: string, data: any): Promise<string> {
    const template = this.templates.get(type);
    return this.render(template, data);
  }

  private render(template: string, data: any): string {
    // Template rendering with data binding
  }
}
```

**Templates to Create:**
- `strategy-canvas.html` - Interactive SWOT + Strategy planner
- `roi-calculator.html` - ROI calculation tool
- `swot-matrix.html` - Drag-and-drop SWOT builder
- `campaign-planner.html` - Marketing campaign planner

#### Phase 5: API Routes (Agent 9 - 3 hours)

**File:** `src/routes/consultant.ts`

```typescript
router.post('/api/consultant/start', async (req, res) => {
  // Start consultation session
  // Detect scenario
  // Route to appropriate agent
});

router.post('/api/consultant/message', async (req, res) => {
  // Continue conversation
  // Update scenario if needed
  // Capture voice (integrate with voice-cloning)
});

router.post('/api/consultant/generate', async (req, res) => {
  // Generate deliverables
  // - Video with cloned voice
  // - Presentation
  // - Report
  // - Interactive artifact
});

router.get('/api/consultant/artifact/:sessionId', async (req, res) => {
  // Serve interactive artifact
});
```

### Integration with Master:

**Files to Merge:**
```
packages/backend/src/agents/                    (NEW directory)
packages/backend/src/routes/consultant.ts       (NEW)
packages/backend/src/services/research.ts       (NEW)
packages/backend/src/index.ts                   (MODIFIED - add consultant route)
```

**Dependencies:**
- Requires voice-cloning service (from worktree 1)
- Uses existing Claude service
- Uses existing video renderer

**Conflicts to Watch:**
- `src/index.ts` - May conflict if routes added
- Resolution: Add consultant routes after existing routes

**Testing:**
```bash
# Test scenario detection
curl -X POST http://localhost:3001/api/consultant/start \
  -d '{"message": "I need help with our market entry strategy"}'

# Should return: { scenario: "strategy", agent: "Strategy Consultant" }

# Test full workflow
# 1. Start consultation
# 2. Have conversation (voice captured)
# 3. Generate deliverables
# 4. Verify all 4 deliverables created (video, slides, report, artifact)
```

**Merge Strategy:**
```bash
# After voice-cloning is merged to master
git checkout master
git pull origin master
git checkout feature/scenario-agents
git rebase master  # Rebase on latest master (includes voice-cloning)
git checkout master
git merge feature/scenario-agents
npm install  # If new dependencies
git push origin master
```

---

## 📋 WORKTREE 3: Educational Content Pipeline 🔨

**Branch:** `feature/educational-content`
**Status:** Ready to build
**Priority:** Medium
**Dependencies:** Independent (no dependencies)

### Objectives:

1. Enhanced GitHub repository analysis
2. Automated course generation from topics
3. Interactive quizzes and assessments
4. SCORM export for LMS integration
5. Video tutorial generation

### Architecture:

```
src/agents/education/
├── manual-generator.ts          (Enhanced from existing)
├── course-generator.ts          (NEW)
├── quiz-generator.ts            (NEW)
├── assessment-generator.ts      (NEW)
└── scorm-exporter.ts            (NEW)

src/routes/
└── education.ts                 (NEW)

src/templates/
├── course-module.html
├── quiz.html
├── certificate.html
└── scorm-manifest.xml
```

### Detailed Plan:

#### Phase 1: Enhanced Manual Generator (Agent 1 - 4 hours)

**Enhance:** `src/agents/user-journey/index.ts`

**New Features:**
- Deeper code analysis (function-level, not just file-level)
- API endpoint documentation
- Architecture diagrams (Mermaid)
- Usage examples extraction
- Dependency mapping

**Implementation:**
```typescript
class EnhancedManualGenerator extends UserJourneyAgent {
  async analyzeDeeper(projectPath: string, features: string[]): Promise<DeepAnalysis> {
    // 1. Extract all functions/methods
    const functions = await this.extractFunctions(projectPath);

    // 2. Generate API documentation
    const apiDocs = await this.documentAPIs(projectPath);

    // 3. Create architecture diagram
    const architecture = await this.generateArchitectureDiagram(projectPath);

    // 4. Extract usage examples
    const examples = await this.findUsageExamples(projectPath);

    return { functions, apiDocs, architecture, examples };
  }

  private async extractFunctions(projectPath: string): Promise<FunctionDoc[]> {
    // Parse TypeScript/JavaScript files
    // Extract function signatures, parameters, return types
    // Use ts-morph or similar
  }

  private async documentAPIs(projectPath: string): Promise<APIDoc[]> {
    // Find Express routes, API endpoints
    // Document request/response formats
    // Generate OpenAPI spec
  }

  private async generateArchitectureDiagram(projectPath: string): Promise<string> {
    // Analyze project structure
    // Generate Mermaid diagram
    // Show components, services, data flow
  }
}
```

#### Phase 2: Course Generator (Agent 2 - 6 hours)

**File:** `src/agents/education/course-generator.ts`

```typescript
export class CourseGenerator {
  async generateCourse(topic: string, targetAudience: string, duration: number): Promise<Course> {
    // 1. Generate curriculum
    const curriculum = await this.createCurriculum(topic, targetAudience, duration);

    // 2. Generate modules
    const modules = await Promise.all(
      curriculum.modules.map(m => this.createModule(m))
    );

    // 3. Generate assessments
    const assessments = await this.createAssessments(modules);

    // 4. Generate certificate template
    const certificate = await this.createCertificateTemplate(topic);

    return {
      title: topic,
      modules,
      assessments,
      certificate,
      metadata: {
        targetAudience,
        duration,
        difficulty: curriculum.difficulty
      }
    };
  }

  private async createCurriculum(topic: string, audience: string, duration: number): Promise<Curriculum> {
    // Use Claude to design curriculum
    const prompt = `Design a comprehensive course curriculum for:

    Topic: ${topic}
    Target Audience: ${audience}
    Duration: ${duration} hours

    Create modules, learning objectives, and content outline.
    Return as JSON.`;

    // Claude generates structured curriculum
  }

  private async createModule(module: ModuleSpec): Promise<Module> {
    return {
      title: module.title,
      content: await this.generateContent(module),
      videos: await this.generateVideoScripts(module),
      exercises: await this.generateExercises(module),
      resources: await this.generateResources(module),
      duration: module.duration
    };
  }

  private async createAssessments(modules: Module[]): Promise<Assessment[]> {
    // Generate quizzes, assignments, projects
  }
}
```

#### Phase 3: Quiz & Assessment Generator (Agent 3 - 4 hours)

**File:** `src/agents/education/quiz-generator.ts`

```typescript
export class QuizGenerator {
  async generateQuiz(content: string, difficulty: 'easy' | 'medium' | 'hard', questionCount: number): Promise<Quiz> {
    // Use Claude to generate questions from content

    const questions = await this.generateQuestions(content, difficulty, questionCount);

    return {
      questions,
      passingScore: 70,
      timeLimit: questionCount * 2, // 2 min per question
      shuffleQuestions: true,
      shuffleAnswers: true
    };
  }

  private async generateQuestions(content: string, difficulty: string, count: number): Promise<Question[]> {
    const prompt = `Generate ${count} ${difficulty} multiple-choice questions from this content:

    ${content}

    Each question should:
    - Test understanding (not just recall)
    - Have 4 answer options
    - Have clear explanations

    Return as JSON array.`;

    // Claude generates questions
  }

  async generateAssignment(module: Module): Promise<Assignment> {
    // Generate practical assignments
  }

  async generateProject(course: Course): Promise<Project> {
    // Generate final project spec
  }
}
```

#### Phase 4: SCORM Exporter (Agent 4 - 5 hours)

**File:** `src/agents/education/scorm-exporter.ts`

```typescript
export class SCORMExporter {
  async exportToSCORM(course: Course, version: '1.2' | '2004'): Promise<Buffer> {
    // 1. Create SCORM package structure
    const scormPackage = await this.createPackageStructure(course, version);

    // 2. Generate manifest
    const manifest = await this.generateManifest(course, version);

    // 3. Package content
    const zip = await this.packageContent(scormPackage, manifest);

    return zip;
  }

  private async generateManifest(course: Course, version: string): Promise<string> {
    // Generate imsmanifest.xml
    // Define course structure, modules, SCOs
  }

  private async packageContent(content: any, manifest: string): Promise<Buffer> {
    // Create ZIP file
    // Include all HTML, JS, CSS, assets
    // Add SCORM API wrapper
  }
}
```

#### Phase 5: API Routes (Agent 5 - 3 hours)

**File:** `src/routes/education.ts`

```typescript
router.post('/api/education/manual', async (req, res) => {
  // Enhanced manual generation
  // From GitHub repo or docs
});

router.post('/api/education/course', async (req, res) => {
  // Generate full course from topic
  const { topic, targetAudience, duration } = req.body;
  const course = await courseGenerator.generateCourse(topic, targetAudience, duration);
  res.json(course);
});

router.post('/api/education/quiz', async (req, res) => {
  // Generate quiz from content
});

router.get('/api/education/scorm/:courseId', async (req, res) => {
  // Export course as SCORM package
  const scorm = await scormExporter.exportToSCORM(course, '2004');
  res.setHeader('Content-Type', 'application/zip');
  res.send(scorm);
});
```

### Integration with Master:

**Files to Merge:**
```
packages/backend/src/agents/education/          (NEW directory)
packages/backend/src/agents/user-journey/       (MODIFIED)
packages/backend/src/routes/education.ts        (NEW)
packages/backend/src/templates/education/       (NEW directory)
packages/backend/src/index.ts                   (MODIFIED - add education route)
```

**No Conflicts Expected** - This is mostly independent

**Testing:**
```bash
# Test course generation
curl -X POST http://localhost:3001/api/education/course \
  -d '{"topic": "React Fundamentals", "targetAudience": "Beginners", "duration": 10}'

# Should return complete course with modules, quizzes, certificate

# Test SCORM export
curl http://localhost:3001/api/education/scorm/course-123 > course.zip
# Verify ZIP contains valid SCORM package
```

**Merge Strategy:**
```bash
git checkout master
git merge feature/educational-content
npm install  # If new dependencies (zip libraries, etc.)
git push origin master
```

---

## 📋 WORKTREE 4: Google Veo 3.1 Video Generation 🔨

**Branch:** `feature/veo-video-generation`
**Status:** Ready to build
**Priority:** High (Novel feature)
**Dependencies:** Independent (but will enhance video-renderer)

### Objectives:

1. Integrate Google Veo 3.1 API
2. Solve "3 seconds → 30 minutes" challenge
3. Implement hybrid rendering (Veo + Remotion + Static)
4. Shot-by-shot generation with continuity
5. Cost optimization strategies

### Architecture:

```
src/services/veo/
├── veo-client.ts                (Veo API wrapper)
├── shot-planner.ts              (Break scenes into 3s shots)
├── continuity-manager.ts        (Maintain visual consistency)
├── hybrid-renderer.ts           (Veo + Remotion + Static)
└── cost-optimizer.ts            (Budget management)

src/utils/
└── video-stitcher.ts            (FFmpeg video assembly)

src/routes/
└── veo-video.ts                 (NEW endpoints)
```

### Detailed Plan:

#### Phase 1: Veo API Client (Agent 1 - 4 hours)

**File:** `src/services/veo/veo-client.ts`

```typescript
export class VeoClient {
  private apiKey: string;
  private endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1';

  async generateClip(config: VeoConfig): Promise<VideoClip> {
    const response = await fetch(`${this.endpoint}:generateVideo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: config.prompt,
        duration_seconds: config.duration, // Max 8 seconds
        resolution: config.resolution || '1080p',
        fps: config.fps || 30,
        style_preset: config.style,
        reference_image_base64: config.referenceImage, // For continuity!
        seed: config.seed
      })
    });

    const data = await response.json();

    // Veo returns operation ID, poll for completion
    return await this.pollForCompletion(data.operationId);
  }

  async pollForCompletion(operationId: string, timeout: number = 300000): Promise<VideoClip> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.checkStatus(operationId);

      if (status.done) {
        return {
          url: status.videoUrl,
          duration: status.duration,
          resolution: status.resolution,
          path: await this.downloadVideo(status.videoUrl)
        };
      }

      await this.sleep(2000); // Poll every 2 seconds
    }

    throw new Error('Video generation timeout');
  }

  async extractLastFrame(videoPath: string): Promise<string> {
    // Use FFmpeg to extract last frame
    // Return as base64 for next clip's reference
    const output = path.join(os.tmpdir(), `frame_${Date.now()}.png`);

    await execAsync(`ffmpeg -i "${videoPath}" -vframes 1 -vf "select='eq(n\\,0)'" -update 1 "${output}"`);

    const buffer = await fs.readFile(output);
    await fs.unlink(output);

    return buffer.toString('base64');
  }
}
```

#### Phase 2: Shot Planner (Agent 2 - 5 hours)

**File:** `src/services/veo/shot-planner.ts`

```typescript
export class ShotPlanner {
  async breakIntoShots(scene: Scene, maxDuration: number = 3): Promise<Shot[]> {
    // Use Claude to intelligently break scene into cinematic shots

    const shotCount = Math.ceil(scene.duration / maxDuration);

    const prompt = `You are a professional cinematographer. Break this scene into ${shotCount} shots of ${maxDuration} seconds each:

Scene Description: ${scene.description}
Scene Duration: ${scene.duration} seconds
Scene Mood: ${scene.mood}

For each shot, specify:
1. Shot number and duration
2. Camera framing (wide, medium, close-up, etc.)
3. Camera movement (static, dolly, pan, crane, etc.)
4. Specific visual description
5. Lighting mood
6. Any special effects

Create cinematic variety while maintaining visual continuity.
Return as JSON array of shots.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    const shots = JSON.parse(extractJSON(response.content[0].text));

    return shots.map((s, i) => ({
      index: i,
      prompt: this.enrichPrompt(s),
      duration: maxDuration,
      framing: s.framing,
      camera: s.camera,
      lighting: s.lighting,
      style: scene.style
    }));
  }

  private enrichPrompt(shot: any): string {
    // Add professional cinematography keywords
    return `${shot.description},
            ${shot.framing} shot,
            camera ${shot.camera},
            lighting: ${shot.lighting},
            professional cinematography,
            4K quality,
            cinematic color grading,
            realistic`;
  }

  async createTransitions(shots: Shot[]): Promise<Transition[]> {
    // Determine transition types between shots
    return shots.slice(0, -1).map((shot, i) => ({
      from: i,
      to: i + 1,
      type: this.selectTransitionType(shot, shots[i + 1]),
      duration: 0.5
    }));
  }

  private selectTransitionType(shotA: Shot, shotB: Shot): string {
    // Intelligent transition selection
    // Match cut for similar framing
    // Crossfade for mood changes
    // etc.
  }
}
```

#### Phase 3: Continuity Manager (Agent 3 - 4 hours)

**File:** `src/services/veo/continuity-manager.ts`

```typescript
export class ContinuityManager {
  private referenceFrames: Map<string, string> = new Map();

  async generateWithContinuity(shots: Shot[]): Promise<VideoClip[]> {
    const clips: VideoClip[] = [];
    let lastFrame: string | undefined;

    for (const shot of shots) {
      console.log(`Generating shot ${shot.index + 1}/${shots.length}...`);

      const clip = await this.veoClient.generateClip({
        prompt: shot.prompt,
        duration: shot.duration,
        referenceImage: lastFrame, // CRITICAL: Visual consistency
        style: shot.style,
        seed: this.generateConsistentSeed(shot)
      });

      clips.push(clip);

      // Extract last frame for next shot
      lastFrame = await this.veoClient.extractLastFrame(clip.path);

      // Cache for reuse
      this.referenceFrames.set(`shot_${shot.index}`, lastFrame);
    }

    return clips;
  }

  private generateConsistentSeed(shot: Shot): number {
    // Generate deterministic seed for consistent style
    // Based on shot properties
    return hashCode(`${shot.framing}_${shot.lighting}_${shot.style}`);
  }

  async validateContinuity(clips: VideoClip[]): Promise<ContinuityReport> {
    // Use Claude with vision to check if clips are visually consistent
    // Return warnings if major discontinuities detected
  }
}
```

#### Phase 4: Hybrid Renderer (Agent 4 - 6 hours)

**File:** `src/services/veo/hybrid-renderer.ts`

```typescript
export class HybridRenderer {
  async renderHybridVideo(storyboard: Storyboard, budget: number): Promise<string> {
    const timeline: TimelineSegment[] = [];
    let spentBudget = 0;

    for (const scene of storyboard.scenes) {
      const segment = await this.determineRenderMethod(scene, budget - spentBudget);

      switch (segment.method) {
        case 'veo':
          // High-value scenes: Use Veo AI
          const veoClips = await this.renderVeoSequence(scene);
          timeline.push({ type: 'veo', clips: veoClips, duration: scene.duration });
          spentBudget += this.calculateVeoCost(scene.duration);
          break;

        case 'remotion':
          // Motion graphics: Use Remotion
          const remotionClip = await this.renderRemotionScene(scene);
          timeline.push({ type: 'remotion', clip: remotionClip, duration: scene.duration });
          break;

        case 'static':
          // Simple content: Static images with Ken Burns
          const imageClip = await this.renderStaticScene(scene);
          timeline.push({ type: 'static', clip: imageClip, duration: scene.duration });
          break;
      }
    }

    // Assemble final video
    return await this.assembleTimeline(timeline);
  }

  private async determineRenderMethod(
    scene: Scene,
    remainingBudget: number
  ): Promise<{ method: 'veo' | 'remotion' | 'static'; reason: string }> {
    // Analyze scene to determine best rendering method

    const analysis = await this.analyzeScene(scene);
    const veoCost = this.calculateVeoCost(scene.duration);

    if (analysis.requiresRealism && analysis.complexity === 'high' && remainingBudget >= veoCost) {
      return { method: 'veo', reason: 'Realistic scene, budget available' };
    }

    if (analysis.hasData || analysis.hasText || analysis.isAbstract) {
      return { method: 'remotion', reason: 'Motion graphics suitable' };
    }

    return { method: 'static', reason: 'Simple content, cost optimization' };
  }

  private calculateVeoCost(duration: number): number {
    // $1.50 per 3-second clip
    const clipCount = Math.ceil(duration / 3);
    return clipCount * 1.5;
  }

  private async renderVeoSequence(scene: Scene): Promise<VideoClip[]> {
    // Break into shots
    const shots = await this.shotPlanner.breakIntoShots(scene, 3);

    // Generate with continuity
    const clips = await this.continuityManager.generateWithContinuity(shots);

    return clips;
  }

  private async renderRemotionScene(scene: Scene): Promise<VideoClip> {
    // Use existing Remotion renderer
    // Dynamically select Remotion component based on scene type
  }

  private async renderStaticScene(scene: Scene): Promise<VideoClip> {
    // Generate image with DALL-E
    const image = await this.generateImage(scene.description);

    // Apply Ken Burns effect (slow zoom/pan)
    return await this.applyKenBurns(image, scene.duration);
  }

  private async assembleTimeline(timeline: TimelineSegment[]): Promise<string> {
    // Use FFmpeg to stitch all segments
    // Add transitions
    // Normalize audio
    // Color grade
  }
}
```

#### Phase 5: Cost Optimizer (Agent 5 - 3 hours)

**File:** `src/services/veo/cost-optimizer.ts`

```typescript
export class CostOptimizer {
  async optimizeForBudget(storyboard: Storyboard, budget: number): Promise<OptimizationPlan> {
    // Prioritize scenes for Veo allocation

    const scenes = storyboard.scenes.map(s => ({
      ...s,
      priority: this.calculatePriority(s),
      veoCost: this.calculateVeoCost(s.duration)
    }));

    // Sort by priority
    scenes.sort((a, b) => b.priority - a.priority);

    const plan: OptimizationPlan = {
      veoScenes: [],
      remotionScenes: [],
      staticScenes: [],
      totalCost: 0
    };

    let spent = 0;

    for (const scene of scenes) {
      if (spent + scene.veoCost <= budget && this.shouldUseVeo(scene)) {
        plan.veoScenes.push(scene);
        spent += scene.veoCost;
      } else if (this.shouldUseRemotion(scene)) {
        plan.remotionScenes.push(scene);
      } else {
        plan.staticScenes.push(scene);
      }
    }

    plan.totalCost = spent;

    return plan;
  }

  private calculatePriority(scene: Scene): number {
    // Hero moments = high priority
    // Supporting content = medium
    // Filler = low
  }

  async reuseClips(prompt: string): Promise<VideoClip | null> {
    // Check cache for similar clips
    // Reuse to save cost
  }
}
```

#### Phase 6: API Routes (Agent 6 - 3 hours)

**File:** `src/routes/veo-video.ts`

```typescript
router.post('/api/veo/generate', async (req, res) => {
  const { storyboard, budget, quality } = req.body;

  // Generate video using hybrid approach
  const videoPath = await hybridRenderer.renderHybridVideo(storyboard, budget);

  res.json({ videoPath, cost: spentBudget });
});

router.post('/api/veo/optimize', async (req, res) => {
  const { storyboard, budget } = req.body;

  // Get optimization plan without rendering
  const plan = await costOptimizer.optimizeForBudget(storyboard, budget);

  res.json(plan);
});

router.get('/api/veo/status/:operationId', async (req, res) => {
  // Check Veo generation status
});
```

### Integration with Master:

**Files to Merge:**
```
packages/backend/src/services/veo/                (NEW directory)
packages/backend/src/utils/video-stitcher.ts      (NEW)
packages/backend/src/routes/veo-video.ts          (NEW)
packages/backend/src/services/video-renderer.ts   (MODIFIED - add hybrid option)
packages/backend/src/index.ts                     (MODIFIED - add route)
```

**Potential Conflicts:**
- `video-renderer.ts` may conflict with tiktok-multilingual
- Resolution: Coordinate changes, ensure both features work

**Environment Variables:**
```bash
GOOGLE_VEO_API_KEY=your_key_here
```

**Testing:**
```bash
# Test single clip generation
curl -X POST http://localhost:3001/api/veo/generate \
  -d '{"prompt": "A professional office environment...", "duration": 3}'

# Test hybrid rendering
curl -X POST http://localhost:3001/api/veo/generate \
  -d '{"storyboard": {...}, "budget": 150}'

# Should return 30-min video with mix of Veo/Remotion/Static
```

**Merge Strategy:**
```bash
git checkout master
git pull origin master
git checkout feature/veo-video-generation
git rebase master
# Resolve video-renderer.ts conflicts if any
git checkout master
git merge feature/veo-video-generation
npm install  # New dependencies
git push origin master
```

---

## 📋 WORKTREE 5: TikTok Multilingual Pipeline 🔨

**Branch:** `feature/tiktok-multilingual`
**Status:** Ready to build
**Priority:** High (Revenue/Growth)
**Dependencies:** Requires voice-cloning merged

### Objectives:

1. Analyze long video, extract best moments
2. Convert to vertical format (9:16)
3. Translate to multiple languages
4. Generate voiceover in user's cloned voice (all languages!)
5. Add captions
6. Generate CTA overlays
7. Batch render: 1 video → 40 shorts

### Architecture:

```
src/services/tiktok/
├── moment-analyzer.ts           (Find viral moments)
├── vertical-converter.ts        (Resize to 9:16)
├── translation.ts               (Google Translate API)
├── caption-generator.ts         (SRT generation)
├── cta-overlay.ts               (YouTube link overlay)
└── batch-renderer.ts            (Render all variations)

src/remotion/
└── TikTokComposition.tsx        (Remotion template for shorts)

src/routes/
└── tiktok.ts                    (NEW endpoints)
```

### Detailed Plan:

#### Phase 1: Moment Analyzer (Agent 1 - 5 hours)

**File:** `src/services/tiktok/moment-analyzer.ts`

```typescript
export class MomentAnalyzer {
  async findBestMoments(videoPath: string, count: number = 10, duration: number = 60): Promise<Moment[]> {
    // 1. Extract frames at intervals
    const frames = await this.extractKeyFrames(videoPath);

    // 2. Transcribe audio
    const transcript = await this.transcribeVideo(videoPath);

    // 3. Analyze with Claude
    const moments = await this.analyzeWithClaude(frames, transcript, count, duration);

    return moments;
  }

  private async transcribeVideo(videoPath: string): Promise<Transcript> {
    // Extract audio
    const audioPath = await this.extractAudio(videoPath);

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: await fs.readFile(audioPath),
      model: 'whisper-1',
      response_format: 'verbose_json'
    });

    return transcription;
  }

  private async analyzeWithClaude(
    frames: Frame[],
    transcript: Transcript,
    count: number,
    duration: number
  ): Promise<Moment[]> {
    // Use Claude to identify viral moments

    const prompt = `Analyze this video and identify the ${count} best moments for TikTok/Instagram Reels:

Transcript with timestamps:
${JSON.stringify(transcript, null, 2)}

Criteria for "best moment":
1. Hook in first 3 seconds (attention-grabbing)
2. Clear value or insight
3. Self-contained (makes sense standalone)
4. Emotionally engaging
5. Shareable

For each moment:
- Start time (seconds)
- End time (should be ~${duration} seconds)
- Hook (first 3 seconds description)
- Key message
- Viral potential score (1-10)
- Suggested caption

Return as JSON array.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return JSON.parse(extractJSON(response.content[0].text));
  }

  async extractClip(videoPath: string, moment: Moment): Promise<string> {
    const outputPath = path.join(os.tmpdir(), `clip_${Date.now()}.mp4`);

    await execAsync(
      `ffmpeg -i "${videoPath}" -ss ${moment.startTime} -t ${moment.duration} -c copy "${outputPath}"`
    );

    return outputPath;
  }
}
```

#### Phase 2: Vertical Converter (Agent 2 - 3 hours)

**File:** `src/services/tiktok/vertical-converter.ts`

```typescript
export class VerticalConverter {
  async convertToVertical(inputPath: string, style: 'crop' | 'blur-background' | 'zoom' = 'blur-background'): Promise<string> {
    const outputPath = path.join(os.tmpdir(), `vertical_${Date.now()}.mp4`);

    switch (style) {
      case 'crop':
        // Simple center crop to 9:16
        await this.cropCenter(inputPath, outputPath);
        break;

      case 'blur-background':
        // Scale video to fit height, blur background for sides
        await this.blurBackground(inputPath, outputPath);
        break;

      case 'zoom':
        // Zoom into subject, crop to 9:16
        await this.smartZoom(inputPath, outputPath);
        break;
    }

    return outputPath;
  }

  private async cropCenter(input: string, output: string): Promise<void> {
    // Crop to 1080x1920 (9:16)
    await execAsync(
      `ffmpeg -i "${input}" -vf "crop=ih*(9/16):ih,scale=1080:1920" "${output}"`
    );
  }

  private async blurBackground(input: string, output: string): Promise<void> {
    // Complex filter: blurred background + scaled video overlay
    await execAsync(
      `ffmpeg -i "${input}" -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,boxblur=20:5[bg];[0:v]scale=-1:1920[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" "${output}"`
    );
  }

  private async smartZoom(input: string, output: string): Promise<void> {
    // Use object detection to find subject, zoom and crop
    // For now, simple zoom
    await execAsync(
      `ffmpeg -i "${input}" -vf "scale=iw*1.5:ih*1.5,crop=1080:1920" "${output}"`
    );
  }
}
```

#### Phase 3: Translation Service (Agent 3 - 4 hours)

**File:** `src/services/tiktok/translation.ts`

```typescript
import { Translate } from '@google-cloud/translate/build/src/v2';

export class TranslationService {
  private translate: Translate;

  constructor() {
    this.translate = new Translate({
      key: process.env.GOOGLE_CLOUD_API_KEY
    });
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const [translation] = await this.translate.translate(text, targetLanguage);
    return translation;
  }

  async batchTranslate(texts: string[], languages: string[]): Promise<Map<string, string[]>> {
    const results = new Map<string, string[]>();

    for (const lang of languages) {
      const translations = await Promise.all(
        texts.map(t => this.translateText(t, lang))
      );
      results.set(lang, translations);
    }

    return results;
  }

  async detectLanguage(text: string): Promise<string> {
    const [detection] = await this.translate.detect(text);
    return detection.language;
  }

  // Supported languages for your use case
  getSupportedLanguages(): LanguageConfig[] {
    return [
      { code: 'en', name: 'English', voice: 'en-US' },
      { code: 'sn', name: 'Shona', voice: 'en-US' }, // ElevenLabs multilingual
      { code: 'es', name: 'Spanish', voice: 'es-ES' },
      { code: 'pt', name: 'Portuguese', voice: 'pt-BR' },
      { code: 'fr', name: 'French', voice: 'fr-FR' },
      { code: 'zu', name: 'Zulu', voice: 'en-ZA' }
    ];
  }
}
```

#### Phase 4: Caption Generator (Agent 4 - 4 hours)

**File:** `src/services/tiktok/caption-generator.ts`

```typescript
export class CaptionGenerator {
  async generateCaptions(transcript: Transcript, language: string = 'en'): Promise<string> {
    // Generate SRT subtitle file

    const srt = transcript.segments.map((segment, i) => {
      return `${i + 1}
${this.formatTime(segment.start)} --> ${this.formatTime(segment.end)}
${segment.text}
`;
    }).join('\n');

    return srt;
  }

  async burnCaptions(videoPath: string, srtPath: string, style: CaptionStyle): Promise<string> {
    const outputPath = path.join(os.tmpdir(), `captioned_${Date.now()}.mp4`);

    // Burn captions into video with styling
    await execAsync(
      `ffmpeg -i "${videoPath}" -vf "subtitles='${srtPath}':force_style='${this.getStyleString(style)}'" "${outputPath}"`
    );

    return outputPath;
  }

  private getStyleString(style: CaptionStyle): string {
    return `FontName=${style.font},FontSize=${style.size},PrimaryColour=${style.color},OutlineColour=${style.outline},Outline=2,Bold=${style.bold ? 1 : 0},Alignment=2`;
  }

  async generateDynamicCaptions(transcript: Transcript): Promise<string> {
    // Generate word-by-word highlighting (like TikTok auto-captions)
    // Return as ASS (Advanced SubStation Alpha) for better control
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)},${this.pad(ms, 3)}`;
  }
}
```

#### Phase 5: Batch Renderer (Agent 5 - 6 hours)

**File:** `src/services/tiktok/batch-renderer.ts`

```typescript
export class BatchRenderer {
  async renderMultilingual(
    videoPath: string,
    moments: Moment[],
    languages: string[],
    voiceId: string  // User's cloned voice!
  ): Promise<TikTokBatch> {
    const results: TikTokVideo[] = [];
    let totalCost = 0;

    for (const moment of moments) {
      // Extract clip
      const clip = await this.momentAnalyzer.extractClip(videoPath, moment);

      for (const lang of languages) {
        console.log(`Rendering: Moment ${moment.index + 1}, Language: ${lang}`);

        // 1. Convert to vertical
        const vertical = await this.verticalConverter.convertToVertical(clip, 'blur-background');

        // 2. Translate caption
        const caption = await this.translation.translateText(moment.caption, lang);

        // 3. Generate voiceover in user's voice (multilingual!)
        const voiceAudio = await this.voiceCloning.generateSpeech({
          text: caption,
          voiceId,
          modelId: 'eleven_multilingual_v2' // Supports 29 languages!
        });

        const audioPath = await this.saveAudio(voiceAudio);

        // 4. Generate captions
        const transcript = await this.transcribeAudio(audioPath);
        const srt = await this.captionGenerator.generateCaptions(transcript, lang);

        // 5. Add captions
        const withCaptions = await this.captionGenerator.burnCaptions(vertical, srt, {
          font: 'Arial',
          size: 32,
          color: '&H00FFFFFF',
          outline: '&H00000000',
          bold: true
        });

        // 6. Add CTA overlay
        const final = await this.ctaOverlay.addCTA(withCaptions, {
          text: 'Full video on YouTube 👆',
          position: 'top',
          duration: 3 // Last 3 seconds
        });

        // 7. Save
        const outputPath = path.join(
          this.outputDir,
          `moment_${moment.index + 1}_${lang}.mp4`
        );
        await fs.copyFile(final, outputPath);

        results.push({
          momentIndex: moment.index,
          language: lang,
          path: outputPath,
          caption,
          duration: moment.duration
        });

        totalCost += 3.0; // $3 per video (ElevenLabs TTS)
      }
    }

    return {
      videos: results,
      totalCount: results.length,
      totalCost,
      costPerVideo: totalCost / results.length
    };
  }

  async renderBatch(config: BatchConfig): Promise<TikTokBatch> {
    // Convenience method
    return this.renderMultilingual(
      config.videoPath,
      config.moments,
      config.languages,
      config.voiceId
    );
  }
}
```

#### Phase 6: CTA Overlay (Agent 6 - 2 hours)

**File:** `src/services/tiktok/cta-overlay.ts`

```typescript
export class CTAOverlay {
  async addCTA(videoPath: string, config: CTAConfig): Promise<string> {
    const outputPath = path.join(os.tmpdir(), `cta_${Date.now()}.mp4`);

    // Create text overlay
    const filterComplex = this.buildCTAFilter(config);

    await execAsync(
      `ffmpeg -i "${videoPath}" -vf "${filterComplex}" "${outputPath}"`
    );

    return outputPath;
  }

  private buildCTAFilter(config: CTAConfig): string {
    const y = config.position === 'top' ? 100 : 'h-100';

    return `drawtext=text='${config.text}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=40:fontcolor=white:bordercolor=black:borderw=3:x=(w-text_w)/2:y=${y}:enable='gte(t,${config.startTime || 0})'`;
  }

  async addAnimatedCTA(videoPath: string, config: AnimatedCTAConfig): Promise<string> {
    // Add arrow pointing up + text
    // Bounce animation
    // Fade in/out
  }
}
```

#### Phase 7: API Routes (Agent 7 - 3 hours)

**File:** `src/routes/tiktok.ts`

```typescript
router.post('/api/tiktok/analyze', async (req, res) => {
  const { videoPath, count, duration } = req.body;

  // Analyze video, find best moments
  const moments = await momentAnalyzer.findBestMoments(videoPath, count, duration);

  res.json({ moments });
});

router.post('/api/tiktok/batch-render', async (req, res) => {
  const { videoPath, momentIndexes, languages, sessionId } = req.body;

  // Get session (for voiceId)
  const session = sessions.get(sessionId);

  if (!session?.voiceId) {
    return res.status(400).json({ error: 'Voice not cloned. Record conversation first.' });
  }

  // Get selected moments
  const allMoments = await momentAnalyzer.findBestMoments(videoPath, 20);
  const selectedMoments = momentIndexes.map(i => allMoments[i]);

  // Render all variations
  const batch = await batchRenderer.renderMultilingual(
    videoPath,
    selectedMoments,
    languages,
    session.voiceId
  );

  res.json(batch);
});

router.get('/api/tiktok/download/:filename', async (req, res) => {
  // Download rendered TikTok video
  const filePath = path.join(outputDir, req.params.filename);
  res.download(filePath);
});
```

### Integration with Master:

**Files to Merge:**
```
packages/backend/src/services/tiktok/           (NEW directory)
packages/backend/src/remotion/TikTokComposition.tsx (NEW)
packages/backend/src/routes/tiktok.ts           (NEW)
packages/backend/src/index.ts                   (MODIFIED - add route)
packages/backend/package.json                   (MODIFIED - add @google-cloud/translate)
```

**Dependencies:**
- **REQUIRES** voice-cloning merged (uses voiceId)
- Uses Google Cloud Translation API
- Uses ElevenLabs for multilingual TTS

**Potential Conflicts:**
- None expected (mostly new files)

**Environment Variables:**
```bash
GOOGLE_CLOUD_API_KEY=your_key_here
GOOGLE_CLOUD_PROJECT_ID=your_project_id
```

**Testing:**
```bash
# Test moment analysis
curl -X POST http://localhost:3001/api/tiktok/analyze \
  -d '{"videoPath": "/path/to/video.mp4", "count": 10}'

# Test batch render
curl -X POST http://localhost:3001/api/tiktok/batch-render \
  -d '{
    "videoPath": "/path/to/video.mp4",
    "momentIndexes": [0, 2, 5],
    "languages": ["en", "sn", "es", "pt"],
    "sessionId": "abc123"
  }'

# Should create 3 moments × 4 languages = 12 TikTok videos
# All in user's cloned voice!
```

**Merge Strategy:**
```bash
# Must merge AFTER voice-cloning
git checkout master
git pull origin master  # Should have voice-cloning merged
git checkout feature/tiktok-multilingual
git rebase master
git checkout master
git merge feature/tiktok-multilingual
npm install  # Google Cloud Translate
git push origin master
```

---

## 🚀 Parallel Execution Plan

### Deploy 5 Subagents Simultaneously:

```
Agent 1: scenario-agents        (8-10 hours)
Agent 2: educational-content    (6-7 hours)
Agent 3: veo-video-generation   (6-8 hours)
Agent 4: tiktok-multilingual    (6-7 hours)
Agent 5: voice-cloning-testing  (2 hours - test & merge)
```

### Timeline (If All Run in Parallel):

- **Day 1:** All agents start simultaneously
- **Day 2:** Most agents complete
- **Day 3:** Integration testing, conflict resolution
- **Day 4:** Merge to master in order
- **Day 5:** Full system testing

**Total:** 5 days instead of 5 weeks! 🚀

---

## 📊 Integration Matrix

| Worktree | Depends On | Conflicts With | Merge Order |
|----------|-----------|----------------|-------------|
| voice-cloning | None | None | 1 (First) |
| educational-content | None | None | 2 |
| veo-video-generation | None | video-renderer.ts | 3 |
| scenario-agents | voice-cloning | None | 4 |
| tiktok-multilingual | voice-cloning | video-renderer.ts | 5 (Last) |

---

## ✅ Ready to Deploy Agents?

Each plan above is:
- ✅ Detailed and specific
- ✅ Has clear file structure
- ✅ Has implementation code examples
- ✅ Has testing strategy
- ✅ Has integration plan
- ✅ Has conflict resolution strategy

**Next step:** Deploy subagents to work on these plans in parallel!

Would you like me to deploy the agents now?
