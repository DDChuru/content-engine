import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Stage, RegionLabels, C, Txt, Cite, SCHEM, PARTS, CY, U, clamp01} from '../kit';
import {BILAYER, fmmLayout, compPos, plPos} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';
import {QuoteTab} from '../Panels';
import {T4} from '../t4-palette';

export const SHOW7 = {...BILAYER, channel: 1, receptor: 1, carrier: 1, extrinsic: 1};
/** Beat 7 · Fluid (lateral drift within a layer; a tracer phospholipid swaps places with its neighbour) and mosaic
 * (proteins scattered through the bilayer). Schematic motion, not measured. */
export default function Beat07(s: any) {
  const t = gt(s), a = s.a, u = U, cy = CY, show = SHOW7;
  const Lf = fmmLayout({cx: 960, cy, u, show});
  const k = fe(a('drift'), 2.2), dip = Math.sin(Math.PI * clamp01(a('drift') / 2.2));
  const tint = fi(a('fluid'), 0.5) * (1 - fe(a('model'), 1.0));
  const rsh = 0.25 * fe(a('pdrift'), 2.5) * (1 - fe(a('mosaic'), 1.5));
  const mem = {show, chains: {receptor: 0}, tracer: 5, tracerTint: tint, plShift: {5: {dx: k, o: 1}, 6: {dx: -k, o: 1 - 0.65 * dip}}, compShift: {receptor: rsh}};
  const P0 = plPos({cx: 960, cy, u, t, show}, 5), trailX0 = P0.x, trailX1 = P0.x + k * u;
  const rc = compPos({cx: 960, cy, u, t, show}, 'receptor');
  const trails = 1 - fe(a('mosaic'), 0.8);
  const ch = compPos({cx: 960, cy, u, t, show}, 'channel'), ca = compPos({cx: 960, cy, u, t, show}, 'carrier'), ex = compPos({cx: 960, cy, u, t, show}, 'extrinsic');
  const H = PROT.H * u, outl = [ch, rc, ca].map((p, i) => ({x: p.x + (i === 1 ? rsh * u : 0), y: cy, w: PROT.W * u + 20, h: 2 * H + 20}));
  outl.push({x: ex.x, y: ex.y + 2, w: 1.9 * u, h: 1.0 * u});
  const fl = fi(a('fluid'), 0.4), mo = fi(a('mosaic'), 0.4);
  const tiles = fe(a('tiles'), 0.4) * (1 - fe(a('tiles') - 1.6, 0.5));
  const tab = fe(a('1972'), 0.6), tab2 = fi(a('modified'), 0.5);
  const q = 'syllabus p.21: "The fluid mosaic model, introduced in 1972, describes the way in which biological\nmolecules are arranged to form cell membranes."' + (tab2 > 0 ? '\n"The model continues to be modified as understanding improves …"' : '');
  return (
    <g>
      <Stage s={s} mem={mem} n={[30, 22]} />
      <RegionLabels cy={cy} u={u} x={90} oCore={0} />
      <Txt x={760} y={272} size={44} weight={800} anchor="middle" fill={fl > 0 ? C.primary : C.ink} opacity={fi(a('name'), 0.5) * (fl > 0 && mo > 0 ? 0.55 : 1)}>fluid</Txt>
      <Txt x={1160} y={272} size={44} weight={800} anchor="middle" fill={mo > 0 ? C.primary : C.ink} opacity={fi(a('name'), 0.5)}>mosaic</Txt>
      {/* tracer trail + receptor trail */}
      {a('drift') > 0 && trails > 0 && <path data-role="decor" d={`M${trailX0} ${P0.y - 0.62 * u}L${Math.max(trailX0 + 1, trailX1)} ${P0.y - 0.62 * u}`} stroke={T4.head} strokeWidth={5} strokeLinecap="round" opacity={0.6 * trails} />}
      {a('drift') > 0 && trails > 0 && <circle data-role="decor" cx={trailX0} cy={P0.y - 0.62 * u} r={5} fill={T4.headEdge} opacity={trails} />}
      {a('pdrift') > 0 && trails > 0 && <path data-role="decor" d={`M${rc.x} ${cy - H - 18}L${rc.x + rsh * u + 0.5} ${cy - H - 18}`} stroke={T4.proteinEdge} strokeWidth={5} strokeLinecap="round" opacity={0.6 * trails} />}
      <Lbl x={P0.x - 40} y={P0.y - 0.62 * u - 26} text="tracer phospholipid" anchor="end" o={fi(a('fluid'), 0.5) * trails} size={20} fill={T4.headEdge} />
      <Cite x={960} y={cy + 2.8 * u + 48} text="schematic lateral motion; not measured" anchor="middle" opacity={fi(a('drift'), 0.5) * trails} />
      {/* each stays in its own layer */}
      {fi(a('own'), 0.5) > 0 && <path data-role="decor" d={`M${Lf.x0 - 20} ${cy}H${Lf.x1 + 20}`} stroke={C.ink} strokeWidth={2.5} strokeDasharray="10 8" opacity={fi(a('own'), 0.5) * (1 - fe(a('shapes'), 0.6))} />}
      <Pill x={Lf.x1 + 30} y={cy + 8} text="each stays in its own layer (in this model)" o={fi(a('own'), 0.5)} />
      {/* mosaic: proteins outlined one after another */}
      {outl.map((o, i) => { const p = fi(a('shapes') - i * 0.35, 0.3); return p > 0 ? <rect key={i} data-role="decor" x={o.x - o.w / 2} y={o.y - o.h / 2} width={o.w} height={o.h} rx={16} fill="none" stroke={C.primary} strokeWidth={3.5} opacity={p * (0.4 + 0.6 * (1 - fe(a('1972'), 0.6)))} /> : null; })}
      {tiles > 0 && <g opacity={tiles}>
        <rect data-role="decor" x={1560} y={250} width={250} height={170} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <g data-role="drawing">{Array.from({length: 18}, (_, i) => { const c = i % 6, r = Math.floor(i / 6), sz = 22 + ((i * 7) % 3) * 8; return <rect key={i} x={1580 + c * 38 + ((i * 5) % 7)} y={268 + r * 48 + ((i * 3) % 9)} width={sz} height={sz * 0.8} rx={4} fill={i % 3 === 0 ? T4.protein : '#E8E2D4'} stroke={i % 3 === 0 ? T4.proteinEdge : '#B8B09E'} strokeWidth={1.5} />; })}</g>
        <Txt x={1685} y={444} size={17} weight={700} fill={C.muted} anchor="middle">a mosaic: tiles set in a surface</Txt>
      </g>}
      <Pill x={960} y={cy + 2.8 * u + 90} text="proteins scattered through the bilayer" anchor="middle" o={fi(a('tiles') - 1.4, 0.5)} fill={T4.proteinEdge} />
      {tab > 0 && <QuoteTab x={330} y={800} w={1260} quote={q} source="" opacity={tab} size={21} />}
      <Cite x={1850} y={cy + 2.8 * u + 48} text={SCHEM} anchor="end" opacity={0.6 + 0.4 * pulse(a('model'), 1.6)} fill={pulse(a('model'), 1.6) > 0.1 ? C.ink : C.muted} />
      <RBC x={1760} y={250} r={36} o={1 - tiles} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" opacity={tab > 0 ? 0 : 1} />
    </g>
  );
}
