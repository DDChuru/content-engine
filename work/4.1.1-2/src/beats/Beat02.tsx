import React from 'react';
import {fi, fe} from '../util';
import {RBC, C, Txt, Cite, textW} from '../kit';
import {PhospholipidToken} from '../PhospholipidToken';
import {T4} from '../t4-palette';

/** Beat 2 · Objectives: own styled (dark) surface, not the lesson diagram; three flat pictograms. */
function Picto({k, x, y}: any) {
  if (k === 0) return <g data-role="drawing"><PhospholipidToken x={x - 22} y={y - 34} u={30} /><PhospholipidToken x={x + 22} y={y - 34} u={30} /><PhospholipidToken x={x - 22} y={y + 34} u={30} angle={180} /><PhospholipidToken x={x + 22} y={y + 34} u={30} angle={180} /></g>;
  if (k === 1) return (
    <g data-role="drawing">
      <rect x={x - 60} y={y - 26} width={120} height={14} rx={4} fill={T4.head} />
      <rect x={x - 60} y={y + 12} width={120} height={14} rx={4} fill={T4.head} />
      <rect x={x - 18} y={y - 44} width={36} height={88} rx={12} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2.5} />
    </g>);
  const hx = (cx: number, cy: number, r: number) => Array.from({length: 6}, (_, i) => { const a = Math.PI / 6 + (i * Math.PI) / 3; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
  return (
    <g data-role="drawing">
      <polygon points={hx(x - 30, y + 6, 22)} fill={T4.cholesterol} stroke={T4.cholesterolEdge} strokeWidth={2.5} />
      <path d={`M${x + 14} ${y + 30}L${x + 22} ${y - 2}L${x + 34} ${y - 30}L${x + 50} ${y - 52}`} stroke={T4.carbEdge} strokeWidth={2.4} fill="none" />
      {[[x + 22, y - 2], [x + 34, y - 30], [x + 50, y - 52]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={10} fill={T4.carb} stroke={T4.carbEdge} strokeWidth={2} />)}
    </g>);
}
export default function Beat02(s: any) {
  const a = s.a;
  const keys = ['l1', 'l2', 'l3'];
  const L = [
    {head: 'DESCRIBE', text: 'how phospholipids form a bilayer, and the interactions responsible'},
    {head: 'DESCRIBE', text: 'where proteins sit in the bilayer, and why'},
    {head: 'DESCRIBE', text: 'where cholesterol, glycolipids and glycoproteins sit in a cell surface membrane'},
  ];
  const inter = fe(a('inter'), 0.5), iw0 = textW('how phospholipids form a bilayer, and the ', 30, 600), iw = textW('interactions', 30, 600);
  return (
    <g>
      <Txt x={110} y={262} size={26} weight={700} fill="#C9D6E3" opacity={fi(a('open'), 0.5)}>By the end, you will be able to:</Txt>
      {L.map((l, i) => {
        const y = 370 + i * 170, p = fe(a(keys[i]), 0.7);
        return (
          <g key={i}>
            <Picto k={i} x={200} y={y} />
            <g opacity={p < 1 ? p : undefined} transform={p < 1 ? `translate(${(1 - p) * 60} 0)` : undefined}>
              {p > 0 && <>
                <Txt x={330} y={y - 14} size={30} weight={700} fill={C.accent}>{l.head}</Txt>
                {i === 0 && inter > 0 && <rect data-role="decor" x={330 + iw0 - 4} y={y + 5} width={iw + 8} height={38} rx={6} fill={C.primary} opacity={0.55 * inter} />}
                <Txt x={330} y={y + 34} size={30} weight={600} fill={C.warm}>{l.text}</Txt>
              </>}
            </g>
          </g>
        );
      })}
      <RBC x={1710} y={300} r={50} />
      <Cite x={1710} y={380} text="red blood cell (schematic)" anchor="middle" fill="#9FB0C3" />
      <Cite x={110} y={900} text={'syllabus 4.1.1 and 4.1.2, "describe", p.21'} fill="#9FB0C3" />
      <Cite x={1850} y={900} text="pictograms schematic; not to scale" anchor="end" fill="#9FB0C3" />
    </g>
  );
}
