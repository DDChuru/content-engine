/**
 * Main Video Composition - Combines all scenes with audio narration
 */

import React from 'react';
import { Sequence, Audio, staticFile } from 'remotion';
import { Scene } from './Scene';
import { PresentationScene } from './PresentationScene';
import { HybridScene } from './HybridScene';
import { VIDEO_CONFIG } from './config';

export interface StoryboardScene {
  id: number;
  title: string;
  narration: string;
  visualDescription: string;
  duration: number;
  imagePath?: string;
  audioPath?: string;
  videoStyle?: 'gallery' | 'presentation' | 'hybrid';
}

export interface VideoCompositionProps {
  title: string;
  scenes: StoryboardScene[];
  totalDuration: number;
  videoStyle?: 'gallery' | 'presentation' | 'hybrid';
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  title,
  scenes,
  totalDuration,
  videoStyle = 'gallery',
}) => {
  let currentFrame = 0;

  return (
    <>
      {/* Title Card - 3 seconds */}
      <Sequence from={0} durationInFrames={3 * VIDEO_CONFIG.fps}>
        <TitleCard title={title} />
      </Sequence>

      {/* Move current frame past title */}
      {(() => {
        currentFrame += 3 * VIDEO_CONFIG.fps;
        return null;
      })()}

      {/* Render each scene sequentially */}
      {scenes.map((scene, index) => {
        const sceneDurationFrames = scene.duration * VIDEO_CONFIG.fps;
        const sceneFrom = currentFrame;

        // Update current frame for next scene
        currentFrame += sceneDurationFrames;

        // Determine which scene component to use based on videoStyle
        const sceneVideoStyle = scene.videoStyle || videoStyle;
        let SceneComponent;

        switch (sceneVideoStyle) {
          case 'presentation':
            SceneComponent = PresentationScene;
            break;
          case 'hybrid':
            SceneComponent = HybridScene;
            break;
          case 'gallery':
          default:
            SceneComponent = Scene;
            break;
        }

        return (
          <React.Fragment key={scene.id}>
            {/* Scene visual */}
            <Sequence from={sceneFrom} durationInFrames={sceneDurationFrames}>
              {sceneVideoStyle === 'gallery' ? (
                <Scene
                  id={scene.id}
                  title={scene.title}
                  imagePath={scene.imagePath || ''}
                  duration={scene.duration}
                  transitionType={index % 3 === 0 ? 'fade' : index % 3 === 1 ? 'zoom' : 'slide'}
                />
              ) : sceneVideoStyle === 'presentation' ? (
                <PresentationScene
                  id={scene.id}
                  title={scene.title}
                  imagePath={scene.imagePath || ''}
                  duration={scene.duration}
                  narration={scene.narration}
                />
              ) : (
                <HybridScene
                  id={scene.id}
                  title={scene.title}
                  imagePath={scene.imagePath || ''}
                  duration={scene.duration}
                  narration={scene.narration}
                  transitionType={index % 3 === 0 ? 'fade' : index % 3 === 1 ? 'zoom' : 'slide'}
                />
              )}
            </Sequence>

            {/* Scene narration audio */}
            {scene.audioPath && (
              <Sequence from={sceneFrom} durationInFrames={sceneDurationFrames}>
                <Audio src={staticFile(scene.audioPath)} volume={0.8} />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}

      {/* End Card - 2 seconds */}
      <Sequence
        from={currentFrame}
        durationInFrames={2 * VIDEO_CONFIG.fps}
      >
        <EndCard />
      </Sequence>
    </>
  );
};

/**
 * Title Card Component
 */
const TitleCard: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${VIDEO_CONFIG.colors.primary} 0%, ${VIDEO_CONFIG.colors.secondary} 50%, ${VIDEO_CONFIG.colors.accent} 100%)`,
        fontFamily: VIDEO_CONFIG.text.titleFont,
      }}
    >
      <h1
        style={{
          fontSize: VIDEO_CONFIG.text.titleSize,
          fontWeight: 'bold',
          color: VIDEO_CONFIG.colors.text,
          textAlign: 'center',
          margin: '0 80px',
          textShadow: '2px 2px 16px rgba(0,0,0,0.5)',
        }}
      >
        {title}
      </h1>
    </div>
  );
};

/**
 * End Card Component
 */
const EndCard: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: VIDEO_CONFIG.colors.background,
        fontFamily: VIDEO_CONFIG.text.titleFont,
      }}
    >
      <div
        style={{
          fontSize: VIDEO_CONFIG.text.subtitleSize,
          color: VIDEO_CONFIG.colors.text,
          textAlign: 'center',
        }}
      >
        Thank You
      </div>
      <div
        style={{
          fontSize: VIDEO_CONFIG.text.captionSize,
          color: VIDEO_CONFIG.colors.textSecondary,
          marginTop: 20,
        }}
      >
        Created with AI Video Director
      </div>
    </div>
  );
};

// Note: Composition registration is handled in Root.tsx
