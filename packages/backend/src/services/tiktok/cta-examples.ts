/**
 * CTA Overlay Examples
 * Demonstrates various CTA configurations and use cases
 */

import { CTAOverlay, CTAConfig, AnimatedCTAConfig } from './cta-overlay';

const ctaService = new CTAOverlay();

/**
 * Example 1: Simple CTA at top for last 3 seconds
 */
export async function example1SimpleCTA(videoPath: string): Promise<void> {
  console.log('\n=== Example 1: Simple CTA at Top ===');

  const config: CTAConfig = {
    text: 'Full video on YouTube 👆',
    position: 'top',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3, // Show for last 3 seconds
  };

  const outputPath = await ctaService.addCTA(videoPath, config);
  console.log('✓ Simple CTA added:', outputPath);

  // Preview the filter
  const filter = await ctaService.previewCTAFilter(config, 60);
  console.log('Filter used:', filter);
}

/**
 * Example 2: Animated fade-in CTA
 */
export async function example2FadeInCTA(videoPath: string): Promise<void> {
  console.log('\n=== Example 2: Animated Fade-in CTA ===');

  const config: AnimatedCTAConfig = {
    text: 'Full video on YouTube 👆',
    position: 'top',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
    animation: 'fade',
  };

  const outputPath = await ctaService.addAnimatedCTA(videoPath, config);
  console.log('✓ Fade-in CTA added:', outputPath);

  // Preview the filter
  const filter = await ctaService.previewCTAFilter(config, 60);
  console.log('Filter used:', filter);
}

/**
 * Example 3: CTA with custom styling and background
 */
export async function example3StyledCTA(videoPath: string): Promise<void> {
  console.log('\n=== Example 3: Styled CTA with Background ===');

  const config: AnimatedCTAConfig = {
    text: 'Watch the full tutorial ⬆️',
    position: 'top',
    fontSize: 45,
    fontColor: 'yellow',
    backgroundColor: 'black@0.7', // Semi-transparent black
    borderColor: 'yellow',
    borderWidth: 2,
    duration: 4,
    animation: 'pulse',
  };

  const outputPath = await ctaService.addAnimatedCTA(videoPath, config);
  console.log('✓ Styled CTA added:', outputPath);

  // Preview the filter
  const filter = await ctaService.previewCTAFilter(config, 60);
  console.log('Filter used:', filter);
}

/**
 * Example 4: Slide-in CTA from bottom
 */
export async function example4SlideCTA(videoPath: string): Promise<void> {
  console.log('\n=== Example 4: Slide-in CTA from Bottom ===');

  const config: AnimatedCTAConfig = {
    text: 'Link in bio ☝️',
    position: 'bottom',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
    animation: 'slide',
  };

  const outputPath = await ctaService.addAnimatedCTA(videoPath, config);
  console.log('✓ Slide-in CTA added:', outputPath);

  // Preview the filter
  const filter = await ctaService.previewCTAFilter(config, 60);
  console.log('Filter used:', filter);
}

/**
 * Example 5: Bounce effect CTA with arrow
 */
export async function example5BounceCTA(videoPath: string): Promise<void> {
  console.log('\n=== Example 5: Bounce CTA with Animated Arrow ===');

  const config: AnimatedCTAConfig = {
    text: 'Full video on YouTube',
    position: 'top',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
    animation: 'bounce',
    arrow: true,
    arrowAnimation: true,
  };

  const outputPath = await ctaService.addAnimatedCTA(videoPath, config);
  console.log('✓ Bounce CTA with arrow added:', outputPath);

  // Preview the filter
  const filter = await ctaService.previewCTAFilter(config, 60);
  console.log('Filter used:', filter);
}

/**
 * Example 6: Using the convenience method for styled CTA
 */
export async function example6ConvenienceMethod(videoPath: string): Promise<void> {
  console.log('\n=== Example 6: Using Styled CTA Method ===');

  const outputPath = await ctaService.addStyledCTA(
    videoPath,
    'Subscribe for more! 🔔',
    {
      position: 'bottom',
      animation: 'fade',
      backgroundColor: 'red@0.8',
      fontColor: 'white',
      fontSize: 42,
      showArrow: true,
      animateArrow: true,
    }
  );

  console.log('✓ Styled CTA added:', outputPath);
}

/**
 * Example 7: Using default CTA
 */
export async function example7DefaultCTA(videoPath: string): Promise<void> {
  console.log('\n=== Example 7: Default CTA ===');

  const outputPath = await ctaService.addDefaultCTA(videoPath);
  console.log('✓ Default CTA added:', outputPath);
}

/**
 * Example 8: Using default animated CTA
 */
export async function example8DefaultAnimatedCTA(videoPath: string): Promise<void> {
  console.log('\n=== Example 8: Default Animated CTA ===');

  const outputPath = await ctaService.addDefaultAnimatedCTA(videoPath);
  console.log('✓ Default animated CTA added:', outputPath);
}

/**
 * Example 9: Batch processing multiple videos
 */
export async function example9BatchProcessing(videoPaths: string[]): Promise<void> {
  console.log('\n=== Example 9: Batch Processing ===');

  const config: AnimatedCTAConfig = {
    text: 'Full video on YouTube 👆',
    position: 'top',
    fontSize: 40,
    fontColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    duration: 3,
    animation: 'fade',
  };

  const outputPaths = await ctaService.addCTABatch(videoPaths, config);
  console.log(`✓ Batch processed ${outputPaths.length} videos`);
  outputPaths.forEach((path, index) => {
    console.log(`  ${index + 1}. ${path}`);
  });
}

/**
 * Example 10: Custom timing - show CTA at specific time
 */
export async function example10CustomTiming(videoPath: string): Promise<void> {
  console.log('\n=== Example 10: Custom Timing ===');

  const config: AnimatedCTAConfig = {
    text: 'Check out the link! 🔗',
    position: 'top',
    fontSize: 40,
    fontColor: 'cyan',
    borderColor: 'black',
    borderWidth: 3,
    startTime: 10, // Show at 10 seconds
    duration: 5,   // Show for 5 seconds
    animation: 'fade',
  };

  const outputPath = await ctaService.addAnimatedCTA(videoPath, config);
  console.log('✓ CTA with custom timing added:', outputPath);
  console.log('  Shows at: 10s for 5 seconds');
}

/**
 * Example 11: Multi-language CTA support
 */
export async function example11MultiLanguageCTA(videoPath: string): Promise<void> {
  console.log('\n=== Example 11: Multi-language CTA ===');

  const languages = [
    { text: 'Full video on YouTube 👆', lang: 'en' },
    { text: 'Vídeo completo en YouTube 👆', lang: 'es' },
    { text: 'Vidéo complète sur YouTube 👆', lang: 'fr' },
    { text: 'Vollständiges Video auf YouTube 👆', lang: 'de' },
  ];

  for (const { text, lang } of languages) {
    const config: AnimatedCTAConfig = {
      text,
      position: 'top',
      fontSize: 40,
      fontColor: 'white',
      borderColor: 'black',
      borderWidth: 3,
      duration: 3,
      animation: 'fade',
    };

    const outputPath = await ctaService.addAnimatedCTA(
      videoPath,
      config,
      videoPath.replace('.mp4', `-${lang}-cta.mp4`)
    );
    console.log(`✓ ${lang.toUpperCase()} CTA added:`, outputPath);
  }
}

/**
 * Example 12: Get available fonts
 */
export async function example12AvailableFonts(): Promise<void> {
  console.log('\n=== Example 12: Available Fonts ===');

  const fonts = await ctaService.getAvailableFonts();
  console.log('Available fonts on system:');
  fonts.forEach((font, index) => {
    console.log(`  ${index + 1}. ${font}`);
  });
}

/**
 * Run all examples
 */
export async function runAllExamples(videoPath: string): Promise<void> {
  console.log('='.repeat(60));
  console.log('CTA OVERLAY EXAMPLES');
  console.log('='.repeat(60));

  try {
    // Check available fonts first
    await example12AvailableFonts();

    // Run examples
    await example1SimpleCTA(videoPath);
    await example2FadeInCTA(videoPath);
    await example3StyledCTA(videoPath);
    await example4SlideCTA(videoPath);
    await example5BounceCTA(videoPath);
    await example6ConvenienceMethod(videoPath);
    await example7DefaultCTA(videoPath);
    await example8DefaultAnimatedCTA(videoPath);
    await example10CustomTiming(videoPath);

    console.log('\n' + '='.repeat(60));
    console.log('ALL EXAMPLES COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('Error running examples:', error);
    throw error;
  }
}

// Export individual examples
export default {
  example1SimpleCTA,
  example2FadeInCTA,
  example3StyledCTA,
  example4SlideCTA,
  example5BounceCTA,
  example6ConvenienceMethod,
  example7DefaultCTA,
  example8DefaultAnimatedCTA,
  example9BatchProcessing,
  example10CustomTiming,
  example11MultiLanguageCTA,
  example12AvailableFonts,
  runAllExamples,
};
