/**
 * Voice Generation Routes
 * Generates speech using ElevenLabs TTS
 */

import express, { Request, Response } from 'express';
import { VoiceCloning } from '../services/voice-cloning.js';

const router = express.Router();

// Lazy initialization of VoiceCloning service
let voiceService: VoiceCloning | null = null;

function getVoiceService(): VoiceCloning {
  if (!voiceService) {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not configured in environment variables');
    }
    voiceService = new VoiceCloning(process.env.ELEVENLABS_API_KEY);
  }
  return voiceService;
}

/**
 * POST /api/voice/generate
 * Generate speech from text using specified voice
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      text,
      voiceId = 'gYWKdgLtqjPO3D5uDrDP', // Default to user's specified voice
      stability = 0.5,
      similarityBoost = 0.75,
      style = 0,
      speakerBoost = true
    } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    console.log(`🎙️ Generating speech with voice: ${voiceId}`);
    console.log(`📝 Text: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);

    // Generate audio
    const service = getVoiceService();
    const audioBuffer = await service.generateSpeech({
      text,
      voiceId,
      stability,
      similarityBoost,
      style,
      speakerBoost
    });

    // Set headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Send audio buffer
    res.send(audioBuffer);

  } catch (error: any) {
    console.error('Voice generation error:', error);
    res.status(500).json({
      error: 'Failed to generate speech',
      message: error.message
    });
  }
});

/**
 * POST /api/voice/generate-batch
 * Generate multiple audio files for a lesson
 */
router.post('/generate-batch', async (req: Request, res: Response) => {
  try {
    const {
      steps, // Array of { text, voiceId? }
      voiceId = 'gYWKdgLtqjPO3D5uDrDP'
    } = req.body;

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({
        error: 'Steps array is required'
      });
    }

    console.log(`🎙️ Generating ${steps.length} audio clips`);

    const audioFiles: { index: number; audio: string }[] = [];
    const service = getVoiceService();

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepVoiceId = step.voiceId || voiceId;

      console.log(`  [${i + 1}/${steps.length}] Generating audio for: "${step.text.substring(0, 50)}..."`);

      const audioBuffer = await service.generateSpeech({
        text: step.text,
        voiceId: stepVoiceId,
        stability: 0.5,
        similarityBoost: 0.75
      });

      // Convert to base64 for JSON response
      const base64Audio = audioBuffer.toString('base64');

      audioFiles.push({
        index: i,
        audio: `data:audio/mpeg;base64,${base64Audio}`
      });
    }

    res.json({
      success: true,
      audioFiles,
      count: audioFiles.length
    });

  } catch (error: any) {
    console.error('Batch voice generation error:', error);
    res.status(500).json({
      error: 'Failed to generate batch speech',
      message: error.message
    });
  }
});

/**
 * GET /api/voice/list
 * List available voices
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const service = getVoiceService();
    const voices = await service.listVoices();

    res.json({
      success: true,
      voices,
      count: voices.length
    });

  } catch (error: any) {
    console.error('Voice list error:', error);
    res.status(500).json({
      error: 'Failed to list voices',
      message: error.message
    });
  }
});

export default router;
