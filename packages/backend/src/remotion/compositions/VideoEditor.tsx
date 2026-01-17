/**
 * VideoEditor.tsx - Enhanced Video Editor Composition
 *
 * A professional video editor composition with:
 * - Multiple scene support
 * - Configurable transitions between scenes
 * - Ken Burns effect on images
 * - Text overlays with animations
 * - Progress indicators
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
  Audio,
  spring,
  Easing
} from 'remotion';
import {
  Transition,
  TransitionType,
  EasingType,
  FadeToColor,
  CircleWipe,
  CrossZoom,
  SlideTransition,
  WipeTransition,
  BlurTransition,
  GlitchTransition
} from '../components/Transitions';

// ============================================
// TYPES
// ============================================

export interface SceneConfig {
  id: string;
  type: 'image' | 'video' | 'text' | 'color';
  content: string;  // image path, video path, text content, or color
  duration: number; // in frames
  title?: string;
  subtitle?: string;
  transition?: {
    type: TransitionType;
    duration?: number;
    easing?: EasingType;
  };
  kenBurns?: {
    startScale: number;
    endScale: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  textStyle?: 'hook' | 'title' | 'subtitle' | 'caption' | 'overlay';
  textPosition?: 'top' | 'center' | 'bottom';
}

export interface VideoEditorProps {
  scenes: SceneConfig[];
  audioPath?: string;
  showProgress?: boolean;
  theme?: 'dark' | 'light' | 'cinematic';
}

// ============================================
// THEME CONFIGURATIONS
// ============================================

const themes = {
  dark: {
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0b0',
    accent: '#6366f1',
    progressBg: 'rgba(255,255,255,0.2)',
    progressFill: '#6366f1'
  },
  light: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    accent: '#3b82f6',
    progressBg: 'rgba(0,0,0,0.1)',
    progressFill: '#3b82f6'
  },
  cinematic: {
    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
    textPrimary: '#f5f5f5',
    textSecondary: '#888888',
    accent: '#f59e0b',
    progressBg: 'rgba(255,255,255,0.1)',
    progressFill: '#f59e0b'
  }
};

// ============================================
// KEN BURNS IMAGE COMPONENT
// ============================================

const KenBurnsImage: React.FC<{
  src: string;
  kenBurns?: SceneConfig['kenBurns'];
}> = ({ src, kenBurns }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const defaultKB = {
    startScale: 1,
    endScale: 1.15,
    startX: 50,
    startY: 50,
    endX: 50,
    endY: 50
  };

  const kb = kenBurns || defaultKB;

  const scale = interpolate(
    frame,
    [0, durationInFrames],
    [kb.startScale, kb.endScale],
    { extrapolateRight: 'clamp' }
  );

  const translateX = interpolate(
    frame,
    [0, durationInFrames],
    [kb.startX - 50, kb.endX - 50],
    { extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(
    frame,
    [0, durationInFrames],
    [kb.startY - 50, kb.endY - 50],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={src.startsWith('/') ? staticFile(src.slice(1)) : src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: 'center center'
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// TEXT OVERLAY COMPONENT
// ============================================

const TextOverlay: React.FC<{
  title?: string;
  subtitle?: string;
  textStyle?: SceneConfig['textStyle'];
  textPosition?: SceneConfig['textPosition'];
  theme: typeof themes.dark;
}> = ({ title, subtitle, textStyle = 'title', textPosition = 'center', theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 }
  });

  const subtitleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 100 }
  });

  const getPositionStyle = (): React.CSSProperties => {
    switch (textPosition) {
      case 'top': return { justifyContent: 'flex-start', paddingTop: '15%' };
      case 'bottom': return { justifyContent: 'flex-end', paddingBottom: '15%' };
      default: return { justifyContent: 'center' };
    }
  };

  const getTextStyle = (): { titleSize: string; subtitleSize: string; weight: number } => {
    switch (textStyle) {
      case 'hook': return { titleSize: '4.5rem', subtitleSize: '2rem', weight: 800 };
      case 'title': return { titleSize: '3.5rem', subtitleSize: '1.5rem', weight: 700 };
      case 'subtitle': return { titleSize: '2.5rem', subtitleSize: '1.25rem', weight: 600 };
      case 'caption': return { titleSize: '1.5rem', subtitleSize: '1rem', weight: 500 };
      case 'overlay': return { titleSize: '2rem', subtitleSize: '1rem', weight: 600 };
      default: return { titleSize: '3.5rem', subtitleSize: '1.5rem', weight: 700 };
    }
  };

  const style = getTextStyle();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...getPositionStyle(),
        padding: '5%',
        textAlign: 'center'
      }}
    >
      {title && (
        <div
          style={{
            fontSize: style.titleSize,
            fontWeight: style.weight,
            color: theme.textPrimary,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - titleProgress) * 30}px)`,
            opacity: titleProgress,
            lineHeight: 1.2,
            maxWidth: '90%'
          }}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <div
          style={{
            fontSize: style.subtitleSize,
            fontWeight: 400,
            color: theme.textSecondary,
            marginTop: '1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            transform: `translateY(${(1 - subtitleProgress) * 20}px)`,
            opacity: Math.max(0, subtitleProgress),
            maxWidth: '80%'
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

const ProgressBar: React.FC<{ theme: typeof themes.dark }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: theme.progressBg
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: theme.progressFill,
          transition: 'width 0.1s ease-out'
        }}
      />
    </div>
  );
};

// ============================================
// SCENE RENDERER
// ============================================

const SceneRenderer: React.FC<{
  scene: SceneConfig;
  theme: typeof themes.dark;
}> = ({ scene, theme }) => {
  switch (scene.type) {
    case 'image':
      return (
        <>
          <KenBurnsImage src={scene.content} kenBurns={scene.kenBurns} />
          <TextOverlay
            title={scene.title}
            subtitle={scene.subtitle}
            textStyle={scene.textStyle}
            textPosition={scene.textPosition}
            theme={theme}
          />
        </>
      );

    case 'color':
      return (
        <AbsoluteFill style={{ background: scene.content }}>
          <TextOverlay
            title={scene.title}
            subtitle={scene.subtitle}
            textStyle={scene.textStyle}
            textPosition={scene.textPosition}
            theme={theme}
          />
        </AbsoluteFill>
      );

    case 'text':
      return (
        <AbsoluteFill style={{ background: theme.background }}>
          <TextOverlay
            title={scene.content}
            subtitle={scene.subtitle}
            textStyle={scene.textStyle || 'hook'}
            textPosition={scene.textPosition || 'center'}
            theme={theme}
          />
        </AbsoluteFill>
      );

    default:
      return (
        <AbsoluteFill style={{ background: theme.background }}>
          <TextOverlay title={scene.title} theme={theme} />
        </AbsoluteFill>
      );
  }
};

// ============================================
// TRANSITION RENDERER
// ============================================

const TransitionRenderer: React.FC<{
  config: SceneConfig['transition'];
  content: React.ReactNode;
  theme: typeof themes.dark;
}> = ({ config, content, theme }) => {
  if (!config) return <>{content}</>;

  const { type, duration = 15, easing = 'easeInOut' } = config;

  // For transitions that need content wrapped
  switch (type) {
    case 'slideLeft':
    case 'slideRight':
    case 'slideUp':
    case 'slideDown':
      const direction = type.replace('slide', '').toLowerCase() as 'left' | 'right' | 'up' | 'down';
      return (
        <SlideTransition
          slideDirection={direction}
          duration={duration}
          easing={easing}
          content={content}
          direction="in"
        />
      );

    case 'zoomIn':
    case 'zoomOut':
      return (
        <Transition
          type={type}
          duration={duration}
          easing={easing}
          direction="in"
          content={content}
        />
      );

    case 'wipeLeft':
    case 'wipeRight':
    case 'wipeUp':
    case 'wipeDown':
    case 'wipeDiagonal':
      const wipeDir = type.replace('wipe', '').toLowerCase() as 'left' | 'right' | 'up' | 'down' | 'diagonal';
      return (
        <WipeTransition
          wipeDirection={wipeDir}
          duration={duration}
          easing={easing}
          content={content}
          backgroundColor="#000000"
          direction="in"
        />
      );

    case 'circleWipe':
      return (
        <CircleWipe
          duration={duration}
          easing={easing}
          content={content}
          direction="in"
        />
      );

    case 'blur':
      return (
        <BlurTransition
          duration={duration}
          easing={easing}
          content={content}
          direction="in"
        />
      );

    case 'fade':
    case 'fadeToBlack':
    case 'fadeToWhite':
    default:
      return (
        <>
          {content}
          <FadeToColor
            duration={duration}
            easing={easing}
            color={type === 'fadeToWhite' ? '#ffffff' : '#000000'}
            direction="out"
          />
        </>
      );
  }
};

// ============================================
// MAIN VIDEO EDITOR COMPOSITION
// ============================================

export const VideoEditor: React.FC<VideoEditorProps> = ({
  scenes,
  audioPath,
  showProgress = true,
  theme: themeName = 'dark'
}) => {
  const theme = themes[themeName];

  // Calculate scene start frames
  let currentFrame = 0;
  const sceneTimings = scenes.map(scene => {
    const start = currentFrame;
    currentFrame += scene.duration;
    return { ...scene, startFrame: start };
  });

  return (
    <AbsoluteFill style={{ background: theme.background }}>
      {/* Render each scene as a sequence */}
      {sceneTimings.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.duration}
          name={`Scene ${index + 1}: ${scene.id}`}
        >
          <TransitionRenderer config={scene.transition} theme={theme}>
            <SceneRenderer scene={scene} theme={theme} />
          </TransitionRenderer>
        </Sequence>
      ))}

      {/* Audio track */}
      {audioPath && (
        <Audio src={staticFile(audioPath)} />
      )}

      {/* Progress bar */}
      {showProgress && <ProgressBar theme={theme} />}
    </AbsoluteFill>
  );
};

// ============================================
// DEMO COMPOSITION WITH SAMPLE SCENES
// ============================================

export const VideoEditorDemo: React.FC = () => {
  const demoScenes: SceneConfig[] = [
    {
      id: 'intro',
      type: 'color',
      content: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      duration: 90,
      title: 'Video Editor',
      subtitle: 'Professional Transitions Demo',
      textStyle: 'hook',
      transition: { type: 'fade', duration: 15 }
    },
    {
      id: 'slide-demo',
      type: 'color',
      content: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      duration: 60,
      title: 'Slide Transitions',
      subtitle: 'Smooth directional movement',
      textStyle: 'title',
      transition: { type: 'slideRight', duration: 20, easing: 'easeOut' }
    },
    {
      id: 'wipe-demo',
      type: 'color',
      content: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      duration: 60,
      title: 'Wipe Transitions',
      subtitle: 'Classic reveal effects',
      textStyle: 'title',
      transition: { type: 'wipeLeft', duration: 20 }
    },
    {
      id: 'circle-demo',
      type: 'color',
      content: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      duration: 60,
      title: 'Circle Wipe',
      subtitle: 'Iris transition effect',
      textStyle: 'title',
      transition: { type: 'circleWipe', duration: 25 }
    },
    {
      id: 'zoom-demo',
      type: 'color',
      content: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      duration: 60,
      title: 'Zoom Transitions',
      subtitle: 'Dynamic scale effects',
      textStyle: 'title',
      transition: { type: 'zoomIn', duration: 20, easing: 'easeOut' }
    },
    {
      id: 'blur-demo',
      type: 'color',
      content: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      duration: 60,
      title: 'Blur Transition',
      subtitle: 'Soft focus effect',
      textStyle: 'title',
      transition: { type: 'blur', duration: 20 }
    },
    {
      id: 'outro',
      type: 'color',
      content: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
      duration: 90,
      title: 'Ready to Create',
      subtitle: 'Your video, your story',
      textStyle: 'hook',
      textPosition: 'center',
      transition: { type: 'fadeToBlack', duration: 30 }
    }
  ];

  return <VideoEditor scenes={demoScenes} theme="cinematic" showProgress />;
};

export default VideoEditor;
