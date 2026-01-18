/**
 * AI Changes Everything - TikTok Video Composition
 *
 * WebSlides-style vertical videos (1080x1920) with:
 * - Generated Gemini images as backgrounds
 * - Animated text overlays synced to narration
 * - Framework logos and visual elements
 * - Professional transitions
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from 'remotion';
import {
  AngularLogo,
  ReactLogo,
  VueLogo,
  SvelteLogo,
  NextLogo,
  AIIcon,
  FrameworkCarousel,
} from '../components/FrameworkLogos';

// ============ ANIMATED TEXT COMPONENTS ============

const TypewriterText: React.FC<{
  text: string;
  startFrame?: number;
  style?: React.CSSProperties;
  speed?: number;
}> = ({ text, startFrame = 0, style = {}, speed = 1.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charsPerFrame = speed;
  const adjustedFrame = frame - startFrame;
  const visibleChars = Math.floor(Math.max(0, adjustedFrame * charsPerFrame));
  const displayText = text.substring(0, visibleChars);

  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;

  return (
    <div style={{
      fontFamily: '"SF Pro Display", system-ui, sans-serif',
      fontSize: 48,
      fontWeight: 700,
      color: 'white',
      textShadow: '0 4px 20px rgba(0,0,0,0.8)',
      textAlign: 'center',
      lineHeight: 1.3,
      ...style,
    }}>
      {displayText}
      {visibleChars < text.length && (
        <span style={{ opacity: cursorOpacity, color: '#667eea' }}>|</span>
      )}
    </div>
  );
};

const AnimatedHook: React.FC<{
  text: string;
  delay?: number;
}> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 12, stiffness: 200 }
  });

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100 }
  });

  const glowIntensity = Math.sin(frame * 0.1) * 10 + 20;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      fontFamily: '"SF Pro Display", system-ui, sans-serif',
      fontSize: 56,
      fontWeight: 800,
      color: '#ffd700',
      textShadow: `0 0 ${glowIntensity}px rgba(255,215,0,0.6), 0 4px 20px rgba(0,0,0,0.8)`,
      textAlign: 'center',
      lineHeight: 1.2,
      padding: '0 40px',
    }}>
      {text}
    </div>
  );
};

const ProgressBar: React.FC<{
  progress: number;
  partNumber: number;
  totalParts: number;
}> = ({ progress, partNumber, totalParts }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: 80,
      left: 40,
      right: 40,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'system-ui' }}>
          Part {partNumber}/{totalParts}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'system-ui' }}>
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div style={{
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: '#667eea',
          borderRadius: 2,
          transition: 'width 0.1s ease',
        }} />
      </div>
    </div>
  );
};

// ============ TIKTOK SCENE DEFINITIONS ============

interface TikTokSceneConfig {
  id: string;
  title: string;
  hook: string;
  backgroundImage: string;
  narrationLines: string[];
  visualElements?: React.ReactNode;
}

const TIKTOK_SCENES: TikTokSceneConfig[] = [
  {
    id: 'tiktok_01_hook',
    title: 'The Framework Trap',
    hook: 'What if everything you learned about frameworks... is now optional?',
    backgroundImage: 'images/ai-changes/mountain-of-knowledge.jpg',
    narrationLines: [
      'I spent YEARS mastering Angular.',
      'Every decorator, every module,',
      'every RxJS operator burned into my brain.',
      'And now?',
      'AI just wrote better Angular code than me.',
      'In 30 seconds.',
    ],
  },
  {
    id: 'tiktok_02_old_world',
    title: 'How We Used to Learn',
    hook: 'Let me show you how developers USED to learn...',
    backgroundImage: 'images/ai-changes/timeline-comparison.jpg',
    narrationLines: [
      'Back in my day, learning a framework meant:',
      'Step 1: Read the docs for weeks',
      'Step 2: Build todo apps until your eyes bleed',
      'Step 3: Debug cryptic errors for months',
      'Step 4: Finally understand the mental model',
      'Step 5: Framework releases v2, start over',
    ],
  },
  {
    id: 'tiktok_03_new_world',
    title: 'What AI Changed',
    hook: 'Here\'s what AI actually changed about coding...',
    backgroundImage: 'images/ai-changes/skill-reorganization.jpg',
    narrationLines: [
      'AI didn\'t replace developers.',
      'It reorganized what matters.',
      'Essential: Architecture, security, code review',
      'Delegatable: Syntax, boilerplate, CSS tweaks',
      'The mountain of knowledge?',
      'AI built an elevator.',
    ],
  },
  {
    id: 'tiktok_04_timeline',
    title: '4 Years vs 4 Weeks',
    hook: 'What took me 4 years now takes 4 weeks...',
    backgroundImage: 'images/ai-changes/code-comparison.jpg',
    narrationLines: [
      'Traditional path: 4 years of grind',
      'AI-assisted path: 4 weeks of focus',
      'Same destination.',
      'Different journey.',
      'The knowledge isn\'t less valuable.',
      'It\'s just more accessible.',
    ],
  },
  {
    id: 'tiktok_05_proof',
    title: 'The SvelteKit Project',
    hook: 'I built a production app in a framework I never used...',
    backgroundImage: 'images/ai-changes/polygamous-frameworks.jpg',
    narrationLines: [
      'Last month: SvelteKit project deadline.',
      'My SvelteKit experience: Zero.',
      'With AI: Built, tested, deployed.',
      'Not copy-paste coding.',
      'Real understanding.',
      'AI taught me as I built.',
    ],
  },
  {
    id: 'tiktok_06_twist',
    title: 'The Plot Twist',
    hook: 'Here\'s the plot twist they don\'t tell you...',
    backgroundImage: 'images/ai-changes/framework-divorce.jpg',
    narrationLines: [
      'The plot twist?',
      'My deep Angular knowledge?',
      'Still valuable.',
      'Not for writing Angular.',
      'For knowing WHEN to use it.',
      'AI writes code. You make decisions.',
    ],
  },
];

// ============ MAIN TIKTOK COMPOSITION ============

interface TikTokVideoProps {
  videoIndex: number;
  audioSrc?: string;
}

export const AIChangesTikTokVideo: React.FC<TikTokVideoProps> = ({
  videoIndex,
  audioSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const scene = TIKTOK_SCENES[videoIndex];

  if (!scene) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ color: 'white', fontSize: 32 }}>Invalid video index: {videoIndex}</span>
      </AbsoluteFill>
    );
  }

  const progress = frame / durationInFrames;

  // Animation timing
  const hookEndFrame = fps * 3; // 3 seconds for hook
  const narrativeStartFrame = hookEndFrame;

  // Image zoom effect
  const imageScale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateRight: 'clamp',
  });

  // Darken overlay for text readability
  const overlayOpacity = interpolate(frame, [0, fps * 0.5], [0.3, 0.6], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Background Image with Ken Burns effect */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile(scene.backgroundImage)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imageScale})`,
          }}
        />
        {/* Dark overlay for text contrast */}
        <AbsoluteFill style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity}) 0%, rgba(26,26,46,${overlayOpacity + 0.2}) 50%, rgba(0,0,0,${overlayOpacity + 0.3}) 100%)`,
        }} />
      </AbsoluteFill>

      {/* Hook Section (first 3 seconds) */}
      <Sequence from={0} durationInFrames={hookEndFrame}>
        <AbsoluteFill style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 40px',
        }}>
          <AnimatedHook text={scene.hook} delay={10} />
        </AbsoluteFill>
      </Sequence>

      {/* Narrative Section */}
      <Sequence from={narrativeStartFrame}>
        <AbsoluteFill style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '100px 50px',
        }}>
          {scene.narrationLines.map((line, index) => {
            const lineStartFrame = index * 40; // ~1.3 seconds per line
            const lineFrame = frame - narrativeStartFrame - lineStartFrame;

            if (lineFrame < 0) return null;

            const lineOpacity = spring({
              frame: lineFrame,
              fps,
              config: { damping: 100 }
            });

            const translateY = spring({
              frame: lineFrame,
              fps,
              from: 30,
              to: 0,
              config: { damping: 15, stiffness: 100 }
            });

            return (
              <div
                key={index}
                style={{
                  opacity: lineOpacity,
                  transform: `translateY(${translateY}px)`,
                  marginBottom: 20,
                }}
              >
                <TypewriterText
                  text={line}
                  startFrame={0}
                  speed={2}
                  style={{
                    fontSize: index === 0 ? 44 : 36,
                    fontWeight: index === 0 ? 700 : 500,
                    color: index === scene.narrationLines.length - 1 ? '#ffd700' : 'white',
                  }}
                />
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* Framework logos decoration (subtle, top right) */}
      <AbsoluteFill style={{
        position: 'absolute',
        top: 100,
        right: 30,
        opacity: 0.3,
      }}>
        {videoIndex === 0 && <AngularLogo size={50} />}
        {videoIndex === 1 && <ReactLogo size={50} />}
        {videoIndex === 2 && <AIIcon size={50} color="#667eea" />}
        {videoIndex === 3 && <SvelteLogo size={50} />}
        {videoIndex === 4 && <FrameworkCarousel width={200} height={60} spacing={15} />}
        {videoIndex === 5 && <VueLogo size={50} />}
      </AbsoluteFill>

      {/* Progress bar */}
      <ProgressBar
        progress={progress}
        partNumber={videoIndex + 1}
        totalParts={6}
      />

      {/* Audio */}
      {audioSrc && (
        <Audio src={staticFile(audioSrc)} volume={1} />
      )}
    </AbsoluteFill>
  );
};

// Export individual TikTok compositions for rendering
export const TikTok01Hook: React.FC = () => (
  <AIChangesTikTokVideo videoIndex={0} audioSrc="audio/ai-changes/tiktok_01_hook.mp3" />
);

export const TikTok02OldWorld: React.FC = () => (
  <AIChangesTikTokVideo videoIndex={1} audioSrc="audio/ai-changes/tiktok_02_old_world.mp3" />
);

export const TikTok03NewWorld: React.FC = () => (
  <AIChangesTikTokVideo videoIndex={2} audioSrc="audio/ai-changes/tiktok_03_new_world.mp3" />
);

export const TikTok04Timeline: React.FC = () => (
  <AIChangesTikTokVideo videoIndex={3} audioSrc="audio/ai-changes/tiktok_04_timeline.mp3" />
);

export const TikTok05Proof: React.FC = () => (
  <AIChangesTikTokVideo videoIndex={4} audioSrc="audio/ai-changes/tiktok_05_proof.mp3" />
);

export const TikTok06Twist: React.FC = () => (
  <AIChangesTikTokVideo videoIndex={5} audioSrc="audio/ai-changes/tiktok_06_twist.mp3" />
);
