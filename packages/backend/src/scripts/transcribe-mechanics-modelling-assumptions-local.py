#!/usr/bin/env python3
"""Transcribe the Modelling Assumptions explainer with local faster-whisper."""

import argparse
import hashlib
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
            {
                "id": "syllabus",
                "searchTerms": [
                    "syllabus"
                ]
            },
            {
                "id": "quote",
                "searchTerms": [
                    "use the model"
                ]
            },
            {
                "id": "outcomes",
                "searchTerms": [
                    "by the end"
                ]
            },
            {
                "id": "explain",
                "searchTerms": [
                    "explain"
                ]
            },
            {
                "id": "list",
                "searchTerms": [
                    "list assumptions"
                ]
            },
            {
                "id": "match",
                "searchTerms": [
                    "match modelling",
                    "match modeling"
                ]
            }
        ]
    },
    {
        "id": "s02",
        "audioFile": "modelling-assumptions-s02.mp3",
        "cues": [
            {
                "id": "real",
                "searchTerms": [
                    "real problem"
                ]
            },
            {
                "id": "assumptions",
                "searchTerms": [
                    "choose assumptions"
                ]
            },
            {
                "id": "equations",
                "searchTerms": [
                    "equations"
                ]
            },
            {
                "id": "check",
                "searchTerms": [
                    "check whether"
                ]
            },
            {
                "id": "refine",
                "searchTerms": [
                    "refine"
                ]
            }
        ]
    },
    {
        "id": "s03",
        "audioFile": "modelling-assumptions-s03.mp3",
        "cues": [
            {
                "id": "stone",
                "searchTerms": [
                    "stone at a cliff"
                ]
            },
            {
                "id": "dimensions",
                "searchTerms": [
                    "two or three dimensional"
                ]
            },
            {
                "id": "air",
                "searchTerms": [
                    "air and wind"
                ]
            },
            {
                "id": "size",
                "searchTerms": [
                    "size shape and spin"
                ]
            },
            {
                "id": "gravity",
                "searchTerms": [
                    "gravity pulls"
                ]
            },
            {
                "id": "vertical",
                "searchTerms": [
                    "vertical fall"
                ]
            },
            {
                "id": "no-air",
                "searchTerms": [
                    "ignore air"
                ]
            },
            {
                "id": "particle",
                "searchTerms": [
                    "use a particle"
                ]
            },
            {
                "id": "constant",
                "searchTerms": [
                    "keep gravity constant"
                ]
            },
            {
                "id": "model",
                "searchTerms": [
                    "our model"
                ]
            },
            {
                "id": "domain",
                "searchTerms": [
                    "from zero"
                ]
            },
            {
                "id": "zero",
                "searchTerms": [
                    "at zero"
                ]
            },
            {
                "id": "one",
                "searchTerms": [
                    "at one second"
                ]
            },
            {
                "id": "water",
                "searchTerms": [
                    "two seconds means"
                ]
            },
            {
                "id": "question",
                "searchTerms": [
                    "is one metre",
                    "is one meter",
                    "is 1 metre",
                    "is 1 meter"
                ]
            },
            {
                "id": "answer",
                "searchTerms": [
                    "no that misreads"
                ]
            },
            {
                "id": "refine-air",
                "searchTerms": [
                    "include air resistance"
                ]
            },
            {
                "id": "refine-size",
                "searchTerms": [
                    "keep the stone's",
                    "keep the stones"
                ]
            },
            {
                "id": "refine-motion",
                "searchTerms": [
                    "allow motion"
                ]
            },
            {
                "id": "zero-value",
                "searchTerms": [
                    "twenty metres",
                    "twenty meters",
                    "20 metres",
                    "20 meters"
                ]
            },
            {
                "id": "one-value",
                "searchTerms": [
                    "fifteen metres",
                    "fifteen meters",
                    "15 metres",
                    "15 meters"
                ]
            }
        ],
        "isolatedBeats": [
            1
        ]
    },
    {
        "id": "s04",
        "audioFile": "modelling-assumptions-s04.mp3",
        "cues": [
            {
                "id": "particle",
                "searchTerms": [
                    "a particle"
                ]
            },
            {
                "id": "smooth",
                "searchTerms": [
                    "smooth means"
                ]
            },
            {
                "id": "rough",
                "searchTerms": [
                    "rough allows"
                ]
            },
            {
                "id": "rod",
                "searchTerms": [
                    "a rod"
                ]
            },
            {
                "id": "uniform",
                "searchTerms": [
                    "uniform means"
                ]
            },
            {
                "id": "centre",
                "searchTerms": [
                    "at its centre",
                    "at its center"
                ]
            },
            {
                "id": "uneven",
                "searchTerms": [
                    "uneven mass"
                ]
            },
            {
                "id": "light",
                "searchTerms": [
                    "light means"
                ]
            },
            {
                "id": "heavy",
                "searchTerms": [
                    "a heavy string"
                ]
            },
            {
                "id": "inextensible",
                "searchTerms": [
                    "inextensible means"
                ]
            },
            {
                "id": "acceleration",
                "searchTerms": [
                    "equal acceleration"
                ]
            },
            {
                "id": "stretching",
                "searchTerms": [
                    "a stretching string"
                ]
            },
            {
                "id": "direction",
                "searchTerms": [
                    "different directions"
                ]
            },
            {
                "id": "friction",
                "searchTerms": [
                    "opposing sliding"
                ]
            }
        ]
    },
    {
        "id": "s05",
        "audioFile": "modelling-assumptions-s05.mp3",
        "cues": [
            {
                "id": "box",
                "searchTerms": [
                    "a box"
                ]
            },
            {
                "id": "desk",
                "searchTerms": [
                    "a desk"
                ]
            },
            {
                "id": "pulley",
                "searchTerms": [
                    "a pulley"
                ]
            },
            {
                "id": "sphere",
                "searchTerms": [
                    "hanging sphere"
                ]
            },
            {
                "id": "exercise",
                "searchTerms": [
                    "match five"
                ]
            },
            {
                "id": "q-particle",
                "searchTerms": [
                    "ignoring air resistance"
                ]
            },
            {
                "id": "particle",
                "searchTerms": [
                    "particle"
                ]
            },
            {
                "id": "separate",
                "searchTerms": [
                    "separate assumption"
                ]
            },
            {
                "id": "q-light",
                "searchTerms": [
                    "ignore string mass"
                ]
            },
            {
                "id": "light",
                "searchTerms": [
                    "light because"
                ]
            },
            {
                "id": "q-pulley",
                "searchTerms": [
                    "same tension"
                ]
            },
            {
                "id": "smooth-pulley",
                "searchTerms": [
                    "smooth pulley"
                ]
            },
            {
                "id": "q-surface",
                "searchTerms": [
                    "ignore desk friction"
                ]
            },
            {
                "id": "smooth-surface",
                "searchTerms": [
                    "smooth surface"
                ]
            },
            {
                "id": "q-string",
                "searchTerms": [
                    "same acceleration"
                ]
            },
            {
                "id": "inextensible",
                "searchTerms": [
                    "inextensible",
                    "in extensible"
                ]
            },
            {
                "id": "tension-second",
                "searchTerms": [
                    "our light string"
                ]
            },
            {
                "id": "acceleration-first",
                "searchTerms": [
                    "fixed length"
                ]
            },
            {
                "id": "acceleration-second",
                "searchTerms": [
                    "movements"
                ]
            },
            {
                "id": "connects",
                "searchTerms": [
                    "connects"
                ]
            }
        ]
    },
    {
        "id": "s06",
        "audioFile": "modelling-assumptions-s06.mp3",
        "cues": [
            {
                "id": "explain",
                "searchTerms": [
                    "explain"
                ]
            },
            {
                "id": "tick-explain",
                "searchTerms": [
                    "ignore"
                ]
            },
            {
                "id": "list",
                "searchTerms": [
                    "list assumptions"
                ]
            },
            {
                "id": "tick-list",
                "searchTerms": [
                    "why"
                ]
            },
            {
                "id": "match",
                "searchTerms": [
                    "match modelling",
                    "match modeling"
                ]
            },
            {
                "id": "tick-match",
                "searchTerms": [
                    "setup",
                    "set up"
                ]
            }
        ]
    }
]


def clean_token(value):
    """Normalize one Whisper or cue token for exact comparison."""
    return re.sub(r"[^a-z0-9]", "", value.lower())


def resolve_cues(words, cue_keywords, beats=None):
    """Resolve storyboard phrases to selected word timestamps (overlapping phrases are valid)."""
    cue_map = {}
    missed = []
    normalized_words = [clean_token(word["word"]) for word in words]

    for cue in cue_keywords:
        resolved = False
        occurrence = cue.get("occurrence", 1)
        if occurrence < 1:
            raise ValueError(f"Cue {cue['id']} has invalid occurrence {occurrence}")

        expected = None
        if beats:
            for term in cue["searchTerms"]:
                phrase = " ".join(clean_token(part) for part in term.split())
                matched_beats = []
                for beat in beats:
                    spoken = " ".join(clean_token(part) for part in beat["text"].split())
                    matched_beats.extend([beat] * len(re.findall(r"(?<!\w)" + re.escape(phrase) + r"(?!\w)", spoken)))
                if len(matched_beats) >= occurrence:
                    expected = matched_beats[occurrence - 1]
                    break

        for term in cue["searchTerms"]:
            term_words = [clean_token(part) for part in term.split()]
            term_words = [part for part in term_words if part]
            if not term_words:
                continue

            matches = []
            last_start = len(words) - len(term_words) + 1
            for start_index in range(last_start):
                indices = range(start_index, start_index + len(term_words))
                candidate = normalized_words[start_index : start_index + len(term_words)]
                if candidate == term_words:
                    last_index = start_index + len(term_words) - 1
                    if expected and (words[last_index]["end"] < expected["start"] or words[start_index]["start"] > expected["end"]):
                        continue
                    matches.append(start_index)

            selected_occurrence = 1 if expected else occurrence
            if len(matches) >= selected_occurrence:
                start_index = matches[selected_occurrence - 1]
                indices = range(start_index, start_index + len(term_words))
                cue_map[cue["id"]] = round(max(words[start_index]["start"], expected["start"] if expected else 0), 2)
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


def refine_readings(model, job, timing, words):
    """Re-read isolated values without copying numbers from the preceding sentence."""
    for index in job.get("isolatedBeats", []):
        beat = timing["beats"][index]
        segments, _ = model.transcribe(
            str(AUDIO_DIR / job["audioFile"]), language="en",
            word_timestamps=True, beam_size=5, vad_filter=False,
            clip_timestamps=[beat["start"], beat["end"]],
            initial_prompt=beat["text"], condition_on_previous_text=False,
        )
        replacement = [
            {"word": word.word.strip(), "start": round(max(beat["start"], word.start), 2),
             "end": round(min(beat["end"], word.end), 2)}
            for segment in segments for word in (segment.words or [])
            if word.start < beat["end"] and word.end > beat["start"]
        ]
        if not replacement:
            raise RuntimeError(f"No isolated reading for {job['id']} beat {index}")
        words = [word for word in words
                 if not beat["start"] <= (word["start"] + word["end"]) / 2 < beat["end"]]
        words = sorted(words + replacement, key=lambda word: word["start"])
    return words


def transcribe_job(model, job, generated_at, timing):
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
        vad_filter=True,
        initial_prompt=" ".join(timing["paragraphs"]),
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

    words = refine_readings(model, job, timing, words)
    duration = get_audio_duration(audio_path)
    full_text = " ".join(word["word"] for word in words)
    print(full_text, flush=True)
    print(
        f"OK {duration:.6f}s MP3, {info.duration:.1f}s Whisper, "
        f"{len(words)} words"
    )

    cue_map, missed = resolve_cues(words, job["cues"], timing["beats"])
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
        **{key: timing[key] for key in ("tempo", "voiceSpeed", "voiceId", "provider", "audioSha256", "beats", "holds", "paragraphs")},
    }
    return transcript, missed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--timing", type=Path, help="Generated narration timing; otherwise reuse matching transcript metadata")
    args = parser.parse_args()
    timing_data = json.loads((args.timing or TRANSCRIPT_PATH).read_text())
    timing_scenes = timing_data if isinstance(timing_data, list) else timing_data["scenes"]
    timing_by_id = {scene["id"]: scene for scene in timing_scenes}
    for job in JOBS:
        digest = hashlib.sha256((AUDIO_DIR / job["audioFile"]).read_bytes()).hexdigest()
        if timing_by_id[job["id"]]["audioSha256"] != digest:
            raise RuntimeError(f"Audio changed without timing metadata: {job['id']}")
    print("Modelling Assumptions -- Local Whisper Transcription")
    print("=" * 58)
    print(f"Model: {MODEL_SIZE} (faster-whisper, CPU)")
    print("Cost: $0.00 (local)\n")

    cue_count = sum(len(job["cues"]) for job in JOBS)
    if len(JOBS) != 6:
        raise RuntimeError("Expected six narration scenes")

    missing_audio = [
        job["audioFile"]
        for job in JOBS
        if not (AUDIO_DIR / job["audioFile"]).is_file()
    ]
    if missing_audio:
        raise FileNotFoundError(f"Missing narration audio: {', '.join(missing_audio)}")

    print("Loading model (first run downloads about 500 MB)...")
    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8", cpu_threads=4)
    print("Model loaded\n")

    generated_at = datetime.now().isoformat()
    scenes = []
    all_missed = []
    total_duration = 0.0

    for job in JOBS:
        transcript, missed = transcribe_job(model, job, generated_at, timing_by_id[job["id"]])
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
    print(f"All {cue_count} storyboard cues resolved")


if __name__ == "__main__":
    main()
