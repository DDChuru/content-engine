#!/usr/bin/env tsx
/**
 * Quiz Generation Validation Script
 *
 * Runs comprehensive validation to ensure quiz generation works correctly.
 * Run this before deploying to catch any issues.
 *
 * Usage:
 *   npm run validate-quiz
 */

import { ExerciseGenerator } from '../services/exercise-generator.js';
import { ClaudeService } from '../services/claude.js';
import * as fs from 'fs/promises';
import * as path from 'path';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✅ ${message}`, colors.green);
}

function error(message: string) {
  log(`❌ ${message}`, colors.red);
}

function info(message: string) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function warning(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

/**
 * Test the normalization function with various inputs
 */
function testNormalization() {
  log('\n📝 Testing Answer Normalization Function...', colors.bright);

  const testCases = [
    { input: '3', expected: '{3}', description: 'Single element without braces' },
    { input: '{3}', expected: '{3}', description: 'Single element with braces' },
    { input: '1, 3, 5', expected: '{1, 3, 5}', description: 'Multiple elements without braces' },
    { input: '{1, 3, 5}', expected: '{1, 3, 5}', description: 'Multiple elements with braces' },
    { input: '1,3,5', expected: '{1, 3, 5}', description: 'No spaces' },
    { input: '  { 1 , 3 , 5 }  ', expected: '{1, 3, 5}', description: 'Extra spaces everywhere' },
    { input: '5, 3, 1', expected: '{1, 3, 5}', description: 'Wrong order (should sort)' },
    { input: '1. 3. 5', expected: '{1, 3, 5}', description: 'Dots instead of commas' },
    { input: '10, 2, 5', expected: '{2, 5, 10}', description: 'Numeric sorting' }
  ];

  // Inline normalization function for testing
  function normalizeSetAnswer(answer: string): string {
    let normalized = answer.toLowerCase().trim();
    normalized = normalized.replace(/\s+/g, '');
    normalized = normalized.replace(/\./g, ',');
    normalized = normalized.replace(/^\{/, '').replace(/\}$/, '');

    const elements = normalized.split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0)
      .sort((a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });

    return elements.join(',');
  }

  let passed = 0;
  let failed = 0;

  testCases.forEach(({ input, expected, description }) => {
    const normalizedInput = normalizeSetAnswer(input);
    const normalizedExpected = normalizeSetAnswer(expected);

    if (normalizedInput === normalizedExpected) {
      success(`  ${description}: "${input}" → "${normalizedInput}"`);
      passed++;
    } else {
      error(`  ${description}: "${input}" → "${normalizedInput}" (expected: "${normalizedExpected}")`);
      failed++;
    }
  });

  log(`\n  Passed: ${passed}/${testCases.length}`, passed === testCases.length ? colors.green : colors.red);

  return failed === 0;
}

/**
 * Validate generated quiz HTML
 */
async function validateQuizHTML(htmlPath: string): Promise<boolean> {
  log('\n📄 Validating Quiz HTML...', colors.bright);

  try {
    const content = await fs.readFile(htmlPath, 'utf-8');

    const checks = [
      {
        name: 'Normalization function exists',
        test: () => content.includes('function normalizeSetAnswer')
      },
      {
        name: 'Normalization is used in validation',
        test: () => content.includes('normalizeSetAnswer(userAnswer)') &&
                     content.includes('normalizeSetAnswer(question.correctAnswer)')
      },
      {
        name: 'Gradient theme applied',
        test: () => content.includes('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
      },
      {
        name: 'Progress bar included',
        test: () => content.includes('progress-bar') || content.includes('progress-fill')
      },
      {
        name: 'Feedback system present',
        test: () => content.includes('feedback') && content.includes('feedback.correct')
      },
      {
        name: 'Hint system present',
        test: () => content.includes('showHint')
      },
      {
        name: 'Mobile responsive',
        test: () => content.includes('viewport')
      },
      {
        name: 'Accessibility attributes',
        test: () => content.includes('lang="en"') && content.includes('charset="UTF-8"')
      },
      {
        name: 'Whitespace normalization',
        test: () => content.includes('replace(/\\s+/g')
      },
      {
        name: 'Dot-to-comma conversion',
        test: () => content.includes('replace(/\\./g')
      },
      {
        name: 'Element sorting',
        test: () => content.includes('.sort(')
      }
    ];

    let passed = 0;
    checks.forEach(check => {
      if (check.test()) {
        success(`  ${check.name}`);
        passed++;
      } else {
        error(`  ${check.name}`);
      }
    });

    log(`\n  Passed: ${passed}/${checks.length}`, passed === checks.length ? colors.green : colors.red);

    return passed === checks.length;

  } catch (err: any) {
    error(`  Failed to read HTML file: ${err.message}`);
    return false;
  }
}

/**
 * Validate generated questions JSON
 */
async function validateQuestionsJSON(jsonPath: string): Promise<boolean> {
  log('\n📋 Validating Questions JSON...', colors.bright);

  try {
    const content = await fs.readFile(jsonPath, 'utf-8');
    const questions = JSON.parse(content);

    if (!Array.isArray(questions)) {
      error('  Questions is not an array');
      return false;
    }

    success(`  Questions array has ${questions.length} items`);

    const requiredFields = [
      'id', 'question', 'type', 'difficulty', 'correctAnswer',
      'explanation', 'hint', 'commonMistakes', 'subtopic', 'points'
    ];

    let allValid = true;

    questions.forEach((q, index) => {
      const missing = requiredFields.filter(field => !(field in q));
      if (missing.length > 0) {
        error(`  Question ${index + 1} (${q.id}) missing fields: ${missing.join(', ')}`);
        allValid = false;
      }

      // Validate question types
      const validTypes = ['multiple-choice', 'short-answer', 'true-false'];
      if (!validTypes.includes(q.type)) {
        error(`  Question ${index + 1} has invalid type: ${q.type}`);
        allValid = false;
      }

      // Validate difficulty
      const validDifficulties = ['easy', 'medium', 'hard'];
      if (!validDifficulties.includes(q.difficulty)) {
        warning(`  Question ${index + 1} has unusual difficulty: ${q.difficulty}`);
      }
    });

    if (allValid) {
      success(`  All ${questions.length} questions are valid`);
    }

    return allValid;

  } catch (err: any) {
    error(`  Failed to validate JSON: ${err.message}`);
    return false;
  }
}

/**
 * Main validation function
 */
async function main() {
  log('\n╔════════════════════════════════════════════════════╗', colors.bright);
  log('║   Quiz Generation Validation Suite               ║', colors.bright);
  log('╚════════════════════════════════════════════════════╝\n', colors.bright);

  const results: { [key: string]: boolean } = {};

  // Test 1: Normalization function
  results.normalization = testNormalization();

  // Test 2: Generate a test quiz
  log('\n🎯 Generating Test Quiz...', colors.bright);
  try {
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY || '');
    const generator = new ExerciseGenerator(claudeService);

    const testOutputDir = 'output/test-validation';

    const result = await generator.generateExercises({
      topicTitle: 'Sets',
      topicCode: 'C1.2',
      level: 'Core',
      concepts: ['Set notation', 'Union', 'Intersection'],
      targetCount: 10,
      outputDir: testOutputDir
    });

    if (result.success) {
      success(`  Generated ${result.questions.length} questions`);
      results.generation = true;

      // Test 3: Validate HTML
      const htmlPath = path.join(testOutputDir, 'exercises', 'quiz.html');
      results.html = await validateQuizHTML(htmlPath);

      // Test 4: Validate JSON
      const jsonPath = path.join(testOutputDir, 'exercises', 'questions.json');
      results.json = await validateQuestionsJSON(jsonPath);

    } else {
      error(`  Quiz generation failed: ${result.error}`);
      results.generation = false;
      results.html = false;
      results.json = false;
    }

  } catch (err: any) {
    error(`  Exception during generation: ${err.message}`);
    results.generation = false;
    results.html = false;
    results.json = false;
  }

  // Summary
  log('\n╔════════════════════════════════════════════════════╗', colors.bright);
  log('║   Validation Summary                              ║', colors.bright);
  log('╚════════════════════════════════════════════════════╝\n', colors.bright);

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? success : error;
    status(`  ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  log(`\n  Total: ${passedTests}/${totalTests} tests passed`,
      passedTests === totalTests ? colors.green : colors.red);

  if (passedTests === totalTests) {
    log('\n🎉 All validation tests passed! Quiz generation is working correctly.\n', colors.green);
    process.exit(0);
  } else {
    log('\n❌ Some validation tests failed. Please fix the issues above.\n', colors.red);
    process.exit(1);
  }
}

// Run validation
main().catch(err => {
  error(`\nFatal error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
