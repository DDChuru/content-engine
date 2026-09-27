/** Beat 6 · A thought experiment, and the sentence you write. State no-telomere (caption "thought experiment — not a
 * real chromosome" throughout, dashed accent frame): the grey run fades; rounds run; the end reaches gene 2 and the
 * daughter's copy of that gene is cut short (ringed). Then back to the real state (motion); the handle; the sentence. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Arrow} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {TelomereEndModel, RoundCounter, telGeom, ENDS, NT_ENDS, GENES} from '../TelomereEndModel';
import {Ring} from '../T5Annot';
import {fi, fe, lerp, pulse, between} from '../util';
import {TP, StartGuide, EndTicks, LostBracket, RunLabel, Captions, WideCounter} from './tel';
import {SentenceStrip, typed, stripSpan} from './kit';

const S1 = 'Written properly: telomeres are repeated non-coding DNA at chromosome ends.';
const S2 = ' In typical dividing somatic cells, shortening during repeated replication initially removes telomeric DNA, protecting nearby genes.';
export default function Beat06(s: any) {
  const a = s.a, t = s.local;
  const at = (k: string) => t - a(k);
  const back = fe(a('back'), 1.5), real = a('back') >= 1.5;
  const TE = !real && a('thought') >= 0;                        // thought-experiment state on screen
  const aside = fe(a('thought'), 1.0) * (1 - back);            // Beat 5 molecule set aside, small, then returned
  // thought experiment rounds: [grow start, grow end, swap start]
  const R = [[at('rounds'), at('rounds') + 0.7, at('rounds') + 0.75], [at('rounds') + 1.05, at('rounds') + 1.7, at('rounds') + 1.75], [at('reach'), at('reach') + 2.6, 1e9]];
  let end = lerp(1, NT_ENDS[0], fe(a('away'), 1.5)), grow = 0, stop = NT_ENDS[1], swap = 0, round = a('away') >= 0 ? 0 : -1;
  for (let r = 0; r < 3; r++) {
    const [g0, g1, s0] = R[r]; if (t < g0) break;
    round = r + 1; stop = NT_ENDS[r + 1]; grow = Math.min(1, (t - g0) / (g1 - g0));
    if (t >= s0) { swap = Math.min(1, (t - s0) / 0.3); if (swap >= 1) { end = NT_ENDS[r + 1]; grow = 0; swap = 0; } } else swap = 0;
  }
  const telo = 1 - fe(a('away'), 1.5);
  const g = telGeom(TP);
  // run 009g: outgoing text is gone before incoming text takes its place — the handle inset fades out over 0.4 s from
  // 'protect', and only then does the note fade in (they share a baseline); the thought-experiment frame waits for the
  // set-aside molecule's labels (gone by aside 0.05, ~0.16 s) before it appears.
  const handle = fi(a('handle'), 0.4), hsmall = fe(a('protect'), 0.4), hnote = fe(a('protect') - 0.45, 0.4);
  const teIn = fi(a('thought') - 0.25, 0.3) * (1 - fi(a('back'), 0.3));   // and leaves as the molecule starts back
  const typedS = a('written') < 0 ? '' : a('s1') < 0 ? typed('Written properly:', a('written') - 0.5, 30) : a('s2') < 0 ? typed(S1, a('s1') + 0.6, 20) : S1 + (a('protect') >= 1.2 ? S2 : typed(S2, a('s2'), (S2.length) / (at('protect') + 1.2 - at('s2'))));
  const sy = 700, sw = 1300, sx = 210;   // run 009f: narrower, so the handle inset sits beside it
  const tickHi = [0, 1, 2].map((i) => pulse(a('ticks') - i * 0.5, 0.9));
  const lab = Math.max(0, 1 - aside * 20);                     // labels leave before the set-aside model shrinks (>= 17 px rule)
  // Memory hook (run 009f, RULE-MEMORY-HOOKS): each link spoken and lit with its target — buffer ↔ the grey telomere run,
  // track ↔ the nearby gene bands, "takes the loss first" ↔ the lost-from-the-telomere bracket, "stays intact" ↔ the genes —
  // then the completed mapping held (2 s digital-silence hold before "Written properly"); the card gives way to the sentence.
  const L = (k: string) => a(k) >= 0, done = a('lintact') >= 1.6 || a('written') >= 0;
  const lit = (k: string, nx: string | null) => !L(k) ? 0 : done ? 1 : (nx && L(nx)) ? 0.45 : fi(a(k), 0.3);
  const hBuf = lit('lbuf', 'ltrack'), hTrack = Math.max(lit('ltrack', 'lloss'), L('lintact') ? lit('lintact', null) : 0), hLoss = lit('lloss', 'lintact');
  const hookOn = 1 - fi(a('written'), 0.5), cardO = fi(a('lbuf'), 0.4) * hookOn;
  const ROWS: any[] = [['buffer', 'the telomere: the repeated DNA at the tip', hBuf, 'lbuf'], ['track', 'the nearby genes', hTrack, 'ltrack'], ['the buffer takes the loss first', 'the track (the genes) stays intact', Math.max(hLoss, lit('lintact', null)), 'lloss']];
  return (
    <g>
      {TE && teIn > 0 && <g opacity={teIn < 1 ? teIn : undefined}>
        <rect data-role="decor" x={120} y={330} width={1700} height={330} rx={16} fill="none" stroke={T5.ring} strokeWidth={4} strokeDasharray="14 10" />
        <Txt x={970} y={362} size={24} weight={800} fill={T5.ringHalo} anchor="middle">thought experiment — not a real chromosome</Txt>
        <TelomereEndModel {...TP} end={end} telo={telo} grow={grow} stop={stop} swap={swap} />
        <WideCounter x={1545} y={220} value={Math.max(0, round)} label="thought-experiment rounds" opacity={fi(a('away'), 0.4)} />
        <Captions x={600} y={712} run={0} opacity={fi(a('thought'), 0.4)} />
        {a('lack') >= 0 && <g>
          <rect data-role="decor" x={g.X(NT_ENDS[3])} y={TP.y + TP.copyGap - 30} width={g.X(GENES[1][1]) - g.X(NT_ENDS[3])} height={60} fill="none" stroke={T5.ringHalo} strokeWidth={2} strokeDasharray="5 4" />
          <Ring cx={(g.X(NT_ENDS[3]) + g.X(GENES[1][1])) / 2} cy={TP.y + TP.copyGap} rx={40} ry={50} p={fe(a('lack'), 0.6)} />
          <Tag x={g.X(0.4)} y={TP.y + TP.copyGap + 90} text="part of a gene not copied (thought experiment)" size={20} anchor="middle" />
        </g>}
      </g>}
      {/* the Beat 5 molecule: aside (small, left) during the thought experiment, back to centre (motion) */}
      {(aside > 0 || real || a('thought') < 0) && <g transform={aside > 0 ? `translate(${lerp(0, 40, aside).toFixed(1)} ${lerp(0, 639, aside).toFixed(1)}) scale(${lerp(1, 0.3, aside).toFixed(3)})` : undefined} opacity={TE && aside < 1 && !real && a('back') < 0 ? 1 - 0.3 * aside : 1}>
        {(!TE || aside > 0.02) && <>
          <TelomereEndModel {...TP} end={ENDS[3]} hiRun={hBuf * hookOn} hiGenes={hTrack * hookOn} />
          <StartGuide labels={lab} />
          <EndTicks n={3} hi={tickHi} labels={lab} />
          <LostBracket hi={Math.max(pulse(a('removes'), 1.4), hLoss * hookOn)} labels={lab} />
          <RunLabel text="telomere: repeated, non-coding DNA" dy={-120} hi={Math.max(pulse(a('s1') + 0.5, 1.4), hBuf * hookOn)} labels={lab} />
        </>}
      </g>}
      {real && <>
        <RoundCounter x={1560} y={220} value={3} hi={0} />
        <Tag x={1685} y={200} text="typical dividing somatic cells" size={20} anchor="middle" bg={pulse(a('s2'), 1.4) > 0 ? '#FFD9CA' : '#FFFFFF'} />
      </>}
      {handle > 0 && <g opacity={handle < 1 ? handle : undefined}>
        {hsmall < 1 && <g opacity={1 - hsmall}>
          <rect data-role="decor" x={1540} y={650} width={290} height={150} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
          {hTrack * hookOn > 0 && <rect data-role="decor" x={1552} y={722} width={196} height={48} rx={8} fill={T5.ring} opacity={0.5 * hTrack * hookOn} />}
          {Math.max(hBuf, hLoss) * hookOn > 0 && <rect data-role="decor" x={1748} y={690} width={52} height={92} rx={8} fill={T5.ring} opacity={0.5 * Math.max(hBuf, hLoss) * hookOn} />}
          <g data-role="drawing">
            <line x1={1560} y1={738} x2={1760} y2={738} stroke={T5.ringHalo} strokeWidth={3} /><line x1={1560} y1={756} x2={1760} y2={756} stroke={T5.ringHalo} strokeWidth={3} />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={1568 + i * 28} y1={730} x2={1568 + i * 28} y2={764} stroke="#8C7A55" strokeWidth={4} />)}
            <rect x={1762} y={706} width={22} height={62} fill="#8C7A55" /><rect x={1754} y={714} width={38} height={12} fill={T5.ringHalo} />
          </g>
          <Txt x={1560} y={684} size={22} weight={800} fill={T5.ringHalo}>handle</Txt>
          <Txt x={1560} y={792} size={20} weight={700} fill={T5.ringHalo}>track</Txt>
          <Txt x={1812} y={684} size={20} weight={700} fill={T5.ringHalo} anchor="end">buffer</Txt>
        </g>}
        <Txt x={1540} y={660} size={20} weight={600} fill={C.muted} italic opacity={hnote}>the handle is not</Txt>
        <Txt x={1540} y={684} size={20} weight={600} fill={C.muted} italic opacity={hnote}>the exam answer</Txt>
      </g>}
      {cardO > 0 && <g opacity={cardO < 1 ? cardO : undefined}>
        <rect data-role="decor" x={210} y={660} width={1300} height={196} rx={14} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2} />
        <Txt x={232} y={694} size={21} weight={800} fill="#6F6A60" italic>the handle — a memory aid, not the exam answer</Txt>
        {ROWS.map(([w, tg, h, k]: any, i: number) => { const y = 742 + i * 48, o = fi(a(k), 0.3); return o > 0 ? <g key={k} opacity={o < 1 ? o : undefined}>
          {h > 0 && <rect data-role="decor" x={222} y={y - 32} width={1276} height={44} rx={10} fill={T5.ring} opacity={0.42 * h} />}
          <Txt x={236} y={y} size={25} weight={800} fill={T5.ringHalo}>{w}</Txt>
          <Txt x={i < 2 ? 380 : 660} y={y} size={25} weight={800} fill={T5.ringHalo}>→</Txt>
          <Txt x={i < 2 ? 420 : 700} y={y} size={24} weight={700} fill={T5.ringHalo}>{tg}</Txt>
        </g> : null; })}
      </g>}
      <SentenceStrip x={sx} y={sy} w={sw} text={S1 + S2} shown={typedS.length} size={26} opacity={fi(a('written') - 0.5, 0.4)} label="written properly" />
      {a('protect') >= 0 && <g opacity={fi(a('protect'), 0.4)}>
        <Arrow x1={g.X(0.84)} y1={TP.y - 48} x2={g.X(0.42)} y2={TP.y - 44} color={T5.ring} width={5} bend={-36} />
        {GENES.map(([p0, p1], i) => <rect key={i} data-role="decor" x={g.X(p0) - 8} y={TP.y - 40} width={g.X(p1) - g.X(p0) + 16} height={80} rx={8} fill={T5.ring} opacity={0.45} />)}
      </g>}
      {!TE && a('thought') < 0 && <Captions y={880} />}
      {real && <Captions y={900} compare={0} />}
    </g>
  );
}
