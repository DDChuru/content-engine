/** 5.1.2 ContextStrip layout: four panels (growth · replacement · repair · asexual reproduction), each drawn in a
 * 600 × 420 design box and scaled into its frame; layouts 'equal' (Beat 1, recap) and 'focus' (one panel enlarged). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, textW, TextScale, MIN_TEXT} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {SetCard, SkinStrip, GutStrip, RootTip, Human, Strawberry, PanelFrame, SET_NOTE} from '../ContextStrip';
import {Label, Leader} from '../T5Annot';
/** Run 009g: labels/tags drawn INSIDE a scaled panel keep >= MIN_TEXT on screen (they read the panel scale from TextScale). */
export function PLabel(p: any) { const k = React.useContext(TextScale); return <Label {...p} size={Math.max(p.size ?? 22, MIN_TEXT / k)} />; }
export function PTag(p: any) { const k = React.useContext(TextScale); return <Tag {...p} size={Math.max(p.size ?? 20, MIN_TEXT / k)} />; }

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const TITLES = ['growth', 'replacement', 'repair', 'asexual reproduction'];
export const DW = 600, DH = 420;
export type Rect = {x: number; y: number; w: number; h: number};
/** Panel frames for a layout. equal: four equal panels in [y0, y1]; focus k: panel k enlarged. */
export function rects(mode: 'equal' | 'focus', k = 0, y0 = 520, y1 = 940): Rect[] {
  const X0 = 70, X1 = 1850, g = 20, h = y1 - y0;
  if (mode === 'equal') { const w = (X1 - X0 - 3 * g) / 4; return [0, 1, 2, 3].map((i) => ({x: X0 + i * (w + g), y: y0, w, h})); }
  const big = 890, sm = (X1 - X0 - 3 * g - big) / 3; let x = X0;
  return [0, 1, 2, 3].map((i) => { const w = i === k ? big : sm; const r = {x, y: y0, w, h}; x += w + g; return r; });
}
export const mixR = (a: Rect[], b: Rect[], u: number) => a.map((r, i) => ({x: lerp(r.x, b[i].x, u), y: lerp(r.y, b[i].y, u), w: lerp(r.w, b[i].w, u), h: lerp(r.h, b[i].h, u)}));
/** Content transform for a frame: uniform scale into the frame (below a 40 px title band), centred. */
export function fit(r: Rect) {
  const sc = Math.min(r.w / DW, (r.h - 40) / DH), cw = DW * sc, ch = DH * sc;
  return {sc, ox: r.x + (r.w - cw) / 2, oy: r.y + 40 + (r.h - 40 - ch) / 2};
}
export const toPage = (r: Rect, px: number, py: number) => { const f = fit(r); return [f.ox + px * f.sc, f.oy + py * f.sc]; };

/** Panel design contents (design coordinates 0..600 × 0..420). */
export function Growth({elong = 0, div = 0, grow = 1, cards = 0, light = 0, labels = 0, bracket = 0, humanOp = 1, words = true}: any) {
  const rt = RootTip({x: 140, y: 12, s: 0.85, elong, div});
  const z = rt.zones;
  return (
    <g>
      {rt.el}
      {labels > 0 && <g opacity={c01(labels)}>
        <PLabel x={140 + z.W / 2 + 14} y={(z.cap[0] + z.cap[1]) / 2 + 8} text="root cap" size={20} />
        <PLabel x={140 + z.W / 2 + 14} y={(z.div[0] + z.div[1]) / 2 + 8} text="region of cell division" size={20} />
      </g>}
      {bracket > 0 && <g opacity={c01(bracket)}>
        <path data-role="decor" d={`M${140 - z.W / 2 - 10} ${z.elong[0]}H${140 - z.W / 2 - 20}V${z.elong[1] - 3}H${140 - z.W / 2 - 10}`} fill="none" stroke={T5.ringHalo} strokeWidth={2.5} />
        <path data-role="decor" d={`M${140 - z.W / 2 - 10} ${z.div[0] + 3}H${140 - z.W / 2 - 20}V${z.div[1]}H${140 - z.W / 2 - 10}`} fill="none" stroke={T5.ring} strokeWidth={3} />
        <PLabel x={140 - z.W / 2 - 26} y={(z.elong[0] + z.elong[1]) / 2 + 6} text="elongation" size={17} anchor="end" />
        <PLabel x={140 - z.W / 2 - 26} y={(z.div[0] + z.div[1]) / 2 + 6} text="division" size={17} anchor="end" />
      </g>}
      <Human x={500} y={405} h={300} grow={grow} op={humanOp} />
      {cards > 0 && <g>
        <SetCard x={220} y={20} s={0.55} kind="rod" op={c01(cards)} glow={light} />
        <Leader x1={236} y1={78} x2={160} y2={z.div[0] + 10} opacity={c01(cards)} />
        <SetCard x={400} y={20} s={0.55} kind="rod" op={c01(cards)} glow={light} />
        {words && light > 0 && <Txt x={272} y={100} size={17} weight={800} fill={T5.ringHalo} anchor="middle" opacity={c01(light)}>same set</Txt>}
        {words && light > 0 && <Txt x={452} y={100} size={17} weight={800} fill={T5.ringHalo} anchor="middle" opacity={c01(light)}>same set</Txt>}
      </g>}
    </g>
  );
}
export function Replacement({t = 0, shed = 1, cards = 0, light = 0, labels = 0, divU = 0}: any) {
  return (
    <g>
      <SkinStrip x={30} y={20} w={540} h={180} t={t} shed={shed} divAt={3} divU={divU} />
      <GutStrip x={60} y={250} w={480} h={150} t={t} shed={shed} />
      {labels > 0 && <g opacity={c01(labels)}>
        <PLabel x={36} y={16} text="outer layer of skin" size={19} />
        <PLabel x={36} y={246} text="small-intestine lining" size={19} />
      </g>}
    </g>
  );
}
export function Repair({t = 0, fill = 1, diff = 1, shed = 1, divU = 0, gap = [3, 5]}: any) {
  return <SkinStrip x={30} y={120} w={540} h={210} t={t} shed={shed} gap={gap} fill={fill} diff={diff} cols={9} divAt={fill < 1 ? 2 : -1} divU={divU} />;
}
export function Asexual({runner = 1, roots = 1, leaf = 1, pulse = -1, cards = 0, light = 0, line = 0}: any) {
  return (
    <g>
      <Strawberry x={170} y={300} L={300} runner={runner} roots={roots} leaf={leaf} pulse={pulse} />
      {cards > 0 && <g>
        <SetCard x={60} y={10} s={0.55} kind="rod" op={c01(cards)} glow={light} />
        <SetCard x={400} y={10} s={0.55} kind="rod" op={c01(cards)} glow={light} />
        {line > 0 && [0, 1, 2, 3].map((k) => { const x0 = 60 + 103 * (0.16 + 0.225 * k), x1 = 400 + 103 * (0.16 + 0.225 * k); return <path key={k} data-role="decor" d={`M${x0} 72C${x0} 110 ${x1} 110 ${x1} 72`} fill="none" stroke={T5.ring} strokeWidth={2} opacity={c01(line) * 0.8} />; })}
      </g>}
    </g>
  );
}

/** Draw one panel into a frame. */
export function Panel({k, r, st = {}, title = 1, lit = 0, dim = 0, op = 1, note = 0, children}: any) {
  if (op <= 0) return null;
  const f = fit(r);
  // run 009g: a panel drawn below 0.7 scale is a thumbnail — drawing only (its labels, brackets, card words and child tags
  // are not drawn; at the >= 17 px floor they would not fit). Larger panels floor their text through TextScale.
  const small = f.sc < 0.7, st2 = small ? {...st, labels: 0, bracket: 0, light: 0, cards: st.cards} : st;
  const body = k === 0 ? <Growth {...st2} words={!small} /> : k === 1 ? <Replacement {...st2} /> : k === 2 ? <Repair {...st2} /> : <Asexual {...st2} />;
  return (
    <PanelFrame x={r.x} y={r.y} w={r.w} h={r.h} title={title > 0 ? TITLES[k] : ''} lit={lit} dim={dim} op={op}>
      <g transform={`translate(${f.ox.toFixed(1)} ${f.oy.toFixed(1)}) scale(${f.sc.toFixed(4)})`}><TextScale.Provider value={f.sc}>{body}{small ? null : children}</TextScale.Provider></g>
      {note > 0 && <Txt x={r.x + 14} y={r.y + r.h - 10} size={12} weight={600} fill={C.muted} italic opacity={c01(note)}>{SET_NOTE}</Txt>}
    </PanelFrame>
  );
}
/** The omitted-interval caption for the dividing-cell glyphs (Round-1 division-excerpt contract). */
export const EXCERPT = 'dividing-cell glyphs: later in the cell cycle; DNA replication in S phase and earlier mitotic stages omitted';

/** The converted sentence (Beat 4), shared by the recap and the exam close. */
export const SENT = 'replication makes identical sister chromatids, and separating them gives each daughter nucleus one copy of every chromosome.';
import {ChainBody, ChainStrip} from '../IdenticalChain';
import {MSTAGES, MCOUNT} from '../MitosisCellModel';
/** IdenticalChain as built by Beat 4 (cytokinesis complete, daughter cards), as a THUMBNAIL: page region (70,190)–(1850,930)
 * mapped to (x, y) at scale sc. Run 009g (≥ 17 px rule, no exemption for drawings): the scaled group is DRAWING ONLY
 * (ChainBody bare: no card tags, no count strip, no caption; the link boxes are replaced); every word is drawn at PAGE
 * scale outside the transform — the three links as a row of pills above, the parent-card tag, and the daughter-cell
 * count beside the cells. hi: {l1, l2, l3, parent, cards, strip} highlight strengths. */
export const THUMB_LINKS = ['copy (S phase)', 'share one of each (anaphase)', 'same set in each daughter'];
export function ChainThumb({x, y, sc, op = 1, hi = {}, dim = 0}: any) {
  if (op <= 0) return null;
  const tx = x - 70 * sc, ty = y - 190 * sc;
  const P = (px: number, py: number) => [tx + px * sc, ty + py * sc];
  const W = 1780 * sc, hl = [hi.l1 ?? 0, hi.l2 ?? 0, hi.l3 ?? 0];
  const pw = THUMB_LINKS.map((t) => textW(t, 20, 700) + 28), gap = (W - pw.reduce((a, b) => a + b, 0)) / 2;
  let cx = x;
  const pills = THUMB_LINKS.map((t, i) => { const r = {x: cx, w: pw[i], t, h: hl[i]}; cx += pw[i] + gap; return r; });
  const [cr] = P(720 + 0.74 * 248 + 0.7 * 248, 590), [, cyy] = P(0, 590), [ppx, ppy] = P(100, 470);
  return (
    <g opacity={op < 1 ? op : undefined}>
      <g opacity={dim > 0 ? 1 - 0.55 * dim : undefined}>
        <g transform={`translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${sc.toFixed(4)})`}>
          <ChainBody bare m={{...MSTAGES['cytokinesis'], sep: 1}} parentHi={hi.parent ?? 0} parentGlow={hi.parent ?? 0}
            cardsOp={1} cardsHi={hi.cards ?? 0} cardsGlow={hi.cards ?? 0} lines={0} />
        </g>
        {pills.map((q, i) => <g key={i}>
          <rect data-role="decor" x={q.x} y={y} width={q.w} height={34} rx={17} fill={q.h > 0 ? '#FFF1EA' : '#FFFFFF'} stroke={T5.ring} strokeWidth={2 + 3 * Math.min(1, q.h)} />
          <Txt x={q.x + 14} y={y + 24} size={20} weight={700} fill={T5.ringHalo}>{q.t}</Txt>
          {i < 2 && <path data-role="decor" d={`M${q.x + q.w + 6} ${y + 17}L${pills[i + 1].x - 6} ${y + 17}`} stroke={T5.ringHalo} strokeWidth={2.5} />}
        </g>)}
        <Txt x={ppx} y={ppy - 12} size={20} weight={700} fill={T5.ringHalo}>parent after S</Txt>
        {(hi.strip ?? 0) > 0 && <rect data-role="decor" x={cr + 8} y={cyy - 34} width={x + W - cr - 8} height={66} rx={10} fill={T5.ring} opacity={0.35 * hi.strip} />}
        <Txt x={cr + 20} y={cyy - 6} size={20} weight={800} fill={T5.ringHalo}>each daughter cell:</Txt>
        <Txt x={cr + 20} y={cyy + 20} size={20} weight={700} fill={T5.ringHalo}>4 chromosomes · 4 DNA molecules</Txt>
      </g>
    </g>
  );
}
