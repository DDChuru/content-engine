/**
 * Batch transcribe 3 Lysosome TikToks with Whisper + cue resolution.
 * Endocytosis, Phagocytosis, Autophagy.
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
    id: 'endocytosis',
    audioFile: 'endocytosis-narration.mp3',
    outputFile: 'endocytosis.json',
    cues: [
      // Hook
      { id: 'cells-eat', searchTerms: ['eat'] },
      // Endocytosis
      { id: 'endocytosis', searchTerms: ['endocytosis'] },
      { id: 'wraps', searchTerms: ['wraps'] },
      { id: 'folds-inward', searchTerms: ['folds'] },
      { id: 'vesicle', searchTerms: ['vesicle'] },
      { id: 'inside', searchTerms: ['inside'] },
      { id: 'large-molecules', searchTerms: ['large'] },
      // Two types
      { id: 'two-types', searchTerms: ['two'] },
      { id: 'phagocytosis', searchTerms: ['phagocytosis'] },
      { id: 'cell-eating', searchTerms: ['eating'] },
      { id: 'pinocytosis', searchTerms: ['pinocytosis'] },
      { id: 'cell-drinking', searchTerms: ['drinking'] },
      // Exocytosis
      { id: 'exocytosis', searchTerms: ['exocytosis'] },
      { id: 'fuses', searchTerms: ['fuses'] },
      { id: 'released-outside', searchTerms: ['released'] },
      { id: 'secrete', searchTerms: ['secrete'] },
      { id: 'hormones', searchTerms: ['hormones'] },
      // Lysosomes
      { id: 'lysosomes', searchTerms: ['lysosomes'] },
      { id: 'endosome', searchTerms: ['endosome'] },
      { id: 'lysosome-fuses', searchTerms: ['lysosome'] },
      { id: 'hydrolytic', searchTerms: ['hydrolytic'] },
      { id: 'digestion', searchTerms: ['digestion'] },
      // Exam sequence
      { id: 'exam-loves', searchTerms: ['exam'] },
      { id: 'membrane-folds', searchTerms: ['membrane'] },
      { id: 'enzymes-digest', searchTerms: ['digest'] },
      // CTA
      { id: 'endo-in', searchTerms: ['endocytosis'] },
      { id: 'exo-out', searchTerms: ['exocytosis'] },
      { id: 'three-marks', searchTerms: ['three'] },
    ],
  },
  {
    id: 'phagocytosis',
    audioFile: 'phagocytosis-narration.mp3',
    outputFile: 'phagocytosis.json',
    cues: [
      // Hook
      { id: 'bacterium', searchTerms: ['bacterium'] },
      { id: 'dead', searchTerms: ['dead'] },
      // Definition
      { id: 'phagocytosis', searchTerms: ['phagocytosis'] },
      { id: 'phago-eat', searchTerms: ['phago'] },
      { id: 'phagocyte-eats', searchTerms: ['eats'] },
      // Step 1
      { id: 'step-1', searchTerms: ['detection'] },
      { id: 'recognises', searchTerms: ['recognises'] },
      { id: 'chemotaxis', searchTerms: ['chemotaxis'] },
      // Step 2
      { id: 'step-2', searchTerms: ['attachment'] },
      { id: 'receptors', searchTerms: ['receptors'] },
      { id: 'antigens', searchTerms: ['antigens'] },
      // Step 3
      { id: 'step-3', searchTerms: ['engulfment'] },
      { id: 'pseudopods', searchTerms: ['pseudopods'] },
      { id: 'phagosome', searchTerms: ['phagosome'] },
      // Step 4
      { id: 'step-4', searchTerms: ['digestion'] },
      { id: 'phagolysosome', searchTerms: ['phagolysosome'] },
      { id: 'hydrolytic', searchTerms: ['hydrolytic'] },
      // Step 5
      { id: 'step-5', searchTerms: ['absorption'] },
      { id: 'cytoplasm', searchTerms: ['cytoplasm'] },
      { id: 'expelled', searchTerms: ['expelled'] },
      // Exam trick
      { id: 'exam-trick', searchTerms: ['trick'] },
      { id: 'presents', searchTerms: ['presents'] },
      { id: 'antigen-presenting', searchTerms: ['antigen-presenting'] },
      { id: 'adaptive', searchTerms: ['adaptive'] },
      { id: 'b-cells', searchTerms: ['cells'] },
      // CTA
      { id: 'five-steps', searchTerms: ['five'] },
      { id: 'full-marks', searchTerms: ['marks'] },
    ],
  },
  {
    id: 'autophagy',
    audioFile: 'autophagy-narration.mp3',
    outputFile: 'autophagy.json',
    cues: [
      // Hook
      { id: 'eat-themselves', searchTerms: ['themselves'] },
      { id: 'alive', searchTerms: ['alive'] },
      // Autophagy definition
      { id: 'autophagy', searchTerms: ['autophagy'] },
      { id: 'auto-self', searchTerms: ['auto'] },
      { id: 'phagy-eating', searchTerms: ['eating'] },
      { id: 'damaged', searchTerms: ['damaged'] },
      { id: 'double-membrane', searchTerms: ['double'] },
      { id: 'autophagosome', searchTerms: ['autophagosome'] },
      { id: 'lysosome-fuses', searchTerms: ['lysosome'] },
      { id: 'recycled', searchTerms: ['recycled'] },
      // Cellular recycling
      { id: 'cellular-recycling', searchTerms: ['recycling'] },
      { id: 'damaged-mitochondria', searchTerms: ['mitochondria'] },
      { id: 'misfolded', searchTerms: ['misfolded'] },
      { id: 'starvation', searchTerms: ['starvation'] },
      // Autolysis
      { id: 'autolysis', searchTerms: ['autolysis'] },
      { id: 'burst', searchTerms: ['burst'] },
      { id: 'flood', searchTerms: ['flood'] },
      { id: 'self-destructs', searchTerms: ['self-destructs'] },
      // Tadpole
      { id: 'tadpole', searchTerms: ['tadpole'] },
      { id: 'frog', searchTerms: ['frog'] },
      { id: 'programmed', searchTerms: ['programmed'] },
      // Distinction
      { id: 'distinction', searchTerms: ['distinction'] },
      { id: 'selective', searchTerms: ['selective'] },
      { id: 'survives', searchTerms: ['survives'] },
      { id: 'total-destruction', searchTerms: ['total'] },
      { id: 'dies', searchTerms: ['dies'] },
      // CTA
      { id: 'recycles', searchTerms: ['recycles'] },
      { id: 'destroys', searchTerms: ['destroys'] },
      { id: 'guaranteed', searchTerms: ['guaranteed'] },
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
  console.log('📐 Biology Batch 4 — Lysosome Transcription & Cue Resolution');
  console.log('================================================================');

  await fs.mkdir(TRANSCRIPT_DIR, { recursive: true });

  for (const job of JOBS) {
    await transcribeJob(job);
  }

  console.log('\n═══ ALL DONE ═══');
}

main().catch(console.error);
