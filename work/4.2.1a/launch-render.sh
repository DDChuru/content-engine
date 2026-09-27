#!/bin/bash
# Usage: ./launch-render.sh N — detach ONE beat render that first acquires the shared machine-A render lock
# (/tmp/topic3-render.lock, held by every Topic 3 builder's renders), so it can never overlap another render.
# For several beats at once prefer ./render-batch.sh (holds the lock once, 6 beats in parallel).
# A failed build stops here (set -e); the detached render's result is in logs/render-beat-NN.log and
# render-cache/beat-NN/complete.json. NODE and LOCK may be overridden (tests).
set -euo pipefail
cd "$(dirname "$0")"
NODE="${NODE:-node}"   # CLOUD: no machine-A render lock
N=$(printf '%02d' "$1")
mkdir -p logs
if [ -f render-cache/beat-$N/render.lock ]; then echo "lock exists for beat $N (pid $(cat render-cache/beat-$N/render.lock))"; exit 4; fi
unset BUNDLE; "$NODE" build.cjs
setsid nohup nice -n 10 "$NODE" render-beat.cjs "$1" > logs/render-beat-$N.log 2>&1 < /dev/null &
echo "beat $N render detached"
