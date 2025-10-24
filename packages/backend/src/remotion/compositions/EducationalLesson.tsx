import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoScene } from '../components/VideoScene';
import { ImageScene } from '../components/ImageScene';
import { FadeTransition } from '../components/FadeTransition';

export interface SceneData {
  id: number;
  title: string;
  visual: string;
  audio: string;
  duration: number;
  type: 'manim' | 'gemini';
}

export interface EducationalLessonProps {
  scenes: SceneData[];
}

export const EducationalLesson: React.FC<EducationalLessonProps> = ({ scenes }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

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
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {sceneSequences.map((seq, index) => (
        <React.Fragment key={seq.scene.id}>
          {/* Scene */}
          <Sequence
            from={seq.startFrame}
            durationInFrames={seq.durationInFrames}
          >
            {seq.scene.type === 'manim' ? (
              <VideoScene
                videoPath={seq.scene.visual}
                audioPath={seq.scene.audio}
              />
            ) : (
              <ImageScene
                imagePath={seq.scene.visual}
                audioPath={seq.scene.audio}
              />
            )}
          </Sequence>

          {/* Transition (except after last scene) */}
          {index < sceneSequences.length - 1 && (
            <Sequence
              from={seq.transitionStart}
              durationInFrames={seq.transitionFrames}
            >
              <FadeTransition />
            </Sequence>
          )}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
