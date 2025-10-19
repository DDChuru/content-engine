# CSC Architecture Documentation

## Overview

The **Company-Site-Collection (CSC)** pattern is a hierarchical data organization system used for multi-tenant Firestore data management. This architecture ensures data isolation, scalability, and consistent path management across the application.

## Core Principles

### 1. Company-Centric Organization
All business data is nested under company documents:
```
companies/{companyId}/{collection}/{documentId}
```

### 2. Data Isolation
Each company's data is completely isolated within their namespace, preventing cross-company data leaks.

### 3. Consistent Path Structure
All Firestore paths follow the CSC pattern:
- **Root Collections**: System-wide data (userProfile, globalSettings, counters)
- **Company Collections**: Business data nested under companies

## Key Collections

### Root Collections (Global)
- `userProfile` - User profiles
- `globalSettings` - System-wide settings
- `counters` - Document ID counters
- `documentCategories` - Document engine categories

### Company Collections (CSC Pattern)
All under `companies/{companyId}/`:
- `sites` - Physical locations/facilities
- `siteAreas` - Cleaning areas within sites
- `areaItems` - Individual cleaning tasks/checklist items
- `inspections` - Completed cleaning inspections
- `ncrs` - Non-conformance records
- `auditTemplates` - Audit templates
- `standard_cleaning_instructions` - Work instructions (ACS specific)

## Data Model Interfaces

### SiteModel
```typescript
interface SiteModel {
  id: string;
  companyId: string;
  name: string;
  location?: string;
  fullAddress?: string;
  category?: string;
  isActive?: boolean;

  settings?: {
    iClean?: boolean;  // KEY FLAG - enables cleaning module
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
  };
}
```

### SiteAreaModel
```typescript
interface SiteAreaModel {
  id?: string;
  siteId: string;
  barcode: string;
  name: string;
  dateCreated: Date;
  updatedBy?: UserProfileModel;
  mainAreaId?: string;
  cleaningSchedules?: CleaningSchedule[];

  // Legacy fields
  legacyAreaId?: number;
  legacySiteId?: number;
}
```

### AreaItemModel
```typescript
interface AreaItemModel {
  id?: string;
  cycleId: number;
  schedule: ScheduleModel;
  areaId: string;
  area: SiteAreaModel;
  siteId: string;
  itemDescription: string;
  yCode?: string;  // Pass code
  nCode?: string;  // Fail code
  inspectionCategoryId?: number;
  dateCreated: Date;
  createdBy: UserProfileModel;
  scoreWeight: number;

  // Integration fields
  mcsDocumentId?: string;    // Master Cleaning Schedule reference
  mcsItemIndex?: number;     // Index in MCS array
  sciDocumentId?: string;    // Standard Cleaning Instruction reference
  frequency?: string;        // Original frequency text
  method?: string;          // Cleaning method reference

  // Legacy fields
  legacyId?: number;
  legacySiteId?: number;
  legacyAreaId?: number;
}
```

### ScheduleModel
```typescript
interface ScheduleModel {
  id: string;
  cycleId: number;
  name: string;
  days: number;
  hours: number;
}
```

## Firestore Path Patterns

### Path Construction Examples

```typescript
// Company path
`companies/${companyId}`

// Sites collection
`companies/${companyId}/sites`
`companies/${companyId}/sites/${siteId}`

// Site Areas
`companies/${companyId}/siteAreas`
`companies/${companyId}/siteAreas/${areaId}`

// Area Items (cleaning tasks)
`companies/${companyId}/areaItems`
`companies/${companyId}/areaItems/${itemId}`

// Standard Cleaning Instructions (Work Instructions)
`companies/${companyId}/standard_cleaning_instructions`
`companies/${companyId}/standard_cleaning_instructions/${instructionId}`

// Inspections
`companies/${companyId}/inspections`
`companies/${companyId}/inspections/${inspectionId}`
```

## ACS Implementation

### Company ID
For ACS work instruction imports:
```typescript
const ACS_COMPANY_ID = 'AnmdYRpshMosqbsZ6l15';
```

### Work Instruction Storage

Work instructions are stored at:
```
companies/AnmdYRpshMosqbsZ6l15/standard_cleaning_instructions/{instructionId}
```

Each record includes:
```typescript
{
  id: string;
  companyId: 'AnmdYRpshMosqbsZ6l15';
  siteId: string;  // Selected site
  parentDocumentId: string;  // Groups sections from same PDF
  section: WorkInstructionSection;
  sourceFile: {
    name: string;
    size: number;
    contentType: string;
  };
  createdAt: string;
  updatedAt?: string;
}
```

### Site Selection Requirements

1. **Filter by iClean**: Only show sites where `iClean: true`
2. **Type-ahead Search**: Debounced search on site name
3. **Company Context**: Always use ACS company ID

### Frequency Mapping

Map work instruction frequencies to cleaning schedules:

```typescript
const FREQUENCY_CYCLES = {
  'Daily': { cycleId: 1, days: 1, hours: 24, name: 'Daily' },
  'Weekly': { cycleId: 2, days: 7, hours: 168, name: 'Weekly' },
  'Monthly': { cycleId: 3, days: 30, hours: 720, name: 'Monthly' },
  'Quarterly': { cycleId: 4, days: 90, hours: 2160, name: 'Quarterly' },
  'Annually': { cycleId: 5, days: 365, hours: 8760, name: 'Annually' }
};
```

## Service Architecture

```
Components
    ↓
Domain Services (e.g., SitesService, InspectionsService)
    ↓
BaseService<T> (Generic CRUD operations)
    ↓
DbService (Firestore wrapper)
    ↓
Firestore
```

### Path Management

Always use a centralized path configuration:

```typescript
class PathsConfig {
  getCollectionPath(companyId: string, collection: string): string {
    return `companies/${companyId}/${collection}`;
  }

  getDocumentPath(companyId: string, collection: string, docId: string): string {
    return `companies/${companyId}/${collection}/${docId}`;
  }
}
```

## Best Practices

### 1. Always Use Company Context
Never access collections without company context:
```typescript
// ✓ CORRECT
const path = `companies/${companyId}/sites`;

// ✗ WRONG
const path = `sites`;
```

### 2. Enable iClean for Cleaning Sites
All sites used for cleaning inspections must have:
```typescript
{
  iClean: true,
  settings: {
    iClean: true,
    standard: 85  // Default passing score
  }
}
```

### 3. Maintain Relationships
- Sites → SiteAreas (one-to-many)
- SiteAreas → AreaItems (one-to-many)
- WorkInstructions → Sites (many-to-one)
- Inspections → AreaItems (many-to-many via inspection items)

### 4. Preserve Traceability
Always link imported data to source:
```typescript
{
  workInstructionId: string;  // Original document ID
  parentDocumentId: string;   // Groups related sections
  sourceFile: {...}          // Original file metadata
}
```

### 5. Use Firestore Best Practices
- Limit collection depth to 2-3 levels
- Use subcollections for related data
- Index frequently queried fields
- Batch writes for atomic operations

## Migration Notes

When migrating from legacy systems:
1. Preserve legacy IDs in `legacy*` fields
2. Generate new Firestore document IDs
3. Update all references to use new IDs
4. Maintain backward compatibility where needed

## Security Rules

All CSC collections should enforce company isolation:
```javascript
match /companies/{companyId}/{collection}/{document} {
  allow read, write: if request.auth != null
    && hasCompanyAccess(request.auth.uid, companyId);
}
```

## Related Documentation

- NCR Audit App: `/Documents/projects/angular/ncr_audt_app/CLAUDE.md`
- Firebase Services: `packages/backend/src/services/firebase.ts`
- Work Instruction Types: `packages/shared/src/types.ts`
