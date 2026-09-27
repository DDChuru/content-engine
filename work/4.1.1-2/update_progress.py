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
master=P/'4.1.1-2-fluid-mosaic.mp4'
live=subprocess.run(['pgrep','-fa','render-beat.cjs'],capture_output=True,text=True).stdout.strip() or 'none'
notes=(P/'progress-notes.md').read_text()
phase=notes.split('\n',1)[0].replace('PHASE:','').strip()
out=f"""# 4.1.1-2 Fluid mosaic membranes: how the bilayer forms and what sits in it · BUILD PROGRESS (handover)

Updated {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M')}Z. Builder: claude-opus-5-5 (cloud run 008a). Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`; commit work/4.1.1-2 + work/t4-shared only; push that branch only.
**Phase: {phase}** · **Beats complete: {done} / 13** · master: {'present' if master.exists() else 'not yet built'}
Live render processes: {live}
NOTE: render-cache/ (chunks) and all MP4/WAV are NOT in git — a fresh container must re-render approved beats
(`./launch-render.sh N`, 4 at a time); approvals (qa/beat-NN/approved.json) ARE in git and stay valid while the
source fingerprint matches.

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
""" + '\n'.join(rows) + '\n\n' + notes.split('\n',1)[1]
(P/'PROGRESS.md').write_text(out);print(f'PROGRESS: {done}/13 complete')
