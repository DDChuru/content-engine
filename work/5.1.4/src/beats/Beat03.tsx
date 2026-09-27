/** Beat 3 · What you will be able to do. Own dark surface; pictograms: rod with shaded tips (from the first frame),
 * three stacked bars each a little shorter, a gene band with a tick. */
import React from 'react';
import {Txt} from '../../shared/src/Type';
import {fi} from '../util';
import {ObjLine} from './kit';

const Wt = '#F6F3EB', A = '#FFAC8F';
export default function Beat03(s: any) {
  const a = s.a, X = 130, Y = [330, 540, 750];
  const rod = (<g><rect x={X} y={Y[0] - 14} width={140} height={28} rx={14} fill="none" stroke={Wt} strokeWidth={4} /><rect x={X + 2} y={Y[0] - 12} width={22} height={24} rx={11} fill={A} /><rect x={X + 116} y={Y[0] - 12} width={22} height={24} rx={11} fill={A} /></g>);
  const bars = (<g>{[0, 1, 2].map((i) => <g key={i}><rect x={X} y={Y[1] - 34 + i * 26} width={140 - i * 16} height={16} rx={8} fill="none" stroke={Wt} strokeWidth={3.5} /><rect x={X + 140 - i * 16 - 16} y={Y[1] - 34 + i * 26} width={14} height={16} rx={7} fill={A} /></g>)}</g>);
  const gene = (<g><rect x={X} y={Y[2] - 12} width={120} height={24} rx={12} fill="none" stroke={Wt} strokeWidth={4} /><rect x={X + 48} y={Y[2] - 18} width={16} height={36} fill={Wt} /><path d={`M${X + 130} ${Y[2]}l12 14 24-30`} fill="none" stroke={A} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></g>);
  return (
    <g>
      <Txt x={130} y={240} size={26} weight={700} fill={Wt} opacity={fi(s.local, 0.5)}>By the end, you will be able to:</Txt>
      {a('l1') < 0 && <g data-role="drawing" opacity={fi(s.local, 0.4)}>{rod}</g>}
      <ObjLine x={150} y={Y[0]} a={a('l1')} verb="SAY" text="what a telomere is and where it sits" pic={rod} />
      <ObjLine x={150} y={Y[1]} a={a('l2')} verb="DESCRIBE" text="what happens at a chromosome end over repeated replication" pic={bars} />
      <ObjLine x={150} y={Y[2]} a={a('l3')} verb="OUTLINE" text="how telomeres prevent the loss of genes" pic={gene} />
      <Txt x={130} y={905} size={17} weight={600} fill="#9AA6B8" italic>syllabus 5.1.4, p.23: outline</Txt>
    </g>
  );
}
