# PDF Extraction Approaches for 94-Page Documents

**Document**: Premier Bakeries Standard Cleaning Instructions (94 pages)
**Problem**: Current extraction only captures first 2 pages (WALLS section)
**Goal**: Extract all sections across all 94 pages

---

## Current Situation

### Test Results (2025-10-18)
```
📋 Phase 1: Extracting overview and step titles
   ✅ Overview extracted, found 8 steps

📝 Phase 2: Extracting 8 steps individually
   ✓ Step 1: WALLS - Daily cleaning (0 substeps)
   ✓ Step 2: WALLS - Daily cleaning (0 substeps)
   ✓ Step 3: WALLS - Daily cleaning (1 substeps)
   ✓ Step 1: WALLS - Deep cleaning (2 substeps)
   ✓ Step 2: WALLS - Deep cleaning (4 substeps)
   ...
✅ Complete: 8 steps, 15 substeps
```

**Issue**: Only extracted WALLS section (pages 1-2), missing:
- FLOORS (pages 3-8)
- STAIRS & PLATFORMS (pages 9-14)
- DRAINS (pages 15-20)
- EQUIPMENT (pages 21-30)
- ... (~12 more sections across 94 pages)

---

## Gemini API Capabilities (Confirmed via Research)

✅ **Page Limit**: 1,000 pages per PDF
✅ **File Size**: 50 MB max for document processing
✅ **Context Window**: 1M tokens (Gemini 2.0 Flash)
✅ **Output Tokens**: 8,192 tokens (practical limit with JSON schema)
✅ **Structured Output**: `responseSchema` ensures valid JSON

**Conclusion**: The 94-page PDF is well within Gemini's technical limits!

---

## Solution A: Three-Phase Extraction with TOC

### Overview
Systematic approach with table of contents discovery first, then section-by-section extraction.

### Architecture
```
Phase 0: Table of Contents Extraction
  ↓
  Discovers: [WALLS, FLOORS, DRAINS, STAIRS, ...]
  ↓
Phase 1: Section Overview Extraction (per section)
  ↓
  For each section: metadata + step titles
  ↓
Phase 2: Step Detail Extraction (per step)
  ↓
  For each step: full substeps, tools, materials
```

### Implementation
```typescript
// Phase 0: TOC Extraction
const TOC_PROMPT = `Scan this COMPLETE 94-page PDF and extract table of contents.

CRITICAL: Read through ALL pages from page 1 to page 94.

Instructions:
- Identify ALL major section headings (WALLS, FLOORS, DRAINS, etc.)
- Note approximate page range for each section
- Return sections in document order
- Common cleaning areas: walls, floors, ceilings, drains, equipment, stairs, windows, doors`;

// Phase 1: Section Overview (per section)
const SECTION_OVERVIEW_PROMPT = (sectionName: string, pageRange: string) =>
  `Extract overview for "${sectionName}" section only (pages ${pageRange}).

Instructions:
- Focus ONLY on this section
- Extract: metadata, equipment, materials, safety
- List ALL step titles (daily + weekly + deep cleaning)
- Include step numbers and page ranges`;

// Phase 2: Step Details (existing)
const STEP_DETAIL_PROMPT = (stepNumber, stepTitle) =>
  `Extract complete details for Step ${stepNumber}: ${stepTitle}...`;
```

### Pros
✅ Systematic and predictable
✅ Guarantees all sections found via TOC
✅ Clear progress tracking (0/12 sections, 5/47 steps)
✅ Handles any document size
✅ Can resume if interrupted

### Cons
❌ Many API calls: ~12 (TOC + sections) + 47 (steps) = **59 API calls**
❌ Slower processing time (~2-3 minutes)
❌ Higher cost (~$0.50-1.00 for full extraction)
❌ More complex orchestration code

### Cost Estimate
- Phase 0 (TOC): 1 call × $0.01 = $0.01
- Phase 1 (12 sections): 12 calls × $0.01 = $0.12
- Phase 2 (47 steps): 47 calls × $0.01 = $0.47
- **Total**: ~$0.60 per document

### When to Use
- Documents with unknown structure
- Very long documents (>100 pages)
- Need detailed progress tracking
- Batch processing where reliability > speed

---

## Solution B: Page-Range Chunking

### Overview
Split the 94-page PDF into manageable chunks, extract each chunk, then merge results.

### Architecture
```
Split: Pages 1-15, 16-30, 31-45, 46-60, 61-75, 76-94
  ↓
Extract each chunk separately (6 API calls)
  ↓
Merge overlapping sections
  ↓
Deduplicate and normalize
```

### Implementation
```typescript
async extractByPageRanges(pdfBase64: string): Promise<WorkInstructionSection[]> {
  const pageRanges = [
    { start: 1, end: 15 },   // ~WALLS, FLOORS, STAIRS
    { start: 16, end: 30 },  // ~DRAINS, EQUIPMENT
    { start: 31, end: 45 },
    { start: 46, end: 60 },
    { start: 61, end: 75 },
    { start: 76, end: 94 }
  ];

  const allSections: WorkInstructionSection[] = [];

  for (const range of pageRanges) {
    const prompt = `Extract sections from pages ${range.start}-${range.end} ONLY.`;
    const sections = await this.extractSections(pdfBase64, prompt);
    allSections.push(...sections);
  }

  // Merge overlapping sections (e.g., FLOORS might span pages 14-18)
  return this.mergeSections(allSections);
}
```

### Pros
✅ Simple and predictable
✅ Works for any document
✅ Fewer API calls than Solution A (**6-8 calls**)
✅ No TOC phase needed

### Cons
❌ May split sections across chunks (FLOORS: p14-18 split between chunks)
❌ Requires complex merge logic for overlapping sections
❌ Hard to determine optimal chunk size
❌ Duplicate data at chunk boundaries

### Cost Estimate
- 6 chunks × $0.01 = $0.06
- **Total**: ~$0.06 per document

### When to Use
- Document structure unknown
- Don't need TOC
- Willing to handle merge complexity
- Cost-sensitive applications

---

## Solution C: Enhanced Single-Pass Prompting

### Overview
Update the current prompt to explicitly instruct Gemini to scan all 94 pages in one API call.

### Implementation
```typescript
const SECTION_PROMPT = `Extract structured cleaning instructions from this COMPLETE 94-page document.

⚠️ CRITICAL: This PDF contains 94 pages. You MUST read through ALL pages from start to finish.

Output Requirements:
- Scan EVERY page (1-94) for section headings (WALLS, FLOORS, DRAINS, STAIRS, etc.)
- Treat each major section as a separate instruction object
- For EACH section across ALL pages:
  - Capture table values (area, chemicals, frequency, etc.)
  - Convert cleaning instructions into step groups
  - Include ALL subsections (Daily, Weekly, Deep Cleaning)
- Do NOT stop after the first few pages
- Return ONLY JSON that satisfies the schema`;
```

### Pros
✅ **Simplest implementation** (modify existing prompt)
✅ **Fastest** (single API call)
✅ **Cheapest** ($0.01 per document)
✅ Minimal code changes
✅ No orchestration needed

### Cons
❌ **No guarantee Gemini reads all pages** (behavioral, not technical)
❌ May still truncate if output exceeds 8,192 tokens
❌ No progress tracking
❌ All-or-nothing approach

### Cost Estimate
- 1 call × $0.01 = $0.01
- **Total**: ~$0.01 per document

### When to Use
- **Test first** before implementing complex solutions
- Documents that fit within output token limit
- Speed and cost are priorities
- Can accept some risk of incomplete extraction

---

## Solution D: Section-Based Schema (CURRENT IMPLEMENTATION)

### Overview
Your current implementation with redesigned data model matching PDF structure.

### Current Code
```typescript
// From document-extraction.ts (lines 1-414)
const SECTION_PROMPT = `Extract structured cleaning/work instructions from this document.

Output Requirements:
- Treat each primary section (WALLS, FLOORS, CHAIRS) as separate instruction object
- Capture all table values (area, chemicals, frequency, etc.)
- Convert instructions into step groups with labelled steps
- Preserve original wording
- Return ONLY JSON that satisfies schema`;

const SECTION_RESPONSE_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      sectionId: { type: 'string' },
      title: { type: 'string' },
      pageRange: { type: 'string' },
      area: { type: 'array' },
      chemicals: { type: 'array' },
      stepGroups: { type: 'array' },
      // ... rich metadata
    }
  }
};
```

### What's Working
✅ Rich schema matching actual PDF structure
✅ Captures chemicals, PPE, colour codes
✅ Section-based organization (vs old step-based)
✅ Single API call
✅ Clean TypeScript types

### What's NOT Working
❌ **Only extracting first 2 pages** (WALLS section)
❌ Missing remaining 92 pages
❌ No explicit "scan all pages" instruction

### Pros
✅ Best data model for the actual PDF format
✅ Fast (1 API call)
✅ Cheap ($0.01)
✅ Already implemented

### Cons
❌ Currently incomplete (only 2 pages)
❌ Needs prompt enhancement to work

### Cost Estimate
- 1 call × $0.01 = $0.01
- **Total**: ~$0.01 per document

### When to Use
- **Right now** - it's already implemented!
- Just needs prompt enhancement (see Solution E)

---

## Solution E: Hybrid Approach (Solution C + D Enhanced)

### Overview
Keep the current section-based schema BUT enhance the prompt with explicit "all pages" instructions, and add fallback to chunking if it truncates.

### Implementation
```typescript
const SECTION_PROMPT = `Extract structured cleaning/work instructions from this COMPLETE multi-page document.

⚠️ CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. This PDF contains ${Math.ceil(pdfBase64.length / 100000)} pages
2. You MUST scan through EVERY page from start to finish
3. This document contains MULTIPLE sections (typical: WALLS, FLOORS, DRAINS, STAIRS, EQUIPMENT, CEILINGS, WINDOWS, DOORS, etc.)
4. Do NOT stop after the first section - continue reading until the last page

Common Structure (scan for ALL of these):
- WALLS (typically pages 1-8)
- FLOORS (typically pages 9-16)
- STAIRS & PLATFORMS
- DRAINS
- EQUIPMENT
- CEILINGS
- WINDOWS
- DOORS
- OUTDOOR AREAS
- ... and any other sections present

Output Requirements:
- Treat each primary section heading as a separate instruction object
- For EVERY section across ALL pages, capture:
  - All table values (area, chemicals with ratios, frequency, responsibilities)
  - PPE / safety badges as readable labels
  - Step groups (Daily, Weekly, Deep Cleaning, etc.)
- Return array of ALL sections found
- Preserve original wording; trim whitespace only
- Use empty strings "" or empty arrays [] when missing (never null)
- Return ONLY JSON that satisfies the schema`;

async extractSections(pdfBase64: string): Promise<WorkInstructionSection[]> {
  console.log('📄 Starting section extraction...');
  console.log(`   PDF size: ${(pdfBase64.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Estimated pages: ~${Math.ceil(pdfBase64.length / 100000)}`);

  try {
    // Try single-pass extraction with enhanced prompt
    const sections = await this.extractSectionsSinglePass(pdfBase64);

    // Validation: Did we get ALL sections?
    if (sections.length < 5) {
      console.warn(`⚠️  Only ${sections.length} sections extracted. Document may have more.`);
      console.warn('   Consider using chunked extraction for complete results.');
    }

    return sections;
  } catch (error) {
    console.error('❌ Single-pass extraction failed, falling back to chunking...');
    return this.extractSectionsByChunks(pdfBase64);
  }
}
```

### Pros
✅ Best of both worlds
✅ Try fast approach first, fall back if needed
✅ Current implementation + minimal changes
✅ Validation checks for completeness
✅ Automatic fallback to chunking

### Cons
❌ More complex orchestration
❌ Need to implement chunking fallback

### Cost Estimate
- Success case: $0.01 (single pass)
- Fallback case: $0.06 (chunking)
- **Average**: ~$0.02 per document

### When to Use
- **RECOMMENDED**: Production-ready approach
- Best reliability without over-engineering
- Handles edge cases gracefully

---

## Comparison Matrix

| Solution | API Calls | Cost/Doc | Speed | Reliability | Complexity | Status |
|----------|-----------|----------|-------|-------------|------------|---------|
| **A: Three-Phase** | ~59 | $0.60 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Proposed |
| **B: Page Chunking** | 6-8 | $0.06 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Not implemented |
| **C: Enhanced Prompt** | 1 | $0.01 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | Can test now |
| **D: Current (as-is)** | 1 | $0.01 | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ | **IMPLEMENTED** ✅ |
| **E: Hybrid (C+D)** | 1-8 | $0.02 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | **RECOMMENDED** 🎯 |

---

## Recommendation

### 🎯 Immediate Action: Test Solution C/D (Enhanced Prompt)

**Why?**
1. Already have the schema (Solution D implemented)
2. Just need to update the prompt
3. Fastest to test
4. If it works, we're done!

**Steps:**
1. Update `SECTION_PROMPT` to include "scan all pages" instructions
2. Add page count to prompt
3. Add common section names as hints
4. Test with Premier Bakeries PDF
5. Check: Did we get all ~12 sections?

### 📋 If That Fails: Implement Solution E (Hybrid)

**Why?**
1. Keeps the good parts of current implementation
2. Adds fallback safety net
3. Reasonable cost/performance tradeoff
4. Production-ready

**Steps:**
1. Keep enhanced prompt from Solution C
2. Add validation: `if (sections.length < expectedMin) { fallback }`
3. Implement chunking as fallback
4. Add logging for diagnostics

### 🚀 Future Enhancement: Consider Solution A

**When?**
- If documents regularly >200 pages
- If need detailed progress tracking
- If cost is not a concern
- If need to support interrupted/resumed extractions

---

## Testing Plan

### Phase 1: Test Enhanced Prompt (Solution C/D)
```bash
# Update SECTION_PROMPT with "scan all pages" instructions
# Run extraction
npm run test:premier-bakeries

# Expected output:
✅ Found 12 sections (WALLS, FLOORS, STAIRS, DRAINS, ...)
✅ Total steps: 47
✅ Total substeps: 245
```

### Phase 2: Validation
- Compare section count with manual PDF review
- Check page ranges match PDF
- Verify no truncation in last section
- Confirm all step groups present

### Phase 3: If Incomplete
- Measure how many sections extracted
- Check which sections missing
- Decide: enhance prompt further OR implement chunking

---

## Decision Log

**2025-10-18**: Initial extraction only captured WALLS (2 pages)
- Root cause: Prompt doesn't emphasize "all pages"
- Gemini has capacity (1K page limit, 50MB limit, 1M context)
- Solution D (section schema) implemented
- **Next**: Test Solution C (enhanced prompt)

---

## References

- [Gemini Document Understanding](https://ai.google.dev/gemini-api/docs/document-processing)
- [Gemini PDF Limits](https://discuss.ai.google.dev/t/maximum-supported-page-limit-for-pdf/81451)
- Current Implementation: `packages/backend/src/services/document-extraction.ts`
- Test Document: Premier Bakeries Standard Cleaning Instructions (94 pages)
