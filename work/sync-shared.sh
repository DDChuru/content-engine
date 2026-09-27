#!/usr/bin/env bash
# 008f: re-copy work/t4-shared/*.tsx|ts byte for byte into every lesson's src/ that already uses it, and the canonical
# label-audit tooling (work/t4-tools/) into the lessons still being built. 4.1.1-2 is finished: its tools stay as
# rendered (its beats passed the later border rule too: 4.1.1-2/qa/label-audit-v2-design-check.txt). Run from work/.
set -e
for l in 4.1.1-2 4.1.3 4.1.4 4.2.1a; do
  for f in t4-shared/*.tsx t4-shared/*.ts; do b=$(basename $f); [ -f $l/src/$b ] && cp $f $l/src/$b; done
done
for l in 4.1.3 4.1.4 4.2.1a; do cp t4-tools/label-audit.cjs t4-tools/label-audit-beat.cjs $l/; done
echo synced
