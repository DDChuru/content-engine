/**
 * Generate the "Econet Zim Miswai!!" placard - the finale
 */

import { GeminiImageGenerator } from '../src/services/gemini-image-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const OUTPUT_DIR = path.join(__dirname, '../src/remotion/public/images/econet/placards');

async function generateMiswaiPlacard() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY not found');
    process.exit(1);
  }

  const generator = new GeminiImageGenerator(apiKey);

  const prompt = `Create a powerful, triumphant protest image for a consumer rights video finale.

SCENE: A Zimbabwean person holding a large white placard with a victorious, defiant expression.

THE PLACARD MUST CLEARLY SHOW THIS TEXT:
"ECONET ZIM, MISWAI!!"

IMPORTANT TEXT REQUIREMENTS:
- The text must be CLEARLY READABLE in bold black marker on white placard
- "MISWAI" should be larger, emphasized - this is Shona slang meaning "you're wrong/messing up"
- Two exclamation marks after MISWAI
- Text should be the focal point

PERSON & EMOTION:
- African person looking directly at camera
- Expression: Triumphant, defiant, calling out wrongdoing
- Finger pointing at camera or raised fist
- Energy of "we caught you!" and "enough is enough!"

STYLE:
- Photorealistic, editorial photography
- Dramatic lighting - golden hour or overcast
- Urban Zimbabwe setting (street or in front of building)
- Powerful, climactic moment
- Other protesters visible in background

MOOD: This is the final call-out. Defiant. Victorious. "We see you, and you're WRONG."

NO company logos. The message is the star.`;

  console.log('\n🎬 Generating MISWAI finale placard...\n');
  console.log('Text: "ECONET ZIM, MISWAI!!"');
  console.log('Meaning: "Econet Zimbabwe, you\'re messing up!"\n');

  const result = await generator.generateDirect({
    prompt,
    outputDir: OUTPUT_DIR,
    filename: 'placard-10-miswai',
    aspectRatio: '16:9'
  });

  if (result.success) {
    console.log('✓ Success:', result.imagePath);
    console.log('Cost: $' + result.cost.toFixed(3));
  } else {
    console.log('✗ Failed:', result.error);
    process.exit(1);
  }
}

generateMiswaiPlacard().catch(console.error);
