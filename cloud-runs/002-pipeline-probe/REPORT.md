# Cloud Run 002 — Pipeline Probe

Every hop a lesson build needs, proved end to end. **All 7 steps PASS.**

## 0. Environment & credentials
`CLAUDE_CODE_REMOTE=true` · 4 cores · 15 Gi RAM · 27 G free disk · `BUNNY_BIO_LIBRARY_ID` **is set**. Neither key is in the
environment; both are proxy-injected and **both authenticate with no key header**. `GET api.elevenlabs.io/v1/user` → **200**
(Creator tier, 222 480 / 363 000 chars used); `GET /v1/voices/BcpjRWrYhDBHmOnetmBl` → **200** ("Thandi – Clear and Engaging Narrator"). Bunny create/upload/poll all **200** with no `AccessKey` header. No credential failure anywhere in this run.

## 2. Egress (`probe-logs/egress.txt`) — 404/403 at a bare root means the host is reachable
| host | code | time | | host | code | time |
|---|---|---|---|---|---|---|
| api.elevenlabs.io | 404 ok | 0.32s | | remotion.media | **200 — now reachable** | 0.62s |
| huggingface.co | 200 | 0.16s | | video.bunnycdn.com | 404 ok | 0.29s |
| cdn-lfs.huggingface.co | **BLOCKED** | 0.29s | | storage.bunnycdn.com | 200 | 0.46s |
| cas-bridge.xethub.hf.co | 403 ok | 0.44s | | vz-e2af76b2-543.b-cdn.net | 403 ok | 0.16s |

Only `cdn-lfs` is blocked — verbatim `curl: (56) CONNECT tunnel failed, response 502` — and it did not matter: HF weights came
via `cas-bridge.xethub.hf.co`. Other error: `apt-get install ffmpeg` first failed with `E: Failed to fetch
…mesa-vdpau-drivers… 404 Not Found` (×3, stale index); `apt-get update` fixed it.

## 3. TTS — PASS (2.3 s)
One POST, no `xi-api-key`. `BcpjRWrYhDBHmOnetmBl` / `eleven_multilingual_v2` / speed 1.0 / `pcm_24000` → 410 158 B wrapped to WAV. **Duration 8.545 s** → `tts/narration.wav`.

## 4. Transcribe — PASS
`pip install faster-whisper` **13.0 s** · `small` CPU int8 download+load **7.6 s** · transcribe **2.5 s** (3.4× realtime) ·
20 words all timestamped → `tts/words.json`. Start times (s): An 0.00 · enzyme 0.16 · lowers 0.68 · the 1.18 · activation 1.50 ·
energy 1.94 · of 2.56 · the 2.90 · reaction 3.04 · it 3.52 · catalyzes 4.04 · It 5.30 · does 5.44 · not 5.64 · change 5.96 ·
the 6.36 · energy 6.68 · of 7.08 · the 7.36 · products 7.50. British "catalyses" came back as US "catalyzes".

## 5. Render — PASS
ffmpeg 6.1.1 (apt) · Remotion 4.0.365 + deps via `npm install --no-save` **1 m 32 s**, 1186 pkgs. **Browser: Remotion's own
`chrome-headless-shell` 154.0.8037.57, fetched from remotion.media in 2.8 s — not the Playwright shell**, since
remotion.media is reachable this run. No `CHROME_BIN` set.
`Stem4LifeIntroB` (heroHeight 518) + `Stem4LifeOutro` (aesthetic C), title "Enzymes: how they work", both 1920×1080@30,
metadata asserted, local WOFF2 fonts confirmed. Bundle + both renders + a still: **20.3 s wall** (outro leg 7.6 s / 180 frames
≈ **23.7 fps**). Assembly intro 5 s + 10 s hold of the outro's frame 0 carrying the WAV + outro 6 s = 21.07 s, encoded in 6.4 s.
Verified (`probe-logs/verify.txt`, `probe-logs/ffprobe-test-002.json`): h264 High/yuv420p/bt709, 632 frames, **video 21.067 s ≥ audio
20.950 s**, full decode **0 errors**, narration measured inside the 5–15 s window.

**Frames looked at** (`stills/`): intro @4.8 s — dark navy card, peach microscope docked left of the "Stem 4 Life" wordmark
(4 in peach), terracotta rule, "Enzymes: how they work" over "Cambridge A Level · Biology", `stem4life.com` at the foot. Outro
@20.5 s — warm graph-paper card, navy wordmark, "Keep learning. Put it into practice.", large underlined `stem4life.com`,
"YOU JUST STUDIED" + the title. Both correct.

Two caveats: the outro's **frame 0 is blank** (rules and lockup animate in later), so the 10 s hold is an empty brand bed — a
real lesson should hold a settled frame. And the first assembly failed `video ≥ audio` by 47 ms on AAC tail rounding; fixed by
trimming trailing silence (speech ends ~13.5 s), but the full build must handle that deliberately.

## 6. Bunny upload — PASS
guid **`663d9d25-dd36-4182-9065-73c44dc5a2a7`** · "ZZ CLOUD TEST 002 — safe to delete", no collection. POST create **200**
(0.9 s) · PUT `curl -T` **200** (2.6 s, 520 318 B) · **status 4 at 184 s** (240/360/480/720/1080p, length 21 s). Nothing deleted. Poll log: `probe-logs/bunny-poll.txt`.

## 7. Go / no-go — **GO**
No hop blocked, no credential missing. Extrapolated to 16 min (960 s audio, 28 800 frames): TTS ~4–5 min · Whisper ~5 min ·
**Remotion 20 min if every frame were as cheap as a bookend, realistically 60–160 min** for KaTeX/diagram/image scenes on
4 cores — the dominant cost and the only soft number here · ffmpeg assembly ~5 min · Bunny upload+encode ~20–45 min. **Wall
clock ≈ 2–3.5 h**, well inside disk and RAM. Concurrency was 4; raising it past core count won't help. Render per scene so a
failure costs one scene, not the lesson.
