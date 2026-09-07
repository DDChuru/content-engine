#!/usr/bin/env python3
"""Offline V4 word transcription using the machine's existing faster-whisper cache.

Matches the repo's transcribe-mechanics-si-units-local.py CPU/int8 workflow.
No model download, provider credentials, or synthetic timestamps.
An optional script context retries recognition; timestamps still come from audio.
"""
import argparse
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import platform
import sys
from datetime import datetime, timezone

os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"


def identity(file):
    with file.open("rb") as stream:
        digest = hashlib.file_digest(stream, "sha256").hexdigest()
    return {"name": file.name, "bytes": file.stat().st_size, "sha256": digest}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--audio")
    parser.add_argument("--initial-prompt")
    parser.add_argument("--compute-type", choices=("int8", "float32"), default="int8")
    parser.add_argument("--clip-timestamps", help="Measured source-audio window start,end in seconds")
    args = parser.parse_args()
    model_path = Path(args.model_path).resolve()
    files = [model_path / name for name in ("model.bin", "config.json", "tokenizer.json", "vocabulary.txt")]
    if not all(file.is_file() for file in files):
        raise RuntimeError("Local Whisper model incomplete; supply an existing model directory. Downloads are disabled.")
    settings = {
        "language": "en", "word_timestamps": True, "beam_size": 5,
        "temperature": 0, "condition_on_previous_text": False, "vad_filter": False,
        "hotwords": "Bakery Demo, Bill of Health, Premix Area, SSOP, NCR, Remedial, none captured, Still to do, Passed, Follow-up owed, Couldn't access, Resolved today, Pass all, Daily.",
    }
    if args.initial_prompt:
        settings.pop("hotwords")
        settings["initial_prompt"] = args.initial_prompt
    if args.clip_timestamps:
        window = [float(value) for value in args.clip_timestamps.split(",")]
        if len(window) != 2 or not 0 <= window[0] < window[1]:
            raise ValueError("A positive, ordered source-audio window is required")
        settings["clip_timestamps"] = window
    transcription = {
        "provider": "local-faster-whisper", "model": "Systran/faster-whisper-small",
        "modelPath": str(model_path), "modelRevision": model_path.name,
        "modelFiles": [identity(file) for file in files],
        "versions": {name: importlib.metadata.version(name) for name in
                     ("faster-whisper", "ctranslate2", "av", "tokenizers")},
        "pythonVersion": platform.python_version(), "pythonExecutable": sys.executable,
        "device": "cpu", "computeType": args.compute_type, "cpuThreads": 4, "numWorkers": 1,
        "localFilesOnly": True, "settings": settings,
        "helper": identity(Path(__file__)),
        "workflowRef": "../packages/backend/src/scripts/transcribe-mechanics-si-units-local.py",
    }
    if not args.audio:
        print(json.dumps(transcription))
        return
    from faster_whisper import WhisperModel

    model = WhisperModel(str(model_path), device="cpu", compute_type=args.compute_type,
                         cpu_threads=4, num_workers=1, local_files_only=True)
    audio = Path(args.audio)
    segments, info = model.transcribe(str(audio), **settings)
    measured = []
    words = []
    for segment in segments:
        measured.append({"id": segment.id, "start": segment.start, "end": segment.end,
                         "text": segment.text, "avg_logprob": segment.avg_logprob,
                         "no_speech_prob": segment.no_speech_prob})
        words.extend({"word": word.word.strip(), "start": word.start, "end": word.end,
                      "probability": word.probability} for word in segment.words or [])
    if not words:
        raise RuntimeError("Local Whisper returned no measured words")
    print(json.dumps({
        "audioSha256": identity(audio)["sha256"],
        "measuredAt": datetime.now(timezone.utc).isoformat(),
        "transcription": transcription,
        "response": {"language": info.language, "duration": info.duration,
                     "text": " ".join(segment["text"].strip() for segment in measured),
                     "segments": measured, "words": words},
    }))


if __name__ == "__main__":
    main()
