#!/usr/bin/env node
/**
 * Export the LIVE Convex catalogue back into content/catalogue/exam-catalogue.json.
 *
 *   export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
 *   node scripts/export-exam-catalogue.mjs [--check]
 *
 * Why this exists. The catalogue is editable at runtime, which is what the owner
 * asked for — adding a board must not need a deploy. The cost of that is that
 * exam-board data stops being reviewed. This buys it back: run the export, commit
 * the diff, and a wrong subject code is a line in a pull request rather than a
 * surprise on an entry slip (4024 is Mathematics at Cambridge and Chemistry at
 * ZIMSEC — that is the class of mistake a diff catches and a form does not).
 *
 * `--check` writes nothing and exits 1 if the file is out of date, for CI.
 *
 * The file is a MIRROR. Convex is the source of truth after the first seed; do not
 * hand-edit this JSON expecting the app to change — use the admin screen, then run
 * this. (`seed --patch` is the one path that pushes the file back the other way.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const target = path.join(root, 'content/catalogue/exam-catalogue.json');

const run = spawnSync('npx', ['convex', 'run', 'examCatalogue:exportAll', '{}'], {
  cwd: root,
  encoding: 'utf8',
});
if (run.status !== 0) {
  process.stderr.write(run.stderr ?? '');
  process.exit(run.status ?? 1);
}

// The CLI prints the JSON result; anything it logs first is not ours.
const text = run.stdout.slice(run.stdout.indexOf('{'));
const live = JSON.parse(text);

const previous = fs.existsSync(target)
  ? JSON.parse(fs.readFileSync(target, 'utf8'))
  : {};

const next =
  JSON.stringify(
    {
      // Stamped from the export, not from the hand that ran it: the date answers
      // "how stale is this file" and nothing else.
      version: new Date().toISOString().slice(0, 10),
      generatedBy: 'scripts/export-exam-catalogue.mjs — exported from Convex',
      ...live,
    },
    null,
    2
  ) + '\n';

// Compare the rows only, so a re-export on a new day is not a diff by itself.
const rowsOf = (doc) =>
  JSON.stringify({
    countries: doc.countries ?? [],
    bodies: doc.bodies ?? [],
    countryBodies: doc.countryBodies ?? [],
    levels: doc.levels ?? [],
    series: doc.series ?? [],
    subjects: doc.subjects ?? [],
  });
const changed = rowsOf(previous) !== rowsOf(live);

if (CHECK) {
  console.log(
    changed
      ? 'exam-catalogue.json is OUT OF DATE — run node scripts/export-exam-catalogue.mjs'
      : 'exam-catalogue.json matches the live catalogue.'
  );
  process.exit(changed ? 1 : 0);
}

if (!changed) {
  console.log('No catalogue changes. File left alone.');
  process.exit(0);
}

fs.writeFileSync(target, next);
console.log(
  `Wrote ${path.relative(root, target)} — ` +
    `${live.countries.length} countries, ${live.bodies.length} boards, ` +
    `${live.countryBodies.length} offerings, ${live.levels.length} levels, ` +
    `${live.series.length} series, ${live.subjects.length} subjects. ` +
    'Review the diff before committing.'
);
