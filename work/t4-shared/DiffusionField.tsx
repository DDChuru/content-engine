/** DiffusionField (published by 4.2.1a; reused by 4.2.1b recall, 4.2.2a, 4.2.3-4).
 * A finite set of solute tokens in random motion (short straight runs, direction changes), split between two sides
 * of a boundary: `h` = left | right with a vertical boundary at x = m (the `open` configuration: a dashed middle
 * line, no membrane); `v` = top (outside) / bottom (cytoplasm) with a horizontal membrane band m ± hb (the
 * `membrane` configuration). Crossings are SCRIPTED EVENTS (illustrative counts): each event names its time and
 * direction; the token nearest the boundary on the source side at the start of its approach is the one that
 * crosses, so every counted crossing is an actual drawn crossing and every drawn crossing is an event. Side
 * populations change only at crossings; tokens are never added or removed. The motion never freezes.
 * Events may carry `via` (absolute time → [x, y]) for a crossing path through a protein (carrier cycles).
 * UI parts (counter card, side count tag, net arrow) are exported for the beats to place. */
import React from 'react';
import {T4} from './t4-palette';
import {O2Tok, IonTok, GlucoseTok, WaterTok, SucroseTok} from './T4Tokens';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => { t = clamp01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const hash = (i: number, k: number, s: number) => { const x = Math.sin(i * 127.1 + k * 311.7 + s * 74.7) * 43758.5453; return x - Math.floor(x); };

export type Ev = {t: number; dir: 1 | -1; pre?: number; post?: number; via?: (t: number) => number[]; gx?: number};
export type Geo = {x0: number; y0: number; x1: number; y1: number; orient: 'h' | 'v'; m: number; hb?: number; gates?: number[]; pad?: number};   // gates: x positions (v) or y positions (h) where crossings pass

/** Scripted crossings for ONE counted window: nF forward (A→B) and nR reverse, spread through (t0, t0 + dur),
 * reverse ones interleaved evenly; all fall strictly inside the window. */
export function windowEvents(t0: number, nF: number, nR: number, dur = 5, seed = 1): Ev[] {
  const n = nF + nR, out: Ev[] = [];
  const span = dur - 0.6, step = span / Math.max(1, n);
  for (let k = 0; k < n; k++) {
    const rev = Math.floor(((k + 1) * nR) / n) > Math.floor((k * nR) / n);
    out.push({t: t0 + 0.3 + step * (k + 0.5) + (hash(k, seed, 3) - 0.5) * step * 0.5, dir: rev ? -1 : 1});
  }
  return out;
}
/** Crossings counted in window [w0, w1] up to time t: [forward, reverse]. */
export function countIn(evs: Ev[], w0: number, w1: number, t: number) {
  let f = 0, r = 0;
  for (const e of evs) if (e.t >= w0 && e.t <= w1 && e.t <= t) { if (e.dir > 0) f++; else r++; }
  return [f, r];
}
/** Side populations at time t. */
export function sides(nA: number, nB: number, evs: Ev[], t: number) {
  let a = nA, b = nB;
  for (const e of evs) if (e.t <= t) { a -= e.dir; b += e.dir; }
  return [a, b];
}

function box(G: Geo, side: number) {
  const p = G.pad ?? 16, hb = G.hb ?? 0;
  if (G.orient === 'h') return side === 0 ? [G.x0 + p, G.y0 + p, G.m - hb - p, G.y1 - p] : [G.m + hb + p, G.y0 + p, G.x1 - p, G.y1 - p];
  return side === 0 ? [G.x0 + p, G.y0 + p, G.x1 - p, G.m - hb - p] : [G.x0 + p, G.m + hb + p, G.x1 - p, G.y1 - p];
}
const refl = (v: number, lo: number, hi: number) => { const L = hi - lo; if (L <= 0) return lo; let u = (v - lo) % (2 * L); if (u < 0) u += 2 * L; return lo + (u > L ? 2 * L - u : u); };
/** Random walk on one side from (p0 at time t0): straight runs of dt seconds, each a new direction. */
export function walk(i: number, side: number, t0: number, p0: number[], t: number, G: Geo, speed: number, seed: number) {
  const b = box(G, side), dt = 0.6, run = 34 * speed;
  let x = refl(p0[0], b[0], b[2]), y = refl(p0[1], b[1], b[3]);
  if (t <= t0) return [x, y];
  const n = Math.floor((t - t0) / dt);
  for (let k = 0; k < n; k++) { const an = hash(i, k + Math.floor(t0 * 7), seed) * 6.2832, L = run * (0.6 + 0.8 * hash(i, k, seed + 1)); x = refl(x + Math.cos(an) * L, b[0], b[2]); y = refl(y + Math.sin(an) * L, b[1], b[3]); }
  const f = (t - t0 - n * dt) / dt, an = hash(i, n + Math.floor(t0 * 7), seed) * 6.2832, L = run * (0.6 + 0.8 * hash(i, n, seed + 1));
  return [refl(x + Math.cos(an) * L * f, b[0], b[2]), refl(y + Math.sin(an) * L * f, b[1], b[3])];
}

/** Token positions at time t. Tokens 0..nA-1 start on side A (left/top), the rest on side B. `origin` = time the
 * field starts (its walks begin there). Returns {pts: [{x, y, side, crossing}], a, b}. */
export function fieldState({G, nA, nB, evs = [] as Ev[], t, origin = 0, speed = 1, seed = 1}: any) {
  const N = nA + nB, hb = G.hb ?? 0, A = 0.7, C = G.orient === 'v' ? 0.45 : 0.15;
  const home = (i: number) => { const side = i < nA ? 0 : 1, b = box(G, side); return [b[0] + (b[2] - b[0]) * hash(i, 1, seed + 5), b[1] + (b[3] - b[1]) * hash(i, 2, seed + 5)]; };
  // per-token segment list: {side, t0, p0} walks; crossings in between
  const seg: {side: number; t0: number; p0: number[]}[][] = [];
  for (let i = 0; i < N; i++) seg.push([{side: i < nA ? 0 : 1, t0: origin, p0: home(i)}]);
  const busy: number[] = new Array(N).fill(-1e9);
  const cross: {i: number; e: Ev; ts: number; te: number; p0: number[]; g0: number[]; g1: number[]}[] = [];
  const posAt = (i: number, tt: number) => { const s = seg[i][seg[i].length - 1]; return walk(i, s.side, s.t0, s.p0, tt, G, speed, seed); };
  const sorted = [...evs].sort((p, q) => p.t - q.t);
  for (const e of sorted) {
    const pre = e.via ? (e.pre ?? 2) : A + C, src = e.dir > 0 ? 0 : 1, ts = e.t - pre;
    if (ts > t + 0.001) break;                      // events not yet begun do not affect the drawing
    let best = -1, bd = 1e9;
    for (let i = 0; i < N; i++) {
      const s = seg[i][seg[i].length - 1];
      if (s.side !== src || busy[i] > ts - 0.3) continue;
      const p = posAt(i, ts);
      const target = e.via ? e.via(e.t - pre + (e.via ? 0.7 : 0)) : null;
      const d = target ? Math.hypot(p[0] - target[0], p[1] - target[1]) : G.orient === 'h' ? Math.abs(p[0] - G.m) + (G.gates ? Math.min(...G.gates.map((g) => Math.abs(g - p[1]))) * 0.5 : 0) : Math.abs(p[1] - G.m) + (G.gates ? Math.min(...G.gates.map((g) => Math.abs(g - p[0]))) * 0.5 : 0);
      if (d < bd) { bd = d; best = i; }
    }
    if (best < 0) continue;
    const p0 = posAt(best, ts);
    let g0: number[], g1: number[];
    if (G.orient === 'h') { const y = e.gx ?? (G.gates ? G.gates.reduce((a, g) => (Math.abs(g - p0[1]) < Math.abs(a - p0[1]) ? g : a), G.gates[0]) : Math.max(G.y0 + 20, Math.min(G.y1 - 20, p0[1]))); g0 = e.dir > 0 ? [G.m - hb - 18, y] : [G.m + hb + 18, y]; g1 = e.dir > 0 ? [G.m + hb + 18, y] : [G.m - hb - 18, y]; }
    else {
      const gx = e.gx ?? (G.gates ? G.gates.reduce((a, g) => (Math.abs(g - p0[0]) < Math.abs(a - p0[0]) ? g : a), G.gates[0]) : p0[0]);
      const yo = G.m - hb - 18, yi = G.m + hb + 18;
      g0 = [gx, e.dir > 0 ? yo : yi]; g1 = [gx, e.dir > 0 ? yi : yo];
    }
    const te = e.via ? e.t + (e.post ?? 0) : e.t + C;
    cross.push({i: best, e, ts, te, p0, g0, g1});
    busy[best] = te;
    const endP = e.via ? e.via(te) : g1;
    seg[best].push({side: 1 - src, t0: te, p0: endP});
  }
  const pts = [];
  for (let i = 0; i < N; i++) {
    const c = cross.filter((q) => q.i === i && t >= q.ts && t < q.te).pop();
    if (c) {
      let p: number[];
      if (c.e.via) {
        const tv = c.ts + 0.7;
        if (t < tv) { const q = c.e.via(tv), k = ease((t - c.ts) / 0.7); p = [c.p0[0] + (q[0] - c.p0[0]) * k, c.p0[1] + (q[1] - c.p0[1]) * k]; }
        else p = c.e.via(t);
      } else {
        const tm = c.e.t - C;
        if (t < tm) { const k = ease((t - c.ts) / (tm - c.ts)); p = [c.p0[0] + (c.g0[0] - c.p0[0]) * k, c.p0[1] + (c.g0[1] - c.p0[1]) * k]; }
        else { const k = (t - tm) / (c.te - tm); p = [c.g0[0] + (c.g1[0] - c.g0[0]) * k, c.g0[1] + (c.g1[1] - c.g0[1]) * k]; }
      }
      pts.push({x: p[0], y: p[1], side: -1, crossing: true, i});
    } else {
      // the latest segment that has begun by t
      const ss = seg[i].filter((s) => s.t0 <= t + 1e-6);
      const s = ss.length ? ss[ss.length - 1] : seg[i][0];
      const p = walk(i, s.side, s.t0, s.p0, t, G, speed, seed);
      pts.push({x: p[0], y: p[1], side: s.side, crossing: false, i});
    }
  }
  const [a, b] = sides(nA, nB, evs, t);
  return {pts, a, b};
}

/** Draw a token of kind k. */
export function Tok({k, x, y, s = 1, opacity = 1, rot = 0}: any) {
  if (k === 'o2') return <O2Tok x={x} y={y} r={9 * s} rot={rot} opacity={opacity} />;
  if (k === 'ion') return <IonTok x={x} y={y} r={11 * s} opacity={opacity} />;
  if (k === 'anion') return <IonTok x={x} y={y} r={11 * s} sign="−" opacity={opacity} />;
  if (k === 'glucose') return <GlucoseTok x={x} y={y} r={13 * s} rot={rot} opacity={opacity} />;
  if (k === 'sucrose') return <SucroseTok x={x} y={y} r={12 * s} rot={rot} opacity={opacity} />;
  return <WaterTok x={x} y={y} r={7 * s} opacity={opacity} />;
}
/** The field's tokens (drawing). `hi` = token indices to ring. */
export function FieldTokens({st, k = 'o2', s = 1, t = 0, opacity = 1, hi = [] as number[], trail = 0}: any) {
  if (opacity <= 0) return null;
  return (
    <g data-role="drawing" data-field="particles" opacity={opacity < 1 ? opacity : undefined}>
      {st.pts.map((p: any) => <g key={p.i}>
        {hi.includes(p.i) && <circle cx={p.x} cy={p.y} r={17 * s} fill="none" stroke="#F2A93B" strokeWidth={3} />}
        <Tok k={k} x={p.x} y={p.y} s={s} rot={(p.i * 37 + t * 20) % 360} />
      </g>)}
    </g>
  );
}

/** Crossing counter card: title (e.g. "current five-second window"), two directions, optional subtitle. */
export function CounterCard({x, y, w = 330, la = 'left → right', lb = 'right → left', n = 0, m = 0, title = '', sub = '', o = 1, hi = 0, accent = T4.protein, font = "'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif", dim = false}: any) {
  if (o <= 0) return null;
  const h = sub ? 122 : 90;
  return (
    <g data-role="decor" opacity={o < 1 ? o : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={dim ? '#F4F1EA' : '#FFFFFF'} stroke={hi > 0 ? '#E0892B' : accent} strokeWidth={hi > 0 ? 2 + 2 * hi : 2} />
      <text x={x + 12} y={y + 25} fontSize={20} fontWeight={700} fill={dim ? '#8A857C' : accent} fontFamily={font}>{title}</text>
      <text x={x + 12} y={y + 54} fontSize={21} fontWeight={700} fill={dim ? '#8A857C' : '#1F2A36'} fontFamily={font}>{`${la}: ${n}`}</text>
      <text x={x + 12} y={y + 80} fontSize={21} fontWeight={700} fill={dim ? '#8A857C' : '#1F2A36'} fontFamily={font}>{`${lb}: ${m}`}</text>
      {sub && <text x={x + 12} y={y + 108} fontSize={20} fontWeight={600} fontStyle="italic" fill="#6B6B6B" fontFamily={font}>{sub}</text>}
    </g>
  );
}
/** Side population tag: a rounded box with the number (and a small caption). */
export function SideTag({x, y, n, cap = '', o = 1, font = "'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif", fill = '#1F2A36'}: any) {
  if (o <= 0) return null;
  return (
    <g data-role="decor" opacity={o < 1 ? o : undefined}>
      <rect x={x - 30} y={y - 26} width={60} height={38} rx={8} fill="#FFFFFF" stroke="#8A857C" strokeWidth={1.5} />
      <text x={x} y={y + 2} fontSize={24} fontWeight={800} fill={fill} textAnchor="middle" fontFamily={font}>{n}</text>
      {cap && <text x={x} y={y + 36} fontSize={20} fontWeight={700} fill="#6B6B6B" textAnchor="middle" fontFamily={font}>{cap}</text>}
    </g>
  );
}
/** Net-movement arrow from (x, y), direction (dx, dy) unit, length len (px; 0 = hidden), label. */
export function NetArrow({x, y, dx = 1, dy = 0, len = 0, label = '', o = 1, color = '#C0453D', font = "'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif", lx, ly, anchor = 'middle', hi = 0}: any) {
  if (o <= 0 || len < 2) return null;
  const x2 = x + dx * len, y2 = y + dy * len, px = -dy, py = dx, hw = 16;
  return (
    <g data-role="decor" opacity={o < 1 ? o : undefined}>
      {hi > 0 && <path d={`M${x} ${y}L${x2} ${y2}`} stroke="#FCE7B5" strokeWidth={22} strokeLinecap="round" opacity={hi} />}
      <path d={`M${x} ${y}L${x2 - dx * 18} ${y2 - dy * 18}`} stroke={color} strokeWidth={9} strokeLinecap="round" />
      <path d={`M${x2} ${y2}L${x2 - dx * 26 + px * hw} ${y2 - dy * 26 + py * hw}L${x2 - dx * 26 - px * hw} ${y2 - dy * 26 - py * hw}Z`} fill={color} />
      {label && <text x={lx ?? (x + x2) / 2} y={ly ?? (y + y2) / 2 - 18} fontSize={20} fontWeight={800} fill={color} textAnchor={anchor} fontFamily={font}>{label}</text>}
    </g>
  );
}
