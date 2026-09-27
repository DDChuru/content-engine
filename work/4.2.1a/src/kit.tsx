/** 4.2.1a lesson kit (base: the 4.1.1-2 kit): labels with leaders, brackets, the schematic red blood cell, magnifier, sentence surface,
 * and the standard membrane stage (water above and below + FluidMosaicMembrane). Lesson-specific; the shared
 * Topic 4 models are the top-level copies from work/t4-shared. */
import React from 'react';
import {BRAND as C, BODY, clamp01} from '../shared/src/theme';
import {Txt, Lines, Card, Cite, textW, MIN_TEXT} from '../shared/src/Type';
import {FluidMosaicMembrane, FACE} from './FluidMosaicMembrane';
import {WaterField} from './WaterField';
import {T4} from './t4-palette';

export const gt = (s: any) => s.frame / 30;             // global animation clock: motion continues across beats
export const CY = 540, U = 58;                          // membrane stage used by Beats 4–12

/** Text label with an optional straight leader to (lx, ly). Leader is decor. */
export function Lbl({x, y, text, o = 1, size: size0 = 22, weight = 700, fill = C.ink, anchor = 'start', lx, ly, lead = C.muted, italic = false, halo = C.warm}: any) {
  if (o <= 0) return null;
  const size = Math.max(MIN_TEXT, size0);
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
export function Pill({x, y, text, o = 1, size: size0 = 20, fill = C.ink, bg = C.white, stroke = C.line, anchor = 'start'}: any) {
  if (o <= 0) return null;
  const size = Math.max(MIN_TEXT, size0);
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
export function Sentence({x, y, w, lines, o = 1, tag, size = 27, h, fill = '#FFFFFF'}: any) {
  if (o <= 0) return null;
  const H = h ?? 34 + lines.length * size * 1.35 + 12;
  return (
    <Card x={x} y={y} w={w} h={H} opacity={o} stroke={C.teal} fill={fill}>
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

/* ---------------- 4.2.1a additions ---------------- */
import T from '../timeline.json';
import {plPos, fmmLayout, compPos, FULL} from './FluidMosaicMembrane';
import {WaterTok, ATPTag} from './T4Tokens';
import {Ev, Geo, windowEvents, countIn} from './DiffusionField';
import {carrierCycle, carrierReverse, PROT} from './TransportProteinSet';
export {fmmLayout, compPos, plPos, FULL, WaterTok, ATPTag};
const SC: any[] = (T as any).scenes;
/** Global time (s) of a cue: scene start + the cue's frame-quantised local time. */
export const CUE = (beat: number, key: string) => { const sc = SC.find((x) => x.id === beat), c = sc.cues.find((q: any) => q.key === key); if (!c) throw Error(`no cue ${beat}/${key}`); return sc.start + Math.ceil(c.localTime * 30 - 1e-9) / 30; };
export const BSTART = (beat: number) => SC.find((x) => x.id === beat).start;
export const BEND = (beat: number) => { const sc = SC.find((x) => x.id === beat); return sc.start + sc.duration; };

/** Lanes between phospholipid heads (outer, inner) — the simple-diffusion gates. */
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

/** ---- The `open` field (Beats 3, 4): O₂ (dissolved), 30 left / 10 right, a dashed middle line. ---- */
export const OPEN: Geo = {x0: 110, y0: 304, x1: 1310, y1: 800, orient: 'h', m: 710, pad: 18};
export const OPEN_ORIGIN = () => CUE(3, 'more');
/** Dataset 1 windows (global start, forward, reverse). W1 at Beat 3's counter cue; W2 from Beat 4's first frame
 * (9 · 7 → 20/20); balanced 8 · 8 windows from then on until the window in progress at Beat 4's `exch` cue ends. */
export function openWindows() {
  const w: [number, number, number][] = [[CUE(3, 'counter'), 12, 4]];
  const b4 = BSTART(4), ex = CUE(4, 'exch');
  w.push([b4, 9, 7]);
  for (let k = 1; b4 + 5 * k < ex; k++) w.push([b4 + 5 * k, 8, 8]);
  return w;
}
export const openEvents = (): Ev[] => openWindows().flatMap(([t0, f, r], i) => windowEvents(t0, f, r, 5, 11 + i));

/** ---- The membrane stage (Beats 5–10, 13, 14). ---- */
export const MS = {cx: 600, cy: 560, u: 38};
export const MX = {x0: 96, x1: 1010, y0: 214, y1: 930};
export const memM = (t: number, extra: any = {}) => ({...MS, t, show: FULL, ...extra});
export const memGeo = (M: any): Geo => {
  const Lf = fmmLayout(M);
  return {...MX, orient: 'v', m: M.cy, hb: Lf.bottom - M.cy + 6, pad: 16, gates: lanes(M).map((l) => l[0])};
};
/** The membrane scene: water above and below + the membrane (Stage), region labels at the left margin. */
export function MemScene({s, t, mem = {}, water = 1, labels = 1, core = 1, oBox = 1}: any) {
  const M = memM(t, mem), Lf = fmmLayout(M);
  return (
    <g>
      <rect data-role="decor" x={MX.x0} y={MX.y0} width={MX.x1 - MX.x0} height={MX.y1 - MX.y0} rx={16} fill="#EEF6FB" stroke="#9FB6C6" strokeWidth={2.5} opacity={oBox} />
      <Stage s={s} cx={M.cx} cy={M.cy} u={M.u} xw={[MX.x0 + 10, MX.x1 - 10]} waterTop={MX.y0 + 12} waterBottom={MX.y1 - 12} n={[22, 18]} water={water} mem={{show: FULL, ...mem}} />
      <Lbl x={MX.x0 + 12} y={MX.y0 + 30} text="outside the cell (watery)" o={labels} size={20} fill={C.teal} />
      <Lbl x={MX.x0 + 12} y={MX.y1 - 14} text="cytoplasm (watery)" o={labels} size={20} fill={C.teal} />
      <Lbl x={MX.x0 + 6} y={M.cy - 4} text="hydrophobic" o={core} size={18} fill={C.muted} />
      <Lbl x={MX.x0 + 6} y={M.cy + 18} text="core" o={core} size={18} fill={C.muted} />
    </g>
  );
}
/** Carrier motion for a list of cycles [{c0, rev}] (global): the carrier phase at time t (0 = binding site facing
 * outside), and the event list with `via` paths (count at the release into the other compartment). */
export function carrierPlan(cycles: {c0: number; rev?: boolean}[], M: any) {
  const phaseAt = (t: number) => {
    for (const c of cycles) { const age = t - c.c0; if (age >= 0 && age < 2.7) return c.rev ? carrierReverse(age).phase : carrierCycle(age).phase; }
    return 0;
  };
  const evs: Ev[] = cycles.map((c) => {
    const ca = (tt: number) => compPos({...M, t: tt}, 'carrier').x;
    if (!c.rev) return {t: c.c0 + 1.9, dir: 1 as 1, pre: 2.6, post: 0, via: (tt: number) => [ca(tt), M.cy + carrierCycle(tt - c.c0).ty * M.u]};
    return {t: c.c0 + 2.7, dir: -1 as -1, pre: 2.6, post: 0, via: (tt: number) => [ca(tt), M.cy + carrierReverse(tt - c.c0).ty * M.u]};
  });
  return {phaseAt, evs};
}
export {PROT};

/** Window bookkeeping: the window running at t (live counts) and the last completed one (its scripted result). */
export function winState(wins: [number, number, number][], evs: Ev[], t: number, dur = 5) {
  let cur: any = null, last: any = null;
  wins.forEach(([w0, f, r], i) => { if (t >= w0 && t < w0 + dur) cur = {i, w0, c: countIn(evs, w0, w0 + dur, t)}; if (t >= w0 + dur) last = {i, w0, f, r}; });
  return {cur, last};
}
/** Net arrow length for a net count (px per token). */
export const NETPX = 26;

/** The four route slots (Beats 4–14): empty dashed boxes that fill with the route's name. */
export const ROUTES = ['through the bilayer', 'channel protein', 'carrier protein', 'water: osmosis'];
export const ROUTE_FILL = ['simple diffusion: through the bilayer', 'channel protein: hydrophilic pore', 'carrier protein: binds, changes shape', 'water: osmosis'];
export function RouteSlots({x = 1350, y = 330, w = 500, h = 92, gap = 18, o = 1, fill = [0, 0, 0, 0], hi = [0, 0, 0, 0], sc = 1}: any) {
  if (o <= 0) return null;
  return (
    <g opacity={o < 1 ? o : undefined} transform={sc !== 1 ? `translate(${x} ${y}) scale(${sc}) translate(${-x} ${-y})` : undefined}>
      <Txt x={x} y={y - 16} size={20} weight={800} fill={C.muted}>which route?</Txt>
      {ROUTES.map((r, i) => {
        const yy = y + i * (h + gap), f = fill[i] ?? 0;
        return (
          <g key={r}>
            <rect data-role="decor" x={x} y={yy} width={w} height={h} rx={12} fill={f > 0 ? '#FFFFFF' : 'none'} stroke={hi[i] > 0 ? '#E0892B' : f > 0 ? C.teal : C.muted} strokeWidth={hi[i] > 0 ? 4 : 2} strokeDasharray={f > 0 ? undefined : '8 6'} />
            <Txt x={x + 18} y={yy + 38} size={20} weight={700} fill={C.muted} opacity={1 - f}>{r}</Txt>
            {f > 0 && <Txt x={x + 18} y={yy + 40} size={21} weight={800} fill={C.teal} opacity={f}>{ROUTE_FILL[i].split(': ')[0] + ':'}</Txt>}
            {f > 0 && <Txt x={x + 18} y={yy + 70} size={20} weight={700} fill={C.ink} opacity={f}>{ROUTE_FILL[i].split(': ')[1]}</Txt>}
          </g>
        );
      })}
    </g>
  );
}
