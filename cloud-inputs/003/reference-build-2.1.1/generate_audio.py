"""One ElevenLabs file per beat. Frozen storyboard text; request-only normalisation of literals
the voice mangles (recorded in qa/audio-review.md). Existing audio is reused, never regenerated."""
from pathlib import Path
import os,json,subprocess,urllib.request,urllib.error,wave,hashlib,sys
P=Path(__file__).resolve().parent
VOICE='BcpjRWrYhDBHmOnetmBl'
SETTINGS=dict(stability=.5,similarity_boost=.75,style=0.,use_speaker_boost=True,speed=1.)
# Request-only substitutions. Never applied to the storyboard or to cue phrases.
REQUEST_NORMALISE=[('copper(II)','copper two'),('biuret','bye-yoo-ret')]
def request_text(t):
    for a,b in REQUEST_NORMALISE: t=t.replace(a,b)
    return t
selected={int(x) for x in sys.argv[1:]}
for b in json.loads((P/'script.json').read_text()):
    if selected and b['id'] not in selected: continue
    stem=P/'audio'/f"beat-{b['id']:02d}"
    body=dict(text=request_text(b['text']),model_id='eleven_multilingual_v2',voice_settings=SETTINGS)
    reqpath=stem.with_suffix('.request.json');mp3=stem.with_suffix('.mp3');wav=stem.with_suffix('.wav')
    if mp3.exists():
        assert json.loads(reqpath.read_text())==body,'Existing audio has a different request'
    else:
        reqpath.write_text(json.dumps(body,ensure_ascii=False,indent=2)+'\n')
        request=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128',data=json.dumps(body).encode(),headers={'xi-api-key':os.environ['ELEVENLABS_API_KEY'],'Content-Type':'application/json','Accept':'audio/mpeg'},method='POST')
        for attempt in range(3):
            try:
                with urllib.request.urlopen(request,timeout=300) as response:
                    assert 'audio' in response.headers.get('Content-Type','')
                    data=response.read()
                    stem.with_suffix('.receipt.json').write_text(json.dumps({'request_id':response.headers.get('request-id'),'bytes':len(data),'voice_id':VOICE,'model_id':body['model_id'],'speed':1.0},indent=2))
                break
            except urllib.error.HTTPError as exc:
                raise RuntimeError(f'ElevenLabs HTTP {exc.code}; credential and response body omitted') from None
            except Exception as exc:
                if attempt==2: raise
                print('retry',b['id'],type(exc).__name__,flush=True)
        mp3.write_bytes(data)
    if not wav.exists():
        temp=stem.with_suffix('.partial.wav')
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(mp3),'-ar','48000','-ac','1','-c:a','pcm_s16le',str(temp)],check=True)
        temp.rename(wav)
    with wave.open(str(wav)) as f: seconds=f.getnframes()/f.getframerate();frames=f.getnframes()
    row=dict(id=b['id'],words=b['words'],seconds=seconds,samples=frames,wpm=b['words']/seconds*60,voice_id=VOICE,model_id=body['model_id'],settings=SETTINGS,sample_rate=48000,time_stretched=False,requestDiffers=body['text']!=b['text'],mp3_sha256=hashlib.sha256(mp3.read_bytes()).hexdigest())
    stem.with_suffix('.measure.json').write_text(json.dumps(row,indent=2)+'\n')
    print(f"Beat {b['id']:02d}: {seconds:.3f}s, {row['wpm']:.2f} wpm",flush=True)
