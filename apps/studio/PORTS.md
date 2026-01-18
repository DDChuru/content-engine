# Port Allocation - Content Engine

## Reserved Ports

| Port | Service | Description |
|------|---------|-------------|
| 3000 | Frontend | Next.js development server |
| 3001 | Backend API | Express API server |
| 3210 | Ralph Dashboard | Claude Code dashboard (DO NOT USE) |
| 3300 | Studio Server | Content Engine Studio WebSocket/API |
| 3301 | Studio Client | Content Engine Studio Vite dev server |

## Starting Services

```bash
# Ralph Dashboard (already running on 3210)
cd ~/.claude/ralph-dashboard && ./start.sh

# Content Engine Studio
cd apps/studio/server && npm run dev  # Port 3300
cd apps/studio/client && npm run dev -- --port 3301  # Port 3301

# Main Backend/Frontend
npm run dev  # Starts both 3000 + 3001
```

## Checking Port Usage

```bash
# See what's using ports
lsof -i -P -n | grep LISTEN | grep -E "node|tsx|vite"

# Kill specific port
fuser -k 3300/tcp
```
