/**
 * Generate hook + cover images for Batch 5 Cell Structure TikToks.
 * 8 images total: 4 hooks + 4 covers.
 * ~$0.31 total (8 × $0.039)
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
  // ── Microscopes ────────────────────────────────────────────────────
  {
    topic: 'microscopes',
    filename: 'microscopes/hook-lens.jpg',
    prompt: `Dramatic close-up of a microscope objective lens with a glowing specimen below. Light beam passing through the lens creating a cone of illumination. The specimen shows a blurry cell becoming sharp and detailed — visualizing the concept of resolution. Dark laboratory background with dramatic rim lighting. Photorealistic scientific photography. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  {
    topic: 'microscopes',
    filename: 'microscopes/cover-microscopes.jpg',
    prompt: `Split comparison of light microscope vs electron microscope views. Top: a light microscope image of a cell — you can see the nucleus and cell membrane, limited detail, colorful. Bottom: an electron microscope image of the same cell — incredible detail showing ribosomes, ER membranes, cristae inside mitochondria, grayscale with false color highlights. The contrast shows resolution difference dramatically. Dark background. Scientific visualization. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  // ── Animal Cell ────────────────────────────────────────────────────
  {
    topic: 'animal-cell',
    filename: 'animal-cell/hook-organelles.jpg',
    prompt: `Stunning cutaway of an animal cell revealing all internal organelles glowing with bioluminescent light. The nucleus glows blue at the center, mitochondria glow orange, rough ER appears as sheets studded with bright dots (ribosomes), Golgi stacks glow green, lysosomes glow purple. The cell membrane is translucent. Dark black background. Cinematic 3D render style, volumetric lighting. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  {
    topic: 'animal-cell',
    filename: 'animal-cell/cover-animal-cell.jpg',
    prompt: `Beautiful detailed cross-section of a complete animal cell showing all major organelles clearly visible and labeled by color-coding only. Nucleus (blue), nucleolus inside, nuclear pores visible. Mitochondria (orange) with cristae folds. Rough ER (purple) with ribosomes. Smooth ER (teal). Golgi apparatus (green) with vesicles. Lysosomes (red). Centrioles (yellow). Free ribosomes scattered. Cell membrane enclosing everything. Dark navy background. Professional scientific illustration. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  // ── Plant Cell ─────────────────────────────────────────────────────
  {
    topic: 'plant-cell',
    filename: 'plant-cell/hook-chloroplast.jpg',
    prompt: `Dramatic close-up of a chloroplast with visible internal structure — stacked thylakoid membranes (grana) glowing bright green, stroma visible between stacks, double membrane clearly shown. Light rays entering the chloroplast and being absorbed by chlorophyll pigments, creating a beautiful green glow. Dark background with emerald and gold lighting. Molecular biology visualization. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  {
    topic: 'plant-cell',
    filename: 'plant-cell/cover-plant-cell.jpg',
    prompt: `Side-by-side comparison of an animal cell and a plant cell, both shown as detailed cross-sections. The plant cell has three highlighted extra structures: thick cellulose cell wall (outer border, tan/brown), large central vacuole (taking up most of the cell, light purple), and chloroplasts (bright green oval organelles). The animal cell is missing these three but has visible centrioles. Both cells share nucleus, mitochondria, ER, Golgi, ribosomes. Dark background. Professional scientific illustration. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  // ── Prokaryotes vs Eukaryotes ──────────────────────────────────────
  {
    topic: 'prokaryotes-eukaryotes',
    filename: 'prokaryotes-eukaryotes/hook-bacteria.jpg',
    prompt: `Dramatic visualization of a single bacterium (prokaryote) with visible internal structure — circular DNA visible in the nucleoid region (no membrane), ribosomes scattered throughout cytoplasm, thick peptidoglycan cell wall, flagellum extending from one end, pili covering the surface. The bacterium is glowing with cyan bioluminescent light against a dark background. Electron microscopy style with artistic color enhancement. No text, no labels, no watermarks. Portrait orientation.`,
    aspectRatio: '9:16',
  },
  {
    topic: 'prokaryotes-eukaryotes',
    filename: 'prokaryotes-eukaryotes/cover-comparison.jpg',
    prompt: `Size comparison of a prokaryotic cell and a eukaryotic cell side by side, drawn to relative scale — the eukaryote is roughly 10x larger. The eukaryotic cell (right) has a visible nucleus with nuclear envelope, mitochondria, ER, Golgi — complex internal structure. The prokaryotic cell (left) has no nucleus, circular DNA in the open cytoplasm, smaller ribosomes, a cell wall, and plasmids visible. Both cells shown as detailed cross-sections. Dark background with contrasting color schemes — blue/purple for eukaryote, green/cyan for prokaryote. Scientific illustration style. No text, no labels, no watermarks. Portrait orientation.`,
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
  console.log('═══ Biology Batch 5 — Cell Structure — Hook + Cover Images ═══');
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
