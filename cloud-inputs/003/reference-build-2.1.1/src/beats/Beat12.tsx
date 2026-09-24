/** Emulsion 2: clear extract poured into about the same volume of water and shaken; cutaway: ethanol
 * mixes into the water, dissolved lipid comes out as tiny droplets → cloudy white emulsion (positive);
 * clear = negative under these conditions; an ethanol + water blank; WRONG METHOD inset (water first),
 * ending on the credited order, quoted from 9700/12 June 2023 Q7 key D. */
import React from 'react';
import {BRAND as C, clamp01, rng, lerp} from '../../../shared/src/theme';
import {Txt, Tag, Card, Arrow, Lines} from '../../../shared/src/Type';
import {Swatch} from '../../../shared/src/Swatch';
import {WrongInset} from '../../../shared/src/ErrorMarker';
import {Tube, Rack, Stream, tubeLip, tubeByLip} from '../Apparatus';
import {COIStack, QuoteTab} from '../Panels';
import {Triglyceride} from './Beat11';
import {fi, fe, path, ramp, between, shake} from '../util';

const Eth = ({x, y, o = 1}: any) => <g opacity={o}><rect x={x - 26} y={y - 10} width={52} height={20} rx={10} fill="#EFE7FA" stroke="#8A6BB8" strokeWidth={1.5} /><Txt x={x} y={y + 5} size={11} anchor="middle" weight={800} fill="#5B3F86">C₂H₅OH</Txt></g>;
const Water = ({x, y}: any) => <g><circle cx={x} cy={y} r={6} fill="#6FA7BC" /><circle cx={x - 7} cy={y + 5} r={3.5} fill="#FFFFFF" stroke="#6FA7BC" /><circle cx={x + 7} cy={y + 5} r={3.5} fill="#FFFFFF" stroke="#6FA7BC" /></g>;

export default function Beat12(s: any) {
  const {a} = s;
  const p = a('pour');
  // THE POUR (VIDEO-STRUCTURE "Handling must be physically possible"): L tilts to 120° so its mouth is
  // below its base; the stream leaves L's computed lip and lands inside E's mouth, on E's surface.
  const LH = 260, LW = 60, TILT = 120;
  const [ex, ey] = tubeByLip(393, 378, LH, LW, TILT);
  const pivA = [230, 400 + LH * 0.55], pivB = [ex, ey + LH * 0.55];
  const go = fe(p, 0.9), back = fe(p - 2.4, 0.55);
  const tilt = TILT * go * (1 - back);
  const pv = [pivA[0] + (pivB[0] - pivA[0]) * go * (1 - back), pivA[1] + (pivB[1] - pivA[1]) * go * (1 - back)];
  const lx = pv[0], ly = pv[1] - LH * 0.55;
  const lLevel = ramp(p, [[0.8, 0.3], [2.3, 0]]);
  const wLevel = ramp(p, [[0.8, 0.22], [2.3, 0.44]]);
  const flowing = p > 0.8 && p < 2.3;
  const lip = tubeLip(lx, ly, LH, LW, tilt);
  const eSurf = 400 + 300 - 294 * wLevel;
  const lGone = fi(p - 2.95, 0.35);
  const rot = shake(a('shake') - 0.5, 2.2, 12);
  const cloudT = fe(a('cloudy'), 1.2);
  const early = 1 - fi(a('xinset'), 0.4);
  const inset = between(a('xinset'), a('order'), 0.4);
  const r = rng(12);
  const water = Array.from({length: 26}, () => [r() * 360 - 180, r() * 220 - 110]);
  const r2 = rng(4);
  const eth = Array.from({length: 8}, () => [r2() * 120 - 60, r2() * 80 - 40, r2() * 300 - 150, r2() * 200 - 100]);
  const mix = fe(a('mix'), 1.6), dr = fe(a('drops'), 1.6);
  const tgs = [[-40, -20, -120, -60], [30, 10, -110, -40], [0, 40, 60, 50], [-60, 30, 80, 70], [50, -40, 110, -50], [10, -60, 130, -30]];
  return (
    <g>
      {/* tubes */}
      <Rack x={500} y={500} w={720} h={260} slots={4}>
        <Tube id="W12" x={400} y={400} h={300} w={66} level={wLevel} k="clear" to={cloudT > 0 ? 'cloudy' : undefined} t={cloudT} label="E" rot={rot} bung={fe(a('shake'), 0.4)} pillY={800} pill={wLevel > 0.3} />
        <Tube id="N12" x={590} y={400} h={300} w={66} level={0.44} k="clear" label="N" opacity={fi(a('neg'))} pillY={800} />
        <Tube id="B12" x={760} y={400} h={300} w={66} level={0.44} k="clear" label="blank" opacity={fi(a('blank'))} pillY={800} />
      </Rack>
      {lGone < 1 && <g opacity={1 - lGone}><Tube id="L12" x={lx} y={ly} h={LH} w={LW} level={lLevel} k="clear" label="L" rot={tilt} pill={false} /></g>}
      {flowing && <Stream x1={lip[0]} y1={lip[1]} x2={lip[0] + 4} y2={eSurf} opacity={Math.min(fi(p - 0.8, 0.12), fi(2.3 - p, 0.12))} width={7} />}
      <Tag x={180} y={330} text="clear extract" size={19} anchor="middle" opacity={between(p + 0.4, p - 2.8)} />
      <Tag x={400} y={880} text="into water · about the same volume" size={19} anchor="middle" opacity={between(p - 0.8, a('neg'))} />
      <Tag x={590} y={880} text="negative, these conditions" size={18} anchor="middle" opacity={fi(a('neg') - 0.4)} />
      <Tag x={760} y={372} text="blank: ethanol + water" size={18} anchor="middle" opacity={fi(a('blank') - 0.3)} />
      <Tag x={760} y={922} text="blank shows any reagent haze" size={18} anchor="middle" opacity={fi(a('haze'))} />
      <Tag x={400} y={372} text="shake again" size={19} anchor="middle" opacity={between(a('shake'), a('mix') + 1)} />
      {/* cutaway: inside the tube */}
      <g opacity={fi(a('mix')) * early}>
        <Card x={950} y={220} w={900} h={330} />
        <Txt x={976} y={258} size={20} weight={800} fill={C.muted}>INSIDE THE TUBE · MODEL (icons not to scale)</Txt>
        <clipPath id="cut12"><circle cx={1180} cy={395} r={135} /></clipPath>
        <circle cx={1180} cy={395} r={135} fill="#EAF4F8" stroke={C.ink} strokeWidth={3} />
        <g clipPath="url(#cut12)">
          {water.map(([x, y], i) => <Water key={i} x={1180 + x} y={395 + y} />)}
          {eth.map(([x0, y0, x1, y1], i) => <Eth key={i} x={1180 + lerp(x0, x1, mix)} y={395 + lerp(y0, y1, mix)} />)}
          {tgs.map(([x0, y0, x1, y1], i) => {
            const cx = [-70, -70, 50, 50, 70, 70][i], cy = [-40, -40, 40, 40, -45, -45][i];
            const tx = lerp(lerp(x0, x1, mix), cx + (i % 2) * 14, dr), ty = lerp(lerp(y0, y1, mix), cy + (i % 2) * 10, dr);
            return <Triglyceride key={i} x={1180 + tx} y={395 + ty} s={0.55} rot={i * 30} />;
          })}
          {[[-63, -35], [57, 45], [77, -40]].map(([x, y], i) => <circle key={i} cx={1180 + x} cy={395 + y} r={30} fill="none" stroke="#D9A13B" strokeWidth={3} opacity={dr} />)}
        </g>
        <Lines x={1340} y={320} size={21} step={30} weight={700} text={'ethanol mixes into\nthe water'} />
        <g opacity={fi(a('drops'))}><Lines x={1340} y={420} size={21} step={30} weight={800} fill="#B07A12" text={'lipid comes out of\nsolution as tiny droplets'} /></g>
        <Triglyceride x={1350} y={512} s={0.5} /><Txt x={1380} y={519} size={17} weight={700}>triglyceride (lipid)</Txt>
        <Eth x={1600} y={512} /><Txt x={1634} y={519} size={17} weight={700}>ethanol</Txt>
        <Water x={1730} y={510} /><Txt x={1745} y={519} size={17} weight={700}>water</Txt>
      </g>
      <g opacity={fi(a('cloudy')) * early}>
        <COIStack x={950} y={570} w={900} cond="ethanol extract → water, shaken" obs="cloudy white emulsion" obsK="cloudy" inf="lipid present" o={fi(a('cloudy') - 0.4)} i={fi(a('pos'))} hiInf={between(a('pos'), a('neg')) > 0.5} />
        <Txt x={956} y={800} size={17} weight={700} fill={C.muted}>{'9700/33 June 2021 Q1(b)(i) MS: "add ethanol and water to sample (and shake) ;"'}</Txt>
        <Txt x={956} y={824} size={17} weight={700} fill={C.muted}>{'"observation: white layer of emulsion ;"'}</Txt>
        <Txt x={956} y={852} size={16} weight={700} fill={C.muted}>Photograph: no licensed asset identified; labelled models shown, never recoloured.</Txt>
      </g>
      {/* WRONG METHOD: water first */}
      <WrongInset x={950} y={220} w={900} h={430} opacity={inset}>
        <Rack x={1200} y={430} w={160} h={170} slots={1}>
          <Tube id="X12" x={1200} y={330} h={250} w={62} level={0.42} k="clear" label="L" pill={false} bung={fe(a('xinset') - 0.4, 0.4)} rot={shake(a('xinset') - 1, 1.6, 10)} />
        </Rack>
        <Txt x={1320} y={340} size={22} weight={800}>water added to the sample first</Txt>
        <Txt x={1320} y={372} size={22} weight={800}>then shaken: tube stays clear</Txt>
      </WrongInset>
      <g opacity={inset}>
        <Tag x={1320} y={460} text="can prevent effective extraction" size={21} fill={C.primary} />
        <Tag x={1320} y={520} text="not the prescribed method" size={21} fill={C.primary} />
      </g>
      {/* the credited order */}
      <g opacity={fi(a('order'))}>
        {['ethanol to the\nsample, shake', 'into water,\nshake again', 'cloudy =\nlipid'].map((t, i) => {
          const hi = (i === 1 && a('step2') > 0 && a('final') < 0) || (i === 2 && a('final') > 0);
          return (
            <g key={t} opacity={fi(a('order') - i * 0.4)}>
              <rect x={950 + i * 305} y={240} width={285} height={96} rx={16} fill={hi ? C.primary : C.white} stroke={hi ? C.primary : C.line} strokeWidth={2} />
              <Txt x={972 + i * 305} y={280} size={26} weight={800} fill={hi ? C.white : C.primary}>{i + 1}</Txt>
              <Lines x={1005 + i * 305} y={280} size={20} step={26} weight={800} fill={hi ? C.white : C.ink} text={t} />
            </g>
          );
        })}
        <Txt x={950} y={372} size={20} weight={800} fill="#1D8A4E">✓ the credited order</Txt>
      </g>
      <QuoteTab x={950} y={400} w={900} opacity={fi(a('cite'))} size={21}
        quote={'"Add 2 cm³ of ethanol to the sample and shake. Pour the ethanol into a\ntest-tube containing 2 cm³ of water and shake again. Lipids are\npresent if the mixture becomes cloudy."'}
        source="9700/12 June 2023 Q7, key D" />
    </g>
  );
}
Beat12.pin = (s: any) => (s.a('pos') > 0 && s.a('xinset') < 0 ? 'I' : s.a('cloudy') > 0 && s.a('xinset') < 0 ? 'O' : 'C');
