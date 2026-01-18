# Content Engine Studio

A unified workspace for content creation with integrated Claude Code terminal.

## Features

- **Video Editor** - Multi-track timeline editing with In/Out point markers
- **Education Studio** - Cambridge IGCSE lesson management and generation
- **Course Creator** - Full course creation with SCORM export
- **Media Pool** - Asset management and AI generation

All workspaces share context with the integrated Claude Code terminal, allowing AI-assisted editing and generation.

## Quick Start

```bash
# Navigate to the studio directory
cd apps/studio

# Install dependencies
npm run install:all

# Start the studio
./start.sh /path/to/your/project

# Or with npm
PROJECT_PATH=/path/to/project npm run dev
```

The studio will be available at:
- **Frontend**: http://localhost:3301
- **Server**: http://localhost:3300

## Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│  CONTENT ENGINE STUDIO                                                  │
├────────────────────────────────────────────────────┬───────────────────┤
│                                                     │                   │
│   ┌────────┬──────────┬─────────────┬────────────┐ │   Claude Code     │
│   │ Video  │Education │  Courses    │   Media    │ │   Terminal        │
│   └────────┴──────────┴─────────────┴────────────┘ │   (PTY)           │
│                                                     │                   │
│   ┌──────────────────────────────────────────────┐ │   ───────────     │
│   │                                              │ │   > claude        │
│   │          Active Workspace                    │ │                   │
│   │          (Timeline / Lessons / etc.)        │ │   Context:        │
│   │                                              │ │   • Selection     │
│   └──────────────────────────────────────────────┘ │   • In/Out pts    │
│                                                     │                   │
├────────────────────────────────────────────────────┴───────────────────┤
│  ◉ Connected │ Workspace: Video Editor │ Project: content-engine       │
└────────────────────────────────────────────────────────────────────────┘
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + 1-4` | Switch workspaces |
| `⌘/Ctrl + \` | Toggle terminal panel |
| `⌘/Ctrl + Enter` | Send context to Claude |
| `I` | Set In point (Video Editor) |
| `O` | Set Out point (Video Editor) |
| `Space` | Play/Pause (Video Editor) |

## Context Bridge

Each workspace automatically sends its state to the Context Bridge:

```typescript
interface WorkspaceContext {
  workspace: 'video-editor' | 'education-studio' | 'course-creator' | 'media-pool';
  activeItem?: { id: string; name: string; type: string };
  selection?: unknown;
  inPoint?: number;
  outPoint?: number;
  metadata?: Record<string, unknown>;
}
```

When you send a message to Claude, it includes:
1. Your typed message
2. Current workspace context
3. Selection and range data

## WebSocket Endpoints

- `ws://localhost:3300/ws?type=terminal` - PTY terminal connection
- `ws://localhost:3300/ws?type=context` - Context bridge subscription
- `ws://localhost:3300/ws?type=workspace` - Workspace state sync

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/context` - Get current workspace contexts
- `GET /api/context/claude` - Get formatted context for Claude
- `GET /api/workspaces` - List available workspaces

## Development

```bash
# Install dependencies
npm run install:all

# Start in development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
apps/studio/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Terminal.tsx
│   │   │   └── workspaces/
│   │   │       ├── VideoEditor.tsx
│   │   │       ├── EducationStudio.tsx
│   │   │       ├── CourseCreator.tsx
│   │   │       └── MediaPool.tsx
│   │   ├── hooks/
│   │   │   ├── useClaudeContext.ts
│   │   │   └── useWebSocket.ts
│   │   └── App.tsx
│   └── index.html
├── server/                 # Express + WebSocket backend
│   ├── index.ts           # Main server
│   ├── pty-manager.ts     # PTY session management
│   └── context-bridge.ts  # Context synchronization
├── start.sh               # Quick start script
└── README.md
```

## Requirements

- Node.js 18+
- npm 9+
- Claude Code CLI installed (`claude` command available)

## License

MIT
