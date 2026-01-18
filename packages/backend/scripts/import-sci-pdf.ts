/**
 * SCI PDF Import Script
 *
 * Complete import flow with improved extraction:
 * 1. Convert PDF pages to images
 * 2. Extract structured content with Gemini Vision
 * 3. Extract embedded images from PDF
 * 4. Upload to Firebase Storage
 * 5. Save to Firestore
 */

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFDocument, PDFName, PDFDict, PDFRawStream, PDFArray } from 'pdf-lib';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Configuration
const STORAGE_BUCKET = 'iclean-field-service-4bddd.appspot.com';
const ACS_COMPANY_ID = 'AnmdYRpshMosqbsZ6l15';

// Image size filter
const MIN_IMAGE_WIDTH = 200;
const MIN_IMAGE_HEIGHT = 200;

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const PDF_PATH = args.find(a => a.endsWith('.pdf')) || '';
const SITE_ID = args.find(a => a.startsWith('--site='))?.split('=')[1] || '';

if (!PDF_PATH) {
  console.error('Usage: npx tsx scripts/import-sci-pdf.ts <path-to-pdf> --site=<siteId> [--dry-run]');
  console.error('Example: npx tsx scripts/import-sci-pdf.ts /home/user/tomis.pdf --site=nNonJXbB0W7n9fG1OQBi');
  process.exit(1);
}

if (!SITE_ID) {
  console.error('Error: --site=<siteId> is required');
  process.exit(1);
}

// Improved extraction prompt that understands the table-based format
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

4. **Images:**
   - For each inspection photo, note its position and any caption
   - Exclude logos, headers, and PPE icons

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
  ],
  "images": [
    {"caption": "string", "description": "string", "position": "string"}
  ]
}`;

interface ExtractedSCI {
  title: string;
  documentNo: string;
  effectiveDate: string;
  amendmentNo: string;
  area: string;
  category?: string;
  chemicals?: Array<{ name: string; hotRatio?: string; coldRatio?: string }>;
  cleaningRecord?: string;
  maintenanceAssistance?: string;
  frequency?: string;
  responsibility?: string;
  inspectedBy?: string;
  keyInspectionPoints?: string[];
  colourCodes?: Array<{ colour: string; meaning: string }>;
  ppeRequired?: string[];
  equipmentRequired?: string[];
  stepGroups?: Array<{
    title: string;
    frequency?: string;
    steps: Array<{ order: number; action: string; notes?: string[] }>;
  }>;
  images?: Array<{ caption?: string; description?: string; position?: string }>;
  pageNumber: number;
}

interface ExtractedImage {
  pageNumber: number;
  width: number;
  height: number;
  data: Buffer;
  mimeType: string;
}

async function convertPdfPageToImage(pdfPath: string, pageNum: number, outputDir: string): Promise<string> {
  const outputPath = path.join(outputDir, `page-${pageNum}.png`);

  // Use pdftoppm (from poppler-utils) to convert PDF page to image
  try {
    execSync(
      `pdftoppm -png -f ${pageNum} -l ${pageNum} -r 150 "${pdfPath}" "${path.join(outputDir, 'page')}"`,
      { stdio: 'pipe' }
    );

    // pdftoppm creates files like page-01.png, page-1.png depending on total pages
    const possiblePaths = [
      path.join(outputDir, `page-${pageNum}.png`),
      path.join(outputDir, `page-${String(pageNum).padStart(2, '0')}.png`),
      path.join(outputDir, `page-${String(pageNum).padStart(3, '0')}.png`),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const finalPath = path.join(outputDir, `page-${pageNum}.png`);
        if (p !== finalPath) {
          fs.renameSync(p, finalPath);
        }
        return finalPath;
      }
    }

    throw new Error(`Could not find converted image for page ${pageNum}`);
  } catch (error) {
    console.error(`Failed to convert page ${pageNum}:`, error);
    throw error;
  }
}

async function extractImagesFromPDF(pdfPath: string): Promise<Map<number, ExtractedImage[]>> {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const context = pdfDoc.context;

  const imagesByPage = new Map<number, ExtractedImage[]>();

  for (let pageIndex = 0; pageIndex < pdfDoc.getPageCount(); pageIndex++) {
    const page = pdfDoc.getPage(pageIndex);
    const pageNum = pageIndex + 1;

    const resourcesDict = page.node.Resources();
    if (!resourcesDict) continue;

    const xObjectDictMaybe = resourcesDict.lookup(PDFName.of('XObject'));
    const xObjectDict = xObjectDictMaybe instanceof PDFDict ? xObjectDictMaybe : undefined;
    if (!xObjectDict) continue;

    const pageImages: ExtractedImage[] = [];

    for (const [, ref] of xObjectDict.entries()) {
      const xObject = context.lookup(ref);
      if (!(xObject instanceof PDFRawStream)) continue;

      const subtype = xObject.dict.get(PDFName.of('Subtype'));
      if (!(subtype instanceof PDFName) || subtype.toString() !== '/Image') continue;

      const widthObj = xObject.dict.get(PDFName.of('Width'));
      const heightObj = xObject.dict.get(PDFName.of('Height'));
      const width = widthObj ? parseInt(widthObj.toString()) : 0;
      const height = heightObj ? parseInt(heightObj.toString()) : 0;

      // Skip small images (icons)
      if (width < MIN_IMAGE_WIDTH || height < MIN_IMAGE_HEIGHT) continue;

      const filter = xObject.dict.get(PDFName.of('Filter'));
      const filters: string[] = [];
      if (filter instanceof PDFName) {
        filters.push(filter.toString());
      } else if (filter instanceof PDFArray) {
        for (let i = 0; i < filter.size(); i++) {
          const item = filter.get(i);
          if (item instanceof PDFName) filters.push(item.toString());
        }
      }

      let mimeType: string | null = null;
      if (filters.some(f => f === '/DCTDecode')) {
        mimeType = 'image/jpeg';
      } else if (filters.some(f => f === '/JPXDecode')) {
        mimeType = 'image/jp2';
      }

      if (!mimeType) continue;

      const data = Buffer.from(xObject.contents);
      if (!data.length) continue;

      pageImages.push({ pageNumber: pageNum, width, height, data, mimeType });
    }

    if (pageImages.length > 0) {
      pageImages.sort((a, b) => (b.width * b.height) - (a.width * a.height));
      imagesByPage.set(pageNum, pageImages);
    }
  }

  return imagesByPage;
}

async function extractSCIFromPage(
  genAI: GoogleGenerativeAI,
  imagePath: string,
  pageNum: number
): Promise<ExtractedSCI | null> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
    }
  });

  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');

  try {
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
      return { ...parsed, pageNumber: pageNum };
    } catch (parseError) {
      console.error(`Failed to parse JSON for page ${pageNum}:`, parseError);
      return null;
    }
  } catch (error) {
    console.error(`Gemini extraction failed for page ${pageNum}:`, error);
    return null;
  }
}

async function main() {
  console.log('🔄 SCI PDF Import Script');
  console.log('='.repeat(70));
  console.log(`PDF: ${PDF_PATH}`);
  console.log(`Site ID: ${SITE_ID}`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN' : '✏️ LIVE'}`);
  console.log('='.repeat(70));

  // Verify PDF exists
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ PDF not found: ${PDF_PATH}`);
    process.exit(1);
  }

  // Initialize Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment');
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(geminiKey);

  // Initialize Firebase
  const firebaseKey = process.env.ICLEAN_FIREBASE_KEY;
  if (!firebaseKey) {
    console.error('❌ ICLEAN_FIREBASE_KEY not found in environment');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(firebaseKey) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET
  }, 'sci-importer');

  const db = app.firestore();
  const bucket = app.storage().bucket();

  // Get site name for reference
  const siteDoc = await db.doc(`companies/${ACS_COMPANY_ID}/sites/${SITE_ID}`).get();
  const siteName = siteDoc.exists ? (siteDoc.data()?.name || SITE_ID) : SITE_ID;
  console.log(`📍 Site: ${siteName}`);

  // Create temp directory for page images
  const tempDir = path.join('/tmp', `sci-import-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  console.log(`📁 Temp directory: ${tempDir}`);

  try {
    // Step 1: Get PDF page count
    console.log('\n📄 Step 1: Analyzing PDF...');
    const pdfBytes = fs.readFileSync(PDF_PATH);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();
    console.log(`   Total pages: ${pageCount}`);

    // Step 2: Extract embedded images
    console.log('\n📷 Step 2: Extracting embedded images...');
    const imagesByPage = await extractImagesFromPDF(PDF_PATH);
    let totalImages = 0;
    for (const [, images] of imagesByPage) {
      totalImages += images.length;
    }
    console.log(`   Found ${totalImages} large images across ${imagesByPage.size} pages`);

    // Step 3: Convert pages to images and extract content
    console.log('\n🤖 Step 3: Extracting content with Gemini Vision...');
    const extractedSCIs: ExtractedSCI[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      process.stdout.write(`   Page ${pageNum}/${pageCount}... `);

      try {
        const imagePath = await convertPdfPageToImage(PDF_PATH, pageNum, tempDir);
        const sci = await extractSCIFromPage(genAI, imagePath, pageNum);

        if (sci && sci.title) {
          extractedSCIs.push(sci);
          console.log(`✅ ${sci.title} (${sci.documentNo || 'no doc#'})`);
        } else {
          console.log('⏭️ No SCI content');
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.log(`❌ Error: ${(error as Error).message}`);
      }
    }

    console.log(`\n   Extracted ${extractedSCIs.length} SCIs`);

    // Step 4: Upload to Firebase
    console.log('\n💾 Step 4: Saving to Firebase...');

    let scisCreated = 0;
    let imagesUploaded = 0;

    for (const sci of extractedSCIs) {
      const docId = `${SITE_ID}_${sci.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;

      // Get images for this page
      const pageImages = imagesByPage.get(sci.pageNumber) || [];

      // Upload images
      const uploadedImages: Array<{
        caption: string;
        pageNumber: number;
        storagePath: string;
        url: string;
      }> = [];

      if (!DRY_RUN && pageImages.length > 0) {
        for (let i = 0; i < pageImages.length; i++) {
          const img = pageImages[i];
          const ext = img.mimeType === 'image/jpeg' ? 'jpg' : 'jp2';
          const storagePath = `companies/${ACS_COMPANY_ID}/work-instructions/${docId}/image-${i}.${ext}`;

          try {
            const file = bucket.file(storagePath);
            await file.save(img.data, { metadata: { contentType: img.mimeType } });
            const [url] = await file.getSignedUrl({ action: 'read', expires: '03-01-2500' });

            uploadedImages.push({
              caption: sci.images?.[i]?.caption || '',
              pageNumber: sci.pageNumber,
              storagePath,
              url
            });
            imagesUploaded++;
          } catch (error) {
            console.error(`   ❌ Failed to upload image ${i} for ${sci.title}`);
          }
        }
      }

      // Build Firestore document
      const firestoreDoc = {
        companyId: ACS_COMPANY_ID,
        siteId: SITE_ID,
        siteName,
        project: 'iclean',
        parentDocumentId: path.basename(PDF_PATH, '.pdf'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourceFile: {
          name: path.basename(PDF_PATH),
          path: PDF_PATH
        },
        section: {
          sectionId: sci.documentNo || `page-${sci.pageNumber}`,
          title: sci.title,
          description: sci.area || '',
          pageRange: { start: sci.pageNumber, end: sci.pageNumber },
          documentMetadata: {
            documentId: sci.documentNo || '',
            title: sci.title,
            effectiveDate: sci.effectiveDate || '',
            revision: sci.amendmentNo || '',
            department: sci.area || '',
            author: '',
            reviewDate: '',
            approvals: []
          },
          area: sci.area ? [sci.area] : [],
          chemicals: sci.chemicals?.map(c => ({
            name: c.name,
            useRatio: c.hotRatio || c.coldRatio || ''
          })) || [],
          cleaningRecord: sci.cleaningRecord || '',
          maintenanceAssistance: sci.maintenanceAssistance || '',
          frequency: sci.frequency || '',
          responsibility: sci.responsibility || '',
          inspectedBy: sci.inspectedBy || '',
          keyInspectionPoints: sci.keyInspectionPoints || [],
          safetyNotes: [],
          ppeRequired: sci.ppeRequired || [],
          colourCodes: sci.colourCodes || [],
          applicationEquipment: sci.equipmentRequired || [],
          additionalNotes: [],
          images: DRY_RUN ? (pageImages.length > 0 ? [{ caption: '', pageNumber: sci.pageNumber }] : []) : uploadedImages,
          stepGroups: sci.stepGroups?.map(g => ({
            title: g.title,
            description: '',
            frequency: g.frequency || '',
            steps: g.steps.map(s => ({
              order: s.order,
              label: `Step ${s.order}`,
              action: s.action,
              notes: s.notes || []
            }))
          })) || []
        }
      };

      if (DRY_RUN) {
        console.log(`\n   📋 [DRY RUN] Would create: ${sci.title}`);
        console.log(`      Document No: ${sci.documentNo}`);
        console.log(`      Effective Date: ${sci.effectiveDate}`);
        console.log(`      Area: ${sci.area}`);
        console.log(`      Images: ${pageImages.length}`);
        console.log(`      Step Groups: ${sci.stepGroups?.length || 0}`);
      } else {
        try {
          await db.collection(`companies/${ACS_COMPANY_ID}/standard_cleaning_instructions`).doc(docId).set(firestoreDoc);
          scisCreated++;
          console.log(`   ✅ Created: ${sci.title} (${sci.documentNo})`);
        } catch (error) {
          console.error(`   ❌ Failed to save ${sci.title}:`, error);
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 Summary:');
    console.log(`   Pages processed: ${pageCount}`);
    console.log(`   SCIs extracted: ${extractedSCIs.length}`);
    console.log(`   SCIs created: ${DRY_RUN ? '0 (dry run)' : scisCreated}`);
    console.log(`   Images uploaded: ${DRY_RUN ? '0 (dry run)' : imagesUploaded}`);
    console.log('='.repeat(70));

    if (DRY_RUN) {
      console.log('\n💡 Run without --dry-run to apply changes');
    }

  } finally {
    // Cleanup temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
