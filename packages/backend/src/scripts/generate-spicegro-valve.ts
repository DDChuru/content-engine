/**
 * Generate a single foreground valve disassembly image for Spicegro deck.
 * Cost: $0.039
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { GeminiImageGenerator } from '../services/gemini-image-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

  const gen = new GeminiImageGenerator(apiKey);
  const result = await gen.generateDirect({
    prompt: 'Close-up photograph of a food processing technician in white overalls and blue gloves disassembling a stainless steel valve under a large mixing tank. Hands visible, wrench in hand, gaskets and seals laid out on a clean tray beside them. Industrial food factory setting, bright overhead lighting. Focus on the valve disassembly detail. No text, no labels, no words. Photorealistic, 16:9.',
    outputDir: path.resolve(__dirname, '../remotion/public/images/spicegro'),
    filename: '05b-valve-disassembly-foreground',
    aspectRatio: '16:9',
  });

  console.log(result.success ? `OK: ${result.imagePath}` : `FAIL: ${result.error}`);
  console.log(`Cost: $${result.cost.toFixed(3)}`);
}

main().catch(console.error);
