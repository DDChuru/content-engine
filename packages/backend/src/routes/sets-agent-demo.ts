/**
 * Sets Agent Demo Routes
 *
 * For the YouTube series: "How I Taught My Sets Tutor Agent"
 *
 * Features:
 * - Reset agent memory (start fresh)
 * - Add rules to memory (teach the agent)
 * - Generate with learning (agent improves)
 * - View memory state (UI visualization)
 * - Export memory (for video overlays)
 */

import { Router } from 'express';
import { ClaudeService } from '../services/claude.js';
import { SetsAgent } from '../agents/sets-agent.js';
import type { SetsProblem } from '../agents/sets-agent.js';

const router = Router();

// Singleton agent instance (persists across requests)
let setsAgent: SetsAgent | null = null;

function getAgent(claudeService: ClaudeService): SetsAgent {
  if (!setsAgent) {
    setsAgent = new SetsAgent(claudeService, 'memory/sets-agent-memory.json');
  }
  return setsAgent;
}

/**
 * POST /api/sets-agent/reset
 *
 * Reset agent memory to empty state (for demo start)
 */
router.post('/reset', async (req, res) => {
  try {
    const claudeService = req.app.locals.claudeService as ClaudeService;
    const agent = getAgent(claudeService);

    await agent.resetMemory();

    res.json({
      success: true,
      message: 'Agent memory reset - starting fresh!',
      memory: await agent.getMemoryState()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sets-agent/teach/spatial
 *
 * Teach the agent a spatial rule
 *
 * Body: { "rule": "Never use arrows to intersection" }
 */
router.post('/teach/spatial', async (req, res) => {
  try {
    const { rule } = req.body;

    if (!rule) {
      return res.status(400).json({
        success: false,
        error: 'rule is required'
      });
    }

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const agent = getAgent(claudeService);

    await agent.addSpatialRule(rule);

    res.json({
      success: true,
      message: `Agent learned: ${rule}`,
      memory: await agent.getMemoryState()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sets-agent/teach/pedagogy
 *
 * Teach the agent a pedagogy rule
 *
 * Body: { "rule": "Explain elements one-by-one conversationally" }
 */
router.post('/teach/pedagogy', async (req, res) => {
  try {
    const { rule } = req.body;

    if (!rule) {
      return res.status(400).json({
        success: false,
        error: 'rule is required'
      });
    }

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const agent = getAgent(claudeService);

    await agent.addPedagogyRule(rule);

    res.json({
      success: true,
      message: `Agent learned: ${rule}`,
      memory: await agent.getMemoryState()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sets-agent/generate
 *
 * Generate visualization with learning
 *
 * Body: {
 *   "operation": "intersection",
 *   "setA": [1,2,3,4,5],
 *   "setB": [4,5,6,7,8],
 *   "question": "Find A ∩ B"
 * }
 */
router.post('/generate', async (req, res) => {
  try {
    const problem: SetsProblem = req.body;

    if (!problem.operation || !problem.setA || !problem.setB) {
      return res.status(400).json({
        success: false,
        error: 'operation, setA, and setB are required'
      });
    }

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const agent = getAgent(claudeService);

    const result = await agent.generateWithLearning(problem);

    res.json({
      success: result.success,
      result: {
        manimScript: result.manimScript,
        collisions: result.collisions,
        clarityScore: result.clarityScore,
        memoryUpdated: result.memoryUpdated
      },
      memory: await agent.getMemoryState()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sets-agent/memory
 *
 * Get current agent memory state (for UI visualization)
 */
router.get('/memory', async (req, res) => {
  try {
    const claudeService = req.app.locals.claudeService as ClaudeService;
    const agent = getAgent(claudeService);

    const memory = await agent.getMemoryState();

    res.json({
      success: true,
      memory: {
        version: memory.version,
        spatialRules: memory.spatialRules,
        pedagogyRules: memory.pedagogyRules,
        successfulPatterns: memory.successfulPatterns.length,
        failures: memory.failures.length,
        totalKnowledge: memory.spatialRules.length + memory.pedagogyRules.length
      },
      fullMemory: memory
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sets-agent/memory/export
 *
 * Export memory in markdown format (for video overlays)
 */
router.get('/memory/export', async (req, res) => {
  try {
    const format = req.query.format as 'json' | 'markdown' || 'markdown';

    const claudeService = req.app.locals.claudeService as ClaudeService;
    const agent = getAgent(claudeService);

    const exported = await agent.exportMemory(format);

    if (format === 'markdown') {
      res.setHeader('Content-Type', 'text/markdown');
    } else {
      res.setHeader('Content-Type', 'application/json');
    }

    res.send(exported);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sets-agent/demo-sequence
 *
 * Run the complete YouTube demo sequence
 *
 * This endpoint orchestrates the entire "How I Taught My Agent" demo:
 * 1. Reset memory
 * 2. Generate (fails with collisions)
 * 3. Teach spatial rule
 * 4. Generate (better)
 * 5. Teach pedagogy rule
 * 6. Generate (perfect!)
 * 7. Test with 4 more problems (all perfect)
 */
router.post('/demo-sequence', async (req, res) => {
  try {
    const claudeService = req.app.locals.claudeService as ClaudeService;
    const agent = getAgent(claudeService);

    const sequence = [];

    // Step 1: Reset
    console.log('\n📺 DEMO STEP 1: Reset agent memory');
    await agent.resetMemory();
    sequence.push({
      step: 1,
      action: 'Reset memory',
      memory: await agent.getMemoryState()
    });

    // Step 2: First attempt (will fail)
    console.log('\n📺 DEMO STEP 2: First attempt (expect collision)');
    const problem1: SetsProblem = {
      operation: 'intersection',
      setA: [1, 2, 3, 4, 5],
      setB: [4, 5, 6, 7, 8],
      question: 'Find A ∩ B'
    };

    const attempt1 = await agent.generateWithLearning(problem1);
    sequence.push({
      step: 2,
      action: 'First generation attempt',
      result: {
        success: attempt1.success,
        collisions: attempt1.collisions,
        clarityScore: attempt1.clarityScore
      },
      memory: await agent.getMemoryState()
    });

    // Step 3: Teach spatial rule
    console.log('\n📺 DEMO STEP 3: Teaching spatial rule');
    await agent.addSpatialRule('Never use arrows - they cause collisions');
    await agent.addSpatialRule('Use absolute positioning for answer (y=-3.2)');
    sequence.push({
      step: 3,
      action: 'Taught spatial rules',
      memory: await agent.getMemoryState()
    });

    // Step 4: Second attempt (better)
    console.log('\n📺 DEMO STEP 4: Second attempt (should be better)');
    const attempt2 = await agent.generateWithLearning(problem1);
    sequence.push({
      step: 4,
      action: 'Second generation attempt',
      result: {
        success: attempt2.success,
        collisions: attempt2.collisions,
        clarityScore: attempt2.clarityScore
      },
      memory: await agent.getMemoryState()
    });

    // Step 5: Teach pedagogy rule
    console.log('\n📺 DEMO STEP 5: Teaching pedagogy rule');
    await agent.addPedagogyRule('Explain elements one-by-one conversationally');
    await agent.addPedagogyRule('Use "Let\'s look at X..." pattern');
    await agent.addPedagogyRule('Show "in A only" vs "in BOTH"');
    sequence.push({
      step: 5,
      action: 'Taught pedagogy rules',
      memory: await agent.getMemoryState()
    });

    // Step 6: Third attempt (should be perfect)
    console.log('\n📺 DEMO STEP 6: Third attempt (should be perfect)');
    const attempt3 = await agent.generateWithLearning(problem1);
    sequence.push({
      step: 6,
      action: 'Third generation attempt',
      result: {
        success: attempt3.success,
        collisions: attempt3.collisions,
        clarityScore: attempt3.clarityScore
      },
      memory: await agent.getMemoryState()
    });

    // Step 7: Test with NEW problems (should all succeed)
    console.log('\n📺 DEMO STEP 7: Testing with 4 new problems');
    const testProblems: SetsProblem[] = [
      {
        operation: 'union',
        setA: [1, 2, 3],
        setB: [3, 4, 5],
        question: 'Find A ∪ B'
      },
      {
        operation: 'intersection',
        setA: ['a', 'b', 'c'],
        setB: ['b', 'c', 'd'],
        question: 'Find A ∩ B'
      },
      {
        operation: 'difference',
        setA: [1, 2, 3, 4],
        setB: [3, 4],
        question: 'Find A - B'
      },
      {
        operation: 'intersection',
        setA: [10, 20, 30],
        setB: [20, 30, 40],
        question: 'Find A ∩ B'
      }
    ];

    const testResults = [];
    for (const problem of testProblems) {
      const result = await agent.generateWithLearning(problem);
      testResults.push({
        problem: problem.question,
        success: result.success,
        collisions: result.collisions,
        clarityScore: result.clarityScore
      });
    }

    sequence.push({
      step: 7,
      action: 'Tested with 4 new problems',
      results: testResults,
      memory: await agent.getMemoryState()
    });

    res.json({
      success: true,
      message: 'Demo sequence complete!',
      sequence,
      finalMemory: await agent.getMemoryState(),
      summary: {
        initialAttempt: { collisions: attempt1.collisions, clarity: attempt1.clarityScore },
        afterSpatialRules: { collisions: attempt2.collisions, clarity: attempt2.clarityScore },
        afterPedagogyRules: { collisions: attempt3.collisions, clarity: attempt3.clarityScore },
        testProblemsSuccess: testResults.filter(r => r.success).length,
        totalRulesLearned: (await agent.getMemoryState()).spatialRules.length +
                          (await agent.getMemoryState()).pedagogyRules.length
      }
    });

  } catch (error: any) {
    console.error('Demo sequence failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
