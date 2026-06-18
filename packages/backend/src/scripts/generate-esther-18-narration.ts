import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';
const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/images/esther-18');

const NARRATION_SEGMENTS = [
  {
    id: 'intro',
    text: `Eighteen years ago, a tiny human entered my life. She looked at me, and basically said... Dad, I am going to embarrass you, forever.`,
  },
  {
    id: 'school-concert',
    text: `It started at the school concert. Look at this face. She's five, and she's already judging everyone in the room.`,
  },
  {
    id: 'face-paint',
    text: `Then came the face painting phase. I don't know what she was supposed to be, but she absolutely committed to it.`,
  },
  {
    id: 'silly-phase',
    text: `This child invented poses that don't exist. Arms out, big eyes, tongue out. She was born for drama.`,
  },
  {
    id: 'yolo',
    text: `And the YOLO hoodie. She was living YOLO before most people could even spell it.`,
  },
  {
    id: 'dad-moments',
    text: `Through it all, one thing stayed the same. My Arsenal jerseys. And her, very interesting expressions.`,
  },
  {
    id: 'transition',
    text: `But then, something happened.`,
  },
  {
    id: 'glow-up',
    text: `My little face-painting, YOLO-wearing, funny-face-making baby, grew up. And honestly? She absolutely crushed it.`,
  },
  {
    id: 'outro',
    text: `Happy eighteenth birthday Esther! The world isn't ready. But you definitely are.`,
  },
];

async function main() {
  const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

  const totalChars = NARRATION_SEGMENTS.reduce((sum, s) => sum + s.text.length, 0);
  console.log(`Total characters: ${totalChars}`);
  console.log(`Estimated cost: $${((totalChars / 1000) * 0.30).toFixed(2)}`);

  for (const segment of NARRATION_SEGMENTS) {
    const outPath = path.join(OUTPUT_DIR, `narration-${segment.id}.mp3`);

    if (fs.existsSync(outPath)) {
      console.log(`  Skipping ${segment.id} (already exists)`);
      continue;
    }

    console.log(`  Generating: ${segment.id} (${segment.text.length} chars)`);

    const audio = await client.textToSpeech.convert(VOICE_ID, {
      text: segment.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.78,
        style: 0.35,
        use_speaker_boost: true,
      },
    });

    const chunks: Uint8Array[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(outPath, buffer);
    console.log(`  Saved: ${outPath} (${buffer.length} bytes)`);

    // Rate limit
    await new Promise((r) => setTimeout(r, 500));
  }

  // Also generate ONE combined narration for easier use
  const fullText = NARRATION_SEGMENTS.map((s) => s.text).join(' ... ');
  const combinedPath = path.join(OUTPUT_DIR, 'narration-full.mp3');

  if (!fs.existsSync(combinedPath)) {
    console.log(`\nGenerating combined narration (${fullText.length} chars)...`);
    const audio = await client.textToSpeech.convert(VOICE_ID, {
      text: fullText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.78,
        style: 0.35,
        use_speaker_boost: true,
      },
    });

    const chunks: Uint8Array[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(combinedPath, buffer);
    console.log(`  Saved combined: ${combinedPath} (${buffer.length} bytes)`);
  }

  console.log('\nDone! All narration generated.');
}

main().catch(console.error);
