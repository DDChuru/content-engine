/**
 * Spatial Configuration for D3 + Manim Visualizations
 *
 * Defines canvas sizes, padding, fonts, and layout constraints
 * to ensure consistent, collision-free, engaging visuals.
 */

// ============================================================================
// CANVAS DIMENSIONS
// ============================================================================

export const CANVAS = {
  // Standard 1080p video format (16:9)
  width: 1920,
  height: 1080,

  // Safe zones (avoid edge clipping on YouTube mobile, TV overscan)
  padding: {
    outer: 50,    // Outer padding (all sides) - CRITICAL: keeps content off edges
    inner: 20,    // Inner padding between elements
    group: 40,    // Padding between groups of elements
    step: 15      // Padding between steps (vertical stack)
  },

  // Computed safe area (after outer padding)
  get safeArea() {
    return {
      x: this.padding.outer,
      y: this.padding.outer,
      width: this.width - (this.padding.outer * 2),   // 1920 - 100 = 1820
      height: this.height - (this.padding.outer * 2)  // 1080 - 100 = 980
    };
  }
} as const;

// ============================================================================
// LAYOUT ZONES (Vertical division of canvas)
// ============================================================================

export const ZONES = {
  // Title zone (top)
  title: {
    height: 120,
    padding: { top: 20, bottom: 15 },
    get y() { return CANVAS.padding.outer; },
    get contentHeight() { return this.height - this.padding.top - this.padding.bottom; }
  },

  // Content zone (middle) - This is where D3/Manim lives
  get content() {
    return {
      y: CANVAS.padding.outer + ZONES.title.height,
      height: CANVAS.safeArea.height - ZONES.title.height - ZONES.footer.height,
      width: CANVAS.safeArea.width,

      // Usable area (after padding)
      get usable() {
        return {
          x: CANVAS.padding.outer + CANVAS.padding.inner,
          y: this.y + CANVAS.padding.inner,
          width: this.width - (CANVAS.padding.inner * 2),
          height: this.height - (CANVAS.padding.inner * 2)
        };
      }
    };
  },

  // Footer zone (bottom)
  footer: {
    height: 60,
    padding: { top: 10, bottom: 20 },
    get y() { return CANVAS.height - CANVAS.padding.outer - this.height; }
  }
} as const;

// ============================================================================
// ENGAGING FONTS
// ============================================================================

export const FONTS = {
  // Primary fonts (body text, labels)
  primary: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  // Display fonts (titles, headings) - More engaging!
  display: {
    family: '"Poppins", "Montserrat", "Inter", sans-serif',  // Modern, friendly
    weights: {
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },

  // Handwriting fonts (annotations, highlights) - Adds personality!
  handwriting: {
    family: '"Caveat", "Patrick Hand", cursive',  // Casual, friendly
    weights: {
      regular: 400,
      bold: 700
    }
  },

  // Monospace fonts (code, numbers, equations)
  mono: {
    family: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    weights: {
      regular: 400,
      medium: 500,
      bold: 700
    }
  },

  // Font sizes (responsive to context)
  sizes: {
    // Title zone
    mainTitle: 56,        // Large, attention-grabbing
    subtitle: 36,         // Secondary heading

    // Content zone
    heading: 42,          // Section headings
    body: 32,             // Main content text
    label: 28,            // Node labels, captions
    small: 22,            // Small text, annotations
    tiny: 18,             // Very small (use sparingly)

    // Math/code
    equation: 38,         // Mathematical equations
    code: 28              // Code snippets
  },

  // Line heights (for readability)
  lineHeights: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6
  }
} as const;

// ============================================================================
// LAYOUT MODES
// ============================================================================

export type LayoutMode = 'full' | 'split' | 'stepByStep' | 'grid';

export const LAYOUT_MODES = {
  // Full canvas (D3 takes entire content zone)
  full: {
    d3: {
      width: ZONES.content.usable.width,
      height: ZONES.content.usable.height,
      maxNodes: 10,
      maxLabelChars: 25
    },
    manim: null  // No Manim in full mode
  },

  // Split (D3 | Manim side-by-side)
  split: {
    d3: {
      width: Math.floor(ZONES.content.usable.width / 2) - CANVAS.padding.group,
      height: ZONES.content.usable.height,
      maxNodes: 6,
      maxLabelChars: 18
    },
    manim: {
      width: Math.floor(ZONES.content.usable.width / 2) - CANVAS.padding.group,
      height: ZONES.content.usable.height
    }
  },

  // Step-by-step (vertical stack of steps)
  stepByStep: (steps: number) => ({
    stepHeight: Math.floor(
      (ZONES.content.usable.height - (steps - 1) * CANVAS.padding.step) / steps
    ),
    width: ZONES.content.usable.width,
    maxNodesPerStep: 5,
    maxLabelChars: 20
  }),

  // Grid (2×2 or 3×3 comparison)
  grid: (rows: number, cols: number) => ({
    cellWidth: Math.floor(
      (ZONES.content.usable.width - (cols - 1) * CANVAS.padding.group) / cols
    ),
    cellHeight: Math.floor(
      (ZONES.content.usable.height - (rows - 1) * CANVAS.padding.group) / rows
    ),
    maxNodesPerCell: 3,
    maxLabelChars: 15
  })
} as const;

// ============================================================================
// ELEMENT CONSTRAINTS
// ============================================================================

export const ELEMENT_CONSTRAINTS = {
  // Node sizes (circles, rectangles)
  node: {
    min: 25,              // Minimum size (readable)
    max: 80,              // Maximum size (not overwhelming)
    default: 40,          // Default size
    padding: 25           // Space around node (collision buffer)
  },

  // Link/edge widths
  link: {
    thin: 2,
    normal: 3,
    thick: 5,
    veryThick: 7
  },

  // Label positioning
  label: {
    offsetFromNode: 8,    // Distance from node edge to label start
    maxWidth: 200,        // Maximum label width before wrap/truncate
    minSpacing: 15        // Minimum space between adjacent labels
  },

  // Spacing between elements
  spacing: {
    minimal: 10,          // Absolute minimum (tight layouts)
    comfortable: 20,      // Standard spacing
    generous: 40,         // Extra breathing room
    section: 60           // Between major sections
  }
} as const;

// ============================================================================
// COLOR PALETTE (Blackboard style with engaging colors)
// ============================================================================

export const COLORS = {
  // Background
  background: '#000000',          // Pure black (blackboard)
  backgroundAlt: '#0a0a0a',       // Slightly lighter (subtle variation)

  // Primary colors (chalk on blackboard)
  chalk: {
    white: '#ffffff',             // White chalk (main content)
    blue: '#3b82f6',              // Bright blue (engaging, not dull)
    green: '#10b981',             // Fresh green (success, examples)
    yellow: '#fbbf24',            // Vibrant yellow (highlights, important)
    red: '#ef4444',               // Clear red (warnings, errors)
    purple: '#a78bfa',            // Purple (special emphasis)
    orange: '#f97316',            // Orange (secondary highlights)
    cyan: '#06b6d4'               // Cyan (cool accents)
  },

  // Muted versions (for backgrounds, less emphasis)
  muted: {
    blue: '#1e3a8a',
    green: '#065f46',
    yellow: '#78350f',
    red: '#7f1d1d',
    purple: '#4c1d95',
    gray: '#374151'
  },

  // Gradients (for engaging visuals)
  gradients: {
    blueGreen: ['#3b82f6', '#10b981'],
    purpleBlue: ['#a78bfa', '#3b82f6'],
    orangeRed: ['#f97316', '#ef4444'],
    cyanBlue: ['#06b6d4', '#3b82f6']
  }
} as const;

// ============================================================================
// ANIMATION TIMING
// ============================================================================

export const ANIMATION = {
  // Duration presets
  duration: {
    instant: 0.3,         // Very fast (UI feedback)
    fast: 0.8,            // Quick animations
    normal: 1.5,          // Standard
    slow: 2.5,            // Complex animations
    verySlow: 4.0         // Very detailed sequences
  },

  // Easing functions (CSS timing functions)
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // Frame rate
  fps: 30
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get layout configuration for specific mode
 */
export function getLayoutConfig(mode: LayoutMode, options?: { steps?: number; rows?: number; cols?: number }) {
  switch (mode) {
    case 'full':
      return LAYOUT_MODES.full;

    case 'split':
      return LAYOUT_MODES.split;

    case 'stepByStep':
      return LAYOUT_MODES.stepByStep(options?.steps || 3);

    case 'grid':
      return LAYOUT_MODES.grid(options?.rows || 2, options?.cols || 2);

    default:
      return LAYOUT_MODES.full;
  }
}

/**
 * Calculate safe bounds for element placement
 */
export function getSafeBounds(layoutMode: LayoutMode = 'full') {
  const contentZone = ZONES.content.usable;

  return {
    x: {
      min: contentZone.x + ELEMENT_CONSTRAINTS.node.padding,
      max: contentZone.x + contentZone.width - ELEMENT_CONSTRAINTS.node.padding
    },
    y: {
      min: contentZone.y + ELEMENT_CONSTRAINTS.node.padding,
      max: contentZone.y + contentZone.height - ELEMENT_CONSTRAINTS.node.padding
    }
  };
}

/**
 * Truncate text to fit max length with ellipsis
 */
export function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }
  return text.substring(0, maxChars - 3) + '...';
}

/**
 * Calculate text width (approximate)
 */
export function estimateTextWidth(text: string, fontSize: number, fontWeight: number = 400): number {
  // Rough approximation: character width ≈ fontSize * 0.6 for normal weight
  const weightFactor = fontWeight >= 600 ? 0.65 : 0.6;
  return text.length * fontSize * weightFactor;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION = {
  // Maximum acceptable violations before rejection
  maxWarnings: 5,
  maxErrors: 0,  // Zero tolerance for errors

  // Collision detection sensitivity
  collisionBuffer: 5,  // Extra pixels to consider as collision

  // Performance limits
  maxRenderTime: 30000,  // 30 seconds max render time
  maxFrames: 1000        // Max frames in animation
} as const;

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

export const SPATIAL_CONFIG = {
  CANVAS,
  ZONES,
  FONTS,
  LAYOUT_MODES,
  ELEMENT_CONSTRAINTS,
  COLORS,
  ANIMATION,
  VALIDATION,

  // Helper functions
  getLayoutConfig,
  getSafeBounds,
  truncateText,
  estimateTextWidth,
  clamp
} as const;

export default SPATIAL_CONFIG;
