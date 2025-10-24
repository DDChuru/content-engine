import 'dotenv/config';
import { VeoVideoGenerator } from './src/services/tiktok/veo-video-generator.js';
import { promises as fs } from 'fs';
import path from 'path';

async function test() {
  const veo = new VeoVideoGenerator(undefined, undefined, '3.1');

  // YOU CAN CHANGE THESE:
  const prompt = 'Close-up of a waterfall with sunlight creating rainbows';
  const duration = 5;  // Try 3, 5, or 8 seconds (8 is max)

  console.log(`🎬 Generating ${duration}-second video...\n`);
  console.log(`Prompt: "${prompt}"\n`);

  const result = await veo.generateVideo({
    prompt,
    duration,
    aspectRatio: '9:16',
    modelVersion: '3.1',
  });

  if (result.videoBuffer) {
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    const filename = `veo-${duration}s-${Date.now()}.mp4`;
    const filepath = path.join(outputDir, filename);

    await fs.writeFile(filepath, result.videoBuffer);

    console.log(`\n✅ ${duration}-second video saved!`);
    console.log(`📹 File: ${filepath}`);
    console.log(`📊 Size: ${(result.videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💰 Cost: $${result.cost.toFixed(4)}`);
  }
}

test();
