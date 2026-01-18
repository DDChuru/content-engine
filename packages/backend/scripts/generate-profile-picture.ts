/**
 * Generate TauraiZim Profile Picture
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

  const prompt = `Create a bold, striking profile picture logo for "TauraiZim" - a consumer advocacy brand for Zimbabwe.

CONCEPT: A stylized megaphone or speech bubble combined with Zimbabwe national colors

DESIGN ELEMENTS:
- Central icon: Bold megaphone OR raised fist holding a megaphone OR speech bubble with sound waves
- Colors: Zimbabwe flag colors - Green, Gold/Yellow, Red, Black
- Style: Modern, bold, minimalist logo design
- The word "TAURAI" or "TZ" can be subtly incorporated

REQUIREMENTS:
- Must work as a small profile picture (circular crop friendly)
- High contrast, bold shapes
- Professional but rebellious/activist energy
- Clean edges, no gradients that get muddy at small sizes
- Iconic and memorable at a glance

MOOD: Empowering, bold, speaks truth to power, African pride

DO NOT include: Realistic faces, photographs, complex details that get lost at small sizes`;

  console.log('\n🎨 Generating TauraiZim Profile Picture...\n');

  const result = await generator.generateDirect({
    prompt,
    outputDir: OUTPUT_DIR,
    filename: 'profile-picture',
    aspectRatio: '1:1'
  });

  if (result.success) {
    console.log('✓ Profile picture saved:', result.imagePath);
    console.log('Cost: $' + result.cost.toFixed(3));
  } else {
    console.log('✗ Failed:', result.error);
  }
}

main().catch(console.error);
