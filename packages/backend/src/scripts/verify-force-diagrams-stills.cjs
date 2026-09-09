/* Still-only proof: no renderMedia or video output. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {bundle} = require('@remotion/bundler');
const {openBrowser, selectComposition, renderStill} = require('@remotion/renderer');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../..');
const project = path.join(root, 'projects/mechanics-force-diagrams');
const output = path.join(root, 'out/verify-force-diagrams-stills');
const transcript = JSON.parse(fs.readFileSync(path.join(root, 'src/remotion/public/transcripts/mechanics/force-diagrams.json')));
(async () => {
  fs.mkdirSync(output, {recursive: true});
  const serveUrl = await bundle({entryPoint: path.join(__dirname, 'verify-force-diagrams-entry.tsx'), publicDir: null,
    outDir: path.join(root, 'out/verify-force-diagrams-bundle')});
  const browser = await openBrowser('chrome', {browserExecutable: '/usr/bin/google-chrome', chromiumOptions: {gl: 'angle'}});
  try {
    const inputProps = {audioEnabled: false, audit: true};
    const composition = await selectComposition({serveUrl, id: 'MechanicsForceDiagrams', inputProps, puppeteerInstance: browser});
    assert.equal(composition.width, 1920); assert.equal(composition.height, 1080); assert.equal(composition.fps, 30);
    assert(composition.durationInFrames >= 9000 && composition.durationInFrames <= 10800);
    const capture = async frame => {
      let row;
      await renderStill({serveUrl, composition, inputProps, puppeteerInstance: browser, frame, scale: .5,
        timeoutInMilliseconds: 90000, imageFormat: 'png', output: path.join(output, frame + '.png'),
        onArtifact: artifact => {row = JSON.parse(Buffer.from(artifact.content).toString());}});
      assert(row, 'Missing browser layout artifact'); return row;
    };
    const first = await capture(0);
    const schedule = first.schedule;
    assert(schedule?.length, 'Missing arrow schedule');
    const frames = new Map(), holds = [], offsets = {};
    const add = (frame, label) => {
      if (frame < 0 || frame >= composition.durationInFrames) return;
      if (!frames.has(frame)) frames.set(frame, []);
      frames.get(frame).push(label);
    };
    let offset = 0;
    for (const s of transcript.scenes) {
      offsets[s.id] = offset;
      add(offset, s.id + ':start'); add(offset + Math.ceil(s.duration * 30) - 1, s.id + ':end');
      for (const [id, t] of Object.entries(s.cues)) add(offset + Math.ceil(t * 30) + 2, s.id + ':cue:' + id);
      for (const e of s.figures) add(offset + Math.ceil(e.start * 30) + 5, s.id + ':ring:' + e.id);
      for (const h of s.holds) {
        const start = offset + Math.ceil(h.start * 30), end = offset + Math.ceil(h.end * 30) - 1;
        add(start, s.id + ':hold-start'); add(end, s.id + ':hold-end'); holds.push({scene: s.id, start, end});
      }
      for (const a of schedule.filter(a => a.scene === s.id)) {
        add(offset + Math.ceil(a.end * 30), s.id + ':pen-finish:' + a.id);
        add(offset + Math.round((a.start + a.end) * 15), s.id + ':writing:' + a.id);
      }
      offset += Math.ceil(s.duration * 30);
    }
    const rows = [], items = [...frames].sort((a, b) => a[0] - b[0]); let next = 0;
    await Promise.all(Array.from({length: 2}, async () => {
      while (next < items.length) {
        const [frame, labels] = items[next++];
        const row = frame === 0 ? first : await capture(frame);
        rows.push({...row, labels});
        if (rows.length % 25 === 0) console.log('Audited stills', rows.length, '/', items.length);
      }
    }));
    rows.sort((a, b) => a.frame - b.frame);
    const issues = [];
    for (const row of rows) {
      if (row.regions > 3 || row.collisions.length || row.overflow.length || !row.visuals.length)
        issues.push({frame: row.frame, reason: 'layout', regions: row.regions, collisions: row.collisions, overflow: row.overflow});
      for (const caption of row.captions) if (caption.split(/\s+/).length > 8) issues.push({frame: row.frame, reason: 'caption length', caption});
      const {data, info} = await sharp(path.join(output, row.frame + '.png')).raw().toBuffer({resolveWithObject: true});
      let visualPixels = 0;
      for (let y = 120; y < Math.min(510, info.height); y += 2) for (let x = 40; x < Math.min(675, info.width); x += 2) {
        const i = (y * info.width + x) * info.channels;
        if (Math.abs(data[i] - 23) + Math.abs(data[i + 1] - 28) + Math.abs(data[i + 2] - 32) > 75) visualPixels++;
      }
      row.visualPixels = visualPixels;
      if (visualPixels < 150) issues.push({frame: row.frame, reason: 'blank diagram pixels', visualPixels});
      const s = transcript.scenes.find(s => s.id === row.scene);
      for (const label of row.labels.filter(l => l.includes(':ring:'))) {
        const e = s.figures.find(e => label.endsWith(':ring:' + e.id));
        if (!row.rings.some(r => r.target === e.target)) issues.push({frame: row.frame, reason: 'missing spoken ring', event: e});
      }
      for (const label of row.labels.filter(l => l.includes(':pen-finish:'))) {
        const id = label.split(':pen-finish:')[1];
        const arrow = schedule.find(a => a.scene === row.scene && a.id === id);
        if (!row.arrows.some(a => a.id === id && a.complete) || !row.ink.some(ink => ink.text === arrow.label && ink.complete && ink.finishedStrokes))
          issues.push({frame: row.frame, reason: 'unfinished pen', id});
      }
    }
    const hash = frame => crypto.createHash('sha256').update(fs.readFileSync(path.join(output, frame + '.png'))).digest('hex');
    const holdResults = holds.map(h => ({...h, identical: hash(h.start) === hash(h.end)}));
    for (const h of holdResults) {
      h.retries = 0;
      // Chrome occasionally leaves a few stale antialias pixels at tile edges.
      // Recapture both endpoints; retain the exact-pixel equality requirement.
      while (!h.identical && h.retries < 3) {
        h.retries++; await capture(h.start); await capture(h.end);
        h.identical = hash(h.start) === hash(h.end);
      }
      if (!h.identical) issues.push({...h, reason: 'hold changed'});
    }
    const report = {durationFrames: composition.durationInFrames, durationSeconds: composition.durationInFrames / 30,
      stillCount: rows.length, maxRegions: Math.max(...rows.map(r => r.regions)),
      penFinishChecks: rows.reduce((n, r) => n + r.labels.filter(l => l.includes(':pen-finish:')).length, 0),
      spokenRingChecks: rows.reduce((n, r) => n + r.labels.filter(l => l.includes(':ring:')).length, 0),
      holdResults, schedule, issues, measurements: rows};
    fs.writeFileSync(path.join(project, 'verify-stills.json'), JSON.stringify(report, null, 2) + '\n');
    for (const s of transcript.scenes) {
      const frame = offsets[s.id] + Math.ceil(s.duration * 30) - 1;
      fs.copyFileSync(path.join(output, frame + '.png'), path.join(project, 'verify-' + s.id + '-complete.png'));
    }
    console.log(JSON.stringify({...report, measurements: undefined, schedule: undefined}, null, 2));
    assert.equal(issues.length, 0, 'See verify-stills.json');
  } finally { await browser.close({silent: true}); }
})().catch(e => {console.error(e); process.exitCode = 1;});
