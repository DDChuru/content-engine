#!/usr/bin/env python3
"""Local, beat-isolated Whisper transcription; no estimated/fallback cue times."""
import hashlib, json, re, subprocess
from pathlib import Path
from datetime import datetime, timezone
import numpy as np
from faster_whisper import WhisperModel
ROOT = Path(__file__).resolve().parents[4]
PROJECT = ROOT/'packages/backend/projects/mechanics-force-diagrams'
AUDIO = ROOT/'packages/backend/src/remotion/public/audio/mechanics'
OUT = ROOT/'packages/backend/src/remotion/public/transcripts/mechanics/force-diagrams.json'
WORK = Path('/tmp/verify-force-diagrams-narration')
# A cue is (phrase, occurrence). Every start and end is a local Whisper word edge.
CUES = {
's01': {'quote':'identify', 'outcomes':'by the end','o1':'choose the forces','o2':'draw and label','o3':'check changed'},
's02': {'story':'a string','question':'which forces','particle':'draw arrows','formula':'weight equals','weight':'draw weight','reaction':'the normal reaction','tension':'tension pulls','length':'length roughly','whatif':'what if','rough':'friction opposes'},
's03': {'story':'a body','angle30':'thirty','angle45':'forty five','question':'which forces','weight':'weight acts','left':'left tension','right':'right tension','contact':'no surface','remember':'questions will','whatif':'what if','single':'draw one'},
's04': {'story':'a car','question':'which forces','weight':'weight acts','reaction':'the normal reaction','drive':'driving force','air':'air resistance','steady':'at steady','positive':'take right','brakeStory':'now brake','remove':'remove the driving','brake':'add braking','double':'braking includes','acceleration':'draw acceleration','negative':'it is negative'},
's05': {'story':'a block','angle':'thirty degree','release':'the push ends','question':'which forces','weight':'weight acts','reaction':'the normal reaction','friction':'friction points','push':'there is no','positive':'choose uphill','acceleration':'draw acceleration','whatif':'what if','smooth':'remove friction','keepweight':'keep weight','keepreaction':('normal reaction',2)},
's06': {'story':'two particles','first':'one slides','second':'one descends','string':'a light','pulley':'smooth light pulley','question':'which forces','firstdiagram':'table particle','weight1':('weight down',1),'reaction':'normal reaction','tension1':'tension right','seconddiagram':'hanging particle','weight2':('weight down',2),'tension2':'tension up','equal':'equal tension','acceleration':'equal accelerations','isolate':'isolate the pulley','light':'light means','left':'tension pulls left','down':'tension pulls down','support':'the support reaction','whatif':'what if','rough':'add friction'},
's07': {'story':'a car','rod':'light rod','question':'which connector','trailerT':'tension pulls','carT':'and the car left','brakeStory':'now the car','thrust':'thrust pushes','carThrust':'and the car right','compression':'thrust means','whatif':'what if','string':'a string cannot'},
's08': {'story':'your turn','angle':'thirty degree','question':'complete its force','weight':'weight points','reaction':'normal reaction','friction':'friction points','push':'no continuing','o1':'choose the forces','o2':'draw and label','o3':'check changed'},
}
FIGURES = {
's02': [('weight','draw weight','weight'),('mg','m g','weight'),('reaction','normal reaction','reaction'),('tension','tension pulls','tension'),('friction','friction opposes','friction')],
's03': [('angle30','thirty','angle30'),('angle45','forty five','angle45'),('weight','weight acts','weight'),('left','left tension','left'),('right','right tension','right'),('single','upward tension','single')],
's04': [('weight','weight acts','weight'),('reaction','normal reaction','reaction'),('drive','driving force','drive'),('air',('air resistance',1),'air'),('brake','braking force','brake'),('air2',('air resistance',2),'air'),('acceleration','acceleration separately','acceleration'),('positive','take right','positive'),('negative','it is negative','acceleration')],
's05': [('angle','thirty degree','angle'),('weight','weight acts','weight'),('reaction',('normal reaction',1),'reaction'),('friction','friction points','friction'),('acceleration','acceleration separately','acceleration'),('weight2','keep weight','weight'),('reaction2',('normal reaction',2),'reaction'),('positive','choose uphill','positive'),('negative','negative while','acceleration')],
's06': [('first','one slides','mass1'),('second','one descends','mass2'),('weight1',('weight down',1),'weight1'),('reaction','normal reaction','reaction'),('tension1','tension right','tension1'),('weight2',('weight down',2),'weight2'),('tension2','tension up','tension2'),('equal','equal tension','tension1'),('equal2','equal tension','tension2'),('a1',('right',3),'a1'),('a2',('down',3),'a2'),('string','a light inextensible string','string'),('pulley','isolate the pulley','pulley'),('light','light means massless','light'),('left','tension pulls left','left'),('down','tension pulls down','down'),('support','support reaction','support'),('rough','friction left','friction')],
's07': [('rod','light rod','rod'),('trailerT','tension pulls','trailerT'),('carT','car left','carT'),('thrust','thrust pushes','trailerThrust'),('carThrust','car right','carThrust'),('compression','thrust means','trailerThrust')],
's08': [('angle','thirty degree','angle'),('weight','weight points','weight'),('reaction','normal reaction','reaction'),('friction','friction points','friction')],
}
NUMBERS = {'0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','7':'seven','10':'ten','18':'eighteen','20':'twenty','25':'twenty five','28':'twenty eight','30':'thirty','35':'thirty five','40':'forty','50':'fifty','30':'thirty','45':'forty five'}
def normalize(value):
    value=re.sub(r'(\d)([a-zA-Z])',r'\1 \2',value.lower()).replace('-', ' ')
    value=re.sub(r'[^a-z0-9 ]','',value)
    return ' '.join(NUMBERS.get(w,w) for w in value.split()).replace('meters','metres').replace('mg','m g')
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
            print(s['id'], 'transcribed', len(words), 'words', flush=True)
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
    assert 300<=total<=360, total
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({'project':'mechanics-force-diagrams','engine':'faster-whisper-small (local, beat-isolated)','generatedAt':datetime.now(timezone.utc).isoformat(),'sceneCount':len(scenes),'totalDuration':total,'scenes':scenes},indent=2)+'\n')
    (PROJECT/'narration-timing.json').write_text(json.dumps(timing,indent=2)+'\n')
    print('All cues resolved. Total:',total)
if __name__=='__main__': main()
