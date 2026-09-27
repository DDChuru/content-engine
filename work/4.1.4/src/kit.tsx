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

/* ---------------- 4.1.4 additions ---------------- */
import {SignallingScene, SS} from './SignallingScene';
/** Scene with an optional zoom about (zx, zy). */
export function Scene({z = 1, zx = 380, zy = 470, ...p}: any) {
  if (z === 1) return <SignallingScene {...p} />;
  return <g><defs><clipPath id="sceneclip"><rect x={0} y={168} width={1920} height={782} /></clipPath></defs>
    <g clipPath="url(#sceneclip)"><g transform={`translate(${zx} ${zy}) scale(${z}) translate(${-zx} ${-zy})`}><SignallingScene {...p} /></g></g></g>;
}
/** Exocytosis age synced to the narration: approach from `move`, fusion from `fuse`, release from `release`. */
export function exoAge(a: (k: string) => number, move = 'move', fuse = 'fuse', release = 'release') {
  if (a(move) < 0) return -1;
  if (a(fuse) < 0) return Math.min(a(move), 1.19);
  if (a(release) < 0) return 1.2 + Math.min(a(fuse), 0.59);
  return 1.8 + a(release);
}
export {SS};
import T from '../timeline.json';
import {receptorSites} from './SignallingScene';
const SCN: any[] = (T as any).scenes;
/** Global time (s) of a cue (scene start + frame-quantised local time). */
export const CUE = (beat: number, key: string) => { const sc = SCN.find((x) => x.id === beat), c = sc.cues.find((q: any) => q.key === key); if (!c) throw Error(`no cue ${beat}/${key}`); return sc.start + Math.ceil(c.localTime * 30 - 1e-9) / 30; };
/** The scene's wedge motion ages at global t, as built in Beats 3–4 (secretion done; entered; carried; out). */
export const sceneAges = (t: number) => ({secrete: 99, enter: t - CUE(4, 'enter'), carry: t - CUE(4, 'carry'), out: t - CUE(4, 'out')});
export {receptorSites};
