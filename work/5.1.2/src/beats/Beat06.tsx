/** Beat 6 · Growth. The IdenticalChain reduces to the top; the ContextStrip opens beneath with panel 1 (growth)
 * enlarged: root cap and the region of cell division; a plant dividing-cell glyph divides twice (excerpt, captioned); the
 * cells above elongate and the tip moves down; the two zones bracketed; the human outline grows; set cards match within
 * each example. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {fi, fe, pulse} from '../util';
import {Panel, rects, mixR, ChainThumb, EXCERPT, PTag} from './strip';

export default function Beat06(s: any) {
  const a = s.a;
  const R = mixR(rects('equal', 0, 540, 925), rects('focus', 0, 540, 925), fe(a('open'), 1.0));
  const st = [
    {elong: fe(a('long'), 3.0), div: a('div') >= 0 ? Math.min(2, a('div') / 1.8) : 0, grow: a('human') >= 0 ? 0.35 + 0.65 * fe(a('human'), 2.6) : 0.35,
      labels: fi(a('root'), 0.4), bracket: fi(a('both'), 0.4), cards: fi(a('cards'), 0.5), light: a('light') >= 0 ? Math.max(0.5, pulse(a('light'), 1.4)) : 0},
    {t: 0, shed: 0}, {fill: 1, diff: 1, shed: 0}, {runner: 1, roots: 1, leaf: 1},
  ];
  return (
    <g>
      <ChainThumb x={70} y={196} sc={0.44} />
      <Tag x={900} y={214} text="why does identical matter?" size={22} opacity={fi(a('open'), 0.5)} />
      {[0, 1, 2, 3].map((k) => <Panel key={k} k={k} r={R[k]} st={st[k]} lit={k === 0 ? fi(a('open'), 0.6) : 0} dim={k === 0 ? 0 : 0.35} note={k === 0 ? fi(a('light'), 0.4) : 0}>
        {k === 0 && a('elong') >= 0 && <PTag x={220} y={150} text="new cells also elongate" size={20} opacity={fi(a('elong'), 0.4)} />}
        {k === 0 && a('human') >= 0 && <PTag x={300} y={360} text="growing tissues" size={20} opacity={fi(a('human'), 0.4)} />}
      </Panel>)}
      {a('div') >= 0 && <Txt x={70} y={950} size={15} weight={600} fill={C.muted} italic opacity={fi(a('div'), 0.4)}>{EXCERPT}</Txt>}
    </g>
  );
}
