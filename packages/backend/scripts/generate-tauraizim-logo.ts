/**
 * Generate TauraiZim Logo - Zimbabwe Consumer Advocacy Brand
 * "Taurai" means "Speak" in Shona
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.join(__dirname, '../src/remotion/public/images/tauraizim');

interface LogoVariant {
  name: string;
  filename: string;
  prompt: string;
}

const logoVariants: LogoVariant[] = [
  {
    name: 'Main Logo',
    filename: 'tauraizim-logo-main',
    prompt: `Create a powerful, modern logo for "TauraiZim" - a Zimbabwe consumer advocacy movement.

CONCEPT: "Taurai" means "SPEAK" in Shona. This is a platform empowering Zimbabwean consumers to speak up against corporate injustice.

Design Elements:
- Central icon: Stylized megaphone OR speech bubble OR raised fist holding a phone
- Zimbabwe flag colors incorporated tastefully: Green, Yellow, Red, Black
- Modern, bold, impactful design
- Works well on social media (TikTok, Twitter)
- Professional but activist energy
- Clean lines, memorable silhouette

Style: Modern logo design, vector-style, professional
Colors: Zimbabwe flag palette (Green #319200, Gold #FFD200, Red #DE2010, Black)
Background: Transparent or white
NO TEXT in the logo - icon only

This logo represents consumer power and the right to speak up.`
  },
  {
    name: 'Icon Only',
    filename: 'tauraizim-icon',
    prompt: `Create a minimal, iconic logo mark for "TauraiZim" consumer advocacy.

Design: Simple, bold icon that works at small sizes (TikTok profile picture)

Concepts to explore:
- Megaphone silhouette
- Speech bubble with power symbol
- Raised voice/sound waves
- Zimbabwe bird silhouette speaking

Requirements:
- Single color or two-tone maximum
- Works at 100x100 pixels
- Instantly recognizable
- Modern, clean design
- Zimbabwe colors: Green, Gold, Red, or Black

Style: Minimal icon design, flat design
NO TEXT - pure icon only
Background: White or transparent`
  },
  {
    name: 'Full Brand Mark',
    filename: 'tauraizim-brand',
    prompt: `Create a complete brand mark for "TauraiZim" - Zimbabwe's consumer voice platform.

Design concept: Combine the power of speech with Zimbabwe identity

Visual elements:
- Dynamic megaphone or speech element
- Subtle Zimbabwe bird (Hungwe) integration
- Wave patterns suggesting amplified voice
- Strong, confident stance
- Green, Gold, Red color scheme

Style: Professional brand identity, modern corporate activism
Mood: Empowering, trustworthy, bold, African
Works on: Social media, merchandise, banners

NO TEXT in the image - visual brand mark only
The design should convey: "Your voice matters. Speak up."

Background: Clean white or subtle gradient`
  }
];

async function generateLogos() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY not found in environment');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  console.log('=== Generating TauraiZim Logo Variants ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const results: { name: string; success: boolean; path?: string; error?: string }[] = [];
  let totalCost = 0;

  for (const variant of logoVariants) {
    console.log(`\n[${variant.name}] Generating...`);

    try {
      const result = await generator.generateDirect({
        prompt: variant.prompt,
        outputDir: OUTPUT_DIR,
        filename: variant.filename,
        aspectRatio: '1:1'  // Square for logos
      });

      if (result.success) {
        console.log(`  ✓ Success: ${result.imagePath}`);
        results.push({ name: variant.name, success: true, path: result.imagePath });
        totalCost += result.cost;
      } else {
        console.log(`  ✗ Failed: ${result.error}`);
        results.push({ name: variant.name, success: false, error: result.error });
      }

      // Delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.log(`  ✗ Error: ${error.message}`);
      results.push({ name: variant.name, success: false, error: error.message });
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
  console.log(`\nTotal: ${successCount}/${logoVariants.length} logos generated`);
  console.log(`Cost: $${totalCost.toFixed(3)}`);

  if (successCount > 0) {
    console.log('\n✓ Logos generated successfully!');
    console.log(`\nLogos saved to: ${OUTPUT_DIR}`);
    console.log('\nUse these for:');
    console.log('  - TikTok profile picture (icon version)');
    console.log('  - Twitter/X header and profile');
    console.log('  - Video watermarks');
    console.log('  - Social media posts');
  }
}

generateLogos().catch(console.error);
