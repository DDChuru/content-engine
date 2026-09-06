#!/usr/bin/env python3
"""Transcribe the Modelling Assumptions explainer with local faster-whisper."""

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
    / "../remotion/public/transcripts/mechanics/modelling-assumptions.json"
)

MODEL_SIZE = "small"
ENGINE = "faster-whisper-small (local)"


# Cue IDs are stable composition keys. The occurrence selector disambiguates
# repeated storyboard words without coupling resolution to generated timings.
JOBS = [
    {
        "id": "s01",
        "audioFile": "modelling-assumptions-s01.mp3",
        "cues": [
            {"id": "model", "searchTerms": ["model"]},
            {"id": "particle", "searchTerms": ["particle"]},
            {"id": "one-point", "searchTerms": ["one point"]},
            {"id": "separate-choice", "searchTerms": ["separate choice"]},
        ],
    },
    {
        "id": "s02",
        "audioFile": "modelling-assumptions-s02.mp3",
        "cues": [
            {"id": "light", "searchTerms": ["light"], "occurrence": 1},
            {"id": "rotational-inertia", "searchTerms": ["rotational inertia"]},
            {"id": "stretchy", "searchTerms": ["stretchy"]},
            {"id": "keeps-its-length", "searchTerms": ["keeps its length"]},
        ],
    },
    {
        "id": "s03",
        "audioFile": "modelling-assumptions-s03.mp3",
        "cues": [
            {"id": "smooth-surface", "searchTerms": ["smooth surface"]},
            {"id": "rough-surface", "searchTerms": ["rough surface"]},
            {"id": "pulley-or-peg", "searchTerms": ["pulley or peg"]},
            {"id": "light-string", "searchTerms": ["light string"]},
        ],
    },
    {
        "id": "s04",
        "audioFile": "modelling-assumptions-s04.mp3",
        "cues": [
            {"id": "rigid-rod", "searchTerms": ["rigid rod"]},
            {"id": "beam", "searchTerms": ["beam"]},
            {"id": "uniform", "searchTerms": ["uniform"], "occurrence": 1},
            {"id": "midpoint", "searchTerms": ["midpoint"]},
        ],
    },
    {
        "id": "s05",
        "audioFile": "modelling-assumptions-s05.mp3",
        "cues": [
            {"id": "bead", "searchTerms": ["bead"]},
            {"id": "normal", "searchTerms": ["normal"]},
            {"id": "plane", "searchTerms": ["plane"]},
            {"id": "peg", "searchTerms": ["peg"]},
        ],
    },
    {
        "id": "s06",
        "audioFile": "modelling-assumptions-s06.mp3",
        "cues": [
            {"id": "supported", "searchTerms": ["supported"]},
            {"id": "equations", "searchTerms": ["equations"]},
            {"id": "acceleration", "searchTerms": ["acceleration"], "occurrence": 2},
        ],
    },
    {
        "id": "s07",
        "audioFile": "modelling-assumptions-s07.mp3",
        "cues": [
            {"id": "shortcut", "searchTerms": ["shortcut"]},
            {"id": "other-choices", "searchTerms": ["other choices"]},
            {"id": "rough-bench", "searchTerms": ["rough bench"]},
        ],
    },
    {
        "id": "s08",
        "audioFile": "modelling-assumptions-s08.mp3",
        "cues": [
            {"id": "particle", "searchTerms": ["particle"]},
            {"id": "smooth", "searchTerms": ["smooth"]},
            {"id": "uniform", "searchTerms": ["uniform"]},
            {"id": "state-it", "searchTerms": ["state it"]},
        ],
    },
]


def clean_token(value):
    """Normalize one Whisper or cue token for exact comparison."""
    return re.sub(r"[^a-z0-9'\-]", "", value.lower())


def resolve_cues(words, cue_keywords):
    """Resolve storyboard phrases to selected unused word timestamps."""
    cue_map = {}
    used_indices = set()
    missed = []
    normalized_words = [clean_token(word["word"]) for word in words]

    for cue in cue_keywords:
        resolved = False
        occurrence = cue.get("occurrence", 1)
        if occurrence < 1:
            raise ValueError(f"Cue {cue['id']} has invalid occurrence {occurrence}")

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
                candidate = normalized_words[start_index : start_index + len(term_words)]
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
    print("Modelling Assumptions -- Local Whisper Transcription")
    print("=" * 58)
    print(f"Model: {MODEL_SIZE} (faster-whisper, CPU)")
    print("Cost: $0.00 (local)\n")

    cue_count = sum(len(job["cues"]) for job in JOBS)
    if len(JOBS) != 8 or cue_count != 30:
        raise RuntimeError(
            f"Expected 8 narration jobs and 30 cues; found {len(JOBS)} jobs and {cue_count} cues"
        )

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

    if all_missed:
        raise RuntimeError(f"Unresolved storyboard cues: {', '.join(all_missed)}")

    transcript_data = {
        "project": "mechanics-modelling-assumptions",
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
    print("All 30 storyboard cues resolved")


if __name__ == "__main__":
    main()
