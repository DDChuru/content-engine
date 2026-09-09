#!/usr/bin/env python3
"""Local, beat-isolated Whisper transcription; no estimated/fallback cue times."""
import hashlib, json, re, subprocess
from pathlib import Path
from datetime import datetime, timezone
import numpy as np
from faster_whisper import WhisperModel
ROOT = Path(__file__).resolve().parents[4]
PROJECT = ROOT/'packages/backend/projects/mechanics-equilibrium-in-1d'
AUDIO = ROOT/'packages/backend/src/remotion/public/audio/mechanics'
OUT = ROOT/'packages/backend/src/remotion/public/transcripts/mechanics/equilibrium-in-1d.json'
WORK = Path('/tmp/verify-equilibrium-narration')
# A cue is (phrase, occurrence). Every start and end is a local Whisper word edge.
CUES = {
's01': {'quote1':'use the principle', 'quote2':'the vector sum', 'outcomes':'by the end', 'o1':'find the resultant', 'o2':'balance forces', 'o3':'explain why'},
's02': {'positive':'choose right', 'fifty':'fifty newtons', 'twenty':'twenty newtons', 'formula':'resultant equals right minus left', 'substitute':'fifty minus twenty', 'thirty':'thirty newtons', 'separate':'draw that resultant separately', 'forty':'forty newtons', 'zero':'zero newtons', 'equilibrium':'this is equilibrium'},
's03': {'up':'pulled upward', 'down':'another force', 'balance':'balance', 'goal':'we will find', 'draw':'draw the problem'},
's04': {'problem':'the object is in equilibrium', 'find':'find x', 'resultant':'the magnitude of the resultant force', 'ten':'ten newtons', 'eighteen':'eighteen plus x newtons', 'five':'five x newtons', 'units':'already in newtons', 'positive':'take upward as positive', 'write':'write the balance'},
's05': {'principle':'resultant equals zero', 'symbols':'u minus d equals zero', 'equal':'u equals d', 'meaning':'total upward force equals total downward force', 'equation':'ten plus', 'eighteen':'eighteen plus x', 'five':'five x', 'collect':'twenty eight plus x equals five x', 'subtract':'subtract x', 'four':'twenty eight equals four x', 'divide':'divide by four', 'seven':'x equals seven', 'check':'the upward forces are now', 'checkten':'ten and', 'twentyfive':'twenty five newtons', 'up35':'together thirty five', 'down35':'also thirty five newtons', 'zero':'the resultant is zero newtons', 'whatif':'what if', 'increase':'downward pull increased', 'unbalanced':'no longer balance'},
's06': {'mass':'mass', 'formula':'weight equals mass times g', 'symbols':'w equals m g', 'kg':'kilograms', 'down':'weight acts downward', 'g':'use g equals ten', 'ten':'ten metres per second squared', 'already':'already gave forces'},
's07': {'zero':'zero', 'question':'must the object be at rest', 'answer':'no', 'moving':'constant velocity', 'rest':'an object already at rest', 'o1':'find the resultant', 'o2':'balance forces', 'o3':'explain why'},
}
# Each entry is a word-resolved ring on the named diagram or ink figure.
FIGURES = {
's02': [('fifty','fifty','right'),('twenty','twenty','left'),('sub50',('fifty',2),'right'),('sub20',('twenty',2),'left'),('thirty','thirty','answer30'),('forty','forty','pair40'),('zero','zero','answer0')],
's04': [('ten','ten','up10'),('eighteen','eighteen','up18'),('xup','x newtons','up18'),('five','five','down5'),('xdown',('x newtons',2),'down5')],
's05': [('principle0',('zero',1),'principle'),('symbolU',('u',1),'upgroup'),('symbolD',('d',1),'downgroup'),('symbol0',('zero',2),'symbols'),('equalU',('u',2),'upgroup'),('equalD',('d',2),'downgroup'),('ten','ten','up10'),('eighteen','eighteen','up18'),('subx',('x',1),'up18'),('five',('five',1),'down5'),('sub5x',('x',2),'down5'),('collect28',('twenty eight',1),'collect'),('collectx',('x',3),'collect'),('collect5',('five',2),'down5'),('collect5x',('x',4),'down5'),('subtractx',('x',5),'collect'),('four28',('twenty eight',2),'four'),('four','four x','four'),('divide',('four',2),'four'),('seven','seven','seven'),('checkten',('ten',2),'up10'),('twentyfive','twenty five','up18'),('up35',('thirty five',1),'uptotal'),('down35',('thirty five',2),'downtotal'),('zero',('zero',3),'answer0')],
's06': [('m','mass times','mass'),('g','g','gravity'),('w','w equals','weight'),('mletter','m g','mass'),('gletter',('g',2),'gravity'),('ten','ten','gravity')],
's07': [('zero','zero','answer0')],
}
NUMBERS = {'0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','7':'seven','10':'ten','18':'eighteen','20':'twenty','25':'twenty five','28':'twenty eight','30':'thirty','35':'thirty five','40':'forty','50':'fifty'}
def normalize(value):
    value=re.sub(r'(\d)([a-zA-Z])',r'\1 \2',value.lower()).replace('-', ' ')
    value=re.sub(r'[^a-z0-9 ]','',value)
    return ' '.join(NUMBERS.get(w,w) for w in value.split()).replace('meters','metres')
def resolve(words, spec):
    phrase, occurrence = spec if isinstance(spec,(list,tuple)) else (spec,1)
    tokens=[]; indices=[]
    for i,w in enumerate(words):
        parts=normalize(w['word']).split(); tokens.extend(parts); indices.extend([i]*len(parts))
    search=normalize(phrase).split()
    matches=[i for i in range(len(tokens)-len(search)+1) if tokens[i:i+len(search)]==search]
    if len(matches)<occurrence: raise ValueError(f'Unresolved {spec}; transcript: '+ ' '.join(w['word'] for w in words))
    a=matches[occurrence-1]; first=indices[a]; last=indices[a+len(search)-1]
    return words[first]['start'], words[last]['end'], first

def main():
    timing=json.loads((WORK/'timing.json').read_text())
    model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=6)
    scenes=[]
    for s in timing:
        audio=AUDIO/s['audio']; digest=hashlib.sha256(audio.read_bytes()).hexdigest()
        assert digest==s['audioSha256']
        cache=WORK/f"{s['id']}-words.json"
        if cache.exists() and json.loads(cache.read_text())["sha256"]==digest:
            words=json.loads(cache.read_text())["words"]
        else:
            pcm=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(audio),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32)
            words=[]
            for beat in s['beats']:
                start=round(beat['start']*16000); end=round(beat['end']*16000)
                segments,_=model.transcribe(pcm[start:end],language='en',word_timestamps=True,beam_size=5,vad_filter=False,initial_prompt=beat['text'],condition_on_previous_text=False)
                for segment in segments:
                    for w in segment.words or []:
                        words.append({'word':w.word.strip(),'start':round(beat['start']+w.start,4),'end':round(min(beat['end'],beat['start']+w.end),4)})
            cache.write_text(json.dumps({'sha256':digest,'words':words},indent=2)+'\n')
        cues={}; edges={}
        for key,spec in CUES[s['id']].items():
            start,end,index=resolve(words,spec); cues[key]=start; edges[key]={'start':start,'end':end,'wordIndex':index}
        figures=[]
        for key,spec,target in FIGURES.get(s['id'],[]):
            start,end,index=resolve(words,spec)
            figures.append({'id':key,'target':target,'start':start,'end':end,'wordIndex':index,'word':words[index]['word']})
        duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(audio)],text=True))
        scenes.append({**s,'duration':duration,'words':words,'wordCount':len(words),'text':' '.join(w['word'] for w in words),'cues':cues,'cueEdges':edges,'figures':figures})
        print(s['id'],duration,'cues',len(cues),'figures',len(figures),flush=True)
    total=sum(s['duration'] for s in scenes)
    assert 210<=total<=270, total
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({'project':'mechanics-equilibrium-in-1d','engine':'faster-whisper-small (local, beat-isolated)','generatedAt':datetime.now(timezone.utc).isoformat(),'sceneCount':len(scenes),'totalDuration':total,'scenes':scenes},indent=2)+'\n')
    (PROJECT/'narration-timing.json').write_text(json.dumps(timing,indent=2)+'\n')
    print('All cues resolved. Total:',total)
if __name__=='__main__': main()
