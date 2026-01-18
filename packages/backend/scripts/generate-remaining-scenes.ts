/**
 * KWINJI-15: Generate Remaining Scenes (6, 7, 8)
 *
 * With REAL reference image and NARRATION in prompts
 */

import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const PROJECT_DIR = path.resolve(process.cwd(), '../../projects/tiktok/makwinji-soma-phiri');
const OUTPUT_DIR = path.join(PROJECT_DIR, 'output/clips');
const REFS_DIR = path.join(PROJECT_DIR, 'output/references');

// Real photo of Makwinji Soma-Phiri for face consistency
const REAL_PHOTO = path.join(REFS_DIR, 'ref_kwinji15_real.png');

// Remaining scenes with NARRATION included
const REMAINING_SCENES = [
  {
    id: 6,
    name: 'champions-league-final',
    duration: 8,
    prompt: `NARRATOR (deep dramatic voice): "1998. The African Champions League Final. The biggest stage in African club football."

Cinematic slow-motion scene of a massive African football stadium at night, powerful floodlights cutting through dramatic mist, two teams walking out of tunnel side by side, electricity in the air, packed stands with passionate fans waving flags, the anticipation before the greatest match, broadcast quality cinematography, 9:16 vertical format, epic sports documentary style, tension and magnitude of history about to be made.`,
  },
  {
    id: 7,
    name: 'the-historic-goal',
    duration: 8,
    prompt: `NARRATOR (building excitement): "And then... the moment that would live FOREVER! KWINJI-15 rises... THE BULLET HEADER!"

THE historic moment - powerful African striker number 15 in blue jersey RISING MAJESTICALLY above all defenders, neck muscles coiled like a spring, forehead connecting PERFECTLY with the cross, ball EXPLODING into the goal like a bullet, goalkeeper completely frozen, net rippling violently from tremendous power, stadium ERUPTING in wild celebration, slow motion glory, pure euphoria, the only man to EVER score in a CAF Champions League final, 9:16 vertical format, peak sports cinematography.`,
  },
  {
    id: 8,
    name: 'legacy-reflection',
    duration: 8,
    prompt: `NARRATOR (warm, reflective): "26 years later... his record still stands. The only man to score in a CAF Champions League Final. KWINJI-15. The Bullet Header Legend."

Older distinguished African man in elegant suit sitting alone in empty stadium seats at golden sunset, looking out contemplatively at the pitch where he made history, nostalgic warm golden light washing over proud face, the weight of a legendary career, empty stands echoing with memories of roaring crowds, bittersweet beauty of sporting immortality, 9:16 vertical format, emotional documentary ending, cinematic and poetic.`,
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadReferenceImage(): Promise<string | null> {
  try {
    const imageBuffer = await fs.readFile(REAL_PHOTO);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.log('⚠️ Could not load reference image, proceeding without it');
    return null;
  }
}

async function generateScene(
  genAI: GoogleGenAI,
  scene: typeof REMAINING_SCENES[0],
  apiKey: string,
  referenceImageBase64: string | null
): Promise<boolean> {
  console.log(`\n━━━ Scene ${scene.id}: ${scene.name} (${scene.duration}s) ━━━`);
  console.log(`  Prompt preview: ${scene.prompt.substring(0, 80)}...`);

  try {
    console.log('  🚀 Starting generation...');
    const startTime = Date.now();

    // Build generation config
    const generationConfig: any = {
      model: 'veo-3.1-generate-preview',
      prompt: scene.prompt,
      config: {
        aspectRatio: '9:16',
        numberOfVideos: 1,
        durationSeconds: scene.duration,
      }
    };

    // Add reference image if available
    if (referenceImageBase64) {
      console.log('  📸 Including reference image for consistency');
      generationConfig.referenceImages = [{
        referenceImage: {
          imageBytes: referenceImageBase64,
        },
        referenceType: 'REFERENCE_TYPE_STYLE',
      }];
    }

    const operation = await (genAI.models as any).generateVideos(generationConfig);

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
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  KWINJI-15: REMAINING SCENES (6, 7, 8)');
  console.log('  With Reference Image + Narration');
  console.log('═══════════════════════════════════════════════════════════════');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found');
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Load real photo of Kwinji-15
  console.log('\n📸 Loading reference image of Makwinji Soma-Phiri...');
  const referenceImageBase64 = await loadReferenceImage();
  if (referenceImageBase64) {
    console.log('  ✓ Reference image loaded');
  }

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const apiKey = process.env.GEMINI_API_KEY;

  let successCount = 0;

  console.log(`\n📊 Generating ${REMAINING_SCENES.length} scenes...`);
  console.log(`💰 Estimated cost: $${(REMAINING_SCENES.length * 0.50).toFixed(2)}`);

  for (const scene of REMAINING_SCENES) {
    const success = await generateScene(genAI, scene, apiKey, referenceImageBase64);
    if (success) successCount++;

    // Longer wait between scenes to avoid rate limits
    if (scene.id < 8) {
      console.log('\n  ⏸️ Waiting 30s before next scene (avoiding rate limits)...');
      await sleep(30000);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  GENERATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Success: ${successCount}/${REMAINING_SCENES.length} scenes`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
