/** RateGraph · configuration "initial rate against substrate concentration" (published by L2; this lesson
 * adds the construction overlays). OUR SCHEMATIC: every curve is v = Vmax·tanh(k·S) with k = atanh(½)/Km,
 * so the curve passes EXACTLY through (Km, ½Vmax) — the half-Vmax intersection is a locked point on the
 * actual curve (CHECK should-fix 5). All curves start at (0,0), rise monotonically, meet their plateau
 * without overshoot; initial slope Vmax·0.549/Km (three enzymes: X 8.2 > Y 3.4 > Z 1.6 per µmol dm⁻³).
 * Overlays are addressable: vmax-line, half-line, km-drop, drawn per curve from ITS OWN plateau. */
import React from 'react';
import {BRAND as C, clamp01} from './shared/theme';
import {Txt, Cite} from './shared/Type';

export type Curve = {id: string; vmax: number; km: number; color?: string};
const K = Math.atanh(0.5);
export const rate = (c: Curve, S: number) => c.vmax * Math.tanh((K / c.km) * S);

export type G = {x: number; y: number; w: number; h: number; xmax: number; ymax: number};
export const gx = (g: G, S: number) => g.x + (S / g.xmax) * g.w;
export const gy = (g: G, v: number) => g.y + g.h - (v / g.ymax) * g.h;

/** Axes: origin bottom-left at (g.x, g.y+g.h). Labels as text nodes. hiX/hiY brighten a label (0..1). */
export function Axes({g, xLabel, yLabel, xTicks = [], yTicks = [], hiX = 0, hiY = 0, dimY = 0, traceX = 0, xUnitPulse = 0, size = 22, tickFmt = (v: number) => String(v), opacity = 1}: any) {
  const ox = g.x, oy = g.y + g.h;
  const labCol = (hi: number) => (hi > 0 ? C.teal : C.ink);
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-graph="axes">
      <g opacity={1 - 0.6 * clamp01(dimY)}>
        <path d={`M${ox} ${oy}V${g.y - 18}`} stroke={C.ink} strokeWidth={3} />
        <path d={`M${ox - 8} ${g.y - 8}L${ox} ${g.y - 24}L${ox + 8} ${g.y - 8}`} fill="none" stroke={C.ink} strokeWidth={3} />
        {yTicks.map((v: number) => (
          <g key={'y' + v}>
            <path d={`M${ox - 8} ${gy(g, v)}H${ox}`} stroke={C.ink} strokeWidth={2} />
            <Txt x={ox - 14} y={gy(g, v) + 7} size={size - 2} weight={600} anchor="end" fill={C.muted}>{tickFmt(v)}</Txt>
          </g>
        ))}
        {hiY > 0 && <rect x={ox - 60 - size * 0.8} y={g.y + g.h / 2 - 260} width={size * 1.6} height={520} rx={8} fill={C.teal} opacity={0.12 * clamp01(hiY)} />}
        <Txt x={ox - 64} y={g.y + g.h / 2} size={size} weight={800} anchor="middle" fill={labCol(hiY)} rotate={-90}>{yLabel}</Txt>
      </g>
      <path d={`M${ox} ${oy}H${ox + g.w + 18}`} stroke={C.ink} strokeWidth={3} />
      <path d={`M${ox + g.w + 8} ${oy - 8}L${ox + g.w + 24} ${oy}L${ox + g.w + 8} ${oy + 8}`} fill="none" stroke={C.ink} strokeWidth={3} />
      {traceX > 0 && <path d={`M${ox} ${oy}H${ox + (g.w + 18) * clamp01(traceX)}`} stroke={C.teal} strokeWidth={7} strokeLinecap="round" opacity={0.85} />}
      {xTicks.map((v: number) => (
        <g key={'x' + v}>
          <path d={`M${gx(g, v)} ${oy}V${oy + 8}`} stroke={C.ink} strokeWidth={2} />
          <Txt x={gx(g, v)} y={oy + 32} size={size - 2} weight={600} anchor="middle" fill={C.muted}>{tickFmt(v)}</Txt>
        </g>
      ))}
      {hiX > 0 && <rect x={g.x + g.w / 2 - 330} y={oy + (xTicks.length ? 44 : 14)} width={660} height={size * 1.6} rx={8} fill={C.teal} opacity={0.12 * clamp01(hiX)} />}
      <Txt x={g.x + g.w / 2} y={oy + (xTicks.length ? 72 : 44)} size={size} weight={800} anchor="middle" fill={labCol(hiX + xUnitPulse)}>{xLabel}</Txt>
    </g>
  );
}

/** A curve drawn from S=0 to p·xmax (p 0..1). from/to allow tracing a section. */
export function CurvePath({g, c, p = 1, color, width = 5, dash, opacity = 1, from = 0, to = 1}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const n = 160, a = from * g.xmax, b = Math.min(to, from + (to - from) * clamp01(p)) * g.xmax;
  let d = '';
  for (let i = 0; i <= n; i++) { const S = a + ((b - a) * i) / n; d += (i ? 'L' : 'M') + gx(g, S).toFixed(1) + ' ' + gy(g, rate(c, S)).toFixed(1); }
  return <path d={d} fill="none" stroke={color ?? c.color ?? C.curveA} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} opacity={opacity < 1 ? opacity : undefined} data-curve={c.id} />;
}

/** Dashed line from (x1,y1) toward (x2,y2), drawn to fraction p. */
export function DashLine({x1, y1, x2, y2, p = 1, color = C.teal, width = 3.5, dash = '12 9', opacity = 1}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const q = clamp01(p);
  return <path d={`M${x1} ${y1}L${x1 + (x2 - x1) * q} ${y1 + (y2 - y1) * q}`} stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" opacity={opacity < 1 ? opacity : undefined} />;
}

/** vmax-line: horizontal dashed line at the curve's own plateau, across the plot, labelled at the right. */
export function VmaxLine({g, c, p = 1, label = 'Vmax', color = C.teal, labelX, opacity = 1, size = 24, pulse = 0, labelSide = 'right', noLabel = false}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const y = gy(g, c.vmax);
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-overlay={'vmax-line:' + c.id}>
      {pulse > 0 && <path d={`M${g.x} ${y}H${g.x + g.w}`} stroke={color} strokeWidth={14} opacity={0.18 * pulse} strokeLinecap="round" />}
      <DashLine x1={g.x} y1={y} x2={g.x + g.w} y2={y} p={p} color={color} width={3.5 + 2 * pulse} />
      {!noLabel && <Txt x={labelX ?? (labelSide === 'right' ? g.x + g.w + 12 : g.x + 12)} y={y + 8} size={size} weight={800} fill={color} opacity={clamp01((p - 0.6) / 0.4)}>{label}</Txt>}
    </g>
  );
}

/** half-line: from the y-axis at ½Vmax across to the LOCKED point (Km, ½Vmax) on this curve. */
export function HalfLine({g, c, p = 1, label = '½Vmax', color = C.teal, opacity = 1, size = 24, pulse = 0, labelAt = 'axis', noLabel = false}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const y = gy(g, c.vmax / 2), xe = gx(g, c.km);
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-overlay={'half-line:' + c.id}>
      {pulse > 0 && <path d={`M${g.x} ${y}H${xe}`} stroke={color} strokeWidth={14} opacity={0.18 * pulse} strokeLinecap="round" />}
      <DashLine x1={g.x} y1={y} x2={xe} y2={y} p={p} color={color} width={3.5 + 2 * pulse} />
      {!noLabel && (labelAt === 'axis'
        ? <Txt x={g.x + 10} y={y - 10} size={size - 2} weight={800} fill={color} opacity={clamp01((p - 0.3) / 0.4)}>{label}</Txt>
        : <Txt x={xe + 14} y={y - 10} size={size - 2} weight={800} fill={color} opacity={clamp01((p - 0.6) / 0.4)}>{label}</Txt>)}
    </g>
  );
}

/** km-drop: from (Km, ½Vmax) straight down to the concentration axis; the reading labelled. */
export function KmDrop({g, c, p = 1, label, color = C.teal, opacity = 1, size = 24, pulse = 0, dot = true, labelDy = 0, labelDx = 0, anchor = 'middle', ring = 0, ringColor}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const x = gx(g, c.km), y0 = gy(g, c.vmax / 2), y1 = g.y + g.h;
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-overlay={'km-drop:' + c.id}>
      {pulse > 0 && <path d={`M${x} ${y0}V${y1}`} stroke={color} strokeWidth={14} opacity={0.18 * pulse} strokeLinecap="round" />}
      {dot && <circle cx={x} cy={y0} r={7} fill={color} />}
      <DashLine x1={x} y1={y0} x2={x} y2={y1} p={p} color={color} width={3.5 + 2 * pulse} />
      {p >= 1 && <circle cx={x} cy={y1} r={6} fill={color} />}
      {label && <Txt x={x + labelDx} y={y1 + 34 + labelDy} size={size} weight={800} anchor={anchor} fill={color} opacity={clamp01((p - 0.7) / 0.3)}>{label}</Txt>}
      {ring > 0 && <ellipse cx={x + labelDx} cy={y1 + 26 + labelDy} rx={size * 1.4} ry={size * 0.95} fill="none" stroke={ringColor ?? color} strokeWidth={4} opacity={clamp01(ring)} />}
    </g>
  );
}

/** The whole construction for one curve, revealed by three progress values. */
export function Construction({g, c, v = 1, h = 1, k = 1, color = C.teal, kmLabel, vLabel = 'Vmax', hLabel = '½Vmax', size = 24, pulseV = 0, pulseH = 0, pulseK = 0, labelSide = 'right', hLabelAt = 'axis', kLabelDx = 0, kLabelDy = 0, kAnchor = 'middle', noV = false}: any) {
  return (
    <g data-construction={c.id}>
      {!noV && <VmaxLine g={g} c={c} p={v} color={color} label={vLabel} size={size} pulse={pulseV} labelSide={labelSide} />}
      <HalfLine g={g} c={c} p={h} color={color} label={hLabel} size={size} pulse={pulseH} labelAt={hLabelAt} />
      <KmDrop g={g} c={c} p={k} color={color} label={kmLabel} size={size} pulse={pulseK} labelDx={kLabelDx} labelDy={kLabelDy} anchor={kAnchor} />
    </g>
  );
}

/** Caption for any graph whose values are ours. */
export function SchematicCaption({x, y, text = 'our schematic; not a reproduction of the paper\'s figure', opacity = 1, size = 18}: any) {
  return <Cite x={x} y={y} text={text} size={size} opacity={opacity} />;
}

/** Small progress-curve inset with its t = 0 tangent (L2 overlay, by recall). */
export function ProgressInset({x, y, w = 230, h = 150, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const n = 40; let d = '';
  for (let i = 0; i <= n; i++) { const t = i / n; d += (i ? 'L' : 'M') + (x + 14 + t * (w - 28)) + ' ' + (y + h - 22 - (h - 50) * (1 - Math.exp(-3 * t))); }
  const x0 = x + 14, y0 = y + h - 22, slope = (h - 50) * 3 / (w - 28);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect x={x} y={y} width={w} height={h + 26} rx={12} fill={C.white} stroke={C.line} strokeWidth={2} />
      <path d={`M${x0} ${y + 16}V${y0}H${x + w - 10}`} fill="none" stroke={C.ink} strokeWidth={2} />
      <path d={d} fill="none" stroke={C.ink} strokeWidth={3} />
      <path d={`M${x0} ${y0}L${x0 + 60} ${y0 - 60 * slope}`} stroke={C.teal} strokeWidth={3.5} strokeDasharray="8 6" />
      <Txt x={x + w - 12} y={y0 + 20} size={15} weight={700} anchor="end" fill={C.muted}>time</Txt>
      <Txt x={x0 + 6} y={y + 30} size={15} weight={700} fill={C.muted}>product</Txt>
      <Txt x={x0 + 70} y={y0 - 64 * slope} size={16} weight={800} fill={C.teal}>t = 0 tangent</Txt>
      <Txt x={x + w / 2} y={y + h + 18} size={15} weight={700} anchor="middle" fill={C.muted}>progress curve (L2, recall)</Txt>
    </g>
  );
}
