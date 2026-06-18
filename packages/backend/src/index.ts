/**
 * Content Engine Cloud Backend
 * Main API server with Firebase and Claude integration
 */

// IMPORTANT: Load environment variables FIRST before any imports that need them
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Now import everything else
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { initializeFirebase } from './services/firebase.js';
import { ClaudeService } from './services/claude.js';
import { ContentGenerator } from './services/content-generator.js';
import { DocumentExtractionService } from './services/document-extraction.js';
import { GitHubService } from './services/github.js';
import { StudioBridgeAgent } from './services/studio-bridge-agent.js';
import chatRoutes from './routes/chat.js';
import generateRoutes from './routes/generate.js';
import firebaseRoutes from './routes/firebase.js';
import healthRoutes from './routes/health.js';
import extractionRoutes from './routes/extraction.js';
import educationRoutes from './routes/education.js';
import educationContentRoutes from './routes/education-content.js';
import interactiveRoutes from './routes/interactive.js';
import setsAgentRoutes from './routes/sets-agent-demo.js';
import agentRegistryRoutes from './routes/agent-registry-routes.js';
import agentsRoutes from './routes/agents.js';
import videoRoutes from './routes/video.js';
import courseCreatorRoutes from './routes/course-creator.js';
import voiceRoutes from './routes/voice.js';
import studioRoutes from './routes/studio.js';
import lessonsRoutes from './routes/lessons.js';
import sciViewerRoutes from './routes/sci-viewer.js';
import crewAllocationRoutes from './routes/crew-allocation.js';
import selfInspectionRoutes from './routes/self-inspection.js';
import pictorialAuditRoutes from './routes/pictorial-audit.js';
import imagesRoutes from './routes/images.js';
import veoRoutes from './routes/veo.js';
import journalistRoutes from './routes/journalist.js';
import lifeStoriesRoutes from './routes/life-stories.js';
import narrationStudioRoutes from './routes/narration-studio.js';
import studioProjectsRoutes from './routes/studio-projects.js';
import trainingExportRoutes from './routes/training-export.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // In development, allow all localhost origins
    if (!origin || origin.startsWith('http://localhost:') || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      console.error('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from output directory (for generated images/videos)
app.use('/output', express.static(path.join(__dirname, '../output')));
console.log('📁 Serving static files from /output');

// Also serve from project root output (for life-stories, journalist projects, etc.)
app.use('/output', express.static(path.join(process.cwd(), 'output')));
console.log('📁 Serving project output files');

// Serve lesson videos from Remotion public folder
app.use('/videos/sets', express.static(path.join(__dirname, 'remotion/public/videos')));
console.log('🎬 Serving lesson videos from /videos/sets');

// Serve Manim output videos
app.use('/videos/manim', express.static(path.join(__dirname, 'manim/output')));
console.log('🎥 Serving Manim videos from /videos/manim');

// Initialize services
console.log('🚀 Initializing services...');

// Initialize Firebase projects
initializeFirebase();

// Initialize Claude
const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);

// Initialize Content Generator
const contentGenerator = new ContentGenerator(
  process.env.GEMINI_API_KEY!,
  claudeService
);

// Initialize Document Extraction
const documentExtraction = new DocumentExtractionService(process.env.GEMINI_API_KEY!);

// Initialize GitHub
const githubService = new GitHubService(process.env.GITHUB_TOKEN!);

// Make services available to routes
app.locals.claude = claudeService;
app.locals.claudeService = claudeService; // Also expose as claudeService for new routes
app.locals.contentGenerator = contentGenerator;
app.locals.documentExtraction = documentExtraction;
app.locals.github = githubService;

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/firebase', firebaseRoutes);
app.use('/api/extraction', extractionRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/education-content', educationContentRoutes); // NEW: 3-layer content generation
app.use('/api/interactive', interactiveRoutes);
app.use('/api/sets-agent', setsAgentRoutes);
app.use('/api/agents', agentsRoutes); // NEW: Specialized agent system
app.use('/api/agent-registry', agentRegistryRoutes); // OLD: Legacy agent registry
app.use('/api/video', videoRoutes); // GLOBAL: Video rendering with WebSlides
app.use('/api/course-creator', courseCreatorRoutes); // NEW: Voice-driven course creation
app.use('/api/voice', voiceRoutes); // NEW: ElevenLabs voice generation
app.use('/api/studio', studioRoutes); // NEW: Studio screenshots and change requests
app.use('/api/lessons', lessonsRoutes); // NEW: Lesson listing and video streaming
app.use('/api/sci-viewer', sciViewerRoutes); // NEW: SCI Viewer for work instructions
app.use('/api/crew-allocation', crewAllocationRoutes); // NEW: Crew allocation management
app.use('/api/self-inspection', selfInspectionRoutes); // NEW: Self inspection management
app.use('/api/pictorial-audit', pictorialAuditRoutes); // NEW: Pictorial audit management
// Legacy routes for backwards compatibility with HTML studio files
app.use('/api/screenshot', studioRoutes); // Maps /api/screenshot/* to /api/studio/*
app.use('/api/images', imagesRoutes); // NEW: Gemini image generation
app.use('/api/veo', veoRoutes); // NEW: Veo 3.1 video generation
app.use('/api/journalist', journalistRoutes); // LEGACY: Journalist Studio (renamed to Life Stories)
app.use('/api/life-stories', lifeStoriesRoutes); // NEW: Life Stories with CLI orchestrators
app.use('/api/narration-studio', narrationStudioRoutes); // NEW: Direct upload + auto-convert for narration
app.use('/api/studio', studioProjectsRoutes); // NEW: Content Studio project management
app.use('/api/training', trainingExportRoutes); // NEW: Training video export for e-wizer LMS

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
});

// Create HTTP server (needed for WebSocket)
const server = http.createServer(app);

// Create WebSocket server for Studio terminal connections
const wss = new WebSocketServer({ noServer: true });
const terminalClients = new Map<WebSocket, { sessionId: string; projectPath: string }>();

// Handle WebSocket upgrade requests
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);

  // Only handle /ws path
  if (url.pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      const sessionId = url.searchParams.get('session') || 'default';
      const projectPath = url.searchParams.get('project') || '';
      const type = url.searchParams.get('type') || 'terminal';

      wss.emit('connection', ws, request, { sessionId, projectPath, type });
    });
  } else {
    socket.destroy();
  }
});

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket, request: http.IncomingMessage, params: { sessionId: string; projectPath: string; type: string }) => {
  console.log(`🔌 WebSocket connected: session=${params.sessionId}, type=${params.type}`);

  terminalClients.set(ws, { sessionId: params.sessionId, projectPath: params.projectPath });

  // Send welcome message
  ws.send('\x1b[38;5;82m╔══════════════════════════════════════════════════════════════╗\x1b[0m\r\n');
  ws.send('\x1b[38;5;82m║\x1b[0m  \x1b[1;38;5;214mContent Engine Studio\x1b[0m - Claude Code Integration         \x1b[38;5;82m║\x1b[0m\r\n');
  ws.send('\x1b[38;5;82m╚══════════════════════════════════════════════════════════════╝\x1b[0m\r\n\r\n');
  ws.send('\x1b[38;5;246mThis terminal receives context from Studio workspaces.\x1b[0m\r\n');
  ws.send('\x1b[38;5;246mUse the workspace panels to send context here.\x1b[0m\r\n\r\n');
  ws.send('\x1b[38;5;82m$ \x1b[0m');

  // Handle messages from client
  ws.on('message', (data: Buffer | string) => {
    const message = data.toString();

    // Try to parse as JSON (for resize/context messages)
    try {
      const parsed = JSON.parse(message);
      if (parsed.type === 'resize') {
        console.log(`📐 Terminal resize: ${parsed.cols}x${parsed.rows}`);
      } else if (parsed.type === 'context') {
        ws.send('\r\n\x1b[38;5;214mContext received from workspace\x1b[0m\r\n');
        ws.send('\x1b[38;5;82m$ \x1b[0m');
      }
    } catch {
      // Plain text input - echo it back
      if (message.includes('\r') || message.includes('\n')) {
        ws.send('\r\n\x1b[38;5;246mNote: Direct terminal commands are not executed.\x1b[0m\r\n');
        ws.send('\x1b[38;5;246mUse workspace UI to send context to Claude Code.\x1b[0m\r\n');
        ws.send('\x1b[38;5;82m$ \x1b[0m');
      } else {
        ws.send(message); // Echo typed characters
      }
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket disconnected');
    terminalClients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    terminalClients.delete(ws);
  });
});

// Function to broadcast to terminal clients
function broadcastToTerminals(message: string, sessionId?: string) {
  terminalClients.forEach((client, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      if (!sessionId || client.sessionId === sessionId) {
        ws.send(message);
      }
    }
  });
}

// Expose broadcast function to routes
app.locals.broadcastToTerminals = broadcastToTerminals;

// Initialize Studio Bridge Agent
let studioBridge: StudioBridgeAgent | null = null;

async function startServer() {
  try {
    studioBridge = new StudioBridgeAgent(server);
    await studioBridge.start();
    // Expose WebSocket io to routes for event emission
    if (studioBridge.io) {
      app.locals.studioBridgeIO = studioBridge.io;
    }
    console.log('🤖 Studio Bridge Agent active');
  } catch (error: any) {
    console.error('⚠️  Studio Bridge Agent failed to start:', error.message);
    console.log('   Studio features will be unavailable');
  }

  // Start server
  server.listen(PORT, () => {
    console.log(`✅ Content Engine Cloud Backend running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);

    if (studioBridge) {
      console.log(`\n🎨 AUTONOMOUS STUDIO READY`);
      console.log(`   Open: http://localhost:8000/excalidraw-studio-autonomous.html`);
      console.log(`   Edit in UI → Changes auto-apply → Browser refreshes`);
    }

    console.log(`\n📦 Services initialized:`);
    console.log(`   • Claude AI: ${claudeService ? '✓' : '✗'}`);
    console.log(`   • Content Generator: ${contentGenerator ? '✓' : '✗'}`);
    console.log(`   • Document Extraction: ${documentExtraction ? '✓' : '✗'}`);
    console.log(`   • GitHub: ${githubService ? '✓' : '✗'}`);
    console.log(`   • Studio Bridge: ${studioBridge ? '✓' : '✗'}`);
    console.log(`   • Firebase Projects: Check /api/health/firebase`);
    console.log(`\n🎓 Interactive Learning System:`);
    console.log(`   • API Routes: /api/interactive/*`);
    console.log(`   • D3 Visualizations: ✓`);
    console.log(`   • Manim Animations: ✓`);
    console.log(`   • Step-by-Step Reveals: ✓`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  if (studioBridge) {
    await studioBridge.stop();
  }
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export default app;
