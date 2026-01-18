/**
 * Delete all SCIs for a specific site
 * Usage: npx tsx scripts/delete-site-scis.ts --site=<siteId> [--dry-run]
 */

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const ACS_COMPANY_ID = 'AnmdYRpshMosqbsZ6l15';

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SITE_ID = args.find(a => a.startsWith('--site='))?.split('=')[1] || '';

if (!SITE_ID) {
  console.error('Usage: npx tsx scripts/delete-site-scis.ts --site=<siteId> [--dry-run]');
  process.exit(1);
}

async function main() {
  console.log('🗑️  Delete Site SCIs');
  console.log('='.repeat(60));
  console.log(`Site ID: ${SITE_ID}`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN' : '⚠️ LIVE DELETE'}`);
  console.log('='.repeat(60));

  // Initialize Firebase
  const firebaseKey = process.env.ICLEAN_FIREBASE_KEY;
  if (!firebaseKey) {
    console.error('❌ ICLEAN_FIREBASE_KEY not found');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(firebaseKey) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, 'sci-deleter');

  const db = app.firestore();

  // Get site name
  const siteDoc = await db.doc(`companies/${ACS_COMPANY_ID}/sites/${SITE_ID}`).get();
  const siteName = siteDoc.exists ? (siteDoc.data()?.name || SITE_ID) : SITE_ID;
  console.log(`📍 Site: ${siteName}`);

  // Query SCIs for this site
  const collectionPath = `companies/${ACS_COMPANY_ID}/standard_cleaning_instructions`;
  const snapshot = await db.collection(collectionPath)
    .where('siteId', '==', SITE_ID)
    .get();

  console.log(`\n📋 Found ${snapshot.size} SCIs to delete`);

  if (snapshot.size === 0) {
    console.log('✅ No SCIs to delete');
    process.exit(0);
  }

  // List what would be deleted
  console.log('\nSCIs to delete:');
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const title = data.section?.title || 'Unknown';
    const docNo = data.section?.documentMetadata?.documentId || 'no doc#';
    console.log(`   - ${title} (${docNo})`);
  }

  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to delete these documents');
    process.exit(0);
  }

  // Delete in batches
  console.log('\n🗑️  Deleting...');
  const batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    count++;

    // Firestore batches limited to 500 operations
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`   Deleted ${count} documents...`);
    }
  }

  // Commit remaining
  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`\n✅ Deleted ${count} SCIs for ${siteName}`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
