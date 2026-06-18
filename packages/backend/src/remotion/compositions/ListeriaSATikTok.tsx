import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
  Audio,
  Sequence,
  Easing,
  AbsoluteFill,
} from 'remotion';
import {
  TransitionSeries,
  linearTiming,
} from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';

// ─────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────

export interface ListeriaSATikTokProps {
  audioEnabled: boolean;
}

const IMG_BASE = 'images/listeria-sa';

// Timeline events with approximate timing (seconds into narration)
// Total narration ~75-80s
// Narration audio = 120s. Scene timings mapped to narration flow.
const TIMELINE: Array<{
  date: string;
  headline: string;
  detail?: string;
  stat?: string;
  statColor?: string;
  bgImage?: string;
  startSec: number;
  durationSec: number;
}> = [
  {
    date: '',
    headline: 'THE DEADLIEST\nLISTERIA OUTBREAK\nIN HISTORY',
    detail: 'South Africa 2017-2018',
    bgImage: 'cover.png',
    startSec: 0,
    durationSec: 10,
  },
  {
    date: 'JAN 2017',
    headline: 'Cases Start Appearing',
    detail: 'Nobody knows yet...',
    bgImage: 'microscope.png',
    startSec: 10,
    durationSec: 6,
  },
  {
    date: 'JULY 2017',
    headline: 'Doctors Raise The Alarm',
    detail: 'Too many babies getting sick with listeriosis',
    bgImage: 'hospital.png',
    startSec: 16,
    durationSec: 8,
  },
  {
    date: 'NOV 2017',
    headline: '41 Infections Per Week',
    stat: '41',
    statColor: '#FF4444',
    bgImage: 'hospital.png',
    startSec: 24,
    durationSec: 8,
  },
  {
    date: '5 DEC 2017',
    headline: 'National Outbreak Declared',
    detail: 'Listeriosis becomes a notifiable disease\nBut they still don\'t know the source',
    bgImage: 'hospital.png',
    startSec: 32,
    durationSec: 10,
  },
  {
    date: 'JAN 2018',
    headline: '10 Children Sick At Nursery',
    detail: 'All ate polony sandwiches\nPolony tests positive for Listeria ST6',
    bgImage: 'factory.png',
    startSec: 42,
    durationSec: 10,
  },
  {
    date: 'FEB 2018',
    headline: 'The Factory Investigation',
    detail: 'Tiger Brands Enterprise, Polokwane',
    stat: '47/317',
    statColor: '#FF6600',
    bgImage: 'factory.png',
    startSec: 52,
    durationSec: 10,
  },
  {
    date: '4 MAR 2018',
    headline: 'THE BOMBSHELL',
    detail: 'Health Minister names Enterprise Foods\nMassive recall across the country',
    bgImage: 'recall.png',
    startSec: 62,
    durationSec: 10,
  },
  {
    date: 'THE TWIST',
    headline: 'Tiger Brands Knew',
    detail: '18 days before the government recall',
    statColor: '#FF0000',
    bgImage: 'factory.png',
    startSec: 72,
    durationSec: 8,
  },
  {
    date: '48 HOURS LATER',
    headline: '6 Countries Ban SA Meat',
    detail: 'Botswana, Namibia, Mozambique,\nMalawi, Kenya, Zambia',
    bgImage: 'map.png',
    startSec: 80,
    durationSec: 10,
  },
  {
    date: 'FINAL COUNT',
    headline: '1,065 Cases\n218 Deaths',
    detail: 'The largest Listeria outbreak\nthe world has ever seen',
    stat: '218',
    statColor: '#FF0000',
    bgImage: 'microscope.png',
    startSec: 90,
    durationSec: 12,
  },
  {
    date: 'SEP 2018',
    headline: 'Outbreak Declared Over',
    bgImage: 'hospital.png',
    startSec: 102,
    durationSec: 6,
  },
  {
    date: '2025',
    headline: 'Victims Still Not\nCompensated',
    detail: 'Families still waiting for justice...',
    statColor: '#FF4444',
    bgImage: 'recall.png',
    startSec: 108,
    durationSec: 7,
  },
  {
    date: '',
    headline: 'FOLLOW & LIKE',
    detail: 'For everything you need to know\nabout food safety',
    startSec: 115,
    durationSec: 10,
  },
];

const TOTAL_DURATION_SEC = 125;

export function getListeriaSADuration(fps: number): number {
  return Math.round(TOTAL_DURATION_SEC * fps);
}

// ─────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────

function PulsingDot({ color = '#FF0000', size = 12 }: { color?: string; size?: number }) {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.15) * 0.3;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}60`,
        transform: `scale(${pulse})`,
      }}
    />
  );
}

function TimelineLine({ progress }: { progress: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 50,
        top: 0,
        bottom: 0,
        width: 3,
        background: `linear-gradient(to bottom, #FF000080 0%, #FF0000 ${progress * 100}%, #333333 ${progress * 100}%)`,
      }}
    />
  );
}

function DateMarker({ date, isActive }: { date: string; isActive: boolean }) {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, config: { damping: 8 } });

  if (!date) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        transform: `scale(${scale})`,
      }}
    >
      <PulsingDot color={isActive ? '#FF0000' : '#666'} size={14} />
      <div
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: isActive ? '#FF4444' : '#666',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: 2,
          textShadow: isActive ? '0 0 20px #FF000060' : 'none',
        }}
      >
        {date}
      </div>
    </div>
  );
}

function EventCard({
  event,
  index,
}: {
  event: (typeof TIMELINE)[0];
  index: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from right
  const slideX = interpolate(frame, [0, 15], [200, 0], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stat counter animation
  const statProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isCTA = index === TIMELINE.length - 1;
  const isBombshell = event.date === 'THE TWIST' || event.date === 'FINAL COUNT';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 60px',
      }}
    >
      {/* Background image with overlay */}
      {event.bgImage && (
        <>
          <Img
            src={staticFile(`${IMG_BASE}/${event.bgImage}`)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.25,
              filter: 'blur(2px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.8) 100%)',
            }}
          />
        </>
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          transform: `translateX(${slideX}px)`,
          opacity,
        }}
      >
        {/* Date marker */}
        {event.date && (
          <div style={{ marginBottom: 20, marginLeft: -10 }}>
            <DateMarker date={event.date} isActive={true} />
          </div>
        )}

        {/* Large stat number */}
        {event.stat && (
          <div
            style={{
              fontSize: isBombshell ? 180 : 120,
              fontWeight: 900,
              fontFamily: 'system-ui, sans-serif',
              color: event.statColor || '#FF4444',
              lineHeight: 1,
              marginBottom: 10,
              textShadow: `0 0 40px ${event.statColor || '#FF4444'}60`,
              opacity: statProgress,
              transform: `scale(${0.5 + statProgress * 0.5})`,
            }}
          >
            {event.stat === '218'
              ? Math.round(218 * statProgress).toString()
              : event.stat === '47/317'
              ? `${Math.round(47 * statProgress)}/${317}`
              : event.stat === '41'
              ? Math.round(41 * statProgress).toString()
              : event.stat}
          </div>
        )}

        {/* Headline */}
        <h1
          style={{
            fontSize: isCTA ? 72 : isBombshell ? 56 : 46,
            fontWeight: 900,
            color: isCTA
              ? '#FFFFFF'
              : isBombshell
              ? event.statColor || '#FF4444'
              : '#FFFFFF',
            fontFamily: 'system-ui, sans-serif',
            margin: 0,
            lineHeight: 1.15,
            whiteSpace: 'pre-line',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}
        >
          {event.headline}
        </h1>

        {/* Detail */}
        {event.detail && (
          <p
            style={{
              fontSize: isCTA ? 30 : 24,
              color: isCTA ? '#FF4444' : '#CCCCCC',
              fontFamily: 'system-ui, sans-serif',
              marginTop: 15,
              lineHeight: 1.4,
              whiteSpace: 'pre-line',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            {event.detail}
          </p>
        )}
      </div>

      {/* CTA extras */}
      {isCTA && (
        <div
          style={{
            position: 'absolute',
            bottom: 200,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            zIndex: 10,
          }}
        >
          {['❤️', '💬', '🔖'].map((emoji, i) => {
            const emojiScale = spring({
              frame: Math.max(0, frame - 20 - i * 8),
              fps: 30,
              config: { damping: 6 },
            });
            return (
              <div
                key={i}
                style={{
                  fontSize: 50,
                  transform: `scale(${emojiScale})`,
                }}
              >
                {emoji}
              </div>
            );
          })}
        </div>
      )}

      {/* Progress bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: '#333',
          zIndex: 20,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${((event.startSec + frame / 30) / TOTAL_DURATION_SEC) * 100}%`,
            background: 'linear-gradient(90deg, #FF4444, #FF6600)',
            maxWidth: '100%',
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// DANGER PULSE OVERLAY (for dramatic moments)
// ─────────────────────────────────────────────────

function DangerPulse() {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.1) * 0.5 + 0.5;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        border: `3px solid rgba(255, 0, 0, ${pulse * 0.4})`,
        boxShadow: `inset 0 0 60px rgba(255, 0, 0, ${pulse * 0.15})`,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    />
  );
}

// ─────────────────────────────────────────────────
// MAIN COMPOSITION
// ─────────────────────────────────────────────────

export const ListeriaSATikTok: React.FC<ListeriaSATikTokProps> = ({ audioEnabled }) => {
  const { fps } = useVideoConfig();
  const TRANS = 10;

  return (
    <AbsoluteFill style={{ background: '#0a0a0a' }}>
      {/* Narration */}
      {audioEnabled && (
        <Audio
          src={staticFile(`${IMG_BASE}/narration.mp3`)}
          volume={1}
        />
      )}

      {/* Danger pulse overlay for entire video */}
      <DangerPulse />

      {/* Timeline scenes */}
      <TransitionSeries>
        {TIMELINE.map((event, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence
              durationInFrames={Math.round(event.durationSec * fps)}
            >
              <EventCard event={event} index={i} />
            </TransitionSeries.Sequence>
            {i < TIMELINE.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANS })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────
// COVER STILL
// ─────────────────────────────────────────────────

export const ListeriaSACover: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.2) * 0.02;

  return (
    <AbsoluteFill style={{ background: '#0a0a0a' }}>
      <Img
        src={staticFile(`${IMG_BASE}/cover.png`)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.5,
          filter: 'blur(1px)',
          transform: `scale(${pulse})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '0 50px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 24, color: '#FF4444', fontWeight: 700, letterSpacing: 4, marginBottom: 20, fontFamily: 'system-ui' }}>
          SOUTH AFRICA
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.1,
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 0 30px rgba(255,0,0,0.3)',
          }}
        >
          THE LISTERIA
          <br />
          OUTBREAK
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#FF0000',
            fontFamily: 'system-ui, sans-serif',
            marginTop: 10,
            textShadow: '0 0 40px rgba(255,0,0,0.5)',
          }}
        >
          218
        </div>
        <div style={{ fontSize: 28, color: '#999', fontFamily: 'system-ui', marginTop: 5 }}>
          DEATHS
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#666',
            fontFamily: 'system-ui',
            marginTop: 40,
            letterSpacing: 2,
          }}
        >
          2017 — 2018
        </div>
      </div>
    </AbsoluteFill>
  );
};
