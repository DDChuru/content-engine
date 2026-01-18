/**
 * Generate images and narration for the expanded Edgar Tekere documentary
 *
 * Usage: npx tsx scripts/generate-expanded-documentary.ts
 */

import fs from 'fs/promises';
import path from 'path';

const API_URL = 'http://localhost:3001';
const CHATTERBOX_URL = 'http://localhost:8765';
const PROJECT_FILE = './output/journalist-projects/edgar-tekere-documentary-expanded.json';
const IMAGE_DIR = './output/journalist-images';
const AUDIO_DIR = './src/remotion/public/audio/documentary-expanded';

interface Scene {
  id: string;
  title: string;
  narration: string;
  imagePrompt: string;
  imageUrl: string | null;
  duration: number;
}

async function generateImage(prompt: string, sceneId: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/api/images/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ prompt })
    });

    if (!response.ok) {
      console.error(`  Image generation failed: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.imageUrl?.startsWith('data:image')) {
      // Extract base64 data and save
      const base64Data = data.imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const filename = `edgar-tekere-expanded_scene_${sceneId}_${Date.now()}.png`;
      const filepath = path.join(IMAGE_DIR, filename);

      await fs.mkdir(IMAGE_DIR, { recursive: true });
      await fs.writeFile(filepath, buffer);

      return `/output/journalist-images/${filename}`;
    }

    return data.imageUrl || null;
  } catch (error: any) {
    console.error(`  Image error: ${error.message}`);
    return null;
  }
}

async function generateNarration(text: string, sceneId: string): Promise<string | null> {
  try {
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('voice_id', 'daniel');
    formData.append('exaggeration', '0.6');
    formData.append('cfg_weight', '0.5');

    const response = await fetch(`${CHATTERBOX_URL}/generate`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.error(`  Narration generation failed: ${response.status}`);
      return null;
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    await fs.mkdir(AUDIO_DIR, { recursive: true });
    const filename = `scene_${sceneId}.wav`;
    const filepath = path.join(AUDIO_DIR, filename);

    await fs.writeFile(filepath, audioBuffer);

    return filepath;
  } catch (error: any) {
    console.error(`  Narration error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('  EXPANDED DOCUMENTARY GENERATOR');
  console.log('  Edgar Tekere - Extended Cut');
  console.log('='.repeat(60));
  console.log();

  // Load project
  const projectData = await fs.readFile(PROJECT_FILE, 'utf-8');
  const project = JSON.parse(projectData);

  console.log(`Project: ${project.name}`);
  console.log(`Scenes: ${project.scenes.length}`);
  console.log();

  // Process each scene
  for (let i = 0; i < project.scenes.length; i++) {
    const scene = project.scenes[i] as Scene;
    console.log(`[${i + 1}/${project.scenes.length}] Scene ${scene.id}: ${scene.title}`);

    // Generate image if missing
    if (!scene.imageUrl) {
      console.log(`  Generating image...`);
      const imageUrl = await generateImage(scene.imagePrompt, scene.id);
      if (imageUrl) {
        scene.imageUrl = imageUrl;
        console.log(`  ✓ Image saved: ${imageUrl}`);
      } else {
        console.log(`  ✗ Image generation failed`);
      }
    } else {
      console.log(`  Image exists: ${scene.imageUrl}`);
    }

    // Generate narration
    console.log(`  Generating narration: "${scene.narration.substring(0, 50)}..."`);
    const audioPath = await generateNarration(scene.narration, scene.id);
    if (audioPath) {
      console.log(`  ✓ Audio saved: ${audioPath}`);
    } else {
      console.log(`  ✗ Narration generation failed`);
    }

    console.log();

    // Rate limiting
    if (i < project.scenes.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Save updated project
  await fs.writeFile(PROJECT_FILE, JSON.stringify(project, null, 2));
  console.log(`Project saved: ${PROJECT_FILE}`);

  console.log();
  console.log('='.repeat(60));
  console.log('  GENERATION COMPLETE');
  console.log('='.repeat(60));
}

main().catch(console.error);
