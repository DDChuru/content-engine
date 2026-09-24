/** Beat 16 · How it is asked, and the reject card. A plain forms surface, one row per form (evidence-based, cited);
 * the reject card: the wrong line WRITTEN and struck by hand, the right line beneath, citation in small type. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Card, Strike, textW, Cross, Tick} from '../shared/Type';
import {fi, fe} from '../util';
import {Small} from './common';

function Row({i, a, form, cite, note, note2, an = -1e9, tag}: any) {
  const y = 196 + i * 84, o = fi(a, 0.4), dx = (1 - fe(a, 0.5)) * 30;
  return (
    <g opacity={o} transform={`translate(${dx} 0)`}>
      <rect x={90} y={y} width={1760} height={note2 ? 100 : 72} rx={12} fill={C.white} stroke={C.line} strokeWidth={2} />
      <Txt x={112} y={y + 44} size={20} weight={800} fill={C.muted}>{tag}</Txt>
      <Txt x={210} y={y + 45} size={27} weight={800}>{form}</Txt>
      <Txt x={1830} y={y + 44} size={19} weight={700} fill={C.muted} anchor="end">{cite}</Txt>
      {note && <Txt x={210 + textW(form, 27, 800) + 30} y={y + 44} size={19} weight={700} fill={C.teal} opacity={fi(an)}>{note}</Txt>}
      {note2 && <Txt x={210} y={y + 82} size={17} weight={700} fill={C.teal} opacity={fi(an)}>{note2}</Txt>}
    </g>
  );
}
export default function Beat16(s: any) {
  const {a} = s;
  const W = 'Km is the maximum rate of reaction';
  const st = clamp01((a('reject') - 0.9) / 0.5);
  return (
    <g>
      <Txt x={1850} y={166} size={18} weight={800} fill={C.muted} anchor="end" opacity={fi(a("open"))}>HOW IT REACHES YOU · forms from the sampled papers</Txt>
      <Row i={0} a={a('r1')} tag="P3" form="estimate Km; show working on the graph" cite="s23_31 Q1(b)(ii), 3 marks" note="MS p.7: shows Vmax; shows ½Vmax; 18" an={a('r1b')} />
      <Row i={1} a={a('r2')} tag="P2 P5" form="sketch the competitive curve" cite="s23_23 Q3(b)(ii); s21_51 Q1(c)(ii)" note={'"must meet the plateau of original curve"'} an={a('r2b')} />
      <Row i={2} a={a('r3')} tag="P1" form="order of affinity from three curves" cite="s24_12 Q11, key B" />
      <Row i={3} a={a('r4')} tag="P1" form="effect on Vmax and Km, table row" cite="s24_12 Q10, key A" />
      <Row i={4} a={a('r5')} tag="P1" form="which lines: substrate only / + enzyme / + inhibitor" cite="m23_12 Q16, key B" />
      <Row i={5} a={a('r6')} tag="P2" form="suggest why Km is lower" cite="s21_22 Q5(d)(i), MS p.18" an={a('r6') + 0.6}
        note2={'"increases affinity of enzyme for substrate ;" · "makes shape of active site more complementary ;" · "makes (position of) active site more accessible (to substrate) ;"'} />
      {/* the reject card */}
      <g opacity={fi(a('reject'))} transform={`translate(0 ${(1 - fe(a('reject'), 0.5)) * 20})`}>
        <Card x={90} y={730} w={1760} h={200} fill="#FFFFFF" />
        <Txt x={116} y={770} size={19} weight={800} fill={C.muted}>THE REJECT CARD</Txt>
        <Cross x={140} y={814} s={13} />
        <Txt x={170} y={826} size={32} weight={800} fill={st > 0 ? C.muted : C.ink}>{W}</Txt>
        <Strike x={166} y={815} w={textW(W, 32, 800) + 8} p={st} />
        <Tick x={140} y={876} s={14} opacity={fi(a('reject') - 1.4)} />
        <Txt x={170} y={888} size={32} weight={800} fill={C.goodDark} opacity={fi(a('reject') - 1.4)}>Km is the substrate concentration at which the initial rate is half Vmax</Txt>
        <Small x={170} y={918} text={'ECR Paper 2 Q1 p.10: "\'Vmax\', which is a different term, was also given" · June 2024 examiner report p.4'} opacity={fi(a('reject') - 1.8)} />
      </g>
    </g>
  );
}
