"""Record the ElevenLabs character counter (account-wide: other builders share it). Usage: el_usage.py LABEL"""
import json,sys,urllib.request,datetime
from pathlib import Path
import os
P=Path(__file__).resolve().parent
r=urllib.request.Request('https://api.elevenlabs.io/v1/user')   # CLOUD: credential injected by the environment, no header
sub=json.load(urllib.request.urlopen(r,timeout=60))['subscription']
row={'label':sys.argv[1],'utc':datetime.datetime.utcnow().isoformat(timespec='seconds')+'Z','character_count':sub['character_count'],'character_limit':sub['character_limit']}
with open(P/'qa/elevenlabs-usage.jsonl','a') as f: f.write(json.dumps(row)+'\n')
print(row)
