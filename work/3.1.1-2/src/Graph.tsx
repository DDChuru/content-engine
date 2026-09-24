/** EnergyProfileGraph (published by L1, recalled by label in L4a). Energy up; progress of reaction along
 * (OUR axis; S21/12's figure labels its axis "time"). ONE reactant level and ONE product level shared by
 * both curves: the endpoints never move in any state. Brackets: activation energy without enzyme and with
 * enzyme (both from the reactant level to their peak), and the reduction in activation energy between the
 * two peaks (accent). No transition-state label, no molecular drawing. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/src/theme';
import {Txt, Lines, Arrow, textW} from '../shared/src/Type';

/** Warm backing behind a multi-line label so curves never run through its letters. */
function BG({x, y, text, size, anchor = 'start', opacity = 1}: any) {
  const ls = String(text).split('\n'), w = Math.max(...ls.map((l) => textW(l, size, 700))) + 12;
  const x0 = anchor === 'end' ? x - w + 6 : x - 6;
  return <rect x={x0} y={y - size * 1.05} width={w} height={ls.length * size * 1.2 + size * 0.35} rx={6} fill={C.warm} opacity={0.92 * opacity} />;
}

export function geom(x: number, y: number, w: number, h: number) {
  const x0 = x + 0.04 * w, xa = x + 0.2 * w, xm = x + 0.5 * w, xb = x + 0.8 * w, x1 = x + 0.96 * w;
  const yr = y + 0.64 * h, yp = y + 0.78 * h, yu = y + 0.1 * h, yc = y + 0.4 * h;
  const hump = (pk: number) => `M${xa} ${yr}C${xa + 0.13 * w} ${yr} ${xm - 0.12 * w} ${pk} ${xm} ${pk}C${xm + 0.12 * w} ${pk} ${xb - 0.13 * w} ${yp} ${xb} ${yp}`;
  return {x0, xa, xm, xb, x1, yr, yp, yu, yc, hump};
}
/** Point at parameter t (0..1) along a hump (for tokens climbing). */
export function humpPoint(g: any, pk: number, t: number): [number, number] {
  const seg = (p0: number[], p1: number[], p2: number[], p3: number[], u: number) => {
    const v = 1 - u;
    return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]] as [number, number];
  };
  const w = (g.x1 - g.x0) / 0.92;
  if (t < 0.5) return seg([g.xa, g.yr], [g.xa + 0.13 * w, g.yr], [g.xm - 0.12 * w, pk], [g.xm, pk], t * 2);
  return seg([g.xm, pk], [g.xm + 0.12 * w, pk], [g.xb - 0.13 * w, g.yp], [g.xb, g.yp], t * 2 - 1);
}

function VBracket({x, y1, y2, color, width = 3.5, p = 1, opacity = 1}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const yy = y1 + (y2 - y1) * clamp01(p);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <path d={`M${x - 10} ${y1}H${x + 10}M${x} ${y1}V${yy}`} stroke={color} strokeWidth={width} fill="none" />
      {p >= 1 && <path d={`M${x - 10} ${y2}H${x + 10}`} stroke={color} strokeWidth={width} />}
      {p >= 1 && <polygon points={`${x},${y2 + 2} ${x - 8},${y2 + 16} ${x + 8},${y2 + 16}`} fill={color} />}
      <polygon points={`${x},${y1 - 2} ${x - 8},${y1 - 16} ${x + 8},${y1 - 16}`} fill={color} />
    </g>
  );
}

/** v: visibility/progress of each element (0..1). hi: brightness boosts. */
export function EnergyGraph({x, y, w, h, v = {}, hi = {}, opacity = 1, small = false}: any) {
  if (opacity <= 0) return null;
  const g = geom(x, y, w, h);
  const fs = small ? 15 : 22;
  const V = (k: string) => clamp01(v[k] ?? 0);
  const H = (k: string) => clamp01(hi[k] ?? 0);
  const dim = clamp01(v.dimTall ?? 0);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {/* axes */}
      <g opacity={V('axes')}>
        <Arrow x1={x} y1={y + h} x2={x} y2={y - 10} color={C.ink} width={3} head={14} />
        <Arrow x1={x} y1={y + h} x2={x + w + 10} y2={y + h} color={C.ink} width={3} head={14} />
      </g>
      <g opacity={V('yl')}><Txt x={x - 18} y={y + 20} size={fs + 2} weight={800} anchor="end">energy</Txt></g>
      <g opacity={V('xl')}>
        <Txt x={x + w} y={y + h + (small ? 26 : 40)} size={fs + 2} weight={800} anchor="end">progress of reaction</Txt>
        {!small && <Txt x={x + w} y={y + h + 68} size={17} weight={600} fill={C.muted} anchor="end" italic>our axis; S21/12's figure labels its axis "time"</Txt>}
      </g>
      {/* levels (fixed) */}
      <g opacity={V('sub')}>
        <path d={`M${g.x0} ${g.yr}H${g.xa}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        {H('same') > 0 && <path d={`M${g.x0} ${g.yr}H${g.xa}`} stroke={C.accent} strokeWidth={16} strokeLinecap="round" opacity={0.7 * H('same')} />}
        <Txt x={(g.x0 + g.xa) / 2} y={g.yr + (small ? 22 : 36)} size={fs} weight={800} anchor="middle">substrate</Txt>
      </g>
      <g opacity={V('prod')}>
        <path d={`M${g.xb} ${g.yp}H${g.x1}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        {H('same') > 0 && <path d={`M${g.xb} ${g.yp}H${g.x1}`} stroke={C.accent} strokeWidth={16} strokeLinecap="round" opacity={0.7 * H('same')} />}
        <Txt x={(g.xb + g.x1) / 2} y={g.yp + (small ? 22 : 36)} size={fs} weight={800} anchor="middle">product</Txt>
        {!small && <Lines x={(g.xb + g.x1) / 2} y={g.yp + 64} size={16} step={20} weight={600} fill={C.muted} anchor="middle" italic text={'in this example the product level is lower;\nthe enzyme does not change either level'} />}
      </g>
      {/* curves */}
      {V('u') > 0 && <path d={g.hump(g.yu)} fill="none" stroke={C.muted} strokeWidth={5} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - V('u')} opacity={1 - 0.45 * clamp01(v.dimU ?? 0)} />}
      {V('u') >= 1 && <Txt x={g.xm} y={g.yu - 16} size={fs} weight={800} fill={C.muted} anchor="middle">without enzyme</Txt>}
      {V('c') > 0 && <path d={g.hump(g.yc)} fill="none" stroke={C.teal} strokeWidth={6} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - V('c')} />}
      {V('c') >= 1 && <Txt x={g.xm + (small ? 0 : 0)} y={g.yc + (small ? 24 : 38)} size={fs} weight={800} fill={C.teal} anchor="middle">with enzyme</Txt>}
      {/* peak rings */}
      {V('ring') > 0 && <g opacity={V('ring')}>
        <ellipse cx={g.xm} cy={g.yu} rx={34} ry={20} fill="none" stroke={C.primary} strokeWidth={3} />
        <ellipse cx={g.xm} cy={g.yc} rx={34} ry={20} fill="none" stroke={C.primary} strokeWidth={3} />
      </g>}
      {/* guides */}
      {(V('ea1') > 0 || V('red') > 0) && <path d={`M${g.xm} ${g.yu}H${x + 0.3 * w}`} stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 5" opacity={Math.max(V('ea1'), V('red'))} />}
      {(V('ea2') > 0) && <path d={`M${g.xm} ${g.yc}H${x + 0.7 * w}M${g.xa} ${g.yr}H${x + 0.7 * w}`} stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 5" opacity={V('ea2')} />}
      {/* brackets */}
      <VBracket x={x + 0.3 * w} y1={g.yr} y2={g.yu} color={C.ink} p={V('ea1') * 1.0001} opacity={1 - 0.7 * dim} width={3.5 + 3 * H('ea1')} />
      {V('ea1') >= 1 && <BG x={x + 0.3 * w - 16} y={(g.yr + g.yu) / 2 - 10} size={fs} anchor="end" text={'activation energy\nwithout enzyme'} opacity={1 - 0.7 * dim} />}
      {V('ea1') >= 1 && <Lines x={x + 0.3 * w - 16} y={(g.yr + g.yu) / 2 - 10} size={fs} step={fs * 1.2} weight={800} anchor="end" fill={C.ink} opacity={1 - 0.7 * dim} text={'activation energy\nwithout enzyme'} />}
      <VBracket x={x + 0.7 * w} y1={g.yr} y2={g.yc} color={C.teal} p={V('ea2') * 1.0001} opacity={1 - 0.7 * dim} width={3.5 + 3 * H('ea2')} />
      {V('ea2') >= 1 && <g opacity={1 - 0.7 * dim}>
        {H('ea2') > 0 && <rect x={x + 0.7 * w + 8} y={(g.yr + g.yc) / 2 - fs * 1.3} width={fs * 9.4} height={fs * 2.6} rx={8} fill={C.accent} opacity={0.5 * H('ea2')} />}
        <BG x={x + 0.7 * w + 16} y={(g.yr + g.yc) / 2 - 4} size={fs} text={'activation energy\nwith enzyme'} />
        <Lines x={x + 0.7 * w + 16} y={(g.yr + g.yc) / 2 - 4} size={fs} step={fs * 1.2} weight={800} fill={C.teal} text={'activation energy\nwith enzyme'} />
      </g>}
      <VBracket x={g.xm} y1={g.yc} y2={g.yu} color={C.primary} width={5 + 3 * H('red')} p={V('red') * 1.0001} />
      {V('red') >= 1 && <BG x={g.xm + 18} y={(g.yc + g.yu) / 2 + 4} size={fs} text={'reduction in\nactivation energy'} />}
      {V('red') >= 1 && <Lines x={g.xm + 18} y={(g.yc + g.yu) / 2 + 4} size={fs} step={fs * 1.2} weight={800} fill={C.primary} text={'reduction in\nactivation energy'} />}
    </g>
  );
}
