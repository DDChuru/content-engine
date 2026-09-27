/** Beat 7 · What I told you, on the lineage. No new slide: the marrow lineage and the repaired skin strip, static; key
 * points brighten in place. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {fi, pulse} from '../util';
import {LineageBuilt, SkinBuilt, CAP1, CAP2} from './lin';
import {SK} from './Beat06';

export default function Beat07(s: any) {
  const a = s.a;
  const b = (k: string) => (a(k) >= 0 ? Math.max(0.5, pulse(a(k), 1.4)) : 0);
  return (
    <g>
      <Txt x={70} y={214} size={20} weight={800} fill={T5.ringHalo}>{CAP1}</Txt>
      <Txt x={70} y={238} size={15} weight={600} fill={C.muted} italic>{CAP2}</Txt>
      <g transform="translate(20 200) scale(0.52)"><LineageBuilt t={0} vesselX1={1300} hi={{stem: b('unsp'), mit: b('mit'), self: b('self'), dif: b('diff'), inter: b('inter'), rbc: Math.max(b('rbc'), b('end'))}} /></g>
      <Txt x={SK.x} y={SK.y - 70} size={22} weight={800} fill={T5.ringHalo}>outer layer of skin (schematic)</Txt>
      <SkinBuilt {...SK} t={0.4} shed={0} fill={1} hi={{base: b('unsp'), mit: b('mit'), dif: b('diff'), top: b('skin')}} labels={1} arrows={1} repair={a('end') >= 0 ? 1 : 0.6} />
      <Tag x={80} y={790} text="mitosis: new cells, genetically identical to the stem cell" size={24} />
      <Tag x={80} y={850} text="differentiation: specialised cells" size={24} />
    </g>
  );
}
