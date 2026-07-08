> Extracted verbatim from CLAUDE.md on 2026-07-08. Update THIS file (not root CLAUDE.md) when shipping changes in this area.

## Gemini Image Generation

**IMPORTANT:** Always use `gemini-3-pro-image-preview` for ALL image generation tasks.

```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-3-pro-image-preview',  // ALWAYS use this model
  contents: prompt,
  config: {
    imageConfig: {
      aspectRatio: '16:9',  // or '1:1', '4:3', '9:16'
    }
  }
});

// Extract image from response
const imagePart = response.candidates?.[0]?.content?.parts?.find(
  (part) => part.inlineData
);

if (imagePart?.inlineData?.data) {
  const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
  // Save or use imageBuffer
}
```

**Use Cases:**
- Training infographics and visual aids
- Presentation backgrounds and slides
- Educational content visuals
- Whiteboard-style explanations
- Professional marketing materials

**Existing Service:** `packages/backend/src/services/gemini-image-generator.ts`
- `generateDirect()` - Direct prompt generation (recommended)
- `generateWhiteboard()` - Handwritten/whiteboard style content
- `generateImage()` - Educational backgrounds with NO TEXT enforcement

**Cost:** ~$0.039 per image
