/** Beat 1 · Hook and context. TissueGrowthModel `balanced` from the first frame (division at the base, rise, loss from the
 * surface); caption on the healthy adult tissue; balance pans level; one basal cell ringed goes on dividing (excerpt
 * glyphs, captioned) and a bulge rises while surface loss continues; the pans tip; "tumour?". */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Tissue, tGeom, Pile, Balance} from '../TissueGrowthModel';
import {Ring} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {Caption} from './kit';
import {TB, STARCOL, ExcerptCap} from './tis';

export default function Beat01(s: any) {
  const a = s.a, L = s.local;
  const G = tGeom(TB as any);
  const divRuns: [string, number][] = [['div', 3], ['repl', 8], ['bal', 2]];
  let divAt = -1, divU = 0;
  for (const [k, col] of divRuns) { const ag = a(k); if (ag >= 0 && ag < 2.2) { divAt = col; divU = ag / 2.2; } }
  const n = a('goes') >= 0 ? 1 + 8 * Math.min(1, a('goes') / 3.0) : 0;
  const tilt = a('goes') >= 0 ? 0.5 * fe(a('goes') - 0.8, 2.0) : 0;
  const exc = divAt >= 0 || (a('goes') >= 0);
  const cx = G.colX(STARCOL);
  return (
    <g>
      <Caption x={80} y={250} size={30} maxW={1700} text="Ever wondered why your skin does not simply keep getting thicker, when cells in it go on dividing for your whole life?" />
      <Tissue {...TB} t={L * 0.16} shed={1} vesselT={L} divAt={divAt} divU={divU} />
      <Txt x={TB.x} y={G.bottom + 26} size={15} weight={600} fill={C.muted} italic>schematic tissue; not to scale</Txt>
      {n > 0 && <Pile cx={cx} bm={G.bm} n={n} r={22} star={0} />}
      {a('healthy') >= 0 && <Tag x={TB.x + 300} y={G.bottom + 6} text="a healthy adult tissue that is maintaining its size" size={20} opacity={fi(a('healthy'), 0.4)} />}
      {a('lost') >= 0 && <Tag x={TB.x + TB.w - 110} y={TB.y - 12} text="surface" size={18} opacity={fi(a('lost'), 0.4)} />}
      {a('repl') >= 0 && <Tag x={G.colX(8) - 40} y={G.base + 62} text="mitosis" size={18} opacity={fi(a('repl'), 0.4)} />}
      {a('bal') >= 0 && <Balance x={1520} y={430} tilt={tilt} op={fi(a('bal'), 0.5)} />}
      {a('one') >= 0 && <Ring cx={cx} cy={G.base} rx={56} ry={46} p={fe(a('one'), 0.6)} />}
      {a('tum') >= 0 && <Tag x={cx - 50} y={G.bm - 200} text="tumour?" size={24} opacity={fi(a('tum'), 0.4)} />}
      <ExcerptCap op={exc ? 1 : 0} />
    </g>
  );
}
