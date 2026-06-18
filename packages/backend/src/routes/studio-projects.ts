/**
 * Studio Projects API
 *
 * Manages Content Studio projects with manifest-driven video production.
 * Pipeline: /storyboard → /script → Record/TTS → /transcribe → /render
 */

// Polyfill for tsx - OpenAI SDK requires File global
import { File as NodeFile } from 'node:buffer';
if (typeof globalThis.File === 'undefined') {
  globalThis.File = NodeFile as any;
}

import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type {
  StudioProjectManifest,
  SlideManifest,
  TranscriptData,
  TranscriptSegment,
  WordTiming,
  ResolvedCue,
  CreateProjectRequest,
  CreateProjectResponse,
  UpdatePhaseRequest,
  TranscribeRequest,
  TranscribeResponse,
  PhaseStatus,
} from 'shared/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Initialize OpenAI for Whisper
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Projects root directory
const PROJECTS_ROOT = path.resolve(__dirname, '../../projects');

// Ensure projects directory exists
if (!fs.existsSync(PROJECTS_ROOT)) {
  fs.mkdirSync(PROJECTS_ROOT, { recursive: true });
}

// ============================================================================
// Utility Functions
// ============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function getProjectPath(slug: string): string {
  return path.join(PROJECTS_ROOT, slug);
}

function getManifestPath(slug: string): string {
  return path.join(getProjectPath(slug), 'manifest.json');
}

function readManifest(slug: string): StudioProjectManifest | null {
  const manifestPath = getManifestPath(slug);
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  const content = fs.readFileSync(manifestPath, 'utf-8');
  return JSON.parse(content);
}

function writeManifest(manifest: StudioProjectManifest): void {
  const manifestPath = getManifestPath(manifest.slug);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function createDirectoryStructure(slug: string): void {
  const projectPath = getProjectPath(slug);
  const dirs = ['storyboard', 'script', 'audio', 'transcripts', 'visuals', 'output'];

  for (const dir of dirs) {
    const dirPath = path.join(projectPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}

/**
 * Find a word in transcript and return its timestamp
 */
function findWordTimestamp(
  transcript: TranscriptData,
  keyword: string,
  options: { fuzzy?: boolean; afterTimestamp?: number } = {}
): { found: boolean; timestamp?: number; word?: WordTiming } {
  const searchTerm = keyword.toLowerCase();
  const { fuzzy = true, afterTimestamp = 0 } = options;

  for (const segment of transcript.segments) {
    for (const word of segment.words) {
      if (word.start < afterTimestamp) continue;

      const wordText = word.word.toLowerCase().replace(/[.,!?;:'"]/g, '');

      if (fuzzy) {
        if (wordText.includes(searchTerm) || searchTerm.includes(wordText)) {
          return { found: true, timestamp: word.start, word };
        }
      } else {
        if (wordText === searchTerm) {
          return { found: true, timestamp: word.start, word };
        }
      }
    }
  }

  return { found: false };
}

// ============================================================================
// API Routes
// ============================================================================

/**
 * POST /api/studio/projects
 * Create a new project with directory structure
 */
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const { name, description, settings } = req.body as CreateProjectRequest;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const slug = slugify(name);
    const projectPath = getProjectPath(slug);

    // Check if project already exists
    if (fs.existsSync(projectPath)) {
      return res.status(409).json({
        error: 'Project already exists',
        slug,
        path: projectPath
      });
    }

    // Create directory structure
    createDirectoryStructure(slug);

    // Create manifest
    const now = new Date().toISOString();
    const manifest: StudioProjectManifest = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      slug,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      settings: {
        fps: 30,
        resolution: { width: 1920, height: 1080 },
        aspectRatio: '16:9',
        ...settings
      },
      phases: {
        storyboard: { status: 'pending' },
        script: { status: 'pending' },
        recording: { status: 'pending' },
        transcription: { status: 'pending' },
        render: { status: 'pending' }
      },
      slides: [],
      paths: {
        root: `projects/${slug}/`,
        storyboard: 'storyboard/',
        script: 'script/',
        audio: 'audio/',
        transcripts: 'transcripts/',
        visuals: 'visuals/',
        output: 'output/'
      }
    };

    writeManifest(manifest);

    console.log(`📁 Created project: ${name} (${slug})`);

    const response: CreateProjectResponse = {
      success: true,
      project: manifest,
      paths: {
        manifest: getManifestPath(slug),
        root: projectPath
      }
    };

    res.json(response);
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/studio/projects
 * List all projects
 */
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects: Array<{
      slug: string;
      name: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
      phases: Record<string, PhaseStatus>;
      slideCount: number;
    }> = [];

    if (!fs.existsSync(PROJECTS_ROOT)) {
      return res.json({ projects: [], count: 0 });
    }

    const dirs = fs.readdirSync(PROJECTS_ROOT, { withFileTypes: true });

    for (const dir of dirs) {
      if (!dir.isDirectory()) continue;

      const manifestPath = getManifestPath(dir.name);
      if (!fs.existsSync(manifestPath)) continue;

      try {
        const manifest = readManifest(dir.name);
        if (manifest) {
          projects.push({
            slug: manifest.slug,
            name: manifest.name,
            description: manifest.description,
            createdAt: manifest.createdAt,
            updatedAt: manifest.updatedAt,
            phases: {
              storyboard: manifest.phases.storyboard.status,
              script: manifest.phases.script.status,
              recording: manifest.phases.recording.status,
              transcription: manifest.phases.transcription.status,
              render: manifest.phases.render.status
            },
            slideCount: manifest.slides.length
          });
        }
      } catch (err) {
        console.warn(`Failed to read manifest for ${dir.name}:`, err);
      }
    }

    // Sort by most recently updated
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    res.json({
      projects,
      count: projects.length,
      projectsRoot: PROJECTS_ROOT
    });
  } catch (error: any) {
    console.error('List projects error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/studio/projects/:slug
 * Get project manifest
 */
router.get('/projects/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const manifest = readManifest(slug);

    if (!manifest) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      project: manifest,
      paths: {
        manifest: getManifestPath(slug),
        root: getProjectPath(slug)
      }
    });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/studio/projects/:slug/phase
 * Update phase status
 */
router.patch('/projects/:slug/phase', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { phase, status, output, error: phaseError } = req.body as UpdatePhaseRequest;

    const manifest = readManifest(slug);
    if (!manifest) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!phase || !manifest.phases[phase]) {
      return res.status(400).json({ error: 'Invalid phase' });
    }

    // Update phase
    manifest.phases[phase].status = status;
    manifest.updatedAt = new Date().toISOString();

    if (status === 'in_progress') {
      manifest.phases[phase].startedAt = manifest.updatedAt;
    } else if (status === 'completed') {
      manifest.phases[phase].completedAt = manifest.updatedAt;
    }

    if (output) {
      manifest.phases[phase].output = output;
    }

    if (phaseError) {
      manifest.phases[phase].error = phaseError;
    }

    writeManifest(manifest);

    console.log(`📝 Updated ${slug}/${phase}: ${status}`);

    res.json({
      success: true,
      phase,
      status,
      updatedAt: manifest.updatedAt
    });
  } catch (error: any) {
    console.error('Update phase error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/studio/projects/:slug/slides
 * Update slides array (used by /script skill)
 */
router.put('/projects/:slug/slides', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { slides } = req.body as { slides: SlideManifest[] };

    const manifest = readManifest(slug);
    if (!manifest) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!Array.isArray(slides)) {
      return res.status(400).json({ error: 'slides must be an array' });
    }

    manifest.slides = slides;
    manifest.updatedAt = new Date().toISOString();

    writeManifest(manifest);

    // Also save slides to script directory
    const scriptPath = path.join(getProjectPath(slug), 'script', 'slides.json');
    fs.writeFileSync(scriptPath, JSON.stringify(slides, null, 2));

    console.log(`📝 Updated ${slug} slides: ${slides.length} slides`);

    res.json({
      success: true,
      slideCount: slides.length,
      scriptPath
    });
  } catch (error: any) {
    console.error('Update slides error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/studio/projects/:slug/transcribe
 * Batch transcription with Whisper
 */
router.post('/projects/:slug/transcribe', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { audioFiles, model = 'whisper-1' } = req.body as TranscribeRequest;

    const manifest = readManifest(slug);
    if (!manifest) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update phase status
    manifest.phases.transcription.status = 'in_progress';
    manifest.phases.transcription.startedAt = new Date().toISOString();
    writeManifest(manifest);

    const audioDir = path.join(getProjectPath(slug), 'audio');
    const transcriptsDir = path.join(getProjectPath(slug), 'transcripts');

    // Ensure transcripts directory exists
    if (!fs.existsSync(transcriptsDir)) {
      fs.mkdirSync(transcriptsDir, { recursive: true });
    }

    // Get list of audio files to process
    let filesToProcess: string[];
    if (audioFiles && audioFiles.length > 0) {
      filesToProcess = audioFiles;
    } else {
      // Process all mp3/wav files in audio directory
      filesToProcess = fs.readdirSync(audioDir)
        .filter(f => /\.(mp3|wav|m4a|webm)$/i.test(f))
        .map(f => path.join(audioDir, f));
    }

    console.log(`🎤 Transcribing ${filesToProcess.length} audio files for ${slug}`);

    const results: TranscribeResponse['results'] = [];
    const errors: NonNullable<TranscribeResponse['errors']> = [];

    for (const audioPath of filesToProcess) {
      const fileName = path.basename(audioPath);
      const slideMatch = fileName.match(/slide[_-]?(\d+)/i);
      const slideNum = slideMatch ? parseInt(slideMatch[1], 10) : 0;

      try {
        // Read audio file
        const audioBuffer = fs.readFileSync(audioPath);

        // Transcribe with Whisper (word-level timestamps)
        const transcription = await openai.audio.transcriptions.create({
          file: await OpenAI.toFile(audioBuffer, fileName),
          model,
          language: 'en',
          response_format: 'verbose_json',
          timestamp_granularities: ['word', 'segment']
        });

        // Convert to our TranscriptData format
        const transcript: TranscriptData = {
          slide: slideNum,
          duration: (transcription as any).duration || 0,
          text: transcription.text,
          segments: ((transcription as any).segments || []).map((seg: any, idx: number) => ({
            id: idx,
            start: seg.start,
            end: seg.end,
            text: seg.text,
            words: (seg.words || []).map((w: any) => ({
              word: w.word,
              start: w.start,
              end: w.end
            }))
          }))
        };

        // If no word-level timestamps in segments, use top-level words array
        if (transcript.segments.length > 0 && transcript.segments[0].words.length === 0) {
          const allWords: WordTiming[] = ((transcription as any).words || []).map((w: any) => ({
            word: w.word,
            start: w.start,
            end: w.end
          }));

          // Distribute words to segments
          for (const segment of transcript.segments) {
            segment.words = allWords.filter(w => w.start >= segment.start && w.end <= segment.end);
          }
        }

        // Save transcript
        const transcriptPath = path.join(transcriptsDir, `slide-${String(slideNum).padStart(2, '0')}.json`);
        fs.writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2));

        // Resolve cues if slide exists in manifest
        let cuesResolved = 0;
        const slide = manifest.slides.find(s => s.slideNum === slideNum);
        if (slide) {
          slide.timing = {
            duration: transcript.duration,
            audioFile: audioPath,
            transcript,
            cues: []
          };

          // Resolve cue markers from narration
          if (slide.narration?.cueMarkers) {
            for (const keyword of slide.narration.cueMarkers) {
              const result = findWordTimestamp(transcript, keyword);
              if (result.found && result.timestamp !== undefined) {
                slide.timing.cues.push({
                  id: slugify(keyword),
                  keyword,
                  timestamp: result.timestamp,
                  frame: Math.round(result.timestamp * manifest.settings.fps),
                  action: { type: 'reveal', target: keyword }
                });
                cuesResolved++;
              }
            }
          }
        }

        results.push({
          slideNum,
          duration: transcript.duration,
          transcript,
          cuesResolved
        });

        console.log(`✅ Slide ${slideNum}: ${transcript.duration.toFixed(1)}s, ${cuesResolved} cues`);
      } catch (err: any) {
        errors.push({ slideNum, error: err.message });
        console.error(`❌ Slide ${slideNum}: ${err.message}`);
      }
    }

    // Update manifest with results
    manifest.phases.transcription.status = errors.length === 0 ? 'completed' : 'failed';
    manifest.phases.transcription.completedAt = new Date().toISOString();
    manifest.phases.transcription.output = {
      slidesTranscribed: results.length,
      cuesResolved: results.reduce((sum, r) => sum + r.cuesResolved, 0),
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0)
    };

    if (errors.length > 0) {
      manifest.phases.transcription.error = `${errors.length} files failed`;
    }

    writeManifest(manifest);

    const response: TranscribeResponse = {
      success: errors.length === 0,
      transcribed: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    };

    res.json(response);
  } catch (error: any) {
    console.error('Transcribe error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/studio/projects/:slug/transcripts
 * Get all transcripts for a project
 */
router.get('/projects/:slug/transcripts', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const manifest = readManifest(slug);

    if (!manifest) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const transcriptsDir = path.join(getProjectPath(slug), 'transcripts');
    if (!fs.existsSync(transcriptsDir)) {
      return res.json({ transcripts: [], count: 0 });
    }

    const files = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.json'));
    const transcripts: TranscriptData[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(transcriptsDir, file), 'utf-8');
        transcripts.push(JSON.parse(content));
      } catch (err) {
        console.warn(`Failed to read transcript ${file}:`, err);
      }
    }

    transcripts.sort((a, b) => a.slide - b.slide);

    res.json({
      transcripts,
      count: transcripts.length,
      totalDuration: transcripts.reduce((sum, t) => sum + t.duration, 0)
    });
  } catch (error: any) {
    console.error('Get transcripts error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/studio/projects/:slug
 * Delete a project and all its files
 */
router.delete('/projects/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const projectPath = getProjectPath(slug);

    if (!fs.existsSync(projectPath)) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Remove directory recursively
    fs.rmSync(projectPath, { recursive: true, force: true });

    console.log(`🗑️  Deleted project: ${slug}`);

    res.json({
      success: true,
      deleted: slug
    });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
