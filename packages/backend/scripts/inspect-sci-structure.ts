/**
 * Inspect SCI Document Structure
 * Check what fields exist on SCI documents to understand the actual data model
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

async function inspectSCIStructure() {
  const key = process.env.ICLEAN_FIREBASE_KEY;
  if (!key) {
    throw new Error('ICLEAN_FIREBASE_KEY not found');
  }

  const serviceAccount = JSON.parse(key) as ServiceAccount;
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, 'sci-inspector');

  const db = app.firestore();
  const sciCollectionPath = `companies/${COMPANY_ID}/standard_cleaning_instructions`;

  console.log('🔍 Inspecting SCI Document Structure');
  console.log('='.repeat(60));

  // Get first few documents
  const snapshot = await db.collection(sciCollectionPath).limit(5).get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    console.log(`\n📄 Document ID: ${doc.id}`);
    console.log('   Fields present:');

    // List all top-level fields
    for (const [key, value] of Object.entries(data)) {
      const valueType = Array.isArray(value) ? `array[${value.length}]` :
                        value === null ? 'null' :
                        typeof value === 'object' ? 'object' :
                        typeof value;

      if (Array.isArray(value) && value.length > 0) {
        console.log(`   - ${key}: ${valueType}`);
        // Show first element structure for arrays
        const firstItem = value[0];
        if (typeof firstItem === 'object' && firstItem !== null) {
          console.log(`     First item keys: ${Object.keys(firstItem).join(', ')}`);
        }
      } else if (typeof value === 'object' && value !== null && !value._seconds) {
        console.log(`   - ${key}: ${valueType}`);
        // Show nested object keys
        const nestedKeys = Object.keys(value);
        if (nestedKeys.length <= 10) {
          console.log(`     Keys: ${nestedKeys.join(', ')}`);
        } else {
          console.log(`     Keys: ${nestedKeys.slice(0, 10).join(', ')}... (${nestedKeys.length} total)`);
        }
      } else {
        // Truncate long values
        const displayValue = typeof value === 'string' && value.length > 50
          ? value.substring(0, 50) + '...'
          : value;
        console.log(`   - ${key}: ${valueType} = ${JSON.stringify(displayValue)}`);
      }
    }
  }

  // Also check if there's a 'section' (singular) field
  const sampleDoc = snapshot.docs[0];
  if (sampleDoc) {
    const data = sampleDoc.data();
    console.log('\n\n📋 Full first document structure (JSON):');
    console.log(JSON.stringify(data, null, 2).substring(0, 3000) + '...');
  }

  process.exit(0);
}

inspectSCIStructure().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
