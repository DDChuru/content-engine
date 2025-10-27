/**
 * Examples Generator Service
 *
 * Generates worked example problems with step-by-step solutions.
 * Creates videos showing the solution process using Manim animations.
 *
 * Layer 2 of the 3-layer content generation system.
 */

import { ClaudeService } from './claude.js';
import { videoRenderer, WebSlidesScene } from './video-renderer.js';
import { ManimRenderer, ManimScene } from './manim-renderer.js';
import { GeminiImageGenerator } from './gemini-image-generator.js';
import * as path from 'path';
import { promises as fs } from 'fs';
import { ThemeName } from '../remotion/components/webslides/themes.js';

// ============================================================================
// Interfaces
// ============================================================================

export interface ExampleProblem {
  id: string;
  problem: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solution: {
    steps: SolutionStep[];
    finalAnswer: string;
  };
  metadata?: {
    subtopic?: string;
    requiredKnowledge?: string[];
  };
}

export interface SolutionStep {
  stepNumber: number;
  description: string;
  workShown: string;
  explanation: string;
}

export interface ExampleVideo {
  id: string;
  problem: string;
  videoPath: string;
  duration: number;
  cost: number;
}

export interface ExamplesGenerationResult {
  success: boolean;
  examples: ExampleVideo[];
  totalDuration: number;
  totalCost: number;
  error?: string;
}

export interface ExamplesGenerationOptions {
  topicTitle: string;
  topicCode: string;
  level: 'Core' | 'Extended';
  concepts: string[];  // List of concept titles from Layer 1
  targetCount?: number;  // Number of examples to generate (default: 3)
  theme?: ThemeName;
  outputDir: string;
}

// ============================================================================
// Examples Generator Service
// ============================================================================

export class ExamplesGenerator {
  private claudeService: ClaudeService;
  private manimRenderer: ManimRenderer;
  private geminiGenerator: GeminiImageGenerator;

  constructor(claudeService: ClaudeService) {
    this.claudeService = claudeService;
    this.manimRenderer = new ManimRenderer();
    this.geminiGenerator = new GeminiImageGenerator(process.env.GEMINI_API_KEY || '');
  }

  /**
   * Generate worked examples for a topic
   */
  async generateExamples(options: ExamplesGenerationOptions): Promise<ExamplesGenerationResult> {
    console.log(`\n[ExamplesGenerator] Generating examples for: ${options.topicTitle}`);
    console.log(`  Target count: ${options.targetCount || 3}`);
    console.log(`  Level: ${options.level}`);

    try {
      // Step 1: Generate example problems using Claude
      const problems = await this.generateExampleProblems(options);

      console.log(`  ✓ Generated ${problems.length} example problems`);

      // Step 2: Create videos for each example
      const exampleVideos: ExampleVideo[] = [];
      let totalCost = 0;

      for (const problem of problems) {
        const video = await this.createExampleVideo(problem, options);
        exampleVideos.push(video);
        totalCost += video.cost;
      }

      const totalDuration = exampleVideos.reduce((sum, ex) => sum + ex.duration, 0);

      console.log(`  ✓ Created ${exampleVideos.length} example videos`);
      console.log(`  ✓ Total duration: ${totalDuration}s`);
      console.log(`  ✓ Total cost: $${totalCost.toFixed(2)}`);

      return {
        success: true,
        examples: exampleVideos,
        totalDuration,
        totalCost
      };

    } catch (error: any) {
      console.error('[ExamplesGenerator] Error:', error);
      return {
        success: false,
        examples: [],
        totalDuration: 0,
        totalCost: 0,
        error: error.message
      };
    }
  }

  /**
   * Generate example problems using Claude
   */
  private async generateExampleProblems(options: ExamplesGenerationOptions): Promise<ExampleProblem[]> {
    const targetCount = options.targetCount || 3;

    // For Sets topic, use pre-built examples (high quality, tested)
    if (options.topicTitle.toLowerCase().includes('set')) {
      return this.generateSetsExamples();
    }

    // For other topics, use Claude to generate
    return this.generateGenericExamples(options, targetCount);
  }

  /**
   * Generate examples for Sets topic (pre-built, high quality)
   */
  private generateSetsExamples(): ExampleProblem[] {
    return [
      {
        id: 'example-1',
        problem: 'Find A ∪ B where A = {1, 2, 3} and B = {3, 4, 5}',
        difficulty: 'easy',
        solution: {
          steps: [
            {
              stepNumber: 1,
              description: 'Understand the problem',
              workShown: 'A ∪ B means the union of sets A and B',
              explanation: 'The union contains all elements that are in A, or in B, or in both sets.'
            },
            {
              stepNumber: 2,
              description: 'List elements in A',
              workShown: 'A = {1, 2, 3}',
              explanation: 'Set A contains three elements: 1, 2, and 3.'
            },
            {
              stepNumber: 3,
              description: 'List elements in B',
              workShown: 'B = {3, 4, 5}',
              explanation: 'Set B contains three elements: 3, 4, and 5.'
            },
            {
              stepNumber: 4,
              description: 'Combine all elements',
              workShown: 'A ∪ B = {1, 2, 3, 4, 5}',
              explanation: 'Take all elements from both sets. The element 3 appears in both, so we only include it once.'
            }
          ],
          finalAnswer: '{1, 2, 3, 4, 5}'
        },
        metadata: {
          subtopic: 'Union operation',
          requiredKnowledge: ['Set notation', 'Union definition']
        }
      },
      {
        id: 'example-2',
        problem: 'Find A ∩ B where A = {1, 2, 3, 4} and B = {3, 4, 5, 6}',
        difficulty: 'easy',
        solution: {
          steps: [
            {
              stepNumber: 1,
              description: 'Understand the problem',
              workShown: 'A ∩ B means the intersection of sets A and B',
              explanation: 'The intersection contains only elements that appear in BOTH sets.'
            },
            {
              stepNumber: 2,
              description: 'Check each element in A',
              workShown: '1 ∈ A, but 1 ∉ B\n2 ∈ A, but 2 ∉ B\n3 ∈ A and 3 ∈ B ✓\n4 ∈ A and 4 ∈ B ✓',
              explanation: 'Go through each element in A and check if it also appears in B.'
            },
            {
              stepNumber: 3,
              description: 'Write the intersection',
              workShown: 'A ∩ B = {3, 4}',
              explanation: 'Only 3 and 4 appear in both sets, so the intersection is {3, 4}.'
            }
          ],
          finalAnswer: '{3, 4}'
        },
        metadata: {
          subtopic: 'Intersection operation',
          requiredKnowledge: ['Set notation', 'Intersection definition']
        }
      },
      {
        id: 'example-3',
        problem: "Find A' where A = {1, 2, 3} and ξ = {1, 2, 3, 4, 5, 6}",
        difficulty: 'medium',
        solution: {
          steps: [
            {
              stepNumber: 1,
              description: 'Understand the problem',
              workShown: "A' means the complement of set A",
              explanation: "The complement contains all elements in the universal set ξ that are NOT in A."
            },
            {
              stepNumber: 2,
              description: 'Identify the universal set',
              workShown: 'ξ = {1, 2, 3, 4, 5, 6}',
              explanation: 'The universal set contains all possible elements we are considering.'
            },
            {
              stepNumber: 3,
              description: 'Identify set A',
              workShown: 'A = {1, 2, 3}',
              explanation: 'Set A contains elements 1, 2, and 3.'
            },
            {
              stepNumber: 4,
              description: 'Find elements NOT in A',
              workShown: "A' = {4, 5, 6}",
              explanation: 'Remove elements of A from ξ. The remaining elements are 4, 5, and 6.'
            }
          ],
          finalAnswer: '{4, 5, 6}'
        },
        metadata: {
          subtopic: 'Complement operation',
          requiredKnowledge: ['Set notation', 'Universal set', 'Complement definition']
        }
      }
    ];
  }

  /**
   * Generate generic examples using Claude
   */
  private async generateGenericExamples(
    options: ExamplesGenerationOptions,
    count: number
  ): Promise<ExampleProblem[]> {
    const prompt = `Generate ${count} worked example problems for the topic: ${options.topicTitle} (${options.topicCode})

Level: ${options.level}
Target age: 14-16 years (Cambridge IGCSE)
Concepts covered: ${options.concepts.join(', ')}

For each example, provide:
1. A clear problem statement
2. Difficulty level (easy/medium/hard)
3. Step-by-step solution with 3-5 steps
4. Each step should have:
   - Step number
   - Description of what we're doing
   - Work shown (equations, calculations)
   - Explanation (why we're doing this)
5. Final answer

Format as JSON array:
[
  {
    "id": "example-1",
    "problem": "...",
    "difficulty": "easy" | "medium" | "hard",
    "solution": {
      "steps": [
        {
          "stepNumber": 1,
          "description": "...",
          "workShown": "...",
          "explanation": "..."
        }
      ],
      "finalAnswer": "..."
    }
  }
]`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    const content = response.content[0]?.text || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Failed to parse examples from Claude');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Create video for a worked example
   */
  private async createExampleVideo(
    problem: ExampleProblem,
    options: ExamplesGenerationOptions
  ): Promise<ExampleVideo> {
    console.log(`\n  [Example ${problem.id}] Creating video: "${problem.problem}"`);

    // Calculate narration for the example
    const narration = this.generateNarration(problem);
    const narrationLength = narration.length;

    // Estimate duration based on narration (150 words per minute = 2.5 chars per second)
    const estimatedDuration = Math.max(180, Math.ceil(narrationLength / 2.5));

    // Generate visual assets
    const visualsDir = path.join(options.outputDir, 'visuals');
    await fs.mkdir(visualsDir, { recursive: true });

    // Scene 1: Problem statement background (Gemini image)
    console.log(`    🖼️  Generating problem statement background...`);
    const problemImageResult = await this.geminiGenerator.generateImage({
      concept: 'Mathematics problem background',
      description: 'Clean professional background for displaying a mathematical problem',
      style: 'minimal',
      outputDir: visualsDir,
      allowText: false  // NO TEXT - problem will be overlaid
    });

    if (!problemImageResult.success || !problemImageResult.imagePath) {
      throw new Error(`Problem background generation failed: ${problemImageResult.error}`);
    }

    // Scene 2: Solution animation (Manim)
    console.log(`    🎬 Generating solution animation...`);
    const solutionManimScene: ManimScene = {
      sceneType: 'worked_example',
      concept: `Solution for ${problem.id}`,
      parameters: {
        title: 'Solution',
        targetDuration: estimatedDuration - 20
      }
    };

    const solutionVideoPath = await this.manimRenderer.renderAnimation(solutionManimScene, 'low');

    // Create scenes for this example
    const scenes: WebSlidesScene[] = [
      // Scene 1: Problem statement (Gemini background image)
      {
        id: 1,
        title: `Example: ${problem.id.replace('example-', '')}`,
        subtitle: options.topicTitle,
        mathNotation: problem.problem,
        visual: problemImageResult.imagePath,
        duration: 20,
        type: 'gemini'
      },
      // Scene 2: Solution steps (Manim animation)
      {
        id: 2,
        title: 'Solution',
        subtitle: 'Step-by-step walkthrough',
        visual: solutionVideoPath,
        duration: estimatedDuration - 20,
        type: 'manim'
      }
    ];

    // Render video
    const videoFilename = `${problem.id}.mp4`;
    const outputPath = path.join(options.outputDir, 'examples', videoFilename);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const renderResult = await videoRenderer.quickRender(
      scenes,
      videoFilename,
      options.theme || 'education-dark'
    );

    // Calculate cost (narration only for now, Manim is FREE)
    const cost = (narrationLength / 1000) * 0.30;  // ElevenLabs $0.30/1K chars

    console.log(`    ✓ Video created: ${videoFilename}`);
    console.log(`    ✓ Duration: ${estimatedDuration}s`);
    console.log(`    ✓ Cost: $${cost.toFixed(2)}`);

    return {
      id: problem.id,
      problem: problem.problem,
      videoPath: renderResult.videoPath || outputPath,
      duration: estimatedDuration,
      cost
    };
  }

  /**
   * Generate narration script for an example
   */
  private generateNarration(problem: ExampleProblem): string {
    let narration = `Let's work through this example together. The problem asks: ${problem.problem}\n\n`;

    for (const step of problem.solution.steps) {
      narration += `Step ${step.stepNumber}: ${step.description}. `;
      narration += `${step.explanation} `;
      if (step.workShown) {
        narration += `Here's the work: ${step.workShown}. `;
      }
      narration += '\n\n';
    }

    narration += `Therefore, our final answer is: ${problem.solution.finalAnswer}. `;
    narration += `Make sure you understand each step before moving on!`;

    return narration;
  }

  /**
   * Get example by ID (for testing/debugging)
   */
  async getExampleById(id: string, topicTitle: string): Promise<ExampleProblem | null> {
    if (topicTitle.toLowerCase().includes('set')) {
      const examples = this.generateSetsExamples();
      return examples.find(ex => ex.id === id) || null;
    }

    return null;
  }
}
