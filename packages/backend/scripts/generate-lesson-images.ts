/**
 * Generate Venn Diagram Images for Sets Lesson
 * Uses Gemini to create educational diagrams
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const DIAGRAMS = [
  {
    id: "content-1-1",
    filename: "sets-everyday-life",
    title: "Sets in Everyday Life",
    prompt: `Create an educational infographic showing three examples of sets in everyday life:

1. A shopping basket with fruits (apples, bananas, oranges) with mathematical notation "Set F = {apple, banana, orange}"

2. Playing cards showing hearts with notation "Set H = {hearts}"

3. A classroom with students circled with notation "Set S = {students}"

Style requirements:
- Clean, modern illustration style suitable for 14-16 year old students
- Light blue gradient background
- Professional educational look
- Clear mathematical curly brace notation next to each example
- Use icons/simple illustrations, not photographs
- Include the mathematical set notation clearly visible`
  },
  {
    id: "content-2-3",
    filename: "set-notation-methods",
    title: "Three Ways to Write the Same Set",
    prompt: `Create an educational comparison diagram showing three equivalent ways to write the set of even numbers from 2 to 10:

Method 1 - List Notation:
A = {2, 4, 6, 8, 10}

Method 2 - Set-Builder Notation:
A = {x : x is even, 2 ≤ x ≤ 10}

Method 3 - Pattern Notation:
A = {2, 4, 6, ...} with "..." indicating continuation

Style requirements:
- Blueprint style with blue lines on light background
- Show equals signs (≡ or =) between the three notations indicating they're equivalent
- Clean, technical, mathematical diagram style
- Clear labels for each method
- Professional educational infographic for IGCSE students`
  },
  {
    id: "content-5-3",
    filename: "union-intersection-comparison",
    title: "Union vs Intersection Comparison",
    prompt: `Create a side-by-side educational Venn diagram comparison:

LEFT SIDE - UNION (A ∪ B):
- Two overlapping circles, BOTH circles fully shaded in orange/yellow
- Title: "UNION (A ∪ B)"
- Label: "OR - in A or B or both"
- Example: A = {1, 2, 3}, B = {3, 4, 5}
- Result: A ∪ B = {1, 2, 3, 4, 5}

RIGHT SIDE - INTERSECTION (A ∩ B):
- Two overlapping circles, ONLY the overlap shaded in blue
- Title: "INTERSECTION (A ∩ B)"
- Label: "AND - in both A and B"
- Example: A = {1, 2, 3}, B = {3, 4, 5}
- Result: A ∩ B = {3}

Style requirements:
- Bright contrasting colors (orange for union, blue for intersection)
- Clean educational infographic style
- Clear labels and mathematical notation
- Professional look suitable for Cambridge IGCSE Mathematics`
  }
];

async function generateImages() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not found in environment');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);
  const outputDir = path.resolve(process.cwd(), 'output/lessons/images');

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  console.log('🎨 Generating Venn Diagram Images for Sets Lesson\n');
  console.log(`Output directory: ${outputDir}\n`);

  let totalCost = 0;
  const results: any[] = [];

  for (const diagram of DIAGRAMS) {
    console.log(`\n📊 Generating: ${diagram.title}`);
    console.log(`   Prompt: ${diagram.prompt.substring(0, 80)}...`);

    try {
      const result = await generator.generateDirect({
        prompt: diagram.prompt,
        outputDir,
        filename: diagram.filename,
        aspectRatio: '16:9'
      });

      if (result.success) {
        console.log(`   ✅ Success! Saved to: ${result.imagePath}`);
        console.log(`   💰 Cost: $${result.cost.toFixed(3)}`);
        totalCost += result.cost;
        results.push({
          id: diagram.id,
          title: diagram.title,
          imagePath: `/output/lessons/images/${diagram.filename}.png`,
          success: true
        });
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
        results.push({
          id: diagram.id,
          title: diagram.title,
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
      results.push({
        id: diagram.id,
        title: diagram.title,
        success: false,
        error: error.message
      });
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total images: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  console.log(`Total cost: $${totalCost.toFixed(3)}`);

  // Save results mapping
  const mappingPath = path.join(outputDir, 'image-mapping.json');
  await fs.writeFile(mappingPath, JSON.stringify(results, null, 2));
  console.log(`\nImage mapping saved to: ${mappingPath}`);

  return results;
}

generateImages().catch(console.error);
