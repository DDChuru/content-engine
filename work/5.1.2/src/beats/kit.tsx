/** Beat-local helpers (from run 009a's kit): captions, sentence strips (clause by clause), objective lines, forms rows,
 * plus the reject card and the question card used by this lesson. */
import React from 'react';
import {BRAND as C, BODY, clamp01} from '../../shared/src/theme';
import {Txt, Tag, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {fi, fe, lerp} from '../util';

export const INK = T5.ringHalo;
export const wrap = (text: string, size: number, maxW: number, weight = 700) => {
  const out: string[] = []; let line = '';
  for (const w of text.split(' ')) { const t = line ? line + ' ' + w : w; if (textW(t, size, weight) > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
};
/** Text revealed character by character: n chars shown = age * cps (clause-by-clause writing). */
export const typed = (text: string, a: number, cps = 26) => a <= 0 ? '' : text.slice(0, Math.floor(a * cps));

/** Compact caption line(s) (never alone on a frame). */
export function Caption({x, y, text, size = 30, maxW = 1500, opacity = 1, anchor = 'start', weight = 700, fill = INK}: any) {
  if (opacity <= 0) return null;
  const ls = wrap(text, size, maxW, weight);
  return <g opacity={opacity < 1 ? opacity : undefined}>{ls.map((l, i) => <Txt key={i} x={x} y={y + i * size * 1.25} size={size} weight={weight} fill={fill} anchor={anchor}>{l}</Txt>)}</g>;
}
/** Sentence strip: a card with the sentence written clause by clause (reveal = chars shown), key words ringed by caller. */
export function SentenceStrip({x, y, w, text, shown, size = 28, opacity = 1, label = 'written properly'}: any) {
  if (opacity <= 0) return null;
  const ls = wrap(text, size, w - 60, 700);
  const h = 44 + ls.length * size * 1.3 + 8;
  let left = shown;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={h} rx={14} fill="#FFFFFF" stroke={C.teal} strokeWidth={2.5} />
      <Txt x={x + w - 16} y={y - 8} size={16} weight={700} fill={C.teal} anchor="end">{label}</Txt>
      {ls.map((l, i) => { const t = l.slice(0, Math.max(0, left)); left -= l.length + 1; return <Txt key={i} x={x + 30} y={y + 40 + i * size * 1.3} size={size} weight={700}>{t}</Txt>; })}
    </g>
  );
}
export const stripH = (text: string, w: number, size = 28) => 44 + wrap(text, size, w - 60, 700).length * size * 1.3 + 8;
/** x-span of a substring on a wrapped strip line (for rings/underlines). Returns [x0, x1, yBaseline] or null. */
export function stripSpan(x: number, y: number, w: number, text: string, sub: string, size = 28) {
  const ls = wrap(text, size, w - 60, 700);
  for (let i = 0; i < ls.length; i++) { const k = ls[i].indexOf(sub); if (k >= 0) return [x + 30 + textW(ls[i].slice(0, k), size, 700), x + 30 + textW(ls[i].slice(0, k + sub.length), size, 700), y + 40 + i * size * 1.3]; }
  return null;
}

/** Objective line (dark objectives surface): verb in accent caps + text, beside its pictogram. */
export function ObjLine({x, y, verb, text, a, pic}: any) {
  const o = fi(a, 0.5);
  if (o <= 0) return null;
  const dx = lerp(40, 0, fe(a, 0.6));
  return (
    <g opacity={o < 1 ? o : undefined} transform={`translate(${dx} 0)`}>
      <g data-role="drawing">{pic}</g>
      <Txt x={x + 190} y={y} size={34} weight={800} fill={C.accent}>{verb}</Txt>
      <Txt x={x + 190} y={y + 44} size={28} weight={600} fill={C.warm}>{text}</Txt>
    </g>
  );
}

/** Forms row on the exam-close surface (title wraps). */
export function FormRow({x, y, w, title, cite, a, extra}: any) {
  const o = fi(a, 0.45);
  if (o <= 0) return null;
  const cl = wrap(cite, 16, w - 40, 600), tl = wrap(title, 23, w - 40, 800);
  const th = tl.length * 29;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={33 + th + cl.length * 21 + (extra ? 8 : 0)} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      {tl.map((l, i) => <Txt key={'t' + i} x={x + 20} y={y + 34 + i * 29} size={23} weight={800}>{l}</Txt>)}
      {cl.map((l, i) => <Txt key={i} x={x + 20} y={y + 33 + th + i * 21} size={16} weight={600} fill={C.muted} italic>{l}</Txt>)}
    </g>
  );
}
export const formRowH = (cite: string, w: number, title = 'x') => 33 + wrap(title, 23, w - 40, 800).length * 29 + wrap(cite, 16, w - 40, 600).length * 21;

/** Reject card: ✗ line struck by hand, ✓ line, provenance caption in small type. */
export function RejectCard({x, y, w, wrong, right, a, strikeAt = 1.0, rightAt = 1.6, cap = 'our wording contrast; not an examiner-reported error', size = 22, children}: any) {
  const o = fi(a, 0.4);
  if (o <= 0) return null;
  const strike = fe(a - strikeAt, 0.8);
  const rl = wrap(right, size, w - 80, 700), wl = wrap(wrong, size, w - 80, 600);
  const h = 40 + wl.length * size * 1.3 + 16 + rl.length * size * 1.3 + 44;
  const ry = y + 40 + wl.length * size * 1.3 + 16;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={h} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
      <Txt x={x + 22} y={y + 40} size={size + 2} weight={800} fill={C.primary}>✗</Txt>
      {wl.map((l, i) => <Txt key={i} x={x + 54} y={y + 40 + i * size * 1.3} size={size} weight={600} fill="#2B3A8C" italic>{l}</Txt>)}
      {strike > 0 && wl.map((l, i) => <path key={'s' + i} data-role="decor" d={`M${x + 50} ${y + 40 + i * size * 1.3 - size * 0.35}H${x + 50 + (textW(l, size, 600) + 8) * strike}`} stroke={C.primary} strokeWidth={4} strokeLinecap="round" />)}
      <g opacity={fi(a - rightAt, 0.4)}>
        <Txt x={x + 22} y={ry + size} size={size + 2} weight={800} fill={C.greenDark}>✓</Txt>
        {rl.map((l, i) => <Txt key={i} x={x + 54} y={ry + size + i * size * 1.3} size={size} weight={700} fill={C.greenDark}>{l}</Txt>)}
      </g>
      <Txt x={x + 22} y={y + h - 14} size={14} weight={600} fill={C.muted} italic>{cap}</Txt>
      {children}
    </g>
  );
}
export const rejectH = (wrong: string, right: string, w: number, size = 22) => 40 + wrap(wrong, size, w - 80, 600).length * size * 1.3 + 16 + wrap(right, size, w - 80, 700).length * size * 1.3 + 44;
/** Position of a substring on the ✓ line of a RejectCard: [x0, x1, yBaseline] or null. */
export function rejectSpan(x: number, y: number, w: number, wrong: string, right: string, sub: string, size = 22) {
  const rl = wrap(right, size, w - 80, 700), ry = y + 40 + wrap(wrong, size, w - 80, 600).length * size * 1.3 + 16;
  for (let i = 0; i < rl.length; i++) { const k = rl[i].indexOf(sub); if (k >= 0) return [x + 54 + textW(rl[i].slice(0, k), size, 700), x + 54 + textW(rl[i].slice(0, k + sub.length), size, 700), ry + size + i * size * 1.3]; }
  return null;
}
