#!/usr/bin/env python3
"""Generate Multiple Collisions narration with exact inserted-silence holds."""
import concurrent.futures, hashlib, json, os, re, subprocess, sys
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[4]
WORK=Path('/tmp/verify-collisions-narration'); WORK.mkdir(exist_ok=True)
AUDIO=ROOT/'packages/backend/src/remotion/public/audio/mechanics'
SAMPLE_RATE=44100

def scenes():
    source=(ROOT/'packages/backend/projects/mechanics-multiple-collisions/STORYBOARD.md').read_text()
    result=[]
    for section in re.split(r'(?=^## S\d\d)',source,flags=re.M)[1:]:
        section=section.split('## Handoff')[0]
        paragraphs=[]
        for line in section.splitlines():
            if line.startswith('**Narration:**'):
                paragraphs.extend(re.findall('“([^”]+)”',line))
            elif re.match(r'\| \d\d–\d\d s \|',line):
                paragraphs.extend(re.findall('“([^”]+)”',line.split('|')[2]))
        result.append(dict(id=re.search(r'## (S\d\d)',section)[1].lower(),
            tempo=re.search(r'^tempo: (\w+)',section,re.M)[1],
            voiceSpeed=float(re.search(r'^voiceSpeed: ([\d.]+)',section,re.M)[1]),
            budget=int(re.search(r'\*\*Duration:\*\* (\d+)',section)[1]),paragraphs=paragraphs))
    return result

def run(scene):
    subprocess.run([sys.executable,__file__,scene['id']],check=True,env={**os.environ,'TTS_PROVIDER':'elevenlabs','ELEVENLABS_SPEED':str(scene['voiceSpeed'])})
    return json.loads((WORK/f"{scene['id']}.json").read_text())

def generate(scene):
    os.environ["TTS_PROVIDER"] = "elevenlabs"
    os.environ["ELEVENLABS_SPEED"] = str(scene["voiceSpeed"])
    sys.path.insert(0,str(ROOT/'packages/backend/src/chatterbox'))
    from narration_client import generate_narration
    chunks=[]; beats=[]; holds=[]; position=0; count=0
    def silence(seconds,kind):
        nonlocal position
        count_samples=round(seconds*SAMPLE_RATE)
        if kind in ('hold','pause'):
            holds.append(dict(kind=kind,start=position/SAMPLE_RATE,end=(position+count_samples)/SAMPLE_RATE,duration=seconds))
        chunks.append(np.zeros(count_samples,dtype=np.int16)); position+=count_samples
    # Incoming transition is silent; the first spoken cue remains fully visible.
    silence(0.55,'lead')
    for paragraph in scene['paragraphs']:
        for part in re.split(r'(\[(?:hold|pause) \d+(?:\.\d+)? s\]|\.\.\.)',paragraph):
            if not part.strip(): continue
            match=re.fullmatch(r'\[(hold|pause) (\d+(?:\.\d+)?) s\]',part)
            if match:
                silence(float(match[2]),match[1]); continue
            if part=='...':
                silence(0.35,'breath'); continue
            count+=1
            cache_key = f"elevenlabs|gYWKdgLtqjPO3D5uDrDP|{scene['voiceSpeed']}|{part.strip()}"
            target=WORK/f"{scene['id']}-{count:02d}-{hashlib.sha256(cache_key.encode()).hexdigest()[:10]}.mp3"
            if not target.exists():
                generate_narration(part.strip(),voice_id='gYWKdgLtqjPO3D5uDrDP',output_filename=str(target))
            pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(target),'-f','s16le','-ac','1','-ar',str(SAMPLE_RATE),'-'])
            values=np.frombuffer(pcm,dtype=np.int16).copy()
            # Trim provider padding only, preserving all spoken samples and 60 ms margins.
            step=441
            windows=[np.sqrt(np.mean(values[i:i+step].astype(float)**2)) for i in range(0,len(values),step)]
            active=np.flatnonzero(np.array(windows)>70)
            if not len(active): raise RuntimeError('Silent TTS response')
            begin=max(0,int(active[0])*step-2646); end=min(len(values),(int(active[-1])+1)*step+2646)
            values=values[begin:end]
            beats.append(dict(text=part.strip(),start=position/SAMPLE_RATE,end=(position+len(values))/SAMPLE_RATE))
            chunks.append(values); position+=len(values)
        silence(0.15,'breath')
    silence(max(0.3,scene['budget']-position/SAMPLE_RATE),'tail')
    target=AUDIO/f"multiple-collisions-{scene['id']}.mp3"
    subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ac','1','-ar',str(SAMPLE_RATE),'-i','-','-codec:a','libmp3lame','-b:a','128k',str(target)],input=np.concatenate(chunks).tobytes(),check=True)
    data={**scene,'audio':target.name,'audioSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'voiceId':'gYWKdgLtqjPO3D5uDrDP','provider':'elevenlabs','beats':beats,'holds':holds,'sampleDuration':position/SAMPLE_RATE}
    (WORK/f"{scene['id']}.json").write_text(json.dumps(data,indent=2)+'\n')
    print(scene['id'],round(position/SAMPLE_RATE,3),'seconds',flush=True)

if __name__=='__main__':
    jobs=scenes()
    if len(sys.argv)>1:
        generate(next(s for s in jobs if s['id']==sys.argv[1]))
    else:
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            result=list(executor.map(run,jobs))
        (WORK/'timing.json').write_text(json.dumps(result,indent=2)+'\n')
        print('TOTAL',sum(s['sampleDuration'] for s in result))
