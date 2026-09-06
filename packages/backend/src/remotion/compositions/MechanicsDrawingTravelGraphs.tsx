/**
 * Drawing Travel Graphs
 *
 * Eight narration-driven mechanics-lab scenes. Every graph, vehicle position,
 * tangent and area is derived from one of the piecewise motion models below.
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
import transcriptJson from '../public/transcripts/mechanics/drawing-travel-graphs.json';

const TRANSITION_FRAMES = 15;
const PREMOUNT_FRAMES = 30;
const BASE_SCENE_FRAMES_30 = [450, 600, 600, 2250, 600, 1950, 450, 600] as const;

const T = {
  bg: '#07141d',
  bgDeep: '#020a10',
  panel: '#0d2633',
  panelLight: '#193b47',
  ivory: '#fff7e5',
  paper: '#fffaf0',
  ink: '#102332',
  text: '#faf5e9',
  muted: '#9fb5bd',
  rule: '#a9c9dd',
  margin: '#e9a2a0',
  cyan: '#42dbe8',
  amber: '#f4aa45',
  teal: '#38c9aa',
  coral: '#ef7669',
  green: '#68d391',
  purple: '#b69cff',
  blueInk: '#213b78',
  sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
};

interface TranscriptWord { word: string; start: number; end: number }
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
  sceneCount: number;
  scenes: TranscriptScene[];
  totalDuration: number;
  generatedAt: string;
  engine: string;
}

const TRANSCRIPT = transcriptJson as unknown as MechanicsTranscript;
const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '');
const getScene = (id: string): TranscriptScene => {
  const scene = TRANSCRIPT.scenes.find((candidate) => candidate.id === id);
  if (!scene) throw new Error(`Missing transcript scene: ${id}`);
  return scene;
};
const cueAt = (scene: TranscriptScene, name: string): number =>
  Object.entries(scene.cues).find(([candidate]) => normalize(candidate) === normalize(name))?.[1]
  ?? scene.duration + 1;

export interface MechanicsDrawingTravelGraphsProps { audioEnabled?: boolean }

export function getMechanicsDrawingTravelGraphsDuration(fps: number): number {
  return Math.round(250 * fps);
}

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const mix = (a: number, b: number, p: number): number => a + (b - a) * p;
function useCue(seconds: number, fadeDuration = .4): { opacity: number; isActive: boolean } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = seconds * fps;
  return {
    opacity: interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    isActive: frame >= cueFrame,
  };
}
const progressAt = (frame: number, start: number, end: number): number =>
  clamp01((frame - start) / Math.max(1, end - start));

type Hold = readonly [number, number];
const freezeDuring = (frame: number, holds: readonly Hold[]): number => {
  const active = holds.find(([start, end]) => frame >= start && frame < end);
  return active ? active[0] : frame;
};

type FadeThroughProps = { background: string };
const FadeThrough: React.FC<TransitionPresentationComponentProps<FadeThroughProps>> = ({
  children,
  passedProps,
  presentationDirection,
  presentationProgress,
}) => {
  const opacity = presentationDirection === 'exiting'
    ? interpolate(presentationProgress, [0, 0.5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(presentationProgress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: passedProps.background, opacity }}>{children}</AbsoluteFill>;
};
const fadeThroughGraphite: TransitionPresentation<FadeThroughProps> = {
  component: FadeThrough,
  props: { background: T.bg },
};

interface MotionPhase {
  start: number;
  end: number;
  velocity: number;
  acceleration?: number;
  jumpBefore?: boolean;
}
interface MotionModel { phases: readonly MotionPhase[]; end: number; initialDisplacement?: number }
interface MotionState { t: number; velocity: number; displacement: number }

const WORD_MODEL: MotionModel = {
  end: 14,
  phases: [
    { start: 0, end: 4, velocity: 3 },
    { start: 4, end: 6, velocity: 3, acceleration: -1.5 },
    { start: 6, end: 9, velocity: 0 },
    { start: 9, end: 14, velocity: -3, jumpBefore: true },
  ],
};
const LIFT_MODEL: MotionModel = {
  end: 8,
  phases: [
    { start: 0, end: 2, velocity: 0, acceleration: 1.5 },
    { start: 2, end: 6, velocity: 3 },
    { start: 6, end: 8, velocity: 3, acceleration: -1.5 },
  ],
};
const BALL_MODEL: MotionModel = {
  end: 3,
  phases: [{ start: 0, end: 3, velocity: 14.7, acceleration: -9.8 }],
};

const phaseArea = (phase: MotionPhase, duration: number): number =>
  phase.velocity * duration + 0.5 * (phase.acceleration ?? 0) * duration * duration;

function stateAt(model: MotionModel, rawTime: number): MotionState {
  const t = Math.max(0, Math.min(model.end, rawTime));
  let displacement = model.initialDisplacement ?? 0;
  let velocity = model.phases[0]?.velocity ?? 0;
  for (const phase of model.phases) {
    if (t <= phase.start) break;
    const elapsed = Math.min(t, phase.end) - phase.start;
    displacement += phaseArea(phase, elapsed);
    velocity = phase.velocity + (phase.acceleration ?? 0) * elapsed;
    if (t <= phase.end) break;
  }
  return { t, velocity, displacement };
}

interface PlotSpec {
  x: number;
  y: number;
  width: number;
  height: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
const xFor = (plot: PlotSpec, t: number): number => plot.x + (t / plot.xMax) * plot.width;
const yFor = (plot: PlotSpec, value: number): number =>
  plot.y + ((plot.yMax - value) / (plot.yMax - plot.yMin)) * plot.height;

function sampledPath(
  model: MotionModel,
  plot: PlotSpec,
  kind: 'velocity' | 'displacement',
  until = model.end,
): string {
  const points: string[] = [];
  const count = Math.max(2, Math.ceil(Math.min(model.end, until) * 20));
  for (let index = 0; index <= count; index += 1) {
    const t = Math.min(until, model.end) * index / count;
    const state = stateAt(model, t);
    const value = kind === 'velocity' ? state.velocity : state.displacement;
    points.push(`${index === 0 ? 'M' : 'L'} ${xFor(plot, t).toFixed(2)} ${yFor(plot, value).toFixed(2)}`);
  }
  return points.join(' ');
}

function velocitySegments(model: MotionModel, plot: PlotSpec): string[] {
  return model.phases.map((phase) => {
    const endVelocity = phase.velocity + (phase.acceleration ?? 0) * (phase.end - phase.start);
    return `M ${xFor(plot, phase.start)} ${yFor(plot, phase.velocity)} L ${xFor(plot, phase.end)} ${yFor(plot, endVelocity)}`;
  });
}

const Trace: React.FC<{
  d: string;
  progress?: number;
  color?: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
}> = ({ d, progress = 1, color = T.cyan, width = 7, opacity = 1, dashed = false }) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={1}
    strokeDasharray={dashed ? '0.035 0.028' : 1}
    strokeDashoffset={dashed ? 0 : 1 - clamp01(progress)}
    opacity={opacity}
  />
);

const PlotAxes: React.FC<{
  plot: PlotSpec;
  kind: 'velocity' | 'displacement';
  xTicks: readonly number[];
  yTicks: readonly number[];
  compact?: boolean;
  showGrid?: boolean;
}> = ({ plot, kind, xTicks, yTicks, compact = false, showGrid = true }) => {
  const zeroY = yFor(plot, 0);
  return (
    <g fontFamily={T.mono}>
      <rect x={plot.x} y={plot.y} width={plot.width} height={plot.height} rx={10} fill={T.paper} stroke="#cabda8" strokeWidth={2} />
      {showGrid && xTicks.map((tick) => <line key={`xg-${tick}`} x1={xFor(plot, tick)} y1={plot.y} x2={xFor(plot, tick)} y2={plot.y + plot.height} stroke={T.cyan} strokeWidth={1.2} opacity={0.16} />)}
      {showGrid && yTicks.map((tick) => <line key={`yg-${tick}`} x1={plot.x} y1={yFor(plot, tick)} x2={plot.x + plot.width} y2={yFor(plot, tick)} stroke={T.cyan} strokeWidth={1.2} opacity={0.16} />)}
      <line x1={plot.x} y1={zeroY} x2={plot.x + plot.width} y2={zeroY} stroke={T.ink} strokeWidth={3.5} />
      <line x1={plot.x} y1={plot.y + plot.height} x2={plot.x} y2={plot.y} stroke={T.ink} strokeWidth={3.5} />
      {xTicks.map((tick) => <g key={`xt-${tick}`}><line x1={xFor(plot, tick)} y1={zeroY - 5} x2={xFor(plot, tick)} y2={zeroY + 5} stroke={T.ink} strokeWidth={2.4} /><text x={xFor(plot, tick)} y={plot.y + plot.height + (compact ? 27 : 35)} textAnchor="middle" fill={T.ink} fontSize={28}>{plot.xMax === 14 && tick === 14 ? 'T' : tick}</text></g>)}
      {yTicks.map((tick) => <g key={`yt-${tick}`}><line x1={plot.x - 5} y1={yFor(plot, tick)} x2={plot.x + 5} y2={yFor(plot, tick)} stroke={T.ink} strokeWidth={2.4} /><text x={plot.x - 12} y={yFor(plot, tick) + 9} textAnchor="end" fill={T.ink} fontSize={28}>{tick}</text></g>)}
      <text x={plot.x + plot.width - 55} y={plot.y + plot.height + (compact ? 27 : 35)} textAnchor="end" fill={T.ink} fontSize={28}>t / s</text>
      <text x={plot.x + 3} y={plot.y - 12} fill={T.ink} fontSize={28}>{kind === 'velocity' ? 'v / (m s⁻¹)' : 's / m'}</text>
    </g>
  );
};

const SceneShell: React.FC<{
  scene: number;
  label: string;
  children: React.ReactNode;
  displayFrame?: number;
}> = ({ scene, label, children, displayFrame }) => {
  const localFrame = useCurrentFrame();
  const frame = displayFrame ?? localFrame;
  const drift = Math.sin(Math.max(0, frame) / 85) * 7;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', isolation: 'isolate', background: T.bg, fontFamily: T.sans }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${20 + drift / 7}% 12%, ${T.cyan}14, transparent 34%), radial-gradient(circle at 86% 88%, ${T.amber}10, transparent 31%), linear-gradient(145deg, ${T.bgDeep}, ${T.bg})` }} />
      <AbsoluteFill style={{ opacity: 0.12, backgroundImage: `linear-gradient(${T.cyan}2d 1px, transparent 1px), linear-gradient(90deg, ${T.cyan}2d 1px, transparent 1px)`, backgroundSize: '64px 64px', transform: `translateX(${drift}px)` }} />
      <div style={{ position: 'absolute', left: 58, top: 43, color: T.muted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2.4 }}>MECHANICS LAB · TRAVEL GRAPH RIG</div>
      <div style={{ position: 'absolute', right: 58, top: 40, display: 'flex', gap: 14, alignItems: 'center', padding: '10px 18px', borderRadius: 999, background: `${T.bgDeep}e8`, border: `1px solid ${T.cyan}66`, color: T.muted, fontFamily: T.mono, fontSize: 28, letterSpacing: 1.2, zIndex: 20 }}>
        <span style={{ color: T.cyan, fontWeight: 950 }}>{String(scene).padStart(2, '0')} / 08</span><span>{label.toUpperCase()}</span>
      </div>
      {children}
      <div style={{ position: 'absolute', left: 58, right: 58, bottom: 30, height: 2, background: `linear-gradient(90deg, transparent, ${T.cyan}66 15%, ${T.cyan}66 85%, transparent)` }} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ kicker: string; children: React.ReactNode }> = ({ kicker, children }) => (
  <div style={{ position: 'absolute', left: 72, top: 94, zIndex: 10 }}>
    <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 28, fontWeight: 900, letterSpacing: 2.2 }}>{kicker.toUpperCase()}</div>
    <div style={{ color: T.text, fontSize: 48, lineHeight: 1.05, fontWeight: 930, marginTop: 5 }}>{children}</div>
  </div>
);

const WarmCard: React.FC<{ children: React.ReactNode; accent?: string; style?: React.CSSProperties }> = ({ children, accent = T.cyan, style }) => (
  <div style={{ borderRadius: 22, background: T.ivory, color: T.ink, border: `3px solid ${accent}`, boxShadow: `0 16px 48px #0008, 0 0 24px ${accent}18`, ...style }}>{children}</div>
);

const Cued: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; fromX?: number; fromY?: number }> = ({ at, children, style, fromX = 0, fromY = 18 }) => {
  const cue = useCue(at, 0.38);
  return <div style={{ opacity: cue.opacity, transform: `translate(${(1 - cue.opacity) * fromX}px, ${(1 - cue.opacity) * fromY}px)`, ...style }}>{children}</div>;
};

const DirectionArrow: React.FC<{ color?: string; label?: string; opacity?: number }> = ({ color = T.teal, label = 'POSITIVE →', opacity = 1 }) => (
  <svg width="310" height="70" viewBox="0 0 310 70" style={{ opacity }}>
    <line x1={18} y1={35} x2={275} y2={35} stroke={color} strokeWidth={9} strokeLinecap="round" />
    <path d="M 275 17 L 304 35 L 275 53 Z" fill={color} />
    <text x={22} y={27} fill={T.ink} fontFamily={T.mono} fontSize={28} fontWeight={950}>{label}</text>
  </svg>
);

// A tiny prepared single-stroke alphabet. Equations are SVG paths, never SVG text.
type Point = readonly [number, number];
interface Glyph { width: number; strokes: readonly (readonly Point[])[] }
const G: Record<string, Glyph> = {
  '0': { width: .72, strokes: [[[.16,.08],[.55,.03],[.68,.22],[.66,.78],[.52,.96],[.16,.91],[.04,.72],[.06,.25],[.16,.08]]] },
  '1': { width: .52, strokes: [[[.08,.25],[.28,.06],[.29,.94]], [[.08,.94],[.48,.94]]] },
  '2': { width: .7, strokes: [[[.05,.25],[.18,.06],[.53,.05],[.67,.23],[.61,.42],[.07,.91],[.67,.91]]] },
  '3': { width: .68, strokes: [[[.05,.13],[.27,.04],[.58,.1],[.66,.28],[.56,.46],[.29,.5],[.57,.54],[.67,.74],[.56,.91],[.25,.97],[.04,.86]]] },
  '4': { width: .72, strokes: [[[.53,.96],[.53,.04],[.04,.68],[.68,.68]]] },
  '5': { width: .68, strokes: [[[.63,.07],[.13,.07],[.08,.48],[.47,.43],[.65,.58],[.61,.84],[.43,.96],[.14,.92],[.03,.81]]] },
  '6': { width: .69, strokes: [[[.61,.15],[.46,.04],[.2,.1],[.06,.35],[.08,.78],[.24,.95],[.53,.91],[.66,.7],[.59,.49],[.34,.42],[.08,.54]]] },
  '7': { width: .68, strokes: [[[.04,.08],[.66,.08],[.25,.96]]] },
  '8': { width: .7, strokes: [[[.33,.49],[.12,.39],[.08,.18],[.23,.04],[.5,.07],[.64,.23],[.57,.43],[.33,.49],[.12,.57],[.06,.78],[.2,.94],[.49,.95],[.66,.78],[.59,.58],[.33,.49]]] },
  '9': { width: .69, strokes: [[[.61,.48],[.36,.57],[.12,.47],[.06,.24],[.2,.06],[.5,.08],[.64,.29],[.59,.76],[.43,.95],[.15,.92]]] },
  v: { width: .75, strokes: [[[.03,.28],[.27,.94],[.48,.55],[.69,.25]]] },
  t: { width: .55, strokes: [[[.29,.08],[.25,.83],[.37,.95],[.51,.87]], [[.05,.34],[.52,.3]]] },
  s: { width: .64, strokes: [[[.59,.27],[.45,.17],[.19,.2],[.08,.38],[.2,.5],[.48,.54],[.59,.69],[.51,.9],[.24,.96],[.05,.84]]] },
  m: { width: 1.02, strokes: [[[.05,.93],[.09,.3],[.3,.19],[.44,.34],[.44,.92]], [[.44,.35],[.66,.19],[.83,.3],[.91,.93]]] },
  h: { width: .72, strokes: [[[.08,.04],[.07,.94]], [[.08,.56],[.28,.27],[.54,.26],[.65,.43],[.63,.94]]] },
  '=': { width: .7, strokes: [[[.08,.4],[.63,.4]], [[.06,.68],[.61,.67]]] },
  '+': { width: .7, strokes: [[[.34,.2],[.34,.84]], [[.04,.52],[.65,.52]]] },
  '-': { width: .65, strokes: [[[.06,.55],[.59,.53]]] },
  '−': { width: .65, strokes: [[[.06,.55],[.59,.53]]] },
  '×': { width: .7, strokes: [[[.08,.22],[.62,.82]], [[.61,.2],[.09,.84]]] },
  '/': { width: .58, strokes: [[[.05,.94],[.53,.05]]] },
  '.': { width: .3, strokes: [[[.13,.85],[.15,.88]]] },
  '(': { width: .42, strokes: [[[.34,.04],[.16,.23],[.09,.51],[.17,.79],[.34,.96]]] },
  ')': { width: .42, strokes: [[[.08,.04],[.27,.24],[.34,.51],[.26,.79],[.08,.96]]] },
  '½': { width: 1.05, strokes: [[[.03,.21],[.17,.07],[.18,.46]], [[.03,.47],[.34,.47]], [[.2,.96],[.84,.04]], [[.58,.65],[.69,.53],[.9,.55],[.95,.67],[.61,.94],[.97,.94]]] },
  '⁻': { width: .42, strokes: [[[.04,.22],[.37,.2]]] },
  '¹': { width: .38, strokes: [[[.04,.17],[.18,.04],[.19,.43]], [[.04,.43],[.34,.43]]] },
  '₁': { width: .38, strokes: [[[.04,.67],[.18,.53],[.19,.94]], [[.04,.94],[.34,.94]]] },
  '₂': { width: .45, strokes: [[[.03,.66],[.13,.53],[.34,.54],[.41,.65],[.35,.76],[.04,.94],[.42,.94]]] },
  '₃': { width: .45, strokes: [[[.03,.57],[.18,.52],[.37,.57],[.28,.72],[.4,.78],[.35,.92],[.15,.96],[.03,.9]]] },
  ' ': { width: .36, strokes: [] },
};

interface PreparedStroke { d: string; length: number; points: Point[]; start: number; end: number }
interface PreparedLine { strokes: PreparedStroke[]; width: number }
function prepareLine(text: string, size: number): PreparedLine {
  const raw: Array<{ d: string; length: number; points: Point[] }> = [];
  let cursor = 0;
  for (const character of text) {
    const glyph = G[character] ?? G[' '];
    for (const source of glyph.strokes) {
      const points = source.map(([x, y]) => [cursor + x * size, y * size] as Point);
      let length = 0;
      for (let i = 1; i < points.length; i += 1) length += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
      const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
      raw.push({ d, length: Math.max(2, length), points });
    }
    cursor += (glyph.width + .16) * size;
  }
  const gap = size * .12;
  const total = raw.reduce((sum, stroke) => sum + stroke.length + gap, 0);
  let used = 0;
  const strokes = raw.map((stroke) => {
    const start = used / total;
    const end = (used + stroke.length) / total;
    used += stroke.length + gap;
    return { ...stroke, start, end };
  });
  return { strokes, width: cursor };
}

function pointOnStroke(points: Point[], progress: number): Point {
  const lengths = points.slice(1).map((point, index) => Math.hypot(point[0] - points[index][0], point[1] - points[index][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let target = total * clamp01(progress);
  for (let index = 0; index < lengths.length; index += 1) {
    if (target <= lengths[index]) {
      const p = target / Math.max(1, lengths[index]);
      return [mix(points[index][0], points[index + 1][0], p), mix(points[index][1], points[index + 1][1], p)];
    }
    target -= lengths[index];
  }
  return points[points.length - 1] ?? [0, 0];
}

const HandwrittenLine: React.FC<{
  text: string;
  frame: number;
  start: number;
  end: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
}> = ({ text, frame, start, end, x, y, size = 29, color = T.blueInk }) => {
  const prepared = useMemo(() => prepareLine(text, size), [text, size]);
  const lineProgress = progressAt(frame, start, end);
  let tip: Point | null = null;
  return (
    <g transform={`translate(${x} ${y})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {prepared.strokes.map((stroke, index) => {
        const strokeProgress = clamp01((lineProgress - stroke.start) / Math.max(.0001, stroke.end - stroke.start));
        if (strokeProgress > 0 && strokeProgress < 1) tip = pointOnStroke(stroke.points, strokeProgress);
        return <path key={index} d={stroke.d} stroke={color} strokeWidth={3.1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strokeProgress} />;
      })}
      {tip && lineProgress < 1 && <g transform={`translate(${tip[0]} ${tip[1]}) rotate(-38)`}><rect x={-5} y={-34} width={10} height={35} rx={4} fill={T.amber} stroke={T.ink} strokeWidth={2} /><path d="M -5 0 L 0 10 L 5 0 Z" fill={T.ink} /></g>}
    </g>
  );
};

const PaperRules: React.FC<{ x: number; y: number; width: number; height: number }> = ({ x, y, width, height }) => (
  <g>
    <rect x={x} y={y} width={width} height={height} rx={20} fill={T.paper} stroke={T.amber} strokeWidth={3} />
    {Array.from({ length: Math.floor(height / 54) }, (_, index) => y + 54 + index * 54).map((lineY) => <line key={lineY} x1={x} y1={lineY} x2={x + width} y2={lineY} stroke={T.rule} strokeWidth={1.4} opacity={.72} />)}
    <line x1={x + 34} y1={y} x2={x + 34} y2={y + height} stroke={T.margin} strokeWidth={2} />
  </g>
);

const Lift: React.FC<{ displacement: number }> = ({ displacement }) => {
  const y = 510 - displacement * 15;
  return <g><rect x={86} y={215} width={206} height={430} rx={14} fill="#071018" stroke={T.muted} strokeWidth={5} /><line x1={189} y1={185} x2={189} y2={y} stroke={T.amber} strokeWidth={5} /><circle cx={189} cy={191} r={24} fill={T.panel} stroke={T.amber} strokeWidth={6} /><rect x={115} y={y} width={148} height={105} rx={12} fill={T.ivory} stroke={T.teal} strokeWidth={6} /><path d={`M 189 ${y + 18} V ${y + 88}`} stroke={T.ink} strokeWidth={4} /><text x={189} y={y + 72} textAnchor="middle" fill={T.ink} fontFamily={T.mono} fontSize={28} fontWeight={950}>LIFT</text><line x1={314} y1={510} x2={314} y2={240} stroke={T.teal} strokeWidth={7} /><path d="M 314 228 L 299 253 H 329 Z" fill={T.teal} /><text x={340} y={270} fill={T.teal} fontFamily={T.mono} fontSize={28} fontWeight={900}>+ UP</text></g>;
};

// S01 ── Put the journey on the bench
const Scene01: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const journeyAt = cueAt(scene, 'journey');
  const positiveAt = cueAt(scene, 'positive');
  const gatesAt = cueAt(scene, 'key-times');
  const axesAt = cueAt(scene, 'axes-and-units');
  const gateCue = useCue(gatesAt, .35);
  const axesCue = useCue(axesAt, .35);
  const p: PlotSpec = { x: 45, y: 62, width: 480, height: 255, xMax: 14, yMin: -4, yMax: 5 };
  return <SceneShell scene={1} label="recipe bench">
    <Title kicker="drawing recipe">Put the journey on the bench</Title>
    <Cued at={journeyAt} fromX={-30} style={{ position: 'absolute', left: 72, top: 210, width: 490 }}>
      <WarmCard accent={T.amber} style={{ padding: 28, minHeight: 360 }}>
        <div style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 950, color: '#925000' }}>ROUTE CARD</div>
        {['MOVE AWAY', 'SLOW TO REST', 'WAIT', 'RETURN'].map((phase, index) => <div key={phase} style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, fontSize: 29, fontWeight: 850 }}><span style={{ width: 34, height: 34, borderRadius: 8, display: 'grid', placeItems: 'center', background: index === 3 ? T.coral : T.teal, color: T.ink, fontFamily: T.mono, fontWeight: 950 }}>{index + 1}</span>{phase}</div>)}
        <div style={{ marginTop: 27, paddingTop: 18, borderTop: `2px solid ${T.ink}22`, display: 'flex', alignItems: 'center', gap: 18 }}><div style={{ width: 68, height: 68, borderRadius: '50%', border: `6px solid ${T.amber}`, display: 'grid', placeItems: 'center', fontSize: 30 }}>◷</div><span style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}>PHASE TIMER</span></div>
      </WarmCard>
    </Cued>
    <Cued at={positiveAt} style={{ position: 'absolute', left: 100, top: 660 }}><WarmCard accent={T.teal} style={{ padding: '15px 24px' }}><DirectionArrow /></WarmCard></Cued>
    <div style={{ position: 'absolute', left: 620, top: 205, width: 1225, height: 650, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {(['displacement', 'velocity'] as const).map((kind, index) => <WarmCard key={kind} accent={index === 0 ? T.teal : T.cyan} style={{ padding: 18, position: 'relative' }}>
        <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>{kind === 'displacement' ? 'DISPLACEMENT–TIME' : 'VELOCITY–TIME'}</div>
        <svg width="560" height="405" viewBox="0 0 560 405" style={{ marginTop: 14 }}><PlotAxes plot={p} kind={kind} xTicks={[0, 4, 6, 9, 14]} yTicks={[-3, 0, 3]} />
          <g opacity={gateCue.opacity}>{[0,4,6,9].map((gate) => <g key={gate}><line x1={xFor(p, gate)} y1={p.y} x2={xFor(p, gate)} y2={p.y + p.height} stroke={T.amber} strokeWidth={5} opacity={.72} /><path d={`M ${xFor(p, gate) - 12} ${p.y - 5} H ${xFor(p, gate) + 12} L ${xFor(p, gate)} ${p.y + 14} Z`} fill={T.amber} /></g>)}</g>
        </svg>
        <div style={{ position: 'absolute', left: 30, right: 30, bottom: 24, display: 'flex', justifyContent: 'space-between', opacity: axesCue.opacity, fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}><span>{kind === 'displacement' ? 's / m' : 'v / (m s⁻¹)'}</span><span>t / s</span></div>
      </WarmCard>)}
    </div>
    <div style={{ position: 'absolute', left: 650, right: 95, top: 875, display: 'flex', gap: 12, opacity: gateCue.opacity }}>{['0 s','+4 s','+2 s','+3 s'].map((time, index) => <div key={time} style={{ flex: 1, height: 65, borderRadius: 14, border: `3px solid ${T.amber}`, background: T.panel, color: T.amber, display: 'grid', placeItems: 'center', fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>{time}{index > 0 ? `  →  ${[4,6,9][index - 1]} s` : ''}</div>)}</div>
  </SceneShell>;
};

// S02 ── Words become segments
const Scene02: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steadily = cueAt(scene, 'steadily') * fps;
  const slows = cueAt(scene, 'slows') * fps;
  const waits = cueAt(scene, 'waits') * fps;
  const returns = cueAt(scene, 'returns') * fps;
  const reveals = [progressAt(frame, steadily, steadily + 36), progressAt(frame, slows, slows + 36), progressAt(frame, waits, waits + 32), progressAt(frame, returns, returns + 44)];
  const plot: PlotSpec = { x: 100, y: 70, width: 1010, height: 470, xMax: 14, yMin: -4, yMax: 4 };
  const paths = velocitySegments(WORD_MODEL, plot);
  return <SceneShell scene={2} label="words to segments">
    <Title kicker="translation rig">Read verbs as drawing instructions</Title>
    <WarmCard accent={T.amber} style={{ position: 'absolute', left: 68, top: 205, width: 505, height: 735, padding: 24 }}>
      <div style={{ color: '#925000', fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>ORIGINAL SCENARIO</div>
      {[
        ['Moves away steadily', 'for 4 s.'],
        ['Slows uniformly to rest', 'in 2 s.'],
        ['Waits', 'for 3 s.'],
        ['Returns', 'at constant speed.'],
      ].map(([verb, rest], index) => <div key={verb} style={{ marginTop: 22, padding: '16px 18px', borderRadius: 15, borderLeft: `9px solid ${index === 3 ? T.coral : T.teal}`, background: reveals[index] > 0 ? `${index === 3 ? T.coral : T.teal}24` : '#1023320b', transform: `translateX(${(1 - reveals[index]) * -5}px)` }}><div style={{ fontSize: 31, lineHeight: 1.2, fontWeight: 930, color: reveals[index] > 0 ? (index === 3 ? '#a8322c' : '#126c59') : T.ink }}>{verb}</div><div style={{ fontSize: 28, marginTop: 5 }}>{rest}</div></div>)}
      <div style={{ marginTop: 18, color: T.ink, fontSize: 28, fontWeight: 850 }}>Away from start = positive</div>
    </WarmCard>
    <div style={{ position: 'absolute', left: 620, top: 198, width: 1220, height: 715, borderRadius: 25, background: T.ivory, border: `3px solid ${T.cyan}` }}>
      <svg width="1220" height="680" viewBox="0 0 1220 680"><PlotAxes plot={plot} kind="velocity" xTicks={[0,4,6,9,14]} yTicks={[-3,0,3]} />
        {paths.map((d, index) => <Trace key={d} d={d} progress={reveals[index]} color={index === 3 ? T.coral : index === 2 ? T.amber : T.teal} width={10} />)}
        <line x1={xFor(plot,9)} y1={yFor(plot,0)} x2={xFor(plot,9)} y2={yFor(plot,-3)} stroke={T.coral} strokeWidth={6} strokeDasharray="11 9" opacity={reveals[3]} />
        {[0,4,6,9].map((gate) => <g key={gate}><line x1={xFor(plot,gate)} y1={plot.y} x2={xFor(plot,gate)} y2={plot.y + plot.height} stroke={T.amber} strokeWidth={3} strokeDasharray="8 9" opacity={.55} /><rect x={xFor(plot,gate)-30} y={plot.y+plot.height+55} width={60} height={42} rx={9} fill={T.ink} /><text x={xFor(plot,gate)} y={plot.y+plot.height+85} textAnchor="middle" fill={T.amber} fontFamily={T.mono} fontSize={28} fontWeight={950}>{gate}</text></g>)}
        <g opacity={reveals[3]}><text x={xFor(plot,13.7)} y={yFor(plot,-3)-18} textAnchor="end" fill="#ad342d" fontFamily={T.mono} fontSize={28} fontWeight={950}>−u</text></g>
      </svg>
    </div>
  </SceneShell>;
};

const AreaRegions: React.FC<{ model: MotionModel; plot: PlotSpec; positiveOpacity?: number; negativeOpacity?: number }> = ({ model, plot, positiveOpacity = 1, negativeOpacity = 1 }) => {
  const zero = yFor(plot, 0);
  return <g>
    {model.phases.map((phase, index) => {
      const endV = phase.velocity + (phase.acceleration ?? 0) * (phase.end - phase.start);
      const points = `${xFor(plot,phase.start)},${zero} ${xFor(plot,phase.start)},${yFor(plot,phase.velocity)} ${xFor(plot,phase.end)},${yFor(plot,endV)} ${xFor(plot,phase.end)},${zero}`;
      const negative = phase.velocity < 0 || endV < 0;
      return <polygon key={index} points={points} fill={negative ? T.coral : T.teal} opacity={(negative ? negativeOpacity : positiveOpacity) * .38} stroke={negative ? T.coral : T.teal} strokeWidth={2} />;
    })}
  </g>;
};

// S03 ── The gradient-area bridge
const Scene03: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const gradientAt = cueAt(scene, 'gradient');
  const instantAt = cueAt(scene, 'same-instant');
  const areasAt = cueAt(scene, 'signed-areas');
  const bridgeAt = cueAt(scene, 'bridge');
  const gradientCue = useCue(gradientAt, .35);
  const instantCue = useCue(instantAt, .35);
  const areaCue = useCue(areasAt, .35);
  const bridgeCue = useCue(bridgeAt, .42);
  const t = interpolate(seconds, [instantAt, Math.max(instantAt + .5, bridgeAt - .5)], [0, 14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const state = stateAt(WORD_MODEL, t);
  const sPlot: PlotSpec = { x: 62, y: 75, width: 665, height: 360, xMax: 14, yMin: 0, yMax: 17 };
  const vPlot: PlotSpec = { x: 62, y: 75, width: 665, height: 360, xMax: 14, yMin: -4, yMax: 4 };
  const tangentDt = .8;
  const leftS = state.displacement - state.velocity * tangentDt;
  const rightS = state.displacement + state.velocity * tangentDt;
  return <SceneShell scene={3} label="gradient-area bridge">
    <Title kicker="paired instruments">One time scale links both graphs</Title>
    <div style={{ position: 'absolute', left: 60, top: 205, width: 790, height: 585, borderRadius: 24, background: T.ivory, border: `3px solid ${T.teal}` }}><div style={{ margin: '18px 28px 0', fontFamily: T.mono, fontSize: 28, fontWeight: 950, color: '#14745f' }}>DISPLACEMENT–TIME</div><svg width="790" height="510"><PlotAxes plot={sPlot} kind="displacement" xTicks={[0,4,6,9,14]} yTicks={[0,3,15]} /><Trace d={sampledPath(WORD_MODEL,sPlot,'displacement')} color={T.teal} width={8} />
      <g opacity={gradientCue.opacity}><line x1={xFor(sPlot,Math.max(0,t-tangentDt))} y1={yFor(sPlot,leftS)} x2={xFor(sPlot,Math.min(14,t+tangentDt))} y2={yFor(sPlot,rightS)} stroke={T.amber} strokeWidth={7} /><path d={`M ${xFor(sPlot,1)} ${yFor(sPlot,3)} H ${xFor(sPlot,3)} V ${yFor(sPlot,9)}`} fill="none" stroke={T.amber} strokeWidth={5} /><text x={xFor(sPlot,2)} y={yFor(sPlot,3)-14} textAnchor="middle" fill={T.ink} fontFamily={T.mono} fontSize={28}>Δt</text><text x={xFor(sPlot,3)+16} y={(yFor(sPlot,3)+yFor(sPlot,9))/2} fill={T.ink} fontFamily={T.mono} fontSize={28}>Δs</text></g>
      <line x1={xFor(sPlot,t)} y1={sPlot.y} x2={xFor(sPlot,t)} y2={sPlot.y+sPlot.height} stroke={T.purple} strokeWidth={5} strokeDasharray="10 8" opacity={instantCue.opacity} /><circle cx={xFor(sPlot,t)} cy={yFor(sPlot,state.displacement)} r={10} fill={T.purple} opacity={instantCue.opacity} />
    </svg></div>
    <div style={{ position: 'absolute', right: 60, top: 205, width: 790, height: 585, borderRadius: 24, background: T.ivory, border: `3px solid ${T.cyan}` }}><div style={{ margin: '18px 28px 0', fontFamily: T.mono, fontSize: 28, fontWeight: 950, color: '#087782' }}>VELOCITY–TIME</div><svg width="790" height="510"><PlotAxes plot={vPlot} kind="velocity" xTicks={[0,4,6,9,14]} yTicks={[-3,0,3]} /><AreaRegions model={WORD_MODEL} plot={vPlot} positiveOpacity={areaCue.opacity} negativeOpacity={areaCue.opacity} />{velocitySegments(WORD_MODEL,vPlot).map((d,index)=><Trace key={d} d={d} color={index===3?T.coral:T.cyan} width={8} />)}<line x1={xFor(vPlot,9)} y1={yFor(vPlot,0)} x2={xFor(vPlot,9)} y2={yFor(vPlot,-3)} stroke={T.coral} strokeWidth={5} strokeDasharray="9 8" />
      <line x1={xFor(vPlot,t)} y1={vPlot.y} x2={xFor(vPlot,t)} y2={vPlot.y+vPlot.height} stroke={T.purple} strokeWidth={5} strokeDasharray="10 8" opacity={instantCue.opacity} /><circle cx={xFor(vPlot,t)} cy={yFor(vPlot,state.velocity)} r={10} fill={T.purple} opacity={instantCue.opacity} /></svg></div>
    <div style={{ position: 'absolute', left: 810, top: 425, width: 300, textAlign: 'center', pointerEvents: 'none' }}><div style={{ opacity: gradientCue.opacity, color: T.amber, fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>GRADIENT → VELOCITY</div><div style={{ margin: '18px 0', height: 5, background: `linear-gradient(90deg, ${T.amber}, ${T.cyan})` }} /><div style={{ opacity: areaCue.opacity, color: T.teal, fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>AREA → Δs</div><div style={{ marginTop: 18, height: 5, opacity: areaCue.opacity, background: `linear-gradient(90deg, ${T.coral}, ${T.teal})` }} /></div>
    <Cued at={bridgeAt} fromY={28} style={{ position: 'absolute', left: 150, right: 150, top: 814 }}><WarmCard accent={T.amber} style={{ height: 145, padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 24 }}><div style={{ width: 100, height: 100, border: `5px solid ${T.teal}`, borderRadius: 14, display: 'grid', placeItems: 'center', fontSize: 44, fontWeight: 950 }}>↥</div><div style={{ flex: 1 }}><div style={{ color: '#925000', fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>LIFT REFERENCE · UPWARDS POSITIVE · STARTS FROM REST</div><div style={{ marginTop: 10, fontSize: 29, fontWeight: 850 }}>a = 1.5 m s⁻² for 2 s  ·  constant v for 4 s  ·  slows to rest in 2 s</div></div><div style={{ color: T.teal, fontFamily: T.mono, fontSize: 31, fontWeight: 950, opacity: bridgeCue.opacity }}>BUILD BOTH →</div></WarmCard></Cued>
  </SceneShell>;
};

const S04_HOLDS = [[300,360],[600,660],[840,900],[1110,1170],[1350,1410],[1590,1650],[1860,1920],[2160,2220]] as const;
const S04_LINES = [
  'v = 0 + 1.5 × 2 = 3 m s⁻¹',
  't = 2 + 4 = 6 s',
  't = 6 + 2 = 8 s',
  's₁ = ½ × 2 × 3 = 3 m',
  's₂ = 4 × 3 = 12 m',
  's(6) = 3 + 12 = 15 m',
  's₃ = ½ × 2 × 3 = 3 m',
  's = 3 + 12 + 3 = 18 m',
] as const;
const S04_WRITES = [[24,205],[375,515],[670,770],[930,1025],[1180,1280],[1420,1515],[1660,1765],[1950,2060]] as const;

const StaticPaperRing: React.FC<{ active: boolean; x: number; y: number; width?: number; color?: string }> = ({ active, x, y, width = 130, color = T.amber }) => active ? <ellipse cx={x} cy={y} rx={width / 2} ry={28} fill="none" stroke={color} strokeWidth={6} /> : null;

// S04 ── Worked build: lift in a shaft
const Scene04: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const rawFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = freezeDuring(rawFrame, S04_HOLDS);
  const writeStarts = [cueAt(scene,'speed')*fps,375,670,cueAt(scene,'triangle')*fps,1180,1420,1660,cueAt(scene,'finish')*fps];
  const velocityTimes = [
    2 * progressAt(frame, 210, 285),
    2 + 4 * progressAt(frame, 520, 585),
    6 + 2 * progressAt(frame, 780, 830),
  ];
  const liftTime = frame < 520 ? velocityTimes[0] : frame < 780 ? velocityTimes[1] : velocityTimes[2];
  const liftState = stateAt(LIFT_MODEL, liftTime);
  const displacementUntil = frame < 1040 ? 0
    : frame < 1520 ? 2 * progressAt(frame, 1040, 1095)
      : frame < 2070 ? 2 + 4 * progressAt(frame, 1520, 1580)
        : 6 + 2 * progressAt(frame, 2070, 2145);
  const vPlot: PlotSpec = { x: 410, y: 54, width: 540, height: 245, xMax: 8, yMin: 0, yMax: 4 };
  const sPlot: PlotSpec = { x: 410, y: 440, width: 540, height: 245, xMax: 8, yMin: 0, yMax: 20 };
  const vPaths = velocitySegments(LIFT_MODEL, vPlot);
  const activeHold = S04_HOLDS.findIndex(([start,end]) => rawFrame >= start && rawFrame < end);
  const paperX = 1060;
  const lineY = (index: number) => 83 + index * 88;
  const ringX = [1535,1435,1435,1510,1460,1500,1510,1500];
  return <SceneShell scene={4} label="worked lift" displayFrame={frame}>
    <Title kicker="slow build · pen pace">Build the lift graphs one result at a time</Title>
    <WarmCard accent={T.amber} style={{ position: 'absolute', left: 55, top: 192, width: 320, height: 168, padding: '17px 20px', zIndex: 4 }}>
      <div style={{ color: '#925000', fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>PRINTED GIVENS</div>
      <div style={{ fontSize: 28, lineHeight: 1.35, fontWeight: 830, marginTop: 8 }}>↑ positive · u = 0<br />a = 1.5 m s⁻² for 2 s<br />cruise 4 s · brake 2 s</div>
    </WarmCard>
    <svg width="1920" height="790" viewBox="0 0 1920 790" style={{ position: 'absolute', left: 0, top: 192 }}>
      <Lift displacement={liftState.displacement} />
      <rect x={370} y={14} width={620} height={342} rx={18} fill={T.ivory} stroke={T.teal} strokeWidth={3} />
      <rect x={370} y={400} width={620} height={342} rx={18} fill={T.ivory} stroke={T.cyan} strokeWidth={3} />
      <PlotAxes plot={vPlot} kind="velocity" xTicks={[0,2,6,8]} yTicks={[0,3]} compact />
      <polygon points={`${xFor(vPlot,0)},${yFor(vPlot,0)} ${xFor(vPlot,2)},${yFor(vPlot,3)} ${xFor(vPlot,2)},${yFor(vPlot,0)}`} fill={T.teal} opacity={.32 * progressAt(frame,1025,1095)} />
      <polygon points={`${xFor(vPlot,2)},${yFor(vPlot,0)} ${xFor(vPlot,2)},${yFor(vPlot,3)} ${xFor(vPlot,6)},${yFor(vPlot,3)} ${xFor(vPlot,6)},${yFor(vPlot,0)}`} fill={T.teal} opacity={.32 * progressAt(frame,1285,1340)} />
      <polygon points={`${xFor(vPlot,6)},${yFor(vPlot,0)} ${xFor(vPlot,6)},${yFor(vPlot,3)} ${xFor(vPlot,8)},${yFor(vPlot,0)}`} fill={T.teal} opacity={.32 * progressAt(frame,1770,1850)} />
      <Trace d={vPaths[0]} progress={progressAt(frame,210,285)} color={T.teal} width={9} />
      <Trace d={vPaths[1]} progress={progressAt(frame,520,585)} color={T.teal} width={9} />
      <Trace d={vPaths[2]} progress={progressAt(frame,780,830)} color={T.teal} width={9} />
      <PlotAxes plot={sPlot} kind="displacement" xTicks={[0,2,6,8]} yTicks={[0,3,15,18]} compact />
      {frame >= 1040 && <Trace d={sampledPath(LIFT_MODEL,sPlot,'displacement',displacementUntil)} color={T.cyan} width={9} />}
      <circle cx={xFor(vPlot,liftTime)} cy={yFor(vPlot,liftState.velocity)} r={9} fill={T.amber} />
      <circle cx={xFor(sPlot,Math.min(displacementUntil,8))} cy={yFor(sPlot,stateAt(LIFT_MODEL,Math.min(displacementUntil,8)).displacement)} r={9} fill={T.amber} opacity={frame >= 1040 ? 1 : 0} />
      <g opacity={activeHold === 0 ? 1 : 0}><ellipse cx={xFor(vPlot,2)} cy={yFor(vPlot,3)} rx={30} ry={25} fill="none" stroke={T.amber} strokeWidth={6} /></g>
      <g opacity={activeHold === 1 ? 1 : 0}><ellipse cx={xFor(vPlot,6)} cy={vPlot.y+vPlot.height+28} rx={30} ry={23} fill="none" stroke={T.amber} strokeWidth={6} /></g>
      <g opacity={activeHold === 2 ? 1 : 0}><ellipse cx={xFor(vPlot,8)} cy={yFor(vPlot,0)} rx={28} ry={24} fill="none" stroke={T.amber} strokeWidth={6} /></g>
      <g opacity={activeHold === 5 ? 1 : 0}><ellipse cx={xFor(sPlot,6)} cy={yFor(sPlot,15)} rx={31} ry={25} fill="none" stroke={T.amber} strokeWidth={6} /></g>
      <g opacity={activeHold === 7 ? 1 : 0}><ellipse cx={xFor(sPlot,8)} cy={yFor(sPlot,18)} rx={31} ry={25} fill="none" stroke={T.amber} strokeWidth={6} /><line x1={xFor(sPlot,7.5)} y1={yFor(sPlot,18)} x2={xFor(sPlot,8)} y2={yFor(sPlot,18)} stroke={T.amber} strokeWidth={5} /></g>
      <PaperRules x={paperX} y={18} width={790} height={735} />
      <text x={paperX+58} y={58} fill="#925000" fontFamily={T.mono} fontSize={28} fontWeight={950}>LIFT CALCULATION PAGE · KEEP EVERY LINE</text>
      {S04_LINES.map((line,index) => <HandwrittenLine key={line} text={line} frame={frame} start={writeStarts[index]} end={S04_WRITES[index][1]} x={paperX+58} y={lineY(index)} size={index === 0 ? 28 : 29} />)}
      {S04_HOLDS.map((hold,index) => <StaticPaperRing key={hold[0]} active={activeHold === index} x={ringX[index]} y={lineY(index)+15} width={index === 0 ? 185 : index === 4 || index === 5 || index === 7 ? 130 : 112} />)}
    </svg>
  </SceneShell>;
};

// S05 ── One journey, both graphs
const Scene05: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const positive = cueAt(scene,'positive-velocity');
  const zero = cueAt(scene,'zero-velocity');
  const negative = cueAt(scene,'negative-velocity');
  const start = cueAt(scene,'reaches-the-start');
  const seconds = frame / fps;
  const t = interpolate(seconds,[positive,zero,negative,start],[.5,7,10,14],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const state = stateAt(WORD_MODEL,t);
  const sPlot: PlotSpec = { x: 85, y: 65, width: 720, height: 430, xMax: 14, yMin: 0, yMax: 17 };
  const vPlot: PlotSpec = { x: 85, y: 65, width: 720, height: 430, xMax: 14, yMin: -4, yMax: 4 };
  const sReveal = t / 14;
  const vPaths = velocitySegments(WORD_MODEL,vPlot);
  const tangentSpan = .8;
  const tangentLeft = stateAt(WORD_MODEL,Math.max(0,t-tangentSpan));
  const tangentRight = stateAt(WORD_MODEL,Math.min(14,t+tangentSpan));
  return <SceneShell scene={5} label="one journey · two graphs">
    <Title kicker="linked traces">Velocity sign controls displacement shape</Title>
    <div style={{ position:'absolute',left:55,top:205,width:860,height:610,borderRadius:24,background:T.ivory,border:`3px solid ${T.teal}` }}><div style={{margin:'17px 28px',fontFamily:T.mono,fontSize:28,fontWeight:950,color:'#14745f'}}>DISPLACEMENT–TIME · CONTINUOUS</div><svg width="860" height="540"><PlotAxes plot={sPlot} kind="displacement" xTicks={[0,4,6,9,14]} yTicks={[0,15]} /><Trace d={sampledPath(WORD_MODEL,sPlot,'displacement')} progress={sReveal} color={T.teal} width={9}/><line x1={xFor(sPlot,tangentLeft.t)} y1={yFor(sPlot,tangentLeft.displacement)} x2={xFor(sPlot,tangentRight.t)} y2={yFor(sPlot,tangentRight.displacement)} stroke={state.velocity<0?T.coral:T.amber} strokeWidth={7}/><line x1={xFor(sPlot,t)} y1={sPlot.y} x2={xFor(sPlot,t)} y2={sPlot.y+sPlot.height} stroke={T.purple} strokeWidth={5} strokeDasharray="9 8"/><circle cx={xFor(sPlot,t)} cy={yFor(sPlot,state.displacement)} r={11} fill={T.purple}/></svg></div>
    <div style={{ position:'absolute',right:55,top:205,width:860,height:610,borderRadius:24,background:T.ivory,border:`3px solid ${T.cyan}` }}><div style={{margin:'17px 28px',fontFamily:T.mono,fontSize:28,fontWeight:950,color:'#087782'}}>VELOCITY–TIME · SIGNED</div><svg width="860" height="540"><PlotAxes plot={vPlot} kind="velocity" xTicks={[0,4,6,9,14]} yTicks={[-3,0,3]} /><AreaRegions model={WORD_MODEL} plot={vPlot} positiveOpacity={useCue(positive,.3).opacity} negativeOpacity={useCue(negative,.3).opacity}/>{vPaths.map((d,index)=><Trace key={d} d={d} color={index===3?T.coral:index===2?T.amber:T.cyan} width={9} opacity={t>=WORD_MODEL.phases[index].start?1:.15}/>)}<line x1={xFor(vPlot,9)} y1={yFor(vPlot,0)} x2={xFor(vPlot,9)} y2={yFor(vPlot,-3)} stroke={T.coral} strokeWidth={6} strokeDasharray="10 8"/><line x1={xFor(vPlot,t)} y1={vPlot.y} x2={xFor(vPlot,t)} y2={vPlot.y+vPlot.height} stroke={T.purple} strokeWidth={5} strokeDasharray="9 8"/><circle cx={xFor(vPlot,t)} cy={yFor(vPlot,state.velocity)} r={11} fill={T.purple}/><text x={xFor(vPlot,9)+14} y={yFor(vPlot,-1.5)} fill="#ad342d" fontFamily={T.mono} fontSize={28} fontWeight={950}>IDEALISED JUMP</text></svg></div>
    <div style={{position:'absolute',left:180,right:180,top:850,height:105,display:'flex',alignItems:'center',gap:18}}><div style={{flex:1,height:5,background:T.teal}}/><div style={{padding:'16px 24px',borderRadius:16,border:`3px solid ${state.displacement<.2?T.green:T.amber}`,background:T.panel,color:state.displacement<.2?T.green:T.text,fontFamily:T.mono,fontSize:28,fontWeight:950}}>RETURN LEG KEPT · s = {state.displacement.toFixed(1)} m</div><div style={{flex:1,height:5,background:T.coral}}/></div>
  </SceneShell>;
};

const S06_HOLDS = [[690,750],[1110,1170],[1410,1470],[1710,1770]] as const;
const S06_LINES = [
  'v = 14.7 − 9.8t',
  '0 = 14.7 − 9.8t',
  't = 1.5 s',
  'h = ½ × 1.5 × 14.7 = 11.025 m',
  't = 2 × 1.5 = 3 s',
  'v(3) = −14.7 m s⁻¹',
] as const;
const S06_WRITES = [[45,285],[410,525],[535,635],[770,950],[1190,1340],[1480,1650]] as const;

const BallRig: React.FC<{ displacement: number; velocity: number }> = ({ displacement, velocity }) => {
  const y = 626 - displacement * 27;
  return <g><rect x={62} y={47} width={265} height={640} rx={20} fill="#071018" stroke={T.muted} strokeWidth={4}/>{Array.from({length:13},(_,i)=>i).map(i=><g key={i}><line x1={82} y1={626-i*43} x2={112} y2={626-i*43} stroke={T.cyan} strokeWidth={3}/>{i%2===0&&<text x={121} y={635-i*43} fill={T.muted} fontFamily={T.mono} fontSize={28}>{i*2}</text>}</g>)}<line x1={92} y1={626} x2={92} y2={82} stroke={T.teal} strokeWidth={7}/><path d="M 92 68 L 77 94 H 107 Z" fill={T.teal}/><circle cx={235} cy={y} r={29} fill={T.ivory} stroke={velocity<0?T.coral:T.amber} strokeWidth={7}/><line x1={274} y1={y} x2={274} y2={y-(velocity/14.7)*85} stroke={velocity<0?T.coral:T.teal} strokeWidth={7}/><path d={velocity>=0?`M 274 ${y-(velocity/14.7)*85-14} l -12 22 h 24 Z`:`M 274 ${y-(velocity/14.7)*85+14} l -12 -22 h 24 Z`} fill={velocity<0?T.coral:T.teal}/><text x={55} y={708} fill={T.teal} fontFamily={T.mono} fontSize={28} fontWeight={950}>UPWARDS POSITIVE</text></g>;
};

// S06 ── Why it matters: ball and examiner sign check
const Scene06: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const rawFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = freezeDuring(rawFrame,S06_HOLDS);
  const straightFrame = cueAt(scene,'straight')*fps;
  const directionFrame = cueAt(scene,'direction-change')*fps;
  const signedFrame = cueAt(scene,'signed-areas')*fps;
  const ballTime = frame < 1200 ? 1.5*progressAt(frame,330,650) : 1.5+1.5*progressAt(frame,1200,1395);
  const ball = stateAt(BALL_MODEL,ballTime);
  const displacementUntil = frame < 970 ? 0 : frame < 1290 ? 1.5*progressAt(frame,970,1090) : 1.5+1.5*progressAt(frame,1290,1395);
  const vPlot: PlotSpec = {x:430,y:50,width:650,height:280,xMax:3,yMin:-16,yMax:16};
  const sPlot: PlotSpec = {x:430,y:430,width:650,height:250,xMax:3,yMin:0,yMax:12};
  const paperX=1150;
  const lineY=(i:number)=>104+i*76;
  const activeHold=S06_HOLDS.findIndex(([start,end])=>rawFrame>=start&&rawFrame<end);
  const traceUntil = frame < 1180 ? 1.5*progressAt(frame,330,630) : 1.5+1.5*progressAt(frame,1180,1390);
  const inspectionTrace=progressAt(frame,1770,1900);
  return <SceneShell scene={6} label="ball sign check" displayFrame={frame}>
    <Title kicker="slow examiner check">Turning does not break either graph</Title>
    <svg width="1920" height="790" viewBox="0 0 1920 790" style={{position:'absolute',top:190,left:0}}>
      <BallRig displacement={ball.displacement} velocity={ball.velocity}/>
      <rect x={390} y={12} width={730} height={350} rx={18} fill={T.ivory} stroke={T.cyan} strokeWidth={3}/>
      <rect x={390} y={392} width={730} height={322} rx={18} fill={T.ivory} stroke={T.teal} strokeWidth={3}/>
      <PlotAxes plot={vPlot} kind="velocity" xTicks={[0,1.5,3]} yTicks={[-14.7,0,14.7]} compact/>
      <polygon points={`${xFor(vPlot,0)},${yFor(vPlot,0)} ${xFor(vPlot,0)},${yFor(vPlot,14.7)} ${xFor(vPlot,1.5)},${yFor(vPlot,0)}`} fill={T.teal} opacity={.34*progressAt(frame,950,1060)}/>
      <polygon points={`${xFor(vPlot,1.5)},${yFor(vPlot,0)} ${xFor(vPlot,3)},${yFor(vPlot,-14.7)} ${xFor(vPlot,3)},${yFor(vPlot,0)}`} fill={T.coral} opacity={.36*progressAt(frame,1210,1380)}/>
      <Trace d={`M ${xFor(vPlot,0)} ${yFor(vPlot,14.7)} L ${xFor(vPlot,Math.min(1.5,traceUntil))} ${yFor(vPlot,stateAt(BALL_MODEL,Math.min(1.5,traceUntil)).velocity)}`} color={T.cyan} width={9}/>
      {traceUntil>1.5&&<Trace d={`M ${xFor(vPlot,1.5)} ${yFor(vPlot,0)} L ${xFor(vPlot,traceUntil)} ${yFor(vPlot,stateAt(BALL_MODEL,traceUntil).velocity)}`} color={T.coral} width={9}/>} 
      <circle cx={xFor(vPlot,ballTime)} cy={yFor(vPlot,ball.velocity)} r={10} fill={T.amber}/>
      <PlotAxes plot={sPlot} kind="displacement" xTicks={[0,1.5,3]} yTicks={frame >= 970 ? [0,11.025] : [0]} compact/>
      {frame>=970&&<Trace d={sampledPath(BALL_MODEL,sPlot,'displacement',displacementUntil)} color={T.teal} width={9}/>} 
      {frame>=directionFrame&&<line x1={xFor(sPlot,1.16)} y1={yFor(sPlot,11.025)} x2={xFor(sPlot,1.84)} y2={yFor(sPlot,11.025)} stroke={T.amber} strokeWidth={7}/>} 
      {frame>=1650&&<text x={xFor(vPlot,3)-10} y={yFor(vPlot,-14.7)-15} textAnchor="end" fill="#ad342d" fontFamily={T.mono} fontSize={28} fontWeight={950}>(3, −14.7)</text>}
      {activeHold===0&&<g><ellipse cx={xFor(vPlot,1.5)} cy={yFor(vPlot,0)} rx={32} ry={26} fill="none" stroke={T.amber} strokeWidth={6}/><ellipse cx={xFor(sPlot,1.5)} cy={sPlot.y+sPlot.height+28} rx={38} ry={23} fill="none" stroke={T.amber} strokeWidth={6}/></g>}
      {activeHold===1&&<ellipse cx={xFor(sPlot,1.5)} cy={yFor(sPlot,11.025)} rx={40} ry={29} fill="none" stroke={T.amber} strokeWidth={6}/>} 
      {activeHold===2&&<g><ellipse cx={xFor(sPlot,3)} cy={yFor(sPlot,0)} rx={32} ry={25} fill="none" stroke={T.amber} strokeWidth={6}/><ellipse cx={xFor(vPlot,3)} cy={vPlot.y+vPlot.height+28} rx={38} ry={23} fill="none" stroke={T.amber} strokeWidth={6}/></g>}
      {activeHold===3&&<ellipse cx={xFor(vPlot,3)} cy={yFor(vPlot,-14.7)} rx={42} ry={30} fill="none" stroke={T.amber} strokeWidth={6}/>} 
      {frame>=1770&&<g opacity={inspectionTrace}><Trace d={sampledPath(BALL_MODEL,sPlot,'displacement')} color={T.amber} width={4}/><circle cx={xFor(vPlot,1.5)} cy={yFor(vPlot,0)} r={18} fill="none" stroke={T.amber} strokeWidth={5}/><rect x={vPlot.x} y={yFor(vPlot,0)} width={vPlot.width} height={Math.max(0,yFor(vPlot,-14.7)-yFor(vPlot,0))} fill="none" stroke={T.coral} strokeWidth={4}/></g>}
      <PaperRules x={paperX} y={20} width={700} height={550}/>
      <text x={paperX+48} y={64} fill="#925000" fontFamily={T.mono} fontSize={28} fontWeight={950}>BALL WORKING · g = 9.8 m s⁻²</text>
      {S06_LINES.map((line,index)=><HandwrittenLine key={line} text={line} frame={frame} start={S06_WRITES[index][0]} end={S06_WRITES[index][1]} x={paperX+48} y={lineY(index)} size={28}/>)}
      <StaticPaperRing active={activeHold===0} x={paperX+350} y={lineY(2)+15} width={150}/>
      <StaticPaperRing active={activeHold===1} x={paperX+530} y={lineY(3)+14} width={190}/>
      <StaticPaperRing active={activeHold===2} x={paperX+460} y={lineY(4)+14} width={130}/>
      <StaticPaperRing active={activeHold===3} x={paperX+500} y={lineY(5)+14} width={205}/>
      <rect x={80} y={714} width={1770} height={60} rx={16} fill={T.panel} stroke={T.cyan} strokeWidth={3}/>
      {[
        ['CONTINUITY',straightFrame,T.cyan,250],
        ['TANGENT',directionFrame,T.amber,790],
        ['SIGNED AREA',signedFrame,T.teal,1240],
      ].map(([label,at,color,x])=><g key={String(label)}><circle cx={Number(x)} cy={744} r={11} fill={frame>=Number(at)?String(color):T.muted}/><text x={Number(x)+25} y={754} fill={frame>=Number(at)?String(color):T.muted} fontFamily={T.mono} fontSize={28} fontWeight={950}>{label}</text></g>)}
    </svg>
    <WarmCard accent={T.teal} style={{position:'absolute',left:70,top:195,width:285,padding:'14px 17px'}}><div style={{fontFamily:T.mono,fontSize:28,fontWeight:950,color:'#14745f'}}>REFERENCE INPUTS</div><div style={{fontSize:28,fontWeight:830,marginTop:7}}>u = 14.7 m s⁻¹<br/>no air resistance</div></WarmCard>
  </SceneShell>;
};

// S07 ── Sketch versus accurate plot
const Scene07: React.FC<{scene:TranscriptScene}> = ({scene}) => {
  const sketch=cueAt(scene,'sketch');
  const accurate=cueAt(scene,'accurate-plot');
  const axes=cueAt(scene,'labelled-axes');
  const negative=cueAt(scene,'negative-region');
  const sketchCue=useCue(sketch,.35);
  const accurateCue=useCue(accurate,.35);
  const axesCue=useCue(axes,.35);
  const negativeCue=useCue(negative,.32);
  const left:PlotSpec={x:70,y:85,width:660,height:400,xMax:14,yMin:-4,yMax:4};
  const right:PlotSpec={x:70,y:85,width:660,height:400,xMax:14,yMin:-4,yMax:4};
  return <SceneShell scene={7} label="final inspection"><Title kicker="sketch or plot">Inspect shape first, then measurement</Title>
    <div style={{position:'absolute',left:70,top:210,width:820,height:610,borderRadius:25,background:T.ivory,border:`3px solid ${T.amber}`,opacity:sketchCue.opacity}}><div style={{margin:'22px 30px',fontFamily:T.mono,fontSize:30,fontWeight:950,color:'#925000'}}>LOOSE SKETCH · SHAPE / SIGN / ORDER</div><svg width="820" height="520"><PlotAxes plot={left} kind="velocity" xTicks={[0,4,6,9,14]} yTicks={[-3,0,3]} showGrid={false}/>{velocitySegments(WORD_MODEL,left).map((d,i)=><Trace key={d} d={d} color={i===3?T.coral:T.teal} width={9} opacity={i===3?negativeCue.opacity:1}/>)}<line x1={xFor(left,9)} y1={yFor(left,0)} x2={xFor(left,9)} y2={yFor(left,-3)} stroke={T.coral} strokeWidth={5} strokeDasharray="10 8" opacity={negativeCue.opacity}/></svg></div>
    <div style={{position:'absolute',right:70,top:210,width:820,height:610,borderRadius:25,background:T.ivory,border:`3px solid ${T.cyan}`,opacity:accurateCue.opacity}}><div style={{margin:'22px 30px',fontFamily:T.mono,fontSize:30,fontWeight:950,color:'#087782'}}>ACCURATE PLOT · COORDINATES / SCALE</div><svg width="820" height="520"><PlotAxes plot={right} kind="velocity" xTicks={[0,4,6,9,14]} yTicks={[-3,0,3]}/>{velocitySegments(WORD_MODEL,right).map((d,i)=><Trace key={d} d={d} color={i===3?T.coral:T.cyan} width={9}/>)}<line x1={xFor(right,9)} y1={yFor(right,0)} x2={xFor(right,9)} y2={yFor(right,-3)} stroke={T.coral} strokeWidth={5} strokeDasharray="10 8"/>{[[0,3],[4,3],[6,0],[9,0],[14,-3]].map(([t,v])=><g key={t} opacity={axesCue.opacity}><circle cx={xFor(right,t)} cy={yFor(right,v)} r={9} fill={T.amber}/><text x={xFor(right,t)+(t === 14 ? -10 : 10)} y={yFor(right,v)-13} textAnchor={t === 14 ? 'end' : 'start'} fill={T.ink} fontFamily={T.mono} fontSize={28}>{t === 14 ? '(T,−u)' : `(${t},${v})`}</text></g>)}</svg></div>
    <div style={{position:'absolute',left:150,right:150,top:855,height:95,display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12,opacity:axesCue.opacity}}>{['AXES','UNITS','KEY TIMES','KEY VALUES','PHASE ORDER','CURVE / LINE'].map((item,index)=><div key={item} style={{borderRadius:14,border:`3px solid ${index===5?T.amber:T.green}`,background:T.panel,color:index===5?T.amber:T.green,display:'grid',placeItems:'center',fontFamily:T.mono,fontSize:28,fontWeight:950}}>✓ {item}</div>)}</div>
  </SceneShell>;
};

// S08 ── Twenty-second recap
const Scene08:React.FC<{scene:TranscriptScene}>=({scene})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const seconds=frame/fps;
  const gates=cueAt(scene,'key-times');
  const gradient=cueAt(scene,'gradient');
  const area=cueAt(scene,'signed-area');
  const check=cueAt(scene,'shape-check');
  const gatesCue=useCue(gates,.3);
  const gradientCue=useCue(gradient,.3);
  const areaCue=useCue(area,.3);
  const checkCue=useCue(check,.35);
  const t=interpolate(seconds,[.6,Math.max(.8,check)],[0,14],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const state=stateAt(WORD_MODEL,t);
  const sPlot:PlotSpec={x:80,y:65,width:700,height:365,xMax:14,yMin:0,yMax:17};
  const vPlot:PlotSpec={x:55,y:65,width:400,height:365,xMax:14,yMin:-4,yMax:4};
  return <SceneShell scene={8} label="recap dashboard"><Title kicker="twenty-second recap">The complete travel-graph routine</Title>
    <WarmCard accent={T.teal} style={{position:'absolute',left:70,top:205,width:330,height:155,padding:'17px 20px'}}><div style={{fontFamily:T.mono,fontSize:28,fontWeight:950,color:'#14745f'}}>1 · CHOOSE POSITIVE</div><div style={{marginTop:15}}><DirectionArrow label="AWAY IS +"/></div></WarmCard>
    <WarmCard accent={T.amber} style={{position:'absolute',left:70,top:385,width:330,height:460,padding:'18px 20px'}}><div style={{fontFamily:T.mono,fontSize:28,fontWeight:950,color:'#925000'}}>2 · PHRASE CARD</div>{['STEADY → FLAT v','SLOW → SLOPE','WAIT → v = 0','RETURN → v < 0'].map((line,i)=><div key={line} style={{marginTop:20,padding:'11px 12px',borderRadius:11,background:i===3?`${T.coral}25`:`${T.teal}20`,fontFamily:T.mono,fontSize:28,fontWeight:850}}>{line}</div>)}</WarmCard>
    <div style={{position:'absolute',left:450,top:202,width:840,height:530,borderRadius:25,background:T.ivory,border:`3px solid ${T.teal}`}}><div style={{margin:'17px 24px',fontFamily:T.mono,fontSize:28,fontWeight:950}}>DISPLACEMENT–TIME</div><svg width="840" height="475"><PlotAxes plot={sPlot} kind="displacement" xTicks={[0,4,6,9,14]} yTicks={[0,15]}/><Trace d={sampledPath(WORD_MODEL,sPlot,'displacement')} color={T.teal} width={8}/><line x1={xFor(sPlot,t)} y1={sPlot.y} x2={xFor(sPlot,t)} y2={sPlot.y+sPlot.height} stroke={T.purple} strokeWidth={5} strokeDasharray="9 8"/><circle cx={xFor(sPlot,t)} cy={yFor(sPlot,state.displacement)} r={10} fill={T.purple}/><path d={`M ${xFor(sPlot,1)} ${yFor(sPlot,3)} H ${xFor(sPlot,3)} V ${yFor(sPlot,9)}`} fill="none" stroke={T.amber} strokeWidth={6} opacity={gradientCue.opacity}/></svg></div>
    <div style={{position:'absolute',right:70,top:202,width:500,height:530,borderRadius:25,background:T.ivory,border:`3px solid ${T.cyan}`}}><div style={{margin:'17px 24px',fontFamily:T.mono,fontSize:28,fontWeight:950}}>VELOCITY–TIME</div><svg width="500" height="475"><PlotAxes plot={vPlot} kind="velocity" xTicks={[0,4,6,9,14]} yTicks={[-3,0,3]}/><AreaRegions model={WORD_MODEL} plot={vPlot} positiveOpacity={areaCue.opacity} negativeOpacity={areaCue.opacity}/>{velocitySegments(WORD_MODEL,vPlot).map((d,i)=><Trace key={d} d={d} color={i===3?T.coral:T.cyan} width={8}/>)}<line x1={xFor(vPlot,9)} y1={yFor(vPlot,0)} x2={xFor(vPlot,9)} y2={yFor(vPlot,-3)} stroke={T.coral} strokeWidth={5} strokeDasharray="9 8"/><line x1={xFor(vPlot,t)} y1={vPlot.y} x2={xFor(vPlot,t)} y2={vPlot.y+vPlot.height} stroke={T.purple} strokeWidth={5} strokeDasharray="9 8"/></svg></div>
    <div style={{position:'absolute',left:450,right:70,top:758,height:87,display:'flex',gap:12}}>{[0,4,6,9,14].map(gate=><div key={gate} style={{flex:1,borderRadius:13,border:`3px solid ${T.amber}`,background:gatesCue.opacity>.5?`${T.amber}28`:T.panel,color:T.amber,display:'grid',placeItems:'center',fontFamily:T.mono,fontSize:28,fontWeight:950}}>{gate === 14 ? 'T' : `${gate} s`}</div>)}</div>
    <div style={{position:'absolute',left:70,right:70,top:875,height:74,borderRadius:18,border:`3px solid ${T.green}`,background:T.panel,display:'flex',alignItems:'center',justifyContent:'space-around',color:T.muted,fontFamily:T.mono,fontSize:28,fontWeight:950,boxShadow:`0 0 ${checkCue.opacity*35}px ${T.green}55`}}>{['LABELS','UNITS','KEY VALUES','STOPS','SIGN CHANGES','SHAPE'].map(item=><span key={item} style={{color:checkCue.opacity>.5?T.green:T.muted}}>✓ {item}</span>)}</div>
  </SceneShell>;
};

const S01=getScene('s01');
const S02=getScene('s02');
const S03=getScene('s03');
const S04=getScene('s04');
const S05=getScene('s05');
const S06=getScene('s06');
const S07=getScene('s07');
const S08=getScene('s08');

const NarratedScene:React.FC<{scene:TranscriptScene;audioEnabled:boolean;children:React.ReactNode}>=({scene,audioEnabled,children})=><AbsoluteFill>{children}{audioEnabled&&<Audio src={staticFile(`audio/mechanics/${scene.audio}`)} volume={1}/>}</AbsoluteFill>;
type PremountedTransitionSequenceProps=React.ComponentProps<typeof TransitionSeries.Sequence>&{premountFor?:number};
const PremountedTransitionSequence=TransitionSeries.Sequence as React.FC<PremountedTransitionSequenceProps>;
const sequenceFrames=(index:number,fps:number):number=>Math.round((BASE_SCENE_FRAMES_30[index]/30)*fps)+(index<BASE_SCENE_FRAMES_30.length-1?TRANSITION_FRAMES:0);

export const MechanicsDrawingTravelGraphs:React.FC<MechanicsDrawingTravelGraphsProps>=({audioEnabled=true})=>{
  const {fps}=useVideoConfig();
  const transition=<TransitionSeries.Transition presentation={fadeThroughGraphite} timing={linearTiming({durationInFrames:TRANSITION_FRAMES})}/>;
  return <AbsoluteFill style={{background:T.bg}}><TransitionSeries>
    <PremountedTransitionSequence name="Recipe bench" durationInFrames={sequenceFrames(0,fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S01} audioEnabled={audioEnabled}><Scene01 scene={S01}/></NarratedScene></PremountedTransitionSequence>{transition}
    <PremountedTransitionSequence name="Words become segments" durationInFrames={sequenceFrames(1,fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S02} audioEnabled={audioEnabled}><Scene02 scene={S02}/></NarratedScene></PremountedTransitionSequence>{transition}
    <PremountedTransitionSequence name="Gradient-area bridge" durationInFrames={sequenceFrames(2,fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S03} audioEnabled={audioEnabled}><Scene03 scene={S03}/></NarratedScene></PremountedTransitionSequence>{transition}
    <PremountedTransitionSequence name="Worked lift" durationInFrames={sequenceFrames(3,fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S04} audioEnabled={audioEnabled}><Scene04 scene={S04}/></NarratedScene></PremountedTransitionSequence>{transition}
    <PremountedTransitionSequence name="One journey, both graphs" durationInFrames={sequenceFrames(4,fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S05} audioEnabled={audioEnabled}><Scene05 scene={S05}/></NarratedScene></PremountedTransitionSequence>{transition}
    <PremountedTransitionSequence name="Ball sign check" durationInFrames={sequenceFrames(5,fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S06} audioEnabled={audioEnabled}><Scene06 scene={S06}/></NarratedScene></PremountedTransitionSequence>{transition}
    <PremountedTransitionSequence name="Final inspection" durationInFrames={sequenceFrames(6,fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S07} audioEnabled={audioEnabled}><Scene07 scene={S07}/></NarratedScene></PremountedTransitionSequence>{transition}
    <PremountedTransitionSequence name="Recap" durationInFrames={sequenceFrames(7,fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S08} audioEnabled={audioEnabled}><Scene08 scene={S08}/></NarratedScene></PremountedTransitionSequence>
  </TransitionSeries></AbsoluteFill>;
};
