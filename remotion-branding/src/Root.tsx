import React from 'react';
import { Composition } from 'remotion';
import { Intro } from './Intro';
import { Outro } from './Outro';
import { IntroWithImage } from './IntroWithImage';
import { PipelineDiagram } from './PipelineDiagram';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Intro Composition - 3 seconds at 30fps = 90 frames */}
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Content Engine',
          subtitle: 'Professional Training Content',
          brandColor: '#4f46e5',
        }}
      />

      {/* Outro Composition - 5 seconds at 30fps = 150 frames */}
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Thanks for Watching!',
          callToAction: 'Subscribe for More Training Videos',
          socialHandles: {
            youtube: '@ContentEngine',
            twitter: '@ContentEngine',
            website: 'contentengine.com',
          },
          contactInfo: 'questions@contentengine.com',
          brandColor: '#4f46e5',
        }}
      />

      {/* Example: SOP Intro */}
      <Composition
        id="SOPIntro"
        component={Intro}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Temperature Monitoring',
          subtitle: 'Standard Operating Procedure',
          brandColor: '#0ea5e9',
        }}
      />

      {/* Example: Training Outro */}
      <Composition
        id="TrainingOutro"
        component={Outro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Great Job!',
          callToAction: 'Complete the Quiz to Finish',
          contactInfo: 'Need help? Contact training@company.com',
          brandColor: '#0ea5e9',
        }}
      />

      {/* Example: Intro with Custom Images */}
      <Composition
        id="IntroWithImage"
        component={IntroWithImage}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Content Engine',
          subtitle: 'Professional Training Content',
          brandColor: '#4f46e5',
          logoPath: 'images/logo.png',  // Your logo goes here
          backgroundImage: 'images/background.jpg',  // Optional background
        }}
      />

      {/* Pipeline Diagram - Educational Video Production Flow */}
      <Composition
        id="PipelineDiagram"
        component={PipelineDiagram}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
