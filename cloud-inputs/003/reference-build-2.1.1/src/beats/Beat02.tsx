/** Why this one is on you: the verbatim outcome with CARRY OUT ringed; Paper 3 icons in turn;
 * a bench preview with a "reason for the step" label; a doubtful tube that dissolves. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Lines, Card, Tag, Cite, InkRing, Arrow} from '../../../shared/src/Type';
import {Tube, Rack, Bottle, BeakerBath} from '../Apparatus';
import {Bench} from '../Bench';
import {fi, fe} from '../util';

const ALL = {rack: 1, label: 1, syringe: 1, dropper: 1, bath: 1, electric: 1, holder: 1, tile: 1, goggles: 1, reagents: 1, waste: 1};

function Hand({x, y, s = 1}: any) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-34 60V-10Q-34-22-24-22Q-14-22-14-10V-40Q-14-52-4-52Q6-52 6-40V-46Q6-58 16-58Q26-58 26-46V-36Q26-48 36-48Q46-48 46-36V22Q46 60 10 64H-10Q-24 64-34 60Z" fill="#E9C9A8" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-34 14Q-58 -4-60 12Q-58 30-34 44" fill="#E9C9A8" stroke={C.ink} strokeWidth={3} />
    </g>
  );
}

export default function Beat02(s: any) {
  const {a, local, sc} = s;
  const icons = [a('i1'), a('i2'), a('i3'), a('i4')].map((x) => fi(x, 0.4));
  const pre = fi(a('preview'), 0.6);
  const reason = a('reason');
  const wr = a('wrong');
  const dissolve = wr < 0 ? 0 : Math.min(fi(wr, 0.4), clamp01((sc.duration - 0.2 - local) / 0.9));
  return (
    <g>
      {/* verbatim outcome */}
      <Card x={90} y={214} w={1000} h={250} fill="#FFFFFF">
        <Txt x={120} y={258} size={21} weight={800} fill={C.muted}>SYLLABUS 2.1.1 · p.17</Txt>
        <Lines x={120} y={308} size={31} step={42} weight={700} text={"describe and carry out the Benedict's test for\nreducing sugars, the iodine test for starch, the\nemulsion test for lipids and the biuret test for proteins"} />
      </Card>
      {/* "carry out" sits on line 1 */}
      <g opacity={fi(a('outcome'), 0.2)}>
        <InkRing cx={436} cy={294} rx={98} ry={29} p={fi(a('outcome'), 0.7)} />
        <Tag x={436} y={500} text="carry out: you do it yourself" size={21} anchor="middle" fill={C.primary} />
      </g>
      <g opacity={fi(a('paper3'))}>
        <Cite x={96} y={560} size={21} text={'9700/33 June 2021, Q1: "Carry out the test for protein on S1, S2, S3, and S4"'} />
      </g>
      {/* Paper 3 icons in turn */}
      <g>
        <g opacity={icons[0]}>
          <Bottle x={170} y={800} s={0.62} name="labelled" k="clear" /><Bottle x={250} y={800} s={0.62} name="labelled" k="clear" />
          <Txt x={210} y={850} size={21} anchor="middle" weight={700}>labelled bottles</Txt>
        </g>
        <g opacity={icons[1]}>
          <BeakerBath x={450} y={800} s={0.5} flame={1} reading="" />
          <Txt x={450} y={850} size={21} anchor="middle" weight={700}>a water bath</Txt>
        </g>
        <g opacity={icons[2]}>
          <Rack x={690} y={690} w={230} h={100} slots={3}>
            {['S1', 'S2', 'S3'].map((l, i) => <Tube key={l} id={'u' + i} x={690 - 70 + i * 70} y={640} h={140} w={50} level={0.45} k="colourless" label={l} pill={false} />)}
          </Rack>
          <Txt x={690} y={850} size={21} anchor="middle" weight={700}>unknown solutions</Txt>
        </g>
        <g opacity={icons[3]}>
          <Hand x={930} y={730} s={0.9} />
          <Txt x={930} y={850} size={21} anchor="middle" weight={700}>your own hands</Txt>
        </g>
      </g>
      {/* bench preview */}
      <g opacity={pre}>
        <rect x={1100} y={214} width={750} height={400} rx={18} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <g transform="translate(1110 262) scale(0.41) translate(-70 -214)"><Bench show={ALL} /></g>
        <Txt x={1122} y={250} size={21} weight={800} fill={C.muted}>EVERY OBJECT ON THE BENCH</Txt>
      </g>
      {reason > 0 && (
        <g opacity={fi(reason)}>
          <Tag x={1475} y={680} text="reason for the step" size={30} anchor="middle" fill={C.white} bg={C.primary} stroke={C.primary} />
          <Arrow x1={1400} y1={650} x2={1290} y2={560} color={C.primary} width={4} />
          <Arrow x1={1550} y1={650} x2={1640} y2={440} color={C.primary} width={4} />
          <Txt x={1475} y={740} size={22} anchor="middle" weight={700} fill={C.muted}>why each step is done that way</Txt>
        </g>
      )}
      {wr > 0 && (
        <g opacity={dissolve}>
          <Tube id="doubt" x={1700} y={770} h={130} w={40} level={0.5} k="green" pill={false} />
          <Txt x={1760} y={860} size={64} weight={800} fill={C.primary}>?</Txt>
          <Txt x={1660} y={870} size={20} anchor="end" weight={700} fill={C.muted}>a doubtful result (model)</Txt>
        </g>
      )}
    </g>
  );
}
