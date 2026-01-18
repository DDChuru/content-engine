# Educational Content Studio - Quick Start Implementation Guide

This guide provides all the code needed to build the Educational Content Studio UI, step by step.

## ✅ What We've Completed

1. Architecture document (`EDUCATION-STUDIO-ARCHITECTURE.md`)
2. Custom CSS styles (`packages/frontend/app/education.css`)
3. Framer Motion installed

## 🚀 Implementation Steps

### Step 1: Create Education Directory Structure

```bash
cd packages/frontend/app
mkdir -p education/{lessons,render,settings,components}
mkdir -p components/education
```

### Step 2: Create Education Layout

**File:** `packages/frontend/app/education/layout.tsx`

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, BookOpen, Play, Settings, Sparkles, Film,
  FileText, Layers
} from 'lucide-react';
import '../education.css';

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--edu-bg-app)', fontFamily: 'var(--edu-font)' }}>
      {/* Sidebar */}
      <aside className="edu-sidebar">
        {/* Logo */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--edu-primary), var(--edu-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--edu-primary-glow)'
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0 }}>
            Edu<span className="edu-gradient-text">Studio</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <Link href="/education" className={`edu-nav-item ${isActive('/education') && !pathname?.includes('/lessons') && !pathname?.includes('/render') && !pathname?.includes('/settings') ? 'active' : ''}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <div className="edu-nav-section">Create</div>

          <Link href="/education/lessons" className={`edu-nav-item ${isActive('/education/lessons') ? 'active' : ''}`}>
            <BookOpen size={20} />
            <span>My Lessons</span>
          </Link>

          <Link href="/education/lessons/new" className={`edu-nav-item ${isActive('/education/lessons/new') ? 'active' : ''}`}>
            <Layers size={20} />
            <span>New Lesson</span>
          </Link>

          <div className="edu-nav-section">Production</div>

          <Link href="/education/render" className={`edu-nav-item ${isActive('/education/render') ? 'active' : ''}`}>
            <Play size={20} />
            <span>Render Queue</span>
          </Link>

          <button className="edu-nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <Film size={20} />
            <span>Remotion Studio</span>
          </button>

          <div className="edu-nav-section">Tools</div>

          <button className="edu-nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <FileText size={20} />
            <span>Lesson Notes</span>
          </button>
        </nav>

        {/* Settings at bottom */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--edu-border-light)' }}>
          <Link href="/education/settings" className={`edu-nav-item ${isActive('/education/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="edu-main">
        {children}
      </main>
    </div>
  );
}
```

### Step 3: Create Dashboard Page

**File:** `packages/frontend/app/education/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Play, DollarSign, Plus, ArrowRight,
  Clock, CheckCircle, Layers, Film, Zap
} from 'lucide-react';
import Link from 'next/link';

// Mock data - Replace with API calls
const MOCK_LESSONS = [
  {
    id: 'sets-lesson',
    title: 'Introduction to Sets',
    subtitle: 'Understanding Collections and Relationships',
    duration: '3m 15s',
    scenes: 13,
    status: 'completed',
    thumbnail: '/education/sets-thumbnail.png',
    lastModified: '2025-11-23T11:01:55',
    cost: '$0.00'
  },
  {
    id: 'trig-basics',
    title: 'Trigonometry Basics',
    subtitle: 'Sine, Cosine, and Tangent',
    duration: '4m 30s',
    scenes: 15,
    status: 'draft',
    thumbnail: '/education/trig-thumbnail.png',
    lastModified: '2025-11-22T14:23:12',
    cost: '$1.20'
  }
];

const STATS = {
  totalLessons: 12,
  rendering: 0,
  completed: 10,
  totalCost: '$15.23',
  totalDuration: '45m 30s'
};

export default function EducationDashboard() {
  const [remotionStatus, setRemotionStatus] = useState<'stopped' | 'running'>('stopped');

  const startRemotionStudio = async () => {
    // TODO: Call API to start Remotion Studio
    setRemotionStatus('running');
    window.open('http://localhost:3000', '_blank');
  };

  return (
    <div className="edu-container">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
          Welcome back, <span className="edu-gradient-text">Educator</span>
        </h1>
        <p className="edu-text-muted">Ready to create world-class educational content?</p>
      </motion.header>

      {/* Stats Grid */}
      <div className="edu-grid-4" style={{ marginBottom: '40px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="edu-stat-card"
        >
          <div className="edu-stat-icon">
            <BookOpen size={24} color="white" />
          </div>
          <div className="edu-stat-content">
            <div className="edu-stat-label">Total Lessons</div>
            <div className="edu-stat-value">{STATS.totalLessons}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="edu-stat-card"
        >
          <div className="edu-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <CheckCircle size={24} color="white" />
          </div>
          <div className="edu-stat-content">
            <div className="edu-stat-label">Completed</div>
            <div className="edu-stat-value">{STATS.completed}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="edu-stat-card"
        >
          <div className="edu-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Clock size={24} color="white" />
          </div>
          <div className="edu-stat-content">
            <div className="edu-stat-label">Total Duration</div>
            <div className="edu-stat-value">{STATS.totalDuration}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="edu-stat-card"
        >
          <div className="edu-stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            <DollarSign size={24} color="white" />
          </div>
          <div className="edu-stat-content">
            <div className="edu-stat-label">Total Cost</div>
            <div className="edu-stat-value">{STATS.totalCost}</div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Quick Actions</h2>
      <div className="edu-grid-3" style={{ marginBottom: '48px' }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="edu-glass-panel"
          style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', cursor: 'pointer' }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--edu-primary)'
          }}>
            <Plus size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>Create New Lesson</h3>
            <p className="edu-text-muted edu-text-small">Build a new educational module from scratch</p>
          </div>
          <Link href="/education/lessons/new" className="edu-btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
            Get Started <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="edu-glass-panel"
          style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', cursor: 'pointer' }}
          onClick={startRemotionStudio}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(236, 72, 153, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--edu-accent)'
          }}>
            <Film size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>Remotion Studio</h3>
            <p className="edu-text-muted edu-text-small">Edit compositions in visual studio</p>
          </div>
          <button className="edu-btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {remotionStatus === 'running' ? 'Open Studio' : 'Start Studio'} <Zap size={16} />
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="edu-glass-panel"
          style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', cursor: 'pointer' }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--edu-success)'
          }}>
            <Play size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>Render Queue</h3>
            <p className="edu-text-muted edu-text-small">View render progress and downloads</p>
          </div>
          <Link href="/education/render" className="edu-btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
            View Queue <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Recent Lessons */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Recent Lessons</h2>
      <div className="edu-grid-2" style={{ marginBottom: '40px' }}>
        {MOCK_LESSONS.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="edu-card"
            style={{ cursor: 'pointer' }}
          >
            {/* Thumbnail placeholder */}
            <div style={{
              width: '100%',
              height: '200px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              {lesson.title}
            </div>

            <div className="edu-card-header">
              <h3 className="edu-card-title">{lesson.title}</h3>
              <span className={`edu-badge ${lesson.status === 'completed' ? 'edu-badge-success' : 'edu-badge-warning'}`}>
                {lesson.status}
              </span>
            </div>

            <p className="edu-text-muted edu-text-small" style={{ marginBottom: '16px' }}>
              {lesson.subtitle}
            </p>

            <div className="edu-card-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> {lesson.duration}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> {lesson.scenes} scenes
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} /> {lesson.cost}
              </span>
            </div>

            <div className="edu-flex-between" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--edu-border-light)' }}>
              <button className="edu-btn-secondary edu-text-small" style={{ padding: '8px 16px' }}>
                Edit
              </button>
              <button className="edu-btn-primary edu-text-small" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Open Studio <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Create Supporting Pages

Create empty placeholder pages to complete the routing:

**File:** `packages/frontend/app/education/lessons/page.tsx`

```typescript
'use client';

import React from 'react';

export default function LessonsPage() {
  return (
    <div className="edu-container">
      <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>My Lessons</h1>
      <p className="edu-text-muted">All your educational content in one place</p>
      {/* TODO: Add lessons list */}
    </div>
  );
}
```

**File:** `packages/frontend/app/education/lessons/new/page.tsx`

```typescript
'use client';

import React from 'react';

export default function NewLessonPage() {
  return (
    <div className="edu-container">
      <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Create New Lesson</h1>
      <p className="edu-text-muted">Build your educational content step by step</p>
      {/* TODO: Add lesson builder form */}
    </div>
  );
}
```

**File:** `packages/frontend/app/education/render/page.tsx`

```typescript
'use client';

import React from 'react';

export default function RenderQueuePage() {
  return (
    <div className="edu-container">
      <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Render Queue</h1>
      <p className="edu-text-muted">Manage your video rendering jobs</p>
      {/* TODO: Add render queue */}
    </div>
  );
}
```

**File:** `packages/frontend/app/education/settings/page.tsx`

```typescript
'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="edu-container">
      <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Settings</h1>
      <p className="edu-text-muted">Configure your studio environment</p>
      {/* TODO: Add settings form */}
    </div>
  );
}
```

### Step 5: Update Globals CSS

Add the education CSS import to your global styles:

**File:** `packages/frontend/app/globals.css`

Add this line at the top:

```css
@import './education.css';
```

### Step 6: Test the UI

1. **Start the frontend dev server:**
   ```bash
   cd packages/frontend
   npm run dev
   ```

2. **Open your browser:**
   ```
   http://localhost:3000/education
   ```

You should now see the Educational Content Studio dashboard with:
- Glass morphism dark theme
- Sidebar navigation
- Stats cards with animations
- Quick action cards
- Recent lessons grid

## 🎨 Customization

### Change Colors

Edit `packages/frontend/app/education.css`:

```css
:root {
  --edu-primary: #6366f1;   /* Your brand color */
  --edu-accent: #ec4899;    /* Accent color */
}
```

### Add Your Logo

Replace the Sparkles icon in `layout.tsx`:

```typescript
<img src="/your-logo.png" alt="Logo" style={{ width: '40px', height: '40px' }} />
```

## 🚀 Next Steps

### Phase 1: Backend Integration

Create backend API routes to handle:
- Lesson CRUD operations
- Manim scene generation
- Remotion Studio management
- Render queue processing

**File:** `packages/backend/src/routes/education.ts`

```typescript
import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

// Start Remotion Studio
router.post('/remotion/start-studio', async (req, res) => {
  const studio = spawn('npx', ['remotion', 'preview', 'src/remotion/Root.tsx'], {
    cwd: process.cwd(),
    detached: true
  });

  res.json({ status: 'starting', port: 3000 });
});

// Get lesson list
router.get('/lessons', async (req, res) => {
  // TODO: Fetch from database/filesystem
  res.json({ lessons: [] });
});

// Create new lesson
router.post('/lessons', async (req, res) => {
  // TODO: Save lesson data
  res.json({ id: 'new-lesson-id' });
});

export default router;
```

Add to `packages/backend/src/index.ts`:

```typescript
import educationRoutes from './routes/education';
app.use('/api/education', educationRoutes);
```

### Phase 2: Add More Pages

1. **Lesson Builder** - Complete form for creating lessons
2. **Studio Integration** - Embedded Remotion Studio iframe
3. **Render Manager** - Live progress tracking with Socket.io
4. **Lesson Viewer** - Display lesson notes and questions

### Phase 3: State Management

Add React Context for global state:

**File:** `packages/frontend/lib/contexts/EducationContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useState } from 'react';

interface EducationContextType {
  lessons: any[];
  refreshLessons: () => Promise<void>;
}

const EducationContext = createContext<EducationContextType | null>(null);

export function EducationProvider({ children }: { children: React.ReactNode }) {
  const [lessons, setLessons] = useState([]);

  const refreshLessons = async () => {
    const res = await fetch('/api/education/lessons');
    const data = await res.json();
    setLessons(data.lessons);
  };

  return (
    <EducationContext.Provider value={{ lessons, refreshLessons }}>
      {children}
    </EducationContext.Provider>
  );
}

export const useEducation = () => {
  const context = useContext(EducationContext);
  if (!context) throw new Error('useEducation must be used within EducationProvider');
  return context;
};
```

## 📚 Resources

- **Architecture:** `EDUCATION-STUDIO-ARCHITECTURE.md` - Complete system design
- **Styles:** `packages/frontend/app/education.css` - All CSS classes
- **Components:** See architecture doc for full component list
- **API Spec:** See architecture doc for API endpoints

## ✅ Success Checklist

- [ ] Frontend displays at `http://localhost:3000/education`
- [ ] Sidebar navigation works
- [ ] Dashboard shows stats and lessons
- [ ] Animations run smoothly (Framer Motion)
- [ ] Glass morphism effects visible
- [ ] "Create New Lesson" button navigates correctly
- [ ] All placeholder pages accessible

## 🆘 Troubleshooting

**Issue:** Styles not loading
- **Fix:** Ensure `@import './education.css';` is in `globals.css`

**Issue:** Navigation not working
- **Fix:** Check that all page.tsx files exist in correct directories

**Issue:** Framer Motion errors
- **Fix:** Ensure `framer-motion` is installed: `npm install framer-motion`

---

**Status:** Core UI Complete ✅
**Next:** Integrate backend API and add remaining pages
**Time to Functional:** ~2 hours (backend integration)
