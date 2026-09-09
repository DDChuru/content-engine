/** Stroke geometry and pen playback adapted from the approved Multiple Collisions composition. */
import React from "react";
const T = { ink: "#273238", accent: "#3f9e89" };
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const progressBetween = (f: number, a: number, b: number) =>
  clamp((f - a) / Math.max(0.001, b - a));
type Point = readonly [number, number];
type Glyph = Point[][];
const G: Record<string, Glyph> = {
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
  R: [
    [
      [0, 16],
      [0, 0],
      [8, 0],
      [11, 3],
      [10, 7],
      [0, 8],
    ],
    [
      [5, 8],
      [12, 16],
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
  l: [
    [
      [4, 0],
      [4, 14],
      [6, 16],
      [9, 15],
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
  U: [
    [
      [0, 0],
      [0, 12],
      [3, 16],
      [8, 16],
      [11, 12],
      [11, 0],
    ],
  ],
  "-": [
    [
      [0, 9],
      [11, 9],
    ],
  ],
  D: [
    [
      [0, 16],
      [0, 0],
      [6, 0],
      [11, 4],
      [12, 11],
      [8, 16],
      [0, 16],
    ],
  ],
  ";": [
    [
      [4, 5],
      [4, 6],
    ],
    [
      [4, 13],
      [2, 19],
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
  g: [
    [
      [10, 6],
      [6, 4],
      [1, 6],
      [0, 12],
      [4, 15],
      [10, 12],
    ],
    [
      [10, 5],
      [10, 19],
      [7, 23],
      [2, 21],
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
  N: [
    [
      [1, 16],
      [1, 0],
      [11, 16],
      [11, 0],
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
  W: [
    [
      [0, 0],
      [2, 16],
      [7, 6],
      [11, 16],
      [14, 0],
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
};
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
  charIndex: number;
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

export function makeInkLine(options: {
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
  const raw: Array<{ points: Point[]; length: number; charIndex: number }> = [];
  let cursor = x;
  for (const [charIndex, char] of Array.from(text).entries()) {
    if (char === " ") {
      cursor += GLYPH_ADVANCE[" "] * scale;
      continue;
    }
    const glyph = G[char];
    if (!glyph) {
      throw new Error(`Missing handwriting glyph: ${char}`);
    }
    const subscript = ["A", "B", "C"].includes(char);
    for (const segment of glyph) {
      const points = segment.map(
        ([px, py]) =>
          [
            cursor + (px + py * 0.055) * scale * (subscript ? 0.65 : 1),
            y +
              (subscript ? 11 * scale : 0) +
              py * scale * (subscript ? 0.65 : 1),
          ] as Point,
      );
      raw.push({ points, length: pointsLength(points), charIndex });
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
      charIndex: stroke.charIndex,
      color,
      width,
    };
    nextFrame += durationFrames + gap;
    return result;
  });
}

export const InkPlayback: React.FC<{
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
    <g data-ink-paths="true">
      {paths}
      {showHand && penPoint && (
        <g
          data-pen="true"
          transform={`translate(${penPoint[0]} ${penPoint[1]}) rotate(-24)`}
        >
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
