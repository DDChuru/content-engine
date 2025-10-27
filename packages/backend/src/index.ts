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
import cors from 'cors';
import { initializeFirebase } from './services/firebase.js';
import { ClaudeService } from './services/claude.js';
import { ContentGenerator } from './services/content-generator.js';
import { DocumentExtractionService } from './services/document-extraction.js';
import { GitHubService } from './services/github.js';
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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Content Engine Cloud Backend running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`\n📦 Services initialized:`);
  console.log(`   • Claude AI: ${claudeService ? '✓' : '✗'}`);
  console.log(`   • Content Generator: ${contentGenerator ? '✓' : '✗'}`);
  console.log(`   • Document Extraction: ${documentExtraction ? '✓' : '✗'}`);
  console.log(`   • GitHub: ${githubService ? '✓' : '✗'}`);
  console.log(`   • Firebase Projects: Check /api/health/firebase`);
  console.log(`\n🎓 Interactive Learning System:`);
  console.log(`   • API Routes: /api/interactive/*`);
  console.log(`   • D3 Visualizations: ✓`);
  console.log(`   • Manim Animations: ✓`);
  console.log(`   • Step-by-Step Reveals: ✓`);
});

export default app;
