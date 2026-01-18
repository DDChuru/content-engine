import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

// Color palette from COMPLETE-LESSON-STRUCTURE.md
const COLORS = {
  primary: '#667eea',
  accent: '#f6ad55',
  success: '#48bb78',
  background: '#0f1419',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
};

interface BrandingIntroSlideProps {
  duration?: number;
}

export const BrandingIntroSlide: React.FC<BrandingIntroSlideProps> = ({
  duration = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale animation
  const scale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  // Fade in text
  const textOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 1],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Logo placeholder - replace with actual logo */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
          transform: `scale(${scale})`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 60,
        }}
      >
        <div style={{
          fontSize: 72,
          fontWeight: 'bold',
          color: 'white',
        }}>
          CEC
        </div>
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 'bold',
          color: COLORS.text,
          opacity: textOpacity,
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        Cambridge IGCSE Mathematics
      </div>

      <div
        style={{
          fontSize: 32,
          color: COLORS.textSecondary,
          opacity: textOpacity,
          marginTop: 20,
        }}
      >
        Educational Content Engine
      </div>
    </AbsoluteFill>
  );
};

interface TopicTitleSlideProps {
  title: string;
  subtitle: string;
}

export const TopicTitleSlide: React.FC<TopicTitleSlideProps> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from left
  const titleX = interpolate(
    frame,
    [0, fps * 0.8],
    [-1920, 0],
    { extrapolateRight: 'clamp' }
  );

  // Slide in from right
  const subtitleX = interpolate(
    frame,
    [fps * 0.3, fps * 1.1],
    [1920, 0],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        backgroundImage: `radial-gradient(circle at 20% 50%, ${COLORS.primary}15 0%, transparent 50%)`,
      }}
    >
      <div
        style={{
          transform: `translateX(${titleX}px)`,
          fontSize: 84,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: 30,
          textAlign: 'center',
        }}
      >
        {title}
      </div>

      <div
        style={{
          transform: `translateX(${subtitleX}px)`,
          fontSize: 48,
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

interface LearningObjectivesSlideProps {
  objectives: string[];
}

export const LearningObjectivesSlide: React.FC<LearningObjectivesSlideProps> = ({
  objectives,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        padding: 100,
        backgroundImage: `linear-gradient(135deg, ${COLORS.primary}08 0%, ${COLORS.accent}08 100%)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: 60,
          borderBottom: `4px solid ${COLORS.primary}`,
          paddingBottom: 20,
        }}
      >
        By the end of this lesson, you will be able to:
      </div>

      {/* Objectives list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {objectives.map((objective, index) => {
          // Stagger animation for each item
          const itemDelay = index * 0.15;
          const opacity = interpolate(
            frame,
            [fps * (0.5 + itemDelay), fps * (1 + itemDelay)],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          const translateY = interpolate(
            frame,
            [fps * (0.5 + itemDelay), fps * (1 + itemDelay)],
            [30, 0],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                opacity,
                transform: `translateY(${translateY}px)`,
                gap: 20,
              }}
            >
              {/* Checkmark bullet */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: COLORS.success,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  fontSize: 24,
                }}
              >
                ✓
              </div>

              <div
                style={{
                  fontSize: 36,
                  color: COLORS.text,
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                {objective}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

interface PrerequisitesSlideProps {
  prerequisites: string[];
  encouragement?: string;
}

export const PrerequisitesSlide: React.FC<PrerequisitesSlideProps> = ({
  prerequisites,
  encouragement = "Don't worry if you're new to sets - we'll build from the ground up!",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        padding: 100,
        backgroundImage: `radial-gradient(circle at 80% 20%, ${COLORS.accent}08 0%, transparent 50%)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 'bold',
          color: COLORS.accent,
          marginBottom: 60,
          borderBottom: `4px solid ${COLORS.accent}`,
          paddingBottom: 20,
        }}
      >
        What you should already know:
      </div>

      {/* Prerequisites list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 25, marginBottom: 60 }}>
        {prerequisites.map((prerequisite, index) => {
          const itemDelay = index * 0.12;
          const opacity = interpolate(
            frame,
            [fps * (0.3 + itemDelay), fps * (0.8 + itemDelay)],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                opacity,
                gap: 20,
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  color: COLORS.accent,
                  flexShrink: 0,
                }}
              >
                •
              </div>
              <div
                style={{
                  fontSize: 36,
                  color: COLORS.text,
                  lineHeight: 1.5,
                }}
              >
                {prerequisite}
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement box */}
      <div
        style={{
          backgroundColor: `${COLORS.success}20`,
          border: `3px solid ${COLORS.success}`,
          borderRadius: 16,
          padding: 40,
          marginTop: 'auto',
          opacity: interpolate(
            frame,
            [fps * 1.5, fps * 2],
            [0, 1],
            { extrapolateRight: 'clamp' }
          ),
        }}
      >
        <div
          style={{
            fontSize: 38,
            color: COLORS.success,
            lineHeight: 1.6,
            textAlign: 'center',
          }}
        >
          {encouragement}
        </div>
      </div>
    </AbsoluteFill>
  );
};

interface LessonRoadmapSlideProps {
  sections: Array<{ number: number; title: string }>;
}

export const LessonRoadmapSlide: React.FC<LessonRoadmapSlideProps> = ({
  sections,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        padding: 100,
        backgroundImage: `linear-gradient(to bottom right, ${COLORS.primary}05, ${COLORS.accent}05)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: 60,
          borderBottom: `4px solid ${COLORS.primary}`,
          paddingBottom: 20,
        }}
      >
        What we'll cover:
      </div>

      {/* Roadmap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 35 }}>
        {sections.map((section, index) => {
          const itemDelay = index * 0.15;
          const opacity = interpolate(
            frame,
            [fps * (0.4 + itemDelay), fps * (0.9 + itemDelay)],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          const scale = spring({
            frame: frame - fps * (0.4 + itemDelay),
            fps,
            from: 0.9,
            to: 1,
            config: { damping: 15 }
          });

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                opacity,
                transform: `scale(${scale})`,
                gap: 30,
              }}
            >
              {/* Number circle */}
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  fontSize: 36,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {section.number}
              </div>

              <div
                style={{
                  fontSize: 40,
                  color: COLORS.text,
                  fontWeight: 500,
                }}
              >
                {section.title}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Export all intro slides
export const IntroSlides = {
  BrandingIntro: BrandingIntroSlide,
  TopicTitle: TopicTitleSlide,
  LearningObjectives: LearningObjectivesSlide,
  Prerequisites: PrerequisitesSlide,
  LessonRoadmap: LessonRoadmapSlide,
};
