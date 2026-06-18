/**
 * Generate Ecowize Module Showcase Images using Gemini
 *
 * These are UI mockup screenshots showing capability — not actual client systems
 *
 * Usage: npx tsx src/scripts/generate-ecowize-showcase-images.ts
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
    file: 'mod-01-cleaning.jpg',
    prompt: 'Mobile app UI screenshot mockup — cleaning verification task screen. Dark theme with teal accents. Shows: zone name at top, photo capture button, checklist items with checkboxes, timer display, submit button. Modern Material Design style. Professional app screenshot. No readable text — use placeholder blocks. 9:16 portrait orientation.',
  },
  {
    file: 'mod-02-ncr.jpg',
    prompt: 'Web dashboard UI screenshot mockup — NCR management system. Dark theme with teal and red accents. Shows: kanban-style columns (Open, In Progress, Resolved), NCR cards with severity badges (red/amber/green), filter toolbar, statistics bar at top. Modern SaaS dashboard. No readable text — use placeholder blocks. 16:9.',
  },
  {
    file: 'mod-03-audit.jpg',
    prompt: 'Tablet app UI screenshot mockup — internal audit checklist. Dark theme with teal accents. Shows: audit header with site name, scored sections with percentage bars, expandable question groups, photo attachment icons, digital signature area at bottom. Professional audit app. No readable text — use placeholder blocks. 4:3.',
  },
  {
    file: 'mod-04-dashboard.jpg',
    prompt: 'Web dashboard UI screenshot mockup — multi-site compliance overview. Dark theme with teal and amber accents. Shows: world map with site markers, compliance score cards per region, trend line charts, NCR count widgets, recent activity feed. Executive dashboard style. No readable text — use placeholder blocks. 16:9.',
  },
  {
    file: 'mod-05-qr.jpg',
    prompt: 'Mobile app UI screenshot mockup — QR code scanning screen. Dark theme with teal glow. Shows: camera viewfinder with QR code overlay, zone info card below, GPS coordinates indicator, timestamp, user avatar. Proof of presence verification app. No readable text — use placeholder blocks. 9:16 portrait.',
  },
  {
    file: 'mod-06-training.jpg',
    prompt: 'Web platform UI screenshot mockup — online training module. Dark theme with teal accents. Shows: video player area, progress bar, module navigation sidebar, quiz section below video, completion certificate preview. E-learning platform style. No readable text — use placeholder blocks. 16:9.',
  },
  {
    file: 'mod-07-docs.jpg',
    prompt: 'Web dashboard UI screenshot mockup — document control system. Dark theme with teal accents. Shows: folder tree sidebar, document list with version numbers and approval status badges, search bar, upload button, revision history panel. Document management system. No readable text — use placeholder blocks. 16:9.',
  },
  {
    file: 'mod-08-assets.jpg',
    prompt: 'Web dashboard UI screenshot mockup — asset register and tracking. Dark theme with teal and amber accents. Shows: equipment cards with photos, status indicators (In Use, Repair, Available), location history timeline, maintenance schedule calendar, QR code assignment. Asset management system. No readable text — use placeholder blocks. 16:9.',
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

  console.log(`\n📱 Generating Ecowize Module Showcase Images\n`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Images: ${IMAGES.length}\n`);

  for (const img of IMAGES) {
    await generateImage(img.prompt, img.file);
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n✅ Done! ${IMAGES.length} showcase images generated.\n`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
