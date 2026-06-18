/**
 * Stoichiometry #3 — The Mole Triangle — TikTok (9:16) v1
 *
 * Cambridge IGCSE 0620 — n = m/M, triangle method, two worked examples.
 *
 * Pure CSS motion graphics.
 * 9 scenes, ~73 seconds, 1080x1920.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';

// ── Constants ────────────────────────────────────────────────────────
const FPS = 30;
const TOTAL_DURATION_S = 72.77;

// ── Theme ────────────────────────────────────────────────────────────
const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00ffff',
  secondary: '#ff00ff',
  accent: '#c084fc',
  success: '#22c55e',
  danger: '#ef4444',
  gold: '#fbbf24',
  warning: '#f59e0b',
  mole: '#00ffff',
  mass: '#ff6b6b',
  molarMass: '#a78bfa',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved + manually corrected ──────────────────
const DEFAULT_CUES: Record<string, number> = {
  'one': 2.20,
  'triangle': 13.56,
  'mass-over': 15.90,
  'question': 39.58,
  'twentyfour': 46.42,
  'answer': 54.02,
  'eleven': 56.72,
  'pointtwofive': 64.52,
  'any': 67.50,
};

// ── Types ────────────────────────────────────────────────────────────
export interface StoichiometryTriangleTikTokProps {
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

function useCueSpring(cueTimeSeconds: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const progress = spring({ frame: frame - cueFrame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = frame >= cueFrame ? progress : 0;
  const scale = frame >= cueFrame ? interpolate(progress, [0, 1], [0.85, 1]) : 0;
  return { opacity, scale, isActive: frame >= cueFrame };
}

// ── Shared Components ────────────────────────────────────────────────

const GlowText: React.FC<{
  children: React.ReactNode; color?: string; fontSize?: number; style?: React.CSSProperties;
}> = ({ children, color = T.primary, fontSize = 48, style }) => (
  <div style={{
    fontFamily: T.font, fontWeight: 800, fontSize, color,
    textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30`, textAlign: 'center', ...style,
  }}>{children}</div>
);

const Badge: React.FC<{
  label: string; color: string; opacity: number; scale?: number; fontSize?: number;
}> = ({ label, color, opacity, scale = 1, fontSize = 24 }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    fontFamily: T.font, fontWeight: 800, fontSize, color,
    padding: '10px 28px', border: `2px solid ${color}60`, borderRadius: 30,
    background: `${color}15`, textShadow: `0 0 20px ${color}40`,
  }}>{label}</div>
);

// ── The Mole Triangle (SVG) ──────────────────────────────────────────
const MoleTriangle: React.FC<{
  size?: number;
  drawProgress?: number;   // 0-1: stroke-dasharray draw-on
  highlightVar?: 'n' | 'm' | 'M' | null;
  dimmedVar?: 'n' | 'm' | 'M' | null;
  glowIntensity?: number;  // 0-1 pulsing glow
  showLabels?: boolean;
  showDivLine?: boolean;
}> = ({
  size = 480,
  drawProgress = 1,
  highlightVar = null,
  dimmedVar = null,
  glowIntensity = 0.5,
  showLabels = true,
  showDivLine = true,
}) => {
  const cx = size / 2;
  const topY = 40;
  const botY = size - 60;
  const leftX = 50;
  const rightX = size - 50;
  const midY = (topY + botY) / 2 + 20;

  // Triangle perimeter path
  const triPath = `M ${cx} ${topY} L ${leftX} ${botY} L ${rightX} ${botY} Z`;
  const totalLen = 1400; // approximate perimeter

  const varOpacity = (v: 'n' | 'm' | 'M') => {
    if (dimmedVar === v) return 0.15;
    return 1;
  };
  const varScale = (v: 'n' | 'm' | 'M') => {
    if (highlightVar === v) return 1.2;
    return 1;
  };
  const varGlow = (v: 'n' | 'm' | 'M') => {
    if (highlightVar === v) return 25;
    return 0;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="triGlow">
          <feGaussianBlur stdDeviation={6 + glowIntensity * 8} result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Triangle outline */}
      <path
        d={triPath}
        fill={`${T.primary}08`}
        stroke={T.primary}
        strokeWidth={4}
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen * (1 - drawProgress)}
        strokeLinejoin="round"
        filter="url(#triGlow)"
      />

      {/* Horizontal dividing line (m on top, n and M on bottom) */}
      {showDivLine && drawProgress > 0.6 && (
        <line
          x1={leftX + (cx - leftX) * 0.52}
          y1={midY}
          x2={rightX - (rightX - cx) * 0.52}
          y2={midY}
          stroke={T.primary}
          strokeWidth={3}
          opacity={interpolate(drawProgress, [0.6, 0.8], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })}
        />
      )}

      {/* m (mass) — top */}
      {showLabels && (
        <text
          x={cx}
          y={midY - 40}
          fontFamily={T.mono}
          fontSize={56}
          fontWeight={800}
          fill={T.mass}
          textAnchor="middle"
          opacity={varOpacity('m')}
          filter={varGlow('m') > 0 ? 'url(#triGlow)' : undefined}
          style={{ transform: `scale(${varScale('m')})`, transformOrigin: `${cx}px ${midY - 40}px` } as any}
        >
          m
        </text>
      )}

      {/* n (moles) — bottom-left */}
      {showLabels && (
        <text
          x={cx - 80}
          y={botY - 30}
          fontFamily={T.mono}
          fontSize={56}
          fontWeight={800}
          fill={T.mole}
          textAnchor="middle"
          opacity={varOpacity('n')}
          filter={varGlow('n') > 0 ? 'url(#triGlow)' : undefined}
          style={{ transform: `scale(${varScale('n')})`, transformOrigin: `${cx - 80}px ${botY - 30}px` } as any}
        >
          n
        </text>
      )}

      {/* x (multiply sign) */}
      {showLabels && (
        <text
          x={cx}
          y={botY - 30}
          fontFamily={T.mono}
          fontSize={36}
          fill={T.textMuted}
          textAnchor="middle"
          opacity={Math.min(varOpacity('n'), varOpacity('M'))}
        >
          x
        </text>
      )}

      {/* M (molar mass) — bottom-right */}
      {showLabels && (
        <text
          x={cx + 80}
          y={botY - 30}
          fontFamily={T.mono}
          fontSize={56}
          fontWeight={800}
          fill={T.molarMass}
          textAnchor="middle"
          opacity={varOpacity('M')}
          filter={varGlow('M') > 0 ? 'url(#triGlow)' : undefined}
          style={{ transform: `scale(${varScale('M')})`, transformOrigin: `${cx + 80}px ${botY - 30}px` } as any}
        >
          M
        </text>
      )}
    </svg>
  );
};

// ── Element Card ─────────────────────────────────────────────────────
const ElementCard: React.FC<{
  symbol: string; name: string; mr: string; opacity: number; scale?: number; color?: string;
}> = ({ symbol, name, mr, opacity, scale = 1, color = T.primary }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px 36px', border: `2px solid ${color}50`,
    borderRadius: 16, background: `${color}10`,
    minWidth: 160,
  }}>
    <div style={{ fontFamily: T.mono, fontSize: 56, fontWeight: 800, color }}>{symbol}</div>
    <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, marginTop: 4 }}>{name}</div>
    <div style={{
      fontFamily: T.mono, fontSize: 24, fontWeight: 700, color: T.gold,
      marginTop: 8, padding: '4px 16px', background: `${T.gold}15`, borderRadius: 8,
    }}>
      M = {mr}
    </div>
  </div>
);

// ── Calculation Step ─────────────────────────────────────────────────
const CalcStep: React.FC<{
  left: string; right: string; opacity: number; translateY?: number;
  color?: string; isAnswer?: boolean;
}> = ({ left, right, opacity, translateY = 0, color = T.text, isAnswer = false }) => (
  <div style={{
    opacity, transform: `translateY(${translateY}px)`,
    display: 'flex', alignItems: 'center', gap: 16,
    fontFamily: T.mono, fontSize: isAnswer ? 40 : 30, fontWeight: isAnswer ? 800 : 600,
    color: isAnswer ? T.success : color,
    padding: isAnswer ? '12px 32px' : '8px 24px',
    background: isAnswer ? `${T.success}15` : `${T.text}05`,
    border: isAnswer ? `2px solid ${T.success}50` : 'none',
    borderRadius: 12,
    textShadow: isAnswer ? `0 0 20px ${T.success}40` : 'none',
  }}>
    <span style={{ color: T.textMuted }}>{left}</span>
    <span style={{ color: T.primary }}>=</span>
    <span>{right}</span>
  </div>
);

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const oneCue = useCueSpring(ct('one'));

  // Ken Burns slow zoom on hook image
  const hookScale = interpolate(frame, [0, 2.2 * fps], [1.0, 1.1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background hook image */}
      <Img src={staticFile('images/stoichiometry/03-triangle-hook.png')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 15], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.35)',
      }} />

      {/* Content overlay */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 400, fontSize: 30, color: T.textMuted,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          marginBottom: 16,
        }}>
          Every conversion you need
        </div>

        <GlowText fontSize={72} color={T.gold} style={{
          opacity: oneCue.opacity, transform: `scale(${oneCue.scale})`,
        }}>
          ONE FORMULA
        </GlowText>

        <div style={{
          fontFamily: T.font, fontSize: 26, color: T.textMuted,
          opacity: oneCue.opacity, marginTop: 16,
        }}>
          one triangle
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Formula Intro — n = m/M ────────────────────────────────
const FormulaIntroScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Build the formula letter by letter over the scene
  const sceneDur = (ct('triangle') > 0 ? ct('triangle') : 11.36) * fps;
  const buildProgress = interpolate(frame, [0, Math.min(sceneDur * 0.7, 180)], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Individual letter appearances
  const nAppear = interpolate(buildProgress, [0, 0.15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const eqAppear = interpolate(buildProgress, [0.15, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mAppear = interpolate(buildProgress, [0.3, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineAppear = interpolate(buildProgress, [0.5, 0.65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bigMAppear = interpolate(buildProgress, [0.65, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Glow pulse after fully built
  const fullGlow = buildProgress >= 1
    ? 0.5 + 0.5 * Math.sin(frame / 8)
    : 0;

  // Labels appear after the formula is built
  const labelsOpacity = interpolate(buildProgress, [0.85, 1], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Title */}
      <div style={{
        position: 'absolute', top: 100,
        fontFamily: T.font, fontWeight: 700, fontSize: 30, color: T.textMuted,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        THE FORMULA
      </div>

      {/* Main formula: n = m / M */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 30,
        filter: fullGlow > 0 ? `drop-shadow(0 0 ${20 + fullGlow * 20}px ${T.primary}60)` : 'none',
      }}>
        {/* n */}
        <div style={{
          fontFamily: T.mono, fontSize: 120, fontWeight: 800, color: T.mole,
          opacity: nAppear,
          transform: `scale(${interpolate(nAppear, [0, 1], [0.5, 1])})`,
          textShadow: `0 0 30px ${T.mole}50`,
        }}>n</div>

        {/* = */}
        <div style={{
          fontFamily: T.mono, fontSize: 100, fontWeight: 600, color: T.textMuted,
          opacity: eqAppear,
        }}>=</div>

        {/* m / M (fraction) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* m (numerator) */}
          <div style={{
            fontFamily: T.mono, fontSize: 100, fontWeight: 800, color: T.mass,
            opacity: mAppear,
            transform: `scale(${interpolate(mAppear, [0, 1], [0.5, 1])})`,
            textShadow: `0 0 30px ${T.mass}50`,
            lineHeight: 1,
          }}>m</div>

          {/* Division line */}
          <div style={{
            width: 120, height: 5, background: T.text,
            opacity: lineAppear,
            transform: `scaleX(${lineAppear})`,
            borderRadius: 3,
            boxShadow: `0 0 10px ${T.text}40`,
          }} />

          {/* M (denominator) */}
          <div style={{
            fontFamily: T.mono, fontSize: 100, fontWeight: 800, color: T.molarMass,
            opacity: bigMAppear,
            transform: `scale(${interpolate(bigMAppear, [0, 1], [0.5, 1])})`,
            textShadow: `0 0 30px ${T.molarMass}50`,
            lineHeight: 1,
          }}>M</div>
        </div>
      </div>

      {/* Labels for each variable */}
      <div style={{
        display: 'flex', gap: 60, marginTop: 60, opacity: labelsOpacity,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: T.mole }}>n</div>
          <div style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted }}>moles</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: T.mass }}>m</div>
          <div style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted }}>mass (g)</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: T.molarMass }}>M</div>
          <div style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted }}>molar mass</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Triangle Build ──────────────────────────────────────────
const TriangleBuildScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const triCue = useCue(ct('triangle'), 0.3);
  const massCue = useCue(ct('mass-over'), 0.4);

  // Draw-on progress for the triangle
  const drawProgress = triCue.isActive
    ? interpolate(frame - ct('triangle') * fps, [0, 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Labels appear after triangle draws
  const labelsProgress = interpolate(drawProgress, [0.7, 1], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 100 }}>
        <GlowText fontSize={38} color={T.primary} style={{ opacity: triCue.opacity }}>
          THE MOLE TRIANGLE
        </GlowText>
      </div>

      {/* Triangle drawing in */}
      <div style={{
        opacity: triCue.opacity,
        transform: `scale(${interpolate(triCue.opacity, [0, 1], [0.8, 1])})`,
      }}>
        <MoleTriangle
          size={520}
          drawProgress={drawProgress}
          showLabels={labelsProgress > 0.3}
          showDivLine={drawProgress > 0.5}
          glowIntensity={0.5 + 0.3 * Math.sin(frame / 10)}
        />
      </div>

      {/* "mass over molar mass" label */}
      <div style={{
        position: 'absolute', bottom: 280,
        opacity: massCue.opacity,
        transform: `translateY(${massCue.translateY}px)`,
      }}>
        <div style={{
          fontFamily: T.font, fontSize: 26, color: T.text, textAlign: 'center',
          padding: '12px 30px', background: `${T.primary}10`, borderRadius: 12,
          border: `1px solid ${T.primary}30`,
        }}>
          <span style={{ color: T.mass, fontWeight: 700 }}>mass</span>
          {' '}over{' '}
          <span style={{ color: T.molarMass, fontWeight: 700 }}>molar mass</span>
          {' '}gives{' '}
          <span style={{ color: T.mole, fontWeight: 700 }}>moles</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Triangle Demo — Cover & Reveal ─────────────────────────
const TriangleDemoScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene is 16s-39.5s = 23.5s. Cycle through 3 formula variations.
  const sceneDurFrames = 23.5 * fps;

  // Phase 1: Cover n → see m/M (frames 0 - 7.5s)
  // Phase 2: Cover m → see n x M (frames 7.5s - 15s)
  // Phase 3: Cover M → see m/n (frames 15s - 23.5s)
  const phase1Start = 0;
  const phase2Start = 7.5 * fps;
  const phase3Start = 15 * fps;

  type Phase = { highlight: 'n' | 'm' | 'M'; dimmed: 'n' | 'm' | 'M'; label: string; formula: string; formulaColor: string };
  const phases: Phase[] = [
    { highlight: 'n', dimmed: 'n', label: 'Find n (moles)', formula: 'n = m / M', formulaColor: T.mole },
    { highlight: 'm', dimmed: 'm', label: 'Find m (mass)', formula: 'm = n x M', formulaColor: T.mass },
    { highlight: 'M', dimmed: 'M', label: 'Find M (molar mass)', formula: 'M = m / n', formulaColor: T.molarMass },
  ];

  let activePhase: Phase;
  let phaseProgress: number;
  if (frame >= phase3Start) {
    activePhase = phases[2];
    phaseProgress = interpolate(frame, [phase3Start, phase3Start + 30], [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  } else if (frame >= phase2Start) {
    activePhase = phases[1];
    phaseProgress = interpolate(frame, [phase2Start, phase2Start + 30], [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  } else {
    activePhase = phases[0];
    phaseProgress = interpolate(frame, [phase1Start, phase1Start + 30], [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  }

  // Phase indicator dots
  const currentPhaseIdx = frame >= phase3Start ? 2 : frame >= phase2Start ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* "Cover what you want" instruction */}
      <div style={{
        position: 'absolute', top: 80,
        fontFamily: T.font, fontSize: 24, color: T.textMuted,
        opacity: interpolate(frame, [0, 20], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        Cover what you want to find...
      </div>

      {/* Active phase label */}
      <div style={{
        position: 'absolute', top: 150,
        opacity: phaseProgress,
        transform: `scale(${interpolate(phaseProgress, [0, 1], [0.9, 1])})`,
      }}>
        <GlowText fontSize={36} color={activePhase.formulaColor}>
          {activePhase.label}
        </GlowText>
      </div>

      {/* Triangle with dimming */}
      <div style={{ marginTop: 20 }}>
        <MoleTriangle
          size={480}
          drawProgress={1}
          dimmedVar={phaseProgress > 0.3 ? activePhase.dimmed : null}
          highlightVar={null}
          glowIntensity={0.4}
        />
      </div>

      {/* Revealed formula */}
      <div style={{
        position: 'absolute', bottom: 340,
        opacity: phaseProgress,
        transform: `translateY(${interpolate(phaseProgress, [0, 1], [15, 0])}px)`,
      }}>
        <div style={{
          fontFamily: T.mono, fontSize: 52, fontWeight: 800,
          color: activePhase.formulaColor,
          textShadow: `0 0 30px ${activePhase.formulaColor}50`,
          padding: '14px 40px',
          background: `${activePhase.formulaColor}10`,
          borderRadius: 16,
          border: `2px solid ${activePhase.formulaColor}40`,
        }}>
          {activePhase.formula}
        </div>
      </div>

      {/* Phase indicator dots */}
      <div style={{
        position: 'absolute', bottom: 260,
        display: 'flex', gap: 14,
      }}>
        {phases.map((p, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: '50%',
            background: i === currentPhaseIdx ? p.formulaColor : `${T.textMuted}40`,
            boxShadow: i === currentPhaseIdx ? `0 0 12px ${p.formulaColor}60` : 'none',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Question 1 Setup ────────────────────────────────────────
const Question1SetupScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qCue = useCueSpring(ct('question'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Small triangle in corner for reference */}
      <div style={{ position: 'absolute', top: 50, right: 50, opacity: 0.4 }}>
        <MoleTriangle size={180} drawProgress={1} glowIntensity={0.2} />
      </div>

      {/* "EXAMPLE 1" badge */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <Badge
          label="EXAMPLE 1"
          color={T.gold}
          opacity={qCue.opacity}
          scale={qCue.scale}
          fontSize={22}
        />
      </div>

      {/* Question card */}
      <div style={{
        opacity: qCue.opacity,
        transform: `scale(${qCue.scale})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 50px',
        border: `2px solid ${T.primary}40`,
        borderRadius: 24,
        background: `${T.surface}`,
        boxShadow: `0 0 ${40 + pulse * 20}px ${T.primary}15`,
        maxWidth: 900,
      }}>
        <div style={{
          fontFamily: T.font, fontSize: 36, fontWeight: 700, color: T.text,
          textAlign: 'center', lineHeight: 1.5,
        }}>
          You have{' '}
          <span style={{ color: T.mass, fontWeight: 800 }}>24g</span>
          {' '}of{' '}
          <span style={{ color: T.primary, fontWeight: 800 }}>Magnesium</span>
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 30, color: T.textMuted, marginTop: 16,
          textAlign: 'center',
        }}>
          How many{' '}
          <span style={{ color: T.mole, fontWeight: 700 }}>moles</span>?
        </div>
      </div>

      {/* Mg element card */}
      <div style={{
        position: 'absolute', bottom: 240,
        opacity: qCue.opacity,
        transform: `translateY(${interpolate(qCue.opacity, [0, 1], [20, 0])}px)`,
      }}>
        <ElementCard symbol="Mg" name="Magnesium" mr="24" opacity={1} color={T.primary} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Question 1 Solve ────────────────────────────────────────
const Question1SolveScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mrCue = useCue(ct('twentyfour'), 0.4);
  const ansCue = useCueSpring(ct('answer'));

  // Step 2 appears between Mr and answer
  const step2Time = ct('twentyfour') + 2.5;
  const step2Cue = useCue(step2Time, 0.4);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Triangle with n highlighted */}
      <div style={{ position: 'absolute', top: 60, opacity: 0.6 }}>
        <MoleTriangle size={280} drawProgress={1} dimmedVar="n" glowIntensity={0.3} />
      </div>

      {/* Calculation steps */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center',
        marginTop: 160,
      }}>
        {/* Step 1: Identify M */}
        <CalcStep
          left="M(Mg)"
          right="24 g/mol"
          opacity={mrCue.opacity}
          translateY={mrCue.translateY}
          color={T.molarMass}
        />

        {/* Step 2: Substitute */}
        <CalcStep
          left="n"
          right="24 / 24"
          opacity={step2Cue.opacity}
          translateY={step2Cue.translateY}
        />

        {/* Step 3: Answer */}
        <CalcStep
          left="n"
          right="1 mol"
          opacity={ansCue.opacity}
          isAnswer
        />
      </div>

      {/* Success flash */}
      {ansCue.isActive && (
        <div style={{
          position: 'absolute', bottom: 260,
          opacity: ansCue.opacity,
          transform: `scale(${ansCue.scale})`,
        }}>
          <GlowText fontSize={28} color={T.success}>
            That's it! Cover n, do m over M.
          </GlowText>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Scene 7: Question 2 Setup ────────────────────────────────────────
const Question2SetupScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elevenCue = useCueSpring(ct('eleven'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Small triangle in corner */}
      <div style={{ position: 'absolute', top: 50, right: 50, opacity: 0.4 }}>
        <MoleTriangle size={180} drawProgress={1} glowIntensity={0.2} />
      </div>

      {/* "EXAMPLE 2" badge */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <Badge
          label="EXAMPLE 2"
          color={T.secondary}
          opacity={elevenCue.opacity}
          scale={elevenCue.scale}
          fontSize={22}
        />
      </div>

      {/* Question card */}
      <div style={{
        opacity: elevenCue.opacity,
        transform: `scale(${elevenCue.scale})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 50px',
        border: `2px solid ${T.secondary}40`,
        borderRadius: 24,
        background: T.surface,
        boxShadow: `0 0 ${40 + pulse * 20}px ${T.secondary}15`,
        maxWidth: 900,
      }}>
        <div style={{
          fontFamily: T.font, fontSize: 36, fontWeight: 700, color: T.text,
          textAlign: 'center', lineHeight: 1.5,
        }}>
          You have{' '}
          <span style={{ color: T.mass, fontWeight: 800 }}>11g</span>
          {' '}of{' '}
          <span style={{ color: T.secondary, fontWeight: 800 }}>CO&#8322;</span>
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 30, color: T.textMuted, marginTop: 16,
          textAlign: 'center',
        }}>
          How many{' '}
          <span style={{ color: T.mole, fontWeight: 700 }}>moles</span>?
        </div>
      </div>

      {/* CO2 molecule card */}
      <div style={{
        position: 'absolute', bottom: 220,
        opacity: elevenCue.opacity,
        display: 'flex', gap: 20,
      }}>
        <ElementCard symbol="C" name="Carbon" mr="12" opacity={1} color={T.accent} />
        <div style={{
          fontFamily: T.mono, fontSize: 36, color: T.textMuted,
          alignSelf: 'center', fontWeight: 600,
        }}>+</div>
        <ElementCard symbol="O&#8322;" name="Oxygen x2" mr="2x16" opacity={1} color={T.danger} />
        <div style={{
          fontFamily: T.mono, fontSize: 36, color: T.textMuted,
          alignSelf: 'center', fontWeight: 600,
        }}>=</div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '20px 36px', border: `2px solid ${T.gold}50`,
          borderRadius: 16, background: `${T.gold}10`, minWidth: 100,
          alignSelf: 'center',
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 36, fontWeight: 800, color: T.gold }}>44</div>
          <div style={{ fontFamily: T.font, fontSize: 16, color: T.textMuted }}>g/mol</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: Question 2 Solve ────────────────────────────────────────
const Question2SolveScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cues are relative to scene start
  const step1Time = 0.3; // show Mr right away
  const step1Cue = useCue(step1Time, 0.4);
  const step2Time = 2.5;
  const step2Cue = useCue(step2Time, 0.4);
  const ansCue = useCueSpring(ct('pointtwofive'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Triangle with n highlighted */}
      <div style={{ position: 'absolute', top: 60, opacity: 0.6 }}>
        <MoleTriangle size={280} drawProgress={1} dimmedVar="n" glowIntensity={0.3} />
      </div>

      {/* Calculation steps */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center',
        marginTop: 160,
      }}>
        {/* Step 1: Identify M */}
        <CalcStep
          left="M(CO₂)"
          right="12 + 2(16) = 44 g/mol"
          opacity={step1Cue.opacity}
          translateY={step1Cue.translateY}
          color={T.molarMass}
        />

        {/* Step 2: Substitute */}
        <CalcStep
          left="n"
          right="11 / 44"
          opacity={step2Cue.opacity}
          translateY={step2Cue.translateY}
        />

        {/* Step 3: Answer */}
        <CalcStep
          left="n"
          right="0.25 mol"
          opacity={ansCue.opacity}
          isAnswer
        />
      </div>

      {/* Confirmation */}
      {ansCue.isActive && (
        <div style={{
          position: 'absolute', bottom: 260,
          opacity: ansCue.opacity,
          transform: `scale(${ansCue.scale})`,
        }}>
          <GlowText fontSize={26} color={T.success}>
            Same triangle, different numbers!
          </GlowText>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Scene 9: CTA ─────────────────────────────────────────────────────
const CtaScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anyCue = useCueSpring(ct('any'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Big pulsing triangle in background */}
      <div style={{
        position: 'absolute',
        opacity: 0.15 + pulse * 0.1,
        transform: `scale(${1 + pulse * 0.03})`,
      }}>
        <MoleTriangle size={700} drawProgress={1} glowIntensity={pulse} />
      </div>

      {/* CTA content */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        padding: 50,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
        zIndex: 1,
      }}>
        <div style={{ opacity: anyCue.opacity, transform: `scale(${anyCue.scale})` }}>
          <GlowText fontSize={40} color={T.text}>
            Master this triangle
          </GlowText>
          <GlowText fontSize={44} color={T.gold} style={{ marginTop: 8 }}>
            = master your exam
          </GlowText>
        </div>

        {/* Three quick formula reminders */}
        <div style={{
          display: 'flex', gap: 20, marginTop: 10,
          opacity: anyCue.opacity,
        }}>
          {[
            { f: 'n = m/M', c: T.mole },
            { f: 'm = nM', c: T.mass },
            { f: 'M = m/n', c: T.molarMass },
          ].map((item, i) => (
            <div key={i} style={{
              fontFamily: T.mono, fontSize: 22, fontWeight: 700,
              color: item.c, padding: '8px 18px',
              background: `${item.c}10`, borderRadius: 10,
              border: `1px solid ${item.c}30`,
            }}>
              {item.f}
            </div>
          ))}
        </div>

        {/* Series badge */}
        <Badge
          label="STOICHIOMETRY SERIES #3"
          color={T.gold}
          opacity={anyCue.opacity}
          scale={anyCue.scale}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',             startS: 0,      durationS: 2.20,   Component: HookScene },
  { id: 'formula-intro',    startS: 2.20,   durationS: 11.36,  Component: FormulaIntroScene },
  { id: 'triangle-build',   startS: 13.56,  durationS: 2.34,   Component: TriangleBuildScene },
  { id: 'triangle-demo',    startS: 15.90,  durationS: 23.68,  Component: TriangleDemoScene },
  { id: 'q1-setup',         startS: 39.58,  durationS: 6.84,   Component: Question1SetupScene },
  { id: 'q1-solve',         startS: 46.42,  durationS: 7.60,   Component: Question1SolveScene },
  { id: 'q2-setup',         startS: 54.02,  durationS: 2.70,   Component: Question2SetupScene },
  { id: 'q2-solve',         startS: 56.72,  durationS: 10.78,  Component: Question2SolveScene },
  { id: 'cta',              startS: 67.50,  durationS: 5.27,   Component: CtaScene },
];

// ── Progress Bar ─────────────────────────────────────────────────────
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `${T.text}10` }}>
      <div style={{
        height: '100%', width: `${progress}%`,
        background: `linear-gradient(90deg, ${T.mole}, ${T.gold})`,
        borderRadius: 2,
      }} />
    </div>
  );
};

// ── Main Composition ─────────────────────────────────────────────────
export const StoichiometryTriangleTikTok: React.FC<StoichiometryTriangleTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/stoichiometry/03-triangle-narration.mp3')} volume={1} />
      )}
      {SCENES.map((scene) => {
        const startFrame = Math.round(scene.startS * fps);
        const durationFrames = Math.round(scene.durationS * fps);
        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={durationFrames}>
            <scene.Component ct={(id: string) => ct(id) - scene.startS} />
          </Sequence>
        );
      })}
      <ProgressBar />
    </AbsoluteFill>
  );
};

// ── Duration Helper ──────────────────────────────────────────────────
export function getStoichiometryTriangleDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

// ── Cover Frame (for Remotion Studio thumbnail) ──────────────────────
export const StoichiometryTriangleCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ marginBottom: 30 }}>
      <MoleTriangle size={500} drawProgress={1} glowIntensity={0.7} />
    </div>
    <GlowText fontSize={52} color={T.gold}>THE MOLE TRIANGLE</GlowText>
    <div style={{
      fontFamily: T.font, fontSize: 24, color: T.textMuted, marginTop: 12,
    }}>
      Stoichiometry #3
    </div>
  </AbsoluteFill>
);
