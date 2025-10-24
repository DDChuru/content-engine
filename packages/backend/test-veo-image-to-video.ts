/**
 * Test Veo 3.1 Image-to-Video Generation
 *
 * This script demonstrates how to generate videos from reference images:
 * - Use an existing image as the starting frame
 * - Add motion and effects via text prompts
 * - Generate videos that animate static images
 */

import 'dotenv/config';
import { VeoVideoGenerator } from './src/services/tiktok/veo-video-generator.js';
import { promises as fs } from 'fs';
import path from 'path';

async function test() {
  console.log('🎬 Testing Veo 3.1 Image-to-Video Generation\n');

  const veo = new VeoVideoGenerator(undefined, undefined, '3.1');

  // ═══════════════════════════════════════════════════════════
  // OPTION 1: Use an existing image file on disk
  // ═══════════════════════════════════════════════════════════

  // TO TEST THIS:
  // 1. Put an image in the project directory (e.g., 'test-image.jpg')
  // 2. Uncomment the code below and update the path

  /*
  const imagePath = path.join(process.cwd(), 'test-image.jpg');

  // Check if image exists
  try {
    await fs.access(imagePath);
    console.log(`✓ Image found: ${imagePath}\n`);
  } catch (error) {
    console.error(`✗ Image not found: ${imagePath}`);
    console.log('\nPlease provide an image file to test image-to-video generation.');
    console.log('Supported formats: JPG, PNG, GIF, WebP\n');
    return;
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('TEST 1: Generate Video from Local Image File');
  console.log('═══════════════════════════════════════════════════════\n');

  const prompt1 = 'Slowly zoom into the image while adding cinematic motion blur';
  console.log(`Image: ${imagePath}`);
  console.log(`Prompt: "${prompt1}"`);
  console.log(`Duration: 8 seconds\n`);

  const result1 = await veo.generateVideo({
    imagePath,
    prompt: prompt1,
    duration: 8,
    aspectRatio: '9:16',
    modelVersion: '3.1',
  });

  console.log('✅ Image-to-video generated!');
  console.log(`📊 Size: ${(result1.videoBuffer!.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`⏱️  Generation time: ${(result1.generationTime / 1000).toFixed(2)}s`);
  console.log(`💰 Cost: $${result1.cost.toFixed(4)}`);
  console.log(`📷 Used reference image: ${result1.metadata.usedReferenceImage}\n`);

  // Save result
  const outputDir = path.join(process.cwd(), 'output');
  await fs.mkdir(outputDir, { recursive: true });

  const filename1 = `veo-image-to-video-${Date.now()}.mp4`;
  const filepath1 = path.join(outputDir, filename1);
  await fs.writeFile(filepath1, result1.videoBuffer!);
  console.log(`💾 Saved: ${filepath1}\n`);
  */

  // ═══════════════════════════════════════════════════════════
  // OPTION 2: Download an image from a URL
  // ═══════════════════════════════════════════════════════════

  console.log('═══════════════════════════════════════════════════════');
  console.log('TEST 2: Generate Video from Image URL');
  console.log('═══════════════════════════════════════════════════════\n');

  // Using a sample image URL (replace with your own)
  const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Victoria_Falls.jpg/800px-Victoria_Falls.jpg';
  const prompt2 = 'Camera pans across Victoria Falls with water cascading down, mist rising, and sunlight creating rainbows';

  console.log(`Image URL: ${imageUrl}`);
  console.log(`Prompt: "${prompt2}"`);
  console.log(`Duration: 8 seconds\n`);

  try {
    const result2 = await veo.generateVideo({
      imageUrl,
      prompt: prompt2,
      duration: 8,
      aspectRatio: '9:16',
      modelVersion: '3.1',
    });

    console.log('✅ Image-to-video generated from URL!');
    console.log(`📊 Size: ${(result2.videoBuffer!.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`⏱️  Generation time: ${(result2.generationTime / 1000).toFixed(2)}s`);
    console.log(`💰 Cost: $${result2.cost.toFixed(4)}`);
    console.log(`📷 Used reference image: ${result2.metadata.usedReferenceImage}\n`);

    // Save result
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    const filename2 = `veo-image-url-to-video-${Date.now()}.mp4`;
    const filepath2 = path.join(outputDir, filename2);
    await fs.writeFile(filepath2, result2.videoBuffer!);
    console.log(`💾 Saved: ${filepath2}\n`);
  } catch (error: any) {
    console.error('❌ Error generating from URL:', error.message);
    console.log('\nNote: Image URLs must be publicly accessible.');
    console.log('If the above URL doesn\'t work, try a different image URL.\n');
  }

  // ═══════════════════════════════════════════════════════════
  // OPTION 3: Use an image buffer (from memory)
  // ═══════════════════════════════════════════════════════════

  /*
  console.log('═══════════════════════════════════════════════════════');
  console.log('TEST 3: Generate Video from Image Buffer');
  console.log('═══════════════════════════════════════════════════════\n');

  // Load image into buffer
  const imageBuffer = await fs.readFile('./test-image.jpg');
  const prompt3 = 'Dramatic zoom out revealing the full scene with cinematic lighting';

  console.log(`Image: ${imageBuffer.length} bytes in memory`);
  console.log(`Prompt: "${prompt3}"`);
  console.log(`Duration: 8 seconds\n`);

  const result3 = await veo.generateVideo({
    imageBuffer,
    prompt: prompt3,
    duration: 8,
    aspectRatio: '16:9',  // Landscape format
    modelVersion: '3.1',
  });

  console.log('✅ Image-to-video generated from buffer!');
  console.log(`📊 Size: ${(result3.videoBuffer!.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`⏱️  Generation time: ${(result3.generationTime / 1000).toFixed(2)}s`);
  console.log(`💰 Cost: $${result3.cost.toFixed(4)}`);
  console.log(`📷 Used reference image: ${result3.metadata.usedReferenceImage}\n`);

  // Save result
  const filename3 = `veo-image-buffer-to-video-${Date.now()}.mp4`;
  const filepath3 = path.join(outputDir, filename3);
  await fs.writeFile(filepath3, result3.videoBuffer!);
  console.log(`💾 Saved: ${filepath3}\n`);
  */

  // ═══════════════════════════════════════════════════════════
  // Summary and Tips
  // ═══════════════════════════════════════════════════════════

  console.log('═══════════════════════════════════════════════════════');
  console.log('IMAGE-TO-VIDEO TIPS');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('✨ Prompt Engineering Tips:');
  console.log('   1. Describe the motion you want to add');
  console.log('   2. Mention camera movements (zoom, pan, rotate)');
  console.log('   3. Specify effects (motion blur, lighting changes)');
  console.log('   4. Keep it related to the image content\n');

  console.log('📸 Image Requirements:');
  console.log('   - Formats: JPEG, PNG, GIF, WebP');
  console.log('   - Size: Recommended < 10MB');
  console.log('   - Resolution: Higher quality = better results');
  console.log('   - Aspect ratio: Match your target video format\n');

  console.log('💰 Cost Considerations:');
  console.log('   - Same as text-to-video: ~$0.20/second');
  console.log('   - 8-second video: ~$1.60');
  console.log('   - Can be extended like regular videos\n');

  console.log('🎬 Use Cases:');
  console.log('   - Animate product photos for ads');
  console.log('   - Bring historical photos to life');
  console.log('   - Create parallax effects from still images');
  console.log('   - Add cinematic motion to landscapes');
  console.log('   - Animate logos and graphics\n');

  console.log('✨ Image-to-video test complete!\n');
}

test().catch(error => {
  console.error('\n❌ Error:', error.message);
  if (error.stack) {
    console.error('\nStack trace:', error.stack);
  }
});
