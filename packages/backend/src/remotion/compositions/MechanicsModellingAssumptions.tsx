/** A plain, narration-led explanation of modelling assumptions. */
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
import transcriptJson from '../public/transcripts/mechanics/modelling-assumptions.json';

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
  'Explain what modelling words let you ignore.',
  'Find acceleration and tension.',
  'Predict changes when assumptions fail.',
];
const HEADERS = [
  'What you will learn',
  'What a particle model ignores',
  'Why light and smooth give one tension',
  'Why a taut string links the motion',
  'What the other modelling words mean',
  'Find acceleration and tension',
  'What changes when the table is rough',
  'By the end you can...',
];
export interface MechanicsModellingAssumptionsProps {
  audioEnabled?: boolean;
  audit?: boolean;
}
export function getMechanicsModellingAssumptionsDuration(fps: number): number {
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
  const hold = s.holds.find((h) => t >= h.start && t < h.end);
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

interface SystemProps {
  parts?: string[];
  particle?: boolean;
  tip?: boolean;
  drag?: boolean;
  heavyString?: boolean;
  massivePulley?: boolean;
  roughPulley?: boolean;
  tensions?: number;
  unequal?: boolean;
  motion?: number;
  extensible?: boolean;
  slack?: boolean;
  travel?: number;
  acceleration?: boolean;
  rough?: boolean;
  curve?: boolean;
  bend?: boolean;
  masses?: number;
  gravity?: boolean;
  forceCount?: number;
  friction?: boolean;
  ring?: number;
}
const System: React.FC<SystemProps> = ({
  parts,
  particle,
  tip,
  drag,
  heavyString,
  massivePulley,
  roughPulley,
  tensions = 0,
  unequal,
  motion = 0,
  extensible,
  slack,
  travel = 0,
  acceleration,
  rough,
  curve,
  bend,
  masses = 0,
  gravity,
  forceCount = 0,
  friction,
  ring = -1,
}) => {
  const show = (name: string) => !parts || parts.includes(name);
  const bx = 220 + (extensible ? 0 : motion),
    by = 270;
  const hy = 470 + (slack ? 0 : motion);
  return (
    <g fill="none" stroke={T.text} strokeWidth="5" strokeLinejoin="round">
      {show('table') && (
        <g>
          <path d={curve ? 'M60 370 Q340 280 570 370' : bend ? 'M60 370 Q340 430 570 370' : 'M60 370 H570'} />
          <path d="M110 375 V635 M535 375 V635" stroke={T.muted} strokeWidth="4" />
        </g>
      )}
      {rough &&
        Array.from({ length: 18 }, (_, i) => (
          <path key={i} d={`M${95 + i * 25} 370 l12 10`} stroke={T.muted} strokeWidth="3" />
        ))}
      {show('pulley') && (
        <g>
          <path d="M575 370 L620 365" stroke={T.muted} />
          <circle
            cx="620"
            cy="365"
            r="45"
            stroke={massivePulley ? T.accent : T.text}
            strokeWidth={massivePulley ? 16 : 5}
          />
          <circle cx="620" cy="365" r="7" fill={T.text} />
        </g>
      )}
      {show('string') && (
        <path
          d={
            slack
              ? `M${bx + 115} 320 Q465 435 620 320 A45 45 0 0 1 665 365 Q695 425 665 ${hy}`
              : `M${particle ? bx + 58 : bx + 115} 320 H620 A45 45 0 0 1 665 365 V${hy}`
          }
          stroke={heavyString || extensible ? T.accent : T.text}
          strokeWidth={heavyString ? 12 : 4}
          strokeDasharray={extensible ? '8 5' : undefined}
        />
      )}
      {show('box') && (
        <g transform={tip ? `rotate(-20 ${bx + 115} 370)` : undefined}>
          {particle ? (
            <circle cx={bx + 58} cy="320" r="12" fill={T.text} />
          ) : (
            <rect x={bx} y={by} width="115" height="100" rx="5" fill={T.bg} />
          )}
        </g>
      )}
      {show('hanging') && <rect x="613" y={hy} width="104" height="110" rx="5" fill={T.bg} />}
      {masses >= 1 && (
        <text x={bx + 57} y="334" fill={T.text} stroke="none" fontSize="34" textAnchor="middle">
          3 kg
        </text>
      )}
      {masses >= 2 && (
        <text x="665" y={hy + 66} fill={T.text} stroke="none" fontSize="34" textAnchor="middle">
          2 kg
        </text>
      )}
      {gravity && (
        <text x="190" y="680" fill={T.text} stroke="none" fontSize="34">
          g = 10 m s⁻²
        </text>
      )}
      {drag && <Arrow x={bx} y={310} dx={-130} dy={0} label="Drag" accent />}
      {heavyString && <Arrow x={460} y={280} dx={0} dy={100} label="Weight" accent />}
      {tensions >= 1 && <Arrow x={380} y={228} dx={105} dy={0} label={unequal ? 'T₁' : 'T'} accent />}
      {tensions >= 2 && <Arrow x={750} y={428} dx={0} dy={-105} label={unequal ? 'T₂' : 'T'} accent />}
      {roughPulley && (
        <path d="M605 323 l5 12 m10 -15 l2 15 m13 -13 l-5 15 m17 -6 l-12 10" stroke={T.accent} />
      )}
      {travel >= 1 && <Arrow x={795} y={480} dx={0} dy={80} label={acceleration ? 'a' : 'd'} accent dashed />}
      {travel >= 2 && (
        <Arrow x={bx + 10} y={210} dx={80} dy={0} label={acceleration ? 'a' : 'd'} accent dashed />
      )}
      {forceCount >= 1 && <Arrow x={bx + 58} y={370} dx={0} dy={115} label="3g" />}
      {forceCount >= 2 && <Arrow x={bx + 58} y={270} dx={curve || bend ? -50 : 0} dy={-120} label="R" />}
      {forceCount >= 3 && <Arrow x={bx + 115} y={320} dx={120} dy={0} label="T" />}
      {forceCount >= 4 && <Arrow x={665} y={hy + 110} dx={0} dy={100} label="2g" />}
      {forceCount >= 5 && <Arrow x={665} y={hy} dx={0} dy={-115} label="T" />}
      {friction && <Arrow x={bx} y={340} dx={-130} dy={0} label="F" accent />}
      {ring === 0 && <Ring x={bx + 58} y={322} />}
      {ring === 1 && <Ring x={665} y={hy + 53} />}
      {ring === 2 && <Ring x={285} y={670} rx={42} />}
    </g>
  );
};

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
const Paper: React.FC<{ lines: Line[]; t: number; ringLine?: number; note?: string }> = ({
  lines,
  t,
  ringLine = -1,
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
      {note && (
        <text data-card="true" x="65" y="597" fill={T.ink} fontSize="29">
          {note}
        </text>
      )}
    </svg>
  );
};

const Opening: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const state = latest(s, t, [
    'syllabus',
    'smooth',
    'connected',
    'continuation',
    'outcomes',
    'explain',
    'find',
    'predict',
  ]);
  const header = ['outcomes', 'explain', 'find', 'predict'].includes(state)
    ? 'By the end you can...'
    : ['connected', 'continuation'].includes(state)
      ? 'Syllabus 4.4 · p.33'
      : 'Syllabus 4.1 · p.31';
  const text =
    state === 'smooth'
      ? 'use the model of a ‘smooth’ contact'
      : state === 'connected'
        ? 'solve simple problems which may be modelled'
        : state === 'continuation'
          ? 'as the motion of connected particles.'
          : state === 'explain'
            ? OUTCOMES[0]
            : state === 'find'
              ? OUTCOMES[1]
              : state === 'predict'
                ? OUTCOMES[2]
                : '';
  return (
    <>
      <Header>{header}</Header>
      {text && <Card text={text} centre />}
    </>
  );
};
const Particle: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const at = (id: string) => t >= cue(s, id);
  const card = at('include')
    ? 'Air resistance included'
    : at('air')
      ? 'Air resistance neglected'
      : at('particle')
        ? 'Particle'
        : '';
  return (
    <>
      <Diagram>
        <System
          parts={['hanging', 'box', 'table', 'string', 'pulley'].filter(at)}
          particle={at('size') && !at('tips')}
          tip={at('tips') && !at('air')}
          drag={at('drag')}
        />
      </Diagram>
      {card && <Card text={card} />}
    </>
  );
};
const Light: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const at = (id: string) => t >= cue(s, id);
  const card = at('rough')
    ? 'Rough pulley'
    : at('smooth')
      ? 'Smooth pulley'
      : at('massive')
        ? 'Massive pulley'
        : at('pulley')
          ? 'Light pulley'
          : at('heavy')
            ? 'Heavy string'
            : at('string')
              ? 'Light string'
              : 'Light: negligible mass';
  return (
    <>
      <Diagram>
        <System
          heavyString={at('heavy') && !at('pulley')}
          massivePulley={at('massive') && !at('smooth')}
          roughPulley={at('rough')}
          tensions={
            at('massive') && !at('smooth')
              ? at('spin')
                ? 2
                : 1
              : at('second-tension')
                ? 2
                : at('equal')
                  ? 1
                  : 0
          }
          unequal={(at('spin') && !at('smooth')) || at('unequal')}
        />
      </Diagram>
      <Card text={card} />
    </>
  );
};
const StringMotion: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const at = (id: string) => t >= cue(s, id);
  const motion = at('slack')
    ? clamp((t - cue(s, 'unlinked')) / 1.5) * 30
    : at('stretch')
      ? clamp((t - cue(s, 'stretch')) / 2) * 70
      : clamp((t - cue(s, 'lost')) / 2) * 55;
  return (
    <>
      <Diagram>
        <System
          motion={motion}
          extensible={at('extensible') && !at('slack')}
          slack={at('slack')}
          travel={at('extensible') ? 0 : at('lost') ? 2 : at('gained') ? 1 : 0}
          acceleration={at('acceleration')}
          tensions={!at('slack') ? 2 : 0}
        />
      </Diagram>
      <Card
        text={
          at('slack')
            ? 'Slack: no tension'
            : at('extensible')
              ? 'Extensible: length can change'
              : 'Inextensible: fixed length'
        }
      />
    </>
  );
};

const OtherWords: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  const at = (id: string) => t >= cue(s, id);
  const state = latest(s, t, [
    'other',
    'rod',
    'flexible',
    'light-rod',
    'heavy-rod',
    'beam',
    'uniform',
    'uneven-rod',
    'lamina',
    'plate',
    'uniform-lamina',
    'uneven-lamina',
    'bead',
    'thin-wire',
    'guide',
    'normal',
    'wire-friction',
    'peg',
    'moving',
    'smooth-peg',
    'rough-peg',
  ]);
  const names: Record<string, string> = {
    other: 'Extra vocabulary',
    rod: 'Rigid rod',
    flexible: 'Flexible rod',
    'light-rod': 'Light rod',
    'heavy-rod': 'Heavy rod',
    beam: 'Beam',
    uniform: 'Uniform rod',
    'uneven-rod': 'Non-uniform rod',
    lamina: 'Lamina',
    plate: 'Thick plate',
    'uniform-lamina': 'Uniform lamina',
    'uneven-lamina': 'Non-uniform lamina',
    bead: 'Bead',
    'thin-wire': 'Wire',
    guide: 'Thick guide',
    normal: 'Smooth wire',
    'wire-friction': 'Rough wire',
    peg: 'Fixed peg',
    moving: 'Moving support',
    'smooth-peg': 'Smooth peg',
    'rough-peg': 'Rough peg',
  };
  const rod = ['rod', 'flexible', 'light-rod', 'heavy-rod', 'beam', 'uniform', 'uneven-rod'].includes(state);
  const sheet = ['lamina', 'plate', 'uniform-lamina', 'uneven-lamina'].includes(state);
  const wire = ['bead', 'thin-wire', 'guide', 'normal', 'wire-friction'].includes(state);
  const peg = ['peg', 'moving', 'smooth-peg', 'rough-peg'].includes(state);
  const centre = state === 'uneven-rod' ? 570 : state === 'uneven-lamina' ? 550 : 420;
  const collapse = state === 'beam' && at('turning');
  return (
    <>
      <Diagram>
        {(!state || state === 'other') && <System />}
        {rod && (
          <g stroke={T.text} fill="none" strokeWidth="5">
            {collapse ? (
              <circle cx="420" cy="350" r="12" fill={T.text} />
            ) : (
              <path
                d={state === 'flexible' && at('bends') ? 'M150 350 Q420 500 690 350' : 'M150 350 H690'}
                strokeWidth={state === 'beam' ? 18 : 6}
              />
            )}
            {state === 'rod' && at('push') && <Arrow x={90} y={350} dx={55} dy={0} accent />}
            {state === 'rod' && at('pull') && <Arrow x={695} y={350} dx={90} dy={0} accent />}
            {state === 'heavy-rod' && at('weight') && (
              <Arrow x={420} y={350} dx={0} dy={150} label="Weight" accent />
            )}
            {state === 'beam' && at('positions') && !collapse && (
              <>
                <Arrow x={200} y={210} dx={0} dy={125} />
                <Arrow x={630} y={500} dx={0} dy={-125} />
              </>
            )}
            {['uniform', 'uneven-rod'].includes(state) && (
              <>
                {Array.from({ length: 10 }, (_, i) => (
                  <circle
                    key={i}
                    cx={180 + i * 53}
                    cy={350}
                    r={state === 'uneven-rod' && i > 5 ? 12 : 6}
                    fill={T.muted}
                    stroke="none"
                  />
                ))}
                {at('midpoint') && (
                  <Arrow x={at('shift-rod') ? centre : 420} y={365} dx={0} dy={140} label="Weight" accent />
                )}
                <path d={`M${centre - 27} 410 L${centre} 365 L${centre + 27} 410 Z`} stroke={T.muted} />
              </>
            )}
          </g>
        )}
        {sheet && (
          <g stroke={T.text} strokeWidth="4" fill="none">
            <path d="M210 240 H630 V460 H210 Z" fill={T.bg} />
            {state === 'plate' && <path d="M630 240 l35 40 v220 H245 l-35 -40 M630 460 l35 40" />}
            {['uniform-lamina', 'uneven-lamina'].includes(state) &&
              Array.from({ length: 20 }, (_, i) => (
                <circle
                  key={i}
                  cx={250 + (i % 5) * 80}
                  cy={280 + Math.floor(i / 5) * 48}
                  r={state === 'uneven-lamina' && i % 5 > 2 ? 12 : 5}
                  fill={T.muted}
                  stroke="none"
                />
              ))}
            {at('centroid') && (
              <Arrow x={at('shift-lamina') ? centre : 420} y={350} dx={0} dy={180} label="Weight" accent />
            )}
          </g>
        )}
        {wire && (
          <g fill="none" stroke={T.text} strokeWidth="5">
            <path d="M170 470 L700 250" strokeWidth={state === 'guide' ? 20 : 4} />
            <circle
              cx="430"
              cy={state === 'bead' && at('detached') ? 270 : 362}
              r="25"
              fill={T.bg}
              stroke={T.accent}
            />
            {['normal', 'wire-friction'].includes(state) && (
              <Arrow x={430} y={337} dx={-45} dy={-100} label="R" />
            )}
            {state === 'wire-friction' && <Arrow x={450} y={352} dx={95} dy={-40} label="F" accent />}
          </g>
        )}
        {peg && (
          <g
            transform={state === 'moving' ? 'translate(65 -40)' : undefined}
            fill="none"
            stroke={T.text}
            strokeWidth="5"
          >
            <path d="M120 330 H405 Q465 315 470 375 V570" />
            <circle cx="430" cy="375" r="43" fill={T.bg} />
            <path d="M395 405 L355 455 H495 L465 405" stroke={T.muted} />
            {at('peg-tension') && <Arrow x={200} y={280} dx={130} dy={0} label="T" accent />}
            {at('peg-tension') && (
              <Arrow x={540} y={535} dx={0} dy={-125} label={at('peg-unequal') ? 'T₂' : 'T'} accent />
            )}
            {state === 'rough-peg' && (
              <path d="M400 340 l10 13 m10 -22 l5 15 m20 -12 l-5 16" stroke={T.accent} />
            )}
          </g>
        )}
      </Diagram>
      {state && <Card text={names[state]} />}
    </>
  );
};

const Worked: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const actual = useCurrentFrame() / fps;
  const t = heldTime(s, actual);
  const at = (id: string) => t >= cue(s, id);
  const holds = s.holds.filter((h) => h.kind === 'hold');
  const ring = holds.findIndex((h) => actual >= h.start && actual < h.end);
  const forces = ['box-weight', 'reaction', 'box-tension', 'hanging-weight', 'hanging-tension'].filter(
    at,
  ).length;
  const second = at('acceleration');
  const lines: Line[] = second
    ? [
        { id: 'combined-copy', text: '2g = 5a', start: 0, end: 0.01, y: 110 },
        {
          id: 'acceleration',
          text: 'a = 2(10)/5 = 4 m s',
          exponent: '-2',
          start: cue(s, 'acceleration'),
          resultAt: cue(s, 'four'),
          prefixEnd: s.holds.find((h) => h.kind === 'pause' && h.start > cue(s, 'acceleration'))?.start,
          end: Math.min(holds[4].start - 0.2, cue(s, 'four') + 3),
          y: 300,
        },
        {
          id: 'tension',
          text: 'T = 3(4) = 12 N',
          start: cue(s, 'substitute'),
          resultAt: cue(s, 'twelve'),
          end: Math.min(holds[5].start - 0.2, cue(s, 'twelve') + 1.5),
          y: 480,
        },
      ]
    : [
        {
          id: 'table',
          text: 'T = 3a',
          start: cue(s, 'table-equation'),
          end: cue(s, 'hanging-equation') - 0.3,
          y: 110,
        },
        {
          id: 'hanging',
          text: '2g - T = 2a',
          start: cue(s, 'hanging-equation'),
          end: cue(s, 'add') - 0.3,
          y: 300,
        },
        {
          id: 'combined',
          text: '2g = (3 + 2)a = 5a',
          start: cue(s, 'add'),
          resultAt: cue(s, 'five'),
          end: Math.min(holds[3].start - 0.2, cue(s, 'five') + 0.8),
          y: 480,
        },
      ];
  return (
    <>
      <Diagram>
        <System
          masses={at('mass-two') ? 2 : at('mass-three') ? 1 : 0}
          gravity={at('ten')}
          travel={2}
          acceleration
          forceCount={forces}
          ring={ring < 3 ? ring : -1}
        />
      </Diagram>
      <Paper lines={lines} t={t} ringLine={ring === 3 ? 2 : ring === 4 ? 1 : ring === 5 ? 2 : -1} />
    </>
  );
};
const Rough: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const actual = useCurrentFrame() / fps;
  const t = heldTime(s, actual);
  const at = (id: string) => t >= cue(s, id);
  const question = at('question') && !at('answer');
  const initial = !at('table-equation');
  const answer = at('answer');
  const lines: Line[] = answer
    ? [
        { id: 'static', text: '0 ≤ F ≤ μR', start: cue(s, 'static'), end: cue(s, 'equality') - 0.2, y: 180 },
        { id: 'limit', text: 'F = μR', start: cue(s, 'equality'), end: cue(s, 'check') - 0.5, y: 365 },
      ]
    : initial
      ? [{ id: 'previous-result', text: 'a = 4 m s', exponent: '-2', start: 0, end: 0.01, y: 180 }]
      : [
          {
            id: 'rough-table',
            text: 'T - F = 3a',
            start: cue(s, 'table-equation'),
            end: cue(s, 'hanging-equation') - 0.2,
            y: 110,
          },
          {
            id: 'same-hanging',
            text: '2g - T = 2a',
            start: cue(s, 'hanging-equation'),
            end: cue(s, 'system-equation') - 0.1,
            y: 300,
          },
          {
            id: 'rough-system',
            text: '2g - F = 5a',
            start: cue(s, 'system-equation'),
            end: cue(s, 'less') - 0.1,
            y: 480,
          },
        ];
  return (
    <>
      <Diagram>
        <System
          masses={2}
          forceCount={5}
          curve={at('curved') && !at('bending')}
          bend={at('bending') && !at('smooth')}
          rough={at('rough')}
          friction={at('friction')}
        />
      </Diagram>
      {question ? (
        <Card text="Does rough always mean F = μR?" />
      ) : (
        <Paper
          lines={lines}
          t={t}
          note={
            initial
              ? 'Smooth table only'
              : answer && at('limiting')
                ? 'Limiting or stated sliding model'
                : undefined
          }
        />
      )}
    </>
  );
};
const Recap: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const index = t >= cue(s, 'predict') ? 2 : t >= cue(s, 'find') ? 1 : 0;
  const tick = useCue(s, ['tick-explain', 'tick-find', 'tick-predict'][index]);
  return <Card text={OUTCOMES[index]} centre tick={tick} />;
};
const CONTENT = [Opening, Particle, Light, StringMotion, OtherWords, Worked, Rough, Recap];

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
        root: root?.toJSON(),
        bounds: regions.map((el) => ({
          region: el.getAttribute('data-region'),
          ...el.getBoundingClientRect().toJSON(),
        })),
      }),
    );
  }, [frame, enabled]);
  return enabled && measurement ? (
    <Artifact filename={`verify-modelling-${String(frame).padStart(5, '0')}.json`} content={measurement} />
  ) : null;
}
export const MechanicsModellingAssumptions: React.FC<MechanicsModellingAssumptionsProps> = ({
  audioEnabled = true,
  audit = false,
}) => {
  const { fps, width, height } = useVideoConfig();
  const rootRef = useRef<HTMLDivElement>(null);
  const auditArtifact = useStillAudit(audit, rootRef);
  return (
    <AbsoluteFill
      ref={rootRef}
      data-modelling-root="true"
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
                durationInFrames={Math.ceil(s.duration * fps) + (index < 7 ? TRANSITION_FRAMES : 0)}
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
