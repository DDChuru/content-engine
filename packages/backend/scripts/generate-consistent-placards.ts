/**
 * Generate TauraiZim Placard Images with Consistent Character
 *
 * This script demonstrates the reference image workflow:
 * 1. First generate a character reference image
 * 2. Use that reference for all subsequent placard images
 * 3. Result: Same person holding different placards throughout the video
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.join(__dirname, '../src/remotion/public/images/econet/placards-v2');

// Character description for consistency
const CHARACTER_DESCRIPTION = `A Zimbabwean man in his 30s, average build, with short dark hair.
He has a determined expression and is dressed casually in a plain dark t-shirt.
He represents the everyday Zimbabwean consumer fighting for their rights.
His face is memorable and distinctive - he will be the face of the TauraiZim movement.`;

// Placard scenes - same person, different placards and emotions
const PLACARD_SCENES = [
  {
    filename: 'placard-01-purchase',
    prompt: `The same person holding a large white placard with handwritten text: "I PAID $99 FOR SMARTULTRA - 400GB"

    Expression: Neutral, presenting facts
    Setting: Urban Zimbabwe street, overcast sky
    The text on the placard MUST be clearly readable
    Photorealistic, editorial photography style`
  },
  {
    filename: 'placard-02-speeds',
    prompt: `The same person holding a large white placard with handwritten text: "DOWNLOAD SPEED: 37 Kbps IF LUCKY!"

    Expression: Frustrated, disbelief
    Pose: Shaking head, eyebrows raised
    Setting: Urban Zimbabwe street
    The text on the placard MUST be clearly readable
    Photorealistic style`
  },
  {
    filename: 'placard-03-tried-everything',
    prompt: `The same person holding a large white placard with handwritten text: "PHONE, MiFi, ROUTER - SAME RESULT!"

    Expression: Exhausted, defeated
    Pose: Slumped shoulders
    Setting: Urban Zimbabwe, dramatic lighting
    The text on the placard MUST be clearly readable`
  },
  {
    filename: 'placard-04-support-fail',
    prompt: `The same person holding a large white placard with handwritten text: "SUPPORT SAYS RESOLVED - CAN'T OPEN YOUTUBE!"

    Expression: Angry, incredulous
    Pose: Gesturing with one hand, frustrated
    Setting: Urban Zimbabwe street
    The text on the placard MUST be clearly readable`
  },
  {
    filename: 'placard-05-hung-up',
    prompt: `The same person holding a large white placard with handwritten text: "ASKED FOR COMPLAINTS CHANNEL - THEY HUNG UP!"

    Expression: Outraged, shocked
    Pose: Open mouth, disbelief
    Setting: Urban Zimbabwe, dramatic lighting
    The text on the placard MUST be clearly readable`
  },
  {
    filename: 'placard-06-denied',
    prompt: `The same person holding a large white placard with handwritten text: "REFUND? DENIED! MIGRATE TO WIFI? DENIED!"

    Expression: Frustrated, angry
    Pose: Both hands gripping placard tightly
    Setting: Urban Zimbabwe street
    Red underlines on "DENIED" visible
    The text on the placard MUST be clearly readable`
  },
  {
    filename: 'placard-07-smartbiz',
    prompt: `The same person holding a large white placard with handwritten text: "SMARTBIZ - GIVEN THEN TAKEN WITHOUT WARNING"

    Expression: Disappointed, betrayed
    Pose: Head tilted, questioning
    Setting: Urban Zimbabwe, cloudy sky
    The text on the placard MUST be clearly readable`
  },
  {
    filename: 'placard-08-smart4u',
    prompt: `The same person holding a large white placard with handwritten text: "SMART4U TOP-UP = SCAM WITH ZERO TRANSPARENCY"

    Expression: Accusatory, pointing
    Pose: One finger pointing at camera
    Setting: Urban Zimbabwe street
    The text on the placard MUST be clearly readable`
  },
  {
    filename: 'placard-09-endgame',
    prompt: `The same person holding a large white placard with handwritten text: "WHAT IS YOUR ENDGAME, ECONET?"

    Expression: Demanding answers, intense
    Pose: Leaning forward, confrontational
    Setting: Urban Zimbabwe, dramatic golden hour light
    The text on the placard MUST be clearly readable`
  },
  {
    filename: 'placard-10-miswai',
    prompt: `The same person holding a large white placard with handwritten text: "ECONET ZIM, MISWAI!!"

    Expression: Triumphant, defiant, victorious
    Pose: Raised fist with one hand, holding placard with other
    Setting: Urban Zimbabwe, dramatic lighting, other protesters visible in background
    "MISWAI" should be larger, emphasized
    The text on the placard MUST be clearly readable
    This is the FINALE - maximum energy and defiance`
  }
];

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY not found in environment');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  console.log('\n========================================');
  console.log('TauraiZim Consistent Character Placards');
  console.log('========================================\n');

  console.log('Character:', CHARACTER_DESCRIPTION.substring(0, 80) + '...');
  console.log(`Scenes: ${PLACARD_SCENES.length} placards`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Use the generateConsistentSeries method which handles:
  // 1. Creating character reference
  // 2. Using reference for all subsequent images
  const result = await generator.generateConsistentSeries(
    CHARACTER_DESCRIPTION,
    PLACARD_SCENES,
    OUTPUT_DIR,
    '16:9'
  );

  // Summary
  console.log('\n========================================');
  console.log('GENERATION COMPLETE');
  console.log('========================================');

  if (result.reference.success) {
    console.log(`\n✓ Character Reference: ${result.reference.imagePath}`);
  } else {
    console.log(`\n✗ Character Reference FAILED: ${result.reference.error}`);
  }

  const successCount = result.scenes.filter(s => s.success).length;
  const totalCost = result.reference.cost + result.scenes.reduce((sum, s) => sum + s.cost, 0);

  console.log(`\nScenes: ${successCount}/${PLACARD_SCENES.length} succeeded`);
  console.log(`Total Cost: $${totalCost.toFixed(2)}`);

  console.log('\nGenerated files:');
  result.scenes.forEach((scene, i) => {
    const status = scene.success ? '✓' : '✗';
    const file = scene.imagePath ? path.basename(scene.imagePath) : 'FAILED';
    console.log(`  ${status} ${PLACARD_SCENES[i].filename}: ${file}`);
  });

  console.log('\n========================================\n');
}

main().catch(console.error);
