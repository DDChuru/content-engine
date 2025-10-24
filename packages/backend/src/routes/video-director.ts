/**
 * Video Director Agent
 * Conversational AI agent that interviews users and generates onboarding videos
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
import { videoRenderer } from '../services/video-renderer.js';
import multer from 'multer';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parseBuffer } from 'music-metadata';

const router = express.Router();
const upload = multer({ dest: 'temp/audio/' });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Session storage (in-memory for now, could use Redis in production)
interface Session {
  id: string;
  myCompany: string;
  clientCompany: string;
  myCompanyContext?: string;
  clientContext?: string;
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }>;
  storyboard?: any;
  readyToGenerate: boolean;
  createdAt: Date;
}

const sessions = new Map<string, Session>();

/**
 * Extract JSON from Claude's response (handles markdown code blocks)
 */
function extractJSON(text: string): string {
  // Remove markdown code blocks if present
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  return text.trim();
}

/**
 * POST /api/video-director/research
 * Research both companies and create context
 */
router.post('/research', async (req: Request, res: Response) => {
  try {
    const { myCompany, clientCompany } = req.body;

    if (!myCompany || !clientCompany) {
      return res.status(400).json({
        error: 'Both myCompany and clientCompany are required'
      });
    }

    console.log(`🔍 Researching: ${myCompany} and ${clientCompany}`);

    // Create session
    const sessionId = crypto.randomBytes(16).toString('hex');
    const session: Session = {
      id: sessionId,
      myCompany,
      clientCompany,
      conversationHistory: [],
      readyToGenerate: false,
      createdAt: new Date()
    };

    // Web search both companies (using Claude with web search would be ideal)
    // For now, we'll use Claude to generate intelligent questions based on company names
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);

    const researchPrompt = `You are researching two companies for a video production project:

MY COMPANY: ${myCompany}
CLIENT COMPANY: ${clientCompany}

Based on typical business patterns and these company names, provide:
1. What ${myCompany} likely does (industry, services)
2. What ${clientCompany} likely does (industry, potential needs)
3. Why they might be a good match
4. Key topics to cover in an onboarding video

Be specific but acknowledge this is initial research that will be refined through conversation.

Format your response as JSON:
{
  "myCompanyContext": "...",
  "clientContext": "...",
  "matchAnalysis": "...",
  "suggestedTopics": ["topic1", "topic2", ...]
}`;

    const response = await claudeService.sendMessage([
      { role: 'user', content: researchPrompt }
    ], undefined, 'You are a business research analyst helping prepare for a video production project.');

    const researchData = JSON.parse(extractJSON(response.content[0].text));

    session.myCompanyContext = researchData.myCompanyContext;
    session.clientContext = researchData.clientContext;

    sessions.set(sessionId, session);

    console.log(`✅ Research complete for session: ${sessionId}`);

    res.json({
      sessionId,
      myCompanyContext: researchData.myCompanyContext,
      clientContext: researchData.clientContext,
      matchAnalysis: researchData.matchAnalysis,
      suggestedTopics: researchData.suggestedTopics,
      message: `Great! I can see ${myCompany} and ${clientCompany}. Let's create an amazing onboarding video. What key messages do you want to emphasize?`
    });

  } catch (error: any) {
    console.error('Research error:', error);
    res.status(500).json({
      error: 'Research failed',
      details: error.message
    });
  }
});

/**
 * POST /api/video-director/transcribe
 * Transcribe audio using Whisper
 */
router.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    console.log(`🎤 Transcribing audio: ${audioFile.originalname}`);

    // Transcribe with Whisper
    // Read file and use toFile for proper formatting
    const audioBuffer = await fs.readFile(audioFile.path);
    const transcription = await openai.audio.transcriptions.create({
      file: await OpenAI.toFile(audioBuffer, audioFile.originalname || 'audio.webm'),
      model: 'whisper-1',
      language: 'en'
    });

    // Clean up temp file
    await fs.unlink(audioFile.path);

    console.log(`✅ Transcription: "${transcription.text}"`);

    res.json({
      text: transcription.text
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: 'Transcription failed',
      details: error.message
    });
  }
});

/**
 * POST /api/video-director/synthesize
 * Convert text to speech
 */
router.post('/synthesize', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'alloy' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log(`🔊 Synthesizing speech: "${text.substring(0, 50)}..."`);

    // Generate speech
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as any,
      input: text,
      speed: 1.0
    });

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Send as audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(buffer);

  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({
      error: 'TTS failed',
      details: error.message
    });
  }
});

/**
 * POST /api/video-director/interview
 * Conversational interview with the agent
 */
router.post('/interview', async (req: Request, res: Response) => {
  try {
    const { sessionId, userMessage } = req.body;

    if (!sessionId || !userMessage) {
      return res.status(400).json({
        error: 'sessionId and userMessage are required'
      });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log(`💬 Interview [${sessionId}]: User said: "${userMessage}"`);

    // Add user message to history
    session.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    // Build system prompt with context
    const systemPrompt = `You are a professional video director assistant helping create a client onboarding video.

CONTEXT:
- My Company: ${session.myCompany}
  ${session.myCompanyContext}

- Client Company: ${session.clientCompany}
  ${session.clientContext}

YOUR ROLE:
- Ask intelligent follow-up questions to understand what they want in the video
- Reference the company contexts to ask relevant questions
- Suggest topics they might have forgotten (support, timeline, benefits, etc.)
- Keep the conversation natural and helpful
- When you have enough information, suggest we're ready to generate

CONVERSATION GUIDELINES:
- Be concise but friendly
- Ask 1-2 questions at a time max
- Build on what they've already said
- Watch for when they're done covering topics (then suggest generating)

Current conversation so far has covered: ${session.conversationHistory.length / 2} exchanges.
After 3-4 exchanges with good coverage, suggest you're ready to generate the video.`;

    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);

    // Get Claude's response
    const response = await claudeService.sendMessage(
      session.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      undefined,
      systemPrompt
    );

    const agentMessage = response.content[0].text;

    // Add assistant response to history
    session.conversationHistory.push({
      role: 'assistant',
      content: agentMessage
    });

    // Check if ready to generate (look for keywords in agent's response)
    const readyKeywords = ['ready to generate', 'shall we create', 'let\'s build', 'generate the video'];
    const seemsReady = readyKeywords.some(keyword => agentMessage.toLowerCase().includes(keyword));

    if (seemsReady && session.conversationHistory.length >= 6) {
      session.readyToGenerate = true;
    }

    sessions.set(sessionId, session);

    console.log(`🤖 Agent response: "${agentMessage.substring(0, 100)}..."`);
    console.log(`📊 Ready to generate: ${session.readyToGenerate}`);

    res.json({
      agentMessage,
      readyToGenerate: session.readyToGenerate,
      conversationLength: session.conversationHistory.length
    });

  } catch (error: any) {
    console.error('Interview error:', error);
    res.status(500).json({
      error: 'Interview failed',
      details: error.message
    });
  }
});

/**
 * POST /api/video-director/generate
 * Generate the video based on conversation
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log(`🎬 Generating video for session: ${sessionId}`);

    // Step 1: Generate storyboard from conversation
    const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);

    const storyboardPrompt = `Based on this conversation about creating a client onboarding video, generate a detailed storyboard.

COMPANIES:
- Provider: ${session.myCompany}
- Client: ${session.clientCompany}

CONVERSATION:
${session.conversationHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n')}

Generate a storyboard as JSON with this structure:
{
  "title": "Video title",
  "totalDuration": 120,
  "scenes": [
    {
      "id": 1,
      "title": "Scene title",
      "duration": 15,
      "narration": "What to say in this scene",
      "visualDescription": "What visual to generate",
      "visualType": "company_image" | "diagram" | "feature_highlight" | "team" | "logo"
    }
  ],
  "presenterScript": "Full script for the presenter to read",
  "imagePrompts": ["prompt1", "prompt2", ...]
}

Keep it professional, engaging, and around 2-3 minutes total.`;

    const storyboardResponse = await claudeService.sendMessage([
      { role: 'user', content: storyboardPrompt }
    ], undefined, 'You are a professional video production storyboard artist.');

    const storyboard = JSON.parse(extractJSON(storyboardResponse.content[0].text));
    session.storyboard = storyboard;
    sessions.set(sessionId, session);

    console.log(`✅ Storyboard generated: ${storyboard.scenes.length} scenes`);

    // Save storyboard to file
    const outputDir = path.join(process.cwd(), 'output', 'storyboards');
    await fs.mkdir(outputDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `${session.myCompany.replace(/\s+/g, '-')}_${session.clientCompany.replace(/\s+/g, '-')}_${timestamp}.json`;
    const filepath = path.join(outputDir, filename);

    await fs.writeFile(filepath, JSON.stringify({
      sessionId: session.id,
      myCompany: session.myCompany,
      clientCompany: session.clientCompany,
      conversation: session.conversationHistory,
      storyboard,
      generatedAt: new Date().toISOString()
    }, null, 2));

    console.log(`💾 Storyboard saved to: ${filepath}`);

    // Step 2: Generate images for each scene (placeholder for now)
    // In full implementation, this would call Gemini for each scene

    // Step 3: Generate video (placeholder for now)
    // In full implementation, this would create Remotion composition and render

    res.json({
      success: true,
      storyboard,
      savedTo: filepath,
      message: 'Storyboard generated! Image generation and video assembly would happen next.',
      nextSteps: [
        'Generate images with Gemini',
        'Create Remotion composition',
        'Render video',
        'Provide download link'
      ]
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: 'Generation failed',
      details: error.message
    });
  }
});

/**
 * POST /api/video-director/generate-images
 * Generate images for all scenes in the storyboard
 */
router.post('/generate-images', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = sessions.get(sessionId);
    if (!session || !session.storyboard) {
      return res.status(404).json({ error: 'Session or storyboard not found' });
    }

    console.log(`🎨 Generating images for session: ${sessionId}`);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image'
    });

    // Create output directory for this session
    const imagesDir = path.join(process.cwd(), 'output', 'images', sessionId);
    await fs.mkdir(imagesDir, { recursive: true });

    const scenes = session.storyboard.scenes;
    const imageResults = [];

    // Generate images for each scene in parallel (with rate limiting)
    const BATCH_SIZE = 3; // Generate 3 at a time to avoid rate limits

    for (let i = 0; i < scenes.length; i += BATCH_SIZE) {
      const batch = scenes.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map(async (scene: any) => {
        try {
          console.log(`🖼️  Generating image for Scene ${scene.id}: ${scene.title}`);

          // Enhanced prompt using Gemini best practices
          // Key: Describe the scene narratively, don't just list keywords
          const enhancedPrompt = `Create a professional, photorealistic image for a business presentation video.

Scene Context: ${scene.narration}

Visual Scene Description:
${scene.visualDescription}

This image is for ${scene.title} in a presentation from ${session.myCompany} to ${session.clientCompany}.

Style and Composition:
- Photorealistic, high-quality business presentation aesthetic
- Clean, modern, corporate environment
- Professional lighting: soft, even illumination that highlights key elements without harsh shadows
- Composition: Well-balanced, with clear focal points that support the narrative
- Color palette: Professional and sophisticated - blues, whites, subtle gradients that convey trust and expertise
- Depth: Subtle depth of field to create visual interest while maintaining clarity
- Mood: Confident, trustworthy, innovative, and solution-oriented

Technical Details:
- Sharp focus on main subjects
- High resolution suitable for video production
- No watermarks or text overlays
- Appropriate for business-to-business communication`;

          const result = await model.generateContent({
            contents: [{
              role: 'user',
              parts: [{ text: enhancedPrompt }]
            }]
          });

          const response = result.response;

          // Extract base64 image from response
          if (!response.candidates || response.candidates.length === 0) {
            throw new Error('No image generated');
          }

          const candidate = response.candidates[0];
          if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            throw new Error('No content in response');
          }

          const imagePart = candidate.content.parts.find((part: any) => part.inlineData);
          if (!imagePart || !imagePart.inlineData) {
            throw new Error('No image data in response');
          }

          // Save image to file
          const filename = `scene-${String(scene.id).padStart(2, '0')}.png`;
          const filepath = path.join(imagesDir, filename);

          const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
          await fs.writeFile(filepath, imageBuffer);

          console.log(`✅ Scene ${scene.id} image saved: ${filename}`);

          return {
            sceneId: scene.id,
            sceneTitle: scene.title,
            filename,
            filepath,
            size: imageBuffer.length,
            success: true
          };
        } catch (error: any) {
          console.error(`❌ Scene ${scene.id} failed:`, error.message);
          return {
            sceneId: scene.id,
            sceneTitle: scene.title,
            success: false,
            error: error.message
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      imageResults.push(...batchResults);

      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < scenes.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successCount = imageResults.filter(r => r.success).length;
    const failureCount = imageResults.filter(r => !r.success).length;

    console.log(`🎨 Image generation complete: ${successCount} success, ${failureCount} failed`);

    res.json({
      success: true,
      sessionId,
      imagesDir,
      totalScenes: scenes.length,
      successCount,
      failureCount,
      images: imageResults
    });

  } catch (error: any) {
    console.error('Image generation error:', error);
    res.status(500).json({
      error: 'Image generation failed',
      details: error.message
    });
  }
});

/**
 * POST /api/video-director/generate-narration
 * Generate audio narration for all scenes using OpenAI TTS
 */
router.post('/generate-narration', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = sessions.get(sessionId);
    if (!session || !session.storyboard) {
      return res.status(404).json({ error: 'Session or storyboard not found' });
    }

    console.log(`🎙️  Generating narration audio for session: ${sessionId}`);

    // Create output directory for audio files
    const audioDir = path.join(process.cwd(), 'output', 'audio', sessionId);
    await fs.mkdir(audioDir, { recursive: true });

    const scenes = session.storyboard.scenes;
    const audioResults = [];

    // Generate audio for each scene
    for (const scene of scenes) {
      try {
        console.log(`🎤 Generating audio for Scene ${scene.id}: ${scene.title}`);

        // Use OpenAI TTS to generate speech
        const mp3 = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'alloy', // Professional, neutral voice
          input: scene.narration,
          speed: 1.0
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());

        // Save audio file
        const filename = `scene-${String(scene.id).padStart(2, '0')}.mp3`;
        const filepath = path.join(audioDir, filename);
        await fs.writeFile(filepath, buffer);

        console.log(`✅ Scene ${scene.id} audio saved: ${filename}`);

        audioResults.push({
          sceneId: scene.id,
          sceneTitle: scene.title,
          filename,
          filepath,
          size: buffer.length,
          duration: scene.duration,
          success: true
        });
      } catch (error: any) {
        console.error(`❌ Scene ${scene.id} audio failed:`, error.message);
        audioResults.push({
          sceneId: scene.id,
          sceneTitle: scene.title,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = audioResults.filter(r => r.success).length;
    const failureCount = audioResults.filter(r => !r.success).length;

    console.log(`🎙️  Narration generation complete: ${successCount} success, ${failureCount} failed`);

    res.json({
      success: true,
      sessionId,
      audioDir,
      totalScenes: scenes.length,
      successCount,
      failureCount,
      audio: audioResults
    });

  } catch (error: any) {
    console.error('Narration generation error:', error);
    res.status(500).json({
      error: 'Narration generation failed',
      details: error.message
    });
  }
});

/**
 * POST /api/video-director/render-video
 * Render the final video using Remotion (AUTOMATED)
 */
router.post('/render-video', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = sessions.get(sessionId);
    if (!session || !session.storyboard) {
      return res.status(404).json({ error: 'Session or storyboard not found' });
    }

    console.log(`🎬 Starting automated video render for session: ${sessionId}`);

    // Check that images and audio exist
    const imagesDir = path.join(process.cwd(), 'output', 'images', sessionId);
    const audioDir = path.join(process.cwd(), 'output', 'audio', sessionId);

    const imagesExist = fsSync.existsSync(imagesDir);
    const audioExists = fsSync.existsSync(audioDir);

    if (!imagesExist) {
      return res.status(400).json({
        error: 'Images not found. Please generate images first.',
        imagesDir
      });
    }

    if (!audioExists) {
      return res.status(400).json({
        error: 'Audio narration not found. Please generate narration first.',
        audioDir
      });
    }

    // Copy assets to Remotion public folder for staticFile() access
    const remotionPublicDir = path.join(process.cwd(), 'src', 'remotion', 'public', sessionId);
    await fs.mkdir(path.join(remotionPublicDir, 'images'), { recursive: true });
    await fs.mkdir(path.join(remotionPublicDir, 'audio'), { recursive: true });

    // Copy all images and audio files
    for (const scene of session.storyboard.scenes) {
      const imageFilename = `scene-${String(scene.id).padStart(2, '0')}.png`;
      const audioFilename = `scene-${String(scene.id).padStart(2, '0')}.mp3`;

      await fs.copyFile(
        path.join(imagesDir, imageFilename),
        path.join(remotionPublicDir, 'images', imageFilename)
      );
      await fs.copyFile(
        path.join(audioDir, audioFilename),
        path.join(remotionPublicDir, 'audio', audioFilename)
      );
    }

    // Prepare scene data with relative paths for staticFile()
    const scenes = session.storyboard.scenes.map((scene: any) => ({
      ...scene,
      imagePath: `${sessionId}/images/scene-${String(scene.id).padStart(2, '0')}.png`,
      audioPath: `${sessionId}/audio/scene-${String(scene.id).padStart(2, '0')}.mp3`
    }));

    // Create output directory for videos
    const videosDir = path.join(process.cwd(), 'output', 'videos');
    await fs.mkdir(videosDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const outputFilename = `${session.myCompany.replace(/\s+/g, '-')}_${session.clientCompany.replace(/\s+/g, '-')}_${timestamp}.mp4`;
    const outputPath = path.join(videosDir, outputFilename);

    // Estimate render time
    const estimatedTime = videoRenderer.estimateRenderTime(session.storyboard.totalDuration);
    console.log(`⏱️  Estimated render time: ${Math.round(estimatedTime / 60)} minutes`);

    // Start rendering (this will take a while!)
    console.log(`🎥 Starting Remotion render...`);
    console.log(`   Title: ${session.storyboard.title}`);
    console.log(`   Scenes: ${scenes.length}`);
    console.log(`   Duration: ${session.storyboard.totalDuration}s`);
    console.log(`   Output: ${outputPath}`);

    // Render the video with progress callback
    const videoPath = await videoRenderer.renderVideo({
      sessionId,
      title: session.storyboard.title,
      scenes,
      totalDuration: session.storyboard.totalDuration,
      outputPath
    }, (progress) => {
      console.log(`📊 ${progress.stage}: ${progress.message} (${Math.round(progress.progress)}%)`);
    });

    // Get file stats
    const stats = await fs.stat(videoPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`✅ Video rendering complete!`);
    console.log(`   File: ${videoPath}`);
    console.log(`   Size: ${fileSizeMB} MB`);

    res.json({
      success: true,
      sessionId,
      video: {
        path: videoPath,
        filename: outputFilename,
        size: stats.size,
        sizeMB: fileSizeMB,
        duration: session.storyboard.totalDuration,
        scenes: scenes.length,
        downloadUrl: `/api/video-director/download/${sessionId}/${outputFilename}`
      },
      message: 'Video rendered successfully!',
      renderTime: `~${Math.round(estimatedTime / 60)} minutes`
    });

  } catch (error: any) {
    console.error('Video rendering error:', error);
    res.status(500).json({
      error: 'Video rendering failed',
      details: error.message,
      stack: error.stack
    });
  }
});

/**
 * GET /api/video-director/download/:sessionId/:filename
 * Download the rendered video
 */
router.get('/download/:sessionId/:filename', async (req: Request, res: Response) => {
  try {
    const { sessionId, filename } = req.params;

    // Validate session exists
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Construct video path
    const videoPath = path.join(process.cwd(), 'output', 'videos', filename);

    // Check if file exists
    if (!fsSync.existsSync(videoPath)) {
      return res.status(404).json({
        error: 'Video file not found',
        path: videoPath
      });
    }

    // Get file stats
    const stats = await fs.stat(videoPath);

    console.log(`📥 Downloading video: ${filename} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);

    // Set headers for download
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size);

    // Stream the file
    const fileStream = fsSync.createReadStream(videoPath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      console.log(`✅ Download complete: ${filename}`);
    });

    fileStream.on('error', (error) => {
      console.error(`❌ Download error: ${error.message}`);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });

  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({
      error: 'Download failed',
      details: error.message
    });
  }
});

/**
 * POST /api/video-director/load-session
 * Load a session from storyboard JSON file
 */
router.post('/load-session', async (req: Request, res: Response) => {
  try {
    const { storyboard, myCompany, clientCompany, newTitle } = req.body;

    if (!storyboard) {
      return res.status(400).json({ error: 'storyboard is required' });
    }

    // Create new session ID
    const sessionId = crypto.randomBytes(16).toString('hex');

    // Update title if provided
    if (newTitle) {
      storyboard.title = newTitle;
    }

    // Create session
    const session: Session = {
      id: sessionId,
      myCompany: myCompany || storyboard.myCompany || 'Unknown Company',
      clientCompany: clientCompany || storyboard.clientCompany || 'Unknown Client',
      conversationHistory: [],
      storyboard: storyboard,
      readyToGenerate: true,
      createdAt: new Date()
    };

    sessions.set(sessionId, session);

    console.log(`✅ Session loaded: ${sessionId}`);
    console.log(`   Title: ${storyboard.title}`);
    console.log(`   Scenes: ${storyboard.scenes.length}`);
    console.log(`   My Company: ${session.myCompany}`);
    console.log(`   Client: ${session.clientCompany}`);

    res.json({
      success: true,
      sessionId,
      title: storyboard.title,
      myCompany: session.myCompany,
      clientCompany: session.clientCompany,
      scenes: storyboard.scenes.length,
      totalDuration: storyboard.totalDuration,
      message: 'Session loaded successfully. Ready to generate images and video.'
    });

  } catch (error: any) {
    console.error('Load session error:', error);
    res.status(500).json({
      error: 'Failed to load session',
      details: error.message
    });
  }
});

/**
 * GET /api/video-director/session/:sessionId
 * Get session details
 */
router.get('/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    sessionId: session.id,
    myCompany: session.myCompany,
    clientCompany: session.clientCompany,
    conversationLength: session.conversationHistory.length,
    readyToGenerate: session.readyToGenerate,
    hasStoryboard: !!session.storyboard
  });
});

/**
 * POST /api/video-director/render-complete
 * End-to-end video generation: storyboard → images → narration → video
 * This is the fully automated pipeline that takes a storyboard and produces a complete video
 */
router.post('/render-complete', async (req: Request, res: Response) => {
  try {
    const { storyboard, myCompany, clientCompany, videoStyle = 'gallery' } = req.body;

    if (!storyboard) {
      return res.status(400).json({ error: 'storyboard is required' });
    }

    if (!['gallery', 'presentation', 'hybrid'].includes(videoStyle)) {
      return res.status(400).json({ error: 'videoStyle must be one of: gallery, presentation, hybrid' });
    }

    console.log(`🚀 Starting end-to-end video generation`);
    console.log(`   Style: ${videoStyle}`);
    console.log(`   Company: ${myCompany}`);
    console.log(`   Client: ${clientCompany}`);

    // Step 1: Create session
    const sessionId = crypto.randomBytes(16).toString('hex');
    const session: Session = {
      id: sessionId,
      myCompany: myCompany || storyboard.myCompany || 'Unknown Company',
      clientCompany: clientCompany || storyboard.clientCompany || 'Unknown Client',
      conversationHistory: [],
      storyboard: storyboard,
      readyToGenerate: true,
      createdAt: new Date()
    };
    sessions.set(sessionId, session);

    console.log(`✅ Session created: ${sessionId}`);

    // Step 2: Generate images for all scenes
    console.log(`🎨 Step 1/3: Generating images...`);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image'
    });

    const imagesDir = path.join(process.cwd(), 'output', 'images', sessionId);
    await fs.mkdir(imagesDir, { recursive: true });

    const scenes = storyboard.scenes;
    const BATCH_SIZE = 3;

    for (let i = 0; i < scenes.length; i += BATCH_SIZE) {
      const batch = scenes.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map(async (scene: any) => {
        try {
          console.log(`🖼️  Generating image ${scene.id}/${scenes.length}: ${scene.title}`);

          const enhancedPrompt = `Create a professional, photorealistic image for a business presentation video.

Scene Context: ${scene.narration}

Visual Scene Description:
${scene.visualDescription}

This image is for ${scene.title} in a presentation from ${session.myCompany} to ${session.clientCompany}.

Style and Composition:
- Photorealistic, high-quality business presentation aesthetic
- Clean, modern, corporate environment
- Professional lighting: soft, even illumination that highlights key elements without harsh shadows
- Composition: Well-balanced, with clear focal points that support the narrative
- Color palette: Professional and sophisticated - blues, whites, subtle gradients that convey trust and expertise
- Depth: Subtle depth of field to create visual interest while maintaining clarity
- Mood: Confident, trustworthy, innovative, and solution-oriented

Technical Details:
- Sharp focus on main subjects
- High resolution suitable for video production
- No watermarks or text overlays
- Appropriate for business-to-business communication`;

          const result = await model.generateContent({
            contents: [{
              role: 'user',
              parts: [{ text: enhancedPrompt }]
            }]
          });

          const response = result.response;
          const imagePart = response.candidates![0].content.parts.find((part: any) => part.inlineData);
          if (!imagePart || !imagePart.inlineData) {
            throw new Error('No image data in response');
          }

          const filename = `scene-${String(scene.id).padStart(2, '0')}.png`;
          const filepath = path.join(imagesDir, filename);
          const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
          await fs.writeFile(filepath, imageBuffer);

          console.log(`✅ Image ${scene.id} saved`);
          return { sceneId: scene.id, success: true };
        } catch (error: any) {
          console.error(`❌ Image ${scene.id} failed:`, error.message);
          return { sceneId: scene.id, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);

      // Check for failures
      const failures = batchResults.filter(r => !r.success);
      if (failures.length > 0) {
        console.error(`❌ ${failures.length} image(s) failed to generate`);
        failures.forEach(f => console.error(`   Scene ${f.sceneId}: ${f.error}`));
      }

      if (i + BATCH_SIZE < scenes.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`✅ All images generated`);

    // Step 3: Generate narration audio for all scenes
    console.log(`🎙️  Step 2/3: Generating narration...`);
    const audioDir = path.join(process.cwd(), 'output', 'audio', sessionId);
    await fs.mkdir(audioDir, { recursive: true });

    for (const scene of scenes) {
      console.log(`🎤 Generating audio ${scene.id}/${scenes.length}: ${scene.title}`);

      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: scene.narration,
        speed: 1.0
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      const filename = `scene-${String(scene.id).padStart(2, '0')}.mp3`;
      const filepath = path.join(audioDir, filename);
      await fs.writeFile(filepath, buffer);

      // Measure actual audio duration
      try {
        const metadata = await parseBuffer(buffer, 'audio/mpeg');
        const actualDuration = metadata.format.duration || scene.duration;
        scene.duration = actualDuration;
        console.log(`✅ Audio ${scene.id} saved (${actualDuration.toFixed(2)}s)`);
      } catch (error) {
        console.warn(`⚠️  Could not read duration for scene ${scene.id}, using storyboard duration (${scene.duration}s)`);
      }
    }

    // Recalculate total duration based on actual audio lengths
    const actualTotalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
    console.log(`✅ All narration generated (Total duration: ${actualTotalDuration.toFixed(2)}s)`);

    // Step 4: Copy assets to Remotion public folder
    console.log(`📁 Preparing assets for Remotion...`);
    const remotionPublicDir = path.join(process.cwd(), 'src', 'remotion', 'public', sessionId);
    await fs.mkdir(path.join(remotionPublicDir, 'images'), { recursive: true });
    await fs.mkdir(path.join(remotionPublicDir, 'audio'), { recursive: true });

    for (const scene of scenes) {
      const imageFilename = `scene-${String(scene.id).padStart(2, '0')}.png`;
      const audioFilename = `scene-${String(scene.id).padStart(2, '0')}.mp3`;

      const imageSrc = path.join(imagesDir, imageFilename);
      const audioSrc = path.join(audioDir, audioFilename);

      // Check if files exist before copying
      try {
        await fs.access(imageSrc);
        await fs.copyFile(
          imageSrc,
          path.join(remotionPublicDir, 'images', imageFilename)
        );
      } catch (error: any) {
        console.error(`⚠️  Skipping missing image for scene ${scene.id}: ${imageFilename}`);
      }

      try {
        await fs.access(audioSrc);
        await fs.copyFile(
          audioSrc,
          path.join(remotionPublicDir, 'audio', audioFilename)
        );
      } catch (error: any) {
        console.error(`⚠️  Skipping missing audio for scene ${scene.id}: ${audioFilename}`);
      }
    }

    console.log(`✅ Assets copied to Remotion public folder`);

    // Step 5: Render video
    console.log(`🎥 Step 3/3: Rendering video...`);
    const scenesWithPaths = scenes.map((scene: any) => ({
      ...scene,
      imagePath: `${sessionId}/images/scene-${String(scene.id).padStart(2, '0')}.png`,
      audioPath: `${sessionId}/audio/scene-${String(scene.id).padStart(2, '0')}.mp3`,
      videoStyle
    }));

    const videosDir = path.join(process.cwd(), 'output', 'videos');
    await fs.mkdir(videosDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const outputFilename = `${session.myCompany.replace(/\s+/g, '-')}_${session.clientCompany.replace(/\s+/g, '-')}_${videoStyle}_${timestamp}.mp4`;
    const outputPath = path.join(videosDir, outputFilename);

    const videoPath = await videoRenderer.renderVideo({
      sessionId,
      title: storyboard.title,
      scenes: scenesWithPaths,
      totalDuration: actualTotalDuration,
      outputPath,
      videoStyle
    }, (progress) => {
      console.log(`📊 ${progress.stage}: ${Math.round(progress.progress)}%`);
    });

    const stats = await fs.stat(videoPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`✅ END-TO-END PIPELINE COMPLETE!`);
    console.log(`   Video: ${outputFilename}`);
    console.log(`   Size: ${fileSizeMB} MB`);

    res.json({
      success: true,
      sessionId,
      videoStyle,
      video: {
        path: videoPath,
        filename: outputFilename,
        size: stats.size,
        sizeMB: fileSizeMB,
        duration: storyboard.totalDuration,
        scenes: scenes.length,
        downloadUrl: `/api/video-director/download/${sessionId}/${outputFilename}`
      },
      message: 'End-to-end video generation complete!',
      pipeline: {
        images: `${scenes.length} images generated`,
        audio: `${scenes.length} narrations generated`,
        video: `${videoStyle} style video rendered`
      }
    });

  } catch (error: any) {
    console.error('❌ End-to-end pipeline failed:', error);
    res.status(500).json({
      error: 'End-to-end pipeline failed',
      details: error.message,
      stack: error.stack
    });
  }
});

export default router;
