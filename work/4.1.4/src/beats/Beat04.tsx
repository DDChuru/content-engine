import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Scene, SS, C, Txt, Cite, SCHEM, clamp01} from '../kit';
import {Body} from './Beat01';
import {InkRing} from '../../shared/src/Type';

/** Beat 4 · Stage two, transport: insulin enters a nearby capillary; blood carries the signal widely; it reaches cells
 * through tissue fluid (motion). A separate labelled inset shows a short-range signal (not insulin). */
export default function Beat04(s: any) {
  const t = gt(s), a = s.a, z = 1.3 - 0.3 * fe(a('open'), 1.2);
  const V = SS.vessel;
  const shortIn = fi(a('short'), 0.5) * (1 - fe(a('blood'), 0.6));
  const cells = [[SS.muscle.x, SS.muscle.y, 330, 90], [SS.liver.x, SS.liver.y, 130, 130], [SS.other.x, SS.other.y, 100, 100]];
  const sq = (k: number) => { const u = ((a('diffuse') + 3 + k * 0.7) % 2.4) / 2.4; return [245 + 150 * u, 820 - 10 * Math.sin(u * 6 + k)]; };
  return (
    <g>
      <Scene z={z} zx={380} zy={232} t={t} labelOf={{response: fi(a('open') - 1.1, 0.3), schematic: fi(a('open') - 1.1, 0.3)}} secrete={99} enter={a('enter')} carry={a('carry')} out={a('out')} stage={{secretion: 0.4, transport: fi(a('open'), 0.4)}} labels={{beta: 1, capillary: fi(a('enter'), 0.4)}} vesselPulse={pulse(a('blood'), 1.4)} />
      <Txt x={V.x0 - 12} y={316} size={20} weight={700} fill="#8E2A24" anchor="end" opacity={fi(a('enter'), 0.4)}>blood flow ↓</Txt>
      <Txt x={V.x1 + 12} y={290} size={20} weight={600} fill={C.muted} italic opacity={fi(a('enter'), 0.4) * (1 - fi(a('bathe') + 0.3, 0.3))}>entry into the capillary not detailed</Txt>
      {fi(a('carry'), 0.5) > 0 && <g opacity={fi(a('carry'), 0.5) * (1 - fe(a('short'), 0.5))}>
        <rect data-role="decor" x={1620} y={590} width={220} height={300} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <Body x={1636} y={556} sc={0.34} t={t} wedges={1} />
        <Txt x={1730} y={884} size={20} weight={700} fill={C.muted} anchor="middle">carried widely</Txt>
      </g>}
      {fi(a('bathe'), 0.4) > 0 && <rect data-role="decor" x={972} y={256} width={864} height={668} rx={24} fill="none" stroke="#8A6414" strokeWidth={4} strokeDasharray="10 7" opacity={fi(a('bathe'), 0.4) * (1 - fe(a('kinds'), 0.6))} />}
      <Lbl x={1040} y={745} text="tissue fluid" o={fi(a('out'), 0.4)} size={22} fill="#8A6414" />
      {cells.map((c, i) => <InkRing key={i} cx={c[0]} cy={c[1]} rx={c[2]} ry={c[3]} p={fe(a('kinds') - i * 0.4, 0.5)} opacity={1 - fe(a('short'), 0.5)} color={C.teal} />)}
      {shortIn > 0 && <g opacity={shortIn}>
        <rect data-role="decor" x={110} y={700} width={420} height={210} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <rect data-role="decor" x={120} y={710} width={400} height={190} rx={10} fill="#F6EBC8" opacity={0.8} />
        <g data-role="drawing">
          <ellipse cx={200} cy={820} rx={62} ry={44} fill="#F7F2F8" stroke="#6B5B7B" strokeWidth={3} />
          <ellipse cx={450} cy={820} rx={62} ry={44} fill="#F7F2F8" stroke="#6B5B7B" strokeWidth={3} />
          {a('diffuse') > -3 && [0, 1, 2].map((k) => { const p = sq(k); return <rect key={k} x={p[0] - 7} y={p[1] - 7} width={14} height={14} rx={2} fill="#C2378E" stroke="#7D1F5A" strokeWidth={1.5} />; })}
        </g>
        <Txt x={320} y={736} size={20} weight={700} fill={C.muted} anchor="middle">short-range signal (schematic); not insulin</Txt>
        {fi(a('diffuse'), 0.4) > 0 && <path data-role="decor" d="M262 875V885H388V875" stroke={C.ink} strokeWidth={2} fill="none" opacity={fi(a('diffuse'), 0.4)} />}
        <Txt x={325} y={902} size={20} weight={700} fill={C.ink} anchor="middle" opacity={fi(a('diffuse'), 0.4)}>diffusion through tissue fluid</Txt>
      </g>}
      <Pill x={V.x0 - 12} y={600} text="insulin: carried by blood" anchor="end" o={fi(a('blood'), 0.4)} fill="#A63A33" />
      <Txt x={392} y={912} size={20} weight={600} fill={C.muted} italic anchor="middle" opacity={fi(a('carry'), 0.4) * clamp01(1 - 3 * shortIn)}>blood carries the signal widely around the body;</Txt>
      <Txt x={392} y={936} size={20} weight={600} fill={C.muted} italic anchor="middle" opacity={fi(a('carry'), 0.4) * clamp01(1 - 3 * shortIn)}>it can then reach cells through tissue fluid</Txt>
    </g>
  );
}
