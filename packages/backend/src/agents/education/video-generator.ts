import ManimRenderer, { ManimScene } from '../../services/manim-renderer';
import VoiceCloning from '../../services/voice-cloning';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';

export interface VideoScript {
  segments: {
    title: string;
    narration: string;
    duration: number;
    visualType: 'manim' | 'gemini';
  }[];
}

export interface Module {
  id: string;
  title: string;
  concepts: Concept[];
  videoScript: VideoScript;
}

export interface Concept {
  name: string;
  description: string;
  type: 'theorem' | 'calculation' | 'proof' | 'application';
  metadata?: {
    theorem?: string;
    angle?: number;
    function?: string;
    [key: string]: any;
  };
}

export interface VideoResult {
  videoPath: string;
  scenes: Scene[];
  duration: number;
  cost: number;
}

export interface Scene {
  id: number;
  title: string;
  visual: string;
  audio: string;
  duration: number;
  type: 'manim' | 'gemini';
}

export class EducationalVideoGenerator {
  private manimRenderer: ManimRenderer;
  private voiceCloning: VoiceCloning;
  private gemini: GoogleGenerativeAI;
  private outputDir = 'output/education';

  constructor(
    geminiApiKey: string,
    elevenLabsApiKey: string
  ) {
    this.manimRenderer = new ManimRenderer();
    this.voiceCloning = new VoiceCloning(elevenLabsApiKey);
    this.gemini = new GoogleGenerativeAI(geminiApiKey);

    this.ensureDirectories();
  }

  /**
   * Ensure output directories exist
   */
  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.mkdir(`${this.outputDir}/videos`, { recursive: true });
    await fs.mkdir(`${this.outputDir}/audio`, { recursive: true });
    await fs.mkdir(`${this.outputDir}/images`, { recursive: true });
  }

  /**
   * Generate complete educational video for a module
   */
  async generateModuleVideo(
    module: Module,
    voiceId: string
  ): Promise<VideoResult> {
    console.log(`\n🎓 Generating educational video: ${module.title}`);
    console.log(`   Concepts: ${module.concepts.length}`);
    console.log(`   Segments: ${module.videoScript.segments.length}`);
    console.log(`   Voice ID: ${voiceId}`);

    const scenes: Scene[] = [];
    let totalCost = 0;

    // Process each segment
    for (let i = 0; i < module.videoScript.segments.length; i++) {
      const segment = module.videoScript.segments[i];
      const concept = module.concepts[i];

      console.log(`\n📹 Processing scene ${i + 1}/${module.videoScript.segments.length}: ${segment.title}`);

      // 1. Generate visual (Manim or Gemini)
      let visualPath: string;
      let visualCost = 0;

      if (segment.visualType === 'manim') {
        visualPath = await this.generateManimVisual(concept);
        visualCost = 0; // Manim is free!
      } else {
        const result = await this.generateGeminiVisual(concept);
        visualPath = result.path;
        visualCost = result.cost;
      }

      // 2. Generate narration with user's voice
      const audioPath = await this.generateNarration(
        segment.narration,
        voiceId,
        `scene_${i + 1}.mp3`
      );
      const audioCost = this.calculateNarrationCost(segment.narration);

      // 3. Add to scenes
      scenes.push({
        id: i + 1,
        title: segment.title,
        visual: visualPath,
        audio: audioPath,
        duration: segment.duration,
        type: segment.visualType
      });

      totalCost += visualCost + audioCost;

      console.log(`   ✅ Scene ${i + 1} complete (Cost: $${(visualCost + audioCost).toFixed(3)})`);
    }

    // Calculate total duration
    const duration = module.videoScript.segments.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    console.log(`\n✅ All scenes generated!`);
    console.log(`   Total scenes: ${scenes.length}`);
    console.log(`   Total duration: ${duration}s`);
    console.log(`   Total cost: $${totalCost.toFixed(2)}`);

    return {
      videoPath: '', // Will be filled by Remotion in next step
      scenes,
      duration,
      cost: totalCost
    };
  }

  /**
   * Generate Manim animation for mathematical concept
   */
  private async generateManimVisual(concept: Concept): Promise<string> {
    console.log(`   🎬 Generating Manim animation: ${concept.name}`);

    const manimScene: ManimScene = {
      sceneType: this.getManimSceneType(concept),
      concept: concept.name,
      parameters: {
        theorem: concept.metadata?.theorem || concept.name,
        angle: concept.metadata?.angle || 120,
        showProof: true,
        function: concept.metadata?.function,
        xValue: concept.metadata?.xValue,
        showTangent: concept.metadata?.showTangent
      }
    };

    const videoPath = await this.manimRenderer.renderAnimation(manimScene, 'low');

    console.log(`   ✅ Manim animation ready: ${videoPath}`);
    return videoPath;
  }

  /**
   * Generate Gemini image for non-mathematical content
   */
  private async generateGeminiVisual(concept: Concept): Promise<{ path: string; cost: number }> {
    console.log(`   🖼️  Generating Gemini image: ${concept.name}`);

    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

    // STRICT NO TEXT POLICY - Gemini often adds text which looks unprofessional
    const prompt = `Create a professional educational background image.

Visual concept: ${concept.name}
Visual elements: ${concept.description}

🚫 CRITICAL: NO TEXT in the image
- NO WORDS, NO LETTERS, NO NUMBERS
- NO labels, NO captions, NO titles
- PURE VISUAL ONLY - abstract shapes, gradients, illustrations
- Text will be added separately as overlays

Style requirements:
- Clean, professional educational aesthetic
- Clear, easy to understand visual metaphor
- High clarity, suitable for 1920x1080 video background
- Professional color palette (blues, purples, gradients)
- Not distracting - subtle and supportive
- Centered composition with clear focal area`;

    const result = await model.generateContent(prompt);
    const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData
    );

    if (!imagePart?.inlineData?.data) {
      throw new Error(`Image generation failed for concept: ${concept.name}`);
    }

    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    const imagePath = path.join(
      this.outputDir,
      'images',
      `${concept.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`
    );

    await fs.writeFile(imagePath, imageBuffer);

    console.log(`   ✅ Gemini image ready: ${imagePath}`);

    return {
      path: imagePath,
      cost: 0.039 // Gemini 2.5 Flash Image: $0.039 per image (1290 tokens @ $30/1M)
    };
  }

  /**
   * Generate narration with user's voice
   */
  private async generateNarration(
    text: string,
    voiceId: string,
    filename: string
  ): Promise<string> {
    console.log(`   🎙️  Generating narration (${text.length} chars)`);

    const audioBuffer = await this.voiceCloning.generateSpeech({
      text,
      voiceId,
      stability: 0.5,
      similarityBoost: 0.75,
      speakerBoost: true
    });

    const audioPath = path.join(this.outputDir, 'audio', filename);
    await fs.writeFile(audioPath, audioBuffer);

    console.log(`   ✅ Narration ready: ${audioPath}`);

    return audioPath;
  }

  /**
   * Determine Manim scene type from concept
   */
  private getManimSceneType(concept: Concept): 'circle_theorem' | 'differentiation' | 'graph' | 'geometry' {
    const name = concept.name.toLowerCase();

    // Check concept name and metadata for circle theorem indicators
    const hasCircleTheorem = name.includes('circle') || name.includes('theorem') || name.includes('tangent') ||
                             name.includes('example') || name.includes('angle') ||
                             concept.metadata?.theorem;

    if (hasCircleTheorem) {
      return 'circle_theorem';
    }

    if (name.includes('different') || name.includes('gradient') || name.includes('derivative')) {
      return 'differentiation';
    }

    if (name.includes('graph') || name.includes('plot')) {
      return 'graph';
    }

    return 'geometry';
  }

  /**
   * Decide if concept should use Manim or Gemini
   */
  shouldUseManim(concept: Concept): boolean {
    const manimKeywords = [
      'circle', 'theorem', 'angle', 'tangent', 'chord', 'radius',
      'differentiation', 'gradient', 'curve', 'stationary', 'derivative',
      'proof', 'construction', 'geometric', 'graph', 'function'
    ];

    const conceptText = `${concept.name} ${concept.description}`.toLowerCase();

    return manimKeywords.some(keyword => conceptText.includes(keyword));
  }

  /**
   * Calculate narration cost
   * ElevenLabs: ~$0.30 per 1000 characters
   */
  private calculateNarrationCost(text: string): number {
    return (text.length / 1000) * 0.30;
  }

  /**
   * Generate narration for all segments in batch
   */
  async generateAllNarration(
    segments: { text: string; filename: string }[],
    voiceId: string
  ): Promise<string[]> {
    return await this.voiceCloning.generateNarrationBatch(segments, voiceId);
  }

  /**
   * Clone voice from audio samples
   */
  async cloneVoice(name: string, audioSamples: Buffer[]): Promise<string> {
    console.log(`🎤 Cloning voice: ${name}`);
    console.log(`   Audio samples: ${audioSamples.length}`);

    // Validate audio
    const validation = this.voiceCloning.validateAudioForCloning(audioSamples);
    if (!validation.valid) {
      throw new Error(`Voice cloning validation failed: ${validation.message}`);
    }

    console.log(`   ✅ ${validation.message}`);

    const voiceId = await this.voiceCloning.cloneVoice({
      name,
      description: `Educational content voice for ${name}`,
      audioSamples
    });

    console.log(`   ✅ Voice cloned: ${voiceId}`);

    return voiceId;
  }

  /**
   * Test cloned voice
   */
  async testVoice(voiceId: string): Promise<Buffer> {
    return await this.voiceCloning.testVoice(
      voiceId,
      'Hello, this is a test of my cloned voice for educational content.'
    );
  }

  /**
   * List available voices
   */
  async listVoices() {
    return await this.voiceCloning.listVoices();
  }
}

export default EducationalVideoGenerator;
