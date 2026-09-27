import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Stage3, RoleGrid, Regions3, turnBack, gridFill, L3, C, Txt, Cite, textW, SCHEM, PARTS, clamp01} from '../kit';
import {fmmLayout, compPos, plPos, FULL} from '../FluidMosaicMembrane';
import {PROT, carrierSiteY, channelPass} from '../TransportProteinSet';
import {GlucoseTok, IonTok} from '../T4Tokens';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';

const ez = (k: number) => { k = clamp01(k); return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; };
/** Beat 6 · Carrier proteins: glucose (polar) turned back by the core; carrier-bind (0.6 s); the one-run shape-change
 * preview (flip 0.8 s, release 0.5 s — SHARED-SPECS timings); the carrier then holds its flipped outline, dimmed. */
export default function Beat06(s: any) {
  const t = gt(s), a = s.a, {cx, cy, u} = L3;
  const phase = ez(a('flip') / 0.8);
  const M = {cx, cy, u, t, show: FULL, carrierPhase: phase};
  const Lf = fmmLayout(M), ca = compPos(M, 'carrier'), ch = compPos(M, 'channel');
  const H = PROT.H * u;
  const g0 = [(plPos(M, 5).x + plPos(M, 6).x) / 2, Lf.top - 1.3 * u];   // over a lipid-only stretch, away from any protein
  let g: number[] = g0;
  if (a('bounce') >= 0) g = turnBack(a('bounce'), g0[0], g0[1], Lf.outerHead + 0.55 * u);
  if (a('needs') >= 0) g = path(a('needs'), [[0, g0[0], g0[1]], [1.2, ca.x, cy - H - 0.7 * u]]);
  if (a('bind') >= 0) g = [ca.x, (cy - H - 0.7 * u) + ((cy + carrierSiteY(0, u)) - (cy - H - 0.7 * u)) * ez(a('bind') / 0.6)];
  if (a('flip') >= 0) g = [ca.x, cy + carrierSiteY(phase, u)];
  if (a('release') >= 0) g = [ca.x, cy + carrierSiteY(1, u) + (3.2 * u - carrierSiteY(1, u)) * ez(a('release') / 0.5)];
  const gOn = a('glu') >= 0 && a('release') < 0.9;
  const held = fe(a('release') - 0.6, 0.5) * (1 - fe(a('role'), 0.5));
  const hl = fe(a('open'), 0.5) * (1 - fe(a('role'), 0.5));
  const mem = {highlight: hl > 0 ? 'intrinsic-carrier' : null, hl, carrierPhase: phase, compDim: {'intrinsic-carrier': 0.45 * held, 'intrinsic-channel': 0.45 * (1 - fe(a('role'), 0.5))}};
  const na = a('both') >= 0 ? channelPass(a('both'), 1.4, -3.6, 3.8) : null;
  return (
    <g>
      <Stage3 s={s} mem={mem} />
      <Regions3 />
      <RoleGrid t={t} fill={gridFill(s)} rowLit={{proteins: 1 - fe(a('site'), 0.5) + fi(a('role'), 0.4)}} colLit={{transport: 1 - fe(a('site'), 0.5) + fi(a('role'), 0.4)}} />
      <Pill x={ch.x} y={250} text="no change of shape" anchor="middle" o={0.6 * (1 - fe(a('role'), 0.5))} fill={C.primary} />
      <Lbl x={ca.x - 30} y={cy - H - 74} text="carrier protein" anchor="end" o={fi(a('open'), 0.4)} size={24} lx={ca.x - 0.5 * u} ly={cy - H + 6} />
      {gOn && <GlucoseTok x={g[0]} y={g[1]} r={13} />}
      <Lbl x={g0[0] - 26} y={g0[1] - 46} text="glucose (polar)" anchor="end" o={fi(a('glu'), 0.4) * (1 - fe(a('needs'), 0.5))} size={20} fill="#A4561A" />
      <Txt x={Lf.x0 + 10} y={Lf.bottom + 90} size={20} weight={600} fill={C.muted} italic opacity={fi(a('example'), 0.5) * (1 - fe(a('handoff'), 0.5))}>our example; which carrier, which direction</Txt>
      <Txt x={Lf.x0 + 10} y={Lf.bottom + 116} size={20} weight={600} fill={C.muted} italic opacity={fi(a('example'), 0.5) * (1 - fe(a('handoff'), 0.5))}>and whether energy is used: 4.2.1</Txt>
      <InkRing cx={ca.x} cy={cy - 1.6 * u} rx={0.7 * u} ry={1.1 * u} p={fe(a('site'), 0.5)} opacity={1 - fe(a('bind'), 0.5)} />
      <Lbl x={ca.x + 2.4 * u} y={cy - H - 36} text="binding site" o={fi(a('site'), 0.4) * (1 - fe(a('handoff'), 0.5))} size={20} lx={ca.x - 0.3 * u} ly={cy - 1.4 * u} />
      <Pill x={Lf.x0 + 10} y={Lf.bottom + 52} text="process: 4.2.1" o={fi(a('bind'), 0.4) * (1 - fe(a('flip') + 0.3, 0.3))} />
      <Pill x={Lf.x0 + 10} y={Lf.bottom + 52} text="preview; process: 4.2.1" o={fi(a('flip') - 0.05, 0.3) * (1 - fe(a('role'), 0.5))} fill={C.primary} />
      {['when', 'which direction', 'energy?'].map((w, i, arr) => <Pill key={w} x={Lf.x0 + 10 + arr.slice(0, i).reduce((acc, q) => acc + textW(q + ' · 4.2.1', 20, 700) + 22 + 14, 0)} y={Lf.bottom + 196} text={w + ' · 4.2.1'} o={fi(a('handoff') - i * 0.3, 0.4)} />)}
      {na && na.tok && <IonTok x={ch.x} y={cy + na.ty * u} r={9} />}
      <Lbl x={(ch.x + ca.x) / 2} y={Lf.bottom + 130} text="transport: channel proteins and carrier proteins" anchor="middle" o={fi(a('both'), 0.5)} size={23} fill={T4.proteinEdge} />
      {fi(a('both'), 0.5) > 0 && <path data-role="decor" d={`M${ch.x} ${Lf.bottom + 30}V${Lf.bottom + 104}H${ca.x}V${Lf.bottom + 30}`} stroke={T4.proteinEdge} strokeWidth={2.5} fill="none" opacity={fi(a('both'), 0.5)} />}
      <Cite x={1850} y={944} text={SCHEM + '; ' + PARTS} anchor="end" />
    </g>
  );
}
