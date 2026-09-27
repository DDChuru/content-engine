/** Beat 3 · DNA, wound around histone proteins. Z2 helix strip → Z1 DNA wound round histone beads (motion);
 * sentence strip written clause by clause; small human-scale replay packing into the nucleus. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {HelixStrip, HistoneFiber, fiberBead} from '../ChromosomeModel';
import {Ring, Trace, Label} from '../T5Annot';
import {fi, fe, lerp, between} from '../util';
import {SentenceStrip, typed, stripSpan, HookNucleus, INK} from './kit';

const SENT = 'Before replication, a chromosome contains one long DNA molecule associated with histone proteins.';
export default function Beat03(s: any) {
  const a = s.a;
  const hx = 460, hy = 430, hl = 1000, amp = 30, per = 120;
  const toZ1 = fe(a('wind'), 0.9);
  const strandPts = (ph: number, upto: number) => { const n = 80, out: number[][] = []; for (let i = 0; i <= n * upto; i++) { const t = i / n; out.push([hx + t * hl, hy + amp * Math.sin(2 * Math.PI * (t * hl / per) + ph)]); } return out; };
  const fx = 300, gap = 165, r = 36, lead = 90, beads = 7;
  const wound = a('wind') < 0 ? 0 : a('succ') < 0 ? clamp01(a('wind') / 2.4) : 1 + (beads - 1) * clamp01(a('succ') / 2.8);
  const shown = a('wind') < 0 ? 0 : a('succ') < 0 ? 1 + clamp01((a('wind') - 0.3) / 0.6) * 0.99 : 1.99 + (beads - 1) * clamp01(a('succ') / 2.6);
  const sy = lerp(980, 640, fe(a('written'), 0.7));
  const txt = typed(SENT, a('sentence'), 22);
  const sp1 = stripSpan(260, sy, 1400, SENT, 'one long DNA molecule'), sp2 = stripSpan(260, sy, 1400, SENT, 'histone proteins');
  const ringDNA = fe(a('sentence') - 1.9, 0.8), ringHist = fe(a('sentence') - 3.6, 0.8);
  const pk = a('pack'), pkO = fi(pk, 0.4), drawIn = fe(pk - 0.6, 2.4);
  return (
    <g>
      <Txt x={300} y={250} size={18} weight={600} fill={C.muted} italic>schematic</Txt>
      {/* Z2: plain two-strand helix strip (no bases) */}
      {toZ1 < 1 && <g opacity={1 - toZ1}>
        <HelixStrip x={hx} y={hy} len={hl} amp={amp} period={per} width={6} />
        <Trace pts={strandPts(0, 1)} p={fe(a('strands'), 1.3)} width={5} opacity={between(a('strands'), a('strands') - 4.5)} />
        <Trace pts={strandPts(Math.PI, 1)} p={fe(a('strands') - 1.3, 1.3)} width={5} opacity={between(a('strands') - 1.3, a('strands') - 4.5)} />
        <Label x={hx + hl + 30} y={hy + 8} text="DNA" size={28} opacity={fi(a('strands') - 0.4, 0.4)} />
        <Tag x={hx} y={hy - 70} text="Z2: a plain helix strip · no bases shown" size={17} opacity={fi(s.local, 0.4)} />
      </g>}
      {/* Z1: DNA wound round histone beads */}
      {toZ1 > 0 && <g opacity={toZ1 < 1 ? toZ1 : undefined}>
        <HistoneFiber x={fx} y={hy} beads={beads} gap={gap} r={r} lead={lead} wound={wound} beadsShown={shown} linkerHi={fe(a('linker'), 0.6) * (1 - fe(a('written'), 0.8) * 0.7)} />
        <Label x={fx} y={hy - 90} text="DNA" size={26} />
        <Label x={fiberBead(fx, 0, gap, lead) - 10} y={hy + 100} text="histone proteins" size={26} opacity={fi(a('histone'), 0.4)} />
        <Tag x={fx + 250} y={hy - 88} text="Z1: DNA on histone beads" size={17} />
        <Txt x={fx + 560} y={hy + 100} size={21} weight={700} fill={INK} opacity={fi(a('linker') - 0.3, 0.4)}>short linking stretches of DNA</Txt>
        <Ring cx={fx + lead + 3 * gap} cy={hy} rx={3.3 * gap} ry={62} p={ringDNA} opacity={1 - fe(a('pack'), 0.6)} />
        <Ring cx={fiberBead(fx, 1, gap, lead)} cy={hy} rx={60} ry={60} p={ringHist} opacity={1 - fe(a('pack'), 0.6)} />
      </g>}
      <SentenceStrip x={260} y={sy} w={1400} text={SENT} shown={txt.length} opacity={fi(a('written'), 0.4)} />
      {sp1 && txt.length > SENT.indexOf('molecule') && <path data-role="decor" d={`M${sp1[0]} ${sp1[2] + 8}H${sp1[1]}`} stroke={T5.ring} strokeWidth={5} />}
      {sp2 && txt.length >= SENT.length - 1 && <path data-role="decor" d={`M${sp2[0]} ${sp2[2] + 8}H${sp2[1]}`} stroke={T5.ring} strokeWidth={5} />}
      {/* human-scale replay: separately ended threads drawn into the nucleus as wrapped beads */}
      {pkO > 0 && <g opacity={pkO < 1 ? pkO : undefined}>
        <rect data-role="decor" x={1468} y={210} width={378} height={250} rx={14} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <HookNucleus x={1566} y={330} r={78} />
        <g data-role="drawing">
          {[0, 1, 2, 3, 4].map((k) => { const L = lerp(150, 0, drawIn); const y0 = 290 + k * 20; return L > 1 ? <path key={k} d={`M${1600} ${y0}L${1600 + L} ${y0 + (k - 2) * 8}`} stroke={T5.dna} strokeWidth={3} strokeLinecap="round" /> : null; })}
          {Array.from({length: 12}, (_, i) => { const on = clamp01(drawIn * 12 - i); const th = i * 0.52, rr = 18 + (i % 3) * 14; return on > 0 ? <circle key={'b' + i} cx={1545 + rr * Math.cos(th)} cy={335 + rr * Math.sin(th)} r={6} fill={T5.histone} stroke={T5.dna} strokeWidth={2} opacity={on} /> : null; })}
        </g>
        <Txt x={1650} y={300} size={17} weight={700} fill={INK}>packing: DNA</Txt>
        <Txt x={1650} y={322} size={17} weight={700} fill={INK}>with histones</Txt>
        <Txt x={1645} y={440} size={14} weight={600} fill={C.muted} italic anchor="middle">typical diploid human cell; schematic, not to scale</Txt>
      </g>}
    </g>
  );
}
