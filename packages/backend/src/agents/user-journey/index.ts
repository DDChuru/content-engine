/**
 * User Journey Agent - Cloud Version
 * Simplified for cloud deployment with GitHub integration
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import { simpleGit, SimpleGit } from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface UserJourneyRequest {
  projectPath?: string;  // Local path if cloned
  repoUrl?: string;      // GitHub URL
  features: string[];
  title: string;
  subtitle?: string;
  outputDir: string;
  mode?: 'user-manual' | 'preview' | 'none';
}

export interface UserJourneyResult {
  success: boolean;
  presentation: {
    htmlPath: string;
    slideCount: number;
  };
  analysis: any;
  mockups: {
    total: number;
    paths: string[];
  };
  stats: {
    duration: number;
    estimatedCost: number;
  };
}

export class UserJourneyAgent {
  private genAI: GoogleGenerativeAI;
  private github?: Octokit;
  private git: SimpleGit;

  constructor(geminiApiKey: string, githubToken?: string) {
    this.genAI = new GoogleGenerativeAI(geminiApiKey);
    if (githubToken) {
      this.github = new Octokit({ auth: githubToken });
    }
    this.git = simpleGit();
  }

  /**
   * Generate user journey presentation
   */
  async generate(request: UserJourneyRequest): Promise<UserJourneyResult> {
    const startTime = Date.now();

    // Clone repo if needed
    let projectPath = request.projectPath;
    if (!projectPath && request.repoUrl) {
      projectPath = await this.cloneRepository(request.repoUrl);
    }

    if (!projectPath) {
      throw new Error('No project path or repo URL provided');
    }

    // Analyze codebase
    const analysis = await this.analyzeProject(projectPath, request.features);

    // Generate based on mode
    let html = '';
    let thumbnailPath = '';
    const mockupPaths: string[] = [];

    if (request.mode === 'user-manual') {
      // Generate thumbnail
      const thumbnail = await this.generateThumbnail({
        title: request.title,
        subtitle: request.subtitle || 'User Manual'
      });

      thumbnailPath = path.join(request.outputDir, 'thumbnail.png');
      await fs.mkdir(request.outputDir, { recursive: true });
      await fs.writeFile(thumbnailPath, thumbnail);
      mockupPaths.push(thumbnailPath);

      // Generate HTML presentation
      html = await this.generateUserManualHTML(analysis, request.title, request.subtitle);
    } else {
      // Simple presentation
      html = await this.generateSimpleHTML(analysis, request.title);
    }

    // Save HTML
    const htmlPath = path.join(request.outputDir, 'presentation.html');
    await fs.writeFile(htmlPath, html);

    const duration = (Date.now() - startTime) / 1000;

    return {
      success: true,
      presentation: {
        htmlPath,
        slideCount: this.countSlides(html)
      },
      analysis,
      mockups: {
        total: mockupPaths.length,
        paths: mockupPaths
      },
      stats: {
        duration,
        estimatedCost: mockupPaths.length * 0.05 // $0.05 per image
      }
    };
  }

  /**
   * Clone GitHub repository
   */
  private async cloneRepository(repoUrl: string): Promise<string> {
    const tempDir = `/tmp/repo-${Date.now()}`;
    await this.git.clone(repoUrl, tempDir, ['--depth', '1']);
    return tempDir;
  }

  /**
   * Analyze project structure
   */
  private async analyzeProject(projectPath: string, features: string[]): Promise<any> {
    // Simple analysis - count files and directories
    const analysis = {
      features: [],
      summary: {
        totalComponents: 0,
        totalRoutes: 0,
        totalServices: 0
      }
    };

    for (const feature of features) {
      const featureAnalysis = {
        name: feature,
        components: [],
        routes: [],
        services: []
      };

      // Find relevant files (simplified)
      try {
        const srcPath = path.join(projectPath, 'src');
        const files = await this.findFiles(srcPath, feature.toLowerCase());

        featureAnalysis.components = files.filter(f => f.includes('component') || f.endsWith('.tsx'));
        featureAnalysis.routes = files.filter(f => f.includes('route') || f.includes('page'));
        featureAnalysis.services = files.filter(f => f.includes('service') || f.includes('api'));

        analysis.summary.totalComponents += featureAnalysis.components.length;
        analysis.summary.totalRoutes += featureAnalysis.routes.length;
        analysis.summary.totalServices += featureAnalysis.services.length;
      } catch (error) {
        console.error(`Error analyzing ${feature}:`, error);
      }

      analysis.features.push(featureAnalysis);
    }

    return analysis;
  }

  /**
   * Find files matching a pattern
   */
  private async findFiles(dir: string, pattern: string): Promise<string[]> {
    const files: string[] = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subFiles = await this.findFiles(fullPath, pattern);
          files.push(...subFiles);
        } else if (entry.isFile() && entry.name.toLowerCase().includes(pattern)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist
    }

    return files;
  }

  /**
   * Generate thumbnail using Gemini
   */
  private async generateThumbnail(spec: { title: string; subtitle: string }): Promise<Buffer> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image'
    });

    const prompt = `Create a professional thumbnail for a user manual:
    Title: ${spec.title}
    Subtitle: ${spec.subtitle}
    Style: Modern, professional, gradient background (blue to purple)
    Requirements: Clean design, no text overlays`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No thumbnail generated');
    }

    const parts = candidates[0].content.parts;
    const imagePart = parts.find((part: any) => part.inlineData);

    if (!imagePart || !imagePart.inlineData?.data) {
      // Return a placeholder image if generation fails
      return Buffer.from('');
    }

    return Buffer.from(imagePart.inlineData.data, 'base64');
  }

  /**
   * Generate user manual HTML
   */
  private generateUserManualHTML(analysis: any, title: string, subtitle?: string): string {
    const features = analysis.features.map((f: any) => `
      <div class="feature-card">
        <h3>${f.name}</h3>
        <p>${f.components.length} components, ${f.routes.length} routes</p>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
    .header {
      text-align: center;
      color: white;
      padding: 3rem 0;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .subtitle {
      font-size: 1.5rem;
      opacity: 0.9;
    }
    .content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-top: 2rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .feature-card {
      background: #f7fafc;
      padding: 1.5rem;
      margin: 1rem 0;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 2rem 0;
      padding: 2rem;
      background: #edf2f7;
      border-radius: 8px;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }
    .stat-label {
      color: #718096;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
    </div>

    <div class="content">
      <h2>Platform Overview</h2>

      <div class="stats">
        <div class="stat">
          <div class="stat-value">${analysis.summary.totalComponents}</div>
          <div class="stat-label">Components</div>
        </div>
        <div class="stat">
          <div class="stat-value">${analysis.summary.totalRoutes}</div>
          <div class="stat-label">Routes</div>
        </div>
        <div class="stat">
          <div class="stat-value">${analysis.summary.totalServices}</div>
          <div class="stat-label">Services</div>
        </div>
      </div>

      <h2>Features</h2>
      ${features}
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generate simple HTML presentation
   */
  private generateSimpleHTML(analysis: any, title: string): string {
    return this.generateUserManualHTML(analysis, title);
  }

  /**
   * Count slides in HTML
   */
  private countSlides(html: string): number {
    // Count section tags or estimate based on content
    const sections = (html.match(/<section/g) || []).length;
    return sections || 1;
  }
}

export default UserJourneyAgent;