/**
 * D3 Visualization Prompt Builder
 *
 * Generates spatially-aware prompts for Claude to create D3 visualizations
 * Embeds all spatial constraints, collision avoidance, and storytelling guidance
 */

import { LayoutMode, getLayoutConfig, FONTS, COLORS, ELEMENT_CONSTRAINTS } from '../config/spatial-config.js';

// ============================================================================
// Types
// ============================================================================

export interface PromptOptions {
  topic: string;
  layoutMode: LayoutMode;
  storytelling?: StorytellingMode;
  emphasis?: 'data' | 'math' | 'balanced';
  steps?: number;  // For stepByStep mode
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export type StorytellingMode =
  | 'sequential'      // Show steps in order (14 ÷ 3)
  | 'comparison'      // Compare concepts side-by-side
  | 'relationship'    // Show connections/network
  | 'transformation'; // Show before/after

// ============================================================================
// Main Prompt Builder
// ============================================================================

export function buildD3VisualizationPrompt(options: PromptOptions): string {
  const layoutConfig = getLayoutConfig(options.layoutMode, { steps: options.steps });
  const spatialConstraints = getSpatialConstraints(options.layoutMode, layoutConfig);
  const storytellingGuidance = getStorytellingGuidance(options);
  const exampleOutput = getExampleOutput(options);

  return `You are an expert D3 visualization designer for educational content.

Your task: Create a visualization for "${options.topic}"

${getSpatialConstraintsSection(spatialConstraints)}

${getStorytellingSection(storytellingGuidance)}

${getStyleGuideSection()}

${getOutputFormatSection(exampleOutput)}

${getValidationChecklistSection(spatialConstraints)}

REMEMBER:
- Less is more: Simplicity beats complexity in education
- No hardcoded positions: Let force-directed layout handle positioning
- Vary node sizes to show importance (but within ${ELEMENT_CONSTRAINTS.node.min}-${ELEMENT_CONSTRAINTS.node.max}px)
- Keep labels SHORT and CLEAR
- The rendering system will enforce these rules - violations will be auto-fixed or rejected

Generate the visualization data now in valid JSON format.`;
}

// ============================================================================
// Section Builders
// ============================================================================

function getSpatialConstraints(layoutMode: LayoutMode, layoutConfig: any): any {
  if (layoutMode === 'full') {
    return {
      maxNodes: layoutConfig.d3.maxNodes,
      maxLabelChars: layoutConfig.d3.maxLabelChars,
      width: layoutConfig.d3.width,
      height: layoutConfig.d3.height
    };
  } else if (layoutMode === 'split') {
    return {
      maxNodes: layoutConfig.d3.maxNodes,
      maxLabelChars: layoutConfig.d3.maxLabelChars,
      width: layoutConfig.d3.width,
      height: layoutConfig.d3.height,
      note: 'Split mode: D3 shares screen with Manim (50/50)'
    };
  } else if (layoutMode === 'stepByStep') {
    return {
      maxNodesPerStep: layoutConfig.maxNodesPerStep,
      maxLabelChars: layoutConfig.maxLabelChars,
      stepHeight: layoutConfig.stepHeight,
      width: layoutConfig.width,
      note: `Each step gets ${layoutConfig.stepHeight}px height`
    };
  } else {
    return {
      maxNodesPerCell: layoutConfig.maxNodesPerCell,
      maxLabelChars: layoutConfig.maxLabelChars,
      cellWidth: layoutConfig.cellWidth,
      cellHeight: layoutConfig.cellHeight,
      note: 'Grid mode: Multiple small visualizations'
    };
  }
}

function getSpatialConstraintsSection(constraints: any): string {
  return `═══════════════════════════════════════════════════════════════
SPATIAL CONSTRAINTS (MUST FOLLOW)
═══════════════════════════════════════════════════════════════

Canvas Details:
${constraints.note ? `• Layout: ${constraints.note}` : ''}
• Available width: ${constraints.width || constraints.cellWidth}px
• Available height: ${constraints.height || constraints.cellHeight || constraints.stepHeight}px
• Padding: 50px outer margin (keeps content off edges)
• Inner spacing: 20px between elements

Element Limits:
• Maximum nodes: ${constraints.maxNodes || constraints.maxNodesPerStep || constraints.maxNodesPerCell}
• Maximum label length: ${constraints.maxLabelChars} characters
• Node size range: ${ELEMENT_CONSTRAINTS.node.min}-${ELEMENT_CONSTRAINTS.node.max}px
• Minimum spacing: ${ELEMENT_CONSTRAINTS.spacing.comfortable}px between nodes

Collision Avoidance:
• Nodes must have ${ELEMENT_CONSTRAINTS.node.padding}px buffer around them
• Labels must not overlap with other nodes or labels
• Use force-directed layout for automatic spacing
• If too many elements, GROUP them hierarchically`;
}

function getStorytellingGuidance(options: PromptOptions): string {
  const { topic, storytelling, difficulty } = options;

  // Auto-detect storytelling mode if not specified
  let mode = storytelling;
  if (!mode) {
    if (topic.includes('÷') || topic.includes('division') || topic.includes('step')) {
      mode = 'sequential';
    } else if (topic.includes('vs') || topic.includes('compare') || topic.includes('difference')) {
      mode = 'comparison';
    } else if (topic.includes('network') || topic.includes('relationship') || topic.includes('connected')) {
      mode = 'relationship';
    } else {
      mode = 'transformation';
    }
  }

  const difficultyGuidance = difficulty === 'beginner'
    ? 'Use simple, concrete concepts. Avoid jargon.'
    : difficulty === 'advanced'
    ? 'You can use technical terms, but explain complex relationships clearly.'
    : 'Balance simplicity and depth. Build on basic concepts.';

  let storytellingText = `Storytelling Mode: ${mode.toUpperCase()}\n`;

  switch (mode) {
    case 'sequential':
      storytellingText += `
• Show the process step by step
• Each step builds on the previous
• Use spatial flow (top-to-bottom or left-to-right)
• Example: "14 ÷ 3" → Setup → Group → Count
• Make the progression obvious through positioning`;
      break;

    case 'comparison':
      storytellingText += `
• Place items side-by-side for direct comparison
• Use size/color to emphasize differences
• Keep visual balance (equal space for each)
• Example: "Small model vs Large model"
• Highlight key differences visually`;
      break;

    case 'relationship':
      storytellingText += `
• Central concept at the center
• Related concepts around it
• Use links to show connections
• Example: "AI → ML → DL → NLP"
• Make hierarchy clear through positioning`;
      break;

    case 'transformation':
      storytellingText += `
• Show before and after
• Use arrows/transitions to indicate change
• Example: "Input → Process → Output"
• Make the transformation mechanism visible`;
      break;
  }

  storytellingText += `\n\nDifficulty Level: ${difficulty || 'intermediate'}
• ${difficultyGuidance}`;

  return storytellingText;
}

function getStorytellingSection(storytellingGuidance: string): string {
  return `═══════════════════════════════════════════════════════════════
STORYTELLING GUIDANCE
═══════════════════════════════════════════════════════════════

${storytellingGuidance}

Visual Hierarchy:
• Most important concept: Largest node (size: 50-60)
• Secondary concepts: Medium nodes (size: 35-45)
• Supporting details: Smaller nodes (size: 25-30)
• Use node size to guide the viewer's eye

Spatial Story Flow:
• Top-to-bottom: Sequential processes
• Left-to-right: Timelines, progressions
• Center-outward: Hierarchies, networks
• Balanced: Comparisons, contrasts`;
}

function getStyleGuideSection(): string {
  return `═══════════════════════════════════════════════════════════════
STYLE GUIDE (AUTOMATICALLY ENFORCED)
═══════════════════════════════════════════════════════════════

Colors: (Don't specify colors in your output - renderer handles this)
• Background: Black (#000000) - blackboard style
• Primary: White chalk - main content
• Blue chalk: ${COLORS.chalk.blue} - highlights
• Green chalk: ${COLORS.chalk.green} - examples
• Yellow chalk: ${COLORS.chalk.yellow} - important notes

Fonts: (Automatically applied)
• Titles: ${FONTS.sizes.mainTitle}px (Poppins Bold) - Engaging!
• Labels: ${FONTS.sizes.label}px (Inter Regular) - Clear
• Small text: ${FONTS.sizes.small}px (Inter Light) - Readable

The rendering system will apply these automatically.`;
}

function getExampleOutput(options: PromptOptions): any {
  const layoutConfig = getLayoutConfig(options.layoutMode, { steps: options.steps });
  const maxNodes = layoutConfig.d3?.maxNodes ||
                   layoutConfig.maxNodesPerStep ||
                   layoutConfig.maxNodesPerCell ||
                   6;
  const maxChars = layoutConfig.d3?.maxLabelChars ||
                   layoutConfig.maxLabelChars ||
                   20;

  return {
    type: 'network',
    maxNodes,
    maxChars,
    example: {
      type: 'network',
      nodes: [
        { id: '1', label: 'Main Concept', size: 50 },
        { id: '2', label: 'Detail A', size: 35 },
        { id: '3', label: 'Detail B', size: 35 }
      ],
      links: [
        { source: '1', target: '2' },
        { source: '1', target: '3' }
      ]
    }
  };
}

function getOutputFormatSection(exampleOutput: any): string {
  return `═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (JSON ONLY)
═══════════════════════════════════════════════════════════════

Return ONLY valid JSON matching this exact schema:

For network graphs:
{
  "type": "network",
  "nodes": [
    {
      "id": "unique-id",            // Unique identifier
      "label": "Short label",       // Max ${exampleOutput.maxChars} chars
      "size": 30                    // 25-60 (importance)
    }
  ],
  "links": [
    {
      "source": "node-id-1",
      "target": "node-id-2"
    }
  ]
}

For comparisons:
{
  "type": "comparison",
  "title": "Short title",
  "groups": [
    {
      "name": "Group A",
      "items": ["item1", "item2"],     // Short labels
      "metrics": { "value": 100 },
      "visual": { "type": "box", "style": "sketchy" }
    }
  ]
}

CRITICAL:
• Return ONLY the JSON object
• No markdown code blocks
• No explanations outside the JSON
• Valid JSON syntax
• Match schema exactly`;
}

function getValidationChecklistSection(constraints: any): string {
  return `═══════════════════════════════════════════════════════════════
VALIDATION CHECKLIST (Review before returning)
═══════════════════════════════════════════════════════════════

Before you return the JSON, verify:

[ ] Node count ≤ ${constraints.maxNodes || constraints.maxNodesPerStep || constraints.maxNodesPerCell}
[ ] All labels ≤ ${constraints.maxLabelChars} characters
[ ] All node sizes between ${ELEMENT_CONSTRAINTS.node.min} and ${ELEMENT_CONSTRAINTS.node.max}
[ ] No hardcoded x,y positions (let layout algorithm handle it)
[ ] Clear visual hierarchy (varied node sizes)
[ ] Tells a clear story through spatial arrangement
[ ] Valid JSON syntax (no trailing commas, proper quotes)
[ ] Only uses allowed fields (id, label, size for nodes)

If you can't fit all concepts within ${constraints.maxNodes || constraints.maxNodesPerStep || constraints.maxNodesPerCell} nodes:
→ Group related concepts into single nodes
→ Prioritize the most important concepts
→ Use hierarchical labels (e.g., "ML: NLP, CV, RL" instead of 4 nodes)`;
}

// ============================================================================
// SPECIALIZED PROMPTS FOR SPECIFIC USE CASES
// ============================================================================

/**
 * Prompt for mathematical division visualization (e.g., "14 ÷ 3")
 */
export function buildDivisionPrompt(
  dividend: number,
  divisor: number,
  layoutMode: LayoutMode = 'stepByStep'
): string {
  return buildD3VisualizationPrompt({
    topic: `${dividend} ÷ ${divisor} - Visual Division`,
    layoutMode,
    storytelling: 'sequential',
    steps: 3,
    difficulty: 'beginner'
  });
}

/**
 * Prompt for network/relationship visualization
 */
export function buildNetworkPrompt(
  topic: string,
  layoutMode: LayoutMode = 'full'
): string {
  return buildD3VisualizationPrompt({
    topic,
    layoutMode,
    storytelling: 'relationship',
    difficulty: 'intermediate'
  });
}

/**
 * Prompt for comparison visualization
 */
export function buildComparisonPrompt(
  topic: string,
  layoutMode: LayoutMode = 'split'
): string {
  return buildD3VisualizationPrompt({
    topic,
    layoutMode,
    storytelling: 'comparison',
    difficulty: 'intermediate'
  });
}
