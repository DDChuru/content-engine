/** 5.1.5 beat-local layout: the marrow lineage and the skin strip as drawn through the lesson, with the two coloured
 * step arrows (mitosis = teal, differentiation = gold), used by Beats 4–8. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Bone, StemCell, DiffPath, Vessel, RBC, SL, EXCERPT, Excerpt, excerptDaughters} from '../StemCellLineage';
import {SkinStrip} from '../ContextStrip';
import {Label} from '../T5Annot';

export const MIT = C.teal, DIF = C.gold;
export const CAP1 = 'one possible pattern', CAP2 = 'schematic; not to scale; intermediate stages simplified';
/** Straight arrow with a label, colour-coded. */
export function StepArrow({x1, y1, x2, y2, color, label, lx, ly, hi = 0, op = 1, size = 20}: any) {
  if (op <= 0) return null;
  const a = Math.atan2(y2 - y1, x2 - x1), h = 14;
  return (
    <g opacity={op < 1 ? op : undefined}>
      {hi > 0 && <path data-role="decor" d={`M${x1} ${y1}L${x2} ${y2}`} stroke={color} strokeWidth={14} opacity={0.3 * hi} strokeLinecap="round" />}
      <path data-role="decor" d={`M${x1} ${y1}L${x2} ${y2}M${x2 - h * Math.cos(a - 0.45)} ${y2 - h * Math.sin(a - 0.45)}L${x2} ${y2}L${x2 - h * Math.cos(a + 0.45)} ${y2 - h * Math.sin(a + 0.45)}`} stroke={color} strokeWidth={4 + 2 * hi} fill="none" strokeLinecap="round" />
      {label && <Txt x={lx} y={ly} size={size} weight={800} fill={color}>{label}</Txt>}
    </g>
  );
}
/** The full marrow lineage as built by the end of Beat 5 (static; highlights by key). */
export function LineageBuilt({hi = {}, t = 0, vesselX1 = 1850}: any) {
  const [ax, ay] = excerptDaughters(SL.N[0], SL.N[1], 0.2)[0];
  return (
    <g>
      <Bone hi={hi.marrow ?? 0} />
      <Label x={420} y={372} text="bone marrow" size={20} />
      <Vessel x0={SL.V.x0} x1={vesselX1} y={SL.V.y} h={SL.V.h} t={t} skip={1} />
      <StemCell x={ax} y={ay} r={40} hi={Math.max(hi.stem ?? 0, hi.self ?? 0)} />
      <Txt x={ax} y={ay + 66} size={17} weight={800} fill={T5.ringHalo} anchor="middle">stem cell (self-renewal)</Txt>
      <StepArrow x1={SL.N[0] - 90} y1={SL.N[1] - 70} x2={SL.N[0] + 40} y2={SL.N[1] - 70} color={MIT} label="mitosis" lx={SL.N[0] - 90} ly={SL.N[1] - 84} hi={hi.mit ?? 0} />
      <StepArrow x1={SL.S[0][0] - 60} y1={SL.S[0][1] + 64} x2={SL.S[2][0] + 40} y2={SL.S[2][1] + 64} color={DIF} label="differentiation" lx={SL.S[0][0] - 40} ly={SL.S[0][1] + 92} hi={hi.dif ?? 0} />
      <DiffPath p={3} from={SL.S[0]} rel={1} mature={1} nucOut={0} trail={1} />
      {(hi.inter ?? 0) > 0 && <rect data-role="decor" x={SL.S[0][0] - 50} y={SL.S[0][1] - 50} width={SL.S[2][0] - SL.S[0][0] + 100} height={100} rx={20} fill="none" stroke={T5.ring} strokeWidth={4} opacity={hi.inter} />}
      <Txt x={SL.S[1][0]} y={SL.S[1][1] - 50} size={16} weight={700} fill={T5.ringHalo} anchor="middle">intermediate stages</Txt>
      <circle data-role="drawing" cx={SL.S[2][0] + 58} cy={SL.S[2][1] - 44} r={9} fill="#6E6E6E" opacity={0.35} />
      <Txt x={SL.S[2][0] + 70} y={SL.S[2][1] - 58} size={16} weight={700} fill={T5.ringHalo} opacity={0.9}>nucleus lost</Txt>
      {(hi.rbc ?? 0) > 0 && <circle data-role="decor" cx={SL.M[0]} cy={SL.M[1]} r={46} fill="none" stroke={T5.ring} strokeWidth={4} opacity={hi.rbc} />}
      <Txt x={SL.M[0]} y={SL.M[1] + 80} size={17} weight={800} fill={T5.ringHalo} anchor="middle">mature human red blood cell · no nucleus</Txt>
      <Txt x={SL.M[0]} y={SL.M[1] + 102} size={17} weight={800} fill={T5.ringHalo} anchor="middle">specialised cell</Txt>
    </g>
  );
}
/** The skin strip (base layer: stem cells) with its arrows and labels, as built by Beat 6. (x, y, w, h) page box. */
export function SkinBuilt({x, y, w, h, t = 0, fill = 1, gap = null, divAt = -1, divU = 0, hi = {}, labels = 1, shed = 1, arrows = 1, repair = 0}: any) {
  const cols = 10, cw = w / cols, rowH = h / 4.3, base = y + h - rowH * 0.55;
  return (
    <g>
      <SkinStrip x={x} y={y} w={w} h={h} cols={cols} t={t} gap={gap} fill={fill} diff={fill} shed={shed} divAt={divAt} divU={divU} hiBase={hi.base ?? 0} />
      {(hi.base ?? 0) > 0 && <rect data-role="decor" x={x - 4} y={base - rowH * 0.55} width={w + 8} height={rowH * 1.1} rx={10} fill="none" stroke={T5.ring} strokeWidth={4} opacity={hi.base} />}
      {(hi.top ?? 0) > 0 && <rect data-role="decor" x={x - 4} y={base - rowH * 3.5} width={w + 8} height={rowH * 0.9} rx={10} fill="none" stroke={T5.ring} strokeWidth={4} opacity={hi.top} />}
      {labels > 0 && <g opacity={labels}>
        <Label x={x} y={y + h + 34} text="base layer: stem cells" size={20} />
        <Label x={x + w} y={y - 18} text="specialised cells" size={20} anchor="end" />
      </g>}
      {arrows > 0 && <g opacity={arrows}>
        <StepArrow x1={x + w * 0.42} y1={y + h + 28} x2={x + w * 0.68} y2={y + h + 28} color={MIT} label="mitosis" lx={x + w * 0.68 + 12} ly={y + h + 35} hi={hi.mit ?? 0} />
        <StepArrow x1={x - 26} y1={base} x2={x - 26} y2={base - rowH * 3} color={DIF} hi={hi.dif ?? 0} />
        <Txt x={x - 40} y={base - rowH * 1.5} size={20} weight={800} fill={DIF} anchor="end">differentiation</Txt>
      </g>}
      {repair > 0 && <Tag x={x + w * 0.58} y={y - 58} text="tissue repair" size={22} opacity={repair} />}
    </g>
  );
}
export {EXCERPT};
