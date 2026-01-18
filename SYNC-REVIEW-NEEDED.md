# Synchronization Review Needed

**Date:** 2025-10-24
**Priority:** High
**Reason:** Multiple worktrees with overlapping development

---

## Current Worktree State

### Main Worktree (master branch)
**Location:** `/home/dachu/Documents/projects/content-engine`
**Status:** Has merged educational content + video director + NEW strategy consultant
**Latest commits:**
- `e2e1d20` - Add video director and content workspace systems
- `85cd70b` - Merge feature/educational-content
- `5be5e39` - Add educational content generation system

**New work (uncommitted):**
- Strategy Consultant Agent (6 new files, 1 modified file)

### Educational Content Worktree (feature/educational-content branch)
**Location:** `/home/dachu/Documents/projects/worktrees/educational-content`
**Status:** Active development on educational videos
**Latest visible commit:** `5be5e39` (same as merged to master)
**Potential changes:** May have newer work not yet merged

---

## Questions to Resolve

### 1. Merge Strategy
**Question:** How should we handle ongoing development across worktrees?

**Options:**
a) **Feature Branch Workflow**
   - Create feature branches for each agent
   - Merge to master when complete
   - Pros: Clean history, isolated work
   - Cons: Need to sync regularly

b) **Worktree Per Agent**
   - One worktree per major agent/feature
   - Merge to master periodically
   - Pros: Parallel development
   - Cons: Merge conflicts

c) **Single Main Development**
   - Do all work in main worktree
   - Use educational worktree only for testing
   - Pros: No conflicts
   - Cons: Limits parallel work

**Recommendation:** Option A (Feature Branch Workflow)

### 2. Conflict Resolution
**Question:** What to do when files conflict?

**Current conflicts risk:**
- `src/index.ts` - Route registrations (LOW risk, easy to merge)
- `package.json` - Dependencies (MEDIUM risk, need to coordinate)
- Route files - Each agent has own file (NO risk)

**Strategy:**
- Always keep all routes in index.ts
- Coordinate package.json changes
- Each agent gets own route file
- Shared services go in services/

### 3. Dependency Management
**Question:** How to handle npm dependencies across worktrees?

**Current state:**
- Main worktree: All deps from educational merge
- Educational worktree: May have additional deps

**Strategy:**
- Run `npm install` in main worktree after each merge
- Keep package.json synchronized
- Document new dependencies in each agent's parking bay

### 4. Testing Strategy
**Question:** Where should tests run?

**Options:**
a) Test in feature worktree before merge
b) Test in main worktree after merge
c) Both

**Recommendation:** Both
- Test in feature worktree during development
- Test in main worktree before push to origin

---

## Immediate Actions Needed

### Before Next Development Session

1. **Check Educational Worktree Status**
   ```bash
   cd /home/dachu/Documents/projects/worktrees/educational-content
   git status
   git log --oneline -5
   ```
   - Are there uncommitted changes?
   - Are there newer commits than master?
   - Should we merge back to master?

2. **Review Main Worktree**
   ```bash
   cd /home/dachu/Documents/projects/content-engine
   git status
   git log --oneline -5
   ```
   - Verify all educational changes are merged
   - Check if video director changes are committed
   - Review strategy consultant work

3. **Sync Package Dependencies**
   ```bash
   # In main worktree
   cd /home/dachu/Documents/projects/content-engine/packages/backend
   npm install

   # In educational worktree
   cd /home/dachu/Documents/projects/worktrees/educational-content/packages/backend
   npm install
   ```

4. **Document Decision**
   - Choose merge strategy (see options above)
   - Document in this file
   - Update team on approach

---

## Recommended Workflow Going Forward

### For New Agents (like Strategy Consultant)

**Step 1: Create Feature Branch (in main worktree)**
```bash
cd /home/dachu/Documents/projects/content-engine
git checkout -b feature/strategy-consultant
```

**Step 2: Develop Agent**
- Create new route file
- Create new service files
- Add types
- Update index.ts

**Step 3: Test in Feature Branch**
```bash
npm run dev
# Test endpoints
```

**Step 4: Merge to Master**
```bash
git checkout master
git merge feature/strategy-consultant
git push origin master
```

**Step 5: Update Other Worktrees**
```bash
cd /home/dachu/Documents/projects/worktrees/educational-content
git fetch origin
git merge origin/master  # Or rebase if preferred
```

### For Parallel Development

**If working on Education (worktree) AND Strategy (main):**

1. **Do education work in educational worktree**
2. **Do strategy work in main worktree**
3. **Merge education to main when stable**
4. **Then commit strategy work**
5. **Push all to origin**

---

## Files That Need Coordination

### High Coordination Needed
- `src/index.ts` - Route registrations
  - **Strategy:** Always merge all routes, never delete

- `package.json` - Dependencies
  - **Strategy:** Review before merge, keep all deps

### Medium Coordination
- `.env` - Environment variables
  - **Strategy:** Document new vars in parking bay

### Low Coordination (No Conflicts Expected)
- Individual route files (`strategy-consultant.ts`, `education.ts`)
- Individual service files (`peakflow.ts`, `manim-renderer.ts`)
- Scripts directory (different scripts per agent)

---

## Strategy Consultant Specific

### What Was Added
```
New files (no conflicts):
- src/routes/strategy-consultant.ts
- src/services/peakflow.ts
- src/services/powerpoint-generator.ts
- src/types/strategy.ts
- scripts/generate-powerpoint.py

Modified files (potential conflicts):
- src/index.ts (added route registration)
```

### Merge Safety
**Safe to merge because:**
- All new files (no overwrites)
- Single line change in index.ts (easy to merge)
- No package.json changes
- No .env changes
- No conflicts with educational system

### Integration Points
**When merging, ensure:**
- Keep all route imports in index.ts
- Keep all app.use() route registrations
- Test both /api/education and /api/strategy endpoints
- Verify python-pptx is installed (pip3 install python-pptx)

---

## Decision Log

### Decisions Needed
- [ ] Choose merge strategy (A, B, or C above)
- [ ] Define when to merge educational back to main
- [ ] Decide on testing approach
- [ ] Choose branch naming convention

### Decisions Made
- [x] Park Strategy Consultant for review
- [x] Document all work in parking bay
- [ ] (Add more as decisions are made)

---

## Next Steps

### Immediate (Before Next Code)
1. Review educational worktree status
2. Decide on merge strategy
3. Document decision here
4. Proceed with chosen approach

### Short Term (This Week)
1. Merge educational content if ready
2. Commit strategy consultant if approved
3. Sync all worktrees
4. Test integrated system

### Medium Term (This Month)
1. Establish clear workflow
2. Document in team guide
3. Set up CI/CD for testing
4. Create branch protection rules

---

## Resources

- **Parking Bay:** `PARKING-BAY-STRATEGY-CONSULTANT.md`
- **Architecture:** `STRATEGY-CONSULTANT-ARCHITECTURE.md`
- **Implementation:** `STRATEGY-CONSULTANT-COMPLETE.md`
- **Git Worktrees:** Main + Educational content worktree

---

**Status:** 🚦 REVIEW NEEDED
**Blocker:** None (can continue in either worktree)
**Impact:** Medium (affects development workflow)
**Urgency:** Medium (before next major feature)

**Review this before starting next development session!**
