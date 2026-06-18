/**
 * Generate Stoichiometry TikTok Narration Audio (Batch 2: TikToks 4-8)
 * Usage: npx tsx src/scripts/generate-stoichiometry-audio-batch2.ts
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

function stripCues(text: string): string {
  return text.replace(/\{\{cue:\w+[-\w]*\}\}/g, '').replace(/\s{2,}/g, ' ').trim();
}

const SCRIPTS: { id: string; filename: string; text: string }[] = [
  {
    id: '04-balancing',
    filename: '04-balancing-narration.mp3',
    text: stripCues(`Chemistry has one golden rule. Atoms cannot be created or destroyed. What goes in must come out. That's why we balance equations.

Take hydrogen plus oxygen makes water. H two plus O two arrow H two O. But count the oxygens. Two on the left, one on the right. That's not balanced.

Fix it. Put a two in front of water. H two plus O two arrow two H two O. Now oxygens match — two each side. But hydrogens? Two on the left, four on the right.

So put a two in front of hydrogen. Two H two plus O two arrow two H two O. Count again. Hydrogens — four and four. Oxygens — two and two. Balanced.

Here's the method. Step one — write the unbalanced equation. Step two — pick the most complex molecule. Step three — balance one element at a time. Step four — leave hydrogen and oxygen for last. Step five — do a final count.

The coefficients you put in front? Those become your mole ratios. And mole ratios are everything in stoichiometry. That's the next video.`)
  },
  {
    id: '05-reacting-masses',
    filename: '05-reacting-masses-narration.mp3',
    text: stripCues(`This is where stoichiometry gets powerful. You can predict exactly how much product you'll make from any amount of reactant.

Here's a real question. How many grams of carbon dioxide form when you burn twelve grams of carbon?

Step one — write the balanced equation. C plus O two arrow CO two. Already balanced. One carbon, two oxygens each side.

Step two — convert to moles. Twelve grams of carbon divided by molar mass twelve equals one mole.

Step three — use the mole ratio. The equation says one mole of C makes one mole of CO two. So we need one mole of CO two.

Step four — convert back to grams. One mole of CO two times molar mass forty-four equals forty-four grams.

That's it. Twelve grams of carbon makes forty-four grams of CO two. Every time.

The pattern is always the same. Grams to moles, use the ratio, moles back to grams. Grams, moles, ratio, moles, grams. Memorise that flow and you can solve any reacting mass question.`)
  },
  {
    id: '06-solutions',
    filename: '06-solutions-narration.mp3',
    text: stripCues(`When you dissolve something in water, you get a solution. And concentration tells you how much is dissolved.

The unit is moles per decimetre cubed. That's mol per dm cubed. Some textbooks write it as molar, capital M.

The formula? Concentration equals moles divided by volume. c equals n over V. And volume must be in dm cubed, not cm cubed.

Here's the trap. If they give you volume in cm cubed, divide by a thousand to convert. Two hundred and fifty cm cubed equals zero point two five dm cubed.

Example. You dissolve four grams of sodium hydroxide in two hundred and fifty cm cubed of water. What's the concentration?

Step one — moles of NaOH. Molar mass is forty. Four divided by forty equals zero point one moles.

Step two — volume in dm cubed. Two fifty divided by a thousand equals zero point two five.

Step three — concentration. Zero point one divided by zero point two five equals zero point four mol per dm cubed.

Triangle works here too. c, n, V — same pattern as before.`)
  },
  {
    id: '07-gas-volumes',
    filename: '07-gas-volumes-narration.mp3',
    text: stripCues(`Avogadro discovered something incredible. At the same temperature and pressure, equal volumes of any gas contain the same number of molecules.

That means one mole of any gas takes up the same volume. At room temperature and pressure, that's twenty-four dm cubed. At STP, it's twenty-two point four dm cubed.

The formula? Volume equals moles times molar volume. V equals n times twenty-four. Or rearrange — n equals V divided by twenty-four.

Example. What volume does zero point five moles of oxygen occupy at RTP?

Volume equals zero point five times twenty-four. That's twelve dm cubed. Done.

Harder one. What mass of CO two occupies six dm cubed at RTP?

Step one — moles. Six divided by twenty-four equals zero point two five moles.

Step two — mass. Zero point two five times forty-four equals eleven grams.

See how it connects? The mole links mass, volume, and concentration. That's three formulas — n equals m over M, n equals c times V, n equals volume over twenty-four. The mole is always in the middle.`)
  },
  {
    id: '08-limiting',
    filename: '08-limiting-narration.mp3',
    text: stripCues(`In real chemistry, you almost never have perfect amounts of both reactants. One runs out first. That's the limiting reagent.

Think of it like making sandwiches. Two slices of bread plus one slice of cheese makes one sandwich. If you have ten slices of bread and three slices of cheese, cheese runs out first. Cheese is the limiting reagent. You make three sandwiches, not five.

Same in chemistry. Take magnesium plus hydrochloric acid. Mg plus two HCl arrow MgCl two plus H two.

If you have two point four grams of Mg and one hundred cm cubed of one molar HCl. Who runs out first?

Moles of Mg — two point four over twenty-four equals zero point one moles. Moles of HCl — concentration times volume equals zero point one times zero point one equals zero point zero one moles.

The ratio says one Mg needs two HCl. So zero point one Mg needs zero point two HCl. But we only have zero point zero one. HCl is the limiting reagent.

Now — percentage yield. Theoretical yield is what you should get. Actual yield is what you actually get. Percentage yield equals actual over theoretical times a hundred.

If you never get one hundred percent, don't worry. Nobody does. That's real chemistry.`)
  }
];

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) { console.error('ELEVENLABS_API_KEY not set'); process.exit(1); }

  await fs.mkdir(AUDIO_DIR, { recursive: true });
  const voice = new VoiceCloning(apiKey);

  for (const script of SCRIPTS) {
    const outPath = path.join(AUDIO_DIR, script.filename);
    try { await fs.access(outPath); console.log(`⏭️  Skipping ${script.filename} (exists)`); continue; } catch {}

    console.log(`\n🎙️  Generating: ${script.filename} (${script.text.length} chars, ~$${(script.text.length * 0.30 / 1000).toFixed(2)})`);
    try {
      const audioBuffer = await voice.generateSpeech({
        text: script.text, voiceId: VOICE_ID,
        stability: 0.5, similarityBoost: 0.75, style: 0.3, speakerBoost: true
      });
      await fs.writeFile(outPath, Buffer.from(audioBuffer as ArrayBuffer));
      console.log(`   ✅ Saved: ${script.filename}`);
    } catch (err: any) { console.error(`   ❌ Failed: ${err.message}`); }
  }

  const totalChars = SCRIPTS.reduce((sum, s) => sum + s.text.length, 0);
  console.log(`\n📊 Batch 2: ${SCRIPTS.length} scripts, ${totalChars} chars, ~$${(totalChars * 0.30 / 1000).toFixed(2)}`);
}

main().catch(console.error);
