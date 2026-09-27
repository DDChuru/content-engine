#!/bin/bash
# Usage: ./render-batch.sh N [N ...] — render approved beats, 4 in parallel (CLOUD: 4 vCPU; the machine-A render
# lock is not used — never run two batches at once). Detach with: setsid nohup ./render-batch.sh ... &
# Exits non-zero if the build fails (nothing is rendered) or if ANY beat render fails (each worker keeps its exit
# status; xargs reports failure; the script prints BATCH FAILED and exits 1). NODE and LOCK may be overridden (tests).
set -euo pipefail
cd "$(dirname "$0")"
NODE="${NODE:-node}"
mkdir -p logs
unset BUNDLE
"$NODE" build.cjs
export NODE
if bash -c 'printf "%s\n" "$@" | xargs -P 4 -I{} sh -c "nice -n 10 \"\$NODE\" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=\$?; echo beat {} exit \$rc; exit \$rc"' _ "$@"; then
  echo "BATCH DONE $(date -u +%T) $*"
else
  echo "BATCH FAILED $(date -u +%T) $* (see logs/render-beat-*.log)" >&2
  exit 1
fi
