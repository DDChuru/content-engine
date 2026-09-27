"""Run 009g: build audio/beat-04.wav = original Beat 4 speech up to the silence before "Think of it as" + the re-voiced hook
(audio/beat-04.hook.mp3, trimmed to its speech with 0.10 s lead / 0.25 s tail of its own room tone) + the original speech
from the silence before "Written properly". Only the hook sentences are new; every other sample of Beat 4 is the original
v1 take (audio/beat-04.v1.mp3). Cut points = the quietest 20 ms window inside each Whisper word gap; recorded in
audio/beat-04.composite.json. Deterministic: re-running rebuilds the same WAV."""
from pathlib import Path
import json,subprocess,hashlib,wave
import numpy as np
P=Path(__file__).resolve().parent;A=P/'audio'
def dec(mp3):
    r=subprocess.run(['ffmpeg','-v','error','-i',str(mp3),'-ar','48000','-ac','1','-f','s16le','-'],capture_output=True,check=True)
    return np.frombuffer(r.stdout,dtype=np.int16)
v1=dec(A/'beat-04.v1.mp3');hk=dec(A/'beat-04.hook.mp3')
SR=48000
def quietest(x,t0,t1,win=0.02):
    a,b=int(t0*SR),int(t1*SR);n=int(win*SR);best=None
    for s in range(a,b-n,48):
        e=float(np.mean(x[s:s+n].astype(np.float64)**2))
        if best is None or e<best[0]: best=(e,s+n//2)
    return best[1],10*np.log10(best[0]/32768**2+1e-12)
C=json.loads((A/'beat-04.cutspec.json').read_text())   # word gaps from the v1 Whisper words (fixed, committed)
c1,d1=quietest(v1,*C['gap1']);c2,d2=quietest(v1,*C['gap2'])
env=np.abs(hk.astype(np.float64));thr=10**(-40/20)*32768
fr=np.convolve(env>thr,np.ones(480),'same')>0
idx=np.where(fr)[0];h0=max(0,idx[0]-int(0.10*SR));h1=min(len(hk),idx[-1]+int(0.25*SR))
out=np.concatenate([v1[:c1],hk[h0:h1],v1[c2:]])
with wave.open(str(A/'beat-04.wav'),'wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes(out.tobytes())
rep=dict(v1=str('beat-04.v1.mp3'),hook='beat-04.hook.mp3',cut1_sample=int(c1),cut1_s=c1/SR,cut1_dBFS=round(d1,1),cut2_sample=int(c2),cut2_s=c2/SR,cut2_dBFS=round(d2,1),
  hook_trim=[int(h0),int(h1)],hook_seconds=(h1-h0)/SR,removed_v1_seconds=(c2-c1)/SR,total_seconds=len(out)/SR,wav_sha256=hashlib.sha256(out.tobytes()).hexdigest())
(A/'beat-04.composite.json').write_text(json.dumps(rep,indent=2)+'\n');print(rep)
