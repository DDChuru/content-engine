/**
 * TutorialKit — ONE data-driven field-guide composition. Given a beats document
 * (beatsmith PRD schema) and an asset base path, it renders the standard stage:
 * dark backdrop, phone on the left (captured still + focus rings from
 * `beats[].boxes`), the explainer caption panel on the right (chip / caption /
 * progress dots), per-beat voiceover placed by `voStart`, and a brand footer.
 *
 * Beats with `still: null` are pure-motion scenes with no still — they render a
 * neutral placeholder card showing the beat's `visual` intent. Those get bespoke
 * scenes built later; TutorialKit deliberately does NOT try to reproduce the
 * iris / shatter / relay motion here.
 *
 * Duration derives from the beats' timing (see kitDurationInFrames).
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { CaptionPanel } from './CaptionPanel';
import { BrandFooter, SceneBackdrop } from './chrome';
import {
  BODY,
  clamp01,
  DISPLAY,
  easeInOut,
  ensureKitFonts,
  fadeTail,
  hexToRgb,
  INK,
  resolveColor,
  seg,
  useLocalSpring,
} from './palette';
import { PhoneFrame, Ring } from './PhoneFrame';
import type { BeatsDoc } from './types';

ensureKitFonts();

/** Scene starts this many seconds before its VO (a small lead-in). */
const LEAD = 0.45;
/** Tail after the last beat's VO, in seconds. */
const END_PAD = 1.0;

type Windows = { starts: number[]; durs: number[]; total: number };

/** Frame windows for each beat, derived from voStart (mirrors the CCV spine). */
export const beatWindows = (doc: BeatsDoc): Windows => {
  const { fps, beats } = doc;
  const starts = beats.map((b, i) => (i === 0 ? 0 : Math.round((b.voStart - LEAD) * fps)));
  const last = beats[beats.length - 1];
  const total = Math.round((last.voStart + last.duration + END_PAD) * fps);
  const durs = beats.map((_, i) => (i + 1 < beats.length ? starts[i + 1] - starts[i] : total - starts[i]));
  return { starts, durs, total };
};

/** Total composition length in frames, for the <Composition durationInFrames>. */
export const kitDurationInFrames = (doc: BeatsDoc): number => beatWindows(doc).total;

// ─── Motion-scene placeholder (still: null) ────────────
// A quietly-alive HUD card standing in for a bespoke scene: layered entrance,
// a depth-stacked panel, and ONE living micro-detail (a slow HUD scan-line) —
// enough to read as "pending," never enough to upstage a real beat.
const MotionPlaceholder: React.FC<{
  step: number;
  total: number;
  chip: string;
  visual: string;
  notes?: string[];
  color: string;
  /** Scene-local seconds since this beat's VO starts (0 = VO onset). */
  vo: number;
}> = ({ step, total, chip, visual, notes, color, vo }) => {
  const frame = useCurrentFrame();
  const appear = easeInOut(seg(vo, -0.3, 0.4));
  const rgb = hexToRgb(color);
  // one living micro-detail: a HUD beam sweeping top→bottom, fading at each pass
  const sweepFrames = 150;
  const sweepT = (frame % sweepFrames) / sweepFrames;
  const sweepGlow = Math.sin(sweepT * Math.PI);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 1240,
          borderRadius: 28,
          overflow: 'hidden',
          border: `1.5px solid rgba(${rgb},0.4)`,
          background: `radial-gradient(circle at 16% 10%, rgba(${rgb},0.12), transparent 46%), rgba(255,255,255,0.035)`,
          boxShadow: `0 30px 90px rgba(0,0,0,0.5), 0 0 60px rgba(${rgb},0.1)`,
          padding: '56px 64px',
          opacity: appear,
          transform: `translateY(${(1 - appear) * 26}px) scale(${0.97 + appear * 0.03})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${sweepT * 100}%`,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(${rgb},${0.4 * sweepGlow}), transparent)`,
            boxShadow: `0 0 10px rgba(${rgb},${0.3 * sweepGlow})`,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            color,
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 3,
            textTransform: 'uppercase',
            clipPath: `inset(0 ${(1 - appear) * 100}% 0 0)`,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 7, background: color, boxShadow: `0 0 16px ${color}` }} />
          Motion scene · beat {step + 1} of {total}
        </div>
        <div
          style={{
            marginTop: 20,
            color: '#fff',
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 58,
            lineHeight: 1.02,
            opacity: easeInOut(seg(vo, -0.1, 0.5)),
            transform: `translateY(${(1 - easeInOut(seg(vo, -0.1, 0.5))) * 18}px)`,
          }}
        >
          {chip}
        </div>
        <div
          style={{
            marginTop: 26,
            color: 'rgba(255,255,255,0.78)',
            fontFamily: BODY,
            fontSize: 30,
            lineHeight: 1.4,
            opacity: easeInOut(seg(vo, 0.05, 0.65)),
            transform: `translateY(${(1 - easeInOut(seg(vo, 0.05, 0.65))) * 16}px)`,
          }}
        >
          {visual}
        </div>
        {notes && notes.length > 0 ? (
          <div
            style={{
              marginTop: 28,
              paddingTop: 22,
              borderTop: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: BODY,
              fontSize: 24,
              lineHeight: 1.5,
            }}
          >
            {notes.map((n, i) => {
              const noteAppear = easeInOut(seg(vo, 0.3 + i * 0.35, 0.65 + i * 0.35));
              return (
                <div
                  key={n}
                  style={{
                    opacity: noteAppear,
                    transform: `translateX(${(1 - noteAppear) * 18}px)`,
                  }}
                >
                  ▸ {n}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ─── One beat scene ────────────────────────────────────
const BeatScene: React.FC<{
  doc: BeatsDoc;
  assetBase: string;
  index: number;
  /** This beat's on-screen window, in frames (for the tail fade below). */
  durFrames: number;
}> = ({ doc, assetBase, index, durFrames }) => {
  const frame = useCurrentFrame();
  const beat = doc.beats[index];
  const total = doc.beats.length;
  // scene-local clocks (rule 1): sceneSec since the scene mounted (lead-in
  // included), vo since the beat's real VO onset — everything below is keyed
  // to vo so motion lands on the words, not on an arbitrary scene boundary.
  const sceneSec = frame / doc.fps;
  const vo = sceneSec - LEAD;
  const tail = fadeTail(sceneSec, durFrames / doc.fps, 0.4);
  const appear = easeInOut(seg(vo, -0.35, 0.35));
  // spring "snap" for the focus rings — a physical landing, not a UI fade (rule 4)
  const ringAppear = useLocalSpring(Math.round((LEAD + 0.25) * doc.fps), 22, 170);
  const beatColor = resolveColor(beat.boxes[0]?.color);
  const headline = beat.caption ?? beat.visual;

  if (beat.still === null) {
    return (
      <AbsoluteFill style={{ background: INK, opacity: tail }}>
        <SceneBackdrop variant="deep" />
        <MotionPlaceholder
          step={index}
          total={total}
          chip={beat.chip}
          visual={headline}
          notes={beat.agentNotes}
          color={beatColor}
          vo={vo}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop />
      <PhoneFrame
        x={96}
        y={54}
        height={962}
        assetBase={assetBase}
        entrance={appear}
        shots={[{ src: beat.still, opacity: 1 }]}
        overlay={(m) => (
          <>
            {beat.boxes.map((box, i) => (
              <Ring key={i} box={box} color={resolveColor(box.color)} appear={ringAppear} mapper={m} />
            ))}
          </>
        )}
      />
      <CaptionPanel
        step={index}
        total={total}
        chip={beat.chip}
        caption={headline}
        body={beat.script}
        color={beatColor}
        sec={vo}
      />
    </AbsoluteFill>
  );
};

// ─── Composition ───────────────────────────────────────
export const TutorialKit: React.FC<{ beats: BeatsDoc; assetBase: string }> = ({ beats, assetBase }) => {
  const frame = useCurrentFrame();
  const { starts, durs, total } = beatWindows(beats);
  const progress = clamp01(frame / total);

  return (
    <AbsoluteFill style={{ background: INK }}>
      {beats.beats.map((beat, i) => (
        <Sequence key={beat.id} from={starts[i]} durationInFrames={durs[i]} premountFor={beats.fps}>
          <BeatScene doc={beats} assetBase={assetBase} index={i} durFrames={durs[i]} />
        </Sequence>
      ))}

      {/* narration spine — each clip placed at its absolute voStart */}
      {beats.beats.map((beat) =>
        beat.audio ? (
          <Sequence
            key={`audio-${beat.id}`}
            from={Math.round(beat.voStart * beats.fps)}
            durationInFrames={Math.ceil(beat.duration * beats.fps) + 4}
            premountFor={beats.fps}
          >
            <Audio src={staticFile(`${assetBase}/${beat.audio}`)} />
          </Sequence>
        ) : null,
      )}

      <BrandFooter label={`e-wizer field guide — ${beats.project}`} progress={progress} left={720} />
    </AbsoluteFill>
  );
};
