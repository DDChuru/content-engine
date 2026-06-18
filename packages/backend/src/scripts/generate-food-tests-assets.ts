/**
 * Generate Biology Food Tests TikTok — Asset Generation
 *
 * Generates:
 * 1. Gemini images for each scene (12 images at 9:16, ~$0.47)
 * 2. ElevenLabs narration — single file (~$0.20)
 *
 * Usage: npx tsx src/scripts/generate-food-tests-assets.ts [--images-only] [--narration-only]
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { GeminiImageGenerator } from '../services/gemini-image-generator';
import { VoiceCloning } from '../services/voice-cloning';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const REMOTION_IMAGES_DIR = path.resolve(__dirname, '../remotion/public/images/biology/food-tests');
const REMOTION_AUDIO_DIR = path.resolve(__dirname, '../remotion/public/audio/biology');

const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';

// ── 12 Image Prompts — 9:16 vertical for TikTok ───────────────────

const IMAGE_PROMPTS: { id: string; filename: string; prompt: string }[] = [
  {
    id: 'hook-lab-bg',
    filename: 'hook-lab-bg',
    prompt: `Dark moody chemistry laboratory scene, dramatic lighting. Four glowing test tubes in a row — bright blue, brick-red, deep blue-black, milky-white. Neon reflections on the glass surfaces, atmospheric haze. Bunsen burner flame in background. Shot from low angle looking up at the tubes.
Color palette: Deep black background, cyan and magenta neon highlights, warm amber flame glow.
Style: Cinematic, dramatic, TikTok aesthetic. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1080x1920 vertical video background.`
  },
  {
    id: 'benedicts-sample',
    filename: 'benedicts-sample',
    prompt: `Close-up of a clear liquid sample in a glass test tube, held by metal tongs. Clean laboratory background with soft lighting. The tube is slightly tilted, showing the clear solution inside. A bright blue Benedict's reagent bottle is visible in the background, slightly blurred.
Style: Clean macro photography, shallow depth of field. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'benedicts-reagent',
    filename: 'benedicts-reagent',
    prompt: `Dramatic close-up of bright cobalt-blue Benedict's solution being poured from a dropper into a test tube containing a clear sample. The blue liquid streams down creating beautiful swirling patterns as it mixes. Light catches the blue solution making it glow.
Style: High-speed photography feel, vivid colours. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'benedicts-heating',
    filename: 'benedicts-heating',
    prompt: `Test tube being heated over a Bunsen burner flame, showing the moment of colour change. The solution inside is transitioning from blue at the top to green in the middle, with hints of yellow at the bottom where it's hottest. Steam rising from the tube. Orange flame visible below.
Style: Dynamic, action shot. Warm lighting, vivid colour gradient. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'benedicts-result',
    filename: 'benedicts-result',
    prompt: `Five test tubes in a rack showing the complete Benedict's test colour gradient from left to right: brilliant blue (negative), green (trace), yellow (low), orange (moderate), brick-red precipitate (high concentration). Each tube clearly shows a different colour. Clean white background.
Style: Clean, educational, satisfying colour gradient. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'iodine-reagent',
    filename: 'iodine-reagent',
    prompt: `Close-up of brown-amber iodine solution being dropped from a pipette onto a white spot plate or white food sample. The brown drops are clearly visible against the white surface. A few drops have already landed, showing brown circles on the plate.
Style: Overhead angle, clean macro photography. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'iodine-result',
    filename: 'iodine-result',
    prompt: `Dramatic close-up showing a deep blue-black colour reaction on a white surface — the positive iodine test for starch. The intense blue-black is surrounded by the original brown iodine colour where starch is absent. Striking contrast between the deep blue-black and the brown.
Style: Vivid, high-contrast, satisfying. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'emulsion-ethanol',
    filename: 'emulsion-ethanol',
    prompt: `Laboratory scene showing a test tube with a clear ethanol solution being poured into another tube containing water. The two liquids are beginning to mix, with the first wisps of cloudiness appearing at the boundary. Clean glassware, professional lab setting.
Style: Clean, precise laboratory photography. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'emulsion-result',
    filename: 'emulsion-result',
    prompt: `Two test tubes side by side. Left tube: a milky-white cloudy emulsion (positive test for lipids), opaque and creamy looking. Right tube: perfectly clear solution (negative control). The contrast between the milky-white and the clear solution is striking.
Style: Clean comparison shot, excellent lighting. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'biuret-reagents',
    filename: 'biuret-reagents',
    prompt: `Two reagent bottles being added to a test tube: one clear solution (sodium hydroxide/NaOH) and one bright blue solution (copper sulfate/CuSO4). The blue copper sulfate is being dropped into the sample that already has NaOH. Beautiful blue drops falling into the tube.
Style: Action shot with two reagent additions. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'biuret-result',
    filename: 'biuret-result',
    prompt: `Two test tubes side by side. Left tube: beautiful purple/lilac/violet colour (positive biuret test for protein, showing peptide bonds detected). Right tube: pale blue (negative, no protein). The purple is rich and distinct from the blue.
Style: Clean comparison, vivid purple vs pale blue. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
  {
    id: 'thumbnail',
    filename: 'thumbnail',
    prompt: `Four-quadrant split image showing four dramatic test tube results. Top-left: brick-red precipitate (Benedict's). Top-right: deep blue-black (iodine). Bottom-left: milky-white emulsion. Bottom-right: purple/lilac (biuret). Each quadrant has a different coloured glow. Dark dividing lines between quadrants.
Style: Bold, punchy, TikTok thumbnail aesthetic. Portrait orientation (9:16).

🚫 NO TEXT, NO WORDS, NO LETTERS — PURE VISUAL ONLY
Professional 1080x1920 vertical.`
  },
];

// ── Narration Script (single file, ~680 chars) ─────────────────────

const NARRATION_SCRIPT = `Four food tests. Four colour changes. Let's go.

First up — Benedict's test for reducing sugars.
Add your sample to Benedict's reagent — that bright blue solution.
Heat it in a water bath.
Watch the colour shift — blue to green,
to yellow, to orange,
all the way to brick-red.
The more sugar, the further the colour change.

Next — iodine test for starch.
Drop iodine solution onto your sample.
Iodine starts brown.
If starch is present — boom — blue-black.

Third — the emulsion test for lipids.
Dissolve your sample in ethanol, then pour into water.
If lipids are present, you get a milky-white emulsion.

Finally — the Biuret test for proteins.
Add sodium hydroxide, then copper sulfate solution.
Stays blue? No protein.
Turns purple? Peptide bonds detected.

Four tests. Four results.
Save this — you WILL need it for your exam.`;

// ── Main ──────────────────────────────────────────────────────────

async function generateImages() {
  console.log('\n🎨 === GENERATING 12 GEMINI IMAGES (9:16) ===\n');

  const gemini = new GeminiImageGenerator(process.env.GEMINI_API_KEY!);
  await fs.mkdir(REMOTION_IMAGES_DIR, { recursive: true });
  let totalCost = 0;

  for (const img of IMAGE_PROMPTS) {
    console.log(`📸 ${img.id}: ${img.filename}`);

    const result = await gemini.generateDirect({
      prompt: img.prompt,
      outputDir: REMOTION_IMAGES_DIR,
      filename: img.filename,
      aspectRatio: '9:16',
    });

    if (result.success && result.imagePath) {
      console.log(`   ✅ Saved: ${result.imagePath}`);
      totalCost += result.cost;
    } else {
      console.error(`   ❌ Failed: ${result.error}`);
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n💰 Total image cost: $${totalCost.toFixed(3)}`);
  return totalCost;
}

async function generateNarration() {
  console.log('\n🎙️ === GENERATING ELEVENLABS NARRATION ===\n');

  const voice = new VoiceCloning(process.env.ELEVENLABS_API_KEY!);

  const voiceInfo = await voice.getVoice(VOICE_ID);
  if (!voiceInfo) {
    console.error(`❌ Voice not found: ${VOICE_ID}`);
    const voices = await voice.listVoices();
    voices.forEach(v => console.log(`  - ${v.name}: ${v.voiceId}`));
    return 0;
  }
  console.log(`✅ Using voice: ${voiceInfo.name}\n`);

  const charCount = NARRATION_SCRIPT.length;
  console.log(`📝 Script: ${charCount} characters (~$${(charCount * 0.30 / 1000).toFixed(2)})\n`);

  await fs.mkdir(REMOTION_AUDIO_DIR, { recursive: true });

  const audioPath = path.join(REMOTION_AUDIO_DIR, 'food-tests-narration.mp3');

  // Generate single narration file
  const result = await voice.generateSpeech({
    text: NARRATION_SCRIPT,
    voiceId: VOICE_ID,
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.2,
  });

  if (result) {
    await fs.writeFile(audioPath, result);
    console.log(`✅ Saved: ${audioPath}`);
  } else {
    console.error('❌ Narration generation failed');
  }

  const cost = charCount * 0.30 / 1000;
  console.log(`💰 Narration cost: ~$${cost.toFixed(2)}`);
  return cost;
}

async function main() {
  const args = process.argv.slice(2);
  const imagesOnly = args.includes('--images-only');
  const narrationOnly = args.includes('--narration-only');

  console.log('🧪 Biology Food Tests TikTok — Asset Generation');
  console.log('================================================\n');

  let imageCost = 0;
  let narrationCost = 0;

  if (!narrationOnly) {
    imageCost = await generateImages();
  }

  if (!imagesOnly) {
    narrationCost = await generateNarration();
  }

  console.log('\n================================================');
  console.log('📊 COST SUMMARY');
  console.log(`   Images (12):   $${imageCost.toFixed(3)}`);
  console.log(`   Narration (1): $${narrationCost.toFixed(2)}`);
  console.log(`   TOTAL:         $${(imageCost + narrationCost).toFixed(2)}`);
  console.log('================================================\n');

  console.log('✅ Next steps:');
  console.log('   1. Transcribe: npx tsx src/scripts/transcribe-biology.ts --food-tests');
  console.log('   2. Preview:    npx remotion studio (select BiologyFoodTests-TikTok)');
  console.log('   3. Render:     npx remotion render BiologyFoodTests-TikTok');
}

main().catch(console.error);
