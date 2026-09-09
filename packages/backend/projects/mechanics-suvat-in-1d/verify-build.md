# MechanicsSuvatIn1D — build verification

- Slug `mechanics-suvat-in-1d`, map M4.2. Registered by hand in Root.tsx: 1920 × 1080, 30 fps.
- Audio-derived duration: 10082 frames / 336.067 seconds (5:36). Eight MP3s total 335.909 seconds; each scene rounds up to a frame.
- Narration checkpoint: 3ff1186, pushed through merge ec15e64 before composition work. Voice gYWKdgLtqjPO3D5uDrDP, 0.9 slow / 1.0 brisk; isolated local faster-whisper-small word timing. 70 resolved cues; no fallback cue times.
- Content stays within FRAME-LOG.md: bike, braking train, direction reversal and two-position car. Correct 10²; signed acceleration versus deceleration magnitude; speeds up after reversal. No force discussion or vertical motion.
- Every calculation rewrites all five entries, ticks knowns and circles the target. Car lists circle both unknowns. General formula stays above substitution; car's first equation stays on the diagram during its second interval and elimination. All givens precede working; answers replace diagram unknowns.
- 342 stills audited, including 39 pen finishes, 215 spoken/substitution ring checks and all resolved cues. Maximum 3 regions; zero measured text/handwriting collisions or overflow. Actual visual pixels checked in every sample.
- 40 completed list-entry pixel checks pass, including each initial handwritten letter, every required tick and target ring. Explicit stroke segments retain the approved glyph geometry; completed letters, ticks and circles are checked in the PNG pixels.
- All 18 inserted-silence hold pairs are byte-identical PNGs; encoded silence and audio hashes independently checked by verify-suvat-in-1d-cues.py. One three-second check hold.
- Targeted TypeScript check, still bundling, Root registration checks and git diff --check pass. No video rendered; no deployment commands run; no paths deleted.

## Evidence

verify-stills.json contains all measured bounds, figure targets, pen completions, hold results, list pixel counts and proof-image hashes. verify-sNN-*.png preserves completed scenes, writing, stories and problem setups. Full stills remain in packages/backend/out/verify-suvat-in-1d-stills/.

## Reproduce

Use nvm Node and the existing backend node_modules. From packages/backend:

1. Run src/scripts/verify-suvat-in-1d-stills.cjs with Node (still-only; never renderMedia).
2. Run src/scripts/verify-suvat-in-1d-build.cjs with Node.
3. Targeted TypeScript: tsc --noEmit --jsx react-jsx --esModuleInterop --resolveJsonModule --moduleResolution bundler --module esnext --target es2022 --skipLibCheck src/remotion/compositions/MechanicsSuvatIn1D.tsx src/scripts/verify-suvat-in-1d-entry.tsx.

Narration reproduction uses verify-suvat-in-1d-narration.py mechanics-suvat-in-1d, then the same command with --transcribe, then verify-suvat-in-1d-cues.py. Python needs requests, numpy and faster-whisper; this host has /tmp/verify-equilibrium-venv/bin/python. CONTENT_ENGINE_ENV can override ~/Documents/projects/content-engine/.env. The generator makes paid ElevenLabs calls only for missing cached text; transcription is local.
