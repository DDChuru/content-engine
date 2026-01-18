/**
 * Render the expanded Edgar Tekere documentary
 *
 * Usage: npx tsx scripts/render-expanded-documentary.ts
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DocumentaryScene {
  id: string;
  title: string;
  narration: string;
  imageUrl: string;
  audioUrl?: string;
  duration: number;
}

interface Documentary {
  id: string;
  name: string;
  subject: string;
  scenes: DocumentaryScene[];
}

async function main() {
  console.log('='.repeat(60));
  console.log('  EXPANDED DOCUMENTARY RENDERER');
  console.log('  Edgar Tekere - Extended Cut (15 Scenes)');
  console.log('='.repeat(60));
  console.log();

  // Load the expanded documentary project
  const projectPath = path.resolve(__dirname, '../output/journalist-projects/edgar-tekere-documentary-expanded.json');
  const projectData = await fs.readFile(projectPath, 'utf-8');
  const project: Documentary = JSON.parse(projectData);

  console.log(`Project: ${project.name}`);
  console.log(`Scenes: ${project.scenes.length}`);

  // Map scenes to the format expected by Documentary composition
  // Convert image paths from /output/journalist-images/... to images/documentary-expanded/...
  const scenes = project.scenes.map((scene, index) => {
    // Extract just the filename from the path
    const imageName = scene.imageUrl.split('/').pop()!;

    return {
      id: scene.id,
      title: scene.title,
      narration: scene.narration,
      imageUrl: `images/documentary-expanded/${imageName}`,
      audioUrl: `audio/documentary-expanded/scene_${index + 1}.wav`,
      duration: scene.duration,
    };
  });

  // Calculate total duration
  const titleCardDuration = 4; // seconds
  const totalDuration = titleCardDuration + scenes.reduce((sum, s) => sum + s.duration, 0);
  console.log(`Total duration: ${totalDuration} seconds (${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s)`);
  console.log();

  // Bundle the Remotion project
  console.log('Bundling Remotion project...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve(__dirname, '../src/remotion/Root.tsx'),
    publicDir: path.resolve(__dirname, '../src/remotion/public'),
    onProgress: (progress) => {
      if (progress === 100) {
        console.log('  Bundle complete');
      }
    },
  });

  // Select the Documentary composition
  console.log('Selecting composition...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'Documentary',
    inputProps: {
      title: project.name,
      subtitle: `The Life of ${project.subject}`,
      scenes,
    },
  });

  // Calculate total frames (30fps)
  const fps = 30;
  const totalFrames = Math.ceil(totalDuration * fps);

  // Output path
  const outputPath = path.resolve(__dirname, '../output/videos/edgar-tekere-documentary-expanded.mp4');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  console.log(`Rendering ${totalFrames} frames at ${fps}fps...`);
  console.log(`Output: ${outputPath}`);
  console.log();

  // Render the video
  const startTime = Date.now();
  await renderMedia({
    composition: {
      ...composition,
      durationInFrames: totalFrames,
    },
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      title: project.name,
      subtitle: `The Life of ${project.subject}`,
      scenes,
    },
    onProgress: ({ progress }) => {
      const percent = Math.round(progress * 100);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      process.stdout.write(`\r  Progress: ${percent}% (${elapsed}s elapsed)`);
    },
  });

  const duration = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n\n  Render complete in ${duration} seconds`);

  // Get file size
  const stats = await fs.stat(outputPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
  console.log(`  File size: ${sizeMB} MB`);
  console.log(`  Output: ${outputPath}`);

  console.log();
  console.log('='.repeat(60));
  console.log('  DOCUMENTARY COMPLETE');
  console.log('='.repeat(60));
}

main().catch(console.error);
