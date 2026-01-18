/**
 * Generate Miswai narration using ElevenLabs
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_PATH = path.join(__dirname, '../src/remotion/public/audio/narration/12-miswai.mp3');

async function generateMiswaiNarration() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ERROR: ELEVENLABS_API_KEY not found');
    process.exit(1);
  }

  // Powerful finale - with emphasis on MISWAI
  const text = 'Econet Zimbabwe... MISWAI!! You are messing up!';
  const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam voice - same as rest of video

  console.log('\n🎙️ Generating MISWAI narration...');
  console.log('Text:', text);
  console.log('Voice: Adam (same as main narration)\n');

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
        stability: 0.35,        // Lower stability for more emotion
        similarity_boost: 0.85,
        style: 0.9,            // High style for dramatic delivery
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('API Error:', error);
    process.exit(1);
  }

  const audioBuffer = await response.arrayBuffer();
  await fs.writeFile(OUTPUT_PATH, Buffer.from(audioBuffer));

  console.log('✓ Saved:', OUTPUT_PATH);
  console.log('Cost: ~$' + (text.length / 1000 * 0.30).toFixed(3));
}

generateMiswaiNarration().catch(console.error);
