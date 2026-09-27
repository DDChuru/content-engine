import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Stage, RegionLabels, Wash, Bracket, C, Txt, Cite, SCHEM, PARTS, CY, U, clamp01} from '../kit';
import {fmmLayout, compPos, Glycolipid} from '../FluidMosaicMembrane';
import {WaterTok} from '../T4Tokens';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';
import {Tray} from './Beat08';
import {SHOW7} from './Beat07';

export const SHOW8 = {...SHOW7, cholOut: 1, cholIn: 1};
/** Beat 9 · Glycolipids: lipid part in the outer layer, carbohydrate chain projecting from the outer surface. */
export default function Beat09(s: any) {
  const t = gt(s), a = s.a, u = U, cy = CY;
  const ins = clamp01((a('outer') - 0.9) / 2.0);
  const show = {...SHOW8, glycolipid: ins};
  const Lf = fmmLayout({cx: 960, cy, u, show});
  const L0 = fmmLayout({cx: 960, cy, u, show: {...SHOW8, glycolipid: 0}});
  // the large glycolipid: appears at right, then shrinks and travels to the section's left edge (0.9 s), then slides in
  const big = fe(a('gl'), 0.6), sh = fe(a('outer'), 0.9);
  const bx = 1560 + (L0.x0 - 1.6 * u - 1560) * sh, by = 520 + (Lf.outerHead - 520) * sh, bu = 120 + (u - 120) * sh;
  const drawn = a('outer') < 0.9;
  const g = compPos({cx: 960, cy, u, t, show}, 'glycolipid');
  const chainTop = g.y - 0.3 * u * 0.85;
  const beads = [0, 1, 2].map((k) => ({x: g.x, y: chainTop - (k + 1) * 0.36 * u})).concat([{x: g.x + 0.36 * u * 0.8, y: chainTop - 2 * 0.36 * u - 0.36 * u * 0.55}]);
  const hb = fi(a('hphil'), 0.5);
  return (
    <g>
      <Wash x={g.x - 1.6 * u} y={cy - 1.5 * u} w={3.2 * u} h={1.5 * u} o={0.9 * pulse(a('tails'), 2.0)} />
      <Stage s={s} mem={{show, chains: {receptor: 0}}} n={[30, 30]} />
      <RegionLabels cy={cy} u={u} x={90} oCore={0} hiIn={pulse(a('notcyto'), 1.6)} />
      <Lbl x={Lf.x0 - 50} y={cy + 8} text="hydrophobic core" size={22} anchor="end" fill={C.muted} />
      <Tray items={['glycolipid', 'glycoprotein']} lift={{glycolipid: fe(a('open'), 0.6) + fe(a('gl'), 0.6)}} t={t} />
      {drawn && big > 0 && <g opacity={big}>
        <Glycolipid x={bx} y={by} u={bu} t={t} />
        <Lbl x={bx + 1.0 * bu} y={by + 1.2 * bu} text="lipid part (schematic)" o={1 - sh} size={22} lx={bx + 0.3 * bu} ly={by + 0.9 * bu} />
        <Lbl x={bx + 1.0 * bu} y={by - 1.2 * bu} text="carbohydrate chain" o={1 - sh} size={22} fill={T4.carbEdge} lx={bx + 0.25 * bu} ly={by - 0.9 * bu} />
      </g>}
      <Lbl x={g.x - 60} y={Lf.top - 150} text="glycolipid (outer layer)" anchor="end" o={fi(a('outer') - 2.4, 0.5)} size={24} lx={g.x - 8} ly={g.y - 10} />
      <Lbl x={g.x + 70} y={Lf.top - 190} text="chain projects from the outer surface" o={fi(a('project'), 0.5)} size={22} fill={T4.carbEdge} lx={beads[2].x + 8} ly={beads[2].y} />
      {pulse(a('project'), 1.6) > 0 && <circle data-role="decor" cx={g.x + 8} cy={chainTop - 0.7 * u} r={0.95 * u} fill="#FFFFFF" opacity={0.5 * pulse(a('project'), 1.6)} />}
      {/* hydrophilic chain: hydrogen bonds with nearby water */}
      {hb > 0 && beads.map((b, k) => {
        const ang = -2.4 + k * 0.9, wx = b.x + Math.cos(ang) * 44 + 4 * Math.sin(t * 3 + k), wy = b.y + Math.sin(ang) * 30;
        const on = Math.sin(t * 2.8 + k * 2) > -0.3 ? 1 : 0.3;
        return <g key={k} opacity={hb}><path data-role="drawing" d={`M${b.x} ${b.y}L${wx} ${wy}`} stroke={T4.waterEdge} strokeWidth={2} strokeDasharray="4 4" opacity={on} /><WaterTok x={wx} y={wy} r={7} /></g>;
      })}
      <Pill x={g.x - 150} y={Lf.top - 94} text="hydrophilic" anchor="middle" o={hb} fill={T4.waterEdge} />
      {fi(a('out'), 0.5) > 0 && <rect data-role="decor" x={Lf.x0 - 16} y={cy - 1.5 * u} width={Lf.width + 32} height={3.0 * u} rx={14} fill="none" stroke={C.primary} strokeWidth={3} strokeDasharray="10 7" opacity={fi(a('out'), 0.5)} />}
      <Bracket x={g.x + 1.05 * u} y0={chainTop - 0.4 * u} y1={cy - 1.5 * u} side={-1} o={fi(a('out') - 0.3, 0.5)} color={C.primary} />
      <InkRing cx={g.x} cy={Lf.innerHead + 0.3 * u} rx={52} ry={40} p={fe(a('notcyto'), 0.6)} color={C.primary} />
      <Pill x={g.x} y={Lf.bottom + 110} text="cell surface membrane: chains on the outer face" anchor="middle" o={fi(a('notcyto') - 0.4, 0.5)} fill={T4.carbEdge} />
      <RBC x={1760} y={250} r={36} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
      <Cite x={90} y={930} text={SCHEM} />
    </g>
  );
}
