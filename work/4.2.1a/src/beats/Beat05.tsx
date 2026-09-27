import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, PARTS, SCHEM, clamp01, OPEN, CUE, NETPX, RouteSlots, MemScene, memM, memGeo, MX, RBC, Card} from '../kit';
import {openState, OpenBase} from './Beat03';
import {Returned, openThumbTransform} from './Beat04';
import {fieldState, FieldTokens, CounterCard, SideTag, NetArrow, windowEvents, countIn} from '../DiffusionField';
import {O2Tok} from '../T4Tokens';
import {WaterField} from '../WaterField';

/** Dataset 2, Beat 5: new setup 24 / 8 at `setup`; the 5 s counted sequence at `pass` (6 in, 2 out → 20 / 12). */
export const b5 = () => ({origin: CUE(5, 'setup'), w0: CUE(5, 'pass'), evs: windowEvents(CUE(5, 'pass'), 6, 2, 5, 51)});
/** Right-hand counter column for membrane demonstrations. */
export function MemCounters({live, last, o = 1, hiLive = 0, hiLast = 0, liveTitle = 'current demonstration (5 s)', lastTitle = 'last completed demonstration', sub = 'illustrative counts', x = 1030}: any) {
  return (
    <g>
      {live && <CounterCard x={x} y={214} w={306} la="outside → cytoplasm" lb="cytoplasm → outside" n={live[0]} m={live[1]} title={liveTitle} sub={sub} o={o} hi={hiLive} />}
      {last && <CounterCard x={x} y={340} w={306} la="outside → cytoplasm" lb="cytoplasm → outside" n={last[0]} m={last[1]} title={lastTitle} sub={sub} o={o} hi={hiLast} />}
    </g>
  );
}
/** Vertical net arrow at the right edge of the membrane field (downward = into the cytoplasm). */
export function MemNet({net, label, o = 1, hi = 0}: any) {
  const len = NETPX * net, cy = memM(0).cy;
  return <g opacity={o < 1 ? o : undefined}><NetArrow x={MX.x1 - 40} y={cy - len / 2} dx={0} dy={1} len={len} hi={hi} />{len > 2 && <><Txt x={MX.x1 + 22} y={cy + 70} size={19} weight={800} fill="#C0453D">net movement:</Txt><Txt x={MX.x1 + 22} y={cy + 94} size={19} weight={800} fill="#C0453D">{label}</Txt></>}</g>;
}
/** Upper-right context inset: alveolus, capillary and a red blood cell with a ring where the section sits. */
export function LungInset({o = 1, t = 0}: any) {
  if (o <= 0) return null;
  const x = 1370, y = 196;
  const ax = x + 85, ay = y + 150, cx = x + 255, cy = y + 145;
  const toks = [0, 1, 2].map((i) => { const u = ((t * 0.35 + i / 3) % 1); return [ax + 30 + 140 * u, ay - 30 + 26 * i + 8 * Math.sin(u * 6)]; });
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={480} height={330} rx={14} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
      <g data-role="drawing">
        <circle cx={ax} cy={ay} r={66} fill="#FBE9EC" stroke="#B5707E" strokeWidth={3} />
        <rect x={cx - 55} y={y + 20} width={110} height={250} rx={16} fill="#E9A39C" stroke="#A63A33" strokeWidth={3} />
        <RBC x={cx} y={cy} r={40} />
        <circle cx={cx - 40} cy={cy} r={12} fill="none" stroke="#E0892B" strokeWidth={4} />
        {toks.map((p, i) => <O2Tok key={i} x={p[0]} y={p[1]} r={8} rot={i * 60} />)}
      </g>
      <path data-role="decor" d={`M${cx + 74} ${cy + 4}L${cx + 44} ${cy}`} stroke={C.muted} strokeWidth={1.8} fill="none" />
      <Txt x={ax} y={y + 250} size={20} weight={700} fill="#8E4B5A" anchor="middle">alveolus</Txt>
      <Txt x={cx + 76} y={y + 50} size={20} weight={700} fill="#A63A33">outside:</Txt>
      <Txt x={cx + 76} y={y + 74} size={20} weight={700} fill="#A63A33">blood plasma</Txt>
      <Txt x={cx + 80} y={cy - 16} size={20} weight={700} fill="#8E2A24">inside: red</Txt>
      <Txt x={cx + 80} y={cy + 10} size={20} weight={700} fill="#8E2A24">blood cell</Txt>
      <Txt x={cx + 80} y={cy + 36} size={20} weight={700} fill="#8E2A24">cytoplasm</Txt>
      <Txt x={x + 20} y={y + 308} size={20} weight={700} fill={C.muted} italic>Topic 9 context: named, not taught</Txt>
    </g>
  );
}
/** The Beat 3/4 open field without its middle-line tag (the tag would shrink below the size floor as the field turns). */
function OpenField({t, lineO = 1}: any) {
  const G = OPEN;
  return (
    <g>
      <rect data-role="decor" x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} rx={16} fill="#EEF6FB" stroke="#9FB6C6" strokeWidth={2.5} />
      <WaterField regions={[[G.x0 + 14, G.y0 + 14, G.m - 8, G.y1 - 14], [G.m + 8, G.y0 + 14, G.x1 - 14, G.y1 - 14]]} n={[26, 26]} t={t} />
      <path data-role="decor" d={`M${G.m} ${G.y0 + 6}V${G.y1 - 6}`} stroke="#5E6B75" strokeWidth={3} strokeDasharray="12 9" opacity={lineO} />
    </g>
  );
}
/** A slot fill that never shows the empty-slot name and the filled text both at readable opacity: a short dim of
 * the old name, then a swap into the new text fading up. */
export const slotFill = (age: number) => age < 0 ? 0 : age < 0.15 ? 0.22 * age / 0.15 : age < 0.2 ? 0.22 : Math.min(1, 0.78 + 0.22 * (age - 0.2) / 0.4);
/** Route-slot geometry for Beats 5–6 (filled slots need room for two lines). */
export const SLOT56 = {x: 1370, y: 600, w: 480, h: 78, gap: 8};
/** Region label for the hydrophobic core: below the membrane at the left, leader up into the tails. */
export function CoreLabel({o = 1}: any) {
  return <Lbl x={112} y={712} text="hydrophobic core" lx={150} ly={562} o={o} size={20} fill={C.muted} halo="#EEF6FB" />;
}

/** Beat 5 · Simple diffusion: the field turns (outside at the top), a bilayer slides in, the lung context; a new
 * setup 24 / 8 of freely dissolved O₂; the 5 s counted sequence (6 · 2 → 20 / 12) and only then the net arrow. */
export default function Beat05(s: any) {
  const t = gt(s), a = s.a;
  const grow = fe(a('open'), 1.2), turn = fe(a('turn'), 1.4), mem = fe(a('turn') - 1.2, 0.6);
  const slide = fe(a('slide'), 1.4);
  const M = memM(t), G = memGeo(M);
  const B = b5();
  const pre = fieldState({G, nA: 20, nB: 20, evs: [], t, origin: CUE(5, 'turn') + 1.2, seed: 5});
  const st = fieldState({G, nA: 24, nB: 8, evs: B.evs, t, origin: B.origin, seed: 6});
  const reset = fe(a('setup'), 0.5);
  const done = t >= B.w0 + 5;
  const live = a('pass') >= 0 ? countIn(B.evs, B.w0, B.w0 + 5, t) : a('setup') >= 0 ? [0, 0] : null;
  const net = done ? 4 * fe(t - (B.w0 + 5), 0.8) : 0;
  // the Beat 4 open field grows, then rotates 90° into the membrane configuration
  const G0 = OPEN, cxO = (G0.x0 + G0.x1) / 2, cyO = (G0.y0 + G0.y1) / 2;
  const scO = 0.34 + (0.62 - 0.34) * grow;
  const openO = 1 - mem;
  const opn = openState(t);
  // the caption line steps aside while the turning field sweeps across it
  const citeO = clamp01(1 - fi(a('turn'), 0.25) + fi(a('turn') - 1.8, 0.3));
  const S = SLOT56;
  const wx = MX.x0 - 17, wy0 = MX.y0 + 40, wy1 = MX.y1 - 40;
  return (
    <g>
      <Returned s={s} t={t} o={1 - fe(a('open'), 0.7)} cy={660 + 70 * fe(a('open'), 0.7)} />
      {openO > 0 && <g opacity={openO}>
        <g transform={turn > 0 || grow > 0 ? `translate(${553 * grow + (1 - grow) * (70 + (cxO - G0.x0) * 0.34)} ${572 * grow + (1 - grow) * (190 + (cyO - 188) * 0.34)}) rotate(${90 * turn}) scale(${scO}) translate(${-cxO} ${-cyO})` : openThumbTransform(1)}>
          <OpenField t={t} lineO={1 - turn} />
          <FieldTokens st={opn.st} k="o2" t={t} />
        </g>
      </g>}
      {mem > 0 && <g opacity={mem}>
        <MemScene s={s} t={t} mem={{}} water={1} labels={1} core={0} />
      </g>}
      {slide < 1 && mem > 0 && <rect data-role="decor" x={MX.x0 + 2 + (MX.x1 - MX.x0) * slide} y={M.cy - 2.9 * M.u} width={(MX.x1 - MX.x0 - 4) * (1 - slide)} height={5.8 * M.u} fill="#EEF6FB" />}
      {mem > 0 && <FieldTokens st={pre} k="o2" t={t} opacity={mem * 0.55 * (1 - reset)} />}
      {reset > 0 && <FieldTokens st={st} k="o2" t={t} opacity={reset} hi={a('pass') >= 0 && !done ? st.pts.filter((p: any) => p.crossing).map((p: any) => p.i) : []} />}
      {mem > 0 && <CoreLabel o={mem * fi(a('slide') - 0.8, 0.5)} />}
      {mem > 0 && slide > 0.5 && <g opacity={fi(a('slide') - 0.6, 0.5)}>
        <path data-role="decor" d={`M${wx - 14} ${wy0}L${wx + 14} ${wy0}L${wx} ${wy1}Z`} fill="#D7C2E6" />
        <g transform={`rotate(-90 ${wx} ${wy0 + 44})`}><Txt x={wx} y={wy0 + 44 + 6} size={20} weight={800} fill="#4B2F63" anchor="middle">higher</Txt></g>
        <g transform={`rotate(-90 ${wx} ${wy1 - 10})`}><Txt x={wx} y={wy1 - 10 + 6} size={20} weight={800} fill="#4B2F63" anchor="start">lower</Txt></g>
      </g>}
      {reset > 0 && <g>
        <SideTag x={MX.x1 - 50} y={MX.y0 + 44} n={st.a} o={reset} />
        <SideTag x={MX.x1 - 50} y={MX.y1 - 56} n={st.b} o={reset} />
        <Pill x={MX.x1 - 92} y={MX.y0 + 48} text="higher" anchor="end" o={fi(a('hilo'), 0.4)} size={20} />
        <Pill x={MX.x1 - 92} y={MX.y1 - 52} text="lower" anchor="end" o={fi(a('hilo'), 0.4)} size={20} />
        <Pill x={(MX.x0 + MX.x1) / 2} y={MX.y0 - 12} text="new setup; set starting counts (not a continuation of the 20 / 20 field)" anchor="middle" o={fi(a('setup'), 0.4) * (1 - fe(a('small'), 0.5))} size={20} fill={C.primary} />
      </g>}
      <MemCounters live={done ? null : live} last={done ? [6, 2] : null} o={reset} hiLast={pulse(t - (B.w0 + 5), 1.2)} />
      <MemNet net={net} label="simple diffusion" />
      <LungInset o={fi(a('rbc'), 0.5)} t={t} />
      {a('hb') >= 0 && <Card x={1030} y={470} w={306} h={118} opacity={fi(a('hb'), 0.4)} stroke="#B2352C" fill="#FFFFFF">
        <Txt x={1044} y={497} size={20} weight={800} fill="#B2352C">freely dissolved O₂;</Txt>
        <Txt x={1044} y={522} size={20} weight={700}>haemoglobin-bound oxygen</Txt>
        <Txt x={1044} y={547} size={20} weight={700}>not counted; illustrative</Txt>
        <Txt x={1044} y={572} size={20} weight={700}>gradient during uptake</Txt>
      </Card>}
      {a('small') >= 0 && <g opacity={fi(a('small'), 0.4)}>
        <circle data-role="decor" cx={868} cy={346} r={62} fill="#FFFFFF" stroke={C.ink} strokeWidth={3} />
        <O2Tok x={868} y={346} r={30} rot={20} />
        <Pill x={868} y={436} text="small · non-polar" anchor="middle" size={20} fill="#B2352C" />
      </g>}
      <Lbl x={784} y={334} text="CO₂ crosses the bilayer" anchor="end" o={fi(a('simple'), 0.4)} size={20} weight={600} fill={C.muted} italic halo="#EEF6FB" />
      <Lbl x={784} y={360} text="the same way (not animated here)" anchor="end" o={fi(a('simple'), 0.4)} size={20} weight={600} fill={C.muted} italic halo="#EEF6FB" />
      <Pill x={1030} y={694} text="no transport protein" o={fi(a('simple') - 0.4, 0.4)} fill={C.teal} />
      <RouteSlots x={1360 + (S.x - 1360) * grow} y={330 + (S.y - 330) * grow} w={500 + (S.w - 500) * grow} h={92 + (S.h - 92) * grow} gap={18 + (S.gap - 18) * grow} fill={[slotFill(a('simple')), 0, 0, 0]} hi={[pulse(a('simple'), 1.4), 0, 0, 0]} o={1} />
      <Cite x={MX.x1} y={948} text={SCHEM + '; ' + PARTS} anchor="end" opacity={citeO} />
    </g>
  );
}
