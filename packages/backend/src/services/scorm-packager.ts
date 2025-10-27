/**
 * SCORM Packager Service
 *
 * Creates SCORM 1.2 and 2004 compliant packages for LMS deployment.
 * Bundles: Videos + Quiz + Metadata → .zip file
 *
 * Final step of the 3-layer content generation system.
 */

import * as path from 'path';
import { promises as fs } from 'fs';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

// ============================================================================
// Interfaces
// ============================================================================

export interface SCORMManifest {
  identifier: string;
  title: string;
  description: string;
  version: '1.2' | '2004';
  organization: SCORMOrganization;
}

export interface SCORMOrganization {
  identifier: string;
  title: string;
  items: SCORMItem[];
}

export interface SCORMItem {
  identifier: string;
  title: string;
  identifierref: string;
  type: 'lesson' | 'example' | 'quiz';
}

export interface SCORMResource {
  identifier: string;
  type: 'webcontent';
  href: string;
  files: string[];
}

export interface SCORMPackageOptions {
  topicId: string;
  topicTitle: string;
  topicCode: string;
  level: 'Core' | 'Extended';

  // Content paths
  mainVideoPath?: string;
  exampleVideoPaths?: string[];
  quizHtmlPath?: string;

  // Output
  outputPath: string;
  version?: '1.2' | '2004';
}

export interface SCORMPackageResult {
  success: boolean;
  packagePath?: string;
  size?: number;  // bytes
  error?: string;
}

// ============================================================================
// SCORM Packager Service
// ============================================================================

export class SCORMPackager {
  /**
   * Create SCORM package from content
   */
  async createPackage(options: SCORMPackageOptions): Promise<SCORMPackageResult> {
    console.log(`\n[SCORMPackager] Creating SCORM package for: ${options.topicTitle}`);
    console.log(`  Version: SCORM ${options.version || '1.2'}`);

    try {
      // Step 1: Create temporary directory structure
      const tempDir = await this.createTempDirectory(options);

      // Step 2: Copy content files
      await this.copyContentFiles(tempDir, options);

      // Step 3: Generate SCORM manifest
      await this.generateManifest(tempDir, options);

      // Step 4: Create index.html (main entry point)
      await this.createIndexHTML(tempDir, options);

      // Step 5: Add SCORM API wrapper
      await this.addSCORMDriver(tempDir, options.version || '1.2');

      // Step 6: Create ZIP package
      const packagePath = await this.createZip(tempDir, options.outputPath);

      // Step 7: Get package size
      const stats = await fs.stat(packagePath);
      const size = stats.size;

      // Step 8: Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });

      console.log(`  ✓ SCORM package created: ${packagePath}`);
      console.log(`  ✓ Package size: ${(size / 1024 / 1024).toFixed(2)} MB`);

      return {
        success: true,
        packagePath,
        size
      };

    } catch (error: any) {
      console.error('[SCORMPackager] Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create temporary directory structure
   */
  private async createTempDirectory(options: SCORMPackageOptions): Promise<string> {
    const tempDir = path.join('/tmp', `scorm-${options.topicId}-${Date.now()}`);

    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(path.join(tempDir, 'content'), { recursive: true });
    await fs.mkdir(path.join(tempDir, 'content', 'videos'), { recursive: true });

    return tempDir;
  }

  /**
   * Copy content files to package
   */
  private async copyContentFiles(tempDir: string, options: SCORMPackageOptions): Promise<void> {
    // Copy main video (if exists)
    if (options.mainVideoPath) {
      try {
        await fs.copyFile(
          options.mainVideoPath,
          path.join(tempDir, 'content', 'videos', 'main-lesson.mp4')
        );
      } catch (err) {
        console.warn('  ⚠ Main video not found (will use placeholder)');
      }
    }

    // Copy example videos (if exist)
    if (options.exampleVideoPaths && options.exampleVideoPaths.length > 0) {
      for (let i = 0; i < options.exampleVideoPaths.length; i++) {
        try {
          await fs.copyFile(
            options.exampleVideoPaths[i],
            path.join(tempDir, 'content', 'videos', `example-${i + 1}.mp4`)
          );
        } catch (err) {
          console.warn(`  ⚠ Example video ${i + 1} not found`);
        }
      }
    }

    // Copy quiz HTML (if exists)
    if (options.quizHtmlPath) {
      try {
        await fs.copyFile(
          options.quizHtmlPath,
          path.join(tempDir, 'content', 'quiz.html')
        );
      } catch (err) {
        console.warn('  ⚠ Quiz HTML not found');
      }
    }
  }

  /**
   * Generate imsmanifest.xml
   */
  private async generateManifest(tempDir: string, options: SCORMPackageOptions): Promise<void> {
    const manifestXML = this.generateManifestXML(options);
    await fs.writeFile(path.join(tempDir, 'imsmanifest.xml'), manifestXML);
  }

  /**
   * Generate SCORM manifest XML
   */
  private generateManifestXML(options: SCORMPackageOptions): string {
    const version = options.version || '1.2';
    const identifier = `topic-${options.topicId}`;

    if (version === '1.2') {
      return this.generateSCORM12Manifest(options, identifier);
    } else {
      return this.generateSCORM2004Manifest(options, identifier);
    }
  }

  /**
   * Generate SCORM 1.2 manifest
   */
  private generateSCORM12Manifest(options: SCORMPackageOptions, identifier: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${identifier}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>

  <organizations default="org-${identifier}">
    <organization identifier="org-${identifier}">
      <title>${options.topicTitle} (${options.topicCode})</title>

      <item identifier="item-main" identifierref="resource-main">
        <title>Main Lesson</title>
      </item>

      <item identifier="item-examples" identifierref="resource-examples">
        <title>Worked Examples</title>
      </item>

      <item identifier="item-quiz" identifierref="resource-quiz">
        <title>Practice Quiz</title>
      </item>
    </organization>
  </organizations>

  <resources>
    <resource identifier="resource-main" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="content/videos/main-lesson.mp4"/>
      <file href="scormdriver.js"/>
    </resource>

    <resource identifier="resource-examples" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      ${(options.exampleVideoPaths || []).map((_, i) =>
        `<file href="content/videos/example-${i + 1}.mp4"/>`
      ).join('\n      ')}
    </resource>

    <resource identifier="resource-quiz" type="webcontent" adlcp:scormtype="sco" href="content/quiz.html">
      <file href="content/quiz.html"/>
      <file href="scormdriver.js"/>
    </resource>
  </resources>
</manifest>`;
  }

  /**
   * Generate SCORM 2004 manifest
   */
  private generateSCORM2004Manifest(options: SCORMPackageOptions, identifier: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${identifier}" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>

  <organizations default="org-${identifier}">
    <organization identifier="org-${identifier}">
      <title>${options.topicTitle} (${options.topicCode})</title>

      <item identifier="item-main" identifierref="resource-main">
        <title>Main Lesson</title>
      </item>

      <item identifier="item-examples" identifierref="resource-examples">
        <title>Worked Examples</title>
      </item>

      <item identifier="item-quiz" identifierref="resource-quiz">
        <title>Practice Quiz</title>
      </item>
    </organization>
  </organizations>

  <resources>
    <resource identifier="resource-main" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
      <file href="content/videos/main-lesson.mp4"/>
      <file href="scormdriver.js"/>
    </resource>

    <resource identifier="resource-examples" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
      ${(options.exampleVideoPaths || []).map((_, i) =>
        `<file href="content/videos/example-${i + 1}.mp4"/>`
      ).join('\n      ')}
    </resource>

    <resource identifier="resource-quiz" type="webcontent" adlcp:scormType="sco" href="content/quiz.html">
      <file href="content/quiz.html"/>
      <file href="scormdriver.js"/>
    </resource>
  </resources>
</manifest>`;
  }

  /**
   * Create main index.html entry point
   */
  private async createIndexHTML(tempDir: string, options: SCORMPackageOptions): Promise<void> {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.topicTitle}</title>
  <script src="scormdriver.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #667eea;
      margin-bottom: 10px;
    }
    .meta {
      color: #666;
      margin-bottom: 30px;
    }
    video {
      width: 100%;
      max-width: 900px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .nav-buttons {
      margin-top: 30px;
      display: flex;
      gap: 15px;
    }
    .btn {
      padding: 12px 25px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${options.topicTitle}</h1>
    <div class="meta">
      <strong>Code:</strong> ${options.topicCode} |
      <strong>Level:</strong> ${options.level}
    </div>

    <video controls autoplay>
      <source src="content/videos/main-lesson.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <div class="nav-buttons">
      <a href="content/quiz.html" class="btn">Take Quiz →</a>
    </div>
  </div>

  <script>
    // Initialize SCORM
    window.addEventListener('load', function() {
      if (typeof scormInit === 'function') {
        scormInit();
      }
    });

    // Track video completion
    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('ended', function() {
        if (typeof scormSetComplete === 'function') {
          scormSetComplete();
        }
      });
    }
  </script>
</body>
</html>`;

    await fs.writeFile(path.join(tempDir, 'index.html'), html);
  }

  /**
   * Add SCORM API wrapper (scormdriver.js)
   */
  private async addSCORMDriver(tempDir: string, version: '1.2' | '2004'): Promise<void> {
    const scormDriver = version === '1.2'
      ? this.getSCORM12Driver()
      : this.getSCORM2004Driver();

    await fs.writeFile(path.join(tempDir, 'scormdriver.js'), scormDriver);
  }

  /**
   * Get SCORM 1.2 API wrapper
   */
  private getSCORM12Driver(): string {
    return `// SCORM 1.2 API Wrapper
var scormAPI = null;

function findSCORMAPI(win) {
  var attempts = 0;
  var maxAttempts = 500;

  while (!win.API && win.parent && win.parent != win && attempts < maxAttempts) {
    attempts++;
    win = win.parent;
  }

  return win.API || null;
}

function scormInit() {
  scormAPI = findSCORMAPI(window);

  if (scormAPI) {
    scormAPI.LMSInitialize('');
    scormAPI.LMSSetValue('cmi.core.lesson_status', 'incomplete');
    console.log('[SCORM] Initialized');
  } else {
    console.warn('[SCORM] API not found (running standalone)');
  }
}

function scormSetComplete() {
  if (scormAPI) {
    scormAPI.LMSSetValue('cmi.core.lesson_status', 'completed');
    scormAPI.LMSSetValue('cmi.core.score.raw', '100');
    scormAPI.LMSCommit('');
    console.log('[SCORM] Lesson marked as complete');
  }
}

function scormSetScore(score) {
  if (scormAPI) {
    scormAPI.LMSSetValue('cmi.core.score.raw', score.toString());
    scormAPI.LMSCommit('');
    console.log('[SCORM] Score set:', score);
  }
}

function scormFinish() {
  if (scormAPI) {
    scormAPI.LMSFinish('');
    console.log('[SCORM] Finished');
  }
}

window.addEventListener('beforeunload', scormFinish);
`;
  }

  /**
   * Get SCORM 2004 API wrapper
   */
  private getSCORM2004Driver(): string {
    return `// SCORM 2004 API Wrapper
var scormAPI = null;

function findSCORMAPI(win) {
  var attempts = 0;
  var maxAttempts = 500;

  while (!win.API_1484_11 && win.parent && win.parent != win && attempts < maxAttempts) {
    attempts++;
    win = win.parent;
  }

  return win.API_1484_11 || null;
}

function scormInit() {
  scormAPI = findSCORMAPI(window);

  if (scormAPI) {
    scormAPI.Initialize('');
    scormAPI.SetValue('cmi.completion_status', 'incomplete');
    console.log('[SCORM 2004] Initialized');
  } else {
    console.warn('[SCORM 2004] API not found (running standalone)');
  }
}

function scormSetComplete() {
  if (scormAPI) {
    scormAPI.SetValue('cmi.completion_status', 'completed');
    scormAPI.SetValue('cmi.success_status', 'passed');
    scormAPI.SetValue('cmi.score.scaled', '1');
    scormAPI.Commit('');
    console.log('[SCORM 2004] Lesson marked as complete');
  }
}

function scormSetScore(score) {
  if (scormAPI) {
    var scaledScore = (score / 100).toFixed(2);
    scormAPI.SetValue('cmi.score.scaled', scaledScore);
    scormAPI.Commit('');
    console.log('[SCORM 2004] Score set:', score);
  }
}

function scormFinish() {
  if (scormAPI) {
    scormAPI.Terminate('');
    console.log('[SCORM 2004] Finished');
  }
}

window.addEventListener('beforeunload', scormFinish);
`;
  }

  /**
   * Create ZIP package
   */
  private async createZip(sourceDir: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        resolve(outputPath);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
}
