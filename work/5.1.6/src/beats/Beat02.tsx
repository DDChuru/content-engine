/** Beat 2 · What you will be able to do. Own dark surface; pictograms visible from the first frame, which pulse as each
 * line enters: DNA strand with a star + looping arrow; a smooth blob and a blob with an outward arrow; a pen and chain. */
import React from 'react';
import {Txt} from '../../shared/src/Type';
import {fi, pulse} from '../util';
import {ObjLine} from './kit';

const Wt = '#F6F3EB', A = '#FFAC8F';
export default function Beat02(s: any) {
  const a = s.a, X = 130, Y = [330, 540, 750];
  const dna = (<g>
    <path d={`M${X} ${Y[0] - 20}C${X + 20} ${Y[0] - 40} ${X + 40} ${Y[0]} ${X + 60} ${Y[0] - 20}C${X + 80} ${Y[0] - 40} ${X + 100} ${Y[0]} ${X + 120} ${Y[0] - 20}`} fill="none" stroke={Wt} strokeWidth={4} />
    <path d={`M${X} ${Y[0]}C${X + 20} ${Y[0] - 20} ${X + 40} ${Y[0] + 20} ${X + 60} ${Y[0]}C${X + 80} ${Y[0] - 20} ${X + 100} ${Y[0] + 20} ${X + 120} ${Y[0]}`} fill="none" stroke={Wt} strokeWidth={4} />
    <path d={`M${X + 60} ${Y[0] - 22}L${X + 64} ${Y[0] - 12}L${X + 75} ${Y[0] - 12}L${X + 66} ${Y[0] - 5}L${X + 70} ${Y[0] + 6}L${X + 60} ${Y[0]}L${X + 50} ${Y[0] + 6}L${X + 54} ${Y[0] - 5}L${X + 45} ${Y[0] - 12}L${X + 56} ${Y[0] - 12}Z`} fill={A} />
    <path d={`M${X + 20} ${Y[0] + 30}C${X + 40} ${Y[0] + 60} ${X + 90} ${Y[0] + 60} ${X + 100} ${Y[0] + 30}M${X + 90} ${Y[0] + 26}L${X + 101} ${Y[0] + 30}L${X + 97} ${Y[0] + 41}`} fill="none" stroke={A} strokeWidth={3.5} strokeLinecap="round" />
  </g>);
  const blobs = (<g>
    <ellipse cx={X + 30} cy={Y[1]} rx={30} ry={20} fill="none" stroke={Wt} strokeWidth={4} />
    <path d={`M${X + 80} ${Y[1]}C${X + 80} ${Y[1] - 26} ${X + 120} ${Y[1] - 22} ${X + 124} ${Y[1] - 8}L${X + 140} ${Y[1] - 18}M${X + 124} ${Y[1] - 8}C${X + 130} ${Y[1] + 10} ${X + 110} ${Y[1] + 24} ${X + 96} ${Y[1] + 20}C${X + 84} ${Y[1] + 18} ${X + 80} ${Y[1] + 10} ${X + 80} ${Y[1]}Z`} fill="none" stroke={Wt} strokeWidth={4} />
    <path d={`M${X + 138} ${Y[1] - 4}L${X + 160} ${Y[1] + 10}M${X + 150} ${Y[1] + 12}L${X + 161} ${Y[1] + 11}L${X + 158} ${Y[1]}`} stroke={A} strokeWidth={3.5} fill="none" strokeLinecap="round" />
  </g>);
  const pen = (<g>
    <path d={`M${X} ${Y[2] + 24}L${X + 40} ${Y[2] - 24}L${X + 50} ${Y[2] - 16}L${X + 10} ${Y[2] + 32}Z`} fill="none" stroke={Wt} strokeWidth={4} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={X + 80 + i * 26} cy={Y[2]} rx={16} ry={9} fill="none" stroke={A} strokeWidth={3.5} />)}
  </g>);
  const pics = [dna, blobs, pen];
  return (
    <g>
      <Txt x={130} y={240} size={26} weight={700} fill={Wt} opacity={fi(s.local, 0.5)}>By the end, you will be able to:</Txt>
      {['l1', 'l2', 'l3'].map((k, i) => a(k) < 0 ? <g key={k} data-role="drawing">{pics[i]}</g> : null)}
      <ObjLine x={150} y={Y[0]} a={a('l1')} verb="EXPLAIN" text="mutation → loss of control → repeated mitosis → tumour" pic={<g transform={`translate(0 ${-5 * pulse(a('l1'), 1)})`}>{dna}</g>} />
      <ObjLine x={150} y={Y[1]} a={a('l2')} verb="TELL APART" text="a benign tumour and a malignant tumour" pic={<g transform={`translate(0 ${-5 * pulse(a('l2'), 1)})`}>{blobs}</g>} />
      <ObjLine x={150} y={Y[2]} a={a('l3')} verb="WRITE" text="the causal chain as mark schemes credit it" pic={<g transform={`translate(0 ${-5 * pulse(a('l3'), 1)})`}>{pen}</g>} />
      <Txt x={130} y={905} size={17} weight={600} fill="#9AA6B8" italic>syllabus 5.1.6, p.23: "explain".</Txt>
    </g>
  );
}
