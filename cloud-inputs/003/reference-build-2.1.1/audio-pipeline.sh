#!/bin/bash
# Detached: generate (network) and transcribe (CPU, nice) in parallel; transcription polls for WAVs.
set -euo pipefail
cd /home/dachu/sme-9700-archive/topic-02/2.1.1
source /home/dachu/.secrets/elevenlabs.env
export ELEVENLABS_API_KEY
nice -n 10 /home/dachu/miniconda3/envs/aitools/bin/python transcribe_audio.py > logs/transcribe-audio.log 2>&1 &
whisper_pid=$!
nice -n 10 python3 generate_audio.py > logs/generate-audio.log 2>&1
wait "$whisper_pid"
touch audio-recording-transcription.complete
