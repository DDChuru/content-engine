/**
 * Topic Content Generator
 *
 * Orchestrates the complete 3-layer content generation for educational topics:
 * 1. Main Course Content (video lesson)
 * 2. Worked Examples (step-by-step videos)
 * 3. Exercise Questions (interactive quiz)
 *
 * Integrates: Specialized agents → Manim → WebSlides-Remotion → SCORM
 */

import { ClaudeService } from './claude.js';
import { videoRenderer, WebSlidesScene } from './video-renderer.js';
import { getFirebaseProject } from './firebase.js';
import { AgentRegistry } from '../agents/registry.js';
import { SetsAgent } from '../agents/sets-agent.js';
import { ExamplesGenerator } from './examples-generator.js';
import { ExerciseGenerator, ExerciseQuestion } from './exercise-generator.js';
import { ManimRenderer, ManimScene } from './manim-renderer.js';
import { GeminiImageGenerator } from './gemini-image-generator.js';
import * as path from 'path';
import { promises as fs } from 'fs';
import { ThemeName } from '../remotion/components/webslides/themes.js';

// ============================================================================
// Interfaces
// ============================================================================

export interface TopicMetadata {
  syllabusId: string;
  unitId: string;
  topicId: string;
  topicCode: string;
  title: string;
  level: 'Core' | 'Extended';
  subtopics?: string[];
}

export interface GenerationOptions {
  voiceId?: string;
  theme?: ThemeName;
  includeLayers: {
    mainContent: boolean;
    examples: boolean;
    exercises: boolean;
  };
}

export interface ConceptContent {
  id: string;
  title: string;
  explanation: string;
  narration: string;
  manimScript?: string;
  visualType: 'manim' | 'gemini' | 'd3';
  duration: number; // seconds
}

export interface WorkedExample {
  id: string;
  problem: string;
  solution: {
    steps: string[];
    finalAnswer: string;
  };
  videoPath?: string;
  duration: number;
}

// ExerciseQuestion imported from exercise-generator.ts

export interface Layer1Result {
  success: boolean;
  videoPath: string;
  concepts: ConceptContent[];
  duration: number;
  cost: number;
}

export interface Layer2Result {
  success: boolean;
  examples: WorkedExample[];
  totalDuration: number;
  cost: number;
}

export interface Layer3Result {
  success: boolean;
  questions: ExerciseQuestion[];
  quizHtmlPath: string;
  cost: number;
}

export interface CompleteTopicResult {
  success: boolean;
  topic: TopicMetadata;
  layer1: Layer1Result;
  layer2: Layer2Result;
  layer3: Layer3Result;
  totalCost: number;
  generatedAt: string;
  outputDir: string;
}

// ============================================================================
// Main Service
// ============================================================================

export class TopicContentGenerator {
  private claudeService: ClaudeService;
  private agentRegistry: AgentRegistry;
  private examplesGenerator: ExamplesGenerator;
  private exerciseGenerator: ExerciseGenerator;
  private manimRenderer: ManimRenderer;
  private geminiGenerator: GeminiImageGenerator;
  private outputBaseDir: string;

  constructor(claudeService: ClaudeService) {
    this.claudeService = claudeService;
    this.agentRegistry = new AgentRegistry();
    this.examplesGenerator = new ExamplesGenerator(claudeService);
    this.exerciseGenerator = new ExerciseGenerator(claudeService);
    this.manimRenderer = new ManimRenderer();
    this.geminiGenerator = new GeminiImageGenerator(process.env.GEMINI_API_KEY || '');
    this.outputBaseDir = 'output/topics';

    // Register available agents
    this.registerAgents();
  }

  /**
   * Register all specialized agents
   */
  private registerAgents(): void {
    // Register Sets Agent
    // TODO: SetsAgent needs to implement DomainAgent interface
    // For now, skip registration and use direct concept generation
    // const setsAgent = new SetsAgent(this.claudeService);
    // this.agentRegistry.register(setsAgent);

    console.log('[TopicContentGenerator] Agents registered (0 agents - using direct generation)');
  }

  /**
   * Load topic metadata from Firestore
   */
  private async loadTopicMetadata(
    syllabusId: string,
    unitId: string,
    topicId: string
  ): Promise<TopicMetadata> {
    const educationProject = getFirebaseProject('education');

    if (!educationProject) {
      throw new Error('Education Firebase project not initialized');
    }

    const db = educationProject.db;

    // Path: syllabi/{syllabusId}/units/{unitId}/topics/{topicId}
    const topicRef = db
      .collection('syllabi')
      .doc(syllabusId)
      .collection('units')
      .doc(unitId)
      .collection('topics')
      .doc(topicId);

    const topicDoc = await topicRef.get();

    if (!topicDoc.exists) {
      throw new Error(`Topic not found: ${topicId}`);
    }

    const data = topicDoc.data()!;

    return {
      syllabusId,
      unitId,
      topicId,
      topicCode: data.code || topicId.toUpperCase(),
      title: data.title,
      level: data.level || 'Core',
      subtopics: data.subtopics || []
    };
  }

  /**
   * Generate Layer 1: Main Course Content
   *
   * Uses specialized agent to generate concepts, then renders video
   */
  async generateMainContent(
    topic: TopicMetadata,
    options: GenerationOptions
  ): Promise<Layer1Result> {
    console.log(`\n[Layer 1] Generating main content for: ${topic.title}`);
    console.log(`  Code: ${topic.topicCode}, Level: ${topic.level}`);

    // Find appropriate agent for this topic
    const agentMatch = this.agentRegistry.findBestAgent({
      id: `topic-${topic.topicId}`,
      description: `Generate educational content for ${topic.title}`,
      context: { topic, level: topic.level }
    });

    if (agentMatch) {
      console.log(`  ✓ Agent selected: ${agentMatch.agent.getMetadata().name} (confidence: ${agentMatch.confidence})`);
    } else {
      console.log(`  ⚠ No specialized agent found, using generic concept generation`);
    }

    // Generate concepts using agent (or generic if no agent found)
    const concepts = await this.generateConcepts(topic, agentMatch?.agent);

    // Generate visual assets and create scenes for Remotion
    const visualsDir = path.join(this.outputBaseDir, topic.topicId, 'visuals');
    await fs.mkdir(visualsDir, { recursive: true });

    const scenes: WebSlidesScene[] = [];

    for (const [index, concept] of concepts.entries()) {
      console.log(`  [Concept ${index + 1}/${concepts.length}] Generating visual for: ${concept.title}`);

      let visualPath: string;
      let sceneType: 'manim' | 'gemini' | 'd3-svg' | 'webslides-venn';

      if (concept.visualType === 'manim') {
        // Generate Manim animation video
        const manimScene: ManimScene = {
          sceneType: 'theory',  // Default to theory scene
          concept: concept.title,
          parameters: {
            customCode: concept.manimScript,
            targetDuration: concept.duration
          }
        };

        visualPath = await this.manimRenderer.renderAnimation(manimScene, 'low');
        sceneType = 'manim';

      } else if (concept.visualType === 'gemini') {
        // Generate Gemini background image
        const imageResult = await this.geminiGenerator.generateImage({
          concept: concept.title,
          description: concept.explanation.substring(0, 200), // Limit description length
          style: 'professional',
          outputDir: visualsDir,
          allowText: false  // STRICT: NO TEXT in images
        });

        if (!imageResult.success || !imageResult.imagePath) {
          throw new Error(`Gemini image generation failed: ${imageResult.error}`);
        }

        visualPath = imageResult.imagePath;
        sceneType = 'gemini';

      } else {
        // D3/SVG - use webslides-venn overlay (no visual file needed)
        visualPath = ''; // Empty - will render SVG overlay
        sceneType = 'webslides-venn';
      }

      scenes.push({
        id: index + 1,
        title: concept.title,
        subtitle: `${topic.topicCode} - ${topic.title}`,
        mathNotation: concept.explanation.match(/[\{\}\∪\∩\∈\⊂\⊆]/) ? concept.explanation.split('\n')[0] : undefined,
        visual: visualPath,
        duration: concept.duration,
        type: sceneType
      });
    }

    // Render video using WebSlides-Remotion
    const outputDir = path.join(this.outputBaseDir, topic.topicId, 'main-content');
    await fs.mkdir(outputDir, { recursive: true });

    const videoFilename = `${topic.topicId}-lesson.mp4`;
    const renderResult = await videoRenderer.quickRender(
      scenes,
      videoFilename,
      options.theme || 'education-dark'
    );

    if (!renderResult.success) {
      throw new Error(`Video rendering failed: ${renderResult.error}`);
    }

    const totalDuration = concepts.reduce((sum, c) => sum + c.duration, 0);

    // Estimated cost (Manim FREE + Gemini $0.039/image + ElevenLabs $0.30/1K chars)
    const geminiImages = concepts.filter(c => c.visualType === 'gemini').length;
    const totalChars = concepts.reduce((sum, c) => sum + c.narration.length, 0);
    const cost = (geminiImages * 0.039) + (totalChars / 1000 * 0.30);

    console.log(`  ✓ Main content generated: ${totalDuration}s video, $${cost.toFixed(2)}`);

    return {
      success: true,
      videoPath: renderResult.videoPath!,
      concepts,
      duration: totalDuration,
      cost
    };
  }

  /**
   * Generate concepts for a topic using specialized agent
   */
  private async generateConcepts(
    topic: TopicMetadata,
    agent: any
  ): Promise<ConceptContent[]> {
    // For Sets topic, generate 6 concepts:
    // 1. Introduction to Sets
    // 2. Set Notation
    // 3. Union Operation
    // 4. Intersection Operation
    // 5. Complement
    // 6. Venn Diagrams

    if (topic.title.toLowerCase().includes('set')) {
      return this.generateSetsConcepts(topic);
    }

    // Default: Use Claude to generate concepts
    return this.generateGenericConcepts(topic);
  }

  /**
   * Generate concepts for Sets topic
   */
  private async generateSetsConcepts(topic: TopicMetadata): Promise<ConceptContent[]> {
    const concepts: ConceptContent[] = [
      {
        id: 'intro',
        title: 'Introduction to Sets',
        explanation: 'A set is a collection of distinct objects, called elements or members.',
        narration: 'Welcome to this lesson on set theory. A set is simply a collection of distinct objects. These objects are called elements or members of the set. Sets are fundamental to mathematics and appear everywhere from algebra to statistics.',
        visualType: 'gemini',
        duration: 60
      },
      {
        id: 'notation',
        title: 'Set Notation',
        explanation: 'Sets are written using curly braces: A = {1, 2, 3, 4, 5}',
        narration: 'We write sets using curly braces. For example, A equals the set containing 1, 2, 3, 4, and 5. We can also use set-builder notation, which describes the properties elements must have to belong to the set.',
        visualType: 'manim',
        duration: 90
      },
      {
        id: 'union',
        title: 'Union Operation',
        explanation: 'A ∪ B contains all elements in A or B (or both)',
        narration: 'The union of two sets A and B, written A union B, contains all elements that are in A, or in B, or in both sets. Think of it as combining the two sets together.',
        visualType: 'manim',
        duration: 120
      },
      {
        id: 'intersection',
        title: 'Intersection Operation',
        explanation: 'A ∩ B contains only elements in both A and B',
        narration: 'The intersection of A and B, written A intersect B, contains only the elements that appear in both sets. These are the elements they have in common.',
        visualType: 'manim',
        duration: 120
      },
      {
        id: 'complement',
        title: 'Complement',
        explanation: "A' contains all elements NOT in A",
        narration: "The complement of set A, written A prime, contains all elements that are NOT in A. This assumes we have a universal set that contains all possible elements we're considering.",
        visualType: 'manim',
        duration: 90
      },
      {
        id: 'venn-diagrams',
        title: 'Venn Diagrams',
        explanation: 'Visual representation of sets using circles',
        narration: 'Venn diagrams are a powerful visual tool for understanding sets. We represent each set as a circle, and the overlap between circles shows the intersection. This makes it easy to see relationships between sets.',
        visualType: 'manim',
        duration: 120
      }
    ];

    return concepts;
  }

  /**
   * Generate generic concepts using Claude
   */
  private async generateGenericConcepts(topic: TopicMetadata): Promise<ConceptContent[]> {
    const prompt = `Generate 6 educational concepts for the topic: ${topic.title} (${topic.topicCode})

Level: ${topic.level}
Target age: 14-16 years (Cambridge IGCSE)

For each concept, provide:
1. Title (short, clear)
2. Explanation (1-2 sentences, simple language)
3. Narration script (conversational, 60-120 seconds when spoken)
4. Visual type: "manim" for math animations, "gemini" for illustrations

Format as JSON array:
[
  {
    "id": "concept-1",
    "title": "...",
    "explanation": "...",
    "narration": "...",
    "visualType": "manim" | "gemini",
    "duration": 60-120
  }
]`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    const content = response.content[0]?.text || '';

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse concepts from Claude');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Generate Layer 2: Worked Examples
   */
  async generateExamples(
    topic: TopicMetadata,
    options: GenerationOptions,
    concepts: ConceptContent[]
  ): Promise<Layer2Result> {
    console.log(`\n[Layer 2] Generating worked examples for: ${topic.title}`);

    const outputDir = path.join(this.outputBaseDir, topic.topicId);

    const result = await this.examplesGenerator.generateExamples({
      topicTitle: topic.title,
      topicCode: topic.topicCode,
      level: topic.level,
      concepts: concepts.map(c => c.title),
      targetCount: 3,
      theme: options.theme,
      outputDir
    });

    if (!result.success) {
      console.error(`  ✗ Examples generation failed: ${result.error}`);
      return {
        success: false,
        examples: [],
        totalDuration: 0,
        cost: 0
      };
    }

    // Convert to WorkedExample format
    const examples: WorkedExample[] = result.examples.map(ex => ({
      id: ex.id,
      problem: ex.problem,
      solution: {
        steps: ['Step-by-step solution'],  // Simplified
        finalAnswer: 'See video'
      },
      videoPath: ex.videoPath,
      duration: ex.duration
    }));

    console.log(`  ✓ ${examples.length} examples generated: ${result.totalDuration}s, $${result.totalCost.toFixed(2)}`);

    return {
      success: true,
      examples,
      totalDuration: result.totalDuration,
      cost: result.totalCost
    };
  }

  /**
   * Generate Layer 3: Exercise Questions
   */
  async generateExercises(
    topic: TopicMetadata,
    options: GenerationOptions,
    concepts: ConceptContent[]
  ): Promise<Layer3Result> {
    console.log(`\n[Layer 3] Generating exercise questions for: ${topic.title}`);

    const outputDir = path.join(this.outputBaseDir, topic.topicId);

    const result = await this.exerciseGenerator.generateExercises({
      topicTitle: topic.title,
      topicCode: topic.topicCode,
      level: topic.level,
      concepts: concepts.map(c => c.title),
      targetCount: 10,
      outputDir
    });

    if (!result.success) {
      console.error(`  ✗ Exercise generation failed: ${result.error}`);
      return {
        success: false,
        questions: [],
        quizHtmlPath: '',
        cost: 0
      };
    }

    console.log(`  ✓ ${result.questions.length} questions generated, quiz HTML created`);

    return {
      success: true,
      questions: result.questions,
      quizHtmlPath: result.quizHtmlPath,
      cost: result.totalCost
    };
  }

  /**
   * Generate HTML quiz with SCORM tracking (DEPRECATED - moved to ExerciseGenerator)
   */
  private generateQuizHTML(questions: ExerciseQuestion[], topic: TopicMetadata): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic.title} - Practice Quiz</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .quiz-container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1e88e5;
      margin-bottom: 10px;
    }
    .question {
      margin: 30px 0;
      padding: 20px;
      border-left: 4px solid #1e88e5;
      background: #f9f9f9;
    }
    .options label {
      display: block;
      padding: 10px;
      margin: 5px 0;
      cursor: pointer;
      border-radius: 5px;
      transition: background 0.2s;
    }
    .options label:hover {
      background: #e3f2fd;
    }
    .submit-btn {
      background: #1e88e5;
      color: white;
      border: none;
      padding: 12px 30px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
    }
    .submit-btn:hover {
      background: #1565c0;
    }
    .result {
      margin-top: 20px;
      padding: 15px;
      border-radius: 5px;
      display: none;
    }
    .result.show {
      display: block;
    }
    .result.correct {
      background: #c8e6c9;
      color: #2e7d32;
    }
    .result.incorrect {
      background: #ffcdd2;
      color: #c62828;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <h1>${topic.title}</h1>
    <p><strong>Topic Code:</strong> ${topic.topicCode} | <strong>Level:</strong> ${topic.level}</p>
    <p>Answer the questions below. You'll receive instant feedback!</p>

    ${questions.map((q, i) => `
      <div class="question" id="q${i}">
        <h3>Question ${i + 1}</h3>
        <p>${q.question}</p>
        ${q.type === 'multiple-choice' ? `
          <div class="options">
            ${q.options!.map((opt, j) => `
              <label>
                <input type="radio" name="q${i}" value="${opt}">
                ${opt}
              </label>
            `).join('')}
          </div>
        ` : `
          <input type="text" id="answer${i}" placeholder="Enter your answer" style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ccc; border-radius: 5px;">
        `}
        <button class="submit-btn" onclick="checkAnswer(${i})">Submit Answer</button>
        <div class="result" id="result${i}"></div>
      </div>
    `).join('')}
  </div>

  <script>
    const questions = ${JSON.stringify(questions)};

    function checkAnswer(index) {
      const question = questions[index];
      let userAnswer;

      if (question.type === 'multiple-choice') {
        const selected = document.querySelector('input[name="q' + index + '"]:checked');
        if (!selected) {
          alert('Please select an answer');
          return;
        }
        userAnswer = selected.value;
      } else {
        userAnswer = document.getElementById('answer' + index).value.trim();
      }

      const resultDiv = document.getElementById('result' + index);
      const isCorrect = userAnswer === question.correctAnswer;

      resultDiv.className = 'result show ' + (isCorrect ? 'correct' : 'incorrect');
      resultDiv.innerHTML = isCorrect
        ? '<strong>✓ Correct!</strong><br>' + question.explanation
        : '<strong>✗ Incorrect.</strong><br><strong>Hint:</strong> ' + question.hint + '<br><strong>Explanation:</strong> ' + question.explanation;

      // TODO: Send to SCORM API (track progress)
      console.log('Answer submitted:', { questionId: question.id, correct: isCorrect });
    }
  </script>
</body>
</html>`;
  }

  /**
   * Generate complete topic content (all 3 layers)
   */
  async generateComplete(
    syllabusId: string,
    unitId: string,
    topicId: string,
    options: Partial<GenerationOptions> = {}
  ): Promise<CompleteTopicResult> {
    const startTime = Date.now();

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║         TOPIC CONTENT GENERATION (3 Layers)              ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');

    // Load topic metadata from Firestore
    const topic = await this.loadTopicMetadata(syllabusId, unitId, topicId);

    console.log(`\nTopic: ${topic.title} (${topic.topicCode})`);
    console.log(`Level: ${topic.level}`);

    // Default options
    const fullOptions: GenerationOptions = {
      voiceId: options.voiceId,
      theme: options.theme || 'education-dark',
      includeLayers: {
        mainContent: options.includeLayers?.mainContent ?? true,
        examples: options.includeLayers?.examples ?? true,
        exercises: options.includeLayers?.exercises ?? true
      }
    };

    // Generate each layer
    const layer1 = fullOptions.includeLayers.mainContent
      ? await this.generateMainContent(topic, fullOptions)
      : { success: false, videoPath: '', concepts: [], duration: 0, cost: 0 };

    const layer2 = fullOptions.includeLayers.examples
      ? await this.generateExamples(topic, fullOptions, layer1.concepts)
      : { success: false, examples: [], totalDuration: 0, cost: 0 };

    const layer3 = fullOptions.includeLayers.exercises
      ? await this.generateExercises(topic, fullOptions, layer1.concepts)
      : { success: false, questions: [], quizHtmlPath: '', cost: 0 };

    const totalCost = layer1.cost + layer2.cost + layer3.cost;
    const executionTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    GENERATION COMPLETE                    ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`\n✓ Topic: ${topic.title}`);
    console.log(`✓ Layer 1: ${layer1.duration}s video, $${layer1.cost.toFixed(2)}`);
    console.log(`✓ Layer 2: ${layer2.examples.length} examples, $${layer2.cost.toFixed(2)}`);
    console.log(`✓ Layer 3: ${layer3.questions.length} questions, $${layer3.cost.toFixed(2)}`);
    console.log(`✓ Total cost: $${totalCost.toFixed(2)}`);
    console.log(`✓ Generated in: ${executionTime} minutes\n`);

    return {
      success: true,
      topic,
      layer1,
      layer2,
      layer3,
      totalCost,
      generatedAt: new Date().toISOString(),
      outputDir: path.join(this.outputBaseDir, topic.topicId)
    };
  }
}
