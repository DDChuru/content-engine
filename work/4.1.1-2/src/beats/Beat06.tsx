import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Bracket, Stage, RegionLabels, C, Txt, Cite, SCHEM, PARTS, CY, U, clamp01} from '../kit';
import {BILAYER, fmmLayout, compPos, plPos, FACE} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';

export const show6 = (s: any) => {
  const a = s.a, g = (k: string, d: number) => clamp01((a(k) - d) / 2.0);
  return {...BILAYER, channel: g('intrinsic', 0), receptor: g('intrinsic', 0.5), carrier: g('intrinsic', 1.0), extrinsic: clamp01(a('extrinsic') / 1.6)};
};
/** Beat 6 · Proteins placed by the same logic: intrinsic (embedded; these three transmembrane), R-group regions,
 * the channel's pore, an extrinsic protein on the cytoplasmic face. */
export default function Beat06(s: any) {
  const t = gt(s), a = s.a, u = U, cy = CY;
  const show = show6(s);
  const Lf = fmmLayout({cx: 960, cy, u, show});
  const P = (k: any) => compPos({cx: 960, cy, u, t, show}, k);
  const ch = P('channel'), rc = P('receptor'), ca = P('carrier'), ex = P('extrinsic');
  const H = PROT.H * u, top = cy - H, bot = cy + H;
  const rb = clamp01(a('midband') / 0.8) * 0.5 + clamp01(a('outband') / 0.8) * 0.5;
  const names = fi(a('names'), 0.5), trans = fi(a('trans'), 0.5);
  const p3 = plPos({cx: 960, cy, u, t, show}, 15);   // inner-leaflet head beside the extrinsic protein (position 3)
  const place = 1 - fi(a('logic'), 0.6);
  return (
    <g>
      <Stage s={s} mem={{show, chains: {receptor: 0}, rBands: rb, poreWater: false}} n={[30, 30]} />
      {/* placeholders from Beat 5 fade */}
      {place > 0 && [4, 7, 9].map((k, i) => <rect key={i} data-role="decor" x={960 - 6 * u + k * u - 24} y={cy - 2.6 * u} width={48} height={5.2 * u} rx={14} fill="none" stroke={T4.proteinEdge} strokeWidth={3} strokeDasharray="8 6" opacity={place} />)}
      <RegionLabels cy={cy} u={u} x={90} oCore={0} hiIn={pulse(a('cytoside'), 1.4)} />
      <Lbl x={Lf.x0 - 50} y={cy + 8} text="hydrophobic core" size={22} anchor="end" fill={C.muted} />
      <Txt x={960} y={262} size={28} weight={700} anchor="middle" opacity={fi(a('intrinsic'), 0.5)}>intrinsic proteins: embedded in the bilayer</Txt>
      {/* names */}
      <Lbl x={ch.x} y={top - 22} text="channel protein" anchor="middle" o={names} size={22} />
      <Lbl x={rc.x} y={top - 48} text="receptor" anchor="middle" o={names} size={22} />
      <Lbl x={rc.x + 50} y={top - 16} text="binding site" o={names} size={17} fill={C.muted} lx={rc.x + 4} ly={top + 18} />
      <Lbl x={ca.x} y={top - 22} text="carrier protein" anchor="middle" o={names} size={22} />
      {[ch, rc, ca].map((p, i) => <Bracket key={i} x={p.x - PROT.W * u / 2 - 12} y0={top} y1={bot} side={1} o={trans} p={fe(a('trans') - i * 0.15, 0.5)} color={C.teal} />)}
      <Lbl x={Lf.x1 + 30} y={cy - 190} text="transmembrane (span the bilayer)" o={trans} size={22} fill={C.teal} />
      <Cite x={Lf.x1 + 30} y={cy - 164} text="these examples span it;" opacity={trans} />
      <Cite x={Lf.x1 + 30} y={cy - 142} text="intrinsic does not always mean spanning" opacity={trans} />
      {/* R groups */}
      {pulse(a('hphobR'), 1.6) > 0 && <rect data-role="decor" x={Lf.x0 - 10} y={cy - 1.4 * u} width={Lf.width + 20} height={2.8 * u} rx={12} fill="#FFFFFF" opacity={0.3 * pulse(a('hphobR'), 1.6)} />}
      <Lbl x={Lf.x1 + 30} y={cy + 14} text="hydrophobic R groups" o={fi(a('hphobR'), 0.4)} size={22} fill="#4F6F73" lx={ca.x + PROT.W * u / 2} ly={cy} />
      <Lbl x={Lf.x1 + 30} y={cy - 88} text="hydrophilic R groups" o={fi(a('hphilR'), 0.4)} size={22} fill={T4.proteinEdge} lx={ca.x + PROT.W * u / 2} ly={top + 0.5 * u} />
      {fi(a('hphilR'), 0.4) > 0 && [ch, rc, ca].map((p, i) => {
        const on = Math.sin(t * 3 + i) > -0.2 ? 1 : 0.3;
        return <path key={i} data-role="drawing" d={`M${p.x + 0.6 * u} ${top + 0.3 * u}L${p.x + 0.9 * u} ${top - 0.45 * u}M${p.x - 0.6 * u} ${bot - 0.3 * u}L${p.x - 0.85 * u} ${bot + 0.45 * u}`} stroke={T4.waterEdge} strokeWidth={2} strokeDasharray="4 4" opacity={fi(a('hphilR'), 0.4) * on} />;
      })}
      {pulse(a('pore'), 1.6) > 0 && <rect data-role="decor" x={ch.x - 0.23 * u - 4} y={top} width={0.46 * u + 8} height={2 * H} rx={8} fill="#FFFFFF" opacity={0.7 * pulse(a('pore'), 1.6)} />}
      <Lbl x={ch.x - 60} y={318} text="pore lined by hydrophilic R groups" anchor="end" o={fi(a('pore'), 0.4)} size={22} fill={T4.proteinEdge} lx={ch.x} ly={top + 1.0 * u} />
      <Pill x={ch.x} y={top - 58} text="role: 4.1.3" anchor="middle" o={fi(a('porerole'), 0.4)} />
      {/* extrinsic */}
      <Lbl x={Lf.x0 - 50} y={bot + 70} text="extrinsic protein: on a surface" anchor="end" o={fi(a('extrinsic') - 1.0, 0.5)} size={22} lx={ex.x - 0.7 * u} ly={ex.y} />
      <InkRing cx={p3.x} cy={p3.y + 8} rx={30} ry={26} p={fe(a('attach'), 0.5)} color={C.teal} />
      <InkRing cx={ch.x - 0.62 * u} cy={bot} rx={30} ry={26} p={fe(a('attach') - 0.4, 0.5)} color={C.teal} />
      <RBC x={1760} y={250} r={36} />
      <Cite x={Lf.x1 + 30} y={cy + 250} text={SCHEM} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
