import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { PtyManager, WorkspaceContext } from './pty-manager.js';
import { ContextBridge } from './context-bridge.js';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Configuration
const PORT = process.env.PORT || 3300;
const isDev = process.env.NODE_ENV !== 'production';
const PROJECT_PATH = process.env.PROJECT_PATH || process.cwd();

// Initialize context bridge
const contextBridge = new ContextBridge();

// Store active PTY sessions
const ptySessions: Map<string, PtyManager> = new Map();

// CORS for development
app.use(cors({
  origin: isDev ? true : /^https?:\/\/localhost(:\d+)?$/,
  credentials: true,
}));

app.use(express.json());

// Serve static files in production
if (!isDev) {
  const clientDist = path.join(__dirname, '../client/dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sessions: ptySessions.size,
    project: PROJECT_PATH,
    uptime: process.uptime(),
  });
});

// Get current context
app.get('/api/context', (req, res) => {
  const workspace = req.query.workspace as string | undefined;
  if (workspace) {
    const ctx = contextBridge.getContext(workspace);
    res.json({ context: ctx || null });
  } else {
    const all: Record<string, WorkspaceContext> = {};
    contextBridge.getAllContexts().forEach((ctx, ws) => {
      all[ws] = ctx;
    });
    res.json({ contexts: all });
  }
});

// Get context formatted for Claude
app.get('/api/context/claude', (req, res) => {
  const workspace = req.query.workspace as string | undefined;
  const formatted = contextBridge.formatForClaude(workspace);
  res.json({ formatted });
});

// List available workspaces
app.get('/api/workspaces', (req, res) => {
  res.json({
    workspaces: [
      { id: 'video-editor', name: 'Video Editor', icon: '🎬', description: 'Multi-track video editing with timeline' },
      { id: 'education-studio', name: 'Education Studio', icon: '📚', description: 'IGCSE lesson creation and management' },
      { id: 'course-creator', name: 'Course Creator', icon: '🎓', description: 'Full course generation with SCORM export' },
      { id: 'media-pool', name: 'Media Pool', icon: '🖼️', description: 'Asset management and generation' },
    ],
  });
});

// WebSocket connection handling
wss.on('connection', (ws: WebSocket, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const type = url.searchParams.get('type') || 'terminal';
  const sessionId = url.searchParams.get('session') || 'default';
  const projectPath = url.searchParams.get('project') || PROJECT_PATH;

  console.log(`[WS] New ${type} connection, session: ${sessionId}`);

  if (type === 'terminal') {
    handleTerminalConnection(ws, sessionId, projectPath);
  } else if (type === 'context') {
    handleContextConnection(ws, sessionId);
  } else if (type === 'workspace') {
    handleWorkspaceConnection(ws, sessionId);
  }
});

/** Handle terminal PTY connections */
function handleTerminalConnection(ws: WebSocket, sessionId: string, projectPath: string): void {
  // Get or create PTY session
  let ptyManager = ptySessions.get(sessionId);

  if (!ptyManager) {
    ptyManager = new PtyManager({
      cwd: projectPath,
      autoStartClaude: true,
    });
    ptySessions.set(sessionId, ptyManager);

    ptyManager.onExit(() => {
      ptySessions.delete(sessionId);
    });
  }

  // Send PTY output to WebSocket
  ptyManager.onData((data: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  // Handle incoming data from WebSocket
  ws.on('message', (data: Buffer | string) => {
    const message = data.toString();

    // Check if it's a JSON command
    try {
      const parsed = JSON.parse(message);

      if (parsed.type === 'resize') {
        ptyManager?.resize(parsed.cols, parsed.rows);
      } else if (parsed.type === 'context') {
        // Inject context into Claude
        const formatted = contextBridge.formatForClaude();
        ptyManager?.write(formatted);
      } else if (parsed.type === 'command') {
        ptyManager?.executeCommand(parsed.command);
      }
    } catch {
      // Not JSON, treat as raw terminal input
      ptyManager?.write(message);
    }
  });

  ws.on('close', () => {
    console.log(`[WS] Terminal connection closed, session: ${sessionId}`);
    // Don't kill PTY on disconnect - allow reconnection
  });

  ws.on('error', (err) => {
    console.error(`[WS] Terminal error:`, err);
  });
}

/** Handle context bridge connections */
function handleContextConnection(ws: WebSocket, sessionId: string): void {
  // Subscribe to all workspace contexts
  contextBridge.subscribe(sessionId, ws, ['*']);

  ws.on('message', (data: Buffer | string) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'update_context') {
        contextBridge.updateContext(message.context);
      } else if (message.type === 'get_context') {
        const ctx = contextBridge.getContext(message.workspace);
        ws.send(JSON.stringify({ type: 'context', workspace: message.workspace, context: ctx }));
      } else if (message.type === 'subscribe') {
        contextBridge.subscribe(sessionId, ws, message.workspaces || ['*']);
      }
    } catch (err) {
      console.error('[WS] Context message error:', err);
    }
  });

  ws.on('close', () => {
    contextBridge.unsubscribe(sessionId);
  });
}

/** Handle workspace-specific connections */
function handleWorkspaceConnection(ws: WebSocket, sessionId: string): void {
  ws.on('message', (data: Buffer | string) => {
    try {
      const message = JSON.parse(data.toString());

      // Forward workspace updates to context bridge
      if (message.type === 'workspace_update') {
        contextBridge.updateContext(message.context);

        // Broadcast to other workspace connections
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'workspace_sync',
              ...message,
            }));
          }
        });
      }
    } catch (err) {
      console.error('[WS] Workspace message error:', err);
    }
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Server] Shutting down...');
  ptySessions.forEach((pty, id) => {
    console.log(`[Server] Killing PTY session: ${id}`);
    pty.kill();
  });
  server.close(() => {
    console.log('[Server] Goodbye!');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎬 CONTENT ENGINE STUDIO                                 ║
║                                                            ║
║   Server running on http://localhost:${PORT}                 ║
║   Project: ${PROJECT_PATH.slice(0, 40).padEnd(40)}   ║
║                                                            ║
║   WebSocket endpoints:                                     ║
║   • ws://localhost:${PORT}/ws?type=terminal                  ║
║   • ws://localhost:${PORT}/ws?type=context                   ║
║   • ws://localhost:${PORT}/ws?type=workspace                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
