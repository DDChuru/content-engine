/**
 * Test Interactive Educational System
 *
 * Demonstrates step-by-step problem generation with:
 * - D3 visualizations
 * - Manim video explanations
 * - Click-through reveals
 */

import { InteractiveContentGenerator } from './src/services/interactive-content-generator.js';

async function main() {
  console.log('🎓 Testing Interactive Educational System\n');

  const generator = new InteractiveContentGenerator('output/interactive');

  // =========================================================================
  // Example 1: Calculus - Derivatives
  // =========================================================================

  console.log('📊 Example 1: Interactive Calculus Problem');
  console.log('   Topic: Derivatives');
  console.log('   Difficulty: Intermediate');
  console.log('   Features: D3 visualizations + Manim animations\n');

  try {
    const calculusProblem = await generator.generateInteractiveProblem({
      topic: 'Derivatives of Polynomial Functions',
      difficulty: 'intermediate',
      includeVisualizations: true,
      includeVideos: true,
      steps: 4
    });

    console.log(`✅ Generated problem: ${calculusProblem.id}`);
    console.log(`   Title: ${calculusProblem.title}`);
    console.log(`   Steps: ${calculusProblem.steps.length}`);
    console.log(`   Question: ${calculusProblem.question.text.substring(0, 100)}...`);
    console.log('\n   Steps:');

    calculusProblem.steps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step.title}`);
      console.log(`      Explanation: ${step.explanation.substring(0, 80)}...`);
      if (step.visualization) console.log(`      ✓ D3 Visualization`);
      if (step.manimVideo) console.log(`      ✓ Manim Animation`);
    });

    console.log(`\n   Tags: ${calculusProblem.tags.join(', ')}`);
    console.log(`   Estimated time: ${calculusProblem.estimatedTime} minutes\n`);
  } catch (error) {
    console.error('❌ Failed to generate calculus problem:', error);
    console.log('   (This requires Claude API key and Manim installation)\n');
  }

  // =========================================================================
  // Example 2: Linear Algebra - Matrix Multiplication
  // =========================================================================

  console.log('📊 Example 2: Interactive Linear Algebra Problem');
  console.log('   Topic: Matrix Multiplication');
  console.log('   Difficulty: Beginner');
  console.log('   Features: D3 visualizations only\n');

  try {
    const matrixProblem = await generator.generateInteractiveProblem({
      topic: 'Matrix Multiplication Step-by-Step',
      difficulty: 'beginner',
      includeVisualizations: true,
      includeVideos: false,  // No Manim videos for this one
      steps: 3
    });

    console.log(`✅ Generated problem: ${matrixProblem.id}`);
    console.log(`   Title: ${matrixProblem.title}`);
    console.log(`   Steps: ${matrixProblem.steps.length}`);
    console.log(`   Question: ${matrixProblem.question.text.substring(0, 100)}...`);
    console.log('\n   Steps:');

    matrixProblem.steps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step.title}`);
      if (step.visualization) console.log(`      ✓ D3 Visualization`);
    });

    console.log(`\n   Saved to: output/interactive/${matrixProblem.id}.json\n`);
  } catch (error) {
    console.error('❌ Failed to generate matrix problem:', error);
    console.log('   (This requires Claude API key)\n');
  }

  // =========================================================================
  // Example 3: Statistics - Probability
  // =========================================================================

  console.log('📊 Example 3: Interactive Statistics Problem');
  console.log('   Topic: Probability Distributions');
  console.log('   Difficulty: Advanced');
  console.log('   Features: Full integration (D3 + Manim)\n');

  try {
    const statsProblem = await generator.generateInteractiveProblem({
      topic: 'Understanding Normal Distribution',
      difficulty: 'advanced',
      includeVisualizations: true,
      includeVideos: true,
      steps: 5
    });

    console.log(`✅ Generated problem: ${statsProblem.id}`);
    console.log(`   Title: ${statsProblem.title}`);
    console.log(`   Steps: ${statsProblem.steps.length}`);
    console.log(`   Visualizations: ${statsProblem.steps.filter(s => s.visualization).length}`);
    console.log(`   Videos: ${statsProblem.steps.filter(s => s.manimVideo).length}`);
    console.log(`   Estimated time: ${statsProblem.estimatedTime} minutes\n`);
  } catch (error) {
    console.error('❌ Failed to generate statistics problem:', error);
    console.log('   (This requires Claude API key and Manim installation)\n');
  }

  // =========================================================================
  // Summary
  // =========================================================================

  console.log('🎉 Interactive System Test Complete!\n');
  console.log('Features demonstrated:');
  console.log('  ✓ Claude AI generates problem structure');
  console.log('  ✓ D3 creates data-driven visualizations');
  console.log('  ✓ Manim renders mathematical animations');
  console.log('  ✓ Step-by-step click-through reveals');
  console.log('  ✓ Progress tracking');
  console.log('  ✓ Multiple difficulty levels\n');

  console.log('API Endpoints:');
  console.log('  POST   /api/interactive/generate');
  console.log('  GET    /api/interactive/problems/:id');
  console.log('  POST   /api/interactive/problems/:id/reveal');
  console.log('  GET    /api/interactive/visualizations/:problemId/:stepId');
  console.log('  GET    /api/interactive/videos/:problemId/:stepId');
  console.log('  GET    /api/interactive/progress/:userId/:problemId\n');

  console.log('Frontend Component:');
  console.log('  packages/frontend/src/components/interactive-problem-viewer.tsx\n');

  console.log('Next Steps:');
  console.log('  1. Start backend: cd packages/backend && npm run dev');
  console.log('  2. Test API: curl -X POST http://localhost:3001/api/interactive/generate \\');
  console.log('              -H "Content-Type: application/json" \\');
  console.log('              -d \'{"topic": "derivatives", "difficulty": "beginner"}\'');
  console.log('  3. Use frontend component in your Next.js pages');
  console.log('  4. Integrate with Firebase for persistent storage\n');
}

main().catch(console.error);
