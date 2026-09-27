/** Beat 9 · The handle, and the sentence you write. Copy · share · split icons over the S, M and C arcs (the handle:
 * not an exam answer); the sentence written clause by clause with the matching arc and graph segment glowing; a
 * labelled replay of the separation in the inset; the hook scene returns small. */
import React from 'react';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
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
  // Memory hook (run 009f, RULE-MEMORY-HOOKS): each link spoken and lit together with its target — copy ↔ S arc + the
  // graph's rise, share ↔ M arc (two nuclei), split ↔ C arc + the graph's drop — then the completed mapping held (2 s
  // digital-silence hold before "Written properly"); the mapping card gives way to the written sentence.
  const icons = fi(a('handle'), 0.4);
  const K = ['lc', 'lm', 'ls'];
  const done = a('ls') >= 2.4 || a('written') >= 0;                // the third link has been said: completed mapping
  const link = (i: number) => a(K[i]) < 0 ? 0 : done ? 1 : (i < 2 && a(K[i + 1]) >= 0) ? 0.45 : fi(a(K[i]), 0.3);
  const hk = [0, 1, 2].map(link), cardO = icons * (1 - fi(a('written'), 0.25));   // run 009g: card gone before the sentence strip comes in
  const glS = Math.max(fi(a('cl1'), 0.3) * (1 - fi(a('cl2'), 0.3)), hk[0] * cardO), glM = Math.max(fi(a('cl2'), 0.3) * (1 - fi(a('cl3'), 0.3)), hk[1] * cardO), glC = Math.max(fi(a('cl3'), 0.3) * (1 - fi(a('ident'), 0.3)), hk[2] * cardO);
  const ROWS = [['copy', 'replication, in the S phase', 'S arc · graph rise'], ['share', 'mitosis: copies shared between two new nuclei', 'M arc'], ['split', 'cytokinesis: the cytoplasm divides', 'C arc · graph drop']];
  const icon = (i: number, x: number, y: number) => i === 0
    ? <><rect x={x - 16} y={y - 20} width={24} height={30} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} /><rect x={x - 6} y={y - 12} width={24} height={30} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} /></>
    : i === 1 ? <path d={`M${x - 18} ${y}H${x}L${x + 18} ${y - 13}M${x} ${y}L${x + 18} ${y + 13}`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    : <><circle cx={x - 10} cy={y} r={11} fill="none" stroke={INK} strokeWidth={2.5} /><circle cx={x + 13} cy={y} r={11} fill="none" stroke={INK} strokeWidth={2.5} /></>;
  const why = fi(a('why'), 0.4), pinch = fe(a('why') - 0.5, 2);
  const shown = typed(SENT, a('written') - 0.25, 16).length;
  return (
    <Stage wheel={{labels: ALL, bracket: 1, caption: 1, marker: 1, pos: 1.05, lit: {s: glS * 0.8, m: glM * 0.8, c: glC * 0.8}, inset: ins}}
      graph={{pen: 1.12, hiRise: glS, hiM: glM, hiDrop: glC}} insetCap={1}>
      {(replaySep || replayId) && <Tag x={W.cx} y={W.cy - 130} text="replay: mitosis" size={20} anchor="middle" bg="#EAF0F8" />}
      {cardO > 0 && <g opacity={cardO < 1 ? cardO : undefined}>
        <rect data-role="decor" x={890} y={650} width={950} height={236} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <Txt x={914} y={686} size={21} weight={800} fill="#6F6A60" italic>the handle — a memory aid, not an exam answer</Txt>
        {ROWS.map(([w, t, where]: any, i: number) => { const y = 738 + i * 54, o = fi(a(K[i]), 0.3); return o > 0 ? <g key={w} opacity={o < 1 ? o : undefined}>
          {hk[i] > 0 && <rect data-role="decor" x={902} y={y - 34} width={926} height={48} rx={10} fill={T5.ring} opacity={0.42 * hk[i]} />}
          <g data-role="drawing">{icon(i, 934, y - 8)}</g>
          <Txt x={972} y={y} size={26} weight={800} fill={INK}>{w}</Txt>
          <Txt x={1062} y={y} size={26} weight={800} fill={INK}>→</Txt>
          <Txt x={1100} y={y} size={24} weight={700} fill={INK}>{t}</Txt>
        </g> : null; })}
      </g>}
      <SentenceStrip x={890} y={690} w={950} text={SENT} shown={shown} size={26} opacity={fi(a('written') - 0.25, 0.3)} label="the sentence you write" />
      <Tag x={W.cx} y={W.cy + 120} text="same bands on both copies" size={20} anchor="middle" opacity={between(a('ident') - 0.4, a('why') - 2.5)} />
      {why > 0 && <g opacity={why < 1 ? why : undefined}>
        <rect data-role="decor" x={1500} y={832} width={340} height={112} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g data-role="drawing">
          {[0, 1, 2, 3].map((i) => <rect key={i} x={1512 + i * 58} y={892} width={54} height={40} rx={6} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />)}
          <path d={`M${1570 + 2} ${892}H${1570 + 52}V${892 - 40 * pinch}H${1572}Z`} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />
        </g>
        <Txt x={1762} y={880} size={20} weight={800} fill={INK} anchor="middle">growth ·</Txt>
        <Txt x={1762} y={904} size={20} weight={800} fill={INK} anchor="middle">replacement</Txt>
        <Txt x={1512} y={858} size={20} weight={600} fill="#6F6A60" italic>hook scene; schematic</Txt>
      </g>}
    </Stage>
  );
}
