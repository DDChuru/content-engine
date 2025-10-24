# Educational Content Pipeline - Implementation Plan

**Branch:** `feature/educational-content`
**Status:** Ready for manual development
**Priority:** Medium
**Dependencies:** None (fully independent)

---

## 🎯 Objectives

1. Enhanced GitHub repository analysis
2. Automated course generation from topics
3. Interactive quizzes and assessments
4. SCORM export for LMS integration
5. Video tutorial generation

---

## 📐 Architecture

```
src/agents/education/
├── manual-generator.ts          (Enhanced from existing)
├── course-generator.ts          (NEW)
├── quiz-generator.ts            (NEW)
├── assessment-generator.ts      (NEW)
└── scorm-exporter.ts            (NEW)

src/routes/
└── education.ts                 (NEW)

src/templates/
├── course-module.html
├── quiz.html
├── certificate.html
└── scorm-manifest.xml
```

---

## 📋 Phase 1: Enhanced Manual Generator (4 hours)

### Enhance: `src/agents/user-journey/index.ts`

**New Features:**
- Deeper code analysis (function-level, not just file-level)
- API endpoint documentation
- Architecture diagrams (Mermaid)
- Usage examples extraction
- Dependency mapping

### Implementation:

```typescript
class EnhancedManualGenerator extends UserJourneyAgent {
  async analyzeDeeper(projectPath: string, features: string[]): Promise<DeepAnalysis> {
    // 1. Extract all functions/methods
    const functions = await this.extractFunctions(projectPath);

    // 2. Generate API documentation
    const apiDocs = await this.documentAPIs(projectPath);

    // 3. Create architecture diagram
    const architecture = await this.generateArchitectureDiagram(projectPath);

    // 4. Extract usage examples
    const examples = await this.findUsageExamples(projectPath);

    return { functions, apiDocs, architecture, examples };
  }

  private async extractFunctions(projectPath: string): Promise<FunctionDoc[]> {
    // Parse TypeScript/JavaScript files
    // Extract function signatures, parameters, return types
    // Recommended: Use ts-morph library

    // Example implementation:
    const project = new Project({
      tsConfigFilePath: path.join(projectPath, 'tsconfig.json')
    });

    const sourceFiles = project.getSourceFiles();
    const functions: FunctionDoc[] = [];

    for (const file of sourceFiles) {
      const fileFunctions = file.getFunctions();

      for (const fn of fileFunctions) {
        functions.push({
          name: fn.getName(),
          parameters: fn.getParameters().map(p => ({
            name: p.getName(),
            type: p.getType().getText()
          })),
          returnType: fn.getReturnType().getText(),
          documentation: fn.getJsDocs().map(d => d.getComment()).join('\n'),
          filePath: file.getFilePath(),
          lineNumber: fn.getStartLineNumber()
        });
      }
    }

    return functions;
  }

  private async documentAPIs(projectPath: string): Promise<APIDoc[]> {
    // Find Express routes, API endpoints
    // Look for: router.get(), router.post(), app.get(), etc.
    // Extract request/response formats
    // Generate OpenAPI spec

    const apiDocs: APIDoc[] = [];
    const routeFiles = await this.findFiles(projectPath, 'routes');

    for (const file of routeFiles) {
      const content = await fs.readFile(file, 'utf-8');

      // Parse routes (simple regex, can be enhanced)
      const routeMatches = content.matchAll(/router\.(get|post|put|delete)\(['"](.+?)['"],/g);

      for (const match of routeMatches) {
        apiDocs.push({
          method: match[1].toUpperCase(),
          path: match[2],
          file: file,
          // Extract request/response types from code analysis
        });
      }
    }

    return apiDocs;
  }

  private async generateArchitectureDiagram(projectPath: string): Promise<string> {
    // Analyze project structure
    // Generate Mermaid diagram
    // Show components, services, data flow

    const structure = await this.analyzeStructure(projectPath);

    const mermaid = `graph TD
    ${structure.components.map(c => `    ${c.name}[${c.type}]`).join('\n')}
    ${structure.connections.map(c => `    ${c.from} --> ${c.to}`).join('\n')}`;

    return mermaid;
  }

  private async findUsageExamples(projectPath: string): Promise<Example[]> {
    // Look for test files, example files, README code blocks
    // Extract actual usage examples

    const examples: Example[] = [];

    // Check test files
    const testFiles = await this.findFiles(projectPath, 'test');
    // Parse test files for usage patterns

    // Check README
    const readmePath = path.join(projectPath, 'README.md');
    if (await fs.access(readmePath).then(() => true).catch(() => false)) {
      const readme = await fs.readFile(readmePath, 'utf-8');
      // Extract code blocks
    }

    return examples;
  }
}
```

### Dependencies:
```bash
npm install ts-morph @typescript-eslint/parser
```

---

## 📋 Phase 2: Course Generator (6 hours)

### File: `src/agents/education/course-generator.ts`

```typescript
export class CourseGenerator {
  constructor(
    private claudeService: ClaudeService,
    private imageGenerator: ImageGenerator
  ) {}

  async generateCourse(
    topic: string,
    targetAudience: string,
    duration: number
  ): Promise<Course> {
    // 1. Generate curriculum
    const curriculum = await this.createCurriculum(topic, targetAudience, duration);

    // 2. Generate modules
    const modules = await Promise.all(
      curriculum.modules.map(m => this.createModule(m))
    );

    // 3. Generate assessments
    const assessments = await this.createAssessments(modules);

    // 4. Generate certificate template
    const certificate = await this.createCertificateTemplate(topic);

    return {
      title: topic,
      modules,
      assessments,
      certificate,
      metadata: {
        targetAudience,
        duration,
        difficulty: curriculum.difficulty
      }
    };
  }

  private async createCurriculum(
    topic: string,
    audience: string,
    duration: number
  ): Promise<Curriculum> {
    // Use Claude to design curriculum
    const prompt = `Design a comprehensive course curriculum:

Topic: ${topic}
Target Audience: ${audience}
Total Duration: ${duration} hours

Create a structured curriculum with:
1. Course learning objectives
2. Module breakdown (each module 1-2 hours)
3. For each module:
   - Title
   - Learning objectives
   - Key concepts to cover
   - Estimated duration
   - Prerequisites
4. Overall difficulty level (beginner/intermediate/advanced)

Return as JSON matching this structure:
{
  "title": "...",
  "objectives": ["...", "..."],
  "difficulty": "...",
  "modules": [
    {
      "title": "...",
      "duration": 1.5,
      "objectives": ["..."],
      "concepts": ["..."],
      "prerequisites": ["..."]
    }
  ]
}`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return JSON.parse(this.extractJSON(response.content[0].text));
  }

  private async createModule(moduleSpec: ModuleSpec): Promise<Module> {
    // Generate content for each module
    const content = await this.generateContent(moduleSpec);
    const videoScripts = await this.generateVideoScripts(moduleSpec);
    const exercises = await this.generateExercises(moduleSpec);
    const resources = await this.generateResources(moduleSpec);

    return {
      title: moduleSpec.title,
      content,
      videos: videoScripts,
      exercises,
      resources,
      duration: moduleSpec.duration,
      quiz: await this.generateModuleQuiz(moduleSpec)
    };
  }

  private async generateContent(moduleSpec: ModuleSpec): Promise<string> {
    // Generate module content in markdown/HTML
    const prompt = `Create detailed educational content for this module:

Module: ${moduleSpec.title}
Objectives: ${moduleSpec.objectives.join(', ')}
Concepts: ${moduleSpec.concepts.join(', ')}

Generate:
1. Introduction (why this matters)
2. Main content (detailed explanation of each concept)
3. Visual examples (describe diagrams/images needed)
4. Key takeaways
5. Common pitfalls to avoid

Format: Markdown with clear structure
Tone: Educational, clear, engaging`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return response.content[0].text;
  }

  private async generateVideoScripts(moduleSpec: ModuleSpec): Promise<VideoScript[]> {
    // Generate video scripts for module
    // Each concept gets a short video (5-10 min)

    const scripts: VideoScript[] = [];

    for (const concept of moduleSpec.concepts) {
      const script = await this.createVideoScript(concept, moduleSpec);
      scripts.push(script);
    }

    return scripts;
  }

  private async createVideoScript(concept: string, module: ModuleSpec): Promise<VideoScript> {
    const prompt = `Create a video script for this concept:

Concept: ${concept}
Module Context: ${module.title}
Target Duration: 7 minutes

Script structure:
1. Hook (15 seconds) - Grab attention
2. Introduction (30 seconds) - What we'll learn
3. Main Content (5 minutes) - Explain concept with examples
4. Practice (1 minute) - Quick exercise
5. Summary (30 seconds) - Key takeaways

Include:
- Narration text (what to say)
- Visual cues (what to show on screen)
- Examples/demos
- Key points to emphasize

Return as JSON.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return JSON.parse(this.extractJSON(response.content[0].text));
  }

  private async generateExercises(moduleSpec: ModuleSpec): Promise<Exercise[]> {
    // Generate hands-on exercises
    const prompt = `Create practical exercises for this module:

Module: ${moduleSpec.title}
Concepts: ${moduleSpec.concepts.join(', ')}

Generate 3-5 exercises:
1. Each exercise should practice one concept
2. Include clear instructions
3. Provide starter code/template (if applicable)
4. Include expected outcome
5. Add hints for struggling students

Return as JSON array.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return JSON.parse(this.extractJSON(response.content[0].text));
  }

  private async createAssessments(modules: Module[]): Promise<Assessment[]> {
    // Generate quizzes, assignments, final project
    const assessments: Assessment[] = [];

    // Module quizzes (already in modules)

    // Final project
    const finalProject = await this.generateFinalProject(modules);
    assessments.push(finalProject);

    return assessments;
  }

  private async generateFinalProject(modules: Module[]): Promise<Assessment> {
    const allConcepts = modules.flatMap(m => m.content);

    const prompt = `Create a comprehensive final project:

Course Content: ${allConcepts.slice(0, 500)}... [summarized]

Project Requirements:
1. Should integrate multiple concepts from course
2. Realistic, practical application
3. Clear deliverables
4. Grading rubric
5. Estimated time: 4-6 hours

Return as JSON.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return JSON.parse(this.extractJSON(response.content[0].text));
  }

  private async createCertificateTemplate(topic: string): Promise<string> {
    // Generate certificate HTML template
    return `<!DOCTYPE html>
<html>
<head>
  <title>Certificate - ${topic}</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .certificate {
      background: white;
      padding: 60px;
      max-width: 800px;
      border: 10px solid gold;
      text-align: center;
    }
    h1 { font-size: 48px; color: #667eea; }
    .recipient { font-size: 36px; font-weight: bold; margin: 30px 0; }
    .course { font-size: 24px; }
  </style>
</head>
<body>
  <div class="certificate">
    <h1>Certificate of Completion</h1>
    <p>This certifies that</p>
    <div class="recipient">{{STUDENT_NAME}}</div>
    <p>has successfully completed</p>
    <div class="course">${topic}</div>
    <p>{{DATE}}</p>
  </div>
</body>
</html>`;
  }
}
```

---

## 📋 Phase 3: Quiz Generator (4 hours)

### File: `src/agents/education/quiz-generator.ts`

```typescript
export class QuizGenerator {
  constructor(private claudeService: ClaudeService) {}

  async generateQuiz(
    content: string,
    difficulty: 'easy' | 'medium' | 'hard',
    questionCount: number
  ): Promise<Quiz> {
    const questions = await this.generateQuestions(content, difficulty, questionCount);

    return {
      questions,
      passingScore: 70,
      timeLimit: questionCount * 2, // 2 min per question
      shuffleQuestions: true,
      shuffleAnswers: true,
      allowRetake: true,
      showCorrectAnswers: true
    };
  }

  private async generateQuestions(
    content: string,
    difficulty: string,
    count: number
  ): Promise<Question[]> {
    const prompt = `Generate ${count} ${difficulty} multiple-choice questions from this content:

${content.slice(0, 3000)}... [content]

Requirements:
- Test understanding, not just recall
- Each question has 4 answer options
- Only ONE correct answer
- Include clear explanations for correct answers
- Questions should be unambiguous
- Mix of conceptual and application questions

Return as JSON array:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": 0,  // Index of correct answer
    "explanation": "Why this is correct...",
    "difficulty": "medium"
  }
]`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return JSON.parse(this.extractJSON(response.content[0].text));
  }

  async generateAssignment(module: Module): Promise<Assignment> {
    const prompt = `Create a practical assignment:

Module: ${module.title}
Content: ${module.content.slice(0, 1000)}...

Assignment should:
1. Require applying learned concepts
2. Take 1-2 hours to complete
3. Have clear deliverables
4. Include grading criteria

Return as JSON.`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    return JSON.parse(this.extractJSON(response.content[0].text));
  }

  async generateInteractiveQuiz(questions: Question[]): Promise<string> {
    // Generate interactive HTML quiz
    return `<!DOCTYPE html>
<html>
<head>
  <title>Interactive Quiz</title>
  <script>
    const questions = ${JSON.stringify(questions)};
    let currentQuestion = 0;
    let score = 0;

    function showQuestion() {
      const q = questions[currentQuestion];
      document.getElementById('question').textContent = q.question;
      const optionsHTML = q.options.map((opt, i) =>
        \`<div onclick="checkAnswer(\${i})">
           <input type="radio" name="answer" value="\${i}">
           <label>\${opt}</label>
         </div>\`
      ).join('');
      document.getElementById('options').innerHTML = optionsHTML;
    }

    function checkAnswer(selected) {
      const correct = questions[currentQuestion].correct;
      if (selected === correct) {
        score++;
        alert('Correct! ' + questions[currentQuestion].explanation);
      } else {
        alert('Incorrect. ' + questions[currentQuestion].explanation);
      }

      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        showResults();
      }
    }

    function showResults() {
      const percentage = (score / questions.length) * 100;
      document.body.innerHTML = \`
        <h1>Quiz Complete!</h1>
        <p>Score: \${score}/\${questions.length} (\${percentage.toFixed(1)}%)</p>
        <p>\${percentage >= 70 ? 'Passed!' : 'Try again'}</p>
      \`;
    }

    window.onload = showQuestion;
  </script>
</head>
<body>
  <div id="quiz">
    <h2 id="question"></h2>
    <div id="options"></div>
  </div>
</body>
</html>`;
  }
}
```

---

## 📋 Phase 4: SCORM Exporter (5 hours)

### File: `src/agents/education/scorm-exporter.ts`

```typescript
import JSZip from 'jszip';

export class SCORMExporter {
  async exportToSCORM(course: Course, version: '1.2' | '2004'): Promise<Buffer> {
    const zip = new JSZip();

    // 1. Create manifest
    const manifest = this.generateManifest(course, version);
    zip.file('imsmanifest.xml', manifest);

    // 2. Add SCORM API wrapper
    const apiWrapper = version === '1.2' ? this.getAPI12() : this.getAPI2004();
    zip.file('scorm_api.js', apiWrapper);

    // 3. Add content
    for (let i = 0; i < course.modules.length; i++) {
      const module = course.modules[i];
      const html = this.generateSCO(module, i);
      zip.file(`module_${i}/index.html`, html);
    }

    // 4. Add quizzes
    // ... add quiz HTML

    // 5. Generate ZIP
    return await zip.generateAsync({ type: 'nodebuffer' });
  }

  private generateManifest(course: Course, version: string): string {
    if (version === '1.2') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="course_${Date.now()}" version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="course_org">
    <organization identifier="course_org">
      <title>${course.title}</title>
      ${course.modules.map((m, i) => `
      <item identifier="module_${i}" identifierref="resource_${i}">
        <title>${m.title}</title>
      </item>`).join('')}
    </organization>
  </organizations>
  <resources>
    ${course.modules.map((m, i) => `
    <resource identifier="resource_${i}" type="webcontent"
              adlcp:scormtype="sco" href="module_${i}/index.html">
      <file href="module_${i}/index.html"/>
    </resource>`).join('')}
  </resources>
</manifest>`;
    }

    // SCORM 2004 manifest (more complex)
    return `...SCORM 2004 manifest...`;
  }

  private generateSCO(module: Module, index: number): string {
    // Generate SCO HTML with SCORM API calls
    return `<!DOCTYPE html>
<html>
<head>
  <title>${module.title}</title>
  <script src="../scorm_api.js"></script>
  <script>
    // Initialize SCORM
    var API = null;

    function findAPI(win) {
      while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        win = win.parent;
      }
      return win.API;
    }

    function initializeSCORM() {
      API = findAPI(window);
      if (API) {
        API.LMSInitialize("");
        API.LMSSetValue("cmi.core.lesson_status", "incomplete");
      }
    }

    function completeSCORM() {
      if (API) {
        API.LMSSetValue("cmi.core.lesson_status", "completed");
        API.LMSSetValue("cmi.core.score.raw", "100");
        API.LMSCommit("");
        API.LMSFinish("");
      }
    }

    window.onload = initializeSCORM;
    window.onbeforeunload = completeSCORM;
  </script>
</head>
<body>
  <h1>${module.title}</h1>
  <div class="content">
    ${module.content}
  </div>
  <button onclick="completeSCORM()">Mark Complete</button>
</body>
</html>`;
  }

  private getAPI12(): string {
    // SCORM 1.2 API wrapper
    return `... SCORM 1.2 API implementation ...`;
  }

  private getAPI2004(): string {
    // SCORM 2004 API wrapper
    return `... SCORM 2004 API implementation ...`;
  }
}
```

### Dependencies:
```bash
npm install jszip
```

---

## 📋 Phase 5: API Routes (3 hours)

### File: `src/routes/education.ts`

```typescript
import express from 'express';
import { EnhancedManualGenerator } from '../agents/education/manual-generator';
import { CourseGenerator } from '../agents/education/course-generator';
import { QuizGenerator } from '../agents/education/quiz-generator';
import { SCORMExporter } from '../agents/education/scorm-exporter';

const router = express.Router();

// Initialize services
const manualGenerator = new EnhancedManualGenerator(geminiApiKey);
const courseGenerator = new CourseGenerator(claudeService, imageGenerator);
const quizGenerator = new QuizGenerator(claudeService);
const scormExporter = new SCORMExporter();

/**
 * POST /api/education/manual
 * Enhanced manual generation from GitHub repo
 */
router.post('/manual', async (req, res) => {
  try {
    const { repoUrl, features, title, subtitle } = req.body;

    const manual = await manualGenerator.generate({
      repoUrl,
      features,
      title,
      subtitle,
      outputDir: path.join(process.cwd(), 'output', 'manuals'),
      mode: 'user-manual'
    });

    res.json(manual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/education/course
 * Generate complete course from topic
 */
router.post('/course', async (req, res) => {
  try {
    const { topic, targetAudience, duration } = req.body;

    if (!topic || !targetAudience || !duration) {
      return res.status(400).json({
        error: 'topic, targetAudience, and duration are required'
      });
    }

    const course = await courseGenerator.generateCourse(
      topic,
      targetAudience,
      duration
    );

    // Save course
    const courseId = `course_${Date.now()}`;
    await saveCourse(courseId, course);

    res.json({
      courseId,
      course,
      message: 'Course generated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/education/quiz
 * Generate quiz from content
 */
router.post('/quiz', async (req, res) => {
  try {
    const { content, difficulty, questionCount } = req.body;

    const quiz = await quizGenerator.generateQuiz(
      content,
      difficulty || 'medium',
      questionCount || 10
    );

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/education/scorm/:courseId
 * Export course as SCORM package
 */
router.get('/scorm/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { version = '2004' } = req.query;

    const course = await loadCourse(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const scormPackage = await scormExporter.exportToSCORM(
      course,
      version as '1.2' | '2004'
    );

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${courseId}_scorm.zip"`);
    res.send(scormPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/education/interactive-quiz/:quizId
 * Get interactive HTML quiz
 */
router.get('/interactive-quiz/:quizId', async (req, res) => {
  try {
    const quiz = await loadQuiz(req.params.quizId);
    const html = await quizGenerator.generateInteractiveQuiz(quiz.questions);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## 📋 Phase 6: Video Generation Integration (4 hours)

**IMPORTANT:** Video infrastructure already exists in the main `content-engine` repository. This phase is about integration, not building from scratch.

### Existing Video System

**Location:** `/home/dachu/Documents/projects/content-engine/`

**Already Installed:**
```json
{
  "remotion": "^4.0.364",
  "@remotion/bundler": "^4.0.364",
  "@remotion/renderer": "^4.0.364",
  "openai": "^6.6.0"  // TTS
}
```

**Existing Pipeline:**
```
Claude Script Generation
    ↓
Gemini Image Generation (scenes)
    ↓
OpenAI TTS Narration (audio)
    ↓
Remotion Composition → MP4
```

**Cost:** ~$0.40-0.60 per 10-minute educational module

### File: `src/agents/education/video-generator.ts`

```typescript
import { renderVideo } from '../../services/video-renderer';  // Existing service!
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export class EducationalVideoGenerator {
  constructor(
    private gemini: GoogleGenerativeAI,
    private openai: OpenAI
  ) {}

  async generateModuleVideo(
    module: Module,
    script: VideoScript
  ): Promise<VideoResult> {
    // 1. Generate concept images (reuse existing Gemini patterns)
    const images = await this.generateConceptImages(module.concepts);

    // 2. Generate narration (reuse existing OpenAI TTS)
    const narration = await this.generateNarration(script);

    // 3. Prepare scenes for Remotion
    const scenes = module.concepts.map((concept, i) => ({
      id: i + 1,
      title: concept.name,
      explanation: concept.description,
      image: images[i].path,
      audio: narration[i].path,
      duration: script.segments[i].duration || 45
    }));

    // 4. Render using EXISTING video renderer
    const videoPath = await renderVideo({
      composition: 'EducationalModule',
      scenes,
      outputPath: `output/courses/${module.id}.mp4`,
      codec: 'h264',
      width: 1920,
      height: 1080,
      fps: 30
    });

    return {
      videoPath,
      scenes: scenes.length,
      duration: scenes.reduce((sum, s) => sum + s.duration, 0),
      cost: this.calculateCost(images.length, narration.length)
    };
  }

  private async generateConceptImages(concepts: string[]): Promise<ImageResult[]> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash-image' });
    const images: ImageResult[] = [];

    // Use same batch processing pattern from video-director.ts
    const batchSize = 3;
    for (let i = 0; i < concepts.length; i += batchSize) {
      const batch = concepts.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (concept, batchIndex) => {
          const globalIndex = i + batchIndex;

          // Use narrative prompts (proven to work better than keywords)
          const prompt = `Educational illustration for: ${concept}

Style: Clean, professional educational diagram
Visual approach: Clear, easy to understand, suitable for learning
Technical specs: Well-lit, high clarity, suitable for video presentation
Color palette: Professional, not distracting
Composition: Centered, balanced, with clear focal point`;

          const result = await model.generateContent(prompt);
          const imagePart = result.response.candidates[0].content.parts.find(
            (part: any) => part.inlineData
          );

          if (!imagePart?.inlineData?.data) {
            throw new Error(`Image generation failed for concept: ${concept}`);
          }

          const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
          const imagePath = `output/courses/${Date.now()}/concept-${globalIndex + 1}.png`;

          await fs.mkdir(path.dirname(imagePath), { recursive: true });
          await fs.writeFile(imagePath, imageBuffer);

          return { path: imagePath, concept };
        })
      );

      images.push(...batchResults);

      // Rate limiting delay
      if (i + batchSize < concepts.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return images;
  }

  private async generateNarration(script: VideoScript): Promise<AudioResult[]> {
    const audio: AudioResult[] = [];

    // Sequential processing for consistent quality
    for (let i = 0; i < script.segments.length; i++) {
      const segment = script.segments[i];

      const mp3 = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',  // Professional, neutral voice
        input: segment.narration
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      const audioPath = `output/courses/${Date.now()}/narration-${i + 1}.mp3`;

      await fs.mkdir(path.dirname(audioPath), { recursive: true });
      await fs.writeFile(audioPath, buffer);

      audio.push({ path: audioPath, segment: i + 1 });
    }

    return audio;
  }

  private calculateCost(imageCount: number, audioCount: number): number {
    const imageCost = imageCount * 0.01;  // ~$0.01 per Gemini image
    const audioCost = audioCount * 0.03;   // ~$0.03 per TTS narration
    return imageCost + audioCost;
  }
}
```

### Remotion Component: `src/remotion/EducationalScene.tsx`

```tsx
import { AbsoluteFill, Img, Audio, useCurrentFrame, interpolate } from 'remotion';

export const EducationalScene: React.FC<{
  title: string;
  explanation: string;
  image: string;
  audio: string;
  duration: number;
}> = ({ title, explanation, image, audio }) => {
  const frame = useCurrentFrame();

  // Fade in/out
  const opacity = interpolate(
    frame,
    [0, 15, 30],  // First 15 frames fade in, stable at 30
    [0, 1, 1]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1e293b' }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 80,
        right: 80,
        color: 'white',
        fontSize: 56,
        fontWeight: 'bold',
        opacity
      }}>
        {title}
      </div>

      {/* Visual Content */}
      <div style={{
        position: 'absolute',
        top: 180,
        left: 80,
        width: 800,
        height: 600,
        opacity
      }}>
        <Img src={image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* Explanation */}
      <div style={{
        position: 'absolute',
        right: 80,
        top: 180,
        width: 900,
        height: 600,
        color: 'white',
        fontSize: 28,
        lineHeight: 1.8,
        opacity
      }}>
        {explanation}
      </div>

      {/* Narration Audio */}
      <Audio src={audio} />
    </AbsoluteFill>
  );
};
```

### Integration with SCORM

```typescript
// Enhanced SCORM exporter with video
export class SCORMExporter {
  constructor(private videoGenerator: EducationalVideoGenerator) {}

  async exportWithVideos(course: Course): Promise<Buffer> {
    const zip = new JSZip();

    // 1. Generate videos for each module
    for (const module of course.modules) {
      console.log(`Generating video for module: ${module.title}`);

      const videoResult = await this.videoGenerator.generateModuleVideo(
        module,
        module.videoScript
      );

      // 2. Add video to package
      const videoBuffer = await fs.readFile(videoResult.videoPath);
      zip.file(`videos/module-${module.id}.mp4`, videoBuffer);

      // 3. Create SCO HTML with video + SCORM tracking
      const scoHtml = this.createVideoSCO(module, videoResult);
      zip.file(`module_${module.id}/index.html`, scoHtml);
    }

    // 4. SCORM manifest
    zip.file('imsmanifest.xml', this.generateManifest(course));
    zip.file('scorm_api.js', this.getSCORMAPI());

    return zip.generateAsync({ type: 'nodebuffer' });
  }

  private createVideoSCO(module: Module, videoResult: VideoResult): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>${module.title}</title>
  <script src="../scorm_api.js"></script>
  <script>
    let API = null;

    function findAPI(win) {
      while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        win = win.parent;
      }
      return win.API;
    }

    function initSCORM() {
      API = findAPI(window);
      if (API) {
        API.LMSInitialize("");
        API.LMSSetValue("cmi.core.lesson_status", "incomplete");
      }
    }

    function trackVideoProgress() {
      const video = document.getElementById('moduleVideo');
      const progress = (video.currentTime / video.duration) * 100;

      if (API) {
        API.LMSSetValue("cmi.core.score.raw", progress.toFixed(0));

        // Mark complete at 80% watched
        if (progress >= 80) {
          API.LMSSetValue("cmi.core.lesson_status", "completed");
          API.LMSCommit("");
        }
      }
    }

    window.onload = initSCORM;
  </script>
  <style>
    body {
      font-family: -apple-system, system-ui, sans-serif;
      margin: 0;
      padding: 20px;
      background: #0f172a;
      color: white;
    }
    h1 { margin-bottom: 20px; }
    video { width: 100%; max-width: 1280px; }
    .transcript {
      margin-top: 30px;
      padding: 20px;
      background: #1e293b;
      border-radius: 8px;
      max-width: 1280px;
    }
  </style>
</head>
<body>
  <h1>${module.title}</h1>

  <video id="moduleVideo" controls ontimeupdate="trackVideoProgress()">
    <source src="../videos/module-${module.id}.mp4" type="video/mp4">
  </video>

  <div class="transcript">
    <h3>Video Transcript</h3>
    <p>${module.videoScript.segments.map(s => s.narration).join(' ')}</p>
  </div>
</body>
</html>`;
  }
}
```

### API Routes

```typescript
// Add to src/routes/education.ts

/**
 * POST /api/education/module-video
 * Generate video for a course module
 */
router.post('/module-video', async (req, res) => {
  try {
    const { moduleId } = req.body;

    // Load module data
    const module = await loadModule(moduleId);

    // Generate video
    const videoResult = await videoGenerator.generateModuleVideo(
      module,
      module.videoScript
    );

    res.json({
      success: true,
      videoPath: videoResult.videoPath,
      duration: videoResult.duration,
      scenes: videoResult.scenes,
      cost: videoResult.cost
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Testing

```bash
# 1. Generate course with video scripts
curl -X POST http://localhost:3001/api/education/course \
  -d '{"topic": "React Hooks", "duration": 10}'

# 2. Generate video for module
curl -X POST http://localhost:3001/api/education/module-video \
  -d '{"moduleId": "react-hooks-101"}'

# 3. Export SCORM with videos
curl -X GET http://localhost:3001/api/education/scorm/course_123?includeVideos=true \
  --output course-with-videos.zip

# 4. Upload to LMS and test tracking
```

### Implementation Notes

1. **Reuse, Don't Rebuild:** Copy patterns from `video-director.ts` for image generation and TTS
2. **Shared Dependencies:** Already installed in main repo - no new npm packages needed
3. **Cost Efficiency:** ~$0.50 per module vs building from scratch
4. **Time Savings:** 4 hours integration vs 8+ hours building new system
5. **Proven Quality:** Uses battle-tested image prompts and TTS settings

### Documentation References

See main repo for detailed docs:
- `VIDEO-PIPELINE-COMPLETE.md` - Complete pipeline overview
- `VIDEO-DIRECTOR-AGENT.md` - API reference
- `REMOTION-INTEGRATION.md` - Remotion patterns
- `packages/backend/src/routes/video-director.ts` - Implementation reference

---

## 🧪 Testing Strategy

### Unit Tests:
```typescript
describe('CourseGenerator', () => {
  it('should generate complete course', async () => {
    const course = await courseGenerator.generateCourse(
      'React Fundamentals',
      'Beginners',
      10
    );

    expect(course.modules).toHaveLength(5);
    expect(course.modules[0]).toHaveProperty('content');
    expect(course.modules[0]).toHaveProperty('quiz');
  });

  it('should generate video scripts', async () => {
    const scripts = await courseGenerator.generateVideoScripts(moduleSpec);
    expect(scripts.length).toBeGreaterThan(0);
    expect(scripts[0]).toHaveProperty('narration');
  });
});

describe('QuizGenerator', () => {
  it('should generate valid quiz', async () => {
    const quiz = await quizGenerator.generateQuiz(content, 'medium', 10);

    expect(quiz.questions).toHaveLength(10);
    quiz.questions.forEach(q => {
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(4);
    });
  });
});

describe('SCORMExporter', () => {
  it('should export valid SCORM 1.2 package', async () => {
    const scorm = await scormExporter.exportToSCORM(course, '1.2');

    expect(scorm).toBeInstanceOf(Buffer);

    // Verify ZIP contains required files
    const zip = await JSZip.loadAsync(scorm);
    expect(zip.file('imsmanifest.xml')).toBeDefined();
    expect(zip.file('scorm_api.js')).toBeDefined();
  });
});
```

### Integration Tests:
```bash
# Test course generation end-to-end
curl -X POST http://localhost:3001/api/education/course \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Python for Data Science",
    "targetAudience": "Intermediate programmers",
    "duration": 20
  }'

# Test SCORM export
curl http://localhost:3001/api/education/scorm/course_123?version=2004 \
  --output course.zip

# Verify SCORM package in SCORM Cloud or similar LMS
```

---

## 📦 Dependencies

Add to `package.json`:
```json
{
  "dependencies": {
    "ts-morph": "^21.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "jszip": "^3.10.1",
    "marked": "^11.0.0"
  }
}
```

---

## 🔄 Integration with Master

### Files to Merge:
```
packages/backend/src/agents/education/          (NEW directory)
packages/backend/src/agents/user-journey/       (MODIFIED)
packages/backend/src/routes/education.ts        (NEW)
packages/backend/src/templates/education/       (NEW directory)
packages/backend/src/index.ts                   (MODIFIED - add education route)
packages/backend/package.json                   (MODIFIED - new deps)
```

### No Conflicts Expected
This worktree is completely independent - no shared files with other features.

### Merge Command:
```bash
git checkout master
git merge feature/educational-content
npm install  # Install new dependencies
git push origin master
```

---

## 📊 Success Metrics

### Functional:
- ✅ Generate user manual from any GitHub repo
- ✅ Create complete course (5-10 modules) from topic
- ✅ Generate interactive quizzes with explanations
- ✅ Export valid SCORM 1.2 and 2004 packages
- ✅ Certificates auto-generated

### Quality:
- ✅ Courses have clear learning objectives
- ✅ Content is educational and engaging
- ✅ Quizzes test understanding (not just recall)
- ✅ SCORM packages work in major LMS platforms

---

## 🚀 Getting Started

### Quick Start:
```bash
cd /home/dachu/Documents/projects/worktrees/educational-content

# Install dependencies
cd packages/backend
npm install ts-morph @typescript-eslint/parser jszip marked

# Run tests
npm test

# Start development
npm run dev

# Test the API
curl -X POST http://localhost:3001/api/education/course \
  -d '{"topic": "Test Course", "targetAudience": "Beginners", "duration": 5}'
```

---

## 📝 Development Workflow

1. **Start with Enhanced Manual Generator**
   - Enhance existing user-journey agent
   - Test with real GitHub repos
   - Verify API documentation extraction

2. **Build Course Generator**
   - Implement curriculum generation
   - Test with various topics
   - Verify module quality

3. **Add Quiz Generator**
   - Generate test questions
   - Create interactive HTML quizzes
   - Validate question quality

4. **Implement SCORM Exporter**
   - Build SCORM 1.2 support
   - Add SCORM 2004 support
   - Test in LMS platforms

5. **API Routes & Integration**
   - Create REST endpoints
   - Add error handling
   - Write integration tests

---

**This worktree is ready for you to work on separately!**

All planning complete - you can start implementation anytime.
