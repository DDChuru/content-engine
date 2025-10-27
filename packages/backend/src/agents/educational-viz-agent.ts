/**
 * Educational Visualization Agent
 *
 * Orchestrates the generation of educational visualizations using:
 * - D3.js for step-by-step text solutions (left side)
 * - Manim for animated visual demonstrations (right side)
 * - Spatial guardrails for collision-free rendering
 * - Claude AI for intelligent content generation
 */

import { ClaudeService } from '../services/claude.js';
import { D3VizEngine } from '../services/d3-viz-engine.js';
import { buildD3VisualizationPrompt } from '../prompts/d3-visualization-prompt.js';
import { buildManimVisualizationPrompt } from '../prompts/manim-visualization-prompt.js';
import { D3SpatialValidator } from '../validators/d3-spatial-validator.js';
import { SPATIAL_CONFIG } from '../config/spatial-config.js';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface EducationalVisualizationRequest {
  /** The math/science problem to visualize */
  problem: string;

  /** Type of visualization needed */
  type: 'sets' | 'geometry' | 'algebra' | 'calculus' | 'statistics' | 'general';

  /** Target audience age */
  targetAge: number;

  /** Desired video duration in seconds */
  duration?: number;

  /** Output directory for generated files */
  outputDir?: string;

  /** Style preferences */
  style?: {
    d3Style?: 'sketchy' | 'clean' | 'blackboard';
    manimStyle?: 'educational' | 'professional' | '3blue1brown';
  };
}

export interface EducationalVisualizationResult {
  success: boolean;

  /** Generated D3 visualization (left side - text solution) */
  d3Output: {
    scriptPath: string;
    imagePath: string;
    videoPath: string;
  };

  /** Generated Manim visualization (right side - animated visual) */
  manimOutput: {
    scriptPath: string;
    videoPath: string;
  };

  /** Combined final video */
  finalVideoPath: string;

  /** Generation metadata */
  metadata: {
    problem: string;
    duration: number;
    generatedAt: string;
    costs: {
      claudeTokens: number;
      estimatedCost: number;
    };
  };

  error?: string;
}

export class EducationalVizAgent {
  private claudeService: ClaudeService;
  private d3Engine: D3VizEngine;
  private validator: D3SpatialValidator;

  constructor(claudeService: ClaudeService) {
    this.claudeService = claudeService;
    this.d3Engine = new D3VizEngine();
    this.validator = new D3SpatialValidator();
  }

  /**
   * Generate complete educational visualization (D3 + Manim + combined video)
   */
  async generate(request: EducationalVisualizationRequest): Promise<EducationalVisualizationResult> {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  EDUCATIONAL VISUALIZATION AGENT                             ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    const startTime = Date.now();
    const outputDir = request.outputDir || `output/edu-viz-${Date.now()}`;
    await fs.mkdir(outputDir, { recursive: true });

    try {
      // Step 1: Analyze the problem and generate structured solution
      console.log('📊 Step 1: Analyzing problem and generating solution structure...\n');
      const solution = await this.analyzeProblem(request);

      // Step 2: Generate D3 text-based step-by-step solution (left side)
      console.log('📝 Step 2: Generating D3 text solution (left side)...\n');
      const d3Result = await this.generateD3Solution(solution, request, outputDir);

      // Step 3: Generate Manim visual animation (right side)
      console.log('🎨 Step 3: Generating Manim visual animation (right side)...\n');
      const manimResult = await this.generateManimVisual(solution, request, outputDir);

      // Step 4: Combine both sides into final video
      console.log('🎬 Step 4: Combining D3 and Manim into final video...\n');
      const finalVideoPath = await this.combineVideos(d3Result, manimResult, outputDir, request.duration || 12);

      const duration = (Date.now() - startTime) / 1000;

      console.log('\n✅ GENERATION COMPLETE!\n');
      console.log(`   Duration: ${duration.toFixed(2)}s`);
      console.log(`   Final video: ${finalVideoPath}\n`);

      return {
        success: true,
        d3Output: d3Result,
        manimOutput: manimResult,
        finalVideoPath,
        metadata: {
          problem: request.problem,
          duration,
          generatedAt: new Date().toISOString(),
          costs: {
            claudeTokens: 0, // Track actual usage
            estimatedCost: 0
          }
        }
      };
    } catch (error: any) {
      console.error('❌ Generation failed:', error);

      return {
        success: false,
        d3Output: { scriptPath: '', imagePath: '', videoPath: '' },
        manimOutput: { scriptPath: '', videoPath: '' },
        finalVideoPath: '',
        metadata: {
          problem: request.problem,
          duration: 0,
          generatedAt: new Date().toISOString(),
          costs: { claudeTokens: 0, estimatedCost: 0 }
        },
        error: error.message
      };
    }
  }

  /**
   * Analyze problem and generate structured solution using Claude
   */
  private async analyzeProblem(request: EducationalVisualizationRequest): Promise<any> {
    const prompt = `You are an educational content expert helping a ${request.targetAge}-year-old understand:

PROBLEM: ${request.problem}
TYPE: ${request.type}

Please analyze this problem and provide:

1. A step-by-step text solution (5-7 clear steps)
2. Key visual elements needed for understanding
3. The correct answer

Format your response as JSON:
{
  "steps": [
    {"number": 1, "title": "...", "content": "...", "color": "#3b82f6"},
    {"number": 2, "title": "...", "content": "...", "color": "#10b981"},
    ...
  ],
  "visualElements": {
    "type": "venn_diagram" | "graph" | "geometric_shape" | "number_line",
    "elements": ["description of each visual element needed"],
    "highlights": ["what to emphasize in yellow"]
  },
  "answer": "The final answer",
  "ageAppropriate": true
}

Make it clear and age-appropriate!`;

    const response = await this.claudeService.chat([
      { role: 'user', content: prompt }
    ]);

    // Extract JSON from response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse solution from Claude');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Generate D3 text-based solution (left side)
   */
  private async generateD3Solution(
    solution: any,
    request: EducationalVisualizationRequest,
    outputDir: string
  ): Promise<{ scriptPath: string; imagePath: string; videoPath: string }> {

    // Build D3 script that creates text boxes (no force simulation needed)
    const d3Script = `
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import fs from 'fs/promises';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const body = d3.select(dom.window.document.body);

const svg = body.append('svg')
  .attr('width', 960)
  .attr('height', 1080)
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .style('background', '#000000');

// Title
svg.append('text')
  .attr('x', 480)
  .attr('y', 80)
  .attr('text-anchor', 'middle')
  .attr('font-family', 'Poppins, sans-serif')
  .attr('font-size', 48)
  .attr('font-weight', 'bold')
  .attr('fill', '#ffffff')
  .text('Step-by-Step Solution');

// Steps
const steps = ${JSON.stringify(solution.steps)};

steps.forEach((step, i) => {
  const y = 150 + (i * 130);

  // Box background
  svg.append('rect')
    .attr('x', 80)
    .attr('y', y)
    .attr('width', 800)
    .attr('height', 100)
    .attr('fill', 'none')
    .attr('stroke', step.color)
    .attr('stroke-width', 3)
    .attr('rx', 10);

  // Step title
  svg.append('text')
    .attr('x', 100)
    .attr('y', y + 35)
    .attr('font-family', 'Poppins, sans-serif')
    .attr('font-size', 28)
    .attr('font-weight', 'bold')
    .attr('fill', step.color)
    .text(step.title);

  // Step content
  svg.append('text')
    .attr('x', 100)
    .attr('y', y + 70)
    .attr('font-family', 'Inter, sans-serif')
    .attr('font-size', 32)
    .attr('fill', '#ffffff')
    .text(step.content);
});

// Convert to PNG
const svgString = svg.node().outerHTML;
const buffer = await sharp(Buffer.from(svgString)).png().toBuffer();
await fs.writeFile('d3-solution.png', buffer);
console.log('D3 solution saved!');
`;

    const scriptPath = path.join(outputDir, 'd3-solution.js');
    await fs.writeFile(scriptPath, d3Script);

    // Execute D3 script to generate PNG
    console.log('   Executing D3 script...');
    await execAsync(`cd ${outputDir} && node d3-solution.js`);

    const imagePath = path.join(outputDir, 'd3-solution.png');
    const videoPath = path.join(outputDir, 'd3-solution-video.mp4');

    // Convert PNG to video
    console.log('   Converting PNG to video...');
    const duration = request.duration || 12;
    await execAsync(
      `ffmpeg -loop 1 -i "${imagePath}" -t ${duration} -r 30 -vf scale=960:1080 "${videoPath}" -y`
    );

    console.log(`   ✓ D3 solution generated: ${videoPath}\n`);

    return { scriptPath, imagePath, videoPath };
  }

  /**
   * Generate Manim visual animation (right side)
   */
  private async generateManimVisual(
    solution: any,
    request: EducationalVisualizationRequest,
    outputDir: string
  ): Promise<{ scriptPath: string; videoPath: string }> {

    // Generate Manim script based on visualization type
    const manimScript = await this.generateManimScript(solution, request);

    const scriptPath = path.join(outputDir, 'visual_animation.py');
    await fs.writeFile(scriptPath, manimScript);

    // Execute Manim rendering
    console.log('   Activating conda environment and rendering Manim...');

    const condaPath = '/home/dachu/miniconda3/etc/profile.d/conda.sh';
    const renderCommand = `
      source ${condaPath} && \\
      conda activate aitools && \\
      cd ${outputDir} && \\
      manim -pql visual_animation.py VisualAnimation -o visual-animation.mp4
    `;

    await execAsync(renderCommand, { shell: '/bin/bash' });

    // Find the generated video (Manim places it in media/videos/...)
    const videoPath = await this.findManimOutput(outputDir);

    console.log(`   ✓ Manim animation generated: ${videoPath}\n`);

    return { scriptPath, videoPath };
  }

  /**
   * Generate Manim Python script based on problem type
   */
  private async generateManimScript(solution: any, request: EducationalVisualizationRequest): Promise<string> {
    const visualType = solution.visualElements.type;
    const duration = request.duration || 12;

    // For now, we'll create a template-based script
    // Later, we can use Claude to generate custom scripts

    if (visualType === 'venn_diagram' || request.type === 'sets') {
      return this.generateVennDiagramScript(solution, duration);
    } else if (visualType === 'graph') {
      return this.generateGraphScript(solution, duration);
    } else {
      return this.generateGenericVisualScript(solution, duration);
    }
  }

  /**
   * Generate Venn diagram Manim script
   */
  private generateVennDiagramScript(solution: any, duration: number): string {
    return `
from manim import *

class VisualAnimation(Scene):
    def construct(self):
        time_spent = 0
        target_duration = ${duration}.0

        # Title
        title = Text("Visual Representation", font_size=40, color=WHITE, weight=BOLD)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=0.8)
        time_spent += 0.8
        self.wait(0.3)
        time_spent += 0.3

        # Create Venn diagram circles
        circle_a = Circle(radius=1.5, color=BLUE, fill_opacity=0.2)
        circle_a.shift(LEFT * 1.2)

        circle_b = Circle(radius=1.5, color=GREEN, fill_opacity=0.2)
        circle_b.shift(RIGHT * 1.2)

        # Labels
        label_a = Text("Set A", font_size=32, color=BLUE)
        label_a.next_to(circle_a, LEFT, buff=0.3)

        label_b = Text("Set B", font_size=32, color=GREEN)
        label_b.next_to(circle_b, RIGHT, buff=0.3)

        # Draw circles
        self.play(Create(circle_a), Create(circle_b), run_time=1.5)
        time_spent += 1.5

        self.play(Write(label_a), Write(label_b), run_time=0.8)
        time_spent += 0.8
        self.wait(0.5)
        time_spent += 0.5

        # Add visual elements based on problem
        # (This would be customized per problem)

        # Pad to target duration
        remaining = max(0, target_duration - time_spent)
        if remaining > 0:
            self.wait(remaining)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.5)
`;
  }

  /**
   * Generate graph/plot Manim script
   */
  private generateGraphScript(solution: any, duration: number): string {
    return `
from manim import *

class VisualAnimation(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            axis_config={"color": BLUE}
        )

        self.play(Create(axes))
        self.wait(2)

        # Add graph elements here

        self.wait(${duration - 4})
        self.play(*[FadeOut(mob) for mob in self.mobjects])
`;
  }

  /**
   * Generate generic visual Manim script
   */
  private generateGenericVisualScript(solution: any, duration: number): string {
    return `
from manim import *

class VisualAnimation(Scene):
    def construct(self):
        title = Text("${solution.answer}", font_size=48, color=YELLOW)
        self.play(Write(title))
        self.wait(${duration - 2})
        self.play(FadeOut(title))
`;
  }

  /**
   * Find Manim output video in media directory
   */
  private async findManimOutput(outputDir: string): Promise<string> {
    // Manim creates: media/videos/visual_animation/480p15/visual-animation.mp4
    const mediaDir = path.join(outputDir, 'media', 'videos', 'visual_animation');

    // Find the quality directory (480p15, 720p30, etc.)
    const qualityDirs = await fs.readdir(mediaDir);
    const qualityDir = qualityDirs[0]; // Use first available quality

    return path.join(mediaDir, qualityDir, 'visual-animation.mp4');
  }

  /**
   * Combine D3 and Manim videos side-by-side
   */
  private async combineVideos(
    d3Result: { videoPath: string },
    manimResult: { videoPath: string },
    outputDir: string,
    duration: number
  ): Promise<string> {

    const finalPath = path.join(outputDir, 'final-educational-video.mp4');

    console.log('   Combining videos with FFmpeg...');

    // Use hstack to place videos side-by-side
    await execAsync(`
      ffmpeg -i "${d3Result.videoPath}" -i "${manimResult.videoPath}" \\
        -filter_complex "[0:v][1:v]hstack[v]" \\
        -map "[v]" \\
        -t ${duration} \\
        "${finalPath}" -y
    `);

    console.log(`   ✓ Final video created: ${finalPath}\n`);

    return finalPath;
  }
}

export default EducationalVizAgent;
