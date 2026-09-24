#!/bin/bash
# Poll the review upload every 60 s until status 4 (availableResolutions null = NOT YET, not failed).
cd "$(dirname "$0")"; G=$1; : > logs/bunny-poll.txt
while true; do
  R=$(curl -sS "https://video.bunnycdn.com/library/$BUNNY_BIO_LIBRARY_ID/videos/$G")
  L=$(echo "$R" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['status'],d.get('encodeProgress'),d.get('availableResolutions'),round(d.get('length',0)),repr(d.get('collectionId')))")
  echo "$(date -u +%FT%TZ) status/encode%/resolutions/length/collection: $L" | tee -a logs/bunny-poll.txt
  case "$L" in 4\ *) echo "$R" > logs/bunny-final.json; break;; 5\ *|6\ *) echo FAILED; break;; esac
  sleep 60
done
