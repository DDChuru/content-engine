/**
 * Gemini Theorem Visualizer
 *
 * Generates polished abstract step-by-step visuals for geometry theorems
 * using Gemini image generation.
 *
 * Style: Clean, modern, gradient backgrounds, precise geometry
 */

import { GeminiImageGenerator, GeminiImageResult } from './gemini-image-generator';
import * as path from 'path';

export interface TheoremStep {
  id: string;
  title: string;
  narration: string;
  visualPrompt: string;
  duration: number; // seconds
}

export interface TheoremVisualization {
  name: string;
  steps: TheoremStep[];
  style: {
    background: string;
    accentColor: string;
    geometryColor: string;
  };
}

// Style anchor for consistent Gemini outputs
const STYLE_ANCHOR = `
Style requirements:
- Dark gradient background (deep blue to purple, or dark teal to black)
- Clean, precise geometric shapes with subtle glow
- Minimalist, modern aesthetic
- NO TEXT, NO LABELS, NO LETTERS, NO NUMBERS in the image
- High contrast white or gold geometry lines
- Subtle grid or dot pattern in background
- Professional, premium educational feel
- 16:9 aspect ratio, suitable for video
- Centered composition
`;

/**
 * Angle in a Semicircle Theorem
 * "Any angle inscribed in a semicircle is a right angle (90°)"
 */
export const ANGLE_IN_SEMICIRCLE: TheoremVisualization = {
  name: "Angle in a Semicircle",
  style: {
    background: "dark blue to purple gradient",
    accentColor: "gold",
    geometryColor: "white with subtle glow"
  },
  steps: [
    {
      id: "step1_setup",
      title: "The Setup",
      narration: "Consider a circle with a diameter drawn across it. This diameter divides the circle into two equal halves, creating a semicircle.",
      visualPrompt: `A perfect circle on a dark gradient background (deep blue to purple).
A horizontal diameter line drawn across the center in white with subtle glow.
The semicircle (upper half) slightly highlighted with a soft golden accent.
Clean, minimalist, geometric precision.
${STYLE_ANCHOR}`,
      duration: 6
    },
    {
      id: "step2_point",
      title: "Choose Any Point",
      narration: "Now, pick any point on the semicircle's arc. It doesn't matter where - any point will work.",
      visualPrompt: `A circle with horizontal diameter on dark gradient background.
A glowing point marked on the upper arc of the semicircle.
The point has a subtle pulse/glow effect appearance (golden dot).
Lines are white, background is deep blue to purple gradient.
${STYLE_ANCHOR}`,
      duration: 5
    },
    {
      id: "step3_connect",
      title: "Draw the Angle",
      narration: "Connect this point to both ends of the diameter. These two lines form an angle at our chosen point.",
      visualPrompt: `A circle with horizontal diameter on dark gradient background.
A point on the upper arc connected to both ends of the diameter by two white lines.
This creates a triangle inscribed in the semicircle.
The angle at the top point is subtly highlighted with a golden arc.
Clean geometric lines with subtle glow.
${STYLE_ANCHOR}`,
      duration: 6
    },
    {
      id: "step4_reveal",
      title: "The Right Angle",
      narration: "Here's the remarkable property: this angle is always exactly 90 degrees - a perfect right angle. No matter where you place the point on the arc, you always get 90 degrees.",
      visualPrompt: `A circle with inscribed triangle (vertex on arc, base as diameter).
The angle at the top vertex has a small square symbol indicating 90 degrees (shown as a small geometric square in the corner of the angle).
Golden glow emanating from the right angle.
The 90-degree angle is the focal point with premium lighting effect.
Dark gradient background, white and gold geometry.
${STYLE_ANCHOR}`,
      duration: 8
    },
    {
      id: "step5_multiple",
      title: "Works Everywhere",
      narration: "To prove this isn't a coincidence, watch as we move the point along the arc. Every position gives us the same 90-degree angle. This is the Angle in a Semicircle theorem.",
      visualPrompt: `A circle with diameter showing three different triangles overlaid.
Each triangle has its vertex at a different point on the semicircle arc.
All three angles at the arc are marked with small squares showing they are all 90 degrees.
Ghosted/semi-transparent triangles showing multiple positions.
Golden accent on all three right angles.
Dark premium gradient background.
${STYLE_ANCHOR}`,
      duration: 8
    }
  ]
};

export class GeminiTheoremVisualizer {
  private imageGenerator: GeminiImageGenerator;
  private outputDir: string;

  constructor(apiKey: string, outputDir: string) {
    this.imageGenerator = new GeminiImageGenerator(apiKey);
    this.outputDir = outputDir;
  }

  /**
   * Generate all images for a theorem visualization
   */
  async generateTheorem(theorem: TheoremVisualization): Promise<{
    success: boolean;
    images: { step: TheoremStep; result: GeminiImageResult }[];
    totalCost: number;
  }> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  GENERATING: ${theorem.name}`);
    console.log(`  Steps: ${theorem.steps.length}`);
    console.log(`  Style: ${theorem.style.background}`);
    console.log(`${'='.repeat(60)}\n`);

    const images: { step: TheoremStep; result: GeminiImageResult }[] = [];
    let totalCost = 0;

    for (let i = 0; i < theorem.steps.length; i++) {
      const step = theorem.steps[i];
      console.log(`[${i + 1}/${theorem.steps.length}] ${step.title}`);
      console.log(`  Generating: ${step.visualPrompt.substring(0, 50)}...`);

      const result = await this.imageGenerator.generateDirect({
        prompt: step.visualPrompt,
        outputDir: path.join(this.outputDir, theorem.name.replace(/\s+/g, '-').toLowerCase()),
        filename: step.id,
        aspectRatio: '16:9'
      });

      images.push({ step, result });
      totalCost += result.cost;

      if (result.success) {
        console.log(`  ✓ Saved: ${result.imagePath}`);
      } else {
        console.log(`  ✗ Failed: ${result.error}`);
      }
      console.log();
    }

    console.log(`${'='.repeat(60)}`);
    console.log(`  COMPLETE: ${images.filter(i => i.result.success).length}/${theorem.steps.length} images`);
    console.log(`  Total cost: $${totalCost.toFixed(3)}`);
    console.log(`${'='.repeat(60)}\n`);

    return {
      success: images.every(i => i.result.success),
      images,
      totalCost
    };
  }

  /**
   * Generate narration scripts for a theorem
   */
  getNarrationScripts(theorem: TheoremVisualization): { id: string; text: string }[] {
    return theorem.steps.map(step => ({
      id: step.id,
      text: step.narration
    }));
  }
}

// CLI runner
if (require.main === module) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not set');
    process.exit(1);
  }

  const outputDir = path.join(__dirname, '../../output/theorem-visuals');
  const visualizer = new GeminiTheoremVisualizer(apiKey, outputDir);

  visualizer.generateTheorem(ANGLE_IN_SEMICIRCLE)
    .then(result => {
      console.log('Generation complete!');
      console.log(`Success: ${result.success}`);
      console.log(`Cost: $${result.totalCost.toFixed(3)}`);

      // Output narration scripts
      console.log('\nNarration scripts:');
      const scripts = visualizer.getNarrationScripts(ANGLE_IN_SEMICIRCLE);
      scripts.forEach(s => console.log(`  ${s.id}: "${s.text.substring(0, 50)}..."`));
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}
