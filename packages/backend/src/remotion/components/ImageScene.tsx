import React from 'react';
import { AbsoluteFill, Img, Audio, staticFile } from 'remotion';
import { SlideTitle } from './webslides/SlideTitle';
import { SlideSubtitle } from './webslides/SlideSubtitle';
import { getTheme } from './webslides/themes';

export interface ImageSceneProps {
  imagePath: string;
  audioPath: string;
  title?: string;
  subtitle?: string;
}

export const ImageScene: React.FC<ImageSceneProps> = ({
  imagePath,
  audioPath,
  title = '',
  subtitle = ''
}) => {
  const theme = getTheme('education-dark');

  return (
    <AbsoluteFill>
      {/* Background image with darkening overlay for text readability */}
      <Img
        src={staticFile(imagePath)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Dark gradient overlay for better text contrast */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      {/* Text content overlaid on top */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.padding,
          gap: theme.spacing.gap
        }}
      >
        {title && <SlideTitle theme={theme}>{title}</SlideTitle>}
        {subtitle && <SlideSubtitle theme={theme}>{subtitle}</SlideSubtitle>}
      </AbsoluteFill>

      {/* Voice narration audio */}
      {audioPath && <Audio src={staticFile(audioPath)} />}
    </AbsoluteFill>
  );
};
