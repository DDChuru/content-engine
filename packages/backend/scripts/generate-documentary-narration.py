#!/usr/bin/env python3
"""
Generate Documentary Narration
Uses Chatterbox TTS with Daniel's voice to narrate the Edgar Tekere documentary.

Usage:
  1. Start Chatterbox server: cd src/chatterbox && python server.py
  2. Run this script: python scripts/generate-documentary-narration.py
"""

import json
import os
import sys
import time
import requests
from pathlib import Path

# Configuration
CHATTERBOX_URL = "http://localhost:8765"
PROJECT_FILE = Path(__file__).parent.parent / "output/journalist-projects/edgar-tekere-documentary.json"
OUTPUT_DIR = Path(__file__).parent.parent / "src/remotion/public/audio/documentary"
VOICE_ID = "daniel"  # Use Daniel's cloned voice
EXAGGERATION = 0.6   # Slightly dramatic for documentary style


def check_server() -> bool:
    """Check if Chatterbox server is running"""
    try:
        response = requests.get(f"{CHATTERBOX_URL}/health", timeout=5)
        return response.status_code == 200
    except:
        return False


def generate_audio(text: str, filename: str) -> str:
    """Generate audio for a single piece of text"""
    data = {
        "text": text,
        "voice_id": VOICE_ID,
        "exaggeration": str(EXAGGERATION),
        "cfg_weight": "0.5"
    }

    response = requests.post(
        f"{CHATTERBOX_URL}/generate",
        data=data,
        timeout=300  # 5 minute timeout
    )

    if response.status_code != 200:
        raise RuntimeError(f"Generation failed: {response.text}")

    output_path = OUTPUT_DIR / filename
    with open(output_path, "wb") as f:
        f.write(response.content)

    return str(output_path)


def main():
    print("=" * 60)
    print("  EDGAR TEKERE DOCUMENTARY - NARRATION GENERATION")
    print("  Voice: Daniel (Chatterbox TTS)")
    print("=" * 60)
    print()

    # Check server
    if not check_server():
        print("ERROR: Chatterbox server not running!")
        print()
        print("Start it with:")
        print("  cd packages/backend/src/chatterbox")
        print("  python server.py")
        print()
        sys.exit(1)

    print("Chatterbox server: CONNECTED")

    # Load project
    if not PROJECT_FILE.exists():
        print(f"ERROR: Project file not found: {PROJECT_FILE}")
        sys.exit(1)

    with open(PROJECT_FILE) as f:
        project = json.load(f)

    scenes = project.get("scenes", [])
    print(f"Loaded project: {project.get('name')}")
    print(f"Scenes to narrate: {len(scenes)}")
    print()

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Generate narration for each scene
    audio_files = []
    total_chars = 0
    start_time = time.time()

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get("id", str(i))
        title = scene.get("title", f"Scene {i}")
        narration = scene.get("narration", "")

        if not narration:
            print(f"[{i}/{len(scenes)}] SKIP: {title} (no narration)")
            continue

        print(f"[{i}/{len(scenes)}] Generating: {title}")
        print(f"           Text: \"{narration[:60]}...\"")

        scene_start = time.time()
        filename = f"scene_{scene_id}.wav"

        try:
            audio_path = generate_audio(narration, filename)
            elapsed = time.time() - scene_start
            audio_files.append({
                "scene_id": scene_id,
                "title": title,
                "audio_path": audio_path,
                "duration_estimate": len(narration) / 15  # ~15 chars per second estimate
            })
            total_chars += len(narration)
            print(f"           Done in {elapsed:.1f}s -> {filename}")
        except Exception as e:
            print(f"           ERROR: {e}")

        print()

    # Summary
    total_time = time.time() - start_time

    print("=" * 60)
    print("  NARRATION COMPLETE")
    print("=" * 60)
    print(f"  Audio files: {len(audio_files)}")
    print(f"  Total characters: {total_chars}")
    print(f"  Generation time: {total_time:.1f}s")
    print(f"  Average: {total_time/len(audio_files):.1f}s per scene")
    print()
    print(f"  Output directory: {OUTPUT_DIR}")
    print()
    print("  Cost comparison:")
    elevenlabs_cost = (total_chars / 1000) * 0.30
    print(f"    - ElevenLabs: ${elevenlabs_cost:.2f}")
    print(f"    - Chatterbox: $0.00 (FREE)")
    print(f"    - Savings: ${elevenlabs_cost:.2f}")
    print("=" * 60)

    # Save manifest
    manifest = {
        "project": project.get("name"),
        "voice_id": VOICE_ID,
        "exaggeration": EXAGGERATION,
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_chars": total_chars,
        "files": audio_files
    }

    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nManifest saved: {manifest_path}")


if __name__ == "__main__":
    main()
