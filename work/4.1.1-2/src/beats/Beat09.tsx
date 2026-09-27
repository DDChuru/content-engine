import React from 'react';
import {fi, fe, pulse, between} from '../util';
import {gt, Lbl, Pill, RBC, Stage, RegionLabels, Wash, Bracket, BuildNote, C, Txt, Cite, SCHEM, PARTS, CY, U, clamp01} from '../kit';
import {fmmLayout, compPos, Glycolipid} from '../FluidMosaicMembrane';
import {WaterTok} from '../T4Tokens';
import {InkRing, Arrow} from '../../shared/src/Type';
import {T4} from '../t4-palette';
import {Tray} from './Beat08';
import {SHOW7} from './Beat07';

export const SHOW8 = {...SHOW7, cholOut: 1, cholIn: 1};
/** Beat 9 · Glycolipids: lipid part in the outer layer, carbohydrate chain projecting from the outer surface. */
export default function Beat09(s: any) {
  const t = gt(s), a = s.a, u = U, cy = CY;
  const ins = clamp01((a('outer') - 0.4) / 2.0);
  const show = {...SHOW8, glycolipid: ins};
  const Lf = fmmLayout({cx: 960, cy, u, show});
  // the large explanatory glycolipid stays OUTSIDE the membrane (right column, the tray having faded); at 'outer' an
  // arrow through the water points to slot 2, where the membrane-scale glycolipid enters at its seat (no sweep across
  // the drawing: review 4.1.1-2 #2); the enlargement then fades.
  const big = fe(a('gl') - 0.4, 0.5) * (1 - fe(a('tails') - 0.4, 0.6)), bx = 1720, by = 470, bu = 110;
  const trayO = 1 - fe(a('gl'), 0.35) + fe(a('hphil'), 0.8);
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
      {trayO > 0.01 && <g opacity={Math.min(1, trayO)}><Tray items={a('hphil') > 0 ? ['glycoprotein'] : ['glycolipid', 'glycoprotein']} lift={{glycolipid: fe(a('open'), 0.6)}} t={t} /></g>}
      {big > 0 && <g opacity={big}>
        <Glycolipid x={bx} y={by} u={bu} t={t} />
        <Lbl x={bx} y={by + 2.25 * bu} text="lipid part (schematic)" anchor="middle" size={22} lx={bx + 0.1 * bu} ly={by + 1.2 * bu} o={1} />
        <Lbl x={bx} y={250} text="carbohydrate chain" anchor="middle" size={22} fill={T4.carbEdge} lx={bx + 0.05 * bu} ly={by - 1.2 * bu} o={1} />
      </g>}
      <Arrow x1={bx - 1.0 * bu} y1={by - 1.4 * bu} x2={g.x + 34} y2={Lf.top - 70} bend={-60} color={T4.carbEdge} width={3} dash="10 7" opacity={between(a('outer'), a('tails') - 0.4) * big} />
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
      <RBC x={1760} y={250} r={36} o={1 - fe(a('gl'), 0.4) + fe(a('hphil'), 0.8)} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
      <Cite x={1660} y={880} text={SCHEM} anchor="end" />
      <BuildNote o={between(a('outer'), a('tails') + 1.6)} />
    </g>
  );
}
