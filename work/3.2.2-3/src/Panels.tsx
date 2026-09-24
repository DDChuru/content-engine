/** Panels: citation tabs, the exam-question header card, written (wrong) answer cards, graph frames. */
import React from 'react';
import {BRAND as C, clamp01} from './shared/theme';
import {Txt, Lines, Card, Cite, textW} from './shared/Type';

/** Citation tab: quoted exam words, source in small type. under = [lineIndex, x0, x1, p] underlines. */
export function QuoteTab({x, y, w, quote, source, opacity = 1, size = 21, under = [], hi = false}: any) {
  if (opacity <= 0) return null;
  const n = String(quote).split('\n').length;
  const h = 30 + n * size * 1.3 + 30;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={C.paper} stroke={hi ? C.teal : C.muted} strokeWidth={hi ? 3 : 1.5} strokeDasharray={hi ? undefined : '6 4'} />
      <Lines x={x + 18} y={y + 32} text={quote} size={size} step={size * 1.3} weight={600} fill={C.ink} />
      {under.map(([li, phrase, p, col]: any, i: number) => {
        if (p <= 0) return null;
        const line = String(quote).split('\n')[li], j = line.indexOf(phrase);
        if (j < 0) throw Error('underline phrase not on line: ' + phrase);
        const x0 = textW(line.slice(0, j), size, 600), x1 = x0 + textW(phrase, size, 600);
        return <path key={i} d={`M${x + 18 + x0} ${y + 38 + li * size * 1.3}H${x + 18 + x0 + (x1 - x0) * clamp01(p)}`} stroke={col ?? C.primary} strokeWidth={3.5} strokeLinecap="round" />;
      })}
      <Txt x={x + 18} y={y + h - 12} size={16} weight={700} fill={C.muted}>{source}</Txt>
    </g>
  );
}
export const quoteH = (quote: string, size = 21) => 30 + String(quote).split('\n').length * size * 1.3 + 30;

/** The exam question header on error / exam beats: verbatim words in quotation marks + citation. */
export function QuestionCard({x, y, w, text, cite, opacity = 1, size = 23, children}: any) {
  if (opacity <= 0) return null;
  const n = String(text).split('\n').length, h = 64 + n * size * 1.32 + 30;
  return (
    <Card x={x} y={y} w={w} h={h} opacity={opacity} fill={C.white}>
      <rect x={x} y={y} width={10} height={h} rx={5} fill={C.ink} />
      <Txt x={x + 30} y={y + 34} size={17} weight={800} fill={C.muted}>THE QUESTION · quoted verbatim</Txt>
      <Lines x={x + 30} y={y + 70} text={text} size={size} step={size * 1.32} weight={600} />
      <Cite x={x + 30} y={y + h - 16} text={cite} size={16} />
      {children}
    </Card>
  );
}

/** A written (wrong) answer, in the ink-blue of a student's pen on lined paper. Always framed: composite label. */
export const PEN = '#2A4A9C';
export function AnswerCard({x, y, w, h, title = 'A WRITTEN ANSWER', note, opacity = 1, active = true, children}: any) {
  if (opacity <= 0) return null;
  const lines = [];
  for (let yy = y + 96; yy < y + h - 20; yy += 46) lines.push(<path key={yy} d={`M${x + 20} ${yy}H${x + w - 20}`} stroke="#C9D6EA" strokeWidth={1.5} />);
  return (
    <Card x={x} y={y} w={w} h={h} opacity={opacity} active={active} fill="#FFFEFA">
      <Txt x={x + 22} y={y + 34} size={18} weight={800} fill={C.primary}>{title}</Txt>
      {note && <Txt x={x + 22} y={y + 58} size={16} weight={700} fill={C.muted}>{note}</Txt>}
      {lines}
      {children}
    </Card>
  );
}
/** Graph frame card (white panel behind a graph). */
export function GraphCard({x, y, w, h, opacity = 1, title, children, active = false}: any) {
  if (opacity <= 0) return null;
  return (
    <Card x={x} y={y} w={w} h={h} opacity={opacity} active={active}>
      {title && <Txt x={x + 22} y={y + 36} size={22} weight={800} fill={C.ink}>{title}</Txt>}
      {children}
    </Card>
  );
}
