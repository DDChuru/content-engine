/** Schematic scene pieces (all MODEL): the mouth-and-bread inset, starch beads, tongue cells, and a cell
 * outline with inside/outside brackets. Chain cutting (beads) is a ONE-FRAME link switch, then motion. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/src/theme';
import {Txt, Tag, Arrow} from '../shared/src/Type';

/** Side view of a mouth (schematic), facing right. (x,y) = tongue centre; s scale. */
export function Mouth({x, y, s = 1, saliva = 0, opacity = 1, children}: any) {
  if (opacity <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity < 1 ? opacity : undefined}>
      {/* head profile */}
      <path d="M-330 -330C-250 -410 -60 -420 70 -360C150 -322 200 -270 214 -210C224 -170 250 -150 262 -120C272 -96 250 -86 236 -80C244 -60 246 -40 232 -28L150 -28C130 -28 120 -10 150 0L236 0C250 16 250 40 234 60C252 80 244 110 214 124C170 150 120 170 60 190C-40 222 -170 220 -270 190C-340 130 -372 -190 -330 -330Z"
        fill="#F3DCC8" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      {/* mouth cavity */}
      <path d="M150 -28C60 -40 -60 -50 -170 -30C-230 -18 -250 30 -210 60C-140 104 40 100 150 0Z" fill="#8E3B45" stroke={C.ink} strokeWidth={3} />
      {saliva > 0 && <path d="M150 -12C60 -24 -60 -30 -165 -12C-220 0 -230 36 -200 56C-130 96 40 90 150 6Z" fill="#9CC9E6" opacity={0.55 * clamp01(saliva)} />}
      {/* tongue */}
      <path d="M-200 50C-200 0 -80 -2 40 6C110 10 150 20 150 34C150 50 100 58 20 66C-80 76 -200 90 -200 50Z" fill="#D9707A" stroke={C.ink} strokeWidth={3} />
      {children}
    </g>
  );
}
/** Bread piece (sits on the tongue, mouth coordinates). */
export function Bread({x = -30, y = -8, s = 1, opacity = 1}: any) {
  if (opacity <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity < 1 ? opacity : undefined}>
      <path d="M-58 8C-62 -20 -40 -34 -8 -34C30 -36 58 -22 58 6C58 18 40 22 0 22C-40 22 -56 20 -58 8Z" fill="#E9C27A" stroke="#8A6414" strokeWidth={3} />
      <path d="M-40 -8l6 2M-12 -18l5 3M18 -10l6 1M34 -20l4 4" stroke="#B08A3A" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}
/** Starch chain of n beads. cut=true: links between pairs are gone (one frame), pairs drift by `spread`. */
export function Beads({x, y, n = 8, r = 13, cut = false, spread = 0, color = '#F2C45A', edge = '#8A6414', opacity = 1, label, labelCut, seatOffset}: any) {
  if (opacity <= 0) return null;
  const pos = Array.from({length: n}, (_, i) => {
    const pair = Math.floor(i / 2);
    const dx = cut ? (pair - (n / 2 - 1) / 2) * spread : 0;
    const dy = cut ? (pair % 2 ? -1 : 1) * spread * 0.3 : 0;
    return [x + i * r * 2.3 + dx, y + dy];
  });
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {pos.slice(1).map((p, i) => ((!cut || i % 2 === 0) ? <path key={i} d={`M${pos[i][0]} ${pos[i][1]}L${p[0]} ${p[1]}`} stroke={edge} strokeWidth={4} /> : null))}
      {pos.map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r={r} fill={color} stroke={edge} strokeWidth={2.5} />)}
      {label && !cut && <Txt x={x + (n - 1) * r * 1.15} y={y - r - 12} size={22} weight={800} anchor="middle">{label}</Txt>}
      {labelCut && cut && <Txt x={x + (n - 1) * r * 1.15} y={y - r - 12 - spread * 0.3} size={22} weight={800} anchor="middle">{labelCut}</Txt>}
    </g>
  );
}
/** Three tongue cells (schematic), top-left at (x,y). */
export function TongueCells({x, y, opacity = 1, tag, tagFill = C.primary, glow = 0}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {[0, 1, 2].map((i) => <g key={i}>
        <rect x={x + i * 92} y={y} width={84} height={62} rx={18} fill="#F6D5D0" stroke={C.ink} strokeWidth={3} />
        <circle cx={x + i * 92 + 42} cy={y + 31} r={12} fill="#C98B96" stroke={C.ink} strokeWidth={2} />
      </g>)}
      {glow > 0 && <rect x={x - 8} y={y - 8} width={288} height={78} rx={22} fill="none" stroke={C.accent} strokeWidth={6} opacity={glow} />}
      {tag && <Tag x={x + 138} y={y + 104} text={tag} size={20} fill={tagFill} anchor="middle" />}
    </g>
  );
}
/** A cell outline (membrane as a double line), centre (x,y), radii rx, ry. */
export function Cell({x, y, rx = 330, ry = 240, opacity = 1, fill = '#EEF3EC'}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} stroke="#4B7A52" strokeWidth={10} />
      <ellipse cx={x} cy={y} rx={rx - 9} ry={ry - 9} fill="none" stroke="#9CC29F" strokeWidth={3} />
    </g>
  );
}
/** Small reaction arrow A → B; speed 0..1 animates a dash along it; bright 0..1. */
export function RxArrow({x, y, t = 0, speed = 0.2, bright = 1, len = 70}: any) {
  const off = (t * speed * 3) % 1;
  return (
    <g opacity={0.25 + 0.75 * bright}>
      <circle cx={x - 12} cy={y} r={8} fill="#E3B26B" stroke={C.ink} strokeWidth={1.5} />
      <Arrow x1={x} y1={y} x2={x + len} y2={y} color={C.ink} width={2 + 2 * bright} head={10} />
      <circle cx={x + len * off} cy={y} r={4} fill={C.primary} opacity={bright} />
      <circle cx={x + len + 14} cy={y} r={8} fill="#A8C98A" stroke={C.ink} strokeWidth={1.5} />
    </g>
  );
}
/** Bracket over a region with a label. */
export function RegionTag({x, y, text, color = C.teal, opacity = 1, glow = 0, size = 26}: any) {
  if (opacity <= 0) return null;
  return <Tag x={x} y={y} text={text} size={size} fill={C.white} bg={color} stroke={glow > 0 ? C.accent : color} anchor="middle" opacity={opacity} />;
}
