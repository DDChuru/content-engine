/**
 * Health check routes
 */

import { Router, Request, Response } from 'express';
import { getAllFirebaseProjects } from '../services/firebase.js';

const router = Router();

/**
 * Basic health check
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Check Firebase connections
 */
router.get('/firebase', (req: Request, res: Response) => {
  const projects = getAllFirebaseProjects();
  const projectStatus: any = {};

  projects.forEach((project, name) => {
    projectStatus[name] = {
      initialized: !!project.app,
      hasFirestore: !!project.db,
      hasStorage: !!project.storage,
      hasAuth: !!project.auth
    };
  });

  res.json({
    totalProjects: projects.size,
    projects: projectStatus
  });
});

/**
 * Check API keys
 */
router.get('/apis', (req: Request, res: Response) => {
  res.json({
    claude: !!process.env.ANTHROPIC_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    github: !!process.env.GITHUB_TOKEN,
    firebase: {
      iclean: !!process.env.ICLEAN_FIREBASE_KEY,
      haccp: !!process.env.HACCP_FIREBASE_KEY,
      math: !!process.env.MATH_FIREBASE_KEY,
      peakflow: !!process.env.PEAKFLOW_FIREBASE_KEY
    }
  });
});

export default router;