#!/usr/bin/env python3
"""Transcribe the Multiple Collisions explainer with local faster-whisper."""

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
    / "../remotion/public/transcripts/mechanics/multiple-collisions.json"
)

MODEL_SIZE = "small"
ENGINE = "faster-whisper-small (local)"


# Cue IDs are stable composition keys. The occurrence selector disambiguates
# repeated storyboard words without coupling resolution to generated timings.
JOBS = [
    {
        "id": "s01",
        "audioFile": "multiple-collisions-s01.mp3",
        "cues": [
            {
                "id": "syllabus",
                "searchTerms": [
                    "syllabus"
                ]
            },
            {
                "id": "quote1",
                "searchTerms": [
                    "use conservation"
                ]
            },
            {
                "id": "quote2",
                "searchTerms": [
                    "that may be modelled",
                    "that may be modeled"
                ]
            },
            {
                "id": "outcomes",
                "searchTerms": [
                    "by the end"
                ]
            },
            {
                "id": "diagram",
                "searchTerms": [
                    "draw a separate diagram"
                ]
            },
            {
                "id": "carry",
                "searchTerms": [
                    "carry each signed"
                ]
            },
            {
                "id": "decide",
                "searchTerms": [
                    "decide whether"
                ]
            }
        ]
    },
    {
        "id": "s02",
        "audioFile": "multiple-collisions-s02.mp3",
        "cues": [
            {
                "id": "multiple",
                "searchTerms": [
                    "a multiple collision",
                    "a multiple-collision"
                ]
            },
            {
                "id": "wall",
                "searchTerms": [
                    "a wall"
                ]
            },
            {
                "id": "third",
                "searchTerms": [
                    "a third particle"
                ]
            },
            {
                "id": "separate",
                "searchTerms": [
                    "deal with each collision"
                ]
            },
            {
                "id": "diagram",
                "searchTerms": [
                    "draw a fresh"
                ]
            },
            {
                "id": "unique",
                "searchTerms": [
                    "each new unknown"
                ]
            },
            {
                "id": "rebound",
                "searchTerms": [
                    "for a wall"
                ]
            }
        ]
    },
    {
        "id": "s03",
        "audioFile": "multiple-collisions-s03.mp3",
        "cues": [
            {
                "id": "setup",
                "searchTerms": [
                    "consider three spheres"
                ]
            },
            {
                "id": "order",
                "searchTerms": [
                    "a is behind b"
                ]
            },
            {
                "id": "first",
                "searchTerms": [
                    "a catches b"
                ]
            },
            {
                "id": "after-first",
                "searchTerms": [
                    "after that impact"
                ]
            },
            {
                "id": "second",
                "searchTerms": [
                    "catches c"
                ]
            },
            {
                "id": "after-second",
                "searchTerms": [
                    "c moves off"
                ]
            },
            {
                "id": "behind",
                "searchTerms": [
                    "a is still behind"
                ]
            },
            {
                "id": "question",
                "searchTerms": [
                    "our question"
                ]
            },
            {
                "id": "close",
                "searchTerms": [
                    "first picture"
                ]
            }
        ]
    },
    {
        "id": "s04",
        "audioFile": "multiple-collisions-s04.mp3",
        "cues": [
            {
                "id": "signpost",
                "searchTerms": [
                    "now collision one",
                    "now collision 1"
                ]
            },
            {
                "id": "setup",
                "searchTerms": [
                    "find b's velocity"
                ]
            },
            {
                "id": "right",
                "searchTerms": [
                    "right is positive"
                ]
            },
            {
                "id": "draw",
                "searchTerms": [
                    "drawing"
                ]
            },
            {
                "id": "mass-a",
                "searchTerms": [
                    "one kilogram",
                    "1 kilogram"
                ]
            },
            {
                "id": "speed-a",
                "searchTerms": [
                    "four metres per second",
                    "four meters per second"
                ]
            },
            {
                "id": "mass-b",
                "searchTerms": [
                    "two kilograms",
                    "2 kilograms"
                ]
            },
            {
                "id": "speed-b",
                "searchTerms": [
                    "three metres per second",
                    "three meters per second"
                ]
            },
            {
                "id": "after",
                "searchTerms": [
                    "afterwards"
                ]
            },
            {
                "id": "after-a",
                "searchTerms": [
                    "two metres per second",
                    "two meters per second"
                ]
            },
            {
                "id": "unknown",
                "searchTerms": [
                    "v b",
                    "vb"
                ]
            },
            {
                "id": "conserve",
                "searchTerms": [
                    "momentum is conserved"
                ]
            },
            {
                "id": "equation",
                "searchTerms": [
                    "before equals after"
                ]
            },
            {
                "id": "simplify",
                "searchTerms": [
                    "ten equals",
                    "10 equals"
                ]
            },
            {
                "id": "solve",
                "searchTerms": [
                    "subtract two",
                    "subtract 2"
                ]
            },
            {
                "id": "result",
                "searchTerms": [
                    "four metres per second",
                    "four meters per second",
                    "4 metres per second",
                    "4 meters per second"
                ],
                "occurrence": 2
            },
            {
                "id": "positive",
                "searchTerms": [
                    "positive means"
                ]
            },
            {
                "id": "carry",
                "searchTerms": [
                    "carry that four",
                    "carry that 4"
                ]
            }
        ]
    },
    {
        "id": "s05",
        "audioFile": "multiple-collisions-s05.mp3",
        "cues": [
            {
                "id": "rule",
                "searchTerms": [
                    "same direction"
                ]
            },
            {
                "id": "question",
                "searchTerms": [
                    "what if both move left"
                ]
            },
            {
                "id": "answer",
                "searchTerms": [
                    "yes"
                ]
            },
            {
                "id": "negative",
                "searchTerms": [
                    "faster left means more negative"
                ]
            },
            {
                "id": "signed",
                "searchTerms": [
                    "with a left of b"
                ]
            },
            {
                "id": "diagram",
                "searchTerms": [
                    "draw a separate diagram"
                ]
            },
            {
                "id": "carry",
                "searchTerms": [
                    "carry each signed"
                ]
            },
            {
                "id": "decide",
                "searchTerms": [
                    "decide whether"
                ]
            }
        ]
    },
    {
        "id": "s06",
        "audioFile": "multiple-collisions-s06.mp3",
        "cues": [
            {
                "id": "signpost",
                "searchTerms": [
                    "now collision two",
                    "now collision 2"
                ]
            },
            {
                "id": "setup",
                "searchTerms": [
                    "b hits c"
                ]
            },
            {
                "id": "draw",
                "searchTerms": [
                    "drawing"
                ]
            },
            {
                "id": "mass-b",
                "searchTerms": [
                    "two kilograms",
                    "2 kilograms"
                ]
            },
            {
                "id": "speed-b",
                "searchTerms": [
                    "four metres per second",
                    "four meters per second"
                ]
            },
            {
                "id": "mass-c",
                "searchTerms": [
                    "three kilograms",
                    "3 kilograms"
                ]
            },
            {
                "id": "speed-c",
                "searchTerms": [
                    "one metre per second",
                    "one metre per second"
                ]
            },
            {
                "id": "after",
                "searchTerms": [
                    "afterwards"
                ]
            },
            {
                "id": "after-c",
                "searchTerms": [
                    "three metres per second",
                    "three meters per second"
                ]
            },
            {
                "id": "unknown",
                "searchTerms": [
                    "w b",
                    "wb"
                ]
            },
            {
                "id": "conserve",
                "searchTerms": [
                    "conserve this pair's"
                ]
            },
            {
                "id": "equation",
                "searchTerms": [
                    "two times four",
                    "2 times 4"
                ]
            },
            {
                "id": "simplify",
                "searchTerms": [
                    "eleven equals",
                    "11 equals"
                ]
            },
            {
                "id": "solve",
                "searchTerms": [
                    "subtract nine",
                    "subtract 9"
                ]
            },
            {
                "id": "result",
                "searchTerms": [
                    "one metre per second",
                    "one meter per second",
                    "1 metre per second",
                    "1 meter per second"
                ],
                "occurrence": 2
            },
            {
                "id": "decision",
                "searchTerms": [
                    "now will they collide again"
                ]
            },
            {
                "id": "behind",
                "searchTerms": [
                    "a is behind b"
                ]
            },
            {
                "id": "speed-a",
                "searchTerms": [
                    "two metres per second",
                    "two meters per second",
                    "2 metres per second",
                    "2 meters per second"
                ]
            },
            {
                "id": "last-b",
                "searchTerms": [
                    "b at one",
                    "b at 1"
                ]
            },
            {
                "id": "compare",
                "searchTerms": [
                    "two is greater than one",
                    "2 is greater than 1"
                ]
            },
            {
                "id": "closing",
                "searchTerms": [
                    "the one behind is faster"
                ]
            },
            {
                "id": "catch",
                "searchTerms": [
                    "yes a catches b again"
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
                 if not (word["end"] > beat["start"] and word["start"] < beat["end"])]
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
    print("Multiple Collisions -- Local Whisper Transcription")
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
        "project": "mechanics-multiple-collisions",
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
