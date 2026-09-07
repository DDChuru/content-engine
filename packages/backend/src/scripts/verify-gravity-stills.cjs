/* Still-only audit: no renderMedia and no video output. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { bundle } = require('@remotion/bundler');
const { openBrowser, selectComposition, renderStill } = require('@remotion/renderer');

const topic = process.argv[2] || 'derived-units';
assert.equal(topic, 'derived-units');
const root = path.resolve(__dirname, '../..');
const project = path.join(root, 'projects', `mechanics-${topic}`);
const output = path.join(root, 'out', `verify-gravity-${topic}`);
const transcript = JSON.parse(fs.readFileSync(path.join(root, `src/remotion/public/transcripts/mechanics/${topic}.json`)));
const changed = ['s08'];
const figures = { s08: { 'ten-gravity': 'derived-gravity', 'one-kilogram': 'derived-mass', 'one-times': 'derived-mass', 'ten-substitution': 'derived-gravity', 'ten-newtons': 'derived-weight' } };

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const serveUrl = await bundle({ entryPoint: path.join(__dirname, 'verify-gravity-entry.tsx'), publicDir: null, outDir: path.join(output, 'verify-bundle') });
  const bundleDir = path.join(output, 'verify-bundle');
  const digest = crypto.createHash('sha256');
  for (const file of fs.readdirSync(bundleDir).filter((name) => name.endsWith('.js')).sort()) digest.update(fs.readFileSync(path.join(bundleDir, file)));
  const bundleSha256 = digest.digest('hex');
  const launch = () => openBrowser('chrome', { browserExecutable: '/usr/bin/google-chrome', chromiumOptions: { gl: 'angle' } });
  let browser = await launch();
  try {
    const composition = await selectComposition({ serveUrl, id: 'MechanicsDerivedUnits', puppeteerInstance: browser });
    const plan = new Map();
    const add = (frame, scene, label, ring) => {
      if (!plan.has(frame)) plan.set(frame, { frame, scene, labels: [], expectedRings: [] });
      const row = plan.get(frame);
      row.labels.push(label);
      if (ring) row.expectedRings.push(ring);
    };
    let offset = 0;
    for (const scene of transcript.scenes) {
      if (changed.includes(scene.id)) {
        add(offset + 20, scene.id, 'opening');
        for (let t = 2; t < scene.duration - 0.5; t += 2) add(offset + Math.round(t * 30), scene.id, 'dwell');
        for (const [cue, time] of Object.entries(scene.cues)) {
          for (const delta of [0, 0.4, 1.5]) {
            if (time + delta < 0.5 || time + delta >= scene.duration) continue;
            add(offset + Math.ceil((time + delta) * 30), scene.id, `${cue}+${delta}`, figures[scene.id]?.[cue]);
          }
        }
        add(offset + Math.floor(scene.duration * 30) - 1, scene.id, 'final-hold');
      }
      if (scene.id === 's06') {
        for (const cue of ['numerator', 'seventy-two-times', 'denominator', 'seventy-two-thousand-division', 'twenty-metres-per-second']) add(offset + Math.ceil((scene.cues[cue] + 0.9) * 30), scene.id, cue);
      }
      offset += Math.ceil(scene.duration * 30);
    }
    const rows = [];
    for (const item of [...plan.values()].sort((a, b) => a.frame - b.frame)) {
      const evidence = path.join(output, `verify-${item.frame}.json`);
      if (fs.existsSync(evidence)) {
        const cached = JSON.parse(fs.readFileSync(evidence));
        if (cached.bundleSha256 === bundleSha256) { rows.push({ ...item, ...cached.measurement }); continue; }
      }
      let measurement;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await renderStill({ serveUrl, composition, puppeteerInstance: browser, frame: item.frame, scale: 0.5, imageFormat: 'png', output: path.join(output, `verify-${item.frame}.png`), onArtifact: (artifact) => { measurement = JSON.parse(Buffer.from(artifact.content).toString()); } });
          break;
        } catch (error) {
          if (attempt === 2) throw error;
          await browser.close({ silent: true }).catch(() => {});
          browser = await launch();
        }
      }
      assert(measurement, `Missing measurement for ${item.frame}`);
      fs.writeFileSync(evidence, JSON.stringify({ bundleSha256, measurement }) + '\n');
      rows.push({ ...item, ...measurement });
      console.log(`Still ${item.frame}: ${item.labels.join(', ')}`);
    }
    const violations = rows.flatMap((row) => {
      const missing = row.expectedRings.filter((id) => !row.rings.some((ring) => ring.id === id && ring.encloses && ring.progress > 0));
      return row.collisions.length || row.overflow.length || missing.length || (changed.includes(row.scene) && !row.diagrams.length) || (row.working.length && !row.formulas.length)
        ? [{ frame: row.frame, collisions: row.collisions, overflow: row.overflow, missing, diagrams: row.diagrams, formulas: row.formulas }] : [];
    });
    const report = { topic, durationFrames: composition.durationInFrames, stillCount: rows.length, violations, measurements: rows };
    fs.writeFileSync(path.join(project, 'verify-gravity-stills.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ stillCount: rows.length, violations }, null, 2));
    assert.equal(violations.length, 0);
  } finally {
    await browser.close({ silent: true });
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
