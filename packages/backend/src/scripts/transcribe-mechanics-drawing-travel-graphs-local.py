#!/usr/bin/env python3
"""Transcribe the Drawing Travel Graphs explainer with local faster-whisper."""

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
    / "../remotion/public/transcripts/mechanics/drawing-travel-graphs.json"
)

MODEL_SIZE = "small"
ENGINE = "faster-whisper-small (local)"


# Cue IDs are stable composition keys. Alternatives cover common Whisper
# spellings without changing the storyboard's spoken wording.
JOBS = [
    {
        "id": "s01",
        "audioFile": "drawing-travel-graphs-s01.mp3",
        "cues": [
            {"id": "journey", "searchTerms": ["journey"]},
            {"id": "positive", "searchTerms": ["positive"]},
            {"id": "key-times", "searchTerms": ["key times"]},
            {"id": "axes-and-units", "searchTerms": ["axes and units", "axis and units"]},
        ],
    },
    {
        "id": "s02",
        "audioFile": "drawing-travel-graphs-s02.mp3",
        "cues": [
            {"id": "steadily", "searchTerms": ["steadily"]},
            {"id": "slows", "searchTerms": ["slows"]},
            {"id": "waits", "searchTerms": ["waits", "weights"]},
            {"id": "returns", "searchTerms": ["returns"]},
        ],
    },
    {
        "id": "s03",
        "audioFile": "drawing-travel-graphs-s03.mp3",
        "cues": [
            {"id": "gradient", "searchTerms": ["gradient"]},
            {"id": "same-instant", "searchTerms": ["same instant"]},
            {"id": "signed-areas", "searchTerms": ["signed areas"]},
            {"id": "bridge", "searchTerms": ["bridge"]},
        ],
    },
    {
        "id": "s04",
        "audioFile": "drawing-travel-graphs-s04.mp3",
        "cues": [
            {"id": "speed", "searchTerms": ["speed"]},
            {"id": "triangle", "searchTerms": ["triangle"]},
            {"id": "finish", "searchTerms": ["finish"]},
        ],
    },
    {
        "id": "s05",
        "audioFile": "drawing-travel-graphs-s05.mp3",
        "cues": [
            {"id": "positive-velocity", "searchTerms": ["positive velocity"]},
            {"id": "zero-velocity", "searchTerms": ["zero velocity"]},
            {"id": "negative-velocity", "searchTerms": ["negative velocity"]},
            {"id": "reaches-the-start", "searchTerms": ["reaches the start"]},
        ],
    },
    {
        "id": "s06",
        "audioFile": "drawing-travel-graphs-s06.mp3",
        "cues": [
            {"id": "straight", "searchTerms": ["straight"]},
            {"id": "direction-change", "searchTerms": ["direction change"]},
            {"id": "signed-areas", "searchTerms": ["signed areas"]},
        ],
    },
    {
        "id": "s07",
        "audioFile": "drawing-travel-graphs-s07.mp3",
        "cues": [
            {"id": "sketch", "searchTerms": ["sketch"]},
            {"id": "accurate-plot", "searchTerms": ["accurate plot"]},
            {"id": "labelled-axes", "searchTerms": ["labelled axes", "labeled axes"]},
            {"id": "negative-region", "searchTerms": ["negative region"]},
        ],
    },
    {
        "id": "s08",
        "audioFile": "drawing-travel-graphs-s08.mp3",
        "cues": [
            {"id": "key-times", "searchTerms": ["key times"]},
            {"id": "gradient", "searchTerms": ["gradient"]},
            {"id": "signed-area", "searchTerms": ["signed area"]},
            {"id": "shape-check", "searchTerms": ["shape check"]},
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
    print("Drawing Travel Graphs -- Local Whisper Transcription")
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
        "project": "mechanics-drawing-travel-graphs",
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
