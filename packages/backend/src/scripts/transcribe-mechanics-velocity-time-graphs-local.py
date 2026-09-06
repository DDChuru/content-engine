#!/usr/bin/env python3
"""Transcribe the Velocity-Time Graphs explainer with local faster-whisper."""

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
    / "../remotion/public/transcripts/mechanics/velocity-time-graphs.json"
)

MODEL_SIZE = "small"
ENGINE = "faster-whisper-small (local)"


# Cue IDs are stable composition keys. Alternatives cover common Whisper
# spellings without changing the spoken storyboard wording.
JOBS = [
    {
        "id": "s01",
        "audioFile": "velocity-time-graphs-s01.mp3",
        "cues": [
            {"id": "journey", "searchTerms": ["journey"]},
            {"id": "graph", "searchTerms": ["graph"]},
            {"id": "measure", "searchTerms": ["measure"]},
        ],
    },
    {
        "id": "s02",
        "audioFile": "velocity-time-graphs-s02.mp3",
        "cues": [
            {"id": "time", "searchTerms": ["time"]},
            {"id": "velocity", "searchTerms": ["velocity"]},
            {"id": "above-zero", "searchTerms": ["above zero"]},
            {"id": "below-zero", "searchTerms": ["below zero"]},
        ],
    },
    {
        "id": "s03",
        "audioFile": "velocity-time-graphs-s03.mp3",
        "cues": [
            {"id": "flat", "searchTerms": ["flat"]},
            {"id": "straight-slope", "searchTerms": ["straight slope"]},
            {"id": "opposite-signs", "searchTerms": ["opposite acceleration signs", "opposite signs"]},
            {"id": "curve", "searchTerms": ["curve"]},
        ],
    },
    {
        "id": "s04",
        "audioFile": "velocity-time-graphs-s04.mp3",
        "cues": [
            {"id": "gradient", "searchTerms": ["gradient"]},
            {"id": "four", "searchTerms": ["four", "4"]},
            {"id": "sixteen", "searchTerms": ["sixteen", "16"]},
            {"id": "twelve", "searchTerms": ["twelve", "12"]},
            {"id": "six-seconds", "searchTerms": ["six seconds", "6 seconds"]},
            {"id": "two", "searchTerms": ["two metres", "two meters", "2 metres", "2 meters"]},
        ],
    },
    {
        "id": "s05",
        "audioFile": "velocity-time-graphs-s05.mp3",
        "cues": [
            {"id": "area", "searchTerms": ["area"]},
            {"id": "displacement", "searchTerms": ["displacement"]},
            {"id": "below-zero", "searchTerms": ["below zero"]},
            {"id": "distance", "searchTerms": ["distance"]},
        ],
    },
    {
        "id": "s06",
        "audioFile": "velocity-time-graphs-s06.mp3",
        "cues": [
            {"id": "twelve", "searchTerms": ["twelve metres", "twelve meters", "12 metres", "12 meters"]},
            {"id": "four", "searchTerms": ["four seconds", "4 seconds"]},
            {"id": "five", "searchTerms": ["five seconds", "5 seconds"]},
            {"id": "three", "searchTerms": ["three", "3"]},
            {"id": "split", "searchTerms": ["split"]},
            {"id": "area-twenty-four", "searchTerms": ["twenty-four", "twenty four", "24"]},
            {"id": "area-sixty", "searchTerms": ["sixty", "60"]},
            {"id": "area-eighteen", "searchTerms": ["eighteen", "18"]},
            {"id": "one-hundred-and-two", "searchTerms": ["one hundred and two", "102"]},
        ],
    },
    {
        "id": "s07",
        "audioFile": "velocity-time-graphs-s07.mp3",
        "cues": [
            {"id": "forward-area", "searchTerms": ["forward area"]},
            {"id": "backward-area", "searchTerms": ["backward area"]},
            {"id": "displacement", "searchTerms": ["displacement"]},
            {"id": "distance", "searchTerms": ["distance"]},
            {"id": "average-velocity", "searchTerms": ["average velocity"]},
            {"id": "average-speed", "searchTerms": ["average speed"]},
        ],
    },
    {
        "id": "s08",
        "audioFile": "velocity-time-graphs-s08.mp3",
        "cues": [
            {"id": "constant-acceleration", "searchTerms": ["constant acceleration"]},
            {"id": "suvat", "searchTerms": ["suvat", "sue vat", "su vat", "suvajit"]},
            {"id": "displacement", "searchTerms": ["displacement"]},
            {"id": "corner", "searchTerms": ["corner"]},
        ],
    },
    {
        "id": "s09",
        "audioFile": "velocity-time-graphs-s09.mp3",
        "cues": [
            {"id": "velocity-time", "searchTerms": ["velocity-time", "velocity time"]},
            {"id": "negative", "searchTerms": ["negative"]},
            {"id": "squared", "searchTerms": ["squared"]},
        ],
    },
    {
        "id": "s10",
        "audioFile": "velocity-time-graphs-s10.mp3",
        "cues": [
            {"id": "height", "searchTerms": ["height"]},
            {"id": "gradient", "searchTerms": ["gradient"]},
            {"id": "signed-area", "searchTerms": ["signed area"]},
            {"id": "absolute-area", "searchTerms": ["absolute area"]},
            {"id": "flat-line", "searchTerms": ["flat line"]},
            {"id": "crossing-zero", "searchTerms": ["crossing zero"]},
            {"id": "average-velocity", "searchTerms": ["average velocity"]},
            {"id": "average-speed", "searchTerms": ["average speed"]},
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
                candidate = normalized_words[start_index : start_index + len(term_words)]
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
    """Read encoded MP3 duration without Whisper's internal rounding."""
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
    print(f"Audio: {job['audioFile']} ({audio_path.stat().st_size // 1024} KB)")
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
    print("Velocity-Time Graphs -- Local Whisper Transcription")
    print("=" * 58)
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
        "project": "mechanics-velocity-time-graphs",
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
