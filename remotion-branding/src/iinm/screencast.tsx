import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, staticFile, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { StepChip, Caption, INK, TEAL, RED, FONT, clamp } from './conventions';

/**
 * ScreencastChapter — reusable narrated-screencast chapter for the IINM user guide.
 * Plays a REAL Playwright capture (pre-slowed to the VO length so it plays 1:1) as
 * the backdrop, with per-beat step chips, VO-synced captions, an in-app-guide pointer
 * and a §24 callout (driven by per-beat flags in the timing json).
 */
export type ChTiming = {
  fps: number; total_frames: number; total_seconds: number; audio: string; video: string;
  cues: Array<[number, number, string]>;
  beats: Array<{ chip: string; voStart: number; voEnd: number; videoSec: number; guide: boolean; s24: boolean; end: boolean }>;
};

export const ScreencastChapter: React.FC<{ timing: ChTiming; chapterNo: number; title: string }> = ({ timing, chapterNo, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const BEATS = timing.beats;

  let active = 0;
  for (let i = 0; i < BEATS.length; i++) if (sec >= BEATS[i].voStart) active = i;
  const ab = BEATS[active];
  const titleOp = interpolate(sec, [0.2, 0.8, 2.2, 2.9], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: '#0B1220', fontFamily: FONT }}>
      <OffthreadVideo src={staticFile(timing.video)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      <StepChip n={active + 1} label={ab.chip} />

      {ab.guide && (
        <div style={{ position: 'absolute', left: 1230, top: 150, opacity: interpolate(sec, [ab.voStart, ab.voStart + 0.4, ab.voEnd + 0.4, ab.voEnd + 0.9], [0, 1, 1, 0], clamp) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: INK, color: '#fff', fontWeight: 800, fontSize: 24, padding: '12px 18px', borderRadius: 12, boxShadow: '0 16px 34px rgba(0,0,0,0.4)' }}>
            The e-wizer guide explains the rule
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={`rgb(${TEAL})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
          </div>
        </div>
      )}

      {ab.s24 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center', opacity: interpolate(sec, [ab.voStart, ab.voStart + 0.4], [0, 1], clamp) }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: `rgb(${RED})`, color: '#fff', fontWeight: 900, fontSize: 30, padding: '14px 26px', borderRadius: 14, boxShadow: `0 0 ${24 + (0.5 + 0.5 * Math.sin(frame / 12)) * 26}px rgba(225,29,72,0.55)` }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
            Section 24 — reportable to the Department of Labour
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
