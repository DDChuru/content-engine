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
        storageBucket: `${serviceAccount.projectId}.appspot.com`
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
        storageBucket: `${serviceAccount.projectId}.appspot.com`
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
        storageBucket: `${serviceAccount.projectId}.appspot.com`
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
        storageBucket: `${serviceAccount.projectId}.firebasestorage.app`
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

  // Initialize ACS project (if configured)
  if (process.env.ACS_FIREBASE_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.ACS_FIREBASE_KEY) as ServiceAccount;
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.projectId}.appspot.com`
      }, 'acs');

      firebaseProjects.set('acs', {
        app,
        db: app.firestore(),
        storage: app.storage(),
        auth: app.auth()
      });

      console.log('   ✓ ACS Firebase initialized');
    } catch (error) {
      console.error('   ✗ Failed to initialize ACS Firebase:', error);
    }
  }

  // Initialize Education project (if configured)
  if (process.env.EDUCATION_FIREBASE_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.EDUCATION_FIREBASE_KEY) as ServiceAccount;
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.projectId}.appspot.com`
      }, 'education');

      firebaseProjects.set('education', {
        app,
        db: app.firestore(),
        storage: app.storage(),
        auth: app.auth()
      });

      console.log('   ✓ Education Firebase initialized');
    } catch (error) {
      console.error('   ✗ Failed to initialize Education Firebase:', error);
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

/**
 * CSC Architecture: Build path for company-scoped collection
 */
export function getCSCCollectionPath(companyId: string, collection: string): string {
  return `companies/${companyId}/${collection}`;
}

/**
 * CSC Architecture: Query sites with iClean enabled
 */
export async function getICleanSites(
  projectName: string,
  companyId: string,
  limit: number = 1000
): Promise<any[]> {
  console.log('🔥 [getICleanSites] Starting query:', {
    projectName,
    companyId,
    limit
  });

  const project = getFirebaseProject(projectName);
  if (!project) {
    console.error('❌ [getICleanSites] Firebase project not initialized:', projectName);
    throw new Error(`Firebase project ${projectName} not initialized`);
  }

  console.log('✅ [getICleanSites] Firebase project found:', projectName);

  const collectionPath = getCSCCollectionPath(companyId, 'sites');
  console.log('📂 [getICleanSites] Collection path:', collectionPath);

  // Fetch ALL sites first (no filter)
  console.log('🔍 [getICleanSites] Fetching ALL sites (no filter)...');
  const snapshot = await project.db
    .collection(collectionPath)
    .limit(limit)
    .get();

  console.log('📊 [getICleanSites] Query results:', {
    docCount: snapshot.docs.length,
    empty: snapshot.empty
  });

  const allSites = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

  if (allSites.length > 0) {
    console.log('✅ [getICleanSites] Sample sites (first 3):', allSites.slice(0, 3).map(s => ({
      id: s.id,
      name: s.name,
      iClean_root: s.iClean,
      iClean_settings: s.settings?.iClean,
      location: s.location
    })));
  } else {
    console.warn('⚠️ [getICleanSites] No sites found at path:', collectionPath);
    return [];
  }

  // Filter in memory for iClean sites (check both root and settings)
  const iCleanSites = allSites.filter((site: any) =>
    site.iClean === true || site.settings?.iClean === true
  );

  console.log('📊 [getICleanSites] In-memory filter results:', {
    totalSites: allSites.length,
    iCleanSites: iCleanSites.length,
    filteredOut: allSites.length - iCleanSites.length
  });

  if (iCleanSites.length === 0) {
    console.warn('⚠️ [getICleanSites] No sites have iClean flag set!');
    console.log('💡 [getICleanSites] Returning ALL sites instead of empty array');
    // Return all sites if none have iClean flag (for development)
    return allSites;
  }

  return iCleanSites;
}

/**
 * CSC Architecture: Search sites by name (for type-ahead)
 */
export async function searchSitesByName(
  projectName: string,
  companyId: string,
  searchTerm: string,
  iCleanOnly: boolean = true,
  limit: number = 100
): Promise<any[]> {
  console.log('🔥 [searchSitesByName] Starting search:', {
    projectName,
    companyId,
    searchTerm,
    iCleanOnly,
    limit
  });

  const project = getFirebaseProject(projectName);
  if (!project) {
    console.error('❌ [searchSitesByName] Firebase project not initialized:', projectName);
    throw new Error(`Firebase project ${projectName} not initialized`);
  }

  const collectionPath = getCSCCollectionPath(companyId, 'sites');
  console.log('📂 [searchSitesByName] Collection path:', collectionPath);

  // Fetch ALL sites (no Firestore filter)
  console.log('🔍 [searchSitesByName] Fetching ALL sites for in-memory filtering...');
  const snapshot = await project.db
    .collection(collectionPath)
    .limit(1000)
    .get();

  console.log('📊 [searchSitesByName] Fetched sites:', {
    count: snapshot.docs.length
  });

  let sites = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

  // Filter by iClean in memory (check both root and settings)
  if (iCleanOnly) {
    const beforeFilter = sites.length;
    sites = sites.filter((site: any) =>
      site.iClean === true || site.settings?.iClean === true
    );
    console.log('🔍 [searchSitesByName] iClean filter:', {
      before: beforeFilter,
      after: sites.length,
      filtered: beforeFilter - sites.length
    });

    if (sites.length === 0) {
      console.warn('⚠️ [searchSitesByName] No iClean sites found, returning all sites');
      sites = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }
  }

  // Client-side filtering by name
  const searchLower = searchTerm.toLowerCase();
  const filtered = sites.filter((site: any) =>
    site.name?.toLowerCase().includes(searchLower) ||
    site.location?.toLowerCase().includes(searchLower) ||
    site.fullAddress?.toLowerCase().includes(searchLower)
  );

  console.log('✅ [searchSitesByName] Filtered results:', {
    searchTerm,
    beforeFilter: sites.length,
    afterFilter: filtered.length,
    matches: filtered.slice(0, 5).map(s => s.name)
  });

  return filtered.slice(0, limit);
}

export default {
  initializeFirebase,
  getFirebaseProject,
  getAllFirebaseProjects,
  uploadToFirebaseStorage,
  saveToFirestore,
  readFromFirestore,
  queryFirestore,
  getCSCCollectionPath,
  getICleanSites,
  searchSitesByName
};
