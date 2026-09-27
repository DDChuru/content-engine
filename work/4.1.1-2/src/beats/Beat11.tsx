import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Stage, RegionLabels, Sentence, Wash, C, Txt, Cite, SCHEM, PARTS, clamp01} from '../kit';
import {fmmLayout, compPos, FULL, FACE} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';
import {InkRing, Underline} from '../../shared/src/Type';

export const V11 = {u: 52, cy: 480};
/** Beat 11 · The whole membrane (full), which face carries what, and a description to write. */
export default function Beat11(s: any) {
  const t = gt(s), a = s.a, z = fe(a('whole'), 1.2);
  const u = 58 + (V11.u - 58) * z, cy = 540 + (V11.cy - 540) * z, show = FULL;
  const Lf = fmmLayout({cx: 960, cy, u, show});
  const P = (k: any) => compPos({cx: 960, cy, u, t, show}, k);
  const rc = P('receptor'), gp = P('glycoprotein'), gl = P('glycolipid'), co = P('cholOut'), ci = P('cholIn');
  const H = PROT.H * u, top = cy - H;
  const chains = [gl.x + 0.15 * u, rc.x + 0.62 * u, gp.x];
  const faces = fe(a('gl') - 0.8, 0.4) * (1 - fe(a('gl') - 3.0, 0.5));
  const c1 = pulse(a('c1'), 1.6), c2 = pulse(a('c2'), 1.6);
  return (
    <g>
      {chains.map((x, i) => { const g = Math.max(fi(a('chains') - i * 0.5, 0.3) * (1 - fe(a('none'), 0.6)), c2); return g > 0 ? <rect key={i} data-role="decor" x={x - 0.5 * u} y={Lf.top - 2.2 * u} width={1.0 * u + (i === 0 ? 0.3 * u : 0)} height={2.2 * u} rx={14} fill="#E3F2DC" opacity={g} /> : null; })}
      <Wash x={Lf.x0 - 20} y={Lf.outerHead - 0.5 * u} w={Lf.width + 40} h={1.9 * u} o={0.8 * faces} fill="#E3F2DC" />
      <Wash x={Lf.x0 - 20} y={Lf.innerHead - 1.4 * u} w={Lf.width + 40} h={1.9 * u} o={0.8 * faces} fill="#E8EEF6" />
      <Stage s={s} cy={cy} u={u} mem={{show}} n={[28, 24]} />
      <RegionLabels cy={cy} u={u} x={90} oCore={0} hiOut={fi(a('top'), 0.3) * (1 - fe(a('none'), 0.5))} />
      <Pill x={Lf.x1 + 20} y={Lf.bottom + 30} text="no chains on this face" o={fi(a('none'), 0.5) * (1 - fe(a('gl'), 0.5))} />
      <Underline x1={Lf.x0} x2={Lf.x1} y={Lf.bottom + 8} p={fe(a('none'), 1.2)} opacity={1 - fe(a('gl'), 0.5)} />
      <InkRing cx={co.x} cy={co.y + 0.6 * u} rx={0.55 * u} ry={1.0 * u} p={fe(a('chol'), 0.5)} opacity={1 - fe(a('desc'), 0.6)} />
      <InkRing cx={ci.x} cy={ci.y - 0.6 * u} rx={0.55 * u} ry={1.0 * u} p={fe(a('chol') - 0.3, 0.5)} opacity={1 - fe(a('desc'), 0.6)} />
      <InkRing cx={gl.x + 0.1 * u} cy={gl.y - 0.4 * u} rx={0.7 * u} ry={1.6 * u} p={fe(a('gl'), 0.5)} opacity={1 - fe(a('desc'), 0.6)} />
      <Pill x={Lf.x1 + 20} y={Lf.outerHead + 8} text="outer face" o={faces} fill="#35652B" />
      <Pill x={Lf.x1 + 20} y={Lf.innerHead + 8} text="cytoplasmic face" o={faces} fill={C.teal} />
      <Lbl x={co.x - 30} y={Lf.top - 2.6 * u} text="cholesterol: both layers" anchor="end" o={fi(a('chol'), 0.5) * (1 - fe(a('desc'), 0.6))} size={20} lx={co.x - 4} ly={co.y - 8} />
      <Lbl x={gl.x - 20} y={Lf.top - 2.6 * u} text="glycolipid: outer layer" anchor="end" o={fi(a('gl'), 0.5) * (1 - fe(a('desc'), 0.6))} size={20} lx={gl.x - 6} ly={gl.y - 1.9 * u} />
      {c1 > 0 && <g><InkRing cx={co.x} cy={co.y + 0.6 * u} rx={0.55 * u} ry={1.0 * u} p={1} opacity={c1} color="#B8862F" /><InkRing cx={ci.x} cy={ci.y - 0.6 * u} rx={0.55 * u} ry={1.0 * u} p={1} opacity={c1} color="#B8862F" /></g>}
      <Sentence x={200} y={728} w={1520} o={fe(a('desc'), 0.6)} tag="a description you could write" size={26} lines={[
        {text: 'Cholesterol sits between the phospholipids in both layers, OH group towards the phospholipid heads;', o: fi(a('c1'), 0.5)},
        {text: 'glycolipids and glycoproteins have carbohydrate chains that project from the outer surface of the membrane.', o: fi(a('c2'), 0.5)},
      ]} />
      <RBC x={1760} y={250} r={36} />
      <Cite x={90} y={930} text={SCHEM} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
