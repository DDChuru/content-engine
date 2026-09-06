/** Multiple collisions: a moving three-sphere story and two separate momentum calculations. */
import React, { useLayoutEffect, useMemo, useState, useRef } from "react";
import {
  AbsoluteFill,
  Artifact,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import transcriptJson from "../public/transcripts/mechanics/multiple-collisions.json";

const TRANSITION_FRAMES = 15;
const T = {
  bg: "#171c20",
  paper: "#f6f3eb",
  ink: "#273238",
  line: "#d8dad5",
  text: "#e9e7e0",
  muted: "#a9afad",
  accent: "#3f9e89",
  sans: "Arial, sans-serif",
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
  "Draw a separate diagram for each collision.",
  "Carry each signed velocity into the next collision.",
  "Decide whether the particles will collide again.",
];
const HEADERS = [
  "What you will learn",
  "One collision at a time",
  "Follow the three spheres",
  "Collision 1: A with B",
  "Check who is catching whom",
  "Collision 2: B with C",
];
export interface MechanicsMultipleCollisionsProps {
  audioEnabled?: boolean;
  audit?: boolean;
}
export function getMechanicsMultipleCollisionsDuration(fps: number): number {
  return SCENES.reduce((n, s) => n + Math.ceil(s.duration * fps), 0);
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const progressBetween = (f: number, a: number, b: number) =>
  clamp((f - a) / Math.max(1, b - a));
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
  return ids.filter((id) => t >= cue(s, id)).at(-1) ?? "";
}
function heldTime(s: Scene, t: number): number {
  const hold = s.holds.find(
    (h) => h.kind === "hold" && t >= h.start && t < h.end,
  );
  return hold ? hold.start : t;
}

// Same fade-through presentation as MechanicsVelocityTimeGraphs: the two
// scenes never remain visible together. Audio runs outside the fade overlap.
type FadeProps = { background: string };
const FadeThrough: React.FC<
  TransitionPresentationComponentProps<FadeProps>
> = ({
  children,
  passedProps,
  presentationDirection,
  presentationProgress,
}) => {
  const opacity =
    presentationDirection === "exiting"
      ? interpolate(presentationProgress, [0, 0.5], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(presentationProgress, [0.5, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return (
    <AbsoluteFill style={{ background: passedProps.background, opacity }}>
      {children}
    </AbsoluteFill>
  );
};
const fadeThroughGraphite: TransitionPresentation<FadeProps> = {
  component: FadeThrough,
  props: { background: T.bg },
};

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    data-region="header"
    style={{
      position: "absolute",
      left: 100,
      top: 72,
      color: T.text,
      fontSize: 57,
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);
const Card: React.FC<{
  text: React.ReactNode;
  centre?: boolean;
  tick?: boolean;
}> = ({ text, centre = false, tick = false }) => (
  <div
    data-region="card"
    data-card="true"
    style={{
      position: "absolute",
      left: centre ? 300 : 1120,
      top: centre ? 330 : 370,
      width: centre ? 1320 : 730,
      minHeight: 230,
      padding: "55px 58px",
      boxSizing: "border-box",
      background: T.paper,
      color: T.ink,
      fontSize: centre ? 62 : 48,
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
        style={{ display: "block", marginTop: 28 }}
      >
        <path
          d="M8 28 L27 47 L61 9"
          fill="none"
          stroke={T.accent}
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    )}
  </div>
);
const Diagram: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    data-region="diagram"
    viewBox="0 0 850 710"
    width="1030"
    height="860"
    style={{ position: "absolute", left: 20, top: 180, overflow: "visible" }}
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
      strokeDasharray={dashed ? "9 8" : undefined}
      markerEnd="url(#model-arrow)"
    />
    {label && (
      <text
        x={x + dx / 2 + (dx ? 0 : 27)}
        y={y + dy / 2 - (dx ? 22 : 0)}
        stroke="none"
        fontSize="35"
        textAnchor={dx ? "middle" : "start"}
      >
        {label}
      </text>
    )}
  </g>
);
const Ring: React.FC<{ x: number; y: number; rx?: number }> = ({
  x,
  y,
  rx = 65,
}) => (
  <ellipse
    cx={x}
    cy={y}
    rx={rx}
    ry="40"
    fill="none"
    stroke={T.accent}
    strokeWidth="5"
  />
);

type Point = readonly [number, number];
type Glyph = Point[][];

const G: Record<string, Glyph> = {
  B: [
    [
      [0, 0],
      [0, 16],
    ],
    [
      [0, 0],
      [7, 0],
      [10, 3],
      [9, 6],
      [0, 8],
      [8, 8],
      [11, 11],
      [9, 15],
      [0, 16],
    ],
  ],
  w: [
    [
      [0, 3],
      [2, 16],
      [6, 9],
      [10, 16],
      [13, 3],
    ],
  ],
  ">": [
    [
      [0, 2],
      [11, 8],
      [0, 15],
    ],
  ],

  "0": [
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
  "1": [
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
  "2": [
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
  "3": [
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
  "4": [
    [
      [9, 16],
      [9, 0],
      [0, 11],
      [12, 11],
    ],
  ],
  "5": [
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
  "6": [
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
  "7": [
    [
      [0, 1],
      [11, 1],
      [4, 16],
    ],
  ],
  "8": [
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
  "9": [
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
  "=": [
    [
      [0, 6],
      [12, 6],
    ],
    [
      [0, 12],
      [12, 12],
    ],
  ],
  "+": [
    [
      [0, 9],
      [12, 9],
    ],
    [
      [6, 3],
      [6, 15],
    ],
  ],
  "-": [
    [
      [0, 9],
      [11, 9],
    ],
  ],
  "/": [
    [
      [0, 18],
      [11, 0],
    ],
  ],
  "(": [
    [
      [9, 0],
      [5, 3],
      [3, 8],
      [3, 13],
      [6, 17],
      [9, 19],
    ],
  ],
  ")": [
    [
      [2, 0],
      [6, 3],
      [8, 8],
      [8, 13],
      [5, 17],
      [2, 19],
    ],
  ],
  ".": [
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
  "≤": [
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
  "~": [
    [
      [0, 10],
      [3, 7],
      [7, 12],
      [11, 8],
    ],
  ],
  "≈": [
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
  "×": [
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

const GLYPH_ADVANCE: Record<string, number> = {
  " ": 7,
  ".": 6,
  "(": 9,
  ")": 9,
};

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
    .map(
      ([x, y], index) =>
        `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`,
    )
    .join(" ");
}

function pointsLength(points: Point[]): number {
  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    length += Math.hypot(
      points[index][0] - points[index - 1][0],
      points[index][1] - points[index - 1][1],
    );
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
  const {
    id,
    text,
    x,
    y,
    scale,
    startFrame,
    endFrame,
    color = T.ink,
    width = 3.4,
  } = options;
  const raw: Array<{ points: Point[]; length: number }> = [];
  let cursor = x;
  for (const char of text) {
    if (char === " ") {
      cursor += GLYPH_ADVANCE[" "] * scale;
      continue;
    }
    const glyph = G[char];
    if (!glyph) {
      throw new Error(`Missing handwriting glyph: ${char}`);
    }
    for (const segment of glyph) {
      const points = segment.map(
        ([px, py]) =>
          [
            cursor + (px + py * 0.055) * scale * (char === "B" ? 0.65 : 1),
            y +
              (char === "B" ? 11 * scale : 0) +
              py * scale * (char === "B" ? 0.65 : 1),
          ] as Point,
      );
      raw.push({ points, length: pointsLength(points) });
    }
    cursor += (GLYPH_ADVANCE[char] ?? 14) * scale;
  }
  const totalLength = raw.reduce((sum, stroke) => sum + stroke.length, 0);
  const gap = Math.min(
    1.2,
    Math.max(0, endFrame - startFrame) / (raw.length * 4),
  );
  const available = Math.max(
    0.01,
    endFrame - startFrame - gap * Math.max(0, raw.length - 1),
  );
  let nextFrame = startFrame;
  return raw.map((stroke, index) => {
    const durationFrames = Math.max(
      0.001,
      (available * stroke.length) / totalLength,
    );
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
    const progress = progressBetween(
      frame,
      stroke.startFrame,
      stroke.startFrame + stroke.durationFrames,
    );
    if (
      frame >= stroke.startFrame &&
      frame < stroke.startFrame + stroke.durationFrames
    ) {
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
          <ellipse
            cx={25}
            cy={22}
            rx={25}
            ry={17}
            fill="#b5b9b5"
            stroke="#737976"
            strokeWidth={2.2}
          />
          <rect
            x={-7}
            y={-3}
            width={53}
            height={8}
            rx={4}
            fill={T.accent}
            stroke={T.ink}
            strokeWidth={2}
          />
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
const Paper: React.FC<{
  lines: Line[];
  t: number;
  ringLine?: number;
  prompt?: string;
  note?: string;
}> = ({ lines, t, ringLine = -1, prompt, note }) => {
  const { fps } = useVideoConfig();
  const strokes = useMemo(
    () =>
      lines.map((line) => {
        const width = line.text
          .split("")
          .reduce((n: number, c: string) => n + (GLYPH_ADVANCE[c] ?? 14), 0);
        const scale = Math.min(2.8, 655 / width);
        const split =
          line.resultAt === undefined
            ? line.text.length
            : line.text.lastIndexOf("=") + 1;
        const prefix = line.text.slice(0, split);
        const prefixWidth =
          prefix.split("").reduce((n, c) => n + (GLYPH_ADVANCE[c] ?? 14), 0) *
          scale;
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
    ? ring.text
        .split("")
        .reduce((n: number, c: string) => n + (GLYPH_ADVANCE[c] ?? 14), 0)
    : 1;
  const ringScale = Math.min(2.8, 655 / ringWidth);
  const prefix = ring ? ring.text.slice(0, ring.text.lastIndexOf("=") + 1) : "";
  const prefixWidth =
    prefix
      .split("")
      .reduce((n: number, c: string) => n + (GLYPH_ADVANCE[c] ?? 14), 0) *
    ringScale;
  const resultWidth = ringWidth * ringScale - prefixWidth;
  return (
    <svg
      data-region="paper"
      width="760"
      height="660"
      viewBox="0 0 810 660"
      style={{ position: "absolute", left: 1110, top: 250 }}
    >
      <rect width="810" height="660" rx="8" fill={T.paper} />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={`M30 ${70 + i * 48} H780`}
          fill="none"
          stroke={T.line}
          strokeWidth="1.5"
        />
      ))}
      <path d="M48 25 V635" stroke={T.line} strokeWidth="2" />
      {lines.map((line, i) =>
        t >= line.start ? (
          <g
            key={line.id}
            data-ink-text={line.text + (line.exponent ? line.exponent : "")}
          >
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

function wordEnd(s: Scene, id: string): number {
  const at = cue(s, id);
  return (
    s.words.find((w) => w.end >= at && w.start >= at - 0.08)?.end ?? at + 0.4
  );
}
function signpostEnd(s: Scene, id: string): number {
  return s.holds.find(
    (h) => h.kind === "hold" && h.duration === 1.5 && h.start >= cue(s, id),
  )!.end;
}
const Subscript: React.FC<{ letter: string; sub: string }> = ({
  letter,
  sub,
}) => (
  <>
    {letter}
    <tspan baselineShift="sub" fontSize="70%">
      {sub}
    </tspan>
  </>
);
const ContactFlash: React.FC<{ x: number; y: number; elapsed: number }> = ({
  x,
  y,
  elapsed,
}) =>
  elapsed >= 0 && elapsed < 0.45 ? (
    <g data-contact-flash="true" opacity={1 - elapsed / 0.45}>
      <circle
        cx={x}
        cy={y}
        r={20 + elapsed * 90}
        fill="none"
        stroke={T.accent}
        strokeWidth={5}
      />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${x + Math.cos((i * Math.PI) / 4) * 22} ${y + Math.sin((i * Math.PI) / 4) * 22} l${Math.cos((i * Math.PI) / 4) * 25} ${Math.sin((i * Math.PI) / 4) * 25}`}
          stroke={T.accent}
          strokeWidth={4}
        />
      ))}
    </g>
  ) : null;
interface BallState {
  id: string;
  x: number;
  v: number;
  radius?: number;
  mass?: number;
  unknown?: "v" | "w";
  showVelocity?: boolean;
  showMass?: boolean;
  accent?: boolean;
}
const Sphere: React.FC<{
  ball: BallState;
  index: number;
  y?: number;
  numeric?: boolean;
}> = ({ ball, index, y = 390 - (ball.radius ?? 36), numeric = true }) => {
  const arrowY = y - 120 - index * 85;
  const length = ball.unknown ? 90 : Math.abs(ball.v) * 35;
  const direction = ball.v < 0 ? -1 : 1;
  const start = ball.x;
  const end = start + direction * length;
  const colour = ball.accent ? T.accent : T.text;
  return (
    <g>
      <defs>
        <radialGradient id={`sphere-${ball.id}`} cx="32%" cy="25%">
          <stop offset="0" stopColor="#f2f1e9" />
          <stop offset="0.6" stopColor="#b5b9b5" />
          <stop offset="1" stopColor="#687671" />
        </radialGradient>
      </defs>
      <circle
        data-sphere="true"
        data-id={ball.id}
        data-x={ball.x}
        data-velocity={ball.v}
        cx={ball.x}
        cy={y}
        r={ball.radius ?? 36}
        data-radius={ball.radius ?? 36}
        fill={`url(#sphere-${ball.id})`}
        stroke={ball.accent ? T.accent : T.muted}
        strokeWidth={4}
      />
      <text
        data-diagram-text="true"
        x={ball.x}
        y={y + 85}
        textAnchor="middle"
        fill={T.text}
        fontSize={38}
      >
        {ball.id}
      </text>
      {ball.showMass && (
        <text
          data-diagram-text="true"
          x={ball.x}
          y={y + 138}
          textAnchor="middle"
          fill={T.text}
          fontSize={33}
        >
          {ball.mass} kg
        </text>
      )}
      {ball.showVelocity && (
        <g
          data-velocity-arrow={ball.unknown ? "unknown" : "known"}
          data-speed={ball.v}
          data-length={length}
        >
          <path
            data-arrow="true"
            d={`M${start} ${arrowY} H${end}`}
            fill="none"
            stroke={colour}
            strokeWidth={4}
            strokeDasharray={ball.unknown ? "9 7" : undefined}
          />
          <path
            data-arrow="true"
            d={`M${end - direction * 12} ${arrowY - 8} L${end} ${arrowY} L${end - direction * 12} ${arrowY + 8}`}
            fill="none"
            stroke={colour}
            strokeWidth={4}
          />
          {numeric && (
            <text
              data-diagram-text="true"
              x={(start + end) / 2}
              y={arrowY - 22}
              textAnchor="middle"
              fill={T.text}
              fontSize={30}
            >
              {ball.unknown ? (
                <Subscript letter={ball.unknown} sub="B" />
              ) : (
                <>
                  {ball.v > 0 ? "+" : "−"}
                  {Math.abs(ball.v)} m s⁻¹
                </>
              )}
            </text>
          )}
        </g>
      )}
    </g>
  );
};
const Track: React.FC<{
  balls: BallState[];
  wide?: boolean;
  numeric?: boolean;
  positive?: boolean;
  label?: string;
  flash?: { x: number; elapsed: number };
  children?: React.ReactNode;
}> = ({
  balls,
  wide = false,
  numeric = true,
  positive = false,
  label,
  flash,
  children,
}) => (
  <svg
    data-region="diagram"
    width={wide ? 1760 : 1030}
    height={wide ? 690 : 800}
    viewBox={wide ? "0 0 1760 690" : "0 0 900 700"}
    style={{
      position: "absolute",
      left: wide ? 80 : 20,
      top: wide ? 250 : 200,
    }}
  >
    {label && (
      <text
        data-diagram-text="true"
        data-card="true"
        x={450}
        y={48}
        textAnchor="middle"
        fill={T.text}
        fontSize={36}
      >
        {label}
      </text>
    )}
    {positive && (
      <g>
        <text
          data-diagram-text="true"
          x={150}
          y={100}
          fill={T.text}
          fontSize={27}
        >
          Right positive
        </text>
        <path
          data-arrow="true"
          d="M150 125 H320 M308 117 L320 125 L308 133"
          stroke={T.accent}
          strokeWidth={3}
          fill="none"
        />
      </g>
    )}
    <path
      d={`M70 390 H${wide ? 1680 : 830}`}
      stroke={T.muted}
      strokeWidth={3}
    />
    <path
      d={`M70 408 H${wide ? 1680 : 830}`}
      stroke={T.muted}
      strokeWidth={2}
      opacity={0.3}
    />
    {balls.map((ball, i) => (
      <Sphere key={ball.id} ball={ball} index={i} numeric={numeric} />
    ))}
    {flash && (
      <ContactFlash
        x={flash.x}
        y={390 - (balls[0]?.radius ?? 36)}
        elapsed={flash.elapsed}
      />
    )}
    {children}
  </svg>
);
const Opening: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const state = latest(s, t, [
    "syllabus",
    "quote1",
    "quote2",
    "outcomes",
    "diagram",
    "carry",
    "decide",
  ]);
  const i = ["diagram", "carry", "decide"].indexOf(state);
  return (
    <>
      <Header>
        {["outcomes", "diagram", "carry", "decide"].includes(state)
          ? "By the end you can..."
          : "Syllabus 4.3 · p.32"}
      </Header>
      {state === "quote1" && (
        <Card
          centre
          text="use conservation of linear momentum to solve problems"
        />
      )}
      {state === "quote2" && (
        <Card
          centre
          text="that may be modelled as the direct impact of two bodies."
        />
      )}
      {i >= 0 && <Card centre text={OUTCOMES[i]} />}
    </>
  );
};
const Method: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const state = latest(s, t, [
    "multiple",
    "wall",
    "third",
    "separate",
    "diagram",
    "unique",
    "rebound",
  ]);
  const cards: Record<string, string> = {
    multiple: "After one impact, another may follow",
    separate: "Each collision changes the velocities",
    diagram: "Draw a separate diagram",
    unique: "Give each new velocity a unique name",
    rebound: "Use the given rebound information",
  };
  if (cards[state]) return <Card centre text={cards[state]} />;
  if (state === "wall") {
    const p = clamp(
      (t - cue(s, "wall")) / Math.max(0.1, cue(s, "third") - cue(s, "wall")),
    );
    return (
      <Track
        numeric={false}
        balls={[
          { id: "B", x: 280 + p * 350, v: 3, showVelocity: true, accent: true },
        ]}
      >
        <path
          d="M740 150 V390 M740 150 l35 -20 M740 200 l35 -20 M740 250 l35 -20 M740 300 l35 -20 M740 350 l35 -20"
          stroke={T.text}
          strokeWidth={5}
        />
      </Track>
    );
  }
  return state === "third" ? (
    <Track
      numeric={false}
      balls={[
        { id: "A", x: 170, v: 4, showVelocity: true },
        { id: "B", x: 440, v: 3, showVelocity: true },
        { id: "C", x: 700, v: 1, showVelocity: true, accent: true },
      ]}
    />
  ) : null;
};
// A physically continuous hard-sphere trajectory. Units here are metres; each
// sphere has radius .3 m solely to make contact geometry explicit in the visual.
function trajectory(time: number): { x: number[]; v: number[] } {
  if (time <= 2)
    return { x: [4 * time, 2.6 + 3 * time, 10.2 + time], v: [4, 3, 1] };
  if (time <= 3)
    return {
      x: [8 + 2 * (time - 2), 8.6 + 4 * (time - 2), 12.2 + (time - 2)],
      v: [2, 4, 1],
    };
  return {
    x: [10 + 2 * (time - 3), 12.6 + (time - 3), 13.2 + 3 * (time - 3)],
    v: [2, 1, 3],
  };
}
const Story: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const first = cue(s, "first"),
    second = cue(s, "second");
  const time =
    t < first
      ? 2 * clamp((t - cue(s, "setup")) / (first - cue(s, "setup")))
      : t < second
        ? 2 + clamp((t - first) / (second - first))
        : 3 + 0.7 * clamp((t - second) / (cue(s, "question") - second));
  const state = trajectory(time);
  const balls = state.x.map((x, i) => ({
    id: ["A", "B", "C"][i],
    x: 100 + x * 100,
    radius: 30,
    v: state.v[i],
    showVelocity: true,
    accent: i === (t < first ? 0 : t < second ? 1 : 2),
  }));
  const contact1 = trajectory(2),
    contact2 = trajectory(3);
  const flash =
    t >= second
      ? { x: (contact2.x[1] + contact2.x[2]) * 50 + 100, elapsed: t - second }
      : { x: (contact1.x[0] + contact1.x[1]) * 50 + 100, elapsed: t - first };
  return <Track wide numeric={false} balls={balls} flash={flash} />;
};
function collisionBalls(s: Scene, t: number, which: 1 | 2): BallState[] {
  const after = t >= cue(s, "after");
  const solved = t >= cue(s, "result");
  if (which === 1)
    return [
      {
        id: "A",
        x: 220,
        v: after ? 2 : 4,
        mass: 1,
        showMass: t >= cue(s, "mass-a"),
        showVelocity: t >= cue(s, after ? "after-a" : "speed-a"),
        accent: !after,
      },
      {
        id: "B",
        x: 590,
        v: after ? (solved ? 4 : 1) : 3,
        mass: 2,
        showMass: t >= cue(s, "mass-b"),
        showVelocity: t >= cue(s, after ? "unknown" : "speed-b"),
        unknown: after && !solved ? "v" : undefined,
        accent: after,
      },
    ];
  return [
    {
      id: "B",
      x: 220,
      v: after ? (solved ? 1 : 1) : 4,
      mass: 2,
      showMass: t >= cue(s, "mass-b"),
      showVelocity: t >= cue(s, after ? "unknown" : "speed-b"),
      unknown: after && !solved ? "w" : undefined,
      accent: after,
    },
    {
      id: "C",
      x: 590,
      v: after ? 3 : 1,
      mass: 3,
      showMass: t >= cue(s, "mass-c"),
      showVelocity: t >= cue(s, after ? "after-c" : "speed-c"),
      accent: !after,
    },
  ];
}
const CollisionWorking: React.FC<{ s: Scene; which: 1 | 2; t: number }> = ({
  s,
  which,
  t,
}) => {
  const results = s.holds.filter((h) => h.kind === "hold" && h.duration === 2);
  const stages = ["equation", "simplify", "solve"];
  const active = stages.filter((k) => t >= cue(s, k)).length - 1;
  const texts =
    which === 1
      ? ["1×4 + 2×3 = 1×2 + 2vB", "10 = 2 + 2vB", "vB = 4 m s"]
      : ["2×4 + 3×1 = 2wB + 3×3", "11 = 2wB + 9", "wB = 1 m s"];
  const lines: Line[] = texts.slice(0, active + 1).map((text, i) => ({
    id: stages[i],
    text,
    start: cue(s, stages[i]),
    end: results[i].start - 0.1,
    y: 95 + i * 150,
    ...(i === 2 ? { resultAt: cue(s, "result"), exponent: "-1" } : {}),
  }));
  const ring =
    active >= 0 && t >= results[active].start && t < results[active].end
      ? active
      : -1;
  const drawn = t > wordEnd(s, "draw");
  return (
    <>
      <Track
        balls={
          drawn
            ? collisionBalls(s, t, which)
            : [
                { id: which === 1 ? "A" : "B", x: 220, v: 0 },
                { id: which === 1 ? "B" : "C", x: 590, v: 0 },
              ]
        }
        positive={drawn}
        label={
          drawn
            ? t >= cue(s, "after")
              ? "After collision " + which
              : "Before collision " + which
            : undefined
        }
      />
      {active >= 0 ? (
        <Paper lines={lines} t={t} ringLine={ring} />
      ) : t >= cue(s, "conserve") ? (
        <Card text="Momentum before = momentum after" />
      ) : null}
    </>
  );
};
const FirstCollision: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  if (t < signpostEnd(s, "signpost"))
    return t >= cue(s, "signpost") ? (
      <Card centre text="Now collision 1" />
    ) : null;
  return <CollisionWorking s={s} which={1} t={t} />;
};
const DirectionCheck: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  const state = latest(s, t, [
    "rule",
    "question",
    "answer",
    "negative",
    "signed",
    "diagram",
    "carry",
    "decide",
  ]);
  const outcome = ["diagram", "carry", "decide"].indexOf(state);
  if (outcome >= 0) {
    const key = ["diagram", "carry", "decide"][outcome];
    return (
      <Card centre text={OUTCOMES[outcome]} tick={t >= cue(s, `tick-${key}`)} />
    );
  }
  if (state === "question")
    return <Card centre text="Both moving left: can they collide?" />;
  if (!state) return null;
  const left = ["answer", "negative", "signed"].includes(state);
  const start = cue(s, left ? "answer" : "rule");
  const p = clamp((t - start) / 7);
  const balls: BallState[] = left
    ? [
        { id: "A", x: 430 - p * 70, v: -1, showVelocity: true },
        { id: "B", x: 710 - p * 210, v: -3, showVelocity: true, accent: true },
      ]
    : [
        { id: "A", x: 180 + p * 180, v: 3, showVelocity: true, accent: true },
        { id: "B", x: 540 + p * 60, v: 1, showVelocity: true },
      ];
  return (
    <>
      <Track balls={balls} numeric={false} />
      <Card
        text={
          state === "signed" ? (
            <>
              A left of B: v<sub>A</sub> &gt; w<sub>B</sub> closes the gap
            </>
          ) : state === "negative" ? (
            "More negative means faster leftwards"
          ) : left ? (
            "B is behind when moving left"
          ) : (
            "Same direction: faster from behind means a collision"
          )
        }
      />
    </>
  );
};
const LastCollision: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  if (t < signpostEnd(s, "signpost"))
    return t >= cue(s, "signpost") ? (
      <Card centre text="Now collision 2" />
    ) : null;
  if (t < cue(s, "decision")) return <CollisionWorking s={s} which={2} t={t} />;
  if (t < signpostEnd(s, "decision"))
    return <Card centre text="Now: will they collide again?" />;
  const movement = clamp(
    (t - cue(s, "closing")) /
      Math.max(0.1, cue(s, "catch") - cue(s, "closing")),
  );
  const balls: BallState[] = [
    {
      id: "A",
      x: 220 + 276 * movement,
      v: 2,
      showVelocity: t >= cue(s, "speed-a"),
      accent: true,
    },
    {
      id: "B",
      x: 430 + 138 * movement,
      v: 1,
      showVelocity: t >= cue(s, "last-b"),
    },
  ];
  const hold = s.holds.filter((h) => h.kind === "hold" && h.duration === 2)[3];
  const comparison = t >= cue(s, "compare") && t < cue(s, "closing");
  return (
    <>
      <Track balls={balls} flash={{ x: 532, elapsed: t - cue(s, "catch") }} />
      {comparison ? (
        <Paper
          lines={[
            {
              id: "compare",
              text: "+2 > +1",
              start: cue(s, "compare"),
              end: hold.start - 0.1,
              y: 220,
            },
          ]}
          t={t}
          ringLine={t >= hold.start && t < hold.end ? 0 : -1}
        />
      ) : t >= cue(s, "catch") ? (
        <Card text="Yes: A catches B again" />
      ) : t >= cue(s, "closing") ? (
        <Card text="The gap closes" />
      ) : null}
    </>
  );
};
const CONTENT = [
  Opening,
  Method,
  Story,
  FirstCollision,
  DirectionCheck,
  LastCollision,
];
const SceneHeading: React.FC<{ s: Scene; index: number }> = ({ s, index }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  return (
    <Header>
      {s.id === "s06" && t >= cue(s, "decision")
        ? "Will they collide again?"
        : HEADERS[index]}
    </Header>
  );
};
function useStillAudit(
  enabled: boolean,
  ref: React.RefObject<HTMLDivElement | null>,
): React.ReactNode {
  const frame = useCurrentFrame();
  const [measurement, setMeasurement] = useState("");
  useLayoutEffect(() => {
    if (!enabled || !ref.current) return;
    const root = ref.current;
    const visible = (el: Element) => {
      let n: Element | null = el;
      while (n) {
        const css = getComputedStyle(n);
        if (
          css.display === "none" ||
          css.visibility === "hidden" ||
          Number(css.opacity) < 0.001
        )
          return false;
        n = n.parentElement;
      }
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const regions = Array.from(root.querySelectorAll("[data-region]")).filter(
      visible,
    );
    const cards = Array.from(
      root.querySelectorAll("[data-card],[data-ink-text]"),
    ).filter(visible);
    const texts = Array.from(
      root.querySelectorAll("[data-diagram-text]"),
    ).filter(visible);
    const obstacles = Array.from(
      root.querySelectorAll("[data-arrow],[data-sphere]"),
    ).filter(visible);
    const overlap = (a: Element, b: Element) => {
      const x = a.getBoundingClientRect(),
        y = b.getBoundingClientRect();
      return (
        x.left < y.right + 2 &&
        x.right + 2 > y.left &&
        x.top < y.bottom + 2 &&
        x.bottom + 2 > y.top
      );
    };
    const collisions: Array<{ text: string; other: string }> = [];
    texts.forEach((a, i) =>
      [...texts.slice(i + 1), ...obstacles].forEach((b) => {
        if (overlap(a, b))
          collisions.push({
            text: a.textContent ?? "",
            other: b.textContent || b.getAttribute("data-id") || "arrow",
          });
      }),
    );
    const bounds = root.getBoundingClientRect();
    const overflow = [...regions, ...texts, ...cards].some((el) => {
      const b = el.getBoundingClientRect();
      return (
        b.left < bounds.left - 1 ||
        b.right > bounds.right + 1 ||
        b.top < bounds.top - 1 ||
        b.bottom > bounds.bottom + 1
      );
    });
    const cardTexts = cards.map(
      (el) => el.getAttribute("data-ink-text") ?? el.textContent ?? "",
    );
    setMeasurement(
      JSON.stringify({
        frame,
        regions: regions.length,
        cards: cardTexts,
        maxWords: Math.max(
          0,
          ...cardTexts.map((t) => t.trim().split(/\s+/).length),
        ),
        textCollisions: collisions,
        overflow,
        labels: texts.map((el) => ({
          text: el.textContent,
          bounds: el.getBoundingClientRect().toJSON(),
        })),
        spheres: Array.from(root.querySelectorAll("[data-sphere]"))
          .filter(visible)
          .map((el) => ({
            id: el.getAttribute("data-id"),
            x: Number(el.getAttribute("data-x")),
            velocity: Number(el.getAttribute("data-velocity")),
            radius: Number(el.getAttribute("data-radius")),
          })),
        arrows: Array.from(
          root.querySelectorAll('[data-velocity-arrow="known"]'),
        )
          .filter(visible)
          .map((el) => ({
            speed: Number(el.getAttribute("data-speed")),
            length: (
              el.querySelector("[data-arrow]") as SVGGeometryElement
            ).getTotalLength(),
          })),
        contactFlash: !!root.querySelector("[data-contact-flash]"),
        bounds: regions.map((el) => ({
          region: el.getAttribute("data-region"),
          ...el.getBoundingClientRect().toJSON(),
        })),
      }),
    );
  }, [frame, enabled]);
  return enabled && measurement ? (
    <Artifact
      filename={`verify-collisions-${String(frame).padStart(5, "0")}.json`}
      content={measurement}
    />
  ) : null;
}
export const MechanicsMultipleCollisions: React.FC<
  MechanicsMultipleCollisionsProps
> = ({ audioEnabled = true, audit = false }) => {
  const { fps, width, height } = useVideoConfig();
  const ref = useRef<HTMLDivElement>(null);
  const artifact = useStillAudit(audit, ref);
  return (
    <AbsoluteFill
      ref={ref}
      style={{
        background: T.bg,
        fontFamily: T.sans,
        overflow: "hidden",
        width,
        height,
      }}
    >
      {artifact}
      <TransitionSeries>
        {SCENES.map((s, i) => {
          const Content = CONTENT[i];
          return (
            <React.Fragment key={s.id}>
              {i > 0 && (
                <TransitionSeries.Transition
                  presentation={fadeThroughGraphite}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              )}
              <TransitionSeries.Sequence
                name={HEADERS[i]}
                durationInFrames={
                  Math.ceil(s.duration * fps) +
                  (i < SCENES.length - 1 ? TRANSITION_FRAMES : 0)
                }
              >
                <AbsoluteFill style={{ background: T.bg }}>
                  {i > 0 && <SceneHeading s={s} index={i} />}
                  <Content s={s} />
                  {audioEnabled && (
                    <Audio src={staticFile(`audio/mechanics/${s.audio}`)} />
                  )}
                </AbsoluteFill>
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
