/**
 * Velocity-Time Graphs
 *
 * Ten narration-driven mechanics-lab scenes. Graph geometry is plotted from
 * data, and every instructional reveal is tied to a word-level Whisper cue.
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
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from '@remotion/transitions';
import transcriptJson from '../public/transcripts/mechanics/velocity-time-graphs.json';
import { useCue } from './ProjectComposition';

const TRANSITION_FRAMES = 15;

const T = {
  bg: '#06131d',
  bgDeep: '#020b12',
  panel: '#0c2432',
  panelLight: '#173746',
  ivory: '#fff7e5',
  ivoryMuted: '#e9dfca',
  ink: '#102332',
  text: '#faf5e9',
  muted: '#9cb2bc',
  cyan: '#42dbe8',
  amber: '#f4aa45',
  teal: '#38c9aa',
  coral: '#ef7669',
  green: '#68d391',
  purple: '#b69cff',
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
    ? interpolate(presentationProgress, [0, 0.5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(presentationProgress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return <AbsoluteFill style={{ background: passedProps.background, opacity }}>{children}</AbsoluteFill>;
};

const fadeThroughGraphite: TransitionPresentation<FadeThroughProps> = {
  component: FadeThrough,
  props: { background: T.bg },
};

const cardInk = (color: string) => ({
  [T.cyan]: '#087782',
  [T.amber]: '#925000',
  [T.teal]: '#14745f',
  [T.coral]: '#ad342d',
  [T.green]: '#237347',
  [T.purple]: '#6940a0',
}[color] ?? color);

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

interface DataPoint {
  t: number;
  v: number;
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

const TRANSCRIPT = transcriptJson as unknown as MechanicsTranscript;

const normalize = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

function cueAt(scene: TranscriptScene, cueName: string): number {
  const match = Object.entries(scene.cues).find(([name]) => normalize(name) === normalize(cueName));
  return match?.[1] ?? scene.duration + 1;
}

function getScene(id: string): TranscriptScene {
  const scene = TRANSCRIPT.scenes.find((candidate) => candidate.id === id);
  if (!scene) throw new Error(`Missing transcript scene: ${id}`);
  return scene;
}

function sceneDurationInFrames(scene: TranscriptScene, fps: number): number {
  return Math.ceil(scene.duration * fps) + TRANSITION_FRAMES;
}

export function getMechanicsVelocityTimeGraphsDuration(fps: number): number {
  const sequenceFrames = TRANSCRIPT.scenes.reduce(
    (sum, scene) => sum + sceneDurationInFrames(scene, fps),
    0,
  );
  return sequenceFrames - (TRANSCRIPT.scenes.length - 1) * TRANSITION_FRAMES;
}

export interface MechanicsVelocityTimeGraphsProps {
  audioEnabled?: boolean;
}

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));
const mix = (from: number, to: number, progress: number): number => from + (to - from) * progress;

function useProgress(startSeconds: number, endSeconds: number): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(
    frame,
    [startSeconds * fps, Math.max(startSeconds + 0.12, endSeconds) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function useSpringAt(atSeconds: number, durationInFrames = 26): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < atSeconds * fps) return 0;
  return spring({
    frame: frame - atSeconds * fps,
    fps,
    durationInFrames,
    config: { damping: 18, stiffness: 165, mass: 0.75 },
  });
}

function xFor(plot: PlotSpec, t: number): number {
  return plot.x + (t / plot.xMax) * plot.width;
}

function yFor(plot: PlotSpec, velocity: number): number {
  return plot.y + ((plot.yMax - velocity) / (plot.yMax - plot.yMin)) * plot.height;
}

function pathFor(points: DataPoint[], plot: PlotSpec): string {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(plot, point.t)} ${yFor(plot, point.v)}`)
    .join(' ');
}

function valueAt(points: DataPoint[], t: number): number {
  if (t <= points[0].t) return points[0].v;
  for (let index = 1; index < points.length; index += 1) {
    const left = points[index - 1];
    const right = points[index];
    if (t <= right.t) {
      if (right.t === left.t) return right.v;
      const progress = (t - left.t) / (right.t - left.t);
      return mix(left.v, right.v, progress);
    }
  }
  return points[points.length - 1].v;
}

function areaAt(points: DataPoint[], t: number): number {
  let area = 0;
  for (let index = 1; index < points.length; index += 1) {
    const left = points[index - 1];
    const right = points[index];
    if (right.t <= left.t || t <= left.t) continue;
    const segmentEnd = Math.min(t, right.t);
    const endVelocity = valueAt([left, right], segmentEnd);
    area += ((left.v + endVelocity) / 2) * (segmentEnd - left.t);
    if (t <= right.t) break;
  }
  return area;
}

const SceneShell: React.FC<{
  scene: number;
  label: string;
  children: React.ReactNode;
}> = ({ scene, label, children }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 82) * 8;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', isolation: 'isolate', background: T.bg, fontFamily: T.sans }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${22 + drift / 8}% 14%, ${T.cyan}15, transparent 34%), radial-gradient(circle at 84% 86%, ${T.amber}10, transparent 30%), linear-gradient(145deg, ${T.bgDeep}, ${T.bg})` }} />
      <AbsoluteFill style={{ opacity: 0.12, backgroundImage: `linear-gradient(${T.cyan}2d 1px, transparent 1px), linear-gradient(90deg, ${T.cyan}2d 1px, transparent 1px)`, backgroundSize: '64px 64px', transform: `translateX(${drift}px)` }} />
      <div style={{ position: 'absolute', left: 58, top: 45, color: T.muted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2.6 }}>MECHANICS LAB · V–T RIG</div>
      <div style={{ position: 'absolute', right: 58, top: 43, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 999, border: `1px solid ${T.cyan}55`, background: `${T.bgDeep}e5`, color: T.muted, fontFamily: T.mono, fontSize: 28, letterSpacing: 1.2, whiteSpace: 'nowrap', zIndex: 30 }}>
        <span style={{ color: T.cyan, fontWeight: 900, flexShrink: 0 }}>{String(scene).padStart(2, '0')} / 10</span>
        <span>{label.toUpperCase()}</span>
      </div>
      {children}
      <div style={{ position: 'absolute', left: 58, right: 58, bottom: 36, height: 2, background: `linear-gradient(90deg, transparent, ${T.cyan}66 15%, ${T.cyan}66 85%, transparent)` }} />
    </AbsoluteFill>
  );
};

const SectionTitle: React.FC<{ kicker: string; children: React.ReactNode }> = ({ kicker, children }) => (
  <div style={{ position: 'absolute', left: 82, top: 104, zIndex: 10 }}>
    <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 28, fontWeight: 850, letterSpacing: 2.4, textTransform: 'uppercase' }}>{kicker}</div>
    <div style={{ color: T.text, fontSize: 52, lineHeight: 1.05, fontWeight: 930, marginTop: 8 }}>{children}</div>
  </div>
);

const Cued: React.FC<{
  at: number;
  children: React.ReactNode;
  fromX?: number;
  fromY?: number;
  style?: React.CSSProperties;
}> = ({ at, children, fromX = 0, fromY = 22, style }) => {
  const cue = useCue(at, 0.42);
  return (
    <div style={{ opacity: cue.opacity, transform: `translate(${(1 - cue.opacity) * fromX}px, ${(1 - cue.opacity) * fromY}px)`, ...style }}>
      {children}
    </div>
  );
};

const WarmCard: React.FC<{
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, accent = T.cyan, style }) => (
  <div style={{ borderRadius: 24, background: T.ivory, color: T.ink, border: `3px solid ${accent}`, boxShadow: `0 18px 54px #0008, 0 0 26px ${accent}18`, ...style }}>
    {children}
  </div>
);

const PlotAxes: React.FC<{
  plot: PlotSpec;
  xTicks: number[];
  yTicks: number[];
  axisX?: number;
  axisY?: number;
  gridOpacity?: number;
}> = ({ plot, xTicks, yTicks, axisX = 1, axisY = 1, gridOpacity = 0.18 }) => {
  const zeroY = yFor(plot, 0);
  return (
    <g fontFamily={T.mono}>
      <rect x={plot.x} y={plot.y} width={plot.width} height={plot.height} rx={10} fill="#fffaf0" stroke="#c8bda8" strokeWidth={2} />
      {xTicks.map((tick) => (
        <line key={`x-grid-${tick}`} x1={xFor(plot, tick)} y1={plot.y} x2={xFor(plot, tick)} y2={plot.y + plot.height} stroke={T.cyan} strokeWidth={1.5} opacity={gridOpacity * axisX} />
      ))}
      {yTicks.map((tick) => (
        <line key={`y-grid-${tick}`} x1={plot.x} y1={yFor(plot, tick)} x2={plot.x + plot.width} y2={yFor(plot, tick)} stroke={tick === 0 ? T.ink : T.cyan} strokeWidth={tick === 0 ? 3 : 1.5} opacity={tick === 0 ? axisX : gridOpacity * axisY} />
      ))}
      <line x1={plot.x} y1={zeroY} x2={plot.x + plot.width * axisX} y2={zeroY} stroke={T.ink} strokeWidth={4} />
      <line x1={plot.x} y1={plot.y + plot.height} x2={plot.x} y2={plot.y + plot.height * (1 - axisY)} stroke={T.ink} strokeWidth={4} />
      {xTicks.map((tick) => (
        <g key={`x-tick-${tick}`} opacity={axisX}>
          <line x1={xFor(plot, tick)} y1={zeroY - 8} x2={xFor(plot, tick)} y2={zeroY + 8} stroke={T.ink} strokeWidth={3} />
          <text x={xFor(plot, tick)} y={plot.y + plot.height + 37} fill={T.ink} fontSize={28} textAnchor="middle">{tick}</text>
        </g>
      ))}
      {yTicks.map((tick) => (
        <g key={`y-tick-${tick}`} opacity={axisY}>
          <line x1={plot.x - 8} y1={yFor(plot, tick)} x2={plot.x + 8} y2={yFor(plot, tick)} stroke={T.ink} strokeWidth={3} />
          <text x={plot.x - 18} y={yFor(plot, tick) + 10} fill={T.ink} fontSize={28} textAnchor="end">{tick}</text>
        </g>
      ))}
      <text x={plot.x + plot.width - 4} y={plot.y + plot.height + 76} fill={T.ink} fontSize={28} textAnchor="end">time, t / s</text>
      <text x={plot.x + 4} y={plot.y - 18} fill={T.ink} fontSize={28}>velocity, v / m s⁻¹</text>
    </g>
  );
};

const LabCar: React.FC<{
  x: number;
  y: number;
  direction?: 1 | -1;
  wheelTurns?: number;
  arrowLength?: number;
  color?: string;
  scale?: number;
  opacity?: number;
}> = ({ x, y, direction = 1, wheelTurns = 0, arrowLength = 95, color = T.cyan, scale = 1, opacity = 1 }) => {
  const displayArrowLength = Math.min(arrowLength, direction === 1 ? 104 : 78);
  return (
    <div style={{ position: 'absolute', left: x - 180, top: y, width: 360, height: 132, transform: `scale(${scale})`, transformOrigin: 'center bottom', opacity }}>
      <svg width="360" height="132" viewBox="0 0 360 132">
      <path d="M93 64 L118 34 H204 L236 64 H254 Q273 64 276 82 V99 H77 V79 Q79 65 93 64Z" fill={T.ivory} stroke={color} strokeWidth={6} />
      <path d="M129 42 H169 V64 H111Z" fill={`${color}4d`} stroke={color} strokeWidth={3} />
      <path d="M177 42 H198 L222 64 H177Z" fill={`${color}4d`} stroke={color} strokeWidth={3} />
      {[116, 232].map((cx) => (
        <g key={cx} transform={`rotate(${wheelTurns * 360} ${cx} 99)`}>
          <circle cx={cx} cy={99} r={20} fill={T.bgDeep} stroke={color} strokeWidth={5} />
          <line x1={cx - 13} y1={99} x2={cx + 13} y2={99} stroke={T.ivory} strokeWidth={3} />
          <line x1={cx} y1={86} x2={cx} y2={112} stroke={T.ivory} strokeWidth={3} />
        </g>
      ))}
      {displayArrowLength > 0 && (
        <g stroke={color} fill={color} strokeLinecap="round">
          <line x1={direction === 1 ? 247 : 88} y1={45} x2={direction === 1 ? 247 + displayArrowLength : 88 - displayArrowLength} y2={45} strokeWidth={7} />
          <path d={direction === 1 ? `M ${247 + displayArrowLength} 45 l -19 -13 v 26 Z` : `M ${88 - displayArrowLength} 45 l 19 -13 v 26 Z`} stroke="none" />
        </g>
      )}
      </svg>
    </div>
  );
};

const VelocityGauge: React.FC<{
  value: number;
  min?: number;
  max?: number;
  opacity?: number;
  label?: string;
}> = ({ value, min = -10, max = 18, opacity = 1, label = 'VELOCITY METER' }) => {
  const fraction = clamp((value - min) / (max - min));
  const angle = mix(-90, 90, fraction);
  const display = Math.abs(value) < 0.05 ? '0.0' : `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}`;
  return (
    <div style={{ width: 340, height: 350, opacity }}>
      <svg width="340" height="350" viewBox="0 0 340 350">
        <path d="M45 188 A125 125 0 1 1 295 188" fill={T.panel} stroke={T.cyan} strokeWidth={8} />
        {[-90, -60, -30, 0, 30, 60, 90].map((tick) => {
          const radians = (tick - 90) * Math.PI / 180;
          const x1 = 170 + Math.cos(radians) * 105;
          const y1 = 188 + Math.sin(radians) * 105;
          const x2 = 170 + Math.cos(radians) * 122;
          const y2 = 188 + Math.sin(radians) * 122;
          return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.ivory} strokeWidth={4} />;
        })}
        <g transform={`rotate(${angle} 170 188)`}>
          <line x1={170} y1={188} x2={170} y2={78} stroke={value < 0 ? T.coral : T.amber} strokeWidth={8} strokeLinecap="round" />
        </g>
        <circle cx={170} cy={188} r={14} fill={T.ivory} stroke={T.amber} strokeWidth={5} />
        <rect x={59} y={225} width={222} height={68} rx={13} fill={T.bgDeep} stroke={value < 0 ? T.coral : T.cyan} strokeWidth={3} />
        <text x={170} y={271} fill={value < 0 ? T.coral : T.cyan} fontFamily={T.mono} fontSize={35} fontWeight={900} textAnchor="middle">{display} m/s</text>
        <text x={170} y={331} fill={T.muted} fontFamily={T.mono} fontSize={28} fontWeight={800} textAnchor="middle">{label}</text>
      </svg>
    </div>
  );
};

const Road: React.FC<{ top: number; left?: number; width?: number }> = ({ top, left = 90, width = 1740 }) => (
  <div style={{ position: 'absolute', left, top, width, height: 88, borderTop: `5px solid ${T.ivory}`, borderBottom: `5px solid ${T.ivory}`, background: `${T.panelLight}cc`, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 20, right: 20, top: 39, borderTop: `5px dashed ${T.amber}` }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// S01 — PUT MOTION ON THE BENCH
// ─────────────────────────────────────────────────────────────────────────────

const Scene01: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const journeyAt = cueAt(scene, 'journey');
  const graphAt = cueAt(scene, 'graph');
  const measureAt = cueAt(scene, 'measure');
  const carProgress = useProgress(journeyAt, graphAt);
  const graphCue = useCue(graphAt, 0.45);
  const measureCue = useCue(measureAt, 0.45);
  const gaugeValue = carProgress * 7;
  const plot: PlotSpec = { x: 100, y: 55, width: 780, height: 270, xMax: 8, yMin: 0, yMax: 10 };

  return (
    <SceneShell scene={1} label="motion on bench">
      <div style={{ opacity: measureCue.opacity }}><SectionTitle kicker="experiment 01">Put motion on the bench</SectionTitle></div>
      <div style={{ position: 'absolute', left: 770, top: 206, width: 1050, height: 500, padding: 24, borderRadius: 28, border: `3px solid ${T.cyan}`, background: `${T.panel}f2`, boxShadow: `0 0 42px ${T.cyan}22`, opacity: graphCue.opacity, transform: `translateY(${(1 - graphCue.opacity) * 24}px)` }}>
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 28, fontWeight: 900, letterSpacing: 2 }}>PLOTTING SCREEN · CHANNEL V</div>
        <svg width="1000" height="430" viewBox="0 0 1000 430" style={{ marginTop: 8, background: T.ivory, borderRadius: 14 }}>
          <PlotAxes plot={plot} xTicks={[0, 2, 4, 6, 8]} yTicks={[0, 2, 4, 6, 8, 10]} gridOpacity={0.22 * measureCue.opacity} />
          <g opacity={measureCue.opacity}>
            <line x1={xFor(plot, 4)} y1={plot.y} x2={xFor(plot, 4)} y2={plot.y + plot.height} stroke={T.amber} strokeWidth={3} strokeDasharray="10 8" />
            <line x1={plot.x} y1={yFor(plot, 5)} x2={plot.x + plot.width} y2={yFor(plot, 5)} stroke={T.amber} strokeWidth={3} strokeDasharray="10 8" />
            <circle cx={xFor(plot, 4)} cy={yFor(plot, 5)} r={12} fill={T.amber} />
          </g>
        </svg>
      </div>
      <Cued at={measureAt} style={{ position: 'absolute', left: 110, top: 238 }}>
        <WarmCard accent={T.amber} style={{ width: 570, padding: '30px 36px' }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>INSTRUMENT PLATE</div>
          <div style={{ color: T.ink, fontSize: 49, lineHeight: 1.1, fontWeight: 950, marginTop: 14 }}>VELOCITY–TIME<br />GRAPHS</div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, marginTop: 18 }}>one line · measurable motion</div>
        </WarmCard>
      </Cued>
      <Road top={825} />
      <LabCar x={mix(-100, 620, carProgress)} y={755} wheelTurns={carProgress * 3.6} arrowLength={70 + gaugeValue * 8} opacity={useCue(journeyAt, 0.35).opacity} />
      <div style={{ position: 'absolute', right: 140, top: 690 }}><VelocityGauge value={gaugeValue} min={0} max={10} opacity={useCue(journeyAt, 0.4).opacity} /></div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S02 — ROAD, SPEEDOMETER, GRAPH
// ─────────────────────────────────────────────────────────────────────────────

const S02_POINTS: DataPoint[] = [
  { t: 0, v: 0 }, { t: 2, v: 8 }, { t: 5, v: 8 },
  { t: 7, v: 0 }, { t: 9, v: -5 }, { t: 12, v: 0 },
];

const Scene02: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const timeAt = cueAt(scene, 'time');
  const velocityAtCue = cueAt(scene, 'velocity');
  const aboveAt = cueAt(scene, 'above-zero');
  const belowAt = cueAt(scene, 'below-zero');
  const axisX = useProgress(timeAt, velocityAtCue);
  const axisY = useProgress(velocityAtCue, aboveAt);
  const journeyT = interpolate(
    seconds,
    [aboveAt, belowAt, Math.max(belowAt + 0.2, scene.duration - 0.7)],
    [0, 7, 12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const progress = journeyT / 12;
  const velocity = valueAt(S02_POINTS, journeyT);
  const displacement = areaAt(S02_POINTS, journeyT);
  const displacementColor = displacement < -0.05 ? T.coral : T.teal;
  const displacementDisplay = Math.abs(displacement) < 0.05
    ? '0.0'
    : `${displacement > 0 ? '+' : '−'}${Math.abs(displacement).toFixed(1)}`;
  const direction: 1 | -1 = velocity < -0.05 ? -1 : 1;
  const plot: PlotSpec = { x: 100, y: 62, width: 940, height: 480, xMax: 12, yMin: -6, yMax: 10 };
  const zeroY = yFor(plot, 0);
  const positivePolygon = `${xFor(plot, 0)},${zeroY} ${xFor(plot, 0)},${yFor(plot, 0)} ${xFor(plot, 2)},${yFor(plot, 8)} ${xFor(plot, 5)},${yFor(plot, 8)} ${xFor(plot, 7)},${zeroY}`;
  const negativePolygon = `${xFor(plot, 7)},${zeroY} ${xFor(plot, 9)},${yFor(plot, -5)} ${xFor(plot, 12)},${zeroY}`;

  return (
    <SceneShell scene={2} label="road · dial · graph">
      <SectionTitle kicker="same journey, three instruments">Read direction from the sign</SectionTitle>
      <div style={{ position: 'absolute', left: 70, top: 205, width: 1140, height: 660, borderRadius: 26, background: T.ivory, border: `3px solid ${T.cyan}`, boxShadow: '0 18px 56px #0008' }}>
        <svg width="1140" height="660" viewBox="0 0 1140 660">
          <defs><clipPath id="s02-line-clip"><rect x={plot.x - 8} y={plot.y - 8} width={plot.width * progress + 16} height={plot.height + 16} /></clipPath></defs>
          <PlotAxes plot={plot} xTicks={[0, 2, 4, 6, 8, 10, 12]} yTicks={[-6, -4, -2, 0, 2, 4, 6, 8, 10]} axisX={axisX} axisY={axisY} />
          <polygon points={positivePolygon} fill={T.teal} opacity={0.13 * useCue(aboveAt, 0.3).opacity} clipPath="url(#s02-line-clip)" />
          <polygon points={negativePolygon} fill={T.coral} opacity={0.2 * useCue(belowAt, 0.3).opacity} clipPath="url(#s02-line-clip)" />
          <path d={pathFor(S02_POINTS, plot)} fill="none" stroke={T.cyan} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" clipPath="url(#s02-line-clip)" />
          {journeyT > 0 && <circle cx={xFor(plot, journeyT)} cy={yFor(plot, velocity)} r={13} fill={velocity < 0 ? T.coral : T.amber} stroke={T.ink} strokeWidth={4} />}
          <g opacity={useCue(aboveAt, 0.4).opacity}>
            <rect x={720} y={210} width={298} height={54} rx={12} fill={T.ink} />
            <text x={869} y={247} fill={T.teal} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">ABOVE 0 · FORWARD</text>
          </g>
          <g opacity={useCue(belowAt, 0.4).opacity}>
            <rect x={300} y={448} width={302} height={54} rx={12} fill={T.ink} />
            <text x={451} y={485} fill={T.coral} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">BELOW 0 · REVERSE</text>
          </g>
        </svg>
      </div>
      <div style={{ position: 'absolute', right: 82, top: 220 }}><VelocityGauge value={velocity} min={-6} max={10} opacity={useCue(velocityAtCue, 0.4).opacity} /></div>
      <div style={{ position: 'absolute', right: 105, top: 580, width: 455 }}>
        <WarmCard accent={displacementColor} style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ color: cardInk(displacementColor), fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}>SIGNED POSITION CHANGE</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 43, fontWeight: 950, marginTop: 9 }}>{displacementDisplay} m</div>
        </WarmCard>
      </div>
      <Road top={891} left={105} width={1710} />
      <LabCar x={320 + displacement * 24} y={847} direction={direction} wheelTurns={Math.abs(displacement) / 4} arrowLength={Math.max(12, Math.abs(velocity) * 15)} color={direction === -1 ? T.coral : T.cyan} opacity={useCue(aboveAt, 0.3).opacity} />
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S03 — READ THE LINE BEFORE CALCULATING
// ─────────────────────────────────────────────────────────────────────────────

const SpecimenCard: React.FC<{
  at: number;
  title: string;
  note: string;
  color: string;
  points: DataPoint[];
  curve?: boolean;
  sign?: string;
  x: number;
  y: number;
}> = ({ at, title, note, color, points, curve = false, sign, x, y }) => {
  const reveal = useCue(at, 0.4);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const demoProgress = useProgress(at, at + 2.5);
  const travelProgress = title === 'STRAIGHT RISE'
    ? demoProgress * demoProgress
    : title === 'STRAIGHT FALL'
      ? 1 - (1 - demoProgress) * (1 - demoProgress)
      : curve
        ? Math.pow(demoProgress, 1 + demoProgress * 0.8)
        : demoProgress;
  const carT = mix(0.35, 4.65, travelProgress);
  const curveBend = curve ? clamp(demoProgress * 5) : 1;
  const plot: PlotSpec = { x: 64, y: 45, width: 350, height: 142, xMax: 5, yMin: 0, yMax: 5 };
  const d = curve
    ? `M ${xFor(plot, 0)} ${yFor(plot, 0.6)} C ${xFor(plot, 1.5)} ${yFor(plot, mix(1.68, 0.8, curveBend))}, ${xFor(plot, 2.5)} ${yFor(plot, mix(2.4, 4.6, curveBend))}, ${xFor(plot, 5)} ${yFor(plot, 4.2)}`
    : pathFor(points, plot);
  const curveVelocity = (() => {
    const progress = carT / 5;
    const inverse = 1 - progress;
    const controlOne = mix(1.68, 0.8, curveBend);
    const controlTwo = mix(2.4, 4.6, curveBend);
    return inverse ** 3 * 0.6
      + 3 * inverse ** 2 * progress * controlOne
      + 3 * inverse * progress ** 2 * controlTwo
      + progress ** 3 * 4.2;
  })();
  const carVelocity = curve ? curveVelocity : valueAt(points, carT);
  const rulerSegments = title === 'STRAIGHT RISE' || curve
    ? Array.from({ length: curve ? 7 : 5 }, (_, index) => {
      const sample = curve
        ? 0.08 + index * 0.14 + demoProgress * 0.02
        : 0.25 + index * 0.11;
      let pointX: number;
      let pointY: number;
      let tangentX: number;
      let tangentY: number;

      if (curve) {
        const inverse = 1 - sample;
        const x0 = xFor(plot, 0);
        const x1 = xFor(plot, 1.5);
        const x2 = xFor(plot, 2.5);
        const x3 = xFor(plot, 5);
        const y0 = yFor(plot, 0.6);
        const y1 = yFor(plot, mix(1.68, 0.8, curveBend));
        const y2 = yFor(plot, mix(2.4, 4.6, curveBend));
        const y3 = yFor(plot, 4.2);
        pointX = inverse ** 3 * x0 + 3 * inverse ** 2 * sample * x1 + 3 * inverse * sample ** 2 * x2 + sample ** 3 * x3;
        pointY = inverse ** 3 * y0 + 3 * inverse ** 2 * sample * y1 + 3 * inverse * sample ** 2 * y2 + sample ** 3 * y3;
        tangentX = 3 * inverse ** 2 * (x1 - x0) + 6 * inverse * sample * (x2 - x1) + 3 * sample ** 2 * (x3 - x2);
        tangentY = 3 * inverse ** 2 * (y1 - y0) + 6 * inverse * sample * (y2 - y1) + 3 * sample ** 2 * (y3 - y2);
      } else {
        const first = points[0];
        const last = points[points.length - 1];
        pointX = mix(xFor(plot, first.t), xFor(plot, last.t), sample);
        pointY = mix(yFor(plot, first.v), yFor(plot, last.v), sample);
        tangentX = xFor(plot, last.t) - xFor(plot, first.t);
        tangentY = yFor(plot, last.v) - yFor(plot, first.v);
      }

      const tangentLength = Math.hypot(tangentX, tangentY);
      const offset = 18;
      return {
        x: pointX + (tangentY / tangentLength) * offset,
        y: pointY - (tangentX / tangentLength) * offset,
        angle: Math.atan2(tangentY, tangentX) * 180 / Math.PI,
      };
    })
    : [];
  const lampPhase = Math.sin(Math.max(0, frame - at * fps) / 6);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 820, height: 286, opacity: reveal.opacity, transform: `translateY(${(1 - reveal.opacity) * 26}px)` }}>
      <WarmCard accent={color} style={{ width: '100%', height: '100%', padding: '20px 24px', display: 'flex', gap: 26 }}>
        <svg width="455" height="232" viewBox="0 0 455 232">
          <rect x={plot.x} y={plot.y} width={plot.width} height={plot.height} rx={7} fill="#fffaf0" stroke="#c8bda8" strokeWidth={2} />
          <line x1={plot.x} y1={plot.y + plot.height} x2={plot.x + plot.width} y2={plot.y + plot.height} stroke={T.ink} strokeWidth={4} />
          <line x1={plot.x} y1={plot.y + plot.height} x2={plot.x} y2={plot.y} stroke={T.ink} strokeWidth={4} />
          {rulerSegments.map((segment, index) => (
            <g key={`ruler-${index}`} transform={`translate(${segment.x} ${segment.y}) rotate(${segment.angle})`}>
              <rect x={-25} y={-8} width={50} height={16} rx={4} fill={T.ivory} stroke={T.amber} strokeWidth={3} />
              <line x1={-12} y1={-7} x2={-12} y2={1} stroke={T.ink} strokeWidth={2} />
              <line x1={0} y1={-7} x2={0} y2={3} stroke={T.ink} strokeWidth={2} />
              <line x1={12} y1={-7} x2={12} y2={1} stroke={T.ink} strokeWidth={2} />
            </g>
          ))}
          <path d={d} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
          <text x={plot.x + plot.width - 2} y={222} fill={T.ink} fontFamily={T.mono} fontSize={28} textAnchor="end">t / s</text>
          <text x={plot.x + 6} y={30} fill={T.ink} fontFamily={T.mono} fontSize={28}>v</text>
          <g transform={`translate(${xFor(plot, carT) - 34} ${yFor(plot, carVelocity) - 29})`}>
            <rect x={0} y={0} width={55} height={29} rx={8} fill={T.ink} />
            <circle cx={14} cy={30} r={9} fill={color} /><circle cx={43} cy={30} r={9} fill={color} />
          </g>
        </svg>
        <div style={{ flex: 1, paddingTop: 15 }}>
          <div style={{ color: cardInk(color), fontFamily: T.mono, fontSize: 30, fontWeight: 950, letterSpacing: 1.5 }}>{title}</div>
          <div style={{ color: T.ink, fontSize: 29, lineHeight: 1.25, fontWeight: 800, marginTop: 18 }}>{note}</div>
          {sign && title === 'STRAIGHT FALL' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, whiteSpace: 'nowrap' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', color: T.ink, background: T.teal, opacity: lampPhase >= 0 ? 1 : 0.35, fontFamily: T.mono, fontSize: 34, fontWeight: 950 }}>+</div>
              <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 30, fontWeight: 950 }}>↔</div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', color: T.ink, background: T.coral, opacity: lampPhase < 0 ? 1 : 0.35, fontFamily: T.mono, fontSize: 34, fontWeight: 950 }}>−</div>
            </div>
          )}
          {sign && title !== 'STRAIGHT FALL' && <div style={{ color: cardInk(color), fontFamily: T.mono, fontSize: 36, fontWeight: 950, marginTop: 22, whiteSpace: 'nowrap' }}>{sign}</div>}
        </div>
      </WarmCard>
    </div>
  );
};

const Scene03: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const flatAt = cueAt(scene, 'flat');
  const straightAt = cueAt(scene, 'straight-slope');
  const signsAt = cueAt(scene, 'opposite-signs');
  const curveAt = cueAt(scene, 'curve');
  return (
    <SceneShell scene={3} label="line specimens">
      <SectionTitle kicker="inspect before calculating">The line tells you the motion</SectionTitle>
      <SpecimenCard at={flatAt} title="FLAT" note="constant velocity" color={T.cyan} points={[{ t: 0, v: 2.8 }, { t: 5, v: 2.8 }]} x={92} y={230} />
      <SpecimenCard at={straightAt} title="STRAIGHT RISE" note="constant acceleration" color={T.teal} points={[{ t: 0, v: 0.5 }, { t: 5, v: 4.3 }]} sign="a = constant" x={1008} y={230} />
      <SpecimenCard at={signsAt} title="STRAIGHT FALL" note="opposite gradient sign" color={T.coral} points={[{ t: 0, v: 4.4 }, { t: 5, v: 0.6 }]} sign="+a  ↔  −a" x={92} y={550} />
      <SpecimenCard at={curveAt} title="CURVE" note="acceleration is changing" color={T.amber} points={[{ t: 0, v: 0.6 }, { t: 5, v: 4.2 }]} curve x={1008} y={550} />
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S04 — MEASURE THE GRADIENT
// ─────────────────────────────────────────────────────────────────────────────

const Scene04: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const gradientAt = cueAt(scene, 'gradient');
  const fourAt = cueAt(scene, 'four');
  const sixteenAt = cueAt(scene, 'sixteen');
  const twelveAt = cueAt(scene, 'twelve');
  const sixAt = cueAt(scene, 'six-seconds');
  const twoAt = cueAt(scene, 'two');
  const slide = useProgress(gradientAt, twelveAt);
  const lineProgress = useProgress(fourAt, sixteenAt + 0.65);
  const verticalProgress = useProgress(twelveAt, sixAt);
  const horizontalProgress = useProgress(sixAt, twoAt);
  const resultProgress = useProgress(twoAt, twoAt + 0.4);
  const fullTriangle = useCue(twelveAt, 0.35);
  const plot: PlotSpec = { x: 105, y: 72, width: 930, height: 500, xMax: 6, yMin: 0, yMax: 18 };
  const slope: DataPoint[] = [{ t: 0, v: 4 }, { t: 6, v: 16 }];
  const smallStart = slide * 4;
  const smallEnd = smallStart + 2;
  const smallStartVelocity = 4 + smallStart * 2;
  const smallEndVelocity = 4 + smallEnd * 2;
  const acceleration = resultProgress * 2;

  return (
    <SceneShell scene={4} label="gradient rig">
      <SectionTitle kicker="gradient = acceleration">Measure rise over run</SectionTitle>
      <div style={{ position: 'absolute', left: 62, top: 205, width: 1195, height: 705, borderRadius: 28, background: T.ivory, border: `3px solid ${T.amber}`, boxShadow: '0 18px 58px #0008' }}>
        <svg width="1195" height="705" viewBox="0 0 1195 705">
          <defs><clipPath id="s04-slope-clip"><rect x={plot.x - 8} y={plot.y - 8} width={plot.width * lineProgress + 16} height={plot.height + 16} /></clipPath></defs>
          <PlotAxes plot={plot} xTicks={[0, 1, 2, 3, 4, 5, 6]} yTicks={[0, 4, 8, 12, 16]} />
          <path d={pathFor(slope, plot)} fill="none" stroke={`${T.ink}35`} strokeWidth={10} strokeLinecap="round" />
          <path d={pathFor(slope, plot)} fill="none" stroke={T.cyan} strokeWidth={11} strokeLinecap="round" clipPath="url(#s04-slope-clip)" />
          <g opacity={useCue(gradientAt, 0.35).opacity * (1 - fullTriangle.opacity)}>
            <path d={`M ${xFor(plot, smallStart)} ${yFor(plot, smallStartVelocity)} L ${xFor(plot, smallEnd)} ${yFor(plot, smallStartVelocity)} L ${xFor(plot, smallEnd)} ${yFor(plot, smallEndVelocity)} Z`} fill={`${T.amber}22`} stroke={T.amber} strokeWidth={7} strokeLinejoin="round" />
            <circle cx={xFor(plot, smallEnd)} cy={yFor(plot, smallEndVelocity)} r={12} fill={T.amber} />
          </g>
          <g opacity={fullTriangle.opacity}>
            <path d={`M ${xFor(plot, 6)} ${yFor(plot, 4)} L ${xFor(plot, 6)} ${mix(yFor(plot, 4), yFor(plot, 16), verticalProgress)}`} fill="none" stroke={T.coral} strokeWidth={9} strokeLinecap="round" />
            <path d={`M ${xFor(plot, 6)} ${yFor(plot, 4)} L ${mix(xFor(plot, 6), xFor(plot, 0), horizontalProgress)} ${yFor(plot, 4)}`} fill="none" stroke={T.amber} strokeWidth={9} strokeLinecap="round" />
            <path d={`M ${xFor(plot, 0)} ${yFor(plot, 4)} L ${xFor(plot, 6)} ${yFor(plot, 4)} L ${xFor(plot, 6)} ${yFor(plot, 16)} Z`} fill={`${T.amber}10`} stroke="none" />
          </g>
          <g opacity={useCue(fourAt, 0.35).opacity}>
            <rect x={122} y={yFor(plot, 4) - 46} width={174} height={48} rx={10} fill={T.ink} />
            <text x={209} y={yFor(plot, 4) - 13} fill={T.cyan} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">4 m/s</text>
          </g>
          <g opacity={useCue(sixteenAt, 0.35).opacity}>
            <rect x={xFor(plot, 6) - 190} y={yFor(plot, 16) - 50} width={178} height={48} rx={10} fill={T.ink} />
            <text x={xFor(plot, 6) - 101} y={yFor(plot, 16) - 17} fill={T.cyan} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">16 m/s</text>
          </g>
          <g opacity={useCue(twelveAt, 0.35).opacity}>
            <rect x={xFor(plot, 6) - 157} y={yFor(plot, 10) - 27} width={139} height={54} rx={10} fill={T.ink} />
            <text x={xFor(plot, 6) - 88} y={yFor(plot, 10) + 10} fill={T.coral} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">Δv = 12</text>
          </g>
          <g opacity={useCue(sixAt, 0.35).opacity}>
            <rect x={xFor(plot, 3) - 86} y={yFor(plot, 4) + 18} width={172} height={54} rx={10} fill={T.ink} />
            <text x={xFor(plot, 3)} y={yFor(plot, 4) + 55} fill={T.amber} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">Δt = 6 s</text>
          </g>
        </svg>
      </div>
      <Cued at={gradientAt} fromX={35} style={{ position: 'absolute', right: 74, top: 252, width: 540 }}>
        <WarmCard accent={T.amber} style={{ padding: '28px 30px' }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>GRADIENT TRIANGLE</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 42, fontWeight: 950, marginTop: 19, whiteSpace: 'nowrap' }}>a = Δv ÷ Δt</div>
          <div style={{ color: T.ink, fontSize: 29, fontWeight: 800, marginTop: 14 }}>rise divided by run</div>
        </WarmCard>
      </Cued>
      <Cued at={twoAt} fromY={28} style={{ position: 'absolute', right: 74, top: 560, width: 540 }}>
        <WarmCard accent={T.green} style={{ padding: '30px 28px', textAlign: 'center' }}>
          <div style={{ color: cardInk(T.green), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>12 ÷ 6</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 64, fontWeight: 950, marginTop: 14 }}>{acceleration.toFixed(1)} m/s²</div>
          <div style={{ color: cardInk(T.green), fontSize: 29, fontWeight: 900, marginTop: 8 }}>CONSTANT ACCELERATION</div>
        </WarmCard>
      </Cued>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S05 — SIGNED AREA IS DISPLACEMENT
// ─────────────────────────────────────────────────────────────────────────────

const Scene05: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const areaCueAt = cueAt(scene, 'area');
  const displacementAt = cueAt(scene, 'displacement');
  const belowAt = cueAt(scene, 'below-zero');
  const distanceAt = cueAt(scene, 'distance');
  const positiveProgress = useProgress(areaCueAt, belowAt);
  const negativeProgress = useProgress(belowAt, Math.min(scene.duration - 0.05, distanceAt + 0.8));
  const positiveArea = 20 * positiveProgress;
  const negativeMagnitude = 6 * negativeProgress;
  const displacement = positiveArea - negativeMagnitude;
  const distance = positiveArea + negativeMagnitude;
  const currentT = positiveProgress < 1 ? 5 * positiveProgress : 5 + 3 * negativeProgress;
  const velocity = negativeProgress > 0 ? -2 : positiveProgress > 0 ? 4 : 0;
  const direction: 1 | -1 = velocity < 0 ? -1 : 1;
  const plot: PlotSpec = { x: 108, y: 54, width: 560, height: 560, xMax: 8, yMin: -3, yMax: 5 };
  const cell = plot.width / 8;
  const graphPoints: DataPoint[] = [{ t: 0, v: 4 }, { t: 5, v: 4 }, { t: 5, v: -2 }, { t: 8, v: -2 }];
  const posCells = Array.from({ length: 20 }, (_, index) => ({ column: Math.floor(index / 4), row: index % 4, index }));
  const negCells = Array.from({ length: 6 }, (_, index) => ({ column: 5 + Math.floor(index / 2), row: -1 - (index % 2), index }));

  return (
    <SceneShell scene={5} label="signed area tiles">
      <SectionTitle kicker="one tile = one metre">Area keeps the direction sign</SectionTitle>
      <div style={{ position: 'absolute', left: 66, top: 204, width: 820, height: 748, borderRadius: 28, background: T.ivory, border: `3px solid ${T.teal}`, boxShadow: '0 18px 58px #0008' }}>
        <svg width="820" height="748" viewBox="0 0 820 748">
          <defs><clipPath id="s05-line-clip"><rect x={plot.x - 7} y={plot.y - 7} width={(currentT / 8) * plot.width + 14} height={plot.height + 14} /></clipPath></defs>
          <PlotAxes plot={plot} xTicks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} yTicks={[-3, -2, -1, 0, 1, 2, 3, 4, 5]} gridOpacity={0.12} />
          {posCells.map(({ column, row, index }) => {
            const local = clamp(positiveProgress * posCells.length - index);
            return <rect key={`positive-${index}`} x={xFor(plot, column) + 4} y={yFor(plot, row + 1) + 4} width={cell - 8} height={cell - 8} rx={6} fill={T.teal} opacity={local * 0.86} stroke={cardInk(T.teal)} strokeWidth={2} />;
          })}
          {negCells.map(({ column, row, index }) => {
            const local = clamp(negativeProgress * negCells.length - index);
            return <rect key={`negative-${index}`} x={xFor(plot, column) + 4} y={yFor(plot, row + 1) + 4} width={cell - 8} height={cell - 8} rx={6} fill={T.coral} opacity={local * 0.86} stroke={cardInk(T.coral)} strokeWidth={2} />;
          })}
          <path d={pathFor(graphPoints, plot)} fill="none" stroke={T.cyan} strokeWidth={10} strokeLinejoin="round" clipPath="url(#s05-line-clip)" />
          {currentT > 0 && <circle cx={xFor(plot, currentT)} cy={yFor(plot, velocity)} r={12} fill={velocity < 0 ? T.coral : T.amber} stroke={T.ink} strokeWidth={4} />}
          <rect x={132} y={62} width={276} height={50} rx={10} fill={T.ink} opacity={useCue(areaCueAt, 0.35).opacity} />
          <text x={270} y={97} fill={T.teal} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle" opacity={useCue(areaCueAt, 0.35).opacity}>20 TEAL TILES</text>
          <rect x={425} y={548} width={226} height={50} rx={10} fill={T.ink} opacity={useCue(belowAt, 0.35).opacity} />
          <text x={538} y={583} fill={T.coral} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle" opacity={useCue(belowAt, 0.35).opacity}>6 CORAL TILES</text>
        </svg>
      </div>
      <div style={{ position: 'absolute', right: 88, top: 230 }}><VelocityGauge value={velocity} min={-4} max={6} opacity={useCue(areaCueAt, 0.35).opacity} /></div>
      <Cued at={displacementAt} fromX={32} style={{ position: 'absolute', right: 80, top: 560, width: 660 }}>
        <WarmCard accent={displacement >= 0 ? T.teal : T.coral} style={{ padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: cardInk(T.teal), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>SIGNED DISPLACEMENT</div>
            <div style={{ color: T.ink, fontSize: 28, fontWeight: 780, marginTop: 8 }}>teal − coral</div>
          </div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 58, fontWeight: 950 }}>{displacement.toFixed(1)} m</div>
        </WarmCard>
      </Cued>
      <Cued at={distanceAt} fromX={32} style={{ position: 'absolute', right: 80, top: 725, width: 660 }}>
        <WarmCard accent={T.amber} style={{ padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>TOTAL DISTANCE</div>
            <div style={{ color: T.ink, fontSize: 28, fontWeight: 780, marginTop: 8 }}>teal + coral</div>
          </div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 58, fontWeight: 950 }}>{distance.toFixed(1)} m</div>
        </WarmCard>
      </Cued>
      <Road top={884} left={945} width={880} />
      <LabCar x={1050 + displacement * 24} y={812} direction={direction} wheelTurns={distance / 4} arrowLength={Math.abs(velocity) * 20} color={direction === -1 ? T.coral : T.cyan} opacity={useCue(areaCueAt, 0.35).opacity} scale={0.88} />
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S06 — BUILD A JOURNEY FROM SHAPES
// ─────────────────────────────────────────────────────────────────────────────

const Scene06: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const twelveAt = cueAt(scene, 'twelve');
  const fourAt = cueAt(scene, 'four');
  const fiveAt = cueAt(scene, 'five');
  const threeAt = cueAt(scene, 'three');
  const splitAt = cueAt(scene, 'split');
  const area24At = cueAt(scene, 'area-twenty-four');
  const area60At = cueAt(scene, 'area-sixty');
  const area18At = cueAt(scene, 'area-eighteen');
  const totalAt = cueAt(scene, 'one-hundred-and-two');
  const splitProgress = useSpringAt(splitAt, 30);
  const splitCue = useCue(splitAt, 0.3);
  const totalCue = useCue(totalAt, 0.35);
  const plot: PlotSpec = { x: 112, y: 66, width: 1000, height: 500, xMax: 12, yMin: 0, yMax: 14 };
  const points: DataPoint[] = [{ t: 0, v: 0 }, { t: 4, v: 12 }, { t: 9, v: 12 }, { t: 12, v: 0 }];
  const zeroY = yFor(plot, 0);
  const leftTriangle = `${xFor(plot, 0)},${zeroY} ${xFor(plot, 4)},${yFor(plot, 12)} ${xFor(plot, 4)},${zeroY}`;
  const rectangle = `${xFor(plot, 4)},${zeroY} ${xFor(plot, 4)},${yFor(plot, 12)} ${xFor(plot, 9)},${yFor(plot, 12)} ${xFor(plot, 9)},${zeroY}`;
  const rightTriangle = `${xFor(plot, 9)},${zeroY} ${xFor(plot, 9)},${yFor(plot, 12)} ${xFor(plot, 12)},${zeroY}`;
  const trapezium = `${xFor(plot, 0)},${zeroY} ${xFor(plot, 4)},${yFor(plot, 12)} ${xFor(plot, 9)},${yFor(plot, 12)} ${xFor(plot, 12)},${zeroY}`;
  const edgeLabel = (start: number, end: number, text: string, opacity: number) => (
    <g opacity={opacity}>
      <rect x={(xFor(plot, start) + xFor(plot, end)) / 2 - 52} y={zeroY - 47} width={104} height={42} rx={9} fill={T.ink} />
      <text x={(xFor(plot, start) + xFor(plot, end)) / 2} y={zeroY - 17} fill={T.amber} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">{text}</text>
    </g>
  );

  return (
    <SceneShell scene={6} label="trapezium workshop">
      <SectionTitle kicker="distance from area">Build the journey from three parts</SectionTitle>
      <div style={{ position: 'absolute', left: 58, top: 205, width: 1270, height: 720, borderRadius: 28, background: T.ivory, border: `3px solid ${T.amber}`, boxShadow: '0 18px 58px #0008' }}>
        <svg width="1270" height="720" viewBox="0 0 1270 720">
          <PlotAxes plot={plot} xTicks={[0, 4, 9, 12]} yTicks={[0, 4, 8, 12]} />
          <g opacity={1 - totalCue.opacity * 0.45}>
            <polygon points={trapezium} fill={`${T.teal}9d`} stroke={T.cyan} strokeWidth={7} opacity={1 - splitCue.opacity} />
            <g opacity={splitCue.opacity}>
              <polygon points={leftTriangle} fill={`${T.teal}bc`} stroke={T.teal} strokeWidth={5} transform={`translate(${-30 * splitProgress} ${-20 * splitProgress})`} />
              <polygon points={rectangle} fill={`${T.cyan}a8`} stroke={T.cyan} strokeWidth={5} transform={`translate(0 ${28 * splitProgress})`} />
              <polygon points={rightTriangle} fill={`${T.amber}b8`} stroke={T.amber} strokeWidth={5} transform={`translate(${30 * splitProgress} ${-20 * splitProgress})`} />
            </g>
            <path d={pathFor(points, plot)} fill="none" stroke={T.ink} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" opacity={1 - splitCue.opacity} />
          </g>
          <g opacity={useCue(twelveAt, 0.35).opacity}>
            <rect x={xFor(plot, 4) - 205} y={yFor(plot, 12) - 58} width={190} height={48} rx={10} fill={T.ink} />
            <text x={xFor(plot, 4) - 110} y={yFor(plot, 12) - 24} fill={T.cyan} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">12 m/s</text>
          </g>
          {edgeLabel(0, 4, '4 s', useCue(fourAt, 0.35).opacity)}
          {edgeLabel(4, 9, '5 s', useCue(fiveAt, 0.35).opacity)}
          {edgeLabel(9, 12, '3 s', useCue(threeAt, 0.35).opacity)}
          <g opacity={useCue(splitAt, 0.35).opacity}>
            <text x={xFor(plot, 2) - 30} y={yFor(plot, 7)} fill={T.ink} fontFamily={T.mono} fontSize={29} fontWeight={950} textAnchor="middle" paintOrder="stroke" stroke={T.ivory} strokeWidth={8}>TRIANGLE</text>
            <text x={xFor(plot, 6.5)} y={yFor(plot, 6)} fill={T.ink} fontFamily={T.mono} fontSize={29} fontWeight={950} textAnchor="middle" paintOrder="stroke" stroke={T.ivory} strokeWidth={8}>RECTANGLE</text>
            <text x={xFor(plot, 10.5) + 34} y={yFor(plot, 7)} fill={T.ink} fontFamily={T.mono} fontSize={29} fontWeight={950} textAnchor="middle" paintOrder="stroke" stroke={T.ivory} strokeWidth={8}>TRIANGLE</text>
          </g>
        </svg>
      </div>
      <div style={{ position: 'absolute', right: 67, top: 231, width: 520, opacity: totalCue.isActive ? 0 : 1 }}>
        <Cued at={area24At} fromX={35}>
          <WarmCard accent={T.teal} style={{ padding: '19px 24px', marginBottom: 20 }}>
            <div style={{ color: cardInk(T.teal), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>½ × 4 × 12</div>
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 46, fontWeight: 950, marginTop: 6 }}>24 m</div>
          </WarmCard>
        </Cued>
        <Cued at={area60At} fromX={35}>
          <WarmCard accent={T.cyan} style={{ padding: '19px 24px', marginBottom: 20 }}>
            <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>5 × 12</div>
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 46, fontWeight: 950, marginTop: 6 }}>60 m</div>
          </WarmCard>
        </Cued>
        <Cued at={area18At} fromX={35}>
          <WarmCard accent={T.amber} style={{ padding: '19px 24px' }}>
            <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>½ × 3 × 12</div>
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 46, fontWeight: 950, marginTop: 6 }}>18 m</div>
          </WarmCard>
        </Cued>
      </div>
      <div style={{ position: 'absolute', right: 70, top: 360, width: 515, opacity: totalCue.opacity, transform: `scale(${0.86 + totalCue.opacity * 0.14})` }}>
        <WarmCard accent={T.green} style={{ padding: '42px 30px', textAlign: 'center', boxShadow: `0 0 50px ${T.green}44` }}>
          <div style={{ color: cardInk(T.green), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>24 + 60 + 18</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 70, fontWeight: 950, marginTop: 18 }}>102 m</div>
          <div style={{ color: cardInk(T.green), fontSize: 29, fontWeight: 900, marginTop: 14 }}>TOTAL DISTANCE</div>
        </WarmCard>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S07 — DIRECTION CHANGES THE AVERAGES
// ─────────────────────────────────────────────────────────────────────────────

const S07_POINTS: DataPoint[] = [
  { t: 0, v: 0 }, { t: 3, v: 8 }, { t: 6, v: 0 },
  { t: 8, v: -4 }, { t: 10, v: 0 },
];

const Scene07: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const forwardAt = cueAt(scene, 'forward-area');
  const backwardAt = cueAt(scene, 'backward-area');
  const displacementAt = cueAt(scene, 'displacement');
  const distanceAt = cueAt(scene, 'distance');
  const averageVelocityAt = cueAt(scene, 'average-velocity');
  const averageSpeedAt = cueAt(scene, 'average-speed');
  const forwardProgress = useProgress(forwardAt, backwardAt);
  const backwardProgress = useProgress(backwardAt, displacementAt);
  const currentT = forwardProgress < 1 ? forwardProgress * 6 : 6 + backwardProgress * 4;
  const signedPosition = 24 * forwardProgress - 8 * backwardProgress;
  const travelled = 24 * forwardProgress + 8 * backwardProgress;
  const velocity = valueAt(S07_POINTS, currentT);
  const direction: 1 | -1 = currentT > 6 && currentT < 10 ? -1 : 1;
  const plot: PlotSpec = { x: 100, y: 58, width: 820, height: 470, xMax: 10, yMin: -5, yMax: 9 };
  const zeroY = yFor(plot, 0);
  const positivePolygon = `${xFor(plot, 0)},${zeroY} ${xFor(plot, 3)},${yFor(plot, 8)} ${xFor(plot, 6)},${zeroY}`;
  const negativePolygon = `${xFor(plot, 6)},${zeroY} ${xFor(plot, 8)},${yFor(plot, -4)} ${xFor(plot, 10)},${zeroY}`;

  return (
    <SceneShell scene={7} label="signed vs absolute">
      <SectionTitle kicker="direction changes the answer">Displacement and distance diverge</SectionTitle>
      <div style={{ position: 'absolute', left: 64, top: 207, width: 1045, height: 650, borderRadius: 28, background: T.ivory, border: `3px solid ${T.teal}`, boxShadow: '0 18px 58px #0008' }}>
        <svg width="1045" height="650" viewBox="0 0 1045 650">
          <defs><clipPath id="s07-line-clip"><rect x={plot.x - 7} y={plot.y - 7} width={(currentT / 10) * plot.width + 14} height={plot.height + 14} /></clipPath></defs>
          <PlotAxes plot={plot} xTicks={[0, 2, 4, 6, 8, 10]} yTicks={[-4, -2, 0, 2, 4, 6, 8]} />
          <polygon points={positivePolygon} fill={T.teal} opacity={0.68 * useCue(forwardAt, 0.38).opacity} />
          <polygon points={negativePolygon} fill={T.coral} opacity={0.7 * useCue(backwardAt, 0.38).opacity} />
          <path d={pathFor(S07_POINTS, plot)} fill="none" stroke={T.cyan} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" clipPath="url(#s07-line-clip)" />
          <g opacity={useCue(forwardAt, 0.35).opacity}>
            <rect x={xFor(plot, 3) - 102} y={yFor(plot, 3.3) - 26} width={204} height={52} rx={10} fill={T.ink} />
            <text x={xFor(plot, 3)} y={yFor(plot, 3.3) + 10} fill={T.teal} fontFamily={T.mono} fontSize={30} fontWeight={950} textAnchor="middle">+24 m</text>
          </g>
          <g opacity={useCue(backwardAt, 0.35).opacity}>
            <rect x={xFor(plot, 8) - 94} y={yFor(plot, -1.8) - 26} width={188} height={52} rx={10} fill={T.ink} />
            <text x={xFor(plot, 8)} y={yFor(plot, -1.8) + 10} fill={T.coral} fontFamily={T.mono} fontSize={30} fontWeight={950} textAnchor="middle">−8 m</text>
          </g>
        </svg>
      </div>
      <Cued at={displacementAt} fromX={35} style={{ position: 'absolute', left: 1170, top: 226, width: 660 }}>
        <WarmCard accent={T.teal} style={{ padding: '23px 28px' }}>
          <div style={{ color: cardInk(T.teal), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>SIGNED BALANCE · DISPLACEMENT</div>
          <div style={{ position: 'relative', height: 72, marginTop: 12 }}>
            <div style={{ position: 'absolute', left: 12, right: 12, top: 59, height: 7, background: T.ink, transform: 'rotate(-2deg)' }} />
            <div style={{ position: 'absolute', left: 30, top: 4, color: cardInk(T.teal), fontFamily: T.mono, fontSize: 34, fontWeight: 950 }}>24</div>
            <div style={{ position: 'absolute', left: 280, top: 4, color: cardInk(T.coral), fontFamily: T.mono, fontSize: 34, fontWeight: 950 }}>− 8</div>
            <div style={{ position: 'absolute', right: 25, top: 0, color: T.ink, fontFamily: T.mono, fontSize: 44, fontWeight: 950 }}>= 16 m</div>
          </div>
        </WarmCard>
      </Cued>
      <Cued at={distanceAt} fromX={35} style={{ position: 'absolute', left: 1170, top: 420, width: 660 }}>
        <WarmCard accent={T.amber} style={{ padding: '23px 28px' }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>ABSOLUTE BALANCE · DISTANCE</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 48, fontWeight: 950, marginTop: 15 }}>24 + 8 = 32 m</div>
        </WarmCard>
      </Cued>
      <Cued at={averageVelocityAt} fromX={35} style={{ position: 'absolute', left: 1170, top: 593, width: 660 }}>
        <WarmCard accent={T.cyan} style={{ padding: '21px 27px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>AVERAGE VELOCITY</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 43, fontWeight: 950 }}>1.6 m/s</div>
        </WarmCard>
      </Cued>
      <Cued at={averageSpeedAt} fromX={35} style={{ position: 'absolute', left: 1170, top: 746, width: 660 }}>
        <WarmCard accent={T.green} style={{ padding: '21px 27px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: cardInk(T.green), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>AVERAGE SPEED</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 43, fontWeight: 950 }}>3.2 m/s</div>
        </WarmCard>
      </Cued>
      <Road top={892} left={100} width={1000} />
      <LabCar x={190 + signedPosition * 28} y={820} direction={direction} wheelTurns={travelled / 3.5} arrowLength={Math.abs(velocity) * 13} color={direction === -1 ? T.coral : T.cyan} opacity={useCue(forwardAt, 0.35).opacity} scale={0.8} />
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S08 — THE SUVAT BRIDGE
// ─────────────────────────────────────────────────────────────────────────────

const Scene08: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const constantAt = cueAt(scene, 'constant-acceleration');
  const suvatAt = cueAt(scene, 'suvat');
  const displacementAt = cueAt(scene, 'displacement');
  const cornerAt = cueAt(scene, 'corner');
  const accelerationTravel = useProgress(constantAt, suvatAt);
  const areaTravel = useProgress(displacementAt, cornerAt);
  const cornerCue = useCue(cornerAt, 0.4);
  const plot: PlotSpec = { x: 92, y: 65, width: 650, height: 450, xMax: 7, yMin: 0, yMax: 12 };
  const points: DataPoint[] = [{ t: 0, v: 3 }, { t: 4, v: 11 }, { t: 7, v: 5 }];
  const zeroY = yFor(plot, 0);
  const firstArea = `${xFor(plot, 0)},${zeroY} ${xFor(plot, 0)},${yFor(plot, 3)} ${xFor(plot, 4)},${yFor(plot, 11)} ${xFor(plot, 4)},${zeroY}`;

  return (
    <SceneShell scene={8} label="suvat bridge">
      <SectionTitle kicker="two methods, one motion">Gradient and area feed suvat</SectionTitle>
      <div style={{ position: 'absolute', left: 65, top: 218, width: 865, height: 650, borderRadius: 28, background: T.ivory, border: `3px solid ${T.cyan}`, boxShadow: '0 18px 58px #0008' }}>
        <div style={{ position: 'absolute', left: 28, top: 18, color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>GRAPH ANALYSER</div>
        <svg width="850" height="620" viewBox="0 0 850 620" style={{ marginTop: 24 }}>
          <PlotAxes plot={plot} xTicks={[0, 1, 2, 3, 4, 5, 6, 7]} yTicks={[0, 3, 5, 7, 9, 11]} />
          <polygon points={firstArea} fill={T.teal} opacity={0.35 * useCue(displacementAt, 0.35).opacity} />
          <path d={pathFor(points, plot)} fill="none" stroke={T.cyan} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
          <path d={`M ${xFor(plot, 0)} ${yFor(plot, 3)} L ${xFor(plot, 4)} ${yFor(plot, 3)} L ${xFor(plot, 4)} ${yFor(plot, 11)}`} fill="none" stroke={T.amber} strokeWidth={8} strokeLinejoin="round" opacity={useCue(constantAt, 0.35).opacity} />
          <line x1={xFor(plot, 4)} y1={plot.y} x2={xFor(plot, 4)} y2={plot.y + plot.height} stroke={T.coral} strokeWidth={5} strokeDasharray="12 9" opacity={cornerCue.opacity} />
          <circle cx={xFor(plot, 4)} cy={yFor(plot, 11)} r={15} fill={T.coral} opacity={cornerCue.opacity} />
        </svg>
      </div>
      <Cued at={suvatAt} fromX={45} style={{ position: 'absolute', right: 68, top: 225, width: 820 }}>
        <div style={{ borderRadius: 30, border: `3px solid ${T.amber}`, background: `${T.panel}f5`, boxShadow: `0 18px 58px #0009, 0 0 32px ${T.amber}20`, padding: '30px 36px', minHeight: 430 }}>
          <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 31, fontWeight: 950, letterSpacing: 4 }}>SUVAT CONSOLE</div>
          <div style={{ display: 'flex', gap: 24, marginTop: 28 }}>
            <div style={{ flex: 1, padding: '22px', borderRadius: 18, background: T.ivory, color: T.ink }}>
              <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>VELOCITY</div>
              <div style={{ fontFamily: T.mono, fontSize: 39, fontWeight: 950, marginTop: 17 }}>v = u + at</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 14 }}>11 = 3 + 2(4)</div>
            </div>
            <div style={{ flex: 1, padding: '22px', borderRadius: 18, background: T.ivory, color: T.ink, opacity: useCue(displacementAt, 0.35).opacity }}>
              <div style={{ color: cardInk(T.teal), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>DISPLACEMENT</div>
              <div style={{ fontFamily: T.mono, fontSize: 36, fontWeight: 950, marginTop: 17 }}>s = (u+v)t/2</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 14 }}>s = 28 m</div>
            </div>
          </div>
          <div style={{ marginTop: 28, color: T.muted, fontFamily: T.mono, fontSize: 28, fontWeight: 800 }}>STRAIGHT SECTION · CONSTANT a</div>
        </div>
      </Cued>
      <div style={{ position: 'absolute', left: 735 + accelerationTravel * 365, top: 575, width: 270, opacity: useCue(constantAt, 0.3).opacity }}>
        <WarmCard accent={T.amber} style={{ padding: '17px 20px', textAlign: 'center' }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>a = 2 m/s²</div>
        </WarmCard>
      </div>
      <div style={{ position: 'absolute', left: 735 + areaTravel * 710, top: 575, width: 270, opacity: useCue(displacementAt, 0.3).opacity }}>
        <WarmCard accent={T.teal} style={{ padding: '17px 20px', textAlign: 'center' }}>
          <div style={{ color: cardInk(T.teal), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>AREA = 28 m</div>
        </WarmCard>
      </div>
      <div style={{ position: 'absolute', left: 1050, right: 70, top: 780, display: 'flex', gap: 24, opacity: cornerCue.opacity, transform: `translateY(${(1 - cornerCue.opacity) * 24}px)` }}>
        {['SECTION A · a = +2', 'SECTION B · a = −2'].map((label, index) => (
          <div key={label} style={{ flex: 1, height: 120, borderRadius: 20, border: `3px solid ${index === 0 ? T.teal : T.coral}`, background: T.panel, color: index === 0 ? T.teal : T.coral, display: 'grid', placeItems: 'center', fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>{label}</div>
        ))}
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S09 — THREE EXAM CHECKS
// ─────────────────────────────────────────────────────────────────────────────

const InspectionCard: React.FC<{
  at: number;
  number: number;
  title: string;
  warning: string;
  result: string;
  color: string;
  x: number;
}> = ({ at, number, title, warning, result, color, x }) => {
  const cue = useCue(at, 0.45);
  const settle = useProgress(at, at + 0.4);
  return (
    <div style={{ position: 'absolute', left: x, top: 280, width: 540, height: 520, opacity: cue.opacity, transform: `translateY(${(1 - cue.opacity) * 34}px)` }}>
      <WarmCard accent={color} style={{ width: '100%', height: '100%', padding: '32px 34px', textAlign: 'center' }}>
        <div style={{ margin: '0 auto', width: 92, height: 92, borderRadius: '50%', background: settle > 0.65 ? T.green : T.coral, border: `8px solid ${T.ink}`, boxShadow: `0 0 32px ${settle > 0.65 ? T.green : T.coral}66`, display: 'grid', placeItems: 'center', color: T.ink, fontFamily: T.mono, fontSize: 45, fontWeight: 950 }}>{settle > 0.65 ? '✓' : '!'}</div>
        <div style={{ color: cardInk(color), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2, marginTop: 24 }}>CHECK {number}</div>
        <div style={{ color: T.ink, fontSize: 40, fontWeight: 950, marginTop: 18 }}>{title}</div>
        <div style={{ height: 3, background: `${T.ink}22`, margin: '28px 0' }} />
        <div style={{ color: settle > 0.65 ? cardInk(T.green) : cardInk(T.coral), fontFamily: T.mono, fontSize: 31, fontWeight: 950, minHeight: 78, display: 'grid', placeItems: 'center' }}>{settle > 0.65 ? result : warning}</div>
      </WarmCard>
    </div>
  );
};

const Scene09: React.FC<{ scene: TranscriptScene }> = ({ scene }) => (
  <SceneShell scene={9} label="exam inspection">
    <SectionTitle kicker="final inspection">Three checks before you finish</SectionTitle>
    <InspectionCard at={cueAt(scene, 'velocity-time')} number={1} title="GRAPH TYPE" warning="s–t ?" result="v–t ✓" color={T.cyan} x={105} />
    <InspectionCard at={cueAt(scene, 'negative')} number={2} title="AREA SIGN" warning="below = + ?" result="below = − ✓" color={T.coral} x={690} />
    <InspectionCard at={cueAt(scene, 'squared')} number={3} title="GRADIENT UNIT" warning="m/s ?" result="m/s² ✓" color={T.amber} x={1275} />
    <div style={{ position: 'absolute', left: 305, right: 305, top: 858, display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ flex: 1, height: 4, background: T.cyan }} />
      <div style={{ color: T.text, fontFamily: T.mono, fontSize: 30, fontWeight: 950, letterSpacing: 3 }}>TYPE · SIGN · UNIT</div>
      <div style={{ flex: 1, height: 4, background: T.cyan }} />
    </div>
  </SceneShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// S10 — TWENTY-SECOND RECAP
// ─────────────────────────────────────────────────────────────────────────────

const S10_POINTS: DataPoint[] = [
  { t: 0, v: 0 }, { t: 2, v: 6 }, { t: 5, v: 6 },
  { t: 7, v: 0 }, { t: 9, v: -3 }, { t: 11, v: 0 },
];

const DashboardChip: React.FC<{
  at: number;
  title: string;
  value: string;
  color: string;
  style?: React.CSSProperties;
}> = ({ at, title, value, color, style }) => {
  const cue = useCue(at, 0.38);
  return (
    <div style={{ opacity: cue.opacity, transform: `scale(${0.92 + cue.opacity * 0.08})`, ...style }}>
      <WarmCard accent={color} style={{ height: '100%', padding: '16px 20px' }}>
        <div style={{ color: cardInk(color), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>{title}</div>
        <div style={{ color: T.ink, fontSize: 28, fontWeight: 850, marginTop: 8 }}>{value}</div>
      </WarmCard>
    </div>
  );
};

const Scene10: React.FC<{ scene: TranscriptScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const heightAt = cueAt(scene, 'height');
  const gradientAt = cueAt(scene, 'gradient');
  const signedAt = cueAt(scene, 'signed-area');
  const absoluteAt = cueAt(scene, 'absolute-area');
  const flatAt = cueAt(scene, 'flat-line');
  const crossingAt = cueAt(scene, 'crossing-zero');
  const averageVelocityAt = cueAt(scene, 'average-velocity');
  const averageSpeedAt = cueAt(scene, 'average-speed');
  const journeyT = interpolate(
    seconds,
    [heightAt, crossingAt, Math.max(crossingAt + 0.2, averageSpeedAt)],
    [0, 7, 11],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const velocity = valueAt(S10_POINTS, journeyT);
  const displacement = areaAt(S10_POINTS, journeyT);
  const fullDistance = journeyT <= 7 ? Math.abs(displacement) : 30 + Math.abs(displacement - 30);
  const direction: 1 | -1 = journeyT > 7 && journeyT < 11 ? -1 : 1;
  const plot: PlotSpec = { x: 98, y: 55, width: 925, height: 470, xMax: 11, yMin: -4, yMax: 7 };
  const zeroY = yFor(plot, 0);
  const positivePolygon = `${xFor(plot, 0)},${zeroY} ${xFor(plot, 2)},${yFor(plot, 6)} ${xFor(plot, 5)},${yFor(plot, 6)} ${xFor(plot, 7)},${zeroY}`;
  const negativePolygon = `${xFor(plot, 7)},${zeroY} ${xFor(plot, 9)},${yFor(plot, -3)} ${xFor(plot, 11)},${zeroY}`;
  const tileWidth = plot.width / plot.xMax;
  const tileHeight = plot.height / (plot.yMax - plot.yMin);
  const positiveTiles = Array.from({ length: 66 }, (_, index) => ({
    column: index % 11,
    velocityRow: Math.floor(index / 11),
  }));
  const negativeTiles = Array.from({ length: 33 }, (_, index) => ({
    column: index % 11,
    velocityRow: -3 + Math.floor(index / 11),
  }));
  const tilePulse = 0.86 + Math.sin(Math.max(0, frame - signedAt * fps) / 5) * 0.14;
  const heightCue = useCue(heightAt, 0.35);
  const gradientCue = useCue(gradientAt, 0.35);
  const signedCue = useCue(signedAt, 0.35);
  const flatCue = useCue(flatAt, 0.35);
  const crossingCue = useCue(crossingAt, 0.35);
  const lockCue = useCue(averageSpeedAt, 0.42);

  return (
    <SceneShell scene={10} label="recap dashboard">
      <SectionTitle kicker="twenty-second recap">One dashboard, every graph fact</SectionTitle>
      <div style={{ position: 'absolute', left: 60, top: 202, width: 1150, height: 660, borderRadius: 28, background: T.ivory, border: `3px solid ${T.cyan}`, boxShadow: `0 18px 58px #0008, 0 0 ${lockCue.opacity * 44}px ${T.green}55` }}>
        <svg width="1150" height="660" viewBox="0 0 1150 660">
          <defs>
            <clipPath id="s10-line-clip"><rect x={plot.x - 8} y={plot.y - 8} width={(journeyT / 11) * plot.width + 16} height={plot.height + 16} /></clipPath>
            <clipPath id="s10-area-clip"><rect x={plot.x} y={plot.y} width={(journeyT / 11) * plot.width} height={plot.height} /></clipPath>
            <clipPath id="s10-positive-area"><polygon points={positivePolygon} /></clipPath>
            <clipPath id="s10-negative-area"><polygon points={negativePolygon} /></clipPath>
          </defs>
          <PlotAxes plot={plot} xTicks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]} yTicks={[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]} gridOpacity={0.12} />
          <g clipPath="url(#s10-area-clip)">
            <g clipPath="url(#s10-positive-area)" opacity={signedCue.opacity * tilePulse}>
              {positiveTiles.map(({ column, velocityRow }) => (
                <rect
                  key={`positive-${column}-${velocityRow}`}
                  x={xFor(plot, column) + 3}
                  y={yFor(plot, velocityRow + 1) + 3}
                  width={tileWidth - 6}
                  height={tileHeight - 6}
                  rx={4}
                  fill={T.teal}
                  stroke={cardInk(T.teal)}
                  strokeWidth={2}
                />
              ))}
            </g>
            <g clipPath="url(#s10-negative-area)" opacity={crossingCue.opacity * tilePulse}>
              {negativeTiles.map(({ column, velocityRow }) => (
                <rect
                  key={`negative-${column}-${velocityRow}`}
                  x={xFor(plot, column) + 3}
                  y={yFor(plot, velocityRow + 1) + 3}
                  width={tileWidth - 6}
                  height={tileHeight - 6}
                  rx={4}
                  fill={T.coral}
                  stroke={cardInk(T.coral)}
                  strokeWidth={2}
                />
              ))}
            </g>
          </g>
          <path d={pathFor(S10_POINTS, plot)} fill="none" stroke={T.cyan} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" clipPath="url(#s10-line-clip)" />
          <line x1={xFor(plot, 2)} y1={yFor(plot, 6)} x2={xFor(plot, 5)} y2={yFor(plot, 6)} stroke={T.amber} strokeWidth={15} strokeLinecap="round" opacity={flatCue.opacity} />
          <path d={`M ${xFor(plot, 0)} ${yFor(plot, 0)} L ${xFor(plot, 2)} ${yFor(plot, 0)} L ${xFor(plot, 2)} ${yFor(plot, 6)} Z`} fill={`${T.amber}15`} stroke={T.amber} strokeWidth={7} opacity={gradientCue.opacity} />
          <line x1={xFor(plot, journeyT)} y1={zeroY} x2={xFor(plot, journeyT)} y2={yFor(plot, velocity)} stroke={T.purple} strokeWidth={7} strokeDasharray="10 7" opacity={heightCue.opacity} />
          {journeyT > 0 && <circle cx={xFor(plot, journeyT)} cy={yFor(plot, velocity)} r={13} fill={velocity < 0 ? T.coral : T.amber} stroke={T.ink} strokeWidth={4} />}
          <g opacity={heightCue.opacity}>
            <rect x={690} y={68} width={330} height={50} rx={10} fill={T.ink} />
            <text x={855} y={103} fill={T.purple} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">HEIGHT = VELOCITY</text>
          </g>
          <g opacity={crossingCue.opacity}>
            <circle cx={xFor(plot, 7)} cy={zeroY} r={18} fill={T.coral} stroke={T.ink} strokeWidth={5} />
            <line x1={xFor(plot, 7) + 15} y1={zeroY - 10} x2={740} y2={308} stroke={T.coral} strokeWidth={4} />
            <rect x={740} y={258} width={252} height={50} rx={10} fill={T.ink} />
            <text x={866} y={293} fill={T.coral} fontFamily={T.mono} fontSize={28} fontWeight={900} textAnchor="middle">CHANGE DIRECTION</text>
          </g>
        </svg>
      </div>
      <div style={{ position: 'absolute', right: 85, top: 130 }}><VelocityGauge value={velocity} min={-4} max={7} /></div>
      <div style={{ position: 'absolute', left: 1260, top: 482, width: 575, height: 238, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DashboardChip at={gradientAt} title="GRADIENT" value="acceleration" color={T.amber} />
        <DashboardChip at={signedAt} title="SIGNED AREA" value="displacement" color={T.teal} />
        <DashboardChip at={absoluteAt} title="ABSOLUTE AREA" value="distance" color={T.coral} />
        <DashboardChip at={flatAt} title="FLAT LINE" value="constant v" color={T.cyan} />
      </div>
      <Cued at={averageVelocityAt} fromY={24} style={{ position: 'absolute', left: 1260, top: 746, width: 575 }}>
        <WarmCard accent={T.purple} style={{ padding: '19px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: cardInk(T.purple), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>AVG VELOCITY</span>
          <span style={{ color: T.ink, fontFamily: T.mono, fontSize: 38, fontWeight: 950 }}>24÷11</span>
        </WarmCard>
      </Cued>
      <Cued at={averageSpeedAt} fromY={24} style={{ position: 'absolute', left: 1260, top: 862, width: 575 }}>
        <WarmCard accent={T.green} style={{ padding: '19px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: `0 0 ${24 + lockCue.opacity * 26}px ${T.green}55` }}>
          <span style={{ color: cardInk(T.green), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>AVG SPEED</span>
          <span style={{ color: T.ink, fontFamily: T.mono, fontSize: 38, fontWeight: 950 }}>36÷11</span>
        </WarmCard>
      </Cued>
      <Road top={890} left={90} width={1080} />
      <LabCar x={215 + displacement * 26} y={837} direction={direction} wheelTurns={fullDistance / 3.2} arrowLength={Math.abs(velocity) * 15} color={direction === -1 ? T.coral : T.cyan} opacity={heightCue.opacity} scale={0.82} />
      <div style={{ position: 'absolute', left: 125, top: 795, width: 330, padding: '7px 13px', borderRadius: 10, background: T.ink, color: direction === -1 ? T.coral : T.teal, fontFamily: T.mono, fontSize: 28, fontWeight: 950, textAlign: 'left', opacity: crossingCue.opacity }}>{direction === -1 ? 'REVERSING ←' : journeyT >= 11 ? 'PARKED · v = 0' : 'FORWARD →'}</div>
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
  scene: TranscriptScene;
  audioEnabled: boolean;
  children: React.ReactNode;
}> = ({ scene, audioEnabled, children }) => (
  <AbsoluteFill>
    {children}
    {audioEnabled && <Audio src={staticFile(`audio/mechanics/${scene.audio}`)} volume={1} />}
  </AbsoluteFill>
);

export const MechanicsVelocityTimeGraphs: React.FC<MechanicsVelocityTimeGraphsProps> = ({
  audioEnabled = true,
}) => {
  const { fps } = useVideoConfig();
  const transition = <TransitionSeries.Transition presentation={fadeThroughGraphite} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S01, fps)}><NarratedScene scene={S01} audioEnabled={audioEnabled}><Scene01 scene={S01} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S02, fps)}><NarratedScene scene={S02} audioEnabled={audioEnabled}><Scene02 scene={S02} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S03, fps)}><NarratedScene scene={S03} audioEnabled={audioEnabled}><Scene03 scene={S03} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S04, fps)}><NarratedScene scene={S04} audioEnabled={audioEnabled}><Scene04 scene={S04} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S05, fps)}><NarratedScene scene={S05} audioEnabled={audioEnabled}><Scene05 scene={S05} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S06, fps)}><NarratedScene scene={S06} audioEnabled={audioEnabled}><Scene06 scene={S06} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S07, fps)}><NarratedScene scene={S07} audioEnabled={audioEnabled}><Scene07 scene={S07} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S08, fps)}><NarratedScene scene={S08} audioEnabled={audioEnabled}><Scene08 scene={S08} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S09, fps)}><NarratedScene scene={S09} audioEnabled={audioEnabled}><Scene09 scene={S09} /></NarratedScene></TransitionSeries.Sequence>
        {transition}
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S10, fps)}><NarratedScene scene={S10} audioEnabled={audioEnabled}><Scene10 scene={S10} /></NarratedScene></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
