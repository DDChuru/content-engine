import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, PARTS, SCHEM, clamp01, CUE, RouteSlots, MemScene, memM, memGeo, MX, Card, lanes} from '../kit';
import {b5, MemCounters, MemNet, LungInset, SLOT56, CoreLabel} from './Beat05';
import {fieldState, FieldTokens, SideTag, windowEvents, countIn} from '../DiffusionField';
import {O2Tok, GlucoseTok} from '../T4Tokens';

/** Dataset 2, Beat 6: steeper initial gradient 32 / 8, same 5 s window from `steep` (8 in, 2 out → 26 / 14). */
export const b6 = () => ({w0: CUE(6, 'steep'), evs: windowEvents(CUE(6, 'steep'), 8, 2, 5, 61)});
function Thermo({x, y, level = 0, o = 1}: any) {
  if (o <= 0) return null;
  const h = 150, f = 40 + (h - 50) * clamp01(level);
  return (
    <g data-role="drawing" opacity={o < 1 ? o : undefined}>
      <rect x={x - 12} y={y - h} width={24} height={h} rx={12} fill="#FFFFFF" stroke="#5E6B75" strokeWidth={3} />
      <circle cx={x} cy={y + 8} r={20} fill="#C0453D" stroke="#5E6B75" strokeWidth={3} />
      <rect x={x - 6} y={y - f} width={12} height={f + 4} rx={6} fill="#C0453D" />
    </g>
  );
}
const ROWS = ['steeper gradient', 'higher temperature', 'larger surface area', 'shorter distance', 'bilayer passage: size, lipid solubility'];
/** Beat 6 · What makes net diffusion faster: a steeper-gradient comparison (counted, 8 · 2 → 26 / 14), then higher
 * temperature, larger area and shorter distance (qualitative; baseline restored before each); bilayer passage. */
export default function Beat06(s: any) {
  const t = gt(s), a = s.a;
  const M = memM(t), G = memGeo(M);
  const B5 = b5(), B6 = b6();
  const tS = CUE(6, 'steep'), tT = CUE(6, 'temp'), tA = CUE(6, 'area'), tN = CUE(6, 'noeq');
  const X = 0.5;   // cross-fade of each labelled reset
  const layers: any[] = [];
  const add = (key: string, st: any, o: number, sp = 1) => { if (o > 0) layers.push(<FieldTokens key={key} st={st} k="o2" t={t} opacity={o} />); };
  add('b5', fieldState({G, nA: 24, nB: 8, evs: B5.evs, t, origin: B5.origin, seed: 6}), 1 - fe(t - tS, X));
  const stS = fieldState({G, nA: 32, nB: 8, evs: B6.evs, t, origin: tS, seed: 7});
  add('steep', stS, fe(t - tS, X) * (1 - fe(t - tT, X)));
  add('temp', fieldState({G, nA: 24, nB: 8, evs: [], t, origin: tT, seed: 8, speed: 1.9}), fe(t - tT, X) * (1 - fe(t - tA, X)));
  add('area', fieldState({G, nA: 24, nB: 8, evs: [], t, origin: tA, seed: 9}), fe(t - tA, X) * (1 - fe(t - tN, X)));
  add('end', fieldState({G, nA: 26, nB: 14, evs: [], t, origin: tN, seed: 10}), fe(t - tN, X));
  const qual = t >= tT && t < tN;
  // counters and side tags are set aside for the qualitative factors (fade out at `temp`, back after `noeq`)
  const cntO = t < tT ? 1 : t < tN ? 1 - fe(t - tT, 0.3) : fe(t - tN - 0.3, 0.4);
  const liveS = t >= tS && t < tS + 5 ? countIn(B6.evs, tS, tS + 5, t) : null;
  const last = t < tS + 5 ? [6, 2] : [8, 2];
  const pops = t < tS ? [20, 12] : t < tN ? [stS.a, stS.b] : [26, 14];
  const net = t < tS ? 4 : t < tS + 5 ? 0 : 6 * fe(t - (tS + 5), 0.8);
  const netO = qual ? 1 - fe(t - tT, 0.3) : t >= tN ? fe(t - tN - 0.3, 0.4) : 1;
  const rows = [fi(a('steep'), 0.4), fi(a('temp'), 0.4), fi(a('area'), 0.4), fi(a('dist'), 0.4), fi(a('bil'), 0.4)];
  const thermoLevel = fe(a('temp'), 1.5) * (1 - fe(a('area'), 0.8));
  const insetO = fi(a('area') - 0.35, 0.4) * (1 - fe(a('noeq'), 0.4));
  const slotO = Math.min(1, 1 - fe(a('area'), 0.3) + fi(a('noeq') - 0.5, 0.5));
  const b5O = 1 - fe(a('open'), 0.35);   // Beat 5 leftovers leave as the factor panel opens
  // bilayer passage: one O₂ passes the core, a glucose token held above stays outside (qualitative)
  const lx = lanes(M)[1][0], bo = a('bil');
  const o2y = bo < 0 ? 0 : M.cy - 5 * M.u + clamp01((bo - 0.8) / 1.6) * 10 * M.u;
  const gx = lx + 70, gy = M.cy - 4.4 * M.u + 5 * Math.sin(t * 2);
  const pillX = (MX.x0 + MX.x1) / 2, py = MX.y0 - 12;
  const S = SLOT56;
  return (
    <g>
      <MemScene s={s} t={t} core={0} />
      {layers}
      <CoreLabel />
      {bo >= 0 && bo < 3.4 && <g data-role="drawing"><circle cx={lx} cy={o2y} r={17} fill="none" stroke="#F2A93B" strokeWidth={3} /><O2Tok x={lx} y={o2y} r={10} /></g>}
      {bo >= 0 && <g data-role="drawing" opacity={1 - fe(a('noeq'), 0.5)}><GlucoseTok x={gx} y={gy} r={15} /></g>}
      <Pill x={MX.x1 - 20} y={330} text="glucose stays outside here" anchor="end" o={fi(bo - 0.6, 0.4) * (1 - fe(a('noeq'), 0.4))} size={20} fill="#A4561A" />
      <SideTag x={MX.x1 - 50} y={MX.y0 + 44} n={pops[0]} o={cntO} />
      <SideTag x={MX.x1 - 50} y={MX.y1 - 56} n={pops[1]} o={cntO} />
      <Pill x={MX.x1 - 92} y={MX.y0 + 48} text="higher" anchor="end" o={b5O} size={20} />
      <Pill x={MX.x1 - 92} y={MX.y1 - 52} text="lower" anchor="end" o={b5O} size={20} />
      <Pill x={pillX} y={py} text="new comparison; set starting counts 32 / 8 (same area, temperature, membrane, 5 s window)" anchor="middle" o={fi(a('steep'), 0.4) * (1 - fe(a('gap') + 1.5, 0.5))} size={20} fill={C.primary} />
      <Pill x={pillX} y={py} text="baseline restored: 24 / 8 · qualitative; not counted" anchor="middle" o={fi(a('temp'), 0.4) * (1 - fe(a('area'), 0.3))} size={20} fill={C.primary} />
      <Pill x={pillX} y={py} text="baseline restored · same gradient and temperature · qualitative; not counted" anchor="middle" o={fi(a('area') - 0.3, 0.4) * (1 - fe(a('noeq'), 0.3))} size={20} fill={C.primary} />
      <Pill x={pillX} y={py} text="reset: the retained steeper-gradient result" anchor="middle" o={fi(a('noeq') - 0.3, 0.4)} size={20} fill={C.primary} />
      {cntO > 0 && <MemCounters live={liveS} last={last} o={cntO} hiLast={pulse(a('gap'), 1.4)} />}
      {qual && <g opacity={fi(t - tT - 0.3, 0.4) * (1 - fe(a('noeq'), 0.3))}>
        <Txt x={1030} y={236} size={20} weight={700} fill={C.muted}>counter set aside:</Txt>
        <Pill x={1030} y={272} text="qualitative; not counted" size={20} />
      </g>}
      <Txt x={1030} y={494} size={20} weight={700} fill="#C0453D" opacity={fi(a('gap'), 0.4) * (1 - fe(a('temp'), 0.3)) + fi(a('noeq') - 0.3, 0.4)}>net 6 in this 5 s window, was 4</Txt>
      <MemNet net={net} label="simple diffusion" o={netO} />
      <Thermo x={1060} y={850} level={thermoLevel} o={fi(a('temp'), 0.4) * (1 - fe(a('noeq'), 0.4))} />
      <Pill x={1100} y={782} text="more kinetic energy" o={fi(a('ke'), 0.4) * (1 - fe(a('area'), 0.4))} fill="#A4561A" size={20} />
      {b5O > 0 && <g opacity={b5O}>
        <circle data-role="decor" cx={868} cy={346} r={62} fill="#FFFFFF" stroke={C.ink} strokeWidth={3} />
        <O2Tok x={868} y={346} r={30} rot={20} />
        <Pill x={868} y={436} text="small · non-polar" anchor="middle" size={20} fill="#B2352C" />
        <Lbl x={784} y={334} text="CO₂ crosses the bilayer" anchor="end" size={20} weight={600} fill={C.muted} italic halo="#EEF6FB" />
        <Lbl x={784} y={360} text="the same way (not animated here)" anchor="end" size={20} weight={600} fill={C.muted} italic halo="#EEF6FB" />
        <Pill x={1030} y={694} text="no transport protein" fill={C.teal} />
      </g>}
      <LungInset o={b5O} t={t} />
      {b5O > 0 && <Card x={1030} y={470} w={306} h={118} opacity={b5O} stroke="#B2352C" fill="#FFFFFF">
        <Txt x={1044} y={497} size={20} weight={800} fill="#B2352C">freely dissolved O₂;</Txt>
        <Txt x={1044} y={522} size={20} weight={700}>haemoglobin-bound oxygen</Txt>
        <Txt x={1044} y={547} size={20} weight={700}>not counted; illustrative</Txt>
        <Txt x={1044} y={572} size={20} weight={700}>gradient during uptake</Txt>
      </Card>}
      {/* factor panel */}
      {a('open') >= 0.3 && <Card x={1370} y={196} w={480} h={366} opacity={fi(a('open') - 0.3, 0.4)} stroke={C.teal} fill="#FFFFFF">
        <Txt x={1390} y={230} size={21} weight={800} fill={C.teal}>faster net diffusion</Txt>
        <Txt x={1390} y={256} size={20} weight={700} fill={a('noeq') >= 0 ? C.primary : C.muted}>{a('noeq') >= 0 ? 'direction of each effect only' : 'qualitative; no equation'}</Txt>
        {ROWS.map((r, i) => rows[i] > 0 && <g key={i} opacity={rows[i]}>
          <Txt x={1390} y={296 + i * 52} size={20} weight={700}>{`${i + 1} · ${r}`}</Txt>
          {i === 4 && <Txt x={1418} y={321 + i * 52} size={20} weight={600} fill={C.muted}>small, non-polar molecules cross readily</Txt>}
          {(i === 2 || i === 3) && <Txt x={1418} y={320 + i * 52} size={20} weight={700} fill={C.primary} opacity={fi(a('sa'), 0.4)}>calculated and tested in 4.2.3-4</Txt>}
        </g>)}
      </Card>}
      {/* comparison insets: area (1 : 1.5) and thickness, only one factor differs in each */}
      {insetO > 0 && <g opacity={insetO}>
        <rect data-role="decor" x={1370} y={604} width={480} height={330} rx={14} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <Txt x={1388} y={634} size={20} weight={800} fill={C.muted}>larger surface area (qualitative)</Txt>
        <g data-role="drawing">
          {[[1400, 120, 2], [1560, 180, 3]].map(([x0, w, n], k) => <g key={k}><rect x={x0} y={674} width={w} height={22} fill="#E8B45A" stroke="#A36B17" strokeWidth={1.5} />{Array.from({length: n}, (_, i) => { const x = x0 + (w * (i + 0.5)) / n, yy = 652 + ((t * 40 + i * 13) % 64); return <O2Tok key={i} x={x} y={yy} r={7} />; })}</g>)}
        </g>
        <Txt x={1560} y={748} size={20} weight={700} fill={C.ink}>half as much again: more cross</Txt>
        <g opacity={fi(a('dist'), 0.4)}>
          <Txt x={1388} y={790} size={20} weight={800} fill={C.muted}>shorter distance · only thickness differs</Txt>
          <g data-role="drawing"><rect x={1400} y={808} width={150} height={70} fill="#E8B45A" stroke="#A36B17" strokeWidth={1.5} /><rect x={1620} y={826} width={150} height={34} fill="#E8B45A" stroke="#A36B17" strokeWidth={1.5} /></g>
          <path data-role="decor" d="M1475 800V886M1467 876L1475 888L1483 876M1695 816V868M1687 858L1695 870L1703 858" stroke={C.ink} strokeWidth={3} fill="none" />
          <Pill x={1695} y={914} text="shorter distance" anchor="middle" size={20} />
        </g>
      </g>}
      <RouteSlots x={S.x} y={S.y} w={S.w} h={S.h} gap={S.gap} fill={[1, 0, 0, 0]} o={slotO} />
      <Cite x={MX.x1} y={948} text={SCHEM + '; ' + PARTS} anchor="end" />
    </g>
  );
}
