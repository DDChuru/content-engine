/**
 * Derived Units for Mechanics
 *
 * A narration-driven, 16:9 measurement-lab explainer. The transcript is the
 * timing source: instructional elements enter on their spoken word cue, never
 * as captions.
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
import transcriptJson from '../public/transcripts/mechanics/derived-units.json';
import { useCue } from './ProjectComposition';

const TRANSITION_FRAMES = 15;

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
  moon: '#cdd6dd',
  sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
};

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
  scenes: MechanicsTranscriptScene[];
  totalDuration: number;
  generatedAt: string;
  engine: string;
}

const TRANSCRIPT = transcriptJson as unknown as MechanicsTranscript;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/** Resolve a stable named cue first, then an observed spoken phrase. */
function spokenAt(
  scene: MechanicsTranscriptScene,
  cueId: string,
  spokenPhrases: string | string[] = cueId,
  occurrence = 1,
): number {
  const namedCue = Object.entries(scene.cues).find(
    ([key]) => normalize(key) === normalize(cueId),
  );
  if (namedCue) return namedCue[1];

  const phrases = Array.isArray(spokenPhrases) ? spokenPhrases : [spokenPhrases];
  const words = scene.words.map(({ word }) => normalize(word));

  for (const phrase of phrases) {
    const phraseWords = phrase
      .toLowerCase()
      .split(/\s+/)
      .map(normalize)
      .filter(Boolean);
    let seen = 0;

    for (let index = 0; index <= words.length - phraseWords.length; index++) {
      const matches = phraseWords.every(
        (word, offset) => words[index + offset] === word,
      );
      if (matches) {
        seen += 1;
        if (seen === occurrence) return scene.words[index].start;
      }
    }
  }

  // An unresolved visual stays hidden instead of entering at an invented time.
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

export function getMechanicsDerivedUnitsDuration(fps: number): number {
  const sequenceFrames = TRANSCRIPT.scenes.reduce(
    (sum, scene) => sum + sceneDurationInFrames(scene, fps),
    0,
  );
  return sequenceFrames - (TRANSCRIPT.scenes.length - 1) * TRANSITION_FRAMES;
}

export interface MechanicsDerivedUnitsProps {
  audioEnabled?: boolean;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function useCueProgress(cueTimeSeconds: number, durationSeconds = 0.7): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(
    frame,
    [cueTimeSeconds * fps, (cueTimeSeconds + durationSeconds) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

function useCueSpring(cueTimeSeconds: number, durationInFrames = 27): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const progress = spring({
    frame: Math.max(0, frame - cueFrame),
    fps,
    durationInFrames,
    config: { damping: 17, stiffness: 160, mass: 0.75 },
  });
  return frame < cueFrame ? 0 : progress;
}

const Cued: React.FC<{
  at: number;
  children: React.ReactNode;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  fadeDuration?: number;
  style?: React.CSSProperties;
}> = ({
  at,
  children,
  fromX = 0,
  fromY = 20,
  fromScale = 0.96,
  fadeDuration = 0.4,
  style,
}) => {
  const cue = useCue(at, fadeDuration);
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
      fontSize: 17,
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

const LabBackground: React.FC<{
  scene: number;
  label: string;
  children: React.ReactNode;
}> = ({ scene, label, children }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 80) * 12;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: T.bg, fontFamily: T.sans }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${28 + drift / 5}% 18%, ${T.cyan}15, transparent 35%), radial-gradient(circle at 78% 90%, ${T.amber}10, transparent 32%), linear-gradient(145deg, ${T.bgDeep}, ${T.bg})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.14,
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
          fontSize: 17,
          letterSpacing: 2.6,
        }}
      >
        MEASUREMENT LAB
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

const SceneHeading: React.FC<{
  at: number;
  children: React.ReactNode;
  accent?: string;
}> = ({ at, children, accent = T.cyan }) => (
  <Cued
    at={at}
    fromY={-18}
    style={{ position: 'absolute', left: 80, right: 80, top: 104, textAlign: 'center' }}
  >
    <div style={{ color: T.text, fontSize: 52, lineHeight: 1.1, fontWeight: 900 }}>
      {children}
      <span style={{ color: accent }}>.</span>
    </div>
  </Cued>
);

const WarmCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}> = ({ children, style, accent = T.cyan }) => (
  <div
    style={{
      borderRadius: 24,
      background: T.card,
      color: T.ink,
      border: `3px solid ${accent}`,
      boxShadow: `0 18px 55px #0007, 0 0 30px ${accent}18`,
      ...style,
    }}
  >
    {children}
  </div>
);

const UnitTile: React.FC<{
  symbol: React.ReactNode;
  label: string;
  color?: string;
  width?: number;
  height?: number;
}> = ({ symbol, label, color = T.cyan, width = 188, height = 132 }) => (
  <WarmCard
    accent={color}
    style={{ width, height, display: 'grid', placeItems: 'center', padding: '10px 16px' }}
  >
    <div style={{ textAlign: 'center' }}>
      <div style={{ color, fontFamily: T.mono, fontSize: 50, lineHeight: 1, fontWeight: 950 }}>
        {symbol}
      </div>
      <div style={{ color: '#687680', fontSize: 18, lineHeight: 1.1, fontWeight: 800, marginTop: 10 }}>
        {label}
      </div>
    </div>
  </WarmCard>
);

const HorizontalArrow: React.FC<{
  width: number;
  color?: string;
  progress?: number;
  label?: string;
}> = ({ width, color = T.cyan, progress = 1, label }) => {
  const drawn = width * clamp01(progress);
  return (
    <div style={{ position: 'relative', width, height: 48 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 21,
          width: drawn,
          height: 6,
          borderRadius: 6,
          background: color,
          boxShadow: `0 0 15px ${color}88`,
        }}
      />
      {progress > 0.96 && (
        <div
          style={{
            position: 'absolute',
            left: width - 2,
            top: 10,
            width: 0,
            height: 0,
            borderTop: '13px solid transparent',
            borderBottom: '13px solid transparent',
            borderLeft: `21px solid ${color}`,
          }}
        />
      )}
      {label && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: -10,
            color,
            fontFamily: T.mono,
            fontSize: 17,
            fontWeight: 900,
            textAlign: 'center',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

const DownArrow: React.FC<{
  length: number;
  color?: string;
  opacity?: number;
  label?: string;
}> = ({ length, color = T.amber, opacity = 1, label }) => (
  <div style={{ position: 'relative', width: 96, height: length + 50, opacity }}>
    {label && (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          color,
          fontFamily: T.mono,
          fontSize: 22,
          fontWeight: 950,
          textAlign: 'center',
        }}
      >
        {label}
      </div>
    )}
    <div
      style={{
        position: 'absolute',
        left: 45,
        top: 33,
        width: 7,
        height: Math.max(0, length - 22),
        borderRadius: 7,
        background: color,
        boxShadow: `0 0 15px ${color}88`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: length,
        width: 0,
        height: 0,
        borderLeft: '18px solid transparent',
        borderRight: '18px solid transparent',
        borderTop: `26px solid ${color}`,
      }}
    />
  </div>
);

const Rail: React.FC<{ left: number; top: number; width: number }> = ({ left, top, width }) => (
  <div style={{ position: 'absolute', left, top, width, height: 22 }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 8, height: 5, borderRadius: 5, background: `${T.cyan}88` }} />
    {Array.from({ length: Math.max(2, Math.floor(width / 90)) }).map((_, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: index * 90,
          top: 1,
          width: 4,
          height: 20,
          background: `${T.cyan}66`,
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────
// S01 — UNITS THAT REVEAL THE EQUATION
// ─────────────────────────────────────────────────────────────────────

const Instrument: React.FC<{
  x: number;
  label: string;
  kind: 'dial' | 'rocket' | 'force';
  opacity: number;
  powered: number;
}> = ({ x, label, kind, opacity, powered }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: 305,
      width: 300,
      height: 235,
      opacity,
      borderRadius: 27,
      border: `2px solid ${powered > 0.05 ? T.cyan : T.textMuted}55`,
      background: `linear-gradient(145deg, ${T.panelLight}, ${T.panel})`,
      boxShadow: `0 20px 45px #0008, inset 0 0 35px ${T.cyan}0d`,
    }}
  >
    <div style={{ position: 'absolute', left: 0, right: 0, top: 18, color: T.textMuted, fontFamily: T.mono, fontSize: 15, letterSpacing: 2, textAlign: 'center' }}>{label}</div>
    {kind === 'dial' && (
      <div style={{ position: 'absolute', left: 74, top: 68, width: 150, height: 112, borderRadius: '150px 150px 22px 22px', border: `7px solid ${powered > 0.05 ? T.cyan : T.textMuted}77` }}>
        <div style={{ position: 'absolute', left: 71, top: 32, width: 7, height: 58, borderRadius: 7, background: powered > 0.05 ? T.amber : T.textMuted, transform: `rotate(${-48 + powered * 76}deg)`, transformOrigin: 'bottom' }} />
      </div>
    )}
    {kind === 'rocket' && (
      <div style={{ position: 'absolute', left: 119, top: 64, width: 62, height: 116, borderRadius: '50% 50% 28% 28%', border: `5px solid ${powered > 0.05 ? T.cyan : T.textMuted}88`, transform: 'rotate(8deg)' }}>
        <div style={{ position: 'absolute', left: 15, top: 25, width: 22, height: 22, borderRadius: '50%', background: powered > 0.05 ? T.cyan : T.bgDeep }} />
        <div style={{ position: 'absolute', left: 17, bottom: -36, width: 20, height: 38, background: powered > 0.05 ? T.amber : T.textMuted, clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
      </div>
    )}
    {kind === 'force' && (
      <div style={{ position: 'absolute', left: 57, top: 89, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: powered > 0.05 ? T.card : `${T.textMuted}33`, border: `4px solid ${powered > 0.05 ? T.amber : T.textMuted}` }} />
        <HorizontalArrow width={88} color={powered > 0.05 ? T.amber : T.textMuted} progress={powered} />
      </div>
    )}
    <div style={{ position: 'absolute', right: 22, bottom: 20, width: 17, height: 17, borderRadius: '50%', background: powered > 0.05 ? T.green : '#53636d', boxShadow: powered > 0.05 ? `0 0 16px ${T.green}` : undefined }} />
  </div>
);

const Scene01: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const unitAt = spokenAt(scene, 'unit');
  const revealAt = spokenAt(scene, 'reveal');
  const assembleAt = spokenAt(scene, 'assemble');
  const mechanicsAt = spokenAt(scene, 'mechanics');
  const instruments = useCue(unitAt, 0.45);
  const etch = useCueProgress(revealAt, 0.9);
  const assembly = useCueProgress(assembleAt, 0.8);
  const mechanics = useCue(mechanicsAt, 0.35);
  const tiles = [
    { symbol: 'kg', label: 'kilogram', color: T.amber, x: 445 },
    { symbol: 'm', label: 'metre', color: T.cyan, x: 685 },
    { symbol: 's', label: 'second', color: T.cyanSoft, x: 925 },
  ];

  return (
    <LabBackground scene={1} label="derived units">
      <Instrument x={260} label="SPEED DIAL" kind="dial" opacity={instruments.opacity * 0.48} powered={0} />
      <Instrument x={810} label="ROCKET GAUGE" kind="rocket" opacity={instruments.opacity * 0.48} powered={0} />
      <Instrument x={1360} label="FORCE SENSOR" kind="force" opacity={instruments.opacity * 0.48} powered={0} />

      <Cued at={revealAt} fromScale={0.9} style={{ position: 'absolute', left: 510, top: 190 }}>
        <WarmCard accent={T.cyan} style={{ width: 900, height: 205, display: 'grid', placeItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#60727c', fontFamily: T.mono, fontSize: 18, letterSpacing: 4 }}>THE EQUATION INSIDE THE ANSWER</div>
            <div style={{ marginTop: 20, color: T.ink, fontSize: 68, fontWeight: 950, letterSpacing: -2 }}>
              Derived <span style={{ color: T.cyan }}>Units</span>
            </div>
            <div style={{ width: 620 * etch, height: 5, borderRadius: 5, margin: '19px auto 0', background: T.cyan, boxShadow: `0 0 14px ${T.cyan}88` }} />
          </div>
        </WarmCard>
      </Cued>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 652, height: 250 }}>
        <div style={{ position: 'absolute', left: 165, right: 165, top: 188, height: 17, borderRadius: 8, background: '#263d49', borderTop: `3px solid ${T.cyan}55` }} />
        {tiles.map((tile, index) => {
          const targetX = 565 + index * 264;
          const x = interpolate(assembly, [0, 1], [tile.x, targetX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const y = interpolate(assembly, [0, 1], [32 + (index % 2) * 24, 45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <Cued key={tile.symbol} at={unitAt} fromY={70} style={{ position: 'absolute', left: x, top: y }}>
              <UnitTile symbol={tile.symbol} label={tile.label} color={tile.color} width={218} height={144} />
            </Cued>
          );
        })}
        <div style={{ position: 'absolute', left: 541, top: 22, width: 838, height: 191, borderRadius: 28, border: `3px solid ${T.cyan}`, opacity: assembly, boxShadow: `0 0 32px ${T.cyan}33`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 222, color: T.cyanSoft, fontFamily: T.mono, fontSize: 18, fontWeight: 850, letterSpacing: 2.2, textAlign: 'center', opacity: mechanics.opacity }}>
          MECHANICS TOOLKIT · READY
        </div>
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S02 — THE BASE-UNIT BUILDER
// ─────────────────────────────────────────────────────────────────────

const Scene02: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const baseAt = spokenAt(scene, 'base-units', ['base units']);
  const combinesAt = spokenAt(scene, 'combines');
  const operationsAt = spokenAt(scene, 'multiplication-or-division', ['multiplication or division']);
  const equationAt = spokenAt(scene, 'equation');
  const base = useCue(baseAt, 0.35);
  const combine = useCueSpring(combinesAt);
  const operations = useCue(operationsAt, 0.35);
  const equation = useCue(equationAt, 0.4);
  const tileSpecs = [
    { symbol: 'm', label: 'metre', color: T.cyan, startX: 105, startY: 250, endX: 940, endY: 270 },
    { symbol: 's', label: 'second', color: T.cyanSoft, startX: 105, startY: 470, endX: 940, endY: 500 },
    { symbol: 'kg', label: 'kilogram', color: T.amber, startX: 105, startY: 690, endX: 650, endY: 385 },
  ];

  return (
    <LabBackground scene={2} label="base-unit builder">
      <SceneHeading at={baseAt}>Base-unit builder</SceneHeading>
      {[310, 530, 750].map((top) => <Rail key={top} left={270} top={top} width={390} />)}

      <div style={{ position: 'absolute', left: 560, top: 215, width: 740, height: 600, borderRadius: 34, border: `3px solid ${T.cyan}66`, background: `${T.panel}d8`, boxShadow: '0 25px 60px #0008' }}>
        <div style={{ position: 'absolute', left: 30, top: 24, color: T.textMuted, fontFamily: T.mono, fontSize: 17, letterSpacing: 2.3 }}>MAGNETIC ASSEMBLY BAY</div>
        <div style={{ position: 'absolute', left: 350, top: 240, width: 270, height: 5, background: T.cyan, borderRadius: 5, opacity: operations.opacity }} />
        <div style={{ position: 'absolute', left: 340, top: 229, color: T.amber, fontFamily: T.mono, fontSize: 44, fontWeight: 950, opacity: operations.opacity }}>×</div>
        <div style={{ position: 'absolute', left: 630, top: 229, color: T.cyan, fontFamily: T.mono, fontSize: 37, fontWeight: 950, opacity: operations.opacity }}>÷</div>
        <div style={{ position: 'absolute', left: 278, top: 18, bottom: 24, width: 2, background: `${T.cyan}2d` }} />
      </div>

      {tileSpecs.map((tile) => {
        const left = interpolate(combine, [0, 1], [tile.startX, tile.endX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const top = interpolate(combine, [0, 1], [tile.startY, tile.endY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <Cued key={tile.symbol} at={baseAt} fromX={-50} style={{ position: 'absolute', left, top, zIndex: 8 }}>
            <UnitTile symbol={tile.symbol} label={tile.label} color={tile.color} width={205} height={138} />
          </Cued>
        );
      })}

      <div style={{ position: 'absolute', right: 78, top: 224, width: 455, height: 608, padding: '30px 28px', borderRadius: 30, border: `2px solid ${T.cyan}44`, background: `${T.bgDeep}b8` }}>
        <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 16, letterSpacing: 2.4 }}>DERIVED SHAPES</div>
        {[
          { unit: 'm / s', name: 'speed', y: 78, color: T.cyan },
          { unit: 'm / s²', name: 'acceleration', y: 228, color: T.amber },
          { unit: 'kg·m / s²', name: 'force', y: 378, color: T.green },
        ].map((shape) => (
          <div key={shape.name} style={{ position: 'absolute', left: 28, right: 28, top: shape.y, height: 116, borderRadius: 20, border: `2px dashed ${shape.color}88`, background: `${shape.color}0d`, opacity: base.opacity * (0.2 + equation.opacity * 0.8), display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px' }}>
            <span style={{ color: shape.color, fontFamily: T.mono, fontSize: 36, fontWeight: 950 }}>{shape.unit}</span>
            <span style={{ color: T.textMuted, fontSize: 19, fontWeight: 800 }}>{shape.name}</span>
          </div>
        ))}
      </div>

      <Cued at={equationAt} fromY={18} style={{ position: 'absolute', left: 530, right: 530, bottom: 76 }}>
        <div style={{ borderRadius: 20, padding: '18px 28px', background: `${T.green}16`, border: `2px solid ${T.green}88`, color: T.text, textAlign: 'center', fontSize: 27, fontWeight: 850 }}>
          equation → unit structure
        </div>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S03 — SPEED AND VELOCITY
// ─────────────────────────────────────────────────────────────────────

const MiniCar: React.FC<{ color?: string }> = ({ color = T.cyan }) => (
  <div style={{ position: 'relative', width: 145, height: 75 }}>
    <div style={{ position: 'absolute', left: 15, top: 24, width: 120, height: 38, borderRadius: '22px 30px 10px 10px', background: color, boxShadow: `0 0 20px ${color}55` }} />
    <div style={{ position: 'absolute', left: 44, top: 6, width: 65, height: 32, borderRadius: '28px 30px 0 0', background: color }} />
    {[38, 112].map((left) => <div key={left} style={{ position: 'absolute', left, top: 52, width: 27, height: 27, borderRadius: '50%', background: T.bgDeep, border: `5px solid ${T.cardMuted}` }} />)}
  </div>
);

const Scene03: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const distanceAt = spokenAt(scene, 'distance-divided-by-time', ['distance divided by time']);
  const unitAt = spokenAt(scene, 'metres-per-second', ['metres per second', 'meters per second']);
  const directionAt = spokenAt(scene, 'direction');
  const scalarAt = spokenAt(scene, 'scalar', ['scalar']);
  const vectorAt = spokenAt(scene, 'vector');
  const distance = useCue(distanceAt, 0.35);
  const travel = useCueProgress(distanceAt, 2.5);
  const fold = useCueProgress(unitAt, 0.65);
  const direction = useCueProgress(directionAt, 0.6);

  return (
    <LabBackground scene={3} label="speed & velocity">
      <SceneHeading at={distanceAt}>Distance divided by time</SceneHeading>

      <div style={{ position: 'absolute', left: 105, top: 252, width: 915, height: 350, borderRadius: 30, border: `2px solid ${T.cyan}55`, background: `${T.panel}cc` }}>
        <div style={{ position: 'absolute', left: 58, right: 58, bottom: 76, height: 7, borderRadius: 7, background: `${T.card}55` }} />
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} style={{ position: 'absolute', left: 74 + index * 94, bottom: 66, width: 3, height: index % 2 === 0 ? 34 : 22, background: T.cyan }} />
        ))}
        <div style={{ position: 'absolute', left: 78 + travel * 575, bottom: 90 }}><MiniCar /></div>
        <div style={{ position: 'absolute', left: 72, bottom: 25, color: T.textMuted, fontFamily: T.mono, fontSize: 17 }}>0 m</div>
        <div style={{ position: 'absolute', right: 62, bottom: 25, color: T.cyan, fontFamily: T.mono, fontSize: 17, fontWeight: 900 }}>distance</div>
      </div>

      <div style={{ position: 'absolute', right: 105, top: 224, width: 690, height: 398, borderRadius: 30, border: `2px solid ${T.cyan}55`, background: `${T.bgDeep}db` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 26, color: T.textMuted, fontFamily: T.mono, fontSize: 17, letterSpacing: 2, textAlign: 'center' }}>UNIT ASSEMBLY</div>
        <Cued at={distanceAt} fromY={-55} style={{ position: 'absolute', left: 128, top: 90 }}>
          <div style={{ opacity: 1 - fold }}>
            <UnitTile symbol="m" label="distance" color={T.cyan} width={182} height={112} />
          </div>
        </Cued>
        <Cued at={distanceAt} fromY={55} style={{ position: 'absolute', left: 128, top: 242 }}>
          <div style={{ opacity: 1 - fold }}>
            <UnitTile symbol="s" label="time" color={T.amber} width={182} height={112} />
          </div>
        </Cued>
        <div style={{ position: 'absolute', left: 102, top: 218, width: 234, height: 5, borderRadius: 5, background: T.card, opacity: distance.opacity * (1 - fold) }} />
        <div style={{ position: 'absolute', left: 355, top: 174, color: T.textMuted, fontSize: 46, opacity: distance.opacity * (1 - fold) }}>→</div>
        <div style={{ position: 'absolute', left: 424, top: 136, opacity: fold, transform: `scale(${0.86 + fold * 0.14})` }}>
          <WarmCard accent={T.green} style={{ width: 205, height: 150, display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: T.green, fontFamily: T.mono, fontSize: 52, fontWeight: 950 }}>m s<sup style={{ fontSize: 25 }}>−1</sup></div>
              <div style={{ color: '#687680', fontSize: 18, fontWeight: 800, marginTop: 8 }}>metres per second</div>
            </div>
          </WarmCard>
        </div>
      </div>

      <Cued at={directionAt} fromY={28} style={{ position: 'absolute', left: 210, top: 685 }}>
        <div style={{ width: 1500, height: 236, borderRadius: 28, background: `${T.panel}e6`, border: `2px solid ${T.cyan}55`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '28px 42px' }}>
          <div style={{ position: 'relative', borderRight: `2px solid ${T.textMuted}35` }}>
            <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 18, letterSpacing: 2 }}>SPEED</div>
            <div style={{ position: 'absolute', left: 45, top: 72 }}><MiniCar color={T.cyanSoft} /></div>
            <div style={{ position: 'absolute', right: 85, top: 74, color: T.text, fontSize: 31, fontWeight: 850 }}>size only</div>
            <Cued at={scalarAt} fromScale={0.84} style={{ position: 'absolute', right: 84, bottom: 4 }}>
              <span style={{ color: T.cyanSoft, fontFamily: T.mono, fontSize: 20, fontWeight: 900 }}>SCALAR</span>
            </Cued>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 18, letterSpacing: 2 }}>VELOCITY</div>
            <div style={{ position: 'absolute', left: 45, top: 72 }}><MiniCar color={T.cyan} /></div>
            <div style={{ position: 'absolute', left: 230, top: 76 }}><HorizontalArrow width={250} color={T.amber} progress={direction} label="direction" /></div>
            <Cued at={vectorAt} fromScale={0.84} style={{ position: 'absolute', right: 55, bottom: 4 }}>
              <span style={{ color: T.amber, fontFamily: T.mono, fontSize: 20, fontWeight: 900 }}>VECTOR</span>
            </Cued>
          </div>
        </div>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S04 — PER SECOND, PER SECOND
// ─────────────────────────────────────────────────────────────────────

const Scene04: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const accelerationAt = spokenAt(scene, 'acceleration', ['Acceleration']);
  const velocityAt = spokenAt(scene, 'velocity-changes', ['velocity changes']);
  const velocityUnitAt = spokenAt(scene, 'metres-per-second', ['metres per second', 'meters per second']);
  const divideAt = spokenAt(scene, 'divide-by-time', ['divide by time']);
  const squaredAt = spokenAt(scene, 'second-squared', ['second squared']);
  const perSecondAt = spokenAt(scene, 'per-second-per-second', ['per second per second', 'per second, per second']);
  const chartProgress = useCueProgress(velocityAt, 3.0);
  const divide = useCueProgress(divideAt, 0.7);
  const squared = useCueProgress(squaredAt, 0.6);
  const perSecond = useCue(perSecondAt, 0.4);
  const velocityCounter = Math.floor(chartProgress * 4 + 0.0001);

  return (
    <LabBackground scene={4} label="acceleration">
      <SceneHeading at={accelerationAt}>Velocity change, measured again</SceneHeading>

      <div style={{ position: 'absolute', left: 74, top: 224, width: 890, height: 650, borderRadius: 30, border: `2px solid ${T.cyan}55`, background: `${T.panel}d7` }}>
        <div style={{ position: 'absolute', left: 35, top: 28, color: T.textMuted, fontFamily: T.mono, fontSize: 17, letterSpacing: 2 }}>VELOCITY READOUT · ONE-SECOND TICKS</div>
        <div style={{ position: 'absolute', right: 35, top: 22, width: 164, height: 60, borderRadius: 14, border: `2px solid ${T.cyan}77`, background: T.bgDeep, display: 'grid', placeItems: 'center', color: T.cyan, fontFamily: T.mono, fontSize: 27, fontWeight: 950 }}>
          {velocityCounter} m/s
        </div>
        <div style={{ position: 'absolute', left: 92, bottom: 104, width: 700, height: 4, background: `${T.card}55` }} />
        <div style={{ position: 'absolute', left: 92, top: 120, bottom: 102, width: 4, background: `${T.card}55` }} />
        {[0, 1, 2, 3, 4].map((index) => {
          const reveal = clamp01(chartProgress * 5 - index);
          const left = 110 + index * 142;
          const bottom = 118 + index * 78;
          return (
            <React.Fragment key={index}>
              <div style={{ position: 'absolute', left, bottom: 72, color: T.textMuted, fontFamily: T.mono, fontSize: 16, opacity: reveal }}>t={index}s</div>
              <div style={{ position: 'absolute', left, bottom, opacity: reveal, transform: `scale(${0.84 + reveal * 0.16})`, transformOrigin: 'bottom left' }}>
                <HorizontalArrow width={58 + index * 34} color={index === 0 ? T.cyanSoft : T.cyan} progress={reveal} />
                <div style={{ marginTop: 4, color: T.text, fontFamily: T.mono, fontSize: 18, fontWeight: 850 }}>{index} m/s</div>
              </div>
              {index > 0 && (
                <div style={{ position: 'absolute', left: left + 18, bottom: bottom - 55, height: 47, width: 3, background: T.amber, opacity: reveal }} />
              )}
            </React.Fragment>
          );
        })}
        <Cued at={velocityAt} fromY={16} style={{ position: 'absolute', left: 205, right: 205, bottom: 12 }}>
          <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 19, fontWeight: 900, textAlign: 'center' }}>+1 m/s during each 1 s</div>
        </Cued>
      </div>

      <div style={{ position: 'absolute', right: 74, top: 224, width: 808, height: 650, borderRadius: 30, border: `2px solid ${T.amber}55`, background: `${T.bgDeep}df` }}>
        <div style={{ position: 'absolute', left: 36, top: 28, color: T.textMuted, fontFamily: T.mono, fontSize: 17, letterSpacing: 2 }}>UNIT BUILDER</div>
        <Cued at={velocityUnitAt} fromX={-42} style={{ position: 'absolute', left: 82, top: 126 }}>
          <WarmCard accent={T.cyan} style={{ width: 255, height: 180, display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 57, fontWeight: 950 }}>m / s</div>
              <div style={{ color: '#687680', fontSize: 19, fontWeight: 800 }}>velocity already has time</div>
            </div>
          </WarmCard>
        </Cued>
        <div style={{ position: 'absolute', left: 360, top: 190, opacity: divide, color: T.textMuted, fontSize: 50 }}>÷</div>
        <div style={{ position: 'absolute', left: 432, top: 148, opacity: divide, transform: `translateX(${(1 - divide) * 44}px)` }}>
          <UnitTile symbol="s" label="time again" color={T.amber} width={205} height={145} />
        </div>
        <div style={{ position: 'absolute', left: 700, top: 190, opacity: divide, color: T.textMuted, fontSize: 50 }}>→</div>

        <div style={{ position: 'absolute', left: 185, top: 376, opacity: squared, transform: `scale(${0.84 + squared * 0.16})` }}>
          <WarmCard accent={T.green} style={{ width: 438, height: 174, display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: T.green, fontFamily: T.mono, fontSize: 63, fontWeight: 950 }}>m / s²</div>
              <div style={{ color: '#687680', fontSize: 20, fontWeight: 850, marginTop: 7 }}>metres per second squared</div>
            </div>
          </WarmCard>
        </div>

        <div style={{ position: 'absolute', left: 82, top: 318, width: 255, height: 53, borderLeft: `4px solid ${T.amber}`, borderBottom: `4px solid ${T.amber}`, opacity: perSecond.opacity }}>
          <span style={{ position: 'absolute', left: 12, top: 20, color: T.amber, fontFamily: T.mono, fontSize: 16, fontWeight: 900 }}>per second in velocity</span>
        </div>
        <div style={{ position: 'absolute', left: 433, top: 318, width: 205, height: 53, borderRight: `4px solid ${T.amber}`, borderBottom: `4px solid ${T.amber}`, opacity: perSecond.opacity }}>
          <span style={{ position: 'absolute', right: 12, top: 20, color: T.amber, fontFamily: T.mono, fontSize: 16, fontWeight: 900 }}>per second of change</span>
        </div>
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S05 — CONVERT THE FRACTION, PIECE BY PIECE
// ─────────────────────────────────────────────────────────────────────

const ConverterLane: React.FC<{
  at: number;
  top: number;
  color: string;
  label: string;
  input: React.ReactNode;
  factor: React.ReactNode;
  output: React.ReactNode;
}> = ({ at, top, color, label, input, factor, output }) => (
  <Cued at={at} fromX={-38} style={{ position: 'absolute', left: 525, top }}>
    <div style={{ width: 1160, height: 175, borderRadius: 25, border: `2px solid ${color}77`, background: `${color}0e`, display: 'grid', gridTemplateColumns: '210px 1fr 260px', alignItems: 'center', padding: '22px 28px', columnGap: 28 }}>
      <div>
        <div style={{ color, fontFamily: T.mono, fontSize: 15, letterSpacing: 2, fontWeight: 900 }}>{label}</div>
        <div style={{ color: T.text, fontFamily: T.mono, fontSize: 39, fontWeight: 950, marginTop: 15 }}>{input}</div>
      </div>
      <div style={{ position: 'relative', height: 88, borderRadius: 18, background: `${T.bgDeep}dd`, border: `2px solid ${color}55`, display: 'grid', placeItems: 'center' }}>
        <HorizontalArrow width={360} color={color} />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color, fontFamily: T.mono, fontSize: 24, fontWeight: 950 }}>{factor}</div>
      </div>
      <WarmCard accent={color} style={{ height: 112, display: 'grid', placeItems: 'center' }}>
        <div style={{ color, fontFamily: T.mono, fontSize: 37, fontWeight: 950 }}>{output}</div>
      </WarmCard>
    </div>
  </Cued>
);

const Scene05: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const compoundAt = spokenAt(scene, 'compound-unit', ['compound unit']);
  const topAt = spokenAt(scene, 'top');
  const bottomAt = spokenAt(scene, 'bottom');
  const kilometresAt = spokenAt(scene, 'kilometres-to-metres', ['kilometres to metres', 'kilometers to meters']);
  const hoursAt = spokenAt(scene, 'hours-to-seconds', ['hours to seconds']);
  const squaredAt = spokenAt(scene, 'squared');
  const topReveal = useCueProgress(topAt, 0.55);
  const bottomReveal = useCueProgress(bottomAt, 0.55);
  const squared = useCueProgress(squaredAt, 0.55);

  return (
    <LabBackground scene={5} label="piece-by-piece conversion">
      <SceneHeading at={compoundAt}>Separate the compound unit</SceneHeading>

      <div style={{ position: 'absolute', left: 88, top: 300, width: 372, height: 500 }}>
        <Cued at={compoundAt} fromScale={0.88} style={{ position: 'absolute', inset: 0 }}>
          <WarmCard accent={T.cyan} style={{ width: 372, height: 500, display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#687680', fontFamily: T.mono, fontSize: 17, letterSpacing: 2 }}>COMPOUND UNIT</div>
              <div style={{ marginTop: 58, width: 235 }}>
                <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 70, fontWeight: 950, opacity: topReveal }}>km</div>
                <div style={{ height: 6, borderRadius: 6, background: T.ink, margin: '18px 0', transform: `scaleX(${0.45 + topReveal * 0.55})`, opacity: topReveal }} />
                <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 70, fontWeight: 950, opacity: bottomReveal }}>h<span style={{ opacity: squared }}>²</span></div>
              </div>
              <div style={{ marginTop: 55, color: '#687680', fontSize: 19, fontWeight: 800 }}>open the fraction</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 9, marginTop: 24, fontFamily: T.mono, fontSize: 14, fontWeight: 900 }}>
                <span style={{ padding: '7px 11px', borderRadius: 10, background: squared < 0.05 ? `${T.cyan}22` : '#7b879022', color: squared < 0.05 ? T.cyan : '#7b8790' }}>SPEED</span>
                <span style={{ padding: '7px 11px', borderRadius: 10, background: `${T.amber}${squared > 0.05 ? '33' : '12'}`, color: squared > 0.05 ? T.amber : '#9d8b72' }}>ACCELERATION</span>
              </div>
            </div>
          </WarmCard>
        </Cued>
      </div>

      <ConverterLane at={kilometresAt} top={255} color={T.cyan} label="NUMERATOR · DISTANCE" input="km" factor="× 1000" output="m" />
      <ConverterLane at={hoursAt} top={505} color={T.amber} label="DENOMINATOR · TIME" input={<span>h<span style={{ opacity: squared }}>²</span></span>} factor={<span>× 3600<span style={{ opacity: squared }}> · × 3600</span></span>} output={<span>s<span style={{ opacity: squared }}>²</span></span>} />

      <Cued at={topAt} fromY={12} style={{ position: 'absolute', left: 110, top: 245 }}>
        <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 17, fontWeight: 900, letterSpacing: 2 }}>TOP / NUMERATOR</div>
      </Cued>
      <Cued at={bottomAt} fromY={12} style={{ position: 'absolute', left: 103, top: 822 }}>
        <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 17, fontWeight: 900, letterSpacing: 2 }}>BOTTOM / DENOMINATOR</div>
      </Cued>

      <Cued at={squaredAt} fromY={18} style={{ position: 'absolute', left: 665, right: 205, bottom: 82 }}>
        <div style={{ borderRadius: 20, padding: '17px 26px', background: `${T.red}13`, border: `2px solid ${T.red}88`, color: T.text, fontSize: 24, fontWeight: 850, textAlign: 'center' }}>
          h² means the clock conversion runs twice
        </div>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S06 — WORKED CONVERSION: 72 km/h TO 20 m/s
// ─────────────────────────────────────────────────────────────────────

const EquationToken: React.FC<{
  at: number;
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ at, children, color = T.ink, style }) => (
  <Cued at={at} fromY={16} fromScale={0.88} style={{ color, fontFamily: T.mono, fontSize: 38, fontWeight: 950, ...style }}>
    {children}
  </Cued>
);

const Speedometer: React.FC<{ firstAt: number; finalAt: number }> = ({ firstAt, finalAt }) => {
  const first = useCue(firstAt, 0.35);
  const sweep = useCueProgress(finalAt, 0.8);
  const angle = interpolate(sweep, [0, 1], [-58, 58], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'relative', width: 500, height: 370, opacity: first.opacity }}>
      <div style={{ position: 'absolute', left: 55, top: 28, width: 390, height: 255, borderRadius: '390px 390px 50px 50px', border: `17px solid ${T.cyan}`, borderBottom: `9px solid ${T.cyan}88`, background: `${T.bgDeep}f0`, boxShadow: `0 0 38px ${T.cyan}28` }}>
        {[-70, -42, -14, 14, 42, 70].map((tick) => (
          <div key={tick} style={{ position: 'absolute', left: 181, top: 24, width: 5, height: 27, background: T.card, transformOrigin: 'center 177px', transform: `rotate(${tick}deg)` }} />
        ))}
        <div style={{ position: 'absolute', left: 182, top: 74, width: 9, height: 127, borderRadius: 9, background: T.amber, transformOrigin: 'bottom', transform: `rotate(${angle}deg)`, boxShadow: `0 0 17px ${T.amber}` }} />
        <div style={{ position: 'absolute', left: 160, top: 178, width: 53, height: 53, borderRadius: '50%', background: T.card, border: `9px solid ${T.amber}` }} />
        <div style={{ position: 'absolute', left: 28, top: 170, color: T.cyanSoft, fontFamily: T.mono, fontSize: 17, fontWeight: 900 }}>72 km/h</div>
        <div style={{ position: 'absolute', right: 23, top: 170, color: T.green, fontFamily: T.mono, fontSize: 17, fontWeight: 900, opacity: sweep }}>20 m/s</div>
      </div>
      <div style={{ position: 'absolute', left: 114, bottom: 0, width: 272, height: 80, borderRadius: 18, background: T.card, border: `3px solid ${sweep > 0 ? T.green : T.cyan}`, display: 'grid', placeItems: 'center', color: sweep > 0 ? T.green : T.ink, fontFamily: T.mono, fontSize: 35, fontWeight: 950 }}>
        <span style={{ position: 'absolute', opacity: 1 - sweep }}>72 km/h</span>
        <span style={{ position: 'absolute', opacity: sweep }}>20 m/s</span>
      </div>
    </div>
  );
};

const Scene06: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const seventyTwoAt = spokenAt(scene, 'seventy-two', ['seventy-two', '72']);
  const numeratorAt = spokenAt(scene, 'numerator');
  const seventyTwoTimesAt = spokenAt(scene, 'seventy-two-times', ['seventy-two', '72'], 2);
  const timesAt = spokenAt(scene, 'times', ['times']);
  const thousandAt = spokenAt(scene, 'one-thousand', ['one thousand', '1000']);
  const givesNumeratorAt = spokenAt(scene, 'gives-numerator', ['gives']);
  const numeratorResultAt = spokenAt(scene, 'seventy-two-thousand-numerator', ['seventy-two thousand', '72 ,000']);
  const denominatorAt = spokenAt(scene, 'denominator');
  const oneHourAt = spokenAt(scene, 'one-hour', ['one hour', '1 hour']);
  const thirtySixHundredAt = spokenAt(scene, 'three-thousand-six-hundred', ['three thousand six hundred', '3600']);
  const divisionNumberAt = spokenAt(scene, 'seventy-two-thousand-division', ['seventy-two thousand', '72 ,000'], 2);
  const dividedByAt = spokenAt(scene, 'divided-by', ['divided by']);
  const divisorAt = spokenAt(scene, 'three-thousand-six-hundred-division', ['three thousand six hundred', '3600'], 2);
  const givesResultAt = spokenAt(scene, 'gives-result', ['gives'], 2);
  const finalAt = spokenAt(scene, 'twenty-metres-per-second', ['twenty metres per second', '20 m per second']);

  return (
    <LabBackground scene={6} label="worked conversion">
      <SceneHeading at={seventyTwoAt}>Convert 72 km/h</SceneHeading>

      <div style={{ position: 'absolute', left: 66, top: 238, width: 520, height: 660, borderRadius: 30, border: `2px solid ${T.cyan}55`, background: `${T.panel}dd`, display: 'grid', placeItems: 'center' }}>
        <Speedometer firstAt={seventyTwoAt} finalAt={finalAt} />
        <div style={{ position: 'absolute', left: 52, right: 52, bottom: 65, height: 6, borderRadius: 6, background: `${T.card}55` }} />
        <div style={{ position: 'absolute', left: 185, bottom: 67 }}><MiniCar /></div>
      </div>

      <div style={{ position: 'absolute', left: 628, top: 214, width: 1224, height: 704, borderRadius: 32, border: `2px solid ${T.cyan}55`, background: T.card, color: T.ink, boxShadow: '0 24px 62px #0008' }}>
        <Cued at={numeratorAt} fromX={-28} style={{ position: 'absolute', left: 40, right: 40, top: 38, height: 245, borderRadius: 23, background: `${T.cyan}14`, border: `2px solid ${T.cyan}88` }}>
          <div style={{ position: 'absolute', left: 28, top: 20, color: '#61757e', fontFamily: T.mono, fontSize: 16, letterSpacing: 2, fontWeight: 900 }}>NUMERATOR · DISTANCE</div>
          <EquationToken at={seventyTwoTimesAt} style={{ position: 'absolute', left: 58, top: 111 }}>72</EquationToken>
          <EquationToken at={timesAt} color={T.cyan} style={{ position: 'absolute', left: 165, top: 111 }}>×</EquationToken>
          <EquationToken at={thousandAt} style={{ position: 'absolute', left: 235, top: 111 }}>1000</EquationToken>
          <EquationToken at={givesNumeratorAt} color="#71818a" style={{ position: 'absolute', left: 405, top: 111 }}>=</EquationToken>
          <EquationToken at={numeratorResultAt} color={T.cyan} style={{ position: 'absolute', left: 485, top: 104, fontSize: 43 }}>72 000 <span style={{ fontSize: 26 }}>m/h</span></EquationToken>
        </Cued>

        <Cued at={denominatorAt} fromX={28} style={{ position: 'absolute', left: 40, right: 40, top: 310, height: 345, borderRadius: 23, background: `${T.amber}12`, border: `2px solid ${T.amber}88` }}>
          <div style={{ position: 'absolute', left: 28, top: 20, color: '#61757e', fontFamily: T.mono, fontSize: 16, letterSpacing: 2, fontWeight: 900 }}>DENOMINATOR · CLOCK</div>
          <EquationToken at={oneHourAt} style={{ position: 'absolute', left: 58, top: 82, fontSize: 31 }}>1 hour</EquationToken>
          <EquationToken at={thirtySixHundredAt} color="#71818a" style={{ position: 'absolute', left: 206, top: 82, fontSize: 31 }}>=</EquationToken>
          <EquationToken at={thirtySixHundredAt} color={T.amber} style={{ position: 'absolute', left: 265, top: 82, fontSize: 31 }}>3600 seconds</EquationToken>
          <div style={{ position: 'absolute', left: 38, right: 38, top: 163, height: 2, background: `${T.ink}1f` }} />
          <EquationToken at={divisionNumberAt} style={{ position: 'absolute', left: 58, top: 220 }}>72 000</EquationToken>
          <EquationToken at={dividedByAt} color={T.amber} style={{ position: 'absolute', left: 250, top: 220 }}>÷</EquationToken>
          <EquationToken at={divisorAt} style={{ position: 'absolute', left: 323, top: 220 }}>3600</EquationToken>
          <EquationToken at={givesResultAt} color="#71818a" style={{ position: 'absolute', left: 484, top: 220 }}>=</EquationToken>
          <EquationToken at={finalAt} color={T.green} style={{ position: 'absolute', left: 557, top: 208, fontSize: 46 }}>20 <span style={{ fontSize: 27 }}>m/s</span></EquationToken>
        </Cued>
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S07 — BUILD ONE NEWTON
// ─────────────────────────────────────────────────────────────────────

const Scene07: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const forceAt = spokenAt(scene, 'force', ['force']);
  const massAccelerationAt = spokenAt(scene, 'mass-multiplied-by-acceleration', ['mass multiplied by acceleration']);
  const kilogramsAt = spokenAt(scene, 'kilograms');
  const accelerationUnitAt = spokenAt(scene, 'metres-per-second-squared', ['metres per second squared', 'meters per second squared']);
  const newtonAt = spokenAt(scene, 'newton');
  const acceleratesAt = spokenAt(scene, 'accelerates', ['accelerates']);
  const oneKilogramAt = spokenAt(scene, 'one-kilogram', ['one kilogram']);
  const unitLock = useCueProgress(accelerationUnitAt, 0.9);
  const newton = useCueProgress(newtonAt, 0.55);
  const motion = useCueProgress(acceleratesAt, 3);
  const oneKilogram = useCueProgress(oneKilogramAt, 0.4);
  // Constant acceleration: distance grows with elapsed time squared.
  const blockX = 235 + motion * motion * 785;

  return (
    <LabBackground scene={7} label="build one newton">
      <SceneHeading at={forceAt}>Force builds a newton</SceneHeading>

      <Cued at={massAccelerationAt} fromY={-18} style={{ position: 'absolute', left: 130, top: 210 }}>
        <WarmCard accent={T.amber} style={{ width: 720, height: 165, display: 'grid', placeItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 30, fontFamily: T.mono, fontSize: 52, fontWeight: 950 }}>
            <span style={{ color: T.amber }}>F</span>
            <span style={{ color: '#75838b' }}>=</span>
            <span style={{ color: T.ink }}>m</span>
            <span style={{ color: T.amber }}>×</span>
            <span style={{ color: T.cyan }}>a</span>
          </div>
        </WarmCard>
      </Cued>

      <div style={{ position: 'absolute', right: 88, top: 205, width: 840, height: 390, borderRadius: 30, border: `2px solid ${T.cyan}55`, background: `${T.panel}dc` }}>
        <div style={{ position: 'absolute', left: 30, top: 24, color: T.textMuted, fontFamily: T.mono, fontSize: 16, letterSpacing: 2 }}>UNIT LOCK</div>
        <div style={{ position: 'absolute', left: 42 + unitLock * 23, top: 95 }}>
          <Cued at={kilogramsAt} fromX={-75}><UnitTile symbol="kg" label="mass" color={T.amber} width={190} height={130} /></Cued>
        </div>
        <div style={{ position: 'absolute', left: 310, top: 133, color: T.amber, fontSize: 42, fontWeight: 950, opacity: unitLock }}>×</div>
        <div style={{ position: 'absolute', left: 390 - unitLock * 45, top: 95 }}>
          <Cued at={accelerationUnitAt} fromX={75}><UnitTile symbol="m/s²" label="acceleration" color={T.cyan} width={225} height={130} /></Cued>
        </div>
        <div style={{ position: 'absolute', left: 610, top: 133, color: T.textMuted, fontSize: 42, opacity: unitLock }}>→</div>
        <div style={{ position: 'absolute', right: 10, top: 89, width: 172, height: 145, borderRadius: 22, background: T.card, border: `5px solid ${T.green}`, opacity: newton, transform: `rotate(${-5 + newton * 5}deg) scale(${0.78 + newton * 0.22})`, display: 'grid', placeItems: 'center', boxShadow: `0 0 32px ${T.green}44` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: T.green, fontFamily: T.mono, fontSize: 53, fontWeight: 950 }}>1 N</div>
            <div style={{ color: '#687680', fontSize: 17, fontWeight: 850 }}>newton</div>
          </div>
        </div>
        <Cued at={newtonAt} fromY={15} style={{ position: 'absolute', left: 70, right: 70, bottom: 33 }}>
          <div style={{ color: T.green, fontFamily: T.mono, fontSize: 24, fontWeight: 900, textAlign: 'center' }}>kg·m/s² = N</div>
        </Cued>
      </div>

      <div style={{ position: 'absolute', left: 78, top: 604, width: 1240, height: 316, borderRadius: 28, border: `2px solid ${T.cyan}55`, background: `${T.bgDeep}d8`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 44, right: 44, bottom: 66, height: 13, borderRadius: 7, background: '#435865', borderTop: `3px solid ${T.cyan}88` }} />
        {[322, 584, 1020].map((left, index) => {
          const gateProgress = clamp01(motion * 3 - index);
          return (
            <div key={left} style={{ position: 'absolute', left, top: 41, width: 95, height: 207, borderLeft: `3px solid ${T.cyan}88`, borderRight: `3px solid ${T.cyan}88`, opacity: 0.25 + gateProgress * 0.75 }}>
              <div style={{ position: 'absolute', left: -3, right: -3, top: 0, height: 8, borderRadius: 8, background: T.cyan, boxShadow: gateProgress > 0.7 ? `0 0 20px ${T.cyan}` : undefined }} />
              <div style={{ position: 'absolute', left: -35, right: -35, top: 26, color: T.cyanSoft, fontFamily: T.mono, fontSize: 17, fontWeight: 900, textAlign: 'center' }}>{index + 1} s</div>
              <div style={{ position: 'absolute', left: -42, right: -42, top: 62, color: T.text, fontFamily: T.mono, fontSize: 19, fontWeight: 900, textAlign: 'center', opacity: gateProgress }}>{index + 1} m/s</div>
            </div>
          );
        })}

        <Cued at={forceAt} fromX={-30} style={{ position: 'absolute', left: blockX - 175, top: 148 }}>
          <HorizontalArrow width={150} color={T.amber} progress={1} label={newton > 0.05 ? '1 N' : 'F'} />
        </Cued>
        <div style={{ position: 'absolute', left: blockX, top: 113, width: 188, height: 132, borderRadius: 20, background: T.card, border: `4px solid ${newton > 0.05 ? T.green : T.amber}`, boxShadow: '0 15px 35px #0008', display: 'grid', placeItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Cued at={kilogramsAt} fromScale={0.9} fromY={0}>
              <div style={{ position: 'relative', height: 47, color: T.ink, fontFamily: T.mono, fontSize: 39, fontWeight: 950 }}>
                <span style={{ position: 'absolute', left: 0, right: 0, opacity: 1 - oneKilogram }}>kg</span>
                <span style={{ position: 'absolute', left: 0, right: 0, opacity: oneKilogram }}>1 kg</span>
              </div>
            </Cued>
            <div style={{ color: '#687680', fontSize: 16, fontWeight: 850, marginTop: 5 }}>LAB BLOCK</div>
          </div>
        </div>
      </div>

      <Cued at={oneKilogramAt} fromX={25} style={{ position: 'absolute', right: 102, bottom: 116 }}>
        <div style={{ width: 430, borderRadius: 20, padding: '18px 22px', border: `2px solid ${T.green}88`, background: `${T.green}13`, color: T.text, fontFamily: T.mono, fontSize: 21, fontWeight: 900, textAlign: 'center' }}>1 kg gains 1 m/s every second</div>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S08 — WEIGHT CHANGES WITH LOCATION
// ─────────────────────────────────────────────────────────────────────

const PlanetPlatform: React.FC<{
  left: number;
  label: string;
  color: string;
  active: number;
  minimumOpacity?: number;
  craters?: boolean;
}> = ({ left, label, color, active, minimumOpacity = 0.5, craters = false }) => (
  <div style={{ position: 'absolute', left, top: 700, width: 630, height: 183, borderRadius: '50% 50% 18px 18px', background: `linear-gradient(${color}, ${color}88)`, border: `4px solid ${color}`, opacity: minimumOpacity + active * (1 - minimumOpacity), boxShadow: active > 0.2 ? `0 0 38px ${color}44` : undefined, overflow: 'hidden' }}>
    {craters && [
      { left: 95, top: 76, size: 42 },
      { left: 285, top: 41, size: 58 },
      { left: 475, top: 91, size: 36 },
    ].map((crater) => <div key={crater.left} style={{ position: 'absolute', left: crater.left, top: crater.top, width: crater.size, height: crater.size / 2, borderRadius: '50%', background: '#87939b66' }} />)}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 27, color: T.bgDeep, fontFamily: T.mono, fontSize: 25, fontWeight: 950, letterSpacing: 2, textAlign: 'center' }}>{label}</div>
  </div>
);

const Scene08: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const weightAt = spokenAt(scene, 'weight', ['Weight']);
  const newtonsAt = spokenAt(scene, 'newtons', ['newtons', "Newton's"]);
  const localAccelerationAt = spokenAt(scene, 'local-acceleration', ['local acceleration']);
  const moonAt = spokenAt(scene, 'moon', ['Moon']);
  const massSameAt = spokenAt(scene, 'mass-stays-the-same', ['mass stays the same']);
  const smallerAt = spokenAt(scene, 'weight-becomes-smaller', ['weight becomes smaller']);
  const move = useCueProgress(moonAt, 1.0);
  const shrink = useCueProgress(smallerAt, 0.7);
  const massLock = useCue(massSameAt, 0.4);
  const objectX = 390 + move * 800;
  const arrowLength = 185 - shrink * 105;

  return (
    <LabBackground scene={8} label="mass vs weight">
      <SceneHeading at={weightAt}>Weight depends on location</SceneHeading>

      <Cued at={localAccelerationAt} fromY={-22} style={{ position: 'absolute', left: 570, top: 198 }}>
        <WarmCard accent={T.amber} style={{ width: 780, height: 166, display: 'grid', placeItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontFamily: T.mono, fontSize: 48, fontWeight: 950 }}>
            <span style={{ color: T.amber }}>W</span>
            <span style={{ color: '#74838c' }}>=</span>
            <span style={{ color: T.ink }}>m</span>
            <span style={{ color: '#74838c' }}>×</span>
            <span style={{ color: T.cyan }}>g<sub style={{ fontSize: 20 }}>local</sub></span>
          </div>
        </WarmCard>
      </Cued>

      <Cued at={newtonsAt} fromX={-20} style={{ position: 'absolute', left: 122, top: 235 }}>
        <div style={{ width: 350, height: 108, borderRadius: 22, border: `2px solid ${T.amber}88`, background: `${T.amber}12`, display: 'grid', placeItems: 'center', color: T.text, fontSize: 26, fontWeight: 850 }}>
          weight → <span style={{ color: T.amber, fontFamily: T.mono, fontWeight: 950 }}>newtons (N)</span>
        </div>
      </Cued>

      <PlanetPlatform left={115} label="EARTH" color="#4c9d72" active={1 - move} />
      <PlanetPlatform left={1175} label="MOON" color={T.moon} active={move} minimumOpacity={0} craters />

      <div style={{ position: 'absolute', left: objectX, top: 486, width: 214, height: 202, borderRadius: 24, background: T.card, border: `4px solid ${massLock.isActive ? T.green : T.cyan}`, boxShadow: '0 18px 45px #0009', display: 'grid', placeItems: 'center', zIndex: 5 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 50, fontWeight: 950 }}>1 kg</div>
          <div style={{ color: massLock.isActive ? T.green : '#687680', fontSize: 18, fontWeight: 900, marginTop: 8 }}>MASS {massLock.isActive ? 'LOCKED' : ''}</div>
        </div>
      </div>
      <Cued at={weightAt} fromY={-20} style={{ position: 'absolute', left: objectX + 225, top: 499, zIndex: 6 }}>
        <DownArrow length={arrowLength} label="W" />
      </Cued>

      <Cued at={moonAt} fromY={14} style={{ position: 'absolute', left: 1235, top: 405 }}>
        <div style={{ width: 500, borderRadius: 20, padding: '16px 24px', background: `${T.moon}14`, border: `2px solid ${T.moon}88`, color: T.text, fontFamily: T.mono, fontSize: 20, fontWeight: 900, textAlign: 'center' }}>same object · new gravity</div>
      </Cued>

      <Cued at={smallerAt} fromY={18} style={{ position: 'absolute', left: 620, right: 620, bottom: 88 }}>
        <div style={{ borderRadius: 20, padding: '17px 26px', background: `${T.green}15`, border: `2px solid ${T.green}88`, color: T.text, fontSize: 25, fontWeight: 850, textAlign: 'center' }}>mass unchanged · weight smaller</div>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S09 — POWERS ARE PART OF THE UNIT
// ─────────────────────────────────────────────────────────────────────

const WarningLamp: React.FC<{ active: number }> = ({ active }) => {
  const frame = useCurrentFrame();
  const pulse = 0.75 + Math.sin(frame / 3) * 0.25;
  return (
    <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.red, opacity: active * pulse, boxShadow: `0 0 ${16 + active * 22}px ${T.red}` }} />
  );
};

const Scene09: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const powersAt = spokenAt(scene, 'powers', ['Powers']);
  const hoursSquaredAt = spokenAt(scene, 'hours-squared', ['Hours squared', 'Our squared']);
  const factorTwiceAt = spokenAt(scene, 'factor-twice', ['factor twice']);
  const squareCentimetresAt = spokenAt(scene, 'square-centimetres', ['Square centimetres', 'Square centimeters']);
  const thousandsAt = spokenAt(scene, 'thousands');
  const doubleFactor = useCueProgress(factorTwiceAt, 0.65);
  const square = useCueProgress(squareCentimetresAt, 0.85);
  const warning = useCueProgress(thousandsAt, 0.25);
  const hoursSquared = useCue(hoursSquaredAt, 0.35);

  return (
    <LabBackground scene={9} label="powers warning">
      <SceneHeading at={powersAt} accent={T.red}>The power belongs to the conversion</SceneHeading>

      <div style={{ position: 'absolute', left: 70, top: 220, width: 855, height: 650, borderRadius: 31, border: `2px solid ${T.amber}66`, background: `${T.panel}dc`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 32, top: 25, color: T.textMuted, fontFamily: T.mono, fontSize: 16, letterSpacing: 2, opacity: hoursSquared.opacity }}>CHECK 01 · HOURS SQUARED</div>
        <Cued at={hoursSquaredAt} fromX={-35} style={{ position: 'absolute', left: 74, top: 130 }}>
          <UnitTile symbol="h²" label="time squared" color={T.amber} width={210} height={150} />
        </Cued>
        <div style={{ position: 'absolute', left: 315, top: 175, opacity: doubleFactor }}><HorizontalArrow width={170} color={T.amber} /></div>
        <div style={{ position: 'absolute', left: 500, top: 108, width: 260, height: 103, borderRadius: 18, background: `${T.amber}18`, border: `2px solid ${T.amber}88`, opacity: doubleFactor, transform: `translateY(${(1 - doubleFactor) * -35}px)`, display: 'grid', placeItems: 'center', color: T.amber, fontFamily: T.mono, fontSize: 27, fontWeight: 950 }}>× 3600</div>
        <div style={{ position: 'absolute', left: 500, top: 238, width: 260, height: 103, borderRadius: 18, background: `${T.amber}18`, border: `2px solid ${T.amber}88`, opacity: doubleFactor, transform: `translateY(${(1 - doubleFactor) * 35}px)`, display: 'grid', placeItems: 'center', color: T.amber, fontFamily: T.mono, fontSize: 27, fontWeight: 950 }}>× 3600</div>
        <div style={{ position: 'absolute', left: 175, right: 175, top: 390, height: 3, background: `${T.card}36` }} />
        <Cued at={factorTwiceAt} fromY={20} style={{ position: 'absolute', left: 175, top: 435 }}>
          <WarmCard accent={T.green} style={{ width: 505, height: 130, display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: T.green, fontFamily: T.mono, fontSize: 36, fontWeight: 950 }}>(3600)²</div>
              <div style={{ color: '#687680', fontSize: 18, fontWeight: 850, marginTop: 5 }}>the factor runs twice</div>
            </div>
          </WarmCard>
        </Cued>
      </div>

      <div style={{ position: 'absolute', right: 70, top: 220, width: 855, height: 650, borderRadius: 31, border: `2px solid ${T.cyan}66`, background: `${T.bgDeep}df`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 32, top: 25, color: T.textMuted, fontFamily: T.mono, fontSize: 16, letterSpacing: 2, opacity: square }}>CHECK 02 · SQUARE CENTIMETRES</div>
        <Cued at={squareCentimetresAt} fromScale={0.82} style={{ position: 'absolute', left: 55, top: 105 }}>
          <WarmCard accent={T.cyan} style={{ width: 225, height: 170, display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 82, height: 82, margin: '0 auto', border: `6px solid ${T.cyan}`, background: `${T.cyan}18` }} />
              <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 24, fontWeight: 950, marginTop: 10 }}>1 cm²</div>
            </div>
          </WarmCard>
        </Cued>
        <div style={{ position: 'absolute', left: 310, top: 163, opacity: square }}><HorizontalArrow width={140} color={T.cyan} /></div>
        <div style={{ position: 'absolute', left: 525, top: 91, width: 218, height: 218, borderRadius: 18, border: `4px solid ${T.cyan}`, opacity: square, transform: `scale(${0.76 + square * 0.24})`, backgroundColor: `${T.cyan}0b`, backgroundImage: `linear-gradient(${T.cyan}35 1px, transparent 1px), linear-gradient(90deg, ${T.cyan}35 1px, transparent 1px)`, backgroundSize: '11px 11px', display: 'grid', placeItems: 'center' }}>
          <div style={{ borderRadius: 14, padding: '12px 18px', background: `${T.bgDeep}e8`, color: T.cyanSoft, fontFamily: T.mono, fontSize: 27, fontWeight: 950 }}>100 × 100</div>
        </div>
        <div style={{ position: 'absolute', left: 68, top: 378, display: 'flex', alignItems: 'center', gap: 24, opacity: square }}>
          <div style={{ width: 260, height: 105, borderRadius: 18, border: `2px solid ${T.cyan}88`, background: `${T.cyan}12`, display: 'grid', placeItems: 'center', color: T.text, fontFamily: T.mono, fontSize: 30, fontWeight: 950 }}>N / cm²</div>
          <div style={{ color: T.cyan, fontSize: 42 }}>→</div>
          <div style={{ width: 330, height: 105, borderRadius: 18, border: `2px solid ${T.green}88`, background: `${T.green}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: T.green, fontFamily: T.mono, fontSize: 29, fontWeight: 950 }}>
            <Cued at={thousandsAt} fromScale={0.82} fromY={0}><span>10 000</span></Cued>
            <span>N / m²</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 425, right: 425, bottom: 77, height: 100, borderRadius: 23, border: `3px solid ${T.red}`, background: `${T.red}18`, opacity: warning, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 25, color: T.text, fontSize: 27, fontWeight: 900, transform: `scale(${0.9 + warning * 0.1})` }}>
        <WarningLamp active={warning} />
        OMIT THE POWER → THOUSANDS OFF
        <WarningLamp active={warning} />
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S10 — RECAP
// ─────────────────────────────────────────────────────────────────────

const RecapUnitCard: React.FC<{
  at: number;
  x: number;
  symbol: React.ReactNode;
  name: string;
  color: string;
  children?: React.ReactNode;
}> = ({ at, x, symbol, name, color, children }) => (
  <Cued at={at} fromY={-45} fromScale={0.86} style={{ position: 'absolute', left: x, top: 230 }}>
    <WarmCard accent={color} style={{ width: 355, height: 285, display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color, fontFamily: T.mono, fontSize: 55, lineHeight: 1.05, fontWeight: 950 }}>{symbol}</div>
        <div style={{ color: T.ink, fontSize: 27, fontWeight: 900, marginTop: 18 }}>{name}</div>
        {children}
      </div>
    </WarmCard>
  </Cued>
);

const Checklist: React.FC<{ at: number; x: number; index: number; label: string }> = ({ at, x, index, label }) => (
  <Cued at={at} fromX={index === 4 ? -28 : 28} style={{ position: 'absolute', left: x, top: 675 }}>
    <div style={{ width: 340, height: 142, borderRadius: 22, border: `2px solid ${T.green}77`, background: `${T.panel}e8`, display: 'flex', alignItems: 'center', gap: 20, padding: '22px 24px' }}>
      <div style={{ width: 54, height: 54, flex: '0 0 auto', borderRadius: 16, background: T.green, color: T.bgDeep, display: 'grid', placeItems: 'center', fontSize: 31, fontWeight: 950 }}>✓</div>
      <div>
        <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 14, letterSpacing: 2 }}>0{index}</div>
        <div style={{ color: T.text, fontSize: 24, lineHeight: 1.16, fontWeight: 850, marginTop: 6 }}>{label}</div>
      </div>
    </div>
  </Cued>
);

const Scene10: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const recapAt = spokenAt(scene, 'quick-recap', ['Quick recap']);
  const derivedAt = spokenAt(scene, 'derived-units', ['Derived units']);
  const buildAt = spokenAt(scene, 'combine-base-units', ['combine base units']);
  const speedAt = spokenAt(scene, 'speed', ['Speed']);
  const accelerationAt = spokenAt(scene, 'acceleration');
  const newtonAt = spokenAt(scene, 'newton');
  const weightAt = spokenAt(scene, 'weight', ['weight']);
  const convertAt = spokenAt(scene, 'convert-each-part', ['Convert each part']);
  const powersAt = spokenAt(scene, 'keep-every-power', ['keep every power']);
  const checkAt = spokenAt(scene, 'check-your-work', ['check your work']);
  const speedLink = useCue(speedAt, 0.35);
  const accelerationLink = useCue(accelerationAt, 0.35);
  const newtonLink = useCue(newtonAt, 0.35);
  const weightLink = useCue(weightAt, 0.35);

  return (
    <LabBackground scene={10} label="recap">
      <SceneHeading at={recapAt}>Derived-unit toolkit</SceneHeading>

      <Cued at={derivedAt} fromY={-12} style={{ position: 'absolute', left: 675, top: 174 }}>
        <div style={{ width: 570, color: T.cyanSoft, fontFamily: T.mono, fontSize: 18, fontWeight: 900, letterSpacing: 2.2, textAlign: 'center' }}>BASE UNITS → MECHANICS UNITS</div>
      </Cued>

      <RecapUnitCard at={speedAt} x={90} symbol="m/s" name="speed" color={T.cyan} />
      <RecapUnitCard at={accelerationAt} x={555} symbol="m/s²" name="acceleration" color={T.amber} />
      <RecapUnitCard at={newtonAt} x={1020} symbol="kg·m/s²" name="force · 1 N" color={T.green} />
      <RecapUnitCard at={weightAt} x={1485} symbol={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 34, color: T.ink }}>kg</span><span style={{ color: T.amber }}>↓</span></span>} name="weight is force" color={T.amber}>
        <div style={{ color: '#687680', fontFamily: T.mono, fontSize: 16, fontWeight: 850, marginTop: 9 }}>mass unchanged</div>
      </RecapUnitCard>

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <path d="M445 372 L555 372" stroke={T.cyan} strokeWidth="5" strokeDasharray="12 10" opacity={Math.min(speedLink.opacity, accelerationLink.opacity)} />
        <path d="M910 372 L1020 372" stroke={T.cyan} strokeWidth="5" strokeDasharray="12 10" opacity={Math.min(accelerationLink.opacity, newtonLink.opacity)} />
        <path d="M1375 372 L1485 372" stroke={T.cyan} strokeWidth="5" strokeDasharray="12 10" opacity={Math.min(newtonLink.opacity, weightLink.opacity)} />
      </svg>

      <Checklist at={buildAt} x={90} index={1} label="build from base units" />
      <Checklist at={convertAt} x={555} index={2} label="convert each part" />
      <Checklist at={powersAt} x={1020} index={3} label="keep every power" />
      <Checklist at={checkAt} x={1485} index={4} label="check the final unit" />

      <Cued at={checkAt} fromScale={0.9} style={{ position: 'absolute', left: 680, right: 680, bottom: 88 }}>
        <div style={{ borderRadius: 21, padding: '17px 25px', background: T.green, color: T.bgDeep, fontFamily: T.mono, fontSize: 24, fontWeight: 950, letterSpacing: 1.2, textAlign: 'center', boxShadow: `0 0 35px ${T.green}44` }}>UNIT CHECKED ✓</div>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// AUDIO, SEQUENCING, AND MAIN COMPOSITION
// ─────────────────────────────────────────────────────────────────────

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

export const MechanicsDerivedUnits: React.FC<MechanicsDerivedUnitsProps> = ({ audioEnabled = true }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S01, fps)}>
          <NarratedScene scene={S01} audioEnabled={audioEnabled}><Scene01 scene={S01} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S02, fps)}>
          <NarratedScene scene={S02} audioEnabled={audioEnabled}><Scene02 scene={S02} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S03, fps)}>
          <NarratedScene scene={S03} audioEnabled={audioEnabled}><Scene03 scene={S03} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S04, fps)}>
          <NarratedScene scene={S04} audioEnabled={audioEnabled}><Scene04 scene={S04} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S05, fps)}>
          <NarratedScene scene={S05} audioEnabled={audioEnabled}><Scene05 scene={S05} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S06, fps)}>
          <NarratedScene scene={S06} audioEnabled={audioEnabled}><Scene06 scene={S06} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S07, fps)}>
          <NarratedScene scene={S07} audioEnabled={audioEnabled}><Scene07 scene={S07} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S08, fps)}>
          <NarratedScene scene={S08} audioEnabled={audioEnabled}><Scene08 scene={S08} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S09, fps)}>
          <NarratedScene scene={S09} audioEnabled={audioEnabled}><Scene09 scene={S09} /></NarratedScene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />

        <TransitionSeries.Sequence durationInFrames={sceneDurationInFrames(S10, fps)}>
          <NarratedScene scene={S10} audioEnabled={audioEnabled}><Scene10 scene={S10} /></NarratedScene>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default MechanicsDerivedUnits;
