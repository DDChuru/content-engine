/** Beat 1 · Hook and context. A knee graze closes (cells at the edges divide, new cells slide in); set cards ask "same
 * set?"; the graze reduces into the repair panel of the four-panel strip and each panel fills with its motion; dividing
 * glyphs (a late-mitosis excerpt, captioned) pulse; set cards match within each panel; dissolve to objectives. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Knee, kneeGraze, SetCard, DivGlyph, SET_NOTE} from '../ContextStrip';
import {Leader} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {Panel, rects, mixR, toPage, EXCERPT, Rect} from './strip';
import {Caption} from './kit';

export default function Beat01(s: any) {
  const a = s.a, L = s.local;
  const toStrip = fe(a('grow'), 1.2);
  const hookR: Rect = {x: 900, y: 290, w: 900, h: 620};
  const eq = rects('equal', 0, 400, 900);
  const R = eq.map((r, i) => (i === 2 ? mixR([hookR], [r], toStrip)[0] : r));
  const t = L * 0.22;
  const heal = fe(a('heal'), 3.6);
  const out = 1 - 0.6 * fi(a('how') - 1.4, 1.0);
  const div = (k: number) => a('divide') >= 0 ? Math.min(1, (a('divide') - k * 0.35) / 2.2) : 0;
  const info = (k: number) => pulse(a('info') - k * 1.0, 1.6) + (a('info') - k * 1.0 > 0.8 ? 0.35 : 0);
  const cards = (k: number, shown: number, glow: number) => shown > 0 ? <g>
    <SetCard x={16} y={8} s={0.62} kind="rod" op={shown} glow={glow} tag="parent cell" />
    <SetCard x={464} y={8} s={0.62} kind="rod" op={shown} glow={glow} tag="new cells" />
  </g> : null;
  const kneeOp = 1 - fi(a('grow'), 0.8);
  const [gx, gy] = kneeGraze(420, 560, 1.25);
  const glyph = (k: number, px: number, py: number, plant = false) => {
    const u = div(k);
    if (u <= 0) return null;
    const big = k === 0 ? 1 + 1.6 * fe(a('how'), 1.0) : 1;
    return <DivGlyph x={px} y={py} size={0.16 * big} u={u} plant={plant} />;
  };
  return (
    <g opacity={out < 1 ? out : undefined}>
      <Caption x={90} y={250} size={30} maxW={kneeOp > 0 ? 760 : 1700} text="Ever wondered how a grazed knee heals over with new skin that is still, gene for gene, yours?" />
      {kneeOp > 0 && <g opacity={kneeOp}>
        <Knee x={420} y={560} s={1.25} />
        <Leader x1={gx + 16} y1={gy} x2={900} y2={560} />
        {a('same') >= 0 && <g opacity={fi(a('same'), 0.5)}>
          <Txt x={1350} y={292 - 14} size={22} weight={800} fill={T5.ringHalo} anchor="middle">same set?</Txt>
        </g>}
      </g>}
      {[0, 1, 2, 3].map((k) => {
        const shown = k === 2 ? 1 : fi(a('grow') - 0.6, 0.6);
        const st = k === 0 ? {grow: fe(a('grow') - 0.4, 2.6), elong: fe(a('grow') - 0.4, 3), humanOp: 1}
          : k === 1 ? {t: a('skin') >= 0 ? t : 0, shed: a('skin') >= 0 ? 1 : 0}
          : k === 2 ? {t, fill: heal, diff: heal, shed: 1, divU: a('heal') >= 0 && heal < 1 ? (a('heal') * 0.8) % 1 : 0}
          : {runner: fe(a('straw'), 2.6), roots: fe(a('straw') - 2.4, 1.2), leaf: fe(a('straw') - 3.0, 1.4)};
        const gutOp = k === 1 ? fi(a('gut'), 0.5) : 1;
        return (
          <Panel key={k} k={k} r={R[k]} st={st} title={0} op={shown} lit={k === 2 && a('grow') < 0 ? 0 : 0}>
            {k === 1 && gutOp < 1 && <rect data-role="decor" x={40} y={240} width={520} height={170} fill="#FFFFFF" opacity={1 - gutOp} />}
            {k === 2 && a('grow') < 0 && a('same') >= 0 && cards(2, fi(a('same'), 0.5), 0)}
            {a('info') >= 0 && cards(k, 1, info(k))}
            {k === 0 && glyph(0, 300, 220, true)}
            {k === 1 && glyph(1, 300, 200)}
            {k === 2 && glyph(2, 300, 90)}
            {k === 3 && glyph(3, 300, 180, true)}
          </Panel>
        );
      })}
      {a('divide') >= 0 && <Txt x={70} y={948} size={15} weight={600} fill={C.muted} italic opacity={fi(a('divide'), 0.4)}>{EXCERPT}</Txt>}
      {a('info') >= 0 && <Txt x={1850} y={948} size={15} weight={600} fill={C.muted} italic anchor="end" opacity={fi(a('info'), 0.4)}>{SET_NOTE}</Txt>}
    </g>
  );
}
