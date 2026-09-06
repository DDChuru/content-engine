/** Travel graphs: the recorded cyclist journey, drawn and explained leg by leg. */
import React, { useLayoutEffect, useMemo, useState, useRef } from 'react';
import {
  AbsoluteFill,
  Artifact,
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
import transcriptJson from '../public/transcripts/mechanics/drawing-travel-graphs.json';

const TRANSITION_FRAMES = 15;
const T = {
  bg: '#171c20',
  paper: '#f6f3eb',
  ink: '#273238',
  line: '#d8dad5',
  text: '#e9e7e0',
  muted: '#a9afad',
  accent: '#3f9e89',
  sans: 'Arial, sans-serif',
};
interface Word {
  word: string;
  start: number;
  end: number;
}
interface Hold {
  kind: string;
  start: number;
  end: number;
  duration: number;
}
interface Scene {
  id: string;
  audio: string;
  duration: number;
  words: Word[];
  cues: Record<string, number>;
  holds: Hold[];
  tempo: string;
  voiceSpeed: number;
}
const SCENES = transcriptJson.scenes as unknown as Scene[];
const OUTCOMES = [
  'Turn journey descriptions into graph shapes.',
  'Use signed area to find displacement.',
  'Explain a journey using displacement-time gradients.',
];
const HEADERS = [
  'What you will learn',
  'Read the graph correctly',
  'Draw the cyclist’s velocity',
  'Find when the cyclist returns',
  'Choose straight lines or curves',
  'Check before the final journey',
  'Explain the whole journey',
];
export interface MechanicsDrawingTravelGraphsProps {
  audioEnabled?: boolean;
  audit?: boolean;
}
export function getMechanicsDrawingTravelGraphsDuration(fps: number): number {
  return SCENES.reduce((n, s) => n + Math.ceil(s.duration * fps), 0);
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const progressBetween = (f: number, a: number, b: number) => clamp((f - a) / Math.max(1, b - a));
function cue(s: Scene, id: string): number {
  const t = s.cues[id];
  if (t === undefined) throw new Error(`Missing cue ${s.id}:${id}`);
  return t;
}
function useCue(s: Scene, id: string): boolean {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f >= Math.ceil(cue(s, id) * fps);
}
function latest(s: Scene, t: number, ids: string[]): string {
  return ids.filter((id) => t >= cue(s, id)).at(-1) ?? '';
}
function heldTime(s: Scene, t: number): number {
  const hold = s.holds.find((h) => h.kind === 'hold' && t >= h.start && t < h.end);
  return hold ? hold.start : t;
}

// Same fade-through presentation as MechanicsVelocityTimeGraphs: the two
// scenes never remain visible together. Audio runs outside the fade overlap.
type FadeProps = { background: string };
const FadeThrough: React.FC<TransitionPresentationComponentProps<FadeProps>> = ({
  children,
  passedProps,
  presentationDirection,
  presentationProgress,
}) => {
  const opacity =
    presentationDirection === 'exiting'
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
const fadeThroughGraphite: TransitionPresentation<FadeProps> = {
  component: FadeThrough,
  props: { background: T.bg },
};

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    data-region="header"
    style={{ position: 'absolute', left: 100, top: 72, color: T.text, fontSize: 57, fontWeight: 600 }}
  >
    {children}
  </div>
);
const Card: React.FC<{ text: string; centre?: boolean; tick?: boolean }> = ({
  text,
  centre = false,
  tick = false,
}) => (
  <div
    data-region="card"
    data-card="true"
    style={{
      position: 'absolute',
      left: centre ? 300 : 1050,
      top: centre ? 330 : 370,
      width: centre ? 1320 : 740,
      minHeight: 230,
      padding: '55px 58px',
      boxSizing: 'border-box',
      background: T.paper,
      color: T.ink,
      fontSize: centre ? 62 : 52,
      lineHeight: 1.35,
      borderRadius: 8,
    }}
  >
    {text}
    {tick && (
      <svg
        aria-hidden="true"
        width="70"
        height="60"
        viewBox="0 0 70 60"
        style={{ display: 'block', marginTop: 28 }}
      >
        <path d="M8 28 L27 47 L61 9" fill="none" stroke={T.accent} strokeWidth="7" strokeLinecap="round" />
      </svg>
    )}
  </div>
);
const Diagram: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    data-region="diagram"
    viewBox="0 0 850 710"
    width="850"
    height="710"
    style={{ position: 'absolute', left: 100, top: 240, overflow: 'visible' }}
  >
    <defs>
      <marker
        id="model-arrow"
        markerWidth="9"
        markerHeight="9"
        refX="7"
        refY="4"
        orient="auto-start-reverse"
        markerUnits="strokeWidth"
      >
        <path d="M0 0 L8 4 L0 8" fill="context-stroke" />
      </marker>
    </defs>
    {children}
  </svg>
);
const Arrow: React.FC<{
  x: number;
  y: number;
  dx: number;
  dy: number;
  label?: string;
  accent?: boolean;
  dashed?: boolean;
}> = ({ x, y, dx, dy, label, accent = false, dashed = false }) => (
  <g fill={accent ? T.accent : T.text} stroke={accent ? T.accent : T.text}>
    <path
      d={`M${x} ${y} l${dx} ${dy}`}
      fill="none"
      strokeWidth="5"
      strokeDasharray={dashed ? '9 8' : undefined}
      markerEnd="url(#model-arrow)"
    />
    {label && (
      <text
        x={x + dx / 2 + (dx ? 0 : 27)}
        y={y + dy / 2 - (dx ? 22 : 0)}
        stroke="none"
        fontSize="35"
        textAnchor={dx ? 'middle' : 'start'}
      >
        {label}
      </text>
    )}
  </g>
);
const Ring: React.FC<{ x: number; y: number; rx?: number }> = ({ x, y, rx = 65 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry="40" fill="none" stroke={T.accent} strokeWidth="5" />
);

type Point = readonly [number, number];
type Glyph = Point[][];

const G: Record<string, Glyph> = {
  '0': [
    [
      [2, 2],
      [7, 0],
      [10, 3],
      [10, 13],
      [7, 16],
      [2, 14],
      [0, 4],
      [2, 2],
    ],
  ],
  '1': [
    [
      [2, 4],
      [6, 0],
      [6, 16],
    ],
    [
      [2, 16],
      [10, 16],
    ],
  ],
  '2': [
    [
      [0, 3],
      [3, 0],
      [8, 0],
      [10, 3],
      [9, 6],
      [0, 16],
      [11, 16],
    ],
  ],
  '3': [
    [
      [0, 2],
      [4, 0],
      [9, 1],
      [10, 5],
      [7, 8],
      [10, 10],
      [10, 14],
      [7, 16],
      [2, 16],
      [0, 14],
    ],
    [
      [4, 8],
      [7, 8],
    ],
  ],
  '4': [
    [
      [9, 16],
      [9, 0],
      [0, 11],
      [12, 11],
    ],
  ],
  '5': [
    [
      [10, 0],
      [1, 0],
      [0, 8],
      [7, 7],
      [10, 10],
      [9, 15],
      [5, 16],
      [1, 14],
    ],
  ],
  '6': [
    [
      [10, 1],
      [6, 0],
      [2, 3],
      [0, 10],
      [2, 15],
      [7, 16],
      [10, 13],
      [9, 9],
      [6, 7],
      [1, 9],
    ],
  ],
  '7': [
    [
      [0, 1],
      [11, 1],
      [4, 16],
    ],
  ],
  '8': [
    [
      [5, 8],
      [1, 6],
      [1, 2],
      [5, 0],
      [9, 2],
      [9, 6],
      [5, 8],
      [1, 10],
      [1, 14],
      [5, 16],
      [9, 14],
      [9, 10],
      [5, 8],
    ],
  ],
  '9': [
    [
      [10, 8],
      [7, 9],
      [2, 8],
      [0, 4],
      [2, 0],
      [7, 0],
      [10, 4],
      [9, 12],
      [6, 16],
      [2, 15],
    ],
  ],
  T: [
    [
      [0, 1],
      [12, 1],
    ],
    [
      [6, 1],
      [6, 16],
    ],
  ],
  F: [
    [
      [1, 16],
      [1, 0],
      [11, 0],
    ],
    [
      [1, 7],
      [9, 7],
    ],
  ],
  N: [
    [
      [1, 16],
      [1, 0],
      [11, 16],
      [11, 0],
    ],
  ],
  a: [
    [
      [9, 7],
      [6, 5],
      [2, 6],
      [0, 10],
      [2, 15],
      [6, 15],
      [9, 11],
    ],
    [
      [9, 5],
      [9, 16],
    ],
  ],
  g: [
    [
      [9, 7],
      [6, 5],
      [2, 6],
      [0, 10],
      [2, 14],
      [6, 15],
      [9, 11],
    ],
    [
      [9, 5],
      [9, 18],
      [6, 21],
      [2, 20],
    ],
  ],
  m: [
    [
      [0, 16],
      [0, 6],
      [4, 6],
      [5, 10],
      [7, 6],
      [11, 7],
      [11, 16],
    ],
  ],
  s: [
    [
      [10, 7],
      [7, 5],
      [2, 6],
      [1, 9],
      [8, 11],
      [10, 14],
      [7, 16],
      [1, 15],
    ],
  ],
  f: [
    [
      [4, 16],
      [5, 3],
      [8, 0],
      [11, 1],
    ],
    [
      [1, 7],
      [10, 7],
    ],
  ],
  '=': [
    [
      [0, 6],
      [12, 6],
    ],
    [
      [0, 12],
      [12, 12],
    ],
  ],
  '+': [
    [
      [0, 9],
      [12, 9],
    ],
    [
      [6, 3],
      [6, 15],
    ],
  ],
  '-': [
    [
      [0, 9],
      [11, 9],
    ],
  ],
  '/': [
    [
      [0, 18],
      [11, 0],
    ],
  ],
  '(': [
    [
      [9, 0],
      [5, 3],
      [3, 8],
      [3, 13],
      [6, 17],
      [9, 19],
    ],
  ],
  ')': [
    [
      [2, 0],
      [6, 3],
      [8, 8],
      [8, 13],
      [5, 17],
      [2, 19],
    ],
  ],
  '.': [
    [
      [4, 15],
      [5, 16],
    ],
  ],
  R: [
    [
      [1, 16],
      [1, 0],
      [9, 0],
      [11, 3],
      [9, 7],
      [1, 7],
    ],
    [
      [6, 7],
      [12, 16],
    ],
  ],
  μ: [
    [
      [1, 6],
      [1, 20],
    ],
    [
      [1, 13],
      [4, 16],
      [8, 15],
      [9, 6],
      [9, 16],
      [12, 16],
    ],
  ],
  '≤': [
    [
      [11, 2],
      [1, 8],
      [11, 13],
    ],
    [
      [1, 17],
      [12, 17],
    ],
  ],
  '~': [
    [
      [0, 10],
      [3, 7],
      [7, 12],
      [11, 8],
    ],
  ],
  '≈': [
    [
      [0, 6],
      [3, 4],
      [7, 8],
      [11, 5],
    ],
    [
      [0, 13],
      [3, 11],
      [7, 15],
      [11, 12],
    ],
  ],
};

Object.assign(G, {
  v: [
    [
      [0, 6],
      [5, 16],
      [11, 6],
    ],
  ],
  Δ: [
    [
      [0, 16],
      [6, 0],
      [12, 16],
      [0, 16],
    ],
  ],
  '×': [
    [
      [0, 3],
      [11, 14],
    ],
    [
      [11, 3],
      [0, 14],
    ],
  ],
  y: [
    [
      [1, 6],
      [5, 15],
      [10, 6],
    ],
    [
      [10, 6],
      [8, 17],
      [5, 22],
      [1, 21],
    ],
  ],
  b: [
    [
      [1, 0],
      [1, 16],
      [1, 8],
      [5, 6],
      [9, 7],
      [11, 11],
      [9, 15],
      [5, 16],
      [1, 14],
    ],
  ],
  c: [
    [
      [10, 7],
      [6, 5],
      [2, 7],
      [0, 11],
      [2, 15],
      [6, 16],
      [10, 14],
    ],
  ],
  e: [
    [
      [1, 10],
      [10, 10],
      [9, 7],
      [5, 5],
      [1, 8],
      [0, 12],
      [3, 16],
      [7, 16],
      [11, 14],
    ],
  ],
  h: [
    [
      [1, 0],
      [1, 16],
    ],
    [
      [1, 9],
      [5, 6],
      [8, 6],
      [10, 9],
      [10, 16],
    ],
  ],
  i: [
    [
      [5, 6],
      [5, 16],
    ],
    [
      [5, 1],
      [5.1, 1.1],
    ],
  ],
  l: [
    [
      [4, 0],
      [4, 14],
      [6, 16],
      [9, 15],
    ],
  ],
  n: [
    [
      [1, 6],
      [1, 16],
    ],
    [
      [1, 9],
      [5, 6],
      [8, 6],
      [10, 9],
      [10, 16],
    ],
  ],
  o: [
    [
      [5, 5],
      [1, 7],
      [0, 12],
      [3, 16],
      [8, 16],
      [11, 12],
      [10, 7],
      [5, 5],
    ],
  ],
  p: [
    [
      [1, 6],
      [1, 22],
    ],
    [
      [1, 8],
      [5, 6],
      [9, 7],
      [11, 11],
      [9, 15],
      [5, 16],
      [1, 14],
    ],
  ],
  r: [
    [
      [1, 6],
      [1, 16],
    ],
    [
      [1, 10],
      [5, 6],
      [9, 6],
    ],
  ],
  t: [
    [
      [5, 1],
      [5, 13],
      [7, 16],
      [10, 15],
    ],
    [
      [1, 6],
      [10, 6],
    ],
  ],
  u: [
    [
      [1, 6],
      [1, 13],
      [3, 16],
      [6, 16],
      [10, 12],
    ],
    [
      [10, 6],
      [10, 16],
    ],
  ],
  x: [
    [
      [1, 6],
      [10, 16],
    ],
    [
      [10, 6],
      [1, 16],
    ],
  ],
});

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
  return points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');
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
  const { id, text, x, y, scale, startFrame, endFrame, color = T.ink, width = 3.4 } = options;
  const raw: Array<{ points: Point[]; length: number }> = [];
  let cursor = x;
  for (const char of text) {
    if (char === ' ') {
      cursor += GLYPH_ADVANCE[' '] * scale;
      continue;
    }
    const glyph = G[char];
    if (!glyph) {
      throw new Error(`Missing handwriting glyph: ${char}`);
    }
    for (const segment of glyph) {
      const points = segment.map(([px, py]) => [cursor + (px + py * 0.055) * scale, y + py * scale] as Point);
      raw.push({ points, length: pointsLength(points) });
    }
    cursor += (GLYPH_ADVANCE[char] ?? 14) * scale;
  }
  const totalLength = raw.reduce((sum, stroke) => sum + stroke.length, 0);
  const gap = Math.min(1.2, Math.max(0, endFrame - startFrame) / (raw.length * 4));
  const available = Math.max(0.01, endFrame - startFrame - gap * Math.max(0, raw.length - 1));
  let nextFrame = startFrame;
  return raw.map((stroke, index) => {
    const durationFrames = Math.max(0.001, (available * stroke.length) / totalLength);
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
    nextFrame += durationFrames + gap;
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
          <ellipse cx={25} cy={22} rx={25} ry={17} fill="#b5b9b5" stroke="#737976" strokeWidth={2.2} />
          <rect x={-7} y={-3} width={53} height={8} rx={4} fill={T.accent} stroke={T.ink} strokeWidth={2} />
          <path d="M -10 1 L -2 -4 L -2 6 Z" fill={T.ink} />
          <circle cx={-10} cy={1} r={3.5} fill={T.ink} />
        </g>
      )}
    </g>
  );
};

interface Line {
  id: string;
  text: string;
  start: number;
  end: number;
  y: number;
  exponent?: string;
  resultAt?: number;
  prefixEnd?: number;
}
const Paper: React.FC<{ lines: Line[]; t: number; ringLine?: number; prompt?: string; note?: string }> = ({
  lines,
  t,
  ringLine = -1,
  prompt,
  note,
}) => {
  const { fps } = useVideoConfig();
  const strokes = useMemo(
    () =>
      lines.map((line) => {
        const width = line.text.split('').reduce((n: number, c: string) => n + (GLYPH_ADVANCE[c] ?? 14), 0);
        const scale = Math.min(2.8, 655 / width);
        const split = line.resultAt === undefined ? line.text.length : line.text.lastIndexOf('=') + 1;
        const prefix = line.text.slice(0, split);
        const prefixWidth = prefix.split('').reduce((n, c) => n + (GLYPH_ADVANCE[c] ?? 14), 0) * scale;
        const base = makeInkLine({
          id: line.id,
          text: prefix,
          x: 65,
          y: line.y,
          scale,
          startFrame: line.start * fps,
          endFrame:
            line.resultAt === undefined
              ? line.end * fps - (line.exponent ? 8 : 0)
              : (line.prefixEnd ?? line.resultAt) * fps,
          color: T.ink,
          width: 3.8,
        });
        if (line.resultAt !== undefined)
          base.push(
            ...makeInkLine({
              id: `${line.id}-result`,
              text: line.text.slice(split),
              x: 65 + prefixWidth,
              y: line.y,
              scale,
              startFrame: line.resultAt * fps,
              endFrame: line.end * fps - (line.exponent ? 8 : 0),
              color: T.ink,
              width: 3.8,
            }),
          );
        if (line.exponent)
          base.push(
            ...makeInkLine({
              id: `${line.id}-power`,
              text: line.exponent,
              x: 65 + width * scale,
              y: line.y - 16,
              scale: 1.6,
              startFrame: line.end * fps - 8,
              endFrame: line.end * fps,
              color: T.ink,
              width: 3.3,
            }),
          );
        return base;
      }),
    [lines, fps],
  );
  const ring = ringLine >= 0 ? lines[ringLine] : undefined;
  const ringWidth = ring
    ? ring.text.split('').reduce((n: number, c: string) => n + (GLYPH_ADVANCE[c] ?? 14), 0)
    : 1;
  const ringScale = Math.min(2.8, 655 / ringWidth);
  const prefix = ring ? ring.text.slice(0, ring.text.lastIndexOf('=') + 1) : '';
  const prefixWidth =
    prefix.split('').reduce((n: number, c: string) => n + (GLYPH_ADVANCE[c] ?? 14), 0) * ringScale;
  const resultWidth = ringWidth * ringScale - prefixWidth;
  return (
    <svg
      data-region="paper"
      width="810"
      height="660"
      viewBox="0 0 810 660"
      style={{ position: 'absolute', left: 1010, top: 250 }}
    >
      <rect width="810" height="660" rx="8" fill={T.paper} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M30 ${70 + i * 48} H780`} fill="none" stroke={T.line} strokeWidth="1.5" />
      ))}
      <path d="M48 25 V635" stroke={T.line} strokeWidth="2" />
      {lines.map((line, i) =>
        t >= line.start ? (
          <g key={line.id} data-ink-text={line.text + (line.exponent ? line.exponent : '')}>
            <InkPlayback strokes={strokes[i]} frame={t * fps} />
          </g>
        ) : null,
      )}
      {ringLine >= 0 && (
        <ellipse
          cx={65 + prefixWidth + resultWidth / 2}
          cy={lines[ringLine].y + 23}
          rx={resultWidth / 2 + 18}
          ry="54"
          fill="none"
          stroke={T.accent}
          strokeWidth="4"
        />
      )}
      {prompt && (
        <text data-card="true" x="65" y="105" fill={T.ink} fontSize="40">
          {prompt}
        </text>
      )}
      {note && (
        <text data-card="true" x="65" y="597" fill={T.ink} fontSize="29">
          {note}
        </text>
      )}
    </svg>
  );
};

const TIMES = [0, 10, 22, 27, 31, 53];
const POSITIONS = [0, 60, 96, 96, 88, 0];
const SPEEDS = [6, 6, 0, 0, -4, -4];
type Kind = 'velocity' | 'displacement';
const gx = (n: number) => 90 + (n / 58) * 600;
const gy = (kind: Kind, n: number) =>
  kind === 'velocity' ? 70 + ((8 - n) / 14) * 470 : 560 - (n / 110) * 470;
function position(n: number): number {
  if (n <= 10) return 6 * n;
  if (n <= 22) return 60 + 6 * (n - 10) - 0.25 * (n - 10) ** 2;
  if (n <= 27) return 96;
  if (n <= 31) return 96 - 0.5 * (n - 27) ** 2;
  return 88 - 4 * (n - 31);
}
function phasePoints(kind: Kind, i: number): Point[] {
  return Array.from({ length: 51 }, (_, j) => {
    const time = mix(TIMES[i], TIMES[i + 1], j / 50);
    return [
      gx(time),
      gy(kind, kind === 'velocity' ? mix(SPEEDS[i], SPEEDS[i + 1], j / 50) : position(time)),
    ] as Point;
  });
}
function wordEnd(s: Scene, id: string): number {
  const at = cue(s, id);
  return s.words.find((w) => w.end >= at && w.start >= at - 0.08)?.end ?? at + 0.4;
}
const GraphStroke: React.FC<{
  points: Point[];
  start: number;
  end: number;
  t: number;
  accent?: boolean;
  curve?: boolean;
}> = ({ points, start, end, t, accent = true, curve = false }) => {
  const { fps } = useVideoConfig();
  const stroke: InkStroke = {
    id: 'graph-stroke',
    points,
    d: pointsPath(points),
    length: pointsLength(points),
    startFrame: start * fps,
    durationFrames: Math.max(1, (end - start) * fps),
    color: accent ? T.accent : T.muted,
    width: 4,
  };
  return t >= start ? (
    <g data-graph-curve={curve || undefined}>
      <InkPlayback strokes={[stroke]} frame={t * fps} />
    </g>
  ) : null;
};
const GraphInk: React.FC<{
  text: string;
  x: number;
  y: number;
  start: number;
  end: number;
  t: number;
  scale?: number;
  ring?: boolean;
}> = ({ text, x, y, start, end, t, scale = 1.55, ring = false }) => {
  const { fps } = useVideoConfig();
  const width = (value: string) =>
    value.split('').reduce((sum, ch) => sum + (GLYPH_ADVANCE[ch] ?? 14), 0) * scale;
  const strokes = makeInkLine({
    id: text,
    text,
    x,
    y,
    scale,
    startFrame: start * fps,
    endFrame: end * fps,
    color: T.text,
    width: 2.8,
  });
  const prefix = text.slice(0, text.lastIndexOf('=') + 1);
  return t >= start ? (
    <g data-ink-text={text}>
      <InkPlayback strokes={strokes} frame={t * fps} />
      {ring && (
        <ellipse
          cx={x + width(prefix) + (width(text) - width(prefix)) / 2}
          cy={y + 14}
          rx={(width(text) - width(prefix)) / 2 + 12}
          ry="28"
          fill="none"
          stroke={T.accent}
          strokeWidth="3"
        />
      )}
    </g>
  ) : null;
};
const Axes: React.FC<{ kind: Kind; count: number; solved?: boolean; numeric?: boolean }> = ({
  kind,
  count,
  solved = false,
  numeric = true,
}) => {
  const zero = gy(kind, 0);
  const ticks = numeric ? TIMES.slice(0, count + 1) : [];
  const values =
    !numeric || count === 0
      ? []
      : kind === 'velocity'
        ? count >= 4
          ? [6, -4]
          : [6]
        : Array.from(new Set(POSITIONS.slice(1, count + 1)))
            .filter((v) => v !== 0)
            .sort((a, b) => a - b);
  return (
    <g fill={T.text} fontSize="26" stroke={T.muted}>
      <path d={`M90 50 V570 M90 ${zero} H710`} fill="none" strokeWidth="2.5" />
      {ticks.map((n) => (
        <g key={n}>
          <path data-axis-tick="true" d={`M${gx(n)} ${zero - 6} v12`} strokeWidth="2" />
          <text data-axis-text="true" x={gx(n)} y="650" textAnchor="middle" stroke="none">
            {n === 53 && !solved ? 'T' : n}
          </text>
        </g>
      ))}
      {values.map((n) => (
        <g key={n}>
          <path data-axis-tick="true" d={`M84 ${gy(kind, n)} h12`} strokeWidth="2" />
          <text data-axis-text="true" x="70" y={gy(kind, n) + 8} textAnchor="end" stroke="none">
            {n}
          </text>
        </g>
      ))}
      <text data-axis-text="true" x="750" y="650" stroke="none" fontSize="30">
        t / s
      </text>
      <text data-axis-text="true" x="90" y="25" stroke="none" fontSize="30">
        {kind === 'velocity' ? 'v / (m s⁻¹)' : 's / m'}
      </text>
    </g>
  );
};
const TravelGraph: React.FC<{
  s: Scene;
  t: number;
  kind: Kind;
  starts: number[];
  ends: number[];
  count: number;
  active?: number;
  solved?: boolean;
  children?: React.ReactNode;
}> = ({ t, kind, starts, ends, count, active = -1, solved, children }) => (
  <Diagram>
    <Axes kind={kind} count={count} solved={solved} />
    {starts.map((start, i) => (
      <GraphStroke
        key={i}
        points={phasePoints(kind, i)}
        start={start}
        end={ends[i]}
        t={t}
        accent={i === active}
        curve
      />
    ))}
    {children}
  </Diagram>
);
const Opening: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const state = latest(s, t, ['syllabus', 'quote', 'outcomes', 'shapes', 'area', 'gradients']);
  const index = ['shapes', 'area', 'gradients'].indexOf(state);
  return (
    <>
      <Header>
        {['outcomes', 'shapes', 'area', 'gradients'].includes(state)
          ? 'By the end you can...'
          : 'Syllabus 4.2 · p.32 (excerpt)'}
      </Header>
      {state === 'quote' && (
        <Card centre text="sketch and interpret displacement–time graphs and velocity–time graphs" />
      )}
      {index >= 0 && <Card centre text={OUTCOMES[index]} />}
    </>
  );
};
const GraphFacts: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const state = latest(s, t, ['velocity', 'slope', 'area', 'negative', 'displacement', 'return']);
  const kind = ['displacement', 'return'].includes(state) ? 'displacement' : 'velocity';
  const negative = state === 'negative';
  const points: Point[] =
    kind === 'displacement'
      ? [
          [160, 180],
          [610, 510],
        ]
      : negative
        ? [
            [160, gy('velocity', 0)],
            [610, 490],
          ]
        : [
            [160, gy('velocity', 0)],
            [610, 130],
          ];
  const names: Record<string, string> = {
    slope: 'Gradient gives acceleration',
    area: 'Signed area gives displacement',
    negative: 'Below-axis area is negative',
    displacement: 'Gradient gives velocity',
    return: 'Negative velocity means returning',
  };
  return (
    <>
      {state && (
        <Diagram>
          <Axes kind={kind} count={0} numeric={false} />
          {['area', 'negative'].includes(state) && (
            <path d={`${pointsPath(points)} L610 ${gy('velocity', 0)} Z`} fill={T.accent} opacity="0.15" />
          )}
          {state !== 'velocity' && (
            <GraphStroke
              points={points}
              start={cue(s, state === 'return' ? 'displacement' : state === 'area' ? 'slope' : state)}
              end={cue(s, state === 'return' ? 'displacement' : state === 'area' ? 'slope' : state) + 1.8}
              t={t}
              curve
            />
          )}
        </Diagram>
      )}
      {names[state] && <Card text={names[state]} />}
    </>
  );
};
const VelocityJourney: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const keys = ['constant', 'slowing', 'rest', 'reverse', 'return'];
  const starts = keys.map((k) => Math.max(cue(s, k), wordEnd(s, 'draw') + 0.1));
  const ends = ['ten', 'twentytwo', 'twentyseven', 'thirtyone', 'finish'].map((k) => cue(s, k) + 0.65);
  const count = ends.filter(
    (_, i) => t >= cue(s, ['ten', 'twentytwo', 'twentyseven', 'thirtyone', 'finish'][i]),
  ).length;
  const active = starts.filter((n) => t >= n).length - 1;
  const names = [
    'Constant velocity',
    'Uniform deceleration',
    'At rest',
    'Accelerating in reverse',
    'Constant return velocity',
  ];
  return (
    <>
      <TravelGraph s={s} t={t} kind="velocity" starts={starts} ends={ends} count={count} active={active} />
      {active >= 0 && <Card text={names[active]} />}
    </>
  );
};
const ReturnTime: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  const draw = wordEnd(s, 'draw') + 0.05;
  const hold = s.holds.filter((h) => h.kind === 'hold');
  const starts = Array.from({ length: 5 }, (_, i) => draw + i * 0.35),
    ends = starts.map((n) => n + 0.35);
  const rows = [
    { id: 'rectangle', value: 'sixty', text: '6 × 10 = 60 m' },
    { id: 'triangle', value: 'thirtysix', text: '12 × 6 / 2 = 36 m' },
    { id: 'total', value: 'ninetysix', text: '60 + 36 = 96 m' },
    { id: 'reverse', value: 'eight', text: '4 × 4 / 2 = 8 m' },
    { id: 'remaining', value: 'eightyeight', text: '96 - 8 = 88 m' },
    { id: 'duration', value: 'twentytwo', text: '88 / 4 = 22 s' },
    { id: 'total-time', value: 'fiftythree', text: 'T = 31 + 22 = 53 s' },
  ];
  const active = rows.filter((r) => t >= cue(s, r.id)).length - 1;
  const page = active < 3 ? 0 : active < 6 ? 3 : 6;
  const lines: Line[] = rows.slice(page, Math.max(page, active + 1)).map((r, i) => ({
    id: r.id,
    text: r.text,
    start: cue(s, r.id),
    resultAt: cue(s, r.value),
    prefixEnd: cue(s, r.value),
    end: hold[page + i].start - 0.1,
    y: 95 + i * 150,
  }));
  const ring = active >= 0 && t >= hold[active].start && t < hold[active].end ? active - page : -1;
  const areaIndex = active === 0 ? 0 : active === 1 ? 1 : active === 3 ? 3 : active >= 4 ? 4 : -1;
  const area = areaIndex >= 0 ? phasePoints('velocity', areaIndex) : [];
  return (
    <>
      <TravelGraph
        s={s}
        t={t}
        kind="velocity"
        starts={starts}
        ends={ends}
        count={t >= draw + 1.75 ? 5 : 0}
        solved={t >= cue(s, 'fiftythree')}
      >
        {area.length > 0 && (
          <path
            d={`${pointsPath(area)} L${area.at(-1)![0]} ${gy('velocity', 0)} L${area[0][0]} ${gy('velocity', 0)} Z`}
            fill={T.accent}
            opacity="0.2"
          />
        )}
      </TravelGraph>
      {active >= 0 && <Paper lines={lines} t={t} ringLine={ring} />}
    </>
  );
};
const Shapes: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const state = latest(s, t, ['straight', 'rest', 'curve', 'chord']);
  const names: Record<string, string> = {
    straight: 'Constant velocity: straight',
    rest: 'Rest: horizontal',
    curve: 'Changing velocity: curved',
    chord: 'A straight join misses changing velocity',
  };
  const points: Point[] =
    state === 'straight'
      ? [
          [150, 480],
          [630, 160],
        ]
      : state === 'rest'
        ? [
            [150, 270],
            [630, 270],
          ]
        : Array.from({ length: 51 }, (_, i) => [150 + i * 9.6, 170 + 0.13 * i * i] as Point);
  return (
    <>
      {state && (
        <Diagram>
          <Axes kind="displacement" count={0} numeric={false} />
          <GraphStroke
            points={points}
            start={cue(s, state === 'chord' ? 'curve' : state)}
            end={cue(s, state === 'chord' ? 'curve' : state) + 1.8}
            t={t}
            curve
          />
          {state === 'chord' && (
            <path
              data-graph-curve="true"
              d="M150 170 L630 495"
              fill="none"
              stroke={T.text}
              strokeDasharray="9 9"
              strokeWidth="3"
            />
          )}
        </Diagram>
      )}
      {names[state] && <Card text={names[state]} />}
    </>
  );
};
const Check: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  const state = latest(s, t, ['question', 'answer', 'shapes', 'area', 'gradients']);
  const i = ['shapes', 'area', 'gradients'].indexOf(state);
  return state === 'question' ? (
    <Card centre text="Negative velocity: must displacement be negative?" />
  ) : state === 'answer' ? (
    <Card centre text="Returning can still mean positive displacement" />
  ) : i >= 0 ? (
    <Card centre text={OUTCOMES[i]} tick={t >= cue(s, ['tick-shapes', 'tick-area', 'tick-gradients'][i])} />
  ) : null;
};
const JourneyClose: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  const hold = s.holds.filter((h) => h.kind === 'hold');
  const starts = Array.from({ length: 5 }, (_, i) =>
    Math.max(cue(s, `leg${i + 1}`), wordEnd(s, 'draw') + 0.1),
  );
  const ends = starts.map((_, i) => cue(s, `ds${i + 1}`) - 0.05);
  const active = starts.filter((n) => t >= n).length - 1;
  const i = Math.max(0, active),
    k = i + 1;
  const a: [number, number] = [gx(TIMES[i]), gy('displacement', POSITIONS[i])],
    b: [number, number] = [gx(TIMES[i + 1]), gy('displacement', POSITIONS[i + 1])];
  const ds = ['60', '36', '0', '-8', '-88'][i],
    dt = ['10', '12', '5', '4', '22'][i];
  const formulas = [
    'v = 60/10 = 6 m/s',
    'average v = 36/12 = 3 m/s',
    'v = 0/5 = 0 m/s',
    'average v = -8/4 = -2 m/s',
    'v = -88/22 = -4 m/s',
  ];
  const cards = [
    'Positive: steady outward motion',
    t >= cue(s, 'tangent2') ? 'Tangent falls from 6 to 0' : 'Positive average velocity',
    'Zero gradient: stationary',
    t >= cue(s, 'tangent4') ? 'Tangent falls from 0 to -4' : 'Negative average: returning',
    'Negative: constant motion back to O',
  ];
  const dsPos: Point[] = [
    [210, 390],
    [335, 205],
    [490, 130],
    [455, 180],
    [650, 350],
  ];
  const dtPos: Point[] = [
    [110, 575],
    [205, 315],
    [300, 180],
    [300, 110],
    [455, 130],
  ];
  const dsStart = cue(s, `ds${k}`),
    dtCue = cue(s, `dt${k}`),
    vCue = cue(s, `v${k}`);
  const dsEnd = Math.max(dtCue - 0.05, dsStart + 1.3);
  const dtStart = Math.max(dtCue, dsEnd + 0.05);
  const dtEnd = Math.max(vCue - 0.05, dtStart + 1.35);
  const gradientStart = Math.max(vCue, dtEnd + 0.05);
  const gradientEnd = Math.min(hold[i].start - 0.12, gradientStart + 5.5);
  const ring = active >= 0 && t >= hold[i].start && t < hold[i].end;
  const at = (id: string) => active >= 0 && t >= cue(s, id);
  return (
    <>
      <TravelGraph
        s={s}
        t={t}
        kind="displacement"
        starts={starts}
        ends={ends}
        count={active + 1}
        active={active}
        solved
      >
        {active >= 0 && (
          <>
            {at(`ds${k}`) && (
              <>
                <GraphStroke
                  points={[[b[0], a[1]], b]}
                  start={cue(s, `ds${k}`)}
                  end={cue(s, `ds${k}`) + 0.35}
                  t={t}
                />
                <GraphInk
                  text={`Δs=${ds} m`}
                  x={dsPos[i][0]}
                  y={dsPos[i][1]}
                  start={cue(s, `ds${k}`) + 0.35}
                  end={dsEnd}
                  t={t}
                  scale={1.55}
                />
              </>
            )}
            {at(`dt${k}`) && (
              <>
                <GraphStroke points={[a, [b[0], a[1]]]} start={dtStart} end={dtStart + 0.3} t={t} />
                <GraphInk
                  text={`Δt=${dt} s`}
                  x={dtPos[i][0]}
                  y={dtPos[i][1]}
                  start={dtStart + 0.3}
                  end={dtEnd}
                  t={t}
                  scale={1.55}
                />
                {[1, 3].includes(i) && at(`v${k}`) && (
                  <path
                    d={pointsPath([a, b])}
                    fill="none"
                    stroke={T.muted}
                    strokeDasharray="7 7"
                    strokeWidth="2"
                  />
                )}
              </>
            )}
            <GraphInk
              text={formulas[i]}
              x={100}
              y={65}
              start={gradientStart}
              end={gradientEnd}
              t={t}
              scale={1.9}
              ring={ring}
            />
          </>
        )}
      </TravelGraph>
      {active >= 0 && at(`v${k}`) && <Card text={cards[i]} />}
    </>
  );
};
const CONTENT = [Opening, GraphFacts, VelocityJourney, ReturnTime, Shapes, Check, JourneyClose];

/** Optional still-audit instrumentation: measures rendered DOM, never on-screen text. */
function useStillAudit(enabled: boolean, rootRef: React.RefObject<HTMLDivElement | null>) {
  const frame = useCurrentFrame();
  const [measurement, setMeasurement] = useState('');
  useLayoutEffect(() => {
    const container = rootRef.current;
    if (!enabled || !container || container.getBoundingClientRect().width === 0) return;
    const visible = (element: Element): boolean => {
      let node: Element | null = element;
      while (node) {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.001)
          return false;
        node = node.parentElement;
      }
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    const regions = Array.from(container.querySelectorAll('[data-region]')).filter(visible);
    const cards = Array.from(container.querySelectorAll('[data-card],[data-ink-text]'))
      .filter(visible)
      .map((el) => ({
        text: el.getAttribute('data-ink-text') ?? el.textContent ?? '',
        rect: el.getBoundingClientRect(),
      }));
    const axisText = Array.from(container.querySelectorAll('[data-axis-text]')).filter(visible);
    const obstacles = Array.from(
      container.querySelectorAll('[data-axis-tick],[data-graph-curve],[data-ink-text]'),
    ).filter(visible);
    const overlaps = (a: Element, b: Element): boolean => {
      const x = a.getBoundingClientRect(),
        y = b.getBoundingClientRect();
      return x.left < y.right + 2 && x.right + 2 > y.left && x.top < y.bottom + 2 && x.bottom + 2 > y.top;
    };
    const axisCollisions: Array<{ text: string; other: string }> = [];
    axisText.forEach((a, index) => {
      [...axisText.slice(index + 1), ...obstacles].forEach((b) => {
        if (overlaps(a, b))
          axisCollisions.push({
            text: a.textContent ?? '',
            other:
              b.textContent ||
              b.getAttribute('data-ink-text') ||
              (b.hasAttribute('data-axis-tick') ? 'tick' : 'curve'),
          });
      });
    });
    const root = container.getBoundingClientRect();
    const overflow = root
      ? [...regions, ...Array.from(container.querySelectorAll('svg[data-region] text')).filter(visible)].some(
          (el) => {
            const r = el.getBoundingClientRect();
            return (
              r.left < root.left - 1 ||
              r.top < root.top - 1 ||
              r.right > root.right + 1 ||
              r.bottom > root.bottom + 1
            );
          },
        )
      : true;
    setMeasurement(
      JSON.stringify({
        frame,
        regions: regions.length,
        maxWords: Math.max(0, ...cards.map((c) => c.text.trim().split(/\s+/).length)),
        cards: cards.map((c) => c.text),
        overflow,
        axisCollisions,
        axisText: axisText.map((el) => ({
          text: el.textContent,
          bounds: el.getBoundingClientRect().toJSON(),
        })),
        root: root?.toJSON(),
        bounds: regions.map((el) => ({
          region: el.getAttribute('data-region'),
          ...el.getBoundingClientRect().toJSON(),
        })),
      }),
    );
  }, [frame, enabled]);
  return enabled && measurement ? (
    <Artifact filename={`verify-travel-${String(frame).padStart(5, '0')}.json`} content={measurement} />
  ) : null;
}
export const MechanicsDrawingTravelGraphs: React.FC<MechanicsDrawingTravelGraphsProps> = ({
  audioEnabled = true,
  audit = false,
}) => {
  const { fps, width, height } = useVideoConfig();
  const rootRef = useRef<HTMLDivElement>(null);
  const auditArtifact = useStillAudit(audit, rootRef);
  return (
    <AbsoluteFill
      ref={rootRef}
      data-travel-root="true"
      style={{ background: T.bg, fontFamily: T.sans, overflow: 'hidden', width, height }}
    >
      {auditArtifact}
      <TransitionSeries>
        {SCENES.map((s, index) => {
          const Content = CONTENT[index];
          return (
            <React.Fragment key={s.id}>
              {index > 0 && (
                <TransitionSeries.Transition
                  presentation={fadeThroughGraphite}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              )}
              <TransitionSeries.Sequence
                name={HEADERS[index]}
                durationInFrames={
                  Math.ceil(s.duration * fps) + (index < SCENES.length - 1 ? TRANSITION_FRAMES : 0)
                }
              >
                <AbsoluteFill style={{ background: T.bg }}>
                  {index !== 0 && <Header>{HEADERS[index]}</Header>}
                  <Content s={s} />
                  {audioEnabled && <Audio src={staticFile(`audio/mechanics/${s.audio}`)} />}
                </AbsoluteFill>
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
