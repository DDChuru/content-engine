import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Bracket, Wash, Stage, RoleGrid, Regions3, GRID, COLS, L3, C, Txt, Cite, SCHEM, clamp01} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {O2Tok} from '../T4Tokens';
import {LigandA} from '../ReceptorLigand';
import {PROT} from '../TransportProteinSet';

/** Beat 3 · The membrane recalled (`full`), a highlight run through its components, why roles matter (a solid wall
 * would cut the cell off), then the membrane slides left and the empty RoleGrid enters. */
export default function Beat03(s: any) {
  const t = gt(s), a = s.a, sl = fe(a('grid'), 1.0);
  const cx = 960 + (L3.cx - 960) * sl, cy = 470 + (L3.cy - 470) * sl, u = 52 + (L3.u - 52) * sl;
  const M = {cx, cy, u, t, show: FULL};
  const Lf = fmmLayout(M);
  const P = (k: any) => compPos(M, k);
  const c = a('comps'), seq = c >= 0 && c < 4.4 ? Math.floor(c / 1.1) : -1;
  let mem: any = {};
  if (seq === 0) mem = {highlight: 'cholesterol', hl: 1};
  if (seq === 1) mem = {highlight: 'glycolipid', hl: 1};
  if (seq === 2) mem = {dimLipids: 0.5, compDim: {cholesterol: 0.5, glycolipid: 0.5, glycoprotein: 0.5}};
  if (seq === 3) mem = {highlight: 'glycoprotein', hl: 1};
  const lab = ['cholesterol', 'glycolipid', 'proteins', 'glycoprotein'][seq] ?? '';
  const labAt = seq === 0 ? P('cholOut') : seq === 1 ? P('glycolipid') : seq === 2 ? P('receptor') : seq === 3 ? P('glycoprotein') : null;
  const wall = a('wall'), wallO = wall >= 0 ? Math.min(fi(wall, 0.4), 1 - fe(wall - 3.2, 0.6)) : 0;
  const bounceO2 = path(wall - 0.3, [[0, Lf.x0 + 3 * u, Lf.top - 3 * u], [0.6, Lf.x0 + 3 * u, Lf.top - 0.3 * u], [1.3, Lf.x0 + 3.6 * u, Lf.top - 3 * u]]);
  const bounceL = path(wall - 0.6, [[0, P('receptor').x + 1.5 * u, Lf.top - 3.4 * u], [0.6, P('receptor').x + 1.5 * u, Lf.top - 2.4 * u], [1.3, P('receptor').x + 2.2 * u, Lf.top - 3.6 * u]]);
  const ctl = pulse(a('control'), 1.4), intact = pulse(a('intact'), 1.4), comm = pulse(a('comm'), 1.4);
  const cols: Record<string, number> = {};
  COLS.forEach((k, i) => { cols[k] = pulse(a('cols') - i * 0.35, 1.2); });
  const gridIn = fe(a('grid'), 1.0);
  return (
    <g>
      <Wash x={Lf.x0 - 16} y={Lf.outerHead - 0.5 * u} w={Lf.width + 32} h={u} o={0.9 * pulse(a('heads'), 2)} />
      <Wash x={Lf.x0 - 16} y={Lf.innerHead - 0.5 * u} w={Lf.width + 32} h={u} o={0.9 * pulse(a('heads'), 2)} />
      <Wash x={Lf.x0 - 16} y={Lf.outerHead - 0.6 * u} w={Lf.width + 32} h={Lf.innerHead - Lf.outerHead + 1.2 * u} o={0.8 * intact} fill="#FFFFFF" />
      {[P('channel'), P('carrier')].map((p, i) => <rect key={i} data-role="decor" x={p.x - PROT.W * u / 2 - 8} y={cy - PROT.H * u - 8} width={PROT.W * u + 16} height={2 * PROT.H * u + 16} rx={14} fill="#FFFFFF" opacity={0.7 * ctl} />)}
      {comm > 0 && <rect data-role="decor" x={Lf.x0} y={Lf.top - 2.3 * u} width={Lf.width} height={2.2 * u} rx={14} fill="#E3F2DC" opacity={comm} />}
      <Stage s={s} cx={cx} cy={cy} u={u} xw={[80, 80 + (1840 - 80) * (1 - sl) + (836 - 80) * sl]} mem={mem} n={[26, 22]} />
      <Pill x={cx} y={cy - 5.3 * u} text="recall: 4.1.1-2" anchor="middle" o={1 - fi(a('bilayer'), 0.4)} />
      <Lbl x={Lf.x1 + 20} y={cy - 2.6 * u} text="phospholipid bilayer" o={fi(a('bilayer'), 0.4) * (1 - fi(a('grid') + 0.3, 0.3))} size={24} />
      <Lbl x={Lf.x0 - 24} y={Lf.outerHead - 0.9 * u} text="outside the cell (watery)" anchor="end" o={fi(a('heads'), 0.4) * (1 - fi(a('grid'), 0.3))} size={21} fill={C.teal} />
      <Lbl x={Lf.x0 - 24} y={Lf.innerHead + 0.9 * u + 16} text="cytoplasm (watery)" anchor="end" o={fi(a('heads'), 0.4) * (1 - fi(a('grid'), 0.3))} size={21} fill={C.teal} />
      <Regions3 o={fi(a('grid') - 0.8, 0.4)} />
      <Bracket x={Lf.x1 + 16} y0={cy - 1.5 * u} y1={cy + 1.5 * u} side={-1} o={fi(a('core'), 0.4) * (1 - fi(a('grid'), 0.3))} />
      <Lbl x={Lf.x1 + 36} y={cy + 8} text="hydrophobic core" o={fi(a('core'), 0.4) * (1 - fi(a('grid'), 0.3))} size={22} fill={C.muted} />
      {labAt && <Lbl x={labAt.x} y={Lf.top - 2.9 * u} text={lab} anchor="middle" size={24} fill={C.primary} lx={labAt.x} ly={labAt.y - 0.6 * u} />}
      <Pill x={cx} y={Lf.top - 2.9 * u} text="roles?" anchor="middle" o={fi(a('roles'), 0.4) * (1 - fe(a('wall'), 0.4))} fill={C.primary} />
      {wallO > 0 && <g opacity={wallO}>
        <rect data-role="decor" x={Lf.x0 - 10} y={Lf.outerHead - 0.5 * u} width={Lf.width + 20} height={Lf.innerHead - Lf.outerHead + u} rx={10} fill="#8E8E8E" opacity={0.85} />
        <O2Tok x={bounceO2[0]} y={bounceO2[1]} r={9} />
        <LigandA x={bounceL[0]} y={bounceL[1]} u={u} />
        <Pill x={cx} y={Lf.bottom + 2.6 * u} text="not how a membrane works" anchor="middle" fill={C.primary} />
      </g>}
      {gridIn > 0 && <g transform={`translate(${(1 - gridIn) * 820} 0)`}><RoleGrid t={t} colLit={cols} /></g>}
      <Cite x={Lf.x0} y={930} text={SCHEM} />
    </g>
  );
}
