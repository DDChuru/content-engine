/** Panels: the question header, the written-answer card (handwriting style), quote tabs, side notes,
 * the objectives list and the forms surface. Wrong answers are WRITTEN, never voiced. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/src/theme';
import {Txt, Lines, Card, Cite, textW} from '../shared/src/Type';

export const PEN = '#2B3A8C';
export const GOOD = '#1D6B40';

/** The question as asked (our labelled framing or verbatim), with its source in small type. */
export function QHeader({x, y, w, label = 'THE QUESTION', text, src, size = 27, opacity = 1, hi}: any) {
  if (opacity <= 0) return null;
  const n = String(text).split('\n').length, srcN = src ? String(src).split('\n').length : 0;
  const h = 50 + n * size * 1.25 + srcN * 21 + 14;
  return (
    <Card x={x} y={y} w={w} h={h} opacity={opacity} fill="#FBF8F1">
      <Txt x={x + 22} y={y + 32} size={18} weight={800} fill={C.primary}>{label}</Txt>
      {hi}
      <Lines x={x + 22} y={y + 44 + size} text={text} size={size} step={size * 1.25} weight={700} />
      {src && <Lines x={x + 22} y={y + 44 + n * size * 1.25 + 18} text={src} size={16} step={21} weight={600} fill={C.muted} italic />}
    </Card>
  );
}
export const qHeaderH = (text: string, src: string | undefined, size = 27) => 50 + String(text).split('\n').length * size * 1.25 + (src ? String(src).split('\n').length * 21 : 0) + 14;

/** Handwritten answer text with a leading ✗/✓. */
export function Written({x, y, text, size = 44, ok = false, opacity = 1, color}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <Txt x={x} y={y} size={size} weight={800} fill={ok ? GOOD : C.primary}>{ok ? '✓' : '✗'}</Txt>
      <Txt x={x + size * 1.05} y={y} size={size} weight={600} fill={color ?? (ok ? GOOD : PEN)} italic>{text}</Txt>
    </g>
  );
}
/** Word-span helper for underlines/rings on a Written line: returns [x0, x1] of chars [i0, i1). */
export function span(x: number, text: string, i0: number, i1: number, size: number) {
  const base = x + size * 1.05;
  return [base + textW(text.slice(0, i0), size, 600), base + textW(text.slice(0, i1), size, 600)];
}

/** Citation tab: quoted exam words, source in small type. */
export function QuoteTab({x, y, w, quote, source, opacity = 1, size = 20, accent = false, children}: any) {
  if (opacity <= 0) return null;
  const n = String(quote).split('\n').length;
  const h = 26 + n * size * 1.3 + 34;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#FBF8F1" stroke={accent ? C.teal : C.muted} strokeWidth={accent ? 3 : 1.5} strokeDasharray={accent ? undefined : '6 4'} />
      <Lines x={x + 18} y={y + 30} text={quote} size={size} step={size * 1.3} weight={600} fill={C.ink} />
      <Txt x={x + 18} y={y + h - 14} size={16} weight={700} fill={C.muted}>{source}</Txt>
      {children}
    </g>
  );
}
export const quoteH = (quote: string, size = 20) => 26 + String(quote).split('\n').length * size * 1.3 + 34;
/** Position of a character range on line `li` of a QuoteTab (for underlines). */
export function quoteSpan(x: number, y: number, quote: string, li: number, i0: number, i1: number, size = 20) {
  const line = String(quote).split('\n')[li];
  const x0 = x + 18 + textW(line.slice(0, i0), size, 600), x1 = x + 18 + textW(line.slice(0, i1), size, 600);
  return {x0, x1, y: y + 30 + li * size * 1.3 + 6};
}
/** A small italic side-note, optionally with a pointer arrow. */
export function SideNote({x, y, text, opacity = 1, color = C.primary, size = 22, anchor = 'start'}: any) {
  if (opacity <= 0) return null;
  return <Lines x={x} y={y} text={text} size={size} step={size * 1.25} weight={700} fill={color} italic anchor={anchor} opacity={opacity} />;
}
/** A strike line drawn left→right. */
export function Strike({x1, x2, y, p = 1, color = C.primary, width = 5}: any) {
  if (p <= 0) return null;
  return <path d={`M${x1} ${y}H${x1 + (x2 - x1) * clamp01(p)}`} stroke={color} strokeWidth={width} strokeLinecap="round" />;
}
/** The "correct-only" card (green): the creditworthy wording. */
export function CorrectCard({x, y, w, h = 110, text, cite, opacity = 1, size = 27}: any) {
  if (opacity <= 0) return null;
  return (
    <Card x={x} y={y} w={w} h={h} opacity={opacity} stroke="#1D8A4E" fill="#F2FAF5">
      <rect x={x} y={y} width={10} height={h} rx={5} fill="#1D8A4E" />
      <Lines x={x + 32} y={y + 44} text={text} size={size} step={size * 1.3} weight={700} />
      {cite && <Cite x={x + 32} y={y + h - 16} text={cite} size={16} />}
    </Card>
  );
}
