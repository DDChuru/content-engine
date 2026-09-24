#!/bin/bash
# Detached: render beat 11 (label fix) → finish → verify → encoded sheets. Ends "CHAIN DONE".
set -uo pipefail
cd "$(dirname "$0")"
nice -n 10 node render-beat.cjs 11 > logs/render-beat-11-fix.log 2>&1 || { echo "beat 11 failed"; exit 1; }
nice -n 10 python3 finish.py || exit 1
python3 verify.py > logs/verify.log 2>&1 || { echo VERIFY FAILED; exit 1; }
python3 encoded-sheets.py
echo "CHAIN DONE $(date -u +%T)"
