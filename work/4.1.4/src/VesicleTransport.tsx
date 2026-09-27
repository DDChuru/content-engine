/** VesicleTransport (published by 4.1.4: `exocytosis`; 4.2.1b adds `phagocytosis`, `pinocytosis`).
 * `exocytosis` (membrane-scale inset, outside at the TOP, cytoplasm at the BOTTOM): a vesicle (a phospholipid-bilayer
 * circle, heads outward and inward) carrying wedge tokens travels up through the cytoplasm to the cell surface membrane
 * (1.2 s); the membranes FUSE (0.6 s): the two apposed bilayers join into continuous leaflets around a fusion pore that
 * opens to the outside — drawn as ONE continuous midline (flat membrane → Ω pocket → flat membrane) offset to two
 * leaflets, so the vesicle lumen becomes continuous with the tissue fluid while the cytoplasm stays separated, and two
 * leaflets exist in every frame (never a cut); the opening widens and the wedges drift out (1.0 s); the pocket flattens
 * into the cell surface membrane (1.0 s). Tag *energy from ATP* (no token reaction for bulk transport) is the beat's.
 * `ExoCell` is the same event at whole-cell scale (the cell outline is a single line there). */
import React from 'react';
import {T4} from './t4-palette';
import {LigandA} from './ReceptorLigand';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => { t = clamp01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const f = (n: number) => n.toFixed(1);
export const EXO = {approach: 1.2, fuse: 0.6, release: 1.0, flatten: 1.0};

/** Sample a circle (for the free vesicle) and the fused Ω profile, then offset to two leaflets. */
function profile(xa: number, xb: number, y0: number, x0: number, yc: number, R: number, hw: number) {
  const pts: number[][] = [];
  const aN = Math.asin(Math.min(0.999, hw / R));
  const nxL = x0 - R * Math.sin(aN), nyTop = yc - R * Math.cos(aN);
  // left flat part, bending down smoothly into the neck
  const bend = Math.max(8, Math.min(40, y0 - nyTop + 20));
  for (let x = xa; x <= nxL - bend; x += 7) pts.push([x, y0]);
  for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push([nxL - bend + bend * u, y0 + (nyTop - y0) * u * u]); }
  // around the pocket: from the left neck (angle aN left of top) via the bottom to the right neck
  const N = 64;
  for (let i = 1; i < N; i++) { const th = aN + ((2 * Math.PI - 2 * aN) * i) / N; pts.push([x0 - R * Math.sin(th), yc - R * Math.cos(th)]); }
  const nxR = x0 + R * Math.sin(aN);
  for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push([nxR + bend * u, nyTop + (y0 - nyTop) * (1 - (1 - u) * (1 - u))]); }
  for (let x = nxR + bend + 7; x <= xb; x += 7) pts.push([x, y0]);
  return pts;
}
function leaflets(pts: number[][], d: number, closed = false) {
  const A: number[][] = [], B: number[][] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], r = pts[Math.max(0, i - 1)];
    let tx = q[0] - r[0], ty = q[1] - r[1];
    if (closed) { const q2 = pts[(i + 1) % pts.length], r2 = pts[(i - 1 + pts.length) % pts.length]; tx = q2[0] - r2[0]; ty = q2[1] - r2[1]; }
    const L = Math.hypot(tx, ty) || 1, nx = ty / L, ny = -tx / L;      // left normal (points UP on a left→right flat part)
    A.push([p[0] + nx * d, p[1] + ny * d, nx, ny]); B.push([p[0] - nx * d, p[1] - ny * d, -nx, -ny]);
  }
  return [A, B];
}
function heads(side: number[][], spacing: number, r: number, key: string) {
  const out: any[] = []; let acc = spacing;
  for (let i = 1; i < side.length; i++) {
    acc += Math.hypot(side[i][0] - side[i - 1][0], side[i][1] - side[i - 1][1]);
    if (acc >= spacing) { acc = 0; const [x, y, nx, ny] = side[i]; out.push(<g key={key + i}><path d={`M${f(x - nx * r * 0.8)} ${f(y - ny * r * 0.8)}L${f(x - nx * r * 2.4)} ${f(y - ny * r * 2.4)}`} stroke={T4.tail} strokeWidth={Math.max(1.5, r * 0.35)} /><circle cx={f(x)} cy={f(y)} r={r} fill={T4.head} stroke={T4.headEdge} strokeWidth={1} /></g>); }
  }
  return out;
}

/** Membrane-scale exocytosis inset. (x, y, w, h) = panel; `age` = seconds since the vesicle starts to move. */
export function ExocytosisInset({x, y, w, h, age = -1, t = 0, opacity = 1, wedges = 3}: any) {
  if (opacity <= 0) return null;
  const y0 = y + h * 0.36, R = h * 0.18, d = h * 0.045, hr = h * 0.022, x0 = x + w / 2;
  const {approach, fuse, release, flatten} = EXO;
  const a1 = clamp01(age / approach), a2 = clamp01((age - approach) / fuse), a3 = clamp01((age - approach - fuse) / release), a4 = clamp01((age - approach - fuse - release) / flatten);
  const out: any[] = [];
  const xa = x + 14, xb = x + w - 14;
  let lum = {x: x0, y: 0, open: 0};
  if (age < approach) {
    // free vesicle below the flat membrane
    const yc = y0 + R + 2 * d + 6 + (1 - ease(a1)) * h * 0.14;
    const flat: number[][] = []; for (let xx = xa; xx <= xb; xx += 7) flat.push([xx, y0]);
    const [A, B] = leaflets(flat, d);
    const circ: number[][] = []; for (let i = 0; i < 64; i++) { const th = (i / 64) * 2 * Math.PI; circ.push([x0 + R * Math.cos(th), yc - R * Math.sin(th)]); }
    const [VA, VB] = leaflets(circ, d, true);
    out.push(<g key="m">{heads(A, hr * 2.3, hr, 'a')}{heads(B, hr * 2.3, hr, 'b')}</g>, <g key="v">{heads(VA, hr * 2.3, hr, 'va')}{heads(VB, hr * 2.3, hr, 'vb')}</g>);
    lum = {x: x0, y: yc, open: 0};
  } else {
    const hw = age < approach + fuse ? R * 0.05 + R * 0.45 * ease(a2) : R * 0.5 + R * 0.45 * ease(a3);
    const depth = 1 - ease(a4);
    const Rr = R * (0.35 + 0.65 * depth), yc = y0 + Rr * Math.cos(Math.asin(Math.min(0.999, hw / Math.max(Rr, hw + 1)))) + 0.1;
    const hwr = Math.min(hw, Rr * 0.97);
    const pts = depth > 0.02 ? profile(xa, xb, y0, x0, yc, Rr, hwr) : (() => { const p: number[][] = []; for (let xx = xa; xx <= xb; xx += 7) p.push([xx, y0]); return p; })();
    const [A, B] = leaflets(pts, d);
    out.push(<g key="m">{heads(A, hr * 2.3, hr, 'a')}{heads(B, hr * 2.3, hr, 'b')}</g>);
    lum = {x: x0, y: yc, open: clamp01(a2 + a3)};
  }
  // wedge tokens: inside the vesicle lumen, then drifting out through the pore into the tissue fluid
  const tok: any[] = [];
  for (let i = 0; i < wedges; i++) {
    const ox = (i - (wedges - 1) / 2) * R * 0.5, oy = (i % 2 ? 0.15 : -0.1) * R;
    const out3 = ease(clamp01((a3 * 1.4 - i * 0.15)));
    const tx = lum.x + ox * (1 + 1.5 * out3) + 3 * Math.sin(t * 2 + i), ty = (lum.y + oy) + (y + h * 0.12 - (lum.y + oy)) * out3;
    tok.push(<LigandA key={'w' + i} x={tx} y={ty - R * 0.25} u={h * 0.09} rot={10 * Math.sin(t * 1.5 + i)} />);
  }
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={h} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <rect data-role="decor" x={x + 2} y={y + 2} width={w - 4} height={y0 - y - 2} rx={10} fill="#FBF3DD" />
      <g data-role="drawing">{out}{tok}</g>
    </g>
  );
}

/** Whole-cell exocytosis: a vesicle circle (single line at this scale) moves from (vx, vy) to the cell edge point
 * (ex, ey) with outward normal (nx, ny), opens into the outline and releases its wedges outward. */
export function ExoCell({vx, vy, ex, ey, nx = 1, ny = 0, r = 22, age = -1, t = 0, u = 20, n = 3}: any) {
  const {approach, fuse, release, flatten} = EXO;
  const a1 = ease(clamp01(age / approach)), a2 = clamp01((age - approach) / fuse), a3 = clamp01((age - approach - fuse) / release), a4 = clamp01((age - approach - fuse - release) / flatten);
  const cx = vx + (ex - nx * r - vx) * a1, cy = vy + (ey - ny * r - vy) * a1;
  const open = age < approach ? 0 : Math.min(1, 0.3 * a2 + 0.7 * a3);
  const shrink = 1 - a4;
  const out: any[] = [];
  if (shrink > 0.02) {
    const ang = Math.atan2(ny, nx), gap = open * Math.PI * 0.8;
    const s0 = ang + gap / 2, s1 = ang + 2 * Math.PI - gap / 2, rr = r * (0.4 + 0.6 * shrink);
    const ccx = ex - nx * rr, ccy = ey - ny * rr;
    const X = age < approach ? cx : ccx, Y = age < approach ? cy : ccy;
    out.push(<path key="v" d={`M${f(X + rr * Math.cos(s0))} ${f(Y + rr * Math.sin(s0))}A${f(rr)} ${f(rr)} 0 1 1 ${f(X + rr * Math.cos(s1))} ${f(Y + rr * Math.sin(s1))}`} fill={open > 0 ? 'none' : '#FFF6F0'} stroke="#7A5C8E" strokeWidth={2.5} />);
  }
  for (let i = 0; i < n; i++) {
    const o = ease(clamp01(a3 * 1.3 - i * 0.12));
    const px = (age < approach ? cx : ex - nx * r) + (i - 1) * r * 0.45 * (1 - o) + nx * o * (40 + 22 * i) + ny * (i - 1) * 16 * o;
    const py = (age < approach ? cy : ey - ny * r) + ny * o * (40 + 22 * i) - nx * (i - 1) * 16 * o + (1 - o) * (i % 2 ? 5 : -5);
    out.push(<LigandA key={'w' + i} x={px + 2 * Math.sin(t * 2 + i)} y={py} u={u} rot={8 * Math.sin(t + i)} />);
  }
  return <g data-role="drawing">{out}</g>;
}
