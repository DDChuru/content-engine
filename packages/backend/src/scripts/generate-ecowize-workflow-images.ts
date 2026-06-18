/**
 * Generate Ecowize Workflow Step Images using Gemini
 *
 * Usage: npx tsx src/scripts/generate-ecowize-workflow-images.ts
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
    file: 'wf-01-schedule.jpg',
    prompt: 'A Master Cleaning Schedule displayed on a large wall-mounted whiteboard in a food factory. Rows of cleaning zones with daily/weekly/monthly columns, tick marks, some gaps highlighted in red. Realistic food factory environment, stainless steel surfaces visible in background. Professional industrial photography, warm lighting. No readable text — just visual impression of a structured schedule grid. 16:9.',
  },
  {
    file: 'wf-02-instruction.jpg',
    prompt: 'A Standard Cleaning Instruction document — a laminated A4 sheet pinned to a factory wall next to cleaning equipment. Shows step-by-step procedure layout with numbered steps, chemical dilution diagrams, PPE icons, and warning symbols. Slightly worn from factory use. Stainless steel background, blue cleaning chemicals nearby. Professional close-up photography. No readable text. 16:9.',
  },
  {
    file: 'wf-03-task.jpg',
    prompt: 'A smartphone screen showing a modern mobile app interface for cleaning task management. Dark UI with teal accents. The screen shows a task card with a zone name, timer, camera icon, and start button. Factory environment blurred in background. The phone is held by a gloved hand. Professional product photography style. No readable text. 16:9.',
  },
  {
    file: 'wf-04-qr-scan.jpg',
    prompt: 'A food factory worker in white uniform and hairnet scanning a QR code on a stainless steel wall with a smartphone. The QR code is on a small metal plate next to cleaning equipment. Phone screen shows a green confirmation glow. Clean factory environment, bright industrial lighting. Professional photography. 16:9.',
  },
  {
    file: 'wf-05-checklist.jpg',
    prompt: 'A tablet device showing a digital cleaning checklist interface — rows of items with green checkmarks, one amber warning, photo thumbnails attached to entries. Dashboard-style layout with completion percentage bar at top. Dark UI with teal and green accents. Placed on a stainless steel surface in a factory. Professional product photography. No readable text. 16:9.',
  },
  {
    file: 'wf-06-ncr.jpg',
    prompt: 'A smartphone showing an NCR (Non-Conformance Report) alert screen — red warning banner, photo of a cleaning issue, severity indicator, and action required button. Dark UI with red and amber accents. Urgent notification style. Factory corridor blurred in background. Professional product photography. No readable text. 16:9.',
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

  console.log(`\n🔄 Generating Ecowize Workflow Images\n`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Images: ${IMAGES.length}\n`);

  for (const img of IMAGES) {
    await generateImage(img.prompt, img.file);
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n✅ Done! ${IMAGES.length} workflow images generated.\n`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
