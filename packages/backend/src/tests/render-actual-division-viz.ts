/**
 * ACTUAL 14 ÷ 3 Division Visualization
 *
 * Shows REAL division: 14 circles divided into groups of 3
 * This is what students should see - visual division with objects
 */

import { D3VizEngine, NetworkData } from '../services/d3-viz-engine.js';
import { validateAndFix } from '../validators/d3-spatial-validator.js';
import { CANVAS, FONTS, COLORS } from '../config/spatial-config.js';
import path from 'path';

// ============================================================================
// PROPER DIVISION VISUALIZATION: Show 14 items, group them by 3
// ============================================================================

/**
 * Step 1: Show all 14 items
 * Step 2: Show them grouped into 4 groups of 3 (with 2 remaining)
 * Step 3: Show the answer (4 R2)
 */
const actualDivisionViz: NetworkData = {
  type: 'network',
  nodes: [
    // Step 1: The 14 items (show them as dots/circles)
    { id: 'item1', label: '1', size: 30 },
    { id: 'item2', label: '2', size: 30 },
    { id: 'item3', label: '3', size: 30 },
    { id: 'item4', label: '4', size: 30 },
    { id: 'item5', label: '5', size: 30 },
    { id: 'item6', label: '6', size: 30 },
    { id: 'item7', label: '7', size: 30 },
    { id: 'item8', label: '8', size: 30 },
    { id: 'item9', label: '9', size: 30 },
    { id: 'item10', label: '10', size: 30 },
    { id: 'item11', label: '11', size: 30 },
    { id: 'item12', label: '12', size: 30 },
    { id: 'item13', label: '13', size: 30 },
    { id: 'item14', label: '14', size: 30 },

    // Group labels (bigger, show the grouping)
    { id: 'group1', label: 'Group 1', size: 45 },
    { id: 'group2', label: 'Group 2', size: 45 },
    { id: 'group3', label: 'Group 3', size: 45 },
    { id: 'group4', label: 'Group 4', size: 45 },
    { id: 'remainder', label: 'Leftover', size: 40 }
  ],
  links: [
    // Group 1: items 1, 2, 3
    { source: 'group1', target: 'item1' },
    { source: 'group1', target: 'item2' },
    { source: 'group1', target: 'item3' },

    // Group 2: items 4, 5, 6
    { source: 'group2', target: 'item4' },
    { source: 'group2', target: 'item5' },
    { source: 'group2', target: 'item6' },

    // Group 3: items 7, 8, 9
    { source: 'group3', target: 'item7' },
    { source: 'group3', target: 'item8' },
    { source: 'group3', target: 'item9' },

    // Group 4: items 10, 11, 12
    { source: 'group4', target: 'item10' },
    { source: 'group4', target: 'item11' },
    { source: 'group4', target: 'item12' },

    // Remainder: items 13, 14
    { source: 'remainder', target: 'item13' },
    { source: 'remainder', target: 'item14' }
  ]
};

// ============================================================================
// RENDER
// ============================================================================

async function renderActualDivision() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ACTUAL 14 ÷ 3 Division Visualization                       ║');
  console.log('║  Shows 14 objects divided into groups of 3                  ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Validate
  console.log('🔍 Validating visualization data...');
  console.log(`   Total nodes: ${actualDivisionViz.nodes.length}`);
  console.log(`   Total links: ${actualDivisionViz.links.length}\n`);

  const { data: validatedData, result } = validateAndFix(actualDivisionViz, 'full');

  if (result.valid) {
    console.log('✅ Data validated!\n');
  } else {
    console.log('⚠️  Validation issues:');
    console.log(`   Errors: ${result.errors.length}`);
    console.log(`   Warnings: ${result.warnings.length}`);

    if (result.errors.length > 0) {
      result.errors.forEach(err => console.log(`   - ${err}`));
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach(warn => console.log(`   - ${warn}`));
    }
    console.log('');
  }

  if (result.autoFixed) {
    console.log('🔧 Data was auto-fixed to meet constraints');
    console.log(`   Original nodes: ${actualDivisionViz.nodes.length}`);
    console.log(`   After fix: ${validatedData.nodes?.length || 0}\n`);
  }

  // Initialize engine
  console.log('🎨 Initializing D3VizEngine...\n');
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
      duration: 8,  // Longer duration for more complex viz
      fps: 30,
      effects: ['draw']
    }
  });

  // Render
  console.log('🎬 Rendering visualization...');
  const output = await engine.visualize(validatedData);
  console.log(`   Generated ${output.frames.length} frames\n`);

  // Save video
  const outputPath = path.resolve(process.cwd(), 'output/d3-viz/division-14-3-ACTUAL.mp4');
  const videoPath = await engine.framesToVideo(output.frames, outputPath);

  console.log('✅ Video rendered successfully!\n');
  console.log(`📁 Output: ${videoPath}\n`);

  // Explanation
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('WHAT YOU SHOULD SEE:');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('Visual representation of division:');
  console.log('  • 14 numbered circles (1, 2, 3, ... 14)');
  console.log('  • 4 "Group" nodes (Group 1, 2, 3, 4)');
  console.log('  • 1 "Leftover" node (for remainder)');
  console.log('  • Lines connecting:');
  console.log('    - Group 1 → items 1, 2, 3');
  console.log('    - Group 2 → items 4, 5, 6');
  console.log('    - Group 3 → items 7, 8, 9');
  console.log('    - Group 4 → items 10, 11, 12');
  console.log('    - Leftover → items 13, 14');
  console.log('');
  console.log('This visually shows: 14 ÷ 3 = 4 groups (with 2 left over)\n');

  console.log('🎥 Open the video to verify:\n');
  console.log(`   ${videoPath}\n`);

  return { videoPath, validatedData, result };
}

// Run
renderActualDivision().then(() => {
  console.log('✅ Complete!\n');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
