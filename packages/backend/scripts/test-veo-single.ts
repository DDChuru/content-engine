/**
 * Test single Veo 3.1 video generation with detailed logging
 */
import { GoogleGenAI } from '@google/genai';
import * as path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const OUTPUT_DIR = path.resolve(process.cwd(), '../../projects/tiktok/makwinji-soma-phiri/output/clips');

async function main() {
  console.log('🧪 VEO 3.1 SINGLE VIDEO TEST\n');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found');
    return;
  }

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const prompt = `Dramatic slow-motion close-up of African footballer's intense eyes looking up at a cross coming in, sweat glistening, stadium lights creating halo effect, 1990s football aesthetic, 9:16 vertical format`;

  console.log('Prompt:', prompt.substring(0, 80) + '...');
  console.log('\n🚀 Starting generation...\n');

  try {
    // Start generation
    const startTime = Date.now();
    const operation = await (genAI.models as any).generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt,
      config: {
        aspectRatio: '9:16',
        numberOfVideos: 1,
        durationSeconds: 8,
      }
    });

    console.log('📦 Initial response:');
    console.log(JSON.stringify(operation, null, 2).substring(0, 500));
    console.log('\n⏳ Polling for completion (max 5 minutes)...\n');

    // Poll with longer timeout
    let result = operation;
    for (let i = 0; i < 30; i++) {  // 30 × 10s = 5 minutes
      await new Promise(r => setTimeout(r, 10000));
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`  Poll ${i + 1}: ${elapsed}s elapsed`);

      try {
        result = await (genAI.operations as any).getVideosOperation({ operation: result });
        console.log(`    done: ${result.done}, videos: ${result.videos?.length || 0}`);

        if (result.done) {
          console.log('\n✅ Generation complete!');
          console.log('Result:', JSON.stringify(result, null, 2).substring(0, 1000));

          if (result.videos && result.videos.length > 0) {
            const video = result.videos[0];
            console.log(`\n📥 Downloading from: ${video.uri}`);

            const response = await fetch(video.uri);
            const buffer = Buffer.from(await response.arrayBuffer());
            const outputPath = path.join(OUTPUT_DIR, 'test_scene.mp4');
            await fs.writeFile(outputPath, buffer);

            console.log(`\n🎉 Video saved: ${outputPath}`);
            console.log(`   Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
          }
          break;
        }
      } catch (e: any) {
        console.log(`    Error polling: ${e.message}`);
      }
    }

    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(`\n⏱️ Total time: ${totalTime}s`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

main();
