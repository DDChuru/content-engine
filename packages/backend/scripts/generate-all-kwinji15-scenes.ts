/**
 * KWINJI-15: Generate ALL 8 Veo Video Scenes
 *
 * Fixed version with correct response path
 */

import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const PROJECT_DIR = path.resolve(process.cwd(), '../../projects/tiktok/makwinji-soma-phiri');
const OUTPUT_DIR = path.join(PROJECT_DIR, 'output/clips');
const REFS_DIR = path.join(PROJECT_DIR, 'output/references');

// Reference image paths for consistency
const REFS = {
  character: path.join(REFS_DIR, 'ref_character_makwinji.jpg'),
  stadium: path.join(REFS_DIR, 'ref_stadium-atmosphere.jpg'),
  documentary: path.join(REFS_DIR, 'ref_documentary-color-grade.jpg'),
  bossoJersey: path.join(REFS_DIR, 'ref_highlanders-jersey-stripes.jpg'),
  dembareJersey: path.join(REFS_DIR, 'ref_dynamos-jersey-blue.jpg'),
  nightMatch: path.join(REFS_DIR, 'ref_night-match-lighting.jpg'),
};

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
    prompt: `Explosive slow-motion montage of powerful header goals, African footballer in black and white striped jersey leaping like a missile above defenders, neck muscles tensed with incredible power, ball ROCKETING off forehead like a bullet into goal, net exploding backwards from the sheer force, crowd erupting in wild celebration, dust and sweat flying through air, 1990s African stadium atmosphere, raw power and athleticism, 9:16 vertical format, peak sports action photography`,
  },
  {
    id: 3,
    name: 'bosso-love',
    duration: 6,
    prompt: `Passionate African football fans in black and white colors celebrating their hero striker, supporters holding scarves high and singing, pure love and adoration, packed stadium atmosphere, 1990s African football passion and culture, 9:16 vertical format, documentary style, authentic raw emotion, Zimbabwe`,
  },
  {
    id: 4,
    name: 'the-betrayal-transfer',
    duration: 8,
    prompt: `Dramatic tense scene of lone footballer walking through hostile angry crowd, people pointing and shouting in betrayal, black and white jerseys visible, the weight of controversy on his shoulders, walking bravely towards blue and white colors in the distance, cinematic tension and isolation, slow motion, the loneliest walk in football history, 9:16 vertical format, emotional documentary style`,
  },
  {
    id: 5,
    name: 'dembare-redemption',
    duration: 6,
    prompt: `Footballer in blue and white jersey scoring trademark powerful bullet header goal, silencing all the doubters, stadium crowd erupting in acceptance, former enemies now chanting his name in admiration, redemption through spectacular goals, slow motion celebration with new teammates embracing him, 9:16 vertical format, triumphant sports moment`,
  },
  {
    id: 6,
    name: 'champions-league-final',
    duration: 8,
    prompt: `Epic night match atmosphere African Champions League final 1998, massive stadium with powerful floodlights cutting through dramatic mist, the biggest stage in African club football, slow motion of two teams walking out of tunnel, electricity crackling in the air, history about to be made, 9:16 vertical format, cinematic broadcast quality, tension and magnitude`,
  },
  {
    id: 7,
    name: 'the-historic-goal',
    duration: 8,
    prompt: `THE historic moment - powerful African striker in blue jersey rising MAJESTICALLY above all defenders, neck muscles coiled like a spring unleashing, forehead connecting perfectly with cross, ball EXPLODING into the net like a bullet, goalkeeper completely frozen, net rippling violently backwards from the tremendous power, arms spreading wide in glorious celebration, the only one to EVER score in the final, pure euphoria and history, 9:16 vertical format, slow motion glory`,
  },
  {
    id: 8,
    name: 'legacy-reflection',
    duration: 8,
    prompt: `Older distinguished African man in elegant suit sitting alone in empty stadium seats at golden sunset, looking out contemplatively at the pitch where he made history, nostalgic warm golden light washing over him, proud and reflective expression, the weight of a legendary career, a record still unbroken after 26 years, 9:16 vertical format, emotional documentary ending, bittersweet beauty and immortality`,
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateScene(genAI: GoogleGenAI, scene: typeof SCENES[0], apiKey: string): Promise<boolean> {
  console.log(`\n━━━ Scene ${scene.id}: ${scene.name} (${scene.duration}s) ━━━`);
  console.log(`  Prompt: ${scene.prompt.substring(0, 60)}...`);

  try {
    console.log('  🚀 Starting generation...');
    const startTime = Date.now();

    const operation = await (genAI.models as any).generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: scene.prompt,
      config: {
        aspectRatio: '9:16',
        numberOfVideos: 1,
        durationSeconds: scene.duration,
      }
    });

    console.log(`  ⏳ Operation: ${operation.name}`);

    // Poll for completion (max 5 minutes)
    let result = operation;
    for (let i = 0; i < 30; i++) {
      await sleep(10000);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);

      try {
        result = await (genAI.operations as any).getVideosOperation({ operation: result });

        if (result.done) {
          console.log(`  ✅ Complete after ${elapsed}s`);

          // Get video URI from correct path
          const videoData = result.response?.generatedVideos?.[0]?.video;
          if (videoData?.uri) {
            console.log('  📥 Downloading...');

            const response = await fetch(`${videoData.uri}&key=${apiKey}`);
            if (response.ok) {
              const buffer = Buffer.from(await response.arrayBuffer());
              const outputPath = path.join(OUTPUT_DIR, `scene_${String(scene.id).padStart(2, '0')}_${scene.name}.mp4`);
              await fs.writeFile(outputPath, buffer);

              console.log(`  ✓ Saved: ${outputPath}`);
              console.log(`  Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
              return true;
            } else {
              console.log(`  ✗ Download failed: ${response.status}`);
            }
          } else {
            console.log('  ✗ No video URI in response');
            console.log('  Response:', JSON.stringify(result, null, 2).substring(0, 500));
          }
          break;
        }
      } catch (e: any) {
        // Continue polling
      }

      process.stdout.write(`  Polling... ${elapsed}s\r`);
    }

    if (!result.done) {
      console.log('  ✗ Timed out after 5 minutes');
    }

  } catch (error: any) {
    console.error(`  ✗ Error: ${error.message}`);
  }

  return false;
}

async function main() {
  const startScene = parseInt(process.argv[2]) || 1;

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  KWINJI-15: THE BULLET HEADER LEGEND');
  console.log('  Generating All Video Scenes');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\nStarting from scene: ${startScene}`);

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found');
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const apiKey = process.env.GEMINI_API_KEY;

  let successCount = 0;
  const scenesToGenerate = SCENES.filter(s => s.id >= startScene);

  console.log(`\n📊 Generating ${scenesToGenerate.length} scenes...`);
  console.log(`💰 Estimated cost: $${(scenesToGenerate.length * 0.50).toFixed(2)}`);

  for (const scene of scenesToGenerate) {
    const success = await generateScene(genAI, scene, apiKey);
    if (success) successCount++;

    // Wait between scenes
    if (scene.id < SCENES.length) {
      console.log('\n  ⏸️ Waiting 10s before next scene...');
      await sleep(10000);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Success: ${successCount}/${scenesToGenerate.length} scenes`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
