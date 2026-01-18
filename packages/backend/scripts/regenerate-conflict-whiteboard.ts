/**
 * Regenerate Detergent-Sanitizer Conflict whiteboard with DELUXE 200SF
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = '/home/dachu/Documents/projects/content-engine/projects/professional/food-safety/output/chemicals/images';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  const content = `WHY RINSE MATTERS - The Detergent-Sanitizer Conflict

SCENARIO showing 3 steps with sad outcome:

1. DELUXE 200SF (pH 11-13) applied ✓
   [Drawing: Bottle labeled "DELUXE 200SF" pouring blue liquid onto surface]
   (pH 11-13)

2. Quick rinse - residue remains (pH ~10) ⚠
   [Drawing: Hose spraying water but leaving residue behind]
   (pH ~10)

3. Oxiacid applied but... NEUTRALIZED! ✗
   [Drawing: Bottle labeled "Oxiacid Sanitizer" with puff of smoke, red X]
   NEUTRALIZED!
   [pH meter showing neutralization]

RESULT (in red):
- Alkaline residue NEUTRALIZES the sanitizer
- Concentration drops below effective level
- Surface NOT sanitized
- Bacteria survive!

YOU JUST WASTED: Detergent + Sanitizer + Time + Food Safety

Draw this as a professional whiteboard diagram with blue and red markers on white background. Use clear illustrations showing the 3-step process across the top. Title should be prominent at the top.`;

  console.log('🎨 Regenerating Detergent-Sanitizer Conflict whiteboard...');
  console.log('📝 Replacing "Special" with "DELUXE 200SF"');

  const result = await generator.generateWhiteboard({
    content,
    style: 'whiteboard',
    handwritingStyle: 'neat-teacher',
    inkColor: 'blue',
    outputDir: OUTPUT_DIR,
    aspectRatio: '16:9'
  });

  // Find the generated file and rename it
  const files = await fs.readdir(OUTPUT_DIR);
  const latestWhiteboard = files
    .filter(f => f.startsWith('whiteboard_') && f.endsWith('.jpg'))
    .sort()
    .pop();

  if (latestWhiteboard) {
    const sourcePath = path.join(OUTPUT_DIR, latestWhiteboard);
    const targetPath = path.join(OUTPUT_DIR, 'wb-detergent-sanitizer-conflict.jpg');
    await fs.rename(sourcePath, targetPath);
    console.log('✅ Saved:', targetPath);
  } else {
    console.log('⚠️ Could not find generated whiteboard file');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
