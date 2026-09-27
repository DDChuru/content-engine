/** SignallingScene (published by 4.1.4; recalled by 4.2.1b). One wide panel, caption *schematic; not to scale*.
 * Left: pancreatic BETA CELL (our example) with a nucleus and 8 vesicles each holding insulin wedges (magenta), in a
 * pale straw band of TISSUE FLUID. Centre: a CAPILLARY segment running top → bottom (thin wall, dark red lumen, a few
 * red blood cells, flow arrows). Right column in the same tissue fluid: MUSCLE CELL (target; 4 receptors with a
 * notch site complementary to the wedge; a separate small teal GLUCOSE TRANSPORT PROTEIN where glucose crosses),
 * LIVER CELL (target; same receptor), and a CELL WITHOUT A COMPLEMENTARY RECEPTOR FOR INSULIN (4 receptors with a
 * rounded-square site). Stage labels along the top: secretion · transport · binding · specific response.
 * States are driven by ages (seconds since each began; negative = not yet):
 *   secrete  → one vesicle performs exocytosis (VesicleTransport ExoCell) at the side facing the vessel; wedges drift
 *              into the tissue fluid; enter → they drift into the lumen (route through the wall not detailed);
 *   carry    → they travel down the lumen with the flow and spread; out → they drift out into the tissue fluid beside
 *              each right-hand cell; bind → seat at a muscle and a liver receptor (0.8 s, ReceptorLigand `seat`);
 *   fail     → at the non-target cell a wedge touches the rounded-square site, rocks, fails and drifts on (1.5 s);
 *   respond  → muscle: glucose crosses ONLY through the labelled transport protein, more often; liver: one soft glow.
 * No token passes through a cell outline except glucose via the transport protein; no intracellular pathway is drawn. */
import React from 'react';
import {T4} from './t4-palette';
import {LigandA, failMotion} from './ReceptorLigand';
import {ExoCell, EXO} from './VesicleTransport';
import {GlucoseTok} from './T4Tokens';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => { t = clamp01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const f = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const FONT = "'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif";

export const SS = {
  beta: {x: 380, y: 420, rx: 225, ry: 165}, nucleus: {x: 330, y: 450, r: 56},
  vessel: {x0: 775, x1: 945, y0: 250, y1: 930},
  muscle: {x: 1420, y: 395, w: 600, h: 130}, liver: {x: 1300, y: 626, r: 100}, other: {x: 1330, y: 842, r: 76},
  ru: 17,                                             // receptor scale (membrane units) at whole-cell view
};
/** Receptor sites (outline point + outward normal) per cell: muscle and liver notch (complementary), other round. */
export function receptorSites() {
  const m = SS.muscle, L = SS.liver, o = SS.other;
  const ml = m.x - m.w / 2, mt = m.y - m.h / 2;
  const muscle = [[ml, m.y - 28, -1, 0], [ml, m.y + 28, -1, 0], [ml + 110, mt, 0, -1], [ml + 110, m.y + m.h / 2, 0, 1]];
  const hex = (k: number) => { const a = Math.PI / 6 + (k * Math.PI) / 3; return [L.x + L.r * Math.cos(a), L.y + L.r * Math.sin(a)]; };
  const mid = (i: number) => { const p = hex(i), q = hex(i + 1); const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, d = Math.hypot(mx - L.x, my - L.y); return [mx, my, (mx - L.x) / d, (my - L.y) / d]; };
  const liver = [mid(2), mid(3), mid(1), mid(4)];
  const other = [Math.PI * 1.0, Math.PI * 1.28, Math.PI * 0.72, Math.PI * 0.44].map((a) => [o.x + o.r * Math.cos(a), o.y + o.r * Math.sin(a), Math.cos(a), Math.sin(a)]);
  return {muscle, liver, other};
}
const rotDeg = (nx: number, ny: number) => (Math.atan2(ny, nx) * 180) / Math.PI + 90;   // local "up" → outward normal

/** Whole-cell-scale receptor: a stubby teal protein through the outline, its binding site on the outer end — a V
 * notch (the same proportions as the membrane-scale cup, so the insulin wedge fits) or, for the non-target cell, a
 * rounded-square site (not complementary). Local "up" = outward normal. */
export const CR = {out: 1.4, inn: 1.0, W: 0.95, cupW: 0.92, cupD: 0.58};
function CellReceptor({x, y, nx, ny, round = false, glow = 0}: any) {
  const u = SS.ru, rot = rotDeg(nx, ny), top = -CR.out * u, bot = CR.inn * u, W = CR.W * u, cw = CR.cupW * u / 2, cd = CR.cupD * u;
  const site = round
    ? `L${f(-0.42 * u)} ${f(top)}L${f(-0.42 * u)} ${f(top + 0.5 * u)}Q${f(-0.42 * u)} ${f(top + 0.66 * u)} ${f(-0.26 * u)} ${f(top + 0.66 * u)}L${f(0.26 * u)} ${f(top + 0.66 * u)}Q${f(0.42 * u)} ${f(top + 0.66 * u)} ${f(0.42 * u)} ${f(top + 0.5 * u)}L${f(0.42 * u)} ${f(top)}`
    : `L${f(-cw)} ${f(top)}L0 ${f(top + cd)}L${f(cw)} ${f(top)}`;
  const d = `M${f(-W + 5)} ${f(top)}${site}L${f(W - 5)} ${f(top)}Q${f(W)} ${f(top)} ${f(W)} ${f(top + 5)}L${f(W)} ${f(bot - 5)}Q${f(W)} ${f(bot)} ${f(W - 5)} ${f(bot)}L${f(-W + 5)} ${f(bot)}Q${f(-W)} ${f(bot)} ${f(-W)} ${f(bot - 5)}L${f(-W)} ${f(top + 5)}Q${f(-W)} ${f(top)} ${f(-W + 5)} ${f(top)}Z`;
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      {glow > 0 && <circle cx={0} cy={top * 0.5} r={1.6 * u} fill="#FFF3C4" opacity={glow} />}
      <path d={d} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={1.8} strokeLinejoin="round" />
    </g>
  );
}
/** Position of a seated wedge at receptor site s (its top-centre at the rim, pointing into the site). */
export function seatAt(s: number[], off = 0) {
  const u = SS.ru, H = CR.out * u; const [x, y, nx, ny] = s;
  return {x: x + nx * (H + off), y: y + ny * (H + off), rot: rotDeg(nx, ny)};   // the wedge points into the site (−normal)
}

export function SignallingScene(props: any) {
  const {t = 0, secrete = -1, enter = -1, carry = -1, out = -1, bind = -1, fail = -1, respond = -1, stage = {}, labels = {},
    liverGlow = 0, dim = 0, hideWedges = false, opacity = 1, vesselPulse = 0, receptorGlow = {}, glucoseRate = 0.2} = props;
  if (opacity <= 0) return null;
  const B = SS.beta, V = SS.vessel, M = SS.muscle, L = SS.liver, O = SS.other, R = receptorSites();
  const vx = (V.x0 + V.x1) / 2;
  // ---- wedges: 3 from the one exocytosis event, then the vessel, then one to each right-hand cell ----
  const edge = {x: B.x + B.rx - 2, y: B.y - 20};
  const rel = [0, 1, 2].map((i) => ({x: edge.x + 42 + 24 * i, y: edge.y - 28 + 30 * i}));
  const exoDone = secrete >= EXO.approach + EXO.fuse + EXO.release;
  const dest = [seatAt(R.muscle[0], 26), seatAt(R.liver[0], 26), seatAt(R.other[0], 30)];
  const wed: any[] = [];
  if (!hideWedges && exoDone) for (let i = 0; i < 3; i++) {
    let x = rel[i].x + 4 * Math.sin(t * 1.3 + i), y = rel[i].y + 3 * Math.cos(t * 1.1 + i), rot = 8 * Math.sin(t + i);
    if (enter >= 0) { const k = ease(enter / 1.4); x = lerp(x, vx - 30 + 30 * i, k); y = lerp(y, edge.y + 20 * i, k); }
    const exitY = [R.muscle[0][1], R.liver[0][1], R.other[0][1]][i];
    if (carry >= 0) { const k = clamp01(carry / (2.2 + 0.5 * i)); y = lerp(edge.y + 20 * i, exitY, ease(k)); x = vx - 30 + 30 * i + 6 * Math.sin(t * 3 + i); rot = 0; }
    if (out >= 0) { const k = ease((out - 0.2 * i) / 1.3); x = lerp(vx - 30 + 30 * i, dest[i].x, k); y = lerp(exitY, dest[i].y, k); rot = lerp(0, dest[i].rot, k); }
    if (i < 2 && bind >= 0) { const k = ease(bind / 0.8); const s = seatAt(i === 0 ? R.muscle[0] : R.liver[0]); x = lerp(dest[i].x, s.x, k); y = lerp(dest[i].y, s.y, k); rot = s.rot; }
    if (i === 2 && fail >= 0) {
      const fm = failMotion(fail, -26 / SS.ru, [0, 0]);
      const [sx, sy, nx, ny] = R.other[0], base = seatAt(R.other[0], 4);
      const dd = -fm.dy * SS.ru;
      x = base.x + nx * dd; y = base.y + ny * dd; rot = base.rot + fm.rot;
      if (fail > 1.0) { const k = ease((fail - 1.0) / 1.5); x += (nx * 50 + 0) * k; y += (ny * 50 - 60) * k; }
      void sx; void sy;
    }
    wed.push(<LigandA key={'w' + i} x={x} y={y} u={SS.ru} rot={rot} />);
  }
  // ---- red blood cells and flow arrows in the lumen (motion) ----
  const rbc = [0, 1, 2, 3].map((i) => { const yy = V.y0 + ((t * 70 + i * 170) % (V.y1 - V.y0)); return <ellipse key={i} cx={vx + (i % 2 ? 34 : -30)} cy={yy} rx={20} ry={12} fill="#D9534B" stroke="#8E2A24" strokeWidth={1.5} />; });
  const arrows = [0, 1, 2, 3, 4].map((i) => { const yy = V.y0 + 30 + ((t * 70 + i * 136) % (V.y1 - V.y0 - 60)); return <path key={i} d={`M${vx - 12} ${f(yy - 10)}L${vx} ${f(yy)}L${vx + 12} ${f(yy - 10)}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.6 + 0.4 * vesselPulse} />; });
  // ---- glucose uptake at the muscle cell's transport protein ----
  const gtp = {x: M.x + M.w / 2 - 70, y: M.y - M.h / 2};
  const glu: any[] = [];
  for (let k = 0; k < 4; k++) glu.push(<GlucoseTok key={'g' + k} x={gtp.x - 70 + k * 46 + 5 * Math.sin(t + k)} y={gtp.y - 34 + 4 * Math.cos(t * 1.2 + k)} r={9} />);
  const period = respond >= 0 ? 1.6 : 1 / Math.max(0.05, glucoseRate);
  const ph = ((t % period) + period) % period / period;
  const crossing = ph < 0.6 ? {x: gtp.x, y: lerp(gtp.y - 26, gtp.y + 40, ease(ph / 0.6))} : null;
  const lbl = (x: number, y: number, s: string, o = 1, size = 20, fill = '#253247', anchor = 'middle', w = 700) => o > 0 ? <text x={x} y={y} fontSize={size} fontWeight={w} fill={fill} textAnchor={anchor} fontFamily={FONT} opacity={o < 1 ? o : undefined}>{s}</text> : null;
  const st = (k: string) => stage[k] ?? 0;
  const vesicles = [[470, 370], [430, 500], [260, 360], [230, 460], [485, 440], [330, 318], [385, 522], [292, 522]];
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <g data-role="decor">
        <rect x={92} y={252} width={660} height={676} rx={24} fill="#F6EBC8" opacity={0.75} />
        <rect x={968} y={252} width={872} height={676} rx={24} fill="#F6EBC8" opacity={0.75} />
      </g>
      <g data-role="drawing" opacity={dim ? 1 - dim : undefined}>
        {/* capillary */}
        <rect x={V.x0} y={V.y0} width={V.x1 - V.x0} height={V.y1 - V.y0} rx={10} fill="#A63A33" stroke="#6E1F1A" strokeWidth={3} />
        {rbc}{arrows}
        {/* beta cell */}
        <ellipse cx={B.x} cy={B.y} rx={B.rx} ry={B.ry} fill="#FBF6FA" stroke="#6B5B7B" strokeWidth={3} />
        <circle cx={SS.nucleus.x} cy={SS.nucleus.y} r={SS.nucleus.r} fill="#E6DCEB" stroke="#6B5B7B" strokeWidth={2} />
        {vesicles.map(([x, y], i) => i === 0 ? null : <g key={'v' + i}><circle cx={x} cy={y} r={27} fill="#FFF6F0" stroke="#7A5C8E" strokeWidth={2} />{[-1, 0, 1].map((k) => <LigandA key={k} x={x + k * 13} y={y - 6 + (k === 0 ? 6 : 0)} u={10} />)}</g>)}
        {secrete < 0 && <g><circle cx={vesicles[0][0]} cy={vesicles[0][1]} r={27} fill="#FFF6F0" stroke="#7A5C8E" strokeWidth={2} />{[-1, 0, 1].map((k) => <LigandA key={k} x={vesicles[0][0] + k * 13} y={vesicles[0][1] - 6 + (k === 0 ? 6 : 0)} u={10} />)}</g>}
        {secrete >= 0 && !exoDone && <ExoCell vx={vesicles[0][0]} vy={vesicles[0][1]} ex={edge.x} ey={edge.y} nx={1} ny={0} r={27} age={secrete} t={t} u={12} />}
        {/* target and non-target cells */}
        <rect x={M.x - M.w / 2} y={M.y - M.h / 2} width={M.w} height={M.h} rx={M.h / 2} fill="#FCEEEE" stroke="#8E4A4A" strokeWidth={3} />
        {[1, 2, 3].map((k) => <path key={k} d={`M${M.x - M.w / 2 + 60 + k * 120} ${M.y - M.h / 2 + 18}V${M.y + M.h / 2 - 18}`} stroke="#E3C3C3" strokeWidth={2} />)}
        <polygon points={Array.from({length: 6}, (_, k) => { const a = Math.PI / 6 + (k * Math.PI) / 3; return `${f(L.x + L.r * Math.cos(a))},${f(L.y + L.r * Math.sin(a))}`; }).join(' ')} fill={liverGlow > 0 ? '#FFF1C9' : '#F4F0E4'} stroke="#7A6A3E" strokeWidth={3} />
        {liverGlow > 0 && <circle cx={L.x} cy={L.y} r={L.r + 16} fill="none" stroke="#F2C45A" strokeWidth={10} opacity={0.6 * liverGlow} />}
        <circle cx={O.x} cy={O.y} r={O.r} fill="#EEF1F4" stroke="#5E6B78" strokeWidth={3} />
        {R.muscle.map((s, i) => <CellReceptor key={'m' + i} x={s[0]} y={s[1]} nx={s[2]} ny={s[3]} glow={receptorGlow.muscle ?? 0} />)}
        {R.liver.map((s, i) => <CellReceptor key={'l' + i} x={s[0]} y={s[1]} nx={s[2]} ny={s[3]} glow={receptorGlow.liver ?? 0} />)}
        {R.other.map((s, i) => <CellReceptor key={'o' + i} x={s[0]} y={s[1]} nx={s[2]} ny={s[3]} round glow={receptorGlow.other ?? 0} />)}
        {/* glucose transport protein (separate from the receptors) and glucose */}
        <rect x={gtp.x - 9} y={gtp.y - 22} width={18} height={44} rx={6} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} />
        {glu}
        {crossing && <GlucoseTok x={crossing.x} y={crossing.y} r={8} />}
        {wed}
      </g>
      {lbl(B.x, 232, 'secretion', 0.35 + 0.65 * st('secretion'), 26, st('secretion') > 0.5 ? '#B64A30' : '#6F6A60', 'middle', 800)}
      {lbl(vx, 232, 'transport', 0.35 + 0.65 * st('transport'), 26, st('transport') > 0.5 ? '#B64A30' : '#6F6A60', 'middle', 800)}
      {lbl(1160, 232, 'binding', 0.35 + 0.65 * st('binding'), 26, st('binding') > 0.5 ? '#B64A30' : '#6F6A60', 'middle', 800)}
      {lbl(1560, 232, 'specific response: increased glucose uptake', 0.35 + 0.65 * st('response'), 20, st('response') > 0.5 ? '#B64A30' : '#6F6A60', 'middle', 800)}
      {lbl(B.x, B.y + B.ry + 34, 'beta cell (pancreas)', labels.beta ?? 0)}
      {lbl(vx, V.y1 - 12, 'capillary', labels.capillary ?? 0, 18, '#FFFFFF')}
      {lbl(M.x, M.y + M.h / 2 + 34, 'muscle cell (target)', labels.muscle ?? 0)}
      {lbl(L.x + L.r + 16, L.y + 6, 'liver cell (target)', labels.liver ?? 0, 20, '#253247', 'start')}
      {lbl(O.x + O.r + 16, O.y - 4, 'cell without a complementary receptor', labels.other ?? 0, 18, '#253247', 'start')}
      {lbl(O.x + O.r + 16, O.y + 18, 'for insulin (schematic)', labels.other ?? 0, 18, '#253247', 'start')}
      {lbl(gtp.x + 18, gtp.y - 50, 'glucose transport protein', labels.gtp ?? 0, 16, T4.proteinEdge, 'end')}
      {lbl(1830, 924, 'schematic; not to scale', 1, 16, '#6F6A60', 'end', 600)}
    </g>
  );
}
