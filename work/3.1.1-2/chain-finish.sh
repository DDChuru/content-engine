#!/bin/bash
# Detached chain: re-render stale → check all current → finish → verify → encoded sheets. Ends "CHAIN DONE".
set -uo pipefail
cd "$(dirname "$0")"
./rerender-stale.sh || { echo "RERENDER FAILED"; exit 1; }
node -e "const fp=require('./beat-fingerprint.cjs'),fs=require('fs');for(let i=1;i<=18;i++){const f='./render-cache/beat-'+String(i).padStart(2,'0')+'/complete.json';if(!fs.existsSync(f)||require(f).sourceHash!==fp(i)){console.error('beat',i,'not current');process.exit(1)}}console.log('all 18 current')" || exit 1
nice -n 10 python3 finish.py || { echo "FINISH FAILED"; exit 1; }
python3 verify.py > logs/verify.log 2>&1 || { echo "VERIFY FAILED"; tail -5 logs/verify.log; exit 1; }
python3 encoded-sheets.py
echo "CHAIN DONE $(date -u +%FT%TZ)"
