/**
 * Life Stories Routes
 *
 * Biographical documentary project management with CLI-based orchestrators
 * for scene generation (Gemini Agent, Codex Agent, Claude Code)
 */

import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Storage paths
const PROJECTS_DIR = path.join(process.cwd(), 'output', 'life-stories-projects');
const IMAGES_DIR = path.join(process.cwd(), 'output', 'life-stories-images');
const VIDEOS_DIR = path.join(process.cwd(), 'output', 'life-stories-videos');
const TASKS_FILE = path.join(process.cwd(), 'life-stories-task-queue.json');

// =============================================================================
// TYPES
// =============================================================================

interface Scene {
  id: string;
  title: string;
  narration: string;
  imagePrompt: string;
  imageUrl: string | null;
  imagePath: string | null;
  imageSource: 'generated' | 'uploaded' | null;
  imageSettled: boolean;  // User approved this image for video
  videoPrompt: string;
  videoUrl: string | null;
  videoPath: string | null;
  duration: number;
}

interface Project {
  id: string;
  name: string;
  subject: string;
  dates: string;
  summary: string;
  additionalContext: string;
  sources: string;
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
  research?: any;
}

type Orchestrator = 'gemini' | 'codex' | 'claude';
type TaskStatus = 'queued' | 'processing' | 'completed' | 'failed';

interface GenerationTask {
  id: string;
  projectId: string;
  type: 'scene-generation' | 'image-generation' | 'video-generation';
  orchestrator: Orchestrator;
  status: TaskStatus;
  input: any;
  output?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskQueue {
  tasks: GenerationTask[];
}

// =============================================================================
// HELPERS
// =============================================================================

async function ensureDirs() {
  await fs.mkdir(PROJECTS_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.mkdir(VIDEOS_DIR, { recursive: true });
}

async function loadTaskQueue(): Promise<TaskQueue> {
  try {
    const content = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { tasks: [] };
  }
}

async function saveTaskQueue(queue: TaskQueue): Promise<void> {
  await fs.writeFile(TASKS_FILE, JSON.stringify(queue, null, 2));
}

async function addTask(task: GenerationTask): Promise<void> {
  const queue = await loadTaskQueue();
  queue.tasks.push(task);
  await saveTaskQueue(queue);
}

async function updateTask(taskId: string, updates: Partial<GenerationTask>): Promise<GenerationTask | null> {
  const queue = await loadTaskQueue();
  const index = queue.tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;

  queue.tasks[index] = {
    ...queue.tasks[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await saveTaskQueue(queue);
  return queue.tasks[index];
}

async function getTask(taskId: string): Promise<GenerationTask | null> {
  const queue = await loadTaskQueue();
  return queue.tasks.find(t => t.id === taskId) || null;
}

// Orchestrator configuration (for CLI-based agents)
const ORCHESTRATOR_CONFIG = {
  gemini: {
    name: 'Gemini Agent',
    command: 'gemini-agent',
    description: 'Fast, cost-effective scene generation with Gemini 2.0 Flash'
  },
  codex: {
    name: 'Codex Agent',
    command: 'codex-agent',
    description: 'OpenAI Codex for structured, detailed scene breakdowns'
  },
  claude: {
    name: 'Claude Code',
    command: 'claude-code',
    description: 'Claude via CLI for nuanced, narrative-focused scenes'
  }
};

// =============================================================================
// PROJECT ROUTES
// =============================================================================

/**
 * GET /api/life-stories/projects
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
          dates: project.dates,
          sceneCount: project.scenes?.length || 0,
          settledCount: project.scenes?.filter((s: Scene) => s.imageSettled).length || 0,
          updatedAt: project.updatedAt
        });
      }
    }

    res.json({ projects });
  } catch (error: any) {
    console.error('[Life Stories] Error listing projects:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/life-stories/projects/:id
 * Get a specific project with all scenes
 */
router.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    await ensureDirs();
    const projectPath = path.join(PROJECTS_DIR, `${req.params.id}.json`);

    const content = await fs.readFile(projectPath, 'utf-8');
    const project = JSON.parse(content);

    // Convert local paths to URLs
    for (const scene of project.scenes) {
      if (scene.imagePath && !scene.imageUrl) {
        scene.imageUrl = `/output/life-stories-images/${path.basename(scene.imagePath)}`;
      }
      if (scene.videoPath && !scene.videoUrl) {
        scene.videoUrl = `/output/life-stories-videos/${path.basename(scene.videoPath)}`;
      }
    }

    res.json(project);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Project not found' });
    }
    console.error('[Life Stories] Error loading project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/life-stories/projects
 * Create or update a project
 */
router.post('/projects', async (req: Request, res: Response) => {
  try {
    await ensureDirs();
    const { id, name, subject, dates, summary, additionalContext, sources, scenes, research } = req.body;

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
      name: name || existingProject?.name || 'Untitled Story',
      subject: subject || existingProject?.subject || '',
      dates: dates || existingProject?.dates || '',
      summary: summary || existingProject?.summary || '',
      additionalContext: additionalContext || existingProject?.additionalContext || '',
      sources: sources || existingProject?.sources || '',
      createdAt: existingProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: scenes || existingProject?.scenes || [],
      research: research || existingProject?.research
    };

    await fs.writeFile(projectPath, JSON.stringify(project, null, 2));

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('[Life Stories] Error saving project:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/life-stories/projects/:id
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

// =============================================================================
// SCENE GENERATION ROUTES (Task Queue Pattern)
// =============================================================================

/**
 * POST /api/life-stories/generate-scenes
 * Queue a scene generation task for CLI orchestrator processing
 *
 * Body:
 * - projectId: string
 * - orchestrator: 'gemini' | 'codex' | 'claude'
 * - storyInput: { subject, dates, summary, additionalContext, sources }
 */
router.post('/generate-scenes', async (req: Request, res: Response) => {
  try {
    const { projectId, orchestrator, storyInput } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    if (!orchestrator || !['gemini', 'codex', 'claude'].includes(orchestrator)) {
      return res.status(400).json({ error: 'orchestrator must be gemini, codex, or claude' });
    }

    const validOrchestrator = orchestrator as Orchestrator;

    if (!storyInput) {
      return res.status(400).json({ error: 'storyInput is required' });
    }

    // Create task
    const task: GenerationTask = {
      id: uuidv4(),
      projectId,
      type: 'scene-generation',
      orchestrator: validOrchestrator,
      status: 'queued',
      input: {
        storyInput,
        orchestratorConfig: ORCHESTRATOR_CONFIG[validOrchestrator]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await addTask(task);

    console.log(`[Life Stories] Queued scene generation task ${task.id} for ${validOrchestrator}`);
    console.log(`[Life Stories] CLI command: ${ORCHESTRATOR_CONFIG[validOrchestrator].command}`);

    res.json({
      success: true,
      taskId: task.id,
      status: 'queued',
      orchestrator: validOrchestrator,
      message: `Scene generation queued for ${ORCHESTRATOR_CONFIG[validOrchestrator].name}. Poll /api/life-stories/task/${task.id} for status.`
    });

  } catch (error: any) {
    console.error('[Life Stories] Error queuing scene generation:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/life-stories/task/:taskId
 * Get task status and result
 */
router.get('/task/:taskId', async (req: Request, res: Response) => {
  try {
    const task = await getTask(req.params.taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error: any) {
    console.error('[Life Stories] Error getting task:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/life-stories/task/:taskId/complete
 * Mark a task as completed with output (called by CLI orchestrator)
 */
router.post('/task/:taskId/complete', async (req: Request, res: Response) => {
  try {
    const { output, scenes } = req.body;

    const task = await updateTask(req.params.taskId, {
      status: 'completed',
      output: { scenes: scenes || output }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // If scenes were generated, update the project
    if (scenes && task.projectId) {
      const projectPath = path.join(PROJECTS_DIR, `${task.projectId}.json`);
      try {
        const content = await fs.readFile(projectPath, 'utf-8');
        const project = JSON.parse(content);

        // Map scenes to proper format
        project.scenes = scenes.map((scene: any, index: number) => ({
          id: scene.id || `scene-${index + 1}`,
          title: scene.title || `Scene ${index + 1}`,
          narration: scene.narration || '',
          imagePrompt: scene.imagePrompt || '',
          imageUrl: null,
          imagePath: null,
          imageSource: null,
          imageSettled: false,
          videoPrompt: scene.videoPrompt || '',
          videoUrl: null,
          videoPath: null,
          duration: scene.duration || 10
        }));

        project.updatedAt = new Date().toISOString();
        await fs.writeFile(projectPath, JSON.stringify(project, null, 2));

        console.log(`[Life Stories] Updated project ${task.projectId} with ${scenes.length} scenes`);
      } catch (e) {
        console.warn(`[Life Stories] Could not update project: ${e}`);
      }
    }

    res.json({ success: true, task });
  } catch (error: any) {
    console.error('[Life Stories] Error completing task:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/life-stories/task/:taskId/fail
 * Mark a task as failed (called by CLI orchestrator)
 */
router.post('/task/:taskId/fail', async (req: Request, res: Response) => {
  try {
    const { error: errorMessage } = req.body;

    const task = await updateTask(req.params.taskId, {
      status: 'failed',
      error: errorMessage || 'Unknown error'
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ success: true, task });
  } catch (error: any) {
    console.error('[Life Stories] Error failing task:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/life-stories/tasks/pending
 * Get all pending tasks for CLI orchestrators to pick up
 */
router.get('/tasks/pending', async (req: Request, res: Response) => {
  try {
    const queue = await loadTaskQueue();
    const pendingTasks = queue.tasks.filter(t => t.status === 'queued');
    res.json({ tasks: pendingTasks });
  } catch (error: any) {
    console.error('[Life Stories] Error getting pending tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// IMAGE ROUTES
// =============================================================================

/**
 * POST /api/life-stories/projects/:id/scenes/:sceneId/image
 * Save a generated image for a scene
 */
router.post('/projects/:id/scenes/:sceneId/image', async (req: Request, res: Response) => {
  try {
    await ensureDirs();
    const { id, sceneId } = req.params;
    const { imageBase64, source = 'generated' } = req.body;

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
      project.scenes[sceneIndex].imageUrl = `/output/life-stories-images/${filename}`;
      project.scenes[sceneIndex].imageSource = source;
      project.scenes[sceneIndex].imageSettled = false; // Reset settled state on new image
      project.updatedAt = new Date().toISOString();
      await fs.writeFile(projectPath, JSON.stringify(project, null, 2));
    }

    const imageUrl = `/output/life-stories-images/${filename}`;
    console.log(`[Life Stories] Saved ${source} image: ${imagePath}`);

    res.json({
      success: true,
      imagePath,
      imageUrl,
      source
    });
  } catch (error: any) {
    console.error('[Life Stories] Error saving image:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/life-stories/projects/:id/scenes/:sceneId/settle
 * Settle (approve) an image for video generation
 */
router.post('/projects/:id/scenes/:sceneId/settle', async (req: Request, res: Response) => {
  try {
    const { id, sceneId } = req.params;
    const { settled = true } = req.body;

    const projectPath = path.join(PROJECTS_DIR, `${id}.json`);
    let project: Project;

    try {
      const content = await fs.readFile(projectPath, 'utf-8');
      project = JSON.parse(content);
    } catch (e) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const sceneIndex = project.scenes.findIndex(s => s.id === sceneId);
    if (sceneIndex < 0) {
      return res.status(404).json({ error: 'Scene not found' });
    }

    if (!project.scenes[sceneIndex].imageUrl) {
      return res.status(400).json({ error: 'Scene has no image to settle' });
    }

    project.scenes[sceneIndex].imageSettled = settled;
    project.updatedAt = new Date().toISOString();
    await fs.writeFile(projectPath, JSON.stringify(project, null, 2));

    console.log(`[Life Stories] Scene ${sceneId} image ${settled ? 'settled' : 'unsettled'}`);

    res.json({
      success: true,
      sceneId,
      imageSettled: settled
    });
  } catch (error: any) {
    console.error('[Life Stories] Error settling image:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/life-stories/projects/:id/scenes
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
        scene.imageUrl = `/output/life-stories-images/${filename}`;
        console.log(`[Life Stories] Auto-saved image: ${filename}`);
      }
    }

    project.scenes = scenes;
    project.updatedAt = new Date().toISOString();

    await fs.writeFile(projectPath, JSON.stringify(project, null, 2));

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('[Life Stories] Error updating scenes:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// VIDEO GENERATION ROUTES
// =============================================================================

/**
 * POST /api/life-stories/projects/:id/scenes/:sceneId/generate-video
 * Generate video for a settled scene using Veo 3
 */
router.post('/projects/:id/scenes/:sceneId/generate-video', async (req: Request, res: Response) => {
  try {
    const { id, sceneId } = req.params;
    const { duration = 8 } = req.body;

    const projectPath = path.join(PROJECTS_DIR, `${id}.json`);
    let project: Project;

    try {
      const content = await fs.readFile(projectPath, 'utf-8');
      project = JSON.parse(content);
    } catch (e) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const scene = project.scenes.find(s => s.id === sceneId);
    if (!scene) {
      return res.status(404).json({ error: 'Scene not found' });
    }

    if (!scene.imageSettled) {
      return res.status(400).json({ error: 'Scene image must be settled before generating video' });
    }

    if (!scene.imagePath) {
      return res.status(400).json({ error: 'Scene has no image for video generation' });
    }

    // Queue video generation task
    const task: GenerationTask = {
      id: uuidv4(),
      projectId: id,
      type: 'video-generation',
      orchestrator: 'claude', // Video gen uses internal service, not CLI
      status: 'queued',
      input: {
        sceneId,
        imagePath: scene.imagePath,
        videoPrompt: scene.videoPrompt || scene.narration,
        duration
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await addTask(task);

    console.log(`[Life Stories] Queued video generation for scene ${sceneId}`);

    res.json({
      success: true,
      taskId: task.id,
      status: 'queued',
      message: `Video generation queued. Poll /api/life-stories/task/${task.id} for status.`
    });

  } catch (error: any) {
    console.error('[Life Stories] Error queuing video generation:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/life-stories/projects/:id/settled-scenes
 * Get all scenes with settled images (ready for video)
 */
router.get('/projects/:id/settled-scenes', async (req: Request, res: Response) => {
  try {
    const projectPath = path.join(PROJECTS_DIR, `${req.params.id}.json`);
    const content = await fs.readFile(projectPath, 'utf-8');
    const project = JSON.parse(content);

    const settledScenes = project.scenes.filter((s: Scene) => s.imageSettled && s.imagePath);

    res.json({
      projectId: req.params.id,
      totalScenes: project.scenes.length,
      settledCount: settledScenes.length,
      settledScenes: settledScenes.map((s: Scene) => ({
        id: s.id,
        title: s.title,
        imageUrl: s.imageUrl,
        videoPrompt: s.videoPrompt,
        hasVideo: !!s.videoUrl
      }))
    });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/life-stories/orchestrators
 * Get available orchestrators for scene generation
 */
router.get('/orchestrators', (req: Request, res: Response) => {
  res.json({
    orchestrators: Object.entries(ORCHESTRATOR_CONFIG).map(([key, config]) => ({
      id: key,
      ...config
    }))
  });
});

export default router;
