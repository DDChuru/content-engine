/** Emulsion 1: the Beat 4 third row (emulsion test, cloudiness not a colour reaction); a scoped
 * solubility inset (this example's triglyceride: a droplet in water, dispersed among ethanol);
 * extinguish the Bunsen before the ethanol opens (flammable); electric bath preferred; a small
 * sample in a dry tube, ~2 cm³ ethanol, bung (no thumb), shake; solids settle; clear extract. */
import React from 'react';
import {BRAND as C, clamp01, rng} from '../../../shared/src/theme';
import {Txt, Tag, Card, Cite, Arrow} from '../../../shared/src/Type';
import {NamePill} from '../../../shared/src/Swatch';
import {Tube, Rack, Bottle, Bunsen, ElectricBath, Syringe, Hazard, Dropper} from '../Apparatus';
import {fi, fe, path, ramp, between, shake} from '../util';

export function Triglyceride({x, y, s = 1, rot = 0, color = '#D9A13B'}: any) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-6} y={-22} width={12} height={44} rx={4} fill={C.ink} />
      {[-16, 0, 16].map((dy) => <path key={dy} d={`M6 ${dy}l8-5l8 5l8-5l8 5l8-5`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />)}
    </g>
  );
}
const Water = ({x, y}: any) => <g><circle cx={x} cy={y} r={6} fill="#6FA7BC" /><circle cx={x - 7} cy={y + 5} r={3.5} fill="#FFFFFF" stroke="#6FA7BC" /><circle cx={x + 7} cy={y + 5} r={3.5} fill="#FFFFFF" stroke="#6FA7BC" /></g>;
const Eth = ({x, y}: any) => <g><rect x={x - 30} y={y - 11} width={60} height={22} rx={11} fill="#EFE7FA" stroke="#8A6BB8" strokeWidth={1.5} /><Txt x={x} y={y + 5} size={12} anchor="middle" weight={800} fill="#5B3F86">C₂H₅OH</Txt></g>;

export default function Beat11(s: any) {
  const {a, local} = s;
  const r = rng(5);
  const waterPts = Array.from({length: 22}, () => [r() * 330, r() * 190]);
  const r2 = rng(9);
  const ethPts = Array.from({length: 9}, () => [r2() * 300 + 15, r2() * 170 + 10]);
  const tgSpread = fe(a('dissolve') - 0.3, 1.8);
  const early = 1 - fi(a('L'), 0.6);
  const flame = 1 - fe(a('off'), 0.8);
  // procedure
  const L = a('L');
  const sampleLevel = ramp(L, [[1.0, 0], [2.2, 0.1]]);
  const e = a('eth');
  const [ex, ey] = path(e, [[0, 300, 500], [0.3, 300, 700], [0.8, 300, 700], [1.1, 300, 380], [1.6, 1300, 380], [1.85, 1300, 425]]);
  const eFill = ramp(e, [[0.3, 0], [0.8, 0.45], [1.85, 0.45], [2.3, 0]]);
  const level = sampleLevel + ramp(e, [[1.85, 0], [2.3, 0.2]]);
  const rot = shake(a('shake') - 0.5, 2.4, 12); // bung seated first (0.4 s), then shaken
  const settle = fe(a('settle'), 2.4);
  const parts = a('particles') > 0 || a('shake') > 1.2;
  const pr = rng(21);
  const grains = Array.from({length: 14}, () => [pr() * 46 - 23, pr()]);
  const liqTop = 420 + 320 - (320 - 6) * level;
  return (
    <g>
      {/* the Beat 4 third row */}
      <g opacity={fi(a('open'))}>
        <rect x={90} y={215} width={1760} height={80} rx={14} fill={C.white} stroke={fi(a('row3')) > 0 ? C.primary : C.line} strokeWidth={fi(a('row3')) > 0 ? 3.5 : 2} />
        <Txt x={116} y={265} size={24} weight={800}>emulsion test</Txt>
        <Txt x={330} y={265} size={24} weight={700}>ethanol, then water</Txt>
        <Arrow x1={600} y1={256} x2={640} y2={256} color={C.muted} width={3} head={9} />
        <NamePill x={660} y={265} k="cloudy" text="cloudy dispersion" anchor="start" size={20} model={false} />
        <Arrow x1={940} y1={256} x2={980} y2={256} color={C.muted} width={3} head={9} />
        <Txt x={1000} y={265} size={24} weight={800}>lipid</Txt>
        <Txt x={1110} y={265} size={21} weight={800} fill={C.primary} opacity={fi(a('row3'))}>readout: cloudiness, not a colour reaction</Txt>
      </g>
      {/* solubility inset (this example) */}
      <g opacity={fi(a('sol')) * early}>
        <Card x={940} y={320} w={910} h={430} />
        <Txt x={966} y={360} size={20} weight={800} fill={C.muted}>SOLUBILITY · MODEL (this example)</Txt>
        <rect x={966} y={380} width={390} height={250} rx={14} fill="#EAF4F8" stroke={C.line} />
        <Txt x={1161} y={410} size={20} anchor="middle" weight={800}>in water</Txt>
        {waterPts.map(([px, py], i) => <Water key={i} x={986 + px} y={426 + py} />)}
        <circle cx={1161} cy={530} r={52} fill="#F6E3B4" stroke="#D9A13B" strokeWidth={2} />
        {[0, 1, 2].map((i) => <Triglyceride key={i} x={1140 + (i % 2) * 18} y={505 + i * 22} s={0.7} rot={i * 20} />)}
        <Txt x={1161} y={618} size={17} anchor="middle" weight={700}>stays as a droplet</Txt>
        <rect x={1426} y={380} width={390} height={250} rx={14} fill="#F4EFFB" stroke={C.line} />
        <Txt x={1621} y={410} size={20} anchor="middle" weight={800}>in ethanol</Txt>
        {ethPts.map(([px, py], i) => <Eth key={i} x={1440 + px + 20} y={426 + py} />)}
        {[0, 1, 2].map((i) => <Triglyceride key={i} x={1600 + tgSpread * [-110, 40, 130][i] + (i % 2) * 18} y={505 + i * 22 + tgSpread * [-50, 50, -10][i]} s={0.7} rot={i * 20} />)}
        <Txt x={1621} y={618} size={17} anchor="middle" weight={700} opacity={tgSpread}>disperses among ethanol</Txt>
        <Txt x={1161} y={672} size={20} weight={800} fill={C.primary} opacity={fi(a('dissolve'))}>this example: far more soluble in ethanol than in water</Txt>
        <Txt x={1161} y={702} size={18} weight={700} fill={C.muted} opacity={fi(a('dissolve') - 0.8)}>solubility comparison, not a universal rule · icons not to scale</Txt>
      </g>
      {/* safety before the ethanol opens */}
      <g opacity={fi(a('before'))}>
        <g opacity={1 - fi(a('elec'), 0.6)}>
          <Bunsen x={640} y={760} flame={flame} s={1.25} />
          <Txt x={640} y={800} size={20} anchor="middle" weight={800}>Bunsen</Txt>
          <Tag x={640} y={560} text={flame < 0.05 ? 'extinguished' : 'turn it off'} size={21} anchor="middle" fill={C.primary} opacity={fi(a('off'))} />
        </g>
        <Bottle x={300} y={760} s={1.1} name="ethanol" k="clear" hazard="flammable" open={e > 0.1 && e < 1.3} glow={between(a('flam'), a('elec')) > 0.5} />
        <g opacity={fi(a('flam'))}>
          <Hazard x={300} y={835} s={0.8} kind="flammable" />
          <Txt x={340} y={843} size={20} weight={800} fill="#C8261E">flammable: no naked flames</Txt>
        </g>
      </g>
      <g opacity={fi(a('elec'), 0.6)}>
        <ElectricBath x={640} y={760} s={0.85} glow={a('L') < 0} />
        <Tag x={640} y={560} text="electric water bath: no flame" size={21} anchor="middle" fill={C.primary} />
      </g>
      {/* the procedure */}
      <g opacity={fi(L)}>
        <Rack x={1300} y={520} w={200} h={260} slots={1}>
          <Tube id="L11" x={1300} y={420} h={320} w={72} level={level} k={level > 0.02 ? 'clear' : undefined} label="L" pill={false} rot={rot} bung={fe(a('shake'), 0.4)} />
        </Rack>
        {parts && grains.map(([gx, gy], i) => {
          const y0 = liqTop + 20 + gy * (740 - liqTop - 40);
          const yy = y0 + (740 - 14 - y0) * settle;
          return <circle key={i} cx={1300 + gx * (1 - settle * 0.1)} cy={yy} r={4.5} fill="#8C6B4A" opacity={fi(a('particles') + 1.2)} />;
        })}
        <Txt x={1300} y={835} size={20} anchor="middle" weight={800}>dry tube · small amount of sample</Txt>
        <Tag x={1500} y={600} text="bung, not your thumb" size={20} opacity={fi(a('shake'))} />
        <Tag x={1500} y={660} text="shake well: extract the lipid" size={20} opacity={fi(a('shake') - 0.6)} />
        <Tag x={1500} y={720} text="solids settle" size={20} opacity={fi(a('settle'))} />
        <g opacity={fi(a('extract'))}>
          <path d={`M1262 ${liqTop + 30}H1190`} stroke={C.primary} strokeWidth={3} />
          <Tag x={1185} y={liqTop + 38} text="clear ethanolic extract" size={22} anchor="end" fill={C.white} bg={C.primary} stroke={C.primary} />
        </g>
      </g>
      {L > 0 && L < 3.4 && (() => {
        const [px, py] = path(L, [[0, 1080, 640], [0.9, 1300, 392], [2.3, 1300, 392], [3.2, 1080, 640]]);
        const dp = L > 1 && L < 2.2 ? ((L - 1) % 0.6) / 0.6 : 0;
        return <g opacity={Math.min(fi(L, 0.3), fi(3.4 - L, 0.3))}><Dropper x={px} y={py} s={0.7} squeeze={dp > 0 && dp < 0.4 ? 1 : 0} drop={dp} dropK="colourless" fall={(734 - 392) / 0.7 - 6} /><Tag x={px + 22} y={py - 100} text="sample" size={18} /></g>;
      })()}
      <g opacity={fi(e + 0.2) * (1 - fi(e - 2.35, 0.3))}>
        <Syringe x={ex} y={ey} s={0.85} fill={eFill} k="clear" />
        {eFill > 0.4 && <Tag x={ex + 40} y={ey - 170} text="≈ 2 cm³ ethanol" size={20} fill={C.primary} />}
      </g>
      <Cite x={950} y={902} size={18} opacity={fi(e)} text="ethanol: the amount your method specifies (about 2 cm³ here)" />
    </g>
  );
}
Beat11.pin = () => 'C';
