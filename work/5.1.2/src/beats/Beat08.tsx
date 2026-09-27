/** Beat 8 · Asexual reproduction. Panel 4 enlarged: the runner grows along the soil (a labelled replay of the growth),
 * roots grow down where it touches, the plantlet's leaves unfold; dividing-cell glyphs (excerpt, captioned) travel along
 * the runner; set cards match band for band; clone. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {fi, fe, pulse} from '../util';
import {Panel, rects, mixR, ChainThumb, EXCERPT} from './strip';

export default function Beat08(s: any) {
  const a = s.a;
  const R = mixR(rects('focus', 2, 540, 940), rects('focus', 3, 540, 940), fe(a('open'), 1.0));
  const pulseU = a('mit') >= 0 && a('same') < 0 ? (a('mit') / 2.4) % 1 : -1;
  const st = [{elong: 1, grow: 1}, {t: 0, shed: 0}, {fill: 1, diff: 1, shed: 0},
    {runner: a('runner') >= 0 ? fe(a('runner'), 3.4) : 0, roots: fe(a('soil'), 1.4), leaf: fe(a('plantlet'), 2.0), pulse: pulseU,
      cards: fi(a('same'), 0.5), light: a('same') >= 0 ? Math.max(0.5, pulse(a('same'), 1.4)) : 0, line: fe(a('same') - 0.5, 1.2)}];
  return (
    <g>
      <ChainThumb x={70} y={196} sc={0.44} />
      <Tag x={900} y={214} text="asexual reproduction" size={22} />
      {a('soil') < 0 && <Tag x={900} y={262} text="replay: the runner grows out" size={18} />}
      {[0, 1, 2, 3].map((k) => <Panel key={k} k={k} r={R[k]} st={st[k]} lit={k === 3 ? 1 : 0} dim={k === 3 ? 0 : 0.35} note={k === 3 ? fi(a('clone'), 0.4) : 0}>
        {k === 3 && a('runner') >= 0 && <Tag x={300} y={250} text="runner" size={20} opacity={fi(a('runner') - 1.5, 0.4)} />}
        {k === 3 && a('plantlet') >= 0 && <Tag x={430} y={200} text="plantlet" size={20} opacity={fi(a('plantlet'), 0.4)} />}
        {k === 3 && a('clone') >= 0 && <Tag x={250} y={130} text="clone" size={26} opacity={fi(a('clone'), 0.4)} />}
      </Panel>)}
      {a('mit') >= 0 && <Txt x={70} y={950} size={15} weight={600} fill={C.muted} italic opacity={fi(a('mit'), 0.4)}>{EXCERPT}</Txt>}
    </g>
  );
}
