#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { validateLesson } from '../src/services/lesson-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LESSON_DIR = path.resolve(__dirname, '../output/lessons');
const LESSON_FILES = [
  'igcse-0580-c1.2.json',
  'igcse-0580-c1.3.json',
  'igcse-0580-c1.5.json',
];

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
};

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const TOKEN_RE = /@@LATEX_(\d+)@@/g;

interface Sample {
  file: string;
  path: string;
  before: string;
  after: string;
}

interface TransformResult {
  value: unknown;
  modifiedStrings: number;
  samples: Sample[];
}

interface LessonReport {
  file: string;
  filePath: string;
  originalText: string;
  transformedText: string;
  modifiedStrings: number;
  beforeValid: boolean;
  afterValid: boolean;
  beforeErrors: number;
  afterErrors: number;
  samples: Sample[];
}

interface IntegrityIssue {
  path: string;
  message: string;
}

function superscriptsToAscii(value: string): string {
  return [...value].map((char) => SUPERSCRIPT_DIGITS[char] ?? char).join('');
}

function toLatex(raw: string): string {
  let latex = raw.trim();

  latex = latex.replace(/\{\s*\}/g, '\\{\\}');
  latex = latex.replace(/\{([^{}\n]*)\}/g, '\\{$1\\}');

  latex = latex.replace(
    new RegExp(`([A-Za-z0-9)])([${SUP}]+)`, 'g'),
    (_match, base: string, exponent: string) => `${base}^${superscriptsToAscii(exponent)}`
  );

  latex = latex.replace(/∛\s*\(([^)\n]+)\)/g, (_match, inner: string) => {
    return `\\sqrt[3]{${inner.trim()}}`;
  });
  latex = latex.replace(/√\s*\(([^)\n]+)\)/g, (_match, inner: string) => {
    return `\\sqrt{${inner.trim()}}`;
  });
  latex = latex.replace(/∛\s*(-?\d+(?:\.\d+)?|[A-Za-z](?:\^\d+)?)/g, (_match, inner: string) => {
    return `\\sqrt[3]{${inner.trim()}}`;
  });
  latex = latex.replace(/√\s*(-?\d+(?:\.\d+)?|[A-Za-z](?:\^\d+)?)/g, (_match, inner: string) => {
    return `\\sqrt{${inner.trim()}}`;
  });

  latex = latex.replace(/(?<![A-Za-z0-9])(\d{1,4})\/(\d{1,4})(?![A-Za-z0-9])/g, '\\frac{$1}{$2}');

  latex = latex.replace(/\s*∪\s*/g, ' \\cup ');
  latex = latex.replace(/\s*∩\s*/g, ' \\cap ');
  latex = latex.replace(/\s*∈\s*/g, ' \\in ');
  latex = latex.replace(/\s*∉\s*/g, ' \\notin ');
  latex = latex.replace(/\s*⊆\s*/g, ' \\subseteq ');
  latex = latex.replace(/\s*⊂\s*/g, ' \\subset ');
  latex = latex.replace(/ξ/g, '\\xi');
  latex = latex.replace(/∅/g, '\\emptyset');
  latex = latex.replace(/(?<=\d)\s*x\s*(?=-?\d)/g, ' \\times ');
  latex = latex.replace(/\s*×\s*/g, ' \\times ');
  latex = latex.replace(/\s*≤\s*/g, ' \\leq ');
  latex = latex.replace(/\s*≥\s*/g, ' \\geq ');
  latex = latex.replace(/\s*≠\s*/g, ' \\neq ');

  return latex.replace(/\s+/g, ' ').trim();
}

function shouldSkipStringPath(location: string): boolean {
  return /(?:^|\.)(?:id|topicCode|syllabusCode|level|difficulty|questionType|correctOptionId|skillTag|generatedAt|lastUpdated|createdAt|updatedAt|imagePath|videoPath|audioPath|url)$/.test(location);
}

function transformString(value: string, location: string): string {
  if (shouldSkipStringPath(location)) return value;
  if (value.includes('\\(')) return value;
  if (/\\[A-Za-z]+|\\[{}]/.test(value)) return value;

  let text = value;
  const protectedLatex: string[] = [];

  const protect = (latex: string): string => {
    const token = `@@LATEX_${protectedLatex.length}@@`;
    protectedLatex.push(`\\(${latex}\\)`);
    return token;
  };

  const wrap = (pattern: RegExp, convert: (match: string) => string = toLatex) => {
    text = text.replace(pattern, (match: string) => {
      if (match.includes('@@LATEX_')) return match;
      const latex = convert(match);
      return latex === '' ? match : protect(latex);
    });
  };

  const fractionAtom = String.raw`\d{1,4}\/\d{1,4}`;
  const rootAtom = String.raw`[√∛]\s*(?:\([^)\n]+\)|-?\d+(?:\.\d+)?)`;
  const variableAtom = String.raw`(?<![A-Za-z])[A-Za-z](?:[${SUP}]+)?(?![A-Za-z])`;
  const numberAtom = String.raw`-?\d+(?:\.\d+)?(?:[${SUP}]+)?`;
  const atom =
    String.raw`(?:${fractionAtom}|${rootAtom}|${numberAtom}|${variableAtom})`;
  const numericAtom = String.raw`(?:${fractionAtom}|${rootAtom}|${numberAtom})`;
  const arithmeticOperator = String.raw`(?:\s*(?:=|<|>|≤|≥|≠|\+|×)\s*|\s+-\s+)`;
  const numericAsciiXOperator = String.raw`(?:\s*(?:=|<|>|≤|≥|≠|\+|×|x)\s*|\s+-\s+)`;
  const comparisonOperator = String.raw`\s*(?:=|<|>|≤|≥|≠)\s*`;
  const arithmeticChain = new RegExp(`${atom}(?:${arithmeticOperator}${atom})+`, 'g');
  const numericAsciiXChain = new RegExp(`${numericAtom}(?:${numericAsciiXOperator}${numericAtom})+`, 'g');
  const comparisonChain = new RegExp(`${atom}(?:${comparisonOperator}${atom})+`, 'g');
  const productChain = new RegExp(`${atom}(?:\\s*×\\s*${atom})+`, 'g');
  const numericAsciiXProductChain = new RegExp(`${numericAtom}(?:\\s*x\\s*${numericAtom})+`, 'g');

  wrap(/\bn\([^)\n]*(?:[∪∩ξA-Z]'?)[^)\n]*\)(?:\s*[+\-]\s*n\([^)\n]+\))*\s*=\s*(?:n\([^)\n]+\)|-?\d+)/g);
  wrap(/\{[^{}\n]*\}\s*[∪∩]\s*\{[^{}\n]*\}(?:\s*=\s*\{[^{}\n]*\})?/g);
  wrap(/\(?[A-Z]\s*[∪∩]\s*[A-Z]\)?'?\s*=\s*\{[^{}\n]*\}/g);
  wrap(/\b(?:[A-Zξ]|[A-Z]')\s*=\s*\{[^{}\n]*\}/g);
  wrap(/\b(?:\d+|[A-Za-z])\s*[∈∉]\s*(?:[A-Zξ∅]|\{[^{}\n]*\})/g);
  wrap(/\b[A-Z]\s*[⊆⊂]\s*[A-Z]\b/g);
  wrap(/\(?[A-Z]\s*[∪∩]\s*[A-Z]\)?'?/g);
  wrap(/\bn\([A-Zξ]'?\)/g);
  wrap(/\b[A-Z]'(?![A-Za-z])/g);
  wrap(/\{\s*(?:[A-Za-z0-9]+(?:\s*,\s*[A-Za-z0-9]+)*|\s*)\s*\}/g);

  wrap(/\([√∛][^)\n]+\)[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g);
  wrap(numericAsciiXChain);
  wrap(arithmeticChain);
  wrap(comparisonChain);
  wrap(productChain);
  wrap(numericAsciiXProductChain);
  wrap(/\b\d+∛\s*\(?-?\d+(?:\.\d+)?\)?/g);
  wrap(/[√∛]\s*\([^)\n]+\)/g);
  wrap(/[√∛]\s*-?\d+(?:\.\d+)?/g);
  wrap(new RegExp(`(?:\\(-?\\d+(?:\\.\\d+)?\\)|-?\\d+(?:\\.\\d+)?|[A-Za-z])[${SUP}]+`, 'g'));
  wrap(/(?<![A-Za-z0-9])\d{1,4}\/\d{1,4}(?![A-Za-z0-9])/g);
  wrap(/[∪∩∈∉⊆⊂ξ∅≤≥≠]/g);

  return text.replace(TOKEN_RE, (_match, index: string) => protectedLatex[Number(index)]);
}

function transformNode(value: unknown, file: string, location: string): TransformResult {
  if (typeof value === 'string') {
    const transformed = transformString(value, location);
    const changed = transformed !== value;
    return {
      value: transformed,
      modifiedStrings: changed ? 1 : 0,
      samples: changed
        ? [{ file, path: location, before: value, after: transformed }]
        : [],
    };
  }

  if (Array.isArray(value)) {
    let modifiedStrings = 0;
    const samples: Sample[] = [];
    const next = value.map((item, index) => {
      const result = transformNode(item, file, `${location}[${index}]`);
      modifiedStrings += result.modifiedStrings;
      samples.push(...result.samples);
      return result.value;
    });
    return { value: next, modifiedStrings, samples };
  }

  if (value && typeof value === 'object') {
    let modifiedStrings = 0;
    const samples: Sample[] = [];
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      const result = transformNode(item, file, location ? `${location}.${key}` : key);
      modifiedStrings += result.modifiedStrings;
      samples.push(...result.samples);
      next[key] = result.value;
    }
    return { value: next, modifiedStrings, samples };
  }

  return { value, modifiedStrings: 0, samples: [] };
}

function countOccurrences(value: string, needle: string): number {
  let count = 0;
  let index = value.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = value.indexOf(needle, index + needle.length);
  }
  return count;
}

function collectLatexIntegrityIssues(value: unknown, location: string): IntegrityIssue[] {
  if (typeof value === 'string') {
    const issues: IntegrityIssue[] = [];
    if (/\\\)\/\d/.test(value)) {
      issues.push({
        path: location,
        message: 'stranded denominator after inline LaTeX close delimiter',
      });
    }

    const opens = countOccurrences(value, '\\(');
    const closes = countOccurrences(value, '\\)');
    if (opens !== closes) {
      issues.push({
        path: location,
        message: `unbalanced inline LaTeX delimiters (${opens} opens, ${closes} closes)`,
      });
    }
    return issues;
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectLatexIntegrityIssues(item, `${location}[${index}]`)
    );
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) =>
      collectLatexIntegrityIssues(item, location ? `${location}.${key}` : key)
    );
  }

  return [];
}

async function backupOriginal(filePath: string, originalText: string) {
  const backupPath = `${filePath}.bak`;
  try {
    await fs.access(backupPath);
  } catch {
    await fs.writeFile(backupPath, originalText);
  }
}

async function prepareLesson(file: string): Promise<LessonReport> {
  const filePath = path.join(LESSON_DIR, file);
  const originalText = await fs.readFile(filePath, 'utf8');
  const originalJson = JSON.parse(originalText);
  const before = validateLesson(originalJson);
  const transformed = transformNode(originalJson, file, '');
  const after = validateLesson(transformed.value);
  const integrityIssues = collectLatexIntegrityIssues(transformed.value, '');

  if (after.errors.length > before.errors.length) {
    const beforeErrors = new Set(before.errors);
    const newErrors = after.errors.filter((error) => !beforeErrors.has(error)).slice(0, 5);
    throw new Error(
      `${file}: validator regression (${before.errors.length} errors before, ${after.errors.length} after). New errors: ${newErrors.join(' | ')}`
    );
  }

  if (integrityIssues.length > 0) {
    throw new Error(
      `${file}: LaTeX integrity check failed: ${integrityIssues
        .slice(0, 5)
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join(' | ')}`
    );
  }

  return {
    file,
    filePath,
    originalText,
    transformedText: `${JSON.stringify(transformed.value, null, 2)}\n`,
    modifiedStrings: transformed.modifiedStrings,
    beforeValid: before.valid,
    afterValid: after.valid,
    beforeErrors: before.errors.length,
    afterErrors: after.errors.length,
    samples: transformed.samples,
  };
}

async function main() {
  const reports = await Promise.all(LESSON_FILES.map(prepareLesson));

  for (const report of reports) {
    await backupOriginal(report.filePath, report.originalText);
    await fs.writeFile(report.filePath, report.transformedText);
  }

  console.log('Retrofit LaTeX delimiters complete.');
  for (const report of reports) {
    console.log(
      `${report.file}: ${report.modifiedStrings} strings modified; validator ${report.beforeErrors} -> ${report.afterErrors} errors (${report.beforeValid ? 'valid' : 'invalid'} -> ${report.afterValid ? 'valid' : 'invalid'})`
    );
  }

  const samples = reports.flatMap((report) => report.samples).slice(0, 5);
  console.log('\nSamples:');
  for (const sample of samples) {
    console.log(`- ${sample.file}:${sample.path}`);
    console.log(`  before: ${sample.before}`);
    console.log(`  after:  ${sample.after}`);
  }
}

main().catch((error) => {
  console.error('Retrofit failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
