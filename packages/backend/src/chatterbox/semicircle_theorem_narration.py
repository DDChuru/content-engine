#!/usr/bin/env python3
"""
Generate narration for Angle in Semicircle theorem (5 steps)
Uses Daniel voice via Chatterbox TTS
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from narration_client import generate_narration, check_server
from pathlib import Path
import json

OUTPUT_DIR = Path(__file__).parent / "output" / "semicircle-theorem"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 5-step narration scripts
THEOREM_SCRIPTS = [
    {
        "id": "step1_setup",
        "text": "Consider a circle with a diameter drawn across it. This diameter divides the circle into two equal halves, creating a semicircle."
    },
    {
        "id": "step2_point",
        "text": "Now, pick any point on the semicircle's arc. It doesn't matter where. Any point will work."
    },
    {
        "id": "step3_connect",
        "text": "Connect this point to both ends of the diameter. These two lines form an angle at our chosen point."
    },
    {
        "id": "step4_reveal",
        "text": "Here's the remarkable property. This angle is always exactly ninety degrees. A perfect right angle. No matter where you place the point on the arc, you always get ninety degrees."
    },
    {
        "id": "step5_multiple",
        "text": "To prove this isn't a coincidence, watch as we show multiple positions. Every point on the arc gives us the same ninety-degree angle. This is the Angle in a Semicircle theorem."
    }
]

def generate_all():
    """Generate all narration audio files with Daniel voice"""
    print("=" * 60)
    print("  GENERATING SEMICIRCLE THEOREM NARRATION")
    print("  Voice: Daniel")
    print("=" * 60)
    print()

    # Check server is running
    print("Checking Chatterbox server...")
    if not check_server(wait_timeout=10):
        print("ERROR: Chatterbox server not running!")
        print("Start it with: python server.py")
        return []

    print("Server OK!\n")
    results = []

    for i, script in enumerate(THEOREM_SCRIPTS, 1):
        print(f"[{i}/{len(THEOREM_SCRIPTS)}] {script['id']}")
        print(f"    Text: {script['text'][:50]}...")

        try:
            # Generate using narration_client
            audio_path = generate_narration(
                text=script['text'],
                voice_id="daniel",
                exaggeration=0.5,
                output_filename=f"{script['id']}.wav"
            )

            # Move to our output directory
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

    # Save manifest
    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n✓ Manifest saved: {manifest_path}")

    print()
    print("=" * 60)
    print(f"  COMPLETE: {len(results)}/{len(THEOREM_SCRIPTS)} audio files")
    print("=" * 60)

    return results

if __name__ == "__main__":
    generate_all()
