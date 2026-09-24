#!/bin/bash
# Re-render every beat whose complete.json fingerprint differs from current source (shared-component
# changes after render). Old chunks are kept under render-cache/superseded/. 4 renders at a time.
set -uo pipefail
cd "$(dirname "$0")"
node build.cjs
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p render-cache/superseded
STALE=$(node -e "const fp=require('./beat-fingerprint.cjs'),fs=require('fs');const o=[];for(let i=1;i<=17;i++){const f='./render-cache/beat-'+String(i).padStart(2,'0')+'/complete.json';if(fs.existsSync(f)&&require(f).sourceHash!==fp(i))o.push(i);}console.log(o.join(' '))")
echo "stale: $STALE"
for i in $STALE; do
  N=$(printf '%02d' $i)
  node qa-beat.cjs $i > /dev/null && cp qa/beat-$N/review-source.json qa/beat-$N/approved.json
  mv render-cache/beat-$N render-cache/superseded/beat-$N-$STAMP
done
echo $STALE | tr ' ' '\n' | xargs -P 4 -I{} sh -c 'nice -n 10 node render-beat.cjs {} > logs/rerender-beat-{}.log 2>&1; echo "beat {} exit $?"'
echo "RERENDER DONE"
