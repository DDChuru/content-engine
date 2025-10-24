/**
 * Test AI Video Generation with Veo 3.1
 *
 * Tests Workflow B: Text → Veo 3.1 → Multilingual TikToks
 *
 * Usage:
 *   npx tsx src/services/tiktok/test-ai-generation.ts
 */

import 'dotenv/config';
import { UnifiedTikTokGenerator } from './unified-tiktok-generator.js';
import { VeoVideoGenerator } from './veo-video-generator.js';

const VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID || '';
const TEST_LANGUAGES = ['en', 'sn'];

async function testAIGeneration() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║         🤖 TESTING AI VIDEO GENERATION (VEO 3.1)               ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  if (!VOICE_ID) {
    console.error('❌ Error: ELEVENLABS_DEFAULT_VOICE_ID not set in .env');
    process.exit(1);
  }

  // Test 1: Validate Veo 3.1 Access
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: Validating Veo 3.1 API Access');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const veo = new VeoVideoGenerator();
  const hasAccess = await veo.validateAccess();

  if (!hasAccess) {
    console.log('❌ Veo 3.1 API access not configured');
    console.log('\nTo get access:');
    console.log('1. Visit: https://console.cloud.google.com');
    console.log('2. Enable Vertex AI API');
    console.log('3. Request Veo 3.1 preview access');
    console.log('4. Add GOOGLE_CLOUD_PROJECT_ID to .env\n');
    return;
  }

  console.log('✅ Veo 3.1 API access validated!\n');

  // Test 2: Generate a Simple Video
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Generate Single Video with Veo 3.1');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const testPrompt = 'A breathtaking aerial view of Victoria Falls in Zimbabwe, with dramatic waterfalls cascading down, rainbow mist rising, and lush green landscape surrounding the falls. Cinematic, vibrant colors, golden hour lighting.';

  console.log(`📝 Prompt: "${testPrompt.substring(0, 80)}..."\n`);
  console.log('⏳ Generating video with Veo 3.1...');

  try {
    const result = await veo.generateVideo({
      prompt: testPrompt,
      duration: 30,
      aspectRatio: '9:16',
      style: 'cinematic',
      motion: 'high',
    });

    console.log('\n✅ Video Generated Successfully!\n');
    console.log('📹 Video Details:');
    console.log(`   Duration: ${result.duration} seconds`);
    console.log(`   Resolution: ${result.resolution}`);
    console.log(`   Format: ${result.metadata.aspectRatio}`);
    console.log(`   Model: ${result.metadata.model}`);
    console.log(`   Generation Time: ${(result.generationTime / 1000).toFixed(2)}s`);
    console.log(`   Estimated Cost: $${result.cost.toFixed(4)}\n`);

    if (result.videoUrl && result.videoUrl !== 'simulated-veo-video-url') {
      console.log(`📥 Video URL: ${result.videoUrl}\n`);
    } else {
      console.log('⚠️  Note: This is a simulated response.');
      console.log('   Actual video generation requires full Veo 3.1 API access.\n');
    }

  } catch (error: any) {
    console.error('\n❌ Video generation failed:', error.message);

    if (error.message.includes('403') || error.message.includes('permission')) {
      console.log('\n💡 This likely means:');
      console.log('   • You need to request Veo 3.1 preview access');
      console.log('   • Visit: https://cloud.google.com/vertex-ai/docs/generative-ai/video');
    }

    if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('\n💡 This likely means:');
      console.log('   • Veo 3.1 API endpoint may have changed');
      console.log('   • You may need a different region or API version');
    }

    console.log('\n');
    return;
  }

  // Test 3: Full Workflow B (AI → Multilingual TikToks)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Full Workflow B (AI → Multilingual TikToks)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const generator = new UnifiedTikTokGenerator();

  const script = 'Discover Victoria Falls, Zimbabwe! One of the Seven Natural Wonders of the World. Experience the power of nature!';

  console.log(`📝 Script: "${script}"`);
  console.log(`🌍 Languages: ${TEST_LANGUAGES.join(', ')}`);
  console.log(`🎤 Voice ID: ${VOICE_ID.substring(0, 15)}...\n`);

  console.log('⏳ Generating multilingual TikTok videos...\n');

  try {
    const result = await generator.generate({
      type: 'ai-generated',
      script: script,
      videoDuration: 30,
      videoStyle: 'cinematic',
      languages: TEST_LANGUAGES,
      voiceId: VOICE_ID,
    });

    console.log('\n✅ WORKFLOW B COMPLETE!\n');
    console.log('📊 Results:');
    console.log(`   Workflow: ${result.workflow}`);
    console.log(`   Videos Generated: ${result.videos.length}`);
    console.log(`   Total Cost: $${result.totalCost.toFixed(4)}`);
    console.log(`   Processing Time: ${(result.processingTime / 1000).toFixed(2)}s\n`);

    console.log('📹 Generated Videos:');
    result.videos.forEach((video, i) => {
      console.log(`   ${i + 1}. ${video.language.toUpperCase()}: ${video.path}`);
      console.log(`      Duration: ${video.duration}s`);
    });

    console.log('\n🎯 Next Steps:');
    console.log('   1. Check output directory for generated videos');
    console.log('   2. Review and adjust caption styles if needed');
    console.log('   3. Upload to TikTok!\n');

  } catch (error: any) {
    console.error('\n❌ Workflow B failed:', error.message);
    console.log('\n💡 Note: Full workflow requires:');
    console.log('   • Working Veo 3.1 API access');
    console.log('   • ElevenLabs API access (you have this ✅)');
    console.log('   • Gemini API access (you have this ✅)');
    console.log('   • FFmpeg installed on system\n');
  }

  // Show Cost Breakdown
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('COST BREAKDOWN (Workflow B)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const costs = generator.estimateCosts({
    type: 'ai-generated',
    script: script,
    videoDuration: 30,
    languages: TEST_LANGUAGES,
    voiceId: VOICE_ID,
  });

  console.log('💰 Estimated Costs:');
  console.log(`   Veo 3.1 Video Generation: $${costs.veoGeneration.toFixed(4)}`);
  console.log(`   Translation (Gemini):     $${costs.translation.toFixed(4)}`);
  console.log(`   Voice Generation (11Labs): $${costs.voice.toFixed(4)}`);
  console.log(`   ─────────────────────────────────────`);
  console.log(`   Total:                     $${costs.total.toFixed(4)}`);
  console.log(`   Per Video:                 $${(costs.total / TEST_LANGUAGES.length).toFixed(4)}\n`);

  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║                  ✅ AI GENERATION TEST COMPLETE                  ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');
}

// Run the test
testAIGeneration().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
