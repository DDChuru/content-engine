/** 5.1.6 beat-local layout: the standard tissue box, the chromosome inset with the starred gene band, the excerpt
 * captions, and small helpers. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom} from '../ChromosomeModel';
import {Star} from '../TissueGrowthModel';

export const TB = {x: 80, y: 330, w: 1100, h: 330, cols: 12};
export const STARCOL = 5;
export const EXC = 'later in the cell cycle; interphase and early mitosis omitted';
export const SIMPL = 'simplified model set, not a human chromosome count';
export function ExcerptCap({x = 80, y = 950, op = 1}: any) {
  if (op <= 0) return null;
  return <Txt x={x} y={y} size={15} weight={600} fill={C.muted} italic opacity={op < 1 ? op : undefined}>dividing cells shown: {EXC}; {SIMPL}</Txt>;
}
/** Round chromosome inset (one C1 chromosome). rep: -1 unreplicated, 0..1 replicating, 1 replicated. star 0..1 on gene
 * band 0 (the division-control gene); ring 0..1; dot = a grey change outside the gene bands. */
export function ChromInset({x, y, r = 120, rep = -1, star = 0, ring = 0, dot = 0, bracket = 0, op = 1, caption = 'schematic'}: any) {
  if (op <= 0) return null;
  const P: any = {x, y, id: 'C1', cond: 0, rep, rot: 90, scale: 0.34, wave: 0.55};
  const G = chromGeom(P);
  const sides = rep < 0 ? [0] : [-1, 1];
  const g0 = G.sides[sides[0]].genes[0];
  return (
    <g opacity={op < 1 ? op : undefined}>
      <circle data-role="decor" cx={x} cy={y} r={r} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <Chromosome {...P} />
      {ring > 0 && <circle data-role="decor" cx={g0[0]} cy={g0[1]} r={18} fill="none" stroke={T5.ring} strokeWidth={4} opacity={ring} />}
      {bracket > 0 && <path data-role="decor" d={`M${g0[0] - 14} ${g0[1] - 26}V${g0[1] - 34}H${g0[0] + 14}V${g0[1] - 26}`} stroke={T5.ringHalo} strokeWidth={2.5} fill="none" opacity={bracket} />}
      {star > 0 && sides.map((sd) => { const q = G.sides[sd].genes[0]; return <Star key={sd} x={q[0]} y={q[1] - (rep >= 0 ? 0 : 0)} r={9} op={star} />; })}
      {dot > 0 && (() => { const q = G.sides[sides[0]].at(0.45); return <circle data-role="drawing" cx={q[0]} cy={q[1]} r={6} fill="#8A8A8A" opacity={dot} />; })()}
      <Txt x={x} y={y + r + 20} size={14} weight={600} fill={C.muted} anchor="middle" italic>{caption}</Txt>
    </g>
  );
}
export const insetGene = (x: number, y: number, rep = -1) => { const G = chromGeom({x, y, id: 'C1', cond: 0, rep, rot: 90, scale: 0.34, wave: 0.55} as any); return G.sides[rep < 0 ? 0 : -1].genes[0]; };
