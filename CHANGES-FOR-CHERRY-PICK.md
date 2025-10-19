# Changes for Cherry-Picking to Main Branch

## Summary
This document tracks all changes made in the `acs-import` branch for easy cherry-picking back to the main branch.

## Feature: CSC Architecture Integration for Work Instructions

### Overview
Implemented Company-Site-Collection (CSC) architecture for work instruction imports, allowing site-specific document management with type-ahead search and proper data organization.

---

## Changed Files

### Documentation
- **NEW**: `CSC-ARCHITECTURE.md` - Comprehensive CSC architecture documentation
- **NEW**: `CHANGES-FOR-CHERRY-PICK.md` - This file

### Backend Changes

#### 1. `packages/shared/src/types.ts`
**Changes:**
- Added CSC architecture types:
  - `SiteModel` - Site/facility information with iClean flag
  - `SiteAreaModel` - Cleaning areas within sites
  - `AreaItemModel` - Individual cleaning tasks/checklist items
  - `ScheduleModel` - Cleaning frequency schedules
  - `CleaningSchedule` - Schedule configuration
- Updated `WorkInstructionExtraction` to include:
  - `companyId?: string` - CSC company ID
  - `siteId?: string` - Selected site ID

#### 2. `packages/backend/src/services/firebase.ts`
**New Functions:**
- `getCSCCollectionPath(companyId: string, collection: string)` - Build CSC Firestore paths
- `getICleanSites(projectName, companyId, limit)` - Fetch sites with iClean enabled
- `searchSitesByName(projectName, companyId, searchTerm, iCleanOnly, limit)` - Type-ahead site search

**Export Updates:**
- Added new functions to default export

#### 3. `packages/backend/src/routes/extraction.ts`
**Constants:**
- Added `ACS_COMPANY_ID = 'AnmdYRpshMosqbsZ6l15'`

**Import Updates:**
- Added CSC Firebase service imports:
  - `getCSCCollectionPath`
  - `getICleanSites`
  - `searchSitesByName`

**Route Updates:**

a. `POST /work-instruction`
- **BREAKING CHANGE**: Now requires `siteId` in request body
- Saves to CSC path: `companies/{companyId}/standard_cleaning_instructions`
- Includes `companyId` and `siteId` in saved records
- Returns 400 error if `siteId` is missing

b. **NEW**: `GET /sites`
- Fetches iClean-enabled sites for ACS company
- Query params: `project` (default: 'acs'), `limit` (default: 100)
- Returns: Array of SiteModel objects

c. **NEW**: `GET /sites/search`
- Type-ahead search for iClean sites
- Query params: `q` (search term), `project`, `limit` (default: 20)
- Minimum search length: 2 characters
- Searches: site name, location, fullAddress

### Frontend Changes

#### 4. **NEW**: `packages/frontend/components/site-picker.tsx`
**Features:**
- Type-ahead search with 300ms debounce
- Fetches from `/api/extraction/sites` on mount
- Searches `/api/extraction/sites/search?q={term}` when typing
- Dropdown with site name, location, and full address
- Visual confirmation when site selected
- Disabled state support
- Dark mode compatible

#### 5. `packages/frontend/components/acs-workspace.tsx`
**State Updates:**
- Added `selectedSite: SiteModel | null` state

**Import Updates:**
- Added `SiteModel` type import
- Added `SitePicker` component import

**Upload Logic:**
- Added site selection validation
- Includes `siteId` in FormData when uploading
- Shows error if no site selected

**UI Updates:**
- Integrated `SitePicker` into `UploadCard`
- Upload button disabled until site selected
- Shows "Please select a site first" message

---

## API Changes

### New Endpoints

#### GET /api/extraction/sites
Fetch iClean-enabled sites

**Query Parameters:**
- `project` (optional, default: 'acs')
- `limit` (optional, default: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "site-id",
      "companyId": "AnmdYRpshMosqbsZ6l15",
      "name": "Site Name",
      "location": "City",
      "fullAddress": "Full address...",
      "settings": {
        "iClean": true,
        "standard": 85
      }
    }
  ]
}
```

#### GET /api/extraction/sites/search
Type-ahead site search

**Query Parameters:**
- `q` (required, min length: 2)
- `project` (optional, default: 'acs')
- `limit` (optional, default: 20)

**Response:** Same as GET /sites

### Updated Endpoints

#### POST /api/extraction/work-instruction
**Breaking Change:** Now requires `siteId`

**Request (FormData):**
- `file` (required) - PDF file
- `project` (optional, default: 'acs')
- `siteId` (required) - Selected site ID

**Storage Path Changed:**
- **Before**: `work_instructions/{id}`
- **After**: `companies/AnmdYRpshMosqbsZ6l15/standard_cleaning_instructions/{id}`

**Record Structure Updated:**
```json
{
  "id": "doc-id",
  "companyId": "AnmdYRpshMosqbsZ6l15",
  "siteId": "selected-site-id",
  "project": "acs",
  "parentDocumentId": "SCI",
  "section": { /* ... */ },
  "createdAt": "2025-10-18T...",
  "sourceFile": { /* ... */ }
}
```

---

## Firestore Structure Changes

### Before
```
work_instructions/{instructionId}
```

### After (CSC Architecture)
```
companies/
  └─ AnmdYRpshMosqbsZ6l15/
      ├─ sites/{siteId}
      ├─ siteAreas/{areaId}
      ├─ areaItems/{itemId}
      └─ standard_cleaning_instructions/{instructionId}
```

---

## Migration Notes

### Breaking Changes
1. **POST /work-instruction** now requires `siteId` parameter
2. Work instructions now stored in CSC path
3. Existing work instructions in `work_instructions` collection will NOT be automatically migrated

### Backwards Compatibility
- `project` field kept for compatibility but deprecated
- Use `companyId` and `siteId` going forward

---

## Testing Checklist

### Backend
- [ ] GET /api/extraction/sites returns iClean sites
- [ ] GET /api/extraction/sites/search works with search term
- [ ] POST /work-instruction requires siteId
- [ ] POST /work-instruction saves to CSC path
- [ ] Uploaded work instructions include companyId and siteId

### Frontend
- [ ] Site picker loads sites on mount
- [ ] Type-ahead search works with debounce
- [ ] Site selection enables upload button
- [ ] Upload validation shows error if no site
- [ ] Selected site shows visual confirmation
- [ ] Dark mode styles work correctly

---

## Git Commit Strategy

When cherry-picking to main, consider creating these logical commits:

1. **CSC Architecture Documentation**
   - `CSC-ARCHITECTURE.md`

2. **Backend: Add CSC Types**
   - `packages/shared/src/types.ts`

3. **Backend: Add CSC Firebase Services**
   - `packages/backend/src/services/firebase.ts`

4. **Backend: Add Site API Routes**
   - `packages/backend/src/routes/extraction.ts` (site routes only)

5. **Backend: Update Work Instruction Storage to CSC**
   - `packages/backend/src/routes/extraction.ts` (upload updates)

6. **Frontend: Add Site Picker Component**
   - `packages/frontend/components/site-picker.tsx`

7. **Frontend: Integrate Site Selection in Upload Flow**
   - `packages/frontend/components/acs-workspace.tsx`

---

## Dependencies

No new npm dependencies added. All changes use existing packages:
- Firebase Admin SDK (existing)
- React hooks (existing)
- Lucide icons (existing)

---

## Environment Variables

**Required:**
- `ACS_FIREBASE_KEY` - Firebase service account for ACS project

**Existing (unchanged):**
- `GEMINI_API_KEY` - For document extraction
- `NEXT_PUBLIC_API_URL` - Backend API URL

---

## Future Enhancements

### Pending Tasks (from todo list)
1. Create tabbed spreadsheet-like view for SCIs
2. Add navigation from upload success to SCI spreadsheet view

### Potential Improvements
1. Full-text search using Algolia or similar (currently client-side filtering)
2. Site management UI (create/edit/delete sites)
3. Bulk import for multiple work instructions
4. Migration script for existing work instructions
5. Site-to-area mapping UI
6. Area item generation from work instruction steps

---

## Related Documentation

- CSC Architecture: `CSC-ARCHITECTURE.md`
- NCR Audit App Reference: `/Documents/projects/angular/ncr_audt_app/CLAUDE.md`
- Firebase Services: `packages/backend/src/services/firebase.ts`
- Work Instruction Types: `packages/shared/src/types.ts`

---

## Notes for Main Branch Merge

1. **Database Migration**: Consider creating a migration script to move existing `work_instructions` to CSC path
2. **API Versioning**: Consider v1/v2 API paths if maintaining backwards compatibility
3. **Documentation**: Update API documentation with new endpoints
4. **Testing**: Run full integration tests after merge
5. **Monitoring**: Watch for 400 errors on upload (missing siteId)

---

**Last Updated:** 2025-10-18
**Branch:** acs-import
**Ready for Cherry-Pick:** Backend & Site Selection Flow ✅
**Pending:** Spreadsheet View & Navigation
