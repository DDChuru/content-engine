"""
Transcribe Stoichiometry TikTok narrations with word-level timestamps.
Uses local faster-whisper (FREE) instead of OpenAI Whisper API.

Usage: python src/scripts/transcribe-stoichiometry-local.py
Requires: conda activate aitools
"""

import json
import os
from pathlib import Path
from faster_whisper import WhisperModel

AUDIO_DIR = Path(__file__).parent.parent / "remotion" / "public" / "audio" / "stoichiometry"
TRANSCRIPT_DIR = Path(__file__).parent.parent / "remotion" / "public" / "transcripts" / "stoichiometry"

# Cue keywords to resolve timestamps for (from scripts.md)
CUES = {
    "01-mole": ["mole", "six", "rice", "twelve", "mass", "eighteen", "weigh"],
    "02-molar-mass": ["cheat", "twelve", "add", "eighteen", "fortyfour", "ninetyeight", "memorise", "stoichiometry"],
    "03-triangle": ["one", "triangle", "mass-over", "question", "twentyfour", "answer", "eleven", "pointtwofive", "any"],
}

# Word mappings: cue keyword -> actual spoken word(s) to search for
WORD_MAPPINGS = {
    "mole": "mole",
    "six": "six",
    "rice": "rice",
    "twelve": "twelve",
    "mass": "mass",
    "eighteen": "eighteen",
    "weigh": "weigh",
    "cheat": "cheat",
    "add": "add",
    "fortyfour": "forty",
    "ninetyeight": "ninety",
    "memorise": "memori",  # partial match for memorise/memorize
    "stoichiometry": "stoichio",
    "one": "one",
    "triangle": "triangle",
    "mass-over": "mass",
    "question": "question",
    "twentyfour": "twenty",
    "answer": "one",  # "That's one mole"
    "eleven": "eleven",
    "pointtwofive": "zero",
    "any": "any",
}

# Which occurrence of the word to use (1-indexed)
OCCURRENCE = {
    "twelve": 1,  # first "twelve"
    "mass": 2,    # second "mass" (the pattern one)
    "eighteen": 2,  # second eighteen (water example)
    "one": 1,
    "mass-over": 3,  # third "mass" in triangle script
    "twentyfour": 2,  # second twenty-four (the answer)
    "answer": 4,    # fourth "one" occurrence
}


def resolve_cue(words, cue_key, occurrence=1):
    """Find the Nth occurrence of a word matching the cue."""
    search = WORD_MAPPINGS.get(cue_key, cue_key).lower()
    count = 0
    for w in words:
        if search in w["word"].lower():
            count += 1
            if count == occurrence:
                return round(w["start"], 2)
    return None


def transcribe_file(audio_path, cue_keys):
    """Transcribe a single audio file and resolve cues."""
    print(f"\n📝 Transcribing: {audio_path.name}")

    model = WhisperModel("small", device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        str(audio_path),
        beam_size=5,
        word_timestamps=True,
        language="en"
    )

    # Collect all words with timestamps
    all_words = []
    full_text = ""
    for segment in segments:
        full_text += segment.text
        if segment.words:
            for w in segment.words:
                all_words.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3)
                })

    print(f"   Duration: {info.duration:.1f}s")
    print(f"   Words: {len(all_words)}")

    # Resolve cues
    cues = {}
    for cue_key in cue_keys:
        occ = OCCURRENCE.get(cue_key, 1)
        timestamp = resolve_cue(all_words, cue_key, occ)
        if timestamp is not None:
            # Place cue 0.1s before the word for visual lead-in
            cues[cue_key] = round(max(0, timestamp - 0.1), 2)
            print(f"   ✅ Cue '{cue_key}' → {cues[cue_key]}s")
        else:
            print(f"   ⚠️  Cue '{cue_key}' NOT FOUND")
            cues[cue_key] = 0

    return {
        "duration": round(info.duration, 2),
        "text": full_text.strip(),
        "words": all_words,
        "cues": cues
    }


def main():
    TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)

    files = [
        ("01-mole-narration.mp3", "01-mole"),
        ("02-molar-mass-narration.mp3", "02-molar-mass"),
        ("03-triangle-narration.mp3", "03-triangle"),
    ]

    for audio_filename, cue_group in files:
        audio_path = AUDIO_DIR / audio_filename
        if not audio_path.exists():
            print(f"⏭️  Skipping {audio_filename} (not found)")
            continue

        cue_keys = CUES.get(cue_group, [])
        result = transcribe_file(audio_path, cue_keys)

        # Save transcript JSON
        out_path = TRANSCRIPT_DIR / f"{cue_group}.json"
        with open(out_path, "w") as f:
            json.dump(result, f, indent=2)
        print(f"   💾 Saved: {out_path.name}")

    print("\n✅ All transcriptions complete!")


if __name__ == "__main__":
    main()
