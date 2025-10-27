/**
 * Self-Learning Sets Agent
 *
 * A specialized agent that:
 * - Learns from failures (collisions, unclear explanations)
 * - Builds up memory of successful patterns
 * - Only loaded when needed (memory efficient)
 * - Domain-specific to set theory problems
 */

import { ClaudeService } from '../services/claude.js';
import fs from 'fs/promises';
import path from 'path';

export interface AgentMemory {
  spatialRules: string[];
  pedagogyRules: string[];
  successfulPatterns: SuccessfulPattern[];
  failures: Failure[];
  version: number;
}

export interface SuccessfulPattern {
  problem: string;
  approach: string;
  collisions: number;
  clarityScore: number;
  timestamp: string;
}

export interface Failure {
  problem: string;
  approach: string;
  issue: string;
  lesson: string;
  timestamp: string;
}

export interface SetsProblem {
  operation: 'intersection' | 'union' | 'complement' | 'difference';
  setA: number[] | string[];
  setB: number[] | string[];
  question: string;
}

export interface SetsVisualizationResult {
  success: boolean;
  manimScript: string;
  d3Script: string;
  collisions: number;
  clarityScore: number;
  memoryUpdated: boolean;
}

export class SetsAgent {
  private memory: AgentMemory;
  private memoryPath: string;
  private claudeService: ClaudeService;
  private isLoaded: boolean = false;

  constructor(claudeService: ClaudeService, memoryPath?: string) {
    this.claudeService = claudeService;
    this.memoryPath = memoryPath || 'memory/sets-agent-memory.json';

    // Lazy loading - memory not loaded until needed
    this.memory = this.getEmptyMemory();
  }

  /**
   * Initialize with empty memory (for new agents)
   */
  private getEmptyMemory(): AgentMemory {
    return {
      spatialRules: [],
      pedagogyRules: [],
      successfulPatterns: [],
      failures: [],
      version: 1
    };
  }

  /**
   * Lazy load memory only when needed
   */
  private async loadMemory(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const memoryFile = await fs.readFile(this.memoryPath, 'utf-8');
      this.memory = JSON.parse(memoryFile);
      console.log(`✅ Loaded Sets Agent memory (v${this.memory.version})`);
      console.log(`   Rules: ${this.memory.spatialRules.length} spatial, ${this.memory.pedagogyRules.length} pedagogy`);
      console.log(`   Patterns: ${this.memory.successfulPatterns.length} successful, ${this.memory.failures.length} failures`);
    } catch (error) {
      console.log('📝 No existing memory found, starting fresh');
      this.memory = this.getEmptyMemory();
    }

    this.isLoaded = true;
  }

  /**
   * Save memory to disk
   */
  private async saveMemory(): Promise<void> {
    const dir = path.dirname(this.memoryPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.memoryPath, JSON.stringify(this.memory, null, 2));
    console.log(`💾 Saved Sets Agent memory (v${this.memory.version})`);
  }

  /**
   * Add a spatial rule to memory
   */
  async addSpatialRule(rule: string): Promise<void> {
    await this.loadMemory();

    if (!this.memory.spatialRules.includes(rule)) {
      this.memory.spatialRules.push(rule);
      this.memory.version++;
      await this.saveMemory();
      console.log(`✅ Learned spatial rule: ${rule}`);
    }
  }

  /**
   * Add a pedagogy rule to memory
   */
  async addPedagogyRule(rule: string): Promise<void> {
    await this.loadMemory();

    if (!this.memory.pedagogyRules.includes(rule)) {
      this.memory.pedagogyRules.push(rule);
      this.memory.version++;
      await this.saveMemory();
      console.log(`✅ Learned pedagogy rule: ${rule}`);
    }
  }

  /**
   * Record a successful pattern
   */
  private async recordSuccess(pattern: SuccessfulPattern): Promise<void> {
    this.memory.successfulPatterns.push({
      ...pattern,
      timestamp: new Date().toISOString()
    });
    this.memory.version++;
    await this.saveMemory();
  }

  /**
   * Record a failure and the lesson learned
   */
  private async recordFailure(failure: Failure): Promise<void> {
    this.memory.failures.push({
      ...failure,
      timestamp: new Date().toISOString()
    });
    this.memory.version++;
    await this.saveMemory();
  }

  /**
   * Get current memory state (for UI visualization)
   */
  async getMemoryState(): Promise<AgentMemory> {
    await this.loadMemory();
    return { ...this.memory };
  }

  /**
   * Generate Manim script using learned patterns
   */
  async generateManimScript(problem: SetsProblem): Promise<string> {
    await this.loadMemory();

    // Build context from memory
    const memoryContext = this.buildMemoryContext();

    const prompt = `You are a Sets Tutor Agent that has learned from experience.

PROBLEM: ${problem.question}
Operation: ${problem.operation}
Set A: {${problem.setA.join(', ')}}
Set B: {${problem.setB.join(', ')}}

YOUR LEARNED KNOWLEDGE:
${memoryContext}

Generate a Manim Python script that:

1. CONVERSATIONAL APPROACH (like rubber ducking):
   - Go through each element one by one
   - Say "Let's look at 1... is it in A? Yes. Is it in B? No."
   - Highlight the element as you talk about it
   - Explain where it goes: "So 1 goes only in A"

2. SPATIAL RULES (learned from failures):
${this.memory.spatialRules.map(r => `   - ${r}`).join('\n')}

3. PEDAGOGY RULES (learned from successes):
${this.memory.pedagogyRules.map(r => `   - ${r}`).join('\n')}

Return ONLY the Python code, no explanations.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    // Extract code from response
    const responseText = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const codeMatch = responseText.match(/```python\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : responseText;
  }

  /**
   * Build context string from memory
   */
  private buildMemoryContext(): string {
    let context = '';

    if (this.memory.successfulPatterns.length > 0) {
      context += `SUCCESSFUL PATTERNS (${this.memory.successfulPatterns.length}):\n`;
      this.memory.successfulPatterns.slice(-3).forEach(p => {
        context += `- ${p.problem}: ${p.approach} (clarity: ${p.clarityScore}/10, collisions: ${p.collisions})\n`;
      });
    }

    if (this.memory.failures.length > 0) {
      context += `\nLESSONS FROM FAILURES (${this.memory.failures.length}):\n`;
      this.memory.failures.slice(-3).forEach(f => {
        context += `- ${f.issue}: ${f.lesson}\n`;
      });
    }

    return context || 'No learned patterns yet - learning from scratch!';
  }

  /**
   * Generate visualization with self-learning
   */
  async generateWithLearning(problem: SetsProblem): Promise<SetsVisualizationResult> {
    await this.loadMemory();

    console.log('\n🎓 Sets Agent generating visualization...');
    console.log(`   Memory version: ${this.memory.version}`);
    console.log(`   Learned rules: ${this.memory.spatialRules.length + this.memory.pedagogyRules.length}`);

    try {
      const manimScript = await this.generateManimScript(problem);

      // Analyze the generated script for quality
      const analysis = await this.analyzeScript(manimScript);

      if (analysis.hasCollisions) {
        // Learn from failure
        await this.recordFailure({
          problem: problem.question,
          approach: 'Generated script had collisions',
          issue: 'Spatial collision detected',
          lesson: 'Need to enforce stricter spatial constraints',
          timestamp: new Date().toISOString()
        });

        console.log('❌ Collision detected - agent learning...');

        // Auto-add rule if not already known
        if (!this.memory.spatialRules.includes('Use absolute positioning for answer (y=-3.2)')) {
          await this.addSpatialRule('Use absolute positioning for answer (y=-3.2)');
        }

        return {
          success: false,
          manimScript,
          d3Script: '',
          collisions: analysis.collisionCount,
          clarityScore: analysis.clarityScore,
          memoryUpdated: true
        };
      }

      // Record success
      await this.recordSuccess({
        problem: problem.question,
        approach: 'Conversational element-by-element explanation',
        collisions: 0,
        clarityScore: analysis.clarityScore,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Perfect generation - pattern recorded!');

      return {
        success: true,
        manimScript,
        d3Script: '', // TODO: Generate D3 side
        collisions: 0,
        clarityScore: analysis.clarityScore,
        memoryUpdated: true
      };

    } catch (error: any) {
      console.error('❌ Generation failed:', error.message);

      await this.recordFailure({
        problem: problem.question,
        approach: 'Script generation',
        issue: error.message,
        lesson: 'Need better error handling',
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  /**
   * Analyze generated script for collisions and clarity
   */
  private async analyzeScript(script: string): Promise<{
    hasCollisions: boolean;
    collisionCount: number;
    clarityScore: number;
  }> {
    // Simple heuristic analysis
    // In production, this would actually render and check

    const hasArrows = script.includes('Arrow(');
    const hasAbsolutePositioning = script.includes('move_to([');
    const hasConversationalStyle = script.includes('is it in') || script.includes('Let\'s look');

    let clarityScore = 5;
    if (hasConversationalStyle) clarityScore += 3;
    if (!hasArrows) clarityScore += 2;

    return {
      hasCollisions: hasArrows && !hasAbsolutePositioning,
      collisionCount: hasArrows ? 1 : 0,
      clarityScore: Math.min(10, clarityScore)
    };
  }

  /**
   * Reset agent memory (for demos)
   */
  async resetMemory(): Promise<void> {
    this.memory = this.getEmptyMemory();
    this.isLoaded = true;
    await this.saveMemory();
    console.log('🔄 Agent memory reset to empty state');
  }

  /**
   * Export memory for visualization/debugging
   */
  async exportMemory(format: 'json' | 'markdown' = 'json'): Promise<string> {
    await this.loadMemory();

    if (format === 'json') {
      return JSON.stringify(this.memory, null, 2);
    }

    // Markdown format for display
    let md = `# Sets Agent Memory (v${this.memory.version})\n\n`;

    md += `## Spatial Rules (${this.memory.spatialRules.length})\n`;
    this.memory.spatialRules.forEach(rule => {
      md += `- ${rule}\n`;
    });

    md += `\n## Pedagogy Rules (${this.memory.pedagogyRules.length})\n`;
    this.memory.pedagogyRules.forEach(rule => {
      md += `- ${rule}\n`;
    });

    md += `\n## Successful Patterns (${this.memory.successfulPatterns.length})\n`;
    this.memory.successfulPatterns.forEach(pattern => {
      md += `- **${pattern.problem}**: ${pattern.approach} (clarity: ${pattern.clarityScore}/10)\n`;
    });

    md += `\n## Failures & Lessons (${this.memory.failures.length})\n`;
    this.memory.failures.forEach(failure => {
      md += `- **${failure.issue}**: ${failure.lesson}\n`;
    });

    return md;
  }
}

export default SetsAgent;
