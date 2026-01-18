/**
 * Generate Visual Assets for "AI Changes Everything" Video
 *
 * Uses Gemini to create:
 * - Infographics (mountain of knowledge, timeline comparison)
 * - Comedic visuals (Angular wedding, divorce papers)
 * - Framework logos composition
 * - Code comparison visuals
 *
 * Run: npx tsx scripts/generate-ai-changes-visuals.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { GeminiImageGenerator } from '../src/services/gemini-image-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = '/home/dachu/Documents/projects/content-engine/output/ai-changes-everything/images';

// Image prompts based on the video script requirements
const IMAGE_PROMPTS = [
  {
    id: 'mountain-of-knowledge',
    prompt: `Create an infographic illustration showing "The Mountain of Frontend Knowledge".

A stylized mountain with labeled camps showing the developer learning journey:
- Base Camp (bottom): HTML, CSS basics - small tents, beginners
- Lower Slopes: JavaScript fundamentals - hikers starting climb
- Mid Mountain: Framework learning (Angular/React/Vue logos subtly shown) - harder terrain
- Upper Slopes: Testing, Build Tools, Performance - steep, challenging
- Summit: Architecture, CI/CD, Leadership - clouds, achievement

Style: Modern tech infographic, purple/blue gradient background, isometric or flat design
Include: Tiny developer figures at various stages, some exhausted, some celebrating
Weather: Stormy at top representing constant change
NO TEXT LABELS - pure visual representation
Colors: Dark purple (#1a1a2e) to blue (#667eea) gradient`,
    aspectRatio: '9:16' as const,
  },
  {
    id: 'timeline-comparison',
    prompt: `Create a side-by-side timeline comparison infographic.

LEFT SIDE - "Traditional Path" (red/orange tones):
- Long winding road going upward over 4 years
- Developer figure looking exhausted
- Clock symbols showing years passing
- Stack of books getting taller

RIGHT SIDE - "AI-Assisted Path" (green/blue tones):
- Short direct path, 3 months
- Developer figure looking energetic, confident
- Rocket or speed symbols
- AI assistant figure helping

Style: Clean modern infographic, split screen design
NO TEXT - visual storytelling only
Background: Dark with contrasting colors for each path
Include: Visual milestones, progress indicators`,
    aspectRatio: '16:9' as const,
  },
  {
    id: 'angular-wedding',
    prompt: `Create a humorous tech illustration of a "wedding" between a developer and Angular framework.

Scene: Wedding ceremony setting with tech twist
- Groom: Developer character in suit
- Bride: Angular logo personified (or red shield shape in wedding dress)
- Officiant: Computer or code terminal
- Background: IDE-styled church interior
- Guests: Other framework logos watching (React, Vue looking jealous)

Style: Cartoon/illustration, warm wedding colors with Angular red accent
Mood: Slightly comedic, tech humor
NO TEXT on the image
Include: Hearts, but also chains subtly suggesting "locked in"`,
    aspectRatio: '16:9' as const,
  },
  {
    id: 'framework-divorce',
    prompt: `Create a humorous tech illustration of "divorce papers" from Angular.

Scene: Dramatic breakup scene
- Developer character looking relieved but nostalgic
- Angular logo looking dramatic/sad
- Torn paper or broken heart imagery
- Other frameworks (React, Svelte, Vue) waiting in the background hopefully
- Box of Angular memories (NgModules, RxJS symbols)

Style: Cartoon/illustration, dramatic lighting, comedic tone
Colors: Dark with spotlight effect
NO TEXT - visual storytelling
Include: Some tears (comedic), freedom symbols like birds or broken chains`,
    aspectRatio: '16:9' as const,
  },
  {
    id: 'polygamous-frameworks',
    prompt: `Create a tech illustration showing "Framework Polyamory" - a developer happily surrounded by multiple frameworks.

Center: Happy developer character with open arms
Surrounding in a heart/circle formation:
- Angular (red)
- React (blue)
- Vue (green)
- Svelte (orange)
- Next.js (black/white)
- Small PHP heart at the corner with "sometimes" vibe

Style: Bright, positive, celebratory
Background: Gradient with confetti or celebration elements
All framework logos shown as friendly, cooperative
Developer looks confident and free
NO TEXT - logos speak for themselves`,
    aspectRatio: '9:16' as const,
  },
  {
    id: 'code-comparison',
    prompt: `Create a visual showing code complexity reduction.

Split screen design:
LEFT - "Before" (cluttered, complex):
- Many files/folders stacked
- Long code blocks representation
- Stressed developer
- Red/orange warning colors

RIGHT - "After" (clean, simple):
- Few clean files
- Short, elegant code representation
- Happy developer
- Green/blue success colors

Style: Abstract code visualization, not actual code
Show: File icons, complexity waves, developer emotions
NO TEXT - visual metaphor only
Include: Arrows showing transformation/reduction`,
    aspectRatio: '16:9' as const,
  },
  {
    id: 'skill-reorganization',
    prompt: `Create an infographic showing skills being reorganized into two columns.

Visual concept: Skills as objects/icons moving between categories

LEFT COLUMN - "Essential" (warm golden glow):
- Brain/thinking icon (Architecture)
- Shield icon (Security)
- Eye icon (Code Review)
- Puzzle pieces (Problem Solving)

RIGHT COLUMN - "Delegatable to AI" (cool blue, AI glow):
- Syntax symbols
- Boilerplate/template icons
- CSS styling brush
- Documentation books
- Regex symbols

Style: Clean infographic, animated feel with motion lines
Background: Dark gradient
Include: AI robot assistant catching delegated skills
NO TEXT labels`,
    aspectRatio: '16:9' as const,
  },
  {
    id: 'ngmodule-madness',
    prompt: `Create a comedic visualization of Angular NgModule complexity.

Scene: Developer drowning in a sea of connected boxes/nodes
- Many interconnected boxes representing: declarations, imports, exports, providers, entryComponents
- Spider web or tangled yarn visual
- Developer in the middle looking overwhelmed
- Each box connected to many others with arrows
- Chaos and complexity visualized

Style: Exaggerated cartoon, comedic but relatable
Colors: Angular red with overwhelming gray complexity
Mood: Humorous frustration
NO TEXT - visual chaos speaks for itself
Include: Question marks, sweat drops, tangled lines`,
    aspectRatio: '16:9' as const,
  },
  {
    id: 'tiktok-hook-bg',
    prompt: `Create a dramatic dark background for video hooks.

Design: Cinematic, attention-grabbing
- Dark purple/black gradient base
- Subtle tech grid or matrix pattern
- Glowing accent lines (gold or cyan)
- Slight lens flare or light leak effects
- Space for text overlay in center

Style: Modern, dramatic, TikTok-ready
Colors: #1a1a2e, #4a148c, gold accents
NO TEXT - pure background
Mood: "Something important is about to be said"`,
    aspectRatio: '9:16' as const,
  },
  {
    id: 'css-meme-chaos',
    prompt: `Create a humorous visualization of CSS frustration.

Scene: A simple box that should be centered but isn't
- Box slightly off-center, tilted
- Developer character facepalming or screaming
- CSS property snippets floating chaotically (visualized as tangled strings)
- Other elements breaking out of their containers
- "Overflow" visual with content spilling

Style: Meme-worthy, relatable developer humor
Colors: Bright, chaotic, web colors
NO TEXT - visual humor only
Include: Broken layouts, misaligned elements, despair`,
    aspectRatio: '16:9' as const,
  },
];

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  AI CHANGES EVERYTHING - VISUAL ASSET GENERATION');
  console.log('='.repeat(60) + '\n');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  let successCount = 0;
  let totalCost = 0;

  for (let i = 0; i < IMAGE_PROMPTS.length; i++) {
    const img = IMAGE_PROMPTS[i];
    console.log(`\n[${i + 1}/${IMAGE_PROMPTS.length}] Generating: ${img.id}`);
    console.log(`   Aspect: ${img.aspectRatio}`);

    try {
      const result = await generator.generateDirect({
        prompt: img.prompt,
        outputDir: OUTPUT_DIR,
        filename: img.id,
        aspectRatio: img.aspectRatio,
      });

      if (result.success) {
        console.log(`   ✅ Saved: ${result.imagePath}`);
        successCount++;
        totalCost += result.cost;
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Rate limiting
    if (i < IMAGE_PROMPTS.length - 1) {
      console.log('   ⏳ Waiting 2s (rate limit)...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('  VISUAL GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`
  Success: ${successCount}/${IMAGE_PROMPTS.length} images
  Cost: $${totalCost.toFixed(2)}
  Output: ${OUTPUT_DIR}
`);

  // List generated files
  const files = await fs.readdir(OUTPUT_DIR);
  console.log('Generated files:');
  for (const file of files) {
    const stat = await fs.stat(path.join(OUTPUT_DIR, file));
    console.log(`  - ${file} (${(stat.size / 1024).toFixed(1)}KB)`);
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

main().catch(console.error);
