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
                "id": "smooth",
                "searchTerms": [
                    "use the model"
                ]
            },
            {
                "id": "connected",
                "searchTerms": [
                    "solve simple"
                ]
            },
            {
                "id": "continuation",
                "searchTerms": [
                    "as the motion"
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
                "id": "find",
                "searchTerms": [
                    "find"
                ]
            },
            {
                "id": "predict",
                "searchTerms": [
                    "predict"
                ]
            }
        ]
    },
    {
        "id": "s02",
        "audioFile": "modelling-assumptions-s02.mp3",
        "cues": [
            {
                "id": "hanging",
                "searchTerms": [
                    "hanging box"
                ]
            },
            {
                "id": "box",
                "searchTerms": [
                    "this box"
                ]
            },
            {
                "id": "table",
                "searchTerms": [
                    "table"
                ]
            },
            {
                "id": "string",
                "searchTerms": [
                    "string"
                ]
            },
            {
                "id": "pulley",
                "searchTerms": [
                    "pulley"
                ]
            },
            {
                "id": "particle",
                "searchTerms": [
                    "particle"
                ]
            },
            {
                "id": "mass",
                "searchTerms": [
                    "mass"
                ]
            },
            {
                "id": "size",
                "searchTerms": [
                    "ignores size"
                ]
            },
            {
                "id": "tips",
                "searchTerms": [
                    "tips"
                ]
            },
            {
                "id": "air",
                "searchTerms": [
                    "air resistance neglected"
                ]
            },
            {
                "id": "include",
                "searchTerms": [
                    "include air"
                ]
            },
            {
                "id": "drag",
                "searchTerms": [
                    "drag changes"
                ]
            }
        ]
    },
    {
        "id": "s03",
        "audioFile": "modelling-assumptions-s03.mp3",
        "cues": [
            {
                "id": "light",
                "searchTerms": [
                    "light means"
                ]
            },
            {
                "id": "string",
                "searchTerms": [
                    "light string"
                ]
            },
            {
                "id": "heavy",
                "searchTerms": [
                    "heavy string"
                ]
            },
            {
                "id": "pulley",
                "searchTerms": [
                    "light pulley"
                ]
            },
            {
                "id": "massive",
                "searchTerms": [
                    "massive pulley"
                ]
            },
            {
                "id": "spin",
                "searchTerms": [
                    "resists spin"
                ]
            },
            {
                "id": "smooth",
                "searchTerms": [
                    "smooth pulley"
                ]
            },
            {
                "id": "friction",
                "searchTerms": [
                    "no friction"
                ]
            },
            {
                "id": "equal",
                "searchTerms": [
                    "equal tensions"
                ]
            },
            {
                "id": "second-tension",
                "searchTerms": [
                    "tensions"
                ]
            },
            {
                "id": "rough",
                "searchTerms": [
                    "rough pulley"
                ]
            },
            {
                "id": "unequal",
                "searchTerms": [
                    "unequal"
                ]
            }
        ]
    },
    {
        "id": "s04",
        "audioFile": "modelling-assumptions-s04.mp3",
        "cues": [
            {
                "id": "inextensible",
                "searchTerms": [
                    "inextensible"
                ]
            },
            {
                "id": "taut",
                "searchTerms": [
                    "taut"
                ]
            },
            {
                "id": "gained",
                "searchTerms": [
                    "gained"
                ]
            },
            {
                "id": "lost",
                "searchTerms": [
                    "lost"
                ]
            },
            {
                "id": "speed",
                "searchTerms": [
                    "equal speed"
                ]
            },
            {
                "id": "acceleration",
                "searchTerms": [
                    "acceleration"
                ]
            },
            {
                "id": "directions",
                "searchTerms": [
                    "different directions"
                ]
            },
            {
                "id": "extensible",
                "searchTerms": [
                    "an extensible"
                ]
            },
            {
                "id": "stretch",
                "searchTerms": [
                    "stretches"
                ]
            },
            {
                "id": "slack",
                "searchTerms": [
                    "slack"
                ]
            },
            {
                "id": "no-tension",
                "searchTerms": [
                    "neither tension"
                ]
            },
            {
                "id": "unlinked",
                "searchTerms": [
                    "nor linked"
                ]
            }
        ]
    },
    {
        "id": "s05",
        "audioFile": "modelling-assumptions-s05.mp3",
        "cues": [
            {
                "id": "other",
                "searchTerms": [
                    "other words"
                ]
            },
            {
                "id": "rod",
                "searchTerms": [
                    "rigid rod"
                ]
            },
            {
                "id": "push",
                "searchTerms": [
                    "push"
                ]
            },
            {
                "id": "pull",
                "searchTerms": [
                    "pull"
                ]
            },
            {
                "id": "flexible",
                "searchTerms": [
                    "flexible"
                ]
            },
            {
                "id": "bends",
                "searchTerms": [
                    "bends"
                ]
            },
            {
                "id": "light-rod",
                "searchTerms": [
                    "light rod"
                ]
            },
            {
                "id": "heavy-rod",
                "searchTerms": [
                    "heavy one"
                ]
            },
            {
                "id": "weight",
                "searchTerms": [
                    "adds weight"
                ]
            },
            {
                "id": "beam",
                "searchTerms": [
                    "beam"
                ]
            },
            {
                "id": "positions",
                "searchTerms": [
                    "force positions"
                ]
            },
            {
                "id": "turning",
                "searchTerms": [
                    "affect turning"
                ]
            },
            {
                "id": "uniform",
                "searchTerms": [
                    "uniform means"
                ]
            },
            {
                "id": "midpoint",
                "searchTerms": [
                    "midpoint"
                ]
            },
            {
                "id": "uneven-rod",
                "searchTerms": [
                    "uneven mass"
                ]
            },
            {
                "id": "shift-rod",
                "searchTerms": [
                    "shifts that"
                ]
            },
            {
                "id": "lamina",
                "searchTerms": [
                    "a lamina"
                ]
            },
            {
                "id": "thickness",
                "searchTerms": [
                    "ignore thickness"
                ]
            },
            {
                "id": "plate",
                "searchTerms": [
                    "thick plate"
                ]
            },
            {
                "id": "uniform-lamina",
                "searchTerms": [
                    "uniform lamina"
                ]
            },
            {
                "id": "centroid",
                "searchTerms": [
                    "centroid"
                ]
            },
            {
                "id": "uneven-lamina",
                "searchTerms": [
                    "uneven mass"
                ],
                "occurrence": 2
            },
            {
                "id": "shift-lamina",
                "searchTerms": [
                    "shifts it"
                ]
            },
            {
                "id": "bead",
                "searchTerms": [
                    "bead"
                ]
            },
            {
                "id": "wire",
                "searchTerms": [
                    "a wire's", "a wires"
                ]
            },
            {
                "id": "detached",
                "searchTerms": [
                    "detached"
                ]
            },
            {
                "id": "thin-wire",
                "searchTerms": [
                    "the wire"
                ]
            },
            {
                "id": "guide",
                "searchTerms": [
                    "thick guide"
                ]
            },
            {
                "id": "normal",
                "searchTerms": [
                    "perpendicular"
                ]
            },
            {
                "id": "wire-friction",
                "searchTerms": [
                    "adds friction"
                ]
            },
            {
                "id": "peg",
                "searchTerms": [
                    "fixed peg"
                ]
            },
            {
                "id": "moving",
                "searchTerms": [
                    "moving it"
                ]
            },
            {
                "id": "smooth-peg",
                "searchTerms": [
                    "smooth peg"
                ]
            },
            {
                "id": "peg-tension",
                "searchTerms": [
                    "preserves tension"
                ]
            },
            {
                "id": "rough-peg",
                "searchTerms": [
                    "rough peg"
                ]
            },
            {
                "id": "peg-unequal",
                "searchTerms": [
                    "may not"
                ]
            }
        ]
    },
    {
        "id": "s06",
        "audioFile": "modelling-assumptions-s06.mp3",
        "cues": [
            {
                "id": "find",
                "searchTerms": [
                    "find"
                ]
            },
            {
                "id": "mass-three",
                "searchTerms": [
                    "three kilograms",
                    "3 kilograms"
                ]
            },
            {
                "id": "mass-two",
                "searchTerms": [
                    "two kilograms",
                    "2 kilograms"
                ]
            },
            {
                "id": "gravity",
                "searchTerms": [
                    "use g",
                    "use G"
                ]
            },
            {
                "id": "ten",
                "searchTerms": [
                    "ten metres",
                    "10 metres",
                    "10 meters",
                    "ten meters"
                ]
            },
            {
                "id": "forces",
                "searchTerms": [
                    "the forces"
                ]
            },
            {
                "id": "box-weight",
                "searchTerms": [
                    "box weight"
                ]
            },
            {
                "id": "reaction",
                "searchTerms": [
                    "reaction"
                ]
            },
            {
                "id": "box-tension",
                "searchTerms": [
                    "tension right"
                ]
            },
            {
                "id": "hanging-weight",
                "searchTerms": [
                    "hanging weight"
                ]
            },
            {
                "id": "hanging-tension",
                "searchTerms": [
                    "tension up"
                ]
            },
            {
                "id": "balance",
                "searchTerms": [
                    "vertical forces", "vertical force", "vertical"
                ]
            },
            {
                "id": "equations",
                "searchTerms": [
                    "why these equations", "equations", "equation"
                ]
            },
            {
                "id": "newton",
                "searchTerms": [
                    "resultant force"
                ]
            },
            {
                "id": "table-equation",
                "searchTerms": [
                    "tension alone"
                ]
            },
            {
                "id": "hanging-equation",
                "searchTerms": [
                    "for the hanging box"
                ]
            },
            {
                "id": "add",
                "searchTerms": [
                    "add"
                ]
            },
            {
                "id": "five",
                "searchTerms": [
                    "five kilograms",
                    "5 kilograms"
                ]
            },
            {
                "id": "acceleration",
                "searchTerms": [
                    "what acceleration"
                ]
            },
            {
                "id": "four",
                "searchTerms": [
                    "four metres",
                    "four meters",
                    "4 metres",
                    "4 meters"
                ]
            },
            {
                "id": "tension",
                "searchTerms": [
                    "and tension"
                ],
                "occurrence": 2
            },
            {
                "id": "substitute",
                "searchTerms": [
                    "substitute"
                ]
            },
            {
                "id": "twelve",
                "searchTerms": [
                    "twelve newtons",
                    "12 newtons"
                ]
            }
        ]
    },
    {
        "id": "s07",
        "audioFile": "modelling-assumptions-s07.mp3",
        "cues": [
            {
                "id": "plane",
                "searchTerms": [
                    "plane"
                ]
            },
            {
                "id": "curved",
                "searchTerms": [
                    "curved"
                ]
            },
            {
                "id": "bending",
                "searchTerms": [
                    "bending"
                ]
            },
            {
                "id": "smooth",
                "searchTerms": [
                    "smooth means"
                ]
            },
            {
                "id": "normal",
                "searchTerms": [
                    "perpendicular"
                ]
            },
            {
                "id": "change",
                "searchTerms": [
                    "what changes"
                ]
            },
            {
                "id": "rough",
                "searchTerms": [
                    "rough allows"
                ]
            },
            {
                "id": "friction",
                "searchTerms": [
                    "allows friction"
                ]
            },
            {
                "id": "slide",
                "searchTerms": [
                    "slides right"
                ]
            },
            {
                "id": "table-equation",
                "searchTerms": [
                    "tension minus"
                ]
            },
            {
                "id": "hanging-equation",
                "searchTerms": [
                    "unchanged hanging"
                ]
            },
            {
                "id": "system-equation",
                "searchTerms": [
                    "two g minus",
                    "2 g minus"
                ]
            },
            {
                "id": "less",
                "searchTerms": [
                    "less driving"
                ]
            },
            {
                "id": "question",
                "searchTerms": [
                    "question"
                ]
            },
            {
                "id": "answer",
                "searchTerms": [
                    "no below",
                    "no"
                ]
            },
            {
                "id": "static",
                "searchTerms": [
                    "below the limit"
                ]
            },
            {
                "id": "equality",
                "searchTerms": [
                    "equality"
                ]
            },
            {
                "id": "limiting",
                "searchTerms": [
                    "limiting friction"
                ]
            },
            {
                "id": "check",
                "searchTerms": [
                    "choose"
                ]
            }
        ]
    },
    {
        "id": "s08",
        "audioFile": "modelling-assumptions-s08.mp3",
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
                "id": "find",
                "searchTerms": [
                    "find"
                ]
            },
            {
                "id": "tick-find",
                "searchTerms": [
                    "tension"
                ]
            },
            {
                "id": "predict",
                "searchTerms": [
                    "predict"
                ]
            },
            {
                "id": "tick-predict",
                "searchTerms": [
                    "fail"
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

    duration = get_audio_duration(audio_path)
    full_text = " ".join(full_text_parts)
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
