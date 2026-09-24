#!/bin/bash
# After LOOKING at qa/beat-NN sheets: record approval of the exact source fingerprint.
set -euo pipefail
cd /home/dachu/sme-9700-archive/topic-02/2.1.1
N=$(printf '%02d' "$1")
cp qa/beat-$N/review-source.json qa/beat-$N/approved.json && echo "approved beat $N"
