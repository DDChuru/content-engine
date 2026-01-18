import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getCSCCollectionPath,
  queryFirestore,
  readFromFirestore,
  saveToFirestore,
  deleteFromFirestore
} from '../services/firebase.js';
import type {
  PictorialAuditModel,
  AuditAreaResult,
  AuditPhoto,
  SiteAreaModel
} from 'shared/types';

// iClean Company ID
const ICLEAN_COMPANY_ID = 'iclean-company'; // TODO: Make this configurable

const router = Router();

// ============================================================================
// PICTORIAL AUDITS
// ============================================================================

/**
 * GET /api/pictorial-audit/list
 * List all audits with optional filters
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const siteId = req.query.siteId as string;
    const status = req.query.status as string;
    const auditorId = req.query.auditorId as string;

    const collectionPath = getCSCCollectionPath(companyId, 'pictorialAudits');
    let audits = await queryFirestore<PictorialAuditModel>('iclean', collectionPath);

    // Apply filters
    if (siteId) {
      audits = audits.filter(a => a.siteId === siteId);
    }
    if (status) {
      audits = audits.filter(a => a.status === status);
    }
    if (auditorId) {
      audits = audits.filter(a => a.auditorId === auditorId);
    }

    // Sort by creation date descending
    audits.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({
      success: true,
      data: audits,
      metadata: { count: audits.length, companyId }
    });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to list audits:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list audits'
    });
  }
});

/**
 * GET /api/pictorial-audit/:id
 * Get a specific audit
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'pictorialAudits')}/${id}`;
    const audit = await readFromFirestore<PictorialAuditModel>('iclean', docPath);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    res.json({ success: true, data: audit });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to fetch audit:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch audit'
    });
  }
});

/**
 * POST /api/pictorial-audit
 * Create a new audit
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const data: Partial<PictorialAuditModel> = req.body;

    if (!data.siteId || !data.name) {
      return res.status(400).json({
        success: false,
        error: 'siteId and name are required'
      });
    }

    // Get areas for the site to initialize audit
    const areasPath = getCSCCollectionPath(companyId, 'siteAreas');
    let areas = await queryFirestore<SiteAreaModel>('iclean', areasPath);
    areas = areas.filter(a => a.siteId === data.siteId);

    const newAudit: PictorialAuditModel = {
      companyId,
      siteId: data.siteId,
      siteName: data.siteName,
      name: data.name,
      auditType: data.auditType || 'routine',
      status: 'scheduled',
      totalAreas: areas.length,
      completedAreas: 0,
      areaResults: [],
      createdAt: new Date().toISOString(),
      scheduledDate: data.scheduledDate,
      createdBy: data.createdBy || 'system',
      createdByName: data.createdByName,
      auditorId: data.auditorId,
      auditorName: data.auditorName
    };

    const collectionPath = getCSCCollectionPath(companyId, 'pictorialAudits');
    const docId = await saveToFirestore('iclean', collectionPath, newAudit);

    res.status(201).json({
      success: true,
      data: { ...newAudit, id: docId }
    });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to create audit:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create audit'
    });
  }
});

/**
 * PUT /api/pictorial-audit/:id
 * Update an audit
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const updates: Partial<PictorialAuditModel> = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'pictorialAudits')}/${id}`;
    updates.updatedAt = new Date().toISOString();

    await saveToFirestore('iclean', docPath, updates, true);

    res.json({
      success: true,
      data: { id, ...updates }
    });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to update audit:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update audit'
    });
  }
});

/**
 * PUT /api/pictorial-audit/:id/start
 * Start an audit
 */
router.put('/:id/start', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'pictorialAudits')}/${id}`;

    await saveToFirestore('iclean', docPath, {
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, true);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to start audit:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start audit'
    });
  }
});

/**
 * PUT /api/pictorial-audit/:id/complete
 * Complete an audit
 */
router.put('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const { auditorSignature } = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'pictorialAudits')}/${id}`;

    // Get current audit to calculate overall score
    const audit = await readFromFirestore<PictorialAuditModel>('iclean', docPath);
    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    // Calculate overall score
    const scores = audit.areaResults
      .filter(r => r.score !== undefined)
      .map(r => r.score!);
    const overallScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : undefined;

    // Determine overall rating
    let overallRating: 'pass' | 'fail' | 'needs_improvement' = 'pass';
    if (overallScore !== undefined) {
      if (overallScore < 50) overallRating = 'fail';
      else if (overallScore < 75) overallRating = 'needs_improvement';
    }

    await saveToFirestore('iclean', docPath, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      overallScore,
      overallRating,
      auditorSignature,
      updatedAt: new Date().toISOString()
    }, true);

    res.json({ success: true, data: { overallScore, overallRating } });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to complete audit:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete audit'
    });
  }
});

/**
 * DELETE /api/pictorial-audit/:id
 * Delete an audit
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'pictorialAudits')}/${id}`;
    await deleteFromFirestore('iclean', docPath);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to delete audit:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete audit'
    });
  }
});

// ============================================================================
// AREA RESULTS
// ============================================================================

/**
 * POST /api/pictorial-audit/:id/areas/:areaId
 * Add or update area result with photos
 */
router.post('/:id/areas/:areaId', async (req: Request, res: Response) => {
  try {
    const { id, areaId } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const data: Partial<AuditAreaResult> = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'pictorialAudits')}/${id}`;
    const audit = await readFromFirestore<PictorialAuditModel>('iclean', docPath);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    const existingIndex = audit.areaResults?.findIndex(r => r.areaId === areaId);
    const areaResult: AuditAreaResult = {
      areaId,
      areaName: data.areaName || '',
      photos: data.photos || [],
      overallRating: data.overallRating || 'not_applicable',
      score: data.score,
      notes: data.notes,
      completedAt: new Date().toISOString()
    };

    let areaResults = [...(audit.areaResults || [])];
    if (existingIndex !== undefined && existingIndex >= 0) {
      areaResults[existingIndex] = areaResult;
    } else {
      areaResults.push(areaResult);
    }

    await saveToFirestore('iclean', docPath, {
      areaResults,
      completedAreas: areaResults.length,
      updatedAt: new Date().toISOString()
    }, true);

    res.json({
      success: true,
      data: areaResult
    });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to add area result:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add area result'
    });
  }
});

/**
 * POST /api/pictorial-audit/:id/areas/:areaId/photos
 * Add a photo to an area result
 */
router.post('/:id/areas/:areaId/photos', async (req: Request, res: Response) => {
  try {
    const { id, areaId } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const photoData: Partial<AuditPhoto> = req.body;

    if (!photoData.uri) {
      return res.status(400).json({
        success: false,
        error: 'Photo URI is required'
      });
    }

    const docPath = `${getCSCCollectionPath(companyId, 'pictorialAudits')}/${id}`;
    const audit = await readFromFirestore<PictorialAuditModel>('iclean', docPath);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }

    const areaIndex = audit.areaResults?.findIndex(r => r.areaId === areaId);
    if (areaIndex === undefined || areaIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Area result not found. Create area result first.'
      });
    }

    const newPhoto: AuditPhoto = {
      id: uuidv4(),
      uri: photoData.uri,
      caption: photoData.caption,
      rating: photoData.rating,
      annotations: photoData.annotations,
      takenAt: new Date().toISOString(),
      takenBy: photoData.takenBy || 'system'
    };

    audit.areaResults[areaIndex].photos.push(newPhoto);

    await saveToFirestore('iclean', docPath, {
      areaResults: audit.areaResults,
      updatedAt: new Date().toISOString()
    }, true);

    res.status(201).json({
      success: true,
      data: newPhoto
    });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to add photo:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add photo'
    });
  }
});

// ============================================================================
// DASHBOARD / SUMMARY
// ============================================================================

/**
 * GET /api/pictorial-audit/dashboard/summary
 * Get audit summary statistics
 */
router.get('/dashboard/summary', async (req: Request, res: Response) => {
  try {
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const siteId = req.query.siteId as string;

    const collectionPath = getCSCCollectionPath(companyId, 'pictorialAudits');
    let audits = await queryFirestore<PictorialAuditModel>('iclean', collectionPath);

    if (siteId) {
      audits = audits.filter(a => a.siteId === siteId);
    }

    // Calculate summary
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentAudits = audits.filter(a =>
      new Date(a.createdAt) >= thirtyDaysAgo
    );

    const completedAudits = audits.filter(a => a.status === 'completed');
    const averageScore = completedAudits.length > 0
      ? Math.round(
          completedAudits
            .filter(a => a.overallScore !== undefined)
            .reduce((sum, a) => sum + (a.overallScore || 0), 0) /
          completedAudits.filter(a => a.overallScore !== undefined).length
        )
      : null;

    const summary = {
      total: audits.length,
      byStatus: {
        scheduled: audits.filter(a => a.status === 'scheduled').length,
        in_progress: audits.filter(a => a.status === 'in_progress').length,
        completed: audits.filter(a => a.status === 'completed').length,
        reviewed: audits.filter(a => a.status === 'reviewed').length
      },
      last30Days: recentAudits.length,
      averageScore,
      byRating: {
        pass: completedAudits.filter(a => a.overallRating === 'pass').length,
        needs_improvement: completedAudits.filter(a => a.overallRating === 'needs_improvement').length,
        fail: completedAudits.filter(a => a.overallRating === 'fail').length
      }
    };

    res.json({
      success: true,
      data: summary,
      metadata: { companyId, siteId }
    });
  } catch (error: any) {
    console.error('[pictorial-audit] Failed to get summary:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get summary'
    });
  }
});

export default router;
