import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, PARTS, SCHEM, clamp01, CUE, BSTART, RouteSlots, MemScene, memM, memGeo, MX, fmmLayout, compPos, carrierPlan, NETPX, Card, ATPTag} from '../kit';
import {mixedFields, SLOT, FDBracket} from './Beat07';
import {MemCounters, MemNet, CoreLabel, slotFill} from './Beat05';
import {ionField} from './Beat08';
import {fieldState, FieldTokens, SideTag, countIn, Ev} from '../DiffusionField';
import {PROT} from '../TransportProteinSet';
import {InkRing} from '../../shared/src/Type';

const ez = (k: number) => { k = clamp01(k); return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; };
/** Dataset 2, Beat 9: the counted carrier demonstration from `count` (16 s window): a reverse cycle 0.0–2.7 s, then
 * inward cycles from 3.2, 6.7 and 10.2 s (15 / 5 → 16 / 4 → 15 / 5 → 14 / 6 → 13 / 7). */
export const b9 = (M: any) => { const c = CUE(9, 'count'); return {c, plan: carrierPlan([{c0: c, rev: true}, {c0: c + 3.2}, {c0: c + 6.7}, {c0: c + 10.2}], M)}; };
/** The uncounted first cycle, cue-driven: seat at `bind` (0.6 s), shape change at `flip` (0.8 s), release at
 * `release` (0.5 s), return to the first shape at `reset` (0.8 s). */
export function demoCycle(M: any) {
  const Tb = CUE(9, 'bind'), Tf = CUE(9, 'flip'), Tr = CUE(9, 'release'), Tz = CUE(9, 'reset'), pY = PROT.pocketY;
  const phase = (t: number) => t < Tf ? 0 : t < Tz ? ez((t - Tf) / 0.8) : 1 - ez((t - Tz) / 0.8);
  const ty = (t: number) => t < Tb + 0.6 ? -4.2 + (4.2 - pY) * ez((t - Tb) / 0.6) : t < Tf ? -pY : t < Tf + 0.8 ? -pY + 2 * pY * ez((t - Tf) / 0.8) : t < Tr ? pY : pY + (4.2 - pY) * ez((t - Tr) / 0.5);
  const ev: Ev = {t: Tr + 0.5, dir: 1, pre: Tr + 0.5 - (Tb - 0.7), post: 0, via: (t: number) => [compPos({...M, t}, 'carrier').x, M.cy + ty(t) * M.u]};
  return {phase, ev, Tb, Tf, Tr, Tz};
}
/** Beat 9 · A carrier protein: the uncounted mechanism cycle; then a new counted demonstration (16 s window, 3 · 1,
 * 13 / 7); either way, more often from the side with more; the scope caution. */
export default function Beat09(s: any) {
  const t = gt(s), a = s.a;
  const M0 = memM(t), G = memGeo(M0), Lf = fmmLayout(M0), ca = compPos(M0, 'carrier');
  const D = demoCycle(M0), B = b9(M0);
  const counted = t >= B.c;
  const phase = counted ? B.plan.phaseAt(t) : D.phase(t);
  const mem = {highlight: 'intrinsic-carrier', hl: 1, carrierPhase: phase};
  const F = mixedFields(t, G, BSTART(7)), ions = ionField(t, {...G, gates: [compPos(M0, 'channel').x]});
  const pre = fieldState({G, nA: 15, nB: 5, evs: [D.ev], t, origin: BSTART(9), seed: 91, speed: 0.7});
  const st = fieldState({G, nA: 15, nB: 5, evs: B.plan.evs, t, origin: B.c, seed: 92, speed: 0.7});
  const X = fe(t - B.c, 0.5);
  const doneAll = t >= B.c + 12.9;
  const live = counted && t < B.c + 16 ? countIn(B.plan.evs, B.c, B.c + 16, t) : null;
  const liveNet = live ? live[0] - live[1] : 2;
  const net = counted ? Math.max(0, liveNet) * fe(a('more'), 0.6) : 0;
  const revHi = a('either') >= 0 && t < B.c + 2.9 ? 1 : pulse(a('either'), 1.6);
  return (
    <g>
      <MemScene s={s} t={t} mem={mem} core={0} />
      <CoreLabel />
      <FieldTokens st={F.o2} k="o2" t={t} opacity={0.3} />
      <FieldTokens st={ions} k="ion" t={t} opacity={0.3} />
      {X < 1 && <FieldTokens st={pre} k="glucose" t={t} s={0.85} opacity={1 - X} hi={a('bind') >= -0.7 && !counted ? pre.pts.filter((p: any) => p.crossing).map((p: any) => p.i) : []} />}
      {X > 0 && <FieldTokens st={st} k="glucose" t={t} s={0.85} opacity={X} />}
      <Lbl x={ca.x} y={Lf.protTop - 58} text="carrier protein" anchor="middle" o={0.7 + 0.3 * fi(a('open'), 0.4)} size={22 + 2 * pulse(a('open'), 1.2)} fill="#1E6B66" lx={ca.x} ly={Lf.protTop - 4} />
      <Lbl x={ca.x - 70} y={M0.cy - 1.1 * M0.u} text="binding site" anchor="end" o={fi(a('bind'), 0.4)} size={20} fill="#1E6B66" lx={ca.x - 14} ly={M0.cy - 1.3 * M0.u} />
      <InkRing cx={ca.x} cy={M0.cy} rx={1.4 * M0.u} ry={3.1 * M0.u} p={revHi > 0 ? 1 : 0} opacity={revHi} color="#E0892B" />
      {!counted && <Pill x={(MX.x0 + MX.x1) / 2} y={MX.y0 - 12} text="mechanism demonstration; not counted" anchor="middle" size={16} fill={C.primary} />}
      {counted && <Pill x={(MX.x0 + MX.x1) / 2} y={MX.y0 - 12} text="new counted demonstration: glucose reset to 15 / 5" anchor="middle" size={16} fill={C.primary} o={X} />}
      <SideTag x={MX.x1 - 50} y={MX.y0 + 44} n={st.a} o={X} />
      <SideTag x={MX.x1 - 50} y={MX.y1 - 56} n={st.b} o={X} />
      {t < B.c + 1.5 && <g opacity={X}>
        <Txt x={MX.x1 - 90} y={MX.y0 + 40} size={20} weight={700} fill={C.muted} anchor="end">set starting count</Txt>
        <Txt x={MX.x1 - 90} y={MX.y1 - 60} size={20} weight={700} fill={C.muted} anchor="end">set starting count</Txt>
      </g>}
      <MemCounters live={doneAll ? null : live} last={doneAll ? [3, 1] : null} o={X} liveTitle="current demonstration (16 s)" sub="illustrative counts" hiLast={pulse(t - (B.c + 12.9), 1.2)} />
      <Txt x={1030} y={488} size={20} weight={700} fill={C.muted} italic opacity={X}>not comparable rates</Txt>
      <Txt x={1030} y={511} size={20} weight={700} fill={C.muted} italic opacity={X}>between transport routes</Txt>
      <MemNet net={net} label="facilitated diffusion" />
      {counted && <g opacity={X}>
        <Pill x={1030} y={551} text="down its concentration gradient" size={16} fill={C.teal} />
        <ATPTag x={1062} y={588} w={52} h={24} struck /><Pill x={1098} y={593} text="no ATP used" size={15} />
      </g>}
      <Txt x={1030} y={706} size={16} weight={700} fill={C.teal} italic opacity={X}>our facilitated-diffusion example</Txt>
      {a('caution') >= 0 && <Card x={1370} y={206} w={480} h={150} opacity={fi(a('caution'), 0.4)} stroke={C.primary} fill="#FFFFFF">
        <Txt x={1390} y={238} size={18} weight={800} fill={C.primary}>one caution</Txt>
        <Txt x={1390} y={266} size={17} weight={700}>needing a protein does not by itself establish</Txt>
        <Txt x={1390} y={290} size={17} weight={700}>the direction or energy requirement of every</Txt>
        <Txt x={1390} y={314} size={17} weight={700}>glucose-transport system</Txt>
        <Txt x={1390} y={342} size={15} weight={600} fill={C.muted} italic>energy-requiring transport: 4.2.1b</Txt>
      </Card>}
      <RouteSlots x={SLOT.x} y={SLOT.y} w={SLOT.w} h={SLOT.h} gap={SLOT.gap} fill={[1, 1, slotFill(a('more') - 0.4), 0]} hi={[0, 0, pulse(a('more') - 0.4, 1.4), 0]} />
      <FDBracket />
      <Cite x={MX.x1} y={948} text={SCHEM + '; ' + PARTS} anchor="end" />
    </g>
  );
}
