/** VesicleTransport (published by 4.1.4: `exocytosis`; 4.2.1b adds `phagocytosis`, `pinocytosis`).
 * `exocytosis` (membrane-scale inset, outside at the TOP, cytoplasm at the BOTTOM): a vesicle (a phospholipid-bilayer
 * circle, heads outward and inward) carrying wedge tokens travels up through the cytoplasm to the cell surface membrane
 * (1.2 s); the membranes FUSE (0.6 s): the two apposed bilayers join into continuous leaflets around a fusion pore that
 * opens to the outside — drawn as ONE continuous midline (flat membrane → Ω pocket → flat membrane) offset to two
 * leaflets, so the vesicle lumen becomes continuous with the tissue fluid while the cytoplasm stays separated, and two
 * leaflets exist in every frame (never a cut); the opening widens and the wedges drift out (1.0 s); the pocket flattens
 * into the cell surface membrane (1.0 s). Tag *energy from ATP* (no token reaction for bulk transport) is the beat's.
 * `ExoOutline` is the same event at whole-cell scale: the cell outline is a single line there and the vesicle fuses
 * INTO it, opening it (see below). */
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
    const tx = lum.x + ox * (1 + 1.5 * out3) + 3 * Math.sin(t * 2 + i), ty = (lum.y + oy) + (y + h * 0.24 - (lum.y + oy)) * out3;
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

/** Whole-cell exocytosis (008f, review 4.1.4 #1): the CELL OUTLINE ITSELF takes part. `ExoOutline` draws an elliptical
 * cell outline (cx, cy, rx, ry) as ONE continuous line and, for `age` ≥ approach, fuses the vesicle into it at the
 * outline point at parameter angle `phi`: the vesicle circle and the outline become one line (flat outline → inward
 * Ω pocket → flat outline) whose neck is a real OPENING in the outline to the outside; the neck widens (fuse 0.6 s,
 * release 1.0 s) while the wedges leave through it, then the pocket flattens back into the outline (1.0 s). Before
 * that (approach 1.2 s) the vesicle travels from (vx, vy) until it touches the outline from inside. The pocket is not
 * filled with cytoplasm: its lumen is continuous with the fluid outside, exactly as in `ExocytosisInset`.
 * `to` = where each wedge ends outside (the caller keeps them there afterwards, so nothing jumps). */
export function exoPoint(cx: number, cy: number, rx: number, ry: number, phi: number) {
  const x = cx + rx * Math.cos(phi), y = cy + ry * Math.sin(phi);
  let nx = Math.cos(phi) / rx, ny = Math.sin(phi) / ry; const L = Math.hypot(nx, ny); nx /= L; ny /= L;
  return {x, y, nx, ny, tx: -ny, ty: nx};   // tangent = direction of increasing phi
}
export function ExoOutline({cx, cy, rx, ry, phi = 0, vx, vy, r = 27, age = -1, t = 0, u = 12, n = 3, to = [], fill = '#FBF6FA', stroke = '#6B5B7B', sw = 3, vesFill = '#FFF6F0', vesStroke = '#7A5C8E', showWedges = true}: any) {
  const {approach, fuse, release, flatten} = EXO;
  const a1 = ease(clamp01(age / approach)), a2 = clamp01((age - approach) / fuse), a3 = clamp01((age - approach - fuse) / release), a4 = clamp01((age - approach - fuse - release) / flatten);
  const E = exoPoint(cx, cy, rx, ry, phi);
  const N = 240, ell: number[][] = [];
  for (let i = 0; i < N; i++) { const q = phi + Math.PI + (i / N) * 2 * Math.PI; ell.push([cx + rx * Math.cos(q), cy + ry * Math.sin(q)]); } // starts opposite E
  const sOf = (p: number[]) => (p[0] - E.x) * E.tx + (p[1] - E.y) * E.ty, dOf = (p: number[]) => (p[0] - E.x) * E.nx + (p[1] - E.y) * E.ny;
  const fused = age >= approach && a4 < 1;
  let pts = ell;
  let lumen = {x: 0, y: 0}, hw = 0;
  if (fused) {
    hw = age < approach + fuse ? r * (0.05 + 0.45 * ease(a2)) : r * (0.5 + 0.45 * ease(a3));
    const d = Math.sqrt(Math.max(0, r * r - hw * hw)), c = {x: E.x - E.nx * d, y: E.y - E.ny * d};
    const depth = 1 - ease(a4), al = Math.atan2(d, hw);
    const arc: number[][] = [];
    for (let k = 0; k <= 48; k++) {
      const th = Math.PI - al + (k / 48) * (Math.PI + 2 * al);
      const px = c.x + r * (Math.cos(th) * E.tx + Math.sin(th) * E.nx), py = c.y + r * (Math.cos(th) * E.ty + Math.sin(th) * E.ny);
      const s = (px - E.x) * E.tx + (py - E.y) * E.ty;   // flatten: blend each arc point to the straight outline chord
      arc.push([E.x + E.tx * s + (px - E.x - E.tx * s) * depth, E.y + E.ty * s + (py - E.y - E.ty * s) * depth]);
    }
    const keep = ell.filter((p) => !(Math.abs(sOf(p)) < hw + 1 && dOf(p) > -rx * 0.5));
    // ell starts opposite E, so the removed stretch is in the middle: split and splice the pocket in
    const k0 = ell.findIndex((p) => Math.abs(sOf(p)) < hw + 1 && dOf(p) > -rx * 0.5);
    const before = ell.slice(0, k0).filter((p) => keep.includes(p)), after = ell.slice(k0).filter((p) => keep.includes(p));
    pts = [...before, ...arc, ...after];
    lumen = {x: c.x, y: c.y};
  }
  const d = 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L') + 'Z';
  const out: any[] = [<path key="cell" d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />];
  // free vesicle (approach)
  const vc = {x: vx + (E.x - E.nx * r - vx) * a1, y: vy + (E.y - E.ny * r - vy) * a1};
  if (age < 0) return <g data-role="drawing">{out}</g>;   // not started: the caller draws the waiting vesicle
  if (age < approach) out.push(<circle key="ves" cx={f(vc.x)} cy={f(vc.y)} r={r} fill={vesFill} stroke={vesStroke} strokeWidth={2} />);
  if (showWedges && !(age >= approach + fuse + release)) for (let i = 0; i < n; i++) {
    const home = age < approach ? {x: vc.x + (i - 1) * 13, y: vc.y - 6 + (i === 1 ? 6 : 0)} : {x: lumen.x + (i - 1) * 13, y: lumen.y - 6 + (i === 1 ? 6 : 0)};
    const o = ease(clamp01(a3 * 1.3 - i * 0.12)), dst = to[i] ?? {x: E.x + E.nx * (40 + 22 * i), y: E.y + E.ny * (40 + 22 * i)};
    // out through the neck: home → neck point → destination
    const neck = {x: E.x + E.tx * (i - 1) * hw * 0.5 + E.nx * 4, y: E.y + E.ty * (i - 1) * hw * 0.5 + E.ny * 4};
    const p = o < 0.5 ? {x: home.x + (neck.x - home.x) * (o / 0.5), y: home.y + (neck.y - home.y) * (o / 0.5)} : {x: neck.x + (dst.x - neck.x) * ((o - 0.5) / 0.5), y: neck.y + (dst.y - neck.y) * ((o - 0.5) / 0.5)};
    out.push(<LigandA key={'w' + i} x={p.x} y={p.y} u={10 + (u - 10) * o} rot={8 * Math.sin(t + i) * o} />);
  }
  return <g data-role="drawing">{out}</g>;
}
