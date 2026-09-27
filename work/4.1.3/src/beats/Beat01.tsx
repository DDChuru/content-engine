import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Magnifier, C, Txt, Cite, SCHEM, clamp01} from '../kit';
import {FluidMosaicMembrane, fmmLayout, compPos, plPos, FULL} from '../FluidMosaicMembrane';
import {WaterField} from '../WaterField';
import {O2Tok, IonTok} from '../T4Tokens';
import {LigandA} from '../ReceptorLigand';
import {PROT} from '../TransportProteinSet';

export const MG = {x: 1180, y: 600, r: 318, u: 26};
/** Beat 1 · Hook: a schematic cell with a magnifier on its edge; O₂ crosses the bilayer, a Na⁺ is turned back by the
 * core and then passes through a channel protein; the jobs of the membrane named over the same picture. */
export default function Beat01(s: any) {
  const t = gt(s), a = s.a, end = s.sc.duration - s.local, fade = fe(1.0 - end, 1.0);
  const {x: mx, y: my, r: mr, u} = MG, M = {cx: mx, cy: my, u, t, show: FULL};
  const Lf = fmmLayout(M);
  const gap = (i: number) => (plPos(M, i).x + plPos(M, i + 1).x) / 2;       // a gap between two outer-leaflet heads
  const ch = compPos(M, 'channel'), rc = compPos(M, 'receptor');
  const top = my - 4.2 * u, bot = my + 4.4 * u;
  // O₂ through the bilayer (≈1 s), a second one later
  const o2a = path(a('hook') - 1.0, [[0, gap(1), top], [1.1, gap(1), bot]]);
  const o2b = path(a('across'), [[0, gap(6), top], [1.1, gap(6), bot]]);
  // Na⁺: approaches, stalls where the tails begin, turns back; then drifts to the channel and passes down the pore
  const nx0 = gap(3), naT = a('na');
  let na = path(naT, [[0, nx0, top - 10], [0.7, nx0, Lf.outerHead + 0.7 * u], [1.5, nx0, top + 10]]);
  if (a('chan') >= 0) na = path(a('chan'), [[0, nx0, top + 10], [0.9, ch.x, my - PROT.H * u - 16], [2.1, ch.x, bot]]);
  const naOn = naT >= 0 && a('chan') < 2.3;
  const flex = 1 + 0.015 * Math.sin(t * 1.6) * fi(a('flex'), 0.5);
  const cellTint = fi(a('keep'), 0.6);
  const lig = fi(a('signal'), 0.5), chainG = pulse(a('recog'), 1.6);
  const J = ['glycolipid', 'cholesterol', 'intrinsic-channel', 'glycoprotein'];
  const jobs = a('jobs'), hlId = jobs >= 0 && jobs < 5 ? (jobs < 1 ? null : J[Math.min(3, Math.floor(jobs - 1))]) : null;
  const plPulse = jobs >= 0 && jobs < 1 ? pulse(jobs, 1) : 0;
  return (
    <g opacity={1 - 0.6 * fade}>
      <defs><clipPath id="m13b1"><circle cx={mx} cy={my} r={mr - 2} /></clipPath></defs>
      {/* the cell (schematic, no organelles) */}
      <g data-role="drawing" transform={`translate(${340} ${560}) scale(${flex} ${2 - flex}) translate(${-340} ${-560})`}>
        <path d="M340 290C470 290 560 400 560 560C560 720 470 830 340 830C210 830 120 720 120 560C120 400 210 290 340 290Z" fill={cellTint > 0 ? '#EFE7F3' : '#F7F2F8'} stroke="#7A5C8E" strokeWidth={4} />
      </g>
      <Txt x={340} y={870} size={20} weight={700} anchor="middle" fill={C.muted}>a cell (schematic)</Txt>
      <Magnifier x={mx} y={my} r={mr} lx={558} ly={560}>
        <g clipPath="url(#m13b1)">
          <rect data-role="decor" x={mx - mr} y={my - mr} width={2 * mr} height={mr} fill="#EAF3FA" />
          <rect data-role="decor" x={mx - mr} y={my} width={2 * mr} height={mr} fill="#F4EEF2" opacity={0.6 + 0.4 * cellTint} />
          <WaterField regions={[[mx - mr, my - mr, mx + mr, Lf.top - 60], [mx - mr, Lf.bottom + 30, mx + mr, my + mr]]} n={[26, 22]} t={t} r={5} />
          {chainG > 0 && <rect data-role="decor" x={mx - mr} y={Lf.top - 64} width={2 * mr} height={56} fill="#E3F2DC" opacity={chainG} />}
          {plPulse > 0 && <rect data-role="decor" x={mx - mr} y={Lf.outerHead - 14} width={2 * mr} height={Lf.innerHead - Lf.outerHead + 28} fill="#FFF3C4" opacity={plPulse} />}
          <FluidMosaicMembrane {...M} highlight={hlId} hl={hlId ? 1 : 0} drift={1 + 1.5 * fi(a('flex'), 0.5) * (1 - fi(a('signal'), 0.6))} />
          {a('hook') >= 1.0 && a('hook') < 2.2 && <O2Tok x={o2a[0]} y={o2a[1]} r={7} />}
          {a('across') >= 0 && a('across') < 1.2 && <O2Tok x={o2b[0]} y={o2b[1]} r={7} />}
          {naOn && <IonTok x={na[0]} y={na[1]} r={9} />}
          {lig > 0 && <LigandA x={rc.x + 60 + 10 * Math.sin(t)} y={Lf.top - 150 + 8 * Math.cos(t * 1.3)} u={u} opacity={lig} />}
        </g>
      </Magnifier>
      <Txt x={mx - 130} y={my - mr + 66} size={19} weight={700} fill={C.teal}>outside the cell (watery)</Txt>
      <Txt x={mx - 90} y={my + mr - 36} size={19} weight={700} fill={C.teal}>cytoplasm (watery)</Txt>
      <Cite x={mx} y={my + mr + 34} text={SCHEM} anchor="middle" />
      <Txt x={960} y={246} size={29} weight={700} anchor="middle" opacity={fi(a('hook'), 0.5)}>Ever wondered why oxygen slips straight through, while a sodium ion is turned back?</Txt>
    </g>
  );
}
