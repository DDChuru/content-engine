/**
 * Generate voice narration for TauraiZim Placard Protest Video
 * Uses ElevenLabs TTS API
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.join(__dirname, '../src/remotion/public/audio/narration');

// Narration scripts - timed to match video slides
// Intro: 4s, Each placard: 3.5s, CTA: 5s
const narrationSlides = [
  {
    id: 'intro',
    name: 'Intro',
    duration: 4,
    script: "This is TauraiZim. Consumer voice of Zimbabwe. This is my real story with Econet Wireless."
  },
  {
    id: 'placard-01',
    name: 'The Purchase',
    duration: 3.5,
    script: "I paid ninety-nine US dollars for SmartUltra. Four hundred gigabytes of data."
  },
  {
    id: 'placard-02',
    name: 'Disappointing Speeds',
    duration: 3.5,
    script: "Download speed? Thirty-seven kilobits per second. If I'm lucky!"
  },
  {
    id: 'placard-03',
    name: 'Tried Everything',
    duration: 3.5,
    script: "I tried my phone. MiFi. Router. Same disappointing results everywhere."
  },
  {
    id: 'placard-04',
    name: 'Support Fail',
    duration: 3.5,
    script: "Customer support says it's resolved. But I still can't even open YouTube!"
  },
  {
    id: 'placard-05',
    name: 'Hung Up',
    duration: 3.5,
    script: "I asked for the complaints channel. They hung up on me!"
  },
  {
    id: 'placard-06',
    name: 'Denied',
    duration: 3.5,
    script: "Refund? Denied! Migrate to Private WiFi? Also denied!"
  },
  {
    id: 'placard-07',
    name: 'Smart Biz',
    duration: 3.5,
    script: "Remember SmartBiz? They gave it to us, then took it away without warning."
  },
  {
    id: 'placard-08',
    name: 'Smart4U',
    duration: 3.5,
    script: "Smart For You top-up? Another scam with zero transparency."
  },
  {
    id: 'placard-09',
    name: 'Endgame',
    duration: 3.5,
    script: "What is your endgame, Econet? How much more must we suffer?"
  },
  {
    id: 'cta',
    name: 'Call to Action',
    duration: 5,
    script: "Taurai! Speak up! Share your story. Tag Econet. Report to POTRAZ. Together, we demand accountability!"
  }
];

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
        similarity_boost: 0.8,
        style: 0.6,  // More expressive for emotional content
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
  console.log('\n🎙️ Generating TauraiZim Placard Video Narration\n');

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Use a passionate, African male voice
  // Options: 'pNInz6obpgDQGcFmaJgB' (Adam), 'ErXwobaYiN019PkySvjV' (Antoni)
  // Or use custom cloned voice if available
  const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam - deep, authoritative

  console.log(`📋 ${narrationSlides.length} slides to narrate`);
  console.log(`🎤 Voice ID: ${voiceId}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  let successCount = 0;
  let totalChars = 0;
  const audioFiles: string[] = [];

  for (let i = 0; i < narrationSlides.length; i++) {
    const slide = narrationSlides[i];
    const outputPath = path.join(OUTPUT_DIR, `${String(i + 1).padStart(2, '0')}-${slide.id}.mp3`);

    console.log(`[${i + 1}/${narrationSlides.length}] ${slide.name} (${slide.duration}s)`);
    console.log(`   "${slide.script}"`);

    try {
      await generateAudio(slide.script, voiceId, outputPath);
      console.log(`   ✅ Saved: ${path.basename(outputPath)}`);
      successCount++;
      totalChars += slide.script.length;
      audioFiles.push(outputPath);
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Rate limiting - wait between requests
    if (i < narrationSlides.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  const cost = (totalChars / 1000) * 0.30;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✨ Narration Generation Complete!`);
  console.log(`   Success: ${successCount}/${narrationSlides.length}`);
  console.log(`   Characters: ${totalChars.toLocaleString()}`);
  console.log(`   Estimated Cost: $${cost.toFixed(2)}`);
  console.log(`${'='.repeat(50)}\n`);

  // Save file list for concatenation
  if (successCount > 0) {
    const fileListPath = path.join(OUTPUT_DIR, 'files.txt');
    const fileListContent = audioFiles.map(f => `file '${path.basename(f)}'`).join('\n');
    await fs.writeFile(fileListPath, fileListContent);
    console.log(`📝 File list saved to: ${fileListPath}`);
    console.log(`\nNext step: Concatenate and mix with video`);
  }
}

main().catch(console.error);
