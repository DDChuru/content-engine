/**
 * Autophagy & Autolysis — TikTok (9:16) v1
 *
 * Cambridge 9700 Topic 1 — Self-Digestion
 * Autophagy: selective recycling. Autolysis: total self-destruction.
 * Tadpole tail example.
 *
 * Pure CSS motion graphics — organelle wrapping, lysosome burst, comparison.
 * 8 scenes, ~80 seconds, 1080×1920.
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
const TOTAL_DURATION_S = 88;

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
  autophagy: '#3b82f6',    // Blue — controlled
  autolysis: '#ef4444',    // Red — destructive
  lysosome: '#a855f7',     // Lysosome purple
  recycle: '#22d3ee',      // Cyan — recycling
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved + manually corrected ──────────────────
const DEFAULT_CUES: Record<string, number> = {
  'eat-themselves': 0.88,
  'alive': 4.26,
  'autophagy': 5.54,
  'auto-self': 6.84,
  'phagy-eating': 9.30,
  'damaged': 11.34,
  'double-membrane': 14.28,
  'autophagosome': 16.66,
  'lysosome-fuses': 18.48,    // manually corrected (Whisper split "lysosome")
  'recycled': 27.20,
  'cellular-recycling': 28.82,
  'damaged-mitochondria': 30.74,
  'misfolded': 34.26,
  'starvation': 36.16,
  'autolysis': 42.78,
  'burst': 46.46,
  'flood': 49.24,
  'self-destructs': 54.32,    // manually corrected (Whisper split "self-destructs")
  'tadpole': 59.52,
  'frog': 60.36,
  'programmed': 63.24,
  'distinction': 67.26,
  'selective': 71.16,
  'survives': 73.34,
  'total-destruction': 75.94,
  'dies': 78.80,
  'recycles': 81.40,          // manually corrected (Whisper: "recycled")
  'destroys': 83.36,          // manually corrected (CTA occurrence)
  'guaranteed': 85.48,
};

export interface BiologyAutophagyTikTokProps {
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

interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const eatCue = useCueSpring(ct('eat-themselves'));
  const aliveCue = useCue(ct('alive'));

  const hookScale = interpolate(frame, [0, 5 * 30], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <Img src={staticFile('images/biology/autophagy/hook-self-eat.jpg')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 15], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.35)',
      }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          fontFamily: T.font, fontSize: 26, color: T.textMuted,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          marginBottom: 20,
        }}>
          Your cells eat
        </div>

        <div style={{ opacity: eatCue.opacity, transform: `scale(${eatCue.scale})` }}>
          <GlowText fontSize={80} color={T.danger}>THEMSELVES</GlowText>
        </div>

        <div style={{
          fontFamily: T.font, fontSize: 26, color: T.textMuted,
          opacity: aliveCue.opacity, marginTop: 20,
        }}>
          On purpose. And it <span style={{ color: T.success, fontWeight: 700 }}>keeps you alive</span>.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Autophagy Definition ────────────────────────────────────
const AutophagyDefScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const autoCue = useCue(ct('autophagy'));
  const autoSelfCue = useCue(ct('auto-self'));
  const phagyCue = useCue(ct('phagy-eating'));
  const damagedCue = useCue(ct('damaged'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 50px' }}>
        <div style={{ opacity: autoCue.opacity }}>
          <GlowText fontSize={42} color={T.autophagy}>AUTOPHAGY</GlowText>
        </div>

        <div style={{ display: 'flex', gap: 30, opacity: autoSelfCue.opacity }}>
          <div style={{
            fontFamily: T.mono, fontSize: 22, color: T.autophagy,
            padding: '10px 20px', background: `${T.autophagy}10`, borderRadius: 10,
          }}>
            <span style={{ color: T.gold }}>Auto</span> = self
          </div>
          <div style={{
            fontFamily: T.mono, fontSize: 22, color: T.autophagy,
            padding: '10px 20px', background: `${T.autophagy}10`, borderRadius: 10,
            opacity: phagyCue.opacity,
          }}>
            <span style={{ color: T.gold }}>Phagy</span> = eating
          </div>
        </div>

        <div style={{
          opacity: damagedCue.opacity, transform: `translateY(${damagedCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '14px 24px', background: `${T.autophagy}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.autophagy}`, width: 880,
        }}>
          When an organelle is <span style={{ color: T.danger, fontWeight: 700 }}>damaged or old</span> —
          the cell wraps it in a double membrane
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Autophagy Process ───────────────────────────────────────
const AutophagyProcessScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const membraneCue = useCue(ct('double-membrane'));
  const autophagoCue = useCueSpring(ct('autophagosome'));
  const fuseCue = useCue(ct('lysosome-fuses'));
  const recycleCue = useCueSpring(ct('recycled'));

  // Membrane wrapping animation
  const wrapProgress = interpolate(frame, [0, 60], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Wrapping animation */}
      <svg width={400} height={200} style={{ opacity: membraneCue.opacity, marginBottom: 20 }}>
        {/* Damaged organelle */}
        <ellipse cx={200} cy={100} rx={35} ry={20}
          fill={`${T.danger}30`} stroke={T.danger} strokeWidth={2} strokeDasharray="4,4" />
        <text x={200} y={105} textAnchor="middle"
          fontFamily={T.mono} fontSize={12} fill={T.danger}>damaged</text>
        {/* Double membrane wrapping */}
        <ellipse cx={200} cy={100}
          rx={35 + wrapProgress * 25} ry={20 + wrapProgress * 25}
          fill="none" stroke={T.autophagy} strokeWidth={2}
          opacity={wrapProgress} />
        <ellipse cx={200} cy={100}
          rx={35 + wrapProgress * 35} ry={20 + wrapProgress * 35}
          fill="none" stroke={T.autophagy} strokeWidth={2}
          opacity={wrapProgress * 0.6} strokeDasharray="6,4" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div style={{ opacity: autophagoCue.opacity, transform: `scale(${autophagoCue.scale})` }}>
          <Badge label="AUTOPHAGOSOME" color={T.autophagy} opacity={1} fontSize={24} />
        </div>

        <div style={{
          opacity: fuseCue.opacity, transform: `translateY(${fuseCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '12px 24px', background: `${T.lysosome}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.lysosome}`,
        }}>
          <span style={{ color: T.lysosome, fontWeight: 700 }}>Lysosome fuses</span> →
          hydrolytic enzymes break it down
        </div>

        <div style={{ opacity: recycleCue.opacity, transform: `scale(${recycleCue.scale})`, marginTop: 10 }}>
          <Badge label="♻️ AMINO ACIDS + FATTY ACIDS RECYCLED" color={T.recycle} opacity={1} fontSize={20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Why Autophagy Matters ───────────────────────────────────
const WhyMattersScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const recyclingCue = useCue(ct('cellular-recycling'));
  const mitoCue = useCue(ct('damaged-mitochondria'));
  const misfoldedCue = useCue(ct('misfolded'));
  const starveCue = useCue(ct('starvation'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: recyclingCue.opacity, marginBottom: 20 }}>
        <GlowText fontSize={32} color={T.recycle}>CELLULAR RECYCLING</GlowText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
        <div style={{
          opacity: mitoCue.opacity, transform: `translateY(${mitoCue.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '14px 24px', background: `${T.danger}08`,
          borderLeft: `4px solid ${T.danger}`, borderRadius: 12, width: 880,
        }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>⚠️</div>
          <div style={{ fontFamily: T.font, fontSize: 22, color: T.text }}>
            Removes <span style={{ color: T.danger, fontWeight: 700 }}>damaged mitochondria</span> before they leak harmful molecules
          </div>
        </div>

        <div style={{
          opacity: misfoldedCue.opacity, transform: `translateY(${misfoldedCue.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '14px 24px', background: `${T.accent}08`,
          borderLeft: `4px solid ${T.accent}`, borderRadius: 12, width: 880,
        }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>🧬</div>
          <div style={{ fontFamily: T.font, fontSize: 22, color: T.text }}>
            Clears <span style={{ color: T.accent, fontWeight: 700 }}>misfolded proteins</span>
          </div>
        </div>

        <div style={{
          opacity: starveCue.opacity, transform: `translateY(${starveCue.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '14px 24px', background: `${T.warning}08`,
          borderLeft: `4px solid ${T.warning}`, borderRadius: 12, width: 880,
        }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>🔋</div>
          <div style={{ fontFamily: T.font, fontSize: 22, color: T.text }}>
            During <span style={{ color: T.warning, fontWeight: 700 }}>starvation</span> — digests own components for energy
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Autolysis ───────────────────────────────────────────────
const AutolysisScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const autolysisCue = useCue(ct('autolysis'));
  const burstCue = useCueSpring(ct('burst'));
  const floodCue = useCue(ct('flood'));
  const destructCue = useCueSpring(ct('self-destructs'));

  // Burst particles
  const burstRadius = interpolate(frame, [30, 60], [0, 150],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: autolysisCue.opacity, marginBottom: 10 }}>
        <GlowText fontSize={38} color={T.autolysis}>AUTOLYSIS</GlowText>
        <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, textAlign: 'center', marginTop: 8 }}>
          The destructive version
        </div>
      </div>

      {/* Burst animation */}
      <div style={{ position: 'relative', width: 300, height: 200, opacity: burstCue.opacity }}>
        {/* Lysosome */}
        <div style={{
          position: 'absolute', left: 120, top: 70,
          width: 60, height: 60, borderRadius: '50%',
          background: `${T.lysosome}30`, border: `3px solid ${T.lysosome}`,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontFamily: T.mono, fontSize: 12, color: T.lysosome,
          transform: `scale(${burstCue.scale})`,
        }}>LYSO</div>
        {/* Burst particles */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: 145 + Math.cos(angle) * burstRadius,
              top: 95 + Math.sin(angle) * burstRadius,
              width: 8, height: 8, borderRadius: '50%',
              background: T.danger,
              opacity: floodCue.isActive ? 0.8 : 0,
              boxShadow: `0 0 8px ${T.danger}60`,
            }} />
          );
        })}
      </div>

      <div style={{
        opacity: floodCue.opacity, transform: `translateY(${floodCue.translateY}px)`,
        fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
        padding: '12px 24px', background: `${T.danger}10`, borderRadius: 12,
        borderLeft: `4px solid ${T.danger}`, marginTop: 10,
      }}>
        Enzymes <span style={{ color: T.danger, fontWeight: 700 }}>flood the cytoplasm</span> — digest EVERYTHING
      </div>

      <div style={{ opacity: destructCue.opacity, transform: `scale(${destructCue.scale})`, marginTop: 16 }}>
        <Badge label="CELL SELF-DESTRUCTS" color={T.autolysis} opacity={1} fontSize={24} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Tadpole Example ─────────────────────────────────────────
const TadpoleScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const tadpoleCue = useCue(ct('tadpole'));
  const frogCue = useCue(ct('frog'));
  const programmedCue = useCueSpring(ct('programmed'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: tadpoleCue.opacity, marginBottom: 20 }}>
        <GlowText fontSize={30} color={T.gold}>CLASSIC EXAM EXAMPLE</GlowText>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 40, opacity: tadpoleCue.opacity }}>
        {/* Tadpole */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{ fontSize: 80 }}>🐸</div>
          <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted }}>Tadpole</div>
          <div style={{
            fontFamily: T.font, fontSize: 18, color: T.danger,
            padding: '4px 12px', background: `${T.danger}15`, borderRadius: 6,
          }}>has tail</div>
        </div>

        {/* Arrow */}
        <div style={{
          opacity: frogCue.opacity,
          fontFamily: T.mono, fontSize: 36, color: T.gold,
        }}>→</div>

        {/* Frog */}
        <div style={{
          opacity: frogCue.opacity,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{ fontSize: 80 }}>🐸</div>
          <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted }}>Frog</div>
          <div style={{
            fontFamily: T.font, fontSize: 18, color: T.success,
            padding: '4px 12px', background: `${T.success}15`, borderRadius: 6,
          }}>no tail</div>
        </div>
      </div>

      <div style={{
        opacity: frogCue.opacity, marginTop: 20,
        fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
        padding: '14px 24px', background: `${T.autolysis}10`, borderRadius: 12,
        borderLeft: `4px solid ${T.autolysis}`,
      }}>
        <span style={{ color: T.autolysis, fontWeight: 700 }}>Autolysis destroys</span> the tail cells
      </div>

      <div style={{ opacity: programmedCue.opacity, transform: `scale(${programmedCue.scale})`, marginTop: 16 }}>
        <Badge label="PROGRAMMED CELL DEATH" color={T.accent} opacity={1} fontSize={22} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: Distinction ─────────────────────────────────────────────
const DistinctionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const distCue = useCue(ct('distinction'));
  const selectiveCue = useCue(ct('selective'));
  const survivesCue = useCueSpring(ct('survives'));
  const totalCue = useCue(ct('total-destruction'));
  const diesCue = useCueSpring(ct('dies'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: distCue.opacity, marginBottom: 30 }}>
        <GlowText fontSize={30} color={T.gold}>THE EXAM DISTINCTION</GlowText>
      </div>

      <div style={{ display: 'flex', gap: 30, alignItems: 'stretch' }}>
        {/* Autophagy */}
        <div style={{
          opacity: selectiveCue.opacity,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          padding: '24px 30px', background: `${T.autophagy}08`,
          border: `2px solid ${T.autophagy}40`, borderRadius: 16, width: 420,
        }}>
          <GlowText fontSize={28} color={T.autophagy}>AUTOPHAGY</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, textAlign: 'center' }}>
            Selective recycling
          </div>
          <div style={{ opacity: survivesCue.opacity, transform: `scale(${survivesCue.scale})` }}>
            <Badge label="CELL SURVIVES ✓" color={T.success} opacity={1} fontSize={20} />
          </div>
        </div>

        {/* Autolysis */}
        <div style={{
          opacity: totalCue.opacity,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          padding: '24px 30px', background: `${T.autolysis}08`,
          border: `2px solid ${T.autolysis}40`, borderRadius: 16, width: 420,
        }}>
          <GlowText fontSize={28} color={T.autolysis}>AUTOLYSIS</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, textAlign: 'center' }}>
            Total self-destruction
          </div>
          <div style={{ opacity: diesCue.opacity, transform: `scale(${diesCue.scale})` }}>
            <Badge label="CELL DIES ✗" color={T.danger} opacity={1} fontSize={20} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA ─────────────────────────────────────────────────────
const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const recyclesCue = useCueSpring(ct('recycles'));
  const destroysCue = useCueSpring(ct('destroys'));
  const guaranteedCue = useCueSpring(ct('guaranteed'));
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
          opacity: recyclesCue.opacity, transform: `scale(${recyclesCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.autophagy,
            padding: '8px 20px', background: `${T.autophagy}15`, borderRadius: 8,
          }}>Autophagy</div>
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.success }}>recycles ♻️</div>
        </div>

        <div style={{
          opacity: destroysCue.opacity, transform: `scale(${destroysCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.autolysis,
            padding: '8px 20px', background: `${T.autolysis}15`, borderRadius: 8,
          }}>Autolysis</div>
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.danger }}>destroys 💥</div>
        </div>

        <div style={{ opacity: guaranteedCue.opacity, transform: `scale(${guaranteedCue.scale})`, marginTop: 10 }}>
          <GlowText fontSize={36} color={T.gold}>
            Guaranteed marks
          </GlowText>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',         startS: 0,      durationS: 5.54,  Component: HookScene },
  { id: 'auto-def',     startS: 5.54,   durationS: 8.74,  Component: AutophagyDefScene },
  { id: 'auto-proc',    startS: 14.28,  durationS: 14.54, Component: AutophagyProcessScene },
  { id: 'why-matters',  startS: 28.82,  durationS: 13.96, Component: WhyMattersScene },
  { id: 'autolysis',    startS: 42.78,  durationS: 16.74, Component: AutolysisScene },
  { id: 'tadpole',      startS: 59.52,  durationS: 7.74,  Component: TadpoleScene },
  { id: 'distinction',  startS: 67.26,  durationS: 13.30, Component: DistinctionScene },
  { id: 'cta',          startS: 80.56,  durationS: 7.44,  Component: CTAScene },
];

export const BiologyAutophagyTikTok: React.FC<BiologyAutophagyTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/biology/autophagy-narration.mp3')} volume={1} />
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
        background: `linear-gradient(90deg, ${T.autophagy}, ${T.autolysis})`, borderRadius: 2 }} />
    </div>
  );
};

export function getBiologyAutophagyDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const BiologyAutophagyCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/biology/autophagy/cover-autophagy.jpg')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.4, filter: 'brightness(0.45)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={60} color={T.danger}>SELF</GlowText>
      <GlowText fontSize={60} color={T.danger}>DIGESTION</GlowText>
      <div style={{
        fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20, textAlign: 'center',
      }}>
        Autophagy vs Autolysis
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
        <Badge label="Recycles" color={T.autophagy} opacity={1} fontSize={20} />
        <Badge label="Destroys" color={T.autolysis} opacity={1} fontSize={20} />
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 20 }}>
        Cambridge 9700 · Chapter 1
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
