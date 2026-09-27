#!/bin/bash
cd "$(dirname "$0")"
python3 finish.py > logs/finish.out 2>&1; echo "finish exit $?" >> logs/post.out
python3 verify.py > logs/verify.out 2>&1; echo "verify exit $?" >> logs/post.out
node verify-text-only.cjs --controls > logs/text-only-controls.out 2>&1; echo "controls exit $?" >> logs/post.out
node verify-text-only.cjs > logs/text-only.out 2>&1; echo "text-only exit $?" >> logs/post.out
python3 encoded-sheets.py > logs/encoded-sheets.out 2>&1; echo "sheets exit $?" >> logs/post.out
echo POST-DONE >> logs/post.out
