/** How it is asked: 9700/33 June 2021 Q1(a)(i) verbatim [3]; an anchored 5 s read with the
 * instruction "reagent, colours, volume, heat"; the three credited mark-scheme points; the class
 * label (s21_12 Q6 key B); the already corrected E01 card returns, separately identified; no new
 * error. Final frame held: question and corrected card at left, the finished bench at right. */
import React from 'react';
import {BRAND as C} from '../../../shared/src/theme';
import {Txt, Tag, Card, Lines, Cite} from '../../../shared/src/Type';
import {Bench} from '../Bench';
import {fi} from '../util';

const Q = '"State the reagent that is used to test for reducing sugar and the\ncolour or colours produced if a reducing sugar is present.\nDescribe how you will use the reagent to carry out the test for\nreducing sugar."  [3]';
const MS = [
  ['m1', "Benedict's solution and colour(s) stated"],
  ['m2', "equal volumes or greater volume of Benedict's than sample"],
  ['m3', 'boil or heat to 80 °C or higher'],
];

export default function Beat20(s: any) {
  const {a} = s;
  const tubes = [
    {id: 'f20a', k: 'orange', ppt: 1, settle: 1, label: 'S'},
    {id: 'f20b', k: 'blue', label: 'W'},
    {id: 'f20c', k: 'cloudy', label: 'E'},
    {id: 'f20d', k: 'clear', label: 'blk'},
    {id: 'f20e', k: 'violet', label: 'P1'},
    {id: 'f20f', k: 'blue', label: 'W'},
  ];
  const all = {rack: 1, label: 0, syringe: 0, dropper: 1, bath: 1, electric: 1, holder: 1, tile: 1, goggles: 1, reagents: 1, waste: 1};
  return (
    <g>
      {/* the finished bench, at right */}
      <g opacity={fi(a('open'), 0.6)}>
        <rect x={1030} y={214} width={820} height={470} rx={18} fill="#FBFAF7" stroke={C.line} strokeWidth={2} />
        <g transform="translate(1040 240) scale(0.448) translate(-70 -214)"><Bench show={all} tubes={tubes} /></g>
        <Txt x={1054} y={250} size={18} weight={800} fill={C.muted}>THE BENCH YOU NOW KNOW · MODEL</Txt>
      </g>
      {/* the question, verbatim */}
      <g opacity={fi(a('q'))}>
        <Card x={70} y={214} w={940} h={262} />
        <Txt x={96} y={252} size={19} weight={800} fill={C.muted}>A PAPER 3 EXAMPLE · 9700/33 June 2021 Q1(a)(i) · MS p.5</Txt>
        <Lines x={96} y={296} size={23} step={33} weight={700} text={Q} />
        <Cite x={96} y={456} size={16} text="exam words quoted exactly; no Cambridge artwork" />
      </g>
      {/* anchored read */}
      <g opacity={fi(a('read'))}>
        <rect x={70} y={492} width={940} height={66} rx={16} fill={C.ink} />
        <Txt x={96} y={534} size={23} weight={800} fill={C.accent}>What would you write?</Txt>
        {['reagent', 'colours', 'volume', 'heat'].map((t, i) => <Tag key={t} x={420 + i * 145} y={534} text={t} size={21} anchor="start" fill={C.ink} bg={C.warm} stroke={C.warm} />)}
      </g>
      {/* what they credited */}
      {MS.map(([k, t], i) => (
        <g key={k} opacity={fi(a(k))}>
          <rect x={70} y={578 + i * 52} width={940} height={44} rx={10} fill="#F2FAF5" stroke="#1D8A4E" strokeWidth={2} />
          <Txt x={92} y={608 + i * 52} size={22} weight={800} fill="#1D8A4E">✓</Txt>
          <Txt x={126} y={608 + i * 52} size={21} weight={700}>{t}</Txt>
        </g>
      ))}
      <Txt x={1004} y={752} size={15} anchor="end" weight={700} fill={C.muted} opacity={fi(a('m1'))}>9700/33 June 2021 mark scheme, Q1(a)(i)</Txt>
      {/* name the class */}
      <g opacity={fi(a('class'))}>
        <rect x={70} y={764} width={940} height={48} rx={10} fill="#F2FAF5" stroke="#1D8A4E" strokeWidth={2} />
        <Txt x={92} y={796} size={21} weight={800}>Positive Benedict's: reducing sugar detected; identity not established</Txt>
        <Txt x={1004} y={832} size={15} anchor="end" weight={700} fill={C.muted}>9700/12 June 2021 Q6, key B</Txt>
      </g>
      {/* the already corrected E01 card, separately identified */}
      <g opacity={fi(a('class') - 0.6)}>
        <rect x={1030} y={704} width={820} height={226} rx={16} fill={C.white} stroke={C.line} strokeWidth={2} />
        <Txt x={1054} y={738} size={18} weight={800} fill={C.muted}>Corrected earlier: biuret colour-match precision, June 2023 P34</Txt>
        <Txt x={1054} y={782} size={30} weight={800} fill="#1D8A4E">✓</Txt>
        <Txt x={1094} y={782} size={28} weight={800}>U is</Txt>
        <Txt x={1170} y={782} size={28} weight={800} fill={C.muted}>exactly 2.1%</Txt>
        <path d="M1166 772H1370" stroke={C.primary} strokeWidth={4} strokeLinecap="round" />
        <Lines x={1094} y={826} size={22} step={30} weight={800} fill="#1D6B40" text={'approximately in the region of the 1.25% and 2.5%\nstandards (matched "purple"); refine with closer standards'} />
        <Txt x={1054} y={912} size={15} weight={700} fill={C.muted}>illustrative answer from the exam-contrast beat, not a quoted candidate response</Txt>
      </g>
    </g>
  );
}
Beat20.pin = () => '';
