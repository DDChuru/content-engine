#!/usr/bin/env bash
# 008f: re-copy work/t4-shared/*.tsx|ts byte for byte into the src/ of the NAMED lessons (only files they already use),
# and the canonical label-audit tooling (work/t4-tools/) into them. Never name a lesson that is rendering or finished:
# its fingerprints would change. Usage (from work/): ./sync-shared.sh 4.1.4 4.2.1a
set -e
[ $# -gt 0 ] || { echo "name the lessons"; exit 1; }
for l in "$@"; do
  for f in t4-shared/*.tsx t4-shared/*.ts; do b=$(basename $f); [ -f $l/src/$b ] && cp $f $l/src/$b; done
  cp t4-tools/label-audit.cjs t4-tools/label-audit-beat.cjs $l/
done
echo "synced $*"
