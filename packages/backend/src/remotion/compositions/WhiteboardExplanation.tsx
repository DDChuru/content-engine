/**
 * WhiteboardExplanation Composition
 *
 * A Remotion composition for creating educational explanations
 * using Gemini-generated whiteboard images with animated pointer overlay.
 *
 * Workflow:
 * 1. Generate whiteboard image using Gemini 3 Pro (handwritten math/diagrams)
 * 2. Record pointer movements using whiteboard-recorder.html
 * 3. Record narration audio (ElevenLabs voice clone)
 * 4. Combine in this composition for final video
 *
 * Usage:
 * ```tsx
 * <WhiteboardExplanation
 *   whiteboardImage="/images/math-solution.png"
 *   pointerRecording={recordingData}
 *   audioPath="/audio/narration.mp3"
 *   title="Solving Quadratic Equations"
 * />
 * ```
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Img,
  Audio,
  useVideoConfig,
  interpolate,
  useCurrentFrame,
  spring,
} from 'remotion';
import { PointerOverlay, AnimatedPointer, PointerMovement } from '../components/PointerOverlay';

export interface WhiteboardExplanationProps {
  whiteboardImage: string;
  pointerRecording?: {
    movements: PointerMovement[];
    pointerStyle?: 'circle' | 'dot' | 'crosshair' | 'spotlight';
    pointerColor?: string;
    pointerSize?: number;
  };
  audioPath?: string;
  title?: string;
  showTitle?: boolean;
  titleDuration?: number; // Frames to show title
  backgroundColor?: string;
}

export const WhiteboardExplanation: React.FC<WhiteboardExplanationProps> = ({
  whiteboardImage,
  pointerRecording,
  audioPath,
  title,
  showTitle = true,
  titleDuration = 60, // 2 seconds at 30fps
  backgroundColor = '#1a1a2e',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Title animation
  const titleOpacity = showTitle && title
    ? interpolate(
        frame,
        [0, 15, titleDuration - 15, titleDuration],
        [0, 1, 1, 0],
        { extrapolateRight: 'clamp' }
      )
    : 0;

  // Image entrance (slide up after title)
  const imageEntranceStart = showTitle && title ? titleDuration : 0;
  const imageY = spring({
    fps,
    frame: frame - imageEntranceStart,
    config: { damping: 15, mass: 1, stiffness: 100 },
    durationInFrames: 30,
  });
  const imageTranslateY = interpolate(imageY, [0, 1], [50, 0]);
  const imageOpacity = interpolate(
    frame - imageEntranceStart,
    [0, 20],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Title overlay */}
      {showTitle && title && (
        <Sequence durationInFrames={titleDuration}>
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: titleOpacity,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: '30px 60px',
                borderRadius: 12,
                border: '2px solid #e94560',
              }}
            >
              <h1
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 48,
                  color: 'white',
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                {title}
              </h1>
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* Whiteboard image */}
      <Sequence from={imageEntranceStart}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: imageOpacity,
            transform: `translateY(${imageTranslateY}px)`,
          }}
        >
          <Img
            src={whiteboardImage}
            style={{
              maxWidth: '95%',
              maxHeight: '95%',
              objectFit: 'contain',
              borderRadius: 8,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
          />
        </AbsoluteFill>

        {/* Pointer overlay (starts after image entrance) */}
        {pointerRecording && pointerRecording.movements.length > 0 && (
          <PointerOverlay
            movements={pointerRecording.movements}
            style={pointerRecording.pointerStyle || 'circle'}
            color={pointerRecording.pointerColor || '#ffd700'}
            size={pointerRecording.pointerSize || 30}
            startFrame={30} // Start pointer 1 second after image
            showTrail={true}
            trailLength={5}
          />
        )}
      </Sequence>

      {/* Audio narration */}
      {audioPath && (
        <Audio
          src={audioPath}
          startFrom={imageEntranceStart}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Step-by-Step Solution Composition
 *
 * For multi-step math solutions where each step is a separate image.
 * Pointer highlights key areas as narration progresses.
 */
export interface SolutionStep {
  image: string;
  duration: number; // seconds
  audio?: string;
  highlightPoints?: Array<{ x: number; y: number; pauseFrames?: number }>;
  title?: string;
}

export interface StepBySolutionProps {
  steps: SolutionStep[];
  backgroundColor?: string;
  transitionDuration?: number; // frames
}

export const StepBySolution: React.FC<StepBySolutionProps> = ({
  steps,
  backgroundColor = '#1a1a2e',
  transitionDuration = 15,
}) => {
  const { fps } = useVideoConfig();

  let currentFrame = 0;
  const sequences: Array<{
    from: number;
    durationInFrames: number;
    step: SolutionStep;
    index: number;
  }> = [];

  steps.forEach((step, index) => {
    const durationInFrames = Math.round(step.duration * fps);
    sequences.push({
      from: currentFrame,
      durationInFrames,
      step,
      index,
    });
    currentFrame += durationInFrames;
  });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {sequences.map(({ from, durationInFrames, step, index }) => (
        <Sequence key={index} from={from} durationInFrames={durationInFrames}>
          <StepSlide
            step={step}
            stepNumber={index + 1}
            totalSteps={steps.length}
            transitionDuration={transitionDuration}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

interface StepSlideProps {
  step: SolutionStep;
  stepNumber: number;
  totalSteps: number;
  transitionDuration: number;
}

const StepSlide: React.FC<StepSlideProps> = ({
  step,
  stepNumber,
  totalSteps,
  transitionDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entranceProgress = interpolate(
    frame,
    [0, transitionDuration],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  const scale = interpolate(entranceProgress, [0, 1], [0.95, 1]);
  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      {/* Step indicator */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          backgroundColor: 'rgba(233, 69, 96, 0.9)',
          padding: '8px 16px',
          borderRadius: 20,
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          fontWeight: 600,
          color: 'white',
          zIndex: 100,
        }}
      >
        Step {stepNumber} of {totalSteps}
      </div>

      {/* Step title (if provided) */}
      {step.title && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '8px 16px',
            borderRadius: 8,
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            color: '#eee',
            zIndex: 100,
          }}
        >
          {step.title}
        </div>
      )}

      {/* Main image */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={step.image}
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            borderRadius: 8,
          }}
        />
      </AbsoluteFill>

      {/* Animated pointer for highlights */}
      {step.highlightPoints && step.highlightPoints.length > 0 && (
        <AnimatedPointer
          points={step.highlightPoints}
          style="circle"
          color="#ffd700"
          size={35}
          framesPerSegment={fps} // 1 second per segment
        />
      )}

      {/* Audio */}
      {step.audio && <Audio src={step.audio} />}
    </AbsoluteFill>
  );
};

/**
 * Helper function to calculate total duration of step-by-step solution
 */
export const getStepBySolutionDuration = (
  steps: SolutionStep[],
  fps: number
): number => {
  return steps.reduce((total, step) => total + Math.round(step.duration * fps), 0);
};

export default WhiteboardExplanation;
