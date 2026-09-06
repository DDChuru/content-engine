#!/usr/bin/env python3
"""Transcribe the Drawing Travel Graphs explainer with local faster-whisper."""

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
    / "../remotion/public/transcripts/mechanics/drawing-travel-graphs.json"
)

MODEL_SIZE = "small"
ENGINE = "faster-whisper-small (local)"


# Cue IDs are stable composition keys. The occurrence selector disambiguates
# repeated storyboard words without coupling resolution to generated timings.
JOBS = [
    {
        "id": "s01",
        "audioFile": "drawing-travel-graphs-s01.mp3",
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
                    "sketch and interpret"
                ]
            },
            {
                "id": "outcomes",
                "searchTerms": [
                    "by the end"
                ]
            },
            {
                "id": "shapes",
                "searchTerms": [
                    "turn journey"
                ]
            },
            {
                "id": "area",
                "searchTerms": [
                    "use signed area"
                ]
            },
            {
                "id": "gradients",
                "searchTerms": [
                    "explain a journey"
                ]
            }
        ]
    },
    {
        "id": "s08",
        "audioFile": "drawing-travel-graphs-s08.mp3",
        "cues": [
            {
                "id": "setup",
                "searchTerms": [
                    "consider a cyclist"
                ]
            },
            {
                "id": "cruise",
                "searchTerms": [
                    "already moving"
                ]
            },
            {
                "id": "six",
                "searchTerms": [
                    "six metres per second",
                    "6 metres per second",
                    "six meters per second",
                    "6 meters per second"
                ]
            },
            {
                "id": "ten",
                "searchTerms": [
                    "first ten seconds",
                    "first 10 seconds"
                ]
            },
            {
                "id": "slowing",
                "searchTerms": [
                    "gradually slows"
                ]
            },
            {
                "id": "stop",
                "searchTerms": [
                    "a stop"
                ]
            },
            {
                "id": "rest",
                "searchTerms": [
                    "he rests"
                ]
            },
            {
                "id": "turn",
                "searchTerms": [
                    "now he turns"
                ]
            },
            {"id": "pedal", "searchTerms": ["pedals back"]},
            {
                "id": "accelerate",
                "searchTerms": [
                    "speeds up"
                ]
            },
            {
                "id": "four",
                "searchTerms": [
                    "four metres per second",
                    "4 metres per second",
                    "four meters per second",
                    "4 meters per second"
                ]
            },
            {
                "id": "return",
                "searchTerms": [
                    "he keeps"
                ]
            },
            {
                "id": "home",
                "searchTerms": [
                    "home at a"
                ]
            },
            {
                "id": "close",
                "searchTerms": [
                    "picture the ride"
                ]
            }
        ]
    },
    {
        "id": "s02",
        "audioFile": "drawing-travel-graphs-s02.mp3",
        "cues": [
            {
                "id": "velocity",
                "searchTerms": [
                    "now the velocity time graph"
                ]
            },
            {
                "id": "slope",
                "searchTerms": [
                    "gradient gives acceleration"
                ]
            },
            {
                "id": "area",
                "searchTerms": [
                    "area gives displacement"
                ]
            },
            {
                "id": "negative",
                "searchTerms": [
                    "below the axis"
                ]
            },
            {
                "id": "displacement-signpost",
                "searchTerms": [
                    "now the displacement time graph"
                ]
            },
            {
                "id": "displacement",
                "searchTerms": [
                    "gradient gives velocity"
                ]
            },
            {
                "id": "return",
                "searchTerms": [
                    "a falling line"
                ]
            }
        ]
    },
    {
        "id": "s03",
        "audioFile": "drawing-travel-graphs-s03.mp3",
        "cues": [
            {
                "id": "signpost",
                "searchTerms": [
                    "now the velocity time graph"
                ]
            },
            {
                "id": "setup",
                "searchTerms": [
                    "for our cyclist"
                ]
            },
            {
                "id": "draw",
                "searchTerms": [
                    "drawing"
                ]
            },
            {
                "id": "constant",
                "searchTerms": [
                    "six metres per second",
                    "six meters per second",
                    "6 metres per second",
                    "6 meters per second"
                ]
            },
            {
                "id": "ten",
                "searchTerms": [
                    "ten seconds",
                    "10 seconds"
                ]
            },
            {
                "id": "slowing",
                "searchTerms": [
                    "slowing uniformly"
                ]
            },
            {
                "id": "twelve",
                "searchTerms": [
                    "twelve seconds",
                    "12 seconds"
                ]
            },
            {
                "id": "twentytwo",
                "searchTerms": [
                    "twenty-two",
                    "twenty two",
                    "22"
                ]
            },
            {
                "id": "rest",
                "searchTerms": [
                    "resting five",
                    "resting 5"
                ]
            },
            {
                "id": "twentyseven",
                "searchTerms": [
                    "twenty-seven",
                    "twenty seven",
                    "27"
                ]
            },
            {
                "id": "reverse",
                "searchTerms": [
                    "accelerating backwards"
                ]
            },
            {
                "id": "four",
                "searchTerms": [
                    "four seconds",
                    "4 seconds"
                ]
            },
            {
                "id": "minusfour",
                "searchTerms": [
                    "minus four",
                    "minus 4"
                ]
            },
            {
                "id": "thirtyone",
                "searchTerms": [
                    "thirty-one",
                    "thirty one",
                    "31"
                ]
            },
            {
                "id": "return",
                "searchTerms": [
                    "keep minus four",
                    "keep minus 4"
                ]
            },
            {
                "id": "finish",
                "searchTerms": [
                    "at t"
                ]
            }
        ]
    },
    {
        "id": "s04",
        "audioFile": "drawing-travel-graphs-s04.mp3",
        "cues": [
            {
                "id": "setup",
                "searchTerms": [
                    "for the same cyclist"
                ]
            },
            {
                "id": "draw",
                "searchTerms": [
                    "drawing"
                ]
            },
            {
                "id": "rectangle",
                "searchTerms": [
                    "the rectangle"
                ]
            },
            {
                "id": "sixty",
                "searchTerms": [
                    "sixty metres",
                    "sixty meters",
                    "60 metres",
                    "60 meters"
                ]
            },
            {
                "id": "triangle",
                "searchTerms": [
                    "the triangle"
                ]
            },
            {
                "id": "thirtysix",
                "searchTerms": [
                    "thirty-six metres",
                    "thirty six metres",
                    "36 metres",
                    "36 meters"
                ]
            },
            {
                "id": "total",
                "searchTerms": [
                    "together"
                ]
            },
            {
                "id": "ninetysix",
                "searchTerms": [
                    "ninety-six",
                    "ninety six",
                    "96"
                ]
            },
            {
                "id": "reverse",
                "searchTerms": [
                    "the reverse triangle"
                ]
            },
            {
                "id": "eight",
                "searchTerms": [
                    "eight metres",
                    "eight meters",
                    "8 metres",
                    "8 meters"
                ]
            },
            {
                "id": "remaining",
                "searchTerms": [
                    "that leaves"
                ]
            },
            {
                "id": "eightyeight",
                "searchTerms": [
                    "eighty-eight",
                    "eighty eight",
                    "88"
                ]
            },
            {
                "id": "duration",
                "searchTerms": [
                    "at four metres",
                    "at four meters",
                    "at 4 metres",
                    "at 4 meters"
                ]
            },
            {
                "id": "twentytwo",
                "searchTerms": [
                    "twenty-two more",
                    "twenty two more",
                    "22 more"
                ]
            },
            {
                "id": "total-time",
                "searchTerms": [
                    "add the first"
                ]
            },
            {
                "id": "fiftythree",
                "searchTerms": [
                    "fifty-three seconds",
                    "fifty three seconds",
                    "53 seconds"
                ]
            }
        ]
    },
    {
        "id": "s05",
        "audioFile": "drawing-travel-graphs-s05.mp3",
        "cues": [
            {
                "id": "signpost",
                "searchTerms": [
                    "now the displacement time graph"
                ]
            },
            {
                "id": "pair",
                "searchTerms": [
                    "one journey both graphs"
                ]
            },
            {
                "id": "straight",
                "searchTerms": [
                    "constant velocity"
                ]
            },
            {
                "id": "rest",
                "searchTerms": [
                    "rest is horizontal"
                ]
            },
            {
                "id": "curve",
                "searchTerms": [
                    "changing velocity gives"
                ]
            },
            {
                "id": "chord",
                "searchTerms": [
                    "a straight join"
                ]
            }
        ]
    },
    {
        "id": "s06",
        "audioFile": "drawing-travel-graphs-s06.mp3",
        "cues": [
            {
                "id": "question",
                "searchTerms": [
                    "if velocity"
                ]
            },
            {
                "id": "answer",
                "searchTerms": [
                    "no"
                ]
            },
            {
                "id": "shapes",
                "searchTerms": [
                    "turn journey"
                ]
            },
            {
                "id": "tick-shapes",
                "searchTerms": [
                    "graph shapes"
                ]
            },
            {
                "id": "area",
                "searchTerms": [
                    "use signed area"
                ]
            },
            {
                "id": "tick-area",
                "searchTerms": [
                    "find displacement"
                ]
            },
            {
                "id": "gradients",
                "searchTerms": [
                    "explain a journey"
                ]
            },
            {
                "id": "tick-gradients",
                "searchTerms": [
                    "displacement time gradients",
                    "displacement-time gradients"
                ]
            }
        ]
    },
    {
        "id": "s07",
        "audioFile": "drawing-travel-graphs-s07.mp3",
        "cues": [
            {
                "id": "signpost",
                "searchTerms": [
                    "now the displacement time graph"
                ]
            },
            {
                "id": "setup",
                "searchTerms": [
                    "for our cyclist"
                ]
            },
            {
                "id": "draw",
                "searchTerms": [
                    "drawing"
                ]
            },
            {
                "id": "leg1",
                "searchTerms": [
                    "first leg"
                ]
            },
            {
                "id": "ds1",
                "searchTerms": [
                    "sixty metres",
                    "sixty meters",
                    "60 metres",
                    "60 meters"
                ]
            },
            {
                "id": "dt1",
                "searchTerms": [
                    "ten seconds",
                    "10 seconds"
                ]
            },
            {
                "id": "v1",
                "searchTerms": [
                    "six metres per second",
                    "six meters per second",
                    "6 metres per second",
                    "6 meters per second"
                ]
            },
            {
                "id": "meaning1",
                "searchTerms": [
                    "positive and steady"
                ]
            },
            {
                "id": "leg2",
                "searchTerms": [
                    "slowing"
                ]
            },
            {
                "id": "ds2",
                "searchTerms": [
                    "thirty-six",
                    "thirty six",
                    "36"
                ]
            },
            {
                "id": "dt2",
                "searchTerms": [
                    "twelve",
                    "12"
                ]
            },
            {
                "id": "v2",
                "searchTerms": [
                    "average velocity three",
                    "average velocity 3"
                ]
            },
            {
                "id": "tangent2",
                "searchTerms": [
                    "the tangent falls"
                ]
            },
            {
                "id": "leg3",
                "searchTerms": [
                    "stopped"
                ]
            },
            {
                "id": "ds3",
                "searchTerms": [
                    "zero change",
                    "0 change"
                ]
            },
            {
                "id": "dt3",
                "searchTerms": [
                    "five seconds",
                    "5 seconds"
                ]
            },
            {
                "id": "v3",
                "searchTerms": [
                    "zero velocity",
                    "0 velocity"
                ]
            },
            {
                "id": "leg4",
                "searchTerms": [
                    "accelerating backwards"
                ]
            },
            {
                "id": "ds4",
                "searchTerms": [
                    "minus eight",
                    "minus 8"
                ]
            },
            {
                "id": "dt4",
                "searchTerms": [
                    "in four",
                    "in 4"
                ]
            },
            {
                "id": "v4",
                "searchTerms": [
                    "average minus two",
                    "average minus 2"
                ]
            },
            {
                "id": "tangent4",
                "searchTerms": [
                    "the tangent falls"
                ],
                "occurrence": 2
            },
            {
                "id": "leg5",
                "searchTerms": [
                    "final leg"
                ]
            },
            {
                "id": "ds5",
                "searchTerms": [
                    "minus eighty-eight",
                    "minus eighty eight",
                    "minus 88"
                ]
            },
            {
                "id": "dt5",
                "searchTerms": [
                    "twenty-two",
                    "twenty two",
                    "22"
                ]
            },
            {
                "id": "v5",
                "searchTerms": [
                    "minus four constant",
                    "minus 4 constant"
                ]
            },
            {
                "id": "complete",
                "searchTerms": [
                    "fifty-three seconds",
                    "fifty three seconds",
                    "53 seconds"
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
    print("Drawing Travel Graphs -- Local Whisper Transcription")
    print("=" * 58)
    print(f"Model: {MODEL_SIZE} (faster-whisper, CPU)")
    print("Cost: $0.00 (local)\n")

    cue_count = sum(len(job["cues"]) for job in JOBS)
    if len(JOBS) != 8:
        raise RuntimeError("Expected eight narration scenes")

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
    print(f"All {cue_count} storyboard cues resolved")


if __name__ == "__main__":
    main()
