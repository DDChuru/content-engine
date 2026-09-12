#!/usr/bin/env node
// Authoring checks only: no browser, rendering, dependency installation or mocks.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {createRequire, Module} = require('node:module');

const topic = __dirname;
const backend = path.resolve(topic, '../..');
const root = path.resolve(backend, '../..');
const installedBackend = process.env.MOMENTUM_VERIFY_DEPENDENCIES ||
  (fs.existsSync(path.join(backend, 'node_modules/typescript')) ? backend : path.resolve(root, '../content-engine/packages/backend'));
const dependencyRequire = createRequire(path.join(installedBackend, 'package.json'));
const tsPath = process.env.MOMENTUM_VERIFY_TYPESCRIPT || path.join(installedBackend, 'node_modules/typescript/lib/typescript.js');
const ts = require(tsPath);
const composition = path.join(backend, 'src/remotion/compositions/MechanicsMomentum.tsx');
const entry = path.join(backend, 'src/remotion/compositions/MechanicsMomentum.entry.tsx');
const helpers = path.join(backend, 'src/remotion/compositions/mechanics-momentum');
const inkFile = path.join(backend, 'src/remotion/compositions/mechanics-m42/Ink.tsx');
const presentationFile = path.join(backend, 'src/remotion/compositions/mechanics-m42/Presentation.tsx');
const transcriptFile = path.join(backend, 'src/remotion/public/transcripts/mechanics/momentum.json');
const reportFile = path.join(topic, 'verify-momentum-authored.json');
const report = {
  checkedAt: new Date().toISOString(),
  mode: 'authored-source-only',
  typescript: {version: ts.version, path: tsPath, dependencyBackend: installedBackend},
  checks: [],
  limitations: [
    'transpileModule diagnostics verify syntax/transpilation, not a complete TypeScript semantic build.',
    'No Remotion render, browser, DOM/font measurement, encoded video or preview was produced.',
    'Prepared pen geometry and source-derived wheel contact do not substitute for rendered frame inspection.',
    'Machine A must inspect complete setup, all number rings, result before/after frames, finished ink, motion extremes, holds and sign-axis reversal.',
    'Audio decoding, source narration matching and word-level Whisper provenance are verified by the separate narration verifier.',
  ],
};
const assert = (condition, message) => {if (!condition) throw new Error(message);};
const near = (actual, expected, tolerance, message) => assert(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} versus ${expected}`);
const read = file => fs.readFileSync(file, 'utf8');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const relative = file => path.relative(root, file);
function check(name, fn) {
  try {report.checks.push({name, status: 'pass', ...fn()});}
  catch (error) {report.checks.push({name, status: 'fail', error: String(error.message || error)});}
}
function walk(node, visitor) {visitor(node); ts.forEachChild(node, child => walk(child, visitor));}
function ast(file) {return ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, file.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);}
function number(node) {
  if (ts.isJsxExpression(node)) return number(node.expression);
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -number(node.operand);
  throw new Error(`Expected literal number, found ${node?.getText()}`);
}
function attrs(node) {
  return Object.fromEntries(node.attributes.properties.filter(ts.isJsxAttribute).map(a => [a.name.getText(), a.initializer]));
}
function simpleString(node, env) {
  if (ts.isJsxExpression(node)) return simpleString(node.expression, env);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isIdentifier(node) && node.text in env) return env[node.text];
  if (ts.isTemplateExpression(node)) return node.head.text + node.templateSpans.map(s => simpleString(s.expression, env) + s.literal.text).join('');
  if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'toLowerCase') return simpleString(node.expression.expression, env).toLowerCase();
  throw new Error(`Cannot statically resolve string: ${node?.getText()}`);
}
function transpile(file) {
  const result = ts.transpileModule(read(file), {fileName: file, reportDiagnostics: true, compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React,
    esModuleInterop: true, resolveJsonModule: true,
  }});
  const diagnostics = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert(!diagnostics.length, diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
  return result.outputText;
}
const moduleCache = new Map();
function loadActual(file) {
  if (moduleCache.has(file)) return moduleCache.get(file).exports;
  const loaded = new Module(file, module);
  loaded.filename = file;
  loaded.paths = Module._nodeModulePaths(path.dirname(file));
  loaded.require = request => {
    if (!request.startsWith('.')) return dependencyRequire(request);
    const base = path.resolve(path.dirname(file), request);
    const local = [base, `${base}.ts`, `${base}.tsx`, `${base}.json`].find(f => fs.existsSync(f) && fs.statSync(f).isFile());
    assert(local, `Missing actual local module: ${request}`);
    return local.endsWith('.json') ? JSON.parse(read(local)) : loadActual(local);
  };
  moduleCache.set(file, loaded);
  loaded._compile(transpile(file), file);
  return loaded.exports;
}

check('topic TS/TSX syntax and transpilation', () => {
  const files = [composition, entry, ...fs.readdirSync(helpers).filter(f => /\.tsx?$/.test(f)).map(f => path.join(helpers, f))];
  files.forEach(transpile);
  return {files: files.map(file => ({path: relative(file), sha256: hash(file)}))};
});

check('all planned handwritten glyphs and complete Paper extents', () => {
  const plan = JSON.parse(read(path.join(topic, 'narration-plan.json')));
  const {prepareLine} = loadActual(inkFile);
  assert(typeof prepareLine === 'function', 'Actual shared prepareLine export missing');
  const presentation = read(presentationFile).replace(/\s/g, '');
  assert(presentation.includes('Math.min(34,705/prepareLine(b.ink!,1).width)'), 'Shared Paper sizing changed; update independent extent inputs');
  assert(presentation.includes('x={42}y={60+i*105}'), 'Shared Paper line placement changed');
  const lines = [];
  for (const scene of plan.scenes) {
    const ink = scene.beats.filter(b => b.ink);
    const pageIndices = new Map();
    for (const beat of ink) {
      const page = beat.page || 0;
      const index = pageIndices.get(page) || 0;
      pageIndices.set(page, index + 1);
      const unit = prepareLine(beat.ink, 1);
      const size = Math.min(34, 705 / unit.width);
      const prepared = prepareLine(beat.ink, size);
      const points = prepared.strokes.flatMap(stroke => stroke.points);
      assert(points.length > 1, `${scene.id}:${beat.id}: no visible strokes`);
      const extent = {
        left: 42 + Math.min(...points.map(p => p[0])) - 1.55,
        right: 42 + Math.max(...points.map(p => p[0])) + 1.55,
        top: 60 + index * 105 + Math.min(...points.map(p => p[1])) - 1.55,
        bottom: 60 + index * 105 + Math.max(...points.map(p => p[1])) + 1.55,
      };
      assert(size > 0 && prepared.width <= 705 + 1e-8, `${scene.id}:${beat.id}: line width exceeds working area`);
      assert(extent.left >= 0 && extent.right <= 790 && extent.top >= 0 && extent.bottom <= 730, `${scene.id}:${beat.id}: full stroke extent exceeds 790×730 Paper`);
      assert(prepared.strokes.every(stroke => stroke.start >= 0 && stroke.end <= 1 && stroke.end > stroke.start), `${scene.id}:${beat.id}: invalid pen progress range`);
      lines.push({scene: scene.id, beat: beat.id, text: beat.ink, page, index, size, width: prepared.width, strokeCount: prepared.strokes.length, extent});
    }
  }
  assert(lines.length > 0, 'No planned handwriting found');
  return {inkModule: relative(inkFile), sha256: hash(inkFile), count: lines.length, lines};
});

check('actual motion direction, speed ratio, hold continuity and snapshot', () => {
  const motionFile = path.join(helpers, 'motion.ts');
  const {storyPositions} = loadActual(motionFile);
  const scenarios = [
    {name: 'unheld', start: 2, pass: 13, snapshot: 25, holds: []},
    {name: 'two true pauses', start: 2, pass: 23, snapshot: 31, holds: [{start: 6, end: 8}, {start: 16, end: 19}]},
    {name: 'long camera scale', start: 0, pass: 72, snapshot: 120, holds: [{start: 55, end: 59}]},
  ];
  if (fs.existsSync(transcriptFile)) {
    const data = JSON.parse(read(transcriptFile));
    const scene = data.scenes.find(s => s.mode === 'story');
    assert(scene, 'Actual story scene missing');
    assert(Number.isFinite(scene.cues.story) && Number.isFinite(scene.cues.pass) && Number.isFinite(scene.cues.freeze), 'Actual story/pass/freeze cues missing');
    scenarios.push({name: 'actual story transcript', start: scene.cues.story, pass: scene.cues.pass, snapshot: scene.cues.freeze, holds: scene.holds});
  }
  const tested = [];
  for (const {name, start, pass, snapshot, holds} of scenarios) {
    const effective = time => {
      const stop = Math.max(start, Math.min(time, snapshot));
      let elapsed = 0;
      let cursor = start;
      for (const hold of holds.filter(h => h.end > start && h.start < stop).sort((a, b) => a.start - b.start)) {
        assert(hold.end >= hold.start && hold.start >= cursor, `${name}: invalid or overlapping holds`);
        elapsed += Math.max(0, Math.min(stop, hold.start) - cursor);
        cursor = Math.min(stop, hold.end);
      }
      return elapsed + Math.max(0, stop - cursor);
    };
    const total = effective(snapshot);
    const first = storyPositions(start, start, pass, snapshot, holds);
    const last = storyPositions(snapshot, start, pass, snapshot, holds);
    const velocityA = (last.xA - first.xA) / total;
    const velocityB = (last.xB - first.xB) / total;
    // Independently require constant signed velocities through the moving clock;
    // positions and fitted speed are measured from the actual function endpoints.
    const expected = time => ({xA: first.xA + velocityA * effective(time), xB: first.xB + velocityB * effective(time)});
    let count = 0;
    for (let time = start - 1; time <= snapshot + 1; time += 1 / 30) {
      const actual = storyPositions(time, start, pass, snapshot, holds);
      const physics = expected(time);
      near(actual.xA, physics.xA, 1e-8, `${name} A at ${time}`);
      near(actual.xB, physics.xB, 1e-8, `${name} B at ${time}`);
      count++;
    }
    assert(last.xA > first.xA && last.xB < first.xB, `${name}: expected A right, B left`);
    near((last.xA - first.xA) / (first.xB - last.xB), 1.5, 1e-10, `${name}: speed ratio`);
    const crossing = storyPositions(pass, start, pass, snapshot, holds);
    near(crossing.xA, 450, 1e-8, `${name}: A crossing on spoken pass cue`);
    near(crossing.xB, 450, 1e-8, `${name}: B crossing on spoken pass cue`);
    for (const hold of holds) {
      if (hold.start < start || hold.end > snapshot) continue;
      const atStart = storyPositions(hold.start, start, pass, snapshot, holds);
      const middle = storyPositions((hold.start + hold.end) / 2, start, pass, snapshot, holds);
      const atEnd = storyPositions(hold.end, start, pass, snapshot, holds);
      for (const key of ['xA', 'xB']) {
        near(middle[key], atStart[key], 1e-9, `${name}: frozen ${key}`);
        near(atEnd[key], atStart[key], 1e-9, `${name}: hold-end ${key}`);
        const before = storyPositions(hold.start - 1e-6, start, pass, snapshot, holds);
        const after = storyPositions(hold.end + 1e-6, start, pass, snapshot, holds);
        assert(Math.abs(after[key] - before[key]) < 0.0001, `${name}: jump through hold`);
      }
    }
    const after = storyPositions(snapshot + 100, start, pass, snapshot, holds);
    assert(after.xA === last.xA && after.xB === last.xB, `${name}: snapshot not exactly frozen`);
    tested.push({name, start, pass, snapshot, holds, sampledFrames: count, first, last, crossing, speedRatio: 1.5});
  }
  return {source: relative(motionFile), sha256: hash(motionFile), scenarios: tested};
});

check('wheel contact from actual Diagram source geometry', () => {
  const file = path.join(helpers, 'Diagram.tsx');
  const source = ast(file);
  const wheels = [], rails = [];
  walk(source, node => {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText() === 'circle') {
      const a = attrs(node);
      if (a['data-wheel']) wheels.push({cy: number(a.cy), radius: number(a.r)});
    }
    if (ts.isObjectLiteralExpression(node)) {
      const values = Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(p => [p.name.getText(), p.initializer]));
      if (values.id && values.rail && ts.isStringLiteral(values.id)) rails.push({id: values.id.text, y: number(values.rail)});
    }
  });
  assert(wheels.length === 1 && rails.length === 2, 'Expected one shared wheel geometry and two actual trolley rails');
  const compact = read(file).replace(/\s/g, '');
  assert(compact.includes('transform={`translate(${x}${rail})`}'), 'Trolley transform changed; wheel contact requires fresh derivation');
  assert(compact.includes('[-30,30].map(wheel'), 'Expected both actual wheel centres');
  assert(compact.includes('d={`M55${rail}H845`}'), 'Rail geometry changed');
  assert(compact.includes('<Trolleyid={id}x={x}rail={rail}'), 'Trolley and path no longer share rail ordinate');
  const contacts = rails.map(rail => ({id: rail.id, rail: rail.y, wheelBottom: rail.y + wheels[0].cy + wheels[0].radius, wheelOffsets: [-30, 30]}));
  contacts.forEach(contact => near(contact.wheelBottom, contact.rail, 0, `${contact.id}: wheel bottom on rail`));
  assert(rails[0].y !== rails[1].y, 'Tracks must stay separate');
  return {source: relative(file), geometry: wheels[0], contacts, method: 'source geometry only; no DOM/render measurement'};
});

check('runtime transcript plan, ink, beat/marker cues and diagram figures', () => {
  const plan = JSON.parse(read(path.join(topic, 'narration-plan.json')));
  const runtime = JSON.parse(read(transcriptFile));
  const diagram = ast(path.join(helpers, 'Diagram.tsx'));
  const targetIds = new Set();
  walk(diagram, node => {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText() === 'Figure') {
      const id = attrs(node).id;
      for (const env of [{side: 'a', id: 'A'}, {side: 'b', id: 'B'}]) targetIds.add(simpleString(id, env));
    }
  });
  assert(runtime.scenes.length === plan.scenes.length, 'Scene count differs from narration plan');
  const counts = {scenes: 0, beats: 0, ink: 0, markers: 0, figures: 0};
  for (const planned of plan.scenes) {
    const scene = runtime.scenes.find(s => s.id === planned.id);
    assert(scene && scene.mode === planned.mode, `${planned.id}: missing runtime scene/mode`);
    assert(scene.beats.length === planned.beats.length, `${planned.id}: beat count mismatch`);
    assert(Number.isFinite(scene.duration) && scene.duration > 0, `${planned.id}: invalid duration`);
    for (const expected of planned.beats) {
      const beat = scene.beats.find(b => b.id === expected.id);
      assert(beat && beat.text === expected.text, `${planned.id}:${expected.id}: runtime text mismatch`);
      assert(beat.ink === expected.ink, `${planned.id}:${expected.id}: runtime ink mismatch`);
      assert(Number.isFinite(beat.cue) && beat.cue >= 0 && beat.cue < scene.duration, `${planned.id}:${expected.id}: invalid beat cue`);
      near(scene.cues[expected.id], beat.cue, 1e-8, `${planned.id}:${expected.id}: cue mapping`);
      if (beat.ink) {
        assert(beat.penEnd > beat.cue && beat.penEnd <= scene.duration, `${planned.id}:${expected.id}: invalid handwriting interval`);
        counts.ink++;
      }
      for (const marker of expected.markers || []) {
        assert(Number.isFinite(scene.cues[marker.id]), `${planned.id}:${marker.id}: missing marker cue`);
        assert(scene.cues[marker.id] >= beat.start && scene.cues[marker.id] <= beat.speechEnd, `${planned.id}:${marker.id}: marker outside its speech`);
        counts.markers++;
      }
      counts.beats++;
    }
    for (const event of scene.figureEvents) {
      assert(targetIds.has(event.target), `${scene.id}:${event.id}: figure target missing from actual Diagram`);
      assert(Number.isFinite(event.start) && event.start >= 0 && event.start < scene.duration, `${scene.id}:${event.id}: invalid ring cue`);
      if (event.end !== undefined) assert(event.end > event.start && event.end <= scene.duration + 1.7, `${scene.id}:${event.id}: invalid ring interval`);
      counts.figures++;
    }
    counts.scenes++;
  }
  return {path: relative(transcriptFile), sha256: hash(transcriptFile), counts, figureTargetsFromActualSource: [...targetIds].sort()};
});

check('composition exports and narration cue references', () => {
  const source = read(composition);
  for (const name of ['MechanicsMomentum', 'MechanicsMomentumProps', 'getMechanicsMomentumDuration']) assert(new RegExp(`export\\s+(?:const|function|interface|type)\\s+${name}\\b`).test(source), `Missing export ${name}`);
  assert(/useCue/.test(source), 'Composition must use narration cues');
  const runtime = JSON.parse(read(transcriptFile));
  const allCueIds = new Set(runtime.scenes.flatMap(scene => Object.keys(scene.cues)));
  const references = [];
  walk(ast(composition), node => {
    if (ts.isCallExpression(node) && /(?:useCue|at)$/.test(node.expression.getText())) {
      const literal = node.arguments.find(arg => ts.isStringLiteral(arg));
      if (literal) {
        assert(allCueIds.has(literal.text), `Composition references absent cue ${literal.text}`);
        references.push(literal.text);
      }
    }
  });
  assert(read(entry).includes('MechanicsMomentum'), 'Standalone entry missing composition');
  return {exports: ['MechanicsMomentum', 'MechanicsMomentumProps', 'getMechanicsMomentumDuration'], literalCueReferences: [...new Set(references)].sort(), limitation: 'Literal cue existence only; scene-specific dynamic routing requires A preview.'};
});

check('actual exported duration follows rounded scene audio durations', () => {
  const runtime = JSON.parse(read(transcriptFile));
  const actual = loadActual(composition);
  assert(typeof actual.MechanicsMomentum === 'function', 'Actual composition export missing');
  assert(typeof actual.getMechanicsMomentumDuration === 'function', 'Actual duration export missing');
  const durations = [24, 25, 30, 60].map(fps => {
    const expected = runtime.scenes.reduce((frames, scene) => frames + Math.ceil(scene.duration * fps), 0);
    const frames = actual.getMechanicsMomentumDuration(fps);
    assert(frames === expected, `Duration does not round each scene separately at ${fps}fps`);
    return {fps, frames, seconds: frames / fps};
  });
  return {durations, method: 'Load actual composition and shared modules against installed React/Remotion; invoke duration function only.'};
});

report.status = report.checks.every(check => check.status === 'pass') ? 'pass' : 'fail';
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({status: report.status, report: relative(reportFile), checks: report.checks.map(({name, status, error}) => ({name, status, error}))}, null, 2));
process.exitCode = report.status === 'pass' ? 0 : 1;
