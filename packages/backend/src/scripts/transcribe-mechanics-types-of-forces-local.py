#!/usr/bin/env python3
"""
Batch transcribe the Types of Force mechanics explainer with local
faster-whisper.

Uses word-level timestamps for narration-driven Remotion cues and records the
encoded duration of each of the ten ElevenLabs scene files.
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
    / "../remotion/public/transcripts/mechanics/types-of-forces.json"
)

MODEL_SIZE = "small"
ENGINE = "faster-whisper-small (local)"


# Cue IDs are stable composition keys. Search terms begin with the exact
# storyboard phrase; alternatives are added only for observed Whisper output.
JOBS = [
    {
        "id": "s01",
        "audioFile": "types-of-forces-s01.mp3",
        "cues": [
            {"id": "invisible", "searchTerms": ["invisible"]},
            {"id": "pull", "searchTerms": ["pull"]},
            {"id": "push", "searchTerms": ["push"]},
            {"id": "which-forces", "searchTerms": ["which forces"]},
        ],
    },
    {
        "id": "s02",
        "audioFile": "types-of-forces-s02.mp3",
        "cues": [
            {"id": "vector", "searchTerms": ["vector"]},
            {"id": "size", "searchTerms": ["size"]},
            {"id": "direction", "searchTerms": ["direction"]},
            {"id": "newtons", "searchTerms": ["newtons"]},
            {"id": "one-point", "searchTerms": ["one point"]},
        ],
    },
    {
        "id": "s03",
        "audioFile": "types-of-forces-s03.mp3",
        "cues": [
            {"id": "weight", "searchTerms": ["weight"]},
            {
                "id": "mass-times-gravity",
                "searchTerms": ["mass times gravity"],
            },
            {"id": "normal-reaction", "searchTerms": ["normal reaction"]},
            {"id": "tilt", "searchTerms": ["tilt"]},
        ],
    },
    {
        "id": "s04",
        "audioFile": "types-of-forces-s04.mp3",
        "cues": [
            {"id": "tension", "searchTerms": ["tension"]},
            {"id": "rod", "searchTerms": ["rod"]},
            {"id": "thrust", "searchTerms": ["thrust"]},
            {"id": "slack", "searchTerms": ["slack"]},
        ],
    },
    {
        "id": "s05",
        "audioFile": "types-of-forces-s05.mp3",
        "cues": [
            {"id": "opposes", "searchTerms": ["opposes"]},
            {"id": "ice", "searchTerms": ["ice"]},
            {"id": "sand", "searchTerms": ["sand"]},
            {"id": "limit", "searchTerms": ["limit"]},
        ],
    },
    {
        "id": "s06",
        "audioFile": "types-of-forces-s06.mp3",
        "cues": [
            {"id": "driving", "searchTerms": ["driving"]},
            {"id": "braking", "searchTerms": ["braking", "breaking"]},
            {"id": "air-resistance", "searchTerms": ["air resistance"]},
            {"id": "balance", "searchTerms": ["balance", "balanced"]},
        ],
    },
    {
        "id": "s07",
        "audioFile": "types-of-forces-s07.mp3",
        "cues": [
            {"id": "vertical", "searchTerms": ["vertical"]},
            {"id": "perpendicular", "searchTerms": ["perpendicular"]},
            {"id": "downhill", "searchTerms": ["downhill"]},
            {"id": "friction", "searchTerms": ["friction"]},
            {"id": "remains-at-rest", "searchTerms": ["remains at rest"]},
        ],
    },
    {
        "id": "s08",
        "audioFile": "types-of-forces-s08.mp3",
        "cues": [
            {"id": "isolate", "searchTerms": ["isolate"]},
            {"id": "weight", "searchTerms": ["weight"]},
            {"id": "reaction", "searchTerms": ["reaction"]},
            {"id": "tension", "searchTerms": ["tension"]},
            {"id": "friction", "searchTerms": ["friction"]},
            {"id": "only-forces", "searchTerms": ["only forces"]},
        ],
    },
    {
        "id": "s09",
        "audioFile": "types-of-forces-s09.mp3",
        "cues": [
            {"id": "vertically", "searchTerms": ["vertically"]},
            {"id": "horizontally", "searchTerms": ["horizontally"]},
            {"id": "remaining-force", "searchTerms": ["remaining force"]},
            {"id": "accelerates", "searchTerms": ["accelerates"]},
        ],
    },
    {
        "id": "s10",
        "audioFile": "types-of-forces-s10.mp3",
        "cues": [
            {"id": "weight", "searchTerms": ["weight"]},
            {"id": "reaction", "searchTerms": ["reaction"]},
            {"id": "tension", "searchTerms": ["tension"]},
            {"id": "thrust", "searchTerms": ["thrust"]},
            {"id": "friction", "searchTerms": ["friction"]},
            {"id": "resistance", "searchTerms": ["resistance"]},
            {"id": "driving-force", "searchTerms": ["driving force"]},
            {"id": "one-body", "searchTerms": ["one body"]},
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
    print("Types of Force for Mechanics -- Local Whisper Transcription")
    print("=" * 62)
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
        "project": "mechanics-types-of-forces",
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
