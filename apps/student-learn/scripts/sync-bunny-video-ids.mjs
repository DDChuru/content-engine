/**
 * Stamp the Bunny Stream GUIDs from `content/bunny-video-map.json` onto the topics
 * in `public/notes/index.json`.
 *
 * The map is keyed by the render's filename stem, which is the same string as a
 * topic's `slug` — that coincidence is the whole join, so this script exists to
 * make it a checked one rather than a hand edit. Run it after uploading new
 * renders to Bunny; it reports any topic left without a video and any GUID that
 * matches no topic, which is how a typo in a slug gets found.
 *
 *   node scripts/sync-bunny-video-ids.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const mapPath = join(root, 'content/bunny-video-map.json');
const indexPath = join(root, 'public/notes/index.json');

const map = JSON.parse(readFileSync(mapPath, 'utf8'));
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

let changed = 0;
const missing = [];
const used = new Set();

for (const topic of index.topics) {
  const entry = map[topic.slug];
  if (!entry?.guid) {
    missing.push(topic.slug);
    continue;
  }
  used.add(topic.slug);
  if (topic.videoId !== entry.guid) {
    topic.videoId = entry.guid;
    changed += 1;
  }
}

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const orphans = Object.keys(map).filter((slug) => !used.has(slug));
console.log(`${index.topics.length} topics · ${changed} updated`);
if (missing.length) console.warn(`No Bunny video for: ${missing.join(', ')}`);
if (orphans.length) console.warn(`Uploaded but on no topic: ${orphans.join(', ')}`);
