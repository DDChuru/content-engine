/** E01 · five moves. Badge EXAM CONTRAST (the June 2023 ER records candidates CORRECTLY naming colour
 * subjectivity; the MS accepts an estimate from the candidate's results; the wrong answer is our
 * illustration — nothing diagnoses "exactly 2.1%" as a candidate error). The wrong answer is WRITTEN,
 * never voiced. Marker from the first frame through the talk-through; it clears on the first frame on
 * which the in-place replacement is complete (Lesson.tsx: correct cue frame + 18). */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Card, Lines, InkRing, Arrow} from '../../../shared/src/Type';
import {NamePill, SwatchKey} from '../../../shared/src/Swatch';
import {fi, fe, between} from '../util';

const STD: [string, SwatchKey][] = [['5.0 %', 'darkpurple'], ['2.5 %', 'purple'], ['1.25 %', 'purple'], ['0.625 %', 'lightpurple'], ['0.3125 %', 'blue']];
const rowY = (i: number) => 340 + i * 64;
const QUOTE = '"Some candidates correctly stated that a significant source of error in\nthe investigation was the difficulty of identifying the colour of the\nprotein solution and the improvement was to use a colorimeter."';

export default function Beat17(s: any) {
  const {a, k, at} = s;
  const corrK = Math.ceil(at.correct * 30 - 1e-9);
  const cf = k - corrK; // frames since the correction cue
  const strike = clamp01(cf / 9);
  const repl = clamp01((cf - 9) / 9);
  const corrected = cf >= 18;
  const talk = a('ring') > 0;
  return (
    <g>
      {/* context: the standards, before the wrong answer is revealed */}
      <g opacity={fi(a('standards'))}>
        <Card x={90} y={214} w={800} h={590} />
        <Txt x={116} y={250} size={20} weight={800} fill={C.muted}>BIURET STANDARDS · adapted from 9700/34 June 2023</Txt>
        <Txt x={116} y={292} size={19} weight={800} fill={C.muted}>protein concentration</Txt>
        <Txt x={400} y={292} size={19} weight={800} fill={C.muted}>colour (MODEL, ring code)</Txt>
        {STD.map(([c, sk], i) => {
          const hi = (i === 1 || i === 2) && a('hl') > 0;
          return (
            <g key={c} opacity={fi(a('standards') - i * 0.35, 0.3)}>
              {hi && <rect x={104} y={rowY(i) - 34} width={250} height={48} rx={10} fill="none" stroke={C.primary} strokeWidth={3.5} />}
              <Txt x={120} y={rowY(i)} size={30} weight={800} fill={hi ? C.primary : C.ink}>{c}</Txt>
              <NamePill x={400} y={rowY(i)} k={sk} anchor="start" size={21} />
            </g>
          );
        })}
        {/* the unknown */}
        <g opacity={fi(a('unknown'))}>
          <path d="M104 686H876" stroke={C.line} strokeWidth={2} />
          <Txt x={120} y={740} size={30} weight={800}>U</Txt>
          {a('show') > 0 ? <NamePill x={400} y={740} k="purple" anchor="start" size={21} /> : <Tag x={400} y={740} text="?" size={21} />}
          <Txt x={120} y={784} size={17} weight={700} fill={C.muted}>unknown, matched by eye</Txt>
        </g>
        {/* talk-through on the table */}
        <g opacity={fi(a('bracket'))}>
          <path d={`M640 ${rowY(1) - 28}H668V${rowY(2) + 10}H640`} fill="none" stroke={C.primary} strokeWidth={4} />
          <Txt x={680} y={rowY(1) + 2} size={19} weight={800} fill={C.primary}>same colour</Txt>
          <Txt x={680} y={rowY(1) + 26} size={19} weight={800} fill={C.primary}>description</Txt>
        </g>
        {fi(a('arrow')) > 0 && <Arrow x1={560} y1={728} x2={660} y2={rowY(2) + 24} color={C.primary} width={4} head={14} opacity={fi(a('arrow'))} />}
        <Tag x={684} y={rowY(2) + 10} text="approximate" size={21} fill={C.white} bg={C.primary} stroke={C.primary} opacity={fi(a('approx'))} />
        {/* after correction: the region, and closer standards */}
        <g opacity={fi(a('region'))}>
          <rect x={380} y={rowY(1) + 12} width={250} height={rowY(2) - rowY(1) - 24} rx={6} fill={C.primary} opacity={0.14} />
        </g>
        <g opacity={fi(a('refine'))}>
          {[0.3, 0.5, 0.7].map((f) => <path key={f} d={`M120 ${rowY(1) + (rowY(2) - rowY(1)) * f - 12}H360`} stroke={C.primary} strokeWidth={2} strokeDasharray="6 6" />)}
          <Txt x={120} y={836} size={19} weight={800} fill={C.primary}>closer standards between them would refine it</Txt>
        </g>
      </g>
      {/* the written answer: illustrative */}
      <g opacity={fi(a('illus'))}>
        <Card x={940} y={214} w={910} h={350} active={!corrected} />
        <Txt x={966} y={250} size={18} weight={800} fill={C.primary}>AN ANSWER · illustrative, not a quoted candidate response</Txt>
        <Txt x={966} y={276} size={16} weight={700} fill={C.muted}>9700/34 June 2023 Q1(a)(ii)–(v) · June 2023 examiner report p.32</Txt>
        <g opacity={fi(a('show'), 0.3)}>
          <Txt x={966} y={362} size={46} weight={800} fill={corrected ? '#1D8A4E' : C.primary}>{corrected ? '✓' : '✗'}</Txt>
          <Txt x={1022} y={362} size={42} weight={800}>U is</Txt>
          <Txt x={1136} y={362} size={42} weight={800} fill={strike > 0 ? C.muted : C.ink}>exactly 2.1%</Txt>
          {talk && !corrected && <InkRing cx={1224} cy={348} rx={100} ry={36} p={fe(a('ring'), 0.6)} />}
          {strike > 0 && <path d={`M1130 ${348}H${1130 + 300 * strike}`} stroke={C.primary} strokeWidth={5} strokeLinecap="round" />}
          <g opacity={repl}>
            <Lines x={1022} y={426} size={29} step={38} weight={800} fill="#1D6B40"
              text={'approximately in the region of the 1.25% and\n2.5% standards (matched "purple");\nrefine with closer standards'} />
          </g>
          <g opacity={between(a('precision'), a('correct'), 0.3)}>
            <Tag x={1022} y={440} text="colour alone cannot justify that precision" size={23} fill={C.primary} />
          </g>
        </g>
      </g>
      {/* the examiners' words and the improvement */}
      <g opacity={fi(a('quote'))}>
        <rect x={940} y={584} width={910} height={206} rx={12} fill="#FBF8F1" stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 4" />
        <Lines x={960} y={618} size={19} step={25} weight={600} text={QUOTE} />
        <Txt x={960} y={712} size={20} weight={800}>{'mark scheme: "colour change is subjective ; use colorimeter ;"'}</Txt>
        <Txt x={960} y={766} size={16} weight={700} fill={C.muted}>June 2023 examiner report p.32 · 9700/34 June 2023 mark scheme</Txt>
      </g>
      <g opacity={fi(a('colorimeter'))}>
        <rect x={944} y={812} width={86} height={60} rx={8} fill="#D5DBE2" stroke={C.ink} strokeWidth={2.5} />
        <rect x={958} y={824} width={40} height={22} rx={3} fill={C.ink} />
        <rect x={1008} y={800} width={12} height={36} rx={2} fill="#FFFFFF" stroke={C.ink} strokeWidth={1.5} />
        <Txt x={1046} y={838} size={21} weight={800}>colorimeter: reduces the subjectivity,</Txt>
        <Txt x={1046} y={866} size={21} weight={800}>without removing every uncertainty</Txt>
      </g>
    </g>
  );
}
Beat17.pin = () => 'I';
