#!/usr/bin/env python3
"""
Narration Client for Video Generation
Provides a unified interface for TTS, supporting both Chatterbox (free) and ElevenLabs (paid).

Usage:
    from narration_client import generate_narration

    # Free local generation
    audio_path = generate_narration("Hello world", voice_id="my_voice")

    # Or batch generate for video lessons
    audio_files = batch_narrate(lesson_scripts, voice_id="teacher")
"""

import os
import time
import requests
from pathlib import Path
from typing import Optional, List, Dict

CHATTERBOX_URL = "http://localhost:8765"
OUTPUT_DIR = Path(__file__).parent / "output" / "narration"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def check_server(wait_timeout: int = 60) -> bool:
    """Check if Chatterbox server is running, wait up to timeout seconds"""
    import time
    start = time.time()
    while time.time() - start < wait_timeout:
        try:
            response = requests.get(f"{CHATTERBOX_URL}/health", timeout=10)
            if response.status_code == 200:
                return True
        except:
            pass
        print("Waiting for server...")
        time.sleep(5)
    return False


def generate_narration(
    text: str,
    voice_id: Optional[str] = None,
    exaggeration: float = 0.5,
    output_filename: Optional[str] = None
) -> str:
    """
    Generate narration audio from text.

    Args:
        text: The text to convert to speech
        voice_id: Optional voice profile ID for voice cloning
        exaggeration: Emotion level (0.0 = monotone, 1.0 = dramatic)
        output_filename: Optional custom filename

    Returns:
        Path to the generated audio file
    """
    if not check_server():
        raise RuntimeError(
            "Chatterbox server not running. Start it with:\n"
            "  cd packages/backend/src/chatterbox && python server.py"
        )

    # Prepare request
    data = {
        "text": text,
        "exaggeration": str(exaggeration),
        "cfg_weight": "0.5"
    }
    if voice_id:
        data["voice_id"] = voice_id

    # Generate filename
    if output_filename is None:
        timestamp = int(time.time() * 1000)
        output_filename = f"narration_{timestamp}.wav"

    output_path = OUTPUT_DIR / output_filename

    # Make request
    print(f"Generating: {text[:50]}...")
    start_time = time.time()

    response = requests.post(
        f"{CHATTERBOX_URL}/generate",
        data=data,
        timeout=300  # 5 minute timeout for CPU generation
    )

    if response.status_code != 200:
        raise RuntimeError(f"Generation failed: {response.text}")

    # Save audio
    with open(output_path, "wb") as f:
        f.write(response.content)

    elapsed = time.time() - start_time
    print(f"Generated in {elapsed:.1f}s: {output_path}")

    return str(output_path)


def batch_narrate(
    scripts: List[Dict[str, str]],
    voice_id: Optional[str] = None,
    exaggeration: float = 0.5
) -> List[str]:
    """
    Batch generate narration for multiple scenes.

    Args:
        scripts: List of dicts with 'id' and 'text' keys
        voice_id: Optional voice profile for all narrations
        exaggeration: Emotion level

    Returns:
        List of paths to generated audio files
    """
    audio_files = []
    total = len(scripts)

    print(f"\n{'='*60}")
    print(f"  BATCH NARRATION: {total} segments")
    print(f"  Voice: {voice_id or 'Default'}")
    print(f"  Cost: $0.00 (Chatterbox - FREE)")
    print(f"{'='*60}\n")

    start_time = time.time()

    for i, script in enumerate(scripts, 1):
        scene_id = script.get("id", f"scene_{i}")
        text = script["text"]

        print(f"[{i}/{total}] {scene_id}")

        output_filename = f"{scene_id}.wav"
        audio_path = generate_narration(
            text=text,
            voice_id=voice_id,
            exaggeration=exaggeration,
            output_filename=output_filename
        )
        audio_files.append(audio_path)

    total_time = time.time() - start_time
    print(f"\n{'='*60}")
    print(f"  COMPLETE: {total} audio files in {total_time:.1f}s")
    print(f"  Average: {total_time/total:.1f}s per segment")
    print(f"  Saved: ${total * 0.03:.2f} vs ElevenLabs")
    print(f"{'='*60}\n")

    return audio_files


def narrate_lesson(lesson: Dict) -> Dict[str, str]:
    """
    Generate all narration for an educational lesson.

    Args:
        lesson: Lesson dict with 'title', 'scenes' array

    Returns:
        Dict mapping scene IDs to audio file paths
    """
    scenes = lesson.get("scenes", [])
    scripts = []

    for scene in scenes:
        scripts.append({
            "id": scene.get("id", f"scene_{len(scripts)+1}"),
            "text": scene.get("narration", scene.get("text", ""))
        })

    audio_files = batch_narrate(
        scripts,
        voice_id=lesson.get("voice_id"),
        exaggeration=lesson.get("exaggeration", 0.5)
    )

    return {
        scripts[i]["id"]: audio_files[i]
        for i in range(len(scripts))
    }


# Cost calculator
def estimate_savings(char_count: int) -> Dict:
    """Estimate cost savings vs ElevenLabs"""
    elevenlabs_cost = (char_count / 1000) * 0.30
    return {
        "characters": char_count,
        "elevenlabs_cost": f"${elevenlabs_cost:.2f}",
        "chatterbox_cost": "$0.00",
        "savings": f"${elevenlabs_cost:.2f}",
        "savings_percent": "100%"
    }


if __name__ == "__main__":
    # Test the client
    print("Testing Chatterbox Narration Client...")

    if not check_server():
        print("Server not running. Please start it first.")
        exit(1)

    # Single generation test
    audio = generate_narration(
        "Welcome to this educational video about mathematics.",
        exaggeration=0.6
    )
    print(f"Test audio: {audio}")

    # Batch test
    test_scripts = [
        {"id": "intro", "text": "Today we'll learn about sets and Venn diagrams."},
        {"id": "definition", "text": "A set is a collection of distinct objects."},
        {"id": "example", "text": "For example, the set of primary colors contains red, blue, and yellow."},
    ]

    batch_audio = batch_narrate(test_scripts)
    print(f"Batch audio files: {batch_audio}")

    # Cost savings
    sample_lesson_chars = 3000  # ~10 minute lesson
    savings = estimate_savings(sample_lesson_chars)
    print(f"\nCost savings for {sample_lesson_chars} chars:")
    print(f"  ElevenLabs: {savings['elevenlabs_cost']}")
    print(f"  Chatterbox: {savings['chatterbox_cost']}")
    print(f"  Savings: {savings['savings']} ({savings['savings_percent']})")
