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
import {TP, StartGuide, EndTicks, LostBracket, RunLabel, Captions} from './tel';
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
  const handle = fi(a('handle'), 0.4), hsmall = fe(a('protect'), 0.8);
  const typedS = a('written') < 0 ? '' : a('s1') < 0 ? typed('Written properly:', a('written'), 30) : a('s2') < 0 ? typed(S1, a('s1') + 0.6, 20) : S1 + (a('protect') >= 1.2 ? S2 : typed(S2, a('s2'), (S2.length) / (at('protect') + 1.2 - at('s2'))));
  const sy = 700, sw = 1500, sx = 210;
  const tickHi = [0, 1, 2].map((i) => pulse(a('ticks') - i * 0.5, 0.9));
  return (
    <g>
      {TE && <g>
        <rect data-role="decor" x={120} y={330} width={1700} height={330} rx={16} fill="none" stroke={T5.ring} strokeWidth={4} strokeDasharray="14 10" />
        <Txt x={970} y={362} size={24} weight={800} fill={T5.ringHalo} anchor="middle">thought experiment — not a real chromosome</Txt>
        <TelomereEndModel {...TP} end={end} telo={telo} grow={grow} stop={stop} swap={swap} />
        <RoundCounter x={1560} y={220} value={Math.max(0, round)} label="thought-experiment rounds" opacity={fi(a('away'), 0.4)} />
        {a('lack') >= 0 && <g>
          <rect data-role="decor" x={g.X(NT_ENDS[3])} y={TP.y + TP.copyGap - 30} width={g.X(GENES[1][1]) - g.X(NT_ENDS[3])} height={60} fill="none" stroke={T5.ringHalo} strokeWidth={2} strokeDasharray="5 4" />
          <Ring cx={(g.X(NT_ENDS[3]) + g.X(GENES[1][1])) / 2} cy={TP.y + TP.copyGap} rx={40} ry={50} p={fe(a('lack'), 0.6)} />
          <Tag x={g.X(0.55)} y={TP.y + TP.copyGap + 90} text="part of a gene not copied (thought experiment)" size={19} anchor="middle" />
        </g>}
      </g>}
      {/* the Beat 5 molecule: aside (small, left) during the thought experiment, back to centre (motion) */}
      {(aside > 0 || real || a('thought') < 0) && <g transform={aside > 0 ? `translate(${lerp(0, 40, aside).toFixed(1)} ${lerp(0, 639, aside).toFixed(1)}) scale(${lerp(1, 0.3, aside).toFixed(3)})` : undefined} opacity={TE && aside < 1 && !real && a('back') < 0 ? 1 - 0.3 * aside : 1}>
        {(!TE || aside > 0.02) && <>
          <TelomereEndModel {...TP} end={ENDS[3]} />
          <StartGuide />
          <EndTicks n={3} hi={tickHi} />
          <LostBracket hi={pulse(a('removes'), 1.4)} />
          <RunLabel text="telomere: repeated, non-coding DNA" dy={-120} hi={pulse(a('s1') + 0.5, 1.4)} />
        </>}
      </g>}
      {real && <>
        <RoundCounter x={1560} y={220} value={3} hi={0} />
        <Tag x={1685} y={335} text="typical dividing somatic cells" size={16} anchor="middle" bg={pulse(a('s2'), 1.4) > 0 ? '#FFD9CA' : '#FFFFFF'} />
      </>}
      {handle > 0 && <g opacity={handle < 1 ? handle : undefined}>
        {hsmall < 1 && <g opacity={1 - hsmall}>
          <rect data-role="decor" x={1560} y={560} width={260} height={110} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
          <g data-role="drawing">
            <line x1={1580} y1={630} x2={1760} y2={630} stroke={T5.ringHalo} strokeWidth={3} /><line x1={1580} y1={646} x2={1760} y2={646} stroke={T5.ringHalo} strokeWidth={3} />
            {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={1590 + i * 28} y1={624} x2={1590 + i * 28} y2={652} stroke="#8C7A55" strokeWidth={4} />)}
            <rect x={1762} y={604} width={18} height={50} fill="#8C7A55" /><rect x={1756} y={610} width={30} height={10} fill={T5.ringHalo} />
          </g>
          <Txt x={1580} y={592} size={16} weight={800} fill={T5.ringHalo}>handle</Txt>
        </g>}
        <Txt x={1560} y={600} size={15} weight={600} fill={C.muted} italic opacity={hsmall}>the handle is not the exam answer</Txt>
      </g>}
      <SentenceStrip x={sx} y={sy} w={sw} text={S1 + S2} shown={typedS.length} size={26} opacity={fi(a('written'), 0.4)} label="written properly" />
      {a('protect') >= 0 && <g opacity={fi(a('protect'), 0.4)}>
        <Arrow x1={g.X(0.88)} y1={TP.y - 70} x2={g.X(0.42)} y2={TP.y - 40} color={T5.ring} width={5} bend={-40} />
        {GENES.map(([p0, p1], i) => <rect key={i} data-role="decor" x={g.X(p0) - 8} y={TP.y - 40} width={g.X(p1) - g.X(p0) + 16} height={80} rx={8} fill={T5.ring} opacity={0.45} />)}
      </g>}
      {!TE && a('thought') < 0 && <Captions y={900} />}
      {real && <Captions y={900} compare={0} />}
    </g>
  );
}
