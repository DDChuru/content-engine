# Consistency Guardrails: D3 + Manim Structure

**Critical Issue:** AI agents must produce consistent, high-quality D3 and Manim output every time.

**Problem:** Without guardrails, agents might generate:
- Inconsistent colors across videos
- Different font sizes
- Misaligned layouts
- Varying animation speeds
- Incompatible styles

**Solution:** Strict templates + validation + enforcement

---

## The Consistency Problem

### **What Happens Without Guardrails:**

```
Agent generates video 1:
  - Blue circles, 40px font, 3s animations
  - Looks professional ✅

Agent generates video 2:
  - Red circles, 24px font, 5s animations
  - Looks different ❌

Student watches both:
  - "Why does this feel like different courses?"
  - Trust damaged ❌
```

### **What We Need:**

```
All videos:
  - Same color palette (#000, #fff, #1e88e5, #4caf50, #ffeb3b, #ff5722)
  - Same font sizes (title: 48px, body: 32px, code: 28px)
  - Same animation timing (simple: 2s, complex: 3s, transition: 1s)
  - Same stroke widths (3px everywhere)
  - Same layout grid (title top 10%, content middle 80%, footer bottom 10%)

Result:
  - Professional, cohesive course ✅
  - Students trust the platform ✅
```

---

## Solution Architecture

### **Three-Layer Defense:**

```
Layer 1: TEMPLATES (Prevent bad input)
    ↓
Layer 2: VALIDATION (Catch errors before render)
    ↓
Layer 3: ENFORCEMENT (Override if agent deviates)
```

---

## Layer 1: Strict Templates

### **Shared Style Configuration (Single Source of Truth)**

```typescript
// src/config/blackboard-style.ts

export const BLACKBOARD_STYLE = {
  // Color palette - NEVER deviate
  colors: {
    background: '#000000',    // Black chalkboard
    text: '#ffffff',          // White chalk (primary)
    blue: '#1e88e5',          // Blue chalk (secondary)
    green: '#4caf50',         // Green chalk (success/examples)
    yellow: '#ffeb3b',        // Yellow chalk (highlights)
    red: '#ff5722',           // Red/orange chalk (warnings)
    gray: '#757575'           // Gray chalk (muted)
  },

  // Typography - Exact font sizes
  fonts: {
    family: {
      primary: 'Arial, sans-serif',
      handwriting: 'Caveat, cursive',
      mono: 'Courier New, monospace'
    },
    sizes: {
      title: 48,              // Main title
      subtitle: 36,           // Section headers
      body: 32,               // Regular text
      caption: 24,            // Small text/labels
      code: 28                // Code/equations
    }
  },

  // Stroke widths - Consistent lines
  strokes: {
    thin: 2,                  // Fine details
    normal: 3,                // Default
    thick: 4,                 // Emphasis
    veryThick: 6              // Heavy emphasis
  },

  // Animation timing - Standard durations
  timing: {
    instant: 0.5,             // Quick transitions
    fast: 1,                  // Simple animations
    normal: 2,                // Standard animations
    slow: 3,                  // Complex animations
    verySlow: 4               // Very detailed
  },

  // Layout grid - Consistent positioning
  layout: {
    title: { y: 0.1 },        // Top 10%
    content: { y: 0.5 },      // Middle 50%
    footer: { y: 0.9 },       // Bottom 10%
    margin: { x: 0.05, y: 0.05 }  // 5% margins
  },

  // Dimensions - Standard sizes
  dimensions: {
    video: { width: 1920, height: 1080 },
    thumbnail: { width: 1280, height: 720 },
    fps: 30
  }
} as const;  // 'as const' prevents modifications

// Make it immutable
Object.freeze(BLACKBOARD_STYLE);
```

### **D3 Configuration Template**

```typescript
// src/templates/d3-template.ts

import { BLACKBOARD_STYLE } from '../config/blackboard-style';

export function getD3Config() {
  return {
    width: BLACKBOARD_STYLE.dimensions.video.width,
    height: BLACKBOARD_STYLE.dimensions.video.height,

    style: {
      aesthetic: 'hand-drawn' as const,
      backgroundColor: BLACKBOARD_STYLE.colors.background,

      colors: {
        primary: BLACKBOARD_STYLE.colors.text,
        secondary: BLACKBOARD_STYLE.colors.blue,
        accent: BLACKBOARD_STYLE.colors.green,
        text: BLACKBOARD_STYLE.colors.text,
        highlight: BLACKBOARD_STYLE.colors.yellow
      },

      fonts: {
        primary: BLACKBOARD_STYLE.fonts.family.primary,
        handwriting: BLACKBOARD_STYLE.fonts.family.handwriting
      },

      strokeWidth: BLACKBOARD_STYLE.strokes.normal,
      roughness: 1.5  // Hand-drawn wobble
    },

    animation: {
      enabled: true,
      duration: BLACKBOARD_STYLE.timing.normal,
      fps: BLACKBOARD_STYLE.dimensions.fps,
      effects: ['draw' as const]
    }
  };
}

// Agent MUST use this config
export function createD3Engine() {
  return new D3VizEngine(getD3Config());
}
```

### **Manim Script Template**

```typescript
// src/templates/manim-template.ts

import { BLACKBOARD_STYLE } from '../config/blackboard-style';

export function getManimScriptTemplate(userContent: string): string {
  return `
from manim import *

# ============================================================================
# BLACKBOARD STYLE CONSTANTS (DO NOT MODIFY)
# ============================================================================

BACKGROUND = "${BLACKBOARD_STYLE.colors.background}"
WHITE_CHALK = "${BLACKBOARD_STYLE.colors.text}"
BLUE_CHALK = "${BLACKBOARD_STYLE.colors.blue}"
GREEN_CHALK = "${BLACKBOARD_STYLE.colors.green}"
YELLOW_CHALK = "${BLACKBOARD_STYLE.colors.yellow}"
RED_CHALK = "${BLACKBOARD_STYLE.colors.red}"

STROKE_WIDTH = ${BLACKBOARD_STYLE.strokes.normal}
FONT_SIZE_TITLE = ${BLACKBOARD_STYLE.fonts.sizes.title}
FONT_SIZE_BODY = ${BLACKBOARD_STYLE.fonts.sizes.body}

TIMING_FAST = ${BLACKBOARD_STYLE.timing.fast}
TIMING_NORMAL = ${BLACKBOARD_STYLE.timing.normal}
TIMING_SLOW = ${BLACKBOARD_STYLE.timing.slow}

# ============================================================================
# SCENE
# ============================================================================

class EducationalScene(Scene):
    def construct(self):
        # Set background
        self.camera.background_color = BACKGROUND

        ${userContent}
`;
}

// Validation: Ensure agent doesn't override constants
export function validateManimScript(script: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for forbidden overrides
  const forbidden = [
    'background_color =',
    'BACKGROUND =',
    'WHITE_CHALK =',
    'STROKE_WIDTH ='
  ];

  for (const pattern of forbidden) {
    if (script.includes(pattern) && !script.startsWith('from manim')) {
      errors.push(`Script attempts to override constant: ${pattern}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
```

---

## Layer 2: Validation Before Render

### **D3 Data Validator**

```typescript
// src/validators/d3-validator.ts

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class D3Validator {
  /**
   * Validate D3 visualization data before rendering
   */
  static validate(vizData: VizData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check data structure
    if (!vizData.type) {
      errors.push('Missing visualization type');
    }

    if (vizData.type === 'network') {
      if (!vizData.nodes || vizData.nodes.length === 0) {
        errors.push('Network graph must have at least 1 node');
      }

      // Validate node sizes
      vizData.nodes?.forEach((node, i) => {
        if (node.size && (node.size < 20 || node.size > 60)) {
          warnings.push(`Node ${i} size ${node.size} outside recommended range (20-60)`);
        }
      });
    }

    // 2. Check for color overrides
    if (vizData.style?.colors) {
      warnings.push('Agent attempting to override colors - will be ignored');
    }

    // 3. Validate labels
    vizData.nodes?.forEach((node, i) => {
      if (node.label && node.label.length > 20) {
        warnings.push(`Node ${i} label too long (${node.label.length} chars) - may overflow`);
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Sanitize data to enforce style guide
   */
  static sanitize(vizData: VizData): VizData {
    const sanitized = { ...vizData };

    // Remove any style overrides
    delete sanitized.style;

    // Clamp node sizes
    if (sanitized.type === 'network' && sanitized.nodes) {
      sanitized.nodes = sanitized.nodes.map(node => ({
        ...node,
        size: node.size ? Math.max(20, Math.min(60, node.size)) : 30
      }));
    }

    // Truncate long labels
    if (sanitized.nodes) {
      sanitized.nodes = sanitized.nodes.map(node => ({
        ...node,
        label: node.label?.substring(0, 20)
      }));
    }

    return sanitized;
  }
}
```

### **Manim Script Validator**

```typescript
// src/validators/manim-validator.ts

export class ManimValidator {
  /**
   * Validate Manim script before rendering
   */
  static validate(script: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Must use template constants
    const requiredConstants = [
      'BACKGROUND',
      'WHITE_CHALK',
      'STROKE_WIDTH'
    ];

    for (const constant of requiredConstants) {
      if (!script.includes(constant)) {
        warnings.push(`Script should use ${constant} constant`);
      }
    }

    // 2. No hardcoded colors
    const colorPatterns = [
      /#[0-9a-fA-F]{6}/,  // Hex colors
      /rgb\(/,            // RGB colors
      /color=["'][^"']+["']/  // Named colors
    ];

    for (const pattern of colorPatterns) {
      if (pattern.test(script)) {
        warnings.push('Hardcoded colors detected - use constants instead');
      }
    }

    // 3. Check animation timing
    const runTimeRegex = /run_time\s*=\s*(\d+\.?\d*)/g;
    let match;
    while ((match = runTimeRegex.exec(script)) !== null) {
      const time = parseFloat(match[1]);
      if (time > 5) {
        warnings.push(`Animation run_time ${time}s exceeds recommended 5s`);
      }
    }

    // 4. Must extend EducationalScene
    if (!script.includes('class EducationalScene(Scene)')) {
      errors.push('Script must define EducationalScene class');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Sanitize script to enforce style guide
   */
  static sanitize(script: string): string {
    let sanitized = script;

    // Replace hardcoded colors with constants
    sanitized = sanitized.replace(/#ffffff/gi, 'WHITE_CHALK');
    sanitized = sanitized.replace(/#1e88e5/gi, 'BLUE_CHALK');
    sanitized = sanitized.replace(/#4caf50/gi, 'GREEN_CHALK');

    // Clamp run_time values
    sanitized = sanitized.replace(
      /run_time\s*=\s*(\d+\.?\d*)/g,
      (match, time) => {
        const clamped = Math.min(parseFloat(time), 5);
        return `run_time=${clamped}`;
      }
    );

    return sanitized;
  }
}
```

---

## Layer 3: Enforcement (Override If Needed)

### **Render Pipeline with Enforcement**

```typescript
// src/services/enforced-renderer.ts

export class EnforcedRenderer {
  private d3Engine: D3VizEngine;
  private manimRenderer: UnifiedD3ManimRenderer;

  constructor() {
    // Always use template config (can't be overridden)
    this.d3Engine = createD3Engine();
    this.manimRenderer = new UnifiedD3ManimRenderer();
  }

  /**
   * Render D3 with validation and enforcement
   */
  async renderD3(vizData: VizData): Promise<VizOutput> {
    // Step 1: Validate
    const validation = D3Validator.validate(vizData);

    if (!validation.valid) {
      throw new Error(`D3 validation failed: ${validation.errors.join(', ')}`);
    }

    // Log warnings
    if (validation.warnings.length > 0) {
      console.warn('[D3] Warnings:', validation.warnings);
    }

    // Step 2: Sanitize (enforce style guide)
    const sanitized = D3Validator.sanitize(vizData);

    // Step 3: Render with enforced config
    const output = await this.d3Engine.visualize(sanitized);

    // Step 4: Post-render validation
    if (output.frames.length === 0) {
      throw new Error('D3 render produced no frames');
    }

    return output;
  }

  /**
   * Render Manim with validation and enforcement
   */
  async renderManim(userScript: string): Promise<string> {
    // Step 1: Wrap in template
    const fullScript = getManimScriptTemplate(userScript);

    // Step 2: Validate
    const validation = ManimValidator.validate(fullScript);

    if (!validation.valid) {
      throw new Error(`Manim validation failed: ${validation.errors.join(', ')}`);
    }

    // Log warnings
    if (validation.warnings.length > 0) {
      console.warn('[Manim] Warnings:', validation.warnings);
    }

    // Step 3: Sanitize
    const sanitized = ManimValidator.sanitize(fullScript);

    // Step 4: Render
    const videoPath = await this.manimRenderer.renderManimScript(sanitized);

    // Step 5: Post-render validation (check file exists, duration, etc.)
    await this.validateRenderedVideo(videoPath);

    return videoPath;
  }

  private async validateRenderedVideo(path: string): Promise<void> {
    // Check file exists
    const stats = await fs.stat(path);

    // Check file size (shouldn't be empty or too large)
    if (stats.size < 1000) {
      throw new Error('Rendered video is too small (< 1KB)');
    }

    if (stats.size > 100 * 1024 * 1024) {  // 100MB
      console.warn(`Rendered video is very large: ${stats.size} bytes`);
    }
  }
}
```

---

## Agent Integration

### **How Agents Use Enforced Rendering**

```typescript
// src/agents/concept-video-generator-agent.ts

export class ConceptVideoGeneratorAgent extends BaseAgent {
  private renderer: EnforcedRenderer;

  constructor() {
    super('Concept Video Generator', 2);
    this.renderer = new EnforcedRenderer();  // Uses enforced renderer
  }

  protected defineTools(): AgentTool[] {
    return [
      {
        name: 'generate_d3_visualization',
        description: 'Generate D3 visualization with enforced style guide',
        input_schema: {
          type: 'object',
          properties: {
            vizData: { type: 'object' }
          }
        },
        execute: async (input) => {
          // Agent provides data, renderer enforces style
          return await this.renderer.renderD3(input.vizData);
        }
      },
      {
        name: 'generate_manim_animation',
        description: 'Generate Manim animation with enforced style guide',
        input_schema: {
          type: 'object',
          properties: {
            script: { type: 'string' }
          }
        },
        execute: async (input) => {
          // Agent provides script, renderer enforces style
          return await this.renderer.renderManim(input.script);
        }
      }
    ];
  }

  async execute(input: TopicInput): Promise<VideoOutput> {
    // Agent generates content using Claude
    const messages: Anthropic.MessageParam[] = [{
      role: 'user',
      content: `Generate educational video for: ${input.title}

IMPORTANT CONSTRAINTS:
- Use ONLY the constants defined in the template
- Do NOT specify colors directly (use WHITE_CHALK, BLUE_CHALK, etc.)
- Keep animations under 5 seconds
- Follow the layout grid for positioning

Your script will be automatically wrapped in a template that enforces style consistency.`
    }];

    const response = await this.callClaude(messages, this.getSystemPrompt());

    // Claude will call generate_d3_visualization and generate_manim_animation tools
    // Renderer automatically enforces style guide

    return await this.processToolCalls(response);
  }

  private getSystemPrompt(): string {
    return `You are an educational content generator.

STYLE GUIDE (STRICTLY ENFORCED):
- Background: Always black (#000000)
- Colors: Use constants (WHITE_CHALK, BLUE_CHALK, GREEN_CHALK, YELLOW_CHALK, RED_CHALK)
- Fonts: Arial for text, Courier for code
- Font sizes: Title 48px, Body 32px, Caption 24px
- Animation timing: Fast 1s, Normal 2s, Slow 3s
- Layout: Title top 10%, Content middle 80%, Footer bottom 10%

The rendering system will automatically enforce these rules. Focus on:
1. Clear explanations
2. Logical flow
3. Appropriate visualizations
4. Engaging animations

Do NOT try to override style constants - it won't work and will generate warnings.`;
  }
}
```

---

## Testing Consistency

### **Automated Consistency Tests**

```typescript
// tests/consistency.test.ts

describe('Rendering Consistency', () => {
  const renderer = new EnforcedRenderer();

  test('All D3 renders use same background color', async () => {
    const viz1 = await renderer.renderD3(networkData1);
    const viz2 = await renderer.renderD3(comparisonData2);

    // Extract background color from frames
    const bg1 = await getBackgroundColor(viz1.frames[0]);
    const bg2 = await getBackgroundColor(viz2.frames[0]);

    expect(bg1).toBe('#000000');
    expect(bg2).toBe('#000000');
    expect(bg1).toBe(bg2);  // Must be identical
  });

  test('Agent cannot override stroke width', async () => {
    const badData = {
      type: 'network',
      nodes: [{ id: 'A', label: 'Test' }],
      style: { strokeWidth: 10 }  // Agent tries to override
    };

    const output = await renderer.renderD3(badData);

    // Sanitizer should have removed style override
    // Actual stroke width should be 3 (BLACKBOARD_STYLE.strokes.normal)
    const actualStrokeWidth = await getStrokeWidth(output.frames[0]);
    expect(actualStrokeWidth).toBe(3);
  });

  test('Manim scripts use template constants', async () => {
    const script = `
equation = MathTex(r"E = mc^2", color=WHITE_CHALK)
self.play(Write(equation), run_time=TIMING_NORMAL)
`;

    const videoPath = await renderer.renderManim(script);

    // Video should exist and be valid
    expect(await fs.access(videoPath)).resolves.toBeUndefined();
  });

  test('Consistency across 100 renders', async () => {
    const results = [];

    for (let i = 0; i < 100; i++) {
      const viz = await renderer.renderD3(generateRandomNetworkData());
      results.push({
        backgroundColor: await getBackgroundColor(viz.frames[0]),
        strokeWidth: await getStrokeWidth(viz.frames[0]),
        frameCount: viz.frames.length
      });
    }

    // All should be identical
    const firstBg = results[0].backgroundColor;
    const firstStroke = results[0].strokeWidth;

    for (const result of results) {
      expect(result.backgroundColor).toBe(firstBg);
      expect(result.strokeWidth).toBe(firstStroke);
    }
  });
});
```

---

## Quality Control Dashboard

### **Real-time Consistency Monitoring**

```typescript
// src/monitoring/consistency-monitor.ts

export class ConsistencyMonitor {
  private violations: Map<string, number> = new Map();

  /**
   * Track consistency violations
   */
  logViolation(type: string, details: string): void {
    const key = `${type}:${details}`;
    const count = this.violations.get(key) || 0;
    this.violations.set(key, count + 1);

    console.warn(`[Consistency] Violation: ${type} - ${details}`);

    // If violation occurs frequently, alert humans
    if (count + 1 > 10) {
      this.alertHumans(type, details, count + 1);
    }
  }

  /**
   * Get consistency report
   */
  getReport(): ConsistencyReport {
    return {
      totalViolations: Array.from(this.violations.values()).reduce((a, b) => a + b, 0),
      violationsByType: Object.fromEntries(this.violations),
      timestamp: new Date()
    };
  }

  private async alertHumans(type: string, details: string, count: number): Promise<void> {
    // Send to oversight dashboard
    await sendAlert({
      severity: 'high',
      message: `Consistency violation occurred ${count} times: ${type} - ${details}`,
      action: 'Review agent prompt or template'
    });
  }
}

// Integrate with renderer
export class EnforcedRenderer {
  private monitor = new ConsistencyMonitor();

  async renderD3(vizData: VizData): Promise<VizOutput> {
    const validation = D3Validator.validate(vizData);

    // Log violations
    for (const warning of validation.warnings) {
      this.monitor.logViolation('D3_WARNING', warning);
    }

    // ... rest of rendering
  }
}
```

---

## Summary: Three-Layer Defense

```
┌─────────────────────────────────────────────┐
│ LAYER 1: TEMPLATES                          │
│ • Single source of truth (blackboard-style) │
│ • Immutable configuration                   │
│ • Agents MUST use templates                 │
└─────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ LAYER 2: VALIDATION                         │
│ • Check data before render                  │
│ • Sanitize to enforce rules                 │
│ • Log warnings for review                   │
└─────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ LAYER 3: ENFORCEMENT                        │
│ • Override agent deviations                 │
│ • Post-render validation                    │
│ • Monitor for recurring violations          │
└─────────────────────────────────────────────┘
                  ↓
         ✅ CONSISTENT OUTPUT
```

**Result:**
- All videos look like they're from the same course
- Agents cannot break the style guide (even if they try)
- Humans get alerted if violations occur frequently
- Students trust the platform's professionalism

---

## Files to Create

```
src/
├── config/
│   └── blackboard-style.ts          # Single source of truth
├── templates/
│   ├── d3-template.ts                # D3 config template
│   └── manim-template.ts             # Manim script template
├── validators/
│   ├── d3-validator.ts               # D3 data validation
│   └── manim-validator.ts            # Manim script validation
├── services/
│   └── enforced-renderer.ts          # Rendering with enforcement
└── monitoring/
    └── consistency-monitor.ts        # Track violations
```

**Priority: Build these FIRST (before agents)** so all agents use enforced rendering from day 1.

---

**Next Step:** Should we build the consistency infrastructure now, or do you want to discuss any specific guardrails?
