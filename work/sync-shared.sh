#!/usr/bin/env bash
# 008f: re-copy work/t4-shared/*.tsx|ts byte for byte into every lesson's src/ that already uses it (or all when -a),
# and the label-audit tooling from 4.1.1-2 into every lesson. Run from work/.
set -e
for l in 4.1.1-2 4.1.3 4.1.4 4.2.1a; do
  for f in t4-shared/*.tsx t4-shared/*.ts; do b=$(basename $f); [ -f $l/src/$b ] && cp $f $l/src/$b; done
  if [ $l != 4.1.1-2 ]; then cp 4.1.1-2/label-audit.cjs 4.1.1-2/label-audit-beat.cjs 4.1.1-2/render-beat.cjs 4.1.1-2/beat-fingerprint.cjs $l/; fi
done
echo synced
