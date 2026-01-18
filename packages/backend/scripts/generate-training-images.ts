/**
 * Generate training slide images for Food Safety Listeria module
 * Uses gemini-3-pro-image-preview model for text quality
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = '/home/dachu/Documents/projects/content-engine/projects/professional/food-safety/output/veg-plants/images';

interface SlidePrompt {
  name: string;
  prompt: string;
}

const slidesToGenerate: SlidePrompt[] = [
  // ============ CHAPTER DIVIDERS ============
  {
    name: 'chapter-module1-business-case',
    prompt: `Create a professional course chapter divider slide.

Title: "MODULE 1"
Subtitle: "The Business Case for Food Safety"

Show a course outline on the right side:
→ Module 1: Business Case (HIGHLIGHTED - current)
  Module 2: Understanding Listeria
  Module 3: Where Listeria Hides
  Module 4: Mitigation Toolkit
  Module 5: Response Protocol

Style:
- Clean corporate presentation design
- Dark blue gradient background
- Module 1 highlighted in bright yellow/gold
- Other modules in lighter gray
- Professional sans-serif typography
- Subtle icon of dollar sign or shield next to Module 1`
  },
  {
    name: 'chapter-module3-harborage',
    prompt: `Create a professional course chapter divider slide.

Title: "MODULE 3"
Subtitle: "Where Listeria Hides"

Show a course outline on the right side:
  Module 1: Business Case
  Module 2: Understanding Listeria
→ Module 3: Where Listeria Hides (HIGHLIGHTED - current)
  Module 4: Mitigation Toolkit
  Module 5: Response Protocol

Style:
- Clean corporate presentation design
- Dark blue gradient background
- Module 3 highlighted in bright yellow/gold
- Other modules in lighter gray
- Professional sans-serif typography
- Subtle icon of magnifying glass next to Module 3`
  },
  {
    name: 'chapter-module4-toolkit',
    prompt: `Create a professional course chapter divider slide.

Title: "MODULE 4"
Subtitle: "The Mitigation Toolkit"

Show a course outline on the right side:
  Module 1: Business Case
  Module 2: Understanding Listeria
  Module 3: Where Listeria Hides
→ Module 4: Mitigation Toolkit (HIGHLIGHTED - current)
  Module 5: Response Protocol

Style:
- Clean corporate presentation design
- Dark blue gradient background
- Module 4 highlighted in bright yellow/gold
- Other modules in lighter gray
- Professional sans-serif typography
- Subtle icon of wrench/tools next to Module 4`
  },
  {
    name: 'chapter-module5-response',
    prompt: `Create a professional course chapter divider slide.

Title: "MODULE 5"
Subtitle: "When You Find a Positive"

Show a course outline on the right side:
  Module 1: Business Case
  Module 2: Understanding Listeria
  Module 3: Where Listeria Hides
  Module 4: Mitigation Toolkit
→ Module 5: Response Protocol (HIGHLIGHTED - current)

Style:
- Clean corporate presentation design
- Dark blue gradient background
- Module 5 highlighted in bright yellow/gold
- Other modules in lighter gray
- Professional sans-serif typography
- Subtle icon of warning/alert symbol next to Module 5`
  },

  // ============ EDUCATIONAL DIAGRAMS ============
  {
    name: 'zone-concept-diagram',
    prompt: `Create an educational diagram showing food safety zone classifications.

Title: "Understanding Zones 1-4"

Draw a floor plan view of a food processing area showing:

ZONE 1 (RED) - Food Contact Surfaces
- Cutting boards, knives, conveyor belts
- Label: "Direct product contact"

ZONE 2 (ORANGE) - Adjacent to Zone 1
- Equipment legs, nearby floors
- Label: "1 meter from product"

ZONE 3 (YELLOW) - Same room
- Drains, walls, floors further away
- Label: "Same production area"

ZONE 4 (GREEN) - Outside production
- Hallways, loading docks, offices
- Label: "Non-production areas"

Show concentric areas radiating outward from a production line
Add arrows showing "Risk decreases →"

Style: Clean educational diagram, whiteboard aesthetic, clear color coding`
  },
  {
    name: 'skirting-good-vs-bad',
    prompt: `Create a cross-section diagram comparing good vs bad floor-wall junctions (skirting/coving).

Title: "Skirting: The Hidden Harborage"

LEFT SIDE - "BAD: Gaps and Cracks"
Show a cross-section with:
- Gap between wall and floor
- Cracked/damaged cove
- Water pooling in gap
- Bacteria symbols hiding in crevice
- Label: "Listeria harborage site"
- Red X mark

RIGHT SIDE - "GOOD: Seamless Coving"
Show a cross-section with:
- Smooth curved cove (no gaps)
- Sealed junction
- Water draining away
- Label: "No harborage possible"
- Green checkmark

Bottom text: "Damaged skirting = permanent Listeria home"

Style: Technical cross-section diagram, whiteboard style, clear annotations`
  },
  {
    name: 'drain-design-comparison',
    prompt: `Create a comparison diagram of drain designs for food safety.

Title: "Drain Design Matters"

LEFT - "PROBLEM DRAIN"
Show top-down and cross-section view:
- Flat drain cover
- Deep sump (trap)
- Standing water visible
- Label issues: "Biofilm builds here", "Splash zone"
- Red warning indicators

RIGHT - "HYGIENIC DRAIN"
Show top-down and cross-section view:
- Sloped/self-draining design
- Shallow, cleanable sump
- Removable basket/strainer
- Good slope directing flow
- Label: "Easy to clean", "No standing water"
- Green checkmarks

Bottom note: "Never spray directly into drains - aerosolizes bacteria"

Style: Technical diagram, whiteboard aesthetic, clear labeling`
  },
  {
    name: 'traffic-vectors-spread',
    prompt: `Create a diagram showing how traffic spreads Listeria contamination.

Title: "Traffic Vectors: How Listeria Moves"

Show a simplified floor plan with:

CENTER: "DRAIN (Reservoir)" - marked in red

ARROWS spreading outward showing:
1. WHEELED TRAFFIC path (trolley/dolly icon)
   - "Wheels pick up contamination"
   - "Spread to multiple zones"

2. FOOT TRAFFIC path (boot icon)
   - "Boots cross zones"
   - "Contaminate clean areas"

3. CLEANING EQUIPMENT path (mop bucket icon)
   - "Mop spreads contamination"
   - "Cross-use between areas"

DESTINATION points around the room:
- "Production Area" (now contaminated)
- "Packing Area" (now contaminated)
- "Storage Area" (now contaminated)

Key message at bottom: "Control traffic = Control spread"

Style: Flow diagram with clear arrows, whiteboard style, color coded paths`
  },
  {
    name: 'escalation-decision-tree',
    prompt: `Create a decision tree diagram for responding to Listeria positives.

Title: "Positive Result Response Protocol"

START: "POSITIVE DETECTED" (red box)

Branch 1: "Which Zone?"

ZONE 3/4 PATH:
→ "Investigate source"
→ "Increase sampling"
→ "Enhanced cleaning"
→ "Verify: 3 consecutive negatives"

ZONE 2 PATH:
→ "STOP - Assess risk to product"
→ "Check Zone 1 proximity"
→ "Root cause investigation"
→ "Intensive cleaning + verify"

ZONE 1 PATH (RED/URGENT):
→ "IMMEDIATE HOLD on product"
→ "Notify management"
→ "Full investigation"
→ "Consider product testing"
→ "Do not release until verified clear"

End boxes:
- "Cleared: 3 negatives on different days"
- "Recurring? = Structural issue - escalate"

Style: Clean flowchart, whiteboard style, color coded by urgency (green/yellow/red)`
  },
  {
    name: 'vulnerable-populations',
    prompt: `Create an educational slide about Listeria vulnerable populations.

Title: "Who is at Risk? Listeria's Targets"

Show 4 groups with icons and statistics:

1. PREGNANT WOMEN (icon: pregnant figure)
   - "10x more likely to get infected"
   - "Can cause stillbirth, miscarriage"

2. NEWBORNS (icon: baby)
   - "Infection from mother"
   - "Can be fatal"

3. ELDERLY (icon: elderly person with cane)
   - "65+ years at high risk"
   - "Weakened immune systems"

4. IMMUNOCOMPROMISED (icon: medical cross)
   - "Cancer patients, transplant recipients"
   - "HIV/AIDS patients"

CENTER STATISTIC in large text:
"17.6% MORTALITY RATE"
"1 in 6 infected people die"

Bottom message: "We protect these people every day"

Style: Clean infographic, respectful icons, dark blue background, impactful statistics`
  },
  {
    name: 'listeria-cold-growth',
    prompt: `Create an educational diagram showing Listeria's cold growth ability.

Title: "Listeria: The Cold-Loving Killer"

Show a thermometer graphic with temperature zones:

TOP: 60°C/140°F - "DEATH ZONE" (red)
- "Listeria killed at cooking temps"

MIDDLE: 20-40°C - "RAPID GROWTH" (orange)
- "Room temperature = fast multiplication"

BOTTOM: 0-4°C / 32-40°F - "STILL GROWING!" (blue, highlighted)
- "YOUR REFRIGERATOR"
- "Grows at fridge temperatures"
- "Doubles every 24-48 hours at 4°C"

VERY BOTTOM: -18°C - "DORMANT" (gray)
- "Freezing stops growth but doesn't kill"

Key message in box:
"Your chiller is NOT protection against Listeria"
"Cold storage = Listeria-friendly environment"

Include small bacteria icons multiplying in the cold zone

Style: Clean infographic, temperature gradient colors, whiteboard style`
  },
  {
    name: 'paa-vs-qac-chemicals',
    prompt: `Create a comparison diagram of sanitizer effectiveness against biofilms.

Title: "Chemical Weapons: PAA vs QAC"

Split screen comparison:

LEFT - "QAC (Quaternary Ammonium)"
- Show biofilm with protective layer intact
- QAC molecules bouncing off surface
- Label: "Cannot penetrate biofilm matrix"
- "Good for: General surface sanitation"
- "Limitation: Ineffective on established biofilms"
- Yellow/amber zone indicating "Partial effectiveness"

RIGHT - "PAA (Peroxyacetic Acid)"
- Show biofilm being broken down
- PAA molecules penetrating and destroying matrix
- Label: "Breaks down biofilm structure"
- "Good for: Biofilm destruction, deep sanitizing"
- "Advantage: Penetrates protective slime"
- Green zone indicating "Effective against biofilms"

Bottom key insight:
"Clean FIRST (remove debris) → THEN sanitize"
"For biofilms: PAA is your weapon of choice"

Style: Scientific diagram, whiteboard style, clear visual comparison`
  }
];

async function main() {
  const apiKey = process.env.NANO_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: No API key found. Set NANO_API_KEY or GEMINI_API_KEY');
    process.exit(1);
  }

  console.log(`\n🎨 Generating ${slidesToGenerate.length} training slide images...`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  const generator = new GeminiImageGenerator(apiKey);
  let successCount = 0;
  let totalCost = 0;

  for (let i = 0; i < slidesToGenerate.length; i++) {
    const slide = slidesToGenerate[i];
    console.log(`\n[${i + 1}/${slidesToGenerate.length}] 📸 Generating: ${slide.name}`);

    try {
      const result = await generator.generateWhiteboard({
        content: slide.prompt,
        style: 'whiteboard',
        outputDir: OUTPUT_DIR,
        aspectRatio: '16:9'
      });

      if (result.success && result.imagePath) {
        const ext = result.imagePath.split('.').pop();
        const newPath = `${OUTPUT_DIR}/${slide.name}.${ext}`;
        await fs.rename(result.imagePath, newPath);
        console.log(`   ✅ Success: ${slide.name}.${ext}`);
        console.log(`   💰 Cost: $${result.cost.toFixed(3)}`);
        successCount++;
        totalCost += result.cost;
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`);
    }

    // Delay between generations (avoid rate limits)
    if (i < slidesToGenerate.length - 1) {
      console.log('   ⏳ Waiting 3s...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✨ Generation Complete!`);
  console.log(`   Success: ${successCount}/${slidesToGenerate.length}`);
  console.log(`   Total Cost: $${totalCost.toFixed(2)}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
