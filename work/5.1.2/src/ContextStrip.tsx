/** 5.1.2's own models (published here): set cards, the four-panel ContextStrip drawings (growth · replacement ·
 * repair · asexual reproduction), the knee graze, the mature human red blood cell inset, and the dividing-cell glyph.
 * Drawn schematic vector; colours from T5 (terracotta never used). Every stated event is continuous MOTION driven by
 * parameters the beat animates. Top <g> of each drawing is data-role="drawing"; boxes and tags are decor. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/src/theme';
import {Txt, TextScale, MIN_TEXT} from '../shared/src/Type';
import {T5} from './t5-palette';
import {Chromosome, CId} from './ChromosomeModel';
import {MitosisCellModel, stageAt} from './MitosisCellModel';

const c01 = clamp01;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const f1 = (v: number) => v.toFixed(1);
const IDS: CId[] = ['C1', 'C2', 'C3', 'C4'];
export const SET_NOTE = 'Simplified chromosome-set comparison; not this organism’s chromosome number';

/** Set card: the four C1–C4 chromosomes, gene bands at fixed positions. kind 'X' = replicated-condensed (parent after S),
 * 'rod' = unreplicated-condensed (drawn condensed for comparison). (x, y) = top-left; s = scale. */
export function SetCard({x, y, s = 1, kind = 'rod', hi = 0, glow = 0, tag, op = 1, dim = 0}: any) {
  if (op <= 0) return null;
  const w = 188 * s, h = 112 * s;
  const tfs = Math.max(16 * s, MIN_TEXT / React.useContext(TextScale));   // run 009g: tag below the card at its floored size
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      <rect data-role="decor" x={f1(x)} y={f1(y)} width={f1(w)} height={f1(h)} rx={f1(10 * s)} fill="#FFFFFF" stroke={glow > 0 ? T5.ring : '#D6CEBD'} strokeWidth={f1(glow > 0 ? 2 + 3 * glow : 2)} />
      <g opacity={dim > 0 ? f1(1 - 0.6 * dim) : undefined}>
        {IDS.map((id, i) => <Chromosome key={id} id={id} x={x + w * (0.16 + 0.225 * i)} y={y + h * 0.5 + (i > 1 ? 6 * s : 0)} scale={0.34 * s} cond={1} rep={kind === 'X' ? 1 : -1} hiGene={hi} />)}
      </g>
      {tag && <Txt x={x + w / 2} y={y + h + 6 + 0.8 * tfs} size={tfs} weight={700} fill={T5.ringHalo} anchor="middle">{tag}</Txt>}
    </g>
  );
}
export const setCardW = (s = 1) => 188 * s;
export const setCardH = (s = 1) => 112 * s;
/** Page-space gene-band points of a set card chromosome (for joining lines between matching cards). */
export function setGene(x: number, y: number, s: number, i: number) { const w = 188 * s, h = 112 * s; return [x + w * (0.16 + 0.225 * i), y + h * 0.5 + (i > 1 ? 6 * s : 0)]; }

/** Dividing-cell glyph: a tiny MitosisCellModel (animal or plant) showing a LATE excerpt only (anaphase → cytokinesis);
 * u 0..1 = progress. Callers carry the omitted-interval caption (Round-1 contract). */
export function DivGlyph({x, y, size = 0.1, u = 0, plant = false, op = 1}: any) {
  if (op <= 0) return null;
  const k = c01(u);
  return <MitosisCellModel x={x} y={y} size={size} variant={plant ? 'plant' : 'animal'} {...stageAt(3.15 + 2.85 * k, 1)} opacity={op} />;
}

/** One tissue cell: rounded box with an optional nucleus. */
function TCell({x, y, w, h, nuc = 1, fill = T5.cytoplasm, edge = T5.membrane, sw = 1.8, op = 1, flat = 0}: any) {
  if (op <= 0.01) return null;
  const r = Math.min(w, h) * lerp(0.35, 0.2, flat);
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      <rect x={f1(x - w / 2)} y={f1(y - h / 2)} width={f1(w)} height={f1(h)} rx={f1(r)} fill={fill} stroke={edge} strokeWidth={sw} />
      {nuc > 0.02 && <ellipse cx={f1(x)} cy={f1(y)} rx={f1(Math.min(w, h) * 0.24 * lerp(1, 1.3, flat))} ry={f1(Math.min(w, h) * 0.24 * lerp(1, 0.7, flat))} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={1.2} opacity={nuc < 1 ? f1(nuc) : undefined} />}
    </g>
  );
}

/** Skin strip (outer layer of skin, side view): a basal row of small dividing cells; cells rise, flatten, lose their
 * nuclei and are shed from the surface. t = conveyor phase (continuous; one row per unit); gap = [c0, c1] columns
 * removed from the upper layers (a cut or graze); fill 0..1 regrows the gap (cells from the edges divide and move in);
 * diff 0..1 = regrown top cells flatten into the specialised surface type. Local box 0..w, 0..h. */
export function SkinStrip({x, y, w = 400, h = 190, t = 0, cols = 8, gap, fill = 1, diff = 1, shed = 1, hiBase = 0, divAt = -1, divU = 0, op = 1, nucGone = 1}: any) {
  if (op <= 0) return null;
  const cw = w / cols, rowH = h / 4.3, base = y + h - rowH * 0.55;
  const els: any[] = [];
  const lev = (L: number) => base - rowH * L * 0.92;
  // connective layer below
  els.push(<rect key="bm" x={f1(x)} y={f1(base + rowH * 0.42)} width={f1(w)} height={f1(rowH * 0.3)} rx={3} fill="#EADFCB" />);
  for (let j = 0; j < cols; j++) {
    const cx = x + cw * (j + 0.5);
    const inGap = gap && j >= gap[0] && j <= gap[1];
    const phase = shed > 0 ? ((t + j * 0.37) % 1 + 1) % 1 : 0;
    for (let k = 3; k >= 0; k--) {
      let L = k + phase;
      if (L > 3.95 && shed <= 0) continue;
      const Lc = Math.min(L, 3.6);
      const fl = c01(Lc / 3);
      let op2 = L > 3.4 ? c01(1 - (L - 3.4) / 0.6) : 1;
      let dx = L > 3.4 ? (L - 3.4) * cw * 0.6 * (j % 2 ? 1 : -1) : 0, dy = L > 3.4 ? -(L - 3.4) * rowH * 0.9 : 0;
      if (inGap && k >= 1) {
        const need = (k - 0.5) / 3, got = c01((fill - need) * 3.2);
        if (got <= 0) continue;
        const edge = (j - gap[0]) < (gap[1] - gap[0] + 1) / 2 ? -1 : 1;
        const far = edge < 0 ? j - gap[0] + 1 : gap[1] - j + 1;
        dx += (1 - ease(got)) * edge * cw * far; op2 *= got;
      }
      const flatK = inGap && k >= 2 ? fl * diff : fl;
      const cwid = cw * lerp(0.92, 1.12, flatK), chei = rowH * lerp(0.95, 0.42, flatK);
      els.push(<TCell key={`c${j}-${k}`} x={cx + dx} y={lev(Lc) + dy} w={cwid} h={chei} flat={flatK} nuc={nucGone ? c01(1 - (Lc - 2.2) / 0.7) : 1} op={op2}
        fill={Lc > 2.6 ? '#F4ECDC' : T5.cytoplasm} />);
    }
    // the basal (dividing) cell, fixed; pulses as it divides
    const bw = cw * 0.9, bh = rowH * 0.95;
    els.push(<TCell key={`b${j}`} x={cx} y={base} w={bw} h={bh} nuc={1} fill={hiBase > 0 ? '#FFF1EA' : T5.cytoplasm} edge={T5.membrane} />);
    if (divAt === j && divU > 0 && divU < 1) els.push(<DivGlyph key={'dg' + j} x={cx} y={base} size={Math.min(bw, bh) / 640 * 1.05} u={divU} />);
  }
  return <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>{els}</g>;
}
export const skinBase = (y: number, h = 190) => y + h - (h / 4.3) * 0.55;

/** Small-intestine lining (schematic): one villus-like fold lined by a single layer of columnar cells that move from the
 * base towards the tip, where cells are shed. t = conveyor phase. */
export function GutStrip({x, y, w = 400, h = 150, t = 0, shed = 1, op = 1}: any) {
  if (op <= 0) return null;
  const els: any[] = [];
  // two folds side by side
  for (let f = 0; f < 2; f++) {
    const fx = x + w * (0.27 + 0.46 * f), top = y + h * 0.12, bot = y + h, hw = w * 0.1;
    const P = (u: number) => {   // u 0 = left base … 0.5 = tip … 1 = right base; returns point on the fold edge + outward normal
      if (u < 0.4) { const k = u / 0.4; return [fx - hw, lerp(bot, top + hw, k), -1, 0]; }
      if (u > 0.6) { const k = (u - 0.6) / 0.4; return [fx + hw, lerp(top + hw, bot, k), 1, 0]; }
      const k = (u - 0.4) / 0.2, a = Math.PI + k * Math.PI; return [fx + hw * Math.cos(a), top + hw + hw * Math.sin(a), Math.cos(a), Math.sin(a)];
    };
    els.push(<path key={'core' + f} d={`M${f1(fx - hw)} ${f1(bot)}V${f1(top + hw)}C${f1(fx - hw)} ${f1(top - hw * 0.33)} ${f1(fx + hw)} ${f1(top - hw * 0.33)} ${f1(fx + hw)} ${f1(top + hw)}V${f1(bot)}Z`} fill="#EADFCB" />);
    const N = 7;
    for (let i = 0; i < N; i++) for (const side of [0, 1]) {
      const ph = ((i / N + (shed > 0 ? t * 0.14 : 0)) % 1);
      const Ls = bot - top - hw, La = Math.PI * hw / 2, fs = Ls / (Ls + La);
      const uh = ph < fs ? 0.4 * ph / fs : 0.4 + 0.1 * (ph - fs) / (1 - fs);
      const u = side === 0 ? uh : 1 - uh;
      const [px, py, nx, ny] = P(Math.min(u, 1));
      const nearTip = c01((ph - 0.88) / 0.12);
      const cx = px + nx * (11 + nearTip * 16), cy = py + ny * (11 + nearTip * 16) - nearTip * 8;
      els.push(<TCell key={`g${f}-${i}-${side}`} x={cx} y={cy} w={21} h={21} nuc={1} op={1 - nearTip} sw={1.4} />);
    }
  }
  els.push(<rect key="base" x={f1(x)} y={f1(y + h - 4)} width={f1(w)} height={6} rx={3} fill="#D9CDB4" />);
  return <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>{els}</g>;
}

/** Root tip in longitudinal view (tip pointing down): root cap, a band of small dividing cells just behind it, and above
 * it cells that lengthen. elong 0..1 lengthens the elongation-zone cells (the tip moves down); div 0..1 = a plant
 * dividing-cell glyph running in the division band (second run when div > 1). Local (x, y) = top centre. */
export function RootTip({x, y, s = 1, elong = 0, div = 0, op = 1}: any) {
  if (op <= 0) return null;
  const cw = 26 * s, n = 5, W = cw * n, els: any[] = [];
  const eH = (i: number) => (22 + 26 * ease(c01(elong * 1.25 - i * 0.12))) * s;   // elongation zone rows (top rows oldest)
  let yy = y;
  // older (mature) region
  for (let r = 0; r < 2; r++) { for (let j = 0; j < n; j++) els.push(<rect key={`m${r}${j}`} x={f1(x - W / 2 + j * cw)} y={f1(yy)} width={f1(cw)} height={f1(52 * s)} fill="#F4ECDC" stroke={T5.membrane} strokeWidth={1.4} />); yy += 52 * s; }
  const e0 = yy;
  for (let r = 0; r < 3; r++) { const hh = eH(2 - r); for (let j = 0; j < n; j++) els.push(<rect key={`e${r}${j}`} x={f1(x - W / 2 + j * cw)} y={f1(yy)} width={f1(cw)} height={f1(hh)} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={1.4} />); yy += hh; }
  const e1 = yy, d0 = yy;
  for (let r = 0; r < 3; r++) { for (let j = 0; j < n; j++) { const cx = x - W / 2 + (j + 0.5) * cw, cy = yy + 11 * s; els.push(<g key={`d${r}${j}`}><rect x={f1(cx - cw / 2)} y={f1(yy)} width={f1(cw)} height={f1(22 * s)} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={1.4} /><circle cx={f1(cx)} cy={f1(cy)} r={f1(6.5 * s)} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={1} /></g>); } yy += 22 * s; }
  const d1 = yy;
  // root cap: a rounded cone of cells
  const capH = 58 * s;
  els.push(<path key="cap" d={`M${f1(x - W / 2)} ${f1(yy)}C${f1(x - W / 2)} ${f1(yy + capH * 0.8)} ${f1(x - W * 0.18)} ${f1(yy + capH)} ${f1(x)} ${f1(yy + capH)}C${f1(x + W * 0.18)} ${f1(yy + capH)} ${f1(x + W / 2)} ${f1(yy + capH * 0.8)} ${f1(x + W / 2)} ${f1(yy)}Z`} fill="#EFE3C8" stroke={T5.cellWall} strokeWidth={2} />);
  for (let j = 0; j < 3; j++) els.push(<path key={'cl' + j} d={`M${f1(x - W * (0.4 - j * 0.13))} ${f1(yy + 4)}Q${f1(x - W * 0.05)} ${f1(yy + capH * (0.45 + 0.15 * j))} ${f1(x + W * (0.4 - j * 0.13))} ${f1(yy + 4)}`} fill="none" stroke={T5.cellWall} strokeWidth={1.2} opacity={0.7} />);
  // outline of the root
  els.push(<path key="edge" d={`M${f1(x - W / 2)} ${f1(y)}V${f1(yy)}M${f1(x + W / 2)} ${f1(y)}V${f1(yy)}`} stroke={T5.cellWall} strokeWidth={3} />);
  // plant dividing glyph in the middle of the division band (a cell bigger than the grid, drawn over it)
  const u1 = c01(div), u2 = c01(div - 1);
  const gx = x, gy = (d0 + d1) / 2;
  if (div > 0 && div < 2.02) els.push(<g key="dv"><rect x={f1(gx - 34 * s)} y={f1(gy - 23 * s)} width={f1(68 * s)} height={f1(46 * s)} fill="#FFFFFF" opacity={0.9} /><MitosisCellModel x={gx} y={gy} size={0.1 * s} variant="plant" {...stageAt(3.15 + 2.85 * (div > 1 ? u2 : u1), 1)} /></g>);
  return {el: <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>{els}</g>, zones: {elong: [e0, e1], div: [d0, d1], cap: [d1, d1 + capH], W, bottom: d1 + capH}};
}

/** Simple human outline (front view) that grows taller: grow 0..1 (0.72 → 1 of full height h). (x, y) = feet centre. */
export function Human({x, y, h = 220, grow = 1, op = 1, hi = 0}: any) {
  if (op <= 0) return null;
  const H = h * lerp(0.72, 1, ease(c01(grow))), k = H / 220;
  const T = (px: number, py: number) => `${f1(x + px * k)} ${f1(y - py * k)}`;
  const d = `M${T(-14, 0)}L${T(-10, 92)}L${T(-24, 98)}L${T(-34, 176)}L${T(-24, 178)}L${T(-12, 120)}L${T(-16, 172)}L${T(16, 172)}L${T(12, 120)}L${T(24, 178)}L${T(34, 176)}L${T(24, 98)}L${T(10, 92)}L${T(14, 0)}L${T(4, 0)}L${T(0, 80)}L${T(-4, 0)}Z`;
  return (
    <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>
      <path d={d} fill="#E9DCC4" stroke={T5.membrane} strokeWidth={2.2} strokeLinejoin="round" />
      <circle cx={f1(x)} cy={f1(y - 196 * k)} r={f1(20 * k)} fill="#E9DCC4" stroke={T5.membrane} strokeWidth={2.2} />
      {hi > 0 && <circle data-role="decor" cx={f1(x)} cy={f1(y - 100 * k)} r={f1(110 * k)} fill="none" stroke={T5.ring} strokeWidth={4} opacity={f1(hi)} />}
    </g>
  );
}

/** Strawberry plant with a runner along the soil line and a plantlet. runner 0..1 grows the runner; roots 0..1 roots
 * of the plantlet; leaf 0..1 unfolds its leaves; pulse = position 0..1 of a dividing glyph travelling along the runner.
 * (x, y) = parent crown at the soil line; L = runner length. */
export function Strawberry({x, y, L = 250, runner = 1, roots = 1, leaf = 1, pulse = -1, op = 1}: any) {
  if (op <= 0) return null;
  const els: any[] = [];
  const leafAt = (cx: number, cy: number, sc: number, key: string, ang = 0) => {
    if (sc <= 0.02) return null;
    const lf = (a: number) => { const r = (a * Math.PI) / 180; const lx = cx + Math.sin(r) * 36 * sc, ly = cy - Math.cos(r) * 36 * sc; return <ellipse key={key + a} cx={f1(lx)} cy={f1(ly)} rx={f1(13 * sc)} ry={f1(19 * sc)} transform={`rotate(${a} ${f1(lx)} ${f1(ly)})`} fill="#5E9A4C" stroke="#2F602C" strokeWidth={1.4} />; };
    return <g key={key}>{[ang - 38, ang, ang + 38].map(lf)}</g>;
  };
  // soil
  els.push(<rect key="soil" x={f1(x - 120)} y={f1(y)} width={f1(L + 220)} height={70} fill="#E3D3B5" />);
  els.push(<line key="soilL" x1={f1(x - 120)} y1={f1(y)} x2={f1(x + L + 100)} y2={f1(y)} stroke="#9C8660" strokeWidth={2.5} />);
  // parent: roots, stalks, leaves, a berry
  for (const dx of [-14, -4, 6, 16]) els.push(<path key={'pr' + dx} d={`M${f1(x + dx * 0.4)} ${f1(y)}Q${f1(x + dx)} ${f1(y + 30)} ${f1(x + dx * 1.6)} ${f1(y + 55)}`} fill="none" stroke="#9C8660" strokeWidth={2} />);
  for (const [dx, hh, a] of [[-30, 90, -25], [0, 118, 0], [30, 92, 25]]) {
    els.push(<path key={'st' + dx} d={`M${f1(x)} ${f1(y)}Q${f1(x + dx * 0.4)} ${f1(y - hh * 0.5)} ${f1(x + dx)} ${f1(y - hh)}`} fill="none" stroke="#2F602C" strokeWidth={3} />);
    els.push(leafAt(x + dx, y - hh, 1, 'pl' + dx, a));
  }
  els.push(<path key="berry" d={`M${f1(x - 44)} ${f1(y - 24)}C${f1(x - 60)} ${f1(y - 44)} ${f1(x - 30)} ${f1(y - 54)} ${f1(x - 30)} ${f1(y - 38)}C${f1(x - 26)} ${f1(y - 20)} ${f1(x - 38)} ${f1(y - 12)} ${f1(x - 44)} ${f1(y - 24)}Z`} fill="#C8423A" stroke="#7E2620" strokeWidth={1.5} />);
  // runner along the soil line (grows out, motion)
  const r = c01(runner);
  if (r > 0) els.push(<path key="run" d={`M${f1(x + 6)} ${f1(y - 4)}C${f1(x + L * 0.35)} ${f1(y - 20)} ${f1(x + L * 0.65)} ${f1(y - 20)} ${f1(x + L)} ${f1(y - 3)}`} fill="none" stroke="#6E8F3A" strokeWidth={3.5} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={f1(1 - r)} />);
  // plantlet: roots grow down, leaves unfold
  const px = x + L;
  const rt = c01(roots);
  if (rt > 0) for (const dx of [-8, 0, 9]) els.push(<path key={'rr' + dx} d={`M${f1(px)} ${f1(y)}L${f1(px + dx * rt)} ${f1(y + 44 * rt)}`} stroke="#9C8660" strokeWidth={2} />);
  const lf = ease(c01(leaf));
  if (lf > 0) { els.push(<path key="pst" d={`M${f1(px)} ${f1(y - 3)}L${f1(px)} ${f1(y - 3 - 50 * lf)}`} stroke="#2F602C" strokeWidth={2.5} />); els.push(leafAt(px, y - 3 - 50 * lf, 0.7 * lf, 'kl')); }
  if (pulse >= 0 && pulse <= 1) { const t = c01(pulse), gx = lerp(x + 20, px, t), gy = y - 4 - 22 * 4 * t * (1 - t) * 0.9; els.push(<DivGlyph key="pg" x={gx} y={gy - 10} size={0.05} u={(pulse * 3) % 1} />); }
  return <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>{els}</g>;
}

/** Mature human red blood cell inset: already mature, no nucleus from its first frame (biconcave disc, face view). */
export function RBCInset({x, y, r = 70, op = 1}: any) {
  if (op <= 0) return null;
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      <circle data-role="decor" cx={f1(x)} cy={f1(y)} r={f1(r)} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <g data-role="drawing">
        <circle cx={f1(x)} cy={f1(y)} r={f1(r * 0.62)} fill="#C0392B" stroke="#7E2620" strokeWidth={2} />
        <circle cx={f1(x)} cy={f1(y)} r={f1(r * 0.3)} fill="#D9695C" />
      </g>
    </g>
  );
}

/** Knee (side view) with a graze on its front; returns the graze point. */
export function Knee({x, y, s = 1, op = 1}: any) {
  if (op <= 0) return null;
  const T = (px: number, py: number) => `${f1(x + px * s)} ${f1(y + py * s)}`;
  return (
    <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>
      <path d={`M${T(-190, -150)}C${T(-110, -120)} ${T(-40, -90)} ${T(10, -40)}C${T(40, -10)} ${T(40, 40)} ${T(10, 90)}L${T(-40, 240)}L${T(-110, 240)}L${T(-60, 90)}C${T(-70, 40)} ${T(-120, 0)} ${T(-210, -40)}Z`} fill="#E9DCC4" stroke={T5.membrane} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${T(22, -12)}C${T(34, 4)} ${T(36, 22)} ${T(30, 38)}`} fill="none" stroke="#B5705F" strokeWidth={9} strokeLinecap="round" opacity={0.8} />
    </g>
  );
}
export const kneeGraze = (x: number, y: number, s = 1) => [x + 32 * s, y + 12 * s];

/** Panel frame for the ContextStrip (decor) with its title. */
export function PanelFrame({x, y, w, h, title, lit = 0, dim = 0, children, op = 1}: any) {
  if (op <= 0) return null;
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      <rect data-role="decor" x={f1(x)} y={f1(y)} width={f1(w)} height={f1(h)} rx={14} fill="#FFFFFF" stroke={lit > 0 ? T5.ring : '#D6CEBD'} strokeWidth={f1(2 + 3 * lit)} />
      <g opacity={dim > 0 ? f1(1 - 0.6 * dim) : undefined}>
        {children}
        {title && <Txt x={x + 16} y={y + 30} size={Math.max(15, Math.min(24, w / 18))} weight={800} fill={T5.ringHalo}>{title}</Txt>}
        <Txt x={x + w - 12} y={y + h - 10} size={13} weight={600} fill={C.muted} anchor="end" italic>schematic</Txt>
      </g>
    </g>
  );
}
