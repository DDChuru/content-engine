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
from pathlib import Path
from typing import Optional, List, Dict
# `requests` is imported lazily inside the chatterbox/elevenlabs paths, so the default Kokoro
# path needs only kokoro-onnx + soundfile (runs from a bare python via the venv fallback).

CHATTERBOX_URL = "http://localhost:8765"
OUTPUT_DIR = Path(__file__).parent / "output" / "narration"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# TTS provider switch: kokoro (default — free local CPU) | chatterbox (local server, cloning/
# emotion) | elevenlabs (paid, kept on the back burner). Override per-run via env.
TTS_PROVIDER = os.environ.get("TTS_PROVIDER", "kokoro").lower()
KOKORO_VOICE = os.environ.get("KOKORO_VOICE", "bm_george")   # British male, narration-grade
KOKORO_LANG = os.environ.get("KOKORO_LANG", "en-gb")
_MODELS = Path(__file__).parent / "models"
KOKORO_MODEL = os.environ.get("KOKORO_MODEL", str(_MODELS / "kokoro-v1.0.onnx"))
KOKORO_VOICES = os.environ.get("KOKORO_VOICES", str(_MODELS / "voices-v1.0.bin"))
_kokoro_engine = None


def check_server(wait_timeout: int = 60) -> bool:
    """Check if Chatterbox server is running, wait up to timeout seconds"""
    import time, requests
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


def _gen_kokoro(text: str, voice: Optional[str], output_path) -> None:
    """Local Kokoro (kokoro-onnx) — CPU, free, faster-than-real-time. Model loaded once."""
    global _kokoro_engine
    try:
        import kokoro_onnx  # noqa: F401
    except ImportError:
        # Run from any python: fall back to the setup venv's site-packages (kokoro-onnx +
        # soundfile are installed there via `uv venv .venv-kokoro`). Override with KOKORO_VENV.
        import sys, glob
        venv = os.environ.get("KOKORO_VENV", str(Path(__file__).parent / ".venv-kokoro"))
        for sp in sorted(glob.glob(f"{venv}/lib/python*/site-packages")):
            if sp not in sys.path:
                sys.path.insert(0, sp)
    from kokoro_onnx import Kokoro
    import soundfile as sf
    if _kokoro_engine is None:
        _kokoro_engine = Kokoro(KOKORO_MODEL, KOKORO_VOICES)
    samples, sample_rate = _kokoro_engine.create(text, voice=voice or KOKORO_VOICE, speed=1.0, lang=KOKORO_LANG)
    sf.write(str(output_path), samples, sample_rate)


def _gen_elevenlabs(text: str, voice: Optional[str], output_path) -> None:
    """ElevenLabs (paid) — kept on the back burner. Use with TTS_PROVIDER=elevenlabs."""
    import requests
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        raise RuntimeError("ELEVENLABS_API_KEY not set (required for TTS_PROVIDER=elevenlabs)")
    voice_id = voice or os.environ.get("ELEVENLABS_VOICE_ID", "JBFqnCBsd6RMkjVDRZzb")  # "George"
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": api_key, "Content-Type": "application/json"},
        json={"text": text, "model_id": "eleven_turbo_v2_5"},
        timeout=120,
    )
    if resp.status_code != 200:
        raise RuntimeError(f"ElevenLabs failed: {resp.text[:200]}")
    with open(output_path, "wb") as f:
        f.write(resp.content)


def _gen_chatterbox(text: str, voice: Optional[str], exaggeration: float, output_path) -> None:
    """Local Chatterbox server (voice cloning + emotion). Start: python server.py"""
    import requests
    if not check_server():
        raise RuntimeError(
            "Chatterbox server not running. Start it with:\n"
            "  cd packages/backend/src/chatterbox && python server.py"
        )
    data = {"text": text, "exaggeration": str(exaggeration), "cfg_weight": "0.5"}
    if voice:
        data["voice_id"] = voice
    resp = requests.post(f"{CHATTERBOX_URL}/generate", data=data, timeout=300)
    if resp.status_code != 200:
        raise RuntimeError(f"Generation failed: {resp.text}")
    with open(output_path, "wb") as f:
        f.write(resp.content)


def generate_narration(
    text: str,
    voice_id: Optional[str] = None,
    exaggeration: float = 0.5,
    output_filename: Optional[str] = None
) -> str:
    """
    Generate narration audio from text via the configured TTS provider
    (TTS_PROVIDER: kokoro | chatterbox | elevenlabs).

    Args:
        text: The text to convert to speech
        voice_id: Optional voice (Kokoro voice name, EL voice id, or Chatterbox profile)
        exaggeration: Emotion level for Chatterbox (0.0 monotone .. 1.0 dramatic)
        output_filename: Optional custom filename

    Returns:
        Path to the generated audio file
    """
    if output_filename is None:
        output_filename = f"narration_{int(time.time() * 1000)}.wav"
    output_path = OUTPUT_DIR / output_filename

    print(f"[{TTS_PROVIDER}] Generating: {text[:50]}...")
    start_time = time.time()
    if TTS_PROVIDER == "kokoro":
        _gen_kokoro(text, voice_id, output_path)
    elif TTS_PROVIDER == "elevenlabs":
        _gen_elevenlabs(text, voice_id, output_path)
    else:
        _gen_chatterbox(text, voice_id, exaggeration, output_path)

    print(f"Generated in {time.time() - start_time:.1f}s: {output_path}")
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
    print(f"  Voice: {voice_id or (KOKORO_VOICE if TTS_PROVIDER == 'kokoro' else 'Default')}")
    print(f"  Provider: {TTS_PROVIDER}{' (FREE)' if TTS_PROVIDER != 'elevenlabs' else ' (paid)'}")
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
