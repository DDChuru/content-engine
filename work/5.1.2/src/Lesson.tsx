/** 5.1.2 frame router and lesson chrome (house style of the 2.1.1 reference build).
 * Scene lookup by INTEGER frames. Unauthored beats throw. */
import React from 'react';
import T from '../timeline.json';
import {BRAND as C, BODY} from '../shared/src/theme';
import {Txt} from '../shared/src/Type';
import {ErrorMarker, ErrorLabel} from '../shared/src/ErrorMarker';
import {BEATS} from './beats';

export const TITLES = ['Hook and context', 'What you will be able to do', 'Recall: copy in S, share in anaphase',
  'Why the daughter nuclei are identical', 'E5-06: the result, not the reason', 'Growth: new cells with the same genes',
  'Replacement and repair', 'Asexual reproduction: a clone from one parent', 'What I told you, on the chain and the strip',
  'How it is asked, and the reject card'];

/** Error beat (SHARED-SPECS §8): E5-06 in Beat 5, EXAM CONTRAST (a real question, w22_23 Q4(b); no examiner report on
 * how often). The marker holds until the completed correct frame: clearKey = the cue at the end of the corrected
 * answer's last clause; animFrames = frames of the final write after that cue. */
export const ERROR_BEATS: Record<number, {label: ErrorLabel; clearKey: string; animFrames: number}> = {
  5: {label: 'EXAM CONTRAST', clearKey: 'done', animFrames: 12},
};
export const ERROR_LABEL: Record<number, string> = {5: 'EXAM CONTRAST'};
export const audits: Record<number, (s: any) => any> = {};

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
      <rect data-role="decor" width={1920} height={1080} fill={dark ? C.ink : C.warm} />
      <Txt x={70} y={44} size={22} fill={dark ? C.accent : C.muted}>BIOLOGY 9700 · 5.1.2 · WHY MITOSIS MAKES IDENTICAL CELLS</Txt>
      <Txt x={70} y={111} size={43} weight={700} fill={dark ? C.warm : C.ink}>{TITLES[s.sc.id - 1]}</Txt>
      {!dark && <Txt x={72} y={170} size={20} fill={C.muted}>MODEL — cells, chromosomes, tissues and plants are schematic drawings; not to scale; not measured data</Txt>}
      <Beat {...s} />
      <line data-role="decor" x1={70} y1={959} x2={1850} y2={959} stroke={dark ? C.muted : C.line} strokeWidth={2} />
      <rect data-role="decor" x={70} y={984} width={7} height={54} rx={3} fill={C.primary} />
      <Txt x={100} y={1020} size={29} fill={dark ? C.warm : C.ink}>{caption}</Txt>
      <ErrorMarker on={isError(s)} label={ERROR_BEATS[s.sc.id]?.label} />
    </svg>
  );
}
