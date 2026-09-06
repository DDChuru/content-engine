/**
 * Displacement-Time Graphs
 *
 * A ten-scene, narration-driven mechanics explainer. Word-level Whisper cues
 * trigger every instructional reveal and the encoded narration determines each
 * scene's duration.
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
  <div
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
      {String(scene).padStart(2, '0')} / 10
    </span>
    <span>{label}</span>
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
    <AbsoluteFill
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
        MECHANICS LAB
      </div>
      <StepBadge scene={scene} label={label} />
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
        {kicker}
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
  const tickFontSize = 28;
  return (
    <g>
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
          <text
            x={scale.x(tick)}
            y={plotBottom + 34}
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
          <text
            x={scale.left - 18}
            y={scale.y(tick) + 9}
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
      <text
        x={(scale.left + plotRight) / 2}
        y={height - 17}
        fill={cardInk(T.cyan)}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={28}
        fontWeight={900}
        opacity={xLabelOpacity}
      >
        time, t / s
      </text>
      <text
        x={compact ? 24 : 30}
        y={(scale.top + plotBottom) / 2}
        fill={cardInk(T.cyan)}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={28}
        fontWeight={900}
        opacity={yLabelOpacity}
        transform={`rotate(-90 ${compact ? 24 : 30} ${(scale.top + plotBottom) / 2})`}
      >
        displacement, s / m
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
  label = 'laboratory track / m',
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
    <svg width={width} height={height}>
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
          <text x={originX} y={32} fill={T.green} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900}>ORIGIN</text>
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
        POSITION RECORD
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
            INCLINOMETER
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
  const reveal = useCue(at, 0.4);
  const readout = useCue(readoutAt, 0.35);
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
          v = {velocity.toFixed(1)} m/s
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
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>
            LIVE TANGENT
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
// S06 — CROSSING THE ORIGIN
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
            <div style={{ color: cardInk(T.green), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>DISTANCE ODOMETER</div>
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
  const firstVelocityReveal = useCue(twoPerSecondAt, 0.32);
  const restsReveal = useCue(restsAt, 0.32);
  const sixReveal = useCue(sixAt, 0.32);
  const minusSixReveal = useCue(minusSixAt, 0.32);
  const tenSecondsReveal = useCue(tenSecondsAt, 0.32);
  const finalVelocityReveal = useCue(minusFourAt, 0.32);
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
          <text x={scale.x(1.3) + 109} y={scale.y(7.3) - 26} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={950}>v = +2 m/s</text>
        </g>
        <g opacity={restsReveal.opacity}>
          <rect x={scale.x(4.25)} y={scale.y(10) + 18} width={180} height={48} rx={12} fill={T.amber} />
          <text x={scale.x(4.25) + 90} y={scale.y(10) + 52} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={950}>v = 0</text>
        </g>
        <g opacity={finalVelocityReveal.opacity}>
          <rect x={scale.x(7.25)} y={scale.y(10) + 18} width={230} height={48} rx={12} fill={T.red} />
          <text x={scale.x(7.25) + 115} y={scale.y(10) + 52} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={950}>v = −4 m/s</text>
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

      <div style={{ position: 'absolute', left: 1420, top: 300, width: 430, opacity: startReveal.opacity }}>
        <WarmCard accent={returning ? T.red : resting ? T.amber : T.cyan} style={{ padding: '29px 28px', height: 300 }}>
          <div style={{ color: cardInk(returning ? T.red : resting ? T.amber : T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>LIVE POSITION</div>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 58, fontWeight: 950, textAlign: 'center', marginTop: 38 }}>
            {position < 0 ? '−' : ''}{Math.abs(position).toFixed(1)} m
          </div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 800, textAlign: 'center', marginTop: 22 }}>
            {returning ? 'moving negative ←' : resting ? 'at rest' : 'moving positive →'}
          </div>
        </WarmCard>
        <div style={{ marginTop: 30, opacity: finalVelocityReveal.opacity }}>
          <WarmCard accent={T.green} style={{ padding: '25px 28px', height: 190 }}>
            <div style={{ color: cardInk(T.green), fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>CHECK THE LAST SLOPE</div>
            <MathTeX tex={'v=\\frac{-6-10}{10-6}=-4\\,\\mathrm{m/s}'} color={T.ink} fontSize={32} style={{ marginTop: 24 }} />
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
  const distanceAt = spokenAt(scene, 'Distance');
  const everyLegAt = cueAt(scene, 'every-leg');
  const eightAt = cueAt(scene, 'eight-metres-out');
  const sixteenAt = cueAt(scene, 'sixteen-metres-back');
  const twentyFourAt = cueAt(scene, 'twenty-four');
  const finish = useCue(finishAt, 0.38);
  const minusEight = useCue(minusEightAt, 0.34);
  const distance = useCue(distanceAt, 0.34);
  const everyLeg = useCue(everyLegAt, 0.38);
  const eight = useCue(eightAt, 0.34);
  const sixteen = useCue(sixteenAt, 0.34);
  const twentyFour = useCue(twentyFourAt, 0.34);
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
        <WarmCard accent={T.amber} style={{ width: 770, height: 405, padding: '26px 30px' }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>DISPLACEMENT • ENDPOINT CHANGE</div>
          <svg width={trackWidth} height={158} style={{ marginTop: 15 }}>
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
            <text x={trackMap(2)} y={35} fill={cardInk(T.cyan)} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900}>START</text>
            <text x={trackMap(-6)} y={35} fill={cardInk(T.red)} textAnchor="middle" fontFamily={T.mono} fontSize={28} fontWeight={900}>FINISH</text>
          </svg>
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
              opacity: minusEight.opacity,
            }}
          >
            −6 − 2 = −8 m
          </div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, textAlign: 'center', marginTop: 11, opacity: minusEight.opacity }}>
            signed • may be negative
          </div>
        </WarmCard>
      </div>

      <div style={{ position: 'absolute', left: 1042, top: 505, opacity: distance.opacity }}>
        <WarmCard accent={T.cyan} style={{ width: 770, height: 405, padding: '26px 30px' }}>
          <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 950, letterSpacing: 2 }}>DISTANCE • EVERY LEG</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 25 }}>
            <div style={{ flex: 1, height: 90, borderRadius: 16, background: `${T.cyan}1f`, padding: '14px 18px', opacity: eight.opacity }}>
              <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}>OUT</div>
              <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 34, fontWeight: 950, marginTop: 3 }}>+8 m</div>
            </div>
            <div style={{ flex: 1, height: 90, borderRadius: 16, background: `${T.red}1f`, padding: '14px 18px', opacity: sixteen.opacity }}>
              <div style={{ color: cardInk(T.red), fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}>BACK</div>
              <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 34, fontWeight: 950, marginTop: 3 }}>+16 m</div>
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
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 28, fontWeight: 850 }}>ODOMETER</div>
            <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 56, fontWeight: 950, marginTop: 4 }}>
              {odometerValue.toFixed(1)} m
            </div>
          </div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 800, textAlign: 'center', marginTop: 10, opacity: twentyFour.opacity }}>
            8 + 16 = 24 m total
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
  const velocityResult = useCue(minusPointEightAt, 0.34);
  const speed = useCue(speedAt, 0.38);
  const speedResult = useCue(twoPointFourAt, 0.34);
  const totalDistance = useCue(totalDistanceAt, 0.34);
  const directionReveal = useCue(directionAt, 0.3);
  const directionPulseIn = useSpringAt(directionAt, 14);
  const directionPulseOut = useProgress(directionAt + 0.35, directionAt + 0.75);
  const directionPulse = directionPulseIn * (1 - directionPulseOut);

  return (
    <SceneShell scene={9} label="average rates">
      <SectionTitle kicker="one clock, two numerators" at={tenAt}>
        Average velocity and average speed
      </SectionTitle>

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line x1={745} y1={520} x2={825} y2={520} stroke={T.cyan} strokeWidth={5} strokeDasharray="10 8" opacity={clock.opacity} />
        <line x1={1095} y1={520} x2={1175} y2={520} stroke={T.cyan} strokeWidth={5} strokeDasharray="10 8" opacity={clock.opacity} />
      </svg>

      <div style={{ position: 'absolute', left: 95, top: 278, opacity: velocity.opacity }}>
        <WarmCard accent={T.amber} style={{ width: 650, height: 590, padding: '30px 30px' }}>
          <div style={{ color: cardInk(T.amber), fontFamily: T.mono, fontSize: 29, fontWeight: 950, letterSpacing: 2 }}>AVERAGE VELOCITY</div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, marginTop: 10 }}>endpoint change ÷ total time</div>
          <MathTeX
            tex={'\\bar v=\\frac{\\Delta s}{\\Delta t}=\\frac{-8\\,\\mathrm m}{10\\,\\mathrm s}'}
            color={T.ink}
            fontSize={43}
            style={{ marginTop: 55 }}
          />
          <svg width={586} height={118} style={{ marginTop: 40, overflow: 'visible' }}>
            <rect x={96} y={10} width={452} height={94} rx={18} fill={`${T.amber}22`} stroke={T.amber} strokeWidth={3} opacity={velocityResult.opacity} />
            <text x={322} y={71} fill={T.ink} textAnchor="middle" fontFamily={T.mono} fontSize={41} fontWeight={950} opacity={velocityResult.opacity}>
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
          opacity: clock.opacity,
          transform: `scale(${0.84 + clock.opacity * 0.16})`,
        }}
      >
        <svg width={300} height={300}>
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
          <text x={150} y={191} fill={T.card} textAnchor="middle" fontFamily={T.mono} fontSize={50} fontWeight={950}>10 s</text>
          <text x={150} y={232} fill={T.textMuted} textAnchor="middle" fontFamily={T.mono} fontSize={28}>SAME TIME</text>
        </svg>
      </div>

      <div style={{ position: 'absolute', left: 1175, top: 278, opacity: speed.opacity }}>
        <WarmCard accent={T.cyan} style={{ width: 650, height: 590, padding: '30px 30px' }}>
          <div style={{ color: cardInk(T.cyan), fontFamily: T.mono, fontSize: 29, fontWeight: 950, letterSpacing: 2 }}>AVERAGE SPEED</div>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, marginTop: 10 }}>total distance ÷ total time</div>
          <MathTeX
            tex={'\\text{average speed}=\\frac{24\\,\\mathrm m}{10\\,\\mathrm s}'}
            color={T.ink}
            fontSize={40}
            style={{ marginTop: 55 }}
          />
          <div
            style={{
              width: 452,
              height: 94,
              boxSizing: 'border-box',
              margin: '43px auto 0',
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
            2.4 m/s
          </div>
          <div
            style={{
              marginTop: 45,
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
  const graphAt = spokenAt(scene, 'displacement time graph');
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
      <SceneShell scene={10} label="recap">
        <SectionTitle kicker="twenty-second recap" at={separateAt}>
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
    <SceneShell scene={10} label="recap">
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
}> = ({ scene, audioEnabled, children }) => (
  <AbsoluteFill>
    {children}
    {audioEnabled && <Audio src={staticFile(`audio/mechanics/${scene.audio}`)} volume={1} />}
  </AbsoluteFill>
);

type PremountedTransitionSequenceProps = React.ComponentProps<typeof TransitionSeries.Sequence> & {
  premountFor?: number;
};

const PremountedTransitionSequence = TransitionSeries.Sequence as React.FC<PremountedTransitionSequenceProps>;

export const MechanicsDisplacementTimeGraphs: React.FC<MechanicsDisplacementTimeGraphsProps> = ({
  audioEnabled = true,
}) => {
  const { fps } = useVideoConfig();
  const transition = (
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
    />
  );

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <TransitionSeries>
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
        <PremountedTransitionSequence name="Recap" durationInFrames={sceneDurationInFrames(S10, fps)} premountFor={PREMOUNT_FRAMES}>
          <NarratedScene scene={S10} audioEnabled={audioEnabled}><Scene10 scene={S10} /></NarratedScene>
        </PremountedTransitionSequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
