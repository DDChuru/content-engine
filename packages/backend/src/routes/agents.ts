/**
 * Agent API Routes
 *
 * Endpoints for interacting with specialized domain agents.
 */

import * as express from 'express';
import { Request, Response } from 'express';
import { agentRegistry } from '../agents/registry.js';
import { AgentOrchestrator } from '../agents/orchestrator.js';
import { SetsAgent } from '../agents/sets/agent.js';

const router = express.Router();

// Initialize orchestrator
const orchestrator = new AgentOrchestrator(agentRegistry);

// Register available agents
function initializeAgents() {
  // Register Sets agent
  const setsAgent = new SetsAgent();
  agentRegistry.register(setsAgent);

  console.log('[Agents] Initialized agents:');
  const catalog = agentRegistry.getAgentCatalog();
  catalog.forEach(agent => {
    console.log(`  - ${agent.name} (${agent.domain})`);
  });
}

// Initialize on module load
initializeAgents();

/**
 * GET /api/agents
 * List all available agents
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const agents = orchestrator.getAvailableAgents();

    res.json({
      success: true,
      agents,
      count: agents.length
    });
  } catch (error) {
    console.error('[Agents] Error listing agents:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/agents/:domain
 * Get details for a specific agent
 */
router.get('/:domain', async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    const agent = agentRegistry.getAgent(domain);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: `Agent not found: ${domain}`
      });
    }

    const metadata = agent.getMetadata();
    const context = await agent.getContext();

    res.json({
      success: true,
      agent: {
        ...metadata,
        contextPreview: context.substring(0, 500) + '...',
        contextLength: context.length
      }
    });
  } catch (error) {
    console.error(`[Agents] Error getting agent ${req.params.domain}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/agents/:domain/context
 * Get full context for a specific agent
 */
router.get('/:domain/context', async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    const agent = agentRegistry.getAgent(domain);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: `Agent not found: ${domain}`
      });
    }

    const context = await agent.getContext();

    res.json({
      success: true,
      domain,
      context,
      length: context.length
    });
  } catch (error) {
    console.error(`[Agents] Error getting context for ${req.params.domain}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/agents/analyze
 * Analyze a task and get routing recommendations
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { description, context, requiredCapabilities } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required'
      });
    }

    const task = {
      id: `analyze-${Date.now()}`,
      description,
      context,
      requiredCapabilities
    };

    const analysis = await orchestrator.analyzeTask(task);

    res.json({
      success: true,
      analysis: {
        recommended: analysis.recommended ? {
          domain: analysis.recommended.agent.getMetadata().domain,
          name: analysis.recommended.agent.getMetadata().name,
          confidence: analysis.recommended.confidence,
          matchedKeywords: analysis.recommended.matchedKeywords
        } : null,
        alternatives: analysis.alternatives.map(alt => ({
          domain: alt.agent.getMetadata().domain,
          name: alt.agent.getMetadata().name,
          confidence: alt.confidence,
          matchedKeywords: alt.matchedKeywords
        })),
        explanation: analysis.explanation
      }
    });
  } catch (error) {
    console.error('[Agents] Error analyzing task:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/agents/invoke
 * Invoke the best agent for a task
 */
router.post('/invoke', async (req: Request, res: Response) => {
  try {
    const { description, context, requiredCapabilities, preferredDomain } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required'
      });
    }

    const task = {
      id: `task-${Date.now()}`,
      description,
      context,
      requiredCapabilities
    };

    console.log(`[Agents] Invoking task: ${description}`);

    const result = await orchestrator.routeTask(task, {
      preferredDomain,
      requireConfidence: 0.3
    });

    res.json({
      success: result.success,
      result: {
        output: result.output,
        error: result.error,
        agentUsed: result.agentUsed,
        confidence: result.confidence,
        matchedKeywords: result.matchedKeywords,
        alternativeAgents: result.alternativeAgents,
        executionTimeMs: result.metadata.executionTimeMs,
        tokensUsed: result.metadata.tokensUsed,
        cost: result.metadata.cost
      }
    });
  } catch (error) {
    console.error('[Agents] Error invoking task:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/agents/:domain/invoke
 * Directly invoke a specific agent
 */
router.post('/:domain/invoke', async (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    const { description, context } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required'
      });
    }

    const agent = agentRegistry.getAgent(domain);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: `Agent not found: ${domain}`
      });
    }

    const task = {
      id: `direct-${domain}-${Date.now()}`,
      description,
      context
    };

    console.log(`[Agents] Direct invocation of ${domain}: ${description}`);

    const result = await agent.invoke(task);

    res.json({
      success: result.success,
      result: {
        output: result.output,
        error: result.error,
        executionTimeMs: result.metadata.executionTimeMs
      }
    });
  } catch (error) {
    console.error(`[Agents] Error invoking ${req.params.domain}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
