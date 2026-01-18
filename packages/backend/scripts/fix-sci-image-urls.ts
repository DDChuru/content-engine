/**
 * Fix Missing Image URLs in Standard Cleaning Instructions (SCIs)
 *
 * PROBLEM:
 * When SCIs are imported, the images array in section may be missing:
 * - storagePath: The Firebase Storage path to the image
 * - url: The signed URL for accessing the image
 *
 * ACTUAL DATA STRUCTURE:
 * - section (object, NOT array)
 *   - images (array)
 *     - { caption, pageNumber } <-- missing storagePath and url
 *
 * SOLUTION:
 * This script reconstructs these values based on the known pattern:
 * - storagePath: companies/${companyId}/work-instructions/${sciDocId}/image-${imageIndex}.jpg
 * - url: Signed URL from Firebase Storage
 *
 * USAGE:
 * npx tsx scripts/fix-sci-image-urls.ts [--dry-run] [--site-id=xxx]
 *
 * Options:
 * --dry-run    Preview changes without writing to Firestore
 * --site-id    Only process SCIs for a specific site
 * --limit=N    Only process N documents (for testing)
 */

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Configuration
const COMPANY_ID = 'AnmdYRpshMosqbsZ6l15'; // ACS company ID
const STORAGE_BUCKET = 'iclean-field-service-4bddd.appspot.com';

// Parse command line args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const siteIdArg = args.find(a => a.startsWith('--site-id='));
const SITE_ID_FILTER = siteIdArg ? siteIdArg.split('=')[1] : null;
const limitArg = args.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : 1000;

interface ImageData {
  caption?: string;
  pageNumber?: number;
  storagePath?: string;
  url?: string;
}

interface Section {
  images?: ImageData[];
  [key: string]: any;
}

interface SCIDocument {
  id: string;
  siteId?: string;
  section?: Section;  // Note: singular, not plural
  [key: string]: any;
}

async function initializeFirebase(): Promise<{ db: admin.firestore.Firestore; storage: admin.storage.Storage }> {
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found in environment');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET
  }, 'sci-fixer');

  return {
    db: app.firestore(),
    storage: app.storage()
  };
}

async function generateSignedUrl(storage: admin.storage.Storage, storagePath: string): Promise<string> {
  const bucket = storage.bucket();
  const file = bucket.file(storagePath);

  // Check if file exists first
  const [exists] = await file.exists();
  if (!exists) {
    console.warn(`      ⚠️ File does not exist in storage: ${storagePath}`);
    return '';
  }

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500' // Far future expiry
  });

  return url;
}

async function fixSCIImageUrls() {
  console.log('🔧 Fix SCI Image URLs Script');
  console.log('='.repeat(60));
  console.log(`Company ID: ${COMPANY_ID}`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes will be made)' : '✏️ LIVE (will update Firestore)'}`);
  if (SITE_ID_FILTER) {
    console.log(`Site Filter: ${SITE_ID_FILTER}`);
  }
  console.log(`Limit: ${LIMIT} documents`);
  console.log('='.repeat(60));

  const { db, storage } = await initializeFirebase();

  // Query SCIs
  const sciCollectionPath = `companies/${COMPANY_ID}/standard_cleaning_instructions`;
  console.log(`\n📂 Querying: ${sciCollectionPath}`);

  let query: admin.firestore.Query = db.collection(sciCollectionPath);

  if (SITE_ID_FILTER) {
    query = query.where('siteId', '==', SITE_ID_FILTER);
  }

  query = query.limit(LIMIT);

  const snapshot = await query.get();
  console.log(`📊 Found ${snapshot.docs.length} SCI documents`);

  let docsProcessed = 0;
  let docsUpdated = 0;
  let imagesFixed = 0;
  let imagesMissingFile = 0;
  let imagesAlreadyComplete = 0;

  for (const doc of snapshot.docs) {
    const sciData = doc.data() as SCIDocument;
    const sciId = doc.id;

    console.log(`\n📄 Processing SCI: ${sciId}`);
    console.log(`   Site: ${sciData.siteName || sciData.siteId || 'N/A'}`);

    // Check if section exists with images (singular "section", not "sections")
    if (!sciData.section || typeof sciData.section !== 'object') {
      console.log('   ⏭️ No section object, skipping');
      continue;
    }

    const section = sciData.section;

    if (!section.images || !Array.isArray(section.images)) {
      console.log('   ⏭️ No images array in section, skipping');
      continue;
    }

    console.log(`   📷 Found ${section.images.length} images`);

    let needsUpdate = false;
    const updatedImages = [...section.images];

    for (let imageIndex = 0; imageIndex < updatedImages.length; imageIndex++) {
      const image = updatedImages[imageIndex];

      // Check if storagePath or url is missing
      const needsStoragePath = !image.storagePath;
      const needsUrl = !image.url;

      if (!needsStoragePath && !needsUrl) {
        imagesAlreadyComplete++;
        continue; // Already has both
      }

      // Generate storagePath
      // Pattern: companies/${companyId}/work-instructions/${sciDocId}/image-${imageIndex}.jpg
      const storagePath = `companies/${COMPANY_ID}/work-instructions/${sciId}/image-${imageIndex}.jpg`;

      console.log(`   🖼️ Image ${imageIndex}:`);
      console.log(`      Caption: ${image.caption?.substring(0, 50) || '(no caption)'}...`);
      console.log(`      Missing: ${needsStoragePath ? 'storagePath ' : ''}${needsUrl ? 'url' : ''}`);
      console.log(`      Generated path: ${storagePath}`);

      if (!DRY_RUN) {
        // Generate signed URL
        const url = await generateSignedUrl(storage, storagePath);

        if (url) {
          // Update the image object
          updatedImages[imageIndex] = {
            ...image,
            storagePath,
            url
          };
          needsUpdate = true;
          imagesFixed++;
          console.log(`      ✅ URL generated successfully`);
        } else {
          imagesMissingFile++;
          // Still add storagePath even if file doesn't exist (for reference)
          updatedImages[imageIndex] = {
            ...image,
            storagePath,
            url: '' // Empty URL indicates file not found
          };
          needsUpdate = true;
        }
      } else {
        imagesFixed++;
        console.log(`      🔍 Would generate URL for: ${storagePath}`);
      }
    }

    docsProcessed++;

    if (needsUpdate && !DRY_RUN) {
      // Update Firestore document - update the section.images array
      await db.collection(sciCollectionPath).doc(sciId).update({
        'section.images': updatedImages,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      docsUpdated++;
      console.log(`   ✅ Document updated in Firestore`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Documents processed: ${docsProcessed}`);
  console.log(`   Documents updated: ${DRY_RUN ? '0 (dry run)' : docsUpdated}`);
  console.log(`   Images needing fix: ${imagesFixed}`);
  console.log(`   Images already complete: ${imagesAlreadyComplete}`);
  console.log(`   Images with missing files: ${imagesMissingFile}`);
  console.log('='.repeat(60));

  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to apply changes');
  }

  process.exit(0);
}

fixSCIImageUrls().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
