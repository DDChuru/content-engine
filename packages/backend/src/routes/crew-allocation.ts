import { Router, Request, Response } from 'express';
import {
  getCSCCollectionPath,
  queryFirestore,
  readFromFirestore,
  saveToFirestore,
  deleteFromFirestore
} from '../services/firebase.js';
import type {
  CrewMemberModel,
  CrewAreaAllocation,
  CrewAllocationFilters,
  SiteAreaModel
} from 'shared/types';

// iClean Company ID
const ICLEAN_COMPANY_ID = 'iclean-company'; // TODO: Make this configurable

const router = Router();

// ============================================================================
// CREW MEMBERS
// ============================================================================

/**
 * GET /api/crew-allocation/members
 * List all crew members for a company
 */
router.get('/members', async (req: Request, res: Response) => {
  try {
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const siteId = req.query.siteId as string;

    const collectionPath = getCSCCollectionPath(companyId, 'crewMembers');
    let members = await queryFirestore<CrewMemberModel>('iclean', collectionPath);

    // Filter by siteId if provided
    if (siteId) {
      members = members.filter(m => m.siteIds?.includes(siteId));
    }

    // Filter active only by default
    const includeInactive = req.query.includeInactive === 'true';
    if (!includeInactive) {
      members = members.filter(m => m.isActive !== false);
    }

    res.json({
      success: true,
      data: members,
      metadata: { count: members.length, companyId }
    });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to fetch crew members:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch crew members'
    });
  }
});

/**
 * GET /api/crew-allocation/members/:id
 * Get a specific crew member
 */
router.get('/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'crewMembers')}/${id}`;
    const member = await readFromFirestore<CrewMemberModel>('iclean', docPath);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Crew member not found'
      });
    }

    res.json({ success: true, data: member });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to fetch crew member:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch crew member'
    });
  }
});

/**
 * POST /api/crew-allocation/members
 * Create a new crew member
 */
router.post('/members', async (req: Request, res: Response) => {
  try {
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const memberData: Partial<CrewMemberModel> = req.body;

    if (!memberData.fullName) {
      return res.status(400).json({
        success: false,
        error: 'Full name is required'
      });
    }

    const newMember: CrewMemberModel = {
      companyId,
      fullName: memberData.fullName,
      email: memberData.email,
      phone: memberData.phone,
      position: memberData.position || 'cleaner',
      photoUrl: memberData.photoUrl,
      siteIds: memberData.siteIds || [],
      isActive: true,
      hireDate: memberData.hireDate,
      notes: memberData.notes,
      createdAt: new Date().toISOString(),
      createdBy: memberData.createdBy
    };

    const collectionPath = getCSCCollectionPath(companyId, 'crewMembers');
    const docId = await saveToFirestore('iclean', collectionPath, newMember);

    res.status(201).json({
      success: true,
      data: { ...newMember, id: docId }
    });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to create crew member:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create crew member'
    });
  }
});

/**
 * PUT /api/crew-allocation/members/:id
 * Update a crew member
 */
router.put('/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const updates: Partial<CrewMemberModel> = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'crewMembers')}/${id}`;

    // Add updated timestamp
    updates.updatedAt = new Date().toISOString();

    await saveToFirestore('iclean', docPath, updates, true);

    res.json({
      success: true,
      data: { id, ...updates }
    });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to update crew member:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update crew member'
    });
  }
});

/**
 * DELETE /api/crew-allocation/members/:id
 * Soft delete a crew member (set isActive to false)
 */
router.delete('/members/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const hardDelete = req.query.hard === 'true';

    const docPath = `${getCSCCollectionPath(companyId, 'crewMembers')}/${id}`;

    if (hardDelete) {
      await deleteFromFirestore('iclean', docPath);
    } else {
      await saveToFirestore('iclean', docPath, {
        isActive: false,
        updatedAt: new Date().toISOString()
      }, true);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to delete crew member:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete crew member'
    });
  }
});

// ============================================================================
// CREW ALLOCATIONS
// ============================================================================

/**
 * GET /api/crew-allocation/allocations
 * List allocations with optional filters
 */
router.get('/allocations', async (req: Request, res: Response) => {
  try {
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const filters: CrewAllocationFilters = {
      siteId: req.query.siteId as string,
      areaId: req.query.areaId as string,
      crewMemberId: req.query.crewMemberId as string,
      status: req.query.status as any,
      assignmentType: req.query.assignmentType as any,
      isTrainedForArea: req.query.isTrainedForArea === 'true' ? true :
                        req.query.isTrainedForArea === 'false' ? false : undefined
    };

    const collectionPath = getCSCCollectionPath(companyId, 'crewAllocations');
    let allocations = await queryFirestore<CrewAreaAllocation>('iclean', collectionPath);

    // Apply filters
    if (filters.siteId) {
      allocations = allocations.filter(a => a.siteId === filters.siteId);
    }
    if (filters.areaId) {
      allocations = allocations.filter(a => a.areaId === filters.areaId);
    }
    if (filters.crewMemberId) {
      allocations = allocations.filter(a => a.crewMemberId === filters.crewMemberId);
    }
    if (filters.status) {
      allocations = allocations.filter(a => a.status === filters.status);
    }
    if (filters.assignmentType) {
      allocations = allocations.filter(a => a.assignmentType === filters.assignmentType);
    }
    if (filters.isTrainedForArea !== undefined) {
      allocations = allocations.filter(a => a.isTrainedForArea === filters.isTrainedForArea);
    }

    res.json({
      success: true,
      data: allocations,
      metadata: { count: allocations.length, companyId, filters }
    });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to fetch allocations:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch allocations'
    });
  }
});

/**
 * POST /api/crew-allocation/allocations
 * Create a new allocation
 */
router.post('/allocations', async (req: Request, res: Response) => {
  try {
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const allocationData: Partial<CrewAreaAllocation> = req.body;

    if (!allocationData.crewMemberId || !allocationData.areaId || !allocationData.siteId) {
      return res.status(400).json({
        success: false,
        error: 'crewMemberId, areaId, and siteId are required'
      });
    }

    const newAllocation: CrewAreaAllocation = {
      companyId,
      crewMemberId: allocationData.crewMemberId,
      crewMemberName: allocationData.crewMemberName,
      areaId: allocationData.areaId,
      areaName: allocationData.areaName,
      siteId: allocationData.siteId,
      siteName: allocationData.siteName,
      assignmentType: allocationData.assignmentType || 'primary',
      shift: allocationData.shift,
      workDays: allocationData.workDays,
      isTrainedForArea: allocationData.isTrainedForArea || false,
      trainedAreaItems: allocationData.trainedAreaItems || [],
      pendingTrainingItems: allocationData.pendingTrainingItems || [],
      competencyScore: allocationData.competencyScore,
      status: allocationData.status || 'active',
      effectiveFrom: allocationData.effectiveFrom || new Date().toISOString(),
      effectiveTo: allocationData.effectiveTo,
      createdAt: new Date().toISOString(),
      createdBy: allocationData.createdBy
    };

    const collectionPath = getCSCCollectionPath(companyId, 'crewAllocations');
    const docId = await saveToFirestore('iclean', collectionPath, newAllocation);

    res.status(201).json({
      success: true,
      data: { ...newAllocation, id: docId }
    });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to create allocation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create allocation'
    });
  }
});

/**
 * PUT /api/crew-allocation/allocations/:id
 * Update an allocation
 */
router.put('/allocations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.body.companyId as string) || ICLEAN_COMPANY_ID;
    const updates: Partial<CrewAreaAllocation> = req.body;

    const docPath = `${getCSCCollectionPath(companyId, 'crewAllocations')}/${id}`;
    updates.updatedAt = new Date().toISOString();

    await saveToFirestore('iclean', docPath, updates, true);

    res.json({
      success: true,
      data: { id, ...updates }
    });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to update allocation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update allocation'
    });
  }
});

/**
 * DELETE /api/crew-allocation/allocations/:id
 * Delete an allocation
 */
router.delete('/allocations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;

    const docPath = `${getCSCCollectionPath(companyId, 'crewAllocations')}/${id}`;
    await deleteFromFirestore('iclean', docPath);

    res.json({ success: true });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to delete allocation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete allocation'
    });
  }
});

// ============================================================================
// SITE AREAS (for allocation UI)
// ============================================================================

/**
 * GET /api/crew-allocation/areas
 * Get site areas for a site
 */
router.get('/areas', async (req: Request, res: Response) => {
  try {
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const siteId = req.query.siteId as string;

    if (!siteId) {
      return res.status(400).json({
        success: false,
        error: 'siteId is required'
      });
    }

    const collectionPath = getCSCCollectionPath(companyId, 'siteAreas');
    let areas = await queryFirestore<SiteAreaModel>('iclean', collectionPath);

    // Filter by siteId
    areas = areas.filter(a => a.siteId === siteId);

    res.json({
      success: true,
      data: areas,
      metadata: { count: areas.length, siteId }
    });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to fetch areas:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch areas'
    });
  }
});

/**
 * GET /api/crew-allocation/summary
 * Get allocation summary for a site
 */
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const companyId = (req.query.companyId as string) || ICLEAN_COMPANY_ID;
    const siteId = req.query.siteId as string;

    if (!siteId) {
      return res.status(400).json({
        success: false,
        error: 'siteId is required'
      });
    }

    // Get all allocations for the site
    const allocationsPath = getCSCCollectionPath(companyId, 'crewAllocations');
    let allocations = await queryFirestore<CrewAreaAllocation>('iclean', allocationsPath);
    allocations = allocations.filter(a => a.siteId === siteId && a.status === 'active');

    // Get all areas for the site
    const areasPath = getCSCCollectionPath(companyId, 'siteAreas');
    let areas = await queryFirestore<SiteAreaModel>('iclean', areasPath);
    areas = areas.filter(a => a.siteId === siteId);

    // Get unique crew members
    const crewMemberIds = [...new Set(allocations.map(a => a.crewMemberId))];

    // Calculate summary
    const summary = {
      totalAreas: areas.length,
      allocatedAreas: new Set(allocations.map(a => a.areaId)).size,
      unallocatedAreas: areas.length - new Set(allocations.map(a => a.areaId)).size,
      totalCrewAssigned: crewMemberIds.length,
      totalAllocations: allocations.length,
      trainedAllocations: allocations.filter(a => a.isTrainedForArea).length,
      pendingTraining: allocations.filter(a => !a.isTrainedForArea).length,
      byAssignmentType: {
        primary: allocations.filter(a => a.assignmentType === 'primary').length,
        secondary: allocations.filter(a => a.assignmentType === 'secondary').length,
        backup: allocations.filter(a => a.assignmentType === 'backup').length,
        temporary: allocations.filter(a => a.assignmentType === 'temporary').length
      }
    };

    res.json({
      success: true,
      data: summary,
      metadata: { siteId, companyId }
    });
  } catch (error: any) {
    console.error('[crew-allocation] Failed to get summary:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get summary'
    });
  }
});

export default router;
