import React from 'react';
import {fi, fe, move, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Bracket, C, Txt, Cite, SCHEM, PARTS, clamp01} from '../kit';
import {WaterField} from '../WaterField';
import {PhospholipidToken} from '../PhospholipidToken';
import {WaterTok} from '../T4Tokens';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';

export const B3 = {x: 860, y: 430, u: 170};
/** Beat 3 · The phospholipid, recalled. One large token in a water field; water hydrogen-bonds to the head only. */
export default function Beat03(s: any) {
  const t = gt(s), a = s.a, {x: X, y: Y, u} = B3, R = 0.4 * u;
  const inP = fe(a('pl'), 1.2), px = X + (1 - inP) * 700;
  const hb = fe(a('hb'), 1.0);
  // three head-side water molecules: ringed at 'wpolar', move in to hydrogen-bond at 'hb'
  const HW = [[-150, 640, 300], [-35, 1090, 290], [160, 640, 560]].map(([ang, sx, sy], i) => {
    const r0 = R + 60, fx = X + r0 * Math.cos((ang * Math.PI) / 180), fy = Y + r0 * Math.sin((ang * Math.PI) / 180);
    const j = 3 * Math.sin(t * 6 + i * 2);
    return {x: sx + (fx - sx) * hb + j, y: sy + (fy - sy) * hb + j * 0.6, ang};
  });
  const nt = a('notails');
  const TW = [[0, 980, 780, 740, 610], [1, 700, 820, 960, 660]].map(([i, sx, sy, ex, ey]) => { const k = clamp01((nt + 0.2 * i) / 5); return {x: sx + (ex - sx) * k + 4 * Math.sin(t * 5 + i), y: sy + (ey - sy) * k}; });
  const hbLines = HW.map((w) => { const d = Math.hypot(w.x - X, w.y - Y), ux = (w.x - X) / d, uy = (w.y - Y) / d; return `M${(X + ux * (R + 3)).toFixed(1)} ${(Y + uy * (R + 3)).toFixed(1)}L${(w.x - ux * 9).toFixed(1)} ${(w.y - uy * 9).toFixed(1)}`; }).join('');
  const flick = hb > 0.95 ? (Math.sin(t * 7) > -0.6 ? 1 : 0.35) : hb;
  const hphil = fi(a('hphil'), 0.5), hphob = fi(a('hphob'), 0.5);
  return (
    <g>
      <WaterField regions={[[80, 215, 1840, 935]]} n={78} t={t} seed={11} hbonds={1} holes={[[X - 170, Y - 170, X + 200, 800], [980, 330, 1560, 420], [980, 560, 1560, 690], [80, 870, 1500, 935]]} />
      <PhospholipidToken x={px} y={Y} u={u} opacity={inP} hl={pulse(a('head'), 1.2) * 0.6} />
      {inP > 0.95 && fi(a('polar'), 0.4) > 0 && <g data-role="drawing" opacity={fi(a('polar'), 0.4)}><circle cx={X + 30} cy={Y - 22} r={15} fill="#FFFFFF" stroke={T4.headEdge} strokeWidth={2} /><path d={`M${X + 22} ${Y - 22}H${X + 38}`} stroke={T4.headEdge} strokeWidth={3} /></g>}
      {pulse(a('tails'), 1.2) > 0 && <path data-role="decor" d={`M${X - 22} ${Y + 60}V${Y + 310}M${X + 22} ${Y + 60}V${Y + 310}`} stroke="#FFFFFF" strokeWidth={22} opacity={0.35 * pulse(a('tails'), 1.2)} />}
      {/* head water: hydrogen bonds (dashed, Topic 2 convention), forming and breaking */}
      {a('wpolar') > -1e8 && <g>
        {hb > 0 && <path data-role="drawing" d={hbLines} stroke={T4.waterEdge} strokeWidth={2.4} strokeDasharray="5 5" fill="none" opacity={flick} />}
        {HW.map((w, i) => <WaterTok key={i} x={w.x} y={w.y} r={10} opacity={fi(a('wpolar'), 0.4)} />)}
        {HW.map((w, i) => <InkRing key={'r' + i} cx={w.x} cy={w.y} rx={22} ry={22} p={fe(a('wpolar') - i * 0.15, 0.5)} opacity={1 - fe(a('hb') - 1.5, 0.6)} color={C.teal} />)}
        {HW.map((w, i) => <Txt key={'t' + i} x={w.x} y={w.y - 22} size={16} weight={700} fill={C.teal} anchor="middle" opacity={fi(a('wpolar'), 0.4) * (1 - fe(a('hb') - 1.5, 0.6))}>polar</Txt>)}
      </g>}
      {TW.map((w, i) => <WaterTok key={'tw' + i} x={w.x} y={w.y} r={10} opacity={fi(nt, 0.4)} />)}
      {/* labels */}
      <Lbl x={1000} y={Y - 36} text={hphil > 0 ? 'hydrophilic head (phosphate-containing)' : 'head'} o={fi(a('head'), 0.4)} size={28} lx={X + R + 4} ly={Y - 8} fill={hphil > 0 ? C.teal : C.ink} />
      <Txt x={1000} y={Y - 2} size={20} weight={600} fill={C.muted} opacity={fi(a('head'), 0.4) * (1 - hphil)}>phosphate group</Txt>
      <Pill x={1000} y={Y + 34} text="polar" o={fi(a('polar'), 0.4)} fill={C.teal} />
      <Pill x={1100} y={Y + 34} text="carries charge" o={fi(a('polar'), 0.4)} />
      <Lbl x={X + 70} y={Y + 104} text="glycerol" o={fi(a('head'), 0.4) * 0.9} size={18} weight={600} fill={C.muted} lx={X + 26} ly={Y + 70} />
      <Lbl x={1000} y={Y + 200} text={hphob > 0 ? 'hydrophobic fatty-acid tails' : 'fatty-acid tails'} o={fi(a('tails'), 0.4)} size={28} lx={X + 45} ly={Y + 190} fill={hphob > 0 ? C.primary : C.ink} />
      <Pill x={1000} y={Y + 238} text="non-polar" o={fi(a('tails'), 0.4)} />
      <Lbl x={X + 110} y={Y - 120} text="hydrogen bond" o={fi(a('hb') - 0.6, 0.4)} size={20} fill={T4.waterEdge} lx={(HW[1].x + X + R * 0.8) / 2} ly={(HW[1].y + Y - R * 0.55) / 2} />
      <Txt x={1000} y={Y + 300} size={20} weight={600} fill={C.muted} italic opacity={fi(nt, 0.5)}>water bonds with water, not with the tails</Txt>
      <Bracket x={X - 190} y0={Y - R} y1={Y + R} side={1} o={fi(a('ends'), 0.4)} color={C.teal} />
      <Bracket x={X - 190} y0={Y + R + 20} y1={Y + 330} side={1} o={fi(a('ends') - 0.3, 0.4)} color={C.primary} />
      <Txt x={X - 210} y={Y + 8} size={24} weight={700} fill={C.teal} anchor="end" opacity={fi(a('ends'), 0.4)}>hydrophilic</Txt>
      <Txt x={X - 210} y={Y + 200} size={24} weight={700} fill={C.primary} anchor="end" opacity={fi(a('ends') - 0.3, 0.4)}>hydrophobic</Txt>
      <RBC x={1710} y={300} r={50} />
      <Pill x={1000} y={780} text="recall: Topic 2 lipids" o={inP} fill={C.teal} />
      <Cite x={1000} y={818} text={SCHEM} opacity={inP} />
      <Cite x={90} y={900} text={'syllabus 2.2.11, p.18: "hydrophilic (polar) phosphate heads and hydrophobic (non-polar) fatty acid tails"'} opacity={fi(a('hphob'), 0.5)} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
