/**
 * Simple Veo 3.1 test - one video generation
 */

import 'dotenv/config';
import { VeoVideoGenerator } from './src/services/tiktok/veo-video-generator.js';
import { promises as fs } from 'fs';
import path from 'path';

async function test() {
  console.log('🎬 Testing Veo 3.1 video generation...\n');

  const veo = new VeoVideoGenerator(undefined, undefined, '3.1');

  const prompt = 'Aerial view of Victoria Falls in Zimbabwe, with mist and rainbow';

  console.log(`Generating video from prompt: "${prompt}"\n`);

  try {
    const result = await veo.generateVideo({
      prompt,
      duration: 8,
      aspectRatio: '9:16',
      modelVersion: '3.1',
    });

    console.log('\n✅ SUCCESS!');
    console.log('Video URL:', result.videoUrl);
    console.log('Duration:', result.duration, 'seconds');
    console.log('Resolution:', result.resolution);
    console.log('Model:', result.metadata.model);
    console.log('Generation time:', (result.generationTime / 1000).toFixed(2), 'seconds');
    console.log('Cost:', `$${result.cost.toFixed(4)}`);

    // Save video to file if we got the buffer
    if (result.videoBuffer) {
      const outputDir = path.join(process.cwd(), 'output');
      await fs.mkdir(outputDir, { recursive: true });

      const filename = `victoria-falls-${Date.now()}.mp4`;
      const filepath = path.join(outputDir, filename);

      await fs.writeFile(filepath, result.videoBuffer);
      console.log('\n📹 Video saved to:', filepath);

      const stats = await fs.stat(filepath);
      console.log('File size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
    } else {
      console.log('\n⚠️  Video not downloaded. URL:', result.videoUrl);
      console.log('You may need to enable the Generative Language API for downloads');
    }

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
  }
}

test();
