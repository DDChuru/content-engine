/**
 * Generate TauraiZim Banner Image
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.join(__dirname, '../src/remotion/public/images/tauraizim');

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY not found');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  const prompt = `Create a powerful banner image for "TauraiZim" - Zimbabwe's consumer advocacy movement.

BANNER TEXT TO INCLUDE:
- "TAURAIZIM" as the main text (large, bold)
- "Consumer Voice of Zimbabwe" as tagline underneath

VISUAL ELEMENTS:
- Background: Abstract pattern using Zimbabwe flag colors (Green, Gold, Red, Black)
- Style: Modern protest/movement aesthetic
- Silhouettes of people with raised fists or megaphones in the background
- Urban Zimbabwe cityscape silhouette (Harare skyline) subtle in background
- Sound waves or speech bubble motifs

LAYOUT:
- Wide banner format (will be cropped to 16:9 or 3:1)
- Text should be centered or left-aligned
- Leave some space on the right side where profile picture overlaps on some platforms

STYLE:
- Bold, empowering, activist energy
- Professional but rebellious
- High contrast for readability
- Colors: Primarily green and gold with red and black accents

MOOD: Unity, empowerment, speaking truth to power, Zimbabwean pride

The text "TAURAIZIM" and "Consumer Voice of Zimbabwe" MUST be clearly readable`;

  console.log('\n🎨 Generating TauraiZim Banner Image...\n');

  const result = await generator.generateDirect({
    prompt,
    outputDir: OUTPUT_DIR,
    filename: 'banner',
    aspectRatio: '16:9'
  });

  if (result.success) {
    console.log('✓ Banner saved:', result.imagePath);
    console.log('Cost: $' + result.cost.toFixed(3));
  } else {
    console.log('✗ Failed:', result.error);
  }
}

main().catch(console.error);
