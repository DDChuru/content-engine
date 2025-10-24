/**
 * Image generation and storage routes
 */

import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { uploadToFirebaseStorage, saveToFirestore } from '../services/firebase.js';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Generate image using Gemini (dynamic mode detection)
 *
 * The API automatically determines the generation mode based on the request:
 * - Text only → Text-to-image generation
 * - Image + text → Image-to-image transformation
 * - Image only → Enhancement/analysis
 *
 * This allows flexible usage:
 * - Initial generation with or without reference image
 * - Iterative refinement by sending previous result
 * - Upload reference and describe modifications
 *
 * @see https://ai.google.dev/gemini-api/docs/image-generation
 */
router.post('/generate', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const uploadedImage = req.file;

    // At least one input is required
    if ((!prompt || prompt.trim() === '') && !uploadedImage) {
      return res.status(400).json({
        error: 'At least a prompt or image is required'
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image'
    });

    let contents: any;
    let mode: string;

    // Dynamic mode detection based on what's in the request
    if (uploadedImage && prompt) {
      // Image + Text = Image-to-image transformation
      // Use case: "Here's my logo, make it more modern"
      // Use case: "Take this image and make it brighter"
      mode = 'image-to-image';

      const base64Image = uploadedImage.buffer.toString('base64');
      const mimeType = uploadedImage.mimetype;

      console.log(`[Image-to-Image] File: ${uploadedImage.originalname}, Prompt: "${prompt}"`);

      contents = [
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: base64Image
          }
        }
      ];
    } else if (uploadedImage && !prompt) {
      // Image only = Enhancement/description
      // Use case: "Enhance this image"
      mode = 'image-enhancement';

      const base64Image = uploadedImage.buffer.toString('base64');
      const mimeType = uploadedImage.mimetype;

      console.log(`[Image Enhancement] File: ${uploadedImage.originalname}`);

      contents = [
        { text: 'Enhance this image with improved quality, better lighting, and professional styling' },
        {
          inlineData: {
            mimeType,
            data: base64Image
          }
        }
      ];
    } else {
      // Text only = Text-to-image generation
      // Use case: "Create a modern office workspace"
      mode = 'text-to-image';

      console.log(`[Text-to-Image] Prompt: "${prompt}"`);

      contents = `${prompt}

Requirements:
- High quality, professional design
- Clear composition and good contrast
- Suitable for business/educational use
- Modern and clean aesthetic`;
    }

    // Generate image using Gemini
    const result = await model.generateContent(contents);
    const response = result.response;

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No image generated');
    }

    const parts = candidates[0].content.parts;
    const imagePart = parts.find((part: any) => part.inlineData);

    if (!imagePart || !imagePart.inlineData?.data) {
      throw new Error('No image data in response');
    }

    // Convert to base64 data URL
    const base64Data = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || 'image/png';
    const imageUrl = `data:${mimeType};base64,${base64Data}`;

    res.json({
      imageUrl,
      description: prompt,
      prompt,
      mode // Return the detected mode so clients know what operation was performed
    });

  } catch (error: any) {
    console.error('Image generation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Save image to Firestore Storage
 */
router.post('/save', async (req: Request, res: Response) => {
  try {
    const { imageUrl, label, tags, prompt, targetProject } = req.body;

    if (!imageUrl || !label) {
      return res.status(400).json({
        error: 'imageUrl and label are required'
      });
    }

    // Use default project or specified one
    const project = targetProject || 'iclean';
    const timestamp = Date.now();
    const imageId = `img_${timestamp}`;

    let firestoreUrl: string | undefined;

    // If it's a data URL, extract and upload
    if (imageUrl.startsWith('data:')) {
      const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        const extension = mimeType.split('/')[1] || 'png';
        firestoreUrl = await uploadToFirebaseStorage(
          project,
          buffer,
          `images/${imageId}.${extension}`,
          mimeType
        );
      }
    } else {
      // If it's already a URL, just save the metadata
      firestoreUrl = imageUrl;
    }

    // Save metadata to Firestore
    const metadata = {
      id: imageId,
      label,
      tags: tags || [],
      prompt: prompt || '',
      url: firestoreUrl,
      createdAt: new Date().toISOString()
    };

    await saveToFirestore(project, 'generated_images', metadata);

    res.json({
      id: imageId,
      firestoreUrl,
      success: true
    });

  } catch (error: any) {
    console.error('Image save error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Get all saved images
 */
router.get('/list', async (req: Request, res: Response) => {
  try {
    const { targetProject, limit = 50 } = req.query;
    const project = targetProject || 'iclean';

    // In production, fetch from Firestore
    // For now, return empty array
    res.json({
      images: [],
      message: 'Implement Firestore query to fetch images'
    });

  } catch (error: any) {
    console.error('Image list error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
