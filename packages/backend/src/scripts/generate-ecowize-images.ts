/**
 * Generate Ecowize Pitch Images using Gemini
 *
 * Usage: npx tsx src/scripts/generate-ecowize-images.ts
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
    file: '01-title.jpg',
    prompt: 'Professional corporate presentation title slide background. Industrial food factory at night with dramatic lighting, deep navy blue and teal color grading. Clean geometric lines. No text. 16:9 aspect ratio. Premium corporate photography style.',
  },
  {
    file: '02-factory-floor.jpg',
    prompt: 'Wide shot of a modern food manufacturing facility floor — stainless steel equipment, clean white tiles, workers in white coats and hairnets. Professional food industry photography, warm industrial lighting. No text. 16:9.',
  },
  {
    file: '04-risk-exposure.jpg',
    prompt: 'Conceptual business image representing risk and brand protection. Shield icon overlaid on food factory background. Corporate teal and navy color grading. Abstract corporate risk visualization. No text. 16:9.',
  },
  {
    file: '05-accountability-chain.jpg',
    prompt: 'Corporate hierarchy visualization — a chain of command flowing from factory floor upward to executive boardroom. Professional people at different levels of management. Split-screen effect showing factory worker and executive. Teal and navy tones. No text. 16:9.',
  },
  {
    file: '06-visibility-gap.jpg',
    prompt: 'Conceptual image: a control room with multiple screens showing dashboards, but some screens are dark/blank — representing gaps in visibility. Modern data center aesthetic. Teal glow on screens. No text. 16:9.',
  },
  {
    file: '07-platform-overview.jpg',
    prompt: 'Modern mobile app and web dashboard displayed on devices — phone, tablet, laptop — showing cleaning verification interface. Dark UI with teal accents. Food factory blurred in background. No text on devices readable. 16:9.',
  },
  {
    file: '08-cleaning-verification.jpg',
    prompt: 'Close-up of a professional cleaner scanning a QR code on a food factory wall with a smartphone. Stainless steel surfaces, blue cleaning chemicals, white uniform. Professional industrial cleaning documentation. No text. 16:9.',
  },
  {
    file: '09-ncr-management.jpg',
    prompt: 'Digital workflow visualization showing a non-conformance report flowing through stages — red warning to amber review to green resolution. Modern flat UI cards floating in space. Corporate dark background with teal accents. No text. 16:9.',
  },
  {
    file: '10-internal-audit.jpg',
    prompt: 'Professional food safety auditor with tablet device inspecting a food production line. Clipboard elements floating digitally. Stainless steel environment, white coat, hairnet. Modern audit process photo. No text. 16:9.',
  },
  {
    file: '11-haccp-admin.jpg',
    prompt: 'Web dashboard interface showing HACCP management system — flow diagrams, hazard analysis tables, document control panels. Dark UI with teal and amber accents. Modern SaaS platform aesthetic. No text readable. 16:9.',
  },
  {
    file: '12-command-centre.jpg',
    prompt: 'Corporate command centre with a large wall display showing multiple site locations on a world map — South Africa, Namibia, Australia, New Zealand, USA highlighted. Real-time dashboards on side screens. Dark room with teal ambient glow. No text. 16:9.',
  },
  {
    file: '16-partnership.jpg',
    prompt: 'Two business professionals shaking hands in front of a food factory. One in corporate suit, one in factory management attire. Warm confident lighting. Partnership and trust. Teal and navy color grade. No text. 16:9.',
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

  console.log(`\n🏭 Generating Ecowize Pitch Images\n`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Images: ${IMAGES.length}\n`);

  for (const img of IMAGES) {
    await generateImage(img.prompt, img.file);
    // Small delay between requests
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n✅ Done! ${IMAGES.length} images generated.\n`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
