/**
 * Firebase Service
 * Manages multiple Firebase project connections
 */

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

export interface FirebaseProject {
  app: admin.app.App;
  db: admin.firestore.Firestore;
  storage: admin.storage.Storage;
  auth: admin.auth.Auth;
}

// Store initialized projects
const firebaseProjects: Map<string, FirebaseProject> = new Map();

/**
 * Initialize all Firebase projects from environment variables
 */
export function initializeFirebase() {
  console.log('🔥 Initializing Firebase projects...');

  // Initialize iClean project
  if (process.env.ICLEAN_FIREBASE_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.ICLEAN_FIREBASE_KEY) as ServiceAccount;
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      }, 'iclean');

      firebaseProjects.set('iclean', {
        app,
        db: app.firestore(),
        storage: app.storage(),
        auth: app.auth()
      });

      console.log('   ✓ iClean Firebase initialized');
    } catch (error) {
      console.error('   ✗ Failed to initialize iClean Firebase:', error);
    }
  }

  // Initialize HACCP project
  if (process.env.HACCP_FIREBASE_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.HACCP_FIREBASE_KEY) as ServiceAccount;
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      }, 'haccp');

      firebaseProjects.set('haccp', {
        app,
        db: app.firestore(),
        storage: app.storage(),
        auth: app.auth()
      });

      console.log('   ✓ HACCP Firebase initialized');
    } catch (error) {
      console.error('   ✗ Failed to initialize HACCP Firebase:', error);
    }
  }

  // Initialize Math Platform project
  if (process.env.MATH_FIREBASE_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.MATH_FIREBASE_KEY) as ServiceAccount;
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      }, 'math');

      firebaseProjects.set('math', {
        app,
        db: app.firestore(),
        storage: app.storage(),
        auth: app.auth()
      });

      console.log('   ✓ Math Platform Firebase initialized');
    } catch (error) {
      console.error('   ✗ Failed to initialize Math Platform Firebase:', error);
    }
  }

  // Initialize PeakFlow project (if configured)
  if (process.env.PEAKFLOW_FIREBASE_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.PEAKFLOW_FIREBASE_KEY) as ServiceAccount;
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
      }, 'peakflow');

      firebaseProjects.set('peakflow', {
        app,
        db: app.firestore(),
        storage: app.storage(),
        auth: app.auth()
      });

      console.log('   ✓ PeakFlow Firebase initialized');
    } catch (error) {
      console.error('   ✗ Failed to initialize PeakFlow Firebase:', error);
    }
  }

  console.log(`   Total projects initialized: ${firebaseProjects.size}`);
}

/**
 * Get a Firebase project by name
 */
export function getFirebaseProject(projectName: string): FirebaseProject | undefined {
  return firebaseProjects.get(projectName);
}

/**
 * Get all initialized Firebase projects
 */
export function getAllFirebaseProjects(): Map<string, FirebaseProject> {
  return firebaseProjects;
}

/**
 * Upload file to Firebase Storage
 */
export async function uploadToFirebaseStorage(
  projectName: string,
  file: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const project = getFirebaseProject(projectName);
  if (!project) {
    throw new Error(`Firebase project ${projectName} not initialized`);
  }

  const bucket = project.storage.bucket();
  const fileRef = bucket.file(path);

  await fileRef.save(file, {
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000'
    }
  });

  // Get public URL
  const [url] = await fileRef.getSignedUrl({
    action: 'read',
    expires: '03-01-2500' // Far future expiry
  });

  return url;
}

/**
 * Save document to Firestore
 */
export async function saveToFirestore(
  projectName: string,
  collection: string,
  data: any,
  docId?: string
): Promise<string> {
  const project = getFirebaseProject(projectName);
  if (!project) {
    throw new Error(`Firebase project ${projectName} not initialized`);
  }

  const collectionRef = project.db.collection(collection);
  let docRef;

  if (docId) {
    docRef = collectionRef.doc(docId);
    await docRef.set(data, { merge: true });
  } else {
    docRef = await collectionRef.add(data);
  }

  return docRef.id;
}

/**
 * Read document from Firestore
 */
export async function readFromFirestore(
  projectName: string,
  collection: string,
  docId: string
): Promise<any> {
  const project = getFirebaseProject(projectName);
  if (!project) {
    throw new Error(`Firebase project ${projectName} not initialized`);
  }

  const doc = await project.db.collection(collection).doc(docId).get();
  if (!doc.exists) {
    throw new Error(`Document ${docId} not found in ${collection}`);
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Query Firestore collection
 */
export async function queryFirestore(
  projectName: string,
  collection: string,
  filters: Array<{ field: string; operator: any; value: any }> = [],
  limit: number = 100
): Promise<any[]> {
  const project = getFirebaseProject(projectName);
  if (!project) {
    throw new Error(`Firebase project ${projectName} not initialized`);
  }

  let query: any = project.db.collection(collection);

  filters.forEach(filter => {
    query = query.where(filter.field, filter.operator, filter.value);
  });

  query = query.limit(limit);

  const snapshot = await query.get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export default {
  initializeFirebase,
  getFirebaseProject,
  getAllFirebaseProjects,
  uploadToFirebaseStorage,
  saveToFirestore,
  readFromFirestore,
  queryFirestore
};