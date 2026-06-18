/**
 * Generate narration + cover for Circle Theorem #1: Central Angle
 * Usage: npx tsx src/scripts/generate-theorem1-assets.ts
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
const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/images/theorem1-central-angle');

// ─── NARRATION (~53s to match Manim) ─────────────────────
const NARRATION = `THEOREM NUMBER ONE. This one rule solves HALF your circle geometry exam.

The Central Angle Theorem. The angle at the centre is always double the angle at the circumference.

Here's our circle with centre O. Two radii to A and B. The angle at the centre? One hundred and twenty degrees.

Now add point C anywhere on the circumference. Draw lines to A and B. The inscribed angle at C? Sixty degrees. Exactly half.

Watch this. Move C along the major arc. The inscribed angle stays at sixty. Always half the centre.

Why does it work? OA, OB, OC are all radii. Equal lengths create isosceles triangles. Centre always equals two times circumference.

Exam time. Centre angle is one forty. Find x. Divide by two. x equals seventy degrees.

Now reverse it. Circumference angle is thirty five. Find y. Times two. y equals seventy.

Follow for theorem two. Save this series.`;


// ─── COVER IMAGE ─────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const COVER_PROMPT = `Clean, modern educational diagram on a dark background (#0a0a1a). No text or words in the image. Portrait orientation (9:16).

A large neon-glowing circle in cyan/electric blue. At the centre, a bright white dot. Two bright magenta lines (radii) from the centre to the circumference forming a wide angle, with a magenta arc showing the centre angle. On the opposite side of the circle, a point on the circumference with two pink/hot-pink lines going to the same two points, forming a smaller angle shown with a cyan arc. The centre angle visually appears twice as large as the circumference angle. Neon glow effects on all lines. Cyberpunk aesthetic. Dark navy/black background. Professional quality.`;


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


async function generateCover() {
  const outPath = path.join(OUTPUT_DIR, 'cover.png');
  if (fs.existsSync(outPath)) {
    console.log('Cover already exists, skipping.');
    return;
  }

  console.log('Generating cover image...');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: COVER_PROMPT,
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData,
    );

    if (imagePart?.inlineData?.data) {
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      fs.writeFileSync(outPath, imageBuffer);
      console.log(`Cover saved: ${outPath} (${(imageBuffer.length / 1024).toFixed(0)}KB)`);
    } else {
      console.log('WARNING: No image generated for cover');
    }
  } catch (error: any) {
    console.error(`ERROR generating cover: ${error.message}`);
  }
}


async function main() {
  console.log('=== Theorem #1: Central Angle — Asset Generation ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  await Promise.all([
    generateNarration(),
    generateCover(),
  ]);

  console.log('\nDone!');
  console.log(`Estimated cost: ~$${((NARRATION.length / 1000) * 0.30 + 0.039).toFixed(2)}`);
}

main().catch(console.error);
