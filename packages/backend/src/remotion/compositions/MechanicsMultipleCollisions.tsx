/** Multiple collisions: a moving three-sphere story and two separate momentum calculations. */
import React, { useLayoutEffect, useMemo, useState, useRef } from "react";
import {
  AbsoluteFill,
  Artifact,
  delayRender,
  continueRender,
  Audio,
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
  caption: "#b9bcb2",
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
  "The whole problem",
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

interface FigureCue { id: string; target: string; start: number; end?: number; kind: "spoken" | "substitution"; wordIndex?: number }
const FigureContext = React.createContext<Scene | null>(null);
// Semantic references into the unchanged local Whisper word list, not new audio cues.
const FIGURE_WORDS: Record<string, Record<number, string>> = {
  s07: {2:"A.mass",6:"A.before",14:"B.mass",18:"B.before",33:"C.mass",38:"C.before",49:"A.after",60:"C.after"},
  s04: {17:"A.mass",19:"A.before",24:"B.mass",26:"B.before",34:"A.after",99:"A.mass",102:"A.before",105:"B.mass",108:"B.before",111:"A.mass",114:"A.after",117:"B.mass",124:"A.after",126:"B.mass",130:"A.after",134:"B.mass",138:"B.after",147:"B.after",152:"B.before"},
  s06: {19:"B.mass",22:"B.before",27:"C.mass",29:"C.before",37:"C.after",45:"B.after",47:"B.before",112:"B.mass",115:"B.before",118:"C.mass",121:"C.before",124:"B.mass",131:"C.mass",134:"C.after",137:"B.mass",147:"B.mass",151:"B.after",168:"A.before",174:"B.before",175:"A.before",179:"B.before"},
};
const cleanWord = (word: string) => word.toLowerCase().replace(/[^a-z0-9]/g, "");
export function spokenFigureCues(s: Scene): FigureCue[] {
  if (!FIGURE_WORDS[s.id]) return [];
  return s.words.flatMap((word, index) => {
    const label = cleanWord(word.word).match(/^([abc])s?$/)?.[1]?.toUpperCase();
    const previous = cleanWord(s.words[index - 1]?.word ?? "");
    const role = previous === "mass" ? "mass" : previous === "u" ? "before" : ["v", "w", "value"].includes(previous) ? "after" : "label";
    const target = FIGURE_WORDS[s.id][index] ?? (label ? `${label}.${role}` : undefined);
    return target ? [{id:`${s.id}:word-${index}`, target, start:word.start, kind:"spoken" as const, wordIndex:index}] : [];
  });
}
const FigureRings: React.FC = () => {
  const s = React.useContext(FigureContext);
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const rawTime=frame/fps;
  const t = s ? heldTime(s, rawTime) : 0;
  const hold=s?.holds.find(h=>h.kind==="hold"&&rawTime>=h.start&&rawTime<h.end);
  // Whisper's first "A" in the final decision starts 0.13 s inside its existing
  // question hold. Keep the diagram frozen, but honour that spoken ring onset.
  const eventTime=(event:FigureCue)=>hold&&event.kind==="spoken"&&event.start>=hold.start&&event.start<hold.end?rawTime:t;
  const ref = useRef<SVGGElement>(null);
  const [boxes, setBoxes] = useState<Record<string, {x:number;y:number;width:number;height:number}>>({});
  const events = useMemo(() => s ? [...spokenFigureCues(s), ...substitutionFigureCues(s, fps)] : [], [s, fps]);
  const active = events.filter(event => eventTime(event) >= event.start && eventTime(event) < (event.end ?? event.start + 1.9) + .25);
  useLayoutEffect(() => {
    const svg = ref.current?.ownerSVGElement;
    if (!svg) return;
    const next: typeof boxes = {};
    svg.querySelectorAll<SVGGraphicsElement>("[data-figure-id]").forEach(el => {
      const b = el.getBBox();
      next[el.getAttribute("data-figure-id")!] = {x:b.x,y:b.y,width:b.width,height:b.height};
    });
    setBoxes(next);
  }, [t]);
  return <g ref={ref} data-figure-layer="true">
    {active.map(event => {
      // Repeated references retrace one ellipse, never stack identical rings.
      if (active.some(other => other.target === event.target && other.start > event.start)) return null;
      const box = boxes[event.target];
      if (!box) return null;
      const x=box.x+box.width/2, y=box.y+box.height/2;
      const rx=box.width*.85+14, ry=box.height*.57+2;
      const points=Array.from({length:81},(_,i)=>{
        const angle=i/80*Math.PI*2;
        const wobble=1+.022*Math.sin(angle*3+.7);
        return [x+rx*Math.cos(angle)*wobble,y+ry*Math.sin(angle)*wobble];
      });
      const progress=Math.min(1,Math.max(.06,(eventTime(event)-event.start+1/fps)/.4));
      const opacity=1-clamp((eventTime(event)-(event.end ?? event.start+1.9))/.25);
      return <path key={event.id} data-figure-ring={event.id} data-ring-target={event.target} data-ring-kind={event.kind}
        data-ring-start={event.start} data-ring-progress={progress} data-ring-word={event.wordIndex}
        d={points.map(([px,py],i)=>`${i?"L":"M"}${px} ${py}`).join(" ")}
        fill="none" stroke={T.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1-progress} opacity={opacity}/>;
    })}
  </g>;
};

// Cut the visuals at the midpoint of the existing overlap, keeping a diagram
// visible on every frame. Sequence lengths and audio timing stay unchanged.
type FadeProps = { background: string };
const FadeThrough: React.FC<
  TransitionPresentationComponentProps<FadeProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const opacity =
    presentationDirection === "exiting"
      ? Number(presentationProgress < 0.5)
      : Number(presentationProgress >= 0.5);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
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
  syllabus?: boolean;
  tick?: boolean;
}> = ({ text, syllabus = false, tick = false }) => (
  <div
    data-region="card"
    data-card="true"
    data-caption={syllabus ? undefined : "true"}
    style={{
      position: "absolute",
      left: 1120,
      top: 480,
      width: "max-content",
      maxWidth: 740,
      padding: "22px 26px",
      boxSizing: "border-box",
      background: T.caption,
      color: T.ink,
      fontSize: 34,
      lineHeight: 1.35,
      borderRadius: 8,
    }}
  >
    {text}
    {tick && (
      <svg
        aria-hidden="true"
        width="35"
        height="30"
        viewBox="0 0 70 60"
        style={{ display: "block", marginTop: 12 }}
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
  M: [
    [
      [0, 16],
      [0, 0],
      [6, 8],
      [12, 0],
      [12, 16],
    ],
  ],
  A: [
    [
      [0, 16],
      [6, 0],
      [12, 16],
    ],
    [
      [3, 10],
      [9, 10],
    ],
  ],
  C: [
    [
      [12, 2],
      [8, 0],
      [3, 1],
      [0, 6],
      [0, 12],
      [4, 16],
      [9, 16],
      [12, 13],
    ],
  ],
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

const COLLISION_EQUATIONS = {s04:"1×4 + 2×3 = 1×2 + 2vB",s06:"2×4 + 3×1 = 2wB + 3×3"};
export function substitutionFigureCues(s: Scene, fps: number): FigureCue[] {
  if (s.id !== "s04" && s.id !== "s06") return [];
  const text=COLLISION_EQUATIONS[s.id];
  const width=Array.from(text).reduce((n,c)=>n+(GLYPH_ADVANCE[c]??14),0);
  const end=s.holds.find(h=>h.kind==="hold"&&h.duration===2)!.start-.1;
  // Exactly the same glyph geometry, scale, gaps and timing as Paper's equation.
  const strokes=makeInkLine({id:"equation",text,x:65,y:310,scale:Math.min(2.8,655/width),startFrame:cue(s,"equation")*fps,endFrame:end*fps});
  const sources=s.id==="s04" ? [["A.mass","A.before"],["B.mass","B.before"],["A.mass","A.after"],["B.mass","B.after"]] : [["B.mass","B.before"],["C.mass","C.before"],["B.mass","B.after"],["C.mass","C.after"]];
  return [...text.matchAll(/[1-4]×[1-4]|[1-4][vw]B/g)].flatMap((match,index)=>{
    const term=strokes.filter(stroke=>stroke.charIndex>=match.index!&&stroke.charIndex<match.index!+match[0].length);
    const start=term[0].startFrame/fps;
    const finish=term.at(-1)!;
    return sources[index].map(target=>({id:`${s.id}:sub-${index}-${target}`,target,start,end:(finish.startFrame+finish.durationFrames)/fps,kind:"substitution" as const}));
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
  maxScale?: number;
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
        const scale = Math.min(line.maxScale ?? 2.8, 655 / width);
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
            data-ink-line={line.id}
            data-ink-start={line.start}
            data-ink-end={line.end}
            data-ink-complete={t >= line.end}
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
  velocityLabel?: "v" | "w";
  showVelocity?: boolean;
  showMass?: boolean;
  accent?: boolean;
  givens?: boolean;
  afterV?: number;
  afterUnknown?: "v" | "w";
  afterCaption?: string;
}
const Sphere: React.FC<{
  ball: BallState;
  index: number;
  y?: number;
  numeric?: boolean;
}> = ({ ball, index, y = 390 - (ball.radius ?? 36), numeric = true }) => {
  const arrowY = ball.givens ? 230 : y - 120 - index * 85;
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
        data-figure-id={`${ball.id}.label`}
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
          y={y + 150}
          data-figure-id={`${ball.id}.mass`}
          data-given-id={ball.givens ? `${ball.id}.mass` : undefined}
          data-given-value={ball.mass}
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
          {(numeric || ball.velocityLabel) && (
            <text
              data-diagram-text="true"
              x={(start + end) / 2}
              y={arrowY - 22}
              data-figure-id={`${ball.id}.before`}
              data-given-id={ball.givens ? `${ball.id}.before` : undefined}
              data-given-value={ball.v}
              textAnchor="middle"
              fill={T.text}
              fontSize={30}
            >
              {ball.unknown || ball.velocityLabel ? (
                <Subscript
                  letter={(ball.unknown ?? ball.velocityLabel)!}
                  sub="B"
                />
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
      {ball.afterV !== undefined && <AfterVelocity ball={ball} />}
    </g>
  );
};
const AfterVelocity: React.FC<{ ball: BallState }> = ({ ball }) => {
  const length = ball.afterUnknown ? 90 : Math.abs(ball.afterV!) * 35;
  const end = ball.x + length;
  return (
    <g>
      {ball.afterCaption && (
        <text
          data-diagram-text="true"
          x={ball.x}
          y={550}
          textAnchor="middle"
          fill={T.muted}
          fontSize={24}
        >
          {ball.afterCaption}
        </text>
      )}
      <g
        data-velocity-arrow={ball.afterUnknown ? "unknown" : "known"}
        data-speed={ball.afterV}
        data-length={length}
      >
        <path
          data-arrow="true"
          d={`M${ball.x} 630 H${end}`}
          fill="none"
          stroke={T.accent}
          strokeWidth={4}
          strokeDasharray={ball.afterUnknown ? "9 7" : undefined}
        />
        <path
          data-arrow="true"
          d={`M${end - 12} 622 L${end} 630 L${end - 12} 638`}
          fill="none"
          stroke={T.accent}
          strokeWidth={4}
        />
        <text
          data-diagram-text="true"
          data-figure-id={`${ball.id}.after`}
          data-given-id={ball.afterUnknown ? undefined : `${ball.id}.after`}
          data-given-value={ball.afterV}
          data-unknown={
            ball.afterUnknown ? `${ball.afterUnknown}${ball.id}` : undefined
          }
          x={(ball.x + end) / 2}
          y={608}
          textAnchor="middle"
          fill={T.text}
          fontSize={30}
        >
          {ball.afterUnknown ? (
            <Subscript letter={ball.afterUnknown} sub={ball.id} />
          ) : (
            `+${ball.afterV} m s⁻¹`
          )}
        </text>
      </g>
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
    <FigureRings />
  </svg>
);
const SpheresMotif: React.FC = () => (
  <svg
    data-region="diagram"
    width="600"
    height="260"
    viewBox="0 0 600 260"
    style={{ position: "absolute", left: 240, top: 410 }}
  >
    <path d="M35 160 H565 M35 174 H565" stroke={T.muted} strokeWidth={2} />
    {[130, 300, 470].map((x, i) => (
      <Sphere
        key={i}
        ball={{ id: ["A", "B", "C"][i], x, v: 0 }}
        index={i}
        y={124}
      />
    ))}
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
      <SpheresMotif />
      {state === "quote1" && (
        <Card
          syllabus
          text="use conservation of linear momentum to solve problems"
        />
      )}
      {state === "quote2" && (
        <Card
          syllabus
          text="that may be modelled as the direct impact of two bodies."
        />
      )}
      {i >= 0 && <Card text={OUTCOMES[i]} />}
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
  const wall = t < cue(s, "third");
  const change = clamp((t - cue(s, "separate")) / 0.6);
  const named = t >= cue(s, "unique");
  const balls: BallState[] = wall
    ? [
        {
          id: "B",
          x:
            280 +
            350 *
              clamp((t - cue(s, "wall")) / (cue(s, "third") - cue(s, "wall"))),
          v: 3,
          showVelocity: true,
          accent: true,
        },
      ]
    : [
        { id: "A", x: 170, v: 4 - 2 * change, showVelocity: true },
        {
          id: "B",
          x: 440,
          v: 3 + change,
          showVelocity: true,
          accent: true,
          velocityLabel: named ? "v" : undefined,
        },
        { id: "C", x: 700, v: 1, showVelocity: true },
      ];
  return (
    <>
      <Track numeric={false} balls={balls}>
        {wall && (
          <path
            d="M740 150 V390 M740 150 l35 -20 M740 200 l35 -20 M740 250 l35 -20 M740 300 l35 -20 M740 350 l35 -20"
            stroke={T.text}
            strokeWidth={5}
          />
        )}
        {named && (
          <g>
            <path
              data-arrow="true"
              d="M440 285 H475 M463 277 L475 285 L463 293"
              stroke={T.accent}
              strokeWidth={4}
              fill="none"
            />
            <text
              data-diagram-text="true"
              x={457}
              y={250}
              textAnchor="middle"
              fill={T.text}
              fontSize={30}
            >
              <Subscript letter="w" sub="B" />
            </text>
          </g>
        )}
      </Track>
      {cards[state] && <Card text={cards[state]} />}
    </>
  );
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
const PROBLEM_PHRASES: Array<Array<[string,number,number]>> = [
  [["Spheres ",0,0],["A (1 kg), ",1,3],["B (2 kg), ",13,15],["C (3 kg): ",32,34],["4, ",6,9],["3, ",18,18],["1 m s⁻¹ →; ",38,41],["A–B–C.",19,20]],
  [["After A hits B: ",42,45],["A = 2 m s⁻¹. ",46,52],["After B hits C: ",53,56],["C = 3 m s⁻¹.",57,60]],
  [["Will A and B collide again?",61,66]],
];
const ProblemPhrase: React.FC<{s:Scene;text:string;first:number;last:number}> = ({s,text,first,last}) => {
  const {fps}=useVideoConfig();
  const t=heldTime(s,useCurrentFrame()/fps);
  const start=s.words[first].start,end=s.words[last].end;
  const active=t>=start&&t<end+.4;
  return <span data-problem-phrase={`${s.id}:phrase-${first}`} data-phrase-start={start} data-phrase-end={end} style={{position:"relative",display:"inline-block",whiteSpace:"pre"}}>
    {text}
    {active&&<svg data-problem-underline={`${s.id}:phrase-${first}`} width="100%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" style={{position:"absolute",left:0,bottom:6,overflow:"visible",opacity:1-clamp((t-end-.15)/.25)}}>
      <path d="M1 4 Q32 2 54 4 T99 3" fill="none" stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-Math.max(.06,clamp((t-start+1/fps)/Math.max(.4,end-start)))} />
    </svg>}
  </span>;
};
const ProblemSetup: React.FC<{ s: Scene }> = ({s}) => (
  <>
    <Track
      positive
      label="Initially: A–B–C, moving right"
      balls={[
        {
          id: "A",
          x: 160,
          v: 4,
          mass: 1,
          givens: true,
          showMass: true,
          showVelocity: true,
          afterV: 2,
          afterCaption: "After A–B",
        },
        {
          id: "B",
          x: 410,
          v: 3,
          mass: 2,
          givens: true,
          showMass: true,
          showVelocity: true,
        },
        {
          id: "C",
          x: 660,
          v: 1,
          mass: 3,
          givens: true,
          showMass: true,
          showVelocity: true,
          afterV: 3,
          afterCaption: "After B–C",
        },
      ]}
    />
    <div
      data-region="problem"
      style={{
        position: "absolute",
        left: 1070,
        top: 380,
        width: 810,
        boxSizing: "border-box",
        padding: "28px 22px",
        background: T.caption,
        color: T.ink,
        fontSize: 24,
        lineHeight: 2.2,
        borderRadius: 4,
      }}
    >
      {PROBLEM_PHRASES.map((phrases,index) => (
        <div key={index} data-problem-line="true" style={{whiteSpace:"nowrap"}}>
          {phrases.map(([text,first,last])=><ProblemPhrase key={first} s={s} text={text} first={first} last={last}/>)}
        </div>
      ))}
    </div>
  </>
);
function collisionBalls(s: Scene, t: number, which: 1 | 2): BallState[] {
  const solved = t >= cue(s, "result");
  return which === 1
    ? [
        {
          id: "A",
          x: 220,
          v: 4,
          mass: 1,
          showMass: true,
          showVelocity: true,
          givens: true,
          afterV: 2,
        },
        {
          id: "B",
          x: 590,
          v: 3,
          mass: 2,
          showMass: true,
          showVelocity: true,
          givens: true,
          afterV: solved ? 4 : 1,
          afterUnknown: solved ? undefined : "v",
          accent: true,
        },
      ]
    : [
        {
          id: "B",
          x: 220,
          v: 4,
          mass: 2,
          showMass: true,
          showVelocity: true,
          givens: true,
          afterV: 1,
          afterUnknown: solved ? undefined : "w",
          accent: true,
        },
        {
          id: "C",
          x: 590,
          v: 1,
          mass: 3,
          showMass: true,
          showVelocity: true,
          givens: true,
          afterV: 3,
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
      ? [COLLISION_EQUATIONS.s04, "10 = 2 + 2vB", "vB = 4 m s"]
      : [COLLISION_EQUATIONS.s06, "11 = 2wB + 9", "wB = 1 m s"];
  const formulaLines: Line[] = [
    {
      id: "principle",
      text: "Momentum before = momentum after",
      start: cue(s, "principle"),
      end: cue(s, "principle-end"),
      y: 55,
    },
    {
      id: "formula",
      text:
        which === 1
          ? "mA uA + mB uB = mA vA + mB vB"
          : "mB uB + mC uC = mB vB + mC vC",
      start: cue(s, "formula"),
      end: cue(s, "formula-end"),
      y: 155,
    },
    ...(which === 2
      ? [
          {
            id: "notation",
            text: "vB = wB",
            start: cue(s, "notation"),
            end: cue(s, "notation-end"),
            y: 230,
            maxScale: 1.9,
          },
        ]
      : []),
  ];
  const lines: Line[] = [
    ...formulaLines.filter((line) => t >= line.start),
    ...texts.slice(0, active + 1).map((text, i) => ({
      id: stages[i],
      text,
      start: cue(s, stages[i]),
      end: results[i].start - 0.1,
      y: 310 + i * 105,
      ...(i === 2 ? { resultAt: cue(s, "result"), exponent: "-1" } : {}),
    })),
  ];
  const ring =
    active >= 0 && t >= results[active].start && t < results[active].end
      ? formulaLines.length + active
      : -1;
  return (
    <>
      <Track
        balls={collisionBalls(s, t, which)}
        positive
        label={`Before collision ${which}`}
      >
        <text
          data-diagram-text="true"
          x={450}
          y={550}
          textAnchor="middle"
          fill={T.muted}
          fontSize={32}
        >
          After collision {which}
        </text>
      </Track>
      {which === 2 && t >= cue(s, "decision") ? null : t >=
        cue(s, "principle") ? (
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
    return (
      <>
        <CollisionWorking s={s} which={1} t={t} />
        {t >= cue(s, "signpost") && <Card text="Now collision 1" />}
      </>
    );
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
  const left =
    state === "question" ||
    ["answer", "negative", "signed"].includes(state) ||
    outcome >= 0;
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
      <Track
        balls={outcome >= 0 ? [...balls, { id: "C", x: 760, v: 0 }] : balls}
        numeric={false}
      />
      {state && (
        <Card
          tick={
            outcome >= 0 &&
            t >= cue(s, `tick-${["diagram", "carry", "decide"][outcome]}`)
          }
          text={
            outcome >= 0 ? (
              OUTCOMES[outcome]
            ) : state === "question" ? (
              "Both moving left: can they collide?"
            ) : state === "signed" ? (
              <>
                v<sub>A</sub> &gt; w<sub>B</sub>: the gap closes
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
      )}
    </>
  );
};
const LastCollision: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  if (t < signpostEnd(s, "signpost"))
    return (
      <>
        <CollisionWorking s={s} which={2} t={t} />
        {t >= cue(s, "signpost") && <Card text="Now collision 2" />}
      </>
    );
  if (t < cue(s, "decision")) return <CollisionWorking s={s} which={2} t={t} />;
  if (t < signpostEnd(s, "decision"))
    return (
      <>
        <Track balls={[{id:"A",x:220,v:2,accent:true},{id:"B",x:430,v:1}]} />
        <Card text="Now: will they collide again?" />
      </>
    );
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
  ProblemSetup,
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
  const [auditHandle]=useState(()=>enabled?delayRender("Measure collision annotations after layout"):null);
  useLayoutEffect(() => {
    let request=0;
    const measure=()=>{
    if (!enabled || !ref.current) return;
    const root = ref.current;
    if(root.getBoundingClientRect().width===0){request=requestAnimationFrame(measure);return;}
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
    const inkLines = Array.from(
      root.querySelectorAll("[data-ink-line]"),
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
    inkLines.forEach((a, i) =>
      inkLines.slice(i + 1).forEach((b) => {
        if (overlap(a, b))
          collisions.push({
            text: a.getAttribute("data-ink-line")!,
            other: b.getAttribute("data-ink-line")!,
          });
      }),
    );
    const figureRings=Array.from(root.querySelectorAll<SVGPathElement>("[data-figure-ring]")).filter(visible);
    const allPrinted=Array.from(root.querySelectorAll("svg text,[data-problem-phrase],[data-region=header],[data-caption]")).filter(visible);
    const ringChecks=figureRings.map(ring=>{
      const targetId=ring.getAttribute("data-ring-target")!;
      const target=ring.ownerSVGElement?.querySelector(`[data-figure-id="${targetId}"]`);
      const r=ring.getBoundingClientRect(),b=target?.getBoundingClientRect();
      const otherText=allPrinted.filter(text=>text!==target&&!target?.contains(text)&&!text.contains(target??ring)).filter(text=>overlap(ring,text)).map(text=>text.textContent??"");
      otherText.forEach(text=>collisions.push({text:`ring:${targetId}`,other:text}));
      return {id:ring.getAttribute("data-figure-ring"),target:targetId,kind:ring.getAttribute("data-ring-kind"),start:Number(ring.getAttribute("data-ring-start")),progress:Number(ring.getAttribute("data-ring-progress")),bounds:r.toJSON(),targetBounds:b?.toJSON(),targetText:target?.textContent,
        encloses:!!b&&r.left<b.left&&r.right>b.right&&r.top<b.top&&r.bottom>b.bottom,otherText};
    });
    const bounds = root.getBoundingClientRect();
    const overflow = [
      ...regions,
      ...figureRings,
      ...texts,
      ...cards,
      ...Array.from(root.querySelectorAll("[data-problem-line]")).filter(
        visible,
      ),
    ].some((el) => {
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
    const captions = Array.from(root.querySelectorAll("[data-caption]")).filter(
      visible,
    );
    const visuals = regions.filter((el) =>
      ["diagram", "paper"].includes(el.getAttribute("data-region") ?? ""),
    );
    regions.forEach((a, i) =>
      regions.slice(i + 1).forEach((b) => {
        if (overlap(a, b))
          collisions.push({
            text: a.getAttribute("data-region")!,
            other: b.getAttribute("data-region")!,
          });
      }),
    );
    setMeasurement(
      JSON.stringify({
        frame,
        figureRings:ringChecks,
        figureSchedule:frame===0?SCENES.flatMap(s=>[...spokenFigureCues(s),...substitutionFigureCues(s,30)].map(event=>({...event,scene:s.id,word:event.wordIndex===undefined?undefined:s.words[event.wordIndex].word}))):undefined,
        underlines:Array.from(root.querySelectorAll("[data-problem-underline]")).filter(visible).map(el=>el.getAttribute("data-problem-underline")),
        phraseSchedule:frame===0?PROBLEM_PHRASES.flatMap(line=>line.map(([,first,last])=>({id:`s07:phrase-${first}`,start:SCENES.find(s=>s.id==="s07")!.words[first].start,end:SCENES.find(s=>s.id==="s07")!.words[last].end}))):undefined,
        rootBounds: bounds.toJSON(),
        regions: regions.length,
        visualCount: visuals.length,
        textOnly: visuals.length === 0,
        maxCaptionWords: Math.max(
          0,
          ...captions.map(
            (el) => (el.textContent ?? "").trim().split(/\s+/).length,
          ),
        ),
        maxCaptionWidthRatio: Math.max(
          0,
          ...captions.map(
            (el) => el.getBoundingClientRect().width / bounds.width,
          ),
        ),
        cards: cardTexts,
        givens: Array.from(root.querySelectorAll("[data-given-id]"))
          .filter(visible)
          .map((el) => ({
            id: el.getAttribute("data-given-id"),
            value: Number(el.getAttribute("data-given-value")),
            text: el.textContent,
            bounds: el.getBoundingClientRect().toJSON(),
          })),
        unknowns: Array.from(root.querySelectorAll("[data-unknown]"))
          .filter(visible)
          .map((el) => el.getAttribute("data-unknown")),
        problemLines: Array.from(root.querySelectorAll("[data-problem-line]"))
          .filter(visible)
          .map((el) => ({
            text: el.textContent,
            fits: el.scrollWidth <= el.clientWidth,
            bounds: el.getBoundingClientRect().toJSON(),
          })),
        inkLines: inkLines.map((el) => ({
          id: el.getAttribute("data-ink-line"),
          text: el.getAttribute("data-ink-text"),
          start: Number(el.getAttribute("data-ink-start")),
          end: Number(el.getAttribute("data-ink-end")),
          complete: el.getAttribute("data-ink-complete") === "true",
          bounds: el.getBoundingClientRect().toJSON(),
        })),
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
    if(auditHandle!==null)continueRender(auditHandle);
    };
    request=requestAnimationFrame(()=>{request=requestAnimationFrame(measure);});
    return ()=>cancelAnimationFrame(request);
  }, [frame, enabled, auditHandle]);
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
                  <FigureContext.Provider value={s}><Content s={s} /></FigureContext.Provider>
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
