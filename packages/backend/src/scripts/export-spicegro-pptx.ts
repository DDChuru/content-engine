/**
 * Export Spicegro Introduction deck as PowerPoint (.pptx)
 *
 * Uses the same slide data from SpicegroIntroduction.tsx composition
 * to generate a standalone .pptx file with embedded images.
 *
 * Usage: npx ts-node src/scripts/export-spicegro-pptx.ts
 * Output: output/spicegro/spicegro-introduction.pptx
 */

import PptxGenJSModule from 'pptxgenjs';
const PptxGenJS = (PptxGenJSModule as any).default || PptxGenJSModule;
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Theme (matches envirowizeCorporateTheme) ──────────────────────────

const COLORS = {
  bg: '0a1628',
  text: 'f0f4f8',
  primary: '2d8a4e',
  accent: '34d399',
  highlight: 'fbbf24',
  secondary: '1e3a5f',
};

const FONT = 'Inter';

// ── Image helpers ─────────────────────────────────────────────────────

const IMG_DIR = path.resolve(__dirname, '../remotion/public/images/spicegro');

function imgPath(filename: string): string {
  return path.join(IMG_DIR, filename);
}

function imgData(filename: string): string {
  const p = imgPath(filename);
  if (!fs.existsSync(p)) return '';
  const buf = fs.readFileSync(p);
  return `image/jpeg;base64,${buf.toString('base64')}`;
}

// ── Slide builders ────────────────────────────────────────────────────

function addDarkBackground(slide: PptxGenJS.Slide, imageFile?: string) {
  if (imageFile) {
    const data = imgData(imageFile);
    if (data) {
      slide.background = { data };
      // Dark overlay via a semi-transparent rectangle
      slide.addShape('rect' as any, {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { color: COLORS.bg, transparency: 30 },
      });
      return;
    }
  }
  slide.background = { fill: COLORS.bg };
}

function addTitleSlide(pptx: PptxGenJS, title: string, subtitle: string, imageFile: string) {
  const slide = pptx.addSlide();
  addDarkBackground(slide, imageFile);

  slide.addText(title, {
    x: 0.5, y: 2.0, w: 9, h: 1.5,
    fontSize: 40, fontFace: FONT, color: COLORS.text,
    bold: true, align: 'center', valign: 'middle',
  });
  slide.addText(subtitle, {
    x: 1.0, y: 3.5, w: 8, h: 0.8,
    fontSize: 20, fontFace: FONT, color: COLORS.accent,
    align: 'center', valign: 'middle',
  });
}

function addContentSlide(pptx: PptxGenJS, title: string, bullets: string[], imageFile?: string) {
  const slide = pptx.addSlide();
  addDarkBackground(slide, imageFile);

  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.8,
    fontSize: 28, fontFace: FONT, color: COLORS.accent,
    bold: true,
  });

  // Green accent bar
  slide.addShape('rect' as any, {
    x: 0.5, y: 1.05, w: 1.5, h: 0.04,
    fill: { color: COLORS.accent },
  });

  const bulletRows: PptxGenJS.TextProps[] = bullets.map(b => ({
    text: b,
    options: {
      fontSize: 16, fontFace: FONT, color: COLORS.text,
      bullet: { code: '25CF', color: COLORS.accent },
      paraSpaceAfter: 8,
    },
  }));

  slide.addText(bulletRows, {
    x: 0.7, y: 1.3, w: 8.6, h: 3.8,
    valign: 'top',
  });
}

function addImageSlide(pptx: PptxGenJS, title: string, caption: string, imageFile: string) {
  const slide = pptx.addSlide();
  slide.background = { fill: COLORS.bg };

  const data = imgData(imageFile);
  if (data) {
    slide.addImage({
      data,
      x: 0.5, y: 0.5, w: 9, h: 4.2,
      rounding: true,
    });
  }

  slide.addText(title, {
    x: 0.5, y: 4.7, w: 9, h: 0.5,
    fontSize: 22, fontFace: FONT, color: COLORS.accent, bold: true, align: 'center',
  });
  slide.addText(caption, {
    x: 1, y: 5.15, w: 8, h: 0.4,
    fontSize: 14, fontFace: FONT, color: COLORS.text, italic: true, align: 'center',
  });
}

function addTableSlide(pptx: PptxGenJS, title: string, headers: string[], rows: string[][]) {
  const slide = pptx.addSlide();
  slide.background = { fill: COLORS.bg };

  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 26, fontFace: FONT, color: COLORS.accent, bold: true,
  });

  const headerRow: PptxGenJS.TableCell[] = headers.map(h => ({
    text: h,
    options: {
      fontSize: 14, fontFace: FONT, color: COLORS.text, bold: true,
      fill: { color: COLORS.primary },
      border: { type: 'solid', color: COLORS.secondary, pt: 0.5 },
      valign: 'middle' as const,
    },
  }));

  const dataRows: PptxGenJS.TableCell[][] = rows.map(row =>
    row.map(cell => ({
      text: cell,
      options: {
        fontSize: 12, fontFace: FONT, color: COLORS.text,
        fill: { color: COLORS.secondary },
        border: { type: 'solid', color: COLORS.bg, pt: 0.5 },
        valign: 'middle' as const,
      },
    }))
  );

  const colW = headers.length === 3 ? [2.0, 3.5, 3.5] : [3.0, 6.0];

  slide.addTable([headerRow, ...dataRows], {
    x: 0.5, y: 1.1, w: 9,
    colW,
    rowH: 0.55,
    autoPage: false,
  });
}

function addTimelineSlide(
  pptx: PptxGenJS,
  title: string,
  phases: { label: string; detail: string; status: string }[],
  imageFile?: string,
) {
  const slide = pptx.addSlide();
  addDarkBackground(slide, imageFile);

  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 26, fontFace: FONT, color: COLORS.accent, bold: true,
  });

  phases.forEach((phase, i) => {
    const y = 1.2 + i * 0.85;
    const icon = phase.status === 'completed' ? '✓' : '●';
    const iconColor = phase.status === 'completed' ? COLORS.accent : COLORS.highlight;

    slide.addText(icon, {
      x: 0.5, y, w: 0.5, h: 0.4,
      fontSize: 20, fontFace: FONT, color: iconColor, align: 'center',
    });
    slide.addText(phase.label, {
      x: 1.1, y, w: 3, h: 0.4,
      fontSize: 15, fontFace: FONT, color: COLORS.text, bold: true,
    });
    slide.addText(phase.detail, {
      x: 4.2, y, w: 5.3, h: 0.4,
      fontSize: 13, fontFace: FONT, color: COLORS.text,
    });

    // Connecting line
    if (i < phases.length - 1) {
      slide.addShape('rect' as any, {
        x: 0.72, y: y + 0.42, w: 0.06, h: 0.4,
        fill: { color: COLORS.secondary },
      });
    }
  });
}

function addComparisonSlide(
  pptx: PptxGenJS,
  title: string,
  leftHeader: string,
  rightHeader: string,
  rows: { left: string; right: string }[],
) {
  const slide = pptx.addSlide();
  slide.background = { fill: COLORS.bg };

  slide.addText(title, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 26, fontFace: FONT, color: COLORS.accent, bold: true, align: 'center',
  });

  // Column headers
  slide.addText(leftHeader, {
    x: 0.5, y: 1.1, w: 4, h: 0.5,
    fontSize: 18, fontFace: FONT, color: COLORS.highlight, bold: true, align: 'center',
  });
  slide.addText(rightHeader, {
    x: 5.5, y: 1.1, w: 4, h: 0.5,
    fontSize: 18, fontFace: FONT, color: COLORS.accent, bold: true, align: 'center',
  });

  rows.forEach((row, i) => {
    const y = 1.7 + i * 0.65;

    slide.addShape('rect' as any, {
      x: 0.5, y, w: 4, h: 0.55,
      fill: { color: COLORS.secondary },
      rectRadius: 0.05,
    });
    slide.addText(row.left, {
      x: 0.7, y, w: 3.6, h: 0.55,
      fontSize: 13, fontFace: FONT, color: COLORS.text, valign: 'middle',
    });

    // Arrow
    slide.addText('→', {
      x: 4.5, y, w: 1, h: 0.55,
      fontSize: 18, fontFace: FONT, color: COLORS.accent, align: 'center', valign: 'middle',
    });

    slide.addShape('rect' as any, {
      x: 5.5, y, w: 4, h: 0.55,
      fill: { color: '0d2a1a' },
      rectRadius: 0.05,
    });
    slide.addText(row.right, {
      x: 5.7, y, w: 3.6, h: 0.55,
      fontSize: 13, fontFace: FONT, color: COLORS.accent, valign: 'middle',
    });
  });
}

function addClosingSlide(pptx: PptxGenJS, headline: string, tagline: string, company: string, imageFile: string) {
  const slide = pptx.addSlide();
  addDarkBackground(slide, imageFile);

  slide.addText(headline, {
    x: 0.5, y: 1.8, w: 9, h: 1.2,
    fontSize: 44, fontFace: FONT, color: COLORS.text, bold: true, align: 'center', valign: 'middle',
  });
  slide.addText(tagline, {
    x: 1, y: 3.2, w: 8, h: 0.6,
    fontSize: 18, fontFace: FONT, color: COLORS.accent, italic: true, align: 'center',
  });
  slide.addText(company, {
    x: 1, y: 4.0, w: 8, h: 0.5,
    fontSize: 16, fontFace: FONT, color: COLORS.text, align: 'center',
  });
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 → standard widescreen
  pptx.author = 'EnviroWize';
  pptx.company = 'EnviroWize Hygiene & Sanitation';
  pptx.title = 'EnviroWize for Spicegro';
  pptx.subject = 'Hygiene & Sanitation Partner';

  // Slide 1: Title
  addTitleSlide(pptx, 'EnviroWize for Spicegro', 'Hygiene & Sanitation Partner', '01-title-gradient.jpg');

  // Slide 2: Understanding Spicegro
  addContentSlide(pptx, 'Understanding Spicegro', [
    'Leading SA supplier of spices, herbs, and food ingredients since 2011',
    'Source, manufacture, blend, and supply — bulk, batch packs, and retail sizes',
    'Certified Kosher, Halaal, and Food Safety Certified',
    'Based at Malibongwe Industrial Park, Mogale City (Gauteng)',
    'Four pillars: Quality, Support, Consistency, Reliability',
  ], '02-spice-warehouse.jpg');

  // Slide 3: The Dry Processing Paradox
  addContentSlide(pptx, 'The Dry Processing Paradox', [
    'Traditional wet cleaning actually increases risk in dry spice environments',
    'Moisture activates dormant Salmonella — can survive for months in low-moisture',
    'Creates caking, product quality issues, and compromises products',
    'Requires specialised dry-cleaning protocols and validated chemical applications',
    'Knowing when and where wet cleaning is permissible is critical',
  ], '03-dry-processing.jpg');

  // Slide 4: Allergen Cross-Contamination
  addContentSlide(pptx, 'Allergen Cross-Contamination', [
    'Single biggest liability for any spice manufacturer',
    'Shared equipment processes major allergens: mustard, celery, sesame',
    'Allergen proteins bond to stainless steel — changeover must be validated',
    'Dry cleaning alone may not remove allergens; wet cleaning adds moisture risk',
    'One event triggers product recall, brand damage, and legal liability',
  ]);

  // Slide 5: Equipment Dismantling (Image)
  addImageSlide(pptx, 'Equipment Dismantling',
    'Valve disassembly under a mixing tank — getting into every nook and cranny',
    '05b-valve-disassembly-foreground.jpg');

  // Slide 6: Hidden Harbourage Points (Table)
  addTableSlide(pptx, 'Hidden Harbourage Points',
    ['Equipment', 'Hidden Zones', 'Risk'],
    [
      ['Grinders / mills', 'Internal surfaces, discharge chutes, bearing seals', 'Spice residue cakes into micro-crevices'],
      ['Ribbon / paddle mixers', 'Paddle-shaft junctions, end seals, discharge valves', 'Product builds up; allergen carry-over'],
      ['Lump breakers', 'Screen mesh, blade mounting points', '"All types of nooks and crannies"'],
      ['Conveyors', 'Guide rails underneath belts, hollow framework', 'Residue in areas never visible during production'],
      ['Packaging machines', 'Forming collars, sealing jaws, dosing augers', 'Direct product contact with complex geometry'],
      ['Sieves / sifters', 'Mesh screens, frame gaskets, discharge points', 'Fine powder embeds in mesh'],
    ]);

  // Slide 7: Flavour Contamination
  addContentSlide(pptx, 'Flavour Contamination', [
    'Flavour carry-over between runs is the daily operational headache',
    'Volatile oils bond to equipment — nanogram detection thresholds',
    'Grinding at 42–95 °C drives oils deeper into surfaces',
    'Failed organoleptic QC = wasted product and credibility loss',
    '"Clean-looking" equipment may still carry flavour contamination',
  ], '07-spice-powders.jpg');

  // Slide 8: The Dual Mandate (Comparison)
  addComparisonSlide(pptx, 'The Dual Mandate', 'Food Safety', 'Product Quality', [
    { left: 'Allergen removal', right: 'Flavour purity' },
    { left: 'Pathogen elimination', right: 'Colour integrity' },
    { left: 'Regulatory compliance', right: 'Customer specification' },
    { left: 'Recall prevention', right: 'Brand consistency' },
  ]);

  // Slide 9: What Spicegro Needs
  addContentSlide(pptx, 'What Spicegro Needs', [
    'Dry cleaning expertise — most companies default to wet cleaning',
    'Allergen management & validated cleaning protocols',
    'Environmental monitoring with proactive detection',
    'Equipment dismantling SOPs and flavour carry-over prevention',
    'HACCP-aligned sanitation, staff training, and audit readiness',
  ]);

  // Slide 10: Who is EnviroWize
  addContentSlide(pptx, 'Who is EnviroWize', [
    '25+ years in food safety — led by food technologists, not business managers',
    'Proactive food safety, not reactive cleaning',
    'Facility-specific, validated protocols — not one-size-fits-all',
    'Environmental monitoring programs with trend analysis and corrective action',
    'Proven results in Listeria intervention, FMCG sanitation, and chemical optimisation',
  ], '10-food-safety-team.jpg');

  // ── DIGITAL SYSTEM SHOWCASE (Slides 11–13) ──
  // Each slide: screenshot is the HERO — large, prominent, real system, not a mockup

  // Slide 11: NCR Process Owner Dashboard
  {
    const slide = pptx.addSlide();
    slide.background = { fill: COLORS.bg };

    slide.addText('NCR Management Dashboard', {
      x: 0.5, y: 0.15, w: 6, h: 0.5,
      fontSize: 24, fontFace: FONT, color: COLORS.accent, bold: true,
    });
    slide.addText('Live System', {
      x: 7.0, y: 0.15, w: 2.8, h: 0.5,
      fontSize: 13, fontFace: FONT, color: COLORS.highlight, bold: true, align: 'right',
    });

    // Hero screenshot — large and prominent
    const dashData = imgData('ncr-dashboard.png');
    if (dashData) {
      // White border effect
      slide.addShape('rect' as any, {
        x: 0.25, y: 0.7, w: 9.5, h: 3.65,
        fill: { color: 'ffffff' }, rectRadius: 0.08,
        shadow: { type: 'outer', blur: 8, offset: 3, color: '000000', opacity: 0.3 },
      });
      slide.addImage({
        data: dashData,
        x: 0.35, y: 0.8, w: 9.3, h: 3.45,
      });
    }

    // Talking points below screenshot
    const points = [
      { label: 'Total NCRs & Status', detail: 'At-a-glance view of open, pending, and closed non-conformances' },
      { label: 'Severity Distribution', detail: 'Major vs Minor — prioritise what matters most' },
      { label: 'Time Analytics', detail: 'Average days to close, open NCR age — hold teams accountable' },
      { label: 'Quick Actions', detail: 'Navigate directly to your responsible, accountable, or overdue NCRs' },
    ];

    points.forEach((p, i) => {
      const x = 0.3 + (i % 2) * 4.9;
      const y = 4.55 + Math.floor(i / 2) * 0.55;
      slide.addText(p.label, {
        x, y, w: 1.8, h: 0.45,
        fontSize: 11, fontFace: FONT, color: COLORS.accent, bold: true, valign: 'middle',
      });
      slide.addText(p.detail, {
        x: x + 1.8, y, w: 3.0, h: 0.45,
        fontSize: 10, fontFace: FONT, color: COLORS.text, valign: 'middle',
      });
    });
  }

  // Slide 12: Issue Tracking & Actions
  {
    const slide = pptx.addSlide();
    slide.background = { fill: COLORS.bg };

    slide.addText('Issue Tracking & Corrective Actions', {
      x: 0.5, y: 0.15, w: 6.5, h: 0.5,
      fontSize: 24, fontFace: FONT, color: COLORS.accent, bold: true,
    });
    slide.addText('Live System', {
      x: 7.0, y: 0.15, w: 2.8, h: 0.5,
      fontSize: 13, fontFace: FONT, color: COLORS.highlight, bold: true, align: 'right',
    });

    // Hero screenshot
    const issueData = imgData('issue-actions.png');
    if (issueData) {
      slide.addShape('rect' as any, {
        x: 0.25, y: 0.7, w: 9.5, h: 3.45,
        fill: { color: 'ffffff' }, rectRadius: 0.08,
        shadow: { type: 'outer', blur: 8, offset: 3, color: '000000', opacity: 0.3 },
      });
      slide.addImage({
        data: issueData,
        x: 0.35, y: 0.8, w: 9.3, h: 3.25,
      });
    }

    // Talking points below
    const points = [
      { label: 'Item / Area', detail: 'Every equipment item and area tracked with failure count and rate' },
      { label: 'Root Causes', detail: 'Linked directly to each finding — no guesswork, data-driven' },
      { label: 'Priority & Status', detail: 'Severity-based prioritisation with real-time status tracking' },
      { label: 'Consolidate', detail: 'One-click consolidation of recurring issues into corrective action plans' },
    ];

    points.forEach((p, i) => {
      const x = 0.3 + (i % 2) * 4.9;
      const y = 4.35 + Math.floor(i / 2) * 0.55;
      slide.addText(p.label, {
        x, y, w: 1.8, h: 0.45,
        fontSize: 11, fontFace: FONT, color: COLORS.accent, bold: true, valign: 'middle',
      });
      slide.addText(p.detail, {
        x: x + 1.8, y, w: 3.0, h: 0.45,
        fontSize: 10, fontFace: FONT, color: COLORS.text, valign: 'middle',
      });
    });

    slide.addText('Every issue. Every finding. Tracked and pushed through to resolution.', {
      x: 0.5, y: 5.3, w: 9, h: 0.25,
      fontSize: 11, fontFace: FONT, color: COLORS.highlight, italic: true, align: 'center',
    });
  }

  // Slide 13: Area Trends & Conformance Analytics
  {
    const slide = pptx.addSlide();
    slide.background = { fill: COLORS.bg };

    slide.addText('Trend Analysis & Conformance', {
      x: 0.5, y: 0.15, w: 6.5, h: 0.5,
      fontSize: 24, fontFace: FONT, color: COLORS.accent, bold: true,
    });
    slide.addText('Live System', {
      x: 7.0, y: 0.15, w: 2.8, h: 0.5,
      fontSize: 13, fontFace: FONT, color: COLORS.highlight, bold: true, align: 'right',
    });

    // Hero screenshot
    const trendData = imgData('trendanalysis.png');
    if (trendData) {
      slide.addShape('rect' as any, {
        x: 0.25, y: 0.7, w: 9.5, h: 3.45,
        fill: { color: 'ffffff' }, rectRadius: 0.08,
        shadow: { type: 'outer', blur: 8, offset: 3, color: '000000', opacity: 0.3 },
      });
      slide.addImage({
        data: trendData,
        x: 0.35, y: 0.8, w: 9.3, h: 3.25,
      });
    }

    // Talking points below
    const points = [
      { label: 'Conformance %', detail: 'Real-time conformance score per area — track improvement over time' },
      { label: 'Trend Direction', detail: 'Stable, improving, or declining — surface problems before they escalate' },
      { label: 'Pass vs Fail', detail: 'Visual breakdown of inspection results — spot patterns instantly' },
      { label: 'Export', detail: 'One-click PDF or CSV export for management reports and audit evidence' },
    ];

    points.forEach((p, i) => {
      const x = 0.3 + (i % 2) * 4.9;
      const y = 4.35 + Math.floor(i / 2) * 0.55;
      slide.addText(p.label, {
        x, y, w: 1.8, h: 0.45,
        fontSize: 11, fontFace: FONT, color: COLORS.accent, bold: true, valign: 'middle',
      });
      slide.addText(p.detail, {
        x: x + 1.8, y, w: 3.0, h: 0.45,
        fontSize: 10, fontFace: FONT, color: COLORS.text, valign: 'middle',
      });
    });

    slide.addText('Data-driven food safety — not opinions, not checklists, real performance metrics', {
      x: 0.5, y: 5.3, w: 9, h: 0.25,
      fontSize: 11, fontFace: FONT, color: COLORS.highlight, italic: true, align: 'center',
    });
  }

  // Slide 14: ISO 22000 Journey (Timeline) [was 12]
  addTimelineSlide(pptx, 'ISO 22000 Certification Journey', [
    { label: 'Phase 1: Foundation', detail: 'Leadership commitment, gap analysis, implementation plan', status: 'completed' },
    { label: 'Phase 2: System Development', detail: 'FSMS documentation, HACCP plans, PRPs, SOPs', status: 'completed' },
    { label: 'Phase 3: Implementation', detail: 'Staff training, system rollout, supplier verification', status: 'completed' },
    { label: 'Phase 4: Verification', detail: 'Internal audit, management review, pre-assessment', status: 'completed' },
    { label: 'Phase 5: Certification', detail: 'Stage 1 & 2 audits — booked within 2 months', status: 'current' },
  ], '12-certification.jpg');

  // Slide 13: Standards & Audit Experience (Table)
  addTableSlide(pptx, 'Standards & Audit Experience',
    ['Standard', 'Relevance'],
    [
      ['ISO 22000:2018', 'Food Safety Management Systems — certification imminent'],
      ['HACCP (Codex)', 'Foundation of our sanitation design'],
      ['ISO 22002-1', 'PRPs for food manufacturing'],
      ['SANS 10049', 'South African food safety standard'],
      ['R638 Regulations', 'SA General Hygiene Requirements for Food Premises'],
      ['NCCA Guidelines', 'National Contract Cleaners Association compliance'],
    ]);

  // Slide 14: Value Proposition (Comparison)
  addComparisonSlide(pptx, 'The EnviroWize Value Proposition', "Spicegro's Challenge", "EnviroWize's Solution", [
    { left: 'Dry processing complexity', right: 'Dry cleaning expertise & validated protocols' },
    { left: 'Allergen liability', right: 'Allergen management & verification programs' },
    { left: 'Audit pressure', right: 'Audit-ready documentation & systems' },
    { left: 'Staff turnover', right: 'Visual training programs (low-literacy friendly)' },
    { left: 'Flavour carry-over', right: 'Organoleptic-validated changeover protocols' },
    { left: 'Hidden harbourage points', right: 'Equipment dismantling SOPs & verification' },
  ]);

  // Slide 15: Engagement Model
  addContentSlide(pptx, 'Engagement Model', [
    'Phase 1: Discovery & Assessment — facility walkthrough, allergen mapping',
    'Phase 2: Program Design — custom master plan, chemical program, training curriculum',
    'Phase 3: Implementation — staff training, protocol rollout, verification testing',
    'Phase 4: Ongoing Partnership — monthly reviews, trend analysis, audit prep',
  ], '15-partnership-handshake.jpg');

  // Slide 16: Our Clients
  {
    const slide = pptx.addSlide();
    slide.background = { fill: COLORS.bg };

    slide.addText('Trusted by Industry Leaders', {
      x: 0.5, y: 0.3, w: 9, h: 0.7,
      fontSize: 28, fontFace: FONT, color: COLORS.accent, bold: true, align: 'center',
    });

    slide.addShape('rect' as any, {
      x: 4.1, y: 0.95, w: 1.8, h: 0.04,
      fill: { color: COLORS.accent },
    });

    const clients = [
      { name: 'Farmwise', sector: 'Fresh Produce — Pre-Cuts & Pre-Packs' },
      { name: 'In2food', sector: 'Food Manufacturing & Distribution' },
      { name: 'Tip Top Meats', sector: 'Meat Processing' },
      { name: 'Q Nests', sector: 'Food Manufacturing' },
      { name: 'Essmor Distributors', sector: 'Food Distribution' },
      { name: 'Polyoak Packaging — Danone', sector: 'Food-Grade Packaging' },
      { name: 'Polyoak Packaging — Clover', sector: 'Food-Grade Packaging' },
      { name: 'Polyoak Packaging — Main Plant', sector: 'Packaging Manufacturing' },
      { name: 'Zire Marketing', sector: 'Food Industry Services' },
    ];

    // Two-column client grid
    clients.forEach((client, i) => {
      const col = i < 5 ? 0 : 1;
      const row = i < 5 ? i : i - 5;
      const x = col === 0 ? 0.5 : 5.2;
      const y = 1.2 + row * 0.85;

      // Green dot
      slide.addText('●', {
        x, y: y + 0.05, w: 0.3, h: 0.35,
        fontSize: 12, fontFace: FONT, color: COLORS.accent,
      });
      slide.addText(client.name, {
        x: x + 0.35, y, w: 3.5, h: 0.4,
        fontSize: 16, fontFace: FONT, color: COLORS.text, bold: true,
      });
      slide.addText(client.sector, {
        x: x + 0.35, y: y + 0.35, w: 3.5, h: 0.35,
        fontSize: 11, fontFace: FONT, color: COLORS.secondary,
      });
    });

    slide.addText('Proven delivery across fresh produce, meat, packaging, and food manufacturing', {
      x: 0.5, y: 5.1, w: 9, h: 0.3,
      fontSize: 12, fontFace: FONT, color: COLORS.secondary, italic: true, align: 'center',
    });
  }

  // Slide 17: Our Approach — Plant Walkthrough, MCS, SOPs & Risk Assessment
  {
    const slide = pptx.addSlide();
    slide.background = { fill: COLORS.bg };

    slide.addText('Our Approach', {
      x: 0.5, y: 0.3, w: 9, h: 0.7,
      fontSize: 28, fontFace: FONT, color: COLORS.accent, bold: true,
    });
    slide.addShape('rect' as any, {
      x: 0.5, y: 0.95, w: 1.5, h: 0.04,
      fill: { color: COLORS.accent },
    });

    slide.addText('Plant Walkthrough → Risk Assessment → MCS → SOPs', {
      x: 0.7, y: 1.1, w: 8.6, h: 0.5,
      fontSize: 15, fontFace: FONT, color: COLORS.highlight, italic: true,
    });

    const bullets = [
      'Comprehensive plant walkthrough to map every area, equipment item, and risk point',
      'Detailed Risk Assessment — hazard identification, likelihood, severity, and control measures',
      'Generate Master Cleaning Schedule (MCS) — frequency, method, chemical, responsible person',
      'Develop Standard Operating Procedures (SOPs) aligned to food safety best practices',
      'Pictorial SOPs — step-by-step visual guides accessible to all literacy levels',
      'All documentation HACCP-aligned and audit-ready from day one',
    ];

    const bulletRows = bullets.map(b => ({
      text: b,
      options: {
        fontSize: 15, fontFace: FONT, color: COLORS.text,
        bullet: { code: '25CF', color: COLORS.accent },
        paraSpaceAfter: 10,
      },
    }));

    slide.addText(bulletRows, {
      x: 0.7, y: 1.7, w: 8.6, h: 3.0,
      valign: 'top',
    });

    // Placeholder boxes for attachments
    slide.addShape('rect' as any, {
      x: 0.5, y: 4.85, w: 4.2, h: 0.6,
      fill: { color: COLORS.secondary }, rectRadius: 0.05,
    });
    slide.addText('📋  Sample Pictorial SOP attached', {
      x: 0.7, y: 4.85, w: 3.8, h: 0.6,
      fontSize: 12, fontFace: FONT, color: COLORS.highlight, valign: 'middle',
    });

    slide.addShape('rect' as any, {
      x: 5.3, y: 4.85, w: 4.2, h: 0.6,
      fill: { color: COLORS.secondary }, rectRadius: 0.05,
    });
    slide.addText('📊  Sample MCS attached', {
      x: 5.5, y: 4.85, w: 3.8, h: 0.6,
      fontSize: 12, fontFace: FONT, color: COLORS.highlight, valign: 'middle',
    });
  }

  // Slide 18: Cleaning Procedure Preview — SCI & MCS Showcase
  {
    const slide = pptx.addSlide();
    slide.background = { fill: COLORS.bg };

    slide.addText('Pictorial Cleaning Procedures', {
      x: 0.5, y: 0.15, w: 7, h: 0.5,
      fontSize: 24, fontFace: FONT, color: COLORS.accent, bold: true,
    });
    slide.addText('SCI & MCS Preview', {
      x: 7.0, y: 0.15, w: 2.8, h: 0.5,
      fontSize: 13, fontFace: FONT, color: COLORS.highlight, bold: true, align: 'right',
    });

    // Left: SCI pictorial document
    const sciData = imgData('sci-preview-ribbon-mixer.png');
    if (sciData) {
      slide.addShape('rect' as any, {
        x: 0.2, y: 0.75, w: 4.75, h: 3.1,
        fill: { color: 'ffffff' }, rectRadius: 0.06,
        shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.25 },
      });
      slide.addImage({
        data: sciData,
        x: 0.3, y: 0.85, w: 4.55, h: 2.9,
      });
    }

    // Right: MCS document
    const mcsData = imgData('mcs-preview-dry-processing.png');
    if (mcsData) {
      slide.addShape('rect' as any, {
        x: 5.15, y: 0.75, w: 4.75, h: 3.1,
        fill: { color: 'ffffff' }, rectRadius: 0.06,
        shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.25 },
      });
      slide.addImage({
        data: mcsData,
        x: 5.25, y: 0.85, w: 4.55, h: 2.9,
      });
    }

    // Labels under each image
    slide.addText('Standard Cleaning Instruction (SCI)', {
      x: 0.2, y: 3.9, w: 4.75, h: 0.35,
      fontSize: 13, fontFace: FONT, color: COLORS.accent, bold: true, align: 'center',
    });
    slide.addText('Master Cleaning Schedule (MCS)', {
      x: 5.15, y: 3.9, w: 4.75, h: 0.35,
      fontSize: 13, fontFace: FONT, color: COLORS.accent, bold: true, align: 'center',
    });

    // Key points below
    const leftPoints = [
      'Step-by-step pictorial procedures with real photographs',
      'Annotated images — accessible to all literacy levels',
      'PPE, chemicals, dilution rates, and contact times specified',
      'Laminated and posted at point-of-use in the facility',
    ];
    const rightPoints = [
      'Every area, item, and frequency mapped and documented',
      'SCI references link directly to pictorial procedures',
      'Verification method and record specified per item',
      'Allergen changeover protocols clearly identified',
    ];

    leftPoints.forEach((p, i) => {
      slide.addText('●', {
        x: 0.3, y: 4.35 + i * 0.42, w: 0.25, h: 0.35,
        fontSize: 8, fontFace: FONT, color: COLORS.accent,
      });
      slide.addText(p, {
        x: 0.55, y: 4.35 + i * 0.42, w: 4.3, h: 0.35,
        fontSize: 10, fontFace: FONT, color: COLORS.text, valign: 'middle',
      });
    });

    rightPoints.forEach((p, i) => {
      slide.addText('●', {
        x: 5.25, y: 4.35 + i * 0.42, w: 0.25, h: 0.35,
        fontSize: 8, fontFace: FONT, color: COLORS.accent,
      });
      slide.addText(p, {
        x: 5.5, y: 4.35 + i * 0.42, w: 4.3, h: 0.35,
        fontSize: 10, fontFace: FONT, color: COLORS.text, valign: 'middle',
      });
    });

    slide.addText('Every cleaning procedure is documented, pictorial, and audit-ready — from day one', {
      x: 0.5, y: 6.05, w: 9, h: 0.25,
      fontSize: 11, fontFace: FONT, color: COLORS.highlight, italic: true, align: 'center',
    });
  }

  // Slide 19: Labour Supply & Regulatory Compliance
  {
    const slide = pptx.addSlide();
    slide.background = { fill: COLORS.bg };

    slide.addText('Labour Supply & Compliance', {
      x: 0.5, y: 0.3, w: 9, h: 0.7,
      fontSize: 28, fontFace: FONT, color: COLORS.accent, bold: true,
    });
    slide.addShape('rect' as any, {
      x: 0.5, y: 0.95, w: 1.5, h: 0.04,
      fill: { color: COLORS.accent },
    });

    const bullets = [
      'Fully compliant labour supply — NCCA, BCEA, Sectoral Determination, and bargaining council aligned',
      'All staff vetted, screened, and documented per regulatory requirements',
      'Comprehensive induction training before deployment — facility-specific, not generic',
      'Ongoing competency assessments with refresher schedules tracked and documented',
      'Staff trained in GMP, personal hygiene, chemical handling, allergen awareness, and HACCP principles',
      'Visual training aids and pictorial SOPs — accessible to all literacy levels',
      'Supervisor development — leadership, incident response, and team management',
      'Full training records maintained for audit readiness at all times',
    ];

    const bulletRows = bullets.map(b => ({
      text: b,
      options: {
        fontSize: 15, fontFace: FONT, color: COLORS.text,
        bullet: { code: '25CF', color: COLORS.accent },
        paraSpaceAfter: 8,
      },
    }));

    slide.addText(bulletRows, {
      x: 0.7, y: 1.2, w: 8.6, h: 4.2,
      valign: 'top',
    });
  }

  // Slide 19: Food-Grade Standards — Equipment, Chemicals & Schedules
  {
    const slide = pptx.addSlide();
    slide.background = { fill: COLORS.bg };

    slide.addText('Food-Grade Standards', {
      x: 0.5, y: 0.3, w: 9, h: 0.7,
      fontSize: 28, fontFace: FONT, color: COLORS.accent, bold: true,
    });
    slide.addShape('rect' as any, {
      x: 0.5, y: 0.95, w: 1.5, h: 0.04,
      fill: { color: COLORS.accent },
    });

    // Three-column layout
    const columns = [
      {
        header: 'Cleaning Equipment',
        items: [
          'Colour-coded to prevent cross-contamination',
          'Food-grade materials — no shedding, no contamination risk',
          'Dedicated equipment per zone / allergen area',
          'Replacement schedules and condition audits',
        ],
      },
      {
        header: 'Chemicals',
        items: [
          'Food-safe, approved for food contact surfaces',
          'Correct dilution ratios — validated and documented',
          'MSDS on file, chemical risk assessments complete',
          'Application methods matched to substrate and soil type',
        ],
      },
      {
        header: 'Cleaning Schedules',
        items: [
          'Master Cleaning Schedule (MCS) — comprehensive coverage',
          'Daily, weekly, monthly, and deep-clean frequencies',
          'Aligned to production cycles and changeover requirements',
          'Verified through inspection, swabbing, and sign-off',
        ],
      },
    ];

    columns.forEach((col, ci) => {
      const x = 0.5 + ci * 3.2;

      // Column header
      slide.addShape('rect' as any, {
        x, y: 1.15, w: 2.9, h: 0.45,
        fill: { color: COLORS.primary }, rectRadius: 0.04,
      });
      slide.addText(col.header, {
        x, y: 1.15, w: 2.9, h: 0.45,
        fontSize: 14, fontFace: FONT, color: COLORS.text, bold: true,
        align: 'center', valign: 'middle',
      });

      // Items
      const colBullets = col.items.map(b => ({
        text: b,
        options: {
          fontSize: 12, fontFace: FONT, color: COLORS.text,
          bullet: { code: '25CF', color: COLORS.accent },
          paraSpaceAfter: 8,
        },
      }));

      slide.addText(colBullets, {
        x: x + 0.1, y: 1.75, w: 2.7, h: 3.5,
        valign: 'top',
      });
    });

    slide.addText('All equipment, chemicals, and schedules meet or exceed ISO 22000, HACCP, and SANS 10049 requirements', {
      x: 0.5, y: 5.1, w: 9, h: 0.3,
      fontSize: 11, fontFace: FONT, color: COLORS.secondary, italic: true, align: 'center',
    });
  }

  // Slide 20: Closing
  addClosingSlide(pptx, "Let's Talk", '"Engineering Food Safety Outcomes"', 'EnviroWize Hygiene & Sanitation', '01-title-gradient.jpg');

  // Write file
  const outDir = path.resolve(__dirname, '../../output/spicegro');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'spicegro-introduction.pptx');
  await pptx.writeFile({ fileName: outPath });
  console.log(`\n✅ PowerPoint exported: ${outPath}`);
  console.log(`   22 slides, ${fs.readdirSync(IMG_DIR).length} images embedded`);
}

main().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
