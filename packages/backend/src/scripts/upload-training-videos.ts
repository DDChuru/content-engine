/**
 * CLI: Upload Training Videos to Firebase Storage
 *
 * Uploads locally rendered training videos to Firebase Storage so
 * they can be served via public URLs in the e-wizer LMS.
 *
 * Usage:
 *   npx tsx src/scripts/upload-training-videos.ts                    # List available videos
 *   npx tsx src/scripts/upload-training-videos.ts --upload <slug>    # Upload one video
 *   npx tsx src/scripts/upload-training-videos.ts --upload-all       # Upload all videos
 *   npx tsx src/scripts/upload-training-videos.ts --category ecowize # Upload all ecowize videos
 *   npx tsx src/scripts/upload-training-videos.ts --project haccp    # Use different Firebase project
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { initializeFirebase } from '../services/firebase.js';
import { getVideos, getVideoBySlug } from '../services/training-video-registry.js';
import { uploadVideo, uploadBatch } from '../services/training-video-uploader.js';

// ----------------------------------------------------------------
// CLI argument parsing
// ----------------------------------------------------------------

interface CliArgs {
  mode: 'list' | 'upload-one' | 'upload-all' | 'upload-category';
  slug?: string;
  category?: string;
  project: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let mode: CliArgs['mode'] = 'list';
  let slug: string | undefined;
  let category: string | undefined;
  let project = 'iclean';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--upload':
        mode = 'upload-one';
        slug = args[++i];
        if (!slug) {
          console.error('Error: --upload requires a video slug');
          process.exit(1);
        }
        break;

      case '--upload-all':
        mode = 'upload-all';
        break;

      case '--category':
        mode = 'upload-category';
        category = args[++i];
        if (!category) {
          console.error('Error: --category requires a category name');
          process.exit(1);
        }
        break;

      case '--project':
        project = args[++i];
        if (!project) {
          console.error('Error: --project requires a Firebase project name');
          process.exit(1);
        }
        break;

      case '--help':
      case '-h':
        printUsage();
        process.exit(0);

      default:
        console.error(`Unknown argument: ${args[i]}`);
        printUsage();
        process.exit(1);
    }
  }

  return { mode, slug, category, project };
}

function printUsage(): void {
  console.log(`
Training Video Uploader — Upload rendered videos to Firebase Storage

Usage:
  npx tsx src/scripts/upload-training-videos.ts                      List available videos
  npx tsx src/scripts/upload-training-videos.ts --upload <slug>      Upload one video
  npx tsx src/scripts/upload-training-videos.ts --upload-all         Upload all videos
  npx tsx src/scripts/upload-training-videos.ts --category ecowize   Upload by category
  npx tsx src/scripts/upload-training-videos.ts --project haccp      Use different Firebase project

Options:
  --upload <slug>      Upload a single video by its slug
  --upload-all         Upload all videos found in the registry
  --category <name>    Upload all videos in a category (ecowize, education, biology, general)
  --project <name>     Firebase project to upload to (default: iclean)
  -h, --help           Show this help message
`);
}

// ----------------------------------------------------------------
// Formatting helpers
// ----------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function padRight(str: string, len: number): string {
  return str.length >= len ? str.slice(0, len) : str + ' '.repeat(len - str.length);
}

function padLeft(str: string, len: number): string {
  return str.length >= len ? str : ' '.repeat(len - str.length) + str;
}

// ----------------------------------------------------------------
// Main
// ----------------------------------------------------------------

async function main() {
  const cliArgs = parseArgs();

  // Initialize Firebase
  console.log('Initializing Firebase...\n');
  initializeFirebase();
  console.log('');

  // Scan for videos
  const videos = await getVideos();

  if (videos.length === 0) {
    console.log('No training videos found. Check that rendered MP4 files exist in:');
    console.log('  - packages/backend/output/ecowize/');
    console.log('  - packages/backend/output/videos/');
    console.log('  - packages/backend/output/education/videos/');
    console.log('  - packages/backend/src/remotion/public/videos/');
    process.exit(0);
  }

  switch (cliArgs.mode) {
    case 'list': {
      console.log(`Found ${videos.length} training video(s):\n`);

      // Print table header
      const header =
        padRight('SLUG', 50) +
        padRight('CATEGORY', 12) +
        padRight('SIZE', 10) +
        padRight('CAPTIONS', 10) +
        'TITLE';
      console.log(header);
      console.log('-'.repeat(header.length + 20));

      for (const v of videos) {
        console.log(
          padRight(v.slug, 50) +
          padRight(v.category, 12) +
          padLeft(formatBytes(v.fileSizeBytes), 9) + ' ' +
          padRight(v.hasCaption ? 'Yes' : 'No', 10) +
          v.title
        );
      }

      // Category summary
      const categories = new Map<string, number>();
      for (const v of videos) {
        categories.set(v.category, (categories.get(v.category) || 0) + 1);
      }
      console.log(`\nCategories: ${[...categories.entries()].map(([k, v]) => `${k} (${v})`).join(', ')}`);
      console.log(`\nTo upload, run:`);
      console.log(`  npx tsx src/scripts/upload-training-videos.ts --upload <slug>`);
      console.log(`  npx tsx src/scripts/upload-training-videos.ts --upload-all`);
      break;
    }

    case 'upload-one': {
      const slug = cliArgs.slug!;
      const video = await getVideoBySlug(slug);
      if (!video) {
        console.error(`Video not found: ${slug}`);
        console.log('\nAvailable slugs:');
        for (const v of videos) {
          console.log(`  ${v.slug}`);
        }
        process.exit(1);
      }

      console.log(`Uploading: ${video.title} (${formatBytes(video.fileSizeBytes)})`);
      console.log(`Target: Firebase project '${cliArgs.project}'\n`);

      const result = await uploadVideo(slug, { firebaseProject: cliArgs.project });

      console.log('\n--- Upload Complete ---');
      console.log(`  Video URL:    ${result.videoUrl}`);
      if (result.captionsUrl) {
        console.log(`  Captions URL: ${result.captionsUrl}`);
      }
      if (result.durationSeconds) {
        console.log(`  Duration:     ${result.durationSeconds}s`);
      }
      break;
    }

    case 'upload-all': {
      const slugs = videos.map((v) => v.slug);
      const totalSize = videos.reduce((sum, v) => sum + v.fileSizeBytes, 0);

      console.log(`Uploading ALL ${slugs.length} videos (${formatBytes(totalSize)} total)`);
      console.log(`Target: Firebase project '${cliArgs.project}'\n`);

      const { uploaded, errors } = await uploadBatch(slugs, {
        firebaseProject: cliArgs.project,
      });

      printBatchSummary(uploaded, errors);
      break;
    }

    case 'upload-category': {
      const category = cliArgs.category!;
      const filtered = videos.filter((v) => v.category === category);

      if (filtered.length === 0) {
        console.error(`No videos found in category: ${category}`);
        const categories = [...new Set(videos.map((v) => v.category))];
        console.log(`Available categories: ${categories.join(', ')}`);
        process.exit(1);
      }

      const slugs = filtered.map((v) => v.slug);
      const totalSize = filtered.reduce((sum, v) => sum + v.fileSizeBytes, 0);

      console.log(`Uploading ${slugs.length} '${category}' videos (${formatBytes(totalSize)} total)`);
      console.log(`Target: Firebase project '${cliArgs.project}'\n`);

      const { uploaded, errors } = await uploadBatch(slugs, {
        firebaseProject: cliArgs.project,
      });

      printBatchSummary(uploaded, errors);
      break;
    }
  }
}

function printBatchSummary(
  uploaded: Array<{ slug: string; title: string; videoUrl: string; captionsUrl: string | null }>,
  errors: Array<{ slug: string; error: string }>
): void {
  console.log('\n' + '='.repeat(60));
  console.log('BATCH UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Uploaded: ${uploaded.length}`);
  console.log(`  Failed:   ${errors.length}`);

  if (uploaded.length > 0) {
    console.log('\nUploaded videos:');
    for (const u of uploaded) {
      console.log(`  ${u.slug}`);
      console.log(`    Video:    ${u.videoUrl}`);
      if (u.captionsUrl) {
        console.log(`    Captions: ${u.captionsUrl}`);
      }
    }
  }

  if (errors.length > 0) {
    console.log('\nFailed uploads:');
    for (const e of errors) {
      console.log(`  ${e.slug}: ${e.error}`);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
