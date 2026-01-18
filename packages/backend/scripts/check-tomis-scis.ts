/**
 * Check what SCIs exist for TOMIS ABATTOIR and their image storage status
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
const STORAGE_BUCKET = 'iclean-field-service-4bddd.appspot.com';

async function checkTomisSCIs() {
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET
  }, 'tomis-checker');

  const db = app.firestore();
  const bucket = app.storage().bucket();

  console.log('🔍 Checking TOMIS ABATTOIR SCIs');
  console.log('='.repeat(60));

  // Get SCIs for TOMIS site
  const snapshot = await db.collection(`companies/${COMPANY_ID}/standard_cleaning_instructions`)
    .where('siteId', '==', TOMIS_SITE_ID)
    .limit(10)
    .get();

  console.log(`Found ${snapshot.docs.length} SCIs for TOMIS ABATTOIR\n`);

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const section = data.section || {};
    const images = section.images || [];

    console.log(`\n📄 SCI: ${doc.id}`);
    console.log(`   Title: ${section.title || 'N/A'}`);
    console.log(`   Section ID: ${section.sectionId || 'N/A'}`);
    console.log(`   Images in Firestore: ${images.length}`);

    if (images.length > 0) {
      // Check if first image has storagePath/url
      const firstImg = images[0];
      console.log(`   First image:`);
      console.log(`     - Has storagePath: ${!!firstImg.storagePath}`);
      console.log(`     - Has url: ${!!firstImg.url}`);
      const caption = firstImg.caption || '(none)';
      console.log(`     - Caption: ${caption.substring(0, 50)}...`);

      // Check if file exists in storage for this SCI
      const expectedPath = `companies/${COMPANY_ID}/work-instructions/${doc.id}/image-0.jpg`;
      const [exists] = await bucket.file(expectedPath).exists();
      console.log(`   Storage file exists: ${exists}`);
      console.log(`     Expected path: ${expectedPath}`);
    }
  }

  // Also list any files in storage for TOMIS site SCIs
  console.log('\n\n📁 Searching storage for TOMIS files...');
  const [files] = await bucket.getFiles({
    prefix: `companies/${COMPANY_ID}/work-instructions/`,
    maxResults: 200
  });

  // Filter for TOMIS site SCIs (they should contain the site ID)
  const tomisFiles = files.filter(f =>
    f.name.includes(TOMIS_SITE_ID) ||
    f.name.includes('nNonJXbB0W7n9fG1OQBi')
  );

  console.log(`Found ${tomisFiles.length} files for TOMIS in storage`);
  for (const file of tomisFiles.slice(0, 10)) {
    console.log(`  - ${file.name}`);
  }

  process.exit(0);
}

checkTomisSCIs().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
