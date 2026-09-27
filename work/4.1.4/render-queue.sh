#!/bin/bash
# Render the listed beats ONE AT A TIME (CLOUD: no machine-A lock; use render-batch.sh for 4-way parallel). Exits non-zero if the build fails, any beat fails, or any requested beat is not
# complete from the CURRENT source at the end. Usage: ./render-queue.sh 1 2 3 ...
set -uo pipefail
cd "$(dirname "$0")" || exit 2; mkdir -p logs
node build.cjs >/dev/null || { echo "$(date +%T) BUILD FAILED"; exit 2; }
# normalise ids once (accept zero-padded "01" as 1; reject non-numeric)
ids=()
for a in "$@"; do [[ "$a" =~ ^[0-9]+$ ]] || { echo "bad beat id: $a"; exit 2; }; ids+=("$((10#$a))"); done
fail=0
for b in "${ids[@]}"; do
  N=$(printf '%02d' "$b")
  if [ -f render-cache/beat-$N/render.lock ]; then echo "$(date +%T) $N SKIPPED: render.lock exists (pid $(cat render-cache/beat-$N/render.lock))"; fail=1; continue; fi
  echo "$(date +%T) waiting for lock / launching $N"
  nice -n 10 node render-beat.cjs "$b" > logs/render-beat-$N.log 2>&1 < /dev/null
  rc=$?; echo "$(date +%T) $N exit $rc"; [ $rc -eq 0 ] || fail=1
done
state=$(node stale.cjs) || { echo "stale.cjs failed"; exit 2; }
for b in "${ids[@]}"; do echo "$state" | tr ' ' '\n' | grep -qx "$b:current" || { echo "$(date +%T) beat $b NOT current: $(echo "$state" | tr ' ' '\n' | grep "^$b:")"; fail=1; }; done
if [ $fail -ne 0 ]; then echo "$(date +%T) queue FAILED"; exit 1; fi
echo "$(date +%T) queue done: all requested beats current"
