/** WaterField (published by 4.1.1-2; DiffusionField builds on it in 4.2.1a).
 * Water tokens (small pale blue circles) in continuous random motion inside rectangular regions; optional short
 * dashed hydrogen-bond lines flickering between neighbouring water tokens (Topic 2 convention). No token is drawn
 * inside a `holes` rect (e.g. the hydrophobic core). Caption (by the beat): *particles drawn schematically; not to
 * scale; far fewer than real*. Motion never freezes unless `speed` is 0 (recap stills only). */
import React from 'react';
import {T4} from './t4-palette';

const rnd = (i: number, k: number) => { const v = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
const refl = (v: number, a: number, b: number) => { const w = b - a; if (w <= 0) return a; let m = (v - a) % (2 * w); if (m < 0) m += 2 * w; return a + (m > w ? 2 * w - m : m); };

/** Positions of every water token at time t. regions: [[x0,y0,x1,y1], ...]; n: count per region (number or array). */
export function waterTokens({regions, n = 30, seed = 1, t = 0, speed = 1, holes = [] as number[][], push = [] as number[][]}: any) {
  const toks: {x: number; y: number; i: number}[] = [];
  regions.forEach((R: number[], ri: number) => {
    const N = Array.isArray(n) ? n[ri] : n, cols = Math.max(1, Math.round(Math.sqrt((N * (R[2] - R[0])) / Math.max(1, R[3] - R[1]))));
    for (let j = 0; j < N; j++) {
      const i = seed * 1000 + ri * 200 + j;
      const col = j % cols, row = Math.floor(j / cols), rows = Math.ceil(N / cols);
      const bx = R[0] + ((col + 0.15 + 0.7 * rnd(i, 1)) / cols) * (R[2] - R[0]);
      const by = R[1] + ((row + 0.15 + 0.7 * rnd(i, 2)) / rows) * (R[3] - R[1]);
      const tt = t * speed;
      const x = refl(bx + 26 * Math.sin(tt * (0.9 + rnd(i, 3)) + 6 * rnd(i, 4)) + 14 * Math.sin(tt * (2.1 + rnd(i, 5)) + 6 * rnd(i, 6)), R[0], R[2]);
      const y = refl(by + 20 * Math.sin(tt * (0.8 + rnd(i, 7)) + 6 * rnd(i, 8)) + 11 * Math.sin(tt * (2.3 + rnd(i, 9)) + 6 * rnd(i, 10)), R[1], R[3]);
      if (holes.some((h: number[]) => x > h[0] && x < h[2] && y > h[1] && y < h[3])) continue;
      let yy = y;   // `push` rects: water excluded from a forming region is displaced to its nearer edge (no token inside)
      for (const h of push) if (x > h[0] && x < h[2] && yy > h[1] && yy < h[3]) yy = yy - h[1] < h[3] - yy ? h[1] - 3 - 9 * rnd(i, 11) : h[3] + 3 + 9 * rnd(i, 11);
      toks.push({x, y: yy, i});
    }
  });
  return toks;
}

export function WaterField(props: any) {
  const {r = 7, opacity = 1, hbonds = 0, hbondDist = 58, t = 0, extra = null, ring = []} = props;
  if (opacity <= 0) return null;
  const toks = waterTokens(props);
  const lines: string[] = [];
  if (hbonds > 0) for (let a = 0; a < toks.length; a++) for (let b = a + 1; b < toks.length; b++) {
    const dx = toks[b].x - toks[a].x, dy = toks[b].y - toks[a].y, d = Math.hypot(dx, dy);
    if (d > hbondDist || d < 2 * r + 4) continue;
    if (Math.sin(t * 2.6 + toks[a].i * 1.7 + toks[b].i * 0.9) < 0.15) continue;   // bonds form and break
    const ux = dx / d, uy = dy / d;
    lines.push(`M${(toks[a].x + ux * (r + 2)).toFixed(1)} ${(toks[a].y + uy * (r + 2)).toFixed(1)}L${(toks[b].x - ux * (r + 2)).toFixed(1)} ${(toks[b].y - uy * (r + 2)).toFixed(1)}`);
  }
  return (
    <g data-role="drawing" data-field="water" opacity={opacity < 1 ? opacity : undefined}>
      {lines.length > 0 && <path d={lines.join('')} stroke={T4.waterEdge} strokeWidth={1.8} strokeDasharray="4 4" fill="none" opacity={hbonds} />}
      {toks.map((k) => <circle key={k.i} cx={k.x.toFixed(1)} cy={k.y.toFixed(1)} r={r} fill={T4.water} stroke={T4.waterEdge} strokeWidth={1.4} />)}
      {extra}
    </g>
  );
}
