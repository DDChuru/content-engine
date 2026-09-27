/** Beat 3 · The loop. The CellCycleWheel draws clockwise from 12 o'clock; interphase bracket; G1, S, G2; M and C long
 * labels; the marker laps once; the proportions caption. */
import React from 'react';
import {CellCycleWheel} from '../CellCycleWheel';
import {fi, fe, pulse} from '../util';
import {W, LONGPOS} from './stage';

export default function Beat03(s: any) {
  const a = s.a;
  const lab = (k: number) => fi(a('g1s') - k * 0.9, 0.3);
  const pos = a('lap') < 0 ? 0 : fe(a('lap'), 1.3);
  const longM = fi(a('m'), 0.3) * (1 - fi(a('c'), 0.3)), longC = fi(a('c'), 0.3) * (1 - fi(a('lap'), 0.3));
  return (
    <g>
      <CellCycleWheel cx={560} cy={W.cy} R={W.R + 20} thick={W.thick} draw={fe(s.local, 1.0)} longPos={{m: [900, 420, 'start'], c: [900, 520, 'start']}}
        labels={{g1: lab(0), s: lab(1), g2: lab(2), m: fi(a('m'), 0.3), c: fi(a('c'), 0.3)}} long={{m: longM, c: longC}}
        hi={{m: pulse(a('m'), 1.2), c: pulse(a('c'), 1.2)}} bracket={fe(a('inter'), 1.0)} bracketHi={pulse(a('longest'), 1.0)}
        caption={fi(a('schem'), 0.4)} marker={1} pos={pos} />
    </g>
  );
}
