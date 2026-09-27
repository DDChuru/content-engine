import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Magnifier, Stage, C, Txt, Lines, Card, Cite, SCHEM, clamp01, textW} from '../kit';
import {fmmLayout, compPos, FULL, BILAYER, FluidMosaicMembrane} from '../FluidMosaicMembrane';
import {Written, Strike} from '../Panels';
import {T4} from '../t4-palette';

/** Beat 13 · How it is asked (M24/22 Q1(a)(ii), paraphrased; 4.1.1 row syllabus-based), our wording-contrast card
 * (not a mark-scheme reject line), and the callback to the red blood cell. Final frame held 2 s. */
export default function Beat13(s: any) {
  const t = gt(s), a = s.a, u = 30, cy = 380, cx = 1390, show = FULL;
  const hlC = fe(a('row1'), 0.5) * (1 - fe(a('row2'), 0.5));
  const M = {cx, cy, u, t, show, highlight: hlC > 0 ? 'cholesterol' : null, hl: hlC};
  const Lf = fmmLayout(M), co = compPos(M, 'cholOut'), ci = compPos(M, 'cholIn');
  const pol = fi(a('link'), 0.5) * (1 - fe(a('row2'), 0.5));
  const r1 = fe(a('row1'), 0.5), r2 = fe(a('row2'), 0.5), rj = fe(a('reject'), 0.6);
  const cb = fe(a('rbc'), 0.7), best = fi(a('best'), 0.5), tick = fe(a('tick'), 0.5);
  const wrong = 'the OH group of cholesterol points into the hydrophobic core';
  // magnifier on the red blood cell's edge: the bilayer from this lesson, plasma above, cytoplasm below
  const mx = 1560, my = 840, mr = 88;
  return (
    <g>
      {/* forms surface (left) */}
      <Card x={70} y={210} w={800} h={560} fill="#FBF8F1">
        <Txt x={100} y={258} size={30} weight={800} fill={C.primary} opacity={fi(a('open'), 0.4)}>How it is asked</Txt>
      </Card>
      {r1 > 0 && <g opacity={r1}>
        <Txt x={100} y={318} size={26} weight={700}>cholesterol's orientation in the membrane</Txt>
        <Txt x={100} y={348} size={19} weight={600} fill={C.muted}>M24/22 Q1(a)(ii), 1 mark, QP p.3 / MS p.5</Txt>
        <Lines x={100} y={384} size={18} weight={600} fill={C.muted} italic opacity={fi(a('link'), 0.5)} text={'Our paraphrase of M24/22 Q1(a)(ii): one valid link between a cholesterol\nregion\'s polarity and its position earns the available mark.\nScheme wording checked against MS p.5.'} />
        <Pill x={100} y={470} text="validates the 4.1.2 portion only; not a full fluid-mosaic-model question" o={fi(a('part'), 0.5)} size={16} fill={C.primary} />
      </g>}
      {r2 > 0 && <g opacity={r2}>
        <path data-role="decor" d="M100 510H840" stroke={C.line} strokeWidth={2} />
        <Txt x={100} y={556} size={26} weight={700}>describe the fluid mosaic model:</Txt>
        <Txt x={100} y={588} size={26} weight={700}>bilayer, interactions, proteins</Txt>
        <Lines x={100} y={624} size={18} weight={600} fill={C.muted} italic text={'syllabus-based (4.1.1, "describe", p.21); no marked 4.1.1\nquestion in the papers cited for this topic'} />
      </g>}
      {/* the familiar membrane, reduced (right) */}
      <Stage s={s} cx={cx} cy={cy} u={u} mem={M} n={[14, 10]} xw={[Lf.x0 - 40, Lf.x1 + 40]} waterTop={214} waterBottom={500} />
      <Txt x={Lf.x0 - 30} y={cy - 70} size={17} weight={700} fill={C.teal} anchor="end">outside</Txt>
      <Txt x={Lf.x0 - 30} y={cy + 84} size={17} weight={700} fill={C.teal} anchor="end">cytoplasm</Txt>
      {pol > 0 && <g opacity={pol}>
        <Pill x={co.x - 60} y={co.y - 22} text="polar" anchor="end" size={15} fill={C.teal} />
        <Pill x={co.x + 60} y={co.y + 36} text="non-polar" size={15} fill={C.primary} />
      </g>}
      {r2 > 0 && <g opacity={pulse(a('row2') - 0.4, 3.0)}>
        <rect data-role="decor" x={Lf.x0 - 10} y={Lf.outerHead - 16} width={Lf.width + 20} height={32} rx={8} fill="none" stroke={C.teal} strokeWidth={3} />
        <rect data-role="decor" x={Lf.x0 - 10} y={cy - 36} width={Lf.width + 20} height={72} rx={8} fill="none" stroke={C.primary} strokeWidth={3} />
      </g>}
      <Cite x={Lf.x1} y={520} text={SCHEM} anchor="end" />
      {/* reject card: our wording contrast */}
      {rj > 0 && <Card x={910} y={548} w={940} h={150} opacity={rj} fill="#FFFFFF">
        <Written x={934} y={596} text={wrong} size={24} />
        <Strike x1={934 + 26} x2={934 + 26 + textW(wrong, 24, 600)} y={588} p={fe(a('reject') - 0.8, 0.6)} />
        <Written x={934} y={636} ok text="the OH group sits level with the phospholipid heads, towards" size={24} />
        <Txt x={960} y={666} size={24} weight={600} fill="#1D6B40" italic>the water; its rings lie among the tails</Txt>
        <Cite x={1834} y={690} text="our wording contrast; not a mark-scheme reject line" anchor="end" size={15} />
      </Card>}
      {/* callback: the red blood cell in its plasma */}
      {cb > 0 && <g opacity={cb}>
        <RBC x={1180} y={840} r={62} />
        <Txt x={1180} y={930} size={18} weight={700} anchor="middle">red blood cell</Txt>
        <Magnifier x={mx} y={my} r={mr} lx={1242} ly={840}>
          <defs><clipPath id="b13m"><circle cx={mx} cy={my} r={mr - 2} /></clipPath></defs>
          <g clipPath="url(#b13m)">
            <rect data-role="decor" x={mx - mr} y={my - mr} width={2 * mr} height={mr} fill="#FBF3DD" />
            <rect data-role="decor" x={mx - mr} y={my} width={2 * mr} height={mr} fill="#F4EEF2" />
            <FluidMosaicMembrane cx={mx} cy={my} u={16} t={t} show={BILAYER} />
            {best > 0 && <rect data-role="decor" x={mx - mr} y={my - 44} width={2 * mr} height={22} fill="#FFF3C4" opacity={0.7 * best} />}
            {best > 0 && <rect data-role="decor" x={mx - mr} y={my + 22} width={2 * mr} height={22} fill="#FFF3C4" opacity={0.7 * best} />}
            {fi(a('best') - 1.2, 0.5) > 0 && <rect data-role="decor" x={mx - mr} y={my - 14} width={2 * mr} height={28} fill="#EDE7DA" opacity={0.6 * fi(a('best') - 1.2, 0.5)} />}
          </g>
        </Magnifier>
        <Txt x={mx + mr + 12} y={my - 40} size={17} weight={700} fill={C.teal}>plasma</Txt>
        <Txt x={mx + mr + 12} y={my + 54} size={17} weight={700} fill={C.teal}>cytoplasm</Txt>
      </g>}
      {tick > 0 && <g opacity={tick}>
        <Txt x={90} y={862} size={25} weight={700}>Ever wondered why a cell doesn't simply mix into the water around it?</Txt>
        <Txt x={880} y={870} size={48} weight={800} fill="#1D8A4E">✓</Txt>
      </g>}
    </g>
  );
}
