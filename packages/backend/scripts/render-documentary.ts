/**
 * Render Documentary Script
 *
 * Renders the Edgar Tekere documentary using Ken Burns effects
 *
 * Usage: npx tsx scripts/render-documentary.ts
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';

const API_URL = 'http://localhost:3001';
const PROJECT_ID = 'edgar-tekere-documentary';

interface Scene {
  id: string;
  title: string;
  narration: string;
  imageUrl: string;
  duration: number;
}

async function main() {
  console.log('🎬 Documentary Renderer');
  console.log('========================\n');

  // 1. Fetch project data
  console.log('📥 Fetching project data...');
  const response = await fetch(`${API_URL}/api/journalist/projects/${PROJECT_ID}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.status}`);
  }

  const project = await response.json();
  console.log(`   Project: ${project.name}`);
  console.log(`   Scenes: ${project.scenes.length}`);

  // 2. Copy images to Remotion public folder and prepare scenes
  const remotionPublicDir = path.join(process.cwd(), 'src/remotion/public/documentary');
  await fs.mkdir(remotionPublicDir, { recursive: true });

  const scenes: Scene[] = [];

  for (const scene of project.scenes) {
    let imageUrl = scene.imageUrl;

    if (imageUrl && imageUrl.startsWith('/output/')) {
      // Copy image to Remotion public folder
      const sourcePath = path.join(process.cwd(), imageUrl);
      const filename = path.basename(sourcePath);
      const destPath = path.join(remotionPublicDir, filename);

      try {
        await fs.copyFile(sourcePath, destPath);
        // Use relative path from public folder
        imageUrl = `documentary/${filename}`;
      } catch (err) {
        console.log(`   ⚠️ Failed to copy image for scene ${scene.id}`);
      }
    }

    scenes.push({
      id: scene.id,
      title: scene.title,
      narration: scene.narration,
      imageUrl,
      duration: scene.duration || 12, // Default 12 seconds per scene
    });
  }

  // Check all images exist
  console.log('\n🖼️  Checking images...');
  for (const scene of scenes) {
    const imagePath = path.join(process.cwd(), 'src/remotion/public', scene.imageUrl);
    try {
      await fs.access(imagePath);
      console.log(`   ✅ Scene ${scene.id}: ${scene.title}`);
    } catch {
      console.log(`   ❌ Scene ${scene.id}: Missing image at ${imagePath}`);
    }
  }

  // 3. Calculate total duration
  const titleDuration = 4; // 4 seconds for title card
  const totalDuration = titleDuration + scenes.reduce((sum, s) => sum + s.duration, 0);
  const fps = 30;
  const durationInFrames = totalDuration * fps;

  console.log(`\n⏱️  Duration: ${totalDuration} seconds (${durationInFrames} frames)`);

  // 4. Bundle the Remotion project
  console.log('\n📦 Bundling Remotion project...');
  const bundleLocation = await bundle({
    entryPoint: path.join(process.cwd(), 'src/remotion/Root.tsx'),
    publicDir: path.join(process.cwd(), 'src/remotion/public'),
    onProgress: (progress) => {
      if (progress % 25 === 0) {
        console.log(`   ${progress}%`);
      }
    },
  });
  console.log('   Bundle complete');

  // 5. Select and configure the composition
  console.log('\n🎨 Configuring composition...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'Documentary',
    inputProps: {
      title: 'The Story of Edgar Tekere',
      subtitle: 'A Zimbabwean Liberation Hero',
      scenes,
    },
  });

  // Override duration with calculated value
  composition.durationInFrames = durationInFrames;

  console.log(`   Composition: ${composition.id}`);
  console.log(`   Resolution: ${composition.width}x${composition.height}`);
  console.log(`   FPS: ${composition.fps}`);

  // 6. Render the video
  const outputPath = path.join(process.cwd(), 'output/videos/edgar-tekere-documentary.mp4');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  console.log('\n🎬 Rendering video...');
  console.log(`   Output: ${outputPath}`);

  const startTime = Date.now();

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      title: 'The Story of Edgar Tekere',
      subtitle: 'A Zimbabwean Liberation Hero',
      scenes,
    },
    onProgress: ({ progress }) => {
      const percent = Math.round(progress * 100);
      if (percent % 10 === 0) {
        process.stdout.write(`\r   Progress: ${percent}%`);
      }
    },
  });

  const elapsed = Math.round((Date.now() - startTime) / 1000);

  console.log('\n');
  console.log('✅ Render complete!');
  console.log(`   Time: ${elapsed} seconds`);
  console.log(`   Output: ${outputPath}`);

  // Get file size
  const stats = await fs.stat(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
  console.log(`   Size: ${sizeMB} MB`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
