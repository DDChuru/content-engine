/**
 * Render Biology Biomolecules video
 *
 * Loads manifest, passes to Remotion composition, renders to MP4.
 *
 * Usage: npx tsx src/scripts/render-biology.ts [--preview]
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const PROJECT_DIR = path.resolve(__dirname, '../../projects/biology-biomolecules');
const REMOTION_ENTRY = path.resolve(__dirname, '../remotion/Root.tsx');
const OUTPUT_DIR = path.join(PROJECT_DIR, 'output');

async function main() {
  const isPreview = process.argv.includes('--preview');

  console.log('🧬 Biology Biomolecules — Video Renderer');
  console.log('=========================================\n');

  // Load manifest
  const manifestPath = path.join(PROJECT_DIR, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

  console.log(`📋 Manifest loaded: ${manifest.slides.length} slides`);
  console.log(`⏱️  Total duration: ${manifest.slides.reduce((s: number, sl: any) => s + (sl.timing?.duration || 30), 0).toFixed(1)}s`);

  const inputProps = {
    audioNarration: true,
    manifestData: {
      slides: manifest.slides,
      settings: manifest.settings,
    },
  };

  if (isPreview) {
    console.log('\n🎬 Opening Remotion Studio...');
    console.log('   Run: npx remotion studio src/remotion/index.ts');
    console.log(`   Props: ${JSON.stringify(inputProps).substring(0, 100)}...`);
    return;
  }

  console.log('\n📦 Bundling Remotion project...');
  const bundled = await bundle({
    entryPoint: REMOTION_ENTRY,
    publicDir: path.resolve(__dirname, '../remotion/public'),
    onProgress: (progress) => {
      if (progress % 25 === 0) {
        process.stdout.write(`   ${progress}%\r`);
      }
    },
  });
  console.log('   ✅ Bundle complete');

  console.log('\n🔍 Selecting composition...');
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'BiologyBiomolecules',
    inputProps,
  });
  console.log(`   ✅ ${composition.id}: ${composition.durationInFrames} frames @ ${composition.fps}fps`);
  console.log(`   ✅ Resolution: ${composition.width}x${composition.height}`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const outputPath = path.join(OUTPUT_DIR, 'biology-biomolecules.mp4');

  console.log('\n🎬 Rendering video...');
  console.log(`   Output: ${outputPath}\n`);

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      process.stdout.write(`   Rendering: ${pct}%\r`);
    },
  });

  const stats = await fs.stat(outputPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);

  console.log(`\n\n✅ Render complete!`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Size:   ${sizeMB} MB`);
  console.log(`   Duration: ${(composition.durationInFrames / composition.fps).toFixed(1)}s`);
}

main().catch(console.error);
