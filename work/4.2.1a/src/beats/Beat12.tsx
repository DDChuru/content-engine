import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, Card, clamp01, CUE, NETPX} from '../kit';
import {WPM, sucrosePts, Dropper} from '../WaterPotentialModel';
import {CounterCard, NetArrow, countIn} from '../DiffusionField';
import {WaterTok} from '../T4Tokens';
import {ChannelProtein} from '../TransportProteinSet';
import {wpmWindows, wpmEvents, wpmWater, spawns, WPMLayout, MemThumb} from './Beat11';

/** Counter cards for the water model at global t: the live window, the last completed one and (after the change)
 * the retained unequal window relabelled "before the change — completed window". */
export function WPMCounters({t, o = 1, hiLast = 0, hiBefore = 0}: any) {
  const W = wpmWindows(), E = wpmEvents(), eq = W[1][0];
  const cur = W.find(([w0]) => t >= w0 && t < w0 + 5);
  const lastEq = [...W].reverse().find(([w0]) => w0 >= eq && t >= w0 + 5);
  const unequalDone = t >= W[0][0] + 5;
  const y = 186;
  return (
    <g opacity={o < 1 ? o : undefined}>
      {unequalDone && <CounterCard x={WPM.x} y={y} w={290} n={15} m={9} title={t >= eq ? 'before the change — completed window' : 'last completed five-second window'} sub="illustrative counts" hi={hiBefore} dim={t >= eq} />}
      {lastEq && <CounterCard x={WPM.x + 300} y={y} w={290} n={lastEq[1]} m={lastEq[2]} title="last completed five-second window" sub="illustrative counts" hi={hiLast} />}
      {cur && <CounterCard x={WPM.x + 600} y={y} w={290} n={countIn(E, cur[0], cur[0] + 5, t)[0]} m={countIn(E, cur[0], cur[0] + 5, t)[1]} title="current five-second window" sub="crossings in each 5 s window; illustrative counts" />}
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
  const w = 260, h = 230, my = y + 110;
  const heads: any[] = [];
  for (let xx = x + 16; xx < x + w - 10; xx += 17) { if (Math.abs(xx - (x + 170)) < 24) continue; heads.push(<circle key={`a${xx}`} cx={xx} cy={my - 24} r={7} fill="#E8A94A" stroke="#B07A2A" strokeWidth={1} />, <circle key={`b${xx}`} cx={xx} cy={my + 24} r={7} fill="#E8A94A" stroke="#B07A2A" strokeWidth={1} />, <path key={`c${xx}`} d={`M${xx - 2} ${my - 17}V${my + 17}M${xx + 2} ${my - 17}V${my + 17}`} stroke="#9A9A9A" strokeWidth={2} />); }
  const k1 = ((t * 0.45) % 1), k2 = ((t * 0.45 + 0.5) % 1);
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={h} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <g data-role="drawing">{heads}<ChannelProtein x={x + 170} y={my} u={16} />
        <WaterTok x={x + 75} y={my - 70 + 140 * k1} r={7} /><WaterTok x={x + 170} y={my - 70 + 140 * k2} r={7} /></g>
      <Txt x={x + 12} y={y + 196} size={14} weight={700} fill={C.teal}>water channels (aquaporins)</Txt>
      <Txt x={x + 12} y={y + 216} size={14} weight={700} fill={C.teal}>in many cells: named, not taught</Txt>
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
  const ay = WPM.y + WPM.h * 0.35, cx = WPM.x + WPM.w / 2;
  return (
    <g>
      <MemThumb s={s} t={t} />
      <WPMLayout t={t} s={s} water={water} sucr={sucr} ring={pulse(a('ppm'), 2.0)} labels={{sucHi: a('suc') >= 0 && a('more') < 0 ? turnI : -1}} hiL={pulse(a('equal'), 1.4)} hiR={pulse(a('equal'), 1.4)} />
      <WPMCounters t={t} o={fi(a('count'), 0.4)} hiBefore={pulse(a('more'), 1.6)} hiLast={pulse(a('fades') - 2.0, 1.2)} />
      <NetArrow x={cx - NETPX * 3} y={ay} len={net} label="net movement of water by osmosis" />
      {a('fades') >= 0 && <path data-role="decor" d={`M${cx - NETPX * 3} ${ay}H${cx + NETPX * 3}`} stroke="#C0453D" strokeWidth={3} strokeDasharray="6 7" opacity={pulse(a('fades'), 2.2)} />}
      <Pill x={cx} y={ay + 40} text="no net movement; crossings continue" anchor="middle" o={fi(a('still'), 0.4)} fill={C.primary} size={17} />
      <Pill x={WPM.x + WPM.w * 0.25} y={WPM.y + WPM.h * 0.62} text="in this model the membrane lets water through, not sucrose" anchor="middle" o={fi(a('suc'), 0.4) * (1 - fe(a('def'), 0.5))} size={15} fill={C.primary} />
      <AqpInset x={70} y={430} t={t} o={fi(a('aqp'), 0.5)} />
      <Lbl x={WPM.x + WPM.w * 0.25} y={WPM.y + WPM.h + 30} text="initially: higher water potential (less negative)" anchor="middle" size={18 - 4 * eqO} fill="#2F6B8F" o={1 - 0.55 * eqO} />
      <Lbl x={WPM.x + WPM.w * 0.75} y={WPM.y + WPM.h + 30} text="initially: lower water potential (more negative)" anchor="middle" size={18 - 4 * eqO} fill="#8E4B6B" o={1 - 0.55 * eqO} />
      <Dropper x={WPM.x + WPM.w * 0.25} y={WPM.y - 4} o={drop} squeeze={pulse(a('add'), 2.0)} />
      <Pill x={WPM.x + 20} y={WPM.y + 34} text="we change the left solution" o={fi(a('add'), 0.4)} fill={C.primary} size={17} />
      <Pill x={1480} y={300} text="equal water potentials" o={eqO} fill={C.teal} size={18} />
      {defs[0] > 0 && <Card x={1240} y={784} w={610} h={150} opacity={defs[0]} stroke={C.teal} fill="#FFFFFF">
        <Txt x={1258} y={814} size={20} weight={800} fill={C.teal}>Osmosis:</Txt>
        <Txt x={1352} y={814} size={19} weight={700}>net movement of water molecules</Txt>
        <Txt x={1258} y={846} size={19} weight={700} opacity={defs[1]}>from a region of higher water potential</Txt>
        <Txt x={1258} y={876} size={19} weight={700} opacity={defs[2]}>to a region of lower water potential</Txt>
        <Txt x={1258} y={906} size={19} weight={700} opacity={defs[3]}>through a partially permeable membrane</Txt>
      </Card>}
    </g>
  );
}
