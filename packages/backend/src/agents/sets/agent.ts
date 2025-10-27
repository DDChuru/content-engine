/**
 * Sets Specialist Agent
 *
 * Master of set theory visualizations for Cambridge IGCSE Mathematics.
 * Handles Venn diagrams, set operations, and spatial layout calculations.
 */

import { BaseAgent, AgentMetadata, AgentTask, AgentResult } from '../base-agent.js';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SetsAgent extends BaseAgent {
  protected metadata: AgentMetadata = {
    domain: 'sets',
    name: 'Set Theory Specialist',
    description: 'Expert in set theory visualizations, Venn diagrams, and spatial layout for Cambridge IGCSE Mathematics',
    version: '1.0.0',
    contextFile: path.join(__dirname, 'CONTEXT.md'),
    toolsPath: path.join(__dirname, 'spatial_calculator.py'),
    capabilities: [
      {
        keyword: 'sets',
        description: 'Set theory concepts, operations, and notation',
        examples: [
          'Generate Venn diagram for sets A and B',
          'Create visualization of union and intersection',
          'Show set operations with elements'
        ]
      },
      {
        keyword: 'venn',
        description: 'Venn diagram generation with optimal spatial layout',
        examples: [
          'Create Venn diagram for two sets',
          'Generate collision-free Venn visualization',
          'Calculate Venn diagram layout'
        ]
      },
      {
        keyword: 'intersection',
        description: 'Set intersection operations and lens geometry',
        examples: [
          'Calculate intersection of sets',
          'Visualize common elements',
          'Show overlapping regions'
        ]
      },
      {
        keyword: 'union',
        description: 'Set union operations',
        examples: [
          'Calculate union of sets',
          'Show all unique elements',
          'Combine multiple sets'
        ]
      },
      {
        keyword: 'spatial',
        description: 'Spatial layout calculations for mathematical visualizations',
        examples: [
          'Calculate optimal element positions',
          'Avoid element collisions',
          'Pack elements efficiently'
        ]
      }
    ]
  };

  async invoke(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      // Parse task to determine what to do
      const action = this.parseAction(task);

      let output: any;

      switch (action.type) {
        case 'calculate_layout':
          output = await this.calculateVennLayout(action.setA, action.setB);
          break;

        case 'generate_manim':
          output = await this.generateManimCode(action.setA, action.setB, action.options);
          break;

        case 'generate_d3':
          output = await this.generateD3Code(action.setA, action.setB, action.options);
          break;

        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      return {
        success: true,
        output,
        metadata: {
          agentDomain: this.metadata.domain,
          executionTimeMs: Date.now() - startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          agentDomain: this.metadata.domain,
          executionTimeMs: Date.now() - startTime
        }
      };
    }
  }

  async getContext(): Promise<string> {
    try {
      const contextPath = this.metadata.contextFile;
      return await fs.readFile(contextPath, 'utf-8');
    } catch (error) {
      console.warn(`[SetsAgent] Could not load CONTEXT.md: ${error}`);
      return 'Context file not available';
    }
  }

  /**
   * Calculate Venn diagram layout using spatial_calculator.py
   */
  private async calculateVennLayout(setA: number[], setB: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import json
import sys
sys.path.insert(0, '${path.dirname(this.metadata.toolsPath!)}')

from spatial_calculator import calculate_venn_layout, pack_venn_elements

set_a = set(${JSON.stringify(setA)})
set_b = set(${JSON.stringify(setB)})

layout = calculate_venn_layout(set_a, set_b)
positions = pack_venn_elements(sorted(set_a | set_b), set_a, set_b, layout)

# Convert to JSON-serializable format
result = {
    'layout': {
        'union_size': layout.union_size,
        'intersection_size': layout.intersection_size,
        'a_only_size': layout.a_only_size,
        'b_only_size': layout.b_only_size,
        'circle_radius': layout.circle_radius,
        'circle_separation': layout.circle_separation,
        'circle_a_center': layout.circle_a_center.tolist(),
        'circle_b_center': layout.circle_b_center.tolist(),
        'tier': layout.tier,
        'lens_font_size': layout.lens_font_size,
        'lens_area': layout.lens_area,
        'lens_width': layout.lens_width,
        'lens_height': layout.lens_height,
        'crescent_font_size': layout.crescent_font_size,
        'crescent_radii': layout.crescent_radii,
        'is_valid': layout.is_valid,
        'warnings': layout.warnings
    },
    'positions': {str(k): v.tolist() for k, v in positions.items()}
}

print(json.dumps(result))
`;

      const process = spawn('conda', ['run', '-n', 'aitools', 'python', '-c', pythonScript]);

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${stderr}`));
        } else {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${error}`));
          }
        }
      });
    });
  }

  /**
   * Generate Manim code for Venn diagram
   */
  private async generateManimCode(
    setA: number[],
    setB: number[],
    options: any = {}
  ): Promise<string> {
    const layout = await this.calculateVennLayout(setA, setB);

    // Generate Manim code using the layout
    const code = `from manim import *
from spatial_calculator import calculate_venn_layout, pack_venn_elements

class VennDiagram(Scene):
    def construct(self):
        # Define sets
        set_a = {${setA.join(', ')}}
        set_b = {${setB.join(', ')}}

        # Calculate layout using spatial_calculator
        layout = calculate_venn_layout(set_a, set_b)

        # Draw circles
        circle_a = Circle(
            radius=${layout.layout.circle_radius},
            color=BLUE,
            fill_opacity=0.3
        ).move_to([${layout.layout.circle_a_center.join(', ')}])

        circle_b = Circle(
            radius=${layout.layout.circle_radius},
            color=GREEN,
            fill_opacity=0.3
        ).move_to([${layout.layout.circle_b_center.join(', ')}])

        self.play(Create(circle_a), Create(circle_b))

        # Pack elements
        positions = pack_venn_elements(sorted(set_a | set_b), set_a, set_b, layout)

        # Create number mobjects
        intersection = set_a & set_b
        numbers = []

        for num in sorted(set_a | set_b):
            font_size = ${layout.layout.lens_font_size} if num in intersection else ${layout.layout.crescent_font_size}
            text = Text(str(num), font_size=font_size)
            pos = positions[num]
            text.move_to([pos[0], pos[1], 0])
            numbers.append(text)

        self.play(*[FadeIn(num) for num in numbers])
        self.wait(2)
`;

    return code;
  }

  /**
   * Generate D3 code for Venn diagram (for web visualizations)
   */
  private async generateD3Code(
    setA: number[],
    setB: number[],
    options: any = {}
  ): Promise<string> {
    const layout = await this.calculateVennLayout(setA, setB);

    // Generate D3.js code using the layout
    const code = `// D3 Venn Diagram
const layout = ${JSON.stringify(layout.layout, null, 2)};
const positions = ${JSON.stringify(layout.positions, null, 2)};

const svg = d3.select('#venn-diagram')
  .append('svg')
  .attr('width', 800)
  .attr('height', 600);

// Draw circles
svg.append('circle')
  .attr('cx', layout.circle_a_center[0] * 100 + 400)
  .attr('cy', layout.circle_a_center[1] * 100 + 300)
  .attr('r', layout.circle_radius * 100)
  .attr('fill', 'blue')
  .attr('opacity', 0.3);

svg.append('circle')
  .attr('cx', layout.circle_b_center[0] * 100 + 400)
  .attr('cy', layout.circle_b_center[1] * 100 + 300)
  .attr('r', layout.circle_radius * 100)
  .attr('fill', 'green')
  .attr('opacity', 0.3);

// Draw elements
Object.entries(positions).forEach(([num, pos]) => {
  svg.append('text')
    .attr('x', pos[0] * 100 + 400)
    .attr('y', pos[1] * 100 + 300)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .text(num);
});
`;

    return code;
  }

  /**
   * Parse task description to determine action
   */
  private parseAction(task: AgentTask): any {
    const desc = task.description.toLowerCase();
    const context = task.context || {};

    // Extract sets from context if provided
    let setA: number[] = context.setA || [];
    let setB: number[] = context.setB || [];

    // Determine action type
    if (desc.includes('manim')) {
      return {
        type: 'generate_manim',
        setA,
        setB,
        options: context.options || {}
      };
    } else if (desc.includes('d3')) {
      return {
        type: 'generate_d3',
        setA,
        setB,
        options: context.options || {}
      };
    } else {
      // Default: calculate layout
      return {
        type: 'calculate_layout',
        setA,
        setB
      };
    }
  }
}
