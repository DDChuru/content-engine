/**
 * Generate 3 missing food images for the Biology Food Tests TikTok video.
 * Cost: ~$0.12 (3 × $0.039)
 */
import { GeminiImageGenerator } from '../services/gemini-image-generator';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function main() {
  const gen = new GeminiImageGenerator(process.env.GEMINI_API_KEY!);
  const outDir = path.resolve(__dirname, '../remotion/public/images/biology/food-tests');

  const images = [
    {
      name: 'iodine-food',
      prompt: 'Close-up DSLR photograph of starchy foods arranged for a biology experiment: a halved potato showing white starchy interior, a torn bread roll, and a neat pile of uncooked rice grains. Items arranged on a dark slate laboratory bench surface with dramatic warm side-lighting from the left. Shallow depth of field, bokeh background. Clean, clinical, educational style. Absolutely no text, labels, or watermarks.',
    },
    {
      name: 'emulsion-food',
      prompt: 'Close-up DSLR photograph of fatty foods arranged for a biology experiment: a small glass beaker half-filled with golden olive oil catching the light, a cube of yellow butter on wax paper, and a handful of whole peanuts. Items arranged on a dark slate laboratory bench surface with dramatic warm side-lighting from the left. Shallow depth of field, bokeh background. Clean, clinical, educational style. Absolutely no text, labels, or watermarks.',
    },
    {
      name: 'biuret-food',
      prompt: 'Close-up DSLR photograph of protein-rich foods arranged for a biology experiment: a cracked raw egg with yolk and white visible in a small glass petri dish, a beaker of white milk, and a small cube of cooked chicken breast. Items arranged on a dark slate laboratory bench surface with dramatic warm side-lighting from the left. Shallow depth of field, bokeh background. Clean, clinical, educational style. Absolutely no text, labels, or watermarks.',
    },
  ];

  for (const img of images) {
    console.log(`Generating ${img.name}...`);
    const result = await gen.generateDirect({
      prompt: img.prompt,
      aspectRatio: '9:16',
      outputDir: outDir,
      filename: img.name,
    });
    if (result.success) {
      console.log(`  ✓ ${img.name} → ${result.imagePath}`);
    } else {
      console.error(`  ✗ ${img.name}: ${result.error}`);
    }
  }
  console.log('\nDone! Cost: ~$0.12 (3 × $0.039)');
}

main().catch(console.error);
