/** Beat 2 · What you will be able to do. Own dark surface, brand type, lines enter with motion beside flat line
 * pictograms (not the lesson's models): coiled line + five dots · one bar → two bars · tally + box. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt} from '../../shared/src/Type';
import {fi, fe, lerp, pulse} from '../util';
import {ObjLine} from './kit';

const W = '#F6F3EB', A = '#FFAC8F';
export default function Beat02(s: any) {
  const a = s.a;
  const X = 130, Y = [330, 540, 750];
  const coil = (
    <g>
      <path d={`M${X} ${Y[0] - 10}` + Array.from({length: 7}, (_, i) => `C${X + 14 + i * 16} ${Y[0] - 44} ${X + 22 + i * 16} ${Y[0] + 22} ${X + 16 + (i + 1) * 16} ${Y[0] - 10}`).join('')} fill="none" stroke={W} strokeWidth={5} strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => { const on = [a('d1'), a('d2'), a('d3'), a('d4'), a('d5')][i]; return <circle key={i} cx={X + 12 + i * 26} cy={Y[0] + 38} r={8} fill={on > 0 ? A : 'none'} stroke={W} strokeWidth={2.5} opacity={1} transform={on > 0 && on < 0.5 ? undefined : undefined} />; })}
    </g>
  );
  const bars = (
    <g>
      <rect x={X} y={Y[1] - 40} width={14} height={80} rx={7} fill={W} />
      <path d={`M${X + 28} ${Y[1]}H${X + 64}M${X + 54} ${Y[1] - 10}L${X + 64} ${Y[1]}L${X + 54} ${Y[1] + 10}`} stroke={A} strokeWidth={4} fill="none" strokeLinecap="round" />
      <rect x={X + 80} y={Y[1] - 40} width={14} height={80} rx={7} fill={W} />
      <rect x={X + 100} y={Y[1] - 40} width={14} height={80} rx={7} fill={W} />
      <circle cx={X + 97} cy={Y[1] - 4} r={7} fill={A} />
    </g>
  );
  const tally = (
    <g>
      {[0, 1, 2, 3].map((i) => <line key={i} x1={X + i * 16} y1={Y[2] - 34} x2={X + i * 16} y2={Y[2] + 30} stroke={W} strokeWidth={5} strokeLinecap="round" />)}
      <line x1={X - 8} y1={Y[2] + 18} x2={X + 58} y2={Y[2] - 22} stroke={W} strokeWidth={5} strokeLinecap="round" />
      <rect x={X + 82} y={Y[2] - 28} width={60} height={52} rx={6} fill="none" stroke={A} strokeWidth={4} />
    </g>
  );
  return (
    <g>
      <Txt x={130} y={240} size={26} weight={700} fill={W} opacity={fi(s.local, 0.5)}>By the end, you will be able to:</Txt>
      {/* line 1's pictogram is on screen from the first frame; its text enters at the cue */}
      <g data-role="drawing" opacity={fi(s.local, 0.4)}>{a('l1') < 0 && coil}</g>
      <ObjLine x={150} y={Y[0]} a={a('l1')} verb="DESCRIBE" text="a chromosome: DNA · histone proteins · sister chromatids · centromere · telomeres" pic={coil} />
      <ObjLine x={150} y={Y[1]} a={a('l2')} verb="TELL APART" text="a chromosome before replication and after it" pic={bars} />
      <ObjLine x={150} y={Y[2]} a={a('l3')} verb="COUNT" text="chromosomes and DNA molecules, naming the compartment" pic={tally} />
      <Txt x={130} y={905} size={17} weight={600} fill="#9AA6B8" italic>syllabus 5.1.1, "describe", p.23.</Txt>
    </g>
  );
}
