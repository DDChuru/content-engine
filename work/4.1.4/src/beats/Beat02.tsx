import React from 'react';
import {fi, fe} from '../util';
import {C, Txt, Cite} from '../kit';
import {LigandA} from '../ReceptorLigand';
import {T4} from '../t4-palette';

/** Beat 2 · Objectives on their own (dark) surface; flat authored pictograms visible from the first frame. */
function Vesicle({x, y}: any) { return <g data-role="drawing"><path d={`M${x - 26} ${y + 12}A26 26 0 1 1 ${x + 26} ${y + 12}`} fill="none" stroke="#E8A94A" strokeWidth={4} /><LigandA x={x} y={y - 2} u={12} /></g>; }
function Drop({x, y}: any) { return <g data-role="drawing"><path d={`M${x} ${y - 26}C${x + 18} ${y - 4} ${x + 16} ${y + 16} ${x} ${y + 16}C${x - 16} ${y + 16} ${x - 18} ${y - 4} ${x} ${y - 26}Z`} fill="#C0453D" /><path d={`M${x + 24} ${y}H${x + 52}M${x + 44} ${y - 7}L${x + 52} ${y}L${x + 44} ${y + 7}`} stroke="#C9D6E3" strokeWidth={3} fill="none" /></g>; }
function Notch({x, y}: any) { return <g data-role="drawing"><path d={`M${x - 24} ${y - 6}L${x - 11} ${y - 6}L${x} ${y + 6}L${x + 11} ${y - 6}L${x + 24} ${y - 6}L${x + 24} ${y + 22}L${x - 24} ${y + 22}Z`} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} /><LigandA x={x} y={y - 22} u={21} /></g>; }
function TwoCells({x, y}: any) { return <g data-role="drawing"><ellipse cx={x - 34} cy={y} rx={30} ry={22} fill="none" stroke="#C9D6E3" strokeWidth={3} /><polygon points={`${x + 14},${y - 20} ${x + 58},${y - 20} ${x + 70},${y + 4} ${x + 50},${y + 22} ${x + 18},${y + 22}`} fill="none" stroke="#C9D6E3" strokeWidth={3} />{[[x - 34, y - 22], [x + 36, y - 20]].map(([a, b], i) => <path key={i} d={`M${a - 7} ${b}L${a - 3} ${b}L${a} ${b + 4}L${a + 3} ${b}L${a + 7} ${b}L${a + 7} ${b - 9}L${a - 7} ${b - 9}Z`} fill={T4.protein} />)}</g>; }
function Pen({x, y}: any) { return <g data-role="drawing"><path d={`M${x - 30} ${y + 18}L${x + 6} ${y - 18}L${x + 14} ${y - 10}L${x - 22} ${y + 26}Z`} fill="#F2C45A" stroke="#8A6414" strokeWidth={2} /><path d={`M${x + 20} ${y + 6}L${x + 30} ${y + 18}L${x + 50} ${y - 10}`} stroke="#1D8A4E" strokeWidth={5} fill="none" /></g>; }
export default function Beat02(s: any) {
  const a = s.a;
  const L1 = fe(a('l1'), 0.7), L2 = fe(a('l2'), 0.7), L2b = fe(a('l2b'), 0.6), L3 = fe(a('l3'), 0.7);
  const row = (p: number, y: number, head: string, text: string, x = 470) => p > 0 ? <g opacity={p < 1 ? p : undefined} transform={p < 1 ? `translate(${(1 - p) * 60} 0)` : undefined}><Txt x={x} y={y - 14} size={30} weight={700} fill={C.accent}>{head}</Txt><Txt x={x} y={y + 32} size={30} weight={600} fill={C.warm}>{text}</Txt></g> : null;
  return (
    <g>
      <Txt x={110} y={262} size={26} weight={700} fill="#C9D6E3" opacity={fi(a('open'), 0.5)}>By the end, you will be able to:</Txt>
      <Vesicle x={150} y={370} /><Drop x={250} y={370} /><Notch x={380} y={380} />
      {row(L1, 370, 'OUTLINE', 'secretion → transport → binding')}
      <Notch x={380} y={560} /><TwoCells x={200} y={560} />
      {row(L2, 550, 'EXPLAIN', 'why only cells with a complementary receptor respond')}
      {L2b > 0 && <Txt x={470 + 60 * (1 - L2b)} y={622} size={30} weight={600} fill={C.warm} opacity={L2b}>and why several cell types can share one</Txt>}
      <Pen x={380} y={760} />
      {row(L3, 760, 'WRITE', 'it as mark schemes credit (receptor · binding site · complementary)')}
      <Cite x={110} y={900} text={'syllabus 4.1.4, "outline", p.21'} fill="#9FB0C3" />
      <Cite x={1850} y={900} text="pictograms schematic; not to scale" anchor="end" fill="#9FB0C3" />
    </g>
  );
}
