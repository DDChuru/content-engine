/**
 * Agent Registry API Routes
 *
 * Endpoints for managing specialist agents:
 * - List all agents
 * - Load/unload agents
 * - Route problems to agents
 * - Create/clone agents
 * - Get memory usage stats
 */

import { Router } from 'express';
import { ClaudeService } from '../services/claude.js';
import { AgentRegistry } from '../services/agent-registry.js';

const router = Router();

// Singleton registry
let registry: AgentRegistry | null = null;

function getRegistry(claudeService: ClaudeService): AgentRegistry {
  if (!registry) {
    registry = new AgentRegistry(claudeService);
    // Initialize asynchronously
    registry.initialize().catch(console.error);
  }
  return registry;
}

/**
 * GET /api/agents
 *
 * List all registered agents
 */
router.get('/', async (req, res) => {
  try {
    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    const agents = reg.getRegisteredAgents();
    const loaded = reg.getLoadedAgents();
    const usage = reg.getMemoryUsage();

    res.json({
      success: true,
      agents: agents.map(a => ({
        ...a,
        isLoaded: loaded.includes(a.id)
      })),
      stats: usage
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/route
 *
 * Route a problem to the best specialist agent
 *
 * Body: { "problem": "Find A ∩ B where..." }
 */
router.post('/route', async (req, res) => {
  try {
    const { problem } = req.body;

    if (!problem) {
      return res.status(400).json({
        success: false,
        error: 'problem is required'
      });
    }

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    const decision = await reg.routeProblem(problem);

    res.json({
      success: true,
      routing: decision,
      agent: reg.getAgentMetadata(decision.agentId)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/:agentId/load
 *
 * Load an agent into memory
 */
router.post('/:agentId/load', async (req, res) => {
  try {
    const { agentId } = req.params;

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    await reg.loadAgent(agentId);

    res.json({
      success: true,
      message: `Agent ${agentId} loaded`,
      loadedAgents: reg.getLoadedAgents()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/:agentId/unload
 *
 * Unload an agent from memory
 */
router.post('/:agentId/unload', async (req, res) => {
  try {
    const { agentId } = req.params;

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    await reg.unloadAgent(agentId);

    res.json({
      success: true,
      message: `Agent ${agentId} unloaded`,
      loadedAgents: reg.getLoadedAgents()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/unload-all
 *
 * Unload all agents (free memory)
 */
router.post('/unload-all', async (req, res) => {
  try {
    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    await reg.unloadAll();

    res.json({
      success: true,
      message: 'All agents unloaded'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/create
 *
 * Create a new specialist agent
 *
 * Body: {
 *   "id": "trigonometry",
 *   "name": "Trigonometry Agent",
 *   "description": "Specialist in trigonometry problems",
 *   "topics": ["sine", "cosine", "tangent", "unit circle"]
 * }
 */
router.post('/create', async (req, res) => {
  try {
    const { id, name, description, topics } = req.body;

    if (!id || !name || !description || !topics) {
      return res.status(400).json({
        success: false,
        error: 'id, name, description, and topics are required'
      });
    }

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    await reg.createAgent(id, name, description, topics);

    res.json({
      success: true,
      message: `Created agent: ${name}`,
      agent: reg.getAgentMetadata(id)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/:agentId/clone
 *
 * Clone an existing agent (copy memory)
 *
 * Body: {
 *   "newId": "sets-advanced",
 *   "newName": "Advanced Sets Agent"
 * }
 */
router.post('/:agentId/clone', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { newId, newName } = req.body;

    if (!newId || !newName) {
      return res.status(400).json({
        success: false,
        error: 'newId and newName are required'
      });
    }

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    await reg.cloneAgent(agentId, newId, newName);

    res.json({
      success: true,
      message: `Cloned ${agentId} → ${newId}`,
      newAgent: reg.getAgentMetadata(newId)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agents/memory-usage
 *
 * Get memory usage statistics
 */
router.get('/memory-usage', async (req, res) => {
  try {
    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    const usage = reg.getMemoryUsage();

    res.json({
      success: true,
      usage: {
        ...usage,
        loadedAgents: reg.getLoadedAgents(),
        efficiency: {
          contextSavings: usage.totalMemoryKB < 50 ? 'High' : usage.totalMemoryKB < 150 ? 'Medium' : 'Low',
          recommendation: usage.loadedAgents > 3 ? 'Consider unloading unused agents' : 'Memory usage optimal'
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agents/initialize-defaults
 *
 * Initialize default specialist agents
 */
router.post('/initialize-defaults', async (req, res) => {
  try {
    const claudeService = req.app.locals.claudeService as ClaudeService;
    const reg = getRegistry(claudeService);

    // Register default agents
    const defaults = [
      {
        id: 'sets',
        name: 'Sets Theory Agent',
        description: 'Specialist in set theory problems (union, intersection, complement)',
        topics: ['sets', 'union', 'intersection', 'complement', 'venn diagrams']
      },
      {
        id: 'algebra',
        name: 'Algebra Agent',
        description: 'Specialist in algebraic equations and expressions',
        topics: ['equations', 'polynomials', 'factoring', 'quadratics']
      },
      {
        id: 'geometry',
        name: 'Geometry Agent',
        description: 'Specialist in geometric shapes, angles, and proofs',
        topics: ['shapes', 'angles', 'circles', 'triangles', 'proofs']
      },
      {
        id: 'calculus',
        name: 'Calculus Agent',
        description: 'Specialist in differentiation and integration',
        topics: ['derivatives', 'integrals', 'limits', 'optimization']
      },
      {
        id: 'statistics',
        name: 'Statistics Agent',
        description: 'Specialist in data analysis and probability',
        topics: ['mean', 'median', 'mode', 'probability', 'distributions']
      }
    ];

    for (const agent of defaults) {
      await reg.createAgent(agent.id, agent.name, agent.description, agent.topics);
    }

    res.json({
      success: true,
      message: `Initialized ${defaults.length} default agents`,
      agents: reg.getRegisteredAgents()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
