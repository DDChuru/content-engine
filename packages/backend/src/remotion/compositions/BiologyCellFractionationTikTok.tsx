/**
 * Biology Cell Fractionation — TikTok (9:16) v1
 *
 * Cambridge A-Level Biology 9700, Topic 1.2: Cell Structure
 * Lysosomes, Ribosomes, Cell Fractionation & Sedimentation.
 *
 * Visual style: Mix of food-tests motion-graphics (dark bg, cards, orbs)
 * with 1-2 split-screen slides (infographic right, text left) for organelles.
 *
 * 8 scenes, ~78 seconds, 1080×1920.
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
const TOTAL_DURATION_S = 78;

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
  // Organelle colors
  lysosome: '#22c55e',
  ribosome: '#06b6d4',
  nucleus: '#a855f7',
  mitochondria: '#f97316',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Image paths ──────────────────────────────────────────────────────
const IMG = {
  hookMicroscope: staticFile('images/biology/cell-fractionation/hook-microscope.jpg'),
  lysosomeInfo: staticFile('images/biology/cell-fractionation/lysosome-infographic.jpg'),
  ribosomeInfo: staticFile('images/biology/cell-fractionation/ribosome-infographic.jpg'),
  cellOrganelles: staticFile('images/biology/cell-fractionation/cell-organelles.jpg'),
  homogenisation: staticFile('images/biology/cell-fractionation/homogenisation.jpg'),
  filtration: staticFile('images/biology/cell-fractionation/filtration.jpg'),
  centrifugeTubes: staticFile('images/biology/cell-fractionation/centrifuge-tubes.jpg'),
  centrifugeMachine: staticFile('images/biology/cell-fractionation/centrifuge-machine.jpg'),
  thumbnail: staticFile('images/biology/cell-fractionation/thumbnail.jpg'),
  whatsappHook: staticFile('images/biology/cell-fractionation/whatsapp-hook.png'),
};

// ── Cue Map — Whisper-resolved timestamps (2026-02-15) ──────────────
const DEFAULT_CUES: Record<string, number> = {
  'see': 2.08,
  'fractionation': 3.26,
  'go': 6.70,
  'organelles': 9.56,
  'lysosomes': 10.86,
  'enzymes': 13.26,
  'recycling': 16.58,
  'ribosomes': 17.92,
  'mrna': 20.72,
  'proteins': 22.56,
  'challenge': 26.16,
  'separate': 29.38,
  'homogenisation': 31.40,
  'blend': 32.84,
  'cold': 33.76,
  'isotonic': 34.50,
  'bursting': 40.52,
  'filter': 42.24,
  'debris': 43.98,
  'suspension': 45.56,
  'ultracentrifugation': 47.78,
  'sedimentation': 49.34,
  'nuclei': 52.58,
  'supernatant': 56.50,
  'mitochondria': 58.60,
  'lysosomes-settle': 61.72,
  'ribosomes-settle': 64.58,
  'smallest': 65.68,
  'four-spins': 70.30,
  'fractionation-end': 73.28,
  'save': 74.64,
  'exam': 76.82,
};

// ── Types ────────────────────────────────────────────────────────────
export interface BiologyCellFractionationTikTokProps {
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
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.8) 100%)',
      }} />
    </AbsoluteFill>
  );
};

/** Hero card — centered image for step scenes */
const HeroCard: React.FC<{
  src: string; cueTime: number; label?: string;
  accentColor?: string; y?: number; width?: number; height?: number;
}> = ({ src, cueTime, label, accentColor = T.text, y = 360, width = 720, height = 450 }) => {
  const { opacity, scale, translateY: ty } = useCueSpring(cueTime);
  const frame = useCurrentFrame();
  const floatY = Math.sin(frame * 0.04) * 3;

  return (
    <div style={{
      position: 'absolute', top: y + floatY, left: 0, right: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity, transform: `scale(${scale}) translateY(${ty}px)`,
    }}>
      <div style={{
        width, height, borderRadius: 16, overflow: 'hidden',
        border: `2px solid ${accentColor}33`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${accentColor}15`,
      }}>
        <Img src={src} style={{
          width: '100%', height: '100%', objectFit: 'cover',
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

/** Split-screen: image on right, animated text on left */
const SplitInfoCard: React.FC<{
  src: string; startS: number; endS: number;
  accentColor?: string;
}> = ({ src, startS, endS, accentColor = T.primary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = startS * fps;
  const ef = endS * fps;
  const entryP = spring({ frame: Math.max(0, frame - sf), fps,
    config: { damping: 16, stiffness: 120 }, durationInFrames: 25 });
  const outO = interpolate(frame, [ef - 0.4 * fps, ef], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visible = frame >= sf && frame <= ef;
  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute', top: 280, right: 30,
      width: 480, opacity: entryP * outO,
      transform: `translateX(${interpolate(entryP, [0, 1], [40, 0])}px)`,
    }}>
      <div style={{
        width: 480, height: 580, borderRadius: 20, overflow: 'hidden',
        border: `2px solid ${accentColor}33`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 30px ${accentColor}10`,
      }}>
        <Img src={src} style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
      </div>
    </div>
  );
};

/** Animated text bullet — appears on left side for split-screen */
const SplitBullet: React.FC<{
  text: string; cueTime: number; y: number;
  color?: string; icon?: string; fontSize?: number;
}> = ({ text, cueTime, y, color = T.text, icon, fontSize = 24 }) => {
  const { opacity, translateY } = useCue(cueTime, 0.5);
  return (
    <div style={{
      position: 'absolute', top: y, left: 40, width: 480,
      opacity, transform: `translateY(${translateY}px)`,
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      {icon && (
        <span style={{ fontSize: fontSize + 2, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      )}
      <span style={{
        fontSize, fontWeight: 600, color, fontFamily: T.font,
        lineHeight: 1.35, textShadow: `0 2px 10px rgba(0,0,0,0.6)`,
      }}>
        {text}
      </span>
    </div>
  );
};

/** Step badge */
const StepBadge: React.FC<{ step: string; color: string; cueTime: number }> = ({
  step, color, cueTime,
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
      {step}
    </div>
  );
};

/** Scene title */
const SceneTitle: React.FC<{
  text: string; subtitle?: string; color: string; cueTime: number; top?: number;
}> = ({ text, subtitle, color, cueTime, top = 160 }) => {
  const { opacity, translateY } = useCue(cueTime, 0.6);
  return (
    <div style={{
      position: 'absolute', top, left: 60, right: 60,
      opacity, transform: `translateY(${translateY}px)`,
    }}>
      <div style={{
        fontSize: 48, fontWeight: 900, color, fontFamily: T.font,
        letterSpacing: '-0.02em', textShadow: `0 0 40px ${color}55`,
        lineHeight: 1.15,
      }}>
        {text}
      </div>
      {subtitle && (
        <div style={{
          fontSize: 26, fontWeight: 500, color: T.textMuted,
          fontFamily: T.font, marginTop: 8,
        }}>
          {subtitle}
        </div>
      )}
      <div style={{
        width: 80, height: 4, marginTop: 14, borderRadius: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
    </div>
  );
};

/** Keyword badge — highlights a key term inline */
const KeywordBadge: React.FC<{
  text: string; cueTime: number; color: string; y: number;
}> = ({ text, cueTime, color, y }) => {
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

/** Chemical/science label with typewriter effect */
const TypewriterLabel: React.FC<{
  text: string; cueTime: number; y: number; color?: string;
}> = ({ text, cueTime, y, color = T.primary }) => {
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

/** Centrifuge tube — animated vertical bar with pellet */
const CentrifugeTube: React.FC<{
  label: string; color: string; pelletSize: number;
  cueTime: number; x: number;
}> = ({ label, color, pelletSize, cueTime, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTime * fps;
  const progress = spring({ frame: Math.max(0, frame - cueFrame), fps,
    config: { damping: 14, stiffness: 160 }, durationInFrames: 25 });
  const visible = frame >= cueFrame;

  return (
    <div style={{
      position: 'absolute', top: 940, left: x,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity: visible ? progress : 0,
      transform: `scale(${visible ? interpolate(progress, [0, 1], [0.7, 1]) : 0.7})`,
    }}>
      {/* Tube */}
      <div style={{
        width: 60, height: 200, borderRadius: '8px 8px 30px 30px',
        background: `linear-gradient(to bottom, ${T.text}10 0%, ${T.text}05 ${100 - pelletSize}%, ${color}88 ${100 - pelletSize}%, ${color} 100%)`,
        border: `2px solid ${T.text}20`,
        position: 'relative',
      }}>
        {/* Pellet glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: `${pelletSize}%`, borderRadius: '0 0 28px 28px',
          background: `radial-gradient(ellipse at center bottom, ${color}aa, ${color}44)`,
          boxShadow: `0 0 20px ${color}44`,
        }} />
      </div>
      {/* Label */}
      <div style={{
        marginTop: 12, fontSize: 18, fontWeight: 700,
        color, fontFamily: T.font, textAlign: 'center',
        maxWidth: 120,
      }}>
        {label}
      </div>
    </div>
  );
};

/** Morphing color orb */
const MorphOrb: React.FC<{
  colorStops: { time: number; color: string }[];
  size?: number; y?: number;
}> = ({ colorStops, size = 200, y = 480 }) => {
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

// ── Scene Timing ─────────────────────────────────────────────────────

interface SceneTiming {
  id: string;
  startS: number;
  durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene Components ─────────────────────────────────────────────────

/** Scene 1: Hook — WhatsApp screenshot from daughter asking for help.
 *  Authentic, relatable — shows the real problem this video solves. */
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 15 });

  // Hold static for 1.2s, then slow zoom into the chat messages
  const pauseFrames = fps * 1.2;
  const scale = interpolate(frame, [pauseFrames, durationInFrames], [1.0, 1.12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0b141a' }}>
      {/* WhatsApp screenshot — centered, slow zoom */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        opacity: entrance,
      }}>
        <Img src={IMG.whatsappHook} style={{
          height: '100%', objectFit: 'contain',
          transform: `scale(${scale})`, transformOrigin: '50% 55%',
        }} />
      </div>

      {/* Subtle dark vignette at bottom for future text overlay */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, transparent 60%, rgba(11,20,26,0.7) 85%, rgba(11,20,26,0.95) 100%)',
      }} />

      {/* "I got you" emphasis glow — appears after entrance */}
      <div style={{
        position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(frame, [fps * 1.5, fps * 2.2], [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <span style={{
          fontSize: 28, fontWeight: 800, color: T.primary, fontFamily: T.font,
          textShadow: `0 0 20px ${T.primary}44`,
          letterSpacing: '0.05em',
        }}>
          Challenge accepted. 🧬
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** Scene 2: Intro — "Cell Fractionation. Topic 1, Part 2. Let's GO!" */
const IntroScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 20 });

  const goCue = useCue(ct('go'), 0.3);

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.primary} />

      {/* Cambridge badge */}
      <div style={{
        position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center',
        opacity: entrance,
      }}>
        <div style={{
          display: 'inline-block', background: `${T.primary}15`,
          border: `2px solid ${T.primary}55`, borderRadius: 16,
          padding: '14px 36px', fontSize: 22, fontWeight: 600,
          color: T.primary, fontFamily: T.font,
        }}>
          Cambridge A-Level 9700
        </div>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 540, left: 60, right: 60, textAlign: 'center',
        opacity: entrance, transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
      }}>
        <div style={{
          fontSize: 62, fontWeight: 900, color: T.text, fontFamily: T.font,
          letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>
          Cell<br/>Fractionation
        </div>
        <div style={{
          fontSize: 30, fontWeight: 500, color: T.textMuted, fontFamily: T.font,
          marginTop: 16,
        }}>
          Topic 1 · Part 2
        </div>
      </div>

      {/* LET'S GO! */}
      <div style={{
        position: 'absolute', top: 850, left: 0, right: 0,
        textAlign: 'center',
        opacity: goCue.opacity,
        transform: `scale(${1 + (1 - goCue.opacity) * 0.3}) translateY(${goCue.translateY}px)`,
      }}>
        <div style={{
          fontSize: 72, fontWeight: 900, color: T.gold,
          fontFamily: T.font, letterSpacing: '0.06em',
          textShadow: `0 0 40px ${T.gold}55, 0 4px 20px rgba(0,0,0,0.5)`,
        }}>
          LET'S GO!
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Scene 3: Organelles — SPLIT-SCREEN style.
 *  Lysosome infographic on right, text bullets on left.
 *  Then ribosome infographic on right, text bullets on left.
 */
const OrganellesScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lysosome phase: organelles → ribosomes
  const lysosomeEndS = ct('ribosomes') - 0.3;
  // Ribosome phase: ribosomes → end of scene
  const ribosomeEndS = ct('challenge') || 30;

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.lysosome} />

      {/* Scene title */}
      <SceneTitle text="Meet Your Organelles" color={T.primary}
        cueTime={ct('organelles')} top={100} />

      {/* ── Lysosome Phase ── */}
      <SplitInfoCard src={IMG.lysosomeInfo}
        startS={ct('lysosomes')} endS={lysosomeEndS}
        accentColor={T.lysosome} />

      <SplitBullet text="Lysosomes" cueTime={ct('lysosomes')}
        y={320} color={T.lysosome} fontSize={32} />
      <SplitBullet text="Tiny bags of digestive enzymes" cueTime={ct('enzymes')}
        y={390} color={T.text} icon="🧪" />
      <SplitBullet text="Break down waste" cueTime={ct('enzymes') + 0.5}
        y={450} color={T.textMuted} icon="♻️" />
      <SplitBullet text="Cell's recycling center" cueTime={ct('recycling')}
        y={510} color={T.lysosome} icon="🏭" />

      {/* ── Ribosome Phase ── */}
      <SplitInfoCard src={IMG.ribosomeInfo}
        startS={ct('ribosomes')} endS={ribosomeEndS}
        accentColor={T.ribosome} />

      <SplitBullet text="Ribosomes" cueTime={ct('ribosomes')}
        y={620} color={T.ribosome} fontSize={32} />
      <SplitBullet text="Protein factories" cueTime={ct('ribosomes') + 0.5}
        y={690} color={T.text} icon="🏗️" />
      <SplitBullet text="Read mRNA → build proteins" cueTime={ct('mrna')}
        y={750} color={T.textMuted} icon="📖" />
      <SplitBullet text="Amino acid by amino acid" cueTime={ct('proteins')}
        y={810} color={T.ribosome} icon="🔗" />
    </AbsoluteFill>
  );
};

/** Scene 4: Problem — "They're all mixed together!" */
const ProblemScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 20 });

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.danger} />

      {/* Cell organelles image — hero centered */}
      <HeroCard src={IMG.cellOrganelles} cueTime={0}
        y={300} width={700} height={500}
        accentColor={T.accent} label="INSIDE THE CELL" />

      {/* Question text */}
      <div style={{
        position: 'absolute', top: 900, left: 60, right: 60, textAlign: 'center',
        opacity: entrance,
      }}>
        <div style={{
          fontSize: 44, fontWeight: 800, color: T.warning, fontFamily: T.font,
          lineHeight: 1.25,
        }}>
          But they're all <span style={{ color: T.danger }}>mixed together!</span>
        </div>
      </div>

      {/* Separate question */}
      {(() => {
        const sep = useCue(ct('separate'), 0.5);
        return (
          <div style={{
            position: 'absolute', top: 1020, left: 60, right: 60, textAlign: 'center',
            opacity: sep.opacity, transform: `translateY(${sep.translateY}px)`,
          }}>
            <div style={{
              fontSize: 36, fontWeight: 700, color: T.text, fontFamily: T.font,
            }}>
              How do we <span style={{ color: T.primary }}>separate</span> them?
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

/** Scene 5: Step 1 — Homogenisation */
const Step1Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.primary} />

      <StepBadge step="STEP 1/3" color={T.primary} cueTime={0} />
      <SceneTitle text="Homogenisation" subtitle="Blend the tissue"
        color={T.primary} cueTime={ct('homogenisation')} />

      {/* Homogeniser image */}
      <HeroCard src={IMG.homogenisation} cueTime={ct('blend')}
        y={380} width={680} height={420}
        accentColor={T.primary} label="TISSUE HOMOGENISER" />

      {/* Key conditions */}
      <SplitBullet text="Cold — stops enzymes destroying organelles"
        cueTime={ct('cold')} y={880} color={T.ribosome} icon="❄️" />
      <SplitBullet text="Buffered — maintains pH"
        cueTime={ct('cold') + 0.5} y={950} color={T.textMuted} icon="⚖️" />
      <SplitBullet text="Isotonic — prevents bursting"
        cueTime={ct('isotonic')} y={1020} color={T.warning} icon="💧" />

      {/* Bursting result badge */}
      <KeywordBadge text="🧊 Cold + Isotonic = Safe Organelles"
        cueTime={ct('bursting')} color={T.success} y={1140} />
    </AbsoluteFill>
  );
};

/** Scene 6: Step 2 — Filtration */
const Step2Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.lysosome} />

      <StepBadge step="STEP 2/3" color={T.lysosome} cueTime={0} />
      <SceneTitle text="Filtration" subtitle="Remove cell debris"
        color={T.lysosome} cueTime={ct('filter')} />

      {/* Filtration image */}
      <HeroCard src={IMG.filtration} cueTime={ct('filter')}
        y={380} width={680} height={420}
        accentColor={T.lysosome} label="FILTER THROUGH GAUZE" />

      <SplitBullet text="Remove large cell debris"
        cueTime={ct('debris')} y={880} color={T.text} icon="🗑️" />
      <SplitBullet text="Keep the organelle suspension"
        cueTime={ct('suspension')} y={950} color={T.lysosome} icon="🧫" />
    </AbsoluteFill>
  );
};

/** Scene 7: Step 3 — Ultracentrifugation (the big one) */
const Step3Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Show centrifuge machine first, then transition to tubes diagram
  const machineEndS = ct('nuclei') - 0.5;

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.accent} />

      <StepBadge step="STEP 3/3" color={T.accent} cueTime={0} />
      <SceneTitle text="Ultracentrifugation" subtitle="Spin to separate"
        color={T.accent} cueTime={ct('ultracentrifugation')} />

      {/* Sedimentation keyword */}
      <TypewriterLabel text="SEDIMENTATION" cueTime={ct('sedimentation')}
        y={280} color={T.accent} />

      {/* Centrifuge machine image — shows first */}
      {(() => {
        const w = useCueWindow(0, machineEndS);
        return (
          <div style={{ opacity: w.opacity }}>
            <HeroCard src={IMG.centrifugeMachine} cueTime={0}
              y={360} width={650} height={400}
              accentColor={T.accent} label="ULTRACENTRIFUGE" />
          </div>
        );
      })()}

      {/* Centrifuge tubes diagram — replaces machine */}
      {(() => {
        const tubesCue = useCue(ct('nuclei') - 0.3, 0.5);
        return (
          <div style={{ opacity: tubesCue.opacity }}>
            <HeroCard src={IMG.centrifugeTubes} cueTime={ct('nuclei') - 0.3}
              y={360} width={700} height={420}
              accentColor={T.accent} label="DIFFERENTIAL CENTRIFUGATION" />
          </div>
        );
      })()}

      {/* Animated sedimentation labels */}
      <SplitBullet text="Nuclei — heaviest, sediment first"
        cueTime={ct('nuclei')} y={880} color={T.nucleus} icon="🟣" />
      <SplitBullet text="Supernatant → pour off, spin faster"
        cueTime={ct('supernatant')} y={950} color={T.textMuted} icon="⬆️" />
      <SplitBullet text="Mitochondria sediment next"
        cueTime={ct('mitochondria')} y={1020} color={T.mitochondria} icon="🟠" />
      <SplitBullet text="Lysosomes settle out"
        cueTime={ct('lysosomes-settle')} y={1090} color={T.lysosome} icon="🟢" />
      <SplitBullet text="Ribosomes — smallest, settle last"
        cueTime={ct('ribosomes-settle')} y={1160} color={T.ribosome} icon="🔵" />
    </AbsoluteFill>
  );
};

/** Scene 8: Summary + CTA */
const SummaryScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 20 });

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.gold} />

      {/* Summary flow */}
      <div style={{
        position: 'absolute', top: 300, left: 60, right: 60, textAlign: 'center',
        opacity: entrance,
      }}>
        <div style={{
          fontSize: 42, fontWeight: 900, color: T.text, fontFamily: T.font,
          lineHeight: 1.4,
        }}>
          Homogenise → Filter → Centrifuge
        </div>
      </div>

      {/* Four spins badge */}
      <KeywordBadge text="4 spins → 4 fractions"
        cueTime={ct('four-spins')} color={T.gold} y={460} />

      {/* Four organelle dots */}
      {(() => {
        const fourCue = useCue(ct('four-spins'), 0.5);
        const items = [
          { label: 'Nuclei', color: T.nucleus },
          { label: 'Mitochondria', color: T.mitochondria },
          { label: 'Lysosomes', color: T.lysosome },
          { label: 'Ribosomes', color: T.ribosome },
        ];
        return (
          <div style={{
            position: 'absolute', top: 580, left: 60, right: 60,
            display: 'flex', justifyContent: 'center', gap: 40,
            opacity: fourCue.opacity,
          }}>
            {items.map((item, i) => {
              const delay = i * 3;
              const s = spring({ frame: Math.max(0, frame - (ct('four-spins') * fps + delay)), fps,
                config: { damping: 12, stiffness: 200 }, durationInFrames: 15 });
              return (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  opacity: s, transform: `scale(${s})`,
                }}>
                  <div style={{
                    width: 70, height: 70, borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, ${item.color}ee, ${item.color}44)`,
                    boxShadow: `0 0 30px ${item.color}33`,
                  }} />
                  <div style={{
                    marginTop: 10, fontSize: 18, fontWeight: 700,
                    color: item.color, fontFamily: T.font,
                  }}>
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* "That's cell fractionation" */}
      {(() => {
        const fracCue = useCue(ct('fractionation-end'), 0.5);
        return (
          <div style={{
            position: 'absolute', top: 810, left: 60, right: 60, textAlign: 'center',
            opacity: fracCue.opacity, transform: `translateY(${fracCue.translateY}px)`,
          }}>
            <div style={{
              fontSize: 46, fontWeight: 900, color: T.primary, fontFamily: T.font,
            }}>
              That's Cell Fractionation
            </div>
          </div>
        );
      })()}

      {/* Save CTA */}
      {(() => {
        const saveCue = useCueSpring(ct('save'));
        return (
          <div style={{
            position: 'absolute', top: 950, left: 60, right: 60, textAlign: 'center',
            opacity: saveCue.opacity, transform: `scale(${saveCue.scale})`,
          }}>
            <div style={{
              fontSize: 56, fontWeight: 900, color: T.gold, fontFamily: T.font,
              textShadow: `0 0 40px ${T.gold}44`,
            }}>
              💾 Save this!
            </div>
            <div style={{
              fontSize: 30, fontWeight: 600, color: T.text, fontFamily: T.font,
              marginTop: 16, opacity: 0.8,
            }}>
              Guaranteed exam question.
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ── Scene Array (must be after component definitions) ────────────────

const SCENES: SceneTiming[] = [
  { id: 'hook',        startS: 0,     durationS: 3.26,  Component: HookScene },
  { id: 'intro',       startS: 3.26,  durationS: 6.30,  Component: IntroScene },
  { id: 'organelles',  startS: 9.56,  durationS: 16.60, Component: OrganellesScene },
  { id: 'problem',     startS: 26.16, durationS: 5.24,  Component: ProblemScene },
  { id: 'step1',       startS: 31.40, durationS: 10.84, Component: Step1Scene },
  { id: 'step2',       startS: 42.24, durationS: 5.54,  Component: Step2Scene },
  { id: 'step3',       startS: 47.78, durationS: 19.9,  Component: Step3Scene },
  { id: 'summary',     startS: 67.68, durationS: 10.32, Component: SummaryScene },
];

// ── Main Composition ─────────────────────────────────────────────────

export const BiologyCellFractionationTikTok: React.FC<BiologyCellFractionationTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string): number => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Audio */}
      {audioEnabled && (
        <Audio src={staticFile('audio/biology/cell-fractionation-narration.mp3')} />
      )}

      {/* Progress bar */}
      <ProgressBar />

      {/* Scenes — each in its own Sequence with scene-relative cue times */}
      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={Math.round(scene.startS * FPS)}
          durationInFrames={Math.round(scene.durationS * FPS)}
          name={scene.id}
        >
          <scene.Component ct={(id: string) => ct(id) - scene.startS} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ── Duration helper ──────────────────────────────────────────────────

export function getBiologyCellFractionationDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

// ── Cover Image Composition ──────────────────────────────────────────

export const BiologyCellFractionationCover: React.FC = () => {
  const items = [
    { label: 'Nuclei', color: T.nucleus },
    { label: 'Mitochondria', color: T.mitochondria },
    { label: 'Lysosomes', color: T.lysosome },
    { label: 'Ribosomes', color: T.ribosome },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <Img src={IMG.thumbnail} style={{
        width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4,
      }} />
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, rgba(5,5,16,0.3) 0%, rgba(5,5,16,0.7) 40%, rgba(5,5,16,0.95) 100%)',
      }} />

      {/* Cambridge badge */}
      <div style={{
        position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block', background: `${T.primary}15`,
          border: `2px solid ${T.primary}55`, borderRadius: 14,
          padding: '12px 32px', fontSize: 22, fontWeight: 600,
          color: T.primary, fontFamily: T.font,
        }}>
          CAMBRIDGE A-LEVEL 9700
        </span>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 350, left: 60, right: 60, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 72, fontWeight: 900, color: T.text, fontFamily: T.font,
          letterSpacing: '-0.02em', lineHeight: 1.1,
        }}>
          Cell<br/>Fractionation
        </div>
        <div style={{
          fontSize: 30, fontWeight: 500, color: T.textMuted, fontFamily: T.font,
          marginTop: 16,
        }}>
          Topic 1.2 · Cell Structure
        </div>
      </div>

      {/* 4 organelle dots */}
      <div style={{
        position: 'absolute', top: 700, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 36,
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, ${item.color}ee, ${item.color}44)`,
              boxShadow: `0 0 40px ${item.color}33`,
            }} />
            <div style={{
              marginTop: 10, fontSize: 18, fontWeight: 700,
              color: item.color, fontFamily: T.font,
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Steps summary */}
      <div style={{
        position: 'absolute', top: 920, left: 0, right: 0, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 28, fontWeight: 700, color: T.gold, fontFamily: T.font,
        }}>
          Homogenise → Filter → Centrifuge
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute', bottom: 200, left: 0, right: 0, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 36, fontWeight: 800, color: T.text, fontFamily: T.font,
          opacity: 0.9,
        }}>
          4 spins. 4 fractions. 🧬
        </div>
      </div>
    </AbsoluteFill>
  );
};
