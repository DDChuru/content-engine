import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import fableDrawing from '../public/ink/q2.json';
import opusDrawing from '../public/ink/q2-opus.json';
import solDrawing from '../public/ink/q2-sol.json';
import astraDrawing from '../public/ink/q2-astra.json';

/** Which model's hand wrote the page. Same script and narration for all of them. */
export type Hand = 'fable' | 'opus' | 'sol' | 'astra';
const DRAWINGS: Record<Hand, { strokes: Stroke[] }> = {
  fable: fableDrawing as { strokes: Stroke[] },
  opus: opusDrawing as { strokes: Stroke[] },
  sol: solDrawing as { strokes: Stroke[] },
  astra: astraDrawing as { strokes: Stroke[] },
};
import timing from '../public/ink/q2-timing.json';

type Stroke = { group: string; d: string };

/**
 * InkTutorTikTok — a handwritten worked solution that writes itself under narration.
 * The strokes come from the ink tutor (apps/student-learn public/ink/q2.json); each group of
 * strokes starts when its narration beat starts and is paced to finish as the sentence ends.
 * Narration drives everything: no captions, no fixed keyframes.
 */

type Beat = { id: string; text: string; start: number; duration: number };

const PAPER = '#fdfcf7';
const RULE = '#b9d3ee';
const MARGIN = '#e8a0a0';
const INK = '#1a2a6c';
const RED = '#c0392b';
const RED_GROUPS = new Set(['answer', 'annot']);

/** Rough pen-path length: sum of distances between consecutive coordinate pairs. */
function pathLength(d: string): number {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let len = 0;
  for (let i = 2; i + 1 < nums.length; i += 2) {
    len += Math.hypot(nums[i] - nums[i - 2], nums[i + 1] - nums[i - 1]);
  }
  return Math.max(len, 8);
}

type Scheduled = Stroke & { start: number; duration: number; length: number };

/** Lay every stroke on the narration timeline: a group's strokes share its beat, written in order. */
function schedule(strokes: Stroke[], beats: Beat[]): Scheduled[] {
  const byGroup = new Map<string, Stroke[]>();
  strokes.forEach((s) => byGroup.set(s.group, [...(byGroup.get(s.group) ?? []), s]));
  const out: Scheduled[] = [];
  for (const beat of beats) {
    const group = byGroup.get(beat.id);
    if (!group) continue;
    const lengths = group.map((s) => pathLength(s.d));
    const total = lengths.reduce((a, b) => a + b, 0);
    const gap = 0.04;
    const writing = Math.max(beat.duration * 0.85 - gap * group.length, 0.6);
    const speed = total / writing; // px per second, so the pen lands with the sentence
    let t = beat.start + 0.15;
    group.forEach((s, i) => {
      const duration = lengths[i] / speed;
      out.push({ ...s, start: t, duration, length: lengths[i] });
      t += duration + gap;
    });
  }
  return out;
}

const Paper: React.FC<{ strokes: Scheduled[]; t: number }> = ({ strokes, t }) => (
  <svg viewBox="40 60 700 520" width={1040} height={773} style={{ borderRadius: 24, background: PAPER }}>
    <g stroke={RULE} strokeWidth={1}>
      {Array.from({ length: 14 }, (_, i) => 60 + i * 40).map((y) => (
        <path key={y} d={`M0 ${y}H800`} />
      ))}
    </g>
    <path d="M60 0V600" stroke={MARGIN} strokeWidth={1.2} />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {strokes.map((s, i) => {
        const progress = interpolate(t, [s.start, s.start + s.duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        if (progress <= 0) return null;
        const red = RED_GROUPS.has(s.group);
        return (
          <path
            key={i}
            d={s.d}
            stroke={red ? RED : INK}
            strokeWidth={red ? 2.6 : 3.2}
            strokeDasharray={s.length}
            strokeDashoffset={s.length * (1 - progress)}
          />
        );
      })}
    </g>
  </svg>
);

export interface InkTutorTikTokProps {
  audioEnabled: boolean;
  hand: Hand;
}

export const InkTutorTikTok: React.FC<InkTutorTikTokProps> = ({ audioEnabled, hand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const beats = timing.beats as Beat[];
  const strokes = useMemo(() => schedule(DRAWINGS[hand].strokes, beats), [beats, hand]);

  const hook = beats.find((b) => b.id === 'hook');
  const hookEnd = hook ? hook.start + hook.duration : 0;
  // Title holds through the hook, then folds away as the pen starts.
  const titleOpacity = interpolate(t, [0, 0.4, hookEnd, hookEnd + 0.5], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const paperY = interpolate(t, [hookEnd, hookEnd + 0.6], [140, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chipOpacity = interpolate(t, [0.2, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outro = beats[beats.length - 1];
  const outroOpacity = outro
    ? interpolate(t, [outro.start + 2.2, outro.start + 2.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f1a2e 0%, #16233b 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {audioEnabled ? <Audio src={staticFile('audio/ink/q2-narration.mp3')} /> : null}

      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 120, opacity: chipOpacity }}>
        <div
          style={{
            padding: '14px 28px',
            borderRadius: 999,
            border: '2px solid rgba(255,255,255,0.18)',
            color: '#cfe3ff',
            fontSize: 30,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          9709 · Differentiation
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: titleOpacity }}>
        <div style={{ color: '#fff', fontSize: 108, fontWeight: 800, textAlign: 'center', lineHeight: 1.05, padding: '0 80px' }}>
          Bracket to a power?
        </div>
        <div style={{ color: '#ffb4a8', fontSize: 52, fontWeight: 600, marginTop: 28 }}>Chain rule. Watch the pen.</div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateY(${paperY + 40}px)`, opacity: 1 - titleOpacity }}>
        <div style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.45)', borderRadius: 24 }}>
          <Paper strokes={strokes} t={t} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 200, opacity: outroOpacity }}>
        <div style={{ color: '#fff', fontSize: 46, fontWeight: 700 }}>Follow for the next one</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export function getInkTutorTikTokDuration(fps: number): number {
  return Math.ceil((timing.total + 1.2) * fps);
}
