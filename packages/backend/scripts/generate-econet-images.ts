/**
 * Generate Impactful Images for Econet Consumer Complaint Video
 * Uses Gemini to create powerful, emotive visuals for each slide
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.join(__dirname, '../src/remotion/public/images/econet');

interface SlideImage {
  name: string;
  filename: string;
  prompt: string;
}

const slideImages: SlideImage[] = [
  {
    name: 'Attention Grabber',
    filename: 'attention-grabber',
    prompt: `Create a dramatic, high-impact image for a consumer alert video.

Visual elements:
- Dark, ominous background with deep red and black tones
- Broken or shattered glass effect symbolizing broken promises
- Warning symbols subtly integrated
- Dramatic lighting with red accent lights
- Digital/tech aesthetic with network grid patterns fragmenting
- Sense of urgency and alarm

Style: Cinematic, dramatic, photorealistic
Mood: Alarming, urgent, serious
NO TEXT - pure visual imagery only

This is for a consumer rights video about telecom fraud.`
  },
  {
    name: 'Company Exposé',
    filename: 'company-expose',
    prompt: `Create a powerful image representing corporate betrayal and broken trust.

Visual elements:
- Silhouette of a corporate building or tower
- Crumbling, decaying, or disintegrating structure
- Dark storm clouds gathering
- Red warning lights or alerts
- Broken contract or shattered smartphone
- Corporate greed symbolism - money floating away
- African landscape silhouette in background

Style: Dark, dramatic, editorial photography style
Mood: Disappointment, betrayal, anger
NO TEXT - pure visual imagery only

This represents a telecom company that has betrayed consumer trust.`
  },
  {
    name: 'Data Problems',
    filename: 'data-problems',
    prompt: `Create an image showing frustration with slow internet and unusable data.

Visual elements:
- Frustrated person holding smartphone showing buffering symbol
- Loading spinner or progress bar stuck at low percentage
- Broken or disconnected network cables
- Slow snail symbolism merged with WiFi/data imagery
- Red X marks and error symbols
- Money being wasted/burned (data bundles being thrown away)
- Dark, frustrated mood lighting

Style: Emotive, relatable, editorial
Mood: Frustration, helplessness, anger
NO TEXT - pure visual imagery only

This represents the frustration of paying for data you cannot use.`
  },
  {
    name: 'Speed Comparison',
    filename: 'speed-comparison',
    prompt: `Create a powerful visual comparison between promised speed and reality.

Visual elements:
- Split image: Left side bright/fast (rocket, lightning), Right side slow/dark (snail, turtle)
- Speed gauge/meter showing near zero
- Fast car vs broken down vehicle
- Fiber optic light trails contrasted with dim, weak signals
- Visual metaphor of expectation vs reality
- Graph showing dramatic drop

Style: Infographic-inspired, dramatic contrast
Mood: Deceived, disappointed
NO TEXT - pure visual imagery only

This shows the massive gap between advertised and actual internet speeds.`
  },
  {
    name: 'Company Response',
    filename: 'company-response',
    prompt: `Create an image representing corporate dismissiveness and lack of customer care.

Visual elements:
- Customer service representative turning away
- Closed door or wall blocking customer
- "Talk to the hand" gesture
- Customer reaching out being ignored
- Cold, corporate blue tones with harsh lighting
- Customer holding complaint being dismissed
- Robotic, uncaring corporate figure

Style: Editorial, emotive, slightly surreal
Mood: Frustration, being unheard, corporate coldness
NO TEXT - pure visual imagery only

This represents a company refusing to help or refund customers.`
  },
  {
    name: 'Pattern of Problems',
    filename: 'pattern-problems',
    prompt: `Create an image showing a repeated pattern of broken promises over time.

Visual elements:
- Timeline or spiral of repeated failures
- Multiple broken smartphones or devices
- Domino effect of falling services
- Pattern of warning signs repeating
- Calendar pages or dates showing recurring issues
- Zimbabwe map with cracks/fractures
- Multiple customers with same problem

Style: Conceptual, editorial, pattern-based
Mood: Systemic failure, repetition, ongoing harm
NO TEXT - pure visual imagery only

This shows a pattern of repeated consumer harm by the same company.`
  },
  {
    name: 'Call to Action',
    filename: 'call-to-action',
    prompt: `Create a powerful, empowering image of consumers demanding accountability.

Visual elements:
- United group of African consumers standing together
- Raised fists or holding phones high
- Social media icons floating (representing viral campaign)
- Light breaking through darkness
- Zimbabwe flag colors subtly integrated
- Megaphone or amplification symbolism
- Power to the people aesthetic

Style: Inspirational, empowering, movement-style
Mood: Empowerment, unity, hope, action
NO TEXT - pure visual imagery only

This represents consumers uniting to demand accountability from corporations.`
  }
];

async function generateImages() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY not found in environment');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  console.log('=== Generating Econet Complaint Video Images ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const results: { name: string; success: boolean; path?: string; error?: string }[] = [];
  let totalCost = 0;

  for (const slide of slideImages) {
    console.log(`\n[${slide.name}] Generating...`);

    try {
      const result = await generator.generateDirect({
        prompt: slide.prompt,
        outputDir: OUTPUT_DIR,
        filename: slide.filename,
        aspectRatio: '16:9'
      });

      if (result.success) {
        console.log(`  ✓ Success: ${result.imagePath}`);
        results.push({ name: slide.name, success: true, path: result.imagePath });
        totalCost += result.cost;
      } else {
        console.log(`  ✗ Failed: ${result.error}`);
        results.push({ name: slide.name, success: false, error: result.error });
      }

      // Delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.log(`  ✗ Error: ${error.message}`);
      results.push({ name: slide.name, success: false, error: error.message });
    }
  }

  // Summary
  console.log('\n=== Generation Complete ===\n');
  console.log('Results:');
  results.forEach(r => {
    if (r.success) {
      console.log(`  ✓ ${r.name}: ${r.path}`);
    } else {
      console.log(`  ✗ ${r.name}: ${r.error}`);
    }
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\nTotal: ${successCount}/${slideImages.length} images generated`);
  console.log(`Cost: $${totalCost.toFixed(3)}`);

  if (successCount === slideImages.length) {
    console.log('\n✓ All images generated successfully!');
    console.log('\nNext step: Run the video render script:');
    console.log('  ./scripts/render-econet-complaint.sh');
  }
}

generateImages().catch(console.error);
