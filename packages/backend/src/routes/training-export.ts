/**
 * Training Export Routes
 *
 * Provides training video content to the e-wizer LMS.
 * Separate from education.ts (which handles IGCSE content).
 *
 * Endpoints:
 *   GET  /api/training/videos                    - List all available training videos
 *   GET  /api/training/videos/:slug/manifest     - LMS-ready manifest for one video
 *   GET  /api/training/videos/:slug/stream       - Stream MP4 with range-request support
 *   GET  /api/training/videos/:slug/captions.vtt - WebVTT captions from transcript JSON
 *   POST /api/training/export                    - Batch manifest for e-wizer import
 *   POST /api/training/refresh                   - Force re-scan of video directories
 */

import express, { Request, Response } from 'express';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import {
  getVideos,
  getVideoBySlug,
  refresh,
} from '../services/training-video-registry.js';
import { uploadBatch } from '../services/training-video-uploader.js';

const router = express.Router();

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

/**
 * Build the public base URL from the request (or an explicit override).
 */
function resolveBaseUrl(req: Request, override?: string): string {
  if (override) return override.replace(/\/+$/, '');
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  return `${proto}://${host}`;
}

/**
 * Read a transcript JSON file and return its word-level data.
 *
 * Supports two formats found in this codebase:
 *
 * 1. Biology / flat format:
 *    { "words": [{ "word": "Hello", "start": 0.0, "end": 0.5 }] }
 *
 * 2. Ecowize / segmented format:
 *    { "segments": [{ "words": [{ "word": "Hello", "start": 0.0, "end": 0.5 }] }] }
 *
 * 3. Ecowize all-transcriptions (array of slides):
 *    [{ "slide": 1, "segments": [...] }, ...]
 *
 * Returns a flat array of { word, start, end }.
 */
interface WordTiming {
  word: string;
  start: number;
  end: number;
}

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
  const values = Object.values(data);
  if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
    const first = values[0] as Record<string, unknown>;
    if (first.segments || first.words) {
      const words: WordTiming[] = [];
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
 * Convert a flat word-timing array into WebVTT cue text.
 * Groups words into subtitle lines of 5-7 words each.
 */
function wordsToWebVTT(words: WordTiming[]): string {
  // Filter out empty words
  const filtered = words.filter((w) => w.word && w.word.trim().length > 0);
  if (filtered.length === 0) return 'WEBVTT\n';

  const GROUP_SIZE = 6; // target 5-7 words per line
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

// ----------------------------------------------------------------
// Routes
// ----------------------------------------------------------------

/**
 * GET /api/training/videos
 *
 * List all available rendered training videos.
 * Optional query params:
 *   ?category=ecowize   - filter by category
 */
router.get('/videos', async (req: Request, res: Response) => {
  try {
    let videos = await getVideos();
    const { category } = req.query;

    if (category && typeof category === 'string') {
      videos = videos.filter((v) => v.category === category);
    }

    const baseUrl = resolveBaseUrl(req);

    const result = videos.map((v) => ({
      slug: v.slug,
      title: v.title,
      category: v.category,
      fileSizeBytes: v.fileSizeBytes,
      durationSeconds: v.durationSeconds,
      hasCaption: v.hasCaption,
      streamUrl: `${baseUrl}/api/training/videos/${v.slug}/stream`,
      captionsUrl: v.hasCaption
        ? `${baseUrl}/api/training/videos/${v.slug}/captions.vtt`
        : null,
      manifestUrl: `${baseUrl}/api/training/videos/${v.slug}/manifest`,
    }));

    res.json({
      success: true,
      count: result.length,
      videos: result,
    });
  } catch (error) {
    console.error('[TrainingExport] Error listing videos:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * GET /api/training/videos/:slug/manifest
 *
 * Return an e-wizer-compatible manifest for a single video.
 */
router.get('/videos/:slug/manifest', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const video = await getVideoBySlug(slug);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: `Video not found: ${slug}`,
      });
    }

    const baseUrl = resolveBaseUrl(req);

    const manifest = {
      slug: video.slug,
      title: video.title,
      videoUrl: `${baseUrl}/api/training/videos/${video.slug}/stream`,
      durationSeconds: video.durationSeconds,
      captionsUrl: video.hasCaption
        ? `${baseUrl}/api/training/videos/${video.slug}/captions.vtt`
        : null,
      mimeType: 'video/mp4',
      fileSizeBytes: video.fileSizeBytes,
      category: video.category,
    };

    res.json(manifest);
  } catch (error) {
    console.error('[TrainingExport] Error building manifest:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * GET /api/training/videos/:slug/stream
 *
 * Stream the MP4 file with HTTP range-request support for seeking.
 */
router.get('/videos/:slug/stream', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const video = await getVideoBySlug(slug);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: `Video not found: ${slug}`,
      });
    }

    const filePath = video.filePath;
    const stat = await fsPromises.stat(filePath);
    const fileSize = stat.size;

    const range = req.headers.range;

    if (range) {
      // Parse range header: "bytes=start-end"
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      // No range requested -- send entire file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  } catch (error) {
    console.error('[TrainingExport] Error streaming video:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * GET /api/training/videos/:slug/captions.vtt
 *
 * Serve captions as WebVTT, converted on the fly from transcript JSON.
 */
router.get('/videos/:slug/captions.vtt', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const video = await getVideoBySlug(slug);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: `Video not found: ${slug}`,
      });
    }

    if (!video.hasCaption || !video.captionPath) {
      return res.status(404).json({
        success: false,
        error: `No captions available for: ${slug}`,
      });
    }

    const words = await readTranscriptWords(video.captionPath);

    if (words.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Transcript has no word-level timing data: ${slug}`,
      });
    }

    const vtt = wordsToWebVTT(words);

    res.set('Content-Type', 'text/vtt; charset=utf-8');
    res.send(vtt);
  } catch (error) {
    console.error('[TrainingExport] Error generating captions:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * POST /api/training/export
 *
 * Export a batch manifest formatted for e-wizer's batchRecordAssets mutation.
 *
 * Body:
 *   {
 *     "videos": ["slug1", "slug2"],
 *     "baseUrl": "https://your-domain.com"  // optional
 *   }
 */
router.post('/export', async (req: Request, res: Response) => {
  try {
    const { videos: slugs, baseUrl: baseUrlOverride } = req.body;

    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'videos array is required and must not be empty',
      });
    }

    const baseUrl = resolveBaseUrl(req, baseUrlOverride);
    const allVideos = await getVideos();

    const assets: Array<{
      title: string;
      assetType: string;
      source: string;
      externalUrl: string;
      durationSeconds: number | null;
      captionsUrl: string | null;
    }> = [];

    const notFound: string[] = [];

    for (const slug of slugs) {
      const video = allVideos.find((v) => v.slug === slug);
      if (!video) {
        notFound.push(slug);
        continue;
      }

      assets.push({
        title: video.title,
        assetType: 'video',
        source: 'remotion',
        externalUrl: `${baseUrl}/api/training/videos/${video.slug}/stream`,
        durationSeconds: video.durationSeconds,
        captionsUrl: video.hasCaption
          ? `${baseUrl}/api/training/videos/${video.slug}/captions.vtt`
          : null,
      });
    }

    const response: Record<string, unknown> = { assets };
    if (notFound.length > 0) {
      response.warnings = [`Videos not found: ${notFound.join(', ')}`];
    }

    res.json(response);
  } catch (error) {
    console.error('[TrainingExport] Error building export:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * POST /api/training/refresh
 *
 * Force a re-scan of all video directories.
 */
router.post('/refresh', async (_req: Request, res: Response) => {
  try {
    const videos = await refresh();
    res.json({
      success: true,
      message: `Registry refreshed. Found ${videos.length} videos.`,
      count: videos.length,
    });
  } catch (error) {
    console.error('[TrainingExport] Error refreshing registry:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * POST /api/training/upload
 *
 * Upload training videos to Firebase Storage so they can be served
 * via public URLs in the e-wizer LMS.
 *
 * Body:
 *   {
 *     "slugs": ["slug1", "slug2"],
 *     "firebaseProject": "iclean"  // optional, defaults to "iclean"
 *   }
 *
 * Returns:
 *   {
 *     "success": true,
 *     "uploaded": [{ slug, title, videoUrl, captionsUrl, durationSeconds }],
 *     "errors": [{ slug, error }]  // only present if there were failures
 *   }
 */
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const { slugs, firebaseProject } = req.body;

    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'slugs array is required and must not be empty',
      });
    }

    const projectName = typeof firebaseProject === 'string' ? firebaseProject : 'iclean';

    console.log(
      `[TrainingExport] Upload request: ${slugs.length} video(s) to '${projectName}'`
    );

    const { uploaded, errors } = await uploadBatch(slugs, {
      firebaseProject: projectName,
    });

    const response: Record<string, unknown> = {
      success: true,
      uploaded,
    };

    if (errors.length > 0) {
      response.errors = errors;
    }

    res.json(response);
  } catch (error) {
    console.error('[TrainingExport] Error uploading videos:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
