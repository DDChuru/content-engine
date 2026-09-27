import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, PARTS, SCHEM, clamp01, OPEN, openWindows, openEvents, NETPX, BSTART, RouteSlots, Stage, fmmLayout, FULL, ATPTag, winState} from '../kit';
import {openState, OpenBase, OpenCounters} from './Beat03';
import {FieldTokens, NetArrow, SideTag, CounterCard} from '../DiffusionField';
import {GlucoseTok, O2Tok, IonTok} from '../T4Tokens';

const G = OPEN;
/** Net arrow state of the open field at global t: window-1 length (net 8) until window 2 completes (20 / 20), then a
 * 1 s fade to zero; zero through every equal-state window. */
export function openNet(t: number) {
  const w = openWindows();
  if (t < w[0][0] + 5) return 0;
  const w2end = w[1][0] + 5;
  if (t < w2end) return NETPX * 8;
  return NETPX * 8 * (1 - clamp01((t - w2end) / 1.0));
}
/** The Beat 1 membrane section returned at centre with O₂, ion, glucose and water tokens above it (no crossing). */
export function Returned({s, t, o = 1, cx = 880, cy = 660, u = 34}: any) {
  if (o <= 0) return null;
  const M = {cx, cy, u, t, show: FULL}, Lf = fmmLayout(M);
  const top = Lf.top - 2.2 * u;
  const toks = [['o2', -300], ['ion', -170], ['glucose', -40], ['o2', 90], ['ion', 210], ['glucose', 320]];
  return (
    <g opacity={o < 1 ? o : undefined}>
      <Stage s={s} cx={cx} cy={cy} u={u} xw={[Lf.x0, Lf.x1]} waterTop={top - 120} waterBottom={Lf.bottom + 110} n={[14, 10]} mem={{show: FULL}} />
      <g data-role="drawing">{toks.map(([k, dx]: any, i) => { const x = cx + dx + 12 * Math.sin(t * 0.6 + i), y = top - 40 - 22 * ((i % 2)) + 8 * Math.sin(t * 0.8 + i * 2); return k === 'o2' ? <O2Tok key={i} x={x} y={y} r={10} rot={t * 20 + i * 40} /> : k === 'ion' ? <IonTok key={i} x={x} y={y} r={12} /> : <GlucoseTok key={i} x={x} y={y} r={14} rot={t * 12} />; })}</g>
      <Cite x={Lf.x1} y={Lf.bottom + 136} text={SCHEM} anchor="end" />
    </g>
  );
}
/** The open field shrunk to a thumbnail at the upper left (k = 0 full size, 1 thumbnail). */
export function openThumbTransform(k: number) {
  const sc = 1 - 0.66 * k, tx = (70 - G.x0 * sc) * k, ty = (190 - 188 * sc) * k;
  return k > 0 ? `translate(${tx} ${ty}) scale(${sc})` : undefined;
}

/** Beat 4 · Equal, but still moving; why passive matters: window 2 (9 · 7 → 20 / 20), the arrow fades at once;
 * balanced 8 · 8 windows; kinetic energy, no ATP, passive; the field shrinks, the membrane returns, four route slots. */
export default function Beat04(s: any) {
  const t = gt(s), a = s.a;
  const {st} = openState(t);
  const wins = openWindows(), b4 = BSTART(4), eq = t >= wins[1][0] + 5;
  const shrink = fe(a('exch'), 1.2);
  const stillHi = a('still') >= 0 && a('fades') < 0 ? st.pts.filter((p: any) => p.crossing).map((p: any) => p.i) : [];
  const trailsHi = a('drove') >= 0 && a('noatp') < 0 ? [2, 7, 12, 25, 33, 38] : [];
  const net = openNet(t);
  const endO = 1 - fe(a('exch'), 0.6);
  // No text is ever drawn scaled down: every text inside the shrinking field fades out BEFORE the shrink starts;
  // the thumbnail keeps only the drawing, and its retained result is shown 1:1 in a card beneath it.
  const textO = 1 - clamp01((a('exch') + 0.5) / 0.5);
  const ws = winState(wins, openEvents(), t);
  const thumbCardO = fi(a('exch') - 1.2, 0.4);
  return (
    <g>
      <g transform={openThumbTransform(shrink)}>
        <OpenBase t={t} labelO={textO} />
        <FieldTokens st={st} k="o2" t={t} hi={[...stillHi, ...trailsHi]} />
        <SideTag x={G.x0 + 44} y={G.y0 + 48} n={st.a} o={textO} />
        <SideTag x={G.x1 - 44} y={G.y0 + 48} n={st.b} o={textO} />
        <OpenCounters t={t} o={textO} hiLive={pulse(a('level'), 1.4) + pulse(a('closer'), 1.2)} />
        {trailsHi.length > 0 && <g data-role="decor" opacity={pulse(a('drove'), 2.5)}>{st.pts.filter((p: any) => trailsHi.includes(p.i)).map((p: any) => <path key={p.i} d={`M${p.x - 40} ${p.y + 6}L${p.x - 14} ${p.y}`} stroke="#E0892B" strokeWidth={4} strokeLinecap="round" />)}</g>}
        <NetArrow x={G.m - NETPX * 4} y={G.y1 + 74} len={net} label="net movement" lx={G.m + 260} ly={G.y1 + 81} anchor="start" />
        {a('fades') >= 0 && <path data-role="decor" d={`M${G.m - NETPX * 4} ${G.y1 + 74}H${G.m + NETPX * 4}`} stroke="#C0453D" strokeWidth={3} strokeDasharray="6 7" opacity={pulse(a('fades'), 2.2) * endO} />}
        <Lbl x={G.x0 + 4} y={G.y0 - 14} text="concentrations equal" o={fi(t - (wins[1][0] + 5), 0.4) * textO * (eq ? 1 : 0)} size={22} fill={C.teal} />
      </g>
      {ws.last && <CounterCard x={70} y={420} w={340} n={ws.last.f} m={ws.last.r} title="last completed five-second window" sub={`sides: ${st.a} / ${st.b}`} o={thumbCardO} />}
      <Pill x={G.m - 60} y={G.y1 + 130} text="no net movement; movement continues" anchor="middle" o={fi(a('fades'), 0.4) * endO} fill={C.primary} />
      <Pill x={1350} y={560} text="kinetic energy of the particles" o={fi(a('drove'), 0.4) * endO} fill="#A4561A" />
      {a('noatp') >= 0 && <g opacity={fi(a('noatp'), 0.4) * endO}><ATPTag x={1400} y={640} struck /><Pill x={1450} y={646} text="no ATP used" /></g>}
      <Txt x={1350} y={760} size={52} weight={800} fill={C.primary} opacity={fi(a('passive'), 0.4) * endO}>passive</Txt>
      <Returned s={s} t={t} o={fe(a('exch') - 0.4, 0.8)} />
      <RouteSlots x={1360} y={330} o={fi(a('routes'), 0.5)} />
      <Cite x={1850} y={940} text={PARTS} anchor="end" />
    </g>
  );
}
