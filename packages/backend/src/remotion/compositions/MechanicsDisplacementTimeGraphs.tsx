/**
 * Displacement-Time Graphs
 *
 * A ten-scene, narration-driven mechanics explainer. Word-level Whisper cues
 * trigger every instructional reveal and the encoded narration determines each
 * scene's duration.
 */

import React, {useMemo, useLayoutEffect, useRef, useState} from 'react';
import {
  AbsoluteFill,
  Artifact,
  Freeze,
  delayRender,
  continueRender,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import transcriptJson from '../public/transcripts/mechanics/displacement-time-graphs.json';
import { useCue } from './ProjectComposition';

const TRANSITION_FRAMES = 15;
const PREMOUNT_FRAMES = 30;

const T = {
  bg: '#061522',
  bgDeep: '#03101b',
  panel: '#0d2536',
  panelLight: '#17384a',
  card: '#fff8e8',
  cardMuted: '#e7dfcf',
  ink: '#102435',
  text: '#f8f3e7',
  textMuted: '#9db2bd',
  cyan: '#42dbe8',
  cyanSoft: '#8decf2',
  amber: '#f4aa45',
  red: '#ef6f63',
  green: '#61d095',
  purple: '#b69cff',
  sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
};

const cardInk = (color: string): string => ({
  [T.cyan]: '#087782',
  [T.cyanSoft]: '#087782',
  [T.amber]: '#925000',
  [T.green]: '#237347',
  [T.red]: '#b6342c',
  [T.purple]: '#6940a0',
}[color] ?? color);

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

interface MechanicsTranscriptScene {
  id: string;
  audio: string;
  duration: number;
  wordCount: number;
  text: string;
  words: TranscriptWord[];
  cues: Record<string, number>;
  holds?: Array<{kind:string;start:number;end:number;duration:number}>;
  figureEvents?: FigureEvent[];
}

interface MechanicsTranscript {
  project: string;
  sceneCount: number;
  scenes: MechanicsTranscriptScene[];
  totalDuration: number;
  generatedAt: string;
  engine: string;
}

const TRANSCRIPT = transcriptJson as unknown as MechanicsTranscript;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function cueAt(scene: MechanicsTranscriptScene, cueName: string): number {
  const match = Object.entries(scene.cues).find(
    ([name]) => normalize(name) === normalize(cueName),
  );
  return match?.[1] ?? scene.duration + 1;
}

/** Resolve an additional spoken phrase when a storyboard cue is not needed. */
function spokenAt(
  scene: MechanicsTranscriptScene,
  phrase: string,
  occurrence = 1,
): number {
  const namedCue = Object.entries(scene.cues).find(
    ([name]) => normalize(name) === normalize(phrase),
  );
  if (namedCue) return namedCue[1];

  const targets = phrase.split(/\s+/).map(normalize).filter(Boolean);
  const words = scene.words.map(({ word }) => normalize(word));
  let matches = 0;
  for (let index = 0; index <= words.length - targets.length; index += 1) {
    if (targets.every((target, offset) => words[index + offset] === target)) {
      matches += 1;
      if (matches === occurrence) return scene.words[index].start;
    }
  }
  return scene.duration + 1;
}

function getScene(id: string): MechanicsTranscriptScene {
  const scene = TRANSCRIPT.scenes.find((candidate) => candidate.id === id);
  if (!scene) throw new Error(`Missing transcript scene: ${id}`);
  if(!scene.figureEvents&&id==='s04')scene.figureEvents=[{id:'spoken-zero',word:'zero',start:scene.words.find(w=>normalize(w.word)==='zero')!.start,end:scene.words.find(w=>normalize(w.word)==='zero')!.end,target:'rest-zero'}];
  if(!scene.figureEvents&&id==='s06')scene.figureEvents=[{id:'spoken-zero',word:'zero',start:scene.words.find(w=>normalize(w.word)==='zero')!.start,end:scene.words.find(w=>normalize(w.word)==='zero')!.end,target:'origin-zero'}];
  return scene;
}

function sceneDurationInFrames(scene: MechanicsTranscriptScene, fps: number): number {
  return Math.ceil(scene.duration * fps) + TRANSITION_FRAMES;
}

export function getMechanicsDisplacementTimeGraphsDuration(fps: number): number {
  const sequenceFrames = TRANSCRIPT.scenes.reduce(
    (sum, scene) => sum + sceneDurationInFrames(scene, fps),
    0,
  );
  return sequenceFrames - (TRANSCRIPT.scenes.length - 1) * TRANSITION_FRAMES;
}

export interface MechanicsDisplacementTimeGraphsProps {
  audioEnabled?: boolean;
  audit?: boolean;
}

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

function useProgress(startSeconds: number, endSeconds: number): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const safeEnd = Math.max(startSeconds + 0.12, endSeconds);
  return interpolate(
    frame,
    [startSeconds * fps, safeEnd * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function useSpringAt(at: number, durationInFrames = 24): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - at * fps),
    fps,
    durationInFrames,
    config: { damping: 17, stiffness: 165, mass: 0.75 },
  });
  return frame < at * fps ? 0 : progress;
}

const Cued: React.FC<{
  at: number;
  children: React.ReactNode;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  style?: React.CSSProperties;
}> = ({ at, children, fromX = 0, fromY = 22, fromScale = 0.97, style }) => {
  const cue = useCue(at, 0.42);
  return (
    <div
      style={{
        opacity: cue.opacity,
        transform: `translate(${(1 - cue.opacity) * fromX}px, ${(1 - cue.opacity) * fromY}px) scale(${fromScale + cue.opacity * (1 - fromScale)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const MathTeX: React.FC<{
  tex: string;
  fontSize?: number;
  color?: string;
  display?: boolean;
  style?: React.CSSProperties;
}> = ({ tex, fontSize = 46, color = T.text, display = true, style }) => {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
    output: 'html',
    strict: false,
  });
  return (
    <div style={{ color, fontSize, lineHeight: 1.25, ...style }}>
      <style>{`.katex { font-size: 1em; } .katex * { color: inherit; }`}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

const WarmCard: React.FC<{
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, accent = T.cyan, style }) => (
  <div data-region="card"
    style={{
      borderRadius: 26,
      boxSizing: 'border-box',
      background: T.card,
      color: T.ink,
      border: `3px solid ${accent}`,
      boxShadow: `0 18px 55px #0007, 0 0 28px ${accent}18`,
      ...style,
    }}
  >
    {children}
  </div>
);

const StepBadge: React.FC<{ scene: number; label: string }> = ({ scene, label }) => (
  <div
    style={{
      position: 'absolute',
      top: 48,
      right: 58,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 18px',
      borderRadius: 999,
      border: `1px solid ${T.cyan}55`,
      background: `${T.bgDeep}dd`,
      color: T.textMuted,
      fontFamily: T.mono,
      fontSize: 28,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    }}
  >
    <span style={{ color: T.cyan, fontWeight: 900 }}>
      {''}
    </span>
    <span>{''}</span>
  </div>
);

const SceneShell: React.FC<{
  scene: number;
  label: string;
  children: React.ReactNode;
}> = ({ scene, label, children }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 76) * 9;
  return (
    <AbsoluteFill data-scene={scene}
      style={{
        overflow: 'hidden',
        isolation: 'isolate',
        background: T.bg,
        fontFamily: T.sans,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${25 + drift / 5}% 17%, ${T.cyan}16, transparent 35%), radial-gradient(circle at 81% 88%, ${T.amber}10, transparent 31%), linear-gradient(145deg, ${T.bgDeep}, ${T.bg})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.13,
          backgroundImage: `linear-gradient(${T.cyan}30 1px, transparent 1px), linear-gradient(90deg, ${T.cyan}30 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          transform: `translateX(${drift}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 48,
          color: T.textMuted,
          fontFamily: T.mono,
          fontSize: 28,
          letterSpacing: 2.6,
        }}
      >
        {''}
      </div>
      <span />
      {children}
      <div
        style={{
          position: 'absolute',
          left: 58,
          right: 58,
          bottom: 38,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${T.cyan}66 15%, ${T.cyan}66 85%, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

const SectionTitle: React.FC<{
  kicker: string;
  children: React.ReactNode;
  at?: number;
}> = ({ kicker, children, at }) => {
  const content = (
    <div style={{ position: 'absolute', left: 86, top: 108, zIndex: 12 }}>
      <div
        style={{
          color: T.cyan,
          fontFamily: T.mono,
          fontSize: 28,
          fontWeight: 850,
          letterSpacing: 2.4,
          textTransform: 'uppercase',
        }}
      >
        {''}
      </div>
      <div style={{ color: T.text, fontSize: 52, fontWeight: 900, marginTop: 7 }}>
        {children}
      </div>
    </div>
  );
  return at === undefined ? content : <Cued at={at}>{content}</Cued>;
};

interface PlotScale {
  x: (value: number) => number;
  y: (value: number) => number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const makePlotScale = (
  width: number,
  height: number,
  xMax: number,
  yMin: number,
  yMax: number,
  compact = false,
): PlotScale => {
  const left = compact ? 78 : 112;
  const right = compact ? 26 : 42;
  const top = compact ? 28 : 48;
  const bottom = compact ? 74 : 92;
  return {
    x: (value) => left + value / xMax * (width - left - right),
    y: (value) => top + (yMax - value) / (yMax - yMin) * (height - top - bottom),
    left,
    right,
    top,
    bottom,
  };
};

const GraphAxes: React.FC<{
  width: number;
  height: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xTicks: number[];
  yTicks: number[];
  id: string;
  compact?: boolean;
  axisOpacity?: number;
  xLabelOpacity?: number;
  yLabelOpacity?: number;
  xTickLabelOpacity?: (tick: number) => number;
  yTickLabelOpacity?: (tick: number) => number;
}> = ({
  width,
  height,
  xMax,
  yMin,
  yMax,
  xTicks,
  yTicks,
  id,
  compact = false,
  axisOpacity = 1,
  xLabelOpacity = 1,
  yLabelOpacity = 1,
  xTickLabelOpacity,
  yTickLabelOpacity,
}) => {
  const scale = makePlotScale(width, height, xMax, yMin, yMax, compact);
  const plotBottom = height - scale.bottom;
  const plotRight = width - scale.right;
  const zeroY = scale.y(Math.max(yMin, Math.min(yMax, 0)));
  const tickFontSize = compact && height<300 ? 17 : compact ? 23 : 28;
  return (
    <g data-region="graph">
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect
            x={scale.left}
            y={scale.top}
            width={plotRight - scale.left}
            height={plotBottom - scale.top}
          />
        </clipPath>
      </defs>
      <rect
        x={1.5}
        y={1.5}
        width={width - 3}
        height={height - 3}
        rx={compact ? 20 : 25}
        fill={T.card}
        stroke={`${T.cyan}88`}
        strokeWidth={3}
      />
      {xTicks.map((tick) => (
        <g key={`x-${tick}`}>
          <line
            x1={scale.x(tick)}
            y1={scale.top}
            x2={scale.x(tick)}
            y2={plotBottom}
            stroke={tick === 0 ? `${T.ink}55` : `${T.ink}1d`}
            strokeWidth={tick === 0 ? 3 : 2}
          />
          <line
            x1={scale.x(tick)}
            y1={zeroY - 8}
            x2={scale.x(tick)}
            y2={zeroY + 8}
            stroke={T.ink}
            strokeWidth={3}
            opacity={axisOpacity}
          />
          <text data-axis-text
            x={scale.x(tick)}
            y={plotBottom + (compact ? 23 : 34)}
            fill={T.ink}
            textAnchor="middle"
            fontFamily={T.mono}
            fontSize={tickFontSize}
            opacity={xTickLabelOpacity?.(tick) ?? axisOpacity}
          >
            {tick}
          </text>
        </g>
      ))}
      {yTicks.map((tick) => (
        <g key={`y-${tick}`}>
          <line
            x1={scale.left}
            y1={scale.y(tick)}
            x2={plotRight}
            y2={scale.y(tick)}
            stroke={tick === 0 ? `${T.ink}55` : `${T.ink}1d`}
            strokeWidth={tick === 0 ? 3 : 2}
          />
          <line
            x1={scale.left - 8}
            y1={scale.y(tick)}
            x2={scale.left + 8}
            y2={scale.y(tick)}
            stroke={T.ink}
            strokeWidth={3}
            opacity={axisOpacity}
          />
          <text data-axis-text data-figure={tick===0?(id==='s06'?'origin-zero':undefined):undefined}
            x={scale.left - 18}
            y={scale.y(tick) + (compact && height<300 ? tick===0?12:tick===2?3:9 :9)}
            fill={T.ink}
            textAnchor="end"
            fontFamily={T.mono}
            fontSize={tickFontSize}
            opacity={yTickLabelOpacity?.(tick) ?? axisOpacity}
          >
            {tick}
          </text>
        </g>
      ))}
      <line
        x1={scale.left}
        y1={zeroY}
        x2={plotRight}
        y2={zeroY}
        stroke={T.ink}
        strokeWidth={4}
        opacity={axisOpacity}
      />
      <path
        d={`M${plotRight} ${zeroY} l-18 -10 v20 z`}
        fill={T.ink}
        opacity={axisOpacity}
      />
      <line
        x1={scale.left}
        y1={plotBottom}
        x2={scale.left}
        y2={scale.top}
        stroke={T.ink}
        strokeWidth={4}
        opacity={axisOpacity}
      />
      <path
        d={`M${scale.left} ${scale.top} l-10 18 h20 z`}
        fill={T.ink}
        opacity={axisOpacity}
      />
      <text data-axis-text
        x={(scale.left + plotRight) / 2}
        y={height - (compact ? 7 : 17)}
        fill={cardInk(T.cyan)}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={compact?22:28}
        fontWeight={900}
        opacity={xLabelOpacity}
      >
        time, t / s
      </text>
      <text data-axis-text
        x={compact ? 24 : 30}
        y={(scale.top + plotBottom) / 2}
        fill={cardInk(T.cyan)}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={compact?22:28}
        fontWeight={900}
        opacity={yLabelOpacity}
        transform={`rotate(-90 ${compact ? 24 : 30} ${(scale.top + plotBottom) / 2})`}
      >
        {compact ? 's / m' : 'displacement, s / m'}
      </text>
    </g>
  );
};

const AttachedArrow: React.FC<{
  x1: number;
  x2: number;
  y: number;
  color?: string;
  opacity?: number;
  thickness?: number;
}> = ({ x1, x2, y, color = T.amber, opacity = 1, thickness = 7 }) => {
  const direction = Math.sign(x2 - x1);
  if (direction === 0 || Math.abs(x2 - x1) < 2) return null;
  const head = 20;
  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y}
        x2={x2 - direction * 3}
        y2={y}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
      <path
        d={direction > 0
          ? `M${x2} ${y} L${x2 - head} ${y - 13} L${x2 - head} ${y + 13} Z`
          : `M${x2} ${y} L${x2 + head} ${y - 13} L${x2 + head} ${y + 13} Z`}
        fill={color}
      />
    </g>
  );
};

const TrackDiagram: React.FC<{
  width: number;
  height?: number;
  min: number;
  max: number;
  position: number;
  color?: string;
  ticks?: number[];
  tickLabelOpacity?: (tick: number) => number;
  showOrigin?: boolean;
  originOpacity?: number;
  displacementArrowPosition?: number;
  displacementArrowOpacity?: number;
  direction?: -1 | 0 | 1;
  directionOpacity?: number;
  label?: string;
}> = ({
  width,
  height = 170,
  min,
  max,
  position,
  color = T.cyan,
  ticks = [min, 0, max],
  tickLabelOpacity,
  showOrigin = true,
  originOpacity = 1,
  displacementArrowPosition,
  displacementArrowOpacity = 1,
  direction = 0,
  directionOpacity = 1,
  label = 'position / m',
}) => {
  const margin = 58;
  const lineY = 76;
  const map = (value: number) => margin + (value - min) / (max - min) * (width - margin * 2);
  const particleX = map(position);
  const originX = map(0);
  const arrowPosition = displacementArrowPosition ?? position;
  const directionStart = particleX + direction * 20;
  const directionEnd = Math.max(14, Math.min(width - 14, particleX + direction * 150));
  return (
    <svg data-region="track" width={width} height={height}>
      <rect x={1.5} y={1.5} width={width - 3} height={height - 3} rx={23} fill={`${T.panel}f2`} stroke={`${T.cyan}66`} strokeWidth={3} />
      <line x1={margin} y1={lineY} x2={width - margin} y2={lineY} stroke={T.card} strokeWidth={6} strokeLinecap="round" />
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={map(tick)} y1={lineY - 14} x2={map(tick)} y2={lineY + 14} stroke={T.textMuted} strokeWidth={3} />
          <text x={map(tick)} y={lineY + 48} fill={T.textMuted} textAnchor="middle" fontFamily={T.mono} fontSize={28} opacity={tickLabelOpacity?.(tick) ?? 1}>{tick}</text>
        </g>
      ))}
      {showOrigin && (
        <g opacity={originOpacity}>
          <line x1={originX} y1={lineY - 38} x2={originX} y2={lineY + 36} stroke={T.green} strokeWidth={5} />
          <text x={originX} y={32} fill={T.green} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900}>Origin</text>
        </g>
      )}
      {displacementArrowPosition !== undefined && (
        <AttachedArrow
          x1={originX}
          x2={map(arrowPosition)}
          y={lineY - 31}
          color={T.amber}
          opacity={displacementArrowOpacity}
        />
      )}
      {direction !== 0 && (
        <AttachedArrow
          x1={directionStart}
          x2={directionEnd}
          y={lineY}
          color={T.amber}
          opacity={directionOpacity}
        />
      )}
      <circle cx={particleX} cy={lineY} r={22} fill={color} stroke={T.card} strokeWidth={6} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      <text x={width - 28} y={32} fill={T.textMuted} textAnchor="end" fontFamily={T.mono} fontSize={28}>{label}</text>
    </svg>
  );
};

const curveValue = (time: number): number => {
  const u = clamp01(time / 8);
  return 1 + 16 * (3 * u * u - 2 * u * u * u);
};

const curveGradient = (time: number): number => {
  const u = clamp01(time / 8);
  return 12 * u * (1 - u);
};

const sampledPath = (
  scale: PlotScale,
  start: number,
  end: number,
  valueAt: (time: number) => number,
  samples = 72,
): string => Array.from({ length: samples + 1 }, (_, index) => {
  const time = start + (end - start) * index / samples;
  return `${index === 0 ? 'M' : 'L'}${scale.x(time).toFixed(2)} ${scale.y(valueAt(time)).toFixed(2)}`;
}).join(' ');

// ─────────────────────────────────────────────────────────────────────────────
// S01 — POSITION LEAVES A TRACE
// ─────────────────────────────────────────────────────────────────────────────

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
  "a": {width: .75, strokes: [[[0.6, 0.3], [0.3, 0.2], [0.1, 0.4], [0.1, 0.8], [0.3, 0.95], [0.6, 0.75], [0.6, 0.25], [0.6, 0.95]]]},
  "b": {width: .75, strokes: [[[0.1, 0], [0.1, 0.95], [0.5, 0.95], [0.65, 0.7], [0.6, 0.4], [0.3, 0.3], [0.1, 0.5]]]},
  "c": {width: .75, strokes: [[[0.6, 0.3], [0.35, 0.2], [0.1, 0.4], [0.1, 0.8], [0.35, 0.95], [0.6, 0.85]]]},
  "d": {width: .75, strokes: [[[0.6, 0], [0.6, 0.95], [0.6, 0.3], [0.3, 0.2], [0.1, 0.4], [0.1, 0.8], [0.3, 0.95], [0.6, 0.75]]]},
  "e": {width: .75, strokes: [[[0.1, 0.55], [0.6, 0.55], [0.55, 0.3], [0.3, 0.2], [0.1, 0.4], [0.1, 0.8], [0.3, 0.95], [0.6, 0.85]]]},
  "f": {width: .75, strokes: [[[0.2, 0.95], [0.2, 0.2], [0.4, 0.05], [0.6, 0.1]], [[0.05, 0.4], [0.5, 0.4]]]},
  "g": {width: .75, strokes: [[[0.6, 0.3], [0.3, 0.2], [0.1, 0.4], [0.1, 0.75], [0.3, 0.85], [0.6, 0.65], [0.6, 0.25], [0.6, 1.15], [0.3, 1.25], [0.1, 1.1]]]},
  "i": {width: .75, strokes: [[[0.3, 0.3], [0.3, 0.95]], [[0.3, 0.1], [0.3, 0.12]]]},
  "l": {width: .75, strokes: [[[0.2, 0], [0.2, 0.9], [0.4, 0.95]]]},
  "n": {width: .75, strokes: [[[0.1, 0.95], [0.1, 0.25], [0.1, 0.5], [0.35, 0.25], [0.6, 0.4], [0.6, 0.95]]]},
  "o": {width: .75, strokes: [[[0.3, 0.2], [0.1, 0.35], [0.1, 0.8], [0.3, 0.95], [0.6, 0.8], [0.6, 0.35], [0.3, 0.2]]]},
  "p": {width: .75, strokes: [[[0.1, 1.2], [0.1, 0.25], [0.1, 0.45], [0.35, 0.25], [0.6, 0.35], [0.6, 0.7], [0.35, 0.85], [0.1, 0.7]]]},
  "r": {width: .75, strokes: [[[0.1, 0.95], [0.1, 0.25], [0.1, 0.5], [0.35, 0.25], [0.6, 0.3]]]},
  "u": {width: .75, strokes: [[[0.1, 0.25], [0.1, 0.8], [0.3, 0.95], [0.6, 0.75], [0.6, 0.25], [0.6, 0.95]]]},
  "w": {width: .75, strokes: [[[0.05, 0.25], [0.2, 0.95], [0.4, 0.5], [0.6, 0.95], [0.8, 0.25]]]},
  "y": {width: .75, strokes: [[[0.1, 0.25], [0.3, 0.8], [0.6, 0.25], [0.2, 1.2]]]},
  "\u0394": {width: .75, strokes: [[[0.35, 0], [0.03, 0.95], [0.7, 0.95], [0.35, 0]]]},
  ">": {width: .75, strokes: [[[0.1, 0.2], [0.6, 0.55], [0.1, 0.9]]]},
  ":": {width: .75, strokes: [[[0.3, 0.3], [0.3, 0.32]], [[0.3, 0.8], [0.3, 0.82]]]},
  ' ': { width: .36, strokes: [] },
};

interface PreparedStroke { d: string; length: number; points: Point[]; start: number; end: number }
interface PreparedLine { strokes: PreparedStroke[]; width: number }
function prepareLine(text: string, size: number): PreparedLine {
  const raw: Array<{ d: string; length: number; points: Point[] }> = [];
  let cursor = 0;
  for (const character of text) {
    const glyph = G[character];
    if (!glyph) throw new Error(`Missing handwritten glyph: ${character}`);
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
      return [points[index][0]+(points[index+1][0]-points[index][0])*p, points[index][1]+(points[index+1][1]-points[index][1])*p];
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
  panel?: string;
}> = ({ text, frame, start, end, x, y, size = 29, color = T.ink, panel = "working" }) => {
  if (end <= start) throw new Error(`Invalid handwriting window: ${text}`);
  const prepared = useMemo(() => prepareLine(text, size), [text, size]);
  // Measure the entire final stroke geometry, including stroke width, even mid-write.
  const points = prepared.strokes.flatMap(stroke => stroke.points);
  const extent = {left: Math.min(...points.map(p => p[0])) - 1.55, top: Math.min(...points.map(p => p[1])) - 1.55,
    right: Math.max(...points.map(p => p[0])) + 1.55, bottom: Math.max(...points.map(p => p[1])) + 1.55};
  const lineProgress = clamp01((frame-start)/(end-start));
  let tip: Point | null = null;
  return (
    <g data-ink-text={text} data-ink-panel-id={panel} data-ink-active={frame>start ? "true" : "false"} data-ink-end={end} data-ink-stroke-ends={JSON.stringify(prepared.strokes.map(stroke => start + stroke.end * (end-start)))} data-ink-complete={frame>=end ? "true" : "false"} transform={`translate(${x} ${y})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect data-ink-extent="true" x={extent.left} y={extent.top} width={extent.right-extent.left} height={extent.bottom-extent.top} fill="none" stroke="none"/>
      {prepared.strokes.map((stroke, index) => {
        const strokeProgress = clamp01((lineProgress - stroke.start) / Math.max(.0001, stroke.end - stroke.start));
        if (strokeProgress > 0 && strokeProgress < 1) tip = pointOnStroke(stroke.points, strokeProgress);
        return <path key={index} d={stroke.d} stroke={color} strokeWidth={3.1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strokeProgress} />;
      })}
      {tip && lineProgress < 1 && <g transform={`translate(${tip[0]} ${tip[1]}) rotate(-38)`}><rect x={-5} y={-34} width={10} height={35} rx={4} fill={T.amber} stroke={T.ink} strokeWidth={2} /><path d="M -5 0 L 0 10 L 5 0 Z" fill={T.ink} /></g>}
    </g>
  );
};

// Additive problem setups and journey, using the original plot and track language.
const OUTCOMES=['Read position and gradient','Use a tangent on a curve','Separate distance from displacement'];
const Figure:React.FC<{id:string;children:React.ReactNode}>=({id,children})=><span data-figure={id} style={{display:'inline-block',padding:'0 12px'}}>{children}</span>;
const Givens:React.FC<{cyclist?:boolean;scene:MechanicsTranscriptScene;embedded?:boolean}>=({cyclist=false,scene,embedded=false})=>{
 const frame=useCurrentFrame();const seconds=frame/30;
 return <div data-region="story" data-givens style={{position:embedded?'relative':'absolute',left:embedded?0:1410,top:embedded?0:230,width:embedded?430:440}}>
 <WarmCard style={{padding:22,fontSize:24,lineHeight:2.25}}>
 <div style={{fontSize:30,fontWeight:850}}>{cyclist?'Cyclist journey':'Walker journey'}</div>
 {cyclist?<>
 <div><span data-phrase="acceleration">From rest: <Figure id="accel">1 m s⁻²</Figure>, <Figure id="time2">2 s</Figure></span></div>
 <div><span data-phrase="cruise">Cruise: <Figure id="speed2">+2 m/s</Figure>, <Figure id="time3">3 s</Figure></span></div>
 <div><span data-phrase="return">Rest <Figure id="rest2">2 s</Figure>; <Figure id="speed-2">−2 m/s</Figure>, <Figure id="time4">4 s</Figure></span></div>
 </>:<>
 <div><span data-phrase="start">Start <Figure id="pos2">2 m</Figure>; <Figure id="pos10">10 m</Figure> at <Figure id="time4">4 s</Figure></span></div>
 <div><span data-phrase="rest">Rest until <Figure id="time6">6 s</Figure></span></div>
 <div><span data-phrase="finish">Finish <Figure id="pos-6">−6 m</Figure> at <Figure id="time10">10 s</Figure></span></div>
 </>}
 </WarmCard>
 {cyclist&&seconds>=cueAt(scene,'build')&&<WarmCard style={{padding:20,marginTop:22,fontSize:23,lineHeight:2.1}}>
 <div>Leg changes on the track</div>
 <div><Figure id="pos2">+2 m</Figure><Figure id="pos6">+6 m</Figure></div>
 <div><Figure id="pos0">0 m</Figure><Figure id="pos-8">−8 m</Figure></div>
 <div>Chord <Figure id="speed1">+1 m/s</Figure></div>
 <div>{seconds<cueAt(scene,'leg3')?'Tangent':'Rest'} <Figure id="speed0">{seconds<cueAt(scene,'leg3')?'0':'0 m/s'}</Figure>{seconds<cueAt(scene,'leg3')&&<> to <Figure id="tangent2">2 m/s</Figure></>}</div>
 </WarmCard>}
 </div>;
};
const JourneyTrack:React.FC<{scene:MechanicsTranscriptScene;cyclist?:boolean;compact?:boolean;time?:number}>=({scene,cyclist=false,compact=false,time})=>{
 const frame=useCurrentFrame();const sec=frame/30;const build=cueAt(scene,'build');
 const refs=(scene.figureEvents??[]).map(e=>e.start);const knots=cyclist?[[0,0],[refs[0]??1,0],[refs[2]??8,2],[refs[4]??14,5],[refs[5]??17,7],[build-2,11]]:[[0,0],[refs[0]??2,0],[refs[2]??6,4],[refs[3]??9,6],[refs[5]??12,10],[build-2,10]];let storyTime=0;for(let i=0;i<knots.length-1;i++){if(sec>=knots[i][0])storyTime=knots[i][1]+(knots[i+1][1]-knots[i][1])*clamp01((sec-knots[i][0])/Math.max(.1,knots[i+1][0]-knots[i][0]));}const t=time??storyTime;
 const pos=cyclist?(t<2?t*t/2:t<5?2+2*(t-2):t<7?8:8-2*(t-7)):(t<4?2+2*t:t<6?10:10-4*(t-6));
 const w=compact?440:1280;const map=(s:number)=>65+(s+(cyclist?0:8))/(cyclist?10:20)*(w-130);const cy=compact?50:150;
 return <svg data-region={compact?undefined:"track"} data-track width={w} height={compact?190:330} style={{position:'absolute',left:compact?1410:90,top:compact?820:370}}>
 <rect width={w} height={compact?190:330} rx={25} fill={T.panel} stroke={T.cyan} strokeWidth={3}/>
 <line x1={45} y1={cy+44} x2={w-35} y2={cy+44} stroke={T.textMuted} strokeWidth={5}/>
 {(cyclist?[[0,'0, 11 s'],[2,'2 s'],[8,'5, 7 s']]:[[-6,'10 s'],[2,'0 s'],[10,'4, 6 s']]).map(([p,label])=><g key={String(p)}><line x1={map(Number(p))} x2={map(Number(p))} y1={cy+35} y2={cy+55} stroke={T.amber} strokeWidth={3}/><text x={map(Number(p))} y={cy+84} textAnchor="middle" fontSize={compact?19:27} fill={T.text}>{label}</text><text x={map(Number(p))} y={cy+122} textAnchor="middle" fontSize={compact?19:27} fill={T.cyan}>{p} m</text></g>)}
 <g data-cyclist-x={pos} transform={`translate(${map(pos)} ${cy}) scale(${compact?.65:1})`} stroke={T.cyan} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
 {cyclist?<><circle cx={-30} cy={20} r={21}/><circle cx={35} cy={20} r={21}/><path d="M -30 20 L -5 -14 L 14 20 Z M -5 -14 L 28 -14 L 35 20 M 14 20 L 28 -14 M -10 -35 L 12 -48 L 28 -14 M -10 -35 L 2 -4 L 14 20"/><circle cx={17} cy={-65} r={11} fill={T.card}/></>:<><circle cy={-54} r={15} fill={T.card}/><path d="M0 -37 V 5 M0 -25 L -24 -3 M0 -25 L 24 -10 M0 5 L -23 39 M0 5 L 23 39"/></>}
 </g></svg>;
};
const Scene00:React.FC<{scene:MechanicsTranscriptScene}>=({scene})=><SceneShell scene={0} label="Syllabus"><SectionTitle kicker="">Displacement–time graphs</SectionTitle><div data-region="outcomes" style={{position:'absolute',left:95,top:270,width:900,color:T.text,fontSize:31,lineHeight:1.8}}><div style={{color:T.cyan}}>9709 · §4.2</div><div>“sketch and interpret displacement–time graphs<br/>and velocity–time graphs”</div><div style={{fontSize:24,marginTop:20}}>This lesson: displacement–time</div>{OUTCOMES.map(x=><div key={x} style={{fontSize:28}}>• {x}</div>)}</div><svg data-region="motif" width={670} height={470} style={{position:'absolute',left:1130,top:290}}><GraphAxes width={670} height={470} xMax={10} yMin={0} yMax={10} xTicks={[0,5,10]} yTicks={[0,5,10]} id="opening"/><path d="M112 378 L350 130 L440 130 L628 378" stroke={T.cyan} strokeWidth={9} fill="none"/></svg></SceneShell>;
const Scene11:React.FC<{scene:MechanicsTranscriptScene}>=({scene})=>{
 const frame=useCurrentFrame();const sec=frame/30;const at=(id:string)=>cueAt(scene,id);const draw=sec>=at('build');
 const active=sec>=at('leg4')?3:sec>=at('leg3')?2:sec>=at('leg2')?1:0;
 const times=[0,2,5,7,11],positions=[0,2,8,8,0],colors=[T.cyan,T.green,T.amber,T.red];
 const answers=[1,2,3,4].map(i=>at(`answer${i}`));const resultHolds=(scene.holds??[]).filter(h=>h.kind==='hold').slice(1);
 const progress=clamp01((sec-answers[active])/Math.max(1,(resultHolds[active]?.start??answers[active]+5)-answers[active]));
 const time=times[active]+(times[active+1]-times[active])*progress;const value=(t:number)=>t<2?t*t/2:t<5?2+2*(t-2):t<7?8:8-2*(t-7);
 const scale=makePlotScale(1280,500,11,0,10);const x=scale.x;const y=(s:number)=>scale.y(s)+130;
 const lines=['Δs = 2 m   Δt = 2 s   v = +1 m/s average','Δs = 6 m   Δt = 3 s   v = +2 m/s','Δs = 0 m   Δt = 2 s   v = 0','Δs = −8 m   Δt = 4 s   v = −2 m/s'];
 const start=answers[active]*30;const end=(resultHolds[active]?.start??answers[active]+5)*30-4;
 return <SceneShell scene={11} label="Journey"><SectionTitle kicker="">{draw?'Complete the displacement–time graph':'Consider a cyclist'}</SectionTitle><Givens cyclist scene={scene}/>
 <JourneyTrack scene={scene} cyclist compact={draw} time={draw?time:undefined}/>{draw&&<div style={{position:"absolute",left:1425,top:1020,color:colors[active],fontSize:sec>=at('what-if')?20:26,width:420,lineHeight:1.1,background:T.bg}}>{sec>=at('what-if')?"Slower return: less steep, arriving later":["Positive: moving away","Positive: constant motion away","Zero: stationary","Negative: returning"][active]}</div>}
 {draw&&<svg data-region="graph" data-graph="displacement" width={1280} height={780} style={{position:'absolute',left:80,top:230}}>
 <rect data-ink-panel="journey" x={0} y={0} width={1280} height={780} rx={25} fill={T.card} stroke={T.cyan} strokeWidth={3}/>
 <HandwrittenLine text="gradient = displacement change / time change" panel="journey" frame={frame} start={at('formula')*30} end={at('symbol')*30-2} x={40} y={24} size={22}/>
 <HandwrittenLine text="Δs/Δt = v" panel="journey" frame={frame} start={at('symbol')*30} end={at('leg1')*30-3} x={40} y={70} size={29}/>
 <g transform="translate(0 130)"><GraphAxes width={1280} height={500} xMax={11} yMin={0} yMax={10} xTicks={[0,2,5,7,11]} yTicks={[0,2,8]} id="cyclist"/></g>
 {times.slice(0,4).map((from,i)=>{const p=i<active?1:i===active?progress:0;const to=from+(times[i+1]-from)*p;return <g key={from}><path d={sampledPath({...scale,y},from,to,value,45)} stroke={colors[i]} strokeWidth={9} fill="none" strokeLinecap="round"/>{p>0&&<path d={`M${x(from)} ${y(positions[i])} H${x(to)} V${y(value(to))} Z`} fill={colors[i]} opacity={.12}/>}</g>;})}
 {sec>=at('what-if')&&<path d={`M${x(7)} ${y(8)} L${x(11)} ${y(4)}`} stroke={T.purple} strokeWidth={5} strokeDasharray="12 9" fill="none" opacity={clamp01((sec-at('what-if'))/.7)}/>}
 <circle cx={x(time)} cy={y(value(time))} r={11} fill={colors[active]} stroke={T.ink} strokeWidth={4}/>
 {sec>=answers[active]&&<g><path d={`M${x(times[active])} ${y(positions[active])} H${x(times[active+1])} V${y(positions[active+1])}`} stroke={cardInk(colors[active])} strokeWidth={3} strokeDasharray="9 7" fill="none"/>
 <HandwrittenLine text="Δt" panel="journey" frame={frame} start={start} end={start+22} x={(x(times[active])+x(times[active+1]))/2-14} y={y(positions[active])+14} size={21}/>
 {active!==2&&<HandwrittenLine text="Δs" panel="journey" frame={frame} start={start+22} end={start+44} x={x(times[active+1])-42} y={(y(positions[active])+y(positions[active+1]))/2-20} size={21}/>}
 </g>}
 {active===0&&sec>=at('tangent')&&<g><line x1={x(Math.max(0,time-.6))} y1={y(Math.max(0,value(time)-time*.6))} x2={x(time+.7)} y2={y(value(time)+time*.7)} stroke={T.amber} strokeWidth={4}/></g>}
 <rect data-ink-panel="leg-notes" x={24} y={647} width={1232} height={110} rx={12} fill="#f8efd8"/>
 <line x1={40} y1={709} x2={1240} y2={709} stroke="#b9c9cd"/>
 <g data-substitution={['pos2,time2','pos6,time3','pos0,rest2','pos-8,time4'][active]} data-start={(start+45)/30} data-end={end/30}><HandwrittenLine panel="leg-notes" text={lines[active]} frame={frame} start={start+45} end={end} x={45} y={673} size={26}/></g>
 </svg>}
 </SceneShell>;
};
function figureBounds(el:Element):DOMRect { if(el instanceof SVGElement)return el.getBoundingClientRect(); const range=document.createRange();range.selectNodeContents(el);return range.getBoundingClientRect();}
type FigureEvent={id:string;word:string;start:number;end:number;target:string};
function FigureAccents({scene,rootRef}:{scene:MechanicsTranscriptScene;rootRef:React.RefObject<HTMLDivElement|null>}){
 const frame=useCurrentFrame();const [underlines,setUnderlines]=useState<Array<{x:number;y:number;width:number;start:number;id:string}>>([]);const [rings,setRings]=useState<Array<{event:FigureEvent;x:number;y:number;width:number;height:number;text:string}>>([]);
 const seconds=frame/30;
 useLayoutEffect(()=>{const root=rootRef.current;if(!root)return;
 const selected=new Map<string,FigureEvent>();
 for(const event of scene.figureEvents??[])if(seconds>=event.start&&seconds<event.start+2.2)selected.set(event.target,event);
 // The source figures stay ringed while a handwritten numerical substitution is drawn.
 for(const ink of Array.from(root.querySelectorAll('[data-substitution]'))){const a=Number(ink.getAttribute('data-start')),b=Number(ink.getAttribute('data-end'));if(seconds<a||seconds>b)continue;for(const target of (ink.getAttribute('data-substitution')??'').split(','))selected.set(target,{id:`substitution-${target}`,word:'substitution',target,start:a,end:b});}
 const bounds=root.getBoundingClientRect();const factor=bounds.width/1920;
 const phrases=new Map<string,{x:number;y:number;width:number;start:number;id:string}>();
 const phrasePlan=scene.id==='s11'?[['acceleration',spokenAt(scene,'From rest')],['cruise',spokenAt(scene,'Cruise')],['return',spokenAt(scene,'Rest',2)]]:scene.id==='s07'?[['start',cueAt(scene,'setup')],['rest',spokenAt(scene,'rest until')],['finish',spokenAt(scene,'Finish')]]:[];
 for(let i=0;i<phrasePlan.length;i++){const [id,begin]=phrasePlan[i];const end=Number(phrasePlan[i+1]?.[1]??cueAt(scene,'build'));if(seconds<Number(begin)||seconds>=end)continue;const el=root.querySelector(`[data-phrase="${id}"]`);if(!el)continue;const r=el.getBoundingClientRect();phrases.set(String(id),{id:String(id),x:(r.left-bounds.left)/factor,y:(r.bottom-bounds.top)/factor+1,width:r.width/factor,start:Number(begin)});}

 for(const event of selected.values()){const el=root.querySelector(`[data-figure="${event.target}"]`)?.closest('[data-phrase]');if(!el||seconds>=cueAt(scene,'build'))continue;const r=el.getBoundingClientRect();const id=el.getAttribute('data-phrase')!;if(!phrases.has(id))phrases.set(id,{id,x:(r.left-bounds.left)/factor,y:(r.bottom-bounds.top)/factor+1,width:r.width/factor,start:event.start});}
 setUnderlines([...phrases.values()]);
 setRings([...selected.values()].flatMap(event=>{const target=Array.from(root.querySelectorAll(`[data-figure="${event.target}"]`)).find(el=>{let n:Element|null=el;while(n&&n!==root){if(Number(getComputedStyle(n).opacity)<.01)return false;n=n.parentElement;}return el.getBoundingClientRect().width>0;});if(!target)return [];const r=figureBounds(target);return [{event,x:(r.left-bounds.left)/factor-10,y:(r.top-bounds.top)/factor-8,width:r.width/factor+20,height:r.height/factor+16,text:target.textContent??''}];}));
 },[frame,scene,rootRef,seconds]);
 return <svg data-accents width={1920} height={1080} style={{position:'absolute',inset:0,pointerEvents:'none'}}>{underlines.map(u=><path key={u.id} data-underline={u.id} d={`M${u.x} ${u.y} Q${u.x+u.width/2} ${u.y+4} ${u.x+u.width} ${u.y}`} stroke={T.amber} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-Math.max(.04,clamp01((seconds-u.start)/.5))} fill="none"/>)}{rings.map(({event,x,y,width,height,text})=>{const p=Math.max(.04,clamp01((seconds-event.start)/.4));const opacity=event.word==='substitution'?1:clamp01((event.start+2.2-seconds)/.35);const d=Array.from({length:81},(_,i)=>{const a=i/80*Math.PI*2;return `${i?'L':'M'} ${x+width/2+Math.cos(a)*width/2*(1+.015*Math.sin(3*a))} ${y+height/2+Math.sin(a)*height/2*(1+.025*Math.cos(5*a))}`;}).join(' ');return <path data-ring={event.id} data-ring-target={event.target} data-ring-text={text} data-progress={p} key={event.target} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1-p} stroke={T.amber} strokeWidth={3} fill="none" opacity={opacity}/>;})}</svg>;
}
const Scene01: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const recordAt = cueAt(scene, 'record');
  const particleAt = cueAt(scene, 'particle');
  const originAt = cueAt(scene, 'origin');
  const record = useCue(recordAt, 0.45);
  const particlePulse = useSpringAt(particleAt, 28);
  const origin = useCue(originAt, 0.4);
  const graphWidth = 1320;
  const graphHeight = 500;
  const graphLeft = 300;
  const graphTop = 230;
  const graphScale = makePlotScale(graphWidth, graphHeight, 10, -2, 8);
  const scannerX = graphLeft + graphScale.x(0);
  const scannerTop = graphTop + graphScale.y(0);
  const trackLeft = scannerX - 58;
  const trackTop = 812;
  const particleY = trackTop + 76;

  return (
    <SceneShell scene={1} label="position trace">
      <SectionTitle kicker="displacement–time graphs" at={recordAt}>
        Position leaves a trace
      </SectionTitle>

      <svg
        width={graphWidth}
        height={graphHeight}
        style={{ position: 'absolute', left: graphLeft, top: graphTop }}
      >
        <GraphAxes
          width={graphWidth}
          height={graphHeight}
          xMax={10}
          yMin={-2}
          yMax={8}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[-2, 0, 2, 4, 6, 8]}
          id="s01"
          axisOpacity={0.3 + record.opacity * 0.7}
          xLabelOpacity={record.opacity}
          yLabelOpacity={record.opacity}
        />
        <circle
          cx={graphScale.x(0)}
          cy={graphScale.y(0)}
          r={9 + particlePulse * 5}
          fill={T.cyan}
          opacity={record.opacity}
          style={{ filter: `drop-shadow(0 0 ${10 + particlePulse * 14}px ${T.cyan})` }}
        />
      </svg>

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line
          x1={scannerX}
          y1={scannerTop}
          x2={scannerX}
          y2={particleY}
          stroke={T.cyan}
          strokeWidth={5}
          strokeDasharray="13 11"
          opacity={record.opacity * 0.85}
        />
        <circle
          cx={scannerX}
          cy={particleY}
          r={29 + particlePulse * 18}
          fill="none"
          stroke={T.cyanSoft}
          strokeWidth={5}
          opacity={particlePulse * (1 - particlePulse * 0.45)}
        />
      </svg>

      <div style={{ position: 'absolute', left: trackLeft, top: trackTop }}>
        <TrackDiagram
          width={1212}
          min={0}
          max={10}
          position={0}
          ticks={[0, 5, 10]}
          originOpacity={origin.opacity}
          color={T.card}
        />
      </div>

      <Cued
        at={recordAt}
        style={{
          position: 'absolute',
          left: scannerX + 30,
          top: scannerTop + 28,
          color: T.cyan,
          fontFamily: T.mono,
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: 2,
        }}
      >
        Position
      </Cued>
      <Cued
        at={originAt}
        fromY={12}
        style={{
          position: 'absolute',
          left: scannerX - 96,
          top: 972,
          width: 192,
          textAlign: 'center',
          color: T.green,
          fontFamily: T.mono,
          fontSize: 28,
          fontWeight: 900,
        }}
      >
        s = 0 m
      </Cued>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S02 — THE GRAPH DRAWS WITH THE MOTION
// ─────────────────────────────────────────────────────────────────────────────

const Scene02: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const timeAt = cueAt(scene, 'time');
  const displacementAt = cueAt(scene, 'displacement');
  const positiveAt = cueAt(scene, 'positive-direction');
  const matchesAt = cueAt(scene, 'matches');
  const time = useCue(timeAt, 0.35);
  const displacement = useCue(displacementAt, 0.35);
  const positive = useCue(positiveAt, 0.35);
  const matches = useCue(matchesAt, 0.32);
  const motion = useProgress(positiveAt, scene.duration - 0.65);
  const graphWidth = 1360;
  const graphHeight = 555;
  const graphLeft = 280;
  const graphTop = 205;
  const scale = makePlotScale(graphWidth, graphHeight, 10, 0, 8);
  const pointTime = 10 * motion;
  const pointDisplacement = 8 * motion;
  const endpointX = graphLeft + scale.x(pointTime);
  const endpointY = graphTop + scale.y(pointDisplacement);
  const trackLeft = graphLeft + scale.left - 58;
  const trackTop = 805;
  const particleY = trackTop + 76;

  return (
    <SceneShell scene={2} label="graph + motion">
      <SectionTitle kicker="axes and coordinates" at={timeAt}>
        The graph draws with the motion
      </SectionTitle>

      <svg
        width={graphWidth}
        height={graphHeight}
        style={{ position: 'absolute', left: graphLeft, top: graphTop }}
      >
        <GraphAxes
          width={graphWidth}
          height={graphHeight}
          xMax={10}
          yMin={0}
          yMax={8}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[0, 2, 4, 6, 8]}
          id="s02"
          axisOpacity={0.32 + Math.max(time.opacity, displacement.opacity) * 0.68}
          xLabelOpacity={time.opacity}
          yLabelOpacity={displacement.opacity}
        />
        <line
          x1={scale.x(0)}
          y1={scale.y(0)}
          x2={scale.x(10)}
          y2={scale.y(8)}
          pathLength={1}
          stroke={T.cyan}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={1}
          strokeDashoffset={1 - motion}
          opacity={positive.opacity}
          style={{ filter: `drop-shadow(0 0 8px ${T.cyan}88)` }}
        />
        <line
          x1={scale.x(pointTime)}
          y1={scale.y(pointDisplacement)}
          x2={scale.x(pointTime)}
          y2={scale.y(0)}
          stroke={T.amber}
          strokeWidth={4}
          strokeDasharray="10 9"
          opacity={matches.opacity}
        />
        <circle
          cx={scale.x(pointTime)}
          cy={scale.y(pointDisplacement)}
          r={13}
          fill={T.cyan}
          stroke={T.ink}
          strokeWidth={5}
          opacity={positive.opacity}
        />
        <g opacity={matches.opacity}>
          <rect
            x={Math.min(scale.x(pointTime) + 18, graphWidth - 238)}
            y={Math.max(scale.top + 10, scale.y(pointDisplacement) - 62)}
            width={210}
            height={48}
            rx={12}
            fill={T.ink}
          />
          <text
            x={Math.min(scale.x(pointTime) + 123, graphWidth - 133)}
            y={Math.max(scale.top + 44, scale.y(pointDisplacement) - 28)}
            fill={T.card}
            textAnchor="middle"
            fontFamily={T.mono}
            fontSize={28}
          >
            (t, s)
          </text>
        </g>
      </svg>

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line
          x1={endpointX}
          y1={endpointY + 17}
          x2={endpointX}
          y2={particleY - 24}
          stroke={T.amber}
          strokeWidth={4}
          strokeDasharray="12 10"
          opacity={matches.opacity * 0.9}
        />
      </svg>

      <div style={{ position: 'absolute', left: trackLeft, top: trackTop }}>
        <TrackDiagram
          width={1322}
          min={0}
          max={8}
          position={pointDisplacement}
          ticks={[0, 2, 4, 6, 8]}
          originOpacity={displacement.opacity}
          direction={1}
          directionOpacity={positive.opacity}
          color={T.cyan}
        />
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S03 — GRADIENT IS VELOCITY
// ─────────────────────────────────────────────────────────────────────────────

const Scene03: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const gradientAt = cueAt(scene, 'gradient');
  const positiveAt = cueAt(scene, 'positive');
  const negativeAt = cueAt(scene, 'negative');
  const steeperAt = cueAt(scene, 'steeper');
  const gradientReveal = useCue(gradientAt, 0.4);
  const positiveReveal = useCue(positiveAt, 0.32);
  const negativeReveal = useCue(negativeAt, 0.32);
  const steepReveal = useCue(steeperAt, 0.32);
  const gentle = useProgress(gradientAt, negativeAt);
  const falling = useProgress(negativeAt, steeperAt);
  const steep = useProgress(steeperAt, scene.duration - 0.55);
  const readoutClimb = useProgress(steeperAt, Math.min(scene.duration - 0.4, steeperAt + 1.1));
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const negativeActive = frame >= negativeAt * fps;
  const steepActive = frame >= steeperAt * fps;
  const graphWidth = 1270;
  const graphHeight = 560;
  const graphLeft = 82;
  const graphTop = 220;
  const scale = makePlotScale(graphWidth, graphHeight, 10, 0, 9);
  const particlePosition = 1 + 4 * gentle - 3 * falling + 6 * steep;
  const activeTriangle = steepActive
    ? { t1: 7, s1: 2, t2: 9, s2: 8, ds: '+6', dt: '2' }
    : negativeActive
      ? { t1: 4, s1: 5, t2: 7, s2: 2, ds: '−3', dt: '3' }
      : { t1: 0, s1: 1, t2: 4, s2: 5, ds: '+4', dt: '4' };
  const displayedVelocity = steepActive
    ? 1 + 2 * readoutClimb
    : negativeActive
      ? -1
      : 1;

  return (
    <SceneShell scene={3} label="gradient = velocity">
      <SectionTitle kicker="read the slope" at={gradientAt}>
        Gradient tells us velocity
      </SectionTitle>

      <svg
        width={graphWidth}
        height={graphHeight}
        style={{ position: 'absolute', left: graphLeft, top: graphTop }}
      >
        <GraphAxes
          width={graphWidth}
          height={graphHeight}
          xMax={10}
          yMin={0}
          yMax={9}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[0, 1, 3, 5, 7, 9]}
          id="s03"
        />
        <line
          x1={scale.x(0)} y1={scale.y(1)} x2={scale.x(4)} y2={scale.y(5)}
          pathLength={1} stroke={T.cyan} strokeWidth={positiveReveal.isActive ? 11 : 8}
          strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - gentle}
          style={{ filter: positiveReveal.isActive ? `drop-shadow(0 0 8px ${T.cyan})` : undefined }}
        />
        <line
          x1={scale.x(4)} y1={scale.y(5)} x2={scale.x(7)} y2={scale.y(2)}
          pathLength={1} stroke={T.amber} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={1} strokeDashoffset={1 - falling} opacity={negativeReveal.opacity}
        />
        <line
          x1={scale.x(7)} y1={scale.y(2)} x2={scale.x(9)} y2={scale.y(8)}
          pathLength={1} stroke={T.green} strokeWidth={11} strokeLinecap="round"
          strokeDasharray={1} strokeDashoffset={1 - steep} opacity={steepReveal.opacity}
          style={{ filter: `drop-shadow(0 0 8px ${T.green}99)` }}
        />

        <g opacity={gradientReveal.opacity}>
          <line
            x1={scale.x(activeTriangle.t1)}
            y1={scale.y(activeTriangle.s1)}
            x2={scale.x(activeTriangle.t2)}
            y2={scale.y(activeTriangle.s1)}
            stroke={T.red}
            strokeWidth={5}
            strokeDasharray="9 7"
          />
          <line
            x1={scale.x(activeTriangle.t2)}
            y1={scale.y(activeTriangle.s1)}
            x2={scale.x(activeTriangle.t2)}
            y2={scale.y(activeTriangle.s2)}
            stroke={T.red}
            strokeWidth={5}
            strokeDasharray="9 7"
          />
          <rect
            x={(scale.x(activeTriangle.t1) + scale.x(activeTriangle.t2)) / 2 - 67}
            y={scale.y(activeTriangle.s1) + 13}
            width={134}
            height={42}
            rx={10}
            fill={T.ink}
          />
          <text
            x={(scale.x(activeTriangle.t1) + scale.x(activeTriangle.t2)) / 2}
            y={scale.y(activeTriangle.s1) + 43}
            fill={T.card}
            textAnchor="middle"
            fontFamily={T.mono}
            fontSize={28}
          >
            Δt={activeTriangle.dt}
          </text>
          <text
            x={scale.x(activeTriangle.t2) + 16}
            y={(scale.y(activeTriangle.s1) + scale.y(activeTriangle.s2)) / 2 + 9}
            fill={T.red}
            fontFamily={T.mono}
            fontSize={28}
            fontWeight={900}
          >
            Δs={activeTriangle.ds}
          </text>
        </g>
      </svg>

      <div style={{ position: 'absolute', left: 82, top: 804 }}>
        <TrackDiagram
          width={1270}
          min={0}
          max={9}
          position={particlePosition}
          ticks={[0, 3, 6, 9]}
          showOrigin={false}
          direction={steepActive ? 1 : negativeActive ? -1 : 1}
          directionOpacity={Math.max(positiveReveal.opacity, negativeReveal.opacity, steepReveal.opacity)}
          color={steepActive ? T.green : negativeActive ? T.amber : T.cyan}
        />
      </div>

      <div style={{ position: 'absolute', left: 1395, top: 292, width: 430 }}>
        <WarmCard accent={steepActive ? T.green : negativeActive ? T.amber : T.cyan} style={{ padding: '30px 32px', minHeight: 355 }}>
          <div style={{ color: cardInk(steepActive ? T.green : negativeActive ? T.amber : T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>
            velocity = gradient
          </div>
          <div style={{ marginTop: 30, opacity: gradientReveal.opacity }}>
            <MathTeX tex={'v=\\frac{\\Delta s}{\\Delta t}'} color={T.ink} fontSize={48} />
          </div>
          <div
            style={{
              marginTop: 22,
              padding: '18px 20px',
              borderRadius: 17,
              background: `${steepActive ? T.green : negativeActive ? T.amber : T.cyan}20`,
              color: T.ink,
              textAlign: 'center',
              fontFamily: T.mono,
              fontSize: 43,
              fontWeight: 950,
              opacity: gradientReveal.opacity,
            }}
          >
            {displayedVelocity >= 0 ? '+' : '−'}{Math.abs(displayedVelocity).toFixed(1)} m/s
          </div>
          <div style={{ marginTop: 18, color: T.ink, textAlign: 'center', fontSize: 28, fontWeight: 800, opacity: steepReveal.opacity }}>
            steeper line → greater speed
          </div>
        </WarmCard>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S04 — STRAIGHT, FLAT, CURVED
// ─────────────────────────────────────────────────────────────────────────────

const MotionSampleCard: React.FC<{
  title: string;
  subtitle: string;
  mode: 'constant' | 'rest' | 'curve';
  at: number;
  readoutAt: number;
  endAt: number;
  accent: string;
}> = ({ title, subtitle, mode, at, readoutAt, endAt, accent }) => {
  const reveal = useCue(mode === 'constant' ? -1 : at-2/30, 0.4);
  const readout = useCue(readoutAt-2/30, 0.35);
  const progress = useProgress(at, endAt);
  const graphWidth = 498;
  const graphHeight = 350;
  const scale = makePlotScale(graphWidth, graphHeight, 4, 0, 8, true);
  const time = 4 * progress;
  const displacement = mode === 'constant'
    ? 2 * time
    : mode === 'rest'
      ? 4
      : 0.5 * time * time;
  const velocity = mode === 'constant' ? 2 : mode === 'rest' ? 0 : time;
  const path = mode === 'constant'
    ? `M${scale.x(0)} ${scale.y(0)} L${scale.x(4)} ${scale.y(8)}`
    : mode === 'rest'
      ? `M${scale.x(0)} ${scale.y(4)} L${scale.x(4)} ${scale.y(4)}`
      : sampledPath(scale, 0, 4, (sampleTime) => 0.5 * sampleTime * sampleTime, 48);

  return (
    <div style={{ opacity: reveal.opacity, transform: `translateY(${(1 - reveal.opacity) * 28}px)` }}>
      <WarmCard accent={accent} style={{ width: 540, height: 664, padding: '20px 18px', overflow: 'hidden' }}>
        <div style={{ height: 67, paddingLeft: 9 }}>
          <div style={{ color: cardInk(accent), fontFamily: T.mono, fontSize: 30, fontWeight: 950, letterSpacing: 1.8 }}>{title}</div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, marginTop: 3 }}>{subtitle}</div>
        </div>
        <svg width={graphWidth} height={graphHeight}>
          <GraphAxes
            width={graphWidth}
            height={graphHeight}
            xMax={4}
            yMin={0}
            yMax={8}
            xTicks={[0, 2, 4]}
            yTicks={[0, 4, 8]}
            id={`s04-${mode}`}
            compact
          />
          <path
            d={path}
            pathLength={1}
            fill="none"
            stroke={accent}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
          />
          <circle
            cx={scale.x(time)}
            cy={scale.y(displacement)}
            r={11}
            fill={accent}
            stroke={T.ink}
            strokeWidth={4}
          />
        </svg>
        <div style={{ marginTop: 10, marginLeft: 18 }}>
          <TrackDiagram
            width={462}
            height={138}
            min={0}
            max={8}
            position={displacement}
            ticks={[0, 4, 8]}
            showOrigin={false}
            direction={mode === 'rest' ? 0 : 1}
            directionOpacity={mode === 'rest' ? 0 : reveal.opacity}
            color={accent}
            label="position / m"
          />
        </div>
        <div
          style={{
            width: 318,
            margin: '10px auto 0',
            borderRadius: 15,
            background: `${accent}1f`,
            color: T.ink,
            textAlign: 'center',
            fontFamily: T.mono,
            fontSize: 31,
            fontWeight: 950,
            padding: '9px 16px',
            opacity: readout.opacity,
          }}
        >
          v = <span style={{marginLeft:12}} data-figure={mode==='rest'?'rest-zero':undefined}>{velocity.toFixed(1)} m/s</span>
        </div>
      </WarmCard>
    </div>
  );
};

const Scene04: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const constantAt = cueAt(scene, 'constant');
  const zeroAt = cueAt(scene, 'zero');
  const curveAt = cueAt(scene, 'curve');
  const changingAt = cueAt(scene, 'changing');

  return (
    <SceneShell scene={4} label="line shapes">
      <SectionTitle kicker="three laboratory samples" at={constantAt}>
        Straight, flat, or curved?
      </SectionTitle>
      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 245,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <MotionSampleCard
          title="STRAIGHT SLOPE"
          subtitle="constant gradient"
          mode="constant"
          at={constantAt}
          readoutAt={constantAt}
          endAt={scene.duration - 0.55}
          accent={T.cyan}
        />
        <MotionSampleCard
          title="HORIZONTAL"
          subtitle="zero gradient • at rest"
          mode="rest"
          at={zeroAt}
          readoutAt={zeroAt}
          endAt={scene.duration - 0.55}
          accent={T.amber}
        />
        <MotionSampleCard
          title="CURVE"
          subtitle="changing gradient"
          mode="curve"
          at={curveAt}
          readoutAt={changingAt}
          endAt={scene.duration - 0.55}
          accent={T.green}
        />
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S05 — INSTANTANEOUS VELOCITY
// ─────────────────────────────────────────────────────────────────────────────

const Scene05: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const curveAt = spokenAt(scene, 'curve');
  const tangentAt = cueAt(scene, 'tangent');
  const instantAt = cueAt(scene, 'instant');
  const gradientAt = cueAt(scene, 'gradient');
  const pivotsAt = cueAt(scene, 'pivots');
  const curveDraw = useProgress(curveAt, tangentAt);
  const tangentReveal = useCue(tangentAt, 0.4);
  const pointReveal = useCue(instantAt, 0.3);
  const gradientReveal = useCue(gradientAt, 0.35);
  const pivot = useProgress(pivotsAt, scene.duration - 0.55);
  const pointPulse = useSpringAt(instantAt, 28);
  const graphWidth = 1320;
  const graphHeight = 690;
  const graphLeft = 84;
  const graphTop = 220;
  const scale = makePlotScale(graphWidth, graphHeight, 8, 0, 18);
  const time = 1 + 6.5 * pivot;
  const displacement = curveValue(time);
  const velocity = curveGradient(time);
  const tangentAtZero = displacement - velocity * time;
  const tangentAtEight = displacement + velocity * (8 - time);
  const triangleLeftTime = Math.max(0, time - 0.8);
  const triangleRightTime = Math.min(8, time + 0.8);
  const triangleLeftValue = displacement + velocity * (triangleLeftTime - time);
  const triangleRightValue = displacement + velocity * (triangleRightTime - time);
  const triangleLabelCenterX = scale.x(time) + 180 * Math.cos(Math.PI * pivot);
  const triangleLabelOffsetY = -57 + 71 * Math.sin(Math.PI * pivot) ** 2;
  const curvePath = sampledPath(scale, 0, 8, curveValue, 96);

  return (
    <SceneShell scene={5} label="instantaneous velocity">
      <SectionTitle kicker="one point on a curve" at={curveAt}>
        A tangent measures this instant
      </SectionTitle>

      <svg
        width={graphWidth}
        height={graphHeight}
        style={{ position: 'absolute', left: graphLeft, top: graphTop }}
      >
        <GraphAxes
          width={graphWidth}
          height={graphHeight}
          xMax={8}
          yMin={0}
          yMax={18}
          xTicks={[0, 2, 4, 6, 8]}
          yTicks={[0, 3, 6, 9, 12, 15, 18]}
          id="s05"
        />
        <path
          d={curvePath}
          pathLength={1}
          fill="none"
          stroke={T.cyan}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={1}
          strokeDashoffset={1 - curveDraw}
          style={{ filter: `drop-shadow(0 0 8px ${T.cyan}88)` }}
        />
        <g clipPath="url(#s05-clip)" opacity={tangentReveal.opacity}>
          <line
            x1={scale.x(0)}
            y1={scale.y(tangentAtZero)}
            x2={scale.x(8)}
            y2={scale.y(tangentAtEight)}
            stroke={T.amber}
            strokeWidth={18}
            strokeLinecap="round"
            opacity={0.2}
          />
          <line
            x1={scale.x(0)}
            y1={scale.y(tangentAtZero)}
            x2={scale.x(8)}
            y2={scale.y(tangentAtEight)}
            stroke={T.amber}
            strokeWidth={8}
            strokeLinecap="round"
          />
          <g opacity={gradientReveal.opacity}>
            <line
              x1={scale.x(triangleLeftTime)}
              y1={scale.y(triangleLeftValue)}
              x2={scale.x(triangleRightTime)}
              y2={scale.y(triangleLeftValue)}
              stroke={T.red}
              strokeWidth={5}
              strokeDasharray="10 8"
            />
            <line
              x1={scale.x(triangleRightTime)}
              y1={scale.y(triangleLeftValue)}
              x2={scale.x(triangleRightTime)}
              y2={scale.y(triangleRightValue)}
              stroke={T.red}
              strokeWidth={5}
              strokeDasharray="10 8"
            />
          </g>
        </g>
        <circle
          cx={scale.x(time)}
          cy={scale.y(displacement)}
          r={15}
          fill={T.cyan}
          stroke={T.ink}
          strokeWidth={5}
          opacity={pointReveal.opacity}
        />
        <circle
          cx={scale.x(time)}
          cy={scale.y(displacement)}
          r={23 + pointPulse * 17}
          fill="none"
          stroke={T.cyan}
          strokeWidth={5}
          opacity={pointReveal.opacity * (1 - pointPulse * 0.35)}
        />
        <g opacity={gradientReveal.opacity}>
          <rect
            x={triangleLabelCenterX - 72}
            y={scale.y(triangleLeftValue) + triangleLabelOffsetY}
            width={144}
            height={43}
            rx={11}
            fill={T.ink}
          />
          <text
            x={triangleLabelCenterX}
            y={scale.y(triangleLeftValue) + triangleLabelOffsetY + 31}
            fill={T.card}
            textAnchor="middle"
            fontFamily={T.mono}
            fontSize={28}
          >
            Δt = {(triangleRightTime - triangleLeftTime).toFixed(1)}
          </text>
        </g>
      </svg>

      <div style={{ position: 'absolute', left: 1440, top: 275, width: 400 }}>
        <WarmCard accent={T.amber} style={{ padding: '30px 28px', minHeight: 470 }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 23, fontWeight: 850, letterSpacing: 0 }}>
            velocity = tangent gradient
          </div>
          <div style={{ marginTop: 26, opacity: pointReveal.opacity }}>
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 28, fontWeight: 850 }}>instant</div>
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 35, fontWeight: 950, marginTop: 7 }}>
              t = {time.toFixed(2)} s
            </div>
            <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 30, fontWeight: 900, marginTop: 5 }}>
              s = {displacement.toFixed(2)} m
            </div>
          </div>
          <div style={{ marginTop: 24, opacity: gradientReveal.opacity }}>
            <MathTeX tex={'v=\\frac{\\mathrm{d}s}{\\mathrm{d}t}'} color={T.ink} fontSize={43} />
          </div>
          <div
            style={{
              marginTop: 20,
              borderRadius: 18,
              background: `${T.amber}26`,
              padding: '20px 12px',
              textAlign: 'center',
              color: T.ink,
              fontFamily: T.mono,
              fontSize: 42,
              fontWeight: 950,
              opacity: tangentReveal.opacity,
            }}
          >
            {velocity.toFixed(2)} m/s
          </div>
          <div style={{ marginTop: 17, color: T.ink, fontSize: 28, fontWeight: 750, textAlign: 'center', opacity: gradientReveal.opacity }}>
            tangent gradient = velocity
          </div>
        </WarmCard>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S06 — CROSSING THE Origin
// ─────────────────────────────────────────────────────────────────────────────

const Scene06: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const towardAt = cueAt(scene, 'toward');
  const originAt = cueAt(scene, 'origin');
  const negativeAt = cueAt(scene, 'negative');
  const flipsAt = cueAt(scene, 'flips');
  const distanceAt = spokenAt(scene, 'distance');
  const toward = useCue(towardAt, 0.32);
  const origin = useCue(originAt, 0.3);
  const negative = useCue(negativeAt, 0.38);
  const flips = useCue(flipsAt, 0.35);
  const distanceReveal = useCue(distanceAt, 0.4);
  const toOrigin = useProgress(towardAt, originAt);
  const pastOrigin = useProgress(originAt, scene.duration - 0.65);
  const originPulse = useSpringAt(originAt, 29);
  const graphWidth = 1240;
  const graphHeight = 575;
  const graphLeft = 78;
  const graphTop = 220;
  const trackTop = 814;
  const trackLeft = 78;
  const scale = makePlotScale(graphWidth, graphHeight, 10, -8, 10);
  const position = 8 * (1 - toOrigin) - 6 * pastOrigin;
  const graphTime = 5 * toOrigin + 5 * pastOrigin;
  const trackMap = (value: number) => 58 + (value + 8) / 18 * (graphWidth - 116);
  const originGlobalX = trackLeft + trackMap(0);
  const particleGlobalY = trackTop + 76;
  const displayedArrowPosition = position >= 0 ? position : position * flips.opacity;
  const distance = 8 * toOrigin + 6 * pastOrigin;

  return (
    <SceneShell scene={6} label="signed position">
      <SectionTitle kicker="cross the zero line" at={towardAt}>
        Displacement changes sign at the origin
      </SectionTitle>

      <svg
        width={graphWidth}
        height={graphHeight}
        style={{ position: 'absolute', left: graphLeft, top: graphTop }}
      >
        <GraphAxes
          width={graphWidth}
          height={graphHeight}
          xMax={10}
          yMin={-8}
          yMax={10}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[-8, -4, 0, 4, 8]}
          id="s06"
        />
        <rect
          x={scale.left}
          y={scale.y(0)}
          width={graphWidth - scale.left - scale.right}
          height={graphHeight - scale.bottom - scale.y(0)}
          fill={T.red}
          opacity={negative.opacity * 0.14}
          clipPath="url(#s06-clip)"
        />
        <line
          x1={scale.x(0)} y1={scale.y(8)} x2={scale.x(5)} y2={scale.y(0)}
          pathLength={1} stroke={T.cyan} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={1} strokeDashoffset={1 - toOrigin} opacity={toward.opacity}
        />
        <line
          x1={scale.x(5)} y1={scale.y(0)} x2={scale.x(10)} y2={scale.y(-6)}
          pathLength={1} stroke={T.amber} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={1} strokeDashoffset={1 - pastOrigin} opacity={origin.opacity}
        />
        <circle
          cx={scale.x(graphTime)}
          cy={scale.y(position)}
          r={13}
          fill={position < 0 ? T.amber : T.cyan}
          stroke={T.ink}
          strokeWidth={5}
          opacity={toward.opacity}
        />
        <g opacity={negative.opacity}>
          <rect x={scale.x(6.2)} y={scale.y(-4.2)} width={302} height={48} rx={12} fill={T.red} />
          <text x={scale.x(6.2) + 151} y={scale.y(-4.2) + 34} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900}>
            NEGATIVE SIDE
          </text>
        </g>
      </svg>

      <div style={{ position: 'absolute', left: trackLeft, top: trackTop }}>
        <TrackDiagram
          width={graphWidth}
          min={-8}
          max={10}
          position={position}
          ticks={[-8, -4, 0, 4, 8]}
          originOpacity={origin.opacity}
          displacementArrowPosition={displayedArrowPosition}
          displacementArrowOpacity={toward.opacity}
          direction={-1}
          directionOpacity={toward.opacity}
          color={position < 0 ? T.amber : T.cyan}
        />
      </div>

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <circle
          cx={originGlobalX}
          cy={particleGlobalY}
          r={31 + originPulse * 24}
          fill="none"
          stroke={T.green}
          strokeWidth={6}
          opacity={origin.opacity * (1 - originPulse * 0.42)}
        />
      </svg>

      <div style={{ position: 'absolute', left: 1368, top: 285, width: 470 }}>
        <WarmCard accent={position < 0 ? T.amber : T.cyan} style={{ padding: '28px 30px', height: 230 }}>
          <div style={{ color: cardInk(position < 0 ? T.amber : T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>SIGNED DISPLACEMENT</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 54, fontWeight: 950, marginTop: 24, textAlign: 'center' }}>
            s = {position < 0 ? '−' : '+'}{Math.abs(position).toFixed(1)} m
          </div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, marginTop: 13, textAlign: 'center', opacity: flips.opacity }}>
            arrow points to the negative side
          </div>
        </WarmCard>
        <div style={{ marginTop: 28, opacity: distanceReveal.opacity }}>
          <WarmCard accent={T.green} style={{ padding: '26px 30px', height: 218 }}>
            <div style={{ color: cardInk(T.green), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>DISTANCE Distance</div>
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 52, fontWeight: 950, marginTop: 23, textAlign: 'center' }}>
              {distance.toFixed(1)} m
            </div>
            <div style={{ color: T.ink, fontSize: 28, fontWeight: 800, textAlign: 'center', marginTop: 10 }}>never negative</div>
          </WarmCard>
        </div>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S07 — WORKED JOURNEY
// ─────────────────────────────────────────────────────────────────────────────

const Scene07: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const twoAt = cueAt(scene, 'two-metres');
  const tenAt = cueAt(scene, 'ten-metres');
  const fourAt = cueAt(scene, 'four-seconds');
  const twoPerSecondAt = cueAt(scene, 'two-metres-per-second');
  const restsAt = cueAt(scene, 'rests');
  const sixAt = cueAt(scene, 'six-seconds');
  const minusSixAt = cueAt(scene, 'minus-six-metres');
  const tenSecondsAt = cueAt(scene, 'ten-seconds');
  const minusFourAt = cueAt(scene, 'minus-four-metres-per-second');
  const startReveal = useCue(twoAt, 0.32);
  const tenReveal = useCue(tenAt, 0.32);
  const fourReveal = useCue(fourAt, 0.32);
  const firstVelocityReveal = useCue(twoPerSecondAt - 2/30, 0.32);
  const restsReveal = useCue(restsAt, 0.32);
  const sixReveal = useCue(sixAt, 0.32);
  const minusSixReveal = useCue(minusSixAt, 0.32);
  const tenSecondsReveal = useCue(tenSecondsAt, 0.32);
  const finalVelocityReveal = useCue(minusFourAt - 2/30, 0.32);
  const firstLeg = useProgress(twoAt, fourAt);
  const restLeg = useProgress(restsAt, sixAt);
  const finalLeg = useProgress(sixAt, tenSecondsAt);
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const resting = frame >= restsAt * fps && frame < sixAt * fps;
  const returning = frame >= sixAt * fps;
  const position = returning ? 10 - 16 * finalLeg : 2 + 8 * firstLeg;
  const graphTime = returning ? 6 + 4 * finalLeg : resting ? 4 + 2 * restLeg : 4 * firstLeg;
  const graphWidth = 1315;
  const graphHeight = 590;
  const graphLeft = 70;
  const graphTop = 220;
  const scale = makePlotScale(graphWidth, graphHeight, 10, -8, 12);

  if(frame < cueAt(scene,'build')*fps)return <SceneShell scene={7} label="Walker"><SectionTitle kicker="">Consider a walker</SectionTitle><Givens scene={scene}/><JourneyTrack scene={scene}/><svg data-region="formula" width={1280} height={190} style={{position:'absolute',left:90,top:760}}><rect data-ink-panel="setup" width={1280} height={190} rx={25} fill={T.card}/><HandwrittenLine panel="setup" text="gradient = displacement change / time change" frame={frame} start={cueAt(scene,'formula')*30} end={cueAt(scene,'symbol')*30-2} x={35} y={30} size={24}/><HandwrittenLine panel="setup" text="v = Δs/Δt" frame={frame} start={cueAt(scene,'symbol')*30} end={(scene.holds?.[1].start??cueAt(scene,'build'))*30-4} x={35} y={92} size={31}/></svg></SceneShell>;

  return (
    <SceneShell scene={7} label="worked journey">
      <SectionTitle kicker="graph and track together" at={twoAt}>
        Build one journey from its numbers
      </SectionTitle>

      <svg
        width={graphWidth}
        height={graphHeight}
        style={{ position: 'absolute', left: graphLeft, top: graphTop }}
      >
        <GraphAxes
          width={graphWidth}
          height={graphHeight}
          xMax={10}
          yMin={-8}
          yMax={12}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[-6, -2, 0, 2, 6, 10]}
          id="s07"
          xTickLabelOpacity={(tick) => tick === 0
            ? 1
            : tick === 4
              ? fourReveal.opacity
              : tick === 6
                ? sixReveal.opacity
                : tick === 10
                  ? tenSecondsReveal.opacity
                  : 0}
          yTickLabelOpacity={(tick) => tick === 0
            ? 1
            : tick === 2
              ? startReveal.opacity
              : tick === 10
                ? tenReveal.opacity
                : tick === -6
                  ? minusSixReveal.opacity
                  : 0}
        />
        <line
          x1={scale.x(0)} y1={scale.y(2)} x2={scale.x(4)} y2={scale.y(10)}
          pathLength={1} stroke={T.cyan} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={1} strokeDashoffset={1 - firstLeg} opacity={startReveal.opacity}
        />
        <line
          x1={scale.x(4)} y1={scale.y(10)} x2={scale.x(6)} y2={scale.y(10)}
          pathLength={1} stroke={T.amber} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={1} strokeDashoffset={1 - restLeg} opacity={restsReveal.opacity}
        />
        <line
          x1={scale.x(6)} y1={scale.y(10)} x2={scale.x(10)} y2={scale.y(-6)}
          pathLength={1} stroke={T.red} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={1} strokeDashoffset={1 - finalLeg} opacity={sixReveal.opacity}
        />
        <circle
          cx={scale.x(graphTime)}
          cy={scale.y(position)}
          r={14}
          fill={returning ? T.red : resting ? T.amber : T.cyan}
          stroke={T.ink}
          strokeWidth={5}
          opacity={startReveal.opacity}
        />

        <g opacity={startReveal.opacity}>
          <circle cx={scale.x(0)} cy={scale.y(2)} r={12} fill={T.cyan} stroke={T.ink} strokeWidth={4} />
          <rect x={scale.x(0) + 16} y={scale.y(2) + 15} width={164} height={46} rx={11} fill={T.ink} />
          <text x={scale.x(0) + 98} y={scale.y(2) + 48} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={28}>s = 2 m</text>
        </g>
        <g>
          <circle cx={scale.x(4)} cy={scale.y(10)} r={12} fill={T.cyan} stroke={T.ink} strokeWidth={4} opacity={fourReveal.opacity} />
          <rect x={scale.x(4) - 92} y={scale.y(10) - 62} width={184} height={46} rx={11} fill={T.ink} opacity={tenReveal.opacity} />
          <text x={scale.x(4)} y={scale.y(10) - 29} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={28} opacity={tenReveal.opacity}>s = 10 m</text>
        </g>
        <g>
          <circle cx={scale.x(10)} cy={scale.y(-6)} r={12} fill={T.red} stroke={T.ink} strokeWidth={4} opacity={tenSecondsReveal.opacity} />
          <rect x={scale.x(10) - 210} y={scale.y(-6) - 62} width={190} height={46} rx={11} fill={T.ink} opacity={minusSixReveal.opacity} />
          <text x={scale.x(10) - 115} y={scale.y(-6) - 29} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={28} opacity={minusSixReveal.opacity}>s = −6 m</text>
        </g>

        <g opacity={fourReveal.opacity}>
          <line x1={scale.x(0)} y1={scale.y(2)} x2={scale.x(4)} y2={scale.y(2)} stroke={T.green} strokeWidth={4} strokeDasharray="9 7" />
          <line x1={scale.x(4)} y1={scale.y(2)} x2={scale.x(4)} y2={scale.y(10)} stroke={T.green} strokeWidth={4} strokeDasharray="9 7" />
          <rect x={scale.x(2.15)} y={scale.y(2) + 14} width={180} height={44} rx={10} fill={T.ink} />
          <text x={scale.x(2.15) + 90} y={scale.y(2) + 46} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={28}>Δt = 4 s</text>
          <text x={scale.x(4) + 16} y={(scale.y(2) + scale.y(10)) / 2 + 9} fill={T.green} fontFamily={T.mono} fontSize={28} fontWeight={900}>Δs = 8 m</text>
        </g>

        <g opacity={firstVelocityReveal.opacity}>
          <rect x={scale.x(1.3)} y={scale.y(7.3) - 60} width={218} height={48} rx={12} fill={T.cyan} />
          <text data-figure="speed2" x={scale.x(1.3) + 109} y={scale.y(7.3) - 26} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={950}>v = +2 m/s</text>
        </g>
        <g opacity={restsReveal.opacity}>
          <rect x={scale.x(4.25)} y={scale.y(10) + 18} width={180} height={48} rx={12} fill={T.amber} />
          <text x={scale.x(4.25) + 90} y={scale.y(10) + 52} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={950}>v = 0</text>
        </g>
        <g opacity={finalVelocityReveal.opacity}>
          <rect x={scale.x(7.25)} y={scale.y(10) + 18} width={230} height={48} rx={12} fill={T.red} />
          <text data-figure="speed-4" x={scale.x(7.25) + 115} y={scale.y(10) + 52} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={950}>v = −4 m/s</text>
        </g>
      </svg>

      <div style={{ position: 'absolute', left: graphLeft, top: 824 }}>
        <TrackDiagram
          width={graphWidth}
          min={-8}
          max={12}
          position={position}
          ticks={[0, 2, 10, -6]}
          tickLabelOpacity={(tick) => tick === 0
            ? 1
            : tick === 2
              ? startReveal.opacity
              : tick === 10
                ? tenReveal.opacity
                : minusSixReveal.opacity}
          originOpacity={startReveal.opacity}
          displacementArrowPosition={position}
          displacementArrowOpacity={startReveal.opacity}
          direction={returning ? -1 : resting ? 0 : 1}
          directionOpacity={startReveal.opacity}
          color={returning ? T.red : resting ? T.amber : T.cyan}
        />
      </div>

      <div data-region="story-working" style={{ position: 'absolute', left: 1420, top: 230, width: 430, opacity: 1 }}><Givens scene={scene} embedded/><div style={{height:20}}/>
        <WarmCard accent={returning ? T.red : resting ? T.amber : T.cyan} style={{ padding: '29px 28px', height: 225 }}>
          <div style={{ color: cardInk(returning ? T.red : resting ? T.amber : T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>Position</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 48, fontWeight: 950, textAlign: 'center', marginTop: 12 }}>
            {position < 0 ? '−' : ''}{Math.abs(position).toFixed(1)} m
          </div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 800, textAlign: 'center', marginTop: 12 }}>
            {returning ? 'moving negative ←' : resting ? 'at rest' : 'moving positive →'}
          </div>
        </WarmCard>
        <div style={{ marginTop: 30, opacity: 1 }}>
          <WarmCard accent={T.green} style={{ padding: '25px 28px', height: 190 }}>
            <div style={{color:T.ink,fontSize:22}}>velocity = gradient</div><div style={{color:T.ink,fontSize:26,marginTop:8}}>v = Δs/Δt</div>
            <svg width={370} height={55} style={{marginTop:8}}><rect data-ink-panel="last-slope" width={370} height={55} fill="none"/><g data-substitution="pos-6,pos10,time10,time6" data-start={minusSixAt} data-end={minusFourAt+1}><HandwrittenLine panel="last-slope" text="v = (−6−10)/(10−6) = −4" frame={frame} start={minusSixAt*30} end={(scene.holds?.at(-1)?.start??minusFourAt+1)*30-4} x={4} y={8} size={17}/></g></svg>
          </WarmCard>
        </div>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S08 — DISTANCE VERSUS DISPLACEMENT
// ─────────────────────────────────────────────────────────────────────────────

const Scene08: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const finishAt = cueAt(scene, 'finish');
  const minusEightAt = cueAt(scene, 'minus-eight');
  const distanceAt = cueAt(scene, 'distance-formula');
  const everyLegAt = cueAt(scene, 'every-leg');
  const eightAt = cueAt(scene, 'eight-metres-out');
  const sixteenAt = cueAt(scene, 'sixteen-metres-back');
  const twentyFourAt = cueAt(scene, 'twenty-four');
  const finish = useCue(finishAt, 0.38);
  const minusEight = useCue(minusEightAt - 2/30, 0.34);
  const distance = useCue(distanceAt, 0.34);
  const everyLeg = useCue(everyLegAt, 0.38);
  const eight = useCue(eightAt - 2/30, 0.34);
  const sixteen = useCue(sixteenAt - 2/30, 0.34);
  const twentyFour = useCue(twentyFourAt - 2/30, 0.34);
  const graphPulseIn = useSpringAt(everyLegAt, 14);
  const graphPulseOut = useProgress(everyLegAt + 0.42, everyLegAt + 0.78);
  const graphPulse = graphPulseIn * (1 - graphPulseOut);
  const odometerProgress = useProgress(sixteenAt, twentyFourAt);
  const odometerValue = eight.isActive ? 8 + 16 * odometerProgress : 0;
  const ribbonWidth = 1080;
  const ribbonHeight = 282;
  const ribbonScale = makePlotScale(ribbonWidth, ribbonHeight, 10, -8, 12, true);
  const trackWidth = 704;
  const trackMap = (value: number) => 50 + (value + 8) / 20 * (trackWidth - 100);

  return (
    <SceneShell scene={8} label="distance vs displacement">
      <SectionTitle kicker="same journey, two totals" at={finishAt}>
        Endpoints are not the whole route
      </SectionTitle>

      <svg
        width={ribbonWidth}
        height={ribbonHeight}
        style={{ position: 'absolute', left: 420, top: 208 }}
      >
        <GraphAxes
          width={ribbonWidth}
          height={ribbonHeight}
          xMax={10}
          yMin={-8}
          yMax={12}
          xTicks={[0, 4, 6, 10]}
          yTicks={[-6, 0, 2, 10]}
          id="s08"
          compact
        />
        <line
          x1={ribbonScale.x(0)} y1={ribbonScale.y(2)} x2={ribbonScale.x(4)} y2={ribbonScale.y(10)}
          stroke={T.cyan} strokeWidth={9 + graphPulse * 7} strokeLinecap="round"
        />
        <line
          x1={ribbonScale.x(4)} y1={ribbonScale.y(10)} x2={ribbonScale.x(6)} y2={ribbonScale.y(10)}
          stroke={T.textMuted} strokeWidth={8} strokeLinecap="round"
        />
        <line
          x1={ribbonScale.x(6)} y1={ribbonScale.y(10)} x2={ribbonScale.x(10)} y2={ribbonScale.y(-6)}
          stroke={T.red} strokeWidth={9 + graphPulse * 7} strokeLinecap="round"
        />
      </svg>

      <div style={{ position: 'absolute', left: 108, top: 505, opacity: finish.opacity }}>
        <WarmCard accent={T.amber} style={{ width: 770, height: 425, padding: '26px 30px' }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 23, fontWeight: 850, letterSpacing: 0 }}>displacement = finish − start</div>
          <div style={{fontSize:23,marginTop:5}}>Δs = s final − s initial</div><svg width={trackWidth} height={140} style={{ marginTop: 0 }}>
            <line x1={50} y1={80} x2={trackWidth - 50} y2={80} stroke={T.ink} strokeWidth={5} strokeLinecap="round" />
            {[-8, -4, 0, 4, 8, 12].map((tick) => (
              <g key={tick}>
                <line x1={trackMap(tick)} y1={65} x2={trackMap(tick)} y2={95} stroke={T.ink} strokeWidth={3} />
                <text x={trackMap(tick)} y={130} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28}>{tick}</text>
              </g>
            ))}
            <AttachedArrow x1={trackMap(2)} x2={trackMap(-6)} y={48} color={T.amber} opacity={finish.opacity} />
            <circle cx={trackMap(2)} cy={80} r={15} fill={T.cyan} stroke={T.ink} strokeWidth={4} />
            <circle cx={trackMap(-6)} cy={80} r={15} fill={T.red} stroke={T.ink} strokeWidth={4} />
            <text data-figure="start2" x={trackMap(2)} y={35} fill={cardInk(T.cyan)} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900}>start: 2 m</text>
            <text data-figure="finish-6" x={trackMap(-6)} y={35} fill={cardInk(T.red)} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900}>finish: −6 m</text>
          <text data-figure="pos-8" x={450} y={60} fontSize={26} fill={T.ink} opacity={minusEight.opacity}>Δs = −8 m</text></svg>
          <div
            style={{
              borderRadius: 17,
              background: `${T.amber}20`,
              padding: '14px 18px',
              textAlign: 'center',
              color: T.ink,
              fontFamily: T.mono,
              fontSize: 35,
              fontWeight: 950,
              opacity: 1,
            }}
          >
<svg width={650} height={48}><rect data-ink-panel="displacement-total" width={650} height={48} fill="none"/><g data-substitution="start2,finish-6" data-start={finishAt+1} data-end={minusEightAt+1}><HandwrittenLine panel="displacement-total" text="−6 − 2 = −8 m" frame={useCurrentFrame()} start={(cueAt(scene,'symbol')+1)*30} end={(scene.holds?.[0].start??minusEightAt+1)*30-3} x={130} y={4} size={28}/></g></svg>
          </div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, textAlign: 'center', marginTop: 11, opacity: minusEight.opacity }}>
            signed • may be negative
          </div>
        </WarmCard>
      </div>

      <div style={{ position: 'absolute', left: 1042, top: 505, opacity: distance.opacity }}>
        <WarmCard accent={T.cyan} style={{ width: 770, height: 425, padding: '26px 30px' }}>
          <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 23, fontWeight: 850, letterSpacing: 0 }}>distance = sum of absolute changes</div>
          <div style={{fontSize:23,marginTop:5}}>D = Σ|Δs|</div><div style={{ display: 'flex', gap: 18, marginTop: 6 }}>
            <div style={{ flex: 1, height: 90, borderRadius: 16, background: `${T.cyan}1f`, padding: '14px 18px', opacity: distance.opacity }}>
              <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}>OUT</div>
              <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 34, fontWeight: 950, marginTop: 15 }}><span data-figure="pos8">+8 m</span></div>
            </div>
            <div style={{ flex: 1, height: 90, borderRadius: 16, background: `${T.red}1f`, padding: '14px 18px', opacity: distance.opacity }}>
              <div style={{ color: cardInk(T.red), fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}>BACK</div>
              <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 34, fontWeight: 950, marginTop: 15 }}><span data-figure="pos16">+16 m</span></div>
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              borderRadius: 18,
              border: `3px solid ${T.cyan}`,
              background: `${T.cyan}14`,
              padding: '15px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 28, fontWeight: 850 }}>Distance</div>
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 56, fontWeight: 950, marginTop: 16 }}>
              <span data-figure="pos24">{odometerValue.toFixed(1)} m</span>
            </div>
          </div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 800, textAlign: 'center', marginTop: 10, opacity: 1 }}>
<svg width={650} height={45}><rect data-ink-panel="distance-total" width={650} height={45} fill="none"/><g data-substitution="pos8,pos16" data-start={eightAt} data-end={twentyFourAt+1}><HandwrittenLine panel="distance-total" text="8 + 16 = 24 m" frame={useCurrentFrame()} start={eightAt*30} end={(scene.holds?.[1].start??twentyFourAt+1)*30-3} x={150} y={3} size={28}/></g></svg>
          </div>
        </WarmCard>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S09 — TWO DIFFERENT AVERAGES
// ─────────────────────────────────────────────────────────────────────────────

const Scene09: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const tenAt = cueAt(scene, 'ten-seconds');
  const velocityAt = cueAt(scene, 'average-velocity');
  const minusPointEightAt = cueAt(scene, 'minus-zero-point-eight');
  const speedAt = cueAt(scene, 'average-speed');
  const twoPointFourAt = cueAt(scene, 'two-point-four');
  const directionAt = cueAt(scene, 'direction');
  const totalDistanceAt = spokenAt(scene, 'total distance');
  const clock = useCue(tenAt, 0.4);
  const velocity = useCue(velocityAt, 0.38);
  const velocityResult = useCue(minusPointEightAt - 2/30, 0.34);
  const speed = useCue(speedAt, 0.38);
  const speedResult = useCue(twoPointFourAt - 2/30, 0.34);
  const totalDistance = useCue(totalDistanceAt, 0.34);
  const directionReveal = useCue(directionAt, 0.3);
  const directionPulseIn = useSpringAt(directionAt, 14);
  const directionPulseOut = useProgress(directionAt + 0.35, directionAt + 0.75);
  const directionPulse = directionPulseIn * (1 - directionPulseOut);

  return (
    <SceneShell scene={9} label="average rates">
      <SectionTitle kicker="one clock, two numerators">
        Average velocity and average speed
      </SectionTitle>

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line x1={745} y1={520} x2={825} y2={520} stroke={T.cyan} strokeWidth={5} strokeDasharray="10 8" opacity={clock.opacity} />
        <line x1={1095} y1={520} x2={1175} y2={520} stroke={T.cyan} strokeWidth={5} strokeDasharray="10 8" opacity={clock.opacity} />
      </svg>

      <div style={{ position: 'absolute', left: 95, top: 278, opacity: velocity.opacity }}>
        <WarmCard accent={T.amber} style={{ width: 650, height: 590, padding: '30px 30px' }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 29, fontWeight: 950, letterSpacing: 2 }}>AVERAGE VELOCITY</div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, marginTop: 10 }}>average velocity = displacement ÷ time</div><svg width={580} height={65}><line x1={490} y1={24} x2={85} y2={24} stroke={T.amber} strokeWidth={5}/><path d="M85 24 L105 14 V34 Z" fill={T.amber}/><text data-figure="pos-8" x={290} y={59} textAnchor="middle" fill={T.ink} fontSize={24}>Δs = −8 m</text></svg>
          <MathTeX
            tex={'\\bar v=\\frac{\\Delta s}{\\Delta t}'}
            color={T.ink}
            fontSize={43}
            style={{ marginTop: 8 }}
          /><svg width={580} height={50}><rect data-ink-panel="average-velocity" width={580} height={50} fill="none"/><g data-substitution="pos-8,time10" data-start={tenAt} data-end={scene.holds?.[0].start??minusPointEightAt+1}><HandwrittenLine panel="average-velocity" text="v = −8/10 = −0.8 m/s" frame={useCurrentFrame()} start={tenAt*30} end={(scene.holds?.[0].start??minusPointEightAt+1)*30-4} x={55} y={6} size={25}/></g></svg>
          <svg width={586} height={118} style={{ marginTop: 5, overflow: 'visible' }}>
            <rect x={96} y={10} width={452} height={94} rx={18} fill={`${T.amber}22`} stroke={T.amber} strokeWidth={3} opacity={velocityResult.opacity} />
            <text data-figure="speed-0.8" x={322} y={71} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={41} fontWeight={950} opacity={velocityResult.opacity}>
              −0.8 m/s
            </text>
            <g>
              <AttachedArrow
                x1={96}
                x2={18}
                y={57}
                color={T.amber}
                opacity={velocityResult.opacity}
                thickness={8 + directionPulse * 6}
              />
            </g>
          </svg>
          <div
            style={{
              marginTop: 25,
              borderRadius: 15,
              background: `${T.amber}18`,
              color: T.ink,
              fontFamily: T.mono,
              fontSize: 28,
              fontWeight: 900,
              textAlign: 'center',
              padding: '13px 14px',
              opacity: directionReveal.opacity,
              transform: `scale(${0.96 + directionReveal.opacity * 0.04})`,
            }}
          >
            SIGN KEEPS DIRECTION ←
          </div>
        </WarmCard>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 810,
          top: 390,
          width: 300,
          height: 300,
          opacity: 1,
          transform: `scale(1)`,
        }}
      >
        <svg data-region="clock" width={300} height={300}>
          <circle cx={150} cy={150} r={126} fill={T.panel} stroke={T.cyan} strokeWidth={8} style={{ filter: `drop-shadow(0 0 17px ${T.cyan}77)` }} />
          {Array.from({ length: 10 }, (_, index) => {
            const angle = index / 10 * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={index}
                x1={150 + Math.cos(angle) * 101}
                y1={150 + Math.sin(angle) * 101}
                x2={150 + Math.cos(angle) * 116}
                y2={150 + Math.sin(angle) * 116}
                stroke={T.card}
                strokeWidth={4}
              />
            );
          })}
          <line x1={150} y1={150} x2={150} y2={58} stroke={T.amber} strokeWidth={7} strokeLinecap="round" />
          <circle cx={150} cy={150} r={12} fill={T.card} />
          <text data-figure="time10" x={150} y={191} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={50} fontWeight={950}>10 s</text>
          <text x={150} y={245} fill={T.textMuted} textAnchor="middle" fontFamily={T.mono} fontSize={28}>Total time</text>
        </svg>
      </div>

      <div style={{ position: 'absolute', left: 1175, top: 278, opacity: speed.opacity }}>
        <WarmCard accent={T.cyan} style={{ width: 650, height: 590, padding: '30px 30px' }}>
          <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 29, fontWeight: 950, letterSpacing: 2 }}>AVERAGE SPEED</div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, marginTop: 10 }}>average speed = distance ÷ time</div><svg width={580} height={65}><path d="M85 15 H490 V32 H85" stroke={T.cyan} strokeWidth={4} fill="none"/><text data-figure="pos24" x={290} y={61} textAnchor="middle" fill={T.ink} fontSize={24}>D = 8 + 16 = 24 m</text></svg>
          <MathTeX
            tex={'\\text{average speed}=D/\\Delta t'}
            color={T.ink}
            fontSize={40}
            style={{ marginTop: 8 }}
          /><svg width={580} height={50}><rect data-ink-panel="average-speed" width={580} height={50} fill="none"/><g data-substitution="pos24,time10" data-start={cueAt(scene,'speed-symbol')} data-end={scene.holds?.[1].start??twoPointFourAt+1}><HandwrittenLine panel="average-speed" text="24/10 = 2.4 m/s" frame={useCurrentFrame()} start={cueAt(scene,'speed-symbol')*30} end={(scene.holds?.[1].start??twoPointFourAt+1)*30-4} x={100} y={6} size={25}/></g></svg>
          <div
            style={{
              width: 452,
              height: 94,
              boxSizing: 'border-box',
              margin: '5px auto 0',
              borderRadius: 18,
              border: `3px solid ${T.cyan}`,
              background: `${T.cyan}22`,
              color: T.ink,
              textAlign: 'center',
              fontFamily: T.mono,
              fontSize: 41,
              fontWeight: 950,
              paddingTop: 19,
              opacity: speedResult.opacity,
            }}
          >
            <span data-figure="speed2.4">2.4 m/s</span>
          </div>
          <div
            style={{
              marginTop: 18,
              borderRadius: 15,
              background: `${T.cyan}18`,
              color: T.ink,
              fontFamily: T.mono,
              fontSize: 28,
              fontWeight: 900,
              textAlign: 'center',
              padding: '13px 14px',
              opacity: totalDistance.opacity,
            }}
          >
            24 m TOTAL DISTANCE
          </div>
        </WarmCard>
      </div>
    </SceneShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// S10 — RECAP
// ─────────────────────────────────────────────────────────────────────────────

const RecapTile: React.FC<{
  at: number;
  title: string;
  accent: string;
  x: number;
  y: number;
  children: React.ReactNode;
}> = ({ at, title, accent, x, y, children }) => {
  const reveal = useCue(at, 0.35);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: reveal.opacity,
        transform: `translateY(${(1 - reveal.opacity) * 18}px) scale(${0.97 + reveal.opacity * 0.03})`,
      }}
    >
      <WarmCard accent={accent} style={{ width: 790, height: 285, padding: '18px 22px', overflow: 'hidden' }}>
        <div style={{ color: cardInk(accent), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 1.8 }}>{title}</div>
        {children}
      </WarmCard>
    </div>
  );
};

const Scene10: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const graphAt = -1;
  const gradientAt = cueAt(scene, 'gradient');
  const tangentAt = cueAt(scene, 'tangent');
  const distanceAt = cueAt(scene, 'distance');
  const displacementAt = cueAt(scene, 'endpoint-displacement');
  const separateAt = cueAt(scene, 'separate');
  const graphDraw = useProgress(graphAt, gradientAt);
  const tangentPivot = useProgress(tangentAt, distanceAt);
  const distance = useCue(distanceAt, 0.32);
  const displacement = useCue(displacementAt, 0.32);
  const separate = useCue(separateAt, 0.22);
  const finalProgress = useSpringAt(separateAt, 29);
  const tangentTime = 2 + 4 * tangentPivot;
  const tangentDisplacement = curveValue(tangentTime);
  const tangentGradient = curveGradient(tangentTime);
  const miniScale = makePlotScale(746, 225, 8, 0, 18, true);
  const miniCurvePath = sampledPath(miniScale, 0, 8, curveValue, 60);
  const tangentY0 = tangentDisplacement - tangentGradient * tangentTime;
  const tangentY8 = tangentDisplacement + tangentGradient * (8 - tangentTime);
  const journeyMap = (value: number) => 80 + (value + 8) / 20 * 620;

  if (separate.isActive) {
    return (
      <SceneShell scene={10} label="recap"><div style={{position:"absolute",left:110,right:110,top:975,display:"flex",justifyContent:"space-between",color:T.text,fontSize:24}}>{OUTCOMES.map(x=><span key={x}>✓ {x}</span>)}</div>
        <svg width={260} height={95} style={{position:"absolute",left:830,top:867}}><path d="M10 80 H250 M10 80 V5 M10 70 L85 10 H130 L250 80" stroke={T.cyan} strokeWidth={4} fill="none"/></svg><SectionTitle kicker="twenty-second recap" at={separateAt}>
          Keep the two averages separate
        </SectionTitle>
        <div style={{ position: 'absolute', left: 150, right: 150, top: 280, display: 'flex', gap: 54 }}>
          <WarmCard
            accent={T.cyan}
            style={{
              flex: 1,
              height: 340,
              padding: '34px 38px',
              opacity: finalProgress,
              transform: `translateX(${(1 - finalProgress) * -40}px)`,
            }}
          >
            <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 29, fontWeight: 950, letterSpacing: 2 }}>DISTANCE / SPEED</div>
            <MathTeX tex={'\\sum |\\Delta s|=24\\,\\mathrm m'} color={T.ink} fontSize={47} style={{ marginTop: 40 }} />
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 32, fontWeight: 900, textAlign: 'center', marginTop: 34 }}>
              24 ÷ 10 = 2.4 m/s
            </div>
            <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, textAlign: 'center', marginTop: 18 }}>all ground covered • no direction</div>
          </WarmCard>
          <WarmCard
            accent={T.amber}
            style={{
              flex: 1,
              height: 340,
              padding: '34px 38px',
              opacity: finalProgress,
              transform: `translateX(${(1 - finalProgress) * 40}px)`,
            }}
          >
            <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 29, fontWeight: 950, letterSpacing: 2 }}>DISPLACEMENT / VELOCITY</div>
            <MathTeX tex={'s_f-s_i=-8\\,\\mathrm m'} color={T.ink} fontSize={47} style={{ marginTop: 40 }} />
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 32, fontWeight: 900, textAlign: 'center', marginTop: 34 }}>
              −8 ÷ 10 = −0.8 m/s
            </div>
            <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, textAlign: 'center', marginTop: 18 }}>endpoint change • keeps direction</div>
          </WarmCard>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 285,
            right: 285,
            top: 685,
            opacity: finalProgress,
            transform: `scale(${0.9 + finalProgress * 0.1})`,
          }}
        >
          <WarmCard accent={T.green} style={{ padding: '32px 44px', minHeight: 175, display: 'grid', placeItems: 'center' }}>
            <div style={{ color: T.ink, textAlign: 'center', fontSize: 48, fontWeight: 950 }}>
              Position gives the point. <span style={{ color: cardInk(T.green) }}>Gradient gives the motion.</span>
            </div>
          </WarmCard>
        </div>
      </SceneShell>
    );
  }

  return (
    <SceneShell scene={10} label="recap"><div style={{position:"absolute",left:110,right:110,top:975,display:"flex",justifyContent:"space-between",color:T.text,fontSize:24}}>{OUTCOMES.map(x=><span key={x}>✓ {x}</span>)}</div>
      <SectionTitle kicker="twenty-second recap" at={graphAt}>
        Four pictures to read any graph
      </SectionTitle>

      <RecapTile at={graphAt} title="1 • POSITION ↔ GRAPH POINT" accent={T.cyan} x={120} y={230}>
        <svg width={746} height={225} style={{ marginTop: 7 }}>
          <line x1={80} y1={145} x2={700} y2={145} stroke={T.ink} strokeWidth={4} />
          <line x1={80} y1={145} x2={80} y2={26} stroke={T.ink} strokeWidth={4} />
          {[0, 5, 10].map((tick) => (
            <g key={tick}>
              <line x1={80 + tick / 10 * 620} y1={138} x2={80 + tick / 10 * 620} y2={152} stroke={T.ink} strokeWidth={3} />
              <text x={80 + tick / 10 * 620} y={182} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28}>{tick}</text>
            </g>
          ))}
          <text x={680} y={124} fill={cardInk(T.cyan)} textAnchor="end" fontFamily={T.mono} fontSize={28}>time, t / s</text>
          <text x={26} y={88} fill={cardInk(T.cyan)} textAnchor="middle" fontFamily={T.mono} fontSize={28} transform="rotate(-90 26 88)">s / m</text>
          <line
            x1={80} y1={145} x2={700} y2={35}
            pathLength={1} stroke={T.cyan} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={1} strokeDashoffset={1 - graphDraw}
          />
          <line x1={80} y1={197} x2={700} y2={197} stroke={T.ink} strokeWidth={4} />
          <circle cx={80 + 620 * graphDraw} cy={197} r={16} fill={T.cyan} stroke={T.ink} strokeWidth={4} />
          <line x1={80 + 620 * graphDraw} y1={197} x2={80 + 620 * graphDraw} y2={145 - 110 * graphDraw} stroke={T.amber} strokeWidth={3} strokeDasharray="8 7" />
        </svg>
      </RecapTile>

      <RecapTile at={gradientAt} title="2 • GRADIENT = VELOCITY" accent={T.green} x={1010} y={230}>
        <svg width={746} height={225} style={{ marginTop: 7 }}>
          <line x1={60} y1={183} x2={335} y2={183} stroke={T.ink} strokeWidth={4} />
          <line x1={60} y1={183} x2={60} y2={30} stroke={T.ink} strokeWidth={4} />
          <line x1={80} y1={160} x2={315} y2={82} stroke={T.cyan} strokeWidth={9} strokeLinecap="round" />
          <text x={198} y={217} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28}>v = +1</text>
          <line x1={410} y1={183} x2={685} y2={183} stroke={T.ink} strokeWidth={4} />
          <line x1={410} y1={183} x2={410} y2={30} stroke={T.ink} strokeWidth={4} />
          <line x1={432} y1={166} x2={665} y2={43} stroke={T.green} strokeWidth={11} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${T.green})` }} />
          <text x={548} y={217} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28}>v = +3</text>
          <text x={372} y={112} fill={cardInk(T.green)} textAnchor="middle" fontFamily={T.mono} fontSize={30} fontWeight={950}>→</text>
        </svg>
      </RecapTile>

      <RecapTile at={tangentAt} title="3 • CURVE NEEDS A TANGENT" accent={T.amber} x={120} y={550}>
        <svg width={746} height={225} style={{ marginTop: 7 }}>
          <defs><clipPath id="s10-tangent-clip"><rect x={miniScale.left} y={miniScale.top} width={746 - miniScale.left - miniScale.right} height={225 - miniScale.top - miniScale.bottom} /></clipPath></defs>
          <line x1={miniScale.left} y1={225 - miniScale.bottom} x2={746 - miniScale.right} y2={225 - miniScale.bottom} stroke={T.ink} strokeWidth={4} />
          <line x1={miniScale.left} y1={225 - miniScale.bottom} x2={miniScale.left} y2={miniScale.top} stroke={T.ink} strokeWidth={4} />
          <path d={miniCurvePath} fill="none" stroke={T.cyan} strokeWidth={8} strokeLinecap="round" />
          <g clipPath="url(#s10-tangent-clip)">
            <line x1={miniScale.x(0)} y1={miniScale.y(tangentY0)} x2={miniScale.x(8)} y2={miniScale.y(tangentY8)} stroke={T.amber} strokeWidth={7} />
          </g>
          <circle cx={miniScale.x(tangentTime)} cy={miniScale.y(tangentDisplacement)} r={11} fill={T.cyan} stroke={T.ink} strokeWidth={4} />
          <rect x={500} y={168} width={222} height={45} rx={11} fill={`${T.amber}30`} />
          <text x={611} y={200} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={950}>v = {tangentGradient.toFixed(1)}</text>
        </svg>
      </RecapTile>

      <RecapTile at={distanceAt} title="4 • ROUTE TOTAL vs ENDPOINT CHANGE" accent={T.purple} x={1010} y={550}>
        <svg width={746} height={225} style={{ marginTop: 7 }}>
          <line x1={80} y1={73} x2={700} y2={73} stroke={T.ink} strokeWidth={4} />
          <AttachedArrow x1={journeyMap(2)} x2={journeyMap(-6)} y={44} color={T.amber} opacity={displacement.opacity} />
          <circle cx={journeyMap(2)} cy={73} r={13} fill={T.cyan} stroke={T.ink} strokeWidth={4} />
          <circle cx={journeyMap(-6)} cy={73} r={13} fill={T.red} stroke={T.ink} strokeWidth={4} opacity={displacement.opacity} />
          <rect x={55} y={116} width={294} height={92} rx={16} fill={`${T.cyan}20`} stroke={T.cyan} strokeWidth={3} opacity={distance.opacity} />
          <text x={202} y={151} fill={cardInk(T.cyan)} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900} opacity={distance.opacity}>DISTANCE</text>
          <text x={202} y={190} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={35} fontWeight={950} opacity={distance.opacity}>24 m</text>
          <rect x={397} y={116} width={294} height={92} rx={16} fill={`${T.amber}20`} stroke={T.amber} strokeWidth={3} opacity={displacement.opacity} />
          <text x={544} y={151} fill={cardInk(T.amber)} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900} opacity={displacement.opacity}>DISPLACEMENT</text>
          <text x={544} y={190} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={35} fontWeight={950} opacity={displacement.opacity}>−8 m</text>
        </svg>
      </RecapTile>
    </SceneShell>
  );
};

function useStillAudit(enabled:boolean,rootRef:React.RefObject<HTMLDivElement|null>) {
  const frame=useCurrentFrame();
  const [measurement,setMeasurement]=useState('');
  const [auditHandle]=useState(()=>enabled?delayRender('Measure laid-out travel graph still'):null);
  useLayoutEffect(()=>{
    let request=0;
    const measure=()=>{
    const root=rootRef.current;
    if(!enabled||!root)return;
    if(!Array.from<Element>(root.querySelectorAll('[data-scene]')).some(el=>el.getBoundingClientRect().width>0)){request=requestAnimationFrame(measure);return;}
    const visible=(el:Element):boolean=>{
      let node:Element|null=el;
      while(node&&node!==root){const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)<.01)return false;node=node.parentElement;}
      const r=el.getBoundingClientRect();return r.width>0&&r.height>0;
    };
    const regions=Array.from<Element>(root.querySelectorAll('[data-region]')).filter(visible).filter(el=>!el.parentElement?.closest('[data-region]'));
    const labels=Array.from<Element>(root.querySelectorAll('[data-axis-text]')).filter(visible);
    const collisions: {text:string;other:string}[]=[];
    labels.forEach((a,i)=>labels.slice(i+1).forEach(b=>{
      if(a.closest('[data-scene]')!==b.closest('[data-scene]'))return;
      const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();
      if(x.left<y.right+1&&x.right+1>y.left&&x.top<y.bottom+1&&x.bottom+1>y.top)collisions.push({text:a.textContent??'',other:b.textContent??''});
    }));
    const bounds=root.getBoundingClientRect();
    const overlaps=(a:DOMRect,b:DOMRect)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
    const outside=(a:DOMRect,b:DOMRect)=>a.left<b.left-1||a.right>b.right+1||a.top<b.top-1||a.bottom>b.bottom+1;
    // Text-node ranges avoid treating a whole caption container as printed glyphs.
    const printed:{text:string;bounds:DOMRect}[]=[];
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node:Node|null;
    while((node=walker.nextNode())){
      const parent=node.parentElement;
      if(!node.textContent?.trim()||!parent||parent.closest('.katex-mathml')||!parent.closest('[data-scene]')||!visible(parent))continue;
      const range=document.createRange();range.selectNodeContents(node);
      for(const box of Array.from(range.getClientRects()))if(box.width&&box.height)printed.push({text:node.textContent.trim(),bounds:box});
    }
    const ink=Array.from<Element>(root.querySelectorAll('[data-ink-text]')).filter(visible);
    const inkLayouts=ink.map(el=>{
      const extent=el.querySelector('[data-ink-extent]')!.getBoundingClientRect();
      const panelId=el.getAttribute('data-ink-panel-id');
      const panel=el.closest('svg')?.querySelector(`[data-ink-panel="${panelId}"]`)?.getBoundingClientRect();
      const active=el.getAttribute('data-ink-active')==='true';
      return {scene:`s${el.closest('[data-scene]')!.getAttribute('data-scene')!.padStart(2,'0')}`,text:el.getAttribute('data-ink-text'),active,complete:el.getAttribute('data-ink-complete')==='true',
        bounds:extent.toJSON(),panel:panelId,panelBounds:panel?.toJSON(),
        end:Number(el.getAttribute('data-ink-end')),strokeEnds:JSON.parse(el.getAttribute('data-ink-stroke-ends')??'[]') as number[],
        overflow:active&&(!panel||outside(extent,panel)),
        collisions:active?printed.filter(text=>overlaps(extent,text.bounds)).map(text=>text.text):[]};
    });
    const ringCollisions:{ring:string;other:string}[]=[];
    const ringLayouts=Array.from<SVGPathElement>(root.querySelectorAll('[data-ring]')).filter(visible).map(el=>{
      const targetId=el.getAttribute('data-ring-target');
      const target=Array.from(root.querySelectorAll(`[data-figure="${targetId}"]`)).find(visible);
      const targetBounds=target?figureBounds(target):undefined;
      const r=el.getBoundingClientRect();
      const own=(box:DOMRect)=>targetBounds&&box.left>=targetBounds.left-1&&box.right<=targetBounds.right+1&&box.top>=targetBounds.top-1&&box.bottom<=targetBounds.bottom+1;
      for(const other of printed)if(!own(other.bounds)&&overlaps(r,other.bounds))ringCollisions.push({ring:targetId??'',other:other.text});
      return {id:el.getAttribute('data-ring'),target:targetId,progress:Number(el.getAttribute('data-progress')),bounds:r.toJSON(),targetBounds:targetBounds?.toJSON(),encloses:!!targetBounds&&!outside(targetBounds,r)};
    });
    const textOverflow=printed.filter(t=>outside(t.bounds,bounds)&&t.bounds.width>2).map(t=>t.text);
    const substitutions=Array.from(root.querySelectorAll('[data-substitution]')).filter(visible).flatMap(el=>{
      const id=`s${el.closest('[data-scene]')?.getAttribute('data-scene')?.padStart(2,'0')}`;let offset=0;for(const scene of TRANSCRIPT.scenes){if(scene.id===id)break;offset+=Math.ceil(scene.duration*30);}const local=(frame-offset)/30;
      if(local<Number(el.getAttribute('data-start'))||local>Number(el.getAttribute('data-end')))return [];
      return (el.getAttribute('data-substitution')??'').split(',').map(target=>({target,visible:Array.from(root.querySelectorAll(`[data-figure="${target}"]`)).some(visible),ring:ringLayouts.some(r=>r.target===target)}));
    });
    const inkCollisions=inkLayouts.filter(line=>line.collisions.length);
    const inkOverflow=inkLayouts.filter(line=>line.overflow);
    const overflow=labels.some(el=>outside(el.getBoundingClientRect(),el.closest('[data-scene]')?.getBoundingClientRect()??bounds))||inkOverflow.length>0;
    const cyclist=root.querySelector('[data-cyclist-x]');
    const measured=JSON.stringify({frame,visibleScenes:Array.from<Element>(root.querySelectorAll('[data-scene]')).filter(visible).map(el=>`s${el.getAttribute('data-scene')!.padStart(2,'0')}`),regions:Math.max(0,...Array.from(root.querySelectorAll('[data-scene]')).filter(visible).map(scene=>regions.filter(el=>el.closest('[data-scene]')===scene).length)),regionNames:regions.map(el=>el.getAttribute('data-region')),axisCollisions:collisions,axisText:labels.map(el=>({text:el.textContent,bounds:el.getBoundingClientRect().toJSON(),canvas:el.closest('[data-scene]')?.getBoundingClientRect().toJSON()})),overflow,inkLayouts,inkCollisions,inkOverflow,printedText:printed,substitutions,figureRings:ringLayouts,ringCollisions,textOverflow,underlines:Array.from(root.querySelectorAll('[data-underline]')).filter(visible).map(el=>el.getAttribute('data-underline')),figureTargets:Array.from(root.querySelectorAll('[data-figure]')).filter(visible).map(el=>({id:el.getAttribute('data-figure'),text:el.textContent,bounds:el.getBoundingClientRect().toJSON()})),inkText:inkLayouts.filter(line=>line.complete).map(line=>line.text),givens:Array.from(root.querySelectorAll('[data-givens], [data-region="givens"]')).filter(visible).map(el=>el.textContent),graphs:Array.from<Element>(root.querySelectorAll('[data-graph]')).filter(visible).map(el=>el.getAttribute('data-graph')),cyclist:cyclist?{x:Number(cyclist.getAttribute('data-cyclist-x')),wheelAngle:Number(cyclist.getAttribute('data-wheel-angle')),direction:Number(cyclist.getAttribute('data-direction'))}:null});
    setMeasurement(measured);
    (window as Window & {__displacementAudit?:unknown}).__displacementAudit=JSON.parse(measured);
    if(auditHandle!==null)continueRender(auditHandle);
    };
    request=requestAnimationFrame(()=>{request=requestAnimationFrame(measure);});
    return ()=>cancelAnimationFrame(request);
  },[frame,enabled,auditHandle]);
  return enabled&&measurement?<Artifact filename={`verify-displacement-${String(frame).padStart(5,'0')}.json`} content={measurement}/>:null;
}

const S00 = getScene('s00');
const S11 = getScene('s11');
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
  scene: MechanicsTranscriptScene;
  audioEnabled: boolean;
  children: React.ReactNode;
}> = ({ scene, audioEnabled, children }) => {
 const frame=useCurrentFrame();const hold=scene.holds?.find(h=>frame>=Math.ceil(h.start*30)&&frame<Math.ceil(h.end*30));
 const heldFrame=hold?Math.ceil(hold.start*30):frame;
 return <AbsoluteFill><Freeze frame={heldFrame}><VisualScene scene={scene}>{children}</VisualScene></Freeze>{audioEnabled&&<Audio src={staticFile(`audio/mechanics/${scene.audio}`)} volume={1}/>}</AbsoluteFill>;
};
const VisualScene:React.FC<{scene:MechanicsTranscriptScene;children:React.ReactNode}>=({scene,children})=>{const ref=useRef<HTMLDivElement>(null);return <AbsoluteFill ref={ref}>{children}<FigureAccents scene={scene} rootRef={ref}/></AbsoluteFill>;};

type PremountedTransitionSequenceProps = React.ComponentProps<typeof TransitionSeries.Sequence> & {
  premountFor?: number;
};

const PremountedTransitionSequence = TransitionSeries.Sequence as React.FC<PremountedTransitionSequenceProps>;

export const MechanicsDisplacementTimeGraphs: React.FC<MechanicsDisplacementTimeGraphsProps> = ({
  audioEnabled = true,
  audit = false,
}) => {
  const rootRef=useRef<HTMLDivElement>(null);
  const artifact=useStillAudit(audit,rootRef);
  const { fps } = useVideoConfig();
  const transition = (
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
  );

  return (
    <AbsoluteFill ref={rootRef} style={{ background: T.bg }}>{artifact}
      <TransitionSeries>
        <PremountedTransitionSequence name="Syllabus" durationInFrames={sceneDurationInFrames(S00, fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S00} audioEnabled={audioEnabled}><Scene00 scene={S00}/></NarratedScene></PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Position leaves a trace" durationInFrames={sceneDurationInFrames(S01, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S01} audioEnabled={audioEnabled}><Scene01 scene={S01} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Graph draws with motion" durationInFrames={sceneDurationInFrames(S02, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S02} audioEnabled={audioEnabled}><Scene02 scene={S02} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Gradient is velocity" durationInFrames={sceneDurationInFrames(S03, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S03} audioEnabled={audioEnabled}><Scene03 scene={S03} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Straight flat curved" durationInFrames={sceneDurationInFrames(S04, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S04} audioEnabled={audioEnabled}><Scene04 scene={S04} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Instantaneous velocity" durationInFrames={sceneDurationInFrames(S05, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S05} audioEnabled={audioEnabled}><Scene05 scene={S05} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Crossing the origin" durationInFrames={sceneDurationInFrames(S06, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S06} audioEnabled={audioEnabled}><Scene06 scene={S06} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Worked journey" durationInFrames={sceneDurationInFrames(S07, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S07} audioEnabled={audioEnabled}><Scene07 scene={S07} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Distance versus displacement" durationInFrames={sceneDurationInFrames(S08, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S08} audioEnabled={audioEnabled}><Scene08 scene={S08} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Two averages" durationInFrames={sceneDurationInFrames(S09, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S09} audioEnabled={audioEnabled}><Scene09 scene={S09} /></NarratedScene>
        </PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Cyclist journey" durationInFrames={sceneDurationInFrames(S11, fps)} premountFor={PREMOUNT_FRAMES}><NarratedScene scene={S11} audioEnabled={audioEnabled}><Scene11 scene={S11}/></NarratedScene></PremountedTransitionSequence>
        {transition}
        <PremountedTransitionSequence name="Recap" durationInFrames={sceneDurationInFrames(S10, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S10} audioEnabled={audioEnabled}><Scene10 scene={S10} /></NarratedScene>
        </PremountedTransitionSequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
