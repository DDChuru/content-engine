import React from 'react';
import { AbsoluteFill, Video, Audio, staticFile } from 'remotion';

export interface VideoSceneProps {
  videoPath: string;
  audioPath: string;
}

export const VideoScene: React.FC<VideoSceneProps> = ({ videoPath, audioPath }) => {
  return (
    <AbsoluteFill>
      {/* Manim animation video */}
      <Video
        src={videoPath}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />

      {/* Voice narration audio */}
      <Audio src={audioPath} />
    </AbsoluteFill>
  );
};
