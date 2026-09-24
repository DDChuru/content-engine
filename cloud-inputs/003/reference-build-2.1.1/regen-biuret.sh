#!/bin/bash
set -euo pipefail
cd /home/dachu/sme-9700-archive/topic-02/2.1.1
source /home/dachu/.secrets/elevenlabs.env
export ELEVENLABS_API_KEY
nice -n 10 python3 generate_audio.py 3 13 14 17 > logs/generate-audio-biuret.log 2>&1
nice -n 10 /home/dachu/miniconda3/envs/aitools/bin/python transcribe_audio.py 3 13 14 17 > logs/transcribe-biuret.log 2>&1
touch audio-biuret.complete
