/**
 * Visual Content Generator for IGCSE Mathematics
 *
 * Generates:
 * - Gemini diagrams (infographics, real-world, Venn diagrams)
 * - SVG animations (geometry, theorems)
 * - Suggests Manim scenes for complex visualizations
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ContentBlock, VisualStyle } from './lesson-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const OUTPUT_DIR = path.join(__dirname, '../../output/lesson-visuals');

// Style configurations for Gemini prompts
const STYLE_PROMPTS: Record<VisualStyle, string> = {
  'shape-morphing': 'Modern, clean design with smooth gradients and flowing shapes. Use soft blues and purples.',
  'blueprint': 'Technical blueprint style with dark blue background (#1e3a5f), white and light blue lines, grid pattern, dimension markers.',
  'chalkboard': 'Classic green chalkboard background (#2d4a3e), chalk-like white text and lines, slightly rough edges.',
  'neon-glow': 'Dark background (#0a0a1a), neon glowing elements in cyan (#00ffff) and magenta (#ff00ff), futuristic feel.',
  'minimal-line-art': 'Clean white background (#fafafa), thin black lines (#1a1a2e), minimal design, professional look.',
  'glassmorphism': 'Frosted glass effect, semi-transparent panels, soft shadows, modern UI aesthetic.',
  'particle-trail': 'Dark background with glowing particle trails, motion blur effects, dynamic feel.',
  'gradient-wave': 'Flowing gradient backgrounds, wave patterns, vibrant colors transitioning smoothly.',
};

// Age-appropriate visual guidelines
const IGCSE_VISUAL_GUIDELINES = `
TARGET AUDIENCE: 14-16 year old students
- Clear, uncluttered designs
- Large, readable labels
- Bright but not overwhelming colors
- Relatable real-world contexts
- NO small text or complex details
- Professional but engaging
`;

/**
 * Generate a Gemini diagram for educational content
 */
export async function generateGeminiDiagram(
  prompt: string,
  style: VisualStyle,
  outputName: string,
  aspectRatio: '16:9' | '1:1' | '4:3' = '16:9'
): Promise<string> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const fullPrompt = `${IGCSE_VISUAL_GUIDELINES}

STYLE: ${STYLE_PROMPTS[style]}

CONTENT: ${prompt}

IMPORTANT:
- NO text in the image unless absolutely necessary for labels
- If text is needed, make it LARGE and CLEAR
- Focus on visual representation of the concept
- Educational diagram suitable for IGCSE students
`;

  console.log(`  📊 Generating diagram: ${outputName}...`);

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: fullPrompt,
      config: {
        responseModalities: ['image', 'text'],
      },
    });

    // Extract image from response
    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    );

    if (imagePart?.inlineData?.data) {
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const outputPath = path.join(OUTPUT_DIR, `${outputName}.png`);
      await fs.writeFile(outputPath, imageBuffer);
      console.log(`  ✅ Saved: ${outputPath}`);
      return outputPath;
    }

    throw new Error('No image data in response');
  } catch (error) {
    console.error(`  ❌ Failed to generate diagram: ${error}`);
    throw error;
  }
}

/**
 * Generate Venn diagram for Sets topic
 */
export async function generateVennDiagram(
  config: {
    setA: { label: string; elements: string[] };
    setB: { label: string; elements: string[] };
    setC?: { label: string; elements: string[] };
    intersection?: string[];
    title: string;
  },
  style: VisualStyle
): Promise<string> {
  const setCount = config.setC ? 'three' : 'two';

  const prompt = `Create a ${setCount}-set Venn diagram for IGCSE Mathematics:

TITLE: ${config.title}

SET A (${config.setA.label}): ${config.setA.elements.join(', ')}
SET B (${config.setB.label}): ${config.setB.elements.join(', ')}
${config.setC ? `SET C (${config.setC.label}): ${config.setC.elements.join(', ')}` : ''}
${config.intersection ? `INTERSECTION: ${config.intersection.join(', ')}` : ''}

- Show overlapping circles clearly
- Label each set with its name
- Show elements in their correct regions
- Use clear, distinct colors for each set
- Universal set rectangle around all circles
`;

  return generateGeminiDiagram(
    prompt,
    style,
    `venn-${config.title.toLowerCase().replace(/\s+/g, '-')}`
  );
}

/**
 * Generate real-world application diagram
 */
export async function generateRealWorldDiagram(
  concept: string,
  scenario: string,
  style: VisualStyle
): Promise<string> {
  const prompt = `Create an educational diagram showing real-world application:

MATHEMATICAL CONCEPT: ${concept}
REAL-WORLD SCENARIO: ${scenario}

Show how the math concept applies in this everyday situation.
Make it relatable and interesting for teenagers.
Include visual elements that connect the abstract math to the concrete example.
`;

  return generateGeminiDiagram(
    prompt,
    style,
    `realworld-${concept.toLowerCase().replace(/\s+/g, '-')}`
  );
}

/**
 * Generate infographic for key concepts
 */
export async function generateInfographic(
  title: string,
  keyPoints: string[],
  style: VisualStyle
): Promise<string> {
  const prompt = `Create an educational infographic:

TITLE: ${title}

KEY POINTS:
${keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Design as a visual summary poster:
- Title at top
- Each key point with an icon or visual element
- Logical flow from top to bottom
- Color-coded sections
- Memorable and easy to review
`;

  return generateGeminiDiagram(
    prompt,
    style,
    `infographic-${title.toLowerCase().replace(/\s+/g, '-')}`
  );
}

/**
 * Generate SVG animation code for geometry concepts
 */
export function generateSvgAnimation(
  concept: string,
  style: VisualStyle,
  elements: {
    type: 'circle' | 'line' | 'point' | 'angle' | 'arc';
    id: string;
    properties: Record<string, any>;
    animation?: {
      type: 'draw' | 'move' | 'highlight' | 'morph';
      duration: number;
      delay: number;
    };
  }[]
): string {
  // Get style colors
  const colors = getStyleColors(style);

  // Build SVG
  let svg = `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .draw-line {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: drawLine var(--duration, 1s) ease-in-out var(--delay, 0s) forwards;
      }
      @keyframes drawLine {
        to { stroke-dashoffset: 0; }
      }
      .highlight {
        animation: pulse var(--duration, 1s) ease-in-out var(--delay, 0s) infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .move-point {
        animation: moveAlong var(--duration, 2s) ease-in-out var(--delay, 0s) infinite;
      }
    </style>
    ${getStyleFilters(style)}
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="${colors.background}"/>

  <!-- Title -->
  <text x="400" y="40" text-anchor="middle" font-size="24" fill="${colors.text}" font-family="Arial, sans-serif">
    ${concept}
  </text>

  <!-- Elements -->
`;

  for (const element of elements) {
    svg += generateSvgElement(element, colors);
  }

  svg += `
</svg>`;

  return svg;
}

function getStyleColors(style: VisualStyle) {
  const styles: Record<VisualStyle, { background: string; primary: string; secondary: string; text: string; accent: string }> = {
    'shape-morphing': { background: '#1a1a2e', primary: '#4a90d9', secondary: '#9b59b6', text: '#ffffff', accent: '#e74c3c' },
    'blueprint': { background: '#1e3a5f', primary: '#ffffff', secondary: '#87ceeb', text: '#ffffff', accent: '#ffd700' },
    'chalkboard': { background: '#2d4a3e', primary: '#ffffff', secondary: '#f5deb3', text: '#ffffff', accent: '#ff6b6b' },
    'neon-glow': { background: '#0a0a1a', primary: '#00ffff', secondary: '#ff00ff', text: '#ffffff', accent: '#39ff14' },
    'minimal-line-art': { background: '#fafafa', primary: '#1a1a2e', secondary: '#666666', text: '#1a1a2e', accent: '#e74c3c' },
    'glassmorphism': { background: '#1a1a2e', primary: 'rgba(255,255,255,0.2)', secondary: '#87ceeb', text: '#ffffff', accent: '#ffd700' },
    'particle-trail': { background: '#0a0a1a', primary: '#00ffff', secondary: '#ff6b6b', text: '#ffffff', accent: '#ffd700' },
    'gradient-wave': { background: '#667eea', primary: '#764ba2', secondary: '#f093fb', text: '#ffffff', accent: '#ffecd2' },
  };
  return styles[style];
}

function getStyleFilters(style: VisualStyle): string {
  if (style === 'neon-glow') {
    return `
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`;
  }
  if (style === 'chalkboard') {
    return `
    <filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
    </filter>`;
  }
  return '';
}

function generateSvgElement(
  element: {
    type: string;
    id: string;
    properties: Record<string, any>;
    animation?: { type: string; duration: number; delay: number };
  },
  colors: { primary: string; secondary: string; accent: string }
): string {
  const animStyle = element.animation
    ? `style="--duration: ${element.animation.duration}s; --delay: ${element.animation.delay}s;"`
    : '';
  const animClass = element.animation ? `class="${element.animation.type === 'draw' ? 'draw-line' : element.animation.type}"` : '';

  switch (element.type) {
    case 'circle':
      return `  <circle id="${element.id}" cx="${element.properties.cx}" cy="${element.properties.cy}" r="${element.properties.r}"
        fill="none" stroke="${colors.primary}" stroke-width="3" ${animClass} ${animStyle}/>\n`;

    case 'line':
      return `  <line id="${element.id}" x1="${element.properties.x1}" y1="${element.properties.y1}"
        x2="${element.properties.x2}" y2="${element.properties.y2}"
        stroke="${colors.primary}" stroke-width="2" ${animClass} ${animStyle}/>\n`;

    case 'point':
      return `  <circle id="${element.id}" cx="${element.properties.cx}" cy="${element.properties.cy}" r="6"
        fill="${colors.accent}" ${animClass} ${animStyle}/>\n`;

    case 'arc':
      return `  <path id="${element.id}" d="${element.properties.d}"
        fill="none" stroke="${colors.secondary}" stroke-width="2" ${animClass} ${animStyle}/>\n`;

    default:
      return '';
  }
}

/**
 * Suggest Manim scene for complex visualizations
 */
export function suggestManimScene(concept: string, description: string): string {
  return `
# Suggested Manim Scene for: ${concept}
# Description: ${description}

from manim import *

class ${concept.replace(/\s+/g, '')}Scene(Scene):
    def construct(self):
        # Title
        title = Text("${concept}", font_size=48)
        self.play(Write(title))
        self.wait()
        self.play(title.animate.to_edge(UP))

        # TODO: Add visualization elements
        # - Use NumberPlane() for coordinate geometry
        # - Use Circle(), Line(), Polygon() for shapes
        # - Use MathTex() for equations
        # - Use always_redraw() for dynamic updates

        # Example structure:
        # shape = Circle(radius=2)
        # self.play(Create(shape))
        # self.wait()

        self.wait(2)

# Render with: manim -pqh scene.py ${concept.replace(/\s+/g, '')}Scene
`;
}

/**
 * Generate all visuals for a content block
 */
export async function generateVisualsForContentBlock(
  block: ContentBlock,
  style: VisualStyle,
  lessonId: string
): Promise<ContentBlock> {
  const updatedBlock = { ...block };

  if (block.type === 'gemini-diagram' && block.geminiPrompt) {
    const imagePath = await generateGeminiDiagram(
      block.geminiPrompt,
      style,
      `${lessonId}-${block.id}`
    );
    updatedBlock.imagePath = imagePath;
  }

  if (block.type === 'svg-animation') {
    // Generate SVG based on description
    // This would need more specific element definitions
    console.log(`  📐 SVG animation suggested for: ${block.title}`);
  }

  if (block.type === 'manim-animation') {
    const manimCode = suggestManimScene(block.title || 'Concept', block.description || '');
    console.log(`  🎬 Manim scene suggested for: ${block.title}`);
    // Could save this to a file for later rendering
  }

  return updatedBlock;
}

export default {
  generateGeminiDiagram,
  generateVennDiagram,
  generateRealWorldDiagram,
  generateInfographic,
  generateSvgAnimation,
  suggestManimScene,
  generateVisualsForContentBlock,
};
