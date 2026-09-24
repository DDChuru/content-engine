from pathlib import Path
import os,json,time,sys
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
from faster_whisper import WhisperModel
P=Path(__file__).resolve().parent
model=WhisperModel(str(next(Path('/home/dachu/.cache/huggingface/hub/models--Systran--faster-whisper-small/snapshots').iterdir())),device='cpu',compute_type='int8',cpu_threads=4,local_files_only=True)
selected={int(x) for x in sys.argv[1:]}
PROMPT="Benedict's solution, reducing sugar, iodine in potassium iodide, emulsion, ethanol, biuret, potassium hydroxide, copper sulfate, precipitate, brick-red, lilac, triglycerides, colorimeter, peptide bonds."
for b in json.loads((P/'script.json').read_text()):
    if selected and b['id'] not in selected: continue
    stem=P/'audio'/f"beat-{b['id']:02d}";wav=stem.with_suffix('.wav');out=stem.with_suffix('.words.json')
    if out.exists() and not selected: continue
    deadline=time.time()+3600
    while not wav.exists():
        if time.time()>deadline: raise RuntimeError(f'Missing {wav.name}')
        time.sleep(2)
    segments,info=model.transcribe(str(wav),language='en',beam_size=5,word_timestamps=True,vad_filter=True,initial_prompt=PROMPT,condition_on_previous_text=False,temperature=0.0)
    words=[]
    for seg in segments: words.extend(dict(word=w.word.strip(),start=w.start,end=w.end,probability=w.probability) for w in seg.words)
    out.write_text(json.dumps(dict(id=b['id'],duration=info.duration,words=words),ensure_ascii=False,indent=2)+'\n')
    print(f"Beat {b['id']:02d}: {len(words)} word timestamps",flush=True)
