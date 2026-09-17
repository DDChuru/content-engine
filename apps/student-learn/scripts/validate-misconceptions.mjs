#!/usr/bin/env node
/**
 * Validate content/misconceptions/*.json against real content, recompute
 * coverageState honestly, and sync `diagnosticFor` on the exercise banks.
 *
 * §9 coverage rule used here (per the build brief):
 *   covered  = >=1 notes page AND >=2 questions resolve
 *   partial  = something resolves, but not both thresholds
 *   uncovered= nothing resolves
 *
 * Usage:
 *   node scripts/validate-misconceptions.mjs          # report only
 *   node scripts/validate-misconceptions.mjs --write  # fix coverage + diagnosticFor
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');

const catPath = path.join(root, 'content/misconceptions/mechanics.json');
const bankPaths = fs
  .readdirSync(path.join(root, 'content/questions'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => path.join(root, 'content/questions', f));

const cat = JSON.parse(fs.readFileSync(catPath, 'utf8'));
const notesIndex = JSON.parse(
  fs.readFileSync(path.join(root, 'public/notes/index.json'), 'utf8')
);
const noteBySlug = new Map(notesIndex.topics.map((t) => [t.slug, t]));

const banks = bankPaths.map((p) => ({ p, data: JSON.parse(fs.readFileSync(p, 'utf8')) }));
const questionById = new Map();
for (const b of banks) for (const q of b.data.questions) questionById.set(q.id, q);

const syllabus = fs.readFileSync(path.join(root, 'lib/syllabus.ts'), 'utf8');
const syllabusCodes = new Set(
  [...syllabus.matchAll(/code:\s*'([^']+)'/g)].map((m) => m[1])
);

const errors = [];
const warnings = [];
const seen = new Set();
const tally = { covered: 0, partial: 0, uncovered: 0 };
/** code -> questionIds, for the diagnosticFor sync */
const diagnostics = new Map();

for (const item of cat.items) {
  if (seen.has(item.code)) errors.push(`duplicate code ${item.code}`);
  seen.add(item.code);

  if (!syllabusCodes.has(item.syllabusCode))
    errors.push(`${item.code}: syllabusCode ${item.syllabusCode} not in lib/syllabus.ts`);
  if (item.syllabusCode.endsWith('-fable'))
    errors.push(`${item.code}: keyed to a -fable duplicate topic (amendment G)`);
  if (!item.code.startsWith(item.syllabusCode + '-'))
    errors.push(`${item.code}: code is not prefixed by its syllabusCode`);

  const notes = item.resolvesTo.noteSlugs.filter((s) => {
    const t = noteBySlug.get(s);
    if (!t) { errors.push(`${item.code}: note slug "${s}" not in public/notes/index.json`); return false; }
    if (!fs.existsSync(path.join(root, 'public', t.notes))) {
      errors.push(`${item.code}: note file missing for "${s}"`); return false;
    }
    return true;
  });
  const videos = item.resolvesTo.videoIds.filter((v) => {
    if (!fs.existsSync(path.join(root, 'public/videos', `${v}.mp4`))) {
      warnings.push(`${item.code}: video "${v}.mp4" not on disk — dropped`); return false;
    }
    return true;
  });
  const questions = item.resolvesTo.questionIds.filter((q) => {
    if (!questionById.has(q)) { errors.push(`${item.code}: question "${q}" does not exist`); return false; }
    return true;
  });

  for (const q of questions) {
    if (!diagnostics.has(q)) diagnostics.set(q, []);
    diagnostics.get(q).push(item.code);
  }

  const hasLesson = notes.length > 0;
  const state =
    hasLesson && questions.length >= 2 ? 'covered'
    : hasLesson || questions.length > 0 ? 'partial'
    : 'uncovered';
  tally[state] += 1;

  if (state !== item.coverageState) {
    const msg = `${item.code}: coverageState "${item.coverageState}" -> "${state}" (${notes.length} notes, ${questions.length} questions)`;
    if (WRITE) { item.coverageState = state; warnings.push('fixed  ' + msg); }
    else errors.push(msg);
  }
  item.resolvesTo = { noteSlugs: notes, videoIds: videos, questionIds: questions };
}

// --- sync diagnosticFor on the question banks -----------------------------
let bankChanges = 0;
for (const b of banks) {
  for (const q of b.data.questions) {
    const want = (diagnostics.get(q.id) ?? []).sort();
    const have = [...(q.diagnosticFor ?? [])].sort();
    if (JSON.stringify(want) !== JSON.stringify(have)) {
      bankChanges += 1;
      warnings.push(`${q.id}: diagnosticFor ${JSON.stringify(have)} -> ${JSON.stringify(want)}`);
      if (WRITE) {
        if (want.length) q.diagnosticFor = want;
        else delete q.diagnosticFor;
      }
    }
  }
}

if (WRITE) {
  fs.writeFileSync(catPath, JSON.stringify(cat, null, 2) + '\n');
  for (const b of banks) fs.writeFileSync(b.p, JSON.stringify(b.data, null, 2) + '\n');
}

console.log(`catalogue: ${cat.items.length} items`);
console.log(`coverage:  covered ${tally.covered} · partial ${tally.partial} · uncovered ${tally.uncovered}`);
console.log(`questions: ${questionById.size} in bank, ${diagnostics.size} carry a diagnostic, ${bankChanges} change(s)`);
for (const w of warnings) console.log('  warn  ' + w);
for (const e of errors) console.log('  ERROR ' + e);
if (errors.length && !WRITE) process.exit(1);
