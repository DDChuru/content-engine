/**
 * Generate narration + summary images for Circle Basics 8 Styles TikTok
 * Usage: npx tsx src/scripts/generate-circle-basics-assets.ts
 */
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';
const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/images/circle-basics');

// ─── NARRATION ─────────────────────────────────────────
const NARRATION = `Stop. Before you tackle circle geometry in matric, you NEED to know these 8 terms. Get these wrong and every theorem becomes impossible.

Number one. Radius. A straight line from the centre of the circle to any point on the circumference.

Number two. Diameter. A line through the centre connecting two points on the circumference. Always double the radius. The longest chord possible.

Number three. Chord. Any straight line connecting two points on the circumference. Every diameter is a chord, but not every chord is a diameter.

Number four. Tangent. A line that touches the circle at exactly one point. It never enters the circle.

Number five. Arc. A portion of the circumference. Short way round is the minor arc. Long way round is the major arc.

Number six. Sector. Think pizza slice. The region between two radii and an arc.

Number seven. Segment. The region between a chord and its arc. Not the same as a sector. This one catches everyone.

Number eight. Secant. A line that cuts right through the circle, hitting two points. Like a chord but it extends beyond both sides.

Master these 8 terms and every circle theorem in your matric exam becomes ten times easier. Save this.`;

// ─── SUMMARY IMAGES ────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const STYLE = `Clean, modern educational diagram on a dark background (#0a0a1a). No text or words in the image. High contrast, precise geometric lines. Professional quality suitable for a TikTok educational video. Portrait orientation (9:16).`;

const IMAGES = [
  {
    id: 'summary-anatomy',
    prompt: `${STYLE} A large circle in the centre with ALL key geometric elements clearly shown and color-coded: a radius line in magenta, a diameter line in gold, a chord in yellow, a tangent line in red touching at one point with a right angle marker, a highlighted minor arc in blue and major arc in purple, a colored sector (pizza slice) in warm gradient, a shaded segment between a chord and arc, and a secant line in gold cutting through the circle extending beyond. Each element is a distinctly different bright color against the dark background. The circle is surrounded by clean space. Neon-style glow on the lines.`,
  },
  {
    id: 'summary-cheatsheet',
    prompt: `${STYLE} A 4x2 grid of 8 small circle diagrams, each showing one geometric concept. Top row left to right: (1) circle with a single line from centre to edge in magenta, (2) circle with a line through the centre in gold, (3) circle with a line connecting two edge points in yellow, (4) circle with a line touching at one point in red. Bottom row: (5) circle with a highlighted arc portion in blue/purple, (6) circle with a filled pie-slice sector in warm gradient, (7) circle with a shaded region between chord and arc, (8) circle with a line cutting through at two points extending beyond in gold. Dark background, each mini diagram has a subtle neon glow. Clean and minimal.`,
  },
];


async function generateNarration() {
  const outPath = path.join(OUTPUT_DIR, 'narration.mp3');
  if (fs.existsSync(outPath)) {
    console.log('Narration already exists, skipping.');
    return;
  }

  console.log(`Generating narration (${NARRATION.length} chars)...`);
  console.log(`Estimated cost: $${((NARRATION.length / 1000) * 0.30).toFixed(2)}`);

  const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

  const audio = await client.textToSpeech.convert(VOICE_ID, {
    text: NARRATION,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.45,
      similarity_boost: 0.78,
      style: 0.4,
      use_speaker_boost: true,
    },
  });

  const chunks: Uint8Array[] = [];
  for await (const chunk of audio) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  fs.writeFileSync(outPath, buffer);
  console.log(`Narration saved: ${outPath} (${(buffer.length / 1024).toFixed(0)}KB)`);
}


async function generateImages() {
  for (const img of IMAGES) {
    const outPath = path.join(OUTPUT_DIR, `${img.id}.png`);
    if (fs.existsSync(outPath)) {
      console.log(`Image ${img.id} already exists, skipping.`);
      continue;
    }

    console.log(`Generating image: ${img.id}...`);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: img.prompt,
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData,
      );

      if (imagePart?.inlineData?.data) {
        const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
        fs.writeFileSync(outPath, imageBuffer);
        console.log(`  Saved: ${img.id}.png (${(imageBuffer.length / 1024).toFixed(0)}KB)`);
      } else {
        console.log(`  WARNING: No image generated for ${img.id}`);
      }
    } catch (error: any) {
      console.error(`  ERROR: ${img.id}: ${error.message}`);
    }

    await new Promise((r) => setTimeout(r, 2000));
  }
}


async function main() {
  console.log('=== Circle Basics 8 Styles — Asset Generation ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  await Promise.all([
    generateNarration(),
    generateImages(),
  ]);

  console.log('\nDone! All assets generated.');
  console.log(`Estimated total cost: ~$${((NARRATION.length / 1000) * 0.30 + IMAGES.length * 0.039).toFixed(2)}`);
}

main().catch(console.error);
