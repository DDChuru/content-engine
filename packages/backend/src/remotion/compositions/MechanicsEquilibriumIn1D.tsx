/** M4.1: source-sized equilibrium lesson, with local word cues and actual silent holds. */
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  Artifact,
  Audio,
  Sequence,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import transcriptJson from "../public/transcripts/mechanics/equilibrium-in-1d.json";
import { InkPlayback, makeInkLine } from "./EquilibriumInk";

const T = {
  bg: "#171c20",
  paper: "#f6f3eb",
  caption: "#b9bcb2",
  ink: "#273238",
  text: "#e9e7e0",
  muted: "#a9afad",
  accent: "#3f9e89",
};
const SCENES = transcriptJson.scenes;
type Scene = (typeof SCENES)[number];
const OUTCOMES = [
  "Find the resultant along a line.",
  "Balance forces to find an unknown.",
  "Explain why equilibrium allows motion.",
];
const HEADERS = [
  "What you will learn",
  "Resultant force along a line",
  "Picture the object first",
  "The whole problem",
  "Balance the forces",
  "Mass is not weight",
  "Equilibrium can move",
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const at = (s: Scene, key: string) => {
  const value = (s.cues as Record<string, number | undefined>)[key];
  if (value === undefined) throw new Error(`Missing cue ${s.id}:${key}`);
  return value;
};
const edge = (s: Scene, key: string) =>
  (s.cueEdges as Record<string, { start: number; end: number } | undefined>)[
    key
  ]!.end;
const frozenTime = (s: Scene, t: number) =>
  s.holds.find((h) => h.kind === "hold" && t >= h.start && t < h.end)?.start ??
  t;
export interface MechanicsEquilibriumIn1DProps {
  audioEnabled?: boolean;
  audit?: boolean;
}
export function getMechanicsEquilibriumIn1DDuration(fps: number): number {
  return SCENES.reduce((n, s) => n + Math.ceil(s.duration * fps), 0);
}

const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  id?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  fill?: string;
}> = ({ x, y, children, id, size = 34, anchor = "middle", fill = T.text }) => (
  <text
    data-diagram-text="true"
    data-figure-id={id}
    x={x}
    y={y}
    fontSize={size}
    textAnchor={anchor}
    fill={fill}
  >
    {children}
  </text>
);
const Arrow: React.FC<{
  x: number;
  y: number;
  dx: number;
  dy: number;
  accent?: boolean;
  thin?: boolean;
}> = ({ x, y, dx, dy, accent = false, thin = false }) => (
  <path
    data-obstacle="arrow"
    d={`M${x} ${y} l${dx} ${dy}`}
    stroke={accent ? T.accent : T.text}
    strokeWidth={thin ? 3 : 6}
    fill="none"
    markerEnd={accent ? "url(#eq-accent)" : "url(#eq-arrow)"}
  />
);
const Parcel: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={76} rx={104} ry={17} fill="#090d10" opacity={0.5} />
    <path
      data-obstacle="object"
      d="M-80 -56 L58 -56 L83 -36 L83 65 L-60 65 L-80 45 Z"
      fill="#707b7a"
      stroke={T.text}
      strokeWidth={3}
    />
    <path
      d="M-80 -56 L-60 -36 L83 -36 M-60 -36 L-60 65 M-10 -56 L10 -36 L10 65 M5 -56 L25 -36 L25 65"
      fill="none"
      stroke="#aeb7b0"
      strokeWidth={3}
    />
    <path d="M-30 -1 L53 -1 L53 32 L-30 32 Z" fill="#c6ccc3" />
  </g>
);
const Caption: React.FC<{
  text: string;
  x?: number;
  y?: number;
  tick?: boolean;
}> = ({ text, x = 1050, y = 470, tick = false }) => {
  const width = Math.min(720, text.length * 18 + 64 + (tick ? 42 : 0));
  return (
    <g data-region="caption" data-caption="true">
      <rect x={x} y={y} width={width} height={94} rx={8} fill={T.caption} />
      <text data-card="true" x={x + 28} y={y + 58} fontSize={32} fill={T.ink}>
        {text}
      </text>
      {tick && (
        <path
          d={`M${x + width - 47} ${y + 47} l12 13 l24 -30`}
          fill="none"
          stroke={T.accent}
          strokeWidth={5}
        />
      )}
    </g>
  );
};

interface InkLine {
  id: string;
  text: string;
  start: number;
  end: number;
  y: number;
  x?: number;
  scale?: number;
}
export function equilibriumLines(s: Scene): InkLine[] {
  if (s.id === "s02")
    return [
      {
        id: "formula",
        text: "R = F(right) - F(left)",
        start: at(s, "formula"),
        end: at(s, "substitute") - 0.1,
        y: 400,
        scale: 2.1,
      },
      {
        id: "answer30",
        text: "50 - 20 = 30 N",
        start: at(s, "substitute"),
        end: s.holds[2].start - 0.12,
        y: 520,
        scale: 2.9,
      },
    ];
  if (s.id === "s05")
    return [
      {
        id: "principle",
        text: "Resultant = 0",
        start: at(s, "principle"),
        end: s.holds[0].end - 0.26,
        y: 295,
        scale: 2.9,
      },
      {
        id: "symbols",
        text: "U - D = 0",
        start: at(s, "symbols"),
        end: edge(s, "symbols") + 0.2,
        y: 385,
        scale: 2.7,
      },
      {
        id: "symbols-equal",
        text: "; U = D",
        start: at(s, "equal"),
        end: edge(s, "equal") + 0.2,
        x: 1350,
        y: 385,
        scale: 2.7,
      },
      {
        id: "equation",
        text: "10 + (18 + x) = 5x",
        start: at(s, "equation"),
        end: s.holds[2].start - 0.1,
        y: 475,
        scale: 2.7,
      },
      {
        id: "collect",
        text: "28 + x = 5x",
        start: at(s, "collect"),
        end: s.holds[3].start - 0.1,
        y: 565,
        scale: 2.9,
      },
      {
        id: "four",
        text: "28 = 4x",
        start: at(s, "four"),
        end: s.holds[4].start - 0.1,
        y: 655,
        scale: 3.0,
      },
      {
        id: "seven",
        text: "x = 7",
        start: at(s, "divide"),
        end: s.holds[5].start - 0.1,
        y: 745,
        scale: 3.1,
      },
      {
        id: "answer0",
        text: "R = 0 N",
        start: at(s, "zero"),
        end: edge(s, "zero") + 0.2,
        y: 835,
        scale: 3.1,
      },
    ];
  if (s.id === "s06")
    return [
      {
        id: "weight-formula",
        text: "W = mg",
        start: at(s, "formula"),
        end: edge(s, "symbols"),
        y: 450,
        scale: 4,
      },
    ];
  return [];
}
const InkLineView: React.FC<{ line: InkLine; t: number; fps: number }> = ({
  line,
  t,
  fps,
}) => {
  const strokes = useMemo(
    () =>
      makeInkLine({
        id: line.id,
        text: line.text,
        x: line.x ?? 1040,
        y: line.y,
        scale: line.scale ?? 2.7,
        startFrame: line.start * fps,
        endFrame: line.end * fps,
      }),
    [line.id, line.text, line.x, line.y, line.scale, line.start, line.end, fps],
  );
  if (t < line.start) return null;
  return (
    <g
      data-ink-line={line.id}
      data-ink-text={line.text}
      data-start={line.start}
      data-finish={line.end}
      data-complete={t >= line.end}
      data-figure-id={line.id}
    >
      <InkPlayback strokes={strokes} frame={t * fps} />
    </g>
  );
};
const Paper: React.FC<{ s: Scene; t: number; fps: number }> = ({
  s,
  t,
  fps,
}) => (
  <g data-region="paper" data-visual="paper">
    <rect x={985} y={220} width={850} height={770} rx={12} fill={T.paper} />
    {Array.from({ length: 8 }, (_, i) => (
      <line
        key={i}
        x1={1020}
        x2={1796}
        y1={354 + i * 90}
        y2={354 + i * 90}
        stroke="#d9dfdb"
        strokeWidth={1.5}
      />
    ))}
    {equilibriumLines(s).map((line) => (
      <InkLineView key={line.id} line={line} t={t} fps={fps} />
    ))}
  </g>
);

const Opening: React.FC<{ s: Scene; t: number }> = ({ s, t }) => {
  const outcome = t >= at(s, "outcomes");
  const index = t >= at(s, "o3") ? 2 : t >= at(s, "o2") ? 1 : 0;
  return (
    <>
      <g data-region="diagram" data-visual="motif">
        <Parcel x={530} y={535} scale={1.1} />
        <Arrow x={400} y={535} dx={-185} dy={0} />
        <Arrow x={650} y={535} dx={185} dy={0} />
      </g>
      {outcome ? (
        <Caption text={OUTCOMES[index]} x={985} y={480} />
      ) : (
        <g data-region="syllabus">
          <rect
            x={970}
            y={365}
            width={850}
            height={265}
            rx={10}
            fill={T.paper}
          />
          <text data-card="true" x={1010} y={418} fontSize={27} fill={T.ink}>
            Syllabus 4.1 · excerpt · p.31
          </text>
          {t < at(s, "quote2") ? (
            <text data-card="true" x={1010} y={490} fontSize={34} fill={T.ink}>
              <tspan x={1010}>“use the principle that, when a</tspan>
              <tspan x={1010} dy={54}>
                particle is in equilibrium,
              </tspan>
            </text>
          ) : (
            <text data-card="true" x={1010} y={490} fontSize={34} fill={T.ink}>
              <tspan x={1010}>the vector sum of the forces</tspan>
              <tspan x={1010} dy={54}>
                acting is zero”
              </tspan>
            </text>
          )}
        </g>
      )}
    </>
  );
};
const Resultant: React.FC<{ s: Scene; t: number; fps: number }> = ({
  s,
  t,
  fps,
}) => {
  const balanced = t >= at(s, "forty"),
    separate = t >= at(s, "separate"),
    zero = t >= at(s, "zero");
  return (
    <>
      <g data-region="diagram" data-visual="force-diagram">
        <Parcel x={500} y={530} />
        <Arrow x={395} y={530} dx={balanced ? -205 : -160} dy={0} />
        <Arrow x={605} y={530} dx={balanced ? 205 : 270} dy={0} />
        <Label id={balanced ? "pair40" : "left"} x={285} y={465}>
          {balanced ? "40 N" : "20 N"}
        </Label>
        <Label id={balanced ? "pair40" : "right"} x={750} y={465}>
          {balanced ? "40 N" : "50 N"}
        </Label>
        {t >= at(s, "positive") && (
          <>
            <Arrow x={290} y={295} dx={150} dy={0} thin />
            <Label x={580} y={305} size={28}>
              Right is positive
            </Label>
          </>
        )}
      </g>
      {!separate ? (
        t >= at(s, "formula") ? (
          <Paper s={s} t={t} fps={fps} />
        ) : (
          <Caption text="Direction matters" />
        )
      ) : (
        <g data-region="resultant" data-visual="resultant-diagram">
          <Label x={1380} y={375} size={34}>
            Separate resultant diagram
          </Label>
          <circle cx={1240} cy={530} r={18} fill={T.text} />
          {!balanced && <Arrow x={1270} y={530} dx={235} dy={0} />}
          <Label id={zero ? "answer0" : "answer30"} x={1405} y={465} size={45}>
            {zero ? "0 N" : balanced ? "Resultant?" : "30 N"}
          </Label>
          <Label x={1400} y={650} size={28}>
            {zero
              ? "Equilibrium"
              : balanced
                ? "Equal opposing forces"
                : "Replaces the pair of forces"}
          </Label>
        </g>
      )}
    </>
  );
};
const Story: React.FC<{ s: Scene; t: number }> = ({ s, t }) => {
  const settle = at(s, "balance");
  const y =
    550 + (t < settle ? Math.sin(t * 2.4) * 14 * (1 - clamp(t / settle)) : 0);
  const tension = clamp((t - at(s, "up")) / 2);
  return (
    <>
      <g data-region="diagram" data-visual="animated-story">
        <path d="M245 282 H1435" stroke="#5e6969" strokeWidth={26} />
        <path
          d={`M680 295 Q${680 - 35 * (1 - tension)} 390 705 ${y - 65} M945 295 Q${945 + 35 * (1 - tension)} 390 895 ${y - 65}`}
          fill="none"
          stroke={T.text}
          strokeWidth={6}
        />
        <Parcel x={800} y={y} scale={1.45} />
        {t >= at(s, "down") && (
          <>
            <path d={`M817 ${y + 95} V820`} stroke={T.text} strokeWidth={6} />
            <Arrow x={817} y={780} dx={0} dy={105} />
          </>
        )}
      </g>
      <Caption
        text={t >= settle ? "The pulls balance" : "Two upward pulls"}
        x={1140}
        y={470}
      />
    </>
  );
};
const ForceDiagram: React.FC<{ s: Scene; t: number; working?: boolean }> = ({
  s,
  t,
  working = false,
}) => {
  const checked = working && t >= at(s, "twentyfive"),
    upTotal = working && t >= at(s, "up35"),
    downTotal = working && t >= at(s, "down35");
  const whatif = working && t >= at(s, "increase");
  const symbols = working && t >= at(s, "symbols");
  return (
    <g data-region="diagram" data-visual="force-diagram" data-all-givens="true">
      <circle
        data-obstacle="particle"
        cx={490}
        cy={590}
        r={35}
        fill="#7c8984"
        stroke={T.text}
        strokeWidth={3}
      />
      <path
        d="M490 590 L325 540 M490 590 L655 540"
        stroke={T.muted}
        strokeWidth={3}
      />
      <Arrow x={325} y={540} dx={0} dy={-175} />
      <Arrow x={655} y={540} dx={0} dy={-175} />
      <Arrow x={490} y={630} dx={0} dy={whatif ? 260 : 165} accent={whatif} />
      <Label id="up10" x={325} y={315}>
        10 N
      </Label>
      <Label id="up18" x={655} y={315} size={checked ? 30 : 34}>
        {checked ? "(18 + x) N = 25 N" : "(18 + x) N"}
      </Label>
      <Label id="down5" x={675} y={730} size={downTotal ? 30 : 34}>
        {whatif ? "Increased pull" : downTotal ? "5x N = 35 N" : "5x N"}
      </Label>
      {symbols && (
        <>
          <Label id="upgroup" x={150} y={443} size={29}>
            U: up
          </Label>
          <Label id="downgroup" x={235} y={718} size={29}>
            D: down
          </Label>
        </>
      )}
      {(working || t >= at(s, "positive")) && (
        <>
          <Arrow x={143} y={340} dx={0} dy={-65} thin />
          <Label x={210} y={260} size={27}>
            Up is positive
          </Label>
        </>
      )}
      {working && t >= at(s, "seven") && (
        <Label x={490} y={950} size={32}>
          x = 7
        </Label>
      )}
      {upTotal && (
        <Label id="uptotal" x={490} y={215} size={30}>
          Upward total: 35 N
        </Label>
      )}
      {downTotal && !whatif && (
        <Label id="downtotal" x={490} y={877} size={30}>
          Downward total: 35 N
        </Label>
      )}
    </g>
  );
};
const Problem: React.FC<{ s: Scene; t: number }> = ({ s, t }) => {
  const phrases = [
    { id: "problem", text: "The object is in equilibrium." },
    { id: "find", text: "Find x." },
    { id: "resultant", text: "Find the resultant force's magnitude." },
  ];
  return (
    <>
      <ForceDiagram s={s} t={t} />
      <g data-region="problem-card">
        <rect x={985} y={375} width={850} height={275} rx={10} fill={T.paper} />
        {phrases.map((p, i) => {
          const start = at(s, p.id),
            end = edge(s, p.id);
          return (
            <g key={p.id}>
              <text
                data-problem-phrase={p.id}
                data-card="true"
                x={1025}
                y={440 + i * 70}
                fontSize={33}
                fill={T.ink}
              >
                {p.text}
              </text>
              {t >= start && t < end + 1.5 && (
                <path
                  data-underline={p.id}
                  d={`M1025 ${452 + i * 70} q160 5 ${Math.min(755, p.text.length * 17)} 0`}
                  fill="none"
                  stroke={T.accent}
                  strokeWidth={3}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={
                    1 - clamp((t - start + 0.03) / Math.max(0.4, end - start))
                  }
                />
              )}
            </g>
          );
        })}
      </g>
    </>
  );
};
const Working: React.FC<{ s: Scene; t: number; fps: number }> = ({
  s,
  t,
  fps,
}) => (
  <>
    <ForceDiagram s={s} t={t} working />
    {t < at(s, "whatif") ? (
      <Paper s={s} t={t} fps={fps} />
    ) : (
      <Caption
        text={
          t >= at(s, "unbalanced")
            ? "The forces no longer balance"
            : "What if the downward pull increased?"
        }
      />
    )}
  </>
);
const Weight: React.FC<{ s: Scene; t: number; fps: number }> = ({
  s,
  t,
  fps,
}) => (
  <>
    <g data-region="diagram" data-visual="weight-diagram">
      <path d="M320 255 H670 M495 255 V442" stroke={T.muted} strokeWidth={5} />
      <Parcel x={490} y={510} />
      <Label id="mass" x={725} y={530}>
        {t >= at(s, "kg") ? "m kg" : "m"}
      </Label>
      <Arrow x={490} y={620} dx={0} dy={200} />
      <Label id="weight" x={690} y={715}>
        {t >= at(s, "down") ? "W  (N)" : "W"}
      </Label>
      <Label id="gravity" x={500} y={935} size={35}>
        {t >= at(s, "g") ? "g = 10 m s⁻²" : "g"}
      </Label>
    </g>
    {t < at(s, "already") ? (
      <Paper s={s} t={t} fps={fps} />
    ) : (
      <Caption text="Already in N? No conversion." />
    )}
  </>
);
const Close: React.FC<{ s: Scene; t: number }> = ({ s, t }) => {
  const answer = t >= at(s, "answer"),
    rest = t >= at(s, "rest"),
    recap = t >= at(s, "o1");
  const moving = (answer && !rest) || recap;
  const x = moving
    ? 260 + (((t - (recap ? at(s, "o1") : at(s, "answer"))) * 43) % 470)
    : 490;
  const index = t >= at(s, "o3") ? 2 : t >= at(s, "o2") ? 1 : 0;
  return (
    <>
      <g data-region="diagram" data-visual="constant-velocity">
        <path d="M150 680 H890" stroke={T.muted} strokeWidth={4} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={i}
            x1={180 + i * 110}
            y1={680}
            x2={155 + i * 110}
            y2={704}
            stroke="#596562"
            strokeWidth={3}
          />
        ))}
        <Parcel x={x} y={552} />
        <rect
          x={x - 102}
          y={631}
          width={208}
          height={12}
          rx={5}
          fill={T.muted}
        />
        {[-65, 65].map((v) => (
          <g key={v}>
            <circle cx={x + v} cy={661} r={18} fill="#9da9a1" />
            <path
              d={`M${x + v - 13 * Math.cos(t * 2)} ${661 - 13 * Math.sin(t * 2)} L${x + v + 13 * Math.cos(t * 2)} ${661 + 13 * Math.sin(t * 2)}`}
              stroke={T.ink}
              strokeWidth={3}
              opacity={moving ? 1 : 0}
            />
          </g>
        ))}
        <Label id="answer0" x={490} y={355} size={42}>
          Resultant: 0 N
        </Label>
        {answer && (
          <Label x={490} y={805} size={32}>
            {moving ? "Constant velocity" : "At rest"}
          </Label>
        )}
      </g>
      {recap ? (
        <Caption text={OUTCOMES[index]} x={985} tick />
      ) : (
        <Caption
          text={
            answer
              ? rest
                ? "At rest stays at rest"
                : "Constant velocity is allowed"
              : "Must it be at rest?"
          }
          x={985}
        />
      )}
    </>
  );
};

// Point to the original diagram again at the actual pen arrival, in addition to
// the word-timed spoken rings. No duplicated or estimated narration cues.
function substitutionEvents(s: Scene) {
  const line = equilibriumLines(s).find(
    (l) => l.id === (s.id === "s05" ? "equation" : "answer30"),
  );
  if (!line || !["s02", "s05"].includes(s.id)) return [];
  const strokes = makeInkLine({
    id: line.id,
    text: line.text,
    x: 1040,
    y: line.y,
    scale: line.scale ?? 2.7,
    startFrame: line.start * 30,
    endFrame: line.end * 30,
  });
  const sources =
    s.id === "s05"
      ? ([
          [0, "up10"],
          [6, "up18"],
          [16, "down5"],
        ] as const)
      : ([
          [0, "right"],
          [5, "left"],
        ] as const);
  return sources.map(([index, target]) => ({
    id: `pen-${target}`,
    target,
    start:
      strokes.find((stroke) => stroke.charIndex === index)!.startFrame / 30,
  }));
}

const FigureRings: React.FC<{ s: Scene; t: number }> = ({ s, t }) => {
  const ref = useRef<SVGGElement>(null);
  const [boxes, setBoxes] = useState<
    Array<{
      id: string;
      target: string;
      x: number;
      y: number;
      w: number;
      h: number;
      start: number;
    }>
  >([]);
  const active = [...s.figures, ...substitutionEvents(s)]
    .filter((e) => t >= e.start && t < e.start + 1.85)
    .filter(
      (event, index, events) =>
        !events.some(
          (other, otherIndex) =>
            other.target === event.target &&
            (other.start > event.start ||
              (other.start === event.start && otherIndex > index)),
        ),
    );
  useLayoutEffect(() => {
    const svg = ref.current?.ownerSVGElement;
    if (!svg) return;
    const viewport = svg.getBoundingClientRect();
    if (!viewport.width) return;
    const scale = 1920 / viewport.width;
    setBoxes(
      active.flatMap((event) =>
        Array.from(
          svg.querySelectorAll(`[data-figure-id="${event.target}"]`),
        ).flatMap((el) => {
          const b = el.getBoundingClientRect();
          if (!b.width || !b.height) return [];
          return [
            {
              id: event.id,
              target: event.target,
              x: (b.left - viewport.left) * scale,
              y: (b.top - viewport.top) * scale,
              w: b.width * scale,
              h: b.height * scale,
              start: event.start,
            },
          ];
        }),
      ),
    );
  }, [t, s.id]);
  return (
    <g ref={ref} data-rings="true">
      {boxes.map((b, i) => {
        const p = clamp((t - b.start + 1 / 30) / 0.4),
          cx = b.x + b.w / 2,
          cy = b.y + b.h / 2,
          rx = b.w * 0.56 + 12,
          ry = b.h * 0.68 + 8;
        const path = Array.from({ length: 81 }, (_, n) => {
          const a = (n / 80) * Math.PI * 2,
            w = 1 + 0.018 * Math.sin(a * 3 + 0.4);
          return `${n ? "L" : "M"}${cx + Math.cos(a) * rx * w} ${cy + Math.sin(a) * ry * w}`;
        }).join(" ");
        return (
          <path
            key={`${b.id}-${i}`}
            data-figure-ring={b.id}
            data-ring-target={b.target}
            data-ring-start={b.start}
            d={path}
            fill="none"
            stroke={T.accent}
            strokeWidth={3.2}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            opacity={1 - clamp((t - b.start - 1.5) / 0.35)}
          />
        );
      })}
    </g>
  );
};

const SceneView: React.FC<{
  s: Scene;
  index: number;
  audioEnabled: boolean;
}> = ({ s, index, audioEnabled }) => {
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = frozenTime(s, frame / fps);
  return (
    <AbsoluteFill data-scene={s.id} style={{ background: T.bg }}>
      {audioEnabled && <Audio src={staticFile(`audio/mechanics/${s.audio}`)} />}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <defs>
          <marker
            id="eq-arrow"
            markerWidth={9}
            markerHeight={9}
            refX={7}
            refY={4}
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 Z" fill={T.text} />
          </marker>
          <marker
            id="eq-accent"
            markerWidth={9}
            markerHeight={9}
            refX={7}
            refY={4}
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 Z" fill={T.accent} />
          </marker>
        </defs>
        <text
          data-region="header"
          x={100}
          y={125}
          fontSize={56}
          fontWeight={600}
          fill={T.text}
        >
          {s.id === "s01" && t >= at(s, "outcomes")
            ? "By the end you can"
            : HEADERS[index]}
        </text>
        {s.id === "s01" && <Opening s={s} t={t} />}
        {s.id === "s02" && <Resultant s={s} t={t} fps={fps} />}
        {s.id === "s03" && <Story s={s} t={t} />}
        {s.id === "s04" && <Problem s={s} t={t} />}
        {s.id === "s05" && <Working s={s} t={t} fps={fps} />}
        {s.id === "s06" && <Weight s={s} t={t} fps={fps} />}
        {s.id === "s07" && <Close s={s} t={t} />}
        <FigureRings s={s} t={t} />
      </svg>
    </AbsoluteFill>
  );
};

function useAudit(
  enabled: boolean,
  ref: React.RefObject<HTMLDivElement | null>,
) {
  const frame = useCurrentFrame();
  const [report, setReport] = useState("");
  const [handle] = useState(() =>
    enabled ? delayRender("Measure equilibrium still") : null,
  );
  useLayoutEffect(() => {
    if (!enabled) return;
    let request = 0;
    const measure = () => {
      const root = ref.current;
      if (!root) return;
      const viewport = root.getBoundingClientRect();
      if (!viewport.width) {
        request = requestAnimationFrame(measure);
        return;
      }
      const scale = 1920 / viewport.width;
      const visible = (el: Element) => {
        const b = el.getBoundingClientRect();
        return (
          b.width > 0 && b.height > 0 && getComputedStyle(el).opacity !== "0"
        );
      };
      const bounds = (el: Element) => {
        const b = el.getBoundingClientRect();
        return {
          x: (b.left - viewport.left) * scale,
          y: (b.top - viewport.top) * scale,
          w: b.width * scale,
          h: b.height * scale,
        };
      };
      const all = (sel: string) =>
        Array.from(root.querySelectorAll(sel)).filter(visible);
      const texts = all("text").map((el) => ({
        text: el.textContent ?? "",
        ...bounds(el),
      }));
      const ink = all("[data-ink-line]").map((el) => ({
        id: el.getAttribute("data-ink-line"),
        text: el.getAttribute("data-ink-text"),
        complete: el.getAttribute("data-complete") === "true",
        finish: Number(el.getAttribute("data-finish")),
        ...bounds(el),
      }));
      const overlap = (
        a: { x: number; y: number; w: number; h: number },
        b: { x: number; y: number; w: number; h: number },
      ) =>
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y;
      const collisions: Array<unknown> = [];
      const obstacles = Array.from(
        root.querySelectorAll("[data-obstacle]"),
      ).map((el) => {
        const b = bounds(el);
        return {
          id: el.getAttribute("data-obstacle"),
          x: b.x - 4,
          y: b.y - 4,
          w: b.w + 8,
          h: b.h + 8,
        };
      });
      texts.forEach((a, i) =>
        texts.slice(i + 1).forEach((b) => {
          if (overlap(a, b)) collisions.push([a.text, b.text]);
        }),
      );
      texts.forEach((a) =>
        obstacles.forEach((b) => {
          if (overlap(a, b)) collisions.push([a.text, b.id]);
        }),
      );
      ink.forEach((a, i) => {
        ink.slice(i + 1).forEach((b) => {
          if (overlap(a, b)) collisions.push([a.id, b.id]);
        });
        texts.forEach((b) => {
          if (overlap(a, b)) collisions.push([a.id, b.text]);
        });
      });
      const overflow = [...texts, ...ink].filter(
        (b) => b.x < 40 || b.y < 30 || b.x + b.w > 1880 || b.y + b.h > 1050,
      );
      const figures = all("[data-figure-id]").map((el) => ({
        id: el.getAttribute("data-figure-id"),
        text: el.textContent || el.getAttribute("data-ink-text"),
        ...bounds(el),
      }));
      const rings = all("[data-figure-ring]").map((el) => ({
        id: el.getAttribute("data-figure-ring"),
        target: el.getAttribute("data-ring-target"),
        ...bounds(el),
      }));
      const data = {
        frame,
        scene: root.querySelector("[data-scene]")?.getAttribute("data-scene"),
        regions: all("[data-region]").length,
        visuals: all("[data-visual]").map((el) => ({
          kind: el.getAttribute("data-visual"),
          ...bounds(el),
        })),
        texts,
        obstacles,
        ink,
        figures,
        rings,
        underlines: all("[data-underline]").map((el) =>
          el.getAttribute("data-underline"),
        ),
        collisions,
        overflow,
        pen: all("[data-pen]").map(bounds),
        cards: all("[data-card]").map((el) => el.textContent),
        lineSchedule: SCENES.flatMap((s) =>
          equilibriumLines(s).map((l) => ({ ...l, scene: s.id })),
        ),
        figureSchedule: SCENES.flatMap((s) =>
          [...s.figures, ...substitutionEvents(s)].map((e) => ({
            ...e,
            scene: s.id,
          })),
        ),
      };
      setReport(JSON.stringify(data));
      if (handle !== null) continueRender(handle);
    };
    // Wait two paints so layout-driven figure rings are included in the artifact.
    request = requestAnimationFrame(() => {
      request = requestAnimationFrame(measure);
    });
    return () => cancelAnimationFrame(request);
  }, [frame, enabled, handle]);
  return enabled && report ? (
    <Artifact filename={`verify-equilibrium-${frame}.json`} content={report} />
  ) : null;
}
export const MechanicsEquilibriumIn1D: React.FC<
  MechanicsEquilibriumIn1DProps
> = ({ audioEnabled = true, audit = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const artifact = useAudit(audit, ref);
  const { fps } = useVideoConfig();
  let start = 0;
  return (
    <AbsoluteFill ref={ref} style={{ background: T.bg }}>
      {SCENES.map((s, index) => {
        const from = start,
          duration = Math.ceil(s.duration * fps);
        start += duration;
        return (
          <Sequence key={s.id} from={from} durationInFrames={duration}>
            <SceneView s={s} index={index} audioEnabled={audioEnabled} />
          </Sequence>
        );
      })}
      {artifact}
    </AbsoluteFill>
  );
};
