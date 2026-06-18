/**
 * Generate per-beat narration for the e-wizer Daily Hygiene Checklist tutorial.
 *
 * Run from content-engine:
 * npx tsx packages/backend/scripts/generate-daily-hygiene-tutorial-audio.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const RB = path.resolve(__dirname, '../../../remotion-branding');
const CONFIG_PATH = path.join(RB, 'src/hygiene/narration.json');
const AUDIO_DIR = path.join(RB, 'public/daily-hygiene-tutorial/audio');
const TIMING_PATH = path.join(RB, 'src/hygiene/timing.json');

const FPS = 30;
const GAP_S = 0.9;

async function tts(text: string, voiceId: string, settings: object, outPath: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { Accept: 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: settings }),
  });

  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  await fs.writeFile(outPath, Buffer.from(await res.arrayBuffer()));
}

function durationOf(file: string): number {
  const out = execFileSync('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    file,
  ])
    .toString()
    .trim();

  return parseFloat(out);
}

async function main() {
  const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf-8'));
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  const beats: any[] = [];
  let cursor = 0.6;
  let chars = 0;

  for (let i = 0; i < config.beats.length; i++) {
    const beat = config.beats[i];
    const file = `${String(i + 1).padStart(2, '0')}-${beat.id}.mp3`;
    const outPath = path.join(AUDIO_DIR, file);

    let exists = false;
    try {
      await fs.access(outPath);
      exists = true;
    } catch {}

    if (!exists) {
      console.log(`[${i + 1}/${config.beats.length}] TTS ${beat.id}`);
      await tts(beat.script, config.voiceId, config.voiceSettings, outPath);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      console.log(`[${i + 1}/${config.beats.length}] ${beat.id} exists - skipped`);
    }

    chars += beat.script.length;

    const duration = durationOf(outPath);
    beats.push({
      id: beat.id,
      shot: beat.shot,
      chip: beat.chip,
      ring: beat.ring,
      audio: `daily-hygiene-tutorial/audio/${file}`,
      voStart: Number(cursor.toFixed(3)),
      duration: Number(duration.toFixed(3)),
      text: beat.script,
    });

    cursor += duration + GAP_S;
  }

  const total = cursor + 1.2;
  const timing = {
    fps: FPS,
    total_seconds: Number(total.toFixed(3)),
    total_frames: Math.ceil(total * FPS),
    beats,
  };

  await fs.writeFile(TIMING_PATH, JSON.stringify(timing, null, 2));
  console.log(`Timing -> ${TIMING_PATH}`);
  console.log(`Total ${timing.total_seconds}s (${timing.total_frames} frames), approx $${((chars / 1000) * 0.3).toFixed(2)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
