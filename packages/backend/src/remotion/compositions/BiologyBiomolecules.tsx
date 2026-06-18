/**
 * Biology Biomolecules — Cambridge 9700 Topic 2
 *
 * Narration-synced Remotion composition. Visual elements appear
 * when mentioned in the audio, driven by Whisper word timestamps.
 *
 * Manifest: projects/biology-biomolecules/manifest.json
 */

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';

// ── Constants ───────────────────────────────────────────────────────
const FPS = 30;
const TRANSITION_FRAMES = 20;

// ── Biology Theme ───────────────────────────────────────────────────
const THEME = {
  colors: {
    background: '#0a0e1a',
    surface: '#131a2e',
    text: '#f0f4ff',
    primary: '#00d9ff',    // Cyan for biology
    accent: '#6610f2',     // Purple
    secondary: '#0dcaf0',  // Light cyan
    success: '#10b981',    // Green for plants/biology
    warning: '#f59e0b',    // Amber for energy
    danger: '#ef4444',     // Red for tests
    gold: '#fbbf24',       // Gold accents
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  }
};

// ── Types ───────────────────────────────────────────────────────────
interface ResolvedCue {
  id: string;
  keyword: string;
  timestamp: number;
  frame: number;
  action: { type: string; target: string };
}

interface SlideElement {
  id: string;
  type: string;
  content: string;
  style: string;
  cueId: string;
}

interface SlideData {
  slideNum: number;
  title: string;
  narration: {
    text: string;
    cueMarkers: string[];
  };
  visuals: {
    background?: string;
    elements: SlideElement[];
  };
  timing?: {
    duration: number;
    audioFile: string;
    cues: ResolvedCue[];
  };
}

export interface BiologyBiomoleculesProps {
  audioNarration: boolean;
  manifestData?: {
    slides: SlideData[];
    settings: {
      fps: number;
      resolution: { width: number; height: number };
      voiceId?: string;
    };
  };
}

// ── Hooks ───────────────────────────────────────────────────────────

/**
 * Core cue hook — fades in an element when the narrator speaks the keyword.
 * This is THE pattern for narration sync.
 */
function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;

  const opacity = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return { opacity, translateY, isActive: frame >= cueFrame };
}

/**
 * Spring-based cue for punchier reveals (cards, badges)
 */
function useCueSpring(cueTimeSeconds: number, config = { damping: 18, stiffness: 160 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;

  const progress = spring({
    frame: Math.max(0, frame - cueFrame),
    fps,
    config,
    durationInFrames: 20,
  });

  return {
    opacity: frame >= cueFrame ? progress : 0,
    scale: frame >= cueFrame ? interpolate(progress, [0, 1], [0.8, 1]) : 0.8,
    translateY: frame >= cueFrame ? interpolate(progress, [0, 1], [30, 0]) : 30,
    isActive: frame >= cueFrame,
  };
}

// ── Utility: find cue timestamp by keyword ──────────────────────────
function getCueTime(cues: ResolvedCue[], cueId: string): number {
  const cue = cues.find(c => c.id === cueId || c.keyword === cueId);
  return cue?.timestamp ?? 999; // Default far future if not found
}

// ── Reusable Components ─────────────────────────────────────────────

/** Ken Burns background with slow zoom */
const KenBurns: React.FC<{ src: string; direction?: 'in' | 'out' }> = ({
  src,
  direction = 'in',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = direction === 'in'
    ? interpolate(frame, [0, durationInFrames], [1, 1.12], { extrapolateRight: 'clamp' })
    : interpolate(frame, [0, durationInFrames], [1.12, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
      {/* Dark overlay for text readability */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(10,14,26,0.55) 0%, rgba(10,14,26,0.75) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Section title that fades in with cue */
const SectionTitle: React.FC<{ text: string; cueTime: number }> = ({ text, cueTime }) => {
  const { opacity, translateY } = useCue(cueTime, 0.6);
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 80,
        right: 80,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{
        fontSize: 52,
        fontWeight: 700,
        fontFamily: THEME.fonts.heading,
        color: THEME.colors.primary,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      }}>
        {text}
      </div>
      <div style={{
        width: 120,
        height: 4,
        background: `linear-gradient(90deg, ${THEME.colors.primary}, transparent)`,
        marginTop: 12,
        borderRadius: 2,
      }} />
    </div>
  );
};

/** Info card with spring reveal */
const InfoCard: React.FC<{
  content: string;
  cueTime: number;
  x: number;
  y: number;
  width?: number;
  color?: string;
}> = ({ content, cueTime, x, y, width = 420, color = THEME.colors.primary }) => {
  const { opacity, scale, translateY } = useCueSpring(cueTime);

  const lines = content.split('\n');
  const title = lines[0];
  const details = lines.slice(1);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div style={{
        background: `linear-gradient(135deg, ${THEME.colors.surface}ee, ${THEME.colors.surface}cc)`,
        borderRadius: 16,
        padding: '24px 28px',
        borderLeft: `4px solid ${color}`,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          fontSize: 26,
          fontWeight: 700,
          color: color,
          fontFamily: THEME.fonts.heading,
          marginBottom: details.length > 0 ? 10 : 0,
        }}>
          {title}
        </div>
        {details.map((line, i) => (
          <div key={i} style={{
            fontSize: 20,
            color: THEME.colors.text,
            fontFamily: THEME.fonts.body,
            opacity: 0.85,
            lineHeight: 1.5,
          }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Text label with cue fade-in */
const CuedLabel: React.FC<{
  text: string;
  cueTime: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
  bold?: boolean;
}> = ({ text, cueTime, x, y, size = 24, color = THEME.colors.text, bold = false }) => {
  const { opacity, translateY } = useCue(cueTime, 0.4);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: size,
        fontWeight: bold ? 700 : 500,
        color,
        fontFamily: THEME.fonts.body,
      }}
    >
      {text}
    </div>
  );
};

/** Pill badge row */
const PillRow: React.FC<{
  items: string[];
  cueTime: number;
  x: number;
  y: number;
  color?: string;
}> = ({ items, cueTime, x, y, color = THEME.colors.primary }) => {
  const { opacity, translateY } = useCue(cueTime, 0.5);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        gap: 14,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {items.map((item, i) => (
        <div key={i} style={{
          background: `${color}22`,
          border: `1px solid ${color}66`,
          borderRadius: 24,
          padding: '8px 20px',
          fontSize: 20,
          fontWeight: 600,
          color: color,
          fontFamily: THEME.fonts.body,
        }}>
          {item}
        </div>
      ))}
    </div>
  );
};

/** Reaction equation with arrow */
const ReactionLabel: React.FC<{
  text: string;
  cueTime: number;
  x: number;
  y: number;
}> = ({ text, cueTime, x, y }) => {
  const { opacity, translateY } = useCue(cueTime, 0.5);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: 24,
        fontWeight: 600,
        color: THEME.colors.warning,
        fontFamily: THEME.fonts.mono,
        background: `${THEME.colors.warning}15`,
        border: `1px solid ${THEME.colors.warning}44`,
        borderRadius: 12,
        padding: '10px 24px',
      }}
    >
      {text}
    </div>
  );
};

/** Stat highlight (big number or fact) */
const StatHighlight: React.FC<{
  text: string;
  cueTime: number;
  x: number;
  y: number;
}> = ({ text, cueTime, x, y }) => {
  const { opacity, scale } = useCueSpring(cueTime, { damping: 15, stiffness: 200 });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale})`,
        fontSize: 32,
        fontWeight: 800,
        color: THEME.colors.gold,
        fontFamily: THEME.fonts.heading,
        textShadow: `0 0 30px ${THEME.colors.gold}44`,
      }}
    >
      {text}
    </div>
  );
};

/** Hero text for summary emphasis */
const HeroText: React.FC<{
  text: string;
  cueTime: number;
  x: number;
  y: number;
}> = ({ text, cueTime, x, y }) => {
  const { opacity, scale } = useCueSpring(cueTime, { damping: 12, stiffness: 120 });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale})`,
        fontSize: 64,
        fontWeight: 900,
        fontFamily: THEME.fonts.heading,
        background: `linear-gradient(135deg, ${THEME.colors.primary}, ${THEME.colors.accent})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.03em',
      }}
    >
      {text}
    </div>
  );
};

// ── Individual Slide Components ─────────────────────────────────────

/** Slide 1: Introduction */
const Slide01Intro: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated title entrance
  const titleSpring = spring({ frame, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 30 });

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-01-intro.jpg')} />

      {/* Title with spring animation */}
      <div style={{
        position: 'absolute',
        top: 180,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleSpring,
        transform: `scale(${interpolate(titleSpring, [0, 1], [0.9, 1])})`,
      }}>
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          fontFamily: THEME.fonts.heading,
          color: THEME.colors.text,
          letterSpacing: '-0.03em',
          textShadow: `0 4px 20px rgba(0,0,0,0.5)`,
        }}>
          Biological Molecules
        </div>
        <div style={{
          fontSize: 32,
          fontWeight: 500,
          color: THEME.colors.primary,
          marginTop: 12,
          fontFamily: THEME.fonts.body,
        }}>
          Cambridge 9700 — Topic 2
        </div>
      </div>

      {/* Carbon badge */}
      <CuedLabel text="C — The Element of Life" cueTime={ct('Carbon')} x={760} y={380} size={28} color={THEME.colors.gold} bold />

      {/* Monomer → Polymer */}
      <ReactionLabel text="Monomers → Polymers" cueTime={ct('monomers')} x={700} y={470} />

      {/* Condensation & Hydrolysis */}
      <CuedLabel text="Condensation & Hydrolysis" cueTime={ct('hydrolysis')} x={700} y={540} size={24} color={THEME.colors.secondary} />

      {/* Four molecule group pills */}
      <PillRow
        items={['Carbohydrates', 'Lipids', 'Proteins', 'Water']}
        cueTime={ct('carbohydrates')}
        x={420}
        y={660}
        color={THEME.colors.primary}
      />
    </AbsoluteFill>
  );
};

/** Slide 2: Biochemical Tests */
const Slide02Tests: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-02-tests.jpg')} direction="out" />
      <SectionTitle text="2.1 Testing for Biological Molecules" cueTime={ct('detect')} />

      {/* Benedict's Test */}
      <InfoCard
        content={"Benedict's Test\nBlue → Green → Yellow → Orange → Brick-red\nReducing sugars (heat required)"}
        cueTime={ct("Benedict's")}
        x={80} y={180} width={460}
        color="#ef4444"
      />
      <CuedLabel text="Brick-red precipitate = positive" cueTime={ct('brick-red')} x={100} y={365} size={20} color="#f87171" />

      {/* Iodine Test */}
      <InfoCard
        content={"Iodine Test for Starch\nBrown/orange → Blue-black\nSpecific for polysaccharides"}
        cueTime={ct('starch')}
        x={80} y={420} width={460}
        color="#3b82f6"
      />
      <CuedLabel text="Blue-black = starch present" cueTime={ct('blue-black')} x={100} y={600} size={20} color="#60a5fa" />

      {/* Emulsion Test */}
      <InfoCard
        content={"Emulsion Test for Lipids\nEthanol + Water → Milky-white\nFats and oils"}
        cueTime={ct('lipids')}
        x={600} y={180} width={460}
        color="#f59e0b"
      />
      <CuedLabel text="Milky-white emulsion = positive" cueTime={ct('emulsion')} x={620} y={365} size={20} color="#fbbf24" />

      {/* Biuret Test */}
      <InfoCard
        content={"Biuret Test for Proteins\nNaOH + CuSO₄ → Purple/lilac\nDetects peptide bonds"}
        cueTime={ct('biuret')}
        x={600} y={420} width={460}
        color="#8b5cf6"
      />
      <CuedLabel text="Purple = peptide bonds present" cueTime={ct('purple')} x={620} y={600} size={20} color="#a78bfa" />
    </AbsoluteFill>
  );
};

/** Slide 3: Carbohydrates */
const Slide03Carbs: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-03-carbohydrates.jpg')} />
      <SectionTitle text="2.2 Carbohydrates" cueTime={ct('monosaccharides')} />

      <CuedLabel text="Glucose — C₆H₁₂O₆" cueTime={ct('Glucose')} x={80} y={180} size={32} color={THEME.colors.gold} bold />

      <InfoCard
        content={"α-glucose\n—OH points DOWN on C₁\nForms starch & glycogen"}
        cueTime={ct('Alpha')}
        x={80} y={250} width={400}
        color={THEME.colors.success}
      />

      <InfoCard
        content={"β-glucose\n—OH points UP on C₁\nForms cellulose"}
        cueTime={ct('beta')}
        x={520} y={250} width={400}
        color={THEME.colors.secondary}
      />

      <ReactionLabel text="Condensation → Glycosidic Bond + H₂O" cueTime={ct('condensation')} x={260} y={430} />

      <PillRow items={['Maltose', 'Sucrose', 'Lactose']} cueTime={ct('disaccharide')} x={520} y={510} color={THEME.colors.warning} />

      {/* Polysaccharide cards */}
      <InfoCard
        content={"Starch (plants)\nAmylose — coiled, unbranched\nAmylopectin — branched"}
        cueTime={ct('Starch')}
        x={80} y={580} width={350}
        color={THEME.colors.success}
      />

      <InfoCard
        content={"Glycogen (animals)\nHighly branched α-glucose\nRapid hydrolysis"}
        cueTime={ct('Glycogen')}
        x={470} y={580} width={350}
        color={THEME.colors.warning}
      />

      <InfoCard
        content={"Cellulose (cell walls)\nβ-glucose microfibrils\nHigh tensile strength"}
        cueTime={ct('cellulose')}
        x={860} y={580} width={350}
        color={THEME.colors.secondary}
      />
    </AbsoluteFill>
  );
};

/** Slide 4: Lipids */
const Slide04Lipids: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-04-lipids.jpg')} direction="out" />
      <SectionTitle text="2.2 Lipids" cueTime={ct('lipids')} />

      <ReactionLabel text="Glycerol + 3 Fatty Acids → Triglyceride" cueTime={ct('triglyceride')} x={80} y={180} />
      <CuedLabel text="Ester Bond (condensation)" cueTime={ct('ester')} x={80} y={250} size={22} color={THEME.colors.warning} />

      <InfoCard
        content={"Saturated\nNo C=C double bonds\nStraight chains → Solid at room temp"}
        cueTime={ct('saturated')}
        x={80} y={310} width={420}
        color="#f59e0b"
      />

      <InfoCard
        content={"Unsaturated\nC=C double bonds → Kinks\nLiquid at room temperature"}
        cueTime={ct('unsaturated')}
        x={560} y={310} width={420}
        color="#10b981"
      />

      <StatHighlight text="2× energy per gram vs carbohydrates" cueTime={ct('energy')} x={80} y={510} />

      <CuedLabel text="Phospholipid Structure" cueTime={ct('Phospholipids')} x={80} y={600} size={30} color={THEME.colors.primary} bold />

      <InfoCard
        content={"Amphipathic\nHydrophilic head ← → Hydrophobic tails\nBasis of cell membrane"}
        cueTime={ct('amphipathic')}
        x={80} y={660} width={460}
        color={THEME.colors.primary}
      />

      <CuedLabel text="Phospholipid Bilayer → Cell Membrane" cueTime={ct('bilayer')} x={600} y={700} size={24} color={THEME.colors.secondary} bold />
    </AbsoluteFill>
  );
};

/** Slide 5: Amino Acids */
const Slide05AminoAcids: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-05-amino-acids.jpg')} />
      <SectionTitle text="2.3 Amino Acids & Peptide Bonds" cueTime={ct('amino')} />

      <CuedLabel text="Central Carbon (Cα)" cueTime={ct('carbon')} x={80} y={190} size={28} color={THEME.colors.gold} bold />

      <CuedLabel text="R-group — Variable Side Chain" cueTime={ct('R-group')} x={80} y={250} size={26} color={THEME.colors.accent} bold />

      <PillRow items={['Polar', 'Non-polar', 'Charged', 'Sulfur-containing']} cueTime={ct('properties')} x={80} y={320} color={THEME.colors.secondary} />

      <ReactionLabel text="—NH₂ + HOOC— → —CO—NH— + H₂O" cueTime={ct('condensation')} x={80} y={420} />

      <CuedLabel text="Peptide Bond (covalent)" cueTime={ct('peptide')} x={80} y={500} size={26} color={THEME.colors.primary} bold />

      <CuedLabel text="Polypeptide Chain" cueTime={ct('polypeptide')} x={560} y={420} size={28} color={THEME.colors.text} bold />

      <InfoCard
        content={"DNA → mRNA → Amino Acid Sequence\nThe genetic code determines the primary structure"}
        cueTime={ct('DNA')}
        x={560} y={500} width={460}
        color={THEME.colors.accent}
      />

      <InfoCard
        content={"Primary Structure\nThe sequence of amino acids\nHeld by peptide bonds only"}
        cueTime={ct('primary')}
        x={80} y={600} width={420}
        color={THEME.colors.primary}
      />
    </AbsoluteFill>
  );
};

/** Slide 6: Protein Structure Levels */
const Slide06ProteinStructure: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-06-protein-structure.jpg')} direction="out" />
      <SectionTitle text="Protein Structure — Four Levels" cueTime={ct('primary')} />

      <CuedLabel text="Secondary Structure" cueTime={ct('secondary')} x={80} y={190} size={28} color={THEME.colors.secondary} bold />

      <InfoCard
        content={"α-Helix\nRight-handed coil\nH-bonds along backbone"}
        cueTime={ct('helix')}
        x={80} y={250} width={380}
        color={THEME.colors.primary}
      />

      <InfoCard
        content={"β-Pleated Sheet\nFlat zigzag arrangement\nH-bonds between chains"}
        cueTime={ct('pleated')}
        x={500} y={250} width={380}
        color={THEME.colors.secondary}
      />

      <CuedLabel text="Tertiary Structure — 3D Shape" cueTime={ct('tertiary')} x={80} y={440} size={28} color={THEME.colors.accent} bold />

      {/* Bond type pills staggered */}
      <PillRow items={['Hydrogen bonds']} cueTime={ct('hydrogen')} x={80} y={510} color={THEME.colors.primary} />
      <PillRow items={['Ionic bonds']} cueTime={ct('ionic')} x={320} y={510} color={THEME.colors.warning} />
      <PillRow items={['Hydrophobic interactions']} cueTime={ct('interactions')} x={500} y={510} color={THEME.colors.success} />
      <PillRow items={['Disulfide bridges (covalent)']} cueTime={ct('disulfide')} x={800} y={510} color={THEME.colors.danger} />

      <InfoCard
        content={"Quaternary Structure\nMultiple polypeptide subunits\ne.g. Haemoglobin (4 subunits)"}
        cueTime={ct('quaternary')}
        x={80} y={600} width={460}
        color={THEME.colors.gold}
      />
    </AbsoluteFill>
  );
};

/** Slide 7: Globular vs Fibrous */
const Slide07GlobularFibrous: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-07-globular-fibrous.jpg')} />
      <SectionTitle text="Globular vs Fibrous Proteins" cueTime={ct('Globular')} />

      {/* Left: Globular */}
      <InfoCard
        content={"Globular Proteins\nCompact, spherical\nWater-soluble"}
        cueTime={ct('soluble')}
        x={80} y={180} width={420}
        color={THEME.colors.primary}
      />

      <PillRow items={['Enzymes', 'Transport', 'Hormones', 'Antibodies']} cueTime={ct('enzymes')} x={80} y={350} color={THEME.colors.primary} />

      <InfoCard
        content={"Haemoglobin\n4 polypeptide subunits\n2α + 2β chains"}
        cueTime={ct('Haemoglobin')}
        x={80} y={430} width={420}
        color="#ef4444"
      />

      <CuedLabel text="Haem group — Fe²⁺ — binds O₂" cueTime={ct('haem')} x={100} y={600} size={22} color="#f87171" />

      {/* Right: Fibrous */}
      <InfoCard
        content={"Fibrous Proteins\nLong, narrow\nWater-insoluble"}
        cueTime={ct('fibrous')}
        x={560} y={180} width={420}
        color={THEME.colors.gold}
      />

      <CuedLabel text="Hydrophobic R-groups face outward" cueTime={ct('insoluble')} x={580} y={350} size={20} color={THEME.colors.gold} />

      <InfoCard
        content={"Collagen\nTriple helix\nMost abundant protein in body"}
        cueTime={ct('Collagen')}
        x={560} y={430} width={420}
        color={THEME.colors.gold}
      />

      <CuedLabel text="Staggered cross-links → Tensile strength" cueTime={ct('cross-links')} x={580} y={600} size={22} color={THEME.colors.warning} />
    </AbsoluteFill>
  );
};

/** Slide 8: Water */
const Slide08Water: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-08-water.jpg')} direction="out" />
      <SectionTitle text="2.4 Water" cueTime={ct('polar')} />

      <CuedLabel text="δ⁻ O — H δ⁺" cueTime={ct('positive')} x={80} y={200} size={36} color={THEME.colors.primary} bold />

      <CuedLabel text="Hydrogen Bonds — Weak but Collective" cueTime={ct('hydrogen')} x={80} y={270} size={26} color={THEME.colors.secondary} bold />

      {/* Three property cards */}
      <InfoCard
        content={"1. Solvent\nDissolves ions & polar molecules\nMedium for biochemical reactions"}
        cueTime={ct('solvent')}
        x={80} y={350} width={380}
        color={THEME.colors.primary}
      />

      <CuedLabel text="Blood plasma • Xylem sap • Cytoplasm" cueTime={ct('transport')} x={100} y={530} size={18} color={THEME.colors.primary} />

      <InfoCard
        content={"2. High Specific Heat Capacity\nLots of energy to raise temperature\nStabilises body temperature"}
        cueTime={ct('specific')}
        x={500} y={350} width={420}
        color={THEME.colors.success}
      />

      <CuedLabel text="Protects enzymes from heat damage" cueTime={ct('body')} x={520} y={530} size={18} color={THEME.colors.success} />

      <InfoCard
        content={"3. High Latent Heat of Vaporisation\nEvaporation removes lots of heat\nEffective cooling mechanism"}
        cueTime={ct('vaporisation')}
        x={80} y={600} width={420}
        color={THEME.colors.warning}
      />

      <CuedLabel text="Sweating & transpiration = cooling" cueTime={ct('sweating')} x={560} y={660} size={22} color={THEME.colors.warning} />
    </AbsoluteFill>
  );
};

/** Slide 9: Summary */
const Slide09Summary: React.FC<{ cues: ResolvedCue[] }> = ({ cues }) => {
  const ct = (id: string) => getCueTime(cues, id);

  return (
    <AbsoluteFill>
      <KenBurns src={staticFile('images/biology/slide-09-summary.jpg')} />
      <SectionTitle text="Summary — Key Takeaways" cueTime={ct('Carbon')} />

      {/* Four summary cards in a grid */}
      <InfoCard
        content={"Carbohydrates\nMonosaccharides → Polysaccharides\nStarch • Glycogen • Cellulose"}
        cueTime={ct('Carbohydrates')}
        x={80} y={180} width={420}
        color={THEME.colors.success}
      />

      <InfoCard
        content={"Lipids\nTriglycerides (energy storage)\nPhospholipids (membranes)"}
        cueTime={ct('Lipids')}
        x={560} y={180} width={420}
        color={THEME.colors.warning}
      />

      <InfoCard
        content={"Proteins\n1° → 2° → 3° → 4°\nEnzymes • Transport • Structure"}
        cueTime={ct('Proteins')}
        x={80} y={400} width={420}
        color={THEME.colors.accent}
      />

      <InfoCard
        content={"Water\nSolvent • Heat capacity • Cooling\nMedium for all biochemistry"}
        cueTime={ct('water')}
        x={560} y={400} width={420}
        color={THEME.colors.primary}
      />

      {/* Tests row */}
      <PillRow items={["Benedict's", 'Iodine', 'Emulsion', 'Biuret']} cueTime={ct('tests')} x={340} y={620} color={THEME.colors.secondary} />

      {/* Hero text */}
      <HeroText text="Structure → Function" cueTime={ct('structure')} x={560} y={740} />
    </AbsoluteFill>
  );
};

// ── Slide Map ───────────────────────────────────────────────────────
const SLIDE_COMPONENTS: Record<number, React.FC<{ cues: ResolvedCue[] }>> = {
  1: Slide01Intro,
  2: Slide02Tests,
  3: Slide03Carbs,
  4: Slide04Lipids,
  5: Slide05AminoAcids,
  6: Slide06ProteinStructure,
  7: Slide07GlobularFibrous,
  8: Slide08Water,
  9: Slide09Summary,
};

// ── Main Composition ────────────────────────────────────────────────

export const BiologyBiomolecules: React.FC<BiologyBiomoleculesProps> = ({
  audioNarration,
  manifestData,
}) => {
  const slides = manifestData?.slides ?? [];

  // Calculate slide durations in frames
  const slideDurations = useMemo(() => {
    return slides.map(s => Math.ceil((s.timing?.duration ?? 30) * FPS));
  }, [slides]);

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background }}>
      <TransitionSeries>
        {slides.map((slide, index) => {
          const SlideComponent = SLIDE_COMPONENTS[slide.slideNum];
          if (!SlideComponent) return null;

          const durationInFrames = slideDurations[index] + TRANSITION_FRAMES;
          const cues = slide.timing?.cues ?? [];

          return (
            <React.Fragment key={slide.slideNum}>
              <TransitionSeries.Sequence
                durationInFrames={durationInFrames}
              >
                <SlideComponent cues={cues} />

                {/* Audio for this slide */}
                {audioNarration && slide.timing?.audioFile && (
                  <Audio
                    src={staticFile(`audio/biology/${slide.timing.audioFile.replace('audio/', '')}`)}
                    volume={1}
                  />
                )}
              </TransitionSeries.Sequence>

              {/* Fade transition between slides */}
              {index < slides.length - 1 && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ── Duration Calculator ─────────────────────────────────────────────
export function getBiologyBiomoleculesDuration(
  fps: number,
  slides?: SlideData[]
): number {
  if (!slides || slides.length === 0) {
    // Default: 9 slides × 40s each
    return 9 * 40 * fps;
  }

  const totalSeconds = slides.reduce((sum, s) => sum + (s.timing?.duration ?? 30), 0);
  const transitionSeconds = (slides.length - 1) * (TRANSITION_FRAMES / fps);

  return Math.ceil((totalSeconds - transitionSeconds) * fps);
}
