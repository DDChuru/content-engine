/**
 * Sets Problem Demo - EDUCATIONAL VERSION
 *
 * For a 13-year-old learning sets!
 *
 * LEFT (D3): Step-by-step TEXT solution (clear, simple)
 * RIGHT (Manim): VISUAL Venn diagram (circles, numbers, animation)
 */

import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// LEFT SIDE: D3 Step-by-Step Text Solution
// ============================================================================

/**
 * We'll create a SIMPLE visualization with just text boxes
 * No force simulation, no network graphs - just clean steps!
 */
const stepByStepSolution = `
Step 1: What is Set A?
Set A = {1, 2, 3, 4, 5}

Step 2: What is Set B?
Set B = {4, 5, 6, 7, 8}

Step 3: What does ∩ mean?
∩ means "intersection" or "AND"
Find numbers in BOTH sets

Step 4: Which numbers appear in both?
Looking at A: 1, 2, 3, 4, 5
Looking at B: 4, 5, 6, 7, 8
Common: 4 and 5 ✓

Step 5: Answer
A ∩ B = {4, 5}
`;

// For D3, we'll create a simple SVG with text (no physics!)
const d3SimpleScript = `
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

// Steps (one by one, clear boxes)
const steps = [
  { y: 150, title: 'Step 1: Set A', content: 'A = {1, 2, 3, 4, 5}', color: '#3b82f6' },
  { y: 280, title: 'Step 2: Set B', content: 'B = {4, 5, 6, 7, 8}', color: '#10b981' },
  { y: 410, title: 'Step 3: What is ∩?', content: '∩ means "AND" or "both"', color: '#ffffff' },
  { y: 540, title: 'Step 4: Find Common', content: 'Which appear in both?', color: '#fbbf24' },
  { y: 670, title: 'Step 5: Answer', content: 'A ∩ B = {4, 5}', color: '#10b981' }
];

steps.forEach((step, i) => {
  // Box background
  svg.append('rect')
    .attr('x', 80)
    .attr('y', step.y)
    .attr('width', 800)
    .attr('height', 100)
    .attr('fill', 'none')
    .attr('stroke', step.color)
    .attr('stroke-width', 3)
    .attr('rx', 10);

  // Step title
  svg.append('text')
    .attr('x', 100)
    .attr('y', step.y + 35)
    .attr('font-family', 'Poppins, sans-serif')
    .attr('font-size', 28)
    .attr('font-weight', 'bold')
    .attr('fill', step.color)
    .text(step.title);

  // Step content
  svg.append('text')
    .attr('x', 100)
    .attr('y', step.y + 70)
    .attr('font-family', 'Inter, sans-serif')
    .attr('font-size', 32)
    .attr('fill', '#ffffff')
    .text(step.content);
});

// Convert to PNG
const svgString = svg.node().outerHTML;
const buffer = await sharp(Buffer.from(svgString)).png().toBuffer();
await fs.writeFile('d3-steps.png', buffer);
console.log('D3 steps saved!');
`;

// ============================================================================
// RIGHT SIDE: Manim Venn Diagram (VISUAL)
// ============================================================================

const manimVennDiagram = `
from manim import *

class SetsVennDiagram(Scene):
    def construct(self):
        # Time tracking
        time_spent = 0
        target_duration = 12.0

        # Title
        title = Text("Visual Representation", font_size=40, color=WHITE, weight=BOLD)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=0.8)
        time_spent += 0.8
        self.wait(0.3)
        time_spent += 0.3

        # Create Venn diagram circles
        # Circle A (left) - BLUE
        circle_a = Circle(radius=1.5, color=BLUE, fill_opacity=0.2)
        circle_a.shift(LEFT * 1.2)

        # Circle B (right) - GREEN
        circle_b = Circle(radius=1.5, color=GREEN, fill_opacity=0.2)
        circle_b.shift(RIGHT * 1.2)

        # Labels for circles
        label_a = Text("Set A", font_size=32, color=BLUE)
        label_a.next_to(circle_a, LEFT, buff=0.3)

        label_b = Text("Set B", font_size=32, color=GREEN)
        label_b.next_to(circle_b, RIGHT, buff=0.3)

        # Draw circles
        self.play(
            Create(circle_a),
            Create(circle_b),
            run_time=1.5
        )
        time_spent += 1.5

        self.play(
            Write(label_a),
            Write(label_b),
            run_time=0.8
        )
        time_spent += 0.8
        self.wait(0.5)
        time_spent += 0.5

        # Numbers for Set A (1,2,3 only in A)
        num_1 = Text("1", font_size=28, color=BLUE).move_to(circle_a.get_center() + LEFT * 1.0)
        num_2 = Text("2", font_size=28, color=BLUE).move_to(circle_a.get_center() + UP * 0.8 + LEFT * 0.5)
        num_3 = Text("3", font_size=28, color=BLUE).move_to(circle_a.get_center() + DOWN * 0.8 + LEFT * 0.5)

        # Numbers for Set B (6,7,8 only in B)
        num_6 = Text("6", font_size=28, color=GREEN).move_to(circle_b.get_center() + RIGHT * 1.0)
        num_7 = Text("7", font_size=28, color=GREEN).move_to(circle_b.get_center() + UP * 0.8 + RIGHT * 0.5)
        num_8 = Text("8", font_size=28, color=GREEN).move_to(circle_b.get_center() + DOWN * 0.8 + RIGHT * 0.5)

        # Numbers in BOTH (4,5 in intersection) - YELLOW for highlight!
        num_4 = Text("4", font_size=32, color=YELLOW, weight=BOLD).move_to(UP * 0.4)
        num_5 = Text("5", font_size=32, color=YELLOW, weight=BOLD).move_to(DOWN * 0.4)

        # Show numbers appearing
        self.play(
            FadeIn(num_1, shift=DOWN*0.2),
            FadeIn(num_2, shift=DOWN*0.2),
            FadeIn(num_3, shift=DOWN*0.2),
            run_time=1.0
        )
        time_spent += 1.0

        self.play(
            FadeIn(num_6, shift=DOWN*0.2),
            FadeIn(num_7, shift=DOWN*0.2),
            FadeIn(num_8, shift=DOWN*0.2),
            run_time=1.0
        )
        time_spent += 1.0
        self.wait(0.5)
        time_spent += 0.5

        # Highlight the intersection!
        self.play(
            FadeIn(num_4, scale=1.2),
            FadeIn(num_5, scale=1.2),
            run_time=1.2
        )
        time_spent += 1.2
        self.wait(0.5)
        time_spent += 0.5

        # Draw box around intersection
        intersection_label = Text("Intersection", font_size=24, color=YELLOW)
        intersection_label.next_to(num_4, DOWN, buff=1.5)
        arrow = Arrow(intersection_label.get_top(), num_4.get_bottom(), color=YELLOW, buff=0.2)

        self.play(
            Write(intersection_label),
            Create(arrow),
            run_time=1.0
        )
        time_spent += 1.0
        self.wait(0.5)
        time_spent += 0.5

        # Final answer
        answer = Text("A ∩ B = {4, 5}", font_size=36, color=YELLOW, weight=BOLD)
        answer.to_edge(DOWN, buff=0.8)
        checkmark = Text("✓", font_size=48, color=GREEN)
        checkmark.next_to(answer, RIGHT, buff=0.3)

        self.play(
            Write(answer),
            FadeIn(checkmark, shift=LEFT*0.2),
            run_time=1.0
        )
        time_spent += 1.0
        self.wait(0.5)
        time_spent += 0.5

        # Pad to target
        remaining = max(0, target_duration - time_spent)
        if remaining > 0:
            self.wait(remaining)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.5)
`;

// ============================================================================
// DEMO EXECUTION
// ============================================================================

async function runEducationalSetsDemo() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  EDUCATIONAL SETS DEMO - For 13-year-olds!                  ║');
  console.log('║  LEFT: Step-by-step text | RIGHT: Visual Venn diagram       ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const outputDir = 'output/sets-demo';
  await fs.mkdir(outputDir, { recursive: true });

  // Save D3 script
  console.log('📝 STEP 1: Creating D3 text-based solution (left side)\n');
  const d3ScriptPath = path.join(outputDir, 'd3-text-steps.js');
  await fs.writeFile(d3ScriptPath, d3SimpleScript);
  console.log(`   Saved: ${d3ScriptPath}`);
  console.log('   This will show: Clean text boxes with step-by-step solution\n');

  // Save Manim script
  console.log('🎨 STEP 2: Creating Manim Venn diagram (right side)\n');
  const manimScriptPath = path.join(outputDir, 'sets_venn_educational.py');
  await fs.writeFile(manimScriptPath, manimVennDiagram);
  console.log(`   Saved: ${manimScriptPath}`);
  console.log('   This will show: Venn diagram with circles and numbers\n');

  // Instructions
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('TO RENDER:');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('1. Render D3 side (text steps):');
  console.log('   cd output/sets-demo');
  console.log('   node d3-text-steps.js\n');

  console.log('2. Render Manim side (Venn diagram):');
  console.log('   source ~/miniconda3/etc/profile.d/conda.sh');
  console.log('   conda activate aitools');
  console.log('   manim -pql sets_venn_educational.py SetsVennDiagram\n');

  console.log('3. Combine both:');
  console.log('   ffmpeg -i d3-steps.png -loop 1 -t 12 -r 30 d3-steps-video.mp4');
  console.log('   ffmpeg -i d3-steps-video.mp4 -i media/videos/.../SetsVennDiagram.mp4 \\');
  console.log('          -filter_complex "[0:v][1:v]hstack[v]" -map "[v]" final-educational.mp4\n');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('WHAT THE 13-YEAR-OLD WILL SEE:');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('┌──────────────────────────┬──────────────────────────────┐');
  console.log('│ LEFT (D3 Text)           │ RIGHT (Manim Visual)         │');
  console.log('├──────────────────────────┼──────────────────────────────┤');
  console.log('│                          │                              │');
  console.log('│ ┌─ Step 1: Set A ──────┐ │      Visual Representation   │');
  console.log('│ │ A = {1,2,3,4,5}      │ │                              │');
  console.log('│ └──────────────────────┘ │         Set A    Set B       │');
  console.log('│                          │          ○────○──○            │');
  console.log('│ ┌─ Step 2: Set B ──────┐ │         / \\  /\\ \\           │');
  console.log('│ │ B = {4,5,6,7,8}      │ │        1 2 4  5 6            │');
  console.log('│ └──────────────────────┘ │           3    7             │');
  console.log('│                          │                8             │');
  console.log('│ ┌─ Step 3: ∩ means? ───┐ │                              │');
  console.log('│ │ ∩ = "AND" or "both"  │ │      4,5 are in BOTH!        │');
  console.log('│ └──────────────────────┘ │      (yellow highlight)      │');
  console.log('│                          │                              │');
  console.log('│ ┌─ Step 4: Find Common ┐ │                              │');
  console.log('│ │ Which in both?       │ │      A ∩ B = {4, 5} ✓        │');
  console.log('│ └──────────────────────┘ │                              │');
  console.log('│                          │                              │');
  console.log('│ ┌─ Step 5: Answer ─────┐ │                              │');
  console.log('│ │ A ∩ B = {4, 5} ✓     │ │                              │');
  console.log('│ └──────────────────────┘ │                              │');
  console.log('│                          │                              │');
  console.log('└──────────────────────────┴──────────────────────────────┘\n');

  console.log('✅ Now it makes sense to a 13-year-old!');
  console.log('   Left: HOW to solve it (steps)');
  console.log('   Right: WHY the answer is correct (visual)\n');
}

runEducationalSetsDemo().then(() => {
  console.log('✅ Educational demo setup complete!\n');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
