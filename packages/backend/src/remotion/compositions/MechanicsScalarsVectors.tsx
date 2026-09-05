/**
 * Scalars and Vectors
 *
 * An eleven-scene, narration-driven mechanics explainer. Instructional
 * changes are resolved from word-level Whisper cues; scene lengths come from
 * the generated narration audio.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import transcriptJson from '../public/transcripts/mechanics/scalars-vectors.json';
import { useCue } from './ProjectComposition';

const TRANSITION_FRAMES = 15;

const T = {
  bg: '#061522',
  bgDeep: '#03101b',
  panel: '#0d2536',
  panelLight: '#17384a',
  card: '#fff8e8',
  cardMuted: '#e7dfcf',
  ink: '#102435',
  text: '#f8f3e7',
  textMuted: '#9db2bd',
  cyan: '#42dbe8',
  cyanSoft: '#8decf2',
  amber: '#f4aa45',
  red: '#ef6f63',
  green: '#61d095',
  purple: '#b69cff',
  sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
};

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

interface MechanicsTranscriptScene {
  id: string;
  audio: string;
  duration: number;
  wordCount: number;
  text: string;
  words: TranscriptWord[];
  cues: Record<string, number>;
}

interface MechanicsTranscript {
  project: string;
  scenes: MechanicsTranscriptScene[];
  totalDuration: number;
  generatedAt: string;
  engine: string;
}

const TRANSCRIPT = transcriptJson as unknown as MechanicsTranscript;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function cueAt(scene: MechanicsTranscriptScene, cueName: string): number {
  const match = Object.entries(scene.cues).find(
    ([name]) => normalize(name) === normalize(cueName),
  );
  return match?.[1] ?? scene.duration + 1;
}

function getScene(id: string): MechanicsTranscriptScene {
  const scene = TRANSCRIPT.scenes.find((candidate) => candidate.id === id);
  if (!scene) throw new Error(`Missing transcript scene: ${id}`);
  return scene;
}

function sceneDurationInFrames(scene: MechanicsTranscriptScene, fps: number): number {
  return Math.ceil(scene.duration * fps) + TRANSITION_FRAMES;
}

export function getMechanicsScalarsVectorsDuration(fps: number): number {
  const sequenceFrames = TRANSCRIPT.scenes.reduce(
    (sum, scene) => sum + sceneDurationInFrames(scene, fps),
    0,
  );
  return sequenceFrames - (TRANSCRIPT.scenes.length - 1) * TRANSITION_FRAMES;
}

export interface MechanicsScalarsVectorsProps {
  audioEnabled?: boolean;
}

function useProgress(startSeconds: number, endSeconds: number): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const safeEnd = Math.max(startSeconds + 0.12, endSeconds);
  return interpolate(
    frame,
    [startSeconds * fps, safeEnd * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function useSpringAt(at: number, durationInFrames = 24): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - at * fps),
    fps,
    durationInFrames,
    config: { damping: 17, stiffness: 165, mass: 0.75 },
  });
  return frame < at * fps ? 0 : progress;
}

const MathTeX: React.FC<{
  tex: string;
  fontSize?: number;
  color?: string;
  display?: boolean;
  style?: React.CSSProperties;
}> = ({ tex, fontSize = 48, color = T.text, display = true, style }) => {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
    output: 'html',
    strict: false,
  });

  return (
    <div style={{ fontSize, color, lineHeight: 1.3, ...style }}>
      <style>{`.katex { font-size: 1em; } .katex * { color: inherit; }`}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

const StepBadge: React.FC<{ scene: number; label: string }> = ({ scene, label }) => (
  <div
    style={{
      position: 'absolute',
      top: 48,
      right: 58,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 18px',
      borderRadius: 999,
      border: `1px solid ${T.cyan}55`,
      background: `${T.bgDeep}dd`,
      boxShadow: `0 0 30px ${T.cyan}12`,
      color: T.textMuted,
      fontFamily: T.mono,
      fontSize: 17,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    }}
  >
    <span style={{ color: T.cyan, fontWeight: 900 }}>
      {String(scene).padStart(2, '0')} / 11
    </span>
    <span>{label}</span>
  </div>
);

const SceneShell: React.FC<{
  scene: number;
  label: string;
  children: React.ReactNode;
}> = ({ scene, label, children }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 75) * 10;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: T.bg, fontFamily: T.sans }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${26 + drift / 5}% 17%, ${T.cyan}16, transparent 35%), radial-gradient(circle at 80% 88%, ${T.amber}10, transparent 31%), linear-gradient(145deg, ${T.bgDeep}, ${T.bg})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.13,
          backgroundImage: `linear-gradient(${T.cyan}30 1px, transparent 1px), linear-gradient(90deg, ${T.cyan}30 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          transform: `translateX(${drift}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 48,
          color: T.textMuted,
          fontFamily: T.mono,
          fontSize: 17,
          letterSpacing: 2.6,
        }}
      >
        MECHANICS LAB
      </div>
      <StepBadge scene={scene} label={label} />
      {children}
      <div
        style={{
          position: 'absolute',
          left: 58,
          right: 58,
          bottom: 38,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${T.cyan}66 15%, ${T.cyan}66 85%, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Cued: React.FC<{
  at: number;
  children: React.ReactNode;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  style?: React.CSSProperties;
}> = ({ at, children, fromX = 0, fromY = 24, fromScale = 0.96, style }) => {
  const cue = useCue(at, 0.45);
  return (
    <div
      style={{
        opacity: cue.opacity,
        transform: `translate(${(1 - cue.opacity) * fromX}px, ${(1 - cue.opacity) * fromY}px) scale(${fromScale + cue.opacity * (1 - fromScale)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const WarmCard: React.FC<{
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, accent = T.cyan, style }) => (
  <div
    style={{
      borderRadius: 26,
      background: T.card,
      color: T.ink,
      border: `3px solid ${accent}`,
      boxShadow: `0 18px 55px #0007, 0 0 28px ${accent}18`,
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionTitle: React.FC<{ kicker: string; children: React.ReactNode }> = ({
  kicker,
  children,
}) => (
  <div style={{ position: 'absolute', left: 86, top: 112 }}>
    <div
      style={{
        color: T.cyan,
        fontFamily: T.mono,
        fontSize: 18,
        fontWeight: 850,
        letterSpacing: 2.4,
        textTransform: 'uppercase',
      }}
    >
      {kicker}
    </div>
    <div style={{ color: T.text, fontSize: 53, fontWeight: 900, marginTop: 8 }}>
      {children}
    </div>
  </div>
);

const VectorArrow: React.FC<{
  width: number;
  color?: string;
  direction?: 'right' | 'left' | 'down';
  thickness?: number;
  glow?: boolean;
}> = ({ width, color = T.cyan, direction = 'right', thickness = 7, glow = true }) => {
  const horizontal = direction !== 'down';
  const reverse = direction === 'left';
  return (
    <div
      style={{
        position: 'relative',
        width: horizontal ? width : 34,
        height: horizontal ? 34 : width,
        transform: reverse ? 'rotate(180deg)' : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: horizontal ? 0 : 14,
          top: horizontal ? 14 : 0,
          width: horizontal ? Math.max(0, width - 19) : thickness,
          height: horizontal ? thickness : Math.max(0, width - 19),
          borderRadius: thickness,
          background: color,
          boxShadow: glow ? `0 0 16px ${color}99` : undefined,
        }}
      />
      <div
        style={horizontal ? {
          position: 'absolute', right: 0, top: 4, width: 0, height: 0,
          borderTop: '13px solid transparent', borderBottom: '13px solid transparent',
          borderLeft: `21px solid ${color}`,
        } : {
          position: 'absolute', left: 4, bottom: 0, width: 0, height: 0,
          borderLeft: '13px solid transparent', borderRight: '13px solid transparent',
          borderTop: `21px solid ${color}`,
        }}
      />
    </div>
  );
};

const Compass: React.FC<{ size?: number; color?: string }> = ({ size = 180, color = T.amber }) => (
  <div style={{ position: 'relative', width: size, height: size }}>
    <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: `4px solid ${color}`, boxShadow: `0 0 25px ${color}33` }} />
    <div style={{ position: 'absolute', left: '50%', top: 20, bottom: 20, width: 3, background: `${color}88` }} />
    <div style={{ position: 'absolute', top: '50%', left: 20, right: 20, height: 3, background: `${color}88` }} />
    <div style={{ position: 'absolute', top: -3, left: '45%', color, fontFamily: T.mono, fontSize: 25, fontWeight: 900 }}>N</div>
    <div style={{ position: 'absolute', right: -2, top: '42%', color, fontFamily: T.mono, fontSize: 25, fontWeight: 900 }}>E</div>
    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 18, height: 18, borderRadius: '50%', background: T.card, transform: 'translate(-42%, -42%)' }} />
  </div>
);

const Person: React.FC<{ color?: string; running?: boolean }> = ({ color = T.amber, running = false }) => {
  const frame = useCurrentFrame();
  const swing = Math.sin(frame * (running ? 0.42 : 0.26)) * (running ? 18 : 12);
  return (
    <div style={{ position: 'relative', width: 72, height: 126 }}>
      <div style={{ position: 'absolute', left: 23, top: 0, width: 31, height: 31, borderRadius: '50%', background: color, boxShadow: `0 0 16px ${color}66` }} />
      <div style={{ position: 'absolute', left: 34, top: 29, width: 10, height: 51, borderRadius: 8, background: color, transform: `rotate(${swing * 0.15}deg)`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 34, top: 72, width: 9, height: 48, borderRadius: 7, background: color, transform: `rotate(${20 + swing}deg)`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 34, top: 72, width: 9, height: 48, borderRadius: 7, background: color, transform: `rotate(${-20 - swing}deg)`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 35, top: 38, width: 8, height: 43, borderRadius: 7, background: color, transform: `rotate(${55 - swing}deg)`, transformOrigin: 'top' }} />
      <div style={{ position: 'absolute', left: 35, top: 38, width: 8, height: 43, borderRadius: 7, background: color, transform: `rotate(${-55 + swing}deg)`, transformOrigin: 'top' }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S01 — SIZE IS NOT THE WHOLE STORY
// ─────────────────────────────────────────────────────────────────────────────

const Scene01: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const sizeAt = cueAt(scene, 'how-much');
  const directionAt = cueAt(scene, 'which-way');
  const scalarAt = cueAt(scene, 'scalars');
  const vectorAt = cueAt(scene, 'vectors');
  const sizeProgress = useSpringAt(sizeAt, 28);
  const directionProgress = useSpringAt(directionAt, 28);
  const scalar = useCue(scalarAt, 0.4);
  const vector = useCue(vectorAt, 0.4);

  return (
    <SceneShell scene={1} label="size + direction">
      <div style={{ opacity: vector.opacity }}>
        <SectionTitle kicker="two kinds of quantity">Size is only half the story</SectionTitle>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 250, height: 530 }}>
        <div
          style={{
            position: 'absolute',
            left: 710 - sizeProgress * 410,
            top: 82 + sizeProgress * 70,
            width: 330 - sizeProgress * 220,
            height: 330 - sizeProgress * 220,
            borderRadius: '50%',
            border: `7px solid ${T.cyan}`,
            background: `radial-gradient(circle, ${T.cyan}33, ${T.panel})`,
            boxShadow: `0 0 ${35 + sizeProgress * 30}px ${T.cyan}55`,
          }}
        >
          <div style={{ position: 'absolute', left: '50%', bottom: '49%', width: 8, height: 115 - sizeProgress * 75, background: T.amber, transformOrigin: 'bottom', transform: `rotate(${36 - sizeProgress * 36}deg)`, borderRadius: 9, opacity: 1 - sizeProgress }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 20, height: 20, borderRadius: '50%', background: T.card, transform: 'translate(-40%, -40%)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 66, height: 66, borderRadius: '50%', background: T.cyan, transform: 'translate(-50%, -50%)', boxShadow: `0 0 28px ${T.cyan}`, opacity: sizeProgress }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center', color: T.text, fontFamily: T.mono, fontSize: 50, fontWeight: 950, opacity: 1 - sizeProgress }}>12</div>
        </div>

        <div style={{ position: 'absolute', left: 274, top: 330, width: 190, textAlign: 'center', opacity: sizeProgress }}>
          <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 25, letterSpacing: 3, fontWeight: 900 }}>SIZE</div>
          <div style={{ color: T.textMuted, fontSize: 20, marginTop: 8 }}>how much</div>
        </div>

        <div style={{ position: 'absolute', left: 1050, top: 78, opacity: directionProgress, transform: `scale(${0.72 + directionProgress * 0.28}) rotate(${(1 - directionProgress) * 20}deg)` }}>
          <Compass size={260} />
          <div style={{ position: 'absolute', left: 88, top: 112, transform: `rotate(${(1 - directionProgress) * -35}deg)`, transformOrigin: 'left center' }}>
            <VectorArrow width={310} color={T.amber} />
          </div>
          <div style={{ position: 'absolute', left: 192, top: 310, width: 260, textAlign: 'center', color: T.amber, fontFamily: T.mono, fontSize: 24, fontWeight: 900, letterSpacing: 2 }}>DIRECTION</div>
        </div>

        <div style={{ position: 'absolute', left: 270, top: 438, width: 570, opacity: scalar.opacity }}>
          <WarmCard accent={T.cyan} style={{ padding: '20px 30px', textAlign: 'center' }}>
            <span style={{ color: T.cyan, fontFamily: T.mono, fontSize: 31, fontWeight: 950 }}>SCALAR</span>
            <span style={{ color: T.ink, fontSize: 27, fontWeight: 800 }}> = size</span>
          </WarmCard>
        </div>
        <div style={{ position: 'absolute', right: 270, top: 438, width: 570, opacity: vector.opacity }}>
          <WarmCard accent={T.amber} style={{ padding: '20px 30px', textAlign: 'center' }}>
            <span style={{ color: T.amber, fontFamily: T.mono, fontSize: 31, fontWeight: 950 }}>VECTOR</span>
            <span style={{ color: T.ink, fontSize: 27, fontWeight: 800 }}> = size + direction</span>
          </WarmCard>
        </div>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S02 — MAGNITUDE AND DIRECTION
// ─────────────────────────────────────────────────────────────────────────────

const ScaleBar: React.FC<{
  progress: number;
  arrow: boolean;
  color: string;
  arrowheadOpacity?: number;
}> = ({ progress, arrow, color, arrowheadOpacity = 1 }) => (
  <div style={{ position: 'relative', width: 580, height: 130 }}>
    <div style={{ position: 'absolute', left: 0, top: 68, width: 560, height: 4, background: `${T.textMuted}55` }} />
    {[0, 3, 6, 9, 12].map((n) => (
      <div key={n} style={{ position: 'absolute', left: n / 12 * 540, top: 58, width: 3, height: 25, background: T.textMuted }}>
        <span style={{ position: 'absolute', top: 29, left: -10, color: T.textMuted, fontFamily: T.mono, fontSize: 16 }}>{n}</span>
      </div>
    ))}
    <div style={{ position: 'absolute', left: 0, top: 28, transform: `scaleX(${progress})`, transformOrigin: 'left center' }}>
      <div style={{ width: 540, height: 32, borderRadius: 12, background: color, boxShadow: `0 0 20px ${color}66` }} />
      {arrow && <div style={{ position: 'absolute', right: -20, top: 1, width: 0, height: 0, borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: `24px solid ${color}`, opacity: arrowheadOpacity }} />}
    </div>
  </div>
);

const Scene02: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const scalarAt = cueAt(scene, 'scalar');
  const magnitudeAt = cueAt(scene, 'magnitude');
  const directionAt = cueAt(scene, 'direction');
  const velocityAt = cueAt(scene, 'velocity');
  const scalar = useCue(scalarAt, 0.45);
  const magnitude = useProgress(magnitudeAt, directionAt);
  const direction = useSpringAt(directionAt, 25);
  const velocity = useCue(velocityAt, 0.4);

  return (
    <SceneShell scene={2} label="magnitude + direction">
      <SectionTitle kicker="definitions">What makes a quantity complete?</SectionTitle>
      <div style={{ position: 'absolute', left: 78, right: 78, top: 245, bottom: 108, display: 'flex', gap: 34 }}>
        <div style={{ flex: 1, borderRadius: 30, border: `3px solid ${T.cyan}${scalar.isActive ? 'aa' : '33'}`, background: `${T.panel}e8`, padding: '34px 44px', opacity: 0.35 + scalar.opacity * 0.65 }}>
          <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 26, fontWeight: 950, letterSpacing: 3 }}>SCALAR</div>
          <div style={{ color: T.text, fontSize: 44, fontWeight: 900, marginTop: 22 }}>12 m/s</div>
          <div style={{ marginTop: 36 }}><ScaleBar progress={magnitude} arrow={false} color={T.cyan} /></div>
          <WarmCard accent={T.cyan} style={{ marginTop: 44, padding: '22px 28px', opacity: magnitude }}>
            <div style={{ fontFamily: T.mono, color: T.cyan, fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>MAGNITUDE</div>
            <div style={{ fontSize: 27, fontWeight: 850, marginTop: 8 }}>size completes the answer</div>
          </WarmCard>
        </div>

        <div style={{ flex: 1, borderRadius: 30, border: `3px solid ${T.amber}${direction > 0 ? 'aa' : '33'}`, background: `${T.panel}e8`, padding: '34px 44px', opacity: direction }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 26, fontWeight: 950, letterSpacing: 3 }}>VECTOR</div>
            <div style={{ opacity: direction, color: T.amber, fontFamily: T.mono, fontSize: 23, fontWeight: 900, marginRight: 96 }}>EAST →</div>
          </div>
          <div style={{ color: T.text, fontSize: 44, fontWeight: 900, marginTop: 22 }}>
            12 m/s <span style={{ color: T.amber, opacity: direction }}>east</span>
          </div>
          <div style={{ position: 'absolute', right: 30, top: 24, width: 72, height: 72, borderRadius: '50%', border: `4px solid ${T.amber}`, opacity: direction }}>
            <div style={{ position: 'absolute', left: 32, top: 8, width: 4, height: 54, background: T.amber }} />
            <div style={{ position: 'absolute', top: 32, left: 8, width: 54, height: 4, background: T.amber }} />
          </div>
          <div style={{ marginTop: 36 }}><ScaleBar progress={magnitude} arrow={true} color={T.amber} arrowheadOpacity={direction} /></div>
          <WarmCard accent={T.amber} style={{ marginTop: 44, padding: '22px 28px', position: 'relative', overflow: 'hidden', opacity: direction }}>
            <div style={{ opacity: 1 - velocity.opacity }}>
              <div style={{ fontFamily: T.mono, color: T.cyan, fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>SPEED</div>
              <div style={{ fontSize: 27, fontWeight: 850, marginTop: 8 }}>magnitude only</div>
            </div>
            <div style={{ position: 'absolute', inset: '22px 28px', opacity: velocity.opacity }}>
              <div style={{ fontFamily: T.mono, color: T.amber, fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>VELOCITY</div>
              <div style={{ fontSize: 27, fontWeight: 850, marginTop: 8 }}>magnitude + direction</div>
            </div>
          </WarmCard>
        </div>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S03 — ONE JOURNEY, TWO MEASUREMENTS
// ─────────────────────────────────────────────────────────────────────────────

const Scene03: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const eastAt = cueAt(scene, 'five-metres-east');
  const westAt = cueAt(scene, 'two-metres-west');
  const distanceAt = cueAt(scene, 'distance');
  const displacementAt = cueAt(scene, 'displacement');
  const outward = useProgress(eastAt, westAt);
  const returning = useProgress(westAt, distanceAt);
  const distanceReveal = useCue(distanceAt, 0.45);
  const displacementReveal = useCue(displacementAt, 0.45);
  const metres = 5 * outward + 2 * returning;
  const netMetres = 5 * outward - 2 * returning;
  const x = 260 + 170 * netMetres;
  const pathY = 680 - Math.sin(netMetres / 5 * Math.PI) * 125;
  const routeOne = outward;
  const routeTwo = returning;
  const displacementWidth = Math.max(18, x - 260);

  return (
    <SceneShell scene={3} label="distance vs displacement">
      <SectionTitle kicker="same journey">Two different measurements</SectionTitle>
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <path d="M260 680 C510 505 835 505 1110 680" fill="none" stroke={`${T.card}38`} strokeWidth="42" strokeLinecap="round" />
        <path d="M260 680 C510 505 835 505 1110 680" pathLength="1" fill="none" stroke={T.cyan} strokeWidth="12" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - routeOne} />
        <path d="M1110 680 C1000 610 890 548 770 561" pathLength="1" fill="none" stroke={T.amber} strokeWidth="12" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - routeTwo} />
        {[260, 430, 600, 770, 940, 1110].map((tick, index) => (
          <g key={tick}>
            <line x1={tick} y1={724} x2={tick} y2={748} stroke={T.textMuted} strokeWidth="4" />
            <text x={tick} y={778} fill={T.textMuted} textAnchor="middle" fontFamily={T.mono} fontSize="20">{index} m</text>
          </g>
        ))}
      </svg>

      <div style={{ position: 'absolute', left: x - 35, top: pathY - 123, transform: returning > 0 ? 'scaleX(-1)' : undefined }}><Person /></div>
      <div style={{ position: 'absolute', left: 232, top: 621, width: 56, height: 56, borderRadius: '50%', border: `5px solid ${T.green}`, background: `${T.green}22`, boxShadow: `0 0 22px ${T.green}55` }} />
      <div style={{ position: 'absolute', left: 218, top: 690, width: 88, textAlign: 'center', color: T.green, fontFamily: T.mono, fontSize: 18, fontWeight: 900 }}>START</div>

      <div style={{ position: 'absolute', left: 260, top: 805, opacity: Math.max(outward, returning) }}>
        <VectorArrow width={displacementWidth} color={T.amber} />
        <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 18, marginTop: 7, width: displacementWidth, textAlign: 'center' }}>START → FINISH</div>
      </div>

      <div style={{ position: 'absolute', right: 88, top: 288, width: 490 }}>
        <WarmCard accent={T.cyan} style={{ height: 204, padding: '28px 34px', opacity: Math.max(0.25, outward) }}>
          <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 21, fontWeight: 900, letterSpacing: 2 }}>DISTANCE</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 67, fontWeight: 950, marginTop: 18 }}>{metres.toFixed(1)} m</div>
          <div style={{ color: T.ink, opacity: distanceReveal.opacity, fontSize: 23, fontWeight: 750 }}>the whole route = 7 m</div>
        </WarmCard>
        <WarmCard accent={T.amber} style={{ height: 204, padding: '28px 34px', marginTop: 26, opacity: displacementReveal.opacity }}>
          <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 21, fontWeight: 900, letterSpacing: 2 }}>DISPLACEMENT</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 62, fontWeight: 950, marginTop: 18 }}>3 m east</div>
          <div style={{ color: T.ink, opacity: displacementReveal.opacity, fontSize: 23, fontWeight: 750 }}>finish compared with start</div>
        </WarmCard>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S04 — SPEED AND VELOCITY
// ─────────────────────────────────────────────────────────────────────────────

const FractionCard: React.FC<{
  at: number;
  title: string;
  tex: string;
  accent: string;
  icon: React.ReactNode;
  result?: React.ReactNode;
}> = ({ at, title, tex, accent, icon, result }) => {
  const reveal = useCue(at, 0.45);
  return (
    <div style={{ opacity: reveal.opacity, transform: `translateY(${(1 - reveal.opacity) * 35}px)` }}>
      <WarmCard accent={accent} style={{ width: 750, height: 445, padding: '34px 42px', position: 'relative' }}>
        <div style={{ color: accent, fontFamily: T.mono, fontSize: 24, fontWeight: 950, letterSpacing: 2.6 }}>{title}</div>
        <div style={{ position: 'absolute', right: 38, top: 26 }}>{icon}</div>
        <MathTeX tex={tex} fontSize={54} color={T.ink} style={{ marginTop: 55, textAlign: 'center' }} />
        <div style={{ position: 'absolute', left: 42, right: 42, bottom: 35 }}>{result}</div>
      </WarmCard>
    </div>
  );
};

const Scene04: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const speedAt = cueAt(scene, 'speed');
  const velocityAt = cueAt(scene, 'velocity');
  const oneAt = cueAt(scene, 'one-metre-per-second');
  const eastAt = cueAt(scene, 'east');
  const speedResult = useCue(oneAt, 0.4);
  const east = useCue(eastAt, 0.4);

  return (
    <SceneShell scene={4} label="speed vs velocity">
      <SectionTitle kicker="rate of motion">Route per time, or displacement per time?</SectionTitle>
      <div style={{ position: 'absolute', left: 150, right: 150, top: 318, display: 'flex', justifyContent: 'space-between' }}>
        <FractionCard
          at={speedAt}
          title="SPEED"
          accent={T.cyan}
          tex={'\\text{speed}=\\frac{\\text{distance}}{\\text{time}}'}
          icon={<div style={{ width: 100, height: 55, borderRadius: '55px 55px 8px 8px', border: `6px solid ${T.cyan}`, borderBottom: 0, position: 'relative' }}><div style={{ position: 'absolute', left: 46, bottom: 0, width: 5, height: 38, background: T.cyan, transform: 'rotate(35deg)', transformOrigin: 'bottom' }} /></div>}
          result={<div style={{ opacity: speedResult.opacity, borderRadius: 15, background: `${T.cyan}20`, padding: '14px 20px', color: T.ink, textAlign: 'center', fontFamily: T.mono, fontSize: 31, fontWeight: 950 }}>7 m ÷ 7 s = 1 m/s</div>}
        />
        <FractionCard
          at={velocityAt}
          title="VELOCITY"
          accent={T.amber}
          tex={'\\text{velocity}=\\frac{\\text{displacement}}{\\text{time}}'}
          icon={<VectorArrow width={130} color={T.amber} />}
          result={<div style={{ opacity: east.opacity, borderRadius: 15, background: `${T.amber}20`, padding: '14px 20px', color: T.ink, textAlign: 'center', fontFamily: T.mono, fontSize: 31, fontWeight: 950 }}>3/7 m/s <span style={{ color: T.amber }}>east →</span></div>}
        />
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S05 — THE ROUND-TRIP TEST
// ─────────────────────────────────────────────────────────────────────────────

const Scene05: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const rightAt = cueAt(scene, 'right');
  const backAt = cueAt(scene, 'back');
  const sixAt = cueAt(scene, 'six-metres');
  const zeroAt = cueAt(scene, 'zero');
  const out = useProgress(rightAt, backAt);
  const returning = useProgress(backAt, sixAt);
  const distance = 3 * out + 3 * returning;
  const runnerX = 336 + 930 * (out - returning);
  const displacementWidth = Math.max(0, 930 * (out - returning));
  const zero = useSpringAt(zeroAt, 26);

  return (
    <SceneShell scene={5} label="round-trip test">
      <SectionTitle kicker="quickest test">Back at the start</SectionTitle>
      <div style={{ position: 'absolute', left: 222, right: 222, top: 530, height: 7, borderRadius: 8, background: `${T.card}55` }} />
      {[0, 1, 2, 3].map((n) => <div key={n} style={{ position: 'absolute', left: 336 + n * 310, top: 510, width: 4, height: 49, background: T.textMuted }}><span style={{ position: 'absolute', top: 55, left: -20, width: 45, color: T.textMuted, textAlign: 'center', fontFamily: T.mono, fontSize: 20 }}>{n} m</span></div>)}
      <div style={{ position: 'absolute', left: 303, top: 390, transform: `translateX(${runnerX - 336}px) scaleX(${returning > 0 ? -1 : 1})` }}><Person running /></div>
      <div style={{ position: 'absolute', left: 310, top: 486, width: 55, height: 55, borderRadius: '50%', border: `5px solid ${T.green}`, background: `${T.green}22`, boxShadow: `0 0 22px ${T.green}55` }} />

      {displacementWidth > 8 && <div style={{ position: 'absolute', left: 336, top: 645 }}><VectorArrow width={displacementWidth} color={T.amber} /></div>}
      <div style={{ position: 'absolute', left: 282, top: 619, width: 110, color: T.amber, fontFamily: T.mono, fontSize: 18, fontWeight: 900 }}>DISPLACEMENT</div>
      <div style={{ position: 'absolute', left: 322, top: 640, width: 30, height: 30, borderRadius: '50%', border: `5px solid ${T.amber}`, opacity: zero, boxShadow: `0 0 28px ${T.amber}` }} />

      <WarmCard accent={T.cyan} style={{ position: 'absolute', right: 115, top: 205, width: 400, padding: '28px 34px' }}>
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 19, fontWeight: 900, letterSpacing: 2 }}>DISTANCE ODOMETER</div>
        <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 68, fontWeight: 950, marginTop: 12 }}>{distance.toFixed(1)} m</div>
      </WarmCard>
      <WarmCard accent={T.amber} style={{ position: 'absolute', right: 115, top: 712, width: 400, padding: '24px 34px', opacity: zero }}>
        <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>NET DISPLACEMENT</div>
        <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 48, fontWeight: 950, marginTop: 8 }}>0 m</div>
      </WarmCard>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S06 — ACCELERATION AND FORCE
// ─────────────────────────────────────────────────────────────────────────────

const Car: React.FC<{ color?: string }> = ({ color = T.cyan }) => (
  <div style={{ position: 'relative', width: 180, height: 90 }}>
    <div style={{ position: 'absolute', left: 10, right: 10, top: 27, height: 45, borderRadius: '28px 42px 10px 10px', background: color }} />
    <div style={{ position: 'absolute', left: 57, top: 7, width: 72, height: 42, borderRadius: '35px 35px 0 0', background: `${color}bb` }} />
    {[42, 135].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 64, width: 34, height: 34, borderRadius: '50%', background: T.bgDeep, border: `6px solid ${T.card}` }} />)}
  </div>
);

const Scene06: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const accelerationAt = cueAt(scene, 'acceleration');
  const slowingAt = cueAt(scene, 'slowing-down');
  const turningAt = cueAt(scene, 'turning');
  const forceAt = cueAt(scene, 'force');
  const accelerate = useSpringAt(accelerationAt, 30);
  const slowing = useSpringAt(slowingAt, 30);
  const turning = useSpringAt(turningAt, 31);
  const force = useSpringAt(forceAt, 28);

  return (
    <SceneShell scene={6} label="acceleration + force">
      <SectionTitle kicker="vectors change">Magnitude, direction, or both</SectionTitle>
      <div style={{ position: 'absolute', left: 80, top: 260, width: 840, height: 660, boxSizing: 'border-box', borderRadius: 30, background: `${T.panel}df`, border: `2px solid ${T.cyan}55`, padding: '30px 38px' }}>
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>VELOCITY CHANGES</div>
        <div style={{ position: 'absolute', left: 70, top: 128 }}><Car /></div>
        <div style={{ position: 'absolute', left: 265, top: 151, opacity: accelerate }}><VectorArrow width={180 + accelerate * 330} color={T.cyan} /></div>
        <div style={{ position: 'absolute', left: 70, top: 294 }}><Car color={T.cyanSoft} /></div>
        <div style={{ position: 'absolute', left: 265, top: 317, opacity: slowing }}><VectorArrow width={420 - slowing * 245} color={T.cyanSoft} /></div>
        <div style={{ position: 'absolute', left: 70, top: 480, width: 665, height: 120 }}>
          <svg width="665" height="120" style={{ position: 'absolute', inset: 0 }}>
            <path d="M30 90 C210 90 290 20 485 24" fill="none" stroke={`${T.card}55`} strokeWidth="28" strokeLinecap="round" />
            <path d="M30 90 C210 90 290 20 485 24" pathLength="1" fill="none" stroke={T.amber} strokeWidth="7" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - turning} />
          </svg>
          <div style={{ position: 'absolute', left: 402, top: 0, opacity: turning, transform: `rotate(${-35 * turning}deg)` }}><VectorArrow width={180} color={T.amber} /></div>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 80, top: 260, width: 840, height: 660, boxSizing: 'border-box', borderRadius: 30, background: `${T.panel}df`, border: `2px solid ${T.amber}55`, padding: '30px 38px', opacity: force }}>
        <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>FORCE SETS DIRECTION</div>
        <div style={{ position: 'absolute', left: 260, top: 215, width: 255, height: 210, borderRadius: 24, background: T.card, border: `5px solid ${T.amber}`, display: 'grid', placeItems: 'center', color: T.ink, fontSize: 34, fontWeight: 900, transform: `scale(${0.82 + force * 0.18})` }}>OBJECT</div>
        <div style={{ position: 'absolute', left: 66, top: 259, opacity: force }}><VectorArrow width={210} color={T.amber} /></div>
        <div style={{ position: 'absolute', left: 532, top: 259, opacity: force }}><VectorArrow width={220} color={T.cyan} /></div>
        <div style={{ position: 'absolute', left: 96, top: 326, color: T.amber, fontFamily: T.mono, fontSize: 24, fontWeight: 900, opacity: force }}>FORCE, F</div>
        <div style={{ position: 'absolute', left: 566, top: 326, color: T.cyan, fontFamily: T.mono, fontSize: 24, fontWeight: 900, opacity: force }}>ACCELERATION, a</div>
        <div style={{ position: 'absolute', left: 120, right: 120, bottom: 62, padding: '20px 26px', borderRadius: 18, background: `${T.amber}15`, color: T.text, textAlign: 'center', fontSize: 27, fontWeight: 800, opacity: force }}>same direction →</div>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S07 — SIGNS ENCODE DIRECTION
// ─────────────────────────────────────────────────────────────────────────────

const Scene07: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const positiveAt = cueAt(scene, 'positive-direction');
  const leftAt = cueAt(scene, 'leftward');
  const negativeAt = cueAt(scene, 'negative-component');
  const oppositeAt = cueAt(scene, 'opposite');
  const positive = useSpringAt(positiveAt, 27);
  const rightTravel = useProgress(positiveAt, leftAt);
  const flip = useProgress(leftAt, negativeAt);
  const negative = useCue(negativeAt, 0.4);
  const pulse = useSpringAt(oppositeAt, 25);
  const pixelsPerUnit = 120;
  const signedValue = 6 - flip * 12;
  const arrowWidth = Math.abs(signedValue) * pixelsPerUnit;

  return (
    <SceneShell scene={7} label="signed direction">
      <SectionTitle kicker="one-dimensional motion">Choose positive first</SectionTitle>
      <div style={{ position: 'absolute', left: 220, right: 220, top: 485, height: 7, background: T.card, borderRadius: 8 }} />
      {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} style={{ position: 'absolute', left: 960 + n * pixelsPerUnit, top: 464, width: 4, height: 48, background: n === 0 ? T.card : T.textMuted }}>
          <div style={{ position: 'absolute', top: 57, left: -22, width: 48, textAlign: 'center', color: n === 0 ? T.text : T.textMuted, fontFamily: T.mono, fontSize: 21 }}>{n}</div>
        </div>
      ))}

      <div style={{ position: 'absolute', left: 939 + rightTravel * 6 * pixelsPerUnit - flip * 12 * pixelsPerUnit, top: 449, width: 42, height: 42, borderRadius: '50%', background: flip < 0.5 ? T.cyan : T.amber, border: `5px solid ${T.card}`, boxShadow: `0 0 25px ${flip < 0.5 ? T.cyan : T.amber}88`, zIndex: 3, opacity: positive }} />

      <div style={{ position: 'absolute', left: 960, top: 334, opacity: positive }}>
        <VectorArrow width={6 * pixelsPerUnit} color={T.cyan} />
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 23, fontWeight: 900, textAlign: 'center', marginTop: 7 }}>POSITIVE DIRECTION</div>
      </div>

      {arrowWidth > 1 && <div style={{ position: 'absolute', left: signedValue >= 0 ? 960 : 960 - arrowWidth, top: 625, opacity: positive }}>
        <VectorArrow width={arrowWidth} color={signedValue >= 0 ? T.cyan : T.amber} direction={signedValue >= 0 ? 'right' : 'left'} />
      </div>}
      <div style={{ position: 'absolute', left: 730, top: 724, width: 460, textAlign: 'center', color: negative.isActive ? T.amber : T.cyan, fontFamily: T.mono, fontSize: 45, fontWeight: 950, opacity: positive }}>
        {negative.isActive ? 'v = −6 m/s' : 'v = +6 m/s'}
      </div>

      <div style={{ position: 'absolute', right: 105, top: 220, width: 380, opacity: Math.max(0.35, pulse), transform: `scale(${1 + pulse * 0.07})` }}>
        <WarmCard accent={T.green} style={{ padding: '28px 30px', textAlign: 'center', boxShadow: pulse > 0 ? `0 0 ${24 + pulse * 25}px ${T.green}66` : undefined }}>
          <div style={{ color: T.green, fontFamily: T.mono, fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>MAGNITUDE</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 54, fontWeight: 950, marginTop: 10 }}>|v| = 6 m/s</div>
          <div style={{ color: T.ink, fontSize: 21, fontWeight: 700, marginTop: 7 }}>unchanged by the flip</div>
        </WarmCard>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S08–S10 — CLASSIFICATION TABLE
// ─────────────────────────────────────────────────────────────────────────────

interface ClassificationItem {
  label: string;
  icon: string;
  at?: number;
  color?: string;
}

const ClassificationCell: React.FC<{ item: ClassificationItem; vector?: boolean }> = ({ item, vector = false }) => {
  const reveal = useCue(item.at ?? 0, 0.35);
  return (
    <div
      style={{
        height: 62,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 20px',
        borderBottom: `1px solid ${T.ink}20`,
        opacity: item.at === undefined ? 1 : reveal.opacity,
        transform: `translateX(${item.at === undefined ? 0 : (1 - reveal.opacity) * (vector ? 28 : -28)}px)`,
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', background: `${item.color ?? (vector ? T.amber : T.cyan)}22`, color: item.color ?? (vector ? T.amber : T.cyan), fontSize: 25, fontWeight: 950 }}>{item.icon}</div>
      <div style={{ color: T.ink, fontSize: 25, fontWeight: 850 }}>{item.label}</div>
      {vector && <div style={{ marginLeft: 'auto' }}><VectorArrow width={72} color={item.color ?? T.amber} thickness={5} glow={false} /></div>}
    </div>
  );
};

const ClassificationTable: React.FC<{
  scalars: ClassificationItem[];
  vectors: ClassificationItem[];
  scale?: number;
  top?: number;
}> = ({ scalars, vectors, scale = 1, top = 230 }) => (
  <div style={{ position: 'absolute', left: '50%', top, width: 1410, height: 725, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'center top', display: 'flex', gap: 28 }}>
    {[
      { title: 'SCALARS', subtitle: 'magnitude only', color: T.cyan, items: scalars, vector: false },
      { title: 'VECTORS', subtitle: 'magnitude + direction', color: T.amber, items: vectors, vector: true },
    ].map((column) => (
      <WarmCard key={column.title} accent={column.color} style={{ flex: 1, height: 710, overflow: 'hidden' }}>
        <div style={{ height: 102, padding: '22px 28px', background: `${column.color}1b`, borderBottom: `3px solid ${column.color}` }}>
          <div style={{ color: column.color, fontFamily: T.mono, fontSize: 26, fontWeight: 950, letterSpacing: 3 }}>{column.title}</div>
          <div style={{ color: T.ink, fontSize: 20, fontWeight: 700, marginTop: 4 }}>{column.subtitle}</div>
        </div>
        <div>{column.items.map((item) => <ClassificationCell key={item.label} item={item} vector={column.vector} />)}</div>
      </WarmCard>
    ))}
  </div>
);

const priorScalars: ClassificationItem[] = [
  { label: 'Speed', icon: '◴' },
  { label: 'Distance', icon: '⌁' },
  { label: 'Mass', icon: '⚖' },
  { label: 'Time', icon: '◷' },
];

const priorVectors: ClassificationItem[] = [
  { label: 'Velocity', icon: 'v' },
  { label: 'Displacement', icon: 'Δx' },
  { label: 'Acceleration', icon: 'a' },
];

const Scene08: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const items: ClassificationItem[] = [
    { label: 'Speed', icon: '◴', at: cueAt(scene, 'speed') },
    { label: 'Distance', icon: '⌁', at: cueAt(scene, 'distance') },
    { label: 'Mass', icon: '⚖', at: cueAt(scene, 'mass') },
    { label: 'Time', icon: '◷', at: cueAt(scene, 'time') },
  ];
  return (
    <SceneShell scene={8} label="classify scalars">
      <SectionTitle kicker="build the table">Scalars need size, not direction</SectionTitle>
      <ClassificationTable scalars={items} vectors={[]} top={250} />
    </SceneShell>
  );
};

const Scene09: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const scalars: ClassificationItem[] = [
    ...priorScalars,
    { label: 'Energy', icon: 'E', at: cueAt(scene, 'energy'), color: T.green },
  ];
  const vectors: ClassificationItem[] = [
    { label: 'Velocity', icon: 'v', at: cueAt(scene, 'velocity') },
    { label: 'Displacement', icon: 'Δx', at: cueAt(scene, 'displacement') },
    { label: 'Acceleration', icon: 'a', at: cueAt(scene, 'acceleration') },
  ];
  return (
    <SceneShell scene={9} label="classify motion">
      <SectionTitle kicker="continue the table">Energy and motion quantities</SectionTitle>
      <ClassificationTable scalars={scalars} vectors={vectors} top={250} />
    </SceneShell>
  );
};

const Scene10: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const completesAt = cueAt(scene, 'completes');
  const complete = useSpringAt(completesAt, 30);
  const scalars: ClassificationItem[] = [...priorScalars, { label: 'Energy', icon: 'E', color: T.green }];
  const vectors: ClassificationItem[] = [
    ...priorVectors,
    { label: 'Force', icon: 'F', at: cueAt(scene, 'force') },
    { label: 'Weight', icon: '↓', at: cueAt(scene, 'weight'), color: T.red },
    { label: 'Momentum', icon: 'p', at: cueAt(scene, 'momentum'), color: T.purple },
  ];
  return (
    <SceneShell scene={10} label="complete classification">
      <div style={{ opacity: 1 - complete * 0.75 }}><SectionTitle kicker="force family">Complete the vector column</SectionTitle></div>
      <ClassificationTable scalars={scalars} vectors={vectors} top={215 - complete * 56} scale={1 + complete * 0.08} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 62, textAlign: 'center', opacity: complete, color: T.green, fontFamily: T.mono, fontSize: 27, fontWeight: 950, letterSpacing: 3 }}>CLASSIFICATION COMPLETE ✓</div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S11 — RECAP
// ─────────────────────────────────────────────────────────────────────────────

const RecapTile: React.FC<{
  at: number;
  title: string;
  accent: string;
  children: React.ReactNode;
  x: number;
  y: number;
}> = ({ at, title, accent, children, x, y }) => {
  const reveal = useSpringAt(at, 25);
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: reveal, transform: `scale(${0.83 + reveal * 0.17})` }}>
      <WarmCard accent={accent} style={{ width: 780, height: 280, padding: '22px 28px' }}>
        <div style={{ color: accent, fontFamily: T.mono, fontSize: 18, fontWeight: 950, letterSpacing: 2.4 }}>{title}</div>
        {children}
      </WarmCard>
    </div>
  );
};

const Scene11: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const scalarAt = cueAt(scene, 'scalar');
  const vectorAt = cueAt(scene, 'vector');
  const positiveAt = cueAt(scene, 'positive-direction');
  const askAt = cueAt(scene, 'always-ask');
  const vector = useCue(vectorAt, 0.4);
  const ask = useSpringAt(askAt, 30);

  return (
    <SceneShell scene={11} label="recap">
      <SectionTitle kicker="twenty-second recap">The decision in four pictures</SectionTitle>
      <RecapTile at={scalarAt} title="MAGNITUDE DOT vs VECTOR ARROW" accent={T.cyan} x={120} y={250}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 215 }}>
          <div style={{ width: 95, height: 95, borderRadius: '50%', background: T.cyan, boxShadow: `0 0 38px ${T.cyan}88` }} />
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 38, fontWeight: 950 }}>SIZE</div>
          <div style={{ opacity: vector.opacity }}><VectorArrow width={255} color={T.amber} glow={false} /></div>
        </div>
      </RecapTile>
      <RecapTile at={scalarAt} title="ROUTE vs SHORTCUT" accent={T.cyan} x={1020} y={250}>
        <svg width="720" height="190" style={{ marginTop: 15 }}>
          <path d="M45 145 C170 20 320 185 470 58 C555 0 620 70 680 40" fill="none" stroke={T.cyan} strokeWidth="12" strokeLinecap="round" />
          <line x1="45" y1="145" x2="680" y2="40" stroke={T.amber} strokeWidth="8" strokeDasharray="13 11" />
          <text x="48" y="182" fill={T.ink} fontFamily={T.mono} fontSize="20">distance: route</text>
          <text x="476" y="182" fill={T.ink} fontFamily={T.mono} fontSize="20">displacement: shortcut</text>
        </svg>
      </RecapTile>
      <RecapTile at={vectorAt} title="SPEEDOMETER vs VELOCITY ARROW" accent={T.amber} x={120} y={560}>
        <div style={{ height: 215, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <div style={{ width: 175, height: 100, border: `10px solid ${T.cyan}`, borderRadius: '100px 100px 10px 10px', borderBottom: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 78, bottom: 0, width: 7, height: 72, borderRadius: 8, background: T.cyan, transform: 'rotate(38deg)', transformOrigin: 'bottom' }} />
          </div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 34, fontWeight: 950 }}>vs</div>
          <VectorArrow width={300} color={T.amber} glow={false} />
        </div>
      </RecapTile>
      <RecapTile at={positiveAt} title="SIGNED NUMBER LINE" accent={T.green} x={1020} y={560}>
        <div style={{ position: 'relative', height: 205 }}>
          <div style={{ position: 'absolute', left: 30, right: 30, top: 97, height: 5, background: T.ink }} />
          {[-2, -1, 0, 1, 2].map((n) => <div key={n} style={{ position: 'absolute', left: 360 + n * 125, top: 80, width: 4, height: 39, background: T.ink }}><span style={{ position: 'absolute', top: 43, left: -15, fontFamily: T.mono, fontSize: 19 }}>{n}</span></div>)}
          <div style={{ position: 'absolute', left: 370, top: 38 }}><VectorArrow width={260} color={T.green} /></div>
        </div>
      </RecapTile>

      <div style={{ position: 'absolute', inset: 0, background: `${T.bgDeep}${ask > 0 ? 'e8' : '00'}`, opacity: ask, display: 'grid', placeItems: 'center', zIndex: 20 }}>
        <WarmCard accent={T.amber} style={{ width: 1320, minHeight: 300, padding: '58px 70px', display: 'grid', placeItems: 'center', transform: `scale(${0.82 + ask * 0.18})` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 21, fontWeight: 900, letterSpacing: 3 }}>ALWAYS ASK</div>
            <div style={{ color: T.ink, fontSize: 60, fontWeight: 950, marginTop: 22 }}>Size only, or size and direction?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 36, marginTop: 35 }}>
              <span style={{ color: T.cyan, fontFamily: T.mono, fontSize: 29, fontWeight: 950 }}>SCALAR •</span>
              <span style={{ color: T.amber, fontFamily: T.mono, fontSize: 29, fontWeight: 950 }}>VECTOR →</span>
            </div>
          </div>
        </WarmCard>
      </div>
    </SceneShell>
  );
};

const S01 = getScene('s01');
const S02 = getScene('s02');
const S03 = getScene('s03');
const S04 = getScene('s04');
const S05 = getScene('s05');
const S06 = getScene('s06');
const S07 = getScene('s07');
const S08 = getScene('s08');
const S09 = getScene('s09');
const S10 = getScene('s10');
const S11 = getScene('s11');

const NarratedScene: React.FC<{
  scene: MechanicsTranscriptScene;
  audioEnabled: boolean;
  children: React.ReactNode;
}> = ({ scene, audioEnabled, children }) => (
  <AbsoluteFill>
    {children}
    {audioEnabled && <Audio src={staticFile(`audio/mechanics/${scene.audio}`)} volume={1} />}
  </AbsoluteFill>
);

const SceneSequence: React.FC<{
  scene: MechanicsTranscriptScene;
  audioEnabled: boolean;
  children: React.ReactNode;
}> = ({ scene, audioEnabled, children }) => (
  <NarratedScene scene={scene} audioEnabled={audioEnabled}>{children}</NarratedScene>
);

export const MechanicsScalarsVectors: React.FC<MechanicsScalarsVectorsProps> = ({
  audioEnabled = true,
}) => {
  const { fps } = useVideoConfig();
  const transition = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S01, fps)}><SceneSequence scene={S01} audioEnabled={audioEnabled}><Scene01 scene={S01} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S02, fps)}><SceneSequence scene={S02} audioEnabled={audioEnabled}><Scene02 scene={S02} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S03, fps)}><SceneSequence scene={S03} audioEnabled={audioEnabled}><Scene03 scene={S03} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S04, fps)}><SceneSequence scene={S04} audioEnabled={audioEnabled}><Scene04 scene={S04} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S05, fps)}><SceneSequence scene={S05} audioEnabled={audioEnabled}><Scene05 scene={S05} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S06, fps)}><SceneSequence scene={S06} audioEnabled={audioEnabled}><Scene06 scene={S06} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S07, fps)}><SceneSequence scene={S07} audioEnabled={audioEnabled}><Scene07 scene={S07} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S08, fps)}><SceneSequence scene={S08} audioEnabled={audioEnabled}><Scene08 scene={S08} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S09, fps)}><SceneSequence scene={S09} audioEnabled={audioEnabled}><Scene09 scene={S09} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S10, fps)}><SceneSequence scene={S10} audioEnabled={audioEnabled}><Scene10 scene={S10} /></SceneSequence></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S11, fps)}><SceneSequence scene={S11} audioEnabled={audioEnabled}><Scene11 scene={S11} /></SceneSequence></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
