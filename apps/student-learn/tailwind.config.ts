import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'var(--paper)',
          raised: 'var(--paper-raised)',
        },
        'grid-line': 'var(--grid-line)',
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          pressed: 'var(--accent-pressed)',
        },
        secure: 'var(--secure)',
        developing: 'var(--developing)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      keyframes: {
        'chip-in': {
          from: { opacity: '0', transform: 'translateY(6px) scale(0.97)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'chip-in': 'chip-in 200ms cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
