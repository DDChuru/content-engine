/** Beat 5 · E5-06 (EXAM CONTRAST). Five moves: announce (badge on; basis line) → the written answer (our composite) →
 * 4 s silent read (digital silence) → talk-through with cue-synced underline, rings, tabs, empty event slots → the
 * correction written in place (struck line; event 1, event 2, result), with the labelled Replay model running forwards:
 * one-frame separation with the count change on that frame, telophase with the count change on the envelope-closing
 * frame. The marker clears on the completed correct frame (ERROR_BEATS[5], clearKey 'done'). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, InkRing, Underline, Arrow, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {MitosisCellModel, MSTAGES, MCOUNT, mixM, mLayout} from '../MitosisCellModel';
import {Chromosome, CountStrip} from '../ChromosomeModel';
import {DNAContentGraph, graphGeom} from '../DNAContentGraph';
import {ARCS} from '../CellCycleWheel';
import {SetCard} from '../ContextStrip';
import {Tick, Ring} from '../T5Annot';
import {fi, fe, lerp, pulse, between} from '../util';
import {QHeader, qHeaderH, Written, span, SideNote, QuoteTab, quoteH, Strike, GOOD} from '../Panels';
import {Caption, typed, INK} from './kit';

const WRONG = 'Mitosis produces genetically identical cells.';
const HEADER = 'Identify and explain two cell-cycle events that produce genetically identical daughter cells.';
const HSRC = 'our framing of a real question (its organism context omitted); question framings and summaries\nare our wording';
const EV1 = 'event 1: DNA replicated in the S (synthesis) phase of interphase → two identical sister chromatids';
const EV2 = 'event 2: sister chromatids separate to opposite poles in anaphase';
const RES = '→ each daughter nucleus receives one copy of every chromosome: same number, same genetic information';
const ROWS = [['identical sister chromatids', '— MS point 2'], ['sister chromatids move to opposite', 'poles — MS point 6'], ['one chromatid of each chromosome', 'reaches each daughter cell — MS point 4']];   // run 009g: two lines, 20 px
export default function Beat05(s: any) {
  const a = s.a;
  const PX = 800, PW = 1050;
  const hy = 250, hh = qHeaderH(HEADER, HSRC, 26);
  const cy = 455, WS = 32, cx0 = PX + 24, ly = cy + 46;
  const fix = a('fix') >= 0, done = a('done') >= 0;
  const slots = a('slots') >= 0;
  const cardH = slots ? 210 : 80;
  // ---- the Replay model (left), dimmed until the talk-through points at it
  const sep = a('ana') >= 0 ? 1 : 0;
  const pole = fe(a('ana'), 2.4);
  const TEL = 2.6, tel = fe(a('tel'), TEL);
  const m = {...mixM({...MSTAGES['metaphase'], sep, pole}, MSTAGES['telophase'], tel), sep, pole};
  const closed = a('tel') >= TEL;
  const rows = !sep ? MCOUNT.replicated : closed ? MCOUNT.telophase : MCOUNT.separated;
  const MX = 440, MY = 520, MS = 0.42;   // run 009g: smaller and higher, so the S-phase replay inset below can carry readable axes
  const G = mLayout({x: MX, y: MY, size: MS, ...m});
  const bright = Math.max(fi(a('shared'), 0.5), fix ? 1 : 0);
  const pBright = Math.max(fi(a('made'), 0.5), fix ? 1 : 0);
  // S-phase replay inset (correction)
  const sRep = a('fix') < 0 ? -1 : Math.min(1, a('fix') / 5.5);
  const SG = {x: 300, y: 792, w: 460, h: 140}, sg = graphGeom({...SG, small: true} as any);
  const gPen = a('fix') < 0 ? ARCS.s[0] : lerp(ARCS.s[0], ARCS.s[1], Math.min(1, a('fix') / 5.5));
  const r1 = a('ana') - 0.3 >= 0, r2 = a('tel') - 0.25 >= 0, r3 = done;
  const hwx = PX + 22 + textW('Identify and explain two cell-cycle events that produce ', 26, 700);
  const [w0, w1] = span(cx0, WRONG, WRONG.indexOf('genetically'), WRONG.indexOf('cells'), WS);
  const ev1 = fix ? typed(EV1, a('fix') - 0.3, (EV1.length) / 6.5) : '';
  const ev2 = a('ana') >= 0 ? typed(EV2, a('ana'), EV2.length / 3.4) : '';
  const res = a('tel') >= 0 ? (done ? RES : typed(RES, a('tel'), RES.length / 4.0)) : '';
  const tabsA = between(a('syl'), a('demand'));
  const zb = 700;
  return (
    <g>
      {/* ---- left: the dimmed IdenticalChain pieces, reset to a labelled Replay metaphase */}
      <g opacity={lerp(0.4, 1, pBright)}>
        <SetCard x={80} y={420} s={0.8} kind="X" tag="parent cell after S" hi={pulse(a('made'), 1.8)} />
      </g>
      <g opacity={lerp(0.4, 1, bright)}>
        <MitosisCellModel x={MX} y={MY} size={MS} {...(m as any)} />
        <CountStrip x={75} y={232} w={700} size={20} rows={rows} />
        <Tag x={MX + 110} y={MY - 310 * MS + 16} text="Replay" size={20} />
        {sep > 0 && !done && <Txt x={MX} y={MY + 310 * MS + 26} size={16} weight={700} fill={INK} anchor="middle" opacity={fi(a('ana'), 0.001)}>daughter chromosomes</Txt>}
      </g>
      {done && [0, 1].map((i) => <SetCard key={i} x={MX - 150 + i * 190} y={MY + 310 * MS + 8} s={0.6} kind="rod" op={fi(a('done'), 0.4)} glow={1} tag={i ? 'daughter cell' : 'daughter cell'} />)}
      {fix && <g opacity={1 - fi(a('done') - 0.2, 0.5) * 0.0}>
        {/* run 009g: the inset's y-axis title is horizontal (a rotated 20 px title cannot fit a 120 px plot); ticks and
            "time" drawn at 20 px beside the plot */}
        <rect data-role="decor" x={75} y={758} width={700} height={196} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <Tag x={90} y={788} text="S-phase replay" size={20} />
        <Chromosome x={170} y={850} id="C1" cond={0} rep={sRep} rot={90} scale={0.26} wave={0.6} />
        <Txt x={760} y={788} size={20} weight={700} fill={T5.ringHalo} anchor="end">DNA mass per cell / arbitrary units</Txt>
        <DNAContentGraph {...SG} small pen={gPen} caption={0} axes={0} bands={1} />
        {[1, 2].map((k) => <Txt key={k} x={sg.L - 10} y={sg.gy(k) + 7} size={20} weight={700} fill={T5.ringHalo} anchor="end">{String(k)}</Txt>)}
        <Txt x={90} y={945} size={20} weight={600} fill={C.muted} italic>schematic account of replication during S; detailed replication in 6.1.4</Txt>
      </g>}
      {/* ---- right: the EXAM CONTRAST panel */}
      <Caption x={PX} y={214} size={15} maxW={PW} weight={600} fill={C.muted} text="basis: a real exam question, in our own words; no examiner report on how often; 3 marks, any three listed points" />
      <QHeader x={PX} y={hy} w={PW} label="OUR FRAMING" text={HEADER} src={HSRC} size={26} opacity={fi(a('q'), 0.4)}
        hi={a('result') >= 0 ? <Underline x1={hwx} x2={hwx + textW('genetically identical', 26, 700)} y={hy + 44 + 26 + 8} p={fe(a('result'), 0.5)} color={C.primary} /> : null} />
      <g opacity={fi(a('card'), 0.4)}>
        <rect data-role="decor" x={PX} y={cy} width={PW} height={cardH} rx={12} fill="#FFFFFF" stroke="#C9BFA8" strokeWidth={2} />
        <Written x={cx0} y={ly} text={WRONG} size={WS} />
        <Txt x={PX + PW - 14} y={cy - 8} size={15} weight={600} fill={C.muted} anchor="end" italic>our composite; not a transcript</Txt>
      </g>
      {a('line') >= 0 && !fix && <Underline x1={cx0 + WS * 1.05} x2={cx0 + WS * 1.05 + textW(WRONG, WS, 600)} y={ly + 10} p={fe(a('line'), 0.8)} color={C.primary} />}
      {a('true') >= 0 && !fix && <SideNote x={PX + PW - 20} y={ly} text="true, but…" size={24} anchor="end" opacity={fi(a('true'), 0.4)} />}
      {a('syl') >= 0 && !fix && <InkRing cx={(w0 + w1) / 2} cy={ly - 10} rx={(w1 - w0) / 2 + 12} ry={26} p={fe(a('syl'), 0.6)} />}
      {tabsA > 0 && <g opacity={tabsA}>
        <QuoteTab x={PX} y={560} w={620} quote={'“production of genetically identical daughter cells”'} source="syllabus 5.1.2, p.23" size={20} />
        <InkRing cx={PX + 18 + textW('“production of ', 20, 600) + textW('genetically identical', 20, 600) / 2} cy={560 + 30 - 6} rx={textW('genetically identical', 20, 600) / 2 + 10} ry={18} p={fe(a('syl') - 0.3, 0.6)} />
      </g>}
      {a('result') >= 0 && !fix && <g opacity={fi(a('result'), 0.4)}>
        <Arrow x1={(w0 + w1) / 2 + 60} y1={ly - 40} x2={hwx + 110} y2={hy + hh - 4} color={C.primary} width={3} bend={-30} />
        <SideNote x={PX + 700} y={650} text="result given in the question" size={22} opacity={fi(a('result'), 0.4) * (1 - fi(a('demand'), 0.3))} />
      </g>}
      {/* demand tab + examples (zone B) */}
      {a('demand') >= 0 && <g opacity={fi(a('demand'), 0.4)}>
        <QuoteTab x={PX} y={zb} w={500} size={19} quote={'the question: two events asked ·\n3 marks · any three listed points'} source="our summary, not the scheme's wording" />
      </g>}
      {a('examples') >= 0 && !fix && <g opacity={fi(a('examples'), 0.4)}>
        <Txt x={PX + 530} y={zb + 20} size={17} weight={800} fill={INK}>Examples of credit — alternatives, not a compulsory checklist</Txt>
        {['identical sister chromatids', 'alignment at the equator', 'distribution to opposite poles'].map((t, i) => <Tag key={i} x={PX + 530} y={zb + 52 + i * 44} text={t} size={19} opacity={fi(a('examples') - 0.8 * i, 0.4)} />)}
      </g>}
      {fix && <g>
        <Txt x={PX + 530} y={zb + 20} size={17} weight={800} fill={INK}>Three credited points in this answer</Txt>
        {ROWS.map((t, i) => { const on = [r1, r2, r3][i]; const age = [a('ana') - 0.3, a('tel') - 0.25, a('done')][i]; return <g key={i}>
          <rect data-role="decor" x={PX + 530} y={zb + 32 + i * 64} width={520} height={58} rx={10} fill={on ? '#F2FAF5' : '#FFFFFF'} stroke={on ? GOOD : '#D6CEBD'} strokeWidth={2} />
          {on && <Tick x={PX + 556} y={zb + 61 + i * 64} p={fe(age, 0.4)} />}
          {on && <Txt x={PX + 580} y={zb + 55 + i * 64} size={20} weight={700} fill={GOOD} opacity={fi(age, 0.3)}>{t[0]}</Txt>}
          {on && <Txt x={PX + 580} y={zb + 79 + i * 64} size={20} weight={700} fill={GOOD} opacity={fi(age, 0.3)}>{t[1]}</Txt>}
        </g>; })}
      </g>}
      {/* the missing explanation, and the empty event slots */}
      {a('none') >= 0 && !fix && <g opacity={fi(a('none'), 0.4)}>
        <InkRing cx={cx0 + WS * 1.05 + textW(WRONG, WS, 600) + 110} cy={ly - 10} rx={90} ry={30} p={fe(a('none'), 0.6)} />
        <SideNote x={cx0 + WS * 1.05 + textW(WRONG, WS, 600) + 110} y={ly + 44} text="no event named" size={20} anchor="middle" />
      </g>}
      {slots && <g opacity={fi(a('slots'), 0.4)}>
        {!fix && <Txt x={cx0} y={ly + 50} size={24} weight={700} fill={C.muted} italic>event 1 ?</Txt>}
        {a('ana') < 0 && <Txt x={cx0} y={ly + 96} size={24} weight={700} fill={C.muted} italic>event 2 ?</Txt>}
      </g>}
      {fix && <>
        <Strike x1={cx0 + WS * 1.05} x2={cx0 + WS * 1.05 + textW(WRONG, WS, 600)} y={ly - 10} p={fe(a('fix'), 0.6)} />
        <Txt x={cx0} y={ly + 50} size={21} weight={700} fill={GOOD}>{ev1}</Txt>
        <Txt x={cx0} y={ly + 96} size={21} weight={700} fill={GOOD}>{ev2}</Txt>
        <Txt x={cx0} y={ly + 142} size={21} weight={700} fill={GOOD}>{res}</Txt>
      </>}
      {done && <Txt x={PX} y={948} size={17} weight={700} fill={GOOD} opacity={fi(a('done'), 0.4)}>One sufficient answer: two events, three credited points. Other routes are accepted.</Txt>}
    </g>
  );
}
