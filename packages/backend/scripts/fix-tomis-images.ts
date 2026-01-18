/**
 * Fix TOMIS ABATTOIR SCI Images
 *
 * Extracts images from the PDF, uploads to Firebase Storage,
 * and updates the existing SCIs with proper URLs.
 */

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import { PDFDocument, PDFName, PDFDict, PDFRawStream, PDFArray } from 'pdf-lib';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Configuration
const PDF_PATH = '/home/dachu/Downloads/tomis.pdf';
const COMPANY_ID = 'AnmdYRpshMosqbsZ6l15';
const TOMIS_SITE_ID = 'nNonJXbB0W7n9fG1OQBi';
const STORAGE_BUCKET = 'iclean-field-service-4bddd.appspot.com';

// Minimum image dimensions to keep (skip tiny icons)
const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;

// Parse command line args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

interface ExtractedImage {
  pageNumber: number;
  width: number;
  height: number;
  data: Buffer;
  mimeType: string;
}

async function extractImagesFromPDF(pdfPath: string): Promise<Map<number, ExtractedImage[]>> {
  console.log(`📄 Reading PDF: ${pdfPath}`);
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const context = pdfDoc.context;

  console.log(`   Total pages: ${pdfDoc.getPageCount()}`);

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

      // Get dimensions
      const widthObj = xObject.dict.get(PDFName.of('Width'));
      const heightObj = xObject.dict.get(PDFName.of('Height'));
      const width = widthObj ? parseInt(widthObj.toString()) : 0;
      const height = heightObj ? parseInt(heightObj.toString()) : 0;

      // Skip small images (icons)
      if (width < MIN_WIDTH || height < MIN_HEIGHT) continue;

      // Get filter
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

      // Only extract JPEG images
      let mimeType: string | null = null;
      if (filters.some(f => f === '/DCTDecode')) {
        mimeType = 'image/jpeg';
      } else if (filters.some(f => f === '/JPXDecode')) {
        mimeType = 'image/jp2';
      }

      if (!mimeType) continue;

      const data = Buffer.from(xObject.contents);
      if (!data.length) continue;

      pageImages.push({
        pageNumber: pageNum,
        width,
        height,
        data,
        mimeType
      });
    }

    if (pageImages.length > 0) {
      // Sort by size (largest first) to prioritize main content images
      pageImages.sort((a, b) => (b.width * b.height) - (a.width * a.height));
      imagesByPage.set(pageNum, pageImages);
    }
  }

  return imagesByPage;
}

async function main() {
  console.log('🔧 Fix TOMIS ABATTOIR SCI Images');
  console.log('='.repeat(60));
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN' : '✏️ LIVE'}`);
  console.log(`Min image size: ${MIN_WIDTH}x${MIN_HEIGHT}`);
  console.log('='.repeat(60));

  // Initialize Firebase
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET
  }, 'tomis-image-fixer');

  const db = app.firestore();
  const bucket = app.storage().bucket();

  // Step 1: Extract images from PDF
  console.log('\n📷 Step 1: Extracting images from PDF...');
  const imagesByPage = await extractImagesFromPDF(PDF_PATH);

  let totalImages = 0;
  for (const [pageNum, images] of imagesByPage) {
    totalImages += images.length;
  }
  console.log(`   Found ${totalImages} large images across ${imagesByPage.size} pages`);

  // Step 2: Get TOMIS SCIs from Firestore
  console.log('\n📄 Step 2: Fetching TOMIS SCIs from Firestore...');
  const sciSnapshot = await db.collection(`companies/${COMPANY_ID}/standard_cleaning_instructions`)
    .where('siteId', '==', TOMIS_SITE_ID)
    .get();

  console.log(`   Found ${sciSnapshot.docs.length} SCIs`);

  // Step 3: Process each SCI
  console.log('\n🔄 Step 3: Processing SCIs...');

  let scisUpdated = 0;
  let imagesUploaded = 0;
  let imagesFailed = 0;

  for (const doc of sciSnapshot.docs) {
    const sciId = doc.id;
    const data = doc.data();
    const section = data.section || {};
    const existingImages = section.images || [];

    if (existingImages.length === 0) {
      continue;
    }

    console.log(`\n   📋 SCI: ${section.title || sciId}`);

    // Get the page numbers for this SCI's images
    const pageNumbers = [...new Set(existingImages.map((img: any) => img.pageNumber))];
    console.log(`      Page numbers: ${pageNumbers.join(', ')}`);

    // Collect PDF images for these pages
    const pdfImagesForSCI: ExtractedImage[] = [];
    for (const pageNum of pageNumbers) {
      const pageImages = imagesByPage.get(pageNum) || [];
      pdfImagesForSCI.push(...pageImages);
    }

    console.log(`      PDF images available: ${pdfImagesForSCI.length}`);
    console.log(`      Firestore images: ${existingImages.length}`);

    if (pdfImagesForSCI.length === 0) {
      console.log(`      ⚠️ No PDF images found for pages ${pageNumbers.join(', ')}`);
      continue;
    }

    // Update each existing image with data from PDF
    const updatedImages = [];
    for (let i = 0; i < existingImages.length; i++) {
      const existingImg = existingImages[i];
      const pdfImg = pdfImagesForSCI[i]; // Match by index

      if (!pdfImg) {
        console.log(`      ⚠️ No PDF image for index ${i}`);
        updatedImages.push(existingImg);
        continue;
      }

      const ext = pdfImg.mimeType === 'image/jpeg' ? 'jpg' : 'jp2';
      const storagePath = `companies/${COMPANY_ID}/work-instructions/${sciId}/image-${i}.${ext}`;

      if (DRY_RUN) {
        console.log(`      🔍 Would upload: ${storagePath} (${pdfImg.width}x${pdfImg.height}, ${Math.round(pdfImg.data.length / 1024)}KB)`);
        updatedImages.push({
          ...existingImg,
          storagePath,
          url: '(would be generated)'
        });
      } else {
        try {
          // Upload to Firebase Storage
          const file = bucket.file(storagePath);
          await file.save(pdfImg.data, {
            metadata: {
              contentType: pdfImg.mimeType
            }
          });

          // Get signed URL
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
          });

          updatedImages.push({
            caption: existingImg.caption || '',
            pageNumber: existingImg.pageNumber,
            storagePath,
            url
          });

          imagesUploaded++;
          console.log(`      ✅ Uploaded: image-${i}.${ext} (${pdfImg.width}x${pdfImg.height})`);
        } catch (error) {
          console.error(`      ❌ Failed to upload image-${i}:`, error);
          updatedImages.push(existingImg);
          imagesFailed++;
        }
      }
    }

    // Update Firestore
    if (!DRY_RUN && updatedImages.some((img: any) => img.url && img.url !== '')) {
      await db.collection(`companies/${COMPANY_ID}/standard_cleaning_instructions`).doc(sciId).update({
        'section.images': updatedImages,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      scisUpdated++;
      console.log(`      ✅ Firestore updated`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   SCIs processed: ${sciSnapshot.docs.length}`);
  console.log(`   SCIs updated: ${DRY_RUN ? '0 (dry run)' : scisUpdated}`);
  console.log(`   Images uploaded: ${DRY_RUN ? '0 (dry run)' : imagesUploaded}`);
  console.log(`   Images failed: ${imagesFailed}`);
  console.log('='.repeat(60));

  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to apply changes');
  }

  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
