import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Stage3, RoleGrid, Regions3, gridFill, DIM_ALL, L3, C, Txt, Cite, SCHEM, clamp01} from '../kit';
import {fmmLayout, compPos, plPos, FULL} from '../FluidMosaicMembrane';
import {CholesterolQualitative} from '../CholesterolQualitative';
import {T4} from '../t4-palette';

/** Beat 8 · Fluidity: phospholipids drift sideways within one layer (a tinted pair swaps places), proteins drift more
 * slowly; cholesterol (animal cell membranes) helps regulate fluidity — the `cholesterol-qualitative` inset
 * (qualitative schematic; not measured data). */
export default function Beat08(s: any) {
  const t = gt(s), a = s.a, {cx, cy, u} = L3;
  const k = fe(a('drift'), 2.2), dip = Math.sin(Math.PI * clamp01(a('drift') / 2.2));
  const tint = fi(a('drift'), 0.5) * (1 - fe(a('chol'), 0.8));
  const gsh = 0.25 * fe(a('pdrift'), 2.5) * (1 - fe(a('chol'), 1.2));
  const plHi = fe(a('drift'), 0.5) * (1 - fe(a('chol'), 0.6));
  const chHl = fe(a('chol'), 0.5) * (1 - fe(a('inset'), 0.8) * 0.4);
  const mem = {tracer: 7, tracerTint: tint, plShift: {7: {dx: k, o: 1}, 8: {dx: -k, o: 1 - 0.65 * dip}}, compShift: {glycoprotein: gsh},
    ...(plHi > 0 ? {compDim: Object.fromEntries(Object.entries(DIM_ALL).map(([kk, v]) => [kk, (v as number) * plHi]))} : {}),
    ...(chHl > 0 ? {highlight: 'cholesterol', hl: chHl} : {})};
  const M = {cx, cy, u, t, show: FULL, carrierPhase: 1};
  const Lf = fmmLayout(M), p8 = plPos(M, 8), gp = compPos(M, 'glycoprotein'), co = compPos(M, 'cholOut');
  const inset = fe(a('inset'), 0.6);
  return (
    <g>
      <Stage3 s={s} mem={mem} />
      <Regions3 />
      <RoleGrid t={t} fill={gridFill(s)} colLit={{fluidity: fi(a('open'), 0.4)}} rowLit={{cholesterol: fi(a('reg'), 0.4)}} />
      {tint > 0 && <circle data-role="decor" cx={p8.x - k * u} cy={p8.y} r={0.42 * u} fill="#FFF1D6" opacity={0.7 * tint * (1 - 0.65 * dip)} />}
      <Pill x={cx} y={Lf.top - 2.6 * u} text="sideways, within one layer; never flipping between layers" anchor="middle" o={fi(a('drift'), 0.5) * (1 - fe(a('chol'), 0.6))} fill={T4.headEdge} />
      {gsh > 0 && <path data-role="decor" d={`M${gp.x - gsh * u} ${cy - 2.65 * u - 12}L${gp.x + 0.5} ${cy - 2.65 * u - 12}`} stroke={T4.proteinEdge} strokeWidth={5} strokeLinecap="round" opacity={0.6} />}
      <Txt x={cx - 200} y={Lf.bottom + 56} size={40} weight={800} fill={C.primary} anchor="middle" opacity={fi(a('fluid'), 0.5) * (1 - fe(a('inset'), 0.5))}>fluid</Txt>
      <Lbl x={co.x + 40} y={Lf.top - 2.6 * u} text="cholesterol (animal cell membranes)" o={fi(a('chol') - 0.5, 0.4)} size={22} lx={co.x + 4} ly={co.y - 8} />
      {inset > 0 && <g opacity={inset}><CholesterolQualitative x={80} y={604} w={756} h={332} t={t} hot={fe(a('hot'), 1.0)} cold={fe(a('cold'), 1.5)} glow={fe(a('steady'), 0.6)} /></g>}
      <Cite x={1850} y={944} text={SCHEM} anchor="end" />
    </g>
  );
}
