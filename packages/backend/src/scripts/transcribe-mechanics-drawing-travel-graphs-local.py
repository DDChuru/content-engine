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
JOBS = [{'id': 's01',
  'audioFile': 'drawing-travel-graphs-s01.mp3',
  'cues': [{'id': 'journey', 'searchTerms': ['A travel graph']},
           {'id': 'positive', 'searchTerms': ['Choose positive']},
           {'id': 'key-times', 'searchTerms': ['key times']},
           {'id': 'axes-and-units', 'searchTerms': ['axes and units']}]},
 {'id': 's02',
  'audioFile': 'drawing-travel-graphs-s02.mp3',
  'cues': [{'id': 'steadily', 'searchTerms': ['steadily']},
           {'id': 'slows', 'searchTerms': ['slows']},
           {'id': 'waits', 'searchTerms': ['waits']},
           {'id': 'returns', 'searchTerms': ['returns']}]},
 {'id': 's03',
  'audioFile': 'drawing-travel-graphs-s03.mp3',
  'cues': [{'id': 'gradient', 'searchTerms': ['gradient']},
           {'id': 'same-instant', 'searchTerms': ['same instant']},
           {'id': 'signed-areas', 'searchTerms': ['signed areas']},
           {'id': 'bridge', 'searchTerms': ['bridge']}]},
 {'id': 's04',
  'audioFile': 'drawing-travel-graphs-s04.mp3',
  'isolatedBeats': [16],
  'cues': [{'id': 'setup', 'searchTerms': ['Consider a lift']},
           {'id': 'draw', 'searchTerms': ['get drawing']},
           {'id': 'speed', 'searchTerms': ['What speed']},
           {'id': 'formula-v', 'searchTerms': ['Velocity equals initial']},
           {'id': 'symbol-v', 'searchTerms': ['V equals u']},
           {'id': 'three', 'searchTerms': ['Three metres per second']},
           {'id': 'six', 'searchTerms': ['Six seconds']},
           {'id': 'eight', 'searchTerms': ['Eight seconds']},
           {'id': 'area-formula', 'searchTerms': ['Displacement equals area']},
           {'id': 'area-symbol', 'searchTerms': ['S equals half']},
           {'id': 'triangle', 'searchTerms': ['First triangle']},
           {'id': 'rectangle', 'searchTerms': ['The rectangle']},
           {'id': 'height', 'searchTerms': ['Accumulated height']},
           {'id': 'braking', 'searchTerms': ['Braking adds']},
           {'id': 'finish', 'searchTerms': ['Where does it finish']}]},
 {'id': 's05',
  'audioFile': 'drawing-travel-graphs-s05.mp3',
  'cues': [{'id': 'positive-velocity', 'searchTerms': ['positive velocity']},
           {'id': 'zero-velocity', 'searchTerms': ['zero velocity']},
           {'id': 'negative-velocity', 'searchTerms': ['negative velocity']},
           {'id': 'reaches-the-start', 'searchTerms': ['reaches the start']}]},
 {'id': 's06',
  'audioFile': 'drawing-travel-graphs-s06.mp3',
  'cues': [{'id': 'setup', 'searchTerms': ['Consider a ball']},
           {'id': 'draw', 'searchTerms': ['get drawing']},
           {'id': 'straight', 'searchTerms': ['Why a straight']},
           {'id': 'formula-v', 'searchTerms': ['Velocity equals initial']},
           {'id': 'symbol-v', 'searchTerms': ['V equals u']},
           {'id': 'substitute', 'searchTerms': ['V equals fifteen', 'V equals 15']},
           {'id': 'direction-change', 'searchTerms': ['Where does direction change']},
           {'id': 'area-formula', 'searchTerms': ['Displacement equals area']},
           {'id': 'area-symbol', 'searchTerms': ['S equals half']},
           {'id': 'height', 'searchTerms': ['Eleven point two five', '11.25', '11 .25']},
           {'id': 'catch', 'searchTerms': ['When back']},
           {'id': 'signed-areas', 'searchTerms': ['Equal signed areas']},
           {'id': 'down', 'searchTerms': ['What velocity then']},
           {'id': 'contrast', 'searchTerms': ['What if thrown faster']}],
  'isolatedBeats': [1, 2, 6, 12]},
 {'id': 's07',
  'audioFile': 'drawing-travel-graphs-s07.mp3',
  'cues': [{'id': 'sketch', 'searchTerms': ['sketch']},
           {'id': 'accurate-plot', 'searchTerms': ['accurate plot']},
           {'id': 'labelled-axes', 'searchTerms': ['labelled axes']},
           {'id': 'negative-region', 'searchTerms': ['negative region']}]},
 {'id': 's09',
  'audioFile': 'drawing-travel-graphs-s09.mp3',
  'cues': [{'id': 'setup', 'searchTerms': ['Consider a cyclist']},
           {'id': 'cruise-story', 'searchTerms': ['cruises away']},
           {'id': 'slow-story', 'searchTerms': ['slows to a stop']},
           {'id': 'rest-story', 'searchTerms': ['rests']},
           {'id': 'return-story', 'searchTerms': ['then returns']},
           {'id': 'displacement', 'searchTerms': ['Now the displacement']},
           {'id': 'formula', 'searchTerms': ['Gradient equals']},
           {'id': 'symbols', 'searchTerms': ['V equals delta']},
           {'id': 'leg1', 'searchTerms': ['Cruising what slope']},
           {'id': 'leg2', 'searchTerms': ['Slowing what changes', 'Slowing what change']},
           {'id': 'leg3', 'searchTerms': ['Resting what slope']},
           {'id': 'leg4', 'searchTerms': ['Returning what sign']},
           {'id': 'velocity', 'searchTerms': ['Now the velocity']},
           {'id': 'v1', 'searchTerms': ['Positive three horizontal']},
           {'id': 'v2', 'searchTerms': ['Straight down to zero']},
           {'id': 'v3', 'searchTerms': ['Zero along the axis']},
           {'id': 'v4', 'searchTerms': ['Minus three below zero']}]},
 {'id': 's08',
  'audioFile': 'drawing-travel-graphs-s08.mp3',
  'cues': [{'id': 'key-times', 'searchTerms': ['key times']},
           {'id': 'gradient', 'searchTerms': ['gradient']},
           {'id': 'signed-area', 'searchTerms': ['signed area']},
           {'id': 'shape-check', 'searchTerms': ['shape check']}]}]


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
    cache = Path('/tmp/verify-travel-v4-narration') / (job['id'] + '-transcribed.json')
    if cache.exists():
        cached = json.loads(cache.read_text())
        if cached['audioSha256'] == timing['audioSha256']:
            cached['cues'], missed = resolve_cues(cached['words'], job['cues'], timing['beats'])
            return cached, missed
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
    # Whisper can hallucinate a credit in the silent tail. Keep only speech windows.
    words = [w for w in words if any(w['start'] < beat['end'] and w['end'] > beat['start'] for beat in timing['beats'])]
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
    cache.write_text(json.dumps(transcript, indent=2)+'\n')
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
    if len(JOBS) != 9:
        raise RuntimeError("Expected nine narration scenes")

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
        timing = timing_by_id[job["id"]]
        if timing.get("reusedFrom") == "1dc49cb":
            transcript, missed = timing, []
        else:
            transcript, missed = transcribe_job(model, job, generated_at, timing)
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
