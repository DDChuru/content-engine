import React from 'react';
import {fi, fe} from '../util';
import {C, Txt, Cite, textW} from '../kit';
import {T4} from '../t4-palette';

/** Beat 2 · Objectives on their own (dark) surface; flat authored pictograms, visible from the first frame. */
function Picto({k, x, y, tiles = 0, tick = 0}: any) {
  if (k === 0) return (
    <g data-role="drawing">
      <circle cx={x - 88} cy={y - 10} r={9} fill={T4.head} stroke={T4.headEdge} strokeWidth={2} /><path d={`M${x - 91} ${y}V${y + 24}M${x - 85} ${y}V${y + 24}`} stroke={T4.tail} strokeWidth={3} />
      <polygon points={`${x - 48},${y - 4} ${x - 40},${y + 1} ${x - 40},${y + 11} ${x - 48},${y + 16} ${x - 56},${y + 11} ${x - 56},${y + 1}`} fill={T4.cholesterol} stroke={T4.cholesterolEdge} strokeWidth={2} />
      <path d={`M${x - 12} ${y + 24}V${y}`} stroke={T4.tail} strokeWidth={3} />{[0, 1, 2].map((i) => <circle key={i} cx={x - 12} cy={y - 6 - i * 11} r={5} fill={T4.carb} stroke={T4.carbEdge} strokeWidth={1.5} />)}
      <rect x={x + 16} y={y - 12} width={22} height={38} rx={8} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} />
      <rect x={x + 54} y={y - 4} width={22} height={30} rx={8} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} />{[0, 1, 2].map((i) => <circle key={'g' + i} cx={x + 65} cy={y - 10 - i * 11} r={5} fill={T4.carb} stroke={T4.carbEdge} strokeWidth={1.5} />)}
    </g>);
  if (k === 1) return (
    <g data-role="drawing">
      {Array.from({length: 6}, (_, i) => { const lit = (i === 0 || i === 5) ? tiles : 0; return <rect key={i} x={x - 84 + i * 28} y={y - 14} width={24} height={30} rx={5} fill={lit > 0.5 ? '#FFAC8F' : '#3C4B63'} stroke="#9FB0C3" strokeWidth={1.5} />; })}
    </g>);
  return (
    <g data-role="drawing">
      <rect x={x - 40} y={y - 16} width={100} height={9} rx={3} fill={T4.head} /><rect x={x - 40} y={y + 8} width={100} height={9} rx={3} fill={T4.head} />
      <rect x={x + 2} y={y - 18} width={16} height={38} fill="#253247" />
      <circle cx={x - 70} cy={y} r={13} fill={T4.ion} stroke="#C9B5E6" strokeWidth={2} /><path d={`M${x - 77} ${y}H${x - 63}M${x - 70} ${y - 7}V${y + 7}`} stroke="#FFFFFF" strokeWidth={3} />
    </g>);
}
export default function Beat02(s: any) {
  const a = s.a;
  const keys = ['l1', 'l2', 'l3'];
  const L = [
    {head: 'DESCRIBE', text: 'what phospholipids, cholesterol, glycolipids, proteins and glycoproteins do'},
    {head: 'USE', text: 'stability · fluidity · permeability · transport · signalling · recognition'},
    {head: 'EXPLAIN', text: 'why sodium ions and glucose need transport proteins'},
  ];
  const tick = fe(a('tick'), 0.5), tx = 360 + textW(L[2].text, 30, 600) + 30;
  return (
    <g>
      <Txt x={110} y={262} size={26} weight={700} fill="#C9D6E3" opacity={fi(a('open'), 0.5)}>By the end, you will be able to:</Txt>
      {L.map((l, i) => {
        const y = 380 + i * 170, p = fe(a(keys[i]), 0.7);
        return (
          <g key={i}>
            <Picto k={i} x={220} y={y} tiles={fe(a('tiles'), 0.5)} />
            {p > 0 && <g opacity={p < 1 ? p : undefined} transform={p < 1 ? `translate(${(1 - p) * 60} 0)` : undefined}>
              <Txt x={360} y={y - 14} size={30} weight={700} fill={C.accent}>{l.head}</Txt>
              <Txt x={360} y={y + 32} size={30} weight={600} fill={C.warm}>{l.text}</Txt>
            </g>}
          </g>
        );
      })}
      {tick > 0 && <g opacity={tick}>
        <rect data-role="decor" x={tx} y={380 + 340 + 4} width={120} height={36} rx={8} fill="#1D8A4E" />
        <Txt x={tx + 60} y={380 + 340 + 30} size={20} weight={700} fill="#FFFFFF" anchor="middle">✓ credited</Txt>
      </g>}
      <Cite x={110} y={900} text={'syllabus 4.1.3, "describe", p.21'} fill="#9FB0C3" />
      <Cite x={1850} y={900} text="pictograms schematic; not to scale" anchor="end" fill="#9FB0C3" />
    </g>
  );
}
