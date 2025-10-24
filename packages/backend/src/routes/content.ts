/**
 * Content creation routes with image references
 */

import { Router, Request, Response } from 'express';
import { ClaudeService } from '../services/claude.js';
import { uploadToFirebaseStorage, saveToFirestore } from '../services/firebase.js';

const router = Router();

interface ImageReference {
  id: string;
  url: string;
  label: string;
  prompt: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Create content with image references
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      contentType,
      imageReferences,
      conversationHistory,
      targetProject
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required'
      });
    }

    const claudeService: ClaudeService = req.app.locals.claude;
    const images: ImageReference[] = imageReferences || [];

    // Build system prompt based on content type
    let systemPrompt = '';
    let outputFormat = '';

    switch (contentType) {
      case 'html-reveal':
        systemPrompt = `You are an expert at creating interactive Reveal.js presentations.
Generate complete, ready-to-use HTML presentations with beautiful styling and smooth transitions.
Include the referenced images in appropriate slides.`;
        outputFormat = 'HTML with Reveal.js';
        break;

      case 'remotion-video':
        systemPrompt = `You are an expert at creating Remotion video compositions.
Generate React/TypeScript code for Remotion that creates engaging videos with animations.
Include the referenced images in the video timeline.`;
        outputFormat = 'Remotion React/TypeScript code';
        break;

      case 'plain-html':
        systemPrompt = `You are an expert at creating clean, semantic HTML documents.
Generate well-structured HTML with modern CSS styling.
Include the referenced images in appropriate locations.`;
        outputFormat = 'Plain HTML';
        break;

      case 'annotation':
        systemPrompt = `You are an expert at creating interactive annotation tools.
Generate HTML with annotation capabilities for the referenced images.
Include drawing, text, and markup features.`;
        outputFormat = 'Interactive HTML with annotation tools';
        break;

      default:
        systemPrompt = 'You are a helpful AI assistant for content creation.';
        outputFormat = 'HTML';
    }

    // Build user prompt with image references
    let fullPrompt = prompt;

    if (images.length > 0) {
      fullPrompt += '\n\n**Referenced Images:**\n';
      images.forEach((img, index) => {
        fullPrompt += `\n${index + 1}. "${img.label}" (${img.url})`;
        if (img.prompt) {
          fullPrompt += `\n   Context: ${img.prompt}`;
        }
      });
      fullPrompt += '\n\nPlease incorporate these images into the content you create.';
    }

    // Build messages array
    const messages: Message[] = [
      ...(conversationHistory || []),
      {
        role: 'user',
        content: fullPrompt
      }
    ];

    // Generate content with Claude
    const response = await claudeService.generateContent(messages, {
      systemPrompt,
      maxTokens: 4000
    });

    let generatedContent = response.content;

    // Extract HTML/code if wrapped in markdown code blocks
    const codeBlockMatch = generatedContent.match(/```(?:html|javascript|typescript|jsx|tsx)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      generatedContent = codeBlockMatch[1];
    }

    // Save to Firebase Storage if target project specified
    let contentUrl: string | undefined;
    if (targetProject && generatedContent) {
      const timestamp = Date.now();
      const extension = contentType === 'remotion-video' ? 'tsx' : 'html';
      const buffer = Buffer.from(generatedContent, 'utf-8');

      contentUrl = await uploadToFirebaseStorage(
        targetProject,
        buffer,
        `content/${contentType}-${timestamp}.${extension}`,
        extension === 'html' ? 'text/html' : 'text/plain'
      );

      // Save metadata
      await saveToFirestore(targetProject, 'generated_content', {
        type: contentType,
        prompt,
        imageReferences: images.map(img => ({
          id: img.id,
          label: img.label
        })),
        url: contentUrl,
        createdAt: new Date().toISOString()
      });
    }

    res.json({
      message: response.text || 'Content generated successfully!',
      artifact: {
        type: outputFormat,
        url: contentUrl,
        content: generatedContent
      },
      usage: response.usage
    });

  } catch (error: any) {
    console.error('Content creation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Create course with multiple chapters
 */
router.post('/create-course', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      chapters,
      thumbnailImageId,
      imageReferences,
      targetProject
    } = req.body;

    if (!title || !chapters || !Array.isArray(chapters)) {
      return res.status(400).json({
        error: 'Title and chapters array are required'
      });
    }

    const claudeService: ClaudeService = req.app.locals.claude;

    // Generate course structure
    const coursePrompt = `Create a comprehensive course with the following details:

Title: ${title}
Description: ${description || 'Not provided'}

Chapters:
${chapters.map((ch: any, i: number) => `${i + 1}. ${ch.title}: ${ch.description || ''}`).join('\n')}

${imageReferences?.length ? `Referenced Images:\n${imageReferences.map((img: ImageReference, i: number) =>
  `${i + 1}. "${img.label}" (${img.url})`).join('\n')}` : ''}

Please create a structured course outline with detailed content for each chapter.
Format the output as HTML with a table of contents and proper styling.`;

    const response = await claudeService.generateContent([
      { role: 'user', content: coursePrompt }
    ], {
      systemPrompt: 'You are an expert course designer and educator.',
      maxTokens: 8000
    });

    let courseHtml = response.content;

    // Extract HTML if wrapped
    const codeBlockMatch = courseHtml.match(/```html\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      courseHtml = codeBlockMatch[1];
    }

    // Save to Firebase if target project specified
    let courseUrl: string | undefined;
    if (targetProject) {
      const timestamp = Date.now();
      const buffer = Buffer.from(courseHtml, 'utf-8');

      courseUrl = await uploadToFirebaseStorage(
        targetProject,
        buffer,
        `courses/${title.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.html`,
        'text/html'
      );

      await saveToFirestore(targetProject, 'courses', {
        title,
        description,
        chapters: chapters.map((ch: any) => ({
          title: ch.title,
          description: ch.description
        })),
        thumbnailImageId,
        url: courseUrl,
        createdAt: new Date().toISOString()
      });
    }

    res.json({
      message: 'Course created successfully!',
      artifact: {
        type: 'Course',
        url: courseUrl,
        content: courseHtml
      },
      chapters: chapters.length
    });

  } catch (error: any) {
    console.error('Course creation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
