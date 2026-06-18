#!/usr/bin/env npx ts-node
/**
 * Render Script for Remotion Skill Showcase
 *
 * Usage:
 *   npx ts-node render-showcase.ts
 *   npx ts-node render-showcase.ts --preview (preview only, no render)
 *   npx ts-node render-showcase.ts --frames 0-120 (render specific frames)
 */

import path from 'path';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const COMPOSITION_ID = 'SkillShowcase';
const OUTPUT_DIR = path.join(__dirname, '../../output/showcases');

async function main() {
  const args = process.argv.slice(2);
  const previewOnly = args.includes('--preview');

  console.log('\n🎬 Remotion Skill Showcase Renderer\n');
  console.log('═══════════════════════════════════════════════════════════');

  // Step 1: Bundle the project
  console.log('\n📦 Bundling React components...');
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, 'Root.tsx'),
    webpackOverride: (config) => config,
  });
  console.log('   ✓ Bundle created');

  // Step 2: Select composition
  console.log('\n🎯 Selecting composition...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: COMPOSITION_ID,
  });
  console.log(`   ✓ Composition: ${composition.id}`);
  console.log(`   ✓ Duration: ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(1)}s)`);
  console.log(`   ✓ Resolution: ${composition.width}x${composition.height} @ ${composition.fps}fps`);

  if (previewOnly) {
    console.log('\n📺 Preview mode - skipping render');
    console.log('\n   To preview in browser, run:');
    console.log('   npx remotion preview src/remotion/showcases/Root.tsx\n');
    return;
  }

  // Step 3: Render video
  const outputPath = path.join(OUTPUT_DIR, `skill-showcase-${Date.now()}.mp4`);

  console.log('\n🎥 Rendering video...');
  console.log(`   Output: ${outputPath}`);

  const startTime = Date.now();

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r   Progress: ${(progress * 100).toFixed(1)}%`);
    },
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log(`\n✅ Render complete in ${duration}s`);
  console.log(`📁 Output: ${outputPath}\n`);
}

main().catch((err) => {
  console.error('\n❌ Render failed:', err);
  process.exit(1);
});
