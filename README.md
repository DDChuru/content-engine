# Content Engine Cloud 🚀

AI-powered content generation platform with Claude intelligence, Firebase integration, and cloud deployment.

## Overview

Content Engine Cloud is a production-ready platform that combines:
- **Claude AI** for intelligent content understanding and generation
- **User Journey Agent** for codebase analysis and documentation
- **Gemini Flash Image** for professional thumbnail generation
- **Multi-Firebase** integration for direct deployment to your apps
- **GitHub Integration** for repository analysis

## Architecture

```
┌─────────────────┐
│   Frontend      │ (Next.js - Vercel)
│   Chat UI       │
└────────┬────────┘
         │ REST API
┌────────▼────────┐
│   Backend API   │ (Express - Railway/Render)
│                 │
├── Claude AI     │ (Content Intelligence)
├── Gemini API    │ (Image Generation)
├── GitHub API    │ (Repo Access)
└── Firebase×4    │ (Multi-Project Storage)
```

## Features

### 🤖 AI-Powered Generation
- User manuals from codebases
- Standard Operating Procedures (SOPs)
- Educational lessons with exercises
- Training materials
- Professional thumbnails

### 🔥 Firebase Integration
- Direct deployment to multiple Firebase projects
- Automatic Firestore document creation
- Firebase Storage for images
- Real-time sync with production apps

### 💬 Claude Chat Interface
- Natural language content requests
- Tool-based generation workflow
- Context-aware responses
- Conversation history

### 📊 Multi-Project Support
- iClean VX (HACCP/Food Safety)
- Educational Math Platform
- PeakFlow (Accounting)
- Custom projects

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your/content-engine-cloud.git
cd content-engine-cloud
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys:
# - ANTHROPIC_API_KEY (required)
# - GEMINI_API_KEY (required)
# - GITHUB_TOKEN (optional)
# - Firebase service accounts (optional)
```

### 3. Run Development

```bash
# Start both backend and frontend
npm run dev

# Or separately:
npm run dev:backend  # Port 3001
npm run dev:frontend # Port 3000
```

### 4. Test the API

```bash
# Health check
curl http://localhost:3001/api/health

# Generate user manual
curl -X POST http://localhost:3001/api/generate/user-manual \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/user/repo",
    "features": ["Auth", "Dashboard"],
    "title": "My App Manual"
  }'

# Chat with Claude
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Generate a user manual for PeakFlow"}
    ]
  }'
```

## API Endpoints

### Health & Status
- `GET /api/health` - Server health check
- `GET /api/health/firebase` - Firebase connections status
- `GET /api/health/apis` - API keys status

### Content Generation
- `POST /api/generate/user-manual` - Generate user manual
- `POST /api/generate/sop` - Generate SOP
- `POST /api/generate/lesson` - Generate educational lesson
- `POST /api/generate/training` - Generate training material
- `POST /api/generate/thumbnail` - Generate thumbnail image

### Chat Interface
- `POST /api/chat/message` - Send message to Claude
- `POST /api/chat/analyze-intent` - Analyze user intent

### Firebase Management
- `GET /api/firebase/projects` - List Firebase projects
- `POST /api/firebase/projects/:name/firestore/:collection` - Save document
- `GET /api/firebase/projects/:name/firestore/:collection/:id` - Read document
- `POST /api/firebase/projects/:name/storage/upload` - Upload file

## Deployment

### Backend (Railway/Render)

```bash
# Railway
railway login
railway link
railway up

# Or Render
# Push to GitHub and connect via Render dashboard
```

### Frontend (Vercel)

```bash
vercel deploy --prod
```

### Environment Variables (Production)

Set these in your deployment platform:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxx
GEMINI_API_KEY=AIzaSyxxx
GITHUB_TOKEN=ghp_xxx
FRONTEND_URL=https://your-app.vercel.app

# Firebase keys (optional)
ICLEAN_FIREBASE_KEY='{"type":"service_account",...}'
HACCP_FIREBASE_KEY='{"type":"service_account",...}'
MATH_FIREBASE_KEY='{"type":"service_account",...}'
PEAKFLOW_FIREBASE_KEY='{"type":"service_account",...}'
```

## Cost Breakdown

- **Claude API**: ~$20/month (depends on usage)
- **Gemini API**: ~$0.05 per thumbnail
- **Railway/Render**: $5-10/month
- **Vercel**: FREE (frontend)
- **Firebase**: FREE tier or $25/month Blaze
- **Total**: ~$25-50/month

## Project Structure

```
content-engine-cloud/
├── packages/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   │   ├── agents/   # User Journey Agent
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── services/ # Claude, Firebase, GitHub
│   │   │   └── index.ts  # Main server
│   │   └── package.json
│   │
│   ├── frontend/         # Next.js chat UI
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   └── package.json
│   │
│   └── shared/           # Shared types/utils
│       └── package.json
│
├── .env.example          # Environment template
├── package.json          # Workspace root
└── README.md
```

## Use Cases

### 1. Generate User Manual from GitHub

```javascript
// Request
POST /api/generate/user-manual
{
  "repoUrl": "https://github.com/dachu/peakflow",
  "features": ["Companies", "Reports", "Cash-Flow"],
  "title": "PeakFlow User Manual",
  "subtitle": "Cloud Accounting Platform",
  "targetProject": "peakflow"  // Optional: save to Firebase
}

// Response
{
  "success": true,
  "html": "<html>...</html>",
  "thumbnailUrl": "https://storage.googleapis.com/...",
  "firebaseDocId": "abc123",
  "metadata": {
    "slideCount": 11,
    "duration": 29.7,
    "estimatedCost": 0.05
  }
}
```

### 2. Chat with Claude

```javascript
// Natural language request
POST /api/chat/message
{
  "messages": [
    {
      "role": "user",
      "content": "Create a hand washing SOP for kitchen staff"
    }
  ]
}

// Claude understands and generates
{
  "response": { ... },
  "toolUsed": "generate_sop",
  "toolResult": {
    "success": true,
    "content": "# Hand Washing SOP\n\n## Purpose...",
    "firebaseDocId": "xyz789"
  }
}
```

## Security

- API keys stored as environment variables
- Firebase service accounts for secure access
- CORS configured for frontend URL
- Rate limiting recommended for production
- Input validation with Zod schemas

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT

## Support

For issues or questions:
- GitHub Issues: [Create Issue](https://github.com/your/content-engine-cloud/issues)
- Documentation: [/docs](./docs)

## Acknowledgments

- Claude AI by Anthropic
- Gemini by Google
- Firebase by Google
- Built with Node.js, Express, and Next.js

---

Built with ❤️ for automated content generation