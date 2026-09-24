/** The error-beat marker: badge top right + terracotta frame. Present on EVERY frame of the treatment.
 * The label tells the truth about the evidence: COMMON MISTAKE only where an examiner report or mark-
 * scheme reject line diagnoses the error; EXAM CONTRAST otherwise (VIDEO-STRUCTURE, 22 Sep ruling). */
import React from 'react';
import {BRAND as C, DISPLAY} from './theme';
export type ErrorLabel = 'COMMON MISTAKE' | 'EXAM CONTRAST';
export const BADGE = {x: 1410, y: 22, w: 440, h: 56};
export function ErrorMarker({on, label = 'COMMON MISTAKE'}: {on: boolean; label?: ErrorLabel}) {
  if (!on) return null;
  const {x, y, w, h} = BADGE;
  return (
    <g data-error-marker="on" data-error-label={label}>
      <rect x={8} y={8} width={1904} height={1064} rx={18} fill="none" stroke={C.primary} strokeWidth={10} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill={C.primary} />
      <text x={x + w / 2} y={y + 39} fontSize={30} fontWeight={700} fill={C.white} textAnchor="middle" fontFamily={DISPLAY} letterSpacing={3}>{label}</text>
    </g>
  );
}
