/** EnzymeActiveSiteModel (published by L1, 3.1.1-2 STORYBOARD "The models, specified once"; inhibitor states
 * first shown here). Globular silhouette in base ink with ONE addressable active-site cleft on its upper
 * right, cut in the resting lock-and-key state (`rest-lk`) as a fixed notch complementary to the generic
 * substrate (a rounded wedge with one notch). The second binding site is a shallow notch on the lower left.
 * The substrate and both inhibitors are generated from the SAME profile functions as the notches they fit,
 * so complementarity is exact by construction. Distortion (non-competitive) is a shape change of the
 * cleft (motion, reversible), not `denatured`: the silhouette stays tight. No bond is made or broken. */
import React from 'react';
import {BRAND as C, clamp01} from './shared/theme';
import {Txt} from './shared/Type';

export const R = 150;
const TH_C = -Math.PI / 4;        // active site: upper right
const TH_2 = (3 * Math.PI) / 4;   // second site: lower left
const base = (t: number) => R * (1 + 0.055 * Math.sin(3 * t + 0.5) + 0.035 * Math.cos(2 * t));

/** Active-site cleft: half-width (rad), depth, notch bump; d = 0 rest-lk, d = 1 distorted. */
function cleft(d: number) {
  const q = clamp01(d);
  return {half: 0.42 - 0.12 * q, depth: 0.52 * R - 0.14 * R * q, bump: 0.26 + 0.4 * q, bumpAt: 0.32 - 0.5 * q, skew: 0.4 * q};
}
function cleftDepth(u: number, d: number) {
  const c = cleft(d);
  if (Math.abs(u) >= 1) return 0;
  const w = Math.pow(1 - Math.abs(u), 0.62) * (1 + c.skew * u);
  const b = Math.exp(-Math.pow((u - c.bumpAt) / 0.14, 2));
  return c.depth * Math.max(0, w - c.bump * b);
}
const SITE2_HALF = 0.2, SITE2_DEPTH = 0.2 * R;
const site2Depth = (u: number) => (Math.abs(u) >= 1 ? 0 : SITE2_DEPTH * Math.sqrt(1 - u * u));

const pol = (r: number, t: number) => [r * Math.cos(t), r * Math.sin(t)];
const angDiff = (a: number, b: number) => { let x = a - b; while (x > Math.PI) x -= 2 * Math.PI; while (x < -Math.PI) x += 2 * Math.PI; return x; };

export function outline(distort = 0) {
  const n = 420, c = cleft(distort);
  const pts: number[][] = [];
  for (let i = 0; i < n; i++) {
    const t = -Math.PI + (2 * Math.PI * i) / n;
    let r = base(t);
    const u1 = angDiff(t, TH_C) / c.half, u2 = angDiff(t, TH_2) / SITE2_HALF;
    r -= cleftDepth(u1, distort) + site2Depth(u2);
    pts.push(pol(r, t));
  }
  return pts;
}

/** The molecule polygons, in enzyme-local coordinates at their SEATED position. */
export function molecule(kind: 'substrate' | 'comp' | 'noncomp') {
  const pts: number[][] = [];
  if (kind === 'noncomp') {
    for (let i = 0; i <= 40; i++) { const u = -1 + (2 * i) / 40, t = TH_2 + u * SITE2_HALF; pts.push(pol(base(t) - site2Depth(u) + 2, t)); }
    for (let i = 40; i >= 0; i--) { const u = -1 + (2 * i) / 40, t = TH_2 + u * SITE2_HALF; pts.push(pol(base(t) + 0.13 * R * Math.pow(1 - u * u, 0.55) + 2, t)); }
    return pts;
  }
  const c = cleft(0);
  for (let i = 0; i <= 80; i++) {
    const u = -1 + (2 * i) / 80, t = TH_C + u * c.half;
    let r = base(t) - cleftDepth(u, 0) + 3;
    if (kind === 'comp' && u > 0.72) r = base(t) - cleftDepth(0.72, 0) * (1 - (u - 0.72) / 0.28) + 3; // clipped corner
    pts.push(pol(r, t));
  }
  for (let i = 80; i >= 0; i--) {
    const u = -1 + (2 * i) / 80, t = TH_C + u * c.half;
    let cap = 0.2 * R * Math.pow(Math.max(0, 1 - u * u), 0.45) + 3;
    if (kind === 'comp' && u > 0.55) cap = Math.min(cap, 0.2 * R * (1 - (u - 0.55) / 0.45) * 0.9 + 3);
    pts.push(pol(base(t) + cap, t));
  }
  return pts;
}
const poly = (pts: number[][], dx = 0, dy = 0) => 'M' + pts.map(([x, y]) => `${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`).join('L') + 'Z';
const centroid = (pts: number[][]) => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
export const DIR = {substrate: [Math.cos(TH_C), Math.sin(TH_C)], comp: [Math.cos(TH_C), Math.sin(TH_C)], noncomp: [Math.cos(TH_2), Math.sin(TH_2)]};
/** Mouth of each site (enzyme-local), for rings and labels. */
export const SITE = {active: pol(base(TH_C) - 0.12 * R, TH_C), second: pol(base(TH_2) - 0.04 * R, TH_2)};

const MS = {substrate: {fill: C.substrate, stroke: C.ink}, comp: {fill: C.inhibitor, stroke: C.primary}, noncomp: {fill: C.inhibitor, stroke: C.primary}};

/** A molecule relative to an enzyme at (x,y,s): off = distance out along its site's radial direction
 * (0 = seated), slide = tangential offset, rot = degrees about its own centroid. */
export function Mol({x, y, s = 1, kind = 'substrate', off = 0, slide = 0, rot = 0, opacity = 1, hi = 0, dash}: any) {
  if (opacity <= 0) return null;
  const pts = molecule(kind), [dx, dy] = (DIR as any)[kind], [cx, cy] = centroid(pts);
  const tx = dx * off - dy * slide, ty = dy * off + dx * slide;
  const st = (MS as any)[kind];
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${rot.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})`} opacity={opacity < 1 ? opacity : undefined} data-mol={kind}>
      {hi > 0 && <path d={poly(pts)} fill="none" stroke={C.teal} strokeWidth={12 / s} opacity={0.35 * hi} strokeLinejoin="round" />}
      <path d={poly(pts)} fill={dash ? 'none' : st.fill} stroke={st.stroke} strokeWidth={3 / s} strokeLinejoin="round" strokeDasharray={dash} />
    </g>
  );
}
export const molCentre = (kind: 'substrate' | 'comp' | 'noncomp', x: number, y: number, s = 1, off = 0) => {
  const [cx, cy] = centroid(molecule(kind)), [dx, dy] = (DIR as any)[kind];
  return [x + s * (cx + dx * off), y + s * (cy + dy * off)];
};

/** Products: two smaller outlines leaving the cleft (p 0..1 = how far they have drifted). */
export function Products({x, y, s = 1, p = 0, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const [cx, cy] = centroid(molecule('substrate')), [dx, dy] = DIR.substrate;
  const d = 20 + 190 * p;
  const a = [cx + dx * d - dy * (18 + 60 * p), cy + dy * d + dx * (18 + 60 * p)], b = [cx + dx * d + dy * (18 + 60 * p), cy + dy * d - dx * (18 + 60 * p)];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity < 1 ? opacity : undefined} data-mol="products">
      <path d={`M${a[0] - 26} ${a[1]}Q${a[0]} ${a[1] - 30} ${a[0] + 24} ${a[1] - 4}L${a[0] + 8} ${a[1] + 22}Z`} fill={C.substrate} stroke={C.ink} strokeWidth={3 / s} strokeLinejoin="round" />
      <ellipse cx={b[0]} cy={b[1]} rx={22} ry={16} fill={C.substrate} stroke={C.ink} strokeWidth={3 / s} />
    </g>
  );
}

/** The enzyme. distort 0..1 (non-competitive shape change); ring and hi props 0..1; labels opacity 0..1. */
export function Enzyme({x, y, s = 1, distort = 0, opacity = 1, labEnzyme = 0, labActive = 0, labActiveHi = 0, labSecond = 0, ringActive = 0, ringSecond = 0, ringColor = C.primary, secondSmall = true, caption = 0, dimActive = 0, labelSize = 22, activeLabelSide = 'right'}: any) {
  if (opacity <= 0) return null;
  const pts = outline(distort);
  const [ax, ay] = SITE.active, [bx, by] = SITE.second;
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-model="EnzymeActiveSiteModel" data-state={distort > 0 ? 'distorted' : 'rest-lk'}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={poly(pts)} fill={C.enzyme} stroke={C.enzymeEdge} strokeWidth={4 / s} strokeLinejoin="round" />
        {/* a few internal fold lines: schematic backbone, unchanged by the shape change */}
        <path d={`M${-0.55 * R} ${-0.2 * R}C${-0.3 * R} ${-0.55 * R} ${0.05 * R} ${-0.1 * R} ${-0.1 * R} ${0.25 * R}S${0.35 * R} ${0.5 * R} ${0.5 * R} ${0.2 * R}`} fill="none" stroke={C.enzymeEdge} strokeWidth={2.5 / s} opacity={0.35} />
        {ringActive > 0 && <ellipse cx={ax} cy={ay} rx={0.46 * R} ry={0.36 * R} fill="none" stroke={ringColor} strokeWidth={4.5 / s} opacity={clamp01(ringActive)} transform={`rotate(-45 ${ax} ${ay})`} />}
        {ringSecond > 0 && <ellipse cx={bx} cy={by} rx={0.25 * R} ry={0.21 * R} fill="none" stroke={ringColor} strokeWidth={4.5 / s} opacity={clamp01(ringSecond)} />}
      </g>
      {labEnzyme > 0 && <Txt x={x} y={y + (R + 48) * s} size={labelSize} weight={800} anchor="middle" opacity={labEnzyme}>enzyme</Txt>}
      {labActive > 0 && (activeLabelSide === 'right'
        ? <g opacity={labActive}><path d={`M${x + (ax + 30) * s} ${y + (ay - 50) * s}L${x + (ax + 70) * s} ${y + (ay - 110) * s}`} stroke={C.ink} strokeWidth={2} /><Txt x={x + (ax + 76) * s} y={y + (ay - 114) * s} size={labelSize} weight={800} fill={labActiveHi > 0 ? C.teal : C.ink}>active site</Txt></g>
        : <g opacity={labActive}><path d={`M${x + (ax - 20) * s} ${y + (ay - 50) * s}L${x + (ax - 40) * s} ${y + (ay - 120) * s}`} stroke={C.ink} strokeWidth={2} /><Txt x={x + (ax - 40) * s} y={y + (ay - 128) * s} size={labelSize} weight={800} anchor="middle" fill={labActiveHi > 0 ? C.teal : C.ink}>active site</Txt></g>)}
      {labActiveHi > 0 && <rect x={x + (ax + 70) * s} y={y + (ay - 142) * s} width={126} height={labelSize * 1.5} rx={6} fill={C.teal} opacity={0.12 * labActiveHi} />}
      {labSecond > 0 && <g opacity={labSecond}>
        <path d={`M${x + (bx - 30) * s} ${y + (by + 30) * s}L${x + (bx - 60) * s} ${y + (by + 80) * s}`} stroke={C.ink} strokeWidth={2} />
        <Txt x={x + (bx - 60) * s} y={y + (by + 106) * s} size={labelSize - 2} weight={800} anchor="middle">a site other than the active site</Txt>
        {secondSmall && <Txt x={x + (bx - 60) * s} y={y + (by + 106) * s + labelSize * 1.1} size={16} weight={700} anchor="middle" fill={C.muted}>MS p.9 also credits "allosteric site" as the name</Txt>}
      </g>}
      {caption > 0 && <Txt x={x} y={y + (R + (labEnzyme > 0 ? 80 : 44)) * s} size={17} weight={700} anchor="middle" fill={C.muted} opacity={caption}>MODEL · schematic; not a real protein shape</Txt>}
    </g>
  );
}

/** Dashed temporary-bond ticks in the `bound` state (2.3.3 dashed convention). */
export function BoundTicks({x, y, s = 1, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const c = cleft(0), ticks = [-0.55, 0, 0.55].map((u) => { const t = TH_C + u * c.half, r = base(t) - cleftDepth(u, 0); return [pol(r - 16, t + 0.03), pol(r + 18, t - 0.03)]; });
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity < 1 ? opacity : undefined}>{ticks.map(([a, b], i) => <path key={i} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={C.ink} strokeWidth={3 / s} strokeDasharray="5 4" />)}</g>;
}

/** Reaction-rate arrow beside the model: thickness = activity (MODEL). */
export function ActivityArrow({x, y, w = 150, level = 1, opacity = 1, label = 'rate of reaction'}: any) {
  if (opacity <= 0) return null;
  const th = 4 + 18 * clamp01(level);
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-activity={level.toFixed(2)}>
      <path d={`M${x} ${y}H${x + w - 20}`} stroke={C.good} strokeWidth={th} strokeLinecap="butt" />
      <path d={`M${x + w} ${y}L${x + w - 26} ${y - th / 2 - 12}V${y + th / 2 + 12}Z`} fill={C.good} />
      <Txt x={x + w / 2} y={y + th / 2 + 36} size={18} weight={700} anchor="middle" fill={C.muted}>{label}</Txt>
    </g>
  );
}
