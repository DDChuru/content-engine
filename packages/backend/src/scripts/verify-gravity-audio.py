#!/usr/bin/env python3
"""Selectively re-voice gravity corrections and record MP3 preservation evidence."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys

BACKEND = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("topic", choices=["derived-units", "types-of-forces"])
parser.add_argument("--generate", action="store_true", help="Make the paid TTS requests")
args = parser.parse_args()
changed = {"derived-units": ["s08"], "types-of-forces": ["s03", "s09"]}[args.topic]
project = BACKEND / "projects" / f"mechanics-{args.topic}"
audio_dir = BACKEND / "src/remotion/public/audio/mechanics"
proof_path = project / "verify-gravity-audio.json"
hash_bytes = lambda data: hashlib.sha256(data).hexdigest()

if args.generate:
    if proof_path.exists():
        raise SystemExit("Generation evidence already exists; inspect it before regenerating.")
    # Load only the required secret; never print the .env or its contents.
    env_path = Path.home() / "Documents/projects/content-engine/.env"
    for line in env_path.read_text().splitlines():
        if line.startswith("ELEVENLABS_API_KEY="):
            os.environ["ELEVENLABS_API_KEY"] = line.split("=", 1)[1].strip().strip("\"'")
    os.environ["TTS_PROVIDER"] = "elevenlabs"
    os.environ["ELEVENLABS_SPEED"] = "1.14"
    sys.path.insert(0, str(BACKEND / "src/chatterbox"))
    from narration_client import generate_narration

    baseline = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=BACKEND, text=True).strip()
    before = {p.name: hash_bytes(p.read_bytes()) for p in audio_dir.glob(f"{args.topic}-s*.mp3")}
    storyboard = (project / "STORYBOARD.md").read_text()
    for scene in changed:
        section = storyboard.split(f"## {scene.upper()} — ", 1)[1].split("\n## ", 1)[0]
        narration = re.search(r"\*\*Narration:\*\* “(.*?)”", section).group(1)
        generate_narration(narration, voice_id="gYWKdgLtqjPO3D5uDrDP",
                           output_filename=str(audio_dir / f"{args.topic}-{scene}.mp3"))
    proof = {"baselineCommit": baseline, "voiceId": "gYWKdgLtqjPO3D5uDrDP",
             "model": "eleven_turbo_v2_5", "speed": 1.14,
             "speedSource": "Original scene requests in ElevenLabs history, 2026-09-05",
             "changedScenes": changed, "beforeSha256": before}
else:
    proof = json.loads(proof_path.read_text())
    transcript_path = BACKEND / f"src/remotion/public/transcripts/mechanics/{args.topic}.json"
    transcript = json.loads(transcript_path.read_text())
    old = json.loads(subprocess.check_output(
        ["git", "show", f"{proof['baselineCommit']}:packages/backend/src/remotion/public/transcripts/mechanics/{args.topic}.json"], cwd=BACKEND))
    assert [s for s in transcript["scenes"] if s["id"] not in changed] == [s for s in old["scenes"] if s["id"] not in changed]
    proof["untouchedTranscriptObjectsIdentical"] = True
    proof["transcribedScenes"] = []
    for scene in transcript["scenes"]:
        if scene["id"] not in changed:
            continue
        duration = float(subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
            "default=noprint_wrappers=1:nokey=1", str(audio_dir / scene["audio"])]))
        assert abs(duration - scene["duration"]) < 0.000002
        assert "local" in scene["engine"]
        assert not re.search(r"9\.8|nine point eight|14\.7|7\.3|1\.46", scene["text"], re.I)
        assert all(any(abs(at - word["start"]) < 0.001 for word in scene["words"]) for at in scene["cues"].values())
        proof["transcribedScenes"].append({"id": scene["id"], "duration": duration, "text": scene["text"], "cues": scene["cues"]})

proof["afterSha256"] = {p.name: hash_bytes(p.read_bytes()) for p in audio_dir.glob(f"{args.topic}-s*.mp3")}
assert len(proof["afterSha256"]) == len(proof["beforeSha256"]) == 10
for name, before in proof["beforeSha256"].items():
    expected_change = any(name == f"{args.topic}-{scene}.mp3" for scene in changed)
    assert (proof["afterSha256"][name] != before) == expected_change, name
proof["untouchedAudioByteIdentical"] = True
proof_path.write_text(json.dumps(proof, indent=2) + "\n")
print(f"Verified {10 - len(changed)} byte-identical MP3s; changed only {changed}")
