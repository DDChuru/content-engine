/**
 * Test Agent System
 *
 * Verifies that the specialized agent architecture works correctly.
 */

import { agentRegistry } from '../agents/registry.js';
import { AgentOrchestrator } from '../agents/orchestrator.js';
import { SetsAgent } from '../agents/sets/agent.js';

async function testAgentSystem() {
  console.log('='.repeat(80));
  console.log('TESTING SPECIALIZED AGENT SYSTEM');
  console.log('='.repeat(80));

  // Register Sets agent
  console.log('\n1. Registering Sets agent...');
  const setsAgent = new SetsAgent();
  agentRegistry.register(setsAgent);

  // List agents
  console.log('\n2. Listing registered agents...');
  const catalog = agentRegistry.getAgentCatalog();
  catalog.forEach(agent => {
    console.log(`   - ${agent.name} (${agent.domain})`);
    console.log(`     Capabilities: ${agent.capabilities.map(c => c.keyword).join(', ')}`);
  });

  // Create orchestrator
  console.log('\n3. Creating orchestrator...');
  const orchestrator = new AgentOrchestrator(agentRegistry);

  // Test keyword matching
  console.log('\n4. Testing keyword matching...');
  const testTasks = [
    {
      id: 'test-1',
      description: 'Generate a Venn diagram for two sets',
      context: {
        setA: [1, 2, 3, 4, 5],
        setB: [4, 5, 6, 7, 8]
      }
    },
    {
      id: 'test-2',
      description: 'Calculate the intersection of sets A and B',
      context: {
        setA: [1, 2, 3],
        setB: [2, 3, 4]
      }
    },
    {
      id: 'test-3',
      description: 'Create a spatial layout for elements',
      context: {
        setA: [1, 2, 3],
        setB: [3, 4, 5]
      }
    }
  ];

  for (const task of testTasks) {
    console.log(`\n   Task: "${task.description}"`);
    const analysis = await orchestrator.analyzeTask(task);

    if (analysis.recommended) {
      console.log(`   ✓ Recommended: ${analysis.recommended.agent.getMetadata().name}`);
      console.log(`     Confidence: ${analysis.recommended.confidence.toFixed(2)}`);
      console.log(`     Matched: ${analysis.recommended.matchedKeywords.join(', ')}`);
    } else {
      console.log(`   ✗ No agent found`);
    }
  }

  // Test direct invocation
  console.log('\n5. Testing direct invocation...');
  const directTask = {
    id: 'direct-test',
    description: 'Calculate Venn diagram layout',
    context: {
      setA: [1, 2, 3, 4, 5],
      setB: [4, 5, 6, 7, 8]
    }
  };

  console.log(`   Invoking: "${directTask.description}"`);
  const result = await orchestrator.routeTask(directTask);

  console.log(`   Success: ${result.success}`);
  console.log(`   Agent used: ${result.agentUsed}`);
  console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
  console.log(`   Execution time: ${result.metadata.executionTimeMs}ms`);

  if (result.success && result.output) {
    console.log(`   Output preview:`);
    console.log(`     Union size: ${result.output.layout.union_size}`);
    console.log(`     Intersection size: ${result.output.layout.intersection_size}`);
    console.log(`     Circle radius: ${result.output.layout.circle_radius.toFixed(2)}`);
    console.log(`     Circle separation: ${result.output.layout.circle_separation.toFixed(2)}`);
    console.log(`     Tier: ${result.output.layout.tier}`);
  } else if (result.error) {
    console.log(`   Error: ${result.error}`);
  }

  // Test context retrieval
  console.log('\n6. Testing context retrieval...');
  const context = await setsAgent.getContext();
  console.log(`   Context length: ${context.length} characters`);
  console.log(`   Context preview (first 200 chars):`);
  console.log(`   ${context.substring(0, 200)}...`);

  console.log('\n' + '='.repeat(80));
  console.log('✅ AGENT SYSTEM TEST COMPLETE');
  console.log('='.repeat(80));
}

// Run tests
testAgentSystem().catch(console.error);
