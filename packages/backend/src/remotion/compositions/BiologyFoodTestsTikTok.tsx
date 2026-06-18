/**
 * Biology Food Tests — TikTok (9:16) v3
 *
 * 3-act visual flow per test: Food → Reagent → Colour Change.
 * Lab-backdrop hook, food specimen cards early in every scene,
 * MorphOrb colour transitions as the payoff.
 *
 * 8 scenes, ~66 seconds, 1080×1920.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';

// ── Constants ────────────────────────────────────────────────────────
const FPS = 30;
const TOTAL_DURATION_S = 66;

// ── Theme ────────────────────────────────────────────────────────────
const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00d9ff',
  accent: '#c084fc',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  gold: '#fbbf24',
  benedicts: '#dc2626',
  iodine: '#1e3a8a',
  biuret: '#7c3aed',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Image paths ──────────────────────────────────────────────────────
const IMG = {
  hookBg: staticFile('images/biology/food-tests/hook-lab-bg.jpg'),
  thumbnail: staticFile('images/biology/food-tests/thumbnail.jpg'),
  // Benedict's
  benedictsSample: staticFile('images/biology/food-tests/benedicts-sample.jpg'),
  benedictsReagent: staticFile('images/biology/food-tests/benedicts-reagent.jpg'),
  benedictsHeating: staticFile('images/biology/food-tests/benedicts-heating.jpg'),
  benedictsResult: staticFile('images/biology/food-tests/benedicts-result.jpg'),
  // Iodine
  iodineFood: staticFile('images/biology/food-tests/iodine-food.jpg'),
  iodineReagent: staticFile('images/biology/food-tests/iodine-reagent.jpg'),
  iodineResult: staticFile('images/biology/food-tests/iodine-result.jpg'),
  // Emulsion
  emulsionFood: staticFile('images/biology/food-tests/emulsion-food.jpg'),
  emulsionEthanol: staticFile('images/biology/food-tests/emulsion-ethanol.jpg'),
  emulsionResult: staticFile('images/biology/food-tests/emulsion-result.jpg'),
  // Biuret
  biuretFood: staticFile('images/biology/food-tests/biuret-food.jpg'),
  biuretReagents: staticFile('images/biology/food-tests/biuret-reagents.jpg'),
  biuretResult: staticFile('images/biology/food-tests/biuret-result.jpg'),
};

// ── Cue Map — Whisper-resolved timestamps (2026-02-15) ──────────────
const DEFAULT_CUES: Record<string, number> = {
  'four': 0.0,
  'benedicts': 5.98,
  'reducing': 6.92,
  'sample-1': 8.94,
  'heat': 13.46,
  'blue-green': 16.86,
  'yellow': 18.44,
  'orange': 19.54,
  'brick-red': 20.70,
  'formula-benedict': 22.14,
  'iodine': 25.78,
  'drop': 27.44,
  'brown': 32.46,
  'blue-black': 35.26,
  'starch-result': 35.88,
  'emulsion': 38.26,
  'ethanol': 41.24,
  'water': 42.64,
  'milky': 45.70,
  'milky-result': 45.84,
  'biuret': 48.58,
  'naoh': 50.54,
  'cuso4': 52.30,
  'blue-stays': 53.94,
  'purple': 56.18,
  'protein-result': 57.28,
  'summary': 58.80,
  'save': 61.04,
};

// ── Types ────────────────────────────────────────────────────────────
export interface BiologyFoodTestsTikTokProps {
  audioEnabled?: boolean;
  cueOverrides?: Record<string, number>;
}

// ── Hooks ────────────────────────────────────────────────────────────

function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { opacity, translateY, isActive: frame >= cueFrame };
}

function useCueSpring(cueTimeSeconds: number, config = { damping: 16, stiffness: 180 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const progress = spring({ frame: Math.max(0, frame - cueFrame), fps, config, durationInFrames: 20 });
  return {
    opacity: frame >= cueFrame ? progress : 0,
    scale: frame >= cueFrame ? interpolate(progress, [0, 1], [0.85, 1]) : 0.85,
    translateY: frame >= cueFrame ? interpolate(progress, [0, 1], [30, 0]) : 30,
    isActive: frame >= cueFrame,
  };
}

/** Fade-in at startS, fade-out at endS. Good for images that should disappear. */
function useCueWindow(startS: number, endS: number, fadeIn = 0.4, fadeOut = 0.3) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = startS * fps;
  const ef = endS * fps;
  const inO = interpolate(frame, [sf, sf + fadeIn * fps], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outO = interpolate(frame, [ef - fadeOut * fps, ef], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { opacity: inO * outO, isActive: frame >= sf && frame <= ef };
}

// ── Reusable Components ─────────────────────────────────────────────

/** Consistent dark gradient background for every scene */
const SceneBg: React.FC<{ accentColor?: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.01) * 5;
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% ${40 + drift}%, ${accentColor ? `${accentColor}12` : '#0d122a'} 0%, ${T.bg} 70%)`,
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${T.text}22 1px, transparent 1px), linear-gradient(90deg, ${T.text}22 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
    </AbsoluteFill>
  );
};

/** Ken Burns — slow zoom on an image. Used for hook background. */
const KenBurns: React.FC<{ src: string; zoomStart?: number; zoomEnd?: number }> = ({
  src, zoomStart = 1.05, zoomEnd = 1.15,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [zoomStart, zoomEnd]);
  return (
    <AbsoluteFill>
      <Img src={src} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${scale})`, transformOrigin: 'center center',
      }} />
      {/* Dark gradient overlay for text contrast */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.8) 100%)',
      }} />
    </AbsoluteFill>
  );
};

/** Side card — positioned left or right for side-by-side layout */
const SideCard: React.FC<{
  src: string;
  startS: number;
  endS: number;
  label?: string;
  accentColor?: string;
  side: 'left' | 'right';
  y?: number;
}> = ({ src, startS, endS, label, accentColor = T.text, side, y = 360 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = startS * fps;
  const ef = endS * fps;

  const entryP = spring({ frame: Math.max(0, frame - sf), fps,
    config: { damping: 16, stiffness: 150 }, durationInFrames: 20 });
  const outO = interpolate(frame, [ef - 0.3 * fps, ef], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visible = frame >= sf && frame <= ef;

  const floatY = Math.sin(frame * 0.04) * 3;
  const imgScale = interpolate(frame, [sf, ef], [1.0, 1.06],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const slideX = side === 'left'
    ? interpolate(entryP, [0, 1], [-25, 0])
    : interpolate(entryP, [0, 1], [25, 0]);

  if (!visible) return null;

  const cardW = 480;
  const cardH = 300;

  return (
    <div style={{
      position: 'absolute', top: y + floatY,
      ...(side === 'left' ? { left: 35 } : { right: 35 }),
      width: cardW,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity: entryP * outO,
      transform: `scale(${interpolate(entryP, [0, 1], [0.88, 1])}) translateX(${slideX}px)`,
    }}>
      <div style={{
        width: cardW, height: cardH, borderRadius: 16, overflow: 'hidden',
        border: `2px solid ${accentColor}33`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${accentColor}15`,
      }}>
        <Img src={src} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${imgScale})`, transformOrigin: 'center center',
        }} />
      </div>
      {label && (
        <div style={{
          marginTop: 10, fontSize: 18, fontWeight: 700,
          color: accentColor, fontFamily: T.font,
          opacity: 0.85, letterSpacing: '0.04em',
          textShadow: `0 0 12px ${accentColor}33`,
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

/** Morphing color orb — changes color over time */
const MorphOrb: React.FC<{
  colorStops: { time: number; color: string }[];
  size?: number;
  y?: number;
}> = ({ colorStops, size = 260, y = 480 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const times = colorStops.map(s => s.time * fps);
  const colors = colorStops.map(s => s.color);
  const currentColor = times.length >= 2
    ? interpolateColors(frame, times, colors)
    : colors[0];

  const visible = frame >= times[0];
  const entryProgress = interpolate(frame, [times[0], times[0] + 15], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(frame * 0.08) * 0.04;

  return (
    <div style={{
      position: 'absolute', top: y, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      opacity: visible ? entryProgress : 0,
    }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${currentColor}ee, ${currentColor}88 50%, ${currentColor}33 85%, transparent)`,
        boxShadow: `0 0 ${size * 0.7}px ${currentColor}44, 0 0 ${size * 0.3}px ${currentColor}22`,
        transform: `scale(${entryProgress * pulse})`,
      }} />
    </div>
  );
};

/** Step badge */
const StepBadge: React.FC<{ step: number; total: number; color: string; cueTime: number }> = ({
  step, total, color, cueTime,
}) => {
  const { opacity, scale } = useCueSpring(cueTime);
  return (
    <div style={{
      position: 'absolute', top: 80, left: 60,
      opacity, transform: `scale(${scale})`,
      background: `${color}22`, border: `2px solid ${color}88`,
      borderRadius: 30, padding: '10px 28px',
      fontSize: 28, fontWeight: 700, color, fontFamily: T.font,
    }}>
      {step}/{total}
    </div>
  );
};

/** Test title */
const TestTitle: React.FC<{ text: string; subtitle: string; color: string; cueTime: number }> = ({
  text, subtitle, color, cueTime,
}) => {
  const { opacity, translateY } = useCue(cueTime, 0.6);
  return (
    <div style={{
      position: 'absolute', top: 160, left: 60, right: 60,
      opacity, transform: `translateY(${translateY}px)`,
    }}>
      <div style={{
        fontSize: 56, fontWeight: 900, color, fontFamily: T.font,
        letterSpacing: '-0.02em', textShadow: `0 0 40px ${color}55`,
      }}>
        {text}
      </div>
      <div style={{
        fontSize: 28, fontWeight: 500, color: T.textMuted,
        fontFamily: T.font, marginTop: 8,
      }}>
        {subtitle}
      </div>
      <div style={{
        width: 80, height: 4, marginTop: 14, borderRadius: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
    </div>
  );
};

/** Animated color gradient bar */
const ColorGradientBar: React.FC<{
  colors: string[]; cueTime: number; y: number; label?: string;
}> = ({ colors, cueTime, y, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTime * fps;
  const progress = interpolate(frame, [cueFrame, cueFrame + 45], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'absolute', top: y, left: 80, right: 80, opacity: progress > 0 ? 1 : 0 }}>
      {label && (
        <div style={{
          fontSize: 20, color: T.textMuted, fontFamily: T.font,
          marginBottom: 10, opacity: progress, textAlign: 'center',
        }}>
          {label}
        </div>
      )}
      <div style={{
        height: 44, borderRadius: 22,
        background: `linear-gradient(90deg, ${colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(', ')})`,
        width: `${progress * 100}%`, margin: '0 auto',
        boxShadow: `0 0 24px ${colors[colors.length - 1]}33`,
      }} />
    </div>
  );
};

/** Result badge with spring bounce */
const ResultBadge: React.FC<{
  text: string; color: string; cueTime: number; y: number;
}> = ({ text, color, cueTime, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTime * fps;
  const progress = spring({ frame: Math.max(0, frame - cueFrame), fps,
    config: { damping: 12, stiffness: 200 }, durationInFrames: 25 });
  const scale = frame >= cueFrame ? interpolate(progress, [0, 1], [0, 1.08]) : 0;
  const finalScale = frame >= cueFrame + 25 ? 1 : scale;

  return (
    <div style={{
      position: 'absolute', top: y, left: 60, right: 60,
      display: 'flex', justifyContent: 'center',
      opacity: frame >= cueFrame ? progress : 0,
      transform: `scale(${finalScale})`,
    }}>
      <div style={{
        background: `${color}18`, border: `3px solid ${color}`,
        borderRadius: 20, padding: '16px 40px',
        fontSize: 30, fontWeight: 800, color, fontFamily: T.font,
        textAlign: 'center', boxShadow: `0 0 30px ${color}22`,
      }}>
        {text}
      </div>
    </div>
  );
};

/** Chemical formula with typewriter */
const ChemFormula: React.FC<{ text: string; cueTime: number; y: number; color?: string }> = ({
  text, cueTime, y, color = T.primary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTime * fps;
  const elapsed = Math.max(0, frame - cueFrame);
  const charsToShow = Math.min(text.length, Math.floor(elapsed / 2));
  const opacity = interpolate(frame, [cueFrame, cueFrame + 10], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center',
      opacity, fontSize: 28, fontWeight: 700, color,
      fontFamily: T.mono, textShadow: `0 0 20px ${color}33`,
    }}>
      {text.slice(0, charsToShow)}
      {charsToShow < text.length && (
        <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>▊</span>
      )}
    </div>
  );
};

/** Small inline specimen card for result proof */
const ResultCard: React.FC<{
  src: string; cueTime: number; y: number;
  label?: string; width?: number; height?: number;
}> = ({ src, cueTime, y, label, width = 420, height = 260 }) => {
  const { opacity, scale, translateY: ty } = useCueSpring(cueTime);
  return (
    <div style={{
      position: 'absolute', top: y, left: 0, right: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity, transform: `scale(${scale}) translateY(${ty}px)`,
    }}>
      <div style={{
        width, height, borderRadius: 16, overflow: 'hidden',
        border: `2px solid ${T.text}20`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      }}>
        <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {label && (
        <div style={{
          marginTop: 10, fontSize: 18, fontWeight: 600,
          color: T.textMuted, fontFamily: T.font,
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

/** Progress bar */
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 4, background: `${T.text}10`, zIndex: 100,
    }}>
      <div style={{
        height: '100%', width: `${progress}%`,
        background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`,
        borderRadius: '0 2px 2px 0',
      }} />
    </div>
  );
};

// ── Scene Components ─────────────────────────────────────────────────

/** Scene 1: Hook — Lab background + bold text. First frame = thumbnail. */
const HookScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 15 });

  const orbColors = ['#dc2626', '#1e3a8a', '#e2e8f0', '#7c3aed'];

  return (
    <AbsoluteFill>
      {/* Lab background with Ken Burns */}
      <KenBurns src={IMG.hookBg} zoomStart={1.0} zoomEnd={1.1} />

      {/* Four color dots */}
      <div style={{
        position: 'absolute', top: 520, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 36,
        opacity: entrance,
      }}>
        {orbColors.map((color, i) => {
          const delay = i * 3;
          const s = spring({ frame: Math.max(0, frame - delay), fps,
            config: { damping: 12, stiffness: 200 }, durationInFrames: 15 });
          return (
            <div key={i} style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}66 70%, transparent)`,
              boxShadow: `0 0 40px ${color}44`,
              transform: `scale(${s})`,
            }} />
          );
        })}
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 680, left: 60, right: 60,
        textAlign: 'center', opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [1.1, 1])})`,
      }}>
        <div style={{
          fontSize: 72, fontWeight: 900, color: T.text, fontFamily: T.font,
          letterSpacing: '-0.03em', lineHeight: 1.15,
          textShadow: '0 4px 30px rgba(0,0,0,0.8)',
        }}>
          4 tests.<br />4 colours.
        </div>
        <div style={{
          fontSize: 36, fontWeight: 700, color: T.gold, fontFamily: T.font,
          marginTop: 20, textShadow: `0 2px 20px rgba(0,0,0,0.6)`,
        }}>
          Pass your exam.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Scene 2: Intro */
const IntroScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 20 });

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.primary} />
      <div style={{
        position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center',
        opacity: entrance, transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
      }}>
        <div style={{
          display: 'inline-block', background: `${T.primary}15`,
          border: `2px solid ${T.primary}55`, borderRadius: 16,
          padding: '14px 36px', fontSize: 24, fontWeight: 600,
          color: T.primary, fontFamily: T.font, marginBottom: 24,
        }}>
          Cambridge IGCSE 9700
        </div>
        <div style={{
          fontSize: 64, fontWeight: 900, color: T.text, fontFamily: T.font,
          letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>
          Biochemical<br /><span style={{ color: T.primary }}>Food Tests</span>
        </div>
        <div style={{
          fontSize: 26, color: T.textMuted, fontFamily: T.font, marginTop: 16,
        }}>
          Section 2.1 — Testing for Biological Molecules
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Scene 3: Benedict's Test (19.3s)
 *
 * Act 1 (0-3.4s):   Food sample image — "what are we testing?"
 * Act 2 (3.4-7.9s): Reagent + heating images
 * Act 3 (7.9-19s):  MorphOrb colour change → result
 */
const BenedictsScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const morphStops = [
    { time: ct('sample-1'), color: '#3b82f6' },
    { time: ct('blue-green'), color: '#22c55e' },
    { time: ct('yellow'), color: '#eab308' },
    { time: ct('orange'), color: '#f97316' },
    { time: ct('brick-red'), color: '#dc2626' },
  ];

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.benedicts} />
      <StepBadge step={1} total={4} color={T.benedicts} cueTime={ct('benedicts')} />
      <TestTitle text="Benedict's Test" subtitle="Reducing Sugars" color={T.benedicts} cueTime={ct('benedicts')} />

      {/* ACT 1+2: Food sample (left) + Reagent/Heating (right) — side by side */}
      <SideCard side="left"
        src={IMG.benedictsSample}
        startS={ct('benedicts')} endS={ct('blue-green')}
        label="FOOD SAMPLE" accentColor={T.benedicts}
      />
      <SideCard side="right"
        src={IMG.benedictsReagent}
        startS={ct('sample-1')} endS={ct('heat')}
        label="BENEDICT'S REAGENT" accentColor="#3b82f6"
      />
      <SideCard side="right"
        src={IMG.benedictsHeating}
        startS={ct('heat')} endS={ct('blue-green') + 0.5}
        label="HEAT · WATER BATH" accentColor={T.warning}
      />

      {/* ACT 3: MorphOrb colour change — the payoff */}
      <MorphOrb colorStops={morphStops} size={240} y={420} />

      {/* Colour gradient bar */}
      <ColorGradientBar
        colors={['#3b82f6', '#22c55e', '#eab308', '#f97316', '#dc2626']}
        cueTime={ct('blue-green')} y={720}
        label="Blue → Green → Yellow → Orange → Brick-red"
      />

      {/* Result photo */}
      <ResultCard
        src={IMG.benedictsResult}
        cueTime={ct('brick-red')} y={840}
        label="Benedict's colour gradient"
      />

      {/* Result badge */}
      <ResultBadge
        text="Brick-red = High Sugar" color={T.benedicts}
        cueTime={ct('brick-red')} y={1160}
      />

      {/* Formula */}
      <ChemFormula
        text="C₆H₁₂O₆ + Cu²⁺ → Cu₂O ↓"
        cueTime={ct('formula-benedict')} y={1260} color={T.warning}
      />

      {/* Edge glow that morphs with the orb */}
      {frame >= ct('blue-green') * fps && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 5, height: '100%',
          background: interpolateColors(frame,
            morphStops.map(s => s.time * fps),
            morphStops.map(s => s.color)),
          boxShadow: `0 0 30px ${interpolateColors(frame,
            morphStops.map(s => s.time * fps),
            morphStops.map(s => s.color))}`,
          opacity: 0.7,
        }} />
      )}
    </AbsoluteFill>
  );
};

/**
 * Scene 4: Iodine Test (13s)
 *
 * Act 1 (0-2.6s):   Starchy food image
 * Act 2 (2.6-7.6s): Iodine reagent being dropped
 * Act 3 (7.6-13s):  MorphOrb brown→blue-black + result
 */
const IodineScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const morphStops = [
    { time: ct('drop'), color: '#92400e' },
    { time: ct('blue-black'), color: '#1e293b' },
  ];

  return (
    <AbsoluteFill>
      <SceneBg accentColor="#1e3a8a" />
      <StepBadge step={2} total={4} color="#60a5fa" cueTime={ct('iodine')} />
      <TestTitle text="Iodine Test" subtitle="Starch Detection" color="#60a5fa" cueTime={ct('iodine')} />

      {/* ACT 1+2: Starchy food (left) + Iodine reagent (right) — side by side */}
      <SideCard side="left"
        src={IMG.iodineFood}
        startS={ct('iodine')} endS={ct('brown') - 0.3}
        label="STARCHY FOODS" accentColor="#60a5fa"
      />
      <SideCard side="right"
        src={IMG.iodineReagent}
        startS={ct('drop')} endS={ct('brown')}
        label="IODINE SOLUTION" accentColor="#92400e"
      />

      {/* ACT 3: MorphOrb brown→blue-black */}
      <MorphOrb colorStops={morphStops} size={240} y={420} />

      <ColorGradientBar
        colors={['#92400e', '#4a2810', '#1e293b', '#0f172a']}
        cueTime={ct('brown')} y={720}
        label="Brown → Blue-black"
      />

      <ResultCard
        src={IMG.iodineResult}
        cueTime={ct('blue-black')} y={840}
        label="Positive starch reaction"
      />

      <ResultBadge
        text="Blue-black = Starch Present" color="#60a5fa"
        cueTime={ct('starch-result')} y={1160}
      />

      <ChemFormula
        text="I₂/KI + Starch → Blue-black complex"
        cueTime={ct('starch-result')} y={1260} color="#60a5fa"
      />
    </AbsoluteFill>
  );
};

/**
 * Scene 5: Emulsion Test (10.5s)
 *
 * Act 1 (0-4.2s):   Fatty food image
 * Act 2 (4.2-5.6s): Ethanol being added
 * Act 3 (5.6-10s):  Milky-white cloud + result
 */
const EmulsionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const milkyProgress = interpolate(
    frame, [ct('milky') * fps, ct('milky') * fps + 30], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.warning} />
      <StepBadge step={3} total={4} color={T.warning} cueTime={ct('emulsion')} />
      <TestTitle text="Emulsion Test" subtitle="Lipid Detection" color={T.warning} cueTime={ct('emulsion')} />

      {/* ACT 1+2: Fatty food (left) + Ethanol procedure (right) */}
      <SideCard side="left"
        src={IMG.emulsionFood}
        startS={ct('emulsion')} endS={ct('milky') - 0.3}
        label="FATTY FOODS" accentColor={T.warning}
      />
      <SideCard side="right"
        src={IMG.emulsionEthanol}
        startS={ct('ethanol')} endS={ct('milky')}
        label="DISSOLVE IN ETHANOL" accentColor="#a78bfa"
      />

      {/* ACT 3: Milky-white orb */}
      <div style={{
        position: 'absolute', top: 440, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: milkyProgress,
      }}>
        <div style={{
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.95), rgba(230,230,240,0.7) 50%, rgba(200,200,220,0.3) 80%, transparent)',
          boxShadow: '0 0 80px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.15)',
          transform: `scale(${milkyProgress})`,
        }} />
      </div>

      {/* Step label */}
      <div style={{
        position: 'absolute', top: 720, left: 80, right: 80, textAlign: 'center',
        ...useCue(ct('ethanol'), 0.4),
      }}>
        <div style={{ fontSize: 24, color: T.text, fontFamily: T.font, fontWeight: 600 }}>
          Dissolve in ethanol → Pour into water
        </div>
      </div>

      <ResultCard
        src={IMG.emulsionResult}
        cueTime={ct('milky')} y={830}
        label="Milky-white vs clear control"
      />

      <ResultBadge
        text="Milky-white = Lipids Present" color="#94a3b8"
        cueTime={ct('milky-result')} y={1150}
      />

      {/* Subtle milky screen tint */}
      <AbsoluteFill style={{ background: 'white', opacity: milkyProgress * 0.04 }} />
    </AbsoluteFill>
  );
};

/**
 * Scene 6: Biuret Test (11.8s)
 *
 * Act 1 (0-3.5s):   Protein food image
 * Act 2 (3.5-6.9s): NaOH + CuSO₄ reagents
 * Act 3 (6.9-11s):  MorphOrb blue→purple + result
 */
const BiuretScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const morphStops = [
    { time: ct('naoh'), color: '#3b82f6' },
    { time: ct('purple'), color: '#7c3aed' },
  ];

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.biuret} />
      <StepBadge step={4} total={4} color={T.biuret} cueTime={ct('biuret')} />
      <TestTitle text="Biuret Test" subtitle="Protein Detection" color={T.biuret} cueTime={ct('biuret')} />

      {/* ACT 1+2: Protein food (left) + Reagents (right) */}
      <SideCard side="left"
        src={IMG.biuretFood}
        startS={ct('biuret')} endS={ct('blue-stays') - 0.3}
        label="PROTEIN-RICH FOODS" accentColor={T.biuret}
      />
      <SideCard side="right"
        src={IMG.biuretReagents}
        startS={ct('naoh')} endS={ct('blue-stays')}
        label="1. NaOH   2. CuSO₄" accentColor="#3b82f6"
      />

      {/* ACT 3: MorphOrb blue→purple */}
      <MorphOrb colorStops={morphStops} size={240} y={440} />

      <ChemFormula text="1. NaOH  2. CuSO₄" cueTime={ct('naoh')} y={730} color={T.text} />

      <ColorGradientBar
        colors={['#3b82f6', '#6366f1', '#7c3aed']}
        cueTime={ct('blue-stays')} y={800}
        label="Blue → Purple"
      />

      <ResultCard
        src={IMG.biuretResult}
        cueTime={ct('purple')} y={910}
        label="Purple vs blue negative"
      />

      <ResultBadge
        text="Purple = Peptide Bonds" color={T.biuret}
        cueTime={ct('protein-result')} y={1230}
      />

      {/* Edge glow */}
      {frame >= ct('naoh') * fps && (
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 5, height: '100%',
          background: interpolateColors(frame,
            morphStops.map(s => s.time * fps),
            morphStops.map(s => s.color)),
          boxShadow: `0 0 20px ${interpolateColors(frame,
            morphStops.map(s => s.time * fps),
            morphStops.map(s => s.color))}`,
          opacity: 0.6,
        }} />
      )}
    </AbsoluteFill>
  );
};

/** Scene 7: Summary */
const SummaryScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, durationInFrames: 25 });

  const tests = [
    { name: "Benedict's", result: 'Brick-red', color: '#dc2626' },
    { name: 'Iodine', result: 'Blue-black', color: '#1e3a8a' },
    { name: 'Emulsion', result: 'Milky-white', color: '#94a3b8' },
    { name: 'Biuret', result: 'Purple', color: '#7c3aed' },
  ];

  return (
    <AbsoluteFill>
      <SceneBg />
      <div style={{
        position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center',
        opacity: entrance, transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
      }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: T.text, fontFamily: T.font }}>
          Four Tests. Four Results.
        </div>
      </div>

      {tests.map((test, i) => {
        const delay = i * 3;
        const s = spring({ frame: Math.max(0, frame - delay), fps,
          config: { damping: 16, stiffness: 160 }, durationInFrames: 18 });
        return (
          <div key={test.name} style={{
            position: 'absolute', top: 400 + i * 310, left: 80, right: 80,
            display: 'flex', alignItems: 'center', gap: 30,
            opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`,
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
              background: `radial-gradient(circle at 35% 35%, ${test.color}ee, ${test.color}55 70%, transparent)`,
              boxShadow: `0 0 30px ${test.color}33`,
            }} />
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: test.color, fontFamily: T.font }}>
                {test.name}
              </div>
              <div style={{ fontSize: 28, color: T.text, fontFamily: T.font, marginTop: 4, fontWeight: 600 }}>
                → {test.result}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Scene 8: CTA */
const CTAScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 100 }, durationInFrames: 25 });
  const pulse = Math.sin(frame * 0.1) * 0.03 + 1;

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.gold} />
      <div style={{
        position: 'absolute', top: 650, left: 60, right: 60, textAlign: 'center',
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.85, 1]) * pulse})`,
      }}>
        <div style={{
          fontSize: 60, fontWeight: 900, color: T.gold, fontFamily: T.font,
          letterSpacing: '-0.02em', textShadow: `0 0 40px ${T.gold}33`,
          lineHeight: 1.3,
        }}>
          Save this —<br />you WILL need it<br />for your exam.
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 350, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 24, opacity: entrance,
      }}>
        {['Save', 'Share', 'Follow'].map((label) => (
          <div key={label} style={{
            background: `${T.primary}18`, border: `2px solid ${T.primary}55`,
            borderRadius: 30, padding: '14px 32px',
            fontSize: 26, fontWeight: 700, color: T.primary, fontFamily: T.font,
          }}>
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene Timing ─────────────────────────────────────────────────────

interface SceneTiming {
  id: string;
  startS: number;
  durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

const SCENES: SceneTiming[] = [
  { id: 'hook', startS: 0, durationS: 4.6, Component: HookScene },
  { id: 'intro', startS: 4.6, durationS: 1.4, Component: IntroScene },
  { id: 'benedicts', startS: 6.0, durationS: 18.8, Component: BenedictsScene },
  { id: 'iodine', startS: 24.8, durationS: 13, Component: IodineScene },
  { id: 'emulsion', startS: 37, durationS: 10.5, Component: EmulsionScene },
  { id: 'biuret', startS: 47, durationS: 11.8, Component: BiuretScene },
  { id: 'summary', startS: 58, durationS: 3, Component: SummaryScene },
  { id: 'cta', startS: 61, durationS: 5, Component: CTAScene },
];

// ── Main Composition ─────────────────────────────────────────────────

export const BiologyFoodTestsTikTok: React.FC<BiologyFoodTestsTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string): number => cues[id] ?? 999;

  return (
    <AbsoluteFill style={{ backgroundColor: T.bg }}>
      <ProgressBar />

      {SCENES.map((scene) => {
        const { Component } = scene;
        // ct must return scene-relative times because Sequence
        // resets useCurrentFrame() to 0 at the sequence start.
        const sceneCt = (id: string): number => ct(id) - scene.startS;
        return (
          <Sequence
            key={scene.id}
            from={Math.round(scene.startS * FPS)}
            durationInFrames={Math.round(scene.durationS * FPS)}
          >
            <Component ct={sceneCt} />
          </Sequence>
        );
      })}

      {audioEnabled && (
        <Audio src={staticFile('audio/biology/food-tests-narration.mp3')} volume={1} />
      )}
    </AbsoluteFill>
  );
};

// ── Duration Calculator ──────────────────────────────────────────────
export function getBiologyFoodTestsDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

// ── Cover / Thumbnail Composition (1 frame still) ───────────────────

export const BiologyFoodTestsCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#050510' }}>
      {/* 4 test tubes as background */}
      <AbsoluteFill>
        <Img src={IMG.thumbnail} style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
        {/* Dark overlay for text contrast */}
        <AbsoluteFill style={{
          background: 'linear-gradient(to bottom, rgba(5,5,16,0.35) 0%, rgba(5,5,16,0.2) 30%, rgba(5,5,16,0.2) 60%, rgba(5,5,16,0.75) 100%)',
        }} />
      </AbsoluteFill>

      {/* Top badge */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(0,217,255,0.12)', border: '2px solid rgba(0,217,255,0.5)',
          borderRadius: 30, padding: '12px 36px',
          fontSize: 28, fontWeight: 700, color: '#00d9ff',
          fontFamily: T.font, letterSpacing: '0.06em',
        }}>
          CAMBRIDGE IGCSE 9700
        </div>
      </div>

      {/* Main title — BIG and bold */}
      <div style={{
        position: 'absolute', top: 200, left: 50, right: 50,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 96, fontWeight: 900, color: '#ffffff',
          fontFamily: T.font, letterSpacing: '-0.03em',
          lineHeight: 1.05,
          textShadow: '0 6px 40px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)',
        }}>
          4 Food<br />Tests
        </div>
      </div>

      {/* Colour labels overlaying each quadrant */}
      <div style={{
        position: 'absolute', top: 520, left: 0, width: '50%',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(220,38,38,0.2)', border: '2px solid rgba(220,38,38,0.7)',
          borderRadius: 16, padding: '8px 22px',
          fontSize: 24, fontWeight: 800, color: '#fca5a5',
          fontFamily: T.font,
        }}>
          Benedict's
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 520, right: 0, width: '50%',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(30,58,138,0.3)', border: '2px solid rgba(96,165,250,0.7)',
          borderRadius: 16, padding: '8px 22px',
          fontSize: 24, fontWeight: 800, color: '#93c5fd',
          fontFamily: T.font,
        }}>
          Iodine
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 1100, left: 0, width: '50%',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(245,158,11,0.2)', border: '2px solid rgba(245,158,11,0.7)',
          borderRadius: 16, padding: '8px 22px',
          fontSize: 24, fontWeight: 800, color: '#fcd34d',
          fontFamily: T.font,
        }}>
          Emulsion
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 1100, right: 0, width: '50%',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(124,58,237,0.2)', border: '2px solid rgba(124,58,237,0.7)',
          borderRadius: 16, padding: '8px 22px',
          fontSize: 24, fontWeight: 800, color: '#c4b5fd',
          fontFamily: T.font,
        }}>
          Biuret
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: 'absolute', bottom: 220, left: 60, right: 60,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 44, fontWeight: 900, color: '#fbbf24',
          fontFamily: T.font, letterSpacing: '-0.01em',
          textShadow: '0 4px 20px rgba(0,0,0,0.7)',
        }}>
          Know the colours.<br />Pass the exam.
        </div>
      </div>

      {/* Bottom colour strip — visual anchor */}
      <div style={{
        position: 'absolute', bottom: 120, left: 100, right: 100,
        height: 8, borderRadius: 4,
        background: 'linear-gradient(90deg, #dc2626 0%, #1e3a8a 33%, #e2e8f0 66%, #7c3aed 100%)',
        boxShadow: '0 0 20px rgba(124,58,237,0.3)',
      }} />
    </AbsoluteFill>
  );
};
