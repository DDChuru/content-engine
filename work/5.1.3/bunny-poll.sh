#!/bin/bash
# Poll the review upload every 60 s until status 4 (availableResolutions null = NOT YET, not failed).
# CLOUD: no AccessKey header (credential injected by the environment). A failed curl or a non-2xx response exits
# non-zero without writing the -final.json record.
set -uo pipefail
cd "$(dirname "$0")"; G=$1; LOG=${2:-logs/bunny-poll.txt}; mkdir -p "$(dirname "$LOG")"; : > "$LOG"
while true; do
  rc=0; R=$(curl -sS -w '\n%{http_code}' "https://video.bunnycdn.com/library/$BUNNY_BIO_LIBRARY_ID/videos/$G") || rc=$?
  HTTP=${R##*$'\n'}; R=${R%$'\n'*}
  if [ "$rc" -ne 0 ] || [[ "$HTTP" != 2* ]]; then echo "$(date -u +%FT%TZ) POLL FAILED: curl exit $rc, HTTP ${HTTP:-none}" | tee -a "$LOG" >&2; exit 1; fi
  L=$(echo "$R" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['status'],d.get('encodeProgress'),d.get('availableResolutions'),round(d.get('length',0)),repr(d.get('collectionId')))")
  echo "$(date -u +%FT%TZ) status/encode%/resolutions/length/collection: $L" | tee -a "$LOG"
  case "$L" in 4\ *) echo "$R" > "${LOG%.txt}-final.json"; break;; 5\ *|6\ *) echo FAILED; exit 1;; esac
  sleep 60
done
