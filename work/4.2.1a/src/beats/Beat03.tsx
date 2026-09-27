import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, PARTS, clamp01, OPEN, OPEN_ORIGIN, openWindows, openEvents, winState, NETPX, CUE, Card} from '../kit';
import {WaterField} from '../WaterField';
import {fieldState, FieldTokens, CounterCard, SideTag, NetArrow, walk} from '../DiffusionField';
import {WaterTok} from '../T4Tokens';

const G = OPEN;
/** The `open` field's O₂ state at global time t (40 tokens, 30 left / 10 right, Dataset 1 events), with the drift-in
 * from the field edges during the first 1.2 s after the tokens are introduced. */
export function openState(t: number) {
  const o0 = OPEN_ORIGIN(), evs = openEvents();
  const st = fieldState({G, nA: 30, nB: 10, evs, t, origin: o0, seed: 3});
  const k = clamp01((t - o0) / 1.2), e = k * k * (3 - 2 * k);
  if (k < 1) st.pts = st.pts.map((p: any) => { const ex = p.i < 30 ? G.x0 - 20 : G.x1 + 20; return {...p, x: ex + (p.x - ex) * e}; });
  return {st, evs, o: clamp01((t - o0) / 0.4)};
}
/** Ambient water + the dashed middle line + its label + particle caption. */
export function OpenBase({t, lineO = 1, speed = 1}: any) {
  return (
    <g>
      <rect data-role="decor" x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} rx={16} fill="#EEF6FB" stroke="#9FB6C6" strokeWidth={2.5} />
      <WaterField regions={[[G.x0 + 14, G.y0 + 14, G.m - 8, G.y1 - 14], [G.m + 8, G.y0 + 14, G.x1 - 14, G.y1 - 14]]} n={[26, 26]} t={t} speed={speed} />
      <path data-role="decor" d={`M${G.m} ${G.y0 + 6}V${G.y1 - 6}`} stroke="#5E6B75" strokeWidth={3} strokeDasharray="12 9" opacity={lineO} />
      <Pill x={G.m} y={G.y1 + 30} text="middle line (no membrane)" anchor="middle" size={17} o={lineO} />
    </g>
  );
}
/** Live counter (current window) and retained card (last completed window) for the open field. */
export function OpenCounters({t, cx = G.m, cardX = G.x0 + 830, cardY = 188, o = 1, hiLive = 0, hiLast = 0}: any) {
  const wins = openWindows(), evs = openEvents(), ws = winState(wins, evs, t);
  return (
    <g>
      {ws.cur && <CounterCard x={cx - 165} y={188} w={330} n={ws.cur.c[0]} m={ws.cur.c[1]} title="current five-second window" sub="crossings in each 5 s window; illustrative counts" o={o} hi={hiLive} />}
      {ws.last && <CounterCard x={cardX} y={cardY} w={330} n={ws.last.f} m={ws.last.r} title="last completed five-second window" sub="illustrative counts" o={o} hi={hiLast} />}
    </g>
  );
}

/** Beat 3 · Random movement, net movement: water tokens in random motion; a highlighted zigzag and a collision;
 * 40 O₂ tokens settle 30 | 10; window 1 (12 · 4 → 22 / 18) completes before its result shows; net arrow; definition. */
export default function Beat03(s: any) {
  const t = gt(s), a = s.a;
  const {st, o} = openState(t);
  // highlighted water token and its fading trail
  const hw = (tt: number) => walk(900, 0, s.sc.start, [400, 520], tt, G, 1.4, 21);
  const trailO = fi(a('random'), 0.4) * (1 - fe(a('more'), 0.5));
  const trail = trailO > 0 ? Array.from({length: 14}, (_, k) => hw(t - k * 0.12)) : [];
  // collision pair: approach 1.0 s, meet, rebound 1.0 s in new directions
  const ca = a('collide');
  const coll = ca >= 0 && ca < 2.6 ? (() => {
    const P = [1000, 480], k = clamp01(ca / 1.0), r = clamp01((ca - 1.0) / 1.0);
    const A = ca < 1.0 ? [P[0] - 140 * (1 - k), P[1] - 60 * (1 - k)] : [P[0] - 20 - 120 * r, P[1] + 110 * r];
    const B = ca < 1.0 ? [P[0] + 140 * (1 - k), P[1] + 50 * (1 - k)] : [P[0] + 20 + 130 * r, P[1] - 100 * r];
    return [A, B];
  })() : null;
  const wins = openWindows(), w1 = wins[0][0], done1 = t >= w1 + 5;
  const netLen = done1 ? NETPX * 8 * fe(a('net'), 0.8) : 0;
  const crossHi = a('both') >= 0 && a('net') < 0 ? st.pts.filter((p: any) => p.crossing).map((p: any) => p.i) : [];
  const defs = [fi(a('def'), 0.5), fi(a('def') - 1.6, 0.5), fi(a('def') - 3.6, 0.5)];
  return (
    <g>
      <OpenBase t={t} />
      {trail.length > 0 && <g opacity={trailO}><path data-role="decor" d={'M' + trail.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')} stroke="#2F6B8F" strokeWidth={2.5} fill="none" strokeDasharray="5 4" /><g data-role="drawing"><circle cx={trail[0][0]} cy={trail[0][1]} r={15} fill="none" stroke="#F2A93B" strokeWidth={3} /><WaterTok x={trail[0][0]} y={trail[0][1]} r={8} /></g></g>}
      {coll && <g data-role="drawing">{coll.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r={15} fill="none" stroke="#F2A93B" strokeWidth={3} /><WaterTok x={p[0]} y={p[1]} r={8} /></g>)}</g>}
      <FieldTokens st={st} k="o2" t={t} opacity={o} hi={crossHi} />
      <Lbl x={G.x0 + 20} y={G.y0 - 14} text="oxygen (dissolved)" o={fi(a('more'), 0.5)} size={22} fill="#B2352C" />
      <SideTag x={G.x0 + 44} y={G.y0 + 48} n={st.a} o={fi(a('more') - 1.2, 0.4)} />
      <SideTag x={G.x1 - 44} y={G.y0 + 48} n={st.b} o={fi(a('more') - 1.2, 0.4)} />
      <Pill x={G.x0 + 86} y={G.y0 + 50} text="left: higher concentration" o={fi(a('more') - 1.4, 0.4)} size={16} />
      <Pill x={G.x1 - 86} y={G.y0 + 50} text="right: lower concentration" anchor="end" o={fi(a('more') - 1.4, 0.4)} size={16} />
      {a('counter') >= 0 && <OpenCounters t={t} o={fi(a('counter'), 0.4)} hiLive={pulse(a('lr'), 1.2)} hiLast={pulse(a('lr') - 0.4, 1.2)} />}
      <NetArrow x={G.m - netLen / 2} y={G.y1 + 74} len={netLen} label="net movement" lx={G.m + 260} ly={G.y1 + 81} anchor="start" />
      {fi(a('net'), 0.5) > 0 && <g opacity={fi(a('net') - 0.4, 0.5)}>
        <path data-role="decor" d={`M${G.x0 + 10} ${G.y1 + 112}L${G.x1 - 10} ${G.y1 + 124}L${G.x0 + 10} ${G.y1 + 136}Z`} fill="#D7C2E6" />
        <Txt x={G.x0 + 24} y={G.y1 + 131} size={17} weight={700} fill="#4B2F63">concentration gradient: higher → lower</Txt>
      </g>}
      {defs[0] > 0 && <Card x={1350} y={470} w={520} h={250} opacity={defs[0]} stroke={C.teal} fill="#FFFFFF">
        <Txt x={1372} y={516} size={27} weight={800} fill={C.teal}>Diffusion:</Txt>
        <Txt x={1372} y={562} size={24} weight={700} opacity={defs[0]}>net movement of particles</Txt>
        <Txt x={1372} y={604} size={23} weight={700} opacity={defs[1]}>from higher to lower concentration</Txt>
        <Txt x={1372} y={646} size={24} weight={700} opacity={defs[2]}>as a result of their</Txt>
        <Txt x={1372} y={682} size={24} weight={700} opacity={defs[2]}>random movement</Txt>
      </Card>}
      <Cite x={1850} y={940} text={PARTS} anchor="end" />
    </g>
  );
}
