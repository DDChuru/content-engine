/**
 * Generate ElevenLabs narration for Ecowize Pitch
 *
 * Usage: npx tsx src/scripts/generate-ecowize-narration.ts
 * Output: src/remotion/public/audio/ecowize/slide-XX.mp3
 *
 * Cost estimate: ~$1.50 (5,000 chars × $0.30/1K)
 */

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP';
const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/audio/ecowize');

const NARRATIONS = [
  {
    slide: 1,
    text: `A Digital Platform for Ecowize. Cleaning Verification, NCR Management, Internal Audits, and Multi-Site Visibility — built specifically for your operation.`,
  },
  {
    slide: 2,
    text: `We understand Ecowize. An independent, privately-owned hygiene and sanitation company with over 25 years in the food industry. Operating across South Africa, Namibia, Australia, New Zealand, and the USA. Trusted by some of the biggest names in food — Heineken, Nestlé, PepsiCo, Tiger Brands, AB InBev, and many more. What makes Ecowize different is the flexibility of a private company — tailored solutions without corporate red tape.`,
  },
  {
    slide: 3,
    text: `We also understand the challenges. Multi-site operations across five countries, each with unique client requirements. Cleaning teams working overnight shifts while management is off-site. Clients demanding proof of cleaning compliance tied to their FSSC, BRC, and SANS 10049 audits. Paper-based systems creating gaps in traceability. And NCRs raised at site level that need visibility all the way up to regional and executive management.`,
  },
  {
    slide: 4,
    text: `This is about more than due diligence — it's about brand protection. A single food safety incident at any site reflects on Ecowize as a whole. Your clients hold Ecowize accountable — not individual site teams. Paper records cannot prove what happened at 2am on a Tuesday in Namibia. A digital platform creates an immutable, timestamped, geolocated audit trail. It moves Ecowize from reactive incident response to proactive risk prevention. And ultimately, it protects the Ecowize brand — the most valuable asset in a trust-based industry.`,
  },
  {
    slide: 5,
    text: `Here's the core issue. Site supervisors execute cleaning — but Ecowize management holds the accountability. Today, management relies on trust that procedures were followed correctly. The problem is simple: accountability without visibility is just hope. A digital platform gives management real-time proof of execution at every site. Escalation paths ensure critical NCRs reach the right people automatically. It enables Ecowize to delegate with confidence while retaining control.`,
  },
  {
    slide: 6,
    text: `This is the visibility gap. Site teams do the work — but who sees the evidence? Regional managers visit sites periodically — but what happens between visits? Executive leadership needs a single dashboard across all operations. A digital command centre closes the gap between execution and oversight. Every inspection, NCR, and audit visible in real time — from any device, anywhere.`,
  },
  {
    slide: 7,
    text: `Here's what we propose to build. A mobile-first platform built for site teams working in factory environments. Offline-capable — it works in cold stores, basements, and areas with no signal. Real-time sync means data flows to management dashboards the moment connectivity returns. Four core modules: Cleaning Verification, NCR Management, Internal Audits, and HACCP Administration. Cross-platform — iOS, Android, and Web from a single codebase.`,
  },
  {
    slide: 8,
    text: `Module one: Cleaning Verification. Every cleaning zone identified by QR code — scanned by the team on the ground. Exception-based reporting means only failures are documented, reducing data noise by up to 97 percent. Photo evidence attached to every finding for irrefutable proof. Daily, weekly, and monthly cycles tracked independently. Crew allocation shows who cleaned what, when, and to what standard. And real-time completion dashboards visible to site and regional management.`,
  },
  {
    slide: 9,
    text: `Module two: NCR Management. Four severity levels — Critical with a zero to two hour response, Major within 24 hours, Minor within seven days, and Observations within thirty days. A seven-status workflow from Open through In-Progress, Actioned, and Verified to Closed. RACI assignment at every stage — Responsible, Accountable, Consulted, and Informed. Automatic escalation ensures critical NCRs notify management immediately. And a full audit trail — who raised it, who actioned it, who verified it, and when.`,
  },
  {
    slide: 10,
    text: `Module three: Internal Audit Platform. Configurable audit templates for FSSC 22000, BRC, SANS 10049, or any custom framework. Scored questions with section-level and overall compliance percentages. NCRs raised directly from audit findings, linked for full traceability. Digital signatures for auditor and auditee. Historical audit comparison to track improvement trends over time. And fully offline-capable for audits in cold stores or remote facilities.`,
  },
  {
    slide: 11,
    text: `Module four: HACCP and Food Safety Administration. Complete HACCP plan management — hazard analysis, CCP identification, and monitoring. Food Defence and Food Fraud assessments with configurable risk matrices. Prerequisite Programs mapped to ISO 22000 and FSSC 22000 version 6 clauses. Document control with versioning, approval workflows, and staff acknowledgment tracking. QMS monitoring with automated task generation — so nothing falls through the cracks.`,
  },
  {
    slide: 12,
    text: `The Multi-Site Command Centre. A single dashboard showing all sites — South Africa, Namibia, Australia, New Zealand, and the USA. Compliance scores per site with drill-down to individual areas. Open NCR count and ageing by severity across the entire business. Audit schedules with upcoming, overdue, and completion rates. Trend analysis showing whether sites are improving or declining over weeks and months. This is the information that accountability requires.`,
  },
  {
    slide: 13,
    text: `Let's compare. Paper-based systems keep records locked in site filing cabinets — a digital platform makes them accessible from any device, anywhere, instantly. Paper cannot prove what happened at 2am — digital provides timestamped, geolocated, photo-verified evidence. NCRs get lost or delayed in communication — digital delivers automatic escalation with RACI assignment. Audit results take weeks to compile on paper — digital gives real-time scoring with instant trend analysis. Paper needs management visits for visibility — digital provides a multi-site command centre that's always on. Paper is reactive. Digital is proactive.`,
  },
  {
    slide: 14,
    text: `The implementation roadmap. Phase one — Discovery. Site visits, workflow mapping, and template design. Phase two — Core Build. Cleaning verification and NCR modules for a pilot site. Phase three — Pilot. Deploy to one or two sites, train the teams, and refine workflows. Phase four — Audit Module. Internal audit templates, scoring, and signature capture. Phase five — Rollout. Multi-site deployment with the command centre dashboard. And phase six — HACCP Administration, document control, and full integration.`,
  },
  {
    slide: 15,
    text: `Why us? Because we've already built these systems — this is not a concept. iClean 2.0 is a production-ready mobile app for cleaning verification with full offline support. Our NCR Audit App delivers complete NCR tracking with four severity levels, seven-status workflows, and RACI assignment. And myHACCPAdmin is an enterprise HACCP, TACCP, and VACCP platform with document control and QMS. We have deep domain knowledge in food safety, FSSC 22000, and multi-site operations. We build for the factory floor — offline-first, photo-evidence, barcode-scanned.`,
  },
  {
    slide: 16,
    text: `Let's build this together. Delegate responsibility at site level. Retain accountability at the top. And see everything.`,
  },
];

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

  const totalChars = NARRATIONS.reduce((sum, n) => sum + n.text.length, 0);
  const estimatedCost = (totalChars / 1000) * 0.30;

  console.log(`\n🎙️  Generating Ecowize Pitch Narration\n`);
  console.log(`   Voice ID: ${VOICE_ID}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Slides: ${NARRATIONS.length}`);
  console.log(`   Total characters: ${totalChars.toLocaleString()}`);
  console.log(`   Estimated cost: $${estimatedCost.toFixed(2)}\n`);

  for (const narration of NARRATIONS) {
    const filename = `slide-${String(narration.slide).padStart(2, '0')}.mp3`;
    const outPath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(outPath)) {
      console.log(`  ⏭  ${filename} — already exists, skipping`);
      continue;
    }

    console.log(`  🎙️  Generating ${filename} (${narration.text.length} chars)...`);

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

      console.log(`  ✅ ${filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
    } catch (err: any) {
      console.log(`  ❌ ${filename} — ${err.message}`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 1000));
  }

  const actualCost = (totalChars / 1000) * 0.30;
  console.log(`\n✅ Done! ${NARRATIONS.length} narration clips generated.`);
  console.log(`   Cost: ~$${actualCost.toFixed(2)}\n`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
