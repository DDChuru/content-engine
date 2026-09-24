/** Benedict's 1: eye protection (hazard at handling), label, measured 2 cm³ sample by syringe,
 * Benedict's in excess and why (qualitative Cu²⁺ cutaways), example volumes ≠ chemical excess,
 * volume vs concentration labels, mark-scheme tab, shake gently. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Lines, Card, Tag, Cite} from '../../../shared/src/Type';
import {Tube, Rack, Bottle, Syringe, Goggles, Hazard, MarkerPen} from '../Apparatus';
import {QuoteTab} from '../Panels';
import {Cutaway, CuIon, Sugar} from '../Molecules';
import {fi, fe, path, ramp, wobble, between} from '../util';

const TUBE = {x: 660, y: 470};
export default function Beat06(s: any) {
  const {a} = s;
  // syringe A: sample → tube
  const sa = a('sample');
  const [ax, ay] = path(sa, [[0, 420, 440], [0.6, 420, 610], [1.8, 420, 610], [2.4, 420, 400], [3.1, TUBE.x, 400], [3.6, TUBE.x, 505]]);
  const aFill = ramp(sa, [[0.6, 0], [1.8, 0.45], [3.6, 0.45], [4.4, 0]]);
  // syringe B: Benedict's → tube
  const sb = a('illus');
  const [bx, by] = path(sb, [[0, 200, 440], [0.6, 200, 600], [1.5, 200, 600], [2.1, 200, 400], [2.9, TUBE.x + 2, 400], [3.4, TUBE.x + 2, 505]]);
  const bFill = ramp(sb, [[0.6, 0], [1.5, 0.45], [3.4, 0.45], [4.2, 0]]);
  const level = ramp(sa, [[3.6, 0], [4.4, 0.2]]) + ramp(sb, [[3.4, 0], [4.2, 0.2]]);
  const blueT = ramp(sb, [[3.4, 0], [4.2, 1]]);
  const lab = a('label');
  const [mx, my] = path(lab, [[0, 820, 560], [0.6, TUBE.x - 22, 520], [1.4, TUBE.x + 18, 520], [1.9, 820, 600]]);
  const tubeRot = wobble(a('shake'), 6) + wobble(a('shake') - 0.9, 5);
  const cut = between(a('cu'), a('illus'));
  const late = fi(a('conc'));
  return (
    <g>
      {/* stage */}
      <Bottle x={200} y={660} s={1.05} name={"Benedict's\nsolution"} k="blue" hazard="harmful" glow={between(a('reagent'), a('cu')) > 0.5} open={sb > 0.2 && sb < 2.2} />
      <Bottle x={420} y={660} s={0.95} name="sample" k="colourless" open={sa > 0.2 && sa < 2.5} />
      {fi(a('excess')) > 0 && <Tag x={200} y={720} text="in excess" size={24} anchor="middle" fill={C.white} bg={C.primary} stroke={C.primary} opacity={fi(a('excess'))} />}
      <g opacity={late}>
        <Tag x={200} y={772} text="conc. as supplied" size={17} anchor="middle" />
        <Tag x={440} y={772} text="conc. as supplied" size={17} anchor="middle" />
      </g>
      <Rack x={TUBE.x} y={560} w={160} h={250} slots={1}>
        <Tube id="t6" x={TUBE.x} y={TUBE.y} h={300} w={66} level={level} k="colourless" to={blueT > 0 ? 'blue' : undefined} t={blueT}
          label={fi(lab - 0.9, 0.2) > 0.5 ? 'S' : undefined} rot={tubeRot} pill={level > 0.05} pillY={860} />
      </Rack>
      {lab > 0 && lab < 2.2 && <MarkerPen x={mx} y={my} s={0.8} rot={-35} />}
      <g opacity={fi(sa) * (1 - fi(sa - 4.6, 0.4))}>
        <Syringe x={ax} y={ay} s={0.85} fill={aFill} k="colourless" />
        {aFill > 0.4 && <Tag x={ax + 40} y={ay - 170} text="2 cm³" size={21} fill={C.primary} />}
        <Tag x={530} y={260} text="measure, do not guess" size={21} fill={C.primary} opacity={fi(sa - 1)} />
      </g>
      <g opacity={fi(sb) * (1 - fi(sb - 4.4, 0.4))}>
        <Syringe x={bx} y={by} s={0.85} fill={bFill} k="blue" />
        {bFill > 0.4 && <Tag x={bx + 40} y={by - 170} text="2 cm³" size={21} fill={C.primary} />}
      </g>
      {/* measured volumes after both additions */}
      <g opacity={fi(sb - 4.2)}>
        <Tag x={800} y={560} text="2 cm³ sample" size={19} />
        <Tag x={800} y={610} text="2 cm³ Benedict's" size={19} />
        <Lines x={96} y={912} size={19} weight={800} fill={C.primary} text="example volumes, not a guarantee of chemical excess" />
      </g>
      <g opacity={late}><Txt x={800} y={660} size={18} weight={700} fill={C.muted}>measured volumes</Txt></g>
      {/* eye protection at the moment of handling */}
      <g opacity={fi(a('goggles'))}>
        <Goggles x={880} y={290} s={0.75} glow={between(a('goggles'), a('label')) > 0.5} />
        <Txt x={880} y={350} size={18} anchor="middle" weight={700}>eye protection</Txt>
      </g>
      {/* right panel */}
      <g opacity={between(a('goggles'), a('cu'))}>
        <Card x={1000} y={230} w={840} h={210}>
          <Hazard x={1050} y={290} s={1.1} kind="harmful" />
          <Txt x={1100} y={300} size={28} weight={800}>Benedict's: harmful / irritant</Txt>
          <Cite x={1040} y={360} size={19} text={'9700/33 June 2021, Table 1.1; "If any solution comes into contact\nwith your skin, wash off immediately with cold water."'} />
        </Card>
      </g>
      <g opacity={cut}>
        <Txt x={1040} y={250} size={22} weight={800} fill={C.muted}>INSIDE THE TUBE · MODEL (qualitative)</Txt>
        <g opacity={fi(a('cu'))}>
          <CuIon x={1060} y={292} /><Txt x={1082} y={300} size={19} weight={700}>Cu²⁺ ion</Txt>
          <Sugar x={1240} y={292} /><Txt x={1262} y={300} size={19} weight={700}>reducing sugar</Txt>
          <Sugar x={1460} y={292} reacted={1} /><Txt x={1482} y={300} size={19} weight={700}>has reacted</Txt>
        </g>
        <Cutaway cx={1215} cy={520} R={150} nCu={5} nS={13} seed={7} p={fe(a('cutaway') - 0.6, 1.6)} opacity={fi(a('cutaway'))}
          title="too little reagent" tag="reagent used up" />
        <Txt x={1215} y={728} size={20} anchor="middle" weight={800} fill={C.primary} opacity={fi(a('cutaway') - 2)}>colour no longer reports the sample</Txt>
        <Cutaway cx={1625} cy={520} R={150} nCu={16} nS={5} seed={11} p={fe(a('cutaway2') - 0.4, 1.4)} opacity={fi(a('cutaway2'))}
          title="copper in excess" tag="all the sugar reacts" tagColor="#1D8A4E" />
        <Txt x={1625} y={728} size={20} anchor="middle" weight={800} fill="#1D8A4E" opacity={fi(a('cutaway2') - 1.8)}>colour reports the sample</Txt>
        <Txt x={1420} y={790} size={18} anchor="middle" weight={700} fill={C.muted} opacity={fi(a('cutaway2'))}>qualitative model: not a one-sugar : one-copper equation</Txt>
      </g>
      <g opacity={late}>
        <Card x={1000} y={240} w={840} h={250}>
          <Txt x={1030} y={286} size={22} weight={800} fill={C.muted}>TWO DIFFERENT LABELS</Txt>
          <Txt x={1030} y={346} size={27} weight={800}>measured volume</Txt>
          <Txt x={1030} y={386} size={22} weight={600}>2 cm³ · 2 cm³ (what you pour)</Txt>
          <Txt x={1470} y={346} size={27} weight={800}>concentration</Txt>
          <Txt x={1470} y={386} size={22} weight={600}>as supplied (what is in it)</Txt>
          <Lines x={1030} y={446} size={20} weight={700} fill={C.primary} text="chemical excess depends on the amounts, so on the concentrations" />
        </Card>
        <Tag x={1000} y={560} text="follow the supplied practical's amounts" size={24} fill={C.primary} opacity={fi(a('follow'))} />
        <QuoteTab x={1000} y={620} w={840} opacity={fi(a('ms'))} quote={'"equal volumes or greater volume of\nBenedict\'s solution than sample ;"'} source="9700/33 June 2021 Q1(a)(i) mark scheme" size={24} />
      </g>
      <Tag x={TUBE.x + 95} y={800} text="shake gently" size={21} fill={C.primary} opacity={fi(a('shake'))} />
    </g>
  );
}
Beat06.pin = () => 'C';
