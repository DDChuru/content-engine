# Content Platform Architecture

## Overview

A unified content production platform with two verticals sharing core infrastructure:

1. **Education** - Syllabus-driven, curriculum-linked educational content
2. **Professional Content** - Research/brief-driven, business content

Both use the same quality pipeline: **Opus 4.5 generation → Sonnet 4.5 evaluation → Human approval**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SHARED INFRASTRUCTURE                            │
│                                                                         │
│   Studio UI │ Remotion │ Evaluation Pipeline │ Firebase │ Skills       │
│   Gemini Image │ ElevenLabs │ Hooks/Commands │ Human Review            │
└─────────────────────────────────────────────────────────────────────────┘
                    │                               │
        ┌───────────┴───────────┐       ┌──────────┴───────────┐
        ▼                       ▼       ▼                      ▼
┌─────────────────────┐   ┌─────────────────────────────────────────┐
│    EDUCATION        │   │       PROFESSIONAL CONTENT              │
│                     │   │                                         │
│  Context: Syllabi   │   │  Context: Research/Brief files          │
│  (Firebase)         │   │  (Project directory)                    │
│                     │   │                                         │
│  Subjects:          │   │  Outputs:                               │
│  • Math (Manim)     │   │  • Videos (Remotion)                    │
│  • Chemistry (TBD)  │   │  • PowerPoint                           │
│  • Physics (TBD)    │   │  • Word Documents                       │
│                     │   │                                         │
│  Output:            │   │  Context sources:                       │
│  • Video lessons    │   │  • Provided files (briefs, research)    │
│  • SCORM packages   │   │  • AI research (web, augmentation)      │
└─────────────────────┘   └─────────────────────────────────────────┘
```

---

## Project Structure

```
projects/
  education/
    igcse-math-2025/
      syllabus-link: firebase://syllabi/cambridge-igcse-maths-0580
      lessons/
        sets-introduction/
          status: "approved"
          assets/
          evaluations/

  professional/
    acs-training-video/
      context/
        brief.md
        brand-guidelines.md
        reference-materials/
      output/
        videos/
        presentations/
      evaluations/

    client-pitch-deck/
      context/
        client-brief.md
        competitor-analysis.md
      output/
        presentations/
```

---

## Content State Machine

All content (Education and Professional) follows the same state flow:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  GENERATION (Opus 4.5)                                              │
│      │                                                              │
│      ▼                                                              │
│  IMMEDIATE EVALUATION (Sonnet 4.5 agents, parallel)                 │
│      │                                                              │
│      ├─── PASS ───┐                                                 │
│      │            ▼                                                 │
│      │      ┌───────────┐                                           │
│      │      │   DRAFT   │                                           │
│      │      └───────────┘                                           │
│      │            │                                                 │
│      │            ▼                                                 │
│      │      ADDITIONAL EVALUATIONS (optional)                       │
│      │            │                                                 │
│      │            ▼                                                 │
│      │      ┌─────────────┐                                         │
│      │      │ HUMAN QUEUE │ ← Review in Studio UI                   │
│      │      └─────────────┘                                         │
│      │            │                                                 │
│      │            ├─── APPROVE ──→ VOICE GENERATION                 │
│      │            │                      │                          │
│      │            │                      ▼                          │
│      │            │               ┌───────────┐                     │
│      │            │               │ APPROVED  │                     │
│      │            │               └───────────┘                     │
│      │            │                      │                          │
│      │            │                      ▼                          │
│      │            │                 PUBLISHED                       │
│      │            │                                                 │
│      │            └─── REJECT ───→ Back to DRAFT with notes         │
│      │                                                              │
│      └─── FAIL (retry up to 3x) ───→ Human escalation               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Evaluation Pipeline

### Model Strategy

| Stage | Model | Purpose |
|-------|-------|---------|
| Generation | Opus 4.5 | Quality-first content creation |
| Evaluation | Sonnet 4.5 | Parallel evaluation agents |
| Quick checks | Haiku | Simple validations (structure, fields) |

### Evaluation Agents (Parallel)

```
Generation Complete
        │
        ├──→ Math Accuracy Agent (if applicable)
        ├──→ Visual Clarity Agent
        ├──→ Pedagogical Agent (Education) / Message Clarity Agent (Professional)
        ├──→ Brand/Style Agent
        │
        └──→ Aggregate Results
                │
                ├── All Pass → DRAFT
                ├── Minor Issues → DRAFT with notes
                └── Critical Fail → Retry (max 3) or Escalate
```

### Evaluation Response Format

```json
{
  "agent": "math_accuracy",
  "model": "sonnet-4.5",
  "passed": false,
  "severity": "critical",
  "issues": [
    "y-intercept labeled as (1,0) should be (0,1)"
  ],
  "suggested_fix": "Change y-intercept label from (1,0) to (0,1)",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Subject/Domain Specific Rubrics

```
evaluators/
  education/
    math/
      algebraic-accuracy.md
      graph-correctness.md
      notation-standards.md
    chemistry/
      equation-balancing.md
      structure-validity.md
    physics/
      unit-consistency.md
      diagram-accuracy.md

  professional/
    brand-consistency.md
    message-clarity.md
    visual-design.md
    factual-accuracy.md
```

---

## Studio UI

Single studio with project/workspace context:

### Features

- **Project Selector**: Switch between Education and Professional projects
- **Context Panel**: Show loaded syllabus (Education) or research files (Professional)
- **Generation Preview**: View generated content before evaluation
- **Review Queue**: Approve/reject content pending human review
- **Output Manager**: Render to video, export to PowerPoint/Word

### Existing Infrastructure to Leverage

- `/studio-request` command → Request generations
- `/screenshot` command → Capture for review
- Studio request/response workflow

### New Capabilities Needed

- Project/workspace management
- Syllabus linking (Education)
- Research file display (Professional)
- Evaluation results display
- Approve/reject workflow

---

## Context Sources

### Education: Syllabus Link

```
Firebase: syllabi/{syllabusId}
         └── units/{unitId}
               └── topics/{topicId}
                     └── concepts, exercises, quiz

Studio hooks into this structure.
All generation happens in curriculum context.
```

### Professional: Research Files

```
projects/professional/{project-name}/
  context/
    brief.md              ← Client/project brief
    brand-guidelines.md   ← Style rules
    research.md           ← AI-augmented research
    reference/            ← PDFs, images, examples
```

**Hybrid approach:**
- You provide files (briefs, references)
- I research and augment as needed
- Combined context drives generation

---

## Output Formats

### Education

| Format | Use Case |
|--------|----------|
| Video (Remotion) | Lesson delivery |
| SCORM Package | LMS integration |
| Interactive (D3) | Practice exercises |

### Professional

| Format | Use Case |
|--------|----------|
| Video (Remotion) | Explainers, training |
| PowerPoint | Presentations, decks |
| Word Document | Reports, documentation |

### Skills for Output Formats

```
skills/
  output-formats/
    remotion-video.md
    powerpoint.md
    word-document.md

  content-types/
    explainer.md
    tutorial.md
    presentation.md
    training-module.md
```

---

## Generation Infrastructure

### Shared Components

| Component | Purpose |
|-----------|---------|
| Gemini Image (gemini-3-pro) | Whiteboard diagrams, graphs, visuals |
| Remotion | Video composition and rendering |
| ElevenLabs | Voice generation, cloning |
| Firebase | State management, content storage |

### Education-Specific

| Component | Purpose |
|-----------|---------|
| Manim | Mathematical animations |
| Chemistry renderer (TBD) | Molecular structures |
| Physics simulation (TBD) | Force diagrams, motion |

### Professional-Specific

| Component | Purpose |
|-----------|---------|
| PowerPoint generator | .pptx creation |
| Word generator | .docx creation |

---

## Claude Code Integration

### Hooks (Auto-triggered)

```
on_generation_complete:
  → Spawn Sonnet evaluation agents
  → Store results
  → Update content status

on_evaluation_complete:
  → If passed: move to draft
  → If failed: retry or escalate
```

### Slash Commands

```
/project <name>           → Switch to project context
/context                  → Show current context (syllabus or research files)
/generate <description>   → Generate content
/evaluate <content-id>    → Manually trigger evaluation
/review-queue             → Show items pending human review
/approve <id>             → Approve content
/reject <id> <notes>      → Reject with feedback
/render <id> <format>     → Render to output format
```

---

## Firebase Schema

### Education

```
syllabi/{syllabusId}/
  units/{unitId}/
    topics/{topicId}/
      lessons/{lessonId}/
        status: "draft" | "evaluated" | "human_queue" | "approved" | "published"
        assets/
        evaluations/
        humanReview/
```

### Professional

```
projects/{projectId}/
  type: "professional"
  name: "ACS Training Video"
  contextFiles: ["brief.md", "brand-guidelines.md"]

  content/{contentId}/
    status: "draft" | "evaluated" | "human_queue" | "approved" | "published"
    assets/
    evaluations/
    humanReview/

  outputs/{outputId}/
    format: "video" | "powerpoint" | "word"
    path: "..."
```

---

## Implementation Priority

### Phase 1: Evaluation Pipeline
- [ ] Sonnet 4.5 evaluation agents
- [ ] Parallel evaluation execution
- [ ] 3 retry max logic
- [ ] Human review queue
- [ ] Basic rubrics (math accuracy, visual clarity)

### Phase 2: Studio + Syllabus Hook (Education)
- [ ] Connect studio to Firebase syllabi
- [ ] Work in curriculum context
- [ ] Subject-specific tools loading

### Phase 3: Professional Content Vertical
- [ ] Project/workspace structure
- [ ] Research file context loading
- [ ] PowerPoint generation
- [ ] Word document generation

### Phase 4: Skills System
- [ ] Output format skills
- [ ] Content type skills
- [ ] Domain-specific evaluation rubrics

---

## Cost Model

### Per Generation Cycle

| Step | Model | Approx Cost |
|------|-------|-------------|
| Generation | Opus 4.5 | ~$0.05-0.15 |
| Evaluation (4 agents) | Sonnet 4.5 | ~$0.01-0.02 |
| Quick validation | Haiku | ~$0.001 |
| Image generation | Gemini 3 Pro | ~$0.04 |
| Voice (if applicable) | ElevenLabs | ~$0.30/1K chars |

### Quality Investment

Higher upfront cost for Opus generation + thorough evaluation = fewer errors reaching production = lower rework cost.

---

## Guiding Principles

1. **Quality over quantity** - Thorough evaluation, human approval required
2. **Context is everything** - All generation happens within project context
3. **Audit trail** - Every piece of content traceable (who generated, who evaluated, who approved)
4. **Expertise accumulates** - Domain knowledge codified into skills and agents
5. **Shared infrastructure** - One platform, multiple verticals
