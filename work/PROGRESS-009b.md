# Cloud run 009b — session handover (branch cloud/009-5.1.2-to-5.1.6-rmr4ks)

LESSONS (in order): 5.1.2 · 5.1.5 · 5.1.6. SHARED_FROM = cloud/009-5.1.1-to-5.1.4-qls6vy (work/t5-shared copied, then EXTENDED
with MitosisCellModel.tsx, which 009a did not build). Each lesson's own PROGRESS.md has its beat table and phase.

Decisions:
- Scripts in each lesson dir start from 009a's 5.1.3 cloud-adapted copies (stricter cue check in verify.py), re-targeted.
- MEMORY HOOK rule (27 Sep): 2 s digital-silence holds after each handle is converted (5.1.2 B4 END; 5.1.5 B4 END; 5.1.6 B5
  before "Usually more than one"); hook word and target highlighted together as spoken.
- Bookends for all three lessons were rendered once in work/5.1.2/bookend-src (outputs in work/5.1.2/bookends/, not in git).
- Division excerpts carry the omitted-interval caption (Round-1 contract) wherever a dividing glyph runs.
Resume: for each lesson not DONE, read its PROGRESS.md; re-render approved beats with ./render-batch.sh (approvals are in git).
