# Content Engine - Project Plan

## Overview
Building output tools for the Fundo Platform educational content generation system.

**Approach**: Build individual output tools first, integrate into platform later.

## Key Architectural Decisions

### ✅ Decisions Made (2025-10-22)

1. **Diagram Generation**: Use **HTML/CSS + Remotion** for video content, **Mermaid.js** for static diagrams
   - ❌ Skip Excalidraw (too complex for programmatic generation)
   - ✅ HTML/CSS gives full animation control for video
   - ✅ Mermaid.js perfect for text-based diagram generation (flowcharts, sequences, etc.)

2. **Video Assembly**: **Hybrid approach** based on complexity
   - **Simple assembly** (concatenation) → ffmpeg
   - **Complex composition** (overlays, PiP, effects) → Remotion
   - Director Agent decides which based on scene requirements

3. **Remotion Role**: Programmatic video composition
   - Scene generation (animations, motion graphics)
   - Complex assembly (when overlays/effects needed)
   - NOT a manual video editor (code-based only)

4. **Production Pipeline Architecture**:
   ```
   Content Brief → Director Agent → Scene Breakdown
        ↓
   Script Writer + Visual Designer Agents
        ↓
   Scene Generation (Manim, Remotion, Gemini, Mermaid)
        ↓
   Assembly (ffmpeg OR Remotion based on complexity)
        ↓
   Final Video + Study Materials
   ```

---

## Output Tools Checklist

### 1. Image Generation (Gemini)
- [x] Integrate Gemini 2.5 Flash ("nano banana")
- [x] Text-to-image generation
- [x] Image-to-image transformation
- [x] Image enhancement mode
- [x] Dynamic mode detection
- [x] Upload and storage (Firebase)
- [x] Gallery with search/filter
- [x] Image selection for content creation

**Status**: ✅ Complete

---

### 2. Content Creation (Claude)
- [x] Integrate Anthropic API
- [x] Chat interface for content generation
- [x] Image reference support
- [x] Conversation history
- [x] Multiple output format selection
- [ ] Enhance with pedagogical context awareness
- [ ] Add topic-specific prompting

**Status**: 🟡 Core complete, enhancements pending

---

### 3. Manim (Mathematical Animations)
- [ ] Set up Python environment
- [ ] Install Manim Community Edition
- [ ] Create basic scene templates
- [ ] Build programmatic scene generation
- [ ] Add rendering pipeline
- [ ] Integrate with backend API
- [ ] Add frontend trigger/preview
- [ ] File storage and management
- [ ] Export formats (MP4, GIF, PNG sequences)

**Status**: ⏳ Not started

---

### 4. Remotion (React Video Generation)
- [x] Set up Remotion project structure (`remotion-branding/`)
- [x] Install dependencies
- [x] Create documentation (README, GETTING-STARTED, ADDING-VISUALS)
- [ ] Review existing compositions
- [ ] Create additional templates
- [ ] Build programmatic composition generation
- [ ] Add rendering pipeline
- [ ] Integrate with backend API
- [ ] Add frontend trigger/preview
- [ ] Branding assets integration
- [ ] Export management
- [ ] Connect to content generation workflow

**Status**: 🟡 Project setup complete, integration pending

**Location**: `/remotion-branding/`
**Docs**: `REMOTION-INTEGRATION.md`, `remotion-branding/README.md`

---

### 5. Mermaid.js (Diagram Generation)
- [x] Install mermaid-cli for PNG/SVG rendering
- [x] Create Claude → Mermaid generator
- [x] Build template library (9 diagram types)
  - [x] Flowcharts
  - [x] Sequence diagrams
  - [x] Class diagrams
  - [x] State diagrams
  - [x] ER diagrams
  - [x] Gantt charts
  - [x] Pie charts
  - [x] Mind maps
  - [x] User journeys
- [x] Integrate with backend API
- [ ] Add to content workspace (frontend UI)
- [ ] Storage and retrieval (Firebase)

**Status**: ✅ Core complete, frontend integration pending

**API Endpoints:**
- `POST /api/diagrams/generate` - Generate from Mermaid code
- `POST /api/diagrams/generate-from-prompt` - Generate from natural language
- `GET /api/diagrams/types` - List supported types

**Location**: `packages/backend/src/routes/diagrams.ts`

**Decision**: Prioritized over Excalidraw due to:
- Text-based (easy for AI generation)
- Auto-layout (no manual positioning)
- Professional output
- Multiple diagram types

---

### 6. HTML/CSS Animated Diagrams (Video Content)
- [x] Proof of concept (animated-pipeline-diagram.html)
- [x] Convert to Remotion component (PipelineDiagram.tsx)
- [ ] Create reusable diagram components
  - [ ] Timeline component
  - [ ] Process flow component
  - [ ] Comparison chart component
  - [ ] Concept map component
- [ ] Build template system
- [ ] Integrate with Director Agent
- [ ] Add to scene generation options

**Status**: 🟢 Proof of concept complete

**Location**:
- HTML example: `/examples/animated-pipeline-diagram.html`
- Remotion: `/remotion-branding/src/PipelineDiagram.tsx`

---

### 7. Reveal.js (Interactive Presentations)
- [x] Basic HTML generation
- [ ] Enhanced template system
- [ ] Theme customization
- [ ] Image integration
- [ ] Animation/transition controls
- [ ] Export/hosting options
- [ ] Speaker notes support

**Status**: 🟡 Basic complete, enhancements pending

---

### 8. Video Assembly Pipeline

#### ffmpeg Integration (Simple Assembly)
- [ ] Install ffmpeg
- [ ] Create scene concatenation service
- [ ] Add audio mixing (background music + narration)
- [ ] Implement simple transitions
- [ ] Build render queue system
- [ ] Error handling and retry logic

**Status**: ⏳ Not started

**Use cases**: Simple scene stitching, fast processing

#### Remotion Assembly (Complex Composition)
- [x] Basic setup complete
- [ ] Build scene composition templates
- [ ] Implement PiP (Picture-in-Picture)
- [ ] Add text overlays/captions
- [ ] Create transition library
- [ ] Audio synchronization
- [ ] Dynamic prop-based assembly

**Status**: 🟡 Setup complete, assembly features pending

**Use cases**: Overlays, effects, synchronized animations

---

### 9. Interactive Artifacts (Custom HTML/JS)
- [ ] Define artifact types
- [ ] Build generation templates
- [ ] Add interactivity framework
- [ ] Preview system
- [ ] Embedding support
- [ ] Storage and retrieval

**Status**: ⏳ Not started

---

### 10. Notes/Study Materials
- [ ] Markdown generation
- [ ] PDF export
- [ ] Formatting templates
- [ ] Math equation support (LaTeX)
- [ ] Diagram embedding
- [ ] Print-friendly styling

**Status**: ⏳ Not started

---

### 11. OBS Integration (Live Streaming)
- [ ] Research OBS WebSocket API
- [ ] Scene automation
- [ ] Source control
- [ ] Recording triggers
- [ ] Stream management

**Status**: ⏳ Not started

---

## Agent Orchestration (Video Production Pipeline)

### Director Agent
- [ ] Scene breakdown algorithm
- [ ] Tool selection logic (Manim vs Remotion vs Gemini)
- [ ] Assembly method decision (ffmpeg vs Remotion)
- [ ] Duration calculation
- [ ] Transition planning

**Inputs**: Content brief, topic, target audience, duration
**Outputs**: Scene list with tool assignments

**Status**: ⏳ Not started

---

### Script Writer Agent
- [ ] Narration generation per scene
- [ ] Pedagogical tone adjustment
- [ ] Script timing sync with visuals
- [ ] Caption generation
- [ ] Voiceover script export

**Inputs**: Scene breakdown, learning objectives
**Outputs**: Narration scripts, captions

**Status**: ⏳ Not started

---

### Visual Designer Agent
- [ ] Visual prompt generation for each scene
- [ ] Style consistency enforcement
- [ ] Color palette selection
- [ ] Asset requirements identification
- [ ] Layout recommendations

**Inputs**: Scene breakdown, brand guidelines
**Outputs**: Visual prompts, style specifications

**Status**: ⏳ Not started

---

### Scene Assembler Agent
- [ ] ffmpeg command generation
- [ ] Remotion component generation
- [ ] Audio mixing configuration
- [ ] Transition insertion
- [ ] Quality control checks

**Inputs**: Generated scene files, assembly requirements
**Outputs**: Final video file

**Status**: ⏳ Not started

---

## Platform Integration (Future)

### Context Management
- [ ] Define context schema per topic
- [ ] Storage system for pedagogical approaches
- [ ] Learning objectives database
- [ ] Evaluation criteria storage
- [ ] Past papers/examples repository

### Agent Orchestration
- [ ] Integrate Anthropic Agent SDK
- [ ] Build context-aware agents
- [ ] Agent coordination layer
- [ ] Custom tool development

### Teacher Collaboration
- [ ] Review interface
- [ ] Adjustment tools
- [ ] Voiceover integration
- [ ] Approval workflows

### Student Feedback Loop
- [ ] Evaluation system
- [ ] Performance tracking
- [ ] Adaptive content delivery
- [ ] Revision engine

---

## Immediate Next Steps (Prioritized)

### Phase 1: Complete Core Tools (Weeks 1-2)

1. **Manim Integration** (Priority: HIGH)
   - [ ] Set up Python environment
   - [ ] Install Manim Community Edition
   - [ ] Create basic scene templates
   - [ ] Build backend API endpoint
   - [ ] Test mathematical animation generation

   **Why first**: Unique capability, hard to replicate, core to educational content

2. **Mermaid.js Integration** (Priority: HIGH)
   - [ ] Install mermaid-cli
   - [ ] Create Claude → Mermaid generator
   - [ ] Build 3-5 diagram type templates
   - [ ] Backend API integration

   **Why second**: Easy to implement, high ROI, versatile

3. **ffmpeg Assembly** (Priority: MEDIUM)
   - [ ] Install ffmpeg
   - [ ] Create scene concatenation service
   - [ ] Test with existing Remotion outputs

   **Why third**: Needed for full pipeline, relatively simple

---

### Phase 2: Agent System (Weeks 3-4)

4. **Director Agent** (Priority: HIGH)
   - [ ] Design scene breakdown algorithm
   - [ ] Implement tool selection logic
   - [ ] Create simple test cases

5. **Script Writer Agent** (Priority: MEDIUM)
   - [ ] Build narration generator
   - [ ] Test with sample topics

---

### Phase 3: Polish & Integration (Week 5+)

6. **Remotion Assembly Templates**
7. **Complete HTML/CSS diagram library**
8. **End-to-end pipeline testing**

---

## Current Sprint (Week 1)

**Focus**: Build Manim + Mermaid (core generation tools)

**Goals**:
- [ ] Manim: Generate first mathematical animation
- [ ] Mermaid: Generate first flowchart/sequence diagram
- [ ] Document both in project

**Blocked By**: None - ready to start

---

## Completed Milestones

### Week 0 (Oct 22, 2025)
- ✅ Content workspace UI/UX
- ✅ Image generation with dynamic modes (text-to-image, image-to-image, enhancement)
- ✅ Content creation chat interface with Claude
- ✅ Firebase storage integration
- ✅ Basic output format selection
- ✅ Dynamic mode detection for image generation
- ✅ Remotion setup and configuration
- ✅ HTML/CSS animated diagram proof of concept
- ✅ PipelineDiagram Remotion component (professional, animated)
- ✅ Architecture decisions documented
- ✅ Project plan created with actionable items

---

## Strategic Initiatives (Beyond Tools)

### YouTube Content Strategy

**"30 Agents in 30 Days" Series**
- [ ] Plan 30-agent content calendar
- [ ] Create Day 1 script (Business Strategy Agent)
- [ ] Set up YouTube channel branding
- [ ] Record first 5 episodes (buffer)
- [ ] Launch series
- [ ] Daily uploads for 30 days
- [ ] Build community (Discord/GitHub)

**Status**: 📋 Planned - See `STRATEGIC-VISION.md`

**Revenue Potential**: $2-5K/month ads + authority building + customer acquisition

---

### Strategy Consultant Agent (Product)

**AI-powered business strategy consultant integrated with PeakFlow**

- [ ] Build MVP (core analysis features)
- [ ] Test with sample business data
- [ ] Integrate with PeakFlow database
- [ ] Create dashboard UI
- [ ] Beta test with 50 users
- [ ] Launch Platinum tier ($149/month)
- [ ] Add production planning features
- [ ] Expand to agent marketplace

**Status**: 📋 Planned - See `STRATEGIC-VISION.md`

**Revenue Potential**: $15-75K/month (200-500 Platinum users)

**Key Features:**
- Financial analysis (trends, margins, forecasting)
- Market research (competitors, benchmarks)
- Strategic recommendations (pricing, positioning)
- Production planning (inventory, demand)
- Real-time insights from live accounting data

---

### PeakFlow Integration Strategy

**Leverage existing accounting platform as distribution channel**

- [ ] Analyze PeakFlow data architecture
- [ ] Design Strategy Agent integration points
- [ ] Build API layer for agent access
- [ ] Create UI components for insights
- [ ] Test with beta users
- [ ] Launch as premium tier

**Status**: 📋 Planned

**Advantage**: Captive audience, existing data, no cold start problem

---

## Reference Documents

- `FundoPlatform.md` - Overall platform vision (education focus)
- `STRATEGIC-VISION.md` - **NEW** - Strategy Agent + YouTube + PeakFlow master plan
- `IMAGE-GENERATION-GUIDE.md` - Gemini image generation
- `REMOTION-INTEGRATION.md` - Remotion video capabilities
- `MERMAID-EXAMPLES.md` - Diagram generation examples
- `DYNAMIC-MODE-IMPLEMENTATION.md` - Image generation technical details
- `PROJECT-PLAN.md` - This document

---

## Notes

- Reference `FundoPlatform.md` for full vision
- Focus on tool quality over quantity
- Each tool should be production-ready before integration
- Keep platform orchestration separate for now

---

**Created**: 2025-10-22
**Last Updated**: 2025-10-22 (Architecture & priorities defined)
**Next Review**: After completing Manim + Mermaid integration
**Status**: Ready to begin implementation
