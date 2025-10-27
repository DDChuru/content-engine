/**
 * Quiz Answer Validation Tests
 *
 * Ensures that the smart answer normalization works correctly
 * for all variations of set notation and common student inputs.
 */

import { describe, it, expect } from '@jest/globals';

/**
 * Normalize set notation for flexible answer checking
 * (Same function used in quiz HTML)
 */
function normalizeSetAnswer(answer: string): string {
  // Convert to lowercase and trim
  let normalized = answer.toLowerCase().trim();

  // Remove all spaces
  normalized = normalized.replace(/\s+/g, '');

  // Handle common typos: dots instead of commas
  normalized = normalized.replace(/\./g, ',');

  // Remove outer braces if present
  normalized = normalized.replace(/^\{/, '').replace(/\}$/, '');

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

/**
 * Helper to check if two answers are equivalent
 */
function answersMatch(userAnswer: string, correctAnswer: string): boolean {
  return normalizeSetAnswer(userAnswer) === normalizeSetAnswer(correctAnswer);
}

describe('Quiz Answer Validation', () => {
  describe('Basic Set Notation', () => {
    it('should accept answer with braces', () => {
      expect(answersMatch('{3}', '{3}')).toBe(true);
    });

    it('should accept answer without braces', () => {
      expect(answersMatch('3', '{3}')).toBe(true);
    });

    it('should accept answer with or without braces interchangeably', () => {
      expect(answersMatch('{1, 2, 3}', '1, 2, 3')).toBe(true);
      expect(answersMatch('1, 2, 3', '{1, 2, 3}')).toBe(true);
    });
  });

  describe('Whitespace Handling', () => {
    it('should ignore extra spaces', () => {
      expect(answersMatch('{1, 2, 3}', '{1,2,3}')).toBe(true);
    });

    it('should ignore spaces inside braces', () => {
      expect(answersMatch('{ 1 , 2 , 3 }', '{1,2,3}')).toBe(true);
    });

    it('should ignore leading/trailing spaces', () => {
      expect(answersMatch('  {1, 2, 3}  ', '{1,2,3}')).toBe(true);
    });

    it('should ignore spaces without braces', () => {
      expect(answersMatch('1 2 3', '1,2,3')).toBe(true);
    });
  });

  describe('Element Order', () => {
    it('should accept elements in any order (numbers)', () => {
      expect(answersMatch('{3, 1, 5}', '{1, 3, 5}')).toBe(true);
      expect(answersMatch('{5, 3, 1}', '{1, 3, 5}')).toBe(true);
    });

    it('should accept elements in any order (mixed)', () => {
      expect(answersMatch('{9, 7, 5, 3, 1}', '{1, 3, 5, 7, 9}')).toBe(true);
    });

    it('should accept elements in any order (letters)', () => {
      expect(answersMatch('{c, a, b}', '{a, b, c}')).toBe(true);
    });
  });

  describe('Common Typos', () => {
    it('should convert dots to commas', () => {
      expect(answersMatch('1. 3. 5. 7. 9', '1, 3, 5, 7, 9')).toBe(true);
    });

    it('should handle mixed dots and commas', () => {
      expect(answersMatch('1, 3. 5, 7. 9', '1, 3, 5, 7, 9')).toBe(true);
    });
  });

  describe('Numeric Sorting', () => {
    it('should sort numbers numerically not alphabetically', () => {
      expect(answersMatch('{10, 2, 5}', '{2, 5, 10}')).toBe(true);
      expect(normalizeSetAnswer('{10, 2, 5}')).toBe('2,5,10');
    });

    it('should handle large numbers correctly', () => {
      expect(answersMatch('{100, 20, 5}', '{5, 20, 100}')).toBe(true);
    });
  });

  describe('Real Student Answers (from screenshots)', () => {
    it('Question 2: should accept "3" as correct for "{3}"', () => {
      expect(answersMatch('3', '{3}')).toBe(true);
    });

    it('Question 3: should accept "1, 3. 5 ,7, 9" for "{1, 3, 5, 7, 9}"', () => {
      // Note: dot after 3 should be converted to comma
      expect(answersMatch('1, 3. 5 ,7, 9', '{1, 3, 5, 7, 9}')).toBe(true);
    });

    it('Question 3: should accept various formats', () => {
      const correct = '{1, 3, 5, 7, 9}';

      expect(answersMatch('1, 3, 5, 7, 9', correct)).toBe(true);
      expect(answersMatch('{1,3,5,7,9}', correct)).toBe(true);
      expect(answersMatch('1 3 5 7 9', correct)).toBe(true);
      expect(answersMatch('9, 7, 5, 3, 1', correct)).toBe(true);
      expect(answersMatch('{ 1 , 3 , 5 , 7 , 9 }', correct)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty set', () => {
      expect(answersMatch('{}', '{}')).toBe(true);
      expect(answersMatch('', '{}')).toBe(true);
    });

    it('should handle single element', () => {
      expect(answersMatch('5', '{5}')).toBe(true);
      expect(answersMatch('{5}', '5')).toBe(true);
    });

    it('should handle negative numbers', () => {
      expect(answersMatch('{-3, -1, 5}', '{-3, -1, 5}')).toBe(true);
      expect(answersMatch('{5, -1, -3}', '{-3, -1, 5}')).toBe(true);
    });

    it('should handle decimals', () => {
      expect(answersMatch('{1.5, 2.7, 3.2}', '{1.5, 2.7, 3.2}')).toBe(true);
      expect(answersMatch('{3.2, 1.5, 2.7}', '{1.5, 2.7, 3.2}')).toBe(true);
    });

    it('should reject incorrect answers', () => {
      expect(answersMatch('{1, 2, 3}', '{1, 2, 4}')).toBe(false);
      expect(answersMatch('{1, 2}', '{1, 2, 3}')).toBe(false);
      expect(answersMatch('5', '{3}')).toBe(false);
    });
  });

  describe('Complex Sets', () => {
    it('should handle sets with 10+ elements', () => {
      const userAnswer = '10, 9, 8, 7, 6, 5, 4, 3, 2, 1';
      const correctAnswer = '{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}';
      expect(answersMatch(userAnswer, correctAnswer)).toBe(true);
    });

    it('should handle alphanumeric elements', () => {
      expect(answersMatch('{a1, b2, c3}', '{a1, b2, c3}')).toBe(true);
      expect(answersMatch('{c3, a1, b2}', '{a1, b2, c3}')).toBe(true);
    });
  });
});

describe('Integration: Quiz Question Validation', () => {
  const sampleQuestions = [
    {
      id: 'q1',
      question: 'Find A ∪ B where A = {2, 4, 6} and B = {4, 6, 8}',
      type: 'multiple-choice',
      correctAnswer: '{2, 4, 6, 8}'
    },
    {
      id: 'q2',
      question: 'Find A ∩ B where A = {1, 3, 5, 7} and B = {3, 6, 9}',
      type: 'short-answer',
      correctAnswer: '{3}'
    },
    {
      id: 'q3',
      question: "Find A' where ξ = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10} and A = {2, 4, 6, 8, 10}",
      type: 'short-answer',
      correctAnswer: '{1, 3, 5, 7, 9}'
    }
  ];

  it('should validate all sample questions with various inputs', () => {
    // Question 2 - various formats should work
    expect(answersMatch('3', sampleQuestions[1].correctAnswer)).toBe(true);
    expect(answersMatch('{3}', sampleQuestions[1].correctAnswer)).toBe(true);
    expect(answersMatch(' 3 ', sampleQuestions[1].correctAnswer)).toBe(true);

    // Question 3 - various formats should work
    const q3Variations = [
      '1, 3, 5, 7, 9',
      '{1, 3, 5, 7, 9}',
      '1,3,5,7,9',
      '9, 7, 5, 3, 1',
      '{ 1 , 3 , 5 , 7 , 9 }'
    ];

    q3Variations.forEach(variation => {
      expect(answersMatch(variation, sampleQuestions[2].correctAnswer)).toBe(true);
    });
  });
});

export { normalizeSetAnswer, answersMatch };
