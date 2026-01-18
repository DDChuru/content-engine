/**
 * Check an SCI that HAS working images to see the correct structure
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

async function checkWorkingSCI() {
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, 'checker');

  const db = app.firestore();

  // This SCI ID has images in storage
  const sciId = 'wMj1uhWQRUXIR1LjoMpM_SCI_SCI_90_1760830054079';
  const sciPath = `companies/${COMPANY_ID}/standard_cleaning_instructions/${sciId}`;

  console.log('🔍 Checking SCI with working images');
  console.log('='.repeat(60));
  console.log(`Path: ${sciPath}`);

  const doc = await db.doc(sciPath).get();

  if (!doc.exists) {
    console.log('❌ Document not found');

    // Try to find any SCI with this prefix
    console.log('\nSearching for SCIs with prefix wMj1uhWQRUXIR1LjoMpM...');
    const snapshot = await db.collection(`companies/${COMPANY_ID}/standard_cleaning_instructions`)
      .limit(10)
      .get();

    console.log(`Found ${snapshot.docs.length} documents:`);
    snapshot.docs.forEach(d => console.log(`  - ${d.id}`));

    process.exit(0);
  }

  const data = doc.data();
  console.log('\n📄 Document structure:');
  console.log(JSON.stringify(data, null, 2));

  process.exit(0);
}

checkWorkingSCI().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
