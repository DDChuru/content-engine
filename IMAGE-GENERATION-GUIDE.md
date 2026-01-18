# Image Generation Guide

## Overview

The Content Workspace supports AI-powered image generation and refinement using **Google Gemini's `gemini-2.5-flash-image` model**.

## Dynamic Mode Detection

The API **automatically determines** the generation mode based on what you send in each request. There is no enforced workflow - you can start with any combination:

### 1. Text-to-Image (Text Only)

Generate a brand new image from a text description alone.

**When it triggers:** You send a `prompt` without any image.

**How it works:**
```
User Input: "Modern office workspace with laptop and coffee"
          ↓
      Gemini API
          ↓
    Generated Image
```

**API Request Format:**
```typescript
POST /api/images/generate
Content-Type: multipart/form-data

{
  prompt: "Modern office workspace with laptop and coffee"
}
```

**Backend Implementation:**
```typescript
// Text-to-image: Send prompt as string
contents = `${prompt}

Requirements:
- High quality, professional design
- Clear composition and good contrast
- Suitable for business/educational use
- Modern and clean aesthetic`;

const result = await model.generateContent(contents);
```

### 2. Image-to-Image (Image + Text)

Transform or modify an image based on text instructions. Works with uploaded references OR previously generated images.

**When it triggers:** You send both a `prompt` AND an `image` file.

**Use cases:**
- "Here's my logo, make it more modern"
- "Take this image and make it brighter"
- Iterative refinement of generated images
- Starting with a reference image and text description

**How it works:**
```
Image + Text Prompt: "Make it brighter and add soft shadows"
          ↓
   Gemini API (with image context)
          ↓
    Transformed Image
```

**API Request Format:**
```typescript
POST /api/images/generate
Content-Type: multipart/form-data

{
  prompt: "Make it brighter and add soft shadows",
  image: File // The image file (uploaded or previous generation)
}
```

**Backend Implementation** (Based on [Google Gemini Docs](https://ai.google.dev/gemini-api/docs/image-generation)):
```typescript
// Image-to-image: Send array with text + image data
contents = [
  {
    text: "Make it brighter and add soft shadows"
  },
  {
    inlineData: {
      mimeType: "image/png",
      data: base64ImageData  // Image in base64
    }
  }
];

const result = await model.generateContent(contents);
```

### 3. Image Enhancement (Image Only)

Enhance an image without specific instructions - applies professional improvements automatically.

**When it triggers:** You send an `image` file without any prompt.

**Use cases:**
- "Enhance this image" (automatic improvements)
- Quick quality boost without specific instructions
- Professional touch-ups

**How it works:**
```
Image (no prompt)
          ↓
   Gemini API (with default enhancement prompt)
          ↓
    Enhanced Image
```

**API Request Format:**
```typescript
POST /api/images/generate
Content-Type: multipart/form-data

{
  image: File // Just the image, no prompt
}
```

**Backend Implementation:**
```typescript
// Image enhancement: Uses default improvement prompt
contents = [
  {
    text: "Enhance this image with improved quality, better lighting, and professional styling"
  },
  {
    inlineData: {
      mimeType: uploadedImage.mimetype,
      data: base64ImageData
    }
  }
];

const result = await model.generateContent(contents);
```

## User Workflow

### Flexible Starting Points

You can start your workflow in **any of these ways** - the API dynamically detects what you're trying to do:

#### Option A: Start with Text Only
1. Enter a prompt describing what you want
2. Click "Generate Image"
3. Gemini creates from scratch → **Text-to-Image mode**

#### Option B: Start with Image + Text
1. Upload a reference image
2. Describe how you want to modify it
3. Click "Generate Image"
4. Gemini transforms based on your image and prompt → **Image-to-Image mode**

#### Option C: Start with Image Only
1. Upload an image
2. Leave prompt empty
3. Click "Generate Image"
4. Gemini applies automatic enhancements → **Image Enhancement mode**

### Example Workflow

1. **Enter a prompt** (or upload an image, or both!)
   ```
   "Professional course thumbnail for Python programming,
    blue gradient background, modern tech aesthetic"
   ```

2. **Click "Generate Image"**
   - API detects the mode based on your input
   - Gemini processes the request
   - Returns base64 encoded image with mode indicator
   - Displays in the UI (~3-5 seconds)

3. **Review the image**
   - If satisfied → Add label, tags, and click "Accept & Save"
   - If not → Use refinement prompts (see below)

### Iterative Refinement

Once you have an image (generated or uploaded), you can refine it multiple times:

1. **See the blue "Refine This Image" section** below the generated image

2. **Describe specific changes** in the refinement input:
   ```
   Examples:
   - "Make it brighter"
   - "Add soft shadows"
   - "Change to warmer colors"
   - "Remove the background"
   - "Add more contrast"
   ```

3. **Click "Refine"** or press Enter
   - Sends the current image + refinement prompt to Gemini
   - Gemini modifies the image based on your instructions
   - Returns the refined version (~3-5 seconds)

4. **Iterate as needed**
   - You can refine multiple times
   - Each refinement builds on the previous result
   - The image evolves based on your instructions

### Saving Images

Once you're satisfied with the image:

1. **Add a descriptive label** (required)
   ```
   Example: "Python Course Hero Image"
   ```

2. **Add tags** for organization (optional)
   ```
   Examples: "course", "thumbnail", "python", "blue"
   ```

3. **Click "Accept & Save"**
   - Image is saved to Firestore Storage
   - Metadata (label, tags, prompt) saved to Firestore
   - Image appears in the Gallery with a permanent URL
   - You can now reference it in content creation

## UI Components

### Generation Panel

**Location:** Left side of "Image Generation" tab

**Features:**
- Upload reference image (optional)
- Text prompt input
- Generate button
- Generated image display
- Label and tags input
- Accept/Reject buttons
- **Refinement section** (blue highlighted box)

### Refinement Section (Improved UX)

**Visual Design:**
- 🔵 Blue background to indicate it's a different operation
- 🔄 RefreshCw icon to show it's iterating on existing content
- Clear label: "Refine This Image"
- Help text with examples
- Disabled state when generating
- Loading spinner during refinement

**Example Prompts Shown:**
```
"Make it brighter"
"Add soft shadows"
"Change to warmer colors"
```

### Image Gallery

**Location:** Right side of "Image Generation" tab

**Features:**
- Grid view of all saved images
- Search by label or prompt
- Filter by tags
- Select images for content creation
- Copy Firestore URL
- Delete images

## Technical Implementation

### Frontend Flow

```typescript
// Initial generation
handleGenerate() {
  formData.append('prompt', prompt);
  if (uploadedImage) {
    formData.append('image', uploadedImage);
  }

  fetch('/api/images/generate', { method: 'POST', body: formData });
}

// Refinement (follow-up)
handleFollowUp(refinementPrompt) {
  formData.append('prompt', refinementPrompt);
  formData.append('previousImageData', generatedImageUrl); // Current image

  fetch('/api/images/generate', { method: 'POST', body: formData });
}
```

### Backend Flow

```typescript
router.post('/generate', async (req, res) => {
  const { prompt, previousImageData } = req.body;
  const uploadedImage = req.file;

  let contents;

  if (uploadedImage || previousImageData) {
    // Image-to-image: Array format
    const base64Image = previousImageData
      ? extractBase64(previousImageData)
      : uploadedImage.buffer.toString('base64');

    contents = [
      { text: prompt },
      { inlineData: { mimeType: 'image/png', data: base64Image } }
    ];
  } else {
    // Text-to-image: String format
    contents = prompt + "\n\nRequirements:\n- High quality...";
  }

  const result = await model.generateContent(contents);
  // Extract and return image data
});
```

### Data Flow

```
User Action
    ↓
Frontend Component (image-generation-panel.tsx)
    ↓
API Call (/api/images/generate)
    ↓
Backend Route (routes/images.ts)
    ↓
Google Gemini API (gemini-2.5-flash-image)
    ↓
Base64 Image Response
    ↓
Display in UI / Save to Firestore
```

## Best Practices

### Prompt Writing

**For Initial Generation:**
- Be specific about style, colors, mood
- Include context (e.g., "for a course thumbnail")
- Mention any specific elements needed
- Example: "Modern office workspace with MacBook and coffee mug, natural lighting, minimalist style, blue and white color scheme"

**For Refinement:**
- Be specific about what to change
- Use comparative language ("brighter", "more", "less")
- One change at a time works better than multiple
- Bad: "Make it better"
- Good: "Increase brightness by 20% and add subtle shadows"

### Refinement Strategy

1. **Start broad** → Generate initial image
2. **Refine colors** → "Change to warmer tones"
3. **Adjust lighting** → "Make it brighter"
4. **Add details** → "Add soft shadows and highlights"
5. **Fine-tune** → "Slightly reduce contrast"

### Tags for Organization

Use consistent tagging:
- **Type:** `thumbnail`, `hero-image`, `diagram`, `icon`
- **Project:** `python-course`, `math-lesson`, `company-training`
- **Style:** `modern`, `professional`, `playful`, `minimal`
- **Color:** `blue`, `warm`, `monochrome`

## Troubleshooting

### "Image generation failed"

**Possible causes:**
1. API key not configured → Check `.env` file
2. Network timeout → Try again
3. Invalid prompt → Simplify your request
4. Rate limit reached → Wait a few moments

**Solution:**
```bash
# Check backend logs
cd packages/backend
# Restart if needed
npm run dev
```

### Refinement not working

**Common issues:**
1. No previous image → Must generate an image first
2. Empty refinement prompt → Add specific instructions
3. Browser cache → Refresh the page

### Image quality issues

**Tips:**
- Add "high quality", "professional", "4K" to prompts
- Use specific style keywords: "photorealistic", "illustration", "modern"
- Refine iteratively rather than trying to get perfect first try

## API Reference

### POST /api/images/generate

**Purpose:** Generate, transform, or enhance an image using Gemini with automatic mode detection

**Request:**
```typescript
Content-Type: multipart/form-data

Fields (at least one required):
- prompt: string (optional) - Description or modification instructions
- image: File (optional) - Uploaded image (reference or previous generation)

Mode Detection:
- prompt only → text-to-image
- image + prompt → image-to-image
- image only → image-enhancement
```

**Response:**
```typescript
{
  imageUrl: string,      // Data URL: "data:image/png;base64,..."
  description: string,   // Echo of the prompt
  prompt: string,        // Original prompt
  mode: string          // Detected mode: "text-to-image" | "image-to-image" | "image-enhancement"
}
```

**Example Usage:**
```typescript
// Mode 1: Text-to-image (text only)
const formData1 = new FormData();
formData1.append('prompt', 'Modern office workspace');
const response1 = await fetch('/api/images/generate', {
  method: 'POST',
  body: formData1
});
// Returns: { imageUrl: "data:...", mode: "text-to-image", ... }

// Mode 2: Image-to-image (image + text)
const blob = await fetch(previousImageUrl).then(r => r.blob());
const formData2 = new FormData();
formData2.append('prompt', 'Make it brighter and add soft shadows');
formData2.append('image', blob, 'image.png');
const response2 = await fetch('/api/images/generate', {
  method: 'POST',
  body: formData2
});
// Returns: { imageUrl: "data:...", mode: "image-to-image", ... }

// Mode 3: Image enhancement (image only)
const formData3 = new FormData();
formData3.append('image', uploadedFile);
// No prompt - will auto-enhance
const response3 = await fetch('/api/images/generate', {
  method: 'POST',
  body: formData3
});
// Returns: { imageUrl: "data:...", mode: "image-enhancement", ... }
```

### POST /api/images/save

**Purpose:** Save generated image to Firestore

**Request:**
```typescript
Content-Type: application/json

{
  imageUrl: string,        // Data URL or HTTP URL
  label: string,           // User-defined label
  tags: string[],          // Array of tags
  prompt: string,          // Generation prompt
  targetProject?: string   // Firebase project (default: 'iclean')
}
```

**Response:**
```typescript
{
  id: string,            // Unique image ID
  firestoreUrl: string,  // Permanent storage URL
  success: boolean
}
```

## Environment Variables

Required in `.env`:

```bash
# Gemini API for image generation
GEMINI_API_KEY=AIzaYourKeyHere
```

Get your key from: https://aistudio.google.com/app/apikey

## Model Information

**Model:** `gemini-2.5-flash-image`

**Capabilities:**
- Text-to-image generation
- Image-to-image transformation
- Iterative refinement
- High quality output
- Fast generation (~3-5 seconds)

**Supported Formats:**
- Input: Text prompts, PNG, JPG images
- Output: PNG (base64 encoded)

**Limitations:**
- Max prompt length: ~8K characters
- Image size: Optimized for web use
- Rate limits: Based on your API plan

## Future Enhancements

Potential improvements:
- [ ] Batch generation (multiple variations)
- [ ] Style presets (professional, playful, minimal, etc.)
- [ ] Aspect ratio selection
- [ ] Before/after comparison view
- [ ] Save refinement history
- [ ] Favorite/star system for best results
- [ ] Share images between users
- [ ] Integration with other image services (DALL-E, Midjourney)

---

**Reference Documentation:**
- [Google Gemini Image Generation Docs](https://ai.google.dev/gemini-api/docs/image-generation)
- [Gemini API Reference](https://ai.google.dev/api)
