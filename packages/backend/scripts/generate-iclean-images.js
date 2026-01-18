/**
 * Image Generation Script for iClean Sanitech Presentation
 * Uses the @google/genai package for image generation
 *
 * Run from packages/backend directory: node scripts/generate-iclean-images.js
 */

import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Output to presentation directory
const OUTPUT_DIR = path.resolve(__dirname, '../../../projects/professional/food-safety/output/iclean-sanitech-presentation/images');

// Image generation prompts for iClean presentation
const imagePrompts = {
  'cleaning-team': `Professional photograph of a uniformed cleaning team in a commercial/industrial setting.

    The scene should show:
    - 3-4 professional cleaners in matching uniforms (blue or white)
    - Modern cleaning equipment (industrial floor scrubber, mop buckets)
    - Clean, well-lit commercial environment (warehouse, factory floor, or office)
    - Team members actively working or posing confidently
    - Professional, corporate feel

    Style: Professional corporate photography, bright lighting, clean composition
    NO text, NO logos, NO watermarks - pure visual only`,

  'dashboard': `Modern analytics dashboard displayed on a large monitor or tablet screen.

    The scene should show:
    - Clean, modern UI design with charts and graphs
    - Data visualization elements (pie charts, bar graphs, line trends)
    - Blue and green color scheme (professional, tech feel)
    - Dashboard showing metrics like completion rates, scores, trends
    - Soft glow from the screen in a professional office setting

    Style: Tech product photography, modern UI aesthetic
    NO readable text - abstract/blurred data values only`,

  'mobile-app': `Person using a mobile app for field inspections or audits.

    The scene should show:
    - Smartphone held in hands, showing app interface
    - Professional or industrial environment in background (slightly blurred)
    - App screen visible with checklist-style interface
    - Worker in professional attire or uniform
    - Natural lighting, authentic feel

    Style: Product photography, lifestyle shot
    NO readable text on screen - abstract UI elements only`,

  'quality-control': `Quality control inspector performing an inspection in a food manufacturing or commercial kitchen environment.

    The scene should show:
    - Inspector in white coat or PPE with clipboard or tablet
    - Clean, stainless steel industrial kitchen or food processing environment
    - Focus on hygiene and cleanliness standards
    - Professional inspection activity (checking surfaces, equipment)
    - Bright, clinical lighting

    Style: Industrial/corporate photography
    NO text, NO logos - pure visual`,

  'footprint': `Abstract visualization of Southern Africa map with connection points.

    The scene should show:
    - Stylized outline of Southern Africa region
    - Glowing connection points representing coverage areas
    - Modern, tech-inspired aesthetic
    - Blue and gold color scheme
    - Network lines connecting different points
    - Dark background with light elements

    Style: Modern infographic, tech visualization
    NO country names, NO text - pure visual representation`
};

class SimpleImageGenerator {
  constructor(apiKey) {
    this.genAI = new GoogleGenAI({ apiKey });
    this.costPerImage = 0.039;
  }

  async generateImage(prompt, filename) {
    try {
      console.log(`[ImageGen] Generating: ${filename}...`);

      // Use gemini-3-pro-image-preview for ALL image generation
      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
      });

      // Find the image part in the response
      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in response');
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      const extension = mimeType.includes('jpeg') ? 'jpg' :
                       mimeType.includes('webp') ? 'webp' : 'png';

      await fs.mkdir(OUTPUT_DIR, { recursive: true });
      const filepath = path.join(OUTPUT_DIR, `${filename}.${extension}`);
      await fs.writeFile(filepath, imageBuffer);

      console.log(`[ImageGen] ✓ Saved: ${filepath}`);
      return { success: true, path: filepath, cost: this.costPerImage };

    } catch (error) {
      console.error(`[ImageGen] ✗ Error generating ${filename}:`, error.message);
      return { success: false, error: error.message, cost: 0 };
    }
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('iClean Sanitech Presentation - Image Generation');
  console.log('='.repeat(60));

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY || process.env.NANO_API_KEY;
  if (!apiKey) {
    console.error('\nERROR: No API key found!');
    console.error('Set GEMINI_API_KEY or NANO_API_KEY in .env file');
    process.exit(1);
  }

  console.log('\nAPI Key found. Starting image generation...');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const generator = new SimpleImageGenerator(apiKey);
  const results = [];
  let totalCost = 0;

  // Generate each image
  for (const [name, prompt] of Object.entries(imagePrompts)) {
    const result = await generator.generateImage(prompt, name);
    results.push({ name, ...result });
    totalCost += result.cost;

    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('GENERATION COMPLETE');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\nSuccessful: ${successful.length}/${results.length}`);
  successful.forEach(r => console.log(`  ✓ ${r.name}: ${r.path}`));

  if (failed.length > 0) {
    console.log(`\nFailed: ${failed.length}`);
    failed.forEach(r => console.log(`  ✗ ${r.name}: ${r.error}`));
  }

  console.log(`\nEstimated cost: $${totalCost.toFixed(3)}`);
  console.log(`\nImages saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
