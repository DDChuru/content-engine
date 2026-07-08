> Extracted verbatim from CLAUDE.md on 2026-07-08. Update THIS file (not root CLAUDE.md) when shipping changes in this area.

## Type System

Shared types are defined in `packages/shared/src/types.ts`. Key interfaces:

**Work Instructions:**
- `WorkInstructionExtraction` - Full extraction with CSC fields
- `WorkInstructionSection` - PDF section with metadata
- `WorkInstructionStepGroup` - Grouped cleaning steps

**CSC Data Models:**
- `SiteModel` - Site/facility with `iClean` flag
- `SiteAreaModel` - Cleaning area within a site
- `AreaItemModel` - Individual cleaning task with MCS/SCI integration
- `ScheduleModel` - Cleaning frequency schedules

**API Responses:**
- `ApiResponse<T>` - Standard response wrapper

## Frontend Patterns

The frontend uses Next.js 14 App Router with:

- **UI Components:** Radix UI primitives with Tailwind styling
- **State Management:** React hooks (useState, useEffect)
- **Styling:** Tailwind CSS with `class-variance-authority` for variants
- **Theme:** Dark mode support via `next-themes`

**Key Components:**
- `acs-workspace.tsx` - Work instruction import UI for ACS
- `chat-interface.tsx` - Claude chat integration
- `artifact-viewer.tsx` - Generated content display
- `site-picker.tsx` - Site selection with type-ahead search
