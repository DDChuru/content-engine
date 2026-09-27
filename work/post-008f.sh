#!/bin/bash
# 008f: after all beats rendered: stale check, finish (mux), verify, text-only (controls + run), encoded sheets, brand.
# Usage (from work/): ./post-008f.sh <lesson dir> <code>   → <lesson>/logs/post-008f.log ; stops at the first failure.
set -xeo pipefail
L=$1; C=$2
cd "$(dirname "$0")/$L"
node stale.cjs | tail -1
python3 finish.py
python3 verify.py
node verify-text-only.cjs --controls | tail -3
node verify-text-only.cjs | tail -3
python3 encoded-sheets.py | tail -2
cd ..
python3 brand_final.py "$L" "$C"
echo POST-DONE
