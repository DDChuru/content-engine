/**
 * Transcribe Proof Notation TikTok narration with Whisper
 * and resolve cue keywords to word-level timestamps.
 *
 * Usage: OPENAI_API_KEY=xxx npx tsx src/scripts/transcribe-proof-notation.ts
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const AUDIO_PATH = path.resolve(
  __dirname,
  '../remotion/public/audio/maths/proof-notation-narration.mp3'
);
const TRANSCRIPT_DIR = path.resolve(
  __dirname,
  '../remotion/public/transcripts/maths'
);
const TRANSCRIPT_PATH = path.join(TRANSCRIPT_DIR, 'proof-notation.json');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Cue keywords to resolve ─────────────────────────────────────────
const CUE_KEYWORDS: { id: string; searchTerms: string[] }[] = [
  // Hook
  { id: 'language', searchTerms: ['language'] },
  // Number sets
  { id: 'number-sets', searchTerms: ['number'] },
  { id: 'n-natural', searchTerms: ['natural'] },
  { id: 'counting', searchTerms: ['counting'] },
  { id: 'z-integers', searchTerms: ['integers'] },
  { id: 'negatives', searchTerms: ['negatives'] },
  { id: 'q-rational', searchTerms: ['rational'] },
  { id: 'fraction', searchTerms: ['fraction'] },
  { id: 'r-real', searchTerms: ['real'] },
  { id: 'number-line', searchTerms: ['line'] },
  // Algebraic forms
  { id: 'algebraic', searchTerms: ['algebraic'] },
  { id: 'even-2k', searchTerms: ['even'] },
  { id: 'odd-2k1', searchTerms: ['odd'] },
  { id: 'multiples-3k', searchTerms: ['multiples'] },
  { id: 'general-form', searchTerms: ['general'] },
  { id: 'manipulate', searchTerms: ['manipulate'] },
  // LHS/RHS
  { id: 'lhs', searchTerms: ['left'] },
  { id: 'rhs', searchTerms: ['right'] },
  { id: 'equal-proven', searchTerms: ['equal'] },
  // Examiner tips
  { id: 'examiner', searchTerms: ['examiner'] },
  { id: 'try-values', searchTerms: ['values'] },
  { id: 'try-negatives', searchTerms: ['negatives'] },
  { id: 'try-zero', searchTerms: ['zero'] },
  { id: 'pattern', searchTerms: ['pattern'] },
  // Primes shortcut
  { id: 'primes', searchTerms: ['primes'] },
  { id: 'square-root', searchTerms: ['square'] },
  { id: 'shortcut', searchTerms: ['shortcut'] },
  // CTA
  { id: 'master-language', searchTerms: ['master'] },
  { id: 'master-proof', searchTerms: ['master'] },
];

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

function resolveCues(
  words: WordTimestamp[],
  cueKeywords: typeof CUE_KEYWORDS
): Record<string, number> {
  const cueMap: Record<string, number> = {};
  const usedWordIndices = new Set<number>();

  for (const cue of cueKeywords) {
    let resolved = false;

    for (const term of cue.searchTerms) {
      const termLower = term.toLowerCase();

      for (let i = 0; i < words.length; i++) {
        if (usedWordIndices.has(i)) continue;

        const wordClean = words[i].word.toLowerCase().replace(/[^a-z'-]/g, '');

        if (wordClean === termLower) {
          cueMap[cue.id] = words[i].start;
          usedWordIndices.add(i);
          resolved = true;
          break;
        }
      }

      if (resolved) break;
    }

    if (!resolved) {
      console.log(`   ⚠️  Cue not found: "${cue.id}" (searched: ${cue.searchTerms.join(', ')})`);
    }
  }

  return cueMap;
}

async function main() {
  console.log('📐 Proof Notation TikTok — Transcription & Cue Resolution');
  console.log('============================================================\n');

  try {
    await fs.access(AUDIO_PATH);
  } catch {
    console.error(`❌ Audio not found: ${AUDIO_PATH}`);
    process.exit(1);
  }

  const stats = await fs.stat(AUDIO_PATH);
  console.log(`🎵 Audio: ${AUDIO_PATH}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(0)} KB\n`);

  console.log('📡 Sending to Whisper API...');
  const fileBuffer = await fs.readFile(AUDIO_PATH);
  const uploadFile = await toFile(fileBuffer, 'proof-notation-narration.mp3');

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

  console.log(`✅ Transcribed: ${duration.toFixed(1)}s, ${words.length} words\n`);
  console.log(`📝 Full text:\n   "${result.text}"\n`);

  // Resolve cues
  console.log('🎯 Resolving cue keywords...');
  const cueMap = resolveCues(words, CUE_KEYWORDS);
  const resolved = Object.keys(cueMap).length;
  const total = CUE_KEYWORDS.length;

  console.log(`\n   ✅ Resolved: ${resolved}/${total}`);
  if (resolved < total) {
    console.log(`   ⚠️  Missed: ${total - resolved}`);
  }

  // Print cue map
  console.log('\n📋 Cue Map:');
  for (const [id, time] of Object.entries(cueMap)) {
    console.log(`   ${id}: ${(time as number).toFixed(2)}s`);
  }

  // Save transcript JSON
  await fs.mkdir(TRANSCRIPT_DIR, { recursive: true });
  const transcriptData = {
    audio: 'proof-notation-narration.mp3',
    duration,
    wordCount: words.length,
    text: result.text,
    words,
    cues: cueMap,
    generatedAt: new Date().toISOString(),
  };
  await fs.writeFile(TRANSCRIPT_PATH, JSON.stringify(transcriptData, null, 2));
  console.log(`\n💾 Transcript saved: ${TRANSCRIPT_PATH}`);

  // Print TypeScript-ready DEFAULT_CUES
  console.log('\n📋 TypeScript DEFAULT_CUES (copy-paste ready):');
  console.log('const DEFAULT_CUES: Record<string, number> = {');
  for (const [id, time] of Object.entries(cueMap)) {
    console.log(`  '${id}': ${(time as number).toFixed(2)},`);
  }
  console.log('};');

  // Print full word list for manual correction
  console.log('\n📋 Full word list (for manual resolution):');
  words.forEach((w, i) => {
    console.log(`   [${i}] ${w.start.toFixed(2)}s "${w.word}"`);
  });
}

main().catch(console.error);
