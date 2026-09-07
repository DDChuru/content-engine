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
  focus: { target: string; phrase: string; start: number; end: number }[];
}
const SCENES = transcriptJson.scenes as unknown as Scene[];
const OUTCOMES = [
  'Explain what modelling words let you ignore.',
  'List assumptions for a real situation and say why.',
  'Match modelling words to a described setup.',
];
const HEADERS = [
  'What you will learn',
  'How a model is made',
  'Model a falling stone',
  'What the modelling words mean',
  'Match words to the situation',
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

// Retain the overlap timing while switching between two complete diagrams.
// Audio runs outside the visual tail overlap.
type FadeProps = { background: string };
const FadeThrough: React.FC<TransitionPresentationComponentProps<FadeProps>> = ({
  children,
  passedProps,
  presentationDirection,
  presentationProgress,
}) => {
  // Replace the diagram at the midpoint without an empty graphite frame (§10).
  const opacity = presentationDirection === 'exiting'
    ? Number(presentationProgress < 0.5) : Number(presentationProgress >= 0.5);
  // An opaque outer wrapper would cover the outgoing diagram even while its
  // nested entering presentation is transparent (middle scenes have both).
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
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
const Card: React.FC<{ text: string; centre?: boolean; tick?: boolean; start?: number; t?: number }> = ({
  text,
  centre = false,
  tick = false,
  start = Infinity,
  t = 0,
}) => (
  <div
    data-region="card"
    data-card={centre ? 'outcome' : 'true'}
    style={{
      position: 'absolute',
      left: 1050,
      top: centre ? 400 : 370,
      width: 'max-content',
      maxWidth: 740,
      padding: '22px 28px',
      boxSizing: 'border-box',
      background: '#d9d9d0',
      color: T.ink,
      fontSize: centre ? 43 : 40,
      lineHeight: 1.35,
      borderRadius: 8,
    }}
  >
    <span style={{ backgroundImage: `linear-gradient(${T.accent}, ${T.accent})`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'left bottom',
      backgroundSize: `${clamp((t - start) / 1.2) * 100}% 3px` }}>{text}</span>
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

const SpokenRing: React.FC<{
  s: Scene; t: number; target: string; x: number; y: number; rx?: number; ry?: number;
}> = ({ s, t, target, x, y, rx = 65, ry = 42 }) => {
  const event = s.focus.filter((e) => e.target === target && t >= e.start).at(-1);
  if (!event || t > Math.max(event.end, event.start + 1.15) + 0.4) return null;
  const progress = clamp((t - event.start + 1 / 30) / 0.4);
  const opacity = interpolate(t, [Math.max(event.end, event.start + 1.15),
    Math.max(event.end, event.start + 1.15) + 0.4], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <path data-ring={target} data-ring-start={event.start}
    d={`M${x - rx} ${y + 3} C${x - rx - 8} ${y - ry},${x + rx - 5} ${y - ry - 8},${x + rx} ${y - 3}
      C${x + rx + 9} ${y + ry},${x - rx + 4} ${y + ry + 8},${x - rx} ${y + 3}`}
    fill="none" stroke={T.accent} strokeWidth="4" strokeLinecap="round"
    pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} opacity={opacity} />;
};

const PhraseUnderline: React.FC<{ s: Scene; t: number; target: string; x: number; y: number; width: number }> =
  ({ s, t, target, x, y, width }) => {
    const event = s.focus.filter((e) => e.target === target && t >= e.start).at(-1);
    if (!event || t > event.end + 1.5) return null;
    return <path data-underline={target} d={`M${x} ${y} Q${x + width / 2} ${y + 3} ${x + width} ${y - 1}`}
      fill="none" stroke={T.accent} strokeWidth="3" strokeLinecap="round" pathLength="1"
      strokeDasharray="1" strokeDashoffset={1 - clamp((t - event.start + 1 / 30) / Math.max(0.4, event.end - event.start))} />;
  };

const SpokenPhrase: React.FC<{ s: Scene; t: number; target: string; children: React.ReactNode }> =
  ({ s, t, target, children }) => {
    const event = s.focus.filter((e) => e.target === target && t >= e.start).at(-1);
    const progress = event && t <= event.end + 1.5
      ? clamp((t - event.start + 1 / 30) / Math.max(0.4, event.end - event.start)) : 0;
    return <span style={{ backgroundImage: `linear-gradient(${T.accent}, ${T.accent})`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'left bottom',
      backgroundSize: `${progress * 100}% 3px` }}>{children}</span>;
  };

interface SystemProps {
  sphere?: boolean;
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
  sphere,
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
              : extensible
                ? `M${bx + 115} 320 ${Array.from({ length: 9 }, (_, i) => `L${355 + i * 29} ${i % 2 ? 307 : 333}`).join(' ')} L620 320 A45 45 0 0 1 665 365 V${hy}`
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
      {show('hanging') &&
        (sphere ? (
          <circle
            cx="665"
            cy={particle ? hy : hy + 52}
            r={particle ? 12 : 52}
            fill={particle ? T.text : T.bg}
          />
        ) : (
          <rect x="613" y={hy} width="104" height="110" rx="5" fill={T.bg} />
        ))}
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

const SystemFocus: React.FC<{ s: Scene; t: number; particle?: boolean }> = ({ s, t, particle }) => <>
  <SpokenRing s={s} t={t} target="box" x={278} y={320} rx={77} ry={68} />
  <SpokenRing s={s} t={t} target="body" x={278} y={320} rx={particle ? 32 : 77} ry={particle ? 32 : 68} />
  <SpokenRing s={s} t={t} target="sphere" x={665} y={522} rx={68} ry={68} />
  <SpokenRing s={s} t={t} target="body" x={665} y={particle ? 470 : 522} rx={particle ? 32 : 68} ry={particle ? 32 : 68} />
  <SpokenRing s={s} t={t} target="surface" x={320} y={374} rx={240} ry={27} />
  <SpokenRing s={s} t={t} target="pulley" x={620} y={365} rx={62} ry={64} />
  <SpokenRing s={s} t={t} target="string" x={470} y={320} rx={125} ry={30} />
  <SpokenRing s={s} t={t} target="air" x={665} y={522} rx={90} ry={86} />
  <SpokenRing s={s} t={t} target="tension" x={470} y={320} rx={125} ry={30} />
  <SpokenRing s={s} t={t} target="tension" x={665} y={427} rx={30} ry={48} />
  <SpokenRing s={s} t={t} target="acceleration" x={278} y={320} rx={77} ry={68} />
  <SpokenRing s={s} t={t} target="acceleration" x={665} y={522} rx={68} ry={68} />
</>;

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
const Paper: React.FC<{ lines: Line[]; t: number; ringLine?: number; prompt?: string; note?: string; children?: React.ReactNode }> = ({
  lines,
  t,
  ringLine = -1,
  prompt,
  note,
  children,
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
      {children}
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

const Opening: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const state = latest(s, t, ['syllabus', 'quote', 'outcomes', 'explain', 'list', 'match']);
  const outcome = ['explain', 'list', 'match'].indexOf(state);
  return (
    <>
      <Diagram><System sphere /><SpokenRing s={s} t={t} target="surface" x={350} y={375} rx={220} ry={28} /></Diagram>
      <Header>
        {['outcomes', 'explain', 'list', 'match'].includes(state)
          ? 'By the end you can...'
          : 'Syllabus 4.1 · p.31 (excerpt)'}
      </Header>
      {state === 'quote' && <Card text="use the model of a ‘smooth’ contact" centre t={t} start={cue(s, 'quote')} />}
      {outcome >= 0 && <Card text={OUTCOMES[outcome]} centre t={t} start={cue(s, state)} />}
    </>
  );
};

const ModellingCycle: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const nodes = [
    { id: 'real', text: 'Real problem', x: 80, y: 75 },
    { id: 'assumptions', text: 'Assumptions', x: 565, y: 75 },
    { id: 'equations', text: 'Equations or graph', x: 1050, y: 75 },
    { id: 'check', text: 'Reasonable?', x: 1050, y: 370 },
    { id: 'refine', text: 'Refine', x: 565, y: 370 },
  ];
  const active = latest(
    s,
    t,
    nodes.map((n) => n.id),
  );
  return (
    <svg
      data-region="diagram"
      width="1720"
      height="650"
      viewBox="0 0 1720 650"
      style={{ position: 'absolute', left: 100, top: 290 }}
    >
      <g transform="translate(70 285) scale(0.48)"><System sphere /></g>
      {nodes.map(
        (n, i) =>
          (i === 0 || t >= cue(s, n.id)) && (
            <g key={n.id}>
              {i > 0 && (
                <path
                  d={
                    [
                      '',
                      'M475 155 H555 m-12 -10 l12 10 l-12 10',
                      'M960 155 H1040 m-12 -10 l12 10 l-12 10',
                      'M1245 235 V360 m-10 -12 l10 12 l10 -12',
                      'M1050 450 H970 m12 -10 l-12 10 l12 10',
                    ][i]
                  }
                  fill="none"
                  stroke={T.muted}
                  strokeWidth="4"
                />
              )}
              <rect
                x={n.x}
                y={n.y}
                width="395"
                height="160"
                rx="8"
                fill={T.paper}
                stroke={active === n.id ? T.accent : T.paper}
                strokeWidth="5"
              />
              <text
                data-card="true"
                x={n.x + 197.5}
                y={n.y + 92}
                textAnchor="middle"
                fill={T.ink}
                fontSize="38"
              >
                {n.text}
              </text>
              {n.id === 'refine' && (
                <path
                  d="M760 370 V244 m-10 13 l10 -13 l10 13"
                  fill="none"
                  stroke={T.accent}
                  strokeWidth="4"
                />
              )}
              <SpokenRing s={s} t={t} target={n.id} x={n.x + 197} y={n.y + 80} rx={183} ry={52} />
            </g>
          ),
      )}
    </svg>
  );
};

const FallingStone: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  const at = (id: string) => t >= cue(s, id);
  const state = latest(s, t, [
    'stone',
    'dimensions',
    'air',
    'size',
    'gravity',
    'vertical',
    'no-air',
    'particle',
    'constant',
    'model',
    'domain',
    'zero',
    'one',
    'water',
    'question',
    'answer',
    'refine-air',
    'refine-size',
    'refine-motion',
  ]);
  const refining = at('refine-air');
  const point = at('particle') && !at('refine-size');
  const vertical = at('vertical') && !at('refine-motion');
  const stoneY = refining ? 120 : at('water') ? 585 : at('one-value') ? 240 : 120;
  const showAir = at('air') || refining;
  const words: Record<string, string> = {
    dimensions: 'Two or three dimensions',
    air: 'Air and wind',
    size: 'Size, shape and spin',
    gravity: 'Gravity pulls down',
    vertical: 'Vertical fall',
    'no-air': 'Ignore air and wind',
    particle: 'Particle: ignore dimensions',
    constant: 'Constant gravity',
    question: 'Is 1 m after one second reasonable?',
    answer: 'The model gives 15 m',
    'refine-air': 'Include air resistance',
    'refine-size': 'Keep size and mass',
    'refine-motion': 'Allow two or three dimensions',
  };
  const holds = s.holds.filter((h) => h.kind === 'hold');
  const lines: Line[] = [
    {
      id: 'height-model',
      text: 'h = 20 - 5t',
      exponent: '2',
      start: cue(s, 'model'),
      end: cue(s, 'domain') - 0.15,
      y: 95,
    },
  ];
  if (at('domain') && !at('zero'))
    lines.push({
      id: 'domain',
      text: '0 ≤ t ≤ 2',
      start: cue(s, 'domain'),
      end: cue(s, 'zero') - 0.15,
      y: 245,
    });
  if (at('zero'))
    lines.push({
      id: 'zero-reading',
      text: 'h(0) = 20 m',
      start: cue(s, 'zero'),
      prefixEnd: cue(s, 'zero-value'),
      resultAt: cue(s, 'zero-value'),
      end: holds[0].start - 0.1,
      y: 245,
    });
  if (at('one'))
    lines.push({
      id: 'one-reading',
      text: 'h(1) = 15 m',
      start: cue(s, 'one'),
      prefixEnd: cue(s, 'one-value'),
      resultAt: cue(s, 'one-value'),
      end: holds[1].start - 0.1,
      y: 395,
    });
  const ringLine =
    t >= holds[1].start && t < holds[1].end ? 2 : t >= holds[0].start && t < holds[0].end ? 1 : -1;
  return (
    <>
      {(
        <Diagram>
          <g transform={at('model') ? 'translate(0 180) scale(0.52)' : undefined}>
          <path d="M50 120 H275 V590 H50 Z" fill="#333b3d" />
          <path d="M80 170 l90 20 l-25 95 l100 65 M110 420 l125 40 l-40 95" fill="none" stroke="#515957" strokeWidth="3" />
          <path d="M50 120 H275 V590 H800" fill="none" stroke={T.muted} strokeWidth="5" />
          <path
            d="M300 608 Q330 595 360 608 T420 608 T480 608 T540 608 T600 608 T660 608 T720 608 T780 608"
            fill="none"
            stroke={T.muted}
            strokeWidth="3"
          />
          {at('dimensions') && (
            <path
              d={
                vertical
                  ? `M315 120 Q${mix(565, 315, clamp((t - cue(s, 'vertical')) / 0.9))} 170 ${mix(650, 315, clamp((t - cue(s, 'vertical')) / 0.9))} 585`
                  : 'M315 120 Q565 170 650 585'
              }
              fill="none"
              stroke={
                state === 'dimensions' || state === 'vertical' || state === 'refine-motion'
                  ? T.accent
                  : T.muted
              }
              strokeWidth="4"
              strokeDasharray="10 10"
            />
          )}
          {showAir && (
            <g opacity={at('no-air') && !refining ? 0.5 : 1}>
            <path
              d={
                refining
                  ? 'M450 365 V245 m-12 16 l12 -16 l12 16'
                  : 'M430 165 Q480 130 525 165 m-12 -15 l12 15 l-20 1'
              }
              fill="none"
              stroke={state === 'air' || state === 'refine-air' ? T.accent : T.muted}
              strokeWidth="5"
            />
            {at('no-air') && !refining && <path d="M445 130 L525 185" stroke={T.muted} strokeWidth="3" />}
            </g>
          )}
          {at('gravity') && (
            <Arrow x={160} y={220} dx={0} dy={135} accent={state === 'gravity' || state === 'constant'} />
          )}
          {point ? (
            <circle cx="315" cy={stoneY} r="10" fill={state === 'particle' ? T.accent : T.text} />
          ) : (
            <path
              d={`M297 ${stoneY - 13} l24 -8 l19 19 l-8 20 l-29 -3 Z`}
              fill={T.bg}
              stroke={state === 'size' || state === 'refine-size' ? T.accent : T.text}
              strokeWidth="4"
            />
          )}
          {at('size') && !point && !refining && (
            <path
              d="M350 105 A42 42 0 0 1 345 158 m0 -13 v13 h13"
              fill="none"
              stroke={state === 'size' ? T.accent : T.muted}
              strokeWidth="3"
            />
          )}
          {at('water') && !refining && (
            <text x="365" y={stoneY - 18} fill={T.text} fontSize="35">
              Water
            </text>
          )}
          <SpokenRing s={s} t={t} target="stone" x={315} y={stoneY} rx={55} ry={48} />
          <SpokenRing s={s} t={t} target="air" x={refining ? 450 : 485} y={refining ? 300 : 160} rx={75} ry={65} />
          <SpokenRing s={s} t={t} target="gravity" x={160} y={285} rx={38} ry={95} />
          <SpokenRing s={s} t={t} target="trajectory" x={vertical ? 315 : 485} y={350} rx={vertical ? 45 : 195} ry={260} />
          </g>
          {at('model') && <g transform="translate(440 70)">
            <path d="M70 60 V510 H375" fill="none" stroke={T.muted} strokeWidth="3" />
            <text x="70" y="28" fill={T.text} fontSize="28">Height (m)</text>
            <text x="195" y="620" fill={T.text} fontSize="28">Time (s)</text>
            <path d="M70 110 Q210 110 350 510 L70 510 Z" fill={`${T.accent}15`} />
            <path d="M70 110 Q210 110 350 510" fill="none" stroke={T.accent} strokeWidth="4" />
            {[{ value: '20', y: 110 }, { value: '15', y: 210 }, { value: '0', y: 510 }].map(({ value, y }) =>
              <g key={value}><path d={`M62 ${y} H350`} stroke={T.muted} strokeWidth="1.5" strokeDasharray="5 7" />
                <text x="48" y={y + 9} fill={T.text} textAnchor="end" fontSize="28">{value}</text></g>)}
            {[0, 1, 2].map((value) => <g key={value}>
              <path d={`M${70 + value * 140} 510 V540`} stroke={T.muted} strokeWidth="2" />
              <text x={70 + value * 140} y="575" textAnchor="middle" fill={T.text} fontSize="28">{value}</text>
            </g>)}
            <circle cx={at('water') ? 350 : at('one-value') ? 210 : 70}
              cy={at('water') ? 510 : at('one-value') ? 210 : 110} r="7" fill={T.text} />
            <SpokenRing s={s} t={t} target="twenty" x={28} y={110} rx={32} ry={28} />
            <SpokenRing s={s} t={t} target="fifteen" x={28} y={210} rx={32} ry={28} />
            <SpokenRing s={s} t={t} target="zero-time" x={70} y={567} rx={29} ry={27} />
            <SpokenRing s={s} t={t} target="one-time" x={210} y={567} rx={29} ry={27} />
            <SpokenRing s={s} t={t} target="water" x={350}
              y={s.focus.filter((e) => e.target === 'water' && t >= e.start).at(-1)?.phrase === 'water' ? 510 : 567}
              rx={32} ry={29} />
            <SpokenRing s={s} t={t} target="question" x={210} y={210} rx={30} ry={28} />
          </g>}
        </Diagram>
      )}
      {at('model') && !at('question') ? (
        <Paper lines={lines} t={t} ringLine={ringLine} />
      ) : (
        words[state] && <Card text={words[state]} t={t} start={cue(s, state)} />
      )}
    </>
  );
};

const Vocabulary: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const at = (id: string) => t >= cue(s, id);
  const state = latest(s, t, [
    'particle',
    'smooth',
    'rough',
    'rod',
    'uniform',
    'uneven',
    'light',
    'heavy',
    'inextensible',
    'stretching',
  ]);
  const names: Record<string, string> = {
    particle: 'Particle',
    smooth: 'Smooth surface',
    rough: 'Rough surface',
    rod: 'Rod or beam',
    uniform: 'Uniform rod',
    uneven: 'Uneven mass',
    light: 'Light string',
    heavy: 'Heavy string',
    inextensible: 'Inextensible string',
    stretching: 'Stretching string',
  };
  const rod = ['rod', 'uniform', 'uneven'].includes(state);
  const centre = state === 'uneven' ? 560 : 420;
  return (
    <>
      {(
        <Diagram>
          {rod ? (
            <g stroke={T.text} fill="none" strokeWidth="5">
              <rect x="150" y="323" width="540" height="54" rx="12" fill={`${T.accent}15`} strokeWidth="4" />
              <path d="M150 298 V310 M690 298 V310 M150 304 H690" stroke={T.muted} strokeWidth="3" />
              {at('uniform') &&
                Array.from({ length: 10 }, (_, i) => (
                  <circle
                    key={i}
                    cx={180 + i * 53}
                    cy="350"
                    r={state === 'uneven' && i > 5 ? 12 : 6}
                    fill={T.muted}
                    stroke="none"
                  />
                ))}
              {at('centre') && <Arrow x={centre} y={365} dx={0} dy={140} label="Weight" accent />}
              <SpokenRing s={s} t={t} target="rod" x={420} y={350} rx={285} ry={52} />
              <SpokenRing s={s} t={t} target="centre" x={centre} y={350} rx={38} ry={46} />
            </g>
          ) : (
            <><System
              sphere
              particle={state === 'particle'}
              rough={state === 'rough'}
              friction={state === 'rough' && at('friction')}
              heavyString={state === 'heavy'}
              extensible={state === 'stretching'}
              motion={state === 'stretching' ? 30 : 0}
              travel={state === 'inextensible' ? (at('direction') ? 2 : at('acceleration') ? 1 : 0) : 0}
              acceleration
            /><SystemFocus s={s} t={t} particle={state === 'particle'} /></>
          )}
        </Diagram>
      )}
      {names[state] && <Card text={names[state]} t={t} start={cue(s, state)} />}
    </>
  );
};

const Matching: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = heldTime(s, useCurrentFrame() / fps);
  const at = (id: string) => t >= cue(s, id);
  const pairs = [
    { question: 'q-particle', answer: 'particle', prompt: 'Ignore air resistance?', word: 'particle' },
    { question: 'q-light', answer: 'light', prompt: 'Ignore string mass?', word: 'light' },
    {
      question: 'q-pulley',
      answer: 'smooth-pulley',
      prompt: 'Same tension both sides?',
      word: 'smooth pulley',
    },
    {
      question: 'q-surface',
      answer: 'smooth-surface',
      prompt: 'Ignore desk friction?',
      word: 'smooth surface',
    },
    {
      question: 'q-string',
      answer: 'inextensible',
      prompt: 'Same acceleration magnitudes?',
      word: 'inextensible',
    },
  ];
  const pair = pairs.filter((p) => at(p.question)).at(-1);
  const answerStart = pair ? cue(s, pair.answer) : Infinity;
  const nextQuestion = pair ? pairs[pairs.indexOf(pair) + 1] : undefined;
  const answerEnd = Math.min(
    answerStart + 3.5,
    nextQuestion ? cue(s, nextQuestion.question) - 0.3 : s.duration - 0.4,
  );
  const lines: Line[] =
    pair && at(pair.answer)
      ? [{ id: pair.answer, text: pair.word, start: answerStart, end: answerEnd, y: 475 }]
      : [];
  const note =
    pair?.answer === 'particle' && at('separate')
      ? 'Neglecting air resistance is a separate assumption'
      : undefined;
  return (
    <>
      {(
        <Diagram>
          <System
            sphere
            particle={pair?.answer === 'particle' && at('particle')}
            tensions={
              pair?.answer === 'smooth-pulley' && at('smooth-pulley') ? (at('tension-second') ? 2 : 1) : 0
            }
            travel={
              pair?.answer === 'inextensible' && at('inextensible')
                ? at('acceleration-second')
                  ? 2
                  : at('acceleration-first')
                    ? 1
                    : 0
                : 0
            }
            acceleration
          />
          <g fill={T.text} fontSize="30">
            <text x="278" y="245" textAnchor="middle">Box · 5 kg</text>
            <text x="278" y="418" textAnchor="middle">Desk</text>
            <text x="470" y="290" textAnchor="middle">String</text>
            <text x="620" y="270" textAnchor="middle">Pulley</text>
            <text x="665" y="630" textAnchor="middle">Sphere · 2 kg</text>
          </g>
          <SystemFocus s={s} t={t} particle={pair?.answer === 'particle' && at('particle')} />
        </Diagram>
      )}
      <Paper lines={lines} t={t} note={note}>
        <foreignObject x="65" y="26" width="690" height="125">
          <div style={{ color: T.ink, fontSize: 29, lineHeight: '40px' }}>
            <div data-card="problem" data-problem-line="true">A <SpokenPhrase s={s} t={t} target="box">5 kg box</SpokenPhrase> on a <SpokenPhrase s={s} t={t} target="surface">desk</SpokenPhrase> is connected</div>
            <div data-card="problem" data-problem-line="true">by a <SpokenPhrase s={s} t={t} target="string">string</SpokenPhrase> over a <SpokenPhrase s={s} t={t} target="pulley">pulley</SpokenPhrase> to a hanging</div>
            <div data-card="problem" data-problem-line="true"><SpokenPhrase s={s} t={t} target="sphere">2 kg sphere.</SpokenPhrase> State assumptions to allow:</div>
          </div>
        </foreignObject>
        <g fill={T.ink} fontSize="29">
          {pairs.map((p, i) => <g key={p.question}>
            <text data-card="true" x="65" y={202 + i * 43}
              fill={pair === p ? T.ink : '#60665f'}>
              {i + 1}. {['Ignore air resistance', 'Ignore string mass', 'Same tension both sides',
                'Ignore desk friction', 'Same acceleration magnitudes'][i]}
            </text>
            <PhraseUnderline s={s} t={t} target={p.question} x={98} y={211 + i * 43}
              width={[252, 225, 292, 243, 385][i]} />
            {pair === p && <path d={`M44 ${191 + i * 43} l9 7 l-9 7`} fill="none" stroke={T.accent} strokeWidth="3" />}
          </g>)}
        </g>
        {pair && <text data-card="true" x="65" y="443" fill={T.ink} fontSize="29">{pair.prompt}</text>}
      </Paper>
    </>
  );
};

const Recap: React.FC<{ s: Scene }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const index = t >= cue(s, 'match') ? 2 : t >= cue(s, 'list') ? 1 : 0;
  const tick = useCue(s, ['tick-explain', 'tick-list', 'tick-match'][index]);
  return <>
    <Diagram><System sphere />
      <SpokenRing s={s} t={t} target="surface" x={350} y={375} rx={220} ry={28} />
      <g transform="translate(170 95)" fill="none" stroke={T.muted} strokeWidth="3">
        <path d="M20 0 H440 V80 H20 Z M160 0 V80 M300 0 V80 M440 80 V110 H20 V80" />
        <path d="M80 42 h40 m-10 -8 l10 8 l-10 8 M220 42 h40 m-10 -8 l10 8 l-10 8" />
        <SpokenRing s={s} t={t} target="cycle" x={230} y={40} rx={245} ry={62} />
      </g>
    </Diagram>
    {t >= cue(s, 'explain') && <Card text={OUTCOMES[index]} centre tick={tick} t={t}
      start={cue(s, ['explain', 'list', 'match'][index])} />}
  </>;
};
const CONTENT = [Opening, ModellingCycle, FallingStone, Vocabulary, Matching, Recap];

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
        kind: el.getAttribute('data-card') ?? 'ink',
        rect: el.getBoundingClientRect(),
      }));
    const root = container.getBoundingClientRect();
    const diagram = regions.find((el) => el.getAttribute('data-region') === 'diagram');
    const inkAndLabels = Array.from(container.querySelectorAll('svg[data-region] text, [data-ink-text], [data-problem-line]'))
      .filter(visible);
    const collisions: string[][] = [];
    inkAndLabels.forEach((first, i) => inkAndLabels.slice(i + 1).forEach((second) => {
      const a = first.getBoundingClientRect(), b = second.getBoundingClientRect();
      if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2)
        collisions.push([first.getAttribute('data-ink-text') ?? first.textContent ?? '',
          second.getAttribute('data-ink-text') ?? second.textContent ?? '']);
    }));
    const overflow = root
      ? [...regions, ...inkAndLabels].some(
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
        maxCaptionWords: Math.max(0, ...cards.filter((c) => c.kind === 'true').map((c) => c.text.trim().split(/\s+/).length)),
        visualPresent: !!diagram && Array.from(diagram.querySelectorAll('path,circle,rect')).some(visible),
        diagramBounds: diagram?.getBoundingClientRect().toJSON(),
        rings: Array.from(container.querySelectorAll('[data-ring]')).filter(visible).map((el) => ({
          target: el.getAttribute('data-ring'), start: Number(el.getAttribute('data-ring-start')),
          ...el.getBoundingClientRect().toJSON(),
        })),
        underlines: Array.from(container.querySelectorAll('[data-underline]')).filter(visible).map((el) => el.getAttribute('data-underline')),
        collisions,
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
