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
  SelfInspectionModel,
  InspectionIssue,
  SelfInspectionFilters
} from 'shared/types';

// iClean Company ID
const ICLEAN_COMPANY_ID = 'iclean-company'; // TODO: Make this configurable

const router = Router();

// ============================================================================
// SELF INSPECTIONS
// ============================================================================

/**
 * GET /api/self-inspection/list
 * List all inspections with optional filters
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const filters: SelfInspectionFilters = {
      siteId: req.query.siteId as string,
      status: req.query.status as any,
      assignedTo: req.query.assignedTo as string,
      createdBy: req.query.createdBy as string,
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string
    };

    const collectionPath = getCSCCollectionPath(companyId, 'selfInspections');
    let inspections = await queryFirestore<SelfInspectionModel>('iclean', collectionPath);

    // Apply filters
    if (filters.siteId) {
      inspections = inspections.filter(i => i.siteId === filters.siteId);
    }
    if (filters.status) {
      inspections = inspections.filter(i => i.status === filters.status);
    }
    if (filters.assignedTo) {
      inspections = inspections.filter(i => i.assignedTo === filters.assignedTo);
    }
    if (filters.createdBy) {
      inspections = inspections.filter(i => i.createdBy === filters.createdBy);
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      inspections = inspections.filter(i => new Date(i.createdAt) >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      inspections = inspections.filter(i => new Date(i.createdAt) <= to);
    }

    // Sort by creation date descending
    inspections.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({
      success: true,
      data: inspections,
      metadata: { count: inspections.length, companyId, filters }
    });
  } catch (error: any) {
    console.error('[self-inspection] Failed to list inspections:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list inspections'
    });
  }
});

/**
 * GET /api/self-inspection/:id
 * Get a specific inspection
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;
    const inspection = await readFromFirestore<SelfInspectionModel>('iclean', docPath);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        error: 'Inspection not found'
      });
    }

    res.json({ success: true, data: inspection });
  } catch (error: any) {
    console.error('[self-inspection] Failed to fetch inspection:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch inspection'
    });
  }
});

/**
 * POST /api/self-inspection
 * Create a new inspection
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const data: Partial<SelfInspectionModel> = req.body;

    if (!data.siteId || !data.name) {
      return res.status(400).json({
        success: false,
        error: 'siteId and name are required'
      });
    }

    const newInspection: SelfInspectionModel = {
      companyId,
      siteId: data.siteId,
      siteName: data.siteName,
      name: data.name,
      checklist: data.checklist,
      checklistId: data.checklistId,
      status: data.status || 'draft',
      totalItems: data.totalItems || 0,
      completedItems: 0,
      issues: [],
      issueCount: 0,
      createdAt: new Date().toISOString(),
      scheduledDate: data.scheduledDate,
      createdBy: data.createdBy || 'system',
      createdByName: data.createdByName,
      assignedTo: data.assignedTo,
      assignedToName: data.assignedToName
    };

    const collectionPath = getCSCCollectionPath(companyId, 'selfInspections');
    const docId = await saveToFirestore('iclean', collectionPath, newInspection);

    res.status(201).json({
      success: true,
      data: { ...newInspection, id: docId }
    });
  } catch (error: any) {
    console.error('[self-inspection] Failed to create inspection:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create inspection'
    });
  }
});

/**
 * PUT /api/self-inspection/:id
 * Update an inspection
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const updates: Partial<SelfInspectionModel> = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;
    updates.updatedAt = new Date().toISOString();

    await saveToFirestore('iclean', docPath, updates, true);

    res.json({
      success: true,
      data: { id, ...updates }
    });
  } catch (error: any) {
    console.error('[self-inspection] Failed to update inspection:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update inspection'
    });
  }
});

/**
 * PUT /api/self-inspection/:id/start
 * Start an inspection
 */
router.put('/:id/start', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;

    await saveToFirestore('iclean', docPath, {
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, true);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[self-inspection] Failed to start inspection:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start inspection'
    });
  }
});

/**
 * PUT /api/self-inspection/:id/complete
 * Complete an inspection
 */
router.put('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const { completedBy, completedByName, inspectorSignature } = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;

    await saveToFirestore('iclean', docPath, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      completedBy,
      completedByName,
      inspectorSignature,
      signedAt: inspectorSignature ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    }, true);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[self-inspection] Failed to complete inspection:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete inspection'
    });
  }
});

/**
 * DELETE /api/self-inspection/:id
 * Delete an inspection
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;
    await deleteFromFirestore('iclean', docPath);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[self-inspection] Failed to delete inspection:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete inspection'
    });
  }
});

// ============================================================================
// ISSUES
// ============================================================================

/**
 * POST /api/self-inspection/:id/issues
 * Add an issue to an inspection
 */
router.post('/:id/issues', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const issueData: Partial<InspectionIssue> = req.body;

    if (!issueData.areaId || !issueData.description || !issueData.severity) {
      return res.status(400).json({
        success: false,
        error: 'areaId, description, and severity are required'
      });
    }

    // Get current inspection
    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;
    const inspection = await readFromFirestore<SelfInspectionModel>('iclean', docPath);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        error: 'Inspection not found'
      });
    }

    const newIssue: InspectionIssue = {
      id: uuidv4(),
      areaId: issueData.areaId,
      areaName: issueData.areaName || '',
      category: issueData.category || 'General',
      categoryId: issueData.categoryId,
      severity: issueData.severity,
      severityLevel: issueData.severityLevel ||
        (issueData.severity === 'critical' ? 5 :
         issueData.severity === 'high' ? 4 :
         issueData.severity === 'medium' ? 3 : 2),
      description: issueData.description,
      images: issueData.images || [],
      proposedActionDate: issueData.proposedActionDate,
      responsibleUserId: issueData.responsibleUserId,
      responsibleUserName: issueData.responsibleUserName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: issueData.createdBy || 'system',
      createdByName: issueData.createdByName,
      acknowledged: false
    };

    // Add issue to inspection
    const issues = [...(inspection.issues || []), newIssue];

    await saveToFirestore('iclean', docPath, {
      issues,
      issueCount: issues.length,
      updatedAt: new Date().toISOString()
    }, true);

    res.status(201).json({
      success: true,
      data: newIssue
    });
  } catch (error: any) {
    console.error('[self-inspection] Failed to add issue:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add issue'
    });
  }
});

/**
 * PUT /api/self-inspection/:id/issues/:issueId
 * Update an issue
 */
router.put('/:id/issues/:issueId', async (req: Request, res: Response) => {
  try {
    const { id, issueId } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const updates: Partial<InspectionIssue> = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;
    const inspection = await readFromFirestore<SelfInspectionModel>('iclean', docPath);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        error: 'Inspection not found'
      });
    }

    const issueIndex = inspection.issues?.findIndex(i => i.id === issueId);
    if (issueIndex === undefined || issueIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    // Update issue
    const updatedIssue = {
      ...inspection.issues[issueIndex],
      ...updates
    };
    inspection.issues[issueIndex] = updatedIssue;

    await saveToFirestore('iclean', docPath, {
      issues: inspection.issues,
      updatedAt: new Date().toISOString()
    }, true);

    res.json({
      success: true,
      data: updatedIssue
    });
  } catch (error: any) {
    console.error('[self-inspection] Failed to update issue:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update issue'
    });
  }
});

/**
 * PUT /api/self-inspection/:id/issues/:issueId/acknowledge
 * Acknowledge an issue
 */
router.put('/:id/issues/:issueId/acknowledge', async (req: Request, res: Response) => {
  try {
    const { id, issueId } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const { acknowledgedBy } = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;
    const inspection = await readFromFirestore<SelfInspectionModel>('iclean', docPath);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        error: 'Inspection not found'
      });
    }

    const issueIndex = inspection.issues?.findIndex(i => i.id === issueId);
    if (issueIndex === undefined || issueIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    inspection.issues[issueIndex] = {
      ...inspection.issues[issueIndex],
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy,
      status: 'acknowledged'
    };

    await saveToFirestore('iclean', docPath, {
      issues: inspection.issues,
      updatedAt: new Date().toISOString()
    }, true);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[self-inspection] Failed to acknowledge issue:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to acknowledge issue'
    });
  }
});

/**
 * PUT /api/self-inspection/:id/issues/:issueId/resolve
 * Resolve an issue
 */
router.put('/:id/issues/:issueId/resolve', async (req: Request, res: Response) => {
  try {
    const { id, issueId } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const { resolvedBy, resolutionNotes } = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;
    const inspection = await readFromFirestore<SelfInspectionModel>('iclean', docPath);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        error: 'Inspection not found'
      });
    }

    const issueIndex = inspection.issues?.findIndex(i => i.id === issueId);
    if (issueIndex === undefined || issueIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    inspection.issues[issueIndex] = {
      ...inspection.issues[issueIndex],
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      resolvedBy,
      resolutionNotes
    };

    await saveToFirestore('iclean', docPath, {
      issues: inspection.issues,
      updatedAt: new Date().toISOString()
    }, true);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[self-inspection] Failed to resolve issue:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to resolve issue'
    });
  }
});

/**
 * DELETE /api/self-inspection/:id/issues/:issueId
 * Delete an issue from an inspection
 */
router.delete('/:id/issues/:issueId', async (req: Request, res: Response) => {
  try {
    const { id, issueId } = req.params;
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'selfInspections')}/${id}`;
    const inspection = await readFromFirestore<SelfInspectionModel>('iclean', docPath);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        error: 'Inspection not found'
      });
    }

    const issues = inspection.issues?.filter(i => i.id !== issueId) || [];

    await saveToFirestore('iclean', docPath, {
      issues,
      issueCount: issues.length,
      updatedAt: new Date().toISOString()
    }, true);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[self-inspection] Failed to delete issue:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete issue'
    });
  }
});

// ============================================================================
// DASHBOARD / SUMMARY
// ============================================================================

/**
 * GET /api/self-inspection/dashboard/summary
 * Get inspection summary statistics
 */
router.get('/dashboard/summary', async (req: Request, res: Response) => {
  try {
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const siteId = req.query.siteId as string;

    const collectionPath = getCSCCollectionPath(companyId, 'selfInspections');
    let inspections = await queryFirestore<SelfInspectionModel>('iclean', collectionPath);

    if (siteId) {
      inspections = inspections.filter(i => i.siteId === siteId);
    }

    // Calculate summary
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentInspections = inspections.filter(i =>
      new Date(i.createdAt) >= thirtyDaysAgo
    );

    const allIssues = inspections.flatMap(i => i.issues || []);
    const pendingIssues = allIssues.filter(issue =>
      issue.status === 'pending' || issue.status === 'acknowledged'
    );
    const overdueIssues = pendingIssues.filter(issue =>
      issue.proposedActionDate && new Date(issue.proposedActionDate) < now
    );

    const summary = {
      total: inspections.length,
      byStatus: {
        draft: inspections.filter(i => i.status === 'draft').length,
        pending: inspections.filter(i => i.status === 'pending').length,
        in_progress: inspections.filter(i => i.status === 'in_progress').length,
        completed: inspections.filter(i => i.status === 'completed').length,
        cancelled: inspections.filter(i => i.status === 'cancelled').length
      },
      last30Days: recentInspections.length,
      issues: {
        total: allIssues.length,
        pending: pendingIssues.length,
        resolved: allIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
        overdue: overdueIssues.length
      }
    };

    res.json({
      success: true,
      data: summary,
      metadata: { companyId, siteId }
    });
  } catch (error: any) {
    console.error('[self-inspection] Failed to get summary:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get summary'
    });
  }
});

export default router;
