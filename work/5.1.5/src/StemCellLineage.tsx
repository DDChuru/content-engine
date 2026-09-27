/** StemCellLineage — 5.1.5's own model (published here). Drawn vector; captioned *one possible pattern* and
 * *schematic; not to scale; intermediate stages simplified* whenever shown (the beat draws the captions).
 * States: marrow (bone, marrow region, stem cell) · dividing (a MitosisCellModel miniature EXCERPT: the omitted-interval
 * caption and hold, an explicit time cut into anaphase, then anaphase → telophase → cytokinesis as motion) · self-renew
 * (daughter A stays in the niche) · differentiating (daughter B moves along the differentiation arrow through three drawn
 * intermediate stages, smaller each time, nucleus smaller and denser, cytoplasm tint deepening in ONE red hue; then the
 * condensed nucleus is pushed out and drifts away) · released (it leaves the marrow into a blood vessel and only there
 * settles into the mature biconcave disc). Skin variant: see ContextStrip's SkinStrip (base layer, graze).
 * Colours: T5 + a clear red for haemoglobin (not terracotta). Top <g> data-role="drawing". */
import React from 'react';
import {BRAND as C} from '../shared/src/theme';
import {Txt} from '../shared/src/Type';
import {T5} from './t5-palette';
import {MitosisCellModel, stageAt} from './MitosisCellModel';

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const f1 = (v: number) => v.toFixed(1);
export const RED = '#C0392B', REDEDGE = '#7E2620';
export const EXCERPT = 'later in the cell cycle; DNA replication in S phase and earlier mitotic stages omitted';

/** Geometry of the marrow lineage (page coords, at the component's own x/y offset). */
export const SL = {N: [270, 470], S: [[470, 470], [560, 470], [650, 470]], V: {x0: 790, x1: 1850, y: 480, h: 96}, M: [1010, 480], marrow: [150, 380, 590, 180]};

/** A round unspecialised cell (stem cell style): large grey nucleus with a darker nucleolus disc; accent outline. */
export function StemCell({x, y, r = 40, op = 1, hi = 0, outline = true}: any) {
  if (op <= 0) return null;
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      {hi > 0 && <circle data-role="decor" cx={f1(x)} cy={f1(y)} r={f1(r + 12)} fill={T5.ring} opacity={f1(0.4 * hi)} />}
      <g data-role="drawing">
        <circle cx={f1(x)} cy={f1(y)} r={f1(r)} fill={T5.cytoplasm} stroke={outline ? T5.ring : T5.membrane} strokeWidth={outline ? 3.5 : 2.5} />
        <circle cx={f1(x)} cy={f1(y)} r={f1(r * 0.55)} fill="#C9C9C9" stroke={T5.envelope} strokeWidth={1.8} />
        <circle cx={f1(x + r * 0.16)} cy={f1(y - r * 0.14)} r={f1(r * 0.16)} fill={T5.nucleolus} />
      </g>
    </g>
  );
}
/** A differentiating cell at stage k (0 = just divided … 3 = nucleus condensed); tint 0..1 (one red hue, intensity only);
 * nuc 1 = nucleus inside … 0 = pushed out (drawn outside by the caller). */
export function DiffCell({x, y, r, tint = 0, nucR = 0.5, nuc = 1, op = 1, dense = 0}: any) {
  if (op <= 0) return null;
  return (
    <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>
      <circle cx={f1(x)} cy={f1(y)} r={f1(r)} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2.2} />
      {tint > 0 && <circle cx={f1(x)} cy={f1(y)} r={f1(r - 1)} fill={RED} opacity={f1(0.85 * c01(tint))} />}
      {nuc > 0 && <circle cx={f1(x)} cy={f1(y)} r={f1(r * nucR)} fill={dense > 0.5 ? '#6E6E6E' : '#B9B9B9'} stroke={T5.envelope} strokeWidth={1.5} />}
    </g>
  );
}
/** Mature human red blood cell, face view (biconcave disc): no nucleus. */
export function RBC({x, y, r = 26, op = 1, pale = 0}: any) {
  if (op <= 0) return null;
  return (
    <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>
      <circle cx={f1(x)} cy={f1(y)} r={f1(r)} fill={pale > 0 ? '#D88C82' : RED} stroke={REDEDGE} strokeWidth={1.8} />
      <circle cx={f1(x)} cy={f1(y)} r={f1(r * 0.45)} fill={pale > 0 ? '#E7B3AB' : '#D9695C'} />
    </g>
  );
}
/** A blood-vessel segment cut open lengthways, with red blood cells flowing left → right (t = flow phase, seconds). */
export function Vessel({x0, x1, y, h = 96, t = 0, n = 7, op = 1, skip = -1, extra}: any) {
  if (op <= 0) return null;
  const L = x1 - x0, cells: any[] = [];
  for (let i = 0; i < n; i++) {
    if (i === skip) continue;
    const u = ((i / n + t * 0.045) % 1 + 1) % 1, cx = x0 + 20 + u * (L - 40), cy = y + (i % 3 - 1) * h * 0.2;
    cells.push(<RBC key={i} x={cx} y={cy} r={h * 0.2} />);
  }
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      <g data-role="drawing">
        <rect x={f1(x0)} y={f1(y - h / 2)} width={f1(L)} height={f1(h)} rx={f1(h / 2)} fill="#F6E1DC" />
        <path d={`M${f1(x0 + h / 2)} ${f1(y - h / 2)}H${f1(x1 - h / 2)}M${f1(x0 + h / 2)} ${f1(y + h / 2)}H${f1(x1 - h / 2)}`} stroke="#B98A80" strokeWidth={4} />
        {cells}
      </g>
      {extra}
    </g>
  );
}
/** Long bone cut open to show the marrow (label drawn by the beat). */
export function Bone({op = 1, hi = 0}: any) {
  if (op <= 0) return null;
  const [mx, my, mw, mh] = SL.marrow;
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      <g data-role="drawing">
        <path d={`M110 330C80 300 70 250 110 240C140 232 150 270 170 300H730C750 270 760 232 790 240C830 250 820 300 790 330C810 360 810 410 790 440V520C810 550 810 600 790 630C820 660 830 710 790 720C760 728 750 690 730 660H170C150 690 140 728 110 720C70 710 80 660 110 630C90 600 90 550 110 520V440C90 410 90 360 110 330Z`} fill="#EFE7D6" stroke="#A8987A" strokeWidth={3} />
        <rect x={mx} y={my} width={mw} height={mh} rx={40} fill="#F6E7C1" stroke="#C9B07A" strokeWidth={2} />
      </g>
      {hi > 0 && <rect data-role="decor" x={mx - 6} y={my - 6} width={mw + 12} height={mh + 12} rx={46} fill="none" stroke={T5.ring} strokeWidth={4} opacity={f1(hi)} />}
    </g>
  );
}

/** One division excerpt at (x, y): u < 0 idle (a stem cell); 0..0.22 hold with the caption (drawn by the caller);
 * at 0.22 an explicit time cut into the anaphase state; 0.22..1 anaphase → telophase → cytokinesis (motion);
 * returns the drawing and whether the excerpt is running. size = MitosisCellModel size. */
export function Excerpt({x, y, u, size = 0.2, r = 40, hi = 0}: any) {
  if (u < 0.22) return <StemCell x={x} y={y} r={r} hi={hi} />;
  const k = c01((u - 0.22) / 0.78);
  return <MitosisCellModel x={x} y={y} size={size} {...stageAt(3.12 + 2.88 * ease(k), 1)} />;
}
export const excerptDaughters = (x: number, y: number, size = 0.2) => [[x - 0.74 * 310 * size, y], [x + 0.74 * 310 * size, y]];

/** Differentiating daughter B along the lineage: p 0..3 through the three intermediate stages (S[0..2]); nucOut 0..1
 * pushes the condensed nucleus out; rel 0..1 carries it into the vessel to M; mature 0..1 settles into the disc.
 * trail: leave faint copies of the passed stages (the lineage record). */
export function DiffPath({p, from, tint = 0, nucOut = 0, rel = 0, mature = 0, trail = 1, op = 1}: any) {
  if (op <= 0) return null;
  const S = SL.S, stage = (k: number) => ({r: lerp(36, 24, k / 2), nucR: lerp(0.5, 0.36, k / 2), dense: k >= 2 ? 1 : 0});
  const els: any[] = [];
  const pc = Math.max(0, Math.min(3, p));
  // trail copies of passed stages
  for (let k = 0; k < 3; k++) if (pc >= k + 1 || (k === 2 && rel > 0)) {
    const st = stage(k);
    els.push(<DiffCell key={'t' + k} x={S[k][0]} y={S[k][1]} r={st.r} tint={[0.3, 0.55, 0.8][k]} nucR={st.nucR} dense={st.dense} op={0.45 * trail} />);
  }
  // the moving cell
  let x, y, r, nr, tt, dense;
  if (pc < 1) { const e = ease(pc); x = lerp(from[0], S[0][0], e); y = lerp(from[1], S[0][1], e); r = lerp(40, 36, e); nr = 0.5; tt = 0.3 * e; dense = 0; }
  else { const k = Math.min(2, Math.floor(pc - 1 + 1e-9)), e = ease(pc - 1 - k); const a = stage(k), b = stage(Math.min(2, k + 1)); const k2 = pc >= 3 ? 2 : k;
    x = pc >= 3 ? S[2][0] : lerp(S[k][0], S[k + 1][0], e); y = S[0][1]; r = pc >= 3 ? a.r : lerp(a.r, b.r, e); nr = pc >= 3 ? a.nucR : lerp(a.nucR, b.nucR, e); tt = pc >= 3 ? 0.8 : lerp([0.3, 0.55, 0.8][k], [0.55, 0.8, 0.8][k], e); dense = k2 >= 1 && e > 0.5 ? 1 : pc >= 3 ? 1 : 0; }
  const tintV = Math.max(tt, c01(tint));
  const ne = ease(c01(nucOut));
  // released: into the vessel, then mature
  const re = ease(c01(rel));
  const cx = lerp(x, SL.M[0], re), cy = lerp(y, SL.M[1], re) - Math.sin(Math.PI * re) * 40;
  const m = ease(c01(mature));
  if (m < 1) els.push(<DiffCell key="b" x={cx} y={cy} r={r} tint={tintV} nucR={nr} nuc={nucOut > 0 ? 0 : 1} dense={dense} op={1 - m} />);
  if (m > 0) els.push(<RBC key="m" x={cx} y={cy} r={lerp(r, 30, m)} op={m} />);
  // the nucleus: moves to the edge, is pushed out, drifts away and fades
  if (nucOut > 0) {
    const nx = x + lerp(0, r + 14, ne) + ne * 30, ny = y + lerp(0, -r * 0.6, ne) - ne * 20;
    els.push(<circle key="n" data-role="drawing" cx={f1(nx)} cy={f1(ny)} r={f1(r * 0.36)} fill="#6E6E6E" stroke={T5.envelope} strokeWidth={1.5} opacity={f1(1 - 0.75 * c01((nucOut - 0.6) / 0.4))} />);
  }
  return <g opacity={op < 1 ? f1(op) : undefined}>{els}</g>;
}
