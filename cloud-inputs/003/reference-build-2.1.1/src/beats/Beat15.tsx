/** Recording: headings sample | test | observation | supported inference; every test actually done
 * on every tube, in words (colour + precipitate/emulsion), negatives included; "not tested" for tests
 * not done; June 2021's staged single-component design (4 + 3 + 2 results), discard → rinse → fresh
 * sample between tests; "none" = none of the three tested classes detected in that supplied sample. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Card, Cite, Arrow, Lines} from '../../../shared/src/Type';
import {ResultsTable, QuoteTab, Row} from '../Panels';
import {Tube, Stream, tubeLip} from '../Apparatus';
import {fi, fe, between} from '../util';

export const S_ROWS: (Row & {done: boolean; t: string})[] = [
  {sample: 'S1', test: 'protein', t: 'p', obs: 'blue', obsK: 'blue', inf: '—', done: true},
  {sample: 'S1', test: 'reducing sugar', t: 'r', obs: 'blue', obsK: 'blue', inf: '—', done: true},
  {sample: 'S1', test: 'starch', t: 's', obs: 'orange-brown', obsK: 'orangebrown', inf: 'none of the three tested classes detected', done: true},
  {sample: 'S2', test: 'protein', t: 'p', obs: 'blue', obsK: 'blue', inf: '—', done: true},
  {sample: 'S2', test: 'reducing sugar', t: 'r', obs: 'orange, precipitate', obsK: 'orange', inf: 'reducing sugar', done: true},
  {sample: 'S2', test: 'starch', t: 's', obs: 'not tested', inf: '', done: false},
  {sample: 'S3', test: 'protein', t: 'p', obs: 'violet', obsK: 'violet', inf: 'protein', done: true},
  {sample: 'S3', test: 'reducing sugar', t: 'r', obs: 'not tested', inf: '', done: false},
  {sample: 'S3', test: 'starch', t: 's', obs: 'not tested', inf: '', done: false},
  {sample: 'S4', test: 'protein', t: 'p', obs: 'blue', obsK: 'blue', inf: '—', done: true},
  {sample: 'S4', test: 'reducing sugar', t: 'r', obs: 'blue', obsK: 'blue', inf: '—', done: true},
  {sample: 'S4', test: 'starch', t: 's', obs: 'blue-black', obsK: 'blueblack', inf: 'starch', done: true},
];
export const WIDTHS = [100, 205, 285, 540];

export default function Beat15(s: any) {
  const {a} = s;
  const head = fi(a('headings'));
  const rowsA = a('rows');
  let doneN = 0;
  const rows = S_ROWS.map((r) => {
    const idx = r.done ? doneN++ : -1;
    const show = r.done ? fi(rowsA - idx * 0.45, 0.3) : fi(a('nt'), 0.5);
    const ntOn = !r.done;
    return {
      ...r,
      obs: ntOn ? (a('nt') > 0 ? 'not tested' : '') : r.obs,
      obsK: ntOn ? undefined : r.obsK,
      nt: ntOn,
      inf: r.done ? r.inf : '',
      op: r.done ? 0.25 + 0.75 * show : 0.25 + 0.75 * fi(rowsA - 2.5, 0.5),
      _show: show,
      hi: (a('protein') > 0 && a('stop') < 0 && r.t === 'p') || (r.sample === 'S1' && r.t === 's' && a('none') > 0),
      hiObs: r.test === 'reducing sugar' && r.sample === 'S2' && between(a('pe'), a('blue')) > 0.5,
      ring: r.obs === 'blue' && r.done && a('blue') > 0 && a('nt') < 0,
    };
  }).map((r) => ({...r, obs: r.done && r._show < 0.5 ? '' : r.obs, obsK: r.done && r._show < 0.5 ? undefined : r.obsK, inf: r.done && r._show < 0.5 ? '' : r.inf}));
  const headHi = a('obs') > 0 && a('rows') < 0 ? 'observation' : a('inf') > 0 && a('obs') < 0 ? 'supported inference' : '';
  const cellsInf = fi(a('inf'));
  return (
    <g>
      <g opacity={fi(a('open'))}>
        <ResultsTable x={80} y={214} widths={WIDTHS} rowH={46} size={20} head={head}
          headHi={headHi} rows={rows.map((r) => ({...r, inf: cellsInf > 0.5 ? r.inf : ''}))} />
      </g>
      {/* supported inference heading arrives after the others */}
      {head > 0 && a('inf') < 0 && <rect x={80 + WIDTHS[0] + WIDTHS[1] + WIDTHS[2] + 2} y={216} width={WIDTHS[3] - 4} height={46} fill="#EAE4D6" />}
      {/* right panel */}
      <g opacity={between(a('marked'), a('design'))}>
        <Tag x={1250} y={250} text="the table itself is marked" size={21} fill={C.primary} />
      </g>
      <g opacity={between(a('headings'), a('design'))}>
        <QuoteTab x={1250} y={290} w={600} size={19} quote={'"heading for independent variable:\nsample ;"\n"heading for dependent variable:\ncolour or observation ;"'} source="9700/33 June 2021 Q1(a)(iii) mark scheme" />
        <g opacity={fi(a('blue'))}>
          <Tag x={1250} y={560} text="a negative is a result" size={24} fill={C.white} bg={C.primary} stroke={C.primary} />
        </g>
        <g opacity={fi(a('nt'))}>
          <Lines x={1252} y={620} size={21} step={28} weight={800} text={'test not done → "not tested"\nnot "negative"'} />
        </g>
      </g>
      <g opacity={fi(a('design'))}>
        <QuoteTab x={1250} y={250} w={600} size={19} quote={'"Each solution contains one or none of\nthe biological molecules"'} source="9700/33 June 2021 Q1 question paper" />
        <Txt x={1252} y={400} size={20} weight={800} opacity={fi(a('protein'))}>protein first on all four, then stop</Txt>
        <Txt x={1252} y={426} size={20} weight={800} opacity={fi(a('protein'))}>testing a tube once it is identified</Txt>
      </g>
      {/* discard → rinse → fresh sample, between tests on unidentified solutions */}
      <g opacity={fi(a('stop'))}>
        <Card x={1250} y={450} w={600} h={212} />
        {[['discard old\nmixture', 0], ['rinse\nthe tube', 1], ['add fresh\nsample', 2]].map(([t, i]: any) => (
          <g key={i} opacity={fi(a('stop') - i * 0.6, 0.4)}>
            <Tube id={'rs' + i} x={1350 + i * 200} y={i === 0 ? 455 : 470} h={100} w={34} level={i === 0 ? 0.3 : i === 1 ? 0.25 : 0.4} k={i === 0 ? 'blue' : i === 1 ? 'clear' : 'colourless'} rot={i === 0 ? 115 : 0} pill={false} />
            {i === 0 && (() => { const L = tubeLip(1350, 455, 100, 34, 115); return <g><Stream x1={L[0]} y1={L[1]} x2={L[0] + 2} y2={L[1] + 34} k="blue" width={5} /><path d={`M${L[0] - 24} ${L[1] + 20}V${L[1] + 52}H${L[0] + 26}V${L[1] + 20}`} fill="#E9E4DA" stroke={C.ink} strokeWidth={2} /><rect x={L[0] - 22} y={L[1] + 40} width={46} height={11} fill="#3F7FD6" opacity={0.6} /></g>; })()}
            <Lines x={1350 + i * 200 - (i === 0 ? 20 : 0)} y={626} size={17} step={21} weight={800} anchor="middle" text={t} />
            {i < 2 && <Arrow x1={1405 + i * 200} y1={520} x2={1495 + i * 200} y2={520} color={C.primary} width={3} head={10} />}
          </g>
        ))}
      </g>
      <Txt x={1252} y={684} size={16} weight={700} fill={C.muted} opacity={fi(a('stop'))}>9700/33 QP steps 9 and 13 · a cleaned tube may be reused</Txt>
      <g opacity={fi(a('counts'))}>
        <Tag x={1250} y={728} text="4 protein · 3 reducing sugar · 2 starch" size={22} fill={C.primary} />
        <Cite x={1252} y={772} size={16} text={'9700/33 MS: "records four (colours) for protein test, three …\nreducing sugar test, two … starch test ;"'} />
      </g>
      <g opacity={fi(a('none'))}>
        <Cite x={1252} y={836} size={16} text={'9700/33 June 2021 Q1(a)(iv) MS: S1 none, S2 reducing sugar,\nS3 protein, S4 starch'} />
        <Txt x={1252} y={898} size={19} weight={800} fill={C.primary}>"none" = none of the three tested classes</Txt>
      </g>
    </g>
  );
}
Beat15.pin = (s: any) => (s.a('inf') > 0 && s.a('obs') < 0 ? 'I' : s.a('none') > 0 ? 'I' : 'O');
