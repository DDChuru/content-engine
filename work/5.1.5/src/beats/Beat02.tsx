/** Beat 2 · What you will be able to do. Own dark surface; three lines beside flat line pictograms that are visible from
 * the first frame (circle with a looping arrow; dividing circle + bone + layered strip; fork). */
import React from 'react';
import {Txt} from '../../shared/src/Type';
import {fi, fe, pulse} from '../util';
import {ObjLine} from './kit';

const Wt = '#F6F3EB', A = '#FFAC8F';
export default function Beat02(s: any) {
  const a = s.a, X = 130, Y = [330, 540, 750];
  const loop = (<g>
    <circle cx={X + 40} cy={Y[0]} r={26} fill="none" stroke={Wt} strokeWidth={4} />
    <path d={`M${X + 76} ${Y[0] - 10}C${X + 96} ${Y[0] - 50} ${X + 20} ${Y[0] - 66} ${X + 6} ${Y[0] - 30}`} fill="none" stroke={A} strokeWidth={3.5} strokeLinecap="round" />
    <path d={`M${X + 2} ${Y[0] - 42}L${X + 6} ${Y[0] - 28}L${X + 18} ${Y[0] - 36}`} fill="none" stroke={A} strokeWidth={3.5} strokeLinecap="round" />
  </g>);
  const two = (<g>
    <circle cx={X + 22} cy={Y[1]} r={20} fill="none" stroke={Wt} strokeWidth={4} /><circle cx={X + 60} cy={Y[1]} r={20} fill="none" stroke={Wt} strokeWidth={4} />
    {a('l2b') >= 0 && <g opacity={fi(a('l2b'), 0.4)}>
      <path d={`M${X + 96} ${Y[1] - 6}C${X + 90} ${Y[1] - 22} ${X + 108} ${Y[1] - 26} ${X + 110} ${Y[1] - 12}H${X + 150}C${X + 152} ${Y[1] - 26} ${X + 170} ${Y[1] - 22} ${X + 164} ${Y[1] - 6}C${X + 170} ${Y[1] + 10} ${X + 152} ${Y[1] + 14} ${X + 150} ${Y[1]}H${X + 110}C${X + 108} ${Y[1] + 14} ${X + 90} ${Y[1] + 10} ${X + 96} ${Y[1] - 6}Z`} fill="none" stroke={A} strokeWidth={3} />
      {[0, 1, 2].map((i) => <rect key={i} x={X + 100} y={Y[1] + 26 + i * 12} width={60} height={9} rx={3} fill="none" stroke={Wt} strokeWidth={2.5} />)}
    </g>}
  </g>);
  const fork = (<g>
    <path d={`M${X} ${Y[2]}H${X + 40}M${X + 40} ${Y[2]}L${X + 70} ${Y[2] - 26}M${X + 40} ${Y[2]}L${X + 70} ${Y[2] + 26}`} stroke={Wt} strokeWidth={4} fill="none" />
    <circle cx={X + 86} cy={Y[2] - 30} r={10} fill="none" stroke={A} strokeWidth={3} /><circle cx={X + 108} cy={Y[2] - 30} r={10} fill="none" stroke={A} strokeWidth={3} />
    <rect x={X + 78} y={Y[2] + 18} width={34} height={16} rx={8} fill="none" stroke={A} strokeWidth={3} />
  </g>);
  const pics = [loop, two, fork];
  return (
    <g>
      <Txt x={130} y={240} size={26} weight={700} fill={Wt} opacity={fi(s.local, 0.5)}>By the end, you will be able to:</Txt>
      {['l1', 'l2', 'l3'].map((k, i) => a(k) < 0 ? <g key={k} data-role="drawing">{pics[i]}</g> : null)}
      <ObjLine x={150} y={Y[0]} a={a('l1')} verb="SAY" text="what makes a cell a stem cell" pic={<g transform={`translate(0 ${-5 * pulse(a('l1'), 1)})`}>{loop}</g>} />
      <ObjLine x={150} y={Y[1]} a={a('l2')} verb="OUTLINE" text="how stem cells replace cells and repair tissue by mitosis (bone marrow; skin)" pic={<g transform={`translate(0 ${-5 * pulse(a('l2'), 1)})`}>{two}</g>} />
      <ObjLine x={150} y={Y[2]} a={a('l3')} verb="KEEP APART" text="mitosis and differentiation" pic={<g transform={`translate(0 ${-5 * pulse(a('l3'), 1)})`}>{fork}</g>} />
      <Txt x={130} y={905} size={17} weight={600} fill="#9AA6B8" italic>syllabus 5.1.5, p.23; command word: outline.</Txt>
    </g>
  );
}
