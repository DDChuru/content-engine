import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Stage3, RoleGrid, Regions3, Sentence, gridFill, L3, C, Txt, Cite, SCHEM, clamp01} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';
import {LigandA, seatMotion, REC} from '../ReceptorLigand';
import {InkRing, Arrow} from '../../shared/src/Type';
import {T4} from '../t4-palette';

/** Beat 10 · Cell signalling: some glycoproteins (and some proteins) are cell surface receptors; the binding site is
 * complementary in shape to a particular signalling molecule; `bind-basic` (seat along the normal, 0.8 s); a static
 * arrow "leads to a response in the cell (stages: 4.1.4)" — no pulse, no pathway. */
export default function Beat10(s: any) {
  const t = gt(s), a = s.a, {cx, cy, u} = L3;
  const hl = fe(a('rec'), 0.5);
  const M = {cx, cy, u, t, show: FULL, carrierPhase: 1};
  const Lf = fmmLayout(M), rc = compPos(M, 'receptor'), gp = compPos(M, 'glycoprotein');
  const rim = rc.y - PROT.H * u;
  // ligand A: drifts into view (hover above the receptor), then seats along the normal
  const hoverDy = -2.6;
  const enter = path(a('comp'), [[0, rc.x + 3.2 * u, rim - 3.6 * u], [1.4, rc.x, rim + hoverDy * u]]);
  const seat = seatMotion(a('bind'), hoverDy);
  const lx = a('bind') >= 0 ? rc.x : enter[0] + 6 * Math.sin(t * 1.4) * (1 - fe(a('comp') - 1.4, 0.3));
  const ly = a('bind') >= 0 ? rim + seat.dy * u : enter[1] + 4 * Math.cos(t * 1.1) * (1 - fe(a('comp') - 1.4, 0.3));
  const lig = fi(a('comp'), 0.5);
  const cw = REC.cupW * u / 2, cd = REC.cupD * u;
  const match = fi(a('comp') - 1.2, 0.5) * (1 - fe(a('bind'), 0.4));
  return (
    <g>
      <Stage3 s={s} mem={{highlight: hl > 0 ? 'receptor-glycoprotein' : null, hl: hl * (1 - 0.6 * fe(a('notevery'), 0.5))}} />
      <Regions3 />
      <RoleGrid t={t} fill={gridFill(s)} colLit={{'cell signalling': fi(a('open'), 0.4)}} />
      <Lbl x={rc.x - 70} y={rim - 2.9 * u} text="cell surface receptor (a glycoprotein)" anchor="end" o={fi(a('rec'), 0.4)} size={21} lx={rc.x - 0.9 * u} ly={rim + 12} />
      <InkRing cx={rc.x} cy={rim + cd * 0.45} rx={cw + 10} ry={cd * 0.8} p={fe(a('site'), 0.5)} opacity={1 - fe(a('bind'), 0.5)} />
      <Lbl x={rc.x - 70} y={rim - 1.8 * u} text="binding site" anchor="end" o={fi(a('site'), 0.4)} size={20} lx={rc.x - cw} ly={rim + 6} />
      {lig > 0 && <LigandA x={lx} y={ly} u={u} opacity={lig} />}
      {match > 0 && <path data-role="decor" d={`M${lx - cw} ${ly}L${lx} ${ly + cd}L${lx + cw} ${ly}`} fill="none" stroke={C.primary} strokeWidth={2.5} strokeDasharray="6 4" opacity={match} />}
      <Lbl x={rc.x + 90} y={rim - 3.0 * u} text="signalling molecule" o={lig * (1 - fe(a('written'), 0.5))} size={20} fill={T4.ligandEdge} lx={lx + 0.6 * u} ly={ly - 0.2 * u} />
      {fi(a('resp'), 0.4) > 0 && <g opacity={fi(a('resp'), 0.4)}>
        <Arrow x1={rc.x} y1={rc.y + PROT.H * u + 10} x2={rc.x} y2={rc.y + PROT.H * u + 70} color={C.ink} width={3} />
        <Txt x={rc.x + 16} y={rc.y + PROT.H * u + 60} size={18} weight={700} fill={C.ink}>leads to a response in the cell (stages: 4.1.4)</Txt>
      </g>}
      <InkRing cx={gp.x} cy={gp.y - 0.4 * u} rx={0.7 * u} ry={3.6 * u} p={fe(a('notevery'), 0.5)} opacity={1 - fe(a('written'), 0.5)} color={C.teal} />
      <Pill x={gp.x - 20} y={rim - 3.9 * u + 30} text="a glycoprotein; not a receptor in this model" anchor="end" o={fi(a('notevery'), 0.4) * (1 - fe(a('written'), 0.5))} fill={C.teal} />
      <Pill x={cx - 200} y={Lf.bottom + 96} text="secretion → transport → binding: 4.1.4" anchor="middle" o={fi(a('handoff'), 0.4)} />
      <Sentence x={200} y={760} w={840} o={fe(a('written'), 0.6)} size={23} lines={[
        {text: 'A receptor has a binding site complementary in shape', o: fi(a('sent'), 0.5), hi: ['complementary in shape'], hiO: fi(a('sent') + 0.5, 0.5)},
        {text: 'to its signalling molecule.', o: fi(a('sent') - 0.8, 0.5)},
      ]} />
      <Cite x={1040} y={948} text={SCHEM} anchor="end" />
    </g>
  );
}
