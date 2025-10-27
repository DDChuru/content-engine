# Agent System - Quick Start Guide

## 30-Second Start

```typescript
import { agentRegistry } from './agents/registry.js';
import { AgentOrchestrator } from './agents/orchestrator.js';
import { SetsAgent } from './agents/sets/agent.js';

// Register agent
agentRegistry.register(new SetsAgent());

// Create orchestrator
const orchestrator = new AgentOrchestrator(agentRegistry);

// Route task
const result = await orchestrator.routeTask({
  id: 'task-1',
  description: 'Generate Venn diagram for sets',
  context: {
    setA: [1, 2, 3, 4, 5],
    setB: [4, 5, 6, 7, 8]
  }
});

// Use result
console.log(result.output.layout);
```

---

## HTTP API Usage

### List all agents

```bash
curl http://localhost:3001/api/agents
```

Response:
```json
{
  "success": true,
  "agents": [
    {
      "domain": "sets",
      "name": "Set Theory Specialist",
      "capabilities": ["sets", "venn", "intersection", "union", "spatial"]
    }
  ]
}
```

### Invoke agent

```bash
curl -X POST http://localhost:3001/api/agents/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Generate Venn diagram for two sets",
    "context": {
      "setA": [1, 2, 3, 4, 5],
      "setB": [4, 5, 6, 7, 8]
    }
  }'
```

Response:
```json
{
  "success": true,
  "result": {
    "output": {
      "layout": {
        "union_size": 8,
        "intersection_size": 2,
        "circle_radius": 2.2,
        "circle_separation": 3.47,
        "tier": "comfortable"
      },
      "positions": { ... }
    },
    "agentUsed": "sets",
    "confidence": 0.37,
    "executionTimeMs": 2623
  }
}
```

### Analyze task (get recommendations)

```bash
curl -X POST http://localhost:3001/api/agents/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Calculate intersection of sets"
  }'
```

---

## Creating a New Agent

### 1. Create agent file

`src/agents/algebra/agent.ts`:

```typescript
import { BaseAgent, AgentMetadata, AgentTask, AgentResult } from '../base-agent.js';

export class AlgebraAgent extends BaseAgent {
  protected metadata: AgentMetadata = {
    domain: 'algebra',
    name: 'Algebra Specialist',
    description: 'Expert in algebraic equations and expressions',
    version: '1.0.0',
    contextFile: path.join(__dirname, 'CONTEXT.md'),
    capabilities: [
      {
        keyword: 'equation',
        description: 'Solve algebraic equations',
        examples: ['Solve x + 2 = 5', 'Find roots of quadratic']
      },
      {
        keyword: 'factoring',
        description: 'Factor polynomials',
        examples: ['Factor x^2 - 4', 'Simplify expressions']
      }
    ]
  };

  async invoke(task: AgentTask): Promise<AgentResult> {
    // Implement algebra-specific logic
    return {
      success: true,
      output: { solution: '...' },
      metadata: {
        agentDomain: this.metadata.domain,
        executionTimeMs: Date.now() - startTime
      }
    };
  }

  async getContext(): Promise<string> {
    return await fs.readFile(this.metadata.contextFile, 'utf-8');
  }
}
```

### 2. Create CONTEXT.md

`src/agents/algebra/CONTEXT.md`:

```markdown
# Algebra Specialist Agent - Context

**Domain:** Algebraic Equations and Expressions
**Master of:** Solving equations, factoring, simplification

## Key Techniques

### Solving Linear Equations
1. Isolate variable on one side
2. Perform same operation on both sides
3. Simplify

### Factoring Quadratics
1. Find factors of c that sum to b
2. Write as (x + p)(x + q)
3. Verify by expanding

...
```

### 3. Register agent

`src/routes/agents.ts`:

```typescript
import { AlgebraAgent } from '../agents/algebra/agent.js';

function initializeAgents() {
  agentRegistry.register(new SetsAgent());
  agentRegistry.register(new AlgebraAgent());  // Add this
}
```

### 4. Test

```typescript
const result = await orchestrator.routeTask({
  id: 'test',
  description: 'Solve equation x + 2 = 5'
});

console.log(result.agentUsed);  // 'algebra'
```

---

## Keywords for Sets Agent

The Sets agent responds to these keywords:

- `sets` - General set theory
- `venn` - Venn diagrams
- `intersection` - A ∩ B
- `union` - A ∪ B
- `spatial` - Spatial layout

**Examples:**
- "Generate Venn diagram" → Sets Agent ✓
- "Calculate intersection" → Sets Agent ✓
- "Show union of sets" → Sets Agent ✓
- "Create spatial layout" → Sets Agent ✓

---

## Confidence Threshold

Default: `0.3`

Adjust in routing:
```typescript
await orchestrator.routeTask(task, {
  requireConfidence: 0.2  // Lower threshold
});
```

**Guidelines:**
- `0.5+` - Excellent match (exact keywords)
- `0.3-0.5` - Good match (partial keywords)
- `0.2-0.3` - Fair match (general keywords)
- `< 0.2` - Poor match (consider rejecting)

---

## Debugging

### Enable verbose output

```typescript
const setsAgent = new SetsAgent();
const result = await setsAgent.invoke({
  id: 'debug',
  description: 'Generate Venn diagram',
  context: {
    setA: [1, 2, 3],
    setB: [3, 4, 5],
    options: { verbose: true }  // Enable Python verbose mode
  }
});
```

### Check agent metadata

```typescript
const metadata = setsAgent.getMetadata();
console.log(metadata.capabilities);
```

### View routing decisions

```typescript
const analysis = await orchestrator.analyzeTask(task);
console.log(analysis.explanation);
```

---

## Performance Tips

### 1. Cache Python results

For repeated calculations with same inputs, cache results:

```typescript
const cache = new Map();
const cacheKey = JSON.stringify({ setA, setB });

if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}

const result = await calculateLayout(setA, setB);
cache.set(cacheKey, result);
```

### 2. Prefer direct invocation

If you know the domain:

```typescript
// Slower (routing overhead)
await orchestrator.routeTask(task);

// Faster (direct)
const agent = agentRegistry.getAgent('sets');
await agent.invoke(task);
```

### 3. Parallel execution

For independent tasks:

```typescript
const results = await Promise.all([
  orchestrator.routeTask(task1),
  orchestrator.routeTask(task2),
  orchestrator.routeTask(task3)
]);
```

---

## Common Patterns

### Pattern 1: Task with preferred domain

```typescript
await orchestrator.routeTask(task, {
  preferredDomain: 'sets'  // Try Sets first
});
```

### Pattern 2: Get alternatives

```typescript
const analysis = await orchestrator.analyzeTask(task);
console.log(analysis.alternatives);  // Other agents that can handle task
```

### Pattern 3: Error handling

```typescript
const result = await orchestrator.routeTask(task);

if (!result.success) {
  console.error(result.error);

  // Try alternative agent
  if (result.alternativeAgents?.length > 0) {
    const altDomain = result.alternativeAgents[0];
    const altAgent = agentRegistry.getAgent(altDomain);
    const altResult = await altAgent.invoke(task);
  }
}
```

---

## File Structure

```
src/agents/
├── base-agent.ts           # Base interface
├── registry.ts             # Agent registry
├── orchestrator.ts         # Smart routing
└── {domain}/
    ├── agent.ts            # Agent implementation
    ├── CONTEXT.md          # Knowledge base (500 lines)
    ├── {tools}.py          # Optional: domain tools
    └── prompts/            # Optional: specialized prompts
```

---

## Testing

### Unit test

```bash
npx tsx src/tests/test-sets-agent.ts
```

### HTTP test

```bash
# Start server
npm run dev

# Test in another terminal
curl -X POST http://localhost:3001/api/agents/invoke \
  -H "Content-Type: application/json" \
  -d '{"description": "Generate Venn diagram", "context": {"setA": [1,2,3], "setB": [3,4,5]}}'
```

---

## Troubleshooting

**Problem:** Agent not found

**Solution:** Check registration in `src/routes/agents.ts` → `initializeAgents()`

**Problem:** Low confidence score

**Solution:** Add more keywords to agent capabilities or adjust threshold

**Problem:** Python execution fails

**Solution:** Verify conda environment: `conda run -n aitools python --version`

**Problem:** Context file not found

**Solution:** Check `contextFile` path in agent metadata (use `__dirname` correctly)

---

## Quick Reference

### Import

```typescript
import { agentRegistry } from './agents/registry.js';
import { AgentOrchestrator } from './agents/orchestrator.js';
import { SetsAgent } from './agents/sets/agent.js';
```

### Register

```typescript
agentRegistry.register(new SetsAgent());
```

### Route

```typescript
const result = await orchestrator.routeTask({
  id: 'task-1',
  description: 'Generate Venn diagram',
  context: { setA: [...], setB: [...] }
});
```

### Check result

```typescript
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.error);
}
```

---

**Version:** 1.0.0
**Documentation:** See `AGENT-SYSTEM-COMPLETE.md` for full details
