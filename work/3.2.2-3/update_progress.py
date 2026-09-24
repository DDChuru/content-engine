"""Regenerate PROGRESS.md from disk state + progress-notes.md (the hand-written decisions)."""
from pathlib import Path
import json,datetime,subprocess
P=Path(__file__).resolve().parent;T=json.loads((P/'timeline.json').read_text())
rows=[];done=0
for sc in T['scenes']:
    n=f"{sc['id']:02d}";d=P/'render-cache'/f'beat-{n}';src=(P/'src/beats'/f'Beat{n}.tsx').exists()
    appr=(P/'qa'/f'beat-{n}'/'approved.json').exists();comp=(d/'complete.json').exists();lock=(d/'render.lock').exists()
    if comp: done+=1
    state='COMPLETE' if comp else 'RENDERING (lock)' if lock else 'approved, not rendered' if appr else 'authored' if src else 'not authored'
    rows.append(f"| {sc['id']} | {sc['heading'][:58]} | {sc['frames']} | {len(sc['cues'])} | {state} |")
master=P/'3.2.2-3-vmax-km-inhibitors.mp4'
live=subprocess.run(['pgrep','-fa','render-beat.cjs'],capture_output=True,text=True).stdout.strip() or 'none'
notes=(P/'progress-notes.md').read_text()
phase=notes.split('\n',1)[0].replace('PHASE:','').strip()
out=f"""# 3.2.2-3 — Vmax, Km and inhibitors on the graph · BUILD PROGRESS (handover file)

Updated {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M')} (UTC, cloud container). Builder: claude-opus-5-5.
**Phase: {phase}** · **Beats complete: {done} / 17** · master: {'present' if master.exists() else 'not yet built'}
Live render processes: {live}

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
""" + '\n'.join(rows) + '\n\n' + notes.split('\n',1)[1]
(P/'PROGRESS.md').write_text(out);print(f'PROGRESS: {done}/17 complete')
