/**
 * Generate Ecowize Pain Point Images using Gemini
 *
 * Usage: npx tsx src/scripts/generate-ecowize-painpoint-images.ts
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/images/ecowize');

const IMAGES = [
  {
    file: 'pain-01-reality.jpg',
    prompt: 'Dramatic wide shot of a food factory floor at night — emergency lights on, a clipboard abandoned on a stainless steel table, cleaning equipment visible. Moody, tense atmosphere suggesting scrutiny and accountability. Deep shadows, industrial setting. No people. Cinematic photography, navy and amber tones. No text. 16:9.',
  },
  {
    file: 'pain-02-consequences.jpg',
    prompt: 'Conceptual image representing food safety crisis — a supermarket shelf with products being removed, yellow caution tape, empty spaces where products were. Suggesting a product recall. Dramatic lighting, sense of urgency and loss. Corporate photography style. No text. 16:9.',
  },
  {
    file: 'pain-03-audit.jpg',
    prompt: 'Food safety auditor in professional attire examining records in a factory office — tablet in hand, looking at a wall of filing cabinets and paperwork. Expression of scrutiny and evaluation. Clean industrial office setting. Professional photography. No text. 16:9.',
  },
  {
    file: 'pain-04-system.jpg',
    prompt: 'Modern command centre dashboard on multiple screens showing real-time compliance data — green indicators, trend graphs, site maps with status markers. Dark room with teal glow from screens. Futuristic but professional. Represents proactive monitoring. No text visible. 16:9.',
  },
];

async function generateImage(prompt: string, filename: string): Promise<void> {
  const outPath = path.join(OUTPUT_DIR, filename);

  if (fs.existsSync(outPath)) {
    console.log(`  ⏭  ${filename} — already exists, skipping`);
    return;
  }

  console.log(`  🎨 Generating ${filename}...`);

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: prompt,
  });

  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part: any) => part.inlineData,
  );

  if (imagePart?.inlineData?.data) {
    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    fs.writeFileSync(outPath, imageBuffer);
    console.log(`  ✅ ${filename} (${(imageBuffer.length / 1024).toFixed(0)}KB)`);
  } else {
    console.log(`  ❌ ${filename} — no image returned`);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`\n⚠️  Generating Ecowize Pain Point Images\n`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Images: ${IMAGES.length}\n`);

  for (const img of IMAGES) {
    await generateImage(img.prompt, img.file);
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n✅ Done! ${IMAGES.length} pain point images generated.\n`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
