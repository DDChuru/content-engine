/**
 * Generate all narration audio for "AI Changes Everything" video
 * Uses ElevenLabs with Daniel's cloned voice (gYWKdgLtqjPO3D5uDrDP)
 *
 * Run: npx tsx scripts/generate-ai-changes-audio.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const VOICE_ID = 'gYWKdgLtqjPO3D5uDrDP'; // Daniel's ElevenLabs voice
const PROJECT_DIR = '/home/dachu/Documents/projects/content-engine/output/ai-changes-everything';
const TIKTOK_SCRIPTS = `${PROJECT_DIR}/scripts/tiktok-scripts.json`;
const YOUTUBE_SCRIPTS = `${PROJECT_DIR}/scripts/youtube-script.json`;
const TIKTOK_AUDIO_DIR = `${PROJECT_DIR}/audio/tiktok`;
const YOUTUBE_AUDIO_DIR = `${PROJECT_DIR}/audio/youtube`;

interface TikTokScript {
  id: string;
  title: string;
  script: string;
}

interface YouTubeScene {
  id: string;
  title: string;
  script: string;
}

async function generateAudio(text: string, voiceId: string, outputPath: string): Promise<boolean> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not set in environment');
  }

  console.log(`   Generating: ${path.basename(outputPath)}`);
  console.log(`   Text: "${text.substring(0, 60)}..."`);
  console.log(`   Characters: ${text.length}`);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.4,  // Slightly lower for more natural conversational tone
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(audioBuffer));

  console.log(`   ✅ Saved: ${outputPath}`);
  return true;
}

async function generateTikTokAudio(): Promise<{ success: number; chars: number }> {
  console.log('\n' + '='.repeat(60));
  console.log('  GENERATING TIKTOK AUDIO (6 videos)');
  console.log('='.repeat(60) + '\n');

  await fs.mkdir(TIKTOK_AUDIO_DIR, { recursive: true });

  const scriptsJson = await fs.readFile(TIKTOK_SCRIPTS, 'utf-8');
  const data = JSON.parse(scriptsJson);
  const videos = data.videos as TikTokScript[];

  let successCount = 0;
  let totalChars = 0;

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const outputPath = path.join(TIKTOK_AUDIO_DIR, `${video.id}.mp3`);

    console.log(`\n[${i + 1}/${videos.length}] ${video.title}`);

    try {
      await generateAudio(video.script, VOICE_ID, outputPath);
      successCount++;
      totalChars += video.script.length;
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Rate limiting
    if (i < videos.length - 1) {
      console.log('   ⏳ Waiting 1s (rate limit)...');
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return { success: successCount, chars: totalChars };
}

async function generateYouTubeAudio(): Promise<{ success: number; chars: number }> {
  console.log('\n' + '='.repeat(60));
  console.log('  GENERATING YOUTUBE AUDIO (26 scenes)');
  console.log('='.repeat(60) + '\n');

  await fs.mkdir(YOUTUBE_AUDIO_DIR, { recursive: true });

  const scriptsJson = await fs.readFile(YOUTUBE_SCRIPTS, 'utf-8');
  const data = JSON.parse(scriptsJson);
  const scenes = data.scenes as YouTubeScene[];

  let successCount = 0;
  let totalChars = 0;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const outputPath = path.join(YOUTUBE_AUDIO_DIR, `${String(i + 1).padStart(2, '0')}_${scene.id}.mp3`);

    console.log(`\n[${i + 1}/${scenes.length}] ${scene.title}`);

    try {
      await generateAudio(scene.script, VOICE_ID, outputPath);
      successCount++;
      totalChars += scene.script.length;
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Rate limiting
    if (i < scenes.length - 1) {
      console.log('   ⏳ Waiting 1s (rate limit)...');
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return { success: successCount, chars: totalChars };
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  AI CHANGES EVERYTHING - AUDIO GENERATION');
  console.log('  Voice: Daniel (ElevenLabs)');
  console.log('  Voice ID: ' + VOICE_ID);
  console.log('='.repeat(60));

  // Check API key
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('\n❌ ELEVENLABS_API_KEY not found in environment!');
    console.error('   Set it in .env file or export ELEVENLABS_API_KEY=...\n');
    process.exit(1);
  }

  const startTime = Date.now();

  // Generate TikTok audio
  const tiktokResult = await generateTikTokAudio();

  // Generate YouTube audio
  const youtubeResult = await generateYouTubeAudio();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalChars = tiktokResult.chars + youtubeResult.chars;
  const estimatedCost = (totalChars / 1000) * 0.30;

  console.log('\n' + '='.repeat(60));
  console.log('  AUDIO GENERATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`
  TikTok:  ${tiktokResult.success}/6 files (${tiktokResult.chars.toLocaleString()} chars)
  YouTube: ${youtubeResult.success}/26 files (${youtubeResult.chars.toLocaleString()} chars)

  Total Characters: ${totalChars.toLocaleString()}
  Estimated Cost: $${estimatedCost.toFixed(2)}
  Time Elapsed: ${elapsed}s

  Output Directories:
  - TikTok:  ${TIKTOK_AUDIO_DIR}
  - YouTube: ${YOUTUBE_AUDIO_DIR}
`);
  console.log('='.repeat(60) + '\n');

  // Write manifest
  const manifest = {
    generated: new Date().toISOString(),
    voiceId: VOICE_ID,
    voiceName: 'Daniel',
    provider: 'elevenlabs',
    tiktok: {
      files: tiktokResult.success,
      characters: tiktokResult.chars,
      directory: TIKTOK_AUDIO_DIR
    },
    youtube: {
      files: youtubeResult.success,
      characters: youtubeResult.chars,
      directory: YOUTUBE_AUDIO_DIR
    },
    totalCharacters: totalChars,
    estimatedCost: `$${estimatedCost.toFixed(2)}`
  };

  await fs.writeFile(
    path.join(PROJECT_DIR, 'audio', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('📋 Manifest saved to audio/manifest.json\n');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
