/**
 * Batch transcribe 3 Biology TikToks with Whisper + cue resolution.
 * Enzymes, Osmosis, Active Transport.
 */

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const AUDIO_DIR = path.resolve(__dirname, '../remotion/public/audio/biology');
const TRANSCRIPT_DIR = path.resolve(__dirname, '../remotion/public/transcripts/biology');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

interface CueKeyword {
  id: string;
  searchTerms: string[];
}

interface TranscriptJob {
  id: string;
  audioFile: string;
  outputFile: string;
  cues: CueKeyword[];
}

// ═══════════════════════════════════════════════════════════════════════
// CUE KEYWORDS
// ═══════════════════════════════════════════════════════════════════════

const JOBS: TranscriptJob[] = [
  {
    id: 'enzymes',
    audioFile: 'enzymes-narration.mp3',
    outputFile: 'enzymes.json',
    cues: [
      // Hook
      { id: 'lied', searchTerms: ['lied'] },
      // Lock & key
      { id: 'lock-and-key', searchTerms: ['lock'] },
      { id: 'substrate-fits', searchTerms: ['substrate'] },
      { id: 'rigid', searchTerms: ['rigid'] },
      { id: 'product', searchTerms: ['product'] },
      { id: 'simplified', searchTerms: ['simplified'] },
      // Induced fit
      { id: 'induced-fit', searchTerms: ['induced'] },
      { id: 'changes-shape', searchTerms: ['changes'] },
      { id: 'moulds', searchTerms: ['moulds'] },
      { id: 'hand-ball', searchTerms: ['hand'] },
      { id: 'strain', searchTerms: ['strain'] },
      { id: 'activation', searchTerms: ['activation'] },
      // What enzymes do
      { id: 'lower', searchTerms: ['lower'] },
      { id: 'faster', searchTerms: ['faster'] },
      { id: 'millions', searchTerms: ['millions'] },
      // Temperature
      { id: 'kills', searchTerms: ['kills'] },
      { id: 'temperature', searchTerms: ['temperature'] },
      { id: 'low-temp', searchTerms: ['slowly'] },
      { id: 'few-collisions', searchTerms: ['collisions'] },
      { id: 'increases', searchTerms: ['increases'] },
      { id: 'kinetic', searchTerms: ['kinetic'] },
      { id: 'optimum', searchTerms: ['optimum'] },
      { id: 'maximum', searchTerms: ['maximum'] },
      { id: '37-degrees', searchTerms: ['37'] },
      // Denaturation
      { id: 'above-optimum', searchTerms: ['above'] },
      { id: 'vibrations', searchTerms: ['vibrations'] },
      { id: 'hydrogen-bonds', searchTerms: ['hydrogen'] },
      { id: 'tertiary', searchTerms: ['tertiary'] },
      { id: 'permanently', searchTerms: ['permanently'] },
      { id: 'denatured', searchTerms: ['denatured'] },
      // pH
      { id: 'ph', searchTerms: ['pH'] },
      { id: 'ionic', searchTerms: ['ionic'] },
      // CTA
      { id: 'induced-not-lock', searchTerms: ['induced'] },
      { id: 'denatured-not-destroyed', searchTerms: ['destroyed'] },
      { id: 'guaranteed', searchTerms: ['guaranteed'] },
    ],
  },
  {
    id: 'osmosis',
    audioFile: 'osmosis-narration.mp3',
    outputFile: 'osmosis.json',
    cues: [
      // Hook
      { id: 'red-blood-cell', searchTerms: ['red'] },
      { id: 'explodes', searchTerms: ['explodes'] },
      // Definition
      { id: 'osmosis-def', searchTerms: ['osmosis'] },
      { id: 'net-movement', searchTerms: ['net'] },
      { id: 'water-potential', searchTerms: ['potential'] },
      { id: 'partially-permeable', searchTerms: ['partially'] },
      { id: 'not-dilute', searchTerms: ['dilute'] },
      // Three solutions
      { id: 'three-solutions', searchTerms: ['three'] },
      // Hypotonic
      { id: 'hypotonic', searchTerms: ['hypotonic'] },
      { id: 'water-in', searchTerms: ['swells'] },
      { id: 'lysis', searchTerms: ['lysis'] },
      { id: 'turgid', searchTerms: ['turgid'] },
      // Isotonic
      { id: 'isotonic', searchTerms: ['isotonic'] },
      { id: 'no-net', searchTerms: ['normal'] },
      // Hypertonic
      { id: 'hypertonic', searchTerms: ['hypertonic'] },
      { id: 'water-out', searchTerms: ['shrink'] },
      { id: 'crenation', searchTerms: ['crenation'] },
      { id: 'plasmolysis', searchTerms: ['plasmolysis'] },
      // Potato experiment
      { id: 'potato', searchTerms: ['potato'] },
      { id: 'mass-change', searchTerms: ['mass'] },
      { id: 'crosses-zero', searchTerms: ['crosses'] },
      // Water potential
      { id: 'kilopascals', searchTerms: ['kilopascals'] },
      { id: 'pure-water-zero', searchTerms: ['zero'] },
      { id: 'more-negative', searchTerms: ['negative'] },
      // CTA
      { id: 'lysis-crenation-plasmolysis', searchTerms: ['lysis'] },
      { id: 'six-marks', searchTerms: ['six'] },
    ],
  },
  {
    id: 'active-transport',
    audioFile: 'active-transport-narration.mp3',
    outputFile: 'active-transport.json',
    cues: [
      // Hook
      { id: 'forty-percent', searchTerms: ['40', 'forty'] },
      // Definition
      { id: 'active-transport', searchTerms: ['active'] },
      { id: 'against', searchTerms: ['against'] },
      { id: 'low-to-high', searchTerms: ['low'] },
      { id: 'atp', searchTerms: ['ATP'] },
      // Why energy
      { id: 'uphill', searchTerms: ['uphill'] },
      { id: 'diffusion-free', searchTerms: ['diffusion'] },
      { id: 'fights', searchTerms: ['fights'] },
      // Sodium-potassium pump
      { id: 'sodium-potassium', searchTerms: ['sodium'] },
      // Steps
      { id: 'step-1', searchTerms: ['three'] },
      { id: 'step-2', searchTerms: ['hydrolysed'] },
      { id: 'step-3', searchTerms: ['released'] },
      { id: 'step-4', searchTerms: ['potassium'] },
      { id: 'step-5', searchTerms: ['detaches'] },
      { id: 'step-6', searchTerms: ['original'] },
      // Ratio
      { id: '3-out-2-in', searchTerms: ['three'] },
      { id: 'electrochemical', searchTerms: ['electrochemical'] },
      // Why it matters
      { id: 'nerve', searchTerms: ['nerve'] },
      { id: 'muscle', searchTerms: ['muscle'] },
      { id: 'brain-stops', searchTerms: ['brain'] },
      { id: 'heart-stops', searchTerms: ['heart'] },
      // Other examples
      { id: 'gut', searchTerms: ['gut'] },
      { id: 'glucose', searchTerms: ['glucose'] },
      { id: 'root-hair', searchTerms: ['root'] },
      { id: 'mineral', searchTerms: ['mineral'] },
      // CTA
      { id: 'exam-answer', searchTerms: ['exam'] },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════

function resolveCues(
  words: WordTimestamp[],
  cueKeywords: CueKeyword[]
): { cueMap: Record<string, number>; missed: string[] } {
  const cueMap: Record<string, number> = {};
  const usedWordIndices = new Set<number>();
  const missed: string[] = [];

  for (const cue of cueKeywords) {
    let resolved = false;
    for (const term of cue.searchTerms) {
      const termLower = term.toLowerCase();
      for (let i = 0; i < words.length; i++) {
        if (usedWordIndices.has(i)) continue;
        const wordClean = words[i].word.toLowerCase().replace(/[^a-z0-9'-]/g, '');
        if (wordClean === termLower) {
          cueMap[cue.id] = words[i].start;
          usedWordIndices.add(i);
          resolved = true;
          break;
        }
      }
      if (resolved) break;
    }
    if (!resolved) missed.push(cue.id);
  }

  return { cueMap, missed };
}

async function transcribeJob(job: TranscriptJob) {
  console.log(`\n═══ ${job.id.toUpperCase()} ═══`);

  const audioPath = path.join(AUDIO_DIR, job.audioFile);
  const outputPath = path.join(TRANSCRIPT_DIR, job.outputFile);

  const stats = await fs.stat(audioPath);
  console.log(`Audio: ${job.audioFile} (${(stats.size / 1024).toFixed(0)} KB)`);

  console.log('Sending to Whisper...');
  const fileBuffer = await fs.readFile(audioPath);
  const uploadFile = await toFile(fileBuffer, job.audioFile);

  const response = await openai.audio.transcriptions.create({
    file: uploadFile,
    model: 'whisper-1',
    language: 'en',
    response_format: 'verbose_json',
    timestamp_granularities: ['word', 'segment'],
  });

  const result = response as any;
  const duration = result.duration || 0;
  const words: WordTimestamp[] = (result.words || []).map((w: any) => ({
    word: w.word,
    start: w.start,
    end: w.end,
  }));

  console.log(`✅ ${duration.toFixed(1)}s, ${words.length} words`);

  // Resolve cues
  const { cueMap, missed } = resolveCues(words, job.cues);
  console.log(`Cues: ${Object.keys(cueMap).length}/${job.cues.length} resolved`);
  if (missed.length > 0) {
    console.log(`⚠️  Missed: ${missed.join(', ')}`);
  }

  // Print cue map
  for (const [id, time] of Object.entries(cueMap)) {
    console.log(`  ${id}: ${(time as number).toFixed(2)}s`);
  }

  // Save
  const transcriptData = {
    audio: job.audioFile,
    duration,
    wordCount: words.length,
    text: result.text,
    words,
    cues: cueMap,
    generatedAt: new Date().toISOString(),
  };
  await fs.writeFile(outputPath, JSON.stringify(transcriptData, null, 2));
  console.log(`💾 Saved: ${job.outputFile}`);

  // Print TS cues
  console.log(`\nconst DEFAULT_CUES: Record<string, number> = {`);
  for (const [id, time] of Object.entries(cueMap)) {
    console.log(`  '${id}': ${(time as number).toFixed(2)},`);
  }
  console.log('};');

  // Print word list
  console.log(`\nWord list (${words.length} words):`);
  words.forEach((w, i) => {
    console.log(`  [${i}] ${w.start.toFixed(2)}s "${w.word}"`);
  });

  return { duration, cueMap, missed, words };
}

async function main() {
  console.log('📐 Biology Batch 3 — Transcription & Cue Resolution');
  console.log('====================================================');

  await fs.mkdir(TRANSCRIPT_DIR, { recursive: true });

  for (const job of JOBS) {
    await transcribeJob(job);
  }

  console.log('\n═══ ALL DONE ═══');
}

main().catch(console.error);
