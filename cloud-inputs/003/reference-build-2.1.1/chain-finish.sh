#!/bin/bash
# Detached chain: wait for beats 1,4,7 → re-render remaining stale beats (9,11,15,18) → finish → verify → sheets.
set -uo pipefail
cd /home/dachu/sme-9700-archive/topic-02/2.1.1
for b in 01 04 07; do while [ ! -f render-cache/beat-$b/complete.json ]; do
  [ -f render-cache/beat-$b/render.lock ] && ! ps -p "$(cat render-cache/beat-$b/render.lock)" >/dev/null && { echo "beat $b render died"; exit 1; }
  sleep 10; done; done
echo "1,4,7 complete $(date)"
./rerender-stale.sh
node -e "const fp=require('./beat-fingerprint.cjs'),fs=require('fs');for(let i=1;i<=20;i++){const f='./render-cache/beat-'+String(i).padStart(2,'0')+'/complete.json';if(!fs.existsSync(f)||require(f).sourceHash!==fp(i)){console.error('beat',i,'not current');process.exit(1)}}console.log('all 20 current')" || exit 1
nice -n 10 python3 finish.py || exit 1
/home/dachu/miniconda3/envs/aitools/bin/python verify.py > logs/verify.log 2>&1 || { echo VERIFY FAILED; exit 1; }
/home/dachu/miniconda3/envs/aitools/bin/python encoded-sheets.py
echo "CHAIN DONE $(date)"
