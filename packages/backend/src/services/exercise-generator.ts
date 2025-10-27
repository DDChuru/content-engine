/**
 * Exercise Generator Service
 *
 * Generates practice questions with automatic grading and hints.
 * Creates interactive HTML quizzes with SCORM tracking.
 *
 * Layer 3 of the 3-layer content generation system.
 */

import { ClaudeService } from './claude.js';
import * as path from 'path';
import { promises as fs } from 'fs';

// ============================================================================
// Interfaces
// ============================================================================

export interface ExerciseQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false';
  difficulty: 'easy' | 'medium' | 'hard';

  // Multiple choice options
  options?: string[];

  // Correct answer
  correctAnswer: string;

  // Feedback
  explanation: string;
  hint: string;
  commonMistakes?: string[];

  // Metadata
  subtopic?: string;
  points?: number;
}

export interface ExerciseQuiz {
  questions: ExerciseQuestion[];
  quizHtmlPath: string;
  totalPoints: number;
  passingScore: number;
}

export interface ExercisesGenerationResult {
  success: boolean;
  questions: ExerciseQuestion[];
  quizHtmlPath: string;
  totalCost: number;
  error?: string;
}

export interface ExercisesGenerationOptions {
  topicTitle: string;
  topicCode: string;
  level: 'Core' | 'Extended';
  concepts: string[];
  targetCount?: number;  // Number of questions (default: 10)
  outputDir: string;
}

// ============================================================================
// Exercise Generator Service
// ============================================================================

export class ExerciseGenerator {
  private claudeService: ClaudeService;

  constructor(claudeService: ClaudeService) {
    this.claudeService = claudeService;
  }

  /**
   * Generate exercise questions for a topic
   */
  async generateExercises(options: ExercisesGenerationOptions): Promise<ExercisesGenerationResult> {
    console.log(`\n[ExerciseGenerator] Generating exercises for: ${options.topicTitle}`);
    console.log(`  Target count: ${options.targetCount || 10}`);
    console.log(`  Level: ${options.level}`);

    try {
      // Step 1: Generate questions using Claude
      const questions = await this.generateQuestions(options);

      console.log(`  ✓ Generated ${questions.length} questions`);
      console.log(`    - Easy: ${questions.filter(q => q.difficulty === 'easy').length}`);
      console.log(`    - Medium: ${questions.filter(q => q.difficulty === 'medium').length}`);
      console.log(`    - Hard: ${questions.filter(q => q.difficulty === 'hard').length}`);

      // Step 2: Create interactive HTML quiz
      const quizHtmlPath = await this.createQuizHTML(questions, options);

      console.log(`  ✓ Quiz HTML created: ${quizHtmlPath}`);

      // Step 3: Save questions as JSON
      const questionsJsonPath = path.join(options.outputDir, 'exercises', 'questions.json');
      await fs.writeFile(questionsJsonPath, JSON.stringify(questions, null, 2));

      console.log(`  ✓ Questions saved: ${questionsJsonPath}`);

      // Cost is minimal (Claude API already paid for, no additional rendering)
      const totalCost = 0;

      return {
        success: true,
        questions,
        quizHtmlPath,
        totalCost
      };

    } catch (error: any) {
      console.error('[ExerciseGenerator] Error:', error);
      return {
        success: false,
        questions: [],
        quizHtmlPath: '',
        totalCost: 0,
        error: error.message
      };
    }
  }

  /**
   * Generate questions using Claude
   */
  private async generateQuestions(options: ExercisesGenerationOptions): Promise<ExerciseQuestion[]> {
    const targetCount = options.targetCount || 10;

    // For Sets topic, use pre-built questions (high quality, tested)
    if (options.topicTitle.toLowerCase().includes('set')) {
      return this.generateSetsQuestions();
    }

    // For other topics, use Claude
    return this.generateGenericQuestions(options, targetCount);
  }

  /**
   * Generate questions for Sets topic (pre-built, high quality)
   */
  private generateSetsQuestions(): ExerciseQuestion[] {
    return [
      {
        id: 'q1',
        question: 'Find A ∪ B where A = {2, 4, 6} and B = {4, 6, 8}',
        type: 'multiple-choice',
        difficulty: 'easy',
        options: [
          '{2, 4, 6, 8}',
          '{4, 6}',
          '{2, 8}',
          '{2, 4, 6, 8, 10}'
        ],
        correctAnswer: '{2, 4, 6, 8}',
        explanation: 'The union A ∪ B includes all elements from both sets. From A we get 2, 4, 6. From B we get 4, 6, 8. Removing duplicates (4 and 6 appear in both), we get {2, 4, 6, 8}.',
        hint: 'Union means ALL elements from either set A OR set B.',
        commonMistakes: [
          'Forgetting to remove duplicates',
          'Confusing union with intersection'
        ],
        subtopic: 'Union operation',
        points: 1
      },
      {
        id: 'q2',
        question: 'Find A ∩ B where A = {1, 3, 5, 7} and B = {3, 6, 9}',
        type: 'short-answer',
        difficulty: 'easy',
        correctAnswer: '{3}',
        explanation: 'The intersection A ∩ B contains only elements that appear in BOTH sets. Looking at both sets, only 3 appears in both A and B.',
        hint: 'Intersection means elements that are in BOTH set A AND set B.',
        commonMistakes: [
          'Including elements from only one set',
          'Confusing intersection with union'
        ],
        subtopic: 'Intersection operation',
        points: 1
      },
      {
        id: 'q3',
        question: "If ξ = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10} and A = {2, 4, 6, 8, 10}, find A'",
        type: 'short-answer',
        difficulty: 'easy',
        correctAnswer: '{1, 3, 5, 7, 9}',
        explanation: "The complement A' contains all elements in the universal set ξ that are NOT in A. Since A contains all even numbers from 1-10, A' contains all odd numbers: {1, 3, 5, 7, 9}.",
        hint: "The complement A' means all elements in ξ that are NOT in A.",
        commonMistakes: [
          'Including elements that are in A',
          'Forgetting some elements from the universal set'
        ],
        subtopic: 'Complement operation',
        points: 1
      },
      {
        id: 'q4',
        question: 'If n(A) = 5, n(B) = 7, and n(A ∩ B) = 2, find n(A ∪ B)',
        type: 'multiple-choice',
        difficulty: 'medium',
        options: [
          '10',
          '12',
          '14',
          '9'
        ],
        correctAnswer: '10',
        explanation: 'Use the formula: n(A ∪ B) = n(A) + n(B) - n(A ∩ B). Substituting: n(A ∪ B) = 5 + 7 - 2 = 10.',
        hint: 'Use the formula for the number of elements in a union.',
        commonMistakes: [
          'Adding n(A) + n(B) without subtracting n(A ∩ B)',
          'Subtracting n(A ∩ B) twice'
        ],
        subtopic: 'Cardinality',
        points: 2
      },
      {
        id: 'q5',
        question: 'True or False: If A ⊂ B, then A ∩ B = A',
        type: 'true-false',
        difficulty: 'medium',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'If A is a proper subset of B, then all elements of A are also in B. Therefore, the intersection of A and B will contain exactly the elements of A, so A ∩ B = A.',
        hint: 'Think about what happens when one set is completely inside another.',
        commonMistakes: [
          'Confusing subset with superset',
          'Not understanding the relationship between subsets and intersection'
        ],
        subtopic: 'Subsets',
        points: 1
      },
      {
        id: 'q6',
        question: 'If A = {x : x is a prime number less than 10}, list the elements of A',
        type: 'short-answer',
        difficulty: 'easy',
        correctAnswer: '{2, 3, 5, 7}',
        explanation: 'Prime numbers less than 10 are: 2 (the only even prime), 3, 5, and 7. Note that 1 is not considered prime.',
        hint: 'Remember: prime numbers are only divisible by 1 and themselves. Is 1 prime?',
        commonMistakes: [
          'Including 1 (which is not prime)',
          'Forgetting 2 (the only even prime number)',
          'Including 9 (which is 3 × 3)'
        ],
        subtopic: 'Set-builder notation',
        points: 1
      },
      {
        id: 'q7',
        question: 'Given ξ = {1-10}, A = {1, 2, 3, 4}, B = {3, 4, 5, 6}, find (A ∪ B)\'',
        type: 'short-answer',
        difficulty: 'hard',
        correctAnswer: '{7, 8, 9, 10}',
        explanation: 'First find A ∪ B = {1, 2, 3, 4, 5, 6}. Then find the complement: all elements in ξ NOT in A ∪ B, which is {7, 8, 9, 10}.',
        hint: 'Work in steps: first find A ∪ B, then find the complement of that result.',
        commonMistakes: [
          'Finding (A\' ∪ B\') instead of (A ∪ B)\'',
          'Forgetting to find the union first'
        ],
        subtopic: 'Combined operations',
        points: 2
      },
      {
        id: 'q8',
        question: 'If A ∩ B = ∅, what can we say about sets A and B?',
        type: 'multiple-choice',
        difficulty: 'medium',
        options: [
          'They are disjoint (have no common elements)',
          'They are equal',
          'One is a subset of the other',
          'They are both empty sets'
        ],
        correctAnswer: 'They are disjoint (have no common elements)',
        explanation: 'When A ∩ B = ∅ (the empty set), it means there are no elements in common between A and B. Sets with no common elements are called disjoint sets.',
        hint: 'What does ∅ (the empty set) mean in terms of intersection?',
        commonMistakes: [
          'Thinking both sets must be empty',
          'Confusing empty intersection with empty sets'
        ],
        subtopic: 'Empty set and disjoint sets',
        points: 1
      },
      {
        id: 'q9',
        question: 'In a class of 30 students, 18 study French, 15 study Spanish, and 8 study both. How many students study neither French nor Spanish?',
        type: 'short-answer',
        difficulty: 'hard',
        correctAnswer: '5',
        explanation: 'Use n(F ∪ S) = n(F) + n(S) - n(F ∩ S) = 18 + 15 - 8 = 25 students study at least one language. Therefore, 30 - 25 = 5 students study neither.',
        hint: 'First find how many study at least one language using the union formula, then subtract from the total.',
        commonMistakes: [
          'Forgetting to subtract those who study both',
          'Not subtracting the union from the total'
        ],
        subtopic: 'Venn diagram applications',
        points: 3
      },
      {
        id: 'q10',
        question: 'Which notation represents "x is an element of set A"?',
        type: 'multiple-choice',
        difficulty: 'easy',
        options: [
          'x ∈ A',
          'x ⊂ A',
          'x ∪ A',
          'x ∩ A'
        ],
        correctAnswer: 'x ∈ A',
        explanation: 'The symbol ∈ means "is an element of" or "belongs to". So x ∈ A means "x is an element of set A".',
        hint: 'Think about the basic symbol for membership in a set.',
        commonMistakes: [
          'Confusing ∈ with ⊂ (subset)',
          'Using operation symbols instead of membership'
        ],
        subtopic: 'Set notation',
        points: 1
      }
    ];
  }

  /**
   * Generate generic questions using Claude
   */
  private async generateGenericQuestions(
    options: ExercisesGenerationOptions,
    count: number
  ): Promise<ExerciseQuestion[]> {
    const prompt = `Generate ${count} practice questions for the topic: ${options.topicTitle} (${options.topicCode})

Level: ${options.level}
Target age: 14-16 years (Cambridge IGCSE)
Concepts covered: ${options.concepts.join(', ')}

Create a mix of:
- ${Math.ceil(count * 0.4)} easy questions
- ${Math.ceil(count * 0.4)} medium questions
- ${Math.floor(count * 0.2)} hard questions

For each question, provide:
1. Question text
2. Type: "multiple-choice", "short-answer", or "true-false"
3. Difficulty level
4. Options (for multiple choice, 4 options)
5. Correct answer
6. Detailed explanation
7. Hint to help students
8. Common mistakes students make
9. Points (1-3 based on difficulty)

Format as JSON array:
[
  {
    "id": "q1",
    "question": "...",
    "type": "multiple-choice",
    "difficulty": "easy",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "...",
    "hint": "...",
    "commonMistakes": ["...", "..."],
    "points": 1
  }
]`;

    const response = await this.claudeService.sendMessage([
      { role: 'user', content: prompt }
    ]);

    const content = response.content[0]?.text || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Failed to parse questions from Claude');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Create interactive HTML quiz
   */
  private async createQuizHTML(
    questions: ExerciseQuestion[],
    options: ExercisesGenerationOptions
  ): Promise<string> {
    const outputDir = path.join(options.outputDir, 'exercises');
    await fs.mkdir(outputDir, { recursive: true });

    const quizHtmlPath = path.join(outputDir, 'quiz.html');
    const htmlContent = this.generateQuizHTML(questions, options);

    await fs.writeFile(quizHtmlPath, htmlContent);

    return quizHtmlPath;
  }

  /**
   * Generate HTML quiz with SCORM tracking
   */
  private generateQuizHTML(questions: ExerciseQuestion[], options: ExercisesGenerationOptions): string {
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const passingScore = Math.ceil(totalPoints * 0.7); // 70% to pass

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.topicTitle} - Practice Quiz</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      background: white;
      padding: 30px;
      border-radius: 15px 15px 0 0;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .header h1 {
      color: #667eea;
      font-size: 32px;
      margin-bottom: 10px;
    }

    .header .meta {
      color: #666;
      font-size: 14px;
    }

    .header .meta span {
      margin-right: 20px;
    }

    .progress-bar {
      background: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #eee;
    }

    .progress {
      flex: 1;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      margin: 0 20px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      width: 0%;
      transition: width 0.3s ease;
    }

    .quiz-container {
      background: white;
      padding: 0;
      border-radius: 0 0 15px 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      min-height: 400px;
    }

    .question {
      padding: 40px;
      border-bottom: 1px solid #eee;
      display: none;
    }

    .question.active {
      display: block;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .question-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }

    .difficulty-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .difficulty-easy {
      background: #d4edda;
      color: #155724;
    }

    .difficulty-medium {
      background: #fff3cd;
      color: #856404;
    }

    .difficulty-hard {
      background: #f8d7da;
      color: #721c24;
    }

    .question-text {
      font-size: 20px;
      color: #333;
      margin: 20px 0;
      line-height: 1.6;
    }

    .options {
      margin: 30px 0;
    }

    .option {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 18px 20px;
      margin: 12px 0;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
    }

    .option:hover {
      background: #e9ecef;
      border-color: #667eea;
      transform: translateX(5px);
    }

    .option input[type="radio"],
    .option input[type="checkbox"] {
      margin-right: 15px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .option.selected {
      background: #e7f0ff;
      border-color: #667eea;
    }

    .option.correct {
      background: #d4edda;
      border-color: #28a745;
    }

    .option.incorrect {
      background: #f8d7da;
      border-color: #dc3545;
    }

    .short-answer-input {
      width: 100%;
      padding: 15px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      font-size: 16px;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .short-answer-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .feedback {
      margin-top: 20px;
      padding: 20px;
      border-radius: 12px;
      display: none;
    }

    .feedback.show {
      display: block;
    }

    .feedback.correct {
      background: #d4edda;
      border-left: 4px solid #28a745;
    }

    .feedback.incorrect {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
    }

    .feedback-title {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 10px;
    }

    .feedback.correct .feedback-title {
      color: #155724;
    }

    .feedback.incorrect .feedback-title {
      color: #721c24;
    }

    .feedback-text {
      margin: 8px 0;
      line-height: 1.6;
    }

    .hint {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 15px 0;
      border-radius: 8px;
      display: none;
    }

    .hint.show {
      display: block;
    }

    .buttons {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .btn {
      padding: 14px 30px;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 2px solid #e9ecef;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .results {
      text-align: center;
      padding: 60px 40px;
      display: none;
    }

    .results.show {
      display: block;
    }

    .results h2 {
      font-size: 36px;
      color: #667eea;
      margin-bottom: 20px;
    }

    .score-circle {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 30px auto;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .score-circle .score {
      color: white;
      font-size: 48px;
      font-weight: 700;
    }

    .results .message {
      font-size: 20px;
      color: #666;
      margin: 20px 0;
    }

    .review-list {
      text-align: left;
      margin-top: 40px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .review-item {
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .review-item.correct {
      background: #d4edda;
    }

    .review-item.incorrect {
      background: #f8d7da;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${options.topicTitle}</h1>
      <div class="meta">
        <span><strong>Code:</strong> ${options.topicCode}</span>
        <span><strong>Level:</strong> ${options.level}</span>
        <span><strong>Questions:</strong> ${questions.length}</span>
        <span><strong>Total Points:</strong> ${totalPoints}</span>
        <span><strong>Pass:</strong> ${passingScore}/${totalPoints}</span>
      </div>
    </div>

    <div class="progress-bar">
      <span id="progressText">Question 1 of ${questions.length}</span>
      <div class="progress">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <span id="scoreText">Score: 0/${totalPoints}</span>
    </div>

    <div class="quiz-container" id="quizContainer">
      ${questions.map((q, index) => this.generateQuestionHTML(q, index)).join('')}

      <div class="results" id="results">
        <h2>Quiz Complete!</h2>
        <div class="score-circle">
          <div class="score" id="finalScore">0/${totalPoints}</div>
        </div>
        <p class="message" id="resultMessage"></p>
        <div class="review-list" id="reviewList"></div>
        <div class="buttons">
          <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const questions = ${JSON.stringify(questions)};
    let currentQuestion = 0;
    let score = 0;
    let answers = [];

    function showQuestion(index) {
      document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
      document.querySelector(\`.question[data-index="\${index}"]\`).classList.add('active');

      currentQuestion = index;
      updateProgress();
    }

    function updateProgress() {
      const progress = ((currentQuestion + 1) / questions.length) * 100;
      document.getElementById('progressFill').style.width = progress + '%';
      document.getElementById('progressText').textContent = \`Question \${currentQuestion + 1} of \${questions.length}\`;
      document.getElementById('scoreText').textContent = \`Score: \${score}/${totalPoints}\`;
    }

    function selectOption(questionIndex, optionIndex) {
      const question = questions[questionIndex];
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        document.querySelectorAll(\`.question[data-index="\${questionIndex}"] .option\`).forEach(opt => {
          opt.classList.remove('selected');
        });
        document.querySelector(\`.question[data-index="\${questionIndex}"] .option[data-option="\${optionIndex}"]\`).classList.add('selected');
      }
    }

    function showHint(questionIndex) {
      document.querySelector(\`.question[data-index="\${questionIndex}"] .hint\`).classList.add('show');
    }

    // Normalize set notation for flexible answer checking
    function normalizeSetAnswer(answer) {
      // Convert to lowercase and trim
      let normalized = answer.toLowerCase().trim();

      // Remove all spaces
      normalized = normalized.replace(/\\s+/g, '');

      // Handle common typos: dots instead of commas
      normalized = normalized.replace(/\\./g, ',');

      // Remove outer braces if present
      normalized = normalized.replace(/^\\{/, '').replace(/\\}$/, '');

      // Split by comma, trim each element, sort, and rejoin
      const elements = normalized.split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0)
        .sort((a, b) => {
          // Try to sort numerically if possible
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          return a.localeCompare(b);
        });

      return elements.join(',');
    }

    function checkAnswer(questionIndex) {
      const question = questions[questionIndex];
      let userAnswer = '';
      let correct = false;

      if (question.type === 'short-answer') {
        userAnswer = document.getElementById(\`answer\${questionIndex}\`).value.trim();

        // Use smart normalization for set answers
        const normalizedUser = normalizeSetAnswer(userAnswer);
        const normalizedCorrect = normalizeSetAnswer(question.correctAnswer);
        correct = normalizedUser === normalizedCorrect;
      } else {
        const selected = document.querySelector(\`.question[data-index="\${questionIndex}"] .option.selected\`);
        if (!selected) {
          alert('Please select an answer');
          return;
        }
        userAnswer = selected.dataset.answer;
        correct = userAnswer === question.correctAnswer;
      }

      answers[questionIndex] = { userAnswer, correct, question: question.question };

      if (correct) {
        score += (question.points || 1);
      }

      const feedback = document.querySelector(\`.question[data-index="\${questionIndex}"] .feedback\`);
      feedback.className = \`feedback show \${correct ? 'correct' : 'incorrect'}\`;
      feedback.innerHTML = \`
        <div class="feedback-title">\${correct ? '✓ Correct!' : '✗ Incorrect'}</div>
        <div class="feedback-text"><strong>Explanation:</strong> \${question.explanation}</div>
        \${!correct ? \`<div class="feedback-text"><strong>Correct answer:</strong> \${question.correctAnswer}</div>\` : ''}
      \`;

      updateProgress();

      document.querySelector(\`.question[data-index="\${questionIndex}"] .btn-check\`).style.display = 'none';
      document.querySelector(\`.question[data-index="\${questionIndex}"] .btn-next\`).style.display = 'inline-block';
    }

    function nextQuestion() {
      if (currentQuestion < questions.length - 1) {
        showQuestion(currentQuestion + 1);
      } else {
        showResults();
      }
    }

    function showResults() {
      document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
      const resultsDiv = document.getElementById('results');
      resultsDiv.classList.add('show');

      const percentage = Math.round((score / ${totalPoints}) * 100);
      const passed = score >= ${passingScore};

      document.getElementById('finalScore').textContent = \`\${score}/${totalPoints}\`;
      document.getElementById('resultMessage').textContent = passed
        ? \`Excellent! You passed with \${percentage}%\`
        : \`You scored \${percentage}%. Keep practicing!\`;

      const reviewList = document.getElementById('reviewList');
      reviewList.innerHTML = '<h3>Review:</h3>' + answers.map((ans, i) => \`
        <div class="review-item \${ans.correct ? 'correct' : 'incorrect'}">
          <span>Q\${i + 1}: \${ans.question.substring(0, 50)}...</span>
          <span>\${ans.correct ? '✓' : '✗'}</span>
        </div>
      \`).join('');

      // TODO: Send score to SCORM API
      console.log('Final score:', { score, total: ${totalPoints}, percentage, passed });
    }

    const totalPoints = ${totalPoints};
    showQuestion(0);
  </script>
</body>
</html>`;
  }

  /**
   * Generate HTML for a single question
   */
  private generateQuestionHTML(question: ExerciseQuestion, index: number): string {
    const difficultyClass = `difficulty-${question.difficulty}`;

    let optionsHTML = '';

    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      optionsHTML = `
        <div class="options">
          ${question.options!.map((opt, i) => `
            <div class="option" data-option="${i}" data-answer="${opt}" onclick="selectOption(${index}, ${i})">
              <input type="radio" name="q${index}" value="${opt}">
              <label>${opt}</label>
            </div>
          `).join('')}
        </div>
      `;
    } else if (question.type === 'short-answer') {
      optionsHTML = `
        <input type="text" id="answer${index}" class="short-answer-input" placeholder="Enter your answer here...">
      `;
    }

    return `
      <div class="question" data-index="${index}">
        <div class="question-header">
          <span class="question-number">Question ${index + 1}</span>
          <span class="difficulty-badge ${difficultyClass}">${question.difficulty}</span>
        </div>

        <div class="question-text">${question.question}</div>

        ${optionsHTML}

        <div class="hint">
          <strong>💡 Hint:</strong> ${question.hint}
        </div>

        <div class="feedback"></div>

        <div class="buttons">
          <button class="btn btn-secondary" onclick="showHint(${index})">Show Hint</button>
          <button class="btn btn-primary btn-check" onclick="checkAnswer(${index})">Check Answer</button>
          <button class="btn btn-primary btn-next" onclick="nextQuestion()" style="display: none;">
            ${index < (question as any).__total - 1 ? 'Next Question' : 'See Results'} →
          </button>
        </div>
      </div>
    `;
  }
}
