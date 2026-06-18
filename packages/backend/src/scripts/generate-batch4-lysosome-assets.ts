/**
 * Batch 4: Lysosome Functions — Narration Generation
 *
 * 3 TikToks:
 * 7. Endocytosis & Exocytosis — How Cells Eat & Spit
 * 8. Phagocytosis — How Cells Engulf & Destroy
 * 9. Autophagy & Autolysis — Self-Digestion
 *
 * Pure CSS compositions — only narration needed.
 * Estimated cost: ~$1.05 total (3 × ~$0.35 ElevenLabs)
 */
import { VoiceCloning } from '../services/voice-cloning';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const AUDIO_DIR = path.resolve(__dirname, '../remotion/public/audio/biology');
const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';

// ═══════════════════════════════════════════════════════════════════════
// NARRATION SCRIPTS
// ═══════════════════════════════════════════════════════════════════════

const SCRIPTS = [
  {
    id: 'endocytosis',
    filename: 'endocytosis-narration.mp3',
    text: `Your cells eat. They literally eat. Here's how.

Endocytosis. The cell membrane wraps around a substance — folds inward — and pinches off to form a vesicle. That substance is now INSIDE the cell, wrapped in membrane. That's how cells take in large molecules that can't pass through the membrane by diffusion.

There are two types. Phagocytosis — cell eating. For solid particles. Pinocytosis — cell drinking. For liquids.

Now the reverse — exocytosis. A vesicle inside the cell moves to the membrane. It fuses with it. The contents are released OUTSIDE. This is how cells secrete enzymes, hormones, and neurotransmitters.

Here's where lysosomes come in. When a cell engulfs something by endocytosis — the vesicle is called an endosome. A lysosome fuses with the endosome. The lysosome's hydrolytic enzymes break down the contents. Digestion — inside a cell.

The exam loves this sequence. Membrane folds inward. Vesicle forms. Lysosome fuses. Enzymes digest. Products absorbed or expelled.

Endocytosis in. Exocytosis out. Lysosomes do the digesting. Three marks — just like that.`,
  },
  {
    id: 'phagocytosis',
    filename: 'phagocytosis-narration.mp3',
    text: `A bacterium enters your blood. Within seconds — it's dead. Here's exactly how.

Phagocytosis. Phago means eat. Cyte means cell. A phagocyte literally eats the pathogen.

Step one — detection. The phagocyte recognises chemicals released by the bacterium. It moves toward it. This is chemotaxis.

Step two — attachment. The phagocyte's membrane receptors bind to antigens on the bacterium's surface.

Step three — engulfment. The membrane extends pseudopods around the bacterium. It wraps around it completely. The bacterium is now trapped inside a vesicle called a phagosome.

Step four — digestion. A lysosome fuses with the phagosome — forming a phagolysosome. The lysosome releases hydrolytic enzymes. These enzymes break down the bacterium into small molecules.

Step five — absorption. Useful molecules are absorbed into the cytoplasm. Waste is expelled by exocytosis.

But here's the exam trick — after digestion, the phagocyte presents the pathogen's antigens on its surface. It becomes an antigen-presenting cell. This triggers the adaptive immune response — B cells and T cells.

Detection. Attachment. Engulfment. Digestion. Antigen presentation. Know all five steps — that's your full marks.`,
  },
  {
    id: 'autophagy',
    filename: 'autophagy-narration.mp3',
    text: `Your cells eat themselves. On purpose. And it keeps you alive.

Autophagy. Auto means self. Phagy means eating. When an organelle is damaged or old — the cell wraps it in a double membrane. This creates an autophagosome. A lysosome fuses with it. The hydrolytic enzymes break down the organelle. The building blocks — amino acids, fatty acids — are recycled.

This is cellular recycling. It removes damaged mitochondria before they leak harmful molecules. It clears misfolded proteins. During starvation — the cell digests its own components for energy.

Now the destructive version — autolysis. When a cell needs to die — its lysosomes burst open. All the hydrolytic enzymes flood into the cytoplasm. They digest EVERYTHING. The entire cell self-destructs.

The classic exam example — the tadpole's tail. As a tadpole becomes a frog, autolysis destroys the tail cells. Programmed cell death. Controlled destruction.

Here's the distinction the exam tests. Autophagy — selective recycling. The cell survives. Autolysis — total self-destruction. The cell dies.

Autophagy recycles. Autolysis destroys. That distinction — guaranteed marks.`,
  },
];

// ═══════════════════════════════════════════════════════════════════════

async function main() {
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  console.log('═══ Biology Batch 4 — Lysosome Functions — Generating Narration ═══\n');
  console.log(`Voice ID: ${VOICE_ID}`);
  console.log(`Output: ${AUDIO_DIR}\n`);

  const voiceService = new VoiceCloning(process.env.ELEVENLABS_API_KEY!);
  let totalCost = 0;

  for (const script of SCRIPTS) {
    console.log(`── ${script.id} ──`);
    const audioPath = path.join(AUDIO_DIR, script.filename);

    try {
      const audioBuffer = await voiceService.generateSpeech({
        text: script.text,
        voiceId: VOICE_ID,
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.3,
      });
      await fs.writeFile(audioPath, audioBuffer);
      const charCount = script.text.length;
      const cost = (charCount / 1000) * 0.30;
      totalCost += cost;
      console.log(`  ✓ ${script.filename} (${(audioBuffer.length / 1024).toFixed(0)} KB)`);
      console.log(`    ${charCount} chars, ~$${cost.toFixed(2)}`);
    } catch (err: any) {
      console.error(`  ✗ ${script.id} FAILED: ${err.message}`);
    }
    console.log('');
  }

  console.log(`═══ Total cost: ~$${totalCost.toFixed(2)} ═══`);
}

main().catch(console.error);
