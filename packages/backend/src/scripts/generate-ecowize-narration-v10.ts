/**
 * Generate ElevenLabs narration for Ecowize Pitch v10 (15-slide storyboard)
 *
 * Usage: npx tsx src/scripts/generate-ecowize-narration-v10.ts
 * Output: src/remotion/public/audio/ecowize/v10/slide-XX.mp3
 *
 * Pronunciation fix: "Ecowize" → "Ecowize" for correct TTS pronunciation
 */

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Your cloned voice ID
const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';
const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/audio/ecowize/v10');

/**
 * v10 Storyboard Narrations (15 slides)
 * Narrative: Hook → Problem (2) → Impact (2) → Solution (4) → Proof (3) → Partnership → CTA
 *
 * Note: "Ecowize" is spelled "Ecowize" for correct pronunciation
 */
const NARRATIONS = [
  // ─── HOOK ───────────────────────────────────────────────────────────────
  {
    slide: 1,
    type: 'Hook',
    title: 'Food Safety Without Blind Spots',
    text: `Food Safety Without Blind Spots. For global food brands, sanitation is a board-level risk — not a line item. We're here to propose a digital platform for Ecowize — one that delivers always-on assurance across every site, every shift, every day.`,
  },

  // ─── PROBLEM ────────────────────────────────────────────────────────────
  {
    slide: 2,
    type: 'Problem',
    title: 'The Accountability Gap',
    text: `The Accountability Gap. The people who execute sanitation are not the people held accountable. Without continuous visibility, leadership relies on periodic reports and site visits to assess risk. Site supervisors do the work — but Ecowize management holds the accountability. Today, that accountability relies on trust. But in our industry, trust requires proof.`,
  },
  {
    slide: 3,
    type: 'Problem',
    title: "If It's Not Recorded...",
    text: `If it isn't recorded, it didn't happen. When incidents occur, paper can't prove what happened on a night shift or at a remote site. Torn logbook pages, faded checklists, no timestamps, no geolocation. Executives need evidence that is timestamped, traceable, and defensible. A digital platform transforms paper doubt into digital proof.`,
  },

  // ─── IMPACT ─────────────────────────────────────────────────────────────
  {
    slide: 4,
    type: 'Impact',
    title: 'One Incident, Enterprise Impact',
    text: `One Incident, Enterprise Impact. A single sanitation failure can cascade into product recalls, lost shelf space, regulatory action, and reputational damage. The exposure multiplies with every site and every customer. A single incident at any site reflects on Ecowize as a whole. This is about brand protection.`,
  },
  {
    slide: 5,
    type: 'Impact',
    title: 'Audit Drag and Decision Lag',
    text: `Audit Drag and Decision Lag. Manual records slow audits and obscure trends until they become incidents. Piles of binders take weeks to compile. By the time leadership sees the data, the risk has already matured. Leaders need faster decisions and fewer surprises.`,
  },

  // ─── SOLUTION ───────────────────────────────────────────────────────────
  {
    slide: 6,
    type: 'Solution',
    title: 'The Ecowize Digital Platform',
    text: `The Ecowize Digital Platform. A unified system that turns sanitation into a live, auditable operation — instead of monthly snapshots. Four pillars: Verify cleaning at point of work. Correct issues with automatic escalation. Audit with standardized templates and scoring. And Oversee everything from a multi-site command centre. Mobile-first, offline-capable, and secure.`,
  },
  {
    slide: 7,
    type: 'Solution',
    title: 'Cleaning Verification',
    text: `Module One: Cleaning Verification. Every zone identified by QR code — scanned by the team on the ground. Exception-based reporting reduces data noise by up to 97 percent. Only failures are documented, so leaders focus on what matters. Photo evidence attached to every finding provides irrefutable proof of where, when, and what was found.`,
  },
  {
    slide: 8,
    type: 'Solution',
    title: 'NCR Management',
    text: `Module Two: NCR Management. Four severity levels with defined response times — Critical within two hours, Major within 24 hours, Minor within seven days, Observation within thirty days. A seven-status workflow from Open through Verified to Closed. Automatic escalation ensures critical NCRs reach management immediately. Full audit trail: who raised it, who actioned it, who verified it, and when.`,
  },
  {
    slide: 9,
    type: 'Solution',
    title: 'Internal Audits',
    text: `Module Three: Internal Audit Platform. Configurable templates for FSSC 22000, BRC, SANS 10049, or any custom framework. Scored questions with section-level and overall compliance percentages. NCRs raised directly from audit findings — fully linked for traceability. Digital signatures, offline capability, and historical comparison to track improvement over time.`,
  },
  {
    slide: 10,
    type: 'Solution',
    title: 'Executive Command Centre',
    text: `The Executive Command Centre. A single dashboard showing all sites — South Africa, Namibia, Australia, New Zealand, and the USA. Compliance scores per site with drill-down to individual areas. NCR count and ageing by severity across the business. Trend analysis showing whether sites are improving or declining. Faster decisions, fewer surprises. This is the visibility that accountability requires.`,
  },

  // ─── PROOF ──────────────────────────────────────────────────────────────
  {
    slide: 11,
    type: 'Proof',
    title: 'Trusted by Food Safety Leaders',
    text: `Trusted by Food Safety Leaders. Ecowize has over 25 years in food safety, operating across five countries and twelve industries. Trusted by global leaders — Heineken, Nestlé, PepsiCo, Tiger Brands, AB InBev. We already support enterprise-grade operations. The bar is high — and we meet it.`,
  },
  // Slide 12 is the Proven Capabilities zoom reveal — no narration (background music)
  {
    slide: 12,
    type: 'Proof',
    title: 'Proven Capabilities',
    text: '', // No narration — visual reveal with music
  },

  // ─── PARTNERSHIP ────────────────────────────────────────────────────────
  {
    slide: 13,
    type: 'Partnership',
    title: 'Co-Build and Own',
    text: `Co-Build and Own. We work with your teams to map workflows and build what fits your operations. Deep food-safety expertise plus scalable architecture and a responsive team. And crucially — what we build together is Ecowize IP. The platform and intellectual property remain yours, protecting your competitive advantage.`,
  },

  // ─── DIFFERENTIATION ────────────────────────────────────────────────────
  {
    slide: 14,
    type: 'Differentiation',
    title: 'The Transformation',
    text: `The Transformation. Paper is reactive — Digital is proactive. Paper records are locked in site filing cabinets — digital makes them accessible from any device, anywhere. Paper cannot prove what happened at 2am — digital provides timestamped, geolocated, photo-verified evidence. NCRs get lost or delayed in paper systems — digital delivers automatic escalation. Paper needs management visits for visibility — digital provides a command centre that's always on.`,
  },

  // ─── CTA ────────────────────────────────────────────────────────────────
  {
    slide: 15,
    type: 'CTA',
    title: "Let's Build This Together",
    text: `Let's build this together. A platform where you delegate responsibility at site level, retain accountability at the top, and see everything. Always-on assurance — food safety without blind spots.`,
  },
];

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

  // Filter out empty narrations (like slide 12)
  const activeNarrations = NARRATIONS.filter((n) => n.text.length > 0);
  const totalChars = activeNarrations.reduce((sum, n) => sum + n.text.length, 0);
  const estimatedCost = (totalChars / 1000) * 0.3;

  console.log(`\n🎙️  Generating Ecowize Pitch v10 Narration (15-slide storyboard)\n`);
  console.log(`   Voice ID: ${VOICE_ID}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Slides with narration: ${activeNarrations.length}`);
  console.log(`   Total characters: ${totalChars.toLocaleString()}`);
  console.log(`   Estimated cost: $${estimatedCost.toFixed(2)}\n`);

  for (const narration of activeNarrations) {
    const filename = `slide-${String(narration.slide).padStart(2, '0')}.mp3`;
    const outPath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(outPath)) {
      console.log(`  ⏭  ${filename} — already exists, skipping`);
      continue;
    }

    console.log(`  🎙️  [${narration.type}] ${narration.title}`);
    console.log(`      Generating ${filename} (${narration.text.length} chars)...`);

    try {
      const audio = await client.textToSpeech.convert(VOICE_ID, {
        text: narration.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.78,
          style: 0.15,
          use_speaker_boost: true,
        },
      });

      const chunks: Uint8Array[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(outPath, buffer);

      console.log(`      ✅ ${filename} (${(buffer.length / 1024).toFixed(0)}KB)\n`);
    } catch (err: any) {
      console.log(`      ❌ ${filename} — ${err.message}\n`);
    }

    // Rate limit (1 second between requests)
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n✅ Done! Narration clips saved to ${OUTPUT_DIR}`);
  console.log(`   Cost: ~$${estimatedCost.toFixed(2)}\n`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
