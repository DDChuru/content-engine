/**
 * Types of Force
 *
 * A ten-scene, narration-driven mechanics explainer. Instructional changes
 * are resolved from word-level Whisper cues and every scene length comes from
 * its generated narration audio.
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
import transcriptJson from '../public/transcripts/mechanics/types-of-forces.json';
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

export function getMechanicsTypesOfForcesDuration(fps: number): number {
  const sequenceFrames = TRANSCRIPT.scenes.reduce(
    (sum, scene) => sum + sceneDurationInFrames(scene, fps),
    0,
  );
  return sequenceFrames - (TRANSCRIPT.scenes.length - 1) * TRANSITION_FRAMES;
}

export interface MechanicsTypesOfForcesProps {
  audioEnabled?: boolean;
}

function useProgress(startSeconds: number, endSeconds: number): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const safeEnd = Math.max(startSeconds + 0.12, endSeconds);
  return interpolate(frame, [startSeconds * fps, safeEnd * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
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

const StepBadge: React.FC<{ scene: number; label: string }> = ({ scene, label }) => (
  <div
    style={{
      position: 'absolute',
      top: 48,
      right: 58,
      zIndex: 50,
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
      {String(scene).padStart(2, '0')} / 10
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

const SectionTitle: React.FC<{ kicker: string; children: React.ReactNode }> = ({
  kicker,
  children,
}) => (
  <div style={{ position: 'absolute', left: 86, top: 112, zIndex: 30 }}>
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
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

const LabBlock: React.FC<{
  width?: number;
  height?: number;
  label?: string;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ width = 300, height = 190, label, accent = T.cyan, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 22,
      background: `linear-gradient(145deg, ${T.card}, ${T.cardMuted})`,
      border: `5px solid ${accent}`,
      boxShadow: `0 22px 45px #0008, inset 0 0 0 2px #fff8`,
      display: 'grid',
      placeItems: 'center',
      color: T.ink,
      fontFamily: T.mono,
      fontSize: 29,
      fontWeight: 950,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {label}
  </div>
);

interface ForceArrowProps {
  x: number;
  y: number;
  length: number;
  angle: number;
  progress: number;
  label?: string;
  color?: string;
  labelOffset?: number;
  labelAlong?: number;
  strokeWidth?: number;
  dashed?: boolean;
  opacity?: number;
}

/** An SVG arrow whose tail is always exactly (x, y), including when angled. */
const ForceArrow: React.FC<ForceArrowProps> = ({
  x,
  y,
  length,
  angle,
  progress,
  label,
  color = T.amber,
  labelOffset = -38,
  labelAlong = 0.6,
  strokeWidth = 10,
  dashed = false,
  opacity = 1,
}) => {
  const shown = Math.max(0, Math.min(1, progress));
  const radians = angle * Math.PI / 180;
  const ux = Math.cos(radians);
  const uy = Math.sin(radians);
  const nx = -uy;
  const ny = ux;
  const visibleLength = length * shown;
  const endX = x + ux * visibleLength;
  const endY = y + uy * visibleLength;
  const head = Math.min(25, Math.max(0, visibleLength * 0.36));
  const halfHead = head * 0.58;
  const baseX = endX - ux * head;
  const baseY = endY - uy * head;
  const labelX = x + ux * length * labelAlong + nx * labelOffset;
  const labelY = y + uy * length * labelAlong + ny * labelOffset;

  return (
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', opacity }}
    >
      <line
        x1={x}
        y1={y}
        x2={baseX}
        y2={baseY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashed ? '18 13' : undefined}
        style={{ filter: `drop-shadow(0 0 8px ${color}99)` }}
      />
      <polygon
        points={`${endX},${endY} ${baseX + nx * halfHead},${baseY + ny * halfHead} ${baseX - nx * halfHead},${baseY - ny * halfHead}`}
        fill={color}
        style={{ filter: `drop-shadow(0 0 7px ${color}88)` }}
      />
      {label && shown > 0.12 && (
        <text
          x={labelX}
          y={labelY}
          fill={color}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily={T.mono}
          fontSize="24"
          fontWeight="900"
          letterSpacing="1.2"
          stroke={T.bgDeep}
          strokeWidth="7"
          paintOrder="stroke"
          opacity={Math.min(1, shown * 2.8)}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

const RightAngle: React.FC<{ x: number; y: number; angle: number; opacity: number }> = ({
  x,
  y,
  angle,
  opacity,
}) => (
  <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity }}>
    <path
      d={`M ${x} ${y} l 42 0 l 0 -42`}
      fill="none"
      stroke={T.cyan}
      strokeWidth="6"
      transform={`rotate(${angle} ${x} ${y})`}
    />
  </svg>
);

const LabCar: React.FC<{ style?: React.CSSProperties; color?: string }> = ({
  style,
  color = T.card,
}) => (
  <div style={{ position: 'absolute', width: 300, height: 145, ...style }}>
    <div
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        top: 51,
        height: 70,
        borderRadius: '42px 58px 16px 16px',
        background: color,
        border: `5px solid ${T.cyan}`,
        boxSizing: 'border-box',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 82,
        top: 13,
        width: 126,
        height: 67,
        borderRadius: '58px 58px 0 0',
        background: T.panelLight,
        border: `5px solid ${T.cyan}`,
        boxSizing: 'border-box',
      }}
    />
    {[64, 224].map((left) => (
      <div
        key={left}
        style={{
          position: 'absolute',
          left,
          top: 101,
          width: 49,
          height: 49,
          borderRadius: '50%',
          background: T.bgDeep,
          border: `7px solid ${T.card}`,
          boxSizing: 'border-box',
        }}
      />
    ))}
  </div>
);

const Person: React.FC<{ style?: React.CSSProperties; opacity?: number }> = ({
  style,
  opacity = 1,
}) => (
  <div style={{ position: 'absolute', width: 95, height: 190, opacity, ...style }}>
    <div style={{ position: 'absolute', left: 31, top: 0, width: 42, height: 42, borderRadius: '50%', background: T.amber }} />
    <div style={{ position: 'absolute', left: 45, top: 40, width: 13, height: 82, borderRadius: 10, background: T.amber, transform: 'rotate(-8deg)', transformOrigin: 'top' }} />
    <div style={{ position: 'absolute', left: 47, top: 111, width: 12, height: 78, borderRadius: 10, background: T.amber, transform: 'rotate(23deg)', transformOrigin: 'top' }} />
    <div style={{ position: 'absolute', left: 48, top: 111, width: 12, height: 78, borderRadius: 10, background: T.amber, transform: 'rotate(-23deg)', transformOrigin: 'top' }} />
    <div style={{ position: 'absolute', left: 49, top: 54, width: 11, height: 83, borderRadius: 10, background: T.amber, transform: 'rotate(-64deg)', transformOrigin: 'top' }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// S01 — FORCES ARE INVISIBLE ACTORS
// ─────────────────────────────────────────────────────────────────────────────

const Scene01: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const invisible = useCue(cueAt(scene, 'invisible'), 0.35);
  const pull = useSpringAt(cueAt(scene, 'pull'), 22);
  const push = useSpringAt(cueAt(scene, 'push'), 22);
  const title = useCue(cueAt(scene, 'which-forces'), 0.45);
  const detectorPulse = invisible.opacity * (0.72 + Math.sin(frame * 0.33) * 0.18);
  const scanX = 730 + ((frame * 8) % 460);

  return (
    <SceneShell scene={1} label="force scanner">
      <div style={{ opacity: title.opacity }}>
        <SectionTitle kicker="force scanner online">Which forces are present?</SectionTitle>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 350,
          right: 350,
          top: 780,
          height: 34,
          borderRadius: 18,
          background: `linear-gradient(180deg, ${T.cyan}, ${T.panelLight})`,
          boxShadow: `0 0 30px ${T.cyan}55`,
        }}
      />
      <LabBlock width={320} height={220} style={{ position: 'absolute', left: 800, top: 560 }} />

      <div style={{ opacity: invisible.opacity }}>
        {[0, 1, 2].map((ring) => (
          <div
            key={ring}
            style={{
              position: 'absolute',
              left: 960 - 230 - ring * 28,
              top: 670 - 230 - ring * 28,
              width: 460 + ring * 56,
              height: 460 + ring * 56,
              borderRadius: '50%',
              border: `2px ${ring === 1 ? 'dashed' : 'solid'} ${T.cyan}${ring === 0 ? 'bb' : '55'}`,
              boxSizing: 'border-box',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: scanX,
            top: 505,
            width: 4,
            height: 345,
            background: T.cyan,
            boxShadow: `0 0 24px ${T.cyan}`,
            opacity: 0.75,
          }}
        />
      </div>

      <ForceArrow x={1120} y={670} length={285} angle={0} progress={Math.max(detectorPulse * 0.22, pull)} label={pull > 0.12 ? 'PULL' : undefined} labelOffset={-42} opacity={pull > 0 ? 1 : 0.5} />
      <ForceArrow x={800} y={670} length={285} angle={180} progress={Math.max(detectorPulse * 0.22, push)} label={push > 0.12 ? 'PUSH' : undefined} labelOffset={42} opacity={push > 0 ? 1 : 0.5} />
      <ForceArrow x={960} y={560} length={185} angle={-90} progress={detectorPulse * 0.22} opacity={0.45} />
      <ForceArrow x={960} y={780} length={175} angle={90} progress={detectorPulse * 0.22} opacity={0.45} />

      <div
        style={{
          position: 'absolute',
          left: 830,
          top: 850,
          width: 260,
          textAlign: 'center',
          color: T.cyan,
          fontFamily: T.mono,
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 2.2,
          opacity: invisible.opacity,
        }}
      >
        SIGNALS DETECTED
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S02 — A FORCE NEEDS SIZE AND DIRECTION
// ─────────────────────────────────────────────────────────────────────────────

const Scene02: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const vector = useSpringAt(cueAt(scene, 'vector'), 28);
  const size = useSpringAt(cueAt(scene, 'size'), 26);
  const direction = useSpringAt(cueAt(scene, 'direction'), 28);
  const newtons = useCue(cueAt(scene, 'newtons'), 0.4);
  const onePoint = useSpringAt(cueAt(scene, 'one-point'), 28);

  return (
    <SceneShell scene={2} label="vector anatomy">
      <SectionTitle kicker="one complete force">Anatomy of a force arrow</SectionTitle>

      <div
        style={{
          position: 'absolute',
          left: 250,
          top: 430,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: T.card,
          border: `5px solid ${T.cyan}`,
          boxShadow: `0 0 28px ${T.cyan}`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <ForceArrow x={250} y={430} length={760} angle={0} progress={vector} label="FORCE VECTOR" labelOffset={-54} />

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: size }}>
        <line x1="250" y1="535" x2={250 + 760 * size} y2="535" stroke={T.cyan} strokeWidth="5" />
        {Array.from({ length: 9 }, (_, index) => 250 + index * 95).map((x, index) => (
          <g key={x} opacity={x <= 250 + 760 * size ? 1 : 0}>
            <line x1={x} y1="519" x2={x} y2={index % 2 === 0 ? 558 : 549} stroke={T.cyanSoft} strokeWidth="4" />
            {index % 2 === 0 && <text x={x} y="585" fill={T.textMuted} textAnchor="middle" fontFamily={T.mono} fontSize="18">{index}</text>}
          </g>
        ))}
        <text x="630" y="625" fill={T.cyan} textAnchor="middle" fontFamily={T.mono} fontSize="23" fontWeight="900">LENGTH = SIZE</text>
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 1170,
          top: 280,
          width: 330,
          height: 330,
          borderRadius: '50%',
          border: `6px solid ${T.amber}`,
          boxShadow: `0 0 34px ${T.amber}44`,
          opacity: direction,
          transform: `rotate(${(1 - direction) * -28}deg) scale(${0.82 + direction * 0.18})`,
        }}
      >
        <div style={{ position: 'absolute', left: 160, top: 25, width: 5, height: 280, background: `${T.amber}66` }} />
        <div style={{ position: 'absolute', left: 25, top: 160, width: 280, height: 5, background: `${T.amber}66` }} />
        <div style={{ position: 'absolute', left: 151, top: 151, width: 28, height: 28, borderRadius: '50%', background: T.card }} />
        <div style={{ position: 'absolute', left: 270, top: 126, color: T.amber, fontFamily: T.mono, fontWeight: 950, fontSize: 28 }}>E</div>
        <div style={{ position: 'absolute', left: 151, top: -42, color: T.amber, fontFamily: T.mono, fontWeight: 950, fontSize: 28 }}>N</div>
      </div>

      <WarmCard
        accent={T.amber}
        style={{
          position: 'absolute',
          left: 280,
          top: 720,
          width: 390,
          height: 150,
          padding: '25px 32px',
          opacity: newtons.opacity,
          transform: `translateY(${(1 - newtons.opacity) * 24}px)`,
        }}
      >
        <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>SI UNIT</div>
        <div style={{ fontFamily: T.mono, fontSize: 49, fontWeight: 950, marginTop: 6 }}>newton · N</div>
      </WarmCard>

      <WarmCard
        accent={T.cyan}
        style={{
          position: 'absolute',
          right: 160,
          top: 690,
          width: 570,
          height: 220,
          padding: '28px 34px',
          opacity: onePoint,
          transform: `scale(${0.84 + onePoint * 0.16})`,
        }}
      >
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 19, fontWeight: 900, letterSpacing: 2 }}>PARTICLE MODEL</div>
        <div style={{ position: 'absolute', left: 82, top: 92, width: 120, height: 80, borderRadius: 15, background: T.cardMuted, border: `3px solid ${T.ink}`, opacity: 1 - onePoint }} />
        <div style={{ position: 'absolute', left: 123, top: 105, width: 54, height: 54, borderRadius: '50%', background: T.cyan, boxShadow: `0 0 28px ${T.cyan}`, transform: `scale(${0.6 + onePoint * 0.4})` }} />
        <div style={{ position: 'absolute', left: 240, top: 104, color: T.ink, fontSize: 30, fontWeight: 900 }}>all forces act<br />at one point</div>
      </WarmCard>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S03 — WEIGHT AND REACTION
// ─────────────────────────────────────────────────────────────────────────────

const Scene03: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const weight = useSpringAt(cueAt(scene, 'weight'), 26);
  const formula = useCue(cueAt(scene, 'mass-times-gravity'), 0.4);
  const reaction = useSpringAt(cueAt(scene, 'normal-reaction'), 27);
  const tilt = useSpringAt(cueAt(scene, 'tilt'), 42);
  const angle = -13 * tilt;
  const radians = angle * Math.PI / 180;
  const contactX = 930;
  const contactY = 730;
  const centerX = contactX + 92 * Math.sin(radians);
  const centerY = contactY - 92 * Math.cos(radians);

  return (
    <SceneShell scene={3} label="weight + reaction">
      <SectionTitle kicker="contact forces">Forces at a surface</SectionTitle>

      <div
        style={{
          position: 'absolute',
          left: contactX - 610,
          top: contactY - 17,
          width: 1220,
          height: 34,
          borderRadius: 18,
          background: `linear-gradient(180deg, ${T.cyan}, ${T.panelLight})`,
          boxShadow: reaction > 0 ? `0 0 ${18 + reaction * 24}px ${T.cyan}77` : undefined,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '610px 17px',
        }}
      />
      <LabBlock
        width={330}
        height={184}
        label="BLOCK"
        style={{
          position: 'absolute',
          left: contactX - 165,
          top: contactY - 184,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '165px 184px',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: contactX - 30,
          top: contactY - 30,
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: `5px solid ${T.cyan}`,
          boxShadow: `0 0 38px ${T.cyan}`,
          opacity: reaction,
          transform: `scale(${0.55 + reaction * 0.45})`,
        }}
      />

      <ForceArrow x={centerX} y={centerY} length={285} angle={90} progress={weight} label="WEIGHT" labelOffset={52} />
      <ForceArrow x={contactX} y={contactY} length={285} angle={angle - 90} progress={reaction} label="NORMAL REACTION" labelOffset={-70} labelAlong={0.9} />
      <RightAngle x={contactX} y={contactY} angle={angle} opacity={reaction} />

      <WarmCard
        accent={T.amber}
        style={{
          position: 'absolute',
          right: 110,
          top: 290,
          width: 410,
          height: 185,
          padding: '28px 34px',
          opacity: formula.opacity,
          transform: `translateX(${(1 - formula.opacity) * 30}px)`,
        }}
      >
        <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 19, fontWeight: 900, letterSpacing: 2 }}>WEIGHT</div>
        <div style={{ fontFamily: T.mono, fontSize: 62, fontWeight: 950, marginTop: 13 }}>W = mg</div>
      </WarmCard>

      <div
        style={{
          position: 'absolute',
          right: 125,
          top: 520,
          width: 390,
          padding: '18px 24px',
          borderRadius: 16,
          background: `${T.panel}e8`,
          border: `2px solid ${T.cyan}66`,
          color: T.text,
          fontFamily: T.mono,
          fontSize: 22,
          fontWeight: 850,
          textAlign: 'center',
          opacity: tilt,
        }}
      >
        weight stays vertical ↓
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S04 — STRING OR ROD: TENSION OR THRUST?
// ─────────────────────────────────────────────────────────────────────────────

const Scene04: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const tension = useSpringAt(cueAt(scene, 'tension'), 24);
  const rod = useSpringAt(cueAt(scene, 'rod'), 25);
  const thrust = useSpringAt(cueAt(scene, 'thrust'), 25);
  const slack = useSpringAt(cueAt(scene, 'slack'), 31);

  return (
    <SceneShell scene={4} label="string vs rod">
      <SectionTitle kicker="connector test">Connector under load</SectionTitle>

      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 265,
          width: 850,
          height: 670,
          borderRadius: 30,
          background: `${T.panel}e8`,
          border: `3px solid ${T.cyan}55`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ position: 'absolute', left: 32, top: 28, color: T.cyan, fontFamily: T.mono, fontSize: 22, fontWeight: 950, letterSpacing: 2.4 }}>TAUT STRING</div>
        <div style={{ position: 'absolute', left: 105, top: 302, width: 34, height: 210, borderRadius: 12, background: T.panelLight, border: `4px solid ${T.cyan}` }} />
        <svg width="850" height="670" style={{ position: 'absolute', inset: 0 }}>
          <line x1="139" y1="405" x2="550" y2="405" stroke={T.cardMuted} strokeWidth="10" strokeLinecap="round" opacity={1 - slack} />
          <path
            d={`M 139 405 Q 345 ${405 + 150 * slack} 550 405`}
            fill="none"
            stroke={T.cardMuted}
            strokeWidth="10"
            strokeLinecap="round"
            opacity={slack}
          />
        </svg>
        <LabBlock width={210} height={170} label="BLOCK" style={{ position: 'absolute', left: 550, top: 320 }} />
        <div
          style={{
            position: 'absolute',
            left: 220,
            top: 525,
            width: 310,
            textAlign: 'center',
            color: slack > 0.4 ? T.red : T.cyan,
            fontFamily: T.mono,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 1.8,
            opacity: Math.max(tension, slack),
          }}
        >
          {slack > 0.4 ? 'NO THRUST · STRING SLACK' : 'TENSION ONLY'}
        </div>
      </div>

      <ForceArrow x={620} y={670} length={235} angle={180} progress={tension} label="TENSION" labelOffset={42} opacity={Math.max(0, 1 - slack)} />

      <div
        style={{
          position: 'absolute',
          right: 70,
          top: 265,
          width: 850,
          height: 670,
          borderRadius: 30,
          background: `${T.panel}e8`,
          border: `3px solid ${T.amber}${rod > 0 ? 'aa' : '33'}`,
          boxSizing: 'border-box',
          opacity: rod,
        }}
      >
        <div style={{ position: 'absolute', left: 32, top: 28, color: T.amber, fontFamily: T.mono, fontSize: 22, fontWeight: 950, letterSpacing: 2.4 }}>RIGID ROD</div>
        <div style={{ position: 'absolute', left: 89, top: 302, width: 34, height: 210, borderRadius: 12, background: T.panelLight, border: `4px solid ${T.amber}` }} />
        <div
          style={{
            position: 'absolute',
            left: 123 + thrust * 35,
            top: 393,
            width: 424 - thrust * 35,
            height: 24,
            borderRadius: 5,
            background: `repeating-linear-gradient(90deg, ${T.cardMuted} 0 28px, ${T.amber} 28px 33px)`,
            boxShadow: `0 0 16px ${T.amber}44`,
          }}
        />
        <LabBlock width={210} height={170} label="BLOCK" accent={T.amber} style={{ position: 'absolute', left: 547, top: 320 }} />
        <div
          style={{
            position: 'absolute',
            left: 225,
            top: 525,
            width: 370,
            height: 66,
            borderRadius: 999,
            border: `2px solid ${thrust > 0.5 ? T.amber : T.cyan}`,
            background: T.bgDeep,
            display: 'grid',
            placeItems: 'center',
            color: thrust > 0.5 ? T.amber : T.cyan,
            fontFamily: T.mono,
            fontSize: 24,
            fontWeight: 950,
            letterSpacing: 2.2,
          }}
        >
          {thrust > 0.5 ? 'PUSH · THRUST →' : '← PULL · TENSION'}
        </div>
      </div>

      <ForceArrow x={1652} y={670} length={230} angle={180} progress={rod * (1 - thrust)} label="TENSION" labelOffset={42} labelAlong={0.85} />
      <ForceArrow x={1652} y={670} length={170} angle={0} progress={thrust} label="THRUST" labelOffset={-43} labelAlong={0.8} />
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S05 — FRICTION CHOOSES A DIRECTION
// ─────────────────────────────────────────────────────────────────────────────

const Sled: React.FC<{ left: number; top: number; accent?: string; opacity?: number }> = ({
  left,
  top,
  accent = T.cyan,
  opacity = 1,
}) => (
  <div style={{ position: 'absolute', left, top, width: 240, height: 125, opacity }}>
    <div
      style={{
        position: 'absolute',
        left: 18,
        top: 6,
        width: 200,
        height: 82,
        borderRadius: '24px 24px 10px 10px',
        background: T.card,
        border: `5px solid ${accent}`,
        boxSizing: 'border-box',
      }}
    />
    <div style={{ position: 'absolute', left: 0, top: 91, width: 235, height: 12, borderRadius: 12, background: T.cardMuted, transform: 'skewX(-18deg)' }} />
    <div style={{ position: 'absolute', left: 31, top: 103, width: 205, height: 8, borderRadius: 8, background: accent }} />
  </div>
);

const LimitGauge: React.FC<{ progress: number }> = ({ progress }) => (
  <WarmCard
    accent={T.green}
    style={{ position: 'absolute', right: 105, top: 235, width: 410, height: 175, padding: '24px 30px', opacity: progress }}
  >
    <div style={{ color: T.green, fontFamily: T.mono, fontSize: 18, fontWeight: 950, letterSpacing: 2 }}>LIMITING FRICTION</div>
    <div style={{ position: 'absolute', left: 30, right: 30, top: 86, height: 28, borderRadius: 14, background: `${T.ink}22`, overflow: 'hidden' }}>
      <div style={{ width: `${90 * progress}%`, height: '100%', borderRadius: 14, background: `linear-gradient(90deg, ${T.cyan}, ${T.amber})` }} />
      <div style={{ position: 'absolute', right: '10%', top: -8, width: 5, height: 44, background: T.red }} />
    </div>
    <div style={{ position: 'absolute', left: 30, right: 30, bottom: 19, display: 'flex', justifyContent: 'space-between', color: T.ink, fontFamily: T.mono, fontSize: 16, fontWeight: 800 }}>
      <span>needed</span><span style={{ color: T.red }}>limit</span>
    </div>
  </WarmCard>
);

const Scene05: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const iceAt = cueAt(scene, 'ice');
  const sandAt = cueAt(scene, 'sand');
  const limitAt = cueAt(scene, 'limit');
  const opposes = useSpringAt(cueAt(scene, 'opposes'), 24);
  const ice = useSpringAt(iceAt, 24);
  const sand = useSpringAt(sandAt, 25);
  const limit = useSpringAt(limitAt, 30);
  const directionOpacity = opposes * Math.max(0, 1 - ice);
  const iceX = 760 + useProgress(iceAt, sandAt) * 120;
  const sandX = 770 + useProgress(sandAt, limitAt) * 150;

  return (
    <SceneShell scene={5} label="friction">
      <SectionTitle kicker="surface test">Rough-surface test</SectionTitle>
      <LimitGauge progress={limit} />

      <LabBlock
        width={180}
        height={110}
        style={{ position: 'absolute', left: 700, top: 270, opacity: directionOpacity }}
      />
      <ForceArrow x={880} y={325} length={205} angle={0} progress={opposes} label="MOTION" color={T.cyan} labelOffset={-36} opacity={directionOpacity} />
      <ForceArrow x={700} y={345} length={180} angle={180} progress={opposes} label="FRICTION" labelOffset={40} opacity={directionOpacity} />

      <div style={{ position: 'absolute', left: 165, top: 425, width: 1590, height: 195, borderRadius: 24, border: `2px solid ${T.cyan}44`, background: `linear-gradient(180deg, ${T.cyan}20, ${T.panel} 70%)`, overflow: 'hidden', opacity: 0.28 + ice * 0.72 }}>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} style={{ position: 'absolute', left: index * 150 - 40, top: 140, width: 210, height: 3, background: `${T.cyanSoft}77`, transform: 'rotate(-8deg)' }} />
        ))}
      </div>
      <Sled left={iceX} top={455} opacity={ice} />
      <ForceArrow x={iceX + 240} y={510} length={330} angle={0} progress={ice} label="MOTION" color={T.cyan} labelOffset={-39} />
      <ForceArrow x={iceX} y={555} length={125} angle={180} progress={ice} label="FRICTION" labelOffset={42} />

      <div style={{ position: 'absolute', left: 165, top: 720, width: 1590, height: 195, borderRadius: 24, border: `2px solid ${T.amber}44`, background: `radial-gradient(circle at 18px 18px, ${T.amber}55 0 5px, transparent 6px), radial-gradient(circle at 48px 38px, ${T.cardMuted}33 0 4px, transparent 5px), ${T.panel}`, backgroundSize: '70px 55px', overflow: 'hidden', opacity: sand }}>
      </div>
      <Sled left={sandX} top={750} accent={T.amber} opacity={sand} />
      <ForceArrow x={sandX + 240} y={805} length={330} angle={0} progress={opposes * sand} label="MOTION" color={T.cyan} labelOffset={-39} />
      <ForceArrow x={sandX} y={850} length={310} angle={180} progress={opposes * sand} label="FRICTION" labelOffset={42} />
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S06 — DRIVING, BRAKING AND AIR RESISTANCE
// ─────────────────────────────────────────────────────────────────────────────

const Scene06: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const drivingAt = cueAt(scene, 'driving');
  const balanceAt = cueAt(scene, 'balance');
  const driving = useSpringAt(drivingAt, 27);
  const braking = useSpringAt(cueAt(scene, 'braking'), 25);
  const air = useSpringAt(cueAt(scene, 'air-resistance'), 26);
  const balance = useSpringAt(balanceAt, 30);
  const buildSpeed = useProgress(drivingAt, balanceAt);
  const carX = 680 + buildSpeed * 120;
  const windShift = (frame * (3 + buildSpeed * 5)) % 180;

  return (
    <SceneShell scene={6} label="vehicle forces">
      <SectionTitle kicker="wind-tunnel run">Wind-tunnel force test</SectionTitle>

      <div style={{ position: 'absolute', left: 115, top: 280, width: 1690, height: 550, borderRadius: 34, background: `${T.panel}db`, border: `3px solid ${T.cyan}55`, overflow: 'hidden' }}>
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} style={{ position: 'absolute', left: -180 + windShift, top: 72 + row * 78, width: 1940, height: 4, opacity: 0.22 + air * 0.55, background: `repeating-linear-gradient(90deg, ${T.cyan} 0 92px, transparent 92px 175px)` }} />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 62, height: 7, background: `${T.card}77` }} />
        <div style={{ position: 'absolute', left: 38, top: 28, color: T.cyan, fontFamily: T.mono, fontSize: 19, fontWeight: 900, letterSpacing: 2 }}>CYAN AIRFLOW · TEST BAY 06</div>
      </div>

      <LabCar style={{ left: carX, top: 500, transform: `rotate(${(1 - balance) * driving * -1.8}deg)` }} />
      <ForceArrow x={carX + 286} y={580} length={285} angle={0} progress={driving} label="DRIVING" labelOffset={-46} />
      <ForceArrow x={carX + 16} y={568} length={175} angle={180} progress={braking} label="BRAKING" labelOffset={48} />
      <ForceArrow x={carX + 16} y={620} length={245} angle={180} progress={air} label="AIR RESISTANCE" labelOffset={-47} labelAlong={0.58} />

      <WarmCard
        accent={T.green}
        style={{
          position: 'absolute',
          left: 560,
          top: 835,
          width: 800,
          height: 145,
          padding: '22px 30px',
          opacity: balance,
          transform: `translateY(${(1 - balance) * 28}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ color: T.green, fontFamily: T.mono, fontSize: 18, fontWeight: 950, letterSpacing: 2 }}>FORCES BALANCED</div>
          <div style={{ flex: 1, height: 18, borderRadius: 9, background: T.amber }} />
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 25, fontWeight: 950 }}>=</div>
          <div style={{ flex: 1, height: 18, borderRadius: 9, background: T.amber }} />
        </div>
        <div style={{ marginTop: 17, textAlign: 'center', color: T.ink, fontSize: 27, fontWeight: 900 }}>constant velocity · engine working</div>
      </WarmCard>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S07 — A BOOK ON A SLOPE
// ─────────────────────────────────────────────────────────────────────────────

const Scene07: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const vertical = useSpringAt(cueAt(scene, 'vertical'), 25);
  const perpendicular = useSpringAt(cueAt(scene, 'perpendicular'), 27);
  const downhill = useSpringAt(cueAt(scene, 'downhill'), 27);
  const friction = useSpringAt(cueAt(scene, 'friction'), 25);
  const atRest = useSpringAt(cueAt(scene, 'remains-at-rest'), 30);
  const angle = -18;
  const radians = angle * Math.PI / 180;
  const contactX = 900;
  const contactY = 700;
  const centerX = contactX + 76 * Math.sin(radians);
  const centerY = contactY - 76 * Math.cos(radians);
  const weightLength = 300;
  const downhillAngle = angle + 180;
  const intoSlopeAngle = angle + 90;
  const downhillLength = weightLength * Math.sin(Math.abs(radians));
  const normalComponentLength = weightLength * Math.cos(Math.abs(radians));
  const downhillEndX = centerX + Math.cos(downhillAngle * Math.PI / 180) * downhillLength;
  const downhillEndY = centerY + Math.sin(downhillAngle * Math.PI / 180) * downhillLength;
  const normalEndX = centerX + Math.cos(intoSlopeAngle * Math.PI / 180) * normalComponentLength;
  const normalEndY = centerY + Math.sin(intoSlopeAngle * Math.PI / 180) * normalComponentLength;
  const weightEndY = centerY + weightLength;

  return (
    <SceneShell scene={7} label="rough slope">
      <SectionTitle kicker="inclined-plane test">Will the book slide?</SectionTitle>

      <div
        style={{
          position: 'absolute',
          left: contactX - 665,
          top: contactY - 22,
          width: 1330,
          height: 44,
          borderRadius: 18,
          background: `repeating-linear-gradient(90deg, ${T.cyan} 0 20px, ${T.panelLight} 20px 32px)`,
          boxShadow: `0 0 24px ${T.cyan}44`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '665px 22px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: contactX - 145,
          top: contactY - 152,
          width: 290,
          height: 152,
          borderRadius: '13px 24px 24px 13px',
          background: T.card,
          border: `5px solid ${T.cyan}`,
          boxSizing: 'border-box',
          boxShadow: '0 20px 42px #0008',
          transform: `rotate(${angle}deg)`,
          transformOrigin: '145px 152px',
        }}
      >
        <div style={{ position: 'absolute', left: 24, top: 25, bottom: 25, width: 8, borderRadius: 5, background: T.amber }} />
        <div style={{ position: 'absolute', left: 58, right: 28, top: 42, height: 5, background: `${T.ink}44` }} />
        <div style={{ position: 'absolute', left: 58, right: 58, top: 74, height: 5, background: `${T.ink}33` }} />
        <div style={{ position: 'absolute', left: 58, right: 42, top: 106, height: 5, background: `${T.ink}33` }} />
      </div>

      <ForceArrow x={centerX} y={centerY} length={weightLength} angle={90} progress={vertical} label="WEIGHT" labelOffset={-55} />
      <ForceArrow x={centerX} y={centerY} length={260} angle={angle - 90} progress={perpendicular} label="REACTION" labelOffset={46} />
      <RightAngle x={contactX} y={contactY} angle={angle} opacity={perpendicular} />

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: downhill * 0.42 }}>
        <polygon
          points={`${centerX},${centerY} ${downhillEndX},${downhillEndY} ${centerX},${weightEndY} ${normalEndX},${normalEndY}`}
          fill={`${T.cyanSoft}20`}
          stroke={T.cyanSoft}
          strokeWidth="5"
          strokeDasharray="14 11"
        />
        <line x1={downhillEndX} y1={downhillEndY} x2={centerX} y2={weightEndY} stroke={T.cyanSoft} strokeWidth="5" strokeDasharray="14 11" />
        <line x1={normalEndX} y1={normalEndY} x2={centerX} y2={weightEndY} stroke={T.cyanSoft} strokeWidth="5" strokeDasharray="14 11" />
      </svg>
      <ForceArrow x={centerX} y={centerY} length={downhillLength} angle={downhillAngle} progress={downhill} color={T.cyanSoft} dashed label="DOWN-SLOPE" labelOffset={-43} labelAlong={0.72} opacity={0.82} />
      <ForceArrow x={centerX} y={centerY} length={normalComponentLength} angle={intoSlopeAngle} progress={downhill} color={T.cyanSoft} dashed opacity={0.42} />
      <ForceArrow x={centerX} y={centerY} length={250} angle={angle} progress={friction} label="FRICTION" labelOffset={-58} labelAlong={0.92} />

      <WarmCard
        accent={T.green}
        style={{
          position: 'absolute',
          right: 115,
          top: 285,
          width: 405,
          height: 230,
          padding: '30px 35px',
          opacity: atRest,
          transform: `scale(${0.83 + atRest * 0.17})`,
        }}
      >
        <div style={{ color: T.green, fontFamily: T.mono, fontSize: 18, fontWeight: 950, letterSpacing: 2 }}>BALANCE SENSOR</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 19, marginTop: 26 }}>
          <div style={{ width: 80, height: 8, borderRadius: 8, background: T.amber }} />
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 52, fontWeight: 950 }}>0</div>
          <div style={{ width: 80, height: 8, borderRadius: 8, background: T.amber }} />
        </div>
        <div style={{ textAlign: 'center', color: T.ink, fontSize: 25, fontWeight: 850, marginTop: 17 }}>below the friction limit</div>
      </WarmCard>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S08 — BUILD THE FORCE DIAGRAM
// ─────────────────────────────────────────────────────────────────────────────

const RejectStamp: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: 1443,
      top: 535,
      width: 225,
      height: 118,
      border: `10px solid ${T.red}`,
      borderRadius: 19,
      color: T.red,
      fontFamily: T.mono,
      fontSize: 35,
      fontWeight: 950,
      letterSpacing: 3,
      display: 'grid',
      placeItems: 'center',
      transform: `rotate(-13deg) scale(${0.76 + opacity * 0.24})`,
      boxShadow: `0 0 25px ${T.red}55`,
      opacity,
      zIndex: 25,
    }}
  >
    NOT THIS
  </div>
);

const Scene08: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const isolate = useCue(cueAt(scene, 'isolate'), 0.5);
  const weight = useSpringAt(cueAt(scene, 'weight'), 23);
  const reaction = useSpringAt(cueAt(scene, 'reaction'), 23);
  const tension = useSpringAt(cueAt(scene, 'tension'), 23);
  const friction = useSpringAt(cueAt(scene, 'friction'), 23);
  const onlyForces = useSpringAt(cueAt(scene, 'only-forces'), 28);
  const originX = 900;
  const originY = 650;

  return (
    <SceneShell scene={8} label="force diagram">
      <SectionTitle kicker="one body at a time">Build the diagram</SectionTitle>

      <div style={{ opacity: 1 - isolate.opacity }}>
        <div style={{ position: 'absolute', left: 235, right: 230, top: 790, height: 35, borderRadius: 15, background: T.cyan, boxShadow: `0 0 24px ${T.cyan}55` }} />
        <div style={{ position: 'absolute', left: 1050, top: 645, width: 455, height: 8, borderRadius: 8, background: T.cardMuted }} />
        <Person style={{ left: 1500, top: 485 }} />
        <div style={{ position: 'absolute', left: 270, top: 510, color: T.textMuted, fontFamily: T.mono, fontSize: 20, letterSpacing: 2 }}>TABLE + PERSON + ROOM</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 702,
          top: 445,
          width: 396,
          height: 405,
          borderRadius: '50%',
          border: `3px dashed ${T.cyan}`,
          opacity: isolate.opacity,
          transform: `scale(${0.82 + isolate.opacity * 0.18})`,
          boxShadow: `0 0 50px ${T.cyan}22`,
        }}
      />
      <LabBlock width={300} height={220} label="5 kg" style={{ position: 'absolute', left: 750, top: 540, zIndex: 8 }} />
      <div
        style={{
          position: 'absolute',
          left: originX - 12,
          top: originY - 12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: T.amber,
          boxShadow: `0 0 19px ${T.amber}`,
          opacity: Math.max(weight, reaction, tension, friction),
          zIndex: 13,
        }}
      />

      <ForceArrow x={originX} y={originY} length={285} angle={90} progress={weight} label="WEIGHT" labelOffset={-54} />
      <ForceArrow x={originX} y={originY} length={285} angle={-90} progress={reaction} label="REACTION" labelOffset={-58} />
      <ForceArrow x={originX} y={originY} length={340} angle={0} progress={tension} label="TENSION" labelOffset={-49} />
      <ForceArrow x={originX} y={originY} length={310} angle={180} progress={friction} label="FRICTION" labelOffset={47} />

      <div
        style={{
          position: 'absolute',
          right: 115,
          top: 315,
          width: 395,
          height: 475,
          borderRadius: 25,
          border: `2px solid ${T.red}66`,
          background: `${T.panel}ee`,
          opacity: onlyForces,
        }}
      >
        <div style={{ color: T.red, fontFamily: T.mono, fontSize: 18, fontWeight: 950, letterSpacing: 2, padding: '22px 25px' }}>REJECTED TARGET</div>
        <Person style={{ left: 145, top: 115 }} opacity={0.35} />
        <svg width="395" height="475" style={{ position: 'absolute', inset: 0 }}>
          <line x1="192" y1="240" x2="328" y2="240" stroke={T.red} strokeWidth="9" strokeLinecap="round" />
          <polygon points="344,240 318,224 318,256" fill={T.red} />
        </svg>
      </div>
      <RejectStamp opacity={onlyForces} />

      <div
        style={{
          position: 'absolute',
          left: 635,
          top: 890,
          width: 530,
          textAlign: 'center',
          color: T.green,
          fontFamily: T.mono,
          fontSize: 23,
          fontWeight: 950,
          letterSpacing: 2.1,
          opacity: onlyForces,
        }}
      >
        ONLY FORCES ON THIS BLOCK ✓
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S09 — FROM ARROWS TO AN EQUATION
// ─────────────────────────────────────────────────────────────────────────────

const Scene09: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const vertically = useSpringAt(cueAt(scene, 'vertically'), 27);
  const horizontally = useSpringAt(cueAt(scene, 'horizontally'), 27);
  const remaining = useSpringAt(cueAt(scene, 'remaining-force'), 27);
  const acceleratesAt = cueAt(scene, 'accelerates');
  const accelerates = useSpringAt(acceleratesAt, 27);
  const travel = useProgress(acceleratesAt, scene.duration - 0.35);

  return (
    <SceneShell scene={9} label="force equations">
      <SectionTitle kicker="read the arrows">The diagram writes the equations</SectionTitle>

      <WarmCard accent={T.cyan} style={{ position: 'absolute', left: 90, top: 270, width: 650, height: 655, padding: '26px 30px' }}>
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 19, fontWeight: 950, letterSpacing: 2 }}>DOCKED FORCE DIAGRAM</div>
        <div style={{ position: 'absolute', left: 229, top: 225, width: 190, height: 155, borderRadius: 18, background: T.cardMuted, border: `4px solid ${T.ink}`, display: 'grid', placeItems: 'center', fontFamily: T.mono, fontSize: 26, fontWeight: 950 }}>5 kg</div>
        <div style={{ position: 'absolute', left: 314, top: 292, width: 20, height: 20, borderRadius: '50%', background: T.amber, zIndex: 3 }} />
        <div style={{ position: 'absolute', left: 94, right: 94, bottom: 44, borderRadius: 14, background: `${T.cyan}18`, padding: '16px 18px', textAlign: 'center', color: T.ink, fontSize: 23, fontWeight: 850 }}>four forces · one body</div>
      </WarmCard>
      <ForceArrow x={414} y={573} length={145} angle={-90} progress={1} label="R" labelOffset={-30} labelAlong={0.66} />
      <ForceArrow x={414} y={573} length={145} angle={90} progress={1} label="W" labelOffset={-30} labelAlong={0.66} />
      <ForceArrow x={414} y={573} length={170} angle={0} progress={1} label="T" labelOffset={-31} labelAlong={0.72} />
      <ForceArrow x={414} y={573} length={150} angle={180} progress={1} label="F" labelOffset={31} labelAlong={0.72} />

      <WarmCard
        accent={T.cyan}
        style={{
          position: 'absolute',
          left: 800,
          top: 270,
          width: 1010,
          height: 245,
          padding: '25px 32px',
          opacity: 0.18 + vertically * 0.82,
        }}
      >
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 18, fontWeight: 950, letterSpacing: 2 }}>VERTICAL RAIL</div>
        <div style={{ position: 'absolute', left: 68, right: 68, top: 110, height: 8, borderRadius: 8, background: `${T.ink}22` }} />
        <div style={{ position: 'absolute', left: 100, top: 82, width: 330 * vertically, height: 28, borderRadius: 14, background: T.amber }} />
        <div style={{ position: 'absolute', right: 100, top: 118, width: 330 * vertically, height: 28, borderRadius: 14, background: T.amber }} />
        <div style={{ position: 'absolute', left: 125, top: 154, color: T.ink, fontFamily: T.mono, fontSize: 25, fontWeight: 950, opacity: vertically }}>R ↑</div>
        <div style={{ position: 'absolute', right: 125, top: 154, color: T.ink, fontFamily: T.mono, fontSize: 25, fontWeight: 950, opacity: vertically }}>↓ W</div>
        <div style={{ position: 'absolute', left: 432, top: 152, color: T.green, fontFamily: T.mono, fontSize: 32, fontWeight: 950, opacity: vertically }}>R = W</div>
      </WarmCard>

      <WarmCard
        accent={T.amber}
        style={{
          position: 'absolute',
          left: 800,
          top: 545,
          width: 1010,
          height: 285,
          padding: '25px 32px',
          opacity: 0.18 + horizontally * 0.82,
        }}
      >
        <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 18, fontWeight: 950, letterSpacing: 2 }}>HORIZONTAL RAIL</div>
        <div style={{ position: 'absolute', left: 75, top: 93, color: T.ink, fontFamily: T.mono, fontSize: 23, fontWeight: 900 }}>TENSION</div>
        <div style={{ position: 'absolute', left: 245, top: 94, width: 480 * horizontally, height: 31, borderRadius: 16, background: T.amber }} />
        <div style={{ position: 'absolute', right: 65, top: 91, color: T.ink, fontFamily: T.mono, fontSize: 25, fontWeight: 950, opacity: horizontally }}>22 N</div>
        <div style={{ position: 'absolute', left: 75, top: 151, color: T.ink, fontFamily: T.mono, fontSize: 23, fontWeight: 900 }}>FRICTION</div>
        <div style={{ position: 'absolute', left: 245, top: 152, width: 321 * horizontally, height: 31, borderRadius: 16, background: `${T.amber}aa` }} />
        <div style={{ position: 'absolute', left: 592, top: 148, color: T.ink, fontFamily: T.mono, fontSize: 25, fontWeight: 950, opacity: horizontally }}>14.7 N</div>
        <div
          style={{
            position: 'absolute',
            left: 566,
            top: 94,
            width: 159,
            height: 31,
            borderRadius: 16,
            background: T.green,
            boxShadow: `0 0 18px ${T.green}66`,
            opacity: remaining,
            transform: `translate(${189 * remaining}px, ${116 * remaining}px)`,
          }}
        >
          <div style={{ position: 'absolute', left: -12, top: -35, width: 183, color: T.green, fontFamily: T.mono, fontSize: 20, fontWeight: 950, textAlign: 'center' }}>NET · 7.3 N</div>
        </div>
        <div style={{ position: 'absolute', left: 247, bottom: 27, width: 474, textAlign: 'center', color: T.ink, fontFamily: T.mono, fontSize: 25, fontWeight: 950, opacity: remaining }}>22 − 14.7 = <span style={{ color: T.amber }}>7.3 N →</span></div>
      </WarmCard>

      <div
        style={{
          position: 'absolute',
          left: 860,
          top: 870,
          width: 870,
          height: 75,
          opacity: accelerates,
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 49, height: 4, background: `${T.cyan}55` }} />
        <div style={{ position: 'absolute', left: 40 + travel * 390, top: 13, width: 115, height: 70, borderRadius: 12, background: T.card, border: `4px solid ${T.cyan}`, boxSizing: 'border-box' }} />
        <div style={{ position: 'absolute', right: 24, top: 8, width: 340, color: T.green, fontFamily: T.mono, fontSize: 27, fontWeight: 950, textAlign: 'right' }}>a = 7.3 ÷ 5<br />= 1.46 m/s² →</div>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S10 — TWENTY-SECOND RECAP
// ─────────────────────────────────────────────────────────────────────────────

const RecapTile: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  at: number;
  accent: string;
  title: string;
  children: React.ReactNode;
}> = ({ x, y, width, height, at, accent, title, children }) => {
  const reveal = useSpringAt(at, 24);
  return (
    <WarmCard
      accent={accent}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity: reveal,
        transform: `scale(${0.84 + reveal * 0.16})`,
        padding: '20px 24px',
      }}
    >
      <div style={{ color: accent, fontFamily: T.mono, fontSize: 17, fontWeight: 950, letterSpacing: 2 }}>{title}</div>
      {children}
    </WarmCard>
  );
};

const Scene10: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const weightAt = cueAt(scene, 'weight');
  const weight = useSpringAt(weightAt, 22);
  const reaction = useSpringAt(cueAt(scene, 'reaction'), 22);
  const tensionAt = cueAt(scene, 'tension');
  const tension = useSpringAt(tensionAt, 22);
  const thrust = useSpringAt(cueAt(scene, 'thrust'), 22);
  const frictionAt = cueAt(scene, 'friction');
  const friction = useSpringAt(frictionAt, 22);
  const resistance = useSpringAt(cueAt(scene, 'resistance'), 22);
  const drivingAt = cueAt(scene, 'driving-force');
  const driving = useSpringAt(drivingAt, 22);
  const oneBody = useSpringAt(cueAt(scene, 'one-body'), 31);

  return (
    <SceneShell scene={10} label="recap">
      <SectionTitle kicker="rapid force scan">Five mechanics-lab callbacks</SectionTitle>

      <RecapTile x={80} y={255} width={560} height={270} at={weightAt} accent={T.amber} title="WEIGHT + REACTION">
        <div style={{ position: 'absolute', left: 205, top: 104, width: 150, height: 100, borderRadius: 15, background: T.cardMuted, border: `4px solid ${T.ink}` }} />
        <div style={{ position: 'absolute', left: 80, right: 80, bottom: 24, height: 10, borderRadius: 8, background: T.cyan }} />
      </RecapTile>
      <ForceArrow x={360} y={390} length={90} angle={90} progress={weight} label="W" labelOffset={-27} labelAlong={0.74} />
      <ForceArrow x={360} y={390} length={90} angle={-90} progress={reaction} label="R" labelOffset={-27} labelAlong={0.74} />

      <RecapTile x={680} y={255} width={560} height={270} at={tensionAt} accent={T.cyan} title="STRING / ROD">
        <div style={{ position: 'absolute', left: 45, top: 143, width: 315, height: thrust > 0.5 ? 18 : 8, background: thrust > 0.5 ? `repeating-linear-gradient(90deg, ${T.amber} 0 20px, ${T.cardMuted} 20px 28px)` : T.ink, borderRadius: 7 }} />
        <div style={{ position: 'absolute', left: 360, top: 94, width: 145, height: 110, borderRadius: 14, background: T.cardMuted, border: `4px solid ${T.ink}` }} />
        <div style={{ position: 'absolute', left: 92, bottom: 20, color: thrust > 0.5 ? T.amber : T.cyan, fontFamily: T.mono, fontSize: 21, fontWeight: 950 }}>{thrust > 0.5 ? 'THRUST →' : '← TENSION'}</div>
      </RecapTile>
      <ForceArrow x={1040} y={400} length={160} angle={thrust > 0.5 ? 0 : 180} progress={tension} label={thrust > 0.5 ? 'PUSH' : 'PULL'} labelOffset={-34} strokeWidth={8} />

      <RecapTile x={1280} y={255} width={560} height={270} at={frictionAt} accent={T.amber} title="FRICTION + RESISTANCE">
        <div style={{ position: 'absolute', left: 42, right: 42, top: 178, height: 45, borderRadius: 12, background: `radial-gradient(circle at 12px 12px, ${T.amber}88 0 4px, transparent 5px), ${T.ink}22`, backgroundSize: '32px 27px' }} />
        <div style={{ position: 'absolute', left: 245, top: 92, width: 165, height: 88, borderRadius: 18, background: T.cardMuted, border: `4px solid ${T.ink}` }} />
        {[0, 1, 2].map((row) => <div key={row} style={{ position: 'absolute', right: 35, top: 76 + row * 35, width: 100, height: 4, background: T.cyan, opacity: resistance }} />)}
      </RecapTile>
      <ForceArrow x={1525} y={405} length={145} angle={180} progress={friction} label="OPPOSE" labelOffset={34} strokeWidth={8} />

      <RecapTile x={265} y={565} width={650} height={305} at={drivingAt} accent={T.green} title="CAR FORCE BALANCE">
        <div style={{ transform: 'scale(0.58)', transformOrigin: 'top left' }}>
          <LabCar style={{ left: 245, top: 135 }} />
        </div>
        <div style={{ position: 'absolute', left: 74, right: 74, bottom: 37, height: 6, background: `${T.ink}22` }} />
        <div style={{ position: 'absolute', left: 112, bottom: 30, width: 155, height: 20, borderRadius: 10, background: T.amber }} />
        <div style={{ position: 'absolute', right: 112, bottom: 30, width: 155, height: 20, borderRadius: 10, background: T.amber }} />
        <div style={{ position: 'absolute', left: 282, bottom: 24, color: T.green, fontFamily: T.mono, fontSize: 25, fontWeight: 950 }}>=</div>
      </RecapTile>

      <RecapTile x={1005} y={565} width={650} height={305} at={drivingAt} accent={T.cyan} title="ONE ISOLATED BODY">
        <div style={{ position: 'absolute', left: 245, top: 97, width: 160, height: 120, borderRadius: 16, background: T.cardMuted, border: `4px solid ${T.ink}` }} />
        <div style={{ position: 'absolute', left: 315, top: 147, width: 20, height: 20, borderRadius: '50%', background: T.amber }} />
      </RecapTile>
      <ForceArrow x={1330} y={720} length={115} angle={0} progress={driving} strokeWidth={8} />
      <ForceArrow x={1330} y={720} length={115} angle={180} progress={driving} strokeWidth={8} />
      <ForceArrow x={1330} y={720} length={105} angle={90} progress={driving} strokeWidth={8} />
      <ForceArrow x={1330} y={720} length={105} angle={-90} progress={driving} strokeWidth={8} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `${T.bgDeep}ed`,
          opacity: oneBody,
          zIndex: 40,
        }}
      />
      <WarmCard
        accent={T.amber}
        style={{
          position: 'absolute',
          left: 300,
          top: 255,
          width: 1320,
          height: 620,
          opacity: oneBody,
          transform: `scale(${0.82 + oneBody * 0.18})`,
          zIndex: 42,
          padding: '45px 60px',
        }}
      >
        <div style={{ textAlign: 'center', color: T.textMuted, fontFamily: T.mono, fontSize: 20, fontWeight: 950, letterSpacing: 3 }}>FOR EVERY FORCE DIAGRAM</div>
        <div style={{ position: 'absolute', left: 535, top: 175, width: 250, height: 170, borderRadius: 20, background: T.cardMuted, border: `5px solid ${T.ink}` }} />
        <div style={{ position: 'absolute', left: 648, top: 247, width: 24, height: 24, borderRadius: '50%', background: T.amber }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center', color: T.ink, fontSize: 57, fontWeight: 950 }}>One body. Every force on it.</div>
      </WarmCard>
      <div style={{ position: 'absolute', inset: 0, zIndex: 45, opacity: oneBody, pointerEvents: 'none' }}>
        <ForceArrow x={960} y={515} length={205} angle={0} progress={oneBody} label="T" labelOffset={-35} />
        <ForceArrow x={960} y={515} length={205} angle={180} progress={oneBody} label="F" labelOffset={35} />
        <ForceArrow x={960} y={515} length={160} angle={90} progress={oneBody} label="W" labelOffset={-34} />
        <ForceArrow x={960} y={515} length={160} angle={-90} progress={oneBody} label="R" labelOffset={-34} />
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

export const MechanicsTypesOfForces: React.FC<MechanicsTypesOfForcesProps> = ({
  audioEnabled = true,
}) => {
  const { fps } = useVideoConfig();
  const transition = (
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
  );

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
      </TransitionSeries>
    </AbsoluteFill>
  );
};
