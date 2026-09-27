"""Run 009g (RULE-MEMORY-HOOKS): re-voice ONLY the Beat 4 hook sentences, as one request with the lesson's exact TTS
settings (Thandi, eleven_multilingual_v2, speed 1.0; no key header — the environment injects the credential). Writes
audio/beat-04.hook.mp3 + .hook.request.json + .hook.receipt.json. Never re-requests if the mp3 exists."""
from pathlib import Path
import json,urllib.request
P=Path(__file__).resolve().parent
VOICE='BcpjRWrYhDBHmOnetmBl'
SETTINGS=dict(stability=.5,similarity_boost=.75,style=0.,use_speaker_boost=True,speed=1.)
HOOK=("Think of it as copy, then share one of each. Copy: replication in the S phase, which makes two identical sister "
      "chromatids of every chromosome. Share one of each: separation in anaphase, when the sister chromatids of every "
      "chromosome go to opposite poles.")
A=P/'audio';mp3=A/'beat-04.hook.mp3';REQ=A/'beat-04.hook.request.json';REC=A/'beat-04.hook.receipt.json'
body=dict(text=HOOK,model_id='eleven_multilingual_v2',voice_settings=SETTINGS)
if mp3.exists(): assert json.loads(REQ.read_text())==body; print('exists')
else:
    req=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','Accept':'audio/mpeg'},method='POST')
    with urllib.request.urlopen(req,timeout=300) as r: assert 'audio' in r.headers.get('Content-Type',''); data=r.read(); rid=r.headers.get('request-id')
    REQ.write_text(json.dumps(body,ensure_ascii=False,indent=2)+'\n')
    REC.write_text(json.dumps({'request_id':rid,'bytes':len(data),'voice_id':VOICE,'model_id':'eleven_multilingual_v2','speed':1.0,'chars':len(HOOK)},indent=2))
    mp3.write_bytes(data); print('generated',len(HOOK),'chars')
