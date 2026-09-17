#!/usr/bin/env node
/**
 * Seed content/catalogue/exam-catalogue.json into the Convex catalogue tables.
 *
 *   export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
 *   node scripts/seed-exam-catalogue.mjs [--dry] [--patch]
 *
 * WHICH WAY DOES THE DATA FLOW? Both ways, once each, and not at the same time:
 *
 *   - `seed` (this script) bootstraps an empty deployment from the repo. It is
 *     INSERT-ONLY by default: rows that already exist are left exactly as they
 *     are, because after the first seed the TABLES are the source of truth and a
 *     board added through the admin screen must not be reverted by whoever runs
 *     the seed next. It never retires anything either, for the same reason.
 *   - `scripts/export-exam-catalogue.mjs` writes the live tables back to the JSON,
 *     which is what keeps a runtime-editable exam-board list reviewable in a git
 *     diff. 4024 is Mathematics at Cambridge and Chemistry at ZIMSEC; a diff is
 *     how that gets caught.
 *
 * `--patch` is the deliberate "the file wins" switch — restoring a deployment
 * from the reviewed file, not a routine run.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const PATCH = process.argv.includes('--patch');

const doc = JSON.parse(
  fs.readFileSync(path.join(root, 'content/catalogue/exam-catalogue.json'), 'utf8')
);

// `version` / `generatedBy` are for the reader of the file; the mutation validator
// takes the six row lists and nothing else.
const payload = JSON.stringify({
  doc: {
    countries: doc.countries,
    bodies: doc.bodies,
    countryBodies: doc.countryBodies,
    levels: doc.levels,
    series: doc.series,
    subjects: doc.subjects,
  },
  patchExisting: PATCH,
});

console.log(
  `${doc.countries.length} countries, ${doc.bodies.length} boards, ` +
    `${doc.countryBodies.length} country↔board offerings, ${doc.levels.length} levels, ` +
    `${doc.series.length} series, ${doc.subjects.length} subjects` +
    (PATCH ? ' — PATCHING existing rows' : '')
);

if (DRY) {
  console.log(payload);
  process.exit(0);
}

// `examCatalogue:seed` is an internalMutation — only the CLI may call it.
const run = spawnSync(
  'npx',
  ['convex', 'run', 'examCatalogue:seed', payload, '--push'],
  { cwd: root, stdio: 'inherit' }
);
process.exit(run.status ?? 1);
