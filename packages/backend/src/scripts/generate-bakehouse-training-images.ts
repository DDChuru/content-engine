/**
 * Generate training infographic images for Bakehouse food safety training
 *
 * Uses GeminiImageGenerator.generateDirect() to create 6 training infographics.
 * Estimated cost: 6 x $0.039 = $0.23
 *
 * Usage:
 *   npx tsx src/scripts/generate-bakehouse-training-images.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { GeminiImageGenerator } from '../services/gemini-image-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const OUTPUT_DIR = path.resolve(__dirname, '../../output/bakehouse/training');

const IMAGES = [
  {
    filename: '01-internal-audit-training',
    prompt:
      'Professional training infographic poster titled "INTERNAL AUDIT — 5 KEY STEPS" in large bold white text on a dark blue banner at the top. Subtitle "Every Step Matters for Compliance". Grid layout with 5 numbered panels arranged horizontally, each with a bold header and detailed illustration: Step 1: PLAN (illustrated clipboard with checklist, person reviewing documents at desk), Step 2: PREPARE (stack of documents and interview guide, person organizing folders), Step 3: AUDIT (magnifying glass examining documents on a table, auditor with clipboard inspecting a food facility), Step 4: REPORT (computer screen showing findings report with graphs, person typing), Step 5: FOLLOW UP (large green checkmark with corrective action list, handshake between auditor and manager). Blue and white corporate colour scheme with dark blue panel headers. Bold numbered badges (1-5) in circles. Green checkmarks for completed items, red X marks for non-conformances. Warning triangle icons for critical findings. Clean professional icons in each panel. Educational callout text in each panel describing the key actions. Footer banner: "Systematic auditing drives continuous improvement". Style: structured educational wall poster infographic, similar to food safety training posters with illustrated characters, clear panel borders, and readable text hierarchy.',
  },
  {
    filename: '02-food-defence-training',
    prompt:
      'Professional training infographic poster titled "FOOD DEFENCE — PROTECT YOUR FACILITY" in large bold white text on a red warning banner at the top. Subtitle "If You See Something, Say Something". 4-panel grid layout, each panel with bold header, detailed illustration, and educational callout text: Panel 1: ACCESS CONTROL (illustrated locked security door with badge reader, security camera on wall, person swiping ID badge, fence with gate around facility), Panel 2: VISITOR MANAGEMENT (illustrated sign-in book on reception desk, visitor badge being handed to person, escort walking with visitor through facility, visitor log clipboard), Panel 3: THREAT AWARENESS (illustrated workers looking alert, "See Something Say Something" speech bubble, telephone with reporting hotline number, suspicious package being reported), Panel 4: INCIDENT RESPONSE (illustrated emergency plan document, chain of custody diagram with arrows, evidence bag being sealed, team gathered at emergency meeting). Red warning banners on each panel header. Security shield icons. Bold white text on dark backgrounds. Warning triangle symbols with exclamation marks. Lock and key icons. Professional blue and red colour scheme. Educational callout boxes with short action text. Footer banner: "Food Defence is Everyone\'s Responsibility". Style: structured educational wall poster infographic with illustrated characters, clear panel borders, warning symbols, and readable text.',
  },
  {
    filename: '03-food-safety-training',
    prompt:
      'Professional training infographic poster titled "FOOD SAFETY ESSENTIALS — 6 KEY PRINCIPLES" in large bold white text on a dark blue banner at the top. Subtitle "Protecting Consumers Starts With You". 6-panel grid layout (2 rows x 3 columns), each panel with bold numbered header, detailed illustration, and educational text: Panel 1: PERSONAL HYGIENE (illustrated person washing hands at sink with soap and water, hair net and clean uniform, crossed-out jewellery with red X), Panel 2: TEMPERATURE CONTROL (large illustrated thermometer showing danger zone between 5°C and 60°C highlighted in red, cold food with snowflake below 5°C, hot food with flame above 60°C), Panel 3: CROSS-CONTAMINATION (illustrated colour-coded chopping boards - red for raw meat, green for vegetables, blue for fish, yellow for cooked - with separation arrows between raw and cooked areas), Panel 4: ALLERGEN MANAGEMENT (illustrated warning triangle with exclamation mark, segregated storage shelves with labelled allergen containers, allergen labels on food packaging), Panel 5: CLEANING & SANITATION (illustrated 5-step cleaning sequence with arrows: scrape, rinse, wash with detergent and brush, rinse, sanitize with spray bottle and contact time clock), Panel 6: PEST CONTROL (illustrated sealed door gap, fly screen on window, mouse trap, pest monitoring log clipboard, "Report sightings immediately" callout). Green checkmarks for correct practices, red X marks for wrong practices. Professional blue and white colour scheme with green and red accents. Bold numbered badges (1-6) in circles. Clean panel borders. Footer: "Food Safety is Non-Negotiable". Style: structured educational wall poster infographic with illustrated characters and equipment, similar to food factory training posters.',
  },
  {
    filename: '04-food-fraud-training',
    prompt:
      'Professional training infographic poster titled "FOOD FRAUD — KNOW THE RISKS" in large bold white text on a dark amber/orange warning banner at the top. Subtitle "Protect Your Brand and Your Consumers". 4-panel educational poster layout, each panel with bold header, detailed illustration, and callout text: Panel 1: TYPES OF FRAUD (4 illustrated sub-icons: substitution shown as cheap ingredient replacing expensive one with swap arrows, dilution shown as water being added to juice bottle, mislabelling shown as wrong label being stuck on package with red X, unapproved enhancement shown as syringe injecting substance with warning triangle), Panel 2: VULNERABILITY ASSESSMENT (illustrated supply chain map showing farm to factory to store with red risk points highlighted at each junction, magnifying glass over weak links, risk matrix grid), Panel 3: DETECTION (illustrated laboratory with test tubes and microscope, auditor examining supplier documents with magnifying glass, traceability chain with linked barcode symbols, testing report with pass/fail results), Panel 4: PREVENTION (illustrated approved supplier list on clipboard with green checkmarks, certificate of analysis document with official stamp, random testing calendar with highlighted dates, locked procurement system on computer screen). Warning triangle accents throughout. Magnifying glass detective icons. Professional blue and amber colour scheme. Bold text headers in each panel. Red flags for risks, green shields for protections. Educational callout boxes. Footer: "If It Seems Too Good To Be True, Investigate". Style: structured educational wall poster infographic with clear panel borders, illustrated diagrams, and readable text hierarchy.',
  },
  {
    filename: '05-haccp-training',
    prompt:
      'Professional training infographic poster titled "7 PRINCIPLES OF HACCP" in large bold white text on a dark blue banner at the top. Subtitle "Hazard Analysis and Critical Control Points". Staircase or pyramid layout showing 7 numbered principles ascending from bottom-left to top-right, each step with bold header, icon illustration, and educational text: Principle 1: HAZARD ANALYSIS (illustrated warning triangle with three hazard types: biological bacteria icon, chemical flask icon, physical metal shard icon, person examining process flow diagram), Principle 2: IDENTIFY CCPs (illustrated decision tree flowchart with yes/no branches, magnifying glass on production line highlighting critical points with red circles), Principle 3: SET CRITICAL LIMITS (illustrated thermometer showing specific limits with red lines at min/max, gauge meter with green safe zone and red danger zones, "e.g. cooking temp ≥ 75°C"), Principle 4: MONITORING (illustrated clock showing monitoring frequency, worker recording temperature on record sheet at production line, pen writing on checklist), Principle 5: CORRECTIVE ACTIONS (illustrated wrench fixing a problem, rejected product being quarantined with barrier tape, corrective action form being completed), Principle 6: VERIFICATION (illustrated auditor reviewing records with magnifying glass, calibration of equipment, annual review calendar), Principle 7: RECORD KEEPING (illustrated filing cabinet with organised documents, computer database, "If it isn\'t recorded, it didn\'t happen" callout). Professional blue gradient background. Bold numbered badges (1-7) in white circles with blue numbers. Each principle in its own bordered panel on the staircase. Green checkmarks for compliance. Clean professional icons. Footer: "HACCP — Your Systematic Approach to Food Safety". Style: structured educational wall poster infographic.',
  },
  {
    filename: '06-cleaning-sanitation-training',
    prompt:
      'Professional training infographic poster titled "5 STEPS TO EFFECTIVE CLEANING" in large bold white text on a dark blue banner at the top. Subtitle "Every Step Matters — Especially the Scrubbing!" in white italic text. Horizontal flow layout with 5 numbered steps connected by large bold arrows flowing left to right, each step in its own bordered panel with detailed illustration: Step 1: DRY PICKUP (illustrated squeegee and broom removing food debris and scraps from floor and surfaces, worker sweeping, callout "Remove all food debris DRY first", red X on water tap "No water yet!"), Step 2: PRE-RINSE (illustrated low pressure water hose rinsing surface from top to bottom, gentle water flow, warning triangle "NO splashing!", callout "Controlled rinse — LOW PRESSURE"), Step 3: DETERGENT + SCRUB (LARGEST CENTER PANEL — illustrated muscular arm scrubbing with brush and foam/bubbles, detergent bottle being applied, green checkmark "Apply detergent", bold text "SCRUB WITH ELBOW JUICE!", red X "This breaks the biofilm!", clock icon "CONTACT TIME — Let it dwell!"), Step 4: RINSE (illustrated thorough rinse removing all detergent, water flowing top to bottom toward drain with directional arrows, callout "Rinse all detergent", "Top to bottom, toward drain"), Step 5: SANITIZE (illustrated spray bottle applying sanitizer, clock showing contact time, callout "Apply sanitizer", "Correct dilution + contact time", "Let it work — don\'t rinse!"). Blue and white colour scheme. Bold step numbers in dark blue circles. Green checkmarks for correct actions. Red X marks for common mistakes. Warning triangle icons. Step 3 panel is larger/highlighted as the most important step. Footer: "Follow manufacturer instructions for all chemicals". Style: structured educational wall poster infographic identical to food factory cleaning training posters with illustrated characters and equipment.',
  },
];

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in .env');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);
  let totalCost = 0;
  let successCount = 0;

  console.log(`Generating ${IMAGES.length} Bakehouse training infographics to ${OUTPUT_DIR}\n`);

  for (const img of IMAGES) {
    console.log(`[${img.filename}] Generating...`);
    const result = await generator.generateDirect({
      prompt: img.prompt,
      outputDir: OUTPUT_DIR,
      filename: img.filename,
      aspectRatio: '16:9',
    });

    if (result.success) {
      console.log(`  OK Saved: ${result.imagePath}`);
      successCount++;
    } else {
      console.error(`  FAIL: ${result.error}`);
    }
    totalCost += result.cost;

    // Rate limit delay
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\nDone: ${successCount}/${IMAGES.length} succeeded. Total cost: $${totalCost.toFixed(2)}`);
}

main().catch(console.error);
