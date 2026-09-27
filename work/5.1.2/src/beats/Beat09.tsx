/** Beat 9 · What I told you, on the chain and the strip. No new slide: the built IdenticalChain above and the four
 * ContextStrip panels beneath at equal size, static; key points fade in / brighten IN PLACE. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {SetCard} from '../ContextStrip';
import {fi, fe, pulse} from '../util';
import {Panel, rects, ChainThumb, SENT} from './strip';
import {SentenceStrip, Caption} from './kit';

export default function Beat09(s: any) {
  const a = s.a;
  const R = rects('equal', 0, 560, 940);
  const b = (k: string) => (a(k) >= 0 ? Math.max(0.55, pulse(a(k), 1.4)) : 0);
  const panel = (k: number) => (a('panels') >= 0 ? Math.max(0.5, pulse(a('panels') - 0.9 * k, 1.2)) : 0);
  const st = [{elong: 1, grow: 1, cards: 1, light: panel(0)}, {t: 0.5, shed: 0}, {fill: 1, diff: 1, shed: 0, t: 0.3}, {runner: 1, roots: 1, leaf: 1, cards: 1, light: panel(3), line: 1}];
  const knee = b('knee');
  return (
    <g>
      <ChainThumb x={70} y={200} sc={0.46} hi={{l1: b('l1'), parent: b('l1'), l2: b('l2'), l3: b('l2'), cards: Math.max(b('l2'), b('genes')), strip: b('l2')}} />
      <g opacity={a('sent') >= 0 ? 1 : 0.45}>
        <SentenceStrip x={940} y={230} w={910} text={SENT} shown={999} size={26} />
        {a('sent') >= 0 && <rect data-role="decor" x={938} y={228} width={914} height={122} rx={15} fill="none" stroke={T5.ring} strokeWidth={4} opacity={fi(a('sent'), 0.4)} />}
      </g>
      {a('knee') >= 0 && <Caption x={940} y={420} size={24} maxW={900} opacity={fi(a('knee'), 0.4)} text="Ever wondered how a grazed knee heals over with new skin that is still, gene for gene, yours?" />}
      {a('genes') >= 0 && <Txt x={940} y={500} size={24} weight={800} fill={T5.ringHalo} opacity={fi(a('genes'), 0.4)}>new cells made by mitosis: the same set — your genes</Txt>}
      {[0, 1, 2, 3].map((k) => <Panel key={k} k={k} r={R[k]} st={st[k]} lit={Math.max(panel(k), k === 2 ? knee : 0)} dim={0}>
        {(k === 1 || k === 2) && <g>
          <SetCard x={16} y={8} s={0.62} kind="rod" glow={k === 2 ? Math.max(panel(k), b('genes')) : panel(k)} />
          <SetCard x={464} y={8} s={0.62} kind="rod" glow={k === 2 ? Math.max(panel(k), b('genes')) : panel(k)} />
        </g>}
      </Panel>)}
      <Txt x={1850} y={952} size={13} weight={600} fill={C.muted} italic anchor="end">Simplified chromosome-set comparison; not this organism’s chromosome number</Txt>
    </g>
  );
}
