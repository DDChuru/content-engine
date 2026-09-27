/** Beat 7 · Count the centromeres. The C1 X; the staple handle (converted at once into the written sentence);
 * the rule card; before/after per-chromosome labels (per chromosome, not a cell count). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Arrow} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom} from '../ChromosomeModel';
import {Ring, Label, Trace, Glow} from '../T5Annot';
import {fi, fe, lerp, pulse, between} from '../util';
import {SentenceStrip, typed, StapleInset, INK} from './kit';

const SENT = 'After replication, a chromosome consists of two sister chromatids, each its own DNA molecule, joined at one centromere.';
export default function Beat07(s: any) {
  const a = s.a;
  const X: any = {x: 820, y: 470, id: 'C1', cond: 1, rep: 1, scale: 1.6};
  const G = chromGeom(X);
  const arms = [G.sides[-1].at(0.12), G.sides[1].at(0.12), G.sides[-1].at(0.85), G.sides[1].at(0.85)];
  const tr = (sd: number) => Array.from({length: 41}, (_, i) => G.sides[sd].at(i / 40));
  const stapleO = fi(a('staple'), 0.4) * lerp(1, 0.35, fe(a('written'), 0.6));
  const ghost = fe(a('before'), 0.9);
  const card = fi(a('rule1'), 0.4);
  // Memory hook (run 009f, RULE-MEMORY-HOOKS): each link spoken and lit with its target — page ↔ one sister chromatid,
  // photocopy ↔ the other, staple ↔ centromere — then the completed mapping held (2 s digital-silence hold before
  // "Written properly"). The handle dims at "Written properly"; its mapping card clears when the rule card lands.
  const L = (k: string) => a(k) >= 0;
  const all = fi(a('set'), 0.3);
  const lit = (k: string, next: string) => (L(k) ? (a(next) < 0 ? fi(a(k), 0.3) : lerp(0.45, 1, all)) : 0);
  const hPage = lit('page', 'pcopy'), hCopy = lit('pcopy', 'pstaple'), hStap = L('pstaple') ? (a('set') < 0 ? fi(a('pstaple'), 0.3) : lerp(0.45, 1, all)) : 0;
  const hookEnd = a('written') >= 0 ? lerp(1, 0.35, fe(a('written'), 0.6)) : 1;
  const onModel = 1 - fi(a('written'), 0.6);   // the model highlights clear as the written sentence takes over
  const legendO = fi(a('page'), 0.4) * (1 - fi(a('rule1'), 0.4)) * hookEnd;
  const ROWS = [['page', 'one sister chromatid', hPage, 'page'], ['photocopy', 'the other sister chromatid', hCopy, 'pcopy'], ['staple', 'the centromere', hStap, 'pstaple']];
  return (
    <g>
      <Txt x={70} y={250} size={20} weight={600} fill={C.muted} italic>schematic · C1, replicated</Txt>
      {arms.map((q, i) => <Glow key={i} cx={q[0]} cy={q[1]} r={34} a={pulse(a('how') - 0.2 - i * 0.3, 0.8)} />)}
      <Chromosome {...X} hiCen={pulse(a('rule1'), 1.2)} />
      <Tag x={820} y={272} text="how many chromosomes?" size={24} anchor="middle" opacity={between(a('how'), a('staple') - 3)} />
      <Ring cx={G.centromere[0]} cy={G.centromere[1]} rx={44} ry={36} p={fe(a('how') - 1.6, 0.6)} />
      <Txt x={G.centromere[0] + 70} y={G.centromere[1] + 14} size={48} weight={800} fill={INK} opacity={fi(a('how') - 2.2, 0.3)}>1</Txt>
      {[-1, 1].map((sd, i) => <Trace key={sd} pts={tr(sd)} p={fe(a('each') - i * 0.9, 0.9)} width={5} opacity={between(a('each') - i * 0.9, a('each') - 3.5)} />)}
      {[-1, 1].map((sd) => { const h = (sd === -1 ? hPage : hCopy) * onModel; return h > 0 ? <Trace key={'h' + sd} pts={tr(sd)} p={1} width={7} opacity={h} /> : null; })}
      {hStap * onModel > 0 && <Ring cx={G.centromere[0]} cy={G.centromere[1]} rx={50} ry={42} p={1} width={6} opacity={hStap * onModel} />}
      {hStap * onModel > 0 && <Label x={G.centromere[0] - 66} y={G.centromere[1] + 8} text="centromere" size={22} anchor="end" opacity={hStap * onModel} />}
      {hPage * onModel > 0 && <Label x={G.sides[-1].at(0.85)[0] - 40} y={G.sides[-1].at(0.85)[1] + 70} text="sister chromatid" size={22} anchor="end" opacity={hPage * onModel} />}
      {hCopy * onModel > 0 && <Label x={G.sides[1].at(0.85)[0] + 40} y={G.sides[1].at(0.85)[1] + 70} text="sister chromatid" size={22} opacity={hCopy * onModel} />}
      {stapleO > 0 && <g opacity={stapleO < 1 ? stapleO : undefined}>
        <StapleInset x={1420} y={250} p={fe(a('staple') - 0.6, 0.8)} pulse={hStap} hiA={hPage} hiB={hCopy} />
        <Tag x={1620} y={236} text="handle: not the exam answer" size={20} anchor="middle" opacity={fi(a('written'), 0.4)} bg="#FFF3EC" />
      </g>}
      {legendO > 0 && <g opacity={legendO < 1 ? legendO : undefined}>
        <rect data-role="decor" x={1330} y={492} width={520} height={196} rx={14} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2} />
        {ROWS.map(([w, t, h, k]: any, i: number) => { const y = 534 + i * 44; const o = fi(a(k), 0.3); return o > 0 ? <g key={w} opacity={o < 1 ? o : undefined}>
          {h > 0 && <rect data-role="decor" x={1342} y={y - 28} width={496} height={38} rx={8} fill={T5.ring} opacity={0.4 * h} />}
          <Txt x={1352} y={y} size={24} weight={800} fill={INK}>{w}</Txt>
          <Txt x={1500} y={y} size={24} weight={800} fill={INK} anchor="middle">→</Txt>
          <Txt x={1526} y={y} size={24} weight={700} fill={INK}>{t}</Txt></g> : null; })}
        <Txt x={1352} y={668} size={22} weight={800} fill={C.teal} opacity={all}>two sheets, one set = one chromosome</Txt>
      </g>}
      {card > 0 && <g opacity={card < 1 ? card : undefined}>
        <rect data-role="decor" x={1180} y={590} width={640} height={120} rx={14} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2.5} />
        <Txt x={1204} y={636} size={27} weight={800} fill={INK}>chromosomes: count centromeres</Txt>
        <Txt x={1204} y={684} size={23} weight={700} fill={INK} opacity={fi(a('rule2'), 0.4)}>DNA molecules: count separately (one per chromatid)</Txt>
      </g>}
      {ghost > 0 && <g opacity={ghost < 1 ? ghost : undefined} transform={`translate(${lerp(-120, 0, ghost)} 0)`}>
        <Chromosome x={380} y={470} id="C1" cond={1} rep={-1} scale={1.6} opacity={0.9} />
        <Txt x={380} y={718} size={24} weight={800} fill={INK} anchor="middle">1 centromere · 1 DNA molecule</Txt>
        <Txt x={380} y={744} size={16} weight={600} fill={C.muted} anchor="middle" italic>per chromosome, not a cell count</Txt>
        <Tag x={380} y={270} text="before replication" size={18} anchor="middle" />
      </g>}
      <Arrow x1={470} y1={470} x2={700} y2={470} color={INK} opacity={fi(a('after') - 0.4, 0.4)} />
      <Txt x={585} y={452} size={20} weight={700} fill={INK} anchor="middle" opacity={fi(a('after') - 0.4, 0.4)}>replication</Txt>
      <g opacity={fi(a('after'), 0.4)}>
        <Txt x={820} y={718} size={24} weight={800} fill={INK} anchor="middle">1 centromere · 2 DNA molecules</Txt>
        <Txt x={820} y={744} size={16} weight={600} fill={C.muted} anchor="middle" italic>per chromosome, not a cell count</Txt>
      </g>
      <SentenceStrip x={210} y={782} w={1500} text={SENT} shown={typed(SENT, a('written') - 0.9, 15).length} opacity={fi(a('written'), 0.4)} size={27} />
    </g>
  );
}
