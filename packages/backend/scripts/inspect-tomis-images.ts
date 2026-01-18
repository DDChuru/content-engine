/**
 * Inspect the actual image data structure in TOMIS SCIs
 * to understand what happened during import
 */

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const COMPANY_ID = 'AnmdYRpshMosqbsZ6l15';
const TOMIS_SITE_ID = 'nNonJXbB0W7n9fG1OQBi';

async function inspectTomisImages() {
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, 'tomis-image-inspector');

  const db = app.firestore();

  console.log('🔍 Inspecting TOMIS ABATTOIR Image Data Structure');
  console.log('='.repeat(60));

  // Get one TOMIS SCI
  const snapshot = await db.collection(`companies/${COMPANY_ID}/standard_cleaning_instructions`)
    .where('siteId', '==', TOMIS_SITE_ID)
    .limit(3)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const section = data.section || {};
    const images = section.images || [];

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 SCI: ${doc.id}`);
    console.log(`   Title: ${section.title}`);
    console.log(`   Created: ${data.createdAt}`);
    console.log(`   Source File: ${data.sourceFile?.name || 'N/A'}`);
    console.log(`\n📷 Images Array (${images.length} items):`);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      console.log(`\n   Image ${i}:`);
      console.log(`     Keys present: ${Object.keys(img).join(', ')}`);
      console.log(`     caption: ${img.caption ? img.caption.substring(0, 60) + '...' : '(empty)'}`);
      console.log(`     pageNumber: ${img.pageNumber}`);
      console.log(`     storagePath: ${img.storagePath || '(missing)'}`);
      console.log(`     url: ${img.url ? img.url.substring(0, 80) + '...' : '(missing)'}`);
      console.log(`     data: ${img.data ? `(base64, ${img.data.length} chars)` : '(missing)'}`);
      console.log(`     mimeType: ${img.mimeType || '(missing)'}`);
    }
  }

  // Now check a WORKING SCI for comparison
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 COMPARISON: Working SCI (Blue Ribbon Bakery)');
  console.log('='.repeat(60));

  const workingSnapshot = await db.collection(`companies/${COMPANY_ID}/standard_cleaning_instructions`)
    .where('siteId', '==', 'wMj1uhWQRUXIR1LjoMpM')
    .limit(1)
    .get();

  if (workingSnapshot.docs.length > 0) {
    const doc = workingSnapshot.docs[0];
    const data = doc.data();
    const section = data.section || {};
    const images = section.images || [];

    console.log(`\n📄 SCI: ${doc.id}`);
    console.log(`   Title: ${section.title}`);
    console.log(`   Created: ${data.createdAt}`);
    console.log(`   Source File: ${data.sourceFile?.name || 'N/A'}`);
    console.log(`\n📷 Images Array (${images.length} items):`);

    for (let i = 0; i < Math.min(images.length, 2); i++) {
      const img = images[i];
      console.log(`\n   Image ${i}:`);
      console.log(`     Keys present: ${Object.keys(img).join(', ')}`);
      console.log(`     caption: ${img.caption ? img.caption.substring(0, 60) + '...' : '(empty)'}`);
      console.log(`     pageNumber: ${img.pageNumber}`);
      console.log(`     storagePath: ${img.storagePath || '(missing)'}`);
      console.log(`     url: ${img.url ? img.url.substring(0, 80) + '...' : '(missing)'}`);
      console.log(`     data: ${img.data ? `(base64, ${img.data.length} chars)` : '(missing - expected after upload)'}`);
      console.log(`     mimeType: ${img.mimeType || '(missing - expected after upload)'}`);
    }
  }

  process.exit(0);
}

inspectTomisImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
