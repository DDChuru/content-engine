import React from 'react';
import {fi, fe, pulse, between} from '../util';
import {gt, Lbl, Pill, RBC, Stage, RegionLabels, Wash, BuildNote, C, Txt, Cite, SCHEM, PARTS, CY, U, clamp01} from '../kit';
import {fmmLayout, compPos, Cholesterol, Glycolipid, BeadChain} from '../FluidMosaicMembrane';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';
import {SHOW7} from './Beat07';

/** Component tray (right edge): greyed icons of the components still to place. */
export function Tray({items, lift = {}, t = 0}: any) {
  const all = ['cholesterol', 'glycolipid', 'glycoprotein'];
  return (
    <g>
      <rect data-role="decor" x={1680} y={290} width={170} height={560} rx={16} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
      <Txt x={1765} y={326} size={20} weight={700} fill={C.muted} anchor="middle">to place</Txt>
      {all.map((k, i) => {
        if (!items.includes(k)) return null;
        const L = clamp01(lift[k] ?? 0), y = 420 + i * 160 - 26 * L, o = (0.45 + 0.55 * L) * (1 - clamp01((lift[k] ?? 0) - 1));
        if (o <= 0) return null;
        return (
          <g key={k} opacity={o < 1 ? o : undefined}>
            {k === 'cholesterol' && <Cholesterol x={1765} y={y - 34} u={40} dir={1} />}
            {k === 'glycolipid' && <Glycolipid x={1765} y={y - 8} u={30} t={t} />}
            {k === 'glycoprotein' && <g data-role="drawing"><rect x={1753} y={y - 30} width={24} height={60} rx={8} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} /><BeadChain x={1765} y={y - 30} u={34} n={3} t={t} /></g>}
            <Txt x={1765} y={y + 62} size={20} weight={700} fill={C.muted} anchor="middle">{k}</Txt>
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
      <Lbl x={Lf.x0 - 44} y={cy + 8} text="hydrophobic core" size={22} anchor="end" fill={C.muted} o={1} />
      <Tray items={['cholesterol', 'glycolipid', 'glycoprotein']} lift={{cholesterol: fe(a('chol'), 0.6) + fe(a('both'), 0.8)}} t={t} />
      <Pill x={90} y={262} text="animal cell surface membranes" o={fi(a('animal'), 0.5)} fill={C.teal} />
      <Lbl x={co.x} y={Lf.top - 150} text="cholesterol (in both layers)" anchor="middle" o={fi(a('both') - 1.2, 0.5)} size={24} lx={co.x} ly={co.y - 14} />
      <Lbl x={ci.x + 34} y={Lf.bottom + 120} text="cholesterol" o={fi(a('both') - 1.6, 0.5) * (1 - fi(a('level'), 0.4))} size={22} lx={ci.x} ly={ci.y + 12} />
      {/* OH knob from above (through the water); ring plate of the inner one from below, past its own OH knob */}
      <Lbl x={co.x - 44} y={Lf.top - 70} text={'OH (hydroxyl) group, polar'} anchor="end" o={fi(a('oh'), 0.5)} size={22} fill={pp > 0.1 ? C.primary : C.teal} lx={co.x - 4} ly={co.y - 8} />
      <Lbl x={ci.x + 44} y={Lf.bottom + 64} text="ring structure, non-polar" o={fi(a('ring'), 0.5)} size={22} fill={C.primary} lx={ci.x + 3} ly={ci.y - 0.75 * u} />
      <Pill x={co.x - 120} y={Lf.bottom + 150} text="OH at head level, towards the water" anchor="middle" o={level} fill={C.primary} />
      {/* polarity tags (same logic): heads / tails of the phospholipids at the left edge; the cholesterol labels above say polar / non-polar */}
      {tags > 0 && <g opacity={tags}>
        <Lbl x={Lf.x0 - 44} y={Lf.outerHead + 8} text="polar heads" anchor="end" size={22} fill={pp > 0.1 ? C.primary : C.teal} lx={Lf.outer[0].x - 0.45 * u} ly={Lf.outerHead} o={1} />
        <Lbl x={Lf.x0 - 44} y={Lf.innerHead + 8} text="polar heads" anchor="end" size={22} fill={pp > 0.1 ? C.primary : C.teal} lx={Lf.inner[0].x - 0.45 * u} ly={Lf.innerHead} o={1} />
        <Lbl x={Lf.x0 - 44} y={cy + 44} text="non-polar tails" anchor="end" size={22} fill={C.primary} lx={Lf.outer[0].x - 0.2 * u} ly={cy + 38} o={1} />
      </g>}
      {pp > 0 && <InkRing cx={co.x} cy={co.y} rx={30} ry={26} p={1} opacity={pp} color={C.teal} />}
      {np > 0 && <InkRing cx={ci.x} cy={ci.y - 0.7 * u} rx={26} ry={42} p={1} opacity={np} color={C.primary} />}
      <Pill x={co.x + 240} y={Lf.top - 110} text="role: 4.1.3" anchor="middle" o={fi(a('nonpolar') - 1.2, 0.5)} />
      <BuildNote o={between(a('both'), a('oh') + 1.5)} />
      <RBC x={1760} y={250} r={36} />
      <Cite x={1660} y={880} text={SCHEM} anchor="end" />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
