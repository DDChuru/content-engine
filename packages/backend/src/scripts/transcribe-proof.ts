/**
 * Transcribe Mathematical Proof TikTok narration with Whisper
 * and resolve cue keywords to word-level timestamps.
 *
 * Usage: OPENAI_API_KEY=xxx npx tsx src/scripts/transcribe-proof.ts
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
  '../remotion/public/audio/maths/proof-narration.mp3'
);
const TRANSCRIPT_DIR = path.resolve(
  __dirname,
  '../remotion/public/transcripts/maths'
);
const TRANSCRIPT_PATH = path.join(TRANSCRIPT_DIR, 'proof.json');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Cue keywords to resolve ─────────────────────────────────────────
const CUE_KEYWORDS: { id: string; searchTerms: string[] }[] = [
  // Hook
  { id: 'prove', searchTerms: ['prove'] },
  // Intro
  { id: 'proof', searchTerms: ['proof'] },
  { id: 'go', searchTerms: ["go"] },
  { id: 'four-methods', searchTerms: ['four'] },
  // Deduction
  { id: 'deduction', searchTerms: ['deduction'] },
  { id: 'logical', searchTerms: ['logical'] },
  { id: 'even-numbers', searchTerms: ['sum'] },
  { id: 'two-a', searchTerms: ['two-a', '2a'] },
  { id: 'brackets', searchTerms: ['brackets'] },
  { id: 'proven', searchTerms: ['proven'] },
  // Exhaustion
  { id: 'exhaustion', searchTerms: ['exhaustion'] },
  { id: 'check-all', searchTerms: ['all'] },
  { id: 'n-squared', searchTerms: ['squared'] },
  { id: 'case-1', searchTerms: ['one'] },
  { id: 'case-2', searchTerms: ['six'] },
  { id: 'case-3', searchTerms: ['twelve'] },
  { id: 'all-cases', searchTerms: ['cases'] },
  // Contradiction
  { id: 'contradiction', searchTerms: ['contradiction'] },
  { id: 'opposite', searchTerms: ['opposite'] },
  { id: 'root-two', searchTerms: ['root'] },
  { id: 'assume', searchTerms: ['assume'] },
  { id: 'square-both', searchTerms: ['square'] },
  { id: 'a-even', searchTerms: ['even'] },
  { id: 'b-even', searchTerms: ['even'] },
  { id: 'lowest-terms', searchTerms: ['lowest'] },
  { id: 'contradiction-result', searchTerms: ['contradiction'] },
  { id: 'irrational', searchTerms: ['irrational'] },
  // Counter-example
  { id: 'counter-example', searchTerms: ['counter'] },
  { id: 'one-example', searchTerms: ['one'] },
  { id: 'primes-odd', searchTerms: ['primes', 'prime'] },
  { id: 'two-prime', searchTerms: ['two'] },
  { id: 'disproved', searchTerms: ['disproved'] },
  // Summary
  { id: 'summary-deduction', searchTerms: ['deduction'] },
  { id: 'summary-exhaustion', searchTerms: ['exhaustion'] },
  { id: 'summary-contradiction', searchTerms: ['contradiction'] },
  { id: 'summary-counter', searchTerms: ['counter'] },
  { id: 'four-final', searchTerms: ['four'] },
  // CTA
  { id: 'save', searchTerms: ['save'] },
  { id: 'exam', searchTerms: ['exam'] },
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

        if (wordClean === termLower || wordClean.includes(termLower)) {
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
  console.log('📐 Mathematical Proof TikTok — Transcription & Cue Resolution');
  console.log('================================================================\n');

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
  const uploadFile = await toFile(fileBuffer, 'proof-narration.mp3');

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
    audio: 'proof-narration.mp3',
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

  // Print word list for manual resolution of missed cues
  if (resolved < total) {
    console.log('\n📋 Full word list for manual resolution:');
    words.forEach((w, i) => {
      console.log(`   [${i}] ${w.start.toFixed(2)}s "${w.word}"`);
    });
  }
}

main().catch(console.error);
