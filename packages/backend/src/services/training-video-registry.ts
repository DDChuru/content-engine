/**
 * Training Video Registry Scanner
 *
 * Scans known directories for rendered MP4 files produced by the
 * Remotion / Manim pipeline.  Matches each video with its
 * transcript JSON (if any) and exposes the result as a simple
 * registry that the training-export route can query.
 *
 * Directories scanned:
 *   - output/ecowize/               - Ecowize pitch / training renders
 *   - output/videos/                - General rendered videos
 *   - output/education/videos/      - Education renders
 *   - projects/(star)/output/       - Per-project renders
 *   - src/remotion/public/videos/   - Remotion public assets
 *
 * Transcript resolution:
 *   - src/remotion/public/transcripts/ecowize/  - slide-NN.json (Ecowize)
 *   - src/remotion/public/transcripts/biology/  - topic.json (Biology)
 *   - projects/(star)/transcripts/              - Per-project transcripts
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(__dirname, '../..');

export interface TrainingVideo {
  slug: string;
  title: string;
  filePath: string;            // absolute path to the MP4
  fileSizeBytes: number;
  durationSeconds: number | null;   // null if we cannot determine
  hasCaption: boolean;
  captionPath: string | null;  // absolute path to transcript JSON
  category: string;            // ecowize | education | biology | general | project
}

/**
 * Derive a human-readable title from a filename.
 *
 *   "ecowize-pitch-v10-narrated.mp4" -> "Ecowize Pitch V10 Narrated"
 */
function filenameToTitle(filename: string): string {
  const base = path.basename(filename, path.extname(filename));
  return base
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bV(\d)/g, 'V$1');   // keep version numbers uppercase
}

/**
 * Derive a URL-friendly slug from an absolute file path.
 * Includes parent directory to avoid collisions.
 *
 *   ".../output/ecowize/ecowize-pitch-v10.mp4" -> "ecowize--ecowize-pitch-v10"
 */
function pathToSlug(filePath: string): string {
  const dir = path.basename(path.dirname(filePath));
  const base = path.basename(filePath, '.mp4');
  return `${dir}--${base}`.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-');
}

/**
 * Attempt to read duration from a paired transcript JSON.
 * Both the biology format (top-level "duration") and the ecowize
 * per-slide format have a "duration" field.
 */
async function readDurationFromTranscript(transcriptPath: string): Promise<number | null> {
  try {
    const raw = await fs.readFile(transcriptPath, 'utf-8');
    const data = JSON.parse(raw);
    if (typeof data.duration === 'number') return data.duration;
    return null;
  } catch {
    return null;
  }
}

/**
 * Recursively scan a directory for MP4 files (max 2 levels deep).
 */
async function scanForMp4s(dir: string, maxDepth = 2, currentDepth = 0): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith('.mp4')) {
        results.push(fullPath);
      } else if (entry.isDirectory() && currentDepth < maxDepth) {
        // Skip Manim partial_movie_files -- they are intermediate fragments
        if (entry.name === 'partial_movie_files') continue;
        const sub = await scanForMp4s(fullPath, maxDepth, currentDepth + 1);
        results.push(...sub);
      }
    }
  } catch {
    // Directory does not exist or not readable -- skip silently
  }
  return results;
}

/**
 * Try to find a transcript JSON that matches a given video file.
 *
 * Matching strategy (tried in order):
 *   1. Same directory, same basename with .json extension
 *   2. transcripts/ecowize/  for ecowize videos
 *   3. transcripts/biology/  for biology videos
 *   4. projects/x/transcripts/ for project videos
 */
async function findTranscript(videoPath: string): Promise<string | null> {
  const base = path.basename(videoPath, '.mp4');
  const dir = path.dirname(videoPath);

  // 1. Co-located JSON
  const colocated = path.join(dir, `${base}.json`);
  if (fsSync.existsSync(colocated)) return colocated;

  // 2. Ecowize transcripts (match by slide number or name)
  const ecowizeDir = path.join(BACKEND_ROOT, 'src/remotion/public/transcripts/ecowize');
  if (videoPath.includes('ecowize')) {
    // The ecowize pitch has an all-transcriptions.json that covers the full video
    const allTranscript = path.join(ecowizeDir, 'all-transcriptions.json');
    if (fsSync.existsSync(allTranscript)) return allTranscript;
  }

  // 3. Biology transcripts
  const biologyDir = path.join(BACKEND_ROOT, 'src/remotion/public/transcripts/biology');
  if (videoPath.includes('biology') || videoPath.includes('Biology')) {
    // Try matching by topic name
    const slug = base.toLowerCase().replace(/[-_]/g, '-');
    try {
      const files = await fs.readdir(biologyDir);
      for (const f of files) {
        const fSlug = path.basename(f, '.json').toLowerCase();
        if (slug.includes(fSlug) || fSlug.includes(slug)) return path.join(biologyDir, f);
      }
    } catch { /* skip */ }
  }

  // 4. Project transcripts
  const projectsDir = path.join(BACKEND_ROOT, 'projects');
  try {
    const projects = await fs.readdir(projectsDir, { withFileTypes: true });
    for (const p of projects) {
      if (!p.isDirectory()) continue;
      const transcriptsDir = path.join(projectsDir, p.name, 'transcripts');
      const candidate = path.join(transcriptsDir, `${base}.json`);
      if (fsSync.existsSync(candidate)) return candidate;
    }
  } catch { /* skip */ }

  return null;
}

function categorize(videoPath: string): string {
  if (videoPath.includes('ecowize')) return 'ecowize';
  if (videoPath.includes('education')) return 'education';
  if (videoPath.includes('biology') || videoPath.includes('Biology')) return 'biology';
  if (videoPath.includes('/projects/')) return 'project';
  return 'general';
}

// --- Public API ---

let _cache: TrainingVideo[] | null = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

/**
 * Return the full registry of training videos.  Results are cached
 * for 1 minute; call refresh() to force a re-scan.
 */
export async function getVideos(): Promise<TrainingVideo[]> {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL_MS) return _cache;
  _cache = await scanAll();
  _cacheTime = Date.now();
  return _cache;
}

/**
 * Look up a single video by slug.
 */
export async function getVideoBySlug(slug: string): Promise<TrainingVideo | undefined> {
  const videos = await getVideos();
  return videos.find((v) => v.slug === slug);
}

/**
 * Force a re-scan of all directories.
 */
export async function refresh(): Promise<TrainingVideo[]> {
  _cache = null;
  return getVideos();
}

// --- Internal ---

async function scanAll(): Promise<TrainingVideo[]> {
  const dirs = [
    path.join(BACKEND_ROOT, 'output/ecowize'),
    path.join(BACKEND_ROOT, 'output/videos'),
    path.join(BACKEND_ROOT, 'output/education/videos'),
    path.join(BACKEND_ROOT, 'src/remotion/public/videos'),
  ];

  // Also scan projects/*/output
  const projectsDir = path.join(BACKEND_ROOT, 'projects');
  try {
    const projects = await fs.readdir(projectsDir, { withFileTypes: true });
    for (const p of projects) {
      if (p.isDirectory()) {
        dirs.push(path.join(projectsDir, p.name, 'output'));
      }
    }
  } catch { /* skip */ }

  // Collect all MP4 paths
  const allMp4s: string[] = [];
  for (const dir of dirs) {
    const found = await scanForMp4s(dir);
    allMp4s.push(...found);
  }

  // De-duplicate by absolute path
  const unique = [...new Set(allMp4s)];

  // Build registry entries
  const videos: TrainingVideo[] = [];
  for (const mp4 of unique) {
    try {
      const stat = await fs.stat(mp4);
      const transcript = await findTranscript(mp4);
      let duration: number | null = null;
      if (transcript) {
        duration = await readDurationFromTranscript(transcript);
      }

      videos.push({
        slug: pathToSlug(mp4),
        title: filenameToTitle(path.basename(mp4)),
        filePath: mp4,
        fileSizeBytes: stat.size,
        durationSeconds: duration,
        hasCaption: transcript !== null,
        captionPath: transcript,
        category: categorize(mp4),
      });
    } catch {
      // stat failed -- file might have been deleted between scan and stat
    }
  }

  // Sort alphabetically by title
  videos.sort((a, b) => a.title.localeCompare(b.title));
  return videos;
}
