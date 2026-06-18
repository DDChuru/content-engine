/**
 * Generate narration + cover images for Circle Theorems #2-#7
 * Usage: npx tsx src/scripts/generate-all-theorem-assets.ts
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
const BASE_DIR = path.resolve(__dirname, '../remotion/public/images');

// ═══════════════════════════════════════════════════════
// THEOREM DEFINITIONS
// ═══════════════════════════════════════════════════════

interface TheoremDef {
  id: string;
  title: string;
  narration: string;
  coverPrompt: string;
}

const THEOREMS: TheoremDef[] = [
  {
    id: 'theorem2-semicircle',
    title: 'Angle in a Semicircle',
    narration: `THEOREM NUMBER TWO. This one shows up in EVERY matric paper.

The Angle in a Semicircle. If the angle is subtended by a diameter, it's always ninety degrees. Always.

Here's our circle with diameter AB passing through centre O. Place point C anywhere on the circumference.

Draw lines from C to A and from C to B. The angle at C? Ninety degrees. A perfect right angle.

Move C anywhere on the semicircle. Top, side, close to A, close to B. The angle at C stays ninety. Every single time.

Why? Because the diameter is a special chord. The centre angle for a diameter is one eighty degrees. Half of one eighty? Ninety.

Exam question. AB is a diameter. Angle CAB is thirty degrees. Find angle ACB. Always ninety with a diameter. So angle ABC is sixty.

Reverse. Angle ACB equals ninety degrees. What can you conclude? AB must be a diameter.

Follow for theorem three. Save this series.`,
    coverPrompt: `Clean educational diagram on dark navy background (#1e3a5f). No text. Portrait 9:16. Blueprint technical drawing style with dashed lines. A circle with a horizontal diameter line. A point on the top of the circle with two lines drawn to the diameter endpoints, forming a right angle. A small square marks the 90-degree angle at the top. Light blue and gold color scheme. Dimension markers on the diameter. Professional technical drawing aesthetic.`,
  },
  {
    id: 'theorem3-same-segment',
    title: 'Angles in Same Segment',
    narration: `THEOREM NUMBER THREE. The one students always forget.

Angles in the Same Segment. Two angles subtended by the same arc, from the same segment, are equal.

Here's our circle. Chord AB divides it into two segments. Place point C in the major segment. Draw CA and CB.

Now place another point D in the same segment. Draw DA and DB. Angle ACB equals angle ADB. Same arc, same angle.

Watch. Move the points around in the same segment. Both angles stay equal. It doesn't matter where they sit, as long as they're on the same side.

Why? Each inscribed angle is half the centre angle for arc AB. Same arc means same centre angle. Half of equal is equal.

Exam question. Angle ACB is fifty degrees. D is in the same segment. Find angle ADB. Same segment means equal. Fifty degrees.

Now angle ADB is forty-two degrees. C is in the same segment as D. Find angle ACB. Forty-two degrees.

Follow for theorem four. Save this series.`,
    coverPrompt: `Clean educational diagram on very dark background (#0d1117). No text. Portrait 9:16. Shape morphing style with smooth flowing lines. A circle with a chord dividing it. Two points on the same side of the chord, each connected to the chord endpoints by lines, forming two equal angles. Purple and cyan color scheme with orange accents. Glowing smooth lines. The two angles are highlighted showing they are equal. Modern, flowing aesthetic.`,
  },
  {
    id: 'theorem4-cyclic-quad',
    title: 'Cyclic Quadrilateral',
    narration: `THEOREM NUMBER FOUR. This one is worth big marks.

Cyclic Quadrilateral. If all four vertices lie on the circle, opposite angles add up to one hundred and eighty degrees.

ABCD inscribed in the circle. Every vertex touches the circumference. That makes it cyclic.

Angle A plus angle C equals one eighty. Angle B plus angle D equals one eighty. Opposite pairs are supplementary.

Watch. Change the shape of the quadrilateral. Move the vertices. As long as all four points stay on the circle, opposite angles always sum to one eighty.

Why? Angle A subtends arc BCD. Angle C subtends arc BAD. Together those arcs make the full circle. Three sixty. Half of three sixty is one eighty.

Exam question. In cyclic quad ABCD, angle A is one hundred and ten degrees. Find angle C. One eighty minus one ten. Angle C equals seventy degrees.

Angle B is sixty-five degrees. Find angle D. One eighty minus sixty-five. Angle D equals one fifteen.

Follow for theorem five. Save this series.`,
    coverPrompt: `Clean educational diagram on dark green chalkboard background (#2d4a3e). No text. Portrait 9:16. Chalkboard style with chalk-like white and yellow lines. A circle with four points connected to form a quadrilateral inscribed in the circle. Opposite angles highlighted in different chalk colors (white and yellow). Thick chalk-like strokes. Green board texture. Classic education aesthetic.`,
  },
  {
    id: 'theorem5-tangent-radius',
    title: 'Tangent-Radius',
    narration: `THEOREM NUMBER FIVE. The foundation of every tangent question.

Tangent Radius Theorem. A tangent to a circle is perpendicular to the radius at the point of contact.

Here's our circle with centre O. Point P on the circumference. Draw the radius OP.

Now draw the tangent at P. It touches the circle at exactly one point. The angle between the tangent and the radius? Exactly ninety degrees.

Rotate the tangent point around the circle. At every position, the radius meets the tangent at ninety degrees. No exceptions.

Why? If the angle were not ninety, the line would enter the circle and become a secant. Ninety is the only angle that keeps the line touching at just one point.

Exam question. OT is a radius. Angle OTA is ninety. OT is five and TA is twelve. Find OA. Pythagoras. Five squared plus twelve squared. OA equals thirteen.

Given OA is ten and OT is six. Find TA. Ten squared minus six squared. TA equals eight.

Follow for theorem six. Save this series.`,
    coverPrompt: `Clean educational diagram on near-white background (#fafafa). No text. Portrait 9:16. Minimal line art style with thin precise dark lines. A circle with a radius drawn to a point on the circumference. A tangent line touching the circle at that point, perpendicular to the radius. A small square marks the 90-degree angle. Dark navy lines on white. Red accent on the tangent line. Elegant, minimal, sophisticated. Clean negative space.`,
  },
  {
    id: 'theorem6-two-tangents',
    title: 'Two Tangents',
    narration: `THEOREM NUMBER SIX. This shortcut saves real time in every exam.

Two Tangents Theorem. Two tangents drawn from the same external point are equal in length.

External point T outside the circle. Draw a tangent from T to point A on the circle. Draw another from T to point B.

TA equals TB. Always. The two tangent lengths from the same external point are identical.

But there is more. OA equals OB because both are radii. OT is common to both triangles. So triangle OTA is congruent to triangle OTB.

That means angle OTA equals angle OTB. The line OT bisects the angle ATB.

Exam question. TA is eight centimetres. Find TB. Equal tangents from same point. TB equals eight.

Angle ATB is fifty degrees. Find angle OTA. OT bisects the angle. Fifty divided by two. Angle OTA equals twenty-five degrees.

Follow for theorem seven. Save this series.`,
    coverPrompt: `Clean educational diagram on dark background (#0a0a1a). No text. Portrait 9:16. Gradient wave style with warm coral, yellow, and sky blue colors. A circle with a point outside it. Two lines from the external point tangent to the circle, touching at two different points. The two tangent lines are highlighted showing equal length. Warm gradient colors, dynamic and eye-catching. Glowing lines with coral-to-yellow gradient effect.`,
  },
  {
    id: 'theorem7-alt-segment',
    title: 'Alternate Segment',
    narration: `THEOREM NUMBER SEVEN. The hardest theorem. Master this and you have conquered circle geometry.

The Alternate Segment Theorem. The angle between a tangent and a chord equals the inscribed angle in the alternate segment.

Tangent at point A. Chord AB creates the tangent-chord angle.

Now look at the alternate segment. Point C on the other side of chord AB. The angle ACB equals the tangent-chord angle. Exactly.

Move C along the arc in the alternate segment. The angle stays the same. Always equal to the tangent-chord angle.

Why? Combine the tangent-radius theorem with the central angle theorem. The tangent-chord angle equals half the arc. Same as any inscribed angle in the alternate segment.

Exam question. Tangent-chord angle is forty degrees. Find the inscribed angle in the alternate segment. Equal. Forty degrees.

Inscribed angle is fifty-five degrees. Find the tangent-chord angle. Alternate segment theorem. Fifty-five degrees.

All seven theorems complete. Go ace that exam.`,
    coverPrompt: `Clean educational diagram on dark navy background (#1a1a2e). No text. Portrait 9:16. Glassmorphism style with frosted glass panels and soft mint/pink colors. A circle with a tangent line at one point. A chord from the tangent point to another point on the circle. The angle between the tangent and chord highlighted in mint. On the opposite side of the chord, a point on the circle connected to both chord endpoints, forming an equal angle highlighted in soft pink. Semi-transparent glass-like panels. Modern, elegant aesthetic.`,
  },
];

// ═══════════════════════════════════════════════════════
// GENERATION
// ═══════════════════════════════════════════════════════

const elevenLabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function generateNarration(theorem: TheoremDef): Promise<void> {
  const dir = path.join(BASE_DIR, theorem.id);
  const outPath = path.join(dir, 'narration.mp3');

  if (fs.existsSync(outPath)) {
    console.log(`  [${theorem.id}] Narration exists, skipping.`);
    return;
  }

  console.log(`  [${theorem.id}] Generating narration (${theorem.narration.length} chars)...`);

  const audio = await elevenLabs.textToSpeech.convert(VOICE_ID, {
    text: theorem.narration,
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
  console.log(`  [${theorem.id}] Narration saved (${(buffer.length / 1024).toFixed(0)}KB)`);
}

async function generateCover(theorem: TheoremDef): Promise<void> {
  const dir = path.join(BASE_DIR, theorem.id);
  const outPath = path.join(dir, 'cover.png');

  if (fs.existsSync(outPath)) {
    console.log(`  [${theorem.id}] Cover exists, skipping.`);
    return;
  }

  console.log(`  [${theorem.id}] Generating cover...`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: theorem.coverPrompt,
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData,
    );

    if (imagePart?.inlineData?.data) {
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      fs.writeFileSync(outPath, imageBuffer);
      console.log(`  [${theorem.id}] Cover saved (${(imageBuffer.length / 1024).toFixed(0)}KB)`);
    } else {
      console.log(`  [${theorem.id}] WARNING: No image generated`);
    }
  } catch (error: any) {
    console.error(`  [${theorem.id}] Cover ERROR: ${error.message}`);
  }
}

async function main() {
  console.log('=== Circle Theorems #2-#7 — Batch Asset Generation ===\n');

  const totalChars = THEOREMS.reduce((sum, t) => sum + t.narration.length, 0);
  const narrationCost = (totalChars / 1000) * 0.30;
  const coverCost = THEOREMS.length * 0.039;
  console.log(`Total narration: ${totalChars} chars (~$${narrationCost.toFixed(2)})`);
  console.log(`Total covers: ${THEOREMS.length} images (~$${coverCost.toFixed(2)})`);
  console.log(`Estimated total: ~$${(narrationCost + coverCost).toFixed(2)}\n`);

  // Create output dirs
  for (const t of THEOREMS) {
    fs.mkdirSync(path.join(BASE_DIR, t.id), { recursive: true });
  }

  // Generate narrations sequentially (ElevenLabs rate limits)
  console.log('--- Narrations ---');
  for (const t of THEOREMS) {
    await generateNarration(t);
    await new Promise((r) => setTimeout(r, 500));
  }

  // Generate covers with slight delay between (Gemini rate limits)
  console.log('\n--- Cover Images ---');
  for (const t of THEOREMS) {
    await generateCover(t);
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('\n=== Done! ===');
  console.log(`Total estimated cost: ~$${(narrationCost + coverCost).toFixed(2)}`);
}

main().catch(console.error);
