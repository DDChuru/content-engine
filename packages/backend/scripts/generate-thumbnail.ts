/**
 * Generate TauraiZim Video Thumbnail
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

  const prompt = `Create a dramatic, click-worthy YouTube/TikTok thumbnail for a consumer complaint video about Econet Zimbabwe.

MUST INCLUDE TEXT:
- "ECONET" with a red X or strikethrough
- "$99 SCAM?" or "MISWAI!" in bold angry text

VISUAL ELEMENTS:
- Angry/shocked African man's face (expressive, looking at camera)
- Red angry emoji or shocked face emoji style expression
- Broken WiFi symbol or slow internet icon
- Money ($99) being thrown away or burning
- Zimbabwe flag colors accent

STYLE:
- Dramatic YouTube thumbnail style
- High contrast, saturated colors
- Red and yellow warning colors
- Angry/outraged energy
- Text should POP and be readable at small size

COMPOSITION:
- Face on left or center
- Big bold text on right
- Dark/dramatic background
- Red glow or highlights for drama

MOOD: Outrage, exposé, "you won't believe this", viral energy

This is a consumer advocacy video exposing bad service. Make it look like a must-watch exposé.`;

  console.log('\n🎬 Generating Video Thumbnail...\n');

  const result = await generator.generateDirect({
    prompt,
    outputDir: OUTPUT_DIR,
    filename: 'video-thumbnail',
    aspectRatio: '16:9'
  });

  if (result.success) {
    console.log('✓ Thumbnail saved:', result.imagePath);
    console.log('Cost: $' + result.cost.toFixed(3));
  } else {
    console.log('✗ Failed:', result.error);
  }
}

main().catch(console.error);
