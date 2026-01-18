/**
 * List what's actually in Firebase Storage for work-instructions
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
const STORAGE_BUCKET = 'iclean-field-service-4bddd.appspot.com';

async function listStorageImages() {
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET
  }, 'storage-lister');

  const bucket = app.storage().bucket();

  console.log('🔍 Listing files in Firebase Storage');
  console.log('='.repeat(60));
  console.log(`Bucket: ${STORAGE_BUCKET}`);
  console.log(`Looking in: companies/${COMPANY_ID}/work-instructions/`);
  console.log('='.repeat(60));

  // List files in the work-instructions folder
  const [files] = await bucket.getFiles({
    prefix: `companies/${COMPANY_ID}/work-instructions/`,
    maxResults: 100
  });

  console.log(`\n📁 Found ${files.length} files:\n`);

  for (const file of files) {
    console.log(`  - ${file.name}`);
  }

  // Also check what other folders exist under companies/
  console.log('\n\n📂 Other folders under companies/' + COMPANY_ID + '/');
  console.log('='.repeat(60));

  const [allFiles] = await bucket.getFiles({
    prefix: `companies/${COMPANY_ID}/`,
    maxResults: 50,
    delimiter: '/'
  });

  // Get unique folder prefixes
  const folders = new Set<string>();
  for (const file of allFiles) {
    const parts = file.name.split('/');
    if (parts.length > 2) {
      folders.add(parts.slice(0, 3).join('/'));
    }
  }

  for (const folder of folders) {
    console.log(`  📁 ${folder}`);
  }

  process.exit(0);
}

listStorageImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
