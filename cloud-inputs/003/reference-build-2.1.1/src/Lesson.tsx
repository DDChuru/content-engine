/** 2.1.1 frame router and lesson chrome. Scene lookup by INTEGER frames. Unauthored beats throw. */
import React from 'react';
import T from '../timeline.json';
import {BRAND as C, BODY, clamp01} from '../../shared/src/theme';
import {Txt} from '../../shared/src/Type';
import {SwatchDefs} from '../../shared/src/Swatch';
import {ErrorMarker, ErrorLabel} from '../../shared/src/ErrorMarker';
import {PinnedCOI} from './Panels';
import {BEATS} from './beats';

export const TITLES = [
  'Four clear liquids', 'Why this one is on you', 'What you will be able to do',
  'Conditions → observation → inference', 'The bench: name everything first',
  "Benedict's 1: measured, in excess", "Benedict's 2: heat in a water bath", "Benedict's 3: reading the result",
  "Benedict's 4: controls and meaning", 'Iodine test for starch', 'Emulsion test 1: ethanol first',
  'Emulsion test 2: into water', 'Biuret test 1: reagents and order', 'Biuret test 2: reading violet',
  'Recording: the results table', 'A mixture: fresh portions, all tests', 'Colour matching: how precise?',
  'Checks before conclusions', 'What I told you, on the bench', 'How it is asked',
];

/** Error beats: badge label from the evidence (see qa/decisions.md), and the correction boundary:
 * the marker holds until the in-place replacement has COMPLETED (cue frame + animFrames). */
export const ERROR_BEATS: Record<number, {label: ErrorLabel; correctKey: string; animFrames: number}> = {
  17: {label: 'EXAM CONTRAST', correctKey: 'correct', animFrames: 18},
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

export function Lesson({frame = 0}: {frame: number}) {
  const s = stateAt(frame);
  const Beat = (BEATS as any)[s.sc.id];
  if (!Beat) throw Error(`Beat ${s.sc.id} not authored: do not render it.`);
  const dark = s.sc.id === 3;
  const pin = s.sc.id >= 5 ? (Beat.pin ? Beat.pin(s) : '') : null;
  const caption = s.cue.caption;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={1920} height={1080} viewBox="0 0 1920 1080" style={{fontFamily: BODY}}>
      <SwatchDefs />
      <rect width={1920} height={1080} fill={dark ? C.ink : C.warm} />
      <Txt x={70} y={44} size={22} fill={dark ? C.accent : C.muted}>BIOLOGY 9700 · 2.1.1 · THE FOUR FOOD TESTS</Txt>
      <Txt x={70} y={111} size={43} weight={700} fill={dark ? C.warm : C.ink}>{TITLES[s.sc.id - 1]}</Txt>
      {!dark && <Txt x={72} y={170} size={20} fill={C.muted}>MODEL — drawn, not a photograph · every colour is a labelled model</Txt>}
      {pin !== null && <PinnedCOI hi={pin} />}
      <Beat {...s} />
      <line x1={70} y1={959} x2={1850} y2={959} stroke={dark ? C.muted : C.line} strokeWidth={2} />
      <rect x={70} y={984} width={7} height={54} rx={3} fill={C.primary} />
      <Txt x={100} y={1020} size={29} fill={dark ? C.warm : C.ink}>{caption}</Txt>
      <ErrorMarker on={isError(s)} label={ERROR_BEATS[s.sc.id]?.label} />
    </svg>
  );
}
