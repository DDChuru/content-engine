import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface TranslationItem {
  key: string;
  english: string;
  currentZulu: string;
}

const textsToTranslate: TranslationItem[] = [
  // Slide titles
  { key: 'intro_title', english: 'Chemical Safety Training', currentZulu: 'Ukuqeqeshwa Kwezokuphepha Kwamakhemikhali' },
  { key: 'intro_subtitle', english: 'For Shopfloor Cleaners', currentZulu: 'Abahlanzeki Basesitolo' },
  { key: 'three_steps', english: 'The 3 Steps of Cleaning', currentZulu: 'Izinyathelo Ezi-3 Zokuhlanza' },
  { key: 'your_chemicals', english: 'Your Chemicals', currentZulu: 'Amakhemikhali Akho' },
  { key: 'powerful_cleaner', english: 'Powerful Cleaner', currentZulu: 'Umhlanzekisi Onamandla' },
  { key: 'clean_disinfect', english: 'Clean + Disinfect', currentZulu: 'Hlanza + Bulala Amagciwane' },
  { key: 'your_sanitizers', english: 'Your Sanitizers', currentZulu: 'Ama-Sanitizer Akho' },
  { key: 'contact_time', english: 'Contact Time Matters!', currentZulu: 'Isikhathi Sibalulekile!' },
  { key: 'mix_right', english: 'Mix It Right', currentZulu: 'Xuba Kahle' },
  { key: 'rinse_properly', english: 'Rinse Properly', currentZulu: 'Yamanisa Kahle' },
  { key: 'protect_yourself', english: 'Protect Yourself', currentZulu: 'Zivikele' },
  { key: 'quick_reference', english: 'Quick Reference Card', currentZulu: 'Umhlahlandlela Osheshayo' },
  { key: 'you_important', english: 'You Are Important!', currentZulu: 'Ubalulekile!' },

  // Product descriptions
  { key: 'heavy_duty_cleaner', english: 'Heavy Duty Cleaner', currentZulu: 'Umhlanzekisi Onamandla' },
  { key: 'clean_kill_germs', english: 'Clean + Kill germs', currentZulu: 'Hlanza + Bulala amagciwane' },
  { key: 'food_surface_sanitizer', english: 'Food Surface Sanitizer', currentZulu: 'I-Sanitizer Yezindawo Zokudla' },
  { key: 'general_sanitizer', english: 'General Sanitizer', currentZulu: 'I-Sanitizer Ejwayelekile' },

  // Thank you slide phrases
  { key: 'cleaning_protects', english: 'Your cleaning protects everyone', currentZulu: 'Ukuhlanza kwakho kuvikela bonke abantu' },
  { key: 'clean_properly', english: 'Clean Properly', currentZulu: 'Hlanza Kahle' },
  { key: 'stay_safe', english: 'Stay Safe', currentZulu: 'Hlala Uphephile' },
  { key: 'be_proud', english: 'Be Proud', currentZulu: 'Ziqhenye' },

  // UI elements
  { key: 'bilingual_training', english: 'Bilingual Training', currentZulu: 'Ukuqeqeshwa Ngezilimi Ezimbili' },
  { key: 'visual_learning', english: 'Visual Learning', currentZulu: 'Ukufunda Ngokubona' },
  { key: 'easy_to_follow', english: 'Easy to Follow', currentZulu: 'Kulula Ukulandela' },
];

async function translateWithGemini(): Promise<void> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  console.log('🇿🇦 Getting isiZulu translations from Gemini...\n');

  const prompt = `You are an expert translator specializing in isiZulu, particularly for workplace and industrial contexts in South Africa.

I need you to translate the following English phrases into isiZulu. These are for a chemical safety training program for shopfloor cleaners in food processing facilities.

Requirements:
1. Use simple, everyday isiZulu that workers would understand
2. Prefer commonly used workplace terms over formal/academic translations
3. Keep translations concise - these appear on slides and buttons
4. Consider KwaZulu-Natal dialect as the primary reference
5. For technical terms like "sanitizer", you can use the English loan word if that's what workers commonly say

Here are the phrases to translate. For each one, I'll show you:
- The English text
- My current translation (which may be wrong or too formal)

Please provide the best isiZulu translation for each:

${textsToTranslate.map((item, i) => `
${i + 1}. "${item.english}"
   Current: "${item.currentZulu}"
`).join('')}

Please respond with ONLY a JSON array in this exact format (no markdown, no explanation):
[
  {"key": "intro_title", "english": "Chemical Safety Training", "zulu": "your translation"},
  ...
]`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean up the response - remove markdown code blocks if present
    let cleanedResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('Raw Gemini response:\n', cleanedResponse);

    const translations = JSON.parse(cleanedResponse);

    console.log('\n' + '='.repeat(80));
    console.log('📝 GEMINI ISIZULU TRANSLATIONS');
    console.log('='.repeat(80) + '\n');

    console.log('// Paste these into shopfloor-training.component.ts\n');

    for (const item of translations) {
      const original = textsToTranslate.find(t => t.key === item.key);
      const changed = original && original.currentZulu !== item.zulu;

      console.log(`// ${item.key}: "${item.english}"`);
      if (changed) {
        console.log(`//   OLD: "${original?.currentZulu}"`);
        console.log(`//   NEW: "${item.zulu}" ✓ CHANGED`);
      } else {
        console.log(`//   "${item.zulu}" (unchanged)`);
      }
      console.log('');
    }

    console.log('\n' + '='.repeat(80));
    console.log('📋 COPY-PASTE READY FORMAT');
    console.log('='.repeat(80) + '\n');

    // Output in a format ready to paste into the component
    const translationMap: Record<string, string> = {};
    for (const item of translations) {
      translationMap[item.key] = item.zulu;
    }

    console.log('const zuluTranslations = ' + JSON.stringify(translationMap, null, 2) + ';\n');

  } catch (error) {
    console.error('Error getting translations:', error);
  }
}

translateWithGemini();
