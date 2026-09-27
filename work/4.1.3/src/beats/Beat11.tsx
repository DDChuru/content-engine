import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Stage3, RoleGrid, gridFill, L3, C, Txt, Cite, SCHEM, clamp01} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';
import {LigandA} from '../ReceptorLigand';
import {Underline} from '../../shared/src/Type';

/** Beat 11 · Cell recognition: glycoproteins and glycolipids, with their carbohydrate chains, act as cell surface
 * antigens on the outer face; another cell's surface comes close (no binding event drawn); self/non-self → 11.1.2. */
export default function Beat11(s: any) {
  const t = gt(s), a = s.a, {cx, u} = L3;
  const cy = L3.cy + 70 * (fe(a('cell') + 0.6, 1.0) - fe(a('self'), 1.0));   // the stage lowers to make room above the chains, then returns
  const on = fe(a('chains'), 0.5), d = 0.5 * on;
  const M = {cx, cy, u, t, show: FULL, carrierPhase: 1};
  const Lf = fmmLayout(M), gl = compPos(M, 'glycolipid'), rc = compPos(M, 'receptor'), gp = compPos(M, 'glycoprotein');
  const tops = [gl.x + 0.2 * u, rc.x + 0.62 * u, gp.x];
  const mk = pulse(a('markers'), 1.6);
  // a second cell's surface: approaches from the upper right, comes close to the chains, drifts away
  const c = path(a('cell'), [[0, 1300, -140], [1.6, 700, 60], [3.4, 700, 60], [5.0, 1300, -160]]);   // bottom edge reaches y≈290, just above the chains
  const cellOn = a('cell') >= 0 && a('cell') < 5.2;
  return (
    <g>
      {on > 0 && tops.map((x, i) => <rect key={i} data-role="decor" x={x - 0.55 * u} y={Lf.top - 2.2 * u} width={1.1 * u} height={2.2 * u} rx={12} fill="#E3F2DC" opacity={Math.max(on, mk)} />)}
      <Stage3 s={s} cy={cy} mem={{dimLipids: d, compDim: {'intrinsic-channel': d, 'intrinsic-carrier': d, cholesterol: d, extrinsic: d}}} />
      <defs><clipPath id="b11c"><rect x={70} y={198} width={766} height={742} /></clipPath></defs>
      {cellOn && <g data-role="drawing" clipPath="url(#b11c)"><circle cx={c[0]} cy={c[1]} r={230} fill="#F3ECF6" stroke="#7A5C8E" strokeWidth={4} opacity={0.95} /></g>}
      <Pill x={90} y={272} text="recognition" o={cellOn ? fi(a('cell') - 1.2, 0.4) * (1 - fe(a('cell') - 3.4, 0.4)) : 0} fill="#7A5C8E" />
      <Lbl x={90} y={232} text="another cell (schematic)" size={21} fill="#7A5C8E" o={cellOn ? fi(a('cell') - 1.0, 0.4) * (1 - fe(a('cell') - 3.4, 0.4)) : 0} lx={c[0] - 199} ly={c[1] + 115} />
      <LigandA x={rc.x} y={rc.y - PROT.H * u} u={u} />
      <Lbl x={836} y={cy + 2.3 * u + 40} text="cytoplasm (watery)" anchor="end" size={21} fill={C.teal} />
      <RoleGrid t={t} fill={gridFill(s)} colLit={{'cell recognition': fi(a('open'), 0.4)}} />
      {fi(a('antigens'), 0.4) > 0 && <g opacity={fi(a('antigens'), 0.4) * (cellOn ? 0.25 : 1)}>
        <path data-role="decor" d={`M${tops[0]} ${Lf.top - 2.35 * u}V${Lf.top - 2.7 * u}H${tops[2]}V${Lf.top - 2.35 * u}M${tops[1]} ${Lf.top - 2.7 * u}V${Lf.top - 2.35 * u}`} stroke="#35652B" strokeWidth={3} fill="none" />
      </g>}
      <Txt x={(tops[0] + tops[2]) / 2} y={Lf.top - 2.85 * u} size={24} weight={800} fill="#35652B" anchor="middle" opacity={fi(a('antigens'), 0.4) * (cellOn ? 0.25 : 1)}>cell surface antigens</Txt>
      <Pill x={cx - 150} y={Lf.bottom + 142} text="self and non-self: 11.1.2" anchor="middle" o={fi(a('self'), 0.4)} />
      <Txt x={cx - 150} y={Lf.bottom + 178} size={20} weight={600} fill={C.muted} italic anchor="middle" opacity={fi(a('self'), 0.4)}>named here, taught with immunity</Txt>
      <Underline x1={Lf.x0} x2={Lf.x1} y={Lf.outerHead - 0.55 * u} p={fe(a('outer'), 1.0)} color="#35652B" />
      <Pill x={cx + 200} y={Lf.bottom + 142} text="chains on the outer face only" anchor="middle" o={fi(a('outer'), 0.4)} fill="#35652B" />
      <Cite x={1850} y={944} text={SCHEM} anchor="end" />
    </g>
  );
}
