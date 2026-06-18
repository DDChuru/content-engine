/**
 * Stoichiometry #7 — "Gas Volumes & Avogadro" TikTok (9:16) v1
 *
 * Cambridge IGCSE / AS Chemistry — Avogadro's law, molar gas volume,
 * V=n×24 formula, worked examples, three-formula connection.
 *
 * Pure CSS motion graphics.
 * 8 scenes, ~77 seconds, 1080x1920.
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
const TOTAL_DURATION_S = 77.23;

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
  oxygen: '#ef4444',
  nitrogen: '#6366f1',
  carbon: '#4ade80',
  hydrogen: '#38bdf8',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved timestamps ────────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  'same':      2.78,     // same volume concept
  'any':       5.56,     // any gas — 24dm³ at RTP
  'formula':  22.00,     // V = n × 24
  'example':  31.50,     // example 1: 0.5 mol O₂
  'twelve':   40.56,     // answer: 12 dm³
  'six':      45.78,     // example 2: 6 dm³ CO₂
  'eleven':   59.60,     // answer: 11 g
  'connects': 61.26,     // three formulas connection
};

// ── Types ────────────────────────────────────────────────────────────
export interface StoichiometryGasVolumesTikTokProps {
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

// Gas container (cylindrical beaker shape)
const GasContainer: React.FC<{
  label: string; formula: string; color: string;
  opacity: number; scale?: number; width?: number; height?: number;
}> = ({ label, formula, color, opacity, scale = 1, width = 140, height = 180 }) => {
  const frame = useCurrentFrame();
  // Subtle gas particle movement inside
  const drift1 = Math.sin(frame / 12) * 8;
  const drift2 = Math.cos(frame / 15) * 6;
  const drift3 = Math.sin(frame / 18 + 2) * 7;

  return (
    <div style={{
      opacity, transform: `scale(${scale})`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    }}>
      <div style={{
        width, height, borderRadius: '12px 12px 20px 20px',
        border: `2px solid ${color}50`, background: `${color}08`,
        position: 'relative', overflow: 'hidden',
        boxShadow: `0 0 20px ${color}15, inset 0 0 15px ${color}08`,
      }}>
        {/* Gas particles floating inside */}
        {[drift1, drift2, drift3].map((d, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 20 + i * 35 + d,
            top: 30 + i * 40 + Math.cos(d) * 10,
            width: 10, height: 10, borderRadius: '50%',
            background: `${color}50`,
            boxShadow: `0 0 8px ${color}40`,
          }} />
        ))}
        {/* Formula label centered */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontFamily: T.mono, fontSize: 28, fontWeight: 900, color,
          textShadow: `0 0 20px ${color}50`,
        }}>{formula}</div>
      </div>
      <div style={{
        fontFamily: T.font, fontSize: 16, color: T.textMuted, fontWeight: 600,
      }}>{label}</div>
    </div>
  );
};

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook (0–2.8s) ──────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns slow zoom on hook image
  const hookScale = interpolate(frame, [0, 2.8 * fps], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title fade in
  const titleOpacity = interpolate(frame, [8, 30], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleScale = interpolate(frame, [8, 30], [0.9, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtitle delayed
  const subOpacity = interpolate(frame, [35, 55], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image */}
      <Img src={staticFile('images/stoichiometry/07-gas-volumes-hook.png')} style={{
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
          opacity: titleOpacity, transform: `scale(${titleScale})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.font, fontWeight: 400, fontSize: 28, color: T.textMuted,
          }}>
            Every gas, same deal...
          </div>

          <GlowText fontSize={64} color={T.primary}>
            GAS VOLUMES
          </GlowText>

          <div style={{
            fontFamily: T.mono, fontSize: 22, color: `${T.gold}90`,
            opacity: subOpacity,
          }}>
            Avogadro's Law
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Same Volume (2.8–5.6s) ────────────────────────────────
const SameVolumeScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const sameCue = useCueSpring(ct('same'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <Particle
          key={i}
          x={60 + (i * 67) % 960}
          y={200 + (i * 97) % 1500}
          size={4 + (i % 3) * 2}
          color={i % 2 === 0 ? T.primary : T.accent}
          delay={i * 0.6}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: sameCue.opacity, transform: `scale(${sameCue.scale})` }}>
          <GlowText fontSize={38} color={T.gold}>SAME VOLUME</GlowText>
        </div>

        {/* Three equal containers side by side */}
        <div style={{
          display: 'flex', gap: 30, alignItems: 'flex-end',
          opacity: sameCue.opacity,
        }}>
          <GasContainer label="Hydrogen" formula="H\u2082" color={T.hydrogen} opacity={sameCue.opacity} scale={sameCue.scale} />
          <GasContainer label="Oxygen" formula="O\u2082" color={T.oxygen} opacity={sameCue.opacity} scale={sameCue.scale} />
          <GasContainer label="CO\u2082" formula="CO\u2082" color={T.carbon} opacity={sameCue.opacity} scale={sameCue.scale} />
        </div>

        <Badge
          label="1 mol of ANY gas = same volume"
          color={T.primary}
          opacity={sameCue.opacity}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Any Gas — 24 dm³ at RTP (5.6–22s) ─────────────────────
const AnyGasScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anyCue = useCueSpring(ct('any'));

  // Progress for staged reveals
  const revealProgress = anyCue.isActive
    ? interpolate(frame - ct('any') * fps, [0, 120], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Cube rotation illusion
  const cubeRotate = anyCue.isActive
    ? interpolate(frame - ct('any') * fps, [0, 90], [0, 5],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.7 + 0.3 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Particle field */}
      {Array.from({ length: 25 }, (_, i) => (
        <Particle
          key={i}
          x={40 + (i * 43) % 1000}
          y={150 + (i * 79) % 1600}
          size={3 + (i % 4) * 2}
          color={[T.primary, T.gold, T.accent][i % 3]}
          delay={i * 0.4}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 35,
      }}>
        <div style={{ opacity: anyCue.opacity, transform: `scale(${anyCue.scale})` }}>
          <GlowText fontSize={36} color={T.primary}>MOLAR GAS VOLUME</GlowText>
        </div>

        {/* Big 24 dm³ cube visual */}
        <div style={{
          opacity: anyCue.opacity,
          transform: `scale(${anyCue.scale}) perspective(800px) rotateY(${cubeRotate}deg)`,
          width: 280, height: 280,
          border: `3px solid ${T.primary}70`,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${T.primary}10, ${T.primary}05)`,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 8,
          boxShadow: `0 0 60px ${T.primary}20, inset 0 0 40px ${T.primary}08`,
          position: 'relative',
        }}>
          {/* Floating gas dots inside cube */}
          {Array.from({ length: 12 }, (_, i) => {
            const dx = Math.sin(frame / 15 + i * 1.3) * 60;
            const dy = Math.cos(frame / 18 + i * 0.9) * 60;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: 140 + dx - 4,
                top: 140 + dy - 4,
                width: 8, height: 8, borderRadius: '50%',
                background: `${[T.hydrogen, T.oxygen, T.carbon, T.nitrogen][i % 4]}50`,
                boxShadow: `0 0 6px ${[T.hydrogen, T.oxygen, T.carbon, T.nitrogen][i % 4]}40`,
              }} />
            );
          })}

          <div style={{
            fontFamily: T.mono, fontSize: 72, fontWeight: 900, color: T.primary,
            textShadow: `0 0 ${40 * pulse}px ${T.primary}80`,
            zIndex: 2,
          }}>24</div>
          <div style={{
            fontFamily: T.font, fontSize: 28, color: T.textMuted, fontWeight: 600,
            zIndex: 2,
          }}>dm{'\u00b3'}</div>
        </div>

        {/* RTP label */}
        <div style={{
          opacity: interpolate(revealProgress, [0.1, 0.3], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <Badge label="at RTP (Room Temperature & Pressure)" color={T.gold} opacity={1} fontSize={20} />
          <div style={{
            fontFamily: T.mono, fontSize: 20, color: T.textMuted,
          }}>25{'\u00b0'}C &nbsp;&nbsp;|&nbsp;&nbsp; 1 atm</div>
        </div>

        {/* STP comparison */}
        <div style={{
          opacity: interpolate(revealProgress, [0.4, 0.65], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          padding: '16px 30px', borderRadius: 16,
          border: `1px solid ${T.accent}30`, background: `${T.accent}08`,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 22, color: T.accent, fontWeight: 700,
          }}>At STP (Standard): <span style={{
            fontFamily: T.mono, color: T.text, fontWeight: 900,
          }}>22.4 dm{'\u00b3'}</span></div>
          <div style={{
            fontFamily: T.mono, fontSize: 18, color: T.textMuted,
          }}>0{'\u00b0'}C &nbsp;&nbsp;|&nbsp;&nbsp; 1 atm</div>
        </div>

        {/* Key insight */}
        <Badge
          label="IGCSE uses 24 dm\u00b3 (RTP)"
          color={T.success}
          opacity={interpolate(revealProgress, [0.7, 0.9], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Formula V = n × 24 (22–31.5s) ─────────────────────────
const FormulaScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const formulaCue = useCueSpring(ct('formula'));

  const buildProgress = formulaCue.isActive
    ? interpolate(frame - ct('formula') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.7 + 0.3 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
      }}>
        <div style={{ opacity: formulaCue.opacity }}>
          <GlowText fontSize={36} color={T.gold}>THE FORMULA</GlowText>
        </div>

        {/* Main formula: V = n × 24 */}
        <div style={{
          opacity: formulaCue.opacity, transform: `scale(${formulaCue.scale})`,
          padding: '30px 60px', borderRadius: 20,
          border: `3px solid ${T.primary}60`,
          background: `linear-gradient(135deg, ${T.primary}10, ${T.surface})`,
          boxShadow: `0 0 60px ${T.primary}${Math.round(pulse * 30 + 10).toString(16).padStart(2, '0')}`,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 64, fontWeight: 900, color: T.text,
            display: 'flex', alignItems: 'baseline', gap: 16,
          }}>
            <span style={{ color: T.primary }}>V</span>
            <span style={{ color: T.textMuted, fontSize: 48 }}>=</span>
            <span style={{ color: T.gold }}>n</span>
            <span style={{ color: T.textMuted, fontSize: 48 }}>{'\u00d7'}</span>
            <span style={{ color: T.success }}>24</span>
          </div>
        </div>

        {/* Labels underneath */}
        <div style={{
          display: 'flex', gap: 50, alignItems: 'center',
          opacity: interpolate(buildProgress, [0.1, 0.35], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontFamily: T.mono, fontSize: 32, color: T.primary, fontWeight: 900 }}>V</div>
            <div style={{ fontFamily: T.font, fontSize: 16, color: T.textMuted }}>Volume (dm{'\u00b3'})</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontFamily: T.mono, fontSize: 32, color: T.gold, fontWeight: 900 }}>n</div>
            <div style={{ fontFamily: T.font, fontSize: 16, color: T.textMuted }}>Moles</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontFamily: T.mono, fontSize: 32, color: T.success, fontWeight: 900 }}>24</div>
            <div style={{ fontFamily: T.font, fontSize: 16, color: T.textMuted }}>dm{'\u00b3'} mol{'\u207b\u00b9'}</div>
          </div>
        </div>

        {/* Rearrangements */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          opacity: interpolate(buildProgress, [0.4, 0.7], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 20, color: T.textMuted, fontWeight: 600,
          }}>Rearranged:</div>
          <div style={{ display: 'flex', gap: 40 }}>
            {/* n = V / 24 */}
            <div style={{
              padding: '12px 24px', borderRadius: 14,
              border: `2px solid ${T.gold}40`, background: `${T.gold}08`,
              fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: T.text,
              opacity: interpolate(buildProgress, [0.45, 0.6], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <span style={{ color: T.gold }}>n</span>
              <span style={{ color: T.textMuted }}> = </span>
              <span style={{ color: T.primary }}>V</span>
              <span style={{ color: T.textMuted }}> / </span>
              <span style={{ color: T.success }}>24</span>
            </div>
            {/* V = n × 24 (already shown, just reinforce) */}
          </div>
        </div>

        <Badge
          label="Works for ANY gas at RTP"
          color={T.primary}
          opacity={interpolate(buildProgress, [0.75, 0.95], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Example 1 — 0.5 mol O₂ → 12 dm³ (31.5–40.6s) ─────────
const Example1Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exCue = useCueSpring(ct('example'));
  const twelveCue = useCue(ct('twelve'));

  const solveProgress = exCue.isActive
    ? interpolate(frame - ct('example') * fps, [0, 120], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        padding: '0 40px',
      }}>
        {/* Example header */}
        <div style={{
          opacity: exCue.opacity, transform: `scale(${exCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            background: `${T.success}20`, border: `2px solid ${T.success}60`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: T.mono, fontSize: 24, fontWeight: 900, color: T.success,
          }}>1</div>
          <GlowText fontSize={36} color={T.success}>EXAMPLE</GlowText>
        </div>

        {/* Question box */}
        <div style={{
          opacity: exCue.opacity,
          padding: '20px 40px', borderRadius: 16,
          border: `2px solid ${T.primary}40`, background: `${T.primary}08`,
          maxWidth: 900, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 26, color: T.text, lineHeight: 1.6,
          }}>
            What volume does <span style={{ color: T.gold, fontWeight: 800 }}>0.5 mol</span> of{' '}
            <span style={{ color: T.oxygen, fontWeight: 800 }}>O{'\u2082'}</span> occupy at RTP?
          </div>
        </div>

        {/* Solution steps */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        }}>
          {/* Step 1: Write formula */}
          <div style={{
            opacity: interpolate(solveProgress, [0.15, 0.35], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            fontFamily: T.mono, fontSize: 36, color: T.text,
            display: 'flex', alignItems: 'baseline', gap: 12,
          }}>
            <span style={{ color: T.primary }}>V</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{ color: T.gold }}>n</span>
            <span style={{ color: T.textMuted }}>{'\u00d7'}</span>
            <span style={{ color: T.success }}>24</span>
          </div>

          {/* Step 2: Substitute */}
          <div style={{
            opacity: interpolate(solveProgress, [0.35, 0.55], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            fontFamily: T.mono, fontSize: 36, color: T.text,
            display: 'flex', alignItems: 'baseline', gap: 12,
          }}>
            <span style={{ color: T.primary }}>V</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{ color: T.gold }}>0.5</span>
            <span style={{ color: T.textMuted }}>{'\u00d7'}</span>
            <span style={{ color: T.success }}>24</span>
          </div>

          {/* Divider */}
          <div style={{
            width: 400, height: 3, borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${T.primary}60, transparent)`,
            opacity: interpolate(solveProgress, [0.55, 0.65], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }} />

          {/* Answer: 12 dm³ */}
          <div style={{
            opacity: twelveCue.opacity,
            fontFamily: T.mono, fontSize: 56, fontWeight: 900,
            display: 'flex', alignItems: 'baseline', gap: 12,
          }}>
            <span style={{ color: T.primary }}>V</span>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{
              color: T.gold,
              textShadow: `0 0 30px ${T.gold}60`,
              fontSize: 72,
            }}>12</span>
            <span style={{ color: T.textMuted, fontSize: 36 }}>dm{'\u00b3'}</span>
          </div>
        </div>

        <Badge
          label="\u2713 Half the moles = half the volume"
          color={T.success}
          opacity={twelveCue.opacity}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Example 2 — CO₂ in 6 dm³ question (40.6–45.8s) ────────
const Example2Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const sixCue = useCueSpring(ct('six'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 12 }, (_, i) => (
        <Particle
          key={i}
          x={70 + (i * 83) % 940}
          y={300 + (i * 131) % 1300}
          size={4 + (i % 3) * 2}
          color={i % 3 === 0 ? T.warning : i % 3 === 1 ? T.carbon : T.primary}
          delay={i * 0.5}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 35,
      }}>
        {/* Example header */}
        <div style={{
          opacity: sixCue.opacity, transform: `scale(${sixCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            background: `${T.warning}20`, border: `2px solid ${T.warning}60`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: T.mono, fontSize: 24, fontWeight: 900, color: T.warning,
          }}>2</div>
          <GlowText fontSize={36} color={T.warning}>HARDER EXAMPLE</GlowText>
        </div>

        {/* Question box */}
        <div style={{
          opacity: sixCue.opacity,
          padding: '24px 40px', borderRadius: 16,
          border: `2px solid ${T.warning}40`, background: `${T.warning}08`,
          maxWidth: 900, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 26, color: T.text, lineHeight: 1.6,
          }}>
            <span style={{ color: T.carbon, fontWeight: 800 }}>CO{'\u2082'}</span> occupies{' '}
            <span style={{ color: T.primary, fontWeight: 800 }}>6 dm{'\u00b3'}</span> at RTP.
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 28, color: T.gold, fontWeight: 800, marginTop: 12,
          }}>
            Find the <span style={{ color: T.danger }}>mass</span>.
          </div>
        </div>

        {/* Gas container visual */}
        <div style={{ opacity: sixCue.opacity, transform: `scale(${sixCue.scale})` }}>
          <GasContainer
            label="6 dm\u00b3 at RTP"
            formula="CO\u2082"
            color={T.carbon}
            opacity={1}
            width={200}
            height={200}
          />
        </div>

        {/* Hint: need 2 steps */}
        <Badge
          label="Step 1: find moles \u2192 Step 2: find mass"
          color={T.accent}
          opacity={sixCue.opacity}
          fontSize={18}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: Example 2 Solve — n=6/24=0.25, mass=0.25×44=11g (45.8–61.3s) ─
const Example2SolveScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Use internal timing (scene-local frame)
  const sceneStart = 0; // ct already offsets
  const solveProgress = interpolate(frame, [0, 300], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const elevenCue = useCue(ct('eleven'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        padding: '0 50px',
      }}>
        {/* Step 1 header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: interpolate(solveProgress, [0, 0.08], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <Badge label="Step 1" color={T.primary} opacity={1} fontSize={18} />
          <div style={{ fontFamily: T.font, fontSize: 22, color: T.textMuted }}>Find moles</div>
        </div>

        {/* n = V / 24 */}
        <div style={{
          opacity: interpolate(solveProgress, [0.05, 0.15], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.mono, fontSize: 34, color: T.text,
          display: 'flex', alignItems: 'baseline', gap: 10,
        }}>
          <span style={{ color: T.gold }}>n</span>
          <span style={{ color: T.textMuted }}>=</span>
          <span style={{ color: T.primary }}>V</span>
          <span style={{ color: T.textMuted }}>/</span>
          <span style={{ color: T.success }}>24</span>
        </div>

        {/* n = 6 / 24 */}
        <div style={{
          opacity: interpolate(solveProgress, [0.15, 0.25], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.mono, fontSize: 34, color: T.text,
          display: 'flex', alignItems: 'baseline', gap: 10,
        }}>
          <span style={{ color: T.gold }}>n</span>
          <span style={{ color: T.textMuted }}>=</span>
          <span style={{ color: T.primary }}>6</span>
          <span style={{ color: T.textMuted }}>/</span>
          <span style={{ color: T.success }}>24</span>
        </div>

        {/* n = 0.25 mol */}
        <div style={{
          opacity: interpolate(solveProgress, [0.25, 0.38], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.mono, fontSize: 44, fontWeight: 900,
          display: 'flex', alignItems: 'baseline', gap: 10,
        }}>
          <span style={{ color: T.gold }}>n</span>
          <span style={{ color: T.textMuted }}>=</span>
          <span style={{
            color: T.gold, textShadow: `0 0 20px ${T.gold}50`,
          }}>0.25</span>
          <span style={{ color: T.textMuted, fontSize: 24 }}>mol</span>
        </div>

        {/* Divider */}
        <div style={{
          width: 500, height: 3, borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${T.warning}60, transparent)`,
          opacity: interpolate(solveProgress, [0.38, 0.45], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }} />

        {/* Step 2 header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: interpolate(solveProgress, [0.42, 0.5], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <Badge label="Step 2" color={T.warning} opacity={1} fontSize={18} />
          <div style={{ fontFamily: T.font, fontSize: 22, color: T.textMuted }}>
            Find mass (M{'\u1d63'} of CO{'\u2082'} = 44)
          </div>
        </div>

        {/* mass = n × M */}
        <div style={{
          opacity: interpolate(solveProgress, [0.5, 0.6], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.mono, fontSize: 34, color: T.text,
          display: 'flex', alignItems: 'baseline', gap: 10,
        }}>
          <span style={{ color: T.danger }}>mass</span>
          <span style={{ color: T.textMuted }}>=</span>
          <span style={{ color: T.gold }}>n</span>
          <span style={{ color: T.textMuted }}>{'\u00d7'}</span>
          <span style={{ color: T.accent }}>M{'\u1d63'}</span>
        </div>

        {/* mass = 0.25 × 44 */}
        <div style={{
          opacity: interpolate(solveProgress, [0.6, 0.72], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.mono, fontSize: 34, color: T.text,
          display: 'flex', alignItems: 'baseline', gap: 10,
        }}>
          <span style={{ color: T.danger }}>mass</span>
          <span style={{ color: T.textMuted }}>=</span>
          <span style={{ color: T.gold }}>0.25</span>
          <span style={{ color: T.textMuted }}>{'\u00d7'}</span>
          <span style={{ color: T.accent }}>44</span>
        </div>

        {/* = 11 g */}
        <div style={{
          opacity: elevenCue.opacity,
          fontFamily: T.mono, fontSize: 60, fontWeight: 900,
          display: 'flex', alignItems: 'baseline', gap: 10,
        }}>
          <span style={{ color: T.danger }}>mass</span>
          <span style={{ color: T.textMuted, fontSize: 40 }}>=</span>
          <span style={{
            color: T.gold,
            textShadow: `0 0 30px ${T.gold}60`,
            fontSize: 76,
          }}>11</span>
          <span style={{ color: T.textMuted, fontSize: 32 }}>g</span>
        </div>

        <Badge
          label="\u2713 Volume \u2192 moles \u2192 mass"
          color={T.success}
          opacity={elevenCue.opacity}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: Connection + CTA (61.3–77.2s) ──────────────────────────
const ConnectionSceneFinal: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const connectsCue = useCueSpring(ct('connects'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  // Stagger the three formulas
  const formula1Opacity = connectsCue.isActive
    ? interpolate(frame - ct('connects') * fps, [0, 20], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const formula2Opacity = connectsCue.isActive
    ? interpolate(frame - ct('connects') * fps, [20, 40], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const formula3Opacity = connectsCue.isActive
    ? interpolate(frame - ct('connects') * fps, [40, 60], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Mole center node pulse
  const molePulse = connectsCue.isActive
    ? 0.9 + 0.1 * Math.sin(frame / 8)
    : 0;

  // Connecting lines draw animation
  const lineProgress = connectsCue.isActive
    ? interpolate(frame - ct('connects') * fps, [60, 100], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // CTA fade in
  const ctaOpacity = connectsCue.isActive
    ? interpolate(frame - ct('connects') * fps, [200, 240], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        padding: '40px 50px',
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        <div style={{ opacity: connectsCue.opacity }}>
          <GlowText fontSize={34} color={T.gold}>THE THREE FORMULAS</GlowText>
        </div>

        {/* Diagram: three formulas around a central "mole" node */}
        <div style={{
          position: 'relative', width: 700, height: 500,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          {/* Central mole node */}
          <div style={{
            opacity: connectsCue.opacity, transform: `scale(${connectsCue.scale * molePulse || connectsCue.scale})`,
            width: 120, height: 120, borderRadius: '50%',
            border: `3px solid ${T.gold}80`,
            background: `radial-gradient(circle, ${T.gold}25, ${T.gold}08)`,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            boxShadow: `0 0 40px ${T.gold}30`,
            zIndex: 2,
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 36, fontWeight: 900, color: T.gold,
            }}>n</div>
            <div style={{
              fontFamily: T.font, fontSize: 14, color: T.textMuted,
            }}>moles</div>
          </div>

          {/* Connecting lines (SVG) */}
          <svg style={{
            position: 'absolute', width: '100%', height: '100%', zIndex: 1,
          }}>
            {/* Line to top (n = m/M) */}
            <line
              x1={350} y1={190} x2={350} y2={60}
              stroke={T.primary}
              strokeWidth={3}
              strokeDasharray={`${lineProgress * 130} 130`}
              opacity={0.7}
            />
            {/* Line to bottom-left (c = n/V) */}
            <line
              x1={310} y1={310} x2={180} y2={430}
              stroke={T.accent}
              strokeWidth={3}
              strokeDasharray={`${lineProgress * 170} 170`}
              opacity={0.7}
            />
            {/* Line to bottom-right (n = V/24) */}
            <line
              x1={390} y1={310} x2={520} y2={430}
              stroke={T.success}
              strokeWidth={3}
              strokeDasharray={`${lineProgress * 170} 170`}
              opacity={0.7}
            />
          </svg>

          {/* Formula 1: n = m / M (top) */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            opacity: formula1Opacity,
            padding: '12px 24px', borderRadius: 14,
            border: `2px solid ${T.primary}50`, background: `${T.primary}10`,
            fontFamily: T.mono, fontSize: 28, fontWeight: 800,
          }}>
            <span style={{ color: T.gold }}>n</span>
            <span style={{ color: T.textMuted }}> = </span>
            <span style={{ color: T.danger }}>m</span>
            <span style={{ color: T.textMuted }}> / </span>
            <span style={{ color: T.primary }}>M</span>
          </div>

          {/* Formula 2: c = n / V (bottom-left) */}
          <div style={{
            position: 'absolute', bottom: 10, left: 30,
            opacity: formula2Opacity,
            padding: '12px 24px', borderRadius: 14,
            border: `2px solid ${T.accent}50`, background: `${T.accent}10`,
            fontFamily: T.mono, fontSize: 28, fontWeight: 800,
          }}>
            <span style={{ color: T.accent }}>c</span>
            <span style={{ color: T.textMuted }}> = </span>
            <span style={{ color: T.gold }}>n</span>
            <span style={{ color: T.textMuted }}> / </span>
            <span style={{ color: T.primary }}>V</span>
          </div>

          {/* Formula 3: n = V / 24 (bottom-right) */}
          <div style={{
            position: 'absolute', bottom: 10, right: 30,
            opacity: formula3Opacity,
            padding: '12px 24px', borderRadius: 14,
            border: `2px solid ${T.success}50`, background: `${T.success}10`,
            fontFamily: T.mono, fontSize: 28, fontWeight: 800,
          }}>
            <span style={{ color: T.gold }}>n</span>
            <span style={{ color: T.textMuted }}> = </span>
            <span style={{ color: T.primary }}>V</span>
            <span style={{ color: T.textMuted }}> / </span>
            <span style={{ color: T.success }}>24</span>
          </div>
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
  { id: 'hook',              startS: 0,     durationS: 2.80,  Component: HookScene },
  { id: 'same-volume',       startS: 2.78,  durationS: 2.82,  Component: SameVolumeScene },
  { id: 'any-gas',           startS: 5.56,  durationS: 16.44, Component: AnyGasScene },
  { id: 'formula',           startS: 22.00, durationS: 9.50,  Component: FormulaScene },
  { id: 'example-1',         startS: 31.50, durationS: 9.10,  Component: Example1Scene },
  { id: 'example-2',         startS: 40.56, durationS: 5.24,  Component: Example2Scene },
  { id: 'example-2-solve',   startS: 45.78, durationS: 15.48, Component: Example2SolveScene },
  { id: 'connection-cta',    startS: 61.26, durationS: 15.97, Component: ConnectionSceneFinal },
];

// ── Main Composition ─────────────────────────────────────────────────
export const StoichiometryGasVolumesTikTok: React.FC<StoichiometryGasVolumesTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/stoichiometry/07-gas-volumes-narration.mp3')} volume={1} />
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

export function getStoichiometryGasVolumesDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const StoichiometryGasVolumesCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/stoichiometry/07-gas-volumes-hook.png')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.45, filter: 'brightness(0.5)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={56} color={T.primary}>GAS VOLUMES</GlowText>
      <div style={{
        fontFamily: T.mono, fontSize: 40, color: T.gold, marginTop: 20,
        textShadow: `0 0 20px ${T.gold}40`,
      }}>
        V = n {'\u00d7'} 24
      </div>
      <div style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20 }}>
        Stoichiometry #7 — Avogadro's Law
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 10 }}>
        Cambridge IGCSE / AS Chemistry
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
