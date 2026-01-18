import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = '/home/dachu/Documents/projects/angular/ncr_audit_app/src/assets/training/shopfloor-training/images';

async function retryThreeSteps() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  console.log('🔄 Retrying: three-steps infographic...\n');

  const prompt = `Create a professional infographic image. Style: Clean, modern, corporate infographic with bold colors, simple icons, and clear visual hierarchy.

Create a bright, colorful infographic showing "THE 3 STEPS OF CLEANING" (Izinyathelo Ezi-3 Zokuhlanza)

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

Make it simple, bold icons with large text. Professional infographic style with numbered circles 1-2-3. Arrows flowing between steps.

Important: This is for workplace training. Use simple icons, large readable text, and bright contrasting colors. Make it look professional and easy to understand at a glance.`;

  try {
    const result = await generator.generateDirect({
      prompt,
      outputDir: OUTPUT_DIR,
      filename: 'infographic-three-steps',
      aspectRatio: '16:9'
    });

    if (result.success && result.imagePath) {
      console.log(`✅ Generated: ${result.imagePath}`);
    } else {
      console.log(`❌ Failed: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

retryThreeSteps();
