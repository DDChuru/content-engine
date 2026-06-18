/**
 * Transcribe Food Tests TikTok narration with Whisper
 * and resolve 30 cue keywords to word-level timestamps.
 *
 * Single audio file → word timestamps → cue map → JSON output
 *
 * Usage: npx tsx src/scripts/transcribe-food-tests.ts
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
dotenv.config({ path: path.resolve(__dirname, '../../../.env'), override: false });

const AUDIO_PATH = path.resolve(
  __dirname,
  '../remotion/public/audio/biology/food-tests-narration.mp3'
);
const TRANSCRIPT_DIR = path.resolve(
  __dirname,
  '../remotion/public/transcripts/biology'
);
const TRANSCRIPT_PATH = path.join(TRANSCRIPT_DIR, 'food-tests.json');

const FPS = 30;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Cue keywords to resolve ─────────────────────────────────────────
// These match the {{cue:xxx}} markers from the narration script.
// Order matters for disambiguation — earlier entries get priority.
const CUE_KEYWORDS: { id: string; keyword: string; searchTerms: string[] }[] = [
  { id: 'four', keyword: 'Four', searchTerms: ['four'] },
  { id: 'benedicts', keyword: "Benedict's", searchTerms: ["benedict's", 'benedicts'] },
  { id: 'reducing', keyword: 'reducing', searchTerms: ['reducing'] },
  { id: 'sample-1', keyword: 'sample', searchTerms: ['sample'] },
  { id: 'heat', keyword: 'Heat', searchTerms: ['heat'] },
  { id: 'blue-green', keyword: 'blue', searchTerms: ['blue'] },
  { id: 'yellow', keyword: 'yellow', searchTerms: ['yellow'] },
  { id: 'orange', keyword: 'orange', searchTerms: ['orange'] },
  { id: 'brick-red', keyword: 'brick-red', searchTerms: ['brick', 'brick-red'] },
  { id: 'formula-benedict', keyword: 'sugar', searchTerms: ['sugar', 'more'] },
  { id: 'iodine', keyword: 'iodine', searchTerms: ['iodine'] },
  { id: 'drop', keyword: 'Drop', searchTerms: ['drop'] },
  { id: 'brown', keyword: 'brown', searchTerms: ['brown'] },
  { id: 'blue-black', keyword: 'blue-black', searchTerms: ['blue-black', 'boom'] },
  { id: 'starch-result', keyword: 'blue-black', searchTerms: ['blue-black'] },
  { id: 'emulsion', keyword: 'emulsion', searchTerms: ['emulsion'] },
  { id: 'ethanol', keyword: 'ethanol', searchTerms: ['ethanol'] },
  { id: 'water', keyword: 'water', searchTerms: ['water', 'pour'] },
  { id: 'milky', keyword: 'milky', searchTerms: ['milky'] },
  { id: 'milky-result', keyword: 'milky-white', searchTerms: ['milky-white', 'milky', 'white'] },
  { id: 'biuret', keyword: 'Biuret', searchTerms: ['biuret'] },
  { id: 'naoh', keyword: 'sodium', searchTerms: ['sodium'] },
  { id: 'cuso4', keyword: 'copper', searchTerms: ['copper'] },
  { id: 'blue-stays', keyword: 'Stays', searchTerms: ['stays'] },
  { id: 'purple', keyword: 'purple', searchTerms: ['purple'] },
  { id: 'protein-result', keyword: 'Peptide', searchTerms: ['peptide'] },
  { id: 'summary', keyword: 'Four', searchTerms: ['four'] },
  { id: 'save', keyword: 'Save', searchTerms: ['save'] },
];

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

// ── Resolve cue keywords against word timestamps ─────────────────────

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

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log('🧪 Food Tests TikTok — Transcription & Cue Resolution');
  console.log('======================================================\n');

  // Verify audio exists
  try {
    await fs.access(AUDIO_PATH);
  } catch {
    console.error(`❌ Audio not found: ${AUDIO_PATH}`);
    console.error('   Run generate-food-tests-assets.ts first.');
    process.exit(1);
  }

  const stats = await fs.stat(AUDIO_PATH);
  console.log(`🎵 Audio: ${AUDIO_PATH}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(0)} KB\n`);

  // Send to Whisper
  console.log('📡 Sending to Whisper API...');
  const fileBuffer = await fs.readFile(AUDIO_PATH);
  const uploadFile = await toFile(fileBuffer, 'food-tests-narration.mp3');

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
  const missed = CUE_KEYWORDS.length - resolved;

  console.log(`\n   ✅ Resolved: ${resolved}/${CUE_KEYWORDS.length}`);
  if (missed > 0) {
    console.log(`   ⚠️  Missed: ${missed}`);
  }

  // Print cue table
  console.log('\n📋 Cue Map:');
  console.log('   ─────────────────────────────────────');
  for (const cue of CUE_KEYWORDS) {
    const time = cueMap[cue.id];
    const status = time !== undefined ? `${time.toFixed(2)}s (frame ${Math.round(time * FPS)})` : '❌ MISSING';
    console.log(`   ${cue.id.padEnd(20)} ${status}`);
  }
  console.log('   ─────────────────────────────────────');

  // Save full transcript + cue map
  await fs.mkdir(TRANSCRIPT_DIR, { recursive: true });

  const output = {
    audioFile: 'audio/biology/food-tests-narration.mp3',
    duration,
    text: result.text,
    wordCount: words.length,
    words,
    segments: result.segments || [],
    cueMap,
    cueCount: { resolved, missed, total: CUE_KEYWORDS.length },
    generatedAt: new Date().toISOString(),
  };

  await fs.writeFile(TRANSCRIPT_PATH, JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved: ${TRANSCRIPT_PATH}`);

  // Print TypeScript-ready cue overrides
  console.log('\n📋 TypeScript cueOverrides (copy-paste ready):');
  console.log('const RESOLVED_CUES: Record<string, number> = {');
  for (const [id, time] of Object.entries(cueMap).toSorted(([, a], [, b]) => a - b)) {
    console.log(`  '${id}': ${time.toFixed(2)},`);
  }
  console.log('};');

  // Summary
  console.log('\n======================================================');
  console.log('📊 SUMMARY');
  console.log(`   Duration:      ${duration.toFixed(1)}s`);
  console.log(`   Words:         ${words.length}`);
  console.log(`   Cues resolved: ${resolved}/${CUE_KEYWORDS.length}`);
  console.log(`   Whisper cost:  ~$${(duration / 60 * 0.006).toFixed(4)}`);
  console.log('======================================================\n');

  if (missed > 0) {
    console.log('⚠️  Some cues missed. Check the transcript and adjust searchTerms.');
  }

  console.log('✅ Next: Update BiologyFoodTestsTikTok.tsx DEFAULT_CUES or pass cueOverrides');
  console.log('   Then: npx remotion studio → select BiologyFoodTests-TikTok');
}

main().catch(console.error);
