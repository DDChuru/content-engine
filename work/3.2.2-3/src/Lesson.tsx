/** 3.2.2-3 frame router and lesson chrome (house style from 2.1.1: header strip, title, MODEL line, caption bar).
 * Scene lookup by INTEGER frames. Unauthored beats throw. No logo, progress bar, timer or beat counter. */
import React from 'react';
import T from '../timeline.json';
import {BRAND as C, BODY} from './shared/theme';
import {Txt} from './shared/Type';
import {ErrorMarker, ErrorLabel} from './shared/ErrorMarker';
import {BEATS} from './beats';

export const TITLES = [
  'A tablet, one enzyme, two numbers', 'What you will be able to do', 'The curve, and Vmax from the plateau',
  'One number for affinity: Km', 'The construction: Vmax, half it, across, down', 'Estimate Km: a right number, a bare graph',
  'What Km tells you: the eager enzyme', 'Three enzymes, each from its own ½Vmax', 'Putting three enzymes in order of affinity',
  'The same enzyme, with and without an inhibitor', 'Competitive: in the active site', 'Non-competitive: another site',
  'Sketching the competitive curve', 'The sentences you write, clause by clause', 'What I told you, on the graph and the model',
  'How it is asked, and the reject card', 'The real question, and the tablet',
];

/** Error beats: badge label from the evidence (qa/decisions.md), and the correction boundary: the marker holds
 * until the in-place correction has COMPLETED (correct cue frame + animFrames), i.e. the last fault is fixed. */
export const ERROR_BEATS: Record<number, {label: ErrorLabel; correctKey: string; animFrames: number}> = {
  6: {label: 'COMMON MISTAKE', correctKey: 'correct', animFrames: 18},
  9: {label: 'COMMON MISTAKE', correctKey: 'correct', animFrames: 18},
  13: {label: 'COMMON MISTAKE', correctKey: 'correct', animFrames: 54},
};
export const ERROR_LABEL: Record<number, string> = Object.fromEntries(Object.entries(ERROR_BEATS).map(([k, v]) => [k, v.label]));

export function stateAt(frame: number) {
  const sc: any = (T as any).scenes.find((s: any) => frame >= s.startFrame && frame < s.startFrame + s.frames) || (T as any).scenes[(T as any).scenes.length - 1];
  const k = frame - sc.startFrame;
  const local = k / 30;
  let ci = 0;
  for (let i = 0; i < sc.cues.length; i++) if (k >= Math.ceil(sc.cues[i].localTime * 30 - 1e-9)) ci = i;
  const at: Record<string, number> = {};
  for (const c of sc.cues) at[c.key] = Math.ceil(c.localTime * 30 - 1e-9) / 30;
  const a = (key: string) => (key in at ? local - at[key] : -1e9);
  return {sc, ci, cue: sc.cues[ci], local, k, frame, at, a};
}
export type S = ReturnType<typeof stateAt>;

export function isError(s: S) {
  const e = ERROR_BEATS[s.sc.id];
  if (!e) return false;
  const c = s.sc.cues.find((x: any) => x.key === e.correctKey);
  if (!c) throw Error('Missing correction cue in beat ' + s.sc.id);
  return s.k < Math.ceil(c.localTime * 30 - 1e-9) + e.animFrames;
}
/** Frames since the correction cue (negative before it), for beats that animate the in-place fix. */
export const sinceCorrect = (s: S) => s.k - Math.ceil(s.at['correct'] * 30 - 1e-9);

export function Lesson({frame = 0}: {frame: number}) {
  const s = stateAt(frame);
  const Beat = (BEATS as any)[s.sc.id];
  if (!Beat) throw Error(`Beat ${s.sc.id} not authored: do not render it.`);
  const dark = s.sc.id === 2;
  const caption = s.cue.caption;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={1920} height={1080} viewBox="0 0 1920 1080" style={{fontFamily: BODY}}>
      <rect width={1920} height={1080} fill={dark ? C.ink : C.warm} />
      <Txt x={70} y={44} size={22} fill={dark ? C.accent : C.muted}>BIOLOGY 9700 · 3.2.2–3.2.3 · VMAX, KM AND INHIBITORS</Txt>
      <Txt x={70} y={111} size={43} weight={700} fill={dark ? C.warm : C.ink}>{TITLES[s.sc.id - 1]}</Txt>
      {!dark && <Txt x={72} y={166} size={20} fill={C.muted}>MODEL — schematic graphs and enzyme drawings; our values unless a source is cited</Txt>}
      <Beat {...s} />
      <line x1={70} y1={959} x2={1850} y2={959} stroke={dark ? C.muted : C.line} strokeWidth={2} />
      <rect x={70} y={984} width={7} height={54} rx={3} fill={C.primary} />
      <Txt x={100} y={1020} size={29} fill={dark ? C.warm : C.ink}>{caption}</Txt>
      <ErrorMarker on={isError(s)} label={ERROR_BEATS[s.sc.id]?.label} />
    </svg>
  );
}
