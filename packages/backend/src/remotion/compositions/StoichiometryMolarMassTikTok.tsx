/**
 * Stoichiometry #2 — Molar Mass in 60 Seconds — TikTok (9:16) v1
 *
 * Chemistry A-Level / IGCSE — Molar mass calculation from the periodic table.
 * Periodic table as a cheat sheet, element masses, compound breakdowns,
 * and the n = m/M formula reveal.
 *
 * Pure CSS motion graphics.
 * 8 scenes, ~69 seconds, 1080x1920.
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
const TOTAL_DURATION_S = 68.82;

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
  carbon: '#22d3ee',
  oxygen: '#ef4444',
  hydrogen: '#a78bfa',
  sulfur: '#fbbf24',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved timestamps ────────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  'cheat': 1.70,
  'twelve': 7.20,
  'add': 17.40,
  'eighteen': 25.30,
  'fortyfour': 34.04,
  'ninetyeight': 47.72,
  'memorise': 51.62,
  'stoichiometry': 65.56,
};

// ── Types ────────────────────────────────────────────────────────────
export interface StoichiometryMolarMassTikTokProps {
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

// Periodic table element card
const ElementCard: React.FC<{
  symbol: string; name: string; mass: number; color: string;
  opacity: number; scale?: number; size?: 'normal' | 'large';
}> = ({ symbol, name, mass, color, opacity, scale = 1, size = 'normal' }) => {
  const isLarge = size === 'large';
  const w = isLarge ? 200 : 160;
  const h = isLarge ? 240 : 190;
  return (
    <div style={{
      opacity, transform: `scale(${scale})`,
      width: w, height: h,
      border: `3px solid ${color}`,
      borderRadius: 16, background: `${color}10`,
      boxShadow: `0 0 30px ${color}25, inset 0 0 20px ${color}08`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      gap: 4,
    }}>
      <div style={{
        fontFamily: T.mono, fontSize: isLarge ? 18 : 14, color: T.textMuted,
      }}>{name}</div>
      <div style={{
        fontFamily: T.font, fontWeight: 900, fontSize: isLarge ? 72 : 56, color,
        textShadow: `0 0 20px ${color}50`,
        lineHeight: 1,
      }}>{symbol}</div>
      <div style={{
        fontFamily: T.mono, fontWeight: 700, fontSize: isLarge ? 32 : 26, color: T.text,
        background: `${color}20`, padding: '4px 16px', borderRadius: 8,
        marginTop: 4,
      }}>{mass}</div>
    </div>
  );
};

// Animated counter that counts up from 0 to target
const AnimatedNumber: React.FC<{
  target: number; startFrame: number; durationFrames?: number;
  color?: string; fontSize?: number; suffix?: string;
}> = ({ target, startFrame, durationFrames = 20, color = T.primary, fontSize = 72, suffix = '' }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const current = Math.round(target * progress);
  return (
    <span style={{
      fontFamily: T.mono, fontWeight: 900, fontSize, color,
      textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30`,
    }}>{current}{suffix}</span>
  );
};

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns slow zoom on hook image
  const hookScale = interpolate(frame, [0, 1.7 * fps], [1.0, 1.1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title flash
  const titleOpacity = interpolate(frame, [6, 18], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleScale = interpolate(frame, [6, 18], [1.3, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtitle
  const subOpacity = interpolate(frame, [20, 35], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <Img src={staticFile('images/stoichiometry/02-molar-mass-hook.png')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 10], [0, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.4)',
      }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          opacity: titleOpacity, transform: `scale(${titleScale})`,
        }}>
          <GlowText fontSize={72} color={T.primary}>MOLAR MASS</GlowText>
        </div>
        <div style={{
          fontFamily: T.font, fontWeight: 600, fontSize: 32, color: T.secondary,
          textShadow: `0 0 20px ${T.secondary}50`,
          opacity: subOpacity, marginTop: 12,
        }}>
          in 60 seconds
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Cheat Sheet ─────────────────────────────────────────────
const CheatSheetScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cheatCue = useCueSpring(ct('cheat'));

  // Periodic table grid zoom-in effect
  const gridScale = interpolate(frame, [0, 60], [0.7, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pulsing glow on select elements
  const pulse = 0.6 + 0.4 * Math.sin(frame / 8);

  // Mini periodic table elements
  const miniElements = [
    { s: 'H', m: 1, r: 0, c: 0, col: T.hydrogen },
    { s: 'He', m: 4, r: 0, c: 7, col: T.textMuted },
    { s: 'Li', m: 7, r: 1, c: 0, col: T.textMuted },
    { s: 'C', m: 12, r: 1, c: 3, col: T.carbon },
    { s: 'N', m: 14, r: 1, c: 4, col: T.textMuted },
    { s: 'O', m: 16, r: 1, c: 5, col: T.oxygen },
    { s: 'Na', m: 23, r: 2, c: 0, col: T.textMuted },
    { s: 'S', m: 32, r: 2, c: 5, col: T.sulfur },
    { s: 'Cl', m: 35.5, r: 2, c: 6, col: T.textMuted },
    { s: 'Ca', m: 40, r: 3, c: 1, col: T.textMuted },
    { s: 'Fe', m: 56, r: 3, c: 7, col: T.textMuted },
  ];

  const highlighted = ['H', 'C', 'O', 'S'];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: cheatCue.opacity, transform: `scale(${cheatCue.scale})` }}>
        <GlowText fontSize={40} color={T.primary}>THE PERIODIC TABLE</GlowText>
        <div style={{ fontFamily: T.font, fontSize: 24, color: T.secondary, textAlign: 'center', marginTop: 6 }}>
          is your cheat sheet
        </div>
      </div>

      {/* Mini periodic table */}
      <div style={{
        opacity: cheatCue.opacity,
        transform: `scale(${gridScale})`,
        position: 'relative', width: 880, height: 500, marginTop: 60,
      }}>
        {miniElements.map((el, i) => {
          const isHighlighted = highlighted.includes(el.s);
          const delay = i * 3;
          const elOpacity = interpolate(frame, [delay, delay + 12], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={el.s} style={{
              position: 'absolute',
              left: el.c * 110, top: el.r * 120,
              width: 100, height: 110,
              border: `2px solid ${isHighlighted ? el.col : `${T.textMuted}40`}`,
              borderRadius: 12,
              background: isHighlighted ? `${el.col}15` : `${T.surface}80`,
              boxShadow: isHighlighted ? `0 0 ${20 * pulse}px ${el.col}40` : 'none',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              opacity: elOpacity,
            }}>
              <div style={{
                fontFamily: T.font, fontWeight: 900, fontSize: 28,
                color: isHighlighted ? el.col : T.textMuted,
              }}>{el.s}</div>
              <div style={{
                fontFamily: T.mono, fontSize: 16, color: T.text,
                fontWeight: isHighlighted ? 700 : 400,
                background: isHighlighted ? `${el.col}20` : 'transparent',
                padding: '2px 8px', borderRadius: 4, marginTop: 4,
              }}>{el.m}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', bottom: 120,
        opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center',
      }}>
        Every element has its <span style={{ color: T.primary, fontWeight: 700 }}>molar mass</span> listed
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Elements ────────────────────────────────────────────────
const ElementsScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const twelveCue = useCueSpring(ct('twelve'));

  // Stagger elements: C appears at cue, O at +1.5s, H at +3s
  const oDelay = ct('twelve') + 1.5;
  const hDelay = ct('twelve') + 3.0;
  const oCue = useCueSpring(oDelay);
  const hCue = useCueSpring(hDelay);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80 }}>
        <GlowText fontSize={36} color={T.textMuted}>KEY ELEMENTS</GlowText>
      </div>

      <div style={{ display: 'flex', gap: 40, alignItems: 'center', marginTop: 20 }}>
        {/* Carbon */}
        <ElementCard
          symbol="C" name="Carbon" mass={12} color={T.carbon}
          opacity={twelveCue.opacity} scale={twelveCue.scale} size="large"
        />
        {/* Oxygen */}
        <ElementCard
          symbol="O" name="Oxygen" mass={16} color={T.oxygen}
          opacity={oCue.opacity} scale={oCue.scale} size="large"
        />
        {/* Hydrogen */}
        <ElementCard
          symbol="H" name="Hydrogen" mass={1} color={T.hydrogen}
          opacity={hCue.opacity} scale={hCue.scale} size="large"
        />
      </div>

      {/* Subtitle: "From the periodic table" */}
      <div style={{
        position: 'absolute', bottom: 180,
        opacity: twelveCue.opacity,
        fontFamily: T.font, fontSize: 26, color: T.textMuted, textAlign: 'center',
      }}>
        Carbon = <span style={{ color: T.carbon, fontWeight: 700 }}>12 g/mol</span>
      </div>
      <div style={{
        position: 'absolute', bottom: 120,
        opacity: oCue.opacity,
        fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center',
      }}>
        These numbers are <span style={{ color: T.primary, fontWeight: 700 }}>all you need</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Compounds Intro (H2O) ──────────────────────────────────
const CompoundsIntroScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const addCue = useCue(ct('add'));
  const eighteenCue = useCueSpring(ct('eighteen'));

  // H2O breakdown animation timing
  const breakdownStart = ct('add') + 0.8;
  const hPart = useCue(breakdownStart, 0.4);
  const plus1 = useCue(breakdownStart + 0.6, 0.3);
  const oPart = useCue(breakdownStart + 1.2, 0.4);
  const equals = useCue(breakdownStart + 1.8, 0.3);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: addCue.opacity }}>
        <GlowText fontSize={38} color={T.success}>JUST ADD THEM UP</GlowText>
      </div>

      {/* H2O formula */}
      <div style={{
        opacity: addCue.opacity,
        fontFamily: T.font, fontWeight: 900, fontSize: 80, color: T.text,
        textShadow: `0 0 40px ${T.primary}30`,
        marginBottom: 50,
      }}>
        H<span style={{ fontSize: 56, position: 'relative', top: 12 }}>2</span>O
      </div>

      {/* Breakdown calculation */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        padding: '30px 60px', border: `2px solid ${T.surface}`, borderRadius: 20,
        background: `${T.surface}60`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* H x 2 */}
          <div style={{
            opacity: hPart.opacity, transform: `translateY(${hPart.translateY}px)`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontFamily: T.font, fontWeight: 800, fontSize: 36, color: T.hydrogen }}>H</span>
            <span style={{ fontFamily: T.mono, fontSize: 28, color: T.textMuted }}>(</span>
            <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 36, color: T.hydrogen }}>1</span>
            <span style={{ fontFamily: T.mono, fontSize: 28, color: T.textMuted }}>x 2)</span>
          </div>

          {/* + */}
          <div style={{ opacity: plus1.opacity, fontFamily: T.font, fontWeight: 700, fontSize: 36, color: T.textMuted }}>+</div>

          {/* O */}
          <div style={{
            opacity: oPart.opacity, transform: `translateY(${oPart.translateY}px)`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontFamily: T.font, fontWeight: 800, fontSize: 36, color: T.oxygen }}>O</span>
            <span style={{ fontFamily: T.mono, fontSize: 28, color: T.textMuted }}>(</span>
            <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 36, color: T.oxygen }}>16</span>
            <span style={{ fontFamily: T.mono, fontSize: 28, color: T.textMuted }}>)</span>
          </div>
        </div>

        {/* = 18 line */}
        <div style={{
          opacity: equals.opacity,
          display: 'flex', alignItems: 'center', gap: 12, marginTop: 10,
        }}>
          <div style={{
            width: 600, height: 2, background: `linear-gradient(90deg, transparent, ${T.primary}, transparent)`,
          }} />
        </div>

        <div style={{
          opacity: eighteenCue.opacity, transform: `scale(${eighteenCue.scale})`,
          display: 'flex', alignItems: 'baseline', gap: 8,
        }}>
          <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 28, color: T.textMuted }}>= 2 + 16 =</span>
          <span style={{
            fontFamily: T.mono, fontWeight: 900, fontSize: 64, color: T.primary,
            textShadow: `0 0 30px ${T.primary}60`,
          }}>18</span>
          <span style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted }}>g/mol</span>
        </div>
      </div>

      <Badge
        label="WATER"
        color={T.primary}
        opacity={eighteenCue.opacity}
        fontSize={20}
      />
    </AbsoluteFill>
  );
};

// ── Scene 5: CO2 Scene ───────────────────────────────────────────────
const CO2Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fortyfourCue = useCueSpring(ct('fortyfour'));

  // Step-by-step breakdown
  const titleFade = useCue(0, 0.4);
  const cPart = useCue(0.5, 0.4);
  const plus = useCue(1.5, 0.3);
  const oPart = useCue(2.5, 0.4);
  const line = useCue(4.0, 0.3);

  // Animated counter
  const counterStart = ct('fortyfour') * fps;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* CO2 formula at top */}
      <div style={{
        position: 'absolute', top: 80, opacity: titleFade.opacity,
      }}>
        <div style={{
          fontFamily: T.font, fontWeight: 900, fontSize: 72, color: T.text,
          textShadow: `0 0 40px ${T.secondary}30`, textAlign: 'center',
        }}>
          CO<span style={{ fontSize: 48, position: 'relative', top: 12 }}>2</span>
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center', marginTop: 4,
        }}>Carbon Dioxide</div>
      </div>

      {/* Calculation box */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        padding: '40px 60px', border: `2px solid ${T.surface}`, borderRadius: 20,
        background: `${T.surface}60`, marginTop: 60,
      }}>
        {/* C part */}
        <div style={{
          opacity: cPart.opacity, transform: `translateY(${cPart.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 12, border: `2px solid ${T.carbon}`,
            background: `${T.carbon}15`, display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: T.font, fontWeight: 900, fontSize: 28, color: T.carbon,
          }}>C</div>
          <span style={{ fontFamily: T.mono, fontSize: 28, color: T.textMuted }}>x 1 =</span>
          <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 36, color: T.carbon }}>12</span>
        </div>

        {/* + */}
        <div style={{ opacity: plus.opacity, fontFamily: T.font, fontWeight: 700, fontSize: 32, color: T.textMuted }}>+</div>

        {/* O x 2 part */}
        <div style={{
          opacity: oPart.opacity, transform: `translateY(${oPart.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 12, border: `2px solid ${T.oxygen}`,
            background: `${T.oxygen}15`, display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: T.font, fontWeight: 900, fontSize: 28, color: T.oxygen,
          }}>O</div>
          <span style={{ fontFamily: T.mono, fontSize: 28, color: T.textMuted }}>x 2 =</span>
          <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 36, color: T.oxygen }}>32</span>
        </div>

        {/* Divider */}
        <div style={{
          opacity: line.opacity,
          width: 500, height: 2, background: `linear-gradient(90deg, transparent, ${T.secondary}, transparent)`,
        }} />

        {/* Total */}
        <div style={{
          opacity: fortyfourCue.opacity, transform: `scale(${fortyfourCue.scale})`,
          display: 'flex', alignItems: 'baseline', gap: 10,
        }}>
          <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 28, color: T.textMuted }}>12 + 32 =</span>
          <AnimatedNumber target={44} startFrame={counterStart} durationFrames={15} color={T.secondary} fontSize={72} />
          <span style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted }}>g/mol</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Sulfuric Acid ───────────────────────────────────────────
const SulfuricScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ninetyeightCue = useCueSpring(ct('ninetyeight'));

  // Staggered appearance of each element row
  const hRow = useCue(0.5, 0.4);
  const sRow = useCue(2.0, 0.4);
  const oRow = useCue(3.5, 0.4);
  const divider = useCue(5.5, 0.3);

  // Counter start
  const counterStart = ct('ninetyeight') * fps;

  // Dramatic border glow (this is the big one)
  const borderPulse = 0.5 + 0.5 * Math.sin(frame / 6);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Formula at top */}
      <div style={{ position: 'absolute', top: 70 }}>
        <div style={{
          fontFamily: T.font, fontWeight: 900, fontSize: 64, color: T.text,
          textShadow: `0 0 40px ${T.sulfur}30`, textAlign: 'center',
        }}>
          H<span style={{ fontSize: 42, position: 'relative', top: 10 }}>2</span>SO
          <span style={{ fontSize: 42, position: 'relative', top: 10 }}>4</span>
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center', marginTop: 4,
        }}>Sulfuric Acid</div>
        <Badge
          label="THE BIG ONE"
          color={T.warning}
          opacity={1}
          fontSize={18}
        />
      </div>

      {/* Calculation box */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        padding: '30px 50px', borderRadius: 20,
        border: `2px solid ${T.sulfur}${Math.round(borderPulse * 40 + 20).toString(16).padStart(2, '0')}`,
        background: `${T.surface}70`, marginTop: 80,
      }}>
        {/* H x 2 */}
        <div style={{
          opacity: hRow.opacity, transform: `translateY(${hRow.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16, width: 500, justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 10, border: `2px solid ${T.hydrogen}`,
              background: `${T.hydrogen}15`, display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontFamily: T.font, fontWeight: 900, fontSize: 24, color: T.hydrogen,
            }}>H</div>
            <span style={{ fontFamily: T.mono, fontSize: 24, color: T.textMuted }}>x 2</span>
          </div>
          <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 32, color: T.hydrogen }}>2</span>
        </div>

        {/* S x 1 */}
        <div style={{
          opacity: sRow.opacity, transform: `translateY(${sRow.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16, width: 500, justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 10, border: `2px solid ${T.sulfur}`,
              background: `${T.sulfur}15`, display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontFamily: T.font, fontWeight: 900, fontSize: 24, color: T.sulfur,
            }}>S</div>
            <span style={{ fontFamily: T.mono, fontSize: 24, color: T.textMuted }}>x 1</span>
          </div>
          <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 32, color: T.sulfur }}>32</span>
        </div>

        {/* O x 4 */}
        <div style={{
          opacity: oRow.opacity, transform: `translateY(${oRow.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16, width: 500, justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 10, border: `2px solid ${T.oxygen}`,
              background: `${T.oxygen}15`, display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontFamily: T.font, fontWeight: 900, fontSize: 24, color: T.oxygen,
            }}>O</div>
            <span style={{ fontFamily: T.mono, fontSize: 24, color: T.textMuted }}>x 4</span>
          </div>
          <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 32, color: T.oxygen }}>64</span>
        </div>

        {/* Divider */}
        <div style={{
          opacity: divider.opacity,
          width: 500, height: 2, background: `linear-gradient(90deg, transparent, ${T.sulfur}, transparent)`,
          marginTop: 4,
        }} />

        {/* Sum line */}
        <div style={{
          opacity: divider.opacity,
          fontFamily: T.mono, fontSize: 22, color: T.textMuted, textAlign: 'center',
        }}>
          2 + 32 + 64
        </div>

        {/* Total */}
        <div style={{
          opacity: ninetyeightCue.opacity, transform: `scale(${ninetyeightCue.scale})`,
          display: 'flex', alignItems: 'baseline', gap: 10,
        }}>
          <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 28, color: T.textMuted }}>=</span>
          <AnimatedNumber target={98} startFrame={counterStart} durationFrames={20} color={T.sulfur} fontSize={80} />
          <span style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted }}>g/mol</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: Formula Reveal ──────────────────────────────────────────
const FormulaScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const memoriseCue = useCueSpring(ct('memorise'));

  // Formula components fade in sequentially
  const nReveal = useCueSpring(ct('memorise') + 0.3);
  const equalsReveal = useCue(ct('memorise') + 0.8, 0.3);
  const mReveal = useCueSpring(ct('memorise') + 1.2);
  const slashReveal = useCue(ct('memorise') + 1.6, 0.3);
  const bigMReveal = useCueSpring(ct('memorise') + 2.0);

  // Full formula glow pulse after all revealed
  const allRevealed = frame >= (ct('memorise') + 3.0) * fps;
  const glowPulse = allRevealed ? 0.6 + 0.4 * Math.sin(frame / 10) : 0;

  // Label reveals
  const nLabel = useCue(ct('memorise') + 3.5, 0.4);
  const mLabel = useCue(ct('memorise') + 4.5, 0.4);
  const bigMLabel = useCue(ct('memorise') + 5.5, 0.4);

  // Example
  const exampleCue = useCue(ct('memorise') + 7.0, 0.5);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: memoriseCue.opacity, transform: `scale(${memoriseCue.scale})` }}>
        <GlowText fontSize={36} color={T.gold}>MEMORISE THIS</GlowText>
      </div>

      {/* Hero formula */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40,
        padding: '40px 60px', borderRadius: 24,
        border: `3px solid ${T.primary}${Math.round(glowPulse * 60 + 30).toString(16).padStart(2, '0')}`,
        boxShadow: allRevealed ? `0 0 ${40 * glowPulse}px ${T.primary}30, 0 0 ${80 * glowPulse}px ${T.primary}15` : 'none',
        background: `${T.surface}80`,
      }}>
        {/* n */}
        <div style={{
          opacity: nReveal.opacity, transform: `scale(${nReveal.scale})`,
          fontFamily: T.font, fontWeight: 900, fontSize: 100, color: T.primary,
          fontStyle: 'italic',
          textShadow: `0 0 40px ${T.primary}60`,
        }}>n</div>

        {/* = */}
        <div style={{
          opacity: equalsReveal.opacity,
          fontFamily: T.mono, fontWeight: 700, fontSize: 80, color: T.text,
        }}>=</div>

        {/* m / M fraction */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        }}>
          {/* m (numerator) */}
          <div style={{
            opacity: mReveal.opacity, transform: `scale(${mReveal.scale})`,
            fontFamily: T.font, fontWeight: 900, fontSize: 80, color: T.secondary,
            fontStyle: 'italic',
            textShadow: `0 0 30px ${T.secondary}50`,
            lineHeight: 1,
          }}>m</div>

          {/* fraction line */}
          <div style={{
            opacity: slashReveal.opacity,
            width: 120, height: 4,
            background: `linear-gradient(90deg, ${T.primary}, ${T.secondary})`,
            borderRadius: 2, margin: '4px 0',
          }} />

          {/* M (denominator) */}
          <div style={{
            opacity: bigMReveal.opacity, transform: `scale(${bigMReveal.scale})`,
            fontFamily: T.font, fontWeight: 900, fontSize: 80, color: T.gold,
            fontStyle: 'italic',
            textShadow: `0 0 30px ${T.gold}50`,
            lineHeight: 1,
          }}>M</div>
        </div>
      </div>

      {/* Labels */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center',
        padding: '0 50px',
      }}>
        <div style={{
          opacity: nLabel.opacity, transform: `translateY(${nLabel.translateY}px)`,
          fontFamily: T.font, fontSize: 26, color: T.text,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontStyle: 'italic', fontWeight: 800, color: T.primary, fontSize: 32 }}>n</span>
          <span style={{ color: T.textMuted }}>=</span>
          <span>number of <span style={{ color: T.primary, fontWeight: 700 }}>moles</span></span>
        </div>
        <div style={{
          opacity: mLabel.opacity, transform: `translateY(${mLabel.translateY}px)`,
          fontFamily: T.font, fontSize: 26, color: T.text,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontStyle: 'italic', fontWeight: 800, color: T.secondary, fontSize: 32 }}>m</span>
          <span style={{ color: T.textMuted }}>=</span>
          <span><span style={{ color: T.secondary, fontWeight: 700 }}>mass</span> in grams</span>
        </div>
        <div style={{
          opacity: bigMLabel.opacity, transform: `translateY(${bigMLabel.translateY}px)`,
          fontFamily: T.font, fontSize: 26, color: T.text,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontStyle: 'italic', fontWeight: 800, color: T.gold, fontSize: 32 }}>M</span>
          <span style={{ color: T.textMuted }}>=</span>
          <span><span style={{ color: T.gold, fontWeight: 700 }}>molar mass</span> (g/mol)</span>
        </div>
      </div>

      {/* Quick example */}
      <div style={{
        opacity: exampleCue.opacity, transform: `translateY(${exampleCue.translateY}px)`,
        position: 'absolute', bottom: 120,
        padding: '16px 36px', borderRadius: 14,
        background: `${T.surface}90`, border: `1px solid ${T.primary}30`,
        fontFamily: T.mono, fontSize: 22, color: T.text, textAlign: 'center',
      }}>
        <span style={{ color: T.textMuted }}>36g of H</span>
        <span style={{ fontSize: 16, position: 'relative', top: 4, color: T.textMuted }}>2</span>
        <span style={{ color: T.textMuted }}>O:  n = 36 / 18 = </span>
        <span style={{ color: T.primary, fontWeight: 700 }}>2 mol</span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA ─────────────────────────────────────────────────────
const CtaScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const stoichCue = useCueSpring(ct('stoichiometry'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  // Recap badges
  const recap1 = useCue(0, 0.3);
  const recap2 = useCue(0.5, 0.3);
  const recap3 = useCue(1.0, 0.3);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        padding: '50px 60px',
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        {/* Recap badges */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Badge label="H2O = 18" color={T.primary} opacity={recap1.opacity} fontSize={20} />
          <Badge label="CO2 = 44" color={T.secondary} opacity={recap2.opacity} fontSize={20} />
          <Badge label="H2SO4 = 98" color={T.sulfur} opacity={recap3.opacity} fontSize={20} />
        </div>

        {/* Foundation statement */}
        <div style={{
          opacity: stoichCue.opacity, transform: `scale(${stoichCue.scale})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <GlowText fontSize={32} color={T.textMuted}>The foundation of</GlowText>
          <GlowText fontSize={52} color={T.gold}>STOICHIOMETRY</GlowText>
        </div>

        {/* Series badge */}
        <Badge
          label="STOICHIOMETRY SERIES #2"
          color={T.secondary}
          opacity={stoichCue.opacity}
          scale={stoichCue.scale}
          fontSize={18}
        />

        {/* Follow CTA */}
        <div style={{
          opacity: stoichCue.opacity,
          fontFamily: T.font, fontWeight: 700, fontSize: 28, color: T.primary,
          textShadow: `0 0 20px ${T.primary}50`,
          marginTop: 10,
        }}>
          Follow for #3
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',       startS: 0,      durationS: 1.70,   Component: HookScene },
  { id: 'cheat',      startS: 1.70,   durationS: 5.50,   Component: CheatSheetScene },
  { id: 'elements',   startS: 7.20,   durationS: 10.20,  Component: ElementsScene },
  { id: 'compounds',  startS: 17.40,  durationS: 7.90,   Component: CompoundsIntroScene },
  { id: 'co2',        startS: 25.30,  durationS: 8.74,   Component: CO2Scene },
  { id: 'sulfuric',   startS: 34.04,  durationS: 13.68,  Component: SulfuricScene },
  { id: 'formula',    startS: 47.72,  durationS: 17.84,  Component: FormulaScene },
  { id: 'cta',        startS: 65.56,  durationS: 3.26,   Component: CtaScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const StoichiometryMolarMassTikTok: React.FC<StoichiometryMolarMassTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/stoichiometry/02-molar-mass-narration.mp3')} volume={1} />
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

// ── Progress Bar ─────────────────────────────────────────────────────
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

// ── Duration Export ──────────────────────────────────────────────────
export function getStoichiometryMolarMassDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

// ── Cover Export ─────────────────────────────────────────────────────
export const StoichiometryMolarMassCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/stoichiometry/02-molar-mass-hook.png')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.4, filter: 'brightness(0.5)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={56} color={T.primary}>MOLAR MASS</GlowText>
      <div style={{ fontFamily: T.font, fontSize: 28, color: T.secondary, marginTop: 10 }}>
        in 60 Seconds
      </div>
      <Badge label="STOICHIOMETRY #2" color={T.gold} opacity={1} fontSize={20} />
    </AbsoluteFill>
  </AbsoluteFill>
);
