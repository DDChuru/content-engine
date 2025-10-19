# Storage Path & Image Filtering Improvements

## Date: 2025-10-18

---

## Problem Statement

### 1. Storage Path Issues
- **parentDocumentId** always "SCI" (from document metadata) - not unique
- **sectionId** inconsistent (sometimes title "YEAST TANKS", sometimes ID "SCI:86")
- Storage path not CSC-scoped: `work-instructions/SCI/YEAST TANKS/image-0.jpg`

### 2. Logo Extraction Issue
- Company logos and header graphics being extracted as section images
- Clutters the work instruction data with non-relevant images

---

## Solutions Implemented

### Solution 1: CSC-Scoped Storage with Firestore ID

#### New Storage Path Pattern:
```
companies/{companyId}/work-instructions/{firestoreDocId}/image-{index}.{extension}
```

#### Example:
```
Before: work-instructions/SCI/YEAST TANKS/image-0.jpg
After:  companies/AnmdYRpshMosqbsZ6l15/work-instructions/siteId_SCI_YEAST_TANKS_1729276800000/image-0.jpg
```

#### Implementation Details:

1. **Generate Firestore ID First** (before image upload)
   ```typescript
   const firestoreDocId = `${siteId}_${parentDocumentId}_${section.sectionId}_${Date.now()}`
     .replace(/[^a-zA-Z0-9_-]/g, '_');
   ```

2. **Use ID for Both Storage & Firestore**
   - Upload images with this ID in the path
   - Save document to Firestore with same ID
   - Solves chicken-and-egg problem

3. **Benefits:**
   - ✅ Unique storage paths per work instruction
   - ✅ CSC-scoped (company-level organization)
   - ✅ Consistent Firestore document ID
   - ✅ Easy to locate images for a specific instruction
   - ✅ No conflicts between sections with same title

---

### Solution 2: Logo & Header Image Filtering

#### Two-Layer Filtering:

##### A. Gemini Prompt Update
Added instruction to exclude logos:
```
IMPORTANT: For images, ONLY include images that show cleaning procedures,
equipment, or areas. EXCLUDE company logos, headers, footers, and decorative graphics.
```

##### B. Client-Side Heuristic Filter
```typescript
// Filter out likely logo/header images
const filteredImages = section.images.filter((img) => {
  // Keep if has a meaningful caption
  if (img.caption && img.caption.length > 10) return true;

  // Filter out page 1 images without captions (likely logos)
  if (img.pageNumber === 1 && (!img.caption || img.caption.length < 10)) {
    return false;
  }

  return true;
});
```

#### Filter Logic:
1. **Keep** if image has caption longer than 10 characters
2. **Remove** if image is on page 1 AND has no/short caption
3. Logs filtering results for debugging

---

## Code Changes

### File: `packages/backend/src/routes/extraction.ts`

#### Function: `uploadSectionImages`
**Changes:**
- Added `companyId` parameter
- Changed `parentDocumentId` → `firestoreDocId` parameter
- Updated storage path to CSC pattern
- Added image filtering logic before upload
- Added logging for filter results

**Before:**
```typescript
const storagePath = `work-instructions/${parentDocumentId}/${section.sectionId}/image-${index}.${extension}`;
```

**After:**
```typescript
const storagePath = `companies/${companyId}/work-instructions/${firestoreDocId}/image-${index}.${extension}`;
```

#### Upload Loop
**Changes:**
- Generate Firestore ID before processing section
- Pass ID to `uploadSectionImages`
- Use same ID when saving to Firestore

**Key Code:**
```typescript
const firestoreDocId = `${siteId}_${parentDocumentId}_${section.sectionId}_${Date.now()}`
  .replace(/[^a-zA-Z0-9_-]/g, '_');

await uploadSectionImages(project, companyId, firestoreDocId, section);

const id = await saveToFirestore(project, collectionPath, {...}, firestoreDocId);
```

### File: `packages/backend/src/services/document-extraction.ts`

#### Constant: `SECTION_DETAIL_PROMPT`
**Changes:**
- Added image filtering instruction

**Added Line:**
```
- IMPORTANT: For images, ONLY include images that show cleaning procedures, equipment, or areas.
  EXCLUDE company logos, headers, footers, and decorative graphics.
```

---

## Storage Structure Comparison

### Before:
```
Firebase Storage (iclean-field-service-4bddd)
├── work-instructions/
    ├── SCI/
        ├── YEAST TANKS/
        │   ├── image-0.jpg  ❌ Same path for all uploads
        │   └── image-1.jpg
        ├── WALLS/
        │   └── image-0.jpg
        └── LOADING BAY/
            └── image-0.jpg
```

### After:
```
Firebase Storage (iclean-field-service-4bddd)
├── companies/
    └── AnmdYRpshMosqbsZ6l15/  ← ACS Company
        └── work-instructions/
            ├── siteA_SCI_YEAST_TANKS_1729276800000/
            │   ├── image-0.jpg  ✅ Unique per upload
            │   └── image-1.jpg
            ├── siteA_SCI_WALLS_1729276801000/
            │   └── image-0.jpg
            ├── siteB_SCI_YEAST_TANKS_1729276802000/  ✅ Different site, no conflict
            │   └── image-0.jpg
            └── siteB_SCI_LOADING_BAY_1729276803000/
                └── image-0.jpg
```

---

## Firestore Document ID Format

### Pattern:
```
{siteId}_{parentDocumentId}_{sectionId}_{timestamp}
```

### Examples:
```
site123_SCI_YEAST_TANKS_1729276800000
site456_SCI_WALLS_1729276801000
site123_SCI_LOADING_BAY_1729276802000
```

### Components:
- **siteId**: Selected site identifier
- **parentDocumentId**: Document ID from metadata (e.g., "SCI")
- **sectionId**: Section identifier (cleaned title or ID)
- **timestamp**: Milliseconds since epoch (ensures uniqueness)

### Character Sanitization:
All non-alphanumeric characters (except `_` and `-`) are replaced with `_`

---

## Benefits

### 1. Storage Organization
- ✅ Company-scoped (CSC architecture)
- ✅ Unique paths prevent overwrites
- ✅ Easy to locate images for specific instruction
- ✅ Scalable for multiple companies/sites

### 2. Image Quality
- ✅ Filters out irrelevant logos
- ✅ Keeps only procedural/equipment images
- ✅ Reduces storage costs
- ✅ Cleaner data for frontend display

### 3. Debugging & Maintenance
- ✅ Logging shows filter results
- ✅ Clear correlation between Firestore doc and storage path
- ✅ Easy to audit/clean up images

---

## Testing Checklist

### Upload Flow
- [ ] Upload PDF with site selected
- [ ] Verify Firestore document created with correct ID format
- [ ] Check images uploaded to CSC-scoped path
- [ ] Confirm logo images filtered out
- [ ] Verify image URLs accessible

### Image Filtering
- [ ] Page 1 logo images excluded
- [ ] Images with captions kept
- [ ] Images from content pages kept
- [ ] Check logs for filter statistics

### Storage Paths
- [ ] Path follows CSC pattern
- [ ] Multiple uploads don't overwrite
- [ ] Same section from different sites don't conflict

---

## Logging Output

### Image Filtering:
```
🚫 [uploadSectionImages] Filtering out likely logo/header image from page 1
📊 [uploadSectionImages] Image filtering: {
  original: 3,
  filtered: 2,
  removed: 1
}
```

### Upload Success:
```
✅ Image uploaded to: companies/AnmdYRpshMosqbsZ6l15/work-instructions/site123_SCI_WALLS_1729276800000/image-0.jpg
```

---

## Future Enhancements

### Possible Improvements:
1. **Image size filtering** - Skip very small images (likely icons/logos)
2. **Image dimension filtering** - Skip images with unusual aspect ratios
3. **OCR-based filtering** - Detect and skip images containing mainly text (headers)
4. **ML-based classification** - Use vision AI to classify image types
5. **User feedback loop** - Allow manual flagging of incorrect images

### Storage Optimization:
1. **Image compression** - Reduce storage size while maintaining quality
2. **Format conversion** - Convert to WebP for better compression
3. **Lazy loading** - Only fetch images when viewing specific section
4. **CDN integration** - Serve images through CDN for faster loading

---

## Migration Notes

### Existing Data:
- Old images remain at: `work-instructions/{parentDocumentId}/{sectionId}/`
- New uploads use: `companies/{companyId}/work-instructions/{firestoreDocId}/`
- No automatic migration (old data still accessible via URLs)

### Migration Script (Future):
If needed, create script to:
1. Query all old work instructions
2. Copy images to new CSC paths
3. Update image URLs in Firestore documents
4. Delete old images after verification

---

## Related Documentation

- CSC Architecture: `CSC-ARCHITECTURE.md`
- Changes for Cherry-Pick: `CHANGES-FOR-CHERRY-PICK.md`
- Work Instruction Types: `packages/shared/src/types.ts`

---

**Last Updated:** 2025-10-18
**Status:** ✅ Implemented & Ready for Testing
