#!/bin/bash
# Re-render every beat whose complete.json fingerprint differs from current source (or is missing), 4 at a time.
# Approvals must already be current (qa/beat-NN/approved.json == fingerprint), i.e. every beat was LOOKED at.
set -uo pipefail
cd "$(dirname "$0")"
node build.cjs
STAMP=$(date +%Y%m%d-%H%M%S); mkdir -p render-cache/superseded logs
TODO=$(node -e "const fp=require('./beat-fingerprint.cjs'),fs=require('fs');const o=[];for(let i=1;i<=18;i++){const n=String(i).padStart(2,'0'),f='./render-cache/beat-'+n+'/complete.json',a='./qa/beat-'+n+'/approved.json';if(!fs.existsSync(a)||require(a).sourceHash!==fp(i)){console.error('beat '+i+' approval not current');process.exit(3)}if(!fs.existsSync(f)||require(f).sourceHash!==fp(i))o.push(i);}console.log(o.join(' '))") || exit 3
echo "to render: $TODO"
for i in $TODO; do N=$(printf '%02d' $i); [ -d render-cache/beat-$N ] && mv render-cache/beat-$N render-cache/superseded/beat-$N-$STAMP; done
echo $TODO | tr ' ' '\n' | xargs -P 4 -I{} sh -c 'nice -n 10 node render-beat.cjs {} > logs/render-beat-$(printf %02d {}).log 2>&1; echo "beat {} exit $?"'
echo "RERENDER DONE"
