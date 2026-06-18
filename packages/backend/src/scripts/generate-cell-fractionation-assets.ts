/**
 * Generate assets for Cell Fractionation TikTok video.
 * Topic 1.2: Cell Structure — Lysosomes, Ribosomes, Cell Fractionation
 *
 * 9 images (~$0.35) + 1 narration (~$0.25) = ~$0.60 total
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

const IMAGES_DIR = path.resolve(__dirname, '../remotion/public/images/biology/cell-fractionation');
const AUDIO_DIR = path.resolve(__dirname, '../remotion/public/audio/biology');

// ── Narration Script ──────────────────────────────────────────────────
const NARRATION_SCRIPT = `How do you study something you can't even see?

Cell fractionation. Topic one, part two. Let's GO!

First, meet your organelles. Lysosomes — tiny bags of digestive enzymes that break down waste. Think of them as the cell's recycling center. Ribosomes — the protein factories. They read mRNA and build proteins, amino acid by amino acid.

But here's the challenge — they're all mixed together inside the cell. How do we separate them?

Step one: homogenisation. Blend the tissue in a cold, buffered, isotonic solution. Cold stops enzymes destroying your organelles. Isotonic stops them from bursting.

Step two: filter through gauze to remove cell debris. Keep the organelle suspension.

Step three: ultracentrifugation. This is where sedimentation happens. Spin at low speed — nuclei are heaviest, they sediment first. Pour off the supernatant. Spin faster — mitochondria sediment. Faster again — lysosomes settle out. Fastest spin — ribosomes, the smallest, settle last.

Homogenise, filter, centrifuge. Four spins, four fractions. That's cell fractionation.

Save this — guaranteed exam question.`;

// ── Image Prompts ─────────────────────────────────────────────────────
const IMAGE_PROMPTS = [
  {
    name: 'hook-microscope',
    prompt: 'Dramatic close-up photograph of a modern optical microscope in a biology laboratory with a cell slide under the lens. Glowing blue-green light from the eyepiece. Dark moody background with subtle bokeh of lab equipment. DSLR quality, cinematic lighting. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'lysosome-infographic',
    prompt: 'Minimal scientific infographic of a lysosome organelle on a pure dark navy background (#0a0f2e). Clean cross-section showing a single-membrane sphere filled with small coloured enzyme dots (green, yellow, orange). Simple, elegant, minimal detail — just the membrane and enzyme contents. Educational biology diagram style. Soft glow around the organelle. Absolutely no text, labels, arrows, or watermarks.',
  },
  {
    name: 'ribosome-infographic',
    prompt: 'Minimal scientific infographic of a ribosome on a pure dark navy background (#0a0f2e). Clean diagram showing the large subunit (darker blue) and small subunit (lighter blue) sitting on a thin mRNA strand (golden thread running horizontally). Simple, elegant, minimal detail. Educational biology diagram style. Soft cyan glow around the ribosome. Absolutely no text, labels, arrows, or watermarks.',
  },
  {
    name: 'cell-organelles',
    prompt: 'Minimal scientific illustration of an animal cell on a dark navy background. Semi-transparent cell membrane revealing colour-coded organelles inside: nucleus (purple), mitochondria (red-orange), lysosomes (green dots), ribosomes (tiny cyan dots), endoplasmic reticulum (blue network). Clean, modern, educational style with soft glows. Not too busy — just the key organelles visible. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'homogenisation',
    prompt: 'Close-up photograph of a laboratory tissue homogeniser (glass pestle and mortar or electric blender) processing pink biological tissue in a clear cold buffer solution. Ice bucket visible nearby. Dark lab bench, dramatic side-lighting. Clean, clinical, educational. DSLR quality. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'filtration',
    prompt: 'Close-up photograph of a biology laboratory filtration setup: cell suspension being poured through muslin/gauze cloth into a beaker below. The filtrate is slightly pink/cloudy. Clean dark laboratory bench, dramatic lighting. Educational biology practical. DSLR quality. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'centrifuge-tubes',
    prompt: 'Minimal scientific infographic showing 4 centrifuge test tubes side by side on a dark navy background. Each tube shows a different stage of cell fractionation: first tube has large pellet at bottom (nuclei, purple), second has medium pellet (mitochondria, orange), third has small pellet (lysosomes, green), fourth has tiny pellet (ribosomes, cyan). Clear supernatant above each pellet. Clean, minimal, colour-coded. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'centrifuge-machine',
    prompt: 'Dramatic photograph of a modern laboratory ultracentrifuge machine with its lid open showing the rotor inside. Dark laboratory background with blue LED accent lighting. Clean, high-tech, scientific equipment. DSLR quality, cinematic lighting. Absolutely no text, labels, or watermarks.',
  },
  {
    name: 'thumbnail',
    prompt: 'Scientific cover image for a biology video about cell fractionation: a centrifuge tube in the center with 4 distinct coloured layers (purple nucleus at bottom, orange mitochondria, green lysosomes, cyan ribosomes at top). Dramatic dark background with soft glowing light effects. Modern, clean, cinematic style. Like a movie poster for biology. Absolutely no text, labels, or watermarks.',
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
  const audioPath = path.join(AUDIO_DIR, 'cell-fractionation-narration.mp3');

  try {
    const voiceId = 'gYWKdgLtqjPO3D5uDrDP'; // Same voice as food tests
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
