/** 5.1.4 lesson pieces around TelomereEndModel: end ticks, the starting-end guide, the "lost from the telomere" bracket,
 * the caption + comparison small type, and the gene-band rings. Geometry from telGeom (shared model). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {telGeom, GENES, ENDS, RUN} from '../TelomereEndModel';
import {Ring} from '../T5Annot';
import {BODY} from '../../shared/src/theme';

/** Lesson-local round counter in the shared RoundCounter's style, with a box that fits a long label at 20 px
 * (run 009f: "thought-experiment rounds" overflowed the shared 250-px box once labels became >= 20 px). */
export function WideCounter({x, y, value, label, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const w = Math.max(250, textW(label, 20, 700) + 32);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={86} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <text x={x + 16} y={y + 28} fontSize={20} fontWeight={700} fill="#6F6A60" fontFamily={BODY}>{label}</text>
      <text x={x + 16} y={y + 72} fontSize={40} fontWeight={800} fill={T5.ringHalo} fontFamily={BODY}>{value}</text>
    </g>
  );
}

export const TP = {x: 200, y: 470, len: 1420, amp: 20, copyGap: 72};
export const COMPARE = 'This comparison shows endpoint lengths across successive replication rounds, not strand inheritance or a molecular replication mechanism.';
export const CAPTION = 'schematic shortening; amount not to scale';
export const BLOCKNOTE = 'grey blocks: arbitrary schematic lengths, not individual TTAGGG repeats or a measured loss per division';

export function StartGuide({p = TP, opacity = 1, labels = 1}: any) {
  if (opacity <= 0) return null;
  const g = telGeom(p), x = g.X(1);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <line data-role="decor" x1={x} y1={p.y - 90} x2={x} y2={p.y + 140} stroke={T5.ringHalo} strokeWidth={2.5} strokeDasharray="8 6" />
      <Txt x={x + 10} y={p.y - 92} size={20} weight={700} fill={T5.ringHalo} anchor="start" opacity={labels}>starting end</Txt>
    </g>
  );
}
/** End ticks after rounds 1..n (a = array of opacities/brightness per tick). */
export function EndTicks({p = TP, n = 0, op = [1, 1, 1], hi = [0, 0, 0], labels = 1}: any) {
  const g = telGeom(p);
  return (
    <g>
      {[1, 2, 3].filter((r) => r <= n).map((r) => { const x = g.X(ENDS[r]), o = op[r - 1] ?? 1; return o > 0 ? (
        <g key={r} opacity={o < 1 ? o : undefined}>
          {(hi[r - 1] ?? 0) > 0 && <rect data-role="decor" x={x - 8} y={p.y - 44} width={16} height={100} rx={6} fill={T5.ring} opacity={0.6 * hi[r - 1]} />}
          <line data-role="decor" x1={x} y1={p.y - 40} x2={x} y2={p.y + 52} stroke={T5.ringHalo} strokeWidth={3} />
          <Txt x={x} y={p.y + 78 + (r - 1) * 24} size={20} weight={700} fill={T5.ringHalo} anchor="middle" opacity={labels}>end after round {r}</Txt>
        </g>) : null; })}
    </g>
  );
}
export function LostBracket({p = TP, opacity = 1, hi = 0, labels = 1}: any) {
  if (opacity <= 0) return null;
  const g = telGeom(p), x0 = g.X(ENDS[3]), x1 = g.X(1), y = p.y - 58;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {hi > 0 && <rect data-role="decor" x={x0 - 6} y={y - 40} width={x1 - x0 + 12} height={50} rx={10} fill={T5.ring} opacity={0.45 * hi} />}
      <path data-role="decor" d={`M${x0} ${y + 10}V${y}H${x1}V${y + 10}`} fill="none" stroke={T5.ringHalo} strokeWidth={2.5} />
      <Txt x={(x0 + x1) / 2} y={y - 10} size={20} weight={800} fill={T5.ringHalo} anchor="middle" opacity={labels}>lost from the telomere</Txt>
    </g>
  );
}
/** The run's bracket label; seq adds the whole-run label "repeat in humans: TTAGGG" ON THE RUN above it (storyboard: kept on
 * every zoom and replay that shows the grey run; run 009f review). */
export function RunLabel({p = TP, text, opacity = 1, hi = 0, dy = -70, seq = 1, labels = 1}: any) {
  if (opacity <= 0) return null;
  const g = telGeom(p), x0 = g.X(RUN[0]), x1 = g.X(1), y = p.y + dy;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {hi > 0 && <rect data-role="decor" x={x0} y={y - 26} width={x1 - x0} height={34} rx={8} fill={T5.ring} opacity={0.45 * hi} />}
      <path data-role="decor" d={`M${x0} ${y + 12}V${y + 4}H${x1}V${y + 12}`} fill="none" stroke={T5.ringHalo} strokeWidth={2.5} />
      <Txt x={(x0 + x1) / 2} y={y - 4} size={20} weight={800} fill={T5.ringHalo} anchor="middle" opacity={labels}>{text}</Txt>
      {seq > 0 && <Txt x={(x0 + x1) / 2} y={y - 30} size={20} weight={700} fill={C.muted} anchor="middle" opacity={labels * seq}>repeat in humans: TTAGGG (the whole run)</Txt>}
    </g>
  );
}
export function GeneRings({p = TP, pr = [1, 1], y}: any) {
  const g = telGeom(p);
  return <g>{GENES.map(([a, b], i) => <Ring key={i} cx={(g.X(a) + g.X(b)) / 2} cy={y ?? p.y} rx={34} ry={52} p={pr[i] ?? 0} />)}</g>;
}
/** The model's persistent small type (run 009f review: readable, and carried on every use): short = the shortening caption
 * (whenever shortening is shown), compare = the endpoint-comparison note (whenever copying runs), run = the grey-block note
 * (whenever the grey run is shown). Lines stack in that order, 20 px (17 px after branding), 25 px apart. */
export function Captions({x = 200, y = 880, opacity = 1, short = 1, compare = 1, run = 1, w = 1650, extra}: any) {
  if (opacity <= 0) return null;
  const src: any[] = [];
  if (extra) src.push([extra, 1, T5.ringHalo, 700]);
  if (short > 0) src.push([CAPTION, short, T5.ringHalo, 700]);
  if (compare > 0) src.push([COMPARE, compare, C.muted, 600]);
  if (run > 0) src.push([BLOCKNOTE, run, C.muted, 600]);
  const ls: any[] = [];
  for (const [t, o, f, wt] of src) {            // wrap each note to the available width
    let line = '';
    for (const word of String(t).split(' ')) { const tt = line ? line + ' ' + word : word; if (textW(tt, 20, wt) > w && line) { ls.push([line, o, f, wt]); line = word; } else line = tt; }
    if (line) ls.push([line, o, f, wt]);
  }
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {ls.map(([t, o, f, wt]: any, i: number) => <Txt key={i} x={x} y={y + i * 25} size={20} weight={wt} fill={f} italic opacity={o}>{t}</Txt>)}
    </g>
  );
}
