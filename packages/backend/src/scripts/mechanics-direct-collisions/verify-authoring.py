#!/usr/bin/env python3
"""Check authored Direct Collisions inputs without installing or rendering.

Uses existing TypeScript/React tooling, optionally from a sibling checkout. It
executes the real motion helper and handwriting preparation, checks final MP3s
and Whisper cue provenance, and performs scoped no-emit TypeScript checking.
This does not replace machine A's still, ring-geometry or encoded-video review.
"""
from __future__ import annotations

import argparse
from array import array
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path
import re
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
COMPOSITIONS = ROOT / "packages/backend/src/remotion/compositions"
PUBLIC = ROOT / "packages/backend/src/remotion/public"
TRANSCRIPT = PUBLIC / "transcripts/mechanics/direct-collisions.json"


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def read_json(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(argv):
    result = subprocess.run([str(a) for a in argv], text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(f"Command failed ({result.returncode}): {argv[0]}\n"
                           + result.stdout + result.stderr)
    return result.stdout


def normalized(text):
    number_names = "zero one two three four five six seven eight nine ten".split()
    aliases = {str(i): word for i, word in enumerate(number_names)}
    aliases.update({"meters": "metres", "meter": "metre", "modeled": "modelled"})
    return [aliases.get(word, word) for word in re.findall(
        r"[a-z0-9]+(?:'[a-z]+)?", text.lower().replace("’", "'"))]


def exact_phrase(words, phrase, occurrence=1):
    tokens = [(token, index) for index, word in enumerate(words)
              for token in normalized(word["word"])]
    wanted = normalized(phrase)
    matches = [i for i in range(len(tokens) - len(wanted) + 1)
               if [token for token, _ in tokens[i:i + len(wanted)]] == wanted]
    require(wanted and len(matches) >= occurrence,
            f"Missing exact phrase {phrase!r}, occurrence {occurrence}")
    start = matches[occurrence - 1]
    return tokens[start][1], tokens[start + len(wanted) - 1][1]


def tooling(args):
    sibling = ROOT.parent / "content-engine"
    candidates = [ROOT / "packages/backend/node_modules",
                  sibling / "packages/backend/node_modules"]
    modules = args.backend_node_modules or next(
        (p for p in candidates if (p / "typescript/lib/typescript.js").exists()), None)
    require(modules is not None, "Existing TypeScript unavailable; no installation attempted")
    candidates = [ROOT / "apps/student-learn/node_modules/@types/react",
                  modules / "@types/react",
                  sibling / "apps/student-learn/node_modules/@types/react",
                  sibling / "remotion-branding/node_modules/@types/react"]
    react_types = args.react_types or next(
        (p for p in candidates if (p / "index.d.ts").exists()), None)
    require(react_types is not None, "Existing React declarations unavailable")
    return modules.resolve(), react_types.resolve()


def arithmetic():
    m_a, m_b, u_a, u_b, v_a = map(Fraction, (2, 3, 4, -1, -2))
    before = m_a * u_a + m_b * u_b
    v_b = (before - m_a * v_a) / m_b
    common = before / (m_a + m_b)
    require((before, v_b, common) == (5, 3, 1), "Independent momentum solutions")
    require(v_b > v_a, "Separated particles must open a gap after contact")
    energy_before = (m_a * u_a**2 + m_b * u_b**2) / 2
    require((m_a * v_a**2 + m_b * v_b**2) / 2 <= energy_before,
            "Passive separation must not create kinetic energy")
    require((m_a + m_b) * common**2 / 2 <= energy_before,
            "Passive sticking must not create kinetic energy")
    return {"beforeMomentum": str(before), "BVelocity": str(v_b),
            "commonVelocity": str(common), "method": "independent exact rational arithmetic"}


def actual_helpers(plan, modules):
    # Execute existing source through the installed compiler; no emitted files.
    javascript = r"""
const fs = require('node:fs');
const {createRequire} = require('node:module');
const [modules, motionPath, inkPath, textsJson] = process.argv.slice(1);
const dependencies = createRequire(modules + '/../package.json');
const ts = require(modules + '/typescript/lib/typescript.js');
function load(path) {
  const source = fs.readFileSync(path, 'utf8');
  const output = ts.transpileModule(source, {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.React, esModuleInterop: true,
  }, fileName: path}).outputText;
  const module = {exports: {}};
  new Function('require', 'module', 'exports', output)(dependencies, module, module.exports);
  return module.exports;
}
const motion = load(motionPath), ink = load(inkPath);
const samples = [];
for (const trial of ['separate', 'together']) {
  for (let i = -400; i <= 400; i++) {
    const t = i / 40;
    samples.push({trial, t, ...motion.collisionPositions(trial, t)});
  }
}
const holds = [{start: 2, end: 4}, {start: 6, end: 9}];
const clocks = Array.from({length: 481}, (_, i) => ({
  t: i / 40, value: motion.motionClock(i / 40, holds),
}));
const lines = JSON.parse(textsJson).map(text => {
  const prepared = ink.prepareLine(text, 1);
  if (!prepared.strokes.length || !Number.isFinite(prepared.width)) throw Error(text);
  return {text, widthAtUnitSize: prepared.width, strokes: prepared.strokes.length};
});
process.stdout.write(JSON.stringify({samples, clocks, holds, lines,
  radius: motion.RADIUS, contactA: motion.CONTACT_A, contactB: motion.CONTACT_B}));
"""
    lines = [b["ink"] for s in plan["scenes"] for b in s["beats"] if b.get("ink")]
    actual = json.loads(run(["node", "-e", javascript, modules,
                            COMPOSITIONS / "mechanics-direct-collisions/Motion.ts",
                            COMPOSITIONS / "mechanics-m42/Ink.tsx", json.dumps(lines)]))
    radius = actual["radius"]
    require(actual["contactB"] - actual["contactA"] == 2 * radius, "Exact contact separation")
    for row in actual["samples"]:
        before = row["t"] < 0
        va = 4 if before else (-2 if row["trial"] == "separate" else 1)
        vb = -1 if before else (3 if row["trial"] == "separate" else 1)
        require((row["velocityA"], row["velocityB"]) == (va, vb), "Actual signed motion")
        for particle, velocity in (("a", va), ("b", vb)):
            origin = actual["contactA" if particle == "a" else "contactB"]
            require(math.isclose(row[particle], origin + velocity * row["t"] * 24,
                                 abs_tol=1e-9), "Actual velocity slope and continuous impact position")
        separation = row["b"] - row["a"]
        require(separation >= 2 * radius - 1e-9, "No overlap before or after contact")
        if not before and row["trial"] == "together":
            require(math.isclose(separation, 2 * radius), "Sticking keeps constant contact separation")
        require(2 * row["velocityA"] + 3 * row["velocityB"] == 5, "Motion conserves pair momentum")
    for row in actual["clocks"]:
        t = row["t"]
        expected = (t if t <= 2 else 2 if t <= 4 else t - 2 if t <= 6
                    else 4 if t <= 9 else t - 5)
        require(math.isclose(row["value"], expected, abs_tol=1e-9),
                "Actual motion clock freezes every hold and resumes continuously")
    return {"motionSamples": len(actual["samples"]), "holdClockSamples": len(actual["clocks"]),
            "handwrittenLines": actual["lines"]}


def audio_checks(scene):
    path = PUBLIC / "audio/mechanics" / scene["audio"]
    require(path.name == f"direct-collisions-{scene['id']}.mp3", "Exact topic-only audio filename")
    require(sha(path) == scene["audioSha256"], f"Audio SHA256 {scene['id']}")
    probe = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format",
                            "-of", "json", path]))
    stream = next(s for s in probe["streams"] if s["codec_type"] == "audio")
    rate, channels = int(stream["sample_rate"]), int(stream["channels"])
    measured = float(probe["format"]["duration"])
    require(abs(measured - scene["duration"]) < 1e-5, "Actual MP3 duration matches transcript")
    pcm = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(path),
                                   "-f", "s16le", "-"])
    samples = array("h", pcm)
    if sys.byteorder != "little":
        samples.byteswap()
    peak = max(abs(v) for v in samples)
    require(peak < 32767, f"No clipped native-rate samples: {scene['id']}")
    decoded_duration = len(samples) / (rate * channels)
    require(abs(decoded_duration - scene["sampleDuration"]) < 1 / rate,
            "Decoded sample duration equals assembled duration")
    holds = []
    for hold in scene["holds"]:
        require(abs(hold["end"] - hold["start"] - hold["duration"]) < 1e-6, "Exact inserted hold duration")
        # Exclude 80 ms at either edge for MP3 transform ringing, not speech.
        first = round((hold["start"] + .08) * rate) * channels
        last = round((hold["end"] - .08) * rate) * channels
        values = samples[first:last]
        require(values and max(abs(v) for v in values) <= 5, "Inserted hold is actual decoded silence")
        holds.append({**hold, "edgeExclusionSeconds": .08,
                      "nativePcmPeak": max(abs(v) for v in values)})
    return {"id": scene["id"], "sha256": scene["audioSha256"], "duration": measured,
            "sampleRate": rate, "channels": channels, "nativePcmPeak": peak, "holds": holds}


def transcript_checks(plan, transcript):
    require(transcript["planSha256"] == sha(HERE / "narration.json"), "Narration plan hash")
    require(transcript["modelSize"] == "small" and transcript["cpuThreads"] == 2,
            "Required local small Whisper model and two CPU threads")
    require("faster-whisper-small" in transcript["engine"], "Actual requested Whisper engine")
    require([s["id"] for s in plan["scenes"]] == [s["id"] for s in transcript["scenes"]], "Complete scenes")
    cue_count = figure_count = word_count = raw_cache_beats = 0
    for planned, scene in zip(plan["scenes"], transcript["scenes"]):
        label = scene["id"]
        require(scene["provider"] == "elevenlabs" and scene["voiceId"] == "gYWKdgLtqjPO3D5uDrDP"
                and scene["modelId"] == "eleven_turbo_v2_5", f"Required TTS {label}")
        require(scene["voiceSpeed"] == (.9 if scene["tempo"] == "slow" else 1), "Correct TTS tempo")
        require(len(scene["words"]) == scene["wordCount"] > 0, "Word-level transcript exists")
        require([b["id"] for b in planned["beats"]] == [b["id"] for b in scene["beats"]], "Complete beats")
        evidence = {e["id"]: e for e in scene["cueEvidence"]}
        events = {e["id"]: e for e in scene["figureEvents"]}
        expected_cues, expected_events = set(), set()
        expected_holds = []
        previous_start = -1
        for word in scene["words"]:
            require(0 <= word["start"] <= word["end"] <= scene["duration"], "Word bounds")
            require(word["start"] >= previous_start, "Monotonic Whisper words")
            previous_start = word["start"]
        for source, beat in zip(planned["beats"], scene["beats"]):
            require(source["text"] == beat["text"], "Exact narration script retained")
            indices = [i for i, w in enumerate(scene["words"]) if w["beatId"] == beat["id"]]
            local = [scene["words"][i] for i in indices]
            require(local, f"Whisper words for {label}:{beat['id']}")
            cache_root = ROOT / "packages/backend/projects/mechanics-direct-collisions/audio-beats"
            cache = cache_root / f"{label}-{beat['id']}-whisper.json"
            wave = cache.with_suffix(".wav")
            if cache.exists() and wave.exists():
                raw = read_json(cache)
                require(raw["audioSha256"] == sha(wave), "Cached Whisper excerpt hash")
                require(len(raw["words"]) == len(local), "Unaltered local Whisper word count")
                offset = round(beat["start"] * scene["sampleRate"]) / scene["sampleRate"]
                for original, mapped in zip(raw["words"], local):
                    require(original["word"] == mapped["word"], "Unaltered local Whisper text")
                    for edge in ("start", "end"):
                        require(round(original[edge] + offset, 6) == mapped[edge],
                                "Whisper timestamp shifted by exact final-audio PCM excerpt offset")
                raw_cache_beats += 1
            require(local[0]["start"] >= beat["start"] - .001
                    and local[-1]["end"] <= beat["speechEnd"] + .04,
                    "Whisper excerpt timing offset")
            items = [{"id": beat["id"], "phrase": source.get("cuePhrase", local[0]["word"]),
                      "occurrence": source.get("occurrence", 1)}] + source.get("extraCues", [])
            for item in items:
                first, last = exact_phrase(local, item["phrase"], item.get("occurrence", 1))
                edge = item.get("edge", "start")
                index = indices[last if edge == "end" else first]
                record = evidence[item["id"]]
                require(record["wordIndex"] == index and record["edge"] == edge,
                        f"Cue phrase provenance {label}:{item['id']}")
                require(record["time"] == scene["words"][index][edge] == scene["cues"][item["id"]],
                        "Cue equals exact Whisper word edge")
                expected_cues.add(item["id"])
            require(beat["cue"] == scene["cues"][beat["id"]], "Beat uses mapped cue")
            require(beat["hold"] == source.get("hold", 0), "Every scripted hold retained")
            if beat["hold"]:
                require(abs(beat["end"] - beat["speechEnd"] - beat["hold"]) < 1e-6,
                        "Scripted hold starts after speech")
                expected_holds.append((beat["speechEnd"], beat["end"], beat["hold"]))
            if beat.get("ink"):
                require(beat["ink"] == source["ink"], "Exact scripted handwriting retained")
                require(beat["cue"] < beat["penEnd"] <= beat["speechEnd"], "Handwriting completes before hold")
            for count, figure in enumerate(source.get("figures", []), 1):
                key = f"{beat['id']}-figure-{count}"
                first, _ = exact_phrase(local, figure["phrase"], figure.get("occurrence", 1))
                event = events[key]
                require(event["wordIndex"] == indices[first]
                        and event["start"] == local[first]["start"], "Exact spoken figure word cue")
                require(event["target"] == figure["target"] and event["word"] == figure["value"],
                        "Exact diagram target and canonical numeric ring value")
                expected_events.add(key)
        require(set(scene["cues"]) == set(evidence) == expected_cues, "No missing or fabricated visual cues")
        require(set(events) == expected_events, "Every scripted figure has its ring event")
        require([(h["start"], h["end"], h["duration"]) for h in scene["holds"]] == expected_holds,
                "Every scripted hold has its actual audio interval")
        if scene["mode"] in ("separate", "together"):
            beats = {b["id"]: b for b in scene["beats"]}
            require(beats["principle"]["cue"] < beats["principle"]["penEnd"]
                    < beats["formula"]["cue"] < beats["formula"]["penEnd"]
                    < beats["substitute"]["cue"], "Words and symbol formula precede numbers")
            result = scene["cues"]["result-value"]
            require(result > beats["result"]["cue"] > beats["simplify"]["penEnd"],
                    "Exact result word follows calculation inputs")
            target = "B.after" if scene["mode"] == "separate" else "pair.after"
            event = next(e for e in scene["figureEvents"] if e["target"] == target)
            require(event["start"] == result, "Result reveal cue equals result figure cue")
        cue_count += len(expected_cues)
        figure_count += len(expected_events)
        word_count += len(scene["words"])
    return {"wordCount": word_count, "exactCues": cue_count, "spokenFigureEvents": figure_count,
            "localRawWhisperCacheBeatsChecked": raw_cache_beats,
            "rawCacheAvailability": "Optional ignored generation evidence; mapped word provenance checked everywhere"}


def composition_checks(modules, react_types):
    path = COMPOSITIONS / "MechanicsDirectCollisions.tsx"
    source = path.read_text()
    for text in ("MechanicsDirectCollisions", "MechanicsDirectCollisionsProps",
                 "getMechanicsDirectCollisionsDuration", "useCue", "result-value"):
        require(text in source, f"Composition required contract: {text}")
    require("direct-collisions.json" in source, "Composition consumes authored word transcript")
    require(re.search(r"const\s+solved\s*=\s*useCue\(s,\s*['\"]result-value['\"]\)", source),
            "Diagram result uses the actual result-word hook")
    for component in ("AfterSeparate", "AfterTogether"):
        require(re.search(r"<" + component + r"\s+solved=\{solved\}", source),
                f"{component} receives the exact result-word gate")
    template = read_json(HERE / "verify-tsconfig.json")
    template["files"] = [str((HERE / f).resolve()) for f in template["files"]]
    for file in template["files"]:
        require(Path(file).exists(), f"Required topic source missing: {file}")
    options = template["compilerOptions"]
    options.update({"baseUrl": str(ROOT), "typeRoots": [str(react_types.parent), str(modules / "@types")],
                    "paths": {"react": [str(react_types)], "react/*": [str(react_types / "*")],
                              "remotion": [str(modules / "remotion")]}})
    with tempfile.TemporaryDirectory(prefix="verify-direct-collisions-") as temporary:
        config = Path(temporary) / "verify-tsconfig.json"
        config.write_text(json.dumps(template, indent=2) + "\n")
        run(["node", modules / "typescript/bin/tsc", "-p", config])
    javascript = r"""
const fs = require('node:fs'), path = require('node:path');
const {createRequire} = require('node:module');
const [modules, compositionPath, transcriptPath] = process.argv.slice(1);
const dependencies = createRequire(modules + '/../package.json');
const ts = require(modules + '/typescript/lib/typescript.js');
const actualRemotion = dependencies('remotion');
let currentFrame = 0;
const cache = new Map();
function load(file) {
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (cache.has(file)) return cache.get(file);
  let source = fs.readFileSync(file, 'utf8');
  // Expose the existing hook in memory only; do not change authored source.
  if (file === compositionPath) source += '\nexport {useCue as verifyUseCue};\n';
  const output = ts.transpileModule(source, {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.React, esModuleInterop: true, resolveJsonModule: true,
  }, fileName: file}).outputText;
  const module = {exports: {}};
  function localRequire(id) {
    if (id === 'remotion') return {...actualRemotion,
      useCurrentFrame: () => currentFrame, useVideoConfig: () => ({fps: 30})};
    if (!id.startsWith('.')) return dependencies(id);
    const base = path.resolve(path.dirname(file), id);
    const target = [base, base + '.ts', base + '.tsx'].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!target) throw Error('Cannot resolve ' + id + ' from ' + file);
    return load(target);
  }
  new Function('require', 'module', 'exports', output)(localRequire, module, module.exports);
  cache.set(file, module.exports);
  return module.exports;
}
const composition = load(compositionPath);
const transcript = load(transcriptPath);
let checked = 0;
const results = [];
for (const scene of transcript.scenes) {
  for (const [id, seconds] of Object.entries(scene.cues)) {
    const firstFrame = Math.ceil(seconds * 30);
    for (const [frame, expected] of [[firstFrame - 1, false], [firstFrame, true], [firstFrame + 1, true]]) {
      currentFrame = frame;
      if (composition.verifyUseCue(scene, id) !== expected) throw Error(scene.id + ':' + id + ' frame ' + frame);
      checked++;
    }
    if (id === 'result-value') results.push({scene: scene.id, wordSeconds: seconds, firstVisibleFrame: firstFrame});
  }
}
const expectedDuration = transcript.scenes.reduce((sum, scene) => sum + Math.ceil(scene.duration * 30), 0);
if (composition.getMechanicsDirectCollisionsDuration(30) !== expectedDuration) throw Error('Actual exported duration');
process.stdout.write(JSON.stringify({hookBoundarySamples: checked, resultBoundaries: results,
  exportedDurationFrames30fps: expectedDuration, method: 'Actual useCue function evaluated with controlled frame inputs; no React or Remotion rendering'}));
"""
    boundaries = json.loads(run(["node", "-e", javascript, modules, path, TRANSCRIPT]))
    return {"scopedTypeScript": "passed", "actualCueHook": boundaries,
            "backendNodeModules": str(modules),
            "reactDeclarations": str(react_types), "installedOrRendered": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--backend-node-modules", type=Path)
    parser.add_argument("--react-types", type=Path)
    parser.add_argument("--output", type=Path, help="Optional verify-* JSON report path")
    args = parser.parse_args()
    if args.output:
        require(args.output.name.startswith(("verify-", "prove-")), "Report must start verify- or prove-")
    modules, react_types = tooling(args)
    plan = read_json(HERE / "narration.json")
    require(plan["project"] == "mechanics-direct-collisions" and plan["mapCode"] == "M4.3b", "Topic identity")
    report = {"project": plan["project"], "arithmetic": arithmetic(),
              "actualSourceHelpers": actual_helpers(plan, modules)}
    transcript = read_json(TRANSCRIPT)
    report["transcript"] = transcript_checks(plan, transcript)
    report["audio"] = [audio_checks(s) for s in transcript["scenes"]]
    report["durationSeconds"] = sum(s["duration"] for s in transcript["scenes"])
    report["durationFrames30fps"] = sum(math.ceil(s["duration"] * 30) for s in transcript["scenes"])
    require(report["durationSeconds"] <= 330, "Source-scope narration ceiling is 5:30")
    report["composition"] = composition_checks(modules, react_types)
    report["status"] = "passed authoring checks; preview review remains on machine A"
    report["limitations"] = [
        "No Remotion render or browser layout measurement was performed.",
        "Machine A must inspect complete scene previews, exact numeric ring geometry, "
        "before/after result-word frames, diagram contact/arrow visibility, and frozen holds.",
        "No encoded final video exists; AAC alignment and encoded ink checks are pending rendering.",
    ]
    output = json.dumps(report, indent=2, ensure_ascii=False) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output)
    print(output, end="")


if __name__ == "__main__":
    main()
