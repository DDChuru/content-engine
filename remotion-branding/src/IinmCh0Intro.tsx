import React from 'react';
import { AbsoluteFill, Audio, Series, staticFile, useCurrentFrame } from 'remotion';
import {
  ColdOpen,
  AvatarIntro,
  PyramidYouAreHere,
  JumpStrip,
  LegalScopeCard,
  Outro,
  Caption,
  INK,
  RED,
  FONT,
} from './iinm/conventions';
import { LogoOpen, Statement, ProtectTriad } from './iinm/importance';
import TIMING from './iinm/ch0-timing.json';

/**
 * IINM User Guide — Chapter 0 ("How this works & the one rule").
 * Built on the Codex-authored conventions kit (src/iinm/conventions.tsx).
 * DATA-DRIVEN: segment durations, caption cues and the pyramid tier-walk all
 * come from ch0-timing.json, which synth-ch0.py emits from the MEASURED VO — so
 * captions land on the spoken words. Roles match the live app (Site investigates,
 * Area signs off the action, SHEQ closes, GM oversees).
 */

const TIERS = ['Site Manager', 'Area Manager', 'SHEQ Officer', 'GM'];
// one stage per tier, role-correct per the live app (Area verifies the action, SHEQ closes)
const VERBS = ['Capture', 'Verify', 'Close', 'Oversee'];
const WALK_STARTS: number[] = TIMING.walkTierStarts;
const CUES = TIMING.cues as Array<[number, number, string]>;
const ST = TIMING.segmentText as Record<string, string>;

const PyramidWalk: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.max(0, Math.min(3, WALK_STARTS.filter((s) => frame >= s).length - 1));
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F6FA 100%)', fontFamily: FONT, alignItems: 'center' }}>
      <div style={{ marginTop: 70, color: INK, fontSize: 46, fontWeight: 900, letterSpacing: -0.4 }}>
        Four people. One chain of custody.
      </div>
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <PyramidYouAreHere tier={TIERS[idx]} />
        {/* chips light per tier as the pyramid walks the chain */}
        <JumpStrip active={VERBS[idx]} />
      </div>
    </AbsoluteFill>
  );
};

const Teaser: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 14);
  return (
    <AbsoluteFill style={{ background: INK, fontFamily: FONT, alignItems: 'center', justifyContent: 'center', gap: 30 }}>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 30, fontWeight: 800 }}>Some incidents trip a legal alarm —</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: `rgb(${RED})`, color: '#fff', fontSize: 38, fontWeight: 900, padding: '26px 42px', borderRadius: 16, boxShadow: `0 0 ${24 + pulse * 30}px rgba(225,29,72,0.6)` }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
        Section 24 — reportable to the Department of Labour
      </div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, fontStyle: 'italic' }}>(you'll see this happen live in Chapter 1)</div>
    </AbsoluteFill>
  );
};

const SEGMENTS: Record<string, React.ReactNode> = {
  // "Why it matters" opener — logo-forward, no character
  why_open: <LogoOpen headline={ST.why_open} />,
  why_act: <Statement text={ST.why_act} tone="ink" />,
  why_protect: <ProtectTriad items={[{ label: 'People' }, { label: 'Site' }, { label: 'You' }]} />,
  why_prevent: <Statement text={ST.why_prevent} tone="light" />,
  why_proof: <Statement text={ST.why_proof} kicker="Proof, on time" tone="ink" />,
  why_cta: <Statement text={ST.why_cta} tone="light" />,
  // orientation
  coldopen: <ColdOpen tier={null} title="IINM · Step-by-step" subtitle="For every site, every shift" />,
  avatar: <AvatarIntro line="Watch with the app open. Find your job on the pyramid." chapterNo={0} chapterTitle="Welcome" />,
  walk: <PyramidWalk />,
  legal: <LegalScopeCard />,
  teaser: <Teaser />,
  outro: <Outro youCanNow="navigate this guide and find your chapter." nextLabel="Capture a report" nextTier="Site Manager" />,
};

export const IinmCh0Intro: React.FC<{ audioSrc?: string | null }> = ({ audioSrc = TIMING.audio }) => {
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Series>
        {TIMING.segments.map((s) => (
          <Series.Sequence key={s.name} durationInFrames={s.durFrames} premountFor={30}>
            {SEGMENTS[s.name]}
          </Series.Sequence>
        ))}
      </Series>

      <Caption cues={CUES} />

      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}
    </AbsoluteFill>
  );
};
