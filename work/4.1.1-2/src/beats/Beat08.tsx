import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Stage, RegionLabels, Wash, C, Txt, Cite, SCHEM, PARTS, CY, U, clamp01} from '../kit';
import {fmmLayout, compPos, Cholesterol, Glycolipid, BeadChain} from '../FluidMosaicMembrane';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';
import {SHOW7} from './Beat07';

/** Component tray (right edge): greyed icons of the components still to place. */
export function Tray({items, lift = {}, t = 0}: any) {
  const all = ['cholesterol', 'glycolipid', 'glycoprotein'];
  return (
    <g>
      <rect data-role="decor" x={1690} y={300} width={150} height={420} rx={16} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
      <Txt x={1765} y={334} size={16} weight={700} fill={C.muted} anchor="middle">to place</Txt>
      {all.map((k, i) => {
        if (!items.includes(k)) return null;
        const L = clamp01(lift[k] ?? 0), y = 400 + i * 120 - 40 * L, o = (0.45 + 0.55 * L) * (1 - clamp01((lift[k] ?? 0) - 1));
        if (o <= 0) return null;
        return (
          <g key={k} opacity={o < 1 ? o : undefined}>
            {k === 'cholesterol' && <Cholesterol x={1765} y={y - 30} u={44} dir={1} />}
            {k === 'glycolipid' && <Glycolipid x={1765} y={y - 6} u={30} t={t} />}
            {k === 'glycoprotein' && <g data-role="drawing"><rect x={1753} y={y - 30} width={24} height={60} rx={8} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} /><BeadChain x={1765} y={y - 30} u={34} n={3} t={t} /></g>}
            <Txt x={1765} y={y + (k === 'glycolipid' ? 76 : 56)} size={15} weight={700} fill={C.muted} anchor="middle">{k}</Txt>
          </g>
        );
      })}
    </g>
  );
}
export const show8 = (s: any) => ({...SHOW7, cholOut: clamp01(s.a('both') / 2.0), cholIn: clamp01((s.a('both') - 0.4) / 2.0)});
/** Beat 8 · Cholesterol among the phospholipids, in both layers: polar OH at head level, non-polar rings among tails. */
export default function Beat08(s: any) {
  const t = gt(s), a = s.a, u = U, cy = CY, show = show8(s);
  const Lf = fmmLayout({cx: 960, cy, u, show});
  const co = compPos({cx: 960, cy, u, t, show}, 'cholOut'), ci = compPos({cx: 960, cy, u, t, show}, 'cholIn');
  const hl = fe(a('oh'), 0.6) * (1 - fe(a('nonpolar') - 1.2, 0.8));
  const tags = fi(a('logic'), 0.5), pp = pulse(a('polar'), 1.4), np = pulse(a('nonpolar'), 1.4);
  const level = fi(a('level'), 0.5);
  return (
    <g>
      {level > 0 && <g opacity={level}>
        <path data-role="decor" d={`M${Lf.x0 - 30} ${Lf.outerHead}H${Lf.x1 + 30}M${Lf.x0 - 30} ${Lf.innerHead}H${Lf.x1 + 30}`} stroke={C.primary} strokeWidth={2} strokeDasharray="10 7" />
      </g>}
      <Wash x={Lf.x0 - 20} y={cy - 1.45 * u} w={Lf.width + 40} h={2.9 * u} o={0.8 * pulse(a('rings'), 2.0) + 0.8 * np} />
      <Stage s={s} mem={{show, chains: {receptor: 0}, highlight: hl > 0 ? 'cholesterol' : null, hl}} n={[30, 30]} />
      <RegionLabels cy={cy} u={u} x={90} oCore={0} />
      <Lbl x={Lf.x0 - 50} y={cy + 8} text="hydrophobic core" size={22} anchor="end" fill={C.muted} o={1} />
      <Tray items={['cholesterol', 'glycolipid', 'glycoprotein']} lift={{cholesterol: fe(a('chol'), 0.6) + fe(a('both'), 0.8)}} t={t} />
      <Pill x={90} y={262} text="animal cell surface membranes" o={fi(a('animal'), 0.5)} fill={C.teal} />
      <Lbl x={co.x} y={Lf.top - 150} text="cholesterol (in both layers)" anchor="middle" o={fi(a('both') - 1.2, 0.5)} size={24} lx={co.x} ly={co.y - 14} />
      {fi(a('both') - 1.6, 0.5) > 0 && <path data-role="decor" d={`M${co.x + 60} ${Lf.top - 140}L${ci.x + 6} ${ci.y + 12}`} stroke={C.muted} strokeWidth={1.6} strokeDasharray="5 5" opacity={fi(a('both') - 1.6, 0.5) * (1 - level)} />}
      <Lbl x={co.x - 40} y={Lf.top - 64} text="OH (hydroxyl) group, polar" anchor="end" o={fi(a('oh'), 0.5)} size={22} fill={C.teal} lx={co.x - 6} ly={co.y - 6} />
      <Lbl x={Lf.x0 - 50} y={cy + 46} text="ring structure, non-polar" anchor="end" o={fi(a('ring'), 0.5)} size={22} fill={C.primary} lx={co.x - 14} ly={co.y + 0.75 * u} />
      <Pill x={co.x} y={Lf.bottom + 110} text="OH at head level, towards the water" anchor="middle" o={level} fill={C.primary} />
      {/* polarity tags overlay */}
      {tags > 0 && <g opacity={tags}>
        <Pill x={Lf.x0 + 1.0 * u} y={Lf.outerHead - 44} text="polar" anchor="middle" fill={C.teal} bg={pp > 0.1 ? '#DDF1F3' : C.white} />
        <Pill x={co.x} y={co.y - 40} text="polar" anchor="middle" fill={C.teal} bg={pp > 0.1 ? '#DDF1F3' : C.white} />
        <Pill x={ci.x} y={ci.y + 56} text="polar" anchor="middle" fill={C.teal} bg={pp > 0.1 ? '#DDF1F3' : C.white} />
        <Pill x={Lf.x0 + 2.6 * u} y={cy + 8} text="non-polar" anchor="middle" fill={C.primary} bg={np > 0.1 ? '#FBD9CE' : C.white} />
        <Pill x={co.x + 1.25 * u} y={co.y + 0.95 * u} text="non-polar" anchor="middle" fill={C.primary} bg={np > 0.1 ? '#FBD9CE' : C.white} />
      </g>}
      {pp > 0 && <g>
        <InkRing cx={Lf.x0 + 1.0 * u} cy={Lf.outerHead - 70} rx={46} ry={22} p={1} opacity={pp} color={C.teal} />
      </g>}
      <Pill x={co.x} y={Lf.top - 108} text="role: 4.1.3" anchor="middle" o={fi(a('nonpolar') - 1.2, 0.5)} />
      <RBC x={1760} y={250} r={36} />
      <Cite x={Lf.x1 + 30} y={cy + 250} text={SCHEM} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
