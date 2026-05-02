import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { OpeningFace } from './birthday-tribute/OpeningFace';
import { PhotoTribute } from './birthday-tribute/PhotoTribute';
import { ClosingFace } from './birthday-tribute/ClosingFace';
import { EndCard } from './birthday-tribute/EndCard';

export type Orientation = 'vertical' | 'horizontal';

export interface BirthdayTributeProps {
  orientation: Orientation;
}

// Section durations in seconds. Tune as VOs come in — each section's photos
// will stretch evenly across the duration. Keep VO files slightly shorter
// than their section so the audio doesn't cut off.
//
// Phyllis section removed at Durai's request — she'll be acknowledged
// briefly inside the Teekay VO instead. Teekay slot bumped to 15s
// to absorb that extra audio.
const SECTION_DURATIONS = {
  opening: 26,
  mum: 17,
  family: 17,
  sisters: 16,
  teekay: 17,
  closing: 18,
  endCard: 2,
} as const;

const TOTAL_SECONDS = Object.values(SECTION_DURATIONS).reduce((sum, s) => sum + s, 0);

export const getBirthdayTributeDuration = (fps: number): number =>
  Math.round(TOTAL_SECONDS * fps);

const sec = (seconds: number, fps: number) => Math.round(seconds * fps);

export const BirthdayTribute: React.FC<BirthdayTributeProps> = ({ orientation }) => {
  const fps = 30;
  const d = SECTION_DURATIONS;

  // Compute section start times (cumulative)
  const t = {
    opening: 0,
    mum: d.opening,
    family: d.opening + d.mum,
    sisters: d.opening + d.mum + d.family,
    teekay: d.opening + d.mum + d.family + d.sisters,
    closing: d.opening + d.mum + d.family + d.sisters + d.teekay,
    endCard: d.opening + d.mum + d.family + d.sisters + d.teekay + d.closing,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0f' }}>
      {/* Quiet instrumental music bed throughout */}
      {/* TEMP: bumped to 0.45 for evaluation — drop back to 0.15 for final */}
      <Audio
        src={staticFile('birthday-tribute/audio/music-bed.mp3')}
        volume={0.45}
      />

      {/* Sections 1+2: Opening face (0:00 - 0:28) */}
      <Sequence from={sec(t.opening, fps)} durationInFrames={sec(d.opening, fps)}>
        <OpeningFace orientation={orientation} />
      </Sequence>

      {/* Section 3: Mum (0:28 - 0:45) */}
      <Sequence from={sec(t.mum, fps)} durationInFrames={sec(d.mum, fps)}>
        <PhotoTribute
          orientation={orientation}
          photos={[
            'birthday-tribute/photos/mum-1.jpg',
            'birthday-tribute/photos/mum-2.jpg',
            'birthday-tribute/photos/mum-3.jpg',
          ]}
          nameLabel="Mum — The Queen Mamoyo"
          audioSrc="birthday-tribute/audio/vo-mum.mp3"
          accentColor="#d4a574"
        />
      </Sequence>

      {/* Section 4: Vana Mai / Vana Sekuru (0:45 - 1:00) */}
      <Sequence from={sec(t.family, fps)} durationInFrames={sec(d.family, fps)}>
        <PhotoTribute
          orientation={orientation}
          photos={[
            'birthday-tribute/photos/family-1.jpg',
            'birthday-tribute/photos/family-2.jpg',
            'birthday-tribute/photos/family-3.jpg',
          ]}
          nameLabel="Hama yangu"
          audioSrc="birthday-tribute/audio/vo-family.mp3"
          accentColor="#c89b6c"
        />
      </Sequence>

      {/* Section 5: Sisters (1:00 - 1:13) */}
      <Sequence from={sec(t.sisters, fps)} durationInFrames={sec(d.sisters, fps)}>
        <PhotoTribute
          orientation={orientation}
          photos={[
            'birthday-tribute/photos/sisters-1.jpg',
            'birthday-tribute/photos/sisters-2.jpg',
            'birthday-tribute/photos/sisters-3.jpg',
          ]}
          nameLabel="Vana Mwenewazvo"
          audioSrc="birthday-tribute/audio/vo-sisters.mp3"
          accentColor="#b88860"
        />
      </Sequence>

      {/* Section 6: Teekay (closes the honoree run; brief Phyllis nod inside this VO) */}
      <Sequence from={sec(t.teekay, fps)} durationInFrames={sec(d.teekay, fps)}>
        <PhotoTribute
          orientation={orientation}
          photos={[
            'birthday-tribute/photos/teekay-1.jpg',
            'birthday-tribute/photos/teekay-2.jpg',
          ]}
          nameLabel="Teekay — Brother"
          audioSrc="birthday-tribute/audio/vo-teekay.mp3"
          accentColor="#a87555"
        />
      </Sequence>

      {/* Closing face */}
      <Sequence from={sec(t.closing, fps)} durationInFrames={sec(d.closing, fps)}>
        <ClosingFace orientation={orientation} />
      </Sequence>

      {/* End card (1:48 - 1:50) */}
      <Sequence from={sec(t.endCard, fps)} durationInFrames={sec(d.endCard, fps)}>
        <EndCard orientation={orientation} />
      </Sequence>
    </AbsoluteFill>
  );
};
