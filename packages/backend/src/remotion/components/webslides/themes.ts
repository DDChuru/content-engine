/**
 * WebSlides Theme System
 *
 * Design constants extracted from webslides-demo/sets-demo.html
 * Provides consistent branding across all video compositions
 */

export interface WebSlidesTheme {
  name: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    accent: string;
    highlight: string;
    secondary: string;
  };
  typography: {
    fontFamily: string;
    mathFont: string;
    headingWeight: number;
    titleSize: string;
    subtitleSize: string;
    mathNotationSize: string;
    bodySize: string;
  };
  spacing: {
    padding: string;
    margin: string;
    gap: string;
  };
  effects: {
    borderRadius: string;
    shadow: string;
    transition: string;
  };
}

/**
 * Education Dark Theme (Primary)
 * Based on Cambridge IGCSE Sets demo
 */
export const educationDarkTheme: WebSlidesTheme = {
  name: 'education-dark',
  colors: {
    background: '#000000',
    text: '#ffffff',
    primary: '#1e88e5',        // Blue
    accent: '#4caf50',          // Green
    highlight: '#ffeb3b',       // Yellow
    secondary: '#ff5722'        // Orange
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mathFont: '"Courier New", Courier, monospace',
    headingWeight: 700,
    titleSize: '4rem',          // 64px
    subtitleSize: '1.5rem',     // 24px
    mathNotationSize: '2rem',   // 32px
    bodySize: '1.2rem'          // 19.2px
  },
  spacing: {
    padding: '40px',
    margin: '20px',
    gap: '15px'
  },
  effects: {
    borderRadius: '10px',
    shadow: '0 10px 40px rgba(0,0,0,0.5)',
    transition: 'all 0.3s ease'
  }
};

/**
 * Education Light Theme
 * For presentations in well-lit environments
 */
export const educationLightTheme: WebSlidesTheme = {
  name: 'education-light',
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#1976d2',         // Darker blue for contrast
    accent: '#388e3c',          // Darker green
    highlight: '#f57f17',       // Darker yellow
    secondary: '#d32f2f'        // Darker orange/red
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mathFont: '"Courier New", Courier, monospace',
    headingWeight: 700,
    titleSize: '4rem',
    subtitleSize: '1.5rem',
    mathNotationSize: '2rem',
    bodySize: '1.2rem'
  },
  spacing: {
    padding: '40px',
    margin: '20px',
    gap: '15px'
  },
  effects: {
    borderRadius: '10px',
    shadow: '0 10px 40px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  }
};

/**
 * Marketing Theme (Professional)
 * For corporate/business presentations
 */
export const marketingTheme: WebSlidesTheme = {
  name: 'marketing',
  colors: {
    background: '#1a1a2e',      // Dark navy
    text: '#ffffff',
    primary: '#0f3460',         // Deep blue
    accent: '#16213e',          // Navy blue
    highlight: '#e94560',       // Coral red
    secondary: '#533483'        // Purple
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    mathFont: '"Fira Code", "Courier New", monospace',
    headingWeight: 700,
    titleSize: '3.5rem',
    subtitleSize: '1.3rem',
    mathNotationSize: '1.8rem',
    bodySize: '1.1rem'
  },
  spacing: {
    padding: '50px',
    margin: '25px',
    gap: '20px'
  },
  effects: {
    borderRadius: '8px',
    shadow: '0 20px 60px rgba(0,0,0,0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

/**
 * Documentation Theme (Clean)
 * For technical documentation videos
 */
export const documentationTheme: WebSlidesTheme = {
  name: 'documentation',
  colors: {
    background: '#0d1117',      // GitHub dark
    text: '#c9d1d9',
    primary: '#58a6ff',         // GitHub blue
    accent: '#3fb950',          // GitHub green
    highlight: '#f85149',       // GitHub red
    secondary: '#a371f7'        // GitHub purple
  },
  typography: {
    fontFamily: '"SF Pro Display", system-ui, sans-serif',
    mathFont: '"SF Mono", "Fira Code", monospace',
    headingWeight: 600,
    titleSize: '3rem',
    subtitleSize: '1.2rem',
    mathNotationSize: '1.5rem',
    bodySize: '1rem'
  },
  spacing: {
    padding: '35px',
    margin: '18px',
    gap: '12px'
  },
  effects: {
    borderRadius: '6px',
    shadow: '0 8px 24px rgba(0,0,0,0.4)',
    transition: 'all 0.2s ease'
  }
};

/**
 * All available themes
 */
export const themes = {
  'education-dark': educationDarkTheme,
  'education-light': educationLightTheme,
  'marketing': marketingTheme,
  'documentation': documentationTheme
};

export type ThemeName = keyof typeof themes;

/**
 * Get theme by name
 */
export function getTheme(name: ThemeName): WebSlidesTheme {
  return themes[name];
}

/**
 * Default theme
 */
export const defaultTheme = educationDarkTheme;

/**
 * Helper: Convert CSS color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  // Simple rgba conversion for hex colors
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

/**
 * Component style helpers
 */
export function getSlideContainerStyle(theme: WebSlidesTheme): React.CSSProperties {
  return {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.bodySize
  };
}

export function getTitleStyle(theme: WebSlidesTheme): React.CSSProperties {
  return {
    fontSize: theme.typography.titleSize,
    fontWeight: theme.typography.headingWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.margin
  };
}

export function getSubtitleStyle(theme: WebSlidesTheme): React.CSSProperties {
  return {
    fontSize: theme.typography.subtitleSize,
    color: theme.colors.highlight,
    marginTop: theme.spacing.margin
  };
}

export function getMathNotationStyle(theme: WebSlidesTheme): React.CSSProperties {
  return {
    fontSize: theme.typography.mathNotationSize,
    fontFamily: theme.typography.mathFont,
    color: theme.colors.highlight,
    margin: theme.spacing.gap
  };
}
