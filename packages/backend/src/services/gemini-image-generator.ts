/**
 * Gemini Image Generator Service
 *
 * Generates educational background images with STRICT NO TEXT policy.
 * Gemini often adds text to images which looks unprofessional - this service
 * enforces text-free visual-only generation.
 */

import { GoogleGenAI } from '@google/genai';
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

// Options for handwritten whiteboard content (Gemini 3 Pro)
export interface WhiteboardImageOptions {
  content: string;        // The math problem, solution steps, or text to render
  style?: 'whiteboard' | 'notebook' | 'blackboard' | 'graph-paper' | 'index-card';
  handwritingStyle?: 'neat-teacher' | 'messy-student' | 'chalk' | 'marker';
  inkColor?: string;      // 'blue', 'black', 'red', etc.
  showWorkings?: boolean; // Include step-by-step workings
  annotations?: string[]; // Additional annotations or highlights
  outputDir: string;
  aspectRatio?: '16:9' | '1:1' | '4:3' | '9:16';
}

export interface GeminiImageResult {
  success: boolean;
  imagePath?: string;
  cost: number;
  error?: string;
}

// Options for direct prompt generation (no wrapper)
export interface DirectImageOptions {
  prompt: string;           // Full prompt - passed directly to model
  outputDir: string;
  filename?: string;        // Optional custom filename (without extension)
  aspectRatio?: '16:9' | '1:1' | '4:3' | '9:16';
}

// Options for reference image generation (consistent character/style)
export interface ReferenceImageOptions extends DirectImageOptions {
  referenceImagePath: string;   // Path to reference image for consistency
  referenceWeight?: 'low' | 'medium' | 'high';  // How strongly to match reference
}

// Options for generating just a character reference
export interface CharacterReferenceOptions {
  description: string;      // Character description
  pose?: string;            // Initial pose
  expression?: string;      // Facial expression
  clothing?: string;        // What they're wearing
  setting?: string;         // Background/environment
  outputDir: string;
  filename?: string;
  aspectRatio?: '16:9' | '1:1' | '4:3' | '9:16';
}

export class GeminiImageGenerator {
  private genAI: GoogleGenAI;
  private readonly COST_PER_IMAGE = 0.039; // $0.039 per image (1290 tokens @ $30/1M)

  /**
   * Create a GeminiImageGenerator
   * @param apiKey - Gemini API key (GEMINI_API_KEY)
   * @param options - Optional Vertex AI configuration
   *
   * NOTE: All methods now use gemini-3-pro-image-preview model
   */
  constructor(apiKey: string, options?: { projectId?: string; location?: string }) {
    // Match video-studio's initialization pattern
    const genAIConfig: { apiKey: string; project?: string; location?: string } = { apiKey };
    if (options?.projectId && options?.location) {
      genAIConfig.project = options.projectId;
      genAIConfig.location = options.location;
    }
    this.genAI = new GoogleGenAI(genAIConfig);
  }

  /**
   * Generate a text-free educational background image
   */
  async generateImage(options: GeminiImageOptions): Promise<GeminiImageResult> {
    try {
      console.log(`[GeminiImageGenerator] Generating image: ${options.concept}`);

      // Build prompt with STRICT NO TEXT enforcement
      const prompt = this.buildPrompt(options);

      console.log(`[GeminiImageGenerator] Prompt: ${prompt.substring(0, 150)}...`);

      // Use gemini-3-pro-image-preview for ALL image generation
      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
      });

      // Find the image part in the response
      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in Gemini response');
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');

      // Detect actual mime type and use correct extension
      const mimeType = imagePart.inlineData.mimeType || this.detectImageFormat(imageBuffer);
      const extension = this.getExtensionForMimeType(mimeType);

      // Save to output directory
      await fs.mkdir(options.outputDir, { recursive: true });
      const filename = `${options.concept.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${extension}`;
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

  /**
   * Generate an image with a direct prompt (no wrapper added)
   * Use this for corporate slides, custom styles, etc.
   * Uses gemini-3-pro-image-preview for best quality
   */
  async generateDirect(options: DirectImageOptions): Promise<GeminiImageResult> {
    try {
      console.log(`[GeminiImageGenerator] Direct generation: ${options.prompt.substring(0, 60)}...`);

      // Pass prompt directly to model - no wrapper
      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: options.prompt,
        config: {
          imageConfig: {
            aspectRatio: options.aspectRatio || '16:9',
            imageSize: '1024x1024'
          }
        }
      });

      // Find the image part in the response
      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in Gemini response');
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');

      // Detect actual mime type and use correct extension
      const mimeType = imagePart.inlineData.mimeType || this.detectImageFormat(imageBuffer);
      const extension = this.getExtensionForMimeType(mimeType);

      // Save to output directory
      await fs.mkdir(options.outputDir, { recursive: true });
      const filename = options.filename
        ? `${options.filename}.${extension}`
        : `direct_${Date.now()}.${extension}`;
      const imagePath = path.join(options.outputDir, filename);

      await fs.writeFile(imagePath, imageBuffer);

      console.log(`[GeminiImageGenerator] ✓ Direct image saved: ${imagePath}`);

      return {
        success: true,
        imagePath,
        cost: this.COST_PER_IMAGE
      };

    } catch (error: any) {
      console.error(`[GeminiImageGenerator] Direct generation error:`, error);
      return {
        success: false,
        error: error.message,
        cost: 0
      };
    }
  }

  /**
   * Load an image file and convert to base64
   */
  private async loadImageAsBase64(imagePath: string): Promise<{ data: string; mimeType: string }> {
    const imageBuffer = await fs.readFile(imagePath);
    const mimeType = this.detectImageFormat(imageBuffer);
    const data = imageBuffer.toString('base64');
    return { data, mimeType };
  }

  /**
   * Generate a character reference image for use in subsequent generations
   * This creates a consistent character that can be used across multiple images
   */
  async generateCharacterReference(options: CharacterReferenceOptions): Promise<GeminiImageResult> {
    try {
      console.log(`[GeminiImageGenerator] Generating character reference: ${options.description.substring(0, 50)}...`);

      // Build a detailed prompt for character consistency
      let prompt = `Create a clear, well-lit reference portrait image of this person:

CHARACTER DESCRIPTION:
${options.description}

`;

      if (options.pose) {
        prompt += `POSE: ${options.pose}\n`;
      }
      if (options.expression) {
        prompt += `EXPRESSION: ${options.expression}\n`;
      }
      if (options.clothing) {
        prompt += `CLOTHING: ${options.clothing}\n`;
      }
      if (options.setting) {
        prompt += `SETTING: ${options.setting}\n`;
      }

      prompt += `
IMPORTANT REQUIREMENTS:
- This is a REFERENCE IMAGE for character consistency
- Clear, well-lit face and body visible
- Photorealistic style
- High quality, detailed features
- Memorable, distinctive appearance
- This exact person will appear in future images
- Capture unique identifying features (face shape, skin tone, hair, build)

STYLE: Editorial photography, professional lighting, sharp focus
`;

      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: options.aspectRatio || '1:1',  // Square works well for references
            imageSize: '1024x1024'
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in Gemini response');
      }

      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const mimeType = imagePart.inlineData.mimeType || this.detectImageFormat(imageBuffer);
      const extension = this.getExtensionForMimeType(mimeType);

      await fs.mkdir(options.outputDir, { recursive: true });
      const filename = options.filename
        ? `${options.filename}.${extension}`
        : `character_ref_${Date.now()}.${extension}`;
      const imagePath = path.join(options.outputDir, filename);

      await fs.writeFile(imagePath, imageBuffer);

      console.log(`[GeminiImageGenerator] ✓ Character reference saved: ${imagePath}`);

      return {
        success: true,
        imagePath,
        cost: this.COST_PER_IMAGE
      };

    } catch (error: any) {
      console.error(`[GeminiImageGenerator] Character reference error:`, error);
      return {
        success: false,
        error: error.message,
        cost: 0
      };
    }
  }

  /**
   * Generate an image using a reference image for consistency
   * Pass the same reference image to maintain character/style across multiple generations
   */
  async generateWithReference(options: ReferenceImageOptions): Promise<GeminiImageResult> {
    try {
      console.log(`[GeminiImageGenerator] Generating with reference: ${options.prompt.substring(0, 50)}...`);
      console.log(`[GeminiImageGenerator] Reference image: ${options.referenceImagePath}`);

      // Load reference image
      const referenceImage = await this.loadImageAsBase64(options.referenceImagePath);

      // Build weight instruction
      const weightInstructions = {
        'low': 'Use the reference image as a loose guide for the character appearance.',
        'medium': 'Maintain the same person from the reference image with similar features and appearance.',
        'high': 'This MUST be the EXACT SAME PERSON as shown in the reference image. Match all facial features, skin tone, hair, and body type precisely.'
      };

      const weight = options.referenceWeight || 'high';

      // Combine reference instruction with user prompt
      const enhancedPrompt = `${weightInstructions[weight]}

REFERENCE IMAGE: [Attached - this is the person/character to maintain]

NEW SCENE TO CREATE:
${options.prompt}

CONSISTENCY REQUIREMENTS:
- Same person as in reference (face, body, features)
- Same skin tone, hair color/style, body type
- Can have different pose, expression, clothing as specified
- Photorealistic, same quality as reference`;

      // Call Gemini with multimodal content (image + text)
      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: referenceImage.mimeType,
                  data: referenceImage.data
                }
              },
              {
                text: enhancedPrompt
              }
            ]
          }
        ],
        config: {
          imageConfig: {
            aspectRatio: options.aspectRatio || '16:9',
            imageSize: '1024x1024'
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in Gemini response');
      }

      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
      const mimeType = imagePart.inlineData.mimeType || this.detectImageFormat(imageBuffer);
      const extension = this.getExtensionForMimeType(mimeType);

      await fs.mkdir(options.outputDir, { recursive: true });
      const filename = options.filename
        ? `${options.filename}.${extension}`
        : `ref_gen_${Date.now()}.${extension}`;
      const imagePath = path.join(options.outputDir, filename);

      await fs.writeFile(imagePath, imageBuffer);

      console.log(`[GeminiImageGenerator] ✓ Reference-based image saved: ${imagePath}`);

      return {
        success: true,
        imagePath,
        cost: this.COST_PER_IMAGE
      };

    } catch (error: any) {
      console.error(`[GeminiImageGenerator] Reference generation error:`, error);
      return {
        success: false,
        error: error.message,
        cost: 0
      };
    }
  }

  /**
   * Generate a series of images with the same character
   * First generates a reference, then uses it for all subsequent images
   */
  async generateConsistentSeries(
    characterDescription: string,
    scenes: { prompt: string; filename: string }[],
    outputDir: string,
    aspectRatio: '16:9' | '1:1' | '4:3' | '9:16' = '16:9'
  ): Promise<{ reference: GeminiImageResult; scenes: GeminiImageResult[] }> {
    console.log(`[GeminiImageGenerator] Generating consistent series: ${scenes.length} scenes`);

    // Step 1: Generate character reference
    const reference = await this.generateCharacterReference({
      description: characterDescription,
      outputDir,
      filename: 'character-reference',
      aspectRatio: '1:1'  // Square for reference
    });

    if (!reference.success || !reference.imagePath) {
      console.error('[GeminiImageGenerator] Failed to generate character reference');
      return { reference, scenes: [] };
    }

    console.log(`[GeminiImageGenerator] ✓ Character reference created: ${reference.imagePath}`);

    // Step 2: Generate each scene using the reference
    const sceneResults: GeminiImageResult[] = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      console.log(`[GeminiImageGenerator] Scene ${i + 1}/${scenes.length}: ${scene.filename}`);

      const result = await this.generateWithReference({
        prompt: scene.prompt,
        referenceImagePath: reference.imagePath,
        referenceWeight: 'high',
        outputDir,
        filename: scene.filename,
        aspectRatio
      });

      sceneResults.push(result);

      // Rate limiting between generations
      if (i < scenes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successCount = sceneResults.filter(r => r.success).length;
    const totalCost = reference.cost + sceneResults.reduce((sum, r) => sum + r.cost, 0);

    console.log(`[GeminiImageGenerator] Series complete: ${successCount}/${scenes.length} scenes, $${totalCost.toFixed(3)}`);

    return { reference, scenes: sceneResults };
  }

  /**
   * Generate handwritten whiteboard content using Gemini 3 Pro
   *
   * This method uses the gemini-3-pro-image-preview model which excels at:
   * - Handwritten mathematical equations
   * - Step-by-step solution workings
   * - Diagrams in hand-drawn style
   * - Notebook/whiteboard aesthetic
   */
  async generateWhiteboard(options: WhiteboardImageOptions): Promise<GeminiImageResult> {
    try {
      console.log(`[GeminiImageGenerator] Generating whiteboard: ${options.content.substring(0, 50)}...`);

      const prompt = this.buildWhiteboardPrompt(options);
      console.log(`[GeminiImageGenerator] Whiteboard prompt: ${prompt.substring(0, 200)}...`);

      // Use Gemini 3 Pro Image Preview for best handwritten content quality
      const response = await this.genAI.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: options.aspectRatio || '16:9',
            imageSize: '1024x1024'
          }
        }
      });

      // Find the image part in the response
      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in Gemini response');
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');

      // Detect actual mime type and use correct extension
      const mimeType = imagePart.inlineData.mimeType || this.detectImageFormat(imageBuffer);
      const extension = this.getExtensionForMimeType(mimeType);

      // Save to output directory
      await fs.mkdir(options.outputDir, { recursive: true });
      const filename = `whiteboard_${Date.now()}.${extension}`;
      const imagePath = path.join(options.outputDir, filename);

      await fs.writeFile(imagePath, imageBuffer);

      console.log(`[GeminiImageGenerator] ✓ Whiteboard image saved: ${imagePath}`);

      return {
        success: true,
        imagePath,
        cost: this.COST_PER_IMAGE
      };

    } catch (error: any) {
      console.error(`[GeminiImageGenerator] Whiteboard error:`, error);
      return {
        success: false,
        error: error.message,
        cost: 0
      };
    }
  }

  /**
   * Build prompt for handwritten whiteboard content
   */
  private buildWhiteboardPrompt(options: WhiteboardImageOptions): string {
    const style = options.style || 'whiteboard';
    const handwriting = options.handwritingStyle || 'neat-teacher';
    const inkColor = options.inkColor || 'blue';

    // Map styles to descriptions
    const styleDescriptions: Record<string, string> = {
      'whiteboard': 'clean white whiteboard surface with whiteboard marker',
      'notebook': 'lined notebook paper with pen',
      'blackboard': 'dark green chalkboard with white and colored chalk',
      'graph-paper': 'graph paper with grid lines and pencil',
      'index-card': 'white index card with neat handwriting'
    };

    const handwritingDescriptions: Record<string, string> = {
      'neat-teacher': 'neat, clear teacher handwriting that is easy to read',
      'messy-student': 'slightly messy but legible student handwriting',
      'chalk': 'chalk writing with natural imperfections and slight dust',
      'marker': 'whiteboard marker with clean strokes'
    };

    let prompt = `Create an image of handwritten content on ${styleDescriptions[style]}.

Content to write:
${options.content}

`;

    if (options.showWorkings) {
      prompt += `Show all working steps clearly, each step on its own line.
`;
    }

    if (options.annotations && options.annotations.length > 0) {
      prompt += `Add these annotations in red:
${options.annotations.map(a => `- ${a}`).join('\n')}
`;
    }

    prompt += `
Style requirements:
- ${handwritingDescriptions[handwriting]}
- Main writing in ${inkColor} color
- Mathematical symbols and equations should be clearly readable
- Natural handwriting flow with slight variations
- High contrast for video background use
- Centered composition with margins

Quality:
- Professional educational content quality
- Clear, legible writing
- Appropriate spacing between lines
- Natural handwritten appearance, not computer font`;

    return prompt;
  }

  /**
   * Generate a step-by-step math solution as handwritten images
   * Returns an array of images, one per step
   */
  async generateStepByStepSolution(
    problem: string,
    steps: string[],
    outputDir: string,
    style: WhiteboardImageOptions['style'] = 'whiteboard'
  ): Promise<GeminiImageResult[]> {
    console.log(`[GeminiImageGenerator] Generating ${steps.length} step images...`);

    const results: GeminiImageResult[] = [];

    // First image: Just the problem
    const problemResult = await this.generateWhiteboard({
      content: `Problem:\n${problem}`,
      style,
      handwritingStyle: 'neat-teacher',
      inkColor: 'blue',
      outputDir,
      annotations: ['Try solving this!']
    });
    results.push(problemResult);

    // Generate each step progressively (showing previous work)
    let accumulatedWork = `Problem: ${problem}\n\n`;

    for (let i = 0; i < steps.length; i++) {
      accumulatedWork += `Step ${i + 1}: ${steps[i]}\n`;

      const isLastStep = i === steps.length - 1;

      const stepResult = await this.generateWhiteboard({
        content: accumulatedWork,
        style,
        handwritingStyle: 'neat-teacher',
        inkColor: 'blue',
        showWorkings: true,
        outputDir,
        annotations: isLastStep ? ['✓ Answer'] : [`Working on step ${i + 2}...`]
      });
      results.push(stepResult);

      // Delay between generations to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    const successCount = results.filter(r => r.success).length;
    const totalCost = results.reduce((sum, r) => sum + r.cost, 0);

    console.log(`[GeminiImageGenerator] Step-by-step complete: ${successCount}/${steps.length + 1} images, $${totalCost.toFixed(3)}`);

    return results;
  }

  /**
   * Generate a Venn diagram explanation
   */
  async generateVennDiagram(
    sets: { name: string; elements: string[] }[],
    operations?: { type: 'union' | 'intersection' | 'complement'; highlight: boolean }[],
    outputDir: string = './output/images'
  ): Promise<GeminiImageResult> {
    const setDescriptions = sets.map(s => `${s.name} = {${s.elements.join(', ')}}`).join('\n');

    let content = `Venn Diagram:\n\n${setDescriptions}\n\n`;

    if (operations) {
      const opSymbols = { union: '∪', intersection: '∩', complement: "'" };
      content += 'Operations:\n';
      operations.forEach(op => {
        content += `${sets.map(s => s.name).join(` ${opSymbols[op.type]} `)}\n`;
      });
    }

    return this.generateWhiteboard({
      content,
      style: 'whiteboard',
      handwritingStyle: 'neat-teacher',
      inkColor: 'blue',
      outputDir,
      annotations: operations?.filter(o => o.highlight).map(o => `Highlight ${o.type} region`)
    });
  }

  /**
   * Detect image format from magic bytes (file signature)
   */
  private detectImageFormat(buffer: Buffer): string {
    // Check magic bytes at the start of the file
    if (buffer.length < 4) {
      return 'image/png'; // Default fallback
    }

    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'image/png';
    }

    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'image/jpeg';
    }

    // WebP: RIFF....WEBP
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer.length >= 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return 'image/webp';
    }

    // GIF: GIF87a or GIF89a
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      return 'image/gif';
    }

    // BMP: BM
    if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
      return 'image/bmp';
    }

    // Default to PNG if unknown
    console.warn('[GeminiImageGenerator] Unknown image format, defaulting to PNG');
    return 'image/png';
  }

  /**
   * Get file extension for a mime type
   */
  private getExtensionForMimeType(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/bmp': 'bmp',
      'image/svg+xml': 'svg'
    };
    return extensions[mimeType] || 'png';
  }
}

export default GeminiImageGenerator;
