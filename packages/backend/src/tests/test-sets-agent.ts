/**
 * Test Sets Agent with Python execution
 */

import { agentRegistry } from '../agents/registry.js';
import { AgentOrchestrator } from '../agents/orchestrator.js';
import { SetsAgent } from '../agents/sets/agent.js';

async function testSetsAgent() {
  console.log('='.repeat(80));
  console.log('TESTING SETS AGENT WITH PYTHON EXECUTION');
  console.log('='.repeat(80));

  // Register Sets agent
  const setsAgent = new SetsAgent();
  agentRegistry.register(setsAgent);

  // Create orchestrator
  const orchestrator = new AgentOrchestrator(agentRegistry);

  // Test with better keyword matching
  console.log('\n1. Testing with keywords "sets venn"...');
  const task1 = {
    id: 'venn-test-1',
    description: 'Generate Venn diagram for sets A and B',
    context: {
      setA: [1, 2, 3, 4, 5],
      setB: [4, 5, 6, 7, 8]
    }
  };

  const result1 = await orchestrator.routeTask(task1, { requireConfidence: 0.2 });
  console.log(`   Success: ${result1.success}`);
  console.log(`   Agent: ${result1.agentUsed}`);
  console.log(`   Confidence: ${result1.confidence.toFixed(2)}`);

  if (result1.success && result1.output) {
    console.log('\n   Layout calculated successfully!');
    console.log(`   - Union size: ${result1.output.layout.union_size}`);
    console.log(`   - Intersection size: ${result1.output.layout.intersection_size}`);
    console.log(`   - A-only: ${result1.output.layout.a_only_size}`);
    console.log(`   - B-only: ${result1.output.layout.b_only_size}`);
    console.log(`   - Circle radius: ${result1.output.layout.circle_radius.toFixed(2)}`);
    console.log(`   - Circle separation: ${result1.output.layout.circle_separation.toFixed(2)}`);
    console.log(`   - Tier: ${result1.output.layout.tier}`);
    console.log(`   - Lens font size: ${result1.output.layout.lens_font_size}px`);
    console.log(`   - Crescent font size: ${result1.output.layout.crescent_font_size}px`);
    console.log(`   - Elements positioned: ${Object.keys(result1.output.positions).length}`);
  } else {
    console.log(`   Error: ${result1.error}`);
  }

  // Test with larger dataset
  console.log('\n2. Testing with larger dataset (Cambridge IGCSE example)...');
  const task2 = {
    id: 'venn-test-2',
    description: 'Create Venn diagram showing set union and intersection',
    context: {
      setA: Array.from({ length: 20 }, (_, i) => i + 1),  // 1..20
      setB: Array.from({ length: 20 }, (_, i) => i + 15)  // 15..34
    }
  };

  const result2 = await orchestrator.routeTask(task2, { requireConfidence: 0.2 });
  console.log(`   Success: ${result2.success}`);
  console.log(`   Agent: ${result2.agentUsed}`);

  if (result2.success && result2.output) {
    console.log('\n   Layout calculated successfully!');
    console.log(`   - Union size: ${result2.output.layout.union_size}`);
    console.log(`   - Intersection size: ${result2.output.layout.intersection_size}`);
    console.log(`   - Tier: ${result2.output.layout.tier}`);
    console.log(`   - Circle separation: ${result2.output.layout.circle_separation.toFixed(2)}`);
    console.log(`   - Warnings: ${result2.output.layout.warnings.join(', ') || 'none'}`);
    console.log(`   - Execution time: ${result2.metadata.executionTimeMs}ms`);
  } else {
    console.log(`   Error: ${result2.error}`);
  }

  // Test context loading
  console.log('\n3. Testing context loading...');
  const context = await setsAgent.getContext();
  console.log(`   ✓ Context loaded: ${context.length} characters`);

  const hasKeyInsights = context.includes('LENS') &&
                        context.includes('Independent Regions') &&
                        context.includes('spatial_calculator');
  console.log(`   ✓ Contains key insights: ${hasKeyInsights}`);

  console.log('\n' + '='.repeat(80));
  console.log('✅ SETS AGENT TEST COMPLETE');
  console.log('='.repeat(80));
}

testSetsAgent().catch(console.error);
