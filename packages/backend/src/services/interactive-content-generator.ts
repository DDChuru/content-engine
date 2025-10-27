/**
 * Interactive Content Generator
 *
 * Generates step-by-step interactive educational content using:
 * - Claude AI for content structure and explanations
 * - D3 for data visualizations
 * - Manim for mathematical animations
 */

import Anthropic from '@anthropic-ai/sdk';
import { D3VizEngine, VizData } from './d3-viz-engine.js';
import { UnifiedD3ManimRenderer } from './unified-d3-manim-renderer.js';
import {
  InteractiveProblem,
  InteractiveStep,
  ManimVideoConfig,
  GenerateInteractiveProblemRequest,
  ClaudeInteractiveOutput
} from '../types/interactive-lesson.js';
import fs from 'fs/promises';
import path from 'path';

export class InteractiveContentGenerator {
  private claude: Anthropic;
  private d3Engine: D3VizEngine;
  private manimRenderer: UnifiedD3ManimRenderer;
  private outputDir: string;

  constructor(outputDir: string = 'output/interactive') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable required');
    }

    this.claude = new Anthropic({ apiKey });
    this.d3Engine = new D3VizEngine({
      width: 1920,
      height: 1080,
      style: {
        aesthetic: 'hand-drawn',
        backgroundColor: '#000000',
        colors: {
          primary: '#ffffff',
          secondary: '#1e88e5',
          accent: '#4caf50',
          text: '#ffffff',
          highlight: '#ffeb3b'
        },
        fonts: {
          primary: 'Arial, sans-serif',
          handwriting: 'Caveat, cursive'
        },
        strokeWidth: 3,
        roughness: 1.5
      },
      animation: {
        enabled: true,
        duration: 3,
        fps: 30,
        effects: ['draw']
      }
    });
    this.manimRenderer = new UnifiedD3ManimRenderer(path.join(outputDir, 'manim'));
    this.outputDir = outputDir;
  }

  /**
   * Generate a complete interactive problem with visualizations and videos
   */
  async generateInteractiveProblem(
    request: GenerateInteractiveProblemRequest
  ): Promise<InteractiveProblem> {
    console.log(`[Interactive] Generating problem: ${request.topic}`);

    // 1. Generate problem structure with Claude
    const claudeOutput = await this.generateProblemStructure(request);

    // 2. Create problem object
    const problemId = this.generateId();
    const problem: InteractiveProblem = {
      id: problemId,
      title: `${request.topic} - Interactive Problem`,
      subject: request.topic,
      difficulty: request.difficulty,
      question: {
        text: claudeOutput.problem.text,
        latex: claudeOutput.problem.latex
      },
      steps: [],
      tags: claudeOutput.tags,
      estimatedTime: claudeOutput.steps.length * 2,  // 2 mins per step
      createdAt: new Date()
    };

    // 3. Generate visualizations and videos for each step
    for (let i = 0; i < claudeOutput.steps.length; i++) {
      const stepData = claudeOutput.steps[i];

      console.log(`[Interactive] Generating step ${i + 1}/${claudeOutput.steps.length}: ${stepData.title}`);

      const step: InteractiveStep = {
        id: this.generateId(),
        order: i + 1,
        title: stepData.title,
        explanation: stepData.explanation,
        latex: stepData.latex,
        revealType: 'click',
        transitionEffect: 'fade'
      };

      // Generate D3 visualization if needed
      if (request.includeVisualizations && stepData.visualizationNeeded && stepData.visualizationDescription) {
        try {
          const vizData = await this.generateVisualization(stepData.visualizationDescription, request.topic);
          step.visualization = vizData;
        } catch (error) {
          console.error(`[Interactive] Failed to generate visualization for step ${i + 1}:`, error);
        }
      }

      // Generate Manim video if needed
      if (request.includeVideos && stepData.manimScriptNeeded && stepData.manimScriptDescription) {
        try {
          const manimConfig = await this.generateManimVideo(stepData.manimScriptDescription, problemId, step.id);
          step.manimVideo = manimConfig;
        } catch (error) {
          console.error(`[Interactive] Failed to generate Manim video for step ${i + 1}:`, error);
        }
      }

      problem.steps.push(step);
    }

    // 4. Save problem to disk
    await this.saveProblem(problem);

    console.log(`[Interactive] ✅ Problem generated: ${problem.id}`);
    console.log(`   Steps: ${problem.steps.length}`);
    console.log(`   Visualizations: ${problem.steps.filter(s => s.visualization).length}`);
    console.log(`   Videos: ${problem.steps.filter(s => s.manimVideo).length}`);

    return problem;
  }

  /**
   * Generate problem structure using Claude
   */
  private async generateProblemStructure(
    request: GenerateInteractiveProblemRequest
  ): Promise<ClaudeInteractiveOutput> {
    const prompt = `Generate an interactive step-by-step educational problem on the topic: "${request.topic}"

Difficulty: ${request.difficulty}
Target steps: ${request.steps || 'auto-determine (3-6 steps)'}

Create a problem that:
1. Starts with a clear question
2. Has ${request.steps || '3-6'} logical solution steps
3. ${request.includeVisualizations ? 'Includes data visualizations where helpful (network graphs, comparisons, etc.)' : 'Focuses on text explanations'}
4. ${request.includeVideos ? 'Includes mathematical animations where helpful (equations, transformations, etc.)' : 'No video animations needed'}

For each step, determine:
- Clear explanation in conversational language
- LaTeX notation for any math (if applicable)
- Whether a D3 visualization would help (e.g., network graph, comparison chart, timeline)
- Whether a Manim animation would help (e.g., equation derivation, geometric transformation)

Return a JSON object with this structure:
{
  "problem": {
    "text": "The question...",
    "latex": "Optional LaTeX representation"
  },
  "steps": [
    {
      "title": "Step 1: ...",
      "explanation": "Detailed explanation...",
      "latex": "Optional LaTeX...",
      "visualizationNeeded": true/false,
      "visualizationDescription": "What to visualize (e.g., 'network graph showing relationships between X and Y')",
      "manimScriptNeeded": true/false,
      "manimScriptDescription": "What to animate (e.g., 'show derivative of f(x) = x^2 step by step')"
    }
  ],
  "learningObjectives": ["objective 1", "objective 2"],
  "tags": ["tag1", "tag2"]
}`;

    const message = await this.claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response');
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const output: ClaudeInteractiveOutput = JSON.parse(jsonText);

    return output;
  }

  /**
   * Generate D3 visualization from natural language description
   */
  private async generateVisualization(description: string, topic: string): Promise<VizData> {
    // Use Claude to convert description to VizData structure
    const prompt = `Convert this visualization description into a D3 visualization data structure:

Description: "${description}"
Topic: ${topic}

Return a JSON object that matches one of these types:

Network Graph:
{
  "type": "network",
  "nodes": [
    { "id": "node1", "label": "Label", "size": 30 }
  ],
  "links": [
    { "source": "node1", "target": "node2" }
  ]
}

Comparison:
{
  "type": "comparison",
  "title": "Title",
  "groups": [
    {
      "name": "Group A",
      "items": ["item1", "item2"],
      "metrics": { "value": 100 },
      "visual": { "type": "box", "style": "sketchy" }
    }
  ]
}

Choose the best type based on the description. Return ONLY the JSON object, no explanation.`;

    const message = await this.claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse visualization data');
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const vizData: VizData = JSON.parse(jsonText);

    return vizData;
  }

  /**
   * Generate Manim video from natural language description
   */
  private async generateManimVideo(
    description: string,
    problemId: string,
    stepId: string
  ): Promise<ManimVideoConfig> {
    // Use Claude to convert description to Manim Python script
    const prompt = `Generate a Manim Python script for this mathematical animation:

Description: "${description}"

Requirements:
- Use Manim Community syntax
- Black background (#000000)
- White/blue/green color scheme
- 4-6 seconds duration
- Clear, educational animation
- Include Write, Create, Transform animations

Return ONLY the Python code for the construct() method body (no class definition, no imports).

Example:
equation = MathTex(r"f(x) = x^2")
self.play(Write(equation), run_time=2)
derivative = MathTex(r"f'(x) = 2x")
derivative.next_to(equation, DOWN)
self.play(Transform(equation, derivative), run_time=2)
self.wait(1)`;

    const message = await this.claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract Python code
    const codeMatch = responseText.match(/```python\n([\s\S]*?)\n```/);
    const manimScript = codeMatch ? codeMatch[1] : responseText;

    // Render video with Manim
    const videoDir = path.join(this.outputDir, 'videos', problemId);
    await fs.mkdir(videoDir, { recursive: true });

    const videoPath = path.join(videoDir, `${stepId}.mp4`);

    const config: ManimVideoConfig = {
      script: manimScript,
      duration: 5,
      dimensions: {
        width: 1920,
        height: 1080
      },
      videoUrl: `/api/interactive/videos/${problemId}/${stepId}.mp4`,
      renderMode: 'cached'  // Will be rendered on-demand if not exists
    };

    return config;
  }

  /**
   * Save problem to disk
   */
  private async saveProblem(problem: InteractiveProblem): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
    const filePath = path.join(this.outputDir, `${problem.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(problem, null, 2));
  }

  /**
   * Load problem from disk
   */
  async loadProblem(problemId: string): Promise<InteractiveProblem | null> {
    try {
      const filePath = path.join(this.outputDir, `${problemId}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Render a step's visualization on-demand
   */
  async renderStepVisualization(step: InteractiveStep, problemId: string): Promise<string | null> {
    if (!step.visualization) return null;

    const vizDir = path.join(this.outputDir, 'visualizations', problemId);
    await fs.mkdir(vizDir, { recursive: true });

    const vizPath = path.join(vizDir, `${step.id}.mp4`);

    // Check if already rendered
    try {
      await fs.access(vizPath);
      return `/api/interactive/visualizations/${problemId}/${step.id}.mp4`;
    } catch {
      // Need to render
      const output = await this.d3Engine.visualize(step.visualization);
      await this.d3Engine.framesToVideo(output.frames, vizPath);
      return `/api/interactive/visualizations/${problemId}/${step.id}.mp4`;
    }
  }

  /**
   * Render a step's Manim video on-demand
   */
  async renderStepManimVideo(step: InteractiveStep, problemId: string): Promise<string | null> {
    if (!step.manimVideo) return null;

    const videoPath = path.join(this.outputDir, 'videos', problemId, `${step.id}.mp4`);

    // Check if already rendered
    try {
      await fs.access(videoPath);
      return step.manimVideo.videoUrl || null;
    } catch {
      // Need to render
      const scene = {
        manimScript: step.manimVideo.script,
        layout: 'unified-manim' as const,
        dimensions: step.manimVideo.dimensions,
        duration: step.manimVideo.duration
      };

      const output = await this.manimRenderer.renderUnifiedManim(scene);

      // Move to expected location
      await fs.mkdir(path.dirname(videoPath), { recursive: true });
      await fs.copyFile(output.videoPath, videoPath);

      return step.manimVideo.videoUrl || null;
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
