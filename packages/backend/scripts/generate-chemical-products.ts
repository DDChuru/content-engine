/**
 * Generate product label images for Farmwise chemicals
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.resolve(__dirname, '../../..', 'projects/professional/food-safety/output/chemicals/images');

const chemicals = [
  {
    filename: 'product-special',
    prompt: `Create a professional product image of an industrial cleaning chemical bottle/container.

PRODUCT: "SPECIAL" - Alkaline Detergent
- Large white/light blue industrial container (5-25L size)
- Professional label design with "SPECIAL" prominently displayed
- "ALKALINE DETERGENT" subtitle
- pH 12-13 indicator
- Sodium Hypochlorite 5% active ingredient text
- Contact time: 15 min shown
- Dilution: 2-3%
- Industrial/professional appearance
- Clean white background for presentation use

Style: Product photography, clean, professional, industrial chemical container
Aspect: 1:1 square`
  },
  {
    filename: 'product-foamacid',
    prompt: `Create a professional product image of an industrial cleaning chemical bottle/container.

PRODUCT: "FOAMACID" - Acid Detergent
- Industrial container in red/orange safety colors
- Professional label with "FOAMACID" prominently displayed
- "ACID DETERGENT" subtitle
- pH ≤1.0 warning indicator
- Sulphuric Acid 18% - CORROSIVE warning
- Contact time: 5 min
- Dilution: 5%
- Hazard symbols visible
- Industrial/professional appearance
- Clean white background

Style: Product photography, clean, professional, industrial chemical container
Aspect: 1:1 square`
  },
  {
    filename: 'product-chlordet',
    prompt: `Create a professional product image of an industrial cleaning chemical bottle/container.

PRODUCT: "CHLORDET" - Detergent-Disinfectant
- Industrial container in green/teal colors (disinfectant theme)
- Professional label with "CHLORDET" prominently displayed
- "DETERGENT-DISINFECTANT" subtitle
- pH 7.0-8.0 (neutral)
- Benzalkonium Chloride 5% active
- Contact time: 15 min
- Dilution: 0.2-6%
- Food-safe indicator
- Clean white background

Style: Product photography, clean, professional, industrial chemical container
Aspect: 1:1 square`
  },
  {
    filename: 'product-oxiacid',
    prompt: `Create a professional product image of an industrial cleaning chemical bottle/container.

PRODUCT: "OXIACID" - Sanitizer
- Industrial container in blue/purple colors (sanitizer theme)
- Professional label with "OXIACID" prominently displayed
- "SANITIZER" subtitle
- pH 6.5-7.5 (food-safe)
- QAC/ADBAC active ingredient
- Contact time: 5 min
- Dilution: 2000-4000 ppm
- Food contact surface approved badge
- Clean white background

Style: Product photography, clean, professional, industrial chemical container
Aspect: 1:1 square`
  },
  {
    filename: 'product-superquat',
    prompt: `Create a professional product image of an industrial cleaning chemical bottle/container.

PRODUCT: "SUPERQUAT" - Sanitizer
- Industrial container in purple/violet colors
- Professional label with "SUPERQUAT" prominently displayed
- "SANITIZER" subtitle
- QAC-based formula
- Contact time: 5 min
- Dilution: 2000-4000 ppm
- Concentrated formula indicator
- Food contact approved
- Clean white background

Style: Product photography, clean, professional, industrial chemical container
Aspect: 1:1 square`
  }
];

async function main() {
  const apiKey = process.env.NANO_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: API key required');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);
  let totalCost = 0;

  console.log('\n🧪 CHEMICAL PRODUCT IMAGES\n');

  for (const chem of chemicals) {
    console.log(`Generating: ${chem.filename}...`);
    const result = await generator.generateDirect({
      prompt: chem.prompt,
      outputDir: OUTPUT_DIR,
      filename: chem.filename,
      aspectRatio: '1:1'
    });

    if (result.success) {
      console.log(`  ✓ ${result.imagePath}`);
      totalCost += result.cost;
    } else {
      console.log(`  ✗ ${result.error}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\nTotal: 5 images, $${totalCost.toFixed(2)}`);
}

main().catch(console.error);
