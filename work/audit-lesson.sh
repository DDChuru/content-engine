#!/usr/bin/env bash
# 008f design-time: label audit of every beat of a lesson (step N frames), 4 in parallel. Usage: ./audit-lesson.sh <code> [step] [beats...]
L=$1; STEP=${2:-3}; shift 2 2>/dev/null
cd "$(dirname "$0")/$L" && node build.cjs >/dev/null || exit 1
BEATS="$@"; [ -z "$BEATS" ] && BEATS=$(python3 -c "import json;print(' '.join(str(s['id']) for s in json.load(open('timeline.json'))['scenes']))")
mkdir -p tmp/la; printf '%s\n' $BEATS | xargs -P 4 -I{} sh -c "node label-audit-beat.cjs {} $STEP > tmp/la/b{}.txt 2>&1"
for b in $BEATS; do cat tmp/la/b$b.txt; done
