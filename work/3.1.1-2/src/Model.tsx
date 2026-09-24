/** EnzymeActiveSiteModel (published by L1, reused L2–L6). Everything here is a MODEL: "schematic; not a
 * real protein shape". Coordinates are ENZYME coordinates (silhouette centred on 0,0, ~440×340); a model
 * is placed with <Enzyme x y s>, and pt() converts enzyme coordinates to screen coordinates for labels.
 *
 * States (addressable):
 *  - rest-lk : cleft drawn ALREADY complementary to the generic substrate (CLEFT_LK). Default.
 *  - rest-if : a SEPARATE asset (CLEFT_IF): wider and shallower, with a smaller wall bump — visibly not
 *              fully complementary. Never produced by squeezing rest-lk.
 *  - bound   : substrate seated, three dashed temporary-bond ticks, complex bracket. For induced fit the
 *              cleft CLOSES from CLEFT_IF to the complementary outline over ~0.6 s (motion, `close` 0..1),
 *              and opens back after release.
 *  - products: the substrate outline is replaced (one frame, no cross-fade) by two smaller outlines that
 *              then drift out (motion). The silhouette is unchanged.
 *  - inhibitor-competitive / inhibitor-noncompetitive / second site (SITE2) / denatured: published below,
 *    NOT shown in L1 (L5 and L4a own their motion specs). */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/src/theme';
import {Txt, Tag, textW} from '../shared/src/Type';
import {lerp} from './util';

type Pt = [number, number];
/** Lock-and-key cleft, left rim → right rim. The wall bump (22..50, -112..-82) is the enzyme's; the
 * substrate carries the matching notch. */
export const CLEFT_LK: Pt[] = [[10, -150], [22, -112], [50, -106], [50, -88], [30, -82], [40, -62], [70, -56], [100, -62], [130, -150]];
/** Induced-fit resting cleft: separate drawing, same point count so the closing motion can run. */
export const CLEFT_IF: Pt[] = [[-8, -150], [8, -124], [30, -121], [32, -110], [18, -106], [30, -94], [70, -88], [114, -94], [148, -150]];
export const SEAT: Pt = [70, -150];
/** Second binding site (lower left) — published for L5, not drawn in L1. */
export const SITE2: Pt[] = [[-178, 84], [-150, 70], [-132, 92], [-150, 116], [-176, 108]];

const f = (n: number) => Math.round(n * 100) / 100;
export function outline(cleft: Pt[]) {
  const p0 = cleft[0], pn = cleft[cleft.length - 1];
  return `M${f(p0[0])} ${f(p0[1])}` + cleft.slice(1).map((p) => `L${f(p[0])} ${f(p[1])}`).join('') +
    `C${f(pn[0] + 58)} -150 225 -95 222 -30C220 50 190 130 100 158C20 182 -90 178 -160 130C-220 88 -232 10 -210 -60C-190 -125 -110 -160 -40 -158C${f(p0[0] - 22)} -157 ${f(p0[0] - 8)} -153 ${f(p0[0])} ${f(p0[1])}Z`;
}
export const cleftAt = (mode: 'lk' | 'if', close = 0): Pt[] =>
  mode === 'lk' ? CLEFT_LK : CLEFT_IF.map((p, i) => [lerp(p[0], CLEFT_LK[i][0], close), lerp(p[1], CLEFT_LK[i][1], close)] as Pt);
export const cleftPath = (cl: Pt[]) => 'M' + cl.map((p) => `${f(p[0])} ${f(p[1])}`).join('L');

/** Substrate outlines in SEAT-relative coordinates (seat point = cleft mouth centre). */
const rel = (pts: Pt[]) => pts.map(([x, y]) => [x - SEAT[0], y - SEAT[1]] as Pt);
const BOTTOM = rel([...CLEFT_LK].reverse()); // right rim → left rim along the complementary profile
const CAP_L = 'C-82 -40 -48 -86 0 -86', CAP_R = 'C48 -86 82 -40 60 0';
export const SUB_GEN = `M${BOTTOM.map((p) => `${f(p[0])} ${f(p[1])}`).join('L')}${CAP_L}${CAP_R}Z`;
/** Wrong-notch wedge: the generic wedge mirrored, so its notch is on the wrong side. */
export const SUB_WRONG = `M${BOTTOM.map((p) => `${f(-p[0])} ${f(p[1])}`).join('L')}C82 -40 48 -86 0 -86C-48 -86 -82 -40 -60 0Z`;
/** The two product pieces (the substrate split at its mid-line). */
const LP = rel([[10, -150], [22, -112], [50, -106], [50, -88], [30, -82], [40, -62], [70, -56]]);
const RP = rel([[70, -56], [100, -62], [130, -150]]);
export const PROD_L = `M${LP.map((p) => `${f(p[0])} ${f(p[1])}`).join('L')}L0 -86C-48 -86 -82 -40 -60 0Z`;
export const PROD_R = `M${RP.map((p) => `${f(p[0])} ${f(p[1])}`).join('L')}C82 -40 48 -86 0 -86Z`;

/** Enzyme placement: children draw in enzyme coordinates. */
export function Enzyme({x, y, s = 1, mode = 'lk', close = 0, fill = C.model, edge = C.modelEdge, opacity = 1, pulse = 0, trace = 0, traceColor = C.teal, cleftGlow = 0, children, backbone = 0, links = 0, stubs = 0, tangle}: any) {
  if (opacity <= 0) return null;
  const cl = cleftAt(mode, close);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${f(s)})`} opacity={opacity < 1 ? opacity : undefined}>
      {pulse > 0 && <path d={outline(cl)} fill="none" stroke={C.accent} strokeWidth={10 + 14 * pulse} opacity={0.7 * pulse} strokeLinejoin="round" />}
      <path d={outline(cl)} fill={fill} stroke={edge} strokeWidth={4} strokeLinejoin="round" opacity={tangle !== undefined ? clamp01(tangle) : undefined} />
      {backbone > 0 && <Backbone p={backbone} />}
      {links > 0 && <Links p={links} />}
      {cleftGlow > 0 && <path d={cleftPath(cl)} fill="none" stroke={C.accent} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={0.8 * cleftGlow} />}
      {trace > 0 && <path d={cleftPath(cl)} fill="none" stroke={traceColor} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - clamp01(trace)} />}
      {stubs > 0 && <Stubs p={stubs} />}
      {children}
    </g>
  );
}

/** A faint backbone (the 2.3.1 N–Cα–C repeat, schematic, not to scale) folded inside the silhouette. */
const BB: Pt[] = [[-175, 20], [-128, -92], [-62, -122], [-28, -48], [-108, 6], [-150, 92], [-62, 142], [0, 66], [-18, -8], [40, -24], [96, -18], [160, -76], [196, -8], [150, 62], [62, 44], [20, 122], [108, 146], [176, 96]];
export function catmull(pts: Pt[]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
export const BACKBONE = catmull(BB);
export function Backbone({p = 1, color = C.modelEdge, width = 4, opacity = 0.75}: any) {
  return <path d={BACKBONE} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - clamp01(p)} opacity={opacity} />;
}
/** Tertiary-structure links between loops: three dashed (hydrogen bonds) and one dotted (ionic), the 2.3.3 legend. */
export const LINKS: [Pt, Pt, 'dash' | 'dot'][] = [[[-108, 6], [-40, -30], 'dash'], [[0, 66], [58, 44], 'dash'], [[150, 62], [174, 94], 'dash'], [[-66, 138], [18, 118], 'dot']];
export function Links({p = 1}: any) {
  return (
    <g opacity={clamp01(p)}>
      {LINKS.map(([a, b, k], i) => <path key={i} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={k === 'dash' ? C.teal : C.gold} strokeWidth={4} strokeDasharray={k === 'dash' ? '9 7' : '2 7'} strokeLinecap="round" />)}
    </g>
  );
}
/** Four R-group stubs on the cleft wall (lock-and-key geometry). */
export const STUBS: [Pt, Pt][] = [[[16, -132], [-4, -136]], [[50, -97], [70, -97]], [[40, -66], [34, -46]], [[114, -104], [136, -110]]];
export function Stubs({p = 1}: any) {
  return (
    <g opacity={clamp01(p)}>
      {STUBS.map(([a, b], i) => <g key={i}><path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={C.primary} strokeWidth={5} strokeLinecap="round" /><circle cx={b[0]} cy={b[1]} r={6} fill={C.primary} /></g>)}
    </g>
  );
}

/** A substrate outline drawn in ENZYME coordinates: (dx,dy) = offset of its seat point from the enzyme's
 * SEAT; rot in degrees about its centre. kind: gen | wrong | round. When seated (dx=dy=0) it is inset a
 * hair so the temporary-bond ticks can cross the interface. */
export function Substrate({kind = 'gen', dx = 0, dy = 0, rot = 0, opacity = 1, fill = C.sub, edge = C.subEdge, trace = 0, traceColor = C.teal, ghost = false}: any) {
  if (opacity <= 0) return null;
  const tx = SEAT[0] + dx, ty = SEAT[1] + dy;
  const d = kind === 'wrong' ? SUB_WRONG : SUB_GEN;
  return (
    <g transform={`translate(${f(tx)} ${f(ty - 3)}) rotate(${f(rot)} 0 0)`} opacity={opacity < 1 ? opacity : undefined}>
      {kind === 'round' ? <circle cx={0} cy={-64} r={64} fill={ghost ? 'none' : '#CFE3C8'} stroke={ghost ? edge : '#3E6B35'} strokeWidth={4} strokeDasharray={ghost ? '10 7' : undefined} />
        : <g transform="translate(0 40) scale(0.965) translate(0 -40)"><path d={d} fill={ghost ? 'none' : kind === 'wrong' ? '#E9C9A8' : fill} stroke={ghost ? edge : kind === 'wrong' ? '#8A5A2B' : edge} strokeWidth={4} strokeLinejoin="round" strokeDasharray={ghost ? '10 7' : undefined} /></g>}
      {trace > 0 && kind === 'gen' && <g transform="translate(0 40) scale(0.965) translate(0 -40)"><path d={`M${BOTTOM.map((p) => `${f(p[0])} ${f(p[1])}`).join('L')}`} fill="none" stroke={traceColor} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - clamp01(trace)} /></g>}
    </g>
  );
}
/** Products: two pieces, (lx,ly)/(rx,ry) offsets from the seat; drawn only once the switch has happened. */
export function Products({lx = 0, ly = 0, rx = 0, ry = 0, opacity = 1, fill = C.sub, edge = C.subEdge, lrot = 0, rrot = 0}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <g transform={`translate(${f(SEAT[0] + lx - 3)} ${f(SEAT[1] + ly - 3)}) rotate(${f(lrot)} -30 -40) translate(0 40) scale(0.94) translate(0 -40)`}><path d={PROD_L} fill={fill} stroke={edge} strokeWidth={4} strokeLinejoin="round" /></g>
      <g transform={`translate(${f(SEAT[0] + rx + 3)} ${f(SEAT[1] + ry - 3)}) rotate(${f(rrot)} 30 -40) translate(0 40) scale(0.94) translate(0 -40)`}><path d={PROD_R} fill={fill} stroke={edge} strokeWidth={4} strokeLinejoin="round" /></g>
    </g>
  );
}
/** Three dashed temporary-bond ticks across the substrate/cleft interface (bound state only). */
export const TICKS: [Pt, Pt][] = [[[4, -128], [28, -134]], [[70, -46], [70, -68]], [[124, -104], [100, -98]]];
export function Ticks({p = 1, glow = 0}: any) {
  if (p <= 0) return null;
  return (
    <g opacity={clamp01(p)}>
      {TICKS.map(([a, b], i) => <g key={i}>
        {glow > 0 && <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={C.accent} strokeWidth={14} strokeLinecap="round" opacity={glow} />}
        <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={C.ink} strokeWidth={4} strokeDasharray="5 4" />
      </g>)}
    </g>
  );
}
/** Soft bracket around the enzyme–substrate pair (enzyme coordinates). */
export function ComplexBracket({p = 1, color = C.teal, glow = 0}: any) {
  if (p <= 0) return null;
  return <rect x={-258} y={-282} width={506} height={470} rx={70} fill="none" stroke={color} strokeWidth={4 + 4 * glow} strokeDasharray="14 10" opacity={clamp01(p)} />;
}
/** Enzyme coordinates → screen coordinates for a model at (x,y,s). */
export const pt = (x: number, y: number, s: number, ex: number, ey: number): Pt => [x + ex * s, y + ey * s];

/** Label with a leader line from (lx,ly) to the target point (tx,ty), in screen coordinates. */
export function Label({lx, ly, tx, ty, text, size = 24, color = C.ink, anchor = 'start', opacity = 1, weight = 700, hi = false, underline = 0}: any) {
  if (opacity <= 0) return null;
  const w = textW(text, size, weight);
  const ux = anchor === 'end' ? lx - w : anchor === 'middle' ? lx - w / 2 : lx;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {tx !== undefined && <path d={`M${lx + (anchor === 'end' ? 8 : anchor === 'start' ? -8 : 0)} ${ly - size * 0.35}L${tx} ${ty}`} stroke={color} strokeWidth={2} />}
      {tx !== undefined && <circle cx={tx} cy={ty} r={4} fill={color} />}
      {hi && <rect x={ux - 8} y={ly - size} width={w + 16} height={size * 1.35} rx={8} fill={C.accent} opacity={0.45} />}
      <Txt x={lx} y={ly} size={size} weight={weight} fill={color} anchor={anchor}>{text}</Txt>
      {underline > 0 && <path d={`M${ux} ${ly + 7}H${ux + w * clamp01(underline)}`} stroke={C.primary} strokeWidth={4} strokeLinecap="round" />}
    </g>
  );
}
/** MODEL tag + the schematic caption, placed under a model. */
export function ModelTag({x, y, caption = true, opacity = 1, size = 18}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <Tag x={x} y={y} text="MODEL" size={size} fill={C.white} bg={C.modelEdge} stroke={C.modelEdge} anchor="middle" />
      {caption && <Txt x={x} y={y + size * 1.7} size={size} weight={600} fill={C.muted} anchor="middle" italic>schematic; not a real protein shape</Txt>}
    </g>
  );
}
/** Compact enzyme icon (for cells and small insets): the rest-lk silhouette at small scale. */
export function MiniEnzyme({x, y, s = 0.22, opacity = 1, pulse = 0, sub}: any) {
  return (
    <Enzyme x={x} y={y} s={s} opacity={opacity} pulse={pulse}>
      {sub && <Substrate {...sub} />}
    </Enzyme>
  );
}
