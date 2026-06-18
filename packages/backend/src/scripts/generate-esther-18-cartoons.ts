import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const OUTPUT_DIR = path.resolve(__dirname, '../remotion/public/images/esther-18');

const STYLE_PREFIX = `Studio Ghibli inspired warm cartoon illustration style. Consistent art style across all images. Soft lighting, expressive faces, warm colors. No text or words in the image.`;

const CARTOON_SCENES = [
  {
    id: 'cartoon-school-concert',
    prompt: `${STYLE_PREFIX} A cute cartoon of a young Black girl around 5 years old standing on a wooden school stage. She's wearing a beautiful white formal dress with frilly tulle layers and white mary jane shoes. She has reddish-burgundy curly braids. She's holding a brown paper gift bag with a Christmas tree decoration on it. She has a serious expression like she's judging the audience. There are blue curtains in the background. Her expression is adorable but stern, like a tiny empress surveying her kingdom.`,
  },
  {
    id: 'cartoon-face-paint',
    prompt: `${STYLE_PREFIX} A cartoon of a young Black girl around 7 years old with colorful face paint - blue and red like a superhero mask, with a HUGE excited toothy grin showing missing baby teeth. She's next to her dad who is a smiling Black man in a yellow Arsenal football jersey. They're taking a selfie at a busy shopping mall. The girl is wearing a pink top. The mood is pure joy and silliness. Dad-daughter bonding moment.`,
  },
  {
    id: 'cartoon-school-uniform',
    prompt: `${STYLE_PREFIX} A cartoon of a young Black girl around 7 years old in a light blue school uniform button-down dress. She has dark reddish braided hair. She's striking a dramatic pose with both arms spread wide like she's about to take flight, making a funny duck-face/pouty expression with her cheeks puffed out. She's standing in a bedroom. Her energy is pure confidence and sass - like she owns the school. Big expressive cartoon eyes.`,
  },
  {
    id: 'cartoon-yolo',
    prompt: `${STYLE_PREFIX} A cartoon of a young Black girl around 8 years old wearing a teal/green YOLO hoodie with gold lettering. She has an exaggerated shocked/surprised expression with huge wide cartoon eyes and her mouth in an O shape. The room is dimly lit with a moody atmospheric feel. She looks like she just discovered something incredible. Curly/braided dark hair. The YOLO text on the hoodie should be visible and prominent.`,
  },
  {
    id: 'cartoon-glow-up',
    prompt: `${STYLE_PREFIX} A beautiful cartoon of a young Black woman, 18 years old, looking elegant and confident. She's wearing a traditional South African Zulu outfit - a white fitted t-shirt, an orange pleated skirt with colorful geometric Zulu beadwork on the waistband and trim (triangles in purple, green, yellow, red), and a stunning wide circular Zulu beaded necklace in green, red, orange and white. She has neat black braids. She's wearing white sneakers. She's standing with one hand on her hip in a confident pose. The transformation from child to woman is evident - she looks graceful and proud. Warm golden lighting.`,
  },
  {
    id: 'cartoon-dad-selfie',
    prompt: `${STYLE_PREFIX} A heartwarming cartoon of a young Black girl around 9 years old with pink/reddish braids taking a selfie with her dad. The girl has the biggest smile showing her teeth. Her dad is a Black man with long flowing hair wearing a teal Arsenal Puma football jersey that says "Fly Emirates". They're squished together for the selfie, both looking happy. The background is a cozy living room. Pure father-daughter love moment.`,
  },
];

async function main() {
  console.log(`Generating ${CARTOON_SCENES.length} cartoon images...`);
  console.log(`Estimated cost: $${(CARTOON_SCENES.length * 0.039).toFixed(2)}\n`);

  for (const scene of CARTOON_SCENES) {
    const outPath = path.join(OUTPUT_DIR, `${scene.id}.png`);

    if (fs.existsSync(outPath)) {
      console.log(`  Skipping ${scene.id} (already exists)`);
      continue;
    }

    console.log(`  Generating: ${scene.id}...`);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: scene.prompt,
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (imagePart?.inlineData?.data) {
        const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
        fs.writeFileSync(outPath, imageBuffer);
        console.log(`  Saved: ${scene.id}.png (${imageBuffer.length} bytes)`);
      } else {
        console.log(`  WARNING: No image generated for ${scene.id}`);
        console.log(`  Response:`, JSON.stringify(response.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '[image]')));
      }
    } catch (error: any) {
      console.error(`  ERROR generating ${scene.id}: ${error.message}`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('\nDone! All cartoon images generated.');
}

main().catch(console.error);
