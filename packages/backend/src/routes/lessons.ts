/**
 * Lessons Routes
 * API for listing and accessing generated lessons
 */

import express, { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router: Router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths to lesson storage locations
const PATHS = {
  manimOutput: path.resolve(__dirname, '../../src/manim/output'),
  educationVideos: path.resolve(__dirname, '../../output/education/videos'),
  backendVideos: path.resolve(__dirname, '../../output/videos'),
  htmlLessons: path.resolve(__dirname, '../../../../output'),
};

// Complete scene structure for Sets Lesson (from SetsLesson.tsx)
// This includes BOTH intro slides AND Manim content with accurate timings
const SETS_LESSON_COMPLETE_SCENES = [
  // PART 1: Introduction slides (130 seconds total)
  { scene_id: 'branding', title: 'Branding Intro', duration: 10, type: 'intro' },
  { scene_id: 'topic_title', title: 'Topic Title', duration: 15, type: 'intro' },
  { scene_id: 'objectives', title: 'Learning Objectives', duration: 45, type: 'intro' },
  { scene_id: 'prerequisites', title: 'Prerequisites', duration: 30, type: 'intro' },
  { scene_id: 'roadmap', title: 'Lesson Roadmap', duration: 30, type: 'intro' },
  // PART 2: Manim scenes (65 seconds total)
  { scene_id: 'step1', title: 'What is a Set?', duration: 8, type: 'manim' },
  { scene_id: 'step2', title: 'Set Notation', duration: 7, type: 'manim' },
  { scene_id: 'step3', title: 'Venn Diagram Introduction', duration: 4, type: 'manim' },
  { scene_id: 'step4', title: 'Visualizing Set A', duration: 13, type: 'manim' },
  { scene_id: 'step5', title: 'Two Sets Overlap', duration: 18, type: 'manim' },
  { scene_id: 'step7', title: 'Union Concept', duration: 14, type: 'manim' },
  { scene_id: 'step9', title: 'Universal Set Introduction', duration: 16, type: 'manim' },
  { scene_id: 'step10', title: 'Universal Set Example', duration: 12, type: 'manim' },
];

interface Lesson {
  id: string;
  title: string;
  type: 'manim' | 'video' | 'html' | 'streamlined';
  path: string;
  filename: string;
  duration?: number;
  scenes?: number;
  size: number;
  createdAt: string;
  metadata?: any;
}

/**
 * GET /api/lessons
 * List all available lessons
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const lessons: Lesson[] = [];

    // 1. Check Manim output (main lessons)
    try {
      const manimMetadataPath = path.join(PATHS.manimOutput, 'manim/lesson_metadata.json');
      const metadataExists = await fs.access(manimMetadataPath).then(() => true).catch(() => false);

      if (metadataExists) {
        const metadata = JSON.parse(await fs.readFile(manimMetadataPath, 'utf-8'));

        // Check for complete lesson video
        const completePath = path.join(PATHS.manimOutput, 'sets-lesson-complete.mp4');
        const completeExists = await fs.access(completePath).then(() => true).catch(() => false);

        if (completeExists) {
          const stats = await fs.stat(completePath);

          // Build complete metadata with intro + manim scenes
          const completeMetadata = {
            title: 'Introduction to Sets',
            subtitle: 'Cambridge IGCSE Mathematics',
            total_scenes: SETS_LESSON_COMPLETE_SCENES.length,
            total_duration: SETS_LESSON_COMPLETE_SCENES.reduce((sum, s) => sum + s.duration, 0),
            scenes: SETS_LESSON_COMPLETE_SCENES,
            parts: {
              intro: { duration: 130, scenes: 5 },
              manim: { duration: 65, scenes: 8 }
            }
          };

          lessons.push({
            id: 'sets-lesson-complete',
            title: completeMetadata.title,
            type: 'manim',
            path: completePath,
            filename: 'sets-lesson-complete.mp4',
            duration: completeMetadata.total_duration,
            scenes: completeMetadata.total_scenes,
            size: stats.size,
            createdAt: stats.mtime.toISOString(),
            metadata: completeMetadata
          });
        }

        // Check for intro-only version
        const introPath = path.join(PATHS.manimOutput, 'sets-lesson-intro-only.mp4');
        const introExists = await fs.access(introPath).then(() => true).catch(() => false);

        if (introExists) {
          const stats = await fs.stat(introPath);
          lessons.push({
            id: 'sets-lesson-intro',
            title: 'Introduction to Sets (Intro)',
            type: 'manim',
            path: introPath,
            filename: 'sets-lesson-intro-only.mp4',
            size: stats.size,
            createdAt: stats.mtime.toISOString()
          });
        }
      }
    } catch (err) {
      console.log('No manim lessons found');
    }

    // 2. Check education videos (streamlined lessons)
    try {
      const files = await fs.readdir(PATHS.educationVideos);
      for (const file of files) {
        if (file.endsWith('.mp4') && file.includes('streamlined_lesson')) {
          const filePath = path.join(PATHS.educationVideos, file);
          const stats = await fs.stat(filePath);

          // Extract timestamp from filename
          const match = file.match(/streamlined_lesson_(\d+)\.mp4/);
          const timestamp = match ? parseInt(match[1]) : stats.mtimeMs;

          lessons.push({
            id: `streamlined-${timestamp}`,
            title: `Streamlined Lesson ${new Date(timestamp).toLocaleDateString()}`,
            type: 'streamlined',
            path: filePath,
            filename: file,
            size: stats.size,
            createdAt: new Date(timestamp).toISOString()
          });
        }

        if (file.endsWith('.mp4') && file.includes('circle_theorem')) {
          const filePath = path.join(PATHS.educationVideos, file);
          const stats = await fs.stat(filePath);

          if (stats.size > 0) { // Skip empty files
            const match = file.match(/circle_theorem_(\d+)\.mp4/);
            const timestamp = match ? parseInt(match[1]) : stats.mtimeMs;

            lessons.push({
              id: `circle-${timestamp}`,
              title: `Circle Theorem ${new Date(timestamp).toLocaleDateString()}`,
              type: 'video',
              path: filePath,
              filename: file,
              size: stats.size,
              createdAt: new Date(timestamp).toISOString()
            });
          }
        }
      }
    } catch (err) {
      console.log('No education videos found');
    }

    // 3. Check for HTML lessons
    try {
      const htmlFiles = await findHtmlLessons(PATHS.htmlLessons);
      for (const htmlFile of htmlFiles) {
        const stats = await fs.stat(htmlFile);
        const filename = path.basename(htmlFile);

        lessons.push({
          id: `html-${filename.replace('.html', '')}`,
          title: filename.replace(/-/g, ' ').replace('.html', ''),
          type: 'html',
          path: htmlFile,
          filename,
          size: stats.size,
          createdAt: stats.mtime.toISOString()
        });
      }
    } catch (err) {
      console.log('No HTML lessons found');
    }

    // Sort by creation date (newest first)
    lessons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: lessons.length,
      lessons
    });

  } catch (error: any) {
    console.error('Error listing lessons:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/lessons/:id
 * Get details for a specific lesson
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get all lessons and find the one matching the ID
    const allLessonsRes = await fetch(`http://localhost:3001/api/lessons`);
    const allLessons = await allLessonsRes.json();

    const lesson = allLessons.lessons.find((l: Lesson) => l.id === id);

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    res.json({
      success: true,
      lesson
    });

  } catch (error: any) {
    console.error('Error getting lesson:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/lessons/:id/video
 * Stream video file for a lesson
 */
router.get('/:id/video', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Map ID to file path
    let videoPath: string | null = null;

    if (id === 'sets-lesson-complete') {
      videoPath = path.join(PATHS.manimOutput, 'sets-lesson-complete.mp4');
    } else if (id === 'sets-lesson-intro') {
      videoPath = path.join(PATHS.manimOutput, 'sets-lesson-intro-only.mp4');
    } else if (id.startsWith('streamlined-')) {
      const timestamp = id.replace('streamlined-', '');
      videoPath = path.join(PATHS.educationVideos, `streamlined_lesson_${timestamp}.mp4`);
    } else if (id.startsWith('circle-')) {
      const timestamp = id.replace('circle-', '');
      videoPath = path.join(PATHS.educationVideos, `circle_theorem_${timestamp}.mp4`);
    }

    if (!videoPath) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    // Check file exists
    await fs.access(videoPath);

    // Get file stats
    const stats = await fs.stat(videoPath);

    // Handle range requests for video streaming
    const range = req.headers.range;

    // Add CORS headers for cross-origin video access (needed for canvas capture)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length');
    // Disable caching to ensure fresh video content
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
      });

      const { createReadStream } = await import('fs');
      const stream = createReadStream(videoPath, { start, end });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': 'video/mp4'
      });

      const { createReadStream } = await import('fs');
      const stream = createReadStream(videoPath);
      stream.pipe(res);
    }

  } catch (error: any) {
    console.error('Error streaming video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper to find HTML lesson files
async function findHtmlLessons(dir: string): Promise<string[]> {
  const results: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        const subResults = await findHtmlLessons(fullPath);
        results.push(...subResults);
      } else if (entry.isFile() && entry.name.includes('lesson') && entry.name.endsWith('.html')) {
        results.push(fullPath);
      }
    }
  } catch (err) {
    // Directory doesn't exist or can't be read
  }

  return results;
}

export default router;
