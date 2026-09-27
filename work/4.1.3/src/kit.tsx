/** 4.1.1-2 lesson kit: labels with leaders, brackets, the schematic red blood cell, magnifier, sentence surface,
 * and the standard membrane stage (water above and below + FluidMosaicMembrane). Lesson-specific; the shared
 * Topic 4 models are the top-level copies from work/t4-shared. */
import React from 'react';
import {BRAND as C, BODY, clamp01} from '../shared/src/theme';
import {Txt, Lines, Card, Cite, textW} from '../shared/src/Type';
import {FluidMosaicMembrane, FACE} from './FluidMosaicMembrane';
import {WaterField} from './WaterField';
import {T4} from './t4-palette';

export const gt = (s: any) => s.frame / 30;             // global animation clock: motion continues across beats
export const CY = 540, U = 58;                          // membrane stage used by Beats 4–12

/** Text label with an optional straight leader to (lx, ly). Leader is decor. */
export function Lbl({x, y, text, o = 1, size = 22, weight = 700, fill = C.ink, anchor = 'start', lx, ly, lead = C.muted, italic = false, halo = C.warm}: any) {
  if (o <= 0) return null;
  const w = textW(text, size, weight), x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  let d = '';
  if (lx != null) { const ax = lx < x0 ? x0 - 6 : lx > x0 + w ? x0 + w + 6 : lx, ay = ly < y - size ? y - size - 2 : ly > y ? y + 6 : y - size * 0.35; d = `M${ax.toFixed(1)} ${ay.toFixed(1)}L${lx.toFixed(1)} ${ly.toFixed(1)}`; }
  return (
    <g opacity={o < 1 ? o : undefined}>
      {d && <path data-role="decor" d={d} stroke={lead} strokeWidth={1.8} fill="none" />}
      {d && <circle data-role="decor" cx={lx} cy={ly} r={3.2} fill={lead} />}
      {halo && <text x={x} y={y} fontSize={size} fontWeight={weight} fill={halo} stroke={halo} strokeWidth={7} strokeLinejoin="round" textAnchor={anchor} fontFamily={BODY} fontStyle={italic ? 'italic' : undefined}>{text}</text>}
      <Txt x={x} y={y} size={size} weight={weight} fill={fill} anchor={anchor} italic={italic}>{text}</Txt>
    </g>
  );
}
/** Small pill tag. */
export function Pill({x, y, text, o = 1, size = 18, fill = C.ink, bg = C.white, stroke = C.line, anchor = 'start'}: any) {
  if (o <= 0) return null;
  const w = textW(text, size, 700) + size * 1.1, h = size * 1.55, x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g data-role="decor" opacity={o < 1 ? o : undefined}>
      <rect x={x0} y={y - h * 0.68} width={w} height={h} rx={h / 2} fill={bg} stroke={stroke} strokeWidth={1.5} />
      <Txt x={x0 + w / 2} y={y} size={size} weight={700} fill={fill} anchor="middle">{text}</Txt>
    </g>
  );
}
/** Square bracket: vertical (x fixed, y0..y1, opening to +side) or horizontal. */
export function Bracket({x, y0, y1, side = 1, o = 1, color = C.ink, horiz = false, p = 1}: any) {
  if (o <= 0 || p <= 0) return null;
  const k = 12 * side;
  const e = y0 + (y1 - y0) * clamp01(p);
  const d = horiz ? `M${y0} ${x + k}L${y0} ${x}L${e} ${x}L${e} ${x + k}` : `M${x + k} ${y0}L${x} ${y0}L${x} ${e}L${x + k} ${e}`;
  return <path data-role="decor" d={d} stroke={color} strokeWidth={3} fill="none" opacity={o < 1 ? o : undefined} />;
}
/** Soft highlight wash behind something (decor). */
export function Wash({x, y, w, h, o = 1, fill = '#FFF3C4', rx = 10}: any) {
  if (o <= 0) return null;
  return <rect data-role="decor" x={x} y={y} width={w} height={h} rx={rx} fill={fill} opacity={o} />;
}

/** Schematic red blood cell, face view: a biconcave disc drawn as a red disc with a paler centre. */
export function RBC({x, y, r = 150, o = 1, window: win = 0, glow = 0}: any) {
  if (o <= 0) return null;
  return (
    <g data-role="drawing" opacity={o < 1 ? o : undefined}>
      {glow > 0 && <circle cx={x} cy={y} r={r + 10} fill="none" stroke="#FFFFFF" strokeWidth={10} opacity={glow} />}
      <circle cx={x} cy={y} r={r} fill="#D9534B" stroke="#8E2A24" strokeWidth={Math.max(2, r * 0.03)} />
      <circle cx={x} cy={y} r={r * 0.78} fill="#E47C74" />
      <circle cx={x} cy={y} r={r * 0.46} fill="#EE9F97" />
      {win > 0 && <circle cx={x - r * 0.08} cy={y + r * 0.05} r={r * 0.5 * win} fill="#F4EEF2" stroke="#8E2A24" strokeWidth={2} strokeDasharray="7 5" />}
    </g>
  );
}

/** Magnifier ring (decor frame) at (x, y) radius r with a leader to (lx, ly). Children are drawn inside. */
export function Magnifier({x, y, r, lx, ly, o = 1, children}: any) {
  if (o <= 0) return null;
  const dx = lx - x, dy = ly - y, d = Math.hypot(dx, dy) || 1;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <path data-role="decor" d={`M${(x + (dx / d) * r).toFixed(1)} ${(y + (dy / d) * r).toFixed(1)}L${lx} ${ly}`} stroke={C.ink} strokeWidth={2} strokeDasharray="6 5" fill="none" />
      <circle data-role="decor" cx={x} cy={y} r={r} fill="#F2F7FB" stroke={C.ink} strokeWidth={3} />
      {children}
      <circle data-role="decor" cx={x} cy={y} r={r} fill="none" stroke={C.ink} strokeWidth={3} />
    </g>
  );
}

/** Sentence surface: a card whose clauses build in; `parts` = [{text, o, hi}] per line, hi = highlighted words. */
export function Sentence({x, y, w, lines, o = 1, tag, size = 27, h}: any) {
  if (o <= 0) return null;
  const H = h ?? 34 + lines.length * size * 1.35 + 12;
  return (
    <Card x={x} y={y} w={w} h={H} opacity={o} stroke={C.teal} fill="#FFFFFF">
      {tag && <Txt x={x + w - 16} y={y - 8} size={16} weight={700} fill={C.teal} anchor="end">{tag}</Txt>}
      {lines.map((L: any, i: number) => {
        if ((L.o ?? 1) <= 0) return null;
        const yy = y + 22 + size + i * size * 1.35;
        const his = (L.hi || []).map((word: string, k: number) => {
          const at = L.text.indexOf(word); if (at < 0) return null;
          const x0 = x + 24 + textW(L.text.slice(0, at), size, 600), x1 = x0 + textW(word, size, 600);
          return <rect key={k} data-role="decor" x={x0 - 2} y={yy - size * 0.85} width={x1 - x0 + 4} height={size * 1.12} rx={4} fill="#FBD9CE" opacity={(L.hiO ?? 1)} />;
        });
        return <g key={i} opacity={L.o < 1 ? L.o : undefined}>{his}<Txt x={x + 24} y={yy} size={size} weight={600}>{L.text}</Txt></g>;
      })}
    </Card>
  );
}

/** The membrane stage: water above/below (no water in the core) + the membrane. */
export function Stage({s, cy = CY, u = U, cx = 960, water = 1, waterTop = 212, waterBottom = 936, hbonds = 0, mem = {}, n = [34, 26], speed = 1, xw = [80, 1840]}: any) {
  const t = mem.t ?? gt(s);   // a frozen clock (recap) freezes the water too, at exactly its last position
  return (
    <g>
      <WaterField regions={[[xw[0], waterTop, xw[1], cy - FACE * u - 10], [xw[0], cy + FACE * u + 10, xw[1], waterBottom]]} n={n} t={t} opacity={water} hbonds={hbonds} speed={speed} />
      <FluidMosaicMembrane cx={cx} cy={cy} u={u} t={t} {...mem} />
    </g>
  );
}
/** Region labels at the left of the membrane. */
export function RegionLabels({cy = CY, u = U, x = 90, o = 1, oOut, oIn, oCore, plasma = false, hiOut = 0, hiIn = 0}: any) {
  const oo = oOut ?? o, oi = oIn ?? o, oc = oCore ?? o;
  return (
    <g>
      <Lbl x={x} y={cy - FACE * u - 30} text={plasma ? 'outside the cell (watery): plasma' : 'outside the cell (watery)'} o={oo} size={22} fill={hiOut > 0 ? C.primary : C.teal} />
      <Lbl x={x} y={cy + FACE * u + 46} text="cytoplasm (watery)" o={oi} size={22} fill={hiIn > 0 ? C.primary : C.teal} />
      <Lbl x={x} y={cy + 8} text="hydrophobic core" o={oc} size={22} fill={C.muted} />
    </g>
  );
}
export const SCHEM = 'schematic; not to scale';
export const PARTS = 'particles drawn schematically; not to scale; far fewer than real';
export {C, Txt, Lines, Card, Cite, textW, T4, clamp01};

/* ---------------- 4.1.3 additions ---------------- */
import {PhospholipidToken} from './PhospholipidToken';
import {Cholesterol, Glycolipid, BeadChain} from './FluidMosaicMembrane';
/** 4.1.3 stage: membrane at the left two-thirds, RoleGrid at the right. */
export const L3 = {cx: 560, cy: 440, u: 44, xw: [80, 1040]};
export const ROWS = ['phospholipids', 'cholesterol', 'glycolipids', 'proteins', 'glycoproteins'];
export const COLS = ['stability', 'fluidity', 'permeability', 'transport', 'cell signalling', 'cell recognition'];
export const CELLS: Record<string, string> = {
  'phospholipids|fluidity': 'move sideways: fluid',
  'phospholipids|permeability': 'hydrophobic core: barrier to ions and polar molecules',
  'cholesterol|stability': 'helps stability',
  'cholesterol|fluidity': 'regulates fluidity',
  'cholesterol|permeability': 'reduces permeability to small polar molecules and ions',
  'glycolipids|stability': 'chains H-bond with water',
  'glycolipids|cell recognition': 'antigens',
  'proteins|transport': 'channel proteins · carrier proteins',
  'proteins|cell signalling': 'some are receptors',
  'glycoproteins|stability': 'chains H-bond with water',
  'glycoproteins|cell signalling': 'some are receptors',
  'glycoproteins|cell recognition': 'antigens',
};
export function wrap(text: string, w: number, size: number, weight = 600) {
  const out: string[] = []; let line = '';
  for (const word of text.split(' ')) { const tryL = line ? line + ' ' + word : word; if (textW(tryL, size, weight) > w && line) { out.push(line); line = word; } else line = tryL; }
  if (line) out.push(line); return out;
}
export const GRID = {x: 1060, y: 206, w: 790, hdr: 58, rowH: 138, rowW: 176};
export const cellBox = (row: string, col: string) => {
  const cw = (GRID.w - GRID.rowW) / 6, r = ROWS.indexOf(row), c = COLS.indexOf(col);
  return {x: GRID.x + GRID.rowW + c * cw, y: GRID.y + GRID.hdr + r * GRID.rowH, w: cw, h: GRID.rowH};
};
function RowIcon({k, x, y, t}: any) {
  if (k === 'phospholipids') return <PhospholipidToken x={x} y={y - 22} u={24} />;
  if (k === 'cholesterol') return <Cholesterol x={x} y={y - 26} u={34} dir={1} />;
  if (k === 'glycolipids') return <Glycolipid x={x} y={y - 4} u={20} t={t} />;
  if (k === 'proteins') return <g data-role="drawing"><rect x={x - 13} y={y - 34} width={26} height={62} rx={9} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} /></g>;
  return <g data-role="drawing"><rect x={x - 11} y={y - 22} width={22} height={52} rx={8} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} /><BeadChain x={x} y={y - 22} u={26} n={3} t={t} /></g>;
}
/** RoleGrid (lesson panel published by 4.1.3): 5 components × 6 roles. `fill[key]` 0..1 per cell ('row|col'; the
 * transport cell also takes 'proteins|transport:half' for its first half), `rowLit`/`colLit` 0..1, `hi[key]` pulse. */
export function RoleGrid({fill = {}, rowLit = {}, colLit = {}, hi = {}, o = 1, t = 0, dimCells = 0}: any) {
  if (o <= 0) return null;
  const {x, y, w, hdr, rowH, rowW} = GRID, cw = (w - rowW) / 6, H = hdr + 5 * rowH;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={H} rx={14} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
      {COLS.map((c, i) => { const L = rowLit && colLit[c] ? colLit[c] : 0; return (
        <g key={c}>
          {L > 0 && <rect data-role="decor" x={x + rowW + i * cw + 2} y={y + 2} width={cw - 4} height={H - 4} rx={8} fill="#FFF3C4" opacity={0.75 * L} />}
          {wrap(c, cw - 10, 17, 700).map((ln, j, arr) => <Txt key={j} x={x + rowW + i * cw + cw / 2} y={y + hdr / 2 + 6 - (arr.length - 1) * 9 + j * 19} size={17} weight={700} anchor="middle" fill={L > 0.3 ? C.primary : C.ink}>{ln}</Txt>)}
        </g>); })}
      {ROWS.map((r, j) => { const L = rowLit[r] ?? 0, yy = y + hdr + j * rowH; return (
        <g key={r}>
          {L > 0 && <rect data-role="decor" x={x + 2} y={yy + 2} width={w - 4} height={rowH - 4} rx={8} fill="#FFF3C4" opacity={0.75 * L} />}
          <path data-role="decor" d={`M${x + 10} ${yy}H${x + w - 10}`} stroke={C.line} strokeWidth={1.5} />
          <RowIcon k={r} x={x + 36} y={yy + rowH / 2} t={t} />
          {wrap(r, 110, 17, 700).map((ln, i) => <Txt key={i} x={x + 62} y={yy + rowH / 2 + 6 + i * 19} size={17} weight={700} fill={L > 0.3 ? C.primary : C.ink}>{ln}</Txt>)}
        </g>); })}
      {COLS.map((_, i) => <path key={'v' + i} data-role="decor" d={`M${x + rowW + i * cw} ${y + 8}V${y + H - 8}`} stroke={C.line} strokeWidth={1.5} />)}
      {ROWS.map((r) => COLS.map((c) => {
        const key = r + '|' + c, b = cellBox(r, c), txt = CELLS[key];
        let f = fill[key] ?? 0, text = txt;
        if (key === 'proteins|transport' && f <= 0 && (fill['proteins|transport:half'] ?? 0) > 0) { f = fill['proteins|transport:half']; text = 'channel proteins'; }
        const h = hi[key] ?? 0;
        if (!txt || f <= 0) return <Txt key={key} x={b.x + b.w / 2} y={b.y + b.h / 2 + 6} size={18} weight={600} fill="#C9C2B3" anchor="middle">—</Txt>;
        const lines = wrap(text, b.w - 12, 15, 700);
        return (
          <g key={key} opacity={(f < 1 ? f : 1) * (1 - dimCells * 0.5)}>
            <rect data-role="decor" x={b.x + 4} y={b.y + 5} width={b.w - 8} height={b.h - 10} rx={8} fill={h > 0 ? '#FBD9CE' : '#EAF5EE'} stroke={h > 0 ? C.primary : '#9CCBB0'} strokeWidth={h > 0 ? 2.5 : 1.5} />
            {lines.map((ln, i) => <Txt key={i} x={b.x + b.w / 2} y={b.y + b.h / 2 + 5 - (lines.length - 1) * 9 + i * 18} size={15} weight={700} anchor="middle" fill="#1D5A38">{ln}</Txt>)}
          </g>);
      }))}
      <Cite x={x + w} y={y + H + 24} text="roles named in syllabus 4.1.3 (p.21)" anchor="end" />
    </g>
  );
}
/** Standard 4.1.3 membrane stage (water above/below, left two-thirds). */
export function Stage3({s, mem = {}, n = [22, 18], cx = L3.cx, cy = L3.cy, u = L3.u, xw = L3.xw, water = 1}: any) {
  // the carrier's one-run shape-change preview happens in Beat 6; its return is not shown in this lesson, so from Beat 7
  // on it is held in its flipped outline
  return <Stage s={s} cx={cx} cy={cy} u={u} xw={xw} mem={{carrierPhase: s.sc.id >= 7 ? 1 : 0, ...mem}} n={n} water={water} waterBottom={936} />;
}
/** Grid fills: every cell completed in an earlier beat is full; this beat's cells fade in at their cue keys. */
export const FILLS: Record<number, [string, string][]> = {
  4: [['phospholipids|permeability', 'pp']],
  5: [['proteins|transport:half', 'shape']],
  6: [['proteins|transport', 'both']],
  8: [['phospholipids|fluidity', 'fluid'], ['cholesterol|fluidity', 'steady']],
  9: [['cholesterol|stability', 'stable'], ['cholesterol|permeability', 'perm'], ['glycolipids|stability', 'hb'], ['glycoproteins|stability', 'hb']],
  10: [['proteins|cell signalling', 'sent'], ['glycoproteins|cell signalling', 'sent']],
  11: [['glycolipids|cell recognition', 'outer'], ['glycoproteins|cell recognition', 'outer']],
};
export function gridFill(s: any) {
  const id = s.sc.id, out: Record<string, number> = {};
  for (const [b, list] of Object.entries(FILLS)) for (const [k, key] of list) {
    if (Number(b) < id) out[k] = 1; else if (Number(b) === id) out[k] = Math.max(out[k] ?? 0, clamp01(s.a(key) / 0.5));
  }
  return out;
}
/** Region labels for the 4.1.3 stage. */
export function Regions3({o = 1, cy = L3.cy, u = L3.u}: any) {
  return <g>
    <Lbl x={250} y={236} text="outside the cell (watery)" o={o} size={21} fill={C.teal} />
    <Lbl x={250} y={cy + 2.3 * u + 84} text="cytoplasm (watery)" o={o} size={21} fill={C.teal} />
  </g>;
}
import {plPos} from './FluidMosaicMembrane';
import {WaterTok} from './T4Tokens';
/** Crossing lanes between phospholipids: [outer-gap x, inner-gap x] for the lipid-only segments (A, C, E). */
export function lanes(M: any) {
  const g = (i: number, j: number) => (plPos(M, i).x + plPos(M, j).x) / 2;
  return [[g(2, 3), g(13, 14)], [g(7, 8), g(19, 20)], [g(10, 11), g(22, 23)], [g(0, 1), g(12, 13)]];
}
/** A token's hydration halo: five pale blue water tokens around (x, y), jiggling. */
export function Halo({x, y, r = 24, t = 0, o = 1}: any) {
  if (o <= 0) return null;
  return <g opacity={o < 1 ? o : undefined}>{[0, 1, 2, 3, 4].map((k) => { const a = k * 1.2566 + 0.3 * Math.sin(t * 2 + k); return <WaterTok key={k} x={x + Math.cos(a) * r} y={y + Math.sin(a) * r} r={6} />; })}</g>;
}
/** Turn-back at the core (1.5 s): down through the head region, stall where the tails begin, back up. */
export const turnBack = (age: number, x: number, yTop: number, yStall: number) => {
  if (age < 0) return [x, yTop];
  if (age < 0.6) return [x, yTop + (yStall - yTop) * (1 - Math.pow(1 - age / 0.6, 2))];
  if (age < 0.85) return [x + 2 * Math.sin(age * 40), yStall];
  if (age < 1.5) { const k = (age - 0.85) / 0.65; return [x, yStall + (yTop - yStall) * (k * k * (3 - 2 * k))]; }
  return [x, yTop];
};
export const DIM_ALL = {glycolipid: 0.5, 'intrinsic-channel': 0.5, cholesterol: 0.5, 'receptor-glycoprotein': 0.5, 'intrinsic-carrier': 0.5, glycoprotein: 0.5, extrinsic: 0.5};
