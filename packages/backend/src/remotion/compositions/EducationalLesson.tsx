import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoScene } from '../components/VideoScene';
import { ImageScene } from '../components/ImageScene';
import { FadeTransition } from '../components/FadeTransition';
import {
  VennDiagramSlide,
  WebSlidesSlide,
  SlideTitle,
  SlideSubtitle,
  MathNotation,
  SlideTransition,
  WebSlidesTheme,
  getTheme,
  ThemeName
} from '../components/webslides';

export interface SceneData {
  id: number;
  title: string;
  subtitle?: string;
  mathNotation?: string;
  visual: string;
  audio?: string;
  duration: number;
  type: 'manim' | 'gemini' | 'd3-svg' | 'webslides-venn';

  // Optional: Sets Agent layout data
  layout?: {
    union_size?: number;
    intersection_size?: number;
    circle_radius?: number;
    circle_separation?: number;
    tier?: string;
  };
}

export interface EducationalLessonProps {
  scenes: SceneData[];
  theme?: ThemeName;  // WebSlides theme
}

export const EducationalLesson: React.FC<EducationalLessonProps> = ({
  scenes,
  theme = 'education-dark'
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const webSlidesTheme = getTheme(theme);

  // Calculate frame positions for each scene
  let currentFrame = 0;
  const sceneSequences = scenes.map((scene) => {
    const startFrame = currentFrame;
    const durationInFrames = Math.round(scene.duration * fps);
    currentFrame += durationInFrames;

    // Add transition frames (1 second = 30 frames)
    const transitionFrames = 30;
    const transitionStart = currentFrame;
    currentFrame += transitionFrames;

    return {
      scene,
      startFrame,
      durationInFrames,
      transitionStart,
      transitionFrames
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: webSlidesTheme.colors.background }}>
      {sceneSequences.map((seq, index) => (
        <React.Fragment key={seq.scene.id}>
          {/* Scene */}
          <Sequence
            from={seq.startFrame}
            durationInFrames={seq.durationInFrames}
          >
            {/* Use WebSlides components for supported types */}
            {seq.scene.type === 'webslides-venn' ? (
              <VennDiagramSlide
                title={seq.scene.title}
                subtitle={seq.scene.subtitle}
                mathNotation={seq.scene.mathNotation}
                visualType="manim"
                visualPath={seq.scene.visual}
                layout={seq.scene.layout}
                theme={webSlidesTheme}
              />
            ) : seq.scene.type === 'd3-svg' ? (
              <VennDiagramSlide
                title={seq.scene.title}
                subtitle={seq.scene.subtitle}
                mathNotation={seq.scene.mathNotation}
                visualType="d3-svg"
                visualPath={seq.scene.visual}
                layout={seq.scene.layout}
                theme={webSlidesTheme}
              />
            ) : seq.scene.type === 'manim' ? (
              <VideoScene
                videoPath={seq.scene.visual}
                audioPath={seq.scene.audio || ''}
              />
            ) : (
              <ImageScene
                imagePath={seq.scene.visual}
                audioPath={seq.scene.audio || ''}
              />
            )}
          </Sequence>

          {/* Transition (except after last scene) */}
          {index < sceneSequences.length - 1 && (
            <Sequence
              from={seq.transitionStart}
              durationInFrames={seq.transitionFrames}
            >
              <SlideTransition theme={webSlidesTheme} />
            </Sequence>
          )}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
