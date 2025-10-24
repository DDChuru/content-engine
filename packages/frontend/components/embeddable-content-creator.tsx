'use client';

import React from 'react';
import ContentCreationWorkspace from './content-creation-workspace';

interface EmbeddableContentCreatorProps {
  /**
   * Workflow context - helps customize the experience for specific use cases
   */
  context?: 'course' | 'standalone' | 'chapter' | 'thumbnail' | 'general';

  /**
   * Pre-selected content type
   */
  defaultContentType?: 'html-reveal' | 'remotion-video' | 'plain-html' | 'annotation';

  /**
   * Callback when content is created successfully
   */
  onContentCreated?: (content: {
    type: string;
    url?: string;
    content?: string;
  }) => void;

  /**
   * Whether to show the full workspace or a simplified version
   */
  simplified?: boolean;

  /**
   * Custom height for the component
   */
  height?: string;
}

/**
 * Embeddable Content Creator
 *
 * This component can be embedded in various workflows such as:
 * - Course creation (thumbnails, chapter content)
 * - Standalone content generation
 * - Tutorial/lesson creation
 * - Marketing material generation
 *
 * Example usage:
 *
 * ```tsx
 * // In a course creator
 * <EmbeddableContentCreator
 *   context="course"
 *   defaultContentType="html-reveal"
 *   onContentCreated={(content) => {
 *     // Handle the created content
 *     saveToCourse(content);
 *   }}
 * />
 *
 * // For thumbnail generation
 * <EmbeddableContentCreator
 *   context="thumbnail"
 *   simplified={true}
 *   height="400px"
 * />
 * ```
 */
export default function EmbeddableContentCreator({
  context = 'general',
  defaultContentType,
  onContentCreated,
  simplified = false,
  height = '100vh'
}: EmbeddableContentCreatorProps) {

  // Context-specific prompts and guidance
  const contextMessages = {
    course: 'Create course content with images',
    chapter: 'Generate chapter content',
    thumbnail: 'Design a thumbnail image',
    standalone: 'Create standalone content',
    general: 'Generate content with AI'
  };

  return (
    <div style={{ height }} className="relative">
      {/* Context indicator for specific workflows */}
      {context !== 'general' && !simplified && (
        <div className="absolute top-4 right-4 z-10 px-4 py-2 bg-blue-500/90 backdrop-blur-sm rounded-lg text-white text-sm font-medium shadow-lg">
          {contextMessages[context]}
        </div>
      )}

      <ContentCreationWorkspace />
    </div>
  );
}
