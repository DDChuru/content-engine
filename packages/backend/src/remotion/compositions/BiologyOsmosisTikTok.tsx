/**
 * Osmosis — TikTok (9:16) v1
 *
 * Cambridge 9700 Topic 4.2 — Osmosis, lysis, crenation, plasmolysis.
 * Pure CSS motion graphics — animated cells, water arrows, potato graph.
 *
 * 8 scenes, ~97 seconds, 1080×1920.
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

const FPS = 30;
const TOTAL_DURATION_S = 97;

const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00d9ff',
  success: '#22c55e',
  accent: '#c084fc',
  danger: '#ef4444',
  gold: '#fbbf24',
  warning: '#f59e0b',
  water: '#38bdf8',
  cell: '#f472b6',
  plant: '#4ade80',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map ──────────────────────────────────────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  'red-blood-cell': 1.74,
  'explodes': 4.08,
  'osmosis-def': 5.62,
  'net-movement': 9.44,
  'water-potential': 13.84,
  'partially-permeable': 17.34,
  'not-dilute': 20.40,
  'three-solutions': 25.52,
  'hypotonic': 27.54,
  'water-in': 33.84,
  'lysis': 38.50,
  'turgid': 43.64,
  'isotonic': 46.34,
  'no-net': 52.14,
  'hypertonic': 52.96,   // manually corrected (Whisper said "Hypotonic")
  'water-out': 57.86,
  'crenation': 59.62,
  'plasmolysis': 64.78,
  'potato': 68.08,
  'mass-change': 70.22,
  'crosses-zero': 75.98,
  'kilopascals': 84.08,
  'pure-water-zero': 87.38,  // manually corrected
  'more-negative': 89.70,
  'lysis-crenation-plasmolysis': 91.10,
  'six-marks': 96.30,
};

export interface BiologyOsmosisTikTokProps {
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

// ── Cell Component ───────────────────────────────────────────────────
const CellShape: React.FC<{
  size: number; scaleX?: number; scaleY?: number; color: string;
  showWall?: boolean; isLysed?: boolean; label?: string; opacity?: number;
}> = ({ size, scaleX = 1, scaleY = 1, color, showWall, isLysed, label, opacity = 1 }) => (
  <div style={{
    opacity,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  }}>
    <div style={{ position: 'relative' }}>
      {showWall && (
        <div style={{
          width: size + 16, height: size + 16, borderRadius: 8,
          border: `3px solid ${T.plant}`, position: 'absolute',
          top: -8, left: -8,
        }} />
      )}
      <div style={{
        width: size, height: size,
        transform: `scale(${scaleX}, ${scaleY})`,
        borderRadius: isLysed ? '30%' : '50%',
        background: `${color}30`,
        border: `3px solid ${color}`,
        boxShadow: isLysed ? `0 0 40px ${T.danger}60` : `0 0 20px ${color}30`,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        {isLysed && (
          <div style={{ fontFamily: T.font, fontSize: 28, color: T.danger, fontWeight: 800 }}>
            💥
          </div>
        )}
      </div>
    </div>
    {label && (
      <div style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted, fontWeight: 600 }}>
        {label}
      </div>
    )}
  </div>
);

// Water arrows
const WaterArrows: React.FC<{
  direction: 'in' | 'out'; opacity: number; color?: string;
}> = ({ direction, opacity, color = T.water }) => {
  const frame = useCurrentFrame();
  const offset = (frame % 30) / 30 * 20;
  const arrows = direction === 'in' ? ['→', '→', '→'] : ['←', '←', '←'];
  return (
    <div style={{
      opacity, display: 'flex', flexDirection: 'column', gap: 8,
      transform: `translateX(${direction === 'in' ? -offset : offset}px)`,
    }}>
      {arrows.map((a, i) => (
        <div key={i} style={{
          fontFamily: T.mono, fontSize: 24, color,
          textShadow: `0 0 10px ${color}60`,
        }}>{a} H₂O</div>
      ))}
    </div>
  );
};

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

interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rbcCue = useCue(ct('red-blood-cell'));
  const explodesCue = useCueSpring(ct('explodes'));

  // Cell expanding then bursting
  const cellScale = explodesCue.isActive
    ? interpolate(frame - ct('explodes') * fps, [0, 10, 15], [1, 1.4, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(frame - ct('red-blood-cell') * fps, [0, 30], [0.8, 1.1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const burstParticles = explodesCue.isActive && frame - ct('explodes') * fps > 10;

  const hookScale = interpolate(frame, [0, 5 * fps], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image — microscope cell */}
      <Img src={staticFile('images/biology/osmosis/hook-cell-burst.jpg')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 15], [0, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.4)',
      }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <GlowText fontSize={52} color={T.danger} style={{
          opacity: explodesCue.opacity, transform: `scale(${explodesCue.scale})`,
        }}>
          IT EXPLODES
        </GlowText>
        <div style={{
          fontFamily: T.font, fontSize: 24, color: T.textMuted,
          opacity: explodesCue.opacity, marginTop: 12,
        }}>
          That's osmosis — and it can kill cells
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Definition ──────────────────────────────────────────────
const DefinitionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const netCue = useCue(ct('net-movement'));
  const wpCue = useCue(ct('water-potential'));
  const ppCue = useCue(ct('partially-permeable'));
  const notCue = useCueSpring(ct('not-dilute'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 50px' }}>
        <GlowText fontSize={38} color={T.water}>OSMOSIS</GlowText>

        <div style={{
          opacity: netCue.opacity, transform: `translateY(${netCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center', lineHeight: 1.6,
          padding: '16px 24px', background: `${T.water}08`, borderRadius: 12,
          borderLeft: `4px solid ${T.water}`,
        }}>
          The <span style={{ color: T.water, fontWeight: 700 }}>net movement</span> of water molecules
        </div>

        <div style={{
          opacity: wpCue.opacity, transform: `translateY(${wpCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center', lineHeight: 1.6,
          padding: '16px 24px', background: `${T.primary}08`, borderRadius: 12,
          borderLeft: `4px solid ${T.primary}`,
        }}>
          From <span style={{ color: T.primary, fontWeight: 700 }}>higher water potential</span> to{' '}
          <span style={{ color: T.accent, fontWeight: 700 }}>lower water potential</span>
        </div>

        <div style={{
          opacity: ppCue.opacity, transform: `translateY(${ppCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '16px 24px', background: `${T.success}08`, borderRadius: 12,
          borderLeft: `4px solid ${T.success}`,
        }}>
          Through a <span style={{ color: T.success, fontWeight: 700 }}>partially permeable membrane</span>
        </div>

        <div style={{
          opacity: notCue.opacity, transform: `scale(${notCue.scale})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 10,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 22, color: T.danger,
            textDecoration: 'line-through',
          }}>
            "From dilute to concentrated"
          </div>
          <Badge label="SAY WATER POTENTIAL" color={T.gold} opacity={1} fontSize={20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Hypotonic ───────────────────────────────────────────────
const HypotonicScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hypoCue = useCue(ct('hypotonic'));
  const waterInCue = useCue(ct('water-in'));
  const lysisCue = useCueSpring(ct('lysis'));
  const turgidCue = useCue(ct('turgid'));

  // Cell swelling
  const swellScale = waterInCue.isActive
    ? interpolate(frame - ct('water-in') * fps, [0, 40], [1, 1.35],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: hypoCue.opacity }}>
        <GlowText fontSize={36} color={T.water}>HYPOTONIC</GlowText>
        <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, textAlign: 'center' }}>
          More water outside than inside
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 20 }}>
        <WaterArrows direction="in" opacity={waterInCue.opacity} />
        <div style={{ transform: `scale(${swellScale})` }}>
          <CellShape size={140} color={T.cell}
            isLysed={lysisCue.isActive} opacity={hypoCue.opacity}
            label="Animal cell" />
        </div>
        <WaterArrows direction="in" opacity={waterInCue.opacity} />
      </div>

      <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
        <div style={{
          opacity: lysisCue.opacity, transform: `scale(${lysisCue.scale})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <GlowText fontSize={36} color={T.danger}>LYSIS</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted }}>Cell bursts 💥</div>
        </div>
        <div style={{
          opacity: turgidCue.opacity, transform: `translateY(${turgidCue.translateY}px)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <CellShape size={80} color={T.plant} showWall opacity={1} />
          <GlowText fontSize={28} color={T.plant}>TURGID</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted }}>
            Cell wall saves it
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Isotonic ────────────────────────────────────────────────
const IsotonicScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const isoCue = useCue(ct('isotonic'));
  const normalCue = useCue(ct('no-net'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ opacity: isoCue.opacity }}>
          <GlowText fontSize={38} color={T.success}>ISOTONIC</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, textAlign: 'center' }}>
            Equal water potential inside and out
          </div>
        </div>

        <div style={{ opacity: normalCue.opacity, transform: `translateY(${normalCue.translateY}px)` }}>
          <CellShape size={140} color={T.success} label="Normal" />
        </div>

        <Badge label="NO NET MOVEMENT" color={T.success} opacity={normalCue.opacity} fontSize={24} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Hypertonic ──────────────────────────────────────────────
const HypertonicScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hyperCue = useCue(ct('hypertonic'));
  const waterOutCue = useCue(ct('water-out'));
  const crenCue = useCueSpring(ct('crenation'));
  const plasmCue = useCueSpring(ct('plasmolysis'));

  // Cell shrinking
  const shrinkScale = waterOutCue.isActive
    ? interpolate(frame - ct('water-out') * fps, [0, 30], [1, 0.7],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: hyperCue.opacity }}>
        <GlowText fontSize={36} color={T.accent}>HYPERTONIC</GlowText>
        <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, textAlign: 'center' }}>
          Less water outside — water moves OUT
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 20 }}>
        <WaterArrows direction="out" opacity={waterOutCue.opacity} />
        <div style={{ transform: `scale(${shrinkScale})` }}>
          <CellShape size={140} color={T.cell} scaleX={shrinkScale < 0.85 ? 0.8 : 1}
            opacity={hyperCue.opacity} label="Animal cell" />
        </div>
        <WaterArrows direction="out" opacity={waterOutCue.opacity} />
      </div>

      <div style={{ display: 'flex', gap: 50, marginTop: 40 }}>
        <div style={{
          opacity: crenCue.opacity, transform: `scale(${crenCue.scale})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <GlowText fontSize={32} color={T.danger}>CRENATION</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted }}>Shrinks & wrinkles</div>
        </div>
        <div style={{
          opacity: plasmCue.opacity, transform: `scale(${plasmCue.scale})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <GlowText fontSize={32} color={T.accent}>PLASMOLYSIS</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 18, color: T.textMuted }}>
            Membrane pulls from wall
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Potato Experiment ───────────────────────────────────────
const PotatoScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const potatoCue = useCue(ct('potato'));
  const massCue = useCue(ct('mass-change'));
  const zeroCue = useCueSpring(ct('crosses-zero'));

  // Graph drawing
  const graphProgress = massCue.isActive
    ? interpolate(frame - ct('mass-change') * fps, [0, 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: potatoCue.opacity }}>
        <GlowText fontSize={34} color={T.gold}>THE POTATO EXPERIMENT</GlowText>
        <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, textAlign: 'center' }}>
          Classic exam question 🥔
        </div>
      </div>

      {/* Graph */}
      <div style={{ width: 800, height: 380, position: 'relative', marginTop: 60 }}>
        <svg width={800} height={380} style={{ opacity: massCue.opacity }}>
          {/* Axes */}
          <line x1={100} y1={190} x2={750} y2={190} stroke={T.textMuted} strokeWidth={2} />
          <line x1={100} y1={40} x2={100} y2={340} stroke={T.textMuted} strokeWidth={2} />
          <text x={400} y={375} fontFamily={T.font} fontSize={16} fill={T.textMuted} textAnchor="middle">
            Sucrose concentration →
          </text>
          <text x={50} y={195} fontFamily={T.font} fontSize={16} fill={T.textMuted} textAnchor="middle">
            % mass
          </text>
          <text x={50} y={210} fontFamily={T.font} fontSize={16} fill={T.textMuted} textAnchor="middle">
            change
          </text>

          {/* Line going from +gain to -loss */}
          <clipPath id="potatoClip">
            <rect x={100} y={0} width={650 * graphProgress} height={380} />
          </clipPath>
          <path
            d="M 120 80 Q 250 120 400 190 Q 550 260 720 300"
            fill="none" stroke={T.primary} strokeWidth={4}
            clipPath="url(#potatoClip)"
          />

          {/* Zero crossing point */}
          {zeroCue.isActive && (
            <>
              <circle cx={400} cy={190} r={10} fill={T.gold} />
              <line x1={400} y1={40} x2={400} y2={340} stroke={T.gold} strokeWidth={2} strokeDasharray="6 4" />
              <text x={400} y={30} fontFamily={T.font} fontSize={18} fill={T.gold} textAnchor="middle" fontWeight={700}>
                ISOTONIC POINT
              </text>
            </>
          )}

          {/* Labels */}
          <text x={180} y={70} fontFamily={T.font} fontSize={16} fill={T.success}>+ Gain mass</text>
          <text x={600} y={320} fontFamily={T.font} fontSize={16} fill={T.danger}>- Lose mass</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: Water Potential ─────────────────────────────────────────
const WaterPotentialScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const kpaCue = useCue(ct('kilopascals'));
  const zeroCue = useCue(ct('pure-water-zero'));
  const negCue = useCueSpring(ct('more-negative'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <GlowText fontSize={36} color={T.water} style={{ opacity: kpaCue.opacity }}>
          WATER POTENTIAL (Ψ)
        </GlowText>

        <div style={{
          opacity: kpaCue.opacity, transform: `translateY(${kpaCue.translateY}px)`,
          fontFamily: T.font, fontSize: 24, color: T.textMuted,
        }}>
          Measured in <span style={{ color: T.primary, fontWeight: 700 }}>kilopascals (kPa)</span>
        </div>

        {/* Scale visual */}
        <div style={{
          opacity: zeroCue.opacity,
          width: 700, height: 80, position: 'relative',
          background: `linear-gradient(90deg, ${T.danger}30, ${T.primary}30, ${T.success}00)`,
          borderRadius: 12, display: 'flex', alignItems: 'center',
          border: `1px solid ${T.textMuted}30`,
        }}>
          {/* Zero marker */}
          <div style={{
            position: 'absolute', right: 20, top: -28,
            fontFamily: T.mono, fontSize: 20, color: T.gold, fontWeight: 800,
          }}>0 kPa</div>
          <div style={{
            position: 'absolute', right: 20, top: 0, bottom: 0, width: 3,
            background: T.gold,
          }} />
          <div style={{
            position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
            fontFamily: T.mono, fontSize: 18, color: T.danger,
          }}>← More negative</div>
        </div>

        <div style={{
          opacity: zeroCue.opacity, transform: `translateY(${zeroCue.translateY}px)`,
          fontFamily: T.font, fontSize: 24, color: T.text, textAlign: 'center',
          padding: '12px 24px', background: `${T.gold}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.gold}`,
        }}>
          Pure water = <span style={{ color: T.gold, fontWeight: 800 }}>0 kPa</span>
        </div>

        <div style={{
          opacity: negCue.opacity, transform: `scale(${negCue.scale})`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '12px 24px', background: `${T.danger}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.danger}`,
        }}>
          Adding solute → <span style={{ color: T.danger, fontWeight: 700 }}>more negative</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA ─────────────────────────────────────────────────────
const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const lysisCue = useCueSpring(ct('lysis-crenation-plasmolysis'));
  const sixCue = useCueSpring(ct('six-marks'));
  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        padding: 50,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        <div style={{
          opacity: lysisCue.opacity, transform: `scale(${lysisCue.scale})`,
          display: 'flex', gap: 24,
        }}>
          <Badge label="LYSIS" color={T.danger} opacity={1} fontSize={26} />
          <Badge label="CRENATION" color={T.accent} opacity={1} fontSize={26} />
          <Badge label="PLASMOLYSIS" color={T.plant} opacity={1} fontSize={26} />
        </div>
        <div style={{
          opacity: sixCue.opacity, transform: `scale(${sixCue.scale})`,
        }}>
          <GlowText fontSize={42} color={T.gold}>KNOW ALL THREE</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted, textAlign: 'center', marginTop: 8 }}>
            That's your <span style={{ color: T.gold, fontWeight: 800 }}>6 marks</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',             startS: 0,     durationS: 5.62,  Component: HookScene },
  { id: 'definition',       startS: 5.62,  durationS: 21.90, Component: DefinitionScene },
  { id: 'hypotonic',        startS: 27.52, durationS: 18.82, Component: HypotonicScene },
  { id: 'isotonic',         startS: 46.34, durationS: 6.62,  Component: IsotonicScene },
  { id: 'hypertonic',       startS: 52.96, durationS: 15.12, Component: HypertonicScene },
  { id: 'potato',           startS: 68.08, durationS: 16.00, Component: PotatoScene },
  { id: 'water-potential',  startS: 84.08, durationS: 7.02,  Component: WaterPotentialScene },
  { id: 'cta',              startS: 91.10, durationS: 6.10,  Component: CTAScene },
];

export const BiologyOsmosisTikTok: React.FC<BiologyOsmosisTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/biology/osmosis-narration.mp3')} volume={1} />
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
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `${T.text}10` }}>
      <div style={{ height: '100%', width: `${(frame / durationInFrames) * 100}%`,
        background: `linear-gradient(90deg, ${T.water}, ${T.cell})`, borderRadius: 2 }} />
    </div>
  );
};

export function getBiologyOsmosisDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const BiologyOsmosisCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/biology/osmosis/cover-osmosis.jpg')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.45, filter: 'brightness(0.5)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={52} color={T.danger}>WATCH IT</GlowText>
      <GlowText fontSize={52} color={T.danger}>EXPLODE</GlowText>
      <div style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20 }}>
        Osmosis — Lysis, Crenation, Plasmolysis
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.water}80`, marginTop: 10 }}>
        Cambridge 9700 · Topic 4.2
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
