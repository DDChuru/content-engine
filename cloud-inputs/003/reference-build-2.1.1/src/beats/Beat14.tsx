/** Biuret 2: against the white tile; reagent blue; protein → lilac / purple / violet (any of those
 * words); stays blue = negative under these conditions (the reagent's own blue, not no colour);
 * albumen + water controls; what it detects: peptide bonds (MODEL · 2.3.1), at least two; free amino
 * acids give no violet result; correct-only card. */
import React from 'react';
import {BRAND as C, clamp01, lerp} from '../../../shared/src/theme';
import {Txt, Tag, Card, Cite, InkRing, Lines} from '../../../shared/src/Type';
import {Swatch} from '../../../shared/src/Swatch';
import {Tube, Rack} from '../Apparatus';
import {COIStack, QuoteTab, CorrectCard} from '../Panels';
import {CuIon} from '../Molecules';
import {fi, fe, between} from '../util';

const AA = ['#E8B04A', '#7FB069', '#D77A61', '#6C9BD2', '#B48EC7'];
function Chain({x, y, n = 5, linked = true, spread = 0, ring = 0, labels = true}: any) {
  const xs = Array.from({length: n}, (_, i) => x + i * 120 + (linked ? 0 : (i - 2) * 26 * spread));
  const ys = Array.from({length: n}, (_, i) => y + (linked ? (i % 2 ? 16 : -16) : (i % 2 ? 40 : -34) * spread));
  return (
    <g>
      {linked && xs.slice(1).map((xx, i) => <path key={i} d={`M${xs[i] + 30} ${ys[i]}L${xx - 30} ${ys[i + 1]}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />)}
      {xs.map((xx, i) => <circle key={i} cx={xx} cy={ys[i]} r={30} fill={AA[i % 5]} stroke={C.ink} strokeWidth={2.5} />)}
      {labels && xs.map((xx, i) => <Txt key={'t' + i} x={xx} y={ys[i] + 6} size={15} anchor="middle" weight={800} fill={C.ink}>aa</Txt>)}
      {linked && ring > 0 && xs.slice(1).map((xx, i) => <InkRing key={'r' + i} cx={(xs[i] + xx) / 2} cy={(ys[i] + ys[i + 1]) / 2} rx={36} ry={30} p={clamp01(ring * 1.4 - i * 0.2)} />)}
    </g>
  );
}

export default function Beat14(s: any) {
  const {a, local} = s;
  const early = 1 - fi(a('what'), 0.5);
  const late = fi(a('what'), 0.5);
  const cuSettle = fe(a('ring') - 0.6, 1.4);
  const aaT = a('aa');
  const vT = clamp01((a('ring') - 1.6) / 1.0);
  return (
    <g>
      {/* white tile behind the rack */}
      <rect x={110} y={270} width={740} height={470} rx={12} fill="#FFFFFF" stroke={C.ink} strokeWidth={2.5} opacity={fi(a('tile'))} />
      <Txt x={130} y={300} size={18} weight={800} fill={C.muted} opacity={fi(a('tile'))}>white tile behind</Txt>
      <Rack x={480} y={500} w={700} h={250} slots={4}>
        <Tube id="P14" x={210} y={400} h={300} w={66} level={0.4} k="blue" to={a('violet') > 0 ? 'lilac' : undefined} t={fe(a('violet'), 1.2)} label="P1" pillY={800} />
        <Tube id="N14" x={390} y={400} h={300} w={66} level={0.4} k="blue" label="P2" opacity={fi(a('neg'))} pillY={800} />
        <Tube id="A14" x={570} y={400} h={300} w={66} level={0.4} k="violet" label="alb" opacity={fi(a('controls'))} pillY={800} />
        <Tube id="W14" x={750} y={400} h={300} w={66} level={0.4} k="blue" label="W" opacity={fi(a('controls') - 0.6)} pillY={800} />
      </Rack>
      <Tag x={390} y={850} text="negative, these conditions" size={17} anchor="middle" opacity={fi(a('neg') - 0.4)} />
      <Txt x={390} y={890} size={17} anchor="middle" weight={800} fill={C.primary} opacity={fi(a('own'))}>the reagent's own blue, not no colour</Txt>
      <Tag x={570} y={372} text="albumen: positive control" size={16} anchor="middle" fill="#1D8A4E" opacity={fi(a('controls'))} />
      <Tag x={750} y={338} text="W: negative control" size={16} anchor="middle" opacity={fi(a('controls') - 0.6)} />
      {/* right, early: reading the colour */}
      <g opacity={early}>
        <g opacity={fi(a('blue'))}>
          <Swatch x={950} y={225} w={220} h={64} k="blue" size={20} />
          <Txt x={1190} y={265} size={21} weight={800}>the reagent</Txt>
        </g>
        <g opacity={fi(a('violet'))}>
          {(['lilac', 'purple', 'violet'] as const).map((k, i) => <Swatch key={k} x={950 + i * 235} y={318} w={215} h={64} k={k} size={20} model={false} />)}
          <Txt x={952} y={404} size={15} weight={700} fill={C.muted}>MODEL swatches · ring code: lilac single, purple / violet double</Txt>
          <Txt x={1660} y={360} size={19} weight={800} fill={C.primary}>any of these words</Txt>
        </g>
        <COIStack x={950} y={440} w={900} cond="KOH then CuSO₄, ≥ 1 min, no heat" obs="lilac" obsK="lilac" inf="protein present" o={fi(a('violet') - 0.8)} i={fi(a('violet') - 2)} hiObs={between(a('ms'), a('neg')) > 0.5} />
        <QuoteTab x={950} y={660} w={900} opacity={fi(a('ms'))} quote={'"protein test – violet / AW"'} source="9700/33 June 2021 Q1(a)(v) mark scheme" size={24} />
        <Cite x={956} y={808} size={16} opacity={fi(a('ms'))} text={'Photograph: no licensed asset identified; lilac beside blue under matched lighting\nwould be commissioned; labelled models shown, never recoloured.'} />
      </g>
      {/* right, late: what it detects */}
      <g opacity={late}>
        <Card x={930} y={220} w={920} h={250} />
        <Txt x={956} y={256} size={20} weight={800} fill={C.muted}>A SHORT PEPTIDE · MODEL · 2.3.1</Txt>
        <g opacity={fi(a('peptide'))}><Chain x={1010} y={345} ring={fe(a('ring'), 1)} /></g>
        {[0, 1, 2, 3].map((i) => {
          const tx = 1010 + i * 120 + 60, ty = 345 + (i % 2 ? 0 : 0);
          return <CuIon key={i} x={lerp(tx + 20, tx, cuSettle)} y={lerp(245, ty - 42, cuSettle)} r={12} opacity={fi(a('ring') - 0.4)} />;
        })}
        <Txt x={1590} y={300} size={21} weight={800} fill={C.primary} opacity={fi(a('ring'))}>peptide bonds ringed</Txt>
        <Txt x={1590} y={328} size={19} weight={700} opacity={fi(a('ring'))}>at least two</Txt>
        <Swatch x={1600} y={360} w={200} h={60} k="blue" to="violet" t={vT} size={19} opacity={fi(a('ring') - 0.4)} />
        <Card x={930} y={490} w={920} h={210} opacity={fi(aaT)} />
        <g opacity={fi(aaT)}>
          <Txt x={956} y={526} size={20} weight={800} fill={C.muted}>FREE AMINO ACIDS · MODEL · no peptide bonds</Txt>
          <Chain x={1045} y={610} linked={false} spread={1} />
          {[0, 1, 2].map((i) => {
            const hx = 1060 + i * 170;
            const bob = Math.sin(local * 3 + i) * 10;
            return <CuIon key={i} x={hx + bob} y={560 + (i % 2) * 90 - 20 + bob} r={12} />;
          })}
          <Swatch x={1600} y={600} w={200} h={60} k="blue" size={19} />
          <Txt x={1600} y={586} size={18} weight={800} fill={C.primary} opacity={fi(a('remains'))}>stays the reagent's blue</Txt>
        </g>
        <CorrectCard x={930} y={720} w={920} h={130} opacity={fi(a('card'))} size={24}
          text={'Positive biuret: protein or sufficiently long peptide;\nfree amino acids do not give the violet result.'} />
      </g>
    </g>
  );
}
Beat14.pin = (s: any) => (s.a('what') > 0 ? 'I' : s.a('violet') > 1.8 ? 'I' : 'O');
