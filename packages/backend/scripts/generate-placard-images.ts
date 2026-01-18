/**
 * Generate Placard Protest Images for Econet Consumer Complaint
 * Each image shows a person holding a placard with a different message
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.join(__dirname, '../src/remotion/public/images/econet/placards');

interface PlacardImage {
  name: string;
  filename: string;
  placardText: string;
  emotion: string;
  additionalContext: string;
}

const placardImages: PlacardImage[] = [
  {
    name: 'Slide 1 - The Purchase',
    filename: 'placard-01-purchase',
    placardText: 'I PAID US$99 FOR SMARTULTRA 400GB DATA FROM ECONET',
    emotion: 'hopeful but cautious',
    additionalContext: 'Person looking at camera with slight hope, holding receipt or phone showing purchase'
  },
  {
    name: 'Slide 2 - Disappointing Speeds',
    filename: 'placard-02-speeds',
    placardText: 'DOWNLOAD SPEED: 37 Kbps (IF I AM LUCKY!)',
    emotion: 'frustrated and disappointed',
    additionalContext: 'Person showing frustration, maybe looking at a loading screen on phone'
  },
  {
    name: 'Slide 3 - Tried Everything',
    filename: 'placard-03-tried-everything',
    placardText: 'TRIED PHONE, MIFI, ROUTER - SAME DISAPPOINTING RESULTS',
    emotion: 'exhausted and bewildered',
    additionalContext: 'Person surrounded by different devices, all showing poor connection'
  },
  {
    name: 'Slide 4 - Customer Support Fail',
    filename: 'placard-04-support-fail',
    placardText: 'SUPPORT SAYS "RESOLVED" - STILL CAN\'T OPEN YOUTUBE!',
    emotion: 'angry and incredulous',
    additionalContext: 'Person on phone looking frustrated, showing YouTube buffering'
  },
  {
    name: 'Slide 5 - Hung Up On',
    filename: 'placard-05-hung-up',
    placardText: 'ASKED FOR COMPLAINTS CHANNEL - THEY HUNG UP ON ME!',
    emotion: 'shocked and hurt',
    additionalContext: 'Person staring at phone in disbelief, call ended screen'
  },
  {
    name: 'Slide 6 - Refund Denied',
    filename: 'placard-06-denied',
    placardText: 'REFUND? DENIED! MIGRATE TO PRIVATE WIFI? DENIED!',
    emotion: 'angry and defiant',
    additionalContext: 'Person holding up hands showing "stop" or denial gestures'
  },
  {
    name: 'Slide 7 - Smart Biz Memory',
    filename: 'placard-07-smartbiz',
    placardText: 'REMEMBER SMART BIZ? GAVE IT, THEN TOOK IT AWAY!',
    emotion: 'knowing and accusatory',
    additionalContext: 'Person pointing at camera, reminding of past betrayal'
  },
  {
    name: 'Slide 8 - Smart4U Scam',
    filename: 'placard-08-smart4u',
    placardText: 'SMART FOR YOU TOP-UP? ANOTHER SCAM!',
    emotion: 'fed up and calling out',
    additionalContext: 'Person shaking head, counting issues on fingers'
  },
  {
    name: 'Slide 9 - The Question',
    filename: 'placard-09-endgame',
    placardText: 'WHAT IS YOUR ENDGAME, ECONET?',
    emotion: 'emotional, tears, demanding answers',
    additionalContext: 'Person emotional, maybe wiping tear, demanding accountability'
  }
];

function buildPrompt(placard: PlacardImage): string {
  return `Create a powerful, emotional protest-style image for a consumer rights video.

SCENE: A Zimbabwean person holding a large white placard/sign at a protest or in front of a building.

THE PLACARD MUST CLEARLY SHOW THIS TEXT:
"${placard.placardText}"

IMPORTANT TEXT REQUIREMENTS:
- The text on the placard must be CLEARLY READABLE
- Use bold, black handwritten-style text on white placard
- Text should be the focal point of the image
- Make sure ALL words are spelled correctly and fully visible

PERSON & EMOTION:
- African person (can be man or woman, 25-40 years old)
- Expression: ${placard.emotion}
- ${placard.additionalContext}
- Dressed casually but respectably
- Should feel relatable and authentic

STYLE:
- Photorealistic, editorial photography style
- Dramatic lighting - slightly overcast or golden hour
- Urban African setting (could be outside corporate building or street)
- Shallow depth of field focusing on person and placard
- Professional protest photography aesthetic
- Colors: Muted background, placard and person pop

MOOD: This is a real consumer telling their story. It should feel authentic, emotional, and powerful.

DO NOT include any company logos. The placard text is the star.`;
}

async function generateImages() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY not found in environment');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  console.log('=== Generating Placard Protest Images ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);
  console.log('This will generate 9 images of a consumer holding placards.\n');

  const results: { name: string; success: boolean; path?: string; error?: string }[] = [];
  let totalCost = 0;

  for (let i = 0; i < placardImages.length; i++) {
    const placard = placardImages[i];
    console.log(`\n[${i + 1}/${placardImages.length}] ${placard.name}`);
    console.log(`  Placard: "${placard.placardText}"`);

    try {
      const prompt = buildPrompt(placard);

      const result = await generator.generateDirect({
        prompt,
        outputDir: OUTPUT_DIR,
        filename: placard.filename,
        aspectRatio: '16:9'
      });

      if (result.success) {
        console.log(`  ✓ Success: ${result.imagePath}`);
        results.push({ name: placard.name, success: true, path: result.imagePath });
        totalCost += result.cost;
      } else {
        console.log(`  ✗ Failed: ${result.error}`);
        results.push({ name: placard.name, success: false, error: result.error });
      }

      // Delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error: any) {
      console.log(`  ✗ Error: ${error.message}`);
      results.push({ name: placard.name, success: false, error: error.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('=== Generation Complete ===\n');
  console.log('Results:');
  results.forEach((r, i) => {
    if (r.success) {
      console.log(`  ✓ ${i + 1}. ${r.name}`);
    } else {
      console.log(`  ✗ ${i + 1}. ${r.name}: ${r.error}`);
    }
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\nTotal: ${successCount}/${placardImages.length} images generated`);
  console.log(`Cost: $${totalCost.toFixed(3)}`);

  if (successCount === placardImages.length) {
    console.log('\n✓ All placard images generated successfully!');
    console.log('\nNext step: Run the video composition script');
  } else if (successCount > 0) {
    console.log('\n⚠ Some images failed. You may want to re-run for failed ones.');
  }
}

generateImages().catch(console.error);
