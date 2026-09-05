#!/usr/bin/env python3
"""
Batch transcribe the S.I. Units mechanics explainer with local faster-whisper.

Uses the same local Whisper settings and transcript fields as
transcribe-batch4-lysosomes-local.py, with all ten scene transcripts collected
in one JSON file for the Remotion composition.
"""

import json
import re
import subprocess
from datetime import datetime
from pathlib import Path

from faster_whisper import WhisperModel

SCRIPT_DIR = Path(__file__).parent
AUDIO_DIR = SCRIPT_DIR / "../remotion/public/audio/mechanics"
TRANSCRIPT_PATH = (
    SCRIPT_DIR / "../remotion/public/transcripts/mechanics/si-units.json"
)

# Use 'small' model -- accurate for clear English narration and fast on CPU.
MODEL_SIZE = "small"
ENGINE = "faster-whisper-small (local)"


# Cue IDs are stable composition keys. Search terms are the exact storyboard
# cue phrases; alternatives may be added only when Whisper renders a spoken
# phrase differently.
JOBS = [
    {
        "id": "s01",
        "audioFile": "si-units-s01.mp3",
        "cues": [
            {"id": "unit-mismatch", "searchTerms": ["unit mismatch"]},
            {
                "id": "same-measurement-language",
                "searchTerms": ["same measurement language"],
            },
            {"id": "calculate", "searchTerms": ["calculate"]},
        ],
    },
    {
        "id": "s02",
        "audioFile": "si-units-s02.mp3",
        "cues": [
            {"id": "shared-system", "searchTerms": ["shared system"]},
            {
                "id": "removes-ambiguity",
                "searchTerms": ["removes ambiguity"],
            },
            {"id": "metre", "searchTerms": ["metre", "emitter"]},
            {"id": "consistent", "searchTerms": ["consistent"]},
        ],
    },
    {
        "id": "s03",
        "audioFile": "si-units-s03.mp3",
        "cues": [
            {"id": "metre", "searchTerms": ["metre", "meter"]},
            {"id": "how-far", "searchTerms": ["how far"]},
            {"id": "displacement", "searchTerms": ["displacement"]},
            {
                "id": "one-kilometre",
                "searchTerms": ["one kilometre", "one kilometer"],
            },
        ],
    },
    {
        "id": "s04",
        "audioFile": "si-units-s04.mp3",
        "cues": [
            {"id": "second", "searchTerms": ["second"]},
            {"id": "how-long", "searchTerms": ["how long"]},
            {"id": "minutes", "searchTerms": ["minutes"]},
            {
                "id": "sixty-seconds",
                "searchTerms": ["sixty seconds", "60 seconds"],
            },
        ],
    },
    {
        "id": "s05",
        "audioFile": "si-units-s05.mp3",
        "cues": [
            {"id": "kilogram", "searchTerms": ["kilogram"]},
            {"id": "resists", "searchTerms": ["resists"]},
            {
                "id": "one-thousand-grams",
                "searchTerms": ["one thousand grams", "1 ,000 grams"],
            },
            {"id": "one-tonne", "searchTerms": ["one tonne", "1 ton"]},
        ],
    },
    {
        "id": "s06",
        "audioFile": "si-units-s06.mp3",
        "cues": [
            {"id": "mass", "searchTerms": ["mass"]},
            {"id": "weight", "searchTerms": ["weight"]},
            {"id": "newtons", "searchTerms": ["newtons"]},
            {"id": "moon", "searchTerms": ["moon"]},
        ],
    },
    {
        "id": "s07",
        "audioFile": "si-units-s07.mp3",
        "cues": [
            {"id": "kilo", "searchTerms": ["kilo"]},
            {"id": "milli", "searchTerms": ["milli"]},
            {"id": "nano", "searchTerms": ["nano"]},
            {
                "id": "groups-of-sixty",
                "searchTerms": ["groups of sixty", "groups of 60"],
            },
        ],
    },
    {
        "id": "s08",
        "audioFile": "si-units-s08.mp3",
        "cues": [
            {
                "id": "two-point-four-kilometres",
                "searchTerms": ["two point four kilometres", "2 .4 km"],
            },
            {
                "id": "two-thousand-four-hundred-metres",
                "searchTerms": [
                    "two thousand four hundred metres",
                    "2 ,400 meters",
                ],
            },
            {
                "id": "four-hundred-eighty-seconds",
                "searchTerms": ["four hundred eighty seconds", "480 seconds"],
            },
            {
                "id": "five-metres-per-second",
                "searchTerms": ["five metres per second", "5 meters per second"],
            },
        ],
    },
    {
        "id": "s09",
        "audioFile": "si-units-s09.mp3",
        "cues": [
            {
                "id": "metres-per-second",
                "searchTerms": ["metres per second", "meters per second"],
            },
            {
                "id": "metres-per-second-squared",
                "searchTerms": [
                    "metres per second squared",
                    "meters per second squared",
                ],
            },
            {
                "id": "velocity-changes",
                "searchTerms": ["velocity changes"],
            },
            {"id": "unit", "searchTerms": ["unit"]},
        ],
    },
    {
        "id": "s10",
        "audioFile": "si-units-s10.mp3",
        "cues": [
            {"id": "metres", "searchTerms": ["metres", "meters"]},
            {
                "id": "mass-is-not-weight",
                "searchTerms": ["mass is not weight"],
            },
            {"id": "convert", "searchTerms": ["convert"]},
            {"id": "saves-marks", "searchTerms": ["saves marks"]},
        ],
    },
]


def clean_token(value):
    """Normalize one Whisper or cue token for exact comparison."""
    return re.sub(r"[^a-z0-9'\-]", "", value.lower())


def resolve_cues(words, cue_keywords):
    """Resolve storyboard phrases to their first unused word timestamps."""
    cue_map = {}
    used_indices = set()
    missed = []

    normalized_words = [clean_token(word["word"]) for word in words]

    for cue in cue_keywords:
        resolved = False
        for term in cue["searchTerms"]:
            term_words = [clean_token(part) for part in term.split()]
            term_words = [part for part in term_words if part]
            if not term_words:
                continue

            last_start = len(words) - len(term_words) + 1
            for start_index in range(last_start):
                indices = range(start_index, start_index + len(term_words))
                if any(index in used_indices for index in indices):
                    continue
                candidate = normalized_words[
                    start_index : start_index + len(term_words)
                ]
                if candidate == term_words:
                    cue_map[cue["id"]] = round(words[start_index]["start"], 2)
                    used_indices.update(indices)
                    resolved = True
                    break
            if resolved:
                break
        if not resolved:
            missed.append(cue["id"])

    return cue_map, missed


def get_audio_duration(audio_path):
    """Read the encoded MP3 duration without Whisper's internal rounding."""
    output = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(audio_path),
        ],
        text=True,
    )
    return float(output.strip())


def transcribe_job(model, job, generated_at):
    """Transcribe a scene and return the canonical transcript object."""
    print(f"\n{'=' * 40} {job['id'].upper()} {'=' * 40}")

    audio_path = AUDIO_DIR / job["audioFile"]
    file_size = audio_path.stat().st_size
    print(f"Audio: {job['audioFile']} ({file_size // 1024} KB)")
    print("Transcribing with local Whisper...")

    segments, info = model.transcribe(
        str(audio_path),
        language="en",
        word_timestamps=True,
        beam_size=5,
    )

    words = []
    full_text_parts = []
    for segment in segments:
        full_text_parts.append(segment.text.strip())
        if segment.words:
            for word in segment.words:
                words.append(
                    {
                        "word": word.word.strip(),
                        "start": round(word.start, 2),
                        "end": round(word.end, 2),
                    }
                )

    duration = get_audio_duration(audio_path)
    full_text = " ".join(full_text_parts)
    print(
        f"OK {duration:.6f}s MP3, {info.duration:.1f}s Whisper, "
        f"{len(words)} words"
    )

    cue_map, missed = resolve_cues(words, job["cues"])
    print(f"Cues: {len(cue_map)}/{len(job['cues'])} resolved")
    if missed:
        print(f"MISSED: {', '.join(missed)}")
    for cue_id, cue_time in cue_map.items():
        print(f"  {cue_id}: {cue_time:.2f}s")

    print(f"Word list ({len(words)} words):")
    for index, word in enumerate(words):
        print(f"  [{index}] {word['start']:.2f}s \"{word['word']}\"")

    transcript = {
        "id": job["id"],
        "audio": job["audioFile"],
        "duration": round(duration, 6),
        "wordCount": len(words),
        "text": full_text,
        "words": words,
        "cues": cue_map,
        "generatedAt": generated_at,
        "engine": ENGINE,
    }
    return transcript, missed


def main():
    print("S.I. Units for Mechanics -- Local Whisper Transcription")
    print("=" * 65)
    print(f"Model: {MODEL_SIZE} (faster-whisper, CPU)")
    print("Cost: $0.00 (local)\n")

    missing_audio = [
        job["audioFile"]
        for job in JOBS
        if not (AUDIO_DIR / job["audioFile"]).is_file()
    ]
    if missing_audio:
        raise FileNotFoundError(f"Missing narration audio: {', '.join(missing_audio)}")

    print("Loading model (first run downloads about 500 MB)...")
    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
    print("Model loaded\n")

    generated_at = datetime.now().isoformat()
    scenes = []
    all_missed = []
    total_duration = 0.0

    for job in JOBS:
        transcript, missed = transcribe_job(model, job, generated_at)
        scenes.append(transcript)
        total_duration += transcript["duration"]
        all_missed.extend(f"{job['id']}:{cue_id}" for cue_id in missed)

    transcript_data = {
        "project": "mechanics-si-units",
        "sceneCount": len(scenes),
        "totalDuration": round(total_duration, 6),
        "generatedAt": generated_at,
        "engine": ENGINE,
        "scenes": scenes,
    }

    TRANSCRIPT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(TRANSCRIPT_PATH, "w") as output_file:
        json.dump(transcript_data, output_file, indent=2)
        output_file.write("\n")

    print(f"\nSaved: {TRANSCRIPT_PATH}")
    if all_missed:
        print(f"Unresolved cues: {', '.join(all_missed)}")
        raise SystemExit(1)
    print("All storyboard cues resolved")


if __name__ == "__main__":
    main()
