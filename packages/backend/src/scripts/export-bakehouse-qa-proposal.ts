/**
 * Bakehouse QA & Technical Support Services Proposal Deck
 *
 * Professional proposal for comprehensive food safety consultancy,
 * digital platform integration, online training, and audit support.
 *
 * Usage: npx tsx src/scripts/export-bakehouse-qa-proposal.ts
 * Output: output/bakehouse/bakehouse-qa-proposal.pptx
 */

import PptxGenJSModule from 'pptxgenjs';
const PptxGenJS = (PptxGenJSModule as any).default || PptxGenJSModule;
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Theme — Navy / Gold EnviroWize ───────────────────────────────────

const C = {
  bg: '0a1628',
  text: 'f0f4f8',
  primary: '2d8a4e',
  accent: '34d399',
  gold: 'fbbf24',
  secondary: '1e3a5f',
  warm: 'd97706',
  darkGreen: '0D2A1A',
  cream: 'fef3c7',
  navy: '0a1628',
  deepNavy: '060f1d',
};

const FONT = 'Inter';

const TOTAL_SLIDES = 22; // 16 original + 6 infographic demo slides

type Slide = any;

// ── Helpers ───────────────────────────────────────────────────────────

function darkBg(slide: Slide) {
  slide.background = { fill: C.bg };
}

function addTitle(slide: Slide, title: string, opts?: { y?: number; fontSize?: number; color?: string }) {
  slide.addText(title, {
    x: 0.6, y: opts?.y ?? 0.3, w: 9, h: 0.8,
    fontSize: opts?.fontSize ?? 28, fontFace: FONT,
    color: opts?.color ?? C.gold, bold: true,
  });
  slide.addShape('rect' as any, {
    x: 0.6, y: (opts?.y ?? 0.3) + 0.75, w: 1.8, h: 0.04,
    fill: { color: C.gold },
  });
}

function addBullets(slide: Slide, bullets: string[], opts?: { x?: number; y?: number; w?: number; h?: number; fontSize?: number; bulletColor?: string }) {
  const rows = bullets.map(b => ({
    text: b,
    options: {
      fontSize: opts?.fontSize ?? 15, fontFace: FONT, color: C.text,
      bullet: { code: '25CF', color: opts?.bulletColor ?? C.gold },
      paraSpaceAfter: 10,
    },
  }));
  slide.addText(rows, {
    x: opts?.x ?? 0.8, y: opts?.y ?? 1.3, w: opts?.w ?? 8.5, h: opts?.h ?? 4.0,
    valign: 'top',
  });
}

function addSlideNumber(slide: Slide, num: number) {
  slide.addText(`${num} / ${TOTAL_SLIDES}`, {
    x: 8.5, y: 5.2, w: 1.2, h: 0.3,
    fontSize: 9, fontFace: FONT, color: C.secondary, align: 'right',
  });
}

function addFooter(slide: Slide) {
  slide.addText('Confidential — Prepared for Bakehouse Management', {
    x: 0.6, y: 5.2, w: 5, h: 0.3,
    fontSize: 8, fontFace: FONT, color: C.secondary, italic: true,
  });
}

// ── Slide Builders ────────────────────────────────────────────────────

function slide01_Title(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);

  s.addText('QA & Technical\nSupport Services', {
    x: 0.6, y: 1.0, w: 9, h: 2.2,
    fontSize: 44, fontFace: FONT, color: C.text, bold: true,
    lineSpacingMultiple: 1.1,
  });

  s.addText('Bakehouse — Food Safety Excellence Program', {
    x: 0.6, y: 3.2, w: 9, h: 0.6,
    fontSize: 22, fontFace: FONT, color: C.gold,
  });

  s.addText('myHACCPAdmin', {
    x: 0.6, y: 3.9, w: 7, h: 0.5,
    fontSize: 16, fontFace: FONT, color: C.accent,
  });

  s.addShape('rect' as any, {
    x: 0.6, y: 4.6, w: 3, h: 0.05,
    fill: { color: C.gold },
  });

  s.addText('Confidential', {
    x: 0.6, y: 4.8, w: 3, h: 0.3,
    fontSize: 10, fontFace: FONT, color: C.secondary,
  });
}

function slide02_ExecutiveSummary(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Executive Summary');

  s.addText('A complete food safety support model — digital, consultative, and audit-ready', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 15, fontFace: FONT, color: C.gold, italic: true,
  });

  addBullets(s, [
    'Comprehensive food safety consultancy support tailored to Bakehouse operations',
    'Digital platform integration — myHACCPAdmin for HACCP management and compliance',
    'Online training for all staff across 6 critical food safety disciplines',
    'External audit support — preparation, attendance, and corrective action follow-up',
    'Periodic onsite internal audits to maintain continuous compliance',
    'Two flexible pricing tiers to match your operational needs and budget',
  ], { y: 2.0, h: 3.5 });

  addSlideNumber(s, 2);
  addFooter(s);
}

function slide03_DigitalPlatform(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Digital Platform — myHACCPAdmin');

  s.addText('Cloud-based HACCP management — accessible anywhere, anytime', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 15, fontFace: FONT, color: C.gold, italic: true,
  });

  // Two-column layout
  const leftBullets = [
    'Cloud-based HACCP management system',
    'Document control with version tracking',
    'CCP monitoring and real-time alerts',
    'Corrective action workflows with RACI',
  ];
  const rightBullets = [
    'Real-time compliance dashboards',
    'Audit evidence and record management',
    'Supplier verification tracking',
    'Management review and reporting',
  ];

  const mkBullets = (items: string[]) => items.map(b => ({
    text: b,
    options: {
      fontSize: 14, fontFace: FONT, color: C.text,
      bullet: { code: '25CF', color: C.gold },
      paraSpaceAfter: 12,
    },
  }));

  s.addText(mkBullets(leftBullets), { x: 0.6, y: 2.0, w: 4.3, h: 3.2, valign: 'top' });
  s.addText(mkBullets(rightBullets), { x: 5.2, y: 2.0, w: 4.3, h: 3.2, valign: 'top' });

  s.addText('Replacing paper-based systems with a single digital platform for all food safety management', {
    x: 0.6, y: 5.0, w: 9, h: 0.3,
    fontSize: 11, fontFace: FONT, color: C.secondary, italic: true,
  });

  addSlideNumber(s, 3);
  addFooter(s);
}

function slide04_FSSC22000(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'FSSC 22000 Support');

  s.addText('Food Safety System Certification — the global benchmark', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 15, fontFace: FONT, color: C.gold, italic: true,
  });

  addBullets(s, [
    'Full FSSC 22000 implementation guidance and ongoing support',
    'Gap analysis against scheme requirements — identify and close weaknesses',
    'Prerequisite Programs (PRPs) development and verification',
    'Management system integration — align HACCP, quality, and food safety',
    'Food safety culture assessment and improvement planning',
    'Pre-audit readiness checks and mock audit exercises',
    'Surveillance audit preparation and continuous improvement tracking',
  ], { y: 2.0, h: 3.5 });

  addSlideNumber(s, 4);
  addFooter(s);
}

function slide05_TrainingOverview(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Training Program Overview');

  s.addText('6 comprehensive online modules — all staff, all levels', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 15, fontFace: FONT, color: C.gold, italic: true,
  });

  // Training modules as numbered cards
  const modules = [
    { num: '01', title: 'Internal Audit', desc: 'Planning, conducting, reporting, corrective actions' },
    { num: '02', title: 'Food Defence', desc: 'Threat assessment, CARVER+Shock, incident response' },
    { num: '03', title: 'Food Safety', desc: 'GMP, temperature control, cross-contamination, hygiene' },
    { num: '04', title: 'Food Fraud', desc: 'Vulnerability assessment, supply chain verification' },
    { num: '05', title: 'HACCP', desc: '7 principles, hazard analysis, CCP monitoring' },
    { num: '06', title: 'Cleaning & Sanitation', desc: 'Chemistry, protocols, environmental monitoring' },
  ];

  modules.forEach((mod, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.7;
    const y = 2.0 + row * 1.05;

    s.addShape('rect' as any, {
      x, y, w: 4.4, h: 0.9,
      fill: { color: C.secondary }, rectRadius: 0.05,
    });

    // Number badge
    s.addShape('rect' as any, {
      x: x + 0.1, y: y + 0.15, w: 0.55, h: 0.55,
      fill: { color: C.gold }, rectRadius: 0.04,
    });
    s.addText(mod.num, {
      x: x + 0.1, y: y + 0.15, w: 0.55, h: 0.55,
      fontSize: 16, fontFace: FONT, color: C.navy, bold: true, align: 'center', valign: 'middle',
    });

    s.addText(mod.title, {
      x: x + 0.8, y: y + 0.08, w: 3.4, h: 0.4,
      fontSize: 15, fontFace: FONT, color: C.text, bold: true,
    });
    s.addText(mod.desc, {
      x: x + 0.8, y: y + 0.45, w: 3.4, h: 0.38,
      fontSize: 11, fontFace: FONT, color: C.accent,
    });
  });

  s.addText('All modules delivered online with certified completion tracking', {
    x: 0.6, y: 5.0, w: 9, h: 0.3,
    fontSize: 12, fontFace: FONT, color: C.secondary, italic: true,
  });

  addSlideNumber(s, 5);
  addFooter(s);
}

function slide06_InternalAudit(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Internal Audit Training');

  addBullets(s, [
    'Audit planning and scheduling — risk-based approach aligned to FSSC 22000',
    'Conducting effective internal audits — objective evidence gathering techniques',
    'Non-conformance classification — major, minor, and observations',
    'Writing clear, actionable non-conformance reports (NCRs)',
    'Corrective action follow-up — root cause analysis and verification of effectiveness',
    'Audit reporting and management review integration',
    'Building competent internal auditors within Bakehouse',
  ]);

  addSlideNumber(s, 6);
  addFooter(s);
}

function slide07_FoodDefence(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Food Defence Training');

  addBullets(s, [
    'Threat assessment methodology — identifying intentional contamination risks',
    'Vulnerability analysis using CARVER+Shock framework',
    'Physical security measures — access control, visitor management, surveillance',
    'Personnel security — background checks, awareness training, insider threat mitigation',
    'Incident response planning — containment, notification, and recovery procedures',
    'Supply chain security — transportation, storage, and receiving protocols',
    'Regulatory requirements — FSMA, GFSI scheme obligations',
  ]);

  addSlideNumber(s, 7);
  addFooter(s);
}

function slide08_FoodSafety(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Food Safety Training');

  addBullets(s, [
    'Good Manufacturing Practices (GMP) — the foundation of food safety',
    'Temperature control and monitoring — cold chain, hot holding, cooling protocols',
    'Cross-contamination prevention — physical, chemical, biological, allergen',
    'Personal hygiene standards — handwashing, protective clothing, illness reporting',
    'Pest awareness — identification, prevention, reporting obligations',
    'Foreign body prevention — metal detection, glass policy, maintenance protocols',
    'Traceability and recall procedures — 1-up, 1-down, mock recall exercises',
  ]);

  addSlideNumber(s, 8);
  addFooter(s);
}

function slide09_FoodFraud(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Food Fraud Training');

  addBullets(s, [
    'Vulnerability assessment using the SSAFE tool — structured, repeatable methodology',
    'Supply chain verification — approved supplier programs and audit protocols',
    'Authenticity testing approaches — analytical and documentation-based',
    'Economically motivated adulteration (EMA) — recognising the warning signs',
    'Mitigation strategies — procurement controls, specification management, testing',
    'Regulatory landscape — EU, FDA, and GFSI scheme requirements',
    'Whistleblower mechanisms and reporting culture development',
  ]);

  addSlideNumber(s, 9);
  addFooter(s);
}

function slide10_HACCP(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'HACCP Training');

  addBullets(s, [
    'The 7 HACCP principles — from hazard analysis to record keeping',
    'Hazard analysis methodology — biological, chemical, physical, allergen hazards',
    'CCP identification using decision trees — systematic and documented',
    'Establishing critical limits, monitoring procedures, and corrective actions',
    'Verification and validation — confirming your HACCP plan works',
    'HACCP team competency — roles, responsibilities, and ongoing development',
    'HACCP plan review and update procedures — keeping it current and effective',
  ]);

  addSlideNumber(s, 10);
  addFooter(s);
}

function slide11_CleaningSanitation(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Cleaning & Sanitation Training');

  addBullets(s, [
    'Cleaning chemistry fundamentals — detergents, sanitisers, contact times, dilution rates',
    'Equipment-specific cleaning procedures — dismantling, cleaning, reassembly, verification',
    'Environmental monitoring programs — swabbing plans, indicator organisms, trend analysis',
    'Verification methods — ATP testing, microbial swabbing, visual inspection protocols',
    'Allergen cleaning validation — changeover procedures and residue testing',
    'Chemical safety — MSDS, PPE, storage, and handling requirements',
    'Master Cleaning Schedule (MCS) compliance and sign-off procedures',
  ]);

  addSlideNumber(s, 11);
  addFooter(s);
}

function addInfographicSlide(pptx: any, title: string, imagePath: string, slideNum: number) {
  const s = pptx.addSlide();
  darkBg(s);

  // Thin gold bar at top
  s.addShape('rect' as any, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.gold } });

  // Title
  s.addText(`Training Example — ${title}`, {
    x: 0.4, y: 0.15, w: 9.2, h: 0.5,
    fontSize: 16, fontFace: FONT, color: C.gold, bold: true,
  });

  // Image — full width
  if (fs.existsSync(imagePath)) {
    s.addImage({
      path: imagePath,
      x: 0.5, y: 0.75, w: 9.0, h: 4.6,
      sizing: { type: 'contain', w: 9.0, h: 4.6 },
    });
  } else {
    s.addText(`[Image not found: ${path.basename(imagePath)}]`, {
      x: 0.5, y: 2.5, w: 9, h: 1,
      fontSize: 14, fontFace: FONT, color: C.warm, italic: true, align: 'center',
    });
  }

  addSlideNumber(s, slideNum);
  addFooter(s);
}

function slide12_ExampleTraining(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Training Delivery Format');

  s.addText('Professional, engaging, and accessible to all staff levels', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 15, fontFace: FONT, color: C.gold, italic: true,
  });

  // Three feature boxes
  const features = [
    { title: 'Online Delivery', items: ['Self-paced learning modules', 'Video-based instruction', 'Accessible on any device', 'Available 24/7'] },
    { title: 'Assessment', items: ['Module-end quizzes', 'Practical evaluations', 'Certified completion', 'Competency tracking'] },
    { title: 'Support', items: ['Facilitator-led Q&A sessions', 'Downloadable reference materials', 'Refresher scheduling', 'Annual re-certification'] },
  ];

  features.forEach((feat, i) => {
    const x = 0.5 + i * 3.2;

    s.addShape('rect' as any, {
      x, y: 2.0, w: 2.9, h: 0.5,
      fill: { color: C.gold }, rectRadius: 0.04,
    });
    s.addText(feat.title, {
      x, y: 2.0, w: 2.9, h: 0.5,
      fontSize: 15, fontFace: FONT, color: C.navy, bold: true, align: 'center', valign: 'middle',
    });

    const colBullets = feat.items.map(b => ({
      text: b,
      options: {
        fontSize: 13, fontFace: FONT, color: C.text,
        bullet: { code: '25CF', color: C.accent },
        paraSpaceAfter: 8,
      },
    }));

    s.addText(colBullets, {
      x: x + 0.15, y: 2.65, w: 2.6, h: 2.5,
      valign: 'top',
    });
  });

  addSlideNumber(s, 12);
  addFooter(s);
}

function slide13_AuditSupport(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Audit Support Services');

  s.addText('Expert support before, during, and after every audit', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 15, fontFace: FONT, color: C.gold, italic: true,
  });

  addBullets(s, [
    'Support during external audits — FSSC 22000, BRC, customer audits',
    'Pre-audit preparation and document review to ensure readiness',
    'Periodic onsite internal audits — independent assessment of your systems',
    'Corrective action management — root cause analysis, implementation, and verification',
    'Continuous improvement tracking — audit findings trend analysis',
    'Mock audits and gap assessments ahead of certification or surveillance visits',
    'Audit evidence organisation — digital record management via myHACCPAdmin',
  ], { y: 2.0, h: 3.5 });

  addSlideNumber(s, 13);
  addFooter(s);
}

function slide14_Investment(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Investment — Two Pricing Tiers');

  // Option A — Left box
  s.addShape('rect' as any, {
    x: 0.4, y: 1.3, w: 4.5, h: 3.8,
    fill: { color: C.secondary }, rectRadius: 0.08,
    line: { color: C.gold, width: 1.5 },
  });

  s.addText('Option A', {
    x: 0.6, y: 1.4, w: 4.1, h: 0.35,
    fontSize: 12, fontFace: FONT, color: C.accent, bold: true,
  });
  s.addText('Hygiene & Sanitation Package', {
    x: 0.6, y: 1.7, w: 4.1, h: 0.4,
    fontSize: 16, fontFace: FONT, color: C.text, bold: true,
  });
  s.addText([
    { text: 'R8,000', options: { fontSize: 28, fontFace: FONT, color: C.gold, bold: true } },
    { text: ' / month', options: { fontSize: 14, fontFace: FONT, color: C.text } },
  ], { x: 0.6, y: 2.15, w: 4.1, h: 0.6 });

  const optABullets = [
    'Cleaning & Sanitation Training (online)',
    'Cleaning Software Platform',
    'Training for all staff',
    'Periodic reviews',
  ].map(b => ({
    text: b,
    options: {
      fontSize: 13, fontFace: FONT, color: C.text,
      bullet: { code: '25CF', color: C.gold },
      paraSpaceAfter: 8,
    },
  }));
  s.addText(optABullets, { x: 0.7, y: 2.85, w: 4.0, h: 2.1, valign: 'top' });

  // Option B — Right box (highlighted)
  s.addShape('rect' as any, {
    x: 5.2, y: 1.3, w: 4.8, h: 3.8,
    fill: { color: C.darkGreen }, rectRadius: 0.08,
    line: { color: C.gold, width: 2.5 },
  });

  // Recommended badge
  s.addShape('rect' as any, {
    x: 7.8, y: 1.15, w: 2.0, h: 0.35,
    fill: { color: C.gold }, rectRadius: 0.15,
  });
  s.addText('RECOMMENDED', {
    x: 7.8, y: 1.15, w: 2.0, h: 0.35,
    fontSize: 10, fontFace: FONT, color: C.navy, bold: true, align: 'center', valign: 'middle',
  });

  s.addText('Option B', {
    x: 5.4, y: 1.4, w: 4.4, h: 0.35,
    fontSize: 12, fontFace: FONT, color: C.accent, bold: true,
  });
  s.addText('Full Food Safety Package', {
    x: 5.4, y: 1.7, w: 4.4, h: 0.4,
    fontSize: 16, fontFace: FONT, color: C.text, bold: true,
  });
  s.addText([
    { text: 'R12,000', options: { fontSize: 28, fontFace: FONT, color: C.gold, bold: true } },
    { text: ' / month', options: { fontSize: 14, fontFace: FONT, color: C.text } },
  ], { x: 5.4, y: 2.15, w: 4.4, h: 0.6 });

  const optBBullets = [
    'ALL 6 training modules (online)',
    'myHACCPAdmin software platform',
    'Full food safety consulting support',
    'External audit support',
    'Periodic onsite internal audits',
    'Training for ALL staff',
  ].map(b => ({
    text: b,
    options: {
      fontSize: 13, fontFace: FONT, color: C.text,
      bullet: { code: '25CF', color: C.gold },
      paraSpaceAfter: 6,
    },
  }));
  s.addText(optBBullets, { x: 5.5, y: 2.85, w: 4.3, h: 2.1, valign: 'top' });

  addSlideNumber(s, 14);
  addFooter(s);
}

function slide15_WhyUs(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);
  addTitle(s, 'Why Partner With Us');

  s.addText('"Food safety is not a department — it is a culture.\nWe help you build it."', {
    x: 0.8, y: 1.4, w: 8.5, h: 0.8,
    fontSize: 17, fontFace: FONT, color: C.gold, italic: true,
    lineSpacingMultiple: 1.3,
  });

  addBullets(s, [
    'Deep industry expertise — 25+ years in food safety, led by food technologists',
    'Digital-first approach — myHACCPAdmin replaces paper with real-time compliance',
    'Cost-effective monthly model — no large upfront investment, predictable budgeting',
    'Proven track record — trusted by leading food manufacturers across South Africa',
    'Holistic support — training, consulting, auditing, and digital tools in one partner',
    'Knowledge transfer — building internal capability, not creating dependency',
  ], { y: 2.4, h: 3.0 });

  addSlideNumber(s, 15);
  addFooter(s);
}

function slide16_NextSteps(pptx: any) {
  const s = pptx.addSlide();
  darkBg(s);

  s.addText('Next Steps', {
    x: 0.6, y: 1.2, w: 9, h: 1.0,
    fontSize: 40, fontFace: FONT, color: C.text, bold: true,
  });

  s.addShape('rect' as any, {
    x: 0.6, y: 2.2, w: 2.5, h: 0.04,
    fill: { color: C.gold },
  });

  const steps = [
    { num: '1', text: 'Select your preferred package — Option A or Option B' },
    { num: '2', text: 'Schedule onboarding meeting to configure myHACCPAdmin' },
    { num: '3', text: 'Staff training rollout begins within 2 weeks of sign-off' },
    { num: '4', text: 'First internal audit scheduled within 30 days' },
  ];

  steps.forEach((step, i) => {
    const y = 2.5 + i * 0.7;

    s.addShape('ellipse' as any, {
      x: 0.7, y: y + 0.05, w: 0.45, h: 0.45,
      fill: { color: C.gold },
    });
    s.addText(step.num, {
      x: 0.7, y: y + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONT, color: C.navy, bold: true, align: 'center', valign: 'middle',
    });
    s.addText(step.text, {
      x: 1.35, y, w: 8, h: 0.55,
      fontSize: 16, fontFace: FONT, color: C.text, valign: 'middle',
    });
  });

  s.addShape('rect' as any, {
    x: 0.6, y: 5.2, w: 9, h: 0.04,
    fill: { color: C.secondary },
  });

  s.addText('myHACCPAdmin', {
    x: 0.6, y: 5.35, w: 5, h: 0.3,
    fontSize: 13, fontFace: FONT, color: C.gold, bold: true,
  });
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'myHACCPAdmin';
  pptx.company = 'myHACCPAdmin';
  pptx.title = 'Bakehouse QA & Technical Support Services';
  pptx.subject = 'Food Safety Excellence Program';

  slide01_Title(pptx);
  slide02_ExecutiveSummary(pptx);
  slide03_DigitalPlatform(pptx);
  slide04_FSSC22000(pptx);
  slide05_TrainingOverview(pptx);
  slide06_InternalAudit(pptx);
  slide07_FoodDefence(pptx);
  slide08_FoodSafety(pptx);
  slide09_FoodFraud(pptx);
  slide10_HACCP(pptx);
  slide11_CleaningSanitation(pptx);

  // Demo infographic slides — one per training module
  const imgDir = path.resolve(__dirname, '../../output/bakehouse/training');
  const infographics = [
    { title: 'Internal Audit', file: '01-internal-audit-training.jpg' },
    { title: 'Food Defence', file: '02-food-defence-training.jpg' },
    { title: 'Food Safety', file: '03-food-safety-training.jpg' },
    { title: 'Food Fraud', file: '04-food-fraud-training.jpg' },
    { title: 'HACCP', file: '05-haccp-training.jpg' },
    { title: 'Cleaning & Sanitation', file: '06-cleaning-sanitation-training.jpg' },
  ];
  infographics.forEach((info, i) => {
    addInfographicSlide(pptx, info.title, path.join(imgDir, info.file), 12 + i);
  });

  slide12_ExampleTraining(pptx);
  slide13_AuditSupport(pptx);
  slide14_Investment(pptx);
  slide15_WhyUs(pptx);
  slide16_NextSteps(pptx);

  const outDir = path.resolve(__dirname, '../../output/bakehouse');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'bakehouse-qa-proposal.pptx');
  await pptx.writeFile({ fileName: outPath });

  console.log(`\n✅ Proposal exported: ${outPath}`);
  console.log(`   ${TOTAL_SLIDES} slides`);
}

main().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
