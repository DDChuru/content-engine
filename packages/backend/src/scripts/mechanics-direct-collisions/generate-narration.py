#!/usr/bin/env python3
"""Direct Collisions: ElevenLabs audio, local SMALL Whisper, exact word cues.

Run --generate, then --transcribe. No dependencies are installed by this script.
Scene MP3s are learner assets; per-beat provider responses live in ignored projects.
"""
from __future__ import annotations

import argparse
from array import array
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys
import urllib.error
import urllib.request
import wave

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
PLAN = HERE / "narration.json"
AUDIO = ROOT / "packages/backend/src/remotion/public/audio/mechanics"
TRANSCRIPT = ROOT / "packages/backend/src/remotion/public/transcripts/mechanics/direct-collisions.json"
TIMING = HERE / "narration-timing.json"
WORK = ROOT / "packages/backend/projects/mechanics-direct-collisions/audio-beats"
VOICE = "gYWKdgLtqjPO3D5uDrDP"
MODEL = "eleven_turbo_v2_5"
RATE = 44100
ENGINE = "faster-whisper-small (local, CPU int8, 2 threads)"


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n")


def digest(data):
    return hashlib.sha256(data).hexdigest()


def env_key():
    value = os.environ.get("ELEVENLABS_API_KEY")
    if not value:
        for line in (ROOT / ".env").read_text().splitlines():
            match = re.match(r"^\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=\s*(.*?)\s*$", line)
            if match:
                value = match[1].strip("\"'")
                break
    if not value:
        raise RuntimeError("ELEVENLABS_API_KEY is unavailable in environment/root .env")
    return value


def probe(path):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ], text=True).strip())


def decode(path):
    pcm = subprocess.check_output([
        "ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le",
        "-ac", "1", "-ar", str(RATE), "-",
    ])
    values = array("h", pcm)
    if sys.byteorder != "little":
        values.byteswap()
    return values


def pcm_bytes(values):
    if sys.byteorder == "little":
        return values.tobytes()
    copied = array("h", values)
    copied.byteswap()
    return copied.tobytes()


def trim_padding(values):
    # Match sibling generation: trim provider padding, keep 60 ms speech margins.
    window = RATE // 100
    active = [i for i in range(0, len(values), window)
              if math.sqrt(sum(v * v for v in values[i:i + window]) /
                           len(values[i:i + window])) > 70]
    if not active:
        raise RuntimeError("ElevenLabs returned silent audio")
    begin = max(0, active[0] - round(.06 * RATE))
    end = min(len(values), active[-1] + window + round(.06 * RATE))
    return values[begin:end], begin / RATE, end / RATE


def generate(plan):
    key = env_key()
    AUDIO.mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    scenes = []
    for scene in plan["scenes"]:
        speed = .9 if scene["tempo"] == "slow" else 1.0
        pcm = array("h", [0]) * round(.55 * RATE)
        beats, holds = [], []
        for beat in scene["beats"]:
            settings = {"text": beat["text"], "model_id": MODEL,
                        "voice_settings": {"speed": speed}}
            cache_key = digest(json.dumps({"voice": VOICE, **settings}, sort_keys=True).encode())[:16]
            cached = WORK / f"{scene['id']}-{beat['id']}-{cache_key}.mp3"
            if not cached.exists():
                request = urllib.request.Request(
                    f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}",
                    data=json.dumps(settings).encode(),
                    headers={"xi-api-key": key, "Content-Type": "application/json"},
                    method="POST",
                )
                try:
                    with urllib.request.urlopen(request, timeout=120) as response:
                        audio_bytes = response.read()
                except urllib.error.HTTPError as error:
                    # Never print request headers or credentials.
                    raise RuntimeError(f"ElevenLabs HTTP {error.code}: {error.read(300).decode(errors='replace')}") from None
                cached.write_bytes(audio_bytes)
            samples, trim_start, trim_end = trim_padding(decode(cached))
            start = len(pcm) / RATE
            pcm.extend(samples)
            speech_end = len(pcm) / RATE
            hold = float(beat.get("hold", 0))
            if hold:
                holds.append({"start": speech_end, "end": speech_end + hold,
                              "kind": "thinking" if hold >= 3 else "result", "duration": hold})
                pcm.extend(array("h", [0]) * round(hold * RATE))
            end = len(pcm) / RATE
            beats.append({**beat, "start": start, "speechEnd": speech_end,
                          "end": end, "hold": hold,
                          "providerAudioSha256": digest(cached.read_bytes()),
                          "providerTrimStart": trim_start, "providerTrimEnd": trim_end})
            pcm.extend(array("h", [0]) * round(.15 * RATE))
            print(f"Generated {scene['id']}:{beat['id']} ({speech_end-start:.2f}s speech, {hold:g}s hold)", flush=True)
        pcm.extend(array("h", [0]) * round(.4 * RATE))
        audio_path = AUDIO / f"direct-collisions-{scene['id']}.mp3"
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ac", "1",
            "-ar", str(RATE), "-i", "-", "-codec:a", "libmp3lame",
            "-b:a", "128k", str(audio_path),
        ], input=pcm_bytes(pcm), check=True)
        scenes.append({**scene, "audio": audio_path.name, "duration": probe(audio_path),
                       "sampleDuration": len(pcm) / RATE, "beats": beats, "holds": holds,
                       "audioSha256": digest(audio_path.read_bytes()),
                       "provider": "elevenlabs", "voiceId": VOICE, "voiceSpeed": speed,
                       "modelId": MODEL, "sampleRate": RATE})
        write_json(TIMING, {"project": plan["project"], "planSha256": digest(PLAN.read_bytes()),
                            "scenes": scenes, "generationComplete": len(scenes) == len(plan["scenes"])})
        print(f"Scene {scene['id']}: {probe(audio_path):.3f}s", flush=True)
    print(f"Total narration: {sum(s['duration'] for s in scenes):.3f}s", flush=True)


NUMBER_WORDS = {str(i): word for i, word in enumerate(
    ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"])}


def tokens(text):
    # Exact tokens; only spelling/number typography is normalized. No fuzzy match.
    words = re.findall(r"[a-z0-9]+(?:'[a-z]+)?", text.lower().replace("’", "'"))
    spelling = {"meters": "metres", "meter": "metre", "modeled": "modelled"}
    return [spelling.get(NUMBER_WORDS.get(w, w), NUMBER_WORDS.get(w, w)) for w in words]


def match_phrase(words, phrase, occurrence=1):
    expanded = [(part, i) for i, w in enumerate(words) for part in tokens(w["word"])]
    wanted = tokens(phrase)
    if not wanted or occurrence < 1:
        raise ValueError(f"Invalid cue phrase/occurrence: {phrase!r}, {occurrence}")
    matches = [i for i in range(len(expanded) - len(wanted) + 1)
               if [v for v, _ in expanded[i:i + len(wanted)]] == wanted]
    if len(matches) < occurrence:
        raise ValueError(f"Exact Whisper phrase missing: {phrase!r} occurrence {occurrence}; heard: "
                         + " ".join(w["word"] for w in words))
    start = matches[occurrence - 1]
    return expanded[start][1], expanded[start + len(wanted) - 1][1]


def cue_scene(scene, words_by_beat):
    words, beats, cues, events, evidence = [], [], {}, [], []
    for beat in scene["beats"]:
        local = words_by_beat[beat["id"]]
        if not local:
            raise ValueError(f"Whisper returned no words: {scene['id']}:{beat['id']}")
        base = len(words)
        words.extend(local)
        first, last = match_phrase(local, beat["cuePhrase"], beat.get("occurrence", 1)) if beat.get("cuePhrase") else (0, 0)
        cue = local[first]["start"]
        cues[beat["id"]] = cue
        if beat.get("ink") and cue >= beat["speechEnd"] - .08:
            raise ValueError(f"No speech window for ink: {scene['id']}:{beat['id']}")
        beats.append({**beat, "cue": cue, "penEnd": max(cue + .01, beat["speechEnd"] - .08)})
        evidence.append({"id": beat["id"], "phrase": beat.get("cuePhrase", local[0]["word"]),
                         "wordIndex": base + first, "edge": "start", "time": cue})
        for extra in beat.get("extraCues", []):
            a, b = match_phrase(local, extra["phrase"], extra.get("occurrence", 1))
            index = b if extra.get("edge") == "end" else a
            edge = extra.get("edge", "start")
            time = local[index][edge]
            if extra["id"] in cues:
                raise ValueError(f"Duplicate cue id {scene['id']}:{extra['id']}")
            cues[extra["id"]] = time
            evidence.append({**extra, "wordIndex": base + index, "edge": edge, "time": time})
        for index, figure in enumerate(beat.get("figures", [])):
            a, _ = match_phrase(local, figure["phrase"], figure.get("occurrence", 1))
            events.append({"id": f"{beat['id']}-figure-{index + 1}", "start": local[a]["start"],
                           "target": figure["target"], "kind": "spoken",
                           "word": str(figure.get("value", local[a]["word"])),
                           "wordIndex": base + a})
    return {**scene, "beats": beats, "words": words, "wordCount": len(words),
            "text": " ".join(w["word"].strip() for w in words), "cues": cues,
            "figureEvents": events, "cueEvidence": evidence,
            "engine": ENGINE, "transcriptionMethod": "Separate beat excerpts of decoded final scene MP3; word timestamps shifted by exact PCM excerpt offsets."}


def transcribe(plan):
    if importlib.util.find_spec("faster_whisper") is None:
        raise RuntimeError("Local faster_whisper is unavailable in this Python executable; no package/service substitution permitted")
    from faster_whisper import WhisperModel
    timing = json.loads(TIMING.read_text())
    if not timing.get("generationComplete") or timing["planSha256"] != digest(PLAN.read_bytes()):
        raise RuntimeError("Narration generation is incomplete or narration.json changed; run --generate")
    model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2, local_files_only=True)
    scenes = []
    for scene in timing["scenes"]:
        path = AUDIO / scene["audio"]
        if digest(path.read_bytes()) != scene["audioSha256"]:
            raise RuntimeError(f"Audio hash mismatch: {path.name}")
        samples = decode(path)
        words_by_beat = {}
        for beat in scene["beats"]:
            first, last = round(beat["start"] * RATE), round(beat["speechEnd"] * RATE)
            wave_path = WORK / f"{scene['id']}-{beat['id']}-whisper.wav"
            with wave.open(str(wave_path), "wb") as output:
                output.setnchannels(1)
                output.setsampwidth(2)
                output.setframerate(RATE)
                output.writeframes(pcm_bytes(samples[first:last]))
            cache = WORK / f"{scene['id']}-{beat['id']}-whisper.json"
            wave_sha = digest(wave_path.read_bytes())
            cached = json.loads(cache.read_text()) if cache.exists() else {}
            if cached.get("audioSha256") == wave_sha:
                raw_words = cached["words"]
            else:
                segments, _ = model.transcribe(
                    str(wave_path), language="en", word_timestamps=True,
                    beam_size=5, vad_filter=False, condition_on_previous_text=False,
                    initial_prompt=beat["text"],
                )
                raw_words = [{"word": w.word, "start": w.start, "end": w.end,
                              "probability": w.probability}
                             for segment in segments for w in (segment.words or [])]
                write_json(cache, {"audioSha256": wave_sha, "engine": ENGINE,
                                   "words": raw_words, "initialPrompt": beat["text"]})
            offset = first / RATE
            words_by_beat[beat["id"]] = [
                {**w, "start": round(offset + w["start"], 6),
                 "end": round(offset + w["end"], 6), "beatId": beat["id"]}
                for w in raw_words
            ]
            print(f"Transcribed {scene['id']}:{beat['id']} ({len(raw_words)} words)", flush=True)
        scenes.append(cue_scene(scene, words_by_beat))
        write_json(WORK / f"{scene['id']}-mapped.json", scenes[-1])
    result = {"project": plan["project"], "compositionId": plan["compositionId"],
              "sceneCount": len(scenes), "totalDuration": sum(s["duration"] for s in scenes),
              "generatedAt": datetime.now(timezone.utc).isoformat(),
              "engine": ENGINE, "modelSize": "small", "cpuThreads": 2,
              "planSha256": digest(PLAN.read_bytes()), "scenes": scenes}
    write_json(TRANSCRIPT, result)
    print(f"Saved {TRANSCRIPT}; all exact cue phrases resolved", flush=True)


def remap(plan):
    """Apply cue-only edits to existing genuine words without regenerating audio."""
    timing = json.loads(TIMING.read_text())
    previous = json.loads(TRANSCRIPT.read_text())
    if [s["id"] for s in timing["scenes"]] != [s["id"] for s in plan["scenes"]]:
        raise RuntimeError("Scene structure changed; regenerate narration")
    scenes = []
    for generated, source in zip(timing["scenes"], plan["scenes"]):
        if generated["tempo"] != source["tempo"]:
            raise RuntimeError("Narration tempo changed; regenerate narration")
        if [b["id"] for b in generated["beats"]] != [b["id"] for b in source["beats"]]:
            raise RuntimeError("Beat structure changed; regenerate narration")
        for beat, planned in zip(generated["beats"], source["beats"]):
            if beat["text"] != planned["text"] or beat["hold"] != float(planned.get("hold", 0)):
                raise RuntimeError("Narration text/hold changed; regenerate narration")
            # Preserve measured audio bounds while replacing authoring metadata.
            for key in ("cuePhrase", "occurrence", "extraCues", "figures", "ink", "caption", "page"):
                beat.pop(key, None)
                if key in planned:
                    beat[key] = planned[key]
        spoken = next(s for s in previous["scenes"] if s["id"] == generated["id"])
        audio_sha = digest((AUDIO / generated["audio"]).read_bytes())
        if audio_sha != generated["audioSha256"] or audio_sha != spoken["audioSha256"]:
            raise RuntimeError("Audio changed; transcribe current narration")
        grouped = {b["id"]: [w for w in spoken["words"] if w["beatId"] == b["id"]]
                   for b in generated["beats"]}
        scenes.append(cue_scene(generated, grouped))
    plan_sha = digest(PLAN.read_bytes())
    timing["planSha256"] = plan_sha
    write_json(TIMING, timing)
    write_json(TRANSCRIPT, {**previous, "planSha256": plan_sha, "scenes": scenes})
    print("Remapped exact cues from unchanged Whisper words and audio", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--generate", action="store_true")
    parser.add_argument("--transcribe", action="store_true")
    parser.add_argument("--remap", action="store_true")
    args = parser.parse_args()
    if not args.generate and not args.transcribe and not args.remap:
        parser.error("Choose --generate, --transcribe and/or --remap")
    plan = json.loads(PLAN.read_text())
    if plan["project"] != "mechanics-direct-collisions" or plan["compositionId"] != "MechanicsDirectCollisions":
        raise RuntimeError("This script only authors Direct Collisions")
    if args.generate:
        generate(plan)
    if args.transcribe:
        transcribe(plan)
    if args.remap:
        remap(plan)


if __name__ == "__main__":
    main()
