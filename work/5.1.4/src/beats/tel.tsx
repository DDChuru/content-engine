/** 5.1.4 lesson pieces around TelomereEndModel: end ticks, the starting-end guide, the "lost from the telomere" bracket,
 * the caption + comparison small type, and the gene-band rings. Geometry from telGeom (shared model). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {telGeom, GENES, ENDS, RUN} from '../TelomereEndModel';
import {Ring} from '../T5Annot';

export const TP = {x: 200, y: 470, len: 1420, amp: 20, copyGap: 72};
export const COMPARE = 'This comparison shows endpoint lengths across successive replication rounds, not strand inheritance or a molecular replication mechanism.';
export const CAPTION = 'schematic shortening; amount not to scale';
export const BLOCKNOTE = 'grey blocks: arbitrary schematic lengths, not individual TTAGGG repeats or a measured loss per division';

export function StartGuide({p = TP, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const g = telGeom(p), x = g.X(1);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <line data-role="decor" x1={x} y1={p.y - 90} x2={x} y2={p.y + 140} stroke={T5.ringHalo} strokeWidth={2.5} strokeDasharray="8 6" />
      <Txt x={x} y={p.y - 100} size={18} weight={700} fill={T5.ringHalo} anchor="middle">starting end</Txt>
    </g>
  );
}
/** End ticks after rounds 1..n (a = array of opacities/brightness per tick). */
export function EndTicks({p = TP, n = 0, op = [1, 1, 1], hi = [0, 0, 0]}: any) {
  const g = telGeom(p);
  return (
    <g>
      {[1, 2, 3].filter((r) => r <= n).map((r) => { const x = g.X(ENDS[r]), o = op[r - 1] ?? 1; return o > 0 ? (
        <g key={r} opacity={o < 1 ? o : undefined}>
          {(hi[r - 1] ?? 0) > 0 && <rect data-role="decor" x={x - 8} y={p.y - 44} width={16} height={100} rx={6} fill={T5.ring} opacity={0.6 * hi[r - 1]} />}
          <line data-role="decor" x1={x} y1={p.y - 40} x2={x} y2={p.y + 52} stroke={T5.ringHalo} strokeWidth={3} />
          <Txt x={x} y={p.y + 76 + (r - 1) * 22} size={15} weight={700} fill={T5.ringHalo} anchor="middle">end after round {r}</Txt>
        </g>) : null; })}
    </g>
  );
}
export function LostBracket({p = TP, opacity = 1, hi = 0}: any) {
  if (opacity <= 0) return null;
  const g = telGeom(p), x0 = g.X(ENDS[3]), x1 = g.X(1), y = p.y - 58;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {hi > 0 && <rect data-role="decor" x={x0 - 6} y={y - 40} width={x1 - x0 + 12} height={50} rx={10} fill={T5.ring} opacity={0.45 * hi} />}
      <path data-role="decor" d={`M${x0} ${y + 10}V${y}H${x1}V${y + 10}`} fill="none" stroke={T5.ringHalo} strokeWidth={2.5} />
      <Txt x={(x0 + x1) / 2} y={y - 10} size={18} weight={800} fill={T5.ringHalo} anchor="middle">lost from the telomere</Txt>
    </g>
  );
}
export function RunLabel({p = TP, text, opacity = 1, hi = 0, dy = -70}: any) {
  if (opacity <= 0) return null;
  const g = telGeom(p), x0 = g.X(RUN[0]), x1 = g.X(1), y = p.y + dy;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {hi > 0 && <rect data-role="decor" x={x0} y={y - 26} width={x1 - x0} height={34} rx={8} fill={T5.ring} opacity={0.45 * hi} />}
      <path data-role="decor" d={`M${x0} ${y + 12}V${y + 4}H${x1}V${y + 12}`} fill="none" stroke={T5.ringHalo} strokeWidth={2.5} />
      <Txt x={(x0 + x1) / 2} y={y - 4} size={20} weight={800} fill={T5.ringHalo} anchor="middle">{text}</Txt>
    </g>
  );
}
export function GeneRings({p = TP, pr = [1, 1], y}: any) {
  const g = telGeom(p);
  return <g>{GENES.map(([a, b], i) => <Ring key={i} cx={(g.X(a) + g.X(b)) / 2} cy={y ?? p.y} rx={34} ry={52} p={pr[i] ?? 0} />)}</g>;
}
export function Captions({x = 200, y = 900, opacity = 1, compare = 1}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <Txt x={x} y={y} size={19} weight={700} fill={T5.ringHalo} italic>{CAPTION}</Txt>
      {compare > 0 && <Txt x={x} y={y + 26} size={15} weight={600} fill={C.muted} italic opacity={compare}>{COMPARE}</Txt>}
    </g>
  );
}
