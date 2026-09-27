/** Beat 4 · Where the telomere sits, and what it is. From the labelled X, a ring on one chromatid's upper tip and a
 * continuous zoom into it, resolving into TelomereEndModel (real state); DNA strip, two genes, the grey run labelled as
 * a whole (never block by block), TTAGGG on the run, "end of chromosome". */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Arrow} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom} from '../ChromosomeModel';
import {TelomereEndModel, telGeom, GENES} from '../TelomereEndModel';
import {Ring, Label} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {TP, RunLabel, BLOCKNOTE} from './tel';

export default function Beat04(s: any) {
  const a = s.a;
  const X: any = {x: 960, y: 590, id: 'C1', cond: 1, rep: 1, scale: 1.5};
  const G = chromGeom(X);
  const tip = G.sides[1].top;
  const z = fe(a('zoom') - 0.8, 2.2);                     // continuous zoom into the tip
  const k = Math.exp(lerp(0, Math.log(9), z));
  const xo = fi(a('zoom') - 2.4, 0.6);                     // the model resolves as the zoom ends
  const g = telGeom(TP);
  const genesO = [fi(a('genes'), 0.4), fi(a('genes') - 0.8, 0.4)];
  const sweep = a('rep') >= 0 && a('ttaggg') < 0 ? Math.min(1, a('rep') / 1.8) : -1;
  const ends = [G.sides[-1].top, G.sides[1].top, G.sides[1].bottom, G.sides[-1].bottom];
  return (
    <g>
      <defs><clipPath id="zclip"><rect x={70} y={200} width={1780} height={740} /></clipPath></defs>
      {xo < 1 && <g clipPath="url(#zclip)"><g opacity={xo > 0 ? 1 - xo : undefined} transform={`translate(${lerp(tip[0], g.X(1) - 30, z).toFixed(1)} ${lerp(tip[1], TP.y, z).toFixed(1)}) scale(${k.toFixed(3)}) translate(${-tip[0]} ${-tip[1]})`}>
        <Chromosome {...X} />
        {z < 0.05 && <>
          <Label x={X.x + 90} y={X.y - 50} text="sister chromatids" size={20} />
          <Label x={X.x - 60} y={X.y + 6} text="centromere" size={20} anchor="end" />
          {ends.map((q: number[], i: number) => <Label key={i} x={q[0] + (i === 0 || i === 3 ? -28 : 28)} y={q[1] + (i < 2 ? -14 : 30)} text="telomere" size={20} anchor={i === 0 || i === 3 ? 'end' : 'start'} />)}
          <Txt x={X.x} y={X.y + 330} size={20} weight={600} fill={C.muted} italic anchor="middle">drawn condensed for clarity</Txt>
        </>}
      </g></g>}
      {z < 0.2 && <Ring cx={tip[0]} cy={tip[1] + 10} rx={30} ry={30} p={fe(a('zoom'), 0.6)} />}
      {xo > 0 && <g opacity={xo < 1 ? xo : undefined}>
        <TelomereEndModel {...TP} hiRun={a('seq') >= 0 && a('rep') < 0 ? fi(a('seq'), 0.4) : 0} sweep={sweep} />
        <Tag x={TP.x} y={300} text="schematic; Z2-like scale" size={20} />
        <Label x={TP.x - 20} y={TP.y + 8} text="DNA" size={24} anchor="end" opacity={fi(a('dna'), 0.4)} />
        {GENES.map(([p0, p1], i) => <g key={i} opacity={genesO[i]}>
          <Ring cx={(g.X(p0) + g.X(p1)) / 2} cy={TP.y} rx={30} ry={46} p={Math.min(1, fe(a('genes') - i * 0.8, 0.5))} opacity={1 - fi(a('tel'), 0.4)} />
          <Label x={(g.X(p0) + g.X(p1)) / 2} y={TP.y + 70} text="gene" size={22} anchor="middle" />
        </g>)}
        <RunLabel text={a('noncoding') >= 0 ? 'telomere: repeated, non-coding DNA' : 'telomere'} opacity={fi(a('tel'), 0.4)} hi={pulse(a('tel'), 1.2)} seq={0} />
        <Txt x={TP.x} y={TP.y + 190} size={20} weight={600} fill={C.muted} italic opacity={fi(a('rep') - 0.6, 0.4)}>{BLOCKNOTE}</Txt>
        {a('ttaggg') >= 0 && <g opacity={fi(a('ttaggg'), 0.4)}>
          <Tag x={(g.X(0.62) + g.X(1)) / 2} y={TP.y - 124} text="repeat in humans: TTAGGG" size={20} anchor="middle" />
          <Txt x={(g.X(0.62) + g.X(1)) / 2} y={TP.y - 158} size={20} weight={600} fill={C.muted} italic anchor="middle">a real-world detail: it names the sequence, not the amount lost</Txt>
        </g>}
        {a('tip') >= 0 && <g opacity={fi(a('tip'), 0.4)}>
          <Arrow x1={g.X(0.54)} y1={TP.y + 110} x2={g.X(1)} y2={TP.y + 110} color={T5.ringHalo} />
          <Label x={g.X(1) + 10} y={TP.y + 8} text="end of chromosome" size={20} />
        </g>}
      </g>}
    </g>
  );
}
