/**
 * Content Generator Service
 * Integrates User Journey Agent and other content generation capabilities
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClaudeService } from './claude.js';
import { uploadToFirebaseStorage, saveToFirestore } from './firebase.js';
import { cloneRepository, getCachedRepoPath } from './repository.js';
import { getProjectConfig } from '../config/projects.js';
import type {
  UserJourneyRequest,
  UserJourneyResult
} from '../agents/user-journey/types.js';
import { UserJourneyAgent } from '../agents/user-journey/index.js';

export interface GenerationRequest {
  type: 'user-manual' | 'sop' | 'lesson' | 'training' | 'thumbnail';
  projectPath?: string;
  repoUrl?: string;
  parameters: any;
  targetProject?: string;
}

export interface GenerationResult {
  success: boolean;
  type: string;
  content?: any;
  html?: string;
  htmlUrl?: string;
  thumbnailUrl?: string;
  firebaseDocId?: string;
  files?: string[];
  metadata?: any;
  error?: string;
}

export class ContentGenerator {
  private geminiKey: string;
  private claudeService: ClaudeService;
  private userJourneyAgent?: UserJourneyAgent;
  private genAI: GoogleGenerativeAI;

  constructor(geminiKey: string, claudeService: ClaudeService) {
    this.geminiKey = geminiKey;
    this.claudeService = claudeService;
    this.genAI = new GoogleGenerativeAI(geminiKey);
  }

  /**
   * Get or create User Journey Agent
   */
  private getUserJourneyAgent(): UserJourneyAgent {
    if (!this.userJourneyAgent) {
      this.userJourneyAgent = new UserJourneyAgent(this.geminiKey);
    }
    return this.userJourneyAgent;
  }

  /**
   * Main generation method that routes to appropriate generator
   */
  async generate(request: GenerationRequest): Promise<GenerationResult> {
    console.log(`Generating ${request.type}...`);

    try {
      let result: GenerationResult;

      switch (request.type) {
        case 'user-manual':
          result = await this.generateUserManual(request);
          break;

        case 'sop':
          result = await this.generateSOP(request);
          break;

        case 'lesson':
          result = await this.generateLesson(request);
          break;

        case 'training':
          result = await this.generateTraining(request);
          break;

        case 'thumbnail':
          result = await this.generateThumbnail(request);
          break;

        default:
          throw new Error(`Unknown generation type: ${request.type}`);
      }

      // Upload HTML to Firebase if targetProject is specified
      if (request.targetProject && result.success && result.html) {
        try {
          const timestamp = Date.now();

          // Upload HTML to Firebase Storage
          const htmlBuffer = Buffer.from(result.html, 'utf-8');
          const htmlUrl = await uploadToFirebaseStorage(
            request.targetProject,
            htmlBuffer,
            `content/${request.type}-${timestamp}.html`,
            'text/html'
          );

          result.htmlUrl = htmlUrl;
          console.log(`✓ HTML uploaded to Firebase Storage: ${htmlUrl}`);

          // Upload thumbnail if present
          if (result.thumbnailUrl) {
            try {
              const fs = await import('fs/promises');
              const thumbnailBuffer = await fs.readFile(result.thumbnailUrl);
              const thumbnailUrl = await uploadToFirebaseStorage(
                request.targetProject,
                thumbnailBuffer,
                `thumbnails/${request.type}-${timestamp}.png`,
                'image/png'
              );
              result.thumbnailUrl = thumbnailUrl;
              console.log(`✓ Thumbnail uploaded to Firebase Storage: ${thumbnailUrl}`);
            } catch (thumbError: any) {
              console.error('Thumbnail upload error:', thumbError);
              // Don't fail if thumbnail upload fails
              result.thumbnailUrl = undefined;
            }
          }

          // Save metadata to Firestore
          const firestoreData: any = {
            type: request.type,
            metadata: result.metadata,
            htmlUrl,
            thumbnailUrl: result.thumbnailUrl,
            createdAt: new Date().toISOString()
          };

          // Add parameters
          if (request.parameters) {
            Object.assign(firestoreData, request.parameters);
          }

          const docId = await saveToFirestore(
            request.targetProject,
            'generated_content',
            firestoreData
          );

          result.firebaseDocId = docId;
          console.log(`✓ Metadata saved to Firestore: ${docId}`);
        } catch (firebaseError: any) {
          console.error('Firebase upload error:', firebaseError);
          // Don't fail the whole generation if Firebase upload fails
        }
      }

      return result;
    } catch (error: any) {
      console.error(`Generation error:`, error);
      return {
        success: false,
        type: request.type,
        error: error.message
      };
    }
  }

  /**
   * Generate user manual using User Journey Agent
   */
  private async generateUserManual(request: GenerationRequest): Promise<GenerationResult> {
    const agent = this.getUserJourneyAgent();

    // Get repository path - either clone from GitHub or use provided local path
    let projectPath = request.projectPath;

    if (!projectPath && request.targetProject) {
      // Get project configuration
      const projectConfig = getProjectConfig(request.targetProject);

      if (projectConfig && projectConfig.repoUrl) {
        console.log(`Cloning repository for ${projectConfig.name}...`);

        // Check cache first
        let repoPath = getCachedRepoPath(projectConfig.repoUrl);

        if (!repoPath) {
          // Clone repository with shallow clone
          repoPath = await cloneRepository(projectConfig.repoUrl, {
            depth: 1,
            branch: projectConfig.branch || 'main'
          });
        }

        projectPath = repoPath;
        console.log(`Using repository at: ${projectPath}`);
      }
    }

    // Fallback to temp directory if no path available
    if (!projectPath) {
      console.warn('No repository path available, using placeholder');
      projectPath = '/tmp/repo';
    }

    // Prepare request for User Journey Agent
    const journeyRequest: UserJourneyRequest = {
      projectPath,
      features: request.parameters.features || [],
      title: request.parameters.title || 'User Manual',
      subtitle: request.parameters.subtitle,
      outputDir: `/tmp/output-${Date.now()}`,
      mode: 'user-manual'
    };

    // Generate using agent
    const result: UserJourneyResult = await agent.generate(journeyRequest);

    // Read the HTML file content for Firebase upload
    let htmlContent: string | undefined;
    try {
      const fs = await import('fs/promises');
      htmlContent = await fs.readFile(result.presentation.htmlPath, 'utf-8');
    } catch (error) {
      console.error('Failed to read HTML file:', error);
    }

    return {
      success: result.success,
      type: 'user-manual',
      content: result,
      html: htmlContent, // Return HTML content, not file path
      thumbnailUrl: result.mockups.paths[0],
      metadata: {
        slideCount: result.presentation.slideCount,
        duration: result.stats.duration,
        estimatedCost: result.stats.estimatedCost,
        repositoryPath: projectPath,
        localPath: result.presentation.htmlPath // Keep local path in metadata
      }
    };
  }

  /**
   * Generate SOP (Standard Operating Procedure)
   */
  private async generateSOP(request: GenerationRequest): Promise<GenerationResult> {
    const { task, category, industry, frequency } = request.parameters;

    // Use Claude to generate SOP content
    const sopContent = await this.claudeService.generateContent(
      'Standard Operating Procedure',
      {
        task,
        category,
        industry,
        frequency,
        format: 'HACCP compliant'
      }
    );

    // Convert to HTML with styling
    const html = this.formatAsHTML(sopContent.content, 'sop');

    return {
      success: true,
      type: 'sop',
      content: sopContent.content,
      html,
      metadata: {
        title: sopContent.title,
        category,
        industry,
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Generate educational lesson
   */
  private async generateLesson(request: GenerationRequest): Promise<GenerationResult> {
    const { topic, syllabus, difficulty, includeExercises } = request.parameters;

    // Use Claude to generate lesson content
    const lessonContent = await this.claudeService.generateContent(
      'Educational Lesson',
      {
        topic,
        syllabus,
        difficulty,
        includeExercises,
        targetAge: '14-16 years',
        format: 'Interactive with examples'
      }
    );

    // Generate visual aids using Gemini if needed
    let visualAids: string[] = [];
    if (request.parameters.includeVisuals) {
      visualAids = await this.generateVisualAids(topic);
    }

    const html = this.formatAsHTML(lessonContent.content, 'lesson');

    return {
      success: true,
      type: 'lesson',
      content: lessonContent.content,
      html,
      files: visualAids,
      metadata: {
        title: lessonContent.title,
        topic,
        syllabus,
        difficulty,
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Generate training material
   */
  private async generateTraining(request: GenerationRequest): Promise<GenerationResult> {
    const { topic, audience, duration, format } = request.parameters;

    const trainingContent = await this.claudeService.generateContent(
      'Training Material',
      {
        topic,
        audience,
        duration,
        format,
        includeAssessment: true
      }
    );

    const html = this.formatAsHTML(trainingContent.content, 'training');

    return {
      success: true,
      type: 'training',
      content: trainingContent.content,
      html,
      metadata: {
        title: trainingContent.title,
        topic,
        audience,
        duration,
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Generate thumbnail image
   */
  private async generateThumbnail(request: GenerationRequest): Promise<GenerationResult> {
    const { title, subtitle, theme, style } = request.parameters;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-image'
      });

      const prompt = `Create a professional thumbnail background image.

      Theme: ${theme || 'professional'}
      Style: ${style || 'modern, clean, corporate'}

      🚫 CRITICAL: NO TEXT in the image
      - NO WORDS, NO LETTERS, NO NUMBERS
      - NO labels, NO captions, NO titles
      - PURE VISUAL ONLY - abstract gradients, shapes, patterns
      - Text (Title: "${title}"${subtitle ? `, Subtitle: "${subtitle}"` : ''}) will be added separately as overlays

      Requirements:
      - Professional gradient background
      - Clean, modern design
      - High contrast base for readability
      - Suitable for business documentation
      - Centered composition with space for text overlay`;

      const result = await model.generateContent(prompt);
      const response = result.response;

      // Extract image data
      const candidates = response.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('No image generated');
      }

      const parts = candidates[0].content.parts;
      const imagePart = parts.find((part: any) => part.inlineData);

      if (!imagePart || !imagePart.inlineData?.data) {
        throw new Error('No image data in response');
      }

      // Convert to buffer
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');

      return {
        success: true,
        type: 'thumbnail',
        content: imageBuffer,
        metadata: {
          title,
          subtitle,
          theme,
          size: imageBuffer.length,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        type: 'thumbnail',
        error: error.message
      };
    }
  }

  /**
   * Generate visual aids for educational content
   */
  private async generateVisualAids(topic: string): Promise<string[]> {
    // Placeholder - would generate diagrams, charts, etc.
    return [];
  }

  /**
   * Format content as HTML
   */
  private formatAsHTML(content: string, type: string): string {
    const styles = this.getStylesForType(type);

    // Convert markdown to HTML (simplified)
    let html = content
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^- (.+)$/gm, '<li>$1</li>');

    // Wrap in HTML structure
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${type.toUpperCase()} Document</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    <div class="content">
      ${html}
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Get CSS styles for document type
   */
  private getStylesForType(type: string): string {
    const baseStyles = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      .content {
        background: white;
        padding: 3rem;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      }
      h1 {
        color: #1a202c;
        margin-bottom: 1.5rem;
        font-size: 2.5rem;
      }
      h2 {
        color: #2d3748;
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-size: 1.875rem;
      }
      h3 {
        color: #4a5568;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        font-size: 1.5rem;
      }
      p {
        margin-bottom: 1rem;
      }
      li {
        margin-bottom: 0.5rem;
      }
    `;

    const typeStyles: { [key: string]: string } = {
      sop: `
        .procedure-step {
          background: #f7fafc;
          padding: 1rem;
          margin: 1rem 0;
          border-left: 4px solid #4299e1;
        }
      `,
      lesson: `
        .example {
          background: #edf2f7;
          padding: 1.5rem;
          margin: 1.5rem 0;
          border-radius: 8px;
        }
        .exercise {
          background: #fef5e7;
          padding: 1.5rem;
          margin: 1.5rem 0;
          border-radius: 8px;
          border: 2px solid #f39c12;
        }
      `,
      training: `
        .key-point {
          background: #e6fffa;
          padding: 1rem;
          margin: 1rem 0;
          border-left: 4px solid #38b2ac;
        }
      `
    };

    return baseStyles + (typeStyles[type] || '');
  }
}

export default ContentGenerator;