/**
 * Generate corporate-style training slides
 * Professional dark backgrounds, bold typography
 * Uses gemini-3-pro-image-preview
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = '/home/dachu/Documents/projects/content-engine/projects/professional/food-safety/output/veg-plants/images';

interface SlidePrompt {
  name: string;
  prompt: string;
}

const slidesToGenerate: SlidePrompt[] = [
  // ============ CHAPTER DIVIDERS - CORPORATE STYLE ============
  {
    name: 'divider-module1',
    prompt: `Create a professional corporate presentation chapter divider slide.

Large text on left side:
"MODULE 1"
Below it: "The Business Case for Food Safety"

Right side shows course outline:
► Module 1: Business Case ← (highlighted with yellow/gold bar)
   Module 2: Understanding Listeria
   Module 3: Where Listeria Hides
   Module 4: Mitigation Toolkit
   Module 5: Response Protocol

Style requirements:
- Dark navy blue gradient background (#1a1a2e to #16213e)
- Module 1 highlighted with bright gold/yellow accent bar
- Other modules in muted gray text
- Clean modern sans-serif typography (like Montserrat or Roboto)
- Subtle geometric shapes or lines as decoration
- Small dollar sign icon next to Module 1
- Professional, executive presentation quality
- NO whiteboard aesthetic - this is corporate`
  },
  {
    name: 'divider-module2',
    prompt: `Create a professional corporate presentation chapter divider slide.

Large text on left side:
"MODULE 2"
Below it: "Understanding Listeria"

Right side shows course outline:
   Module 1: Business Case
► Module 2: Understanding Listeria ← (highlighted with yellow/gold bar)
   Module 3: Where Listeria Hides
   Module 4: Mitigation Toolkit
   Module 5: Response Protocol

Style requirements:
- Dark navy blue gradient background (#1a1a2e to #16213e)
- Module 2 highlighted with bright gold/yellow accent bar
- Other modules in muted gray text
- Clean modern sans-serif typography
- Subtle geometric shapes or lines as decoration
- Small microscope or bacteria icon next to Module 2
- Professional, executive presentation quality
- NO whiteboard aesthetic - this is corporate`
  },
  {
    name: 'divider-module3',
    prompt: `Create a professional corporate presentation chapter divider slide.

Large text on left side:
"MODULE 3"
Below it: "Where Listeria Hides"

Right side shows course outline:
   Module 1: Business Case
   Module 2: Understanding Listeria
► Module 3: Where Listeria Hides ← (highlighted with yellow/gold bar)
   Module 4: Mitigation Toolkit
   Module 5: Response Protocol

Style requirements:
- Dark navy blue gradient background (#1a1a2e to #16213e)
- Module 3 highlighted with bright gold/yellow accent bar
- Other modules in muted gray text
- Clean modern sans-serif typography
- Subtle geometric shapes or lines as decoration
- Small magnifying glass icon next to Module 3
- Professional, executive presentation quality
- NO whiteboard aesthetic - this is corporate`
  },
  {
    name: 'divider-module4',
    prompt: `Create a professional corporate presentation chapter divider slide.

Large text on left side:
"MODULE 4"
Below it: "The Mitigation Toolkit"

Right side shows course outline:
   Module 1: Business Case
   Module 2: Understanding Listeria
   Module 3: Where Listeria Hides
► Module 4: Mitigation Toolkit ← (highlighted with yellow/gold bar)
   Module 5: Response Protocol

Style requirements:
- Dark navy blue gradient background (#1a1a2e to #16213e)
- Module 4 highlighted with bright gold/yellow accent bar
- Other modules in muted gray text
- Clean modern sans-serif typography
- Subtle geometric shapes or lines as decoration
- Small wrench/tools icon next to Module 4
- Professional, executive presentation quality
- NO whiteboard aesthetic - this is corporate`
  },
  {
    name: 'divider-module5',
    prompt: `Create a professional corporate presentation chapter divider slide.

Large text on left side:
"MODULE 5"
Below it: "When You Find a Positive"

Right side shows course outline:
   Module 1: Business Case
   Module 2: Understanding Listeria
   Module 3: Where Listeria Hides
   Module 4: Mitigation Toolkit
► Module 5: Response Protocol ← (highlighted with yellow/gold bar)

Style requirements:
- Dark navy blue gradient background (#1a1a2e to #16213e)
- Module 5 highlighted with bright gold/yellow accent bar
- Other modules in muted gray text
- Clean modern sans-serif typography
- Subtle geometric shapes or lines as decoration
- Small warning/alert triangle icon next to Module 5
- Professional, executive presentation quality
- NO whiteboard aesthetic - this is corporate`
  },

  // ============ IMPACT SLIDES - CORPORATE DARK STYLE ============
  {
    name: 'impact-listeria-kills',
    prompt: `Create a powerful, dark corporate presentation slide about Listeria mortality.

Center of slide, large bold text:
"LISTERIA KILLS"

Below that, prominent statistic:
"17.6% MORTALITY RATE"
"1 in 6 infected people die"

At bottom in smaller text:
"The highest fatality rate of any foodborne pathogen"

Style requirements:
- Dark dramatic background - deep navy/black gradient
- Main text "LISTERIA KILLS" in bold white, very large
- Statistics in red or amber for impact
- Subtle red glow or vignette effect
- Clean modern typography
- Somber, serious tone
- Executive presentation quality
- NO whiteboard - dark corporate impact slide`
  },
  {
    name: 'impact-recall-costs',
    prompt: `Create a powerful corporate infographic slide about food recall costs.

Title at top: "THE COST OF FAILURE"

Display these statistics with icons:
💰 Average recall cost: $10 MILLION
📈 Major recalls exceed: $100 MILLION
📉 Stock price impact: -20% average
⏱️ Brand recovery: 2-5 YEARS
⚖️ Executive liability: CRIMINAL CHARGES

Bottom message:
"Prevention costs thousands. Failure costs millions."

Style requirements:
- Dark navy/charcoal gradient background
- Statistics in bright white with gold/amber accents
- Clean icon style (not emoji - professional line icons)
- Numbers should be LARGE and prominent
- Modern corporate infographic design
- Professional executive presentation quality
- NO whiteboard aesthetic`
  },
  {
    name: 'impact-no-volume',
    prompt: `Create a powerful corporate message slide.

Center of slide, massive bold text:
"THERE IS NO VOLUME
WITHOUT SAFETY"

Below in smaller text:
"Every unit we ship carries our reputation"

At bottom:
"One incident can shut down operations for weeks"

Style requirements:
- Dark dramatic background - deep blue to black gradient
- Main message in bright white, very bold, centered
- "NO" could be highlighted in gold or amber
- Subtitle in lighter gray
- Warning text at bottom in amber/yellow
- Clean powerful typography
- Inspirational/serious corporate poster style
- NO whiteboard - dark executive impact slide`
  },
  {
    name: 'impact-who-we-protect',
    prompt: `Create an emotional corporate slide about vulnerable populations.

Title: "WHO WE PROTECT"

Show 4 silhouette icons in a row:
- Pregnant woman
- Newborn baby
- Elderly person
- Person with medical symbol (immunocompromised)

Below each, small label:
"Pregnant Women" | "Newborns" | "Elderly" | "Immunocompromised"

Center bottom, large text:
"Their lives depend on our vigilance"

Style requirements:
- Dark blue gradient background
- White silhouette icons, simple and respectful
- Gold/warm accent lighting effect
- Emotional but professional tone
- Text in white and soft gold
- Corporate presentation quality
- Somber, meaningful design
- NO whiteboard aesthetic`
  },
  {
    name: 'impact-culture-truth',
    prompt: `Create a thought-provoking corporate slide.

Large text at top:
"THE UNCOMFORTABLE TRUTH"

Main message in center:
"Your staff already know where the problems are"

Below that:
"The question is: Are we listening?"

Bottom section:
"Culture beats compliance. Every time."

Style requirements:
- Dark moody background - charcoal/navy gradient
- Main message in bright white, prominent
- "UNCOMFORTABLE TRUTH" in amber/gold
- Thought-provoking, challenges the viewer
- Clean modern typography
- Executive/leadership presentation style
- NO whiteboard - corporate impact slide`
  }
];

async function main() {
  const apiKey = process.env.NANO_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: No API key found. Set NANO_API_KEY or GEMINI_API_KEY');
    process.exit(1);
  }

  console.log(`\n🎨 Generating ${slidesToGenerate.length} corporate-style slides...`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  const generator = new GeminiImageGenerator(apiKey);
  let successCount = 0;
  let totalCost = 0;

  for (let i = 0; i < slidesToGenerate.length; i++) {
    const slide = slidesToGenerate[i];
    console.log(`\n[${i + 1}/${slidesToGenerate.length}] 📸 Generating: ${slide.name}`);

    try {
      // Use generateDirect - no whiteboard wrapper, prompt passed as-is
      const result = await generator.generateDirect({
        prompt: slide.prompt,
        outputDir: OUTPUT_DIR,
        filename: slide.name,
        aspectRatio: '16:9'
      });

      if (result.success && result.imagePath) {
        console.log(`   ✅ Success: ${result.imagePath}`);
        console.log(`   💰 Cost: $${result.cost.toFixed(3)}`);
        successCount++;
        totalCost += result.cost;
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`);
    }

    // Delay between generations
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
