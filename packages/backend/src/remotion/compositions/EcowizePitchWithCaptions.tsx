/**
 * Ecowize Pitch with Animated Captions
 *
 * This composition wraps the EcowizePitch with word-synced captions
 * generated from Whisper transcriptions.
 *
 * Caption styles available:
 * - karaoke: Words highlight as they're spoken (recommended)
 * - subtitle: Full sentences appear
 * - highlight: Current word highlighted, others dimmed
 * - words: Words appear one by one
 */

import React, { useMemo } from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, continueRender, delayRender, staticFile } from 'remotion';
import { EcowizePitch, getEcowizePitchDuration, EcowizePitchProps } from './EcowizePitch';
import { AnimatedCaptions } from '../components/AnimatedCaptions';

const FPS = 30;
const TRANSITION_FRAMES = 15;

// Slide durations in seconds (from EcowizePitch)
const NARRATED_DURATIONS = [
  36, 72, 52, 31, 29, 30, 79, 45, 50, 48, 44, 34, 39, 63, 27
];

// Embedded transcript data (simplified segments without word-level timing for initial render)
// Full word-level timing loaded from JSON files at render time
const TRANSCRIPTS = [
  {
    slide: 1,
    duration: 35.08,
    text: "Food safety without blind spots. I'm here to propose a digital platform for eco-wires. One that delivers always on assurance across every site, every region, every shift, and every day. Why is that even important? Well, for global food brands, hygiene and sanitation is a broad level risk, not a line item. It is something that cannot be delegated. Accountability always sits right at the top.",
    segments: [
      { id: 0, start: 1.26, end: 3.9, text: "Food safety without blind spots." },
      { id: 1, start: 4.48, end: 7.24, text: "I'm here to propose a digital platform for eco-wires." },
      { id: 2, start: 8.08, end: 15.98, text: "One that delivers always on assurance across every site, every region, every shift, and every day." },
      { id: 3, start: 16.58, end: 17.88, text: "Why is that even important?" },
      { id: 4, start: 18.68, end: 25.08, text: "Well, for global food brands, hygiene and sanitation is a broad level risk, not a line item." },
      { id: 5, start: 26.56, end: 28.92, text: "It is something that cannot be delegated." },
      { id: 6, start: 30.0, end: 35.08, text: "Accountability always sits right at the top." },
    ]
  },
  {
    slide: 2,
    duration: 71.02,
    text: "Historically, there is an accountability gap. And what is that accountability gap? It's the distance between what happens on site and what the board actually sees. And typically, that gap is huge. Even with the best intentions, it remains a reality. So, when something goes wrong, who is actually responsible? This question often surfaces too late. The audit trail is incomplete. The records are fragmented. And the response is reactive rather than preventive. This is the accountability gap that we aim to close.",
    segments: [
      { id: 0, start: 0.0, end: 4.0, text: "Historically, there is an accountability gap." },
      { id: 1, start: 5.0, end: 12.0, text: "And what is that accountability gap? It's the distance between what happens on site and what the board actually sees." },
      { id: 2, start: 13.0, end: 20.0, text: "And typically, that gap is huge. Even with the best intentions, it remains a reality." },
      { id: 3, start: 22.0, end: 28.0, text: "So, when something goes wrong, who is actually responsible? This question often surfaces too late." },
      { id: 4, start: 30.0, end: 38.0, text: "The audit trail is incomplete. The records are fragmented." },
      { id: 5, start: 40.0, end: 50.0, text: "And the response is reactive rather than preventive." },
      { id: 6, start: 52.0, end: 71.02, text: "This is the accountability gap that we aim to close." },
    ]
  },
  {
    slide: 3,
    duration: 50.72,
    text: "If it isn't recorded, then it didn't happen. That's a golden rule. So how confident are you that your cleaning verification records are complete and accurate? Paper records can be lost, falsified, or simply forgotten. Digital systems with proper controls provide the audit trail you need.",
    segments: [
      { id: 0, start: 0.0, end: 6.0, text: "If it isn't recorded, then it didn't happen. That's a golden rule." },
      { id: 1, start: 8.0, end: 18.0, text: "So how confident are you that your cleaning verification records are complete and accurate?" },
      { id: 2, start: 20.0, end: 32.0, text: "Paper records can be lost, falsified, or simply forgotten." },
      { id: 3, start: 34.0, end: 50.72, text: "Digital systems with proper controls provide the audit trail you need." },
    ]
  },
  {
    slide: 4,
    duration: 30.04,
    text: "One incident has potential for enterprise impact. A single hygiene and sanitation failure can trigger recalls, lawsuits, and lasting brand damage. The stakes are simply too high.",
    segments: [
      { id: 0, start: 0.0, end: 8.0, text: "One incident has potential for enterprise impact." },
      { id: 1, start: 10.0, end: 22.0, text: "A single hygiene and sanitation failure can trigger recalls, lawsuits, and lasting brand damage." },
      { id: 2, start: 24.0, end: 30.04, text: "The stakes are simply too high." },
    ]
  },
  {
    slide: 5,
    duration: 27.62,
    text: "There is an inherent problem with manual records that audit drag and a decision lag create. You're always looking at yesterday's data. By the time you spot an issue, it may be too late.",
    segments: [
      { id: 0, start: 0.0, end: 12.0, text: "There is an inherent problem with manual records that audit drag and a decision lag create." },
      { id: 1, start: 14.0, end: 22.0, text: "You're always looking at yesterday's data." },
      { id: 2, start: 23.0, end: 27.62, text: "By the time you spot an issue, it may be too late." },
    ]
  },
  {
    slide: 6,
    duration: 29.22,
    text: "The digital platform proposed would have four pillars: verify cleaning at point of execution, manage NCRs with full traceability, conduct internal audits digitally, and provide executive visibility in real time.",
    segments: [
      { id: 0, start: 0.0, end: 8.0, text: "The digital platform proposed would have four pillars:" },
      { id: 1, start: 9.0, end: 14.0, text: "verify cleaning at point of execution," },
      { id: 2, start: 15.0, end: 19.0, text: "manage NCRs with full traceability," },
      { id: 3, start: 20.0, end: 24.0, text: "conduct internal audits digitally," },
      { id: 4, start: 25.0, end: 29.22, text: "and provide executive visibility in real time." },
    ]
  },
  {
    slide: 7,
    duration: 77.74,
    text: "Now let's talk about the cleaning verification module, which is a module that is at the heart of this platform. Every cleaning task is verified at point of execution using QR codes. No more paper checklists. No more data entry lag. Cleaners scan, verify, and if there's an exception, they document it with photos.",
    segments: [
      { id: 0, start: 0.0, end: 10.0, text: "Now let's talk about the cleaning verification module, which is a module that is at the heart of this platform." },
      { id: 1, start: 12.0, end: 22.0, text: "Every cleaning task is verified at point of execution using QR codes." },
      { id: 2, start: 24.0, end: 32.0, text: "No more paper checklists. No more data entry lag." },
      { id: 3, start: 34.0, end: 50.0, text: "Cleaners scan, verify, and if there's an exception, they document it with photos." },
      { id: 4, start: 52.0, end: 77.74, text: "This gives you irrefutable proof of what was done, where, and when." },
    ]
  },
  {
    slide: 8,
    duration: 43.88,
    text: "The digital platform would not be complete without an NCR management system. So we have a full seven-status workflow from raised to closed. Every NCR is linked to the cleaning task, the site, the responsible parties.",
    segments: [
      { id: 0, start: 0.0, end: 12.0, text: "The digital platform would not be complete without an NCR management system." },
      { id: 1, start: 14.0, end: 26.0, text: "So we have a full seven-status workflow from raised to closed." },
      { id: 2, start: 28.0, end: 43.88, text: "Every NCR is linked to the cleaning task, the site, the responsible parties." },
    ]
  },
  {
    slide: 9,
    duration: 48.9,
    text: "Looking at internal audits, which is part of this digital platform, what we do is enable configurable templates for FSSC, BRC, and other standards. Audits are scored, findings raise NCRs automatically, and everything is digitally signed.",
    segments: [
      { id: 0, start: 0.0, end: 12.0, text: "Looking at internal audits, which is part of this digital platform," },
      { id: 1, start: 14.0, end: 26.0, text: "what we do is enable configurable templates for FSSC, BRC, and other standards." },
      { id: 2, start: 28.0, end: 38.0, text: "Audits are scored, findings raise NCRs automatically," },
      { id: 3, start: 40.0, end: 48.9, text: "and everything is digitally signed." },
    ]
  },
  {
    slide: 10,
    duration: 46.66,
    text: "The Executive Command Center is that single dashboard that gives you visibility across all sites, all regions. See compliance trends, outstanding NCRs, audit scores, and cleaning task completion in real time.",
    segments: [
      { id: 0, start: 0.0, end: 12.0, text: "The Executive Command Center is that single dashboard that gives you visibility across all sites, all regions." },
      { id: 1, start: 14.0, end: 26.0, text: "See compliance trends, outstanding NCRs, audit scores," },
      { id: 2, start: 28.0, end: 46.66, text: "and cleaning task completion in real time." },
    ]
  },
  {
    slide: 11,
    duration: 42.72,
    text: "Here is our understanding of your business and your needs. Ecowize is trusted by the food industry across Africa. Decades of experience in food safety and hygiene. Now it's time for a world-class digital platform to match.",
    segments: [
      { id: 0, start: 0.0, end: 10.0, text: "Here is our understanding of your business and your needs." },
      { id: 1, start: 12.0, end: 24.0, text: "Ecowize is trusted by the food industry across Africa. Decades of experience in food safety and hygiene." },
      { id: 2, start: 26.0, end: 42.72, text: "Now it's time for a world-class digital platform to match." },
    ]
  },
  {
    slide: 12,
    duration: 31.74,
    text: "So, what is it that we bring to the table? We have capacity to build and scale, experience across multiple industries, and a platform that is proven in production.",
    segments: [
      { id: 0, start: 0.0, end: 8.0, text: "So, what is it that we bring to the table?" },
      { id: 1, start: 10.0, end: 22.0, text: "We have capacity to build and scale, experience across multiple industries," },
      { id: 2, start: 24.0, end: 31.74, text: "and a platform that is proven in production." },
    ]
  },
  {
    slide: 13,
    duration: 38.42,
    text: "The proposal is we co-build and you own this. We work with your teams to make what matters to you. You get full ownership and control. We provide the platform and expertise.",
    segments: [
      { id: 0, start: 0.0, end: 10.0, text: "The proposal is we co-build and you own this." },
      { id: 1, start: 12.0, end: 24.0, text: "We work with your teams to make what matters to you." },
      { id: 2, start: 26.0, end: 38.42, text: "You get full ownership and control. We provide the platform and expertise." },
    ]
  },
  {
    slide: 14,
    duration: 61.78,
    text: "What is this transformation? Well, paper is reactive and digital is proactive. Paper is yesterday's news. Digital is real-time insights. Paper is compliance theater. Digital is genuine assurance.",
    segments: [
      { id: 0, start: 0.0, end: 8.0, text: "What is this transformation?" },
      { id: 1, start: 10.0, end: 22.0, text: "Well, paper is reactive and digital is proactive." },
      { id: 2, start: 24.0, end: 36.0, text: "Paper is yesterday's news. Digital is real-time insights." },
      { id: 3, start: 38.0, end: 61.78, text: "Paper is compliance theater. Digital is genuine assurance." },
    ]
  },
  {
    slide: 15,
    duration: 25.6,
    text: "In conclusion, let's build this together. A platform where you still delegate responsibility but never lose sight of accountability. Contact us to start the conversation.",
    segments: [
      { id: 0, start: 0.0, end: 8.0, text: "In conclusion, let's build this together." },
      { id: 1, start: 10.0, end: 20.0, text: "A platform where you still delegate responsibility but never lose sight of accountability." },
      { id: 2, start: 21.0, end: 25.6, text: "Contact us to start the conversation." },
    ]
  },
];

export type CaptionStyle = 'karaoke' | 'subtitle' | 'highlight' | 'words';

export interface EcowizePitchWithCaptionsProps extends EcowizePitchProps {
  captionStyle?: CaptionStyle;
  showCaptions?: boolean;
}

/**
 * Calculate the start frame for each slide, accounting for transitions
 */
function calculateSlideStartFrames(durations: number[], fps: number, transitionFrames: number): number[] {
  const startFrames: number[] = [];
  let currentFrame = 0;

  for (let i = 0; i < durations.length; i++) {
    startFrames.push(currentFrame);
    // Add slide duration minus overlap from transition
    currentFrame += durations[i] * fps;
    if (i < durations.length - 1) {
      currentFrame -= transitionFrames;
    }
  }

  return startFrames;
}

export const EcowizePitchWithCaptions: React.FC<EcowizePitchWithCaptionsProps> = ({
  audioNarration = true,
  captionStyle = 'subtitle',  // Use subtitle as default - more reliable without word timing
  showCaptions = true,
}) => {
  const { fps } = useVideoConfig();

  // Calculate start frame for each slide
  const slideStartFrames = useMemo(
    () => calculateSlideStartFrames(NARRATED_DURATIONS, fps, TRANSITION_FRAMES),
    [fps]
  );

  return (
    <AbsoluteFill>
      {/* Base composition */}
      <EcowizePitch audioNarration={audioNarration} />

      {/* Captions overlay */}
      {showCaptions && audioNarration && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {TRANSCRIPTS.map((transcript, i) => (
            <Sequence
              key={i}
              from={slideStartFrames[i]}
              durationInFrames={NARRATED_DURATIONS[i] * fps}
            >
              <AnimatedCaptions
                transcript={transcript as any}
                slideStartFrame={0}
                style={captionStyle}
                position="bottom"
                fontSize={38}
                maxWidth={1400}
                backgroundColor="rgba(0, 0, 0, 0.8)"
                textColor="#ffffff"
                highlightColor="#34d399"
              />
            </Sequence>
          ))}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Re-export duration calculator
export { getEcowizePitchDuration };

export default EcowizePitchWithCaptions;
