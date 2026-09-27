#!/bin/bash
cd "$(dirname "$0")"
node verify-text-only.cjs --controls > logs/text-only-controls.out 2>&1; echo "controls exit $?" >> logs/post.out
node verify-text-only.cjs > logs/text-only.out 2>&1; echo "text-only exit $?" >> logs/post.out
python3 encoded-sheets.py > logs/encoded-sheets.out 2>&1; echo "sheets exit $?" >> logs/post.out
echo POST-DONE >> logs/post.out
