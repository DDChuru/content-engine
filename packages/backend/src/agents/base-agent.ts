/**
 * Base Agent Interface
 *
 * Defines the contract for all specialized domain agents in the system.
 * Each agent is a MASTER of one domain (vs jack of all trades).
 */

export interface AgentCapability {
  keyword: string;
  description: string;
  examples: string[];
}

export interface AgentMetadata {
  domain: string;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  contextFile: string;
  toolsPath?: string;
  version: string;
}

export interface AgentTask {
  id: string;
  description: string;
  context?: Record<string, any>;
  requiredCapabilities?: string[];
}

export interface AgentResult {
  success: boolean;
  output?: any;
  error?: string;
  metadata: {
    agentDomain: string;
    executionTimeMs: number;
    tokensUsed?: number;
    cost?: number;
  };
}

/**
 * Base interface that all specialized agents must implement
 */
export interface DomainAgent {
  /**
   * Get agent metadata (capabilities, domain, etc.)
   */
  getMetadata(): AgentMetadata;

  /**
   * Check if this agent can handle a specific task
   */
  canHandle(task: AgentTask): boolean;

  /**
   * Execute a task within this agent's domain
   */
  invoke(task: AgentTask): Promise<AgentResult>;

  /**
   * Get the full context (CONTEXT.md content) for this agent
   */
  getContext(): Promise<string>;
}

/**
 * Abstract base class providing common functionality
 */
export abstract class BaseAgent implements DomainAgent {
  protected abstract metadata: AgentMetadata;

  getMetadata(): AgentMetadata {
    return this.metadata;
  }

  canHandle(task: AgentTask): boolean {
    // Default: check if task keywords match agent capabilities
    const taskLower = task.description.toLowerCase();

    for (const capability of this.metadata.capabilities) {
      const keyword = capability.keyword.toLowerCase();
      if (taskLower.includes(keyword)) {
        return true;
      }
    }

    // Check required capabilities if specified
    if (task.requiredCapabilities && task.requiredCapabilities.length > 0) {
      const agentKeywords = this.metadata.capabilities.map(c => c.keyword.toLowerCase());
      return task.requiredCapabilities.some(req =>
        agentKeywords.includes(req.toLowerCase())
      );
    }

    return false;
  }

  abstract invoke(task: AgentTask): Promise<AgentResult>;
  abstract getContext(): Promise<string>;
}
