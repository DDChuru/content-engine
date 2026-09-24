"""Short ElevenLabs probes for a respelling, transcribed by faster-whisper medium (no prompt).
Usage: pron_test.py name 'text1' 'text2' ... Output qa/pron-tests/<name>-<n>.mp3 + results.json."""
import json,sys,urllib.request,subprocess
from pathlib import Path
from faster_whisper import WhisperModel
P=Path(__file__).resolve().parent;D=P/'qa/pron-tests'
name=sys.argv[1];texts=sys.argv[2:]
m=WhisperModel('medium',device='cpu',compute_type='int8',cpu_threads=4)
res=json.loads((D/'results.json').read_text()) if (D/'results.json').exists() else []
for i,t in enumerate(texts):
    body=dict(text=t,model_id='eleven_multilingual_v2',voice_settings=dict(stability=.5,similarity_boost=.75,style=0.,use_speaker_boost=True,speed=1.))
    r=urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/BcpjRWrYhDBHmOnetmBl?output_format=mp3_44100_128',data=json.dumps(body).encode(),headers={'Content-Type':'application/json'},method='POST')
    f=D/f'{name}-{i}.mp3';f.write_bytes(urllib.request.urlopen(r,timeout=120).read())
    segs,_=m.transcribe(str(f),language='en',beam_size=5,condition_on_previous_text=False,temperature=0.0)
    heard=' '.join(s.text.strip() for s in segs)
    res.append(dict(probe=name,text=t,heard=heard,chars=len(t)));print(repr(t),'->',heard,flush=True)
(D/'results.json').write_text(json.dumps(res,indent=1))
