/**
 * Generate audio narration for Chemical Sanitation Training
 * Uses ElevenLabs TTS with user's cloned voice
 */

import { VoiceCloning } from '../src/services/voice-cloning.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const SCRIPTS_PATH = path.resolve(__dirname, '../../../projects/professional/food-safety/output/chemicals/narration-scripts.json');
const OUTPUT_DIR = path.resolve(__dirname, '../../../projects/professional/food-safety/output/chemicals/audio');

interface SlideScript {
  id: string;
  name: string;
  filename: string;
  script: string;
}

interface NarrationScripts {
  course: string;
  facilitator: string;
  voiceId: string;
  slides: SlideScript[];
}

async function main() {
  console.log('\n🎙️ CHEMICAL SANITATION AUDIO GENERATION\n');
  console.log('=' .repeat(50));

  // Check API key
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('❌ ERROR: ELEVENLABS_API_KEY not found in environment');
    process.exit(1);
  }

  // Read narration scripts
  const scriptsContent = await fs.readFile(SCRIPTS_PATH, 'utf-8');
  const scripts: NarrationScripts = JSON.parse(scriptsContent);

  console.log(`📚 Course: ${scripts.course}`);
  console.log(`🎤 Facilitator: ${scripts.facilitator}`);
  console.log(`🔊 Voice ID: ${scripts.voiceId}`);
  console.log(`📝 Total slides: ${scripts.slides.length}`);

  // Filter slides that have scripts (skip title slide)
  const slidesWithScripts = scripts.slides.filter(s => s.script && s.script.trim().length > 0);
  console.log(`🎬 Slides with narration: ${slidesWithScripts.length}`);

  // Calculate total characters
  const totalChars = slidesWithScripts.reduce((sum, s) => sum + s.script.length, 0);
  console.log(`📊 Total characters: ${totalChars.toLocaleString()}`);
  console.log(`💰 Estimated cost: $${(totalChars * 0.30 / 1000).toFixed(2)} (at $0.30/1K chars)`);

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);

  // Initialize voice service
  const voiceService = new VoiceCloning(apiKey);

  console.log('\n' + '='.repeat(50));
  console.log('Starting audio generation...\n');

  let successCount = 0;
  let errorCount = 0;
  let totalBytes = 0;

  for (let i = 0; i < slidesWithScripts.length; i++) {
    const slide = slidesWithScripts[i];
    const outputPath = path.join(OUTPUT_DIR, slide.filename);

    console.log(`[${i + 1}/${slidesWithScripts.length}] ${slide.name}`);
    console.log(`   📝 ${slide.script.substring(0, 60)}...`);
    console.log(`   📊 ${slide.script.length} chars`);

    try {
      // Generate audio
      const audioBuffer = await voiceService.generateSpeech({
        text: slide.script,
        voiceId: scripts.voiceId,
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0,
        speakerBoost: true
      });

      // Save to file
      await fs.writeFile(outputPath, audioBuffer);
      const fileSizeKB = (audioBuffer.length / 1024).toFixed(1);
      totalBytes += audioBuffer.length;

      console.log(`   ✅ ${slide.filename} (${fileSizeKB} KB)`);
      successCount++;

      // Rate limiting - wait 1 second between calls
      if (i < slidesWithScripts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error: any) {
      console.log(`   ❌ ERROR: ${error.message}`);
      errorCount++;
    }

    console.log('');
  }

  // Summary
  console.log('='.repeat(50));
  console.log('\n📊 GENERATION COMPLETE\n');
  console.log(`✅ Success: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`💾 Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);

  // List generated files
  console.log('\n📋 Generated files:');
  const files = await fs.readdir(OUTPUT_DIR);
  for (const file of files.sort()) {
    if (file.endsWith('.mp3')) {
      const stat = await fs.stat(path.join(OUTPUT_DIR, file));
      console.log(`   ${file} (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
