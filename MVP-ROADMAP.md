# MVP Roadmap: First 7 Agents (Content Generation)

**Goal:** Prove agentic content generation can replace human course creators

**Timeline:** 7 days (1 agent per day)

**Success Metric:** Generate complete IGCSE Math course (50+ hours of content) in under 48 hours for under $50

---

## Architecture Decision: Agent Framework

### **Choice: Anthropic Claude SDK + Tools**

**Why:**
- ✅ We're already using Claude
- ✅ Native tool support
- ✅ Computer use capability (future)
- ✅ Streaming responses
- ✅ Function calling

**Not using:**
- ❌ LangChain (too heavy, abstractions we don't need)
- ❌ AutoGPT (too autonomous, we need control)
- ❌ Custom framework (reinventing wheel)

### **Agent Base Architecture**

```typescript
// src/agents/base-agent.ts

import Anthropic from '@anthropic-ai/sdk';

export interface AgentTool {
  name: string;
  description: string;
  input_schema: object;
  execute: (input: any) => Promise<any>;
}

export interface ApprovalRequest {
  agentName: string;
  action: string;
  tier: 1 | 2 | 3 | 4;
  data: any;
  timestamp: Date;
}

export abstract class BaseAgent {
  protected claude: Anthropic;
  protected name: string;
  protected tools: AgentTool[];
  protected approvalTier: 1 | 2 | 3 | 4;

  constructor(name: string, approvalTier: 1 | 2 | 3 | 4 = 2) {
    this.name = name;
    this.approvalTier = approvalTier;
    this.claude = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!
    });
    this.tools = this.defineTools();
  }

  // Each agent defines its own tools
  protected abstract defineTools(): AgentTool[];

  // Main execution method
  abstract execute(input: any): Promise<any>;

  // Request human approval if needed
  protected async requestApproval(action: string, data: any): Promise<boolean> {
    if (this.approvalTier === 1) {
      // Auto-approve
      return true;
    }

    const request: ApprovalRequest = {
      agentName: this.name,
      action,
      tier: this.approvalTier,
      data,
      timestamp: new Date()
    };

    // Store in approval queue (Firebase/Redis)
    await this.storeApprovalRequest(request);

    // For MVP: Auto-approve tier 2
    // In production: Wait for human approval
    if (this.approvalTier === 2) {
      console.log(`[${this.name}] Auto-approving: ${action}`);
      return true;
    }

    // Tier 3/4: Block until human approves
    return await this.waitForApproval(request);
  }

  protected async storeApprovalRequest(request: ApprovalRequest): Promise<void> {
    // TODO: Store in Firebase for oversight dashboard
    console.log(`[APPROVAL NEEDED] ${request.agentName}: ${request.action}`);
  }

  protected async waitForApproval(request: ApprovalRequest): Promise<boolean> {
    // TODO: Implement real-time approval system
    // For now: Auto-approve
    return true;
  }

  // Use Claude with tools
  protected async callClaude(
    messages: Anthropic.MessageParam[],
    systemPrompt?: string
  ): Promise<Anthropic.Message> {
    return await this.claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages,
      tools: this.tools.map(t => ({
        name: t.name,
        description: t.description,
        input_schema: t.input_schema
      }))
    });
  }

  // Execute tool calls
  protected async executeTool(toolName: string, input: any): Promise<any> {
    const tool = this.tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }
    return await tool.execute(input);
  }

  // Log agent activity
  protected log(message: string, data?: any): void {
    console.log(`[${this.name}] ${message}`, data || '');
  }
}
```

---

## Day 1: Agent #1 - Syllabus Analyst

**Purpose:** Parse PDF syllabi into structured topic trees

**Input:** PDF syllabus (e.g., Cambridge IGCSE Math)

**Output:**
```json
{
  "subject": "Mathematics",
  "level": "IGCSE",
  "examBoard": "Cambridge",
  "topics": [
    {
      "id": "algebra-1",
      "title": "Algebra",
      "subtopics": [
        {
          "id": "algebra-1-1",
          "title": "Linear Equations",
          "learningObjectives": [
            "Solve linear equations in one variable",
            "Graph linear equations"
          ],
          "difficulty": "beginner",
          "estimatedTime": 120
        }
      ]
    }
  ]
}
```

**Tools:**
- Gemini Vision (extract text from PDF)
- Claude (analyze and structure)

**Implementation:**
```typescript
// src/agents/syllabus-analyst-agent.ts

export class SyllabusAnalystAgent extends BaseAgent {
  constructor() {
    super('Syllabus Analyst', 2); // Tier 2: Batch review
  }

  protected defineTools(): AgentTool[] {
    return [
      {
        name: 'extract_pdf_text',
        description: 'Extract text from PDF using Gemini Vision',
        input_schema: {
          type: 'object',
          properties: {
            pdfUrl: { type: 'string' }
          },
          required: ['pdfUrl']
        },
        execute: async (input) => {
          // Use Gemini Vision to extract text
          return await extractPdfWithGemini(input.pdfUrl);
        }
      },
      {
        name: 'structure_topics',
        description: 'Structure extracted text into topic hierarchy',
        input_schema: {
          type: 'object',
          properties: {
            extractedText: { type: 'string' }
          },
          required: ['extractedText']
        },
        execute: async (input) => {
          // Claude structures the content
          return await this.structureWithClaude(input.extractedText);
        }
      }
    ];
  }

  async execute(input: { pdfUrl: string }): Promise<any> {
    this.log('Starting syllabus analysis', input);

    const messages: Anthropic.MessageParam[] = [{
      role: 'user',
      content: `Analyze this syllabus PDF and extract all topics: ${input.pdfUrl}`
    }];

    const systemPrompt = `You are a Syllabus Analyst Agent. Your job is to:
1. Extract text from PDF syllabi
2. Identify all topics and subtopics
3. Extract learning objectives
4. Estimate difficulty and time per topic
5. Return structured JSON

Be thorough and accurate.`;

    const response = await this.callClaude(messages, systemPrompt);

    // Handle tool calls
    // (Claude will call extract_pdf_text, then structure_topics)

    const structuredSyllabus = await this.processToolCalls(response);

    // Request approval
    const approved = await this.requestApproval(
      'Syllabus structure created',
      structuredSyllabus
    );

    if (!approved) {
      throw new Error('Syllabus structure not approved');
    }

    this.log('Syllabus analysis complete', { topicCount: structuredSyllabus.topics.length });

    return structuredSyllabus;
  }

  private async processToolCalls(response: Anthropic.Message): Promise<any> {
    // Iterate through tool use blocks
    // Execute tools
    // Continue conversation with results
    // Return final structured output
    // (Implementation details...)
  }
}
```

**Test:**
```bash
curl -X POST http://localhost:3001/api/agents/syllabus/analyze \
  -d '{"pdfUrl": "https://example.com/igcse-math-syllabus.pdf"}'
```

---

## Day 2: Agent #2 - Concept Video Generator

**Purpose:** Generate D3 + Manim concept videos for topics

**Input:**
```json
{
  "topicId": "algebra-1-1",
  "title": "Linear Equations",
  "learningObjectives": [...],
  "difficulty": "beginner"
}
```

**Output:**
```json
{
  "videoUrl": "https://storage/videos/algebra-1-1.mp4",
  "duration": 180,
  "thumbnailUrl": "https://storage/thumbs/algebra-1-1.jpg",
  "transcript": "...",
  "cost": 0.15
}
```

**Tools:**
- D3VizEngine (already built)
- UnifiedD3ManimRenderer (already built)
- ElevenLabs (narration)
- Cloud Storage (upload)

**Implementation:**
```typescript
export class ConceptVideoGeneratorAgent extends BaseAgent {
  private d3Engine: D3VizEngine;
  private manimRenderer: UnifiedD3ManimRenderer;

  constructor() {
    super('Concept Video Generator', 2);
    this.d3Engine = new D3VizEngine(/* config */);
    this.manimRenderer = new UnifiedD3ManimRenderer();
  }

  protected defineTools(): AgentTool[] {
    return [
      {
        name: 'generate_script',
        description: 'Generate video script with narration and visuals',
        input_schema: { /* ... */ },
        execute: async (input) => {
          // Claude generates script
          return await this.generateScriptWithClaude(input);
        }
      },
      {
        name: 'render_d3_visualization',
        description: 'Render D3 visualization for concept',
        input_schema: { /* ... */ },
        execute: async (input) => {
          return await this.d3Engine.visualize(input.vizData);
        }
      },
      {
        name: 'render_manim_animation',
        description: 'Render Manim mathematical animation',
        input_schema: { /* ... */ },
        execute: async (input) => {
          return await this.manimRenderer.renderUnifiedManim(input.scene);
        }
      },
      {
        name: 'generate_narration',
        description: 'Generate voice narration with ElevenLabs',
        input_schema: { /* ... */ },
        execute: async (input) => {
          // ElevenLabs TTS
          return await this.generateNarration(input.text);
        }
      },
      {
        name: 'compose_final_video',
        description: 'Compose D3 + Manim + narration into final video',
        input_schema: { /* ... */ },
        execute: async (input) => {
          // FFmpeg composition (or Remotion)
          return await this.composeFinalVideo(input);
        }
      }
    ];
  }

  async execute(input: TopicInput): Promise<VideoOutput> {
    this.log('Generating concept video', input);

    // Agent orchestrates the full pipeline
    // Claude decides what visuals are needed
    // Calls tools in sequence
    // Returns final video

    return videoOutput;
  }
}
```

---

## Day 3-7: Remaining Agents

**Day 3:** Interactive Problem Creator (#3)
**Day 4:** Past Paper Solution Agent (#4)
**Day 5:** PDF Notes Generator (#5)
**Day 6:** SCORM Packager (#6)
**Day 7:** YouTube Upload Agent (#7)

Each follows same pattern:
1. Define tools
2. System prompt
3. Execute with Claude orchestration
4. Request approval
5. Return output

---

## Meta-Orchestrator (Day 8)

**Purpose:** Coordinate all 7 agents to generate complete course

**Input:**
```json
{
  "syllabusUrl": "https://example.com/igcse-math.pdf",
  "outputFormat": ["videos", "scorm", "youtube"],
  "priority": "speed" // or "quality"
}
```

**Output:**
```json
{
  "courseId": "igcse-math-2025",
  "status": "completed",
  "duration": "42 hours",
  "cost": "$47.50",
  "content": {
    "videos": 52,
    "interactiveProblems": 156,
    "pdfNotes": 52,
    "scormPackages": 1,
    "youtubePlaylist": "https://youtube.com/playlist/..."
  }
}
```

**Orchestration Logic:**
```typescript
export class MetaOrchestrator {
  private agents: Map<string, BaseAgent>;

  async generateCourse(input: CourseInput): Promise<CourseOutput> {
    // 1. Syllabus Analyst
    const syllabus = await this.agents.get('syllabus')!.execute({
      pdfUrl: input.syllabusUrl
    });

    // 2. For each topic, spawn agents in parallel
    const tasks = syllabus.topics.map(topic => ({
      video: this.agents.get('video')!.execute(topic),
      problems: this.agents.get('problems')!.execute(topic),
      notes: this.agents.get('notes')!.execute(topic),
      pastPapers: this.agents.get('pastPapers')!.execute(topic)
    }));

    // Execute in parallel (limited concurrency)
    const results = await this.executeConcurrently(tasks, 5);

    // 3. Package into SCORM
    const scorm = await this.agents.get('scorm')!.execute({ results });

    // 4. Upload to YouTube
    const youtube = await this.agents.get('youtube')!.execute({
      videos: results.map(r => r.video)
    });

    return {
      courseId: this.generateId(),
      status: 'completed',
      content: { /* ... */ }
    };
  }
}
```

---

## Human Oversight Dashboard (Parallel Track)

**Purpose:** Real-time monitoring and approval interface

**Features:**
- Live agent activity feed
- Pending approvals queue
- Cost tracking
- Quality metrics
- Override controls

**Tech Stack:**
- Frontend: Next.js (already have)
- Backend: Express (already have)
- Real-time: Firebase Realtime Database or WebSockets
- UI: Tailwind + shadcn/ui (already have)

**Pages:**
1. `/oversight/dashboard` - Overview of all agents
2. `/oversight/approvals` - Pending approvals queue
3. `/oversight/agents/:agentId` - Individual agent monitor
4. `/oversight/costs` - Cost tracking per agent
5. `/oversight/quality` - Quality metrics

---

## Database Schema

### **Agents Collection**
```typescript
interface AgentRecord {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'error';
  lastRun: Date;
  totalExecutions: number;
  totalCost: number;
  averageTime: number;
}
```

### **Approvals Collection**
```typescript
interface ApprovalRecord {
  id: string;
  agentName: string;
  action: string;
  tier: 1 | 2 | 3 | 4;
  data: any;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}
```

### **Jobs Collection**
```typescript
interface JobRecord {
  id: string;
  type: 'course_generation' | 'video' | 'problem';
  input: any;
  output?: any;
  status: 'queued' | 'running' | 'completed' | 'failed';
  agentsInvolved: string[];
  startedAt: Date;
  completedAt?: Date;
  totalCost: number;
}
```

---

## Cost Tracking

**Per Agent Call:**
```typescript
interface AgentCost {
  agentName: string;
  claudeTokens: {
    input: number;
    output: number;
    cost: number;
  };
  toolCosts: {
    d3Render: number;
    manimRender: number;
    elevenLabs: number;
    geminiVision: number;
  };
  totalCost: number;
  timestamp: Date;
}
```

**Budget Controls:**
```typescript
// Stop agent if exceeds budget
if (agent.totalCost > AGENT_BUDGET_LIMIT) {
  agent.pause();
  await notifyHuman('Budget exceeded', agent);
}
```

---

## Success Metrics

### **Week 1 Target:**
- ✅ All 7 agents built and tested
- ✅ Meta-Orchestrator functional
- ✅ Oversight dashboard live
- ✅ Generate 1 complete course (IGCSE Math)

### **Key Metrics:**
- **Time:** < 48 hours (vs 6 months human)
- **Cost:** < $50 (vs $50,000 human)
- **Quality:** 4+ star rating from teachers
- **Consistency:** 100% of topics covered

---

## Next Steps

**This Week:**
1. Build Agent base class
2. Build Agent #1 (Syllabus Analyst)
3. Test with real IGCSE syllabus
4. Iterate until quality acceptable
5. Build oversight dashboard MVP

**Next Week:**
1. Build agents #2-7
2. Build Meta-Orchestrator
3. Generate first complete course
4. Measure time/cost/quality
5. Get feedback from educators

**Week 3:**
1. Refine based on feedback
2. Add teaching agents (#8-14)
3. Beta test with real students

**Week 4:**
1. Add admin agents (#15-21)
2. Add growth agents (#22-28)
3. Launch beta platform

---

## The Path to 30 Agents in 30 Days

**We have:**
- ✅ Claude SDK
- ✅ D3 + Manim infrastructure
- ✅ Backend (Express + Firebase)
- ✅ Frontend (Next.js)
- ✅ Content generation experience

**We need:**
- ⬜ Agent base framework
- ⬜ Oversight dashboard
- ⬜ Tool execution system
- ⬜ Job queue (Bull + Redis)
- ⬜ Cost tracking
- ⬜ Human approval workflow

**Let's build the future.** 🚀
