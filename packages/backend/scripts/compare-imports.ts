/**
 * Compare how TOMIS vs Blue Ribbon were imported
 * Check all metadata to understand the difference
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

async function compareImports() {
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, 'import-comparer');

  const db = app.firestore();

  console.log('🔍 Comparing Import Methods');
  console.log('='.repeat(70));

  // Get one TOMIS SCI
  const tomisSnapshot = await db.collection(`companies/${COMPANY_ID}/standard_cleaning_instructions`)
    .where('siteId', '==', 'nNonJXbB0W7n9fG1OQBi')
    .limit(1)
    .get();

  // Get one Blue Ribbon SCI
  const blueRibbonSnapshot = await db.collection(`companies/${COMPANY_ID}/standard_cleaning_instructions`)
    .where('siteId', '==', 'wMj1uhWQRUXIR1LjoMpM')
    .limit(1)
    .get();

  console.log('\n📄 TOMIS ABATTOIR SCI:');
  console.log('-'.repeat(70));
  if (tomisSnapshot.docs.length > 0) {
    const doc = tomisSnapshot.docs[0];
    const data = doc.data();

    // Show ALL top-level fields (excluding section content)
    const topLevel: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'section') {
        topLevel.section = '(object with images, stepGroups, etc.)';
      } else {
        topLevel[key] = value;
      }
    }
    console.log(JSON.stringify(topLevel, null, 2));

    // Show raw image object structure
    const images = data.section?.images || [];
    console.log(`\n   Raw first image object:`);
    if (images[0]) {
      console.log('   ' + JSON.stringify(images[0], null, 2).replace(/\n/g, '\n   '));
    }
  }

  console.log('\n\n📄 BLUE RIBBON BAKERY SCI:');
  console.log('-'.repeat(70));
  if (blueRibbonSnapshot.docs.length > 0) {
    const doc = blueRibbonSnapshot.docs[0];
    const data = doc.data();

    // Show ALL top-level fields (excluding section content)
    const topLevel: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'section') {
        topLevel.section = '(object with images, stepGroups, etc.)';
      } else {
        topLevel[key] = value;
      }
    }
    console.log(JSON.stringify(topLevel, null, 2));

    // Show raw image object structure
    const images = data.section?.images || [];
    console.log(`\n   Raw first image object:`);
    if (images[0]) {
      // Truncate URL for readability
      const img = { ...images[0] };
      if (img.url && img.url.length > 100) {
        img.url = img.url.substring(0, 100) + '...';
      }
      console.log('   ' + JSON.stringify(img, null, 2).replace(/\n/g, '\n   '));
    }
  }

  // Check if TOMIS has url field as empty string vs undefined
  console.log('\n\n🔍 URL Field Analysis:');
  console.log('-'.repeat(70));

  if (tomisSnapshot.docs.length > 0) {
    const images = tomisSnapshot.docs[0].data().section?.images || [];
    if (images[0]) {
      console.log('TOMIS image[0].url:', {
        value: images[0].url,
        type: typeof images[0].url,
        hasKey: 'url' in images[0],
        isEmptyString: images[0].url === '',
        isUndefined: images[0].url === undefined,
        isNull: images[0].url === null
      });
    }
  }

  process.exit(0);
}

compareImports().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
