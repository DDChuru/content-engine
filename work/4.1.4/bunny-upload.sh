#!/bin/bash
# Usage: ./bunny-upload.sh <branded.mp4> "<title>"  — create the video (NO collection), PUT the file with
# curl -T, record the guid. CLOUD: NO AccessKey header — the environment injects the Bunny library credential into
# requests to video.bunnycdn.com; the session never sees it. A failed curl or a non-2xx status exits
# non-zero; logs/bunny-upload-end.txt (the "uploaded at" record) is written ONLY after a 2xx PUT.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p logs
F="$1"; TITLE="$2"; LIB="$BUNNY_BIO_LIBRARY_ID"
BODY=$(python3 -c 'import json,sys;print(json.dumps({"title":sys.argv[1]}))' "$TITLE")
rc=0; HTTP=$(curl -sS -o logs/bunny-create-response.json -w '%{http_code}' -X POST -H "Content-Type: application/json" -d "$BODY" "https://video.bunnycdn.com/library/$LIB/videos") || rc=$?
if [ "$rc" -ne 0 ] || [[ "$HTTP" != 2* ]]; then echo "CREATE FAILED: curl exit $rc, HTTP ${HTTP:-none}" >&2; exit 1; fi
G=$(python3 -c "import json;print(json.load(open('logs/bunny-create-response.json'))['guid'])")
python3 -c "import json;d=json.load(open('logs/bunny-create-response.json'));print(json.dumps({k:d.get(k) for k in ['guid','title','collectionId','videoLibraryId','dateUploaded']}))" > logs/bunny-create.json
echo "created $G"
date -u +%FT%TZ > logs/bunny-upload-start.txt
rc=0; HTTP=$(curl -sS -o logs/bunny-put.json -w '%{http_code}' -T "$F" "https://video.bunnycdn.com/library/$LIB/videos/$G") || rc=$?
if [ "$rc" -ne 0 ] || [[ "$HTTP" != 2* ]]; then echo "UPLOAD FAILED: curl exit $rc, HTTP ${HTTP:-none} (nothing recorded as uploaded)" >&2; exit 1; fi
date -u +%FT%TZ > logs/bunny-upload-end.txt
echo "uploaded HTTP $HTTP"
