/**
 * Course Creator Agent
 * Voice-driven interactive course creation with image review and Remotion rendering
 */

// Polyfill for tsx - OpenAI SDK requires File global
import { File as NodeFile } from 'node:buffer';
if (typeof globalThis.File === 'undefined') {
  globalThis.File = NodeFile as any;
}

import express, { Request, Response } from 'express';
import OpenAI from 'openai';
import { ClaudeService } from '../services/claude.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiImageGenerator } from '../services/gemini-image-generator.js';
import { videoRenderer, WebSlidesScene } from '../services/video-renderer.js';
import { ManimRenderer, ManimScene } from '../services/manim-renderer.js';
import multer from 'multer';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: 'temp/audio/' });

// Initialize services
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Session storage
interface CourseSession {
  id: string;
  audience: string;
  topic: string;
  style: string;
  structure?: CourseStructure;
  images?: GeneratedImage[];
  scenes?: WebSlidesScene[];
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }>;
  readyToGenerate: boolean;
  createdAt: Date;
}

interface CourseStructure {
  title: string;
  description: string;
  chapters: Chapter[];
  estimatedDuration: number;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: number;
  contentType: 'text' | 'math' | 'visual' | 'mixed';
  imagePrompt?: string;
}

interface GeneratedImage {
  chapterId: string;
  prompt: string;
  path: string;
  url: string;
  approved: boolean;
  replacementRequested?: boolean;
}

const sessions = new Map<string, CourseSession>();

/**
 * POST /api/course-creator/start
 * Start a new course creation session with voice input
 */
router.post('/start', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const audioFile = req.file;
    const { audience, topic, style } = req.body;

    let transcription = '';

    // Transcribe if audio provided
    if (audioFile) {
      const audioPath = audioFile.path;

      // Rename to .webm so OpenAI recognizes the format
      const webmPath = `${audioPath}.webm`;
      await fs.rename(audioPath, webmPath);

      const result = await openai.audio.transcriptions.create({
        file: fsSync.createReadStream(webmPath),
        model: 'whisper-1',
      });

      transcription = result.text;

      // Clean up temp file
      await fs.unlink(webmPath);
    }

    // Create session
    const sessionId = crypto.randomBytes(16).toString('hex');

    // Combine form input with transcription
    const combinedAudience = transcription
      ? `${audience ? audience + '. ' : ''}Voice input: ${transcription}`
      : audience;

    const session: CourseSession = {
      id: sessionId,
      audience: combinedAudience || 'General audience',
      topic: topic || 'Educational course',
      style: style || 'professional',
      conversationHistory: [],
      readyToGenerate: false,
      createdAt: new Date()
    };

    sessions.set(sessionId, session);

    // Use Claude to analyze the input and propose structure
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);

    const analysisPrompt = `You are an expert course designer. A user wants to create a video course with these details:

AUDIENCE: ${session.audience}
TOPIC: ${session.topic || 'Not specified yet'}
STYLE: ${session.style}

Based on this information:
1. Propose a course title
2. Write a brief description
3. Create 4-6 chapters with titles and descriptions
4. Estimate duration for each chapter (in seconds, 30-60s each)
5. Identify content type for each chapter:
   - "math" - ONLY for mathematical concepts that need equations/diagrams (calculus, geometry, algebra, etc.)
   - "visual" - For topics that benefit from images (food safety, biology, history, business, etc.)
   - "mixed" - Combines visuals with explanations
   - "text" - Only for pure text summaries or conclusions

IMPORTANT: Most courses should use "visual" or "mixed" content types. Only use "math" for actual mathematics topics.
For each "visual" or "mixed" chapter, provide a detailed imagePrompt describing the visual concept to generate.

Respond in this exact JSON format:
{
  "title": "Course Title",
  "description": "Brief description",
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Chapter Title",
      "description": "What this chapter covers",
      "duration": 45,
      "contentType": "math|text|visual|mixed",
      "imagePrompt": "Detailed prompt for image generation (REQUIRED if contentType is 'visual' or 'mixed')"
    }
  ],
  "estimatedDuration": 300
}`;

    const response = await claudeService.sendMessage(
      [{ role: 'user', content: analysisPrompt }],
      undefined, // no tools
      'You are an expert course designer who creates structured educational content. Always respond with valid JSON in the exact format requested.'
    );

    // Extract JSON from response
    const responseText = response.content?.[0]?.text || '';
    console.log('[CourseCreator] Claude response:', responseText.substring(0, 500));

    // Try to extract JSON - look for {...} pattern
    let jsonMatch = responseText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      // JSON was in code block
      responseText.replace(jsonMatch[0], jsonMatch[1]);
    }

    // Find the first { and last } to extract JSON
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      console.error('[CourseCreator] No JSON found in response');
      throw new Error('Failed to parse course structure from Claude - no JSON found');
    }

    const jsonString = responseText.substring(firstBrace, lastBrace + 1);
    console.log('[CourseCreator] Extracted JSON:', jsonString.substring(0, 200));

    let structure: CourseStructure;
    try {
      structure = JSON.parse(jsonString);
    } catch (parseError: any) {
      console.error('[CourseCreator] JSON parse error:', parseError.message);
      console.error('[CourseCreator] Failed JSON:', jsonString.substring(0, 500));
      throw new Error(`Failed to parse course structure: ${parseError.message}`);
    }
    session.structure = structure;
    session.conversationHistory.push({
      role: 'assistant',
      content: `I've created a course structure for you:\n\n**${structure.title}**\n${structure.description}\n\n**Chapters:**\n${structure.chapters.map((ch, i) => `${i + 1}. ${ch.title} (${ch.duration}s) - ${ch.description}`).join('\n')}\n\nWould you like to proceed with this structure, or shall we refine it?`
    });

    res.json({
      success: true,
      sessionId,
      structure,
      message: session.conversationHistory[0].content,
      transcription
    });

  } catch (error: any) {
    console.error('Course creation start error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/course-creator/refine
 * Refine the course structure with voice feedback
 */
router.post('/refine', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const { sessionId, feedback } = req.body;
    const audioFile = req.file;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    let userFeedback = feedback;

    // Transcribe audio if provided
    if (audioFile) {
      const audioPath = audioFile.path;

      // Rename to .webm so OpenAI recognizes the format
      const webmPath = `${audioPath}.webm`;
      await fs.rename(audioPath, webmPath);

      const result = await openai.audio.transcriptions.create({
        file: fsSync.createReadStream(webmPath),
        model: 'whisper-1',
      });

      userFeedback = result.text;
      await fs.unlink(webmPath);
    }

    session.conversationHistory.push({
      role: 'user',
      content: userFeedback
    });

    // Use Claude to refine structure
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);

    const refinePrompt = `Current course structure:
${JSON.stringify(session.structure, null, 2)}

User feedback: ${userFeedback}

Please update the course structure based on this feedback. Respond in the same JSON format as before.`;

    const response = await claudeService.generateContent(
      [{ role: 'user', content: refinePrompt }],
      { maxTokens: 4000 }
    );
    const responseText = response.content || response.text || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      session.structure = JSON.parse(jsonMatch[0]);
    }

    const reply = `I've updated the structure. Here's what changed:\n\n${response}`;
    session.conversationHistory.push({
      role: 'assistant',
      content: reply
    });

    res.json({
      success: true,
      structure: session.structure,
      message: reply
    });

  } catch (error: any) {
    console.error('Refine error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/course-creator/approve-structure
 * Approve the structure and move to image generation
 */
router.post('/approve-structure', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    const session = sessions.get(sessionId);
    if (!session || !session.structure) {
      return res.status(404).json({ error: 'Session or structure not found' });
    }

    session.readyToGenerate = true;

    res.json({
      success: true,
      message: 'Structure approved! Ready to generate images.',
      structure: session.structure
    });

  } catch (error: any) {
    console.error('Approve structure error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/course-creator/generate-images
 * Generate images for chapters that need them
 */
router.post('/generate-images', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    const session = sessions.get(sessionId);
    if (!session || !session.structure) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Initialize image generator with correct model
    const imageGenerator = new GeminiImageGenerator(process.env.GEMINI_API_KEY!);
    const generatedImages: GeneratedImage[] = [];

    // Generate images for chapters that need them
    for (const chapter of session.structure.chapters) {
      if (chapter.contentType === 'visual' || chapter.contentType === 'mixed') {
        if (!chapter.imagePrompt) continue;

        console.log(`[CourseCreator] Generating image for: ${chapter.title}`);

        try {
          // Use GeminiImageGenerator service with correct options
          const result = await imageGenerator.generateImage({
            concept: chapter.title,
            description: chapter.imagePrompt,
            style: 'professional',
            outputDir: 'output/images',
            allowText: false  // STRICT: No text in images
          });

          if (result.success && result.imagePath) {
            generatedImages.push({
              chapterId: chapter.id,
              prompt: chapter.imagePrompt || chapter.title,
              path: result.imagePath,
              url: `/${result.imagePath}`, // Relative URL for serving
              approved: false
            });

            console.log(`[CourseCreator] ✓ Generated image for ${chapter.id} (cost: $${result.cost.toFixed(3)})`);
          } else {
            throw new Error(result.error || 'Unknown error generating image');
          }
        } catch (error: any) {
          console.error(`[CourseCreator] Failed to generate image for ${chapter.id}:`, error.message);
          // Continue with other chapters even if one fails
        }
      }
    }

    session.images = generatedImages;

    res.json({
      success: true,
      images: generatedImages.map(img => ({
        chapterId: img.chapterId,
        url: img.url,
        prompt: img.prompt
      })),
      message: `Generated ${generatedImages.length} images. Please review.`
    });

  } catch (error: any) {
    console.error('Image generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/course-creator/replace-image
 * Replace an image with a new prompt
 */
router.post('/replace-image', async (req: Request, res: Response) => {
  try {
    const { sessionId, chapterId, newPrompt } = req.body;

    const session = sessions.get(sessionId);
    if (!session || !session.images) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const imageGenerator = new GeminiImageGenerator(process.env.GEMINI_API_KEY!);

    console.log(`[CourseCreator] Replacing image for chapter: ${chapterId}`);

    // Find the chapter to get its title
    const chapter = session.structure?.chapters.find(ch => ch.id === chapterId);
    const chapterTitle = chapter?.title || chapterId;

    // Use GeminiImageGenerator service with correct options
    const result = await imageGenerator.generateImage({
      concept: chapterTitle,
      description: newPrompt,
      style: 'professional',
      outputDir: 'output/images',
      allowText: false  // STRICT: No text in images
    });

    if (!result.success || !result.imagePath) {
      throw new Error(result.error || 'Failed to generate replacement image');
    }

    // Update session
    const imageIndex = session.images.findIndex(img => img.chapterId === chapterId);
    if (imageIndex !== -1) {
      session.images[imageIndex] = {
        chapterId,
        prompt: newPrompt,
        path: result.imagePath,
        url: `/${result.imagePath}`,
        approved: false
      };
    }

    console.log(`[CourseCreator] ✓ Replaced image for ${chapterId} (cost: $${result.cost.toFixed(3)})`);

    res.json({
      success: true,
      image: {
        chapterId,
        url: `/${result.imagePath}`,
        prompt: newPrompt
      }
    });

  } catch (error: any) {
    console.error('Replace image error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/course-creator/approve-images
 * Approve all images and proceed to video generation
 */
router.post('/approve-images', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.images) {
      session.images.forEach(img => img.approved = true);
    }

    res.json({
      success: true,
      message: 'All images approved! Ready to generate course video.'
    });

  } catch (error: any) {
    console.error('Approve images error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/course-creator/generate-video
 * Generate the final course video using Remotion + WebSlides + Manim
 */
router.post('/generate-video', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    const session = sessions.get(sessionId);
    if (!session || !session.structure) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const scenes: WebSlidesScene[] = [];
    const manimRenderer = new ManimRenderer();

    // Create output directory for audio
    const audioDir = path.resolve(__dirname, '../../output/audio');
    await fs.mkdir(audioDir, { recursive: true });

    // Build scenes for each chapter
    for (let i = 0; i < session.structure.chapters.length; i++) {
      const chapter = session.structure.chapters[i];
      let visualPath = '';
      let audioPath = '';

      if (chapter.contentType === 'math') {
        // Use Manim for math content (NO TEXT in Manim animation)
        console.log(`[CourseCreator] Rendering Manim for: ${chapter.title}`);

        const manimScene: ManimScene = {
          sceneType: 'theory',
          concept: chapter.description,
          parameters: {
            title: '', // IMPORTANT: No text in Manim
            customCode: `
# Pure mathematical animation - NO TEXT
from manim import *

class MathScene(Scene):
    def construct(self):
        # Create visual representation only
        # Text will be added in WebSlides overlay
        equation = MathTex(r"${chapter.description}")
        self.play(Write(equation))
        self.wait(2)
`
          }
        };

        const result = await manimRenderer.render(manimScene);
        visualPath = result.videoPath;

      } else if (chapter.contentType === 'visual' || chapter.contentType === 'mixed') {
        // Use generated image
        const image = session.images?.find(img => img.chapterId === chapter.id);
        visualPath = image?.path || '';
      } else {
        // Text-only: use a simple gradient background
        visualPath = path.resolve(__dirname, '../../static/gradient-background.png');
      }

      // Generate audio narration for this chapter
      console.log(`[CourseCreator] Generating narration for: ${chapter.title}`);
      const narrationText = `${chapter.title}. ${chapter.description}`;

      try {
        const mp3Response = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'alloy', // Professional, neutral voice
          input: narrationText,
        });

        const audioFilename = `${sessionId}-chapter-${i + 1}.mp3`;
        audioPath = path.join(audioDir, audioFilename);

        const buffer = Buffer.from(await mp3Response.arrayBuffer());
        await fs.writeFile(audioPath, buffer);

        console.log(`[CourseCreator] ✓ Audio saved: ${audioFilename}`);
      } catch (error) {
        console.error(`[CourseCreator] Audio generation failed for chapter ${i + 1}:`, error);
        // Continue without audio for this chapter
      }

      scenes.push({
        id: i + 1,
        title: chapter.title,
        subtitle: chapter.description,
        visual: visualPath,
        audio: audioPath,
        duration: chapter.duration,
        type: chapter.contentType === 'math' ? 'manim' : 'gemini'
      });
    }

    session.scenes = scenes;

    // Render video using WebSlides + Remotion
    const outputFilename = `${sessionId}-course.mp4`;
    const result = await videoRenderer.quickRender(
      scenes,
      outputFilename,
      session.style === 'professional' ? 'education-dark' : 'education-light'
    );

    if (!result.success) {
      throw new Error(result.error || 'Video rendering failed');
    }

    res.json({
      success: true,
      videoPath: result.videoPath,
      duration: result.duration,
      scenes: scenes.length,
      message: 'Course video generated successfully!'
    });

  } catch (error: any) {
    console.error('Video generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/course-creator/session/:sessionId
 * Get session details
 */
router.get('/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    success: true,
    session: {
      id: session.id,
      audience: session.audience,
      topic: session.topic,
      style: session.style,
      structure: session.structure,
      images: session.images?.map(img => ({
        chapterId: img.chapterId,
        url: img.url,
        prompt: img.prompt,
        approved: img.approved
      })),
      readyToGenerate: session.readyToGenerate
    }
  });
});

export default router;
