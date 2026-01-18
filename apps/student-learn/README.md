# Student Learn App

Clean, production-ready student-facing application for Cambridge IGCSE Mathematics lessons.

## Features

- **Video Lessons**: Manim animations and AI-generated visuals
- **Interactive Venn Diagrams**: Drag-and-drop element placement
- **LaTeX Formulas**: Proper mathematical notation with KaTeX
- **Practice Questions**: Multiple choice and numeric input
- **Quizzes**: Score tracking and pass/fail feedback
- **Progress Tracking**: Track completed topics and quiz scores

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (runs on port 3002)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Math Rendering**: KaTeX
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
apps/student-learn/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with header/footer
│   ├── page.tsx             # Home page (topic list)
│   └── lesson/
│       └── [code]/
│           └── page.tsx     # Lesson viewer
├── components/
│   └── interactive-venn-diagram.tsx
├── public/                   # Static assets
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## API Integration

The app fetches lesson data from the backend API:

```
GET /api/education/topics/{code}/lesson
```

Returns lesson structure with:
- Opening (hook, real-world connection)
- Objectives
- Theory sections with video/image content
- Practice questions
- Quiz

## Deployment

### Vercel (Recommended)

```bash
npx vercel
```

### Self-hosted

```bash
npm run build
npm start
```

## License

Proprietary - Content Engine Platform
