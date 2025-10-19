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
        description: '',
        components: [],
        routes: [],
        services: [],
        workflows: [],
        dataModels: []
      };

      // Find relevant files
      try {
        let files: string[] = [];
        const srcPath = path.join(projectPath, 'src');
        const appPath = path.join(projectPath, 'app');

        // Try src directory first
        try {
          files = await this.findFiles(srcPath, feature.toLowerCase());
        } catch (e) {
          // src doesn't exist, that's ok
        }

        // Try app directory if src had no results
        if (files.length === 0) {
          try {
            files = await this.findFiles(appPath, feature.toLowerCase());
          } catch (e) {
            // app doesn't exist either
          }
        }

        console.log(`[${feature}] Found ${files.length} files`);

        // Categorize files
        const componentFiles = files.filter(f => f.includes('component') || f.endsWith('.tsx'));
        const routeFiles = files.filter(f => f.includes('route') || f.includes('page'));
        const serviceFiles = files.filter(f => f.includes('service') || f.includes('api'));

        // Analyze key files by reading their content
        const keyFile = routeFiles[0] || componentFiles[0];
        if (keyFile) {
          const analysis = await this.analyzeFeatureFile(keyFile);
          featureAnalysis.description = analysis.description;
          featureAnalysis.workflows = analysis.workflows;
          featureAnalysis.dataModels = analysis.dataModels;
        }

        featureAnalysis.components = componentFiles.map(f => path.basename(f));
        featureAnalysis.routes = routeFiles.map(f => path.basename(f));
        featureAnalysis.services = serviceFiles.map(f => path.basename(f));

        console.log(`[${feature}] Analyzed: ${featureAnalysis.components.length} components, ${featureAnalysis.routes.length} routes, ${featureAnalysis.services.length} services`);

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
   * Analyze a feature file to extract meaningful information
   */
  private async analyzeFeatureFile(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const fileName = path.basename(filePath);
      const dirPath = path.dirname(filePath);

      // Extract imports to understand dependencies
      const importMatches = content.match(/import .+ from ['"](.+)['"]/g) || [];
      const services = importMatches
        .filter(imp => imp.includes('Service'))
        .map(imp => {
          const match = imp.match(/import \{(.+)\} from/);
          return match?.[1]?.split(',').map(s => s.trim()).filter(s => s.includes('Service'));
        })
        .flat()
        .filter(Boolean);

      // Extract types from imports
      const typeImports = importMatches
        .filter(imp => imp.includes('types') || imp.includes('Type'))
        .map(imp => {
          const match = imp.match(/import \{(.+)\} from/);
          return match?.[1]?.split(',').map(s => s.trim());
        })
        .flat()
        .filter(Boolean);

      // Extract local interface/type definitions
      const localTypes = (content.match(/interface (\w+)|type (\w+) =/g) || [])
        .map(t => t.replace(/interface |type |=/g, '').trim());

      // Combine all data models
      const dataModels = [...new Set([...typeImports, ...localTypes])].slice(0, 8);

      // Extract useState to understand state management
      const stateMatches = content.match(/useState<(\w+)>/g) || [];
      const stateTypes = stateMatches
        .map(s => s.match(/useState<(\w+)>/)?.[1])
        .filter(Boolean);

      // Extract main functions (CRUD operations, handlers)
      const functionMatches = content.match(/const (\w+) = async|function (\w+)|const handle(\w+) =/g) || [];
      const workflows = [...new Set(functionMatches.map(w =>
        w.replace(/const |= async|function |=/g, '').trim()
      ))].slice(0, 8);

      // Try to read related service files for deeper analysis
      let servicePurpose = '';
      if (services.length > 0) {
        const serviceFile = await this.findServiceFile(dirPath, services[0]);
        if (serviceFile) {
          servicePurpose = await this.analyzeServiceFile(serviceFile);
        }
      }

      // Generate rich description
      let description = `${fileName.replace(/page\.tsx|\.tsx/g, '')} - `;

      if (servicePurpose) {
        description += servicePurpose;
      } else if (services.length > 0) {
        description += `Manages data through ${services.join(', ')}`;
      } else if (stateTypes.length > 0) {
        description += `Manages ${stateTypes.join(', ')} state`;
      } else {
        description += 'Feature component with user interface';
      }

      return {
        description,
        workflows,
        dataModels,
        services: services.slice(0, 5)
      };
    } catch (error) {
      console.error('Error analyzing feature file:', error);
      return {
        description: 'Feature component',
        workflows: [],
        dataModels: [],
        services: []
      };
    }
  }

  /**
   * Find service file in the project
   */
  private async findServiceFile(startDir: string, serviceName: string): Promise<string | null> {
    try {
      // Common service locations
      const possiblePaths = [
        path.join(startDir, `${serviceName}.ts`),
        path.join(startDir, `${serviceName}.tsx`),
        path.join(startDir, '../lib', `${serviceName}.ts`),
        path.join(startDir, '../../lib', `${serviceName}.ts`),
        path.join(startDir, '../../../lib/firebase', `${serviceName}.ts`),
        path.join(startDir, '../services', `${serviceName}.ts`)
      ];

      for (const filePath of possiblePaths) {
        try {
          await fs.access(filePath);
          return filePath;
        } catch {
          continue;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Analyze service file to understand its purpose
   */
  private async analyzeServiceFile(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // Extract class/export name and its methods
      const classMatch = content.match(/export class (\w+)/);
      const className = classMatch?.[1] || 'Service';

      // Extract public methods
      const methods = (content.match(/async (\w+)\(|(\w+)\(/g) || [])
        .map(m => m.replace(/async |[(]/g, '').trim())
        .filter(m => !m.startsWith('_')) // Exclude private methods
        .slice(0, 5);

      if (methods.length > 0) {
        const operations = methods.join(', ');
        return `Provides operations: ${operations}`;
      }

      return `Handles data operations via ${className}`;
    } catch {
      return '';
    }
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
        } else if (entry.isFile()) {
          // Check if the full path contains the pattern (not just filename)
          // This catches files inside feature directories like app/companies/[id]/contracts/page.tsx
          if (fullPath.toLowerCase().includes(pattern)) {
            files.push(fullPath);
          }
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
        <p class="feature-description">${f.description || 'Feature component'}</p>

        ${f.dataModels && f.dataModels.length > 0 ? `
          <div class="feature-section">
            <h4>Data Models</h4>
            <ul class="compact-list">
              ${f.dataModels.map((m: string) => `<li><code>${m}</code></li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${f.workflows && f.workflows.length > 0 ? `
          <div class="feature-section">
            <h4>Key Functions</h4>
            <ul class="compact-list">
              ${f.workflows.map((w: string) => `<li><code>${w}()</code></li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="feature-stats">
          <span class="stat-badge">${f.components.length} components</span>
          <span class="stat-badge">${f.routes.length} routes</span>
          ${f.services.length > 0 ? `<span class="stat-badge">${f.services.length} services</span>` : ''}
        </div>
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
    .feature-description {
      color: #4a5568;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }
    .feature-section {
      margin: 1rem 0;
    }
    .feature-section h4 {
      color: #2d3748;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    .compact-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .compact-list li {
      padding: 0.25rem 0;
      color: #4a5568;
      font-size: 0.9rem;
    }
    .compact-list code {
      background: #edf2f7;
      padding: 0.125rem 0.5rem;
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.85rem;
      color: #667eea;
    }
    .feature-stats {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .stat-badge {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
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