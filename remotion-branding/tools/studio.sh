#!/usr/bin/env bash
# VidStud — video annotation studio launcher.
# Boots Remotion Studio (live preview) + the agent bridge, then opens the
# 3-pane shell as an app window. Ctrl-C tears everything down.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"
STUDIO_PORT=3000
BRIDGE_PORT=8910
TERM_PORT=7682
TMUX_SESSION=studio
TTYD="$(command -v ttyd || echo "$HOME/.local/bin/ttyd")"

echo "▸ VidStud — repo: $REPO"

# Prefer Node 22 if nvm has it (Remotion is happiest there)
if [ -x "$HOME/.nvm/versions/node/v22.22.0/bin/node" ]; then
  export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
fi

pids=()
cleanup(){ echo; echo "▸ shutting down…"; for p in "${pids[@]:-}"; do kill "$p" 2>/dev/null || true; done; }
trap cleanup EXIT INT TERM

# 1) Remotion Studio (live preview) — no auto-open, we embed it
if ! curl -s -o /dev/null --max-time 1 "http://localhost:$STUDIO_PORT"; then
  echo "▸ starting Remotion Studio on :$STUDIO_PORT"
  npx remotion studio src/index.ts --port "$STUDIO_PORT" --no-open >/tmp/studio-remotion.log 2>&1 &
  pids+=($!)
else
  echo "▸ Remotion Studio already up on :$STUDIO_PORT"
fi

# 2) Agent bridge
echo "▸ starting agent bridge on :$BRIDGE_PORT"
node tools/studio-server.mjs >/tmp/studio-bridge.log 2>&1 &
pids+=($!)

# 2b) Real terminal (ttyd → persistent tmux session in the repo). This IS the
# Agent pane — a full Claude Code / Codex CLI, not a one-shot bridge. tmux -A
# keeps the session alive across reloads; -c starts it in the repo.
if [ -x "$TTYD" ]; then
  echo "▸ starting terminal (ttyd) on :$TERM_PORT  [tmux: $TMUX_SESSION]"
  # Pre-create the tmux session server-side so it exists (and the buttons'
  # send-keys work) even before a browser connects; ttyd then just attaches.
  tmux has-session -t "$TMUX_SESSION" 2>/dev/null || tmux new-session -d -s "$TMUX_SESSION" -c "$REPO"
  "$TTYD" -p "$TERM_PORT" -W -t fontSize=13 -t 'theme={"background":"#060d14","foreground":"#cfe4f2"}' \
    tmux new -A -s "$TMUX_SESSION" -c "$REPO" >/tmp/studio-ttyd.log 2>&1 &
  pids+=($!)
else
  echo "⚠ ttyd not found ($TTYD) — Agent terminal pane will be blank. Install: curl -fsSL -o ~/.local/bin/ttyd https://github.com/tsl0922/ttyd/releases/download/1.7.7/ttyd.x86_64 && chmod +x ~/.local/bin/ttyd"
fi

# 3) wait for the bridge, then open the shell as an app window
for i in $(seq 1 20); do
  curl -s -o /dev/null --max-time 1 "http://localhost:$BRIDGE_PORT" && break; sleep 0.3
done
URL="http://localhost:$BRIDGE_PORT/"
echo "▸ opening $URL"
if command -v google-chrome >/dev/null; then
  google-chrome --app="$URL" --new-window >/dev/null 2>&1 &
  pids+=($!)
else
  xdg-open "$URL" >/dev/null 2>&1 || true
fi

echo "▸ Studio running. Preview :$STUDIO_PORT · Bridge :$BRIDGE_PORT · Terminal :$TERM_PORT. Ctrl-C to stop."
wait
