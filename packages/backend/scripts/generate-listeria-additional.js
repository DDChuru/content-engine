/**
 * Additional Listeria Training Infographics
 * - Foot & Wheeled Traffic
 * - Skirtings & Wall-Floor Junctions
 */

import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.resolve(__dirname, '../../../projects/professional/food-safety/output/farmwise-listeria-training/images');

const additionalInfographics = {
  'foot-wheeled-traffic': {
    title: 'Foot & Wheeled Traffic Control',
    prompt: `Create a professional training infographic titled "FOOT & WHEELED TRAFFIC SPREADS LISTERIA"

Show how contamination travels through the facility via traffic:

SECTION 1: THE PROBLEM (Top)
- Show footprints and wheel tracks creating contamination trails
- Path from dirty area (drains, outside, raw zone) INTO clean production areas
- Visual of bacteria hitching a ride on shoes and wheels
- "One step in drain water = 100 steps of contamination"

SECTION 2: FOOT TRAFFIC CONTROLS (Left side)
- Footbaths/sanitizing stations at zone entries
- Boot/shoe changes between zones
- Dedicated footwear for high-risk areas
- "Stay in your zone!" messaging
- Show colour-coded zones (red/yellow/green)

SECTION 3: WHEELED TRAFFIC CONTROLS (Right side)
- Forklifts, pallet jacks, trolleys, bins on wheels
- Wheel wash stations
- Dedicated equipment per zone (colour coded)
- "Wheels from outside NEVER enter production"
- Clean wheels before crossing zones

SECTION 4: KEY RULES (Bottom)
- Never walk through drains or standing water
- Clean wheels before entering clean zones
- Respect zone boundaries
- Report damaged wheel wash stations

Style:
- Industrial food processing facility context
- Show floor plan with zones and traffic flow
- Red arrows for contamination spread
- Green checkmarks for correct practices
- Warning/prohibition style for wrong practices
- Professional food safety training look`
  },

  'skirtings-wall-floor': {
    title: 'Skirtings & Wall-Floor Junctions',
    prompt: `Create a professional training infographic titled "SKIRTINGS: LISTERIA'S FAVOURITE HIDEOUT"

Focus on wall-floor junctions and skirting areas as critical Listeria harbourage points:

SECTION 1: WHY SKIRTINGS ARE HIGH RISK (Top)
- Cross-section diagram showing wall-floor junction
- Show where moisture collects
- Show biofilm building up in corners and gaps
- "Where wall meets floor = Where Listeria thrives"
- Gaps, cracks, damaged sealant = bacteria hideouts

SECTION 2: PROBLEM AREAS TO CHECK (Middle - visual examples)
- Damaged or lifting coving/skirtings
- Gaps between skirting and floor
- Cracked sealant at wall-floor junction
- Chipped tiles at edges
- Standing water pooling at base of walls
- Rust stains indicating hidden moisture

SECTION 3: CLEANING PROTOCOL FOR SKIRTINGS (Bottom left)
- Dedicated skirting brush (angled)
- Scrub INTO the junction, not along it
- Pay attention to corners
- Check behind equipment against walls
- Include in EVERY deep clean

SECTION 4: WHAT TO REPORT (Bottom right)
- Damaged or missing skirtings
- Gaps or cracks in sealant
- Lifting coving
- Persistent moisture at wall base
- Discolouration or staining
- "If you can fit a knife blade in the gap, Listeria can live there"

Style:
- Close-up detail views of wall-floor junctions
- Before/after or problem/solution format
- Industrial vegetable processing facility context
- Technical but accessible for cleaners
- Red highlights on problem areas
- Blue/green for correct cleaning technique
- Professional food safety infographic style`
  }
};

class InfographicGenerator {
  constructor(apiKey) {
    this.genAI = new GoogleGenAI({ apiKey });
    this.costPerImage = 0.039;
  }

  async generate(name, config) {
    try {
      console.log(`\n[Generating] ${config.title}...`);

      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: config.prompt,
        config: {
          imageConfig: {
            aspectRatio: '4:3',
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in response');
      }

      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      const extension = mimeType.includes('jpeg') ? 'jpg' : 'png';

      await fs.mkdir(OUTPUT_DIR, { recursive: true });
      const filepath = path.join(OUTPUT_DIR, `${name}.${extension}`);
      await fs.writeFile(filepath, imageBuffer);

      console.log(`[✓] Saved: ${filepath}`);
      return { success: true, path: filepath, cost: this.costPerImage, title: config.title };

    } catch (error) {
      console.error(`[✗] Error generating ${name}:`, error.message);
      return { success: false, error: error.message, cost: 0, title: config.title };
    }
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('ADDITIONAL LISTERIA INFOGRAPHICS');
  console.log('═'.repeat(60));

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('\nERROR: GEMINI_API_KEY not found');
    process.exit(1);
  }

  const generator = new InfographicGenerator(apiKey);
  const results = [];
  let totalCost = 0;

  for (const [name, config] of Object.entries(additionalInfographics)) {
    const result = await generator.generate(name, config);
    results.push({ name, ...result });
    totalCost += result.cost;
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('COMPLETE');
  console.log('═'.repeat(60));

  const successful = results.filter(r => r.success);
  successful.forEach(r => console.log(`  ✓ ${r.title}`));

  console.log(`\nAdditional cost: $${totalCost.toFixed(3)}`);
}

main().catch(console.error);
