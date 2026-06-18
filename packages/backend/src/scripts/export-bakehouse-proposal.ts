/**
 * Bakehouse In-House Hygiene & Sanitation Proposal Deck
 *
 * Professional proposal for transitioning to an in-house sanitation
 * model, supported by an external food safety consultant.
 *
 * Usage: npx tsx src/scripts/export-bakehouse-proposal.ts
 * Output: output/bakehouse/bakehouse-inhouse-proposal.pptx
 */

import PptxGenJSModule from 'pptxgenjs';
const PptxGenJS = (PptxGenJSModule as any).default || PptxGenJSModule;
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Theme ─────────────────────────────────────────────────────────────

const C = {
  bg: '0a1628',
  text: 'f0f4f8',
  primary: '2d8a4e',
  accent: '34d399',
  gold: 'fbbf24',
  secondary: '1e3a5f',
  warm: 'd97706',     // Warm amber for bakehouse feel
  darkGreen: '0D2A1A',
  cream: 'fef3c7',    // Bakehouse warmth
};

const FONT = 'Inter';

type Slide = InstanceType<typeof PptxGenJS>['addSlide'] extends (...args: any) => infer R ? R : any;

// ── Helpers ───────────────────────────────────────────────────────────

function darkBg(slide: any) {
  slide.background = { fill: C.bg };
}

function addTitle(slide: any, title: string, opts?: { y?: number; fontSize?: number; color?: string }) {
  slide.addText(title, {
    x: 0.6, y: opts?.y ?? 0.3, w: 9, h: 0.8,
    fontSize: opts?.fontSize ?? 28, fontFace: FONT,
    color: opts?.color ?? C.accent, bold: true,
  });
  // Accent bar
  slide.addShape('rect' as any, {
    x: 0.6, y: (opts?.y ?? 0.3) + 0.75, w: 1.8, h: 0.04,
    fill: { color: C.accent },
  });
}

function addBullets(slide: any, bullets: string[], opts?: { x?: number; y?: number; w?: number; h?: number; fontSize?: number; bulletColor?: string }) {
  const rows = bullets.map(b => ({
    text: b,
    options: {
      fontSize: opts?.fontSize ?? 15, fontFace: FONT, color: C.text,
      bullet: { code: '25CF', color: opts?.bulletColor ?? C.accent },
      paraSpaceAfter: 10,
    },
  }));
  slide.addText(rows, {
    x: opts?.x ?? 0.8, y: opts?.y ?? 1.3, w: opts?.w ?? 8.5, h: opts?.h ?? 4.0,
    valign: 'top',
  });
}

function addSlideNumber(slide: any, num: number, total: number) {
  slide.addText(`${num} / ${total}`, {
    x: 8.5, y: 5.2, w: 1.2, h: 0.3,
    fontSize: 9, fontFace: FONT, color: C.secondary, align: 'right',
  });
}

function addFooter(slide: any) {
  slide.addText('Confidential — Prepared for Bakehouse Management', {
    x: 0.6, y: 5.2, w: 5, h: 0.3,
    fontSize: 8, fontFace: FONT, color: C.secondary, italic: true,
  });
}

// ── Slide Builders ────────────────────────────────────────────────────

const TOTAL_SLIDES = 16;

function slide01_Title(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);

  // Large title
  s.addText('In-House Hygiene\n& Sanitation', {
    x: 0.6, y: 1.2, w: 9, h: 2.0,
    fontSize: 44, fontFace: FONT, color: C.text, bold: true,
    lineSpacingMultiple: 1.1,
  });

  s.addText('A Proposal for Bakehouse', {
    x: 0.6, y: 3.2, w: 9, h: 0.6,
    fontSize: 22, fontFace: FONT, color: C.accent,
  });

  // Subtle tagline
  s.addText('Bringing ownership, culture, and accountability\nto your sanitation operations', {
    x: 0.6, y: 4.0, w: 7, h: 0.7,
    fontSize: 14, fontFace: FONT, color: C.secondary, italic: true,
    lineSpacingMultiple: 1.3,
  });

  // Accent bar
  s.addShape('rect' as any, {
    x: 0.6, y: 4.9, w: 3, h: 0.05,
    fill: { color: C.accent },
  });

  s.addText('Confidential', {
    x: 0.6, y: 5.1, w: 3, h: 0.3,
    fontSize: 10, fontFace: FONT, color: C.secondary,
  });
}

function slide02_Context(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Where We Stand');

  addBullets(s, [
    'Bakehouse has built a strong hygiene and sanitation foundation over many years',
    '15+ years of accumulated expertise embedded in the current sanitation team',
    'A Hygiene & Sanitation Manager with deep knowledge of the facility, its risks, and its people',
    'Proven results — the systems and protocols in place have delivered consistently',
    'The question is not whether the team is capable — it is how to unlock even more from them',
  ]);

  addSlideNumber(s, 2, TOTAL_SLIDES);
  addFooter(s);
}

function slide03_Opportunity(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'The Opportunity');

  s.addText('Transitioning to an in-house model is not about replacing what works.\nIt is about amplifying it.', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.8,
    fontSize: 16, fontFace: FONT, color: C.gold, italic: true,
    lineSpacingMultiple: 1.3,
  });

  addBullets(s, [
    'Retain the Hygiene & Sanitation Manager and the full sanitation team',
    'Bring the team under Bakehouse management — direct oversight, faster decisions',
    'Eliminate the outsourced layer — no intermediary between management and execution',
    'Strengthen the team\'s identity as Bakehouse employees, not contractors',
    'Supported by specialised food safety consultancy and training from a trusted external partner',
  ], { y: 2.3, h: 3.2 });

  addSlideNumber(s, 3, TOTAL_SLIDES);
  addFooter(s);
}

function slide04_Culture(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Culture & Belonging');

  // Big quote
  s.addText('"When people feel they belong,\nthey give more than what\'s required."', {
    x: 0.8, y: 1.4, w: 8.5, h: 0.9,
    fontSize: 18, fontFace: FONT, color: C.gold, italic: true,
    lineSpacingMultiple: 1.3,
  });

  addBullets(s, [
    'Outsourced staff often feel like outsiders — limited loyalty, higher turnover, lower morale',
    'In-house employees identify with Bakehouse — its values, its standards, its success',
    'Cleaning crews who feel ownership of "their" facility take pride in outcomes',
    'Reduced absenteeism and turnover when staff have job security and a career path',
    'The sanitation team becomes a core part of Bakehouse operations — not a service provider',
  ], { y: 2.5, h: 3.0 });

  addSlideNumber(s, 4, TOTAL_SLIDES);
  addFooter(s);
}

function slide05_Motivation(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Motivation & Performance');

  addBullets(s, [
    'Direct management means direct recognition — performance incentives under Bakehouse\'s control',
    'Staff development and upskilling become an investment in Bakehouse\'s own people',
    'Career progression within Bakehouse — cleaner → team lead → supervisor pathways',
    'Accountability is personal — not diluted through a third-party contract',
    'Management can respond to individual performance in real time, not through quarterly reviews',
    'Training is continuous and facility-specific, not generic outsourced modules',
  ]);

  addSlideNumber(s, 5, TOTAL_SLIDES);
  addFooter(s);
}

function slide06_Expertise(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Retaining Core Competencies');

  addBullets(s, [
    'The Hygiene & Sanitation Manager stays — 15+ years of facility-specific expertise preserved',
    'Institutional knowledge of Bakehouse\'s unique risk profile, equipment, and production cycles',
    'Existing SOPs, protocols, and cleaning schedules continue without disruption',
    'Supervisory structure (×3) remains intact — continuity for the cleaning crews',
    'The team that has delivered results continues to deliver — with stronger support',
    'No onboarding period, no learning curve, no gap in service quality',
  ]);

  addSlideNumber(s, 6, TOTAL_SLIDES);
  addFooter(s);
}

function slide07_StaffModel(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Staffing Model');

  // Table
  const headers = ['Shift', 'Hours', 'Staff', 'Off / Day', 'Days', 'Allowance'];
  const rows = [
    ['Day', '07:00 – 14:00', '21', '3 off/day', '7 days/week', '—'],
    ['Afternoon', '14:00 – 22:00', '5', '2 off (Mon-Fri)', '5 days/week', '5%'],
    ['Night', '22:00 – 06:00', '12', '2 off (Mon-Sat)', '6 days/week', '10%'],
  ];

  const headerCells = headers.map(h => ({
    text: h,
    options: {
      fontSize: 13, fontFace: FONT, color: C.text, bold: true,
      fill: { color: C.primary },
      border: { type: 'solid', color: C.secondary, pt: 0.5 },
      align: 'center' as const,
      valign: 'middle' as const,
    },
  }));

  const dataCells = rows.map(row =>
    row.map(cell => ({
      text: cell,
      options: {
        fontSize: 12, fontFace: FONT, color: C.text,
        fill: { color: C.secondary },
        border: { type: 'solid', color: C.bg, pt: 0.5 },
        align: 'center' as const,
        valign: 'middle' as const,
      },
    }))
  );

  s.addTable([headerCells, ...dataCells], {
    x: 0.6, y: 1.3, w: 9,
    colW: [1.5, 1.8, 1.0, 1.8, 1.5, 1.4],
    rowH: 0.55,
  });

  // Summary below table
  s.addText([
    { text: '38 total staff ', options: { fontSize: 14, fontFace: FONT, color: C.accent, bold: true } },
    { text: '(including Hygiene & Sanitation Manager)', options: { fontSize: 14, fontFace: FONT, color: C.text } },
  ], { x: 0.6, y: 3.6, w: 9, h: 0.4 });

  s.addText([
    { text: '3 Supervisors ', options: { fontSize: 13, fontFace: FONT, color: C.gold, bold: true } },
    { text: 'across shifts  •  ', options: { fontSize: 13, fontFace: FONT, color: C.text } },
    { text: 'Sunday: 10% allowance  •  ', options: { fontSize: 13, fontFace: FONT, color: C.text } },
    { text: '7-hour shifts', options: { fontSize: 13, fontFace: FONT, color: C.text } },
  ], { x: 0.6, y: 4.0, w: 9, h: 0.4 });

  s.addText('Bargaining council terms maintained — no disruption to employment conditions', {
    x: 0.6, y: 4.6, w: 9, h: 0.4,
    fontSize: 12, fontFace: FONT, color: C.secondary, italic: true,
  });

  addSlideNumber(s, 7, TOTAL_SLIDES);
  addFooter(s);
}

function slide08_Comparison(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Outsourced vs. In-House');

  // Column headers
  s.addText('Outsourced Model', {
    x: 0.5, y: 1.2, w: 4, h: 0.45,
    fontSize: 16, fontFace: FONT, color: C.warm, bold: true, align: 'center',
  });
  s.addText('In-House Model', {
    x: 5.5, y: 1.2, w: 4, h: 0.45,
    fontSize: 16, fontFace: FONT, color: C.accent, bold: true, align: 'center',
  });

  const rows = [
    { left: 'Staff identify with outsourced company', right: 'Staff identify with Bakehouse' },
    { left: 'Management fees & margins built in', right: 'Full cost transparency — every rand visible' },
    { left: 'Decisions filtered through third party', right: 'Direct management — immediate action' },
    { left: 'Generic training modules', right: 'Facility-specific, tailored training' },
    { left: 'Contractual lock-in & exit penalties', right: 'Full flexibility to adapt and adjust' },
    { left: 'Rotating staff, limited continuity', right: 'Stable team, institutional knowledge' },
    { left: 'Accountability diluted', right: 'Performance managed directly' },
  ];

  rows.forEach((row, i) => {
    const y = 1.75 + i * 0.48;

    s.addShape('rect' as any, { x: 0.5, y, w: 4, h: 0.42, fill: { color: C.secondary }, rectRadius: 0.04 });
    s.addText(row.left, { x: 0.65, y, w: 3.7, h: 0.42, fontSize: 11, fontFace: FONT, color: C.text, valign: 'middle' });

    s.addText('→', { x: 4.5, y, w: 1, h: 0.42, fontSize: 16, fontFace: FONT, color: C.accent, align: 'center', valign: 'middle' });

    s.addShape('rect' as any, { x: 5.5, y, w: 4, h: 0.42, fill: { color: C.darkGreen }, rectRadius: 0.04 });
    s.addText(row.right, { x: 5.65, y, w: 3.7, h: 0.42, fontSize: 11, fontFace: FONT, color: C.accent, valign: 'middle' });
  });

  addSlideNumber(s, 8, TOTAL_SLIDES);
  addFooter(s);
}

function slide09_ConsultancyRole(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'External Consultancy Support');

  s.addText('A trusted food safety partner — not an outsourced operator', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 15, fontFace: FONT, color: C.gold, italic: true,
  });

  addBullets(s, [
    'Specialised hygiene and sanitation consultancy from an expert with a proven track record at Bakehouse',
    'On-call advisory for critical food safety decisions — not a helpdesk, a trusted partner',
    'Periodic facility assessments and gap analysis with actionable recommendations',
    'Staff training programmes designed for Bakehouse\'s specific environment and risk profile',
    'Support during audits, regulatory inspections, and certification processes',
    'Knowledge transfer — building internal capability, not creating dependency',
  ], { y: 2.0, h: 3.5 });

  addSlideNumber(s, 9, TOTAL_SLIDES);
  addFooter(s);
}

function slide10_Training(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Training & Development');

  addBullets(s, [
    'Induction training for all sanitation staff — Bakehouse-specific protocols and standards',
    'Ongoing competency assessments with refresher schedules tracked digitally',
    'Visual training aids and pictorial SOPs — accessible to all literacy levels',
    'Specialised modules: allergen management, chemical handling, GMP, personal hygiene',
    'Supervisor development — leadership, team management, incident response',
    'Training records maintained digitally for audit readiness at all times',
  ]);

  addSlideNumber(s, 10, TOTAL_SLIDES);
  addFooter(s);
}

function slide11_DigitalSystem(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Digital Management System');

  s.addText('Enterprise-grade tools — supplied or custom-developed for Bakehouse', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 14, fontFace: FONT, color: C.gold, italic: true,
  });

  // Two-column layout
  const leftBullets = [
    'Digital cleaning sign-off with real-time compliance visibility',
    'NCR system: 7-status workflow with photo annotations and RACI matrix',
    'Pictorial audits with geo-tagged photographic evidence',
  ];
  const rightBullets = [
    'Internal audits aligned to ISO 22000 / FSSC requirements',
    'Integrated training platform — competency tracking and schedules',
    'Management dashboards — KPIs, trends, and corrective actions at a glance',
  ];

  const mkBullets = (items: string[]) => items.map(b => ({
    text: b,
    options: {
      fontSize: 13, fontFace: FONT, color: C.text,
      bullet: { code: '25CF', color: C.accent },
      paraSpaceAfter: 12,
    },
  }));

  s.addText(mkBullets(leftBullets), { x: 0.6, y: 2.0, w: 4.3, h: 3.2, valign: 'top' });
  s.addText(mkBullets(rightBullets), { x: 5.2, y: 2.0, w: 4.3, h: 3.2, valign: 'top' });

  s.addText('Full system details will be covered in a dedicated proposal', {
    x: 0.6, y: 5.0, w: 9, h: 0.3,
    fontSize: 11, fontFace: FONT, color: C.secondary, italic: true,
  });

  addSlideNumber(s, 11, TOTAL_SLIDES);
  addFooter(s);
}

function slide12_Chemicals(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Chemicals & Materials');

  s.addText([
    { text: 'R29,000 ', options: { fontSize: 32, fontFace: FONT, color: C.accent, bold: true } },
    { text: 'per month (VAT inclusive)', options: { fontSize: 18, fontFace: FONT, color: C.text } },
  ], { x: 0.8, y: 1.4, w: 8.5, h: 0.7 });

  addBullets(s, [
    'Dedicated monthly budget for cleaning chemicals, consumables, and materials',
    'Chemical programme designed for a baking environment — flour dust, yeast, allergens',
    'Approved supplier relationships maintained — consistent quality and supply',
    'Usage tracking and cost control — no surprises, no overruns',
    'PPE, consumables, and equipment replacement included in budget',
  ], { y: 2.3, h: 3.0 });

  addSlideNumber(s, 12, TOTAL_SLIDES);
  addFooter(s);
}

function slide13_CostSummary(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Cost Overview');

  const headers = ['Component', 'Monthly Cost'];
  const rows = [
    ['Total Labour (38 staff, all shifts)', 'R331,000'],
    ['Public Holidays (x1 premium, 30 staff/day)', 'Included'],
    ['Chemicals & Materials (VAT incl.)', 'R29,000'],
    ['Shift Allowances (afternoon 5%, night 10%, Sunday 10%)', 'Included in labour'],
    ['Statutory (pension, UIF, SLD, COIDA)', 'Included in labour'],
  ];

  const headerCells = headers.map(h => ({
    text: h,
    options: {
      fontSize: 14, fontFace: FONT, color: C.text, bold: true,
      fill: { color: C.primary },
      border: { type: 'solid', color: C.secondary, pt: 0.5 },
      valign: 'middle' as const,
    },
  }));

  const dataCells = rows.map(row =>
    row.map((cell, ci) => ({
      text: cell,
      options: {
        fontSize: 13, fontFace: FONT, color: ci === 1 ? C.accent : C.text,
        fill: { color: C.secondary },
        border: { type: 'solid', color: C.bg, pt: 0.5 },
        valign: 'middle' as const,
        bold: ci === 1,
      },
    }))
  );

  s.addTable([headerCells, ...dataCells], {
    x: 0.6, y: 1.3, w: 9,
    colW: [6.0, 3.0],
    rowH: 0.55,
  });

  // Note about SM
  s.addText('* Hygiene & Sanitation Manager costed within the labour total', {
    x: 0.6, y: 4.4, w: 9, h: 0.3,
    fontSize: 11, fontFace: FONT, color: C.secondary, italic: true,
  });

  s.addText('All figures based on 2026 RPH of R31.69 — refer to detailed costing spreadsheet', {
    x: 0.6, y: 4.7, w: 9, h: 0.3,
    fontSize: 11, fontFace: FONT, color: C.secondary, italic: true,
  });

  addSlideNumber(s, 13, TOTAL_SLIDES);
  addFooter(s);
}

function slide14_Transition(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Transition Approach');

  // Timeline phases
  const phases = [
    { label: 'Phase 1: Alignment', detail: 'Confirm staffing, shift patterns, and reporting lines with Bakehouse management', icon: '01' },
    { label: 'Phase 2: Transfer', detail: 'Employment transfer under same bargaining council terms — no disruption to staff', icon: '02' },
    { label: 'Phase 3: Systems', detail: 'Digital management platform configured and deployed for Bakehouse', icon: '03' },
    { label: 'Phase 4: Steady State', detail: 'Ongoing consultancy support, periodic assessments, and training programmes', icon: '04' },
  ];

  phases.forEach((phase, i) => {
    const y = 1.3 + i * 0.95;

    // Number circle
    s.addShape('ellipse' as any, {
      x: 0.6, y: y + 0.05, w: 0.5, h: 0.5,
      fill: { color: C.primary },
    });
    s.addText(phase.icon, {
      x: 0.6, y: y + 0.05, w: 0.5, h: 0.5,
      fontSize: 16, fontFace: FONT, color: C.text, bold: true, align: 'center', valign: 'middle',
    });

    // Connecting line
    if (i < phases.length - 1) {
      s.addShape('rect' as any, {
        x: 0.83, y: y + 0.58, w: 0.04, h: 0.35,
        fill: { color: C.secondary },
      });
    }

    s.addText(phase.label, {
      x: 1.3, y, w: 4, h: 0.35,
      fontSize: 15, fontFace: FONT, color: C.accent, bold: true,
    });
    s.addText(phase.detail, {
      x: 1.3, y: y + 0.32, w: 8, h: 0.35,
      fontSize: 13, fontFace: FONT, color: C.text,
    });
  });

  s.addText('Seamless transition — same people, same standards, stronger management', {
    x: 0.6, y: 5.0, w: 9, h: 0.3,
    fontSize: 12, fontFace: FONT, color: C.gold, italic: true,
  });

  addSlideNumber(s, 14, TOTAL_SLIDES);
  addFooter(s);
}

function slide15_WhyNow(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Why This Approach Works');

  addBullets(s, [
    'No disruption — the team that knows Bakehouse stays with Bakehouse',
    'Cost savings — eliminate outsourced management fees and margins',
    'Stronger accountability — direct line from cleaner to Bakehouse management',
    'Expert support remains — food safety consultancy from a trusted partner who knows the facility',
    'Digital tools included — enterprise-grade management system at no additional management cost',
    'Compliance maintained — same bargaining council, same statutory framework, same standards',
    'Culture shift — from "the outsourced cleaning company" to "our sanitation team"',
  ]);

  addSlideNumber(s, 15, TOTAL_SLIDES);
  addFooter(s);
}

function slide16_Closing(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);

  s.addText('Your Team.\nYour Standards.\nYour Results.', {
    x: 0.6, y: 1.4, w: 9, h: 2.2,
    fontSize: 38, fontFace: FONT, color: C.text, bold: true,
    lineSpacingMultiple: 1.2,
  });

  s.addShape('rect' as any, {
    x: 0.6, y: 3.7, w: 2.5, h: 0.04,
    fill: { color: C.accent },
  });

  s.addText('Supported by specialised food safety consultancy\nand a proven digital management platform', {
    x: 0.6, y: 3.9, w: 8, h: 0.7,
    fontSize: 15, fontFace: FONT, color: C.accent, italic: true,
    lineSpacingMultiple: 1.3,
  });

  s.addText('A detailed proposal covering the digital management system\nand consultancy scope will follow.', {
    x: 0.6, y: 4.7, w: 8, h: 0.5,
    fontSize: 12, fontFace: FONT, color: C.secondary, italic: true,
    lineSpacingMultiple: 1.3,
  });
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Food Safety Consultant';
  pptx.title = 'Bakehouse In-House Hygiene & Sanitation Proposal';
  pptx.subject = 'Transition to In-House Sanitation Model';

  slide01_Title(pptx);
  slide02_Context(pptx);
  slide03_Opportunity(pptx);
  slide04_Culture(pptx);
  slide05_Motivation(pptx);
  slide06_Expertise(pptx);
  slide07_StaffModel(pptx);
  slide08_Comparison(pptx);
  slide09_ConsultancyRole(pptx);
  slide10_Training(pptx);
  slide11_DigitalSystem(pptx);
  slide12_Chemicals(pptx);
  slide13_CostSummary(pptx);
  slide14_Transition(pptx);
  slide15_WhyNow(pptx);
  slide16_Closing(pptx);

  const outDir = path.resolve(__dirname, '../../output/bakehouse');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'bakehouse-inhouse-proposal.pptx');
  await pptx.writeFile({ fileName: outPath });

  console.log(`\n✅ Proposal exported: ${outPath}`);
  console.log(`   ${TOTAL_SLIDES} slides`);
}

main().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
