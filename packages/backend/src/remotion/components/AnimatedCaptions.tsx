import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

interface Word {
  word: string;
  start: number;
  end: number;
}

interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
  words?: Word[];
}

interface TranscriptData {
  slide: number;
  duration: number;
  text: string;
  segments: Segment[];
}

interface AnimatedCaptionsProps {
  transcript: TranscriptData;
  slideStartFrame: number;
  style?: 'karaoke' | 'subtitle' | 'words' | 'highlight';
  position?: 'bottom' | 'top' | 'center';
  fontSize?: number;
  maxWidth?: number;
  backgroundColor?: string;
  textColor?: string;
  highlightColor?: string;
}

/**
 * Animated captions component that syncs with Whisper transcriptions
 * Supports multiple display styles:
 * - karaoke: Word-by-word highlight as spoken
 * - subtitle: Full sentence with timing
 * - words: Individual words that appear as spoken
 * - highlight: Current word highlighted, others dimmed
 */
export const AnimatedCaptions: React.FC<AnimatedCaptionsProps> = ({
  transcript,
  slideStartFrame,
  style = 'karaoke',
  position = 'bottom',
  fontSize = 42,
  maxWidth = 1600,
  backgroundColor = 'rgba(0, 0, 0, 0.7)',
  textColor = '#ffffff',
  highlightColor = '#34d399',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate current time in seconds relative to slide start
  const currentTime = (frame - slideStartFrame) / fps;

  // Find current segment
  const currentSegment = transcript.segments.find(
    seg => currentTime >= seg.start && currentTime < seg.end
  );

  if (!currentSegment) {
    return null;
  }

  const positionStyles: Record<string, React.CSSProperties> = {
    bottom: { bottom: 80, left: '50%', transform: 'translateX(-50%)' },
    top: { top: 80, left: '50%', transform: 'translateX(-50%)' },
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  };

  // Render based on style
  if (style === 'subtitle') {
    return (
      <SubtitleCaption
        segment={currentSegment}
        currentTime={currentTime}
        fps={fps}
        frame={frame}
        slideStartFrame={slideStartFrame}
        position={positionStyles[position]}
        fontSize={fontSize}
        maxWidth={maxWidth}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    );
  }

  if (style === 'karaoke' && currentSegment.words) {
    return (
      <KaraokeCaption
        segment={currentSegment}
        currentTime={currentTime}
        fps={fps}
        frame={frame}
        slideStartFrame={slideStartFrame}
        position={positionStyles[position]}
        fontSize={fontSize}
        maxWidth={maxWidth}
        backgroundColor={backgroundColor}
        textColor={textColor}
        highlightColor={highlightColor}
      />
    );
  }

  if (style === 'words' && currentSegment.words) {
    return (
      <WordsCaption
        segment={currentSegment}
        currentTime={currentTime}
        fps={fps}
        frame={frame}
        slideStartFrame={slideStartFrame}
        position={positionStyles[position]}
        fontSize={fontSize}
        maxWidth={maxWidth}
        textColor={textColor}
      />
    );
  }

  if (style === 'highlight' && currentSegment.words) {
    return (
      <HighlightCaption
        segment={currentSegment}
        currentTime={currentTime}
        fps={fps}
        frame={frame}
        slideStartFrame={slideStartFrame}
        position={positionStyles[position]}
        fontSize={fontSize}
        maxWidth={maxWidth}
        backgroundColor={backgroundColor}
        textColor={textColor}
        highlightColor={highlightColor}
      />
    );
  }

  // Fallback to subtitle style
  return (
    <SubtitleCaption
      segment={currentSegment}
      currentTime={currentTime}
      fps={fps}
      frame={frame}
      slideStartFrame={slideStartFrame}
      position={positionStyles[position]}
      fontSize={fontSize}
      maxWidth={maxWidth}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
};

// Subtitle style - full sentence appears
const SubtitleCaption: React.FC<{
  segment: Segment;
  currentTime: number;
  fps: number;
  frame: number;
  slideStartFrame: number;
  position: React.CSSProperties;
  fontSize: number;
  maxWidth: number;
  backgroundColor: string;
  textColor: string;
}> = ({ segment, currentTime, fps, frame, slideStartFrame, position, fontSize, maxWidth, backgroundColor, textColor }) => {
  const segmentStartFrame = slideStartFrame + segment.start * fps;
  const framesSinceStart = frame - segmentStartFrame;

  const opacity = interpolate(
    framesSinceStart,
    [0, 8],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const scale = spring({
    frame: framesSinceStart,
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.5 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        ...position,
        opacity,
        transform: `${position.transform} scale(${scale})`,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: '16px 32px',
          borderRadius: 12,
          maxWidth,
        }}
      >
        <span
          style={{
            color: textColor,
            fontSize,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.4,
            textAlign: 'center',
            display: 'block',
          }}
        >
          {segment.text}
        </span>
      </div>
    </div>
  );
};

// Karaoke style - words highlight as spoken
const KaraokeCaption: React.FC<{
  segment: Segment;
  currentTime: number;
  fps: number;
  frame: number;
  slideStartFrame: number;
  position: React.CSSProperties;
  fontSize: number;
  maxWidth: number;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
}> = ({ segment, currentTime, fps, frame, slideStartFrame, position, fontSize, maxWidth, backgroundColor, textColor, highlightColor }) => {
  const segmentStartFrame = slideStartFrame + segment.start * fps;
  const framesSinceStart = frame - segmentStartFrame;

  const opacity = interpolate(
    framesSinceStart,
    [0, 8],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        ...position,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: '16px 32px',
          borderRadius: 12,
          maxWidth,
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.4,
          }}
        >
          {segment.words?.map((word, i) => {
            const isSpoken = currentTime >= word.start;
            const isCurrent = currentTime >= word.start && currentTime < word.end;

            return (
              <span
                key={i}
                style={{
                  color: isSpoken ? highlightColor : textColor,
                  fontWeight: isCurrent ? 700 : 500,
                  transition: 'color 0.1s, font-weight 0.1s',
                  textShadow: isCurrent ? `0 0 20px ${highlightColor}` : 'none',
                }}
              >
                {word.word}{' '}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
};

// Words style - words appear one by one
const WordsCaption: React.FC<{
  segment: Segment;
  currentTime: number;
  fps: number;
  frame: number;
  slideStartFrame: number;
  position: React.CSSProperties;
  fontSize: number;
  maxWidth: number;
  textColor: string;
}> = ({ segment, currentTime, fps, frame, slideStartFrame, position, fontSize, maxWidth, textColor }) => {
  return (
    <div
      style={{
        position: 'absolute',
        ...position,
        maxWidth,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {segment.words?.map((word, i) => {
          const wordStartFrame = slideStartFrame + word.start * fps;
          const framesSinceWord = frame - wordStartFrame;

          if (framesSinceWord < 0) return null;

          const wordOpacity = interpolate(
            framesSinceWord,
            [0, 5],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          const wordY = interpolate(
            framesSinceWord,
            [0, 8],
            [20, 0],
            { extrapolateRight: 'clamp' }
          );

          return (
            <span
              key={i}
              style={{
                color: textColor,
                fontSize,
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Highlight style - current word highlighted, others visible but dimmed
const HighlightCaption: React.FC<{
  segment: Segment;
  currentTime: number;
  fps: number;
  frame: number;
  slideStartFrame: number;
  position: React.CSSProperties;
  fontSize: number;
  maxWidth: number;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
}> = ({ segment, currentTime, fps, frame, slideStartFrame, position, fontSize, maxWidth, backgroundColor, textColor, highlightColor }) => {
  const segmentStartFrame = slideStartFrame + segment.start * fps;
  const framesSinceStart = frame - segmentStartFrame;

  const opacity = interpolate(
    framesSinceStart,
    [0, 8],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        ...position,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: '20px 40px',
          borderRadius: 16,
          maxWidth,
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.5,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {segment.words?.map((word, i) => {
            const isCurrent = currentTime >= word.start && currentTime < word.end;
            const isPast = currentTime >= word.end;

            let wordScale = 1;
            if (isCurrent) {
              const wordStartFrame = slideStartFrame + word.start * fps;
              wordScale = spring({
                frame: frame - wordStartFrame,
                fps,
                config: { damping: 15, stiffness: 300, mass: 0.3 },
              });
            }

            return (
              <span
                key={i}
                style={{
                  color: isCurrent ? highlightColor : isPast ? textColor : 'rgba(255,255,255,0.4)',
                  fontWeight: isCurrent ? 700 : 500,
                  transform: `scale(${isCurrent ? Math.min(wordScale, 1.15) : 1})`,
                  transition: 'color 0.15s',
                  textShadow: isCurrent ? `0 0 30px ${highlightColor}, 0 0 60px ${highlightColor}` : 'none',
                }}
              >
                {word.word}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
};

export default AnimatedCaptions;
