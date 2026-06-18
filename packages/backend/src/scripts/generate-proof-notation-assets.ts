/**
 * Generate narration for Proof Notation TikTok (companion to Proof Methods).
 * Cambridge 9709 / AQA — Language of Proof.
 *
 * Pure CSS composition — only narration needed.
 * Cost: ~$0.15 (ElevenLabs narration only)
 */
import { VoiceCloning } from '../services/voice-cloning';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const AUDIO_DIR = path.resolve(__dirname, '../remotion/public/audio/maths');

const NARRATION_SCRIPT = `Before you prove anything — learn the language.

Number sets. You need to know these symbols.

N — natural numbers. One, two, three and up. The counting numbers.

Z — integers. All whole numbers, including negatives and zero.

Q — rational numbers. Anything you can write as a fraction — a over b.

R — real numbers. Everything on the number line. Rationals AND irrationals.

Now — how to write algebraic proofs.

Even numbers — write them as two-k. Odd numbers — two-k plus one. Multiples of three — three-k.

This is how every deduction proof starts. You express the general form, then manipulate.

LHS means left-hand side. RHS means right-hand side. Show they're equal — and you've proven it.

Examiner tips. Before you start a proof — try values. One, two, three. Try negatives. Try zero. Spot the pattern first, then prove it.

For primes — you only need to test factors up to the square root. That's your shortcut.

Master the language — then master the proof.`;

async function main() {
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  console.log('═══ Generating Proof Notation Narration ═══\n');
  const voiceService = new VoiceCloning(process.env.ELEVENLABS_API_KEY!);
  const audioPath = path.join(AUDIO_DIR, 'proof-notation-narration.mp3');

  try {
    const voiceId = 'gYWKdgLtqjPO3D5uDrDP';
    const audioBuffer = await voiceService.generateSpeech({
      text: NARRATION_SCRIPT,
      voiceId,
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.3,
    });
    await fs.writeFile(audioPath, audioBuffer);
    const charCount = NARRATION_SCRIPT.length;
    const narrationCost = (charCount / 1000) * 0.30;
    console.log(`  ✓ Narration: ${audioPath}`);
    console.log(`    ${charCount} chars, ~$${narrationCost.toFixed(2)}`);
  } catch (err: any) {
    console.error(`  ✗ Narration failed: ${err.message}`);
  }
}

main().catch(console.error);
