/**
 * Generate Additional Ecowize Module Showcase Images using Gemini
 *
 * New modules: Glass Registers, Customer Complaints, Satisfaction Surveys
 *
 * Usage: npx tsx src/scripts/generate-ecowize-showcase-additional.ts
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

const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/images/ecowize/showcase');

const IMAGES = [
  {
    file: 'mod-09-glass.jpg',
    prompt: 'Web dashboard UI screenshot mockup — glass register and PRP (prerequisite program) management system. Dark theme with teal and amber accents. Shows: glass breakage log entries with location markers, inspection schedule calendar, risk zone map overlay, photo evidence thumbnails, compliance status cards showing green checkmarks. Food safety PRP tracking system. Professional modern SaaS dashboard. No readable text — use placeholder blocks. 16:9 landscape.',
  },
  {
    file: 'mod-10-complaints.jpg',
    prompt: 'Web dashboard UI screenshot mockup — customer complaints tracking system. Dark theme with teal and red accents. Shows: complaint tickets in a timeline view, severity tags (Critical/Major/Minor), root cause analysis section, corrective action cards, resolution status progress bar, escalation indicators. Customer feedback management platform. No readable text — use placeholder blocks. 16:9 landscape.',
  },
  {
    file: 'mod-11-surveys.jpg',
    prompt: 'Web dashboard UI screenshot mockup — customer satisfaction survey platform. Dark theme with teal and green accents. Shows: NPS score gauge widget, satisfaction trend line chart, recent survey responses with star ratings, survey builder preview, automated email campaign status, response rate statistics. Customer feedback analytics dashboard. No readable text — use placeholder blocks. 16:9 landscape.',
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

  console.log(`\n📱 Generating Additional Ecowize Module Showcase Images\n`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Images: ${IMAGES.length}\n`);

  for (const img of IMAGES) {
    await generateImage(img.prompt, img.file);
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n✅ Done! ${IMAGES.length} additional showcase images generated.\n`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
