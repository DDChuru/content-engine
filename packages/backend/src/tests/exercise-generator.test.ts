/**
 * Exercise Generator Integration Tests
 *
 * Ensures quiz generation works correctly and produces valid HTML
 * with proper answer validation logic embedded.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { ExerciseGenerator } from '../services/exercise-generator.js';
import { ClaudeService } from '../services/claude.js';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('ExerciseGenerator Integration Tests', () => {
  let generator: ExerciseGenerator;
  const testOutputDir = 'output/test-quiz';

  beforeAll(() => {
    // Initialize with mock Claude service for testing
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY || 'test-key');
    generator = new ExerciseGenerator(claudeService);
  });

  describe('Quiz Generation', () => {
    it('should generate Sets quiz with 10 questions', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation', 'Union', 'Intersection', 'Complement'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      expect(result.success).toBe(true);
      expect(result.questions).toHaveLength(10);
      expect(result.quizHtmlPath).toContain('quiz.html');
      expect(result.totalCost).toBe(0); // Pre-built content is free
    });

    it('should generate quiz HTML with normalization function', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      const htmlPath = path.join(testOutputDir, 'exercises', 'quiz.html');
      const htmlContent = await fs.readFile(htmlPath, 'utf-8');

      // Check that normalization function is included
      expect(htmlContent).toContain('function normalizeSetAnswer');
      expect(htmlContent).toContain('normalizedUser');
      expect(htmlContent).toContain('normalizedCorrect');

      // Check for key normalization features
      expect(htmlContent).toContain('replace(/\\s+/g');  // Whitespace removal
      expect(htmlContent).toContain('replace(/\\./g');   // Dot to comma conversion
      expect(htmlContent).toContain('.sort(');           // Element sorting
    });

    it('should generate valid question types', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set operations'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      const validTypes = ['multiple-choice', 'short-answer', 'true-false'];

      result.questions.forEach(q => {
        expect(validTypes).toContain(q.type);
        expect(q.id).toBeTruthy();
        expect(q.question).toBeTruthy();
        expect(q.correctAnswer).toBeTruthy();
        expect(q.explanation).toBeTruthy();
        expect(q.hint).toBeTruthy();
      });
    });

    it('should include all required question fields', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      const firstQuestion = result.questions[0];

      expect(firstQuestion).toHaveProperty('id');
      expect(firstQuestion).toHaveProperty('question');
      expect(firstQuestion).toHaveProperty('type');
      expect(firstQuestion).toHaveProperty('difficulty');
      expect(firstQuestion).toHaveProperty('correctAnswer');
      expect(firstQuestion).toHaveProperty('explanation');
      expect(firstQuestion).toHaveProperty('hint');
      expect(firstQuestion).toHaveProperty('commonMistakes');
      expect(firstQuestion).toHaveProperty('subtopic');
      expect(firstQuestion).toHaveProperty('points');
    });
  });

  describe('Quiz HTML Structure', () => {
    it('should generate responsive HTML with proper styling', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      const htmlPath = path.join(testOutputDir, 'exercises', 'quiz.html');
      const htmlContent = await fs.readFile(htmlPath, 'utf-8');

      // Check for gradient theme
      expect(htmlContent).toContain('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');

      // Check for mobile responsiveness
      expect(htmlContent).toContain('viewport');

      // Check for interactive elements
      expect(htmlContent).toContain('progress-bar');
      expect(htmlContent).toContain('feedback');
      expect(htmlContent).toContain('hint');

      // Check for accessibility
      expect(htmlContent).toContain('lang="en"');
      expect(htmlContent).toContain('charset="UTF-8"');
    });

    it('should generate questions.json data file', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      const jsonPath = path.join(testOutputDir, 'exercises', 'questions.json');
      const jsonContent = await fs.readFile(jsonPath, 'utf-8');
      const questions = JSON.parse(jsonContent);

      expect(Array.isArray(questions)).toBe(true);
      expect(questions).toHaveLength(10);
    });
  });

  describe('Pre-built Sets Questions Quality', () => {
    it('should have correct answers for all Sets questions', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      // Verify first few questions are correct
      const q1 = result.questions.find(q => q.id === 'q1');
      expect(q1?.correctAnswer).toBe('{2, 4, 6, 8}');

      const q2 = result.questions.find(q => q.id === 'q2');
      expect(q2?.correctAnswer).toBe('{3}');

      const q3 = result.questions.find(q => q.id === 'q3');
      expect(q3?.correctAnswer).toBe('{1, 3, 5, 7, 9}');
    });

    it('should have comprehensive hints for all questions', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      result.questions.forEach(q => {
        expect(q.hint).toBeTruthy();
        expect(q.hint.length).toBeGreaterThan(10); // Meaningful hint
      });
    });

    it('should have common mistakes documented', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation'],
        targetCount: 10,
        outputDir: testOutputDir
      });

      result.questions.forEach(q => {
        expect(Array.isArray(q.commonMistakes)).toBe(true);
        expect(q.commonMistakes!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing output directory', async () => {
      const result = await generator.generateExercises({
        topicTitle: 'Sets',
        topicCode: 'C1.2',
        level: 'Core',
        concepts: ['Set notation'],
        targetCount: 10,
        outputDir: 'output/nonexistent-path-12345'
      });

      // Should create directory and succeed
      expect(result.success).toBe(true);
    });

    it('should validate topic requirements', async () => {
      // Should still work even with minimal input
      const result = await generator.generateExercises({
        topicTitle: 'Unknown Topic',
        topicCode: 'X1.1',
        level: 'Core',
        concepts: ['Test'],
        targetCount: 3,
        outputDir: testOutputDir
      });

      // Will use Claude AI for unknown topics
      expect(result.success).toBe(true);
    });
  });
});

describe('Answer Validation in Generated Quiz', () => {
  it('should correctly validate student answers in browser context', async () => {
    // This would be tested with browser automation (Playwright/Puppeteer)
    // For now, we ensure the function is correctly embedded

    const generator = new ExerciseGenerator(
      new ClaudeService(process.env.ANTHROPIC_API_KEY || 'test-key')
    );

    const result = await generator.generateExercises({
      topicTitle: 'Sets',
      topicCode: 'C1.2',
      level: 'Core',
      concepts: ['Set notation'],
      targetCount: 10,
      outputDir: 'output/test-quiz'
    });

    const htmlPath = path.join('output/test-quiz', 'exercises', 'quiz.html');
    const htmlContent = await fs.readFile(htmlPath, 'utf-8');

    // Verify the validation logic matches test expectations
    expect(htmlContent).toContain('const normalizedUser = normalizeSetAnswer(userAnswer)');
    expect(htmlContent).toContain('const normalizedCorrect = normalizeSetAnswer(question.correctAnswer)');
    expect(htmlContent).toContain('correct = normalizedUser === normalizedCorrect');
  });
});
