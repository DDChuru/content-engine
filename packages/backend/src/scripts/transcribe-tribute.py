"""Transcribe birthday tribute audio sources for captions.

Uses faster-whisper (CPU int8, small model) for word-level timestamps.
Outputs JSON in @remotion/captions Caption[] format per section.

Run inside `aitools` conda env:
    conda activate aitools
    python src/scripts/transcribe-tribute.py
"""

import json
from pathlib import Path
from faster_whisper import WhisperModel

ASSETS = Path(__file__).resolve().parents[2] / "src/remotion/public/birthday-tribute"
AUDIO_DIR = ASSETS / "audio"
VIDEO_DIR = ASSETS / "video"
OUT_DIR = ASSETS / "captions"
OUT_DIR.mkdir(exist_ok=True)

# (output_name, source_path) — face videos transcribed directly from mp4
SOURCES = [
    ("opening", VIDEO_DIR / "opening-face.mp4"),
    ("mum", AUDIO_DIR / "vo-mum.mp3"),
    ("family", AUDIO_DIR / "vo-family.mp3"),
    ("sisters", AUDIO_DIR / "vo-sisters.mp3"),
    ("teekay", AUDIO_DIR / "vo-teekay.mp3"),
    ("closing", VIDEO_DIR / "closing-face.mp4"),
]

print("Loading Whisper model (small, CPU int8)...")
model = WhisperModel("small", device="cpu", compute_type="int8")

for name, src in SOURCES:
    if not src.exists():
        print(f"  ! {name}: source missing — {src}")
        continue

    print(f"\nTranscribing {name} ({src.name})...")
    segments, info = model.transcribe(
        str(src),
        word_timestamps=True,
        language="en",  # English with Shona names; segment-by-segment is more reliable
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=300),
    )

    captions = []
    for segment in segments:
        for word in segment.words or []:
            captions.append(
                {
                    "text": word.word,
                    "startMs": int(word.start * 1000),
                    "endMs": int(word.end * 1000),
                    "timestampMs": int(word.start * 1000),
                    "confidence": round(word.probability, 3) if word.probability else None,
                }
            )

    out_path = OUT_DIR / f"{name}.json"
    out_path.write_text(json.dumps(captions, indent=2, ensure_ascii=False))
    duration = captions[-1]["endMs"] / 1000 if captions else 0
    print(f"  → {len(captions)} words, last at {duration:.1f}s → {out_path.name}")

print("\nDone. Caption JSONs written to:", OUT_DIR)
print("Note: Shona names (Mwenewazvo, Mamoyo, Sekuru) likely mistranscribed.")
print("Hand-correct the .json files for accuracy.")
