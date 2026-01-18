/**
 * Quick dry run test - process first 3 pages of TOMIS PDF
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFDocument } from 'pdf-lib';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const PDF_PATH = '/home/dachu/Downloads/tomis.pdf';
const TEST_PAGES = [32, 33, 34]; // PRODUCTION CHAIRS, next SCIs

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
   - colourCodes: Array of {colour, meaning} from colour code indicators
   - ppeRequired: PPE requirements (as array)
   - equipmentRequired: EQUIPMENT REQUIRED (as array)

3. **Step Groups:**
   - Look for headings like DAILY, WEEKLY, DEEP CLEANING, MONTHLY
   - Extract each step under these headings
   - Steps are typically numbered (1, 2, 3...) or bulleted

Return ONLY valid JSON matching this schema:
{
  "title": "string",
  "documentNo": "string",
  "effectiveDate": "string",
  "amendmentNo": "string",
  "area": "string",
  "category": "string",
  "chemicals": [{"name": "string", "hotRatio": "string", "coldRatio": "string"}],
  "cleaningRecord": "string",
  "maintenanceAssistance": "string",
  "frequency": "string",
  "responsibility": "string",
  "inspectedBy": "string",
  "keyInspectionPoints": ["string"],
  "colourCodes": [{"colour": "string", "meaning": "string"}],
  "ppeRequired": ["string"],
  "equipmentRequired": ["string"],
  "stepGroups": [
    {
      "title": "string",
      "frequency": "string",
      "steps": [
        {"order": 1, "action": "string", "notes": ["string"]}
      ]
    }
  ]
}`;

async function test() {
  console.log('🧪 Testing Import Flow - Dry Run');
  console.log('='.repeat(60));
  console.log(`PDF: ${PDF_PATH}`);
  console.log(`Test Pages: ${TEST_PAGES.join(', ')}`);
  console.log('='.repeat(60));

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
    }
  });

  // Check PDF exists
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ PDF not found: ${PDF_PATH}`);
    process.exit(1);
  }

  // Get page count
  const pdfBytes = fs.readFileSync(PDF_PATH);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  console.log(`📄 Total pages in PDF: ${pdfDoc.getPageCount()}`);

  const tempDir = '/tmp/sci-dry-run';
  fs.mkdirSync(tempDir, { recursive: true });

  const results: Array<{
    page: number;
    title?: string;
    documentNo?: string;
    effectiveDate?: string;
    area?: string;
    stepGroupCount?: number;
    success: boolean;
    error?: string;
  }> = [];

  for (const pageNum of TEST_PAGES) {
    console.log(`\n📄 Page ${pageNum}...`);

    try {
      // Convert page to image
      execSync(
        `pdftoppm -png -f ${pageNum} -l ${pageNum} -r 150 "${PDF_PATH}" "${tempDir}/page"`,
        { stdio: 'pipe' }
      );

      // Find output file
      const files = fs.readdirSync(tempDir);
      const imageFile = files.find(f => f.startsWith('page-') && f.endsWith('.png'));
      if (!imageFile) {
        results.push({ page: pageNum, success: false, error: 'Image conversion failed' });
        continue;
      }

      const imagePath = path.join(tempDir, imageFile);
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');

      // Call Gemini
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
      const cleaned = responseText.replace(/```json\s*|```/gi, '').trim();

      try {
        const parsed = JSON.parse(cleaned);

        results.push({
          page: pageNum,
          title: parsed.title,
          documentNo: parsed.documentNo,
          effectiveDate: parsed.effectiveDate,
          area: parsed.area,
          stepGroupCount: parsed.stepGroups?.length || 0,
          success: true
        });

        console.log(`   ✅ ${parsed.title} (${parsed.documentNo})`);
        console.log(`      Effective: ${parsed.effectiveDate}`);
        console.log(`      Area: ${parsed.area}`);
        console.log(`      Step Groups: ${parsed.stepGroups?.length || 0}`);

      } catch (e) {
        results.push({ page: pageNum, success: false, error: 'JSON parse error' });
        console.log(`   ⚠️ JSON parse error`);
      }

      // Clean up page image
      fs.rmSync(imagePath, { force: true });

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      results.push({ page: pageNum, success: false, error: (error as Error).message });
      console.log(`   ❌ Error: ${(error as Error).message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Dry Run Summary');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  for (const r of successful) {
    console.log(`   Page ${r.page}: ${r.title} (${r.documentNo})`);
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    for (const r of failed) {
      console.log(`   Page ${r.page}: ${r.error}`);
    }
  }

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('\n💡 If extraction looks correct, run full import with:');
  console.log(`   npx tsx scripts/import-sci-pdf.ts "${PDF_PATH}" --site=nNonJXbB0W7n9fG1OQBi --dry-run`);
}

test().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
