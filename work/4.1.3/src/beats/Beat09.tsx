import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Wash, Stage3, RoleGrid, Regions3, gridFill, turnBack, L3, C, Txt, Cite, SCHEM, clamp01} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {IonTok, SoluteDot, WaterTok} from '../T4Tokens';
import {PROT} from '../TransportProteinSet';
import {InkRing, Underline} from '../../shared/src/Type';
import {T4} from '../t4-palette';

/** Beat 9 · Stability: cholesterol's rigid rings among the tails (stability; fills spaces → less permeable to small
 * polar molecules and ions); the carbohydrate chains of glycolipids and glycoproteins hydrogen-bond with water. */
export default function Beat09(s: any) {
  const t = gt(s), a = s.a, {cx, cy, u} = L3;
  const chainsOn = fe(a('chains'), 0.5);
  const cholHl = 1 - chainsOn;
  const dimOthers = 0.5 * chainsOn;
  const mem = cholHl > 0.02 ? {highlight: 'cholesterol', hl: cholHl} : {dimLipids: dimOthers, compDim: {'intrinsic-channel': dimOthers, 'intrinsic-carrier': dimOthers, cholesterol: dimOthers, extrinsic: dimOthers}};
  const M = {cx, cy, u, t, show: FULL, carrierPhase: 1};
  const Lf = fmmLayout(M), co = compPos(M, 'cholOut'), ci = compPos(M, 'cholIn');
  const gl = compPos(M, 'glycolipid'), rc = compPos(M, 'receptor'), gp = compPos(M, 'glycoprotein');
  const pulseC = pulse(a('open'), 1.2);
  const hi: Record<string, number> = {};
  ['cholesterol|fluidity', 'cholesterol|stability', 'cholesterol|permeability'].forEach((k, i) => { hi[k] = pulse(a('three') - i * 0.5, 0.8); });
  const shade = fi(a('fill'), 0.4) * (1 - fe(a('fill') - 1.2, 0.6));
  const rb1 = turnBack(a('perm'), co.x + 0.1 * u, Lf.top - 1.2 * u, Lf.outerHead + 0.5 * u);
  const rb2 = turnBack(a('perm') - 0.4, co.x - 0.35 * u, Lf.top - 1.6 * u, Lf.outerHead + 0.5 * u);
  const chainTops = [[gl.x + 0.2 * u, Lf.outerHead - 1.3 * u], [rc.x + 0.62 * u, cy - PROT.H * u - 0.6 * u], [gp.x, cy - PROT.H * u - 1.0 * u]];
  const hb = fi(a('hb'), 0.5);
  return (
    <g>
      {chainsOn > 0 && chainTops.map(([x], i) => <rect key={i} data-role="decor" x={x - 0.55 * u} y={Lf.top - 2.2 * u} width={1.1 * u} height={2.2 * u} rx={12} fill="#E3F2DC" opacity={chainsOn} />)}
      <Stage3 s={s} mem={mem} />
      {pulseC > 0 && [co, ci].map((p, i) => <circle key={i} data-role="decor" cx={p.x} cy={p.y + (i ? -0.7 : 0.7) * u} r={0.9 * u} fill="#FFF3C4" opacity={0.6 * pulseC} />)}
      {shade > 0 && [co, ci].map((p, i) => <g key={'s' + i} opacity={shade}>{[-1, 1].map((d) => <rect key={d} data-role="decor" x={p.x + d * 0.42 * u - 0.12 * u} y={p.y + (i ? -1.25 : 0.2) * u} width={0.24 * u} height={1.05 * u} rx={4} fill="#B8862F" opacity={0.45} />)}</g>)}
      <Regions3 />
      <RoleGrid t={t} fill={gridFill(s)} colLit={{stability: fi(a('stable'), 0.4)}} hi={hi} />
      <InkRing cx={co.x} cy={co.y + 0.7 * u} rx={0.45 * u} ry={0.75 * u} p={fe(a('rings'), 0.5)} opacity={1 - fe(a('chains'), 0.5)} color="#8A5F12" />
      <InkRing cx={ci.x} cy={ci.y - 0.7 * u} rx={0.45 * u} ry={0.75 * u} p={fe(a('rings') - 0.3, 0.5)} opacity={1 - fe(a('chains'), 0.5)} color="#8A5F12" />
      <Lbl x={co.x - 40} y={Lf.top - 2.4 * u} text="rigid rings among the tails" anchor="end" o={fi(a('rings'), 0.5) * (1 - fe(a('chains'), 0.5))} size={21} lx={co.x - 6} ly={co.y + 0.5 * u} />
      {a('perm') >= 0 && a('perm') < 2 && <g><SoluteDot x={rb1[0]} y={rb1[1]} r={7} /><IonTok x={rb2[0]} y={rb2[1]} r={9} /></g>}
      <Lbl x={co.x + 40} y={Lf.top - 2.4 * u} text="small polar molecule · sodium ion" o={fi(a('perm'), 0.4) * (1 - fe(a('three'), 0.5))} size={18} fill={C.muted} />
      {/* chains: glycolipid, receptor-glycoprotein, glycoprotein */}
      <Lbl x={gl.x - 30} y={Lf.top - 2.5 * u} text="glycolipid" anchor="end" o={chainsOn} size={21} fill="#35652B" lx={gl.x} ly={Lf.top - 1.8 * u} />
      <Lbl x={gp.x - 30} y={Lf.top - 2.5 * u} text="glycoprotein" anchor="end" o={chainsOn} size={21} fill="#35652B" lx={gp.x + 6} ly={Lf.top - 1.6 * u} />
      <Underline x1={Lf.x0} x2={Lf.x1} y={Lf.outerHead - 0.55 * u} p={fe(a('outer'), 1.0)} color="#35652B" opacity={1 - fe(a('hb') - 1.5, 0.6)} />
      <Pill x={cx + 200} y={Lf.bottom + 70} text="chains on the outer face only" anchor="middle" o={fi(a('outer'), 0.5)} fill="#35652B" />
      {hb > 0 && chainTops.map(([x, y], i) => [0, 1, 2].map((k) => {
        const ang = -2.6 + k * 1.1, wx = x + Math.cos(ang) * 40 + 4 * Math.sin(t * 3 + k + i), wy = y + Math.sin(ang) * 26 - 6;
        const on = Math.sin(t * 2.7 + k * 2 + i) > -0.3 ? 1 : 0.3;
        return <g key={i + '-' + k} opacity={hb}><path data-role="drawing" d={`M${x} ${y}L${wx} ${wy}`} stroke={T4.waterEdge} strokeWidth={2} strokeDasharray="4 4" opacity={on} /><WaterTok x={wx} y={wy} r={6} /></g>;
      }))}
      <Txt x={cx + 200} y={Lf.bottom + 110} size={18} weight={700} fill={T4.waterEdge} anchor="middle" opacity={hb}>dashed lines: hydrogen bonds (schematic)</Txt>
      <Cite x={1850} y={944} text={SCHEM} anchor="end" />
    </g>
  );
}
