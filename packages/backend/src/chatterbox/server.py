#!/usr/bin/env python3
"""
Chatterbox TTS Server
A FastAPI server that provides text-to-speech and voice cloning capabilities
using the Chatterbox TTS model from Resemble AI.
"""

import os
import io
import uuid
import torch
import torchaudio
import numpy as np
from scipy.io import wavfile
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
import uvicorn

# Chatterbox imports
from chatterbox.tts import ChatterboxTTS

app = FastAPI(
    title="Chatterbox Voice Studio",
    description="Text-to-Speech and Voice Cloning API powered by Chatterbox",
    version="1.0.0"
)

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
VOICES_DIR = BASE_DIR / "voices"
OUTPUT_DIR.mkdir(exist_ok=True)
VOICES_DIR.mkdir(exist_ok=True)

# Global model (lazy loaded)
_model: Optional[ChatterboxTTS] = None

def get_model() -> ChatterboxTTS:
    """Lazy load the Chatterbox model"""
    global _model
    if _model is None:
        print("Loading Chatterbox TTS model...")
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}")
        if device == "cpu":
            print("Note: Running on CPU - generation will be slower but still works!")
        _model = ChatterboxTTS.from_pretrained(device=device)
        print("Model loaded successfully!")
    return _model

@app.get("/")
async def root():
    """Health check and info endpoint"""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    return {
        "service": "Chatterbox Voice Studio",
        "status": "running",
        "device": device,
        "cuda_available": torch.cuda.is_available(),
        "endpoints": {
            "generate": "POST /generate - Generate speech from text",
            "clone": "POST /clone - Clone voice from audio sample",
            "voices": "GET /voices - List saved voice profiles",
            "health": "GET /health - Service health check"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": _model is not None,
        "cuda_available": torch.cuda.is_available(),
        "device": "cuda" if torch.cuda.is_available() else "cpu"
    }

@app.post("/generate")
async def generate_speech(
    text: str = Form(..., description="Text to convert to speech"),
    voice_id: Optional[str] = Form(None, description="Voice profile ID to use for cloning"),
    exaggeration: float = Form(0.5, description="Emotion exaggeration (0.0 = monotone, 1.0 = dramatic)"),
    cfg_weight: float = Form(0.5, description="CFG weight for generation quality")
):
    """
    Generate speech from text.
    Optionally use a saved voice profile for voice cloning.
    """
    try:
        model = get_model()

        # Check if using voice cloning
        audio_prompt_path = None
        if voice_id:
            voice_path = VOICES_DIR / f"{voice_id}.wav"
            if not voice_path.exists():
                raise HTTPException(status_code=404, detail=f"Voice profile '{voice_id}' not found")
            audio_prompt_path = str(voice_path)

        # Generate speech
        print(f"Generating speech: '{text[:50]}...' (exaggeration={exaggeration})")

        if audio_prompt_path:
            wav = model.generate(
                text,
                audio_prompt_path=audio_prompt_path,
                exaggeration=exaggeration,
                cfg_weight=cfg_weight
            )
        else:
            wav = model.generate(
                text,
                exaggeration=exaggeration,
                cfg_weight=cfg_weight
            )

        # Save to buffer using scipy (avoids torchcodec dependency)
        buffer = io.BytesIO()
        audio_np = wav.cpu().numpy().squeeze()
        # Normalize to int16 range
        audio_int16 = (audio_np * 32767).astype(np.int16)
        wavfile.write(buffer, model.sr, audio_int16)
        buffer.seek(0)

        # Return audio
        return StreamingResponse(
            buffer,
            media_type="audio/wav",
            headers={"Content-Disposition": f"attachment; filename=speech_{uuid.uuid4().hex[:8]}.wav"}
        )

    except Exception as e:
        print(f"Error generating speech: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clone")
async def save_voice_profile(
    audio: UploadFile = File(..., description="Audio file for voice cloning (7-20 seconds recommended)"),
    name: str = Form(..., description="Name for the voice profile")
):
    """
    Save a voice sample as a reusable voice profile for cloning.
    Recommended: 7-20 seconds of clear speech.
    """
    try:
        # Generate voice ID from name
        voice_id = name.lower().replace(" ", "_").replace("-", "_")
        voice_path = VOICES_DIR / f"{voice_id}.wav"

        # Read uploaded audio
        content = await audio.read()

        # Get file extension from uploaded filename (supports any format)
        original_ext = Path(audio.filename).suffix if audio.filename else ".webm"
        if not original_ext:
            original_ext = ".webm"  # Default for browser recordings

        temp_id = uuid.uuid4().hex
        temp_input = OUTPUT_DIR / f"temp_{temp_id}{original_ext}"
        temp_path = OUTPUT_DIR / f"temp_{temp_id}.wav"

        with open(temp_input, "wb") as f:
            f.write(content)

        # Convert any audio format to wav using ffmpeg
        import subprocess
        try:
            subprocess.run([
                "ffmpeg", "-y", "-i", str(temp_input),
                "-ar", "24000", "-ac", "1", "-f", "wav", str(temp_path)
            ], capture_output=True, check=True)
        except subprocess.CalledProcessError as e:
            print(f"FFmpeg error: {e.stderr.decode()}")
            raise HTTPException(status_code=500, detail="Failed to convert audio format")
        finally:
            if temp_input.exists():
                temp_input.unlink()

        # Load and resample if needed (Chatterbox expects specific format)
        try:
            # Use scipy to read audio (avoids torchcodec dependency)
            sample_rate, audio_data = wavfile.read(str(temp_path))

            # Convert to float32 normalized
            if audio_data.dtype == np.int16:
                audio_data = audio_data.astype(np.float32) / 32768.0
            elif audio_data.dtype == np.int32:
                audio_data = audio_data.astype(np.float32) / 2147483648.0

            # Convert to mono if stereo
            if len(audio_data.shape) > 1:
                audio_data = np.mean(audio_data, axis=1)

            # Resample to 24kHz if needed (simple linear interpolation)
            if sample_rate != 24000:
                from scipy import signal
                num_samples = int(len(audio_data) * 24000 / sample_rate)
                audio_data = signal.resample(audio_data, num_samples)

            # Save processed audio as int16
            audio_int16 = (audio_data * 32767).astype(np.int16)
            wavfile.write(str(voice_path), 24000, audio_int16)

            # Calculate duration
            duration = len(audio_data) / 24000

        finally:
            # Clean up temp file
            if temp_path.exists():
                temp_path.unlink()

        return {
            "success": True,
            "voice_id": voice_id,
            "name": name,
            "duration_seconds": round(duration, 2),
            "message": f"Voice profile '{name}' saved successfully"
        }

    except Exception as e:
        print(f"Error saving voice profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/voices")
async def list_voices():
    """List all saved voice profiles"""
    voices = []
    for voice_file in VOICES_DIR.glob("*.wav"):
        voice_id = voice_file.stem

        # Get duration using scipy
        try:
            sample_rate, audio_data = wavfile.read(str(voice_file))
            duration = len(audio_data) / sample_rate
        except:
            duration = 0

        voices.append({
            "voice_id": voice_id,
            "name": voice_id.replace("_", " ").title(),
            "duration_seconds": round(duration, 2),
            "path": str(voice_file)
        })

    return {
        "voices": voices,
        "count": len(voices)
    }

@app.delete("/voices/{voice_id}")
async def delete_voice(voice_id: str):
    """Delete a saved voice profile"""
    voice_path = VOICES_DIR / f"{voice_id}.wav"
    if not voice_path.exists():
        raise HTTPException(status_code=404, detail=f"Voice profile '{voice_id}' not found")

    voice_path.unlink()
    return {"success": True, "message": f"Voice profile '{voice_id}' deleted"}

@app.post("/generate-and-save")
async def generate_and_save(
    text: str = Form(...),
    voice_id: Optional[str] = Form(None),
    filename: Optional[str] = Form(None),
    exaggeration: float = Form(0.5),
    cfg_weight: float = Form(0.5)
):
    """Generate speech and save to file, returning the file path"""
    try:
        model = get_model()

        audio_prompt_path = None
        if voice_id:
            voice_path = VOICES_DIR / f"{voice_id}.wav"
            if not voice_path.exists():
                raise HTTPException(status_code=404, detail=f"Voice profile '{voice_id}' not found")
            audio_prompt_path = str(voice_path)

        # Generate
        if audio_prompt_path:
            wav = model.generate(
                text,
                audio_prompt_path=audio_prompt_path,
                exaggeration=exaggeration,
                cfg_weight=cfg_weight
            )
        else:
            wav = model.generate(
                text,
                exaggeration=exaggeration,
                cfg_weight=cfg_weight
            )

        # Save to file
        if filename is None:
            filename = f"speech_{uuid.uuid4().hex[:8]}.wav"
        if not filename.endswith(".wav"):
            filename += ".wav"

        output_path = OUTPUT_DIR / filename
        audio_np = wav.cpu().numpy().squeeze()
        audio_int16 = (audio_np * 32767).astype(np.int16)
        wavfile.write(str(output_path), model.sr, audio_int16)

        return {
            "success": True,
            "path": str(output_path),
            "filename": filename,
            "duration_seconds": round(wav.shape[1] / model.sr, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("=" * 60)
    print("  CHATTERBOX VOICE STUDIO")
    print("  Free, Open-Source Text-to-Speech & Voice Cloning")
    print("=" * 60)
    print()
    print(f"  CUDA Available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"  GPU: {torch.cuda.get_device_name(0)}")
    print()
    print("  Starting server on http://localhost:8765")
    print("=" * 60)

    uvicorn.run(app, host="0.0.0.0", port=8765, log_level="info")
