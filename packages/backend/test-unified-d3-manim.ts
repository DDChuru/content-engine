/**
 * Test Unified D3 + Manim Rendering
 *
 * Demonstrates D3 visualizations and Manim animations on the SAME blackboard
 */

import { UnifiedD3ManimRenderer } from './src/services/unified-d3-manim-renderer.js';
import { ComparisonData, NetworkData } from './src/services/d3-viz-engine.js';

async function main() {
  console.log('🎨 Testing Unified D3 + Manim Rendering\n');

  const renderer = new UnifiedD3ManimRenderer('output/unified');

  // =========================================================================
  // Example 1: Side-by-Side (D3 Network | Manim Equation)
  // =========================================================================

  console.log('📊 Example 1: Side-by-Side Layout');
  console.log('   Left: D3 network graph');
  console.log('   Right: Manim equation\n');

  const networkData: NetworkData = {
    type: 'network',
    nodes: [
      { id: 'context', label: 'Context\nWindow', size: 40 },
      { id: 'stm', label: 'Short-term\nMemory', size: 35 },
      { id: 'tokens', label: 'Tokens', size: 30 },
      { id: 'words', label: 'Words', size: 30 }
    ],
    links: [
      { source: 'context', target: 'stm' },
      { source: 'context', target: 'tokens' },
      { source: 'tokens', target: 'words' }
    ]
  };

  const sideBySideScene = {
    d3Data: networkData,
    manimScript: `
# Manim equation (right side)
equation = MathTex(
    r"\\text{tokens} \\approx 0.75 \\times \\text{words}",
    color=WHITE
)
equation.scale(1.5)

# Show equation
self.play(Write(equation), run_time=2)
self.wait(1)

# Transform to specific example
example = MathTex(
    r"4000 \\text{ tokens} \\approx 3000 \\text{ words}",
    color="#ffeb3b"
)
example.scale(1.2)
example.move_to(equation.get_center() + DOWN * 2)

self.play(Write(example), run_time=1.5)
self.wait(1)
`,
    layout: 'side-by-side' as const,
    dimensions: { width: 1920, height: 1080 },
    duration: 6
  };

  try {
    const output1 = await renderer.renderSideBySide(sideBySideScene);
    console.log(`✅ Generated: ${output1.videoPath}`);
    console.log(`   Duration: ${output1.duration}s`);
    console.log(`   Approach: ${output1.approach}\n`);
  } catch (error) {
    console.error('❌ Side-by-side render failed:', error);
    console.log('   (This requires Manim to be installed and configured)\n');
  }

  // =========================================================================
  // Example 2: Overlay (D3 background, Manim foreground)
  // =========================================================================

  console.log('📊 Example 2: Overlay Layout');
  console.log('   Background: D3 comparison chart');
  console.log('   Foreground: Manim annotations\n');

  const comparisonData: ComparisonData = {
    type: 'comparison',
    title: 'Model Comparison',
    groups: [
      {
        name: 'Small',
        items: ['4K tokens'],
        metrics: { tokens: 4000 },
        visual: { type: 'box', style: 'sketchy' }
      },
      {
        name: 'Large',
        items: ['1M tokens'],
        metrics: { tokens: 1000000 },
        visual: { type: 'box', style: 'sketchy' }
      }
    ],
    annotations: [
      { content: '250x larger!', type: 'highlight' }
    ]
  };

  const overlayScene = {
    d3Data: comparisonData,
    manimScript: `
# Manim overlay: Highlight the difference with animation
highlight = Text("250× LARGER!", color="#ff5722", font_size=60)
highlight.to_edge(UP)

self.play(Write(highlight), run_time=1.5)
self.wait(0.5)

# Add arrow pointing to comparison
arrow = Arrow(
    start=highlight.get_bottom(),
    end=highlight.get_bottom() + DOWN * 2,
    color="#ff5722",
    buff=0.1,
    stroke_width=8
)
self.play(Create(arrow), run_time=1)
self.wait(1)
`,
    layout: 'overlay' as const,
    dimensions: { width: 1920, height: 1080 },
    duration: 5
  };

  try {
    const output2 = await renderer.renderOverlay(overlayScene, 'background');
    console.log(`✅ Generated: ${output2.videoPath}`);
    console.log(`   Duration: ${output2.duration}s`);
    console.log(`   Approach: ${output2.approach}\n`);
  } catch (error) {
    console.error('❌ Overlay render failed:', error);
    console.log('   (This requires Manim to be installed and configured)\n');
  }

  // =========================================================================
  // Example 3: Unified Manim (D3 SVG imported into Manim)
  // =========================================================================

  console.log('📊 Example 3: Unified Manim Scene');
  console.log('   D3 SVG → Manim SVGMobject');
  console.log('   Both rendered in single Manim scene\n');

  const unifiedScene = {
    d3Data: networkData,
    manimScript: `
# Mathematical relationship (positioned on right)
relationship = MathTex(
    r"\\text{Context} = f(\\text{Tokens})",
    color="#1e88e5"
)
relationship.scale(1.3)
relationship.to_edge(RIGHT)
relationship.shift(UP * 2)

self.play(Write(relationship), run_time=2)
self.wait(0.5)

# Explanation
explanation = Text(
    "Memory is a function\\nof token capacity",
    font_size=30,
    color="#4caf50"
)
explanation.next_to(relationship, DOWN, buff=1)

self.play(FadeIn(explanation), run_time=1.5)
self.wait(1)
`,
    layout: 'unified-manim' as const,
    dimensions: { width: 1920, height: 1080 },
    duration: 6
  };

  try {
    const output3 = await renderer.renderUnifiedManim(unifiedScene);
    console.log(`✅ Generated: ${output3.videoPath}`);
    console.log(`   Duration: ${output3.duration}s`);
    console.log(`   Approach: ${output3.approach}\n`);
  } catch (error) {
    console.error('❌ Unified Manim render failed:', error);
    console.log('   (This requires Manim + SVG export support)\n');
  }

  // =========================================================================
  // Summary
  // =========================================================================

  console.log('🎉 Test Complete!\n');
  console.log('Three approaches demonstrated:');
  console.log('  1. Side-by-Side: D3 | Manim (separate halves)');
  console.log('  2. Overlay: D3 background + Manim foreground');
  console.log('  3. Unified: D3 SVG imported into Manim scene\n');
  console.log('All render on the SAME blackboard! 🎨');
}

main().catch(console.error);
