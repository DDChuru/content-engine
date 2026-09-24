/** Panels: the pinned CONDITIONS → OBSERVATION → INFERENCE strip, the per-test row card,
 * the results table, checklists, correct-only cards and citation tabs. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Lines, Card, Tag, Cite, Arrow} from '../../shared/src/Type';
import {NamePill, SwatchKey} from '../../shared/src/Swatch';

/** Pinned for the rest of the lesson from Beat 4. hi: 'C' | 'O' | 'I' | ''. */
export function PinnedCOI({hi = '', x = 1142, y = 124, opacity = 1}: any) {
  const items: [string, string][] = [['C', 'CONDITIONS'], ['O', 'OBSERVATION'], ['I', 'INFERENCE']];
  const w = 212;
  return (
    <g opacity={opacity} data-pinned="coi">
      {items.map(([k, t], i) => {
        const on = hi === k;
        return (
          <g key={k}>
            <rect x={x + i * (w + 32)} y={y} width={w} height={50} rx={12} fill={on ? C.primary : C.white} stroke={on ? C.primary : C.line} strokeWidth={2} />
            <Txt x={x + i * (w + 32) + w / 2} y={y + 33} anchor="middle" size={21} weight={800} fill={on ? C.white : C.ink}>{t}</Txt>
            {i < 2 && <Txt x={x + i * (w + 32) + w + 16} y={y + 34} anchor="middle" size={24} weight={800} fill={C.muted}>→</Txt>}
          </g>
        );
      })}
    </g>
  );
}

/** One test's conditions → observation → inference card. o/i are 0..1 reveals. */
export function COIRow({x, y, w = 820, cond, obs, obsK, inf, c = 1, o = 1, i = 1, title, hiObs = false, hiInf = false}: any) {
  const cw = (w - 40) / 3;
  const col = (n: number) => x + 20 + n * cw;
  return (
    <Card x={x} y={y} w={w} h={title ? 196 : 164}>
      {title && <Txt x={x + 22} y={y + 36} size={21} weight={800} fill={C.muted}>{title}</Txt>}
      {(['CONDITIONS', 'OBSERVATION', 'INFERENCE'] as const).map((t, n) => (
        <Txt key={t} x={col(n) + 6} y={y + (title ? 72 : 40)} size={18} weight={800} fill={(n === 1 && hiObs) || (n === 2 && hiInf) ? C.primary : C.muted}>{t}</Txt>
      ))}
      <g transform={title ? `translate(0 32)` : undefined}>
        <g opacity={clamp01(c)}><Lines x={col(0) + 6} y={y + 80} text={cond} size={21} step={27} /></g>
        <g opacity={clamp01(o)}>
          {obsK && <NamePill x={col(1) + 6} y={y + 82} k={obsK} text={obs} anchor="start" size={19} />}
          {!obsK && <Lines x={col(1) + 6} y={y + 80} text={obs} size={21} step={27} />}
        </g>
        <g opacity={clamp01(i)}><Lines x={col(2) + 6} y={y + 80} text={inf} size={21} step={27} fill={C.ink} /></g>
        <Arrow x1={col(1) - 34} y1={y + 74} x2={col(1) - 8} y2={y + 74} color={C.muted} width={2.5} head={9} opacity={clamp01(o)} />
        <Arrow x1={col(2) - 34} y1={y + 74} x2={col(2) - 8} y2={y + 74} color={C.muted} width={2.5} head={9} opacity={clamp01(i)} />
      </g>
    </Card>
  );
}

/** Stacked variant for narrow panels: one line each for conditions, observation, inference. */
export function COIStack({x, y, w = 660, cond, obs, obsK, inf, c = 1, o = 1, i = 1, hiObs = false, hiInf = false, title}: any) {
  const top = title ? y + 34 : y;
  const h = (title ? 34 : 0) + 190;
  const row = (n: number) => top + 52 + n * 56;
  const lab = (t: string, n: number, hi: boolean) => <Txt x={x + 24} y={row(n)} size={18} weight={800} fill={hi ? C.primary : C.muted}>{t}</Txt>;
  return (
    <Card x={x} y={y} w={w} h={h}>
      {title && <Txt x={x + 24} y={y + 34} size={19} weight={800} fill={C.muted}>{title}</Txt>}
      {lab('CONDITIONS', 0, false)}{lab('OBSERVATION', 1, hiObs)}{lab('INFERENCE', 2, hiInf)}
      <g opacity={clamp01(c)}><Txt x={x + 200} y={row(0)} size={23} weight={700}>{cond}</Txt></g>
      <g opacity={clamp01(o)}>{obsK ? <NamePill x={x + 200} y={row(1) + 2} k={obsK} text={obs} anchor="start" size={20} /> : <Txt x={x + 200} y={row(1)} size={23} weight={700}>{obs}</Txt>}</g>
      <g opacity={clamp01(i)}><Txt x={x + 200} y={row(2)} size={23} weight={800}>{inf}</Txt></g>
      {hiObs && <rect x={x + 10} y={row(1) - 34} width={w - 20} height={50} rx={10} fill="none" stroke={C.primary} strokeWidth={3} />}
      {hiInf && <rect x={x + 10} y={row(2) - 34} width={w - 20} height={50} rx={10} fill="none" stroke={C.primary} strokeWidth={3} />}
    </Card>
  );
}

export type Row = {sample: string; test: string; obs: string; obsK?: SwatchKey; inf: string; op?: number; hi?: boolean; hiObs?: boolean; hiInf?: boolean; nt?: boolean; ring?: boolean};
/** Results table with headings sample | test | observation | supported inference. */
export function ResultsTable({x, y, rows, widths = [120, 210, 300, 360], rowH = 44, head = 1, size = 21, headHi = '', title}: any) {
  const W = widths.reduce((a: number, b: number) => a + b, 0);
  const xs = widths.map((_: number, i: number) => x + widths.slice(0, i).reduce((a: number, b: number) => a + b, 0));
  const heads = ['sample', 'test', 'observation', 'supported inference'];
  const top = title ? y + 34 : y;
  return (
    <g data-table="results">
      {title && <Txt x={x} y={y + 20} size={20} weight={800} fill={C.muted}>{title}</Txt>}
      <rect x={x} y={top} width={W} height={rowH + 4 + rows.length * rowH} rx={10} fill={C.white} stroke={C.line} strokeWidth={2} />
      <g opacity={head}>
        <rect x={x} y={top} width={W} height={rowH + 4} rx={10} fill="#EAE4D6" />
        {heads.map((h, i) => (
          <Txt key={h} x={xs[i] + 12} y={top + rowH - 12} size={size} weight={800} fill={headHi && (headHi === 'all' || headHi.includes(h)) ? C.primary : C.ink}>{h}</Txt>
        ))}
      </g>
      {rows.map((r: Row, j: number) => {
        const ry = top + rowH + 4 + j * rowH;
        return (
          <g key={j} opacity={r.op ?? 1}>
            {r.hi && <rect x={x + 2} y={ry} width={W - 4} height={rowH} fill={C.accent} opacity={0.35} />}
            <path d={`M${x} ${ry}H${x + W}`} stroke={C.line} strokeWidth={1.5} />
            <Txt x={xs[0] + 12} y={ry + rowH - 13} size={size} weight={800}>{r.sample}</Txt>
            <Txt x={xs[1] + 12} y={ry + rowH - 13} size={size}>{r.test}</Txt>
            {r.hiObs && <rect x={xs[2] + 4} y={ry + 4} width={widths[2] - 8} height={rowH - 8} rx={6} fill="none" stroke={C.primary} strokeWidth={3} />}
            {r.obsK ? <NamePill x={xs[2] + 10} y={ry + rowH - 14} k={r.obsK} text={r.obs} anchor="start" size={size - 3} model={false} />
              : <Txt x={xs[2] + 12} y={ry + rowH - 13} size={size} fill={r.nt ? C.muted : C.ink} weight={r.nt ? 700 : 600}>{r.obs}</Txt>}
            {r.hiInf && <rect x={xs[3] + 4} y={ry + 4} width={widths[3] - 8} height={rowH - 8} rx={6} fill="#FFE3D6" />}
            <Txt x={xs[3] + 12} y={ry + rowH - 13} size={size} fill={r.nt ? C.muted : C.ink}>{r.inf}</Txt>
            {r.ring && <ellipse cx={xs[2] + widths[2] / 2} cy={ry + rowH / 2} rx={widths[2] / 2 - 4} ry={rowH / 2 + 3} fill="none" stroke={C.primary} strokeWidth={3.5} />}
          </g>
        );
      })}
      {widths.slice(1).map((_: number, i: number) => <path key={i} d={`M${xs[i + 1]} ${top}V${top + rowH + 4 + rows.length * rowH}`} stroke={C.line} strokeWidth={1.5} />)}
    </g>
  );
}

/** Checklist card: items tick in as p passes 0..items.length. */
export function Checklist({x, y, w = 420, title, items, p = 99, opacity = 1, active = false, tick = false}: any) {
  const h = 62 + items.length * 40;
  return (
    <Card x={x} y={y} w={w} h={h} opacity={opacity} active={active}>
      <Txt x={x + 20} y={y + 38} size={21} weight={800} fill={C.primary}>{title}</Txt>
      {items.map((it: string, i: number) => (
        <g key={i} opacity={clamp01(p - i)}>
          <rect x={x + 22} y={y + 58 + i * 40} width={22} height={22} rx={4} fill="none" stroke={C.ink} strokeWidth={2} />
          {tick && <path d={`M${x + 26} ${y + 70 + i * 40}l6 6l10-12`} stroke={C.primary} strokeWidth={3} fill="none" />}
          <Txt x={x + 58} y={y + 76 + i * 40} size={21}>{it}</Txt>
        </g>
      ))}
    </Card>
  );
}

/** Correct-only card (no wrong/right pair): the scientific distinction taught directly. */
export function CorrectCard({x, y, w, h = 120, text, cite, opacity = 1, size = 27}: any) {
  return (
    <Card x={x} y={y} w={w} h={h} opacity={opacity} stroke="#1D8A4E" fill="#F2FAF5">
      <rect x={x} y={y} width={10} height={h} rx={5} fill="#1D8A4E" />
      <Lines x={x + 32} y={y + 46} text={text} size={size} step={size * 1.3} weight={700} />
      {cite && <Cite x={x + 32} y={y + h - 18} text={cite} size={17} />}
    </Card>
  );
}

/** Citation tab: quoted exam words, source in small type. */
export function QuoteTab({x, y, w, quote, source, opacity = 1, size = 21}: any) {
  const n = String(quote).split('\n').length;
  const h = 34 + n * size * 1.3 + 30;
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#FBF8F1" stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 4" />
      <Lines x={x + 18} y={y + 32} text={quote} size={size} step={size * 1.3} weight={600} fill={C.ink} />
      <Txt x={x + 18} y={y + h - 14} size={16} weight={700} fill={C.muted}>{source}</Txt>
    </g>
  );
}
