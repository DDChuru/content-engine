/**
 * Generate hook + cover images for Batch 3 Biology TikToks.
 * 6 images total: 3 hooks + 3 covers.
 * ~$0.24 total (6 × $0.039)
 */
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const IMG_DIR = path.resolve(__dirname, '../remotion/public/images/biology');

interface ImageJob {
  topic: string;
  filename: string;
  prompt: string;
  aspectRatio: '9:16';
}

const JOBS: ImageJob[] = [
  // ── Enzymes ────────────────────────────────────────────────────
  {
    topic: 'enzymes',
    filename: 'enzymes/hook-enzyme.jpg',
    prompt: `Dramatic scientific visualization of a glowing enzyme protein structure with a substrate molecule approaching the active site. Dark navy background with cyan bioluminescent glow. The enzyme should look like a large complex 3D protein with a visible cleft (active site). Photorealistic molecular biology style. Cinematic lighting, shallow depth of field. No text, no labels, no watermarks. Portrait orientation.`,
  },
  {
    topic: 'enzymes',
    filename: 'enzymes/cover-enzyme.jpg',
    prompt: `Split comparison image for educational content. Left side: rigid lock-and-key enzyme model, mechanical, cold blue lighting, structured. Right side: flexible induced-fit enzyme model, warm green glow, organic, the enzyme is visibly morphing around the substrate. Dark background. Scientific illustration style with dramatic lighting. Bold visual contrast between the two sides. No text, no labels, no watermarks. Portrait orientation.`,
  },
  // ── Osmosis ────────────────────────────────────────────────────
  {
    topic: 'osmosis',
    filename: 'osmosis/hook-cell-burst.jpg',
    prompt: `Dramatic microscope view of a red blood cell about to burst (lysis) in a hypotonic solution. The cell is swollen, translucent, glowing pink-red, stretched to its limit. Tiny water droplets visible around it. Dark background with dramatic backlighting. Photorealistic electron microscopy style with artistic enhancement. Tension and drama. No text, no labels, no watermarks. Portrait orientation.`,
  },
  {
    topic: 'osmosis',
    filename: 'osmosis/cover-osmosis.jpg',
    prompt: `Three red blood cells side by side showing osmosis effects. Left cell: swollen and about to burst (lysis), glowing bright red. Center cell: normal healthy biconcave shape, calm. Right cell: shrunken and wrinkled (crenation), dark. Water molecules (small blue spheres) flowing toward the swollen cell. Dark navy background with dramatic lighting. Scientific visualization, photorealistic. No text, no labels, no watermarks. Portrait orientation.`,
  },
  // ── Active Transport ───────────────────────────────────────────
  {
    topic: 'active-transport',
    filename: 'active-transport/hook-pump.jpg',
    prompt: `Dramatic cross-section of a cell membrane showing the sodium-potassium pump protein channel. Glowing orange sodium ions (Na+) moving out through the channel, glowing purple potassium ions (K+) moving in. ATP molecule providing energy shown as a bright cyan spark. The membrane is a phospholipid bilayer with realistic molecular detail. Dark background, cinematic neon lighting. Scientific visualization, photorealistic. No text, no labels, no watermarks. Portrait orientation.`,
  },
  {
    topic: 'active-transport',
    filename: 'active-transport/cover-transport.jpg',
    prompt: `Bird's eye view of a cell membrane with multiple sodium-potassium pumps actively working. Streams of glowing orange ions flowing outward and purple ions flowing inward through protein channels. Energy sparks (cyan) at each pump. The membrane stretches into the distance. Dark background with dramatic bioluminescent lighting. Looks like a busy highway of molecular traffic. Scientific art, cinematic. No text, no labels, no watermarks. Portrait orientation.`,
  },
];

async function generateImage(job: ImageJob): Promise<boolean> {
  const outputPath = path.join(IMG_DIR, job.filename);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: job.prompt,
      config: {
        responseModalities: ['image', 'text'],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    );

    if (imagePart?.inlineData?.data) {
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      await fs.writeFile(outputPath, imageBuffer);
      console.log(`  ✓ ${job.filename} (${(imageBuffer.length / 1024).toFixed(0)} KB)`);
      return true;
    } else {
      console.log(`  ✗ ${job.filename} — no image in response`);
      return false;
    }
  } catch (err: any) {
    console.log(`  ✗ ${job.filename} — ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('═══ Biology Batch 3 — Hook + Cover Images ═══');
  console.log(`Generating ${JOBS.length} images (~$${(JOBS.length * 0.039).toFixed(2)})\n`);

  let success = 0;
  for (const job of JOBS) {
    console.log(`── ${job.topic}: ${job.filename} ──`);
    // Rate limit: 1s between requests
    if (success > 0) await new Promise(r => setTimeout(r, 1500));
    if (await generateImage(job)) success++;
  }

  console.log(`\n═══ Done: ${success}/${JOBS.length} generated ═══`);
  console.log(`Cost: ~$${(success * 0.039).toFixed(2)}`);
}

main().catch(console.error);
