/**
 * Framework Logo Components for AI Changes Video
 *
 * SVG logos for Angular, React, Vue, Svelte, Next.js, and more
 * All logos are code-based (no external images needed)
 */

import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// Angular Logo (Red shield)
export const AngularLogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 100,
  style = {}
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    style={style}
  >
    <polygon fill="#DD0031" points="128,0 0,45.5 19.5,197 128,256 236.5,197 256,45.5" />
    <polygon fill="#C3002F" points="128,0 128,28.5 128,157 128,256 236.5,197 256,45.5" />
    <path fill="#FFFFFF" d="M128,36.5 L41.5,181 66,181 88.5,127 167.5,127 190,181 214.5,181 128,36.5 M128,82.5 L155.5,115 100.5,115 128,82.5" />
  </svg>
);

// React Logo (Blue atom)
export const ReactLogo: React.FC<{ size?: number; style?: React.CSSProperties; animate?: boolean }> = ({
  size = 100,
  style = {},
  animate = false
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = animate ? (frame / fps) * 30 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-11.5 -10.23 23 20.46"
      style={{ ...style, transform: `rotate(${rotation}deg)` }}
    >
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  );
};

// Vue Logo (Green V)
export const VueLogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 100,
  style = {}
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 221"
    style={style}
  >
    <path fill="#41B883" d="M204.8,0 L256,0 L128,221 L0,0 L51.2,0 L128,133.6 L204.8,0 Z"/>
    <path fill="#34495E" d="M51.2,0 L128,0 L128,51.2 L76.8,0 L51.2,0 Z M204.8,0 L179.2,0 L128,51.2 L128,0 L204.8,0 Z"/>
    <path fill="#41B883" d="M128,0 L179.2,0 L128,88.8 L76.8,0 L128,0 Z"/>
  </svg>
);

// Svelte Logo (Orange fire)
export const SvelteLogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 100,
  style = {}
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 308"
    style={style}
  >
    <path fill="#FF3E00" d="M239.682 40.707C211.113-.182 154.69-12.301 113.895 13.69L42.247 59.356c-17.838 11.443-29.63 29.38-32.728 49.77-2.627 17.197-.546 34.848 5.932 51.016a56.618 56.618 0 0 0-8.428 26.88c-1.216 22.193 6.23 43.997 20.55 60.19-28.569 40.888-16.45 97.31 27.12 126.878a91.463 91.463 0 0 0 50.988 15.524c7.156 0 14.302-.807 21.316-2.418l71.648-45.666c17.838-11.443 29.63-29.38 32.728-49.77 2.627-17.197.546-34.848-5.932-51.016a56.618 56.618 0 0 0 8.428-26.88c1.216-22.193-6.23-43.997-20.55-60.19 28.569-40.888 16.45-97.31-27.12-126.878a91.406 91.406 0 0 0-51.988-15.524c-7.156 0-14.302.807-21.316 2.418z"/>
    <path fill="#FFFFFF" d="M106.889 270.841c-23.102 6.007-47.497-3.036-61.103-22.648a52.685 52.685 0 0 1-9.003-39.85 49.978 49.978 0 0 1 1.713-6.693l1.35-4.115 3.671 2.697a92.447 92.447 0 0 0 28.036 14.007l2.663.808-.245 2.659a16.067 16.067 0 0 0 2.89 10.656 17.143 17.143 0 0 0 18.397 6.828 15.786 15.786 0 0 0 4.403-1.935l71.67-45.672a14.922 14.922 0 0 0 6.734-9.977 15.923 15.923 0 0 0-2.713-12.011 17.156 17.156 0 0 0-18.404-6.832 15.78 15.78 0 0 0-4.396 1.933l-27.35 17.434a52.298 52.298 0 0 1-14.553 6.391c-23.101 6.007-47.497-3.036-61.101-22.649a52.681 52.681 0 0 1-9.004-39.849 49.428 49.428 0 0 1 22.34-33.114l71.664-45.677a52.218 52.218 0 0 1 14.563-6.398c23.101-6.007 47.497 3.036 61.101 22.648a52.685 52.685 0 0 1 9.004 39.85 50.559 50.559 0 0 1-1.713 6.692l-1.35 4.116-3.67-2.693a92.373 92.373 0 0 0-28.037-14.013l-2.664-.809.246-2.658a16.099 16.099 0 0 0-2.89-10.656 17.143 17.143 0 0 0-18.398-6.828 15.786 15.786 0 0 0-4.402 1.935l-71.67 45.674a14.898 14.898 0 0 0-6.73 9.975 15.9 15.9 0 0 0 2.709 12.012 17.156 17.156 0 0 0 18.404 6.832 15.841 15.841 0 0 0 4.402-1.935l27.345-17.427a52.147 52.147 0 0 1 14.552-6.397c23.101-6.006 47.497 3.037 61.102 22.65a52.681 52.681 0 0 1 9.003 39.848 49.453 49.453 0 0 1-22.34 33.12l-71.664 45.673a52.218 52.218 0 0 1-14.563 6.398z"/>
  </svg>
);

// Next.js Logo (Black N)
export const NextLogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 100,
  style = {}
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 180 180"
    style={style}
  >
    <circle cx="90" cy="90" r="90" fill="white"/>
    <path fill="black" d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 0 0 9.509-7.325zM100 125V54h14v71h-14z"/>
  </svg>
);

// TypeScript Logo (Blue TS)
export const TypeScriptLogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 100,
  style = {}
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    style={style}
  >
    <rect fill="#3178C6" width="256" height="256" rx="20"/>
    <path fill="#FFFFFF" d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.621-4.689 3.932-10.486 3.932-17.391 0-4.921-.667-9.232-2-12.932-1.333-3.7-3.28-7.042-5.841-10.026-2.56-2.984-5.685-5.702-9.373-8.152-3.688-2.451-7.884-4.806-12.588-7.066-3.508-1.733-6.613-3.365-9.314-4.896-2.701-1.531-4.96-3.053-6.778-4.568-1.817-1.515-3.199-3.1-4.146-4.752-.946-1.652-1.42-3.481-1.42-5.489 0-1.866.429-3.541 1.287-5.024.858-1.483 2.086-2.761 3.683-3.832 1.598-1.072 3.562-1.899 5.892-2.479 2.33-.581 4.971-.871 7.923-.871 2.098 0 4.271.137 6.519.412 2.249.275 4.492.699 6.73 1.274 2.237.575 4.387 1.294 6.448 2.158 2.061.863 3.967 1.867 5.717 3.012v-25.587c-3.508-1.373-7.4-2.403-11.678-3.092-4.277-.688-9.135-1.032-14.572-1.032-6.622 0-12.853.67-18.695 2.01-5.841 1.34-10.954 3.413-15.338 6.219-4.384 2.806-7.849 6.367-10.395 10.684-2.546 4.316-3.819 9.401-3.819 15.255 0 8.165 2.362 15.108 7.087 20.828 4.725 5.72 11.83 10.547 21.313 14.481 3.82 1.581 7.331 3.137 10.532 4.668 3.2 1.531 5.961 3.124 8.28 4.778 2.32 1.654 4.133 3.442 5.44 5.365 1.307 1.922 1.96 4.07 1.96 6.443 0 1.771-.388 3.397-1.163 4.878-.775 1.481-1.933 2.752-3.475 3.813-1.541 1.061-3.448 1.881-5.72 2.461-2.271.581-4.915.871-7.932.871-5.283 0-10.415-.976-15.395-2.928-4.981-1.952-9.554-4.918-13.719-8.898zm-39.287-114.966h36.252v-24.126h-99.981v24.126h36.252v111.491h27.477v-111.491z"/>
  </svg>
);

// JavaScript Logo (Yellow JS)
export const JavaScriptLogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 100,
  style = {}
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    style={style}
  >
    <rect fill="#F7DF1E" width="256" height="256"/>
    <path fill="black" d="M67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996M152.381 211.354l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247l-18.732 12.03c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574"/>
  </svg>
);

// AI/Robot Icon
export const AIIcon: React.FC<{ size?: number; style?: React.CSSProperties; color?: string }> = ({
  size = 100,
  style = {},
  color = '#667eea'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={style}
  >
    <rect x="3" y="8" width="18" height="12" rx="3" stroke={color} strokeWidth="2"/>
    <circle cx="8" cy="14" r="2" fill={color}/>
    <circle cx="16" cy="14" r="2" fill={color}/>
    <path d="M12 2V5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="2" r="1" fill={color}/>
    <path d="M8 20V22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 20V22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Animated Framework Carousel
export const FrameworkCarousel: React.FC<{
  width?: number;
  height?: number;
  spacing?: number;
}> = ({
  width = 600,
  height = 100,
  spacing = 40
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const frameworks = [
    { Component: AngularLogo, name: 'Angular', delay: 0 },
    { Component: ReactLogo, name: 'React', delay: 5 },
    { Component: VueLogo, name: 'Vue', delay: 10 },
    { Component: SvelteLogo, name: 'Svelte', delay: 15 },
    { Component: NextLogo, name: 'Next.js', delay: 20 },
    { Component: TypeScriptLogo, name: 'TypeScript', delay: 25 },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing,
      width,
      height
    }}>
      {frameworks.map(({ Component, name, delay }, index) => {
        const scale = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { damping: 12, stiffness: 200 }
        });

        const opacity = spring({
          frame: frame - delay,
          fps,
          config: { damping: 100 }
        });

        return (
          <div
            key={name}
            style={{
              opacity,
              transform: `scale(${scale})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Component size={60} />
            <span style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'system-ui'
            }}>
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Animated Heart Breaking (for divorce metaphor)
export const HeartBreaking: React.FC<{
  size?: number;
  breakProgress?: number;
  color?: string;
}> = ({
  size = 100,
  breakProgress = 0,
  color = '#DD0031'
}) => {
  const leftOffset = -breakProgress * 15;
  const rightOffset = breakProgress * 15;
  const rotation = breakProgress * 10;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Left half */}
      <svg
        width={size / 2}
        height={size}
        viewBox="0 0 128 256"
        style={{
          position: 'absolute',
          left: leftOffset,
          transform: `rotate(${-rotation}deg)`,
          transformOrigin: 'right center'
        }}
      >
        <path
          fill={color}
          d="M128,40 C128,18 110,0 88,0 C66,0 50,18 50,40 C50,50 55,60 65,70 L128,140 L128,40 Z"
        />
      </svg>
      {/* Right half */}
      <svg
        width={size / 2}
        height={size}
        viewBox="128 0 128 256"
        style={{
          position: 'absolute',
          left: size / 2 + rightOffset,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'left center'
        }}
      >
        <path
          fill={color}
          d="M128,40 C128,18 146,0 168,0 C190,0 206,18 206,40 C206,50 201,60 191,70 L128,140 L128,40 Z"
        />
      </svg>
    </div>
  );
};

// Simple Code Display without innerHTML
export const CodeSnippet: React.FC<{
  lines: { text: string; color?: string }[];
  showLineNumbers?: boolean;
  highlightLines?: number[];
  width?: number;
  fontSize?: number;
}> = ({
  lines,
  showLineNumbers = true,
  highlightLines = [],
  width = 500,
  fontSize = 14
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{
      backgroundColor: '#282c34',
      borderRadius: 8,
      padding: 16,
      width,
      fontFamily: '"Fira Code", "SF Mono", monospace',
      fontSize,
      overflow: 'hidden'
    }}>
      {lines.map((line, index) => {
        const charProgress = spring({
          frame: frame - index * 3,
          fps,
          config: { damping: 100, stiffness: 200 }
        });

        const displayLength = Math.floor(charProgress * line.text.length);
        const displayLine = line.text.substring(0, displayLength);

        const isHighlighted = highlightLines.includes(index + 1);

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              backgroundColor: isHighlighted ? 'rgba(255,255,0,0.1)' : 'transparent',
              padding: '2px 0'
            }}
          >
            {showLineNumbers && (
              <span style={{
                color: '#5c6370',
                width: 30,
                marginRight: 16,
                textAlign: 'right'
              }}>
                {index + 1}
              </span>
            )}
            <span style={{ color: line.color || '#abb2bf' }}>
              {displayLine}
            </span>
            {charProgress < 1 && charProgress > 0 && (
              <span style={{
                backgroundColor: '#528bff',
                width: 2,
                height: '1em',
                display: 'inline-block'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Progress Timeline
export const ProgressTimeline: React.FC<{
  steps: string[];
  currentStep: number;
  width?: number;
}> = ({
  steps,
  currentStep,
  width = 600
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width
    }}>
      {steps.map((step, index) => {
        const isActive = index <= currentStep;
        const isCurrently = index === currentStep;

        const scale = isCurrently ? spring({
          frame,
          fps,
          from: 1,
          to: 1.1,
          config: { damping: 5, stiffness: 100 }
        }) : 1;

        return (
          <React.Fragment key={index}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transform: `scale(${scale})`
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: isActive ? '#667eea' : '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 16,
                boxShadow: isCurrently ? '0 0 20px rgba(102, 126, 234, 0.5)' : 'none'
              }}>
                {index + 1}
              </div>
              <span style={{
                fontSize: 12,
                color: isActive ? 'white' : '#666',
                textAlign: 'center',
                maxWidth: 80
              }}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: 4,
                backgroundColor: index < currentStep ? '#667eea' : '#333',
                margin: '0 10px',
                borderRadius: 2
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Mountain of Knowledge Visual
export const MountainVisualization: React.FC<{
  width?: number;
  height?: number;
  highlightLevel?: number;
}> = ({
  width = 600,
  height = 400,
  highlightLevel = 0
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const levels = [
    { name: 'HTML/CSS', y: 350, color: '#e44d26' },
    { name: 'JavaScript', y: 280, color: '#f7df1e' },
    { name: 'Frameworks', y: 210, color: '#61DAFB' },
    { name: 'Testing', y: 140, color: '#4caf50' },
    { name: 'Architecture', y: 70, color: '#667eea' },
  ];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Mountain shape */}
      <polygon
        points={`${width/2},20 ${width-50},${height-20} 50,${height-20}`}
        fill="url(#mountainGradient)"
        stroke="#333"
        strokeWidth="2"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="50%" stopColor="#4a148c" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
      </defs>

      {/* Level indicators */}
      {levels.map((level, index) => {
        const appearDelay = index * 10;
        const opacity = spring({
          frame: frame - appearDelay,
          fps,
          config: { damping: 100 }
        });

        const isHighlighted = index === highlightLevel;

        return (
          <g key={level.name} style={{ opacity }}>
            <line
              x1={100 + index * 20}
              y1={level.y}
              x2={width - 100 - index * 20}
              y2={level.y}
              stroke={isHighlighted ? level.color : '#666'}
              strokeWidth={isHighlighted ? 3 : 1}
              strokeDasharray="5,5"
            />
            <text
              x={90}
              y={level.y + 5}
              fill={isHighlighted ? level.color : '#999'}
              fontSize={isHighlighted ? 14 : 12}
              textAnchor="end"
              fontFamily="system-ui"
            >
              {level.name}
            </text>
          </g>
        );
      })}

      {/* Flag at summit */}
      <g transform={`translate(${width/2 - 10}, 10)`}>
        <line x1="0" y1="0" x2="0" y2="30" stroke="#fff" strokeWidth="2" />
        <polygon points="0,0 20,8 0,16" fill="#e94560" />
      </g>
    </svg>
  );
};

// Timeline Comparison Visual
export const TimelineComparison: React.FC<{
  width?: number;
  height?: number;
  progress?: number;
}> = ({
  width = 800,
  height = 300,
  progress = 0
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{
      display: 'flex',
      gap: 40,
      width,
      height,
      justifyContent: 'center'
    }}>
      {/* Traditional Path */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,87,51,0.1)',
        borderRadius: 16,
        border: '2px solid #ff5733'
      }}>
        <span style={{ color: '#ff5733', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Traditional Path
        </span>
        <svg width="200" height="150" viewBox="0 0 200 150">
          {/* Winding road */}
          <path
            d="M20,130 Q60,120 50,90 Q40,60 80,50 Q120,40 100,20 Q80,0 100,0"
            fill="none"
            stroke="#ff5733"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Years markers */}
          {[1, 2, 3, 4].map((year, i) => (
            <g key={year} transform={`translate(${30 + i * 40}, ${120 - i * 30})`}>
              <circle r="12" fill="#1a1a2e" stroke="#ff5733" strokeWidth="2" />
              <text fill="#ff5733" fontSize="10" textAnchor="middle" dy="4">Y{year}</text>
            </g>
          ))}
        </svg>
        <span style={{ color: '#ff5733', fontSize: 32, fontWeight: 'bold', marginTop: 10 }}>
          4 YEARS
        </span>
      </div>

      {/* AI-Assisted Path */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(102,126,234,0.1)',
        borderRadius: 16,
        border: '2px solid #667eea'
      }}>
        <span style={{ color: '#667eea', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          AI-Assisted Path
        </span>
        <svg width="200" height="150" viewBox="0 0 200 150">
          {/* Direct arrow */}
          <path
            d="M100,130 L100,20"
            fill="none"
            stroke="#667eea"
            strokeWidth="6"
            strokeLinecap="round"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#667eea" />
            </marker>
          </defs>
          {/* Rocket icon */}
          <g transform="translate(85, 50)">
            <ellipse cx="15" cy="20" rx="12" ry="25" fill="#667eea" />
            <polygon points="15,0 5,20 25,20" fill="#667eea" />
            <ellipse cx="15" cy="50" rx="8" ry="5" fill="#ff5733" opacity="0.8" />
          </g>
        </svg>
        <span style={{ color: '#667eea', fontSize: 32, fontWeight: 'bold', marginTop: 10 }}>
          4 WEEKS
        </span>
      </div>
    </div>
  );
};
