/** A mixture: solution U (June 2021) tested for protein, reducing sugar and starch from separate
 * fresh portions → violet, blue, blue-black → protein detected, no reducing sugar detected under
 * these conditions, starch detected → U contains protein and starch; every test from a fresh portion
 * in a clean tube; the mixture does all relevant tests, unlike the staged design's "not tested". */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Card, Cite, Lines, Arrow} from '../../../shared/src/Type';
import {NamePill, SwatchKey} from '../../../shared/src/Swatch';
import {Tube, Rack, Bottle, Stream, bottleLip, bottleByLip} from '../Apparatus';
import {fi, fe, path, ramp, between} from '../util';

const TUBES: {x: number; test: string; k: SwatchKey; inf: string; key: string}[] = [
  {x: 440, test: 'protein', k: 'violet', inf: 'protein detected', key: 'r1'},
  {x: 620, test: 'reducing sugar', k: 'blue', inf: 'no reducing sugar detected\nunder these conditions', key: 'r2'},
  {x: 800, test: 'starch', k: 'blueblack', inf: 'starch detected', key: 'r3'},
];

export default function Beat16(s: any) {
  const {a} = s;
  const p = a('pour');
  // THE POURS (VIDEO-STRUCTURE "Handling must be physically possible"): U is tipped to 115° (mouth below
  // base) over each tube, poured, tipped back to 40° to travel, and returned upright. The stream leaves
  // the bottle's computed lip and lands on the receiving tube's surface; U's level falls as each rises.
  const S = 0.9, POUR = 115;
  const W = [[0.6, 1.1], [1.6, 2.1], [2.6, 3.1]];
  const pose = TUBES.map((t) => [...bottleByLip(t.x - 8, 395, S, POUR), POUR]);
  const keys: number[][] = [[0, 200, 700, 0], [0.25, 235, 540, 0], [0.6, ...pose[0]], [1.1, ...pose[0]],
    [1.35, (pose[0][0] + pose[1][0]) / 2, Math.min(pose[0][1], pose[1][1]) - 40, 40], [1.6, ...pose[1]], [2.1, ...pose[1]],
    [2.35, (pose[1][0] + pose[2][0]) / 2, Math.min(pose[1][1], pose[2][1]) - 40, 40], [2.6, ...pose[2]], [3.1, ...pose[2]],
    [3.4, pose[2][0] - 40, pose[2][1] - 60, 30], [3.8, 200, 700, 0]];
  let bpose = keys[0].slice(1);
  if (p >= keys[keys.length - 1][0]) bpose = keys[keys.length - 1].slice(1);
  else if (p > 0) for (let i = 1; i < keys.length; i++) if (p <= keys[i][0]) {
    const u = fe(p - keys[i - 1][0], keys[i][0] - keys[i - 1][0]);
    bpose = [1, 2, 3].map((j) => keys[i - 1][j] + (keys[i][j] - keys[i - 1][j]) * u); break;
  }
  const [bx, by, tilt] = bpose;
  const poured = W.map(([a0, a1]) => ramp(p, [[a0, 0], [a1, 1]]));
  const vol = 1 - 0.2 * (poured[0] + poured[1] + poured[2]);
  const flowI = W.findIndex(([a0, a1]) => p > a0 && p < a1);
  const lip = bottleLip(bx, by, S, tilt);
  const sw = a('swatches');
  const fresh = between(a('fresh'), a('diff') + 2);
  return (
    <g>
      <Txt x={200} y={760} size={20} anchor="middle" weight={800} opacity={fi(a('U')) * (p > 0 && p < 3.5 ? 0 : 1)}>solution U</Txt>
      <Tag x={200} y={800} text="June 2021 practical" size={17} anchor="middle" opacity={fi(a('U')) * (p > 0 && p < 3.5 ? 0 : 1)} />
      <Rack x={620} y={520} w={560} h={250} slots={3}>
        {TUBES.map((t, i) => {
          const lvl = 0.36 * poured[i];
          return <Tube key={t.key} id={'U16' + i} x={t.x} y={420} h={300} w={66} level={lvl} k={lvl > 0.01 ? 'colourless' : undefined} to={sw > i * 0.5 ? t.k : undefined} t={fe(sw - i * 0.5, 0.8)} label="U" pillY={i === 1 ? 846 : 810} glow={fresh > 0.5} />;
        })}
      </Rack>
      {TUBES.map((t, i) => <Txt key={i} x={t.x} y={396} size={17} anchor="middle" weight={800}>{t.test} test</Txt>)}
      <Bottle x={bx} y={by} s={S} rot={tilt} vol={vol} bid="U16" name="U" k="colourless" liquid="#BFDCE7" open={p > 0.2 && p < 3.7} />
      {flowI >= 0 && <Stream x1={lip[0]} y1={lip[1]} x2={lip[0] + 3} y2={720 - 294 * 0.36 * poured[flowI]} width={7}
        opacity={Math.min(fi(p - W[flowI][0], 0.1), fi(W[flowI][1] - p, 0.1))} />}
      <Tag x={620} y={880} text="fresh portion · clean tube · every test" size={21} anchor="middle" fill={C.white} bg={C.primary} stroke={C.primary} opacity={fresh} />
      <Txt x={620} y={905} size={19} anchor="middle" weight={700} fill={C.muted} opacity={between(p, a('fresh'))}>three separate fresh portions of U</Txt>
      {/* U rows */}
      <g opacity={fi(a('rows'))}>
        <Card x={940} y={214} w={910} h={352} />
        {['sample', 'test', 'observation', 'supported inference'].map((h, i) => <Txt key={h} x={[962, 1050, 1225, 1440][i]} y={250} size={19} weight={800} fill={C.muted}>{h}</Txt>)}
        {TUBES.map((t, i) => {
          const y = 300 + i * 88;
          return (
            <g key={t.key}>
              <path d={`M952 ${y - 30}H1838`} stroke={C.line} strokeWidth={1.5} />
              <Txt x={962} y={y} size={21} weight={800}>U</Txt>
              <Txt x={1050} y={y} size={20}>{t.test}</Txt>
              <NamePill x={1225} y={y} k={t.k} anchor="start" size={18} model={false} />
              <g opacity={fi(a(t.key), 0.4)}><Lines x={1440} y={y} size={21} step={26} weight={800} text={t.inf} /></g>
            </g>
          );
        })}
        <path d="M952 534H1838" stroke={C.line} strokeWidth={1.5} opacity={0} />
      </g>
      <g opacity={fi(a('inf'))}>
        <rect x={940} y={586} width={910} height={66} rx={14} fill={C.primary} />
        <Txt x={966} y={630} size={28} weight={800} fill={C.white}>U contains protein and starch</Txt>
        <Cite x={946} y={682} size={17} text="9700/33 June 2021 Q1(a)(v),(vi) mark scheme: the credited answer" />
      </g>
      {/* staged vs mixture */}
      <g opacity={fi(a('diff'))}>
        <Card x={940} y={712} w={440} h={200} />
        <Txt x={960} y={745} size={19} weight={800} fill={C.muted}>STAGED (S1–S4)</Txt>
        <Txt x={960} y={773} size={18} weight={700}>one or none per solution:</Txt>
        <Txt x={960} y={799} size={18} weight={700}>stop once identified</Txt>
        {['tested', 'tested', 'not tested'].map((t, i) => <Tag key={i} x={960 + i * 128} y={860} text={t} size={16} fill={t === 'not tested' ? C.muted : C.ink} />)}
        <Card x={1410} y={712} w={440} h={200} active />
        <Txt x={1430} y={745} size={19} weight={800} fill={C.primary}>MIXTURE (U)</Txt>
        <Txt x={1430} y={773} size={18} weight={700}>carry out all the relevant</Txt>
        <Txt x={1430} y={799} size={18} weight={700}>tests</Txt>
        {['tested', 'tested', 'tested'].map((t, i) => <Tag key={i} x={1430 + i * 128} y={860} text={t} size={16} fill={C.ink} />)}
        <g opacity={fi(a('contrast'))}>
          <rect x={1206} y={832} width={128} height={40} rx={10} fill="none" stroke={C.primary} strokeWidth={3} />
          <Arrow x1={1340} y1={852} x2={1400} y2={852} color={C.primary} width={3} head={10} />
        </g>
      </g>
    </g>
  );
}
Beat16.pin = (s: any) => (s.a('inf') > 0 ? 'I' : s.a('rows') > 0 ? 'O' : 'C');
