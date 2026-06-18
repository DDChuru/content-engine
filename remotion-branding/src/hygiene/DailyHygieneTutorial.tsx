import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import timing from './timing.json';

const SKY = '#3CB6E0';
const EMERALD = '#1F9C5A';
const AMBER = '#E89A30';
const CORAL = '#D6432F';
const INK = '#071018';
const PANEL = '#0E1822';
const FONT = 'Inter, "DM Sans", system-ui, sans-serif';

const STILL_W = 1344;
const STILL_H = 2992;
const CROP_TOP = 108;
const VISIBLE_H = STILL_H - CROP_TOP;
const PHONE_H = 1010;
const SCALE = PHONE_H / VISIBLE_H;
const PHONE_W = STILL_W * SCALE;
const PHONE_X = 112;
const PHONE_Y = 34;

export const DAILY_HYGIENE_INTRO_FRAMES = 150;
export const DAILY_HYGIENE_OUTRO_FRAMES = 180;
const MUSIC = 'daily-hygiene-tutorial/audio/tutorial.mp3';
const NARRATION_VOLUME = 1.22;
const BOOKEND_MUSIC_VOLUME = 0.88;

type RingBox = { x: number; y: number; w: number; h: number; color?: string };
type CropRect = { x: number; y: number; w: number; h: number; panelH?: number };
type Beat = {
  id: string;
  shot: string;
  chip: string;
  ring: keyof typeof BOXES | null;
  audio: string;
  voStart: number;
  duration: number;
  text: string;
};
type TimingData = {
  fps: number;
  total_seconds: number;
  total_frames: number;
  beats: Beat[];
};

const BOXES = {
  staffAllocation: { x: 44, y: 932, w: 1248, h: 266, color: SKY },
  homeTile: { x: 864, y: 1224, w: 390, h: 374, color: SKY },
  newChecklistButton: { x: 42, y: 418, w: 1260, h: 94, color: SKY },
  checkpointOptions: { x: 42, y: 352, w: 1260, h: 256, color: SKY },
  shiftChoice: { x: 42, y: 318, w: 1260, h: 112, color: SKY },
  uncheckedRoster: { x: 40, y: 884, w: 1264, h: 1420, color: SKY },
  statusOptions: { x: 958, y: 1600, w: 292, h: 176, color: AMBER },
  offDutyRow: { x: 40, y: 884, w: 1264, h: 218, color: AMBER },
  passAllGate: { x: 34, y: 2612, w: 1276, h: 282, color: CORAL },
  clearRow: { x: 40, y: 1128, w: 1264, h: 218, color: EMERALD },
  passAllButton: { x: 34, y: 2708, w: 1276, h: 172, color: SKY },
  completeButton: { x: 34, y: 2708, w: 1276, h: 172, color: SKY },
  exceptionOption: { x: 650, y: 1600, w: 314, h: 176, color: CORAL },
  exceptionCriterion: { x: 40, y: 636, w: 1035, h: 146, color: CORAL },
  exceptionRow: { x: 40, y: 1210, w: 1264, h: 218, color: CORAL },
  completedAlert: { x: 82, y: 1288, w: 1180, h: 490, color: EMERALD },
} satisfies Record<string, RingBox>;

const COPY: Record<string, { headline: string; body: string; proof: string }> = {
  intro: {
    headline: 'Clear hygiene records.',
    body: 'Daily Hygiene confirms who is present, who is off duty, and which working operatives are clear or need action.',
    proof: 'Every operative shown ends with a clear status.',
  },
  setup: {
    headline: 'Confirm the shift context first.',
    body: 'The experience is clearest when the site and shift context is ready before the hygiene checklist starts.',
    proof: 'Best experience: context prepared before checks start.',
  },
  home: {
    headline: 'Open Daily Hygiene from Home.',
    body: 'Start where the user actually starts. The Daily Hygiene Checklist tile takes them to today\'s sessions.',
    proof: 'Show the entry point before the workflow.',
  },
  newChecklist: {
    headline: 'Create the shift checklist.',
    body: 'The new checklist button starts the record for the current checkpoint and shift.',
    proof: 'One shift, one clear session record.',
  },
  checkpoint: {
    headline: 'Choose start or during shift.',
    body: 'Start of shift is the first hygiene check. During shift is the repeat check later in the day.',
    proof: 'The checkpoint explains when the check happened.',
  },
  shift: {
    headline: 'Tie the record to the shift.',
    body: 'Select the real shift whenever possible so supervisors can see exactly which team was checked.',
    proof: 'Shift context prevents confusion later.',
  },
  roster: {
    headline: 'Work through the checklist.',
    body: 'Every operative shown needs a final status before the session can close.',
    proof: 'No one is left in Not checked.',
  },
  offDuty: {
    headline: 'Indicate off duty first.',
    body: 'Indicate who was not working before you inspect present people. This keeps the hygiene record honest.',
    proof: 'Absence is captured separately from hygiene.',
  },
  offDutyMarked: {
    headline: 'Off duty is not a pass.',
    body: 'It keeps that person out of the hygiene outcome, but it is not a hygiene result and does not unlock the shortcut.',
    proof: 'The gate stays locked.',
  },
  gate: {
    headline: 'One real verification unlocks pass-all.',
    body: 'The app requires at least one present operative to be checked clear, or one real exception to be recorded.',
    proof: 'No blind bulk passing.',
  },
  oneClear: {
    headline: 'If all is okay, verify one person.',
    body: 'Mark one present operative clear. That proves the inspection has started properly.',
    proof: 'One real clear unlocks the clean shortcut.',
  },
  passAll: {
    headline: 'Pass only the remaining clear people.',
    body: 'The shortcut applies to operatives who still need a status. It does not overwrite off-duty records.',
    proof: 'Speed without losing record truth.',
  },
  afterPassAll: {
    headline: 'The clean path is ready to complete.',
    body: 'Once everyone has a status, the session can be completed.',
    proof: 'Clear team, off-duty captured, session ready.',
  },
  issuePath: {
    headline: 'If there is an issue, branch to exception.',
    body: 'Do not pass an operative with a hygiene problem. Change them to Exception and capture the reason.',
    proof: 'Problems stay visible.',
  },
  exceptionCapture: {
    headline: 'Record criterion and action.',
    body: 'Select what failed, write what was done, and add a photo when it strengthens the record.',
    proof: 'Criterion, action, optional photo.',
  },
  exceptionRecorded: {
    headline: 'Record every affected operative.',
    body: 'If there are multiple issues, each affected person gets their own exception before the clear remainder is passed.',
    proof: 'Pass-all is for the clear remainder only.',
  },
  complete: {
    headline: 'Complete the hygiene record.',
    body: 'The completed checklist shows who was off duty, who was clear, and who needed action.',
    proof: 'The hygiene checklist is complete.',
  },
  summary: {
    headline: 'The operating order stays simple.',
    body: 'Confirm shift context, indicate off duty first, verify once, record issues, pass the clear remainder, then complete.',
    proof: 'Daily Hygiene closed cleanly.',
  },
};

const ZOOM_CROPS: Partial<Record<keyof typeof BOXES, CropRect>> = {
  staffAllocation: { x: 0, y: 850, w: 1344, h: 660, panelH: 360 },
  homeTile: { x: 760, y: 1120, w: 560, h: 560, panelH: 390 },
  newChecklistButton: { x: 20, y: 300, w: 1304, h: 310, panelH: 330 },
  checkpointOptions: { x: 0, y: 250, w: 1344, h: 470, panelH: 360 },
  shiftChoice: { x: 0, y: 250, w: 1344, h: 700, panelH: 370 },
  uncheckedRoster: { x: 0, y: 690, w: 1344, h: 1130, panelH: 420 },
  statusOptions: { x: 70, y: 1270, w: 1210, h: 560, panelH: 370 },
  offDutyRow: { x: 0, y: 780, w: 1344, h: 430, panelH: 350 },
  passAllGate: { x: 0, y: 2540, w: 1344, h: 390, panelH: 350 },
  clearRow: { x: 0, y: 1040, w: 1344, h: 430, panelH: 350 },
  passAllButton: { x: 0, y: 2625, w: 1344, h: 320, panelH: 330 },
  completeButton: { x: 0, y: 2625, w: 1344, h: 320, panelH: 330 },
  exceptionOption: { x: 70, y: 1270, w: 1210, h: 560, panelH: 370 },
  exceptionCriterion: { x: 0, y: 500, w: 1344, h: 470, panelH: 350 },
  exceptionRow: { x: 0, y: 1070, w: 1344, h: 520, panelH: 370 },
  completedAlert: { x: 40, y: 1248, w: 1264, h: 520, panelH: 390 },
};

const fadeInOut = (frame: number, duration: number, fade = 18) =>
  interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

const getActiveIndex = (beats: Beat[], sec: number) => {
  let active = 0;
  for (let i = 0; i < beats.length; i++) {
    if (sec >= beats[i].voStart - 0.18) active = i;
  }
  return active;
};

const MovingGrid: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const drift = frame * 1.5;

  return (
    <div
      style={{
        position: 'absolute',
        inset: -140,
        opacity,
        backgroundImage:
          'linear-gradient(rgba(60,182,224,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(60,182,224,0.18) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        transform: `translate(${drift % 72}px, ${-(drift % 72)}px) rotate(-8deg)`,
        maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 72%)',
      }}
    />
  );
};

const LogoLockup: React.FC<{ intro: boolean }> = ({ intro }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ew = spring({ frame: frame - 14, fps, durationInFrames: 28, config: { damping: 160 } });
  const eco = spring({ frame: frame - 30, fps, durationInFrames: 28, config: { damping: 160 } });
  const split = interpolate(frame, [48, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 170,
        top: intro ? 168 : 154,
        width: 610,
        height: 520,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 82,
          width: 276,
          height: 276,
          borderRadius: 44,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: `0 0 ${36 + split * 32}px rgba(60,182,224,0.28)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: ew,
          transform: `translateX(${interpolate(split, [0, 1], [112, 0])}px) scale(${interpolate(ew, [0, 1], [0.72, 1])})`,
        }}
      >
        <Img
          src={staticFile('images/ewizer-logo.png')}
          style={{
            width: 214,
            height: 214,
            objectFit: 'contain',
            filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.42))',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 320,
          top: 120,
          width: 290,
          height: 198,
          borderRadius: 34,
          background: '#F7FAFC',
          border: '1px solid rgba(255,255,255,0.26)',
          boxShadow: '0 22px 54px rgba(0,0,0,0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: eco,
          transform: `translateX(${interpolate(split, [0, 1], [-132, 0])}px) scale(${interpolate(eco, [0, 1], [0.72, 1])})`,
        }}
      >
        <Img
          src={staticFile('images/ecowize-logo.webp')}
          style={{
            width: 244,
            height: 92,
            objectFit: 'contain',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 278,
          top: 206,
          width: 50,
          height: 50,
          borderRadius: 25,
          background: `linear-gradient(135deg, ${SKY}, ${EMERALD})`,
          boxShadow: '0 0 40px rgba(60,182,224,0.62)',
          opacity: split,
          transform: `scale(${interpolate(split, [0, 1], [0.2, 1])})`,
        }}
      />
    </div>
  );
};

const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, durationInFrames: 34, config: { damping: 180 } });
  const text = spring({ frame: frame - 54, fps, durationInFrames: 28, config: { damping: 180 } });
  const line = interpolate(frame, [80, 122], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const out = interpolate(frame, [132, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: INK, fontFamily: FONT, opacity: out }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 25% 30%, rgba(60,182,224,0.28), transparent 31%), radial-gradient(circle at 78% 70%, rgba(31,156,90,0.16), transparent 28%), linear-gradient(135deg, #102231, #071018 62%, #04080c)',
        }}
      />
      <MovingGrid opacity={0.32} />
      <LogoLockup intro />
      <div
        style={{
          position: 'absolute',
          left: 870,
          top: 236,
          width: 760,
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [28, 0])}px)`,
        }}
      >
        <div
          style={{
            color: SKY,
            fontSize: 28,
            fontWeight: 950,
            letterSpacing: 4.5,
            textTransform: 'uppercase',
          }}
        >
          e-wizer field guide
        </div>
        <div
          style={{
            marginTop: 20,
            color: '#FFFFFF',
            fontSize: 88,
            lineHeight: 0.98,
            fontWeight: 950,
            textShadow: '0 16px 40px rgba(0,0,0,0.34)',
          }}
        >
          Daily Hygiene Checklist
        </div>
        <div
          style={{
            marginTop: 30,
            width: 650,
            color: 'rgba(255,255,255,0.72)',
            fontSize: 34,
            lineHeight: 1.24,
            fontWeight: 760,
            opacity: text,
          }}
        >
          Context. Check. Record exceptions. Pass the clear remainder.
        </div>
        <div
          style={{
            marginTop: 52,
            width: 560 * line,
            height: 8,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${SKY}, ${EMERALD})`,
            boxShadow: '0 0 28px rgba(60,182,224,0.45)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const BrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame: frame - 6, fps, durationInFrames: 34, config: { damping: 180 } });
  const fade = fadeInOut(frame, DAILY_HYGIENE_OUTRO_FRAMES, 22);
  const cards = [
    { label: 'Off duty', color: AMBER },
    { label: 'Clear', color: EMERALD },
    { label: 'Exception', color: CORAL },
  ];

  return (
    <AbsoluteFill style={{ background: INK, fontFamily: FONT, opacity: fade }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 70% 26%, rgba(60,182,224,0.22), transparent 31%), radial-gradient(circle at 24% 78%, rgba(31,156,90,0.14), transparent 28%), linear-gradient(135deg, #071018, #0D1B28 56%, #04080c)',
        }}
      />
      <MovingGrid opacity={0.22} />
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 154,
          width: 650,
          height: 690,
          borderRadius: 44,
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.3)',
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [28, 0])}px)`,
        }}
      >
        <LogoLockup intro={false} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 900,
          top: 180,
          width: 760,
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [26, 0])}px)`,
        }}
      >
        <div style={{ color: SKY, fontSize: 26, fontWeight: 950, letterSpacing: 4, textTransform: 'uppercase' }}>
          record closed
        </div>
        <div style={{ marginTop: 18, color: '#fff', fontSize: 82, lineHeight: 0.98, fontWeight: 950 }}>
          Checked. Captured. Complete.
        </div>
        <div style={{ marginTop: 30, color: 'rgba(255,255,255,0.72)', fontSize: 34, lineHeight: 1.28, fontWeight: 760 }}>
          Every operative ends with a status the supervisor can trust.
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 54 }}>
          {cards.map((card, index) => {
            const cardReveal = spring({
              frame: frame - (42 + index * 12),
              fps,
              durationInFrames: 22,
              config: { damping: 160 },
            });
            return (
              <div
                key={card.label}
                style={{
                  width: 188,
                  height: 154,
                  borderRadius: 26,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: `0 18px 42px rgba(0,0,0,0.22), 0 0 30px rgba(${hexToRgb(card.color)},0.18)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: cardReveal,
                  transform: `translateY(${interpolate(cardReveal, [0, 1], [20, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    background: card.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    fontWeight: 950,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ marginTop: 18, color: '#fff', fontSize: 28, fontWeight: 900 }}>{card.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PhoneStill: React.FC<{
  beats: Beat[];
  active: number;
  sec: number;
  totalSeconds: number;
}> = ({ beats, active, sec, totalSeconds }) => {
  return (
    <>
      {beats.map((beat, i) => {
        const next = i + 1 < beats.length ? beats[i + 1].voStart : totalSeconds + 1;
        const opacity = interpolate(
          sec,
          [beat.voStart - 0.42, beat.voStart - 0.08, next - 0.46, next - 0.1],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        if (opacity <= 0) return null;

        return (
          <Img
            key={beat.id}
            src={staticFile(`daily-hygiene-tutorial/shots/raw/${beat.shot}.png`)}
            style={{
              position: 'absolute',
              left: 0,
              top: -CROP_TOP * SCALE,
              width: '100%',
              height: STILL_H * SCALE,
              opacity,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 40,
          background: 'rgba(7,16,24,0.72)',
          borderRadius: 999,
          padding: '7px 12px',
          color: 'rgba(255,255,255,0.82)',
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        }}
      >
        Step {String(active + 1).padStart(2, '0')}
      </div>
    </>
  );
};

const PhoneRing: React.FC<{
  box: RingBox | null;
  beatStart: number;
}> = ({ box, beatStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!box) return null;

  const land = spring({
    frame: frame - Math.round((beatStart + 0.28) * fps),
    fps,
    durationInFrames: 18,
    config: { damping: 18, stiffness: 160 },
  });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
  const scale = interpolate(land, [0, 1], [1.55, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rgb = hexToRgb(box.color ?? SKY);

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x * SCALE - 10,
        top: (box.y - CROP_TOP) * SCALE - 10,
        width: box.w * SCALE + 20,
        height: box.h * SCALE + 20,
        borderRadius: 18,
        border: `5px solid rgba(${rgb},${0.62 + pulse * 0.35})`,
        background: `rgba(${rgb},${0.14 + pulse * 0.06})`,
        boxShadow: `0 0 ${22 + pulse * 24}px rgba(${rgb},0.68)`,
        opacity: land,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    />
  );
};

const SummaryPanel: React.FC<{ beat: Beat; appear: number; lift: number }> = ({ beat, appear, lift }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - Math.round(beat.voStart * fps);
  const items = [
    { label: 'Context', body: 'Shift ready', color: SKY },
    { label: 'Off duty', body: 'Absence first', color: AMBER },
    { label: 'Verify', body: 'One real check', color: EMERALD },
    { label: 'Exception', body: 'Issues recorded', color: CORAL },
  ];

  return (
    <div
      style={{
        width: 900,
        height: 360,
        borderRadius: 28,
        background: `linear-gradient(135deg, rgba(60,182,224,0.15), rgba(31,156,90,0.12)), ${PANEL}`,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 28px 70px rgba(0,0,0,0.3)',
        padding: 24,
        opacity: appear,
        transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {items.map((item, index) => {
          const reveal = interpolate(localFrame, [(0.35 + index * 0.26) * fps, (0.82 + index * 0.26) * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={item.label}
              style={{
                height: 134,
                borderRadius: 24,
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid rgba(${hexToRgb(item.color)},0.45)`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                opacity: reveal,
                transform: `translateY(${interpolate(reveal, [0, 1], [16, 0])}px)`,
                boxShadow: `0 18px 40px rgba(${hexToRgb(item.color)},0.12)`,
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  background: item.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 950,
                  flex: '0 0 auto',
                }}
              >
                {index + 1}
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 30, fontWeight: 950 }}>{item.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 18, fontWeight: 800, marginTop: 5 }}>
                  {item.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ZoomPanel: React.FC<{
  beat: Beat;
  box: RingBox | null;
  appear: number;
}> = ({ beat, box, appear }) => {
  const panelW = 900;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lift = spring({ frame: frame - Math.round((beat.voStart + 0.35) * fps), fps, config: { damping: 200 } });

  if (!box) {
    if (beat.id === 'summary') {
      return <SummaryPanel beat={beat} appear={appear} lift={lift} />;
    }

    const items = ['Context', 'Check', 'Record'];
    return (
      <div
        style={{
          width: panelW,
          height: 330,
          borderRadius: 28,
          background: `linear-gradient(135deg, rgba(60,182,224,0.15), rgba(31,156,90,0.10)), ${PANEL}`,
          border: '1px solid rgba(255,255,255,0.11)',
          boxShadow: '0 28px 70px rgba(0,0,0,0.28)',
          padding: 28,
          opacity: appear,
          transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {items.map((item, index) => (
          <div
            key={item}
            style={{
              width: 240,
              height: 220,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                background: index === 0 ? SKY : index === 1 ? EMERALD : CORAL,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                fontWeight: 900,
              }}
            >
              {index + 1}
            </div>
            <div style={{ color: '#fff', fontSize: 34, fontWeight: 900 }}>{item}</div>
          </div>
        ))}
      </div>
    );
  }

  const configuredCrop = beat.ring ? ZOOM_CROPS[beat.ring] : null;
  const padX = Math.max(180, box.w * 0.45);
  const padY = Math.max(180, box.h * 0.55);
  const cropW = configuredCrop ? configuredCrop.w : Math.min(STILL_W, box.w + padX * 2);
  const cropH = configuredCrop ? configuredCrop.h : Math.min(STILL_H, box.h + padY * 2);
  const cropX = configuredCrop ? configuredCrop.x : clamp(box.x + box.w / 2 - cropW / 2, 0, STILL_W - cropW);
  const cropY = configuredCrop ? configuredCrop.y : clamp(box.y + box.h / 2 - cropH / 2, 0, STILL_H - cropH);
  const panelH = configuredCrop?.panelH ?? 360;
  const inset = 18;
  const scale = Math.min((panelW - inset * 2) / cropW, (panelH - inset * 2) / cropH);
  const imageX = (panelW - cropW * scale) / 2;
  const imageY = (panelH - cropH * scale) / 2;
  const rgb = hexToRgb(box.color ?? SKY);

  return (
    <div
      style={{
        position: 'relative',
        width: panelW,
        height: panelH,
        borderRadius: 28,
        overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(${rgb},0.08), rgba(255,255,255,0.03)), #0b1219`,
        border: `2px solid rgba(${rgb},0.8)`,
        boxShadow: `0 28px 80px rgba(0,0,0,0.34), 0 0 42px rgba(${rgb},0.25)`,
        opacity: appear,
        transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
      }}
    >
      <Img
        src={staticFile(`daily-hygiene-tutorial/shots/raw/${beat.shot}.png`)}
        style={{
          position: 'absolute',
          left: imageX - cropX * scale,
          top: imageY - cropY * scale,
          width: STILL_W * scale,
          height: STILL_H * scale,
          filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.24))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: imageX + (box.x - cropX) * scale - 8,
          top: imageY + (box.y - cropY) * scale - 8,
          width: box.w * scale + 16,
          height: box.h * scale + 16,
          borderRadius: 18,
          border: `6px solid rgba(${rgb},0.9)`,
          boxShadow: `0 0 36px rgba(${rgb},0.62)`,
          background: `rgba(${rgb},0.14)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 22,
          bottom: 20,
          background: `rgba(${rgb},0.94)`,
          color: '#fff',
          fontWeight: 900,
          fontSize: 26,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          padding: '10px 16px',
          borderRadius: 14,
        }}
      >
        Focus here
      </div>
    </div>
  );
};

const DailyHygieneScene: React.FC<{ timingData: TimingData }> = ({ timingData }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const beats = timingData.beats as Beat[];

  if (beats.length === 0) {
    return (
      <AbsoluteFill style={{ background: INK, color: '#fff', fontFamily: FONT, alignItems: 'center', justifyContent: 'center' }}>
        Generate Daily Hygiene timing first.
      </AbsoluteFill>
    );
  }

  const active = getActiveIndex(beats, sec);
  const beat = beats[active];
  const box = beat.ring ? BOXES[beat.ring] : null;
  const copy = COPY[beat.id] ?? { headline: beat.chip, body: beat.text, proof: 'Follow the highlighted step.' };
  const local = sec - beat.voStart;

  const textIn = interpolate(local, [-0.08, 0.36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOp = interpolate(sec, [0, 0.35, 2.25, 3.0], [1, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bar = interpolate(active + clamp(local / Math.max(beat.duration, 1), 0, 1), [0, beats.length], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: INK, fontFamily: FONT }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 24% 18%, rgba(60,182,224,0.16), transparent 26%), radial-gradient(circle at 83% 78%, rgba(31,156,90,0.12), transparent 30%), linear-gradient(135deg, #111d28, #071018 58%, #05090d)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PHONE_X - 26,
          top: PHONE_Y - 18,
          width: PHONE_W + 52,
          height: PHONE_H + 36,
          borderRadius: 48,
          background: 'linear-gradient(145deg, #293544, #0c1117)',
          boxShadow: '0 38px 110px rgba(0,0,0,0.56)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PHONE_X,
          top: PHONE_Y,
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 36,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 0 0 12px #11161d',
        }}
      >
        <PhoneStill beats={beats} active={active} sec={sec} totalSeconds={timingData.total_seconds} />
        <PhoneRing box={box} beatStart={beat.voStart} />
      </div>

      <div style={{ position: 'absolute', left: 675, top: 72, width: 1110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: textIn }}>
          <div
            style={{
              height: 52,
              padding: '0 22px',
              borderRadius: 999,
              background: 'rgba(60,182,224,0.16)',
              border: '1px solid rgba(60,182,224,0.42)',
              color: SKY,
              display: 'flex',
              alignItems: 'center',
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {beat.chip}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.58)', fontSize: 26, fontWeight: 800 }}>
            {active + 1} / {beats.length}
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            color: '#fff',
            fontSize: 70,
            lineHeight: 1.04,
            fontWeight: 950,
            letterSpacing: 0,
            opacity: textIn,
            transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
            textShadow: '0 10px 32px rgba(0,0,0,0.36)',
          }}
        >
          {copy.headline}
        </div>

        <div
          style={{
            marginTop: 28,
            width: 900,
            color: 'rgba(255,255,255,0.76)',
            fontSize: 35,
            lineHeight: 1.32,
            fontWeight: 650,
            opacity: textIn,
          }}
        >
          {copy.body}
        </div>

        <div style={{ marginTop: 44 }}>
          <ZoomPanel beat={beat} box={box} appear={textIn} />
        </div>

        <div
          style={{
            marginTop: 30,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 18,
            padding: '14px 18px',
            color: '#fff',
            fontSize: 26,
            fontWeight: 850,
            opacity: textIn,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: box?.color ?? SKY,
              boxShadow: `0 0 20px ${box?.color ?? SKY}`,
            }}
          />
          {copy.proof}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 675,
          bottom: 54,
          width: 1110,
          height: 10,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${bar * 100}%`,
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${SKY}, ${EMERALD})`,
            boxShadow: '0 0 26px rgba(60,182,224,0.46)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 675,
          bottom: 74,
          color: 'rgba(255,255,255,0.45)',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 2.2,
          textTransform: 'uppercase',
        }}
      >
        e-wizer field guide - daily hygiene checklist
      </div>

      {beats.map((item) => (
        <Sequence key={item.id} from={Math.round(item.voStart * fps)} durationInFrames={Math.ceil(item.duration * fps) + 4} premountFor={fps}>
          <Audio src={staticFile(item.audio)} volume={NARRATION_VOLUME} />
        </Sequence>
      ))}

      {titleOp > 0 && (
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, rgba(7,16,24,0.96), rgba(10,22,32,0.92))',
            opacity: titleOp,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: SKY, fontSize: 30, fontWeight: 900, letterSpacing: 5, textTransform: 'uppercase' }}>
            e-wizer field guide
          </div>
          <div style={{ color: '#fff', fontSize: 92, fontWeight: 950, marginTop: 20 }}>Daily Hygiene Checklist</div>
          <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 36, fontWeight: 760, marginTop: 20 }}>
            Context. Check. Record. Complete.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const BookendAudio: React.FC = () => {
  const outroStart = DAILY_HYGIENE_INTRO_FRAMES + DAILY_HYGIENE_TUTORIAL_FRAMES;

  return (
    <>
      <Sequence from={0} durationInFrames={DAILY_HYGIENE_INTRO_FRAMES} premountFor={DAILY_HYGIENE_FPS}>
        <Audio src={staticFile(MUSIC)} volume={(f) => BOOKEND_MUSIC_VOLUME * fadeInOut(f, DAILY_HYGIENE_INTRO_FRAMES, 24)} />
      </Sequence>
      <Sequence from={outroStart} durationInFrames={DAILY_HYGIENE_OUTRO_FRAMES} premountFor={DAILY_HYGIENE_FPS}>
        <Audio src={staticFile(MUSIC)} volume={(f) => BOOKEND_MUSIC_VOLUME * fadeInOut(f, DAILY_HYGIENE_OUTRO_FRAMES, 28)} />
      </Sequence>
    </>
  );
};

export const DailyHygieneTutorial: React.FC = () => <DailyHygieneScene timingData={timing as TimingData} />;

export const DailyHygieneTutorialBranded: React.FC = () => {
  const outroStart = DAILY_HYGIENE_INTRO_FRAMES + DAILY_HYGIENE_TUTORIAL_FRAMES;

  return (
    <AbsoluteFill style={{ background: PANEL }}>
      <BookendAudio />
      <Sequence from={0} durationInFrames={DAILY_HYGIENE_INTRO_FRAMES} premountFor={DAILY_HYGIENE_FPS}>
        <BrandIntro />
      </Sequence>
      <Sequence from={DAILY_HYGIENE_INTRO_FRAMES} durationInFrames={DAILY_HYGIENE_TUTORIAL_FRAMES} premountFor={DAILY_HYGIENE_FPS}>
        <DailyHygieneTutorial />
      </Sequence>
      <Sequence from={outroStart} durationInFrames={DAILY_HYGIENE_OUTRO_FRAMES} premountFor={DAILY_HYGIENE_FPS}>
        <BrandOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DAILY_HYGIENE_FPS = (timing as TimingData).fps;
export const DAILY_HYGIENE_TUTORIAL_FRAMES = (timing as TimingData).total_frames;
export const DAILY_HYGIENE_BRANDED_FRAMES =
  DAILY_HYGIENE_INTRO_FRAMES + DAILY_HYGIENE_TUTORIAL_FRAMES + DAILY_HYGIENE_OUTRO_FRAMES;
