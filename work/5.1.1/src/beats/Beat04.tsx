/** Beat 4 · One molecule, one chromosome: genes, centromere, telomeres. Z1 → Z0 pull-back into one long C1 thread
 * (unreplicated-extended); gene bands; the centromere constriction narrows (motion); grey telomere blocks at both ends. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom, HistoneFiber} from '../ChromosomeModel';
import {Ring, Label, Leader, Bracket} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {INK} from './kit';

export default function Beat04(s: any) {
  const a = s.a;
  const z0 = fe(s.local, 1.6);                              // Z1 → Z0 at "Pull back"
  const P: any = {x: 1090, y: 590, id: 'C1', cond: 0, rep: -1, rot: 90, scale: 2.65, wave: 0.22, genes: fe(a('genes'), 0.6), pinch: fe(a('cen'), 1.2), cenDot: fe(a('cen'), 0.6), hiTel: fe(a('tel'), 0.6) * 0.7 + pulse(a('ends'), 1.0) * 0.6, hiCen: pulse(a('pinch'), 1.2) * 0};
  const g = chromGeom(P).sides[0];
  const top = g.top, bot = g.bottom;              // rot 90: 'top' (s = 0) is at the RIGHT end, 'bottom' at the LEFT end
  const [lEnd, rEnd] = top[0] > bot[0] ? [bot, top] : [top, bot];
  const [lTel, rTel] = top[0] > bot[0] ? [g.telBottom, g.telTop] : [g.telTop, g.telBottom];
  const cen = g.cen, genes = g.genes;
  const inset = fi(a('chrom'), 0.5);
  const br = fe(a('repeat'), 0.6);
  return (
    <g>
      <Txt x={70} y={250} size={18} weight={600} fill={C.muted} italic>schematic · Z0: one whole chromosome</Txt>
      {/* the Z1 view eases back and merges into the thread */}
      {z0 < 1 && <g opacity={1 - z0} transform={`translate(${lerp(0, 380, z0)} ${lerp(0, 160, z0)}) scale(${lerp(1, 0.5, z0)})`}>
        <HistoneFiber x={300} y={430} beads={7} gap={165} r={36} lead={90} />
      </g>}
      <g opacity={z0 < 1 ? z0 : undefined}><Chromosome {...P} /></g>
      <Label x={900} y={470} text="chromosome" size={30} anchor="middle" opacity={fi(a('chrom'), 0.4)} />
      {/* Z1 inset at upper left, linked by a leader line */}
      {inset > 0 && <g opacity={inset < 1 ? inset : undefined}>
        <rect data-role="decor" x={80} y={270} width={430} height={130} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g transform="translate(96 336) scale(0.36)"><HistoneFiber x={0} y={0} beads={5} gap={165} r={36} lead={90} /></g>
        <Txt x={96} y={390} size={16} weight={700} fill={INK}>Z1: DNA wound round histone proteins</Txt>
        <Leader x1={420} y1={400} x2={lEnd[0] + 260} y2={lEnd[1] - 10} />
      </g>}
      {genes.map((q: number[], i: number) => <Label key={i} x={q[0]} y={q[1] + 62} text="gene" size={24} anchor="middle" opacity={fi(a('genes') - 0.3 - i * 0.3, 0.4)} />)}
      <Label x={cen[0]} y={cen[1] + 66} text="centromere" size={26} anchor="middle" opacity={fi(a('cen') - 0.3, 0.4)} />
      <Ring cx={cen[0]} cy={cen[1]} rx={40} ry={30} p={fe(a('pinch'), 0.7)} opacity={1 - fe(a('tel'), 0.5)} />
      <Label x={lTel[0]} y={lTel[1] + 56} text="telomere" size={24} anchor="middle" opacity={fi(a('tel') - 0.2, 0.4)} />
      <Label x={rTel[0]} y={rTel[1] + 56} text="telomere" size={24} anchor="middle" opacity={fi(a('tel') - 0.2, 0.4)} />
      {br > 0 && <g opacity={br < 1 ? br : undefined}>
        <Bracket x1={rTel[0] - 70} y1={rEnd[1] - 30} x2={rEnd[0] + 12} y2={rEnd[1] - 30} side={-1} depth={-12} />
        <Tag x={rEnd[0] + 12} y={rEnd[1] - 66} text="repeated sequence (schematic blocks; not to scale)" size={18} anchor="end" />
        <Tag x={rEnd[0] + 12} y={rEnd[1] - 110} text="non-coding DNA" size={20} anchor="end" opacity={fi(a('noncoding'), 0.4)} />
        <Tag x={rEnd[0] + 12} y={rEnd[1] - 154} text="role: 5.1.4" size={20} anchor="end" opacity={fi(a('later'), 0.4)} bg="#FFF3EC" />
      </g>}
    </g>
  );
}
