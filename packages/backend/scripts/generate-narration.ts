/**
 * Generate narration audio using ElevenLabs
 * Uses Durai's cloned voice for professional food safety training
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const SCRIPTS_PATH = '/home/dachu/Documents/projects/content-engine/projects/professional/food-safety/output/veg-plants/narration-scripts.json';
const OUTPUT_DIR = '/home/dachu/Documents/projects/content-engine/projects/professional/food-safety/output/veg-plants/audio';

interface NarrationSlide {
  id: string;
  name: string;
  duration: number;
  script: string;
}

interface NarrationConfig {
  voiceId: string;
  slides: NarrationSlide[];
}

async function generateAudio(text: string, voiceId: string, outputPath: string): Promise<boolean> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not set');
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(audioBuffer));

  return true;
}

async function main() {
  console.log('\n🎙️ Generating narration audio with ElevenLabs\n');

  // Load narration scripts
  const scriptsJson = await fs.readFile(SCRIPTS_PATH, 'utf-8');
  const config: NarrationConfig = JSON.parse(scriptsJson);

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const voiceId = config.voiceId;
  const slides = config.slides;

  console.log(`📋 ${slides.length} slides to narrate`);
  console.log(`🎤 Voice ID: ${voiceId}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  let successCount = 0;
  let totalChars = 0;

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const outputPath = path.join(OUTPUT_DIR, `${String(i + 1).padStart(2, '0')}-${slide.id}.mp3`);

    console.log(`[${i + 1}/${slides.length}] ${slide.name}`);
    console.log(`   Script: "${slide.script.substring(0, 50)}..."`);

    try {
      await generateAudio(slide.script, voiceId, outputPath);
      console.log(`   ✅ Saved: ${path.basename(outputPath)}`);
      successCount++;
      totalChars += slide.script.length;
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Rate limiting - wait between requests
    if (i < slides.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const cost = (totalChars / 1000) * 0.30;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✨ Narration Generation Complete!`);
  console.log(`   Success: ${successCount}/${slides.length}`);
  console.log(`   Characters: ${totalChars.toLocaleString()}`);
  console.log(`   Estimated Cost: $${cost.toFixed(2)}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
