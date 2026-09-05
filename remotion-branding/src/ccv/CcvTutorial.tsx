/**
 * e-wizer CCV user guide — "The Second Pair of Eyes" (12 beats, ~4:50).
 *
 * Timing spine: src/ccv/timing.json (measured ElevenLabs VO, Daniel voice).
 * One scene per narration beat; scene N runs from just before its beat's
 * voStart to the next beat's lead-in. Real Pixel-emulator stills live in
 * public/ccv-tutorial/shots; states the live app couldn't produce (six
 * method variants, NEEDS VERIFY badge, SM device, offline queue) are
 * recreated with the app's own palette + fonts (see ccvShared).
 *
 * Visual direction per beat: e-wizer/ccv-storyboard-playground.html
 * ("★ Final Synthesis" tab). Recurring cyan iris bookends the piece.
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import timing from './timing.json';
import {
  AMBER,
  AppBadge,
  AppButton,
  AppCard,
  APP_BORDER,
  BODY,
  BodyText,
  CANVAS,
  ChipLabel,
  CORAL,
  DISPLAY,
  EMERALD,
  FG,
  FG2,
  Headline,
  hexToRgb,
  INK,
  Iris,
  MUTED,
  Phone,
  ProofChip,
  Ring,
  SceneBackdrop,
  seg,
  SKY,
  SKY_DEEP,
  SKY_TINT,
  SpecHero,
  STILL_W,
  SURFACE,
  Tap,
  Wordmark,
  clamp01,
  easeInOut,
  useCcvFonts,
} from './ccvShared';

type Beat = {
  id: string;
  shot: string;
  chip: string;
  ring: string | null;
  audio: string;
  voStart: number;
  duration: number;
  text: string;
};
type TimingData = { fps: number; total_seconds: number; total_frames: number; beats: Beat[] };

const T = timing as TimingData;
const FPS = T.fps;
export const CCV_TUTORIAL_FPS = FPS;
export const CCV_TUTORIAL_FRAMES = T.total_frames;

const NARRATION_VOLUME = 1.5; // voice leads; music is a bed (Daniel's mix note)
const LEAD = 0.45; // scene starts this far before its VO
// Music bed under the two cinematic bookends (same bed + envelope family as
// the cln tutorial's BookendAudio), ducked once narration is speaking.
const MUSIC = 'cln-tutorial/audio/tutorial.mp3';
const fadeInOut = (frame: number, duration: number, fade: number) =>
  interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Scene frame windows
const sceneStart = T.beats.map((b, i) => (i === 0 ? 0 : Math.round((b.voStart - LEAD) * FPS)));
const sceneDur = T.beats.map((_, i) =>
  i + 1 < T.beats.length ? sceneStart[i + 1] - sceneStart[i] : T.total_frames - sceneStart[i],
);

/** Seconds since this scene's VO started (scene-local clock). */
const useSceneSec = (beatIndex: number) => {
  const frame = useCurrentFrame();
  return (frame + sceneStart[beatIndex]) / FPS - T.beats[beatIndex].voStart;
};

const fadeTail = (sec: number, beatIndex: number, fade = 0.4) => {
  const end = (sceneStart[beatIndex] + sceneDur[beatIndex]) / FPS - T.beats[beatIndex].voStart;
  return interpolate(sec, [end - fade, end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// ════════════════════════════════════════════════════════
// Beat 1 — Hook: too strong / too weak / nobody measured
// ════════════════════════════════════════════════════════
const TypeOnLine: React.FC<{ text: string; accent: string; progress: number; dim: number }> = ({
  text,
  accent,
  progress,
  dim,
}) => {
  const reveal = easeInOut(progress);
  const [head, tail] = text.split('—');
  return (
    <div
      style={{
        overflow: 'hidden',
        marginTop: 34,
        opacity: progress > 0 ? dim : 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 22,
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
        }}
      >
        <span
          style={{
            color: accent,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 84,
            letterSpacing: 1.5,
            textShadow: `0 0 44px rgba(${hexToRgb(accent)},0.45)`,
          }}
        >
          {head.trim()}
        </span>
        {tail && (
          <span style={{ color: 'rgba(255,255,255,0.82)', fontFamily: BODY, fontWeight: 500, fontSize: 37 }}>
            — {tail.trim()}
          </span>
        )}
      </div>
      <div
        style={{
          marginTop: 12,
          width: `${reveal * 46}%`,
          height: 4,
          borderRadius: 4,
          background: `rgba(${hexToRgb(accent)},0.65)`,
        }}
      />
    </div>
  );
};

const S1Hook: React.FC = () => {
  const sec = useSceneSec(0);
  const frame = useCurrentFrame();
  const zoom = 1.06 + (frame / FPS) * 0.004;
  const enter = seg(sec, -0.4, 1.2);
  // Iris tries to open over the drum and fails
  const irisTry = seg(sec, 13.4, 15.2);
  const irisFail = seg(sec, 17.2, 18.6);
  const openness = clamp01(irisTry * 0.66 - irisFail * 0.66);
  const dip = seg(sec, 18.2, 19.6);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Img
        src={staticFile('ccv-tutorial/shots/drum-grey.png')}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1920,
          height: 1080,
          transform: `translate(-50%, -50%) scale(${zoom})`,
          opacity: enter * (1 - dip * 0.72),
          filter: 'saturate(0.32) brightness(0.8)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 46%, transparent 30%, rgba(0,0,0,0.78) 88%)',
        }}
      />
      <div style={{ position: 'absolute', left: 120, top: 210, width: 1500 }}>
        <TypeOnLine text="TOO STRONG — corrodes the line, burns skin." accent={CORAL} progress={seg(sec, 0.7, 3.0)} dim={1 - dip * 0.7} />
        <TypeOnLine text="TOO WEAK — bacteria survive the clean." accent={CORAL} progress={seg(sec, 5.1, 7.4)} dim={1 - dip * 0.7} />
        <TypeOnLine text="NOBODY MEASURED — so nobody knew." accent="#B9C4CE" progress={seg(sec, 10.9, 13.2)} dim={1 - dip * 0.55} />
      </div>
      <Iris cx={962} cy={585} r={205} openness={openness} flicker={irisTry > 0.2 ? 0.55 + irisFail * 0.4 : 0} glow={0.7} />
      {irisFail >= 1 && (
        <div
          style={{
            position: 'absolute',
            left: 690,
            top: 812,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: BODY,
            fontSize: 26,
            letterSpacing: 5,
            textTransform: 'uppercase',
            opacity: seg(sec, 18.4, 19.2) * (1 - seg(sec, 19.9, 20.4)),
          }}
        >
          nobody was watching
        </div>
      )}
      {/* Ecowize mark — quiet corner presence on the branded bookend */}
      <div
        style={{
          position: 'absolute',
          right: 84,
          bottom: 44,
          background: '#F7FAFC',
          borderRadius: 14,
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 12px 34px rgba(0,0,0,0.4)',
          opacity: seg(sec, 0.9, 2.0) * (1 - dip * 0.75) * 0.92,
        }}
      >
        <Img src={staticFile('images/ecowize-logo.webp')} style={{ width: 148, height: 54, objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 2 — The second pair of eyes (iris opens, CCV title)
// ════════════════════════════════════════════════════════
const S2SecondPair: React.FC = () => {
  const sec = useSceneSec(1);
  const colorSnap = seg(sec, 0.0, 1.1);
  // Two committed blinks, then hold open
  const blink = (from: number, to: number) => 1 - Math.sin(clamp01((sec - from) / (to - from)) * Math.PI);
  const openness =
    sec < 0.2
      ? seg(sec, -0.3, 0.2)
      : Math.min(blink(1.15, 1.62), blink(2.1, 2.5));
  const titleIn = seg(sec, 3.1, 4.3);
  const subIn = seg(sec, 4.6, 5.7);
  const phoneIn = easeInOut(seg(sec, 8.2, 9.6));
  const pan = interpolate(easeInOut(seg(sec, 11.5, 19.5)), [0, 1], [0, 700]);
  const irisShift = easeInOut(seg(sec, 6.6, 8.4));
  const tail = fadeTail(sec, 1);

  return (
    <AbsoluteFill style={{ background: '#000', opacity: tail }}>
      <Img
        src={staticFile('ccv-tutorial/shots/drum-color.png')}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1920,
          height: 1080,
          transform: `translate(-50%, -50%) scale(${1.145 - easeInOut(seg(sec, 0, 6)) * 0.06})`,
          filter: `saturate(${0.35 + colorSnap * 0.75}) brightness(${0.8 + colorSnap * 0.18})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, rgba(4,10,15,${0.42 + irisShift * 0.4}) 34%, rgba(4,10,15,${0.12 + irisShift * 0.18}) 70%)`,
        }}
      />
      <Iris
        cx={interpolate(irisShift, [0, 1], [962, 300])}
        cy={interpolate(irisShift, [0, 1], [585, 300])}
        r={interpolate(irisShift, [0, 1], [205, 116])}
        openness={openness}
        glow={0.9}
      />
      <div style={{ position: 'absolute', left: 120, top: 452, width: 1050 }}>
        <div
          style={{
            color: '#fff',
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 0.98,
            letterSpacing: 1,
            textShadow: '0 18px 60px rgba(0,0,0,0.6)',
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 30}px)`,
          }}
        >
          CHEMICAL CONCENTRATION
          <br />
          VERIFICATION
        </div>
        <div
          style={{
            marginTop: 26,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            opacity: subIn,
          }}
        >
          <div style={{ width: 74, height: 5, borderRadius: 4, background: SKY, boxShadow: `0 0 22px ${SKY}` }} />
          <div style={{ color: 'rgba(255,255,255,0.86)', fontFamily: BODY, fontWeight: 500, fontSize: 38 }}>
            A second pair of eyes on every drum.
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            color: 'rgba(255,255,255,0.55)',
            fontFamily: BODY,
            fontSize: 27,
            width: 780,
            lineHeight: 1.4,
            opacity: seg(sec, 6.2, 7.4),
          }}
        >
          It doesn't trust the label. It doesn't trust your memory. It measures.
        </div>
      </div>
      <Phone x={1345} y={62} height={956} entrance={phoneIn} tilt={-5} pan={pan} window={2180} shots={[{ src: 'station-list-top.png', opacity: 1 }]} />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 3 — Issue Scope: entire factory or department
// ════════════════════════════════════════════════════════
const ScopePill: React.FC<{ text: string; active: boolean; width: number }> = ({ text, active, width }) => (
  <div
    style={{
      width,
      height: 78,
      borderRadius: 999,
      border: `2px solid ${active ? SKY : APP_BORDER}`,
      background: active ? SKY_TINT : SURFACE,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: active ? FG : MUTED,
      fontFamily: DISPLAY,
      fontWeight: 600,
      fontSize: 27,
      letterSpacing: 1.8,
      boxShadow: active ? `0 0 26px rgba(${hexToRgb(SKY)},0.35)` : undefined,
    }}
  >
    {text}
  </div>
);

const S3IssueScope: React.FC = () => {
  const sec = useSceneSec(2);
  const textIn = seg(sec, 0.0, 0.7);
  const tapP = seg(sec, 5.0, 5.55);
  const swap = sec >= 5.5; // DEPARTMENT picked
  const travel = easeInOut(seg(sec, 10.2, 11.6));
  const tail = fadeTail(sec, 2);
  const ring = { x: 45, y: 740, w: 1254, h: 165 };

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop />
      <Phone
        x={96}
        y={54}
        height={962}
        entrance={easeInOut(seg(sec, -0.4, 0.5))}
        shots={[
          { src: 'issue-scope-factory.png', opacity: swap ? 0 : 1 },
          { src: 'issue-scope-dept.png', opacity: swap ? 1 : 0 },
        ]}
        overlay={(m) => (
          <>
            <Ring box={ring} appear={seg(sec, 1.2, 1.8) * (1 - seg(sec, 9.6, 10.2))} mapper={m} />
            <Tap cx={990} cy={825} progress={tapP} mapper={m} />
          </>
        )}
      />
      <div style={{ position: 'absolute', left: 640, top: 96, width: 1180 }}>
        <ChipLabel text="Before anything is measured" appear={textIn} />
        <Headline text="One choice: who is this issue for?" appear={textIn} />
        <BodyText
          text="The entire factory, or a single department. It's the first real decision on the issue screen — made before a single litre is poured."
          appear={seg(sec, 0.4, 1.1)}
        />
        <div style={{ display: 'flex', gap: 22, marginTop: 44, opacity: seg(sec, 1.6, 2.4) }}>
          <ScopePill text="ENTIRE FACTORY" active={!swap} width={420} />
          <ScopePill text="DEPARTMENT" active={swap} width={420} />
        </div>
        {/* the choice travels with the record */}
        <div style={{ marginTop: 46, position: 'relative', opacity: seg(sec, 9.0, 9.8) }}>
          <AppCard width={862} padding={24}>
            <div style={{ color: MUTED, fontFamily: DISPLAY, fontSize: 21, letterSpacing: 2.4, fontWeight: 600 }}>
              ISSUE RECORD · EXTREME XF
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
              <div style={{ color: FG2, fontFamily: BODY, fontSize: 26 }}>Scope:</div>
              <div
                style={{
                  borderRadius: 999,
                  border: `2px solid ${SKY}`,
                  background: SKY_TINT,
                  color: SKY_DEEP,
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: 24,
                  letterSpacing: 1.6,
                  padding: '8px 22px',
                  opacity: travel,
                  transform: `translateY(${(1 - travel) * -56}px) scale(${0.7 + travel * 0.3})`,
                }}
              >
                ADMINISTRATION OFFICES
              </div>
              <div style={{ color: MUTED, fontFamily: BODY, fontSize: 23, opacity: travel }}>
                → saved on every dilution
              </div>
            </div>
          </AppCard>
        </div>
        <ProofChip text="Scope travels with the record — every dilution tied to where it was used." appear={seg(sec, 12.6, 13.4)} />
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 4 — The Matrix decides the standard
// ════════════════════════════════════════════════════════
const LockIcon: React.FC<{ size?: number; color?: string; openAmount?: number }> = ({
  size = 34,
  color = SKY_DEEP,
  openAmount = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x={4.5} y={10.5} width={15} height={10} rx={2.4} stroke={color} strokeWidth={2} />
    <g transform={`rotate(${-openAmount * 110} 16.5 10.5)`}>
      <path d="M8 10.5V7.5C8 5.02 10 3 12.5 3C14.4 3 16 4.2 16.6 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </g>
    <circle cx={12} cy={15.4} r={1.7} fill={color} />
  </svg>
);

const S4Matrix: React.FC = () => {
  const sec = useSceneSec(3);
  const textIn = seg(sec, 0.0, 0.7);
  const matrixIn = easeInOut(seg(sec, 3.2, 4.2));
  const beam = easeInOut(seg(sec, 7.6, 9.2));
  const lockIn = easeInOut(seg(sec, 11.4, 12.0));
  const tail = fadeTail(sec, 3);

  const matrixRows = [
    ['Chemical', 'Sandrox PA'],
    ['Method', 'Titration (drops)'],
    ['Approved range', '0.3 – 2.0 %'],
    ['Reference', 'SEN-TMPT-SANDROX PA v3.0'],
  ];

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop />
      <Phone
        x={96}
        y={54}
        height={962}
        entrance={easeInOut(seg(sec, -0.4, 0.5))}
        shots={[{ src: 'verify-blank.png', opacity: 1 }]}
        overlay={(m) => <Ring box={{ x: 48, y: 695, w: 1248, h: 345 }} appear={seg(sec, 8.9, 9.6)} mapper={m} />}
      />
      <div style={{ position: 'absolute', left: 640, top: 88, width: 1180 }}>
        <ChipLabel text="Set before anyone touches a station" appear={textIn} />
        <Headline text="The Matrix decides the standard." appear={textIn} />
        <BodyText
          text="Each chemical's spec lives in one place — its approved range, and the one test method that proves it."
          appear={seg(sec, 0.4, 1.1)}
          width={900}
        />
        <div style={{ marginTop: 40, opacity: matrixIn, transform: `translateY(${(1 - matrixIn) * 24}px)` }}>
          <div style={{ position: 'relative', width: 520 }}>
            <AppCard width={520} padding={24}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: SKY_TINT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: SKY_DEEP,
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: 24,
                  }}
                >
                  ⌗
                </div>
                <div style={{ color: FG, fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1 }}>
                  CHEMICAL MATRIX
                </div>
              </div>
              {matrixRows.map(([k, v], i) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '13px 2px',
                    borderBottom: i < matrixRows.length - 1 ? `1px solid ${APP_BORDER}` : undefined,
                    opacity: seg(sec, 3.8 + i * 0.5, 4.4 + i * 0.5),
                  }}
                >
                  <div style={{ color: MUTED, fontFamily: BODY, fontSize: 22 }}>{k}</div>
                  <div style={{ color: FG, fontFamily: BODY, fontWeight: 700, fontSize: 22, textAlign: 'right' }}>{v}</div>
                </div>
              ))}
            </AppCard>
            {/* the standard is sealed: lock stamps into the matrix card itself */}
            <div
              style={{
                position: 'absolute',
                right: 20,
                top: 20,
                opacity: lockIn,
                transform: `scale(${0.5 + lockIn * 0.5}) rotate(${(1 - lockIn) * -20}deg)`,
              }}
            >
              <LockIcon size={44} />
            </div>
          </div>
        </div>
        <ProofChip text="Operators measure and read — they never decide what “correct” means." appear={seg(sec, 16.4, 17.3)} />
      </div>
      {/* beam: the Matrix spec travels INTO the phone's real Approved Range hero —
          the only such card on screen (Daniel's ghosting fix: no recreated twin). */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <path
          d="M 660 580 C 520 580, 640 310, 545 305"
          fill="none"
          stroke={`rgba(${hexToRgb(SKY)},${0.9 * (beam > 0 ? 1 : 0)})`}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={560}
          strokeDashoffset={560 - beam * 560}
          style={{ filter: `drop-shadow(0 0 10px rgba(${hexToRgb(SKY)},0.8))` }}
        />
        {beam > 0.98 && (
          <circle
            cx={545}
            cy={305}
            r={9 + 3 * Math.sin(sec * 6)}
            fill={SKY}
            opacity={1 - seg(sec, 10.6, 11.4)}
            style={{ filter: `drop-shadow(0 0 14px ${SKY})` }}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 5 — Manual dilution: computed live, then verify now
// ════════════════════════════════════════════════════════
const S5Manual: React.FC = () => {
  const sec = useSceneSec(4);
  const textIn = seg(sec, 0.0, 0.7);
  // phone stills: blank → out-of-range → in-range
  const showOut = seg(sec, 5.2, 5.9);
  const showIn = seg(sec, 9.4, 10.1);
  const heroRing = { x: 49, y: 1625, w: 1246, h: 330 };
  // live readout mirrors the phone
  const pct = interpolate(easeInOut(seg(sec, 4.2, 6.0)), [0, 1], [0, 9.1]) - interpolate(easeInOut(seg(sec, 9.2, 10.4)), [0, 1], [0, 7.1]);
  const state = sec < 5.4 ? 'idle' : sec < 9.8 ? 'out' : 'in';
  const stateColor = state === 'idle' ? SKY : state === 'out' ? CORAL : EMERALD;
  const dialogIn = easeInOut(seg(sec, 15.2, 16.2));
  const pulse = 0.5 + 0.5 * Math.sin(sec * 5.2);
  const tail = fadeTail(sec, 4);

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop />
      <Phone
        x={96}
        y={54}
        height={962}
        entrance={easeInOut(seg(sec, -0.4, 0.5))}
        pan={interpolate(easeInOut(seg(sec, 2.6, 4.4)), [0, 1], [0, 620])}
        window={2200}
        shots={[
          { src: 'issue-scope-factory.png', opacity: 1 - showOut },
          { src: 'issue-manual-outofrange.png', opacity: showOut * (1 - showIn) },
          { src: 'issue-manual-inrange.png', opacity: showIn },
        ]}
        overlay={(m) => (
          <Ring box={heroRing} appear={seg(sec, 5.9, 6.5)} color={state === 'in' ? EMERALD : CORAL} mapper={m} />
        )}
      />
      <div style={{ position: 'absolute', left: 720, top: 88, width: 1180 }}>
        <ChipLabel text="Manual dilution" appear={textIn} />
        <Headline text="Chemical in. Water in. The percentage computes itself." appear={textIn} size={64} width={1040} />
        <BodyText
          text="You enter both — the litres of chemical and the water you used. The app calculates the dilution percentage live against the approved range, and turns coral the moment you drift out."
          appear={seg(sec, 0.4, 1.1)}
          width={940}
        />
        {/* the two operator entries feeding the calculation */}
        <div style={{ display: 'flex', gap: 18, marginTop: 32, opacity: seg(sec, 2.4, 3.2) }}>
          {[
            { label: 'LITRES CHEMICAL', value: sec > 3.4 ? '1' : '', at: 3.4 },
            { label: 'LITRES WATER', value: sec > 9.6 ? '50' : sec > 4.2 ? '10' : '', at: 4.2 },
          ].map((f) => (
            <div key={f.label} style={{ width: 300 }}>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontFamily: DISPLAY, fontWeight: 600, fontSize: 20, letterSpacing: 2.2 }}>
                {f.label}
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 66,
                  borderRadius: 14,
                  background: SURFACE,
                  border: `1px solid ${APP_BORDER}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 20px',
                  color: f.value ? FG : MUTED,
                  fontFamily: BODY,
                  fontSize: 27,
                  fontWeight: f.value ? 700 : 400,
                  boxShadow: sec > f.at && sec < f.at + 0.8 ? `0 0 22px rgba(${hexToRgb(SKY)},0.5)` : undefined,
                }}
              >
                {f.value || '0'}
              </div>
            </div>
          ))}
          <div
            style={{
              alignSelf: 'flex-end',
              height: 66,
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: BODY,
              fontSize: 26,
              opacity: seg(sec, 4.0, 4.8),
            }}
          >
            → % calculated
          </div>
        </div>
        {/* live computed-dilution readout (recreated hero) */}
        <div style={{ marginTop: 26, opacity: seg(sec, 2.8, 3.6) }}>
          <div
            style={{
              width: 620,
              borderRadius: 22,
              border: `2px solid rgba(${hexToRgb(stateColor)},0.5)`,
              background: `rgba(${hexToRgb(stateColor)},0.10)`,
              padding: '26px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                color: stateColor,
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: 23,
                letterSpacing: 3,
              }}
            >
              COMPUTED DILUTION
            </div>
            <div
              style={{
                marginTop: 4,
                color: stateColor,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 80,
                lineHeight: 1.04,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {sec < 4.2 ? '—' : `${Math.max(pct, 0).toFixed(1)} %`}
            </div>
            <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.7)', fontFamily: BODY, fontSize: 24 }}>
              Approved 0.5–5.0 %{state === 'out' ? ' · OUT OF RANGE' : state === 'in' ? ' · in range' : ''}
            </div>
          </div>
        </div>
        {/* verify-now push */}
        <div style={{ marginTop: 24, opacity: dialogIn, transform: `translateY(${(1 - dialogIn) * 26}px)` }}>
          <AppCard width={760} padding={22}>
            <div style={{ color: FG, fontFamily: BODY, fontWeight: 700, fontSize: 27 }}>Manual issue recorded</div>
            <div style={{ marginTop: 8, color: FG2, fontFamily: BODY, fontSize: 22 }}>
              The dilution issue is logged. Verify now, or leave it pending for later.
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 22, alignItems: 'center' }}>
              <div
                style={{
                  padding: '18px 30px',
                  borderRadius: 16,
                  border: `1px solid ${APP_BORDER}`,
                  color: MUTED,
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  fontSize: 24,
                  letterSpacing: 1.6,
                }}
              >
                VERIFY LATER
              </div>
              <AppButton text="VERIFY NOW  →" width={330} height={64} fontSize={25} glow={pulse} />
            </div>
          </AppCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 6 — Satellite / dosing: record the litres issued, no dilution.
// (No "load drum" step — that terminology is retired; the whole beat
//  lives on the real DEPT/SATELLITE issue screen.)
// ════════════════════════════════════════════════════════
const S6Satellite: React.FC = () => {
  const sec = useSceneSec(5);
  const textIn = seg(sec, 0.0, 0.7);
  const showSelected = seg(sec, 7.0, 7.7); // Superline satellite picked
  const deltaAt = [3.2, 8.4, 13.0];
  const deltas = [
    'No water field at issue — the pump doses downstream',
    'You just record the chemical litres issued to the station',
    'Verification is tracked per dosing station, not per issue',
  ];
  const badgeIn = seg(sec, 18.6, 19.3);
  const proveIn = seg(sec, 22.2, 23.0);
  const tail = fadeTail(sec, 5);

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop />
      <Phone
        x={96}
        y={54}
        height={962}
        entrance={easeInOut(seg(sec, -0.4, 0.5))}
        pan={interpolate(easeInOut(seg(sec, 13.5, 15.5)), [0, 1], [0, 560])}
        window={2300}
        shots={[
          { src: 'issue-satellite.png', opacity: 1 - showSelected },
          { src: 'issue-satellite-selected.png', opacity: showSelected },
        ]}
        overlay={(m) => (
          <>
            <Ring
              box={{ x: 48, y: 2015, w: 1248, h: 198 }}
              appear={seg(sec, 3.6, 4.3) * (1 - seg(sec, 7.6, 8.2))}
              color={AMBER}
              mapper={m}
            />
            <Ring
              box={{ x: 48, y: 1745, w: 1248, h: 220 }}
              appear={seg(sec, 8.8, 9.5) * (1 - seg(sec, 12.8, 13.4))}
              mapper={m}
            />
          </>
        )}
      />
      <div style={{ position: 'absolute', left: 720, top: 88, width: 1180 }}>
        <ChipLabel text="Satellite & auto-dosing stations" appear={textIn} color={AMBER} />
        <Headline text="Different track: no dilution at issue time." appear={textIn} size={66} width={1020} />
        <div style={{ marginTop: 30 }}>
          {deltas.map((d, i) => {
            const a = seg(sec, deltaAt[i], deltaAt[i] + 0.7);
            return (
              <div
                key={d}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  marginTop: 18,
                  opacity: a,
                  transform: `translateX(${(1 - a) * 26}px)`,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `rgba(${hexToRgb(AMBER)},0.16)`,
                    border: `1px solid rgba(${hexToRgb(AMBER)},0.5)`,
                    color: AMBER,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: 24,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.82)', fontFamily: BODY, fontSize: 29, fontWeight: 500 }}>{d}</div>
              </div>
            );
          })}
        </div>
        {/* fresh batch flagged until proven */}
        <div style={{ marginTop: 44, opacity: seg(sec, 17.4, 18.1) }}>
          <AppCard width={880} padding={24}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: FG, fontFamily: DISPLAY, fontWeight: 600, fontSize: 30 }}>Extreme XF · Super Line</div>
                <div style={{ marginTop: 6, color: FG2, fontFamily: BODY, fontSize: 22 }}>
                  Fresh batch issued · first check pending
                </div>
              </div>
              <div style={{ position: 'relative', width: 300, height: 62, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ opacity: 1 - proveIn, position: 'absolute', right: 0 }}>
                  <AppBadge text="NEEDS VERIFY" color={AMBER} size={27} appear={badgeIn} />
                </div>
                <div style={{ opacity: proveIn, position: 'absolute', right: 0 }}>
                  <AppBadge text="DONE TODAY" color={EMERALD} size={27} appear={proveIn} />
                </div>
              </div>
            </div>
          </AppCard>
        </div>
        <ProofChip text="A fresh batch stays flagged — until it's been proven." color={AMBER} appear={seg(sec, 20.2, 21.0)} />
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 7 — The twist: there is no dropdown
// ════════════════════════════════════════════════════════
// The three methods used in practice (Daniel's domain correction, round 4).
const METHOD_LABELS = ['Titration (drops)', 'Conductivity', 'Test strip'];

/** One shard of the shattering dropdown: same panel, clipped + thrown. */
const Shard: React.FC<{
  clip: string;
  dx: number;
  dy: number;
  rot: number;
  progress: number;
  children: React.ReactNode;
}> = ({ clip, dx, dy, rot, progress, children }) => {
  const p = easeInOut(progress);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        clipPath: clip,
        transform: `translate(${dx * p}px, ${dy * p + 240 * p * p}px) rotate(${rot * p}deg)`,
        opacity: 1 - p * 0.96,
      }}
    >
      {children}
    </div>
  );
};

const S7Twist: React.FC = () => {
  const sec = useSceneSec(6);
  const textIn = seg(sec, 0.0, 0.7);
  const dropIn = easeInOut(seg(sec, 1.6, 2.6));
  const rowsIn = (i: number) => seg(sec, 2.4 + i * 0.35, 2.9 + i * 0.35);
  const shatter = seg(sec, 8.2, 10.0);
  const revealRing = seg(sec, 10.4, 11.1);
  const tail = fadeTail(sec, 6);

  const dropdown = (
    <AppCard width={560} padding={0} style={{ overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: `1px solid ${APP_BORDER}`,
          background: CANVAS,
        }}
      >
        <div style={{ color: FG, fontFamily: DISPLAY, fontWeight: 600, fontSize: 27, letterSpacing: 1.6 }}>
          SELECT TEST METHOD
        </div>
        <div style={{ color: MUTED, fontSize: 24 }}>▾</div>
      </div>
      {METHOD_LABELS.map((mth, i) => (
        <div
          key={mth}
          style={{
            padding: '19px 24px',
            borderBottom: i < METHOD_LABELS.length - 1 ? `1px solid ${APP_BORDER}` : undefined,
            color: FG2,
            fontFamily: BODY,
            fontSize: 26,
            opacity: rowsIn(i),
          }}
        >
          {mth}
        </div>
      ))}
    </AppCard>
  );

  // shard clip polygons (irregular, cover the panel)
  const shards: Array<[string, number, number, number]> = [
    ['polygon(0% 0%, 55% 0%, 38% 30%, 0% 24%)', -260, -160, -24],
    ['polygon(55% 0%, 100% 0%, 100% 26%, 38% 30%)', 300, -190, 18],
    ['polygon(0% 24%, 38% 30%, 24% 58%, 0% 52%)', -330, 40, -14],
    ['polygon(38% 30%, 100% 26%, 100% 55%, 24% 58%)', 360, 20, 12],
    ['polygon(0% 52%, 24% 58%, 42% 100%, 0% 100%)', -240, 240, -20],
    ['polygon(24% 58%, 100% 55%, 100% 100%, 42% 100%)', 280, 280, 26],
  ];

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop variant="deep" />
      <Phone
        x={96}
        y={54}
        height={962}
        entrance={easeInOut(seg(sec, -0.4, 0.4))}
        shots={[{ src: 'verify-blank.png', opacity: 1 }]}
        overlay={(m) => <Ring box={{ x: 430, y: 938, w: 480, h: 82 }} appear={revealRing} mapper={m} />}
      />
      <div style={{ position: 'absolute', left: 640, top: 88, width: 1200 }}>
        <ChipLabel text="What most people get wrong" appear={textIn} color={CORAL} />
        <Headline text="You'd expect to choose a test method." appear={textIn} size={64} width={1040} />
        {/* the fake dropdown + its destruction */}
        <div style={{ position: 'relative', width: 560, height: 470, marginTop: 40 }}>
          <div style={{ opacity: dropIn * (shatter > 0 ? 0 : 1), transform: `translateY(${(1 - dropIn) * 26}px)` }}>
            {dropdown}
          </div>
          {shatter > 0 &&
            shatter < 1 &&
            shards.map(([clip, dx, dy, rot], i) => (
              <Shard key={i} clip={clip} dx={dx} dy={dy} rot={rot} progress={shatter}>
                {dropdown}
              </Shard>
            ))}
          {/* what's underneath: the method was never a choice */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              opacity: seg(sec, 9.6, 10.6),
            }}
          >
            <div
              style={{
                color: '#fff',
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 84,
                lineHeight: 1.02,
                textShadow: `0 0 44px rgba(${hexToRgb(SKY)},0.35)`,
              }}
            >
              There is no dropdown.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 26 }}>
              <LockIcon size={46} color={SKY} />
              <div style={{ color: 'rgba(255,255,255,0.78)', fontFamily: BODY, fontSize: 30 }}>
                Method: <b style={{ color: SKY }}>Titration (drops)</b> — locked by the Matrix
              </div>
            </div>
          </div>
        </div>
        <ProofChip
          text="Walk up. The correct test is already waiting."
          appear={seg(sec, 17.6, 18.4)}
        />
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 8 — Six ways to see the same truth (shapeshifter)
// ════════════════════════════════════════════════════════
const ReadingField: React.FC<{ placeholder: string; unit: string; value?: string; big?: boolean }> = ({
  placeholder,
  unit,
  value,
  big = true,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      background: SURFACE,
      border: `2px solid rgba(${hexToRgb(SKY)},0.28)`,
      borderRadius: 16,
      padding: '0 26px',
      height: big ? 96 : 80,
    }}
  >
    <div
      style={{
        flex: 1,
        color: value ? FG : MUTED,
        fontFamily: DISPLAY,
        fontWeight: value ? 700 : 500,
        fontSize: value ? (big ? 52 : 36) : 30,
      }}
    >
      {value ?? placeholder}
    </div>
    <div style={{ color: FG2, fontFamily: DISPLAY, fontWeight: 500, fontSize: 27, letterSpacing: 2 }}>{unit}</div>
  </div>
);

const MethodInput: React.FC<{ method: string }> = ({ method }) => {
  switch (method) {
    case 'Titration (drops)':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ReadingField placeholder="No. of drops (optional log)" unit="drops" value="12" big={false} />
          <ReadingField placeholder="Reading %" unit="%" value="1.2" />
        </div>
      );
    case 'Test strip':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ReadingField placeholder="Strip reading" unit="ppm" value="200" />
          <div style={{ color: FG2, fontFamily: BODY, fontSize: 21 }}>Match the strip against the colour chart, enter the value</div>
        </div>
      );
    case 'Conductivity':
    default:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ReadingField placeholder="Solution µS" unit="µS" value="3410" big={false} />
          <div style={{ position: 'relative' }}>
            <ReadingField placeholder="Plant-water baseline µS" unit="µS" value="182" big={false} />
          </div>
          <div style={{ color: SKY_DEEP, fontFamily: BODY, fontSize: 21 }}>From shift baseline · Test Site Admin</div>
        </div>
      );
  }
};

const S8SixMethods: React.FC = () => {
  const sec = useSceneSec(7);
  const textIn = seg(sec, 0.0, 0.7);
  // three real methods; conductivity last so the baseline callout rides its phase
  const phases: Array<{ m: string; from: number; to: number }> = [
    { m: 'Titration (drops)', from: 1.8, to: 7.0 },
    { m: 'Test strip', from: 7.0, to: 11.6 },
    { m: 'Conductivity', from: 11.6, to: 20.2 },
  ];
  const active = phases.findIndex((p) => sec >= p.from && sec < p.to);
  const activeIdx = sec < phases[0].from ? 0 : active === -1 ? phases.length - 1 : active;
  const phase = phases[activeIdx];
  const flip = seg(sec, phase.from, phase.from + 0.42);
  const rotX = interpolate(easeInOut(flip), [0, 1], [78, 0]);
  const baselineFlash = 0.5 + 0.5 * Math.sin(sec * 6);
  const condCallout = seg(sec, 14.8, 15.7) * (1 - seg(sec, 19.4, 20.2));
  const repeatIn = seg(sec, 20.6, 21.5);
  const checks = [
    { t: '06:12', from: 22.0 },
    { t: '11:40', from: 23.4 },
    { t: '15:05', from: 24.8 },
  ];
  const tail = fadeTail(sec, 7);

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop variant="deep" />
      <div style={{ position: 'absolute', left: 120, top: 76, width: 1700 }}>
        <ChipLabel text="Three methods · one screen" appear={textIn} />
        <Headline text="The verify screen adapts to the chemical." appear={textIn} size={72} />
      </div>
      {/* stage: constant hero + morphing input */}
      <div style={{ position: 'absolute', left: 120, top: 310, width: 760 }}>
        <SpecHero
          label="Approved range"
          value={phase.m === 'Test strip' ? '150–250 ppm' : phase.m === 'Conductivity' ? '1.0–3.0 %' : '0.3–2.0 %'}
          method={`Method: ${phase.m}`}
          width={760}
        />
        <div
          style={{
            marginTop: 26,
            transformOrigin: 'top center',
            transform: `perspective(1400px) rotateX(${rotX}deg)`,
            opacity: 0.25 + 0.75 * flip,
          }}
        >
          <AppCard width={760} padding={26}>
            <div style={{ color: MUTED, fontFamily: DISPLAY, fontWeight: 600, fontSize: 21, letterSpacing: 2.6, marginBottom: 16 }}>
              YOUR READING
            </div>
            <MethodInput method={phase.m} />
          </AppCard>
        </div>
        {/* conductivity autofill callout */}
        <div
          style={{
            marginTop: 22,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            borderRadius: 16,
            border: `2px solid rgba(${hexToRgb(SKY)},${0.4 + baselineFlash * 0.4})`,
            background: `rgba(${hexToRgb(SKY)},0.12)`,
            padding: '14px 20px',
            color: '#fff',
            fontFamily: BODY,
            fontSize: 25,
            opacity: condCallout,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: SKY, boxShadow: `0 0 16px ${SKY}` }} />
          Plant-water baseline auto-fills from the shift — captured once, used everywhere.
        </div>
      </div>
      {/* method gate rail */}
      <div style={{ position: 'absolute', left: 1000, top: 340, width: 800 }}>
        {METHOD_LABELS.map((m, i) => {
          const phaseOrder = ['Titration (drops)', 'Test strip', 'Conductivity'];
          const isActive = phase.m === m;
          const passed = phaseOrder.indexOf(m) < phaseOrder.indexOf(phase.m);
          return (
            <div
              key={m}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                marginTop: 14,
                opacity: seg(sec, 0.8 + i * 0.16, 1.3 + i * 0.16),
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  border: `2px solid ${isActive ? SKY : passed ? EMERALD : 'rgba(255,255,255,0.2)'}`,
                  background: isActive ? `rgba(${hexToRgb(SKY)},0.18)` : passed ? `rgba(${hexToRgb(EMERALD)},0.12)` : 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? SKY : passed ? EMERALD : 'rgba(255,255,255,0.4)',
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 25,
                  boxShadow: isActive ? `0 0 26px rgba(${hexToRgb(SKY)},0.4)` : undefined,
                  transform: `scale(${isActive ? 1.08 : 1})`,
                }}
              >
                {passed ? '✓' : i + 1}
              </div>
              <div
                style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  fontFamily: DISPLAY,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 33,
                  letterSpacing: 0.6,
                }}
              >
                {m}
              </div>
            </div>
          );
        })}
        {/* repeat-verification end cap */}
        <div style={{ marginTop: 46, opacity: repeatIn }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontFamily: BODY, fontWeight: 700, fontSize: 27 }}>
            …and it doesn't stop at one check.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 22 }}>
            {checks.map((c, i) => {
              const a = seg(sec, c.from, c.from + 0.5);
              return (
                <React.Fragment key={c.t}>
                  {i > 0 && (
                    <div
                      style={{
                        width: 92,
                        height: 4,
                        background: `rgba(${hexToRgb(EMERALD)},${0.25 + a * 0.5})`,
                      }}
                    />
                  )}
                  <div style={{ opacity: a, transform: `scale(${0.6 + a * 0.4})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 31,
                        background: `rgba(${hexToRgb(EMERALD)},0.16)`,
                        border: `2px solid ${EMERALD}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: EMERALD,
                        fontSize: 30,
                        fontWeight: 800,
                        boxShadow: `0 0 22px rgba(${hexToRgb(EMERALD)},0.35)`,
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: BODY, fontSize: 21 }}>{c.t}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div style={{ marginTop: 18, color: 'rgba(255,255,255,0.55)', fontFamily: BODY, fontSize: 24, width: 620 }}>
            Concentration is proven again and again — start of shift to end.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 9 — Out of spec: the app won't let you walk away
// ════════════════════════════════════════════════════════
const CheckRow: React.FC<{ label: string; done: number }> = ({ label, done }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        border: `2px solid ${done > 0.5 ? EMERALD : 'rgba(255,255,255,0.3)'}`,
        background: done > 0.5 ? `rgba(${hexToRgb(EMERALD)},0.16)` : 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: EMERALD,
        fontSize: 24,
        fontWeight: 800,
      }}
    >
      <span style={{ opacity: done, transform: `scale(${0.4 + done * 0.6})`, display: 'inline-block' }}>✓</span>
    </div>
    <div style={{ color: 'rgba(255,255,255,0.82)', fontFamily: BODY, fontSize: 28, fontWeight: 500 }}>{label}</div>
  </div>
);

const S9OutOfSpec: React.FC = () => {
  const sec = useSceneSec(8);
  const textIn = seg(sec, 0.0, 0.7);
  const showResolved = seg(sec, 12.6, 13.3);
  const correctiveDone = easeInOut(seg(sec, 8.6, 9.4));
  const retestDone = easeInOut(seg(sec, 11.8, 12.6));
  const unlocked = correctiveDone > 0.9 && retestDone > 0.9;
  const unlockP = easeInOut(seg(sec, 13.0, 13.9));
  const shake = seg(sec, 3.0, 3.5);
  const shakeX = shake > 0 && shake < 1 ? Math.sin(shake * Math.PI * 6) * 9 * (1 - shake) : 0;
  const tail = fadeTail(sec, 8);

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop />
      <Phone
        x={96}
        y={54}
        height={962}
        entrance={easeInOut(seg(sec, -0.4, 0.5))}
        // second pan segment reads as the operator scrolling as the resolved
        // still fades in (that capture is scrolled further down the screen)
        pan={
          interpolate(easeInOut(seg(sec, 4.6, 6.2)), [0, 1], [0, 480]) -
          interpolate(easeInOut(seg(sec, 12.4, 13.4)), [0, 1], [0, 420])
        }
        window={2200}
        shots={[
          { src: 'verify-outofspec.png', opacity: 1 - showResolved },
          { src: 'verify-retest-passed.png', opacity: showResolved },
        ]}
        overlay={(m) => (
          <>
            <Ring
              box={{ x: 48, y: 1802, w: 1248, h: 96 }}
              appear={seg(sec, 1.4, 2.0) * (1 - seg(sec, 4.4, 5.0))}
              color={CORAL}
              mapper={m}
            />
            <Ring
              box={{ x: 48, y: 1952, w: 1248, h: 478 }}
              appear={seg(sec, 5.4, 6.0) * (1 - showResolved)}
              color={CORAL}
              mapper={m}
            />
            {/* RESOLVED badge on the scrolled still — fully inside the phone */}
            <Ring box={{ x: 48, y: 1858, w: 1248, h: 105 }} appear={seg(sec, 13.8, 14.5)} color={EMERALD} mapper={m} />
          </>
        )}
      />
      <div style={{ position: 'absolute', left: 720, top: 88, width: 1180 }}>
        <ChipLabel text="Out of spec" appear={textIn} color={CORAL} />
        <Headline text="The app simply refuses to move on." appear={textIn} size={68} width={1000} />
        <BodyText
          text="No blame — a locked gate. A corrective action and a re-test are demanded before the record can close."
          appear={seg(sec, 0.4, 1.1)}
          width={900}
        />
        {/* padlocked button device */}
        <div style={{ marginTop: 40, opacity: seg(sec, 2.0, 2.8) }}>
          <CheckRow label="Corrective action described" done={correctiveDone} />
          <CheckRow label="Re-test reading captured" done={retestDone} />
          <div
            style={{
              marginTop: 30,
              position: 'relative',
              width: 640,
              transform: `translateX(${shakeX}px)`,
            }}
          >
            <AppButton
              text={unlocked ? 'COMPLETE VERIFICATION' : 'COMPLETE VERIFICATION'}
              width={640}
              height={92}
              fontSize={29}
              disabled={!unlocked}
              glow={unlocked ? 0.5 + 0.5 * Math.sin(sec * 5) : 0}
            />
            <div
              style={{
                position: 'absolute',
                right: -74,
                top: 22,
                transform: `rotate(${unlockP * -14}deg) translateY(${unlockP * -8}px)`,
              }}
            >
              <LockIcon size={52} color={unlocked ? EMERALD : '#B9C4CE'} openAmount={unlockP} />
            </div>
          </div>
        </div>
        {/* miss + recovery both on record (kept inside the right frame edge) */}
        <div style={{ marginTop: 40, display: 'flex', gap: 14, alignItems: 'center', opacity: seg(sec, 17.6, 18.5) }}>
          <AppBadge text="4.5 % — OUT OF SPEC" color={CORAL} size={23} />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: BODY, fontSize: 28 }}>→</div>
          <AppBadge text="1.4 % — RE-TEST PASSED" color={EMERALD} size={23} />
          <div style={{ color: 'rgba(255,255,255,0.62)', fontFamily: BODY, fontSize: 22 }}>both stay on the record</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 10 — Escalate to a human (two-device handoff)
// ════════════════════════════════════════════════════════
const S10Escalation: React.FC = () => {
  const sec = useSceneSec(9);
  const textIn = seg(sec, 0.0, 0.7);
  const smDeviceIn = easeInOut(seg(sec, 10.6, 11.8));
  const thread = easeInOut(seg(sec, 11.2, 13.4));
  const pulseT = seg(sec, 13.6, 14.6);
  const ackIn = seg(sec, 14.6, 15.4);
  const signP = easeInOut(seg(sec, 16.2, 18.6));
  const tail = fadeTail(sec, 9);

  // thread path from operator button to SM card
  const pathD = 'M 425 920 C 720 920, 880 470, 1180 452';

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop variant="deep" />
      <div style={{ position: 'absolute', left: 120, top: 66, width: 1700 }}>
        <ChipLabel text="Still failing after the re-test" appear={textIn} color={CORAL} />
        <Headline text="One operator shouldn't carry that alone." appear={textIn} size={64} width={1300} />
      </div>
      {/* operator device */}
      <Phone
        x={130}
        y={300}
        height={700}
        entrance={easeInOut(seg(sec, 0.2, 1.0))}
        pan={1080}
        window={1600}
        shots={[{ src: 'verify-escalation-btn.png', opacity: 1 }]}
        overlay={(m) => (
          <>
            <Ring box={{ x: 48, y: 1212, w: 1248, h: 635 }} appear={seg(sec, 2.6, 3.3) * (1 - seg(sec, 9.4, 10))} color={CORAL} mapper={m} />
            <Ring box={{ x: 48, y: 2540, w: 1248, h: 135 }} appear={seg(sec, 10.0, 10.7)} mapper={m} />
          </>
        )}
      />
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 252,
          color: 'rgba(255,255,255,0.6)',
          fontFamily: DISPLAY,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: 2.4,
          opacity: seg(sec, 1.0, 1.6),
        }}
      >
        OPERATOR — RECORD + ESCALATE
      </div>
      {/* cyan thread */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <path
          d={pathD}
          fill="none"
          stroke={`rgba(${hexToRgb(SKY)},0.85)`}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={900}
          strokeDashoffset={900 - thread * 900}
          style={{ filter: `drop-shadow(0 0 12px rgba(${hexToRgb(SKY)},0.7))` }}
        />
        {pulseT > 0 && pulseT < 1 && (
          <circle
            cx={425 + (1180 - 425) * pulseT}
            cy={920 - Math.sin(pulseT * Math.PI) * 390}
            r={13}
            fill={SKY}
            style={{ filter: `drop-shadow(0 0 16px ${SKY})` }}
          />
        )}
      </svg>
      {/* SM device (composed) */}
      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 260,
          width: 610,
          opacity: smDeviceIn,
          transform: `translateY(${(1 - smDeviceIn) * 44}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 40,
            background: 'linear-gradient(145deg, #2b3846, #0b1016)',
            padding: 14,
            boxShadow: '0 42px 120px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ borderRadius: 30, background: CANVAS, overflow: 'hidden', padding: '30px 26px 34px' }}>
            <div style={{ color: MUTED, fontFamily: DISPLAY, fontSize: 20, letterSpacing: 2.6, fontWeight: 600 }}>
              SITE MANAGER · SIPHO NKOSI
            </div>
            <div
              style={{
                marginTop: 18,
                borderRadius: 18,
                border: `2px solid rgba(${hexToRgb(CORAL)},0.4)`,
                background: `rgba(${hexToRgb(CORAL)},0.08)`,
                padding: 22,
              }}
            >
              <AppBadge text="NCR · CCV ESCALATION" color={CORAL} size={22} />
              <div style={{ marginTop: 14, color: FG, fontFamily: DISPLAY, fontWeight: 700, fontSize: 32 }}>
                Sandrox PA · Site Operations
              </div>
              <div style={{ marginTop: 10, color: FG2, fontFamily: BODY, fontSize: 21, lineHeight: 1.45 }}>
                First reading 4.5 % · re-test 4.2 % — both out of 0.3–2.0 %.
                <br />
                Corrective: re-mixed the dilution. Pump suspect.
              </div>
            </div>
            <div
              style={{
                marginTop: 20,
                borderRadius: 16,
                border: `1px solid ${APP_BORDER}`,
                background: SURFACE,
                padding: '16px 20px',
                opacity: 0.4 + ackIn * 0.6,
              }}
            >
              <div style={{ color: MUTED, fontFamily: DISPLAY, fontSize: 19, letterSpacing: 2.2, fontWeight: 600 }}>
                ACKNOWLEDGE + SIGN
              </div>
              <svg width={520} height={92} style={{ marginTop: 6 }}>
                <path
                  d="M 20 62 C 60 18, 90 78, 130 48 C 168 20, 190 66, 232 50 C 274 34, 300 64, 350 42 C 392 24, 420 58, 470 40"
                  fill="none"
                  stroke={FG}
                  strokeWidth={3.4}
                  strokeLinecap="round"
                  strokeDasharray={700}
                  strokeDashoffset={700 - signP * 700}
                />
                <line x1={20} y1={80} x2={500} y2={80} stroke={APP_BORDER} strokeWidth={2} />
              </svg>
            </div>
            <div style={{ marginTop: 18, opacity: signP >= 1 ? 1 : 0 }}>
              <AppBadge text="ACKNOWLEDGED · SIGNED" color={EMERALD} size={23} appear={signP >= 1 ? 1 : 0} />
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: DISPLAY,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 2.4,
            textAlign: 'center',
          }}
        >
          SITE MANAGER — THEIR OWN DEVICE
        </div>
      </div>
      <div style={{ position: 'absolute', left: 640, right: 0, bottom: 88, display: 'flex', justifyContent: 'center' }}>
        <ProofChip text="Accountability travels up the chain — automatically." appear={seg(sec, 19.4, 20.3)} />
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 11 — The relay: offline queue + clientOpId gate
// ════════════════════════════════════════════════════════
const BATONS = [
  { n: 1, label: 'ISSUE', color: SKY, localId: 'local_9ce' },
  { n: 2, label: 'VERIFY', color: EMERALD, localId: 'local_f07' },
  { n: 3, label: 'RE-CHECK', color: AMBER, localId: 'local_b12' },
];

const Baton: React.FC<{
  b: (typeof BATONS)[number];
  x: number;
  y: number;
  synced: number;
  ghost?: boolean;
  opacity?: number;
  scale?: number;
}> = ({ b, x, y, synced, ghost = false, opacity = 1, scale = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 250,
      borderRadius: 20,
      border: ghost ? `2px dashed rgba(${hexToRgb(b.color)},0.8)` : `2px solid rgba(${hexToRgb(b.color)},0.75)`,
      background: ghost ? 'rgba(255,255,255,0.03)' : `rgba(${hexToRgb(b.color)},0.13)`,
      padding: '14px 18px',
      opacity,
      transform: `scale(${scale})`,
      boxShadow: ghost ? undefined : `0 12px 34px rgba(0,0,0,0.4), 0 0 22px rgba(${hexToRgb(b.color)},0.25)`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: b.color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        {b.n}
      </div>
      <div style={{ color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1.6 }}>{b.label}</div>
    </div>
    <div
      style={{
        marginTop: 10,
        fontFamily: 'monospace',
        fontSize: 19,
        color: synced > 0.5 ? EMERALD : 'rgba(255,255,255,0.55)',
      }}
    >
      {synced > 0.5 ? '✓ real id · server' : b.localId}
    </div>
  </div>
);

const S11Offline: React.FC = () => {
  const sec = useSceneSec(10);
  const textIn = seg(sec, 0.0, 0.7);
  const offline = seg(sec, 1.6, 2.1);
  const online = seg(sec, 12.9, 13.4);
  // action chips fire at 4 / 6 / 8.2s → batons drop into queue
  const fireAt = [3.8, 5.9, 8.0];
  const railY = 700;
  const queueX = (i: number) => 210 + i * 300;
  // relay run after signal returns; strict order
  const runAt = [14.0, 15.1, 16.2];
  const dupP = easeInOut(seg(sec, 19.4, 20.9)); // ghost approaches gate
  const dupBounce = easeInOut(seg(sec, 20.9, 22.0));
  const tail = fadeTail(sec, 10);
  const gateX = 1290;

  return (
    <AbsoluteFill style={{ background: INK, opacity: tail }}>
      <SceneBackdrop variant="deep" />
      <div style={{ position: 'absolute', left: 120, top: 66, width: 1700 }}>
        <ChipLabel text="Factory floors have dead spots" appear={textIn} />
        <Headline text="Offline is a relay, not a risk." appear={textIn} size={70} width={1300} />
      </div>
      {/* connectivity pill */}
      <div
        style={{
          position: 'absolute',
          right: 140,
          top: 96,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          borderRadius: 999,
          border: `2px solid ${online > 0.5 ? EMERALD : offline > 0.5 ? CORAL : 'rgba(255,255,255,0.3)'}`,
          background: 'rgba(255,255,255,0.05)',
          padding: '12px 24px',
          opacity: seg(sec, 0.6, 1.2),
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: online > 0.5 ? EMERALD : offline > 0.5 ? CORAL : 'rgba(255,255,255,0.4)',
            boxShadow: `0 0 16px ${online > 0.5 ? EMERALD : CORAL}`,
          }}
        />
        <div style={{ color: '#fff', fontFamily: DISPLAY, fontWeight: 600, fontSize: 27, letterSpacing: 2 }}>
          {online > 0.5 ? 'SIGNAL RESTORED' : offline > 0.5 ? 'AIRPLANE MODE — NO SIGNAL' : 'CONNECTED'}
        </div>
      </div>
      {/* action chips firing */}
      <div style={{ position: 'absolute', left: 150, top: 300, display: 'flex', gap: 34 }}>
        {BATONS.map((b, i) => {
          const fired = seg(sec, fireAt[i], fireAt[i] + 0.45);
          const hapt = seg(sec, fireAt[i], fireAt[i] + 0.8);
          return (
            <div key={b.label} style={{ position: 'relative', opacity: seg(sec, 2.4, 3.0) }}>
              <div
                style={{
                  width: 320,
                  borderRadius: 20,
                  border: `2px solid rgba(255,255,255,${0.14 + fired * 0.3})`,
                  background: 'rgba(255,255,255,0.05)',
                  padding: '20px 24px',
                  transform: `scale(${1 + Math.sin(clamp01(hapt) * Math.PI) * 0.05})`,
                }}
              >
                <div style={{ color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1.6 }}>
                  {b.label === 'ISSUE' ? 'RECORD ISSUE' : b.label === 'VERIFY' ? 'VERIFY READING' : 'VERIFY AGAIN'}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    color: EMERALD,
                    fontFamily: BODY,
                    fontWeight: 700,
                    fontSize: 22,
                    opacity: fired,
                  }}
                >
                  <span style={{ fontSize: 24 }}>✓</span> SAVED LOCALLY · buzz
                </div>
              </div>
              {/* haptic ripple */}
              {hapt > 0 && hapt < 1 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: -14 - hapt * 22,
                    borderRadius: 30,
                    border: `2px solid rgba(${hexToRgb(b.color)},${(1 - hapt) * 0.7})`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* queue rail */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: railY - 40,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: DISPLAY,
          fontSize: 23,
          letterSpacing: 2.6,
          fontWeight: 600,
          opacity: seg(sec, 3.4, 4.0),
        }}
      >
        OFFLINE QUEUE — STRICT ORDER: ISSUES → VERIFICATIONS → ESCALATION ACKS
      </div>
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: railY + 116,
          width: 1640,
          height: 6,
          borderRadius: 6,
          background: 'rgba(255,255,255,0.12)',
          opacity: seg(sec, 3.4, 4.0),
        }}
      />
      {/* the sync gate */}
      <div
        style={{
          position: 'absolute',
          left: gateX,
          top: railY - 34,
          width: 190,
          height: 218,
          borderRadius: 24,
          border: `3px solid rgba(${hexToRgb(dupBounce > 0 && dupBounce < 1 ? CORAL : SKY)},${0.5 + 0.3 * Math.sin(sec * 4)})`,
          background: `rgba(${hexToRgb(SKY)},0.06)`,
          opacity: seg(sec, 12.4, 13.2),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <div style={{ color: SKY, fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 2 }}>SYNC</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', fontSize: 17 }}>clientOpId</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', fontSize: 17 }}>gate</div>
      </div>
      {/* batons */}
      {BATONS.map((b, i) => {
        const dropped = easeInOut(seg(sec, fireAt[i] + 0.3, fireAt[i] + 0.9));
        if (dropped <= 0) return null;
        const run = easeInOut(seg(sec, runAt[i], runAt[i] + 1.0));
        const x = interpolate(run, [0, 1], [queueX(i), gateX + 150]);
        const dropY = interpolate(dropped, [0, 1], [430, railY]);
        const gone = 1 - easeInOut(seg(sec, runAt[i] + 1.0, runAt[i] + 1.45));
        return <Baton key={b.n} b={b} x={x} y={run > 0 ? railY : dropY} synced={run} opacity={dropped * gone} />;
      })}
      {/* synced ledger on the right */}
      <div style={{ position: 'absolute', right: 140, top: railY - 12, width: 240 }}>
        {BATONS.map((b, i) => {
          const done = seg(sec, runAt[i] + 1.3, runAt[i] + 1.7);
          return (
            <div
              key={b.n}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, opacity: done }}
            >
              <div style={{ color: EMERALD, fontSize: 26, fontWeight: 800 }}>✓</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: BODY, fontSize: 24 }}>
                {b.label.toLowerCase()} → real id
              </div>
            </div>
          );
        })}
      </div>
      {/* duplicate bounced */}
      {dupP > 0 && (
        <Baton
          b={{ ...BATONS[1], localId: 'local_9ce (retry)' }}
          x={interpolate(dupP, [0, 1], [420, gateX - 240]) - dupBounce * 300}
          y={railY + interpolate(dupBounce, [0, 0.5, 1], [0, -60, 26])}
          synced={0}
          ghost
          opacity={dupP * (1 - seg(sec, 22.6, 23.6))}
          scale={1 - dupBounce * 0.12}
        />
      )}
      {dupBounce > 0.15 && (
        <div
          style={{
            position: 'absolute',
            left: gateX - 130,
            top: railY - 90,
            color: CORAL,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 2,
            opacity: dupBounce * (1 - seg(sec, 23.4, 24.2)),
            textShadow: `0 0 24px rgba(${hexToRgb(CORAL)},0.5)`,
          }}
        >
          DUPLICATE — TURNED AWAY
        </div>
      )}
      {/* closing chips */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center', gap: 26 }}>
        {['Nothing lost.', 'Nothing doubled.'].map((t, i) => {
          const a = seg(sec, 23.8 + i * 0.7, 24.5 + i * 0.7);
          return (
            <div
              key={t}
              style={{
                borderRadius: 999,
                border: `2px solid rgba(${hexToRgb(i === 0 ? EMERALD : SKY)},0.6)`,
                background: `rgba(${hexToRgb(i === 0 ? EMERALD : SKY)},0.12)`,
                color: '#fff',
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: 1.6,
                padding: '16px 36px',
                opacity: a,
                transform: `scale(${0.8 + a * 0.2})`,
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Beat 12 — The eye stays open (recap + bookend)
// ════════════════════════════════════════════════════════
const S12Close: React.FC = () => {
  const sec = useSceneSec(11);
  const gridShots = ['issue-manual-inrange.png', 'issue-satellite-selected.png', 'verify-blank.png', 'verify-escalation-btn.png'];
  const gridIn = (i: number) => easeInOut(seg(sec, 0.4 + i * 0.85, 1.1 + i * 0.85));
  // iris travels across the four tiles
  const travel = easeInOut(seg(sec, 0.9, 4.6));
  const tileCenters: Array<[number, number]> = [
    [510, 300],
    [1410, 300],
    [510, 800],
    [1410, 800],
  ];
  const ti = Math.min(3, Math.floor(travel * 4));
  const tf = travel * 4 - ti;
  const nxt = Math.min(3, ti + 1);
  const irisX = tileCenters[ti][0] + (tileCenters[nxt][0] - tileCenters[ti][0]) * easeInOut(tf);
  const irisY = tileCenters[ti][1] + (tileCenters[nxt][1] - tileCenters[ti][1]) * easeInOut(tf);
  const gridOut = easeInOut(seg(sec, 8.2, 9.4));
  const drumIn = easeInOut(seg(sec, 8.6, 9.9));
  const anchors = [
    { t: 'The Matrix owns the standard', c: SKY, at: 11.4 },
    { t: 'Station mode owns the flow', c: AMBER, at: 13.2 },
    { t: 'Verification makes it provable', c: EMERALD, at: 15.0 },
  ];
  const titleIn = seg(sec, 19.4, 20.6);
  const subIn = seg(sec, 21.2, 22.2);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* phase A: 2×2 grid of real stills */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - gridOut }}>
        <SceneBackdrop variant="deep" />
        {gridShots.map((s, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const a = gridIn(i);
          return (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: 150 + col * 900,
                top: 44 + row * 500,
                width: 780,
                height: 460,
                borderRadius: 26,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.14)',
                boxShadow: '0 26px 70px rgba(0,0,0,0.5)',
                opacity: a,
                transform: `scale(${0.92 + a * 0.08})`,
              }}
            >
              <Img
                src={staticFile(`ccv-tutorial/shots/${s}`)}
                style={{ position: 'absolute', left: 0, top: -110, width: 780, height: (780 / STILL_W) * 2992 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,16,0.18)' }} />
            </div>
          );
        })}
        <Iris cx={irisX} cy={irisY} r={130} openness={seg(sec, 0.8, 1.4)} glow={0.8} />
      </div>
      {/* phase B/C: drum, iris steady */}
      <div style={{ position: 'absolute', inset: 0, opacity: drumIn }}>
        <Img
          src={staticFile('ccv-tutorial/shots/drum-color.png')}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 1920,
            height: 1080,
            transform: `translate(-50%, -50%) scale(${1.16 - easeInOut(seg(sec, 8.6, 16)) * 0.06})`,
            filter: 'saturate(1.05) brightness(0.92)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(4,10,15,0.78) 30%, rgba(4,10,15,0.2) 68%)',
          }}
        />
        <Iris cx={1075} cy={568} r={228} openness={drumIn} glow={0.85 + 0.12 * Math.sin(sec * 1.8)} />
        <div style={{ position: 'absolute', left: 120, top: 210, width: 1000 }}>
          {anchors.map((a2) => {
            const p = seg(sec, a2.at, a2.at + 0.7);
            return (
              <div
                key={a2.t}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  marginTop: 26,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 30}px)`,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    background: a2.c,
                    boxShadow: `0 0 22px ${a2.c}`,
                  }}
                />
                <div style={{ color: '#fff', fontFamily: DISPLAY, fontWeight: 600, fontSize: 47, letterSpacing: 0.4 }}>
                  {a2.t}
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 60,
              color: '#fff',
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 1.0,
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 24}px)`,
              textShadow: '0 16px 50px rgba(0,0,0,0.6)',
            }}
          >
            A second pair of eyes
            <br />
            on every drum.
          </div>
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              opacity: subIn,
            }}
          >
            <div style={{ width: 66, height: 5, borderRadius: 4, background: SKY, boxShadow: `0 0 20px ${SKY}` }} />
            <div style={{ color: 'rgba(255,255,255,0.85)', fontFamily: BODY, fontWeight: 500, fontSize: 36 }}>
              One that never blinks first.
            </div>
          </div>
          <div
            style={{
              marginTop: 54,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: seg(sec, 22.8, 23.8),
            }}
          >
            <Img src={staticFile('images/ewizer-logo.png')} style={{ width: 66, height: 66, objectFit: 'contain' }} />
            <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, letterSpacing: 2.4 }}>
              e-wizer · chemical concentration verification
            </div>
            <div
              style={{
                marginLeft: 10,
                background: '#F7FAFC',
                borderRadius: 12,
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Img src={staticFile('images/ecowize-logo.webp')} style={{ width: 128, height: 46, objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// Root
// ════════════════════════════════════════════════════════
const SCENES: React.FC[] = [
  S1Hook,
  S2SecondPair,
  S3IssueScope,
  S4Matrix,
  S5Manual,
  S6Satellite,
  S7Twist,
  S8SixMethods,
  S9OutOfSpec,
  S10Escalation,
  S11Offline,
  S12Close,
];

export const CcvTutorial: React.FC = () => {
  useCcvFonts();
  const frame = useCurrentFrame();
  const progress = frame / T.total_frames;

  return (
    <AbsoluteFill style={{ background: INK }}>
      {SCENES.map((Scene, i) => (
        <Sequence key={T.beats[i].id} from={sceneStart[i]} durationInFrames={sceneDur[i]} premountFor={FPS}>
          <Scene />
        </Sequence>
      ))}
      {/* music bed — hook (beat 1) and close (beat 12) only */}
      <Sequence from={0} durationInFrames={sceneStart[1]} premountFor={FPS}>
        <Audio
          src={staticFile(MUSIC)}
          volume={(f) =>
            fadeInOut(f, sceneStart[1], 24) *
            // duck under the VO, which starts almost immediately (0.6s in)
            interpolate(f, [0, 14, 52], [0.34, 0.34, 0.09], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          }
        />
      </Sequence>
      <Sequence from={sceneStart[11]} durationInFrames={T.total_frames - sceneStart[11]} premountFor={FPS}>
        <Audio
          src={staticFile(MUSIC)}
          volume={(f) => {
            const dur = T.total_frames - sceneStart[11];
            // VO for beat 12 ends here (scene-local frames); swell after it
            const voEnd = Math.round((T.beats[11].voStart + T.beats[11].duration) * FPS) - sceneStart[11];
            return (
              fadeInOut(f, dur, 28) *
              interpolate(f, [0, voEnd - 10, voEnd + 30], [0.09, 0.09, 0.38], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            );
          }}
        />
      </Sequence>
      {/* narration spine */}
      {T.beats.map((b) => (
        <Sequence
          key={`audio-${b.id}`}
          from={Math.round(b.voStart * FPS)}
          durationInFrames={Math.ceil(b.duration * FPS) + 4}
          premountFor={FPS}
        >
          <Audio src={staticFile(b.audio)} volume={NARRATION_VOLUME} />
        </Sequence>
      ))}
      {/* progress chrome everywhere except the two full-bleed bookends */}
      {frame > sceneStart[2] && frame < sceneStart[11] && <Wordmark progress={progress} />}
    </AbsoluteFill>
  );
};
