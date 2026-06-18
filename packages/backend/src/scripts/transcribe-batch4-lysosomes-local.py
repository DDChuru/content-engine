#!/usr/bin/env python3
"""
Batch transcribe 3 Lysosome TikToks with local faster-whisper + cue resolution.
Endocytosis, Phagocytosis, Autophagy.

Equivalent to transcribe-batch4-lysosomes.ts but uses local Whisper (FREE, no API key).
Output format is identical — same JSON structure, same cue resolution algorithm.
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path
from faster_whisper import WhisperModel

SCRIPT_DIR = Path(__file__).parent
AUDIO_DIR = SCRIPT_DIR / "../remotion/public/audio/biology"
TRANSCRIPT_DIR = SCRIPT_DIR / "../remotion/public/transcripts/biology"

# Use 'small' model — perfect accuracy for clear English narration, fast on CPU
MODEL_SIZE = "small"


# ═══════════════════════════════════════════════════════════════════════
# CUE KEYWORDS (identical to TypeScript version)
# ═══════════════════════════════════════════════════════════════════════

JOBS = [
    {
        "id": "endocytosis",
        "audioFile": "endocytosis-narration.mp3",
        "outputFile": "endocytosis.json",
        "cues": [
            {"id": "cells-eat", "searchTerms": ["eat"]},
            {"id": "endocytosis", "searchTerms": ["endocytosis"]},
            {"id": "wraps", "searchTerms": ["wraps"]},
            {"id": "folds-inward", "searchTerms": ["folds"]},
            {"id": "vesicle", "searchTerms": ["vesicle"]},
            {"id": "inside", "searchTerms": ["inside"]},
            {"id": "large-molecules", "searchTerms": ["large"]},
            {"id": "two-types", "searchTerms": ["two"]},
            {"id": "phagocytosis", "searchTerms": ["phagocytosis"]},
            {"id": "cell-eating", "searchTerms": ["eating"]},
            {"id": "pinocytosis", "searchTerms": ["pinocytosis"]},
            {"id": "cell-drinking", "searchTerms": ["drinking"]},
            {"id": "exocytosis", "searchTerms": ["exocytosis"]},
            {"id": "fuses", "searchTerms": ["fuses"]},
            {"id": "released-outside", "searchTerms": ["released"]},
            {"id": "secrete", "searchTerms": ["secrete"]},
            {"id": "hormones", "searchTerms": ["hormones"]},
            {"id": "lysosomes", "searchTerms": ["lysosomes"]},
            {"id": "endosome", "searchTerms": ["endosome"]},
            {"id": "lysosome-fuses", "searchTerms": ["lysosome"]},
            {"id": "hydrolytic", "searchTerms": ["hydrolytic"]},
            {"id": "digestion", "searchTerms": ["digestion"]},
            {"id": "exam-loves", "searchTerms": ["exam"]},
            {"id": "membrane-folds", "searchTerms": ["membrane"]},
            {"id": "enzymes-digest", "searchTerms": ["digest"]},
            {"id": "endo-in", "searchTerms": ["endocytosis"]},
            {"id": "exo-out", "searchTerms": ["exocytosis"]},
            {"id": "three-marks", "searchTerms": ["three"]},
        ],
    },
    {
        "id": "phagocytosis",
        "audioFile": "phagocytosis-narration.mp3",
        "outputFile": "phagocytosis.json",
        "cues": [
            {"id": "bacterium", "searchTerms": ["bacterium"]},
            {"id": "dead", "searchTerms": ["dead"]},
            {"id": "phagocytosis", "searchTerms": ["phagocytosis"]},
            {"id": "phago-eat", "searchTerms": ["phago"]},
            {"id": "phagocyte-eats", "searchTerms": ["eats"]},
            {"id": "step-1", "searchTerms": ["detection"]},
            {"id": "recognises", "searchTerms": ["recognises", "recognizes"]},
            {"id": "chemotaxis", "searchTerms": ["chemotaxis"]},
            {"id": "step-2", "searchTerms": ["attachment"]},
            {"id": "receptors", "searchTerms": ["receptors"]},
            {"id": "antigens", "searchTerms": ["antigens"]},
            {"id": "step-3", "searchTerms": ["engulfment"]},
            {"id": "pseudopods", "searchTerms": ["pseudopods"]},
            {"id": "phagosome", "searchTerms": ["phagosome"]},
            {"id": "step-4", "searchTerms": ["digestion"]},
            {"id": "phagolysosome", "searchTerms": ["phagolysosome"]},
            {"id": "hydrolytic", "searchTerms": ["hydrolytic"]},
            {"id": "step-5", "searchTerms": ["absorption"]},
            {"id": "cytoplasm", "searchTerms": ["cytoplasm"]},
            {"id": "expelled", "searchTerms": ["expelled"]},
            {"id": "exam-trick", "searchTerms": ["trick"]},
            {"id": "presents", "searchTerms": ["presents"]},
            {"id": "antigen-presenting", "searchTerms": ["antigen-presenting", "antigen"]},
            {"id": "adaptive", "searchTerms": ["adaptive"]},
            {"id": "b-cells", "searchTerms": ["cells"]},
            {"id": "five-steps", "searchTerms": ["five"]},
            {"id": "full-marks", "searchTerms": ["marks"]},
        ],
    },
    {
        "id": "autophagy",
        "audioFile": "autophagy-narration.mp3",
        "outputFile": "autophagy.json",
        "cues": [
            {"id": "eat-themselves", "searchTerms": ["themselves"]},
            {"id": "alive", "searchTerms": ["alive"]},
            {"id": "autophagy", "searchTerms": ["autophagy"]},
            {"id": "auto-self", "searchTerms": ["auto"]},
            {"id": "phagy-eating", "searchTerms": ["eating"]},
            {"id": "damaged", "searchTerms": ["damaged"]},
            {"id": "double-membrane", "searchTerms": ["double"]},
            {"id": "autophagosome", "searchTerms": ["autophagosome"]},
            {"id": "lysosome-fuses", "searchTerms": ["lysosome"]},
            {"id": "recycled", "searchTerms": ["recycled"]},
            {"id": "cellular-recycling", "searchTerms": ["recycling"]},
            {"id": "damaged-mitochondria", "searchTerms": ["mitochondria"]},
            {"id": "misfolded", "searchTerms": ["misfolded"]},
            {"id": "starvation", "searchTerms": ["starvation"]},
            {"id": "autolysis", "searchTerms": ["autolysis"]},
            {"id": "burst", "searchTerms": ["burst"]},
            {"id": "flood", "searchTerms": ["flood"]},
            {"id": "self-destructs", "searchTerms": ["self-destructs", "destructs"]},
            {"id": "tadpole", "searchTerms": ["tadpole", "tadpole's"]},
            {"id": "frog", "searchTerms": ["frog"]},
            {"id": "programmed", "searchTerms": ["programmed"]},
            {"id": "distinction", "searchTerms": ["distinction"]},
            {"id": "selective", "searchTerms": ["selective"]},
            {"id": "survives", "searchTerms": ["survives"]},
            {"id": "total-destruction", "searchTerms": ["total"]},
            {"id": "dies", "searchTerms": ["dies"]},
            {"id": "recycles", "searchTerms": ["recycles"]},
            {"id": "destroys", "searchTerms": ["destroys"]},
            {"id": "guaranteed", "searchTerms": ["guaranteed"]},
        ],
    },
]


# ═══════════════════════════════════════════════════════════════════════


def resolve_cues(words, cue_keywords):
    """Resolve cue keywords to word timestamps. Same algorithm as TypeScript version."""
    cue_map = {}
    used_indices = set()
    missed = []

    for cue in cue_keywords:
        resolved = False
        for term in cue["searchTerms"]:
            term_lower = term.lower()
            for i, w in enumerate(words):
                if i in used_indices:
                    continue
                word_clean = re.sub(r"[^a-z0-9'\-]", "", w["word"].lower())
                if word_clean == term_lower:
                    cue_map[cue["id"]] = round(w["start"], 2)
                    used_indices.add(i)
                    resolved = True
                    break
            if resolved:
                break
        if not resolved:
            missed.append(cue["id"])

    return cue_map, missed


def transcribe_job(model, job):
    """Transcribe a single audio file and resolve cues."""
    print(f"\n{'═' * 40} {job['id'].upper()} {'═' * 40}")

    audio_path = AUDIO_DIR / job["audioFile"]
    output_path = TRANSCRIPT_DIR / job["outputFile"]

    file_size = audio_path.stat().st_size
    print(f"Audio: {job['audioFile']} ({file_size // 1024} KB)")

    print("Transcribing with local Whisper...")
    segments, info = model.transcribe(
        str(audio_path),
        language="en",
        word_timestamps=True,
        beam_size=5,
    )

    # Collect all words with timestamps
    words = []
    full_text_parts = []
    for segment in segments:
        full_text_parts.append(segment.text.strip())
        if segment.words:
            for w in segment.words:
                words.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 2),
                    "end": round(w.end, 2),
                })

    duration = info.duration
    full_text = " ".join(full_text_parts)
    print(f"✅ {duration:.1f}s, {len(words)} words")

    # Resolve cues
    cue_map, missed = resolve_cues(words, job["cues"])
    print(f"Cues: {len(cue_map)}/{len(job['cues'])} resolved")
    if missed:
        print(f"⚠️  Missed: {', '.join(missed)}")

    # Print cue map
    for cue_id, time in cue_map.items():
        print(f"  {cue_id}: {time:.2f}s")

    # Save transcript (same format as TypeScript version)
    transcript_data = {
        "audio": job["audioFile"],
        "duration": round(duration, 1),
        "wordCount": len(words),
        "text": full_text,
        "words": words,
        "cues": cue_map,
        "generatedAt": datetime.now().isoformat(),
        "engine": "faster-whisper-small (local)",
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(transcript_data, f, indent=2)
    print(f"💾 Saved: {job['outputFile']}")

    # Print TypeScript cue map (copy-paste into composition)
    print(f"\nconst DEFAULT_CUES: Record<string, number> = {{")
    for cue_id, time in cue_map.items():
        print(f"  '{cue_id}': {time:.2f},")
    print("};")

    # Print word list for manual correction
    print(f"\nWord list ({len(words)} words):")
    for i, w in enumerate(words):
        print(f"  [{i}] {w['start']:.2f}s \"{w['word']}\"")

    return duration, cue_map, missed


def main():
    print("📐 Biology Batch 4 — Lysosome Transcription (LOCAL Whisper)")
    print("=" * 65)
    print(f"Model: {MODEL_SIZE} (faster-whisper, CPU)")
    print("Cost: $0.00 (local)\n")

    print("Loading model (first run downloads ~500MB)...")
    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
    print("Model loaded ✅\n")

    TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)

    for job in JOBS:
        transcribe_job(model, job)

    print("\n═══ ALL DONE ═══")


if __name__ == "__main__":
    main()
