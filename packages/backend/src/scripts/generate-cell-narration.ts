import { VoiceCloning } from '../services/voice-cloning';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const NARRATION = `How do you study something you can't even see?

Cell fractionation. Topic one, part two. Let's GO!

First, meet your organelles. Lysosomes — tiny bags of digestive enzymes that break down waste. Think of them as the cell's recycling center. Ribosomes — the protein factories. They read mRNA and build proteins, amino acid by amino acid.

But here's the challenge — they're all mixed together inside the cell. How do we separate them?

Step one: homogenisation. Blend the tissue in a cold, buffered, isotonic solution. Cold stops enzymes destroying your organelles. Isotonic stops them from bursting.

Step two: filter through gauze to remove cell debris. Keep the organelle suspension.

Step three: ultracentrifugation. This is where sedimentation happens. Spin at low speed — nuclei are heaviest, they sediment first. Pour off the supernatant. Spin faster — mitochondria sediment. Faster again — lysosomes settle out. Fastest spin — ribosomes, the smallest, settle last.

Homogenise, filter, centrifuge. Four spins, four fractions. That's cell fractionation.

Save this — guaranteed exam question.`;

async function main() {
  const vc = new VoiceCloning(process.env.ELEVENLABS_API_KEY!);
  const buf = await vc.generateSpeech({
    text: NARRATION,
    voiceId: 'gYWKdgLtqjPO3D5uDrDP',
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.3,
  });
  const outPath = path.resolve(__dirname, '../remotion/public/audio/biology/cell-fractionation-narration.mp3');
  await fs.writeFile(outPath, buf);
  console.log(`✓ Narration saved: ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}
main().catch(console.error);
