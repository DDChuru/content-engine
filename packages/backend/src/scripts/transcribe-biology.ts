/**
 * Transcribe Biology Biomolecules audio files with Whisper
 * and resolve cue markers to word-level timestamps.
 *
 * Usage: npx tsx src/scripts/transcribe-biology.ts
 */

// Polyfill File for Node 18 (required by OpenAI SDK)
import { Blob } from 'node:buffer';
if (typeof globalThis.File === 'undefined') {
  (globalThis as any).File = class File extends Blob {
    name: string;
    lastModified: number;
    constructor(chunks: any[], name: string, opts?: any) {
      super(chunks, opts);
      this.name = name;
      this.lastModified = opts?.lastModified ?? Date.now();
    }
  };
}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import OpenAI, { toFile } from 'openai';

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env first, then backend .env for any overrides
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env'), override: false });

const PROJECT_DIR = path.resolve(__dirname, '../../projects/biology-biomolecules');
const AUDIO_DIR = path.join(PROJECT_DIR, 'audio');
const TRANSCRIPTS_DIR = path.join(PROJECT_DIR, 'transcripts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  words: WordTimestamp[];
}

interface SlideTranscript {
  slide: number;
  duration: number;
  text: string;
  segments: TranscriptSegment[];
}

interface ResolvedCue {
  id: string;
  keyword: string;
  timestamp: number;
  frame: number;
  action: { type: string; target: string };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function findWordTimestamp(
  transcript: SlideTranscript,
  keyword: string
): { found: boolean; timestamp?: number } {
  const keywordLower = keyword.toLowerCase().replace(/[^a-z]/g, '');

  for (const segment of transcript.segments) {
    for (const word of segment.words) {
      const wordClean = word.word.toLowerCase().replace(/[^a-z]/g, '');
      if (wordClean === keywordLower || wordClean.includes(keywordLower)) {
        return { found: true, timestamp: word.start };
      }
    }
  }

  // Try partial match (keyword is part of a word)
  for (const segment of transcript.segments) {
    for (const word of segment.words) {
      const wordClean = word.word.toLowerCase().replace(/[^a-z]/g, '');
      if (keywordLower.includes(wordClean) && wordClean.length > 3) {
        return { found: true, timestamp: word.start };
      }
    }
  }

  return { found: false };
}

async function transcribeSlide(slideNum: number): Promise<SlideTranscript | null> {
  const audioFile = path.join(AUDIO_DIR, `slide-${String(slideNum).padStart(2, '0')}.mp3`);

  try {
    await fs.access(audioFile);
  } catch {
    console.error(`   ❌ Audio file not found: ${audioFile}`);
    return null;
  }

  console.log(`   📡 Sending to Whisper...`);

  const fileBuffer = await fs.readFile(audioFile);
  const uploadFile = await toFile(fileBuffer, `slide-${String(slideNum).padStart(2, '0')}.mp3`);

  const response = await openai.audio.transcriptions.create({
    file: uploadFile,
    model: 'whisper-1',
    language: 'en',
    response_format: 'verbose_json',
    timestamp_granularities: ['word', 'segment']
  });

  const result = response as any;

  const transcript: SlideTranscript = {
    slide: slideNum,
    duration: result.duration || 0,
    text: result.text || '',
    segments: (result.segments || []).map((seg: any, idx: number) => ({
      id: idx,
      start: seg.start,
      end: seg.end,
      text: seg.text,
      words: (result.words || [])
        .filter((w: any) => w.start >= seg.start && w.start < seg.end)
        .map((w: any) => ({
          word: w.word,
          start: w.start,
          end: w.end
        }))
    }))
  };

  // If words weren't grouped into segments, put them all in one segment
  if (transcript.segments.length === 0 && result.words?.length > 0) {
    transcript.segments = [{
      id: 0,
      start: result.words[0].start,
      end: result.words[result.words.length - 1].end,
      text: result.text,
      words: result.words.map((w: any) => ({
        word: w.word,
        start: w.start,
        end: w.end
      }))
    }];
  }

  return transcript;
}

async function main() {
  console.log('🧬 Biology Biomolecules — Transcription & Cue Resolution');
  console.log('========================================================\n');

  await fs.mkdir(TRANSCRIPTS_DIR, { recursive: true });

  // Load manifest
  const manifestPath = path.join(PROJECT_DIR, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

  let totalCuesResolved = 0;
  let totalCuesMissed = 0;
  let totalDuration = 0;

  for (const slide of manifest.slides) {
    console.log(`\n🎤 Slide ${slide.slideNum}: ${slide.title}`);

    const transcript = await transcribeSlide(slide.slideNum);
    if (!transcript) continue;

    totalDuration += transcript.duration;

    // Save transcript JSON
    const transcriptPath = path.join(
      TRANSCRIPTS_DIR,
      `slide-${String(slide.slideNum).padStart(2, '0')}.json`
    );
    await fs.writeFile(transcriptPath, JSON.stringify(transcript, null, 2));
    console.log(`   💾 Transcript saved (${transcript.duration.toFixed(1)}s)`);

    // Resolve cue markers
    const resolvedCues: ResolvedCue[] = [];
    const cueMarkers: string[] = slide.narration.cueMarkers || [];

    for (const keyword of cueMarkers) {
      const result = findWordTimestamp(transcript, keyword);
      if (result.found && result.timestamp !== undefined) {
        resolvedCues.push({
          id: slugify(keyword),
          keyword,
          timestamp: result.timestamp,
          frame: Math.round(result.timestamp * manifest.settings.fps),
          action: { type: 'reveal', target: keyword }
        });
        totalCuesResolved++;
      } else {
        console.log(`   ⚠️  Cue not found: "${keyword}"`);
        totalCuesMissed++;
      }
    }

    // Update manifest slide with timing data
    slide.timing = {
      ...slide.timing,
      duration: transcript.duration,
      transcript,
      cues: resolvedCues
    };

    console.log(`   ✅ Resolved ${resolvedCues.length}/${cueMarkers.length} cues`);
  }

  // Save updated manifest
  manifest.phases.recording = { status: 'complete', completedAt: new Date().toISOString() };
  manifest.phases.transcription = { status: 'complete', completedAt: new Date().toISOString() };
  manifest.updatedAt = new Date().toISOString();

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n========================================================');
  console.log('📊 TRANSCRIPTION SUMMARY');
  console.log(`   Slides transcribed: ${manifest.slides.length}`);
  console.log(`   Total duration:     ${totalDuration.toFixed(1)}s (${(totalDuration / 60).toFixed(1)} min)`);
  console.log(`   Cues resolved:      ${totalCuesResolved}`);
  console.log(`   Cues missed:        ${totalCuesMissed}`);
  console.log(`   Whisper cost:       ~$${(totalDuration / 60 * 0.006).toFixed(3)}`);
  console.log('========================================================\n');

  if (totalCuesMissed > 0) {
    console.log('⚠️  Some cues were not resolved. You may need to manually adjust timestamps.');
  }

  console.log('✅ Next: Build the Remotion composition');
}

main().catch(console.error);
