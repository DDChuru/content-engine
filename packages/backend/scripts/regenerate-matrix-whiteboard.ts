/**
 * Regenerate Chemical Selection Matrix whiteboard with DELUXE 200SF
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

  const content = `A hand-drawn reference table "CHEMICAL SELECTION MATRIX"

TABLE 1 - SOIL TYPE → DETERGENT:
| Heavy grease/fat | → | DELUXE 200SF (Alkaline) |
| Protein buildup | → | DELUXE 200SF (Alkaline) |
| Mineral scale | → | Foamacid (Acid) |
| Light soil + disinfect | → | Chlordet |

TABLE 2 - SURFACE → SANITIZER:
| Food contact (daily) | Oxiacid or Superquat |
| Post-deep clean | Rotate between both |
| Drains | Concentrated application |

Draw this as a neat whiteboard diagram with blue marker on white background. Use clear tables with boxes around each cell. Title at top in large letters.`;

  console.log('🎨 Regenerating Chemical Selection Matrix whiteboard...');
  console.log('📝 Replacing "Special" with "DELUXE 200SF"');

  const result = await generator.generateWhiteboard({
    content,
    style: 'whiteboard',
    handwritingStyle: 'neat-teacher',
    inkColor: 'blue',
    outputDir: OUTPUT_DIR,
    aspectRatio: '16:9'
  });

  // Rename output file to wb-chemical-matrix.jpg
  const targetPath = path.join(OUTPUT_DIR, 'wb-chemical-matrix.jpg');
  await fs.rename(result.path, targetPath);

  console.log('✅ Saved:', targetPath);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
