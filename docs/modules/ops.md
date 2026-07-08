> Extracted verbatim from CLAUDE.md on 2026-07-08. Update THIS file (not root CLAUDE.md) when shipping changes in this area.

## Testing the Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Test user manual generation
curl -X POST http://localhost:3001/api/generate/user-manual \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/user/repo",
    "features": ["Auth", "Dashboard"],
    "title": "My App Manual"
  }'

# Test chat
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Generate a cleaning SOP"}
    ]
  }'
```

## Deployment

**Backend:** Railway or Render
```bash
cd packages/backend
npm run deploy
```

**Frontend:** Vercel
```bash
cd packages/frontend
npm run deploy
```
