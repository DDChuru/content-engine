/** Beat 17 · The real question on screen, and the tablet. s23_31 Q1(b)(ii) instruction verbatim (QP p.9); the paper's
 * Fig. 1.2 is NOT reproduced — our worked-example graph sits beside it. 5 s anchored read; the three MS points land on
 * our graph, ticked; the hook answered (tablet, cell inset, the model's two sites); the two inhibitor curves flash once.
 * Final frame held 2 s: question left, graph with three ticks right, inset beneath. No slogan. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Lines, Card, Tick, Tag} from '../shared/Type';
import {fi, fe, between} from '../util';
import {CurvePath} from '../RateGraph';
import {Enzyme} from '../Enzyme';
import {LactaseGraph, lacG} from './lactase';
import {CellInset, Tablet, Small} from './common';

const g = lacG(1100, 270, 660, 400);
const QT = 'Use the graph in Fig. 1.2 to estimate the Michaelis-Menten\nconstant (Km) of lactase. Show your working on the graph in\nFig. 1.2.';
export default function Beat17(s: any) {
  const {a, local} = s;
  const m = (key: string, d = 0.6) => clamp01(a(key) / d);
  const flash = between(a('flash'), a('flash') - 1.4, 0.3);
  return (
    <g>
      {/* the question, verbatim */}
      <g opacity={fi(a('q'))}>
        <Card x={90} y={190} w={820} h={290} fill={C.white}>
          <rect x={90} y={190} width={10} height={290} rx={5} fill={C.ink} />
          <Txt x={122} y={226} size={17} weight={800} fill={C.muted}>THE QUESTION · quoted verbatim</Txt>
          <Lines x={122} y={266} size={25} step={33} weight={600} text={QT} />
          <Txt x={122} y={400} size={25} weight={700}>Km =</Txt>
          <path d="M190 404H420" stroke={C.ink} strokeWidth={1.5} strokeDasharray="3 5" />
          <Txt x={430} y={400} size={25} weight={700}>mmol dm⁻³</Txt>
          <Txt x={880} y={400} size={25} weight={800} anchor="end">[3]</Txt>
          <Txt x={205} y={398} size={30} weight={800} fill={C.teal} opacity={fi(a('m3') - 0.3)}>18</Txt>
          <Small x={122} y={458} text="9700/31 June 2023 Q1(b)(ii), 3 marks · question paper p.9" />
        </Card>
      </g>
      <g opacity={between(a('read'), a('marks'), 0.4)}>
        <rect x={90} y={500} width={820} height={70} rx={35} fill="#E7F1F5" stroke={C.teal} strokeWidth={2.5} />
        <Txt x={500} y={546} size={26} weight={800} fill={C.teal} anchor="middle">read it: estimate Km; show working on the graph</Txt>
      </g>
      {/* our graph, bare, then the three marks */}
      <g opacity={fi(a('q') - 0.3)}>
        <Card x={960} y={190} w={890} h={740} />
        <Tag x={1830} y={234} text="our graph, not the paper's figure" size={18} anchor="end" fill={C.muted} stroke={C.line} />
        <LactaseGraph g={g} size={18} v={m('m1')} h={m('m2')} k={m('m3')} ring18={fe(a('m3') - 0.4, 0.5)} />
        <CurvePath g={g} c={{id: 'competitive', vmax: 9, km: 25}} color="#C0602E" width={4} dash="10 7" opacity={flash} />
        <CurvePath g={g} c={{id: 'non-competitive', vmax: 5, km: 18}} color="#7A4FA0" width={4} dash="10 7" opacity={flash} />
        <Small x={1120} y={250} text="our schematic; values chosen to match the MS reading" />
        <Txt x={1740} y={g.y + 122} size={18} weight={800} fill="#C0602E" anchor="end" opacity={flash}>competitive: merges at the plateau</Txt>
        <Txt x={1740} y={g.y + 225} size={18} weight={800} fill="#7A4FA0" anchor="end" opacity={flash}>non-competitive: lower plateau</Txt>
        <g>
          {[['m1', 'shows Vmax on graph'], ['m2', 'shows ½ Vmax on graph'], ['m3', '18']].map(([k, t], i) => (
            <g key={k} opacity={fi(a(k))}>
              <Tick x={1000 + i * 290 + (i === 2 ? 0 : 0)} y={862} s={13} />
              <Txt x={1024 + i * 290} y={870} size={22} weight={800} fill={C.goodDark}>{t}</Txt>
            </g>
          ))}
          <Small x={1000} y={906} text="9700/31 June 2023 mark scheme p.7" opacity={fi(a('m1'))} />
        </g>
      </g>
      {/* the tablet, answered */}
      <g opacity={fi(a('tablet'))}>
        <CellInset x={330} y={770} s={0.44} t={local} dim={1} label={false} stoppedDim={0.33} />
        <Tablet x={140} y={640} s={0.55} />
        <Txt x={330} y={908} size={17} weight={800} fill={C.muted} anchor="middle">one enzyme switched off; the others keep running</Txt>
        <Enzyme x={720} y={760} s={0.5} ringActive={between(a('sites'), a('sites') - 1.8)} ringSecond={between(a('sites') - 1.0, a('sites') - 2.8)} ringColor={C.primary} />
        <Txt x={720} y={880} size={17} weight={800} anchor="middle" fill={C.muted}>active site, or a site beside it</Txt>
        <Txt x={720} y={906} size={15} weight={700} anchor="middle" fill={C.muted}>MODEL · schematic</Txt>
        <Tag x={400} y={630} text="other enzymes: different active sites" size={18} anchor="middle" fill={C.teal} stroke={C.teal} bg="#E7F1F5" opacity={fi(a('rest'))} />
      </g>
    </g>
  );
}
