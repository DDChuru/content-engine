/** Beat 4 · Why the daughter nuclei are identical. IdenticalChain builds round the anaphase cell: links write; a labelled
 * anaphase replay; telophase (envelopes re-form, nucleoli reappear, chromosomes decondense) with the count strip changing on
 * the frame the envelopes close; 4 = 4; cleavage furrow (count strip changes on the frame the cells part); daughter set
 * cards with matching bands; model/human tags; the handle stamps; the converted sentence clause by clause. MEMORY HOOK
 * rule: each hook word and its target clause are highlighted together as spoken; a 2 s silent hold follows (audio). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {MSTAGES, MCOUNT, mixM} from '../MitosisCellModel';
import {Ring} from '../T5Annot';
import {ChainBody, ChainStrip, cellGeom, IC, LINKS} from '../IdenticalChain';
import {fi, fe, lerp, pulse} from '../util';
import {SentenceStrip, stripSpan, typed} from './kit';
import {SENT} from './strip';

export const SX = 1080, SY = 640, SW = 770;
export default function Beat04(s: any) {
  const a = s.a;
  const TEL = 3.0, CYT = 2.6;
  const replay = a('share') >= 0 && a('share') < 2.4;
  const pole = a('share') < 0 ? 1 : a('share') < 2.4 ? lerp(0.35, 1, fe(a('share'), 2.2)) : 1;
  const tel = fe(a('nuclei'), TEL), cyt = fe(a('cyto'), CYT);
  const base = mixM(MSTAGES['anaphase'], MSTAGES['telophase'], tel);
  const m = {...mixM(base, MSTAGES['cytokinesis'], cyt), sep: 1, pole};
  const closed = a('nuclei') >= TEL, parted = a('cyto') >= CYT;
  const rows = parted ? MCOUNT.daughters : closed ? MCOUNT.telophase : MCOUNT.arrived;
  const G = cellGeom(m);
  const w = (k: string, d = 2.2) => fe(a(k), d);
  const reveal = [w('copy'), w('share'), w('info')];
  const hook1 = Math.max(pulse(a('handle'), 1.4), a('c1') >= 0 && a('c2') < 0 ? 1 : 0, a('c2') >= 0 ? 0.45 : 0);
  const hook2 = Math.max(pulse(a('handle') - 0.8, 1.4), a('c2') >= 0 ? 1 : 0);
  const shown = a('wp') < 0 ? 0 : a('c1') < 0 ? 0 : a('c2') < 0 ? Math.min(46, typed(SENT, a('c1'), 16).length) : 46 + typed(SENT.slice(46), a('c2'), 20).length;
  const sp1 = stripSpan(SX, SY, SW, SENT, 'replication makes identical sister chromatids'), sp2 = stripSpan(SX, SY, SW, SENT, 'gives each daughter nucleus one copy of every chromosome');
  const nucR = G.newNr;
  return (
    <g>
      <ChainStrip reveal={reveal} hi={[Math.max(pulse(a('copy'), 1.6), hook1 * (a('wp') >= 0 ? 1 : 0)), Math.max(pulse(a('share'), 1.6), hook2 * (a('wp') >= 0 ? 1 : 0)), pulse(a('info'), 1.6)]} stamp={[fi(a('handle'), 0.4), fi(a('handle') - 0.8, 0.4)]} frames={fi(s.local, 0.6)} />
      <ChainBody m={m} rows={rows} parentOp={fi(s.local, 0.6)} parentHi={Math.max(pulse(a('copy'), 1.8), pulse(a('same'), 1.6))} parentGlow={pulse(a('same'), 1.6)}
        cardsOp={fi(a('cards'), 0.6)} cardsHi={pulse(a('cards') - 0.6, 1.6)} lines={fe(a('cards') - 0.6, 1.4)} />
      {replay && <Tag x={IC.cx - 70} y={IC.cy - 310 * IC.size - 12} text="Replay: anaphase" size={17} opacity={fi(a('share'), 0.3) * (1 - fi(a('share') - 2.0, 0.3))} />}
      {a('same') >= 0 && a('cyto') < 0 && <g>
        {G.nuclei.map((q, i) => <Ring key={i} cx={q[0]} cy={q[1]} rx={nucR + 16} ry={nucR + 16} p={fe(a('same'), 0.6)} />)}
        <Ring cx={IC.parent[0] + 94} cy={IC.parent[1] + 56} rx={112} ry={72} p={fe(a('same'), 0.6)} />
      </g>}
      {a('same') >= 0 && <Tag x={IC.parent[0] + 30} y={IC.parent[1] + 170} text="4 = 4" size={26} opacity={fi(a('same'), 0.4)} />}
      {a('err') >= 0 && <Txt x={1290} y={318} size={16} weight={600} fill={C.muted} italic opacity={fi(a('err'), 0.4)}>identical unless a copying error occurs; mutation: 5.1.6</Txt>}
      {a('four') >= 0 && <Tag x={SX} y={498} text="model cell: 4 per daughter cell" size={20} opacity={fi(a('four'), 0.4)} />}
      {a('human') >= 0 && <Tag x={SX} y={548} text="typical diploid human somatic cell: 46 per daughter nucleus" size={20} opacity={fi(a('human'), 0.4)} />}
      {a('wp') >= 0 && <SentenceStrip x={SX} y={SY} w={SW} text={SENT} shown={shown} size={26} opacity={fi(a('wp'), 0.4)} />}
      {sp1 && hook1 > 0 && a('c1') >= 0 && <rect data-role="decor" x={sp1[0] - 4} y={sp1[2] - 26} width={sp1[1] - sp1[0] + 8} height={34} rx={8} fill={T5.ring} opacity={0.35 * hook1} />}
      {sp2 && a('c2') >= 0 && <rect data-role="decor" x={sp2[0] - 4} y={sp2[2] - 26} width={sp2[1] - sp2[0] + 8} height={34} rx={8} fill={T5.ring} opacity={0.35 * hook2} />}
      {a('wp') >= 0 && <Txt x={SX} y={SY - 14} size={16} weight={700} fill={C.muted} italic opacity={fi(a('c1'), 0.4)}>memory aid: copy → replication · share one of each → separation (not the exam answer)</Txt>}
    </g>
  );
}
