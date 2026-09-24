/** 3.1.1-2 frame router and lesson chrome (house style of the 2.1.1 reference build).
 * Scene lookup by INTEGER frames. Unauthored beats throw. */
import React from 'react';
import T from '../timeline.json';
import {BRAND as C, BODY} from '../shared/src/theme';
import {Txt} from '../shared/src/Type';
import {ErrorMarker, ErrorLabel} from '../shared/src/ErrorMarker';
import {BEATS} from './beats';
import {hydrolyseAudit} from './Chem';

export const TITLES = [
  'Bread that turns sweet', 'What you will be able to do', 'A globular protein, and a catalyst',
  'Inside the cell, or secreted to work outside', 'The wrong prefix', 'The fold, and the active site',
  'Specificity: complementary, not the same shape', 'Held in place: the enzyme–substrate complex',
  'Inside the complex: the reaction, and the enzyme goes again', 'Why it is faster: activation energy',
  'The sentence that answers every question except this one', 'The lock-and-key hypothesis',
  'The induced-fit hypothesis', 'Two names glued together', 'The sentence you write',
  'The labels on the drawing', 'What I told you, read off the model', 'How it is asked, with the real question',
];

/** Error beats. Badge from the evidence (every one here is diagnosed by an examiner report: ECR Paper 2
 * pp.10 and 54; June 2024 ER pp.12 and 15) → COMMON MISTAKE. The marker holds from the beat's first frame
 * to `clearKey`'s cue frame + animFrames: the storyboard's exit cue for B5, B11, B14; for B16 the frame on
 * which the LAST in-place correction is complete. */
export const ERROR_BEATS: Record<number, {label: ErrorLabel; clearKey: string; animFrames: number}> = {
  5: {label: 'COMMON MISTAKE', clearKey: 'exit', animFrames: 0},
  11: {label: 'COMMON MISTAKE', clearKey: 'exit', animFrames: 0},
  14: {label: 'COMMON MISTAKE', clearKey: 'exit', animFrames: 0},
  16: {label: 'COMMON MISTAKE', clearKey: 'fix3', animFrames: 18},
};
export const ERROR_LABEL: Record<number, string> = Object.fromEntries(Object.entries(ERROR_BEATS).map(([k, v]) => [k, v.label]));
/** Per-frame audits run by the renderer (valence audit on every rendered state of the covalent change). */
export const audits: Record<number, (s: any) => any> = {9: (s: any) => hydrolyseAudit(s)};

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

export function clearFrame(sc: any) {
  const e = ERROR_BEATS[sc.id];
  const c = sc.cues.find((x: any) => x.key === e.clearKey);
  if (!c) throw Error('Missing clear cue in beat ' + sc.id);
  return Math.ceil(c.localTime * 30 - 1e-9) + e.animFrames;
}
export function isError(s: S) {
  if (!ERROR_BEATS[s.sc.id]) return false;
  return s.k < clearFrame(s.sc);
}

export function Lesson({frame = 0}: {frame: number}) {
  const s = stateAt(frame);
  const Beat = (BEATS as any)[s.sc.id];
  if (!Beat) throw Error(`Beat ${s.sc.id} not authored: do not render it.`);
  const dark = s.sc.id === 2;
  const caption = s.cue.caption;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={1920} height={1080} viewBox="0 0 1920 1080" style={{fontFamily: BODY}}>
      <rect width={1920} height={1080} fill={dark ? C.ink : C.warm} />
      <Txt x={70} y={44} size={22} fill={dark ? C.accent : C.muted}>BIOLOGY 9700 · 3.1.1 AND 3.1.2 · ENZYMES: WHERE AND HOW THEY ACT</Txt>
      <Txt x={70} y={111} size={43} weight={700} fill={dark ? C.warm : C.ink}>{TITLES[s.sc.id - 1]}</Txt>
      {!dark && <Txt x={72} y={170} size={20} fill={C.muted}>MODEL — every enzyme and substrate is drawn schematic; not a real protein shape</Txt>}
      <Beat {...s} />
      <line x1={70} y1={959} x2={1850} y2={959} stroke={dark ? C.muted : C.line} strokeWidth={2} />
      <rect x={70} y={984} width={7} height={54} rx={3} fill={C.primary} />
      <Txt x={100} y={1020} size={29} fill={dark ? C.warm : C.ink}>{caption}</Txt>
      <ErrorMarker on={isError(s)} label={ERROR_BEATS[s.sc.id]?.label} />
    </svg>
  );
}
