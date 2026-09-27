import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Stage, RegionLabels, C, Txt, Cite, SCHEM, PARTS, CY, U, clamp01} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';
import {Tray} from './Beat08';
import {SHOW8} from './Beat09';

/** Beat 10 · Glycoproteins: the receptor's short chain appears; a glycoprotein with a longer chain enters at position
 * 12; chains project from the outer surface; the channel and carrier carry none (in our membrane). */
export default function Beat10(s: any) {
  const t = gt(s), a = s.a, u = U, cy = CY;
  const show = {...SHOW8, glycolipid: 1, glycoprotein: clamp01(a('gprot') / 2.0)};
  const Lf = fmmLayout({cx: 960, cy, u, show});
  const P = (k: any) => compPos({cx: 960, cy, u, t, show}, k);
  const ch = P('channel'), rc = P('receptor'), ca = P('carrier'), gp = P('glycoprotein'), gl = P('glycolipid'), ex = P('extrinsic');
  const H = PROT.H * u, top = cy - H;
  const rchain = clamp01(a('rchain') / 1.2);
  const hlId = a('notevery') >= 0 && a('nochain') < 0 ? (a('notevery') < 2.2 ? 'intrinsic-channel' : 'intrinsic-carrier') : null;
  const hlAmt = hlId ? fe(a('notevery') - (hlId === 'intrinsic-carrier' ? 2.2 : 0), 0.4) : 0;
  const bands = fe(a('parts'), 0.6) * (1 - fe(a('parts') - 3.0, 0.6));
  const some = pulse(a('some'), 1.4);
  const chainGlow = pulse(a('project'), 2.0), glGlow = pulse(a('likegl'), 2.0);
  return (
    <g>
      {some > 0 && [ch, rc, ca].map((p, i) => <rect key={i} data-role="decor" x={p.x - PROT.W * u / 2 - 10} y={top - 10} width={PROT.W * u + 20} height={2 * H + 20} rx={18} fill="#FFFFFF" opacity={0.6 * some} />)}
      {chainGlow + glGlow > 0 && [rc.x + 0.62 * u, gp.x, gl.x].map((x, i) => <rect key={'c' + i} data-role="decor" x={x - 0.45 * u} y={top - 2.1 * u} width={0.9 * u + (i === 2 ? 0.4 * u : 0)} height={2.1 * u} rx={14} fill="#E3F2DC" opacity={i === 2 ? glGlow : Math.max(chainGlow, glGlow)} />)}
      <Stage s={s} mem={{show, chains: {receptor: rchain}, highlight: hlId, hl: hlAmt, rBands: bands, rBandsOn: ['receptor', 'glycoprotein']}} n={[30, 30]} />
      <RegionLabels cy={cy} u={u} x={90} oCore={0} />
      <Lbl x={Lf.x0 - 50} y={cy + 8} text="hydrophobic core" size={22} anchor="end" fill={C.muted} />
      <g opacity={1 - fe(a('gprot') - 1.2, 0.6)}><Tray items={['glycoprotein']} lift={{glycoprotein: fe(a('gp'), 0.6) + fe(a('gprot'), 0.8)}} t={t} /></g>
      <Lbl x={rc.x - 50} y={top - 1.7 * u} text="receptor-glycoprotein" anchor="end" o={fi(a('rchain'), 0.5)} size={24} lx={rc.x - 6} ly={top - 6} />
      <Lbl x={rc.x - 50} y={top - 0.9 * u} text="binding site" anchor="end" o={fi(a('rchain'), 0.5)} size={18} weight={600} fill={C.muted} lx={rc.x - 4} ly={top + 18} />
      <Lbl x={gp.x + 30} y={top - 2.4 * u} text="glycoprotein" o={fi(a('gprot') - 1.6, 0.5)} size={24} lx={gp.x + 6} ly={top - 1.0 * u} />
      <Txt x={960} y={236} size={24} weight={700} anchor="middle" fill="#35652B" opacity={fi(a('project'), 0.5)}>chains project from the outer surface</Txt>
      <Pill x={(ch.x + ca.x) / 2} y={cy + H + 70} text="no chain on these two (in our membrane)" anchor="middle" o={fi(a('notevery'), 0.5)} />
      {hlId && <path data-role="decor" d={`M${(ch.x + ca.x) / 2 - 80} ${cy + H + 46}L${(hlId === 'intrinsic-channel' ? ch : ca).x} ${cy + H + 6}`} stroke={C.muted} strokeWidth={1.8} opacity={hlAmt} />}
      <Pill x={rc.x} y={cy + H + 34} text="roles: 4.1.3" anchor="middle" o={fi(a('nochain'), 0.5)} />
      <Pill x={gp.x} y={cy + H + 34} text="roles: 4.1.3" anchor="middle" o={fi(a('nochain'), 0.5)} />
      <RBC x={1760} y={250} r={36} />
      <Cite x={90} y={930} text={SCHEM} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
