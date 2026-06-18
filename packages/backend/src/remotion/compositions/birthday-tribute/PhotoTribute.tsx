import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { Orientation, tributeFonts } from '../BirthdayTribute';

interface Props {
  orientation: Orientation;
  photos: string[];
  nameLabel: string;
  audioSrc: string;
  accentColor: string;
}

const CROSSFADE_FRAMES = 20; // ~0.67s at 30fps

export const PhotoTribute: React.FC<Props> = ({
  orientation,
  photos,
  nameLabel,
  audioSrc,
  accentColor,
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const photoCount = photos.length;
  const photoDuration = Math.floor(durationInFrames / photoCount);

  // Section-level fade in/out (slower fades between sections per PDF design)
  const sectionFadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const sectionFadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );
  const sectionOpacity = Math.min(sectionFadeIn, sectionFadeOut);

  // Name label entrance + exit
  const labelEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  const labelFadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames - 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ opacity: sectionOpacity, backgroundColor: '#0a0a0f' }}>
      {/* Voiceover */}
      <Audio src={staticFile(audioSrc)} volume={1} />

      {/* Stacked photos with crossfades */}
      {photos.map((photo, i) => {
        const photoStart = i * photoDuration;
        return (
          <Sequence
            key={photo}
            from={photoStart}
            durationInFrames={photoDuration + CROSSFADE_FRAMES}
          >
            <KenBurnsPhoto
              src={photo}
              direction={i % 2 === 0 ? 'in' : 'out'}
              orientation={orientation}
              localDuration={photoDuration + CROSSFADE_FRAMES}
              isFirst={i === 0}
              isLast={i === photos.length - 1}
            />
          </Sequence>
        );
      })}

      {/* Cinematic vignette — subtle radial darkening at edges, pulls eye to subject */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dark gradient overlay for label legibility */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Name label — bottom area */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: orientation === 'vertical' ? 180 : 80,
          opacity: labelFadeOut,
        }}
      >
        <div
          style={{
            transform: `translateY(${(1 - labelEntrance) * 30}px)`,
            opacity: labelEntrance,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 60,
              height: 2,
              backgroundColor: accentColor,
              margin: '0 auto 16px',
              borderRadius: 1,
            }}
          />
          <div
            style={{
              fontFamily: tributeFonts.serif,
              fontSize: orientation === 'vertical' ? 56 : 46,
              fontWeight: 400,
              color: '#fff',
              letterSpacing: 1,
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              padding: '0 40px',
            }}
          >
            {nameLabel}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

interface KenBurnsProps {
  src: string;
  direction: 'in' | 'out';
  orientation: Orientation;
  localDuration: number;
  isFirst: boolean;
  isLast: boolean;
}

const KenBurnsPhoto: React.FC<KenBurnsProps> = ({
  src,
  direction,
  localDuration,
  isFirst,
  isLast,
}) => {
  const frame = useCurrentFrame();

  const zoomStart = direction === 'in' ? 1.0 : 1.15;
  const zoomEnd = direction === 'in' ? 1.15 : 1.0;
  const scale = interpolate(frame, [0, localDuration], [zoomStart, zoomEnd]);

  const panX = interpolate(frame, [0, localDuration], [0, direction === 'in' ? -2 : 2]);

  const fadeIn = isFirst
    ? 1
    : interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const fadeOut = isLast
    ? 1
    : interpolate(frame, [localDuration - 20, localDuration], [1, 0], {
        extrapolateLeft: 'clamp',
      });

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Blurred background fill — shows behind letterbox bars when photo aspect doesn't match frame.
          Wrapped in AbsoluteFill so it stacks as an absolutely-positioned layer instead of flexing. */}
      <AbsoluteFill>
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(40px) brightness(0.55)',
            transform: 'scale(1.15)',
          }}
        />
      </AbsoluteFill>
      {/* Sharp foreground, contained — never crops the subject */}
      <AbsoluteFill>
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `scale(${scale}) translate(${panX}%, 0)`,
            transformOrigin: 'center center',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
