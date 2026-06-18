/**
 * Stoichiometry #6 — "Solutions & Concentration" TikTok (9:16) v1
 *
 * Cambridge IGCSE 0620 — c = n/V, mol/dm³, cm³→dm³ trap, worked NaOH example.
 *
 * Pure CSS motion graphics.
 * 8 scenes, ~74.8 seconds, 1080x1920.
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
const TOTAL_DURATION_S = 74.81;

// ── Theme ────────────────────────────────────────────────────────────
const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00d9ff',     // cyan — main accent
  secondary: '#ff00ff',   // magenta
  accent: '#c084fc',      // purple
  success: '#22c55e',
  danger: '#ef4444',
  gold: '#fbbf24',
  warning: '#f59e0b',
  water: '#38bdf8',       // light blue for water/solution
  solute: '#a78bfa',      // purple for solute particles
  beaker: '#22d3ee',      // teal for glassware
  naoh: '#10b981',        // emerald for NaOH
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved timestamps ────────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  'solution':  2.36,     // "solution" first mentioned
  'unit':      7.50,     // mol/dm³ unit introduced
  'formula':  17.00,     // c = n/V formula
  'trap':     27.06,     // cm³ → dm³ trap
  'example':  38.48,     // NaOH example setup
  'forty':    48.26,     // Mr = 40
  'answer':   65.80,     // final answer reveal
};

// ── Types ────────────────────────────────────────────────────────────
export interface StoichiometrySolutionsTikTokProps {
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

// Floating particle dot
const Particle: React.FC<{
  x: number; y: number; size: number; color: string; delay: number;
}> = ({ x, y, size, color, delay }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin((frame + delay * 30) / 15);
  const drift = Math.sin((frame + delay * 20) / 40) * 8;
  return (
    <div style={{
      position: 'absolute', left: x + drift, top: y,
      width: size, height: size, borderRadius: '50%',
      background: color, opacity: pulse * 0.7,
      boxShadow: `0 0 ${size * 2}px ${color}60`,
    }} />
  );
};

// Concentration Triangle (c = n / V)
const ConcentrationTriangle: React.FC<{
  size?: number;
  drawProgress?: number;
  highlightVar?: 'c' | 'n' | 'V' | null;
  glowIntensity?: number;
  showLabels?: boolean;
}> = ({
  size = 400,
  drawProgress = 1,
  highlightVar = null,
  glowIntensity = 0.5,
  showLabels = true,
}) => {
  const cx = size / 2;
  const topY = 40;
  const botY = size - 50;
  const leftX = 50;
  const rightX = size - 50;
  const midY = (topY + botY) / 2 + 20;

  const triPath = `M ${cx} ${topY} L ${leftX} ${botY} L ${rightX} ${botY} Z`;
  const totalLen = 1400;

  const varColor = (v: 'c' | 'n' | 'V') => {
    if (highlightVar === v) return T.gold;
    if (highlightVar && highlightVar !== v) return `${T.primary}40`;
    return T.primary;
  };

  const varFontSize = (v: 'c' | 'n' | 'V') => {
    if (highlightVar === v) return 72;
    return 60;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="triGlowC">
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
        filter="url(#triGlowC)"
      />

      {/* Divider line */}
      <line
        x1={leftX + 30} y1={midY} x2={rightX - 30} y2={midY}
        stroke={`${T.primary}60`}
        strokeWidth={3}
        strokeDasharray={size}
        strokeDashoffset={size * (1 - drawProgress)}
      />

      {showLabels && drawProgress > 0.6 && (
        <>
          {/* n on top */}
          <text
            x={cx} y={midY - 40}
            fontFamily={T.mono} fontSize={varFontSize('n')} fontWeight={900}
            fill={varColor('n')}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ filter: highlightVar === 'n' ? `drop-shadow(0 0 15px ${T.gold}80)` : undefined }}
          >n</text>

          {/* c bottom-left */}
          <text
            x={cx - 80} y={midY + 70}
            fontFamily={T.mono} fontSize={varFontSize('c')} fontWeight={900}
            fill={varColor('c')}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ filter: highlightVar === 'c' ? `drop-shadow(0 0 15px ${T.gold}80)` : undefined }}
          >c</text>

          {/* V bottom-right */}
          <text
            x={cx + 80} y={midY + 70}
            fontFamily={T.mono} fontSize={varFontSize('V')} fontWeight={900}
            fill={varColor('V')}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ filter: highlightVar === 'V' ? `drop-shadow(0 0 15px ${T.gold}80)` : undefined }}
          >V</text>

          {/* Division symbol */}
          <text
            x={cx} y={midY + 70}
            fontFamily={T.mono} fontSize={40} fontWeight={700}
            fill={`${T.textMuted}80`}
            textAnchor="middle"
            dominantBaseline="middle"
          >{'\u00f7'}</text>
        </>
      )}
    </svg>
  );
};

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook (0–2.4s) ──────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns slow zoom on hook image
  const hookScale = interpolate(frame, [0, 2.4 * fps], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title fade in
  const titleOpacity = interpolate(frame, [8, 25], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleScale = interpolate(frame, [8, 25], [0.9, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtitle delayed
  const subOpacity = interpolate(frame, [30, 50], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pulse = 0.85 + 0.15 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image */}
      <Img src={staticFile('images/stoichiometry/06-solutions-hook.png')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 15], [0, 0.45],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.4)',
      }} />

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: 'linear-gradient(180deg, transparent 30%, #050510cc 70%, #050510 100%)',
      }} />

      {/* Content overlay */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          opacity: titleOpacity, transform: `scale(${titleScale * pulse})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.font, fontWeight: 400, fontSize: 28, color: T.textMuted,
          }}>
            Stoichiometry #6
          </div>

          <GlowText fontSize={64} color={T.water}>
            SOLUTIONS
          </GlowText>

          <div style={{
            fontFamily: T.mono, fontSize: 22, color: `${T.gold}90`,
            opacity: subOpacity,
          }}>
            & Concentration
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Solution Intro (2.4–7.5s) ─────────────────────────────
const SolutionIntroScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const solCue = useCueSpring(ct('solution'));

  // Beaker fill animation
  const fillLevel = solCue.isActive
    ? interpolate(frame - ct('solution') * fps, [0, 60], [0, 0.75],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Dissolving particles
  const particleCount = Math.floor(fillLevel * 12);

  // Water wave
  const wave = Math.sin(frame / 12) * 4;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <Particle
          key={i}
          x={60 + (i * 67) % 960}
          y={150 + (i * 113) % 1600}
          size={4 + (i % 3) * 2}
          color={i % 2 === 0 ? T.water : T.solute}
          delay={i * 0.8}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: solCue.opacity, transform: `scale(${solCue.scale})` }}>
          <GlowText fontSize={44} color={T.water}>WHAT IS A SOLUTION?</GlowText>
        </div>

        {/* Beaker visualization */}
        <div style={{
          opacity: solCue.opacity,
          position: 'relative', width: 280, height: 360,
        }}>
          {/* Beaker outline */}
          <svg width={280} height={360} viewBox="0 0 280 360" style={{ position: 'absolute' }}>
            {/* Beaker body */}
            <path
              d="M 50 60 L 50 300 Q 50 340 90 340 L 190 340 Q 230 340 230 300 L 230 60"
              fill="none" stroke={T.beaker} strokeWidth={4} strokeLinecap="round"
            />
            {/* Beaker rim */}
            <line x1={30} y1={60} x2={50} y2={60} stroke={T.beaker} strokeWidth={3} />
            <line x1={230} y1={60} x2={250} y2={60} stroke={T.beaker} strokeWidth={3} />
          </svg>

          {/* Water fill */}
          <div style={{
            position: 'absolute',
            bottom: 20, left: 54, right: 54,
            height: `${fillLevel * 75}%`,
            background: `linear-gradient(180deg, ${T.water}30, ${T.water}15)`,
            borderRadius: '0 0 16 16',
            transform: `translateY(${wave}px)`,
            transition: 'height 0.1s linear',
          }} />

          {/* Dissolving solute particles */}
          {Array.from({ length: particleCount }, (_, i) => {
            const px = 80 + (i * 37) % 120;
            const py = 340 - fillLevel * 260 + (i * 53) % (fillLevel * 200 + 1);
            const drift = Math.sin((frame + i * 20) / 25) * 10;
            return (
              <div key={i} style={{
                position: 'absolute', left: px + drift, top: py,
                width: 10, height: 10, borderRadius: '50%',
                background: T.solute,
                boxShadow: `0 0 8px ${T.solute}80`,
                opacity: 0.8,
              }} />
            );
          })}
        </div>

        {/* Labels */}
        <div style={{
          display: 'flex', gap: 40, alignItems: 'center',
          opacity: interpolate(fillLevel, [0.3, 0.6], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <Badge label="Solute" color={T.solute} opacity={1} fontSize={22} />
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.textMuted }}>dissolves in</div>
          <Badge label="Solvent" color={T.water} opacity={1} fontSize={22} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Unit Scene (7.5–17s) ───────────────────────────────────
const UnitScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const unitCue = useCueSpring(ct('unit'));

  // Unit parts stagger
  const molOpacity = unitCue.isActive
    ? interpolate(frame - ct('unit') * fps, [0, 20], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const slashOpacity = unitCue.isActive
    ? interpolate(frame - ct('unit') * fps, [15, 35], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const dmOpacity = unitCue.isActive
    ? interpolate(frame - ct('unit') * fps, [30, 50], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Annotation stagger
  const annotDelay = 60;
  const annotMol = unitCue.isActive
    ? interpolate(frame - ct('unit') * fps, [annotDelay, annotDelay + 20], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const annotDm = unitCue.isActive
    ? interpolate(frame - ct('unit') * fps, [annotDelay + 25, annotDelay + 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.7 + 0.3 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
      }}>
        <div style={{ opacity: unitCue.opacity }}>
          <GlowText fontSize={36} color={T.textMuted}>
            THE UNIT OF CONCENTRATION
          </GlowText>
        </div>

        {/* Main unit display */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 8,
          opacity: unitCue.opacity, transform: `scale(${unitCue.scale})`,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 90, fontWeight: 900, color: T.primary,
            textShadow: `0 0 ${40 * pulse}px ${T.primary}80`,
            opacity: molOpacity,
          }}>mol</div>
          <div style={{
            fontFamily: T.mono, fontSize: 90, fontWeight: 900, color: T.textMuted,
            opacity: slashOpacity,
          }}>/</div>
          <div style={{
            fontFamily: T.mono, fontSize: 90, fontWeight: 900, color: T.gold,
            textShadow: `0 0 ${30 * pulse}px ${T.gold}60`,
            opacity: dmOpacity,
          }}>dm{'\u00b3'}</div>
        </div>

        {/* Annotation labels */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          marginTop: 20,
        }}>
          <div style={{
            opacity: annotMol,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', background: T.primary,
              boxShadow: `0 0 10px ${T.primary}60`,
            }} />
            <div style={{
              fontFamily: T.font, fontSize: 28, color: T.text,
            }}>
              <span style={{ color: T.primary, fontWeight: 700 }}>mol</span> = moles of solute
            </div>
          </div>

          <div style={{
            opacity: annotDm,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', background: T.gold,
              boxShadow: `0 0 10px ${T.gold}60`,
            }} />
            <div style={{
              fontFamily: T.font, fontSize: 28, color: T.text,
            }}>
              <span style={{ color: T.gold, fontWeight: 700 }}>dm{'\u00b3'}</span> = cubic decimetres (litres)
            </div>
          </div>
        </div>

        <Badge
          label={'"moles per decimetre cubed"'}
          color={T.water}
          opacity={annotDm}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Formula Scene (17–27s) ──────────────────────────────────
const FormulaScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const formulaCue = useCueSpring(ct('formula'));

  // Formula parts build
  const cReveal = formulaCue.isActive
    ? interpolate(frame - ct('formula') * fps, [0, 15], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const eqReveal = formulaCue.isActive
    ? interpolate(frame - ct('formula') * fps, [10, 25], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const nReveal = formulaCue.isActive
    ? interpolate(frame - ct('formula') * fps, [20, 35], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const divReveal = formulaCue.isActive
    ? interpolate(frame - ct('formula') * fps, [30, 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const vReveal = formulaCue.isActive
    ? interpolate(frame - ct('formula') * fps, [40, 55], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Triangle draw-on
  const triProgress = formulaCue.isActive
    ? interpolate(frame - ct('formula') * fps, [60, 120], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.7 + 0.3 * Math.sin(frame / 10);

  // Labels for the formula parts
  const labelOpacity = formulaCue.isActive
    ? interpolate(frame - ct('formula') * fps, [50, 70], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: formulaCue.opacity }}>
          <GlowText fontSize={36} color={T.textMuted}>THE FORMULA</GlowText>
        </div>

        {/* Main formula: c = n / V */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          opacity: formulaCue.opacity,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 100, fontWeight: 900, color: T.primary,
            textShadow: `0 0 ${40 * pulse}px ${T.primary}80`,
            opacity: cReveal,
          }}>c</div>

          <div style={{
            fontFamily: T.mono, fontSize: 80, fontWeight: 700, color: T.textMuted,
            opacity: eqReveal,
          }}>=</div>

          {/* Fraction */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 80, fontWeight: 900, color: T.gold,
              textShadow: `0 0 30px ${T.gold}60`,
              opacity: nReveal,
              lineHeight: 1.1,
            }}>n</div>

            <div style={{
              width: 120, height: 4, borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${T.text}60, transparent)`,
              opacity: divReveal,
            }} />

            <div style={{
              fontFamily: T.mono, fontSize: 80, fontWeight: 900, color: T.success,
              textShadow: `0 0 30px ${T.success}60`,
              opacity: vReveal,
              lineHeight: 1.1,
            }}>V</div>
          </div>
        </div>

        {/* Labels */}
        <div style={{
          display: 'flex', gap: 30, opacity: labelOpacity,
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <Badge label="c = concentration" color={T.primary} opacity={1} fontSize={18} />
          <Badge label="n = moles" color={T.gold} opacity={1} fontSize={18} />
          <Badge label="V = volume (dm\u00b3)" color={T.success} opacity={1} fontSize={18} />
        </div>

        {/* Triangle callback */}
        <div style={{
          opacity: triProgress,
          transform: `scale(${interpolate(triProgress, [0, 1], [0.8, 1])})`,
          marginTop: 10,
        }}>
          <ConcentrationTriangle
            size={300}
            drawProgress={triProgress}
            glowIntensity={0.4}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Trap Scene (27–38.5s) ───────────────────────────────────
const TrapScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const trapCue = useCueSpring(ct('trap'));

  // Warning flash
  const flashPulse = trapCue.isActive ? 0.6 + 0.4 * Math.sin(frame / 6) : 0;

  // Step reveals
  const step1 = trapCue.isActive
    ? interpolate(frame - ct('trap') * fps, [0, 25], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const step2 = trapCue.isActive
    ? interpolate(frame - ct('trap') * fps, [30, 55], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const step3 = trapCue.isActive
    ? interpolate(frame - ct('trap') * fps, [60, 85], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const step4 = trapCue.isActive
    ? interpolate(frame - ct('trap') * fps, [90, 115], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        {/* Warning header */}
        <div style={{
          opacity: trapCue.opacity, transform: `scale(${trapCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 52, fontWeight: 900, color: T.danger,
            textShadow: `0 0 ${30 * flashPulse}px ${T.danger}80`,
          }}>{'\u26a0\ufe0f'}</div>
          <GlowText fontSize={44} color={T.danger}>
            UNIT TRAP!
          </GlowText>
        </div>

        {/* cm³ → dm³ conversion */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          padding: '40px 60px',
          border: `2px solid ${T.danger}40`,
          borderRadius: 24, background: `${T.danger}08`,
        }}>
          {/* The problem */}
          <div style={{
            opacity: step1,
            fontFamily: T.font, fontSize: 28, color: T.text, textAlign: 'center',
          }}>
            Volume is often given in <span style={{ color: T.danger, fontWeight: 700 }}>cm{'\u00b3'}</span>
          </div>

          <div style={{
            opacity: step2,
            fontFamily: T.font, fontSize: 28, color: T.text, textAlign: 'center',
          }}>
            But the formula needs <span style={{ color: T.success, fontWeight: 700 }}>dm{'\u00b3'}</span>
          </div>

          {/* Conversion rule */}
          <div style={{
            opacity: step3,
            display: 'flex', alignItems: 'center', gap: 20, marginTop: 10,
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 52, fontWeight: 900, color: T.danger,
            }}>cm{'\u00b3'}</div>

            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                fontFamily: T.mono, fontSize: 36, fontWeight: 700, color: T.gold,
                textShadow: `0 0 20px ${T.gold}40`,
              }}>{'\u00f7'} 1000</div>
              <svg width={120} height={20}>
                <line x1={0} y1={10} x2={100} y2={10} stroke={T.gold} strokeWidth={3} />
                <polygon points="95,4 110,10 95,16" fill={T.gold} />
              </svg>
            </div>

            <div style={{
              fontFamily: T.mono, fontSize: 52, fontWeight: 900, color: T.success,
              textShadow: `0 0 20px ${T.success}40`,
            }}>dm{'\u00b3'}</div>
          </div>

          {/* Example: 250 → 0.25 */}
          <div style={{
            opacity: step4,
            display: 'flex', alignItems: 'center', gap: 20,
            padding: '16px 30px',
            background: `${T.gold}10`, borderRadius: 16,
            border: `1px solid ${T.gold}30`,
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 44, fontWeight: 900, color: T.danger,
            }}>250</div>
            <div style={{
              fontFamily: T.font, fontSize: 28, color: T.textMuted,
            }}>{'\u2192'}</div>
            <div style={{
              fontFamily: T.mono, fontSize: 44, fontWeight: 900, color: T.success,
              textShadow: `0 0 20px ${T.success}40`,
            }}>0.25</div>
            <div style={{
              fontFamily: T.mono, fontSize: 24, color: T.textMuted,
            }}>dm{'\u00b3'}</div>
          </div>
        </div>

        <Badge
          label="ALWAYS convert before using the formula"
          color={T.warning}
          opacity={step4}
          fontSize={18}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Example Setup (38.5–48.3s) ─────────────────────────────
const ExampleSetupScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exCue = useCueSpring(ct('example'));

  // Problem card reveal
  const cardReveal = exCue.isActive
    ? interpolate(frame - ct('example') * fps, [0, 30], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Data points stagger
  const d1 = exCue.isActive
    ? interpolate(frame - ct('example') * fps, [20, 40], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const d2 = exCue.isActive
    ? interpolate(frame - ct('example') * fps, [35, 55], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const d3 = exCue.isActive
    ? interpolate(frame - ct('example') * fps, [50, 70], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.8 + 0.2 * Math.sin(frame / 12);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: exCue.opacity, transform: `scale(${exCue.scale})` }}>
          <GlowText fontSize={38} color={T.naoh}>WORKED EXAMPLE</GlowText>
        </div>

        {/* Problem card */}
        <div style={{
          opacity: cardReveal,
          width: 850, padding: '40px 50px',
          border: `2px solid ${T.naoh}50`,
          borderRadius: 24, background: `${T.naoh}08`,
          boxShadow: `0 0 ${40 * pulse}px ${T.naoh}15`,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 30, color: T.text, lineHeight: 1.6,
            textAlign: 'center',
          }}>
            <span style={{ color: T.naoh, fontWeight: 700 }}>4 g</span> of NaOH is dissolved in{' '}
            <span style={{ color: T.water, fontWeight: 700 }}>250 cm{'\u00b3'}</span> of water.
          </div>

          <div style={{
            fontFamily: T.font, fontSize: 28, color: T.gold, fontWeight: 700,
            textAlign: 'center',
          }}>
            Find the concentration.
          </div>
        </div>

        {/* Given data */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16,
          alignItems: 'flex-start',
        }}>
          <div style={{
            opacity: d1,
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: T.mono, fontSize: 30,
          }}>
            <span style={{ color: T.textMuted }}>mass</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{ color: T.naoh, fontWeight: 700 }}>4 g</span>
          </div>

          <div style={{
            opacity: d2,
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: T.mono, fontSize: 30,
          }}>
            <span style={{ color: T.textMuted }}>volume</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{ color: T.danger, fontWeight: 700 }}>250 cm{'\u00b3'}</span>
            <span style={{ color: T.textMuted }}>{'\u2192'}</span>
            <span style={{ color: T.success, fontWeight: 700 }}>0.25 dm{'\u00b3'}</span>
          </div>

          <div style={{
            opacity: d3,
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: T.mono, fontSize: 30,
          }}>
            <span style={{ color: T.textMuted }}>M{'\u1d63'}(NaOH)</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{ color: T.accent, fontWeight: 700 }}>?</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: Calculation Scene (48.3–65.8s) ──────────────────────────
const CalculationScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fortyCue = useCue(ct('forty'));

  // Step stagger (over ~17 seconds = ~510 frames)
  const s1 = fortyCue.isActive
    ? interpolate(frame - ct('forty') * fps, [0, 25], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const s2 = fortyCue.isActive
    ? interpolate(frame - ct('forty') * fps, [40, 65], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const s3 = fortyCue.isActive
    ? interpolate(frame - ct('forty') * fps, [80, 105], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const s4 = fortyCue.isActive
    ? interpolate(frame - ct('forty') * fps, [120, 145], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const s5 = fortyCue.isActive
    ? interpolate(frame - ct('forty') * fps, [170, 195], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const s6 = fortyCue.isActive
    ? interpolate(frame - ct('forty') * fps, [220, 245], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const s7 = fortyCue.isActive
    ? interpolate(frame - ct('forty') * fps, [270, 295], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Step badge counter
  const stepNum = s7 > 0.5 ? 4 : s5 > 0.5 ? 3 : s3 > 0.5 ? 2 : 1;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Step badge */}
      <div style={{
        position: 'absolute', top: 80, right: 60,
        opacity: fortyCue.opacity,
      }}>
        <Badge label={`Step ${stepNum}/4`} color={T.primary} opacity={1} fontSize={20} />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        padding: '0 60px',
      }}>
        {/* Step 1: Find Mr */}
        <div style={{
          opacity: s1,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
          width: '100%',
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 22, color: T.textMuted, fontWeight: 600,
          }}>Step 1: Find M{'\u1d63'}</div>
          <div style={{
            fontFamily: T.mono, fontSize: 36, color: T.text,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span>M{'\u1d63'}(NaOH)</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{ color: T.accent }}>23 + 16 + 1</span>
          </div>
          <div style={{
            opacity: s2,
            fontFamily: T.mono, fontSize: 44, fontWeight: 900, color: T.gold,
            textShadow: `0 0 20px ${T.gold}40`,
            marginLeft: 180,
          }}>= 40</div>
        </div>

        {/* Divider */}
        <div style={{
          width: 700, height: 2, borderRadius: 1,
          background: `linear-gradient(90deg, transparent, ${T.primary}40, transparent)`,
          opacity: s3,
        }} />

        {/* Step 2: Find n */}
        <div style={{
          opacity: s3,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
          width: '100%',
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 22, color: T.textMuted, fontWeight: 600,
          }}>Step 2: Find n</div>
          <div style={{
            fontFamily: T.mono, fontSize: 36, color: T.text,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span>n</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{ color: T.naoh }}>mass</span>
            <span style={{ color: T.textMuted }}>/</span>
            <span style={{ color: T.gold }}>M{'\u1d63'}</span>
          </div>
          <div style={{
            fontFamily: T.mono, fontSize: 36, color: T.text,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ opacity: s4 }}>
              <span style={{ color: T.textMuted }}>=</span>{' '}
              <span style={{ color: T.naoh }}>4</span>
              <span style={{ color: T.textMuted }}> / </span>
              <span style={{ color: T.gold }}>40</span>
            </span>
          </div>
          <div style={{
            opacity: s4,
            fontFamily: T.mono, fontSize: 44, fontWeight: 900, color: T.primary,
            textShadow: `0 0 20px ${T.primary}40`,
            marginLeft: 180,
          }}>= 0.1 mol</div>
        </div>

        {/* Divider */}
        <div style={{
          width: 700, height: 2, borderRadius: 1,
          background: `linear-gradient(90deg, transparent, ${T.primary}40, transparent)`,
          opacity: s5,
        }} />

        {/* Step 3: V is ready */}
        <div style={{
          opacity: s5,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
          width: '100%',
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 22, color: T.textMuted, fontWeight: 600,
          }}>Step 3: Volume (already converted)</div>
          <div style={{
            fontFamily: T.mono, fontSize: 44, fontWeight: 900, color: T.success,
            textShadow: `0 0 20px ${T.success}40`,
          }}>V = 0.25 dm{'\u00b3'}</div>
        </div>

        {/* Divider */}
        <div style={{
          width: 700, height: 2, borderRadius: 1,
          background: `linear-gradient(90deg, transparent, ${T.primary}40, transparent)`,
          opacity: s6,
        }} />

        {/* Step 4: c = n / V */}
        <div style={{
          opacity: s6,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
          width: '100%',
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 22, color: T.textMuted, fontWeight: 600,
          }}>Step 4: Find c</div>
          <div style={{
            fontFamily: T.mono, fontSize: 36, color: T.text,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span>c</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{ color: T.primary }}>n</span>
            <span style={{ color: T.textMuted }}>/</span>
            <span style={{ color: T.success }}>V</span>
          </div>
          <div style={{
            fontFamily: T.mono, fontSize: 36, color: T.text,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ opacity: s7 }}>
              <span style={{ color: T.textMuted }}>=</span>{' '}
              <span style={{ color: T.primary }}>0.1</span>
              <span style={{ color: T.textMuted }}> / </span>
              <span style={{ color: T.success }}>0.25</span>
            </span>
          </div>
          <div style={{
            opacity: s7,
            fontFamily: T.mono, fontSize: 52, fontWeight: 900, color: T.gold,
            textShadow: `0 0 30px ${T.gold}60`,
            marginLeft: 120,
          }}>= 0.4 mol/dm{'\u00b3'}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: Answer Scene (65.8–74.8s) ───────────────────────────────
const AnswerScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ansCue = useCueSpring(ct('answer'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  // Answer scale-up
  const ansScale = ansCue.isActive
    ? interpolate(frame - ct('answer') * fps, [0, 20], [0.8, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0.8;

  // Summary items stagger
  const items = [
    { text: 'c = n / V', color: T.primary },
    { text: 'Unit: mol/dm\u00b3', color: T.gold },
    { text: 'Always convert cm\u00b3 \u2192 dm\u00b3 first!', color: T.danger },
  ];

  // Triangle and CTA reveals
  const triOpacity = ansCue.isActive
    ? interpolate(frame - ct('answer') * fps, [40, 65], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const ctaOpacity = ansCue.isActive
    ? interpolate(frame - ct('answer') * fps, [80, 110], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        padding: 50,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        {/* Main answer */}
        <div style={{
          opacity: ansCue.opacity, transform: `scale(${ansScale * ansCue.scale})`,
        }}>
          <GlowText fontSize={72} color={T.gold} style={{
            textShadow: `0 0 ${50 * pulse}px ${T.gold}80, 0 0 80px ${T.gold}40`,
          }}>
            0.4 mol/dm{'\u00b3'}
          </GlowText>
        </div>

        {/* Summary bullets */}
        {items.map((item, i) => {
          const itemOpacity = ansCue.isActive
            ? interpolate(frame - ct('answer') * fps, [15 + i * 15, 30 + i * 15], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0;
          return (
            <div key={i} style={{
              opacity: itemOpacity,
              fontFamily: T.font, fontSize: 24, color: T.text, textAlign: 'center',
              padding: '8px 20px', background: `${item.color}10`, borderRadius: 10,
              border: `1px solid ${item.color}30`, width: 800,
            }}>
              <span style={{ color: item.color, fontWeight: 700 }}>{'\u2713'}</span>{' '}
              {item.text}
            </div>
          );
        })}

        {/* Concentration triangle mini */}
        <div style={{ opacity: triOpacity, marginTop: 10 }}>
          <ConcentrationTriangle
            size={200}
            drawProgress={1}
            highlightVar="c"
            glowIntensity={pulse * 0.6}
          />
        </div>

        {/* CTA */}
        <Badge
          label="FOLLOW FOR MORE STOICHIOMETRY"
          color={T.secondary}
          opacity={ctaOpacity}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',              startS: 0,     durationS: 2.36,  Component: HookScene },
  { id: 'solution-intro',    startS: 2.36,  durationS: 5.14,  Component: SolutionIntroScene },
  { id: 'unit',              startS: 7.50,  durationS: 9.50,  Component: UnitScene },
  { id: 'formula',           startS: 17.00, durationS: 10.06, Component: FormulaScene },
  { id: 'trap',              startS: 27.06, durationS: 11.42, Component: TrapScene },
  { id: 'example-setup',     startS: 38.48, durationS: 9.78,  Component: ExampleSetupScene },
  { id: 'calculation',       startS: 48.26, durationS: 17.54, Component: CalculationScene },
  { id: 'answer-cta',        startS: 65.80, durationS: 9.01,  Component: AnswerScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const StoichiometrySolutionsTikTok: React.FC<StoichiometrySolutionsTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/stoichiometry/06-solutions-narration.mp3')} volume={1} />
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

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `${T.text}10` }}>
      <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${T.primary}, ${T.gold})`, borderRadius: 2 }} />
    </div>
  );
};

export function getStoichiometrySolutionsDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const StoichiometrySolutionsCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <GlowText fontSize={56} color={T.water}>SOLUTIONS</GlowText>
        <div style={{
          fontFamily: T.mono, fontSize: 44, color: T.gold, marginTop: 10,
          textShadow: `0 0 20px ${T.gold}40`,
        }}>
          c = n / V
        </div>
        <div style={{
          fontFamily: T.mono, fontSize: 32, color: T.primary,
          textShadow: `0 0 15px ${T.primary}30`,
        }}>
          mol/dm{'\u00b3'}
        </div>
        <div style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 10 }}>
          Stoichiometry #6 — Concentration
        </div>
        <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 6 }}>
          Cambridge IGCSE 0620 Chemistry
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
