/**
 * Regenerate all TauraiZim narration with custom voice
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.join(__dirname, '../src/remotion/public/audio/narration');

// Custom voice ID provided by user
const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';

// All narration scripts including Miswai
const narrationSlides = [
  { id: '01-intro', script: "This is TauraiZim. Consumer voice of Zimbabwe. This is my real story with Econet Wireless." },
  { id: '02-placard-01', script: "I paid ninety-nine US dollars for SmartUltra. Four hundred gigabytes of data." },
  { id: '03-placard-02', script: "Download speed? Thirty-seven kilobits per second. If I'm lucky!" },
  { id: '04-placard-03', script: "I tried my phone. MiFi. Router. Same disappointing results everywhere." },
  { id: '05-placard-04', script: "Customer support says it's resolved. But I still can't even open YouTube!" },
  { id: '06-placard-05', script: "I asked for the complaints channel. They hung up on me!" },
  { id: '07-placard-06', script: "Refund? Denied! Migrate to Private WiFi? Also denied!" },
  { id: '08-placard-07', script: "Remember SmartBiz? They gave it to us, then took it away without warning." },
  { id: '09-placard-08', script: "Smart For You top-up? Another scam with zero transparency." },
  { id: '10-placard-09', script: "What is your endgame, Econet? How much more must we suffer?" },
  { id: '11-miswai', script: "Econet Zimbabwe... MISWAI!! You are messing up!" },
  { id: '12-cta', script: "Taurai! Speak up! Share your story. Tag Econet. Report to POTRAZ. Together, we demand accountability!" }
];

async function generateAudio(text: string, outputPath: string): Promise<boolean> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
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
        similarity_boost: 0.8,
        style: 0.6,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(audioBuffer));
  return true;
}

async function main() {
  console.log('\n🎙️ Regenerating ALL narration with custom voice\n');
  console.log(`Voice ID: ${VOICE_ID}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  let successCount = 0;
  let totalChars = 0;
  const audioFiles: string[] = [];

  for (let i = 0; i < narrationSlides.length; i++) {
    const slide = narrationSlides[i];
    const outputPath = path.join(OUTPUT_DIR, `${slide.id}.mp3`);

    console.log(`[${i + 1}/${narrationSlides.length}] ${slide.id}`);
    console.log(`   "${slide.script.substring(0, 50)}..."`);

    try {
      await generateAudio(slide.script, outputPath);
      console.log(`   ✅ Saved`);
      successCount++;
      totalChars += slide.script.length;
      audioFiles.push(path.basename(outputPath));
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Rate limiting
    if (i < narrationSlides.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Save file list for concatenation
  const fileListPath = path.join(OUTPUT_DIR, 'files-v2.txt');
  const fileListContent = audioFiles.map(f => `file '${f}'`).join('\n');
  await fs.writeFile(fileListPath, fileListContent);

  const cost = (totalChars / 1000) * 0.30;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✨ Complete! ${successCount}/${narrationSlides.length} clips`);
  console.log(`   Characters: ${totalChars.toLocaleString()}`);
  console.log(`   Cost: ~$${cost.toFixed(2)}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
