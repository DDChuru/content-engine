/**
 * Generate Biology Biomolecules Lesson Assets
 *
 * Generates:
 * 1. Gemini images for each slide background (9 images, ~$0.35)
 * 2. ElevenLabs narration for each slide (9 audio files, ~$0.90)
 *
 * Usage: npx tsx src/scripts/generate-biology-assets.ts [--images-only] [--narration-only] [--slide N]
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { GeminiImageGenerator } from '../services/gemini-image-generator';
import { VoiceCloning } from '../services/voice-cloning';

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const PROJECT_DIR = path.resolve(__dirname, '../../projects/biology-biomolecules');
const VISUALS_DIR = path.join(PROJECT_DIR, 'visuals');
const AUDIO_DIR = path.join(PROJECT_DIR, 'audio');

// Remotion public dirs (for staticFile() access during rendering)
const REMOTION_IMAGES_DIR = path.resolve(__dirname, '../remotion/public/images/biology');
const REMOTION_AUDIO_DIR = path.resolve(__dirname, '../remotion/public/audio/biology');

// Voice ID for narration
const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';

// Image prompts — highly specific for biology education
const IMAGE_PROMPTS: { slideNum: number; filename: string; prompt: string }[] = [
  {
    slideNum: 1,
    filename: 'slide-01-intro',
    prompt: `Create a stunning dark blue science background for a biology lesson introduction.
Visual elements: Abstract molecular structures floating in space, carbon atoms with four bonds shown as glowing nodes, subtle DNA helix in the background, organic chemistry patterns.
Color palette: Deep navy (#0a1428), electric cyan (#00d9ff), soft purple (#6610f2), warm gold accents.
Style: Modern, cinematic, slightly futuristic. Like a science documentary opening.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1920x1080 video background. Subtle and supportive, not distracting.`
  },
  {
    slideNum: 2,
    filename: 'slide-02-tests',
    prompt: `Create a laboratory-themed background for biochemical testing.
Visual elements: Glass test tubes and beakers in a row, each containing different coloured liquids — blue, brick-red, blue-black, milky-white, purple/lilac. Subtle Bunsen burner glow. Clean lab bench surface. Benedict's test colour gradient from blue to red.
Color palette: Lab whites, warm amber lighting, colourful reagent solutions.
Style: Clean, professional laboratory photography style. Slightly blurred background.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO LABELS — PURE VISUAL ONLY
Professional 1920x1080 video background.`
  },
  {
    slideNum: 3,
    filename: 'slide-03-carbohydrates',
    prompt: `Create a molecular biology background showing carbohydrate structures.
Visual elements: Hexagonal glucose ring structures (alpha and beta forms) rendered as glowing molecular models, chains of sugar rings linking together to form polysaccharides, starch granules, cellulose microfibrils in a plant cell wall. Condensation reaction water droplets.
Color palette: Warm amber, honey gold, green accents for plant storage, teal highlights.
Style: Scientific illustration meets modern infographic. Clean, educational.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1920x1080 video background.`
  },
  {
    slideNum: 4,
    filename: 'slide-04-lipids',
    prompt: `Create a molecular biology background showing lipid structures.
Visual elements: Triglyceride molecule (glycerol backbone + three fatty acid tails), phospholipid bilayer cross-section showing the dual layer of cell membranes, saturated straight chains vs unsaturated kinked chains side by side. Oil droplets, membrane curvature.
Color palette: Golden yellows, orange, warm cream, with blue/cyan for the phospholipid heads.
Style: 3D molecular visualization, semi-transparent, luminous. Educational but beautiful.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1920x1080 video background.`
  },
  {
    slideNum: 5,
    filename: 'slide-05-amino-acids',
    prompt: `Create a molecular biology background showing amino acid and protein formation.
Visual elements: Single amino acid structure with its four groups radiating from a central carbon, peptide bond formation shown as two amino acids joining together with a water molecule leaving, a growing polypeptide chain. Different coloured R-groups showing variety.
Color palette: Rich purple, magenta, electric blue, with warm protein-fold colours.
Style: Elegant molecular art. Like a biochemistry textbook cover brought to life.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1920x1080 video background.`
  },
  {
    slideNum: 6,
    filename: 'slide-06-protein-structure',
    prompt: `Create a molecular biology background showing the four levels of protein structure.
Visual elements: Show progression from a straight chain (primary) → alpha helix coil and beta pleated sheet ribbons (secondary) → a complex folded 3D globular shape (tertiary) → multiple subunits assembled together like haemoglobin (quaternary). Rainbow colour gradient through the chain. Hydrogen bonds as dotted connections.
Color palette: Rainbow spectrum along the protein chain, dark background, glowing bond connections.
Style: 3D protein visualization, like PyMOL or molecular dynamics rendering. Cinematic.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1920x1080 video background.`
  },
  {
    slideNum: 7,
    filename: 'slide-07-globular-fibrous',
    prompt: `Create a split-screen molecular biology background comparing two protein types.
Left side: A compact, spherical globular protein (like haemoglobin) with four subunits in red/blue, showing the haem group with iron at the centre glowing orange.
Right side: Long, rope-like fibrous protein (like collagen) showing three chains twisted around each other in a triple helix, with cross-links between molecules.
Color palette: Left: warm reds, blues (haemoglobin). Right: ivory, cream, gold (collagen).
Style: Side-by-side comparison, slightly different lighting for each side.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1920x1080 video background.`
  },
  {
    slideNum: 8,
    filename: 'slide-08-water',
    prompt: `Create a molecular biology background showing water molecule properties.
Visual elements: Beautiful cluster of water molecules showing hydrogen bonds as dotted lines between them, partial charges (delta positive and negative shown as subtle colour gradients on atoms), a dissolving salt crystal with ions being surrounded by water molecules (hydration shells), water droplets with surface tension.
Color palette: Crystal clear blues, soft white, aquamarine, with warm oxygen-red accents.
Style: Crystal-clear 3D rendering, like looking through pure water at a molecular scale. Serene and scientific.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1920x1080 video background.`
  },
  {
    slideNum: 9,
    filename: 'slide-09-summary',
    prompt: `Create a biology lesson summary background bringing all biomolecules together.
Visual elements: A composite scene with glucose rings, triglyceride molecules, protein ribbons, and water molecules all floating together in a harmonious molecular landscape. A DNA helix subtly in the background connecting everything. Warm, conclusive feeling.
Color palette: Rich blend of all previous slides — golden carbs, amber lipids, purple proteins, blue water — unified by a deep navy background.
Style: Grand finale, cinematic wide shot of a molecular world. Like the final frame of a science documentary.

🚫 NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — PURE VISUAL ONLY
Professional 1920x1080 video background.`
  }
];

async function loadManifest() {
  const manifestPath = path.join(PROJECT_DIR, 'manifest.json');
  const data = await fs.readFile(manifestPath, 'utf-8');
  return JSON.parse(data);
}

function stripCueMarkers(text: string): string {
  return text.replace(/\{\{cue:([^}]+)\}\}/g, '$1');
}

async function generateImages() {
  console.log('\n🎨 === GENERATING GEMINI IMAGES ===\n');

  const gemini = new GeminiImageGenerator(process.env.GEMINI_API_KEY!);
  await fs.mkdir(REMOTION_IMAGES_DIR, { recursive: true });
  let totalCost = 0;

  for (const img of IMAGE_PROMPTS) {
    console.log(`\n📸 Slide ${img.slideNum}: ${img.filename}`);

    const result = await gemini.generateDirect({
      prompt: img.prompt,
      outputDir: VISUALS_DIR,
      filename: img.filename,
      aspectRatio: '16:9'
    });

    if (result.success && result.imagePath) {
      console.log(`   ✅ Saved: ${result.imagePath}`);
      totalCost += result.cost;

      // Copy to Remotion public dir for staticFile() access
      const ext = path.extname(result.imagePath);
      const remotionPath = path.join(REMOTION_IMAGES_DIR, `${img.filename}${ext}`);
      await fs.copyFile(result.imagePath, remotionPath);
      console.log(`   📋 Copied to Remotion: ${remotionPath}`);
    } else {
      console.error(`   ❌ Failed: ${result.error}`);
    }

    // Rate limit delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n💰 Total image cost: $${totalCost.toFixed(3)}`);
  return totalCost;
}

async function generateNarration() {
  console.log('\n🎙️ === GENERATING ELEVENLABS NARRATION ===\n');

  const voice = new VoiceCloning(process.env.ELEVENLABS_API_KEY!);
  const manifest = await loadManifest();

  // Verify voice exists
  const voiceInfo = await voice.getVoice(VOICE_ID);
  if (!voiceInfo) {
    console.error(`❌ Voice not found: ${VOICE_ID}`);
    console.log('Available voices:');
    const voices = await voice.listVoices();
    voices.forEach(v => console.log(`  - ${v.name}: ${v.voiceId}`));
    return 0;
  }
  console.log(`✅ Using voice: ${voiceInfo.name} (${voiceInfo.voiceId})\n`);

  const segments = manifest.slides.map((slide: any) => ({
    text: stripCueMarkers(slide.narration.text),
    filename: `slide-${String(slide.slideNum).padStart(2, '0')}.mp3`
  }));

  // Calculate character count for cost estimate
  const totalChars = segments.reduce((sum: number, s: any) => sum + s.text.length, 0);
  console.log(`📝 Total narration: ${totalChars} characters (~$${(totalChars * 0.30 / 1000).toFixed(2)})\n`);

  // Generate with custom audio dir
  const originalDir = (voice as any).audioDir;
  (voice as any).audioDir = AUDIO_DIR;
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  const paths = await voice.generateNarrationBatch(segments, VOICE_ID);

  // Copy audio to Remotion public dir
  await fs.mkdir(REMOTION_AUDIO_DIR, { recursive: true });
  for (const p of paths) {
    const filename = path.basename(p);
    const remotionPath = path.join(REMOTION_AUDIO_DIR, filename);
    await fs.copyFile(p, remotionPath);
    console.log(`   📋 Copied to Remotion: ${remotionPath}`);
  }

  console.log(`\n✅ Generated ${paths.length} audio files`);
  const cost = totalChars * 0.30 / 1000;
  console.log(`💰 Narration cost: ~$${cost.toFixed(2)}`);

  return cost;
}

async function main() {
  const args = process.argv.slice(2);
  const imagesOnly = args.includes('--images-only');
  const narrationOnly = args.includes('--narration-only');

  console.log('🧬 Biology Biomolecules — Asset Generation');
  console.log('==========================================\n');

  let imageCost = 0;
  let narrationCost = 0;

  if (!narrationOnly) {
    imageCost = await generateImages();
  }

  if (!imagesOnly) {
    narrationCost = await generateNarration();
  }

  console.log('\n==========================================');
  console.log('📊 COST SUMMARY');
  console.log(`   Images:    $${imageCost.toFixed(3)}`);
  console.log(`   Narration: $${narrationCost.toFixed(2)}`);
  console.log(`   TOTAL:     $${(imageCost + narrationCost).toFixed(2)}`);
  console.log('==========================================\n');

  console.log('✅ Next steps:');
  console.log('   1. Run transcription: npx tsx src/scripts/transcribe-biology.ts');
  console.log('   2. Build composition: BiologyBiomolecules.tsx');
  console.log('   3. Render video: npx remotion render BiologyBiomolecules');
}

main().catch(console.error);
