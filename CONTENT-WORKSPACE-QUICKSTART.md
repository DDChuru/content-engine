# Content Creation Workspace - Quick Start

## ✅ What's Already Configured

You don't need to set up anything new! The workspace uses your **existing API keys** that are already working:

- ✅ **Gemini API** (`GEMINI_API_KEY`) - Same as thumbnail generation
- ✅ **Claude API** (`ANTHROPIC_API_KEY`) - Same as chat interface
- ✅ **Firebase Projects** - All your existing projects (iClean, HACCP, Math, PeakFlow, ACS)

## 🚀 Getting Started

### 1. Access the Workspace

From the main dashboard, click the **"Content Workspace"** button (purple gradient button in the header).

Or navigate directly to: `http://localhost:3000/workspace/content-creation`

### 2. Generate Your First Image

**Image Generation Tab (Left Side):**

```
1. Enter a prompt: "Modern office workspace with laptop and coffee"
2. Click "Generate Image"
3. Wait ~3-5 seconds for Gemini to generate
4. Review the image
5. Add label: "Office Background"
6. Add tags: "office", "workspace", "modern"
7. Click "Accept & Save"
```

**Or upload a reference image:**

```
1. Click to upload an existing image
2. Add prompt: "Make it brighter and add soft shadows"
3. Generate
4. Gemini will analyze and regenerate
```

### 3. Create Content with Images

**Content Creation Tab (Right Side):**

```
1. Your saved images appear in the left sidebar
2. Click to select images you want to reference
3. Choose output format (Reveal.js, Remotion, HTML, etc.)
4. Type your content request:
   "Create a Reveal.js presentation about productivity.
    Use 'Office Background' as the title slide background."
5. Click Send
6. Claude generates content with your images embedded
```

## 🎯 Common Workflows

### Create a Course Thumbnail

```
1. Go to Image Generation tab
2. Prompt: "Professional course thumbnail for 'Introduction to Python',
   blue gradient background, modern tech aesthetic"
3. Generate → Label: "Python Course Thumbnail" → Save
4. Copy the Firestore URL to use in your course metadata
```

### Generate Chapter Content

```
1. Generate/upload relevant images first
2. Switch to Content Creation tab
3. Select all chapter images
4. Prompt: "Create chapter content for 'Variables and Data Types'
   with code examples. Use 'Code Screenshot' and 'Diagram' images."
5. Choose HTML or Reveal.js output
6. Generate and download
```

### Create a Full Presentation

```
1. Generate 5-6 images for different slides
2. Label them clearly: "Intro", "Problem", "Solution", etc.
3. Select all in Content Creation
4. Choose "Reveal.js Presentation"
5. Prompt: "Create a 10-slide presentation about [topic].
   Use these images in order: Intro → Problem → Solution..."
```

## 🔧 API Endpoints (Already Working)

Your backend already has these routes configured:

```bash
# Generate images
POST http://localhost:3001/api/images/generate
  - Text-to-image with Gemini
  - Image-to-image transformations

# Save images
POST http://localhost:3001/api/images/save
  - Persist to Firebase Storage
  - Save metadata to Firestore

# Create content
POST http://localhost:3001/api/content/create
  - Generate with Claude
  - Embed referenced images
  - Multiple output formats

# Create courses
POST http://localhost:3001/api/content/create-course
  - Multi-chapter generation
  - Structured course output
```

## 📊 How It Uses Your Existing Setup

### Thumbnail Generation (Already Working)
```typescript
// packages/backend/src/routes/generate.ts
POST /api/generate/thumbnail
  ↓
ContentGenerator.generateThumbnail()
  ↓
Uses: gemini-2.5-flash-image
```

### New Image Generation (Same Model!)
```typescript
// packages/backend/src/routes/images.ts
POST /api/images/generate
  ↓
Uses: gemini-2.5-flash-image (SAME!)
  ↓
Returns: Base64 image + metadata
```

### Content Creation (Uses Claude)
```typescript
// packages/backend/src/routes/content.ts
POST /api/content/create
  ↓
ClaudeService.generateContent()
  ↓
Embeds: Your generated images
```

## 🎨 Example: Complete Workflow

Let's create a mini-course about "Clean Code Principles":

### Step 1: Generate Images (5 minutes)

```
Image 1: "Clean Code book cover, professional"
  Label: "Course Thumbnail"
  Tags: clean-code, course

Image 2: "Code editor showing messy vs clean code side by side"
  Label: "Before After Comparison"
  Tags: comparison, code-quality

Image 3: "Software developer refactoring code"
  Label: "Refactoring Hero"
  Tags: developer, refactoring

Image 4: "Code review checklist"
  Label: "Review Checklist"
  Tags: checklist, review
```

### Step 2: Create Course Structure

Switch to **Content Creation** tab:

```
Select all 4 images
Choose: Reveal.js Presentation

Prompt:
"Create a comprehensive presentation about Clean Code Principles.

Structure:
- Slide 1: Title with 'Course Thumbnail' image
- Slide 2-3: Introduction to clean code importance
- Slide 4: Before/After examples using 'Before After Comparison'
- Slide 5-7: Key principles (naming, functions, comments)
- Slide 8: Refactoring demonstration with 'Refactoring Hero'
- Slide 9: Best practices checklist using 'Review Checklist'
- Slide 10: Summary and resources

Include code examples and make it interactive."

Generate → Download HTML → Deploy!
```

### Step 3: Create Chapter Content

For detailed chapter content:

```
Prompt:
"Create detailed HTML content for Chapter 3: Function Best Practices.
Include:
- Introduction paragraph
- 5 key principles with code examples
- Common anti-patterns to avoid
- Refactoring exercise
- Quiz questions

Use professional styling and embed relevant images."

Generate → Save to Firebase → Link in your course platform
```

## 💡 Pro Tips

### 1. Batch Generate Images First
Generate all images you need in one session, then create content.

### 2. Use Descriptive Labels
"Chapter 3 Hero Image" is better than "Image 1"

### 3. Tag Strategically
Tags like "chapter-3", "diagram", "code-example" help filter later

### 4. Reference Images by Label
In prompts, use exact labels: "Use 'Office Background' for title slide"

### 5. Iterate with Follow-ups
Don't like the generated image? Use follow-up prompts to refine

### 6. Save Firestore URLs
Copy image URLs for use in external systems or direct embedding

## 🔄 Integration with Existing Features

### With Chat Interface
```
Main page chat → generates text content
Content Workspace → adds visuals to that content
```

### With ACS Workspace
```
ACS → work instructions with photos
Content Workspace → create training materials using those photos
```

### With Generation Panel
```
Generation Panel → structured forms
Content Workspace → flexible, conversational creation
```

## 🐛 Troubleshooting

### "Image generation failed"
- Check backend console for Gemini API errors
- Verify `GEMINI_API_KEY` in `.env`
- Check API quotas at https://aistudio.google.com/

### "Cannot save to Firebase"
- Verify Firebase project key is valid
- Check Firebase Storage rules allow writes
- Ensure target project is initialized

### "Images not showing in gallery"
- Check browser console for errors
- Verify image was saved (check Firebase console)
- Try refreshing the page

### Backend not responding
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Restart backend
cd packages/backend
npm run dev
```

## 📚 Next Steps

Once comfortable with the basics:

1. **Embed in custom workflows** using `EmbeddableContentCreator`
2. **Create templates** for common content types
3. **Build course creation flow** with systematic image + content generation
4. **Integrate with Remotion** for video generation
5. **Add custom output formats** for your specific needs

## 🎓 Learning Resources

- **Full Documentation**: `CONTENT-CREATION-WORKSPACE.md`
- **API Reference**: Same doc, "API Integration" section
- **Example Code**: Check components in `packages/frontend/components/`
- **Backend Code**: `packages/backend/src/routes/images.ts` and `content.ts`

---

**Ready to create?** Click that purple "Content Workspace" button and start generating! 🚀
