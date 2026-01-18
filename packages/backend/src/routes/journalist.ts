/**
 * Journalist Studio Routes
 *
 * Persistence for documentary projects, scenes, and generated media
 */

import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const router = Router();

// Storage paths
const PROJECTS_DIR = path.join(process.cwd(), 'output', 'journalist-projects');
const IMAGES_DIR = path.join(process.cwd(), 'output', 'journalist-images');

interface Scene {
  id: string;
  title: string;
  narration: string;
  imagePrompt: string;
  imageUrl: string | null;
  imagePath: string | null;  // Local file path
  videoPrompt: string;
  videoUrl: string | null;
  videoPath: string | null;  // Local file path
  duration: number;
}

interface Project {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
  research?: any;
}

// Ensure directories exist
async function ensureDirs() {
  await fs.mkdir(PROJECTS_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

/**
 * GET /api/journalist/projects
 * List all projects
 */
router.get('/projects', async (req: Request, res: Response) => {
  try {
    await ensureDirs();
    const files = await fs.readdir(PROJECTS_DIR);
    const projects = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(PROJECTS_DIR, file), 'utf-8');
        const project = JSON.parse(content);
        projects.push({
          id: project.id,
          name: project.name,
          subject: project.subject,
          sceneCount: project.scenes?.length || 0,
          updatedAt: project.updatedAt
        });
      }
    }

    res.json({ projects });
  } catch (error: any) {
    console.error('[Journalist] Error listing projects:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/journalist/projects/:id
 * Get a specific project with all scenes
 */
router.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    await ensureDirs();
    const projectPath = path.join(PROJECTS_DIR, `${req.params.id}.json`);

    const content = await fs.readFile(projectPath, 'utf-8');
    const project = JSON.parse(content);

    // Convert local image paths to URLs
    for (const scene of project.scenes) {
      if (scene.imagePath && !scene.imageUrl) {
        scene.imageUrl = `/output/journalist-images/${path.basename(scene.imagePath)}`;
      }
      if (scene.videoPath && !scene.videoUrl) {
        scene.videoUrl = `/output/journalist-videos/${path.basename(scene.videoPath)}`;
      }
    }

    res.json(project);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Project not found' });
    }
    console.error('[Journalist] Error loading project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/journalist/projects
 * Create or update a project
 */
router.post('/projects', async (req: Request, res: Response) => {
  try {
    await ensureDirs();
    const { id, name, subject, scenes, research } = req.body;

    const projectId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const projectPath = path.join(PROJECTS_DIR, `${projectId}.json`);

    // Check if project exists
    let existingProject: Project | null = null;
    try {
      const content = await fs.readFile(projectPath, 'utf-8');
      existingProject = JSON.parse(content);
    } catch (e) {
      // New project
    }

    const project: Project = {
      id: projectId,
      name: name || existingProject?.name || 'Untitled Project',
      subject: subject || existingProject?.subject || '',
      createdAt: existingProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: scenes || existingProject?.scenes || [],
      research: research || existingProject?.research
    };

    await fs.writeFile(projectPath, JSON.stringify(project, null, 2));

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('[Journalist] Error saving project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/journalist/projects/:id/scenes/:sceneId/image
 * Save a generated image for a scene
 */
router.post('/projects/:id/scenes/:sceneId/image', async (req: Request, res: Response) => {
  try {
    await ensureDirs();
    const { id, sceneId } = req.params;
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // Extract base64 data
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Save image to disk
    const filename = `${id}_scene_${sceneId}_${Date.now()}.png`;
    const imagePath = path.join(IMAGES_DIR, filename);
    await fs.writeFile(imagePath, imageBuffer);

    // Update project with image path
    const projectPath = path.join(PROJECTS_DIR, `${id}.json`);
    let project: Project;

    try {
      const content = await fs.readFile(projectPath, 'utf-8');
      project = JSON.parse(content);
    } catch (e) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update scene with image path
    const sceneIndex = project.scenes.findIndex(s => s.id === sceneId);
    if (sceneIndex >= 0) {
      project.scenes[sceneIndex].imagePath = imagePath;
      project.scenes[sceneIndex].imageUrl = `/output/journalist-images/${filename}`;
      project.updatedAt = new Date().toISOString();
      await fs.writeFile(projectPath, JSON.stringify(project, null, 2));
    }

    const imageUrl = `/output/journalist-images/${filename}`;
    console.log(`[Journalist] Saved image: ${imagePath}`);

    res.json({
      success: true,
      imagePath,
      imageUrl
    });
  } catch (error: any) {
    console.error('[Journalist] Error saving image:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/journalist/projects/:id/scenes
 * Update all scenes for a project
 */
router.put('/projects/:id/scenes', async (req: Request, res: Response) => {
  try {
    await ensureDirs();
    const { id } = req.params;
    const { scenes } = req.body;

    const projectPath = path.join(PROJECTS_DIR, `${id}.json`);
    let project: Project;

    try {
      const content = await fs.readFile(projectPath, 'utf-8');
      project = JSON.parse(content);
    } catch (e) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Process scenes - save any new base64 images
    for (const scene of scenes) {
      if (scene.imageUrl && scene.imageUrl.startsWith('data:')) {
        // Save base64 image to disk
        const base64Data = scene.imageUrl.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        const filename = `${id}_scene_${scene.id}_${Date.now()}.png`;
        const imagePath = path.join(IMAGES_DIR, filename);
        await fs.writeFile(imagePath, imageBuffer);

        scene.imagePath = imagePath;
        scene.imageUrl = `/output/journalist-images/${filename}`;
        console.log(`[Journalist] Auto-saved image: ${filename}`);
      }
    }

    project.scenes = scenes;
    project.updatedAt = new Date().toISOString();

    await fs.writeFile(projectPath, JSON.stringify(project, null, 2));

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('[Journalist] Error updating scenes:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/journalist/projects/:id
 * Delete a project
 */
router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    const projectPath = path.join(PROJECTS_DIR, `${req.params.id}.json`);
    await fs.unlink(projectPath);
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
