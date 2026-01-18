# Fundo Platform - Vision Document

## Overview

A Human-in-the-Loop educational content generation platform that combines:
- AI-powered content generation
- Pedagogically-aware agents
- Multiple output formats (Manim, Remotion, Excalidraw, Reveal, Notes, etc.)
- Teacher collaboration and refinement
- Student-adaptive feedback loops

## Core Concept

Unlike generic educational content platforms, Fundo combines:
1. **Subject domain expertise** (LLM training data, past papers, evaluation criteria)
2. **Unique pedagogical approaches** (your methodology per topic)
3. **Multiple output formats** (visualizations, videos, diagrams, presentations)
4. **Human expertise** (teacher review, adjustment, voiceovers)
5. **Student feedback loops** (evaluation, revised approaches, focused output)

## High-Level Architecture

```
Math Syllabus
    ↓
Topics (1-8+)
    ↓
Context per Topic:
  • Learning Objectives
  • Principles and concepts
  • Historic Evaluation Criteria (examples, past papers)
  • Desired Outcomes
  • Known approaches + Marking Schemes
    ↓
LLM Training Data + Anthropic Agent SDK + Custom Tools
    ↓
Output Format Agents:
  • Manim Agent (mathematical visualizations)
  • Remotion Agent (video production with branding)
  • Excalidraw Agent (hand-drawn diagrams)
  • Reveal.js Agent (interactive presentations)
  • Notes Agent (study materials)
  • Interactive Artifacts
  • OBS integration
    ↓
Teacher/Tutor Layer:
  • Review generated content
  • Adjust outputs
  • Add voiceovers
  • Refine based on pedagogical alignment
  • Evaluate student approach alignment
    ↓
Student Interaction:
  • Receives focused output
  • Provides feedback through evaluation
  • Gets revised approach if needed
    ↓
Feedback Loop → Continuous Improvement
```

## Key Components

### 1. Context Builder per Topic

For each topic in the syllabus, the system maintains:
- Learning objectives
- Core principles and concepts
- Historic evaluation criteria
- Your unique teaching approach
- Marking schemes
- Desired learning outcomes

### 2. Intelligent Output Agents

Each output format has an agent that:
- Understands the pedagogical context
- Uses LLM training data + your approach
- Generates format-specific content
- Maintains quality and alignment

**Output Formats:**
- **Manim**: Mathematical animations and visualizations
- **Remotion**: Branded video content with motion graphics
- **Excalidraw**: Hand-drawn style diagrams and flowcharts
- **Reveal.js**: Interactive web presentations
- **Notes**: Study materials and summaries
- **Interactive Artifacts**: Custom HTML/JS learning tools
- **OBS**: Live streaming integration

### 3. Human-in-the-Loop (HIL) Layer

Teachers/tutors:
- Review AI-generated content
- Make adjustments based on experience
- Add human touch (voiceovers, personalization)
- Ensure alignment with teaching philosophy
- Refine based on student responses

### 4. Student Feedback System

- Individual student evaluation
- Performance tracking
- Adaptive content delivery
- Revised approaches based on learning gaps
- Focused output per student needs

## Differentiation

### What Makes Fundo Unique?

Most educational platforms:
- Generate generic content
- One-size-fits-all approach
- No pedagogical grounding
- Fully automated (no human refinement)

Fundo:
- Pedagogically-aware content generation
- Your unique approach per topic
- Human expertise in the loop
- Student-adaptive output
- Multiple specialized output formats
- Teacher collaboration built-in

## Development Phases

### Phase 1: Output Tools (Current Focus)
Build and integrate standalone output generators:
- Manim integration
- Remotion setup
- Excalidraw generation
- Existing: Gemini image generation, Claude content creation

**Goal**: Ensure each tool can take input and produce quality output

### Phase 2: Context Management
- Store pedagogical approaches per topic
- Manage learning objectives
- Track evaluation criteria
- Build topic-specific context stores

### Phase 3: Agent Orchestration
- Implement Anthropic Agent SDK
- Build context-aware agents per output format
- Create agent coordination layer
- Add custom tools on top of SDK

### Phase 4: Teacher Collaboration
- Build teacher review interface
- Add adjustment/refinement tools
- Voiceover integration
- Approval workflows

### Phase 5: Student Feedback Loop
- Student evaluation system
- Performance tracking
- Adaptive content delivery
- Revision recommendation engine

### Phase 6: Platform Integration
- Unified content workspace
- Multi-tenant support
- Analytics and insights
- Scaling and deployment

## Technical Stack

**Current:**
- Frontend: Next.js 14, React, TypeScript
- Backend: Express, TypeScript
- AI: Claude (Anthropic), Gemini 2.5 Flash ("nano banana")
- Storage: Firebase/Firestore
- Image Generation: Google Gemini API

**Planned Additions:**
- Manim (Python-based mathematical animations)
- Remotion (React-based video generation)
- Excalidraw (diagram generation)
- Anthropic Agent SDK
- Custom agent tools and orchestration

## Use Cases

### Example 1: Quadratic Equations Topic

1. **Context Setup**:
   - Learning objective: Students understand vertex form
   - Your approach: Visual transformation method
   - Past papers: Common mistakes on vertex identification

2. **Agent Generation**:
   - Manim creates visual transformation animation
   - Excalidraw generates practice diagrams
   - Notes agent creates study guide
   - Reveal creates interactive presentation

3. **Teacher Review**:
   - Adjust animation pacing
   - Add voiceover explaining key insight
   - Refine practice problems

4. **Student Interaction**:
   - Student watches animation
   - Works through practice
   - Gets evaluation feedback
   - Receives focused revision if needed

## Future Enhancements

- Multi-language support
- Accessibility features (screen readers, captions)
- Collaborative learning (student groups)
- Parent/guardian dashboards
- Integration with existing LMS systems
- Mobile apps
- Offline mode

## Vision Statement

**"Educational content generation that combines AI power with human expertise and pedagogical wisdom to create adaptive, high-quality learning experiences at scale."**

---

## Notes

- This is a living document
- Will be refined as we build and learn
- Current focus: Build the output tools first
- Platform orchestration comes later

## Related Documents

- `IMAGE-GENERATION-GUIDE.md` - Gemini image generation
- `CONTENT-CREATION-WORKSPACE.md` - Current content workspace
- `COMPLETE-VIDEO-PIPELINE.md` - Video generation (if exists)
- `REMOTION-INTEGRATION.md` - Remotion setup (if exists)

---

**Created**: 2025-10-22
**Status**: Vision/Planning Phase
**Current Focus**: Output Tool Development
