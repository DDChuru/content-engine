import React from 'react';
import {fi, fe, move, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Magnifier, C, Txt, Cite, SCHEM, PARTS, clamp01} from '../kit';
import {WaterField, waterTokens} from '../WaterField';
import {SoluteDot} from '../T4Tokens';
import {InkRing} from '../../shared/src/Type';

/** Beat 1 · Hook and context. A schematic red blood cell in plasma; cut-away cytoplasm; magnifier on its edge. */
export default function Beat01(s: any) {
  const t = gt(s), a = s.a, end = s.sc.duration - s.local;
  const shrink = fe(1.1 - end, 1.1);                       // last 1.1 s: the cell shrinks to the corner thumbnail
  const cx0 = move(a('rbc'), 1.2, 700, 820), cy0 = 600;
  const cx = cx0 + (1710 - cx0) * shrink, cy = cy0 + (300 - cy0) * shrink, r = 150 - 100 * shrink;
  const mag = fe(a('membrane'), 0.7) * (1 - shrink), mx = 1450, my = 560, mr = 200;
  const split = fe(a('layers'), 0.8);
  const plasma = fi(a('plasma'), 0.6);
  // magnifier interior: outside above the band, cytoplasm below
  const band = (y: number, h: number, key: string) => <rect key={key} data-role="drawing" x={mx - mr} y={y} width={2 * mr} height={h} fill="#E8A94A" opacity={0.85} />;
  const q = fi(a('controls'), 0.4);
  const qx = mx + 40, qy = move(a('question'), 0.8, my - 70, my - 8);
  const inT = waterTokens({regions: [[mx - mr + 10, my + 28, mx + mr - 10, my + mr - 8]], n: 12, seed: 7, t});
  const outT = waterTokens({regions: [[mx - mr + 10, my - mr + 8, mx + mr - 10, my - 28]], n: 12, seed: 8, t});
  const sep = a('separate');
  return (
    <g>
      <defs><clipPath id="b1mag"><circle cx={mx} cy={my} r={mr - 2} /></clipPath></defs>
      {plasma > 0 && <rect data-role="decor" x={70} y={200} width={1780} height={740} rx={18} fill="#FBF3DD" opacity={plasma * (1 - shrink)} />}
      <WaterField regions={[[80, 290, 1840, 930]]} n={70} t={t} seed={1} opacity={1 - shrink * 0.7} />
      {[[300, 420], [520, 800], [1150, 360], [1250, 860], [420, 620], [1080, 760]].map(([x, y], i) => <SoluteDot key={i} x={x + 10 * Math.sin(t + i)} y={y + 8 * Math.cos(t * 0.8 + i)} r={9} opacity={fi(a('solutes') - i * 0.12, 0.4) * (1 - shrink)} />)}
      <RBC x={cx} y={cy} r={r} window={fe(a('cyto'), 0.7) * (1 - shrink)} glow={pulse(a('membrane'), 1.6)} />
      {/* cut-away window: cytoplasm water tokens and different solutes inside */}
      {fe(a('cyto'), 0.7) * (1 - shrink) > 0.05 && <g>
        <WaterField regions={[[cx - r * 0.45, cy - r * 0.32, cx + r * 0.3, cy + r * 0.42]]} n={9} t={t} seed={3} r={6} opacity={fi(a('cyto'), 0.6) * (1 - shrink)} />
        {[[-0.3, 0.25], [0.05, -0.12], [0.2, 0.3]].map(([dx, dy], i) => <SoluteDot key={i} x={cx + dx * r} y={cy + dy * r} r={8} shape={i % 2 ? 'tri' : 'square'} opacity={fi(a('solutes') - 0.3 - i * 0.12, 0.4) * (1 - shrink)} />)}
      </g>}
      <Txt x={960} y={250} size={30} weight={700} anchor="middle" opacity={fi(a('hook'), 0.5)}>Ever wondered why a cell doesn't simply mix into the water around it?</Txt>
      <Lbl x={cx} y={cy + r + 42} text="red blood cell" anchor="middle" o={fi(a('rbc'), 0.5) * (1 - shrink)} size={24} />
      <Cite x={cx} y={cy + r + 68} text={SCHEM} anchor="middle" opacity={fi(a('rbc'), 0.5) * (1 - shrink)} />
      <Lbl x={130} y={330} text="plasma (watery)" o={plasma * (1 - shrink)} size={26} fill={C.teal} />
      <Lbl x={cx - 330} y={cy - 40} text="cytoplasm (watery)" anchor="end" o={fi(a('cyto'), 0.5) * (1 - shrink)} size={24} fill={C.teal} lx={cx - r * 0.35} ly={cy - r * 0.05} />
      <Pill x={130} y={380} text="different dissolved substances" o={fi(a('solutes'), 0.5) * (1 - shrink)} />
      {mag > 0 && <Magnifier x={mx} y={my} r={mr * (0.3 + 0.7 * mag)} lx={cx + r} ly={cy} o={mag}>
        <g clipPath="url(#b1mag)" opacity={clamp01(mag * 2 - 1)}>
          <rect data-role="decor" x={mx - mr} y={my - mr} width={2 * mr} height={mr} fill="#FBF3DD" />
          <rect data-role="decor" x={mx - mr} y={my} width={2 * mr} height={mr} fill="#F4EEF2" />
          {split < 1 && band(my - 14, 28, 'b0')}
          {split > 0 && <g opacity={split}>{band(my - 22 - 6 * split, 14, 'b1')}{band(my + 8 + 6 * split, 14, 'b2')}</g>}
          {outT.map((k) => <circle key={k.i} data-role="drawing" cx={k.x} cy={k.y} r={6} fill="#BFE0F5" stroke="#5B9CC4" strokeWidth={1.3} />)}
          {inT.map((k) => <circle key={k.i} data-role="drawing" cx={k.x} cy={k.y} r={6} fill="#BFE0F5" stroke="#5B9CC4" strokeWidth={1.3} />)}
          {q > 0 && <SoluteDot x={qx} y={Math.min(qy, my - 36)} r={10} opacity={q} />}
        </g>
      </Magnifier>}
      <Lbl x={mx} y={my + mr + 40} text="cell surface membrane" anchor="middle" o={mag} size={24} />
      <Pill x={mx + mr + 16} y={my + 6} text="two layers" o={split * (1 - shrink)} />
      <Lbl x={mx - mr + 30} y={my - mr - 16} text="outside" o={fi(sep, 0.4) * (1 - shrink)} size={20} fill={C.teal} />
      <Lbl x={mx - mr + 30} y={my + mr + 70} text="inside" o={fi(sep, 0.4) * (1 - shrink)} size={20} fill={C.teal} />
      {sep > 0 && <InkRing cx={mx - 60} cy={my - 105} rx={120} ry={60} p={fe(sep, 0.6)} opacity={1 - shrink} color={C.teal} />}
      {sep > 0 && <InkRing cx={mx - 40} cy={my + 110} rx={120} ry={60} p={fe(sep - 0.3, 0.6)} opacity={1 - shrink} color={C.teal} />}
      {q > 0 && <Txt x={qx + 34} y={qy - 18} size={56} weight={800} fill={C.primary} opacity={q * (1 - shrink)}>?</Txt>}
      <Cite x={1850} y={930} text={PARTS} anchor="end" opacity={1 - shrink} />
    </g>
  );
}
