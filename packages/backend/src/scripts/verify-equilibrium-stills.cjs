/* Still-only audit: rendered pixels, geometry, pen finish, figures and silent holds. */
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const { bundle } = require("@remotion/bundler");
const {
  openBrowser,
  selectComposition,
  renderStill,
} = require("@remotion/renderer");
const sharp = require("sharp");
const root = path.resolve(__dirname, "../.."),
  out = path.join(root, "out/verify-equilibrium-stills");
const transcript = JSON.parse(
  fs.readFileSync(
    path.join(
      root,
      "src/remotion/public/transcripts/mechanics/equilibrium-in-1d.json",
    ),
  ),
);
const selected = process.argv.includes("--sample");
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const serveUrl = await bundle({
    entryPoint: path.join(__dirname, "verify-equilibrium-entry.tsx"),
    publicDir: null,
    outDir: path.join(root, "out/verify-equilibrium-bundle"),
  });
  const browser = await openBrowser("chrome", {
    browserExecutable: "/usr/bin/google-chrome",
    chromiumOptions: { gl: "angle" },
  });
  try {
    const inputProps = { audioEnabled: false, audit: true };
    const composition = await selectComposition({
      serveUrl,
      id: "MechanicsEquilibriumIn1D",
      inputProps,
      puppeteerInstance: browser,
    });
    const offsets = {};
    let offset = 0;
    for (const s of transcript.scenes) {
      offsets[s.id] = offset;
      offset += Math.ceil(s.duration * 30);
    }
    assert.equal(composition.durationInFrames, offset);
    assert.equal(composition.width, 1920);
    assert.equal(composition.height, 1080);
    async function capture(frame) {
      let row;
      const file = path.join(
        out,
        `verify-${String(frame).padStart(5, "0")}.png`,
      );
      await renderStill({
        serveUrl,
        composition,
        inputProps,
        puppeteerInstance: browser,
        frame,
        scale: 0.5,
        imageFormat: "png",
        output: file,
        onArtifact: (a) => {
          row = JSON.parse(Buffer.from(a.content).toString());
        },
      });
      assert(row, `Missing layout artifact at ${frame}`);
      const { data, info } = await sharp(file)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      row.pixelCounts = row.visuals.map((v) => {
        let count = 0;
        const left = Math.max(0, Math.floor(v.x / 2)),
          top = Math.max(0, Math.floor(v.y / 2)),
          right = Math.min(info.width, Math.ceil((v.x + v.w) / 2)),
          bottom = Math.min(info.height, Math.ceil((v.y + v.h) / 2));
        for (let y = top; y < bottom; y++)
          for (let x = left; x < right; x++) {
            const k = (y * info.width + x) * 4;
            if (
              Math.abs(data[k] - 23) +
                Math.abs(data[k + 1] - 28) +
                Math.abs(data[k + 2] - 32) >
              65
            )
              count++;
          }
        return { kind: v.kind, count };
      });
      row.pixelPassed =
        row.pixelCounts.length > 0 &&
        row.pixelCounts.every((v) => v.count > 300);
      fs.writeFileSync(
        path.join(out, `verify-${String(frame).padStart(5, "0")}.json`),
        JSON.stringify(row),
      );
      return row;
    }
    const first = await capture(0),
      plan = new Map(),
      holds = [];
    const add = (frame, label, event) => {
      if (frame < 0 || frame >= offset) return;
      if (!plan.has(frame))
        plan.set(frame, { frame, labels: [], expectedRings: [] });
      const p = plan.get(frame);
      p.labels.push(label);
      if (event) p.expectedRings.push(event);
    };
    for (const s of transcript.scenes) {
      const base = offsets[s.id];
      add(base, "scene start");
      add(base + Math.floor(s.duration * 15), "midpoint");
      add(base + Math.ceil(s.duration * 30) - 1, "scene end");
      if (!selected) {
        for (const [key, t] of Object.entries(s.cues)) {
          add(base + Math.ceil(t * 30), `cue:${key}`);
          add(base + Math.ceil(t * 30) + 12, `cue:${key} + .4s`);
        }
        for (const h of s.holds.filter((h) => h.kind === "hold")) {
          const a = base + Math.ceil(h.start * 30) + 1,
            b = base + Math.floor(h.end * 30) - 1;
          add(a, "hold start");
          add(b, "hold end");
          holds.push({ scene: s.id, start: a, end: b, duration: h.duration });
        }
      }
    }
    for (const l of first.lineSchedule) {
      for (const t of [l.start + 0.1, (l.start + l.end) / 2, l.end + 0.05])
        add(offsets[l.scene] + Math.ceil(t * 30), `ink:${l.id}`);
    }
    if (!selected)
      for (const e of first.figureSchedule) {
        for (const delta of [0, 0.4])
          add(
            offsets[e.scene] + Math.ceil((e.start + delta) * 30),
            `ring:${e.id}`,
            e,
          );
      }
    if (!selected)
      for (const key of ["problem", "find", "resultant"]) {
        const s = transcript.scenes.find((s) => s.id === "s04");
        const edge = s.cueEdges[key];
        add(
          offsets.s04 + Math.ceil(((edge.start + edge.end) / 2) * 30),
          `underline:${key}`,
        );
      }
    const items = [...plan.values()].sort((a, b) => a.frame - b.frame),
      rows = [];
    let cursor = 0;
    await Promise.all(
      Array.from({ length: 2 }, async () => {
        while (cursor < items.length) {
          const item = items[cursor++];
          let row = item.frame === 0 ? first : await capture(item.frame);
          let attempts = 0;
          while (!row.pixelPassed && attempts++ < 2)
            row = await capture(item.frame);
          rows.push({ ...row, ...item });
          if (cursor % 20 === 0)
            console.log("Stills", cursor, "/", items.length);
        }
      }),
    );
    const violations = [];
    const intersects = (a, b) =>
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    for (const row of rows) {
      const missing = row.expectedRings.filter(
        (e) => !row.rings.some((r) => r.target === e.target),
      );
      const badCards = row.cards.filter(
        (s) => s.trim().split(/\s+/).length > 12,
      );
      const regionBad = row.regions > 3;
      const ringCollisions = [];
      // Rings may surround their own labels; they must not obscure other printed labels.
      for (const ring of row.rings) {
        const target = row.figures.find(
          (f) => f.id === ring.target && intersects(f, ring),
        );
        if (!target) continue;
        for (const label of row.texts) {
          if (target.text === label.text || intersects(target, label)) continue;
          if (intersects(ring, label))
            ringCollisions.push([ring.target, label.text]);
        }
      }
      if (
        regionBad ||
        !row.pixelPassed ||
        row.overflow.length ||
        row.collisions.length ||
        missing.length ||
        badCards.length ||
        ringCollisions.length
      )
        violations.push({
          frame: row.frame,
          regions: row.regions,
          pixelPassed: row.pixelPassed,
          overflow: row.overflow,
          collisions: row.collisions,
          missing: missing.map((e) => e.id),
          badCards,
          ringCollisions,
        });
    }
    const hash = (f) =>
      crypto
        .createHash("sha256")
        .update(
          fs.readFileSync(
            path.join(out, `verify-${String(f).padStart(5, "0")}.png`),
          ),
        )
        .digest("hex");
    for (const h of holds) {
      // Chromium can occasionally capture before the final SVG paint. Repaint
      // both endpoints; a hold still fails unless the actual PNGs are identical.
      h.captureRetries = 0;
      while (hash(h.start) !== hash(h.end) && h.captureRetries < 3) {
        h.captureRetries++;
        for (const frame of [h.start, h.end]) {
          Object.assign(
            rows.find((row) => row.frame === frame),
            await capture(frame),
          );
        }
      }
      h.identical = hash(h.start) === hash(h.end);
      if (!h.identical) violations.push({ hold: h });
    }
    const report = {
      passed: !violations.length,
      durationFrames: offset,
      seconds: offset / 30,
      stillCount: rows.length,
      figureCount: first.figureSchedule.length,
      holds,
      violations,
      measurements: rows,
    };
    fs.writeFileSync(
      path.join(out, "verify-stills-report.json"),
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(
      JSON.stringify(
        {
          passed: report.passed,
          frames: offset,
          stills: rows.length,
          figures: report.figureCount,
          holds: holds.length,
          violations,
        },
        null,
        2,
      ),
    );
    assert.equal(violations.length, 0, "See verify-stills-report.json");
  } finally {
    await browser.close({ silent: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
