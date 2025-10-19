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
