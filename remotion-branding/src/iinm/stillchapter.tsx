import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { StepChip, Caption, INK, TEAL, FONT, clamp } from './conventions';
import type { ChTiming } from './screencast';

const RED_RGB = '225,29,72';

/**
 * StillChapter — drift-free narrated chapter built from PER-BEAT STILLS captured
 * from the live app. Each beat shows the exact UI state for its line, with a precise
 * ring on the real element (captured boundingBox, 1920×1080 = frame px). No video
 * scroll → annotations never drift; no slow-mo. This replaced the slowed-video build.
 */
export type Box = { x: number; y: number; w: number; h: number } | null;
export type PlanStep = { shot: string; ring?: string | null; guide?: boolean; s24?: boolean };

export const StillChapter: React.FC<{
  timing: ChTiming; boxes: Record<string, Box>; plan: PlanStep[]; chapterNo: number; title: string; shotDir: string;
}> = ({ timing, boxes, plan, chapterNo, title, shotDir }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const B = timing.beats;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 12);

  let active = 0;
  for (let i = 0; i < B.length; i++) if (sec >= B[i].voStart) active = i;
  const step = plan[active] || plan[plan.length - 1];
  const ringBox = step.ring ? boxes[step.ring] : null;
  const titleOp = interpolate(sec, [0.2, 0.8, 2.2, 2.9], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: '#0B1220', fontFamily: FONT }}>
      {/* stills, crossfaded by beat window (held during each line) */}
      {B.map((b, i) => {
        const next = i + 1 < B.length ? B[i + 1].voStart : timing.total_seconds + 1;
        const op = interpolate(sec, [b.voStart - 0.35, b.voStart, next - 0.05, next + 0.35], [0, 1, 1, 0], clamp);
        if (op <= 0) return null;
        return <Img key={i} src={staticFile(`${shotDir}/${(plan[i] || step).shot}.png`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: op }} />;
      })}

      {/* precise ring on the active element */}
      {ringBox && (
        <div style={{ position: 'absolute', left: ringBox.x - 10, top: ringBox.y - 10, width: ringBox.w + 20, height: ringBox.h + 20, borderRadius: 12, border: `4px solid rgba(${step.s24 ? RED_RGB : TEAL},${0.55 + pulse * 0.4})`, boxShadow: `0 0 ${16 + pulse * 22}px rgba(${step.s24 ? RED_RGB : TEAL},0.5)`, pointerEvents: 'none' }} />
      )}

      <StepChip n={active + 1} label={B[active].chip} />

      {/* in-app guide callout */}
      {step.guide && (
        <div style={{ position: 'absolute', left: 1180, top: 250, opacity: interpolate(sec, [B[active].voStart, B[active].voStart + 0.4], [0, 1], clamp) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: INK, color: '#fff', fontWeight: 800, fontSize: 23, padding: '12px 18px', borderRadius: 12, boxShadow: '0 16px 34px rgba(0,0,0,0.4)' }}>
            Your e-wizer guide — it explains the rule
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={`rgb(${TEAL})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
          </div>
        </div>
      )}

      <Caption cues={timing.cues} />

      {titleOp > 0 && (
        <AbsoluteFill style={{ background: 'rgba(11,18,32,0.82)', opacity: titleOp, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
          <div style={{ color: `rgb(${TEAL})`, fontWeight: 800, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase' }}>Chapter {chapterNo}</div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 64 }}>{title}</div>
        </AbsoluteFill>
      )}

      <Audio src={staticFile(timing.audio)} />
    </AbsoluteFill>
  );
};
