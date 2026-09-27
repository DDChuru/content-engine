/** 2.1.1 bench apparatus. Every object is drawn, named and placed; handling is motion of these
 * objects. Tube contents use the shared swatch convention (name + hatch code + MODEL). */
import React from 'react';
import {BRAND as C, clamp01, lerp, easeInOut} from '../../shared/src/theme';
import {Txt, Lines, Tag} from '../../shared/src/Type';
import {Fill, NamePill, SW, SwatchKey} from '../../shared/src/Swatch';

export const GLASS = '#E4EEF1';
export const GLASS_EDGE = '#5E6E80';
export const WATER = '#CFE6EE';

/* ---------- handling physics (VIDEO-STRUCTURE "Handling must be physically possible") ----------
 * Liquid surfaces are horizontal in WORLD space: the volume held in the upright vessel is kept, and the
 * surface height in the tilted vessel is found by bisection on the area below a horizontal line. */
export const rotP = (px: number, py: number, cx: number, cy: number, deg: number) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a), dx = px - cx, dy = py - cy;
  return [cx + dx * c - dy * sn, cy + dx * sn + dy * c];
};
/** Area of polygon lying at y >= Y (Sutherland-Hodgman half-plane clip + shoelace). */
export function areaBelow(poly: number[][], Y: number) {
  const out: number[][] = [];
  for (let i = 0; i < poly.length; i++) {
    const A = poly[(i + poly.length - 1) % poly.length], B = poly[i];
    const ina = A[1] >= Y, inb = B[1] >= Y;
    if (inb) { if (!ina) out.push([A[0] + ((B[0] - A[0]) * (Y - A[1])) / (B[1] - A[1]), Y]); out.push(B); }
    else if (ina) out.push([A[0] + ((B[0] - A[0]) * (Y - A[1])) / (B[1] - A[1]), Y]);
  }
  let s2 = 0;
  for (let i = 0; i < out.length; i++) { const P = out[i], Q = out[(i + 1) % out.length]; s2 += P[0] * Q[1] - Q[0] * P[1]; }
  return Math.abs(s2) / 2;
}
/** World y of the horizontal surface holding area V inside poly. */
export function levelY(poly: number[][], V: number) {
  let lo = Math.min(...poly.map((p) => p[1])), hi = Math.max(...poly.map((p) => p[1]));
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (areaBelow(poly, m) > V) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
export function tubePoly(x: number, y: number, h: number, w: number) {
  const r = w / 2, b = y + h, pts: number[][] = [[x - r, y]];
  for (let i = 0; i <= 16; i++) { const t = (i / 16) * Math.PI; pts.push([x - r * Math.cos(t), b - r + r * Math.sin(t)]); }
  pts.push([x + r, y]);
  return pts;
}
/** A tube rotates about (x, y + 0.55h). The LIP is the lower of the two mouth corners. */
export function tubeLip(x: number, y: number, h: number, w: number, rot: number) {
  const cx = x, cy = y + h * 0.55;
  const a = rotP(x - w / 2, y, cx, cy, rot), b = rotP(x + w / 2, y, cx, cy, rot);
  return a[1] > b[1] ? a : b;
}
/** Tube top-centre (x, y) that puts its lip at (lx, ly) for a given tilt. */
export function tubeByLip(lx: number, ly: number, h: number, w: number, rot: number) {
  const L = tubeLip(0, 0, h, w, rot);
  return [lx - L[0], ly - L[1]];
}
export const BOTTLE_POLY = [[-46, -2], [46, -2], [46, -118], [31, -135], [16, -143], [16, -166], [-16, -166], [-16, -143], [-31, -135], [-46, -118]];
export const BOTTLE_PIVOT = [0, -83];
export function bottleLip(x: number, y: number, s: number, rot: number) {
  const a = rotP(-18, -166, BOTTLE_PIVOT[0], BOTTLE_PIVOT[1], rot), b = rotP(18, -166, BOTTLE_PIVOT[0], BOTTLE_PIVOT[1], rot);
  const L = a[1] > b[1] ? a : b;
  return [x + s * L[0], y + s * L[1]];
}
export function bottleByLip(lx: number, ly: number, s: number, rot: number) {
  const L = bottleLip(0, 0, s, rot);
  return [lx - L[0], ly - L[1]];
}
/** Falling stream from a lip (x1, y1) to a landing point (x2, y2) inside the receiving mouth. */
export function Stream({x1, y1, x2, y2, k, opacity = 1, width = 8}: any) {
  const col = k ? SW[k as SwatchKey].fill : '#CFE6EE';
  const d = `M${x1} ${y1}C${x1 + (x2 - x1) * 0.9} ${y1 + 6} ${x2} ${y1 + (y2 - y1) * 0.35} ${x2} ${y2}`;
  return (
    <g opacity={opacity} data-object="stream">
      <path d={d} fill="none" stroke="#7FA7B8" strokeWidth={width + 3} strokeLinecap="round" />
      <path d={d} fill="none" stroke={col} strokeWidth={width} strokeLinecap="round" />
    </g>
  );
}

/** Test tube, top-centre at (x, y). level 0..1 of the length. ppt: 0 none; 'susp' 0..1 → settled. */
export function Tube({id, x, y, h = 230, w = 52, level = 0.42, k, to, t = 0, ppt = 0, settle = 0, label, pill = true, pillText, rot = 0, bung = false, glow = false, opacity = 1, pillY, extract = false}: any) {
  const r = w / 2, bottom = y + h;
  const body = `M${x - r} ${y}L${x - r} ${bottom - r}A${r} ${r} 0 0 0 ${x + r} ${bottom - r}L${x + r} ${y}`;
  const liqTop = bottom - (h - 6) * level;
  const cid = `tube-${id}`;
  const px = x, py = y + h * 0.55;
  // Horizontal surface in world space: same volume as the upright level, found in the tilted outline.
  const poly = tubePoly(x, y, h, w);
  const wTop = rot ? levelY(poly.map((p) => rotP(p[0], p[1], px, py, rot)), areaBelow(poly, liqTop)) : liqTop;
  const span = h + w;
  const bungP = bung === true ? 1 : clamp01(Number(bung) || 0);
  const layerH = Math.min(26, (bottom - liqTop) * 0.3);
  const suspTop = lerp(liqTop + 4, bottom - layerH - 2, easeInOut(clamp01(settle)));
  const endK: SwatchKey | undefined = k && (to && t >= 0.5 ? to : k);
  return (
    <g opacity={opacity} transform={rot ? `rotate(${rot} ${x} ${y + h * 0.55})` : undefined} data-tube={id}>
      <defs><clipPath id={cid}><path d={`${body}Z`} /></clipPath></defs>
      {glow && <path d={body} fill="none" stroke={C.accent} strokeWidth={w * 0.55} strokeLinejoin="round" opacity={0.55} />}
      <path d={`${body}Z`} fill={GLASS} opacity={0.75} />
      {k && level > 0 && (
        <g clipPath={`url(#${cid})`}>
          <g transform={rot ? `rotate(${-rot} ${px} ${py})` : undefined}>
            {SW[(to && t >= 0.5 ? to : k) as SwatchKey].code === 'empty outline' && <rect x={px - span} y={wTop} width={span * 2} height={span * 2} fill="#BFDCE7" opacity={0.75} />}
            <Fill k={k} to={to} t={t} shape={(p) => <rect x={px - span} y={wTop} width={span * 2} height={span * 2} {...p} />} />
            <path d={`M${px - span} ${wTop}H${px + span}`} stroke="#5E8FA3" strokeWidth={2} opacity={0.8} />
          </g>
          {ppt > 0 && <rect x={x - r} y={suspTop} width={w} height={bottom - suspTop} fill="url(#sw-ppt)" opacity={clamp01(ppt) * (0.55 + 0.45 * settle)} />}
          {ppt > 0 && settle > 0 && <rect x={x - r} y={bottom - layerH} width={w} height={layerH} fill="#7A2414" opacity={clamp01(settle) * 0.85} />}
          {ppt > 0 && settle > 0 && <rect x={x - r} y={bottom - layerH} width={w} height={layerH} fill="url(#sw-ppt)" opacity={clamp01(settle)} />}
          {ppt > 0 && settle > 0.6 && <path d={`M${x - r} ${bottom - layerH}H${x + r}`} stroke="#FFFFFF" strokeWidth={2.5} strokeDasharray="5 4" opacity={clamp01((settle - 0.6) / 0.4)} />}
        </g>
      )}
      <path d={body} fill="none" stroke={GLASS_EDGE} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${x - r - 5} ${y}H${x + r + 5}`} stroke={GLASS_EDGE} strokeWidth={4} strokeLinecap="round" />
      <path d={`M${x - r + 7} ${y + 16}V${bottom - r - 6}`} stroke="#FFFFFF" strokeWidth={4} opacity={0.7} strokeLinecap="round" />
      {bungP > 0 && <path transform={`translate(0 ${-(1 - bungP) * 60})`} opacity={clamp01(bungP * 3)} d={`M${x - r + 2} ${y - 22}H${x + r - 2}L${x + r - 5} ${y + 12}H${x - r + 5}Z`} fill="#6B4B3A" stroke={C.ink} strokeWidth={2} />}
      {label && (
        <g>
          <rect x={x - r + 5} y={y + 26} width={w - 10} height={30} rx={4} fill="#FFFFFF" stroke={C.ink} strokeWidth={1.5} />
          <Txt x={x} y={y + 48} anchor="middle" size={label.length > 2 ? 15 : 20} weight={800}>{label}</Txt>
        </g>
      )}
      {pill && endK && <NamePill x={x} y={pillY ?? bottom + 34} k={endK} text={pillText} size={17} />}
    </g>
  );
}

/** Front view of a test-tube rack. Children (tubes) sit between the back and front plates. */
export function Rack({x, y, w = 420, h = 190, slots = 4, children, label, opacity = 1}: any) {
  const x0 = x - w / 2;
  return (
    <g opacity={opacity} data-object="rack">
      <rect x={x0} y={y - 6} width={w} height={14} rx={4} fill="#C9B48E" stroke={C.ink} strokeWidth={2} />
      {children}
      <rect x={x0} y={y + 30} width={w} height={22} rx={5} fill="#D8C39C" stroke={C.ink} strokeWidth={2.5} />
      {Array.from({length: slots}, (_, i) => <rect key={i} x={x0 + (i + 0.5) * w / slots - 28} y={y + 33} width={56} height={6} rx={3} fill="#9D8660" />)}
      <rect x={x0 - 4} y={y + h} width={w + 8} height={16} rx={5} fill="#C9B48E" stroke={C.ink} strokeWidth={2.5} />
      <path d={`M${x0 + 6} ${y}V${y + h + 2}M${x0 + w - 6} ${y}V${y + h + 2}`} stroke="#9D8660" strokeWidth={10} strokeLinecap="round" />
      {label && <Txt x={x} y={y + h + 48} anchor="middle" size={24} weight={700} fill={C.muted}>{label}</Txt>}
    </g>
  );
}

const HZ = {irritant: '!', harmful: '!', flammable: 'flame'};
/** GHS-style diamond; kind irritant|harmful|flammable. */
export function Hazard({x, y, s = 1, kind = 'irritant', opacity = 1}: any) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <path d="M0-26L26 0L0 26L-26 0Z" fill="#FFFFFF" stroke="#C8261E" strokeWidth={4} strokeLinejoin="round" />
      {HZ[kind as keyof typeof HZ] === 'flame'
        ? <path d="M0 13C-9 13-12 5-8-3C-6 2-4 3-3 1C-5-6 0-11 3-15C3-8 10-5 9 4C8 10 5 13 0 13Z" fill={C.ink} />
        : <><rect x={-3} y={-15} width={6} height={19} rx={2} fill={C.ink} /><circle cx={0} cy={10} r={3.4} fill={C.ink} /></>}
    </g>
  );
}

/** Reagent bottle, base-centre (x, y). */
export function Bottle({x, y, s = 1, name, sub, k, liquid, hazard, hazardLabel, glow = false, opacity = 1, open = false, tag, rot = 0, vol = 1, bid}: any) {
  const fill = liquid ?? (k ? SW[k as SwatchKey].fill : WATER);
  const [cx, cy] = BOTTLE_PIVOT;
  const V = areaBelow(BOTTLE_POLY, -96) * clamp01(vol);
  const general = rot !== 0 || vol !== 1;
  const wTop = general ? levelY(BOTTLE_POLY.map((p) => rotP(p[0], p[1], cx, cy, rot)), V) : -96;
  const cid = `bottle-${bid ?? name}`.replace(/[^a-zA-Z0-9-]/g, '');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})${rot ? ` rotate(${rot} ${cx} ${cy})` : ''}`} opacity={opacity} data-object="bottle">
      {glow && <rect x={-66} y={-196} width={132} height={200} rx={24} fill={C.accent} opacity={0.5} />}
      <path d="M-50-4V-118Q-50-132-34-138L-18-146V-166H18V-146L34-138Q50-132 50-118V-4Q50 2 44 2H-44Q-50 2-50-4Z" fill={GLASS} stroke={GLASS_EDGE} strokeWidth={3} />
      {!general && <path d="M-46-2V-96H46V-2Z" fill={fill} opacity={0.85} />}
      {general && V > 0 && <>
        <defs><clipPath id={cid}><path d={'M' + BOTTLE_POLY.map((p) => p.join(' ')).join('L') + 'Z'} /></clipPath></defs>
        <g clipPath={`url(#${cid})`}><g transform={rot ? `rotate(${-rot} ${cx} ${cy})` : undefined}><rect x={-260} y={wTop} width={520} height={520} fill={fill} opacity={0.85} /></g></g>
      </>}
      {!open && <rect x={-22} y={-186} width={44} height={24} rx={5} fill={C.ink} />}
      <rect x={-42} y={-84} width={84} height={58} rx={6} fill="#FFFFFF" stroke={C.ink} strokeWidth={1.5} />
      <Lines x={0} y={-60} text={name} size={String(name).length > 9 ? 13 : 16} step={16} anchor="middle" weight={800} />
      {sub && <Txt x={0} y={-33} anchor="middle" size={12} weight={700} fill={C.muted}>{sub}</Txt>}
      {hazard && <Hazard x={36} y={-110} s={0.62} kind={hazard} />}
      {tag && <Tag x={0} y={40} text={tag} size={17} anchor="middle" fill={C.primary} />}
    </g>
  );
}

/** Dropper pipette with tip at (x, y), pointing down. squeeze 0..1; drop 0..1 falls below the tip. */
export function Dropper({x, y, s = 1, rot = 0, squeeze = 0, drop = 0, dropK, glow = false, opacity = 1, fall = 70}: any) {
  const bulbW = 30 - 8 * squeeze;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity} data-object="dropper">
      {glow && <rect x={-26} y={-190} width={52} height={200} rx={20} fill={C.accent} opacity={0.5} />}
      <path d="M-6-120V-12L-2 0H2L6-12V-120Z" fill={GLASS} stroke={GLASS_EDGE} strokeWidth={2.5} />
      <path d={`M-9-120Q${-bulbW / 2 - 6}-150 ${-bulbW / 2}-165Q0-190 ${bulbW / 2}-165Q${bulbW / 2 + 6}-150 9-120Z`} fill="#C94F3B" stroke={C.ink} strokeWidth={2} />
      {drop > 0 && drop < 1 && dropK && <circle cx={0} cy={6 + drop * fall} r={6} fill={SW[dropK as SwatchKey].fill} stroke={C.ink} strokeWidth={1} />}
    </g>
  );
}

/** Syringe, tip at (x, y) pointing down. fill 0..1 of barrel, liquid colour key or hex. */
export function Syringe({x, y, s = 1, rot = 0, fill = 0, k, liquid, label, glow = false, opacity = 1, scale: grad = true}: any) {
  const col = liquid ?? (k ? SW[k as SwatchKey].fill : WATER);
  const barrel = 150, top = -barrel - 20, plungerY = top + barrel * (1 - clamp01(fill));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity} data-object="syringe">
      {glow && <rect x={-34} y={top - 80} width={68} height={barrel + 120} rx={20} fill={C.accent} opacity={0.5} />}
      <rect x={-2} y={-20} width={4} height={20} fill={GLASS_EDGE} />
      <rect x={-17} y={plungerY} width={34} height={-20 - plungerY} fill={col} opacity={0.9} />
      <rect x={-17} y={top} width={34} height={barrel} rx={4} fill="none" stroke={GLASS_EDGE} strokeWidth={3} />
      {grad && Array.from({length: 6}, (_, i) => <path key={i} d={`M-17 ${-20 - i * 25}h10`} stroke={C.ink} strokeWidth={1.5} />)}
      <rect x={-15} y={plungerY - 6} width={30} height={8} fill={C.ink} />
      <rect x={-4} y={plungerY - 70} width={8} height={66} fill="#8E99A8" />
      <rect x={-22} y={plungerY - 78} width={44} height={10} rx={3} fill={C.ink} />
      <path d={`M-28 ${top}H28`} stroke={GLASS_EDGE} strokeWidth={5} strokeLinecap="round" />
      {label && <Tag x={34} y={top + 40} text={label} size={18} />}
    </g>
  );
}

export function Cylinder({x, y, s = 1, level = 0.3, glow = false, opacity = 1}: any) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} data-object="cylinder">
      {glow && <rect x={-40} y={-230} width={80} height={240} rx={20} fill={C.accent} opacity={0.5} />}
      <path d="M-34 0H34" stroke={GLASS_EDGE} strokeWidth={6} strokeLinecap="round" />
      <rect x={-18} y={-210 + 200 * (1 - level)} width={36} height={200 * level} fill={WATER} />
      <path d="M-18-4V-210M18-4V-210M-18-210Q-26-214-24-220M18-210H22" fill="none" stroke={GLASS_EDGE} strokeWidth={3} />
      {Array.from({length: 8}, (_, i) => <path key={i} d={`M-18 ${-20 - i * 24}h${i % 2 ? 8 : 14}`} stroke={C.ink} strokeWidth={1.5} />)}
    </g>
  );
}

export function Thermometer({x, y, h = 230, reading, opacity = 1}: any) {
  return (
    <g opacity={opacity} data-object="thermometer">
      <rect x={x - 6} y={y} width={12} height={h} rx={6} fill="#FFFFFF" stroke={GLASS_EDGE} strokeWidth={2} />
      <rect x={x - 2.5} y={y + h * 0.28} width={5} height={h * 0.7} fill="#C8261E" />
      <circle cx={x} cy={y + h} r={10} fill="#C8261E" stroke={GLASS_EDGE} strokeWidth={2} />
      {reading && <Tag x={x + 18} y={y + 22} text={reading} size={20} fill={C.primary} />}
    </g>
  );
}

export function Bunsen({x, y, flame = 1, s = 1}: any) {
  const f = clamp01(flame);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} data-object="bunsen">
      <rect x={-36} y={-10} width={72} height={12} rx={4} fill={C.metalDark} />
      <rect x={-10} y={-104} width={20} height={96} fill={C.metal} stroke={C.ink} strokeWidth={2} />
      <rect x={-16} y={-40} width={32} height={14} rx={3} fill={C.metalDark} />
      {f > 0 && <g opacity={f}><path d={`M0 ${-104 - 70 * f}Q14 ${-130}  9 -106H-9Q-14 -130 0 ${-104 - 70 * f}Z`} fill="#7FB2F0" opacity={0.85} /><path d={`M0 ${-104 - 38 * f}Q7 -118 5 -106H-5Q-7 -118 0 ${-104 - 38 * f}Z`} fill="#2F63C9" /></g>}
    </g>
  );
}

/** Beaker water bath on tripod + gauze over a Bunsen. Children = tubes placed in the water. */
export function BeakerBath({x, y, s = 1, flame = 1, reading = '≥ 80 °C', children, glow = false, opacity = 1, bunsen = true}: any) {
  return (
    <g opacity={opacity} data-object="water-bath">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {glow && <rect x={-150} y={-440} width={300} height={450} rx={30} fill={C.accent} opacity={0.45} />}
        <path d="M-110 0L-90-160M110 0L90-160" stroke={C.metalDark} strokeWidth={8} strokeLinecap="round" />
        <rect x={-120} y={-172} width={240} height={12} fill="#9AA3AE" stroke={C.ink} strokeWidth={2} />
        {bunsen && <Bunsen x={0} y={0} flame={flame} s={0.9} />}
        <path d="M-95-172V-388H95V-172Z" fill={GLASS} opacity={0.6} />
      </g>
      {children}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-93-174V-330H93V-174Z" fill={WATER} opacity={0.55} />
        <path d="M-93-330H93" stroke="#6FA7BC" strokeWidth={3} />
        <path d="M-95-392V-176Q-95-172-91-172H91Q95-172 95-176V-392" fill="none" stroke={GLASS_EDGE} strokeWidth={4} />
        <Thermometer x={70} y={-420} h={220} />
        {reading && <Tag x={112} y={-392} text={reading} size={21} fill={C.primary} />}
      </g>
    </g>
  );
}

export function ElectricBath({x, y, s = 1, glow = false, opacity = 1, reading = '80 °C', children}: any) {
  return (
    <g opacity={opacity} data-object="electric-bath">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {glow && <rect x={-150} y={-230} width={300} height={240} rx={30} fill={C.accent} opacity={0.5} />}
        <rect x={-130} y={-150} width={260} height={150} rx={14} fill="#D5DBE2" stroke={C.ink} strokeWidth={3} />
        <rect x={-116} y={-150} width={232} height={24} fill={WATER} />
      </g>
      {children}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-116} y={-126} width={232} height={40} fill={WATER} opacity={0.6} />
        <rect x={-90} y={-60} width={96} height={40} rx={6} fill={C.ink} />
        <Txt x={-42} y={-31} anchor="middle" size={22} weight={700} fill="#7CF0A0">{reading}</Txt>
        <circle cx={70} cy={-40} r={17} fill="#9AA3AE" stroke={C.ink} strokeWidth={2} />
        <path d="M70-40L78-52" stroke={C.ink} strokeWidth={3} />
      </g>
    </g>
  );
}

/** Wooden test-tube holder: jaw at (x, y), handle to the right. */
export function Holder({x, y, s = 1, rot = 0, glow = false, opacity = 1}: any) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity} data-object="holder">
      {glow && <rect x={-40} y={-26} width={250} height={52} rx={20} fill={C.accent} opacity={0.5} />}
      <path d="M-30-14H40V14H-30Q-40 0-30-14Z" fill="none" stroke={C.metalDark} strokeWidth={5} />
      <rect x={40} y={-10} width={160} height={20} rx={8} fill="#B98B5A" stroke={C.ink} strokeWidth={2} />
      <path d="M60-10Q90-26 120-10" fill="none" stroke={C.metalDark} strokeWidth={3} />
    </g>
  );
}

export function Tile({x, y, w = 260, h = 64, glow = false, opacity = 1, label}: any) {
  return (
    <g opacity={opacity} data-object="tile">
      {glow && <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={16} fill={C.accent} opacity={0.5} />}
      <rect x={x} y={y + 8} width={w} height={h} rx={8} fill="#C9CED6" />
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#FFFFFF" stroke={C.ink} strokeWidth={2.5} />
      {label && <Txt x={x + w / 2} y={y + h / 2 + 8} anchor="middle" size={20} weight={700} fill={C.muted}>{label}</Txt>}
    </g>
  );
}

export function Goggles({x, y, s = 1, glow = false, opacity = 1}: any) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} data-object="goggles">
      {glow && <circle r={70} fill={C.accent} opacity={0.5} />}
      <path d="M-62-6Q-66-30-40-30H40Q66-30 62-6Q60 22 30 22Q12 22 6 8Q0 2-6 8Q-12 22-30 22Q-60 22-62-6Z" fill="#BFE0EA" stroke={C.ink} strokeWidth={4} />
      <path d="M-62-8H-78M62-8H78" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}

export function MarkerPen({x, y, s = 1, rot = -20, glow = false, opacity = 1}: any) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity} data-object="marker">
      {glow && <rect x={-20} y={-16} width={150} height={32} rx={14} fill={C.accent} opacity={0.5} />}
      <path d="M0 0L14-7H110V7H14Z" fill={C.ink} />
      <rect x={30} y={-9} width={82} height={18} rx={4} fill="#2F6BD3" stroke={C.ink} strokeWidth={1.5} />
    </g>
  );
}

export function Waste({x, y, s = 1, glow = false, opacity = 1}: any) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} data-object="waste">
      {glow && <rect x={-70} y={-140} width={140} height={150} rx={20} fill={C.accent} opacity={0.5} />}
      <path d="M-55-120L-45 0H45L55-120Z" fill="#E9E4DA" stroke={C.ink} strokeWidth={3} />
      <path d="M-50-60L-45 0H45L50-60Z" fill="#B7B2A6" opacity={0.6} />
      <rect x={-36} y={-100} width={72} height={30} rx={4} fill="#FFFFFF" stroke={C.ink} strokeWidth={1.5} />
      <Txt x={0} y={-79} anchor="middle" size={17} weight={800}>waste</Txt>
    </g>
  );
}

export function Timer({x, y, secs, of, label, opacity = 1, s = 1}: any) {
  const mm = Math.floor(secs / 60), ss = Math.floor(secs % 60);
  const frac = of ? clamp01(secs / of) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} data-object="timer">
      <rect x={-86} y={-44} width={172} height={88} rx={16} fill={C.ink} />
      <Txt x={0} y={17} anchor="middle" size={48} weight={700} fill="#7CF0A0">{`${mm}:${String(ss).padStart(2, '0')}`}</Txt>
      {of && <rect x={-70} y={30} width={140 * frac} height={6} rx={3} fill="#7CF0A0" />}
      {label && <Txt x={0} y={78} anchor="middle" size={20} weight={700} fill={C.muted}>{label}</Txt>}
    </g>
  );
}

/** A pointer label: text at (lx, ly), leader to (tx, ty). */
export function Callout({lx, ly, tx, ty, text, size = 22, anchor = 'middle', fill = C.ink, opacity = 1, hi = false}: any) {
  const lines = String(text).split('\n');
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.55 + 22, hh = lines.length * size * 1.25 + 10;
  const x0 = anchor === 'middle' ? lx - w / 2 : anchor === 'end' ? lx - w : lx;
  const ey = ty < ly ? ly - size - 4 : ly + hh - size - 4;
  return (
    <g opacity={opacity}>
      <path d={`M${lx} ${ey}L${tx} ${ty}`} stroke={hi ? C.primary : C.muted} strokeWidth={2} />
      <circle cx={tx} cy={ty} r={4} fill={C.primary} />
      <rect x={x0} y={ly - size - 2} width={w} height={hh} rx={8} fill={hi ? '#FFF1EA' : '#FFFFFF'} stroke={hi ? C.primary : C.line} strokeWidth={hi ? 3 : 1.5} />
      <Lines x={x0 + w / 2} y={ly} text={text} size={size} anchor="middle" weight={700} fill={fill} step={size * 1.25} />
    </g>
  );
}
