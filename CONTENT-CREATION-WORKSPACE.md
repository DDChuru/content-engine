# Content Creation Workspace

A comprehensive AI-powered content creation system with image generation, management, and flexible content output options.

## Overview

The Content Creation Workspace provides a complete solution for creating professional content with AI-generated or uploaded images. It's designed to be both a standalone workspace and an embeddable component for various workflows.

## Image Generation Technology

Uses your **existing Gemini API setup** - the same `gemini-2.5-flash-image` model that powers your thumbnail generation feature. No additional configuration needed!

### Models Used:
- **`gemini-1.5-flash`**: For analyzing uploaded images
- **`gemini-2.5-flash-image`**: For generating new images from prompts

### Capabilities:
- **Text-to-image**: Direct generation from prompts
- **Image-to-image**: Upload reference + modifications
- **Follow-up refinements**: Iterative improvements
- **Professional quality**: Business and educational use

## Features

### 1. Image Generation & Management

#### Image Upload & Generation
- **Upload reference images** for image-to-image generation
- **Text-to-image generation** with AI prompts using Gemini
- **Follow-up refinements** - Iterate on generated images with additional prompts
- **Accept/Reject workflow** - Review images before saving

#### Image Gallery
- **Label & tag images** for easy organization
- **Search and filter** by labels, prompts, or tags
- **Image selection** for content creation
- **URL management** - Copy Firestore URLs for external use
- **Visual preview** with metadata overlay

### 2. Content Creation

#### AI-Powered Chat Interface
- **Conversational content generation** with Claude
- **Image references** - Reference selected images in your prompts
- **Conversation history** - Maintain context across messages
- **Real-time generation** with streaming support

#### Multiple Output Formats
1. **Reveal.js Presentations** - Interactive HTML slides with transitions
2. **Remotion Videos** - Programmatic React/TypeScript video compositions
3. **Plain HTML** - Clean, semantic HTML documents
4. **Annotation Tools** - Interactive markup and annotation interfaces

### 3. Flexible & Embeddable

The workspace can be embedded in various contexts:
- **Course creation** - Generate thumbnails, chapters, and course content
- **Standalone content** - General-purpose content generation
- **Tutorial/lesson creation** - Educational content with images
- **Marketing materials** - Promotional content with branded visuals

## Architecture

### Frontend Components

```
packages/frontend/
├── app/workspace/content-creation/
│   └── page.tsx                           # Main workspace page
├── components/
│   ├── content-creation-workspace.tsx     # Main workspace component
│   ├── image-generation-panel.tsx         # Image upload & generation
│   ├── image-gallery.tsx                  # Image management & selection
│   ├── content-creation-chat.tsx          # AI chat interface
│   ├── content-output-selector.tsx        # Output format selector
│   └── embeddable-content-creator.tsx     # Embeddable wrapper
```

### Backend API Routes

```
packages/backend/src/routes/
├── images.ts     # Image generation & storage
│   ├── POST /api/images/generate        # Generate images with Gemini
│   ├── POST /api/images/save            # Save to Firestore Storage
│   └── GET  /api/images/list            # List saved images
│
└── content.ts    # Content creation with image references
    ├── POST /api/content/create         # Create content with images
    └── POST /api/content/create-course  # Multi-chapter course creation
```

## Usage

### Accessing the Workspace

1. **From the main dashboard**: Click the "Content Workspace" button in the header
2. **Direct URL**: Navigate to `/workspace/content-creation`

### Basic Workflow

#### 1. Generate or Upload Images

```
Image Generation Tab:
1. Upload a reference image (optional)
2. Enter a descriptive prompt
3. Click "Generate Image"
4. Review the generated image
5. Add a label and tags
6. Accept or refine with follow-up prompts
7. Click "Accept & Save" to persist to Firestore
```

#### 2. Manage Your Images

```
Image Gallery:
- Search by label or prompt
- Filter by tags
- Select images for content creation
- Copy Firestore URLs
- Delete unwanted images
```

#### 3. Create Content

```
Content Creation Tab:
1. Review referenced images in the sidebar
2. Select desired output format
3. Describe the content you want to create
4. AI generates content with embedded images
5. Download or view in browser
6. Continue conversation to refine
```

### Example Use Cases

#### Creating a Course

```typescript
import EmbeddableContentCreator from '@/components/embeddable-content-creator';

function CourseBuilder() {
  return (
    <EmbeddableContentCreator
      context="course"
      defaultContentType="html-reveal"
      onContentCreated={(content) => {
        // Save to your course database
        saveCourseChapter(content);
      }}
    />
  );
}
```

#### Generating a Thumbnail

```typescript
<EmbeddableContentCreator
  context="thumbnail"
  simplified={true}
  height="400px"
  onContentCreated={(thumbnail) => {
    // Use the thumbnail URL
    setCourseThumbnail(thumbnail.url);
  }}
/>
```

#### Standalone Content Creation

```typescript
<EmbeddableContentCreator
  context="standalone"
  defaultContentType="plain-html"
/>
```

## API Integration

### Image Generation

**Endpoint**: `POST /api/images/generate`

**Request**:
```typescript
FormData {
  prompt: string;           // Text prompt for generation
  image?: File;            // Optional reference image
}
```

**Response**:
```typescript
{
  imageUrl: string;         // Generated image URL
  description: string;      // AI-generated description
  prompt: string;          // Original prompt
}
```

### Save Image

**Endpoint**: `POST /api/images/save`

**Request**:
```typescript
{
  imageUrl: string;         // Image data URL or URL
  label: string;           // User-defined label
  tags: string[];          // Tags for organization
  prompt: string;          // Generation prompt
  targetProject?: string;  // Firebase project (default: iclean)
}
```

**Response**:
```typescript
{
  id: string;              // Unique image ID
  firestoreUrl: string;    // Permanent storage URL
  success: boolean;
}
```

### Create Content

**Endpoint**: `POST /api/content/create`

**Request**:
```typescript
{
  prompt: string;                    // Content creation prompt
  contentType: string;              // Output format
  imageReferences: ImageRef[];      // Referenced images
  conversationHistory: Message[];   // Chat history
  targetProject?: string;           // Firebase project
}

interface ImageRef {
  id: string;
  url: string;
  label: string;
  prompt: string;
}
```

**Response**:
```typescript
{
  message: string;           // AI response
  artifact: {
    type: string;           // Content type
    url?: string;           // Firestore URL
    content: string;        // Generated content
  };
  usage: {                  // Token usage stats
    input_tokens: number;
    output_tokens: number;
  };
}
```

### Create Course

**Endpoint**: `POST /api/content/create-course`

**Request**:
```typescript
{
  title: string;
  description?: string;
  chapters: Array<{
    title: string;
    description?: string;
  }>;
  thumbnailImageId?: string;
  imageReferences?: ImageRef[];
  targetProject?: string;
}
```

**Response**:
```typescript
{
  message: string;
  artifact: {
    type: "Course";
    url?: string;           // Firestore URL
    content: string;        // Complete HTML
  };
  chapters: number;         // Chapter count
}
```

## Configuration

### Environment Variables

Required in `.env`:

```bash
# Gemini API for image generation
GEMINI_API_KEY=your_gemini_api_key

# Claude API for content generation
ANTHROPIC_API_KEY=your_claude_api_key

# Firebase projects (at least one required)
ICLEAN_FIREBASE_KEY='{"type":"service_account",...}'
```

### Firebase Storage Structure

```
storage/
├── images/
│   └── img_[timestamp].[ext]
├── content/
│   ├── html-reveal-[timestamp].html
│   ├── remotion-video-[timestamp].tsx
│   └── plain-html-[timestamp].html
└── courses/
    └── [course-slug]-[timestamp].html
```

### Firestore Collections

```
firestore/
├── generated_images/
│   └── {
│       id: string,
│       label: string,
│       tags: string[],
│       prompt: string,
│       url: string,
│       createdAt: string
│     }
├── generated_content/
│   └── {
│       type: string,
│       prompt: string,
│       imageReferences: array,
│       url: string,
│       createdAt: string
│     }
└── courses/
    └── {
        title: string,
        description: string,
        chapters: array,
        url: string,
        createdAt: string
      }
```

## Advanced Features

### Image-to-Image Generation

Upload a reference image and provide a transformation prompt:

```
Reference: [Upload existing logo]
Prompt: "Make it more modern with gradient colors and 3D effects"
```

### Multi-Image Content

Select multiple images from the gallery and reference them in your prompt:

```
"Create a Reveal.js presentation about our product features.
Use 'Product Screenshot' for slide 2, 'Team Photo' for slide 5,
and 'Office Building' for the final slide."
```

### Course Creation Workflow

1. Generate thumbnail image
2. Save and label it
3. Generate chapter images
4. Switch to Content Creation tab
5. Select all relevant images
6. Use `/api/content/create-course` for structured output

### Content Refinement

Continue the conversation to refine generated content:

```
User: "Create a lesson about photosynthesis"
AI: [Generates HTML lesson]
User: "Add more visual diagrams and simplify the language"
AI: [Updates content]
User: "Perfect! Now add a quiz at the end"
AI: [Adds interactive quiz]
```

## Customization

### Adding New Output Formats

1. Add to `ContentOutputSelector` component:
```typescript
{
  type: 'custom-format' as const,
  label: 'Custom Format',
  description: 'Your custom output',
  icon: CustomIcon,
  color: 'from-color-to-color'
}
```

2. Update backend handler in `content.ts`:
```typescript
case 'custom-format':
  systemPrompt = `Your custom instructions...`;
  outputFormat = 'Custom Format';
  break;
```

### Custom Image Generation Provider

Replace Gemini with your preferred provider in `images.ts`:

```typescript
// Instead of Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use your provider
const imageService = new YourImageProvider(process.env.YOUR_API_KEY!);
const result = await imageService.generate(prompt);
```

## Troubleshooting

### Images not generating
- Check `GEMINI_API_KEY` in `.env`
- Verify API quotas and billing
- Check browser console for errors

### Content not saving to Firebase
- Verify Firebase service account keys
- Check Firebase Storage rules
- Ensure target project is initialized

### Images not appearing in gallery
- Check Firestore save operation
- Verify image URL format (data URL vs. HTTP)
- Check browser network tab for failed uploads

## Future Enhancements

- [ ] Batch image generation
- [ ] Image editing tools (crop, resize, filters)
- [ ] Template library for common content types
- [ ] Version history for generated content
- [ ] Collaborative editing
- [ ] Export to multiple formats simultaneously
- [ ] AI-powered image recommendations
- [ ] Integration with stock photo APIs
- [ ] Custom branding and themes
- [ ] Analytics and usage tracking

## Contributing

When adding new features to the content creation workspace:

1. Keep components modular and reusable
2. Maintain the embeddable architecture
3. Add comprehensive TypeScript types
4. Update this documentation
5. Test across different contexts (course, standalone, etc.)
6. Ensure Firebase integration works correctly

## Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with**: React, Next.js, Claude AI, Gemini AI, Firebase, Tailwind CSS
