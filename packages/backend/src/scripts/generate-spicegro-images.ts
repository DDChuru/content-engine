/**
 * Generate background images for the Spicegro Introduction slide deck
 *
 * Uses GeminiImageGenerator.generateDirect() to create 10 images.
 * Estimated cost: 10 × $0.039 = $0.39
 *
 * Usage:
 *   npx ts-node src/scripts/generate-spicegro-images.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { GeminiImageGenerator } from '../services/gemini-image-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/images/spicegro');

const IMAGES = [
  {
    filename: '01-title-gradient',
    prompt:
      'Abstract corporate background with deep navy blue and emerald green gradient. Subtle geometric shapes and light particles. Professional, modern, premium feel. No text, no words, no letters. 16:9 aspect ratio, suitable for video title slide.',
  },
  {
    filename: '02-spice-warehouse',
    prompt:
      'Interior of a large, clean spice warehouse with rows of neatly stacked sacks and containers of colorful spices. Warm industrial lighting. Professional food manufacturing environment. No text, no words. Photorealistic, 16:9.',
  },
  {
    filename: '03-dry-processing',
    prompt:
      'Dry spice processing equipment in a food manufacturing facility — grinders, sifters, conveyors. Clean stainless steel machinery in a dry environment. Industrial, hygienic, well-lit. No text, no labels. Photorealistic, 16:9.',
  },
  {
    filename: '05-equipment-parts',
    prompt:
      'Disassembled stainless steel food processing equipment laid out on a clean surface — gaskets, seals, mixer blades, discharge valves, shaft components. Maintenance workshop setting. No text, no words. Photorealistic, 16:9.',
  },
  {
    filename: '07-spice-powders',
    prompt:
      'Overhead view of vibrant, colorful spice powders arranged in neat bowls or piles — turmeric yellow, paprika red, cumin brown, coriander green, black pepper. Rich saturated colors on a dark background. No text, no labels. Food photography style, 16:9.',
  },
  {
    filename: '10-food-safety-team',
    prompt:
      'Professional food safety team in white coats and hairnets inspecting a food processing facility. Clipboard and torch in hand. Clean, well-lit factory floor. Confident, competent professionals. No text, no logos. Photorealistic, 16:9.',
  },
  {
    filename: '11-saas-dashboard',
    prompt:
      'Modern SaaS dashboard interface displayed on a large monitor in a clean office. Charts, tables, green checkmarks, compliance metrics. Dark UI theme with green accents. Blurred slightly to serve as background. No readable text — abstract UI elements only. 16:9.',
  },
  {
    filename: '12-certification',
    prompt:
      'ISO certification documents and quality management paperwork on a professional desk with a gold seal stamp. Official-looking certificates with blurred text. Warm office lighting. No readable text. Photorealistic, 16:9.',
  },
  {
    filename: '15-partnership-handshake',
    prompt:
      'Two professionals in smart casual attire shaking hands in a modern office with glass walls. Warm natural light. Trust, partnership, collaboration. Corporate setting. No text, no logos. Photorealistic, 16:9.',
  },
  {
    filename: '16-closing-bg',
    prompt:
      'Abstract dark corporate background with emerald green and navy blue flowing gradients. Subtle light effects and bokeh. Premium, clean, minimal. No text. 16:9.',
  },
];

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in .env');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);
  let totalCost = 0;
  let successCount = 0;

  console.log(`Generating ${IMAGES.length} images to ${OUTPUT_DIR}\n`);

  for (const img of IMAGES) {
    console.log(`[${img.filename}] Generating...`);
    const result = await generator.generateDirect({
      prompt: img.prompt,
      outputDir: OUTPUT_DIR,
      filename: img.filename,
      aspectRatio: '16:9',
    });

    if (result.success) {
      console.log(`  ✓ Saved: ${result.imagePath}`);
      successCount++;
    } else {
      console.error(`  ✗ Failed: ${result.error}`);
    }
    totalCost += result.cost;

    // Rate limit delay
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\nDone: ${successCount}/${IMAGES.length} succeeded. Total cost: $${totalCost.toFixed(2)}`);
}

main().catch(console.error);
