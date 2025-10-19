import { Router, Request, Response } from 'express';
import multer from 'multer';
import type { DocumentExtractionService } from '../services/document-extraction.js';
import {
  getCSCCollectionPath,
  getICleanSites,
  queryFirestore,
  readFromFirestore,
  saveToFirestore,
  searchSitesByName,
  uploadToFirebaseStorage
} from '../services/firebase.js';
import type { WorkInstructionExtraction, WorkInstructionImportResult, WorkInstructionSection } from 'shared/types';

// ACS Company ID constant
const ACS_COMPANY_ID = 'AnmdYRpshMosqbsZ6l15';

const sanitizeForFirestore = (value: unknown): any => {
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      const sanitized = sanitizeForFirestore(val);
      if (sanitized !== undefined) {
        result[key] = sanitized;
      }
    }
    return result;
  }

  return value === undefined ? undefined : value;
};

const uploadSectionImages = async (
  project: string,
  companyId: string,
  firestoreDocId: string,
  section: WorkInstructionSection
) => {
  if (!section.images?.length) {
    return;
  }

  // Filter out likely logo/header images
  // Heuristic: Images on page 1 with no caption are likely logos
  const filteredImages = section.images.filter((img) => {
    // Keep if has a meaningful caption
    if (img.caption && img.caption.length > 10) return true;

    // Filter out page 1 images without captions (likely logos)
    if (img.pageNumber === 1 && (!img.caption || img.caption.length < 10)) {
      console.log(`🚫 [uploadSectionImages] Filtering out likely logo/header image from page 1`);
      return false;
    }

    return true;
  });

  console.log(`📊 [uploadSectionImages] Image filtering:`, {
    original: section.images.length,
    filtered: filteredImages.length,
    removed: section.images.length - filteredImages.length
  });

  const uploadedImages: WorkInstructionSection['images'] = [];

  for (let index = 0; index < filteredImages.length; index += 1) {
    const image = filteredImages[index];
    if (!image) continue;

    const baseImage: any = { ...image };

    if (!image.data) {
      delete baseImage.data;
      delete baseImage.mimeType;
      uploadedImages.push(baseImage);
      continue;
    }

    const mimeType = image.mimeType || 'image/jpeg';
    const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/jp2' ? 'jp2' : 'jpg';

    // CSC-scoped storage path using Firestore document ID
    const storagePath = `companies/${companyId}/work-instructions/${firestoreDocId}/image-${index}.${extension}`;

    try {
      const buffer = Buffer.from(image.data, 'base64');
      const url = await uploadToFirebaseStorage(project, buffer, storagePath, mimeType);
      uploadedImages.push({
        caption: image.caption,
        pageNumber: image.pageNumber,
        url,
        storagePath
      });
    } catch (error) {
      console.error('Failed to upload section image', {
        project,
        companyId,
        firestoreDocId,
        index,
        error
      });

      delete baseImage.data;
      delete baseImage.mimeType;
      uploadedImages.push(baseImage);
    }
  }

  section.images = uploadedImages;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB
});

const router = Router();

router.post(
  '/work-instruction',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const project = (req.body.project || 'acs') as string;
      const siteId = req.body.siteId as string;
      const siteName = req.body.siteName as string;
      const groupId = req.body.groupId as string;
      const divisionId = req.body.divisionId as string;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'PDF file is required'
        });
      }

      if (!siteId) {
        return res.status(400).json({
          success: false,
          error: 'siteId is required'
        });
      }

      console.log('📋 [POST /work-instruction] Site details:', {
        siteId,
        siteName,
        groupId,
        divisionId
      });

      const documentExtraction: DocumentExtractionService = req.app.locals.documentExtraction;
      if (!documentExtraction) {
        throw new Error('Document extraction service not initialized');
      }

      const pdfBase64 = file.buffer.toString('base64');
      const sections: WorkInstructionSection[] = await documentExtraction.extractSections(pdfBase64);

      const timestamp = new Date().toISOString();
      const parentDocumentId = sections[0]?.documentMetadata.documentId || `doc-${Date.now()}`;
      const companyId = ACS_COMPANY_ID;

      // Use CSC path: companies/{companyId}/standard_cleaning_instructions
      const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

      const savedSections: WorkInstructionExtraction[] = [];

      for (const section of sections) {
        // Generate Firestore document ID FIRST (before image upload)
        const firestoreDocId = `${siteId}_${parentDocumentId}_${section.sectionId}_${Date.now()}`.replace(/[^a-zA-Z0-9_-]/g, '_');

        // Upload images using the pre-generated Firestore ID
        await uploadSectionImages(project, companyId, firestoreDocId, section);

        const sanitizedSection = sanitizeForFirestore(section) as WorkInstructionSection;
        const sanitizedSource = sanitizeForFirestore({
          name: file.originalname,
          size: file.size,
          contentType: file.mimetype
        });

        try {
          // Save to Firestore using the pre-generated ID
          const documentData: any = {
            companyId,
            siteId,
            project,  // Keep for backward compatibility
            parentDocumentId,
            section: sanitizedSection,
            createdAt: timestamp,
            updatedAt: timestamp,
            sourceFile: sanitizedSource
          };

          // Add optional site organization fields if they exist
          if (siteName) documentData.siteName = siteName;
          if (groupId) documentData.groupId = groupId;
          if (divisionId) documentData.divisionId = divisionId;

          const id = await saveToFirestore(project, collectionPath, documentData, firestoreDocId);

          savedSections.push({
            id,
            companyId,
            siteId,
            siteName,
            groupId,
            divisionId,
            project,
            parentDocumentId,
            section: sanitizedSection,
            createdAt: timestamp,
            updatedAt: timestamp,
            sourceFile: sanitizedSource
          });
        } catch (firestoreError) {
          console.error('Failed to persist section to Firestore:', firestoreError);
          savedSections.push({
            id: firestoreDocId,
            companyId,
            siteId,
            siteName,
            groupId,
            divisionId,
            project,
            parentDocumentId,
            section: sanitizedSection,
            createdAt: timestamp,
            updatedAt: timestamp,
            sourceFile: sanitizedSource
          });
        }
      }

      const payload: WorkInstructionImportResult = {
        sections: savedSections.map((record) => record.section)
      };

      res.json({
        success: true,
        data: {
          parentDocumentId,
          records: savedSections,
          summary: payload
        }
      });
    } catch (error: any) {
      console.error('Work instruction extraction failed:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Work instruction extraction failed'
      });
    }
  }
);

router.get(
  '/work-instruction/:project/:id',
  async (req: Request, res: Response) => {
    try {
      const { project, id } = req.params;
      const companyId = ACS_COMPANY_ID;
      const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

      const doc = await readFromFirestore(project, collectionPath, id);

      if (!doc) {
        return res.status(404).json({
          success: false,
          error: 'Work instruction not found'
        });
      }

      const payload: WorkInstructionExtraction = {
        id,
        companyId: doc.companyId,
        siteId: doc.siteId,
        siteName: doc.siteName,
        groupId: doc.groupId,
        divisionId: doc.divisionId,
        project,
        parentDocumentId: doc.parentDocumentId,
        section: doc.section,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        sourceFile: doc.sourceFile
      };

      res.json({
        success: true,
        data: payload
      });
    } catch (error: any) {
      console.error('Failed to fetch work instruction:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Failed to fetch work instruction'
      });
    }
  }
);

router.get(
  '/work-instruction/:project',
  async (req: Request, res: Response) => {
    try {
      const { project } = req.params;
      const limit = Number.parseInt(req.query.limit as string, 10) || 20;
      const companyId = ACS_COMPANY_ID;
      const collectionPath = getCSCCollectionPath(companyId, 'standard_cleaning_instructions');

      console.log('📖 [GET /work-instruction/:project] Request received:', {
        project,
        companyId,
        limit,
        collectionPath,
        fullPath: `companies/${companyId}/standard_cleaning_instructions`,
        query: req.query
      });

      console.log('🔍 [GET /work-instruction/:project] Querying Firestore:', {
        project,
        collection: collectionPath,
        filters: [],
        limit
      });

      const items = await queryFirestore(project, collectionPath, [], limit);

      console.log('📊 [GET /work-instruction/:project] Firestore query results:', {
        count: items.length,
        sampleIds: items.slice(0, 3).map((item: any) => item.id),
        sampleSites: items.slice(0, 3).map((item: any) => ({
          id: item.id,
          siteId: item.siteId,
          siteName: item.siteName,
          parentDocumentId: item.parentDocumentId
        })),
        allSites: [...new Set(items.map((item: any) => item.siteName))],
        siteDistribution: items.reduce((acc: any, item: any) => {
          const siteName = item.siteName || 'Unknown';
          acc[siteName] = (acc[siteName] || 0) + 1;
          return acc;
        }, {})
      });

      const results: WorkInstructionExtraction[] = items.map((item: any) => ({
        id: item.id,
        companyId: item.companyId,
        siteId: item.siteId,
        siteName: item.siteName,
        groupId: item.groupId,
        divisionId: item.divisionId,
        project,
        parentDocumentId: item.parentDocumentId,
        section: item.section,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        sourceFile: item.sourceFile
      }));

      console.log('✅ [GET /work-instruction/:project] Returning results:', {
        count: results.length,
        success: true
      });

      res.json({
        success: true,
        data: results
      });
    } catch (error: any) {
      console.error('❌ [GET /work-instruction/:project] Failed to list work instructions:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Failed to list work instructions'
      });
    }
  }
);

// ============================================================================
// CSC Site Routes
// ============================================================================

/**
 * GET /sites
 * Fetch iClean-enabled sites for ACS company
 */
router.get('/sites', async (req: Request, res: Response) => {
  try {
    const project = (req.query.project || 'acs') as string;
    const companyId = ACS_COMPANY_ID;
    const limit = Number.parseInt(req.query.limit as string, 10) || 1000;

    console.log('🏢 [GET /sites] Request received:', {
      project,
      companyId,
      limit,
      query: req.query
    });

    const sites = await getICleanSites(project, companyId, limit);

    console.log('🏢 [GET /sites] Sites fetched:', {
      count: sites.length,
      siteIds: sites.map(s => s.id),
      firstSite: sites[0] ? { id: sites[0].id, name: sites[0].name } : null
    });

    res.json({
      success: true,
      data: sites
    });
  } catch (error: any) {
    console.error('❌ [GET /sites] Failed to fetch iClean sites:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch sites'
    });
  }
});

/**
 * GET /sites/search
 * Type-ahead search for iClean sites
 */
router.get('/sites/search', async (req: Request, res: Response) => {
  try {
    const project = (req.query.project || 'acs') as string;
    const companyId = ACS_COMPANY_ID;
    const searchTerm = (req.query.q || '') as string;
    const limit = Number.parseInt(req.query.limit as string, 10) || 100;

    console.log('🔍 [GET /sites/search] Request received:', {
      project,
      companyId,
      searchTerm,
      limit
    });

    if (!searchTerm || searchTerm.length < 2) {
      console.log('🔍 [GET /sites/search] Search term too short, returning empty');
      return res.json({
        success: true,
        data: []
      });
    }

    const sites = await searchSitesByName(project, companyId, searchTerm, true, limit);

    console.log('🔍 [GET /sites/search] Search results:', {
      searchTerm,
      count: sites.length,
      siteNames: sites.map(s => s.name)
    });

    res.json({
      success: true,
      data: sites
    });
  } catch (error: any) {
    console.error('❌ [GET /sites/search] Failed to search sites:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to search sites'
    });
  }
});

export default router;
