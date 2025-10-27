/**
 * Render: 14 ÷ 3 with Spatial Guardrails
 *
 * Actually generates a video to visually verify spatial constraints:
 * - 50px padding
 * - Engaging fonts
 * - No edge clipping
 * - No collisions
 */

import { D3VizEngine } from '../services/d3-viz-engine.js';
import { validateAndFix } from '../validators/d3-spatial-validator.js';
import { buildDivisionPrompt } from '../prompts/d3-visualization-prompt.js';
import { CANVAS, FONTS, COLORS } from '../config/spatial-config.js';
import path from 'path';

// ============================================================================
// STEP-BY-STEP DIVISION DATA (Improved for stepByStep mode)
// ============================================================================

/**
 * Simplified 14 ÷ 3 visualization that fits stepByStep constraints
 * Max 5 nodes per step, short labels
 */
const divisionSteps = {
  type: 'network' as const,
  nodes: [
    // Step 1: Setup (show the problem)
    { id: 'problem', label: '14 ÷ 3 = ?', size: 50 },

    // Step 2: Grouping (show the work)
    { id: 'groups', label: '4 groups of 3', size: 45 },
    { id: 'used', label: '3 × 4 = 12', size: 35 },

    // Step 3: Result
    { id: 'quotient', label: 'Answer: 4 R2', size: 50 },
    { id: 'verify', label: '12 + 2 = 14 ✓', size: 35 }
  ],
  links: [
    { source: 'problem', target: 'groups' },
    { source: 'groups', target: 'used' },
    { source: 'used', target: 'quotient' },
    { source: 'quotient', target: 'verify' }
  ]
};

// ============================================================================
// RENDER WITH GUARDRAILS
// ============================================================================

async function renderDivisionWithGuardrails() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  Rendering 14 ÷ 3 with Spatial Guardrails                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Step 1: Validate and auto-fix data
  console.log('🔍 Validating visualization data...');
  const { data: validatedData, result } = validateAndFix(divisionSteps, 'stepByStep');

  if (result.valid) {
    console.log('✅ Data validated successfully!\n');
  } else {
    console.log('⚠️  Data has issues:');
    console.log(`   Errors: ${result.errors.length}`);
    console.log(`   Warnings: ${result.warnings.length}\n`);
  }

  if (result.autoFixed) {
    console.log('🔧 Data was auto-fixed to meet spatial constraints\n');
  }

  // Step 2: Initialize D3VizEngine
  console.log('🎨 Initializing D3VizEngine with spatial configuration...');
  const engine = new D3VizEngine({
    width: CANVAS.width,
    height: CANVAS.height,
    style: {
      aesthetic: 'chalk',
      backgroundColor: COLORS.background,
      colors: {
        primary: COLORS.chalk.white,
        secondary: COLORS.chalk.blue,
        accent: COLORS.chalk.green,
        text: COLORS.chalk.white,
        highlight: COLORS.chalk.yellow
      },
      fonts: {
        primary: FONTS.primary.family,
        handwriting: FONTS.handwriting.family
      },
      strokeWidth: 3,
      roughness: 1.5
    },
    animation: {
      enabled: true,
      duration: 6,
      fps: 30,
      effects: ['draw']
    }
  });
  console.log(`   Canvas: ${CANVAS.width}×${CANVAS.height}px`);
  console.log(`   Safe area: ${CANVAS.safeArea.width}×${CANVAS.safeArea.height}px`);
  console.log(`   Outer padding: ${CANVAS.padding.outer}px\n`);

  // Step 3: Render visualization
  console.log('🎬 Rendering visualization to video...');
  const outputPath = path.resolve(process.cwd(), 'output/d3-viz/division-14-3-with-guardrails.mp4');

  // Generate frames first
  const output = await engine.visualize(validatedData);
  console.log(`   Generated ${output.frames.length} frames`);

  // Convert frames to video
  const videoPath = await engine.framesToVideo(output.frames, outputPath);

  console.log(`✅ Video rendered successfully!\n`);
  console.log(`📁 Output: ${videoPath}\n`);

  // Step 4: Verification checklist
  console.log('✅ VERIFICATION CHECKLIST:\n');
  console.log('Visual inspection required:');
  console.log('  [ ] Content does NOT touch edges (50px padding visible)');
  console.log('  [ ] Text is readable and engaging');
  console.log('  [ ] No overlapping nodes or labels');
  console.log('  [ ] Blackboard aesthetic with vibrant colors');
  console.log('  [ ] Hand-drawn style visible (sketchy circles/lines)');
  console.log('  [ ] Story flows clearly: Problem → Work → Answer\n');

  console.log(`🎥 Open the video to verify:\n   ${videoPath}\n`);

  // Step 5: Show what prompt would look like
  console.log('📝 For reference, here\'s the prompt that would generate this data:\n');
  const prompt = buildDivisionPrompt(14, 3, 'stepByStep');
  console.log('─'.repeat(67));
  console.log(prompt.substring(0, 1000));
  console.log('─'.repeat(67));
  console.log('(Truncated - full prompt includes validation checklist, examples, etc.)\n');

  return {
    videoPath,
    validatedData,
    validationResult: result
  };
}

// Run the render
renderDivisionWithGuardrails().then(result => {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  RENDER COMPLETE                                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  console.log('Next steps:');
  console.log('  1. Open video and visually verify spatial constraints');
  console.log('  2. If looks good → integrate into D3VizEngine');
  console.log('  3. Update font rendering to use Poppins/Inter/Caveat');
  console.log('  4. Build agent framework with validated prompts\n');
  process.exit(0);
}).catch(error => {
  console.error('❌ Render failed:', error);
  process.exit(1);
});
