import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, Card, SCHEM, PARTS, clamp01, BSTART, NETPX, MemScene, memM, memGeo, MX, fmmLayout, compPos, lanes, RouteSlots} from '../kit';
import {mixedFields, SLOT, FDBracket} from './Beat07';
import {CoreLabel} from './Beat05';
import {ionField} from './Beat08';
import {b9} from './Beat09';
import {WPM, sucrosePts} from '../WaterPotentialModel';
import {wpmWater, spawns, WPMLayout, InitTags, Tag2} from './Beat11';
import {WPMCounters} from './Beat12';
import {FieldTokens, NetArrow, fieldState} from '../DiffusionField';

/** 008f: ONE MODEL AT A TIME (no scaled-down annotated diagrams). The recap shows either the membrane scene (full
 * size, as built in Beats 5–9, with its retained results and the route slots) or the water model (full size, as in
 * Beats 11–12, live: the equal-state windows keep running). `hi` = highlight amounts by key. */
export function MemRecap({s, t, hi = {}, o = 1}: any) {
  if (o <= 0) return null;
  const M0 = memM(t), G = memGeo(M0), Lf = fmmLayout(M0), ch = compPos(M0, 'channel'), ca = compPos(M0, 'carrier');
  const F = mixedFields(t, G, BSTART(7)), ions = ionField(t, {...G, gates: [ch.x]});
  const B = b9(M0), glu = fieldState({G, nA: 15, nB: 5, evs: B.plan.evs, t, origin: B.c, seed: 92, speed: 0.7});
  const lx = lanes(M0)[1][0];
  const arrow = (x: number, n: number, h: number, key: string) => <NetArrow key={key} x={x} y={M0.cy - (NETPX * n) / 2} dx={0} dy={1} len={NETPX * n} hi={h} />;
  const rows: [string, string, number][] = [['O₂', '26 / 14 · 8 · 2', hi.o2 ?? 0], ['ions', '14 / 11 · 8 · 2', hi.chan ?? 0], ['glucose', '13 / 7 · 3 · 1', hi.carr ?? 0]];
  const RX = 1060, RY = 206;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <MemScene s={s} t={t} core={0} mem={{highlight: hi.chanP > 0 ? 'intrinsic-channel' : hi.carrP > 0 ? 'intrinsic-carrier' : null, hl: Math.max(hi.chanP ?? 0, hi.carrP ?? 0)}} />
      <CoreLabel o={0.8 + 0.2 * (hi.core ?? 0)} />
      {(hi.core ?? 0) > 0 && <rect data-role="decor" x={Lf.x0} y={M0.cy - 1.5 * M0.u} width={Lf.width} height={3 * M0.u} fill="#F2C45A" opacity={0.35 * hi.core} />}
      <FieldTokens st={F.o2} k="o2" t={t} />
      <FieldTokens st={ions} k="ion" t={t} />
      <FieldTokens st={glu} k="glucose" t={t} s={0.85} />
      {arrow(lx, 4, hi.o2 ?? 0, 'o')}{arrow(ch.x - 60, 6, hi.fd ?? 0, 'c')}{arrow(ca.x + 70, 2, hi.fd ?? 0, 'g')}
      <Lbl x={ca.x + 2.3 * M0.u} y={M0.cy - 3.2 * M0.u} text="binding site" size={22} fill="#1E6B66" o={0.6 + 0.4 * (hi.carr ?? 0)} lx={ca.x + 4} ly={M0.cy - 1.1 * M0.u} />
      {/* retained results of the three counted demonstrations */}
      <rect data-role="decor" x={RX} y={RY} width={600} height={164} rx={12} fill="#FFFFFF" stroke={C.teal} strokeWidth={1.5} />
      <Txt x={RX + 16} y={RY + 30} size={20} weight={800} fill={C.teal}>last completed demonstrations</Txt>
      <Txt x={RX + 16} y={RY + 56} size={20} weight={600} fill={C.muted} italic>outside / inside · in · out (illustrative counts)</Txt>
      {rows.map(([k, v, h], i) => <g key={k}>
        {h > 0 && <rect data-role="decor" x={RX + 8} y={RY + 66 + 30 * i} width={584} height={28} rx={6} fill="#FCE7B5" opacity={h} />}
        <Txt x={RX + 16} y={RY + 88 + 30 * i} size={21} weight={800}>{k}</Txt>
        <Txt x={RX + 130} y={RY + 88 + 30 * i} size={21} weight={700}>{v}</Txt>
      </g>)}
      <RouteSlots x={SLOT.x} y={SLOT.y} w={SLOT.w} h={SLOT.h} gap={SLOT.gap} fill={[1, 1, 1, 1]} hi={[hi.o2 ?? 0, hi.chan ?? 0, hi.carr ?? 0, hi.osm ?? 0]} />
      <FDBracket tags={0.7 + 0.3 * (hi.fd ?? 0)} />
      <Cite x={MX.x1} y={948} text={SCHEM + '; ' + PARTS} anchor="end" />
    </g>
  );
}
/** The water model in its equal end state (live), full size. */
export function WaterRecap({s, t, hi = {}, o = 1}: any) {
  if (o <= 0) return null;
  const water = wpmWater(t), sucr = sucrosePts({M: WPM, spawns: spawns(), t});
  const ay = WPM.y + WPM.h * 0.5;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <WPMLayout t={t} s={s} water={water} sucr={sucr} hiL={hi.eqTag ?? 0} hiR={hi.eqTag ?? 0} />
      <WPMCounters t={t} />
      <InitTags textO={0.45 + 0.55 * (hi.hist ?? 0)} />
      <Tag2 x={WPM.x + WPM.w * 0.75} y={ay + 34} lines={['no net movement;', 'crossings continue']} fill={C.primary} w={230} />
      <Pill x={1850} y={340} anchor="end" text="equal water potentials" fill={C.teal} size={20 + 4 * (hi.eqTag ?? 0)} />
    </g>
  );
}

/** Beat 13 · What I told you: no new slide; the models built through the lesson, one at a time, live (token motion
 * and the water windows continue); key points brighten in place. Water model (continuing Beat 12) → membrane scene at
 * `rand` → water model at `osm`. */
export default function Beat13(s: any) {
  const t = gt(s), a = s.a;
  const P = (k: string, d = 3.0) => fi(a(k), 0.4) * (1 - fe(a(k) - d, 0.6));
  const hi: any = {
    o2: P('o2', 5.0), core: P('polar', 5.2), fd: P('fd', 8.5), chan: P('chan', 2.3), chanP: P('chan', 2.3), carr: P('carr', 3.8), carrP: P('carr', 3.8),
    osm: P('osm', 8.0), hist: fi(a('osm') - 0.6, 0.4) * (1 - fe(a('osm') - 2.2, 0.6)), eqTag: pulse(a('osm') - 3.0, 2.0),
  };
  // hard sequence (never both models' texts at once): water out, then membrane in; membrane out, then water in
  const memO = fe(a('rand') - 0.15, 0.35) * (1 - fe(a('osm') + 0.2, 0.3));
  const watO = (1 - fe(a('rand') + 0.2, 0.3)) + fe(a('osm') - 0.15, 0.35);
  const note = (text: string, o: number) => <Pill x={1060} y={420} text={text} o={o} size={22} fill={C.primary} />;
  const W4 = {x: 70, y: 420, w: 270, h: 84};
  return (
    <g>
      <WaterRecap s={s} t={t} hi={hi} o={watO} />
      {watO > 0 && pulse(a('settle'), 1.6) > 0 && <rect data-role="decor" x={WPM.x - 8} y={WPM.y - 8} width={WPM.w + 16} height={WPM.h + 16} rx={16} fill="none" stroke="#E0892B" strokeWidth={4} opacity={pulse(a('settle'), 1.6) * watO} />}
      <MemRecap s={s} t={t} hi={hi} o={memO} />
      {memO > 0 && pulse(a('rand') + 0.2, 1.6) > 0 && <rect data-role="decor" x={MX.x0 + 5} y={MX.y0 + 5} width={MX.x1 - MX.x0 - 10} height={MX.y1 - MX.y0 - 10} rx={14} fill="none" stroke="#E0892B" strokeWidth={4} opacity={pulse(a('rand') + 0.2, 1.6) * memO} />}
      {memO > 0 && <g opacity={memO}>
        {note('random movement → net movement down a gradient', fi(a('rand'), 0.4) * (1 - fe(a('equal') + 0.35, 0.3)))}
        {note('then no net movement; movement continues', fi(a('equal') - 0.05, 0.3) * (1 - fe(a('o2') - 0.3, 0.5)))}
        {note('ions, glucose: do not cross the core readily', hi.core)}
      </g>}
      {/* route slot 4 with the water model */}
      {watO > 0 && (hi.osm ?? 0) > 0 && <g opacity={hi.osm * watO}>
        <rect data-role="decor" x={W4.x} y={W4.y} width={W4.w} height={W4.h} rx={12} fill="#FFFFFF" stroke="#E0892B" strokeWidth={4} />
        <Txt x={W4.x + 16} y={W4.y + 34} size={21} weight={800} fill={C.teal}>water:</Txt>
        <Txt x={W4.x + 16} y={W4.y + 64} size={20} weight={700}>osmosis</Txt>
      </g>}
      {a('osm') >= 0 && <Card x={1240} y={790} w={610} h={144} opacity={fi(a('osm'), 0.4) * watO} stroke={C.teal} fill="#FFFFFF">
        <Txt x={1258} y={820} size={20} weight={800} fill={C.teal}>Osmosis:</Txt>
        <Txt x={1352} y={820} size={20} weight={700}>net movement of water molecules</Txt>
        <Txt x={1258} y={850} size={20} weight={700}>from a region of higher water potential</Txt>
        <Txt x={1258} y={880} size={20} weight={700}>to a region of lower water potential</Txt>
        <Txt x={1258} y={910} size={20} weight={700}>through a partially permeable membrane</Txt>
      </Card>}
      <Txt x={70} y={250} size={34} weight={800} fill={C.primary} opacity={fi(a('passive'), 0.5)}>passive</Txt>
      <Txt x={70} y={290} size={34} weight={800} fill={C.primary} opacity={fi(a('passive'), 0.5)}>no ATP</Txt>
    </g>
  );
}
