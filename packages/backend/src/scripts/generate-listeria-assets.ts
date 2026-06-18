/**
 * Generate narration + images for Listeria SA TikTok
 * Usage: npx tsx src/scripts/generate-listeria-assets.ts
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
const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/images/listeria-sa');

// ─── NARRATION ─────────────────────────────────────
const NARRATION = `This is the story of the deadliest Listeria outbreak in history. And it happened right here, in South Africa.

January twenty seventeen. Cases start appearing. Nobody knows yet.

July twenty seventeen. Doctors at two hospitals raise the alarm. Too many babies are getting sick with listeriosis.

The cases keep climbing. By November, forty-one people are getting infected in a single week.

December fifth, twenty seventeen. The Health Minister declares a national outbreak. Listeriosis becomes a notifiable disease. But they still don't know the source.

January twenty eighteen. Ten children at a nursery in Gauteng get sick. They all ate polony sandwiches. The polony tests positive for Listeria S T six.

February twenty eighteen. Investigators enter the Tiger Brands Enterprise factory in Polokwane. Forty-seven out of three hundred and seventeen samples test positive.

March fourth, twenty eighteen. The bombshell. Health Minister Motsoaledi names Enterprise Foods as the source. A massive product recall begins across the country.

But here's the twist. Tiger Brands reportedly knew about the contamination eighteen days before the government recall.

Within forty-eight hours, Botswana, Namibia, Mozambique, Malawi, Kenya and Zambia all ban South African meat imports.

The final count. One thousand and sixty-five confirmed cases. Two hundred and eighteen deaths. The largest Listeria outbreak the world has ever seen.

September twenty eighteen. The outbreak is officially declared over.

But the victims? As of twenty twenty-five, families have still not been compensated.

Follow and like for everything you need to know about food safety.`;

// ─── IMAGES ────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const STYLE = `Dark, dramatic, cinematic digital illustration. No text or words in the image. Moody lighting, high contrast. Photorealistic but slightly stylized.`;

const IMAGES = [
  {
    id: 'cover',
    prompt: `${STYLE} A dramatic TikTok cover image in portrait 9:16 format. A dark, ominous view of processed meat (polony/bologna sausage) on a cutting board, with a menacing green glow emanating from within it suggesting contamination. Biohazard atmosphere. Dark red and black color scheme with toxic green accents. Extremely dramatic and unsettling. A large factory silhouette looms in the foggy background.`,
  },
  {
    id: 'hospital',
    prompt: `${STYLE} A dimly lit hospital corridor in South Africa. Empty gurneys line the walls. Harsh fluorescent lights flicker. The atmosphere is tense and overwhelming. Medical staff in the distance wearing protective gear. The mood is somber and urgent. Blue and cold white color palette.`,
  },
  {
    id: 'factory',
    prompt: `${STYLE} Inside a large industrial meat processing factory. Stainless steel equipment, conveyor belts with processed meat products. The lighting is harsh industrial fluorescent. The factory looks sterile but ominous. One area has a subtle green/yellow contamination glow suggesting invisible danger. Wide angle shot showing the scale of production.`,
  },
  {
    id: 'recall',
    prompt: `${STYLE} Empty supermarket shelves in a South African grocery store where processed meat products have been removed. Yellow caution tape across the empty refrigerated section. A few scattered price tags remain. The scene is eerie and unsettling. The lighting is cold fluorescent. A "RECALL" notice is implied by the emptiness.`,
  },
  {
    id: 'microscope',
    prompt: `${STYLE} A dramatic close-up view through a microscope showing Listeria monocytogenes bacteria. Rod-shaped bacteria glowing in neon green against a deep black background. The bacteria look menacing and alien-like. Scientific but dramatic. Bioluminescent quality. Very detailed and high contrast.`,
  },
  {
    id: 'map',
    prompt: `${STYLE} A dark dramatic map of southern Africa with South Africa highlighted in deep red, showing the spread of a disease outbreak. Neighboring countries (Botswana, Namibia, Mozambique, Malawi, Kenya, Zambia) highlighted in orange showing they banned imports. Dark background with glowing borders. Satellite/night view aesthetic.`,
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
      stability: 0.4,        // Lower stability = more expressive, urgent
      similarity_boost: 0.78,
      style: 0.5,            // Higher style = more dramatic delivery
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
  console.log('=== Listeria SA TikTok Asset Generation ===\n');

  // Run narration and images in parallel
  await Promise.all([
    generateNarration(),
    generateImages(),
  ]);

  console.log('\nDone! All assets generated.');
}

main().catch(console.error);
