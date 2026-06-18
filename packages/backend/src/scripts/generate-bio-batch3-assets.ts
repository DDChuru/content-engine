/**
 * Batch generate narration for 3 Biology TikToks:
 * 1. Enzymes — Lock & Key vs Induced Fit
 * 2. Osmosis — Cells Bursting
 * 3. Active Transport — Sodium-Potassium Pump
 *
 * Pure CSS compositions — only narration needed.
 * Estimated cost: ~$0.90 total (3 × ~$0.30 ElevenLabs)
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
    id: 'enzymes',
    filename: 'enzymes-narration.mp3',
    text: `Your textbook lied to you about enzymes. Here's what actually happens.

Lock and key model. You were taught that the substrate fits perfectly into the enzyme — like a key in a lock. The active site is rigid. The substrate slots in. Product released. Simple.

But that's the simplified version.

Induced fit model — this is the real one. The enzyme's active site actually CHANGES SHAPE when the substrate approaches. It moulds around the substrate. Like a hand closing around a ball. This puts strain on the bonds — lowering the activation energy.

That's what enzymes really do. They lower the activation energy. The reaction still happens — just WAY faster. We're talking millions of times faster.

Now — what kills an enzyme? Temperature.

Low temperature — molecules move slowly. Few collisions. Low rate of reaction.

As temperature increases — more kinetic energy, more collisions, rate increases.

Optimum temperature — maximum rate. For human enzymes, that's about 37 degrees.

Above the optimum — vibrations break the hydrogen bonds holding the tertiary structure. The active site changes shape permanently. The substrate no longer fits. The enzyme is denatured. Not destroyed — denatured.

Same thing happens with pH. Too acidic or too alkaline — the ionic bonds break. Active site distorted. Enzyme denatured.

Induced fit, not lock and key. Denatured, not destroyed. Get these right — guaranteed marks.`,
  },
  {
    id: 'osmosis',
    filename: 'osmosis-narration.mp3',
    text: `Watch what happens when you put a red blood cell in pure water.

It explodes. That's osmosis — and it can kill cells.

Osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential — through a partially permeable membrane.

Not "from dilute to concentrated." That loses you marks. Say water potential.

Three solutions you need to know.

Hypotonic solution — more water outside the cell than inside. Water moves IN. The cell swells. In animal cells — it bursts. That's called lysis. In plant cells — the cell wall prevents bursting. The cell becomes turgid. Firm and swollen.

Isotonic solution — equal water potential inside and out. No net movement. The cell stays normal.

Hypertonic solution — less water outside. Water moves OUT. Animal cells shrink and wrinkle — that's crenation. Plant cells — the membrane pulls away from the cell wall. That's plasmolysis.

The classic exam question — the potato experiment. You measure mass change in potato chips placed in different sucrose concentrations. Where the line crosses zero — that's where the solution is isotonic with the potato cells.

Remember — water potential is measured in kilopascals. Pure water has a water potential of zero. Adding solute makes it more negative.

Lysis, crenation, plasmolysis. Know all three — that's your six marks.`,
  },
  {
    id: 'active-transport',
    filename: 'active-transport-narration.mp3',
    text: `Your cells spend 40 percent of their energy on this one process. Forty percent.

Active transport. The movement of molecules AGAINST the concentration gradient — from low to high concentration. This requires energy from ATP.

Why does it need energy? Because you're pushing molecules uphill. Diffusion goes downhill for free. Active transport fights the gradient.

The most important example — the sodium-potassium pump.

Here's how it works. Step one — three sodium ions bind inside the cell. Step two — ATP is hydrolysed. The phosphate group attaches to the pump. Step three — the pump changes shape. The sodium ions are released outside. Step four — two potassium ions bind outside. Step five — the phosphate detaches. The pump returns to its original shape. Step six — potassium ions released inside.

Three sodium out. Two potassium in. Every single cycle. This creates an electrochemical gradient across the membrane.

Why does this matter? Nerve impulses depend on it. Muscle contractions depend on it. Without this pump — your brain stops, your heart stops.

Active transport also happens in the gut — absorbing glucose and amino acids even when concentration is already higher in the blood.

And in root hair cells — absorbing mineral ions from the soil against the gradient.

Three sodium out, two potassium in, one ATP used. That's your exam answer.`,
  },
];

// ═══════════════════════════════════════════════════════════════════════

async function main() {
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  console.log('═══ Biology Batch 3 — Generating Narration ═══\n');
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
