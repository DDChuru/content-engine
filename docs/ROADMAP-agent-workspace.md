ROADMAP — none of this is built; do not treat as current architecture.

> Extracted verbatim from CLAUDE.md on 2026-07-08. Update THIS file (not root CLAUDE.md) when shipping changes in this area.

## Future: Agent Workspace (ROADMAP)

### Vision

Transform Content Engine Cloud into an AI-powered development platform with autonomous agents that can:
- Analyze codebases
- Implement features
- Fix bugs
- Review code
- Create pull requests
- Run tests

### Architecture Plan

**Two execution modes:**

1. **Local (Development):**
   - Use CLI tools (FREE): Claude Code, Gemini CLI, Aider, Droid
   - Direct filesystem access
   - Git operations
   - Your tools and environment
   - Cost: $0

2. **Remote (Production/API):**
   - Use AI APIs: Claude API, Gemini API, OpenAI API, DeepSeek API
   - Scalable cloud execution
   - Authenticated with API keys
   - Accessible from anywhere
   - Cost: ~$0.01-$0.50 per task

**Model routing:**
- Auto-select best model for task
- Or user specifies preferred model
- Options: Claude Opus/Sonnet, Gemini Flash/Pro, GPT-4, DeepSeek Coder

### Planned Features

**Phase 1: MVP (4 hours)**
- Add "Spawn Agent" button to existing chat interface
- Basic `/api/agents/spawn` endpoint
- Execute tasks with Claude API
- Simple status tracking

**Phase 2: Tracking (8 hours)**
- Store agent execution in Firebase
- View agent history
- Track costs and performance
- Basic analytics

**Phase 3: Dashboard (16 hours)**
- Dedicated agent workspace UI
- Kanban board for tasks
- Agent status monitoring
- Project health metrics
- Real-time updates

**Phase 4: Advanced (1 week)**
- CLI tool detection (local execution)
- Model routing (auto-select best AI)
- GitHub webhooks (PR tracking)
- API key system (remote access)
- WebSockets (real-time status)

### Implementation Effort

- **Minimal (agent spawn):** 2-4 hours
- **Production-ready (UI + tracking):** 1-2 days
- **Full-featured (everything):** 1 week

### Key Documents (To Be Created)

- `AGENT-WORKSPACE-ARCHITECTURE.md` - System design
- `AGENT-EXECUTOR-SPEC.md` - CLI vs API execution
- `MODEL-ROUTING-GUIDE.md` - Auto-selecting AI models
- `API-KEY-SYSTEM.md` - Authentication and quotas

### Status: PLANNED

The agent workspace is **not yet implemented**. Focus is currently on:
1. ✅ Completing education platform
2. ✅ Testing educational content generation
3. ⏳ Documenting workflows

Agent workspace will be built **after** education platform is validated and tested in production.

### Notes

The existing chat interface (`ChatInterface` component) can already be used for conversational agent-like interactions. The agent workspace will formalize this with:
- Persistent tracking
- Task queuing
- Status monitoring
- Cost analytics
- Team collaboration
