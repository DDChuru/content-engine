/**
 * Generate assets for Mathematical Proof TikTok video.
 * Cambridge 9709 Pure Mathematics — Proof Methods
 *
 * 8 images (~$0.31) + 1 narration (~$0.29) = ~$0.60 total
 */
import { GeminiImageGenerator } from '../services/gemini-image-generator';
import { VoiceCloning } from '../services/voice-cloning';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const IMAGES_DIR = path.resolve(__dirname, '../remotion/public/images/maths/proof');
const AUDIO_DIR = path.resolve(__dirname, '../remotion/public/audio/maths');

// ── Narration Script ──────────────────────────────────────────────────
const NARRATION_SCRIPT = `Can you prove it? Really prove it?

Mathematical Proof. Cambridge nine-seven-oh-nine. Let's GO!

Four methods. Every A-Level student must know these.

First — proof by deduction. Start with what you know. Logical steps to your conclusion. Prove the sum of two even numbers is always even. Let them be two-a and two-b. Two-a plus two-b equals two brackets a plus b. That's even. Proven.

Second — proof by exhaustion. Only a few cases? Check them ALL. Is n-squared plus n always even for n equals one, two, three? One plus one — two, even. Four plus two — six, even. Nine plus three — twelve, even. All cases done.

Third — proof by contradiction. Assume the OPPOSITE, then find the contradiction. Prove root two is irrational. Assume it equals a over b in lowest terms. Square both sides — two equals a-squared over b-squared. So a-squared equals two-b-squared. A must be even. But then b must be even too. Both even? Wasn't in lowest terms. Contradiction. Root two is irrational.

Finally — disproof by counter-example. One example breaks it. All primes are odd? Two is prime AND even. Disproved.

Deduction. Exhaustion. Contradiction. Counter-example. Four methods.

Save this — guaranteed exam marks.`;

// ── Image Prompts ─────────────────────────────────────────────────────
const IMAGE_PROMPTS = [
  {
    name: 'hook-proof',
    prompt: 'Dark dramatic background with glowing mathematical proof symbols floating in space: QED symbol, therefore symbol (∴), for all (∀), exists (∃), implies arrow (→), not equal (≠). Soft cyan and purple neon glow on each symbol. Deep navy-black background. Cinematic, moody, mathematical beauty. Like a movie poster for mathematics. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'deduction-chain',
    prompt: 'Minimal scientific infographic on pure dark navy background (#0a0f2e). Clean visual showing a logical deduction chain: three glowing nodes (circles) connected by arrows pointing downward, each node a different colour (cyan, green, gold). Arrows are crisp white lines. Simple, elegant, minimal. Represents step-by-step logical reasoning. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'exhaustion-checklist',
    prompt: 'Minimal infographic on pure dark navy background (#0a0f2e). Three items in a vertical list, each with a glowing green checkmark tick beside it. Clean, modern design with soft glow effects. Represents checking every case in a proof. Simple, elegant. Absolutely no text, labels, numbers, or watermarks.',
  },
  {
    name: 'contradiction-concept',
    prompt: 'Abstract conceptual art on dark navy background. Two parallel glowing lines (one cyan, one purple) that converge and collide at a central point, creating a bright explosion or starburst of red-orange light at the intersection. Represents proof by contradiction — two assumptions colliding. Dramatic, cinematic lighting. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'root-two-spiral',
    prompt: 'Elegant mathematical art on dark navy background. A geometric spiral constructed from right triangles (the Spiral of Theodorus / square root spiral), with the hypotenuse of each triangle glowing in different colours (cyan, purple, green, gold). Clean lines, precise geometry. The spiral represents irrational numbers and mathematical beauty. Absolutely no text, labels, numbers, or watermarks.',
  },
  {
    name: 'counter-example',
    prompt: 'Minimal dramatic image on dark navy background. A single large glowing red X mark (cross) in the center, with a subtle cracked or shattered glass effect behind it. Represents disproving a statement with a counter-example. Clean, bold, cinematic. Soft red glow radiating from the X. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'summary-grid',
    prompt: 'Minimal infographic on pure dark navy background (#0a0f2e). A 2x2 grid of four distinct icons/symbols, each in a different colour: top-left a chain of connected dots (cyan, deduction), top-right a checklist with ticks (green, exhaustion), bottom-left a collision burst (purple, contradiction), bottom-right an X mark (red, counter-example). Clean, modern, geometric icons. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'thumbnail',
    prompt: 'Cinematic cover image for a mathematics video about proof methods. Central element: a glowing QED symbol (□) surrounded by four proof-method icons arranged in a diamond pattern — a chain (deduction), checkmarks (exhaustion), collision (contradiction), and X mark (counter-example). Deep dark background with dramatic cyan and purple lighting. Like a movie poster. Absolutely no text, labels, or watermarks.',
  },
];

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  const gen = new GeminiImageGenerator(process.env.GEMINI_API_KEY!);
  let totalCost = 0;

  // Generate images
  console.log('═══ Generating Images ═══\n');
  for (const img of IMAGE_PROMPTS) {
    console.log(`  Generating ${img.name}...`);
    const result = await gen.generateDirect({
      prompt: img.prompt,
      aspectRatio: '9:16',
      outputDir: IMAGES_DIR,
      filename: img.name,
    });
    if (result.success) {
      totalCost += result.cost;
      console.log(`    ✓ ${img.name} → ${result.imagePath} ($${result.cost.toFixed(3)})`);
    } else {
      console.error(`    ✗ ${img.name}: ${result.error}`);
    }
  }

  // Generate narration
  console.log('\n═══ Generating Narration ═══\n');
  const voiceService = new VoiceCloning(process.env.ELEVENLABS_API_KEY!);
  const audioPath = path.join(AUDIO_DIR, 'proof-narration.mp3');

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
    totalCost += narrationCost;
    console.log(`  ✓ Narration: ${audioPath}`);
    console.log(`    ${charCount} chars, ~$${narrationCost.toFixed(2)}`);
  } catch (err: any) {
    console.error(`  ✗ Narration failed: ${err.message}`);
  }

  console.log(`\n═══ Done ═══`);
  console.log(`  Total cost: ~$${totalCost.toFixed(2)}`);
  console.log(`  Images: ${IMAGES_DIR}`);
  console.log(`  Audio: ${audioPath}`);
}

main().catch(console.error);
