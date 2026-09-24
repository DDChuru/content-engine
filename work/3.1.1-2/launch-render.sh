#!/bin/bash
# Usage: ./launch-render.sh N — detach the beat render (cap 4 live = 4 vCPU).
set -euo pipefail
cd "$(dirname "$0")"
N=$(printf '%02d' "$1")
live=$(pgrep -fc 'node render-beat.cjs' || true)
if [ "$live" -ge 4 ]; then echo "4 renders live; wait"; exit 3; fi
if [ -f render-cache/beat-$N/render.lock ]; then echo "lock exists for beat $N (pid $(cat render-cache/beat-$N/render.lock))"; exit 4; fi
mkdir -p logs; setsid nohup nice -n 10 node render-beat.cjs "$1" > logs/render-beat-$N.log 2>&1 < /dev/null &
echo "beat $N render detached"
