/**
 * Search all storage locations for any files related to TOMIS or the specific SCI
 */

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const STORAGE_BUCKET = 'iclean-field-service-4bddd.appspot.com';

async function searchAllStorage() {
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET
  }, 'storage-searcher');

  const bucket = app.storage().bucket();

  console.log('🔍 Searching all Firebase Storage locations');
  console.log('='.repeat(60));

  // Get all top-level prefixes
  console.log('\n📁 Listing all top-level folders in bucket...');
  const [allFiles] = await bucket.getFiles({
    maxResults: 500,
    delimiter: '/'
  });

  // Show top-level structure
  const topLevelFolders = new Set<string>();
  for (const file of allFiles) {
    const parts = file.name.split('/');
    if (parts[0]) {
      topLevelFolders.add(parts[0]);
    }
  }

  console.log('Top-level folders:');
  for (const folder of topLevelFolders) {
    console.log(`  📁 ${folder}/`);
  }

  // Search for TOMIS anywhere
  console.log('\n\n🔎 Searching for "TOMIS" in any path...');
  const [allFilesSearch] = await bucket.getFiles({
    maxResults: 1000
  });

  const tomisMatches = allFilesSearch.filter(f =>
    f.name.toUpperCase().includes('TOMIS')
  );

  console.log(`Found ${tomisMatches.length} files containing "TOMIS":`);
  for (const file of tomisMatches.slice(0, 20)) {
    console.log(`  - ${file.name}`);
  }

  // Search for jpg/png images in work-instructions
  console.log('\n\n📷 Listing all image files in work-instructions...');
  const [wiFiles] = await bucket.getFiles({
    prefix: 'companies/',
    maxResults: 500
  });

  const imageFiles = wiFiles.filter(f =>
    f.name.match(/\.(jpg|jpeg|png|gif)$/i)
  );

  console.log(`Found ${imageFiles.length} image files total:`);

  // Group by SCI (folder)
  const bySCI = new Map<string, string[]>();
  for (const file of imageFiles) {
    const parts = file.name.split('/');
    if (parts.length >= 4) {
      const sciFolder = parts.slice(0, 4).join('/');
      if (!bySCI.has(sciFolder)) {
        bySCI.set(sciFolder, []);
      }
      bySCI.get(sciFolder)!.push(file.name);
    }
  }

  console.log(`\nImages grouped by SCI folder (${bySCI.size} SCIs with images):`);
  let count = 0;
  for (const [folder, files] of bySCI) {
    if (count++ < 10) {
      console.log(`  📁 ${folder} (${files.length} images)`);
    }
  }
  if (bySCI.size > 10) {
    console.log(`  ... and ${bySCI.size - 10} more`);
  }

  // Check specific storagePath from a TOMIS SCI
  const testPath = 'companies/AnmdYRpshMosqbsZ6l15/work-instructions/nNonJXbB0W7n9fG1OQBi_TOMIS_ABATTOIR_FLOORS_1764198357819/image-0.jpg';
  console.log(`\n\n🔍 Checking specific path: ${testPath}`);
  const [exists] = await bucket.file(testPath).exists();
  console.log(`   File exists: ${exists}`);

  // Also check alternative paths
  const altPaths = [
    'work-instructions/nNonJXbB0W7n9fG1OQBi_TOMIS_ABATTOIR_FLOORS_1764198357819/image-0.jpg',
    'companies/AnmdYRpshMosqbsZ6l15/nNonJXbB0W7n9fG1OQBi_TOMIS_ABATTOIR_FLOORS_1764198357819/image-0.jpg',
    'nNonJXbB0W7n9fG1OQBi_TOMIS_ABATTOIR_FLOORS_1764198357819/image-0.jpg',
  ];

  console.log('\n   Checking alternative paths:');
  for (const p of altPaths) {
    const [ex] = await bucket.file(p).exists();
    console.log(`   - ${p}: ${ex}`);
  }

  process.exit(0);
}

searchAllStorage().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
