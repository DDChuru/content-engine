/**
 * Agent Registry
 *
 * Central registry for discovering and accessing specialized domain agents.
 * Uses keyword-based matching to route tasks to the right specialist.
 */

import { DomainAgent, AgentTask, AgentMetadata } from './base-agent';

export interface AgentMatch {
  agent: DomainAgent;
  confidence: number;
  matchedKeywords: string[];
}

export class AgentRegistry {
  private agents: Map<string, DomainAgent> = new Map();

  /**
   * Register a new domain agent
   */
  register(agent: DomainAgent): void {
    const metadata = agent.getMetadata();
    this.agents.set(metadata.domain, agent);
    console.log(`[AgentRegistry] Registered agent: ${metadata.name} (${metadata.domain})`);
  }

  /**
   * Unregister an agent
   */
  unregister(domain: string): boolean {
    return this.agents.delete(domain);
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): DomainAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by domain name
   */
  getAgent(domain: string): DomainAgent | undefined {
    return this.agents.get(domain);
  }

  /**
   * Find the best agent for a task using keyword matching
   */
  findBestAgent(task: AgentTask): AgentMatch | null {
    const matches: AgentMatch[] = [];

    for (const agent of Array.from(this.agents.values())) {
      if (!agent.canHandle(task)) {
        continue;
      }

      const match = this.calculateMatch(agent, task);
      if (match.confidence > 0) {
        matches.push(match);
      }
    }

    if (matches.length === 0) {
      return null;
    }

    // Sort by confidence (descending)
    matches.sort((a, b) => b.confidence - a.confidence);

    return matches[0];
  }

  /**
   * Find all agents that can handle a task
   */
  findAllMatchingAgents(task: AgentTask): AgentMatch[] {
    const matches: AgentMatch[] = [];

    for (const agent of Array.from(this.agents.values())) {
      if (!agent.canHandle(task)) {
        continue;
      }

      const match = this.calculateMatch(agent, task);
      if (match.confidence > 0) {
        matches.push(match);
      }
    }

    // Sort by confidence (descending)
    matches.sort((a, b) => b.confidence - a.confidence);

    return matches;
  }

  /**
   * Get metadata for all registered agents
   */
  getAgentCatalog(): AgentMetadata[] {
    return Array.from(this.agents.values()).map(agent => agent.getMetadata());
  }

  /**
   * Calculate confidence score for agent-task match
   */
  private calculateMatch(agent: DomainAgent, task: AgentTask): AgentMatch {
    const metadata = agent.getMetadata();
    const taskLower = task.description.toLowerCase();
    const matchedKeywords: string[] = [];
    let score = 0;

    // Check each capability keyword
    for (const capability of metadata.capabilities) {
      const keyword = capability.keyword.toLowerCase();

      if (taskLower.includes(keyword)) {
        matchedKeywords.push(capability.keyword);

        // Weight: exact match > partial match
        if (taskLower.split(/\s+/).includes(keyword)) {
          score += 2; // Exact word match
        } else {
          score += 1; // Contains keyword
        }

        // Bonus: check if task matches examples
        for (const example of capability.examples) {
          const exampleLower = example.toLowerCase();
          if (taskLower.includes(exampleLower) || exampleLower.includes(taskLower)) {
            score += 1.5;
            break;
          }
        }
      }
    }

    // Bonus: required capabilities match
    if (task.requiredCapabilities && task.requiredCapabilities.length > 0) {
      const agentKeywords = metadata.capabilities.map(c => c.keyword.toLowerCase());
      const matchCount = task.requiredCapabilities.filter(req =>
        agentKeywords.includes(req.toLowerCase())
      ).length;

      score += matchCount * 3; // High weight for explicit requirements
    }

    // Normalize confidence to 0-1 range
    const maxPossibleScore = metadata.capabilities.length * 3;
    const confidence = Math.min(score / maxPossibleScore, 1.0);

    return {
      agent,
      confidence,
      matchedKeywords
    };
  }
}

/**
 * Global singleton registry instance
 */
export const agentRegistry = new AgentRegistry();
