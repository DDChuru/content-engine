import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// Professional muted color palette
const colors = {
  background: '#f8f9fa',
  primary: '#4a5568',
  secondary: '#718096',
  accent1: '#667eea',
  accent2: '#48bb78',
  accent3: '#ed8936',
  accent4: '#9f7aea',
  text: '#2d3748',
  textLight: '#718096',
  border: '#e2e8f0'
};

interface NodeProps {
  label: string;
  shape?: 'rectangle' | 'rounded' | 'pill' | 'hexagon' | 'circle';
  color: string;
  delay: number;
  icon?: string;
}

const Node: React.FC<NodeProps> = ({ label, shape = 'rounded', color, delay, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
    }
  });

  const opacity = interpolate(
    frame - delay,
    [0, 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const getShapeStyle = () => {
    const base = {
      padding: '12px 24px',
      background: color,
      color: 'white',
      fontWeight: 600,
      fontSize: '14px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `2px solid ${colors.border}`,
    };

    switch (shape) {
      case 'pill':
        return { ...base, borderRadius: '50px' };
      case 'hexagon':
        return {
          ...base,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          padding: '12px 32px'
        };
      case 'circle':
        return {
          ...base,
          borderRadius: '50%',
          width: '120px',
          height: '120px',
          padding: '0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center' as const
        };
      case 'rectangle':
        return { ...base, borderRadius: '4px' };
      default: // rounded
        return { ...base, borderRadius: '12px' };
    }
  };

  return (
    <div
      style={{
        ...getShapeStyle(),
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
      {label}
    </div>
  );
};

interface BlockProps {
  title: string;
  children: React.ReactNode;
  backgroundColor?: string;
  delay: number;
}

const Block: React.FC<BlockProps> = ({ title, children, backgroundColor = 'white', delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateY = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 25,
      stiffness: 80,
    },
    from: 30,
    to: 0,
  });

  const opacity = interpolate(
    frame - delay,
    [0, 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        background: backgroundColor,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: `2px solid ${colors.border}`,
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div style={{
        fontSize: '12px',
        color: colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 700,
        marginBottom: '16px',
      }}>
        {title}
      </div>
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  );
};

const ConnectionLine: React.FC<{ delay: number; dashed?: boolean }> = ({ delay, dashed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const height = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 30,
    },
    from: 0,
    to: 50,
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{
        width: '3px',
        height: `${height}px`,
        background: dashed
          ? `repeating-linear-gradient(to bottom, ${colors.secondary} 0px, ${colors.secondary} 5px, transparent 5px, transparent 10px)`
          : colors.secondary,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `10px solid ${colors.secondary}`,
        }} />
      </div>
    </div>
  );
};

export const PipelineDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: colors.background }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        overflowY: 'auto',
      }}>
        {/* Title */}
        <div style={{
          fontSize: '32px',
          fontWeight: 700,
          color: colors.text,
          marginBottom: '48px',
          textAlign: 'center',
          opacity: interpolate(frame, [0, 30], [0, 1]),
        }}>
          🎓 AI Educational Video Production Pipeline
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '1000px',
          width: '100%',
        }}>
          {/* Input */}
          <Block title="Input" backgroundColor="#ffffff" delay={10}>
            <Node
              label="Math Syllabus Topic"
              shape="pill"
              color={colors.primary}
              delay={15}
              icon="📚"
            />
          </Block>

          <ConnectionLine delay={25} />

          {/* Context Layer - Mixed shapes */}
          <Block title="Context Layer" backgroundColor="#f7fafc" delay={35}>
            <Node
              label="Learning Objectives"
              shape="rounded"
              color={colors.accent1}
              delay={40}
              icon="🎯"
            />
            <Node
              label="Pedagogical Approach"
              shape="hexagon"
              color={colors.accent1}
              delay={45}
              icon="📖"
            />
            <Node
              label="Evaluation Criteria"
              shape="rounded"
              color={colors.accent1}
              delay={50}
              icon="✓"
            />
          </Block>

          <ConnectionLine delay={60} />

          {/* Agent Orchestration - Different shapes */}
          <Block title="Agent Orchestration" backgroundColor="#edf2f7" delay={70}>
            <Node
              label="Director Agent"
              shape="hexagon"
              color={colors.secondary}
              delay={75}
              icon="🎬"
            />
            <Node
              label="Script Writer"
              shape="pill"
              color={colors.secondary}
              delay={80}
              icon="✍️"
            />
            <Node
              label="Visual Designer"
              shape="rounded"
              color={colors.secondary}
              delay={85}
              icon="👁️"
            />
          </Block>

          <ConnectionLine delay={95} />

          {/* Production Tools - Mixed shapes in grid */}
          <Block title="Production Tools" backgroundColor="#f0fff4" delay={105}>
            <Node
              label="Manim"
              shape="rounded"
              color={colors.accent2}
              delay={110}
              icon="∫"
            />
            <Node
              label="Remotion"
              shape="pill"
              color={colors.accent2}
              delay={115}
              icon="▶"
            />
            <Node
              label="Gemini Images"
              shape="hexagon"
              color={colors.accent2}
              delay={120}
              icon="✦"
            />
            <Node
              label="Diagrams"
              shape="rounded"
              color={colors.accent2}
              delay={125}
              icon="📊"
            />
          </Block>

          <ConnectionLine delay={135} />

          {/* Output */}
          <Block title="Output" backgroundColor="#fffaf0" delay={145}>
            <Node
              label="Assembled Video"
              shape="pill"
              color={colors.accent3}
              delay={150}
              icon="🎥"
            />
            <Node
              label="Study Materials"
              shape="rounded"
              color={colors.accent3}
              delay={155}
              icon="📝"
            />
            <Node
              label="Interactive Content"
              shape="hexagon"
              color={colors.accent3}
              delay={160}
              icon="🎮"
            />
          </Block>

          <ConnectionLine delay={170} dashed />

          {/* Human in Loop */}
          <Block title="Human in Loop" backgroundColor="#faf5ff" delay={180}>
            <Node
              label="Teacher Review"
              shape="rounded"
              color={colors.accent4}
              delay={185}
              icon="👨‍🏫"
            />
            <Node
              label="Voiceover"
              shape="pill"
              color={colors.accent4}
              delay={190}
              icon="🎙️"
            />
            <Node
              label="Refinement"
              shape="hexagon"
              color={colors.accent4}
              delay={195}
              icon="✨"
            />
          </Block>

          <ConnectionLine delay={205} />

          {/* Student Interaction */}
          <Block title="Student Interaction" backgroundColor="#e6fffa" delay={215}>
            <Node
              label="Student"
              shape="circle"
              color={colors.primary}
              delay={220}
              icon="👨‍🎓"
            />
            <Node
              label="Evaluation"
              shape="rounded"
              color={colors.secondary}
              delay={225}
              icon="📊"
            />
            <Node
              label="Feedback Loop"
              shape="pill"
              color={colors.accent2}
              delay={230}
              icon="🔄"
            />
          </Block>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const pipelineDiagramConfig = {
  id: 'PipelineDiagram',
  component: PipelineDiagram,
  durationInFrames: 300, // 10 seconds at 30fps
  fps: 30,
  width: 1920,
  height: 1080,
};
