/**
 * Manim Visualization Prompt Builder
 *
 * Generates spatially-aware prompts for Claude to create Manim animations
 * Embeds all spatial constraints, collision avoidance, and Python code guidelines
 */

import { LayoutMode, getLayoutConfig } from '../config/spatial-config.js';

// ============================================================================
// Types
// ============================================================================

export interface ManimPromptOptions {
  topic: string;
  layoutMode: LayoutMode;
  animationType?: AnimationType;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;  // Target duration in seconds
  withDiagram?: boolean;  // Include visual diagram?
}

export type AnimationType =
  | 'equation'       // Mathematical equations (MathTex, algebra)
  | 'geometry'       // Shapes, transformations, theorems
  | 'graph'          // Function graphs, plots
  | 'transformation' // Morphing, animations
  | 'proof';         // Step-by-step mathematical proofs

// ============================================================================
// Main Prompt Builder
// ============================================================================

export function buildManimVisualizationPrompt(options: ManimPromptOptions): string {
  const layoutConfig = getLayoutConfig(options.layoutMode);
  const spatialConstraints = getManimSpatialConstraints(options.layoutMode, layoutConfig);
  const animationGuidance = getAnimationGuidance(options);
  const pythonGuidelines = getPythonGuidelines();

  return `You are an expert Manim animator creating educational math/science visualizations.

Your task: Create a Manim animation for "${options.topic}"

${getSpatialConstraintsSection(spatialConstraints)}

${getAnimationGuidanceSection(animationGuidance)}

${getManimSpecificSection()}

${getPythonGuidelinesSection(pythonGuidelines)}

${getOutputFormatSection(options)}

${getValidationChecklistSection()}

CRITICAL REMINDERS:
- ALWAYS import from manim_spatial_config.py for positioning
- Use get_safe_position() instead of hardcoding coordinates
- Check ensure_safe_bounds() on all large mobjects
- Target duration: ${options.duration || 10}s (use self.wait() to pad)
- Black background (#000000) - blackboard style
- Use vibrant colors (BLUE, GREEN, YELLOW) not dull ones

Generate the complete Manim Python script now.`;
}

// ============================================================================
// Section Builders
// ============================================================================

function getManimSpatialConstraints(layoutMode: LayoutMode, layoutConfig: any): any {
  // Manim uses different coordinate system (center-based, not pixel-based)
  // Frame dimensions: width ≈ 14.222, height ≈ 8.0

  if (layoutMode === 'full') {
    return {
      mode: 'full',
      maxElements: 10,
      safeZone: {
        left: -6.5,
        right: 6.5,
        top: 3.5,
        bottom: -3.5
      },
      note: 'Full canvas for single animation'
    };
  } else if (layoutMode === 'split') {
    return {
      mode: 'split',
      maxElements: 6,
      safeZone: {
        left: 0,      // Manim gets right half
        right: 6.5,
        top: 3.5,
        bottom: -3.5
      },
      note: 'Split mode: Manim shares screen with D3 (right 50%)'
    };
  } else {
    return {
      mode: layoutMode,
      maxElements: 5,
      safeZone: {
        left: -6.5,
        right: 6.5,
        top: 3.5,
        bottom: -3.5
      },
      note: `${layoutMode} mode`
    };
  }
}

function getSpatialConstraintsSection(constraints: any): string {
  return `═══════════════════════════════════════════════════════════════
SPATIAL CONSTRAINTS (MUST FOLLOW)
═══════════════════════════════════════════════════════════════

Layout Mode: ${constraints.mode}
${constraints.note ? `• ${constraints.note}` : ''}

Manim Coordinate System:
• Center of screen: (0, 0)
• X increases to the right: ${constraints.safeZone.left} to ${constraints.safeZone.right}
• Y increases UPWARD: ${constraints.safeZone.bottom} to ${constraints.safeZone.top}
• Frame width: ~14.222 units, Frame height: ~8.0 units

Safe Zone (50px padding enforced):
• Left boundary: ${constraints.safeZone.left}
• Right boundary: ${constraints.safeZone.right}
• Top boundary: ${constraints.safeZone.top}
• Bottom boundary: ${constraints.safeZone.bottom}

Element Limits:
• Maximum elements on screen at once: ${constraints.maxElements}
• Minimum spacing between objects: 0.3 units
• Maximum object width: 12 units (auto-scale if larger)
• Maximum object height: 6 units (auto-scale if larger)

CRITICAL IMPORTS:
\`\`\`python
from manim_spatial_config import (
    get_safe_position,       # Get position within safe zone
    ensure_safe_bounds,      # Auto-scale/shift to fit
    check_collision,         # Detect overlaps
    arrange_without_collision,  # Auto-arrange elements
    COLORS, FONTS, ELEMENT_CONSTRAINTS
)
\`\`\`

POSITIONING EXAMPLES:
\`\`\`python
# Center top (title position)
title.move_to(get_safe_position(0.5, 0.1))

# Left side, middle
diagram.move_to(get_safe_position(0.2, 0.5))

# Right side, bottom
conclusion.move_to(get_safe_position(0.8, 0.9))

# Ensure it fits
ensure_safe_bounds(title)
\`\`\``;
}

function getAnimationGuidance(options: ManimPromptOptions): string {
  const { animationType = 'equation', difficulty = 'intermediate' } = options;

  let typeGuidance = '';
  switch (animationType) {
    case 'equation':
      typeGuidance = `
• Use MathTex for equations, not Text
• Build equations step-by-step with TransformMatchingShapes
• Highlight terms being manipulated (indicate_with_color)
• Show algebra moves explicitly (add X to both sides, etc.)
• Use colors: BLUE for variables, GREEN for results, YELLOW for highlights`;
      break;

    case 'geometry':
      typeGuidance = `
• Use geometric primitives (Circle, Line, Polygon, etc.)
• Show construction process (Create animations, not instant add)
• Label key points, angles, sides
• Use colors to distinguish similar shapes
• Animate transformations smoothly (Rotate, Scale, Transform)`;
      break;

    case 'graph':
      typeGuidance = `
• Use Axes with labeled x/y axes
• Plot functions with plot() method
• Animate function drawing (Create, not instant)
• Show key points (intercepts, max/min, etc.)
• Use different colors for multiple functions`;
      break;

    case 'transformation':
      typeGuidance = `
• Show before → after clearly
• Use Transform or ReplacementTransform
• Animate smoothly (run_time=1.5-2.5s)
• Pause to let viewer understand (self.wait(0.5))
• Highlight what's changing (indicate_with_color)`;
      break;

    case 'proof':
      typeGuidance = `
• Break proof into logical steps
• One statement per Text/MathTex object
• Number steps (1, 2, 3...)
• Show implications with arrows (Arrow mobject)
• Build proof from top to bottom
• Fade out completed steps to reduce clutter`;
      break;
  }

  const difficultyGuidance = difficulty === 'beginner'
    ? 'Keep it simple, use large text, animate slowly'
    : difficulty === 'advanced'
    ? 'Can use complex math, multiple simultaneous animations, faster pace'
    : 'Balance simplicity and depth, moderate animation speed';

  return `Animation Type: ${animationType.toUpperCase()}
${typeGuidance}

Difficulty Level: ${difficulty}
• ${difficultyGuidance}`;
}

function getAnimationGuidanceSection(guidance: string): string {
  return `═══════════════════════════════════════════════════════════════
ANIMATION GUIDANCE
═══════════════════════════════════════════════════════════════

${guidance}

Animation Timing:
• Fast animations: 0.5-0.8s (simple moves, fades)
• Normal animations: 1.0-1.5s (transforms, creates)
• Slow animations: 2.0-3.0s (complex transformations)
• Pauses: 0.3-0.8s (let viewer process)

Visual Hierarchy:
• Main concept: Large (font_size=48-60)
• Supporting details: Medium (font_size=32-40)
• Annotations: Small (font_size=24-28)

Blackboard Aesthetic:
• Background: BLACK (already set by Manim config)
• Primary color: WHITE (main content)
• Accent colors: BLUE, GREEN, YELLOW (highlights, examples)
• Avoid: Dull colors, gray text (hard to read on black)`;
}

function getManimSpecificSection(): string {
  return `═══════════════════════════════════════════════════════════════
MANIM-SPECIFIC BEST PRACTICES
═══════════════════════════════════════════════════════════════

Common Patterns:

1. CREATE & DISPLAY:
\`\`\`python
# Good: Animate appearance
self.play(Create(shape))
self.play(Write(text))

# Bad: Instant appearance (no animation)
self.add(shape)  # Only use for backgrounds
\`\`\`

2. TRANSFORM EQUATIONS:
\`\`\`python
eq1 = MathTex("x^2 + 3x + 2")
eq2 = MathTex("(x + 1)(x + 2)")

self.play(Write(eq1))
self.wait(0.5)
self.play(TransformMatchingShapes(eq1, eq2))
\`\`\`

3. POSITION RELATIVE TO OTHER OBJECTS:
\`\`\`python
title.to_edge(UP, buff=0.8)  # Top of screen with buffer
subtitle.next_to(title, DOWN, buff=0.3)  # Below title
diagram.next_to(subtitle, DOWN, buff=0.5)
\`\`\`

4. GROUP & ARRANGE:
\`\`\`python
items = VGroup(circle, square, triangle)
items.arrange(RIGHT, buff=0.5)  # Horizontal with spacing
items.move_to(ORIGIN)  # Center the group
\`\`\`

5. COLLISION AVOIDANCE:
\`\`\`python
from manim_spatial_config import check_collision, arrange_without_collision

if check_collision(obj1, obj2):
    print("WARNING: Objects overlapping!")

# Or auto-arrange
group = arrange_without_collision([obj1, obj2, obj3], direction=RIGHT)
\`\`\`

6. FADE OUT BEFORE NEW SCENE:
\`\`\`python
# Always fade out at end of scene
self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.5)
\`\`\``;
}

function getPythonGuidelinesSection(guidelines: string): string {
  return `═══════════════════════════════════════════════════════════════
PYTHON CODE GUIDELINES
═══════════════════════════════════════════════════════════════

Required Imports:
\`\`\`python
from manim import *
from manim_spatial_config import (
    get_safe_position,
    ensure_safe_bounds,
    COLORS,
    FONTS,
    ZONES
)
\`\`\`

Class Structure:
\`\`\`python
class MyScene(Scene):
    def construct(self):
        # Track time for duration matching
        time_spent = 0
        target_duration = 10.0  # Adjust to match requirements

        # Your animation code here
        self.play(...)
        time_spent += 1.0

        self.wait(0.5)
        time_spent += 0.5

        # Pad to target duration
        remaining = max(0, target_duration - time_spent)
        if remaining > 0:
            self.wait(remaining)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects])
\`\`\`

Common Mistakes to Avoid:
❌ Hardcoded positions: circle.move_to([3, 2, 0])
✅ Safe positions: circle.move_to(get_safe_position(0.6, 0.4))

❌ No spacing: text1.next_to(text2, DOWN)
✅ With spacing: text1.next_to(text2, DOWN, buff=0.3)

❌ Instant add: self.add(shape)
✅ Animated: self.play(Create(shape))

❌ No time tracking
✅ Track time_spent for duration matching`;
}

function getPythonGuidelines(): string {
  return `Track animation duration, use safe positioning, avoid hardcoded coordinates`;
}

function getOutputFormatSection(options: ManimPromptOptions): string {
  return `═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (COMPLETE PYTHON SCRIPT)
═══════════════════════════════════════════════════════════════

Return a COMPLETE, RUNNABLE Manim script in this format:

\`\`\`python
from manim import *
from manim_spatial_config import (
    get_safe_position,
    ensure_safe_bounds,
    arrange_without_collision,
    COLORS,
    FONTS
)

class ${options.topic.replace(/[^a-zA-Z0-9]/g, '')}Scene(Scene):
    def construct(self):
        # Time tracking
        time_spent = 0
        target_duration = ${options.duration || 10}

        # Your animation here
        # ... (build the visualization)

        # Pad to duration
        remaining = max(0, target_duration - time_spent)
        if remaining > 0:
            self.wait(remaining)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects])
\`\`\`

CRITICAL:
• Return ONLY the Python code
• No markdown code blocks (or if you use them, I'll extract the code)
• No explanations outside the code (use Python comments)
• Code must be syntactically valid
• Must run without errors`;
}

function getValidationChecklistSection(): string {
  return `═══════════════════════════════════════════════════════════════
VALIDATION CHECKLIST (Review before returning)
═══════════════════════════════════════════════════════════════

Before you return the code, verify:

[ ] Imported from manim_spatial_config.py
[ ] Used get_safe_position() for positioning (not hardcoded coords)
[ ] All large objects checked with ensure_safe_bounds()
[ ] Animations have run_time specified
[ ] Time tracking implemented (time_spent variable)
[ ] Padding to target duration included
[ ] Fade out at end of scene
[ ] No instant add() calls (except backgrounds)
[ ] Spacing between objects (buff parameter)
[ ] Valid Python syntax (no missing colons, parens, etc.)
[ ] Comments explain key steps
[ ] Colors are vibrant (BLUE, GREEN, YELLOW) not dull

If too complex to fit in ${10} seconds:
→ Simplify the concept
→ Remove unnecessary details
→ Focus on the core idea`;
}

// ============================================================================
// SPECIALIZED PROMPTS
// ============================================================================

/**
 * Prompt for equation derivation animation
 */
export function buildEquationPrompt(
  equation: string,
  layoutMode: LayoutMode = 'full',
  steps?: string[]
): string {
  return buildManimVisualizationPrompt({
    topic: `Equation: ${equation}`,
    layoutMode,
    animationType: 'equation',
    difficulty: 'intermediate',
    duration: steps ? steps.length * 3 : 10
  });
}

/**
 * Prompt for geometric theorem visualization
 */
export function buildGeometryPrompt(
  theorem: string,
  layoutMode: LayoutMode = 'full',
  withDiagram: boolean = true
): string {
  return buildManimVisualizationPrompt({
    topic: `Geometry: ${theorem}`,
    layoutMode,
    animationType: 'geometry',
    difficulty: 'intermediate',
    duration: 12,
    withDiagram
  });
}

/**
 * Prompt for function graph animation
 */
export function buildGraphPrompt(
  functionStr: string,
  layoutMode: LayoutMode = 'full'
): string {
  return buildManimVisualizationPrompt({
    topic: `Graph: ${functionStr}`,
    layoutMode,
    animationType: 'graph',
    difficulty: 'intermediate',
    duration: 10
  });
}
