import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, Card, SCHEM, PARTS, clamp01, CUE, BSTART, NETPX, MemScene, memM, memGeo, MX, fmmLayout, compPos, lanes, Bracket} from '../kit';
import {OPEN} from '../kit';
import {openState, OpenBase} from './Beat03';
import {mixedFields} from './Beat07';
import {ionField} from './Beat08';
import {b9} from './Beat09';
import {WPM} from '../WaterPotentialModel';
import {wpmWater, spawns, WPMLayout} from './Beat11';
import {WPMCounters} from './Beat12';
import {sucrosePts} from '../WaterPotentialModel';
import {FieldTokens, NetArrow, fieldState} from '../DiffusionField';

const MSC = 0.62, MTX = 70 - MX.x0 * MSC, MTY = 322 - MX.y0 * MSC;     // membrane scene placement
const WSC = 0.62, WTX = 720 - WPM.x * WSC, WTY = 232 - 186 * WSC;      // water model placement
const SL = {x: 720, y: 752, w: 270, h: 70, gap: 12};
const SLOTS = [['simple diffusion:', 'through the bilayer'], ['channel protein:', 'hydrophilic pore'], ['carrier protein:', 'binds, changes shape'], ['water:', 'osmosis']];
/** The recap layout (Beat 13; reduced in Beat 14): the membrane scene with its three demonstrations' retained
 * results, the four route slots, the water model in its equal end state (live), the open-field thumbnail. `hi` =
 * highlight amounts by key. */
export function RecapLayout({s, t, hi = {}}: any) {
  const M0 = memM(t), G = memGeo(M0), Lf = fmmLayout(M0), ch = compPos(M0, 'channel'), ca = compPos(M0, 'carrier');
  const F = mixedFields(t, G, BSTART(7)), ions = ionField(t, {...G, gates: [ch.x]});
  const B = b9(M0), glu = fieldState({G, nA: 15, nB: 5, evs: B.plan.evs, t, origin: B.c, seed: 92, speed: 0.7});
  const water = wpmWater(t), sucr = sucrosePts({M: WPM, spawns: spawns(), t});
  const op = openState(t);
  const lx = lanes(M0)[1][0];
  const arrow = (x: number, n: number, h: number, key: string) => <NetArrow key={key} x={x} y={M0.cy - (NETPX * n) / 2} dx={0} dy={1} len={NETPX * n} hi={h} />;
  const mini = (x: number, title: string, pops: string, cnt: string, h: number) => (
    <g key={title}>
      <rect data-role="decor" x={x} y={812} width={184} height={92} rx={10} fill="#FFFFFF" stroke={h > 0 ? '#E0892B' : C.teal} strokeWidth={h > 0 ? 3 : 1.5} />
      <Txt x={x + 10} y={834} size={15} weight={800} fill={C.teal}>{title}</Txt>
      <Txt x={x + 10} y={856} size={15} weight={700}>{pops}</Txt>
      <Txt x={x + 10} y={878} size={15} weight={700}>{cnt}</Txt>
      <Txt x={x + 10} y={896} size={12} weight={600} fill={C.muted} italic>last completed demonstration</Txt>
    </g>
  );
  return (
    <g>
      {/* open-field thumbnail */}
      <g transform={`translate(${70 - OPEN.x0 * 0.19} ${192 - 290 * 0.19}) scale(0.19)`} opacity={0.75 + 0.25 * (hi.open ?? 0)}>
        <OpenBase t={t} /><FieldTokens st={op.st} k="o2" t={t} />
      </g>
      {(hi.open ?? 0) > 0 && <rect data-role="decor" x={64} y={186} width={240} height={110} rx={10} fill="none" stroke="#E0892B" strokeWidth={4} opacity={hi.open} />}
      {/* membrane scene */}
      <g transform={`translate(${MTX} ${MTY}) scale(${MSC})`}>
        <MemScene s={s} t={t} mem={{highlight: hi.chanP > 0 ? 'intrinsic-channel' : hi.carrP > 0 ? 'intrinsic-carrier' : null, hl: Math.max(hi.chanP ?? 0, hi.carrP ?? 0)}} />
        <FieldTokens st={F.o2} k="o2" t={t} />
        <FieldTokens st={ions} k="ion" t={t} />
        <FieldTokens st={glu} k="glucose" t={t} s={0.85} />
        {arrow(lx, 4, hi.o2 ?? 0, 'o')}{arrow(ch.x - 60, 6, hi.fd ?? 0, 'c')}{arrow(ca.x + 70, 2, hi.fd ?? 0, 'g')}
        <Lbl x={ca.x - 60} y={M0.cy - 1.1 * M0.u} text="binding site" anchor="end" size={22} fill="#1E6B66" o={0.6 + 0.4 * (hi.carr ?? 0)} />
        {(hi.core ?? 0) > 0 && <rect data-role="decor" x={Lf.x0} y={M0.cy - 1.5 * M0.u} width={Lf.width} height={3 * M0.u} fill="#F2C45A" opacity={0.35 * hi.core} />}
      </g>
      {[['O₂', '26 / 14', '8 · 2', hi.o2 ?? 0], ['ions', '14 / 11', '8 · 2', hi.chan ?? 0], ['glucose', '13 / 7', '3 · 1', hi.carr ?? 0]].map(([k, p, c, h]: any, i) => mini(70 + i * 192, k, `outside / inside: ${p}`, `in · out: ${c}`, h))}
      <Pill x={320} y={306} text="does not cross the core readily" o={hi.core ?? 0} fill={C.primary} size={16} />
      {/* water model (live, equal end state) */}
      <g transform={`translate(${WTX} ${WTY}) scale(${WSC})`}>
        <WPMLayout t={t} s={s} water={water} sucr={sucr} captions={false} hiL={hi.eqTag ?? 0} hiR={hi.eqTag ?? 0} />
        <WPMCounters t={t} />
        <Lbl x={WPM.x + WPM.w * 0.25} y={WPM.y + WPM.h + 30} text="initially: higher water potential (less negative)" anchor="middle" size={14 + 4 * (hi.hist ?? 0)} fill="#2F6B8F" o={0.45 + 0.55 * (hi.hist ?? 0)} />
        <Lbl x={WPM.x + WPM.w * 0.75} y={WPM.y + WPM.h + 30} text="initially: lower water potential (more negative)" anchor="middle" size={14 + 4 * (hi.hist ?? 0)} fill="#8E4B6B" o={0.45 + 0.55 * (hi.hist ?? 0)} />
        <Pill x={1480} y={300} text="equal water potentials" fill={C.teal} size={22 + 4 * (hi.eqTag ?? 0)} />
        <Pill x={WPM.x + WPM.w / 2} y={WPM.y + WPM.h * 0.35 + 40} text="no net movement; crossings continue" anchor="middle" fill={C.primary} size={20} />
      </g>
      <Txt x={720} y={716} size={14} weight={700} fill={C.ink}>conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled</Txt>
      <Txt x={720} y={736} size={14} weight={800} fill={C.primary}>in this model the gaps let only water through; a generic model barrier · same temperature and pressure both sides</Txt>
      {(hi.osm ?? 0) > 0 && <Txt x={720} y={930} size={17} weight={800} fill={C.teal} opacity={hi.osm}>osmosis: net movement of water, higher → lower water potential, through a partially permeable membrane</Txt>}
      {/* route slots, in a row */}
      {SLOTS.map(([h, b], i) => { const x = SL.x + i * (SL.w + SL.gap), hh = [hi.o2, hi.chan, hi.carr, hi.osm][i] ?? 0; return (
        <g key={i}>
          <rect data-role="decor" x={x} y={SL.y} width={SL.w} height={SL.h} rx={10} fill="#FFFFFF" stroke={hh > 0 ? '#E0892B' : C.teal} strokeWidth={hh > 0 ? 3 + hh : 2} />
          <Txt x={x + 10} y={SL.y + 30} size={16} weight={800} fill={C.teal}>{h}</Txt>
          <Txt x={x + 10} y={SL.y + 56} size={16} weight={700}>{b}</Txt>
        </g>
      ); })}
      <Bracket x={SL.y + SL.h + 12} y0={SL.x + SL.w + SL.gap} y1={SL.x + 3 * SL.w + 2 * SL.gap} side={-1} horiz color={C.teal} />
      <Txt x={SL.x + 1.5 * SL.w + SL.gap + SL.w / 2} y={SL.y + SL.h + 40} size={20} weight={800} fill={C.teal} anchor="middle" opacity={0.7 + 0.3 * (hi.fd ?? 0)}>facilitated diffusion</Txt>
      <Txt x={SL.x + 1.5 * SL.w + SL.gap + SL.w / 2} y={SL.y + SL.h + 62} size={14} weight={700} fill={C.ink} anchor="middle" opacity={0.6 + 0.4 * (hi.fd ?? 0)}>net movement down the gradient · no ATP</Txt>
      <Cite x={70} y={932} text={SCHEM + '; ' + PARTS + '; illustrative counts'} />
    </g>
  );
}

/** Beat 13 · What I told you: no new slide; the layout built through the lesson, static but live (token motion and
 * the water window continue); key points brighten in place. */
export default function Beat13(s: any) {
  const t = gt(s), a = s.a;
  const P = (k: string, d = 3.0) => fi(a(k), 0.4) * (1 - fe(a(k) - d, 0.6));
  const hi = {
    open: P('rand', 5.0), o2: P('o2', 5.0), core: P('polar', 5.2), fd: P('fd', 8.5), chan: P('chan', 2.3), chanP: P('chan', 2.3), carr: P('carr', 3.8), carrP: P('carr', 3.8),
    osm: P('osm', 8.0), hist: fi(a('osm') - 0.6, 0.4) * (1 - fe(a('osm') - 2.2, 0.6)), eqTag: pulse(a('osm') - 3.0, 2.0),
  };
  return (
    <g>
      <RecapLayout s={s} t={t} hi={hi} />
      {pulse(a('settle'), 1.6) > 0 && <rect data-role="decor" x={64} y={316} width={578} height={454} rx={16} fill="none" stroke="#E0892B" strokeWidth={4} opacity={pulse(a('settle'), 1.6)} />}
      {pulse(a('settle') - 1.2, 1.6) > 0 && <rect data-role="decor" x={714} y={226} width={780} height={480} rx={16} fill="none" stroke="#E0892B" strokeWidth={4} opacity={pulse(a('settle') - 1.2, 1.6)} />}
      <Pill x={320} y={196} text="random movement → net movement down a gradient" o={hi.open * (1 - fe(a('equal'), 0.3))} size={16} fill={C.primary} />
      <Pill x={320} y={196} text="no net movement; movement continues" o={fi(a('equal'), 0.3) * (1 - fe(a('equal') - 4.5, 0.5))} size={16} fill={C.primary} />
      <Txt x={1850} y={214} size={34} weight={800} fill={C.primary} anchor="end" opacity={fi(a('passive'), 0.5)}>passive · no ATP</Txt>
    </g>
  );
}
