/**
 * Firebase management routes
 */

import { Router, Request, Response } from 'express';
import {
  getFirebaseProject,
  getAllFirebaseProjects,
  saveToFirestore,
  readFromFirestore,
  queryFirestore,
  uploadToFirebaseStorage
} from '../services/firebase.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * List all Firebase projects
 */
router.get('/projects', (req: Request, res: Response) => {
  const projects = getAllFirebaseProjects();
  const projectList: string[] = [];

  projects.forEach((_, name) => {
    projectList.push(name);
  });

  res.json({
    projects: projectList,
    total: projectList.length
  });
});

/**
 * Get project info
 */
router.get('/projects/:projectName', (req: Request, res: Response) => {
  const { projectName } = req.params;
  const project = getFirebaseProject(projectName);

  if (!project) {
    return res.status(404).json({
      error: `Project ${projectName} not found`
    });
  }

  res.json({
    name: projectName,
    initialized: true,
    hasFirestore: !!project.db,
    hasStorage: !!project.storage,
    hasAuth: !!project.auth
  });
});

/**
 * Save document to Firestore
 */
router.post('/projects/:projectName/firestore/:collection', async (req: Request, res: Response) => {
  try {
    const { projectName, collection } = req.params;
    const { data, docId } = req.body;

    if (!data) {
      return res.status(400).json({
        error: 'Data is required'
      });
    }

    const id = await saveToFirestore(projectName, collection, data, docId);

    res.json({
      success: true,
      documentId: id,
      project: projectName,
      collection
    });
  } catch (error: any) {
    console.error('Firestore save error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Read document from Firestore
 */
router.get('/projects/:projectName/firestore/:collection/:docId', async (req: Request, res: Response) => {
  try {
    const { projectName, collection, docId } = req.params;

    const document = await readFromFirestore(projectName, collection, docId);

    res.json(document);
  } catch (error: any) {
    console.error('Firestore read error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Query Firestore collection
 */
router.get('/projects/:projectName/firestore/:collection', async (req: Request, res: Response) => {
  try {
    const { projectName, collection } = req.params;
    const { limit = '100', orderBy, where } = req.query;

    // Parse where filters
    const filters: any[] = [];
    if (where) {
      try {
        const whereFilters = JSON.parse(where as string);
        filters.push(...whereFilters);
      } catch (e) {
        // Invalid JSON in where clause
      }
    }

    const documents = await queryFirestore(
      projectName,
      collection,
      filters,
      parseInt(limit as string)
    );

    res.json({
      documents,
      total: documents.length,
      project: projectName,
      collection
    });
  } catch (error: any) {
    console.error('Firestore query error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Upload file to Firebase Storage
 */
router.post('/projects/:projectName/storage/upload',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const { projectName } = req.params;
      const { path: filePath } = req.body;

      if (!req.file) {
        return res.status(400).json({
          error: 'No file provided'
        });
      }

      if (!filePath) {
        return res.status(400).json({
          error: 'File path is required'
        });
      }

      const url = await uploadToFirebaseStorage(
        projectName,
        req.file.buffer,
        filePath,
        req.file.mimetype
      );

      res.json({
        success: true,
        url,
        project: projectName,
        path: filePath,
        size: req.file.size
      });
    } catch (error: any) {
      console.error('Storage upload error:', error);
      res.status(500).json({
        error: error.message
      });
    }
  }
);

/**
 * Get recent content from a project
 */
router.get('/projects/:projectName/recent-content', async (req: Request, res: Response) => {
  try {
    const { projectName } = req.params;
    const { limit = '10' } = req.query;

    const content = await queryFirestore(
      projectName,
      'generated_content',
      [],
      parseInt(limit as string)
    );

    res.json({
      content,
      total: content.length,
      project: projectName
    });
  } catch (error: any) {
    console.error('Recent content error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;