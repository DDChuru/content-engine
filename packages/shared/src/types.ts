// Shared type definitions

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export interface WorkInstructionApproval {
  role: string;
  name: string;
  date: string;
}

export interface WorkInstructionDocumentMetadata {
  title: string;
  documentId: string;
  department: string;
  author: string;
  revision: string;
  effectiveDate: string;
  reviewDate: string;
  approvals: WorkInstructionApproval[];
}

export interface WorkInstructionChemical {
  name: string;
  useRatio: string;
}

export interface WorkInstructionColourCode {
  colour: string;
  meaning: string;
}

export interface WorkInstructionImage {
  caption: string;
  pageNumber: number;
  url?: string;
  storagePath?: string;
  data?: string;
  mimeType?: string;
}

export interface WorkInstructionStepDetail {
  order: number;
  label: string;
  action: string;
  notes: string[];
}

export interface WorkInstructionStepGroup {
  title: string;
  description: string;
  frequency?: string;
  steps: WorkInstructionStepDetail[];
}

export interface WorkInstructionSection {
  sectionId: string;
  documentMetadata: WorkInstructionDocumentMetadata;
  title: string;
  pageRange: string;
  area: string[];
  chemicals: WorkInstructionChemical[];
  cleaningRecord: string;
  maintenanceAssistance: string;
  frequency: string;
  responsibility: string;
  inspectedBy: string;
  keyInspectionPoints: string[];
  safetyNotes: string[];
  ppeRequired: string[];
  colourCodes: WorkInstructionColourCode[];
  applicationEquipment: string[];
  additionalNotes: string[];
  images: WorkInstructionImage[];
  stepGroups: WorkInstructionStepGroup[];
}

export interface WorkInstructionExtraction {
  id: string;
  project: string;  // Deprecated - use companyId instead
  companyId?: string;  // CSC: Company ID
  siteId?: string;     // CSC: Site ID where instruction applies
  siteName?: string;   // Site name for display
  groupId?: string;    // Site group ID (organizational grouping)
  divisionId?: string; // Site division ID (organizational division)
  parentDocumentId: string;
  sourceFile: {
    name: string;
    size: number;
    contentType: string;
    storagePath?: string;
    downloadUrl?: string;
  };
  section: WorkInstructionSection;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkInstructionImportResult {
  sections: WorkInstructionSection[];
}

// ============================================================================
// CSC (Company-Site-Collection) Architecture Types
// ============================================================================

export interface SiteModel {
  id: string;
  companyId: string;
  name: string;
  location?: string;
  fullAddress?: string;
  category?: string;
  divisionId?: string;
  groupId?: string;
  isActive?: boolean;
  regionId?: string;
  weekends?: boolean;

  settings?: {
    iClean?: boolean;  // Enable cleaning module functionality
    standard?: number;  // Default cleaning standard score
    enableFacialRecognition?: boolean;
    taskView?: boolean;
  };

  scheduling?: {
    automateReport?: boolean;
    reportHour?: number;
    visitScheduleId?: string;
    weekends?: boolean;
    deepCleanDay?: string;
    deepCleanWeek?: string;
  };

  coordinates?: {
    lat?: number;
    lon?: number;
    geoCoordinates?: number[];
  };

  metadata?: {
    businessType?: string;
    operationalContext?: string;
    serviceCategories?: string[];
    statusReason?: string;
    lastStatusUpdate?: string;
  };

  // Alternative location for iClean flag (deprecated, use settings.iClean)
  iClean?: boolean;

  // Legacy fields
  legacy?: {
    legacyCompanyId?: number;
    legacySiteId?: number;
    wwDivisionId?: string;
  };
}

export interface SiteAreaModel {
  id?: string;
  siteId: string;
  barcode: string;
  name: string;
  dateCreated: Date | string;
  updatedBy?: {
    uid: string;
    displayName?: string;
    email?: string;
  };
  mainAreaId?: string;
  cleaningSchedules?: CleaningSchedule[];

  // Legacy fields
  legacyAreaId?: number;
  legacySiteId?: number;
}

export interface CleaningSchedule {
  scheduleId: string;
  frequency: string;
  cycleId: number;
  weekdays?: boolean;
  dayOfWeek?: number;
  weekOfMonth?: number;
  months?: number[];
}

export interface ScheduleModel {
  id: string;
  cycleId: number;
  name: string;
  days: number;
  hours: number;
}

export interface AreaItemModel {
  id?: string;
  cycleId: number;
  schedule: ScheduleModel;
  areaId: string;
  area?: SiteAreaModel;
  siteId: string;
  itemDescription: string;
  yCode?: string;  // Pass code
  nCode?: string;  // Fail code
  inspectionCategoryId?: number;
  dateCreated: Date | string;
  createdBy?: {
    uid: string;
    displayName?: string;
    email?: string;
  };
  scoreWeight: number;
  documentId?: string;

  // MCS/SCI Integration fields
  mcsDocumentId?: string;    // Master Cleaning Schedule document reference
  mcsItemIndex?: number;     // Index in MCS array
  sciDocumentId?: string;    // Standard Cleaning Instruction document reference
  frequency?: string;        // Original frequency text
  method?: string;          // SCI reference/cleaning method

  // Legacy fields
  legacyId?: number;
  legacySiteId?: number;
  legacyAreaId?: number;
}

// ============================================================================
// Crew Member & Allocation Types
// ============================================================================

export type CrewPosition = 'supervisor' | 'site_manager' | 'quality_controller' | 'cleaner' | 'technician';
export type AssignmentType = 'primary' | 'secondary' | 'backup' | 'temporary';
export type ShiftType = 'morning' | 'afternoon' | 'night' | 'rotating';
export type AllocationStatus = 'active' | 'inactive' | 'pending' | 'expired';

export interface CrewMemberModel {
  id?: string;
  companyId: string;
  fullName: string;
  email?: string;
  phone?: string;
  position: CrewPosition;
  photoUrl?: string;
  siteIds: string[];  // Sites this crew member is assigned to
  isActive: boolean;
  hireDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    uid: string;
    displayName?: string;
    email?: string;
  };
}

export interface CrewAreaAllocation {
  id?: string;
  crewMemberId: string;
  crewMemberName?: string;  // Denormalized for display
  areaId: string;
  areaName?: string;        // Denormalized for display
  siteId: string;
  siteName?: string;        // Denormalized for display
  companyId: string;

  // Assignment details
  assignmentType: AssignmentType;
  shift?: ShiftType;
  workDays?: string[];  // ['monday', 'tuesday', ...]

  // Training & Competency
  isTrainedForArea: boolean;
  trainedAreaItems?: string[];     // Array of trained area item IDs
  pendingTrainingItems?: string[]; // Items needing training
  competencyScore?: number;        // 0-100

  // Performance Metrics
  completedVerificationsCount?: number;
  failedVerificationsCount?: number;
  averageCompletionTime?: number;  // In minutes

  // Status
  status: AllocationStatus;
  effectiveFrom?: string;
  effectiveTo?: string;

  // Timestamps
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    uid: string;
    displayName?: string;
    email?: string;
  };
}

export interface CrewAllocationFilters {
  siteId?: string;
  areaId?: string;
  crewMemberId?: string;
  status?: AllocationStatus;
  assignmentType?: AssignmentType;
  isTrainedForArea?: boolean;
}

// ============================================================================
// Self Inspection Types
// ============================================================================

export type InspectionStatus = 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'pending' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';

export interface InspectionIssue {
  id: string;
  areaId: string;
  areaName: string;
  category: string;
  categoryId?: string;
  severity: IssueSeverity;
  severityLevel: number;  // 1-5
  description: string;

  images: Array<{
    uri: string;
    annotations?: any[];
    type?: string;
    uploadedAt?: string;
  }>;

  proposedActionDate?: string;
  responsibleUserId?: string;
  responsibleUserName?: string;

  status: IssueStatus;
  createdAt: string;
  createdBy: string;
  createdByName?: string;

  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;

  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface SelfInspectionModel {
  id?: string;
  companyId: string;
  siteId: string;
  siteName?: string;

  // Basic info
  name: string;
  checklist?: string;
  checklistId?: string;

  // Status tracking
  status: InspectionStatus;

  // Progress
  totalItems: number;
  completedItems: number;

  // Issues found
  issues: InspectionIssue[];
  issueCount: number;

  // Timestamps
  createdAt: string;
  updatedAt?: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;

  // User info
  createdBy: string;
  createdByName?: string;
  assignedTo?: string;
  assignedToName?: string;
  completedBy?: string;
  completedByName?: string;

  // Signature
  inspectorSignature?: string;
  signedAt?: string;
}

export interface SelfInspectionFilters {
  siteId?: string;
  status?: InspectionStatus;
  assignedTo?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// Pictorial Audit Types
// ============================================================================

export type AuditStatus = 'scheduled' | 'in_progress' | 'completed' | 'reviewed';
export type AuditRating = 'pass' | 'fail' | 'needs_improvement' | 'not_applicable';

export interface AuditPhoto {
  id: string;
  uri: string;
  caption?: string;
  rating?: AuditRating;
  annotations?: any[];
  takenAt: string;
  takenBy: string;
}

export interface AuditAreaResult {
  areaId: string;
  areaName: string;
  photos: AuditPhoto[];
  overallRating: AuditRating;
  score?: number;  // 0-100
  notes?: string;
  completedAt?: string;
}

export interface PictorialAuditModel {
  id?: string;
  companyId: string;
  siteId: string;
  siteName?: string;

  // Basic info
  name: string;
  auditType?: string;  // 'routine' | 'deep_clean' | 'compliance' | 'spot_check'

  // Status
  status: AuditStatus;

  // Progress
  totalAreas: number;
  completedAreas: number;

  // Results
  areaResults: AuditAreaResult[];
  overallScore?: number;  // 0-100
  overallRating?: AuditRating;

  // Timestamps
  createdAt: string;
  updatedAt?: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  reviewedAt?: string;

  // User info
  createdBy: string;
  createdByName?: string;
  auditorId?: string;
  auditorName?: string;
  reviewerId?: string;
  reviewerName?: string;

  // Signature
  auditorSignature?: string;
  reviewerSignature?: string;
}
