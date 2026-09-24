#!/bin/bash
# After LOOKING at qa/beat-NN sheets: record approval of the exact source fingerprint.
set -euo pipefail
cd "$(dirname "$0")"
N=$(printf '%02d' "$1")
cp qa/beat-$N/review-source.json qa/beat-$N/approved.json && echo "approved beat $N"
