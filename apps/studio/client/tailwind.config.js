/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Content Engine Studio theme - professional dark with accent colors
        studio: {
          bg: '#0a0a0f',
          card: '#12121a',
          border: '#1e1e2e',
          text: '#e8e8f0',
          muted: '#6b7280',
          dim: '#3a3a4d',
        },
        accent: {
          primary: '#00ff88',    // Neon green (Claude)
          secondary: '#00f0ff',  // Cyan (actions)
          purple: '#a78bfa',     // Purple (workspace)
          orange: '#ff8800',     // Orange (warnings)
          red: '#ff3366',        // Red (errors)
          blue: '#3b82f6',       // Blue (info)
        },
        workspace: {
          video: '#ef4444',       // Red for video
          education: '#22c55e',   // Green for education
          faceless: '#ec4899',    // Pink for faceless creator
          media: '#8b5cf6',       // Purple for media
        },
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        ui: ['Rajdhani', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 136, 0.3), 0 0 20px rgba(0, 255, 136, 0.1)',
        'neon-strong': '0 0 15px rgba(0, 255, 136, 0.5), 0 0 30px rgba(0, 255, 136, 0.2)',
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.3), 0 0 20px rgba(0, 240, 255, 0.1)',
        'neon-purple': '0 0 10px rgba(167, 139, 250, 0.3), 0 0 20px rgba(167, 139, 250, 0.1)',
        'inner-glow': 'inset 0 0 20px rgba(0, 255, 136, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
