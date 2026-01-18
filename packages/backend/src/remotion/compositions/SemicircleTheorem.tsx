import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  Img,
  staticFile,
} from 'remotion';

// Step data with narration timing
interface TheoremStep {
  id: string;
  title: string;
  svgPath: string;
  audioPath?: string;
  durationInSeconds: number;
}

interface SemicircleTheoremProps {
  steps?: TheoremStep[];
  includeAudio?: boolean;
}

// Default steps configuration (durations from audio files)
const DEFAULT_STEPS: TheoremStep[] = [
  {
    id: 'step1_setup',
    title: 'The Setup',
    svgPath: 'svg-theorems/step1-setup.svg',
    audioPath: 'audio/semicircle/step1_setup.wav',
    durationInSeconds: 10, // 9.96s audio
  },
  {
    id: 'step2_point',
    title: 'Choose Any Point',
    svgPath: 'svg-theorems/step2-point.svg',
    audioPath: 'audio/semicircle/step2_point.wav',
    durationInSeconds: 9, // 8.36s audio
  },
  {
    id: 'step3_connect',
    title: 'Draw the Angle',
    svgPath: 'svg-theorems/step3-connect.svg',
    audioPath: 'audio/semicircle/step3_connect.wav',
    durationInSeconds: 7, // 6.52s audio
  },
  {
    id: 'step4_reveal',
    title: 'The Right Angle',
    svgPath: 'svg-theorems/step4-reveal.svg',
    audioPath: 'audio/semicircle/step4_reveal.wav',
    durationInSeconds: 13, // 12.88s audio
  },
  {
    id: 'step5_multiple',
    title: 'Works Everywhere',
    svgPath: 'svg-theorems/step5-multiple.svg',
    audioPath: 'audio/semicircle/step5_multiple.wav',
    durationInSeconds: 13, // 12.80s audio
  },
];

// Intro slide component
const IntroSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: 'clamp' });

  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' });

  const lineWidth = spring({
    frame: frame - 25,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 72,
            color: '#60a5fa',
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textShadow: '0 0 40px rgba(96, 165, 250, 0.5)',
          }}
        >
          Angle in a Semicircle
        </h1>

        <div
          style={{
            width: `${lineWidth * 400}px`,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
            margin: '30px auto',
          }}
        />

        <p
          style={{
            fontSize: 32,
            color: '#94a3b8',
            opacity: subtitleOpacity,
            margin: 0,
          }}
        >
          A Circle Theorem
        </p>
      </div>
    </AbsoluteFill>
  );
};

// SVG Step component with transitions
const SVGStep: React.FC<{ step: TheoremStep; includeAudio?: boolean }> = ({
  step,
  includeAudio = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // Subtle scale animation
  const scale = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 50 },
  });

  const scaleValue = interpolate(scale, [0, 1], [1.02, 1]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        opacity,
      }}
    >
      {/* SVG Container */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          right: '5%',
          bottom: '15%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${scaleValue})`,
        }}
      >
        <Img
          src={staticFile(step.svgPath)}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Step title at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 28,
            color: '#ffd700',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 600,
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          }}
        >
          {step.title}
        </span>
      </div>

      {/* Audio */}
      {includeAudio && step.audioPath && (
        <Audio src={staticFile(step.audioPath)} />
      )}
    </AbsoluteFill>
  );
};

// Outro slide
const OutroSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const checkScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        opacity,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Checkmark */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 30,
            transform: `scale(${checkScale})`,
          }}
        >
          ✓
        </div>

        <h2
          style={{
            fontSize: 48,
            color: '#60a5fa',
            margin: 0,
            marginBottom: 20,
          }}
        >
          Theorem Complete
        </h2>

        <p
          style={{
            fontSize: 28,
            color: '#ffd700',
            margin: 0,
          }}
        >
          The angle in a semicircle is always 90°
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const SemicircleTheorem: React.FC<SemicircleTheoremProps> = ({
  steps = DEFAULT_STEPS,
  includeAudio = true,
}) => {
  const { fps } = useVideoConfig();

  const introDuration = 3 * fps; // 3 seconds
  const outroDuration = 3 * fps; // 3 seconds

  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {/* Intro */}
      <Sequence from={0} durationInFrames={introDuration}>
        <IntroSlide />
      </Sequence>

      {currentFrame = introDuration}

      {/* Steps */}
      {steps.map((step, index) => {
        const stepDuration = step.durationInSeconds * fps;
        const startFrame = currentFrame;
        currentFrame += stepDuration;

        return (
          <Sequence key={step.id} from={startFrame} durationInFrames={stepDuration}>
            <SVGStep step={step} includeAudio={includeAudio} />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence from={currentFrame} durationInFrames={outroDuration}>
        <OutroSlide />
      </Sequence>
    </AbsoluteFill>
  );
};

// Calculate total duration
export const getSemicircleTheoremDuration = (fps: number, steps: TheoremStep[] = DEFAULT_STEPS): number => {
  const introDuration = 3 * fps;
  const outroDuration = 3 * fps;
  const stepsDuration = steps.reduce((acc, step) => acc + step.durationInSeconds * fps, 0);
  return introDuration + stepsDuration + outroDuration;
};

export default SemicircleTheorem;
