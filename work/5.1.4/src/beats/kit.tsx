/** 5.1.1 beat-local helpers: captions, sentence strips (clause by clause), objective lines and pictograms,
 * the human-scale hook nucleus, the staple handle, the light-microscope field schematic, forms rows, reject card. */
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

/** Human-scale hook nucleus (typical diploid human cell): double-line envelope + nucleolus disc (schematic). */
export function HookNucleus({x, y, r = 150, opacity = 1, nucleolus = 1}: any) {
  if (opacity <= 0) return null;
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined}>
      <circle cx={x} cy={y} r={r} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={3} />
      <circle cx={x} cy={y} r={r - 8} fill="none" stroke={T5.envelope} strokeWidth={2} />
      {nucleolus > 0 && <circle cx={x + r * 0.42} cy={y - r * 0.4} r={r * 0.16} fill={T5.nucleolus} opacity={nucleolus < 1 ? nucleolus : undefined} />}
    </g>
  );
}
export function ScaleBar({x, y, len, label = '5 µm', opacity = 1, pulse = 0}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {pulse > 0 && <rect data-role="decor" x={x - 10} y={y - 16} width={len + 20} height={32} rx={10} fill={T5.ring} opacity={0.5 * pulse} />}
      <g data-role="drawing"><path d={`M${x} ${y - 9}V${y + 9}M${x} ${y}H${x + len}M${x + len} ${y - 9}V${y + 9}`} stroke={INK} strokeWidth={4} fill="none" /></g>
      <Txt x={x + len / 2} y={y + 38} size={24} weight={800} anchor="middle">{label}</Txt>
    </g>
  );
}

/** Light-microscope field schematic: a circular field; blur → resolves to a dark X as it condenses. */
export function FieldSchematic({x, y, r = 120, resolve = 0, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const k = clamp01(resolve);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <g data-role="drawing">
        <circle cx={x} cy={y} r={r} fill="#F2F2EC" stroke={INK} strokeWidth={4} />
        {/* faint blur: diffuse stained material, fading as the X resolves */}
        {[[-30, -18, 46], [22, 10, 52], [-6, 28, 40], [14, -30, 34]].map(([dx, dy, rr], i) => <circle key={i} cx={x + dx * (1 - k * 0.6)} cy={y + dy * (1 - k * 0.6)} r={rr * (1 - 0.5 * k)} fill="#6E7390" opacity={0.18 * (1 - k)} />)}
        {k > 0 && <g opacity={k} transform={`translate(${x} ${y}) rotate(18)`}>
          <path d="M-14 -46C-10 -20 -8 -8 -4 0C-8 8 -10 20 -14 46" fill="none" stroke="#1F2A55" strokeWidth={13} strokeLinecap="round" />
          <path d="M14 -46C10 -20 8 -8 4 0C8 8 10 20 14 46" fill="none" stroke="#1F2A55" strokeWidth={13} strokeLinecap="round" />
        </g>}
      </g>
      <Txt x={x} y={y + r + 30} size={17} weight={600} fill={C.muted} anchor="middle" italic>schematic drawing — not a photomicrograph</Txt>
    </g>
  );
}

/** Staple handle: two identical sheets, one on the other, a staple pressing through both (p 0..1 = staple in). */
export function StapleInset({x, y, p = 1, opacity = 1, pulse = 0}: any) {
  if (opacity <= 0) return null;
  const sy = lerp(-60, 0, clamp01(p));
  const sheet = (dx: number, dy: number, k: string) => (
    <g key={k}>
      <rect x={x + dx} y={y + dy} width={150} height={196} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={x + dx + 20} y1={y + dy + 52 + i * 22} x2={x + dx + 130 - (i % 3) * 16} y2={y + dy + 52 + i * 22} stroke="#9AA3B5" strokeWidth={4} />)}
    </g>
  );
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <g data-role="drawing">
        {sheet(26, 18, 'b')}{sheet(0, 0, 'a')}
        <path d={`M${x + 18} ${y + 24 + sy}H${x + 48}`} stroke="#6B6B6B" strokeWidth={6} strokeLinecap="round" />
      </g>
      {pulse > 0 && <circle data-role="decor" cx={x + 33} cy={y + 24} r={24} fill={T5.ring} opacity={0.45 * pulse} />}
    </g>
  );
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

/** Forms row on the exam-close surface. */
export function FormRow({x, y, w, title, cite, a, extra}: any) {
  const o = fi(a, 0.45);
  if (o <= 0) return null;
  const cl = wrap(cite, 16, w - 40, 600);
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={62 + cl.length * 21 + (extra ? 8 : 0)} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <Txt x={x + 20} y={y + 36} size={24} weight={800}>{title}</Txt>
      {cl.map((l, i) => <Txt key={i} x={x + 20} y={y + 62 + i * 21} size={16} weight={600} fill={C.muted} italic>{l}</Txt>)}
    </g>
  );
}
export const formRowH = (cite: string, w: number) => 62 + wrap(cite, 16, w - 40, 600).length * 21;
