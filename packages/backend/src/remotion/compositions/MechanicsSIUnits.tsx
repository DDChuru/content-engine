/**
 * S.I. Units for Mechanics
 *
 * A narration-driven, 16:9 measurement-lab explainer. Every instructional
 * reveal is keyed to the local word timestamps in the Whisper transcript.
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
import transcriptJson from '../public/transcripts/mechanics/si-units.json';
import { useCue } from './ProjectComposition';

const cardInk = (color: string) => ({
  '#42dbe8': '#087782', '#8decf2': '#087782', '#f4aa45': '#925000',
  '#61d095': '#237347', '#ef6f63': '#b6342c',
}[color] ?? color);
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

/** Resolve a named cue first, then any additional spoken phrase from words. */
function spokenAt(scene: MechanicsTranscriptScene, phrase: string, occurrence = 1): number {
  if (occurrence === 1) {
    const namedCue = Object.entries(scene.cues).find(([key]) => normalize(key) === normalize(phrase));
    if (namedCue) return namedCue[1];
  }

  const phraseWords = phrase
    .toLowerCase()
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean);
  const words = scene.words.map(({ word }) => normalize(word));
  let seen = 0;

  for (let i = 0; i <= words.length - phraseWords.length; i++) {
    if (phraseWords.every((word, offset) => words[i + offset] === word)) {
      seen += 1;
      if (seen === occurrence) return scene.words[i].start;
    }
  }

  // An unresolved visual remains hidden instead of entering at an invented time.
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

export function getMechanicsSIUnitsDuration(fps: number): number {
  const sequenceFrames = TRANSCRIPT.scenes.reduce(
    (sum, scene) => sum + sceneDurationInFrames(scene, fps),
    0,
  );
  return sequenceFrames - (TRANSCRIPT.scenes.length - 1) * TRANSITION_FRAMES;
}

export interface MechanicsSIUnitsProps {
  audioEnabled?: boolean;
}

function useCueSpring(cueTimeSeconds: number, durationInFrames = 24) {
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

function useCueProgress(cueTimeSeconds: number, durationSeconds = 0.8) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(
    frame,
    [cueTimeSeconds * fps, (cueTimeSeconds + durationSeconds) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
}

const katexCSS = `
  .katex { font-size: 1em; }
  .katex .mord, .katex .mop, .katex .mrel, .katex .mopen,
  .katex .mclose, .katex .mpunct, .katex .mbin, .katex .minner { color: inherit; }
`;

const MathTeX: React.FC<{
  tex: string;
  fontSize?: number;
  color?: string;
  display?: boolean;
  style?: React.CSSProperties;
}> = ({ tex, fontSize = 48, color = T.text, display = true, style }) => {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
    output: 'html',
    strict: false,
  });

  return (
    <div style={{ fontSize, color, lineHeight: 1.4, ...style }}>
      <style>{katexCSS}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

const Cued: React.FC<{
  at: number;
  children: React.ReactNode;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  fadeDuration?: number;
  style?: React.CSSProperties;
}> = ({ at, children, fromX = 0, fromY = 22, fromScale = 0.96, fadeDuration = 0.45, style }) => {
  const cue = useCue(at, fadeDuration);
  return (
    <div
      style={{
        opacity: cue.opacity,
        transform: `translate(${(1 - cue.opacity) * fromX}px, ${(1 - cue.opacity) * fromY}px) scale(${fromScale + (1 - fromScale) * cue.opacity})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const SpringIn: React.FC<{
  at: number;
  children: React.ReactNode;
  fromX?: number;
  fromY?: number;
  style?: React.CSSProperties;
}> = ({ at, children, fromX = 0, fromY = 36, style }) => {
  const progress = useCueSpring(at);
  return (
    <div
      style={{
        opacity: progress,
        transform: `translate(${(1 - progress) * fromX}px, ${(1 - progress) * fromY}px) scale(${0.82 + progress * 0.18})`,
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
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 18px',
      borderRadius: 999,
      border: `1px solid ${T.cyan}55`,
      background: `${T.bgDeep}cc`,
      boxShadow: `0 0 30px ${T.cyan}12`,
      fontFamily: T.mono,
      color: T.textMuted,
      fontSize: 28,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    }}
  >
    <span style={{ color: T.cyan, fontWeight: 800 }}>{String(scene).padStart(2, '0')} / 10</span>
    <span>{label}</span>
  </div>
);

const LabBackground: React.FC<{ scene: number; label: string; children: React.ReactNode }> = ({
  scene,
  label,
  children,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 80) * 12;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', isolation: 'isolate', background: T.bg, fontFamily: T.sans }}>
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
          fontSize: 28,
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

const UnitPill: React.FC<{ value: string; label: string; color?: string }> = ({
  value,
  label,
  color = T.cyan,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 20px',
      borderRadius: 16,
      background: `${color}16`,
      border: `2px solid ${color}70`,
      color: T.text,
    }}
  >
    <span style={{ fontFamily: T.mono, color, fontWeight: 900, fontSize: 34 }}>{value}</span>
    <span style={{ color: T.textMuted, fontSize: 28, fontWeight: 650 }}>{label}</span>
  </div>
);

const MeasurementArrow: React.FC<{
  width: number;
  color?: string;
  progress?: number;
  thickness?: number;
}> = ({ width, color = T.cyan, progress = 1, thickness = 5 }) => {
  const drawn = Math.max(0, width * progress);
  return (
    <div style={{ position: 'relative', width, height: 30 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 13,
          width: drawn,
          height: thickness,
          borderRadius: thickness,
          background: color,
          boxShadow: `0 0 14px ${color}88`,
        }}
      />
      {progress > 0.94 && (
        <div
          style={{
            position: 'absolute',
            left: width - 2,
            top: 5,
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderLeft: `18px solid ${color}`,
          }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S01 — THE UNIT TRAP
// ─────────────────────────────────────────────────────────────────────

const FormulaMachine: React.FC<{ jammed: boolean; resetProgress: number }> = ({
  jammed,
  resetProgress,
}) => {
  const frame = useCurrentFrame();
  const shake = jammed && resetProgress < 0.05 ? Math.sin(frame * 0.65) * 2 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: 468,
        top: 150,
        width: 628,
        height: 430,
        transform: `translateX(${shake}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 38,
          background: `linear-gradient(145deg, ${T.panelLight}, ${T.panel})`,
          border: `3px solid ${jammed && resetProgress < 0.05 ? T.red : T.cyan}88`,
          boxShadow: `0 24px 70px #0009, inset 0 0 50px ${T.cyan}0c`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 54,
          right: 54,
          top: 52,
          height: 160,
          borderRadius: 18,
          background: T.bgDeep,
          border: `2px solid ${jammed && resetProgress < 0.05 ? T.red : T.cyan}55`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {resetProgress < 0.05 ? (
          <MathTeX tex="v=\frac{d}{t}" fontSize={52} color={jammed ? T.red : T.text} />
        ) : (
          <div style={{ color: T.green, fontFamily: T.mono, fontSize: 31, fontWeight: 900, letterSpacing: 2, transform: `scale(${0.85 + resetProgress * 0.15})` }}>
            ✓ UNITS ALIGNED
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          bottom: 74,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {['m', 's', 'kg'].map((unit) => (
          <div key={unit} style={{ width: 128, height: 78, borderRadius: 14, background: '#07131c', border: `2px solid ${resetProgress > 0 ? T.cyan : T.textMuted}66`, overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
            <div style={{ opacity: Math.max(0, (resetProgress - 0.35) / 0.65), transform: `scale(${0.7 + resetProgress * 0.3})`, color: T.cyan, fontFamily: T.mono, fontSize: 36, fontWeight: 950 }}>
              {unit}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 38,
          bottom: 32,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: resetProgress > 0.05 ? T.green : jammed ? T.red : T.amber,
          boxShadow: `0 0 18px ${resetProgress > 0.05 ? T.green : jammed ? T.red : T.amber}`,
        }}
      />
    </div>
  );
};

const Scene01: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const mismatchAt = spokenAt(scene, 'unit mismatch');
  const languageAt = spokenAt(scene, 'same measurement language');
  const calculateAt = spokenAt(scene, 'calculate');
  const mismatch = useCue(mismatchAt, 0.35);
  const resetProgress = useCueProgress(languageAt, 0.65);
  const dropProgress = useCueProgress(mismatchAt, 0.85);

  return (
    <LabBackground scene={1} label="unit trap">
      <Cued at={mismatchAt} fromY={-18} style={{ position: 'absolute', left: 84, top: 164 }}>
        <div style={{ opacity: 1 - resetProgress, color: T.red, fontSize: 28, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
          incompatible inputs
        </div>
      </Cued>

      <div style={{ position: 'absolute', left: 178, right: 178, top: 118, height: 620 }}>
        {[
          { value: '2.4', unit: 'km', left: 538, startTop: 375, rotate: -5 },
          { value: '8', unit: 'min', left: 718, startTop: 375, rotate: 3 },
          { value: '500', unit: 'g', left: 898, startTop: 375, rotate: -2 },
        ].map((card) => (
          <WarmCard
            key={card.unit}
            accent={T.red}
            style={{
              position: 'absolute',
              left: card.left,
              top: interpolate(dropProgress, [0, 1], [card.startTop, 428], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              width: 128,
              height: 78,
              display: 'grid',
              placeItems: 'center',
              opacity: mismatch.opacity * Math.max(0, 1 - resetProgress * 3),
              transform: `rotate(${card.rotate * (1 - dropProgress)}deg) scale(${0.92 + dropProgress * 0.08})`,
              zIndex: 4,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontFamily: T.mono, fontSize: 28, color: cardInk(T.red), fontWeight: 800, marginTop: 5 }}>{card.unit}</div>
            </div>
          </WarmCard>
        ))}

        <FormulaMachine jammed={mismatch.isActive} resetProgress={resetProgress} />
      </div>

      <Cued
        at={languageAt}
        fromY={24}
        style={{ position: 'absolute', left: 185, right: 185, top: 760, display: 'flex', justifyContent: 'center' }}
      >
        <div style={{ display: 'flex', gap: 18 }}>
          <UnitPill value="m" label="metres" />
          <UnitPill value="s" label="seconds" />
          <UnitPill value="kg" label="kilograms" />
        </div>
      </Cued>

      <Cued
        at={calculateAt}
        fromScale={0.86}
        fromY={20}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 88, textAlign: 'center' }}
      >
        <div style={{ color: T.text, fontWeight: 900, fontSize: 55, letterSpacing: -1.5 }}>
          S.I. Units <span style={{ color: T.cyan }}>in Mechanics</span>
        </div>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S02 — ONE SHARED LANGUAGE
// ─────────────────────────────────────────────────────────────────────

const GlobeGrid: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 710,
        top: 214,
        width: 500,
        height: 500,
        borderRadius: '50%',
        border: `4px solid ${T.cyan}`,
        boxShadow: `0 0 60px ${T.cyan}25, inset 0 0 70px ${T.cyan}16`,
        opacity: progress,
        transform: `scale(${0.82 + progress * 0.18}) rotate(${Math.sin(frame / 100) * 1.5}deg)`,
        overflow: 'hidden',
      }}
    >
      {[20, 40, 60, 80].map((top) => (
        <div key={`lat-${top}`} style={{ position: 'absolute', top: `${top}%`, left: 28, right: 28, height: 2, borderRadius: '50%', background: `${T.cyan}55` }} />
      ))}
      {[22, 50, 78].map((left) => (
        <div key={`long-${left}`} style={{ position: 'absolute', left: `${left}%`, top: 22, bottom: 22, width: 2, borderRadius: '50%', background: `${T.cyan}55`, transform: `scaleX(${left === 50 ? 1 : 10})` }} />
      ))}
      <div style={{ position: 'absolute', inset: 62, border: `2px dashed ${T.cyan}55`, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{ width: 142, height: 142, borderRadius: 28, background: T.card, color: T.ink, display: 'grid', placeItems: 'center', boxShadow: `0 0 38px ${T.cyan}44`, fontFamily: T.mono, fontSize: 45, fontWeight: 900 }}>
          S.I.
        </div>
      </div>
    </div>
  );
};

const SITargetGlyph: React.FC<{
  kind: 'length' | 'time' | 'mass';
  symbol: string;
  color: string;
}> = ({ kind, symbol, color }) => (
  <div style={{ position: 'relative', width: 220, height: 220, borderRadius: 24, background: `${T.bgDeep}e8`, border: `2px solid ${color}88`, boxShadow: `0 16px 40px #0007, 0 0 25px ${color}15` }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 102, textAlign: 'center', color, fontFamily: T.mono, fontSize: 28, fontWeight: 850, letterSpacing: 1.8 }}>{kind.toUpperCase()}</div>
    {kind === 'length' && (
      <div style={{ position: 'absolute', left: 37, top: 151, width: 146, height: 27, borderRadius: 6, background: T.card, border: `3px solid ${color}` }}>
        {Array.from({ length: 8 }).map((_, index) => <div key={index} style={{ position: 'absolute', left: 10 + index * 18, top: 0, width: 2, height: index % 2 === 0 ? 14 : 9, background: T.ink }} />)}
      </div>
    )}
    {kind === 'time' && (
      <div style={{ position: 'absolute', left: 79, top: 136, width: 64, height: 64, borderRadius: '50%', border: `4px solid ${color}` }}>
        <div style={{ position: 'absolute', left: 28, top: 9, width: 4, height: 25, borderRadius: 4, background: T.card, transform: 'rotate(25deg)', transformOrigin: 'bottom' }} />
      </div>
    )}
    {kind === 'mass' && (
      <div style={{ position: 'absolute', left: 69, top: 142, width: 84, height: 59, borderRadius: 10, background: color, color: T.bgDeep, display: 'grid', placeItems: 'center', fontFamily: T.mono, fontSize: 28, fontWeight: 950 }}>{symbol}</div>
    )}
  </div>
);

const Scene02: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const sharedAt = spokenAt(scene, 'shared system');
  const ambiguityAt = spokenAt(scene, 'removes ambiguity');
  const metreAt = spokenAt(scene, 'metre');
  const consistentAt = spokenAt(scene, 'consistent');
  const globe = useCueSpring(sharedAt, 32);
  const converge = useCueProgress(ambiguityAt, 1.15);
  const targets = useCue(ambiguityAt, 0.35);
  const standardize = useCueProgress(metreAt, 0.55);
  const lock = useCueSpring(consistentAt, 24);

  const measurements: Array<{
    label: string;
    x: number;
    y: number;
    source: string;
    si: string;
    kind: 'length' | 'time' | 'mass';
    symbol: string;
    color: string;
    targetX: number;
    targetY: number;
  }> = [
    { label: 'LAB A', x: 132, y: 205, source: '320 cm', si: '3.2 m', kind: 'length', symbol: 'm', color: T.cyan, targetX: 635, targetY: 552 },
    { label: 'LAB B', x: 128, y: 650, source: '2 min', si: '120 s', kind: 'time', symbol: 's', color: T.amber, targetX: 885, targetY: 552 },
    { label: 'LAB C', x: 1465, y: 405, source: '750 g', si: '0.75 kg', kind: 'mass', symbol: 'kg', color: T.green, targetX: 1135, targetY: 552 },
  ];

  return (
    <LabBackground scene={2} label="shared language">
      <GlobeGrid progress={globe} />

      <Cued at={sharedAt} fromY={-20} style={{ position: 'absolute', left: 0, right: 0, top: 116, textAlign: 'center' }}>
        <div style={{ color: T.text, fontSize: 52, fontWeight: 900 }}>
          One <span style={{ color: T.cyan }}>shared system</span>
        </div>
      </Cued>

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: targets.opacity * (1 - standardize * 0.75), pointerEvents: 'none' }}>
        <path pathLength={1} d="M287 302 C410 330 490 500 720 590" fill="none" stroke={T.cyan} strokeWidth="5" strokeDasharray="0.035 0.03" strokeDashoffset={1 - converge} />
        <path pathLength={1} d="M283 747 C470 790 690 700 970 590" fill="none" stroke={T.amber} strokeWidth="5" strokeDasharray="0.035 0.03" strokeDashoffset={1 - converge} />
        <path pathLength={1} d="M1620 502 C1510 520 1400 550 1220 590" fill="none" stroke={T.green} strokeWidth="5" strokeDasharray="0.035 0.03" strokeDashoffset={1 - converge} />
      </svg>

      {measurements.map((measurement, index) => {
        const panelX = 610 + index * 250;
        return (
          <React.Fragment key={measurement.label}>
            <Cued at={sharedAt} fromScale={0.8} style={{ position: 'absolute', left: measurement.x, top: measurement.y }}>
              <div style={{ width: 260, height: 138, borderRadius: 22, background: T.panel, border: `2px solid ${measurement.color}88`, padding: 22, boxShadow: '0 18px 45px #0006' }}>
                <div style={{ color: measurement.color, fontFamily: T.mono, fontSize: 28, letterSpacing: 2 }}>{measurement.label}</div>
                <div style={{ marginTop: 14, display: 'flex', gap: 9 }}>
                  {[0, 1, 2].map((bar) => <div key={bar} style={{ width: 13, height: 38 + bar * 10, borderRadius: 6, background: bar === 1 ? measurement.color : `${measurement.color}99` }} />)}
                </div>
              </div>
            </Cued>

            <div style={{ position: 'absolute', left: panelX, top: 532, opacity: targets.opacity }}>
              <SITargetGlyph kind={measurement.kind} symbol={measurement.symbol} color={measurement.color} />
            </div>

            <WarmCard
              accent={measurement.color}
              style={{
                position: 'absolute',
                left: interpolate(converge, [0, 1], [measurement.x + 45, measurement.targetX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                top: interpolate(converge, [0, 1], [measurement.y + 72, measurement.targetY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                width: 170,
                height: 76,
                opacity: targets.opacity,
                display: 'grid',
                placeItems: 'center',
                zIndex: 7,
                fontFamily: T.mono,
                fontSize: 28,
                fontWeight: 900,
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                <span style={{ position: 'absolute', opacity: 1 - standardize }}>{measurement.source}</span>
                <span style={{ position: 'absolute', opacity: standardize, color: cardInk(measurement.color), transform: `scale(${0.78 + standardize * 0.22})` }}>{measurement.si}</span>
              </div>
            </WarmCard>
          </React.Fragment>
        );
      })}

      <Cued at={metreAt} fromY={12} style={{ position: 'absolute', left: 530, top: 785, width: 860, textAlign: 'center' }}>
        <div style={{ color: T.cyanSoft, fontFamily: T.mono, fontSize: 28, fontWeight: 850, letterSpacing: 1.4 }}>MATCHED TARGETS · DIRECTLY COMPARABLE</div>
      </Cued>

      <div
        style={{
          position: 'absolute',
          left: 750,
          top: 844,
          width: 420,
          height: 112,
          borderRadius: 22,
          border: `2px solid ${T.green}88`,
          background: `${T.green}12`,
          opacity: lock,
          transform: `scale(${0.8 + lock * 0.2})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          color: T.text,
          fontSize: 29,
          fontWeight: 800,
        }}
      >
        <span style={{ color: T.green, fontSize: 42 }}>✓</span>
        Equation consistent
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S03 — METRE: HOW FAR
// ─────────────────────────────────────────────────────────────────────

const Ruler: React.FC<{ progress: number; width: number; extensionProgress: number }> = ({ progress, width, extensionProgress }) => (
  <div
    style={{
      position: 'relative',
      width: width * progress,
      height: 148,
      overflow: 'hidden',
      borderRadius: 18,
      background: T.card,
      border: `3px solid ${extensionProgress > 0 ? T.amber : T.cyan}`,
      boxShadow: `0 18px 55px #0007, 0 0 ${25 + extensionProgress * 18}px ${extensionProgress > 0 ? T.amber : T.cyan}33`,
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 17, background: T.cyan }} />
    <div style={{ position: 'absolute', top: 0, left: 748, right: 0, height: 17, background: T.amber, opacity: extensionProgress }} />
    {Array.from({ length: 51 }).map((_, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: index * 34,
          top: 17,
          width: 2,
          height: index % 10 === 0 ? 66 : index % 5 === 0 ? 49 : 30,
          background: T.ink,
        }}
      >
        {index % 10 === 0 && (
          <span style={{ position: 'absolute', top: 68, left: 6, fontFamily: T.mono, fontWeight: 800, fontSize: 28, color: T.ink }}>
            {index / 10}
          </span>
        )}
      </div>
    ))}
    {[748, 1068, 1388].map((left, index) => (
      <div key={left} style={{ position: 'absolute', left, top: 17, bottom: 0, width: 6, background: `${T.amber}${index === 0 ? 'aa' : '66'}`, opacity: extensionProgress, boxShadow: `0 0 12px ${T.amber}55` }} />
    ))}
  </div>
);

const Scene03: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const metreAt = spokenAt(scene, 'metre');
  const howFarAt = spokenAt(scene, 'how far');
  const displacementAt = spokenAt(scene, 'displacement');
  const kilometreAt = spokenAt(scene, 'one kilometre');
  const rulerProgress = useCueProgress(metreAt, 1.05);
  const arrowProgress = useCueProgress(displacementAt, 0.8);
  const telescope = useCueProgress(kilometreAt, 1.45);
  const rulerWidth = interpolate(telescope, [0, 1], [760, 1700], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const counter = Math.round(
    interpolate(
      frame,
      [kilometreAt * fps, (kilometreAt + 1.35) * fps],
      [1, 1000],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
  );

  return (
    <LabBackground scene={3} label="base unit · length">
      <Cued at={metreAt} fromY={-18} style={{ position: 'absolute', left: 108, top: 130 }}>
        <div style={{ color: T.text, fontSize: 58, fontWeight: 900 }}>
          metre <span style={{ color: T.cyan, fontFamily: T.mono }}>m</span>
        </div>
      </Cued>
      <Cued at={howFarAt} fromX={-32} style={{ position: 'absolute', right: 128, top: 146 }}>
        <div style={{ color: T.cyanSoft, fontFamily: T.mono, fontSize: 31, fontWeight: 800, letterSpacing: 1.6 }}>
          HOW FAR?
        </div>
      </Cued>

      <div style={{ position: 'absolute', left: 110, top: 310 }}>
        <div style={{ position: 'absolute', left: 0, top: -46, color: T.text, fontFamily: T.mono, fontSize: 28, opacity: rulerProgress }}>metres</div>
        <div style={{ position: 'absolute', right: 0, top: -46, color: T.amber, fontFamily: T.mono, fontSize: 28, opacity: telescope }}>TELESCOPING →</div>
        <Ruler progress={rulerProgress} width={rulerWidth} extensionProgress={telescope} />
        <div style={{ width: rulerWidth, height: 36, marginTop: 15, background: T.panelLight, borderBlock: `2px solid ${T.cardMuted}`, opacity: telescope }}>
          <div style={{ marginTop: 15, borderTop: `3px dashed ${T.card}` }} />
        </div>
      </div>

      <Cued at={displacementAt} fromY={18} style={{ position: 'absolute', left: 286, top: 505 }}>
        <div style={{ color: T.textMuted, fontSize: 28, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase' }}>displacement</div>
        <MeasurementArrow width={560} progress={arrowProgress} />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: 580, fontFamily: T.mono, color: T.text, fontSize: 28 }}>
          <span>x₁</span><span>x₂</span>
        </div>
      </Cued>

      <Cued at={kilometreAt} fromScale={0.8} style={{ position: 'absolute', left: 635, right: 635, bottom: 116 }}>
        <WarmCard accent={T.amber} style={{ padding: '22px 36px', textAlign: 'center' }}>
          <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 28, fontWeight: 800 }}>1 kilometre</div>
          <div style={{ marginTop: 6, color: cardInk(T.amber), fontFamily: T.mono, fontSize: 56, fontWeight: 950, lineHeight: 1 }}>
            {counter.toLocaleString()} m
          </div>
        </WarmCard>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S04 — SECOND: HOW LONG
// ─────────────────────────────────────────────────────────────────────

const ClockFace: React.FC<{
  opacity: number;
  angle: number;
  ringProgress: number;
}> = ({ opacity, angle, ringProgress }) => (
  <div
    style={{
      position: 'relative',
      width: 430,
      height: 430,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${T.panelLight}, ${T.bgDeep})`,
      border: `5px solid ${T.card}`,
      boxShadow: `0 22px 75px #0008, 0 0 46px ${T.cyan}22`,
      opacity,
      transform: `scale(${0.85 + opacity * 0.15})`,
    }}
  >
    {Array.from({ length: 60 }).map((_, index) => {
      const tickAngle = index * 6;
      const major = index % 5 === 0;
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: 211,
            top: 9,
            width: major ? 5 : 3,
            height: major ? 26 : 15,
            borderRadius: 4,
            background: index < ringProgress * 60 ? T.amber : `${T.card}55`,
            boxShadow: index < ringProgress * 60 ? `0 0 9px ${T.amber}` : 'none',
            transformOrigin: `center ${206}px`,
            transform: `rotate(${tickAngle}deg)`,
          }}
        />
      );
    })}
    <div
      style={{
        position: 'absolute',
        left: 210,
        top: 74,
        width: 8,
        height: 145,
        borderRadius: 8,
        background: T.cyan,
        transformOrigin: 'center bottom',
        transform: `rotate(${angle}deg)`,
        boxShadow: `0 0 14px ${T.cyan}`,
      }}
    />
    <div style={{ position: 'absolute', left: 194, top: 194, width: 40, height: 40, borderRadius: '50%', background: T.card, border: `8px solid ${T.cyan}` }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 86, textAlign: 'center', color: T.textMuted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2 }}>BASE UNIT</div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 39, textAlign: 'center', color: T.text, fontFamily: T.mono, fontSize: 42, fontWeight: 900 }}>s</div>
  </div>
);

const Scene04: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const secondAt = spokenAt(scene, 'second');
  const howLongAt = spokenAt(scene, 'how long');
  const minutesAt = spokenAt(scene, 'minutes');
  const sixtyAt = spokenAt(scene, 'sixty seconds');
  const clock = useCueSpring(secondAt, 28);
  const track = useCueProgress(howLongAt, 2.1);
  const ring = useCueProgress(minutesAt, 1.5);
  const condense = useCueSpring(sixtyAt, 26);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const angle = interpolate(
    frame,
    [secondAt * fps, Math.max(secondAt + 0.1, minutesAt) * fps],
    [0, 360],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <LabBackground scene={4} label="base unit · time">
      <Cued at={secondAt} fromY={-18} style={{ position: 'absolute', left: 112, top: 132 }}>
        <div style={{ color: T.text, fontSize: 58, fontWeight: 900 }}>
          second <span style={{ color: T.cyan, fontFamily: T.mono }}>s</span>
        </div>
      </Cued>
      <Cued at={howLongAt} fromX={-30} style={{ position: 'absolute', right: 128, top: 148 }}>
        <div style={{ color: T.cyanSoft, fontFamily: T.mono, fontSize: 31, fontWeight: 800, letterSpacing: 1.6 }}>HOW LONG?</div>
      </Cued>

      <div style={{ position: 'absolute', left: 196, top: 275 }}>
        <ClockFace opacity={clock} angle={angle} ringProgress={ring * (1 - condense)} />
        <div style={{ position: 'absolute', left: 215 + condense * 665, top: 215 + condense * 475, width: 80, height: 80, borderRadius: '50%', border: `6px dotted ${T.amber}`, opacity: 4 * condense * (1 - condense), transform: 'translate(-50%, -50%)' }} />
      </div>

      <Cued at={howLongAt} fromX={40} style={{ position: 'absolute', left: 735, top: 318, width: 1010 }}>
        <div style={{ color: T.textMuted, fontSize: 28, fontFamily: T.mono, letterSpacing: 2, marginBottom: 18 }}>MOTION OVER TIME</div>
        <div style={{ position: 'relative', width: 920, height: 170 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 100, height: 6, borderRadius: 8, background: `${T.card}55` }} />
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: 30 + index * 110,
                top: 74,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: T.cyan,
                opacity: Math.max(0, Math.min(1, track * 8 - index)) * (0.25 + index * 0.09),
                boxShadow: `0 0 22px ${T.cyan}88`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              left: interpolate(track, [0, 1], [18, 842]),
              top: 48,
              width: 62,
              height: 46,
              borderRadius: '22px 22px 9px 9px',
              background: T.amber,
              boxShadow: `0 0 25px ${T.amber}66`,
            }}
          />
        </div>
      </Cued>

      <div
        style={{
          position: 'absolute',
          left: 823,
          right: 168,
          bottom: 138,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 34,
          opacity: condense,
          transform: `scale(${0.78 + condense * 0.22})`,
        }}
      >
        <WarmCard accent={T.amber} style={{ width: 270, height: 126, display: 'grid', placeItems: 'center' }}>
          <span style={{ fontFamily: T.mono, fontSize: 43, fontWeight: 900 }}>1 minute</span>
        </WarmCard>
        <div style={{ color: T.cyan, fontSize: 58, fontWeight: 900 }}>=</div>
        <WarmCard accent={T.cyan} style={{ width: 306, height: 126, display: 'grid', placeItems: 'center' }}>
          <span style={{ fontFamily: T.mono, fontSize: 43, fontWeight: 900 }}>60 seconds</span>
        </WarmCard>
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S05 — KILOGRAM: RESISTANCE TO CHANGE
// ─────────────────────────────────────────────────────────────────────

const Cart: React.FC<{
  x: number;
  y: number;
  heavy?: boolean;
  progress: number;
}> = ({ x, y, heavy = false, progress }) => {
  const travel = progress * progress * (heavy ? 130 : 340);
  const wheelTurn = progress * (heavy ? 190 : 500);
  return (
    <div style={{ position: 'absolute', left: x + travel, top: y, width: 340, height: 190 }}>
      {heavy && (
        <div
          style={{
            position: 'absolute',
            left: 92,
            top: 0,
            width: 150,
            height: 94,
            borderRadius: 15,
            background: T.card,
            border: `4px solid ${T.cyan}`,
            color: T.ink,
            display: 'grid',
            placeItems: 'center',
            fontFamily: T.mono,
            fontSize: 28,
            fontWeight: 900,
            boxShadow: '0 14px 35px #0006',
          }}
        >
          1 kg
        </div>
      )}
      <div style={{ position: 'absolute', left: 36, top: 86, width: 276, height: 54, borderRadius: 12, background: heavy ? T.cyan : T.cyanSoft, border: `4px solid ${T.card}` }} />
      {[74, 252].map((left) => (
        <div
          key={left}
          style={{
            position: 'absolute',
            left,
            top: 124,
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: T.bgDeep,
            border: `9px solid ${T.cardMuted}`,
            transform: `rotate(${wheelTurn}deg)`,
          }}
        >
          <div style={{ position: 'absolute', left: 17, top: -3, width: 4, height: 42, background: T.ink }} />
        </div>
      ))}
    </div>
  );
};

const Scene05: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const kilogramAt = spokenAt(scene, 'kilogram');
  const resistsAt = spokenAt(scene, 'resists');
  const gramsAt = spokenAt(scene, 'one thousand grams');
  const tonneAt = spokenAt(scene, 'one tonne');
  const carts = useCue(kilogramAt, 0.45);
  const motion = useCueProgress(resistsAt, 1.65);
  const pushes = useCueProgress(resistsAt, 0.4);
  const gramStep = useCueSpring(gramsAt, 24);
  const tonneStep = useCueSpring(tonneAt, 24);

  return (
    <LabBackground scene={5} label="base unit · mass">
      <Cued at={kilogramAt} fromY={-18} style={{ position: 'absolute', left: 110, top: 128 }}>
        <div style={{ color: T.text, fontSize: 58, fontWeight: 900 }}>
          kilogram <span style={{ color: T.cyan, fontFamily: T.mono }}>kg</span>
        </div>
      </Cued>

      <div style={{ opacity: carts.opacity }}>
        <Cart x={292} y={256} progress={motion} />
        <Cart x={292} y={490} heavy progress={motion} />
        <div style={{ position: 'absolute', left: 208, top: 470, color: T.textMuted, fontFamily: T.mono, fontSize: 28, transform: 'rotate(-90deg)', transformOrigin: 'left center' }}>SAME PUSH</div>
        {[256, 490].map((top, index) => (
          <div key={top} style={{ position: 'absolute', left: 328 + motion * motion * (index === 0 ? 340 : 130), top: top + 98, opacity: pushes }}>
            <MeasurementArrow width={154} color={T.amber} progress={pushes} thickness={8} />
          </div>
        ))}
        <div style={{ position: 'absolute', left: 328, top: 450, width: motion * motion * 340, borderTop: `4px dashed ${T.cyan}88`, opacity: motion }} />
        <div style={{ position: 'absolute', left: 328, top: 684, width: motion * motion * 130, borderTop: `4px dashed ${T.cyan}88`, opacity: motion }} />
      </div>

      <Cued at={resistsAt} fromX={30} style={{ position: 'absolute', right: 134, top: 190 }}>
        <WarmCard accent={T.amber} style={{ width: 540, padding: '26px 32px' }}>
          <div style={{ color: T.ink, fontSize: 28, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 1.5 }}>inertia</div>
          <div style={{ color: T.ink, fontSize: 37, fontWeight: 900, marginTop: 6 }}>More mass → less acceleration</div>
          <div style={{ color: '#5f6d75', fontSize: 28, marginTop: 8 }}>for the same applied force</div>
        </WarmCard>
      </Cued>

      <div style={{ position: 'absolute', right: 128, bottom: 137, width: 620, height: 290 }}>
        <div style={{ position: 'absolute', left: 36, top: 90, opacity: gramStep, transform: `scale(${0.82 + gramStep * 0.18})` }}>
          <UnitPill value="1000" label="g" color={T.cardMuted} />
        </div>
        <div style={{ position: 'absolute', left: 242, top: 78, opacity: gramStep, color: T.cyan, fontSize: 52, fontWeight: 900 }}>=</div>
        <div style={{ position: 'absolute', left: 308, top: 90, opacity: gramStep, transform: `scale(${0.82 + gramStep * 0.18})` }}>
          <UnitPill value="1" label="kg" />
        </div>
        <div style={{ position: 'absolute', left: 150, top: 205, opacity: tonneStep, transform: `scale(${0.82 + tonneStep * 0.18})` }}>
          <UnitPill value="1 tonne" label="= 1000 kg" color={T.amber} />
        </div>
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S06 — MASS VERSUS WEIGHT
// ─────────────────────────────────────────────────────────────────────

const ForceArrowDown: React.FC<{ length: number; opacity: number; label?: string }> = ({
  length,
  opacity,
  label,
}) => (
  <div style={{ position: 'relative', width: 110, height: length + 36, opacity }}>
    <div style={{ position: 'absolute', left: 49, top: 0, width: 12, height: length, borderRadius: 8, background: T.amber, boxShadow: `0 0 17px ${T.amber}88` }} />
    <div style={{ position: 'absolute', left: 27, top: length - 2, width: 0, height: 0, borderLeft: '28px solid transparent', borderRight: '28px solid transparent', borderTop: `36px solid ${T.amber}` }} />
    {label && <div style={{ position: 'absolute', left: 84, top: length / 2 - 16, background: T.bgDeep, borderRadius: 6, padding: '2px 6px', color: T.amber, fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}>{label}</div>}
  </div>
);

const Planet: React.FC<{ moon?: boolean }> = ({ moon = false }) => (
  <div
    style={{
      position: 'relative',
      width: 250,
      height: 250,
      borderRadius: '50%',
      background: moon
        ? `radial-gradient(circle at 35% 30%, #f0f3f4, ${T.moon} 45%, #7e8d97)`
        : 'radial-gradient(circle at 36% 30%, #83d9ff, #1f82b2 45%, #0b486d)',
      boxShadow: moon ? '0 0 55px #dce4e744' : '0 0 65px #42dbe833',
      overflow: 'hidden',
    }}
  >
    {moon ? (
      [[38, 70, 38], [142, 42, 27], [120, 150, 48], [42, 170, 22]].map(([left, top, size], index) => (
        <div key={index} style={{ position: 'absolute', left, top, width: size, height: size, borderRadius: '50%', background: '#8c9aa43b', boxShadow: 'inset 6px 7px 12px #57656f55' }} />
      ))
    ) : (
      <>
        <div style={{ position: 'absolute', left: 15, top: 61, width: 122, height: 66, borderRadius: '55% 45% 55% 40%', background: '#61d095' }} />
        <div style={{ position: 'absolute', right: 8, bottom: 49, width: 105, height: 78, borderRadius: '50% 45% 55% 42%', background: '#4ab87b' }} />
      </>
    )}
  </div>
);

const Scene06: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const massAt = spokenAt(scene, 'Mass');
  const weightAt = spokenAt(scene, 'Weight');
  const newtonsAt = spokenAt(scene, 'newtons');
  const moonAt = spokenAt(scene, 'Moon');
  const mass = useCueSpring(massAt, 25);
  const weight = useCueSpring(weightAt, 25);
  const newtons = useCueSpring(newtonsAt, 22);
  const moon = useCueProgress(moonAt, 0.9);

  return (
    <LabBackground scene={6} label="mass ≠ weight">
      <div style={{ position: 'absolute', left: 76, right: 76, top: 124, bottom: 86, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 42 }}>
        <div style={{ position: 'relative', borderRadius: 32, background: `${T.panel}d9`, border: `2px solid ${T.cyan}55`, overflow: 'hidden', opacity: mass, transform: `translateX(${(1 - mass) * -30}px)` }}>
          <div style={{ position: 'absolute', top: 35, left: 42, color: T.cyan, fontSize: 42, fontWeight: 900 }}>MASS</div>
          <div style={{ position: 'absolute', top: 93, left: 43, color: T.textMuted, fontFamily: T.mono, fontSize: 28 }}>scalar · kilograms</div>
          <div style={{ position: 'absolute', left: 218, top: 190, width: 390, height: 350 }}>
            <div style={{ position: 'absolute', left: 97, top: 40, width: 190, height: 190, borderRadius: 25, background: T.card, border: `4px solid ${T.cyan}`, color: T.ink, display: 'grid', placeItems: 'center', fontFamily: T.mono, fontSize: 42, fontWeight: 900, boxShadow: '0 18px 45px #0008' }}>1 kg</div>
            <div style={{ position: 'absolute', left: 24, top: 230, width: 340, height: 34, borderRadius: '50%', background: T.cardMuted }} />
            <div style={{ position: 'absolute', left: 176, top: 256, width: 34, height: 94, background: T.cardMuted }} />
            <div style={{ position: 'absolute', left: 76, top: 336, width: 234, height: 18, borderRadius: 10, background: T.cardMuted }} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 52, textAlign: 'center', color: T.green, fontSize: 28, fontWeight: 800 }}>same everywhere</div>
        </div>

        <div style={{ position: 'relative', borderRadius: 32, background: `${T.bgDeep}e6`, border: `2px solid ${T.amber}55`, overflow: 'hidden', opacity: weight, transform: `translateX(${(1 - weight) * 30}px)` }}>
          <div style={{ position: 'absolute', top: 35, left: 42, color: T.amber, fontSize: 42, fontWeight: 900 }}>WEIGHT</div>
          <div style={{ position: 'absolute', top: 93, left: 43, color: T.textMuted, fontFamily: T.mono, fontSize: 28 }}>vector · gravitational force</div>

          <div style={{ position: 'absolute', left: interpolate(moon, [0, 1], [138, -300]), top: 255, opacity: 1 - moon }}>
            <Planet />
          </div>
          <div style={{ position: 'absolute', left: interpolate(moon, [0, 1], [620, 138]), top: 255, opacity: moon }}>
            <Planet moon />
          </div>
          <div style={{ position: 'absolute', left: 205, top: 166, width: 112, height: 92, borderRadius: 17, background: T.card, border: `3px solid ${T.cyan}`, color: T.ink, display: 'grid', placeItems: 'center', fontFamily: T.mono, fontSize: 28, fontWeight: 900, zIndex: 4 }}>1 kg</div>
          <div style={{ position: 'absolute', left: 206, top: 258 }}>
            <ForceArrowDown length={interpolate(moon, [0, 1], [165, 74])} opacity={weight} label="W" />
          </div>
          <div style={{ position: 'absolute', left: 125, right: 125, bottom: 39, textAlign: 'center', color: moon > 0.5 ? T.moon : T.cyanSoft, fontFamily: T.mono, fontSize: 28, fontWeight: 900 }}>
            {moon > 0.5 ? 'MOON · smaller weight' : 'EARTH · larger weight'}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 1390, top: 640, zIndex: 8, opacity: newtons, transform: `scale(${0.75 + newtons * 0.25})` }}>
        <WarmCard accent={T.amber} style={{ width: 390, padding: '20px 26px', textAlign: 'center' }}>
          <MathTeX tex="W=mg" fontSize={52} color={T.ink} />
          <div style={{ marginTop: -10, fontFamily: T.mono, color: cardInk(T.amber), fontSize: 28, fontWeight: 850 }}>force measured in N</div>
        </WarmCard>
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S07 — THE CONVERSION LADDER
// ─────────────────────────────────────────────────────────────────────

const PrefixTile: React.FC<{
  at: number;
  y: number;
  name: string;
  symbol: string;
  power: string;
  color: string;
  side?: 'left' | 'right';
}> = ({ at, y, name, symbol, power, color, side = 'left' }) => (
  <SpringIn
    at={at}
    fromX={side === 'left' ? -70 : 70}
    fromY={0}
    style={{ position: 'absolute', left: 245, top: y }}
  >
    <div
      style={{
        width: 620,
        height: 104,
        borderRadius: 22,
        background: `${color}16`,
        border: `2px solid ${color}88`,
        display: 'grid',
        gridTemplateColumns: '185px 1fr 170px',
        alignItems: 'center',
        padding: '0 26px',
        boxShadow: `0 14px 38px #0005, 0 0 24px ${color}14`,
      }}
    >
      <div style={{ color, fontFamily: T.mono, fontSize: 48, fontWeight: 950 }}>{symbol}</div>
      <div style={{ color: T.text, fontSize: 31, fontWeight: 850 }}>{name}</div>
      <div style={{ color, fontFamily: T.mono, fontSize: 31, fontWeight: 900, textAlign: 'right' }}>{power}</div>
    </div>
  </SpringIn>
);

const Scene07: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const factorsAt = spokenAt(scene, 'scale factors');
  const kiloAt = spokenAt(scene, 'Kilo');
  const centiAt = spokenAt(scene, 'Centi');
  const milliAt = spokenAt(scene, 'Milli');
  const nanoAt = spokenAt(scene, 'Nano');
  const targetAt = spokenAt(scene, 'target unit');
  const sixtyAt = spokenAt(scene, 'groups of sixty');
  const kiloMove = useCueProgress(kiloAt, 0.7);
  const centiMove = useCueProgress(centiAt, 0.7);
  const milliMove = useCueProgress(milliAt, 0.7);
  const nanoMove = useCueProgress(nanoAt, 0.7);
  const decimalX = 170 * kiloMove - 250 * centiMove - 50 * milliMove - 80 * nanoMove;
  const target = useCue(targetAt, 0.45);
  const timeRule = useCueSpring(sixtyAt, 26);

  return (
    <LabBackground scene={7} label="conversion ladder">
      <Cued at={factorsAt} fromY={-18} style={{ position: 'absolute', left: 112, top: 122 }}>
        <div style={{ color: T.text, fontSize: 53, fontWeight: 900 }}>
          Prefixes are <span style={{ color: T.cyan }}>scale factors</span>
        </div>
      </Cued>

      <div style={{ position: 'absolute', left: 177, top: 200, width: 66, height: 664 }}>
        <div style={{ position: 'absolute', left: 30, top: 18, bottom: 18, width: 5, borderRadius: 5, background: `linear-gradient(${T.amber}, ${T.cyan})` }} />
        <div style={{ position: 'absolute', top: 0, left: 15, width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderBottom: `27px solid ${T.amber}` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 15, width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: `27px solid ${T.cyan}` }} />
      </div>

      <PrefixTile at={kiloAt} y={205} name="kilo" symbol="k" power="× 10³" color={T.amber} />
      <Cued at={factorsAt} fromScale={0.86} style={{ position: 'absolute', left: 245, top: 326 }}>
        <div style={{ width: 620, height: 104, borderRadius: 22, background: T.card, color: T.ink, border: `3px solid ${T.cardMuted}`, display: 'grid', gridTemplateColumns: '185px 1fr 170px', alignItems: 'center', padding: '0 26px', boxShadow: '0 16px 42px #0006' }}>
          <div style={{ fontFamily: T.mono, color: T.ink, fontSize: 36, fontWeight: 950, whiteSpace: 'nowrap' }}>m · kg</div>
          <div style={{ fontSize: 29, fontWeight: 850 }}>base unit</div>
          <div style={{ fontFamily: T.mono, fontSize: 29, fontWeight: 900, textAlign: 'right' }}>× 10⁰</div>
        </div>
      </Cued>
      <PrefixTile at={centiAt} y={447} name="centi" symbol="c" power="× 10⁻²" color={T.cyanSoft} side="right" />
      <PrefixTile at={milliAt} y={568} name="milli" symbol="m" power="× 10⁻³" color={T.cyan} />
      <PrefixTile at={nanoAt} y={689} name="nano" symbol="n" power="× 10⁻⁹" color="#a9a4ff" side="right" />

      <div style={{ position: 'absolute', left: 1010, top: 243, width: 705, height: 300 }}>
        <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2.2 }}>DECIMAL POSITION</div>
        <WarmCard accent={T.cyan} style={{ marginTop: 23, height: 156, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: 600, height: 100, color: T.ink, fontFamily: T.mono, fontSize: 73, fontWeight: 900, letterSpacing: 20, textAlign: 'center', lineHeight: '100px' }}>
            0001000
            <div style={{ position: 'absolute', left: 300 + decimalX, bottom: 16, width: 16, height: 16, borderRadius: '50%', background: T.amber, boxShadow: `0 0 20px ${T.amber}` }} />
          </div>
        </WarmCard>
        <div style={{ marginTop: 22, color: target.isActive ? T.green : T.textMuted, opacity: target.opacity, fontSize: 29, fontWeight: 800, textAlign: 'center' }}>
          target unit selected ✓
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 1010,
          top: 624,
          width: 705,
          height: 216,
          borderRadius: 26,
          border: `2px solid ${T.amber}88`,
          background: `${T.amber}10`,
          opacity: timeRule,
          transform: `translateY(${(1 - timeRule) * 28}px) scale(${0.9 + timeRule * 0.1})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 33,
        }}
      >
        <div style={{ position: 'relative', width: 128, height: 128, borderRadius: '50%', border: `5px solid ${T.amber}` }}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} style={{ position: 'absolute', left: 60, top: 5, width: 4, height: 14, background: T.amber, transformOrigin: 'center 58px', transform: `rotate(${index * 30}deg)` }} />
          ))}
          <div style={{ position: 'absolute', left: 59, top: 23, width: 6, height: 43, borderRadius: 6, background: T.card, transform: 'rotate(22deg)', transformOrigin: 'bottom' }} />
        </div>
        <div>
          <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 28, letterSpacing: 1.8 }}>TIME IS DIFFERENT</div>
          <div style={{ color: T.text, fontSize: 36, fontWeight: 900, marginTop: 7 }}>minutes → seconds</div>
          <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 31, fontWeight: 900, marginTop: 5 }}>× 60, not × 10</div>
        </div>
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S08 — WORKED CONVERSION: CYCLIST SPEED
// ─────────────────────────────────────────────────────────────────────

const NumberToken: React.FC<{
  at: number;
  children: React.ReactNode;
  color?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ at, children, color = T.ink, suffix, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(at, 0.18);
  const settle = interpolate(frame, [at * fps, (at + 0.68) * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: cue.opacity,
        color: cardInk(color),
        fontFamily: T.mono,
        fontWeight: 950,
        transform: `translateY(${(1 - settle) * -62}px) scale(${1 + (1 - settle) * 0.75})`,
        transformOrigin: 'center bottom',
        textShadow: settle < 1 ? `0 0 25px ${color}66` : 'none',
        ...style,
      }}
    >
      {children}{suffix && <span style={{ fontSize: '0.75em', marginLeft: 7 }}>{suffix}</span>}
    </span>
  );
};

const InlineToken: React.FC<{
  at: number;
  children: React.ReactNode;
  color?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ at, children, color = T.ink, suffix, style }) => {
  const cue = useCue(at, 0.2);
  return (
    <span style={{ display: 'inline-block', opacity: cue.opacity, color: cardInk(color), fontFamily: T.mono, fontWeight: 900, transform: `scale(${0.88 + cue.opacity * 0.12})`, transformOrigin: 'center', ...style }}>
      {children}{suffix && <span style={{ fontSize: '0.75em', marginLeft: 7 }}>{suffix}</span>}
    </span>
  );
};

const Cyclist: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const pedal = frame * 8;
  return (
    <div style={{ position: 'absolute', left: 86 + progress * 470, top: 145, width: 180, height: 150, transform: 'translateY(0px)' }}>
      {[23, 125].map((left) => (
        <div key={left} style={{ position: 'absolute', left, top: 83, width: 58, height: 58, borderRadius: '50%', border: `7px solid ${T.card}`, transform: `rotate(${pedal}deg)` }} />
      ))}
      <div style={{ position: 'absolute', left: 55, top: 73, width: 84, height: 7, background: T.cyan, transform: 'rotate(-12deg)', transformOrigin: 'left' }} />
      <div style={{ position: 'absolute', left: 72, top: 42, width: 7, height: 65, background: T.cyan, transform: 'rotate(37deg)' }} />
      <div style={{ position: 'absolute', left: 84, top: 20, width: 38, height: 56, borderRadius: 20, background: T.amber, transform: 'rotate(20deg)' }} />
      <div style={{ position: 'absolute', left: 104, top: -8, width: 34, height: 34, borderRadius: '50%', background: T.card }} />
    </div>
  );
};

const WorkingRow: React.FC<{
  label: string;
  accent: string;
  at: number;
  children: React.ReactNode;
}> = ({ label, accent, at, children }) => {
  const cue = useCue(at, 0.25);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, paddingBlock: 16, alignItems: 'center', minHeight: 160, borderBottom: `2px solid ${T.ink}16`, opacity: cue.opacity }}>
      <div style={{ color: cardInk(accent), fontSize: 28, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</div>
      <div style={{ color: T.ink, fontFamily: T.mono, fontSize: 38, fontWeight: 800, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
};

const Scene08: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const twoFourAt = spokenAt(scene, 'two point four kilometres');
  const eightAt = spokenAt(scene, '8 minutes');
  const firstAt = spokenAt(scene, 'First');
  const workingTwoFourAt = spokenAt(scene, '2 .4', 2);
  const thousandAt = spokenAt(scene, '1 ,000');
  const twoFourHundredAt = spokenAt(scene, 'two thousand four hundred metres');
  const thenAt = spokenAt(scene, 'Then');
  const workingEightAt = spokenAt(scene, '8', 2);
  const sixtyAt = spokenAt(scene, '60');
  const fourEightyAt = spokenAt(scene, 'four hundred eighty seconds');
  const dividedAt = spokenAt(scene, 'distance divided by time');
  const twoFourHundredAgainAt = spokenAt(scene, '2 ,400', 2);
  const fourEightyAgainAt = spokenAt(scene, '480', 2);
  const fiveAt = spokenAt(scene, 'five metres per second');
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cyclistProgress = interpolate(
    frame,
    [twoFourAt * fps, Math.max(twoFourAt + 0.1, dividedAt) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const formula = useCue(dividedAt, 0.35);
  const heading = useCue(firstAt, 0.3);
  const dial = useCueSpring(fiveAt, 28);
  const distanceTransfer = useCueProgress(workingTwoFourAt, 0.85);
  const timeTransfer = useCueProgress(workingEightAt, 0.85);
  const needleAngle = interpolate(dial, [0, 1], [-112, 18]);

  return (
    <LabBackground scene={8} label="worked conversion">
      <div style={{ position: 'absolute', left: 76, top: 126, width: 750, height: 365, borderRadius: 28, border: `2px solid ${T.cyan}55`, background: `${T.panel}d8`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 36, top: 28, color: T.textMuted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2 }}>CYCLIST DATA</div>
        <Cyclist progress={cyclistProgress} />
        <div style={{ position: 'absolute', left: 58, right: 58, bottom: 57, height: 8, borderRadius: 8, background: `${T.card}66` }} />
        <div style={{ position: 'absolute', left: 54, bottom: 41, width: 4, height: 42, background: T.cyan }} />
        <div style={{ position: 'absolute', right: 54, bottom: 41, width: 4, height: 42, background: T.cyan }} />
      </div>

      <WarmCard accent={T.amber} style={{ position: 'absolute', left: 106, top: 530, width: 680, height: 235, padding: '28px 38px' }}>
        <div style={{ color: '#687680', fontSize: 28, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>given</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 34, fontSize: 56 }}>
          <NumberToken at={twoFourAt} suffix="km" color={T.ink}>2.4</NumberToken>
          <InlineToken at={eightAt} color="#83909a" style={{ fontSize: 35, fontWeight: 500 }}>in</InlineToken>
          <NumberToken at={eightAt} suffix="min" color={T.amber}>8</NumberToken>
        </div>
      </WarmCard>

      <WarmCard accent={T.cyan} style={{ position: 'absolute', left: 862, top: 126, width: 976, height: 706, padding: '30px 44px' }}>
        <div style={{ color: T.ink, fontSize: 30, fontWeight: 900, marginBottom: 10, opacity: heading.opacity }}>Convert, then calculate</div>
        <WorkingRow label="distance" accent={T.cyan} at={firstAt}>
          <InlineToken at={workingTwoFourAt} style={{ background: T.card, borderRadius: 6, boxShadow: distanceTransfer < 1 ? `0 0 0 8px ${T.card}` : undefined, transform: `translate(${(1 - distanceTransfer) * -650}px, ${(1 - distanceTransfer) * 370}px)`, position: 'relative', zIndex: 5 }}>2.4<span style={{ color: '#7b8991', fontWeight: 700 }}> km × </span></InlineToken>
          <InlineToken at={thousandAt} color={T.amber} style={{ marginLeft: 10 }}>1000</InlineToken>
          <InlineToken at={twoFourHundredAt} color="#7b8991" style={{ margin: '0 10px' }}>=</InlineToken>
          <InlineToken at={twoFourHundredAt} color={T.cyan}>2400<span style={{ fontSize: '0.75em' }}> m</span></InlineToken>
        </WorkingRow>
        <WorkingRow label="time" accent={T.amber} at={thenAt}>
          <InlineToken at={workingEightAt} style={{ background: T.card, borderRadius: 6, boxShadow: timeTransfer < 1 ? `0 0 0 8px ${T.card}` : undefined, transform: `translate(${(1 - timeTransfer) * -360}px, ${(1 - timeTransfer) * 170}px)`, position: 'relative', zIndex: 5 }}>8<span style={{ color: '#7b8991', fontWeight: 700 }}> min × </span></InlineToken>
          <InlineToken at={sixtyAt} color={T.amber} style={{ marginLeft: 10 }}>60</InlineToken>
          <InlineToken at={fourEightyAt} color="#7b8991" style={{ margin: '0 10px' }}>=</InlineToken>
          <InlineToken at={fourEightyAt} color={T.cyan}>480<span style={{ fontSize: '0.75em' }}> s</span></InlineToken>
        </WorkingRow>
        <WorkingRow label="speed" accent={T.green} at={dividedAt}>
          <span style={{ opacity: formula.opacity, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.ink }}>v = </span>
            <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
              <InlineToken at={twoFourHundredAgainAt} color={T.cyan} style={{ borderBottom: `3px solid ${T.ink}`, paddingBottom: 7 }}>2400</InlineToken>
              <InlineToken at={fourEightyAgainAt} color={T.amber} style={{ paddingTop: 7 }}>480</InlineToken>
            </span>
            <InlineToken at={fiveAt} color="#7b8991"> = </InlineToken>
            <InlineToken at={fiveAt} color={T.green} suffix="m/s">5</InlineToken>
          </span>
        </WorkingRow>
      </WarmCard>

      <div style={{ position: 'absolute', left: 396, bottom: 78, width: 350, height: 240, opacity: dial, transform: `scale(${0.82 + dial * 0.18})` }}>
        <div style={{ position: 'absolute', left: 25, top: 18, width: 300, height: 150, borderRadius: '300px 300px 0 0', border: `16px solid ${T.cyan}`, borderBottom: 0, background: `${T.bgDeep}dd` }} />
        {[-100, -60, -20, 20, 60, 100].map((angle, index) => (
          <div key={angle} style={{ position: 'absolute', left: 171, top: 45, width: 4, height: 23, background: T.card, transformOrigin: 'center 113px', transform: `rotate(${angle}deg)` }} />
        ))}
        <div style={{ position: 'absolute', left: 172, top: 73, width: 8, height: 94, borderRadius: 8, background: T.amber, transformOrigin: 'bottom', transform: `rotate(${needleAngle}deg)`, boxShadow: `0 0 14px ${T.amber}` }} />
        <div style={{ position: 'absolute', left: 153, top: 146, width: 46, height: 46, borderRadius: '50%', background: T.card, border: `8px solid ${T.amber}` }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -8, textAlign: 'center', color: T.green, fontFamily: T.mono, fontSize: 34, fontWeight: 950 }}>5 m/s</div>
      </div>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S09 — DERIVED UNITS TELL A STORY
// ─────────────────────────────────────────────────────────────────────

const MagneticTile: React.FC<{
  symbol: string;
  label: string;
  color: string;
  at: number;
  x: number;
  y: number;
  fromX: number;
  fromY: number;
}> = ({ symbol, label, color, at, x, y, fromX, fromY }) => (
  <SpringIn at={at} fromX={fromX} fromY={fromY} style={{ position: 'absolute', left: x, top: y }}>
    <WarmCard accent={color} style={{ width: 230, height: 160, display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: cardInk(color), fontFamily: T.mono, fontSize: 69, fontWeight: 950, lineHeight: 1 }}>{symbol}</div>
        <div style={{ color: '#677680', fontSize: 28, fontWeight: 750, marginTop: 8 }}>{label}</div>
      </div>
    </WarmCard>
  </SpringIn>
);

const Scene09: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const derivedAt = spokenAt(scene, 'Derived units');
  const speedAt = spokenAt(scene, 'Metres per second');
  const accelerationAt = spokenAt(scene, 'Metres per second squared');
  const changesAt = spokenAt(scene, 'velocity changes');
  const unitAt = spokenAt(scene, 'unit');
  const speed = useCueSpring(speedAt, 27);
  const acceleration = useCueSpring(accelerationAt, 27);
  const arrowProgress = useCueProgress(changesAt, 1.2);

  return (
    <LabBackground scene={9} label="derived units">
      <Cued at={derivedAt} fromY={-18} style={{ position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center' }}>
        <div style={{ color: T.text, fontSize: 54, fontWeight: 900 }}>
          Derived units <span style={{ color: T.cyan }}>tell a story</span>
        </div>
      </Cued>

      <div style={{ position: 'absolute', left: 115, top: 257, width: 800, height: 560 }}>
        <div style={{ position: 'absolute', left: 282, top: 235, width: 230 + acceleration * 256, height: 6, borderRadius: 8, background: `${T.cyan}77`, opacity: speed }} />
        <MagneticTile symbol="m" label="distance" color={T.cyan} at={speedAt} x={282 + acceleration * 128} y={38} fromX={-180} fromY={-80} />
        <MagneticTile symbol="s" label="time" color={T.amber} at={speedAt} x={282} y={292} fromX={180} fromY={100} />
        <div style={{ position: 'absolute', left: 516, top: 346, color: T.amber, fontSize: 32, opacity: acceleration }}>×</div>
        <MagneticTile symbol="s" label="time again" color={T.amber} at={accelerationAt} x={538} y={292} fromX={190} fromY={0} />

        <div style={{ position: 'absolute', left: 12, top: 170, width: 206, opacity: speed, transform: `translateX(${(1 - speed) * -30}px)` }}>
          <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2 }}>SPEED</div>
          <div style={{ color: T.cyan, fontFamily: T.mono, fontSize: 45, fontWeight: 950, marginTop: 8 }}>m / s</div>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 470, width: 430, opacity: acceleration, transform: `translateX(${(1 - acceleration) * 30}px)` }}>
          <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2 }}>ACCELERATION</div>
          <div style={{ color: T.amber, fontFamily: T.mono, fontSize: 45, fontWeight: 950, marginTop: 8 }}>m / s²</div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 1010, top: 285, width: 735, height: 420, borderRadius: 30, border: `2px solid ${T.cyan}55`, background: `${T.panel}c9`, padding: '34px 42px' }}>
        <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2 }}>VELOCITY CHANGE / EACH SECOND</div>
        <div style={{ position: 'relative', marginTop: 54, height: 230 }}>
          {[0, 1, 2, 3, 4].map((index) => {
            const local = Math.max(0, Math.min(1, arrowProgress * 5 - index));
            return (
              <div key={index} style={{ position: 'absolute', left: index * 120, top: 150 - index * 27, opacity: local }}>
                <MeasurementArrow width={60 + index * 20} color={index < 2 ? T.cyanSoft : T.cyan} progress={local} thickness={6} />
                <div style={{ position: 'absolute', left: 0, top: 40 + index * 27, color: T.textMuted, fontFamily: T.mono, fontSize: 28 }}>t{index + 1}</div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, borderRadius: 5, background: `${T.card}44` }} />
        </div>
      </div>

      <Cued at={unitAt} fromScale={0.84} style={{ position: 'absolute', left: 535, right: 535, bottom: 110 }}>
        <div style={{ borderRadius: 22, padding: '20px 34px', background: `${T.green}16`, border: `2px solid ${T.green}88`, color: T.text, textAlign: 'center', fontSize: 30, fontWeight: 850 }}>
          Read the unit → read the behaviour
        </div>
      </Cued>
    </LabBackground>
  );
};

// ─────────────────────────────────────────────────────────────────────
// S10 — RECAP
// ─────────────────────────────────────────────────────────────────────

const RecapCard: React.FC<{
  at: number;
  x: number;
  y: number;
  symbol: string;
  quantity: string;
  color: string;
  fromX: number;
  fromY: number;
}> = ({ at, x, y, symbol, quantity, color, fromX, fromY }) => (
  <SpringIn at={at} fromX={fromX} fromY={fromY} style={{ position: 'absolute', left: x, top: y }}>
    <WarmCard accent={color} style={{ width: 310, height: 172, display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: cardInk(color), fontFamily: T.mono, fontSize: 67, lineHeight: 1, fontWeight: 950 }}>{symbol}</div>
        <div style={{ color: T.ink, fontSize: 28, fontWeight: 850, marginTop: 13 }}>{quantity}</div>
      </div>
    </WarmCard>
  </SpringIn>
);

const ChecklistItem: React.FC<{ at: number; label: string; index: number }> = ({ at, label, index }) => {
  const progress = useCueSpring(at, 21);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 19, opacity: progress, transform: `translateX(${(1 - progress) * 34}px)`, marginBottom: 26 }}>
      <div style={{ width: 53, height: 53, borderRadius: 15, display: 'grid', placeItems: 'center', background: T.green, color: T.bgDeep, fontSize: 31, fontWeight: 950, boxShadow: `0 0 22px ${T.green}44` }}>✓</div>
      <div>
        <div style={{ color: T.textMuted, fontFamily: T.mono, fontSize: 28, letterSpacing: 2 }}>0{index}</div>
        <div style={{ color: T.text, fontSize: 33, fontWeight: 850 }}>{label}</div>
      </div>
    </div>
  );
};

const Scene10: React.FC<{ scene: MechanicsTranscriptScene }> = ({ scene }) => {
  const recapAt = spokenAt(scene, 'Quick recap');
  const metresAt = spokenAt(scene, 'metres');
  const secondsAt = spokenAt(scene, 'seconds');
  const kilogramsAt = spokenAt(scene, 'kilograms');
  const massWeightAt = spokenAt(scene, 'Mass is not weight');
  const convertAt = spokenAt(scene, 'Convert');
  const calculateAt = spokenAt(scene, 'calculate');
  const unitAt = spokenAt(scene, 'final unit');
  const marksAt = spokenAt(scene, 'saves marks');
  const metre = useCueSpring(metresAt, 24);
  const second = useCueSpring(secondsAt, 24);
  const kilogram = useCueSpring(kilogramsAt, 24);
  const linksOpacity = Math.min(metre, second, kilogram);
  const weight = useCueSpring(massWeightAt, 24);
  const complete = useCueSpring(marksAt, 30);

  return (
    <LabBackground scene={10} label="recap">
      <Cued at={recapAt} fromY={-18} style={{ position: 'absolute', left: 0, right: 0, top: 112, textAlign: 'center' }}>
        <div style={{ color: T.text, fontSize: 53, fontWeight: 900 }}>
          The mechanics <span style={{ color: T.cyan }}>S.I. triangle</span>
        </div>
      </Cued>

      <div style={{ position: 'absolute', left: 92, top: 192, width: 1110, height: 680 }}>
        <svg width="1110" height="650" style={{ position: 'absolute', inset: 0, opacity: linksOpacity }}>
          <path d="M555 120 L270 455 L840 455 Z" fill="none" stroke={T.cyan} strokeWidth="7" strokeLinejoin="round" strokeDasharray="14 12" />
        </svg>
        <RecapCard at={metresAt} x={400} y={34} symbol="m" quantity="length" color={T.cyan} fromX={0} fromY={-100} />
        <RecapCard at={secondsAt} x={115} y={377} symbol="s" quantity="time" color={T.cyanSoft} fromX={-110} fromY={80} />
        <RecapCard at={kilogramsAt} x={685} y={377} symbol="kg" quantity="mass" color={T.amber} fromX={110} fromY={80} />

        <div style={{ position: 'absolute', left: 1040, top: 394, opacity: weight, transform: `translateX(${(1 - weight) * 44}px)` }}>
          <ForceArrowDown length={118} opacity={weight} label="W" />
          <div style={{ position: 'absolute', left: -20, top: 157, width: 150, color: T.amber, fontFamily: T.mono, fontSize: 28, fontWeight: 900, textAlign: 'center' }}>newtons</div>
        </div>
        <div style={{ position: 'absolute', left: 1005, top: 330, opacity: weight, color: T.red, fontSize: 47, fontWeight: 950 }}>≠</div>
      </div>

      <div style={{ position: 'absolute', right: 90, top: 243, width: 525, height: 514, padding: '35px 38px', borderRadius: 30, background: `${T.panel}e3`, border: `2px solid ${T.green}55`, boxShadow: '0 20px 55px #0006' }}>
        <div style={{ color: T.green, fontFamily: T.mono, fontSize: 28, letterSpacing: 2.2, marginBottom: 34 }}>FINAL CHECK</div>
        <ChecklistItem at={convertAt} label="convert" index={1} />
        <ChecklistItem at={calculateAt} label="calculate" index={2} />
        <ChecklistItem at={unitAt} label="check the unit" index={3} />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 157,
          bottom: 100,
          width: 392,
          height: 126,
          borderRadius: 22,
          background: T.green,
          color: T.bgDeep,
          opacity: complete,
          transform: `rotate(-3deg) scale(${0.65 + complete * 0.35})`,
          display: 'grid',
          placeItems: 'center',
          boxShadow: `0 0 42px ${T.green}55`,
          fontFamily: T.mono,
          fontSize: 33,
          fontWeight: 950,
          letterSpacing: 1.5,
        }}
      >
        MARKS SAVED ✓
      </div>
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

export const MechanicsSIUnits: React.FC<MechanicsSIUnitsProps> = ({ audioEnabled = true }) => {
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

export default MechanicsSIUnits;
