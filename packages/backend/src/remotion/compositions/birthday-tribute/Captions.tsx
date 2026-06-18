import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
} from '@remotion/captions';
import { Orientation, tributeFonts } from '../BirthdayTribute';

interface Props {
  /** Path under public/, e.g. 'birthday-tribute/captions/mum.json' */
  source: string;
  orientation: Orientation;
  /** Distance from bottom edge in px. Default 380 — clears the name label
   *  in photo sections (label sits at paddingBottom 180 + ~140 height). For
   *  face sections with no name label, pass ~140 for a tighter bottom anchor. */
  bottomOffset?: number;
}

const SWITCH_CAPTIONS_EVERY_MS = 1400; // ~3-5 words per page at slow VO pace

/** Loads caption JSON from public/ via staticFile + fetch + delayRender. */
const useCaptions = (path: string): Caption[] | null => {
  const [data, setData] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender(`captions:${path}`));

  useEffect(() => {
    fetch(staticFile(path))
      .then((r) => r.json())
      .then((json: Caption[]) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`Failed to load captions: ${path}`, err);
        continueRender(handle);
      });
  }, [path, handle]);

  return data;
};

export const Captions: React.FC<Props> = ({ source, orientation, bottomOffset = 380 }) => {
  const captions = useCaptions(source);
  const { fps } = useVideoConfig();

  if (!captions || captions.length === 0) return null;

  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
  });

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps
        );
        const durationInFrames = Math.round(endFrame - startFrame);

        if (durationInFrames <= 0) return null;

        return (
          <Sequence
            key={index}
            from={Math.round(startFrame)}
            durationInFrames={durationInFrames}
          >
            <CaptionPage page={page} orientation={orientation} bottomOffset={bottomOffset} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

interface CaptionPageProps {
  page: TikTokPage;
  orientation: Orientation;
  bottomOffset: number;
}

const CaptionPage: React.FC<CaptionPageProps> = ({ page, orientation, bottomOffset }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Time relative to this Sequence's start, converted to absolute audio time
  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: bottomOffset,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      <div
        style={{
          fontFamily: tributeFonts.serif,
          fontSize: orientation === 'vertical' ? 46 : 38,
          fontWeight: 500,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.25,
          letterSpacing: 0.5,
          textShadow: '0 2px 16px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.7)',
        }}
      >
        {page.tokens.map((token) => {
          const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          return (
            <span
              key={`${token.fromMs}-${token.text}`}
              style={{
                color: isActive ? '#f4d4a4' : '#fff',
                transition: 'color 80ms ease',
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
