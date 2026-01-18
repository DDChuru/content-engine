/**
 * Listeria Protocol Training Infographics Generator
 * For Farmwise Vegetable Processing (Precuts & Prepacks)
 *
 * Uses gemini-3-pro-image-preview for ALL image generation
 */

import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.resolve(__dirname, '../../../projects/professional/food-safety/output/farmwise-listeria-training/images');

// Infographic prompts - designed for cleaner training
const infographics = {
  'hotspot-map': {
    title: 'Listeria Hotspot Map',
    prompt: `Create a professional training infographic showing "LISTERIA HOTSPOTS" in a food processing facility.

The infographic should show a top-down or isometric view of a vegetable processing area with these 10 NUMBERED hotspots clearly marked with red warning circles:

1. Floor drains (with water pooling)
2. Condensation drip points on ceiling/pipes
3. Cold room door seals
4. Equipment legs and feet touching floor
5. Conveyor belt undersides and joints
6. Cutting board edges and crevices
7. Hollow rollers
8. Door handles and switches
9. Wet/dry zone transitions
10. Cracks in floor tiles

Style:
- Clean, professional infographic design
- Blue and red color scheme (red for danger zones)
- Industrial/food processing setting
- Clear numbered labels
- Title "WHERE LISTERIA HIDES" at top
- Subtitle "Know Your Hotspots - Check Every Shift"
- Warning style - urgent but educational

This is for cleaner training - make it easy to understand at a glance.`
  },

  'five-step-protocol': {
    title: '5-Step Cleaning Protocol',
    prompt: `Create a professional training infographic showing the "5-STEP LISTERIA CLEANING PROTOCOL".

Show 5 sequential steps in a clear flow, each with an icon and description:

STEP 1: DRY PICKUP
- Icon: Squeegee/scraper
- "Remove all food debris DRY first"
- "No water yet!"

STEP 2: PRE-RINSE
- Icon: Low pressure water (gentle stream)
- "Controlled rinse - LOW PRESSURE"
- "NO splashing!" with warning symbol

STEP 3: DETERGENT + SCRUB (BIGGEST SECTION - highlight this!)
- Icon: Brush with soap bubbles + flexed arm/muscle
- "Apply detergent"
- "SCRUB WITH ELBOW JUICE!"
- "This breaks the biofilm!"
- Show scrubbing action, physical effort
- Contact time clock

STEP 4: RINSE
- Icon: Water stream
- "Rinse all detergent"
- "Top to bottom, toward drain"

STEP 5: SANITIZE
- Icon: Spray bottle with checkmark
- "Apply sanitizer"
- "Correct dilution + contact time"
- "Let it work - don't rinse!"

Style:
- Vertical or horizontal flow diagram
- Step 3 should be LARGEST and most prominent (elbow juice!)
- Green checkmarks for correct actions
- Red X for wrong actions where relevant
- Professional food safety training look
- Title "5 STEPS TO KILL LISTERIA"
- Subtitle "Every Step Matters - Especially the Scrubbing!"`
  },

  'elbow-juice': {
    title: 'Elbow Juice Matters',
    prompt: `Create a powerful training infographic titled "ELBOW JUICE MATTERS!"

Split the image into two halves for comparison:

LEFT SIDE (WRONG - Red X):
- Title: "Chemicals Alone = FAIL"
- Show sanitizer being sprayed on a surface
- Hidden bacteria/biofilm underneath (show as protected shield/dome)
- Bacteria saying "I'm protected by biofilm!"
- Result: Listeria survives

RIGHT SIDE (CORRECT - Green checkmark):
- Title: "Scrub + Chemicals = SUCCESS"
- Show hands scrubbing with brush, elbow grease, physical effort
- Biofilm being broken apart
- Then sanitizer being applied
- Bacteria exposed and killed
- Result: Surface truly clean

Bottom message:
"BIOFILM is Listeria's armour. SCRUBBING breaks it. Then sanitizers can KILL."

Style:
- Bold, impactful comparison
- Before/after or side-by-side
- Show the EFFORT required (flexed arm, motion lines on scrubbing)
- Educational but memorable
- Red and green for wrong/right
- Food processing context`
  },

  'cross-contamination': {
    title: 'Cross-Contamination Prevention',
    prompt: `Create a training infographic titled "STOP CROSS-CONTAMINATION" showing cleaning DON'Ts.

Show 4 panels of WRONG practices with big red X marks:

PANEL 1: "NO High Pressure!"
- Show high pressure hose creating splash/spray
- Droplets flying onto walls, ceiling, clean surfaces
- Contamination spreading everywhere
- "Splash spreads Listeria 2+ meters!"

PANEL 2: "WRONG Direction!"
- Show cleaning motion going FROM drain TOWARD food area
- Big red arrows showing wrong direction
- "Always clean TOWARD drains, never away!"

PANEL 3: "Drain Brush on Equipment!"
- Show someone using a drain brush on food contact surface
- Horror/warning symbols
- "Drain tools = DRAIN ONLY!"
- Show colour coding (e.g., red brush = drains only)

PANEL 4: "Spreading the Mess!"
- Show dirty water being spread across large area
- Footprints tracking contamination
- "Contain it! Don't spread it!"

Style:
- 4-panel grid layout
- Bold red X on each panel
- Clear prohibition style
- Industrial cleaning context
- Urgent, warning tone
- Bottom message: "Your cleaning can SPREAD or STOP contamination - You choose!"`
  },

  'equipment-parts': {
    title: 'Equipment Parts Handling',
    prompt: `Create a training infographic titled "WHERE DO STRIPPED PARTS GO?"

Split into two sections:

TOP SECTION - BIG RED X - "NEVER ON THE FLOOR!"
- Show equipment parts (blades, guards, covers, trays) sitting directly on floor
- Dirty floor with drain nearby
- Contamination symbols rising from floor to parts
- "The floor is the DIRTIEST place in the facility!"
- "Parts on floor = Contaminated parts = Contaminated product"

BOTTOM SECTION - BIG GREEN CHECKMARK - "USE DESIGNATED STANDS!"
- Show same parts properly placed on:
  - Sanitized stainless steel rack
  - Parts trolley with clean liner
  - Designated elevated stand
  - Clean table/bench
- Parts elevated off floor
- "Elevated = Protected"
- "Use sanitized racks, trolleys, or benches"

Style:
- Strong visual contrast between wrong and right
- Industrial food processing equipment parts
- Floor should look industrial/potentially dirty
- Racks/trolleys should look clean and proper
- Training poster style
- Memorable and clear message
- Bottom text: "If it touches product, it NEVER touches the floor!"`
  },

  'clean-your-tools': {
    title: 'Clean Your Cleaning Equipment',
    prompt: `Create a training infographic titled "DIRTY TOOLS SPREAD LISTERIA"

Show the cleaning equipment lifecycle:

SECTION 1: "After EVERY Use"
- Icons of: brush, mop, bucket, squeegee, cloth
- Arrow pointing to cleaning station
- "Wash, Sanitize, Rinse"

SECTION 2: "Store Correctly"
- Show brushes and mops HANGING (elevated, air drying)
- Green checkmark
- vs. Standing in dirty bucket of water
- Red X - "Never store wet in buckets!"

SECTION 3: "Inspect Daily"
- Show worn brush with frayed bristles
- Cracked mop head
- "Damaged tools = Bacteria hideouts"
- "If it's worn, it's gone!"

SECTION 4: "Colour Code System"
- Show different coloured brushes/tools
- Red = Drains only
- Blue = Floors
- White/Yellow = Food contact surfaces
- "Never mix colours!"

Bottom message:
"Your tools are only as clean as YOU make them"

Style:
- 4-section grid or flow
- Practical, actionable
- Show real cleaning equipment
- Industrial/food processing context
- Professional training material look`
  },

  'handwashing': {
    title: 'Handwashing Protocol',
    prompt: `Create a training infographic for "HANDWASHING - YOUR FIRST DEFENCE"

Show the complete handwashing protocol:

WHEN TO WASH (Left side icons):
- Entering production area
- After touching drains/floors
- After removing gloves
- After touching face/hair
- Before handling clean equipment
- After breaks

HOW TO WASH (Center - 6 step visual):
1. Wet hands
2. Apply soap
3. Scrub 20 seconds (show clock) - palms, backs, between fingers, nails
4. Rinse thoroughly
5. Dry with paper towel
6. Use towel to turn off tap

KEY POINTS (Right side):
- "20 seconds minimum!"
- "Scrub under nails!"
- "Paper towels only - no air dryers!"
- "Don't touch tap with clean hands!"

Style:
- Step-by-step visual guide
- Hands illustrations at each stage
- Timer/clock showing 20 seconds
- Clean, medical/food safety style
- Blue and white colour scheme
- Professional but accessible for all literacy levels`
  },

  'escalation': {
    title: 'Escalation Flowchart',
    prompt: `Create a training infographic titled "SEE SOMETHING? SAY SOMETHING!"

Show an escalation flowchart for reporting contamination concerns:

WHAT TO REPORT (Top section with icons):
- Visible mould or slime
- Unusual smells
- Damaged equipment (cracks, rust)
- Pest signs (droppings, damage)
- Standing water where it shouldn't be
- Damaged seals or gaskets
- Anything that "doesn't look right"

ESCALATION FLOW (Center):
YOU (cleaner icon)
  ↓ "Report immediately"
SUPERVISOR (supervisor icon)
  ↓ "Assesses and escalates if needed"
QC / MANAGEMENT (clipboard icon)
  ↓ "Takes corrective action"
DOCUMENTED (checkmark icon)
  "Recorded in system"

KEY MESSAGES (Bottom):
- "Don't try to fix it yourself - REPORT IT"
- "Never hide problems - they get worse"
- "Quick reporting = quick action = safe product"
- "You are the first line of defence!"

Style:
- Clear flowchart with arrows
- Icons for each role
- Urgent but positive tone
- Green for good reporting behaviour
- Traffic light system (report → assess → act → done)
- Professional food safety training style`
  }
};

class InfographicGenerator {
  constructor(apiKey) {
    this.genAI = new GoogleGenAI({ apiKey });
    this.costPerImage = 0.039;
  }

  async generate(name, config) {
    try {
      console.log(`\n[Generating] ${config.title}...`);

      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: config.prompt,
        config: {
          imageConfig: {
            aspectRatio: '4:3',
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in response');
      }

      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      const extension = mimeType.includes('jpeg') ? 'jpg' :
                       mimeType.includes('webp') ? 'webp' : 'png';

      await fs.mkdir(OUTPUT_DIR, { recursive: true });
      const filepath = path.join(OUTPUT_DIR, `${name}.${extension}`);
      await fs.writeFile(filepath, imageBuffer);

      console.log(`[✓] Saved: ${filepath}`);
      return { success: true, path: filepath, cost: this.costPerImage, title: config.title };

    } catch (error) {
      console.error(`[✗] Error generating ${name}:`, error.message);
      return { success: false, error: error.message, cost: 0, title: config.title };
    }
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('LISTERIA PROTOCOL TRAINING - INFOGRAPHIC GENERATOR');
  console.log('Farmwise Vegetable Processing');
  console.log('═'.repeat(60));

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('\nERROR: GEMINI_API_KEY not found in .env');
    process.exit(1);
  }

  console.log(`\nOutput: ${OUTPUT_DIR}`);
  console.log(`Infographics to generate: ${Object.keys(infographics).length}`);

  const generator = new InfographicGenerator(apiKey);
  const results = [];
  let totalCost = 0;

  for (const [name, config] of Object.entries(infographics)) {
    const result = await generator.generate(name, config);
    results.push({ name, ...result });
    totalCost += result.cost;

    // Delay between generations
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('GENERATION COMPLETE');
  console.log('═'.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\nSuccessful: ${successful.length}/${results.length}`);
  successful.forEach(r => console.log(`  ✓ ${r.title}`));

  if (failed.length > 0) {
    console.log(`\nFailed: ${failed.length}`);
    failed.forEach(r => console.log(`  ✗ ${r.title}: ${r.error}`));
  }

  console.log(`\nTotal cost: $${totalCost.toFixed(3)}`);
  console.log(`\nImages saved to:\n${OUTPUT_DIR}`);
}

main().catch(console.error);
