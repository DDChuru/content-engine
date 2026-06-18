/**
 * Generate Stoichiometry TikTok Narration Audio (Batch 1: TikToks 1-3)
 *
 * Uses ElevenLabs with cloned voice gYWKdgLtqjPO3D5uDrDP
 * Output: packages/backend/src/remotion/public/audio/stoichiometry/
 *
 * Usage: npx tsx src/scripts/generate-stoichiometry-audio.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { VoiceCloning } from '../services/voice-cloning';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';
const AUDIO_DIR = path.resolve(__dirname, '../remotion/public/audio/stoichiometry');

// Strip {{cue:xxx}} markers from narration text
function stripCues(text: string): string {
  return text.replace(/\{\{cue:\w+\}\}/g, '').replace(/\s{2,}/g, ' ').trim();
}

const SCRIPTS: { id: string; filename: string; text: string }[] = [
  {
    id: '01-mole',
    filename: '01-mole-narration.mp3',
    text: stripCues(`You can't count atoms. They're way too small. So chemists invented something genius — the mole.

A mole is just a number. A really, really big number. Six point zero two two times ten to the twenty-three. That's Avogadro's constant.

How big is that? If you had a mole of rice grains, it would cover the entire Earth — mountains deep.

But here's why it's useful. Twelve grams of carbon-twelve contains exactly one mole of atoms. Twenty-three grams of sodium — one mole. Fifty-six grams of iron — also one mole.

See the pattern? The mass number on the periodic table tells you exactly how many grams make one mole. That's called the molar mass.

So when a chemist says "give me one mole of water," they mean give me eighteen grams. Because hydrogen is one, times two, plus oxygen sixteen — equals eighteen.

The mole connects what we can weigh on a scale to what's happening at the atomic level. That's the whole point. And once you get this, stoichiometry clicks.`)
  },
  {
    id: '02-molar-mass',
    filename: '02-molar-mass-narration.mp3',
    text: stripCues(`The periodic table is literally a cheat sheet. Every single element has its molar mass written right there.

Carbon — twelve grams per mole. Oxygen — sixteen. Hydrogen — one. That's all you need to know.

But what about compounds? Easy. You just add them up.

Water — H two O. Hydrogen is one, times two that's two. Plus oxygen sixteen. Eighteen grams per mole.

Carbon dioxide — CO two. Carbon twelve. Plus oxygen sixteen times two, that's thirty-two. Forty-four grams per mole.

Sulfuric acid — H two S O four. Hydrogen one times two — two. Sulfur — thirty-two. Oxygen sixteen times four — sixty-four. Total? Ninety-eight grams per mole.

Here's the formula you need to memorise. Moles equals mass divided by molar mass. n equals m over big M.

You know two of those three things? You can find the third. That's it. That's the entire foundation of stoichiometry calculations. Everything builds from here.`)
  },
  {
    id: '03-triangle',
    filename: '03-triangle-narration.mp3',
    text: stripCues(`Every stoichiometry problem comes down to one formula. Moles equals mass divided by molar mass. n equals m over capital M.

And the easiest way to remember it? The triangle.

Draw a triangle. Put mass at the top. Moles bottom left. Molar mass bottom right. Cover what you want — and you can see the formula.

Want moles? Cover n. You see mass over molar mass. Want mass? Cover m. You see moles times molar mass. Want molar mass? Cover M. Mass divided by moles.

Let's use it. Question — how many moles in twenty-four grams of magnesium?

Step one — molar mass of magnesium from the periodic table. Twenty-four grams per mole.

Step two — plug into the triangle. n equals twenty-four divided by twenty-four. That's one mole. Done.

Another one. How many moles in eleven grams of CO two? Molar mass of CO two is forty-four. Eleven divided by forty-four equals zero point two five moles.

Once you master this triangle, you can solve any mass-to-mole conversion. And that's most of your exam.`)
  }
];

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY not set in .env');
    process.exit(1);
  }

  await fs.mkdir(AUDIO_DIR, { recursive: true });

  const voice = new VoiceCloning(apiKey);

  for (const script of SCRIPTS) {
    const outPath = path.join(AUDIO_DIR, script.filename);

    // Check if already exists
    try {
      await fs.access(outPath);
      console.log(`⏭️  Skipping ${script.filename} (already exists)`);
      continue;
    } catch {}

    console.log(`\n🎙️  Generating: ${script.filename}`);
    console.log(`   Text length: ${script.text.length} chars (~$${(script.text.length * 0.30 / 1000).toFixed(2)})`);

    try {
      const audioBuffer = await voice.generateSpeech({
        text: script.text,
        voiceId: VOICE_ID,
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.3,
        speakerBoost: true
      });

      await fs.writeFile(outPath, Buffer.from(audioBuffer as ArrayBuffer));
      console.log(`   ✅ Saved: ${script.filename}`);
    } catch (err: any) {
      console.error(`   ❌ Failed: ${err.message}`);
    }
  }

  // Summary
  const totalChars = SCRIPTS.reduce((sum, s) => sum + s.text.length, 0);
  console.log(`\n📊 Summary:`);
  console.log(`   Scripts: ${SCRIPTS.length}`);
  console.log(`   Total chars: ${totalChars}`);
  console.log(`   Estimated cost: ~$${(totalChars * 0.30 / 1000).toFixed(2)}`);
  console.log(`   Output: ${AUDIO_DIR}`);
}

main().catch(console.error);
