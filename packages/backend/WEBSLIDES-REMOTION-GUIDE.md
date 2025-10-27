# WebSlides-Remotion Component Library - Complete Guide

## Overview

A **global video rendering system** that brings WebSlides' professional aesthetic to Remotion video compositions. Available to ALL workspaces (education, marketing, documentation, etc.).

**What it does:**
- Renders beautiful videos with WebSlides design (dark backgrounds, yellow accents, smooth animations)
- Globally accessible service (not tied to one workspace)
- Integrates seamlessly with specialized agents (Sets Agent, Algebra Agent, etc.)
- Supports multiple themes (education, marketing, documentation)

---

## Quick Start (30 Seconds)

```typescript
import { videoRenderer } from './services/video-renderer';

const scenes = [
  {
    id: 1,
    title: 'Set Theory',
    subtitle: 'Cambridge IGCSE Mathematics',
    mathNotation: 'A ∪ B = {1, 2, 3, 4, 5, 6, 7, 8}',
    visual: '/path/to/manim-venn.mp4',
    duration: 10,
    type: 'webslides-venn'
  }
];

const result = await videoRenderer.quickRender(
  scenes,
  'sets-lesson.mp4',
  'education-dark'
);

console.log(`Video ready: ${result.videoPath}`);
```

---

## Architecture

### WebSlides-Remotion = SHARED SERVICE (Not an Agent)

```
User Request
    ↓
Sets Agent (domain expert) ← AGENT
    ↓
Generates Venn diagram content
    ↓
Calls videoRenderer.renderWebSlidesVideo() ← SERVICE
    ↓
WebSlides components render visuals
    ↓
MP4 video output
```

**Key distinction:**
- **Agents** = Content creators (domain expertise)
- **VideoRenderer** = Presentation layer (no domain expertise)

---

## Components

### 1. WebSlidesSlide (Main Container)

```typescript
import { WebSlidesSlide } from './components/webslides';

<WebSlidesSlide theme={theme}>
  {/* Centered content, like WebSlides .slide-content */}
  <h1>My Title</h1>
</WebSlidesSlide>
```

**Features:**
- Flexbox centering (vertical + horizontal)
- Theme-based background and text colors
- Consistent padding (40px)

### 2. SlideTitle (Animated Title)

```typescript
import { SlideTitle } from './components/webslides';

<SlideTitle theme={theme} delay={10}>
  Set Theory
</SlideTitle>
```

**Features:**
- Spring fade-in animation
- Upward slide entrance (translateY)
- Bold 700 weight, 4rem size
- Customizable delay

### 3. SlideSubtitle (Yellow Accent)

```typescript
import { SlideSubtitle } from './components/webslides';

<SlideSubtitle theme={theme} delay={20}>
  Cambridge IGCSE Mathematics
</SlideSubtitle>
```

**Features:**
- Yellow highlight color (#ffeb3b)
- 1.5rem size
- Fades in after title

### 4. MathNotation (Monospace Formula)

```typescript
import { MathNotation } from './components/webslides';

<MathNotation theme={theme} delay={30}>
  A ∪ B = {'{1, 2, 3, 4, 5, 6, 7, 8}'}
</MathNotation>
```

**Features:**
- Courier New monospace font
- 2rem size
- Yellow color
- Scale-up animation on entrance

### 5. VennDiagramSlide (Sets Visualization)

```typescript
import { VennDiagramSlide } from './components/webslides';

<VennDiagramSlide
  title="Sets"
  subtitle="Cambridge IGCSE Mathematics"
  mathNotation="A ∪ B = {1, 2, 3, 4, 5, 6, 7, 8}"
  visualType="manim"
  visualPath="/path/to/manim-venn.mp4"
  layout={setsAgentLayout}  // From Sets Agent
  theme={theme}
/>
```

**Features:**
- Integrates with Sets Agent spatial_calculator output
- Supports Manim video, D3 SVG, or static images
- 900x600 visual container with rounded corners + shadow
- Optional debug info (development only)

### 6. SlideTransition (Smooth Fades)

```typescript
import { SlideTransition } from './components/webslides';

<SlideTransition theme={theme} duration={30} />
```

**Features:**
- Fade from transparent to opaque
- 30 frames = 1 second at 30fps
- Uses theme background color

---

## Themes

### Available Themes

```typescript
import { getTheme } from './components/webslides';

// Education Dark (default)
const eduDark = getTheme('education-dark');
// Black bg, white text, yellow accents, blue/green colors

// Education Light
const eduLight = getTheme('education-light');
// White bg, black text, darker accents for contrast

// Marketing
const marketing = getTheme('marketing');
// Dark navy bg, coral red accents, purple secondary

// Documentation
const docs = getTheme('documentation');
// GitHub dark theme, blue/green/red/purple accents
```

### Theme Structure

```typescript
interface WebSlidesTheme {
  name: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    accent: string;
    highlight: string;
    secondary: string;
  };
  typography: {
    fontFamily: string;
    mathFont: string;
    headingWeight: number;
    titleSize: string;
    subtitleSize: string;
    mathNotationSize: string;
    bodySize: string;
  };
  spacing: {
    padding: string;
    margin: string;
    gap: string;
  };
  effects: {
    borderRadius: string;
    shadow: string;
    transition: string;
  };
}
```

---

## Usage Examples

### Example 1: Sets Agent Integration

```typescript
// Sets Agent generates content
const setsContent = await setsAgent.invoke({
  description: 'Generate Venn diagram for sets A and B',
  context: {
    setA: [1, 2, 3, 4, 5],
    setB: [4, 5, 6, 7, 8]
  }
});

// VideoRenderer creates video using WebSlides components
const scenes = [
  {
    id: 1,
    title: 'Set Theory: Union and Intersection',
    subtitle: 'Cambridge IGCSE Mathematics',
    mathNotation: 'A ∪ B = {1, 2, 3, 4, 5, 6, 7, 8}',
    visual: '/manim-output/venn-diagram.mp4',  // Manim rendered this
    duration: 10,
    type: 'webslides-venn',
    layout: setsContent.layout  // Spatial calculator data
  }
];

const result = await videoRenderer.renderWebSlidesVideo({
  scenes,
  theme: 'education-dark',
  outputPath: 'output/videos/sets-lesson.mp4',
  codec: 'h264',
  width: 1920,
  height: 1080,
  fps: 30
});
```

### Example 2: Marketing Presentation

```typescript
const scenes = [
  {
    id: 1,
    title: 'Our Product',
    subtitle: 'Revolutionary AI-Powered Platform',
    visual: '/assets/product-demo.mp4',
    duration: 15,
    type: 'manim'
  },
  {
    id: 2,
    title: 'Key Features',
    visual: '/assets/features.png',
    duration: 10,
    type: 'gemini'
  }
];

const result = await videoRenderer.renderPresentation({
  scenes,
  theme: 'marketing',  // Dark navy, coral accents
  outputPath: 'output/videos/marketing/product-pitch.mp4',
  codec: 'h264',
  width: 1920,
  height: 1080,
  fps: 30
});
```

### Example 3: Documentation Video

```typescript
const scenes = [
  {
    id: 1,
    title: 'API Authentication',
    subtitle: 'Getting Started Guide',
    mathNotation: 'Authorization: Bearer <token>',
    visual: '/docs/auth-flow.svg',
    duration: 12,
    type: 'd3-svg'
  }
];

const result = await videoRenderer.quickRender(
  scenes,
  'api-auth-guide.mp4',
  'documentation'  // GitHub dark theme
);
```

---

## API Endpoints

### GET /api/video/themes

List all available themes.

```bash
curl http://localhost:3001/api/video/themes
```

**Response:**
```json
{
  "success": true,
  "themes": [
    {
      "name": "education-dark",
      "colors": { "background": "#000000", "text": "#ffffff", ... },
      "description": "education-dark"
    }
  ],
  "count": 4
}
```

### POST /api/video/render-webslides

Render video using WebSlides aesthetic.

```bash
curl -X POST http://localhost:3001/api/video/render-webslides \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [
      {
        "id": 1,
        "title": "Sets",
        "subtitle": "Cambridge IGCSE",
        "mathNotation": "A ∪ B",
        "visual": "/path/to/video.mp4",
        "duration": 10,
        "type": "webslides-venn"
      }
    ],
    "theme": "education-dark",
    "outputFilename": "sets-lesson.mp4"
  }'
```

**Response:**
```json
{
  "success": true,
  "videoPath": "output/videos/sets-lesson.mp4",
  "duration": 10,
  "metadata": {
    "scenes": 1,
    "codec": "h264",
    "resolution": "1920x1080",
    "fps": 30
  }
}
```

### POST /api/video/render-presentation

Render generic presentation (defaults to marketing theme).

```bash
curl -X POST http://localhost:3001/api/video/render-presentation \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [...],
    "theme": "marketing",
    "outputPath": "output/videos/pitch.mp4"
  }'
```

### GET /api/video/health

Check video service status.

```bash
curl http://localhost:3001/api/video/health
```

---

## Integration with Agents

### Pattern: Agent Generates Content → VideoRenderer Renders Video

```typescript
// 1. Agent generates educational content
class SetsAgent extends BaseAgent {
  async invoke(task) {
    // Domain expertise: Generate Venn diagram
    const layout = await this.calculateVennLayout(setA, setB);

    return {
      layout,
      manimCode: '...',
      d3Code: '...'
    };
  }
}

// 2. Call video renderer (separate service)
const setsContent = await setsAgent.invoke(task);

const scenes = [{
  title: 'Sets',
  visual: '/manim-output/venn.mp4',
  layout: setsContent.layout,
  type: 'webslides-venn'
}];

const video = await videoRenderer.renderWebSlidesVideo({
  scenes,
  theme: 'education-dark',
  outputPath: 'output/sets.mp4'
});
```

**Why this separation?**
- ✅ Agents focus on content (domain expertise)
- ✅ VideoRenderer focuses on presentation (rendering)
- ✅ Reusable across all agents
- ✅ Easy to maintain (one place for rendering logic)

---

## File Structure

```
packages/backend/src/
├── remotion/
│   ├── components/
│   │   └── webslides/
│   │       ├── WebSlidesSlide.tsx
│   │       ├── SlideTitle.tsx
│   │       ├── SlideSubtitle.tsx
│   │       ├── MathNotation.tsx
│   │       ├── VennDiagramSlide.tsx
│   │       ├── SlideTransition.tsx
│   │       ├── themes.ts
│   │       └── index.ts
│   │
│   └── compositions/
│       └── EducationalLesson.tsx (updated)
│
├── services/
│   └── video-renderer.ts
│
└── routes/
    └── video.ts
```

---

## Performance

### Rendering Times (Approximate)

| Scenes | Duration | Render Time |
|--------|----------|-------------|
| 1      | 10s      | ~30s        |
| 5      | 50s      | ~2min       |
| 10     | 100s     | ~4min       |

**Tips:**
- First render is slower (Remotion bundles project)
- Subsequent renders use cache (faster)
- Use `videoRenderer.clearCache()` if having issues

---

## Troubleshooting

**Problem:** Slow first render

**Solution:** Bundle is cached after first render. Subsequent renders are faster.

---

**Problem:** Video doesn't look like WebSlides

**Solution:** Make sure you're using WebSlides components (`VennDiagramSlide`, `SlideTitle`, etc.) not raw Remotion components.

---

**Problem:** Theme colors not applying

**Solution:** Pass `theme` parameter to components:
```typescript
<SlideTitle theme={webSlidesTheme}>Title</SlideTitle>
```

---

**Problem:** Import errors with `.js` extensions

**Solution:** This project uses ESM. All imports must include `.js`:
```typescript
import { videoRenderer } from './services/video-renderer.js';  // ✓
import { videoRenderer } from './services/video-renderer';     // ✗
```

---

## Future Enhancements

**Planned:**
- [ ] More specialized slides (AlgebraSlide, GeometrySlide, etc.)
- [ ] Custom fonts support
- [ ] Animation presets library
- [ ] Subtitle/caption generation
- [ ] Audio sync helpers

---

## Summary

**WebSlides-Remotion is:**
- ✅ Global service (all workspaces)
- ✅ Professional aesthetic (WebSlides design)
- ✅ Easy to use (2-line rendering)
- ✅ Themeable (4 themes included)
- ✅ Agent-friendly (separation of concerns)

**It is NOT:**
- ❌ An agent (no domain expertise)
- ❌ Workspace-specific (globally available)
- ❌ Tied to one content type (works for education, marketing, docs)

**Use it whenever you need professional video output with WebSlides aesthetic!**

---

**Version:** 1.0.0
**Status:** ✅ Production-Ready
**Documentation:** This file
