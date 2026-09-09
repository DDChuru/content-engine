#!/usr/bin/env python3
"""Verify delivered audio, actual silent holds and word-bound visual cues."""
import hashlib, json, math, subprocess, difflib, importlib.util
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[4]
PROJECT=ROOT/'packages/backend/projects/mechanics-force-diagrams'
T=ROOT/'packages/backend/src/remotion/public/transcripts/mechanics/force-diagrams.json'
A=ROOT/'packages/backend/src/remotion/public/audio/mechanics'
def main():
    data=json.loads(T.read_text()); total=0; rows=[]
    spec=importlib.util.spec_from_file_location('force_transcribe',Path(__file__).with_name('transcribe-mechanics-force-diagrams-local.py'))
    module=importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    for s in data['scenes']:
        audio=A/s['audio']; assert hashlib.sha256(audio.read_bytes()).hexdigest()==s['audioSha256']
        assert s['voiceId']=='gYWKdgLtqjPO3D5uDrDP'
        assert s['voiceSpeed']==(.9 if s['tempo']=='slow' else 1)
        pcm=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(audio),'-f','s16le','-ac','1','-ar','44100','-']),dtype=np.int16)
        holds=[]
        for h in s['holds']:
            v=pcm[round((h['start']+.08)*44100):round((h['end']-.08)*44100)].astype(float)
            rms=float(np.sqrt(np.mean(v*v))); assert rms<3,(s['id'],h,rms)
            assert not any(w['start']>h['start']+.1 and w['end']<h['end']-.1 for w in s['words'])
            holds.append({**h,'rms':rms})
        for k,c in s['cues'].items():
            assert 0<=c<s['duration']
            assert any(abs(c-w['start'])<.001 for w in s['words']), (s['id'],k)
        for f in s['figures']:
            assert f['start']==s['words'][f['wordIndex']]['start']
        expected=module.normalize(' '.join(b['text'] for b in s['beats'])).split()
        actual=module.normalize(' '.join(w['word'] for w in s['words'])).split()
        differences=[{'kind':tag,'script':' '.join(expected[a:b]),'whisper':' '.join(actual[c:d])} for tag,a,b,c,d in difflib.SequenceMatcher(None,expected,actual).get_opcodes() if tag!='equal']
        assert not any(d['kind'] in ('delete','replace') for d in differences), (s['id'],differences)
        total+=s['duration']
        rows.append({'scene':s['id'],'duration':s['duration'],'words':len(s['words']),'cues':len(s['cues']),'figures':len(s['figures']),'holds':holds,'recognitionDifferences':differences})
    assert 300<=total<=360
    assert sum(45<=s['duration']<=75 and s['tempo']=='slow' for s in data['scenes'])>=2
    assert any(h['kind']=='hold' and h['duration']>=3 for h in data['scenes'][-1]['holds'])
    report={'passed':True,'durationSeconds':total,'frames30fps':sum(math.ceil(s['duration']*30) for s in data['scenes']),'scenes':rows}
    (PROJECT/'verify-narration.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
if __name__=='__main__':main()
