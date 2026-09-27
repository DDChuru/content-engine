/** Beat 9 · The handle, and the sentence you write. Copy · share · split icons over the S, M and C arcs (the handle:
 * not an exam answer); the sentence written clause by clause with the matching arc and graph segment glowing; a
 * labelled replay of the separation in the inset; the hook scene returns small. */
import React from 'react';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {onRing, ARCS} from '../CellCycleWheel';
import {fi, fe, lerp, pulse, between} from '../util';
import {Stage, W, ALL} from './stage';
import {SentenceStrip, typed, INK} from './kit';

const SENT = 'Written properly: DNA is replicated during the S phase of interphase; mitosis then separates the copies into two nuclei; cytokinesis divides the cytoplasm.';
export default function Beat09(s: any) {
  const a = s.a;
  const replaySep = a('cl2') >= 0 && a('ident') < 0;
  const replayId = a('ident') >= 0 && a('why') < 2.5;
  const ins: any = replaySep ? {on: 1, cell: 1, rep: 1, cond: 1, poles: 1, fibres: 1, equator: 1, align: 1, sep: a('cl2') >= 0.8 ? 1 : 0, dist: fe(a('cl2') - 0.8, 1.8)}
    : replayId ? {on: 1, cell: 1, rep: 1, cond: 1, align: 1, poles: 0, fibres: 0, equator: 0, hiGene: 0.5 + 0.5 * pulse(a('ident') - 0.3, 1.2)}
    : {on: 1, cell: 1, nucleus: 1, cellGrow: 0.2, rep: -1, cond: 0};
  const icons = fi(a('handle'), 0.4);
  const ic = (k: string, f: number) => { const q = onRing(W.cx, W.cy, W.R + W.thick / 2 + 40, f); return {x: q[0], y: q[1]}; };
  const P = [ic('copy', (ARCS.s[0] + ARCS.s[1]) / 2), ic('share', (ARCS.m[0] + ARCS.m[1]) / 2), ic('split', (ARCS.c[0] + ARCS.c[1]) / 2)];
  const glS = fi(a('cl1'), 0.3) * (1 - fi(a('cl2'), 0.3)), glM = fi(a('cl2'), 0.3) * (1 - fi(a('cl3'), 0.3)), glC = fi(a('cl3'), 0.3) * (1 - fi(a('ident'), 0.3));
  const why = fi(a('why'), 0.4), pinch = fe(a('why') - 0.5, 2);
  const shown = typed(SENT, a('written') + 0.0, 16).length;
  return (
    <Stage wheel={{labels: ALL, bracket: 1, caption: 1, marker: 1, pos: 1.05, lit: {s: glS * 0.8, m: glM * 0.8, c: glC * 0.8}, inset: ins}}
      graph={{pen: 1.12, hiRise: glS, hiM: glM, hiDrop: glC}} insetCap={1}>
      {(replaySep || replayId) && <Tag x={W.cx} y={W.cy - 130} text="replay: mitosis" size={15} anchor="middle" bg="#EAF0F8" />}
      {icons > 0 && <g opacity={icons < 1 ? icons : undefined}>
        <g data-role="drawing">
          <rect x={P[0].x - 22} y={P[0].y - 18} width={26} height={32} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} /><rect x={P[0].x - 10} y={P[0].y - 10} width={26} height={32} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
          <path d={`M${P[1].x - 20} ${P[1].y}H${P[1].x - 2}L${P[1].x + 18} ${P[1].y - 14}M${P[1].x - 2} ${P[1].y}L${P[1].x + 18} ${P[1].y + 14}`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <circle cx={P[2].x - 11} cy={P[2].y} r={12} fill="none" stroke={INK} strokeWidth={2.5} /><circle cx={P[2].x + 13} cy={P[2].y} r={12} fill="none" stroke={INK} strokeWidth={2.5} />
        </g>
        <Tag x={75} y={300} text="the handle: not an exam answer" size={16} bg="#FFF3EC" />
      </g>}
      <SentenceStrip x={890} y={690} w={950} text={SENT} shown={shown} size={26} opacity={fi(a('written'), 0.4)} label="the sentence you write" />
      <Tag x={W.cx} y={W.cy + 120} text="same bands on both copies" size={16} anchor="middle" opacity={between(a('ident') - 0.4, a('why') - 2.5)} />
      {why > 0 && <g opacity={why < 1 ? why : undefined}>
        <rect data-role="decor" x={1500} y={832} width={340} height={112} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g data-role="drawing">
          {[0, 1, 2, 3].map((i) => <rect key={i} x={1512 + i * 58} y={892} width={54} height={40} rx={6} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />)}
          <path d={`M${1570 + 2} ${892}H${1570 + 52}V${892 - 40 * pinch}H${1572}Z`} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />
        </g>
        <Txt x={1760} y={872} size={16} weight={800} fill={INK} anchor="middle">growth ·</Txt>
        <Txt x={1760} y={894} size={16} weight={800} fill={INK} anchor="middle">replacement</Txt>
        <Txt x={1512} y={856} size={13} weight={600} fill="#6F6A60" italic>hook scene; schematic</Txt>
      </g>}
    </Stage>
  );
}
