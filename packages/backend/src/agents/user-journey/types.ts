/**
 * Type definitions for User Journey Agent
 */

export interface UserJourneyRequest {
  // Required
  projectPath?: string;   // Local path to project
  repoUrl?: string;       // GitHub repository URL
  features: string[];     // Features to analyze
  title: string;          // Manual title
  outputDir: string;      // Output directory

  // Optional
  subtitle?: string;      // Manual subtitle
  author?: string;        // Author name
  generateMockups?: boolean; // Generate image mockups
  mockupsPerFeature?: number; // Number of mockups per feature

  // Mode
  mode?: 'mockup' | 'preview' | 'user-manual' | 'none';
  states?: string[];      // UI states for preview mode
}

export interface UserJourneyResult {
  success: boolean;
  presentation: {
    htmlPath: string;
    slideCount: number;
  };
  analysis: ProjectAnalysis;
  mockups: {
    total: number;
    paths: string[];
  };
  stats: {
    duration: number;    // seconds
    estimatedCost: number; // USD
  };
}

export interface ProjectAnalysis {
  features: FeatureAnalysis[];
  summary: {
    totalComponents: number;
    totalRoutes: number;
    totalServices: number;
  };
}

export interface FeatureAnalysis {
  name: string;
  components: string[];
  routes: string[];
  services: string[];
}

export interface ThumbnailSpec {
  title: string;
  subtitle?: string;
  theme?: 'professional' | 'modern' | 'corporate' | 'creative';
  primaryColor?: string;
  secondaryColor?: string;
}