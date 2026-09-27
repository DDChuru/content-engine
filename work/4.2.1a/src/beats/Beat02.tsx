import React from 'react';
import {fi, fe} from '../util';
import {C, Txt, Cite} from '../kit';
import {T4} from '../t4-palette';

/** Beat 2 · Objectives on their own (dark) surface; three flat authored pictograms placed from the first frame. */
function Dots({x, y}: any) {
  const P = [[-40, -18], [-28, 10], [-16, -6], [-44, 16], [-10, 20], [-30, -30], [4, -22], [22, 12], [36, -10]];
  return <g data-role="drawing">{P.map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={6} fill={i < 6 ? '#E27A6E' : '#E9A89F'} />)}<path d={`M${x - 30} ${y + 42}H${x + 34}M${x + 24} ${y + 34}L${x + 34} ${y + 42}L${x + 24} ${y + 50}`} stroke="#C9D6E3" strokeWidth={4} fill="none" /></g>;
}
function Door({x, y}: any) {
  return <g data-role="drawing">{[-1, 1].map((sd) => <rect key={sd} x={sd < 0 ? x - 52 : x + 16} y={y - 36} width={36} height={72} fill="#B9A58C" stroke="#E8DCC8" strokeWidth={2} />)}<rect x={x - 16} y={y - 36} width={32} height={72} fill="none" stroke={T4.protein} strokeWidth={4} /><path d={`M${x - 16} ${y - 36}L${x + 4} ${y - 28}L${x + 4} ${y + 44}L${x - 16} ${y + 36}Z`} fill={T4.protein} /></g>;
}
function DropScale({x, y}: any) {
  return <g data-role="drawing"><path d={`M${x - 20} ${y - 30}C${x - 2} ${y - 6} ${x - 4} ${y + 18} ${x - 20} ${y + 18}C${x - 36} ${y + 18} ${x - 38} ${y - 6} ${x - 20} ${y - 30}Z`} fill="#8CC3E6" /><path d={`M${x + 24} ${y - 40}V${y + 40}M${x + 14} ${y - 40}H${x + 34}M${x + 18} ${y - 10}H${x + 30}M${x + 18} ${y + 20}H${x + 30}`} stroke="#C9D6E3" strokeWidth={4} fill="none" /></g>;
}
export default function Beat02(s: any) {
  const a = s.a;
  const L1 = fe(a('l1'), 0.7), L2 = fe(a('l2'), 0.7), L3 = fe(a('l3'), 0.7);
  const row = (p: number, y: number, head: string, text: string, x = 330) => p > 0 ? <g opacity={p < 1 ? p : undefined} transform={p < 1 ? `translate(${(1 - p) * 60} 0)` : undefined}><Txt x={x} y={y - 14} size={30} weight={700} fill={C.accent}>{head}</Txt><Txt x={x} y={y + 32} size={30} weight={600} fill={C.warm}>{text}</Txt></g> : null;
  return (
    <g>
      <Txt x={110} y={262} size={26} weight={700} fill="#C9D6E3" opacity={fi(a('open'), 0.5)}>By the end, you will be able to:</Txt>
      <Dots x={200} y={380} /><Door x={200} y={580} /><DropScale x={200} y={770} />
      {row(L1, 380, 'EXPLAIN', 'diffusion as net movement down a concentration gradient, and why it is passive')}
      {row(L2, 580, 'SORT', 'what crosses the bilayer directly and what needs a channel or carrier protein')}
      {row(L3, 770, 'EXPLAIN', 'osmosis in water-potential terms')}
      <Cite x={110} y={900} text={'syllabus 4.2.1, "describe and explain", p.21; this lesson: simple diffusion, facilitated diffusion, osmosis'} fill="#9FB0C3" />
      <Cite x={1850} y={930} text="pictograms schematic; not to scale" anchor="end" fill="#9FB0C3" />
    </g>
  );
}
