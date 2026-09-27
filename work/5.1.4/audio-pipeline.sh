#!/bin/bash
# Detached: generate (network) and transcribe (CPU) in parallel; transcription polls for WAVs.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p logs
nice -n 10 python3 transcribe_audio.py > logs/transcribe-audio.log 2>&1 &
wp=$!
# CLOUD: ElevenLabs credential injected into requests, so no keys.sh
python3 generate_audio.py > logs/generate-audio.log 2>&1
wait "$wp"
touch audio-recording-transcription.complete
