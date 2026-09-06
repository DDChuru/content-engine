/**
 * Modelling Assumptions
 *
 * Eight narration-led mechanics-lab scenes. Brisk definition scenes use
 * Whisper cues; the two slow scenes preserve the storyboard's thinking time,
 * pen pace, and exact motion-free holds.
 */

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from '@remotion/transitions';
import transcriptJson from '../public/transcripts/mechanics/modelling-assumptions.json';

const TRANSITION_FRAMES = 15;
const SCENE_SECONDS = [20, 20, 20, 20, 15, 75, 50, 20] as const;

const T = {
  bg: '#081521',
  bgDeep: '#03101a',
  panel: '#102a3a',
  panelLight: '#183b4d',
  paper: '#F7F1E6',
  paperLine: '#9bbdcc',
  ink: '#152a3a',
  text: '#fffaf0',
  muted: '#a8bdc7',
  cyan: '#56D6E5',
  amber: '#F5A623',
  teal: '#49cbb2',
  coral: '#ef7568',
  green: '#77d59a',
  purple: '#b69cff',
  red: '#c94b42',
  sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
};

type FadeThroughProps = { background: string };

const FadeThrough: React.FC<TransitionPresentationComponentProps<FadeThroughProps>> = ({
  children,
  passedProps,
  presentationDirection,
  presentationProgress,
}) => {
  const opacity = presentationDirection === 'exiting'
    ? interpolate(presentationProgress, [0, 0.5], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    : interpolate(presentationProgress, [0.5, 1], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return <AbsoluteFill style={{ background: passedProps.background, opacity }}>{children}</AbsoluteFill>;
};

const fadeThroughGraphite: TransitionPresentation<FadeThroughProps> = {
  component: FadeThrough,
  props: { background: T.bg },
};

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

interface TranscriptScene {
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
  scenes: TranscriptScene[];
  totalDuration: number;
  generatedAt: string;
  engine: string;
}

const TRANSCRIPT = transcriptJson as unknown as MechanicsTranscript;

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

function cueAt(scene: TranscriptScene, cueName: string): number {
  const match = Object.entries(scene.cues).find(([name]) => normalize(name) === normalize(cueName));
  return match?.[1] ?? scene.duration + 1;
}

function wordAt(scene: TranscriptScene, word: string, fallback: number, occurrence = 1): number {
  const matches = scene.words.filter((candidate) => normalize(candidate.word) === normalize(word));
  return matches[occurrence - 1]?.start ?? fallback;
}

function getScene(id: string): TranscriptScene {
  const scene = TRANSCRIPT.scenes.find((candidate) => candidate.id === id);
  if (!scene) throw new Error(`Missing transcript scene: ${id}`);
  return scene;
}

function sequenceDurationInFrames(index: number, fps: number): number {
  return SCENE_SECONDS[index] * fps + (index < SCENE_SECONDS.length - 1 ? TRANSITION_FRAMES : 0);
}

export function getMechanicsModellingAssumptionsDuration(fps: number): number {
  return SCENE_SECONDS.reduce((sum, seconds) => sum + seconds * fps, 0);
}

export interface MechanicsModellingAssumptionsProps {
  audioEnabled?: boolean;
}

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));
const mix = (from: number, to: number, progress: number): number => from + (to - from) * progress;

function progressBetween(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function secondsProgress(frame: number, fps: number, start: number, end: number): number {
  return progressBetween(frame, start * fps, end * fps);
}

function useCue(cueTimeSeconds: number, fadeDuration = 0.5): { opacity: number; isActive: boolean } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { opacity, isActive: frame >= cueFrame };
}

const darkInk = (color: string): string => ({
  [T.cyan]: '#087782',
  [T.amber]: '#8c5200',
  [T.teal]: '#15705f',
  [T.coral]: '#a5342d',
  [T.green]: '#216c42',
  [T.purple]: '#653c97',
}[color] ?? color);

const LabShell: React.FC<{
  scene: number;
  label: string;
  children: React.ReactNode;
}> = ({ scene, label, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden', isolation: 'isolate', background: T.bg, fontFamily: T.sans }}>
    <AbsoluteFill style={{ background: `radial-gradient(circle at 18% 12%, ${T.cyan}12, transparent 34%), radial-gradient(circle at 88% 84%, ${T.amber}0d, transparent 31%), linear-gradient(145deg, ${T.bgDeep}, ${T.bg})` }} />
    <AbsoluteFill style={{ opacity: 0.11, backgroundImage: `linear-gradient(${T.cyan}2a 1px, transparent 1px), linear-gradient(90deg, ${T.cyan}2a 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
    <div style={{ position: 'absolute', left: 58, top: 43, color: T.muted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2.5 }}>MECHANICS LAB · MODEL BAY</div>
    <div style={{ position: 'absolute', right: 58, top: 39, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 999, border: `1px solid ${T.cyan}66`, background: `${T.bgDeep}ee`, color: T.muted, fontFamily: T.mono, fontSize: 28, letterSpacing: 1.2, whiteSpace: 'nowrap', zIndex: 40 }}>
      <span style={{ color: T.cyan, fontWeight: 950 }}>{String(scene).padStart(2, '0')} / 08</span>
      <span>{label.toUpperCase()}</span>
    </div>
    {children}
    <div style={{ position: 'absolute', left: 58, right: 58, bottom: 34, height: 2, background: `linear-gradient(90deg, transparent, ${T.cyan}66 14%, ${T.cyan}66 86%, transparent)` }} />
  </AbsoluteFill>
);

const SectionTitle: React.FC<{ kicker: string; children: React.ReactNode }> = ({ kicker, children }) => (
  <div style={{ position: 'absolute', left: 76, top: 101, zIndex: 20 }}>
    <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 28, fontWeight: 900, letterSpacing: 2.2, textTransform: 'uppercase' }}>{kicker}</div>
    <div style={{ color: T.text, fontSize: 49, lineHeight: 1.08, fontWeight: 930, marginTop: 7 }}>{children}</div>
  </div>
);

const Reveal: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  fromX?: number;
  fromY?: number;
}> = ({ at, children, style, fromX = 0, fromY = 20 }) => {
  const cue = useCue(at, 0.38);
  return (
    <div style={{ opacity: cue.opacity, transform: `translate(${(1 - cue.opacity) * fromX}px, ${(1 - cue.opacity) * fromY}px)`, ...style }}>
      {children}
    </div>
  );
};

const PaperCard: React.FC<{
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, accent = T.cyan, style }) => (
  <div style={{ borderRadius: 22, background: T.paper, color: T.ink, border: `3px solid ${accent}`, boxShadow: `0 17px 50px #0008, 0 0 24px ${accent}14`, ...style }}>
    {children}
  </div>
);

const IndexTray: React.FC<{
  title: string;
  items: Array<{ at: number; term: string; consequence: string; color?: string }>;
}> = ({ title, items }) => (
  <div style={{ position: 'absolute', right: 58, top: 173, width: 438, height: 838, borderRadius: 28, border: `2px solid ${T.cyan}66`, background: `${T.bgDeep}ed`, padding: '24px 22px', boxShadow: '0 20px 55px #0008' }}>
    <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 1.8 }}>{title}</div>
    <div style={{ height: 2, background: `${T.cyan}55`, margin: '18px 0' }} />
    <div style={{ display: 'grid', gap: 14 }}>
      {items.map((item) => (
        <Reveal key={item.term} at={item.at} fromX={22} fromY={0}>
          <PaperCard accent={item.color ?? T.cyan} style={{ padding: '13px 16px' }}>
            <div style={{ color: darkInk(item.color ?? T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>{item.term}</div>
            <div style={{ color: T.ink, fontSize: 28, lineHeight: 1.13, fontWeight: 780, marginTop: 5 }}>{item.consequence}</div>
          </PaperCard>
        </Reveal>
      ))}
    </div>
  </div>
);

const StatusPill: React.FC<{ label: string; value: string; active?: boolean; color?: string }> = ({ label, value, active = true, color = T.cyan }) => (
  <div style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 14, border: `2px solid ${active ? color : T.muted}88`, background: active ? `${color}18` : '#172631', color: active ? color : T.muted, fontFamily: T.mono }}>
    <div style={{ fontSize: 28, fontWeight: 900 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{value}</div>
  </div>
);

const ArrowMarker: React.FC<{ id: string; color: string }> = ({ id, color }) => (
  <marker id={id} markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
    <path d="M0 0 L12 6 L0 12 Z" fill={color} />
  </marker>
);

// ─────────────────────────────────────────────────────────────────────────────
// Path-only ink player used by the worked example
// ─────────────────────────────────────────────────────────────────────────────

type Point = readonly [number, number];
type Glyph = Point[][];

const G: Record<string, Glyph> = {
  '0': [[[2, 2], [7, 0], [10, 3], [10, 13], [7, 16], [2, 14], [0, 4], [2, 2]]],
  '1': [[[2, 4], [6, 0], [6, 16]], [[2, 16], [10, 16]]],
  '2': [[[0, 3], [3, 0], [8, 0], [10, 3], [9, 6], [0, 16], [11, 16]]],
  '3': [[[0, 2], [4, 0], [9, 1], [10, 5], [7, 8], [10, 10], [10, 14], [7, 16], [2, 16], [0, 14]], [[4, 8], [7, 8]]],
  '4': [[[9, 16], [9, 0], [0, 11], [12, 11]]],
  '5': [[[10, 0], [1, 0], [0, 8], [7, 7], [10, 10], [9, 15], [5, 16], [1, 14]]],
  '6': [[[10, 1], [6, 0], [2, 3], [0, 10], [2, 15], [7, 16], [10, 13], [9, 9], [6, 7], [1, 9]]],
  '7': [[[0, 1], [11, 1], [4, 16]]],
  '8': [[[5, 8], [1, 6], [1, 2], [5, 0], [9, 2], [9, 6], [5, 8], [1, 10], [1, 14], [5, 16], [9, 14], [9, 10], [5, 8]]],
  '9': [[[10, 8], [7, 9], [2, 8], [0, 4], [2, 0], [7, 0], [10, 4], [9, 12], [6, 16], [2, 15]]],
  'T': [[[0, 1], [12, 1]], [[6, 1], [6, 16]]],
  'F': [[[1, 16], [1, 0], [11, 0]], [[1, 7], [9, 7]]],
  'N': [[[1, 16], [1, 0], [11, 16], [11, 0]]],
  'a': [[[9, 7], [6, 5], [2, 6], [0, 10], [2, 15], [6, 15], [9, 11]], [[9, 5], [9, 16]]],
  'g': [[[9, 7], [6, 5], [2, 6], [0, 10], [2, 14], [6, 15], [9, 11]], [[9, 5], [9, 18], [6, 21], [2, 20]]],
  'm': [[[0, 16], [0, 6], [4, 6], [5, 10], [7, 6], [11, 7], [11, 16]]],
  's': [[[10, 7], [7, 5], [2, 6], [1, 9], [8, 11], [10, 14], [7, 16], [1, 15]]],
  'f': [[[4, 16], [5, 3], [8, 0], [11, 1]], [[1, 7], [10, 7]]],
  '=': [[[0, 6], [12, 6]], [[0, 12], [12, 12]]],
  '+': [[[0, 9], [12, 9]], [[6, 3], [6, 15]]],
  '-': [[[0, 9], [11, 9]]],
  '/': [[[0, 18], [11, 0]]],
  '(': [[[9, 0], [5, 3], [3, 8], [3, 13], [6, 17], [9, 19]]],
  ')': [[[2, 0], [6, 3], [8, 8], [8, 13], [5, 17], [2, 19]]],
  '.': [[[4, 15], [5, 16]]],
  '~': [[[0, 10], [3, 7], [7, 12], [11, 8]]],
  '≈': [
    [[0, 6], [3, 4], [7, 8], [11, 5]],
    [[0, 13], [3, 11], [7, 15], [11, 12]],
  ],
};

const GLYPH_ADVANCE: Record<string, number> = { ' ': 7, '.': 6, '(': 9, ')': 9 };

interface InkStroke {
  id: string;
  points: Point[];
  d: string;
  startFrame: number;
  durationFrames: number;
  length: number;
  color: string;
  width: number;
}

function pointsPath(points: Point[]): string {
  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
}

function pointsLength(points: Point[]): number {
  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    length += Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]);
  }
  return Math.max(1, length);
}

function pointOnStroke(stroke: InkStroke, progress: number): Point {
  let remaining = stroke.length * clamp(progress);
  for (let index = 1; index < stroke.points.length; index += 1) {
    const start = stroke.points[index - 1];
    const end = stroke.points[index];
    const segment = Math.hypot(end[0] - start[0], end[1] - start[1]);
    if (remaining <= segment || index === stroke.points.length - 1) {
      const fraction = segment === 0 ? 0 : clamp(remaining / segment);
      return [mix(start[0], end[0], fraction), mix(start[1], end[1], fraction)];
    }
    remaining -= segment;
  }
  return stroke.points[stroke.points.length - 1];
}

function makeInkLine(options: {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  startFrame: number;
  endFrame: number;
  color?: string;
  width?: number;
}): InkStroke[] {
  const { id, text, x, y, scale, startFrame, endFrame, color = '#1b3f77', width = 3.4 } = options;
  const raw: Array<{ points: Point[]; length: number }> = [];
  let cursor = x;
  for (const char of text) {
    if (char === ' ') {
      cursor += GLYPH_ADVANCE[' '] * scale;
      continue;
    }
    const glyph = G[char];
    if (!glyph) {
      cursor += 12 * scale;
      continue;
    }
    for (const segment of glyph) {
      const points = segment.map(([px, py]) => [cursor + (px + py * 0.055) * scale, y + py * scale] as Point);
      raw.push({ points, length: pointsLength(points) });
    }
    cursor += (GLYPH_ADVANCE[char] ?? 14) * scale;
  }
  const totalLength = raw.reduce((sum, stroke) => sum + stroke.length, 0);
  const available = Math.max(raw.length, endFrame - startFrame - raw.length * 1.2);
  let nextFrame = startFrame;
  return raw.map((stroke, index) => {
    const durationFrames = Math.max(1, available * stroke.length / totalLength);
    const result: InkStroke = {
      id: `${id}-${index}`,
      points: stroke.points,
      d: pointsPath(stroke.points),
      startFrame: nextFrame,
      durationFrames,
      length: stroke.length,
      color,
      width,
    };
    nextFrame += durationFrames + 1.2;
    return result;
  });
}

const InkPlayback: React.FC<{
  strokes: InkStroke[];
  frame: number;
  showHand?: boolean;
}> = ({ strokes, frame, showHand = true }) => {
  let active: { stroke: InkStroke; progress: number } | null = null;
  const paths = strokes.map((stroke) => {
    const progress = progressBetween(frame, stroke.startFrame, stroke.startFrame + stroke.durationFrames);
    if (frame >= stroke.startFrame && frame < stroke.startFrame + stroke.durationFrames) {
      active = { stroke, progress };
    }
    if (progress <= 0) return null;
    return (
      <path
        key={stroke.id}
        d={stroke.d}
        fill="none"
        stroke={stroke.color}
        strokeWidth={stroke.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={stroke.length}
        strokeDashoffset={stroke.length * (1 - progress)}
      />
    );
  });
  const pen = active as { stroke: InkStroke; progress: number } | null;
  const penPoint = pen ? pointOnStroke(pen.stroke, pen.progress) : null;

  return (
    <g>
      {paths}
      {showHand && penPoint && (
        <g transform={`translate(${penPoint[0]} ${penPoint[1]}) rotate(-24)`}>
          <ellipse cx={25} cy={22} rx={25} ry={17} fill="#d8aa83" stroke="#845f48" strokeWidth={2.2} />
          <rect x={-7} y={-3} width={53} height={8} rx={4} fill={T.cyan} stroke={T.ink} strokeWidth={2} />
          <path d="M -10 1 L -2 -4 L -2 6 Z" fill={T.ink} />
          <circle cx={-10} cy={1} r={3.5} fill={T.ink} />
        </g>
      )}
    </g>
  );
};

const RuledPaper: React.FC<{
  children: React.ReactNode;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}> = ({ children, x = 0, y = 0, width = 870, height = 830 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={width} height={height} rx={24} fill={T.paper} stroke={T.amber} strokeWidth={3} />
    <g stroke={T.paperLine} strokeWidth={1.2} opacity={0.58}>
      {Array.from({ length: 15 }, (_, index) => 80 + index * 49).map((lineY) => (
        <path key={lineY} d={`M 25 ${lineY} H ${width - 24}`} />
      ))}
    </g>
    <path d={`M 76 28 V ${height - 24}`} stroke="#d67f78" strokeWidth={1.6} opacity={0.72} />
    {children}
  </g>
);

// ─────────────────────────────────────────────────────────────────────────────
// S01 — REALITY BECOMES A PARTICLE MODEL
// ─────────────────────────────────────────────────────────────────────────────

const Scene01: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const modelAt = cueAt(scene, 'model');
  const particleAt = cueAt(scene, 'particle');
  const pointAt = cueAt(scene, 'one-point');
  const separateAt = cueAt(scene, 'separate-choice');
  const scan = secondsProgress(frame, fps, modelAt, particleAt);
  const particle = secondsProgress(frame, fps, particleAt, particleAt + 0.8);
  const force = secondsProgress(frame, fps, pointAt, pointAt + 0.65);
  const drag = secondsProgress(frame, fps, separateAt, separateAt + 0.45);
  const crateX = mix(430, 560, particle);
  const crateY = mix(510, 500, particle);

  return (
    <LabShell scene={1} label="reality scanner">
      <SectionTitle kicker="model selection">Keep the effects that matter</SectionTitle>
      <div style={{ position: 'absolute', left: 58, top: 204, width: 1345, height: 770, borderRadius: 28, background: `${T.panel}e8`, border: `3px solid ${T.cyan}88`, boxShadow: '0 20px 58px #0008' }}>
        <svg width="1345" height="770" viewBox="0 0 1345 770">
          <defs>
            <ArrowMarker id="s01-cyan" color={T.cyan} />
            <ArrowMarker id="s01-amber" color={T.amber} />
            <pattern id="s01-grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.2" fill={T.ink} opacity="0.1" /><circle cx="14" cy="12" r="1" fill={T.ink} opacity="0.08" /></pattern>
          </defs>
          <rect x="30" y="42" width="1268" height="620" rx="24" fill={T.bgDeep} stroke={`${T.cyan}44`} strokeWidth="2" />
          <path d="M 72 600 H 1270" stroke={T.paper} strokeWidth="8" />
          <path d="M 104 624 H 1240" stroke={T.amber} strokeWidth="4" strokeDasharray="34 28" />

          <g opacity={1 - particle * 0.88}>
            <path d="M 215 225 C 290 195 345 255 415 220 C 470 194 510 230 553 215" fill="none" stroke={T.paper} strokeWidth="7" strokeLinecap="round" />
            {Array.from({ length: 8 }, (_, index) => (
              <path key={index} d={`M ${230 + index * 39} ${220 + Math.sin(index) * 12} q 18 34 36 5`} fill="none" stroke={T.muted} strokeWidth="2.5" />
            ))}
            <g transform="translate(365 470)">
              <rect x="-150" y="0" width="300" height="105" rx="18" fill={T.panelLight} stroke={T.cyan} strokeWidth="5" />
              <circle cx="-100" cy="111" r="25" fill={T.bgDeep} stroke={T.cyan} strokeWidth="5" />
              <circle cx="100" cy="111" r="25" fill={T.bgDeep} stroke={T.cyan} strokeWidth="5" />
              <path d="M -130 0 Q 0 -30 130 0" fill="none" stroke={T.coral} strokeWidth="5" />
            </g>
            <g opacity={0.4 + 0.6 * (1 - scan)}>
              {[0, 1, 2].map((index) => <path key={index} d={`M 785 ${260 + index * 48} q 70 -38 155 0 t 165 0`} fill="none" stroke={T.cyan} strokeWidth="5" opacity={0.55 - index * 0.1} />)}
            </g>
          </g>

          <g transform={`translate(${crateX} ${crateY})`}>
            <rect x={mix(-115, -16, particle)} y={mix(-105, -16, particle)} width={mix(230, 32, particle)} height={mix(210, 32, particle)} rx={mix(12, 16, particle)} fill={particle > 0.92 ? T.cyan : T.paper} stroke={T.amber} strokeWidth="6" />
            <rect x={mix(-115, -16, particle)} y={mix(-105, -16, particle)} width={mix(230, 32, particle)} height={mix(210, 32, particle)} rx="12" fill="url(#s01-grain)" opacity={1 - particle} />
            <path d="M -108 -95 L 108 95 M 108 -95 L -108 95" stroke={T.ink} strokeWidth="4" opacity={1 - particle} />
            <rect x="-76" y="45" width="152" height="61" rx="12" fill={T.ink} stroke={T.cyan} strokeWidth="3" />
            <text x="0" y="86" fill={T.cyan} textAnchor="middle" fontFamily={T.mono} fontSize="30" fontWeight="950">MASS ON</text>
            <g opacity={force}>
              <line x1="0" y1="-25" x2="0" y2="-170" stroke={T.cyan} strokeWidth="8" markerEnd="url(#s01-cyan)" />
              <line x1="0" y1="25" x2="0" y2="170" stroke={T.amber} strokeWidth="8" markerEnd="url(#s01-amber)" />
              <line x1="-25" y1="0" x2="-180" y2="0" stroke={T.cyan} strokeWidth="8" markerEnd="url(#s01-cyan)" />
              <line x1="25" y1="0" x2="180" y2="0" stroke={T.amber} strokeWidth="8" markerEnd="url(#s01-amber)" />
              <circle r="22" fill={T.paper} stroke={T.ink} strokeWidth="5" />
            </g>
            <g opacity={force * (1 - drag)}>
              <line x1="-35" y1="-62" x2="-185" y2="-62" stroke={T.amber} strokeWidth="7" strokeDasharray="12 8" markerEnd="url(#s01-amber)" />
              <text x="-104" y="-83" fill={T.amber} textAnchor="middle" fontFamily={T.mono} fontSize="28" fontWeight="950">DRAG</text>
            </g>
          </g>

          <g opacity={useCue(modelAt, 0.35).opacity}>
            <rect x={mix(55, 1130, scan)} y="75" width="20" height="540" rx="10" fill={T.cyan} opacity="0.9" />
            <rect x={mix(20, 1095, scan)} y="64" width="90" height="44" rx="12" fill={T.cyan} />
            <text x={mix(65, 1140, scan)} y="95" fill={T.ink} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">SCAN</text>
          </g>

          <foreignObject x="790" y="470" width="190" height="100">
            <StatusPill label="SHAPE" value={particle > 0.55 ? 'OFF' : 'ON'} active={particle <= 0.55} color={T.coral} />
          </foreignObject>
          <foreignObject x="990" y="470" width="205" height="100">
            <StatusPill label="ROTATION" value={particle > 0.55 ? 'OFF' : 'ON'} active={particle <= 0.55} color={T.coral} />
          </foreignObject>
          <g transform="translate(790 585)" opacity={useCue(separateAt, 0.35).opacity}>
            <rect width="384" height="76" rx="16" fill={T.panel} stroke={T.amber} strokeWidth="3" />
            <text x="22" y="48" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="900">AIR DRAG · OFF</text>
            <rect x="294" y="17" width="68" height="42" rx="21" fill={drag > 0.55 ? T.green : T.coral} />
            <circle cx={drag > 0.55 ? 341 : 315} cy="38" r="15" fill={T.paper} />
          </g>
          <g opacity={force}>
            <rect x="455" y="106" width="278" height="57" rx="12" fill={T.ink} stroke={T.cyan} strokeWidth="2" />
            <text x="594" y="145" textAnchor="middle" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950">ONE FORCE POINT</text>
          </g>
        </svg>
      </div>
      <IndexTray title="ASSUMPTION INDEX" items={[
        { at: particleAt, term: 'PARTICLE', consequence: 'mass kept · size removed', color: T.cyan },
        { at: separateAt, term: 'AIR RESISTANCE NEGLECTED', consequence: 'drag removed independently', color: T.amber },
      ]} />
    </LabShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S02 — LIGHT AND INEXTENSIBLE DO DIFFERENT JOBS
// ─────────────────────────────────────────────────────────────────────────────

const Scene02: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lightAt = cueAt(scene, 'light');
  const inertiaAt = cueAt(scene, 'rotational-inertia');
  const stretchyAt = cueAt(scene, 'stretchy');
  const lengthAt = cueAt(scene, 'keeps-its-length');
  const light = secondsProgress(frame, fps, lightAt, lightAt + 0.55);
  const inertia = secondsProgress(frame, fps, inertiaAt, inertiaAt + 0.55);
  const stretch = secondsProgress(frame, fps, stretchyAt, stretchyAt + 1.1);
  const taut = secondsProgress(frame, fps, lengthAt, lengthAt + 0.7);

  return (
    <LabShell scene={2} label="connector bench">
      <SectionTitle kicker="two independent controls">Light removes mass; inextensible locks length</SectionTitle>
      <div style={{ position: 'absolute', left: 58, top: 204, width: 1345, height: 770, borderRadius: 28, background: `${T.panel}ed`, border: `3px solid ${T.cyan}88`, boxShadow: '0 20px 58px #0008' }}>
        <svg width="1345" height="770" viewBox="0 0 1345 770">
          <defs>
            <ArrowMarker id="s02-cyan" color={T.cyan} />
            <ArrowMarker id="s02-amber" color={T.amber} />
          </defs>
          <g transform="translate(60 65)">
            <rect width="1175" height="235" rx="24" fill={T.bgDeep} stroke={`${T.cyan}55`} strokeWidth="2" />
            <text x="28" y="43" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950">LIGHT COMPONENT TEST</text>
            <path d="M 100 122 H 400" stroke={T.paper} strokeWidth="8" strokeLinecap="round" />
            <text x="250" y="183" fill={T.paper} fontSize="29" fontWeight="850" textAnchor="middle">STRING</text>
            <rect x="500" y="112" width="290" height="20" rx="8" fill={T.paper} stroke={T.cyan} strokeWidth="3" />
            <text x="645" y="183" fill={T.paper} fontSize="29" fontWeight="850" textAnchor="middle">ROD</text>
            <circle cx="990" cy="121" r="76" fill={T.panelLight} stroke={T.cyan} strokeWidth="7" />
            <circle cx="990" cy="121" r={mix(52, 9, inertia)} fill="none" stroke={T.amber} strokeWidth="7" strokeDasharray="12 9" opacity={1 - inertia * 0.8} />
            <text x="990" y="220" fill={T.paper} fontSize="29" fontWeight="850" textAnchor="middle">PULLEY</text>
            {[250, 645, 990].map((x, index) => (
              <g key={x} opacity={1 - light} transform={`translate(${x - 72} 55)`}>
                <rect width="144" height="54" rx="12" fill={T.coral} />
                <text x="72" y="37" fill={T.bgDeep} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">MASS</text>
                <path d="M 8 7 L 136 47" stroke={T.paper} strokeWidth="5" />
              </g>
            ))}
          </g>

          <g transform="translate(65 345)">
            <rect width="575" height="320" rx="24" fill={T.paper} stroke={T.coral} strokeWidth="3" />
            <text x="24" y="44" fill={darkInk(T.coral)} fontFamily={T.mono} fontSize="28" fontWeight="950">STRETCH TEST</text>
            <rect x="55" y="142" width="90" height="80" rx="12" fill={T.panel} />
            <rect x={mix(400, 455, stretch)} y="142" width="90" height="80" rx="12" fill={T.panel} />
            <path d={`M 145 182 ${Array.from({ length: 9 }, (_, index) => `L ${165 + index * mix(27, 33, stretch)} ${index % 2 ? 160 : 204}`).join(' ')} L ${mix(400, 455, stretch)} 182`} fill="none" stroke={T.amber} strokeWidth="6" strokeLinejoin="round" />
            <path d="M 95 254 v 35 M 445 254 v 35" stroke={T.ink} strokeWidth="4" />
            <text x="287" y="292" fill={T.ink} fontFamily={T.mono} fontSize="28" fontWeight="900" textAnchor="middle">ENDS MAY DIFFER</text>
          </g>

          <g transform="translate(682 345)">
            <rect width="586" height="320" rx="24" fill={T.paper} stroke={T.cyan} strokeWidth="3" />
            <text x="24" y="44" fill={darkInk(T.cyan)} fontFamily={T.mono} fontSize="28" fontWeight="950">TAUT LENGTH LOCK</text>
            <circle cx="292" cy="142" r="62" fill={T.panelLight} stroke={T.ink} strokeWidth="5" />
            <path d="M 75 142 H 230 A 62 62 0 0 1 354 142 V 252" fill="none" stroke={T.cyan} strokeWidth="8" />
            <rect x="35" y="112" width="72" height="60" rx="10" fill={T.panel} />
            <rect x="318" y="244" width="72" height="60" rx="10" fill={T.panel} />
            <g opacity={taut}>
              <line x1="116" y1="93" x2="204" y2="93" stroke={T.amber} strokeWidth="7" markerEnd="url(#s02-amber)" />
              <line x1="432" y1="154" x2="432" y2="241" stroke={T.amber} strokeWidth="7" markerEnd="url(#s02-amber)" />
              <rect x="88" y="222" width="420" height="58" rx="12" fill={T.ink} />
              <text x="298" y="261" fill={T.cyan} textAnchor="middle" fontFamily={T.mono} fontSize="28" fontWeight="950">EQUAL TRAVEL · |a| EQUAL</text>
            </g>
          </g>

          <g opacity={useCue(lightAt, 0.35).opacity}>
            <rect x="90" y="685" width="438" height="58" rx="14" fill={T.bgDeep} stroke={T.coral} strokeWidth="2" />
            <path d="M 108 714 h 142" stroke={T.amber} strokeWidth="9" strokeDasharray="13 8" />
            <text x="275" y="724" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="900">ROUGHNESS STAYS</text>
          </g>
        </svg>
      </div>
      <IndexTray title="ASSUMPTION INDEX" items={[
        { at: lightAt, term: 'LIGHT STRING', consequence: 'negligible mass', color: T.cyan },
        { at: lightAt, term: 'LIGHT ROD', consequence: 'no added weight', color: T.teal },
        { at: inertiaAt, term: 'LIGHT PULLEY', consequence: 'no rotational inertia', color: T.amber },
        { at: lengthAt, term: 'INEXTENSIBLE', consequence: 'length remains fixed', color: T.purple },
      ]} />
    </LabShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S03 — SMOOTH ICE, ROUGH SAND
// ─────────────────────────────────────────────────────────────────────────────

const Scene03: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const smoothAt = cueAt(scene, 'smooth-surface');
  const roughAt = cueAt(scene, 'rough-surface');
  const redirectAt = cueAt(scene, 'pulley-or-peg');
  const stringAt = cueAt(scene, 'light-string');
  const smooth = secondsProgress(frame, fps, smoothAt, smoothAt + 0.5);
  const rough = secondsProgress(frame, fps, roughAt, roughAt + 0.6);
  const redirect = secondsProgress(frame, fps, redirectAt, redirectAt + 0.6);
  const equal = secondsProgress(frame, fps, stringAt, stringAt + 0.5);

  return (
    <LabShell scene={3} label="contact rig">
      <SectionTitle kicker="contact decides the force">Smooth ice; rough sand</SectionTitle>
      <div style={{ position: 'absolute', left: 58, top: 204, width: 1345, height: 770, borderRadius: 28, background: `${T.panel}ed`, border: `3px solid ${T.cyan}88`, boxShadow: '0 20px 58px #0008' }}>
        <svg width="1345" height="770" viewBox="0 0 1345 770">
          <defs>
            <ArrowMarker id="s03-cyan" color={T.cyan} />
            <ArrowMarker id="s03-amber" color={T.amber} />
            <ArrowMarker id="s03-coral" color={T.coral} />
            <pattern id="s03-sand" width="18" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2" fill={T.amber} /><circle cx="13" cy="10" r="1.8" fill={T.amber} /></pattern>
          </defs>
          <g transform="translate(50 54)">
            <rect width="1240" height="326" rx="24" fill={T.paper} stroke={T.cyan} strokeWidth="3" />
            <text x="24" y="43" fill={darkInk(T.cyan)} fontFamily={T.mono} fontSize="28" fontWeight="950">SURFACE CHANNEL</text>
            <rect x="42" y="232" width="520" height="42" rx="12" fill={`${T.cyan}77`} stroke={T.cyan} strokeWidth="4" />
            <rect x="652" y="232" width="520" height="42" rx="12" fill="url(#s03-sand)" stroke={T.amber} strokeWidth="4" />
            <rect x="220" y="142" width="170" height="90" rx="14" fill={T.panel} stroke={T.ink} strokeWidth="4" />
            <rect x="830" y="142" width="170" height="90" rx="14" fill={T.panel} stroke={T.ink} strokeWidth="4" />
            <g opacity={smooth}>
              <line x1="305" y1="142" x2="305" y2="60" stroke={T.cyan} strokeWidth="8" markerEnd="url(#s03-cyan)" />
              <text x="326" y="91" fill={darkInk(T.cyan)} fontFamily={T.mono} fontSize="28" fontWeight="950">R</text>
              <rect x="92" y="283" width="420" height="38" rx="10" fill={T.ink} />
              <text x="302" y="311" fill={T.cyan} textAnchor="middle" fontFamily={T.mono} fontSize="28" fontWeight="950">NORMAL ONLY · NO FRICTION</text>
            </g>
            <g opacity={rough}>
              <line x1="915" y1="142" x2="915" y2="60" stroke={T.cyan} strokeWidth="8" markerEnd="url(#s03-cyan)" />
              <line x1="830" y1="187" x2="730" y2="187" stroke={T.coral} strokeWidth="8" markerEnd="url(#s03-coral)" />
              <line x1="1000" y1="105" x2="1105" y2="105" stroke={T.amber} strokeWidth="7" markerEnd="url(#s03-amber)" />
              <text x="1047" y="83" fill={darkInk(T.amber)} fontFamily={T.mono} fontSize="28" fontWeight="950">SLIDE</text>
              <rect x="704" y="283" width="420" height="38" rx="10" fill={T.ink} />
              <text x="914" y="311" fill={T.coral} textAnchor="middle" fontFamily={T.mono} fontSize="28" fontWeight="950">FRICTION OPPOSES SLIDE</text>
            </g>
          </g>

          <g transform="translate(55 435)" opacity={redirect}>
            <rect width="1230" height="276" rx="24" fill={T.bgDeep} stroke={T.amber} strokeWidth="3" />
            <text x="24" y="43" fill={T.amber} fontFamily={T.mono} fontSize="28" fontWeight="950">SMOOTH REDIRECTORS</text>
            <circle cx="355" cy="133" r="76" fill={T.panelLight} stroke={T.cyan} strokeWidth="7" />
            <circle cx="355" cy="133" r="12" fill={T.paper} />
            <path d="M 80 133 H 279 A 76 76 0 0 1 431 133 H 605" fill="none" stroke={T.paper} strokeWidth="8" />
            <circle cx="835" cy="133" r="26" fill={T.panelLight} stroke={T.cyan} strokeWidth="7" />
            <path d="M 655 215 Q 806 213 819 151 Q 837 80 1128 78" fill="none" stroke={T.paper} strokeWidth="8" />
            <text x="355" y="243" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="900" textAnchor="middle">PULLEY</text>
            <text x="835" y="243" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="900" textAnchor="middle">PEG</text>
            <g opacity={equal}>
              <rect x="92" y="78" width="132" height="50" rx="11" fill={T.ink} stroke={T.teal} strokeWidth="3" />
              <text x="158" y="113" fill={T.teal} textAnchor="middle" fontFamily={T.mono} fontSize="30" fontWeight="950">T</text>
              <rect x="492" y="78" width="132" height="50" rx="11" fill={T.ink} stroke={T.teal} strokeWidth="3" />
              <text x="558" y="113" fill={T.teal} textAnchor="middle" fontFamily={T.mono} fontSize="30" fontWeight="950">T</text>
              <rect x="944" y="112" width="132" height="50" rx="11" fill={T.ink} stroke={T.teal} strokeWidth="3" />
              <text x="1010" y="147" fill={T.teal} textAnchor="middle" fontFamily={T.mono} fontSize="30" fontWeight="950">T</text>
            </g>
          </g>
        </svg>
      </div>
      <IndexTray title="CONTACT INDEX" items={[
        { at: smoothAt, term: 'SMOOTH SURFACE', consequence: 'no friction', color: T.cyan },
        { at: roughAt, term: 'ROUGH SURFACE', consequence: 'friction may act', color: T.coral },
        { at: redirectAt, term: 'SMOOTH PULLEY', consequence: 'no contact friction', color: T.amber },
        { at: redirectAt, term: 'SMOOTH PEG', consequence: 'redirects without loss', color: T.teal },
      ]} />
    </LabShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S04 — KEEP LENGTH WHEN MOMENTS MATTER
// ─────────────────────────────────────────────────────────────────────────────

const Scene04: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rigidAt = cueAt(scene, 'rigid-rod');
  const beamAt = cueAt(scene, 'beam');
  const uniformAt = cueAt(scene, 'uniform');
  const midpointAt = cueAt(scene, 'midpoint');
  const rigid = secondsProgress(frame, fps, rigidAt, rigidAt + 0.7);
  const beam = secondsProgress(frame, fps, beamAt, beamAt + 0.65);
  const uniform = secondsProgress(frame, fps, uniformAt, uniformAt + 0.8);
  const midpoint = secondsProgress(frame, fps, midpointAt, midpointAt + 0.7);
  const density = Array.from({ length: 15 }, (_, index) => ({
    x: 94 + index * 50,
    opacity: mix(0.25 + (index % 4) * 0.18, 0.82, uniform),
  }));

  return (
    <LabShell scene={4} label="moments bench">
      <SectionTitle kicker="geometry stays in the model">Keep length when force position matters</SectionTitle>
      <div style={{ position: 'absolute', left: 58, top: 204, width: 1345, height: 770, borderRadius: 28, background: `${T.panel}ed`, border: `3px solid ${T.cyan}88`, boxShadow: '0 20px 58px #0008' }}>
        <svg width="1345" height="770" viewBox="0 0 1345 770">
          <defs>
            <ArrowMarker id="s04-cyan" color={T.cyan} />
            <ArrowMarker id="s04-amber" color={T.amber} />
            <ArrowMarker id="s04-coral" color={T.coral} />
          </defs>

          <g transform="translate(45 48)">
            <rect width="1248" height="252" rx="24" fill={T.bgDeep} stroke={`${T.cyan}55`} strokeWidth="2" />
            <text x="24" y="43" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950">RIGIDITY / MOMENT ARM TEST</text>
            <path d={`M 90 144 Q 305 ${144 + (1 - rigid) * 65} 520 144`} fill="none" stroke={T.paper} strokeWidth="22" strokeLinecap="round" />
            <g opacity={rigid}>
              <path d="M 90 105 V 183 M 520 105 V 183" stroke={T.cyan} strokeWidth="5" />
              <path d="M 90 94 H 520" stroke={T.cyan} strokeWidth="4" strokeDasharray="10 8" />
              <rect x="205" y="51" width="200" height="48" rx="11" fill={T.ink} />
              <text x="305" y="85" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">FIXED LENGTH</text>
            </g>
            <g opacity={beam}>
              <rect x="660" y="132" width="490" height="24" rx="7" fill={T.paper} stroke={T.amber} strokeWidth="3" />
              <path d="M 905 156 l -32 44 h 64 Z" fill={T.cyan} stroke={T.ink} strokeWidth="3" />
              <line x1="728" y1="62" x2="728" y2="127" stroke={T.coral} strokeWidth="8" markerEnd="url(#s04-coral)" />
              <line x1="1082" y1="62" x2="1082" y2="127" stroke={T.amber} strokeWidth="8" markerEnd="url(#s04-amber)" />
              <path d="M 728 188 H 905 M 905 188 H 1082" stroke={T.cyan} strokeWidth="4" strokeDasharray="10 7" />
              <text x="816" y="227" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">ARM</text>
              <text x="994" y="227" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">ARM</text>
            </g>
          </g>

          <g transform="translate(45 345)">
            <rect width="1248" height="360" rx="24" fill={T.paper} stroke={T.amber} strokeWidth="3" />
            <text x="24" y="43" fill={darkInk(T.amber)} fontFamily={T.mono} fontSize="28" fontWeight="950">UNIFORM MASS SCAN · UNIFORM GRAVITY</text>
            <g transform="translate(38 77)">
              <rect x="45" y="62" width="760" height="74" rx="16" fill={`${T.cyan}30`} stroke={T.ink} strokeWidth="4" />
              {density.map((point) => <circle key={point.x} cx={point.x} cy="99" r="11" fill={T.cyan} opacity={point.opacity} />)}
              <g opacity={midpoint}>
                <line x1="425" y1="55" x2="425" y2="188" stroke={T.coral} strokeWidth="7" markerEnd="url(#s04-coral)" />
                <rect x="312" y="188" width="226" height="50" rx="11" fill={T.ink} />
                <text x="425" y="223" fill={T.coral} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">WEIGHT AT ½L</text>
              </g>
              <g transform="translate(868 8)" opacity={uniform}>
                <path d="M 0 210 L 145 14 L 290 210 Z" fill={`${T.amber}28`} stroke={T.ink} strokeWidth="5" />
                {Array.from({ length: 22 }, (_, index) => {
                  const row = Math.floor(index / 6);
                  const column = index % 6;
                  return <circle key={index} cx={55 + column * 35 + row * 4} cy={176 - row * 40} r="7" fill={T.amber} opacity="0.82" />;
                })}
                <g opacity={midpoint}>
                  <circle cx="145" cy="145" r="15" fill={T.coral} stroke={T.ink} strokeWidth="4" />
                  <line x1="145" y1="145" x2="145" y2="244" stroke={T.coral} strokeWidth="7" markerEnd="url(#s04-coral)" />
                  <text x="145" y="266" fill={darkInk(T.coral)} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">AREA CENTROID</text>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <IndexTray title="BODY INDEX" items={[
        { at: rigidAt, term: 'RIGID ROD', consequence: 'no bending or extension', color: T.cyan },
        { at: beamAt, term: 'BEAM', consequence: 'force positions retained', color: T.amber },
        { at: uniformAt, term: 'UNIFORM ROD', consequence: 'midpoint weight · uniform g', color: T.teal },
        { at: midpointAt, term: 'UNIFORM LAMINA', consequence: 'area centroid · uniform g', color: T.coral },
        { at: midpointAt, term: 'LAMINA', consequence: 'negligible thickness', color: T.purple },
      ]} />
    </LabShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S05 — CONSTRAINTS: BEAD, WIRE, PEG AND PLANE
// ─────────────────────────────────────────────────────────────────────────────

const Scene05: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beadAt = cueAt(scene, 'bead');
  const normalAt = cueAt(scene, 'normal');
  const planeAt = cueAt(scene, 'plane');
  const pegAt = cueAt(scene, 'peg');
  const bead = secondsProgress(frame, fps, beadAt, beadAt + 0.65);
  const normal = secondsProgress(frame, fps, normalAt, normalAt + 0.55);
  const plane = secondsProgress(frame, fps, planeAt, planeAt + 0.7);
  const peg = secondsProgress(frame, fps, pegAt, pegAt + 0.55);
  const beadX = mix(160, 500, bead);
  const beadY = 310 - 95 * Math.sin(bead * Math.PI);

  return (
    <LabShell scene={5} label="constraint track">
      <SectionTitle kicker="motion follows the constraint">Path first; reaction normal to it</SectionTitle>
      <div style={{ position: 'absolute', left: 58, top: 204, width: 1345, height: 770, borderRadius: 28, background: `${T.panel}ed`, border: `3px solid ${T.cyan}88`, boxShadow: '0 20px 58px #0008' }}>
        <svg width="1345" height="770" viewBox="0 0 1345 770">
          <defs>
            <ArrowMarker id="s05-cyan" color={T.cyan} />
            <ArrowMarker id="s05-amber" color={T.amber} />
          </defs>
          <g transform="translate(42 45)">
            <rect width="750" height="620" rx="25" fill={T.paper} stroke={T.cyan} strokeWidth="3" />
            <text x="25" y="45" fill={darkInk(T.cyan)} fontFamily={T.mono} fontSize="28" fontWeight="950">CURVED WIRE CONSTRAINT</text>
            <path d="M 105 340 C 235 125 430 125 630 342" fill="none" stroke={T.ink} strokeWidth="13" strokeLinecap="round" />
            <path d="M 105 340 C 235 125 430 125 630 342" fill="none" stroke={T.cyan} strokeWidth="5" strokeLinecap="round" />
            <g transform={`translate(${beadX} ${beadY})`}>
              <circle r="31" fill={T.amber} stroke={T.ink} strokeWidth="6" />
              <circle r="9" fill={T.paper} />
              <g opacity={normal} transform={`rotate(${mix(-35, 35, bead)})`}>
                <line x1="0" y1="-34" x2="0" y2="-145" stroke={T.cyan} strokeWidth="8" markerEnd="url(#s05-cyan)" />
                <text x="23" y="-104" fill={darkInk(T.cyan)} fontFamily={T.mono} fontSize="30" fontWeight="950">R</text>
              </g>
            </g>
            <g opacity={normal}>
              <rect x="118" y="430" width="510" height="94" rx="16" fill={T.ink} />
              <text x="373" y="469" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">SMOOTH CONTACT</text>
              <text x="373" y="505" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="850" textAnchor="middle">REACTION ⟂ LOCAL PATH</text>
            </g>
          </g>

          <g transform="translate(835 45)">
            <rect width="458" height="620" rx="25" fill={T.bgDeep} stroke={T.amber} strokeWidth="3" />
            <text x="25" y="45" fill={T.amber} fontFamily={T.mono} fontSize="28" fontWeight="950">PLANE + FIXED PEG</text>
            <g opacity={plane}>
              <path d="M 55 380 L 400 172" stroke={T.paper} strokeWidth="17" strokeLinecap="round" />
              <g transform="translate(205 270) rotate(-31)">
                <rect x="-68" y="-70" width="136" height="70" rx="12" fill={T.panelLight} stroke={T.cyan} strokeWidth="5" />
                <line x1="0" y1="-72" x2="0" y2="-160" stroke={T.cyan} strokeWidth="8" markerEnd="url(#s05-cyan)" />
              </g>
              <rect x="88" y="425" width="280" height="55" rx="12" fill={T.ink} />
              <text x="228" y="463" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">FLAT CONTACT</text>
            </g>
            <g opacity={peg}>
              <circle cx="334" cy="105" r="28" fill={T.panelLight} stroke={T.amber} strokeWidth="7" />
              <path d="M 112 78 H 306 Q 358 78 358 130 V 250" fill="none" stroke={T.paper} strokeWidth="8" />
              <circle cx="334" cy="105" r="8" fill={T.paper} />
              <rect x="35" y="502" width="388" height="88" rx="14" fill={T.ink} stroke={T.amber} strokeWidth="2" />
              <text x="229" y="537" fill={T.amber} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">STRING REDIRECTED</text>
              <text x="229" y="570" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="850" textAnchor="middle">AT ONE FIXED POINT</text>
            </g>
          </g>
        </svg>
      </div>
      <IndexTray title="CONSTRAINT INDEX" items={[
        { at: beadAt, term: 'BEAD', consequence: 'motion constrained to path', color: T.cyan },
        { at: beadAt, term: 'WIRE', consequence: 'sets the allowed path', color: T.purple },
        { at: planeAt, term: 'PLANE', consequence: 'flat contact surface', color: T.teal },
        { at: pegAt, term: 'PEG', consequence: 'fixed redirect point', color: T.amber },
      ]} />
    </LabShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S06 — WORKED LAB TEST
// ─────────────────────────────────────────────────────────────────────────────

interface HoldWindow {
  start: number;
  end: number;
}

const S06_HOLDS: HoldWindow[] = [
  { start: 8 * 30, end: 10 * 30 },
  { start: 17 * 30, end: 19 * 30 },
  { start: 31 * 30, end: 33 * 30 },
  { start: 49 * 30, end: 51 * 30 },
  { start: 61 * 30, end: 63 * 30 },
  { start: 73 * 30, end: 75 * 30 },
];

function freezeDuring(frame: number, holds: HoldWindow[]): number {
  const active = holds.find((hold) => frame >= hold.start && frame < hold.end);
  return active ? active.start : frame;
}

function ringOpacity(frame: number, hold: HoldWindow): number {
  return interpolate(frame, [hold.start - 12, hold.start, hold.end, hold.end + 10], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function measureInkText(text: string, scale: number): number {
  return Array.from(text).reduce((width, char) => width + (char === ' ' ? GLYPH_ADVANCE[' '] : (GLYPH_ADVANCE[char] ?? 14)) * scale, 0);
}

const AssumptionChip: React.FC<{ x: number; y: number; width: number; title: string; color?: string }> = ({ x, y, width, title, color = T.cyan }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={width} height="48" rx="12" fill={T.bgDeep} stroke={color} strokeWidth="2.5" />
    <circle cx="23" cy="24" r="8" fill={color} />
    <text x="42" y="33" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="900">{title}</text>
  </g>
);

const HoldRing: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  color?: string;
}> = ({ x, y, width, height, opacity, color = T.amber }) => (
  <rect x={x} y={y} width={width} height={height} rx={height / 2} fill="none" stroke={color} strokeWidth="6" opacity={opacity} />
);

const Scene06: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const motionFrame = freezeDuring(frame, S06_HOLDS);
  const supportedAt = cueAt(scene, 'supported');
  const equationsAt = cueAt(scene, 'equations');
  const accelerationAt = cueAt(scene, 'acceleration');
  const supportedCue = useCue(supportedAt, 0.4);
  const equationsCue = useCue(equationsAt, 0.4);
  const accelerationCue = useCue(accelerationAt, 0.4);

  const benchMass = progressBetween(motionFrame, 70, 155);
  const hangingMass = progressBetween(motionFrame, 340, 430);
  const gravity = progressBetween(motionFrame, 610, 735);
  const forceTrace = progressBetween(motionFrame, 990, 1042);
  const linkTrace = progressBetween(motionFrame, equationsAt * fps, equationsAt * fps + 28);

  const line3Prefix = '2g = (3 + 2)a =';
  const line3ResultX = 104 + measureInkText(line3Prefix, 1.85) + 12;
  const line4Prefix = 'a = 2(9.8)/5 =';
  const line4ResultX = 104 + measureInkText(line4Prefix, 1.72) + 12;
  const line5Prefix = 'T = 3(3.92) ≈';
  const line5ResultX = 104 + measureInkText(line5Prefix, 1.8) + 12;

  const strokes = useMemo(() => [
    ...makeInkLine({ id: 's06-l1', text: 'T = 3a', x: 104, y: 166, scale: 2.05, startFrame: 1080, endFrame: 1160, width: 4.2 }),
    ...makeInkLine({ id: 's06-l2', text: '2g - T = 2a', x: 104, y: 236, scale: 2.0, startFrame: 1170, endFrame: 1280, width: 4.2 }),
    ...makeInkLine({ id: 's06-l3a', text: line3Prefix, x: 104, y: 348, scale: 1.85, startFrame: 1322, endFrame: 1425, width: 4.1 }),
    ...makeInkLine({ id: 's06-l3b', text: '5a', x: line3ResultX, y: 348, scale: 1.95, startFrame: 1428, endFrame: 1454, color: darkInk(T.green), width: 4.4 }),
    ...makeInkLine({ id: 's06-l4a', text: line4Prefix, x: 104, y: 472, scale: 1.72, startFrame: 1560, endFrame: 1688, width: 4.1 }),
    ...makeInkLine({ id: 's06-l4b', text: '3.92 m s', x: line4ResultX, y: 472, scale: 1.75, startFrame: 1692, endFrame: 1788, color: darkInk(T.green), width: 4.3 }),
    ...makeInkLine({ id: 's06-l4c', text: '-2', x: line4ResultX + measureInkText('3.92 m s', 1.75) + 2, y: 452, scale: 1.05, startFrame: 1790, endFrame: 1808, color: darkInk(T.green), width: 3.5 }),
    ...makeInkLine({ id: 's06-l5a', text: line5Prefix, x: 104, y: 603, scale: 1.8, startFrame: 1925, endFrame: 2058, width: 4.1 }),
    ...makeInkLine({ id: 's06-l5b', text: '11.8 N', x: line5ResultX, y: 603, scale: 1.9, startFrame: 2062, endFrame: 2132, color: darkInk(T.green), width: 4.4 }),
    ...makeInkLine({ id: 's06-note', text: '3 s.f.', x: 620, y: 675, scale: 1.3, startFrame: 2138, endFrame: 2173, color: darkInk(T.coral), width: 3.6 }),
  ], [line3ResultX, line4ResultX, line5ResultX]);

  return (
    <LabShell scene={6} label="worked lab test">
      <SectionTitle kicker="assumptions earn the shortcut">One rig · one careful calculation</SectionTitle>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <ArrowMarker id="s06-cyan" color={T.cyan} />
          <ArrowMarker id="s06-amber" color={T.amber} />
          <ArrowMarker id="s06-coral" color={T.coral} />
        </defs>

        <g transform="translate(55 190)">
          <rect width="855" height="810" rx="28" fill={`${T.panel}f5`} stroke={T.cyan} strokeWidth="3" />
          <text x="28" y="47" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950">RIG A · COUPLED PARTICLES</text>
          <AssumptionChip x={26} y={70} width={210} title="PARTICLES" />
          <AssumptionChip x={250} y={70} width={242} title="SMOOTH BENCH" color={T.cyan} />
          <AssumptionChip x={506} y={70} width={242} title="LIGHT STRING" color={T.teal} />
          <AssumptionChip x={26} y={132} width={390} title="TAUT · INEXTENSIBLE" color={T.purple} />
          <AssumptionChip x={430} y={132} width={396} title="SMOOTH · LIGHT PULLEY" color={T.amber} />
          <AssumptionChip x={26} y={194} width={404} title="AIR RESISTANCE · OFF" color={T.coral} />

          <rect x="58" y="425" width="560" height="46" rx="10" fill={T.paper} stroke={T.ink} strokeWidth="4" />
          {Array.from({ length: 17 }, (_, index) => <path key={index} d={`M ${70 + index * 32} 438 l 18 20`} stroke={`${T.cyan}66`} strokeWidth="3" />)}
          <circle cx="680" cy="330" r="75" fill={T.panelLight} stroke={T.amber} strokeWidth="8" />
          <circle cx="680" cy="330" r="12" fill={T.paper} />
          <path d="M 390 330 H 605 A 75 75 0 0 1 755 330 V 511" fill="none" stroke={T.paper} strokeWidth="9" />
          <rect x="270" y="330" width="150" height="95" rx="14" fill={T.panelLight} stroke={T.cyan} strokeWidth="6" />
          <rect x="690" y="510" width="130" height="120" rx="14" fill={T.panelLight} stroke={T.amber} strokeWidth="6" />

          <g opacity={benchMass}>
            <rect x="282" y="348" width="126" height="54" rx="12" fill={T.bgDeep} stroke={T.cyan} strokeWidth="3" />
            <text x="345" y="385" fill={T.cyan} fontFamily={T.mono} fontSize="31" fontWeight="950" textAnchor="middle">3 kg</text>
            <HoldRing x={270} y={330} width={150} height={95} opacity={ringOpacity(frame, S06_HOLDS[0])} />
          </g>
          <g opacity={hangingMass}>
            <rect x="701" y="543" width="108" height="54" rx="12" fill={T.bgDeep} stroke={T.amber} strokeWidth="3" />
            <text x="755" y="580" fill={T.amber} fontFamily={T.mono} fontSize="31" fontWeight="950" textAnchor="middle">2 kg</text>
            <HoldRing x={690} y={510} width={130} height={120} opacity={ringOpacity(frame, S06_HOLDS[1])} />
          </g>
          <g opacity={gravity}>
            <rect x="46" y="650" width="334" height="78" rx="16" fill={T.paper} stroke={T.amber} strokeWidth="3" />
            <text x="213" y="699" fill={T.ink} fontFamily={T.mono} fontSize="34" fontWeight="950" textAnchor="middle">g = 9.8 m s⁻²</text>
            <HoldRing x={34} y={638} width={358} height={102} opacity={ringOpacity(frame, S06_HOLDS[2])} />
          </g>

          <g opacity={forceTrace}>
            <line x1="345" y1="330" x2={mix(345, 345, forceTrace)} y2={mix(330, 244, forceTrace)} stroke={T.cyan} strokeWidth="7" markerEnd="url(#s06-cyan)" />
            <line x1="345" y1="425" x2="345" y2={mix(425, 520, forceTrace)} stroke={T.amber} strokeWidth="7" markerEnd="url(#s06-amber)" />
            <line x1="420" y1="377" x2={mix(420, 535, forceTrace)} y2="377" stroke={T.cyan} strokeWidth="7" markerEnd="url(#s06-cyan)" />
            <text x="548" y="367" fill={T.cyan} fontFamily={T.mono} fontSize="29" fontWeight="950">T</text>
            <text x="365" y="252" fill={T.cyan} fontFamily={T.mono} fontSize="29" fontWeight="950">R</text>
            <text x="366" y="528" fill={T.amber} fontFamily={T.mono} fontSize="29" fontWeight="950">3g</text>
            <line x1="755" y1="510" x2="755" y2={mix(510, 435, forceTrace)} stroke={T.cyan} strokeWidth="7" markerEnd="url(#s06-cyan)" />
            <line x1="755" y1="630" x2="755" y2={mix(630, 731, forceTrace)} stroke={T.amber} strokeWidth="7" markerEnd="url(#s06-amber)" />
            <text x="777" y="452" fill={T.cyan} fontFamily={T.mono} fontSize="29" fontWeight="950">T</text>
            <text x="777" y="728" fill={T.amber} fontFamily={T.mono} fontSize="29" fontWeight="950">2g</text>
            <line x1="445" y1="294" x2="550" y2="294" stroke={T.coral} strokeWidth="7" markerEnd="url(#s06-coral)" />
            <line x1="827" y1="470" x2="827" y2="550" stroke={T.coral} strokeWidth="7" markerEnd="url(#s06-coral)" />
            <text x="492" y="278" fill={T.coral} fontFamily={T.mono} fontSize="28" fontWeight="950">a</text>
            <text x="800" y="500" fill={T.coral} fontFamily={T.mono} fontSize="28" fontWeight="950">a</text>
          </g>

          <g opacity={linkTrace * equationsCue.opacity}>
            <path d="M 151 118 C 160 216 250 257 302 318" fill="none" stroke={T.cyan} strokeWidth="4" strokeDasharray="10 8" />
            <path d="M 648 118 C 624 220 656 243 676 256" fill="none" stroke={T.purple} strokeWidth="4" strokeDasharray="10 8" />
            <path d="M 214 180 C 348 226 510 218 618 290" fill="none" stroke={T.amber} strokeWidth="4" strokeDasharray="10 8" />
          </g>
          <g opacity={supportedCue.opacity}>
            <rect x="436" y="655" width="370" height="78" rx="16" fill={T.bgDeep} stroke={T.cyan} strokeWidth="2" />
            <text x="621" y="687" fill={T.muted} fontFamily={T.mono} fontSize="28" fontWeight="850" textAnchor="middle">ONE TENSION · ONE |a|</text>
            <text x="621" y="719" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="850" textAnchor="middle">DIRECTIONS FOLLOW PATH</text>
          </g>
        </g>

        <g transform="translate(955 170)">
          <RuledPaper width={905} height={850}>
            <text x="105" y="54" fill={darkInk(T.amber)} fontFamily={T.mono} fontSize="28" fontWeight="950" letterSpacing="2">WORKING · PATH INK</text>
            <InkPlayback strokes={strokes} frame={motionFrame} />
            <HoldRing x={line3ResultX - 14} y="324" width="88" height="64" opacity={ringOpacity(frame, S06_HOLDS[3])} color={T.green} />
            <HoldRing x={line4ResultX - 13} y="445" width="276" height="65" opacity={ringOpacity(frame, S06_HOLDS[4])} color={T.green} />
            <HoldRing x={line5ResultX - 13} y="575" width="187" height="66" opacity={ringOpacity(frame, S06_HOLDS[5])} color={T.green} />
            <g opacity={accelerationCue.opacity}>
              <path d="M 88 440 H 825" stroke={T.cyan} strokeWidth="2.5" opacity="0.5" />
            </g>
          </RuledPaper>
        </g>
      </svg>
    </LabShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S07 — JUSTIFY THE SHORTCUT, THEN TEST IT
// ─────────────────────────────────────────────────────────────────────────────

const ConsequenceRow: React.FC<{
  y: number;
  left: string;
  right: string;
  color: string;
  opacity: number;
  rejected?: boolean;
}> = ({ y, left, right, color, opacity, rejected = false }) => (
  <g opacity={opacity} transform={`translate(0 ${y})`}>
    <rect x="92" y="0" width="300" height="62" rx="14" fill={T.bgDeep} stroke={color} strokeWidth="3" />
    <text x="242" y="41" fill={color} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">{left}</text>
    <line x1="407" y1="31" x2="518" y2="31" stroke={color} strokeWidth="5" strokeDasharray={rejected ? '10 8' : undefined} />
    <path d="M 518 31 l -18 -11 v 22 Z" fill={color} />
    {rejected && <path d="M 448 8 l 28 46 M 476 8 l -28 46" stroke={T.coral} strokeWidth="6" />}
    <rect x="535" y="0" width="355" height="62" rx="14" fill={T.paper} stroke={color} strokeWidth="3" />
    <text x="712" y="41" fill={darkInk(color)} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">{right}</text>
  </g>
);

const Scene07: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shortcutAt = cueAt(scene, 'shortcut');
  const choicesAt = cueAt(scene, 'other-choices');
  const roughAt = cueAt(scene, 'rough-bench');
  const smoothMatch = useCue(wordAt(scene, 'smooth', shortcutAt), 0.42);
  const tensionMatch = useCue(wordAt(scene, 'light', shortcutAt + 3), 0.42);
  const inextensibleMatch = useCue(wordAt(scene, 'inextensible', choicesAt + 2), 0.42);
  const uniformMatch = useCue(wordAt(scene, 'uniform', choicesAt + 8), 0.42);
  const particleMatch = useCue(wordAt(scene, 'particle', choicesAt + 11), 0.42);
  const dragRejection = useCue(wordAt(scene, 'nothing', choicesAt + 15), 0.42);
  const rough = useCue(roughAt, 0.42);
  const roughProgress = secondsProgress(frame, fps, roughAt, roughAt + 0.8);

  const retainedStrokes = useMemo(() => [
    ...makeInkLine({ id: 's07-old1', text: 'T = 3a', x: 102, y: 105, scale: 1.55, startFrame: 0, endFrame: 1, width: 3.6 }),
    ...makeInkLine({ id: 's07-old2', text: '2g - T = 2a', x: 102, y: 164, scale: 1.5, startFrame: 0, endFrame: 1, width: 3.6 }),
    ...makeInkLine({ id: 's07-old3', text: 'a = 3.92 m s', x: 102, y: 223, scale: 1.45, startFrame: 0, endFrame: 1, color: darkInk(T.green), width: 3.7 }),
    ...makeInkLine({ id: 's07-old4', text: '-2', x: 102 + measureInkText('a = 3.92 m s', 1.45) + 2, y: 205, scale: 0.9, startFrame: 0, endFrame: 1, color: darkInk(T.green), width: 3.2 }),
  ], []);
  const revisedStrokes = useMemo(() => makeInkLine({
    id: 's07-revised',
    text: '2g - F = 5a',
    x: 104,
    y: 731,
    scale: 2.0,
    startFrame: roughAt * fps + 42,
    endFrame: roughAt * fps + 184,
    color: darkInk(T.coral),
    width: 4.4,
  }), [fps, roughAt]);

  return (
    <LabShell scene={7} label="model stress test">
      <SectionTitle kicker="state the reason, then challenge it">Every shortcut has a boundary</SectionTitle>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <ArrowMarker id="s07-cyan" color={T.cyan} />
          <ArrowMarker id="s07-amber" color={T.amber} />
          <ArrowMarker id="s07-coral" color={T.coral} />
          <ArrowMarker id="s07-purple" color={T.purple} />
          <pattern id="s07-sand" width="18" height="15" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="2" fill={T.amber} /><circle cx="14" cy="11" r="1.7" fill={T.amber} /></pattern>
        </defs>

        <g transform="translate(52 190)">
          <rect width="760" height="810" rx="28" fill={`${T.panel}f5`} stroke={roughProgress > 0.5 ? T.coral : T.cyan} strokeWidth="3" />
          <text x="26" y="45" fill={T.cyan} fontFamily={T.mono} fontSize="28" fontWeight="950">RIG A · SAME COUPLED PARTICLES</text>
          <AssumptionChip x={25} y={70} width={214} title="SMOOTH" />
          <AssumptionChip x={252} y={70} width={202} title="LIGHT" color={T.teal} />
          <AssumptionChip x={467} y={70} width={266} title="INEXTENSIBLE" color={T.purple} />
          <rect x="50" y="425" width="495" height="48" rx="10" fill={T.paper} stroke={T.ink} strokeWidth="4" />
          <rect x="50" y="425" width="495" height="48" rx="10" fill="url(#s07-sand)" opacity={roughProgress} />
          <circle cx="610" cy="330" r="72" fill={T.panelLight} stroke={T.amber} strokeWidth="8" />
          <circle cx="610" cy="330" r="11" fill={T.paper} />
          <path d="M 340 330 H 538 A 72 72 0 0 1 682 330 V 510" fill="none" stroke={T.paper} strokeWidth="9" />
          <rect x="210" y="330" width="160" height="95" rx="14" fill={T.panelLight} stroke={T.cyan} strokeWidth="6" />
          <rect x="622" y="510" width="120" height="122" rx="14" fill={T.panelLight} stroke={T.amber} strokeWidth="6" />
          <text x="290" y="388" fill={T.cyan} fontFamily={T.mono} fontSize="31" fontWeight="950" textAnchor="middle">3 kg</text>
          <text x="682" y="581" fill={T.amber} fontFamily={T.mono} fontSize="31" fontWeight="950" textAnchor="middle">2 kg</text>
          <line x1="370" y1="377" x2="475" y2="377" stroke={T.cyan} strokeWidth="7" markerEnd="url(#s07-cyan)" />
          <line x1="682" y1="632" x2="682" y2="715" stroke={T.amber} strokeWidth="7" markerEnd="url(#s07-amber)" />
          <g opacity={inextensibleMatch.opacity}>
            <line x1="390" y1="289" x2="505" y2="289" stroke={T.purple} strokeWidth="7" markerEnd="url(#s07-purple)" />
            <line x1="735" y1="448" x2="735" y2="535" stroke={T.purple} strokeWidth="7" markerEnd="url(#s07-purple)" />
            <text x="448" y="273" fill={T.purple} fontFamily={T.mono} fontSize="28" fontWeight="950">a</text>
            <text x="707" y="487" fill={T.purple} fontFamily={T.mono} fontSize="28" fontWeight="950">a</text>
            <rect x="50" y="248" width="310" height="72" rx="12" fill={T.bgDeep} stroke={T.purple} strokeWidth="2" />
            <text x="205" y="277" fill={T.purple} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">EQUAL |a|</text>
            <text x="205" y="307" fill={T.purple} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">DIRECTIONS DIFFER</text>
          </g>
          <g opacity={rough.opacity}>
            <line x1="210" y1="378" x2={mix(210, 103, roughProgress)} y2="378" stroke={T.coral} strokeWidth="8" markerEnd="url(#s07-coral)" />
            <rect x="72" y="484" width="320" height="73" rx="13" fill={T.bgDeep} stroke={T.coral} strokeWidth="3" />
            <text x="232" y="514" fill={T.coral} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">FRICTION</text>
            <text x="232" y="545" fill={T.coral} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">REDUCES DRIVE</text>
            <rect x="417" y="484" width="316" height="73" rx="13" fill={T.bgDeep} stroke={T.coral} strokeWidth="3" />
            <text x="575" y="514" fill={T.coral} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">SAME WEIGHT</text>
            <text x="575" y="545" fill={T.coral} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">|a| FALLS</text>
          </g>
          <rect x="56" y="610" width="504" height="120" rx="17" fill={T.paper} stroke={T.green} strokeWidth="3" />
          <text x="308" y="653" fill={darkInk(T.green)} fontFamily={T.mono} fontSize="31" fontWeight="950" textAnchor="middle">3.92 m s⁻²</text>
          <text x="308" y="696" fill={T.ink} fontFamily={T.mono} fontSize="28" fontWeight="900" textAnchor="middle">SMOOTH BENCH ONLY</text>
          <g opacity={interpolate(frame, [43 * fps, 44 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
            <rect x="55" y="748" width="650" height="48" rx="12" fill={T.bgDeep} stroke={T.cyan} strokeWidth="2" />
            <text x="380" y="781" fill={T.paper} fontFamily={T.mono} fontSize="28" fontWeight="900" textAnchor="middle">SIZE · SIGN · UNITS · PLAUSIBILITY</text>
          </g>
        </g>

        <g transform="translate(835 170)">
          <RuledPaper width={1025} height={850}>
            <text x="105" y="52" fill={darkInk(T.amber)} fontFamily={T.mono} fontSize="28" fontWeight="950">CONSEQUENCE SORTER</text>
            <InkPlayback strokes={retainedStrokes} frame={9999} showHand={false} />
            <rect x="590" y="80" width="350" height="170" rx="18" fill={`${T.green}16`} stroke={T.green} strokeWidth="3" />
            <text x="765" y="124" fill={darkInk(T.green)} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">WORKED RESULT</text>
            <text x="765" y="165" fill={T.ink} fontSize="28" fontWeight="850" textAnchor="middle">kept for comparison</text>
            <text x="765" y="207" fill={darkInk(T.coral)} fontFamily={T.mono} fontSize="28" fontWeight="900" textAnchor="middle">MODEL-SPECIFIC</text>
            <ConsequenceRow y={286} left="SMOOTH" right="NO FRICTION" color={T.cyan} opacity={smoothMatch.opacity} />
            <ConsequenceRow y={360} left="LIGHT + SMOOTH" right="EQUAL TENSION" color={T.teal} opacity={tensionMatch.opacity} />
            <ConsequenceRow y={434} left="TAUT + INEXT." right="EQUAL |a|" color={T.purple} opacity={inextensibleMatch.opacity} />
            <ConsequenceRow y={508} left="UNIFORM ROD" right="MIDPOINT WEIGHT" color={T.amber} opacity={uniformMatch.opacity} />
            <ConsequenceRow y={576} left="PARTICLE" right="ONE FORCE POINT" color={T.cyan} opacity={particleMatch.opacity} />
            <ConsequenceRow y={644} left="PARTICLE" right="NO DRAG" color={T.coral} opacity={dragRejection.opacity} rejected />
            <InkPlayback strokes={revisedStrokes} frame={frame} />
          </RuledPaper>
        </g>
      </svg>
    </LabShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S08 — TWENTY-SECOND RECAP
// ─────────────────────────────────────────────────────────────────────────────

interface RecapCardSpec {
  term: string;
  consequence: string;
  breakAfter?: number;
  color: string;
  group: 'particle' | 'light' | 'smooth' | 'inextensible' | 'rigid' | 'uniform' | 'other';
}

const RECAP_CARDS: RecapCardSpec[] = [
  { term: 'PARTICLE', consequence: 'one force point', color: T.cyan, group: 'particle' },
  { term: 'LIGHT STRING', consequence: 'negligible mass', color: T.teal, group: 'light' },
  { term: 'LIGHT ROD', consequence: 'no added weight', color: T.teal, group: 'light' },
  { term: 'LIGHT PULLEY', consequence: 'no rotation inertia', color: T.teal, group: 'light' },
  { term: 'SMOOTH SURFACE', consequence: 'no friction', color: T.coral, group: 'smooth' },
  { term: 'SMOOTH PULLEY', consequence: 'equal tension', color: T.coral, group: 'smooth' },
  { term: 'SMOOTH PEG', consequence: 'frictionless redirect', breakAfter: 1, color: T.coral, group: 'smooth' },
  { term: 'INEXTENSIBLE', consequence: 'taut-string motion', breakAfter: 1, color: T.purple, group: 'inextensible' },
  { term: 'RIGID ROD', consequence: 'fixed shape', color: T.amber, group: 'rigid' },
  { term: 'BEAM', consequence: 'force positions kept', color: T.amber, group: 'rigid' },
  { term: 'UNIFORM ROD', consequence: 'centre of mass', breakAfter: 2, color: T.green, group: 'uniform' },
  { term: 'UNIFORM LAMINA', consequence: 'area centroid', color: T.green, group: 'uniform' },
  { term: 'LAMINA', consequence: 'negligible thickness', breakAfter: 1, color: T.green, group: 'uniform' },
  { term: 'BEAD', consequence: 'follows a wire', color: T.cyan, group: 'other' },
  { term: 'WIRE', consequence: 'sets a path', color: T.cyan, group: 'other' },
  { term: 'PLANE', consequence: 'flat contact', color: T.cyan, group: 'other' },
  { term: 'PEG', consequence: 'fixed redirect', color: T.cyan, group: 'other' },
  { term: 'ROUGH SURFACE', consequence: 'friction may act', color: T.coral, group: 'other' },
];

const Scene08: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const particleAt = cueAt(scene, 'particle');
  const smoothAt = cueAt(scene, 'smooth');
  const uniformAt = cueAt(scene, 'uniform');
  const stateAt = cueAt(scene, 'state-it');
  const particle = useCue(particleAt, 0.35);
  const smooth = useCue(smoothAt, 0.35);
  const uniform = useCue(uniformAt, 0.35);
  const state = useCue(stateAt, 0.4);
  const cycleBuild = secondsProgress(frame, fps, stateAt, stateAt + 0.8);

  const groupOpacity = (group: RecapCardSpec['group']): number => {
    if (group === 'particle' || group === 'light') return particle.opacity;
    if (group === 'smooth' || group === 'inextensible') return smooth.opacity;
    if (group === 'uniform' || group === 'rigid') return uniform.opacity;
    return 1;
  };

  return (
    <LabShell scene={8} label="assumption index">
      <SectionTitle kicker="twenty-second recap">Six modelling words; six controlled shortcuts</SectionTitle>
      <div style={{ position: 'absolute', left: 55, right: 55, top: 203, height: 680, borderRadius: 28, border: `3px solid ${T.cyan}88`, background: `${T.panel}ef`, padding: '26px 28px', boxShadow: '0 20px 58px #0008' }}>
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>COMPLETE MODELLING INDEX</div>
        <svg width="1750" height="590" viewBox="0 0 1750 590" style={{ position: 'absolute', left: 28, top: 70 }}>
          {RECAP_CARDS.map((card, index) => {
            const column = index % 6;
            const row = Math.floor(index / 6);
            const x = 8 + column * 289;
            const y = 70 + row * 190;
            const opacity = groupOpacity(card.group);
            const words = card.consequence.split(' ');
            const breakAfter = card.breakAfter ?? Math.min(2, words.length);
            return (
              <g key={card.term} transform={`translate(${x} ${y + (1 - opacity) * 18})`} opacity={opacity}>
                <rect width="268" height="134" rx="18" fill={T.paper} stroke={card.color} strokeWidth="3" />
                <rect x="0" y="0" width="268" height="43" rx="18" fill={`${card.color}32`} />
                <text x="134" y="31" fill={darkInk(card.color)} fontFamily={T.mono} fontSize="28" fontWeight="950" textAnchor="middle">{card.term}</text>
                {card.group !== 'other' && <path d="M 134 44 V 58" stroke={T.cyan} strokeWidth="4" strokeLinecap="round" />}
                <text x="134" y="84" fill={T.ink} fontSize="28" fontWeight="850" textAnchor="middle">{words.slice(0, breakAfter).join(' ')}</text>
                <text x="134" y="116" fill={T.ink} fontSize="28" fontWeight="850" textAnchor="middle">{words.slice(breakAfter).join(' ')}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 250, right: 250, top: 906, height: 104, opacity: state.opacity, transform: `scale(${0.94 + cycleBuild * 0.06})` }}>
        <PaperCard accent={T.green} style={{ height: '100%', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: `0 0 ${22 + cycleBuild * 30}px ${T.green}55` }}>
          {['ASSUME.', 'SOLVE.', 'CHECK.', 'REFINE.'].map((step, index) => (
            <React.Fragment key={step}>
              <div style={{ color: index === 3 ? darkInk(T.green) : T.ink, fontFamily: T.mono, fontSize: 34, fontWeight: 950 }}>{step}</div>
              {index < 3 && <div style={{ color: T.cyan, fontSize: 42, fontWeight: 950 }}>→</div>}
            </React.Fragment>
          ))}
        </PaperCard>
      </div>
    </LabShell>
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

const NarratedScene: React.FC<{
  scene: TranscriptScene;
  audioEnabled: boolean;
  children: React.ReactNode;
}> = ({ scene, audioEnabled, children }) => (
  <AbsoluteFill>
    {children}
    {audioEnabled && <Audio src={staticFile(`audio/mechanics/${scene.audio}`)} volume={1} />}
  </AbsoluteFill>
);

export const MechanicsModellingAssumptions: React.FC<MechanicsModellingAssumptionsProps> = ({
  audioEnabled = true,
}) => {
  const { fps } = useVideoConfig();
  const transition = (
    <TransitionSeries.Transition
      presentation={fadeThroughGraphite}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
  );

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Reality becomes a particle model" durationInFrames={sequenceDurationInFrames(0, fps)}><NarratedScene scene={S01} audioEnabled={audioEnabled}><Scene01 scene={S01} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence name="Light and inextensible" durationInFrames={sequenceDurationInFrames(1, fps)}><NarratedScene scene={S02} audioEnabled={audioEnabled}><Scene02 scene={S02} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence name="Smooth ice, rough sand" durationInFrames={sequenceDurationInFrames(2, fps)}><NarratedScene scene={S03} audioEnabled={audioEnabled}><Scene03 scene={S03} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence name="Keep length for moments" durationInFrames={sequenceDurationInFrames(3, fps)}><NarratedScene scene={S04} audioEnabled={audioEnabled}><Scene04 scene={S04} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence name="Bead, wire, peg and plane" durationInFrames={sequenceDurationInFrames(4, fps)}><NarratedScene scene={S05} audioEnabled={audioEnabled}><Scene05 scene={S05} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence name="Worked lab test" durationInFrames={sequenceDurationInFrames(5, fps)}><NarratedScene scene={S06} audioEnabled={audioEnabled}><Scene06 scene={S06} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence name="Why the assumptions matter" durationInFrames={sequenceDurationInFrames(6, fps)}><NarratedScene scene={S07} audioEnabled={audioEnabled}><Scene07 scene={S07} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence name="Twenty-second recap" durationInFrames={sequenceDurationInFrames(7, fps)}><NarratedScene scene={S08} audioEnabled={audioEnabled}><Scene08 scene={S08} /></NarratedScene></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
