/**
 * Shared types for Content Creation Workspace
 * Extracted to avoid circular dependencies between components
 */

export interface GeneratedImage {
  id: string;
  url: string;
  label: string;
  tags: string[];
  prompt: string;
  createdAt: string;
  firestoreUrl?: string;
}

export interface ContentOutputType {
  type: 'html-reveal' | 'remotion-video' | 'plain-html' | 'annotation';
  label: string;
  description: string;
}

export type ContentType = 'html-reveal' | 'remotion-video' | 'plain-html' | 'annotation';
