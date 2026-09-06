#!/usr/bin/env python3
"""
Batch transcribe the Displacement-Time Graphs mechanics explainer with local
faster-whisper.

Uses the same local Whisper settings and transcript fields as the other
mechanics explainers, with all ten scene transcripts collected in one JSON
file for the Remotion composition.
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
    SCRIPT_DIR
    / "../remotion/public/transcripts/mechanics/displacement-time-graphs.json"
)

# Use 'small' model -- accurate for clear English narration and fast on CPU.
MODEL_SIZE = "small"
ENGINE = "faster-whisper-small (local)"


# Cue IDs are stable composition keys. Search terms begin with the exact
# storyboard phrase; observed Whisper alternatives are appended only when
# needed. Additional number cues keep worked values word-synchronous.
JOBS = [
    {
        "id": "s01",
        "audioFile": "displacement-time-graphs-s01.mp3",
        "cues": [
            {"id": "record", "searchTerms": ["record"]},
            {"id": "particle", "searchTerms": ["particle"]},
            {"id": "origin", "searchTerms": ["origin"]},
        ],
    },
    {
        "id": "s02",
        "audioFile": "displacement-time-graphs-s02.mp3",
        "cues": [
            {"id": "time", "searchTerms": ["Time"]},
            {"id": "displacement", "searchTerms": ["Displacement"]},
            {
                "id": "positive-direction",
                "searchTerms": ["positive direction"],
            },
            {"id": "matches", "searchTerms": ["matches"]},
        ],
    },
    {
        "id": "s03",
        "audioFile": "displacement-time-graphs-s03.mp3",
        "cues": [
            {"id": "gradient", "searchTerms": ["gradient"]},
            {"id": "positive", "searchTerms": ["positive"]},
            {"id": "negative", "searchTerms": ["negative"]},
            {"id": "steeper", "searchTerms": ["steeper"]},
        ],
    },
    {
        "id": "s04",
        "audioFile": "displacement-time-graphs-s04.mp3",
        "cues": [
            {"id": "constant", "searchTerms": ["constant"]},
            {"id": "zero", "searchTerms": ["zero"]},
            {"id": "curve", "searchTerms": ["curve"]},
            {"id": "changing", "searchTerms": ["changing"]},
        ],
    },
    {
        "id": "s05",
        "audioFile": "displacement-time-graphs-s05.mp3",
        "cues": [
            {"id": "tangent", "searchTerms": ["tangent"]},
            {"id": "instant", "searchTerms": ["instant"]},
            {"id": "gradient", "searchTerms": ["gradient"]},
            {"id": "pivots", "searchTerms": ["pivots"]},
        ],
    },
    {
        "id": "s06",
        "audioFile": "displacement-time-graphs-s06.mp3",
        "cues": [
            {"id": "toward", "searchTerms": ["toward"]},
            {"id": "origin", "searchTerms": ["origin"], "occurrence": 2},
            {"id": "negative", "searchTerms": ["negative"]},
            {"id": "flips", "searchTerms": ["flips"]},
        ],
    },
    {
        "id": "s07",
        "audioFile": "displacement-time-graphs-s07.mp3",
        "cues": [
            {"id": "two-metres", "searchTerms": ["two metres", "2 meters"]},
            {"id": "ten-metres", "searchTerms": ["ten metres", "10 meters"]},
            {"id": "four-seconds", "searchTerms": ["four seconds", "4 seconds"]},
            {
                "id": "two-metres-per-second",
                "searchTerms": ["two metres per second", "2 meters per second"],
            },
            {"id": "rests", "searchTerms": ["rests"]},
            {"id": "six-seconds", "searchTerms": ["six seconds", "6 seconds"]},
            {
                "id": "minus-six-metres",
                "searchTerms": ["minus six metres", "minus 6 meters"],
            },
            {"id": "ten-seconds", "searchTerms": ["ten seconds", "10 seconds"]},
            {
                "id": "minus-four-metres-per-second",
                "searchTerms": [
                    "minus four metres per second",
                    "minus 4 meters per second",
                ],
            },
        ],
    },
    {
        "id": "s08",
        "audioFile": "displacement-time-graphs-s08.mp3",
        "cues": [
            {"id": "finish", "searchTerms": ["finish"]},
            {"id": "minus-eight", "searchTerms": ["minus eight", "minus 8"]},
            {"id": "every-leg", "searchTerms": ["every leg"]},
            {
                "id": "eight-metres-out",
                "searchTerms": ["Eight metres out", "8 meters out"],
            },
            {
                "id": "sixteen-metres-back",
                "searchTerms": ["sixteen metres back", "16 meters back"],
            },
            {"id": "twenty-four", "searchTerms": ["twenty-four", "24"]},
        ],
    },
    {
        "id": "s09",
        "audioFile": "displacement-time-graphs-s09.mp3",
        "cues": [
            {"id": "ten-seconds", "searchTerms": ["ten seconds", "10 seconds"]},
            {
                "id": "average-velocity",
                "searchTerms": ["average velocity"],
            },
            {
                "id": "minus-zero-point-eight",
                "searchTerms": ["minus zero point eight", "minus 0 8"],
            },
            {"id": "average-speed", "searchTerms": ["average speed"]},
            {
                "id": "two-point-four",
                "searchTerms": ["two point four", "2 4"],
            },
            {"id": "direction", "searchTerms": ["direction"]},
        ],
    },
    {
        "id": "s10",
        "audioFile": "displacement-time-graphs-s10.mp3",
        "cues": [
            {"id": "gradient", "searchTerms": ["gradient"]},
            {"id": "tangent", "searchTerms": ["tangent"]},
            {"id": "distance", "searchTerms": ["distance"]},
            {
                "id": "endpoint-displacement",
                "searchTerms": ["displacement"],
                "occurrence": 2,
            },
            {"id": "separate", "searchTerms": ["separate"]},
        ],
    },
]


def clean_token(value):
    """Normalize one Whisper or cue token for exact comparison."""
    return re.sub(r"[^a-z0-9'\-]", "", value.lower())


def resolve_cues(words, cue_keywords):
    """Resolve storyboard phrases to word timestamps without reusing words."""
    cue_map = {}
    used_indices = set()
    missed = []

    normalized_words = [clean_token(word["word"]) for word in words]

    for cue in cue_keywords:
        resolved = False
        occurrence = cue.get("occurrence", 1)
        for term in cue["searchTerms"]:
            term_words = [clean_token(part) for part in term.split()]
            term_words = [part for part in term_words if part]
            if not term_words:
                continue

            matches = []
            last_start = len(words) - len(term_words) + 1
            for start_index in range(last_start):
                indices = range(start_index, start_index + len(term_words))
                if any(index in used_indices for index in indices):
                    continue
                candidate = normalized_words[
                    start_index : start_index + len(term_words)
                ]
                if candidate == term_words:
                    matches.append(start_index)

            if len(matches) >= occurrence:
                start_index = matches[occurrence - 1]
                indices = range(start_index, start_index + len(term_words))
                cue_map[cue["id"]] = round(words[start_index]["start"], 2)
                used_indices.update(indices)
                resolved = True
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
    print("Displacement-Time Graphs for Mechanics -- Local Whisper Transcription")
    print("=" * 72)
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
        "project": "mechanics-displacement-time-graphs",
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
