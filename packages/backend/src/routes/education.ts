import express from 'express';
import EducationalVideoGenerator, { Module, VideoScript, Concept } from '../agents/education/video-generator';
import FFmpegVideoCombiner from '../services/ffmpeg-video-combiner.js';
import { ClaudeService } from '../services/claude.js';
import { EducationalVizAgent } from '../agents/educational-viz-agent.js';
import type { EducationalVisualizationRequest } from '../agents/educational-viz-agent.js';
import { EducationFirestoreService } from '../services/education-firestore.js';
import type { ContentStatus, TopicLevel, LessonContent, TopicAsset } from '../services/education-firestore.js';
import multer from 'multer';
import { execSync } from 'child_process';
import fs from 'fs/promises';

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Lazy-initialize generator (wait for env vars to be loaded)
let generatorInstance: EducationalVideoGenerator | null = null;

function getGenerator(): EducationalVideoGenerator {
  if (!generatorInstance) {
    generatorInstance = new EducationalVideoGenerator(
      process.env.GEMINI_API_KEY || '',
      process.env.ELEVENLABS_API_KEY || ''
    );
  }
  return generatorInstance;
}

/**
 * POST /api/education/test-manim
 * Test Manim rendering with a simple circle theorem
 */
router.post('/test-manim', async (req, res) => {
  try {
    console.log('🧪 Testing Manim rendering...');

    const concept: Concept = {
      name: 'Angle at Centre Theorem',
      description: 'The angle at the centre is twice the angle at the circumference',
      type: 'theorem',
      metadata: {
        theorem: 'Angle at Centre',
        angle: 120
      }
    };

    // Generate Manim visual
    const visualPath = await (getGenerator() as any).generateManimVisual(concept);

    res.json({
      success: true,
      message: 'Manim test successful',
      videoPath: visualPath
    });
  } catch (error: any) {
    console.error('Manim test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/clone-voice
 * Clone user's voice from audio samples
 */
router.post('/clone-voice', upload.array('audio', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { name } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No audio files provided'
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    console.log(`🎤 Cloning voice: ${name}`);
    console.log(`   Files: ${files.length}`);

    // Convert to Buffers
    const audioBuffers = files.map(file => file.buffer);

    // Clone voice
    const voiceId = await getGenerator().cloneVoice(name, audioBuffers);

    res.json({
      success: true,
      voiceId,
      name,
      message: 'Voice cloned successfully'
    });
  } catch (error: any) {
    console.error('Voice cloning failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/voices
 * List all cloned voices
 */
router.get('/voices', async (req, res) => {
  try {
    const voices = await getGenerator().listVoices();

    res.json({
      success: true,
      voices
    });
  } catch (error: any) {
    console.error('Failed to list voices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/test-voice
 * Test a cloned voice
 */
router.post('/test-voice', async (req, res) => {
  try {
    const voiceId = req.body.voiceId || process.env.DEFAULT_VOICE_ID;

    if (!voiceId) {
      return res.status(400).json({
        success: false,
        error: 'voiceId is required (provide in request body or set DEFAULT_VOICE_ID in .env)'
      });
    }

    const audioBuffer = await getGenerator().testVoice(voiceId);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="test-voice.mp3"');
    res.send(audioBuffer);
  } catch (error: any) {
    console.error('Voice test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/generate-module
 * Generate complete educational module with Manim + Voice
 */
router.post('/generate-module', async (req, res) => {
  try {
    const { module } = req.body;
    const voiceId = req.body.voiceId || process.env.DEFAULT_VOICE_ID;

    if (!module) {
      return res.status(400).json({
        success: false,
        error: 'module data is required'
      });
    }

    if (!voiceId) {
      return res.status(400).json({
        success: false,
        error: 'voiceId is required (provide in request body or set DEFAULT_VOICE_ID in .env)'
      });
    }

    console.log(`\n🎓 Generating module: ${module.title}`);

    const result = await getGenerator().generateModuleVideo(module, voiceId);

    res.json({
      success: true,
      result: {
        scenes: result.scenes.length,
        duration: result.duration,
        cost: result.cost,
        sceneDetails: result.scenes.map(s => ({
          id: s.id,
          title: s.title,
          type: s.type,
          duration: s.duration
        }))
      },
      message: `Module generated successfully with ${result.scenes.length} scenes`
    });
  } catch (error: any) {
    console.error('Module generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/circle-theorem-demo
 * Demo: Generate complete Circle Theorem lesson
 */
router.post('/circle-theorem-demo', async (req, res) => {
  try {
    const voiceId = req.body.voiceId || process.env.DEFAULT_VOICE_ID;

    if (!voiceId) {
      return res.status(400).json({
        success: false,
        error: 'voiceId is required (provide in request body or set DEFAULT_VOICE_ID in .env)'
      });
    }

    console.log('\n🎓 Generating Circle Theorem Demo Lesson');

    // Create module for Angle at Centre theorem
    const module: Module = {
      id: 'circle-angle-at-centre',
      title: 'Circle Theorem: Angle at Centre',
      concepts: [
        {
          name: 'Introduction',
          description: 'Introduction to circle theorems',
          type: 'theorem',
          metadata: {}
        },
        {
          name: 'Angle at Centre Theorem',
          description: 'The angle at the centre is twice the angle at the circumference',
          type: 'theorem',
          metadata: {
            theorem: 'Angle at Centre',
            angle: 120
          }
        },
        {
          name: 'Worked Example',
          description: 'Solving problems with the angle at centre theorem',
          type: 'application',
          metadata: {
            theorem: 'Angle at Centre',
            angle: 100
          }
        }
      ],
      videoScript: {
        segments: [
          {
            title: 'Introduction',
            narration: 'Welcome to this lesson on circle theorems. Today we will learn about the angle at the centre theorem, one of the most important properties of circles in geometry.',
            duration: 10,
            visualType: 'gemini'
          },
          {
            title: 'Angle at Centre Theorem',
            narration: 'The angle at the centre theorem states that the angle subtended by an arc at the centre of a circle is exactly twice the angle subtended by the same arc at any point on the circumference. Watch carefully as we construct this relationship step by step.',
            duration: 25,
            visualType: 'manim'
          },
          {
            title: 'Worked Example',
            narration: 'Let\'s apply this theorem to solve a problem. If the angle at the centre is 100 degrees, what is the angle at the circumference? Using our theorem, we divide by 2 to get 50 degrees. This relationship always holds true for any arc of the circle.',
            duration: 20,
            visualType: 'manim'
          }
        ]
      }
    };

    const result = await getGenerator().generateModuleVideo(module, voiceId);

    res.json({
      success: true,
      result: {
        title: module.title,
        scenes: result.scenes.length,
        duration: result.duration,
        cost: result.cost,
        sceneDetails: result.scenes.map(s => ({
          id: s.id,
          title: s.title,
          type: s.type,
          visual: s.visual,
          audio: s.audio,
          duration: s.duration
        }))
      },
      message: 'Circle theorem demo generated successfully!'
    });
  } catch (error: any) {
    console.error('Demo generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/render-final-video
 * Render complete video from scenes using Remotion
 */
router.post('/render-final-video', async (req, res) => {
  try {
    const { scenes, outputFilename } = req.body;

    if (!scenes || !Array.isArray(scenes)) {
      return res.status(400).json({
        success: false,
        error: 'scenes array is required'
      });
    }

    console.log('\n🎥 Combining scenes with FFmpeg...');

    const videoCombiner = new FFmpegVideoCombiner();
    const finalVideoPath = await videoCombiner.combineScenesIntoFinalVideo({
      scenes,
      outputFilename
    });

    res.json({
      success: true,
      videoPath: finalVideoPath,
      message: 'Final video rendered successfully!'
    });
  } catch (error: any) {
    console.error('Final video rendering failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/circle-theorem-demo-complete
 * Generate complete Circle Theorem lesson WITH final video
 */
router.post('/circle-theorem-demo-complete', async (req, res) => {
  try {
    const voiceId = req.body.voiceId || process.env.DEFAULT_VOICE_ID;

    if (!voiceId) {
      return res.status(400).json({
        success: false,
        error: 'voiceId is required (provide in request body or set DEFAULT_VOICE_ID in .env)'
      });
    }

    console.log('\n🎓 Generating Circle Theorem Demo Lesson (WITH final video)');

    // Create module for Angle at Centre theorem
    const module: Module = {
      id: 'circle-angle-at-centre',
      title: 'Circle Theorem: Angle at Centre',
      concepts: [
        {
          name: 'Introduction',
          description: 'Introduction to circle theorems',
          type: 'theorem',
          metadata: {}
        },
        {
          name: 'Angle at Centre Theorem',
          description: 'The angle at the centre is twice the angle at the circumference',
          type: 'theorem',
          metadata: {
            theorem: 'Angle at Centre',
            angle: 120
          }
        },
        {
          name: 'Worked Example',
          description: 'Solving problems with the angle at centre theorem',
          type: 'application',
          metadata: {
            theorem: 'Angle at Centre',
            angle: 100
          }
        }
      ],
      videoScript: {
        segments: [
          {
            title: 'Introduction',
            narration: 'Welcome to this lesson on circle theorems. Today we will explore one of the most fundamental relationships in circle geometry - the angle at the centre theorem. This powerful theorem reveals a precise mathematical relationship between angles formed at different positions in a circle.',
            duration: 10,
            visualType: 'gemini'
          },
          {
            title: 'Angle at Centre Theorem',
            narration: 'The angle at the centre theorem states that the angle subtended by an arc at the centre of a circle is exactly twice the angle subtended by the same arc at any point on the circumference. Watch carefully as we construct this relationship step by step.',
            duration: 25,
            visualType: 'manim'
          },
          {
            title: 'Worked Example',
            narration: 'Let\'s apply this theorem to solve a problem. If the angle at the centre is 100 degrees, what is the angle at the circumference? Using our theorem, we divide by 2 to get 50 degrees. This relationship always holds true for any arc of the circle.',
            duration: 20,
            visualType: 'manim'
          }
        ]
      }
    };

    // Step 1: Generate all scenes
    console.log('📹 Step 1: Generating all scenes...');
    const result = await getGenerator().generateModuleVideo(module, voiceId);

    // Step 2: Combine scenes into final video with FFmpeg
    console.log('\n🎬 Step 2: Combining scenes into final video with FFmpeg...');
    const videoCombiner = new FFmpegVideoCombiner();
    const finalVideoPath = await videoCombiner.combineScenesIntoFinalVideo({
      scenes: result.scenes,
      outputFilename: `circle_theorem_${Date.now()}.mp4`
    });

    res.json({
      success: true,
      result: {
        title: module.title,
        scenes: result.scenes.length,
        duration: result.duration,
        cost: result.cost,
        finalVideo: finalVideoPath,
        sceneDetails: result.scenes.map(s => ({
          id: s.id,
          title: s.title,
          type: s.type,
          visual: s.visual,
          audio: s.audio,
          duration: s.duration
        }))
      },
      message: 'Circle theorem demo with final video generated successfully!'
    });
  } catch (error: any) {
    console.error('Complete demo generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/streamlined-lesson
 * Generate lesson with smooth thumbnail transition (1-2s thumbnail → bottom right)
 */
router.post('/streamlined-lesson', async (req, res) => {
  try {
    const voiceId = req.body.voiceId || process.env.DEFAULT_VOICE_ID;

    if (!voiceId) {
      return res.status(400).json({
        success: false,
        error: 'voiceId is required (provide in request body or set DEFAULT_VOICE_ID in .env)'
      });
    }

    console.log('\n🎓 Generating Streamlined Lesson with Thumbnail Transition');

    // Step 1: Generate Gemini thumbnail first
    console.log('🖼️  Generating thumbnail image...');
    const generator = getGenerator();
    const thumbnailConcept = {
      name: 'Circle Theorems',
      description: 'Visual representation of circle theorems with angles',
      type: 'theorem' as const,
      metadata: {}
    };

    const thumbnailResult = await (generator as any).generateGeminiVisual(thumbnailConcept);
    const thumbnailPath = thumbnailResult.path;
    console.log(`✅ Thumbnail ready: ${thumbnailPath}`);

    // Step 2: Generate scenes using new templates
    const scenes: Scene[] = [];
    let totalCost = thumbnailResult.cost;

    // Scene 1: Introduction with thumbnail transition
    console.log('\n📹 Scene 1: Introduction with thumbnail transition');

    // AUDIO FIRST - Light conversational intro while thumbnail shows
    const introNarration = 'Hey there! Welcome to this quick lesson on circle theorems. Now, the angle at the centre theorem is one of those topics that comes up all the time in GCSE higher papers, so it\'s definitely worth knowing. In the next couple of minutes, we\'ll look at how angles at the centre and circumference are connected. Ready? Let\'s dive in.';

    // Generate audio FIRST
    const introAudioPath = await (generator as any).generateNarration(
      introNarration,
      voiceId,
      'scene_1.mp3'
    );

    // Get ACTUAL audio duration
    const introAudioDuration = parseFloat(
      execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${introAudioPath}"`).toString().trim()
    );
    console.log(`   Audio duration: ${introAudioDuration}s`);

    // Generate Manim to MATCH audio duration
    const introScene: ManimScene = {
      sceneType: 'intro_with_thumbnail',
      concept: 'Introduction',
      parameters: {
        title: 'Circle Theorem: Angle at Centre',
        thumbnailPath: thumbnailPath,
        examRelevance: 'Popular GCSE Higher Topic',
        difficulty: 'higher',
        targetDuration: introAudioDuration  // Pass audio duration to Manim
      }
    };

    const introVideoPath = await generator['manimRenderer'].renderAnimation(introScene, 'low');

    scenes.push({
      id: 1,
      title: 'Introduction',
      visual: introVideoPath,
      audio: introAudioPath,
      duration: introAudioDuration,
      type: 'manim'
    });

    totalCost += (introNarration.length / 1000) * 0.30;

    // Scene 2: Theory proof
    console.log('\n📹 Scene 2: Theory proof');
    const theoryNarration = 'Alright, let\'s get into the theorem itself. The angle at the centre theorem says that the angle subtended by an arc at the centre of a circle is exactly twice the angle subtended by the same arc at any point on the circumference. Watch as we build this up step by step. We\'ll draw the circle, mark our centre point, add some points on the edge, and then you\'ll see how the centre angle and the circumference angle relate. The ratio is always two to one, every single time.';

    // Generate audio FIRST
    const theoryAudioPath = await (generator as any).generateNarration(
      theoryNarration,
      voiceId,
      'scene_2.mp3'
    );

    // Get ACTUAL audio duration
    const theoryAudioDuration = parseFloat(
      execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${theoryAudioPath}"`).toString().trim()
    );
    console.log(`   Audio duration: ${theoryAudioDuration}s`);

    // Generate Manim to MATCH audio duration
    const theoryScene: ManimScene = {
      sceneType: 'theory',
      concept: 'Theory',
      parameters: {
        title: 'The Theorem',
        theorem: 'Angle at Centre',
        angle: 120,
        targetDuration: theoryAudioDuration
      }
    };

    const theoryVideoPath = await generator['manimRenderer'].renderAnimation(theoryScene, 'low');

    scenes.push({
      id: 2,
      title: 'Theory',
      visual: theoryVideoPath,
      audio: theoryAudioPath,
      duration: theoryAudioDuration,
      type: 'manim'
    });

    totalCost += (theoryNarration.length / 1000) * 0.30;

    // Scene 3: Worked example
    console.log('\n📹 Scene 3: Worked example');
    const exampleNarration = 'Alright, here\'s your challenge question. O is the centre, A, B, C are on the circumference, and angle AOB is 100 degrees. Your task: find angle ACB. Take a moment to think about it. How would you tackle this? Right, let me show you. First, let\'s sketch the diagram. Here\'s our circle with centre O. We\'ll mark points A, B, and C. Draw the lines from O to A and B, that\'s our angle at the centre, 100 degrees. Now from C to A and B, that\'s the angle we need to find. Step one: apply the theorem. Angle at centre equals two times angle at circumference. Step two: substitute. 100 equals 2 times angle ACB. Rearrange. Angle ACB equals 100 divided by 2. That gives us 50 degrees. Perfect! Notice how the diagram and the calculation work together. That\'s your answer.';

    // Generate audio FIRST
    const exampleAudioPath = await (generator as any).generateNarration(
      exampleNarration,
      voiceId,
      'scene_3.mp3'
    );

    // Get ACTUAL audio duration
    const exampleAudioDuration = parseFloat(
      execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${exampleAudioPath}"`).toString().trim()
    );
    console.log(`   Audio duration: ${exampleAudioDuration}s`);

    // Generate Manim to MATCH audio duration
    const exampleScene: ManimScene = {
      sceneType: 'worked_example',
      concept: 'Worked Example',
      parameters: {
        title: 'Worked Example',
        givenAngle: 100,
        targetDuration: exampleAudioDuration
      }
    };

    const exampleVideoPath = await generator['manimRenderer'].renderAnimation(exampleScene, 'low');

    scenes.push({
      id: 3,
      title: 'Worked Example',
      visual: exampleVideoPath,
      audio: exampleAudioPath,
      duration: exampleAudioDuration,
      type: 'manim'
    });

    totalCost += (exampleNarration.length / 1000) * 0.30;

    // Step 3: Combine with FFmpeg
    console.log('\n🎬 Combining scenes into final video...');
    const videoCombiner = new FFmpegVideoCombiner();
    const finalVideoPath = await videoCombiner.combineScenesIntoFinalVideo({
      scenes: scenes,
      outputFilename: `streamlined_lesson_${Date.now()}.mp4`
    });

    const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

    res.json({
      success: true,
      result: {
        title: 'Circle Theorem: Angle at Centre (Streamlined)',
        scenes: scenes.length,
        duration: totalDuration,
        cost: totalCost,
        finalVideo: finalVideoPath,
        thumbnailTransition: 'Thumbnail shows 1s, animates to bottom right, then fades',
        sceneDetails: scenes.map(s => ({
          id: s.id,
          title: s.title,
          type: s.type,
          visual: s.visual,
          audio: s.audio,
          duration: s.duration
        }))
      },
      message: 'Streamlined lesson with thumbnail transition generated successfully!'
    });
  } catch (error: any) {
    console.error('Streamlined lesson generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

/**
 * POST /api/education/enhanced-lesson-demo
 * Demo: Generate enhanced lesson with proper pedagogy
 */
router.post('/enhanced-lesson-demo', async (req, res) => {
  try {
    const voiceId = req.body.voiceId || process.env.DEFAULT_VOICE_ID;

    if (!voiceId) {
      return res.status(400).json({
        success: false,
        error: 'voiceId is required (provide in request body or set DEFAULT_VOICE_ID in .env)'
      });
    }

    console.log('\n🎓 Generating ENHANCED Circle Theorem Lesson (New Pedagogy)');

    // Enhanced module with proper lesson structure
    const module: Module = {
      id: 'circle-angle-at-centre-enhanced',
      title: 'Circle Theorem: Angle at Centre',
      concepts: [
        {
          name: 'Thumbnail',
          description: 'Visual introduction to circle theorems',
          type: 'theorem',
          metadata: {}
        },
        {
          name: 'Introduction',
          description: 'Context and exam relevance',
          type: 'theorem',
          metadata: {}
        },
        {
          name: 'Theory',
          description: 'Visual proof of angle at centre theorem',
          type: 'proof',
          metadata: {
            theorem: 'Angle at Centre'
          }
        },
        {
          name: 'Question Display',
          description: 'Show the exam question',
          type: 'application',
          metadata: {}
        },
        {
          name: 'Solution Step 1',
          description: 'Identify the relationship',
          type: 'calculation',
          metadata: {}
        },
        {
          name: 'Solution Step 2',
          description: 'Calculate the angle',
          type: 'calculation',
          metadata: {}
        },
        {
          name: 'Common Pitfalls',
          description: 'Mistakes to avoid',
          type: 'application',
          metadata: {}
        }
      ],
      videoScript: {
        segments: [
          {
            title: 'Thumbnail',
            narration: 'Welcome to Circle Theorems - Angle at Centre',
            duration: 3,
            visualType: 'gemini'
          },
          {
            title: 'Introduction',
            narration: 'The Angle at Centre theorem is one of the most important circle theorems you will encounter in GCSE Mathematics. It appears frequently in both calculator and non-calculator papers, and understanding it will unlock many geometry problems.',
            duration: 15,
            visualType: 'manim'
          },
          {
            title: 'Theory',
            narration: 'Here is the key principle: When two angles are subtended by the same arc, the angle at the centre is exactly twice the angle at the circumference. Watch as we construct this relationship step by step. We have our circle with center O, points A and B on the circumference creating an arc. The angle at the center is theta, and the angle at the circumference from point C is exactly half of theta. This relationship always holds true.',
            duration: 35,
            visualType: 'manim'
          },
          {
            title: 'Question Display',
            narration: 'Let us apply this theorem to a typical exam question. We have a circle with center O. The angle at the center, angle AOB, is 140 degrees. We need to find angle ACB at the circumference.',
            duration: 12,
            visualType: 'manim'
          },
          {
            title: 'Solution Step 1',
            narration: 'Step 1: Identify the relationship. Both angles are subtended by the same arc AB, so we can apply the angle at centre theorem. The angle at the center equals two times the angle at the circumference.',
            duration: 15,
            visualType: 'manim'
          },
          {
            title: 'Solution Step 2',
            narration: 'Step 2: Calculate the angle. We substitute 140 degrees for angle AOB, then divide both sides by 2 to find angle ACB equals 70 degrees.',
            duration: 12,
            visualType: 'manim'
          },
          {
            title: 'Common Pitfalls',
            narration: 'Watch out for these common mistakes. First, do not assume all angles in a circle are equal - always check which arc subtends each angle. Second, make sure you identify which angle is at the center before applying the theorem. And third, remember: the angle at the CENTRE is the bigger one - you divide it by 2, not the other way around.',
            duration: 25,
            visualType: 'manim'
          }
        ]
      }
    };

    // Step 1: Generate all scenes
    console.log('📹 Step 1: Generating all scenes with enhanced pedagogy...');
    const result = await getGenerator().generateModuleVideo(module, voiceId);

    // Step 2: Combine scenes into final video with FFmpeg
    console.log('\n🎬 Step 2: Combining scenes into final video...');
    const videoCombiner = new FFmpegVideoCombiner();
    const finalVideoPath = await videoCombiner.combineScenesIntoFinalVideo({
      scenes: result.scenes,
      outputFilename: `enhanced_circle_theorem_${Date.now()}.mp4`
    });

    res.json({
      success: true,
      result: {
        title: module.title,
        approach: 'Enhanced Pedagogy',
        structure: [
          '1. Thumbnail (3s) - Visual hook only',
          '2. Introduction (15s) - Exam context',
          '3. Theory (35s) - Visual proof',
          '4. Question (12s) - Display problem',
          '5. Step 1 (15s) - Identify relationship',
          '6. Step 2 (12s) - Calculate',
          '7. Pitfalls (25s) - Common mistakes'
        ],
        scenes: result.scenes.length,
        duration: result.duration,
        cost: result.cost,
        finalVideo: finalVideoPath,
        sceneDetails: result.scenes.map(s => ({
          id: s.id,
          title: s.title,
          type: s.type,
          duration: s.duration
        }))
      },
      message: '✨ Enhanced lesson with proper pedagogy generated successfully!'
    });
  } catch (error: any) {
    console.error('Enhanced lesson generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/streamlined-lesson
 * Streamlined lesson with thumbnail transition to bottom right
 */
router.post('/streamlined-lesson', async (req, res) => {
  try {
    const voiceId = req.body.voiceId || process.env.DEFAULT_VOICE_ID;

    if (!voiceId) {
      return res.status(400).json({
        success: false,
        error: 'voiceId is required'
      });
    }

    console.log('\n✨ Generating STREAMLINED Circle Theorem Lesson');
    console.log('   - Thumbnail: 1s full screen → 0.5s animate to corner');
    console.log('   - Content: Starts immediately after transition');

    // Streamlined module - 3 scenes only
    const module: Module = {
      id: 'circle-streamlined',
      title: 'Circle Theorem: Angle at Centre',
      concepts: [
        {
          name: 'Introduction',
          description: 'Intro with thumbnail transition',
          type: 'theorem',
          metadata: {
            usesThumbnail: true,
            examRelevance: 'Popular GCSE Higher Topic',
            difficulty: 'higher'
          }
        },
        {
          name: 'Theory',
          description: 'Visual proof',
          type: 'proof',
          metadata: {
            theorem: 'Angle at Centre',
            angle: 120
          }
        },
        {
          name: 'Worked Example',
          description: 'Step-by-step solution',
          type: 'application',
          metadata: {
            theorem: 'Angle at Centre',
            angle: 140
          }
        }
      ],
      videoScript: {
        segments: [
          {
            title: 'Introduction',
            narration: 'The Angle at Centre theorem is one of the most important circle theorems you will encounter in GCSE Mathematics. It appears frequently in exam papers and is essential for solving geometry problems.',
            duration: 12,
            visualType: 'manim'
          },
          {
            title: 'Theory',
            narration: 'Here is the key principle: When two angles are subtended by the same arc, the angle at the centre is exactly twice the angle at the circumference. We have our circle with center O, points A and B creating an arc. The angle at the center is 120 degrees, and the angle at the circumference from point C is exactly 60 degrees. This relationship always holds true.',
            duration: 30,
            visualType: 'manim'
          },
          {
            title: 'Worked Example',
            narration: 'Let us apply this to an exam question. We have a circle with center O. The angle at the center, angle AOB, is 140 degrees. We need to find angle ACB. Step 1: Apply the theorem - angle at centre equals 2 times angle at circumference. Step 2: Calculate - 140 divided by 2 equals 70 degrees. Therefore angle ACB is 70 degrees.',
            duration: 25,
            visualType: 'manim'
          }
        ]
      }
    };

    // Generate all scenes
    console.log('📹 Generating scenes...');
    const result = await getGenerator().generateModuleVideo(module, voiceId);

    // Combine with FFmpeg
    console.log('\n🎬 Combining scenes with thumbnail transition...');
    const videoCombiner = new FFmpegVideoCombiner();
    const finalVideoPath = await videoCombiner.combineScenesIntoFinalVideo({
      scenes: result.scenes,
      outputFilename: `streamlined_circle_${Date.now()}.mp4`
    });

    res.json({
      success: true,
      result: {
        title: module.title,
        approach: 'Streamlined with Thumbnail Transition',
        features: [
          'Thumbnail: 1s full → 0.5s animate to bottom right',
          'Manim content starts immediately',
          'Professional smooth transition',
          'No spelling errors (Manim only)'
        ],
        scenes: result.scenes.length,
        duration: result.duration,
        cost: result.cost,
        finalVideo: finalVideoPath,
        sceneDetails: result.scenes.map(s => ({
          id: s.id,
          title: s.title,
          type: s.type,
          duration: s.duration
        }))
      },
      message: '✨ Streamlined lesson generated successfully!'
    });
  } catch (error: any) {
    console.error('Streamlined lesson generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/generate-avatar
 * Generate lip-synced avatar video from audio and image
 */
router.post('/generate-avatar', upload.single('avatarImage'), async (req, res) => {
  try {
    const { audioPath, provider, quality, fps } = req.body;
    const avatarImageFile = req.file;

    if (!audioPath) {
      return res.status(400).json({
        success: false,
        error: 'audioPath is required'
      });
    }

    if (!avatarImageFile) {
      return res.status(400).json({
        success: false,
        error: 'avatarImage file is required'
      });
    }

    console.log('\n🎭 Generating avatar video...');
    console.log(`   Audio: ${audioPath}`);
    console.log(`   Provider: ${provider || 'a2e'}`);

    // Import avatar service
    const { default: AvatarService } = await import('../services/avatar-service.js');

    // Create avatar service instance
    const avatarService = new AvatarService(
      provider || 'a2e',
      undefined, // Use env API key
      'output/avatars'
    );

    // Check if configured
    if (!avatarService.isConfigured()) {
      return res.status(500).json({
        success: false,
        error: `${provider || 'a2e'} API key not configured. Set ${(provider || 'a2e').toUpperCase()}_API_KEY in .env`
      });
    }

    // Save uploaded image temporarily
    const tempImagePath = `/tmp/avatar_${Date.now()}.${avatarImageFile.mimetype.split('/')[1]}`;
    await fs.writeFile(tempImagePath, avatarImageFile.buffer);

    // Generate avatar
    const result = await avatarService.generateAvatar({
      avatarImage: tempImagePath,
      audioFile: audioPath,
      quality: quality || 'standard',
      fps: fps || 30,
      provider: provider || 'a2e'
    });

    // Clean up temp file
    await fs.unlink(tempImagePath).catch(() => {});

    res.json({
      success: true,
      avatar: {
        videoPath: result.videoPath,
        videoUrl: result.videoUrl,
        duration: result.duration,
        cost: result.cost,
        provider: result.provider
      },
      message: 'Avatar generated successfully!'
    });
  } catch (error: any) {
    console.error('Avatar generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/composite-avatar
 * Composite avatar video onto main educational video
 */
router.post('/composite-avatar', async (req, res) => {
  try {
    const { mainVideo, avatarVideo, position, scale, addBorder } = req.body;

    if (!mainVideo || !avatarVideo) {
      return res.status(400).json({
        success: false,
        error: 'mainVideo and avatarVideo paths are required'
      });
    }

    console.log('\n🎬 Compositing avatar onto video...');
    console.log(`   Main: ${mainVideo}`);
    console.log(`   Avatar: ${avatarVideo}`);
    console.log(`   Position: ${position || 'top-right'}`);

    // Import compositor
    const { default: AvatarCompositor } = await import('../services/avatar-compositor.js');

    // Create compositor instance
    const compositor = new AvatarCompositor('output/education/videos');

    // Composite avatar
    const result = await compositor.createPictureInPicture(mainVideo, avatarVideo, {
      position: position || 'top-right',
      scale: scale || 0.2,
      addBorder: addBorder !== false
    });

    res.json({
      success: true,
      video: {
        path: result.videoPath,
        duration: result.duration,
        fileSize: (result.fileSize / 1024 / 1024).toFixed(2) + ' MB'
      },
      message: 'Avatar composited successfully!'
    });
  } catch (error: any) {
    console.error('Avatar compositing failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/circle-theorem-with-avatar
 * Generate complete Circle Theorem lesson WITH avatar overlay
 */
router.post('/circle-theorem-with-avatar', upload.single('avatarImage'), async (req, res) => {
  try {
    const voiceId = req.body.voiceId || process.env.DEFAULT_VOICE_ID;
    const avatarImageFile = req.file;
    const { provider, position, scale } = req.body;

    if (!voiceId) {
      return res.status(400).json({
        success: false,
        error: 'voiceId is required (provide in request body or set DEFAULT_VOICE_ID in .env)'
      });
    }

    console.log('\n🎓 Generating Circle Theorem Lesson WITH Avatar');

    // Create module
    const module: Module = {
      id: 'circle-angle-at-centre',
      title: 'Circle Theorem: Angle at Centre',
      concepts: [
        {
          name: 'Introduction',
          description: 'Introduction to circle theorems',
          type: 'theorem',
          metadata: {}
        },
        {
          name: 'Angle at Centre Theorem',
          description: 'The angle at the centre is twice the angle at the circumference',
          type: 'theorem',
          metadata: {
            theorem: 'Angle at Centre',
            angle: 120
          }
        },
        {
          name: 'Worked Example',
          description: 'Solving problems with the angle at centre theorem',
          type: 'application',
          metadata: {
            theorem: 'Angle at Centre',
            angle: 100
          }
        }
      ],
      videoScript: {
        segments: [
          {
            title: 'Introduction',
            narration: 'Welcome to this lesson on circle theorems. Today we will explore one of the most fundamental relationships in circle geometry - the angle at the centre theorem.',
            duration: 10,
            visualType: 'gemini'
          },
          {
            title: 'Angle at Centre Theorem',
            narration: 'The angle at the centre theorem states that the angle subtended by an arc at the centre of a circle is exactly twice the angle subtended by the same arc at any point on the circumference.',
            duration: 25,
            visualType: 'manim'
          },
          {
            title: 'Worked Example',
            narration: 'Let\'s apply this theorem. If the angle at the centre is 100 degrees, what is the angle at the circumference? Using our theorem, we divide by 2 to get 50 degrees.',
            duration: 20,
            visualType: 'manim'
          }
        ]
      }
    };

    // Generate scenes
    console.log('📹 Generating scenes...');
    const result = await getGenerator().generateModuleVideo(module, voiceId);

    // Combine scenes
    console.log('\n🎬 Combining scenes...');
    const videoCombiner = new FFmpegVideoCombiner();
    const mainVideoPath = await videoCombiner.combineScenesIntoFinalVideo({
      scenes: result.scenes,
      outputFilename: `circle_main_${Date.now()}.mp4`
    });

    let finalVideoPath = mainVideoPath;
    let avatarCost = 0;

    // Add avatar if image provided
    if (avatarImageFile) {
      console.log('\n🎭 Generating avatar...');

      // Import services
      const { default: AvatarService } = await import('../services/avatar-service.js');
      const { default: AvatarCompositor } = await import('../services/avatar-compositor.js');

      // Get combined audio path (first scene's audio for now)
      const audioPath = result.scenes[0].audio;

      // Save uploaded image
      const tempImagePath = `/tmp/avatar_${Date.now()}.${avatarImageFile.mimetype.split('/')[1]}`;
      await fs.writeFile(tempImagePath, avatarImageFile.buffer);

      // Generate avatar
      const avatarService = new AvatarService(
        provider || 'a2e',
        undefined,
        'output/avatars'
      );

      if (!avatarService.isConfigured()) {
        console.warn('⚠️  Avatar service not configured, skipping avatar overlay');
      } else {
        const avatarResult = await avatarService.generateAvatar({
          avatarImage: tempImagePath,
          audioFile: audioPath,
          quality: 'standard',
          fps: 30
        });

        avatarCost = avatarResult.cost;

        // Composite avatar onto main video
        console.log('\n🎬 Compositing avatar...');
        const compositor = new AvatarCompositor('output/education/videos');
        const compositeResult = await compositor.createPictureInPicture(
          mainVideoPath,
          avatarResult.videoPath,
          {
            position: position || 'top-right',
            scale: scale || 0.2,
            addBorder: true
          }
        );

        finalVideoPath = compositeResult.videoPath;

        // Clean up temp file
        await fs.unlink(tempImagePath).catch(() => {});
      }
    }

    res.json({
      success: true,
      result: {
        title: module.title,
        hasAvatar: avatarImageFile !== undefined,
        scenes: result.scenes.length,
        duration: result.duration,
        cost: {
          scenes: result.cost,
          avatar: avatarCost,
          total: result.cost + avatarCost
        },
        finalVideo: finalVideoPath,
        sceneDetails: result.scenes.map(s => ({
          id: s.id,
          title: s.title,
          duration: s.duration
        }))
      },
      message: avatarImageFile
        ? '✨ Lesson with avatar generated successfully!'
        : '✨ Lesson generated successfully!'
    });
  } catch (error: any) {
    console.error('Lesson with avatar generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/visualize
 *
 * Generate educational visualization (D3 + Manim side-by-side video)
 *
 * Request body:
 * {
 *   "problem": "Find A ∩ B where A = {1,2,3,4,5} and B = {4,5,6,7,8}",
 *   "type": "sets",
 *   "targetAge": 13,
 *   "duration": 12,
 *   "style": {
 *     "d3Style": "clean",
 *     "manimStyle": "educational"
 *   }
 * }
 */
router.post('/visualize', async (req, res) => {
  try {
    const request: EducationalVisualizationRequest = req.body;

    // Validate request
    if (!request.problem) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: problem'
      });
    }

    if (!request.type) {
      request.type = 'general';
    }

    if (!request.targetAge) {
      request.targetAge = 13; // Default to 13-year-olds
    }

    // Get Claude service from app locals
    const claudeService = req.app.locals.claudeService as ClaudeService;

    if (!claudeService) {
      return res.status(500).json({
        success: false,
        error: 'Claude service not initialized'
      });
    }

    // Create agent and generate
    const agent = new EducationalVizAgent(claudeService);
    const result = await agent.generate(request);

    if (!result.success) {
      return res.status(500).json(result);
    }

    // Return result with file paths
    res.json({
      success: true,
      data: {
        finalVideo: result.finalVideoPath,
        d3Output: result.d3Output,
        manimOutput: result.manimOutput,
        metadata: result.metadata
      }
    });

  } catch (error: any) {
    console.error('Visualization generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/lesson
 *
 * Generate complete educational lesson with multiple visualizations
 *
 * Request body:
 * {
 *   "topic": "Set Theory Basics",
 *   "concepts": ["union", "intersection", "complement"],
 *   "targetAge": 13,
 *   "duration": 10 // minutes
 * }
 */
router.post('/lesson', async (req, res) => {
  try {
    const { topic, concepts, targetAge, duration } = req.body;

    if (!topic || !concepts || !Array.isArray(concepts)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topic, concepts (array)'
      });
    }

    const claudeService = req.app.locals.claudeService as ClaudeService;

    if (!claudeService) {
      return res.status(500).json({
        success: false,
        error: 'Claude service not initialized'
      });
    }

    // Generate lesson structure using Claude
    const lessonPrompt = `Create an educational lesson plan for:

TOPIC: ${topic}
CONCEPTS: ${concepts.join(', ')}
TARGET AGE: ${targetAge || 13} years old
DURATION: ${duration || 10} minutes

For each concept, provide:
1. A clear explanation
2. An example problem
3. Visual aid suggestion (D3 text solution + Manim animation)

Format as JSON:
{
  "title": "...",
  "concepts": [
    {
      "name": "...",
      "explanation": "...",
      "exampleProblem": "...",
      "visualizationType": "venn_diagram" | "graph" | "geometric_shape"
    }
  ]
}`;

    const response = await claudeService.chat([
      { role: 'user', content: lessonPrompt }
    ]);

    // Extract JSON
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse lesson plan from Claude');
    }

    const lesson = JSON.parse(jsonMatch[0]);

    // Generate visualizations for each concept
    const agent = new EducationalVizAgent(claudeService);
    const visualizations = [];

    for (const concept of lesson.concepts) {
      const vizRequest: EducationalVisualizationRequest = {
        problem: concept.exampleProblem,
        type: concept.visualizationType || 'general',
        targetAge: targetAge || 13,
        duration: 12
      };

      const result = await agent.generate(vizRequest);
      visualizations.push({
        concept: concept.name,
        video: result.finalVideoPath,
        success: result.success
      });
    }

    res.json({
      success: true,
      data: {
        lesson,
        visualizations
      }
    });

  } catch (error: any) {
    console.error('Lesson generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/examples
 *
 * Get example problems for different math topics
 */
router.get('/examples', (req, res) => {
  const examples = {
    sets: [
      {
        problem: 'Find A ∩ B where A = {1,2,3,4,5} and B = {4,5,6,7,8}',
        type: 'sets',
        targetAge: 13
      },
      {
        problem: 'Find A ∪ B where A = {a,b,c} and B = {c,d,e}',
        type: 'sets',
        targetAge: 13
      }
    ],
    algebra: [
      {
        problem: 'Solve for x: 2x + 5 = 13',
        type: 'algebra',
        targetAge: 14
      }
    ],
    geometry: [
      {
        problem: 'Find the area of a circle with radius 5',
        type: 'geometry',
        targetAge: 13
      }
    ]
  };

  res.json({
    success: true,
    data: examples
  });
});

/**
 * POST /api/education/sets-demo
 *
 * Demo endpoint: Generate the sets intersection visualization we demoed earlier
 * This uses the proven template from output/sets-demo/
 */
router.post('/sets-demo', async (req, res) => {
  try {
    const claudeService = req.app.locals.claudeService as ClaudeService;

    if (!claudeService) {
      return res.status(400).json({
        success: false,
        error: 'Claude service not initialized'
      });
    }

    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  SETS INTERSECTION DEMO (D3 + Manim)                         ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    const agent = new EducationalVizAgent(claudeService);

    const result = await agent.generate({
      problem: 'Find A ∩ B where A = {1,2,3,4,5} and B = {4,5,6,7,8}',
      type: 'sets',
      targetAge: 13,
      duration: 12
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Generation failed'
      });
    }

    res.json({
      success: true,
      message: 'Sets intersection demo generated successfully!',
      result: {
        finalVideo: result.finalVideoPath,
        d3Output: {
          script: result.d3Output.scriptPath,
          image: result.d3Output.imagePath,
          video: result.d3Output.videoPath
        },
        manimOutput: {
          script: result.manimOutput.scriptPath,
          video: result.manimOutput.videoPath
        },
        metadata: result.metadata
      }
    });

  } catch (error: any) {
    console.error('Sets demo generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// IGCSE EDUCATION PLATFORM - FIRESTORE ROUTES
// Cambridge IGCSE 0580 Mathematics Content Management
// ============================================================================

// Lazy-initialize Firestore service
let educationServiceInstance: EducationFirestoreService | null = null;

function getEducationService(): EducationFirestoreService {
  if (!educationServiceInstance) {
    educationServiceInstance = new EducationFirestoreService();
  }
  return educationServiceInstance;
}

// ---------------------------------------------------------------------------
// SYLLABUS MANAGEMENT
// ---------------------------------------------------------------------------

/**
 * GET /api/education/syllabus
 * Get syllabus overview with units, topics, and hasLesson status
 */
router.get('/syllabus', async (req, res) => {
  try {
    const educationService = getEducationService();
    const overview = await educationService.getSyllabusOverview();

    // Enrich units with topics and hasLesson status
    const unitsWithTopics = await Promise.all(
      overview.units.map(async (unit) => {
        const topics = await educationService.getUnitTopics(unit.id);

        // Check which topics have lesson files
        const topicsWithLessonStatus = await Promise.all(
          topics.map(async (topic) => {
            const normalizedCode = topic.code.toLowerCase();
            const lessonPath = `${process.cwd()}/output/lessons/igcse-0580-${normalizedCode}.json`;

            let hasLesson = false;
            try {
              await fs.access(lessonPath);
              hasLesson = true;
            } catch {
              // File doesn't exist, check Firestore
              hasLesson = topic.status === 'published' || topic.status === 'approved';
            }

            return {
              code: topic.code,
              title: topic.title,
              level: topic.level,
              status: topic.status,
              estimatedDuration: topic.estimatedDuration || 30,
              hasLesson,
            };
          })
        );

        return {
          code: unit.code,
          title: unit.title,
          level: unit.level,
          icon: unit.icon,
          color: unit.color,
          topics: topicsWithLessonStatus,
        };
      })
    );

    res.json({
      success: true,
      syllabus: {
        metadata: overview.metadata,
        units: unitsWithTopics,
      },
      coverage: overview.coverage,
    });
  } catch (error: any) {
    console.error('Failed to get syllabus overview:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/syllabus/initialize
 * Initialize syllabus from JSON data (one-time setup)
 */
router.post('/syllabus/initialize', async (req, res) => {
  try {
    const { syllabusData } = req.body;

    if (!syllabusData) {
      return res.status(400).json({
        success: false,
        error: 'syllabusData is required'
      });
    }

    await getEducationService().initializeSyllabus(syllabusData);

    res.json({
      success: true,
      message: 'Syllabus initialized successfully'
    });
  } catch (error: any) {
    console.error('Failed to initialize syllabus:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------------------------------------------------------------------------
// UNIT & TOPIC MANAGEMENT
// ---------------------------------------------------------------------------

/**
 * GET /api/education/units/:unitId/topics
 * Get all topics for a specific unit
 */
router.get('/units/:unitId/topics', async (req, res) => {
  try {
    const { unitId } = req.params;
    const topics = await getEducationService().getUnitTopics(unitId);

    res.json({
      success: true,
      data: {
        unitId,
        topics,
        count: topics.length
      }
    });
  } catch (error: any) {
    console.error('Failed to get unit topics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/topics/by-status
 * Get topics filtered by content status and optionally by level (Core/Extended)
 * Query params: status (required), level (optional: 'Core' | 'Extended')
 */
router.get('/topics/by-status', async (req, res) => {
  try {
    const status = req.query.status as ContentStatus;
    const level = req.query.level as TopicLevel | undefined;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'status query parameter is required'
      });
    }

    const validStatuses: ContentStatus[] = ['not_started', 'generating', 'review', 'approved', 'published'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const topics = await getEducationService().getTopicsByStatus(status, level);

    res.json({
      success: true,
      data: {
        status,
        level: level || 'all',
        topics,
        count: topics.length
      }
    });
  } catch (error: any) {
    console.error('Failed to get topics by status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/topics/next-to-generate
 * Get the next topics ready for content generation
 * Query params: count (optional, default 5)
 */
router.get('/topics/next-to-generate', async (req, res) => {
  try {
    const count = parseInt(req.query.count as string) || 5;
    const topics = await getEducationService().getNextTopicsToGenerate(count);

    res.json({
      success: true,
      data: {
        topics,
        count: topics.length,
        message: topics.length > 0
          ? `Found ${topics.length} topics ready for generation`
          : 'No topics pending generation'
      }
    });
  } catch (error: any) {
    console.error('Failed to get next topics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/topics/:topicCode
 * Get a specific topic by its code (e.g., 'C1.2' or 'E4.7')
 */
router.get('/topics/:topicCode', async (req, res) => {
  try {
    const { topicCode } = req.params;
    const topic = await getEducationService().getTopic(topicCode);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: `Topic ${topicCode} not found`
      });
    }

    res.json({
      success: true,
      data: topic
    });
  } catch (error: any) {
    console.error('Failed to get topic:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/education/topics/:topicCode/status
 * Update topic content status
 */
router.put('/topics/:topicCode/status', async (req, res) => {
  try {
    const { topicCode } = req.params;
    const { status } = req.body;

    const validStatuses: ContentStatus[] = ['not_started', 'generating', 'review', 'approved', 'published'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    await getEducationService().updateTopicStatus(topicCode, status);

    res.json({
      success: true,
      message: `Topic ${topicCode} status updated to ${status}`
    });
  } catch (error: any) {
    console.error('Failed to update topic status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------------------------------------------------------------------------
// LESSON CONTENT MANAGEMENT
// ---------------------------------------------------------------------------

/**
 * POST /api/education/topics/:topicCode/lesson
 * Save generated lesson content for a topic
 */
router.post('/topics/:topicCode/lesson', async (req, res) => {
  try {
    const { topicCode } = req.params;
    const { lesson, generatedBy } = req.body;

    if (!lesson) {
      return res.status(400).json({
        success: false,
        error: 'lesson content is required'
      });
    }

    await getEducationService().saveLessonContent(
      topicCode,
      lesson as LessonContent,
      generatedBy || 'api'
    );

    res.json({
      success: true,
      message: `Lesson content saved for topic ${topicCode}`,
      topicCode
    });
  } catch (error: any) {
    console.error('Failed to save lesson:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/topics/:topicCode/lesson
 * Get lesson content for a topic (from local file or Firestore)
 */
router.get('/topics/:topicCode/lesson', async (req, res) => {
  try {
    const { topicCode } = req.params;
    const normalizedCode = topicCode.toLowerCase();

    // Try to load from local JSON file first
    const lessonPath = `${process.cwd()}/output/lessons/igcse-0580-${normalizedCode}.json`;

    try {
      const lessonContent = await fs.readFile(lessonPath, 'utf-8');
      const lesson = JSON.parse(lessonContent);

      return res.json({
        success: true,
        lesson,
        source: 'file'
      });
    } catch (fileError) {
      // File not found, try Firestore
      console.log(`Lesson file not found at ${lessonPath}, checking Firestore...`);
    }

    // Try to get from Firestore
    const topic = await getEducationService().getTopic(topicCode);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: `Topic ${topicCode} not found`
      });
    }

    // Check if topic has lesson content in Firestore
    if (topic.lessonContent) {
      return res.json({
        success: true,
        lesson: topic.lessonContent,
        source: 'firestore'
      });
    }

    // No lesson available
    return res.status(404).json({
      success: false,
      error: `No lesson content available for topic ${topicCode}`,
      topic: {
        code: topic.code,
        title: topic.title,
        status: topic.status
      }
    });
  } catch (error: any) {
    console.error('Failed to get lesson:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/topics/:topicCode/assets
 * Add an asset (video, audio, image, interactive) to a topic
 */
router.post('/topics/:topicCode/assets', async (req, res) => {
  try {
    const { topicCode } = req.params;
    const asset = req.body as TopicAsset;

    if (!asset.type || !asset.url) {
      return res.status(400).json({
        success: false,
        error: 'Asset must have type and url'
      });
    }

    const assetId = await getEducationService().addTopicAsset(topicCode, asset);

    res.json({
      success: true,
      message: `Asset added to topic ${topicCode}`,
      assetId
    });
  } catch (error: any) {
    console.error('Failed to add asset:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------------------------------------------------------------------------
// STUDENT PROGRESS TRACKING
// ---------------------------------------------------------------------------

/**
 * GET /api/education/students/:studentId/dashboard
 * Get student's learning dashboard with overall progress
 */
router.get('/students/:studentId/dashboard', async (req, res) => {
  try {
    const { studentId } = req.params;
    const dashboard = await getEducationService().getStudentDashboard(studentId);

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error: any) {
    console.error('Failed to get student dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/students/:studentId/progress/:topicCode
 * Get student's progress for a specific topic
 */
router.get('/students/:studentId/progress/:topicCode', async (req, res) => {
  try {
    const { studentId, topicCode } = req.params;
    const progress = await getEducationService().getStudentProgress(studentId, topicCode);

    res.json({
      success: true,
      data: progress
    });
  } catch (error: any) {
    console.error('Failed to get student progress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/education/students/:studentId/progress/:topicCode
 * Update student's progress for a topic
 */
router.put('/students/:studentId/progress/:topicCode', async (req, res) => {
  try {
    const { studentId, topicCode } = req.params;
    const updates = req.body;

    await getEducationService().updateStudentProgress(studentId, topicCode, updates);

    res.json({
      success: true,
      message: `Progress updated for student ${studentId} on topic ${topicCode}`
    });
  } catch (error: any) {
    console.error('Failed to update progress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/students/:studentId/quiz/:topicCode
 * Record a quiz attempt for a student
 */
router.post('/students/:studentId/quiz/:topicCode', async (req, res) => {
  try {
    const { studentId, topicCode } = req.params;
    const { score, maxScore, answers } = req.body;

    if (typeof score !== 'number' || typeof maxScore !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'score and maxScore are required numbers'
      });
    }

    await getEducationService().recordQuizAttempt(
      studentId,
      topicCode,
      score,
      maxScore,
      answers || []
    );

    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 70;

    res.json({
      success: true,
      data: {
        score,
        maxScore,
        percentage,
        passed,
        message: passed
          ? `Great job! You scored ${percentage}%`
          : `You scored ${percentage}%. Keep practicing!`
      }
    });
  } catch (error: any) {
    console.error('Failed to record quiz:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------------------------------------------------------------------------
// GENERATION QUEUE (MULTI-AGENT SUPPORT)
// ---------------------------------------------------------------------------

/**
 * GET /api/education/generation/queue
 * Get current generation queue status
 */
router.get('/generation/queue', async (req, res) => {
  try {
    const status = await getEducationService().getQueueStatus();

    res.json({
      success: true,
      data: status
    });
  } catch (error: any) {
    console.error('Failed to get queue status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/generation/queue
 * Add topics to the generation queue
 */
router.post('/generation/queue', async (req, res) => {
  try {
    const { topicCodes, priority } = req.body;

    if (!topicCodes || !Array.isArray(topicCodes)) {
      return res.status(400).json({
        success: false,
        error: 'topicCodes array is required'
      });
    }

    const taskIds = await getEducationService().queueTopicsForGeneration(
      topicCodes,
      priority || 1
    );

    res.json({
      success: true,
      data: {
        queued: topicCodes.length,
        taskIds,
        message: `Added ${topicCodes.length} topics to generation queue`
      }
    });
  } catch (error: any) {
    console.error('Failed to queue topics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/generation/claim
 * Claim the next task from the generation queue (for agents)
 */
router.post('/generation/claim', async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: 'agentId is required'
      });
    }

    const task = await getEducationService().claimNextTask(agentId);

    if (!task) {
      return res.json({
        success: true,
        data: null,
        message: 'No tasks available in queue'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error: any) {
    console.error('Failed to claim task:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/education/generation/tasks/:taskId/progress
 * Update task progress
 */
router.put('/generation/tasks/:taskId/progress', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { step, status } = req.body;

    if (!step || !status) {
      return res.status(400).json({
        success: false,
        error: 'step and status are required'
      });
    }

    await getEducationService().updateTaskProgress(taskId, step, status);

    res.json({
      success: true,
      message: `Task ${taskId} progress updated: ${step} - ${status}`
    });
  } catch (error: any) {
    console.error('Failed to update task progress:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/generation/tasks/:taskId/complete
 * Mark a generation task as complete
 */
router.post('/generation/tasks/:taskId/complete', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { lessonId } = req.body;

    await getEducationService().completeTask(taskId, lessonId);

    res.json({
      success: true,
      message: `Task ${taskId} completed successfully`
    });
  } catch (error: any) {
    console.error('Failed to complete task:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------------------------------------------------------------------------
// COVERAGE & STATISTICS
// ---------------------------------------------------------------------------

/**
 * GET /api/education/coverage
 * Get syllabus coverage statistics by level (Core/Extended)
 */
router.get('/coverage', async (req, res) => {
  try {
    const educationService = getEducationService();
    const overview = await educationService.getSyllabusOverview();

    // Fetch all topics by status to calculate coverage
    const allNotStarted = await educationService.getTopicsByStatus('not_started');
    const allGenerating = await educationService.getTopicsByStatus('generating');
    const allReview = await educationService.getTopicsByStatus('review');
    const allApproved = await educationService.getTopicsByStatus('approved');
    const allPublished = await educationService.getTopicsByStatus('published');

    const allTopics = [...allNotStarted, ...allGenerating, ...allReview, ...allApproved, ...allPublished];

    const calculateCoverage = (topics: any[]) => {
      const total = topics.length;
      const published = topics.filter(t => t.status === 'published').length;
      const approved = topics.filter(t => t.status === 'approved').length;
      const inReview = topics.filter(t => t.status === 'review').length;
      const generating = topics.filter(t => t.status === 'generating').length;
      const notStarted = topics.filter(t => t.status === 'not_started').length;

      return {
        total,
        published,
        approved,
        inReview,
        generating,
        notStarted,
        percentComplete: total > 0 ? Math.round((published / total) * 100) : 0,
        percentReady: total > 0 ? Math.round(((published + approved) / total) * 100) : 0
      };
    };

    const coreTopics = allTopics.filter(t => t.level === 'Core');
    const extendedTopics = allTopics.filter(t => t.level === 'Extended');

    res.json({
      success: true,
      data: {
        core: calculateCoverage(coreTopics),
        extended: calculateCoverage(extendedTopics),
        overall: calculateCoverage(allTopics),
        metadata: overview.metadata
      }
    });
  } catch (error: any) {
    console.error('Failed to get coverage:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------------------------------------------------------------------------
// LESSON GENERATION WITH CLAUDE
// ---------------------------------------------------------------------------

import { generateLesson, SyllabusTopic } from '../education/lesson-generator.js';

// Cache for syllabus data
let syllabusCache: Record<string, SyllabusTopic> | null = null;

async function loadSyllabusData(): Promise<Record<string, SyllabusTopic>> {
  if (syllabusCache) return syllabusCache;

  try {
    const syllabusPath = `${process.cwd()}/data/maths-0580-syllabus-complete.json`;
    const data = await fs.readFile(syllabusPath, 'utf-8');
    const syllabus = JSON.parse(data);

    // Build lookup by topic code
    syllabusCache = {};
    for (const unit of syllabus.units || []) {
      for (const topic of unit.topics || []) {
        syllabusCache[topic.code.toLowerCase()] = {
          code: topic.code,
          title: topic.title,
          content: topic.content || [],
          examples: topic.examples || [],
          notes: topic.notes || [],
          notation: topic.notation || [],
          required: topic.required || [],
          properties: topic.properties || [],
          level: topic.level || 'Core'
        };
      }
    }

    return syllabusCache;
  } catch (error) {
    console.error('Failed to load syllabus:', error);
    return {};
  }
}

/**
 * GET /api/education/syllabus
 * Get full syllabus data with all topics
 */
router.get('/syllabus', async (req, res) => {
  try {
    const syllabusPath = `${process.cwd()}/data/maths-0580-syllabus-complete.json`;
    const data = await fs.readFile(syllabusPath, 'utf-8');
    const syllabus = JSON.parse(data);

    res.json({
      success: true,
      syllabus
    });
  } catch (error: any) {
    console.error('Failed to load syllabus:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/syllabus/topics
 * Get list of all topics with generation status
 */
router.get('/syllabus/topics', async (req, res) => {
  try {
    const syllabusData = await loadSyllabusData();
    const topics = Object.values(syllabusData);

    // Check which topics have generated lessons
    const topicsWithStatus = await Promise.all(
      topics.map(async (topic) => {
        const lessonPath = `${process.cwd()}/output/lessons/igcse-0580-${topic.code.toLowerCase()}.json`;
        let hasLesson = false;
        let lessonMeta = null;

        try {
          const lessonData = await fs.readFile(lessonPath, 'utf-8');
          const lesson = JSON.parse(lessonData);
          hasLesson = true;
          lessonMeta = {
            estimatedDuration: lesson.estimatedDuration,
            sectionsCount: lesson.theorySections?.length || 0,
            examplesCount: lesson.workedExamples?.length || 0,
            generatedAt: lesson.generation?.generatedAt
          };
        } catch {
          // No lesson file
        }

        return {
          code: topic.code,
          title: topic.title,
          level: topic.level,
          hasLesson,
          lessonMeta
        };
      })
    );

    res.json({
      success: true,
      topics: topicsWithStatus,
      summary: {
        total: topics.length,
        generated: topicsWithStatus.filter(t => t.hasLesson).length,
        pending: topicsWithStatus.filter(t => !t.hasLesson).length
      }
    });
  } catch (error: any) {
    console.error('Failed to get topics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/generate/:topicCode
 * Generate a complete lesson for a topic using Claude
 */
router.post('/generate/:topicCode', async (req, res) => {
  try {
    const { topicCode } = req.params;
    const { preferredStyle, exampleCount, practiceCount } = req.body;

    console.log(`\n🎓 Starting lesson generation for ${topicCode}`);

    // Load syllabus data
    const syllabusData = await loadSyllabusData();
    const normalizedCode = topicCode.toLowerCase();
    const topic = syllabusData[normalizedCode];

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: `Topic ${topicCode} not found in syllabus`,
        availableTopics: Object.keys(syllabusData).slice(0, 10)
      });
    }

    console.log(`📚 Found topic: ${topic.title}`);
    console.log(`   Level: ${topic.level}`);
    console.log(`   Content points: ${topic.content.length}`);

    // Generate the lesson using Claude
    const lesson = await generateLesson(topic, {
      preferredStyle: preferredStyle || 'auto',
      exampleCount: exampleCount || 6,
      practiceCount: practiceCount || 10
    });

    // Save to file
    const outputDir = `${process.cwd()}/output/lessons`;
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = `${outputDir}/igcse-0580-${normalizedCode}.json`;
    await fs.writeFile(outputPath, JSON.stringify(lesson, null, 2));

    console.log(`\n✅ Lesson saved to ${outputPath}`);

    res.json({
      success: true,
      message: `Lesson generated for ${topic.title}`,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        level: lesson.level,
        estimatedDuration: lesson.estimatedDuration,
        sectionsCount: lesson.theorySections?.length || 0,
        examplesCount: lesson.workedExamples?.length || 0,
        practiceCount: lesson.practiceQuestions?.length || 0
      },
      outputPath
    });
  } catch (error: any) {
    console.error('Failed to generate lesson:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

/**
 * GET /api/education/generate/status/:topicCode
 * Check generation status for a topic
 */
router.get('/generate/status/:topicCode', async (req, res) => {
  try {
    const { topicCode } = req.params;
    const normalizedCode = topicCode.toLowerCase();
    const lessonPath = `${process.cwd()}/output/lessons/igcse-0580-${normalizedCode}.json`;

    try {
      const lessonData = await fs.readFile(lessonPath, 'utf-8');
      const lesson = JSON.parse(lessonData);

      res.json({
        success: true,
        status: 'complete',
        lesson: {
          id: lesson.id,
          title: lesson.title,
          estimatedDuration: lesson.estimatedDuration,
          generatedAt: lesson.generation?.generatedAt,
          sectionsCount: lesson.theorySections?.length || 0,
          examplesCount: lesson.workedExamples?.length || 0
        }
      });
    } catch {
      res.json({
        success: true,
        status: 'not_generated',
        message: 'Lesson has not been generated yet'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
