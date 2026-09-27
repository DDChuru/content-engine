import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Bracket, Stage3, RoleGrid, Regions3, turnBack, gridFill, L3, C, Txt, Cite, SCHEM, PARTS, clamp01} from '../kit';
import {fmmLayout, compPos, plPos, FULL} from '../FluidMosaicMembrane';
import {PROT, roundRect, channelPass} from '../TransportProteinSet';
import {IonTok} from '../T4Tokens';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';

/** Beat 5 · Proteins × transport: channel proteins. A Na⁺ is turned back by the core, then passes down the
 * channel's water-filled pore (channel-open, ~1.2 s); the channel never changes shape (ghost outline matches). */
export default function Beat05(s: any) {
  const t = gt(s), a = s.a, {cx, cy, u} = L3, M = {cx, cy, u, t, show: FULL};
  const Lf = fmmLayout(M), ch = compPos(M, 'channel');
  const H = PROT.H * u, W = PROT.W * u / 2, mouth = cy - H - 14;
  const hover = [ch.x + 2.6 * u, Lf.top - 1.3 * u];
  // token 1: hover → turn back beside the channel → drift to the mouth → down the pore
  let n1: number[] = hover;
  if (a('reach') >= 0) n1 = turnBack(a('reach') - 0.2, hover[0], hover[1], Lf.outerHead + 0.55 * u);
  if (a('chan') >= 0) n1 = path(a('chan'), [[0, hover[0], hover[1]], [1.2, ch.x, mouth - 0.6 * u]]);
  if (a('pass') >= 0) { const p = channelPass(a('pass'), 1.2, 0, 1); n1 = [ch.x, (mouth - 0.6 * u) + ((cy + H + 1.2 * u) - (mouth - 0.6 * u)) * p.ty]; }
  const n1on = a('pass') < 1.6;
  const n2 = a('particular') >= 0 ? path(a('particular') - 0.3, [[0, ch.x + 1.2 * u, Lf.top - 1.6 * u], [0.6, ch.x, mouth - 0.4 * u], [1.8, ch.x, cy + H + 1.2 * u]]) : null;
  const hl = fe(a('role'), 0.5) * (1 - fe(a('shape') - 2.6, 0.6));
  const lining = pulse(a('lining'), 1.4), pore = fi(a('pore'), 0.4);
  const ghost = fe(a('shape'), 0.6);
  const p3 = plPos(M, 3), p4 = plPos(M, 4);
  return (
    <g>
      <Stage3 s={s} mem={{highlight: hl > 0 ? 'intrinsic-channel' : null, hl, poreWater: pore > 0}} />
      <Regions3 />
      <RoleGrid t={t} fill={gridFill(s)} rowLit={{proteins: fi(a('role'), 0.4)}} colLit={{transport: fi(a('role'), 0.4)}} />
      {lining > 0 && <rect data-role="decor" x={ch.x - 0.23 * u - 5} y={cy - H} width={0.46 * u + 10} height={2 * H} rx={6} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={lining} />}
      {n1on && <IonTok x={n1[0]} y={n1[1]} r={9} />}
      {n2 && a('particular') < 2.2 && <IonTok x={n2[0]} y={n2[1]} r={9} />}
      <InkRing cx={hover[0]} cy={hover[1]} rx={26} ry={26} p={fe(a('open'), 0.5)} opacity={1 - fe(a('reach'), 0.4)} />
      <Lbl x={ch.x - 60} y={cy - H - 60} text="channel protein" anchor="end" o={fi(a('chan'), 0.4)} size={24} lx={ch.x - W} ly={cy - H + 10} />
      <Bracket x={ch.x + W + 12} y0={cy - H} y1={cy + H} side={-1} o={fi(a('span'), 0.4)} color={C.teal} />
      <Txt x={ch.x - 60} y={Lf.bottom + 60} size={17} weight={600} fill={C.muted} italic opacity={fi(a('span'), 0.5) * (1 - fe(a('pore'), 0.4))}>intrinsic proteins are embedded in the bilayer; this channel spans it (a transmembrane protein)</Txt>
      <Lbl x={ch.x - 60} y={Lf.bottom + 60} text="hydrophilic pore (water-filled)" o={pore} size={22} fill={T4.proteinEdge} lx={ch.x} ly={cy + 0.4 * u} />
      <Pill x={ch.x + 1.3 * u} y={Lf.bottom + 104} text="process: 4.2.1" o={fi(a('pass'), 0.4)} />
      {[p3, p4].map((p, i) => <InkRing key={i} cx={p.x} cy={cy} rx={0.6 * u} ry={1.5 * u} p={fe(a('untouched') - i * 0.2, 0.5)} opacity={1 - fe(a('untouched') - 1.8, 0.5)} color={C.teal} />)}
      {/* a second, different channel (inset) */}
      {fi(a('different'), 0.5) > 0 && <g opacity={fi(a('different'), 0.5)}>
        <rect data-role="decor" x={96} y={690} width={330} height={210} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <g data-role="drawing">
          <rect x={206} y={726} width={110} height={10} rx={3} fill={T4.head} opacity={0.6} /><rect x={206} y={836} width={110} height={10} rx={3} fill={T4.head} opacity={0.6} />
          <path d={roundRect(236, 712, 256, 860, 8)} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} />
          <path d={roundRect(266, 712, 286, 860, 8)} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2} />
          <rect x={256} y={716} width={10} height={140} fill="#E4F3FA" />
          {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M256 ${730 + k * 28}L262 ${736 + k * 28}L256 ${742 + k * 28}Z`} fill="#FFFFFF" stroke={T4.proteinEdge} strokeWidth={1} />)}
        </g>
        <Txt x={110} y={884} size={15} weight={700} fill={C.muted}>particular ions or polar molecules for each channel</Txt>
      </g>}
      {ghost > 0 && <g opacity={ghost}>
        <path data-role="decor" d={roundRect(ch.x - W, cy - H, ch.x - PROT.poreW * u / 2, cy + H, 0.32 * u) + roundRect(ch.x + PROT.poreW * u / 2, cy - H, ch.x + W, cy + H, 0.32 * u)} fill="none" stroke={C.primary} strokeWidth={3} strokeDasharray="8 6" />
        <Pill x={ch.x + W + 30} y={cy - H - 20} text="no change of shape" fill={C.primary} />
      </g>}
      <Cite x={1040} y={930} text={SCHEM + '; ' + PARTS} anchor="end" />
    </g>
  );
}
