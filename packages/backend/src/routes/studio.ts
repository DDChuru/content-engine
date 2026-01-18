/**
 * Studio Routes
 * Handles screenshot uploads and change requests for Education Studio
 */

import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router: Router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../../../');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'screenshots');

// Configure multer for screenshot uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
      cb(null, SCREENSHOTS_DIR);
    } catch (err: any) {
      cb(err, SCREENSHOTS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `studio-screenshot-${timestamp}.png`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * POST /api/studio/screenshot/save
 * Upload a screenshot from the Studio UI
 */
router.post('/screenshot/save', upload.single('screenshot'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No screenshot file uploaded' });
      return;
    }

    const filename = req.file.filename;
    const filepath = req.file.path;

    console.log(`📸 Screenshot saved: ${filename}`);
    console.log(`   Path: ${filepath}`);

    // Save metadata for latest screenshot
    const metadataPath = path.join(SCREENSHOTS_DIR, 'latest-screenshot.json');
    await fs.writeFile(metadataPath, JSON.stringify({
      filename,
      path: filepath,
      timestamp: Date.now(),
      size: req.file.size
    }, null, 2));

    res.json({
      success: true,
      filename,
      path: filepath,
      message: 'Screenshot saved successfully'
    });

    // Emit to WebSocket clients if available
    const io = req.app.locals.studioBridgeIO;
    if (io) {
      io.emit('screenshot-saved', { filename, path: filepath });
    }

  } catch (error: any) {
    console.error('Error saving screenshot:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/studio/screenshot/latest
 * Get metadata for the latest screenshot
 */
router.get('/screenshot/latest', async (req: Request, res: Response) => {
  try {
    const metadataPath = path.join(SCREENSHOTS_DIR, 'latest-screenshot.json');
    const data = await fs.readFile(metadataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: 'No screenshots found' });
  }
});

/**
 * POST /api/studio/change-request
 * Submit a change request from Studio UI
 */
router.post('/change-request', async (req: Request, res: Response) => {
  try {
    const request = {
      ...req.body,
      timestamp: Date.now(),
      id: `req-${Date.now()}`
    };

    const requestsFilePath = path.join(ROOT_DIR, 'studio-change-requests.json');

    // Read existing requests or initialize
    let data: any = { pendingRequests: [], completedRequests: [] };
    try {
      const existingData = await fs.readFile(requestsFilePath, 'utf-8');
      data = JSON.parse(existingData);
    } catch {
      // File doesn't exist yet
    }

    // Add new request
    if (!data.pendingRequests) data.pendingRequests = [];
    data.pendingRequests.push(request);

    // Save to file
    await fs.writeFile(requestsFilePath, JSON.stringify(data, null, 2));

    console.log('📬 Studio change request received:');
    console.log(`   Type: ${request.changeType || request.type}`);
    console.log(`   Step: ${request.step || request.sceneId}`);
    if (request.instruction) {
      console.log(`   Instruction: ${request.instruction.substring(0, 50)}...`);
    }

    res.json({
      success: true,
      requestId: request.id,
      message: 'Change request saved successfully'
    });

    // Notify connected clients
    const io = req.app.locals.studioBridgeIO;
    if (io) {
      io.emit('change-request-received', request);
    }

  } catch (error: any) {
    console.error('Error saving change request:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/studio/change-requests
 * Get all pending change requests
 */
router.get('/change-requests', async (req: Request, res: Response) => {
  try {
    const requestsFilePath = path.join(ROOT_DIR, 'studio-change-requests.json');
    const data = await fs.readFile(requestsFilePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.json({ pendingRequests: [], completedRequests: [] });
  }
});

/**
 * POST /api/studio/clear-requests
 * Clear all pending requests
 */
router.post('/clear-requests', async (req: Request, res: Response) => {
  try {
    const requestsFilePath = path.join(ROOT_DIR, 'studio-change-requests.json');

    let data: any = { pendingRequests: [], completedRequests: [] };
    try {
      const existingData = await fs.readFile(requestsFilePath, 'utf-8');
      data = JSON.parse(existingData);
    } catch {
      // File doesn't exist
    }

    // Move pending to completed
    const cleared = data.pendingRequests || [];
    cleared.forEach((r: any) => {
      r.status = 'cleared';
      r.clearedAt = new Date().toISOString();
    });

    data.completedRequests = [...(data.completedRequests || []), ...cleared];
    data.pendingRequests = [];

    await fs.writeFile(requestsFilePath, JSON.stringify(data, null, 2));

    console.log(`🗑️ Cleared ${cleared.length} pending requests`);

    res.json({
      success: true,
      cleared: cleared.length,
      message: 'Pending requests cleared'
    });

  } catch (error: any) {
    console.error('Error clearing requests:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/studio/instructions
 * Get the current CLAUDE-CODE-INSTRUCTIONS.md content
 */
router.get('/instructions', async (req: Request, res: Response) => {
  try {
    const instructionsPath = path.join(ROOT_DIR, 'CLAUDE-CODE-INSTRUCTIONS.md');
    const content = await fs.readFile(instructionsPath, 'utf-8');
    res.json({
      success: true,
      content,
      path: instructionsPath
    });
  } catch {
    res.json({
      success: false,
      content: null,
      message: 'No instructions file found'
    });
  }
});

// ============================================
// Legacy routes for backwards compatibility
// (HTML studio files call /api/screenshot/save)
// ============================================

/**
 * POST /api/screenshot/save (legacy)
 * Same as /api/studio/screenshot/save
 */
router.post('/save', upload.single('screenshot'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No screenshot file uploaded' });
      return;
    }

    const filename = req.file.filename;
    const filepath = req.file.path;

    console.log(`📸 Screenshot saved: ${filename}`);
    console.log(`   Path: ${filepath}`);

    const metadataPath = path.join(SCREENSHOTS_DIR, 'latest-screenshot.json');
    await fs.writeFile(metadataPath, JSON.stringify({
      filename,
      path: filepath,
      timestamp: Date.now(),
      size: req.file.size
    }, null, 2));

    res.json({
      success: true,
      filename,
      path: filepath,
      message: 'Screenshot saved successfully'
    });

    const io = req.app.locals.studioBridgeIO;
    if (io) {
      io.emit('screenshot-saved', { filename, path: filepath });
    }

  } catch (error: any) {
    console.error('Error saving screenshot:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/screenshot/latest (legacy)
 * Same as /api/studio/screenshot/latest
 */
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const metadataPath = path.join(SCREENSHOTS_DIR, 'latest-screenshot.json');
    const data = await fs.readFile(metadataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: 'No screenshots found' });
  }
});

export default router;
