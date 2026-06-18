/**
 * Training Video Uploader
 *
 * Uploads rendered training videos from local disk to Firebase Storage
 * so they can be served via public URLs in any LMS (e-wizer, etc).
 *
 * Uses streaming uploads to handle large video files (100MB+) without
 * loading the entire file into memory.
 *
 * IMPORTANT: The Firebase project used for storage (default 'iclean') is
 * a multi-tenant platform shared by many clients. All content-engine
 * uploads are namespaced under `content-engine/videos/` to avoid any
 * collision with tenant-specific data.
 *
 * Public URLs follow the pattern:
 *   https://storage.googleapis.com/{bucket}/content-engine/videos/{slug}.mp4
 *   https://storage.googleapis.com/{bucket}/content-engine/videos/{slug}.vtt
 */

import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { getFirebaseProject } from './firebase.js';
import {
  getVideoBySlug,
  type TrainingVideo,
} from './training-video-registry.js';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface UploadResult {
  slug: string;
  title: string;
  videoUrl: string;
  captionsUrl: string | null;
  durationSeconds: number | null;
}

export interface UploadOptions {
  firebaseProject?: string; // defaults to 'iclean'
}

// ----------------------------------------------------------------
// VTT Generation (reuses logic from training-export.ts)
// ----------------------------------------------------------------

interface WordTiming {
  word: string;
  start: number;
  end: number;
}

/**
 * Read a transcript JSON file and return its word-level data.
 *
 * Supports four formats:
 *   1. Flat:      { "words": [{ "word": "Hello", "start": 0.0, "end": 0.5 }] }
 *   2. Segmented: { "segments": [{ "words": [...] }] }
 *   3. Array:     [{ "slide": 1, "segments": [...] }]
 *   4. Keyed:     { "slide-01": { "segments": [...] }, "slide-02": { ... } }
 */
async function readTranscriptWords(transcriptPath: string): Promise<WordTiming[]> {
  const raw = await fsPromises.readFile(transcriptPath, 'utf-8');
  const data = JSON.parse(raw);

  // Format 3 -- array of slides (all-transcriptions.json)
  if (Array.isArray(data)) {
    const words: WordTiming[] = [];
    for (const slide of data) {
      if (slide.segments) {
        for (const seg of slide.segments) {
          if (seg.words) words.push(...seg.words);
        }
      } else if (slide.words) {
        words.push(...slide.words);
      }
    }
    return words;
  }

  // Format 1 -- flat words array
  if (data.words && Array.isArray(data.words)) {
    return data.words;
  }

  // Format 2 -- segments containing words
  if (data.segments && Array.isArray(data.segments)) {
    const words: WordTiming[] = [];
    for (const seg of data.segments) {
      if (seg.words) words.push(...seg.words);
    }
    return words;
  }

  // Format 4 -- object keyed by slide name: { "slide-01": { segments: [...] }, ... }
  // Detect by checking if values have segments or words
  const values = Object.values(data);
  if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
    const first = values[0] as Record<string, unknown>;
    if (first.segments || first.words) {
      const words: WordTiming[] = [];
      // Sort by key to preserve slide order (slide-01, slide-02, ...)
      const sortedKeys = Object.keys(data).sort();
      for (const key of sortedKeys) {
        const slide = data[key];
        if (slide.segments && Array.isArray(slide.segments)) {
          for (const seg of slide.segments) {
            if (seg.words) words.push(...seg.words);
          }
        } else if (slide.words && Array.isArray(slide.words)) {
          words.push(...slide.words);
        }
      }
      return words;
    }
  }

  return [];
}

/**
 * Format seconds into VTT timestamp: HH:MM:SS.mmm
 */
function formatVTTTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const ms = Math.round((s - Math.floor(s)) * 1000);
  return (
    String(h).padStart(2, '0') +
    ':' +
    String(m).padStart(2, '0') +
    ':' +
    String(Math.floor(s)).padStart(2, '0') +
    '.' +
    String(ms).padStart(3, '0')
  );
}

/**
 * Convert a transcript JSON file into a WebVTT string.
 * Groups words into subtitle lines of ~6 words each.
 */
export async function generateVTT(transcriptPath: string): Promise<string> {
  const words = await readTranscriptWords(transcriptPath);

  const filtered = words.filter((w) => w.word && w.word.trim().length > 0);
  if (filtered.length === 0) return 'WEBVTT\n';

  const GROUP_SIZE = 6;
  const cues: string[] = ['WEBVTT', ''];

  for (let i = 0; i < filtered.length; i += GROUP_SIZE) {
    const group = filtered.slice(i, i + GROUP_SIZE);
    const start = group[0].start;
    const end = group[group.length - 1].end;
    const text = group.map((w) => w.word).join(' ');

    cues.push(`${formatVTTTime(start)} --> ${formatVTTTime(end)}`);
    cues.push(text);
    cues.push('');
  }

  return cues.join('\n');
}

// ----------------------------------------------------------------
// Firebase Storage streaming upload
// ----------------------------------------------------------------

/**
 * Upload a file to Firebase Storage using streams.
 * Suitable for large files (100MB+) that shouldn't be loaded entirely into memory.
 *
 * After upload, makes the file publicly readable and returns the public URL.
 */
async function uploadStreamToFirebaseStorage(
  projectName: string,
  localFilePath: string,
  storagePath: string,
  contentType: string
): Promise<string> {
  const project = getFirebaseProject(projectName);
  if (!project) {
    throw new Error(`Firebase project '${projectName}' not initialized`);
  }

  const bucket = project.storage.bucket();
  const fileRef = bucket.file(storagePath);

  // Stream the file to Firebase Storage
  await new Promise<void>((resolve, reject) => {
    const readStream = fs.createReadStream(localFilePath);
    const writeStream = fileRef.createWriteStream({
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000',
      },
      resumable: true, // enable resumable uploads for large files
    });

    readStream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);

    readStream.pipe(writeStream);
  });

  // Make the file publicly readable
  await fileRef.makePublic();

  // Return the stable public URL
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

// ----------------------------------------------------------------
// Public API
// ----------------------------------------------------------------

/**
 * Upload a single training video to Firebase Storage.
 *
 * Looks up the video by slug from the registry, streams the MP4 to
 * Firebase Storage, and optionally uploads a VTT caption file generated
 * from the transcript JSON.
 *
 * @param slug - The video slug from the training video registry
 * @param options.firebaseProject - Firebase project name (default: 'iclean')
 * @returns Upload result with public URLs
 */
export async function uploadVideo(
  slug: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const projectName = options.firebaseProject || 'iclean';

  // 1. Look up the video in the registry
  const video = await getVideoBySlug(slug);
  if (!video) {
    throw new Error(`Video not found in registry: ${slug}`);
  }

  // 2. Verify the file exists on disk
  try {
    await fsPromises.access(video.filePath, fs.constants.R_OK);
  } catch {
    throw new Error(`Video file not readable: ${video.filePath}`);
  }

  const stat = await fsPromises.stat(video.filePath);
  const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
  console.log(`[VideoUploader] Uploading ${slug} (${sizeMB} MB) to ${projectName}...`);

  // 3. Upload the MP4
  const storagePath = `content-engine/videos/${slug}.mp4`;
  const videoUrl = await uploadStreamToFirebaseStorage(
    projectName,
    video.filePath,
    storagePath,
    'video/mp4'
  );
  console.log(`[VideoUploader]   Video uploaded: ${videoUrl}`);

  // 4. If the video has a transcript, generate and upload VTT
  let captionsUrl: string | null = null;

  if (video.hasCaption && video.captionPath) {
    try {
      const vttContent = await generateVTT(video.captionPath);

      if (vttContent !== 'WEBVTT\n') {
        const vttStoragePath = `content-engine/videos/${slug}.vtt`;
        const vttBuffer = Buffer.from(vttContent, 'utf-8');

        // VTT files are small enough to upload as a buffer
        const project = getFirebaseProject(projectName);
        if (project) {
          const bucket = project.storage.bucket();
          const vttFileRef = bucket.file(vttStoragePath);

          await vttFileRef.save(vttBuffer, {
            metadata: {
              contentType: 'text/vtt; charset=utf-8',
              cacheControl: 'public, max-age=31536000',
            },
          });

          await vttFileRef.makePublic();
          captionsUrl = `https://storage.googleapis.com/${bucket.name}/${vttStoragePath}`;
          console.log(`[VideoUploader]   Captions uploaded: ${captionsUrl}`);
        }
      } else {
        console.log(`[VideoUploader]   Transcript has no word-timing data, skipping VTT`);
      }
    } catch (err) {
      console.warn(`[VideoUploader]   Warning: Failed to generate VTT for ${slug}:`, err);
      // Non-fatal -- the video is still uploaded successfully
    }
  }

  return {
    slug: video.slug,
    title: video.title,
    videoUrl,
    captionsUrl,
    durationSeconds: video.durationSeconds,
  };
}

/**
 * Upload multiple training videos to Firebase Storage.
 *
 * Uploads are performed sequentially to avoid overwhelming the network
 * and to provide clear progress feedback.
 *
 * @param slugs - Array of video slugs to upload
 * @param options.firebaseProject - Firebase project name (default: 'iclean')
 * @returns Array of upload results (one per successfully uploaded video)
 */
export async function uploadBatch(
  slugs: string[],
  options: UploadOptions = {}
): Promise<{ uploaded: UploadResult[]; errors: Array<{ slug: string; error: string }> }> {
  const uploaded: UploadResult[] = [];
  const errors: Array<{ slug: string; error: string }> = [];

  console.log(`[VideoUploader] Starting batch upload of ${slugs.length} video(s)...`);

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`[VideoUploader] [${i + 1}/${slugs.length}] ${slug}`);

    try {
      const result = await uploadVideo(slug, options);
      uploaded.push(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[VideoUploader]   Error: ${errorMsg}`);
      errors.push({ slug, error: errorMsg });
    }
  }

  console.log(
    `[VideoUploader] Batch complete: ${uploaded.length} uploaded, ${errors.length} failed`
  );

  return { uploaded, errors };
}
