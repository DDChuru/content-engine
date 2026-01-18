import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { VideoScene } from '../components/VideoScene';
import { IntroSlides } from '../components/webslides/IntroSlides';

// Complete Sets lesson data based on COMPLETE-LESSON-STRUCTURE.md
const SETS_LESSON_DATA = {
  // Part 1: Introduction (2-3 minutes)
  intro: {
    branding: {
      duration: 10, // seconds
    },
    topicTitle: {
      title: 'Introduction to Sets',
      subtitle: 'Understanding Collections and Relationships',
      duration: 15,
    },
    learningObjectives: {
      duration: 45,
      objectives: [
        'Define what a set is and identify set elements',
        'Write sets using correct mathematical notation',
        'Represent sets visually using Venn diagrams',
        'Find the intersection (A ∩ B) of two sets',
        'Find the union (A ∪ B) of two sets',
        'Work with universal sets (ξ)',
        'Solve problems involving set operations',
        'Identify and correct errors in set notation',
      ],
    },
    prerequisites: {
      duration: 30,
      items: [
        'Basic number recognition (integers)',
        'Understanding of "collections" or "groups"',
        'Familiarity with curly braces { }',
        'Basic logical thinking (AND, OR concepts)',
      ],
      encouragement: "Don't worry if you're new to sets - we'll build from the ground up!",
    },
    lessonRoadmap: {
      duration: 30,
      sections: [
        { number: 1, title: 'Set Basics & Notation' },
        { number: 2, title: 'Venn Diagrams (Visual Representation)' },
        { number: 3, title: 'Set Operations (Intersection & Union)' },
        { number: 4, title: 'Universal Sets' },
        { number: 5, title: 'Practice Problems' },
        { number: 6, title: 'Common Mistakes' },
        { number: 7, title: 'Summary & Key Takeaways' },
      ],
    },
  },

  // Part 2: Core Content (Manim scenes)
  manimScenes: [
    {
      id: 'step1',
      title: 'What is a Set?',
      videoPath: 'videos/step1.mp4',
      duration: 8,
      narration: `So, what exactly IS a set? Simply put, a set is a collection of distinct objects. Think of it like a basket containing items - each item appears only once. The objects in a set are called elements or members.`,
    },
    {
      id: 'step2',
      title: 'Set Notation',
      videoPath: 'videos/step2.mp4',
      duration: 7,
      narration: `We write sets using curly braces. For example, A equals brace 1 comma 2 comma 3 brace means set A contains the numbers 1, 2, and 3. Notice how each number appears exactly once.`,
    },
    {
      id: 'step3',
      title: 'Venn Diagram Introduction',
      videoPath: 'videos/step3.mp4',
      duration: 4,
      narration: `To visualize sets, we use Venn diagrams. Each set is represented as a circle, and elements are shown inside.`,
    },
    {
      id: 'step4',
      title: 'Visualizing Set A',
      videoPath: 'videos/step4.mp4',
      duration: 13,  // Updated: notation appears centered, moves up, circle drawn, THEN numbers fly in
      narration: `Let's see this in action. Here's our set A equals 1, 2, 3 in notation form. Watch as the elements leave the notation and fly into the Venn diagram circle. Notice how each element finds its place inside the circle - this is what we mean by "elements of a set".`,
    },
    {
      id: 'step5',
      title: 'Two Sets Overlap',
      videoPath: 'videos/step5.mp4',
      duration: 18,  // Updated: includes intersection annotation
      narration: `Now let's add a second set. Set B equals 2, 3, 4. Watch carefully as both sets' elements fly into their circles. Notice something special? The numbers 2 and 3 appear in BOTH sets! This overlapping region is called the intersection - it's where both sets meet. We write this as A intersection B equals 2, 3. The intersection contains only elements that belong to BOTH sets.`,
    },
    {
      id: 'step7',
      title: 'Union Concept',
      videoPath: 'videos/step7.mp4',
      duration: 14,  // Updated: includes set notations animation and explanation panel
      narration: `The union combines ALL elements from both sets, but each element appears only once. A union B equals 1, 2, 3, 4 - every element from either set. Notice that 2 and 3 appear in both sets, but we write them only once in the union.`,
    },
    {
      id: 'step9',
      title: 'Universal Set Introduction',
      videoPath: 'videos/step9.mp4',
      duration: 16,  // Updated: new animated design with xi symbol reveal
      narration: `The universal set, denoted by the Greek letter xi, contains ALL possible elements we're considering. Think of it as the "universe" for our problem.`,
    },
    {
      id: 'step10',
      title: 'Universal Set Example',
      videoPath: 'videos/step10.mp4',
      duration: 12,  // Updated: new beautiful design with larger universal box
      narration: `Here's a complete example. Our universal set contains numbers 1 through 6. Set A has 1, 2, 3 and Set B has 4, 5, 6. Notice how all elements live inside the universal set rectangle.`,
    },
  ],
};

export interface SetsLessonProps {
  includeIntro?: boolean;
  includeManimScenes?: boolean;
  audioNarration?: boolean; // Enable when we have TTS audio files
}

export const SetsLesson: React.FC<SetsLessonProps> = ({
  includeIntro = true,
  includeManimScenes = true,
  audioNarration = false,
}) => {
  const { fps } = useVideoConfig();

  let currentFrame = 0;
  const sequences: Array<{
    component: React.ReactNode;
    from: number;
    durationInFrames: number;
    label: string;
  }> = [];

  // Helper to add sequence
  const addSequence = (component: React.ReactNode, durationSeconds: number, label: string) => {
    const durationInFrames = Math.round(durationSeconds * fps);
    sequences.push({
      component,
      from: currentFrame,
      durationInFrames,
      label,
    });
    currentFrame += durationInFrames;
  };

  // PART 1: Introduction slides (if enabled)
  if (includeIntro) {
    // 1. Branding Intro (10s)
    addSequence(
      <IntroSlides.BrandingIntro duration={SETS_LESSON_DATA.intro.branding.duration} />,
      SETS_LESSON_DATA.intro.branding.duration,
      'Branding Intro'
    );

    // 2. Topic Title (15s)
    addSequence(
      <IntroSlides.TopicTitle
        title={SETS_LESSON_DATA.intro.topicTitle.title}
        subtitle={SETS_LESSON_DATA.intro.topicTitle.subtitle}
      />,
      SETS_LESSON_DATA.intro.topicTitle.duration,
      'Topic Title'
    );

    // 3. Learning Objectives (45s)
    addSequence(
      <IntroSlides.LearningObjectives
        objectives={SETS_LESSON_DATA.intro.learningObjectives.objectives}
      />,
      SETS_LESSON_DATA.intro.learningObjectives.duration,
      'Learning Objectives'
    );

    // 4. Prerequisites (30s)
    addSequence(
      <IntroSlides.Prerequisites
        prerequisites={SETS_LESSON_DATA.intro.prerequisites.items}
        encouragement={SETS_LESSON_DATA.intro.prerequisites.encouragement}
      />,
      SETS_LESSON_DATA.intro.prerequisites.duration,
      'Prerequisites'
    );

    // 5. Lesson Roadmap (30s)
    addSequence(
      <IntroSlides.LessonRoadmap
        sections={SETS_LESSON_DATA.intro.lessonRoadmap.sections}
      />,
      SETS_LESSON_DATA.intro.lessonRoadmap.duration,
      'Lesson Roadmap'
    );
  }

  // PART 2: Manim core content (if enabled)
  if (includeManimScenes) {
    SETS_LESSON_DATA.manimScenes.forEach((scene) => {
      addSequence(
        <VideoScene
          videoPath={scene.videoPath}
          audioPath={audioNarration ? scene.videoPath.replace('.mp4', '_narration.mp3') : ''}
        />,
        scene.duration,
        scene.title
      );
    });
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f1419' }}>
      {sequences.map((seq, index) => (
        <Sequence
          key={index}
          from={seq.from}
          durationInFrames={seq.durationInFrames}
          name={seq.label}
        >
          {seq.component}
        </Sequence>
      ))}

      {/* Debug timeline overlay (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'monospace',
          }}
        >
          Total Duration: {Math.round(currentFrame / fps)}s | Scenes: {sequences.length}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Calculate total duration for Remotion config
export const getSetsLessonDuration = (fps: number): number => {
  let totalSeconds = 0;

  // Intro scenes
  totalSeconds += SETS_LESSON_DATA.intro.branding.duration;
  totalSeconds += SETS_LESSON_DATA.intro.topicTitle.duration;
  totalSeconds += SETS_LESSON_DATA.intro.learningObjectives.duration;
  totalSeconds += SETS_LESSON_DATA.intro.prerequisites.duration;
  totalSeconds += SETS_LESSON_DATA.intro.lessonRoadmap.duration;

  // Manim scenes
  SETS_LESSON_DATA.manimScenes.forEach((scene) => {
    totalSeconds += scene.duration;
  });

  return Math.round(totalSeconds * fps);
};

// Export lesson data for external use (narration generation, etc.)
export { SETS_LESSON_DATA };
