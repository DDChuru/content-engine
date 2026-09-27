import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, SCHEM, clamp01, CUE, BSTART, BEND, MemScene, memGeo, memM, winState} from '../kit';
import {WPM, wpmGeo, WPMFrame, sucrosePts, SucroseTokens, Dropper, WPScale} from '../WaterPotentialModel';
import {fieldState, FieldTokens, CounterCard, windowEvents, Ev} from '../DiffusionField';
import {b9} from './Beat09';

/** Dataset 3 windows (global start, left→right, right→left): one unequal window at Beat 12's `count` (15 · 9);
 * no crossing is drawn from its end until the potentials are equal; then balanced 12 · 12 windows from `equal` to
 * the end of the lesson (the window running at the Beat 12/13 boundary continues into Beat 13). */
export function wpmWindows(): [number, number, number][] {
  const w: [number, number, number][] = [[CUE(12, 'count'), 15, 9]];
  const e = CUE(12, 'equal'), end = BEND(14);
  for (let k = 0; e + 5 * k + 5 <= end + 5; k++) w.push([e + 5 * k, 12, 12]);
  return w;
}
export const wpmEvents = (): Ev[] => wpmWindows().flatMap(([t0, f, r], i) => windowEvents(t0, f, r, 5, 120 + i));
export const wpmWater = (t: number) => fieldState({G: wpmGeo(WPM), nA: 40, nB: 40, evs: wpmEvents(), t, origin: BSTART(11), seed: 111, speed: 0.9});
/** Sucrose drops: 4 left at `left`, 12 right at `right` (Beat 11), 8 more left at `add` (Beat 12). */
export function spawns() {
  const xs = (x0: number, n: number, w: number) => Array.from({length: n}, (_, k) => x0 + ((k * 0.618) % 1) * w);
  const L = WPM.x + 60, R = WPM.x + WPM.w / 2 + 60, W = WPM.w / 2 - 150;
  const out: any[] = [];
  xs(L, 4, W).forEach((x, k) => out.push({t: CUE(11, 'left') + 0.3 + k * 0.35, side: 0, x}));
  xs(R, 12, W).forEach((x, k) => out.push({t: CUE(11, 'right') + 0.2 + k * 0.18, side: 1, x}));
  xs(L + 30, 8, W).forEach((x, k) => out.push({t: CUE(12, 'add') + 0.2 + k * 0.22, side: 0, x}));
  return out;
}
/** Marker depths (0 = 0 kPa reference; unnumbered, order only): each landed sucrose token lowers its side. */
export function depths(t: number) {
  let l = 0, r = 0;
  for (const sp of spawns()) if (t >= sp.t + 0.9) { if (sp.side === 0) l++; else r++; }
  const d = (n: number) => 0.066 * n;
  return [d(l), d(r)];
}
export const SCALE = {x: 1330, y0: 350, y1: 700};
/** The whole water-potential layout (model + scale + captions); `lab` = caption opacities. */
export function WPMLayout({t, s, oScale = {}, labels = {}, hiL = 0, hiR = 0, water, sucr, ring = 0, captions = true}: any) {
  const [dl, dr] = depths(t);
  return (
    <g>
      <WPMFrame t={t} ring={ring} />
      <FieldTokens st={water} k="water" t={t} />
      <SucroseTokens pts={sucr} t={t} hi={labels.sucHi ?? -1} />
      <Lbl x={WPM.x + WPM.w / 2} y={WPM.y + WPM.h + 56} text="partially permeable membrane (rotated: compartments left and right; not a cell)" anchor="middle" size={16} fill={C.muted} o={labels.ppm ?? 1} />
      <WPScale x={SCALE.x} y0={SCALE.y0} y1={SCALE.y1} dl={dl} dr={dr} {...oScale} hiL={hiL} hiR={hiR} />
      {captions && <>
      <Txt x={WPM.x} y={WPM.y + WPM.h + 78} size={16} weight={700} fill={C.ink}>conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled</Txt>
      <Txt x={WPM.x} y={WPM.y + WPM.h + 102} size={16} weight={800} fill={C.primary}>in this model the gaps let only water through; a generic model barrier</Txt>
      <Cite x={WPM.x} y={WPM.y + WPM.h + 126} text={SCHEM + '; in real membranes water crosses the bilayer and, in many cells, channel proteins'} />
      <Pill x={1240} y={752} text="same temperature and pressure both sides" size={16} />
      </>}
    </g>
  );
}
/** Upper-left thumbnail of the membrane scene (Beat 9 end state), dimmed. */
export function MemThumb({s, t, o = 0.55}: any) {
  if (o <= 0) return null;
  const M0 = memM(t), G = memGeo(M0), B = b9(M0), glu = fieldState({G, nA: 15, nB: 5, evs: B.plan.evs, t, origin: B.c, seed: 92, speed: 0.7});
  return <g opacity={o} transform={`translate(${70 - 96 * 0.27} ${196 - 214 * 0.27}) scale(0.27)`}><MemScene s={s} t={t} labels={0} core={0} /><FieldTokens st={glu} k="glucose" t={t} s={0.85} /></g>;
}

/** Beat 11 · Water potential: the model in state `pure`, the scale with its 0 kPa reference, "more negative ↓",
 * negative values, less negative = higher; the dropper adds 4 sucrose left, 12 right; initially higher / lower. */
export default function Beat11(s: any) {
  const t = gt(s), a = s.a;
  const water = wpmWater(t), sucr = sucrosePts({M: WPM, spawns: spawns(), t});
  const pureO = fi(a('pure'), 0.4) * (1 - fe(a('left'), 0.4));
  const dropL = fi(a('left'), 0.3) * (1 - fe(a('left') - 2.2, 0.4)), dropR = fi(a('right'), 0.3) * (1 - fe(a('right') - 3.0, 0.4));
  return (
    <g>
      <MemThumb s={s} t={t} />
      <WPMLayout t={t} s={s} water={water} sucr={sucr} oScale={{oTitle: fi(a('measure'), 0.4), oZero: fi(a('zero'), 0.4), oArrow: fi(a('lower'), 0.6), oShade: fi(a('neg'), 0.5), oBracket: fi(a('less'), 0.5), oMarkers: fi(a('pure'), 0.4)}} hiL={pulse(a('left'), 1.6)} hiR={pulse(a('right'), 1.6)} />
      <Txt x={SCALE.x} y={SCALE.y0 - 40} size={16} weight={700} fill={C.muted} anchor="middle" opacity={fi(a('tend'), 0.4)}>water's tendency to move</Txt>
      {[0, 1].map((k) => <Pill key={k} x={WPM.x + WPM.w * (k ? 0.75 : 0.25)} y={WPM.y + 34} text="pure water" anchor="middle" o={pureO} size={18} fill={C.teal} />)}
      <Dropper x={WPM.x + WPM.w * 0.25} y={WPM.y - 4} o={dropL} squeeze={pulse(a('left'), 1.4)} />
      <Dropper x={WPM.x + WPM.w * 0.75} y={WPM.y - 4} o={dropR} squeeze={pulse(a('right'), 2.2)} />
      <Lbl x={WPM.x + WPM.w * 0.25} y={WPM.y + WPM.h + 30} text="initially: higher water potential (less negative)" anchor="middle" size={18} fill="#2F6B8F" o={fi(a('ll'), 0.4)} />
      <Lbl x={WPM.x + WPM.w * 0.75} y={WPM.y + WPM.h + 30} text="initially: lower water potential (more negative)" anchor="middle" size={18} fill="#8E4B6B" o={fi(a('rl'), 0.4)} />
    </g>
  );
}
