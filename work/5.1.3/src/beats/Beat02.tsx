/** Beat 2 · What you will be able to do. Own dark surface; lines enter beside flat line pictograms: a circular-arrow
 * loop (on from the first frame), a copy icon (+ a tiny generic step-line icon), a scissors-and-circle icon. */
import React from 'react';
import {Txt} from '../../shared/src/Type';
import {fi, fe} from '../util';
import {ObjLine} from './kit';

const Wt = '#F6F3EB', A = '#FFAC8F';
export default function Beat02(s: any) {
  const a = s.a, X = 130, Y = [330, 540, 750];
  const turn = fe(a('turn'), 1.2) * 360;
  const loop = (
    <g transform={`rotate(${turn.toFixed(1)} ${X + 60} ${Y[0]})`}>
      <path d={`M${X + 100} ${Y[0]}C${X + 100} ${Y[0] - 56} ${X + 20} ${Y[0] - 56} ${X + 20} ${Y[0]}C${X + 20} ${Y[0] + 50} ${X + 90} ${Y[0] + 56} ${X + 98} ${Y[0] + 14}`} fill="none" stroke={Wt} strokeWidth={5} strokeLinecap="round" />
      <path d={`M${X + 86} ${Y[0] + 6}L${X + 100} ${Y[0] + 20}L${X + 110} ${Y[0] + 4}`} fill="none" stroke={A} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  const copy = (
    <g>
      <rect x={X} y={Y[1] - 36} width={50} height={62} rx={4} fill="none" stroke={Wt} strokeWidth={4} />
      <rect x={X + 22} y={Y[1] - 22} width={50} height={62} rx={4} fill="none" stroke={A} strokeWidth={4} />
      {a('graph') >= 0 && <path d={`M${X + 90} ${Y[1] + 30}H${X + 110}L${X + 130} ${Y[1] - 10}H${X + 150}`} fill="none" stroke={Wt} strokeWidth={4} strokeLinecap="round" opacity={fi(a('graph'), 0.4)} />}
    </g>
  );
  const sc = (
    <g>
      <circle cx={X + 40} cy={Y[2]} r={34} fill="none" stroke={Wt} strokeWidth={4} />
      <line x1={X + 40} y1={Y[2] - 44} x2={X + 40} y2={Y[2] + 44} stroke={A} strokeWidth={4} strokeDasharray="7 6" />
      <circle cx={X + 100} cy={Y[2] - 14} r={10} fill="none" stroke={Wt} strokeWidth={3.5} /><circle cx={X + 100} cy={Y[2] + 14} r={10} fill="none" stroke={Wt} strokeWidth={3.5} />
      <path d={`M${X + 108} ${Y[2] - 8}L${X + 140} ${Y[2] + 14}M${X + 108} ${Y[2] + 8}L${X + 140} ${Y[2] - 14}`} stroke={Wt} strokeWidth={3.5} strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      <Txt x={130} y={240} size={26} weight={700} fill={Wt} opacity={fi(s.local, 0.5)}>By the end, you will be able to:</Txt>
      {a('l1') < 0 && <g data-role="drawing" opacity={fi(s.local, 0.4)}>{loop}</g>}
      <ObjLine x={150} y={Y[0]} a={a('l1')} verb="OUTLINE" text="the cycle: interphase (G1, S, G2), mitosis, cytokinesis" pic={loop} />
      <ObjLine x={150} y={Y[1]} a={a('l2')} verb="PLACE" text="DNA replication in the S (synthesis) phase of interphase, on the loop and on a graph" pic={copy} />
      <ObjLine x={150} y={Y[2]} a={a('l3')} verb="KEEP APART" text="mitosis (nuclear division) and cytokinesis (division of the cytoplasm)" pic={sc} />
      <Txt x={130} y={905} size={17} weight={600} fill="#9AA6B8" italic>syllabus 5.1.3, "outline", p.23.</Txt>
    </g>
  );
}
