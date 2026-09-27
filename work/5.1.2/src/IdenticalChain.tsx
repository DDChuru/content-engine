/** IdenticalChain — 5.1.2's own diagram (published here): parent set card (four replicated Xs, *parent cell after S*)
 * → the animal MitosisCellModel running anaphase → cytokinesis with its count strip → two daughter set cards, one under
 * each daughter cell; above, the three-link chain strip copy · share · result. Every value is passed in by the beat,
 * which changes counts ON the event frame. Layout in page coordinates for the full-size layout (Beat 4); beats scale it. */
import React from 'react';
import {BRAND as C} from '../shared/src/theme';
import {Txt, textW} from '../shared/src/Type';
import {T5} from './t5-palette';
import {MitosisCellModel, MParams, mLayout} from './MitosisCellModel';
import {CountStrip} from './ChromosomeModel';
import {SetCard, setGene} from './ContextStrip';

const c01 = (v: number) => Math.max(0, Math.min(1, v));
export const IC = {cx: 720, cy: 590, size: 0.8, parent: [100, 470], cardS: 0.82, cardY: 792, strip: [1080, 330, 700] as number[]};
export const LINKS = [
  {tag: 'copy', text: 'copy: DNA replicated in the S (synthesis) phase of interphase → two identical sister chromatids'},
  {tag: 'share one of each', text: 'share: sister chromatids separate to opposite poles in anaphase'},
  {tag: '', text: 'result: each daughter nucleus receives one copy of every chromosome → same number, same genetic information'},
];
const LX = [90, 690, 1290], LW = 560, LY = 206, LH = 84;
const wrapL = (t: string, size: number, maxW: number) => { const out: string[] = []; let line = ''; for (const w of t.split(' ')) { const n = line ? line + ' ' + w : w; if (textW(n, size, 700) > maxW && line) { out.push(line); line = w; } else line = n; } if (line) out.push(line); return out; };

/** Card positions: [x, y] top-left of the two daughter cards (under each daughter cell). */
export function daughterCardPos() {
  const R = 310 * IC.size, w = 188 * IC.cardS;
  return [[IC.cx - 0.74 * R - w / 2, IC.cardY], [IC.cx + 0.74 * R - w / 2, IC.cardY]];
}

/** The chain strip: three link boxes; reveal[i] 0..1 = characters written; hi[i] = accent glow; stamp[i] = handle tag. */
export function ChainStrip({reveal = [1, 1, 1], hi = [0, 0, 0], stamp = [0, 0], op = 1, frames = 1}: any) {
  if (op <= 0) return null;
  return (
    <g opacity={op < 1 ? op : undefined}>
      {LINKS.map((L, i) => {
        const ls = wrapL(L.text, 20, LW - 36);
        let left = Math.floor(c01(reveal[i]) * L.text.length);
        return (
          <g key={i} opacity={frames < 1 ? frames : undefined}>
            <rect data-role="decor" x={LX[i]} y={LY} width={LW} height={LH} rx={12} fill={hi[i] > 0 ? '#FFF1EA' : '#FFFFFF'} stroke={hi[i] > 0 ? T5.ring : T5.ring} strokeWidth={2 + 3 * c01(hi[i])} />
            {ls.map((l, k) => { const t = l.slice(0, Math.max(0, left)); left -= l.length + 1; return <Txt key={k} x={LX[i] + 18} y={LY + 34 + k * 26} size={20} weight={700} fill={T5.ringHalo}>{t}</Txt>; })}
            {i < 2 && <path data-role="decor" d={`M${LX[i] + LW + 3} ${LY + LH / 2}L${LX[i + 1] - 5} ${LY + LH / 2}M${LX[i + 1] - 13} ${LY + LH / 2 - 7}L${LX[i + 1] - 4} ${LY + LH / 2}L${LX[i + 1] - 13} ${LY + LH / 2 + 7}`} stroke={T5.ringHalo} strokeWidth={2.5} fill="none" />}
            {i < 2 && stamp[i] > 0 && <g opacity={c01(stamp[i])}>
              <rect data-role="decor" x={LX[i] + LW - textW(L.tag, 18, 800) - 40} y={LY - 17} width={textW(L.tag, 18, 800) + 26} height={30} rx={15} fill={T5.ringHalo} stroke={hi[i] > 0 ? T5.ring : T5.ringHalo} strokeWidth={2 + 3 * c01(hi[i])} />
              <Txt x={LX[i] + LW - 27} y={LY + 4} size={18} weight={800} fill="#FFFFFF" anchor="end">{L.tag}</Txt>
            </g>}
          </g>
        );
      })}
    </g>
  );
}

export type ChainProps = {
  m: Partial<MParams>; rows?: any[]; stripOp?: number; parentOp?: number; parentHi?: number; parentGlow?: number;
  cardsOp?: number; cardsHi?: number; cardsGlow?: number; lines?: number; cellHi?: number; dim?: number; cellOp?: number;
};
/** Parent card + cell + count strip + daughter cards (the chain strip and sentence are drawn by the beat). */
export function ChainBody(p: ChainProps) {
  const [px, py] = IC.parent, dc = daughterCardPos(), s = IC.cardS;
  const lines = c01(p.lines ?? 0);
  return (
    <g opacity={p.dim ? 1 - 0.55 * p.dim : undefined}>
      <SetCard x={px} y={py} s={1} kind="X" tag="parent cell after S" op={p.parentOp ?? 1} hi={p.parentHi ?? 0} glow={p.parentGlow ?? 0} />
      <MitosisCellModel x={IC.cx} y={IC.cy} size={IC.size} {...(p.m as any)} opacity={p.cellOp ?? 1} />
      <Txt x={IC.cx} y={IC.cy + 310 * IC.size + 26} size={14} weight={600} fill={C.muted} anchor="middle" italic opacity={(p.cardsOp ?? 0) > 0 ? 0 : 1}>schematic; 2n = 4 teaching model</Txt>
      {p.rows && (p.stripOp ?? 1) > 0 && <CountStrip x={IC.strip[0]} y={IC.strip[1]} w={IC.strip[2]} size={24} rows={p.rows} opacity={p.stripOp ?? 1} />}
      {dc.map((q, i) => <SetCard key={i} x={q[0]} y={q[1]} s={s} kind="rod" tag="drawn condensed for comparison" op={p.cardsOp ?? 0} hi={p.cardsHi ?? 0} glow={p.cardsGlow ?? 0} />)}
      {lines > 0 && (p.cardsOp ?? 0) > 0 && [0, 1, 2, 3].map((k) => dc.map((q, i) => {
        const a = setGene(px, py, 1, k), b = setGene(q[0], q[1], s, k);
        return <path key={`${k}${i}`} data-role="decor" d={`M${a[0].toFixed(1)} ${(a[1] + 60).toFixed(1)}C${a[0].toFixed(1)} ${(a[1] + 200).toFixed(1)} ${b[0].toFixed(1)} ${(b[1] - 90).toFixed(1)} ${b[0].toFixed(1)} ${(b[1] - 40).toFixed(1)}`} fill="none" stroke={T5.ring} strokeWidth={2} opacity={0.75 * lines * (p.cardsOp ?? 0)} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - lines} />;
      }))}
    </g>
  );
}
export const cellGeom = (m: Partial<MParams>) => mLayout({x: IC.cx, y: IC.cy, size: IC.size, ...(m as any)});
