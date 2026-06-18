"""
Transcribe Stoichiometry Batch 2 (TikToks 4-8) with word-level timestamps.
Usage: python src/scripts/transcribe-stoichiometry-batch2.py
"""

import json
from pathlib import Path
from faster_whisper import WhisperModel

AUDIO_DIR = Path(__file__).parent.parent / "remotion" / "public" / "audio" / "stoichiometry"
TRANSCRIPT_DIR = Path(__file__).parent.parent / "remotion" / "public" / "transcripts" / "stoichiometry"

CUES = {
    "04-balancing": ["atoms", "water", "two", "hydrogen", "balanced", "method", "coefficients"],
    "05-reacting-masses": ["powerful", "co2", "equation", "moles", "ratio", "grams", "answer", "pattern"],
    "06-solutions": ["solution", "unit", "formula", "trap", "example", "forty", "answer"],
    "07-gas-volumes": ["any", "same", "formula", "example", "twelve", "six", "eleven", "connects"],
    "08-limiting": ["perfect", "sandwiches", "reaction", "given", "mg", "hcl", "limiting", "yield", "never"],
}

WORD_MAPPINGS = {
    "atoms": "atom", "water": "water", "two": "two", "hydrogen": "hydrogen",
    "balanced": "balanced", "method": "method", "coefficients": "coefficient",
    "powerful": "powerful", "co2": "carbon", "equation": "equation", "moles": "moles",
    "ratio": "ratio", "grams": "gram", "answer": "twelve",  # "Twelve grams of carbon makes..."
    "pattern": "pattern",
    "solution": "solution", "unit": "moles", "formula": "concentration",
    "trap": "trap", "example": "dissolve", "forty": "forty",
    "any": "any", "same": "same", "twelve": "twelve", "six": "six",
    "eleven": "eleven", "connects": "connect",
    "perfect": "perfect", "sandwiches": "sandwich", "reaction": "magnesium",
    "given": "two", "mg": "zero", "hcl": "concentration", "limiting": "limiting",
    "yield": "yield", "never": "never",
}

OCCURRENCE = {
    "two": 3,       # third "two" (put a 2 in front of water)
    "hydrogen": 2,  # second hydrogen (put 2 in front of hydrogen)
    "moles": 1,     # first "moles"
    "grams": 2,     # second "grams" (convert back to grams)
    "unit": 1,
    "formula": 1,
    "answer": 1,    # for solutions: last answer
    "given": 3,     # "two point four"
    "mg": 2,        # second zero (0.1 moles of Mg)
    "hcl": 2,       # second concentration
}


def resolve_cue(words, cue_key, occurrence=1):
    search = WORD_MAPPINGS.get(cue_key, cue_key).lower()
    count = 0
    for w in words:
        if search in w["word"].lower():
            count += 1
            if count == occurrence:
                return round(w["start"], 2)
    return None


def transcribe_file(audio_path, cue_keys):
    print(f"\n  Transcribing: {audio_path.name}")
    model = WhisperModel("small", device="cpu", compute_type="int8")
    segments, info = model.transcribe(str(audio_path), beam_size=5, word_timestamps=True, language="en")

    all_words = []
    full_text = ""
    for segment in segments:
        full_text += segment.text
        if segment.words:
            for w in segment.words:
                all_words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})

    print(f"   Duration: {info.duration:.1f}s | Words: {len(all_words)}")

    cues = {}
    for cue_key in cue_keys:
        occ = OCCURRENCE.get(cue_key, 1)
        timestamp = resolve_cue(all_words, cue_key, occ)
        if timestamp is not None:
            cues[cue_key] = round(max(0, timestamp - 0.1), 2)
            print(f"   Cue '{cue_key}' -> {cues[cue_key]}s")
        else:
            print(f"   Cue '{cue_key}' NOT FOUND")
            cues[cue_key] = 0

    return {"duration": round(info.duration, 2), "text": full_text.strip(), "words": all_words, "cues": cues}


def main():
    TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)

    files = [
        ("04-balancing-narration.mp3", "04-balancing"),
        ("05-reacting-masses-narration.mp3", "05-reacting-masses"),
        ("06-solutions-narration.mp3", "06-solutions"),
        ("07-gas-volumes-narration.mp3", "07-gas-volumes"),
        ("08-limiting-narration.mp3", "08-limiting"),
    ]

    for audio_filename, cue_group in files:
        audio_path = AUDIO_DIR / audio_filename
        if not audio_path.exists():
            print(f"Skipping {audio_filename} (not found)")
            continue
        result = transcribe_file(audio_path, CUES.get(cue_group, []))
        out_path = TRANSCRIPT_DIR / f"{cue_group}.json"
        out_path.write_text(json.dumps(result, indent=2))
        print(f"   Saved: {out_path.name}")

    print("\nAll Batch 2 transcriptions complete!")


if __name__ == "__main__":
    main()
