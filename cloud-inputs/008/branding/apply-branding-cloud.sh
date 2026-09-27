#!/usr/bin/env bash
# CLOUD copy of apply-branding.sh — identical ffmpeg steps (frame, music beds, bookends, concat).
# Differences, so it runs anywhere and matches machine A exactly:
#   - the title bar is a PRE-RENDERED PNG from machine A (BAR_PNG), not drawn here (A's bar font must match);
#   - the music bed path comes from MUSIC_MP3; the slot mask sits beside this script.
# Usage: BAR_PNG=bar-<code>.png MUSIC_MP3=tutorial.mp3 INTRO_MP4=intro.mp4 OUTRO_MP4=outro.mp4 #        ./apply-branding-cloud.sh <lesson-master.mp4> <out.mp4>
set -euo pipefail
LESSON="$1"; OUT="$2"
HERE="$(cd "$(dirname "$0")" && pwd)"
: "${BAR_PNG:?set BAR_PNG}" "${MUSIC_MP3:?set MUSIC_MP3}"
MOUNT=0xE7DFCF; SLOT_W=1690; SLOT_H=950; SLOT_X=115; SLOT_Y=34

# --- 2. composite the lesson into the frame ----------------------------------
ffmpeg -v error -y -i "$LESSON" -i "$HERE/slot-mask.png" -i "$BAR_PNG" -filter_complex "\
color=c=$MOUNT:s=1920x1080:r=30[bg];\
[0:v]scale=$SLOT_W:$SLOT_H,setsar=1[vid];\
[1:v]format=gray,scale=$SLOT_W:$SLOT_H[m];\
[vid][m]alphamerge[vidr];\
[bg][vidr]overlay=$SLOT_X:$SLOT_Y:shortest=1[b1];\
[b1][2:v]overlay=0:0[out]" \
  -map "[out]" -map 0:a -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p -c:a copy /tmp/framed-$$.mp4

# --- 3. music beds — the pinned Blue Sea recipe ------------------------------
# Source SHA256 f1928a7b68b79b89c843af517583ddc636773e8c4a354e3b610d42611962d186
ffmpeg -v error -y -ss 20.133333 -to 25.133333 -i "$MUSIC_MP3" \
  -af "volume=-13dB,afade=t=in:st=0:d=0.4:curve=qsin,afade=t=out:st=3.5:d=1.2:curve=qsin" \
  -ar 48000 -ac 2 /tmp/mi-$$.wav
ffmpeg -v error -y -ss 68 -to 74 -i "$MUSIC_MP3" \
  -af "volume=-13dB,afade=t=in:st=0:d=0.5:curve=qsin,afade=t=out:st=4:d=1.7:curve=qsin" \
  -ar 48000 -ac 2 /tmp/mo-$$.wav

# BOTH bookends carry the lesson title and MUST be re-rendered per lesson.
# The defaults in output/stem4life-bookends/ say "Force, mass & acceleration · Mechanics".
# See RENDER-BOOKENDS.md. Shipping a Biology lesson with a Mechanics title happened twice.
INTRO="${INTRO_MP4:-}"
OUTRO="${OUTRO_MP4:-}"
if [ -z "$INTRO" ] || [ -z "$OUTRO" ]; then
  echo "ERROR: set INTRO_MP4 and OUTRO_MP4 to bookends rendered with THIS lesson's title." >&2
  echo "       See RENDER-BOOKENDS.md. Refusing to ship a mismatched title." >&2
  exit 1
fi
ffmpeg -v error -y -i "$INTRO" -i /tmp/mi-$$.wav -map 0:v -map 1:a \
  -c:v copy -c:a aac -b:a 192k -shortest /tmp/in-$$.mp4
ffmpeg -v error -y -i "$OUTRO" -i /tmp/mo-$$.wav -map 0:v -map 1:a \
  -c:v copy -c:a aac -b:a 192k -shortest /tmp/out-$$.mp4

# --- 4. concatenate ----------------------------------------------------------
ffmpeg -v error -y -i /tmp/in-$$.mp4 -i /tmp/framed-$$.mp4 -i /tmp/out-$$.mp4 -filter_complex "\
[0:v]scale=1920:1080,setsar=1,fps=30[v0];[1:v]scale=1920:1080,setsar=1,fps=30[v1];[2:v]scale=1920:1080,setsar=1,fps=30[v2];\
[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];[2:a]aformat=sample_rates=48000:channel_layouts=stereo[a2];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart "$OUT"

rm -f /tmp/*-$$.{html,png,wav,mp4}
echo "branded -> $OUT"
