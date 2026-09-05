#!/usr/bin/env python3
"""
Batch transcribe the Scalars and Vectors mechanics explainer with local
faster-whisper.

Uses the same local Whisper settings and transcript fields as the S.I. Units
script, with all eleven scene transcripts collected in one JSON file for the
Remotion composition.
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
    / "../remotion/public/transcripts/mechanics/scalars-vectors.json"
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
        "audioFile": "scalars-vectors-s01.mp3",
        "cues": [
            {"id": "how-much", "searchTerms": ["how much"]},
            {"id": "which-way", "searchTerms": ["which way"]},
            {"id": "scalars", "searchTerms": ["scalars"]},
            {"id": "vectors", "searchTerms": ["vectors"]},
        ],
    },
    {
        "id": "s02",
        "audioFile": "scalars-vectors-s02.mp3",
        "cues": [
            {"id": "scalar", "searchTerms": ["scalar"]},
            {"id": "magnitude", "searchTerms": ["magnitude"]},
            {"id": "direction", "searchTerms": ["direction"]},
            {"id": "velocity", "searchTerms": ["velocity"]},
        ],
    },
    {
        "id": "s03",
        "audioFile": "scalars-vectors-s03.mp3",
        "cues": [
            {
                "id": "five-metres-east",
                "searchTerms": ["five metres east", "5 meters east"],
            },
            {
                "id": "two-metres-west",
                "searchTerms": ["two metres west", "2 meters west"],
            },
            {"id": "distance", "searchTerms": ["distance"]},
            {"id": "displacement", "searchTerms": ["displacement"]},
        ],
    },
    {
        "id": "s04",
        "audioFile": "scalars-vectors-s04.mp3",
        "cues": [
            {"id": "speed", "searchTerms": ["speed"]},
            {"id": "velocity", "searchTerms": ["velocity"]},
            {
                "id": "one-metre-per-second",
                "searchTerms": ["one metre per second", "one meter per second"],
            },
            {"id": "east", "searchTerms": ["east"]},
        ],
    },
    {
        "id": "s05",
        "audioFile": "scalars-vectors-s05.mp3",
        "cues": [
            {"id": "right", "searchTerms": ["right"]},
            {"id": "back", "searchTerms": ["back"]},
            {"id": "six-metres", "searchTerms": ["six metres", "6 meters"]},
            {"id": "zero", "searchTerms": ["zero", "0"]},
        ],
    },
    {
        "id": "s06",
        "audioFile": "scalars-vectors-s06.mp3",
        "cues": [
            {"id": "acceleration", "searchTerms": ["acceleration"]},
            {"id": "slowing-down", "searchTerms": ["slowing down"]},
            {"id": "turning", "searchTerms": ["turning"]},
            {"id": "force", "searchTerms": ["force"]},
        ],
    },
    {
        "id": "s07",
        "audioFile": "scalars-vectors-s07.mp3",
        "cues": [
            {
                "id": "positive-direction",
                "searchTerms": ["positive direction"],
            },
            {"id": "leftward", "searchTerms": ["leftward"]},
            {
                "id": "negative-component",
                "searchTerms": ["negative component"],
            },
            {"id": "opposite", "searchTerms": ["opposite"]},
        ],
    },
    {
        "id": "s08",
        "audioFile": "scalars-vectors-s08.mp3",
        "cues": [
            {"id": "speed", "searchTerms": ["speed"]},
            {"id": "distance", "searchTerms": ["distance"]},
            {"id": "mass", "searchTerms": ["mass"]},
            {"id": "time", "searchTerms": ["time"]},
        ],
    },
    {
        "id": "s09",
        "audioFile": "scalars-vectors-s09.mp3",
        "cues": [
            {"id": "energy", "searchTerms": ["energy"]},
            {"id": "velocity", "searchTerms": ["velocity"]},
            {"id": "displacement", "searchTerms": ["displacement"]},
            {"id": "acceleration", "searchTerms": ["acceleration"]},
        ],
    },
    {
        "id": "s10",
        "audioFile": "scalars-vectors-s10.mp3",
        "cues": [
            {"id": "force", "searchTerms": ["force"]},
            {"id": "weight", "searchTerms": ["weight"]},
            {"id": "momentum", "searchTerms": ["momentum"]},
            {"id": "completes", "searchTerms": ["completes"]},
        ],
    },
    {
        "id": "s11",
        "audioFile": "scalars-vectors-s11.mp3",
        "cues": [
            {"id": "scalar", "searchTerms": ["scalar"]},
            {"id": "vector", "searchTerms": ["vector"]},
            {
                "id": "positive-direction",
                "searchTerms": ["positive direction"],
            },
            {"id": "always-ask", "searchTerms": ["always ask"]},
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
    print("Scalars and Vectors for Mechanics -- Local Whisper Transcription")
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
        "project": "mechanics-scalars-vectors",
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
