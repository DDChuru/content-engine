/**
 * Generate hook + cover images for Batch 4 Lysosome TikToks.
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
  // ── Endocytosis & Exocytosis ─────────────────────────────────────
  {
    topic: 'endocytosis',
    filename: 'endocytosis/hook-membrane.jpg',
    prompt: `Dramatic close-up of a cell membrane folding inward during endocytosis. The phospholipid bilayer is bending, forming a pocket that is about to pinch off into a vesicle. A glowing substance is being engulfed. Dark navy background with cyan and magenta bioluminescent lighting. Photorealistic molecular biology visualization. Cinematic, shallow depth of field. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  {
    topic: 'endocytosis',
    filename: 'endocytosis/cover-endo-exo.jpg',
    prompt: `Split visualization showing endocytosis and exocytosis side by side. Left side: cell membrane folding inward, engulfing particles, forming a vesicle (endocytosis). Right side: a vesicle inside the cell fusing with the membrane, releasing contents outward (exocytosis). Arrows showing direction of movement. Dark background with glowing cyan and orange accents. Scientific illustration style, dramatic lighting. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  // ── Phagocytosis ─────────────────────────────────────────────────
  {
    topic: 'phagocytosis',
    filename: 'phagocytosis/hook-wbc.jpg',
    prompt: `Dramatic visualization of a white blood cell (neutrophil) extending pseudopods to engulf a glowing green bacterium. The phagocyte is large, translucent white-blue, with visible organelles inside. The bacterium is small, rod-shaped, glowing green. Dark background with dramatic backlighting. Electron microscopy style with artistic enhancement. Tension and action. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  {
    topic: 'phagocytosis',
    filename: 'phagocytosis/cover-phagocytosis.jpg',
    prompt: `Sequential visualization of phagocytosis in a white blood cell. Five stages visible: detection (cell approaching bacteria), attachment (cell touching bacteria), engulfment (pseudopods wrapping around), digestion (lysosome fusing, enzymes active inside), and waste expulsion. Arranged in a circular or flowing layout. Dark navy background, glowing white-blue cell, green bacteria. Scientific art style. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  // ── Autophagy & Autolysis ────────────────────────────────────────
  {
    topic: 'autophagy',
    filename: 'autophagy/hook-self-eat.jpg',
    prompt: `Dramatic visualization of a cell performing autophagy — a damaged mitochondrion being wrapped in a double membrane inside a cell. The mitochondrion is glowing orange-red (damaged), being enclosed by a translucent membrane forming an autophagosome. A lysosome (glowing purple sphere) approaches nearby ready to fuse. Dark background with dramatic bioluminescent lighting. Cinematic molecular biology art. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  {
    topic: 'autophagy',
    filename: 'autophagy/cover-autophagy.jpg',
    prompt: `Split comparison showing autophagy vs autolysis. Top half: orderly autophagy — a damaged organelle neatly wrapped in membrane, lysosome fusing gently, recycled building blocks flowing back into the cell. Calm, blue-purple tones. Bottom half: chaotic autolysis — a lysosome bursting open, enzymes flooding everywhere, cell structures dissolving, destruction. Red-orange tones, dramatic. Dark background. Scientific visualization. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
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
  console.log('═══ Biology Batch 4 — Lysosome Hook + Cover Images ═══');
  console.log(`Generating ${JOBS.length} images (~$${(JOBS.length * 0.039).toFixed(2)})\n`);

  let success = 0;
  for (const job of JOBS) {
    console.log(`── ${job.topic}: ${job.filename} ──`);
    if (success > 0) await new Promise(r => setTimeout(r, 1500));
    if (await generateImage(job)) success++;
  }

  console.log(`\n═══ Done: ${success}/${JOBS.length} generated ═══`);
  console.log(`Cost: ~$${(success * 0.039).toFixed(2)}`);
}

main().catch(console.error);
