/** The error-beat treatment: a terracotta frame border and a badge, visible on EVERY frame of the error
 * interval. The label is a prop; it must tell the truth about the evidence (VIDEO-STRUCTURE, 22 Sep).
 * Badge geometry (x 1410, y 22, 440 × 56) is what verify.py crops for the every-frame audit. */
import React from 'react';
import {BRAND as C, BODY} from './theme';
export type ErrorLabel = 'COMMON MISTAKE' | 'EXAM CONTRAST';
export function ErrorMarker({on, label = 'COMMON MISTAKE'}: {on: boolean; label?: ErrorLabel}) {
  if (!on) return null;
  return (
    <g data-error-marker="on" data-error-label={label}>
      <rect x={6} y={6} width={1908} height={1068} rx={20} fill="none" stroke={C.primary} strokeWidth={10} />
      <rect x={1410} y={22} width={440} height={56} rx={10} fill={C.primary} />
      <circle cx={1446} cy={50} r={13} fill="none" stroke={C.white} strokeWidth={3.5} />
      <path d="M1446 42V51M1446 56V57" stroke={C.white} strokeWidth={3.5} strokeLinecap="round" />
      <text x={1650} y={61} fontSize={30} fontWeight={800} fill={C.white} textAnchor="middle" fontFamily={BODY} letterSpacing={2}>{label}</text>
    </g>
  );
}
