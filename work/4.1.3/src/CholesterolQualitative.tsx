/** FluidMosaicMembrane optional state `cholesterol-qualitative` (published by 4.1.3; SHARED-SPECS §4, should-fix 3).
 * A split inset of short bilayer strips (6 phospholipids per leaflet), each captioned; caption on screen throughout:
 * "qualitative schematic; not measured data". No temperature values, no fluidity scale, no numbers of any kind.
 *  Top row, HIGHER temperature (thermometer high): left *no cholesterol* — large jitter and sideways drift;
 *    right *with cholesterol* (two ochre cholesterols per leaflet among the tails) — neighbours of each cholesterol
 *    jitter about half as much.
 *  Bottom row, LOWER temperature (thermometer low): left *no cholesterol* — the tails slide together and pack
 *    closely (lateral head-to-head spacing decreases; the bilayer does NOT get thinner along its normal), motion
 *    nearly stopped; right *with cholesterol* — the rings sit between the tails, which stay spaced and keep moving
 *    slowly. Heads face water in every frame; nothing flips between leaflets.
 * `hot` / `cold` (0..1) run each row's contrast in; before that a row shows its strips at rest. */
import React from 'react';
import {PhospholipidToken} from './PhospholipidToken';
import {Cholesterol} from './FluidMosaicMembrane';
import {T4} from './t4-palette';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const f = (n: number) => n.toFixed(1);

function Thermo({x, y, level}: any) {
  const h = 70, fill = level > 0.5 ? 0.85 : 0.25;
  return (
    <g data-role="drawing">
      <rect x={x - 7} y={y} width={14} height={h} rx={7} fill="#FFFFFF" stroke="#6F6A60" strokeWidth={2} />
      <rect x={x - 3.5} y={y + h * (1 - fill)} width={7} height={h * fill} fill="#B64A30" />
      <circle cx={x} cy={y + h + 8} r={11} fill="#B64A30" stroke="#6F6A60" strokeWidth={2} />
    </g>
  );
}

/** One strip: 6 phospholipids per leaflet (+ 2 cholesterol per leaflet when `chol`). */
function Strip({x, y, w, u, t, chol, amp, pack, seed}: any) {
  const n = 6, out: any[] = [];
  const hy = 1.9 * u;
  const slots = chol ? 8 : 6;
  const gapBase = w / slots, gap = gapBase * (1 - 0.28 * pack);   // lateral spacing shrinks when packing (no chol)
  const x0 = x + (w - gap * (slots - 1)) / 2;
  const cholAt = chol ? [2, 5] : [];
  for (const [dir, lay] of [[1, 0], [-1, 1]] as any) {
    let k = 0;
    for (let sI = 0; sI < slots; sI++) {
      const px = x0 + sI * gap;
      if (cholAt.includes(sI)) {
        const cy = y - dir * hy + dir * 0;
        out.push(<Cholesterol key={`c${lay}${sI}`} x={px + (lay ? 0.5 * gap * 0 : 0)} y={y - dir * hy} u={u} dir={dir} />);
        continue;
      }
      const near = chol && cholAt.some((c) => Math.abs(c - sI) === 1);
      const a = amp * (near ? 0.5 : 1), i = seed + lay * 10 + k;
      const dx = u * a * (0.16 * Math.sin(t * 4.7 + i * 1.9) + 0.12 * Math.sin(t * 7.3 + i * 0.7));
      const dy = u * a * 0.05 * Math.sin(t * 5.9 + i * 1.3);
      const da = a * 7 * Math.sin(t * 4.1 + i * 2.2);
      out.push(<PhospholipidToken key={`p${lay}${sI}`} x={px + dx} y={y - dir * hy + dy} u={u} angle={(dir > 0 ? 0 : 180) + da} />);
      k++;
    }
  }
  return <g>{out}</g>;
}

export function CholesterolQualitative({x, y, w = 560, h = 420, t = 0, hot = 0, cold = 0, glow = 0, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const u = 20, L0 = 150, sw = (w - L0 - 20) / 2, rowH = (h - 70) / 2;
  const rowY = [y + 60 + rowH * 0.5, y + 60 + rowH * 1.5];
  const H = clamp01(hot), Cc = clamp01(cold);
  // top row: higher temperature: without cholesterol large motion; with cholesterol, neighbours restrained
  const topAmp = [0.35 + 0.95 * H, 0.35 + 0.95 * H];
  // bottom row: lower temperature: without cholesterol motion nearly stops and tails pack; with it, slow motion, spaced
  const botAmp = [0.35 * (1 - 0.9 * Cc), 0.35 * (1 - 0.35 * Cc)];
  const lab = (tx: number, ty: number, s: string, size = 21, fill = '#253247', anchor = 'middle') => <text x={tx} y={ty} fontSize={size} fontWeight={700} fill={fill} textAnchor={anchor} fontFamily="'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif">{s}</text>;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={h} rx={14} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      {glow > 0 && <rect data-role="decor" x={x + L0 + 6 + sw} y={y + 36} width={sw + 12} height={h - 44} rx={10} fill="#FFF3C4" opacity={glow} />}
      {lab(x + L0 + sw / 2, y + 30, 'no cholesterol')}
      {lab(x + L0 + 12 + sw * 1.5, y + 30, 'with cholesterol')}
      {[0, 1].map((r) => (
        <g key={r}>
          <Thermo x={x + 30} y={rowY[r] - 48} level={r === 0 ? 1 : 0} />
          {lab(x + 50, rowY[r] - 12, r === 0 ? 'higher' : 'lower', 20, '#6F6A60', 'start')}
          {lab(x + 50, rowY[r] + 12, 'temperature', 20, '#6F6A60', 'start')}
          <rect data-role="decor" x={x + L0} y={rowY[r] - rowH * 0.46} width={sw} height={rowH * 0.92} rx={8} fill={T4.solution} />
          <rect data-role="decor" x={x + L0 + 12 + sw} y={rowY[r] - rowH * 0.46} width={sw} height={rowH * 0.92} rx={8} fill={T4.solution} />
          <Strip x={x + L0} y={rowY[r]} w={sw} u={u} t={t} chol={false} amp={r === 0 ? topAmp[0] : botAmp[0]} pack={r === 1 ? Cc : 0} seed={r * 40} />
          <Strip x={x + L0 + 12 + sw} y={rowY[r]} w={sw} u={u} t={t} chol amp={r === 0 ? topAmp[1] : botAmp[1]} pack={0} seed={r * 40 + 20} />
        </g>
      ))}
      <text x={x + w / 2} y={y + h - 10} fontSize={20} fontWeight={700} fontStyle="italic" fill="#B64A30" textAnchor="middle" fontFamily="'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif">qualitative schematic; not measured data</text>
    </g>
  );
}
