/**
 * Agent Orchestrator
 *
 * Smart routing system that delegates tasks to specialist agents.
 * "Jack of all trades, master of some" - routes to masters.
 */

import { AgentTask, AgentResult, DomainAgent } from './base-agent';
import { AgentRegistry, AgentMatch } from './registry';

export interface OrchestrationOptions {
  preferredDomain?: string;
  requireConfidence?: number;
  fallbackToGeneral?: boolean;
}

export interface OrchestrationResult extends AgentResult {
  agentUsed: string;
  confidence: number;
  matchedKeywords: string[];
  alternativeAgents?: string[];
}

export class AgentOrchestrator {
  constructor(private registry: AgentRegistry) {}

  /**
   * Route a task to the best specialist agent
   */
  async routeTask(
    task: AgentTask,
    options: OrchestrationOptions = {}
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();

    // If preferred domain specified, try that first
    if (options.preferredDomain) {
      const preferredAgent = this.registry.getAgent(options.preferredDomain);
      if (preferredAgent && preferredAgent.canHandle(task)) {
        console.log(`[Orchestrator] Using preferred agent: ${options.preferredDomain}`);
        return this.executeWithAgent(preferredAgent, task, 1.0, [], startTime);
      }
    }

    // Find best matching agent
    const match = this.registry.findBestAgent(task);

    if (!match) {
      return this.createErrorResult(
        'No suitable agent found for task',
        task,
        startTime
      );
    }

    // Check confidence threshold
    const minConfidence = options.requireConfidence ?? 0.3;
    if (match.confidence < minConfidence) {
      return this.createErrorResult(
        `Best agent confidence (${match.confidence.toFixed(2)}) below threshold (${minConfidence})`,
        task,
        startTime
      );
    }

    // Find alternative agents
    const allMatches = this.registry.findAllMatchingAgents(task);
    const alternativeAgents = allMatches
      .slice(1, 4) // Top 3 alternatives
      .map(m => m.agent.getMetadata().domain);

    console.log(`[Orchestrator] Routing to: ${match.agent.getMetadata().name} (confidence: ${match.confidence.toFixed(2)})`);
    if (alternativeAgents.length > 0) {
      console.log(`[Orchestrator] Alternatives: ${alternativeAgents.join(', ')}`);
    }

    return this.executeWithAgent(
      match.agent,
      task,
      match.confidence,
      match.matchedKeywords,
      startTime,
      alternativeAgents
    );
  }

  /**
   * Get routing recommendations without executing
   */
  async analyzeTask(task: AgentTask): Promise<{
    recommended: AgentMatch | null;
    alternatives: AgentMatch[];
    explanation: string;
  }> {
    const allMatches = this.registry.findAllMatchingAgents(task);

    if (allMatches.length === 0) {
      return {
        recommended: null,
        alternatives: [],
        explanation: 'No agents found that can handle this task.'
      };
    }

    const recommended = allMatches[0];
    const alternatives = allMatches.slice(1, 4);

    let explanation = `Best match: ${recommended.agent.getMetadata().name} `;
    explanation += `(confidence: ${recommended.confidence.toFixed(2)}, `;
    explanation += `keywords: ${recommended.matchedKeywords.join(', ')})`;

    if (alternatives.length > 0) {
      explanation += `\n\nAlternatives:\n`;
      for (const alt of alternatives) {
        explanation += `- ${alt.agent.getMetadata().name} (${alt.confidence.toFixed(2)})\n`;
      }
    }

    return { recommended, alternatives, explanation };
  }

  /**
   * List all available agents
   */
  getAvailableAgents(): Array<{
    domain: string;
    name: string;
    description: string;
    capabilities: string[];
  }> {
    const catalog = this.registry.getAgentCatalog();

    return catalog.map(metadata => ({
      domain: metadata.domain,
      name: metadata.name,
      description: metadata.description,
      capabilities: metadata.capabilities.map(c => c.keyword)
    }));
  }

  /**
   * Execute task with a specific agent
   */
  private async executeWithAgent(
    agent: DomainAgent,
    task: AgentTask,
    confidence: number,
    matchedKeywords: string[],
    startTime: number,
    alternativeAgents?: string[]
  ): Promise<OrchestrationResult> {
    try {
      const result = await agent.invoke(task);
      const executionTime = Date.now() - startTime;

      return {
        ...result,
        agentUsed: agent.getMetadata().domain,
        confidence,
        matchedKeywords,
        alternativeAgents,
        metadata: {
          ...result.metadata,
          executionTimeMs: executionTime
        }
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        agentUsed: agent.getMetadata().domain,
        confidence,
        matchedKeywords,
        alternativeAgents,
        metadata: {
          agentDomain: agent.getMetadata().domain,
          executionTimeMs: executionTime
        }
      };
    }
  }

  /**
   * Create error result when no agent found
   */
  private createErrorResult(
    error: string,
    task: AgentTask,
    startTime: number
  ): OrchestrationResult {
    return {
      success: false,
      error,
      agentUsed: 'none',
      confidence: 0,
      matchedKeywords: [],
      metadata: {
        agentDomain: 'none',
        executionTimeMs: Date.now() - startTime
      }
    };
  }
}
