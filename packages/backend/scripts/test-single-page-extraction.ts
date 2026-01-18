/**
 * Test extraction on a single page to verify Gemini Vision works
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const PDF_PATH = '/home/dachu/Downloads/tomis.pdf';
const TEST_PAGE = 32; // PRODUCTION CHAIRS

const SCI_EXTRACTION_PROMPT = `Analyze this Standard Cleaning Instruction (SCI) document page and extract ALL information.

The document has a specific table-based header format:
- Main title is in the left cell (e.g., "PRODUCTION CHAIRS", "FLOORS", "WALLS")
- Right side has a table with:
  - "Effective Date:" row
  - "Document No." row (format like "SCI:31")
  - "Amendment No." row
- Below the header is "AREA:" designation

Extract the following as structured JSON:

1. **Header Metadata:**
   - title: The main cleaning area name (e.g., "PRODUCTION CHAIRS")
   - documentNo: The SCI document number (e.g., "SCI:31")
   - effectiveDate: The effective date (e.g., "01 December 2024")
   - amendmentNo: The amendment number (e.g., "00")
   - area: The area designation from "AREA:" field

2. **Table Fields (look for these in the document table):**
   - category: CATEGORY or type
   - hotRatio: HOT RATIO / USE RATIO for chemicals
   - coldRatio: COLD RATIO if present
   - chemicalUse: CHEMICAL / USE (product name)
   - cleaningRecord: CLEANING RECORD
   - maintenanceAssistance: MAINTENANCE ASSISTANCE
   - frequency: FREQUENCY
   - responsibility: RESPONSIBILITY
   - inspectedBy: INSPECTED BY
   - keyInspectionPoints: KEY INSPECTION POINTS (as array)
   - colourCodes: Array of {colour, meaning}
   - ppeRequired: PPE requirements (as array)
   - equipmentRequired: EQUIPMENT REQUIRED (as array)

3. **Step Groups:**
   - Look for headings like DAILY, WEEKLY, DEEP CLEANING, MONTHLY
   - Extract each numbered/bulleted step under these headings

Return ONLY valid JSON.`;

async function test() {
  console.log('🧪 Testing Single Page Extraction');
  console.log('='.repeat(60));
  console.log(`PDF: ${PDF_PATH}`);
  console.log(`Page: ${TEST_PAGE}`);
  console.log('='.repeat(60));

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(geminiKey);

  // Convert page to image
  const tempDir = '/tmp/sci-test';
  fs.mkdirSync(tempDir, { recursive: true });

  console.log('\n📄 Converting page to image...');
  execSync(
    `pdftoppm -png -f ${TEST_PAGE} -l ${TEST_PAGE} -r 150 "${PDF_PATH}" "${tempDir}/page"`,
    { stdio: 'pipe' }
  );

  // Find the output file
  const files = fs.readdirSync(tempDir);
  const imageFile = files.find(f => f.startsWith('page-') && f.endsWith('.png'));
  if (!imageFile) {
    console.error('❌ Failed to convert page');
    process.exit(1);
  }

  const imagePath = path.join(tempDir, imageFile);
  console.log(`   Image: ${imagePath}`);

  // Read and encode image
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  console.log(`   Size: ${Math.round(imageData.length / 1024)} KB`);

  // Call Gemini
  console.log('\n🤖 Calling Gemini Vision...');
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
    }
  });

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          { text: SCI_EXTRACTION_PROMPT },
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image
            }
          }
        ]
      }
    ]
  });

  const responseText = result.response.text();
  console.log('\n📋 Raw Response:');
  console.log('-'.repeat(60));
  console.log(responseText);
  console.log('-'.repeat(60));

  // Try to parse as JSON
  try {
    const cleaned = responseText.replace(/```json\s*|```/gi, '').trim();
    const parsed = JSON.parse(cleaned);
    console.log('\n✅ Parsed JSON:');
    console.log(JSON.stringify(parsed, null, 2));

    // Highlight key fields
    console.log('\n📊 Key Extracted Fields:');
    console.log(`   Title: ${parsed.title}`);
    console.log(`   Document No: ${parsed.documentNo}`);
    console.log(`   Effective Date: ${parsed.effectiveDate}`);
    console.log(`   Amendment No: ${parsed.amendmentNo}`);
    console.log(`   Area: ${parsed.area}`);
    console.log(`   Step Groups: ${parsed.stepGroups?.length || 0}`);
  } catch (e) {
    console.log('\n⚠️ Could not parse as JSON:', (e as Error).message);
  }

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
}

test().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
