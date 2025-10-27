/**
 * Agent Registry
 *
 * Central registry for all specialist agents.
 * Handles:
 * - Lazy loading (agents only loaded when needed)
 * - Memory isolation (each agent has own context)
 * - Routing (problem → correct agent)
 * - Agent lifecycle (load/unload/persist)
 */

import { ClaudeService } from './claude.js';
import { SetsAgent } from '../agents/sets-agent.js';
import fs from 'fs/promises';
import path from 'path';

export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  topics: string[];
  version: number;
  created: string;
  lastUsed?: string;
  totalProblems: number;
  successRate: number;
  memorySize: number; // in KB
}

export interface RoutingDecision {
  agentId: string;
  confidence: number;
  reasoning: string;
}

export class AgentRegistry {
  private loadedAgents: Map<string, any> = new Map();
  private metadata: Map<string, AgentMetadata> = new Map();
  private claudeService: ClaudeService;
  private registryPath: string;

  constructor(claudeService: ClaudeService, registryPath?: string) {
    this.claudeService = claudeService;
    this.registryPath = registryPath || 'memory/agent-registry.json';
  }

  /**
   * Initialize registry from disk
   */
  async initialize(): Promise<void> {
    try {
      const data = await fs.readFile(this.registryPath, 'utf-8');
      const registry = JSON.parse(data);

      for (const [id, meta] of Object.entries(registry.agents)) {
        this.metadata.set(id, meta as AgentMetadata);
      }

      console.log(`✅ Agent Registry loaded: ${this.metadata.size} agents registered`);
    } catch (error) {
      console.log('📝 No existing registry found, starting fresh');
      await this.saveRegistry();
    }
  }

  /**
   * Save registry to disk
   */
  private async saveRegistry(): Promise<void> {
    const dir = path.dirname(this.registryPath);
    await fs.mkdir(dir, { recursive: true });

    const registry = {
      version: 1,
      agents: Object.fromEntries(this.metadata.entries())
    };

    await fs.writeFile(this.registryPath, JSON.stringify(registry, null, 2));
  }

  /**
   * Register a new agent type
   */
  async registerAgent(metadata: AgentMetadata): Promise<void> {
    this.metadata.set(metadata.id, metadata);
    await this.saveRegistry();
    console.log(`✅ Registered agent: ${metadata.name} (${metadata.id})`);
  }

  /**
   * Load agent (lazy loading - only when needed)
   */
  async loadAgent(agentId: string): Promise<any> {
    // Already loaded?
    if (this.loadedAgents.has(agentId)) {
      console.log(`♻️  Agent ${agentId} already loaded (reusing instance)`);
      return this.loadedAgents.get(agentId);
    }

    console.log(`📥 Loading agent: ${agentId}`);

    // Create agent based on type
    let agent;
    switch (agentId) {
      case 'sets':
        agent = new SetsAgent(this.claudeService, `memory/${agentId}-agent-memory.json`);
        break;

      // TODO: Add more agent types
      case 'algebra':
      case 'geometry':
      case 'calculus':
      case 'statistics':
        throw new Error(`Agent ${agentId} not yet implemented`);

      default:
        throw new Error(`Unknown agent type: ${agentId}`);
    }

    // Cache the loaded agent
    this.loadedAgents.set(agentId, agent);

    // Update last used timestamp
    const meta = this.metadata.get(agentId);
    if (meta) {
      meta.lastUsed = new Date().toISOString();
      await this.saveRegistry();
    }

    return agent;
  }

  /**
   * Unload agent (free memory)
   */
  async unloadAgent(agentId: string): Promise<void> {
    if (this.loadedAgents.has(agentId)) {
      this.loadedAgents.delete(agentId);
      console.log(`📤 Unloaded agent: ${agentId}`);
    }
  }

  /**
   * Unload all agents
   */
  async unloadAll(): Promise<void> {
    const count = this.loadedAgents.size;
    this.loadedAgents.clear();
    console.log(`📤 Unloaded ${count} agents`);
  }

  /**
   * Route problem to best agent
   */
  async routeProblem(problem: string): Promise<RoutingDecision> {
    // Use Claude to analyze problem and route to specialist
    const registeredAgents = Array.from(this.metadata.values());

    const prompt = `You are a routing system for specialist AI agents.

PROBLEM: "${problem}"

AVAILABLE AGENTS:
${registeredAgents.map(a => `- ${a.id}: ${a.description} (topics: ${a.topics.join(', ')})`).join('\n')}

Which agent should handle this problem?

Respond in JSON format:
{
  "agentId": "sets",
  "confidence": 0.95,
  "reasoning": "This is clearly a set theory problem involving intersection"
}`;

    const response = await this.claudeService.chat([
      { role: 'user', content: prompt }
    ]);

    // Extract JSON from response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse routing decision');
    }

    const decision: RoutingDecision = JSON.parse(jsonMatch[0]);

    console.log(`🎯 Routing decision: ${decision.agentId} (confidence: ${(decision.confidence * 100).toFixed(0)}%)`);
    console.log(`   Reasoning: ${decision.reasoning}`);

    return decision;
  }

  /**
   * Get all registered agents
   */
  getRegisteredAgents(): AgentMetadata[] {
    return Array.from(this.metadata.values());
  }

  /**
   * Get loaded agents (currently in memory)
   */
  getLoadedAgents(): string[] {
    return Array.from(this.loadedAgents.keys());
  }

  /**
   * Get agent metadata
   */
  getAgentMetadata(agentId: string): AgentMetadata | undefined {
    return this.metadata.get(agentId);
  }

  /**
   * Update agent statistics after problem solving
   */
  async updateAgentStats(
    agentId: string,
    success: boolean,
    memorySize: number
  ): Promise<void> {
    const meta = this.metadata.get(agentId);
    if (!meta) return;

    meta.totalProblems++;
    meta.memorySize = memorySize;

    // Update success rate (running average)
    const oldSuccessCount = Math.round(meta.successRate * (meta.totalProblems - 1));
    const newSuccessCount = oldSuccessCount + (success ? 1 : 0);
    meta.successRate = newSuccessCount / meta.totalProblems;

    await this.saveRegistry();
  }

  /**
   * Create new agent from template
   */
  async createAgent(
    id: string,
    name: string,
    description: string,
    topics: string[]
  ): Promise<void> {
    const metadata: AgentMetadata = {
      id,
      name,
      description,
      topics,
      version: 1,
      created: new Date().toISOString(),
      totalProblems: 0,
      successRate: 0,
      memorySize: 0
    };

    await this.registerAgent(metadata);
  }

  /**
   * Clone agent (copy memory to new agent)
   */
  async cloneAgent(sourceId: string, newId: string, newName: string): Promise<void> {
    const sourceMeta = this.metadata.get(sourceId);
    if (!sourceMeta) {
      throw new Error(`Source agent ${sourceId} not found`);
    }

    // Copy metadata
    const newMeta: AgentMetadata = {
      ...sourceMeta,
      id: newId,
      name: newName,
      created: new Date().toISOString(),
      totalProblems: 0,
      successRate: 0
    };

    await this.registerAgent(newMeta);

    // Copy memory file
    const sourceMemoryPath = `memory/${sourceId}-agent-memory.json`;
    const newMemoryPath = `memory/${newId}-agent-memory.json`;

    try {
      const memoryContent = await fs.readFile(sourceMemoryPath, 'utf-8');
      await fs.writeFile(newMemoryPath, memoryContent);
      console.log(`✅ Cloned ${sourceId} → ${newId} (memory copied)`);
    } catch (error) {
      console.log(`⚠️  No memory file to clone for ${sourceId}`);
    }
  }

  /**
   * Get memory usage statistics
   */
  getMemoryUsage(): {
    totalAgents: number;
    loadedAgents: number;
    totalMemoryKB: number;
    averageMemoryKB: number;
  } {
    const agents = Array.from(this.metadata.values());
    const totalMemoryKB = agents.reduce((sum, a) => sum + a.memorySize, 0);

    return {
      totalAgents: agents.length,
      loadedAgents: this.loadedAgents.size,
      totalMemoryKB,
      averageMemoryKB: totalMemoryKB / agents.length || 0
    };
  }
}

export default AgentRegistry;
