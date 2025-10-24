#!/usr/bin/env ts-node

/**
 * CTA Overlay Test Script
 * Tests and demonstrates CTA overlay functionality
 */

import { CTAOverlay, CTAConfig, AnimatedCTAConfig } from './cta-overlay';
import * as path from 'path';

const ctaService = new CTAOverlay();

/**
 * Display FFmpeg filter examples
 */
async function displayFilterExamples(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('FFMPEG FILTER EXAMPLES');
  console.log('='.repeat(80));

  // Example 1: Simple CTA at top
  console.log('\n1. Simple CTA at Top (Last 3 seconds)');
  console.log('-'.repeat(80));
  const config1: CTAConfig = {
    text: 'Full video on YouTube 👆',
    position: 'top',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
  };
  const filter1 = await ctaService.previewCTAFilter(config1, 60);
  console.log('Config:', JSON.stringify(config1, null, 2));
  console.log('\nFFmpeg Filter:');
  console.log(filter1);

  // Example 2: Fade-in CTA
  console.log('\n\n2. Fade-in CTA (Animated)');
  console.log('-'.repeat(80));
  const config2: AnimatedCTAConfig = {
    text: 'Full video on YouTube 👆',
    position: 'top',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
    animation: 'fade',
  };
  const filter2 = await ctaService.previewCTAFilter(config2, 60);
  console.log('Config:', JSON.stringify(config2, null, 2));
  console.log('\nFFmpeg Filter:');
  console.log(filter2);

  // Example 3: Slide-in CTA from bottom
  console.log('\n\n3. Slide-in CTA from Bottom');
  console.log('-'.repeat(80));
  const config3: AnimatedCTAConfig = {
    text: 'Link in bio ☝️',
    position: 'bottom',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
    animation: 'slide',
  };
  const filter3 = await ctaService.previewCTAFilter(config3, 60);
  console.log('Config:', JSON.stringify(config3, null, 2));
  console.log('\nFFmpeg Filter:');
  console.log(filter3);

  // Example 4: Bounce effect CTA
  console.log('\n\n4. Bounce Effect CTA');
  console.log('-'.repeat(80));
  const config4: AnimatedCTAConfig = {
    text: 'Subscribe now! 🔔',
    position: 'top',
    fontSize: 40,
    fontColor: 'yellow',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
    animation: 'bounce',
  };
  const filter4 = await ctaService.previewCTAFilter(config4, 60);
  console.log('Config:', JSON.stringify(config4, null, 2));
  console.log('\nFFmpeg Filter:');
  console.log(filter4);

  // Example 5: Pulse effect CTA
  console.log('\n\n5. Pulse Effect CTA');
  console.log('-'.repeat(80));
  const config5: AnimatedCTAConfig = {
    text: 'Watch more! ⬆️',
    position: 'top',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'red',
    borderWidth: 3,
    duration: 3,
    animation: 'pulse',
  };
  const filter5 = await ctaService.previewCTAFilter(config5, 60);
  console.log('Config:', JSON.stringify(config5, null, 2));
  console.log('\nFFmpeg Filter:');
  console.log(filter5);

  // Example 6: CTA with background
  console.log('\n\n6. CTA with Background Box');
  console.log('-'.repeat(80));
  const config6: AnimatedCTAConfig = {
    text: 'Click here! 👆',
    position: 'top',
    fontSize: 45,
    fontColor: 'white',
    backgroundColor: 'black@0.7',
    borderColor: 'white',
    borderWidth: 2,
    duration: 3,
    animation: 'fade',
  };
  const filter6 = await ctaService.previewCTAFilter(config6, 60);
  console.log('Config:', JSON.stringify(config6, null, 2));
  console.log('\nFFmpeg Filter:');
  console.log(filter6);

  // Example 7: CTA with arrow
  console.log('\n\n7. CTA with Animated Arrow');
  console.log('-'.repeat(80));
  const config7: AnimatedCTAConfig = {
    text: 'Full video on YouTube',
    position: 'top',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
    animation: 'fade',
    arrow: true,
    arrowAnimation: true,
  };
  const filter7 = await ctaService.previewCTAFilter(config7, 60);
  console.log('Config:', JSON.stringify(config7, null, 2));
  console.log('\nFFmpeg Filter:');
  console.log(filter7);

  // Example 8: Custom timing
  console.log('\n\n8. Custom Timing CTA (Show at 10s)');
  console.log('-'.repeat(80));
  const config8: AnimatedCTAConfig = {
    text: 'Limited offer! 🎁',
    position: 'bottom',
    fontSize: 40,
    fontColor: 'red',
    borderColor: 'white',
    borderWidth: 3,
    startTime: 10,
    duration: 5,
    animation: 'bounce',
  };
  const filter8 = await ctaService.previewCTAFilter(config8, 60);
  console.log('Config:', JSON.stringify(config8, null, 2));
  console.log('\nFFmpeg Filter:');
  console.log(filter8);
}

/**
 * Display supported animations
 */
function displaySupportedAnimations(): void {
  console.log('\n' + '='.repeat(80));
  console.log('SUPPORTED ANIMATIONS');
  console.log('='.repeat(80));

  const animations = [
    {
      name: 'fade',
      description: 'Fade in over 1 second',
      useCase: 'Subtle, professional appearance',
      example: "alpha='if(lt(t,57),0,if(lt(t,58),(t-57),1))'",
    },
    {
      name: 'slide',
      description: 'Slide in from top or bottom',
      useCase: 'Dynamic entrance, catches attention',
      example: "y='if(lt(t,57),-text_h,if(lt(t,58),100*(t-57),100))'",
    },
    {
      name: 'bounce',
      description: 'Bounce effect using elastic easing',
      useCase: 'Playful, energetic content',
      example: "y='100-20*sin(2*PI*(t-57))*exp(-3*(t-57))'",
    },
    {
      name: 'pulse',
      description: 'Pulsing size effect',
      useCase: 'Draw continuous attention',
      example: "fontsize='40+5*sin(2*PI*(t-57))'",
    },
  ];

  animations.forEach((anim, index) => {
    console.log(`\n${index + 1}. ${anim.name.toUpperCase()}`);
    console.log(`   Description: ${anim.description}`);
    console.log(`   Use Case: ${anim.useCase}`);
    console.log(`   Example: ${anim.example}`);
  });
}

/**
 * Display font considerations
 */
async function displayFontConsiderations(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('FONT CONSIDERATIONS');
  console.log('='.repeat(80));

  console.log('\nDefault Font Paths (in priority order):');
  console.log('  1. /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf (Linux)');
  console.log('  2. /System/Library/Fonts/Supplemental/Arial Bold.ttf (macOS)');
  console.log('  3. /Windows/Fonts/arialbd.ttf (Windows)');
  console.log('  4. C:\\Windows\\Fonts\\arialbd.ttf (Windows alternative)');

  console.log('\nFallback Fonts:');
  console.log('  1. /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf');
  console.log('  2. /usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf');
  console.log('  3. /System/Library/Fonts/Helvetica.ttc');
  console.log('  4. /Windows/Fonts/arial.ttf');

  console.log('\nEmoji Support:');
  console.log('  - Supported emojis: 👆 ⬆️ ☝️ 🔔 🎁 🔗 and more');
  console.log('  - Font must support Unicode emoji characters');
  console.log('  - DejaVu fonts have good emoji support on Linux');
  console.log('  - Consider using emoji-specific fonts for better rendering');

  console.log('\nAvailable Fonts on This System:');
  const availableFonts = await ctaService.getAvailableFonts();
  if (availableFonts.length > 0) {
    availableFonts.forEach((font, index) => {
      console.log(`  ${index + 1}. ${font}`);
    });
  } else {
    console.log('  ⚠️  No fonts found! FFmpeg operations may fail.');
    console.log('  Please install fonts: sudo apt-get install fonts-dejavu-core');
  }

  console.log('\nFont Recommendations:');
  console.log('  - Use bold fonts for better readability on small screens');
  console.log('  - Font size 40-50 works well for TikTok (1080x1920)');
  console.log('  - Always add border (borderWidth: 3) for contrast');
  console.log('  - Test on actual mobile device to ensure readability');
}

/**
 * Display usage examples
 */
function displayUsageExamples(): void {
  console.log('\n' + '='.repeat(80));
  console.log('USAGE EXAMPLES');
  console.log('='.repeat(80));

  console.log('\n// Example 1: Add default CTA');
  console.log(`
import { ctaOverlay } from './cta-overlay';

const output = await ctaOverlay.addDefaultCTA('input.mp4');
console.log('Output:', output);
  `.trim());

  console.log('\n// Example 2: Add custom CTA');
  console.log(`
import { ctaOverlay } from './cta-overlay';

const output = await ctaOverlay.addCTA('input.mp4', {
  text: 'Watch full tutorial 👆',
  position: 'top',
  fontSize: 45,
  fontColor: 'yellow',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
});
  `.trim());

  console.log('\n// Example 3: Add animated CTA');
  console.log(`
import { ctaOverlay } from './cta-overlay';

const output = await ctaOverlay.addAnimatedCTA('input.mp4', {
  text: 'Subscribe now! 🔔',
  position: 'bottom',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'red',
  borderWidth: 3,
  duration: 3,
  animation: 'bounce',
  arrow: true,
  arrowAnimation: true,
});
  `.trim());

  console.log('\n// Example 4: Batch processing');
  console.log(`
import { ctaOverlay } from './cta-overlay';

const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4'];
const outputs = await ctaOverlay.addCTABatch(videos, {
  text: 'Full video on YouTube 👆',
  position: 'top',
  fontSize: 40,
  fontColor: 'white',
  borderColor: 'black',
  borderWidth: 3,
  duration: 3,
  animation: 'fade',
});
  `.trim());
}

/**
 * Display quality considerations
 */
function displayQualityConsiderations(): void {
  console.log('\n' + '='.repeat(80));
  console.log('QUALITY CONSIDERATIONS');
  console.log('='.repeat(80));

  console.log('\nVideo Quality:');
  console.log('  - Uses -c:a copy to preserve audio quality');
  console.log('  - Video re-encoding uses default FFmpeg settings');
  console.log('  - Consider adding -c:v libx264 -crf 18 for high quality');
  console.log('  - Or -c:v libx264 -crf 23 for balanced quality/size');

  console.log('\nText Readability:');
  console.log('  - Minimum font size: 35 (for 1080x1920)');
  console.log('  - Recommended font size: 40-50');
  console.log('  - Always use border for contrast (borderWidth: 3)');
  console.log('  - Consider background box for busy videos');

  console.log('\nPerformance:');
  console.log('  - Simple CTA: Fast processing (~1-2 seconds per video)');
  console.log('  - Animated CTA: Slightly slower due to complex filters');
  console.log('  - Batch processing: Process videos in parallel for speed');
  console.log('  - Cleanup temp files after processing');

  console.log('\nPlatform Compatibility:');
  console.log('  - TikTok: 1080x1920 (9:16 aspect ratio)');
  console.log('  - Instagram Reels: 1080x1920 (9:16 aspect ratio)');
  console.log('  - YouTube Shorts: 1080x1920 (9:16 aspect ratio)');
  console.log('  - Position "top" at 100px leaves room for profile pic');
  console.log('  - Position "bottom" at h-100px leaves room for captions');
}

/**
 * Main test function
 */
async function main(): Promise<void> {
  console.log('\n');
  console.log('█'.repeat(80));
  console.log('███' + ' '.repeat(74) + '███');
  console.log('███' + '  CTA OVERLAY SERVICE - TEST & DOCUMENTATION  '.padEnd(74) + '███');
  console.log('███' + ' '.repeat(74) + '███');
  console.log('█'.repeat(80));

  try {
    // Display all information
    await displayFilterExamples();
    displaySupportedAnimations();
    await displayFontConsiderations();
    displayUsageExamples();
    displayQualityConsiderations();

    console.log('\n' + '█'.repeat(80));
    console.log('███' + ' '.repeat(74) + '███');
    console.log('███' + '  TEST COMPLETED SUCCESSFULLY  '.padEnd(74) + '███');
    console.log('███' + ' '.repeat(74) + '███');
    console.log('█'.repeat(80));
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Error during testing:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default main;
