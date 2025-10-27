# Educational Visualization Agent

Complete framework for generating educational visualizations using D3.js + Manim with spatial guardrails.

## Overview

The Educational Visualization Agent orchestrates the generation of split-screen educational videos:

- **LEFT (D3.js)**: Step-by-step text solution (clear, simple boxes)
- **RIGHT (Manim)**: Visual animated demonstration (circles, graphs, diagrams)

This approach ensures:
- **Educational clarity**: Text + visual working together
- **Age-appropriate**: Designed for 13-16 year olds
- **Collision-free**: Spatial guardrails prevent overlaps
- **Professional quality**: Stable, smooth animations

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Educational Visualization Agent                          │
│                                                          │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │   Claude AI  │  │  D3 Engine   │  │   Manim      │   │
│ │  (Analysis)  │→ │ (Text Steps) │→ │ (Animation)  │   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
│         ↓                  ↓                  ↓          │
│ ┌──────────────────────────────────────────────────┐   │
│ │          FFmpeg Video Combiner                   │   │
│ │          (Side-by-side composition)              │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Components

#### 1. **Educational Viz Agent** (`src/agents/educational-viz-agent.ts`)

Main orchestrator that:
- Analyzes math problems using Claude
- Generates D3 text-based solutions
- Creates Manim visual animations
- Combines both into final video

#### 2. **D3 Visualization Engine** (`src/services/d3-viz-engine.ts`)

Handles D3 rendering with:
- Force simulation (invisible collision detection)
- 300-tick stabilization (prevents wobbling)
- SVG generation via JSDOM
- Hand-drawn aesthetic support

#### 3. **Spatial Configuration** (`src/config/spatial-config.ts`)

Defines layout constraints:
- Canvas: 1920×1080 (split to 960×1080 per side)
- Padding: 50px outer, 20px inner
- Fonts: Poppins (headings), Inter (body)
- Colors: Blackboard aesthetic (#1a1a2e background)

#### 4. **D3 Spatial Validator** (`src/validators/d3-spatial-validator.ts`)

Prevents rendering issues:
- Collision prediction via force simulation
- Auto-fix (truncate labels, remove excess nodes)
- Max constraints (40 nodes, 50 char labels)

#### 5. **Prompt Builders**

- `src/prompts/d3-visualization-prompt.ts` - D3-specific constraints
- `src/prompts/manim-visualization-prompt.ts` - Manim guidance

## API Endpoints

### POST `/api/education/visualize`

Generate educational visualization for a single problem.

**Request:**
```json
{
  "problem": "Find A ∩ B where A = {1,2,3,4,5} and B = {4,5,6,7,8}",
  "type": "sets",
  "targetAge": 13,
  "duration": 12,
  "style": {
    "d3Style": "clean",
    "manimStyle": "educational"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "finalVideo": "output/edu-viz-1234567890/final-educational-video.mp4",
    "d3Output": {
      "scriptPath": "output/edu-viz-1234567890/d3-solution.js",
      "imagePath": "output/edu-viz-1234567890/d3-solution.png",
      "videoPath": "output/edu-viz-1234567890/d3-solution-video.mp4"
    },
    "manimOutput": {
      "scriptPath": "output/edu-viz-1234567890/visual_animation.py",
      "videoPath": "output/edu-viz-1234567890/media/videos/.../visual-animation.mp4"
    },
    "metadata": {
      "problem": "Find A ∩ B...",
      "duration": 15.234,
      "generatedAt": "2025-10-25T04:00:00.000Z",
      "costs": {
        "claudeTokens": 1500,
        "estimatedCost": 0.015
      }
    }
  }
}
```

### POST `/api/education/lesson`

Generate complete lesson with multiple visualizations.

**Request:**
```json
{
  "topic": "Set Theory Basics",
  "concepts": ["union", "intersection", "complement"],
  "targetAge": 13,
  "duration": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "title": "Set Theory Basics",
      "concepts": [
        {
          "name": "Union",
          "explanation": "...",
          "exampleProblem": "...",
          "visualizationType": "venn_diagram"
        }
      ]
    },
    "visualizations": [
      {
        "concept": "Union",
        "video": "output/edu-viz-123/final-educational-video.mp4",
        "success": true
      }
    ]
  }
}
```

### POST `/api/education/sets-demo`

Demo endpoint using proven sets intersection template.

**Request:**
```bash
curl -X POST http://localhost:3001/api/education/sets-demo
```

**Response:**
```json
{
  "success": true,
  "message": "Sets intersection demo generated successfully!",
  "result": {
    "finalVideo": "output/edu-viz-1234567890/final-educational-video.mp4",
    "d3Output": {...},
    "manimOutput": {...},
    "metadata": {...}
  }
}
```

### GET `/api/education/examples`

Get example problems for different topics.

**Response:**
```json
{
  "success": true,
  "data": {
    "sets": [
      {
        "problem": "Find A ∩ B where A = {1,2,3,4,5} and B = {4,5,6,7,8}",
        "type": "sets",
        "targetAge": 13
      }
    ],
    "algebra": [...],
    "geometry": [...]
  }
}
```

## Usage Examples

### Basic Usage (TypeScript)

```typescript
import { ClaudeService } from './services/claude';
import { EducationalVizAgent } from './agents/educational-viz-agent';

const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY);
const agent = new EducationalVizAgent(claudeService);

const result = await agent.generate({
  problem: 'Find A ∩ B where A = {1,2,3,4,5} and B = {4,5,6,7,8}',
  type: 'sets',
  targetAge: 13,
  duration: 12
});

console.log('Final video:', result.finalVideoPath);
```

### cURL Examples

**Generate Sets Visualization:**
```bash
curl -X POST http://localhost:3001/api/education/visualize \
  -H "Content-Type: application/json" \
  -d '{
    "problem": "Find A ∩ B where A = {1,2,3,4,5} and B = {4,5,6,7,8}",
    "type": "sets",
    "targetAge": 13
  }'
```

**Generate Complete Lesson:**
```bash
curl -X POST http://localhost:3001/api/education/lesson \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Set Theory Basics",
    "concepts": ["union", "intersection"],
    "targetAge": 13
  }'
```

## Supported Visualization Types

| Type | D3 Content | Manim Content | Example |
|------|------------|---------------|---------|
| `sets` | Step-by-step solution | Venn diagrams | A ∩ B = {4,5} |
| `algebra` | Equation steps | Graph transformations | Solve 2x + 5 = 13 |
| `geometry` | Formula breakdown | Geometric constructions | Area of circle |
| `calculus` | Differentiation steps | Function plots | dy/dx of x² |
| `statistics` | Data analysis steps | Charts and distributions | Mean, median, mode |
| `general` | Text explanation | Generic visual | Any topic |

## Spatial Guardrails

### D3 Side (Left - 960×1080)

**Constraints:**
- Max nodes: 40
- Max label length: 50 characters
- Padding: 50px outer, 20px inner
- Safe zone: 860×980 pixels

**Collision Detection:**
- Runs invisibly in code (300 ticks)
- Uses D3 force simulation
- Positions finalized before rendering
- No wobbling in final output

### Manim Side (Right - 960×1080)

**Coordinate System:**
- Manim uses: [-7.11, 7.11] × [-4, 4]
- Conversion helpers in `config/manim-spatial-config.py`
- Safe positioning with `get_safe_position()`

**Validators:**
- Collision detection for Manim objects
- Automatic spacing adjustments
- Label truncation if needed

## File Outputs

Each generation creates:

```
output/edu-viz-{timestamp}/
├── d3-solution.js              # D3 script
├── d3-solution.png             # D3 static image
├── d3-solution-video.mp4       # D3 video (looped PNG)
├── visual_animation.py         # Manim script
├── media/                      # Manim output directory
│   └── videos/
│       └── visual_animation/
│           └── 480p15/
│               └── visual-animation.mp4
└── final-educational-video.mp4 # Combined output
```

## Demo: Sets Intersection

The proven template from `output/sets-demo/` demonstrates:

**LEFT (D3 - Text Steps):**
1. Step 1: Set A = {1,2,3,4,5}
2. Step 2: Set B = {4,5,6,7,8}
3. Step 3: What is ∩? ("AND" or "both")
4. Step 4: Find Common (Which appear in both?)
5. Step 5: Answer = {4,5}

**RIGHT (Manim - Visual):**
- Two overlapping circles (Set A blue, Set B green)
- Numbers positioned correctly (1,2,3 in A only; 6,7,8 in B only)
- Intersection highlighted in yellow (4,5)
- Arrow pointing to intersection
- Final answer at bottom

## Cost Breakdown

Typical generation costs (per 12-second visualization):

| Component | Cost |
|-----------|------|
| Claude Analysis | ~$0.015 (1,500 tokens) |
| D3 Rendering | FREE (local) |
| Manim Rendering | FREE (local) |
| FFmpeg Combination | FREE (local) |
| **Total** | **~$0.015** |

For a 10-concept lesson: **~$0.15**

## Key Improvements Over Previous Approach

### Before (Force Simulation Visible)
- ❌ Nodes wobbling in final video
- ❌ Collision detection happening visually
- ❌ Only 100 simulation ticks
- ❌ Physics simulation running during render

### After (Spatial Guardrails)
- ✅ Stable positions from frame 1
- ✅ Collision detection in code (invisible)
- ✅ 300 simulation ticks (complete stabilization)
- ✅ `simulation.stop()` prevents background running

**Fix Location:** `src/services/d3-viz-engine.ts:207-217`

## Dependencies

**Required:**
- Node.js 18+
- Python 3.11+ (Manim)
- FFmpeg
- Conda environment `aitools` with Manim Community v0.19.0

**NPM Packages:**
- `@anthropic-ai/sdk` - Claude AI
- `d3` - D3.js visualization
- `jsdom` - Server-side DOM
- `sharp` - Image processing

**Python Packages (conda env):**
- `manim` - Animation engine
- `numpy` - Math operations

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional
DEFAULT_VOICE_ID=your-elevenlabs-voice-id
GEMINI_API_KEY=your-gemini-key
```

## Troubleshooting

### D3 Side Issues

**Problem: Nodes overlapping**
- Solution: Validator auto-fixes by reducing nodes or truncating labels
- Check: `D3SpatialValidator.validate()` output

**Problem: Force simulation visible**
- Solution: Ensure 300+ ticks before rendering
- Check: `d3-viz-engine.ts:207-217`

### Manim Side Issues

**Problem: Objects off-screen**
- Solution: Use safe positioning helpers
- Check: `manim-spatial-config.py:get_safe_position()`

**Problem: Conda environment not found**
- Solution: Activate aitools environment
- Command: `source ~/miniconda3/etc/profile.d/conda.sh && conda activate aitools`

### Video Combination Issues

**Problem: Different durations**
- Solution: Specify `duration` in request
- Default: 12 seconds

**Problem: Different resolutions**
- Solution: Both sides render at 960×1080
- Final output: 1920×1080

## Next Steps

Potential enhancements:

1. **More Visualization Types**
   - Number lines for algebra
   - 3D plots for calculus
   - Tree diagrams for probability

2. **Interactive Elements**
   - Pause points for quizzes
   - Highlight regions on click
   - Step-through controls

3. **AI-Generated Scripts**
   - Use Claude to generate Manim Python code
   - Dynamic visualization based on problem type
   - Adaptive difficulty based on age

4. **Voice Narration**
   - Integrate ElevenLabs for audio
   - Sync narration with animations
   - Multi-language support

## References

- **Manim Documentation:** https://docs.manim.community/
- **D3.js Documentation:** https://d3js.org/
- **Spatial Config:** `src/config/spatial-config.ts`
- **Demo Output:** `output/sets-demo/`

---

**Status:** ✅ Complete and production-ready

**Last Updated:** 2025-10-25

**Tested With:** Sets intersection demo (A ∩ B)
