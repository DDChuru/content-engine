/** Beat 6 · Skin, a graze, and two separate steps. The marrow lineage stays at left (reduced); the skin strip at right:
 * base-layer stem cells divide (excerpt caption on the base row, pulsing at each new division); daughters rise and flatten
 * (differentiate) and are lost from the surface; a graze removes a notch; extra divisions beneath it; new cells fill it:
 * tissue repair; the two coloured step arrows and their two separate tags. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {fi, fe, pulse} from '../util';
import {LineageBuilt, SkinBuilt, MIT, DIF, CAP1, CAP2, EXCERPT} from './lin';

export const SK = {x: 1010, y: 330, w: 820, h: 360};
export default function Beat06(s: any) {
  const a = s.a;
  const tRun = a('up') >= 0 ? a('up') * 0.28 : 0;
  const grazed = a('graze') >= 0;
  const fill = !grazed ? 1 : a('fill') < 0 ? 1 - fe(a('graze'), 0.6) : fe(a('fill'), 3.0);
  const divs: [string, number, number][] = [['div', 2, 2.0], ['carry', 7, 2.0], ['extra', 5, 1.2]];
  let divAt = -1, divU = 0, pul = 0;
  for (const [k, col, d] of divs) { const ag = a(k); if (ag >= 0 && ag < (k === 'extra' ? 5.0 : d)) { divAt = col; divU = (ag / d) % 1; pul = Math.max(pul, pulse(ag % d, 0.6)); } }
  const hiArr = a('two') >= 0 ? Math.max(0.6, pulse(a('two'), 1.4)) : 0;
  return (
    <g>
      <Txt x={70} y={214} size={20} weight={800} fill={T5.ringHalo}>{CAP1}</Txt>
      <Txt x={70} y={238} size={15} weight={600} fill={C.muted} italic>{CAP2}</Txt>
      <g transform="translate(20 200) scale(0.52)"><LineageBuilt t={s.local} vesselX1={1300} hi={{mit: Math.max(hiArr, pulse(a('mit'), 1.4)), dif: Math.max(hiArr, pulse(a('dif'), 1.4))}} /></g>
      <g opacity={fi(a('open'), 0.6)}>
        <Txt x={SK.x} y={SK.y - 70} size={22} weight={800} fill={T5.ringHalo}>outer layer of skin (schematic)</Txt>
        <SkinBuilt {...SK} t={tRun} shed={a('up') >= 0 ? 1 : 0} gap={grazed ? [4, 6] : null} fill={fill} divAt={divAt} divU={divU}
          hi={{base: a('base') >= 0 && a('div') < 0 ? 1 : pulse(a('base'), 1.4), top: pulse(a('lost'), 1.4), mit: Math.max(hiArr, pulse(a('mit'), 1.4)), dif: Math.max(hiArr, pulse(a('dif'), 1.4))}}
          labels={fi(a('base'), 0.4)} arrows={fi(a('div'), 0.4)} repair={fi(a('repair'), 0.4)} />
        {a('div') >= 0 && <g>
          {pul > 0 && <rect data-role="decor" x={SK.x} y={SK.y + SK.h + 46} width={810} height={28} rx={8} fill={T5.ring} opacity={0.35 * pul} />}
          <Txt x={SK.x + 6} y={SK.y + SK.h + 66} size={16} weight={700} fill={C.muted} italic opacity={fi(a('div'), 0.4)}>base-row divisions: {EXCERPT}</Txt>
        </g>}
        {grazed && <Tag x={SK.x + 330} y={SK.y - 20} text="a graze" size={18} opacity={fi(a('graze'), 0.4) * (1 - fi(a('repair'), 0.4))} />}
      </g>
      {a('mit') >= 0 && <Tag x={80} y={790} text="mitosis: new cells, genetically identical to the stem cell" size={24} opacity={fi(a('mit'), 0.4)} />}
      {a('mit') >= 0 && <rect data-role="decor" x={62} y={772} width={10} height={36} rx={4} fill={MIT} opacity={fi(a('mit'), 0.4)} />}
      {a('dif') >= 0 && <Tag x={80} y={850} text="differentiation: specialised cells" size={24} opacity={fi(a('dif'), 0.4)} />}
      {a('dif') >= 0 && <rect data-role="decor" x={62} y={832} width={10} height={36} rx={4} fill={DIF} opacity={fi(a('dif'), 0.4)} />}
    </g>
  );
}
