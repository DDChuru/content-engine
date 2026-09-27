import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Scene, SS, C, Txt, Cite, SCHEM, Stage, RegionLabels, Bracket, sceneAges, receptorSites, CUE, clamp01} from '../kit';
import {FluidMosaicMembrane, fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {LigandA} from '../ReceptorLigand';
import {carrierCycle} from '../TransportProteinSet';
import {GlucoseTok} from '../T4Tokens';
import {CL, closeM, seatedA} from './Beat05';
import {InkRing} from '../../shared/src/Type';

/** A carrier cycling every `per` s from time t0 (global): phase and the glucose token (relative ty, units u); the
 * released token keeps drifting into the cytoplasm and fades. */
export function uptake(t: number, t0: number, per: number) {
  const age = t - t0;
  if (age < 0) return {phase: 0, tok: null as any, after: null as any};
  const k = age % per, c = carrierCycle(k);
  return {phase: c.phase, tok: c.tok ? c.ty : null, after: k > 1.9 ? {ty: 4.2 + (k - 1.9) * 0.8, o: 1 - clamp01((k - 1.9) / 1.6)} : null};
}
/** Beat 6 · A specific response: the close-up recast as the muscle cell's surface; the separate glucose transport
 * protein runs its cycle more often after binding than in the labelled before-binding miniature; events inside not
 * drawn; back out to the scene: liver cells respond, the cell without a complementary receptor does not. */
export default function Beat06(s: any) {
  const t = gt(s), a = s.a;
  const out = fe(a('liver'), 1.3), closeO = 1 - fe(a('liver') + 0.1, 0.7), sceneO = fe(a('liver') + 0.3, 0.7);
  const M = closeM(t, {}), Lf = fmmLayout(M), A = seatedA(M, 99), ca = compPos(M, 'carrier');
  const U = uptake(t, CUE(6, 'open') - 0.4, 2.9);
  const Mfull = {...M, carrierPhase: U.phase};
  const mini = {cx: 1585, cy: 380, u: 17, t, show: FULL};
  const miniU = uptake(t, CUE(5, 'open'), 6.5), mca = compPos(mini, 'carrier');
  const R = receptorSites().muscle[0];
  const z = 3.4 - 2.4 * out;
  const tk = (x: number, y: number, r: number, o = 1) => <GlucoseTok x={x} y={y} r={r} opacity={o} />;
  return (
    <g>
      {closeO > 0 && <g opacity={closeO}>
        <Stage s={s} cx={CL.cx} cy={CL.cy} u={CL.u} xw={[Lf.x0, Lf.x1]} mem={{show: FULL, carrierPhase: U.phase, highlight: 'intrinsic-carrier', hl: 0.6 * fi(a('uptake'), 0.5)}} />
        <RegionLabels cy={CL.cy} u={CL.u} x={Lf.x0} />
        <LigandA x={A.x} y={A.y} u={M.u} />
        <g data-role="drawing">
          {[0, 1, 2, 3].map((k) => tk(ca.x - 150 + k * 90 + 10 * Math.sin(t + k), Lf.top - 110 - 20 * (k % 2) + 6 * Math.cos(t * 1.2 + k), 14))}
          {U.tok != null && tk(ca.x, CL.cy + U.tok * CL.u, 14)}
          {U.after && tk(ca.x + 10, CL.cy + U.after.ty * CL.u, 14, U.after.o)}
        </g>
        {fi(a('more'), 0.4) > 0 && <path data-role="decor" d={`M${ca.x + 44} ${Lf.top - 60}V${Lf.bottom + 70}M${ca.x + 34} ${Lf.bottom + 58}L${ca.x + 44} ${Lf.bottom + 72}L${ca.x + 54} ${Lf.bottom + 58}`} stroke={C.primary} strokeWidth={3} fill="none" opacity={fi(a('more'), 0.4) * (1 - fe(a('liver'), 0.3))} />}
        <Lbl x={Lf.x0} y={228} text="muscle cell" o={fi(a('open'), 0.4)} size={26} fill="#8E4A4A" />
        <Lbl x={ca.x + 1.3 * CL.u} y={Lf.protTop - 30} text="glucose transport protein" o={fi(a('open'), 0.4)} size={21} fill={T4edge} lx={ca.x + 0.6 * CL.u} ly={Lf.protTop + 6} />
        <Lbl x={A.x - 1.4 * CL.u} y={A.site.y - 1.2 * CL.u} text="insulin bound" anchor="end" size={19} fill="#7D1F5A" lx={A.x - 0.4 * CL.u} ly={A.site.y - 0.1 * CL.u} />
        <Pill x={ca.x + 60} y={Lf.bottom + 110} text="more glucose enters after binding" o={fi(a('more'), 0.4)} fill={C.primary} size={17} />
        <Bracket x={Lf.bottom + 20} y0={A.x - 1.8 * CL.u} y1={A.x + 1.8 * CL.u} side={1} horiz p={fe(a('inside'), 0.5)} color={C.muted} />
        <Pill x={A.x} y={Lf.bottom + 76} text="events inside the cell: not drawn (Topic 14)" anchor="middle" o={fi(a('inside'), 0.4)} size={16} />
        <Lbl x={Lf.x0 + 10} y={880} text="response: muscle cell increases glucose uptake" o={fi(a('uptake'), 0.4)} size={24 + 2 * pulse(a('name'), 1.4)} fill={a('name') >= 0 ? C.primary : C.ink} />
        <Txt x={Lf.x0 + 10} y={910} size={16} weight={600} fill={C.muted} italic opacity={fi(a('uptake'), 0.4)}>increased glucose uptake; schematic, not measured; how insulin increases uptake is not shown</Txt>
        {/* the before-binding comparison */}
        <rect data-role="decor" x={1370} y={236} width={440} height={250} rx={14} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <FluidMosaicMembrane {...mini} carrierPhase={miniU.phase} />
        <g data-role="drawing">{miniU.tok != null && tk(mca.x, mini.cy + miniU.tok * mini.u, 6)}{miniU.after && tk(mca.x, mini.cy + miniU.after.ty * mini.u, 6, miniU.after.o)}{[0, 1, 2].map((k) => tk(mca.x - 50 + k * 50, mini.cy - 72, 6))}</g>
        <Txt x={1388} y={264} size={18} weight={800} fill={C.primary}>before binding</Txt>
        <Txt x={1388} y={474} size={14} weight={700} fill={C.muted}>same bilayer; separate glucose transport protein; fewer uptake events</Txt>
        <Cite x={Lf.x1} y={936} text={SCHEM} anchor="end" />
      </g>}
      {sceneO > 0 && <g opacity={sceneO}>
        <Scene z={z} zx={R[0]} zy={R[1]} t={t} {...sceneAges(t)} bindMuscle={99} bind={a('respond')} fail={a('other')} liverGlow={pulse(a('respond') - 0.8, 2.4)} vesselPulse={pulse(a('broad'), 1.6)} receptorGlow={{muscle: pulse(a('decide'), 2.6), liver: pulse(a('decide'), 2.6)}}
          stage={{secretion: 0.4, transport: 0.4, binding: 1, response: fi(a('why'), 0.4)}} labels={{beta: 1, capillary: 1, muscle: 1, liver: fi(a('liver') + 0.4, 0.4), other: fi(a('other'), 0.4), gtp: 1}} glucoseRate={0.62} respond={1} />
      </g>}
      {a('liver') >= 1.4 && <g opacity={fi(a('liver') - 1.4, 0.4)}>
        {[receptorSites().muscle[0], receptorSites().liver[0]].map((q, i) => <InkRing key={i} cx={q[0]} cy={q[1]} rx={30} ry={30} p={fe(a('liver') - 1.5 - 0.3 * i, 0.5)} opacity={1 - fe(a('other'), 0.5)} color={C.teal} />)}
        <Pill x={SS.liver.x - 20} y={SS.liver.y - SS.liver.r - 34} text="one receptor, several cell types" anchor="end" o={1 - fe(a('other'), 0.5)} fill={C.teal} size={17} />
      </g>}
      <Pill x={SS.liver.x + SS.liver.r + 16} y={SS.liver.y + 40} text="responds (Topic 14)" o={fi(a('respond') - 0.8, 0.4)} size={16} fill="#8A6414" />
      <Txt x={100} y={946} size={15} weight={600} fill={C.muted} italic opacity={fi(a('respond'), 0.4)}>syllabus 14.1.10, p.38: "with reference to the effects of insulin on muscle cells and liver cells"</Txt>
      <Pill x={SS.other.x + SS.other.r + 16} y={SS.other.y + 52} text="no response to insulin" o={fi(a('none'), 0.4)} size={16} fill={C.primary} />
    </g>
  );
}
const T4edge = '#1E6B66';
