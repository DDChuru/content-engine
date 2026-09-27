/** Beat 3 · Recall: what mitosis gives. The animal MitosisCellModel entered as a labelled EXCERPT (omitted-interval
 * caption held at entry; explicit time cut into anaphase with 8 daughter chromosomes); poleward motion; telophase (count
 * strip changes on the envelope-closing frame); parent-nucleus inset; gene bands pulse; cleavage (count change on the
 * frame the cells part); 5.1.2's context strip by label; the mature red blood cell; the question. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {MitosisCellModel, MSTAGES, MCOUNT, mixM, mLayout} from '../MitosisCellModel';
import {CountStrip} from '../ChromosomeModel';
import {PanelFrame, SkinStrip, GutStrip, RootTip, Human, Strawberry} from '../ContextStrip';
import {RBC, EXCERPT} from '../StemCellLineage';
import {fi, fe, pulse} from '../util';

const CX = 560, CY = 470, SZ = 0.6;
export default function Beat03(s: any) {
  const a = s.a;
  const pole = fe(a('open') - 0.8, 1.6);
  const TEL = 2.4, CYT = 2.4;
  const tel = fe(a('tel'), TEL), cyt = fe(a('cyto'), CYT);
  const m = {...mixM(mixM({...MSTAGES['metaphase'], sep: 1, pole: 0}, MSTAGES['anaphase'], pole), MSTAGES['telophase'], tel), sep: 1};
  const mm = {...mixM(m as any, MSTAGES['cytokinesis'], cyt), sep: 1};
  const closed = a('tel') >= TEL, parted = a('cyto') >= CYT;
  const rows = parted ? MCOUNT.daughters : closed ? MCOUNT.telophase : [{chrom: '8', chromNote: 'daughter chromosomes', dna: 8, comp: 'whole cell'}];
  const G = mLayout({x: CX, y: CY, size: SZ, ...mm});
  const strip = fe(a('growth'), 0.8);
  const lit = (k: number) => (a('repl') >= 0 ? (k === 1 || k === 2 ? 1 : 0) : a('growth') >= 0 ? (k === 0 ? 1 : 0) : 0);
  const dimK = (k: number) => (a('repl') >= 0 && (k === 0 || k === 3) ? 0.6 : 0);
  const PY = 700, PW = 420, PH = 230;
  const px = (k: number) => 70 + k * (PW + 20);
  return (
    <g>
      <Tag x={70} y={206} text="recall: 5.2.1" size={18} /><Tag x={210} y={206} text="recall: 5.1.2" size={18} />
      <Txt x={70} y={258} size={17} weight={600} fill={C.muted} italic opacity={1 - fi(a('tel') - 1.5, 0.6)}>{EXCERPT}</Txt>
      <MitosisCellModel x={CX} y={CY} size={SZ} {...(mm as any)} hiGene={pulse(a('info'), 1.6)} />
      <Txt x={CX} y={CY + 310 * SZ + 22} size={14} weight={600} fill={C.muted} anchor="middle" italic opacity={1 - strip}>schematic; 2n = 4 teaching model</Txt>
      <CountStrip x={1000} y={240} w={800} size={24} rows={rows} />
      {a('num') >= 0 && <g opacity={fi(a('num'), 0.4)}>
        <rect data-role="decor" x={1000} y={420} width={420} height={150} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g data-role="drawing"><circle cx={1070} cy={495} r={50} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={2.5} /></g>
        <Txt x={1136} y={470} size={18} weight={800} fill={T5.ringHalo}>one nucleus: 4 chromosomes · 4 DNA molecules</Txt>
        <Txt x={1136} y={498} size={16} weight={600} fill={C.muted} italic>parent nucleus, before replication</Txt>
        {G.nuclei.map((q, i) => <Txt key={i} x={q[0]} y={q[1] - G.newNr - 10} size={26} weight={800} fill={T5.ringHalo} anchor="middle" opacity={0.4 + 0.6 * pulse(a('num'), 1.6)}>4</Txt>)}
      </g>}
      {a('cyto') >= 0 && <Tag x={1000} y={610} text="genetically identical" size={22} opacity={fi(a('cyto') - CYT, 0.4)} />}
      {strip > 0 && <g opacity={strip} transform={`translate(0 ${(1 - strip) * 120})`}>
        {[0, 1, 2, 3].map((k) => <PanelFrame key={k} x={px(k)} y={PY} w={PW} h={PH} title={['growth', 'replacement', 'repair', 'asexual reproduction'][k]} lit={lit(k)} dim={dimK(k)}>
          {k === 0 && <>{RootTip({x: px(0) + 110, y: PY + 40, s: 0.42, elong: 1}).el}<Human x={px(0) + 300} y={PY + 215} h={160} /></>}
          {k === 1 && <><SkinStrip x={px(1) + 30} y={PY + 40} w={360} h={100} t={0.3} shed={0} /><GutStrip x={px(1) + 60} y={PY + 145} w={300} h={80} t={0.2} shed={0} /></>}
          {k === 2 && <SkinStrip x={px(2) + 30} y={PY + 60} w={360} h={150} cols={9} gap={[3, 5]} fill={1} />}
          {k === 3 && <g transform={`translate(${px(3) + 60} ${PY + 90}) scale(0.62)`}><Strawberry x={80} y={200} L={260} /></g>}
        </PanelFrame>)}
        <Tag x={70} y={PY - 14} text="recall: 5.1.2 context strip" size={16} />
      </g>}
      {a('stop') >= 0 && <g opacity={fi(a('stop'), 0.4)}>
        <circle data-role="decor" cx={1560} cy={495} r={48} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <RBC x={1560} y={495} r={30} />
        <Tag x={1480} y={580} text="specialised; not dividing" size={18} />
      </g>}
      {a('q') >= 0 && <Tag x={440} y={680} text="which cells divide to replace them?" size={26} opacity={fi(a('q'), 0.4)} />}
    </g>
  );
}
