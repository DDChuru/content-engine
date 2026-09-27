import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Bracket, Wash, C, Txt, Cite, SCHEM, PARTS, CY, U, clamp01} from '../kit';
import {WaterField} from '../WaterField';
import {FluidMosaicMembrane, BILAYER, scatterPose, fmmLayout, plPos, FACE, HY} from '../FluidMosaicMembrane';
import {PhospholipidToken} from '../PhospholipidToken';
import {WaterTok} from '../T4Tokens';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';
import {B3} from './Beat03';

const FIELD = [230, 250, 1700, 830];
/** Beat 4 · Why a bilayer forms: scattered phospholipids in water assemble into two layers (motion, ~3 s). */
export default function Beat04(s: any) {
  const t = gt(s), a = s.a, u = U, cy = CY;
  const Lf = fmmLayout({cx: 960, cy, u, show: BILAYER});
  const asm = clamp01(a('assemble') / 3.0);
  const sc = clamp01(a('scatter') / 1.6);
  const drift = clamp01(a('core') / 2);
  // the Beat 3 token shrinks to normal size at token 5's scattered place
  const p5 = scatterPose(5, FIELD, t), sh = fe(s.local, 1.4);
  const single = a('scatter') < 0;
  const band = [Lf.x0 - 30, cy - FACE * u - 8, Lf.x1 + 30, cy + FACE * u + 8];
  const mem = {cx: 960, cy, u, t, show: BILAYER, assemble: asm >= 1 ? 1 : asm, scatter: sc, field: FIELD, keep: [5], drift};
  const heads = fi(a('heads'), 0.5);
  const ring3 = [2, 9, 17].map((i) => { const p = scatterPose(i, FIELD, t), r = (p.a * Math.PI) / 180; return {x: p.x - Math.sin(r) * 1.15 * u, y: p.y + Math.cos(r) * 1.15 * u}; });
  return (
    <g>
      <WaterField regions={[[80, 215, 1840, 935]]} n={78} t={t} seed={21} hbonds={fe(a('wwhb'), 0.6)} opacity={1 - asm} />
      {asm > 0 && <WaterField regions={[[80, 215, 1840, band[1]], [80, band[3], 1840, 935]]} n={[36, 34]} t={t} seed={22} hbonds={fe(a('wwhb'), 0.6) * (1 - fe(a('bilayer'), 1.5) * 0.6)} opacity={asm} />}
      {/* highlights on the formed bilayer */}
      <Wash x={Lf.x0 - 24} y={Lf.outerHead - 30} w={Lf.width + 48} h={60} o={0.9 * pulse(a('hfaces'), 2.2)} />
      <Wash x={Lf.x0 - 24} y={Lf.innerHead - 30} w={Lf.width + 48} h={60} o={0.9 * pulse(a('hfaces'), 2.2)} />
      <Wash x={Lf.x0 - 24} y={cy - 40} w={Lf.width + 48} h={80} o={0.9 * pulse(a('tfaces'), 2.2)} />
      {fi(a('core'), 0.8) > 0 && <rect data-role="decor" x={Lf.x0 - 20} y={cy - 1.45 * u} width={Lf.width + 40} height={2.9 * u} rx={14} fill="#8E8E8E" opacity={0.12 * fi(a('core'), 0.8)} />}
      {single ? <PhospholipidToken x={B3.x + (p5.x - B3.x) * sh} y={B3.y + (p5.y - B3.y) * sh} u={B3.u + (u - B3.u) * sh} angle={p5.a * sh} /> : <FluidMosaicMembrane {...mem} />}
      {/* water in contact with the heads: dashed hydrogen bonds on both faces */}
      {heads > 0 && Array.from({length: 24}, (_, i) => {
        const p = plPos({cx: 960, cy, u, t, show: BILAYER, drift}, i), dir = i < 12 ? -1 : 1;
        const wx = p.x + 10 * Math.sin(t * 2 + i), wy = p.y + dir * (0.95 * u + 6 * Math.sin(t * 3 + i * 1.3));
        const on = Math.sin(t * 2.6 + i * 1.9) > -0.3 ? 1 : 0.25;
        return <g key={i} opacity={heads}><path data-role="drawing" d={`M${p.x} ${p.y + dir * 0.42 * u}L${wx} ${wy - dir * 8}`} stroke={T4.waterEdge} strokeWidth={2} strokeDasharray="4 4" opacity={on} /><WaterTok x={wx} y={wy} r={7} /></g>;
      })}
      {ring3.map((r, i) => <InkRing key={i} cx={r.x} cy={r.y} rx={34} ry={46} p={fe(a('tailsout') - i * 0.2, 0.5)} opacity={1 - fe(a('tailsout') - 2.2, 0.5)} color={C.primary} />)}
      <Pill x={90} y={250} text="water–water hydrogen bonds" o={fi(a('wwhb'), 0.4) * (1 - fe(a('sides'), 0.5))} fill={T4.waterEdge} />
      <Pill x={90} y={296} text="tails: no hydrogen bonds with water" o={fi(a('tailsout'), 0.4) * (1 - fe(a('sides'), 0.5))} fill={C.primary} />
      {/* after assembly */}
      <Bracket x={Lf.x1 + 36} y0={cy - 44} y1={cy + 44} side={-1} o={fi(a('hint'), 0.4)} color={C.primary} />
      <Lbl x={Lf.x1 + 60} y={cy + 8} text="hydrophobic interactions" o={fi(a('hint'), 0.4)} size={24} fill={C.primary} />
      <Lbl x={90} y={cy - FACE * u - 34} text="outside the cell (watery)" o={fi(a('sides'), 0.5)} size={24} fill={C.teal} />
      <Lbl x={90} y={cy + FACE * u + 50} text="cytoplasm (watery)" o={fi(a('sides'), 0.5)} size={24} fill={C.teal} />
      <Bracket x={Lf.x0 - 40} y0={Lf.outerHead - 30} y1={cy - 6} side={1} o={fi(a('two'), 0.4)} />
      <Bracket x={Lf.x0 - 40} y0={cy + 6} y1={Lf.innerHead + 30} side={1} o={fi(a('two') - 0.2, 0.4)} />
      <Pill x={Lf.x0 - 60} y={cy + 8} text="12 per layer (drawn section)" o={fi(a('two'), 0.4) * (1 - fi(a('core'), 0.4))} anchor="end" />
      <Lbl x={Lf.x0 - 60} y={cy + 8} text="hydrophobic core" o={fi(a('core'), 0.5)} size={24} anchor="end" fill={C.muted} />
      <Lbl x={Lf.x1 + 60} y={Lf.outerHead - 70} text="phospholipid bilayer" o={fi(a('bilayer'), 0.5)} size={30} />
      <Cite x={Lf.x1 + 60} y={Lf.outerHead - 40} text={SCHEM} opacity={fi(a('bilayer'), 0.5)} />
      <RBC x={1710} y={300} r={50} o={1 - fe(a('sides'), 0.6)} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
