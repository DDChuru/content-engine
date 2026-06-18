/**
 * Narration Studio API
 *
 * Handles direct upload of recordings from the browser studio,
 * auto-converts webm to mp3, and saves to Remotion public folder.
 */

import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);
const router = Router();

// Output directory for Ecowize v10 narration
const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/audio/ecowize/v10');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * POST /api/narration-studio/upload
 *
 * Receives a webm audio blob, converts to mp3, saves to Remotion folder
 *
 * Body: { slideNum: number, audio: string (base64), duration: number }
 */
router.post('/upload', async (req, res) => {
  try {
    const { slideNum, audio, duration } = req.body;

    if (!slideNum || !audio) {
      return res.status(400).json({ error: 'Missing slideNum or audio data' });
    }

    const paddedNum = String(slideNum).padStart(2, '0');
    const webmPath = path.join(OUTPUT_DIR, `slide-${paddedNum}.webm`);
    const mp3Path = path.join(OUTPUT_DIR, `slide-${paddedNum}.mp3`);

    // Decode base64 and save webm
    const base64Data = audio.replace(/^data:audio\/webm;base64,/, '');
    const audioBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(webmPath, audioBuffer);

    // Convert webm to mp3 using FFmpeg
    try {
      await execAsync(`ffmpeg -y -i "${webmPath}" -vn -ar 44100 -ac 2 -b:a 192k "${mp3Path}"`);

      // Remove the webm file after successful conversion
      fs.unlinkSync(webmPath);

      // Get actual mp3 file size
      const stats = fs.statSync(mp3Path);
      const fileSizeKB = Math.round(stats.size / 1024);

      console.log(`✅ Slide ${paddedNum}: ${duration.toFixed(1)}s → ${fileSizeKB}KB`);

      res.json({
        success: true,
        slideNum,
        duration,
        filePath: mp3Path,
        fileSize: fileSizeKB,
        message: `Slide ${paddedNum} saved (${fileSizeKB}KB)`
      });
    } catch (ffmpegError: any) {
      // FFmpeg failed, but we still have the webm
      console.error(`FFmpeg error for slide ${paddedNum}:`, ffmpegError.message);
      res.status(500).json({
        error: 'FFmpeg conversion failed',
        details: ffmpegError.message,
        webmSaved: true,
        webmPath
      });
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/narration-studio/upload-all
 *
 * Batch upload all recordings at once
 *
 * Body: { recordings: Array<{ slideNum: number, audio: string, duration: number }> }
 */
router.post('/upload-all', async (req, res) => {
  try {
    const { recordings } = req.body;

    if (!recordings || !Array.isArray(recordings)) {
      return res.status(400).json({ error: 'Missing recordings array' });
    }

    const results = [];
    const errors = [];

    for (const rec of recordings) {
      const { slideNum, audio, duration } = rec;
      const paddedNum = String(slideNum).padStart(2, '0');
      const webmPath = path.join(OUTPUT_DIR, `slide-${paddedNum}.webm`);
      const mp3Path = path.join(OUTPUT_DIR, `slide-${paddedNum}.mp3`);

      try {
        // Decode and save webm
        const base64Data = audio.replace(/^data:audio\/webm;base64,/, '');
        const audioBuffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(webmPath, audioBuffer);

        // Convert to mp3
        await execAsync(`ffmpeg -y -i "${webmPath}" -vn -ar 44100 -ac 2 -b:a 192k "${mp3Path}"`);
        fs.unlinkSync(webmPath);

        const stats = fs.statSync(mp3Path);
        const fileSizeKB = Math.round(stats.size / 1024);

        results.push({
          slideNum,
          duration,
          fileSize: fileSizeKB,
          success: true
        });

        console.log(`✅ Slide ${paddedNum}: ${duration.toFixed(1)}s → ${fileSizeKB}KB`);
      } catch (err: any) {
        errors.push({ slideNum, error: err.message });
        console.error(`❌ Slide ${paddedNum}: ${err.message}`);
      }
    }

    // Generate duration array for Remotion
    const allSlides = Array.from({ length: 15 }, (_, i) => i + 1);
    const durationArray = allSlides.map(num => {
      const rec = results.find(r => r.slideNum === num);
      return rec ? Math.ceil(rec.duration) : 0;
    });

    res.json({
      success: errors.length === 0,
      uploaded: results.length,
      failed: errors.length,
      results,
      errors,
      durationArray,
      remotionCode: `const NARRATED_DURATIONS = [${durationArray.join(', ')}];`,
      outputDir: OUTPUT_DIR
    });
  } catch (error: any) {
    console.error('Batch upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/narration-studio/status
 *
 * Returns which slides have recordings saved
 */
router.get('/status', (req, res) => {
  try {
    const files = fs.readdirSync(OUTPUT_DIR);
    const recordings = files
      .filter(f => f.match(/^slide-\d{2}\.mp3$/))
      .map(f => {
        const num = parseInt(f.match(/slide-(\d{2})\.mp3/)?.[1] || '0', 10);
        const stats = fs.statSync(path.join(OUTPUT_DIR, f));
        return {
          slideNum: num,
          fileName: f,
          fileSize: Math.round(stats.size / 1024),
          modified: stats.mtime
        };
      })
      .sort((a, b) => a.slideNum - b.slideNum);

    res.json({
      outputDir: OUTPUT_DIR,
      recordings,
      count: recordings.length,
      total: 15
    });
  } catch (error: any) {
    res.json({ outputDir: OUTPUT_DIR, recordings: [], count: 0, total: 15 });
  }
});

/**
 * DELETE /api/narration-studio/recording/:slideNum
 *
 * Delete a specific recording
 */
router.delete('/recording/:slideNum', (req, res) => {
  try {
    const slideNum = parseInt(req.params.slideNum, 10);
    const paddedNum = String(slideNum).padStart(2, '0');
    const mp3Path = path.join(OUTPUT_DIR, `slide-${paddedNum}.mp3`);

    if (fs.existsSync(mp3Path)) {
      fs.unlinkSync(mp3Path);
      console.log(`🗑️  Deleted slide-${paddedNum}.mp3`);
      res.json({ success: true, deleted: `slide-${paddedNum}.mp3` });
    } else {
      res.status(404).json({ error: 'Recording not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
