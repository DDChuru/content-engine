import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, Card, clamp01, CUE, NETPX} from '../kit';
import {WPM, sucrosePts, Dropper} from '../WaterPotentialModel';
import {CounterCard, NetArrow, countIn} from '../DiffusionField';
import {WaterTok} from '../T4Tokens';
import {ChannelProtein} from '../TransportProteinSet';
import {wpmWindows, wpmCountedEvents, wpmWater, spawns, WPMLayout, InitTags, Tag2} from './Beat11';

/** Counter cards for the water model at global t (008f: top band, clear of the left dropper): the live window, the
 * last completed one and (after the change) the retained unequal window relabelled "before the change". */
export const CARD = {x: 900, y: 196, w: 250, gap: 14};
export function WPMCounters({t, o = 1, hiLast = 0, hiBefore = 0}: any) {
  const W = wpmWindows(), E = wpmCountedEvents(), eq = CUE(12, 'equal');
  const cur = W.find(([w0]) => t >= w0 && t < w0 + 5);
  const lastUn = [...W].reverse().find(([w0]) => w0 < eq && t >= w0 + 5);
  const lastEq = [...W].reverse().find(([w0]) => w0 >= eq && t >= w0 + 5);
  const X = (i: number) => CARD.x + i * (CARD.w + CARD.gap);
  const cn = cur ? countIn(E, cur[0], cur[0] + 5, t) : [0, 0];
  return (
    <g opacity={o < 1 ? o : undefined}>
      {lastUn && <CounterCard x={X(0)} y={CARD.y} w={CARD.w} n={lastUn[1]} m={lastUn[2]} title={t >= eq ? 'before the change' : 'completed 5 s window'} hi={hiBefore} dim={t >= eq} />}
      {lastEq && <CounterCard x={X(1)} y={CARD.y} w={CARD.w} n={lastEq[1]} m={lastEq[2]} title="completed 5 s window" hi={hiLast} />}
      {cur && <CounterCard x={X(2)} y={CARD.y} w={CARD.w} n={cn[0]} m={cn[1]} title="current 5 s window" />}
    </g>
  );
}
/** Net osmosis arrow (left → right) at global t: grows at `net` from the completed 15 · 9 (net 6), fades to zero
 * over 1 s when the potentials become equal. */
export function wpmNet(t: number) {
  const g = CUE(12, 'net'), e = CUE(12, 'equal');
  if (t < g) return 0;
  return NETPX * 6 * fe(t - g, 0.8) * (1 - clamp01((t - e) / 1.0));
}
/** Aquaporin note inset: a continuous bilayer, one water token between phospholipids, one through a water channel. */
function AqpInset({x, y, t, o = 1}: any) {
  if (o <= 0) return null;
  const w = 270, h = 280, my = y + 96;
  const heads: any[] = [];
  for (let xx = x + 16; xx < x + w - 10; xx += 17) { if (Math.abs(xx - (x + 175)) < 24) continue; heads.push(<circle key={`a${xx}`} cx={xx} cy={my - 24} r={7} fill="#E8A94A" stroke="#B07A2A" strokeWidth={1} />, <circle key={`b${xx}`} cx={xx} cy={my + 24} r={7} fill="#E8A94A" stroke="#B07A2A" strokeWidth={1} />, <path key={`c${xx}`} d={`M${xx - 2} ${my - 17}V${my + 17}M${xx + 2} ${my - 17}V${my + 17}`} stroke="#9A9A9A" strokeWidth={2} />); }
  const k1 = ((t * 0.45) % 1), k2 = ((t * 0.45 + 0.5) % 1);
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={h} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <g data-role="drawing">{heads}<ChannelProtein x={x + 175} y={my} u={16} />
        <WaterTok x={x + 75} y={my - 66 + 132 * k1} r={7} /><WaterTok x={x + 175} y={my - 66 + 132 * k2} r={7} /></g>
      <Txt x={x + 14} y={y + 204} size={20} weight={700} fill={C.teal}>water channels</Txt>
      <Txt x={x + 14} y={y + 230} size={20} weight={700} fill={C.teal}>(aquaporins) in many</Txt>
      <Txt x={x + 14} y={y + 256} size={20} weight={700} fill={C.teal}>cells: named, not taught</Txt>
    </g>
  );
}
/** Beat 12 · Osmosis: counted water crossings (15 · 9, completed before it is shown), sucrose turned back, the net
 * arrow, the definition; we change the left solution (equality by intervention), the arrow fades at once, a new
 * equal-state window (12 · 12); crossings continue. */
export default function Beat12(s: any) {
  const t = gt(s), a = s.a;
  const water = wpmWater(t);
  const sp = spawns(), turnI = 1;
  const sucr = sucrosePts({M: WPM, spawns: sp, t, turn: {i: turnI, t0: CUE(12, 'suc')}});
  const eqO = fi(a('equal'), 0.4);
  const net = wpmNet(t);
  const defs = [fi(a('def'), 0.4), fi(a('def') - 1.8, 0.4), fi(a('def') - 4.2, 0.4), fi(a('ppm'), 0.4)];
  const drop = fi(a('add'), 0.3) * (1 - fe(a('add') - 2.3, 0.4));
  const ay = WPM.y + WPM.h * 0.5, cx = WPM.x + WPM.w / 2;
  const lx = cx + NETPX * 3 + 16;
  return (
    <g>
      <WPMLayout t={t} s={s} water={water} sucr={sucr} ring={pulse(a('ppm'), 2.0)} labels={{sucHi: a('suc') >= 0 && a('more') < 0 ? turnI : -1}} hiL={pulse(a('equal'), 1.4)} hiR={pulse(a('equal'), 1.4)} />
      <WPMCounters t={t} o={fi(a('count'), 0.4)} hiBefore={pulse(a('more'), 1.6)} hiLast={pulse(a('fades') - 2.0, 1.2)} />
      <NetArrow x={cx - NETPX * 3} y={ay} len={net} label="net movement of water" lx={lx} ly={ay - 12} anchor="start" />
      {net > 2 && <Txt x={lx} y={ay + 16} size={20} weight={800} fill="#C0453D" opacity={clamp01(net / (NETPX * 6))}>by osmosis</Txt>}
      {a('fades') >= 0 && <path data-role="decor" d={`M${cx - NETPX * 3} ${ay}H${cx + NETPX * 3}`} stroke="#C0453D" strokeWidth={3} strokeDasharray="6 7" opacity={pulse(a('fades'), 2.2)} />}
      <Tag2 x={WPM.x + WPM.w * 0.75} y={ay + 34} lines={['no net movement;', 'crossings continue']} fill={C.primary} w={230} o={fi(a('still'), 0.4)} />
      <Tag2 x={WPM.x + WPM.w * 0.25} y={WPM.y + WPM.h * 0.6} lines={['in this model water crosses;', 'sucrose does not']} fill={C.primary} w={300} o={fi(a('suc'), 0.4) * (1 - fe(a('def'), 0.5))} />
      <AqpInset x={70} y={420} t={t} o={fi(a('aqp'), 0.5)} />
      <InitTags textO={1 - 0.55 * eqO} />
      <Dropper x={WPM.x + WPM.w * 0.25} y={WPM.y - 4} o={drop} squeeze={pulse(a('add'), 2.0)} />
      <Pill x={WPM.x + WPM.w * 0.25} y={WPM.y + 36} anchor="middle" text="we change the left solution" o={fi(a('add'), 0.4)} fill={C.primary} size={20} />
      <Pill x={1850} y={340} anchor="end" text="equal water potentials" o={eqO} fill={C.teal} size={20} />
      {defs[0] > 0 && <Card x={1240} y={790} w={610} h={144} opacity={defs[0]} stroke={C.teal} fill="#FFFFFF">
        <Txt x={1258} y={820} size={20} weight={800} fill={C.teal}>Osmosis:</Txt>
        <Txt x={1352} y={820} size={20} weight={700}>net movement of water molecules</Txt>
        <Txt x={1258} y={850} size={20} weight={700} opacity={defs[1]}>from a region of higher water potential</Txt>
        <Txt x={1258} y={880} size={20} weight={700} opacity={defs[2]}>to a region of lower water potential</Txt>
        <Txt x={1258} y={910} size={20} weight={700} opacity={defs[3]}>through a partially permeable membrane</Txt>
      </Card>}
    </g>
  );
}
