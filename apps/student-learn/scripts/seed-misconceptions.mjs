#!/usr/bin/env node
/**
 * Seed content/misconceptions/*.json into the Convex `misconceptionCatalogue`.
 *
 * The repo is the source of truth; Convex is a mirror. Re-running is idempotent
 * (upsert by `code`) and retires rows that no longer appear in the authored file.
 *
 *   export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
 *   node scripts/validate-misconceptions.mjs      # must pass first
 *   node scripts/seed-misconceptions.mjs [--dry]
 *
 * PROJECTION NOTE. The authored item resolves to many notes pages, many videos
 * and many questions, and carries `title` / `description` for the §7 picker.
 * The deployed table has only `lessonHref`, `videoId` and `questionIds`, so:
 *   lessonHref <- /notes/<first noteSlug>   (the rest are dropped)
 *   videoId    <- first videoId             (the rest are dropped)
 *   title/description are dropped entirely.
 * That loss is real — see the report. The JSON file keeps the full form.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');

// Read the deployment name from .env.local for the log line only. The convex
// CLI loads .env.local itself, so nothing here is exported into its environment.
const deployment =
  /^\s*CONVEX_DEPLOYMENT\s*=\s*([^\s#]+)/m.exec(
    fs.readFileSync(path.join(root, '.env.local'), 'utf8')
  )?.[1] ?? 'the default deployment';

const cat = JSON.parse(
  fs.readFileSync(path.join(root, 'content/misconceptions/mechanics.json'), 'utf8')
);

const rows = cat.items
  .filter((i) => i.state === 'active')
  .map((i) => ({
    code: i.code,
    topicCode: i.syllabusCode,
    wrongIdea: i.wrongIdea,
    whyWrong: i.whyWrong,
    correctUnderstanding: i.correctUnderstanding,
    severity: i.severity,
    coverage: i.coverageState,
    lessonHref: i.resolvesTo.noteSlugs[0] ? `/notes/${i.resolvesTo.noteSlugs[0]}` : undefined,
    videoId: i.resolvesTo.videoIds[0] ?? undefined,
    questionIds: i.resolvesTo.questionIds.length ? i.resolvesTo.questionIds : undefined,
  }));

console.log(`${rows.length} active items -> ${deployment}`);

const payload = JSON.stringify({ items: rows });

if (DRY) {
  console.log(payload);
  process.exit(0);
}

// `catalogue:seed` is an internalMutation — only the CLI may call it, which is
// the point: the list is closed and nothing client-reachable writes to it.
// `--push` uploads the current convex/ source first, so the function exists.
const run = spawnSync('npx', ['convex', 'run', 'catalogue:seed', payload, '--push'], {
  cwd: root,
  stdio: 'inherit',
});
process.exit(run.status ?? 1);
