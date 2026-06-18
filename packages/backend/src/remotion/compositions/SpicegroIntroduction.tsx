/**
 * Spicegro Introduction Slide Deck
 *
 * 16-slide corporate presentation introducing EnviroWize food safety
 * consulting services to Spicegro spice manufacturer.
 *
 * Uses TransitionSeries with fade transitions between slides
 * (per @remotion/transitions best practices).
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { envirowizeCorporateTheme as theme } from '../components/webslides/themes';
import {
  CorporateTitleSlide,
  CorporateContentSlide,
  CorporateImageSlide,
  CorporateTableSlide,
  CorporateTimelineSlide,
  CorporateComparisonSlide,
  CorporateClosingSlide,
} from '../components/corporate/CorporateSlides';

const FPS = 30;
const TRANSITION_FRAMES = 12; // 0.4s fade between slides

// Slide durations in seconds (each slide's visible time including its share of transitions)
const SLIDE_DURATIONS = [6, 10, 10, 10, 10, 12, 10, 8, 10, 10, 12, 12, 10, 12, 10, 6];

export function getSpicegroIntroDuration(fps: number): number {
  const totalSlideFrames = SLIDE_DURATIONS.reduce((sum, d) => sum + d * fps, 0);
  const transitionOverlap = (SLIDE_DURATIONS.length - 1) * TRANSITION_FRAMES;
  return totalSlideFrames - transitionOverlap;
}

// Image paths (relative to remotion public/)
const IMG = {
  title: 'images/spicegro/01-title-gradient.jpg',
  warehouse: 'images/spicegro/02-spice-warehouse.jpg',
  dryProcessing: 'images/spicegro/03-dry-processing.jpg',
  equipment: 'images/spicegro/05-equipment-parts.jpg',
  valveDisassembly: 'images/spicegro/05b-valve-disassembly-foreground.jpg',
  spicePowders: 'images/spicegro/07-spice-powders.jpg',
  foodSafetyTeam: 'images/spicegro/10-food-safety-team.jpg',
  dashboard: 'images/spicegro/11-saas-dashboard.jpg',
  certification: 'images/spicegro/12-certification.jpg',
  handshake: 'images/spicegro/15-partnership-handshake.jpg',
};

const fadeTransition = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />;

export const SpicegroIntroduction: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <TransitionSeries>
        {/* Slide 1: Title */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[0] * FPS}>
          <CorporateTitleSlide
            title="EnviroWize for Spicegro"
            subtitle="Food Safety Consulting & Sanitation Services"
            imagePath={IMG.title}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 2: Understanding Spicegro */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[1] * FPS}>
          <CorporateContentSlide
            title="Understanding Spicegro"
            bullets={[
              'Leading SA supplier of spices, herbs, and food ingredients since 2011',
              'Source, manufacture, blend, and supply — bulk, batch packs, and retail sizes',
              'Certified Kosher, Halaal, and Food Safety Certified',
              'Based at Malibongwe Industrial Park, Mogale City (Gauteng)',
              'Four pillars: Quality, Support, Consistency, Reliability',
            ]}
            imagePath={IMG.warehouse}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 3: The Dry Processing Paradox */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[2] * FPS}>
          <CorporateContentSlide
            title="The Dry Processing Paradox"
            bullets={[
              'Traditional wet cleaning actually increases risk in dry spice environments',
              'Moisture activates dormant Salmonella — can survive for months in low-moisture',
              'Creates caking, product quality issues, and compromises products',
              'Requires specialised dry-cleaning protocols and validated chemical applications',
              'Knowing when and where wet cleaning is permissible is critical',
            ]}
            imagePath={IMG.dryProcessing}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 4: Allergen Cross-Contamination */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[3] * FPS}>
          <CorporateContentSlide
            title="Allergen Cross-Contamination"
            bullets={[
              'Single biggest liability for any spice manufacturer',
              'Shared equipment processes major allergens: mustard, celery, sesame',
              'Allergen proteins bond to stainless steel — changeover must be validated',
              'Dry cleaning alone may not remove allergens; wet cleaning adds moisture risk',
              'One event triggers product recall, brand damage, and legal liability',
            ]}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 5: Equipment Dismantling — foreground image */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[4] * FPS}>
          <CorporateImageSlide
            title="Equipment Dismantling"
            caption="Valve disassembly under a mixing tank — getting into every nook and cranny"
            imagePath={IMG.valveDisassembly}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 6: Hidden Harbourage Points (Table) */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[5] * FPS}>
          <CorporateTableSlide
            title="Hidden Harbourage Points"
            headers={['Equipment', 'Hidden Zones', 'Risk']}
            rows={[
              ['Grinders / mills', 'Internal surfaces, discharge chutes, bearing seals', 'Spice residue cakes into micro-crevices'],
              ['Ribbon / paddle mixers', 'Paddle-shaft junctions, end seals, discharge valves', 'Product builds up; allergen carry-over'],
              ['Lump breakers', 'Screen mesh, blade mounting points', '"All types of nooks and crannies"'],
              ['Conveyors', 'Guide rails underneath belts, hollow framework', 'Residue in areas never visible during production'],
              ['Packaging machines', 'Forming collars, sealing jaws, dosing augers', 'Direct product contact with complex geometry'],
              ['Sieves / sifters', 'Mesh screens, frame gaskets, discharge points', 'Fine powder embeds in mesh'],
            ]}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 7: Flavour Contamination */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[6] * FPS}>
          <CorporateContentSlide
            title="Flavour Contamination"
            bullets={[
              'Flavour carry-over between runs is the daily operational headache',
              'Volatile oils bond to equipment — nanogram detection thresholds',
              'Grinding at 42–95 °C drives oils deeper into surfaces',
              'Failed organoleptic QC = wasted product and credibility loss',
              '"Clean-looking" equipment may still carry flavour contamination',
            ]}
            imagePath={IMG.spicePowders}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 8: The Dual Mandate (Comparison) */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[7] * FPS}>
          <CorporateComparisonSlide
            title="The Dual Mandate"
            leftHeader="Food Safety"
            rightHeader="Product Quality"
            rows={[
              { left: 'Allergen removal', right: 'Flavour purity' },
              { left: 'Pathogen elimination', right: 'Colour integrity' },
              { left: 'Regulatory compliance', right: 'Customer specification' },
              { left: 'Recall prevention', right: 'Brand consistency' },
            ]}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 9: What Spicegro Needs */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[8] * FPS}>
          <CorporateContentSlide
            title="What Spicegro Needs"
            bullets={[
              'Dry cleaning expertise — most companies default to wet cleaning',
              'Allergen management & validated cleaning protocols',
              'Environmental monitoring with proactive detection',
              'Equipment dismantling SOPs and flavour carry-over prevention',
              'HACCP-aligned sanitation, staff training, and audit readiness',
            ]}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 10: Who is EnviroWize */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[9] * FPS}>
          <CorporateContentSlide
            title="Who is EnviroWize"
            bullets={[
              '25+ years in food safety — led by food technologists, not business managers',
              'Proactive food safety, not reactive cleaning',
              'Facility-specific, validated protocols — not one-size-fits-all',
              'Environmental monitoring programs with trend analysis and corrective action',
              'Proven results in Listeria intervention, FMCG sanitation, and chemical optimisation',
            ]}
            imagePath={IMG.foodSafetyTeam}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 11: Our Digital Platform */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[10] * FPS}>
          <CorporateContentSlide
            title="Our Digital Platform"
            bullets={[
              'Digital cleaning sign-off — real-time compliance visibility',
              'NCR system: 7-status workflow, photo annotations, RACI matrix',
              'Pictorial audits with geo-tagged photographic evidence',
              'Digital internal audits aligned to ISO 22000 / FSSC requirements',
              'Integrated training platform — track competency and refresher schedules',
            ]}
            imagePath={IMG.dashboard}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 12: ISO 22000 Journey (Timeline) */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[11] * FPS}>
          <CorporateTimelineSlide
            title="ISO 22000 Certification Journey"
            phases={[
              { label: 'Phase 1: Foundation', detail: 'Leadership commitment, gap analysis, implementation plan', status: 'completed' },
              { label: 'Phase 2: System Development', detail: 'FSMS documentation, HACCP plans, PRPs, SOPs', status: 'completed' },
              { label: 'Phase 3: Implementation', detail: 'Staff training, system rollout, supplier verification', status: 'completed' },
              { label: 'Phase 4: Verification', detail: 'Internal audit, management review, pre-assessment', status: 'completed' },
              { label: 'Phase 5: Certification', detail: 'Stage 1 & 2 audits — booked within 2 months', status: 'current' },
            ]}
            imagePath={IMG.certification}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 13: Standards & Audit Experience (Table) */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[12] * FPS}>
          <CorporateTableSlide
            title="Standards & Audit Experience"
            headers={['Standard', 'Relevance']}
            rows={[
              ['ISO 22000:2018', 'Food Safety Management Systems — certification imminent'],
              ['HACCP (Codex)', 'Foundation of our sanitation design'],
              ['ISO 22002-1', 'PRPs for food manufacturing'],
              ['SANS 10049', 'South African food safety standard'],
              ['R638 Regulations', 'SA General Hygiene Requirements for Food Premises'],
              ['NCCA Guidelines', 'National Contract Cleaners Association compliance'],
            ]}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 14: Value Proposition (Comparison) */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[13] * FPS}>
          <CorporateComparisonSlide
            title="The EnviroWize Value Proposition"
            leftHeader="Spicegro's Challenge"
            rightHeader="EnviroWize's Solution"
            rows={[
              { left: 'Dry processing complexity', right: 'Dry cleaning expertise & validated protocols' },
              { left: 'Allergen liability', right: 'Allergen management & verification programs' },
              { left: 'Audit pressure', right: 'Audit-ready documentation & systems' },
              { left: 'Staff turnover', right: 'Visual training programs (low-literacy friendly)' },
              { left: 'Flavour carry-over', right: 'Organoleptic-validated changeover protocols' },
              { left: 'Hidden harbourage points', right: 'Equipment dismantling SOPs & verification' },
            ]}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 15: Engagement Model */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[14] * FPS}>
          <CorporateContentSlide
            title="Engagement Model"
            bullets={[
              'Phase 1: Discovery & Assessment — facility walkthrough, allergen mapping',
              'Phase 2: Program Design — custom master plan, chemical program, training curriculum',
              'Phase 3: Implementation — staff training, protocol rollout, verification testing',
              'Phase 4: Ongoing Partnership — monthly reviews, trend analysis, audit prep',
            ]}
            imagePath={IMG.handshake}
            theme={theme}
          />
        </TransitionSeries.Sequence>
        {fadeTransition}

        {/* Slide 16: Closing */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[15] * FPS}>
          <CorporateClosingSlide
            headline="Let's Talk"
            tagline='"Engineering Food Safety Outcomes"'
            companyName="EnviroWize Food Safety Consulting"
            imagePath={IMG.title}
            theme={theme}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
