/** WaterPotentialModel (published by 4.2.1a; 4.2.6 adds `cell-vs-solution`; reused by 4.2.2a, 4.2.2b, 4.2.5).
 * Two equal compartments LEFT and RIGHT separated by a partially permeable membrane strip drawn VERTICALLY (its
 * normal horizontal): a short bilayer segment (amber heads, grey tails, no carbohydrate chains) with narrow gaps
 * that, IN THIS MODEL, only water tokens pass (a generic model barrier, captioned by the beat). Water tokens move at
 * random in both compartments and cross only as scripted DiffusionField events through the gaps; sucrose tokens
 * (double hexagons) wander within their compartment and never cross (a turn-back at a gap is available).
 * Beside it, a vertical water-potential SCALE: top tick 0 kPa (the reference), arrow "more negative ↓", no other
 * numbers; markers L and R show each compartment's water potential by ORDER only (unnumbered positions).
 * Compartment volumes are fixed (volume change is not modelled). States (`pure`, `initial`, `net-osmosis`,
 * `equalise`) are set by the beat through the sucrose spawns, the scripted water crossings and the marker depths. */
import React from 'react';
import {T4} from './t4-palette';
import {SucroseTok} from './T4Tokens';
import {Geo, Ev, walk} from './DiffusionField';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => { t = clamp01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const FONT = "'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif";
export const WPM = {x: 360, y: 300, w: 840, h: 480, strip: 44};

/** Field geometry of the model (for DiffusionField fieldState): orient h, gaps at three heights. */
export function wpmGeo(M = WPM): Geo {
  return {x0: M.x, y0: M.y, x1: M.x + M.w, y1: M.y + M.h, orient: 'h', m: M.x + M.w / 2, hb: M.strip / 2, gates: wpmGaps(M), pad: 18};
}
export const wpmGaps = (M = WPM) => [M.y + M.h * 0.2, M.y + M.h * 0.5, M.y + M.h * 0.8];

/** 008f: OPEN ENDS (optional). Each compartment drawn as a window on a larger solution: its far end is open
 * (dashed), so that sustained net osmosis can run without draining one side. For every net crossing (a forward
 * membrane crossing not matched by a reverse one) one water token leaves the far end of the receiving side and one
 * enters the far end of the source side (`wpmEdgeEvents`), so each side's token count (and density) stays constant
 * while crossings through the membrane continue. Edge passages are NOT membrane crossings: keep them out of any
 * counter (pass them to fieldState only). Draw the water tokens clipped to the model box (`WPMClip`). */
export function wpmEdgeEvents(wins: [number, number, number, number?][], M = WPM, seed = 5): Ev[] {
  const out: Ev[] = [];
  const x0 = M.x, x1 = M.x + M.w;
  wins.forEach(([t0, f, r, dur = 5], wi) => {
    const n = Math.abs(f - r);
    if (!n) return;
    const dir = f > r ? -1 : 1;                 // net A→B (left→right) is balanced by one B→A passage through the far ends
    for (let k = 0; k < n; k++) {
      const te = t0 + (dur * (k + 0.5)) / n;
      const y1 = M.y + 50 + hashW(wi, k, seed) * (M.h - 100), y2 = M.y + 50 + hashW(wi, k, seed + 3) * (M.h - 100);
      const from = dir < 0 ? [x1 - 50, y1] : [x0 + 50, y1], exitP = dir < 0 ? [x1 + 26, y1] : [x0 - 26, y1];
      const entP = dir < 0 ? [x0 - 26, y2] : [x1 + 26, y2], to = dir < 0 ? [x0 + 50, y2] : [x1 - 50, y2];
      const pre = 2.0, post = 1.4, ta = te - pre + 0.7;
      const via = (tt: number) => {
        if (tt <= te) { const k2 = Math.max(0, Math.min(1, (tt - ta) / (te - ta))); return [from[0] + (exitP[0] - from[0]) * k2, from[1]]; }
        const k2 = Math.max(0, Math.min(1, (tt - te) / post)); return [entP[0] + (to[0] - entP[0]) * k2, entP[1]];
      };
      out.push({t: te, dir: dir as 1 | -1, pre, post, via});
    }
  });
  return out;
}
const hashW = (i: number, k: number, s: number) => { const x = Math.sin(i * 91.3 + k * 47.9 + s * 13.1) * 43758.5453; return x - Math.floor(x); };
/** Clip for the water tokens of an open-ended model (tokens leaving/entering the far ends are hidden outside). */
export function WPMClip({M = WPM, id = 'wpm-clip', children}: any) {
  return <g><defs><clipPath id={id}><rect x={M.x} y={M.y} width={M.w} height={M.h} /></clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></g>;
}

/** Compartment frame (decor) and the membrane strip (drawing). `ring` = ring the strip (0..1). `openEnds` (008f):
 * the two far ends drawn dashed (each side a window on a larger solution). */
export function WPMFrame({M = WPM, o = 1, ring = 0, t = 0, openEnds = false}: any) {
  if (o <= 0) return null;
  const xm = M.x + M.w / 2, hw = M.strip / 2, gaps = wpmGaps(M), gapH = 30;
  const heads: any[] = [];
  const step = 22;
  for (let y = M.y + 12; y < M.y + M.h - 8; y += step) {
    if (gaps.some((g) => Math.abs(y - g) < gapH / 2 + 8)) continue;
    const j = 1.2 * Math.sin(t * 5 + y * 0.3);
    for (const side of [-1, 1]) {
      const hx = xm + side * (hw - 8) + j;
      heads.push(<g key={`${y}${side}`}><path d={`M${hx - side * 7} ${y - 4}L${xm + side * 2} ${y - 4}M${hx - side * 7} ${y + 4}L${xm + side * 2} ${y + 4}`} stroke={T4.tail} strokeWidth={3} strokeLinecap="round" /><circle cx={hx} cy={y} r={8} fill={T4.head} stroke={T4.headEdge} strokeWidth={1.2} /></g>);
    }
  }
  return (
    <g opacity={o < 1 ? o : undefined}>
      {openEnds ? <g data-role="decor">
        <rect x={M.x} y={M.y} width={M.w} height={M.h} fill="#EEF6FB" />
        <path d={`M${M.x} ${M.y}H${M.x + M.w}M${M.x} ${M.y + M.h}H${M.x + M.w}`} stroke="#9FB6C6" strokeWidth={3} />
        <path d={`M${M.x} ${M.y}V${M.y + M.h}M${M.x + M.w} ${M.y}V${M.y + M.h}`} stroke="#9FB6C6" strokeWidth={3} strokeDasharray="10 12" />
      </g> : <rect data-role="decor" x={M.x} y={M.y} width={M.w} height={M.h} rx={14} fill="#EEF6FB" stroke="#9FB6C6" strokeWidth={3} />}
      <g data-role="drawing">{heads}</g>
      {ring > 0 && <rect data-role="decor" x={xm - hw - 14} y={M.y - 10} width={M.strip + 28} height={M.h + 20} rx={20} fill="none" stroke="#E0892B" strokeWidth={5} opacity={ring} />}
    </g>
  );
}

/** Sucrose tokens: spawns [{t, side, x}] fall from a dropper above the compartment (0.9 s) and then wander on
 * their side; `turn` = {i, t0} sends token i to the middle gap and back (1.5 s). */
export function sucrosePts({M = WPM, spawns, t, turn = null, seed = 7}: any) {
  const G = wpmGeo(M), out: any[] = [];
  spawns.forEach((sp: any, i: number) => {
    if (t < sp.t) return;
    const land = [sp.x, M.y + 60 + ((i * 0.371) % 1) * (M.h - 120)];
    let p: number[];
    if (t < sp.t + 0.9) { const k = ease((t - sp.t) / 0.9); p = [sp.x, M.y - 70 + (land[1] - (M.y - 70)) * k]; }
    else p = walk(200 + i, sp.side, sp.t + 0.9, land, t, G, 0.8, seed);
    if (turn && turn.i === i && t >= turn.t0 && t < turn.t0 + 2.3) {
      const g = [G.m + (sp.side === 0 ? -1 : 1) * (G.hb! + 16), wpmGaps(M)[1]];
      const base = walk(200 + i, sp.side, sp.t + 0.9, land, turn.t0, G, 0.8, seed);
      const u = t - turn.t0;
      if (u < 0.8) { const k = ease(u / 0.8); p = [base[0] + (g[0] - base[0]) * k, base[1] + (g[1] - base[1]) * k]; }
      else if (u < 1.3) p = [g[0] + (sp.side === 0 ? 1 : -1) * 6 * Math.sin((u - 0.8) * 12), g[1]];
      else { const back = walk(200 + i, sp.side, sp.t + 0.9, land, turn.t0 + 2.3, G, 0.8, seed), k = ease((u - 1.3) / 1.0); p = [g[0] + (back[0] - g[0]) * k, g[1] + (back[1] - g[1]) * k]; }
    }
    out.push({x: p[0], y: p[1], i});
  });
  return out;
}
export function SucroseTokens({pts, t = 0, hi = -1}: any) {
  return <g data-role="drawing" data-field="particles">{pts.map((p: any) => <g key={p.i}>{p.i === hi && <circle cx={p.x} cy={p.y} r={24} fill="none" stroke="#F2A93B" strokeWidth={3} />}<SucroseTok x={p.x} y={p.y} r={12} rot={(p.i * 41 + t * 15) % 360} /></g>)}</g>;
}
/** Dropper icon held ABOVE a compartment (never touching). */
export function Dropper({x, y, o = 1, squeeze = 0}: any) {
  if (o <= 0) return null;
  return (
    <g data-role="drawing" opacity={o < 1 ? o : undefined}>
      <rect x={x - 13} y={y - 92} width={26} height={34} rx={10} fill="#C98A5B" stroke="#6B4A2E" strokeWidth={2} transform={squeeze > 0 ? `translate(${x} ${y - 75}) scale(${1 - 0.18 * squeeze} 1) translate(${-x} ${-(y - 75)})` : undefined} />
      <path d={`M${x - 9} ${y - 58}L${x + 9} ${y - 58}L${x + 3} ${y - 6}L${x - 3} ${y - 6}Z`} fill="#F2F6F8" stroke="#6B7C88" strokeWidth={2} />
    </g>
  );
}

/** The vertical water-potential scale. `depth` 0 = the 0 kPa reference tick; larger = more negative (unnumbered).
 * L and R markers at depths dl, dr; `oTitle`, `oZero`, `oArrow`, `oShade`, `oBracket` fade parts in. */
export function WPScale({x, y0, y1, dl = 0, dr = 0, oTitle = 1, oZero = 1, oArrow = 1, oShade = 1, oBracket = 0, oMarkers = 1, hiL = 0, hiR = 0, eq = 0}: any) {
  const yAt = (d: number) => y0 + (y1 - y0) * clamp01(d);
  const yl = yAt(dl), yr = yAt(dr);
  return (
    <g>
      <g data-role="decor">
        {oShade > 0 && <rect x={x - 10} y={y0 + 6} width={20} height={y1 - y0 - 6} fill="#DCE9F2" opacity={oShade} />}
        <path d={`M${x} ${y0}V${y1}`} stroke="#1F2A36" strokeWidth={4} />
        <path d={`M${x - 16} ${y0}H${x + 16}`} stroke="#1F2A36" strokeWidth={4} />
        {oArrow > 0 && <path d={`M${x} ${y1}l-10 -18h20Z`} fill="#1F2A36" opacity={oArrow} />}
      </g>
      {oTitle > 0 && <text x={x} y={y0 - 64} fontSize={24} fontWeight={800} fill="#1F2A36" textAnchor="middle" fontFamily={FONT} opacity={oTitle}>water potential</text>}
      {oZero > 0 && <g opacity={oZero}><text x={x + 66} y={y0 + 8} fontSize={21} fontWeight={800} fill="#1F2A36" fontFamily={FONT}>0 kPa</text><text x={x + 66} y={y0 + 34} fontSize={20} fontWeight={600} fill="#555" fontFamily={FONT}>pure water at atmospheric</text><text x={x + 66} y={y0 + 58} fontSize={20} fontWeight={600} fill="#555" fontFamily={FONT}>pressure (reference)</text></g>}
      {oArrow > 0 && <text x={x + 26} y={y1 - 8} fontSize={21} fontWeight={700} fill="#1F2A36" fontFamily={FONT} opacity={oArrow}>more negative ↓</text>}
      {oShade > 0 && <text x={x + 80} y={(y0 + y1) / 2 + 30} fontSize={20} fontWeight={700} fill="#4E7391" fontFamily={FONT} opacity={oShade}>negative</text>}
      {oBracket > 0 && <g opacity={oBracket}><path data-role="decor" d={`M${x - 40} ${yAt(0.3)}h-12V${yAt(0.62)}h12`} stroke="#1F2A36" strokeWidth={2.5} fill="none" /><text x={x - 70} y={yAt(0.3) + 6} fontSize={20} fontWeight={700} fill="#1F2A36" textAnchor="end" fontFamily={FONT}>higher</text><text x={x - 70} y={yAt(0.46) + 7} fontSize={20} fontWeight={700} fill="#1F2A36" textAnchor="end" fontFamily={FONT}>less negative =</text><text x={x - 70} y={yAt(0.62) + 7} fontSize={20} fontWeight={700} fill="#1F2A36" textAnchor="end" fontFamily={FONT}>lower</text></g>}
      {oMarkers > 0 && <g opacity={oMarkers}>
        <g data-role="decor"><path d={`M${x - 14} ${yl}l-26 -14v28Z`} fill={hiL > 0 ? '#E0892B' : '#2F6B8F'} /><path d={`M${x + 14} ${yr}l26 -14v28Z`} fill={hiR > 0 ? '#E0892B' : '#8E4B6B'} /></g>
        <text x={x - 48} y={yl + 7} fontSize={21} fontWeight={800} fill="#2F6B8F" textAnchor="end" fontFamily={FONT}>L</text>
        <text x={x + 48} y={yr + 7} fontSize={21} fontWeight={800} fill="#8E4B6B" fontFamily={FONT}>{eq > 0.5 ? 'R' : 'R'}</text>
      </g>}
    </g>
  );
}
