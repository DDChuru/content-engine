/** Beat 2 · What you will be able to do. Own dark surface (not the lesson diagram); every line enters with motion beside
 * flat line pictograms, which are visible from the first frame so no frame is text alone. */
import React from 'react';
import {Txt} from '../../shared/src/Type';
import {fi, fe, lerp, pulse} from '../util';
import {ObjLine} from './kit';

const Wt = '#F6F3EB', A = '#FFAC8F';
export default function Beat02(s: any) {
  const a = s.a, X = 130, Y = [360, 640];
  const split = fe(a('l1'), 1.0);
  const oneTwo = (
    <g>
      <circle cx={X + 30} cy={Y[0]} r={24} fill="none" stroke={Wt} strokeWidth={4} />
      <path d={`M${X + 62} ${Y[0]}H${X + 84}M${X + 76} ${Y[0] - 7}L${X + 85} ${Y[0]}L${X + 76} ${Y[0] + 7}`} stroke={A} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <circle cx={X + 112 - 8 * (1 - split)} cy={Y[0] - 14} r={16} fill="none" stroke={Wt} strokeWidth={4} />
      <circle cx={X + 112 - 8 * (1 - split)} cy={Y[0] + 20} r={16} fill="none" stroke={Wt} strokeWidth={4} />
    </g>
  );
  const copy = (
    <g opacity={a('l1b') >= 0 ? 1 : 0.55}>
      <rect x={X - 10} y={Y[0] + 58} width={38} height={46} rx={3} fill="none" stroke={Wt} strokeWidth={3.5} />
      <rect x={X + 6} y={Y[0] + 68} width={38} height={46} rx={3} fill="none" stroke={A} strokeWidth={3.5} />
      <path d={`M${X + 64} ${Y[0] + 86}H${X + 86}M${X + 86} ${Y[0] + 86}L${X + 108} ${Y[0] + 68}M${X + 86} ${Y[0] + 86}L${X + 108} ${Y[0] + 104}`} stroke={Wt} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    </g>
  );
  const four = (
    <g>
      {/* sprouting root */}
      <path d={`M${X + 10} ${Y[1] - 30}V${Y[1] + 30}M${X + 10} ${Y[1] + 30}L${X} ${Y[1] + 44}M${X + 10} ${Y[1] + 30}L${X + 20} ${Y[1] + 44}M${X + 10} ${Y[1] - 30}C${X - 6} ${Y[1] - 46} ${X - 14} ${Y[1] - 36} ${X - 10} ${Y[1] - 26}M${X + 10} ${Y[1] - 30}C${X + 26} ${Y[1] - 46} ${X + 34} ${Y[1] - 36} ${X + 30} ${Y[1] - 26}`} stroke={Wt} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* layered tile */}
      {[0, 1, 2].map((i) => <rect key={i} x={X + 44} y={Y[1] - 26 + i * 18} width={40} height={14} rx={3} fill="none" stroke={i === 0 ? A : Wt} strokeWidth={3} />)}
      {/* plaster */}
      <g transform={`rotate(-30 ${X + 125} ${Y[1] + 2})`}><rect x={X + 100} y={Y[1] - 10} width={52} height={24} rx={11} fill="none" stroke={Wt} strokeWidth={3.5} /><rect x={X + 116} y={Y[1] - 6} width={20} height={16} rx={3} fill="none" stroke={A} strokeWidth={3} /></g>
      {/* strawberry */}
      <path d={`M${X + 178} ${Y[1] - 14}C${X + 160} ${Y[1] - 14} ${X + 160} ${Y[1] + 12} ${X + 178} ${Y[1] + 30}C${X + 196} ${Y[1] + 12} ${X + 196} ${Y[1] - 14} ${X + 178} ${Y[1] - 14}Z`} stroke={Wt} strokeWidth={3.5} fill="none" />
      <path d={`M${X + 168} ${Y[1] - 18}L${X + 178} ${Y[1] - 10}L${X + 188} ${Y[1] - 18}`} stroke={A} strokeWidth={3} fill="none" />
    </g>
  );
  const p2 = pulse(a('l2'), 1.2);
  return (
    <g>
      <Txt x={130} y={250} size={26} weight={700} fill={Wt} opacity={fi(s.local, 0.5)}>By the end, you will be able to:</Txt>
      <g data-role="drawing" opacity={a('l1') < 0 ? 1 : 0}>{oneTwo}</g>
      <g data-role="drawing" opacity={a('l2') < 0 ? 1 : 0}>{four}</g>
      <ObjLine x={150} y={Y[0]} a={a('l1')} verb="EXPLAIN" text="why mitosis gives genetically identical daughter cells, from two events" pic={<g>{oneTwo}{a('l1b') >= 0 && <g opacity={fi(a('l1b'), 0.5)}>{copy}</g>}</g>} />
      <ObjLine x={150} y={Y[1]} a={a('l2')} verb="EXPLAIN" text="why that matters for growth, replacement, repair and asexual reproduction" pic={<g transform={`translate(0 ${-4 * p2})`}>{four}</g>} />
      <Txt x={130} y={905} size={17} weight={600} fill="#9AA6B8" italic>syllabus 5.1.2, "explain", p.23.</Txt>
    </g>
  );
}
