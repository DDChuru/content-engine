/**
 * Content Engine Cloud Backend
 * Main API server with Firebase and Claude integration
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeFirebase } from './services/firebase.js';
import { ClaudeService } from './services/claude.js';
import { ContentGenerator } from './services/content-generator.js';
import { GitHubService } from './services/github.js';
import chatRoutes from './routes/chat.js';
import generateRoutes from './routes/generate.js';
import firebaseRoutes from './routes/firebase.js';
import healthRoutes from './routes/health.js';

// Load environment variables from root directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

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

// Initialize GitHub
const githubService = new GitHubService(process.env.GITHUB_TOKEN!);

// Make services available to routes
app.locals.claude = claudeService;
app.locals.contentGenerator = contentGenerator;
app.locals.github = githubService;

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/firebase', firebaseRoutes);

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
  console.log(`   • GitHub: ${githubService ? '✓' : '✗'}`);
  console.log(`   • Firebase Projects: Check /api/health/firebase`);
});

export default app;