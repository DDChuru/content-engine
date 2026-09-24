/** Beat 7 · What Km tells you. Two schematic enzymes, A (steep, plateau reached quickly) and B (slow rise), each
 * with its OWN vmax-line and half-line (different maxima: no shared horizontal). Handle → creditworthy sentence. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Lines, Card} from '../shared/Type';
import {fi, fe, between} from '../util';
import {Axes, CurvePath, VmaxLine, HalfLine, KmDrop, G, gx, gy} from '../RateGraph';
import {Small} from './common';

const g: G = {x: 250, y: 270, w: 800, h: 500, xmax: 240, ymax: 10};
const A = {id: 'enzyme-A', vmax: 7, km: 12, color: C.curveC};
const B = {id: 'enzyme-B', vmax: 9, km: 48, color: C.curveB};
const pulse = (t: number) => (t > 0 && t < 1.6 ? 0.5 + 0.5 * Math.sin(t * 8) : 0);
export default function Beat07(s: any) {
  const {a} = s;
  const two = clamp01(a('two') / 1.2);
  return (
    <g>
      <Axes g={g} xLabel="substrate concentration / mmol dm⁻³" yLabel="initial rate / arbitrary units" />
      <Small x={g.x + g.w} y={g.y - 16} text="our schematic; no values asserted" anchor="end" />
      <CurvePath g={g} c={A} p={two} color={A.color} />
      <CurvePath g={g} c={B} p={two} color={B.color} />
      <Txt x={gx(g, 130)} y={gy(g, A.vmax) + 36} size={24} weight={800} fill={A.color} opacity={fi(a('two') - 0.8)}>enzyme A</Txt>
      <Txt x={gx(g, 170)} y={gy(g, B.vmax) - 16} size={24} weight={800} fill={B.color} opacity={fi(a('two') - 0.8)}>enzyme B</Txt>
      <VmaxLine g={g} c={A} p={clamp01((a('two') - 1) / 0.8)} color={A.color} label="Vmax A" size={20} />
      <VmaxLine g={g} c={B} p={clamp01((a('two') - 1.2) / 0.8)} color={B.color} label="Vmax B" size={20} />
      <HalfLine g={g} c={A} p={clamp01((a('two') - 1.6) / 0.6)} color={A.color} label="½Vmax A" size={20} noLabel />
      <HalfLine g={g} c={B} p={clamp01((a('two') - 1.8) / 0.6)} color={B.color} label="½Vmax B" size={20} noLabel />
      <KmDrop g={g} c={A} p={clamp01(a('a') / 0.8)} color={A.color} label="Km small" size={24} pulse={pulse(a('asmall'))} labelDx={-6} anchor="end" />
      <KmDrop g={g} c={B} p={clamp01(a('b') / 0.8)} color={B.color} label="Km large" size={24} pulse={pulse(a('blarge'))} />
      <Small x={g.x + g.w} y={gy(g, 1.6)} text="each curve: its own Vmax, its own ½Vmax" anchor="end" opacity={fi(a('two') - 2.2)} />
      {/* the handle, then the sentence */}
      <g opacity={fi(a('handle'))} transform={`translate(${(1 - fe(a('handle'), 0.5)) * 40} 0)`}>
        <rect x={1200} y={280} width={650} height={130} rx={65} fill="#FDEEE7" stroke={C.accent} strokeWidth={3} />
        <Txt x={1525} y={334} size={30} weight={800} fill={C.primary} anchor="middle">the eager enzyme:</Txt>
        <Txt x={1525} y={376} size={26} weight={700} fill={C.ink} anchor="middle">half speed on very little substrate</Txt>
        <Small x={1525} y={440} text="a picture to remember it by, not the exam answer" anchor="middle" />
      </g>
      <Card x={1200} y={480} w={650} h={250} opacity={fi(a('proper'))} stroke={C.good} fill="#F2FAF5">
        <rect x={1200} y={480} width={10} height={250} rx={5} fill={C.good} />
        <Txt x={1232} y={520} size={19} weight={800} fill={C.good}>WRITTEN PROPERLY</Txt>
        <Lines x={1232} y={566} size={29} step={38} weight={800} text={'a lower Km means a higher affinity\nof the enzyme for its substrate'} />
        <Lines x={1232} y={660} size={25} step={34} weight={700} opacity={fi(a('proper2'))} text={'a higher Km means a lower affinity'} />
      </Card>
      <g opacity={fi(a('syl'))}>
        <Txt x={1200} y={780} size={20} weight={700} fill={C.ink}>"used to compare the affinity of different enzymes for their substrates"</Txt>
        <Small x={1200} y={806} text="syllabus 3.2.2, p.20" />
        <Txt x={1200} y={848} size={20} weight={700} fill={C.ink}>"a lower Km corresponded to a higher affinity for the substrate"</Txt>
        <Small x={1200} y={874} text="June 2024 examiner report p.4" />
      </g>
    </g>
  );
}
