/**
 * Generate Shopfloor Training Infographics (Bilingual EN/ZU)
 * Simple, visual training materials for shopfloor cleaners
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = '/home/dachu/Documents/projects/angular/ncr_audit_app/src/assets/training/shopfloor-training/images';

interface InfographicSpec {
  id: string;
  filename: string;
  prompt: string;
  style: 'infographic' | 'whiteboard' | 'diagram';
}

const infographics: InfographicSpec[] = [
  {
    id: 'three-steps',
    filename: 'infographic-three-steps.jpg',
    style: 'infographic',
    prompt: `Create a bright, colorful infographic showing "THE 3 STEPS OF CLEANING" (Izinyathelo Ezi-3 Zokuhlanza)

STEP 1: CLEAN (HLANZA)
Icon: Soap bubbles on surface
Text: "Remove dirt with DETERGENT" / "Susa insila nge-DETERGENT"
Color: BLUE

STEP 2: RINSE (GEZA)
Icon: Water droplets washing away soap
Text: "Wash away soap" / "Geza insipho"
Color: LIGHT BLUE

STEP 3: SANITIZE (BULALA AMAGCIWANE)
Icon: Spray bottle with checkmark/shield
Text: "Kill germs with SANITIZER" / "Bulala amagciwane nge-SANITIZER"
Color: GREEN

Make it simple, bold icons with large text. Professional infographic style with numbered circles 1-2-3. Arrows flowing between steps.`
  },
  {
    id: 'ppe-safety',
    filename: 'infographic-ppe-safety.jpg',
    style: 'infographic',
    prompt: `Create a safety infographic "PROTECT YOURSELF" (ZIVIKELE)

Show a worker figure in center wearing all PPE:

1. GLOVES (AMAGLAVU) - Blue rubber gloves icon
   "Always wear gloves" / "Hlala ugqoke amaglavu"

2. GOGGLES (IZIBUKO) - Safety goggles icon
   "Protect your eyes" / "Vikela amehlo akho"

3. APRON (IFASIKOTI) - Waterproof apron icon
   "Keep chemicals off clothes" / "Gcina amakhemikhali kude nezingubo"

4. BOOTS (IZICATHULO) - Rubber boots icon
   "Non-slip boots" / "Izicathulo ezingashelelezi"

Bright colors, simple icons, large text. Safety theme with yellow/black accents. Professional infographic style.`
  },
  {
    id: 'contact-time',
    filename: 'infographic-contact-time.jpg',
    style: 'infographic',
    prompt: `Create an infographic about "CONTACT TIME MATTERS" (ISIKHATHI SOKUSEBENZA SIBALIWE!)

Show a large clock/timer in center with text:

"Let the chemical WORK!" / "Vumela ikhemikhali ISEBENZE!"

Two scenarios side by side:

WRONG (X in red):
- Clock showing 1 minute
- Sad bacteria still alive
- "Too quick = germs survive" / "Kushesha kakhulu = amagciwane ayasinda"

RIGHT (✓ in green):
- Clock showing 10 minutes
- Dead bacteria (X eyes)
- "Wait = germs die" / "Linda = amagciwane ayafa"

Big, simple icons. Use red for wrong, green for correct. Make the timer very prominent.`
  },
  {
    id: 'dilution',
    filename: 'infographic-dilution.jpg',
    style: 'infographic',
    prompt: `Create an infographic "MIX IT RIGHT" (XUBA NGENDLELA EFANELE)

Show 3 measuring scenarios:

TOO LITTLE (red X):
- Small amount chemical in big bucket
- "Weak = won't work" / "Buthakathaka = ngeke kusebenze"

JUST RIGHT (green ✓):
- Correct measurement in bucket
- "Follow the label" / "Landela ilebula"
- Show measuring cup icon

TOO MUCH (red X):
- Too much chemical overflowing
- "Waste money + dangerous" / "Mosha imali + kuyingozi"

Center message: "ALWAYS MEASURE" / "HLALA ULINGANISA"

Simple bucket illustrations, bright colors, clear icons.`
  },
  {
    id: 'rinse-importance',
    filename: 'infographic-rinse.jpg',
    style: 'infographic',
    prompt: `Create an infographic "RINSE PROPERLY" (GEZA KAHLE)

Show the problem clearly:

TOP SECTION - THE DANGER:
Soap residue + Sanitizer = CANCELLED OUT (X)
"Detergent kills sanitizer!" / "I-Detergent ibulala i-Sanitizer!"

BOTTOM SECTION - THE SOLUTION:
Step 1: Clean surface with soap bubbles
Step 2: Rinse with lots of water (show water washing away)
Step 3: Check with pH strip (show hand with test strip)
Step 4: Apply sanitizer (green checkmark)

"No soap left = sanitizer works!" / "Akusele nsipho = i-sanitizer iyasebenza!"

Use blue for detergent, green for sanitizer, red X for the conflict.`
  },
  {
    id: '200sf-howto',
    filename: 'infographic-200sf.jpg',
    style: 'infographic',
    prompt: `Create an infographic for "DELUXE 200SF" alkaline foam cleaner

Header: "DELUXE 200SF - FOAM CLEANER" (RED color scheme like the product)

HOW TO USE:
1. MIX: 0.5-3% (show measuring: 50-300ml per 10L water)
2. APPLY: Foam from TOP to BOTTOM (show downward arrow)
3. WAIT: 10 MINUTES (show clock icon)
4. RINSE: Wash away completely (show water hose)

WHAT IT CLEANS:
- Grease/Fat (Amafutha) - oil icon
- Protein (Amaprotheni) - meat icon
- Heavy soil (Inhlabathi enzima) - dirty surface icon

SAFETY: Wear gloves + goggles (icons)

Red accent colors to match product. Simple icons, big numbers.`
  },
  {
    id: 'chlordet-howto',
    filename: 'infographic-chlordet.jpg',
    style: 'infographic',
    prompt: `Create an infographic for "CHLORDET" detergent-disinfectant

Header: "CHLORDET - CLEANS + DISINFECTS" (RED color scheme)

HOW TO USE:
1. MIX: 0.6-2% (show measuring: 60-200ml per 10L water)
2. APPLY: Spray or foam onto surface
3. WAIT: 15 MINUTES (show clock icon)
4. RINSE: Wash away completely

BEST FOR:
- Daily cleaning (Ukuhlanza kwansuku zonke)
- Light soil areas (Izindawo ezinensila elula)
- When you need BOTH clean + disinfect

Contains CHLORINE - kills germs while cleaning!

SAFETY: Wear gloves + goggles + apron (icons)
WARNING: Strong chemical - ventilate area!

Red accent colors. Simple icons, clear steps.`
  },
  {
    id: 'sanitizers-howto',
    filename: 'infographic-sanitizers.jpg',
    style: 'infographic',
    prompt: `Create an infographic comparing TWO SANITIZERS

Header: "YOUR SANITIZERS" (BLUE/TEAL color scheme)

LEFT SIDE - OXIACID (Blue):
- Type: Peracetic Acid (PAA)
- Mix: Very small amount! (show tiny measure)
- Wait: 5 minutes
- Best for: Food contact surfaces
- Icon: Plate/cutting board with checkmark

RIGHT SIDE - SUPERQUAT (Teal):
- Type: QAC (Quaternary)
- Mix: 2-4ml per liter
- Wait: 5 minutes
- Best for: General surfaces
- Icon: Table/floor with checkmark

CENTER MESSAGE:
"ROTATE WEEKLY" / "SHINTSHA MASONTO ONKE"
(Shows calendar with alternating colors)
"Prevents bacteria from adapting!"

Professional infographic, split design, clear comparison.`
  },
  {
    id: 'quick-reference',
    filename: 'infographic-quick-ref.jpg',
    style: 'infographic',
    prompt: `Create a QUICK REFERENCE CARD infographic

Header: "QUICK GUIDE" / "IKHADI LOLWAZI OLUSHESHAYO"

Simple table format with icons:

PRODUCT | MIX | WAIT | USE FOR
--------|-----|------|--------
200SF (red icon) | 0.5-3% | 10 min | Heavy dirt/Grease
CHLORDET (red icon) | 0.6-2% | 15 min | Clean + Disinfect
OXIACID (blue icon) | Tiny! | 5 min | Food surfaces
SUPERQUAT (teal icon) | 2-4ml/L | 5 min | General sanitize

Bottom reminder:
"CLEAN → RINSE → SANITIZE → AIR DRY"
"HLANZA → GEZA → BULALA AMAGCIWANE → YOMISA"

Color-coded by product. Large, easy to read. Laminate-ready design.`
  }
];

async function generateInfographics() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  console.log('🎨 Generating Shopfloor Training Infographics (Bilingual EN/ZU)');
  console.log('=' .repeat(60));

  for (const infographic of infographics) {
    console.log(`\n📊 Generating: ${infographic.id}...`);

    try {
      // Use generateDirect for infographics
      const infographicPrompt = `Create a professional infographic image. Style: Clean, modern, corporate infographic with bold colors, simple icons, and clear visual hierarchy.

${infographic.prompt}

Important: This is for workplace training. Use simple icons, large readable text, and bright contrasting colors. Make it look professional and easy to understand at a glance.`;

      const result = await generator.generateDirect({
        prompt: infographicPrompt,
        outputDir: OUTPUT_DIR,
        filename: infographic.id,
        aspectRatio: '16:9'
      });

      if (result.success && result.imagePath) {
        // Rename to final filename
        const targetPath = path.join(OUTPUT_DIR, infographic.filename);
        try {
          await fs.rename(result.imagePath, targetPath);
          console.log(`   ✅ Saved: ${infographic.filename}`);
        } catch (e) {
          // File might already have correct name
          console.log(`   ✅ Generated: ${result.imagePath}`);
        }
      } else {
        console.log(`   ⚠️ Generation returned: ${result.error || 'unknown error'}`);
      }

      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`   ❌ Failed: ${infographic.id}`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Infographic generation complete!');
}

generateInfographics().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
