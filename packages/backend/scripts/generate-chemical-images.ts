/**
 * Generate images for Chemical Sanitation Excellence Training
 *
 * Corporate dividers: Dark professional style (gold/teal accents)
 * Whiteboard diagrams: Educational hand-drawn style
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.resolve(__dirname, '../../..', 'projects/professional/food-safety/output/chemicals/images');

// Corporate divider slides (dark professional style)
const corporateDividers = [
  {
    filename: 'title-chemical-excellence',
    prompt: `Create a professional corporate presentation title slide.

VISUAL DESIGN:
- Dark charcoal/black gradient background (#1a1a2e to #16213e)
- Subtle gold accent lines/geometric shapes on edges
- Abstract chemical molecule visualization (subtle, professional)
- Clean, modern corporate aesthetic
- Slight glow effects on accent elements

COMPOSITION:
- Leave large central area clear for text overlay
- Decorative elements only at corners and edges
- Professional, not playful

TEXT TO INCLUDE:
"CHEMICAL SANITATION EXCELLENCE" (large, centered, white)
"Protecting Food. Protecting Lives." (smaller, gold accent, below)

STYLE: Corporate keynote slide, premium feel, dark mode
ASPECT: 16:9 widescreen`
  },
  {
    filename: 'divider-module2-arsenal',
    prompt: `Create a professional corporate chapter divider slide.

VISUAL DESIGN:
- Dark navy to black gradient background
- Teal/cyan accent glow (#00d4aa)
- Abstract representations of cleaning chemical containers/bottles (silhouettes)
- Professional, sophisticated mood

COMPOSITION:
- Content positioned for chapter intro
- Bold section feel

TEXT TO INCLUDE:
"MODULE 2" (small, teal, top)
"KNOW YOUR ARSENAL" (large, white, centered)
"Every chemical has a job. Use the right tool for the right task." (smaller, gray, below)

STYLE: Dark corporate, chapter break slide
ASPECT: 16:9`
  },
  {
    filename: 'divider-module3-contacttime',
    prompt: `Create a professional corporate chapter divider slide.

VISUAL DESIGN:
- Dark gradient background with warm amber/orange accent
- Abstract timer/clock visualization (subtle, geometric)
- Urgency mood without being alarming
- Professional corporate feel

TEXT TO INCLUDE:
"MODULE 3" (small, amber, top)
"CONTACT TIME IS KILL TIME" (large, white, centered)
"Every minute matters. Every shortcut costs." (smaller, gray, below)

STYLE: Dark corporate with urgency undertone
ASPECT: 16:9`
  },
  {
    filename: 'divider-module4-rinse',
    prompt: `Create a professional corporate chapter divider slide.

VISUAL DESIGN:
- Dark gradient background with blue water accent (#3b82f6)
- Abstract water droplet or flow visualization
- Clean, fresh mood
- Professional aesthetic

TEXT TO INCLUDE:
"MODULE 4" (small, blue, top)
"RINSE LIKE YOUR JOB DEPENDS ON IT" (large, white, centered)
"Because it does." (smaller, gray, below)

STYLE: Dark corporate, emphasizing water/cleanliness
ASPECT: 16:9`
  },
  {
    filename: 'divider-module5-killstep',
    prompt: `Create a professional corporate chapter divider slide.

VISUAL DESIGN:
- Dark gradient background with green accent (#10b981)
- Abstract visualization suggesting protection/shield
- Confident, protective mood
- Professional corporate style

TEXT TO INCLUDE:
"MODULE 5" (small, green, top)
"THE KILL STEP" (large, white, centered)
"This is where food safety happens." (smaller, gray, below)

STYLE: Dark corporate, protective confidence
ASPECT: 16:9`
  },
  {
    filename: 'divider-module6-foam',
    prompt: `Create a professional corporate chapter divider slide.

VISUAL DESIGN:
- Dark gradient background with purple/magenta accent (#8b5cf6)
- Abstract foam bubbles or cloud visualization (subtle)
- Dynamic but professional mood

TEXT TO INCLUDE:
"MODULE 6" (small, purple, top)
"THE POWER OF FOAM" (large, white, centered)
"Clings. Penetrates. Kills." (smaller, gray, below)

STYLE: Dark corporate with dynamic energy
ASPECT: 16:9`
  },
  {
    filename: 'divider-module7-rotation',
    prompt: `Create a professional corporate chapter divider slide.

VISUAL DESIGN:
- Dark gradient background with cyan accent (#06b6d4)
- Abstract circular/rotation arrows or cycle visualization
- Strategic, forward-thinking mood
- Professional corporate style

TEXT TO INCLUDE:
"MODULE 7" (small, cyan, top)
"ROTATE TO DOMINATE" (large, white, centered)
"Bacteria adapt. You must stay ahead." (smaller, gray, below)

STYLE: Dark corporate, strategic theme
ASPECT: 16:9`
  },
  {
    filename: 'divider-module8-listeria',
    prompt: `Create a professional corporate chapter divider slide.

VISUAL DESIGN:
- Dark gradient background with gold accent (#f59e0b)
- Subtle bacterial/pathogen visualization (abstract, not scary)
- Serious, important mood
- Premium corporate style

TEXT TO INCLUDE:
"MODULE 8" (small, gold, top)
"THE LISTERIA FACTOR" (large, white, centered)
"Everything you've learned protects against this killer." (smaller, gray, below)

STYLE: Dark corporate, serious importance
ASPECT: 16:9`
  }
];

// Whiteboard educational diagrams
const whiteboardDiagrams = [
  {
    filename: 'wb-timeline-killing',
    content: `A hand-drawn educational diagram showing "THE TIMELINE OF KILLING" comparing contact times.

LEFT SIDE - "SPRAY & WIPE (10 sec)":
- Surface looks wet: ✓
- Surface looks clean: Maybe
- Bacteria killed: ~50-70%
- Biofilm penetrated: ✗
(Draw sad face or X marks)

RIGHT SIDE - "PROPER CONTACT (5 min)":
- Surface stays wet: ✓
- Chemical penetrates: ✓
- Bacteria killed: 99.9%+
- Biofilm disrupted: ✓
(Draw happy face or checkmarks)

BOTTOM: Arrow pointing right with "5 minutes = the difference between cleaning and sanitizing"

Style: Clean whiteboard with blue and red marker, neat handwriting, educational tone`
  },
  {
    filename: 'wb-three-stage-cleaning',
    content: `A hand-drawn flowchart showing "THREE-STAGE CLEANING PROCESS"

STAGE 1 - DETERGENT (Blue box):
- Remove soil, grease, organic matter
- MUST RINSE afterward
- Contact: 10-15 minutes
Arrow down to...

STAGE 2 - RINSE (Green box):
- Remove ALL detergent residue
- Use potable water
- VERIFY with pH strips (6.5-7.5)
Arrow down to...

STAGE 3 - SANITIZER (Purple box):
- Kill remaining microorganisms
- Full contact time (5 min)
- Air dry only

Style: Neat whiteboard flowchart with colored boxes and arrows, professional educational diagram`
  },
  {
    filename: 'wb-chemical-matrix',
    content: `A hand-drawn reference table "CHEMICAL SELECTION MATRIX"

TABLE 1 - SOIL TYPE → DETERGENT:
| Heavy grease/fat    | → Special (Alkaline)  |
| Protein buildup     | → Special (Alkaline)  |
| Mineral scale       | → Foamacid (Acid)     |
| Light soil + disinfect | → Chlordet         |

TABLE 2 - SURFACE → SANITIZER:
| Food contact (daily) | → Oxiacid or Superquat |
| Post-deep clean     | → Rotate between both   |
| Drains              | → Concentrated application |

Style: Neat whiteboard table with blue marker, clean grid lines, easy to read`
  },
  {
    filename: 'wb-detergent-sanitizer-conflict',
    content: `A hand-drawn diagram showing "WHY RINSE MATTERS - The Detergent-Sanitizer Conflict"

SCENARIO showing 3 steps with sad outcome:
1. Special (pH 12-13) applied ✓
2. Quick rinse - residue remains (pH ~10) ⚠️
3. Oxiacid applied but... NEUTRALIZED! ✗

RESULT (in red):
- Alkaline residue NEUTRALIZES the sanitizer
- Concentration drops below effective level
- Surface NOT sanitized
- Bacteria survive!

"YOU JUST WASTED: Detergent + Sanitizer + Time + Food Safety"

Style: Warning-style whiteboard diagram with red emphasis on the problem`
  },
  {
    filename: 'wb-ph-verification',
    content: `A hand-drawn process diagram "pH VERIFICATION PROCESS"

AFTER RINSE - TEST WITH pH STRIP:

Step 1: Wet strip with rinse water from surface
Step 2: Wait 10-15 seconds
Step 3: Compare to color chart

RESULTS:
✓ pH 6.5-7.5 (NEUTRAL) = Proceed to sanitizer
✗ pH > 8 (ALKALINE) = Keep rinsing!
✗ pH < 6 (ACIDIC) = Keep rinsing!

Draw pH strip with color gradient and acceptable range highlighted in green

Style: Instructional whiteboard with clear steps, color-coded results`
  },
  {
    filename: 'wb-concentration-window',
    content: `A hand-drawn diagram "THE CONCENTRATION WINDOW"

Draw a vertical scale/thermometer style:

TOP (Too High - Red zone):
- Chemical residue issues
- May require rinsing
- Wasted product
- Surface damage risk

MIDDLE (Correct Range - Green zone):
- Oxiacid: 2000-4000 ppm
- Superquat: 2000-4000 ppm
- Effective kill rate ✓

BOTTOM (Too Low - Red zone):
- Insufficient kill
- Bacteria survive
- Creates resistant survivors
- FALSE SENSE OF SECURITY

Style: Visual scale diagram, clearly marked zones, whiteboard marker style`
  },
  {
    filename: 'wb-foam-vs-spray',
    content: `A hand-drawn comparison diagram "FOAM vs SPRAY"

LEFT - LIQUID SPRAY (with sad face):
- Runs off vertical surfaces (draw drips)
- Pools at bottom
- Hard to see coverage
- Contact time: Inconsistent
- Waste: High

RIGHT - FOAM APPLICATION (with happy face):
- Clings to vertical surfaces (draw foam)
- Even coverage visible
- Penetrates crevices
- Contact time: Maintained
- Waste: Minimal

Draw simple wall cross-sections showing the difference

Style: Side-by-side comparison whiteboard, visual emphasis on foam benefits`
  },
  {
    filename: 'wb-foam-technique',
    content: `A hand-drawn instructional diagram "PROPER FOAM TECHNIQUE"

EQUIPMENT: Low-pressure foamer (draw simple foamer)

NUMBERED STEPS with illustrations:
1. Start at TOP of surface
2. Work DOWNWARD in overlapping passes
3. Ensure COMPLETE coverage (no gaps)
4. Apply 2-3 cm thickness
5. Reapply where foam collapses early

VISUAL CHECK (checkboxes):
□ Entire surface covered
□ Foam thickness consistent
□ No bare spots
□ Foam staying wet/active

Style: Step-by-step instructional whiteboard with simple illustrations`
  },
  {
    filename: 'wb-resistance-problem',
    content: `A hand-drawn timeline diagram "THE RESISTANCE PROBLEM"

"USING SAME SANITIZER CONTINUOUSLY:"

Week 1: (pie chart 99.9% killed)
- 99.9% bacteria killed
- 0.1% survive (naturally tolerant)

Week 4: (larger survivor wedge)
- Survivors multiply
- Population now 10% tolerant

Week 12: (even larger)
- Tolerant bacteria dominant
- Same sanitizer = 90% kill

Week 24: (mostly resistant)
- Highly resistant population
- Sanitizer nearly ineffective

Arrow pointing to "THE SOLUTION: ROTATION" with circular arrows showing chemical alternation

Style: Timeline progression whiteboard showing increasing resistance`
  },
  {
    filename: 'wb-failure-cascade',
    content: `A hand-drawn cascade/flowchart "THE FAILURE CASCADE"

SHORTCUT: "I'll just spray and wipe"

Cascading boxes with arrows:
↓ Biofilm layer intact
↓ Listeria protected within
↓ Surface appears clean
↓ Next production begins
↓ Listeria transfers to product
↓ Product ships

CONSEQUENCE (in red box):
- Contaminated food reaches market
- Vulnerable people get sick
- Some die (17.6% mortality)
- Recall costs millions
- Careers ended

"ALL BECAUSE OF SKIPPED CONTACT TIME"

Style: Dramatic cascade diagram, red for consequences, warning tone`
  },
  {
    filename: 'wb-biofilm-penetration',
    content: `A hand-drawn cross-section diagram "PENETRATING THE BIOFILM"

BIOFILM STRUCTURE (layered cross-section):
┌─ Outer EPS matrix (polysaccharides, proteins, DNA)
│  ← "Detergent breaks this down"
├─ Protected bacteria inside
│  ← "Sanitizer kills these"
└─ Surface

PROPER PROCESS (green checkmarks):
1. Detergent + FULL contact = Matrix disrupted ✓
2. Thorough rinse = Residue removed ✓
3. Sanitizer + FULL contact = Bacteria killed ✓
4. Air dry = Residual protection ✓

SHORTCUT PROCESS (red X marks):
1. Quick spray = Matrix intact ✗
2. Quick rinse = Residue remains ✗
3. Sanitizer neutralized ✗
4. LISTERIA SURVIVES

Style: Scientific diagram style whiteboard, cross-section illustration`
  },
  {
    filename: 'wb-defense-system',
    content: `A hand-drawn layered diagram "YOUR COMPLETE DEFENSE SYSTEM"

Draw 4 stacked layers like a fortress:

LAYER 4 - ROTATION (top, cyan):
- Alternate chemical classes
- Prevent resistance
- Document schedule

LAYER 3 - SANITIZER (green):
- Kill microorganisms
- Full 5 min contact
- Verify concentration

LAYER 2 - RINSE (blue):
- Remove ALL residue
- pH test verification
- Continue until neutral

LAYER 1 - DETERGENT (foundation, orange):
- Remove organic soil
- Disrupt biofilm
- Full 15 min contact

RESULT at bottom: "Protected food, protected consumers, protected career"

Style: Layered fortress/wall diagram, each layer clearly labeled and colored`
  }
];

async function main() {
  const apiKey = process.env.NANO_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: NANO_API_KEY or GEMINI_API_KEY required');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);
  let totalCost = 0;

  console.log('\n🎨 CHEMICAL SANITATION EXCELLENCE - Image Generation\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Generate corporate dividers
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 CORPORATE DIVIDERS (8 images)');
  console.log('═══════════════════════════════════════════════════════\n');

  for (const divider of corporateDividers) {
    console.log(`Generating: ${divider.filename}...`);
    const result = await generator.generateDirect({
      prompt: divider.prompt,
      outputDir: OUTPUT_DIR,
      filename: divider.filename,
      aspectRatio: '16:9'
    });

    if (result.success) {
      console.log(`  ✓ Saved: ${result.imagePath}`);
      totalCost += result.cost;
    } else {
      console.log(`  ✗ Failed: ${result.error}`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate whiteboard diagrams
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📝 WHITEBOARD DIAGRAMS (12 images)');
  console.log('═══════════════════════════════════════════════════════\n');

  for (const diagram of whiteboardDiagrams) {
    console.log(`Generating: ${diagram.filename}...`);
    const result = await generator.generateWhiteboard({
      content: diagram.content,
      style: 'whiteboard',
      handwritingStyle: 'neat-teacher',
      inkColor: 'blue',
      outputDir: OUTPUT_DIR,
      aspectRatio: '16:9'
    });

    if (result.success) {
      console.log(`  ✓ Saved: ${result.imagePath}`);
      totalCost += result.cost;
    } else {
      console.log(`  ✗ Failed: ${result.error}`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total images: ${corporateDividers.length + whiteboardDiagrams.length}`);
  console.log(`Total cost: $${totalCost.toFixed(2)}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch(console.error);
