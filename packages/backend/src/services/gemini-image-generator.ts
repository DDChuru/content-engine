/**
 * Gemini Image Generator Service
 *
 * Generates educational background images with STRICT NO TEXT policy.
 * Gemini often adds text to images which looks unprofessional - this service
 * enforces text-free visual-only generation.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface GeminiImageOptions {
  concept: string;
  description?: string;
  style?: 'abstract' | 'illustration' | 'professional' | 'minimal';
  colors?: string[];
  outputDir: string;
  allowText?: boolean;  // Default: false - explicitly opt-in to allow text
}

export interface GeminiImageResult {
  success: boolean;
  imagePath?: string;
  cost: number;
  error?: string;
}

export class GeminiImageGenerator {
  private genAI: GoogleGenerativeAI;
  private readonly COST_PER_IMAGE = 0.039; // $0.039 per image (1290 tokens @ $30/1M)

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generate a text-free educational background image
   */
  async generateImage(options: GeminiImageOptions): Promise<GeminiImageResult> {
    try {
      console.log(`[GeminiImageGenerator] Generating image: ${options.concept}`);

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-image'
      });

      // Build prompt with STRICT NO TEXT enforcement
      const prompt = this.buildPrompt(options);

      console.log(`[GeminiImageGenerator] Prompt: ${prompt.substring(0, 150)}...`);

      const result = await model.generateContent(prompt);
      const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in Gemini response');
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');

      // Save to output directory
      await fs.mkdir(options.outputDir, { recursive: true });
      const filename = `${options.concept.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
      const imagePath = path.join(options.outputDir, filename);

      await fs.writeFile(imagePath, imageBuffer);

      console.log(`[GeminiImageGenerator] ✓ Image saved: ${imagePath}`);

      return {
        success: true,
        imagePath,
        cost: this.COST_PER_IMAGE
      };

    } catch (error: any) {
      console.error(`[GeminiImageGenerator] Error:`, error);
      return {
        success: false,
        error: error.message,
        cost: 0
      };
    }
  }

  /**
   * Build prompt with strict NO TEXT enforcement
   */
  private buildPrompt(options: GeminiImageOptions): string {
    const style = options.style || 'professional';
    const colors = options.colors || ['blue', 'purple', 'gradient'];

    // Base visual-only prompt
    let prompt = `Create a ${style} educational background image.

Visual concept: ${options.concept}`;

    if (options.description) {
      prompt += `\nVisual elements: ${options.description}`;
    }

    prompt += `\nColor palette: ${colors.join(', ')}`;

    // CRITICAL: NO TEXT enforcement (unless explicitly allowed)
    if (!options.allowText) {
      prompt += `

🚫 CRITICAL REQUIREMENTS:
- NO TEXT whatsoever in the image
- NO WORDS, NO LETTERS, NO NUMBERS
- NO labels, NO captions, NO titles
- PURE VISUAL ONLY - abstract shapes, gradients, illustrations
- Text will be added separately as overlays
- Focus on background aesthetic and mood`;
    }

    // Additional quality requirements
    prompt += `

Quality requirements:
- Professional, clean design
- High clarity and resolution
- Suitable for 1920x1080 video background
- Not distracting - subtle and supportive
- Centered composition with clear focal area`;

    return prompt;
  }

  /**
   * Generate multiple images in batch
   */
  async generateBatch(
    concepts: string[],
    baseOptions: Omit<GeminiImageOptions, 'concept'>
  ): Promise<GeminiImageResult[]> {
    console.log(`[GeminiImageGenerator] Generating ${concepts.length} images in batch...`);

    const results: GeminiImageResult[] = [];

    for (const concept of concepts) {
      const result = await this.generateImage({
        ...baseOptions,
        concept
      });
      results.push(result);

      // Small delay to avoid rate limits
      if (concepts.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCost = results.reduce((sum, r) => sum + r.cost, 0);

    console.log(`[GeminiImageGenerator] Batch complete: ${successCount}/${concepts.length} succeeded, $${totalCost.toFixed(2)}`);

    return results;
  }

  /**
   * Generate a simple gradient/abstract background (for when you need guaranteed text-free)
   */
  async generateAbstractBackground(
    theme: 'education' | 'mathematics' | 'science' | 'neutral',
    outputDir: string
  ): Promise<GeminiImageResult> {
    const themes = {
      education: {
        concept: 'Abstract educational background',
        description: 'Soft gradients, geometric shapes, light and modern',
        colors: ['#667eea', '#764ba2', '#f0f4ff']
      },
      mathematics: {
        concept: 'Mathematical abstract background',
        description: 'Geometric patterns, clean lines, structured composition',
        colors: ['#4299e1', '#667eea', '#edf2f7']
      },
      science: {
        concept: 'Scientific abstract background',
        description: 'Molecular structures, flowing patterns, subtle complexity',
        colors: ['#38b2ac', '#4299e1', '#e6fffa']
      },
      neutral: {
        concept: 'Neutral professional background',
        description: 'Simple gradient, minimal design, clean aesthetic',
        colors: ['#a0aec0', '#cbd5e0', '#f7fafc']
      }
    };

    const selected = themes[theme];

    return this.generateImage({
      concept: selected.concept,
      description: selected.description,
      colors: selected.colors,
      style: 'minimal',
      outputDir,
      allowText: false  // Explicitly NO TEXT
    });
  }
}

export default GeminiImageGenerator;
