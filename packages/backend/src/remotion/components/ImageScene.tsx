import React from 'react';
import { AbsoluteFill, Img, Audio, staticFile } from 'remotion';

export interface ImageSceneProps {
  imagePath: string;
  audioPath: string;
}

export const ImageScene: React.FC<ImageSceneProps> = ({ imagePath, audioPath }) => {
  return (
    <AbsoluteFill>
      {/* Static background image */}
      <Img
        src={imagePath}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Voice narration audio */}
      <Audio src={audioPath} />
    </AbsoluteFill>
  );
};
