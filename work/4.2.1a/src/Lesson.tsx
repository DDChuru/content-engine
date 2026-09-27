/** 4.2.1a frame router and lesson chrome (house style of the 2.1.1 reference build).
 * Scene lookup by INTEGER frames. Unauthored beats throw. */
import React from 'react';
import T from '../timeline.json';
import {BRAND as C, BODY} from '../shared/src/theme';
import {Txt} from '../shared/src/Type';
import {ErrorMarker, ErrorLabel} from '../shared/src/ErrorMarker';
import {BEATS} from './beats';

export const TITLES = [
  'How does sugar get into a cell?', 'What you will be able to do', 'Random movement, net movement',
  'Equal, but still moving; and why passive matters', 'Simple diffusion: straight through the bilayer', 'What makes net diffusion faster',
  'Turned back at the core: why some need a protein', 'A channel protein: a door in a wall', 'A carrier protein: glucose, down its gradient, no ATP',
  'Common mistake: glucose "too large"', 'Water potential: a measure for water', 'Osmosis: net movement of water, and equality',
  'What I told you, on the membrane and the water model', 'How it is asked, the reject card, and the sugar',
];

/** Error beats: E45 in Beat 10, badge COMMON MISTAKE (basis: examiner-report diagnosis, June 2023 report p.12,
 * Paper 21 Q3(a)). On from the beat's first frame; clears on the completed correct frame: the END of "such as a
 * carrier" (cue key `exit`) + 6 frames for the last words to land. */
export const ERROR_BEATS: Record<number, {label: ErrorLabel; clearKey: string; animFrames: number}> = {10: {label: 'COMMON MISTAKE', clearKey: 'exit', animFrames: 6}};
export const ERROR_LABEL: Record<number, string> = {10: 'COMMON MISTAKE'};
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
      <Txt x={70} y={44} size={22} fill={dark ? C.accent : C.muted}>BIOLOGY 9700 · 4.2.1a · PASSIVE TRANSPORT</Txt>
      <Txt x={70} y={111} size={43} weight={700} fill={dark ? C.warm : C.ink}>{TITLES[s.sc.id - 1]}</Txt>
      {!dark && <Txt x={72} y={170} size={20} fill={C.muted}>MODEL — membranes, molecules and particles are schematic drawings; not to scale; counts are illustrative</Txt>}
      <Beat {...s} />
      <line data-role="decor" x1={70} y1={959} x2={1850} y2={959} stroke={dark ? C.muted : C.line} strokeWidth={2} />
      <rect data-role="decor" x={70} y={984} width={7} height={54} rx={3} fill={C.primary} />
      <Txt x={100} y={1020} size={29} fill={dark ? C.warm : C.ink}>{caption}</Txt>
      <ErrorMarker on={isError(s)} label={ERROR_BEATS[s.sc.id]?.label} />
    </svg>
  );
}
