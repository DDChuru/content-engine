import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);
const router = express.Router();

// Temporary directory for diagram files
const TEMP_DIR = path.join(process.cwd(), 'temp', 'diagrams');

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating temp directory:', error);
  }
}

ensureTempDir();

/**
 * POST /api/diagrams/generate
 * Generate a diagram from Mermaid syntax
 *
 * Body:
 * {
 *   "mermaidCode": "flowchart TD\n A-->B",
 *   "format": "png" | "svg" (optional, default: "png")
 * }
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { mermaidCode, format = 'png' } = req.body;

    if (!mermaidCode) {
      return res.status(400).json({
        error: 'mermaidCode is required'
      });
    }

    if (format !== 'png' && format !== 'svg') {
      return res.status(400).json({
        error: 'format must be "png" or "svg"'
      });
    }

    // Generate unique filename
    const hash = crypto.createHash('md5').update(mermaidCode).digest('hex');
    const inputFile = path.join(TEMP_DIR, `${hash}.mmd`);
    const outputFile = path.join(TEMP_DIR, `${hash}.${format}`);

    // Check if diagram already exists (cache)
    try {
      await fs.access(outputFile);
      console.log('Returning cached diagram:', hash);
      const imageBuffer = await fs.readFile(outputFile);
      const base64 = imageBuffer.toString('base64');
      const mimeType = format === 'svg' ? 'image/svg+xml' : 'image/png';

      return res.json({
        success: true,
        format,
        imageUrl: `data:${mimeType};base64,${base64}`,
        cached: true
      });
    } catch {
      // File doesn't exist, generate it
    }

    // Write Mermaid code to file
    await fs.writeFile(inputFile, mermaidCode, 'utf8');

    // Render diagram with mermaid-cli
    const puppeteerConfig = path.join(process.cwd(), 'puppeteer-config.json');
    const command = `npx mmdc -i "${inputFile}" -o "${outputFile}" -p "${puppeteerConfig}"`;

    console.log('Generating diagram:', hash);
    await execAsync(command);

    // Read generated file
    const imageBuffer = await fs.readFile(outputFile);
    const base64 = imageBuffer.toString('base64');
    const mimeType = format === 'svg' ? 'image/svg+xml' : 'image/png';

    // Clean up input file (keep output for caching)
    await fs.unlink(inputFile);

    res.json({
      success: true,
      format,
      imageUrl: `data:${mimeType};base64,${base64}`,
      cached: false
    });

  } catch (error: any) {
    console.error('Diagram generation error:', error);
    res.status(500).json({
      error: 'Diagram generation failed',
      details: error.message
    });
  }
});

/**
 * POST /api/diagrams/generate-from-prompt
 * Generate a diagram using Claude to create Mermaid syntax from a text description
 *
 * Body:
 * {
 *   "prompt": "Create a flowchart showing how authentication works",
 *   "diagramType": "flowchart" | "sequence" | "class" | "state" | "er" | "gantt" | "pie" | "mindmap" | "journey"
 *   "format": "png" | "svg" (optional, default: "png")
 * }
 */
router.post('/generate-from-prompt', async (req: Request, res: Response) => {
  try {
    const { prompt, diagramType = 'flowchart', format = 'png' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'prompt is required'
      });
    }

    // Import Claude service
    const { ClaudeService } = await import('../services/claude.js');
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);

    // Build prompt for Claude to generate Mermaid syntax
    const systemPrompt = getMermaidPromptForType(diagramType);
    const userPrompt = `${prompt}

Output ONLY valid Mermaid.js syntax for a ${diagramType}. No explanations, no markdown code blocks, just the raw Mermaid syntax.`;

    // Generate Mermaid code with Claude
    const response = await claudeService.sendMessage([
      { role: 'user', content: userPrompt }
    ], undefined, systemPrompt);

    const mermaidCode = response.content[0].text;

    // Clean up the response (remove markdown code blocks if present)
    const cleanedCode = mermaidCode
      .replace(/```mermaid\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Generate the diagram using the mermaid code
    const hash = crypto.createHash('md5').update(cleanedCode).digest('hex');
    const inputFile = path.join(TEMP_DIR, `${hash}.mmd`);
    const outputFile = path.join(TEMP_DIR, `${hash}.${format}`);

    // Write and render
    await fs.writeFile(inputFile, cleanedCode, 'utf8');

    const puppeteerConfig = path.join(process.cwd(), 'puppeteer-config.json');
    const command = `npx mmdc -i "${inputFile}" -o "${outputFile}" -p "${puppeteerConfig}"`;

    console.log('Generating diagram from prompt:', hash);
    await execAsync(command);

    // Read generated file
    const imageBuffer = await fs.readFile(outputFile);
    const base64 = imageBuffer.toString('base64');
    const mimeType = format === 'svg' ? 'image/svg+xml' : 'image/png';

    // Clean up input file
    await fs.unlink(inputFile);

    res.json({
      success: true,
      format,
      imageUrl: `data:${mimeType};base64,${base64}`,
      mermaidCode: cleanedCode,
      prompt
    });

  } catch (error: any) {
    console.error('Diagram generation from prompt error:', error);
    res.status(500).json({
      error: 'Diagram generation from prompt failed',
      details: error.message
    });
  }
});

/**
 * GET /api/diagrams/types
 * Get list of supported diagram types with examples
 */
router.get('/types', (req: Request, res: Response) => {
  res.json({
    types: [
      {
        name: 'flowchart',
        description: 'Flowcharts and process diagrams',
        example: 'flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[End]'
      },
      {
        name: 'sequence',
        description: 'Sequence diagrams showing interactions',
        example: 'sequenceDiagram\n    participant A\n    participant B\n    A->>B: Request\n    B-->>A: Response'
      },
      {
        name: 'class',
        description: 'Class diagrams for OOP',
        example: 'classDiagram\n    class Animal {\n        +String name\n        +makeSound()\n    }'
      },
      {
        name: 'state',
        description: 'State diagrams',
        example: 'stateDiagram-v2\n    [*] --> Active\n    Active --> Inactive\n    Inactive --> [*]'
      },
      {
        name: 'er',
        description: 'Entity-Relationship diagrams',
        example: 'erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains'
      },
      {
        name: 'gantt',
        description: 'Gantt charts for project planning',
        example: 'gantt\n    title Project\n    section Phase 1\n    Task 1: 2024-01-01, 3d'
      },
      {
        name: 'pie',
        description: 'Pie charts',
        example: 'pie title Distribution\n    "A" : 40\n    "B" : 30\n    "C" : 30'
      },
      {
        name: 'mindmap',
        description: 'Mind maps',
        example: 'mindmap\n  root((Topic))\n    Branch1\n    Branch2'
      },
      {
        name: 'journey',
        description: 'User journey diagrams',
        example: 'journey\n    title Journey\n    section Phase\n      Task: 5: User'
      }
    ]
  });
});

/**
 * Helper: Get Claude prompt template for specific diagram type
 */
function getMermaidPromptForType(diagramType: string): string {
  const prompts: Record<string, string> = {
    flowchart: `You are an expert at creating Mermaid.js flowchart diagrams.
Create clear, well-structured flowcharts using proper syntax:
- Use TD (top-down) or LR (left-right) direction
- Use appropriate shapes: [] for rectangles, () for rounded, {} for diamonds, (()) for circles
- Use --> for arrows, -->|label| for labeled arrows
- Keep it clean and readable`,

    sequence: `You are an expert at creating Mermaid.js sequence diagrams.
Create clear sequence diagrams showing interactions between participants:
- Define participants clearly
- Use ->> for synchronous calls
- Use -->> for responses
- Add notes when helpful
- Keep the flow logical`,

    class: `You are an expert at creating Mermaid.js class diagrams.
Create clear class diagrams for object-oriented design:
- Define classes with attributes and methods
- Use proper relationships: inheritance <|-, composition *--, aggregation o--
- Use + for public, - for private, # for protected
- Keep it organized`,

    state: `You are an expert at creating Mermaid.js state diagrams.
Create clear state diagrams using stateDiagram-v2:
- Use [*] for start/end states
- Show transitions clearly
- Add descriptions when needed
- Keep states well-organized`,

    er: `You are an expert at creating Mermaid.js entity-relationship diagrams.
Create clear ER diagrams for database design:
- Define entities with attributes
- Use proper cardinality: ||--o{ (one-to-many), }o--o{ (many-to-many)
- Keep relationships clear
- Use meaningful names`,

    gantt: `You are an expert at creating Mermaid.js Gantt charts.
Create clear Gantt charts for project planning:
- Use sections to group tasks
- Set realistic dates and durations
- Show dependencies when relevant
- Keep it organized`,

    pie: `You are an expert at creating Mermaid.js pie charts.
Create clear pie charts:
- Add a descriptive title
- Use meaningful labels
- Ensure values sum to 100 or are proportional
- Keep categories distinct`,

    mindmap: `You are an expert at creating Mermaid.js mind maps.
Create clear mind maps:
- Put the main topic at the root
- Create logical branches
- Use hierarchy effectively
- Keep it balanced`,

    journey: `You are an expert at creating Mermaid.js user journey diagrams.
Create clear user journey maps:
- Define sections for phases
- Show tasks with satisfaction scores (1-5)
- Include relevant actors
- Keep the flow logical`
  };

  return prompts[diagramType] || prompts.flowchart;
}

export default router;
