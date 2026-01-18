/**
 * KWINJI-15: The Bullet Header Legend - Video Generator
 *
 * Generates reference images and video clips for the TikTok video
 *
 * Usage:
 *   npm run generate-kwinji15
 *   npm run generate-kwinji15 -- --refs-only
 *   npm run generate-kwinji15 -- --video-only
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment from root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const PROJECT_DIR = path.resolve(process.cwd(), '../../projects/tiktok/makwinji-soma-phiri');
const OUTPUT_DIR = path.join(PROJECT_DIR, 'output');
const REFS_DIR = path.join(OUTPUT_DIR, 'references');
const CLIPS_DIR = path.join(OUTPUT_DIR, 'clips');

// ============================================================================
// REFERENCE IMAGE DEFINITIONS
// ============================================================================

const STYLE_REFERENCES = [
  {
    id: 'stadium-atmosphere',
    prompt: `1990s African football stadium at golden hour, packed with passionate fans waving colorful flags, dust particles visible in warm sunlight beams, vintage film photography aesthetic with natural grain, Bulawayo Zimbabwe atmosphere, authentic African football culture, no text, no logos, photorealistic, cinematic composition, 9:16 vertical aspect ratio`,
  },
  {
    id: 'documentary-color-grade',
    prompt: `Vintage African documentary film frame, warm golden tones, subtle film grain, nostalgic 1990s aesthetic, football-related scene with warm highlights and deep shadows, authentic archival footage look, no text, cinematic, 9:16 vertical`,
  },
  {
    id: 'highlanders-jersey-stripes',
    prompt: `Close-up of vintage 1990s black and white striped football jersey, Highlanders FC Zimbabwe Bosso style, fabric texture visible, dramatic lighting, floating against dark background, professional sports photography, no text, no logos, no faces, just the jersey, photorealistic, 9:16 vertical`,
  },
  {
    id: 'dynamos-jersey-blue',
    prompt: `Close-up of vintage 1990s blue and white football jersey, Dynamos FC Zimbabwe DeMbare style, fabric texture visible, dramatic lighting, floating against dark background, professional sports photography, no text, no logos, no faces, just the jersey, photorealistic, 9:16 vertical`,
  },
  {
    id: 'night-match-lighting',
    prompt: `African football stadium at night, powerful floodlights creating dramatic beams through light mist, 1990s Champions League atmosphere, crowd silhouettes visible, warm and cool lighting contrast, cinematic sports photography, no text, photorealistic, 9:16 vertical`,
  },
];

const CHARACTER_REFERENCE = {
  description: `Athletic African footballer, late 20s to early 30s, powerful muscular build especially upper body built for heading ability, confident determined expression, short hair typical of 1990s African footballers, dark skin, strong jawline, the presence of a goal scorer and leader, Zimbabwean`,
  pose: 'Standing tall with arms crossed, looking towards camera with quiet confidence',
  expression: 'Focused, determined, the look of a champion',
  clothing: 'Blue and white Dynamos-style football jersey, 1990s design',
  setting: 'African football stadium at golden hour, crowd blurred in background'
};

// ============================================================================
// VIDEO SCENE DEFINITIONS (for Veo 3.1)
// ============================================================================

const SCENES = [
  {
    id: 1,
    name: 'kwinji15-intro',
    duration: 8,
    prompt: `Dramatic slow-motion close-up of African footballer's intense eyes looking up at a cross coming in, sweat glistening on dark skin, stadium lights creating halo effect behind head, anticipation of a header, 1990s football aesthetic, cinematic tension, the moment before greatness, 9:16 vertical format, hyper-realistic, powerful athletic energy, Zimbabwean footballer`,
  },
  {
    id: 2,
    name: 'bullet-header-montage',
    duration: 8,
    prompt: `Explosive slow-motion montage of powerful header goals, African footballer in black and white striped jersey (Highlanders Bosso) leaping like a missile above defenders, neck muscles tensed with incredible power, ball ROCKETING off forehead like a bullet into goal, net exploding backwards from the sheer force, crowd erupting in wild celebration, dust and sweat flying through air, 1990s Barbourfields Stadium Bulawayo atmosphere, raw power and athleticism, 9:16 vertical format, peak sports action photography`,
  },
  {
    id: 3,
    name: 'bosso-love',
    duration: 6,
    prompt: `Passionate African football fans in black and white Highlanders colors celebrating their hero striker, Bosso supporters holding scarves high and singing, pure love and adoration, Barbourfields Stadium Bulawayo packed atmosphere, 1990s African football passion and culture, 9:16 vertical format, documentary style, authentic raw emotion, Zimbabwe`,
  },
  {
    id: 4,
    name: 'the-betrayal-transfer',
    duration: 8,
    prompt: `Dramatic tense scene of lone footballer walking through hostile angry crowd, people pointing and shouting in betrayal, black and white Highlanders jerseys visible, the weight of controversy on his shoulders, walking bravely towards blue and white Dynamos colors in the distance, cinematic tension and isolation, slow motion, the loneliest walk in Zimbabwean football history, 9:16 vertical format, emotional documentary style, 1994 atmosphere`,
  },
  {
    id: 5,
    name: 'dembare-redemption',
    duration: 6,
    prompt: `Footballer in blue and white Dynamos DeMbare jersey scoring trademark powerful bullet header goal, silencing all the doubters, Rufaro Stadium Harare crowd erupting in acceptance, former enemies now chanting his name in admiration, redemption through spectacular goals, slow motion celebration with new teammates embracing him, proving the controversial transfer was worth it, 9:16 vertical format, triumphant sports moment`,
  },
  {
    id: 6,
    name: 'champions-league-final',
    duration: 8,
    prompt: `Epic night match atmosphere CAF Champions League final 1998, Dynamos Zimbabwe vs ASEC Mimosas Ivory Coast, massive African stadium with powerful floodlights cutting through dramatic mist, the biggest stage in African club football, slow motion of two teams walking out of tunnel, electricity crackling in the air, history about to be made, 9:16 vertical format, cinematic broadcast quality, tension and magnitude`,
  },
  {
    id: 7,
    name: 'the-historic-goal',
    duration: 8,
    prompt: `THE historic moment - powerful African striker in blue Dynamos jersey rising MAJESTICALLY above all defenders, neck muscles coiled like a spring unleashing, forehead connecting perfectly with cross, ball EXPLODING into the net like a bullet, goalkeeper completely frozen, net rippling violently backwards from the tremendous power, arms spreading wide in glorious celebration, the only Zimbabwean to EVER score in a Champions League final, pure euphoria and history, 9:16 vertical format, slow motion glory, 1998`,
  },
  {
    id: 8,
    name: 'legacy-reflection',
    duration: 8,
    prompt: `Older distinguished African man in elegant suit sitting alone in empty stadium seats at golden sunset, looking out contemplatively at the pitch where he made history, nostalgic warm golden light washing over him, ghostly memories of past glories floating on the empty field, proud and reflective expression, the weight of a legendary career, a record still unbroken after 26 years, 9:16 vertical format, emotional documentary ending, bittersweet beauty and immortality`,
  },
];

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function generateReferences(gemini: GeminiImageGenerator): Promise<void> {
  console.log('\n📸 GENERATING STYLE REFERENCES...\n');

  await fs.mkdir(REFS_DIR, { recursive: true });

  for (const ref of STYLE_REFERENCES) {
    console.log(`━━━ ${ref.id} ━━━`);

    try {
      const result = await gemini.generateDirect({
        prompt: ref.prompt,
        outputDir: REFS_DIR,
        filename: `ref_${ref.id}`,
        aspectRatio: '9:16'
      });

      if (result.success) {
        console.log(`  ✓ Generated: ${result.imagePath}`);
        console.log(`  Cost: $${result.cost.toFixed(3)}`);
      } else {
        console.error(`  ✗ Failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error(`  ✗ Error: ${error.message}`);
    }

    // Rate limit
    await sleep(2000);
  }

  // Generate character reference
  console.log('\n👤 GENERATING CHARACTER REFERENCE...\n');

  try {
    const charResult = await gemini.generateCharacterReference({
      description: CHARACTER_REFERENCE.description,
      pose: CHARACTER_REFERENCE.pose,
      expression: CHARACTER_REFERENCE.expression,
      clothing: CHARACTER_REFERENCE.clothing,
      setting: CHARACTER_REFERENCE.setting,
      outputDir: REFS_DIR,
      filename: 'ref_character_makwinji',
      aspectRatio: '1:1'
    });

    if (charResult.success) {
      console.log(`  ✓ Character reference: ${charResult.imagePath}`);
      console.log(`  Cost: $${charResult.cost.toFixed(3)}`);
    } else {
      console.error(`  ✗ Failed: ${charResult.error}`);
    }
  } catch (error: any) {
    console.error(`  ✗ Error: ${error.message}`);
  }
}

async function previewScenes(): Promise<void> {
  console.log('\n🎬 VIDEO SCENES PREVIEW:\n');

  let totalDuration = 0;
  for (const scene of SCENES) {
    console.log(`Scene ${scene.id}: ${scene.name} (${scene.duration}s)`);
    console.log(`  ${scene.prompt.substring(0, 80)}...`);
    console.log('');
    totalDuration += scene.duration;
  }

  console.log(`📊 Total: ${SCENES.length} scenes, ${totalDuration}s duration`);
  console.log(`💰 Estimated Veo cost: $${(SCENES.length * 0.50).toFixed(2)}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const refsOnly = args.includes('--refs-only');
  const videoOnly = args.includes('--video-only');
  const preview = args.includes('--preview');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  KWINJI-15: THE BULLET HEADER LEGEND');
  console.log('  TikTok Video Generator');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Create directories
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(REFS_DIR, { recursive: true });
  await fs.mkdir(CLIPS_DIR, { recursive: true });

  if (preview) {
    await previewScenes();
    return;
  }

  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment');
    console.log('\nMake sure .env file exists in project root with:');
    console.log('  GEMINI_API_KEY=your_api_key_here');
    return;
  }

  console.log('✓ GEMINI_API_KEY found');

  const gemini = new GeminiImageGenerator(process.env.GEMINI_API_KEY);

  // Generate references
  if (!videoOnly) {
    await generateReferences(gemini);
  }

  // Generate video clips with Veo 3.1
  if (!refsOnly) {
    await previewScenes();

    console.log('\n🎬 GENERATING VEO 3.1 VIDEO CLIPS...\n');

    const { GoogleGenAI } = await import('@google/genai');
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    for (const scene of SCENES) {
      console.log(`━━━ Scene ${scene.id}: ${scene.name} (${scene.duration}s) ━━━`);

      try {
        // Start video generation
        console.log('  Starting Veo 3.1 generation...');

        const operation = await (genAI.models as any).generateVideos({
          model: 'veo-3.1-generate-preview',
          prompt: scene.prompt,
          config: {
            aspectRatio: '9:16',
            numberOfVideos: 1,
            durationSeconds: scene.duration,
          }
        });

        console.log('  ⏳ Generation started, polling for completion...');

        // Poll for completion
        let result = operation;
        let attempts = 0;
        const maxAttempts = 60; // 10 minutes max

        while (!result.done && attempts < maxAttempts) {
          await sleep(10000); // Wait 10 seconds
          attempts++;
          console.log(`  Polling... (${attempts * 10}s elapsed)`);

          try {
            result = await (genAI.operations as any).getVideosOperation({ operation: result });
          } catch (e) {
            // Continue polling
          }
        }

        if (result.done && result.videos && result.videos.length > 0) {
          // Download and save video
          const video = result.videos[0];
          const videoPath = path.join(CLIPS_DIR, `scene_${String(scene.id).padStart(2, '0')}_${scene.name}.mp4`);

          console.log('  Downloading video...');
          const response = await fetch(video.uri);
          const buffer = Buffer.from(await response.arrayBuffer());
          await fs.writeFile(videoPath, buffer);

          console.log(`  ✓ Saved: ${videoPath}`);
          console.log(`  Cost: ~$0.50`);
        } else {
          console.log('  ✗ Generation timed out or failed');
        }

      } catch (error: any) {
        console.error(`  ✗ Error: ${error.message}`);

        // Check if it's a model access error
        if (error.message?.includes('not found') || error.message?.includes('permission')) {
          console.log('\n⚠️  Veo 3.1 access not available on this API key.');
          console.log('  Options:');
          console.log('  1. Apply for Veo access at https://aistudio.google.com');
          console.log('  2. Use Google AI Studio web interface directly');
          console.log('  3. Use Flow (https://flow.google.com) for video generation');
          break;
        }
      }

      // Rate limit between scenes
      await sleep(5000);
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Output directory: ${OUTPUT_DIR}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
