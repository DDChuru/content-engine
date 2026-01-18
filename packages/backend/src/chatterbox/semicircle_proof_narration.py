#!/usr/bin/env python3
"""
Generate narration for Angle in Semicircle theorem V2 (with proof)
Uses Daniel voice via Chatterbox TTS
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from narration_client import generate_narration, check_server
from pathlib import Path
import json

OUTPUT_DIR = Path(__file__).parent / "output" / "semicircle-proof"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Narration for the animated proof version (~22 seconds visual)
PROOF_SCRIPTS = [
    {
        "id": "01_setup",
        "text": "Consider a circle with a diameter. Let's call the endpoints A and B."
    },
    {
        "id": "02_moving_point",
        "text": "Now watch as we pick different points on the semicircle. Each time, we connect the point to both A and B, forming a triangle."
    },
    {
        "id": "03_all_90",
        "text": "Notice something remarkable. Every single angle at the circumference is exactly ninety degrees. But why?"
    },
    {
        "id": "04_center",
        "text": "Here's the key. Mark the center point O. The diameter is a straight line through the center, which means it forms an angle of one hundred and eighty degrees."
    },
    {
        "id": "05_theorem",
        "text": "By the central angle theorem, any angle at the circumference is exactly half the angle at the center. So one hundred and eighty divided by two gives us ninety degrees. Always."
    },
]

def generate_all():
    """Generate all narration audio files with Daniel voice"""
    print("=" * 60)
    print("  GENERATING SEMICIRCLE PROOF NARRATION")
    print("  Voice: Daniel")
    print("=" * 60)
    print()

    print("Checking Chatterbox server...")
    if not check_server(wait_timeout=10):
        print("ERROR: Chatterbox server not running!")
        print("Start it with: python server.py")
        return []

    print("Server OK!\n")
    results = []

    for i, script in enumerate(PROOF_SCRIPTS, 1):
        print(f"[{i}/{len(PROOF_SCRIPTS)}] {script['id']}")
        print(f"    Text: {script['text'][:50]}...")

        try:
            audio_path = generate_narration(
                text=script['text'],
                voice_id="daniel",
                exaggeration=0.5,
                output_filename=f"{script['id']}.wav"
            )

            import shutil
            final_path = OUTPUT_DIR / f"{script['id']}.wav"
            if Path(audio_path).exists():
                shutil.copy(audio_path, str(final_path))
                print(f"    ✓ Saved: {final_path.name}")
                results.append({
                    "id": script['id'],
                    "audio": str(final_path),
                    "text": script['text']
                })
            else:
                print(f"    ✗ Failed: Audio file not found")

        except Exception as e:
            print(f"    ✗ Error: {e}")

    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n✓ Manifest saved: {manifest_path}")

    print()
    print("=" * 60)
    print(f"  COMPLETE: {len(results)}/{len(PROOF_SCRIPTS)} audio files")
    print("=" * 60)

    return results

if __name__ == "__main__":
    generate_all()
