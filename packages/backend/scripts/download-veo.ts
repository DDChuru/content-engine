import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const VIDEO_URL = 'https://generativelanguage.googleapis.com/v1beta/files/mhpun8mt8ul2:download?alt=media';
const OUTPUT_DIR = path.resolve(process.cwd(), '../../projects/tiktok/makwinji-soma-phiri/output/clips');

async function main() {
  console.log('📥 Downloading Veo video...');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Need API key for download
  const apiKey = process.env.GEMINI_API_KEY;
  const response = await fetch(`${VIDEO_URL}&key=${apiKey}`);

  if (!response.ok) {
    console.error('❌ Download failed:', response.status, response.statusText);
    const text = await response.text();
    console.error(text);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(OUTPUT_DIR, 'scene_01_kwinji15-intro.mp4');
  await fs.writeFile(outputPath, buffer);

  console.log(`✅ Video saved: ${outputPath}`);
  console.log(`   Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
